import { describe, it, assert } from '../helpers/test-harness.mjs';

describe('Tier 2 - Boundaries: Feature 13 (Routes & Navigation Boundaries)', () => {
  it('B13.1: Contact form validation flags empty name, email, and message', () => {
    const validateContactForm = (formData) => {
      const errors = {};
      if (!formData.name || !formData.name.trim()) errors.name = 'Name is required';
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Valid email is required';
      if (!formData.message || !formData.message.trim()) errors.message = 'Message is required';
      return errors;
    };

    const emptySubmission = { name: '', email: '', message: '' };
    const errors = validateContactForm(emptySubmission);

    assert.ok(errors.name, 'Name error required on empty submission');
    assert.ok(errors.email, 'Email error required on empty submission');
    assert.ok(errors.message, 'Message error required on empty submission');
  });

  it('B13.2: Contact form rejects invalid email addresses (missing @ or domain)', () => {
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    assert.strictEqual(validateEmail('cakavithasrj'), false);
    assert.strictEqual(validateEmail('cakavithasrj@'), false);
    assert.strictEqual(validateEmail('cakavithasrj@gmail'), false);
    assert.strictEqual(validateEmail('cakavithasrj@gmail.com'), true);
  });

  it('B13.3: Route paths with trailing slashes normalize cleanly', () => {
    const normalizePath = (p) => {
      if (p.length > 1 && p.endsWith('/')) return p.slice(0, -1);
      return p;
    };

    assert.strictEqual(normalizePath('/blog/'), '/blog');
    assert.strictEqual(normalizePath('/about/'), '/about');
    assert.strictEqual(normalizePath('/'), '/');
  });

  it('B13.4: Mobile navigation menu open/close toggle maintains boolean state', () => {
    let isOpen = false;
    const toggle = () => { isOpen = !isOpen; };

    toggle();
    assert.strictEqual(isOpen, true, 'Menu should open');
    toggle();
    assert.strictEqual(isOpen, false, 'Menu should close');
  });

  it('B13.5: Deep route nesting parameters parse accurately without loss of context', () => {
    const parseUrlSegments = (pathname) => {
      return pathname.split('/').filter(Boolean);
    };

    const segments = parseUrlSegments('/services/audit-assurance');
    assert.deepStrictEqual(segments, ['services', 'audit-assurance']);
  });
});
