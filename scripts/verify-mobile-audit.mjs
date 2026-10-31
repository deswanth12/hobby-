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
    server.listen(port, '127.0.0.1', () => {
      resolve(server);
    });
  });
}

async function runVerificationAudit() {
  const PORT = 4205;
  const distDir = path.resolve('dist');
  const server = await createStaticServer(distDir, PORT);
  console.log(`[Verification Server] Serving ${distDir} on http://127.0.0.1:${PORT}`);

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-verify-audit');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const outDir = path.resolve('reports/screenshots/after');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const cdpPort = 9255;
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
    throw new Error('Could not connect to Edge DevTools');
  }

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const reqId = id++;
    const timer = setTimeout(() => reject(new Error('Timeout on ' + method)), 15000);
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

  const breakpoints = [
    { width: 320, height: 568, device: 'Small Mobile 320px', mobile: true },
    { width: 360, height: 640, device: 'Android Standard 360px', mobile: true },
    { width: 375, height: 667, device: 'iPhone SE/8 375px', mobile: true },
    { width: 390, height: 844, device: 'iPhone 12-15 390px', mobile: true },
    { width: 414, height: 896, device: 'iPhone Plus/Max 414px', mobile: true },
    { width: 430, height: 932, device: 'iPhone Pro Max 430px', mobile: true },
    { width: 768, height: 1024, device: 'Tablet Portrait 768px', mobile: true },
    { width: 1024, height: 768, device: 'Tablet Landscape 1024px', mobile: false },
    { width: 1280, height: 800, device: 'Laptop Standard 1280px', mobile: false },
    { width: 1440, height: 900, device: 'Desktop Large 1440px', mobile: false }
  ];

  const routes = [
    { path: '/', name: 'Homepage' },
    { path: '/about', name: 'About Chambers' },
    { path: '/services', name: 'Services Directory' },
    { path: '/services/audit-assurance', name: 'Audit & Assurance' },
    { path: '/services/gst-consultant-tirupati', name: 'GST Services' },
    { path: '/services/income-tax-consultant-tirupati', name: 'Income Tax' },
    { path: '/services/company-registration-tirupati', name: 'Company Registration' },
    { path: '/services/virtual-cfo-tirupati', name: 'Virtual CFO' },
    { path: '/services/rera-consultant-tirupati', name: 'RERA Consultant' },
    { path: '/industries', name: 'Industries' },
    { path: '/locations', name: 'Locations' },
    { path: '/blog', name: 'Articles Hub' },
    { path: '/blog/corporate-tax-planning-2026', name: 'Blog Post' },
    { path: '/contact', name: 'Contact' }
  ];

  const auditResults = {
    testedAt: new Date().toISOString(),
    totalChecks: 0,
    overflowIssues: [],
    smallTouchTargets: [],
    headerHeightMeasurements: [],
    screenshotsCaptured: []
  };

  console.log(`\nStarting Verification Audit across ${breakpoints.length} breakpoints and ${routes.length} routes...`);

  for (const bp of breakpoints) {
    console.log(`\nTesting Breakpoint: ${bp.device} [${bp.width}x${bp.height}]`);
    await send('Emulation.setDeviceMetricsOverride', {
      width: bp.width,
      height: bp.height,
      deviceScaleFactor: bp.mobile ? 2 : 1,
      mobile: bp.mobile
    });

    for (const r of routes) {
      auditResults.totalChecks++;
      await send('Page.navigate', { url: `http://127.0.0.1:${PORT}${r.path}` });
      await new Promise(res => setTimeout(res, 600));

      const evalRes = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const docWidth = document.documentElement.clientWidth;
            const scrollWidth = document.documentElement.scrollWidth;
            const bodyScrollWidth = document.body ? document.body.scrollWidth : 0;
            const maxScroll = Math.max(scrollWidth, bodyScrollWidth);
            const hasOverflow = maxScroll > docWidth + 1.5;

            let offendingElements = [];
            if (hasOverflow) {
              const all = document.querySelectorAll('*');
              for (const el of all) {
                const rect = el.getBoundingClientRect();
                if (rect.right > docWidth + 1.5) {
                  offendingElements.push({
                    tag: el.tagName.toLowerCase(),
                    className: (el.className && typeof el.className === 'string') ? el.className.split(' ').slice(0, 3).join('.') : '',
                    right: Math.round(rect.right),
                    width: Math.round(rect.width)
                  });
                  if (offendingElements.length >= 4) break;
                }
              }
            }

            // Inspect touch targets for mobile (buttons, links, inputs)
            let smallTargets = [];
            if (${bp.mobile}) {
              const interactives = document.querySelectorAll('button, a, input, select, textarea');
              interactives.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0 && rect.top < 1200) {
                  if (rect.width < 38 || rect.height < 38) {
                    const text = (el.innerText || el.getAttribute('aria-label') || el.name || '').trim().slice(0, 30);
                    smallTargets.push({
                      tag: el.tagName.toLowerCase(),
                      text,
                      width: Math.round(rect.width),
                      height: Math.round(rect.height)
                    });
                  }
                }
              });
            }

            let headerHeight = 0;
            const header = document.querySelector('header');
            if (header) {
              headerHeight = Math.round(header.getBoundingClientRect().height);
            }

            return {
              docWidth,
              maxScroll,
              hasOverflow,
              offendingElements,
              smallTargets: smallTargets.slice(0, 5),
              headerHeight
            };
          })()
        `,
        returnByValue: true
      });

      const data = evalRes.result?.value || {};
      if (data.hasOverflow) {
        console.error(`  ✖ [${bp.width}px - ${r.name}] OVERFLOW! clientWidth=${data.docWidth}, scrollWidth=${data.maxScroll}`);
        auditResults.overflowIssues.push({
          breakpoint: bp.width,
          device: bp.device,
          route: r.path,
          name: r.name,
          docWidth: data.docWidth,
          maxScroll: data.maxScroll,
          offending: data.offendingElements
        });
      } else {
        // Clean pass
      }

      if (data.smallTargets && data.smallTargets.length > 0) {
        auditResults.smallTouchTargets.push({
          breakpoint: bp.width,
          route: r.path,
          name: r.name,
          targets: data.smallTargets
        });
      }

      if (r.path === '/' && data.headerHeight) {
        auditResults.headerHeightMeasurements.push({
          breakpoint: bp.width,
          device: bp.device,
          headerHeight: data.headerHeight
        });
      }

      const captureBreakpoints = [320, 375, 390, 768, 1440];
      const captureRoutes = ['/', '/services', '/contact', '/about'];
      if (captureBreakpoints.includes(bp.width) && captureRoutes.includes(r.path)) {
        const routeSlug = r.path === '/' ? 'homepage' : r.path.replace(/\//g, '-').replace(/^-/, '');
        const filename = `${routeSlug}-${bp.width}px.png`;
        const filepath = path.join(outDir, filename);
        const shot = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(filepath, Buffer.from(shot.data, 'base64'));
        auditResults.screenshotsCaptured.push(filename);
        console.log(`    📸 Saved verification screenshot: ${filename}`);
      }
    }
  }

  // Mobile navigation drawer test
  console.log('\n--- Testing Mobile Menu Drawer Interaction (390px) ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await new Promise(r => setTimeout(r, 600));

  const menuTest = await send('Runtime.evaluate', {
    expression: `
      (async () => {
        const toggleBtn = document.querySelector('button[aria-label="Toggle navigation menu"]');
        if (!toggleBtn) return { error: 'Toggle button not found' };

        const initialOverflow = document.body.style.overflow;
        toggleBtn.click();
        await new Promise(r => setTimeout(r, 350));

        const openedOverflow = document.body.style.overflow;
        const drawer = document.querySelector('[aria-label="Mobile Navigation Drawer"]');
        const isDrawerVisible = drawer ? window.getComputedStyle(drawer).visibility !== 'hidden' : false;

        const closeBtn = document.querySelector('button[aria-label="Close navigation menu"]');
        if (closeBtn) closeBtn.click();
        await new Promise(r => setTimeout(r, 350));

        const closedAgainOverflow = document.body.style.overflow;

        return {
          toggleFound: true,
          initialOverflow,
          openedOverflow,
          isDrawerVisible,
          closedAgainOverflow
        };
      })()
    `,
    awaitPromise: true,
    returnByValue: true
  });
  console.log('Mobile menu drawer test result:', menuTest.result?.value);
  auditResults.menuTest = menuTest.result?.value;

  fs.writeFileSync('reports/post-optimization-audit.json', JSON.stringify(auditResults, null, 2));
  console.log(`\nVerification audit complete! Wrote report to reports/post-optimization-audit.json`);
  console.log(`Total checks: ${auditResults.totalChecks}`);
  console.log(`Total Overflow issues: ${auditResults.overflowIssues.length}`);
  console.log(`Small touch target warnings: ${auditResults.smallTouchTargets.length}`);
  console.log(`Header Heights:\n${JSON.stringify(auditResults.headerHeightMeasurements, null, 2)}`);

  try { ws.close(); } catch (_) {}
  try { edgeProc.kill(); } catch (_) {}
  server.close();
}

runVerificationAudit().catch(err => {
  console.error('Verification audit failed:', err);
  process.exit(1);
});
