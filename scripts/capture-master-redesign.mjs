import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const outputDir = path.resolve('reports/final_visual_qa');
const legacyDir = path.resolve('reports/screenshots');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
if (!fs.existsSync(legacyDir)) fs.mkdirSync(legacyDir, { recursive: true });

async function capture() {
  const PORT = 4197;
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
  const profileDir = path.resolve('reports/edge-profile-redesign');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const CDP_PORT = 9299;
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
    try { edgeProc.kill(); } catch (_) {}
    try { preview.kill(); } catch (_) {}
    throw new Error('Failed to connect to browser on port ' + CDP_PORT);
  }

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const reqId = id++;
    const timer = setTimeout(() => reject(new Error('Timeout on ' + method)), 15000);
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
  await send('Runtime.enable');

  const viewports = [
    { width: 390, height: 844, name: '390px' },
    { width: 1440, height: 900, name: '1440px' }
  ];

  const pages = [
    { path: '/', name: 'homepage' },
    { path: '/#working-process', name: 'working_process' },
    { path: '/about', name: 'about' },
    { path: '/services', name: 'services' },
    { path: '/industries', name: 'industries' },
    { path: '/locations', name: 'locations' },
    { path: '/contact', name: 'contact' }
  ];

  for (const vp of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 1024
    });

    for (const pg of pages) {
      const url = `http://127.0.0.1:${PORT}${pg.path}`;
      await send('Page.navigate', { url });
      await new Promise(r => setTimeout(r, 800));

      const ss = await send('Page.captureScreenshot', { format: 'png' });
      const filename = `${pg.name}_${vp.name}.png`;
      const buf = Buffer.from(ss.data, 'base64');
      fs.writeFileSync(path.join(outputDir, filename), buf);
      fs.writeFileSync(path.join(legacyDir, filename), buf);
      console.log(`Captured ${filename} (${buf.length} bytes)`);
    }
  }

  try { edgeProc.kill(); } catch (_) {}
  try { preview.kill(); } catch (_) {}
  console.log('All responsive screenshots captured successfully!');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
