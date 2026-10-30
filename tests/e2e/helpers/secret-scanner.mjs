/**
 * Secret & Sensitive Credential Scanner
 * Scans directories, bundle assets, and source files for leaked tokens, private keys, and high-entropy secrets.
 */

import fs from 'fs';
import path from 'path';

export const SECRET_PATTERNS = [
  { name: 'GitHub Classic PAT', regex: /\bghp_[0-9a-zA-Z]{36}\b/ },
  { name: 'GitHub Fine-Grained PAT', regex: /\bgithub_pat_[0-9a-zA-Z_]{82}\b/ },
  { name: 'GitHub OAuth Client Secret', regex: /\b(?:client_secret|clientSecret)\s*[:=]\s*["']([0-9a-zA-Z]{35,45})["']/i },
  { name: 'RSA/EC Private Key Header', regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: 'Cloudflare API Token', regex: /\b[A-Za-z0-9_-]{40}\b/ },
  { name: 'Generic Live Access Token', regex: /\b(?:bearer\s+|token:\s*["'])(gho_[0-9a-zA-Z]{36})\b/i },
];

/**
 * Calculates Shannon entropy of a string (bits per symbol).
 */
export function calculateShannonEntropy(str) {
  if (!str) return 0;
  const len = str.length;
  const frequencies = {};
  for (const ch of str) {
    frequencies[ch] = (frequencies[ch] || 0) + 1;
  }
  let entropy = 0;
  for (const ch in frequencies) {
    const p = frequencies[ch] / len;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

/**
 * Scans a single string content for secret patterns.
 */
export function scanContentForSecrets(content, filePath = 'unknown') {
  const findings = [];
  for (const { name, regex } of SECRET_PATTERNS) {
    const match = content.match(regex);
    if (match) {
      findings.push({
        file: filePath,
        rule: name,
        matchedSnippet: match[0].substring(0, 8) + '***REDACTED***',
      });
    }
  }
  return findings;
}

/**
 * Recursively scans a directory for secret patterns.
 */
export function scanDirectoryForSecrets(dirPath, options = {}) {
  const findings = [];
  const fullPath = path.resolve(dirPath);
  if (!fs.existsSync(fullPath)) return findings;

  const ignoreList = options.ignoreList || [
    'node_modules',
    '.git',
    'dist',
    '.gemini',
    '.agents',
    'package-lock.json',
  ];

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (ignoreList.includes(entry.name)) continue;
      const entryPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        walk(entryPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        // Scan text/source files
        if (['.js', '.mjs', '.ts', '.tsx', '.json', '.yml', '.yaml', '.md', '.html', '.env'].includes(ext) || entry.name.startsWith('.env')) {
          try {
            const content = fs.readFileSync(entryPath, 'utf8');
            const fileFindings = scanContentForSecrets(content, entryPath);
            findings.push(...fileFindings);
          } catch {
            // Ignore unreadable binary files
          }
        }
      }
    }
  }

  walk(fullPath);
  return findings;
}
