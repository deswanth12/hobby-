import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const outDir = path.resolve('reports/kinetic_typography');
const framesDir = path.join(outDir, 'frames');
const artDir = path.resolve('C:/Users/k deswanth/.gemini/antigravity/brain/441eee2e-7fd3-42ce-bd96-eec34be60162');

async function recordExtra() {
  const PORT = 4236;
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
  const profileDir = path.resolve('reports/edge-profile-extra');
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

  // 1. Why Choose Us
  console.log('Recording Why Choose Us...');
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/#why-choose-us` });
  await new Promise(r => setTimeout(r, 300));
  for (let i = 0; i < 15; i++) {
    const ss = await send('Page.captureScreenshot', { format: 'png' });
    const buf = Buffer.from(ss.data, 'base64');
    fs.writeFileSync(path.join(framesDir, `why_choose_us_frame_${String(i).padStart(3, '0')}.png`), buf);
    await new Promise(r => setTimeout(r, 180));
  }

  // 2. Contact Page
  console.log('Recording Contact Heading...');
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/contact` });
  await new Promise(r => setTimeout(r, 250));
  for (let i = 0; i < 15; i++) {
    const ss = await send('Page.captureScreenshot', { format: 'png' });
    const buf = Buffer.from(ss.data, 'base64');
    fs.writeFileSync(path.join(framesDir, `contact_frame_${String(i).padStart(3, '0')}.png`), buf);
    await new Promise(r => setTimeout(r, 180));
  }

  ws.close();
  edgeProc.kill();
  preview.kill();
  console.log('Extra frames captured successfully!');
}

recordExtra().catch(err => {
  console.error(err);
  process.exit(1);
});
