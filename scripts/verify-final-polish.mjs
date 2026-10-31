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

async function runBrowserAudit() {
  const distDir = path.resolve('dist');
  const port = 4174;
  const server = await createStaticServer(distDir, port);

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const outDir = path.resolve('reports/final-audit');
  const artifactDir = 'C:\\Users\\k deswanth\\.gemini\\antigravity\\brain\\915eb0d1-0751-489f-a770-da815fa3ba6c\\screenshots';

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true });

  const profileDir = path.resolve('reports/edge-profile-audit');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const debugPort = 9272;
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

  const results = {
    skipLink: false,
    skipLinkFocusTarget: false,
    mobileDrawerActiveRoute: false,
    reducedMotion: false,
    adminAutofocusDesktop: false,
    adminAutofocusMobilePreserved: false,
    measuredCLS: 0,
    screenshots: []
  };

  try {
    await send('Page.enable');
    await send('DOM.enable');
    await send('Runtime.enable');

    console.log('=== 1. Testing Keyboard Skip-To-Content Link ===');
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: `http://127.0.0.1:${port}/` });
    await new Promise(r => setTimeout(r, 2500));

    // Tab key
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
    await new Promise(r => setTimeout(r, 300));

    const skipCheck = await send('Runtime.evaluate', {
      expression: `({
        activeTag: document.activeElement.tagName,
        activeText: document.activeElement.textContent.trim(),
        activeHref: document.activeElement.getAttribute('href'),
        isVisible: document.activeElement.offsetWidth > 0 && document.activeElement.offsetHeight > 0
      })`,
      returnByValue: true
    });
    console.log('Skip link active element check:', skipCheck.result?.value);
    results.skipLink = skipCheck.result?.value?.activeHref === '#main-content';

    // Press Enter on skip link
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
    await new Promise(r => setTimeout(r, 300));

    const mainFocusCheck = await send('Runtime.evaluate', {
      expression: `({
        activeId: document.activeElement.id,
        tagName: document.activeElement.tagName
      })`,
      returnByValue: true
    });
    console.log('Main element focus check:', mainFocusCheck.result?.value);
    results.skipLinkFocusTarget = mainFocusCheck.result?.value?.activeId === 'main-content';

    console.log('=== 2. Testing Cumulative Layout Shift (CLS) ===');
    const clsCheck = await send('Runtime.evaluate', {
      expression: `new Promise(resolve => {
        let clsValue = 0;
        const observer = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
        });
        observer.observe({ type: 'layout-shift', buffered: true });
        window.scrollBy({ top: 500, behavior: 'smooth' });
        setTimeout(() => {
          window.scrollBy({ top: -500, behavior: 'smooth' });
          setTimeout(() => {
            observer.disconnect();
            resolve(clsValue);
          }, 1500);
        }, 1500);
      })`,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('Empirical Measured CLS:', clsCheck.result?.value);
    results.measuredCLS = clsCheck.result?.value || 0;

    console.log('=== 3. Testing Mobile Drawer Active Route Indicator ===');
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    await send('Page.navigate', { url: `http://127.0.0.1:${port}/` });
    await new Promise(r => setTimeout(r, 2500));

    // Click Hamburger Button
    const clickToggle = await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('button[aria-label="Toggle navigation menu"]');
        if (btn) { btn.click(); return true; }
        return false;
      })()`,
      returnByValue: true
    });
    console.log('Clicked mobile drawer toggle:', clickToggle.result?.value);
    await new Promise(r => setTimeout(r, 600));

    const drawerCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const homeLink = Array.from(document.querySelectorAll('a')).find(a => a.textContent.trim() === 'Home' && a.closest('[role="dialog"]'));
        const goldDot = homeLink ? homeLink.querySelector('.bg-brand-brightgold') : null;
        const computedStyle = homeLink ? window.getComputedStyle(homeLink) : null;
        return {
          drawerVisible: document.querySelector('[role="dialog"]')?.classList.contains('translate-x-0'),
          homeHasBorder: homeLink?.classList.contains('border-brand-brightgold'),
          hasGoldDot: !!goldDot,
          borderLeftColor: computedStyle?.borderLeftColor
        };
      })()`,
      returnByValue: true
    });
    console.log('Mobile drawer active route indicator check:', drawerCheck.result?.value);
    results.mobileDrawerActiveRoute = drawerCheck.result?.value?.hasGoldDot && drawerCheck.result?.value?.homeHasBorder;

    // Capture Mobile Drawer Screenshot
    const { data: drawerImg } = await send('Page.captureScreenshot', { format: 'png' });
    const drawerPathLocal = path.join(outDir, 'mobile_drawer_active_indicator.png');
    const drawerPathArtifact = path.join(artifactDir, 'mobile_drawer_active_indicator.png');
    fs.writeFileSync(drawerPathLocal, Buffer.from(drawerImg, 'base64'));
    fs.writeFileSync(drawerPathArtifact, Buffer.from(drawerImg, 'base64'));
    console.log('Captured mobile drawer screenshot');

    console.log('=== 4. Testing Admin Login Autofocus (Desktop vs Mobile) ===');
    // Secret route path: /sec-ca-8f2a9c1e7d4b6/login
    // Desktop Viewport
    await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: `http://127.0.0.1:${port}/sec-ca-8f2a9c1e7d4b6/login` });
    await new Promise(r => setTimeout(r, 2500));

    const desktopFocus = await send('Runtime.evaluate', {
      expression: `({
        activeId: document.activeElement?.id,
        tagName: document.activeElement?.tagName
      })`,
      returnByValue: true
    });
    console.log('Desktop admin autofocus check:', desktopFocus.result?.value);
    results.adminAutofocusDesktop = desktopFocus.result?.value?.activeId === 'username';

    const { data: adminImg } = await send('Page.captureScreenshot', { format: 'png' });
    const adminPathLocal = path.join(outDir, 'admin_login_autofocus.png');
    const adminPathArtifact = path.join(artifactDir, 'admin_login_autofocus.png');
    fs.writeFileSync(adminPathLocal, Buffer.from(adminImg, 'base64'));
    fs.writeFileSync(adminPathArtifact, Buffer.from(adminImg, 'base64'));
    console.log('Captured admin login screenshot');

    // Mobile Viewport (Autofocus must NOT steal focus or open soft keyboard)
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    await send('Page.navigate', { url: `http://127.0.0.1:${port}/sec-ca-8f2a9c1e7d4b6/login` });
    await new Promise(r => setTimeout(r, 2500));

    const mobileFocus = await send('Runtime.evaluate', {
      expression: `({
        activeId: document.activeElement?.id,
        tagName: document.activeElement?.tagName
      })`,
      returnByValue: true
    });
    console.log('Mobile admin autofocus preserved check (should not be username):', mobileFocus.result?.value);
    results.adminAutofocusMobilePreserved = mobileFocus.result?.value?.activeId !== 'username';

    console.log('=== 5. Testing Reduced-Motion Emulation ===');
    await send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
    });
    const motionCheck = await send('Runtime.evaluate', {
      expression: `window.matchMedia('(prefers-reduced-motion: reduce)').matches`,
      returnByValue: true
    });
    console.log('Reduced motion matchMedia:', motionCheck.result?.value);
    results.reducedMotion = motionCheck.result?.value === true;

  } finally {
    ws.close();
    try { edgeProc.kill(); } catch (_) {}
    server.close();
  }

  console.log('\n======================================================');
  console.log('FINAL BROWSER VALIDATION REPORT:');
  console.log(JSON.stringify(results, null, 2));
  console.log('======================================================');
  return results;
}

runBrowserAudit().catch(err => {
  console.error(err);
  process.exit(1);
});
