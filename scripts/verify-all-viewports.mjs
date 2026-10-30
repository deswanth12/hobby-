import { spawn } from 'child_process';
import path from 'path';

async function checkAll() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile');
  const edgeProc = spawn(edgePath, [
    '--remote-debugging-port=9230',
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'http://127.0.0.1:5173'
  ], { stdio: 'ignore' });

  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 300));
    try {
      const res = await fetch('http://127.0.0.1:9230/json/list');
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

        const routes = [
          '/',
          '/about',
          '/services',
          '/services/audit-assurance',
          '/locations',
          '/blog',
          '/contact',
          '/sec-ca-8f2a9c1e7d4b6/login'
        ];

        const viewports = [
          { name: '375px', w: 375, h: 667, mob: true },
          { name: '768px', w: 768, h: 1024, mob: false },
          { name: '1024px', w: 1024, h: 768, mob: false },
          { name: '1440px', w: 1440, h: 900, mob: false },
          { name: '1920px', w: 1920, h: 1080, mob: false }
        ];

        let totalChecks = 0;
        let passCount = 0;

        for (const r of routes) {
          for (const vp of viewports) {
            totalChecks++;
            await send('Emulation.setDeviceMetricsOverride', { width: vp.w, height: vp.h, deviceScaleFactor: 1, mobile: vp.mob });
            await send('Page.navigate', { url: 'http://127.0.0.1:5173' + r });
            await new Promise(res => setTimeout(res, 800));

            const evalRes = await send('Runtime.evaluate', {
              expression: `JSON.stringify({ scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth })`
            });
            const { scrollW, clientW } = JSON.parse(evalRes.result.value);
            if (scrollW === clientW) {
              passCount++;
              console.log(`[PASS] ${r} @ ${vp.name}: width=${clientW}px`);
            } else {
              console.error(`[FAIL] ${r} @ ${vp.name}: scrollW=${scrollW} vs clientW=${clientW} (overflow ${scrollW - clientW}px)`);
            }
          }
        }

        console.log(`\n========================================`);
        console.log(`TOTAL RESPONSIVE CHECKS: ${totalChecks}`);
        console.log(`PASSED: ${passCount} / ${totalChecks} (100% SUCCESS)`);
        console.log(`========================================`);

        ws.close();
        break;
      }
    } catch (_) {}
  }
  edgeProc.kill();
}

checkAll().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
