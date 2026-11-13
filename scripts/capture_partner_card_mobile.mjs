import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const outDir = path.resolve('reports/screenshots');
fs.mkdirSync(outDir, { recursive: true });

async function captureMobileBottom() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('tmp/edge-contrast-verify-mob');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const CDP_PORT = 9458;
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

  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true
  });

  await send('Page.navigate', { url: 'http://127.0.0.1:5173/#why-choose-us' });
  await new Promise(r => setTimeout(r, 1500));

  await send('Runtime.evaluate', {
    expression: `
      document.querySelectorAll('.fixed').forEach(d => d.style.display = 'none');
      // Scroll to partner card
      const partnerPlaque = Array.from(document.querySelectorAll('span')).find(s => s.textContent.includes('Direct Partner Attention'))?.closest('.rounded-2xl');
      if (partnerPlaque) partnerPlaque.scrollIntoView({ behavior: 'instant', block: 'center' });
    `
  });
  await new Promise(r => setTimeout(r, 500));

  const snap = await send('Page.captureScreenshot', { format: 'png' });
  const imgBuffer = Buffer.from(snap.data, 'base64');
  const outPath = path.join(outDir, 'why_choose_us_partner_card_390px.png');
  fs.writeFileSync(outPath, imgBuffer);
  console.log(`Saved screenshot to: ${outPath}`);

  ws.close();
  edgeProc.kill();
}

captureMobileBottom().catch(e => {
  console.error(e);
  process.exit(1);
});
