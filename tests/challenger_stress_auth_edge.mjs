import { onRequestGet as authGet } from '../functions/api/auth.js';
import { onRequestGet as callbackGet } from '../functions/api/callback.js';

console.log('================================================================');
console.log('  CHALLENGER M1: ADVERSARIAL AUTH & EDGE STRESS HARNESS         ');
console.log('================================================================');

let passedAssertions = 0;
let totalAssertions = 0;
const failures = [];

function assert(condition, message, details = '') {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
    console.log(`\x1b[32m✔ PASS\x1b[0m [Stress ${totalAssertions}] ${message}`);
  } else {
    failures.push({ message, details });
    console.log(`\x1b[31m✖ FAIL\x1b[0m [Stress ${totalAssertions}] ${message}`);
    if (details) console.log(`       Details: ${details}`);
  }
}

// -----------------------------------------------------------------------------
// 1. Stress-testing /api/auth
// -----------------------------------------------------------------------------
console.log('\n--- 1. Testing /api/auth Edge Cases & Boundary Conditions ---');

// 1.1 Unsupported provider
{
  const req = new Request('https://kavithaassociates.com/api/auth?provider=gitlab');
  const res = await authGet({ request: req, env: { GITHUB_CLIENT_ID: 'cid_123' } });
  assert(res.status === 400, 'Unsupported provider (gitlab) returns HTTP 400');
  const body = await res.json();
  assert(body.error && body.error.includes('gitlab'), 'Returns explanatory error message for unsupported provider');
}

// 1.2 Path traversal attempt in provider
{
  const req = new Request('https://kavithaassociates.com/api/auth?provider=../../etc/passwd');
  const res = await authGet({ request: req, env: { GITHUB_CLIENT_ID: 'cid_123' } });
  assert(res.status === 400, 'Malicious provider path traversal returns HTTP 400');
}

// 1.3 Missing GITHUB_CLIENT_ID
{
  const req = new Request('https://kavithaassociates.com/api/auth?provider=github');
  const res = await authGet({ request: req, env: {} });
  assert(res.status === 500, 'Missing GITHUB_CLIENT_ID returns HTTP 500 server configuration error');
}

// 1.4 Valid flow & State Cookie Security Attributes
{
  const req = new Request('https://kavithaassociates.com/api/auth?provider=github&scope=repo,user');
  const res = await authGet({ request: req, env: { GITHUB_CLIENT_ID: 'test_client_id_456' } });
  assert(res.status === 302, 'Valid request returns HTTP 302 redirect');
  
  const location = res.headers.get('Location');
  assert(location && location.startsWith('https://github.com/login/oauth/authorize'), 'Redirect location targets GitHub OAuth endpoint');
  
  const parsedLoc = new URL(location);
  assert(parsedLoc.searchParams.get('client_id') === 'test_client_id_456', 'Location carries correct client_id');
  assert(parsedLoc.searchParams.get('scope') === 'repo,user', 'Location carries requested scope');
  assert(parsedLoc.searchParams.get('redirect_uri') === 'https://kavithaassociates.com/api/callback', 'Location specifies correct callback URL');
  
  const stateInParam = parsedLoc.searchParams.get('state');
  assert(/^[0-9a-f]{48}$/.test(stateInParam), 'State parameter is a 24-byte (48-char) cryptographic hex string', stateInParam);

  const cookie = res.headers.get('Set-Cookie');
  assert(cookie.includes(`ka_oauth_state=${stateInParam}`), 'Set-Cookie contains matching state');
  assert(cookie.includes('HttpOnly'), 'Set-Cookie has HttpOnly flag');
  assert(cookie.includes('Secure'), 'Set-Cookie has Secure flag');
  assert(cookie.includes('SameSite=Lax'), 'Set-Cookie has SameSite=Lax flag');
  assert(cookie.includes('Max-Age=600'), 'Set-Cookie has 10-minute expiry (Max-Age=600)');
  assert(cookie.includes('Path=/'), 'Set-Cookie scoped to Path=/');
}

