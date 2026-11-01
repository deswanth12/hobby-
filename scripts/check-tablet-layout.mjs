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

async function runCheck() {
  const LOCAL_PORT = 4270;
  const distDir = path.resolve('dist');
  const server = await createStaticServer(distDir, LOCAL_PORT);

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const cdpPort = 9290;
  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${cdpPort}`,
    '--remote-allow-origins=*',
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  await new Promise(r => setTimeout(r, 1200));
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

  const targets = [
    { w: 600, h: 960, label: '600x960 Portrait' },
    { w: 768, h: 1024, label: '768x1024 Portrait' },
    { w: 820, h: 1180, label: '820x1180 Portrait' },
    { w: 834, h: 1112, label: '834x1112 Portrait' },
    { w: 1024, h: 768, label: '1024x768 Landscape' },
    { w: 1180, h: 820, label: '1180x820 Landscape' },
    { w: 1280, h: 800, label: '1280x800 Landscape' }
  ];

  for (const t of targets) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: t.w,
      height: t.h,
      deviceScaleFactor: 2,
      mobile: t.w < 1024,
      hasTouch: true
    });

    // Navigate and wait for load
    await new Promise(async (resolve) => {
      const handler = (evt) => {
        const d = JSON.parse(evt.data);
        if (d.method === 'Page.loadEventFired') {
          ws.removeEventListener('message', handler);
          resolve();
        }
      };
      ws.addEventListener('message', handler);
      await send('Page.navigate', { url: `http://127.0.0.1:${LOCAL_PORT}/` });
    });

    // Give React time to hydrate
    await new Promise(r => setTimeout(r, 600));

    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const docEl = document.documentElement;
        const body = document.body;
        const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
        const innerWidth = window.innerWidth;
        const hasOverflow = scrollWidth > innerWidth;

        // Navbar checks
        const nav = document.querySelector('nav');
        const logo = nav ? nav.querySelector('a[href="/"]') : null;
        const logoRect = logo ? logo.getBoundingClientRect() : null;

        const hamburgerBtn = document.querySelector('button[aria-label*="navigation" i]');
        const isHamburgerVisible = hamburgerBtn ? (hamburgerBtn.offsetParent !== null && window.getComputedStyle(hamburgerBtn.parentElement).display !== 'none') : false;

        const desktopNav = document.querySelector('.font-editorial-nav');
        const isDesktopNavVisible = desktopNav ? (desktopNav.offsetParent !== null && window.getComputedStyle(desktopNav).display !== 'none') : false;

        // Hero layout
        const heroSection = document.querySelector('section');
        const heroGrid = heroSection ? heroSection.querySelector('.grid') : null;
        const heroGridCols = heroGrid ? window.getComputedStyle(heroGrid).gridTemplateColumns : null;
        const leftCol = document.querySelector('[class*="col-span-7"]');
        const plaque = document.querySelector('.double-bezel-dark');
        const h1 = document.querySelector('h1');
        const h1Size = h1 ? window.getComputedStyle(h1).fontSize : null;

        const ctas = Array.from(document.querySelectorAll('a[href*="contact"], a[href*="services"]'))
          .filter(el => el.closest('[class*="col-span-7"]'))
          .map(el => ({ text: el.innerText.trim(), w: Math.round(el.offsetWidth), h: Math.round(el.offsetHeight) }));

        // Practice plaque sub-elements
        const plaqueStats = plaque ? Array.from(plaque.querySelectorAll('[class*="grid"] > div')).map(el => el.innerText.trim().replace(/\\n/g, ' ')) : [];

        // WhatsApp button
        const wa = document.querySelector('aside[aria-label*="WhatsApp" i]');
        const waRect = wa ? wa.getBoundingClientRect() : null;
        const waOpacity = wa ? window.getComputedStyle(wa).opacity : '0';

        return {
          viewport: '${t.label}',
          windowWidth: innerWidth,
          scrollWidth,
          hasOverflow,
          logoWidth: logoRect ? Math.round(logoRect.width) : 0,
          isHamburgerVisible,
          isDesktopNavVisible,
          heroGridCols: heroGridCols ? heroGridCols.split(' ').length + ' cols' : null,
          leftColWidth: leftCol ? Math.round(leftCol.offsetWidth) : 0,
          plaqueWidth: plaque ? Math.round(plaque.offsetWidth) : 0,
          h1Size,
          ctas,
          plaqueStatsCount: plaqueStats.length,
          wa: wa ? { visible: waOpacity !== '0', opacity: waOpacity } : null
        };
      })()`,
      returnByValue: true
    });

    console.log(`\n=== ${t.label} ===`);
    console.log(JSON.stringify(evalRes.result.value, null, 2));
  }

  ws.close();
  server.close();
  try { edgeProc.kill(); } catch (_) {}
}

runCheck().catch(console.error);
