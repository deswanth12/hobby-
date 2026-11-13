import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

async function snapPartner320() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('tmp/edge-snap-partner');
  const edgeProc = spawn(edgePath, [
    '--remote-debugging-port=9459',
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  let ws = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch('http://127.0.0.1:9459/json/list');
      const tabs = await res.json();
      const target = tabs.find(t => t.type === 'page');
      if (target) {
        ws = new WebSocket(target.webSocketDebuggerUrl);
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
      const partner = Array.from(document.querySelectorAll('.card-v4-luxury')).find(c => c.textContent.includes('CA Kavitha Vijay'));
      if (partner) partner.scrollIntoView({ behavior: 'instant', block: 'center' });
      document.querySelectorAll('.fixed').forEach(d => d.style.display = 'none');
    `
  });
  await new Promise(r => setTimeout(r, 500));
  const snap = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('reports/screenshots/why_choose_us_partner_320px.png', Buffer.from(snap.data, 'base64'));
  ws.close();
  edgeProc.kill();
  console.log('Saved 320px partner screenshot');
}

snapPartner320().catch(console.error);
