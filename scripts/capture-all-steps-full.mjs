import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const OUT_DIR = path.resolve('reports/process_screenshots');

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-fullsteps');
  const edgeProc = spawn(edgePath, [
    '--remote-debugging-port=9252',
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  let tabs = null;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 400));
    try {
      const res = await fetch('http://127.0.0.1:9252/json/list');
      tabs = await res.json();
      if (tabs && tabs.length > 0) break;
    } catch (_) {}
  }

  const target = tabs.find(t => t.type === 'page');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  let msgId = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = msgId++;
    const handler = (evt) => {
      const data = JSON.parse(evt.data);
      if (data.id === id) {
        ws.removeEventListener('message', handler);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });

  await send('Page.enable');
  await send('Runtime.enable');

  // Desktop 1440 Full Section capture
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/' });
  await new Promise(r => setTimeout(r, 1200));

  const rectEval = await send('Runtime.evaluate', {
    expression: `
      (() => {
        document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, .scroll-reveal-image').forEach(el => el.classList.add('is-revealed'));
        const sec = document.getElementById('working-process');
        if (sec) {
          const r = sec.getBoundingClientRect();
          return { x: 0, y: r.top + window.scrollY, width: 1440, height: r.height };
        }
        return null;
      })()
    `,
    returnByValue: true
  });

  if (rectEval.result.value) {
    const { x, y, width, height } = rectEval.result.value;
    
    // Scroll smoothly down the section to ensure all images load & paint
    for (let scrollY = y; scrollY < y + height; scrollY += 500) {
      await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${scrollY});` });
      await new Promise(r => setTimeout(r, 150));
    }
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y});` });
    
    // Explicitly wait for all image decodes in browser context
    await send('Runtime.evaluate', {
      awaitPromise: true,
      expression: `
        Promise.all(Array.from(document.querySelectorAll('#working-process img')).map(img => {
          if (img.complete) return img.decode().catch(() => null);
          return new Promise(r => { img.onload = img.onerror = () => { img.decode().catch(()=>null).then(r); }; });
        }))
      `
    });
    await new Promise(r => setTimeout(r, 600));

    const clipSS = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true,
      clip: { x, y, width, height, scale: 1 }
    });
    fs.writeFileSync(path.join(OUT_DIR, 'after-process-desktop-full.png'), Buffer.from(clipSS.data, 'base64'));
    console.log('Saved after-process-desktop-full.png');
  }

  // Mobile 390 Full Section capture
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/' });
  await new Promise(r => setTimeout(r, 1200));

  const mobRectEval = await send('Runtime.evaluate', {
    expression: `
      (() => {
        document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, .scroll-reveal-image').forEach(el => el.classList.add('is-revealed'));
        const sec = document.getElementById('working-process');
        if (sec) {
          const r = sec.getBoundingClientRect();
          return { x: 0, y: r.top + window.scrollY, width: 390, height: r.height };
        }
        return null;
      })()
    `,
    returnByValue: true
  });

  if (mobRectEval.result.value) {
    const { x, y, width, height } = mobRectEval.result.value;

    for (let scrollY = y; scrollY < y + height; scrollY += 500) {
      await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${scrollY});` });
      await new Promise(r => setTimeout(r, 150));
    }
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y});` });
    
    // Explicitly wait for all image decodes in browser context
    await send('Runtime.evaluate', {
      awaitPromise: true,
      expression: `
        Promise.all(Array.from(document.querySelectorAll('#working-process img')).map(img => {
          if (img.complete) return img.decode().catch(() => null);
          return new Promise(r => { img.onload = img.onerror = () => { img.decode().catch(()=>null).then(r); }; });
        }))
      `
    });
    await new Promise(r => setTimeout(r, 600));

    const clipSS = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true,
      clip: { x, y, width, height, scale: 1 }
    });
    fs.writeFileSync(path.join(OUT_DIR, 'after-process-mobile-full.png'), Buffer.from(clipSS.data, 'base64'));
    console.log('Saved after-process-mobile-full.png');
  }

  ws.close();
  edgeProc.kill();
  console.log('Finished full section captures.');
}

run().catch(console.error);
