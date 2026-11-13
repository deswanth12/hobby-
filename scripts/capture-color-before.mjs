import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const beforeDir = path.resolve('reports/color_redesign_before');
fs.mkdirSync(beforeDir, { recursive: true });

async function capture() {
  const PORT = 4205;
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: process.cwd(),
    shell: true,
    stdio: 'pipe'
  });

  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 250));
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/about`);
      if (res.ok) break;
    } catch (_) {}
  }

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-color-before');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const CDP_PORT = 9294;
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
    throw new Error('Failed to connect to CDP on port ' + CDP_PORT);
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
    { width: 1440, height: 950, name: '1440px' },
    { width: 390, height: 844, name: '390px' }
  ];

  const targets = [
    { url: `http://127.0.0.1:${PORT}/`, name: 'homepage' },
    { url: `http://127.0.0.1:${PORT}/about`, name: 'about' },
    { url: `http://127.0.0.1:${PORT}/services`, name: 'services' },
    { url: `http://127.0.0.1:${PORT}/services/audit-assurance`, name: 'audit_spotlight' },
    { url: `http://127.0.0.1:${PORT}/contact`, name: 'contact' }
  ];

  for (const vp of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 1024
    });

    for (const t of targets) {
      await send('Page.navigate', { url: t.url });
      await new Promise(r => setTimeout(r, 1200));

      const ss = await send('Page.captureScreenshot', { format: 'png' });
      const filename = `before_${t.name}_${vp.name}.png`;
      const buf = Buffer.from(ss.data, 'base64');
      
      fs.writeFileSync(path.join(beforeDir, filename), buf);
      console.log(`Captured ${filename} (${buf.length} bytes)`);
    }
  }

  try { edgeProc.kill(); } catch (_) {}
  try { preview.kill(); } catch (_) {}
  console.log('All Before screenshots captured successfully!');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
