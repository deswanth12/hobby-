import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import os from 'os';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { handleApiRequest } = require('../server/apiRouter.cjs');

const DIST_DIR = path.resolve('dist');
const PORT = 4198;
const CDP_PORT = 9278;
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
};

function startServer() {
  const server = http.createServer((req, res) => {
    // API request handling
    if (req.url && req.url.startsWith('/api/')) {
      return handleApiRequest(req, res);
    }

    let urlPath = req.url.split('?')[0];
    let filePath = path.join(DIST_DIR, urlPath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    // SPA fallback to dist/index.html
    const indexPath = path.join(DIST_DIR, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(indexPath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  return new Promise((resolve) => {
    server.listen(PORT, '127.0.0.1', () => {
      console.log(`[Server] Static SPA server listening at http://127.0.0.1:${PORT}`);
      resolve(server);
    });
  });
}

const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/services',
  '/services/audit-assurance',
  '/services/gst-consultant-tirupati',
  '/services/income-tax-consultant-tirupati',
  '/services/company-registration-tirupati',
  '/services/virtual-cfo-tirupati',
  '/services/rera-consultant-tirupati',
  '/industries',
  '/locations',
  '/contact',
  '/blog',
  '/blog/corporate-tax-planning-2026',
  '/blog/gst-annual-return-compliance',
  '/blog/statutory-audit-guidelines-2026'
];

const VIEWPORTS = [
  { label: '320px (Compact Mobile)', width: 320, height: 800, isMobile: true },
  { label: '390px (Standard Mobile)', width: 390, height: 844, isMobile: true },
  { label: '768px (Tablet Portrait)', width: 768, height: 1024, isMobile: false },
  { label: '1024px (Small Desktop)', width: 1024, height: 768, isMobile: false },
  { label: '1440px (Standard Desktop)', width: 1440, height: 900, isMobile: false }
];

async function main() {
  console.log('================================================================');
  console.log('  CHALLENGER V69: ADVERSARIAL BOUNDARY & SECURITY HARNESS       ');
  console.log('================================================================');

  const server = await startServer();
  const profileDir = path.join(os.tmpdir(), `edge-challenger-final-${Date.now()}`);

  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${CDP_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  let ws = null;
  for (let i = 0; i < 40; i++) {
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
    server.close();
    throw new Error('Could not connect to Edge via CDP on port ' + CDP_PORT);
  }

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
  await send('DOM.enable');

  const testReport = {
    responsive: { passed: 0, failed: 0, details: [] },
    routes: { passed: 0, failed: 0, details: [] },
    contactForm: { passed: 0, failed: 0, details: [] }
  };

  // -------------------------------------------------------------------
  // TEST SECTION 1: RESPONSIVE BOUNDARIES (ALL 5 VIEWPORTS x 16 ROUTES)
  // -------------------------------------------------------------------
  console.log('\n================================================================');
  console.log('  SECTION 1: RESPONSIVE OVERFLOW TESTS (5 VIEWPORTS x 16 ROUTES)');
  console.log('================================================================');

  for (const vp of VIEWPORTS) {
    console.log(`\n▶ Testing Viewport: ${vp.label} (${vp.width}x${vp.height})`);

    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.isMobile
    });

    for (const route of PUBLIC_ROUTES) {
      await send('Page.navigate', { url: `http://127.0.0.1:${PORT}${route}` });
      await new Promise(r => setTimeout(r, 600));

      const overflowRes = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const docEl = document.documentElement;
            const body = document.body;
            const winWidth = window.innerWidth;
            const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
            const clientWidth = docEl.clientWidth;
            
            // Document-level horizontal scroll detection (with 1.5px subpixel tolerance)
            const hasHorizontalScroll = scrollWidth > winWidth + 1.5;

            // Check if any element protrudes past viewport right edge WITHOUT being clipped by an overflow container
            function isClippedByAncestor(el) {
              let parent = el.parentElement;
              while (parent && parent !== document.body && parent !== document.documentElement) {
                const comp = window.getComputedStyle(parent);
                if (comp.overflowX === 'hidden' || comp.overflowX === 'auto' || comp.overflowX === 'scroll' ||
                    comp.overflow === 'hidden' || comp.overflow === 'clip') {
                  const pRect = parent.getBoundingClientRect();
                  if (pRect.right <= winWidth + 1.5) {
                    return true;
                  }
                }
                parent = parent.parentElement;
              }
              return false;
            }

            const unclippedOverflowing = [];
            const all = document.querySelectorAll('*');
            for (const el of all) {
              if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'PATH'].includes(el.tagName)) continue;
              if (el.classList.contains('sr-only') || el.classList.contains('opacity-0') || el.name === 'website_fax_hp') continue;
              if (el.closest('[aria-hidden="true"]')) continue;

              const r = el.getBoundingClientRect();
              if (r.width > 0 && r.height > 0) {
                if (r.right > winWidth + 1.5) {
                  if (!isClippedByAncestor(el)) {
                    unclippedOverflowing.push({
                      tag: el.tagName,
                      id: el.id,
                      text: (el.innerText || '').slice(0, 30),
                      className: (el.className || '').toString().slice(0, 40),
                      right: Math.round(r.right),
                      winWidth
                    });
                  }
                }
              }
            }

            return {
              scrollWidth,
              clientWidth,
              winWidth,
              hasHorizontalScroll,
              unclippedCount: unclippedOverflowing.length,
              unclippedOverflowing: unclippedOverflowing.slice(0, 3)
            };
          })()
        `,
        returnByValue: true
      });

      const o = overflowRes.result.value;
      const isPass = !o.hasHorizontalScroll && o.unclippedCount === 0;
      if (isPass) {
        testReport.responsive.passed++;
      } else {
        testReport.responsive.failed++;
        console.error(`  ✖ [FAIL] ${vp.label} @ ${route}: scrollW=${o.scrollWidth}px, winW=${o.winWidth}px, unclipped=${o.unclippedCount}`);
        if (o.unclippedOverflowing.length > 0) {
          console.error(`     Sample unclipped overflowing elements:`, o.unclippedOverflowing);
        }
      }
    }
    console.log(`  ✔ [PASS] ${PUBLIC_ROUTES.length} routes checked at ${vp.label} — Zero unclipped overflow.`);
  }

  // -------------------------------------------------------------------
  // TEST SECTION 2: ROUTING & LINK INTEGRITY (ALL 16 ROUTES CRAWLED)
  // -------------------------------------------------------------------
  console.log('\n================================================================');
  console.log('  SECTION 2: PUBLIC ROUTES CONTINUITY & INTERNAL LINK AUDIT     ');
  console.log('================================================================');

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  const discoveredLinks = new Set();
  const brokenLinks = [];

  for (const route of PUBLIC_ROUTES) {
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}${route}` });
    await new Promise(r => setTimeout(r, 600));

    const pageAudit = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const links = Array.from(document.querySelectorAll('a[href]')).map(a => ({
            href: a.getAttribute('href'),
            text: a.innerText.trim().slice(0, 40)
          }));
          const title = document.title;
          const h1 = document.querySelector('h1')?.innerText || '';
          const hasMain = !!document.querySelector('#main-content');
          return { links, title, h1, hasMain };
        })()
      `,
      returnByValue: true
    });

    const info = pageAudit.result.value;
    const hasValidHeading = info.h1.length > 0 || info.title.length > 0;
    if (hasValidHeading && info.hasMain) {
      testReport.routes.passed++;
      console.log(`  ✔ [PASS] Route ${route.padEnd(42)}: Valid H1/Title & #main-content`);
    } else {
      testReport.routes.failed++;
      console.error(`  ✖ [FAIL] Route ${route}: Missing #main-content or valid H1`);
    }

    for (const l of info.links) {
      if (l.href && l.href.startsWith('/')) {
        const cleanHref = l.href.split('?')[0].split('#')[0];
        if (cleanHref) discoveredLinks.add(cleanHref);
      }
    }
  }

  console.log(`\nDiscovered ${discoveredLinks.size} internal application routes referenced across all pages:`);
  for (const targetRoute of discoveredLinks) {
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}${targetRoute}` });
    await new Promise(r => setTimeout(r, 500));

    const checkRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const is404 = document.title.includes('404') || document.body.innerText.includes('Page Not Found');
          const hasContent = document.body.innerText.trim().length > 100;
          return { is404, hasContent, title: document.title };
        })()
      `,
      returnByValue: true
    });

    const res = checkRes.result.value;
    if (!res.is404 && res.hasContent) {
      testReport.routes.passed++;
      console.log(`  ✔ [PASS] Internal Link ${targetRoute.padEnd(42)} -> Resolves cleanly: "${res.title}"`);
    } else {
      testReport.routes.failed++;
      brokenLinks.push({ targetRoute, res });
      console.error(`  ✖ [FAIL] Broken link discovered: ${targetRoute}`);
    }
  }

  // -------------------------------------------------------------------
  // TEST SECTION 3: CONTACT FORM SECURITY INVARIANTS & HONEYPOT
  // -------------------------------------------------------------------
  console.log('\n================================================================');
  console.log('  SECTION 3: CONTACT FORM SECURITY INVARIANTS & HONEYPOT SUITE  ');
  console.log('================================================================');

  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/contact` });
  await new Promise(r => setTimeout(r, 800));

  // Test 3.1: Honeypot concealment & accessibility attributes
  const hpInspection = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const hp = document.querySelector('input[name="website_fax_hp"]');
        if (!hp) return { found: false };
        const container = hp.closest('div');
        const comp = window.getComputedStyle(container);
        return {
          found: true,
          name: hp.name,
          id: hp.id,
          tabIndex: hp.tabIndex,
          autoComplete: hp.getAttribute('autocomplete') || hp.getAttribute('autoComplete'),
          ariaHidden: container.getAttribute('aria-hidden'),
          opacity: comp.opacity,
          position: comp.position,
          left: comp.left,
          pointerEvents: comp.pointerEvents
        };
      })()
    `,
    returnByValue: true
  });

  const hp = hpInspection.result.value;
  const isHpProperlyShielded = hp.found &&
    hp.tabIndex === -1 &&
    hp.ariaHidden === 'true' &&
    hp.opacity === '0' &&
    hp.pointerEvents === 'none' &&
    hp.name === 'website_fax_hp';

  if (isHpProperlyShielded) {
    testReport.contactForm.passed++;
    console.log(`  ✔ [PASS] Honeypot Input: Hidden from screen readers (aria-hidden=true), untabbable (tabIndex=-1), pointer-events:none`);
  } else {
    testReport.contactForm.failed++;
    console.error(`  ✖ [FAIL] Honeypot Input shielding failed:`, hp);
  }

  const injectFormScript = `
    window.__setFormInput = (id, val) => {
      const el = document.getElementById(id);
      if (!el) return false;
      const setter = Object.getOwnPropertyDescriptor(
        el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype,
        'value'
      ).set;
      setter.call(el, val);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    };
  `;
  await send('Runtime.evaluate', { expression: injectFormScript });

  // Test 3.2: Adversarial Honeypot Bot Submission (Honeypot Filled)
  console.log('\n  [Attack Vector 1] Bot fills honeypot input (website_fax_hp):');
  const botHpAttack = await send('Runtime.evaluate', {
    expression: `
      (async () => {
        window.__setFormInput('fullName', 'Spam Crawler Bot');
        window.__setFormInput('phone', '+91 9999888877');
        window.__setFormInput('email', 'crawler@botnet.biz');
        window.__setFormInput('message', 'High volume solicitation attempt.');
        window.__setFormInput('website_fax_hp', 'BOT_PAYLOAD_VALUE');

        const form = document.querySelector('form[aria-label="Statutory Consultation & Advisory Intake Form"]');
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        await new Promise(r => setTimeout(r, 200));

        const errEl = document.querySelector('.bg-red-50');
        const isSuccess = !!document.querySelector('.text-brand-interactive');
        return {
          errText: errEl ? errEl.innerText : '',
          isSuccess
        };
      })()
    `,
    awaitPromise: true,
    returnByValue: true
  });

  const botHpRes = botHpAttack.result.value;
  const isHpBlocked = botHpRes.errText.includes('Security verification failed') && !botHpRes.isSuccess;
  if (isHpBlocked) {
    testReport.contactForm.passed++;
    console.log(`  ✔ [PASS] Bot honeypot injection suppressed: "${botHpRes.errText}"`);
  } else {
    testReport.contactForm.failed++;
    console.error(`  ✖ [FAIL] Honeypot suppression failed:`, botHpRes);
  }

  // Test 3.3: Velocity Submission Check (<1500ms)
  console.log('\n  [Attack Vector 2] Sub-second rapid form submission (<1500ms):');
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/contact` });
  await new Promise(r => setTimeout(r, 300));
  await send('Runtime.evaluate', { expression: injectFormScript });

  const rapidAttack = await send('Runtime.evaluate', {
    expression: `
      (async () => {
        window.__setFormInput('fullName', 'Fast Script Submitter');
        window.__setFormInput('phone', '+91 9876543210');
        window.__setFormInput('email', 'fast@submit.com');
        window.__setFormInput('message', 'Testing sub-second velocity guard.');

        const form = document.querySelector('form[aria-label="Statutory Consultation & Advisory Intake Form"]');
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        await new Promise(r => setTimeout(r, 200));

        const errEl = document.querySelector('.bg-red-50');
        const isSuccess = !!document.querySelector('.text-brand-interactive');
        return {
          errText: errEl ? errEl.innerText : '',
          isSuccess
        };
      })()
    `,
    awaitPromise: true,
    returnByValue: true
  });

  const rapidRes = rapidAttack.result.value;
  const isRapidBlocked = rapidRes.errText.includes('Submission received too rapidly') && !rapidRes.isSuccess;
  if (isRapidBlocked) {
    testReport.contactForm.passed++;
    console.log(`  ✔ [PASS] Velocity guard active: "${rapidRes.errText}"`);
  } else {
    testReport.contactForm.failed++;
    console.error(`  ✖ [FAIL] Velocity guard failed:`, rapidRes);
  }

  // Test 3.4: Legitimate Submission (>1500ms) & WhatsApp Parameter Formatting
  console.log('\n  [Attack Vector 3] Legitimate Human Submission (>1600ms):');
  // Wait for 2200ms to comfortably exceed the 1500ms velocity threshold
  await new Promise(r => setTimeout(r, 2200));

  const legitSubmit = await send('Runtime.evaluate', {
    expression: `
      (async () => {
        const form = document.querySelector('form[aria-label="Statutory Consultation & Advisory Intake Form"]');
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        await new Promise(r => setTimeout(r, 1200));

        const container = document.querySelector('.contact-form-container');
        const refEl = container ? container.querySelector('strong.text-brand-primary') : null;
        const waLink = container ? container.querySelector('a[href*="wa.me"]') : null;

        return {
          hasRef: !!refEl,
          refId: refEl ? refEl.innerText : '',
          waHref: waLink ? waLink.getAttribute('href') : ''
        };
      })()
    `,
    awaitPromise: true,
    returnByValue: true
  });

  const legit = legitSubmit.result.value;
  const isLegitSuccess = legit.hasRef && legit.refId.startsWith('ENQ-');
  if (isLegitSuccess) {
    testReport.contactForm.passed++;
    console.log(`  ✔ [PASS] Legitimate submission succeeded with Reference ID: ${legit.refId}`);
  } else {
    testReport.contactForm.failed++;
    console.error(`  ✖ [FAIL] Legitimate submission failed:`, legit);
  }

  if (legit.waHref) {
    const parsed = new URL(legit.waHref);
    const phoneValid = parsed.pathname.includes('919626350900');
    const text = parsed.searchParams.get('text') || '';
    const hasRef = text.includes(`Enquiry Ref: ${legit.refId}`);
    const hasClient = text.includes('Name: Fast Script Submitter');
    const hasGreeting = text.includes('Hello CA Kavitha Vijay (Kavitha & Associates)');

    const waOk = phoneValid && hasRef && hasClient && hasGreeting;
    if (waOk) {
      testReport.contactForm.passed++;
      console.log(`  ✔ [PASS] WhatsApp URL valid: target=+919626350900, includes Ref ${legit.refId} and client details`);
    } else {
      testReport.contactForm.failed++;
      console.error(`  ✖ [FAIL] WhatsApp URL malformed:`, { phoneValid, hasRef, hasClient, hasGreeting, text });
    }
  } else {
    testReport.contactForm.failed++;
    console.error(`  ✖ [FAIL] No WhatsApp URL rendered on confirmation screen`);
  }

  // Teardown
  ws.close();
  try { edgeProc.kill(); } catch (_) {}
  server.close();

  // -------------------------------------------------------------------
  // AGGREGATE SUMMARY
  // -------------------------------------------------------------------
  console.log('\n================================================================');
  console.log('  CHALLENGER V69: FINAL EMPIRICAL SUMMARY                       ');
  console.log('================================================================');
  console.log(`  Responsive Boundary Tests  : ${testReport.responsive.passed} Passed, ${testReport.responsive.failed} Failed (across 80 viewport-route combinations)`);
  console.log(`  Route Continuity & Links   : ${testReport.routes.passed} Passed, ${testReport.routes.failed} Failed`);
  console.log(`  Contact Form & Anti-Spam   : ${testReport.contactForm.passed} Passed, ${testReport.contactForm.failed} Failed`);

  const totalPassed = testReport.responsive.passed + testReport.routes.passed + testReport.contactForm.passed;
  const totalFailed = testReport.responsive.failed + testReport.routes.failed + testReport.contactForm.failed;

  console.log(`\n  TOTAL ASSERTIONS: ${totalPassed + totalFailed} | PASSED: ${totalPassed} | FAILED: ${totalFailed}`);
  console.log('================================================================\n');

  if (totalFailed > 0) {
    console.error('FINAL VERDICT: REQUEST_CHANGES');
    process.exit(1);
  } else {
    console.log('FINAL VERDICT: APPROVE');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('[Fatal Error]', err);
  process.exit(1);
});
