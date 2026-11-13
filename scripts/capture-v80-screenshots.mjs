#!/usr/bin/env node

/**
 * =========================================================================================
 * Kavitha & Associates — Automated Multi-Viewport Screenshot Capture Engine (V8.0)
 * =========================================================================================
 * 
 * Production-ready visual QA and screenshot generator for Milestone 5 (Deliverable 10).
 * Captures 7 primary routes across the 6 mandatory viewports (42 captures total) using
 * headless Microsoft Edge via Chrome DevTools Protocol (CDP) WebSocket without external npm dependencies.
 * 
 * Usage:
 *   node scripts/capture-v80-screenshots.mjs                  # Captures all 42 screenshots
 *   node scripts/capture-v80-screenshots.mjs --page=homepage  # Captures specific page
 *   node scripts/capture-v80-screenshots.mjs --viewport=390px # Captures specific viewport
 *   node scripts/capture-v80-screenshots.mjs --full           # Captures full scroll height
 * =========================================================================================
 */

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import http from 'http';

// Configuration & Target Directories
const HTTP_PORT = 5188;
const CDP_PORT = 9288;
const DIST_DIR = path.resolve('dist');

// Primary screenshot archive & distribution mirrors
const PRIMARY_OUT_DIR = path.resolve('artifacts/screenshots/v8');
const MIRROR_OUT_DIR = path.resolve('reports/screenshots/v80');
const PUBLIC_MIRROR_DIR = path.resolve('public/screenshots/v80');

// Supported Edge Executable Paths on Windows
const EDGE_PATHS = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  path.join(process.env.LOCALAPPDATA || '', 'Microsoft\\Edge\\Application\\msedge.exe')
];

// 6 Mandatory Viewport Profiles
export const VIEWPORTS = [
  {
    name: 'compact_mobile',
    label: '320px',
    width: 320,
    height: 640,
    deviceScaleFactor: 2,
    mobile: true,
    description: 'Compact Mobile (iPhone SE / Ultra-compact)',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  },
  {
    name: 'standard_mobile',
    label: '390px',
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true,
    description: 'Standard Mobile (iPhone 12/13/14/15/16)',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  },
  {
    name: 'tablet_portrait',
    label: '768px',
    width: 768,
    height: 1024,
    deviceScaleFactor: 2,
    mobile: false,
    description: 'Tablet Portrait (iPad Mini / 768px)',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
  },
  {
    name: 'laptop_small',
    label: '1024px',
    width: 1024,
    height: 768,
    deviceScaleFactor: 1,
    mobile: false,
    description: 'Tablet Landscape / Small Laptop (1024px)',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
  },
  {
    name: 'desktop_standard',
    label: '1440px',
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
    description: 'Desktop / MacBook Pro (1440px)',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
  },
  {
    name: 'display_wide',
    label: '1920px',
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false,
    description: 'Large Display / Full HD Monitor (1920px)',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
  }
];

// 7 Target Surface Routes
export const PAGES = [
  {
    key: 'homepage',
    path: '/',
    title: 'Homepage',
    expectedH1: 'Clarity in Finance. Confidence in Every Decision.'
  },
  {
    key: 'about',
    path: '/about',
    title: 'The Firm (About)',
    expectedH1: 'Professional Expertise. Personal Commitment.'
  },
  {
    key: 'services',
    path: '/services',
    title: 'Services Directory',
    expectedH1: 'Statutory Assurance & Strategic Governance'
  },
  {
    key: 'practice_corridor',
    path: '/services/audit-assurance',
    title: 'Practice Corridor (Audit & Assurance)',
    expectedH1: 'Audit & Assurance'
  },
  {
    key: 'blog_listing',
    path: '/blog',
    title: 'Regulatory Insights (Blog Hub)',
    expectedH1: 'Regulatory Insights & Technical Commentary'
  },
  {
    key: 'blog_reader',
    path: '/blog/statutory-audit-guidelines-2026',
    title: 'Article Reader',
    expectedH1: 'Statutory Audit Guidelines & Compliance Matrix for Indian Enterprises (FY 2025-26)'
  },
  {
    key: 'contact',
    path: '/contact',
    title: 'Chambers Intake (Contact)',
    expectedH1: "Let's Discuss Your Financial & Compliance Priorities"
  }
];

// Find valid Edge path
function resolveEdgePath() {
  for (const p of EDGE_PATHS) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error(`Microsoft Edge not found at standard Windows paths: ${EDGE_PATHS.join(', ')}`);
}

// Built-in Static SPA HTTP Server
function startSpaServer() {
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.xml': 'application/xml',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf'
  };

  const server = http.createServer((req, res) => {
    let cleanUrl = req.url.split('?')[0].split('#')[0];
    let filePath = path.join(DIST_DIR, cleanUrl);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath)) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server Error loading ' + cleanUrl);
      } else {
        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        res.end(content);
      }
    });
  });

  return new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(HTTP_PORT, '127.0.0.1', () => {
      console.log(`\x1b[32m[SPA SERVER]\x1b[0m Local preview server listening on http://127.0.0.1:${HTTP_PORT}`);
      resolve(server);
    });
  });
}

