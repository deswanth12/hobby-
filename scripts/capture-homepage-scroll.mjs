import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const outDir = path.resolve('reports');
const framesDir = path.resolve('reports/scroll_frames');
fs.mkdirSync(framesDir, { recursive: true });

async function run() {
  const PORT = 4249;
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
  const profileDir = path.resolve('reports/edge-profile-scroll');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const CDP_PORT = 9335;
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
  await send('Runtime.enable');

  // Desktop 1440x900
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  console.log('Navigating to Homepage...');
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await new Promise(r => setTimeout(r, 1200));

  // Determine total scroll height
  const heightResult = await send('Runtime.evaluate', {
    expression: 'Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)'
  });
  const totalHeight = heightResult.result.value || 7500;
  console.log(`Total homepage scroll height: ${totalHeight}px`);

  // Scroll down step by step and capture frames
  const step = 320;
  let frameIdx = 0;

  for (let y = 0; y <= totalHeight - 400; y += step) {
    await send('Runtime.evaluate', {
      expression: `window.scrollTo({ top: ${y}, behavior: 'instant' })`
    });
    await new Promise(r => setTimeout(r, 80));

    const ss = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(ss.data, 'base64');
    const fn = `scroll_frame_${String(frameIdx).padStart(3, '0')}.png`;
    fs.writeFileSync(path.join(framesDir, fn), buffer);
    frameIdx++;
  }

  // Scroll back to top
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0)` });
  await new Promise(r => setTimeout(r, 200));

  console.log(`Captured ${frameIdx} scroll frames.`);

  // Clean up
  ws.close();
  edgeProc.kill();
  preview.kill();
  console.log('Finished capturing scroll frames.');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
