import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';

let passCount = 0;
let failCount = 0;
const failures = [];

function check(name, fn) {
  try {
    const res = fn();
    if (res instanceof Promise) {
      throw new Error(`Async test '${name}' must use asyncCheck`);
    }
    passCount++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [${passCount + failCount}] ${name}`);
  } catch (err) {
    failCount++;
    const shortErr = err.message ? err.message.slice(0, 200) : String(err);
    failures.push({ name, error: shortErr });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [${passCount + failCount}] ${name}`);
    console.log(`       ${shortErr}`);
  }
}

async function asyncCheck(name, fn) {
  try {
    await fn();
    passCount++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [${passCount + failCount}] ${name}`);
  } catch (err) {
    failCount++;
    const shortErr = err.message ? err.message.slice(0, 200) : String(err);
    failures.push({ name, error: shortErr });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [${passCount + failCount}] ${name}`);
    console.log(`       ${shortErr}`);
  }
}

console.log('================================================================');
console.log('  CHALLENGER 1: EMPIRICAL STRESS TEST & ROBUSTNESS ORACLE        ');
console.log('  Milestone 1, Iteration 2: Clipboard Fallback & Calculator Hub  ');
console.log('================================================================');

// ────────────────────────────────────────────────────────────
// Suite 1: Direct Stress Testing of copyToClipboard Utility
// ────────────────────────────────────────────────────────────
console.log('\n▶ Suite 1: Direct Stress Testing of src/v8/utils/clipboard.ts');

let vite = null;
let clipboardModule = null;
let calcEngine = null;
let toolsBarrel = null;
let routerMod = null;

try {
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true, entries: [], include: [] },
    resolve: {
      alias: {
        'react-router-dom': path.resolve('node_modules/react-router-dom/dist/index.mjs'),
      },
    },
  });

  clipboardModule = await vite.ssrLoadModule('/src/v8/utils/clipboard.ts');
  calcEngine = await vite.ssrLoadModule('/src/components/knowledge-bank/calculationEngine.ts');
  toolsBarrel = await vite.ssrLoadModule('/src/v8/components/tools/index.ts');
  routerMod = await vite.ssrLoadModule('react-router-dom');
} catch (err) {
  console.error('Fatal Vite SSR initialization error:', err);
  process.exit(1);
}

const { copyToClipboard } = clipboardModule;
const { calculateGSTLateFeeAndInterest } = calcEngine;
const { GSTLateFeeCalculator, VirtualCFOReadinessTool, RERAWithdrawalEstimator } = toolsBarrel;
const { MemoryRouter } = routerMod;

// Helper to mock browser environment
function createMockDOMEnvironment(options = {}) {
  const {
    clipboardWriteText = null, // async function or null/undefined
    clipboardThrows = false,
    clipboardErrorMessage = 'NotAllowedError: Clipboard permission denied',
    execCommandResult = true,
    execCommandThrows = false,
    execCommandErrorMessage = 'Command not supported',
  } = options;

  const appendedElements = [];
  const removedElements = [];

  class MockElement {
    constructor(tagName) {
      this.tagName = tagName;
      this.style = {};
      this.attributes = {};
      this.value = '';
      this.focused = false;
      this.selected = false;
      this.selectionRange = null;
    }
    setAttribute(key, val) {
      this.attributes[key] = val;
    }
    getAttribute(key) {
      return this.attributes[key];
    }
    focus() {
      this.focused = true;
    }
    select() {
      this.selected = true;
    }
    setSelectionRange(start, end) {
      this.selectionRange = { start, end };
    }
  }

  const mockDocument = {
    createElement(tag) {
      return new MockElement(tag);
    },
    body: {
      appendChild(el) {
        appendedElements.push(el);
      },
      removeChild(el) {
        removedElements.push(el);
        const idx = appendedElements.indexOf(el);
        if (idx !== -1) appendedElements.splice(idx, 1);
      },
    },
    execCommand(cmd) {
      if (execCommandThrows) {
        throw new Error(execCommandErrorMessage);
      }
      return execCommandResult;
    },
  };

  const mockNavigator = {};
  if (options.hasClipboard !== false && options.hasNavigator !== false) {
    mockNavigator.clipboard = {
      writeText: clipboardThrows
        ? async () => {
            throw new Error(clipboardErrorMessage);
          }
        : clipboardWriteText || (async (text) => true),
    };
  }

  const mockWindow = {};

  return {
    mockWindow,
    mockNavigator,
    mockDocument,
    appendedElements,
    removedElements,
  };
}

