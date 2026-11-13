import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

async function testCanvasPixelVariance() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-texture-variance');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const port = 9278;
  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  let ws = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
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
    const timer = setTimeout(() => reject(new Error('Timeout on ' + method)), 10000);
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

  const evalJs = async (expr) => {
    const res = await send('Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
      awaitPromise: true
    });
    return res.result?.value;
  };

  const textures = [
    'paper-grain.svg',
    'warm-plaster.svg',
    'geometric-paper.svg',
    'champagne-grain.svg',
    'linen-weave.svg',
    'ivory-paper.svg'
  ];

  console.log('Testing Texture Pixel Variance on Canvas in Chromium...');
  for (const tex of textures) {
    const svgPath = path.resolve('public/textures', tex);
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;

    const testHtml = `
      <!DOCTYPE html>
      <html><body><canvas id="c" width="100" height="100"></canvas></body></html>
    `;
    await send('Page.navigate', { url: `data:text/html;charset=utf-8,${encodeURIComponent(testHtml)}` });
    await new Promise(r => setTimeout(r, 200));

    const result = await evalJs(`
      new Promise(resolve => {
        const c = document.getElementById('c');
        const ctx = c.getContext('2d');
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, 100, 100);
          const data = ctx.getImageData(0, 0, 100, 100).data;
          let nonZeroAlpha = 0;
          let minA = 255, maxA = 0;
          for (let i = 3; i < data.length; i += 4) {
            const a = data[i];
            if (a > 0) nonZeroAlpha++;
            if (a < minA) minA = a;
            if (a > maxA) maxA = a;
          }
          resolve({ nonZeroAlpha, minA, maxA, totalPixels: 10000 });
        };
        img.onerror = () => resolve({ error: 'failed to load' });
        img.src = "${dataUri}";
      });
    `);

    console.log(`  Texture ${tex} pixel variance:`, result);
  }

  ws.close();
  try { edgeProc.kill(); } catch (_) {}
}

testCanvasPixelVariance().catch(console.error);
