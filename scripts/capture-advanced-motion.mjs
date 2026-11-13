import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const outDir = path.resolve('reports/advanced_motion_qa');
const artDir = path.resolve('C:/Users/k deswanth/.gemini/antigravity/brain/441eee2e-7fd3-42ce-bd96-eec34be60162');
fs.mkdirSync(outDir, { recursive: true });

async function capture() {
  const PORT = 4225;
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: process.cwd(),
    shell: true,
    stdio: 'pipe'
  });

  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 250));
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/about`);
      if (res.ok) break;
    } catch (_) {}
  }

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-adv-motion');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const CDP_PORT = 9315;
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
    console.error('Failed to connect CDP');
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

  const targets = [
    { url: `http://127.0.0.1:${PORT}/`, name: 'homepage_hero' },
    { url: `http://127.0.0.1:${PORT}/#working-process`, name: 'working_process' },
    { url: `http://127.0.0.1:${PORT}/#why-choose-us`, name: 'why_choose_us' },
    { url: `http://127.0.0.1:${PORT}/about`, name: 'about' },
    { url: `http://127.0.0.1:${PORT}/services`, name: 'services' },
    { url: `http://127.0.0.1:${PORT}/contact`, name: 'contact' }
  ];

  const viewports = [
    { width: 1440, height: 900, label: '1440px' },
    { width: 768, height: 1024, label: '768px' },
    { width: 390, height: 844, label: '390px' }
  ];

  for (const vp of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width <= 768
    });

    for (const t of targets) {
      await send('Page.navigate', { url: t.url });
      await new Promise(r => setTimeout(r, 1400));

      const screenshot = await send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(screenshot.data, 'base64');
      const filename = `adv_motion_${t.name}_${vp.label}.png`;
      const outPath = path.join(outDir, filename);
      fs.writeFileSync(outPath, buffer);
      fs.writeFileSync(path.join(artDir, filename), buffer);
      console.log(`Captured ${filename} (${buffer.length} bytes)`);
    }
  }

  ws.close();
  edgeProc.kill();
  preview.kill();
  console.log('All Advanced Motion QA screenshots captured successfully!');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
