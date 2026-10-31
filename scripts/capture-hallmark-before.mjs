import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

async function captureBefore() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const outDir = path.resolve('reports/polish');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const profileDir = path.resolve('reports/edge-profile-before');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const port = 9270;
  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  let ws = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
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
    try { edgeProc.kill(); } catch (_) {}
    throw new Error('Could not connect to Edge DevTools');
  }

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const reqId = id++;
    const timer = setTimeout(() => reject(new Error('Timeout on ' + method)), 30000);
    const handler = evt => {
      const msg = JSON.parse(evt.data);
      if (msg.id === reqId) {
        ws.removeEventListener('message', handler);
        clearTimeout(timer);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: reqId, method, params }));
  });

  const viewports = [
    { name: 'before_1440', width: 1440, height: 900, mobile: false },
    { name: 'before_1280', width: 1280, height: 800, mobile: false },
    { name: 'before_768', width: 768, height: 1024, mobile: false },
    { name: 'before_390', width: 390, height: 844, mobile: true }
  ];

  try {
    await send('Page.enable');
    await send('DOM.enable');

    for (const vp of viewports) {
      console.log(`Setting viewport ${vp.name} (${vp.width}x${vp.height})...`);
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.mobile
      });

      await send('Page.navigate', { url: 'https://kavithaassociates.com' });
      await new Promise(r => setTimeout(r, 4500));

      const { data } = await send('Page.captureScreenshot', { format: 'png' });
      const outPath = path.join(outDir, `${vp.name}.png`);
      fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
      console.log(`Saved ${outPath}`);
    }
  } finally {
    ws.close();
    try { edgeProc.kill(); } catch (_) {}
  }
}

captureBefore().catch(console.error);
