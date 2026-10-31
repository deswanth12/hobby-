import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const TARGET_HOST = 'https://kavithaassociates.com';

const ROUTES = [
  '/',
  '/about',
  '/services',
  '/services/audit-assurance',
  '/industries',
  '/locations',
  '/contact',
  '/blog',
  '/blog/corporate-tax-planning-2026',
  '/blog/gst-annual-return-compliance',
  '/blog/statutory-audit-guidelines-2026'
];

async function checkBrokenLinks() {
  console.log('Auditing internal and external links across all routes...');

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-links-temp');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const port = 9289;
  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  let ws = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      const tabs = await res.json();
      const target = tabs.find(t => t.type === 'page');
      if (target) {
        ws = new WebSocket(target.webSocketDebuggerUrl);
        await new Promise(r => { ws.onopen = r; });
        break;
      }
    } catch (_) {}
  }

  if (!ws) {
    edgeProc.kill();
    throw new Error('Edge connection failed');
  }

  let reqId = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = reqId++;
    const timer = setTimeout(() => reject(new Error('Timeout on ' + method)), 15000);
    const handler = (evt) => {
      const d = JSON.parse(evt.data);
      if (d.id === id) {
        clearTimeout(timer);
        ws.removeEventListener('message', handler);
        if (d.error) reject(new Error(d.error.message));
        else resolve(d.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });

  await send('Page.enable');
  await send('Runtime.enable');

  const allDiscoveredLinks = new Set();
  const internalRouteLinks = new Map();

  for (const r of ROUTES) {
    const url = `${TARGET_HOST}${r}`;
    await send('Page.navigate', { url });
    await new Promise(res => setTimeout(res, 1800));

    const evalResult = await send('Runtime.evaluate', {
      expression: `(() => {
        return Array.from(document.querySelectorAll('a[href]')).map(a => ({
          href: a.getAttribute('href') || '',
          text: a.textContent.trim().replace(/\\s+/g, ' ')
        }));
      })()`,
      returnByValue: true
    });

    const links = evalResult.result.value || [];
    internalRouteLinks.set(r, links);

    for (const link of links) {
      if (link.href && !link.href.startsWith('#') && !link.href.startsWith('mailto:') && !link.href.startsWith('tel:') && !link.href.startsWith('javascript:')) {
        allDiscoveredLinks.add(link.href);
      }
    }
  }

  ws.close();
  edgeProc.kill();

  console.log(`Total unique links discovered: ${allDiscoveredLinks.size}`);

  const linkStatuses = [];
  for (const rawHref of allDiscoveredLinks) {
    let fullUrl = rawHref;
    if (rawHref.startsWith('/')) {
      fullUrl = `${TARGET_HOST}${rawHref}`;
    }

    try {
      const res = await fetch(fullUrl, {
        method: 'HEAD',
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SEO-Audit-Bot' }
      });
      linkStatuses.push({ href: rawHref, fullUrl, status: res.status, ok: res.status < 400 });
      console.log(`  [${res.status}] ${rawHref}`);
    } catch (e) {
      // Retry with GET if HEAD fails
      try {
        const getRes = await fetch(fullUrl, {
          method: 'GET',
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SEO-Audit-Bot' }
        });
        linkStatuses.push({ href: rawHref, fullUrl, status: getRes.status, ok: getRes.status < 400 });
        console.log(`  [${getRes.status} GET] ${rawHref}`);
      } catch (err2) {
        linkStatuses.push({ href: rawHref, fullUrl, status: 0, error: err2.message, ok: false });
        console.log(`  [ERR] ${rawHref}: ${err2.message}`);
      }
    }
  }

  const broken = linkStatuses.filter(l => !l.ok);
  console.log(`\nLink Check Summary: ${linkStatuses.length} checked, ${broken.length} broken.`);
  if (broken.length > 0) {
    console.log('Broken links found:');
    broken.forEach(b => console.log(`  ✗ ${b.href} (${b.status || b.error})`));
  }

  fs.writeFileSync('reports/broken-link-audit.json', JSON.stringify({ total: linkStatuses.length, broken, linkStatuses }, null, 2));
}

checkBrokenLinks().catch(err => {
  console.error(err);
  process.exit(1);
});
