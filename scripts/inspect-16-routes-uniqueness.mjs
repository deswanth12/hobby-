import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const PORT = 4220;
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

const ROUTES = [
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
  '/blog/statutory-audit-guidelines-2026',
  '/404-check'
];

async function main() {
  const server = await startServer();
  console.log(`Local test server running at http://127.0.0.1:${PORT}`);

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-unique-check-temp');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const debugPort = 9299;
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

  const pageData = [];

  for (const r of ROUTES) {
    const url = `http://127.0.0.1:${PORT}${r}`;
    await send('Page.navigate', { url });
    await new Promise(res => setTimeout(res, 1400));

    const evalResult = await send('Runtime.evaluate', {
      expression: `(() => {
        const title = document.title;
        const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || null;
        const h1s = Array.from(document.querySelectorAll('h1')).map(h => h.textContent.trim().replace(/\\s+/g, ' '));
        const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
        return { title, metaDesc, canonical, h1Count: h1s.length, h1Text: h1s[0] || null, robots };
      })()`,
      returnByValue: true
    });

    const info = evalResult.result.value;
    pageData.push({ route: r, ...info });
    console.log(`[ROUTE] ${r}`);
    console.log(`  Title: "${info.title}"`);
    console.log(`  Desc: "${info.metaDesc.slice(0, 50)}..."`);
    console.log(`  H1 (${info.h1Count}): "${info.h1Text}"`);
    console.log(`  Canonical: ${info.canonical}`);
    console.log(`  Robots: ${info.robots}\n`);
  }

  ws.close();
  edgeProc.kill();
  server.close();

  // Evaluate Uniqueness for the 16 canonical public routes (excluding 404)
  const canonicalRoutes = pageData.filter(p => p.route !== '/404-check');
  const uniqueTitles = new Set(canonicalRoutes.map(p => p.title));
  const uniqueDescs = new Set(canonicalRoutes.map(p => p.metaDesc));
  const uniqueCanonicals = new Set(canonicalRoutes.map(p => p.canonical));
  const allSingleH1 = pageData.every(p => p.h1Count === 1);
  const notFoundOk = pageData.find(p => p.route === '/404-check').canonical === null;

  console.log('=== UNIQUENESS AUDIT SUMMARY ===');
  console.log(`Total Canonical Routes Inspected: ${canonicalRoutes.length}`);
  console.log(`Unique Titles: ${uniqueTitles.size} / 16 (Pass=${uniqueTitles.size === 16})`);
  console.log(`Unique Descriptions: ${uniqueDescs.size} / 16 (Pass=${uniqueDescs.size === 16})`);
  console.log(`Unique Canonicals: ${uniqueCanonicals.size} / 16 (Pass=${uniqueCanonicals.size === 16})`);
  console.log(`Single H1 on Every Page: ${allSingleH1} (Pass=${allSingleH1})`);
  console.log(`404 Canonical Isolation (null): ${notFoundOk} (Pass=${notFoundOk})`);

  const passed = uniqueTitles.size === 16 && uniqueDescs.size === 16 && uniqueCanonicals.size === 16 && allSingleH1 && notFoundOk;
  fs.writeFileSync('reports/uniqueness-verification-report.json', JSON.stringify({ passed, pageData }, null, 2));

  if (!passed) process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
