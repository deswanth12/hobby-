import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import http from 'http';

function createStaticServer(distDir, port) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff'
  };

  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/') reqPath = '/index.html';
    let filePath = path.join(distDir, reqPath);

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(distDir, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    try {
      const data = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    } catch (err) {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => {
      console.log(`Static server running at http://127.0.0.1:${port}`);
      resolve(server);
    });
  });
}

async function captureAfter() {
  const distDir = path.resolve('dist');
  const port = 4173;
  const server = await createStaticServer(distDir, port);

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const outDir = path.resolve('reports/polish');
  const artifactDir = 'C:\\Users\\k deswanth\\.gemini\\antigravity\\brain\\915eb0d1-0751-489f-a770-da815fa3ba6c\\screenshots';

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true });

  const profileDir = path.resolve('reports/edge-profile-after');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const debugPort = 9271;
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
    try { edgeProc.kill(); } catch (_) {}
    server.close();
    throw new Error('Could not connect to Edge DevTools');
  }

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const reqId = id++;
    const timer = setTimeout(() => reject(new Error('Timeout on ' + method)), 30000);
    const handler = evt => {
      const msg = JSON.parse(evt.data);
      if (msg.id === reqId) {
        ws.removeEventListener('message', handler);
        clearTimeout(timer);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: reqId, method, params }));
  });

  const viewports = [
    { name: 'after_1440', width: 1440, height: 900, mobile: false },
    { name: 'after_1280', width: 1280, height: 800, mobile: false },
    { name: 'after_768', width: 768, height: 1024, mobile: false },
    { name: 'after_390', width: 390, height: 844, mobile: true }
  ];

  try {
    await send('Page.enable');
    await send('DOM.enable');
    await send('Runtime.enable');

    for (const vp of viewports) {
      console.log(`Setting viewport ${vp.name} (${vp.width}x${vp.height})...`);
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.mobile
      });

      await send('Page.navigate', { url: `http://127.0.0.1:${port}/` });
      await new Promise(r => setTimeout(r, 4500));

      // Verify horizontal overflow
      const evalRes = await send('Runtime.evaluate', {
        expression: `({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
        })`,
        returnByValue: true
      });
      console.log(`Viewport ${vp.name} overflow check:`, evalRes.result?.value);

      const { data } = await send('Page.captureScreenshot', { format: 'png' });
      const localPath = path.join(outDir, `${vp.name}.png`);
      const artifactPath = path.join(artifactDir, `${vp.name}.png`);
      const buf = Buffer.from(data, 'base64');
      fs.writeFileSync(localPath, buf);
      fs.writeFileSync(artifactPath, buf);
      console.log(`Saved ${localPath} and ${artifactPath} (${buf.length} bytes)`);
    }
  } finally {
    ws.close();
    try { edgeProc.kill(); } catch (_) {}
    server.close();
  }
}

captureAfter().catch(err => {
  console.error(err);
  process.exit(1);
});
