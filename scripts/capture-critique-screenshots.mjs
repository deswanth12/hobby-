import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

async function capture() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const outDir = path.resolve('reports/critique_screenshots');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const profileDir = path.resolve('reports/edge-profile-critique');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const port = 9260;
  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  let ws = null;
  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 250));
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
    throw new Error('Could not connect to Edge DevTools');
  }

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
  await send('Runtime.enable');

  const targets = [
    { name: '01_homepage', url: 'https://kavithaassociates.com/' },
    { name: '02_about', url: 'https://kavithaassociates.com/about' },
    { name: '03_services', url: 'https://kavithaassociates.com/services' },
    { name: '04_audit_assurance', url: 'https://kavithaassociates.com/services/audit-assurance' },
    { name: '05_industries', url: 'https://kavithaassociates.com/industries' },
    { name: '06_locations', url: 'https://kavithaassociates.com/locations' },
    { name: '07_blog', url: 'https://kavithaassociates.com/blog' },
    { name: '08_contact', url: 'https://kavithaassociates.com/contact' },
    { name: '09_carvi_homepage', url: 'https://www.carviassociates.com/' }
  ];

  const viewports = [
    { label: 'desktop', w: 1440, h: 900, mob: false },
    { label: 'mobile', w: 390, h: 844, mob: true }
  ];

  for (const t of targets) {
    for (const v of viewports) {
      console.log(`Capturing ${t.name} [${v.label}]...`);
      await send('Emulation.setDeviceMetricsOverride', {
        width: v.w,
        height: v.h,
        deviceScaleFactor: 1,
        mobile: v.mob
      });

      try {
        await send('Page.navigate', { url: t.url });
        await new Promise(r => setTimeout(r, 3000)); // wait for full render, fonts, animations

        // Get full layout height
        const metrics = await send('Page.getLayoutMetrics');
        const height = Math.min(Math.ceil(metrics.contentSize.height), 8000); // cap at 8000px to avoid memory overflow

        // Capture full page screenshot
        const screenshot = await send('Page.captureScreenshot', {
          format: 'jpeg',
          quality: 85,
          clip: {
            x: 0,
            y: 0,
            width: v.w,
            height: height,
            scale: 1
          },
          captureBeyondViewport: true
        });

        const filename = `${t.name}_${v.label}.jpg`;
        const filepath = path.join(outDir, filename);
        fs.writeFileSync(filepath, Buffer.from(screenshot.data, 'base64'));
        console.log(`  ✔ Saved ${filename} (${Math.round(screenshot.data.length / 1024)} KB)`);
      } catch (err) {
        console.error(`  ✖ Failed capturing ${t.name} [${v.label}]:`, err.message);
      }
    }
  }

  try { ws.close(); } catch (_) {}
  try { edgeProc.kill(); } catch (_) {}
  console.log('\nAll critique screenshots captured successfully in reports/critique_screenshots/');
}

capture().catch(err => {
  console.error('Fatal capture error:', err);
  process.exit(1);
});
