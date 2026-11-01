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

async function measureNav() {
  const LOCAL_PORT = 4280;
  const distDir = path.resolve('dist');
  const server = await createStaticServer(distDir, LOCAL_PORT);

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const cdpPort = 9295;
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

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 800,
    deviceScaleFactor: 2,
    mobile: false
  });

  await send('Page.navigate', { url: `http://127.0.0.1:${LOCAL_PORT}/` });
  
  for (let i = 0; i < 50; i++) {
    await new Promise(r => setTimeout(r, 100));
    const chk = await send('Runtime.evaluate', { expression: '!!document.querySelector("nav") && !!document.querySelector("h1")' });
    if (chk.result && chk.result.value) break;
  }

  const evalRes = await send('Runtime.evaluate', {
    expression: `(() => {
      try {
        const nav = document.querySelector('nav');
        const logo = nav ? nav.querySelector('a[href="/"]') : null;
        const linksContainer = document.querySelector('.font-editorial-nav');
        const allNavDivs = nav ? Array.from(nav.children) : [];
        const actionsContainer = allNavDivs.length > 2 ? allNavDivs[2] : null;
        const hamburgerCluster = allNavDivs.length > 3 ? allNavDivs[3] : (allNavDivs.find(d => d.className.includes('xl:hidden')) || null);

        const links = linksContainer ? Array.from(linksContainer.children).map(c => ({
          text: c.innerText.trim(),
          w: Math.round(c.offsetWidth),
          top: Math.round(c.getBoundingClientRect().top)
        })) : [];

        return {
          navWidth: nav ? nav.offsetWidth : 0,
          logoWidth: logo ? Math.round(logo.offsetWidth) : 0,
          linksContainerWidth: linksContainer ? Math.round(linksContainer.offsetWidth) : 0,
          actionsContainerWidth: actionsContainer ? Math.round(actionsContainer.offsetWidth) : 0,
          hamburgerDisplay: hamburgerCluster ? window.getComputedStyle(hamburgerCluster).display : null,
          linksCount: links.length,
          links,
          allOnSameLine: links.length > 0 ? links.every(l => l.top === links[0]?.top) : false
        };
      } catch (e) {
        return { error: e.message };
      }
    })()`,
    returnByValue: true
  });

  console.log('Nav at 1280px:', JSON.stringify(evalRes.result.value, null, 2));

  ws.close();
  server.close();
  try { edgeProc.kill(); } catch (_) {}
}

measureNav().catch(console.error);
