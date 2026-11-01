import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

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

async function inspect() {
  const LOCAL_PORT = 4250;
  const distDir = path.resolve('dist');
  const server = await createStaticServer(distDir, LOCAL_PORT);

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const cdpPort = 9280;
  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${cdpPort}`,
    '--remote-allow-origins=*',
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  await new Promise(r => setTimeout(r, 1000));
  const res = await fetch(`http://127.0.0.1:${cdpPort}/json/list`);
  const tabs = await res.json();
  const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);
  await new Promise(r => { ws.onopen = r; });

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const reqId = id++;
    const handler = evt => {
      const d = JSON.parse(evt.data);
      if (d.id === reqId) {
        ws.removeEventListener('message', handler);
        resolve(d.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: reqId, method, params }));
  });

  await send('Page.enable');
  await send('Runtime.enable');

  const checkVp = async (width, height, label) => {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 2, mobile: true });
    await send('Page.navigate', { url: `http://127.0.0.1:${LOCAL_PORT}/` });
    await new Promise(r => setTimeout(r, 600));

    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        try {
          const plaque = document.querySelector('.double-bezel-dark');
          const heroLeft = document.querySelector('[class*="col-span-7"]');
          const desktopNav = document.querySelector('.font-editorial-nav');
          const mobileBtn = document.querySelector('button[aria-label*="navigation" i]');
          const wa = document.querySelector('aside[aria-label*="WhatsApp" i]');
          const ctas = Array.from(document.querySelectorAll('a[href*="contact"], a[href*="services"]'))
            .filter(el => el.closest('[class*="col-span-7"]'))
            .map(el => ({ text: el.innerText.trim(), w: el.offsetWidth, h: el.offsetHeight }));

          const navParent = document.querySelector('nav');
          const brandMark = navParent ? navParent.querySelector('a[href="/"]') : null;
          const brandMarkRect = brandMark ? brandMark.getBoundingClientRect() : null;

          const headerDirectCall = document.querySelector('a[aria-label*="Call +91"]');
          const isHeaderCallVisible = headerDirectCall ? window.getComputedStyle(headerDirectCall).display !== 'none' : false;

          return {
            viewport: '${label}',
            width: window.innerWidth,
            height: window.innerHeight,
            brandMarkWidth: brandMarkRect ? Math.round(brandMarkRect.width) : 0,
            desktopNavVisible: desktopNav ? window.getComputedStyle(desktopNav).display !== 'none' : false,
            mobileBtnVisible: mobileBtn ? window.getComputedStyle(mobileBtn).display !== 'none' : false,
            isHeaderCallVisible,
            heroLeft: heroLeft ? { w: Math.round(heroLeft.offsetWidth), h: Math.round(heroLeft.offsetHeight) } : null,
            plaque: plaque ? { w: Math.round(plaque.offsetWidth), h: Math.round(plaque.offsetHeight) } : null,
            wa: wa ? {
              rect: wa.getBoundingClientRect(),
              opacity: window.getComputedStyle(wa).opacity,
              pointerEvents: window.getComputedStyle(wa).pointerEvents
            } : null,
            ctas
          };
        } catch (e) {
          return { error: e.message, stack: e.stack };
        }
      })()`,
      returnByValue: true
    });
    console.log(`\n=== VIEWPORT: ${label} (${width}x${height}) ===`);
    console.log(JSON.stringify(evalRes.result.value, null, 2));
  };

  await checkVp(600, 960, '600x960 Portrait');
  await checkVp(768, 1024, '768x1024 Portrait');
  await checkVp(820, 1180, '820x1180 Portrait');
  await checkVp(834, 1112, '834x1112 Portrait');
  await checkVp(1024, 768, '1024x768 Landscape');
  await checkVp(1180, 820, '1180x820 Landscape');
  await checkVp(1280, 800, '1280x800 Landscape');

  ws.close();
  server.close();
  try { edgeProc.kill(); } catch (_) {}
}

inspect().catch(console.error);
