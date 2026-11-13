import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const compDir = path.resolve('reports/screenshots/before_after_comparisons');
if (!fs.existsSync(compDir)) fs.mkdirSync(compDir, { recursive: true });

async function generateComparisons() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-comp');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const port = 9299;
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
    const timer = setTimeout(() => reject(new Error('Timeout on ' + method)), 15000);
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

  const targets = [
    { name: 'homepage', label: 'Homepage Hero & Practice Registry Plaque', before: 'reports/screenshots/before/homepage-1440px.png', after: 'reports/screenshots/after/homepage-1440px.png', texture: 'Fine Handmade Paper Grain (3.5% Opacity) + Ambient Warm Light' },
    { name: 'about', label: 'About Us Practice Profile & Leadership Collage', before: 'reports/screenshots/before/about-1440px.png', after: 'reports/screenshots/after/about-1440px.png', texture: 'Fine Warm Plaster Texture (3.1% Opacity)' },
    { name: 'services', label: 'Services Spectrum & Statutory Disciplines', before: 'reports/screenshots/before/services-1440px.png', after: 'reports/screenshots/after/services-1440px.png', texture: 'Delicate Champagne Grain (2.7% Opacity)' },
    { name: 'contact', label: 'Practice Chambers Intake & Consultation Form', before: 'reports/screenshots/before/contact-1440px.png', after: 'reports/screenshots/after/contact-1440px.png', texture: 'Warm Ivory Paper Texture (3.5% Opacity)' },
    { name: 'homepage_mobile_390px', label: 'Mobile 390px Homepage Texture View', before: 'reports/screenshots/before/homepage-390px.png', after: 'reports/screenshots/after/homepage-390px.png', texture: 'Responsive Fine Paper Grain on Mobile' }
  ];

  for (const t of targets) {
    const bExists = fs.existsSync(t.before);
    const aExists = fs.existsSync(t.after);
    if (!bExists || !aExists) {
      console.log(`Skipping ${t.name}, missing before/after: b=${bExists}, a=${aExists}`);
      continue;
    }

    const bBase64 = fs.readFileSync(t.before).toString('base64');
    const aBase64 = fs.readFileSync(t.after).toString('base64');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #102D25;
            color: #F8EFDF;
            padding: 32px;
          }
          .header {
            text-align: center;
            margin-bottom: 24px;
          }
          .title {
            font-size: 24px;
            font-weight: 700;
            color: #C3A66B;
            letter-spacing: 0.05em;
          }
          .subtitle {
            font-size: 14px;
            color: #E8D5B5;
            margin-top: 6px;
          }
          .badge {
            display: inline-block;
            background: #153F32;
            border: 1px solid #C3A66B;
            color: #D4AF37;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 600;
            margin-top: 8px;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }
          .panel {
            background: #153F32;
            border: 1px solid #C3A66B;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.4);
          }
          .panel-header {
            padding: 12px 16px;
            background: #0C201A;
            border-bottom: 1px solid #C3A66B;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .panel-title {
            font-size: 13px;
            font-weight: 700;
            color: #F8EFDF;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }
          .panel-tag {
            font-size: 11px;
            padding: 2px 8px;
            border-radius: 4px;
            font-weight: 600;
          }
          .tag-before { background: #302B24; color: #E8D5B5; border: 1px solid #E8D5B5; }
          .tag-after { background: #C3A66B; color: #102D25; }
          .panel img {
            width: 100%;
            height: auto;
            display: block;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">PROJECT V4.3: LUXURY CREAM TEXTURE SYSTEM</div>
          <div class="subtitle">${t.label}</div>
          <div class="badge">TEXTURE APPLIED: ${t.texture}</div>
        </div>
        <div class="grid">
          <div class="panel">
            <div class="panel-header">
              <span class="panel-title">Before (V4.2 Warm Cream Baseline)</span>
              <span class="panel-tag tag-before">V4.2 FLAT CANVAS</span>
            </div>
            <img src="data:image/png;base64,${bBase64}" alt="Before V4.2" />
          </div>
          <div class="panel">
            <div class="panel-header">
              <span class="panel-title">After (V4.3 Tactile Cream Texture System)</span>
              <span class="panel-tag tag-after">V4.3 TEXTURED SYSTEM</span>
            </div>
            <img src="data:image/png;base64,${aBase64}" alt="After V4.3" />
          </div>
        </div>
      </body>
      </html>
    `;

    await send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1200,
      deviceScaleFactor: 1,
      mobile: false
    });

    await send('Page.navigate', { url: `data:text/html;charset=utf-8,${encodeURIComponent(html)}` });
    await new Promise(r => setTimeout(r, 600));

    const shot = await send('Page.captureScreenshot', { format: 'png', fullPage: true });
    const compFname = `comparison_${t.name}.png`;
    fs.writeFileSync(path.join(compDir, compFname), Buffer.from(shot.data, 'base64'));
    console.log(`Generated comparison: ${compFname}`);
  }

  ws.close();
  try { edgeProc.kill(); } catch (_) {}
}

generateComparisons().catch(err => {
  console.error(err);
  process.exit(1);
});
