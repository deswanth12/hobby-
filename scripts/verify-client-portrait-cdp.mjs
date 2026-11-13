import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const TARGET_HOST = 'http://localhost:5173';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const REMOTE_DEBUGGING_PORT = 9226;
const SCREENSHOT_DIR = path.resolve('reports/screenshots/portrait_verification');

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
  console.log('1. Checking HTTP status of portrait asset...');
  const assetRes = await new Promise((resolve) => {
    http.get(`${TARGET_HOST}/images/partner/ca-kavitha-vijay.webp`, (res) => {
      resolve({ statusCode: res.statusCode, contentType: res.headers['content-type'], size: res.headers['content-length'] });
    });
  });
  console.log(`Portrait HTTP Status: ${assetRes.statusCode}, Content-Type: ${assetRes.contentType}`);
  if (assetRes.statusCode !== 200) {
    throw new Error(`Failed to load portrait over HTTP: ${assetRes.statusCode}`);
  }

  console.log('2. Launching headless browser...');
  const edgeProc = spawn(EDGE_PATH, [
    `--remote-debugging-port=${REMOTE_DEBUGGING_PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + path.resolve('tmp/edge-portrait-profile-2')
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const targets = await getJson(`http://127.0.0.1:${REMOTE_DEBUGGING_PORT}/json`);
    const pageTarget = targets.find(t => t.type === 'page') || targets[0];
    const cdp = new CDPConnection(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Page.enable');
    await cdp.send('DOM.enable');

    const tests = [
      { name: 'homepage_desktop', url: `${TARGET_HOST}/`, width: 1440, height: 900, selector: 'img[src*="ca-kavitha-vijay.webp"]' },
      { name: 'homepage_mobile', url: `${TARGET_HOST}/`, width: 390, height: 844, selector: 'img[src*="ca-kavitha-vijay.webp"]' },
      { name: 'about_desktop', url: `${TARGET_HOST}/about`, width: 1440, height: 900, selector: 'section#profile img[src*="ca-kavitha-vijay.webp"]' },
      { name: 'about_mobile', url: `${TARGET_HOST}/about`, width: 390, height: 844, selector: 'section#profile img[src*="ca-kavitha-vijay.webp"]' },
    ];

    for (const test of tests) {
      console.log(`\nTesting ${test.name} (${test.width}x${test.height})...`);
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: test.width,
        height: test.height,
        deviceScaleFactor: 1,
        mobile: test.width < 600
      });

      await cdp.send('Page.navigate', { url: test.url });
      await new Promise(r => setTimeout(r, 2000));

      // Scroll into view first so lazy images trigger loading
      await cdp.send('Runtime.evaluate', {
        expression: `
          (() => {
            const img = document.querySelector('${test.selector}');
            if (img) img.scrollIntoView({ behavior: 'instant', block: 'center' });
          })()
        `
      });
      await new Promise(r => setTimeout(r, 1000));

      const evalRes = await cdp.send('Runtime.evaluate', {
        expression: `
          (() => {
            const imgs = Array.from(document.querySelectorAll('${test.selector}'));
            return {
              count: imgs.length,
              images: imgs.map(img => ({
                src: img.src,
                alt: img.alt,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
                clientWidth: img.clientWidth,
                clientHeight: img.clientHeight,
                complete: img.complete
              }))
            };
          })()
        `,
        returnByValue: true
      });

      const data = evalRes.result.value;
      console.log(`Found ${data.count} portrait instances. Details:`, data.images);

      if (data.count === 0) {
        throw new Error(`Zero portrait images found matching ${test.selector} on ${test.name}`);
      }
      for (const img of data.images) {
        if (img.naturalWidth <= 0 || img.naturalHeight <= 0) {
          throw new Error(`Portrait image failed to load or has 0 dimensions on ${test.name}: ${JSON.stringify(img)}`);
        }
      }

      const screenshot = await cdp.send('Page.captureScreenshot', { format: 'png' });
      const screenshotPath = path.join(SCREENSHOT_DIR, `${test.name}.png`);
      fs.writeFileSync(screenshotPath, Buffer.from(screenshot.data, 'base64'));
      console.log(`[PASS] Captured verified screenshot: ${screenshotPath}`);
    }

    cdp.close();
    console.log('\n======================================================');
    console.log('ALL PORTRAIT VERIFICATIONS PASSED WITH 100% SUCCESS!');
    console.log('======================================================');
  } finally {
    edgeProc.kill();
  }
}

run().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
