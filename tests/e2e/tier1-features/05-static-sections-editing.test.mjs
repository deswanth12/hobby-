import fs from 'fs';
import path from 'path';
import { describe, it, assert } from '../helpers/test-harness.mjs';

describe('Tier 1 - Feature 5: Approved Static Sections Editing', () => {
  const configPath = path.resolve('public/admin/config.yml');
  const sectionsDir = path.resolve('content/sections');

  it('5.1: CMS configuration declares file collection for static website sections', () => {
    assert.ok(fs.existsSync(configPath), 'Expected public/admin/config.yml to exist');
    const raw = fs.readFileSync(configPath, 'utf8');
    const hasFilesCollection = raw.includes('files:') || raw.includes('name: "sections"') || raw.includes('name: sections');
    assert.ok(hasFilesCollection, 'Config must declare files collection for static sections');
  });

  it('5.2: content/sections/about.json contains partner bio and accredited credentials', () => {
    const aboutPath = path.join(sectionsDir, 'about.json');
    assert.ok(fs.existsSync(aboutPath), 'Expected content/sections/about.json to exist');
    const data = JSON.parse(fs.readFileSync(aboutPath, 'utf8'));

    assert.ok(data.partnerBio, 'About section must define partnerBio');
    assert.strictEqual(data.partnerBio.name, 'CA Kavitha Vijay', 'Partner name must match CA Kavitha Vijay');
    assert.includes(data.partnerBio.qualifications, 'CA', 'Partner qualifications must include CA');
    assert.includes(data.partnerBio.qualifications, 'CMA', 'Partner qualifications must include CMA');
    assert.ok(Array.isArray(data.partnerBio.coreCompetencies), 'Competencies must be an array');
  });

  it('5.3: content/sections/homepage.json contains hero banner and practice pillars', () => {
    const homePath = path.join(sectionsDir, 'homepage.json');
    assert.ok(fs.existsSync(homePath), 'Expected content/sections/homepage.json to exist');
    const data = JSON.parse(fs.readFileSync(homePath, 'utf8'));

    assert.ok(data.hero, 'Homepage must have hero section');
    assert.ok(data.hero.headlinePrimary, 'Hero must have primary headline');
    assert.ok(Array.isArray(data.pillars), 'Homepage must define practice pillars array');
    assert.ok(data.pillars.length >= 3, 'Homepage must have at least 3 practice pillars');
  });

  it('5.4: content/sections/services.json contains service categories and audit services', () => {
    const servicesPath = path.join(sectionsDir, 'services.json');
    assert.ok(fs.existsSync(servicesPath), 'Expected content/sections/services.json to exist');
    const data = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));

    assert.ok(Array.isArray(data.serviceCategories), 'Expected serviceCategories array');
    assert.ok(data.serviceCategories.length >= 4, 'Expected at least 4 core service categories');
    
    // Check key services: income-tax, gst, corporate
    const ids = data.serviceCategories.map(s => s.id);
    assert.includes(ids, 'income-tax', 'Expected income-tax service category');
    assert.includes(ids, 'gst', 'Expected gst service category');
  });

  it('5.5: content/sections/faqs.json and contact.json contain statutory Q&A and chambers details', () => {
    const faqsPath = path.join(sectionsDir, 'faqs.json');
    const contactPath = path.join(sectionsDir, 'contact.json');

    assert.ok(fs.existsSync(faqsPath), 'Expected content/sections/faqs.json to exist');
    assert.ok(fs.existsSync(contactPath), 'Expected content/sections/contact.json to exist');

    const faqs = JSON.parse(fs.readFileSync(faqsPath, 'utf8'));
    assert.ok(Array.isArray(faqs.faqs), 'Expected faqs array');
    assert.ok(faqs.faqs.length >= 3, 'Expected at least 3 approved FAQs');

    const contact = JSON.parse(fs.readFileSync(contactPath, 'utf8'));
    assert.strictEqual(contact.firmName, 'Kavitha & Associates', 'Firm name must match');
    assert.ok(contact.contactChannels.primaryPhone, 'Expected primary phone');
    assert.ok(contact.physicalChambers.city, 'Expected physical chamber city');
    assert.strictEqual(contact.physicalChambers.city, 'Tirupati', 'Chamber city must be Tirupati');
  });
});
