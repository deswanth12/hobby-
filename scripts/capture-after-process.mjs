import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const OUT_DIR = path.resolve('reports/process_screenshots');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: '360px_mobile', width: 360, height: 740, mobile: true },
  { name: '390px_mobile', width: 390, height: 844, mobile: true },
  { name: '768px_tablet', width: 768, height: 1024, mobile: true },
  { name: '1024px_laptop', width: 1024, height: 768, mobile: false },
  { name: '1440px_desktop', width: 1440, height: 900, mobile: false }
];

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-after');
  const edgeProc = spawn(edgePath, [
    '--remote-debugging-port=9251',
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  let tabs = null;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 400));
    try {
      const res = await fetch('http://127.0.0.1:9251/json/list');
      tabs = await res.json();
      if (tabs && tabs.length > 0) break;
    } catch (_) {}
  }

  if (!tabs || tabs.length === 0) {
    console.error('Edge CDP not ready');
    edgeProc.kill();
    return;
  }

  const target = tabs.find(t => t.type === 'page');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  let msgId = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = msgId++;
    const handler = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.id === id) {
        ws.removeEventListener('message', handler);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });

  await send('Page.enable');
  await send('Runtime.enable');

  for (const vp of VIEWPORTS) {
    console.log(`[CDP] Testing viewport: ${vp.name} (${vp.width}x${vp.height})...`);
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.mobile ? 2 : 1,
      mobile: vp.mobile
    });
    
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/' });
    await new Promise(r => setTimeout(r, 1200));

    // Reveal animations and scroll to #working-process
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, .scroll-reveal-image').forEach(el => el.classList.add('is-revealed'));
          const sec = document.getElementById('working-process');
          if (sec) {
            sec.scrollIntoView({ behavior: 'instant', block: 'start' });
            const rect = sec.getBoundingClientRect();
            const bodyWidth = document.body.scrollWidth;
            const hasHorizontalScroll = bodyWidth > window.innerWidth;
            return {
              found: true,
              y: rect.top + window.scrollY,
              width: rect.width,
              height: rect.height,
              hasHorizontalScroll,
              bodyWidth,
              windowWidth: window.innerWidth
            };
          }
          return { found: false };
        })()
      `,
      returnByValue: true
    });

    console.log(`Viewport ${vp.name} evaluation:`, evalRes.result.value);

    await new Promise(r => setTimeout(r, 500));

    // Capture focused screenshot of the working process section
    const ss = await send('Page.captureScreenshot', { format: 'png' });
    const filename = `after-process-${vp.name}.png`;
    fs.writeFileSync(path.join(OUT_DIR, filename), Buffer.from(ss.data, 'base64'));
    console.log(`Saved ${filename}`);
  }

  // Also capture full-length Section 5 for desktop 1440 and mobile 390 to produce exact before-after pairs
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/' });
  await new Promise(r => setTimeout(r, 1200));
  await send('Runtime.evaluate', {
    expression: `
      document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, .scroll-reveal-image').forEach(el => el.classList.add('is-revealed'));
      const sec = document.getElementById('working-process');
      if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'start' });
    `
  });
  await new Promise(r => setTimeout(r, 600));
  const fullDesk = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(OUT_DIR, 'after-process-desktop-1440.png'), Buffer.from(fullDesk.data, 'base64'));
  console.log('Saved after-process-desktop-1440.png');

  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await new Promise(r => setTimeout(r, 600));
  await send('Runtime.evaluate', {
    expression: `
      const sec = document.getElementById('working-process');
      if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'start' });
    `
  });
  await new Promise(r => setTimeout(r, 600));
  const fullMob = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(OUT_DIR, 'after-process-mobile-390.png'), Buffer.from(fullMob.data, 'base64'));
  console.log('Saved after-process-mobile-390.png');

  ws.close();
  edgeProc.kill();
  console.log('All responsive viewports and after screenshots captured successfully!');
}

run().catch(console.error);
