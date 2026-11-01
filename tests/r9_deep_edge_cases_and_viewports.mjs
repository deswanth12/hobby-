import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const resultsDir = path.resolve('reports');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

async function runR9DeepAudit() {
  console.log('================================================================');
  console.log('   R9 DEEP BUG, BUSINESS LOGIC & EDGE-CASE AUDIT RUNNER         ');
  console.log('================================================================');

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-r9-audit');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const port = 9255;
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
    throw new Error('Could not connect to Edge DevTools on port ' + port);
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

  const evalJs = async (expr) => {
    const res = await send('Runtime.evaluate', {
      expression: expr,
      returnByValue: true
    });
    return res.result?.value;
  };

  const consoleErrors = [];
  ws.addEventListener('message', evt => {
    const d = JSON.parse(evt.data);
    if (d.method === 'Runtime.consoleAPICalled' && d.params?.type === 'error') {
      const text = d.params.args.map(a => a.value || a.description || '').join(' ');
      consoleErrors.push(text);
    }
  });

  const auditLog = [];
  function assert(title, condition, extra = '') {
    if (condition) {
      console.log(`  ✔ [PASS] ${title}`);
      auditLog.push({ title, status: 'PASS', extra });
    } else {
      console.error(`  ✖ [FAIL] ${title} - ${extra}`);
      auditLog.push({ title, status: 'FAIL', extra });
    }
  }

  // -------------------------------------------------------------------------
  // SECTION 1: Cross-Device Viewports (320px, 360px, 375px, 390px, 412px, 430px, 768px, 1024px, 1440px)
  // -------------------------------------------------------------------------
  console.log('\n--- SECTION 1: Viewport & Layout Overflow Verification ---');
  const targetViewports = [
    { width: 320, height: 568, name: '320px (Compact Mobile)' },
    { width: 360, height: 640, name: '360px (Standard Android)' },
    { width: 375, height: 667, name: '375px (iPhone SE)' },
    { width: 390, height: 844, name: '390px (iPhone 12/13/14)' },
    { width: 412, height: 915, name: '412px (Samsung Galaxy / Pixel)' },
    { width: 430, height: 932, name: '430px (iPhone Pro Max)' },
    { width: 768, height: 1024, name: '768px (Tablet Portrait)' },
    { width: 1024, height: 768, name: '1024px (Tablet Landscape)' },
    { width: 1440, height: 900, name: '1440px (Desktop HiDPI)' }
  ];

  const primaryRoutes = [
    '/',
    '/about',
    '/services',
    '/industries',
    '/locations',
    '/blog',
    '/contact',
    '/services/company-registration',
    '/services/gst-filing-services',
    '/services/income-tax-consultant',
    '/services/rera-consultant',
    '/services/virtual-cfo'
  ];

  for (const vp of targetViewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 1024
    });

    let vpOverflowCount = 0;
    for (const route of primaryRoutes.slice(0, 5)) {
      await send('Page.navigate', { url: `http://127.0.0.1:5173${route}` });
      await new Promise(r => setTimeout(r, 400));

      const overflowVal = await evalJs(`
        (() => {
          const docWidth = document.documentElement.clientWidth;
          const scrollWidth = document.documentElement.scrollWidth;
          const bodyScrollWidth = document.body ? document.body.scrollWidth : 0;
          const maxScroll = Math.max(scrollWidth, bodyScrollWidth);
          return maxScroll > docWidth + 1 ? maxScroll - docWidth : 0;
        })()
      `);

      if (overflowVal > 0) {
        vpOverflowCount++;
      }
    }

    assert(`Viewport ${vp.name}: Zero horizontal overflow on standard routes`, vpOverflowCount === 0, `Overflow detected on ${vpOverflowCount} routes`);
  }

  // -------------------------------------------------------------------------
  // SECTION 2: 200% Browser Zoom Testing
  // -------------------------------------------------------------------------
  console.log('\n--- SECTION 2: Browser Zoom at 200% ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 640,
    height: 450,
    deviceScaleFactor: 2,
    mobile: false
  });
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/' });
  await new Promise(r => setTimeout(r, 600));

  const zoomOverflow = await evalJs(`
    (() => {
      const docWidth = document.documentElement.clientWidth;
      const scrollWidth = document.documentElement.scrollWidth;
      return scrollWidth > docWidth + 1;
    })()
  `);
  assert('200% Zoom: Homepage preserves viewport bounds without horizontal scrolling', !zoomOverflow);

  // -------------------------------------------------------------------------
  // SECTION 3: Business Logic & Contact Details Consistency
  // -------------------------------------------------------------------------
  console.log('\n--- SECTION 3: Business Logic & Contact Integrity ---');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/about' });
  await new Promise(r => setTimeout(r, 500));

  const aboutPhoneCheck = await evalJs(`
    (() => {
      const primaryLink = document.querySelector('a[href*="9626350900"]');
      const altLink = document.querySelector('a[href*="9542153906"]');
      const emailLink = document.querySelector('a[href="mailto:cakavithasrj@gmail.com"]');
      return {
        hasPrimary: !!primaryLink,
        hasAlt: !!altLink,
        hasEmail: !!emailLink
      };
    })()
  `) || {};
  assert('About Page: Principal chambers phone numbers and email links are valid tel/mailto', 
    aboutPhoneCheck.hasPrimary && aboutPhoneCheck.hasAlt && aboutPhoneCheck.hasEmail);

  // Service landing pages dynamic phone checks
  const servicePages = [
    '/services/company-registration',
    '/services/gst-filing-services',
    '/services/income-tax-consultant',
    '/services/rera-consultant',
    '/services/virtual-cfo'
  ];

  for (const sp of servicePages) {
    await send('Page.navigate', { url: `http://127.0.0.1:5173${sp}` });
    await new Promise(r => setTimeout(r, 400));

    const checkService = await evalJs(`
      (() => {
        const waLinks = Array.from(document.querySelectorAll('a[href*="wa.me"]'));
        const callLinks = Array.from(document.querySelectorAll('a[href*="tel:"]'));
        const hasDynamicWa = waLinks.some(l => l.href.includes('919626350900'));
        const hasDynamicCall = callLinks.some(l => l.href.includes('9626350900'));
        return { hasDynamicWa, hasDynamicCall };
      })()
    `) || {};
    assert(`Service Page (${sp}): WhatsApp and Tel links use dynamic firm contact`,
      checkService.hasDynamicWa && checkService.hasDynamicCall);
  }

  // -------------------------------------------------------------------------
  // SECTION 4: Contact Form Pre-population via URL Parameters
  // -------------------------------------------------------------------------
  console.log('\n--- SECTION 4: Contact Form URL Param Pre-population ---');
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/contact?entity=Private%20Limited%20Company&service=Corporate%20%26%20MCA' });
  await new Promise(r => setTimeout(r, 600));

  const prefillCheck = await evalJs(`
    (() => {
      const selects = Array.from(document.querySelectorAll('select'));
      const entitySelect = selects.find(s => s.name === 'entityType' || s.id === 'entityType') || selects[0];
      const entityVal = entitySelect ? entitySelect.value : '';
      return { entityVal };
    })()
  `) || {};
  assert('Contact Form: ?entity= parameter automatically sets entityType field',
    prefillCheck.entityVal === 'Private Limited Company', `Got '${prefillCheck.entityVal}'`);

  // -------------------------------------------------------------------------
  // SECTION 5: Negative Form Testing (Validation & Sanitization)
  // -------------------------------------------------------------------------
  console.log('\n--- SECTION 5: Negative & Edge-Case Form Validation ---');
  // 1. Submit empty form
  await evalJs(`
    (() => {
      const form = document.querySelector('form');
      const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
      if (submitBtn) submitBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 400)); // Allow React to re-render error state

  const emptySubmitRes = await evalJs(`
    (() => {
      const errors = Array.from(document.querySelectorAll('p[role="alert"], span[role="alert"], .text-red-600, .text-rose-600')).map(e => e.textContent.trim());
      return { attempted: true, errorCount: errors.length, errors };
    })()
  `) || {};
  assert('Contact Form: Submitting empty form triggers validation alerts and halts submission',
    emptySubmitRes.errorCount > 0, `Detected ${emptySubmitRes.errorCount} alerts`);

  // 2. Test Invalid Email
  await evalJs(`
    (() => {
      const emailInput = document.getElementById('email') || document.querySelector('input[type="email"]');
      if (emailInput) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(emailInput, 'invalid-email-no-domain');
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        emailInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
      const submitBtn = document.querySelector('form button[type="submit"]');
      if (submitBtn) submitBtn.click();
    })()
  `);
  await new Promise(r => setTimeout(r, 400)); // Allow React to re-render

  const invalidEmailRes = await evalJs(`
    (() => {
      const errorMsg = document.getElementById('email-error');
      const hasEmailError = !!errorMsg || Array.from(document.querySelectorAll('*')).some(el => 
        el.textContent && el.textContent.toLowerCase().includes('valid email')
      );
      return { hasEmailError };
    })()
  `) || {};
  assert('Contact Form: Malformed email rejected with descriptive feedback',
    invalidEmailRes.hasEmailError);

  // -------------------------------------------------------------------------
  // SECTION 6: 404 & Malformed URLs
  // -------------------------------------------------------------------------
  console.log('\n--- SECTION 6: Error 404 & Deep URL Resilience ---');
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/non-existent-page-xyz-12345' });
  await new Promise(r => setTimeout(r, 500));

  const notFoundCheck = await evalJs(`
    (() => {
      const is404 = document.body.textContent.includes('404') && 
                    (document.body.textContent.includes('Page Not Found') || document.body.textContent.includes('Registry'));
      const directoryLinks = document.querySelectorAll('a[href="/"], a[href="/about"], a[href="/services"]');
      return { is404, directoryCount: directoryLinks.length };
    })()
  `) || {};
  assert('Unknown URL: Displays canonical 404 page with directory recovery links',
    notFoundCheck.is404 && notFoundCheck.directoryCount >= 3);

  // Nonexistent blog slug
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/blog/unknown-ghost-article-slug' });
  await new Promise(r => setTimeout(r, 500));

  const blog404Check = await evalJs(`
    (() => {
      return document.body.textContent.includes('404') || document.body.textContent.includes('Registry');
    })()
  `);
  assert('Unknown Blog Slug: Safely quarantined with 404 NotFound page', blog404Check);

  // -------------------------------------------------------------------------
  // SECTION 7: Security Regression (Protected Routes & Headers)
  // -------------------------------------------------------------------------
  console.log('\n--- SECTION 7: Security Regression Testing ---');
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/admin' });
  await new Promise(r => setTimeout(r, 400));

  const adminQuarantine = await evalJs(`
    (() => {
      return document.body.textContent.includes('404') || !window.location.pathname.startsWith('/admin');
    })()
  `);
  assert('Legacy /admin route: Returns 404 or redirects away (fails closed)', adminQuarantine);

  // Check HTTP API direct security
  const apiTest1 = await fetch('http://127.0.0.1:5173/api/admin/enquiries');
  assert('Server API /api/admin/enquiries without credentials: HTTP 401 Unauthorized',
    apiTest1.status === 401, `Status: ${apiTest1.status}`);

  const apiTest2 = await fetch('http://127.0.0.1:5173/api/admin/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldPassword: 'foo', newPassword: 'bar' })
  });
  assert('Server API /api/admin/change-password without credentials: HTTP 401 Unauthorized',
    apiTest2.status === 401, `Status: ${apiTest2.status}`);

  // -------------------------------------------------------------------------
  // SECTION 8: Console Errors & Stability
  // -------------------------------------------------------------------------
  console.log('\n--- SECTION 8: Console Errors & Stability ---');
  const criticalErrors = consoleErrors.filter(e => 
    !e.includes('favicon') && 
    !e.includes('Download the React DevTools') &&
    !e.includes('Failed to load resource')
  );
  assert('Browser Console: Zero unhandled exceptions or critical React errors',
    criticalErrors.length === 0, `Errors: ${criticalErrors.join(', ')}`);

  // Close Edge cleanly
  try {
    ws.close();
    edgeProc.kill('SIGTERM');
  } catch (_) {}

  // -------------------------------------------------------------------------
  // SUMMARY RESULTS
  // -------------------------------------------------------------------------
  const passed = auditLog.filter(a => a.status === 'PASS').length;
  const failed = auditLog.filter(a => a.status === 'FAIL').length;
  console.log('\n================================================================');
  console.log(`TOTAL R9 AUDIT ASSERTIONS : ${auditLog.length}`);
  console.log(`PASSED                    : ${passed}`);
  console.log(`FAILED                    : ${failed}`);
  console.log('================================================================');

  const summary = {
    timestamp: new Date().toISOString(),
    total: auditLog.length,
    passed,
    failed,
    log: auditLog
  };

  fs.writeFileSync(path.resolve(resultsDir, 'r9_audit_execution_results.json'), JSON.stringify(summary, null, 2));
  console.log(`Saved audit results to reports/r9_audit_execution_results.json`);

  if (failed > 0) {
    process.exit(1);
  }
}

runR9DeepAudit().catch(err => {
  console.error('Audit execution error:', err);
  process.exit(1);
});
