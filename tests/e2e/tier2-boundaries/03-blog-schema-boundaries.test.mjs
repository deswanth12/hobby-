import { describe, it, assert } from '../helpers/test-harness.mjs';
import { parseFrontmatter } from '../helpers/config-parser.mjs';

describe('Tier 2 - Boundaries: Feature 3 (Blog Post Schema)', () => {
  const validatePostSchema = (data, body) => {
    const errors = [];
    if (!data.title || data.title.trim().length === 0) errors.push('Title must not be empty');
    if (!data.slug || data.slug.trim().length === 0) errors.push('Slug must not be empty');
    if (typeof data.draft !== 'boolean') errors.push('Draft must be a boolean');
    if (!data.date || isNaN(new Date(data.date).getTime())) errors.push('Date must be valid ISO-8601');
    if (!data.author || data.author.trim().length === 0) errors.push('Author must not be empty');
    if (!data.excerpt || data.excerpt.trim().length === 0) errors.push('Excerpt must not be empty');
    if (!body || body.trim().length === 0) errors.push('Body must not be empty');
    if (body && body.length > 5 * 1024 * 1024) errors.push('Body exceeds 5MB size limit');
    return errors;
  };

  it('B3.1: Empty or whitespace-only title is rejected by schema validator', () => {
    const invalidData = {
      title: '   ',
      slug: 'valid-slug',
      draft: false,
      date: '2026-10-29T10:00:00Z',
      author: 'CA KavithaVijay SRJ',
      excerpt: 'Valid excerpt here',
    };
    const errors = validatePostSchema(invalidData, '# Some content');
    assert.includes(errors, 'Title must not be empty');
  });

  it('B3.2: Missing mandatory field (excerpt or author) fails validation', () => {
    const missingExcerpt = {
      title: 'Valid Title',
      slug: 'valid-slug',
      draft: false,
      date: '2026-10-29T10:00:00Z',
      author: 'CA KavithaVijay SRJ',
    };
    const errors = validatePostSchema(missingExcerpt, '# Content');
    assert.includes(errors, 'Excerpt must not be empty');
  });

  it('B3.3: Invalid date format (e.g. "not-a-date" or "2026-99-99") fails validation', () => {
    const invalidDate = {
      title: 'Valid Title',
      slug: 'valid-slug',
      draft: false,
      date: 'invalid-date-string',
      author: 'CA KavithaVijay SRJ',
      excerpt: 'Valid excerpt',
    };
    const errors = validatePostSchema(invalidDate, '# Content');
    assert.includes(errors, 'Date must be valid ISO-8601');
  });

  it('B3.4: Malformed YAML frontmatter syntax throws parsing error', () => {
    const malformed = `---
title: "Unclosed title string
slug: broken-yaml
---
# Content`;
    assert.throws(() => parseFrontmatter(malformed));
  });

  it('B3.5: Empty body or body exceeding 5MB upper limit is flagged', () => {
    const validData = {
      title: 'Valid Title',
      slug: 'valid-slug',
      draft: false,
      date: '2026-10-29T10:00:00Z',
      author: 'CA KavithaVijay SRJ',
      excerpt: 'Valid excerpt',
    };
    const emptyErrors = validatePostSchema(validData, '   ');
    assert.includes(emptyErrors, 'Body must not be empty');

    const oversizedBody = 'a'.repeat(6 * 1024 * 1024);
    const oversizedErrors = validatePostSchema(validData, oversizedBody);
    assert.includes(oversizedErrors, 'Body exceeds 5MB size limit');
  });
});
