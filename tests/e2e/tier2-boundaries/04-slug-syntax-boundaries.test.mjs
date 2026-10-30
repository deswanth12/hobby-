import { describe, it, assert } from '../helpers/test-harness.mjs';

describe('Tier 2 - Boundaries: Feature 4 (Slug Syntax & Validation)', () => {
  const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  it('B4.1: Uppercase characters fail slug regex validation', () => {
    assert.strictEqual(SLUG_REGEX.test('Tax-Audit-2026'), false, 'Uppercase letters must be rejected');
    assert.strictEqual(SLUG_REGEX.test('GST-updates'), false, 'Mixed case must be rejected');
  });

  it('B4.2: Special characters, punctuation, spaces, and URL query tokens fail slug validation', () => {
    const invalidSlugs = [
      'tax audit 2026',
      'tax_audit_2026',
      'tax.audit.2026',
      'tax-audit?v=1',
      'tax-audit#section',
      'tax-audit&test=1',
      'tax%20audit',
      'tax!audit',
    ];

    for (const slug of invalidSlugs) {
      assert.strictEqual(SLUG_REGEX.test(slug), false, `Special character slug "${slug}" must be rejected`);
    }
  });

  it('B4.3: Leading or trailing hyphens fail slug validation', () => {
    assert.strictEqual(SLUG_REGEX.test('-tax-audit'), false, 'Leading hyphen must be rejected');
    assert.strictEqual(SLUG_REGEX.test('tax-audit-'), false, 'Trailing hyphen must be rejected');
    assert.strictEqual(SLUG_REGEX.test('-tax-audit-'), false, 'Leading and trailing hyphens must be rejected');
  });

  it('B4.4: Consecutive hyphens (double hyphens) fail slug validation', () => {
    assert.strictEqual(SLUG_REGEX.test('tax--audit'), false, 'Double hyphen must be rejected');
    assert.strictEqual(SLUG_REGEX.test('tax---audit'), false, 'Triple hyphen must be rejected');
  });

  it('B4.5: Empty string and single hyphen fail slug validation', () => {
    assert.strictEqual(SLUG_REGEX.test(''), false, 'Empty string must be rejected');
    assert.strictEqual(SLUG_REGEX.test('-'), false, 'Single hyphen must be rejected');
  });
});
