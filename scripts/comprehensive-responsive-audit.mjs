import { spawn } from 'child_process';
import path from 'path';

async function runAudit() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile');
  const edgeProc = spawn(edgePath, [
    '--remote-debugging-port=9235',
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'http://127.0.0.1:5173'
  ], { stdio: 'ignore' });

  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 300));
    try {
      const res = await fetch('http://127.0.0.1:9235/json/list');
      const tabs = await res.json();
      const target = tabs.find(t => t.type === 'page');
      if (target) {
        const ws = new WebSocket(target.webSocketDebuggerUrl);
        await new Promise(r => { ws.onopen = r; });
        let id = 1;
        const send = (method, params = {}) => new Promise((resolve, reject) => {
          const reqId = id++;
          const handler = evt => {
            const d = JSON.parse(evt.data);
            if (d.id === reqId) {
              ws.removeEventListener('message', handler);
              if (d.error) reject(d.error);
              else resolve(d.result);
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
          '/industries',
          '/locations',
          '/blog',
          '/blog/statutory-audit-readiness-checklist-fy-2025-26',
          '/contact',
          '/sec-ca-8f2a9c1e7d4b6/login'
        ];

        const viewports = [
          { name: '320x640', w: 320, h: 640, mob: true },
          { name: '360x800', w: 360, h: 800, mob: true },
          { name: '375x812', w: 375, h: 812, mob: true },
          { name: '390x844', w: 390, h: 844, mob: true },
          { name: '414x896', w: 414, h: 896, mob: true },
          { name: '430x932', w: 430, h: 932, mob: true },
          { name: '768x1024', w: 768, h: 1024, mob: true },
          { name: '1024x768', w: 1024, h: 768, mob: false },
          { name: '1280x800', w: 1280, h: 800, mob: false },
          { name: '1440x900', w: 1440, h: 900, mob: false },
          { name: '1920x1080', w: 1920, h: 1080, mob: false },
          // Landscape:
          { name: '640x320 (land)', w: 640, h: 320, mob: true },
          { name: '844x390 (land)', w: 844, h: 390, mob: true }
        ];

        let totalChecks = 0;
        let failCount = 0;
        const failures = [];

        for (const r of routes) {
          for (const vp of viewports) {
            totalChecks++;
            await send('Emulation.setDeviceMetricsOverride', {
              width: vp.w,
              height: vp.h,
              deviceScaleFactor: 1,
              mobile: vp.mob
            });
            await send('Page.navigate', { url: 'http://127.0.0.1:5173' + r });
            await new Promise(res => setTimeout(res, 600));

            const evalRes = await send('Runtime.evaluate', {
              expression: `(() => {
                const docEl = document.documentElement;
                const scrollW = docEl.scrollWidth;
                const clientW = docEl.clientWidth;
                const diff = scrollW - clientW;
                let overflowingElements = [];
                if (diff > 1) {
                  document.querySelectorAll('*').forEach(el => {
                    const rect = el.getBoundingClientRect();
                    if (rect.right > clientW + 1) {
                      overflowingElements.push({
                        tag: el.tagName,
                        className: (el.className || '').toString().slice(0, 40),
                        right: Math.round(rect.right),
                        diff: Math.round(rect.right - clientW)
                      });
                    }
                  });
                }
                return JSON.stringify({
                  scrollW,
                  clientW,
                  diff,
                  overflowingElements: overflowingElements.slice(0, 5)
                });
              })()`
            });

            const data = JSON.parse(evalRes.result.value);
            if (data.diff <= 1) {
              console.log(`[PASS] ${r} @ ${vp.name}`);
            } else {
              failCount++;
              const failInfo = `[FAIL] ${r} @ ${vp.name}: overflow ${data.diff}px (scrollW=${data.scrollW}, clientW=${data.clientW})`;
              console.error(failInfo);
              console.error('Elements:', data.overflowingElements);
              failures.push({ route: r, viewport: vp.name, ...data });
            }
          }
        }

        console.log(`\n========================================`);
        console.log(`TOTAL AUDIT CHECKS: ${totalChecks}`);
        console.log(`PASSED: ${totalChecks - failCount} / ${totalChecks}`);
        console.log(`FAILED: ${failCount}`);
        console.log(`========================================`);
        if (failures.length > 0) {
          console.log('\nFailures summary:');
          console.log(JSON.stringify(failures, null, 2));
        }

        ws.close();
        break;
      }
    } catch (e) {
      // retry
    }
  }
  edgeProc.kill();
}

runAudit().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
