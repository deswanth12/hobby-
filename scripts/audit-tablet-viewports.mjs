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

async function auditTablet() {
  const LOCAL_PORT = 4240;
  const distDir = path.resolve('dist');
  const server = await createStaticServer(distDir, LOCAL_PORT);

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-tablet');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const outDir = path.resolve('reports/screenshots/tablet');
  const artifactDir = 'C:\\Users\\k deswanth\\.gemini\\antigravity\\brain\\031adcf1-285e-4f69-9361-407ff52cf036';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const cdpPort = 9275;
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

  const viewports = [
    { width: 600, height: 960, orientation: 'portrait', name: '600x960' },
    { width: 768, height: 1024, orientation: 'portrait', name: '768x1024' },
    { width: 820, height: 1180, orientation: 'portrait', name: '820x1180' },
    { width: 834, height: 1112, orientation: 'portrait', name: '834x1112' },
    { width: 1024, height: 768, orientation: 'landscape', name: '1024x768' },
    { width: 1180, height: 820, orientation: 'landscape', name: '1180x820' },
    { width: 1280, height: 800, orientation: 'landscape', name: '1280x800' }
  ];

  const routes = [
    { path: '/', label: 'home' },
    { path: '/about', label: 'about' },
    { path: '/services', label: 'services' },
    { path: '/audit-assurance', label: 'audit' },
    { path: '/industries', label: 'industries' },
    { path: '/locations', label: 'locations' },
    { path: '/blog', label: 'blog' },
    { path: '/contact', label: 'contact' },
    { path: '/admin', label: 'admin' }
  ];

  const auditReport = [];

  console.log('=== STARTING TABLET RESPONSIVE AUDIT ===\n');

  for (const vp of viewports) {
    console.log(`\n--------------------------------------------------`);
    console.log(`Auditing Viewport: ${vp.name} (${vp.orientation.toUpperCase()})`);
    console.log(`--------------------------------------------------`);

    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: true,
      hasTouch: true
    });

    const vpResults = {
      viewport: vp.name,
      orientation: vp.orientation,
      width: vp.width,
      height: vp.height,
      routes: {}
    };

    for (const r of routes) {
      await send('Page.navigate', { url: `http://127.0.0.1:${LOCAL_PORT}${r.path}` });
      await new Promise(res => setTimeout(res, 600));

      const evalRes = await send('Runtime.evaluate', {
        expression: `(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          const innerWidth = window.innerWidth;
          const hasHorizontalOverflow = scrollWidth > innerWidth;
          const overflowDiff = scrollWidth - innerWidth;

          // Header inspection
          const nav = document.querySelector('nav');
          const navRect = nav ? nav.getBoundingClientRect() : null;
          const hamburgerBtn = document.querySelector('button[aria-label*="navigation" i], button[aria-label*="menu" i]');
          const desktopNav = document.querySelector('.font-editorial-nav');
          const isDesktopNavVisible = desktopNav ? window.getComputedStyle(desktopNav).display !== 'none' : false;
          const isHamburgerVisible = hamburgerBtn ? window.getComputedStyle(hamburgerBtn).display !== 'none' : false;

          // Hero elements (if homepage)
          let heroDetails = null;
          if (location.pathname === '/') {
            const h1 = document.querySelector('h1');
            const heroPlaque = document.querySelector('.double-bezel-dark');
            const ctaButtons = Array.from(document.querySelectorAll('a[href*="contact"], a[href*="services"]'))
              .filter(el => el.offsetHeight > 0)
              .map(el => ({ text: el.innerText.trim(), width: el.offsetWidth, height: el.offsetHeight }));
            
            heroDetails = {
              h1Text: h1 ? h1.innerText.split('\\n')[0] : null,
              h1FontSize: h1 ? window.getComputedStyle(h1).fontSize : null,
              h1LineHeight: h1 ? window.getComputedStyle(h1).lineHeight : null,
              plaqueWidth: heroPlaque ? heroPlaque.offsetWidth : null,
              ctaCount: ctaButtons.length,
              ctas: ctaButtons
            };
          }

          // WhatsApp button check
          const wa = document.querySelector('aside[aria-label*="WhatsApp" i]');
          let waVisible = false;
          let waOpacity = '0';
          if (wa) {
            const style = window.getComputedStyle(wa);
            waOpacity = style.opacity;
            waVisible = style.display !== 'none' && style.visibility !== 'hidden' && parseFloat(style.opacity) > 0;
          }

          return {
            scrollWidth,
            innerWidth,
            hasHorizontalOverflow,
            overflowDiff,
            headerHeight: navRect ? navRect.height : 0,
            isDesktopNavVisible,
            isHamburgerVisible,
            heroDetails,
            waVisible,
            waOpacity
          };
        })()`,
        returnByValue: true
      });

      const metrics = evalRes.result.value;
      vpResults.routes[r.label] = metrics;

      console.log(`  [Route ${r.label}] Overflow: ${metrics.hasHorizontalOverflow ? 'FAIL (' + metrics.overflowDiff + 'px)' : 'PASS (0px)'} | Nav: ${metrics.isDesktopNavVisible ? 'Desktop' : 'Mobile Drawer'} | Hdr: ${Math.round(metrics.headerHeight)}px`);

      // Capture screenshot for home
      if (r.label === 'home') {
        const shot = await send('Page.captureScreenshot', { format: 'png' });
        const filePath = path.join(outDir, `tablet-${vp.name}.png`);
        fs.writeFileSync(filePath, Buffer.from(shot.data, 'base64'));
        fs.copyFileSync(filePath, path.join(artifactDir, `tablet-${vp.name}.png`));
      }
    }

    auditReport.push(vpResults);
  }

  // Save audit report
  fs.writeFileSync(
    path.resolve('reports/tablet-audit-report.json'),
    JSON.stringify(auditReport, null, 2)
  );

  ws.close();
  server.close();
  try { edgeProc.kill(); } catch (_) {}
  console.log('\nAudit complete! Saved reports/tablet-audit-report.json and tablet screenshots.');
}

auditTablet().catch(err => {
  console.error(err);
  process.exit(1);
});
