import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import { onRequestGet as callbackGet } from '../functions/api/callback.js';

console.log('========================================================================');
console.log('  CHALLENGER: EMPIRICAL XSS & POSTMESSAGE ORIGIN STRESS-TEST HARNESS    ');
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

// =============================================================================
// PART 1: EXTREME XSS & SCRIPT BREAKOUT EMPIRICAL CHALLENGES
// =============================================================================
console.log('--- PART 1: Extreme XSS & Script Breakout Challenges ---');

const XSS_PAYLOADS = [
  { name: 'Standard script alert', payload: '<script>alert(1)</script>' },
  { name: 'Img onerror vector', payload: '<img src=x onerror=alert(1)>' },
  { name: 'Script tag breakout cookie grab', payload: '</script><script>alert(document.cookie)</script>' },
  { name: 'Script tag breakout SVG onload', payload: '</script><svg onload=alert(1)>' },
  { name: 'Case-variant script breakout', payload: '</SCRIPT><SCRIPT>alert("XSS")</SCRIPT>' },
  { name: 'Mixed case breakout', payload: '</sCrIpT><ScRiPt>alert(1)</sCrIpT>' },
  { name: 'Attribute breakout with script', payload: '"><script>alert(1)</script>' },
  { name: 'Attribute event handler injection', payload: '" onfocus="alert(1)" autofocus="' },
  { name: 'Script breakout with iframe', payload: '</script><iframe src="javascript:alert(1)"></iframe>' },
  { name: 'Script tag with space/slash', payload: '</script/x><svg/onload=alert(1)>' },
  { name: 'HTML comment breakout', payload: '--> <script>alert(1)</script>' },
  { name: 'Single quote breakout with javascript URI', payload: "'><a href='javascript:alert(1)'>click</a>" }
];

for (const { name, payload } of XSS_PAYLOADS) {
  // Test injection via error_description query parameter
  const req = new Request('https://kavithaassociates.com/api/callback?error=access_denied&error_description=' + encodeURIComponent(payload));
  const res = await callbackGet({ request: req, env: {} });
  const html = await res.text();

  // 1. Assert raw unescaped payload NEVER appears in the HTML response
  assert(!html.includes(payload), `[XSS: ${name}] Raw payload never appears verbatim in HTML response`);

  // 2. Extract HTML body status-text: <p id="status-text">...</p>
  const statusTextMatch = html.match(/<p id="status-text">([\s\S]*?)<\/p>/);
  assert(statusTextMatch !== null, `[XSS: ${name}] Found status-text paragraph in HTML`);
  if (statusTextMatch) {
    const statusContent = statusTextMatch[1];
    // Assert HTML body does not contain unescaped '<' or '>'
    assert(!statusContent.includes('<') && !statusContent.includes('>'),
      `[XSS: ${name}] HTML body content contains zero literal '<' or '>' angle brackets`);
    
    // Check specific escaping: if payload had '<', statusContent must contain '&lt;'
    if (payload.includes('<')) {
      assert(statusContent.includes('&lt;'), `[XSS: ${name}] '<' is escaped to '&lt;' in HTML body`);
    }
    if (payload.includes('>')) {
      assert(statusContent.includes('&gt;'), `[XSS: ${name}] '>' is escaped to '&gt;' in HTML body`);
    }
  }

  // 3. Extract <script>...</script> block
  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  assert(scriptMatch !== null, `[XSS: ${name}] Found script block in HTML`);
  if (scriptMatch) {
    const scriptContent = scriptMatch[1];
    // Assert no premature script breakout exists inside script content
    assert(!/<\/script/i.test(scriptContent), `[XSS: ${name}] Script block contains ZERO '</script' closing tags (case-insensitive)`);

    // Verify safeJsonStringify Unicode escaping
    assert(!scriptContent.includes('<script>'), `[XSS: ${name}] Script block contains zero literal '<script>' strings`);
    if (payload.includes('<')) {
      assert(scriptContent.includes('\\u003c'), `[XSS: ${name}] '<' in JSON payload is escaped to '\\u003c'`);
    }
    if (payload.includes('>')) {
      assert(scriptContent.includes('\\u003e'), `[XSS: ${name}] '>' in JSON payload is escaped to '\\u003e'`);
    }
  }

  // 4. Assert total count of <script tags in the entire document is strictly 1
  const scriptTagCount = (html.match(/<script\b/gi) || []).length;
  assert(scriptTagCount === 1, `[XSS: ${name}] Exactly 1 <script> tag exists in the entire document (no injected scripts)`);
}

