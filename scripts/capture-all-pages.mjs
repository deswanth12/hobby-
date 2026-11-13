import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const TARGET_HOST = 'http://localhost:5173';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const REMOTE_DEBUGGING_PORT = 9229;
const SCREENSHOT_DIR = path.resolve('reports/screenshots/identity_verification');

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
  console.log('Capturing identity verification screenshots across pages...');
  const edgeProc = spawn(EDGE_PATH, [
    `--remote-debugging-port=${REMOTE_DEBUGGING_PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + path.resolve('tmp/edge-identity-qa')
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const targets = await getJson(`http://127.0.0.1:${REMOTE_DEBUGGING_PORT}/json`);
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const cdp = new CDPConnection(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Page.enable');

    const routes = [
      { name: '01_homepage', path: '/' },
      { name: '02_about', path: '/about' },
      { name: '03_services', path: '/services' },
      { name: '04_industries', path: '/industries' },
      { name: '05_audit_assurance', path: '/services/audit-assurance' },
      { name: '06_contact', path: '/contact' }
    ];

    const viewports = [
      { mode: 'desktop', width: 1440, height: 900, mobile: false },
      { mode: 'mobile', width: 390, height: 844, mobile: true }
    ];

    for (const vp of viewports) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.mobile
      });

      for (const route of routes) {
        console.log(`Capturing ${route.name} (${vp.mode})...`);
        await cdp.send('Page.navigate', { url: `${TARGET_HOST}${route.path}` });
        await new Promise(r => setTimeout(r, 1500));

        const screenshot = await cdp.send('Page.captureScreenshot', { format: 'png' });
        const filePath = path.join(SCREENSHOT_DIR, `${route.name}_${vp.mode}.png`);
        fs.writeFileSync(filePath, Buffer.from(screenshot.data, 'base64'));
      }
    }

    cdp.close();
    console.log('[OK] All identity verification screenshots captured in reports/screenshots/identity_verification/');
  } finally {
    edgeProc.kill();
  }
}

run().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
