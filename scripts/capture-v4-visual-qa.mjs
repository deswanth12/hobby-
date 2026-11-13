import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const outDir = path.resolve('reports/v4_qa');
const heroFramesDir = path.resolve('reports/hero_frames');
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(heroFramesDir, { recursive: true });

async function run() {
  const PORT = 4255;
  console.log(`Starting Vite preview server on port ${PORT}...`);
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: process.cwd(),
    shell: true,
    stdio: 'pipe'
  });

  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/`);
      if (res.ok) break;
    } catch (_) {}
  }

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-v4-qa');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const CDP_PORT = 9345;
  console.log(`Starting headless Edge with CDP on port ${CDP_PORT}...`);
  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${CDP_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  let ws = null;
  for (let i = 0; i < 35; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
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
    console.error('Failed to connect CDP WebSocket');
    preview.kill();
    edgeProc.kill();
    process.exit(1);
  }

  let idSeq = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idSeq++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('DOM.enable');
  await send('Runtime.enable');

  const viewports = [
    { width: 1440, height: 900, label: '1440px_desktop' },
    { width: 1024, height: 768, label: '1024px_laptop' },
    { width: 768, height: 1024, label: '768px_tablet' },
    { width: 390, height: 844, label: '390px_mobile' }
  ];

  console.log('--- Capturing 4 Responsive Viewports for Homepage ---');
  for (const vp of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width <= 768
    });

    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
    await new Promise(r => setTimeout(r, 1200));

    // Check horizontal overflow
    const overflowCheck = await send('Runtime.evaluate', {
      expression: 'document.documentElement.scrollWidth > window.innerWidth'
    });
    console.log(`Viewport ${vp.label}: Horizontal overflow = ${overflowCheck.result.value}`);

    const ss = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(ss.data, 'base64');
    const fn = `v4_homepage_${vp.label}.png`;
    fs.writeFileSync(path.join(outDir, fn), buffer);
    console.log(`Saved ${fn} (${buffer.length} bytes)`);
  }

  console.log('--- Capturing Hero Animation Sequence Frames (15 frames) ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  
  for (let f = 0; f < 15; f++) {
    await new Promise(r => setTimeout(r, 200));
    const ss = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 1440, height: 800, scale: 1 }
    });
    const buffer = Buffer.from(ss.data, 'base64');
    const fn = `hero_frame_${String(f).padStart(2, '0')}.png`;
    fs.writeFileSync(path.join(heroFramesDir, fn), buffer);
  }
  console.log('Hero frames captured.');

  console.log('--- Verifying Reduced Motion Mode ---');
  await send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
  });
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await new Promise(r => setTimeout(r, 1000));
  const ssReduced = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'v4_homepage_reduced_motion.png'), Buffer.from(ssReduced.data, 'base64'));
  console.log('Saved v4_homepage_reduced_motion.png');

  // Reset emulation
  await send('Emulation.setEmulatedMedia', { features: [] });

  console.log('--- Capturing All Major Routes ---');
  const routes = [
    { path: '/about', name: 'about' },
    { path: '/services', name: 'services' },
    { path: '/services/audit-assurance', name: 'audit_assurance' },
    { path: '/services/gst-consultant-tirupati', name: 'gst' },
    { path: '/services/income-tax-consultant-tirupati', name: 'income_tax' },
    { path: '/services/company-registration-tirupati', name: 'company_reg' },
    { path: '/services/virtual-cfo-tirupati', name: 'virtual_cfo' },
    { path: '/services/rera-consultant-tirupati', name: 'rera' },
    { path: '/knowledge-bank', name: 'knowledge_bank' },
    { path: '/industries', name: 'industries' },
    { path: '/blog', name: 'blog' },
    { path: '/contact', name: 'contact' }
  ];

  for (const r of routes) {
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}${r.path}` });
    await new Promise(resolve => setTimeout(resolve, 800));
    const ss = await send('Page.captureScreenshot', { format: 'png' });
    const fn = `v4_route_${r.name}.png`;
    fs.writeFileSync(path.join(outDir, fn), Buffer.from(ss.data, 'base64'));
    console.log(`Route ${r.path} -> ${fn}`);
  }

  // Cleanup
  ws.close();
  edgeProc.kill();
  preview.kill();
  console.log('--- V4 VISUAL QA COMPLETE ---');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
