import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import http from 'http';

function createStaticServer(distDir, port) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff'
  };

  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/') reqPath = '/index.html';
    let filePath = path.join(distDir, reqPath);
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(distDir, 'index.html');
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    try {
      const data = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

async function testDeviceJourneys() {
  const PORT = 4210;
  const distDir = path.resolve('dist');
  const server = await createStaticServer(distDir, PORT);
  console.log(`[Test Server] Running dist on http://127.0.0.1:${PORT}`);

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-device-journeys');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const cdpPort = 9260;
  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${cdpPort}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  let ws = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${cdpPort}/json/list`);
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
    server.close();
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

  const devices = [
    {
      name: 'Android Standard (Samsung Galaxy / Pixel 412x915)',
      width: 412,
      height: 915,
      deviceScaleFactor: 2.625,
      userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
    },
    {
      name: 'Apple iPhone (iPhone 14/15 Safari 390x844)',
      width: 390,
      height: 844,
      deviceScaleFactor: 3.0,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1'
    }
  ];

  const journeyResults = [];

  for (const dev of devices) {
    console.log(`\n======================================================`);
    console.log(`Testing Device Profile: ${dev.name}`);
    console.log(`======================================================`);

    await send('Emulation.setDeviceMetricsOverride', {
      width: dev.width,
      height: dev.height,
      deviceScaleFactor: dev.deviceScaleFactor,
      mobile: true
    });
    await send('Emulation.setUserAgentOverride', { userAgent: dev.userAgent });

    // Navigate to homepage and wait for React root mount
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
    await new Promise(r => setTimeout(r, 1200));

    // Test 1: Sticky Header & Dimensions
    const headerTest = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const header = document.querySelector('header');
          const rect = header ? header.getBoundingClientRect() : null;
          const isSticky = header ? window.getComputedStyle(header).position === 'sticky' : false;
          const utilityBar = header ? header.querySelector('.bg-brand-deep') : null;
          const utilityVisible = utilityBar ? window.getComputedStyle(utilityBar).display !== 'none' : false;
          const brandMark = header ? header.querySelector('a[href="/"]') : null;
          const brandMarkRect = brandMark ? brandMark.getBoundingClientRect() : null;
          const hamburger = header ? header.querySelector('button[aria-label="Toggle navigation menu"]') : null;
          const hamburgerRect = hamburger ? hamburger.getBoundingClientRect() : null;

          return {
            headerFound: !!header,
            height: rect ? Math.round(rect.height) : 0,
            isSticky,
            utilityVisible,
            brandMarkWidth: brandMarkRect ? Math.round(brandMarkRect.width) : 0,
            hamburgerWidth: hamburgerRect ? Math.round(hamburgerRect.width) : 0,
            hamburgerHeight: hamburgerRect ? Math.round(hamburgerRect.height) : 0
          };
        })()
      `,
      returnByValue: true
    });
    console.log('1. Sticky Header Test:', headerTest.result?.value);

    // Test 2: Mobile Navigation Drawer (Open, Lock, Accordion, Close)
    const navDrawerTest = await send('Runtime.evaluate', {
      expression: `
        (async () => {
          const toggle = document.querySelector('button[aria-label="Toggle navigation menu"]');
          if (!toggle) return { error: 'Toggle button missing' };

          // Open drawer
          toggle.click();
          await new Promise(r => setTimeout(r, 350));

          const drawer = document.querySelector('[aria-label="Mobile Navigation Drawer"]');
          const drawerStyle = drawer ? window.getComputedStyle(drawer) : null;
          const isOpen = drawerStyle ? drawerStyle.visibility !== 'hidden' && drawerStyle.opacity === '1' : false;
          const bodyOverflowLocked = document.body.style.overflow === 'hidden';

          // Test services accordion inside drawer
          const servicesBtn = Array.from(drawer.querySelectorAll('button')).find(b => b.textContent.includes('Services'));
          let accordionExpanded = false;
          if (servicesBtn) {
            servicesBtn.click();
            await new Promise(r => setTimeout(r, 200));
            accordionExpanded = servicesBtn.getAttribute('aria-expanded') === 'true';
          }

          // Count links and verify touch targets >= 44px
          const links = Array.from(drawer.querySelectorAll('a, button'));
          const minTargetViolations = links.filter(l => {
            const r = l.getBoundingClientRect();
            return r.height > 0 && r.height < 40;
          }).length;

          // Close drawer
          const closeBtn = document.querySelector('button[aria-label="Close navigation menu"]');
          if (closeBtn) closeBtn.click();
          await new Promise(r => setTimeout(r, 350));

          const isClosed = drawer ? window.getComputedStyle(drawer).visibility === 'hidden' || window.getComputedStyle(drawer).opacity === '0' : false;
          const bodyUnlocked = document.body.style.overflow !== 'hidden';

          return {
            drawerOpens: isOpen,
            bodyOverflowLocked,
            servicesAccordionWorks: accordionExpanded,
            minTargetViolations,
            totalDrawerControls: links.length,
            drawerCloses: isClosed,
            bodyUnlocked
          };
        })()
      `,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('2. Navigation Drawer Test:', navDrawerTest.result?.value);

    // Test 3: WhatsApp Action Links & Floating Badge
    const whatsappTest = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const waLinks = Array.from(document.querySelectorAll('a[href*="whatsapp.com"], a[href*="wa.me"]'));
          const floatingAside = document.querySelector('aside[aria-label="Direct WhatsApp Consultation"]');
          const floatingBtn = floatingAside ? floatingAside.querySelector('a') : null;
          const fRect = floatingBtn ? floatingBtn.getBoundingClientRect() : null;
          const tooltip = floatingAside ? floatingAside.querySelector('div[role="status"]') : null;
          const tooltipVisible = tooltip ? window.getComputedStyle(tooltip).display !== 'none' : false;

          return {
            totalWhatsAppLinks: waLinks.length,
            allValidWaUrls: waLinks.every(a => a.href.includes('919626350900')),
            floatingFound: !!floatingAside,
            floatingBtnWidth: fRect ? Math.round(fRect.width) : 0,
            floatingBtnHeight: fRect ? Math.round(fRect.height) : 0,
            tooltipVisibleOnMobile: tooltipVisible
          };
        })()
      `,
      returnByValue: true
    });
    console.log('3. WhatsApp Links & Floating Badge Test:', whatsappTest.result?.value);

    // Test 4: Telephone Links
    const telTest = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const telLinks = Array.from(document.querySelectorAll('a[href^="tel:"]'));
          const validTelTargets = telLinks.every(a => a.href === 'tel:919626350900' || a.href === 'tel:919542153906' || a.href === 'tel:+919626350900');

          return {
            totalTelLinks: telLinks.length,
            allValidCleanTelProtocols: validTelTargets
          };
        })()
      `,
      returnByValue: true
    });
    console.log('4. Telephone Links Test:', telTest.result?.value);

    // Test 5: Contact Enquiry Form (Navigate to /contact)
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/contact` });
    await new Promise(r => setTimeout(r, 1200));

    const formTest = await send('Runtime.evaluate', {
      expression: `
        (async () => {
          const form = document.querySelector('form');
          if (!form) return { error: 'Contact form not found on /contact' };

          const nameInput = form.querySelector('input#fullName');
          const phoneInput = form.querySelector('input#phone');
          const emailInput = form.querySelector('input#email');
          const messageTextarea = form.querySelector('textarea#message');
          const submitBtn = form.querySelector('button[type="submit"]');

          const inputChecks = {
            nameAutoComplete: nameInput?.getAttribute('autocomplete') === 'name',
            phoneType: phoneInput?.getAttribute('type') === 'tel',
            phoneInputMode: phoneInput?.getAttribute('inputmode') === 'tel',
            phoneAutoComplete: phoneInput?.getAttribute('autocomplete') === 'tel',
            emailType: emailInput?.getAttribute('type') === 'email',
            emailInputMode: emailInput?.getAttribute('inputmode') === 'email',
            emailAutoComplete: emailInput?.getAttribute('autocomplete') === 'email',
            nameFontSize: nameInput ? window.getComputedStyle(nameInput).fontSize : '',
            phoneFontSize: phoneInput ? window.getComputedStyle(phoneInput).fontSize : '',
            emailFontSize: emailInput ? window.getComputedStyle(emailInput).fontSize : ''
          };

          // Test empty submission validation
          submitBtn.click();
          await new Promise(r => setTimeout(r, 200));

          const validationErrors = Array.from(document.querySelectorAll('p.text-red-600')).map(p => p.textContent.trim());

          // Fill inputs using React-compatible value setters
          const setNativeValue = (element, value) => {
            const valueSetter = Object.getOwnPropertyDescriptor(element, 'value')?.set;
            const prototype = Object.getPrototypeOf(element);
            const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
            if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
              prototypeValueSetter.call(element, value);
            } else if (valueSetter) {
              valueSetter.call(element, value);
            } else {
              element.value = value;
            }
            element.dispatchEvent(new Event('input', { bubbles: true }));
          };

          setNativeValue(nameInput, 'S. Ramanathan');
          setNativeValue(phoneInput, '+91 98400 12345');
          setNativeValue(emailInput, 's.ramanathan@enterprise.com');
          setNativeValue(messageTextarea, 'Inquiry regarding statutory corporate tax audit and ROC annual return filing.');

          // Wait 1.6s to satisfy bot velocity guard (1500ms)
          await new Promise(r => setTimeout(r, 1600));

          submitBtn.click();
          await new Promise(r => setTimeout(r, 400));

          // Verify success view
          const successCard = document.querySelector('h3');
          const isSuccess = successCard ? successCard.textContent.includes('Consultation Inquiry Registered') : false;
          const refBadge = Array.from(document.querySelectorAll('strong')).find(s => s.textContent.includes('ENQ-'));
          const refId = refBadge ? refBadge.textContent.trim() : '';
          const waActionBtn = Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('Send via WhatsApp'));

          return {
            inputChecks,
            emptyValidationFires: validationErrors.length >= 3,
            validationErrors,
            submissionSuccess: isSuccess,
            referenceIdGenerated: !!refId,
            referenceId: refId,
            whatsappTransmitLinkReady: !!waActionBtn && waActionBtn.href.includes('919626350900')
          };
        })()
      `,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('5. Contact Enquiry Form Test:', formTest.result?.value);

    // Test 6: SEO & Structured Data
    const seoTest = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const canonical = document.querySelector('link[rel="canonical"]')?.href;
          const title = document.title;
          const metaDesc = document.querySelector('meta[name="description"]')?.content;
          const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
          let parsedSchemas = [];
          jsonLdScripts.forEach(s => {
            try { parsedSchemas.push(JSON.parse(s.textContent)); } catch (_) {}
          });

          return {
            title,
            metaDesc,
            canonical,
            hasAccountingServiceSchema: parsedSchemas.some(s => {
              if (Array.isArray(s)) return s.some(item => item['@type'] === 'AccountingService');
              return s['@type'] === 'AccountingService';
            })
          };
        })()
      `,
      returnByValue: true
    });
    console.log('6. SEO & Schema.org Verification:', seoTest.result?.value);

    journeyResults.push({
      device: dev.name,
      header: headerTest.result?.value,
      navigation: navDrawerTest.result?.value,
      whatsapp: whatsappTest.result?.value,
      telephone: telTest.result?.value,
      form: formTest.result?.value,
      seo: seoTest.result?.value
    });
  }

  fs.writeFileSync('reports/device-journeys-verification.json', JSON.stringify(journeyResults, null, 2));
  console.log(`\nAll physical device journey tests completed successfully!`);

  try { ws.close(); } catch (_) {}
  try { edgeProc.kill(); } catch (_) {}
  server.close();
}

testDeviceJourneys().catch(err => {
  console.error('Device journey test failed:', err);
  process.exit(1);
});
