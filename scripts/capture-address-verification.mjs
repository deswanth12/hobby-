import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const OUT_DIR = path.resolve('reports/screenshots/address-verification');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function capture() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-addr-snap');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const port = 9260;
  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'http://127.0.0.1:5173'
  ], { stdio: 'ignore' });

  let ws = null;
  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 350));
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
    edgeProc.kill();
    throw new Error('Failed to connect to Edge CDP on port ' + port);
  }

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const reqId = id++;
    const timer = setTimeout(() => reject(new Error(`Timeout on ${method}`)), 15000);
    const handler = evt => {
      const d = JSON.parse(evt.data);
      if (d.id === reqId) {
        clearTimeout(timer);
        ws.removeEventListener('message', handler);
        if (d.error) reject(new Error(d.error.message));
        else resolve(d.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: reqId, method, params }));
  });

  await send('Page.enable');
  await send('DOM.enable');

  async function takeScreenshot(url, filename, width = 1280, height = 900) {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 768
    });
    await send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 2000));
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const filePath = path.join(OUT_DIR, filename);
    fs.writeFileSync(filePath, Buffer.from(shot.data, 'base64'));
    console.log(`Saved screenshot: ${filename} (${(shot.data.length / 1024).toFixed(1)} KB)`);
  }

  try {
    await takeScreenshot('http://127.0.0.1:5173/contact', 'contact_page_chambers_address.png', 1280, 1000);
    await takeScreenshot('http://127.0.0.1:5173/locations', 'locations_page_chambers_address.png', 1280, 1000);
    await takeScreenshot('http://127.0.0.1:5173/contact', 'contact_mobile_390px.png', 390, 844);
    await takeScreenshot('http://127.0.0.1:5173/brand/index.html', 'brand_assets_showcase.png', 1280, 1000);
  } finally {
    ws.close();
    edgeProc.kill();
  }
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
