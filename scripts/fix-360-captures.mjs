import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const outputDir = path.resolve('reports/final_visual_qa');

async function fix360px() {
  const PORT = 4198;
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: process.cwd(),
    shell: true,
    stdio: 'pipe'
  });

  // Wait for preview server to be fully active
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 250));
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/`);
      if (res.ok) break;
    } catch (_) {}
  }

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-360');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const CDP_PORT = 9288;
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

  await send('Emulation.setDeviceMetricsOverride', {
    width: 360,
    height: 740,
    deviceScaleFactor: 1,
    mobile: true
  });

  const pages = [
    { path: '/', name: 'homepage' },
    { path: '/#working-process', name: 'working_process' },
    { path: '/about', name: 'about' }
  ];

  for (const pg of pages) {
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}${pg.path}` });
    await new Promise(r => setTimeout(r, 800));
    const ss = await send('Page.captureScreenshot', { format: 'png' });
    const filename = `${pg.name}_360px.png`;
    fs.writeFileSync(path.join(outputDir, filename), Buffer.from(ss.data, 'base64'));
    console.log(`Updated ${filename} (size: ${ss.data.length} bytes)`);
  }

  try { edgeProc.kill(); } catch (_) {}
  try { preview.kill(); } catch (_) {}
  console.log('360px captures updated successfully!');
}

fix360px().catch(err => {
  console.error(err);
  process.exit(1);
});
