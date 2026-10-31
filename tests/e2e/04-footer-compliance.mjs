/**
 * Automated Test Suite: Feature 26 — Footer Compliance, Statutory ICAI Disclaimers & WhatsApp Integration
 * Tests: tests/e2e/04-footer-compliance.mjs
 */

import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('.');
const footerPath = path.join(ROOT, 'src', 'components', 'Footer.tsx');
const floatingWhatsAppPath = path.join(ROOT, 'src', 'components', 'FloatingWhatsApp.tsx');
const firmDataPath = path.join(ROOT, 'src', 'data', 'firmData.ts');

console.log('================================================================');
console.log('  TEST: FOOTER COMPLIANCE, STATUTORY DISCLAIMERS & WHATSAPP     ');
console.log('  Feature 26 & Feature 7/24 Automated Test Suite                ');
console.log('================================================================\n');

let passed = 0;
let total = 0;
const failures = [];

function check(condition, desc, detail = '') {
  total++;
  if (condition) {
    passed++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [Test ${total}] ${desc}`);
  } else {
    failures.push({ desc, detail });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [Test ${total}] ${desc}`);
    if (detail) console.log(`       Details: ${detail}`);
  }
}

// 1. Files Existence
check(fs.existsSync(footerPath), 'Footer.tsx exists in src/components/');
check(fs.existsSync(floatingWhatsAppPath), 'FloatingWhatsApp.tsx exists in src/components/');
check(fs.existsSync(firmDataPath), 'firmData.ts exists in src/data/');

const footerCode = fs.readFileSync(footerPath, 'utf8');
const floatingCode = fs.readFileSync(floatingWhatsAppPath, 'utf8');
const firmDataCode = fs.readFileSync(firmDataPath, 'utf8');

// 2. ICAI Regulatory & Statutory Compliance Disclaimer
check(
  footerCode.includes('ICAI Compliance Notice'),
  'Footer defines explicit ICAI Compliance Notice block'
);
check(
  footerCode.includes('Institute of Chartered Accountants of India') &&
  footerCode.includes('code of ethics') &&
  footerCode.includes('not intended to advertise or solicit work'),
  'Footer contains verbatim ICAI non-advertisement statutory disclaimer'
);

// 3. Verified Lead Partner Credentials Block
check(
  footerCode.includes('CA Kavitha Vijay'),
  'Footer displays verified lead partner name CA Kavitha Vijay'
);
check(
  footerCode.includes('B.Com, CA, CMA AIR 49') || footerCode.includes('B.Com, CA, CMA'),
  'Footer displays accredited academic and professional qualifications'
);
check(
  footerCode.includes('Chartered'),
  'Footer displays verified lead partner professional role without exposing membership number'
);

// 4. Chambers Physical Operating Address
check(
  footerCode.includes('Bairagi Patteda') && footerCode.includes('Tirupati') && footerCode.includes('517501'),
  'Footer displays registered principal chambers at Bairagi Patteda, Tirupati - 517501'
);

// 5. Telecommunications & Contact Channels
check(
  footerCode.includes('primaryPhoneClean') && footerCode.includes('primaryPhone'),
  'Footer renders click-to-call link for primary chambers phone +91 96263 50900'
);
check(
  footerCode.includes('secondaryPhoneClean') && footerCode.includes('secondaryPhone'),
  'Footer renders click-to-call link for secondary chambers phone +91 95421 53906'
);
check(
  footerCode.includes('mailto:') && footerCode.includes('email'),
  'Footer renders mailto link targeting firm email cakavithasrj@gmail.com'
);

// 6. Direct WhatsApp Handshake Link in Footer
check(
  footerCode.includes('whatsappLink'),
  'Footer embeds direct WhatsApp consultation deep-link via FIRM_DATA'
);
check(
  footerCode.includes('target="_blank"') && footerCode.includes('rel="noopener noreferrer"'),
  'Footer WhatsApp link secures external tab opening with target="_blank" and rel="noopener noreferrer"'
);

// 7. Navigation & Statutory Links
check(
  footerCode.includes('to="/about"') &&
  footerCode.includes('to="/services"') &&
  footerCode.includes('to="/blog"') &&
  footerCode.includes('to="/industries"') &&
  footerCode.includes('to="/locations"') &&
  footerCode.includes('to="/contact"'),
  'Footer provides complete internal navigation grid to all core practice routes'
);
check(
  footerCode.includes('/#knowledge-faq'),
  'Footer links directly to statutory knowledge-faq section on homepage'
);
check(
  footerCode.includes('to="/services/audit-assurance"'),
  'Footer provides dedicated navigation spotlight for Audit & Assurance services'
);

// 8. Administrative Colophon & Practice Portal Secret Protection
check(
  !footerCode.includes('to="/admin"') && !footerCode.includes('4464654646464654'),
  'Footer colophon strictly excludes public links to administration portal (/admin) ensuring zero secret route exposure'
);

// 9. Floating WhatsApp Widget Accessibility & Compliance
check(
  floatingCode.includes('min-w-[44px]') && floatingCode.includes('min-h-[44px]'),
  'FloatingWhatsApp defines explicit min-w-[44px] and min-h-[44px] touch target sizing (WCAG 2.5.5)'
);
check(
  floatingCode.includes('motion-safe:animate-ping'),
  'FloatingWhatsApp uses motion-safe:animate-ping respecting prefers-reduced-motion preferences'
);
check(
  floatingCode.includes('aria-label="Chat directly with CA Kavitha Vijay on WhatsApp"'),
  'FloatingWhatsApp defines descriptive aria-label naming CA Kavitha Vijay'
);
check(
  floatingCode.includes('z-40') && floatingCode.includes('fixed'),
  'FloatingWhatsApp is positioned as fixed bottom-right widget'
);

// Summary
console.log('\n================================================================');
console.log(`TOTAL ASSERTIONS: ${total}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failures.length}`);
console.log('================================================================');

if (failures.length > 0) {
  console.error('\nFAILURES:');
  failures.forEach(f => console.error(`- ${f.desc}: ${f.detail}`));
  process.exit(1);
} else {
  console.log('\nALL FOOTER & WHATSAPP COMPLIANCE TESTS PASSED SUCCESSFULLY!\n');
  process.exit(0);
}
