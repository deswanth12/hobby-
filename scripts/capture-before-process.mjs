import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const OUT_DIR = path.resolve('reports/process_screenshots');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-before');
  const edgeProc = spawn(edgePath, [
    '--remote-debugging-port=9250',
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  let tabs = null;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 400));
    try {
      const res = await fetch('http://127.0.0.1:9250/json/list');
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

  // Desktop 1440
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/' });
  await new Promise(r => setTimeout(r, 1500));

  await send('Runtime.evaluate', {
    expression: `
      document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, .scroll-reveal-image').forEach(el => el.classList.add('is-revealed'));
      const sec = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('How We Work With You') || s.textContent.includes('Our Methodology') || s.textContent.includes('OUR WORKING PROCESS'));
      if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'start' });
    `
  });
  await new Promise(r => setTimeout(r, 600));

  const ssDesk = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(OUT_DIR, 'before-process-desktop-1440.png'), Buffer.from(ssDesk.data, 'base64'));
  console.log('Saved before-process-desktop-1440.png');

  // Mobile 390
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await new Promise(r => setTimeout(r, 600));
  await send('Runtime.evaluate', {
    expression: `
      const sec = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('How We Work With You') || s.textContent.includes('Our Methodology') || s.textContent.includes('OUR WORKING PROCESS'));
      if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'start' });
    `
  });
  await new Promise(r => setTimeout(r, 600));

  const ssMob = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(OUT_DIR, 'before-process-mobile-390.png'), Buffer.from(ssMob.data, 'base64'));
  console.log('Saved before-process-mobile-390.png');

  ws.close();
  edgeProc.kill();
  console.log('Done before capture.');
}

run().catch(console.error);
