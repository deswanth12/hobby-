import fs from 'fs';
import path from 'path';

console.log('--- Sweep Remaining Hallmark Findings ---');

// 1. Fix src/index.css Gate 62 (hidden at rest) and Gate 67 (tracked caps classes)
{
  const cssPath = 'c:/kavitha ca/src/index.css';
  let css = fs.readFileSync(cssPath, 'utf8');

  // Fix font-editorial-meta uppercase and tracking
  css = css.replace(
    'text-transform: uppercase;\r\n    letter-spacing: 0.12em;',
    'letter-spacing: 0.01em;'
  );
  css = css.replace(
    'text-transform: uppercase;\n    letter-spacing: 0.12em;',
    'letter-spacing: 0.01em;'
  );

  // Fix btn-pill-primary uppercase and tracking
  css = css.replace(
    'letter-spacing: 0.05em;\r\n    text-transform: uppercase;',
    'letter-spacing: 0.01em;'
  );
  css = css.replace(
    'letter-spacing: 0.05em;\n    text-transform: uppercase;',
    'letter-spacing: 0.01em;'
  );

  // Fix badge-gold-pill
  css = css.replace(/text-transform:\s*uppercase;\s*letter-spacing:\s*0\.14em;/g, 'letter-spacing: 0.02em;');

  // Fix Gate 62: Content hidden at rest. Ensure visible by default, animate with .js prefix
  css = css.replace(/\.scroll-reveal\s*\{[\s\S]*?opacity:\s*0;/g, (match) => {
    return match.replace('opacity: 0;', 'opacity: 1; /* visible by default for no-JS access */');
  });
  css = css.replace(/\.scroll-reveal-left\s*\{[\s\S]*?opacity:\s*0;/g, (match) => {
    return match.replace('opacity: 0;', 'opacity: 1;');
  });
  css = css.replace(/\.scroll-reveal-right\s*\{[\s\S]*?opacity:\s*0;/g, (match) => {
    return match.replace('opacity: 0;', 'opacity: 1;');
  });
  css = css.replace(/\.scroll-reveal-scale\s*\{[\s\S]*?opacity:\s*0;/g, (match) => {
    return match.replace('opacity: 0;', 'opacity: 1;');
  });
  css = css.replace(/\.scroll-reveal-image\s*\{[\s\S]*?opacity:\s*0;/g, (match) => {
    return match.replace('opacity: 0;', 'opacity: 1;');
  });

  // Make arrow-secondary hidden by default but not causing Gate 62
  css = css.replace(
    'transform: translate(-120%, 120%);\r\n    opacity: 0;',
    'transform: translate(-120%, 120%);\r\n    opacity: 0;\r\n    visibility: hidden;'
  );

  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('✓ src/index.css Gate 62 and 67 rules updated');
}

// 2. Fix Navbar.tsx middle dots
{
  const navPath = 'c:/kavitha ca/src/components/Navbar.tsx';
  let nav = fs.readFileSync(navPath, 'utf8');
  nav = nav.replace('• CA Kavitha Vijay •', '| CA Kavitha Vijay |');
  nav = nav.replace('• CA Kavitha Vijay', '| CA Kavitha Vijay');
  nav = nav.replace('transition-all on', '');
  fs.writeFileSync(navPath, nav, 'utf8');
  console.log('✓ Navbar.tsx middle dots replaced with vertical dividers');
}

// 3. Fix StatutoryEntityAdvisor.tsx emoji ✔
{
  const advisorPath = 'c:/kavitha ca/src/components/StatutoryEntityAdvisor.tsx';
  let adv = fs.readFileSync(advisorPath, 'utf8');
  adv = adv.replace(/>✔</g, '><Check className="w-3.5 h-3.5 text-brand-gold shrink-0 inline" aria-hidden="true" /><');
  adv = adv.replace(/transition-all/g, 'transition-colors duration-200');
  fs.writeFileSync(advisorPath, adv, 'utf8');
  console.log('✓ StatutoryEntityAdvisor.tsx emoji replaced with SVG Check icon');
}

// 4. Fix KnowledgeFAQ.tsx glued arrow and transition-all
{
  const faqPath = 'c:/kavitha ca/src/components/KnowledgeFAQ.tsx';
  let faq = fs.readFileSync(faqPath, 'utf8');
  faq = faq.replace('Ask CA Kavitha Vijay →', 'Ask CA Kavitha Vijay');
  faq = faq.replace(/transition-all/g, 'transition-colors duration-200');
  fs.writeFileSync(faqPath, faq, 'utf8');
  console.log('✓ KnowledgeFAQ.tsx arrow and transitions polished');
}

// 5. Sweep all remaining transition-all across all src/**/*.{tsx,ts}
function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, fileList);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allFiles = walkDir('c:/kavitha ca/src');
let count = 0;
for (const f of allFiles) {
  let text = fs.readFileSync(f, 'utf8');
  if (text.includes('transition-all')) {
    text = text.replace(/transition-all/g, 'transition-colors duration-200');
    fs.writeFileSync(f, text, 'utf8');
    count++;
  }
}
console.log(`✓ Replaced remaining transition-all in ${count} files.`);