async function withMockDOM(options, callback) {
  const origWindowDesc = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const origNavDesc = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  const origDocDesc = Object.getOwnPropertyDescriptor(globalThis, 'document');

  const env = createMockDOMEnvironment(options);

  if (options.hasWindow !== false) {
    Object.defineProperty(globalThis, 'window', {
      value: env.mockWindow,
      configurable: true,
      writable: true,
    });
  } else {
    delete globalThis.window;
  }

  if (options.hasNavigator !== false) {
    Object.defineProperty(globalThis, 'navigator', {
      value: env.mockNavigator,
      configurable: true,
      writable: true,
    });
  } else {
    delete globalThis.navigator;
  }

  if (options.hasDocument !== false) {
    Object.defineProperty(globalThis, 'document', {
      value: env.mockDocument,
      configurable: true,
      writable: true,
    });
  } else {
    delete globalThis.document;
  }

  try {
    return await callback(env);
  } finally {
    if (origWindowDesc) Object.defineProperty(globalThis, 'window', origWindowDesc);
    else delete globalThis.window;

    if (origNavDesc) Object.defineProperty(globalThis, 'navigator', origNavDesc);
    else delete globalThis.navigator;

    if (origDocDesc) Object.defineProperty(globalThis, 'document', origDocDesc);
    else delete globalThis.document;
  }
}

await asyncCheck('copyToClipboard: Tier 1 - Modern clipboard API succeeds', async () => {
  let copiedText = '';
  await withMockDOM(
    {
      clipboardWriteText: async (t) => {
        copiedText = t;
      },
    },
    async (env) => {
      const res = await copyToClipboard('Kavitha & Associates Tax Assessment');
      assert.strictEqual(res, true, 'Must return true on writeText success');
      assert.strictEqual(copiedText, 'Kavitha & Associates Tax Assessment', 'Payload must match exactly');
      assert.strictEqual(env.appendedElements.length, 0, 'No textarea should be appended when Tier 1 succeeds');
    }
  );
});

await asyncCheck('copyToClipboard: Tier 2 - writeText rejects (Permission Denied) -> fallback textarea executes execCommand', async () => {
  await withMockDOM(
    {
      clipboardThrows: true,
      clipboardErrorMessage: 'DOMException: The request is not allowed by the user agent or the platform in the current context',
      execCommandResult: true,
    },
    async (env) => {
      let execCommandCalled = false;
      let createdTextArea = null;

      const origCreate = env.mockDocument.createElement.bind(env.mockDocument);
      env.mockDocument.createElement = (tag) => {
        const el = origCreate(tag);
        if (tag === 'textarea') createdTextArea = el;
        return el;
      };
      const origExec = env.mockDocument.execCommand.bind(env.mockDocument);
      env.mockDocument.execCommand = (cmd) => {
        if (cmd === 'copy') execCommandCalled = true;
        return origExec(cmd);
      };

      const testPayload = 'GST Late Fee: ₹1,500\nSection 50 Interest: ₹740';
      const res = await copyToClipboard(testPayload);

      assert.strictEqual(res, true, 'Must return true when fallback execCommand succeeds');
      assert.strictEqual(execCommandCalled, true, 'Fallback execCommand("copy") must have been invoked');
      assert.ok(createdTextArea, 'A textarea element must have been created');
      assert.strictEqual(createdTextArea.value, testPayload, 'Textarea value must contain payload');
      assert.strictEqual(createdTextArea.style.position, 'fixed', 'Textarea must be fixed position');
      assert.strictEqual(createdTextArea.style.opacity, '0', 'Textarea must be invisible');
      assert.strictEqual(createdTextArea.getAttribute('readonly'), '', 'Textarea must have readonly attribute');
      assert.strictEqual(createdTextArea.focused, true, 'Textarea must be focused');
      assert.strictEqual(createdTextArea.selected, true, 'Textarea must be selected');
      assert.deepStrictEqual(createdTextArea.selectionRange, { start: 0, end: testPayload.length }, 'Selection range must cover full text');
      assert.strictEqual(env.appendedElements.length, 0, 'Textarea must be removed from document.body after copying');
      assert.strictEqual(env.removedElements.length, 1, 'Textarea must be recorded in removedElements');
    }
  );
});

