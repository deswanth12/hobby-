import fs from 'fs';
import path from 'path';
import { describe, it, assert } from '../helpers/test-harness.mjs';

describe('Tier 1 - Feature 12: Missing Article 404 Recovery', () => {
  const notFoundPagePath = path.resolve('src/pages/NotFoundPage.tsx');
  const appPath = path.resolve('src/App.tsx');

  it('12.1: src/pages/NotFoundPage.tsx exists for graceful 404 error recovery', () => {
    assert.ok(fs.existsSync(notFoundPagePath), 'Expected src/pages/NotFoundPage.tsx to exist');
  });

  it('12.2: Router registers wildcard catch-all route (path="*") mapped to NotFoundPage', () => {
    assert.ok(fs.existsSync(appPath), 'Expected src/App.tsx to exist');
    const appContent = fs.readFileSync(appPath, 'utf8');
    assert.match(appContent, /path=["']\*["']/, 'App.tsx must register wildcard path="*" route');
    assert.includes(appContent, 'NotFoundPage', 'Catch-all route must render NotFoundPage');
  });

  it('12.3: NotFoundPage renders recovery navigation links (Homepage, Articles, Contact)', () => {
    const content = fs.readFileSync(notFoundPagePath, 'utf8');
    assert.includes(content, 'to="/"', '404 page must provide link to homepage');
    
    const hasContact = content.includes('contact') || content.includes('/contact');
    assert.ok(hasContact, '404 page must provide link to contact chambers');
  });

  it('12.4: NotFoundPage provides urgent statutory deadline assistance contact actions', () => {
    const content = fs.readFileSync(notFoundPagePath, 'utf8');
    
    // Urgent assistance actions
    const hasPhone = content.includes('tel:') || content.includes('96263') || content.includes('Call');
    const hasWhatsapp = content.includes('wa.me') || content.includes('whatsapp') || content.includes('WhatsApp');
    assert.ok(hasPhone || hasWhatsapp, '404 page must provide phone or WhatsApp assistance action');
  });

  it('12.5: NotFoundPage maintains executive branding tokens (Forest Green, Warm White, Gold)', () => {
    const content = fs.readFileSync(notFoundPagePath, 'utf8');
    const hasBrandTokens = content.includes('brand') || content.includes('gold') || content.includes('forest') || content.includes('emerald') || content.includes('amber');
    assert.ok(hasBrandTokens, '404 page must maintain dignified firm styling');
  });
});
