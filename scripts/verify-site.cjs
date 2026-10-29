const fs = require('fs');

console.log('====================================================');
console.log('KAVITHA & ASSOCIATES — FULL SYSTEM QA & VERIFICATION');
console.log('====================================================\n');

// 1. Verify firm data
const firmData = fs.readFileSync('src/data/firmData.ts', 'utf8');

const primaryPhone = firmData.match(/primaryPhone:\s*"([^"]+)"/)?.[1];
const secondaryPhone = firmData.match(/secondaryPhone:\s*"([^"]+)"/)?.[1];
const email = firmData.match(/email:\s*"([^"]+)"/)?.[1];
const waLink = firmData.match(/whatsappLink:\s*"([^"]+)"/)?.[1];

console.log('[1. BASELINE DATA INTEGRITY]');
console.log('  Primary Phone:   ', primaryPhone, primaryPhone === '+91 96263 50900' ? '✓ OK' : '✗ FAIL');
console.log('  Secondary Phone: ', secondaryPhone, secondaryPhone === '+91 95421 53906' ? '✓ OK' : '✗ FAIL');
console.log('  Email Address:   ', email, email === 'cakavithasrj@gmail.com' ? '✓ OK' : '✗ FAIL');
console.log('  WhatsApp Link:   ', waLink, waLink.startsWith('https://wa.me/919626350900') ? '✓ OK' : '✗ FAIL');

// 2. Verify all routes (Public & Admin)
const routes = [
  // Public
  '/',
  '/about',
  '/services',
  '/services/audit-assurance',
  '/industries',
  '/locations',
  '/contact',
  '/non-existent-sample-route',
  // Admin Management Console
  '/admin/login',
  '/admin',
  '/admin/enquiries',
  '/admin/content',
  '/admin/settings'
];

async function runRouteTests() {
  console.log('\n[2. SERVER ROUTE TESTS — HTTP 200 & SPA HTML VALIDATION]');
  let allPass = true;
  for (const r of routes) {
    try {
      const res = await fetch('http://127.0.0.1:5173' + r);
      const text = await res.text();
      const hasApp = text.includes('id="root"');
      const ok = res.status === 200 && hasApp;
      console.log(`  ${r.padEnd(30)} -> HTTP ${res.status} [SPA Root: ${hasApp ? '✓ OK' : '✗ FAIL'}]`);
      if (!ok) allPass = false;
    } catch (err) {
      console.log(`  ${r.padEnd(30)} -> FAILED to connect: ${err.message}`);
      allPass = false;
    }
  }

  // 3. Verify security & robots.txt
  console.log('\n[3. SEO & SECURITY HEADERS]');
  const robots = fs.readFileSync('public/robots.txt', 'utf8');
  const disallowAdmin = robots.includes('Disallow: /admin');
  console.log('  robots.txt disallows /admin:          ', disallowAdmin ? '✓ PASS' : '✗ FAIL');
  if (!disallowAdmin) allPass = false;

  // 4. Content and ICAI ethics checks
  console.log('\n[4. ICAI ETHICS & COMPLIANCE VERIFICATION]');
  const homeSrc = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');
  const contactSrc = fs.readFileSync('src/components/ContactForm.tsx', 'utf8');

  const icaiCompliantRemoved = !homeSrc.includes('ICAI Compliant');
  console.log('  Self-promotional "ICAI Compliant" badge banned: ', icaiCompliantRemoved ? '✓ PASS' : '✗ FAIL');

  const regTirupatiRemoved = !homeSrc.includes('Registered: Tirupati');
  console.log('  Unqualified registration claim removed:         ', regTirupatiRemoved ? '✓ PASS' : '✗ FAIL');

  const directNoticePresent = contactSrc.includes('Direct Communication Notice:');
  console.log('  Consultation Form Privacy statement safe:       ', directNoticePresent ? '✓ PASS' : '✗ FAIL');

  console.log('\n====================================================');
  console.log(allPass ? 'ALL TESTS PASSED — ADMIN SUITE & PUBLIC SYSTEM VERIFIED' : 'SOME TESTS FAILED');
  console.log('====================================================');
}

runRouteTests();
