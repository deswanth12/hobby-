import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

async function snap320() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('tmp/edge-snap-320');
  const edgeProc = spawn(edgePath, [
    '--remote-debugging-port=9458',
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  let ws = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch('http://127.0.0.1:9458/json/list');
      const tabs = await res.json();
      if (tabs.length > 0) {
        ws = new WebSocket(tabs[0].webSocketDebuggerUrl);
        await new Promise(r => { ws.onopen = r; });
        break;
      }
    } catch (_) {}
  }

  let seq = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const id = seq++;
    const handler = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id === id) {
        ws.removeEventListener('message', handler);
        resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 320, height: 800, deviceScaleFactor: 2, mobile: true });
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/#why-choose-us' });
  await new Promise(r => setTimeout(r, 1500));
  await send('Runtime.evaluate', {
    expression: `
      const el = document.getElementById('why-choose-us');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      document.querySelectorAll('.fixed').forEach(d => d.style.display = 'none');
    `
  });
  await new Promise(r => setTimeout(r, 500));
  const snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('reports/screenshots/why_choose_us_adversarial_320px.png', Buffer.from(snap.data, 'base64'));
  ws.close();
  edgeProc.kill();
  console.log('Saved 320px screenshot');
}
snap320().catch(console.error);
