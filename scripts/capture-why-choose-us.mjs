import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const outputDir = path.resolve('reports/final_visual_qa');
const artDir = path.resolve('C:/Users/k deswanth/.gemini/antigravity/brain/441eee2e-7fd3-42ce-bd96-eec34be60162');

async function capture() {
  const PORT = 4201;
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: process.cwd(),
    shell: true,
    stdio: 'pipe'
  });

  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 250));
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/#why-choose-us`);
      if (res.ok) break;
    } catch (_) {}
  }

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-why-choose-us');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const CDP_PORT = 9295;
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
    { width: 768, height: 1024, name: '768px' },
    { width: 390, height: 844, name: '390px' }
  ];

  for (const vp of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 1024
    });

    const url = `http://127.0.0.1:${PORT}/#why-choose-us`;
    await send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, 1200));

    // Scroll directly to #why-choose-us to get a perfect framing
    await send('Runtime.evaluate', {
      expression: `
        const el = document.getElementById('why-choose-us');
        if (el) {
          const rect = el.getBoundingClientRect();
          window.scrollTo(0, window.pageYOffset + rect.top - 80);
        }
      `
    });
    await new Promise(r => setTimeout(r, 600));

    const ss = await send('Page.captureScreenshot', { format: 'png' });
    const filename = `why_choose_us_${vp.name}.png`;
    const buf = Buffer.from(ss.data, 'base64');
    
    fs.writeFileSync(path.join(outputDir, filename), buf);
    if (fs.existsSync(artDir)) {
      fs.writeFileSync(path.join(artDir, filename), buf);
    }
    console.log(`Captured ${filename} (${buf.length} bytes)`);
  }

  try { edgeProc.kill(); } catch (_) {}
  try { preview.kill(); } catch (_) {}
  console.log('All responsive Why Choose Us screenshots captured successfully!');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
