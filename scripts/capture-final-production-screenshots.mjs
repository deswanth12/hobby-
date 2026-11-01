/**
 * Final Production Screenshot Capture Engine using Edge CDP
 * Captures Desktop (1440px) and Mobile (390px) screenshots for key surfaces:
 * - Home (/)
 * - About (/about)
 * - Services (/services)
 * - Blog (/blog)
 * - Contact (/contact)
 * - Audit & Assurance (/services/audit-assurance)
 * - Blog Article (/blog/corporate-tax-planning-2026)
 * Output: reports/screenshots/final/
 */

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const OUT_DIR = path.resolve('reports/screenshots/final');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about' },
  { name: 'services', path: '/services' },
  { name: 'blog', path: '/blog' },
  { name: 'contact', path: '/contact' },
  { name: 'service_audit_assurance', path: '/services/audit-assurance' },
  { name: 'blog_article_tax_planning', path: '/blog/corporate-tax-planning-2026' }
];

const VIEWPORTS = [
  { name: 'desktop_1440px', width: 1440, height: 900, deviceScaleFactor: 1, mobile: false },
  { name: 'mobile_390px', width: 390, height: 844, deviceScaleFactor: 2, mobile: true }
];

async function captureFinalScreenshots() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-final');
  
  let edgeProc = null;
  try {
    console.log('[CDP] Launching Edge headless with CDP on port 9224...');
    edgeProc = spawn(edgePath, [
      '--remote-debugging-port=9224',
      '--remote-allow-origins=*',
      `--user-data-dir=${profileDir}`,
      '--headless=new',
      'http://127.0.0.1:5173'
    ], { stdio: 'ignore' });

    let tabs = null;
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 500));
      try {
        const res = await fetch('http://127.0.0.1:9224/json/list');
        tabs = await res.json();
        if (tabs && tabs.length > 0) break;
      } catch (_) {}
    }

    if (!tabs || tabs.length === 0) {
      throw new Error('Edge CDP did not start in time on port 9224');
    }

    const target = tabs.find(t => t.type === 'page');
    if (!target) {
      throw new Error('No page target found on Edge CDP port 9224');
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
        await new Promise(r => setTimeout(r, 1200));

        const screenshot = await send('Page.captureScreenshot', { format: 'png' });
        const filename = `${page.name}-${vp.name}.png`;
        const outPath = path.join(OUT_DIR, filename);
        fs.writeFileSync(outPath, Buffer.from(screenshot.data, 'base64'));
        console.log(`  -> Saved: ${outPath} (${screenshot.data.length} bytes base64)`);
      }
    }

    ws.close();
    console.log('\n[SUCCESS] Captured all final production screenshots in reports/screenshots/final/');
  } finally {
    if (edgeProc) {
      console.log('[CDP] Closing Edge process...');
      edgeProc.kill();
    }
  }
}

captureFinalScreenshots().catch(err => {
  console.error('[ERROR] Final screenshot capture failed:', err);
  process.exit(1);
});
