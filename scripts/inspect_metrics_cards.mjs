import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const REMOTE_PORT = 9237;
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
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + path.resolve('.temp_edge_card_inspect')
  ]);

  try {
    let versionData = null;
    for (let i = 0; i < 30; i++) {
      try {
        versionData = await getJson(`http://localhost:${REMOTE_PORT}/json/version`);
        if (versionData && versionData.webSocketDebuggerUrl) break;
      } catch (e) {
        await new Promise(r => setTimeout(r, 200));
      }
    }

    if (!versionData || !versionData.webSocketDebuggerUrl) {
      throw new Error('Failed to connect to Edge remote debugging port');
    }

    const browserCdp = new CDP(versionData.webSocketDebuggerUrl);
    await browserCdp.connect();

    const viewports = [
      { name: 'desktop_1280', width: 1280, height: 800 },
      { name: 'mobile_390', width: 390, height: 844 }
    ];

    for (const vp of viewports) {
      const { targetId } = await browserCdp.send('Target.createTarget', { url: 'about:blank' });
      const targets = await getJson(`http://localhost:${REMOTE_PORT}/json`);
      const pageTarget = targets.find(t => t.id === targetId);

      const pageCdp = new CDP(pageTarget.webSocketDebuggerUrl);
      await pageCdp.connect();

      await pageCdp.send('Page.enable');
      await pageCdp.send('DOM.enable');

      await pageCdp.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: vp.width < 640
      });

      await pageCdp.send('Page.navigate', { url: BASE_URL });
      await new Promise(r => setTimeout(r, 2200));

      const boxEval = await pageCdp.send('Runtime.evaluate', {
        expression: `(() => {
          const el = document.querySelector('.v8-hero-cascade.grid');
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { x: r.x, y: r.y, width: r.width, height: r.height };
        })()`,
        returnByValue: true
      });

      if (boxEval.result.value) {
        const box = boxEval.result.value;
        const { data: b64 } = await pageCdp.send('Page.captureScreenshot', {
          format: 'png',
          fromSurface: true,
          captureBeyondViewport: false,
          clip: {
            x: Math.max(0, box.x - 12),
            y: Math.max(0, box.y - 12),
            width: box.width + 24,
            height: box.height + 24,
            scale: 2
          }
        });

        const filename = vp.name === 'desktop_1280' ? 'current_metrics_cards.png' : `metrics_cards_${vp.name}.png`;
        const outPath = path.join(BRAIN_DIR, filename);
        fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
        console.log(`Saved screenshot to ${outPath} (width: ${vp.width})`);
      }

      await pageCdp.send('Target.closeTarget', { targetId });
      pageCdp.close();
    }

    browserCdp.close();
  } finally {
    try { edgeProc.kill('SIGKILL'); } catch {}
    try { previewProc.kill('SIGKILL'); } catch {}
  }
}

run().catch(console.error);
