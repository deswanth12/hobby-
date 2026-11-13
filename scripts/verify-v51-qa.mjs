import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const screenshotDir = path.resolve('reports/v51_screenshots/after');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

async function runQA() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-v51-qa-2');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const CDP_PORT = 9335;
  console.log(`[V5.1 QA] Launching headless Edge CDP on port ${CDP_PORT}...`);
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
      if (target && target.webSocketDebuggerUrl) {
        ws = new WebSocket(target.webSocketDebuggerUrl);
        await new Promise(r => { ws.onopen = r; });
        break;
      }
    } catch (_) {}
  }

  if (!ws) {
    try { edgeProc.kill(); } catch (_) {}
    throw new Error('Failed to connect to CDP on port ' + CDP_PORT);
  }
  console.log('[V5.1 QA] WebSocket connected to Edge CDP.');

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const reqId = id++;
    const timer = setTimeout(() => reject(new Error('Timeout on ' + method)), 25000);
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

  const consoleErrors = [];
  const network404s = [];
  ws.addEventListener('message', evt => {
    try {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
        consoleErrors.push(msg.params.entry.text);
      }
      if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
        consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
      }
      if (msg.method === 'Network.responseReceived') {
        const resp = msg.params.response;
        if (resp && resp.status === 404) {
          network404s.push(resp.url);
        }
      }
    } catch (_) {}
  });

  await send('Page.enable');
  await send('DOM.enable');
  await send('Network.enable');

  const qaResults = {
    viewports: [],
    contactExperience: {},
    images: { total: 0, broken: 0 },
    reducedMotion: {},
    consoleErrors: [],
    network404s: []
  };

  const viewports = [
    { name: '320px Compact Mobile', width: 320, height: 640, mobile: true, scale: 2 },
    { name: '390px Mobile', width: 390, height: 844, mobile: true, scale: 2 },
    { name: '768px Tablet', width: 768, height: 1024, mobile: false, scale: 1 },
    { name: '1024px Small Desktop', width: 1024, height: 800, mobile: false, scale: 1 },
    { name: '1440px Standard Desktop', width: 1440, height: 900, mobile: false, scale: 1 },
    { name: '1920px Wide Desktop', width: 1920, height: 1080, mobile: false, scale: 1 },
  ];

  for (const vp of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.scale,
      mobile: vp.mobile
    });

    await send('Page.navigate', { url: 'http://127.0.0.1:5174/' });
    await new Promise(r => setTimeout(r, 1500));

    // Check overflow
    const overflowRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const scrollW = document.documentElement.scrollWidth;
        const clientW = document.documentElement.clientWidth;
        const diff = scrollW - clientW;
        return { scrollW, clientW, diff, hasOverflow: diff > 1 };
      })()`,
      returnByValue: true
    });
    const overflow = overflowRes.result?.value;
    console.log(`[V5.1 QA] Viewport ${vp.width}px overflow: ${overflow.diff.toFixed(2)}px (Has overflow: ${overflow.hasOverflow})`);

    qaResults.viewports.push({
      name: vp.name,
      width: vp.width,
      height: vp.height,
      overflow: overflow.diff,
      hasOverflow: overflow.hasOverflow
    });
  }

  // Set standard desktop for element captures
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await send('Page.navigate', { url: 'http://127.0.0.1:5174/' });
  await new Promise(r => setTimeout(r, 2200));

  async function captureElement(selector, filename) {
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('${selector}');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`,
      returnByValue: true
    });
    await new Promise(r => setTimeout(r, 800));

    const freshRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('${selector}');
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      })()`,
      returnByValue: true
    });

    const rect = freshRes.result?.value;
    if (!rect) {
      console.warn(`Element not found: ${selector}`);
      return;
    }

    const clip = {
      x: Math.max(0, rect.x),
      y: Math.max(0, rect.y),
      width: rect.width,
      height: Math.min(rect.height, 1200),
      scale: 1
    };

    const ss = await send('Page.captureScreenshot', { format: 'png', clip });
    const outPath = path.join(screenshotDir, filename);
    fs.writeFileSync(outPath, Buffer.from(ss.data, 'base64'));
    console.log(`Saved AFTER capture: ${filename}`);
  }

  // Capture Desktop AFTER elements
  await captureElement('#hero-section', 'hero_after_1440px.png');
  await captureElement('#insights-overview', 'insights_after_1440px.png');
  await captureElement('#consultation-cta', 'consultation_cta_after_1440px.png');
  await captureElement('#contact-section', 'contact_after_1440px.png');

  // Capture Mobile AFTER elements
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 1000));
  await captureElement('#hero-section', 'hero_after_390px.png');
  await captureElement('#consultation-cta', 'consultation_cta_after_390px.png');
  await captureElement('#contact-section', 'contact_after_390px.png');

  // Verify Contact Experience Interaction:
  console.log('\n[V5.1 QA] Verifying Contact Experience & Floating Widget Suppression...');

  // Reset to 1440px desktop
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await send('Page.navigate', { url: 'http://127.0.0.1:5174/' });
  // Wait 1.8s for prompt to appear at hero
  await new Promise(r => setTimeout(r, 1800));

  const heroPopupState = await send('Runtime.evaluate', {
    expression: `(() => {
      const bubble = document.querySelector('aside[aria-label="Direct WhatsApp Consultation"] div[role="status"]');
      if (!bubble) return { exists: false };
      const style = window.getComputedStyle(bubble);
      return {
        exists: true,
        visibility: style.visibility,
        opacity: style.opacity,
        display: style.display,
        isVisible: style.visibility === 'visible' && style.opacity === '1'
      };
    })()`,
    returnByValue: true
  });
  console.log('[V5.1 QA] At Hero section, popup state:', heroPopupState.result?.value);

  // Scroll into contact section
  await send('Runtime.evaluate', {
    expression: `document.querySelector('#contact-section').scrollIntoView({ behavior: 'instant', block: 'start' });`
  });
  await new Promise(r => setTimeout(r, 800));

  // Check state at Contact Section
  const contactPopupState = await send('Runtime.evaluate', {
    expression: `(() => {
      const bubble = document.querySelector('aside[aria-label="Direct WhatsApp Consultation"] div[role="status"]');
      if (!bubble) return { exists: false, isSuppressed: true };
      const style = window.getComputedStyle(bubble);
      const isSuppressed = style.visibility === 'hidden' || style.opacity === '0' || style.display === 'none' || parseFloat(style.height) === 0;
      
      // Also check if WhatsApp floating button overlaps any form inputs or submit button
      const waBtn = document.querySelector('aside[aria-label="Direct WhatsApp Consultation"] a');
      const submitBtn = document.querySelector('form button[type="submit"]');
      const waRect = waBtn ? waBtn.getBoundingClientRect() : null;
      const subRect = submitBtn ? submitBtn.getBoundingClientRect() : null;
      let overlapsSubmit = false;
      if (waRect && subRect) {
        overlapsSubmit = !(waRect.right < subRect.left || 
                           waRect.left > subRect.right || 
                           waRect.bottom < subRect.top || 
                           waRect.top > subRect.bottom);
      }

      return {
        exists: true,
        visibility: style.visibility,
        opacity: style.opacity,
        isSuppressed,
        overlapsSubmit
      };
    })()`,
    returnByValue: true
  });
  console.log('[V5.1 QA] At Contact section, popup state:', contactPopupState.result?.value);
  qaResults.contactExperience = {
    atHero: heroPopupState.result?.value,
    atContact: contactPopupState.result?.value
  };

  // Scroll back to Hero to verify restoration
  await send('Runtime.evaluate', {
    expression: `window.scrollTo({ top: 0, behavior: 'instant' });`
  });
  await new Promise(r => setTimeout(r, 800));

  const restoredPopupState = await send('Runtime.evaluate', {
    expression: `(() => {
      const bubble = document.querySelector('aside[aria-label="Direct WhatsApp Consultation"] div[role="status"]');
      if (!bubble) return { exists: false };
      const style = window.getComputedStyle(bubble);
      return {
        exists: true,
        visibility: style.visibility,
        opacity: style.opacity,
        isRestored: style.visibility === 'visible' && style.opacity === '1'
      };
    })()`,
    returnByValue: true
  });
  console.log('[V5.1 QA] After scrolling back to Top, popup restored state:', restoredPopupState.result?.value);
  qaResults.contactExperience.restoredAtTop = restoredPopupState.result?.value;

  // Test reduced motion
  await send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
  });
  await send('Page.navigate', { url: 'http://127.0.0.1:5174/' });
  await new Promise(r => setTimeout(r, 1200));

  const reducedMotionState = await send('Runtime.evaluate', {
    expression: `(() => {
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      return { matchesQuery: isReduced, bodyVisible: document.body.offsetWidth > 0 };
    })()`,
    returnByValue: true
  });
  qaResults.reducedMotion = reducedMotionState.result?.value;
  console.log('[V5.1 QA] Reduced motion audit:', qaResults.reducedMotion);

  qaResults.consoleErrors = consoleErrors;
  qaResults.network404s = network404s;

  ws.close();
  try { edgeProc.kill(); } catch (_) {}

  fs.writeFileSync('reports/v51_qa_results.json', JSON.stringify(qaResults, null, 2), 'utf8');
  console.log('\n[V5.1 QA] Verification complete. Results saved to reports/v51_qa_results.json');
}

runQA().catch(err => {
  console.error('[V5.1 QA] Error:', err);
  process.exit(1);
});
