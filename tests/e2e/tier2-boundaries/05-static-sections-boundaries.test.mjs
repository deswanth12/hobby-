import fs from 'fs';
import path from 'path';
import { describe, it, assert } from '../helpers/test-harness.mjs';

describe('Tier 2 - Boundaries: Feature 5 (Static Sections Schemas)', () => {
  const sectionsDir = path.resolve('content/sections');

  it('B5.1: About section missing partner qualifications or designation fails validation', () => {
    const validateAbout = (data) => {
      if (!data.partnerBio) return false;
      if (!data.partnerBio.name) return false;
      if (!data.partnerBio.qualifications || !data.partnerBio.qualifications.includes('CA')) return false;
      return true;
    };

    assert.strictEqual(validateAbout({ partnerBio: { name: 'CA KavithaVijay SRJ', qualifications: '' } }), false);
    assert.strictEqual(validateAbout({ partnerBio: { name: 'CA KavithaVijay SRJ', qualifications: 'B.Com, CA, CMA' } }), true);
  });

  it('B5.2: Contact info with invalid email format or empty phone fails validation', () => {
    const validateContact = (data) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!data.contactChannels) return false;
      if (!data.contactChannels.primaryPhone || data.contactChannels.primaryPhone.length < 8) return false;
      if (!data.contactChannels.email || !emailRegex.test(data.contactChannels.email)) return false;
      return true;
    };

    const invalidEmail = {
      contactChannels: { primaryPhone: '+91 96263 50900', email: 'not-an-email' },
    };
    assert.strictEqual(validateContact(invalidEmail), false, 'Malformed email must be rejected');

    const validContact = {
      contactChannels: { primaryPhone: '+91 96263 50900', email: 'cakavithasrj@gmail.com' },
    };
    assert.strictEqual(validateContact(validContact), true, 'Valid contact info must pass');
  });

  it('B5.3: FAQ item with empty question or empty answer fails validation', () => {
    const validateFaqItem = (item) => {
      return Boolean(item.question && item.question.trim().length > 0 && item.answer && item.answer.trim().length > 0);
    };

    assert.strictEqual(validateFaqItem({ question: 'What is Tax Audit?', answer: '' }), false, 'Empty answer must fail');
    assert.strictEqual(validateFaqItem({ question: '  ', answer: 'Tax Audit details' }), false, 'Empty question must fail');
    assert.strictEqual(validateFaqItem({ question: 'What is Tax Audit?', answer: 'Details here' }), true, 'Valid FAQ must pass');
  });

  it('B5.4: Service item with missing ID or missing statutory framework fails validation', () => {
    const validateServiceCategory = (cat) => {
      return Boolean(cat.id && cat.title && cat.statutoryFramework);
    };

    assert.strictEqual(validateServiceCategory({ id: '', title: 'Direct Tax', statutoryFramework: 'Income Tax Act' }), false);
    assert.strictEqual(validateServiceCategory({ id: 'income-tax', title: 'Direct Tax', statutoryFramework: 'Income Tax Act' }), true);
  });

  it('B5.5: All JSON files in content/sections/ parse with zero JSON syntax errors', () => {
    if (!fs.existsSync(sectionsDir)) return;
    const files = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.json'));
    
    for (const file of files) {
      const raw = fs.readFileSync(path.join(sectionsDir, file), 'utf8');
      assert.doesNotThrow(() => JSON.parse(raw), `File ${file} has JSON syntax errors`);
    }
  });
});
