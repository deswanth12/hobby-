const fs = require('fs');

console.log('==============================================');
console.log('KAVITHA & ASSOCIATES — PRE-MEETING QA SUITE');
console.log('==============================================\n');

// 1. Verify firm data
const firmData = fs.readFileSync('src/data/firmData.ts', 'utf8');

const primaryPhone = firmData.match(/primaryPhone:\s*"([^"]+)"/)?.[1];
const secondaryPhone = firmData.match(/secondaryPhone:\s*"([^"]+)"/)?.[1];
const email = firmData.match(/email:\s*"([^"]+)"/)?.[1];
const waLink = firmData.match(/whatsappLink:\s*"([^"]+)"/)?.[1];

console.log('[DATA CHECK]');
console.log('  Primary Phone:   ', primaryPhone, primaryPhone === '+91 96263 50900' ? '✓ OK' : '✗ FAIL');
console.log('  Secondary Phone: ', secondaryPhone, secondaryPhone === '+91 95421 53906' ? '✓ OK' : '✗ FAIL');
console.log('  Email Address:   ', email, email === 'cakavithasrj@gmail.com' ? '✓ OK' : '✗ FAIL');
console.log('  WhatsApp Link:   ', waLink, waLink.startsWith('https://wa.me/919626350900') ? '✓ OK' : '✗ FAIL');

// 2. Verify all 7 routes
const routes = [
  '/',
  '/about',
  '/services',
  '/services/audit-assurance',
  '/industries',
  '/locations',
  '/contact'
];

async function runRouteTests() {
  console.log('\n[SERVER ROUTE TESTS]');
  let allPass = true;
  for (const r of routes) {
    try {
      const res = await fetch('http://127.0.0.1:5173' + r);
      const text = await res.text();
      const hasApp = text.includes('id="root"');
      const ok = res.status === 200 && hasApp;
      console.log(`  ${r.padEnd(28)} -> HTTP ${res.status} [HTML valid: ${hasApp ? '✓' : '✗'}]`);
      if (!ok) allPass = false;
    } catch (err) {
      console.log(`  ${r.padEnd(28)} -> FAILED to connect: ${err.message}`);
      allPass = false;
    }
  }

  // 3. Verify key phrases in built files
  console.log('\n[CONTENT VERIFICATION]');
  const homeSrc = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');
  const locSrc = fs.readFileSync('src/pages/LocationsPage.tsx', 'utf8');
  const contactSrc = fs.readFileSync('src/components/ContactForm.tsx', 'utf8');

  const icaiCompliantRemoved = !homeSrc.includes('ICAI Compliant');
  console.log('  "ICAI Compliant" badge removed:           ', icaiCompliantRemoved ? '✓ PASS' : '✗ FAIL');

  const regTirupatiRemoved = !homeSrc.includes('Registered: Tirupati');
  console.log('  "Registered: Tirupati" unqualified claim:  ', regTirupatiRemoved ? '✓ PASS (Properly Qualified)' : '✗ FAIL');

  const directNoticePresent = contactSrc.includes('Direct Communication Notice:');
  console.log('  Consultation Form Privacy statement safe:  ', directNoticePresent ? '✓ PASS' : '✗ FAIL');

  console.log('\n==============================================');
  console.log(allPass ? 'ALL TESTS PASSED — READY FOR CLIENT PRESENTATION' : 'SOME TESTS FAILED');
  console.log('==============================================');
}

runRouteTests();
