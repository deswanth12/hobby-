import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const PORT = 4199;
const DIST_DIR = path.resolve('dist');

function startServer() {
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.ico': 'image/x-icon'
  };

  const server = http.createServer((req, res) => {
    let cleanPath = req.url.split('?')[0];
    if (cleanPath === '/') cleanPath = '/index.html';
    let filePath = path.join(DIST_DIR, cleanPath);

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    try {
      const content = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  return new Promise((resolve) => server.listen(PORT, '127.0.0.1', () => resolve(server)));
}

const SEED_ROUTES = [
  '/',
  '/about',
  '/services',
  '/services/audit-assurance',
  '/services/gst-consultant-tirupati',
  '/services/income-tax-consultant-tirupati',
  '/services/company-registration-tirupati',
  '/services/virtual-cfo-tirupati',
  '/services/rera-consultant-tirupati',
  '/industries',
  '/locations',
  '/contact',
  '/blog',
  '/blog/corporate-tax-planning-2026',
  '/blog/gst-annual-return-compliance',
  '/blog/statutory-audit-guidelines-2026'
];

async function main() {
  const server = await startServer();
  console.log(`Local test server running at http://127.0.0.1:${PORT}`);

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-link-local-temp');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const debugPort = 9291;
  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${debugPort}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  let ws = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
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
    server.close();
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

  for (const r of SEED_ROUTES) {
    const url = `http://127.0.0.1:${PORT}${r}`;
    await send('Page.navigate', { url });
    await new Promise(res => setTimeout(res, 1200));

    const evalResult = await send('Runtime.evaluate', {
      expression: `(() => {
        return Array.from(document.querySelectorAll('a[href]')).map(a => a.getAttribute('href') || '');
      })()`,
      returnByValue: true
    });

    const links = evalResult.result.value || [];
    for (const href of links) {
      if (href && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:')) {
        allDiscoveredLinks.add(href);
      }
    }
  }

  ws.close();
  edgeProc.kill();

  console.log(`Discovered ${allDiscoveredLinks.size} unique href targets.`);

  const checked = [];
  for (const href of allDiscoveredLinks) {
    if (href.startsWith('#')) continue;
    let urlToCheck;
    if (href.startsWith('/')) {
      urlToCheck = `http://127.0.0.1:${PORT}${href.split('#')[0]}`;
    } else if (href.startsWith('http://127.0.0.1') || href.startsWith('https://kavithaassociates.com')) {
      const parsed = new URL(href);
      urlToCheck = `http://127.0.0.1:${PORT}${parsed.pathname}`;
    } else {
      // External URL - skip or perform quick check
      continue;
    }

    try {
      const res = await fetch(urlToCheck);
      checked.push({ href, status: res.status, ok: res.status === 200 });
      console.log(`  [${res.status}] ${href} -> ${urlToCheck}`);
    } catch (e) {
      checked.push({ href, status: 0, error: e.message, ok: false });
      console.log(`  [ERR] ${href}: ${e.message}`);
    }
  }

  server.close();

  const broken = checked.filter(c => !c.ok);
  console.log(`\nLocal Internal Link Audit: ${checked.length} internal links tested. ${broken.length} broken.`);
  fs.writeFileSync('reports/local-link-audit.json', JSON.stringify({ total: checked.length, broken, checked }, null, 2));

  if (broken.length > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