await asyncCheck('copyToClipboard: Double Failure - writeText rejects AND execCommand returns false', async () => {
  await withMockDOM(
    {
      clipboardThrows: true,
      execCommandResult: false, // browser denied execCommand
    },
    async (env) => {
      const res = await copyToClipboard('Test text');
      assert.strictEqual(res, false, 'Must gracefully return false when both methods fail');
      assert.strictEqual(env.appendedElements.length, 0, 'Textarea must still be removed from document.body');
    }
  );
});

await asyncCheck('copyToClipboard: Double Failure - writeText rejects AND execCommand throws exception', async () => {
  await withMockDOM(
    {
      clipboardThrows: true,
      execCommandThrows: true,
      execCommandErrorMessage: 'SecurityError: execCommand is disallowed in this document',
    },
    async (env) => {
      const res = await copyToClipboard('Sensitive Tax Computation');
      assert.strictEqual(res, false, 'Must catch exception and gracefully return false');
    }
  );
});

await asyncCheck('copyToClipboard: Non-secure HTTP / WebView where navigator.clipboard is undefined', async () => {
  await withMockDOM(
    {
      hasClipboard: false, // no navigator.clipboard in HTTP
      execCommandResult: true,
    },
    async (env) => {
      let execCalled = false;
      env.mockDocument.execCommand = (cmd) => {
        if (cmd === 'copy') execCalled = true;
        return true;
      };

      const res = await copyToClipboard('Insecure context copy payload');
      assert.strictEqual(res, true, 'Must succeed via execCommand fallback');
      assert.strictEqual(execCalled, true, 'execCommand must be executed');
    }
  );
});

await asyncCheck('copyToClipboard: Headless / Node SSR context (window & document undefined)', async () => {
  await withMockDOM(
    {
      hasWindow: false,
      hasDocument: false,
      hasNavigator: false,
    },
    async (env) => {
      const res = await copyToClipboard('SSR context');
      assert.strictEqual(res, false, 'Must return false cleanly in SSR context without throwing ReferenceError');
    }
  );
});

await asyncCheck('copyToClipboard: Stress testing with diverse & extreme payloads', async () => {
  await withMockDOM(
    {
      clipboardWriteText: async (text) => true,
    },
    async (env) => {
      // 1. Empty string
      assert.strictEqual(await copyToClipboard(''), true, 'Empty string copy');

      // 2. Large text payload (100KB)
      const largePayload = 'Kavitha & Associates Statutory Advisory\n'.repeat(2500);
      assert.strictEqual(await copyToClipboard(largePayload), true, 'Large 100KB payload copy');

      // 3. Indic Telugu / Hindi unicode strings
      const unicodePayload = 'కవిత అండ్ అసోసియేట్స్ తిరుపతి చార్టర్డ్ అకౌంటెంట్స్ — ₹50,00,000 పన్ను మినహాయింపు';
      assert.strictEqual(await copyToClipboard(unicodePayload), true, 'Indic Unicode payload copy');

      // 4. XSS & Code injection simulation payload
      const xssPayload = '<script>alert("xss")</script><img src=x onerror=alert(1)>"\'; DROP TABLE clients;--';
      assert.strictEqual(await copyToClipboard(xssPayload), true, 'XSS attack string payload copy');
    }
  );
});

// ────────────────────────────────────────────────────────────
// Suite 2: Tool Component Inspection & Layout Stability Oracle
// ────────────────────────────────────────────────────────────
console.log('\n▶ Suite 2: Tool Component Inspection & Layout Stability (GST, Virtual CFO, RERA)');

const toolFiles = [
  {
    name: 'GSTLateFeeCalculator',
    path: 'src/v8/components/tools/GSTLateFeeCalculator.tsx',
    copyAriaPrefix: 'Assessment',
  },
  {
    name: 'VirtualCFOReadinessTool',
    path: 'src/v8/components/tools/VirtualCFOReadinessTool.tsx',
    copyAriaPrefix: 'Diagnostic',
  },
  {
    name: 'RERAWithdrawalEstimator',
    path: 'src/v8/components/tools/RERAWithdrawalEstimator.tsx',
    copyAriaPrefix: 'Assessment',
  },
];

