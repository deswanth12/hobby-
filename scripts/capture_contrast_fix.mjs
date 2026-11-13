import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const outDir = path.resolve('reports/screenshots');
fs.mkdirSync(outDir, { recursive: true });

async function capture() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('tmp/edge-contrast-verify');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const CDP_PORT = 9456;
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
    console.error('Failed to connect to Edge CDP');
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

  const viewports = [
    { name: '1440px', width: 1440, height: 900, mobile: false, dpr: 1 },
    { name: '768px', width: 768, height: 1024, mobile: false, dpr: 2 },
    { name: '390px', width: 390, height: 844, mobile: true, dpr: 3 },
    { name: '360px', width: 360, height: 800, mobile: true, dpr: 2 },
    { name: '320px', width: 320, height: 640, mobile: true, dpr: 2 }
  ];

  for (const vp of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.dpr,
      mobile: vp.mobile
    });

    await send('Page.navigate', { url: 'http://127.0.0.1:5173/#why-choose-us' });
    await new Promise(r => setTimeout(r, 1500));

    // Scroll to #why-choose-us and hide WhatsApp floating drawer for clean visual audit
    await send('Runtime.evaluate', {
      expression: `
        const el = document.getElementById('why-choose-us');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        const wa = document.querySelector('[aria-label="Contact via WhatsApp"]')?.closest('.fixed') || document.querySelector('.fixed.bottom-4.right-4') || document.querySelector('[role="complementary"]');
        if (wa) wa.style.display = 'none';
        document.querySelectorAll('.fixed.bottom-4').forEach(d => d.style.display = 'none');
        document.querySelectorAll('.fixed.bottom-6').forEach(d => d.style.display = 'none');
      `
    });
    await new Promise(r => setTimeout(r, 600));

    const snap = await send('Page.captureScreenshot', { format: 'png' });
    const imgBuffer = Buffer.from(snap.data, 'base64');
    const outPath = path.join(outDir, `why_choose_us_contrast_fixed_${vp.name}.png`);
    fs.writeFileSync(outPath, imgBuffer);
    console.log(`Saved screenshot to: ${outPath}`);
  }

  ws.close();
  edgeProc.kill();
}

capture().catch(e => {
  console.error(e);
  process.exit(1);
});
