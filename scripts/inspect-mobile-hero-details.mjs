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

async function inspectMobileHero() {
  const PORT = 4220;
  const distDir = path.resolve('dist');
  const server = await createStaticServer(distDir, PORT);

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-hero-inspect');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const cdpPort = 9260;
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
    { width: 320, height: 640, name: '320x640' },
    { width: 360, height: 800, name: '360x800' },
    { width: 375, height: 812, name: '375x812' },
    { width: 390, height: 844, name: '390x844' },
    { width: 412, height: 915, name: '412x915' },
    { width: 430, height: 932, name: '430x932' },
    { width: 768, height: 1024, name: '768x1024' },
    { width: 1024, height: 768, name: '1024x768' },
    { width: 1440, height: 900, name: '1440x900' }
  ];

  const results = [];

  for (const vp of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: vp.width < 1024
    });

    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
    await new Promise(r => setTimeout(r, 600));

    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const doc = document.documentElement;
        const body = document.body;
        const heroSection = document.querySelector('section');
        const h1 = document.querySelector('h1');
        const h1Sub = h1 ? h1.querySelector('span:last-child') : null;
        const para = heroSection ? heroSection.querySelector('p') : null;
        const ctaContainer = para ? para.nextElementSibling : null;
        const ctaButtons = ctaContainer ? Array.from(ctaContainer.children) : [];
        const trustStrip = heroSection ? heroSection.querySelector('div.border-t') : null;
        const navbar = document.querySelector('header');
        const brandMark = navbar ? navbar.querySelector('a') : null;
        const hamburger = navbar ? navbar.querySelector('button[aria-label="Toggle navigation menu"]') : null;

        const heroStyle = heroSection ? window.getComputedStyle(heroSection) : {};
        const h1Style = h1 ? window.getComputedStyle(h1) : {};
        const h1SubStyle = h1Sub ? window.getComputedStyle(h1Sub) : {};
        const paraStyle = para ? window.getComputedStyle(para) : {};

        return {
          viewport: { width: window.innerWidth, height: window.innerHeight },
          docOverflow: {
            scrollWidth: doc.scrollWidth,
            clientWidth: doc.clientWidth,
            hasOverflow: doc.scrollWidth > doc.clientWidth
          },
          bodyOverflow: {
            scrollWidth: body.scrollWidth,
            clientWidth: body.clientWidth,
            hasOverflow: body.scrollWidth > body.clientWidth
          },
          navbar: {
            height: navbar ? navbar.offsetHeight : 0,
            brandWidth: brandMark ? brandMark.offsetWidth : 0,
            hamburgerTouchTarget: hamburger ? { w: hamburger.offsetWidth, h: hamburger.offsetHeight } : null
          },
          hero: {
            paddingTop: heroStyle.paddingTop,
            paddingBottom: heroStyle.paddingBottom,
            h1FontSize: h1Style.fontSize,
            h1LineHeight: h1Style.lineHeight,
            h1Height: h1 ? h1.offsetHeight : 0,
            h1SubFontSize: h1SubStyle.fontSize,
            paraFontSize: paraStyle.fontSize,
            paraLineHeight: paraStyle.lineHeight,
            paraWidth: para ? para.offsetWidth : 0,
            ctaCount: ctaButtons.length,
            ctaHeights: ctaButtons.map(b => b.offsetHeight),
            ctaWidths: ctaButtons.map(b => b.offsetWidth),
            trustStripHeight: trustStrip ? trustStrip.offsetHeight : 0
          }
        };
      })()`,
      returnByValue: true
    });

    results.push({ name: vp.name, data: evalRes.result?.value });
  }

  console.log(JSON.stringify(results, null, 2));

  ws.close();
  server.close();
  try { edgeProc.kill(); } catch (_) {}
}

inspectMobileHero().catch(err => {
  console.error(err);
  process.exit(1);
});
