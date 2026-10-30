import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

async function auditSEO() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-seo');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const port = 9277;
  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  let ws = null;
  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 300));
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

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const reqId = id++;
    const timer = setTimeout(() => reject(new Error('Timeout on ' + method)), 15000);
    const handler = evt => {
      const d = JSON.parse(evt.data);
      if (d.id === reqId) {
        clearTimeout(timer);
        ws.removeEventListener('message', handler);
        if (d.error) reject(new Error(d.error.message));
        else resolve(d.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: reqId, method, params }));
  });

  await send('Page.enable');
  await send('Runtime.enable');

  const sitemapXml = fs.readFileSync('public/sitemap.xml', 'utf8');
  const urls = [...sitemapXml.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g)].map(m => m[1]);

  console.log(`Found ${urls.length} URLs in sitemap.xml to inspect:`);

  const results = [];

  for (const url of urls) {
    console.log(`Navigating to ${url}...`);
    await send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 2000));

    const evalResult = await send('Runtime.evaluate', {
      expression: `(() => {
        const title = document.title;
        const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content');
        const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
        const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
        const ogDesc = document.querySelector('meta[property="og:description"]')?.getAttribute('content');
        const ogUrl = document.querySelector('meta[property="og:url"]')?.getAttribute('content');
        const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
        const ogType = document.querySelector('meta[property="og:type"]')?.getAttribute('content');
        const twitterCard = document.querySelector('meta[name="twitter:card"]')?.getAttribute('content');
        const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content');
        
        const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => {
          try { return JSON.parse(s.textContent); } catch (e) { return { parseError: e.message, raw: s.textContent }; }
        });

        const h1s = Array.from(document.querySelectorAll('h1')).map(h => h.textContent.trim());

        return {
          title,
          metaDesc,
          canonical,
          ogTitle,
          ogDesc,
          ogUrl,
          ogImage,
          ogType,
          twitterCard,
          robots,
          jsonLdCount: jsonLdScripts.length,
          jsonLd: jsonLdScripts,
          h1s
        };
      })()`,
      returnByValue: true
    });

    const data = evalResult.result.value;
    results.push({ url, ...data });
    console.log(`  ✓ ${url}`);
    console.log(`    Title: "${data.title}"`);
    console.log(`    Desc: "${data.metaDesc ? data.metaDesc.slice(0, 70) + '...' : 'NONE'}"`);
    console.log(`    Canonical: ${data.canonical || 'NONE'}`);
    console.log(`    JSON-LD: ${data.jsonLdCount} block(s)`);
  }

  ws.close();
  edgeProc.kill();

  const outDir = path.resolve('reports');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'seo_audit_browser_eval.json'), JSON.stringify(results, null, 2));
  console.log('Saved reports/seo_audit_browser_eval.json');
}

auditSEO().catch(err => {
  console.error(err);
  process.exit(1);
});
