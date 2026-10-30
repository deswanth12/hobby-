import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile');
  const edgeProc = spawn(edgePath, [
    '--remote-debugging-port=9223',
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'http://127.0.0.1:5173'
  ], { stdio: 'ignore' });

  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 400));
    try {
      const res = await fetch('http://127.0.0.1:9223/json/list');
      const tabs = await res.json();
      if (tabs && tabs.length > 0) {
        const target = tabs.find(t => t.type === 'page');
        if (target) {
          const ws = new WebSocket(target.webSocketDebuggerUrl);
          await new Promise(res => { ws.onopen = res; });
          let msgId = 1;
          const send = (method, params = {}) => new Promise((resolve) => {
            const id = msgId++;
            const handler = (evt) => {
              const data = JSON.parse(evt.data);
              if (data.id === id) {
                ws.removeEventListener('message', handler);
                resolve(data.result);
              }
            };
            ws.addEventListener('message', handler);
            ws.send(JSON.stringify({ id, method, params }));
          });
          await send('Page.enable');
          const vps = [
            { name: 'laptop_1024px', width: 1024, height: 768, mobile: false, dsf: 1 },
            { name: 'desktop_1440px', width: 1440, height: 900, mobile: false, dsf: 1 },
            { name: 'widescreen_1920px', width: 1920, height: 1080, mobile: false, dsf: 1 }
          ];
          for (const vp of vps) {
            await send('Emulation.setDeviceMetricsOverride', { width: vp.width, height: vp.height, deviceScaleFactor: vp.dsf, mobile: vp.mobile });
            await send('Page.navigate', { url: 'http://127.0.0.1:5173/sec-ca-8f2a9c1e7d4b6/login' });
            await new Promise(r => setTimeout(r, 1200));
            const ss = await send('Page.captureScreenshot', { format: 'png' });
            fs.writeFileSync(path.resolve(`reports/screenshots/admin-login_${vp.name}.png`), Buffer.from(ss.data, 'base64'));
            console.log('Saved admin-login_' + vp.name);
          }
          ws.close();
          break;
        }
      }
    } catch (_) {}
  }
  edgeProc.kill();
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
