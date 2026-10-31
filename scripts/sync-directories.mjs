import fs from 'fs';
import path from 'path';

const SRC_DIR = 'C:\\kavatha ca';
const DST_DIR = 'C:\\kavitha ca';

const filesToSync = [
  'tailwind.config.js',
  'src/index.css',
  'index.html',
  'src/App.tsx',
  'src/components/Navbar.tsx',
  'src/components/FloatingWhatsApp.tsx',
  'src/components/BackToTop.tsx',
  'src/components/ContactForm.tsx',
  'src/components/Footer.tsx',
  'src/components/StatutoryCalendar.tsx',
  'src/components/animations/AccentTicker.tsx',
  'src/pages/HomePage.tsx',
  'reports/initial-mobile-audit.json',
  'reports/post-optimization-audit.json',
  'reports/lighthouse/initial_mobile.json',
  'reports/lighthouse/post_mobile.json'
];

console.log(`Synchronizing verified files from ${SRC_DIR} to ${DST_DIR}...`);

for (const rel of filesToSync) {
  const src = path.join(SRC_DIR, rel);
  const dst = path.join(DST_DIR, rel);
  if (fs.existsSync(src)) {
    const dir = path.dirname(dst);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.copyFileSync(src, dst);
    console.log(`  [COPIED] ${rel}`);
  }
}

// Copy screenshots folders
function copyFolderRecursive(srcFolder, dstFolder) {
  if (!fs.existsSync(srcFolder)) return;
  if (!fs.existsSync(dstFolder)) fs.mkdirSync(dstFolder, { recursive: true });
  const entries = fs.readdirSync(srcFolder, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcFolder, entry.name);
    const dstPath = path.join(dstFolder, entry.name);
    if (entry.isDirectory()) {
      copyFolderRecursive(srcPath, dstPath);
    } else {
      fs.copyFileSync(srcPath, dstPath);
    }
  }
}

copyFolderRecursive(
  path.join(SRC_DIR, 'reports/screenshots'),
  path.join(DST_DIR, 'reports/screenshots')
);
console.log('  [COPIED] reports/screenshots directory');

// Copy audit scripts
const scriptsToSync = [
  'scripts/initial-mobile-audit.mjs',
  'scripts/verify-mobile-audit.mjs',
  'scripts/run-baseline-lh-mobile.mjs',
  'scripts/run-verification-lh-mobile.mjs',
  'scripts/apply-mobile-optimizations.mjs',
  'scripts/apply-final-mobile-polish.mjs',
  'scripts/fix-contrast.mjs'
];

for (const s of scriptsToSync) {
  const src = path.join(SRC_DIR, s);
  const dst = path.join(DST_DIR, s);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    console.log(`  [COPIED] ${s}`);
  }
}

// Verification comparison
console.log('\n--- VERIFICATION COMPARISON ---');
let allMatch = true;
for (const rel of filesToSync) {
  const p1 = path.join(SRC_DIR, rel);
  const p2 = path.join(DST_DIR, rel);
  const c1 = fs.readFileSync(p1);
  const c2 = fs.readFileSync(p2);
  const match = c1.equals(c2);
  if (!match) allMatch = false;
  console.log(`  ${match ? '✔ MATCH' : '✖ MISMATCH'}: ${rel}`);
}

console.log(`\nOverall Synchronization Status: ${allMatch ? 'ALL FILES 100% IDENTICAL' : 'MISMATCH DETECTED'}`);
