import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

const screenshotDir = path.resolve('reports/v60_screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

async function runV60Verification() {
  console.log('================================================================');
  console.log('  KAVITHA & ASSOCIATES — V6.0 TRANSFORMATION VERIFICATION RUNNER');
  console.log('================================================================');

  const PORT = 4199;
  console.log(`[V6.0 QA] Starting Vite preview server on port ${PORT}...`);
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: process.cwd(),
    shell: true,
    stdio: 'pipe'
  });

  let serverReady = false;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/`);
      if (res.ok) {
        serverReady = true;
        break;
      }
    } catch (_) {}
  }

  if (!serverReady) {
    try { preview.kill(); } catch (_) {}
    throw new Error('Vite preview failed to start on port ' + PORT);
  }
  console.log('[V6.0 QA] Preview server ready at http://127.0.0.1:' + PORT);

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.join(os.tmpdir(), `edge-profile-v60-${Date.now()}`);

  const CDP_PORT = 9299;
  console.log(`[V6.0 QA] Launching headless Edge CDP on port ${CDP_PORT}...`);
  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${CDP_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  let ws = null;
  for (let i = 0; i < 35; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
      const tabs = await res.json();
      const target = tabs.find(t => t.type === 'page');
      if (target && target.webSocketDebuggerUrl) {
        ws = new WebSocket(target.webSocketDebuggerUrl);
        await new Promise(r => { ws.onopen = r; });
        break;
      }
    } catch (_) {}
  }

  if (!ws) {
    try { edgeProc.kill(); } catch (_) {}
    try { preview.kill(); } catch (_) {}
    throw new Error('Failed to connect to CDP on port ' + CDP_PORT);
  }
  console.log('[V6.0 QA] Connected to Headless Edge DevTools.');

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const reqId = id++;
    const timer = setTimeout(() => reject(new Error('Timeout on ' + method)), 20000);
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

  const consoleErrors = [];
  const network404s = [];
  ws.addEventListener('message', evt => {
    try {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
        consoleErrors.push(msg.params.entry.text);
      }
      if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
        consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
      }
      if (msg.method === 'Network.responseReceived') {
        const resp = msg.params.response;
        if (resp && resp.status === 404) {
          network404s.push(resp.url);
        }
      }
    } catch (_) {}
  });

  await send('Page.enable');
  await send('DOM.enable');
  await send('Network.enable');

  const qaReport = {
    viewports: [],
    screenshots: [],
    consoleErrors,
    network404s
  };

  const viewports = [
    { name: '320px Compact Mobile', width: 320, height: 640, mobile: true, scale: 2 },
    { name: '390px Mobile', width: 390, height: 844, mobile: true, scale: 2 },
    { name: '768px Tablet', width: 768, height: 1024, mobile: false, scale: 1 },
    { name: '1024px Small Desktop', width: 1024, height: 800, mobile: false, scale: 1 },
    { name: '1440px Standard Desktop', width: 1440, height: 900, mobile: false, scale: 1 },
    { name: '1920px Wide Desktop', width: 1920, height: 1080, mobile: false, scale: 1 },
  ];

  console.log('\n--- 1. Testing Viewport Responsive Overflow Across 6 Breakpoints ---');
  for (const vp of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.scale,
      mobile: vp.mobile
    });

    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
    await new Promise(r => setTimeout(r, 1200));

    const overflowRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const scrollW = document.documentElement.scrollWidth;
        const clientW = document.documentElement.clientWidth;
        const diff = Math.max(0, scrollW - clientW);
        return { scrollW, clientW, diff, hasOverflow: diff > 1 };
      })()`,
      returnByValue: true
    });
    const overflow = overflowRes.result?.value;
    const status = overflow.hasOverflow ? 'FAIL (OVERFLOW)' : 'PASS (0.00px)';
    console.log(`  [${status}] ${vp.name.padEnd(25)} : ScrollWidth=${overflow.scrollW}px, ClientWidth=${overflow.clientW}px, Diff=${overflow.diff.toFixed(2)}px`);

    qaReport.viewports.push({
      name: vp.name,
      width: vp.width,
      height: vp.height,
      overflow: overflow.diff,
      hasOverflow: overflow.hasOverflow
    });

    // Capture Viewport Hero Screenshot
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0);' });
    await new Promise(r => setTimeout(r, 300));
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const shotName = `homepage-hero-${vp.width}px.png`;
    fs.writeFileSync(path.join(screenshotDir, shotName), Buffer.from(shot.data, 'base64'));
    console.log(`    ↳ Captured screenshot: ${shotName}`);
    qaReport.screenshots.push({ filename: shotName, width: vp.width, height: vp.height });
  }

  console.log('\n--- 2. Capturing Core Section Screenshots at 1440px ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await new Promise(r => setTimeout(r, 1500));

  const sectionsToCapture = [
    { selector: '#about-us', name: 'section-about-collage-1440px.png' },
    { selector: '#services-overview', name: 'section-services-bento-1440px.png' },
    { selector: '#why-choose-us', name: 'section-why-choose-us-1440px.png' },
    { selector: '#working-process', name: 'section-working-process-1440px.png' },
    { selector: '#industries-overview', name: 'section-industries-grid-1440px.png' },
    { selector: '#insights-overview', name: 'section-insights-blog-1440px.png' },
    { selector: '#consultation-cta', name: 'section-final-cta-1440px.png' },
    { selector: '#contact-section', name: 'section-chambers-contact-1440px.png' },
  ];

  for (const sec of sectionsToCapture) {
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('${sec.selector}');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(screenshotDir, sec.name), Buffer.from(shot.data, 'base64'));
    console.log(`  ✔ Captured: ${sec.name.padEnd(35)} [${sec.selector}]`);
    qaReport.screenshots.push({ filename: sec.name, selector: sec.selector });
  }

  console.log('\n--- 3. Capturing Dedicated Public Pages at 1440px & 390px ---');
  const pages = [
    { url: '/about', baseName: 'about-page' },
    { url: '/services', baseName: 'services-page' },
    { url: '/services/audit-assurance', baseName: 'audit-assurance-page' },
    { url: '/industries', baseName: 'industries-page' },
    { url: '/locations', baseName: 'locations-page' },
    { url: '/blog', baseName: 'blog-hub-page' },
    { url: '/contact', baseName: 'contact-page' },
    { url: '/non-existent-recovery-check', baseName: '404-recovery-page' }
  ];

  for (const p of pages) {
    // Desktop 1440px
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}${p.url}` });
    await new Promise(r => setTimeout(r, 1200));
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0);' });
    await new Promise(r => setTimeout(r, 300));
    let shot = await send('Page.captureScreenshot', { format: 'png' });
    let fname = `${p.baseName}-desktop-1440px.png`;
    fs.writeFileSync(path.join(screenshotDir, fname), Buffer.from(shot.data, 'base64'));
    console.log(`  ✔ Captured: ${fname}`);

    // Mobile 390px
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}${p.url}` });
    await new Promise(r => setTimeout(r, 1200));
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0);' });
    await new Promise(r => setTimeout(r, 300));
    shot = await send('Page.captureScreenshot', { format: 'png' });
    fname = `${p.baseName}-mobile-390px.png`;
    fs.writeFileSync(path.join(screenshotDir, fname), Buffer.from(shot.data, 'base64'));
    console.log(`  ✔ Captured: ${fname}`);
  }

  console.log('\n--- 4. Error and 404 Telemetry ---');
  console.log(`  Console Errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach(e => console.log('    - ' + e));
  }
  console.log(`  Network 404s: ${network404s.length}`);
  if (network404s.length > 0) {
    network404s.forEach(url => console.log('    - 404: ' + url));
  }

  // Teardown
  console.log('\n[V6.0 QA] Cleaning up processes...');
  try { ws.close(); } catch (_) {}
  try { edgeProc.kill(); } catch (_) {}
  try { preview.kill(); } catch (_) {}
  try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}

  // Write report
  fs.writeFileSync('reports/v60_verification_report.json', JSON.stringify(qaReport, null, 2));
  console.log('\n[V6.0 QA] Verification completed successfully! Written to reports/v60_verification_report.json\n');
}

runV60Verification().catch(err => {
  console.error('[V6.0 QA] FATAL ERROR:', err);
  process.exit(1);
});
