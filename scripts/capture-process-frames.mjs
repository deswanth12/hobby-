import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const framesDir = path.resolve('reports/final_motion_audit/frames');

async function captureProcess() {
  const PORT = 4235;
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: process.cwd(),
    shell: true,
    stdio: 'pipe'
  });

  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 250));
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/`);
      if (res.ok) break;
    } catch (_) {}
  }

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-process-audit');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const CDP_PORT = 9325;
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

  await send('Page.enable');
  await send('DOM.enable');

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await new Promise(r => setTimeout(r, 1200));

  // Scroll smoothly to working process
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('working-process');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`
  });
  await new Promise(r => setTimeout(r, 800));

  console.log('Capturing 16 process frames...');
  for (let f = 0; f < 16; f++) {
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const framePath = path.join(framesDir, `process_frame_${String(f).padStart(2, '0')}.png`);
    fs.writeFileSync(framePath, Buffer.from(shot.data, 'base64'));
    await new Promise(r => setTimeout(r, 200));
  }
  console.log('Captured 16 process frames successfully!');

  // Also test reduced motion with the fixed CSS
  await send('Emulation.setEmulatedMedia', {
    media: 'screen',
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
  });
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await new Promise(r => setTimeout(r, 1000));

  const check = await send('Runtime.evaluate', {
    expression: `(() => {
      const hero = document.querySelector('.motion-float-hero');
      const dot = document.querySelector('.motion-dot-wave-1');
      return {
        heroAnim: hero ? getComputedStyle(hero).animationName : 'none',
        dotAnim: dot ? getComputedStyle(dot).animationName : 'none'
      };
    })()`,
    returnByValue: true
  });
  console.log('Verified reduced motion:', check.result.value);

  ws.close();
  edgeProc.kill();
  preview.kill();
}

captureProcess().catch(err => {
  console.error(err);
  process.exit(1);
});
