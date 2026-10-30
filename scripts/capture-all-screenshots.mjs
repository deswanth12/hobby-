/**
 * Automated Screenshot Capture Engine using Edge CDP
 * Captures 7 major surfaces at Desktop (1440x900) and Mobile (390x844):
 * 1. Homepage (/)
 * 2. About (/about)
 * 3. Services (/services)
 * 4. Locations (/locations)
 * 5. Blog (/blog)
 * 6. Contact (/contact)
 * 7. Admin Login (/sec-ca-8f2a9c1e7d4b6/login)
 */

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const OUT_DIR = path.resolve('reports/screenshots');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const PAGES = [
  { name: 'homepage', path: '/' },
  { name: 'about', path: '/about' },
  { name: 'services', path: '/services' },
  { name: 'audit-assurance', path: '/services/audit-assurance' },
  { name: 'industries', path: '/industries' },
  { name: 'locations', path: '/locations' },
  { name: 'blog', path: '/blog' },
  { name: 'contact', path: '/contact' },
  { name: 'admin-login', path: '/sec-ca-8f2a9c1e7d4b6/login' },
];

const VIEWPORTS = [
  { name: 'mobile_320px', width: 320, height: 640, deviceScaleFactor: 2, mobile: true },
  { name: 'mobile_375px', width: 375, height: 812, deviceScaleFactor: 2, mobile: true },
  { name: 'mobile_390px', width: 390, height: 844, deviceScaleFactor: 2, mobile: true },
  { name: 'tablet_768px', width: 768, height: 1024, deviceScaleFactor: 2, mobile: true },
  { name: 'desktop_1440px', width: 1440, height: 900, deviceScaleFactor: 1, mobile: false },
  { name: 'desktop', width: 1440, height: 900, deviceScaleFactor: 1, mobile: false },
  { name: 'mobile', width: 390, height: 844, deviceScaleFactor: 2, mobile: true },
];

async function captureAll() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile');
  
  let edgeProc = null;
  try {
    console.log('[CDP] Launching Edge headless with CDP on port 9223...');
    edgeProc = spawn(edgePath, [
      '--remote-debugging-port=9223',
      '--remote-allow-origins=*',
      `--user-data-dir=${profileDir}`,
      '--headless=new',
      'http://127.0.0.1:5173'
    ], { stdio: 'ignore' });

    // Poll until CDP is ready
    let tabs = null;
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 500));
      try {
        const res = await fetch('http://127.0.0.1:9223/json/list');
        tabs = await res.json();
        if (tabs && tabs.length > 0) break;
      } catch (_) {}
    }

    if (!tabs || tabs.length === 0) {
      throw new Error('Edge CDP did not start in time on port 9223');
    }

    const target = tabs.find(t => t.type === 'page');
    if (!target) {
      throw new Error('No page target found on Edge CDP port 9223');
    }

  console.log('[CDP] Connecting to page WebSocket:', target.webSocketDebuggerUrl);
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });

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

  for (const page of PAGES) {
    const url = `http://127.0.0.1:5173${page.path}`;
    for (const vp of VIEWPORTS) {
      console.log(`[CAPTURING] ${page.name} @ ${vp.name} (${vp.width}x${vp.height})...`);
      
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: vp.deviceScaleFactor,
        mobile: vp.mobile
      });

      if (vp.mobile) {
        await send('Emulation.setUserAgentOverride', {
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
        });
      } else {
        await send('Emulation.setUserAgentOverride', {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
        });
      }

      await send('Page.navigate', { url });
      // Allow DOM, fonts, and images to settle
      await new Promise(r => setTimeout(r, 900));

      const screenshot = await send('Page.captureScreenshot', { format: 'png' });
      const filename = `${page.name}_${vp.name}.png`;
      const outPath = path.join(OUT_DIR, filename);
      fs.writeFileSync(outPath, Buffer.from(screenshot.data, 'base64'));
      console.log(`  -> Saved: ${outPath} (${screenshot.data.length} bytes base64)`);
    }
  }

    ws.close();
    console.log('\n[SUCCESS] Captured all 14 screenshots across Desktop and Mobile viewports.');
  } finally {
    if (edgeProc) {
      console.log('[CDP] Closing Edge process...');
      edgeProc.kill();
    }
  }
}

captureAll().catch(err => {
  console.error('[ERROR] Screenshot capture failed:', err);
  process.exit(1);
});
