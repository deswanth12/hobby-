import fs from 'fs';
import path from 'path';
import { describe, it, assert } from '../helpers/test-harness.mjs';
import { scanDirectoryForSecrets, scanContentForSecrets } from '../helpers/secret-scanner.mjs';

describe('Tier 1 - Feature 15: Zero Secret Leakage Enforcement', () => {
  it('15.1: Source code contains zero classic GitHub Personal Access Tokens (ghp_)', () => {
    const findings = scanDirectoryForSecrets('src');
    const patFindings = findings.filter(f => f.rule === 'GitHub Classic PAT');
    assert.strictEqual(patFindings.length, 0, `Found leaked GitHub classic PAT in src: ${JSON.stringify(patFindings)}`);
  });

  it('15.2: Public assets contain zero fine-grained GitHub PATs (github_pat_)', () => {
    const findings = scanDirectoryForSecrets('public');
    const patFindings = findings.filter(f => f.rule === 'GitHub Fine-Grained PAT');
    assert.strictEqual(patFindings.length, 0, `Found leaked GitHub fine-grained PAT in public: ${JSON.stringify(patFindings)}`);
  });

  it('15.3: Functions directory contains zero hardcoded GITHUB_CLIENT_SECRET values', () => {
    if (!fs.existsSync('functions')) return;
    const findings = scanDirectoryForSecrets('functions');
    const secretFindings = findings.filter(f => f.rule === 'GitHub OAuth Client Secret');
    assert.strictEqual(secretFindings.length, 0, `Found hardcoded OAuth client secret in functions: ${JSON.stringify(secretFindings)}`);
  });

  it('15.4: .gitignore strictly ignores local .env files', () => {
    assert.ok(fs.existsSync('.gitignore'), 'Expected .gitignore to exist');
    const content = fs.readFileSync('.gitignore', 'utf8');
    assert.match(content, /\.env/, '.gitignore must ignore .env files');
  });

  it('15.5: .env.example contains only non-sensitive placeholder variable names', () => {
    const envExamplePath = path.resolve('.env.example');
    if (!fs.existsSync(envExamplePath)) return;

    const content = fs.readFileSync(envExamplePath, 'utf8');
    const findings = scanContentForSecrets(content, '.env.example');
    assert.strictEqual(findings.length, 0, `Found live secrets in .env.example: ${JSON.stringify(findings)}`);
    assert.notMatch(content, /ghp_[a-zA-Z0-9]{36}/, '.env.example must not contain live PAT');
  });
});