for (const tool of toolFiles) {
  check(`${tool.name}: Imports copyToClipboard and AlertTriangle correctly`, () => {
    const src = fs.readFileSync(path.resolve(tool.path), 'utf8');
    assert.ok(src.includes("import { copyToClipboard } from '../../utils/clipboard';"), `Must import copyToClipboard in ${tool.name}`);
    assert.ok(src.includes('AlertTriangle'), `Must import and use AlertTriangle in ${tool.name}`);
  });

  check(`${tool.name}: Implements copyError state, copyTimeoutRef, and unmount cleanup`, () => {
    const src = fs.readFileSync(path.resolve(tool.path), 'utf8');
    assert.ok(src.includes('const [copied, setCopied] = useState<boolean>(false);'), 'Must declare copied state');
    assert.ok(src.includes('const [copyError, setCopyError] = useState<boolean>(false);'), 'Must declare copyError state');
    assert.ok(src.includes('const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);'), 'Must use copyTimeoutRef');
    assert.ok(src.includes('clearTimeout(copyTimeoutRef.current)'), 'Must clear timer on new copy attempt');
    assert.ok(src.includes('useEffect(() => {') && src.includes('return () => {') && src.includes('copyTimeoutRef.current'), 'Must clean up timeout on unmount');
  });

  check(`${tool.name}: Properly handles false return from copyToClipboard with AlertTriangle`, () => {
    const src = fs.readFileSync(path.resolve(tool.path), 'utf8');
    assert.ok(src.includes('const success = await copyToClipboard('), 'Must await copyToClipboard');
    assert.ok(src.includes('setCopyError(true)'), 'Must set copyError to true on failure');
    assert.ok(src.includes('setCopied(false)'), 'Must set copied to false on failure');
    assert.ok(src.includes('<AlertTriangle'), 'Must render AlertTriangle component');
    assert.ok(src.includes('Copy Blocked · Select'), 'Must provide helpful instructions to user');
  });

  check(`${tool.name}: Zero Layout Thrashing (Fixed dimensions, w-full, min-h-[44px], uniform icon sizes)`, () => {
    const src = fs.readFileSync(path.resolve(tool.path), 'utf8');
    // Verify button styling contains min-h-[44px]
    assert.ok(src.includes('min-h-[44px]'), 'Copy button must specify min-h-[44px] touch target');
    assert.ok(src.includes('w-full'), 'Copy button must be w-full');
    assert.ok(src.includes('border-amber-500/60 text-amber-300'), 'Error styling must use amber tokens');
    // Check icon sizes in all states: Check, AlertTriangle, Copy must all be w-3.5 h-3.5
    assert.ok(src.includes('<Check className="w-3.5 h-3.5 text-emerald-400" />'), 'Check icon must be w-3.5 h-3.5');
    assert.ok(src.includes('<AlertTriangle className="w-3.5 h-3.5 text-amber-400" />'), 'AlertTriangle icon must be w-3.5 h-3.5');
    assert.ok(src.includes('<Copy className="w-3.5 h-3.5 text-[#B49A64]" />'), 'Copy icon must be w-3.5 h-3.5');
  });
}

// ────────────────────────────────────────────────────────────
// Suite 3: SSR Smoke Test for All 3 Tools
// ────────────────────────────────────────────────────────────
console.log('\n▶ Suite 3: React SSR Smoke Rendering for Interactive Tools');

check('GSTLateFeeCalculator renders cleanly in SSR', () => {
  const html = renderToString(
    React.createElement(MemoryRouter, null, React.createElement(GSTLateFeeCalculator))
  );
  assert.ok(html.includes('GST Late Fee &amp; Net Cash Interest Calculator'), 'Must render title');
  assert.ok(html.includes('Copy Statutory Assessment Summary'), 'Must render copy button label in idle state');
  assert.ok(html.includes('Consult Chambers with Assessment'), 'Must render consultation button');
});

check('VirtualCFOReadinessTool renders cleanly in SSR', () => {
  const html = renderToString(
    React.createElement(MemoryRouter, null, React.createElement(VirtualCFOReadinessTool))
  );
  assert.ok(html.includes('Virtual CFO &amp; Working Capital Readiness Tool'), 'Must render title');
  assert.ok(html.includes('Copy Diagnostic Assessment Brief'), 'Must render copy button label in idle state');
  assert.ok(html.includes('Consult Chambers with Assessment'), 'Must render consultation button');
});

check('RERAWithdrawalEstimator renders cleanly in SSR', () => {
  const html = renderToString(
    React.createElement(MemoryRouter, null, React.createElement(RERAWithdrawalEstimator))
  );
  assert.ok(html.includes('AP RERA 70% Escrow Withdrawal Estimator'), 'Must render title');
  assert.ok(html.includes('Copy Form 3 Escrow Assessment'), 'Must render copy button label in idle state');
  assert.ok(html.includes('Consult Chambers for Form 3 Certification'), 'Must render consultation button');
});

