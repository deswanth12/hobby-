import { spawn } from 'child_process';
import path from 'path';

async function testDrawer() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-drawer');
  const edgeProc = spawn(edgePath, [
    '--remote-debugging-port=9245',
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'http://127.0.0.1:5173'
  ], { stdio: 'ignore' });

  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 300));
    try {
      const res = await fetch('http://127.0.0.1:9245/json/list');
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

        // Test 1: Check closed drawer accessibility and focusable count
        await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
        await send('Page.navigate', { url: 'http://127.0.0.1:5173/' });
        await new Promise(r => setTimeout(r, 1000));
        const closedA11y = await send('Runtime.evaluate', {
          expression: `(() => {
            const drawer = document.querySelector('div[role="dialog"]');
            const focusables = Array.from(drawer.querySelectorAll('a, button, input, select, textarea, [tabindex]'))
              .filter(el => {
                const s = window.getComputedStyle(el);
                return s.visibility !== 'hidden' && s.display !== 'none';
              });
            const cs = window.getComputedStyle(drawer);
            return {
              drawerAriaModal: drawer.getAttribute('aria-modal'),
              drawerAriaHidden: drawer.getAttribute('aria-hidden'),
              drawerVisibility: cs.visibility,
              keyboardFocusableCount: focusables.length
            };
          })()`,
          returnByValue: true
        });
        console.log('Closed drawer keyboard & a11y audit:', closedA11y.result.value);

        // Test 2: Portrait 375x812 open drawer height
        await send('Runtime.evaluate', { expression: `document.querySelector('button[aria-label="Toggle navigation menu"]').click()` });
        await new Promise(r => setTimeout(r, 500));
        const portraitAudit = await send('Runtime.evaluate', {
          expression: `(() => {
            const drawer = document.querySelector('div[role="dialog"]');
            const backdrop = document.querySelector('[data-testid="mobile-backdrop"]');
            return {
              drawerHeight: drawer.clientHeight,
              drawerScrollHeight: drawer.scrollHeight,
              windowHeight: window.innerHeight,
              headerHeight: document.querySelector('header').clientHeight,
              backdropHeight: backdrop ? backdrop.clientHeight : null,
              hasBodyScrollLock: document.body.style.overflow === 'hidden'
            };
          })()`,
          returnByValue: true
        });
        console.log('Portrait 375x812 open drawer audit:', portraitAudit.result.value);

        // Close drawer
        await send('Runtime.evaluate', { expression: `document.querySelector('button[aria-label="Close navigation menu"]').click()` });
        await new Promise(r => setTimeout(r, 500));

        // Test 2: Landscape drawer metrics
        await send('Emulation.setDeviceMetricsOverride', { width: 640, height: 320, deviceScaleFactor: 1, mobile: true });
        await new Promise(r => setTimeout(r, 500));
        await send('Runtime.evaluate', { expression: `document.querySelector('button[aria-label="Toggle navigation menu"]').click()` });
        await new Promise(r => setTimeout(r, 500));

        const landscapeAudit = await send('Runtime.evaluate', {
          expression: `(() => {
            const drawer = document.querySelector('div[role="dialog"]');
            const backdrop = document.querySelector('[data-testid="mobile-backdrop"]');
            const footer = drawer.querySelector('.border-t');
            const callBtn = footer.querySelector('a[href^="tel"]');
            const rect = callBtn.getBoundingClientRect();
            const cs = window.getComputedStyle(drawer);
            return {
              drawerHeight: drawer.clientHeight,
              drawerScrollHeight: drawer.scrollHeight,
              backdropHeight: backdrop ? backdrop.clientHeight : null,
              backdropWidth: backdrop ? backdrop.clientWidth : null,
              csHeight: cs.height,
              windowHeight: window.innerHeight,
              windowWidth: window.innerWidth,
              headerHeight: document.querySelector('header').clientHeight
            };
          })()`,
          returnByValue: true
        });
        console.log('Landscape 640x320 drawer audit:', landscapeAudit.result.value);

        // Close drawer
        await send('Runtime.evaluate', { expression: `document.querySelector('button[aria-label="Close navigation menu"]').click()` });
        await new Promise(r => setTimeout(r, 500));

        ws.close();
        break;
      }
    } catch (_) {}
  }
  edgeProc.kill();
}

testDrawer().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
