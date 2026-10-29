const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = path.join(__dirname, 'screenshots');

const pages = [
  { name: 'admin-overview-desktop', url: 'http://127.0.0.1:5173/admin?qa_auth=true', width: 1440, height: 900 },
  { name: 'admin-enquiries-desktop', url: 'http://127.0.0.1:5173/admin/enquiries?qa_auth=true', width: 1440, height: 900 },
  { name: 'admin-content-desktop', url: 'http://127.0.0.1:5173/admin/content?qa_auth=true', width: 1440, height: 900 },
  { name: 'admin-settings-desktop', url: 'http://127.0.0.1:5173/admin/settings?qa_auth=true', width: 1440, height: 900 },
  { name: 'admin-overview-mobile', url: 'http://127.0.0.1:5173/admin?qa_auth=true', width: 375, height: 812 },
  { name: 'admin-enquiries-mobile', url: 'http://127.0.0.1:5173/admin/enquiries?qa_auth=true', width: 375, height: 812 },
];

console.log('Capturing admin dashboard screenshots...');

for (const p of pages) {
  const outFile = path.join(outDir, `${p.name}.png`);
  try {
    execFileSync(chromePath, [
      '--headless=new',
      `--screenshot=${outFile}`,
      `--window-size=${p.width},${p.height}`,
      '--virtual-time-budget=2500',
      '--hide-scrollbars',
      p.url
    ]);
    const stats = fs.statSync(outFile);
    console.log(`✓ ${p.name.padEnd(25)} -> ${(stats.size / 1024).toFixed(1)} KB`);
  } catch (err) {
    console.error(`✗ ${p.name} failed:`, err.message);
  }
}
