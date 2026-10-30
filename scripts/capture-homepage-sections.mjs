import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const OUT_DIR = path.resolve('reports/screenshots');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function captureSections() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-sections');
  
  let edgeProc = null;
  try {
    console.log('[CDP] Launching Edge headless on port 9240...');
    edgeProc = spawn(edgePath, [
      '--remote-debugging-port=9240',
      '--remote-allow-origins=*',
      `--user-data-dir=${profileDir}`,
      '--headless=new',
      'http://127.0.0.1:5173'
    ], { stdio: 'ignore' });

    let tabs = null;
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 400));
      try {
        const res = await fetch('http://127.0.0.1:9240/json/list');
        tabs = await res.json();
        if (tabs && tabs.length > 0) break;
      } catch (_) {}
    }

    if (!tabs || tabs.length === 0) throw new Error('Edge CDP failed to start');
    const target = tabs.find(t => t.type === 'page');
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

    let msgId = 1;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const id = msgId++;
      const handler = (evt) => {
        const data = JSON.parse(evt.data);
        if (data.id === id) {
          ws.removeEventListener('message', handler);
          if (data.error) reject(data.error);
          else resolve(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });

    await send('Page.enable');
    await send('Runtime.enable');

    // =========================================================================
    // 1. DESKTOP (1440x900)
    // =========================================================================
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/' });
    await new Promise(r => setTimeout(r, 1200));

    // 1a. Hero Consultation View
    const ssHeroConsult = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(OUT_DIR, 'stage2_hero_chambers_consultation_desktop.png'), Buffer.from(ssHeroConsult.data, 'base64'));
    console.log('Saved: stage2_hero_chambers_consultation_desktop.png');

    // 1b. Switch to Archives Photo View
    await send('Runtime.evaluate', { expression: `
      const buttons = Array.from(document.querySelectorAll('button'));
      const archivesBtn = buttons.find(b => b.textContent.trim() === 'Archives');
      if (archivesBtn) archivesBtn.click();
    ` });
    await new Promise(r => setTimeout(r, 400));
    const ssHeroArchives = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(OUT_DIR, 'stage2_hero_chambers_archives_desktop.png'), Buffer.from(ssHeroArchives.data, 'base64'));
    console.log('Saved: stage2_hero_chambers_archives_desktop.png');

    // Switch back to Consultation
    await send('Runtime.evaluate', { expression: `
      const buttons = Array.from(document.querySelectorAll('button'));
      const consultBtn = buttons.find(b => b.textContent.trim() === 'Chambers');
      if (consultBtn) consultBtn.click();
    ` });
    await new Promise(r => setTimeout(r, 200));

    // 1c. Scroll to Stage 1: Ticker & Sector Marquee
    await send('Runtime.evaluate', { expression: `
      const el = document.querySelector('.marquee-container');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    ` });
    await new Promise(r => setTimeout(r, 600));
    const ss1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(OUT_DIR, 'stage1_marquee_and_ticker_desktop.png'), Buffer.from(ss1.data, 'base64'));
    console.log('Saved: stage1_marquee_and_ticker_desktop.png');

    // 1d. Scroll to Service Cards
    await send('Runtime.evaluate', { expression: `
      const el = document.getElementById('services-overview');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    ` });
    await new Promise(r => setTimeout(r, 600));
    const ss2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(OUT_DIR, 'stage3_service_cards_desktop.png'), Buffer.from(ss2.data, 'base64'));
    console.log('Saved: stage3_service_cards_desktop.png');

    // 1e. Scroll to Connected Timeline
    await send('Runtime.evaluate', { expression: `
      const headings = Array.from(document.querySelectorAll('h2'));
      const timelineH2 = headings.find(h => h.textContent.includes('How We Work With You'));
      if (timelineH2) timelineH2.scrollIntoView({ behavior: 'instant', block: 'start' });
    ` });
    await new Promise(r => setTimeout(r, 600));
    const ss3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(OUT_DIR, 'stage3_connected_timeline_desktop.png'), Buffer.from(ss3.data, 'base64'));
    console.log('Saved: stage3_connected_timeline_desktop.png');

    // =========================================================================
    // 2. MOBILE (390x844 - iPhone standard)
    // =========================================================================
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    await send('Emulation.setUserAgentOverride', {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    });
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/' });
    await new Promise(r => setTimeout(r, 1200));

    // 2a. Hero Chambers Card on 390px
    await send('Runtime.evaluate', { expression: `
      const img = document.querySelector('img[alt*="CA Kavitha Vijay"]');
      if (img) img.scrollIntoView({ behavior: 'instant', block: 'center' });
    ` });
    await new Promise(r => setTimeout(r, 500));
    const ssMobileHero = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(OUT_DIR, 'stage2_hero_chambers_mobile_390px.png'), Buffer.from(ssMobileHero.data, 'base64'));
    console.log('Saved: stage2_hero_chambers_mobile_390px.png');

    // 2b. Mobile Marquee & Ticker (actual centered view)
    await send('Runtime.evaluate', { expression: `
      const el = document.querySelector('.marquee-container');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    ` });
    await new Promise(r => setTimeout(r, 600));
    const ssMobileMarquee = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(OUT_DIR, 'stage1_marquee_mobile_390px.png'), Buffer.from(ssMobileMarquee.data, 'base64'));
    console.log('Saved: stage1_marquee_mobile_390px.png');

    // 2c. Mobile Service Cards with Virtual CFO Card Expanded via Tap
    await send('Runtime.evaluate', { expression: `
      const cfoCard = document.getElementById('virtual-cfo');
      if (cfoCard) {
        cfoCard.scrollIntoView({ behavior: 'instant', block: 'center' });
        const toggleBtn = cfoCard.querySelector('button');
        if (toggleBtn) toggleBtn.click();
      }
    ` });
    await new Promise(r => setTimeout(r, 600));
    const ssMobileCardExpanded = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(OUT_DIR, 'stage3_service_cards_mobile_expanded_390px.png'), Buffer.from(ssMobileCardExpanded.data, 'base64'));
    console.log('Saved: stage3_service_cards_mobile_expanded_390px.png');

    // 2d. Mobile Timeline
    await send('Runtime.evaluate', { expression: `
      const headings = Array.from(document.querySelectorAll('h2'));
      const timelineH2 = headings.find(h => h.textContent.includes('How We Work With You'));
      if (timelineH2) timelineH2.scrollIntoView({ behavior: 'instant', block: 'start' });
    ` });
    await new Promise(r => setTimeout(r, 600));
    const ssMobileTimeline = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(OUT_DIR, 'stage3_connected_timeline_mobile_390px.png'), Buffer.from(ssMobileTimeline.data, 'base64'));
    console.log('Saved: stage3_connected_timeline_mobile_390px.png');

    // =========================================================================
    // 3. ULTRA-NARROW MOBILE (320px) - Edge Case Verification
    // =========================================================================
    await send('Emulation.setDeviceMetricsOverride', { width: 320, height: 640, deviceScaleFactor: 2, mobile: true });
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/' });
    await new Promise(r => setTimeout(r, 1200));

    // 3a. Ultra-Narrow Hero Chambers Photo Card (Verifies ZERO badge overlap)
    await send('Runtime.evaluate', { expression: `
      const img = document.querySelector('img[alt*="CA Kavitha Vijay"]');
      if (img) img.scrollIntoView({ behavior: 'instant', block: 'center' });
    ` });
    await new Promise(r => setTimeout(r, 500));
    const ss320Hero = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(OUT_DIR, 'stage2_hero_chambers_mobile_320px.png'), Buffer.from(ss320Hero.data, 'base64'));
    console.log('Saved: stage2_hero_chambers_mobile_320px.png');

    // 3b. Ultra-Narrow Ticker & Marquee
    await send('Runtime.evaluate', { expression: `
      const el = document.querySelector('.marquee-container');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    ` });
    await new Promise(r => setTimeout(r, 500));
    const ss320Marquee = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(OUT_DIR, 'stage1_marquee_mobile_320px.png'), Buffer.from(ss320Marquee.data, 'base64'));
    console.log('Saved: stage1_marquee_mobile_320px.png');

    // =========================================================================
    // 4. ACCESSIBILITY: PREFERS-REDUCED-MOTION
    // =========================================================================
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
    });
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/' });
    await new Promise(r => setTimeout(r, 1000));

    await send('Runtime.evaluate', { expression: `
      const el = document.querySelector('.marquee-container');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    ` });
    await new Promise(r => setTimeout(r, 500));
    const ssReducedMotion = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(OUT_DIR, 'stage1_marquee_reduced_motion_desktop.png'), Buffer.from(ssReducedMotion.data, 'base64'));
    console.log('Saved: stage1_marquee_reduced_motion_desktop.png');

    ws.close();
    console.log('\n[SUCCESS] All targeted section screenshots captured cleanly.');
  } finally {
    if (edgeProc) edgeProc.kill();
  }
}

captureSections().catch(err => {
  console.error(err);
  process.exit(1);
});
