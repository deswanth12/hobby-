#!/usr/bin/env node

/**
 * Kavitha & Associates - End-to-End Automated Test Runner
 *
 * Executes requirement-driven test suites across Tiers 1-4.
 *
 * Usage:
 *   node tests/e2e/run-e2e.mjs                 # Runs all tiers (default)
 *   node tests/e2e/run-e2e.mjs --tier=1        # Runs Tier 1: Feature Coverage
 *   node tests/e2e/run-e2e.mjs --tier=2        # Runs Tier 2: Boundary & Corner Cases
 *   node tests/e2e/run-e2e.mjs --tier=3        # Runs Tier 3: Pairwise Combinations
 *   node tests/e2e/run-e2e.mjs --tier=4        # Runs Tier 4: Real-World Scenarios
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { defaultHarness } from './helpers/test-harness.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse CLI options
const args = process.argv.slice(2);
let selectedTier = 'all';

for (const arg of args) {
  if (arg.startsWith('--tier=')) {
    selectedTier = arg.split('=')[1];
  } else if (arg === '-t' && args[args.indexOf(arg) + 1]) {
    selectedTier = args[args.indexOf(arg) + 1];
  } else if (arg === '--all') {
    selectedTier = 'all';
  }
}

console.log('\x1b[1m\x1b[35m===================================================================================\x1b[0m');
console.log('\x1b[1m\x1b[35m       KAVITHA & ASSOCIATES — AUTOMATED E2E TEST RUNNER (TIERS 1-4)               \x1b[0m');
console.log('\x1b[1m\x1b[35m===================================================================================\x1b[0m');
console.log(`\x1b[90mTarget: ${path.resolve('.')}\x1b[0m`);
console.log(`\x1b[90mSelected Execution Tier: ${selectedTier.toUpperCase()}\x1b[0m`);

const TIER_DIRS = {
  '1': path.join(__dirname, 'tier1-features'),
  '2': path.join(__dirname, 'tier2-boundaries'),
  '3': path.join(__dirname, 'tier3-pairwise'),
  '4': path.join(__dirname, 'tier4-application'),
};

async function getTestFilesForTier(tierNumber) {
  const dir = TIER_DIRS[tierNumber];
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.test.mjs'))
    .sort()
    .map(f => path.join(dir, f));
  return files;
}

async function main() {
  const tiersToRun = selectedTier === 'all' ? ['1', '2', '3', '4'] : [String(selectedTier)];
  const tierReports = [];
  let overallTotal = 0;
  let overallPassed = 0;
  let overallFailed = 0;
  let overallSkipped = 0;
  const allFailures = [];

  const overallStartTime = performance.now();

  for (const tier of tiersToRun) {
    if (!TIER_DIRS[tier]) {
      console.error(`\x1b[31mInvalid tier specified: ${tier}. Allowed: 1, 2, 3, 4, all\x1b[0m`);
      process.exit(1);
    }

    const testFiles = await getTestFilesForTier(tier);
    console.log(`\n\x1b[1m\x1b[34m===================================================================\x1b[0m`);
    console.log(`\x1b[1m\x1b[34m▶ RUNNING TIER ${tier} (${testFiles.length} test files found)\x1b[0m`);
    console.log(`\x1b[1m\x1b[34m===================================================================\x1b[0m`);

    defaultHarness.reset();

    for (const testFile of testFiles) {
      const fileUrl = pathToFileURL(testFile).href;
      await import(fileUrl);
    }

    const summary = await defaultHarness.run();
    tierReports.push({ tier, summary });

    overallTotal += summary.total;
    overallPassed += summary.passed;
    overallFailed += summary.failed;
    overallSkipped += summary.skipped;

    if (summary.failures && summary.failures.length > 0) {
      allFailures.push(...summary.failures.map(f => ({ ...f, tier })));
    }
  }

  const overallDuration = ((performance.now() - overallStartTime) / 1000).toFixed(2);

  // Final Aggregated Report
  console.log('\n\x1b[1m\x1b[35m===================================================================================\x1b[0m');
  console.log('\x1b[1m\x1b[35m                             E2E TEST RUN SUMMARY                                 \x1b[0m');
  console.log('\x1b[1m\x1b[35m===================================================================================\x1b[0m');

  for (const { tier, summary } of tierReports) {
    const tierName = tier === '1' ? 'Tier 1: Feature Coverage'
      : tier === '2' ? 'Tier 2: Boundary & Corner Cases'
      : tier === '3' ? 'Tier 3: Pairwise Combinations'
      : 'Tier 4: Real-World Scenarios';

    const statusColor = summary.failed === 0 ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
    console.log(`  ${tierName.padEnd(35)} : [${statusColor}] Passed: ${summary.passed}/${summary.total} (Failed: ${summary.failed})`);
  }

  console.log('-----------------------------------------------------------------------------------');
  console.log(`Total Tests Run : ${overallTotal}`);
  console.log(`Total Passed    : \x1b[32m${overallPassed}\x1b[0m`);
  console.log(`Total Failed    : \x1b[31m${overallFailed}\x1b[0m`);
  console.log(`Total Skipped   : ${overallSkipped}`);
  console.log(`Duration        : ${overallDuration}s`);
  console.log('===================================================================================');

  if (allFailures.length > 0) {
    console.log('\n\x1b[1m\x1b[31mFAILURES BREAKDOWN:\x1b[0m');
    allFailures.forEach((f, idx) => {
      console.log(`\n\x1b[31m[${idx + 1}] Tier ${f.tier} | ${f.suite} > ${f.test}\x1b[0m`);
      console.log(`    \x1b[91m${f.error}\x1b[0m`);
    });
    console.log('\n\x1b[31mResult: FAILED\x1b[0m\n');
    process.exit(1);
  } else {
    console.log('\n\x1b[1m\x1b[32mResult: ALL TESTS PASSED (100% SUCCESS)\x1b[0m\n');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('\x1b[31mFatal test runner error:\x1b[0m', err);
  process.exit(1);
});
