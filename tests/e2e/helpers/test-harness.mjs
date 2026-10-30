/**
 * E2E Test Harness for Kavitha & Associates
 * Lightweight, zero-dependency test runner supporting synchronous & asynchronous tests,
 * nested describe suites, rich assertions, and TAP/pretty formatted output.
 */

class TestHarness {
  constructor() {
    this.suites = [];
    this.currentSuite = null;
    this.stats = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      startTime: null,
      endTime: null,
    };
    this.failures = [];
  }

  describe(name, fn) {
    const parentSuite = this.currentSuite;
    const suite = {
      name,
      tests: [],
      parent: parentSuite,
      beforeAllHooks: [],
      afterAllHooks: [],
      beforeEachHooks: [],
      afterEachHooks: [],
    };

    if (parentSuite) {
      parentSuite.tests.push({ isSuite: true, suite });
    } else {
      this.suites.push(suite);
    }

    this.currentSuite = suite;
    try {
      fn();
    } finally {
      this.currentSuite = parentSuite;
    }
  }

  test(name, fn, options = {}) {
    if (!this.currentSuite) {
      this.describe('Default Suite', () => this.test(name, fn, options));
      return;
    }

    this.currentSuite.tests.push({
      isSuite: false,
      name,
      fn,
      skip: options.skip || false,
    });
  }

  it(name, fn, options = {}) {
    this.test(name, fn, options);
  }

  beforeAll(fn) {
    if (this.currentSuite) this.currentSuite.beforeAllHooks.push(fn);
  }

  afterAll(fn) {
    if (this.currentSuite) this.currentSuite.afterAllHooks.push(fn);
  }

  beforeEach(fn) {
    if (this.currentSuite) this.currentSuite.beforeEachHooks.push(fn);
  }

  afterEach(fn) {
    if (this.currentSuite) this.currentSuite.afterEachHooks.push(fn);
  }

  async runSuite(suite, prefix = '') {
    const fullTitle = prefix ? `${prefix} > ${suite.name}` : suite.name;
    console.log(`\n\x1b[36m▶ Suite: ${fullTitle}\x1b[0m`);

    for (const hook of suite.beforeAllHooks) {
      await hook();
    }

    for (const item of suite.tests) {
      if (item.isSuite) {
        await this.runSuite(item.suite, fullTitle);
      } else {
        this.stats.total++;
        if (item.skip) {
          this.stats.skipped++;
          console.log(`  \x1b[33m- [SKIP] ${item.name}\x1b[0m`);
          continue;
        }

        for (const hook of suite.beforeEachHooks) {
          await hook();
        }

        const t0 = performance.now();
        try {
          await item.fn();
          const duration = (performance.now() - t0).toFixed(2);
          this.stats.passed++;
          console.log(`  \x1b[32m✔ [PASS]\x1b[0m ${item.name} \x1b[90m(${duration}ms)\x1b[0m`);
        } catch (err) {
          const duration = (performance.now() - t0).toFixed(2);
          this.stats.failed++;
          const failureInfo = {
            suite: fullTitle,
            test: item.name,
            error: err.message || String(err),
            stack: err.stack,
          };
          this.failures.push(failureInfo);
          console.log(`  \x1b[31m✖ [FAIL]\x1b[0m ${item.name} \x1b[90m(${duration}ms)\x1b[0m`);
          console.log(`    \x1b[31mError: ${err.message}\x1b[0m`);
        }

        for (const hook of suite.afterEachHooks) {
          await hook();
        }
      }
    }

    for (const hook of suite.afterAllHooks) {
      await hook();
    }
  }

  async run() {
    this.stats.startTime = Date.now();
    for (const suite of this.suites) {
      await this.runSuite(suite);
    }
    this.stats.endTime = Date.now();
    return this.getSummary();
  }

  getSummary() {
    const elapsed = ((this.stats.endTime - this.stats.startTime) / 1000).toFixed(2);
    return {
      total: this.stats.total,
      passed: this.stats.passed,
      failed: this.stats.failed,
      skipped: this.stats.skipped,
      elapsedSeconds: elapsed,
      failures: this.failures,
      success: this.stats.failed === 0,
    };
  }

  reset() {
    this.suites = [];
    this.currentSuite = null;
    this.stats = { total: 0, passed: 0, failed: 0, skipped: 0, startTime: null, endTime: null };
    this.failures = [];
  }
}

// Global instance for convenience
const defaultHarness = new TestHarness();

export const describe = (name, fn) => defaultHarness.describe(name, fn);
export const it = (name, fn, options) => defaultHarness.it(name, fn, options);
export const test = (name, fn, options) => defaultHarness.test(name, fn, options);
export const beforeAll = (fn) => defaultHarness.beforeAll(fn);
export const afterAll = (fn) => defaultHarness.afterAll(fn);
export const beforeEach = (fn) => defaultHarness.beforeEach(fn);
export const afterEach = (fn) => defaultHarness.afterEach(fn);
export const runTests = () => defaultHarness.run();
export const resetTests = () => defaultHarness.reset();
export { TestHarness, defaultHarness };

// Assertion utilities
export const assert = {
  strictEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(message || `Expected strictly equal:\n  Actual:   ${JSON.stringify(actual)}\n  Expected: ${JSON.stringify(expected)}`);
    }
  },
  notStrictEqual(actual, expected, message) {
    if (actual === expected) {
      throw new Error(message || `Expected actual NOT to strictly equal ${JSON.stringify(expected)}`);
    }
  },
  deepStrictEqual(actual, expected, message) {
    const actStr = JSON.stringify(actual);
    const expStr = JSON.stringify(expected);
    if (actStr !== expStr) {
      throw new Error(message || `Expected deep equality:\n  Actual:   ${actStr}\n  Expected: ${expStr}`);
    }
  },
  ok(value, message) {
    if (!value) {
      throw new Error(message || `Expected truthy value, got ${JSON.stringify(value)}`);
    }
  },
  match(str, regex, message) {
    if (typeof str !== 'string' || !regex.test(str)) {
      throw new Error(message || `Expected string to match ${regex}:\n  Got: ${JSON.stringify(str)}`);
    }
  },
  doesNotMatch(str, regex, message) {
    if (typeof str === 'string' && regex.test(str)) {
      throw new Error(message || `Expected string NOT to match ${regex}:\n  Got: ${JSON.stringify(str)}`);
    }
  },
  notMatch(str, regex, message) {
    this.doesNotMatch(str, regex, message);
  },
  includes(container, item, message) {
    if (!container || !container.includes(item)) {
      throw new Error(message || `Expected collection/string to include ${JSON.stringify(item)}`);
    }
  },
  notIncludes(container, item, message) {
    if (container && container.includes(item)) {
      throw new Error(message || `Expected collection/string NOT to include ${JSON.stringify(item)}`);
    }
  },
  throws(fn, expectedRegexOrMessage, message) {
    let threw = false;
    let thrownError = null;
    try {
      fn();
    } catch (err) {
      threw = true;
      thrownError = err;
    }
    if (!threw) {
      throw new Error(message || `Expected function to throw an error, but it succeeded.`);
    }
    if (expectedRegexOrMessage instanceof RegExp) {
      if (!expectedRegexOrMessage.test(thrownError.message)) {
        throw new Error(message || `Expected error message to match ${expectedRegexOrMessage}, got "${thrownError.message}"`);
      }
    }
  },
  doesNotThrow(fn, message) {
    try {
      fn();
    } catch (err) {
      throw new Error(message || `Expected function NOT to throw, but threw: ${err.message}`);
    }
  },
  fail(message) {
    throw new Error(message || 'Explicit test failure triggered.');
  },
};