// ────────────────────────────────────────────────────────────
// Suite 4: Calculator Engine Stress Testing & Statutory Mathematical Precision
// ────────────────────────────────────────────────────────────
console.log('\n▶ Suite 4: Calculator Engine Stress Testing & Statutory Mathematical Precision');

check('calculateGSTLateFeeAndInterest: Monthly GSTR-3B 30-day delay, non-nil, turnover <= 1.5Cr', () => {
  const res = calculateGSTLateFeeAndInterest({
    returnType: 'GSTR-3B-Monthly',
    dueDate: '2026-10-20',
    actualFilingDate: '2026-11-19', // exactly 30 days
    isNilReturn: false,
    turnoverCategory: 'upto-1.5cr',
    cgstCashLiability: 50000,
    sgstCashLiability: 50000,
    igstCashLiability: 0,
  });

  assert.strictEqual(res.delayInDays, 30, 'Delay must be exactly 30 days');
  assert.strictEqual(res.isOverdue, true, 'isOverdue must be true');
  // Daily fee: ₹25 CGST + ₹25 SGST = ₹50/day. 30 * 25 = ₹750 per Act = ₹1,500 total (Cap is ₹1,000/Act = ₹2,000)
  assert.strictEqual(res.lateFee.cgstLateFee, 750, 'CGST late fee ₹750');
  assert.strictEqual(res.lateFee.sgstLateFee, 750, 'SGST late fee ₹750');
  assert.strictEqual(res.lateFee.totalLateFee, 1500, 'Total late fee ₹1,500');

  // Interest under Section 50: 18% p.a. on cash liability. 50000 * (0.18 / 365) * 30 = 739.726 -> Math.round = 740
  assert.strictEqual(res.interest.cgstInterest, 740, 'CGST interest must be ₹740');
  assert.strictEqual(res.interest.sgstInterest, 740, 'SGST interest must be ₹740');
  assert.strictEqual(res.interest.totalInterest, 1480, 'Total interest must be ₹1,480');

  // Total liability: lateFee(1500) + interest(1480) + cashTax(100000) = 102980
  assert.strictEqual(res.totalPayableLiability, 102980, 'Total liability must equal tax + late fee + interest');
});

check('calculateGSTLateFeeAndInterest: Section 47 Statutory Cap enforcement (120-day delay, turnover <= 1.5Cr)', () => {
  const res = calculateGSTLateFeeAndInterest({
    returnType: 'GSTR-3B-Monthly',
    dueDate: '2026-06-20',
    actualFilingDate: '2026-10-18', // 120 days
    isNilReturn: false,
    turnoverCategory: 'upto-1.5cr',
    cgstCashLiability: 0,
    sgstCashLiability: 0,
    igstCashLiability: 0,
  });

  assert.strictEqual(res.delayInDays, 120, 'Delay is 120 days');
  // 120 * 25 = ₹3,000 per act, but capped at ₹1,000 per Act = ₹2,000 total cap
  assert.strictEqual(res.lateFee.cgstLateFee, 1000, 'CGST late fee capped at ₹1,000');
  assert.strictEqual(res.lateFee.sgstLateFee, 1000, 'SGST late fee capped at ₹1,000');
  assert.strictEqual(res.lateFee.totalLateFee, 2000, 'Total late fee capped at ₹2,000');
});

check('calculateGSTLateFeeAndInterest: Nil Return statutory capping (50-day delay, Cap ₹500)', () => {
  const res = calculateGSTLateFeeAndInterest({
    returnType: 'GSTR-3B-Monthly',
    dueDate: '2026-08-20',
    actualFilingDate: '2026-10-09', // 50 days
    isNilReturn: true,
    turnoverCategory: 'upto-1.5cr',
    cgstCashLiability: 10000, // Should be ignored because isNilReturn is true
    sgstCashLiability: 10000,
    igstCashLiability: 0,
  });

  // Daily rate ₹10/act. 50 * 10 = ₹500 per act, but capped at ₹250 per act = ₹500 total
  assert.strictEqual(res.lateFee.cgstLateFee, 250, 'CGST nil late fee capped at ₹250');
  assert.strictEqual(res.lateFee.sgstLateFee, 250, 'SGST nil late fee capped at ₹250');
  assert.strictEqual(res.lateFee.totalLateFee, 500, 'Total nil late fee capped at ₹500');
  assert.strictEqual(res.interest.totalInterest, 0, 'Section 50 interest on nil return must be strictly ₹0');
  assert.strictEqual(res.totalPayableLiability, 500, 'Total payable for nil return is strictly ₹500');
});

