import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const TARGET_HOST = 'http://localhost:5173';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const REMOTE_PORT = 9227;
const SCREENSHOT_PATH = path.resolve('reports/screenshots/refined_hero_and_card.png');

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
  const edgeProc = spawn(EDGE_PATH, [
    `--remote-debugging-port=${REMOTE_PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${path.resolve('.temp_edge_snap')}`,
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const list = await getJson(`http://127.0.0.1:${REMOTE_PORT}/json/list`);
    const pageTarget = list.find(t => t.type === 'page') || list[0];
    const cdp = new CDP(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false
    });

    console.log('Navigating to', TARGET_HOST);
    await cdp.send('Page.navigate', { url: TARGET_HOST });
    await new Promise(r => setTimeout(r, 3000));

    const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.mkdirSync(path.dirname(SCREENSHOT_PATH), { recursive: true });
    fs.writeFileSync(SCREENSHOT_PATH, Buffer.from(shot.data, 'base64'));
    console.log('Screenshot written to:', SCREENSHOT_PATH);

    // Also copy to artifact directory
    const artifactPath = path.resolve('C:/Users/k deswanth/.gemini/antigravity/brain/12a17cde-3e50-4191-8739-afaecddf2151/refined_hero_and_card.png');
    fs.copyFileSync(SCREENSHOT_PATH, artifactPath);
    console.log('Copied to artifact:', artifactPath);

    cdp.close();
  } finally {
    edgeProc.kill('SIGKILL');
  }
}

main().catch(console.error);
