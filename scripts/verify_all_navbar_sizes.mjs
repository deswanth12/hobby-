import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const REMOTE_PORT = 9231;
const BASE_URL = 'http://localhost:4173';
const BRAIN_DIR = 'C:\\Users\\k deswanth\\.gemini\\antigravity\\brain\\12a17cde-3e50-4191-8739-afaecddf2151';

const SIZES_TO_TEST = [
  { name: '320px_iphone_se1', width: 320, height: 568, isMobile: true, category: 'Ultra-Compact Mobile' },
  { name: '360px_galaxy_s', width: 360, height: 740, isMobile: true, category: 'Compact Android' },
  { name: '375px_iphone_mini', width: 375, height: 667, isMobile: true, category: 'Standard Compact' },
  { name: '390px_iphone_14', width: 390, height: 844, isMobile: true, category: 'Modern Flagship Mobile' },
  { name: '414px_iphone_plus', width: 414, height: 896, isMobile: true, category: 'Large Mobile' },
  { name: '430px_iphone_promax', width: 430, height: 932, isMobile: true, category: 'Max Mobile' },
  { name: '600px_foldable', width: 600, height: 800, isMobile: true, category: 'Foldable / Phablet' },
  { name: '768px_ipad_portrait', width: 768, height: 1024, isMobile: false, category: 'Tablet Portrait' },
  { name: '834px_ipad_pro11', width: 834, height: 1194, isMobile: false, category: 'Tablet Pro Portrait' },
  { name: '1024px_laptop_125dpi', width: 1024, height: 768, isMobile: false, category: 'Compact Laptop (1024px)' },
  { name: '1100px_surface_125dpi', width: 1100, height: 780, isMobile: false, category: 'Surface / Netbook (1100px)' },
  { name: '1200px_large_tablet', width: 1200, height: 800, isMobile: false, category: 'Sub-Desktop (1200px)' },
  { name: '1280px_macbook_air', width: 1280, height: 800, isMobile: false, category: 'Laptop Native (1280px)' },
  { name: '1366px_hd_laptop', width: 1366, height: 768, isMobile: false, category: 'HD Laptop (1366px)' },
  { name: '1440px_macbook_pro', width: 1440, height: 900, isMobile: false, category: 'Retina Desktop (1440px)' },
  { name: '1536px_fhd_125dpi', width: 1536, height: 864, isMobile: false, category: 'FHD 125% Scaled (1536px)' },
  { name: '1920px_fhd_native', width: 1920, height: 1080, isMobile: false, category: 'Full HD 1080p (1920px)' },
  { name: '2560px_2k_qhd', width: 2560, height: 1440, isMobile: false, category: '2K / QHD Display (2560px)' },
];

async function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