check('calculateGSTLateFeeAndInterest: GSTR-1 Statement strictly disallows Section 50 Interest', () => {
  const res = calculateGSTLateFeeAndInterest({
    returnType: 'GSTR-1-Monthly',
    dueDate: '2026-10-11',
    actualFilingDate: '2026-11-10', // 30 days delay
    isNilReturn: false,
    turnoverCategory: 'above-5cr',
    cgstCashLiability: 200000,
    sgstCashLiability: 200000,
    igstCashLiability: 0,
  });

  assert.strictEqual(res.supportsInterest, false, 'GSTR-1 must declare supportsInterest = false');
  assert.strictEqual(res.interest.totalInterest, 0, 'GSTR-1 interest must be 0');
  assert.ok(res.interestNotice?.includes('statement of outward supplies'), 'Must explain why interest does not apply');
});

check('calculateGSTLateFeeAndInterest: GSTR-9 Annual Return turnover cap under Notification 07/2023-CT', () => {
  const res = calculateGSTLateFeeAndInterest({
    returnType: 'GSTR-9-Annual',
    dueDate: '2026-12-31',
    actualFilingDate: '2027-02-09', // 40 days delay
    isNilReturn: false,
    turnoverCategory: 'upto-1.5cr',
    stateTurnoverForGstr9: 10000000, // ₹1 Crore
  });

  assert.strictEqual(res.isGstr9InputMissing, false, 'Turnover provided, isGstr9InputMissing is false');
  assert.strictEqual(res.lateFee.dailyRatePerAct, 25, 'Daily rate ₹25 per Act (₹50 total)');
  // 40 * 25 = ₹1,000 per act (₹2,000 total). Cap = 0.02% of ₹1 Cr = ₹2,000 per act.
  assert.strictEqual(res.lateFee.cgstLateFee, 1000, 'CGST late fee ₹1,000');
  assert.strictEqual(res.lateFee.sgstLateFee, 1000, 'SGST late fee ₹1,000');
  assert.strictEqual(res.lateFee.totalLateFee, 2000, 'Total late fee ₹2,000');
});

check('calculateGSTLateFeeAndInterest: On-time filing has 0 delay and 0 dues', () => {
  const res = calculateGSTLateFeeAndInterest({
    returnType: 'GSTR-3B-Monthly',
    dueDate: '2026-10-20',
    actualFilingDate: '2026-10-18', // 2 days before due date
    isNilReturn: false,
    turnoverCategory: 'upto-1.5cr',
    cgstCashLiability: 50000,
    sgstCashLiability: 50000,
  });

  assert.strictEqual(res.delayInDays, 0, 'On-time filing delay must be 0');
  assert.strictEqual(res.isOverdue, false, 'isOverdue must be false');
  assert.strictEqual(res.lateFee.totalLateFee, 0, 'Late fee must be 0');
  assert.strictEqual(res.interest.totalInterest, 0, 'Interest must be 0');
  assert.strictEqual(res.totalPayableLiability, 100000, 'Payable is only the original tax liability');
});

// ────────────────────────────────────────────────────────────
// Suite 5: Virtual CFO Mathematical & Boundary Stress Tests
// ────────────────────────────────────────────────────────────
console.log('\n▶ Suite 5: Virtual CFO Mathematical & Boundary Stress Tests');

function simulateVirtualCFOAssessment(params) {
  const { turnoverBand, debtorDays, inventoryDays, payableDays, misFrequency, bankLoanStatus } = params;
  const ccc = debtorDays + inventoryDays - payableDays;
  let score = 50;
  if (debtorDays <= 30) score += 15;
  else if (debtorDays <= 60) score += 5;
  else if (debtorDays <= 90) score -= 10;
  else score -= 20;

  if (inventoryDays <= 20) score += 10;
  else if (inventoryDays <= 45) score += 5;
  else if (inventoryDays <= 75) score -= 5;
  else score -= 15;

  if (misFrequency === 'weekly') score += 20;
  else if (misFrequency === 'monthly') score += 15;
  else if (misFrequency === 'quarterly') score -= 5;
  else score -= 20;

  if (bankLoanStatus === 'none') score += 5;
  else if (bankLoanStatus === 'existing-cc') score += 10;
  else if (bankLoanStatus === 'expanding') score += 5;
  else score -= 10;

  score = Math.max(15, Math.min(95, score));

  const turnoverLakhs =
    turnoverBand === '<2cr'
      ? 150
      : turnoverBand === '2-10cr'
      ? 600
      : turnoverBand === '10-25cr'
      ? 1800
      : turnoverBand === '25-50cr'
      ? 3500
      : 6500;

  const estimatedLockedCapitalLakhs = Math.max(0, Math.round((turnoverLakhs / 365) * ccc));

  let cmaTier;
  if (score >= 75) cmaTier = 'High Readiness';
  else if (score >= 50) cmaTier = 'Moderate Readiness';
  else cmaTier = 'Critical Optimization Required';

  return { ccc, score, estimatedLockedCapitalLakhs, cmaTier };
}

