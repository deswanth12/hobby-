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

async function captureTabletPairs() {
  const LOCAL_PORT = 4288;
  const distDir = path.resolve('dist');
  const server = await createStaticServer(distDir, LOCAL_PORT);

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-tablet-pairs');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const beforeDir = path.resolve('reports/screenshots/tablet/before');
  const afterDir = path.resolve('reports/screenshots/tablet/after');
  const artifactDir = 'C:\\Users\\k deswanth\\.gemini\\antigravity\\brain\\031adcf1-285e-4f69-9361-407ff52cf036';

  if (!fs.existsSync(beforeDir)) fs.mkdirSync(beforeDir, { recursive: true });
  if (!fs.existsSync(afterDir)) fs.mkdirSync(afterDir, { recursive: true });
  if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true });

  const cdpPort = 9299;
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
    { width: 600, height: 960, orientation: 'portrait', label: '600x960' },
    { width: 768, height: 1024, orientation: 'portrait', label: '768x1024' },
    { width: 820, height: 1180, orientation: 'portrait', label: '820x1180' },
    { width: 834, height: 1112, orientation: 'portrait', label: '834x1112' },
    { width: 1024, height: 768, orientation: 'landscape', label: '1024x768' },
    { width: 1180, height: 820, orientation: 'landscape', label: '1180x820' },
    { width: 1280, height: 800, orientation: 'landscape', label: '1280x800' }
  ];

  console.log('Capturing Tablet Before & After Pairs across 7 Viewports...');

  for (const t of targets) {
    console.log(`\n--- Viewport ${t.label} (${t.orientation.toUpperCase()}: ${t.width}x${t.height}) ---`);

    await send('Emulation.setDeviceMetricsOverride', {
      width: t.width,
      height: t.height,
      deviceScaleFactor: 2,
      mobile: t.width < 1024,
      hasTouch: true
    });

    // 1. Live Production (Before)
    try {
      await send('Page.navigate', { url: 'https://kavithaassociates.com/' });
      await new Promise(r => setTimeout(r, 1200));
      const shotBefore = await send('Page.captureScreenshot', { format: 'png' });
      const beforeFile = path.join(beforeDir, `tablet-before-${t.label}.png`);
      fs.writeFileSync(beforeFile, Buffer.from(shotBefore.data, 'base64'));
      fs.copyFileSync(beforeFile, path.join(artifactDir, `tablet-before-${t.label}.png`));
      console.log(`  [BEFORE] Saved tablet-before-${t.label}.png (${shotBefore.data.length} chars)`);
    } catch (e) {
      console.warn(`  [BEFORE FAIL]`, e.message);
    }

    // 2. Latest Local Production Build (After)
    try {
      await send('Page.navigate', { url: `http://127.0.0.1:${LOCAL_PORT}/` });
      await new Promise(r => setTimeout(r, 800));
      const shotAfter = await send('Page.captureScreenshot', { format: 'png' });
      const afterFile = path.join(afterDir, `tablet-after-${t.label}.png`);
      fs.writeFileSync(afterFile, Buffer.from(shotAfter.data, 'base64'));
      fs.copyFileSync(afterFile, path.join(artifactDir, `tablet-after-${t.label}.png`));
      console.log(`  [AFTER] Saved tablet-after-${t.label}.png (${shotAfter.data.length} chars)`);
    } catch (e) {
      console.warn(`  [AFTER FAIL]`, e.message);
    }
  }

  // Also verify drawer interaction on 768px tablet
  console.log('\n--- Verifying Tablet Drawer Interaction on 768px ---');
  await send('Emulation.setDeviceMetricsOverride', { width: 768, height: 1024, deviceScaleFactor: 2, mobile: true, hasTouch: true });
  await send('Page.navigate', { url: `http://127.0.0.1:${LOCAL_PORT}/` });
  await new Promise(r => setTimeout(r, 700));

  const drawerTest = await send('Runtime.evaluate', {
    expression: `(() => {
      const toggle = document.querySelector('button[aria-label*="navigation" i]');
      if (!toggle) return { error: 'Toggle button not found' };
      toggle.click();
      const drawer = document.querySelector('div[role="dialog"]');
      const drawerRect = drawer ? drawer.getBoundingClientRect() : null;
      const isOpen = drawer && !drawer.className.includes('translate-x-full');
      const isScrollLocked = document.body.style.overflow === 'hidden';
      const touchTargets = Array.from(drawer ? drawer.querySelectorAll('a, button') : [])
        .map(el => ({ text: el.innerText.trim(), h: el.offsetHeight, w: el.offsetWidth, min44: el.offsetHeight >= 44 }));

      // Close it back
      const closeBtn = drawer.querySelector('button[aria-label*="close" i]');
      if (closeBtn) closeBtn.click();
      const isClosedAfter = drawer.className.includes('translate-x-full');

      return {
        drawerWidth: drawerRect ? Math.round(drawerRect.width) : 0,
        isOpen,
        isScrollLocked,
        touchTargetsCount: touchTargets.length,
        allTouchTargetsPass: touchTargets.every(t => t.min44),
        isClosedAfter
      };
    })()`,
    returnByValue: true
  });
  console.log('Tablet Drawer Test Result:', drawerTest.result.value);

  // Admin login page check on 768px
  console.log('\n--- Verifying Admin Page on 768px Tablet ---');
  await send('Page.navigate', { url: `http://127.0.0.1:${LOCAL_PORT}/admin` });
  await new Promise(r => setTimeout(r, 700));
  const adminTest = await send('Runtime.evaluate', {
    expression: `(() => {
      const form = document.querySelector('form');
      const inputs = Array.from(document.querySelectorAll('input'));
      const buttons = Array.from(document.querySelectorAll('button'));
      return {
        hasForm: !!form,
        inputCount: inputs.length,
        buttonCount: buttons.length,
        overflow: document.documentElement.scrollWidth > window.innerWidth
      };
    })()`,
    returnByValue: true
  });
  console.log('Admin Page on Tablet:', adminTest.result.value);

  ws.close();
  server.close();
  try { edgeProc.kill(); } catch (_) {}
  console.log('\nTablet capture and verification complete!');
}

captureTabletPairs().catch(err => {
  console.error(err);
  process.exit(1);
});
