/**
 * tests/assistant-chambers-flow.test.mjs
 * 
 * Comprehensive Verification of CA India Firm Information Assistant:
 * - Natural, intelligent conversational greetings across standard Indian CA practice areas
 * - Conversational capability inquiries and polite closures (Thanks, Goodbye)
 * - Consultation scheduling and appointment booking workflows
 * - Natural conversational service requests across practice areas
 * - Statutory questions covering Direct Tax, GST, Companies Act / MCA, Statutory Audit, RERA, and Virtual CFO
 * - Authoritative tone with precise statutory citations and strict ICAI Code of Ethics compliance
 * - Seamless consultation handoff with working WhatsApp and Phone consultation endpoints
 */

import assert from 'node:assert';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { processAssistantMessage } = require('../server/assistant/assistantService.cjs');
const { resetRateLimiter } = require('../server/assistant/assistantRateLimiter.cjs');

console.log('================================================================');
console.log('  TEST: ASSISTANT CONVERSATIONAL FLOW & STATUTORY CHAMBERS      ');
console.log('================================================================');

test('Suite 1: Natural Greetings & Extended Openings Coverage', async () => {
  resetRateLimiter();
  const greetings = [
    'hello',
    'Good morning',
    'Hi',
    'Namaste',
    'Namaskar',
    'Namaskaram',
    'Vanakkam',
    'Greetings team',
    'Hello CA Kavitha',
    'Good day',
    'Good evening team',
    'Hi Kavitha & Associates',
    'How can you help me?',
    'What can the assistant do?',
    'Hello, can you help me?',
    'Hi, I have a question',
    'Can someone help me?'
  ];

  for (const greeting of greetings) {
    const res = await processAssistantMessage({ message: greeting }, '127.0.0.1');
    assert.strictEqual(res.statusCode, 200, `Greeting "${greeting}" should return 200 OK`);
    assert.strictEqual(res.body.status, 'answered', `Greeting "${greeting}" should return answered status`);
    
    const ans = res.body.answer.toLowerCase();
    // Verify coverage of standard Indian CA practice disciplines
    assert.ok(ans.includes('direct tax') || ans.includes('income tax'), `Greeting "${greeting}" must cite Direct Tax / Income Tax`);
    assert.ok(ans.includes('gst') || ans.includes('indirect tax'), `Greeting "${greeting}" must cite GST / Indirect Tax`);
    assert.ok(ans.includes('companies act') || ans.includes('mca'), `Greeting "${greeting}" must cite Companies Act / MCA`);
    assert.ok(ans.includes('statutory audit') || ans.includes('assurance'), `Greeting "${greeting}" must cite Statutory Audit & Assurance`);
    assert.ok(ans.includes('rera'), `Greeting "${greeting}" must cite RERA Advisory`);
    assert.ok(ans.includes('virtual cfo'), `Greeting "${greeting}" must cite Virtual CFO`);
    assert.ok(ans.includes('icai'), `Greeting "${greeting}" must reference ICAI professional ethics`);

    // Verify consultation handoff provides working links for both WhatsApp and Phone
    assert.ok(res.body.handoff, `Greeting "${greeting}" must provide handoff object`);
    assert.strictEqual(res.body.handoff.available, true, `Greeting "${greeting}" handoff must be available`);
    assert.ok(res.body.handoff.whatsappUrl && res.body.handoff.whatsappUrl.startsWith('https://wa.me/'), `Greeting "${greeting}" must provide valid WhatsApp URL`);
    assert.ok(res.body.handoff.phoneUrl && res.body.handoff.phoneUrl.startsWith('tel:'), `Greeting "${greeting}" must provide working tel: phone URL`);
    assert.ok(res.body.handoff.phoneDisplay && res.body.handoff.phoneDisplay.includes('96263 50900'), `Greeting "${greeting}" must provide display phone number`);
  }

  console.log('✔ PASS: Greetings return authoritative CA chambers overview across all 6 practice disciplines with working handoffs');
});

