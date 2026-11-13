import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const REMOTE_PORT = 9229;
const BASE_URL = 'http://localhost:4173';
const BRAIN_DIR = 'C:\\Users\\k deswanth\\.gemini\\antigravity\\brain\\12a17cde-3e50-4191-8739-afaecddf2151';

const VIEWPORTS = [
  { name: 'mobile_390px', width: 390, height: 844, isMobile: true },
  { name: 'tablet_768px', width: 768, height: 1024, isMobile: false },
  { name: 'desktop_1440px', width: 1440, height: 900, isMobile: false },
];

async function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
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

async function main() {
  console.log('Spawning Vite preview server on port 4173...');
  const previewProc = spawn('npx.cmd', ['vite', 'preview', '--port', '4173'], {
    shell: true,
    stdio: 'ignore'
  });

  // Wait for preview server to be responsive
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

  console.log('Spawning Edge for multi-device responsive verification...');
  const edgeProc = spawn(EDGE_PATH, [
    `--remote-debugging-port=${REMOTE_PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + path.resolve('.temp_edge_responsive_profile')
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

    const { targetId } = await browserCdp.send('Target.createTarget', { url: 'about:blank' });
    const targets = await getJson(`http://localhost:${REMOTE_PORT}/json`);
    const pageTarget = targets.find(t => t.id === targetId);

    const pageCdp = new CDP(pageTarget.webSocketDebuggerUrl);
    await pageCdp.connect();

    await pageCdp.send('Page.enable');
    await pageCdp.send('DOM.enable');

    for (const vp of VIEWPORTS) {
      console.log(`Testing viewport: ${vp.name} (${vp.width}x${vp.height})...`);

      await pageCdp.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: vp.isMobile
      });

      await pageCdp.send('Page.navigate', { url: BASE_URL });
      await new Promise(r => setTimeout(r, 1200));

      // Evaluate overflow
      const metrics = await pageCdp.send('Runtime.evaluate', {
        expression: `({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          overflowPx: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth)
        })`,
        returnByValue: true
      });

      console.log(`[${vp.name}] metrics:`, metrics.result.value);

      if (metrics.result.value.hasOverflow) {
        const offList = await pageCdp.send('Runtime.evaluate', {
          expression: `Array.from(document.querySelectorAll('*')).filter(el => {
            const r = el.getBoundingClientRect();
            return r.right > (document.documentElement.clientWidth + 2);
          }).slice(0, 5).map(el => ({
            tag: el.tagName,
            id: el.id,
            class: (el.className ? String(el.className) : '').slice(0, 80),
            right: Math.round(el.getBoundingClientRect().right)
          }))`,
          returnByValue: true
        });
        console.log(`[${vp.name}] Overflowing elements:`, offList.result.value);
      }

      const { data: b64 } = await pageCdp.send('Page.captureScreenshot', {
        format: 'png',
        fromSurface: true,
        captureBeyondViewport: false
      });

      const outPath = path.join(BRAIN_DIR, `responsive_${vp.name}.png`);
      fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
      console.log(`Saved screenshot to ${outPath}`);
    }

    pageCdp.close();
    browserCdp.close();
  } finally {
    try { edgeProc.kill('SIGKILL'); } catch {}
    try { previewProc.kill('SIGKILL'); } catch {}
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
