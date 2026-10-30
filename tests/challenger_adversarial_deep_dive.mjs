import vm from 'node:vm';
import { onRequestGet as callbackGet } from '../functions/api/callback.js';

console.log('========================================================================');
console.log('  EMPIRICAL CHALLENGER: DEEP ADVERSARIAL ATTACK & BOUNDARY HARNESS      ');
console.log('========================================================================\n');

let totalTests = 0;
let passedTests = 0;
const failures = [];

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [Test ${totalTests.toString().padStart(2, '0')}] ${testName}`);
  } else {
    failures.push({ testName, details });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [Test ${totalTests.toString().padStart(2, '0')}] ${testName}`);
    if (details) console.log(`       Details: ${details}`);
  }
}

// Helper to run the emitted callback script inside a VM sandbox
async function evaluateEmittedScript(options = {}) {
  const {
    requestUrl = 'https://kavithaassociates.com/api/callback?code=test_code&state=test_state',
    token = 'ghp_secret_access_token_12345',
    username = 'authorized_admin',
    windowLocationOrigin = 'https://kavithaassociates.com',
    errorDesc = null
  } = options;

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    if (url.includes('access_token')) {
      return new Response(JSON.stringify({ access_token: token }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (url.includes('api.github.com/user')) {
      return new Response(JSON.stringify({ login: username }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response('Not found', { status: 404 });
  };

  let targetUrl = requestUrl;
  if (errorDesc) {
    targetUrl = `https://kavithaassociates.com/api/callback?error=test_error&error_description=${encodeURIComponent(errorDesc)}`;
  }

  const req = new Request(targetUrl, {
    headers: { 'Cookie': 'ka_oauth_state=test_state' }
  });

  const res = await callbackGet({
    request: req,
    env: { GITHUB_CLIENT_ID: 'cid', GITHUB_CLIENT_SECRET: 'sec', ALLOWED_USERS: username }
  });

  const html = await res.text();
  globalThis.fetch = originalFetch;

  // Extract <script>...</script>
  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!scriptMatch) throw new Error('No script block found in HTML response');
  const scriptCode = scriptMatch[1];

  // Syntax check
  let parseError = null;
  try {
    new Function(scriptCode);
  } catch (err) {
    parseError = err;
  }

  const sentMessages = [];
  const registeredListeners = {};
  const timers = [];

  const mockOpener = {
    postMessage: (data, targetOrigin) => {
      sentMessages.push({ recipient: 'opener', data, targetOrigin });
    }
  };

  const sandbox = {
    window: {
      opener: mockOpener,
      location: { origin: windowLocationOrigin },
      addEventListener: (evt, handler) => { registeredListeners[evt] = handler; },
      removeEventListener: () => {},
      close: () => { sentMessages.push({ action: 'window.close' }); }
    },
    document: {
      getElementById: (id) => ({ id, textContent: '' })
    },
    console: { log: () => {}, warn: () => {}, error: () => {} },
    setTimeout: (fn, delay) => {
      const id = timers.length;
      timers.push({ id, fn, delay, executed: false });
      return id;
    },
    clearTimeout: () => {}
  };

  const context = vm.createContext(sandbox);
  if (!parseError) {
    vm.runInContext(scriptCode, context);
  }

  // Also extract isOriginAllowed for direct unit inspection
  let isOriginAllowedFn = null;
  if (!parseError) {
    try {
      const unwrapped = scriptCode
        .replace(/^\s*\(function\s*\(\)\s*\{/, '')
        .replace(/\}\)\(\);\s*$/, '')
        + '\nreturn isOriginAllowed;';
      const factory = new Function('window', 'document', unwrapped);
      isOriginAllowedFn = factory(sandbox.window, sandbox.document);
    } catch (e) {
      console.error('Extraction error:', e.message);
    }
  }

  return {
    html,
    scriptCode,
    parseError,
    sentMessages,
    timers,
    isOriginAllowedFn,
    testOriginHandshake: (origin) => {
      const countBefore = sentMessages.length;
      if (registeredListeners['message']) {
        registeredListeners['message']({ origin, data: 'authorizing:github' });
      }
      return sentMessages.slice(countBefore);
    }
  };
}

// -----------------------------------------------------------------------------
// ADVERSARIAL SUITE 1: TRAILING SLASH VARIATIONS
// -----------------------------------------------------------------------------
console.log('\n--- 1. Trailing Slashes Variations Stress-Testing ---');

const TRAILING_SLASH_CASES = [
  { origin: 'https://kavithaassociates.com/', expected: true, desc: 'Single trailing slash on canonical domain' },
  { origin: 'https://kavithaassociates.com///', expected: true, desc: 'Multiple trailing slashes on canonical domain' },
  { origin: 'https://www.kavithaassociates.com/', expected: true, desc: 'Single trailing slash on www domain' },
  { origin: 'https://www.kavithaassociates.com/////', expected: true, desc: 'Five trailing slashes on www domain' },
  { origin: 'http://localhost:5173/', expected: true, desc: 'Trailing slash on localhost:5173' },
  { origin: 'http://localhost:5173///', expected: true, desc: 'Multiple trailing slashes on localhost:5173' },
  { origin: 'http://127.0.0.1:8788/', expected: true, desc: 'Trailing slash on 127.0.0.1:8788' },
  { origin: 'https://preview-123.kavitha-and-associates.pages.dev/', expected: true, desc: 'Trailing slash on preview pages.dev' },
  { origin: 'https://kavithaassociates.com/admin', expected: false, desc: 'Path component /admin (not trailing slash)' },
  { origin: 'https://kavithaassociates.com/evil///', expected: false, desc: 'Path component /evil with trailing slashes' },
  { origin: 'https://attacker.com/', expected: false, desc: 'Attacker domain with trailing slash' },
  { origin: 'https://attacker.com///', expected: false, desc: 'Attacker domain with multiple trailing slashes' }
];

{
  const evalResult = await evaluateEmittedScript();
  assert(evalResult.parseError === null, 'Script parses cleanly without SyntaxError for trailing slash tests');
  const isAllowed = evalResult.isOriginAllowedFn;

  for (const { origin, expected, desc } of TRAILING_SLASH_CASES) {
    const allowed = isAllowed(origin);
    assert(allowed === expected, `[Trailing Slash: ${desc}] isOriginAllowed('${origin}') === ${expected}`);

    // Test handshake delivery on fresh script instance
    const freshInstance = await evaluateEmittedScript();
    const handshakeMsgs = freshInstance.testOriginHandshake(origin);
    const tokenDelivered = handshakeMsgs.some(m => m.targetOrigin === origin && m.data.includes('ghp_secret_access_token_12345'));
    if (expected) {
      assert(tokenDelivered, `[Handshake: ${desc}] Token successfully delivered to allowed origin ${origin}`);
    } else {
      assert(!tokenDelivered, `[Handshake: ${desc}] Token strictly rejected and not delivered to ${origin}`);
    }
  }
}

// -----------------------------------------------------------------------------
// ADVERSARIAL SUITE 2: SUBDOMAIN BOUNDARY ATTACKS
// -----------------------------------------------------------------------------
console.log('\n--- 2. Subdomain Boundary Attacks ---');

const SUBDOMAIN_ATTACK_CASES = [
  { origin: 'https://fake.kavithaassociates.com', expected: false, desc: 'Arbitrary subdomain on kavithaassociates.com' },
  { origin: 'https://kavithaassociates.com.attacker.com', expected: false, desc: 'Domain as subdomain of attacker.com' },
  { origin: 'https://kavithaassociates.com.evil.org', expected: false, desc: 'Domain as subdomain of evil.org' },
  { origin: 'https://attacker-kavithaassociates.com', expected: false, desc: 'Hyphenated prefix spoof' },
  { origin: 'https://kavithaassociates.com-attacker.com', expected: false, desc: 'Hyphenated suffix spoof' },
  { origin: 'https://kavithaassociates.com@evil.com', expected: false, desc: 'Userinfo @ spoof attempt' },
  { origin: 'https://not-kavitha-and-associates.pages.dev', expected: false, desc: 'Spoofed pages.dev domain without kavitha prefix' },
  { origin: 'https://evil-kavitha-and-associates.pages.dev', expected: false, desc: 'Hyphenated prefix on pages.dev domain' },
  { origin: 'https://kavitha-and-associates.pages.dev.attacker.com', expected: false, desc: 'pages.dev domain as subdomain of attacker' },
  { origin: 'https://sub.preview.kavitha-and-associates.pages.dev', expected: false, desc: 'Nested subdomains with dot on pages.dev' },
  { origin: 'https://preview_test.kavitha-and-associates.pages.dev', expected: false, desc: 'Underscore in pages.dev subdomain' },
  { origin: 'https://preview-deploy-123.kavitha-and-associates.pages.dev', expected: true, desc: 'Valid hyphenated pages.dev preview subdomain' },
  { origin: 'https://branch1.kavitha-and-associates.pages.dev', expected: true, desc: 'Valid alphanumeric pages.dev preview subdomain' }
];

{
  const evalResult = await evaluateEmittedScript();
  const isAllowed = evalResult.isOriginAllowedFn;

  for (const { origin, expected, desc } of SUBDOMAIN_ATTACK_CASES) {
    const allowed = isAllowed(origin);
    assert(allowed === expected, `[Subdomain Attack: ${desc}] isOriginAllowed('${origin}') === ${expected}`);

    const freshInstance = await evaluateEmittedScript();
    const handshakeMsgs = freshInstance.testOriginHandshake(origin);
    const tokenDelivered = handshakeMsgs.some(m => m.targetOrigin === origin);
    if (expected) {
      assert(tokenDelivered, `[Handshake: ${desc}] Token delivered to valid origin ${origin}`);
    } else {
      assert(!tokenDelivered, `[Handshake: ${desc}] Token rejected for spoofed origin ${origin}`);
    }
  }
}

// -----------------------------------------------------------------------------
// ADVERSARIAL SUITE 3: PORT VARIATIONS & LOCALHOST BOUNDARIES
// -----------------------------------------------------------------------------
console.log('\n--- 3. Port Variations & Localhost Boundaries ---');

const PORT_VARIATION_CASES = [
  { origin: 'http://localhost:8080', expected: true, desc: 'Localhost port 8080' },
  { origin: 'http://localhost:3000', expected: true, desc: 'Localhost port 3000' },
  { origin: 'http://localhost:5173', expected: true, desc: 'Localhost port 5173' },
  { origin: 'http://localhost:0', expected: true, desc: 'Localhost port 0' },
  { origin: 'http://localhost:65535', expected: true, desc: 'Localhost max port 65535' },
  { origin: 'http://localhost', expected: true, desc: 'Localhost without explicit port' },
  { origin: 'https://localhost:443', expected: true, desc: 'HTTPS Localhost port 443' },
  { origin: 'http://127.0.0.1:8788', expected: true, desc: '127.0.0.1 Wrangler port 8788' },
  { origin: 'http://127.0.0.1', expected: true, desc: '127.0.0.1 without port' },
  { origin: 'http://localhost:abc', expected: false, desc: 'Non-numeric port :abc' },
  { origin: 'http://localhost:8080abc', expected: false, desc: 'Port with trailing alphabetic characters' },
  { origin: 'http://localhost:', expected: false, desc: 'Colon without port digits' },
  { origin: 'http://localhost:80:80', expected: false, desc: 'Double colon port injection' },
  { origin: 'http://localhost:-8080', expected: false, desc: 'Negative port' },
  { origin: 'http://127.0.0.1:abc', expected: false, desc: '127.0.0.1 with non-numeric port :abc' },
  { origin: 'http://127.0.0.1:', expected: false, desc: '127.0.0.1 with dangling colon' },
  { origin: 'http://127.0.0.2:8080', expected: false, desc: '127.0.0.2 non-loopback IP' },
  { origin: 'http://127.0.1.1:8080', expected: false, desc: '127.0.1.1 IP' },
  { origin: 'http://localhost.attacker.com:8080', expected: false, desc: 'localhost as subdomain of attacker' },
  { origin: 'http://127.0.0.1.attacker.com:8080', expected: false, desc: '127.0.0.1 as subdomain of attacker' }
];

{
  const evalResult = await evaluateEmittedScript();
  const isAllowed = evalResult.isOriginAllowedFn;

  for (const { origin, expected, desc } of PORT_VARIATION_CASES) {
    const allowed = isAllowed(origin);
    assert(allowed === expected, `[Port Variation: ${desc}] isOriginAllowed('${origin}') === ${expected}`);

    const freshInstance = await evaluateEmittedScript();
    const handshakeMsgs = freshInstance.testOriginHandshake(origin);
    const tokenDelivered = handshakeMsgs.some(m => m.targetOrigin === origin);
    if (expected) {
      assert(tokenDelivered, `[Handshake: ${desc}] Token delivered to valid localhost origin ${origin}`);
    } else {
      assert(!tokenDelivered, `[Handshake: ${desc}] Token rejected for invalid port/origin ${origin}`);
    }
  }
}

// -----------------------------------------------------------------------------
// ADVERSARIAL SUITE 4: SCRIPT TAG CLOSING VARIATIONS
// -----------------------------------------------------------------------------
console.log('\n--- 4. Script Tag Closing Variations & Tokenizer Breakout ---');

const SCRIPT_CLOSING_VECTORS = [
  { name: 'Trailing space in closing tag', payload: '</script >' },
  { name: 'Trailing newline in closing tag', payload: '</script\n>' },
  { name: 'Trailing CRLF in closing tag', payload: '</script\r\n>' },
  { name: 'Trailing tab in closing tag', payload: '</script\t>' },
  { name: 'Slash terminated script tag', payload: '</script/x>' },
  { name: 'Attributes inside closing tag', payload: '</script attr="test">' },
  { name: 'Multiple spaces inside closing tag', payload: '</script   >' },
  { name: 'Mixed case with space', payload: '</sCrIpt >' },
  { name: 'Unicode escaped in input', payload: '\\u003c/script\\u003e' },
  { name: 'Uppercase Unicode escaped in input', payload: '\\u003C/SCRIPT\\u003E' },
  { name: 'Hex escaped in input', payload: '\\x3c/script\\x3e' },
  { name: 'HTML comment wrapping script closing', payload: '<!--</script>-->' },
  { name: 'Script opening tag injection', payload: '<script src="https://evil.com/xss.js">' },
  { name: 'Embedded closing tag with executable payload', payload: '</script ><script >alert("pwned")</script >' },
  { name: 'Newline separated closing and opening', payload: '</script\n><script\n>alert(1)</script\n>' }
];

for (const { name, payload } of SCRIPT_CLOSING_VECTORS) {
  // Inject via error_description
  const evalResult = await evaluateEmittedScript({ errorDesc: payload });
  const html = evalResult.html;

  // 1. Assert HTML tokenizer never encounters premature </script closing tag
  // In HTML5 WHATWG tokenizer, an end tag open state inside script data state matches:
  // </ followed by [a-zA-Z] followed by whitespace, '/', or '>'
  // Let's test against case-insensitive regex for any </script variant:
  const scriptContentMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  assert(scriptContentMatch !== null, `[Script Breakout: ${name}] Script tags match cleanly as a single script block`);

  if (scriptContentMatch) {
    const scriptBody = scriptContentMatch[1];
    const prematureClosingMatch = scriptBody.match(/<\/script[\s\/\>]/i);
    assert(prematureClosingMatch === null,
      `[Script Breakout: ${name}] Script content contains NO premature closing tag variants (matched: ${prematureClosingMatch})`);

    // Ensure no unescaped '<' exists in the JSON data payload inside the script
    assert(!scriptBody.includes('</script'), `[Script Breakout: ${name}] Zero literal '</script' sequences in script body`);
    assert(!scriptBody.includes('<script'), `[Script Breakout: ${name}] Zero literal '<script' sequences in script body`);
  }

  // 2. Count total <script tags in entire HTML document
  const totalScriptTags = (html.match(/<script\b/gi) || []).length;
  assert(totalScriptTags === 1, `[Script Breakout: ${name}] Entire HTML document contains strictly 1 <script> tag`);

  // 3. Emitted JavaScript must parse cleanly without SyntaxError
  assert(evalResult.parseError === null, `[Script Breakout: ${name}] Script parses cleanly without SyntaxError`);
}

// -----------------------------------------------------------------------------
// SUMMARY & VERDICT
// -----------------------------------------------------------------------------
console.log('\n========================================================================');
console.log(`TOTAL DEEP ADVERSARIAL ASSERTIONS: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failures.length}`);
console.log('========================================================================\n');

if (failures.length > 0) {
  console.log('DEEP ADVERSARIAL CHALLENGE FAILED:');
  failures.forEach((f, i) => console.log(`[${i + 1}] ${f.testName}: ${f.details}`));
  process.exit(1);
} else {
  console.log('ALL DEEP ADVERSARIAL ATTACK CHALLENGES PASSED WITH ZERO DEFECTS!');
  process.exit(0);
}
