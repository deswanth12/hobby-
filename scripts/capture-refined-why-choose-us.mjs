import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const outDir = path.resolve('reports/why_choose_us_refined');
const artDir = path.resolve('C:/Users/k deswanth/.gemini/antigravity/brain/441eee2e-7fd3-42ce-bd96-eec34be60162');

fs.mkdirSync(outDir, { recursive: true });

async function captureRefinedWhyChooseUs() {
  console.log('--- CAPTURING REFINED WHY CHOOSE US VIEWPORTS ---');

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-why-refined');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const CDP_PORT = 9345;
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
    { name: '390px', width: 390, height: 844, mobile: true, dpr: 3 }
  ];

  for (const vp of viewports) {
    console.log(`Setting viewport: ${vp.name}...`);
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.dpr,
      mobile: vp.mobile
    });

    await send('Page.navigate', { url: 'http://127.0.0.1:5173/#why-choose-us' });
    await new Promise(r => setTimeout(r, 1500));

    // Scroll to #why-choose-us
    await send('Runtime.evaluate', {
      expression: `
        const el = document.getElementById('why-choose-us');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      `
    });
    await new Promise(r => setTimeout(r, 500));

    const snap = await send('Page.captureScreenshot', { format: 'png' });
    const imgBuffer = Buffer.from(snap.data, 'base64');
    const outFilename = `why_choose_us_refined_${vp.name}.png`;
    const outFilePath = path.join(outDir, outFilename);
    const artFilePath = path.join(artDir, outFilename);

    fs.writeFileSync(outFilePath, imgBuffer);
    fs.writeFileSync(artFilePath, imgBuffer);
    console.log(`Saved screenshot: ${outFilePath}`);
  }

  ws.close();
  edgeProc.kill();
  console.log('Capture completed successfully!');
}

captureRefinedWhyChooseUs().catch(err => {
  console.error(err);
  process.exit(1);
});
