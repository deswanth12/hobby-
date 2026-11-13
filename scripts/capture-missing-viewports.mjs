import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const outDir = path.resolve('reports/v4_2_cream');
fs.mkdirSync(outDir, { recursive: true });

async function capture() {
  const PORT = 4289;
  console.log(`Starting Vite preview on port ${PORT}...`);
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: process.cwd(),
    shell: true,
    stdio: 'pipe'
  });

  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/`);
      if (res.ok) break;
    } catch (_) {}
  }

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-missing');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const CDP_PORT = 9389;
  console.log(`Starting Headless Edge on CDP port ${CDP_PORT}...`);
  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${CDP_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  let ws = null;
  for (let i = 0; i < 35; i++) {
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
    console.error('Failed to connect to Edge CDP');
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
    { label: '768px', width: 768, height: 1024, mobile: true },
    { label: '390px', width: 390, height: 844, mobile: true },
  ];

  for (const t of targets) {
    console.log(`Setting viewport: ${t.label} (${t.width}x${t.height})`);
    await send('Emulation.setDeviceMetricsOverride', {
      width: t.width,
      height: t.height,
      deviceScaleFactor: 1,
      mobile: t.mobile
    });

    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
    await new Promise(r => setTimeout(r, 1500));

    // 1. Scroll to Why Choose Us
    await send('Runtime.evaluate', {
      expression: `document.getElementById('why-choose-us')?.scrollIntoView({ behavior: 'instant', block: 'start' });`
    });
    await new Promise(r => setTimeout(r, 800));
    const whyShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(outDir, `v4_2_section_why_choose_us_${t.label}.png`), Buffer.from(whyShot.data, 'base64'));
    console.log(`✓ Saved v4_2_section_why_choose_us_${t.label}.png`);

    // 2. Scroll to Working Process
    await send('Runtime.evaluate', {
      expression: `document.getElementById('working-process')?.scrollIntoView({ behavior: 'instant', block: 'start' });`
    });
    await new Promise(r => setTimeout(r, 800));
    const processShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(outDir, `v4_2_section_working_process_${t.label}.png`), Buffer.from(processShot.data, 'base64'));
    console.log(`✓ Saved v4_2_section_working_process_${t.label}.png`);
  }

  ws.close();
  edgeProc.kill();
  preview.kill();
  console.log('=== MISSING VIEWPORTS CAPTURED SUCCESSFULLY ===');
}

capture().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
