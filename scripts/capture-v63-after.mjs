import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const TARGET_HOST = 'http://localhost:5173';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const REMOTE_DEBUGGING_PORT = 9228;
const SCREENSHOT_DIR = path.resolve('reports/screenshots/v63_after');

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

async function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

class CDPConnection {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    return new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
      this.ws.onmessage = (event) => {
        const parsed = JSON.parse(event.data);
        if (parsed.id && this.callbacks.has(parsed.id)) {
          const { resolve, reject } = this.callbacks.get(parsed.id);
          this.callbacks.delete(parsed.id);
          if (parsed.error) reject(new Error(parsed.error.message));
          else resolve(parsed.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  console.log('Launching headless browser to capture V6.3 AFTER screenshots...');
  const edgeProc = spawn(EDGE_PATH, [
    `--remote-debugging-port=${REMOTE_DEBUGGING_PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + path.resolve('tmp/edge-v63-after')
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const targets = await getJson(`http://127.0.0.1:${REMOTE_DEBUGGING_PORT}/json`);
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const cdp = new CDPConnection(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Page.enable');
    await cdp.send('DOM.enable');

    const sections = [
      { name: '01_hero', selector: '#main-content, section:first-of-type' },
      { name: '02_about', selector: '#about-overview' },
      { name: '03_services', selector: '#services-overview' },
      { name: '04_why_choose_us', selector: '#why-choose-us' },
      { name: '05_working_process', selector: '#working-process' },
      { name: '06_industries', selector: '#industries-overview' },
      { name: '07_insights', selector: '#insights-overview' },
      { name: '08_contact', selector: '#consultation-cta, #contact, #contact-section' }
    ];

    const viewports = [
      { mode: 'desktop', width: 1440, height: 900, mobile: false },
      { mode: 'mobile', width: 390, height: 844, mobile: true },
      { mode: 'small_mobile', width: 320, height: 568, mobile: true },
      { mode: 'tablet', width: 768, height: 1024, mobile: false },
      { mode: 'ultrawide', width: 1920, height: 1080, mobile: false }
    ];

    for (const vp of viewports) {
      console.log(`Setting viewport: ${vp.mode} (${vp.width}x${vp.height})...`);
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.mobile
      });

      await cdp.send('Page.navigate', { url: TARGET_HOST });
      await new Promise(r => setTimeout(r, 2000));

      // For standard desktop and mobile, capture all 8 sections
      if (vp.mode === 'desktop' || vp.mode === 'mobile') {
        for (const sec of sections) {
          console.log(`  Capturing ${sec.name} (${vp.mode})...`);
          await cdp.send('Runtime.evaluate', {
            expression: `
              (() => {
                const el = document.querySelector('${sec.selector}');
                if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
              })()
            `
          });
          await new Promise(r => setTimeout(r, 400));

          const screenshot = await cdp.send('Page.captureScreenshot', { format: 'png' });
          const filePath = path.join(SCREENSHOT_DIR, `${sec.name}_${vp.mode}.png`);
          fs.writeFileSync(filePath, Buffer.from(screenshot.data, 'base64'));
        }
      } else {
        // Fullpage / key section captures for multi-viewport test
        console.log(`  Capturing full viewport overview (${vp.mode})...`);
        const screenshot = await cdp.send('Page.captureScreenshot', { format: 'png' });
        const filePath = path.join(SCREENSHOT_DIR, `overview_${vp.mode}.png`);
        fs.writeFileSync(filePath, Buffer.from(screenshot.data, 'base64'));
      }
    }

    cdp.close();
    console.log('[OK] All V6.3 AFTER screenshots captured successfully in reports/screenshots/v63_after/');
  } finally {
    edgeProc.kill();
  }
}

run().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
