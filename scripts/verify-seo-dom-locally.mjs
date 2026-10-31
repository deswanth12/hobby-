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

const ROUTES = [
  { path: '/', name: 'Homepage' },
  { path: '/about', name: 'About' },
  { path: '/services', name: 'Services Spectrum' },
  { path: '/services/audit-assurance', name: 'Audit & Assurance Spotlight' },
  { path: '/services/gst-consultant-tirupati', name: 'GST Consultant Tirupati' },
  { path: '/services/income-tax-consultant-tirupati', name: 'Income Tax Consultant Tirupati' },
  { path: '/services/company-registration-tirupati', name: 'Company Registration Tirupati' },
  { path: '/services/virtual-cfo-tirupati', name: 'Virtual CFO Tirupati' },
  { path: '/services/rera-consultant-tirupati', name: 'RERA Advisory Tirupati' },
  { path: '/industries', name: 'Industries' },
  { path: '/locations', name: 'Locations & Chambers' },
  { path: '/contact', name: 'Contact & Chambers' },
  { path: '/blog', name: 'Regulatory Insights' },
  { path: '/blog/corporate-tax-planning-2026', name: 'Article: Corporate Tax Planning' },
  { path: '/blog/gst-annual-return-compliance', name: 'Article: GST Annual Return Compliance' },
  { path: '/blog/statutory-audit-guidelines-2026', name: 'Article: Statutory Audit Guidelines' },
  { path: '/404-nonexistent-route', name: '404 Error Page' }
];

async function main() {
  const server = await startServer();
  console.log(`Local test server running at http://127.0.0.1:${PORT}`);

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-verify-temp');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const debugPort = 9290;
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

  let allChecksPassed = true;
  const verifications = [];

  for (const route of ROUTES) {
    const url = `http://127.0.0.1:${PORT}${route.path}`;
    await send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 1500));

    const evalResult = await send('Runtime.evaluate', {
      expression: `(() => {
        const title = document.title;
        const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || null;
        const h1Elements = Array.from(document.querySelectorAll('h1')).map(el => el.textContent.trim().replace(/\\s+/g, ' '));
        const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
        
        // Structured Data Scripts
        const jsonLdElements = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => {
          try {
            return { parsed: JSON.parse(s.textContent), error: null };
          } catch (e) {
            return { parsed: null, error: e.message };
          }
        });

        return {
          title,
          metaDesc,
          canonical,
          h1Count: h1Elements.length,
          h1s: h1Elements,
          robots,
          jsonLdCount: jsonLdElements.length,
          jsonLdValid: jsonLdElements.every(j => j.parsed !== null),
          jsonLdTypes: jsonLdElements.map(j => {
            if (!j.parsed) return 'INVALID';
            if (j.parsed['@graph']) return j.parsed['@graph'].map(g => g['@type']).join(' + ');
            return j.parsed['@type'];
          })
        };
      })()`,
      returnByValue: true
    });

    const data = evalResult.result.value;
    verifications.push({ route: route.path, name: route.name, ...data });

    // Assertions
    const is404 = route.path.includes('404');
    const h1Valid = data.h1Count === 1;
    const titleValid = data.title.length > 20 && data.title.length <= 80;
    const descValid = data.metaDesc.length >= 80 && data.metaDesc.length <= 180;
    const canonicalValid = is404 ? data.canonical === null : (data.canonical && data.canonical.startsWith('https://kavithaassociates.com'));
    const schemaValid = data.jsonLdValid && data.jsonLdCount >= 1;

    const pageOk = h1Valid && titleValid && descValid && canonicalValid && schemaValid;
    if (!pageOk) allChecksPassed = false;

    console.log(`[${pageOk ? 'PASS' : 'WARN'}] ${route.name} (${route.path})`);
    console.log(`  Title (${data.title.length} chars): "${data.title}"`);
    console.log(`  Desc (${data.metaDesc.length} chars): "${data.metaDesc.slice(0, 60)}..."`);
    console.log(`  H1 (${data.h1Count}): "${data.h1s[0] || 'NONE'}"`);
    console.log(`  Canonical: ${data.canonical || '(None - correct for 404)'}`);
    console.log(`  Schema (${data.jsonLdCount} scripts, valid=${data.jsonLdValid}): [${data.jsonLdTypes.join(', ')}]`);
    console.log('');
  }

  ws.close();
  edgeProc.kill();
  server.close();

  fs.writeFileSync('reports/post-optimization-verification.json', JSON.stringify({ allChecksPassed, verifications }, null, 2));
  console.log(`Verification completed. All checks passed: ${allChecksPassed}`);
  if (!allChecksPassed) process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
