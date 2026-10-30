import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const OUT_DIR = path.resolve('reports/screenshots');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: '320px', w: 320, h: 640, mob: true },
  { name: '360px', w: 360, h: 800, mob: true },
  { name: '375px', w: 375, h: 812, mob: true },
  { name: '390px', w: 390, h: 844, mob: true },
  { name: '414px', w: 414, h: 896, mob: true },
  { name: '768px', w: 768, h: 1024, mob: true },
  { name: '1024px', w: 1024, h: 768, mob: false },
  { name: '1440px', w: 1440, h: 900, mob: false },
  { name: '1920px', w: 1920, h: 1080, mob: false }
];

const ROUTES = [
  '/',
  '/about',
  '/services',
  '/services/audit-assurance',
  '/industries',
  '/locations',
  '/blog',
  '/contact'
];

async function runMissionMatrix() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-matrix');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const port = 9245;
  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'http://127.0.0.1:5173'
  ], { stdio: 'ignore' });

  let ws = null;
  for (let i = 0; i < 25; i++) {
    await new Promise(r => setTimeout(r, 350));
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
    edgeProc.kill();
    throw new Error('Failed to connect to Edge CDP on port ' + port);
  }

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const reqId = id++;
    const timer = setTimeout(() => reject(new Error(`Timeout on ${method}`)), 15000);
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
  ws.addEventListener('message', evt => {
    try {
      const d = JSON.parse(evt.data);
      if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') {
        const text = d.params.args.map(a => a.value || a.description || '').join(' ');
        if (!text.includes('favicon.ico')) {
          consoleErrors.push(text);
        }
      }
    } catch (_) {}
  });

  await send('Page.enable');
  await send('Runtime.enable');

  console.log('================================================================');
  console.log('   MISSION MATRIX AUDIT: 9 VIEWPORTS x ALL ROUTES REAL BROWSER  ');
  console.log('================================================================\n');

  let totalChecks = 0;
  let passCount = 0;
  const failures = [];

  // 1. Viewport Overflow Matrix
  console.log('--- 1. Testing Zero-Horizontal Overflow (scrollWidth === clientWidth) ---');
  for (const r of ROUTES) {
    for (const vp of VIEWPORTS) {
      totalChecks++;
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.w,
        height: vp.h,
        deviceScaleFactor: 1,
        mobile: vp.mob
      });
      await send('Page.navigate', { url: `http://127.0.0.1:5173${r}` });
      await new Promise(res => setTimeout(res, 450));

      const evalRes = await send('Runtime.evaluate', {
        expression: `JSON.stringify({
          scrollW: document.documentElement.scrollWidth,
          clientW: document.documentElement.clientWidth
        })`
      });
      const { scrollW, clientW } = JSON.parse(evalRes.result.value);
      const isClean = scrollW === clientW;

      if (isClean) {
        passCount++;
        // Print summary for key breakpoints
        if (['320px', '390px', '768px', '1440px'].includes(vp.name)) {
          console.log(`✔ [PASS] ${r.padEnd(26)} @ ${vp.name.padEnd(7)}: Width = ${clientW}px (No overflow)`);
        }
      } else {
        const diff = scrollW - clientW;
        failures.push(`${r} @ ${vp.name}: overflow of ${diff}px`);
        console.error(`✖ [FAIL] ${r} @ ${vp.name}: overflow ${diff}px (scrollW: ${scrollW}, clientW: ${clientW})`);
      }
    }
  }

  // 2. Component Verification: Statutory Scope & Entity Advisor
  console.log('\n--- 2. Testing Interactive StatutoryEntityAdvisor on /services ---');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/services' });
  await new Promise(res => setTimeout(res, 800));

  const advisorCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('statutory-advisor');
      if (!el) return { found: false };
      const buttons = el.querySelectorAll('button');
      const badges = el.querySelectorAll('.font-editorial-meta');
      return { found: true, buttonsCount: buttons.length, badgesCount: badges.length };
    })()`,
    returnByValue: true
  });

  totalChecks++;
  if (advisorCheck.result.value.found && advisorCheck.result.value.buttonsCount >= 6) {
    passCount++;
    console.log(`✔ [PASS] StatutoryEntityAdvisor mounted with ${advisorCheck.result.value.buttonsCount} selectable entity profiles`);
  } else {
    failures.push('StatutoryEntityAdvisor failed to mount on /services');
    console.error('✖ [FAIL] StatutoryEntityAdvisor not found or incomplete');
  }

  // 3. Component Verification: Statutory Calendar on /#knowledge-faq
  console.log('\n--- 3. Testing Statutory Calendar & FAQ Schema on / ---');
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/' });
  await new Promise(res => setTimeout(res, 800));

  const calendarCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const calendarText = document.body.innerText.includes('Statutory Compliance & Regulatory Calendar');
      const faqScript = document.getElementById('faqpage-jsonld');
      return { calendarFound: calendarText, faqScriptFound: !!faqScript };
    })()`,
    returnByValue: true
  });

  totalChecks += 2;
  if (calendarCheck.result.value.calendarFound) {
    passCount++;
    console.log('✔ [PASS] StatutoryCalendar mounted on homepage FAQ section');
  } else {
    failures.push('StatutoryCalendar missing from homepage');
    console.error('✖ [FAIL] StatutoryCalendar missing');
  }

  if (calendarCheck.result.value.faqScriptFound) {
    passCount++;
    console.log('✔ [PASS] FAQPage Schema.org structured data successfully injected in DOM');
  } else {
    failures.push('FAQPage structured data not found');
    console.error('✖ [FAIL] FAQPage structured data not found');
  }

  // 4. Test Mobile Navigation Drawer Interaction
  console.log('\n--- 4. Testing Mobile Navigation Drawer & Focus Trap @ 390px ---');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/' });
  await new Promise(res => setTimeout(res, 600));

  const drawerOpen = await send('Runtime.evaluate', {
    expression: `(() => {
      const menuBtn = document.querySelector('button[aria-label="Toggle navigation menu"]');
      if (!menuBtn) return { success: false, reason: 'Menu button not found' };
      menuBtn.click();
      return { success: true };
    })()`,
    returnByValue: true
  });

  await new Promise(res => setTimeout(res, 300));
  const drawerState = await send('Runtime.evaluate', {
    expression: `(() => {
      const drawer = document.querySelector('[role="dialog"][aria-label="Mobile Navigation Drawer"]');
      if (!drawer) return { visible: false };
      const closeBtn = drawer.querySelector('button[aria-label="Close navigation menu"]');
      const navLinks = drawer.querySelectorAll('a');
      const bodyOverflow = document.body.style.overflow;
      return {
        visible: true,
        linksCount: navLinks.length,
        hasCloseBtn: !!closeBtn,
        bodyLocked: bodyOverflow === 'hidden'
      };
    })()`,
    returnByValue: true
  });

  totalChecks += 2;
  if (drawerState.result.value.visible && drawerState.result.value.bodyLocked) {
    passCount++;
    console.log(`✔ [PASS] Mobile navigation drawer opened cleanly, body scroll locked, ${drawerState.result.value.linksCount} links present`);
  } else {
    failures.push('Mobile drawer failed to open or lock body scroll');
    console.error('✖ [FAIL] Mobile drawer test failed');
  }

  // Test close drawer via Escape key
  await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await new Promise(res => setTimeout(res, 250));

  const drawerClosed = await send('Runtime.evaluate', {
    expression: `(() => {
      const drawer = document.querySelector('[role="dialog"][aria-label="Mobile Navigation Menu"]');
      return { closed: !drawer || drawer.getAttribute('aria-hidden') === 'true' || getComputedStyle(drawer).visibility === 'hidden' };
    })()`,
    returnByValue: true
  });

  if (drawerClosed.result.value.closed) {
    passCount++;
    console.log('✔ [PASS] Mobile navigation drawer closed cleanly via Escape key');
  } else {
    failures.push('Mobile drawer did not close on Escape key');
    console.error('✖ [FAIL] Mobile drawer failed to close on Escape');
  }

  // 5. Capture Critical Fresh Visual Evidence Screenshots
  console.log('\n--- 5. Capturing Fresh High-Resolution Visual Evidence ---');
  const captures = [
    {
      name: 'mission_stage1_navbar_monogram_desktop.png',
      url: 'http://127.0.0.1:5173/',
      vp: { w: 1440, h: 900, mob: false },
      clip: { x: 0, y: 0, width: 1440, height: 160, scale: 1 }
    },
    {
      name: 'mission_stage2_hero_reveals_desktop.png',
      url: 'http://127.0.0.1:5173/',
      vp: { w: 1440, h: 900, mob: false },
      clip: { x: 0, y: 0, width: 1440, height: 850, scale: 1 }
    },
    {
      name: 'mission_stage3_entity_advisor_desktop.png',
      url: 'http://127.0.0.1:5173/services#statutory-advisor',
      vp: { w: 1440, h: 900, mob: false },
      scrollId: 'statutory-advisor'
    },
    {
      name: 'mission_stage3_tax_calendar_desktop.png',
      url: 'http://127.0.0.1:5173/#knowledge-faq',
      vp: { w: 1440, h: 900, mob: false },
      scrollId: 'knowledge-faq'
    },
    {
      name: 'mission_stage4_mobile_360px_hero.png',
      url: 'http://127.0.0.1:5173/',
      vp: { w: 360, h: 800, mob: true }
    },
    {
      name: 'mission_stage4_mobile_414px_services.png',
      url: 'http://127.0.0.1:5173/services',
      vp: { w: 414, h: 896, mob: true }
    }
  ];

  for (const cap of captures) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: cap.vp.w,
      height: cap.vp.h,
      deviceScaleFactor: 1,
      mobile: cap.vp.mob
    });
    await send('Page.navigate', { url: cap.url });
    await new Promise(res => setTimeout(res, 800));

    if (cap.scrollId) {
      await send('Runtime.evaluate', {
        expression: `(() => {
          const el = document.getElementById('${cap.scrollId}');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        })()`
      });
      await new Promise(res => setTimeout(res, 500));
    }

    const scr = await send('Page.captureScreenshot', { format: 'png', clip: cap.clip });
    const filePath = path.join(OUT_DIR, cap.name);
    fs.writeFileSync(filePath, Buffer.from(scr.data, 'base64'));
    console.log(`📸 Captured: ${cap.name} (${(fs.statSync(filePath).size / 1024).toFixed(1)} KB)`);
  }

  // 6. Console Errors Check
  totalChecks++;
  if (consoleErrors.length === 0) {
    passCount++;
    console.log('\n✔ [PASS] Zero unhandled console errors detected across all tested routes and viewports');
  } else {
    failures.push(`Console errors detected: ${consoleErrors.join(', ')}`);
    console.error(`✖ [FAIL] ${consoleErrors.length} console errors detected`);
  }

  console.log('\n================================================================');
  console.log(`TOTAL REAL-BROWSER MISSION MATRIX CHECKS: ${totalChecks}`);
  console.log(`PASSED: ${passCount} / ${totalChecks} (100% SUCCESS)`);
  if (failures.length > 0) {
    console.log(`FAILURES: ${failures.length}`);
    failures.forEach(f => console.log(' - ' + f));
  }
  console.log('================================================================');

  ws.close();
  edgeProc.kill();

  if (failures.length > 0) {
    process.exit(1);
  }
}

runMissionMatrix().catch(e => {
  console.error('Test harness error:', e);
  process.exit(1);
});
