/**
 * Automated Test Suite: Feature 25 & 26 — Contact Form Security, Honeypot & WhatsApp Handshake
 * Tests: tests/e2e/06-contact-form-honeypot.mjs
 */

import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('.');
const contactFormPath = path.join(ROOT, 'src', 'components', 'ContactForm.tsx');
const adminStoragePath = path.join(ROOT, 'src', 'services', 'adminStorage.ts');
const firmDataPath = path.join(ROOT, 'src', 'data', 'firmData.ts');

console.log('================================================================');
console.log('  TEST: CONTACT FORM HONEYPOT, VELOCITY & WHATSAPP HANDSHAKE   ');
console.log('  Feature 25 & Feature 26 Automated Test Suite                  ');
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

// 1. File Existence
check(fs.existsSync(contactFormPath), 'ContactForm.tsx exists in src/components/');
check(fs.existsSync(adminStoragePath), 'adminStorage.ts exists in src/services/');
check(fs.existsSync(firmDataPath), 'firmData.ts exists in src/data/');

const formCode = fs.readFileSync(contactFormPath, 'utf8');
const storageCode = fs.readFileSync(adminStoragePath, 'utf8');
const firmDataCode = fs.readFileSync(firmDataPath, 'utf8');

// 2. Honeypot Input Attributes & Placement
check(
  formCode.includes('id="website_fax_hp"') && formCode.includes('name="website_fax_hp"'),
  'Honeypot <input> defines both id="website_fax_hp" and name="website_fax_hp"'
);
check(
  formCode.includes('tabIndex={-1}') || formCode.includes('tabIndex="-1"'),
  'Honeypot <input> specifies tabIndex={-1} to prevent keyboard navigation tab stops'
);
check(
  formCode.includes('autoComplete="off"') || formCode.includes('autoComplete=\'off\''),
  'Honeypot <input> specifies autoComplete="off" to deter browser autofill'
);
check(
  formCode.includes('opacity-0') && formCode.includes('absolute') && formCode.includes('pointer-events-none'),
  'Honeypot container is concealed using standard accessible concealment CSS classes'
);
check(
  formCode.includes('aria-hidden="true"'),
  'Honeypot container specifies aria-hidden="true" to shield assistive screen readers'
);

// 3. Honeypot Bot Suppression Logic
check(
  /if\s*\(\s*honeypot\s*\)/.test(formCode),
  'handleSubmit evaluates honeypot value and suppresses automated bot submissions'
);

// 4. Velocity Timing Guard (1500ms threshold)
check(
  /formLoadedAt\s*=\s*(React\.)?useRef/.test(formCode),
  'ContactForm mounts formLoadedAt ref tracking exact component render timestamp'
);
check(
  /Date\.now\(\)\s*-\s*formLoadedAt\.current\s*<\s*1500/.test(formCode),
  'ContactForm enforces strict 1500ms submit velocity guard before processing inquiry'
);
check(
  formCode.includes('Submission received too rapidly'),
  'ContactForm returns user-friendly warning when submission arrives in under 1500ms'
);

// 5. Input Sanitization
check(
  /const\s+sanitizeText\s*=/.test(formCode) || formCode.includes('sanitizeText('),
  'ContactForm applies sanitizeText utility to cleanse client-submitted text inputs'
);

// 6. AdminStorage Local Enquiry Registration
check(
  /adminStorage\.recordEnquiryAsync/.test(formCode),
  'ContactForm calls adminStorage.recordEnquiryAsync to register consultation brief'
);
check(
  /ENQ-/.test(storageCode),
  'adminStorage generates reference ID starting with prefix ENQ-'
);
check(
  /ka_admin_enquiries_v1/.test(storageCode),
  'adminStorage persists consultation enquiries to localStorage under key ka_admin_enquiries_v1'
);

// 7. Post-Submission Feedback & Reference Display
check(
  formCode.includes('savedRecord?.id') || formCode.includes('Reference ID'),
  'ContactForm confirmation card displays registered enquiry reference ID to client'
);

// 8. WhatsApp Direct Handshake Integration
check(
  /generateWhatsAppUrl/.test(formCode),
  'ContactForm implements generateWhatsAppUrl helper'
);
check(
  formCode.includes('https://wa.me/919626350900'),
  'ContactForm WhatsApp target points to verified chambers phone +91 96263 50900'
);
check(
  formCode.includes('CA Kavitha Vijay'),
  'ContactForm WhatsApp template addresses CA Kavitha Vijay'
);
check(
  formCode.includes('Enquiry Ref:') && formCode.includes('formData.serviceCategory'),
  'WhatsApp message embeds enquiry reference ID, applicant name, and requested service category'
);
check(
  formCode.includes('Send via WhatsApp'),
  'Confirmation state renders prominent "Send via WhatsApp" CTA button'
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
  console.log('\nALL CONTACT FORM & HONEYPOT TESTS PASSED SUCCESSFULLY!\n');
  process.exit(0);
}
