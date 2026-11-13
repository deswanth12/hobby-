import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const outDir = path.resolve('reports/final_motion_audit');
const artDir = path.resolve('C:/Users/k deswanth/.gemini/antigravity/brain/441eee2e-7fd3-42ce-bd96-eec34be60162');
const framesDir = path.resolve('reports/final_motion_audit/frames');

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(framesDir, { recursive: true });

async function runAudit() {
  console.log('--- STARTING FINAL MOTION VISUAL QA & CLIENT EXPERIENCE AUDIT ---');
  
  const PORT = 4230;
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: process.cwd(),
    shell: true,
    stdio: 'pipe'
  });

  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 250));
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/about`);
      if (res.ok) break;
    } catch (_) {}
  }

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-final-audit');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const CDP_PORT = 9320;
  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${CDP_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  let ws = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
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
    console.error('Failed to connect CDP');
    preview.kill();
    edgeProc.kill();
    process.exit(1);
  }

  let idSeq = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idSeq++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  const consoleLogs = [];
  ws.addEventListener('message', (evt) => {
    try {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        consoleLogs.push({
          type: msg.params.type,
          args: msg.params.args.map(a => a.value || a.description)
        });
      }
      if (msg.method === 'Log.entryAdded') {
        consoleLogs.push({
          level: msg.params.entry.level,
          text: msg.params.entry.text
        });
      }
    } catch (_) {}
  });

  await send('Page.enable');
  await send('DOM.enable');
  await send('Runtime.enable');
  await send('Log.enable');

  const auditResults = {
    viewports: {},
    consoleErrors: [],
    overflowCheck: {},
    reducedMotionCheck: {},
    recordings: []
  };

  const sectionsToTest = [
    { name: 'homepage_hero', url: `http://127.0.0.1:${PORT}/` },
    { name: 'working_process', url: `http://127.0.0.1:${PORT}/#working-process` },
    { name: 'why_choose_us', url: `http://127.0.0.1:${PORT}/#why-choose-us` },
    { name: 'about', url: `http://127.0.0.1:${PORT}/about` },
    { name: 'services', url: `http://127.0.0.1:${PORT}/services` },
    { name: 'audit_spotlight', url: `http://127.0.0.1:${PORT}/services/audit-assurance` },
    { name: 'contact', url: `http://127.0.0.1:${PORT}/contact` }
  ];

  const viewports = [
    { width: 1440, height: 900, label: '1440px' },
    { width: 768, height: 1024, label: '768px' },
    { width: 390, height: 844, label: '390px' }
  ];

  // 1. Viewport Screenshots & Overflow Verification
  for (const vp of viewports) {
    auditResults.viewports[vp.label] = [];
    auditResults.overflowCheck[vp.label] = [];

    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width <= 768
    });

    for (const sec of sectionsToTest) {
      await send('Page.navigate', { url: sec.url });
      await new Promise(r => setTimeout(r, 1400));

      // Check overflow
      const overflowEval = await send('Runtime.evaluate', {
        expression: `({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasOverflow: document.documentElement.scrollWidth > window.innerWidth + 1
        })`,
        returnByValue: true
      });

      const overflowData = overflowEval.result.value;
      auditResults.overflowCheck[vp.label].push({
        section: sec.name,
        hasOverflow: overflowData.hasOverflow,
        scrollWidth: overflowData.scrollWidth,
        clientWidth: overflowData.clientWidth
      });

      // Capture screenshot
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const buf = Buffer.from(shot.data, 'base64');
      const filename = `audit_${sec.name}_${vp.label}.png`;
      fs.writeFileSync(path.join(outDir, filename), buf);
      fs.writeFileSync(path.join(artDir, filename), buf);
      auditResults.viewports[vp.label].push(filename);
      console.log(`[Screenshot] ${filename} (Overflow: ${overflowData.hasOverflow ? 'FAIL' : 'PASS'})`);
    }
  }

  // 2. Reduced Motion Verification
  console.log('\n--- VERIFYING PREFERS-REDUCED-MOTION BEHAVIOR ---');
  await send('Emulation.setEmulatedMedia', {
    media: 'screen',
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
  });

  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await new Promise(r => setTimeout(r, 1200));

  const reducedEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector('.motion-float-hero');
      const mesh = document.querySelector('.motion-spin-mesh');
      const dot = document.querySelector('.motion-dot-wave-1');
      const spine = document.querySelector('.motion-timeline-spine');
      return {
        floatAnim: el ? getComputedStyle(el).animationName : 'not-found',
        meshAnim: mesh ? getComputedStyle(mesh).animationName : 'not-found',
        dotAnim: dot ? getComputedStyle(dot).animationName : 'not-found',
        spineAnim: spine ? getComputedStyle(spine).animationName : 'not-found'
      };
    })()`,
    returnByValue: true
  });
  auditResults.reducedMotionCheck = reducedEval.result.value;
  console.log('[Reduced Motion Check]', auditResults.reducedMotionCheck);

  // Capture reduced-motion screenshot
  const redShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'audit_reduced_motion_1440px.png'), Buffer.from(redShot.data, 'base64'));
  fs.writeFileSync(path.join(artDir, 'audit_reduced_motion_1440px.png'), Buffer.from(redShot.data, 'base64'));

  // Reset media features
  await send('Emulation.setEmulatedMedia', { media: 'screen', features: [] });

  // 3. Screen Recording Capture (Sequential frames of Hero floating plaque & Rotating Mesh)
  console.log('\n--- CAPTURING LIVE ANIMATION SEQUENCE (HERO & ABOUT) ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  // Hero Live Sequence: 15 frames over 3.0 seconds (200ms intervals)
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await new Promise(r => setTimeout(r, 1200));

  const heroFrames = [];
  for (let f = 0; f < 16; f++) {
    const frameShot = await send('Page.captureScreenshot', { 
      format: 'png',
      clip: { x: 0, y: 0, width: 1440, height: 750, scale: 1 }
    });
    const framePath = path.join(framesDir, `hero_frame_${String(f).padStart(2, '0')}.png`);
    fs.writeFileSync(framePath, Buffer.from(frameShot.data, 'base64'));
    heroFrames.push(framePath);
    await new Promise(r => setTimeout(r, 200));
  }
  console.log(`[Screen Recording] Captured 16 frames for Hero section animation.`);

  // About Live Sequence: 15 frames over 3.0 seconds (200ms intervals)
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/about` });
  await new Promise(r => setTimeout(r, 1200));

  const aboutFrames = [];
  for (let f = 0; f < 16; f++) {
    const frameShot = await send('Page.captureScreenshot', { 
      format: 'png',
      clip: { x: 0, y: 0, width: 1440, height: 750, scale: 1 }
    });
    const framePath = path.join(framesDir, `about_frame_${String(f).padStart(2, '0')}.png`);
    fs.writeFileSync(framePath, Buffer.from(frameShot.data, 'base64'));
    aboutFrames.push(framePath);
    await new Promise(r => setTimeout(r, 200));
  }
  console.log(`[Screen Recording] Captured 16 frames for About section animation.`);

  // Working Process Live Sequence
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/#working-process` });
  await new Promise(r => setTimeout(r, 1200));

  const processFrames = [];
  for (let f = 0; f < 16; f++) {
    const frameShot = await send('Page.captureScreenshot', { 
      format: 'png',
      clip: { x: 0, y: 100, width: 1440, height: 750, scale: 1 }
    });
    const framePath = path.join(framesDir, `process_frame_${String(f).padStart(2, '0')}.png`);
    fs.writeFileSync(framePath, Buffer.from(frameShot.data, 'base64'));
    processFrames.push(framePath);
    await new Promise(r => setTimeout(r, 200));
  }
  console.log(`[Screen Recording] Captured 16 frames for Working Process section animation.`);

  auditResults.consoleErrors = consoleLogs.filter(l => l.level === 'error' || l.type === 'error');
  fs.writeFileSync(path.join(outDir, 'audit_results.json'), JSON.stringify(auditResults, null, 2));

  ws.close();
  edgeProc.kill();
  preview.kill();
  console.log('\n--- BROWSER AUDIT HARNESS COMPLETED SUCCESSFULLY ---');
}

runAudit().catch(err => {
  console.error(err);
  process.exit(1);
});
