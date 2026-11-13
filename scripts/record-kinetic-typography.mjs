import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const outDir = path.resolve('reports/kinetic_typography');
const framesDir = path.join(outDir, 'frames');
const artDir = path.resolve('C:/Users/k deswanth/.gemini/antigravity/brain/441eee2e-7fd3-42ce-bd96-eec34be60162');

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(framesDir, { recursive: true });

async function record() {
  const PORT = 4235;
  console.log(`Starting Vite preview server on port ${PORT}...`);
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: process.cwd(),
    shell: true,
    stdio: 'pipe'
  });

  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/`);
      if (res.ok) break;
    } catch (_) {}
  }

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-kinetic');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const CDP_PORT = 9322;
  console.log(`Starting headless Edge with CDP on port ${CDP_PORT}...`);
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
      if (target) {
        ws = new WebSocket(target.webSocketDebuggerUrl);
        await new Promise(r => { ws.onopen = r; });
        break;
      }
    } catch (_) {}
  }

  if (!ws) {
    console.error('Failed to connect CDP WebSocket');
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

  await send('Page.enable');
  await send('DOM.enable');

  // Set viewport to 1440x900 desktop
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  // 1. Record Homepage Hero & Rotating Text (18 frames over ~3.6s)
  console.log('Recording Homepage Hero kinetic typography sequence...');
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await new Promise(r => setTimeout(r, 300)); // allow initial mount

  for (let i = 0; i < 20; i++) {
    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(screenshot.data, 'base64');
    const filename = `hero_frame_${String(i).padStart(3, '0')}.png`;
    fs.writeFileSync(path.join(framesDir, filename), buffer);
    await new Promise(r => setTimeout(r, 180));
  }

  // 2. Record About Section Kinetic Typography (14 frames)
  console.log('Recording About Page kinetic typography sequence...');
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/about` });
  await new Promise(r => setTimeout(r, 200));

  for (let i = 0; i < 15; i++) {
    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(screenshot.data, 'base64');
    const filename = `about_frame_${String(i).padStart(3, '0')}.png`;
    fs.writeFileSync(path.join(framesDir, filename), buffer);
    await new Promise(r => setTimeout(r, 180));
  }

  // 3. Record Services Page Kinetic Typography (14 frames)
  console.log('Recording Services Page kinetic typography sequence...');
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/services` });
  await new Promise(r => setTimeout(r, 200));

  for (let i = 0; i < 15; i++) {
    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(screenshot.data, 'base64');
    const filename = `services_frame_${String(i).padStart(3, '0')}.png`;
    fs.writeFileSync(path.join(framesDir, filename), buffer);
    await new Promise(r => setTimeout(r, 180));
  }

  // 4. Record Working Process Kinetic Section
  console.log('Recording Working Process sequence...');
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/#working-process` });
  await new Promise(r => setTimeout(r, 400));

  for (let i = 0; i < 15; i++) {
    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(screenshot.data, 'base64');
    const filename = `process_frame_${String(i).padStart(3, '0')}.png`;
    fs.writeFileSync(path.join(framesDir, filename), buffer);
    await new Promise(r => setTimeout(r, 180));
  }

  // 4b. Record Why Choose Us Kinetic Section
  console.log('Recording Why Choose Us sequence...');
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/#why-choose-us` });
  await new Promise(r => setTimeout(r, 400));

  for (let i = 0; i < 15; i++) {
    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(screenshot.data, 'base64');
    const filename = `why_choose_us_frame_${String(i).padStart(3, '0')}.png`;
    fs.writeFileSync(path.join(framesDir, filename), buffer);
    await new Promise(r => setTimeout(r, 180));
  }

  // 4c. Record Contact Section Kinetic Intake
  console.log('Recording Contact sequence...');
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/#contact-section` });
  await new Promise(r => setTimeout(r, 400));

  for (let i = 0; i < 15; i++) {
    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(screenshot.data, 'base64');
    const filename = `contact_frame_${String(i).padStart(3, '0')}.png`;
    fs.writeFileSync(path.join(framesDir, filename), buffer);
    await new Promise(r => setTimeout(r, 180));
  }

  // 5. Overflow verification across viewports: 390px, 768px, 1024px, 1440px
  console.log('Verifying horizontal overflow across all key viewports...');
  const viewports = [
    { width: 390, height: 844, name: 'mobile' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 1024, height: 768, name: 'laptop' },
    { width: 1440, height: 900, name: 'desktop' }
  ];

  const routes = ['/', '/about', '/services', '/contact'];
  const overflowResults = [];

  for (const vp of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width <= 768
    });

    for (const route of routes) {
      await send('Page.navigate', { url: `http://127.0.0.1:${PORT}${route}` });
      await new Promise(r => setTimeout(r, 500));

      const evalRes = await send('Runtime.evaluate', {
        expression: 'Math.max(0, document.documentElement.scrollWidth - window.innerWidth)'
      });
      const overflowPx = evalRes.result.value || 0;
      overflowResults.push({ route, viewport: vp.name, width: vp.width, overflowPx });
      if (overflowPx > 0) {
        console.warn(`[OVERFLOW WARNING] ${route} @ ${vp.width}px has ${overflowPx}px overflow!`);
      }
    }
  }

  fs.writeFileSync(
    path.join(outDir, 'overflow_verification.json'),
    JSON.stringify(overflowResults, null, 2)
  );
  console.log('Horizontal overflow verification passed (all 0px):', overflowResults.every(r => r.overflowPx === 0));

  // 6. Responsive verification: Mobile 390px Viewport Screenshots
  console.log('Capturing responsive mobile verification screenshots at 390px...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true
  });

  const mobilePages = [
    { url: `http://127.0.0.1:${PORT}/`, name: 'mobile_home' },
    { url: `http://127.0.0.1:${PORT}/about`, name: 'mobile_about' },
    { url: `http://127.0.0.1:${PORT}/services`, name: 'mobile_services' },
    { url: `http://127.0.0.1:${PORT}/contact`, name: 'mobile_contact' }
  ];

  for (const page of mobilePages) {
    await send('Page.navigate', { url: page.url });
    await new Promise(r => setTimeout(r, 800));
    const ss = await send('Page.captureScreenshot', { format: 'png' });
    const buf = Buffer.from(ss.data, 'base64');
    const fn = `${page.name}_390px.png`;
    fs.writeFileSync(path.join(outDir, fn), buf);
    if (fs.existsSync(artDir)) {
      try { fs.writeFileSync(path.join(artDir, fn), buf); } catch (_) {}
    }
    console.log(`Saved mobile screenshot: ${fn}`);
  }

  ws.close();
  edgeProc.kill();
  preview.kill();
  console.log('Frame capture and overflow check completed successfully!');
}

record().catch(err => {
  console.error(err);
  process.exit(1);
});
