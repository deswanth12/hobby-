import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const outDir = path.resolve('reports/v4_2_cream');
fs.mkdirSync(outDir, { recursive: true });

async function capture() {
  const PORT = 4288;
  console.log(`Starting Vite preview on port ${PORT}...`);
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
  const profileDir = path.resolve('reports/edge-profile-v4-2');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const CDP_PORT = 9388;
  console.log(`Starting Headless Edge on CDP port ${CDP_PORT}...`);
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
    console.error('Failed to connect to Edge CDP');
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

  const viewports = [
    { width: 1440, height: 900, label: '1440px' },
    { width: 768, height: 1024, label: '768px' },
    { width: 390, height: 844, label: '390px' },
  ];

  const pages = [
    { url: `http://127.0.0.1:${PORT}/`, name: 'homepage' },
    { url: `http://127.0.0.1:${PORT}/about`, name: 'about' },
    { url: `http://127.0.0.1:${PORT}/services`, name: 'services' },
    { url: `http://127.0.0.1:${PORT}/contact`, name: 'contact' },
    { url: `http://127.0.0.1:${PORT}/services/audit-assurance`, name: 'audit_spotlight' },
  ];

  // Capture across standard viewports
  for (const vp of viewports) {
    console.log(`Setting viewport: ${vp.label} (${vp.width}x${vp.height})`);
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width <= 768
    });

    for (const p of pages) {
      await send('Page.navigate', { url: p.url });
      await new Promise(r => setTimeout(r, 1200));

      const res = await send('Page.captureScreenshot', { format: 'png' });
      const buf = Buffer.from(res.data, 'base64');
      const filename = `v4_2_${p.name}_${vp.label}.png`;
      fs.writeFileSync(path.join(outDir, filename), buf);
      // Also update reports/color_redesign_after for compatibility
      fs.writeFileSync(path.join('reports/color_redesign_after', `after_${p.name}_${vp.label}.png`), buf);
      console.log(`✓ Saved ${filename} (${buf.length} bytes)`);
    }
  }

  // Section-specific captures on Desktop (1440px)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  await new Promise(r => setTimeout(r, 1500));

  // 1. Hero Section
  const heroShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'v4_2_section_hero_1440px.png'), Buffer.from(heroShot.data, 'base64'));

  // 2. Scroll to Why Choose Us
  await send('Runtime.evaluate', {
    expression: `document.getElementById('why-choose-us')?.scrollIntoView({ behavior: 'instant', block: 'start' });`
  });
  await new Promise(r => setTimeout(r, 800));
  const whyShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'v4_2_section_why_choose_us_1440px.png'), Buffer.from(whyShot.data, 'base64'));
  console.log('✓ Captured why-choose-us section');

  // 3. Scroll to Working Process
  await send('Runtime.evaluate', {
    expression: `document.getElementById('working-process')?.scrollIntoView({ behavior: 'instant', block: 'start' });`
  });
  await new Promise(r => setTimeout(r, 800));
  const processShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'v4_2_section_working_process_1440px.png'), Buffer.from(processShot.data, 'base64'));
  console.log('✓ Captured working-process section');

  // 4. Scroll to About Section
  await send('Runtime.evaluate', {
    expression: `document.getElementById('about-us')?.scrollIntoView({ behavior: 'instant', block: 'start' });`
  });
  await new Promise(r => setTimeout(r, 800));
  const aboutSecShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'v4_2_section_about_1440px.png'), Buffer.from(aboutSecShot.data, 'base64'));
  console.log('✓ Captured about-us section');

  // 5. Scroll to Contact Section
  await send('Runtime.evaluate', {
    expression: `document.getElementById('contact-section')?.scrollIntoView({ behavior: 'instant', block: 'start' });`
  });
  await new Promise(r => setTimeout(r, 800));
  const contactSecShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, 'v4_2_section_contact_1440px.png'), Buffer.from(contactSecShot.data, 'base64'));
  console.log('✓ Captured contact section');

  // 6. Full homepage scroll screenshot
  const fullPage = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  fs.writeFileSync(path.join(outDir, 'v4_2_homepage_full_scroll_1440px.png'), Buffer.from(fullPage.data, 'base64'));
  console.log('✓ Captured full homepage scroll');

  ws.close();
  edgeProc.kill();
  preview.kill();
  console.log('=== V4.2 SCREENSHOT CAPTURE COMPLETED SUCCESSFULLY ===');
}

capture().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
