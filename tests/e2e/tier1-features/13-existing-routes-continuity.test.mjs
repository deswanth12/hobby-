import fs from 'fs';
import path from 'path';
import { describe, it, assert } from '../helpers/test-harness.mjs';

describe('Tier 1 - Feature 13: Existing Routes & Forms Continuity', () => {
  const appPath = path.resolve('src/App.tsx');
  const navbarPath = path.resolve('src/components/Navbar.tsx');
  const footerPath = path.resolve('src/components/Footer.tsx');
  const contactPagePath = path.resolve('src/pages/ContactPage.tsx');

  it('13.1: All core existing public routes are registered in src/App.tsx', () => {
    assert.ok(fs.existsSync(appPath), 'Expected src/App.tsx to exist');
    const appContent = fs.readFileSync(appPath, 'utf8');

    const expectedRoutes = [
      '/',
      '/about',
      '/services',
      '/contact',
      '/industries',
      '/locations',
    ];

    for (const route of expectedRoutes) {
      assert.match(appContent, new RegExp(`path=["']${route}["']`), `Route ${route} must be registered in App.tsx`);
    }
  });

  it('13.2: Navbar component includes navigation link to /blog', () => {
    assert.ok(fs.existsSync(navbarPath), 'Expected src/components/Navbar.tsx to exist');
    const navbarContent = fs.readFileSync(navbarPath, 'utf8');
    assert.match(navbarContent, /to=["']\/blog["']|href=["']\/blog["']|path:\s*['"]\/blog['"]/, 'Navbar must contain link or route definition for /blog');
  });

  it('13.3: Footer component includes navigation link to /blog', () => {
    assert.ok(fs.existsSync(footerPath), 'Expected src/components/Footer.tsx to exist');
    const footerContent = fs.readFileSync(footerPath, 'utf8');
    assert.match(footerContent, /to=["']\/blog["']|href=["']\/blog["']|path:\s*['"]\/blog['"]/, 'Footer must contain link to /blog');
  });

  it('13.4: ContactPage renders enquiry form with essential fields (name, phone/email, message)', () => {
    assert.ok(fs.existsSync(contactPagePath), 'Expected src/pages/ContactPage.tsx to exist');
    const contactPageContent = fs.readFileSync(contactPagePath, 'utf8');
    const contactFormPath = path.resolve('src/components/ContactForm.tsx');
    const formContent = fs.existsSync(contactFormPath) ? fs.readFileSync(contactFormPath, 'utf8') : contactPageContent;

    const hasNameField = formContent.includes('fullName') || formContent.includes('name');
    assert.ok(hasNameField, 'Contact form must have name or fullName field');
    const hasContactChannel = formContent.includes('email') && formContent.includes('phone');
    assert.ok(hasContactChannel, 'Contact form must have email and phone fields');
    const hasMessage = formContent.includes('message');
    assert.ok(hasMessage, 'Contact form must have message field');
  });

  it('13.5: Partner credentials and Tirupati chambers address are preserved', () => {
    const contactContent = fs.readFileSync(contactPagePath, 'utf8');
    const hasTirupati = contactContent.includes('Tirupati');
    assert.ok(hasTirupati, 'Physical chambers in Tirupati must be preserved');

    const aboutPath = path.resolve('src/pages/AboutPage.tsx');
    if (fs.existsSync(aboutPath)) {
      const aboutContent = fs.readFileSync(aboutPath, 'utf8');
      assert.includes(aboutContent, 'Kavitha', 'Partner name must be preserved in AboutPage');
    }
  });
});
