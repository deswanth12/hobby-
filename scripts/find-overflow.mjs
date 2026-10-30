import { spawn } from 'child_process';
import path from 'path';

async function check() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile');
  const edgeProc = spawn(edgePath, [
    '--remote-debugging-port=9227',
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'http://127.0.0.1:5173'
  ], { stdio: 'ignore' });

  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 300));
    try {
      const res = await fetch('http://127.0.0.1:9227/json/list');
      const tabs = await res.json();
      const target = tabs.find(t => t.type === 'page');
      if (target) {
        const ws = new WebSocket(target.webSocketDebuggerUrl);
        await new Promise(r => { ws.onopen = r; });
        let id = 1;
        const send = (method, params = {}) => new Promise(resolve => {
          const reqId = id++;
          const handler = evt => {
            const d = JSON.parse(evt.data);
            if (d.id === reqId) {
              ws.removeEventListener('message', handler);
              resolve(d.result);
            }
          };
          ws.addEventListener('message', handler);
          ws.send(JSON.stringify({ id: reqId, method, params }));
        });

        await send('Page.enable');
        await send('Runtime.enable');
        await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 667, deviceScaleFactor: 1, mobile: true });
        await send('Page.navigate', { url: 'http://127.0.0.1:5173/' });
        await new Promise(r => setTimeout(r, 1200));

        const evalRes = await send('Runtime.evaluate', {
          expression: `(() => {
            const list = [];
            document.querySelectorAll('*').forEach(el => {
              const r = el.getBoundingClientRect();
              if (r.right > 375.5) {
                list.push({
                  tag: el.tagName,
                  class: (el.className || '').toString().slice(0, 50),
                  right: r.right,
                  width: r.width,
                  text: (el.innerText || '').slice(0, 30)
                });
              }
            });
            return JSON.stringify(list);
          })()`
        });

        console.log('Elements with bounding rect right > 375.5:');
        console.log(JSON.stringify(JSON.parse(evalRes.result.value), null, 2));

        ws.close();
        break;
      }
    } catch (_) {}
  }
  edgeProc.kill();
}

check().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
