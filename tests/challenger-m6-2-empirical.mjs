/**
 * challenger-m6-2-empirical.mjs
 * 
 * Milestone 6 Challenger 2 Empirical Test Harness
 * Kavitha & Associates — Migration, Rollback & Privacy Adversarial Verification
 * 
 * Objectives:
 * 1. Audit backup_v70_baseline/ (775 files, ~24 MB, directory breakdown, 0 corrupted files)
 * 2. Verify git remote lockdown (DISABLED_NO_PUSH_ALLOWED, config audit, simulated push failure)
 * 3. Verify zero database & server backend mutation (SHA256 checksum matches, table invariants)
 * 4. Stress test rollback feasibility (isolated src/v8, legacy preservation, disaster recovery)
 * 5. Adversarial repository privacy scan (0 PAN, 0 Aadhaar, 0 unapproved FRN, portrait quarantined, ICMAI attribution)
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';

let totalAssertions = 0;
let passedAssertions = 0;
let failedAssertions = 0;
const failureDetails = [];

function assert(condition, testName, details = '') {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
    console.log(`  ✔ [PASS] ${testName}`);
  } else {
    failedAssertions++;
    console.error(`  ✖ [FAIL] ${testName}`);
    if (details) console.error(`     Details: ${details}`);
    failureDetails.push({ testName, details });
  }
}

function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex').toUpperCase();
}

function getAllFiles(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllFiles(full, list);
    } else if (entry.isFile()) {
      list.push(full);
    }
  }
  return list;
}

function getDirStats(dir, isRoot = false) {
  let count = 0;
  let bytes = 0;
  if (!fs.existsSync(dir)) return { count: 0, bytes: 0 };
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!isRoot) {
        const sub = getDirStats(fullPath, false);
        count += sub.count;
        bytes += sub.bytes;
      }
    } else if (entry.isFile()) {
      count++;
      bytes += fs.statSync(fullPath).size;
    }
  }
  return { count, bytes };
}

console.log('================================================================================');
console.log('  CHALLENGER M6-2: MIGRATION, ROLLBACK & PRIVACY EMPIRICAL HARNESS');
console.log('================================================================================\n');

// -----------------------------------------------------------------------------
// SUITE 1: AUDIT backup_v70_baseline/
// -----------------------------------------------------------------------------
console.log('▶ Suite 1: Audit of backup_v70_baseline/ Integrity & Invariants');

const baseDir = 'backup_v70_baseline';
assert(fs.existsSync(baseDir), 'backup_v70_baseline/ directory exists on local disk');

const allBackupFiles = getAllFiles(baseDir);
assert(allBackupFiles.length === 775, `Total file count in backup_v70_baseline is exactly 775 (found: ${allBackupFiles.length})`);

let totalBackupBytes = 0;
let zeroByteFiles = [];
for (const f of allBackupFiles) {
  const sz = fs.statSync(f).size;
  totalBackupBytes += sz;
  if (sz === 0) zeroByteFiles.push(f);
}

assert(
  totalBackupBytes >= 25000000 && totalBackupBytes <= 26000000,
  `Total physical size is ~24 MB (25,144,622 B, found: ${totalBackupBytes} B)`
);
assert(zeroByteFiles.length === 0, `Zero corrupted / 0-byte files in backup (found: ${zeroByteFiles.length})`);

// Directory inventory check
const expectedCounts = {
  root: 34,
  api: 2,
  content: 9,
  data: 2,
  functions: 2,
  public: 124,
  scripts: 417,
  server: 4,
  src: 83,
  supabase: 4,
  tests: 94
};

const rootStats = getDirStats(baseDir, true);
assert(rootStats.count === expectedCounts.root, `Root file count matches specification (34 files, found: ${rootStats.count})`);

for (const [sub, expectedCount] of Object.entries(expectedCounts)) {
  if (sub === 'root') continue;
  const subStats = getDirStats(path.join(baseDir, sub), false);
  assert(subStats.count === expectedCount, `${sub}/ directory file count matches specification (${expectedCount} files, found: ${subStats.count})`);
}

// -----------------------------------------------------------------------------
// SUITE 2: GIT REMOTE PUSH LOCKDOWN VERIFICATION
// -----------------------------------------------------------------------------
console.log('\n▶ Suite 2: Git Remote Push Lockdown & Network Isolation');

let remoteOutput = '';
try {
  remoteOutput = execSync('git remote -v', { encoding: 'utf8' });
} catch (e) {
  remoteOutput = e.stdout || e.message;
}

assert(remoteOutput.includes('origin\thttps://github.com/deswanth12/hobby-.git (fetch)'), 'Fetch URL correctly points to authoritative repository');
assert(remoteOutput.includes('origin\tDISABLED_NO_PUSH_ALLOWED (push)'), 'Push URL is strictly hard-locked to DISABLED_NO_PUSH_ALLOWED');

const gitConfigContent = fs.readFileSync('.git/config', 'utf8');
assert(gitConfigContent.includes('pushurl = DISABLED_NO_PUSH_ALLOWED'), '.git/config contains pushurl = DISABLED_NO_PUSH_ALLOWED invariant');

// Simulate git push dry run
let pushFailedAsExpected = false;
let pushErrorOutput = '';
try {
  execSync('git push --dry-run origin HEAD 2>&1', { encoding: 'utf8' });
} catch (err) {
  pushFailedAsExpected = true;
  pushErrorOutput = err.stdout || err.stderr || err.message;
}

assert(
  pushFailedAsExpected && pushErrorOutput.includes('DISABLED_NO_PUSH_ALLOWED'),
  'Simulated git push dry-run is physically rejected by git subsystem with fatal error',
  pushErrorOutput.trim().split('\n')[0]
);

// -----------------------------------------------------------------------------
// SUITE 3: ZERO DATABASE & SERVER BACKEND MUTATION
// -----------------------------------------------------------------------------
console.log('\n▶ Suite 3: Zero Database & Server Backend Mutation Proof');

const backendFiles = [
  { path: 'supabase/schema.sql', expectedSize: 24800, expectedHash: '86A2C8C73D63A58E2001AC2F6543C415DAA4E05A56067691A1CD72B19FB64A1C' },
  { path: 'supabase/migrations/20261029000000_init_schema.sql', expectedSize: 13858, expectedHash: '449AD4D0BCD4BE0E1016E82F40F1B05813129E3C447ED9C417CDE7ED7C2722A3' },
  { path: 'supabase/migrations/20261101000000_durable_persistence_and_distributed_security.sql', expectedSize: 6561, expectedHash: 'EB1F759709CA0A2C39BF449EE87B3144BEE7633891B8480DB0EB2A5BEDC1DEB7' },
  { path: 'supabase/migrations/20261102000000_schema_hardening_and_posts_persistence.sql', expectedSize: 5663, expectedHash: 'D6263352D04B98B07F1E8BE5C91ABFED209D1DCCE1E2BA8A172F1577D365CDB0' },
  { path: 'server/apiRouter.cjs', expectedSize: 37235, expectedHash: 'F4660B67C6A57485FD4E9ADEC85CDBF98A43526240B0D7DB4016D8F5D2E2D73E' },
  { path: 'server/db.cjs', expectedSize: 27991, expectedHash: '1FE2E99E526300B9C5361584377FCA3AA813832B82C2D3F8453FF94A18967537' },
  { path: 'server/durableStorage.cjs', expectedSize: 24965, expectedHash: '84C88A3573356918792C2C01CD0904DED434CF3E0C6AAEFBCF238221AB82166E' },
  { path: 'server/index.cjs', expectedSize: 43685, expectedHash: 'B4F3CC39C784ED060CE111052E36106FBD2EAE2C21A6CF5B7088475BCAB72092' },
];

for (const b of backendFiles) {
  const backupPath = path.join(baseDir, b.path);
  const activePath = b.path;
  
  assert(fs.existsSync(backupPath), `Backup file exists: ${b.path}`);
  assert(fs.existsSync(activePath), `Active file exists: ${b.path}`);
  
  const bBuf = fs.readFileSync(backupPath);
  const aBuf = fs.readFileSync(activePath);
  
  const bHash = sha256(bBuf);
  const aHash = sha256(aBuf);
  
  assert(bHash === b.expectedHash, `Backup SHA256 matches specification: ${b.path}`);
  assert(aHash === b.expectedHash, `Active SHA256 matches specification: ${b.path}`);
  assert(bHash === aHash, `Zero backend mutation: ${b.path} is 100% byte-for-byte identical`);
}

const dbPath = 'data/practice_db.json';
assert(fs.existsSync(dbPath), 'data/practice_db.json exists');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const backupDbPath = path.join(baseDir, 'data/practice_db.json');
assert(fs.existsSync(backupDbPath), 'backup_v70_baseline/data/practice_db.json exists');
const backupDbData = JSON.parse(fs.readFileSync(backupDbPath, 'utf8'));

assert(Array.isArray(dbData.services) && dbData.services.length === 6, `Core services intact (expected: 6, found: ${dbData.services?.length})`);
assert(Array.isArray(dbData.faqs) && dbData.faqs.length === 4, `Core statutory FAQs intact (expected: 4, found: ${dbData.faqs?.length})`);
assert(Array.isArray(dbData.enquiries) && dbData.enquiries.length === 5, `Client enquiries intact (expected: 5, found: ${dbData.enquiries?.length})`);

assert(
  JSON.stringify(dbData.settings) === JSON.stringify(backupDbData.settings),
  'Firm settings data is 100% identical between baseline snapshot and active practice_db.json'
);

// -----------------------------------------------------------------------------
// SUITE 4: STEP-BY-STEP ROLLBACK FEASIBILITY & MODULAR ISOLATION
// -----------------------------------------------------------------------------
console.log('\n▶ Suite 4: Step-by-Step Rollback Feasibility & Source Isolation');

const v8Files = getAllFiles('src/v8');
assert(v8Files.length === 52, `V8 rebuild files are strictly isolated inside src/v8/ (52 files, found: ${v8Files.length})`);

const backupSrcFiles = getAllFiles(path.join(baseDir, 'src')).map(f => path.relative(path.join(baseDir, 'src'), f));
assert(backupSrcFiles.length === 83, `Baseline snapshot contains exactly 83 legacy src files (found: ${backupSrcFiles.length})`);

let missingLegacyFiles = [];
let modifiedLegacyFiles = [];
for (const rel of backupSrcFiles) {
  const activePath = path.join('src', rel);
  if (!fs.existsSync(activePath)) {
    missingLegacyFiles.push(rel);
  } else {
    const bHash = sha256(fs.readFileSync(path.join(baseDir, 'src', rel)));
    const aHash = sha256(fs.readFileSync(activePath));
    if (bHash !== aHash) modifiedLegacyFiles.push(rel);
  }
}

assert(missingLegacyFiles.length === 0, `Zero legacy files deleted from src/ (found missing: ${missingLegacyFiles.length})`);
assert(
  modifiedLegacyFiles.length === 1 && modifiedLegacyFiles[0] === 'index.css',
  `Only src/index.css was modified to support Botanical Ledger tokens (found modified: ${modifiedLegacyFiles.join(', ')})`
);

// Disaster Recovery scripts existence and viability
assert(fs.existsSync('scripts/db-backup.mjs'), 'Disaster recovery export script exists (scripts/db-backup.mjs)');
assert(fs.existsSync('scripts/db-restore.mjs'), 'Disaster recovery restore script exists (scripts/db-restore.mjs)');
assert(fs.existsSync('tests/test_backup_restore_recovery.mjs'), 'Disaster recovery test runner exists (tests/test_backup_restore_recovery.mjs)');

// Execute DR test suite
let drTestPassed = false;
try {
  const drOutput = execSync('node tests/test_backup_restore_recovery.mjs', { encoding: 'utf8' });
  drTestPassed = drOutput.includes('DISASTER RECOVERY AUDIT: 100% PASSED');
} catch (e) {
  drTestPassed = false;
}
assert(drTestPassed, 'Disaster recovery runner tests/test_backup_restore_recovery.mjs passed 20/20 checks');

// -----------------------------------------------------------------------------
// SUITE 5: ADVERSARIAL PRIVACY & REGULATORY COMPLIANCE SCAN
// -----------------------------------------------------------------------------
console.log('\n▶ Suite 5: Adversarial Privacy, Portrait Quarantine & Attribution Scan');

// 5.1 PAN Scan
const targetDirs = ['src', 'public', 'data', 'dist', 'content', 'server'];
const rootMdFiles = fs.readdirSync('.').filter(f => f.endsWith('.md') && fs.statSync(f).isFile());

let scanFiles = [...rootMdFiles];
for (const d of targetDirs) {
  scanFiles.push(...getAllFiles(d));
}

const textExts = ['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.html', '.css', '.svg', '.yml', '.yaml', '.txt', '.csv'];
const textScanFiles = scanFiles.filter(f => textExts.includes(path.extname(f).toLowerCase()));

const panRegex = /\b([A-Z]{5}[0-9]{4}[A-Z])\b/g;
let panFound = [];

for (const file of textScanFiles) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = panRegex.exec(content)) !== null) {
    const word = match[1];
    const idx = match.index;
    const prev = content[idx - 1] || ' ';
    const next = content[idx + word.length] || ' ';
    if (/[0-9A-F]/.test(prev) || /[0-9A-F]/.test(next)) continue; // ignore hex hash substrings
    panFound.push({ file, word, line: content.slice(0, idx).split('\n').length });
  }
}

assert(panFound.length === 0, `Zero personal PAN numbers found across repository (found: ${panFound.length})`);

// 5.2 Aadhaar Scan
const aadhaarRegex = /\b(\d{4}\s\d{4}\s\d{4})\b/g;
let aadhaarFound = [];
for (const file of textScanFiles) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = aadhaarRegex.exec(content)) !== null) {
    aadhaarFound.push({ file, match: match[1], line: content.slice(0, match.index).split('\n').length });
  }
}

assert(aadhaarFound.length === 0, `Zero personal Aadhaar numbers found across repository (found: ${aadhaarFound.length})`);

// 5.3 Unapproved FRN Scan (e.g. 016147S) in active codebase
const activeCodeFiles = getAllFiles('src').filter(f => /\.(ts|tsx|js|jsx)$/.test(f));
let unapprovedFrnInCode = [];
for (const file of activeCodeFiles) {
  const content = fs.readFileSync(file, 'utf8');
  if (/016147S/i.test(content)) {
    unapprovedFrnInCode.push({ file, match: '016147S' });
  }
  // Check if any FRN registration number pattern is declared
  const frnNumMatch = content.match(/\bFRN[:\s\-#]*[0-9]{6}[A-Z]\b/i);
  if (frnNumMatch) {
    unapprovedFrnInCode.push({ file, match: frnNumMatch[0] });
  }
}
assert(unapprovedFrnInCode.length === 0, `Zero unapproved FRNs published in active code (found: ${unapprovedFrnInCode.length})`);

// 5.4 Partner Portrait Quarantine Scan in src/v8
const v8TsFiles = getAllFiles('src/v8').filter(f => /\.(ts|tsx)$/.test(f));
let partnerPhotoFound = [];
for (const file of v8TsFiles) {
  const content = fs.readFileSync(file, 'utf8');
  if (/<img[^>]*src=[^>]*kavitha-portrait/i.test(content) || /<img[^>]*src=[^>]*partner-photo/i.test(content)) {
    partnerPhotoFound.push(file);
  }
}
assert(partnerPhotoFound.length === 0, `Partner portrait is strictly quarantined; zero partner face images rendered in src/v8/ (found: ${partnerPhotoFound.length})`);

// 5.5 Neutral Crest Monogram & Practice Medallion Usage
const crestMonogramFile = 'src/v8/components/common/CrestMonogram.tsx';
assert(fs.existsSync(crestMonogramFile), 'Neutral CrestMonogram component exists (src/v8/components/common/CrestMonogram.tsx)');
const crestContent = fs.readFileSync(crestMonogramFile, 'utf8');
assert(crestContent.includes('KV') || crestContent.includes('KA'), 'CrestMonogram uses neutral KV / KA monogram');

// 5.6 CMA AIR 49 ICMAI Attribution Verification
let v8Air49Mentions = 0;
let v8Air49Misattributions = 0;

for (const file of v8TsFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const airMatches = content.match(/(AIR[\s\-]*49|Rank[\s\-]*49|49th[\s\-]*Rank)/gi) || [];
  if (airMatches.length > 0) {
    v8Air49Mentions += airMatches.length;
    // Check if any mention falsely attributes AIR 49 to ICAI
    const falseIcalAttributionRegex = /(ICAI\s+(AIR|Rank|All India Rank)\s*49|(AIR|Rank|All India Rank)\s*49\s+(in|by|from)\s+ICAI|ICAI\s+Intermediate\s+(AIR|Rank)\s*49)/gi;
    if (falseIcalAttributionRegex.test(content)) {
      v8Air49Misattributions++;
      console.error(`False attribution in ${file}`);
    }
  }
}

assert(v8Air49Mentions >= 15, `CMA AIR 49 prominently presented across V8 pages (found: ${v8Air49Mentions} mentions)`);
assert(v8Air49Misattributions === 0, `Zero misattributions to ICAI; all CMA AIR 49 credentials properly attributed to ICMAI (misattributions: ${v8Air49Misattributions})`);

// -----------------------------------------------------------------------------
// SUMMARY REPORT & VERDICT
// -----------------------------------------------------------------------------
console.log('\n================================================================================');
console.log('                          CHALLENGE SUMMARY REPORT                              ');
console.log('================================================================================');
console.log(`TOTAL EMPIRICAL ASSERTIONS : ${totalAssertions}`);
console.log(`PASSED                     : ${passedAssertions} (${((passedAssertions / totalAssertions) * 100).toFixed(1)}%)`);
console.log(`FAILED                     : ${failedAssertions}`);
console.log('--------------------------------------------------------------------------------');

if (failedAssertions === 0) {
  console.log('OVERALL VERDICT: APPROVE');
  console.log('Migration, rollback immutability, network lockdown, and privacy safeguards');
  console.log('are 100% verified and empirically sound.');
  process.exit(0);
} else {
  console.error('OVERALL VERDICT: REJECT');
  console.error('Failures detected during empirical challenge:');
  console.error(failureDetails);
  process.exit(1);
}