class CDP {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    return new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
      this.ws.onmessage = (event) => {
        const parsed = JSON.parse(event.data);
        if (parsed.id && this.callbacks.has(parsed.id)) {
          const { resolve, reject } = this.callbacks.get(parsed.id);
          this.callbacks.delete(parsed.id);
          if (parsed.error) reject(new Error(parsed.error.message));
          else resolve(parsed.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  console.log('Spawning Vite preview server on port 4173...');
  const previewProc = spawn('npx.cmd', ['vite', 'preview', '--port', '4173'], {
    shell: true,
    stdio: 'ignore'
  });

  // Wait for preview server
  for (let i = 0; i < 30; i++) {
    try {
      await new Promise((res, rej) => {
        const req = http.get(BASE_URL, (r) => res(r.statusCode));
        req.on('error', rej);
        req.setTimeout(500, () => { req.destroy(); rej(new Error('timeout')); });
      });
      break;
    } catch {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  console.log('Spawning Edge for exhaustive 18-size navbar test...');
  const profileDir = path.resolve('.temp_edge_navbar_all_sizes');
  const edgeProc = spawn(EDGE_PATH, [
    `--remote-debugging-port=${REMOTE_PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + profileDir
  ]);

  const report = [];

  try {
    let versionData = null;
    for (let i = 0; i < 30; i++) {
      try {
        versionData = await getJson(`http://localhost:${REMOTE_PORT}/json/version`);
        if (versionData && versionData.webSocketDebuggerUrl) break;
      } catch (e) {
        await new Promise(r => setTimeout(r, 200));
      }
    }

    if (!versionData || !versionData.webSocketDebuggerUrl) {
      throw new Error('Failed to connect to Edge remote debugging port');
    }

    const browserCdp = new CDP(versionData.webSocketDebuggerUrl);
    await browserCdp.connect();

    const { targetId } = await browserCdp.send('Target.createTarget', { url: 'about:blank' });
    const targets = await getJson(`http://localhost:${REMOTE_PORT}/json`);
    const pageTarget = targets.find(t => t.id === targetId);

    const pageCdp = new CDP(pageTarget.webSocketDebuggerUrl);
    await pageCdp.connect();

    await pageCdp.send('Page.enable');
    await pageCdp.send('DOM.enable');

    for (const sz of SIZES_TO_TEST) {
      await pageCdp.send('Emulation.setDeviceMetricsOverride', {
        width: sz.width,
        height: sz.height,
        deviceScaleFactor: 2,
        mobile: sz.isMobile
      });

      await pageCdp.send('Page.navigate', { url: BASE_URL });
      await new Promise(r => setTimeout(r, 1000));

      // Comprehensive Navbar Overlap & Spacing Evaluation
      const evalResult = await pageCdp.send('Runtime.evaluate', {
        expression: `(() => {
          const docScroll = document.documentElement.scrollWidth;
          const docClient = document.documentElement.clientWidth;
          const hasPageOverflow = docScroll > docClient;

          const header = document.querySelector('header');
          const nav = document.querySelector('nav[aria-label="Main Navigation"]');
          const topBar = header ? header.querySelector('.hidden.md\\\\:block') : null;

          // Brand Mark
          const brand = nav ? nav.querySelector('a[aria-label="Kavitha & Associates Homepage"]') : null;
          const brandRect = brand ? brand.getBoundingClientRect() : null;

          // Links container
          const linksContainer = nav ? nav.querySelector('.hidden.lg\\\\:flex') : null;
          const isDesktopNavVisible = linksContainer && window.getComputedStyle(linksContainer).display !== 'none';
          
          let navLinks = [];
          let linkOverlapCount = 0;
          let linkCollisions = [];

          if (isDesktopNavVisible) {
            navLinks = Array.from(linksContainer.querySelectorAll('a')).filter(a => !a.classList.contains('hidden')).map(a => ({
              text: a.textContent.trim(),
              rect: a.getBoundingClientRect()
            }));

            // Check brand vs first link (Home)
            if (brandRect && navLinks.length > 0) {
              const firstLink = navLinks[0];
              const gapWithBrand = firstLink.rect.left - brandRect.right;
              if (gapWithBrand < 0) {
                linkCollisions.push({
                  item1: 'Brand Logo',
                  item2: firstLink.text,
                  overlapPx: Math.abs(gapWithBrand)
                });
              }
            }

            // Check pairwise link overlaps
            for (let i = 0; i < navLinks.length - 1; i++) {
              const current = navLinks[i];
              const next = navLinks[i + 1];
              const gap = next.rect.left - current.rect.right;
              if (gap < -1) { // 1px rounding tolerance
                linkCollisions.push({
                  item1: current.text,
                  item2: next.text,
                  overlapPx: Math.abs(gap)
                });
              }
            }
          }

          // CTAs (WhatsApp & Request Consultation)
          const ctaContainer = nav ? nav.querySelectorAll('.hidden.lg\\\\:flex')[1] : null;
          const isCtasVisible = ctaContainer && window.getComputedStyle(ctaContainer).display !== 'none';
          let ctaCollisions = [];
          let ctaGapWithLastLink = null;

          if (isCtasVisible && isDesktopNavVisible && navLinks.length > 0) {
            const lastLink = navLinks[navLinks.length - 1];
            const ctaRect = ctaContainer.getBoundingClientRect();
            ctaGapWithLastLink = ctaRect.left - lastLink.rect.right;
            if (ctaGapWithLastLink < 0) {
              ctaCollisions.push({
                item1: lastLink.text,
                item2: 'Right CTAs',
                overlapPx: Math.abs(ctaGapWithLastLink)
              });
            }

            // Check WhatsApp vs Consultation CTA
            const ctaButtons = Array.from(ctaContainer.children).map(c => ({
              tag: c.tagName,
              text: c.textContent.trim() || 'WhatsApp Icon',
              rect: c.getBoundingClientRect()
            }));
            if (ctaButtons.length >= 2) {
              const ctaGap = ctaButtons[1].rect.left - ctaButtons[0].rect.right;
              if (ctaGap < -1) {
                ctaCollisions.push({
                  item1: ctaButtons[0].text,
                  item2: ctaButtons[1].text,
                  overlapPx: Math.abs(ctaGap)
                });
              }
            }
          }

          // Mobile hamburger button
          const hamburger = nav ? nav.querySelector('button[aria-label="Open mobile navigation menu"]') : null;
          let hamburgerGapWithBrand = null;
          let hamburgerCollision = false;
          if (hamburger && window.getComputedStyle(hamburger).display !== 'none' && brandRect) {
            const hRect = hamburger.getBoundingClientRect();
            hamburgerGapWithBrand = hRect.left - brandRect.right;
            if (hamburgerGapWithBrand < 0) {
              hamburgerCollision = true;
            }
          }

          // Top utility bar overlap
          let topBarCollisions = [];
          if (topBar && window.getComputedStyle(topBar).display !== 'none') {
            const topChildren = Array.from(topBar.firstElementChild.children);
            if (topChildren.length >= 2) {
              const leftCreds = topChildren[0].getBoundingClientRect();
              const rightChannels = topChildren[1].getBoundingClientRect();
              const topGap = rightChannels.left - leftCreds.right;
              if (topGap < -1) {
                topBarCollisions.push({
                  item1: 'Credentials',
                  item2: 'Direct Channels',
                  overlapPx: Math.abs(topGap)
                });
              }
            }
          }

          return {
            docScroll,
            docClient,
            hasPageOverflow,
            isDesktopNavVisible,
            linksCount: navLinks.length,
            brandWidth: brandRect ? Math.round(brandRect.width) : null,
            gapBrandToFirstLink: (navLinks.length > 0 && brandRect) ? Math.round(navLinks[0].rect.left - brandRect.right) : null,
            gapLastLinkToCtas: ctaGapWithLastLink !== null ? Math.round(ctaGapWithLastLink) : null,
            hamburgerGapWithBrand: hamburgerGapWithBrand !== null ? Math.round(hamburgerGapWithBrand) : null,
            linkCollisions,
            ctaCollisions,
            topBarCollisions,
            hasAnyCollision: (linkCollisions.length + ctaCollisions.length + topBarCollisions.length + (hamburgerCollision ? 1 : 0)) > 0
          };
        })()`,
        returnByValue: true
      });

      const res = evalResult.result.value;
      const pass = !res.hasPageOverflow && !res.hasAnyCollision;

      report.push({
        ...sz,
        ...res,
        pass
      });

      console.log(`[${sz.name}] ${sz.width}x${sz.height} (${sz.category}): ${pass ? 'PASS (0px overflow, 0 overlaps)' : 'FAIL'}`);
      if (!pass) {
        console.error('Details:', JSON.stringify(res, null, 2));
      }

      // Capture screenshot for key milestone sizes
      const keyScreens = [320, 390, 768, 1024, 1100, 1280, 1440, 1920];
      if (keyScreens.includes(sz.width)) {
        const { data: b64 } = await pageCdp.send('Page.captureScreenshot', {
          format: 'png',
          fromSurface: true,
          captureBeyondViewport: false,
          clip: {
            x: 0,
            y: 0,
            width: sz.width,
            height: 140, // Focus right on the navbar header
            scale: 2
          }
        });
        const outPath = path.join(BRAIN_DIR, `navbar_header_${sz.width}px.png`);
        fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
      }
    }

    pageCdp.close();
    browserCdp.close();
  } finally {
    try { edgeProc.kill('SIGKILL'); } catch {}
    try { previewProc.kill('SIGKILL'); } catch {}
  }

  // Summary table
  console.log('\n================================================================');
  console.log('              ALL 18 NAVBAR SIZES VERIFICATION SUMMARY          ');
  console.log('================================================================');
  let allPassed = true;
  for (const r of report) {
    const status = r.pass ? 'PASS' : 'FAIL';
    if (!r.pass) allPassed = false;
    const mode = r.isDesktopNavVisible ? 'Desktop Nav (7 Links + CTAs)' : 'Mobile Drawer (Crest + Hamburger)';
    console.log(`[${status}] ${r.width}px - ${r.category.padEnd(28)} | ${mode.padEnd(35)} | Overflow: ${r.hasPageOverflow ? 'YES' : '0px'} | Overlaps: ${r.linkCollisions.length + r.ctaCollisions.length + r.topBarCollisions.length}`);
  }
  console.log('================================================================');
  console.log(`RESULT: ${allPassed ? '100% OF ALL 18 VIEWPORT SIZES PASSED WITH ZERO OVERLAPS' : 'FAILURES DETECTED'}\n`);

  fs.writeFileSync(path.join(BRAIN_DIR, 'navbar_all_sizes_report.json'), JSON.stringify(report, null, 2));
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