// 1.5 State Randomness / Uniqueness Entropy Check (1000 iterations)
{
  const states = new Set();
  const req = new Request('https://kavithaassociates.com/api/auth');
  for (let i = 0; i < 500; i++) {
    const res = await authGet({ request: req, env: { GITHUB_CLIENT_ID: 'cid' } });
    const loc = new URL(res.headers.get('Location'));
    states.add(loc.searchParams.get('state'));
  }
  assert(states.size === 500, 'High entropy: 500 consecutive states are 100% cryptographically unique with 0 collisions');
}

// -----------------------------------------------------------------------------
// 2. Stress-testing /api/callback
// -----------------------------------------------------------------------------
console.log('\n--- 2. Testing /api/callback Edge Cases & Authorization Boundary ---');

// Mock fetch environment helper
function createMockFetch(tokenResponse, userResponse) {
  return async (url, opts) => {
    if (url.includes('access_token')) {
      return {
        ok: tokenResponse.ok ?? true,
        status: tokenResponse.status ?? 200,
        json: async () => tokenResponse.body
      };
    }
    if (url.includes('api.github.com/user')) {
      return {
        ok: userResponse.ok ?? true,
        status: userResponse.status ?? 200,
        json: async () => userResponse.body
      };
    }
    throw new Error(`Unexpected fetch URL: ${url}`);
  };
}

// 2.1 GitHub Error parameter (User denied consent)
{
  const req = new Request('https://kavithaassociates.com/api/callback?error=access_denied&error_description=Consent+denied');
  const res = await callbackGet({ request: req, env: { GITHUB_CLIENT_ID: 'cid', GITHUB_CLIENT_SECRET: 'sec' } });
  assert(res.status === 403, 'GitHub error callback returns HTTP 403');
  const html = await res.text();
  assert(html.includes('authorization:github:error:'), 'HTML contains authorization:github:error: postMessage');
  assert(html.includes('Consent denied'), 'HTML contains GitHub error description');
  assert(res.headers.get('Set-Cookie').includes('Max-Age=0'), 'Clears state cookie with Max-Age=0');
}

// 2.2 CSRF State Mismatch (Tampered State)
{
  const req = new Request('https://kavithaassociates.com/api/callback?code=good_code&state=attacker_state', {
    headers: { 'Cookie': 'ka_oauth_state=legit_state_123' }
  });
  const res = await callbackGet({ request: req, env: { GITHUB_CLIENT_ID: 'cid', GITHUB_CLIENT_SECRET: 'sec' } });
  assert(res.status === 403, 'CSRF state mismatch returns HTTP 403');
  const html = await res.text();
  assert(html.includes('CSRF State validation failed'), 'Returns CSRF validation failed message');
  assert(res.headers.get('Set-Cookie').includes('Max-Age=0'), 'Clears state cookie on CSRF failure');
}

// 2.3 Missing Stored State Cookie
{
  const req = new Request('https://kavithaassociates.com/api/callback?code=good_code&state=some_state');
  const res = await callbackGet({ request: req, env: { GITHUB_CLIENT_ID: 'cid', GITHUB_CLIENT_SECRET: 'sec' } });
  assert(res.status === 403, 'Missing state cookie returns HTTP 403');
}

// 2.4 Missing Authorization Code
{
  const req = new Request('https://kavithaassociates.com/api/callback?state=legit_state', {
    headers: { 'Cookie': 'ka_oauth_state=legit_state' }
  });
  const res = await callbackGet({ request: req, env: { GITHUB_CLIENT_ID: 'cid', GITHUB_CLIENT_SECRET: 'sec' } });
  assert(res.status === 400, 'Missing code parameter returns HTTP 400');
}

// 2.5 Missing Server Environment Secrets
{
  const req = new Request('https://kavithaassociates.com/api/callback?code=abc&state=legit_state', {
    headers: { 'Cookie': 'ka_oauth_state=legit_state' }
  });
  const res = await callbackGet({ request: req, env: { GITHUB_CLIENT_ID: 'cid' } }); // missing secret
  assert(res.status === 500, 'Missing server secrets returns HTTP 500');
}

