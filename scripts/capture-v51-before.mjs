import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const screenshotDir = path.resolve('reports/v51_screenshots/before');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

async function captureBefore() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-v51-before');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const CDP_PORT = 9322;
  console.log(`[V5.1 Before] Launching headless Edge CDP on port ${CDP_PORT}...`);
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
      if (target && target.webSocketDebuggerUrl) {
        ws = new WebSocket(target.webSocketDebuggerUrl);
        await new Promise(r => { ws.onopen = r; });
        break;
      }
    } catch (_) {}
  }

  if (!ws) {
    try { edgeProc.kill(); } catch (_) {}
    throw new Error('Failed to connect to CDP on port ' + CDP_PORT);
  }
  console.log('[V5.1 Before] WebSocket connected to Edge CDP.');

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const reqId = id++;
    const timer = setTimeout(() => reject(new Error('Timeout on ' + method)), 25000);
    const handler = evt => {
      const d = JSON.parse(evt.data);
      if (d.id === reqId) {
        clearTimeout(timer);
        ws.removeEventListener('message', handler);
        if (d.error) reject(new Error(d.error.message));
        else resolve(d.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: reqId, method, params }));
  });

  await send('Page.enable');
  await send('DOM.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  console.log('[V5.1 Before] Navigating to http://127.0.0.1:5174/ ...');
  await send('Page.navigate', { url: 'http://127.0.0.1:5174/' });
  await new Promise(r => setTimeout(r, 2500));

  // Function to capture element screenshot
  async function captureElement(selector, filename) {
    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('${selector}');
        if (!el) return null;
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
        const rect = el.getBoundingClientRect();
        return { x: window.scrollX + rect.x, y: window.scrollY + rect.y, width: rect.width, height: rect.height };
      })()`,
      returnByValue: true
    });

    await new Promise(r => setTimeout(r, 600));

    // Get fresh rect after scroll
    const freshRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('${selector}');
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      })()`,
      returnByValue: true
    });

    const rect = freshRes.result?.value;
    if (!rect) {
      console.warn(`Element not found: ${selector}`);
      return;
    }

    const clip = {
      x: Math.max(0, rect.x),
      y: Math.max(0, rect.y),
      width: rect.width,
      height: Math.min(rect.height, 1200),
      scale: 1
    };

    const ss = await send('Page.captureScreenshot', {
      format: 'png',
      clip
    });

    const outPath = path.join(screenshotDir, filename);
    fs.writeFileSync(outPath, Buffer.from(ss.data, 'base64'));
    console.log(`Saved before capture: ${filename}`);
  }

  // 1. Hero
  await captureElement('#hero-section', 'hero_before_1440px.png');
  await captureElement('#hero-section', 'hero_before_390px.png');
  // 2. Professional Insights
  await captureElement('#insights-overview', 'insights_before_1440px.png');
  // 3. Consultation CTA
  await captureElement('#consultation-cta', 'consultation_cta_before_1440px.png');
  // 4. Contact Section
  await captureElement('#contact-section', 'contact_before_1440px.png');

  // Also capture mobile contact view showing floating popup interaction
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 1000));
  await captureElement('#consultation-cta', 'consultation_cta_before_390px.png');
  await captureElement('#contact-section', 'contact_before_390px.png');

  ws.close();
  try { edgeProc.kill(); } catch (_) {}
  console.log('[V5.1 Before] All before screenshots captured successfully.');
}

captureBefore().catch(err => {
  console.error('[V5.1 Before] Error:', err);
  process.exit(1);
});
