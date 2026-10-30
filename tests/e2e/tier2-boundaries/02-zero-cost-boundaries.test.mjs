import fs from 'fs';
import path from 'path';
import { describe, it, assert } from '../helpers/test-harness.mjs';

describe('Tier 2 - Boundaries: Feature 2 (Zero Hosting Cost)', () => {
  it('B2.1: Non-API routes are not routed through functions in public/_routes.json', () => {
    const routesPath = path.resolve('public/_routes.json');
    if (!fs.existsSync(routesPath)) return;
    const content = JSON.parse(fs.readFileSync(routesPath, 'utf8'));

    // Verify include does not wildcard everything
    assert.notIncludes(content.include, '/*', 'Functions include array must NOT wildcard /*');
    assert.strictEqual(content.include.length, 1, 'Functions should include only /api/*');
    assert.strictEqual(content.include[0], '/api/*', 'Include must strictly target /api/*');
  });

  it('B2.2: Distribution asset size boundary (no single asset > 25MB)', () => {
    const distPath = path.resolve('dist');
    if (!fs.existsSync(distPath)) return;

    const checkFileSizes = (dir) => {
      const files = fs.readdirSync(dir, { withFileTypes: true });
      for (const f of files) {
        const full = path.join(dir, f.name);
        if (f.isDirectory()) {
          checkFileSizes(full);
        } else {
          const stat = fs.statSync(full);
          assert.ok(stat.size < 25 * 1024 * 1024, `Asset ${f.name} exceeds Cloudflare Pages 25MB limit: ${stat.size}`);
        }
      }
    };
    checkFileSizes(distPath);
  });

  it('B2.3: Production dependencies contain zero SQL/NoSQL database driver connection engines', () => {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const prodDeps = pkg.dependencies || {};
    const unmeteredDbs = ['pg', 'mysql', 'mysql2', 'mongodb', 'mongoose', 'sqlite3', 'redis', 'ioredis'];

    for (const db of unmeteredDbs) {
      assert.ok(!prodDeps[db], `Production dependencies must not include unmetered database driver: ${db}`);
    }
  });

  it('B2.4: Build script produces client-side static assets without requiring SSR runtime', () => {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    assert.notIncludes(pkg.scripts.build, 'next build', 'Must not use Next.js SSR build');
    assert.notIncludes(pkg.scripts.build, 'nuxt build', 'Must not use Nuxt SSR build');
    assert.includes(pkg.scripts.build, 'vite build', 'Must use Vite client static build');
  });

  it('B2.5: No expensive cloud background worker queues configured in package.json', () => {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const allDeps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    const queueLibs = ['bull', 'bullmq', 'agenda', 'celery'];

    for (const q of queueLibs) {
      assert.ok(!allDeps[q], `Package must not include server queue runner: ${q}`);
    }
  });
});
