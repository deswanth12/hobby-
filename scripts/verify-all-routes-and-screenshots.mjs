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

async function verifyAllRoutes() {
  const PORT = 4225;
  const distDir = path.resolve('dist');
  const server = await createStaticServer(distDir, PORT);
  console.log(`[Static Server] Running on http://127.0.0.1:${PORT}`);

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-comprehensive-mobile');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const outScreenshots = path.resolve('reports/screenshots/after');
  if (!fs.existsSync(outScreenshots)) {
    fs.mkdirSync(outScreenshots, { recursive: true });
  }

  const cdpPort = 9265;
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
    { width: 320, height: 640, label: '320px', name: 'Small Mobile 320x640' },
    { width: 360, height: 800, label: '360px', name: 'Android Standard 360x800' },
    { width: 375, height: 812, label: '375px', name: 'iPhone SE 375x812' },
    { width: 390, height: 844, label: '390px', name: 'iPhone 14/15 390x844' },
    { width: 412, height: 915, label: '412px', name: 'Pixel 7 / Galaxy 412x915' },
    { width: 430, height: 932, label: '430px', name: 'iPhone Pro Max 430x932' },
    { width: 768, height: 1024, label: '768px', name: 'iPad Portrait 768x1024' },
    { width: 1024, height: 768, label: '1024px', name: 'iPad Landscape 1024x768' },
    { width: 1440, height: 900, label: '1440px', name: 'Desktop Large 1440x900' }
  ];

  const routes = [
    { path: '/', name: 'Home' },
    { path: '/about', name: 'About' },
    { path: '/services', name: 'Services' },
    { path: '/services/audit-assurance', name: 'Audit & Assurance' },
    { path: '/industries', name: 'Industries' },
    { path: '/locations', name: 'Locations' },
    { path: '/blog', name: 'Blog' },
    { path: '/blog/corporate-tax-planning-2026', name: 'Blog Article' },
    { path: '/contact', name: 'Contact' },
    { path: '/non-existent-route-for-testing-404', name: '404' },
    { path: '/sec-ca-8f2a9c1e7d4b6/login', name: 'Admin Login' }
  ];

  const report = {
    testedAt: new Date().toISOString(),
    viewportsTested: viewports.length,
    routesTested: routes.length,
    viewportResults: [],
    routeResults: [],
    mobileDrawerVerified: false,
    formVerified: false
  };

  console.log(`\n=== 1. TESTING ALL 9 VIEWPORTS ON HOMEPAGE ===`);
  for (const vp of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: vp.width < 1024
    });

    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
    await new Promise(r => setTimeout(r, 600));

    // Capture screenshot
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const shotPath = path.join(outScreenshots, `homepage-${vp.label}.png`);
    fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));

    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const doc = document.documentElement;
        const body = document.body;
        const h1 = document.querySelector('h1');
        const ctaBtns = Array.from(document.querySelectorAll('section:first-of-type button, section:first-of-type a.btn-pill-primary, section:first-of-type a.btn-pill-secondary, section:first-of-type a[href^="tel:"]'));
        return {
          scrollWidth: doc.scrollWidth,
          clientWidth: doc.clientWidth,
          hasDocOverflow: doc.scrollWidth > doc.clientWidth,
          hasBodyOverflow: body.scrollWidth > body.clientWidth,
          h1Text: h1 ? h1.innerText.replace(/\\n/g, ' ') : '',
          h1OffsetHeight: h1 ? h1.offsetHeight : 0,
          ctaHeights: ctaBtns.map(b => b.offsetHeight)
        };
      })()`,
      returnByValue: true
    });

    const res = evalRes.result?.value;
    const passed = !res.hasDocOverflow && !res.hasBodyOverflow;
    console.log(`[${vp.name}] Overflow: ${passed ? 'PASS (0px)' : 'FAIL'} | H1 Height: ${res.h1OffsetHeight}px | CTAs: ${JSON.stringify(res.ctaHeights)}`);

    report.viewportResults.push({
      viewport: vp.name,
      dimensions: `${vp.width}x${vp.height}`,
      passed,
      scrollWidth: res.scrollWidth,
      clientWidth: res.clientWidth,
      screenshot: `homepage-${vp.label}.png`
    });
  }

  console.log(`\n=== 2. TESTING ALL 11 ROUTES AT MOBILE 360x800 ===`);
  await send('Emulation.setDeviceMetricsOverride', {
    width: 360,
    height: 800,
    deviceScaleFactor: 2,
    mobile: true
  });

  for (const r of routes) {
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}${r.path}` });
    await new Promise(r => setTimeout(r, 600));

    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const doc = document.documentElement;
        const body = document.body;
        const heading = document.querySelector('h1, h2');
        return {
          scrollWidth: doc.scrollWidth,
          clientWidth: doc.clientWidth,
          hasOverflow: doc.scrollWidth > doc.clientWidth,
          headingFound: !!heading,
          headingText: heading ? heading.innerText.substring(0, 40) : ''
        };
      })()`,
      returnByValue: true
    });

    const res = evalRes.result?.value;
    const cleanSlug = r.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const shotPath = path.join(outScreenshots, `${cleanSlug}-360px.png`);
    fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));

    console.log(`Route [${r.name}] (${r.path}) -> Overflow: ${!res.hasOverflow ? 'PASS' : 'FAIL'} (${res.scrollWidth}/${res.clientWidth})`);
    report.routeResults.push({
      route: r.name,
      path: r.path,
      passed: !res.hasOverflow && res.headingFound,
      scrollWidth: res.scrollWidth,
      clientWidth: res.clientWidth
    });
  }

  console.log(`\n=== 3. TESTING MOBILE NAVIGATION DRAWER INTERACTION ===`);
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await new Promise(r => setTimeout(r, 500));

  const drawerTest = await send('Runtime.evaluate', {
    expression: `(async () => {
      const toggle = document.querySelector('button[aria-label="Toggle navigation menu"]');
      if (!toggle) return { error: 'Toggle button not found' };
      toggle.click();
      await new Promise(r => setTimeout(r, 400));
      const drawer = document.querySelector('[role="dialog"][aria-label="Mobile Navigation Drawer"]');
      const bodyLocked = document.body.style.overflow === 'hidden';
      const drawerVisible = drawer && window.getComputedStyle(drawer).visibility !== 'hidden';
      
      // Close drawer
      const closeBtn = drawer ? drawer.querySelector('button[aria-label="Close navigation menu"]') : null;
      if (closeBtn) closeBtn.click();
      await new Promise(r => setTimeout(r, 400));
      const bodyUnlocked = document.body.style.overflow === '';

      return {
        toggleFound: !!toggle,
        drawerOpens: drawerVisible,
        bodyLocked,
        bodyUnlocked
      };
    })()`,
    awaitPromise: true,
    returnByValue: true
  });

  const drawerResult = drawerTest.result?.value;
  console.log('Mobile Drawer Test:', drawerResult);
  report.mobileDrawerVerified = drawerResult && drawerResult.drawerOpens && drawerResult.bodyLocked && drawerResult.bodyUnlocked;

  // Save report
  fs.writeFileSync('reports/comprehensive-mobile-verification-results.json', JSON.stringify(report, null, 2), 'utf8');
  console.log('\nWrote reports/comprehensive-mobile-verification-results.json');

  ws.close();
  server.close();
  try { edgeProc.kill(); } catch (_) {}
}

verifyAllRoutes().catch(err => {
  console.error(err);
  process.exit(1);
});
