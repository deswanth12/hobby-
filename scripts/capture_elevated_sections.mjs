import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const REMOTE_PORT = 9243;
const BASE_URL = 'http://localhost:4173';
const BRAIN_DIR = 'C:\\Users\\k deswanth\\.gemini\\antigravity\\brain\\12a17cde-3e50-4191-8739-afaecddf2151';

async function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

class CDP {
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
  const previewProc = spawn('npx.cmd', ['vite', 'preview', '--port', '4173'], {
    shell: true,
    stdio: 'ignore'
  });

  for (let i = 0; i < 30; i++) {
    try {
      await new Promise((res, rej) => {
        const req = http.get(BASE_URL, (r) => res(r.statusCode));
        req.on('error', rej);
        req.setTimeout(500, () => { req.destroy(); rej(new Error('timeout')); });
      });
      break;
    } catch {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  const edgeProc = spawn(EDGE_PATH, [
    `--remote-debugging-port=${REMOTE_PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--window-size=1440,1800',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  try {
    const versionInfo = await getJson(`http://127.0.0.1:${REMOTE_PORT}/json/version`);
    const browserCdp = new CDP(versionInfo.webSocketDebuggerUrl);
    await browserCdp.connect();

    const { targetId } = await browserCdp.send('Target.createTarget', { url: 'about:blank' });
    const targets = await getJson(`http://127.0.0.1:${REMOTE_PORT}/json`);
    const pageTarget = targets.find(t => t.id === targetId);

    const pageCdp = new CDP(pageTarget.webSocketDebuggerUrl);
    await pageCdp.connect();

    await pageCdp.send('Page.enable');
    await pageCdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 1800,
      deviceScaleFactor: 2,
      mobile: false
    });

    await pageCdp.send('Page.navigate', { url: BASE_URL });
    await new Promise(r => setTimeout(r, 3000));

    // 1. Capture Hero Section (with numbers)
    const heroBox = await pageCdp.send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('section#hero');
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      })()`,
      returnByValue: true
    });

    if (heroBox.result.value) {
      const box = heroBox.result.value;
      const { data: b64 } = await pageCdp.send('Page.captureScreenshot', {
        format: 'png',
        fromSurface: true,
        clip: {
          x: Math.max(0, box.x),
          y: Math.max(0, box.y),
          width: box.width,
          height: box.height,
          scale: 2
        }
      });
      const heroPath = path.join(BRAIN_DIR, 'hero_metrics_updated.png');
      fs.writeFileSync(heroPath, Buffer.from(b64, 'base64'));
      console.log(`Saved hero metrics screenshot to ${heroPath}`);
    }

    // 2. Scroll and Capture Practice Areas
    const practiceBox = await pageCdp.send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('section#practice-areas');
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      })()`,
      returnByValue: true
    });

    if (practiceBox.result.value) {
      const box = practiceBox.result.value;
      const { data: b64 } = await pageCdp.send('Page.captureScreenshot', {
        format: 'png',
        fromSurface: true,
        clip: {
          x: Math.max(0, box.x),
          y: Math.max(0, box.y),
          width: box.width,
          height: box.height,
          scale: 2
        }
      });
      const practicePath = path.join(BRAIN_DIR, 'practice_areas_updated.png');
      fs.writeFileSync(practicePath, Buffer.from(b64, 'base64'));
      console.log(`Saved practice areas screenshot to ${practicePath}`);
    }

    await pageCdp.send('Target.closeTarget', { targetId });
    pageCdp.close();
    browserCdp.close();
  } finally {
    try { edgeProc.kill(); } catch {}
    try { previewProc.kill(); } catch {}
  }
}

run().catch(console.error);
