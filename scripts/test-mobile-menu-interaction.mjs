import { spawn } from 'child_process';
import path from 'path';

async function testMobileMenu() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile');
  const edgeProc = spawn(edgePath, [
    '--remote-debugging-port=9238',
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'http://127.0.0.1:5173'
  ], { stdio: 'ignore' });

  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 300));
    try {
      const res = await fetch('http://127.0.0.1:9238/json/list');
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
        await send('DOM.enable');

        // Set mobile viewport 375x812
        await send('Emulation.setDeviceMetricsOverride', {
          width: 375,
          height: 812,
          deviceScaleFactor: 2,
          mobile: true
        });

        await send('Page.navigate', { url: 'http://127.0.0.1:5173/' });
        await new Promise(r => setTimeout(r, 1000));

        // 1. Initial State: Drawer should be offscreen (translate-x-full) and body overflow unset
        const initialCheck = await send('Runtime.evaluate', {
          expression: `(() => {
            const drawer = document.querySelector('[aria-label="Mobile Navigation Drawer"]');
            const toggle = document.querySelector('button[aria-label="Toggle navigation menu"]');
            const bodyOverflow = document.body.style.overflow;
            const isOffscreen = drawer ? drawer.classList.contains('translate-x-full') : false;
            return JSON.stringify({
              hasToggle: !!toggle,
              hasDrawer: !!drawer,
              isOffscreen,
              bodyOverflow
            });
          })()`
        });
        console.log('1. Initial check:', initialCheck.result.value);

        // 2. Click toggle button to open drawer
        await send('Runtime.evaluate', {
          expression: `(() => {
            const toggle = document.querySelector('button[aria-label="Toggle navigation menu"]');
            toggle.click();
          })()`
        });
        await new Promise(r => setTimeout(r, 400));

        // 3. Open State: Drawer should have translate-x-0 and body overflow: hidden
        const openCheck = await send('Runtime.evaluate', {
          expression: `(() => {
            const drawer = document.querySelector('[aria-label="Mobile Navigation Drawer"]');
            const bodyOverflow = document.body.style.overflow;
            const isOpen = drawer ? drawer.classList.contains('translate-x-0') : false;
            return JSON.stringify({
              isOpen,
              bodyOverflow
            });
          })()`
        });
        console.log('2. Open check:', openCheck.result.value);

        // 4. Test Escape key closes drawer
        await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
        await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
        await new Promise(r => setTimeout(r, 400));

        const escapeCheck = await send('Runtime.evaluate', {
          expression: `(() => {
            const drawer = document.querySelector('[aria-label="Mobile Navigation Drawer"]');
            const bodyOverflow = document.body.style.overflow;
            const isClosed = drawer ? drawer.classList.contains('translate-x-full') : false;
            return JSON.stringify({
              isClosed,
              bodyOverflow
            });
          })()`
        });
        console.log('3. Escape key check:', escapeCheck.result.value);

        // 5. Open again and click a navigation link
        await send('Runtime.evaluate', {
          expression: `(() => {
            const toggle = document.querySelector('button[aria-label="Toggle navigation menu"]');
            toggle.click();
          })()`
        });
        await new Promise(r => setTimeout(r, 400));

        await send('Runtime.evaluate', {
          expression: `(() => {
            const aboutLink = Array.from(document.querySelectorAll('[aria-label="Mobile Navigation Drawer"] a')).find(a => a.textContent.includes('About Firm'));
            if (aboutLink) aboutLink.click();
          })()`
        });
        await new Promise(r => setTimeout(r, 800));

        const navCheck = await send('Runtime.evaluate', {
          expression: `(() => {
            const drawer = document.querySelector('[aria-label="Mobile Navigation Drawer"]');
            const bodyOverflow = document.body.style.overflow;
            const currentPath = window.location.pathname;
            const isClosed = drawer ? drawer.classList.contains('translate-x-full') : false;
            return JSON.stringify({
              currentPath,
              isClosed,
              bodyOverflow
            });
          })()`
        });
        console.log('4. Navigation click check:', navCheck.result.value);

        ws.close();
        break;
      }
    } catch (e) {
      // retry
    }
  }
  edgeProc.kill();
}

testMobileMenu().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
