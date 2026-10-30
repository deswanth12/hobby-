import fs from 'fs';
import path from 'path';
import { describe, it, assert } from '../helpers/test-harness.mjs';

describe('Tier 1 - Feature 2: Zero Hosting Cost Boundary', () => {
  it('2.1: Verifies production architecture is pure static SPA + serverless functions', () => {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    assert.strictEqual(pkg.type, 'module', 'Expected ESM package configuration');
    // Ensure build command compiles to static files
    assert.includes(pkg.scripts.build, 'vite build', 'Build command must generate static Vite output');
  });

  it('2.2: public/_routes.json restricts function execution strictly to /api/* to protect free quota', () => {
    const routesPath = path.resolve('public/_routes.json');
    assert.ok(fs.existsSync(routesPath), 'Expected public/_routes.json to exist');
    const content = JSON.parse(fs.readFileSync(routesPath, 'utf8'));
    
    assert.strictEqual(content.version, 1, 'Routes version must be 1');
    assert.ok(Array.isArray(content.include), 'Routes must declare include array');
    assert.includes(content.include, '/api/*', 'Function invocation must be scoped to /api/*');
    
    if (content.exclude) {
      assert.ok(Array.isArray(content.exclude), 'Exclude must be an array');
    }
  });

  it('2.3: CMS admin configuration uses Git-backed persistence without external DB subscriptions', () => {
    const configPath = path.resolve('public/admin/config.yml');
    assert.ok(fs.existsSync(configPath), 'Expected public/admin/config.yml to exist');
    const raw = fs.readFileSync(configPath, 'utf8');

    // Must declare git-gateway or github backend
    const hasGitBackend = raw.includes('name: git-gateway') || raw.includes('name: github');
    assert.ok(hasGitBackend, 'CMS backend must be git-gateway or github for zero-cost Git persistence');
    assert.notIncludes(raw, 'firebase', 'No paid proprietary Firebase database');
    assert.notIncludes(raw, 'contentful', 'No paid Contentful subscription');
    assert.notIncludes(raw, 'sanity', 'No paid Sanity studio subscription');
  });

  it('2.4: Codebase contains zero proprietary paid SaaS CMS or hosting SDK dependencies', () => {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

    const paidServices = ['@sanity/client', 'contentful', 'strapi', 'datocms-client', 'aws-sdk', '@aws-sdk/client-s3'];
    for (const service of paidServices) {
      assert.ok(!allDeps[service], `Package.json must not include paid SaaS dependency: ${service}`);
    }
  });

  it('2.5: Edge headers configure long-term caching for immutable assets to minimize bandwidth', () => {
    const headersPath = path.resolve('public/_headers');
    assert.ok(fs.existsSync(headersPath), 'Expected public/_headers to exist');
    const headersContent = fs.readFileSync(headersPath, 'utf8');

    assert.includes(headersContent, 'Cache-Control', 'Expected Cache-Control rules in _headers');
  });
});