test('Suite 2: Conversational Closures & Politeness (Thanks / Goodbye)', async () => {
  resetRateLimiter();
  const closures = [
    { msg: 'Thank you', expectTerm: 'welcome' },
    { msg: 'Thank you so much', expectTerm: 'welcome' },
    { msg: 'Thanks so much', expectTerm: 'welcome' },
    { msg: 'Thanks a lot', expectTerm: 'welcome' },
    { msg: 'Thank you team', expectTerm: 'welcome' },
    { msg: 'Thanks team', expectTerm: 'welcome' },
    { msg: 'Thank you CA Kavitha', expectTerm: 'welcome' },
    { msg: 'Thank you for your help', expectTerm: 'welcome' },
    { msg: 'Ok thank you', expectTerm: 'welcome' },
    { msg: 'Goodbye', expectTerm: 'thank you for contacting' },
    { msg: 'Have a good day', expectTerm: 'thank you for contacting' },
    { msg: 'Have a nice day', expectTerm: 'thank you for contacting' },
    { msg: 'Good night', expectTerm: 'thank you for contacting' },
    { msg: 'See you soon', expectTerm: 'thank you for contacting' },
    { msg: 'Bye for now', expectTerm: 'thank you for contacting' },
    { msg: 'Take care', expectTerm: 'thank you for contacting' }
  ];

  for (const item of closures) {
    const res = await processAssistantMessage({ message: item.msg }, '127.0.0.1');
    assert.strictEqual(res.statusCode, 200, `Closure "${item.msg}" should return 200 OK`);
    assert.strictEqual(res.body.status, 'answered', `Closure "${item.msg}" should return answered status`);
    assert.ok(
      res.body.answer.toLowerCase().includes(item.expectTerm),
      `Closure "${item.msg}" expected "${item.expectTerm}", got "${res.body.answer}"`
    );
    assert.ok(res.body.handoff?.available, `Closure "${item.msg}" must have handoff`);
    assert.ok(res.body.handoff.whatsappUrl.startsWith('https://wa.me/'), `Closure "${item.msg}" must have WhatsApp URL`);
    assert.ok(res.body.handoff.phoneUrl.startsWith('tel:'), `Closure "${item.msg}" must have phone URL`);
  }

  console.log('✔ PASS: Conversational closures return polite, professional CA chambers responses with working handoffs');
});

test('Suite 3: Consultation, Human Handoff & Office Inquiries', async () => {
  resetRateLimiter();
  const consultQueries = [
    'Can I schedule a consultation?',
    'How do I book an appointment?',
    'How to book a meeting?',
    'Can I speak with a human?',
    'I want to speak with someone',
    'Can I call someone?',
    'Talk to a person',
    'Human agent',
    'Where is CA Kavitha office?',
    'What is CA Kavitha phone number?',
    'Address of CA Kavitha'
  ];

  for (const q of consultQueries) {
    const res = await processAssistantMessage({ message: q }, '127.0.0.1');
    assert.strictEqual(res.statusCode, 200, `Consultation query "${q}" should return 200 OK`);
    assert.strictEqual(res.body.status, 'answered', `Consultation query "${q}" should return answered status`);
    const ans = res.body.answer.toLowerCase();
    assert.ok(ans.includes('chambers') || ans.includes('appointment') || ans.includes('consultation') || ans.includes('located'), `Query "${q}" must explain chambers consultation or address`);
    assert.ok(ans.includes('tirupati') || ans.includes('96263 50900'), `Query "${q}" must mention Tirupati or phone`);
    assert.ok(res.body.handoff?.whatsappUrl.startsWith('https://wa.me/'), `Query "${q}" must have WhatsApp URL`);
    assert.ok(res.body.handoff?.phoneUrl.startsWith('tel:'), `Query "${q}" must have Phone URL`);
  }

  console.log('✔ PASS: Consultation and appointment inquiries return clear booking instructions and working handoffs');
});

test('Suite 4: Natural Service Requests & Partner Inquiries', async () => {
  resetRateLimiter();
  const naturalQueries = [
    {
      q: 'Who is CA Kavitha?',
      expectedTerms: ['Kavitha Vijay', 'Fellow Chartered Accountant', 'AIR 49', 'Deloitte']
    },
    {
      q: 'I need an audit',
      expectedTerms: ['Companies Act 2013', 'Standards on Auditing', 'Statutory Audit', 'Section 139']
    },
    {
      q: 'Can you do an audit?',
      expectedTerms: ['Companies Act 2013', 'Standards on Auditing', 'Statutory Audit']
    },
    {
      q: 'I need help with my taxes',
      expectedTerms: ['Income Tax Act 1961', 'ITR', 'Advance Tax']
    },
    {
      q: 'I want to start a company',
      expectedTerms: ['Companies Act 2013', 'SPICe+', 'LLP', 'Incorporation']
    },
    {
      q: 'Notice 143(1)',
      expectedTerms: ['Income Tax Act 1961', 'Direct Tax', 'ITR']
    },
    {
      q: '148 reassessment notice',
      expectedTerms: ['Income Tax Act 1961', 'reassessment', '148']
    },
    {
      q: 'AOC-4 and MGT-7',
      expectedTerms: ['Companies Act 2013', 'ROC', 'AOC-4', 'MGT-7']
    },
    {
      q: 'Cost modeling',
      expectedTerms: ['Virtual CFO', 'CMA', 'AIR 49']
    }
  ];

  for (const item of naturalQueries) {
    const res = await processAssistantMessage({ message: item.q }, '127.0.0.1');
    assert.strictEqual(res.statusCode, 200, `Query "${item.q}" should return 200 OK`);
    assert.strictEqual(res.body.status, 'answered', `Query "${item.q}" should return answered status`);
    for (const term of item.expectedTerms) {
      assert.ok(
        res.body.answer.toLowerCase().includes(term.toLowerCase()),
        `Query "${item.q}" missing expected term: "${term}" in answer: "${res.body.answer}"`
      );
    }
  }

  console.log('✔ PASS: Natural phrasing for services and partner identity route intelligently to correct practice corridors');
});

