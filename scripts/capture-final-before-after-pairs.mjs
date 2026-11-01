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
    '.jpeg': 'image/jpeg',
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
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

async function capturePairs() {
  const LOCAL_PORT = 4230;
  const distDir = path.resolve('dist');
  const server = await createStaticServer(distDir, LOCAL_PORT);

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-pairs');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const beforeDir = path.resolve('reports/screenshots/before');
  const afterDir = path.resolve('reports/screenshots/after');
  const artifactDir = 'C:\\Users\\k deswanth\\.gemini\\antigravity\\brain\\031adcf1-285e-4f69-9361-407ff52cf036';

  if (!fs.existsSync(beforeDir)) fs.mkdirSync(beforeDir, { recursive: true });
  if (!fs.existsSync(afterDir)) fs.mkdirSync(afterDir, { recursive: true });
  if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true });

  const cdpPort = 9270;
  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${cdpPort}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  let ws = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${cdpPort}/json/list`);
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
    server.close();
    try { edgeProc.kill(); } catch (_) {}
    throw new Error('Could not connect to Edge');
  }

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const reqId = id++;
    const timer = setTimeout(() => reject(new Error('Timeout ' + method)), 15000);
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

  const targets = [
    { width: 320, height: 640, label: '320px' },
    { width: 360, height: 800, label: '360px' },
    { width: 390, height: 844, label: '390px' },
    { width: 412, height: 915, label: '412px' },
    { width: 1440, height: 900, label: '1440px' }
  ];

  console.log('Capturing Live Production (Before) and Latest Local Build (After)...');

  for (const t of targets) {
    console.log(`\n--- Viewport ${t.label} (${t.width}x${t.height}) ---`);

    await send('Emulation.setDeviceMetricsOverride', {
      width: t.width,
      height: t.height,
      deviceScaleFactor: 2,
      mobile: t.width < 1024
    });

    // 1. Live Production (Before)
    try {
      await send('Page.navigate', { url: 'https://kavithaassociates.com/' });
      await new Promise(r => setTimeout(r, 1200));
      const shotBefore = await send('Page.captureScreenshot', { format: 'png' });
      const beforeFile = path.join(beforeDir, `live-prod-${t.label}.png`);
      fs.writeFileSync(beforeFile, Buffer.from(shotBefore.data, 'base64'));
      fs.copyFileSync(beforeFile, path.join(artifactDir, `live-prod-${t.label}.png`));
      console.log(`  [BEFORE] Saved live-prod-${t.label}.png (${shotBefore.data.length} chars)`);
    } catch (e) {
      console.warn(`  [BEFORE FAIL]`, e.message);
    }

    // 2. Latest Local Production Build (After)
    try {
      await send('Page.navigate', { url: `http://127.0.0.1:${LOCAL_PORT}/` });
      await new Promise(r => setTimeout(r, 700));
      const shotAfter = await send('Page.captureScreenshot', { format: 'png' });
      const afterFile = path.join(afterDir, `latest-prod-${t.label}.png`);
      fs.writeFileSync(afterFile, Buffer.from(shotAfter.data, 'base64'));
      fs.copyFileSync(afterFile, path.join(artifactDir, `latest-prod-${t.label}.png`));
      console.log(`  [AFTER] Saved latest-prod-${t.label}.png (${shotAfter.data.length} chars)`);
    } catch (e) {
      console.warn(`  [AFTER FAIL]`, e.message);
    }
  }

  ws.close();
  server.close();
  try { edgeProc.kill(); } catch (_) {}
  console.log('\nAll before & after pairs captured and synced to artifact directory successfully.');
}

capturePairs().catch(err => {
  console.error(err);
  process.exit(1);
});