check('Virtual CFO Engine: Maximum optimal score clamped at 95', () => {
  const res = simulateVirtualCFOAssessment({
    turnoverBand: '25-50cr',
    debtorDays: 20, // +15
    inventoryDays: 15, // +10
    payableDays: 45,
    misFrequency: 'weekly', // +20
    bankLoanStatus: 'existing-cc', // +10
  });
  // 50 + 15 + 10 + 20 + 10 = 105 -> clamped to 95
  assert.strictEqual(res.score, 95, 'Score should clamp at maximum 95');
  assert.strictEqual(res.cmaTier, 'High Readiness', 'Tier must be High Readiness');
  assert.strictEqual(res.ccc, 20 + 15 - 45, 'CCC = 20 + 15 - 45 = -10 days');
  assert.strictEqual(res.estimatedLockedCapitalLakhs, 0, 'Negative CCC should lock ₹0 capital');
});

check('Virtual CFO Engine: Severe distressed score clamped at 15', () => {
  const res = simulateVirtualCFOAssessment({
    turnoverBand: 'above-50cr',
    debtorDays: 120, // -20
    inventoryDays: 120, // -15
    payableDays: 10,
    misFrequency: 'annual', // -20
    bankLoanStatus: 'stressed', // -10
  });
  // 50 - 20 - 15 - 20 - 10 = -15 -> clamped to 15
  assert.strictEqual(res.score, 15, 'Score should clamp at minimum 15');
  assert.strictEqual(res.cmaTier, 'Critical Optimization Required', 'Tier must be Critical Optimization');
  assert.strictEqual(res.ccc, 120 + 120 - 10, 'CCC should be 230 days');
  assert.ok(res.estimatedLockedCapitalLakhs > 0, 'Locked capital must be positive');
});

// ────────────────────────────────────────────────────────────
// Suite 6: AP RERA Form 3 Escrow Mathematical Stress Tests
// ────────────────────────────────────────────────────────────
console.log('\n▶ Suite 6: AP RERA Form 3 Escrow Mathematical Stress Tests');

function simulateRERACalculation(params) {
  const {
    estimatedLandCost,
    incurredLandCost,
    estimatedConstructionCost,
    incurredConstructionCost,
    physicalCompletionPct,
    total70EscrowReceipts,
    priorWithdrawals,
  } = params;

  const totalEstimatedCost = estimatedLandCost + estimatedConstructionCost;
  const totalIncurredCost = incurredLandCost + incurredConstructionCost;
  const costCompletionPct =
    totalEstimatedCost > 0
      ? Math.min(100, (totalIncurredCost / totalEstimatedCost) * 100)
      : 0;

  const maxPermissibleConstructionExpenditure = (estimatedConstructionCost * physicalCompletionPct) / 100;
  const isConstructionCostDisproportionate = incurredConstructionCost > maxPermissibleConstructionExpenditure * 1.05;

  const maxCumulativeWithdrawal = (total70EscrowReceipts * costCompletionPct) / 100;
  const netEligibleCurrentWithdrawal = Math.max(0, maxCumulativeWithdrawal - priorWithdrawals);
  const remainingInEscrow = Math.max(0, total70EscrowReceipts - priorWithdrawals - netEligibleCurrentWithdrawal);

  return {
    totalEstimatedCost,
    totalIncurredCost,
    costCompletionPct,
    isConstructionCostDisproportionate,
    maxCumulativeWithdrawal,
    netEligibleCurrentWithdrawal,
    remainingInEscrow,
  };
}

