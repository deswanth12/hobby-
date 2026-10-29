const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = path.join(__dirname, 'screenshots');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 812 }
];

const routes = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about' },
  { name: 'services', path: '/services' },
  { name: 'audit', path: '/services/audit-assurance' },
  { name: 'industries', path: '/industries' },
  { name: 'locations', path: '/locations' },
  { name: 'contact', path: '/contact' },
  { name: 'not-found', path: '/404-recovery' }
];

async function runVisualQA() {
  console.log('==============================================');
  console.log('KAVITHA & ASSOCIATES — VISUAL QA CAPTURE');
  console.log('==============================================\n');

  for (const vp of viewports) {
    console.log(`[VIEWPORT: ${vp.name.toUpperCase()} (${vp.width}x${vp.height})]`);
    for (const r of routes) {
      const url = `http://127.0.0.1:5173${r.path}`;
      const outFile = path.join(outDir, `${r.name}-${vp.name}.png`);
      try {
        execFileSync(chromePath, [
          '--headless=new',
          `--screenshot=${outFile}`,
          `--window-size=${vp.width},${vp.height}`,
          '--virtual-time-budget=2000',
          '--hide-scrollbars',
          url
        ]);
        const stats = fs.statSync(outFile);
        console.log(`  ✓ ${r.name.padEnd(12)} -> ${path.basename(outFile)} (${(stats.size / 1024).toFixed(1)} KB)`);
      } catch (err) {
        console.error(`  ✗ ${r.name.padEnd(12)} -> Failed: ${err.message}`);
      }
    }
  }

  console.log('\n==============================================');
  console.log('VISUAL QA CAPTURE COMPLETE');
  console.log('==============================================');
}

runVisualQA();
