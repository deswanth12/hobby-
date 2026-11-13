import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const v44Dir = path.resolve('reports/screenshots/v4_4_audit');
const afterDir = path.resolve('reports/screenshots/after');
if (!fs.existsSync(v44Dir)) fs.mkdirSync(v44Dir, { recursive: true });
if (!fs.existsSync(afterDir)) fs.mkdirSync(afterDir, { recursive: true });

async function runAudit() {
  console.log('================================================================');
  console.log('   PROJECT V4.4: FINAL TEXTURE POLISH & SCREENSHOT AUDIT         ');
  console.log('================================================================');

  // 1. Launch Vite preview on port 4199
  console.log('[1/4] Starting production preview server on port 4199...');
  const preview = spawn('npx', ['vite', 'preview', '--port', '4199', '--strictPort'], {
    cwd: process.cwd(),
    shell: true,
    stdio: 'pipe'
  });

  await new Promise((resolve) => {
    preview.stdout.on('data', data => {
      const msg = data.toString();
      if (msg.includes('4199') || msg.includes('Local:')) resolve();
    });
    setTimeout(resolve, 3000);
  });

  // 2. Launch Headless Edge DevTools
  console.log('[2/4] Connecting Headless Browser via Chrome DevTools Protocol...');
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-v44-audit');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const port = 9289;
  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  let ws = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
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
    try { edgeProc.kill(); } catch (_) {}
    try { preview.kill(); } catch (_) {}
    throw new Error('Could not connect to Edge DevTools');
  }

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const reqId = id++;
    const timer = setTimeout(() => reject(new Error('Timeout on ' + method)), 20000);
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
  await send('Runtime.enable');

  const evalJs = async (expr) => {
    const res = await send('Runtime.evaluate', {
      expression: expr,
      returnByValue: true
    });
    return res.result?.value;
  };

  const viewports = [
    { width: 390, height: 844, name: '390px-mobile' },
    { width: 768, height: 1024, name: '768px-tablet' },
    { width: 1024, height: 768, name: '1024px-laptop' },
    { width: 1440, height: 900, name: '1440px-desktop' }
  ];

  const routes = [
    { path: '/', label: 'homepage' },
    { path: '/about', label: 'about' },
    { path: '/services', label: 'services' },
    { path: '/contact', label: 'contact' }
  ];

  console.log('\n[3/4] Testing Viewports, Settling Animations & Capturing High-Quality Screenshots...');
  const auditResults = [];

  for (const vp of viewports) {
    console.log(`\n▶ Testing Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 1024
    });

    for (const r of routes) {
      await send('Page.navigate', { url: `http://127.0.0.1:4199${r.path}` });

      // Step A: Trigger full scroll to activate lazy-loading observers instantly
      await new Promise(res => setTimeout(res, 500));
      await evalJs(`
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'instant' });
      `);
      await new Promise(res => setTimeout(res, 250));
      await evalJs(`
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
      `);
      await new Promise(res => setTimeout(res, 250));

      // Step B: Guaranteed instantaneous reset to scroll top (0,0)
      await evalJs(`
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
        document.documentElement.style.scrollBehavior = '';
      `);

      // Step C: Wait for all entrance animations (700ms - 1400ms duration + delays)
      // and ensure images finish loading, rotating text stabilizes, and scrollY is confirmed 0
      await evalJs(`
        new Promise((resolve) => {
          const imgs = Array.from(document.images);
          const pending = imgs.filter(img => !img.complete);
          let count = pending.length;
          if (count === 0) {
            resolve();
            return;
          }
          pending.forEach(img => {
            img.onload = img.onerror = () => {
              count--;
              if (count === 0) resolve();
            };
          });
          setTimeout(resolve, 2000);
        })
      `);

      // Ensure scroll position is locked strictly at top 0 before screen capture
      await evalJs(`
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
      `);

      // Additional settling time for CSS keyframes, rotating text & float micro-motion stability
      await new Promise(res => setTimeout(res, 1200));

      const overflow = await evalJs(`
        (() => {
          const docWidth = document.documentElement.clientWidth;
          const scrollWidth = document.documentElement.scrollWidth;
          const bodyWidth = document.body ? document.body.scrollWidth : 0;
          const maxW = Math.max(scrollWidth, bodyWidth);
          return maxW > docWidth + 1 ? maxW - docWidth : 0;
        })()
      `);

      const passed = overflow === 0;
      console.log(`  ${passed ? '✔ [PASS]' : '✖ [FAIL]'} ${r.label} @ ${vp.width}px: overflow=${overflow}px`);
      auditResults.push({ route: r.label, viewport: vp.name, width: vp.width, overflow, passed });

      // Capture screenshot after full animation completion & stable state
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const imgBuffer = Buffer.from(shot.data, 'base64');
      
      // Save to v44Dir
      fs.writeFileSync(path.join(v44Dir, `${r.label}_v4_4_${vp.width}px.png`), imgBuffer);
      // Save to afterDir
      fs.writeFileSync(path.join(afterDir, `${r.label}-${vp.width}px.png`), imgBuffer);
    }
  }

  // 4. Verify Section Textures in DOM
  console.log('\n[4/4] Verifying Section Textures in DOM...');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://127.0.0.1:4199/' });
  await new Promise(res => setTimeout(res, 1200));

  const domCheck = await evalJs(`
    (() => {
      const hero = document.querySelector('section.texture-paper-grain') !== null;
      const whyChooseUs = document.querySelector('section.texture-geometric-paper') !== null;
      const services = document.querySelector('section.texture-champagne-grain') !== null;
      const process = document.querySelector('section.texture-linen') !== null;
      const contact = document.querySelector('section.texture-ivory-paper') !== null;
      const about = document.querySelector('section.texture-warm-plaster') !== null;
      return { hero, whyChooseUs, services, process, contact, about };
    })()
  `);

  console.log('Homepage Section Textures Verified:', domCheck);

  // Close Edge & Vite preview
  ws.close();
  try { edgeProc.kill(); } catch (_) {}
  try { preview.kill(); } catch (_) {}

  // Write summary JSON
  fs.writeFileSync('reports/v4_4_audit_results.json', JSON.stringify({ auditResults, domCheck }, null, 2));
  console.log('\nAudit complete! Results saved to reports/v4_4_audit_results.json');
}

runAudit().catch(err => {
  console.error(err);
  process.exit(1);
});