test('Suite 5: Statutory Practice Corridor Inquiries & Precise Citations', async () => {
  resetRateLimiter();
  const practiceQueries = [
    {
      domain: 'Direct Tax',
      query: 'What income tax services and scrutiny assessment representation does the firm provide?',
      expectedTerms: ['Income Tax Act 1961', '143(3)', 'ITR', '44AB', 'Scrutiny']
    },
    {
      domain: 'Indirect Tax / GST',
      query: 'Can you help with GST return filing, 2B ITC reconciliation, and GSTR-9/9C audit?',
      expectedTerms: ['CGST Act 2017', 'GSTR-1', 'GSTR-3B', 'GSTR-9', 'GSTR-9C', '16(2)(aa)']
    },
    {
      domain: 'Statutory Audit',
      query: 'What is the statutory framework for company audits and Section 44AB tax audits?',
      expectedTerms: ['Companies Act 2013', 'Section 139', 'Standards on Auditing', '44AB', 'IFC']
    },
    {
      domain: 'Companies Act / Corporate Governance',
      query: 'Does the firm offer company incorporation and ROC filings under Companies Act 2013?',
      expectedTerms: ['Companies Act 2013', 'SPICe+', 'LLP', 'AOC-4', 'MGT-7']
    },
    {
      domain: 'RERA Certifications',
      query: 'Does the firm provide RERA registration and CA Form 3 escrow certifications?',
      expectedTerms: ['Real Estate (Regulation and Development) Act 2016', 'RERA', 'Form 3', 'Escrow', '4(2)(l)(D)']
    },
    {
      domain: 'Virtual CFO Advisory',
      query: 'What is Virtual CFO advisory and how does the firm assist growing enterprises?',
      expectedTerms: ['Virtual CFO', 'Cash Flow', 'MIS', 'CMA', 'AIR 49']
    }
  ];

  for (const item of practiceQueries) {
    const res = await processAssistantMessage({ message: item.query }, '127.0.0.1');
    assert.strictEqual(res.statusCode, 200, `Query for ${item.domain} should return 200`);
    assert.strictEqual(res.body.status, 'answered', `Query for ${item.domain} should return answered`);
    
    for (const term of item.expectedTerms) {
      assert.ok(
        res.body.answer.toLowerCase().includes(term.toLowerCase()),
        `Answer for ${item.domain} missing statutory term: "${term}"`
      );
    }

    // Verify statutory citations are provided
    assert.ok(Array.isArray(res.body.citations) && res.body.citations.length > 0, `${item.domain} must have citations`);
    for (const c of res.body.citations) {
      assert.ok(c.url.startsWith('/'), `Citation URL must be canonical internal path: ${c.url}`);
    }

    // Verify handoff has working WhatsApp & Phone
    assert.ok(res.body.handoff && res.body.handoff.available, `${item.domain} must have available handoff`);
    assert.ok(res.body.handoff.whatsappUrl.startsWith('https://wa.me/'), `${item.domain} handoff must have WhatsApp URL`);
    assert.ok(res.body.handoff.phoneUrl.startsWith('tel:'), `${item.domain} handoff must have Phone URL`);
  }

  console.log('✔ PASS: All 6 standard statutory practice corridors return precise citations, authoritative tone, and verified links');
});

test('Suite 6: ICAI Ethics Compliance (No Solicitation, No Unredacted PII)', async () => {
  resetRateLimiter();
  // Test ethics query
  const res = await processAssistantMessage({ message: 'Does the firm follow the ICAI Code of Ethics?' }, '127.0.0.1');
  assert.strictEqual(res.statusCode, 200);
  assert.ok(res.body.answer.includes('ICAI Code of Ethics'));

  // Negative test: Sensitive personal info request
  const sensRes = await processAssistantMessage({ message: "What is CA Kavitha Vijay's PAN number?" }, '127.0.0.1');
  assert.strictEqual(sensRes.statusCode, 200);
  assert.strictEqual(sensRes.body.status, 'out_of_scope');
  assert.ok(!/[A-Z]{5}[0-9]{4}[A-Z]/.test(sensRes.body.answer), 'Must never disclose PAN');

  console.log('✔ PASS: ICAI Code of Ethics compliance strictly enforced; sensitive PII quarantined');
});
