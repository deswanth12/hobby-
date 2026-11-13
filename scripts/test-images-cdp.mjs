import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

async function testImages() {
  const PORT = 4299;
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: process.cwd(),
    shell: true,
    stdio: 'pipe'
  });

  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/`);
      if (res.ok) break;
    } catch (_) {}
  }

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-test-images');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const CDP_PORT = 9388;
  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${CDP_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  let ws = null;
  for (let i = 0; i < 35; i++) {
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
    preview.kill();
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

  const failedRequests = [];
  const consoleMessages = [];

  ws.addEventListener('message', (evt) => {
    const msg = JSON.parse(evt.data);
    if (msg.method === 'Network.responseReceived') {
      const status = msg.params.response.status;
      const url = msg.params.response.url;
      if (status >= 400) {
        failedRequests.push({ url, status });
      }
    } else if (msg.method === 'Log.entryAdded') {
      consoleMessages.push(msg.params.entry);
    }
  });

  await send('Page.enable');
  await send('DOM.enable');
  await send('Network.enable');
  await send('Log.enable');
  await send('Runtime.enable');

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  console.log('Navigating to http://127.0.0.1:' + PORT + '/');
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await new Promise(r => setTimeout(r, 1500));

  // Check all images in DOM
  const evalResult = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs.map(img => ({
          src: img.src,
          currentSrc: img.currentSrc,
          alt: img.alt,
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          offsetWidth: img.offsetWidth,
          offsetHeight: img.offsetHeight,
          visible: img.offsetParent !== null
        }));
      })()
    `,
    returnByValue: true
  });

  console.log('--- IMAGES IN HOMEPAGE DOM ---');
  console.log(JSON.stringify(evalResult.result.value, null, 2));

  console.log('--- FAILED REQUESTS (>= 400) ---');
  console.log(JSON.stringify(failedRequests, null, 2));

  console.log('--- CONSOLE ERRORS ---');
  console.log(JSON.stringify(consoleMessages.filter(m => m.level === 'error'), null, 2));

  // Capture screenshot of hero and about
  const heroScreenshot = await send('Page.captureScreenshot', {
    format: 'png',
    clip: { x: 0, y: 0, width: 1440, height: 900, scale: 1 }
  });
  fs.writeFileSync('reports/debug_hero_initial.png', Buffer.from(heroScreenshot.data, 'base64'));

  // Scroll to about
  await send('Runtime.evaluate', {
    expression: `
      const el = document.getElementById('about-us');
      if (el) el.scrollIntoView({ behavior: 'instant' });
    `
  });
  await new Promise(r => setTimeout(r, 500));

  const aboutScreenshot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('reports/debug_about_scrolled.png', Buffer.from(aboutScreenshot.data, 'base64'));

  console.log('Screenshots saved: reports/debug_hero_initial.png and reports/debug_about_scrolled.png');

  try { preview.kill(); } catch (_) {}
  try { edgeProc.kill(); } catch (_) {}
  process.exit(0);
}

testImages().catch(e => {
  console.error(e);
  process.exit(1);
});