// Test XSS in OAuth success token payload
{
  const xssToken = '</script><script>alert("token-xss")</script>';
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    if (url.includes('access_token')) {
      return new Response(JSON.stringify({ access_token: xssToken }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (url.includes('api.github.com/user')) {
      return new Response(JSON.stringify({ login: 'legit_admin' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response('Not found', { status: 404 });
  };

  const req = new Request('https://kavithaassociates.com/api/callback?code=good_code&state=good_state', {
    headers: { 'Cookie': 'ka_oauth_state=good_state' }
  });
  const res = await callbackGet({
    request: req,
    env: { GITHUB_CLIENT_ID: 'cid', GITHUB_CLIENT_SECRET: 'sec', ALLOWED_USERS: 'legit_admin' }
  });
  const html = await res.text();

  assert(!html.includes('</script><script>alert("token-xss")</script>'), '[XSS in Token] Raw breakout in access_token does not appear in HTML');
  assert(html.includes('\\u003c/script\\u003e\\u003cscript\\u003e'), '[XSS in Token] Token breakout is safely Unicode-escaped inside <script>');
  const scriptTagCount = (html.match(/<script\b/gi) || []).length;
  assert(scriptTagCount === 1, '[XSS in Token] Exactly 1 <script> tag exists when token contains breakout sequence');

  globalThis.fetch = originalFetch;
}

// Test XSS in unauthorized username payload
{
  const xssUser = '<img src=x onerror=alert("user-xss")>';
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    if (url.includes('access_token')) {
      return new Response(JSON.stringify({ access_token: 'ghp_secret' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (url.includes('api.github.com/user')) {
      return new Response(JSON.stringify({ login: xssUser }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response('Not found', { status: 404 });
  };

  const req = new Request('https://kavithaassociates.com/api/callback?code=good_code&state=good_state', {
    headers: { 'Cookie': 'ka_oauth_state=good_state' }
  });
  const res = await callbackGet({
    request: req,
    env: { GITHUB_CLIENT_ID: 'cid', GITHUB_CLIENT_SECRET: 'sec', ALLOWED_USERS: 'authorized_admin' }
  });
  const html = await res.text();

  assert(!html.includes('<img src=x onerror=alert("user-xss")>'), '[XSS in Username] Raw HTML tag in GitHub username is sanitized');
  assert(html.includes('&lt;img src=x onerror=alert(&quot;user-xss&quot;)&gt;'), '[XSS in Username] Username HTML tag is properly entity-escaped in HTML body');

  globalThis.fetch = originalFetch;
}

// =============================================================================
// PART 2: POSTMESSAGE ORIGIN VALIDATION & WILDCARD ELIMINATION
// =============================================================================
console.log('\n--- PART 2: PostMessage TargetOrigin & Whitelist Validation ---');

// 2.1 Static Analysis: Source Code Audit for Wildcard TargetOrigin
import { fileURLToPath } from 'node:url';
const callbackSourcePath = fileURLToPath(new URL('../functions/api/callback.js', import.meta.url));
const callbackSource = fs.readFileSync(callbackSourcePath, 'utf8');

// Check that no postMessage call uses wildcard '*'
const postMessageCallRegex = /\.postMessage\s*\([^,]+,\s*['"]\*['"]\)/g;
const wildcardMatches = callbackSource.match(postMessageCallRegex) || [];
assert(wildcardMatches.length === 0, 'Zero wildcard postMessage calls: No postMessage(..., "*") found in callback.js', JSON.stringify(wildcardMatches));

// Check fallback deliverMessage timeout does NOT use '*'
const fallbackTimeoutMatch = callbackSource.match(/setTimeout\s*\(\s*function\s*\(\s*\)\s*\{\s*deliverMessage\s*\(([^)]+)\)/);
assert(fallbackTimeoutMatch !== null, 'Found deliverMessage fallback setTimeout in callback.js');
if (fallbackTimeoutMatch) {
  const arg = fallbackTimeoutMatch[1].trim();
  assert(arg !== "'*'" && arg !== '"*"', `Fallback deliverMessage argument is NOT wildcard '*' (found: ${arg})`);
  assert(arg === 'trustedOrigin', `Fallback deliverMessage specifically uses trustedOrigin (found: ${arg})`);
}

// 2.2 Dynamic VM Execution of Callback Script
// Helper to extract and run the script in a simulated browser context
async function runCallbackScript(options = {}) {
  const {
    requestUrl = 'https://kavithaassociates.com/api/callback?code=good_code&state=good_state',
    token = 'ghp_legit_token_12345',
    username = 'legit_admin',
    windowLocationOrigin = 'https://kavithaassociates.com'
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

  const req = new Request(requestUrl, {
    headers: { 'Cookie': 'ka_oauth_state=good_state' }
  });
  const res = await callbackGet({
    request: req,
    env: { GITHUB_CLIENT_ID: 'cid', GITHUB_CLIENT_SECRET: 'sec', ALLOWED_USERS: username }
  });
  const html = await res.text();
  globalThis.fetch = originalFetch;

  // Extract <script> code
  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!scriptMatch) throw new Error('No script block found in response');
  const scriptCode = scriptMatch[1];

  // Construct sandbox
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
      opener: options.noOpener ? null : mockOpener,
      location: {
        origin: windowLocationOrigin
      },
      addEventListener: (evt, handler) => {
        registeredListeners[evt] = handler;
      },
      removeEventListener: () => {},
      close: () => {
        sentMessages.push({ action: 'window.close' });
      }
    },
    document: {
      getElementById: (id) => ({ id, textContent: '' })
    },
    console: {
      log: () => {},
      warn: () => {},
      error: () => {}
    },
    setTimeout: (fn, delay) => {
      const timerId = timers.length;
      timers.push({ id: timerId, fn, delay, executed: false });
      return timerId;
    },
    clearTimeout: () => {}
  };

  // Check if raw emitted script parses without SyntaxError
  let scriptParseError = null;
  try {
    new Function(scriptCode);
  } catch (err) {
    scriptParseError = err;
  }

  // If allowFix is true, fix the template literal backslash escaping so we can verify origin logic
  let effectiveCode = scriptCode;
  if (options.allowFix && scriptParseError) {
    effectiveCode = scriptCode
      .replace('var normalized = origin.replace(//+$/, \'\');', 'var normalized = origin.replace(/\\/+$/, \'\');')
      .replace('/^https?://(localhost|127.0.0.1)(:d+)?$/', '/^https?:\\/\\/(localhost|127\\.0\\.0\\.1)(:\\d+)?$/')
      .replace('/^https?://[a-z0-9-]+.kavitha-and-associates.pages.dev$/', '/^https?:\\/\\/[a-z0-9-]+\\.kavitha-and-associates\\.pages\\.dev$/');
    try {
      new Function(effectiveCode);
    } catch (e) {
      console.error('DEBUG effectiveCode parse failure:', e.message);
    }
  }

  // Run script in context
  const context = vm.createContext(sandbox);
  let runtimeError = null;
  try {
    vm.runInContext(effectiveCode, context);
  } catch (err) {
    runtimeError = err;
  }

  return {
    scriptCode,
    scriptParseError,
    runtimeError,
    sentMessages,
    registeredListeners,
    timers,
    triggerTimer: (index) => {
      if (timers[index] && !timers[index].executed) {
        timers[index].executed = true;
        timers[index].fn();
      }
    },
    triggerMessage: (origin, data = 'authorizing:github') => {
      if (registeredListeners['message']) {
        registeredListeners['message']({ origin, data });
      }
    }
  };
}

// 2.2 Client-side Script Syntax & Parse Integrity Check
{
  const rawResult = await runCallbackScript({ allowFix: false });
  assert(rawResult.scriptParseError === null,
    'Client-side script in HTML parses without SyntaxError in browser runtime',
    rawResult.scriptParseError ? `${rawResult.scriptParseError.name}: ${rawResult.scriptParseError.message}` : '');
}

// 2.3 Challenge: Immediate Handshake to Opener
{
  const result = await runCallbackScript({ allowFix: true });
  assert(result.sentMessages.length >= 1, 'Script immediately sends initial handshake message to opener');
  const initial = result.sentMessages[0];
  assert(initial.data === 'authorizing:github', 'Initial message payload is "authorizing:github"');
  assert(initial.targetOrigin === 'https://kavithaassociates.com', 'Initial message targetOrigin is https://kavithaassociates.com');
  assert(initial.targetOrigin !== '*', 'Initial message targetOrigin is strictly NOT wildcard "*"');
}

// 2.4 Challenge: Malicious Origins MUST Be Rejected and Tokens NEVER Delivered
const MALICIOUS_ORIGINS = [
  'https://evil-attacker.com',
  'http://evil-attacker.com',
  'https://kavithaassociates.com.attacker.com',
  'https://attacker-kavithaassociates.com',
  'https://kavitha-and-associates.pages.dev.attacker.com',
  'http://localhost.attacker.com',
  'http://127.0.0.1.attacker.com',
  'http://localhost:5173.attacker.com',
  'https://subdomain.kavithaassociates.com.attacker.com',
  'null',
  '*',
  'javascript:alert(1)',
  'data:text/html;base64,PHNjcmlwdD4='
];

for (const evilOrigin of MALICIOUS_ORIGINS) {
  const result = await runCallbackScript({ token: 'SECRET_TOKEN_ATTACKER_TEST', allowFix: true });
  // Initial message is already logged
  const countBefore = result.sentMessages.length;

  // Attacker opener sends message event with its evil origin
  result.triggerMessage(evilOrigin, 'authorizing:github');

  // Verify that NO token message was delivered to the attacker origin
  const deliveredToEvil = result.sentMessages.slice(countBefore).filter(m => m.targetOrigin === evilOrigin);
  assert(deliveredToEvil.length === 0, `[Origin Challenge: ${evilOrigin}] REJECTED: Token is NEVER delivered to untrusted origin`);

  // Verify that NO message was delivered with targetOrigin '*'
  const deliveredToWildcard = result.sentMessages.slice(countBefore).filter(m => m.targetOrigin === '*');
  assert(deliveredToWildcard.length === 0, `[Origin Challenge: ${evilOrigin}] REJECTED: No message ever dispatched with targetOrigin '*'`);
}

// 2.5 Challenge: Trusted Origins MUST Successfully Receive Tokens
const TRUSTED_ORIGINS = [
  { origin: 'https://kavithaassociates.com', label: 'Canonical Production Domain' },
  { origin: 'https://www.kavithaassociates.com', label: 'Canonical WWW Domain' },
  { origin: 'http://localhost:5173', label: 'Vite Dev Server (Port 5173)' },
  { origin: 'http://localhost:3000', label: 'Local Dev Server (Port 3000)' },
  { origin: 'http://127.0.0.1:8788', label: 'Cloudflare Wrangler Local Dev (127.0.0.1:8788)' },
  { origin: 'https://preview-123.kavitha-and-associates.pages.dev', label: 'Cloudflare Pages Preview Subdomain' }
];

for (const { origin, label } of TRUSTED_ORIGINS) {
  const testToken = `TOKEN_TRUSTED_${origin.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const result = await runCallbackScript({
    token: testToken,
    windowLocationOrigin: origin.startsWith('https://kavithaassociates.com') ? origin : 'https://kavithaassociates.com',
    allowFix: true
  });

  const countBefore = result.sentMessages.length;
  // Trusted opener sends message handshake with its legitimate origin
  result.triggerMessage(origin, 'authorizing:github');

  const deliveredMessages = result.sentMessages.slice(countBefore);
  const tokenMsg = deliveredMessages.find(m => m.targetOrigin === origin);

  assert(tokenMsg !== undefined, `[Trusted Origin: ${label}] Token successfully delivered to ${origin}`);
  if (tokenMsg) {
    assert(tokenMsg.data.includes(testToken), `[Trusted Origin: ${label}] Delivered payload contains access token`);
    assert(tokenMsg.data.startsWith('authorization:github:success:'), `[Trusted Origin: ${label}] Payload starts with authorization:github:success:`);
    assert(tokenMsg.targetOrigin === origin, `[Trusted Origin: ${label}] targetOrigin strictly matches trusted origin ${origin}`);
    assert(tokenMsg.targetOrigin !== '*', `[Trusted Origin: ${label}] targetOrigin is NOT wildcard '*'`);
  }
}

// 2.6 Challenge: Timeout Fallback (1200ms) Delivers Strictly to Trusted Origin, NEVER Wildcard
{
  const result = await runCallbackScript({ token: 'FALLBACK_TEST_TOKEN', allowFix: true });
  assert(result.timers.length > 0, 'Found registered timers for fallback');
  const fallbackTimerIdx = result.timers.findIndex(t => t.delay === 1200);
  assert(fallbackTimerIdx !== -1, 'Registered 1200ms fallback delivery timer');

  // Trigger the 1200ms timer without prior handshake
  const countBefore = result.sentMessages.length;
  result.triggerTimer(fallbackTimerIdx);

  const fallbackDeliveries = result.sentMessages.slice(countBefore);
  const fallbackMsg = fallbackDeliveries.find(m => m.data && m.data.includes('FALLBACK_TEST_TOKEN'));
  assert(fallbackMsg !== undefined, 'Fallback timer successfully delivered token to trusted origin');
  if (fallbackMsg) {
    assert(fallbackMsg.targetOrigin === 'https://kavithaassociates.com', 'Fallback delivery targetOrigin is https://kavithaassociates.com');
    assert(fallbackMsg.targetOrigin !== '*', 'Fallback delivery targetOrigin is NEVER wildcard "*"');
  }
}

// 2.7 Challenge: Graceful Degradation when window.opener is Null
{
  const resultNoOpener = await runCallbackScript({ noOpener: true, allowFix: true });
  assert(resultNoOpener.sentMessages.length === 0, 'Zero messages dispatched when window.opener is null');
}

// =============================================================================
// SUMMARY & VERDICT
// =============================================================================
console.log('\n========================================================================');
console.log(`TOTAL EMPIRICAL CHALLENGE ASSERTIONS: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failures.length}`);
console.log('========================================================================\n');

if (failures.length > 0) {
  console.log('CHALLENGE FAILED — DEFECTS FOUND:');
  failures.forEach((f, i) => console.log(`[${i + 1}] ${f.testName}: ${f.details}`));
  process.exit(1);
} else {
  console.log('ALL EMPIRICAL XSS & ORIGIN SECURITY CHALLENGES PASSED WITH ZERO DEFECTS!');
  process.exit(0);
}
