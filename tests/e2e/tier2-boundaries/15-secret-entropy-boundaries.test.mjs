import fs from 'fs';
import path from 'path';
import { describe, it, assert } from '../helpers/test-harness.mjs';
import { calculateShannonEntropy, scanDirectoryForSecrets } from '../helpers/secret-scanner.mjs';

describe('Tier 2 - Boundaries: Feature 15 (High-Entropy Secret Detection)', () => {
  it('B15.1: Zero RSA/EC/OpenSSH private key blocks found in any repository files', () => {
    const findings = scanDirectoryForSecrets('.');
    const keyFindings = findings.filter(f => f.rule === 'RSA/EC Private Key Header');
    assert.strictEqual(keyFindings.length, 0, `Found private keys in repo: ${JSON.stringify(keyFindings)}`);
  });

  it('B15.2: Shannon entropy calculator accurately flags high-entropy simulated secrets', () => {
    const lowEntropyText = 'Standard business correspondence regarding statutory compliance and audit filings.';
    const highEntropySecret = 'x8K9#mQ2$pL0!vN4@wZ7^bC1*yF3&tR5%uJ6+';

    const lowScore = calculateShannonEntropy(lowEntropyText);
    const highScore = calculateShannonEntropy(highEntropySecret);

    assert.ok(lowScore < 4.5, `Natural language entropy (${lowScore.toFixed(2)}) should be < 4.5`);
    assert.ok(highScore > 4.8, `High-entropy secret (${highScore.toFixed(2)}) should be > 4.8`);
  });

  it('B15.3: CMS config.yml contains zero client_secret or secret key definitions', () => {
    const configPath = path.resolve('public/admin/config.yml');
    if (!fs.existsSync(configPath)) return;
    const content = fs.readFileSync(configPath, 'utf8');

    assert.notMatch(content, /client_secret/i, 'config.yml must NEVER contain client_secret');
    assert.notMatch(content, /api_key:\s*["'][0-9a-zA-Z]{20,}["']/i, 'config.yml must not contain hardcoded API keys');
  });

  it('B15.4: Production distribution (dist/) if present contains zero secret signatures', () => {
    const distPath = path.resolve('dist');
    if (!fs.existsSync(distPath)) return;

    const findings = scanDirectoryForSecrets('dist');
    assert.strictEqual(findings.length, 0, `Found secret signatures in production dist: ${JSON.stringify(findings)}`);
  });

  it('B15.5: Content markdown files contain zero embedded authentication tokens', () => {
    const postsDir = path.resolve('content/posts');
    if (!fs.existsSync(postsDir)) return;

    const findings = scanDirectoryForSecrets(postsDir);
    assert.strictEqual(findings.length, 0, `Found credentials inside markdown posts: ${JSON.stringify(findings)}`);
  });
});
