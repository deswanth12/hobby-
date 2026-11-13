import fs from 'fs';
import path from 'path';

const files = [
  'src/pages/HomePage.tsx',
  'src/components/AboutSection.tsx',
  'src/components/WhyChooseUs.tsx',
  'src/components/WorkingProcess.tsx',
  'src/pages/ContactPage.tsx'
];

const srcs = new Set();
for (const file of files) {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.matchAll(/src=["']([^"']+)["']/g);
    for (const m of matches) {
      if (m[1].startsWith('/') || m[1].startsWith('./')) {
        srcs.add(m[1]);
      }
    }
  }
}

console.log(`[Asset Verification] Found ${srcs.size} unique image references across homepage components:`);
let allValid = true;
for (const src of srcs) {
  const localRel = src.replace(/^\//, '');
  const absPath = path.resolve('public', localRel);
  const exists = fs.existsSync(absPath);
  if (!exists) {
    allValid = false;
    console.error(`  ❌ MISSING: ${src} -> ${absPath}`);
  } else {
    const stat = fs.statSync(absPath);
    console.log(`  ✔ EXISTS: ${src} (${(stat.size / 1024).toFixed(1)} KB)`);
  }
}

if (allValid) {
  console.log('\n[Asset Verification] ALL 100% of image assets exist and are accessible!');
} else {
  console.error('\n[Asset Verification] Some image assets are missing!');
  process.exit(1);
}