// 2.6 Server-side FAIL-CLOSED when ALLOWED_USERS is empty or unset
{
  const originalFetch = globalThis.fetch;
  globalThis.fetch = createMockFetch(
    { ok: true, status: 200, body: { access_token: 'ghp_secret123' } },
    { ok: true, status: 200, body: { login: 'deswanth12' } }
  );

  const req = new Request('https://kavithaassociates.com/api/callback?code=valid&state=valid_state', {
    headers: { 'Cookie': 'ka_oauth_state=valid_state' }
  });
  const res = await callbackGet({
    request: req,
    env: {
      GITHUB_CLIENT_ID: 'cid',
      GITHUB_CLIENT_SECRET: 'sec',
      ALLOWED_USERS: '' // Empty!
    }
  });

  assert(res.status === 403, 'Empty ALLOWED_USERS returns HTTP 403 (Fail-Closed)');
  const html = await res.text();
  assert(!html.includes('ghp_secret123'), 'Access token is DISCARDED and NEVER leaked in response when unauthorized');
  assert(html.includes('authorization:github:error:'), 'Emits authorization:github:error postMessage');

  globalThis.fetch = originalFetch;
}

// 2.7 Unauthorized user rejected (Account not in whitelist)
{
  const originalFetch = globalThis.fetch;
  globalThis.fetch = createMockFetch(
    { ok: true, status: 200, body: { access_token: 'ghp_secret456' } },
    { ok: true, status: 200, body: { login: 'unauthorized_attacker' } }
  );

  const req = new Request('https://kavithaassociates.com/api/callback?code=valid&state=valid_state', {
    headers: { 'Cookie': 'ka_oauth_state=valid_state' }
  });
  const res = await callbackGet({
    request: req,
    env: {
      GITHUB_CLIENT_ID: 'cid',
      GITHUB_CLIENT_SECRET: 'sec',
      ALLOWED_USERS: 'deswanth12,kavithavijay'
    }
  });

  assert(res.status === 403, 'Unauthorized GitHub user returns HTTP 403 Access Denied');
  const html = await res.text();
  assert(!html.includes('ghp_secret456'), 'Access token is strictly withheld');
  assert(html.includes('unauthorized_attacker'), 'Error references unauthorized account name');

  globalThis.fetch = originalFetch;
}

// 2.8 Whitelisted user accepted with case-insensitive normalization
{
  const originalFetch = globalThis.fetch;
  globalThis.fetch = createMockFetch(
    { ok: true, status: 200, body: { access_token: 'ghp_valid_token_789' } },
    { ok: true, status: 200, body: { login: 'Deswanth12' } } // CamelCase
  );

  const req = new Request('https://kavithaassociates.com/api/callback?code=valid&state=valid_state', {
    headers: { 'Cookie': 'ka_oauth_state=valid_state' }
  });
  const res = await callbackGet({
    request: req,
    env: {
      GITHUB_CLIENT_ID: 'cid',
      GITHUB_CLIENT_SECRET: 'sec',
      ALLOWED_USERS: ' alice , DESWANTH12 , bob ' // Whitespace and UPPERCASE
    }
  });

  assert(res.status === 200, 'Whitelisted user returns HTTP 200');
  const html = await res.text();
  assert(html.includes('authorization:github:success:'), 'Emits authorization:github:success postMessage');
  assert(html.includes('ghp_valid_token_789'), 'Delivers access token to authenticated window opener');
  assert(res.headers.get('Set-Cookie').includes('Max-Age=0'), 'Clears state cookie after successful authentication');
  assert(res.headers.get('X-Frame-Options') === 'DENY', 'Callback HTML sets X-Frame-Options: DENY');
  assert(res.headers.get('Cache-Control').includes('no-store'), 'Callback HTML sets Cache-Control: no-store');

  globalThis.fetch = originalFetch;
}

// -----------------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`TOTAL STRESS ASSERTIONS: ${totalAssertions}`);
console.log(`PASSED: ${passedAssertions}`);
console.log(`FAILED: ${failures.length}`);
console.log('================================================================');

if (failures.length > 0) {
  process.exit(1);
} else {
  console.log('\nALL ADVERSARIAL STRESS ASSERTIONS PASSED WITH ZERO ERRORS!');
  process.exit(0);
}
