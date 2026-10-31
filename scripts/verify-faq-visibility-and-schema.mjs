import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const PORT = 4205;
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

const FAQ_ROUTES = [
  '/',
  '/services/gst-consultant-tirupati',
  '/services/income-tax-consultant-tirupati',
  '/services/company-registration-tirupati',
  '/services/virtual-cfo-tirupati',
  '/services/rera-consultant-tirupati'
];

async function main() {
  const server = await startServer();
  console.log(`Local test server running at http://127.0.0.1:${PORT}`);

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-faq-verify-temp');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const debugPort = 9297;
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

  let allFaqsVisible = true;
  const auditReport = [];

  for (const r of FAQ_ROUTES) {
    const url = `http://127.0.0.1:${PORT}${r}`;
    await send('Page.navigate', { url });
    await new Promise(res => setTimeout(res, 1500));

    const evalResult = await send('Runtime.evaluate', {
      expression: `(() => {
        const bodyText = document.body.textContent;
        const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => {
          try {
            return JSON.parse(s.textContent);
          } catch {
            return null;
          }
        });

        // Find FAQPage entity in jsonLd
        const faqEntities = [];
        for (const j of jsonLdScripts) {
          if (!j) continue;
          if (j['@type'] === 'FAQPage') faqEntities.push(j);
          if (j['@graph']) {
            for (const g of j['@graph']) {
              if (g['@type'] === 'FAQPage') faqEntities.push(g);
            }
          }
        }

        const verification = [];
        for (const entity of faqEntities) {
          const mainEntity = entity.mainEntity || [];
          for (const item of mainEntity) {
            const question = item.name || '';
            const answer = item.acceptedAnswer?.text || '';
            // Match substring of question
            const qInDom = bodyText.includes(question.trim().slice(0, 30));
            // Match substring of answer (first 30 characters)
            const aInDom = bodyText.includes(answer.trim().slice(0, 30));
            verification.push({
              question,
              qInDom,
              aInDom,
              answerSnippet: answer.slice(0, 60)
            });
          }
        }

        return {
          route: '${r}',
          faqEntitiesFound: faqEntities.length,
          faqCount: verification.length,
          verification
        };
      })()`,
      returnByValue: true
    });

    const data = evalResult.result.value;
    auditReport.push(data);

    const missing = data.verification.filter(v => !v.qInDom || !v.aInDom);
    const pass = data.faqCount > 0 && missing.length === 0;
    if (!pass) allFaqsVisible = false;

    console.log(`[${pass ? 'PASS' : 'FAIL'}] ${r}`);
    console.log(`  FAQ Entities: ${data.faqEntitiesFound}, Questions & Answers verified in DOM: ${data.faqCount}`);
    if (missing.length > 0) {
      console.log(`  WARNING: ${missing.length} FAQs not clearly found in DOM body text!`);
      missing.forEach(m => console.log(`    - Q: "${m.question}" (Q found=${m.qInDom}, A found=${m.aInDom})`));
    }
    console.log('');
  }

  ws.close();
  edgeProc.kill();
  server.close();

  fs.writeFileSync('reports/faq-dom-visibility-audit.json', JSON.stringify({ allFaqsVisible, auditReport }, null, 2));
  console.log(`FAQ DOM Visibility Verification Completed. All visible in DOM: ${allFaqsVisible}`);
  if (!allFaqsVisible) process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