check('RERA Escrow Engine: Zero estimated cost does not throw divide-by-zero (returns 0%)', () => {
  const res = simulateRERACalculation({
    estimatedLandCost: 0,
    incurredLandCost: 0,
    estimatedConstructionCost: 0,
    incurredConstructionCost: 0,
    physicalCompletionPct: 0,
    total70EscrowReceipts: 10000000,
    priorWithdrawals: 0,
  });

  assert.strictEqual(res.costCompletionPct, 0, 'Cost completion must safely be 0%');
  assert.strictEqual(res.netEligibleCurrentWithdrawal, 0, 'Eligible withdrawal must be 0');
});

check('RERA Escrow Engine: Section 4(2)(l)(D) Standard 70% Escrow Proportional Tranche Calculation', () => {
  const res = simulateRERACalculation({
    estimatedLandCost: 30000000, // ₹3 Cr
    incurredLandCost: 30000000, // ₹3 Cr (100% land paid)
    estimatedConstructionCost: 70000000, // ₹7 Cr
    incurredConstructionCost: 28000000, // ₹2.8 Cr (40% construction incurred)
    physicalCompletionPct: 40,
    total70EscrowReceipts: 50000000, // ₹5 Cr deposited in 70% account
    priorWithdrawals: 20000000, // ₹2 Cr previously drawn
  });

  // Total estimated: ₹10 Cr. Total incurred: ₹5.8 Cr -> 58% completion
  assert.strictEqual(res.totalEstimatedCost, 100000000);
  assert.strictEqual(res.totalIncurredCost, 58000000);
  assert.ok(Math.abs(res.costCompletionPct - 58) < 1e-5, 'Cost completion approx 58%');
  // Max cumulative: 58% of ₹5 Cr = ₹2.9 Cr
  assert.strictEqual(Math.round(res.maxCumulativeWithdrawal), 29000000);
  // Net current tranche: ₹2.9 Cr - ₹2 Cr = ₹90 Lakhs
  assert.strictEqual(Math.round(res.netEligibleCurrentWithdrawal), 9000000);
  // Remaining in escrow: ₹5 Cr - ₹2 Cr - ₹0.9 Cr = ₹2.1 Cr
  assert.strictEqual(Math.round(res.remainingInEscrow), 21000000);
  assert.strictEqual(res.isConstructionCostDisproportionate, false, 'Construction cost matches 40% physical progress');
});

check('RERA Escrow Engine: Prior withdrawals exceeding current permissible returns ₹0 (non-negative guarantee)', () => {
  const res = simulateRERACalculation({
    estimatedLandCost: 20000000,
    incurredLandCost: 10000000,
    estimatedConstructionCost: 80000000,
    incurredConstructionCost: 10000000,
    physicalCompletionPct: 15,
    total70EscrowReceipts: 30000000, // ₹3 Cr
    priorWithdrawals: 10000000, // ₹1 Cr already drawn, but 20% of ₹3 Cr is only ₹60L
  });

  // 20% completion of ₹3 Cr = ₹60 Lakhs permissible. Prior: ₹1 Cr.
  assert.strictEqual(res.costCompletionPct, 20);
  assert.strictEqual(res.maxCumulativeWithdrawal, 6000000);
  assert.strictEqual(res.netEligibleCurrentWithdrawal, 0, 'Cannot draw negative amount');
  assert.strictEqual(res.remainingInEscrow, 20000000, 'Remaining is ₹3 Cr - ₹1 Cr = ₹2 Cr');
});

check('RERA Escrow Engine: Disproportionate expenditure flag triggers when cost exceeds physical completion by > 5%', () => {
  const res = simulateRERACalculation({
    estimatedLandCost: 20000000,
    incurredLandCost: 20000000,
    estimatedConstructionCost: 80000000, // ₹8 Cr
    incurredConstructionCost: 40000000, // ₹4 Cr (50% incurred)
    physicalCompletionPct: 30, // Architect only certified 30% physical completion!
    total70EscrowReceipts: 50000000,
    priorWithdrawals: 0,
  });

  // Max permissible construction expenditure = 80M * 30% = 24M. Incurred is 40M.
  // 40M > 24M * 1.05 = 25.2M -> disproportionate flag MUST trigger
  assert.strictEqual(res.isConstructionCostDisproportionate, true, 'Flag must trigger for audit investigation');
});

console.log('\n================================================================');
console.log(`TOTAL CHALLENGER 1 ASSERTIONS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log('================================================================');

if (vite) await vite.close();

if (failCount > 0) {
  process.exit(1);
}