// Parse Command Line Flags
const args = process.argv.slice(2);
let filterPage = null;
let filterViewport = null;
let isFullPage = false;

for (const arg of args) {
  if (arg.startsWith('--page=')) filterPage = arg.split('=')[1].toLowerCase();
  if (arg.startsWith('--viewport=')) filterViewport = arg.split('=')[1].toLowerCase();
  if (arg === '--full' || arg === '--full-page') isFullPage = true;
}

async function main() {
  console.log('\x1b[1m\x1b[35m========================================================================================\x1b[0m');
  console.log('\x1b[1m\x1b[35m       KAVITHA & ASSOCIATES — MULTI-VIEWPORT VISUAL QA & SCREENSHOT CAPTURE (V8.0)       \x1b[0m');
  console.log('\x1b[1m\x1b[35m========================================================================================\x1b[0m');
  
  if (!fs.existsSync(DIST_DIR) || !fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
    console.error('\x1b[31m[ERROR] Production build dist/ not found. Run `npm run build` before capturing.\x1b[0m');
    process.exit(1);
  }

  // Ensure output directories exist
  [PRIMARY_OUT_DIR, MIRROR_OUT_DIR, PUBLIC_MIRROR_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  const edgePath = resolveEdgePath();
  console.log(`\x1b[90mBrowser Executable: ${edgePath}\x1b[0m`);
  console.log(`\x1b[90mPrimary Output Directory: ${PRIMARY_OUT_DIR}\x1b[0m`);

  const server = await startSpaServer();
  const profileDir = path.resolve('.temp_edge_qa_profile');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  console.log(`\x1b[34m[CDP]\x1b[0m Spawning Microsoft Edge headless on debug port ${CDP_PORT}...`);
  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${CDP_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    'about:blank'
  ], { stdio: 'ignore' });

  let ws = null;
  try {
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 200));
      try {
        const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
        const tabs = await res.json();
        const target = tabs.find(t => t.type === 'page');
        if (target && target.webSocketDebuggerUrl) {
          ws = new WebSocket(target.webSocketDebuggerUrl);
          await new Promise((res, rej) => {
            ws.onopen = res;
            ws.onerror = rej;
          });
          break;
        }
      } catch (_) {}
    }

    if (!ws) throw new Error(`Failed to connect to browser CDP WebSocket on port ${CDP_PORT}`);
    console.log(`\x1b[32m[CDP]\x1b[0m Successfully connected to Chromium DevTools Protocol.`);

    let msgId = 1;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const id = msgId++;
      const timer = setTimeout(() => reject(new Error(`CDP Timeout on ${method}`)), 15000);
      const handler = (evt) => {
        const d = JSON.parse(evt.data);
        if (d.id === id) {
          clearTimeout(timer);
          ws.removeEventListener('message', handler);
          if (d.error) reject(new Error(d.error.message));
          else resolve(d.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });

    await send('Page.enable');
    await send('Runtime.enable');

    const selectedPages = filterPage 
      ? PAGES.filter(p => p.key === filterPage || p.path === filterPage)
      : PAGES;
    const selectedViewports = filterViewport
      ? VIEWPORTS.filter(v => v.label.toLowerCase() === filterViewport || v.name.toLowerCase() === filterViewport)
      : VIEWPORTS;

    console.log(`\n\x1b[1mExecuting Visual QA Matrix: ${selectedPages.length} Pages × ${selectedViewports.length} Viewports = ${selectedPages.length * selectedViewports.length} Total Captures\x1b[0m\n`);

    const results = [];
    let passCount = 0;
    let failCount = 0;

    for (const page of selectedPages) {
      console.log(`\x1b[1m\x1b[36m▶ PAGE: ${page.title} (${page.path})\x1b[0m`);
      
      for (const vp of selectedViewports) {
        // Set Device Metrics & User Agent
        await send('Emulation.setDeviceMetricsOverride', {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: vp.deviceScaleFactor,
          mobile: vp.mobile
        });

        await send('Emulation.setUserAgentOverride', {
          userAgent: vp.userAgent
        });

        const targetUrl = `http://127.0.0.1:${HTTP_PORT}${page.path}`;
        await send('Page.navigate', { url: targetUrl });
        
        // Wait for hydration, fonts, and images to settle
        await new Promise(r => setTimeout(r, 850));

        // Evaluate DOM & Reflow Metrics
        const evalRes = await send('Runtime.evaluate', {
          expression: `(() => {
            const clientWidth = document.documentElement.clientWidth;
            const scrollWidth = document.documentElement.scrollWidth;
            const scrollHeight = document.documentElement.scrollHeight;
            const brokenImages = Array.from(document.images)
              .filter(i => i.complete && i.naturalWidth === 0)
              .map(i => i.src.split('/').pop());
            const h1s = Array.from(document.querySelectorAll('h1')).map(h => h.innerText.trim());

            return {
              clientWidth,
              scrollWidth,
              scrollHeight,
              hasHorizontalOverflow: scrollWidth > clientWidth + 1,
              overflowPixels: Math.max(0, scrollWidth - clientWidth),
              brokenImagesCount: brokenImages.length,
              brokenImages,
              h1Count: h1s.length,
              h1Text: h1s[0] || null,
              title: document.title
            };
          })()`,
          returnByValue: true
        });

        const m = evalRes.result?.value || {};
        const isPass = !m.hasHorizontalOverflow && m.brokenImagesCount === 0;

        if (isPass) passCount++;
        else failCount++;

        // Base filename convention: v80_<page_key>_<viewport_label>.png
        const baseFileName = `v80_${page.key}_${vp.label.replace('px', '')}px.png`;
        const primaryFilePath = path.join(PRIMARY_OUT_DIR, baseFileName);
        const mirrorFilePath = path.join(MIRROR_OUT_DIR, baseFileName);
        const publicFilePath = path.join(PUBLIC_MIRROR_DIR, baseFileName);

        // Capture Screenshot
        let shotData;
        if (isFullPage) {
          const shot = await send('Page.captureScreenshot', {
            format: 'png',
            captureBeyondViewport: true,
            clip: {
              x: 0,
              y: 0,
              width: m.clientWidth || vp.width,
              height: m.scrollHeight || vp.height,
              scale: 1
            }
          });
          shotData = shot.data;
        } else {
          const shot = await send('Page.captureScreenshot', { format: 'png' });
          shotData = shot.data;
        }

        const buffer = Buffer.from(shotData, 'base64');
        fs.writeFileSync(primaryFilePath, buffer);
        fs.writeFileSync(mirrorFilePath, buffer);
        fs.writeFileSync(publicFilePath, buffer);

        const statusTag = isPass ? '\x1b[32m[PASS]\x1b[0m' : '\x1b[31m[FAIL]\x1b[0m';
        console.log(`  ${statusTag} ${vp.label.padEnd(8)} | Client: ${m.clientWidth}px | Scroll: ${m.scrollWidth}px | Overflow: ${m.overflowPixels}px | File: ${baseFileName} (${(buffer.length / 1024).toFixed(1)} KB)`);

        results.push({
          page: page.key,
          route: page.path,
          pageTitle: page.title,
          viewport: vp.name,
          viewportLabel: vp.label,
          width: vp.width,
          height: vp.height,
          clientWidth: m.clientWidth,
          scrollWidth: m.scrollWidth,
          scrollHeight: m.scrollHeight,
          overflowPixels: m.overflowPixels,
          hasHorizontalOverflow: m.hasHorizontalOverflow,
          brokenImagesCount: m.brokenImagesCount,
          brokenImages: m.brokenImages,
          h1Count: m.h1Count,
          fileName: baseFileName,
          primaryPath: primaryFilePath,
          fileSizeBytes: buffer.length,
          status: isPass ? 'PASS' : 'FAIL',
          timestamp: new Date().toISOString()
        });
      }
      console.log('');
    }

    // Save Summary Report JSON
    const summaryData = {
      timestamp: new Date().toISOString(),
      totalPages: selectedPages.length,
      totalViewports: selectedViewports.length,
      totalCaptures: results.length,
      passed: passCount,
      failed: failCount,
      successRate: `${((passCount / results.length) * 100).toFixed(1)}%`,
      outputDirectory: PRIMARY_OUT_DIR,
      mirrorDirectory: MIRROR_OUT_DIR,
      captures: results
    };

    fs.writeFileSync(path.join(PRIMARY_OUT_DIR, 'summary.json'), JSON.stringify(summaryData, null, 2), 'utf-8');
    fs.writeFileSync(path.join(MIRROR_OUT_DIR, 'summary.json'), JSON.stringify(summaryData, null, 2), 'utf-8');

    console.log('\x1b[1m\x1b[35m========================================================================================\x1b[0m');
    console.log(`\x1b[1mVISUAL QA EXECUTION SUMMARY:\x1b[0m`);
    console.log(`  Total Captures : ${results.length}`);
    console.log(`  Passed         : \x1b[32m${passCount}\x1b[0m`);
    console.log(`  Failed         : \x1b[${failCount > 0 ? '31' : '32'}m${failCount}\x1b[0m`);
    console.log(`  Success Rate   : \x1b[32m${summaryData.successRate}\x1b[0m`);
    console.log(`  Report JSON    : ${path.join(PRIMARY_OUT_DIR, 'summary.json')}`);
    console.log('\x1b[1m\x1b[35m========================================================================================\x1b[0m\n');

    ws.close();
  } finally {
    edgeProc.kill();
    server.close();
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }
}

main().catch(err => {
  console.error('\x1b[31mFatal Screenshot Engine Error:\x1b[0m', err);
  process.exit(1);
});
