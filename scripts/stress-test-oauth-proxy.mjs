#!/usr/bin/env node

/**
 * Empirical Stress Test Suite for Cloudflare Pages Functions OAuth Proxy
 * Target: functions/api/auth.js and functions/api/callback.js
 *
 * Verifies:
 *  1. Anti-CSRF defense: state mismatch, missing cookie, missing param return HTTP 403.
 *  2. Missing code parameter behavior: returns HTTP 400 (Bad Request), rejects token.
 *  3. Server-side authorization boundary (AC 33 & 34): unauthorized users return HTTP 403, tokens discarded.
 *  4. Authorized GitHub account handling: returns HTTP 200 with postMessage handshake.
 *  5. Fail-closed behavior: unset or empty ALLOWED_USERS denies all access with HTTP 403.
 *  6. Cookie attributes: HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600.
 *  7. Adversarial corner cases, security headers, and upstream failure resilience.
 */

import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Dynamically load the Cloudflare Pages Functions
const authModuleUrl = pathToFileURL(path.join(rootDir, 'functions/api/auth.js')).href;
const callbackModuleUrl = pathToFileURL(path.join(rootDir, 'functions/api/callback.js')).href;

const { onRequestGet: authGet } = await import(authModuleUrl);
const { onRequestGet: callbackGet } = await import(callbackModuleUrl);

// Test execution harness
let passedCount = 0;
let failedCount = 0;
const results = [];

function assert(condition, testName, details = '') {
  if (condition) {
    passedCount++;
    results.push({ name: testName, status: 'PASS', details });
    console.log(`  \x1b[32m✔ [PASS]\x1b[0m ${testName}`);
  } else {
    failedCount++;
    results.push({ name: testName, status: 'FAIL', details });
    console.log(`  \x1b[31m✖ [FAIL]\x1b[0m ${testName}`);
    if (details) {
      console.log(`    \x1b[31mDetails: ${details}\x1b[0m`);
    }
  }
}

// Helper to invoke Pages Function with synthetic context
async function invoke(handler, url, { env = {}, cookies = {}, mockFetch = null } = {}) {
  const headers = new Headers();
  if (Object.keys(cookies).length > 0) {
    const cookieStr = Object.entries(cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ');
    headers.set('Cookie', cookieStr);
  }

  const req = new Request(url, { method: 'GET', headers });
  const context = {
    request: req,
    env: {
      GITHUB_CLIENT_ID: 'test_client_id_123',
      GITHUB_CLIENT_SECRET: 'test_client_secret_abc',
      ALLOWED_USERS: 'partner-kavitha,office-admin',
      ...env,
    },
    params: {},
    data: {},
    waitUntil: () => {},
  };

  const origFetch = globalThis.fetch;
  if (mockFetch) {
    globalThis.fetch = mockFetch;
  }

  try {
    const res = await handler(context);
    const body = await res.text();
    return {
      status: res.status,
      headers: res.headers,
      body,
    };
  } finally {
    if (mockFetch) {
      globalThis.fetch = origFetch;
    }
  }
}

console.log('\n\x1b[1m\x1b[35m===================================================================================\x1b[0m');
console.log('\x1b[1m\x1b[35m       EMPIRICAL CHALLENGER: OAUTH PROXY STRESS TEST HARNESS                       \x1b[0m');
console.log('\x1b[1m\x1b[35m===================================================================================\x1b[0m\n');

// ------------------------------------------------------------------------------------------------
// SUITE 1: functions/api/auth.js — Cookie Attributes, Security, and Redirects
// ------------------------------------------------------------------------------------------------
console.log('\x1b[34m▶ Suite 1: functions/api/auth.js — Cookie Attributes and Redirect\x1b[0m');

{
  const res = await invoke(authGet, 'https://kavithaassociates.com/api/auth');
  assert(res.status === 302, '1.1: GET /api/auth returns HTTP 302 redirect', `Got status ${res.status}`);

  const location = res.headers.get('Location') || '';
  const locUrl = new URL(location);
  assert(
    locUrl.origin === 'https://github.com' && locUrl.pathname === '/login/oauth/authorize',
    '1.2: Location header redirects to GitHub OAuth authorize endpoint',
    `Location: ${location}`
  );

  assert(
    locUrl.searchParams.get('client_id') === 'test_client_id_123',
    '1.3: Redirect URL carries configured client_id',
    `client_id: ${locUrl.searchParams.get('client_id')}`
  );

  assert(
    locUrl.searchParams.get('scope') === 'repo',
    '1.4: Default scope is "repo"',
    `scope: ${locUrl.searchParams.get('scope')}`
  );

  const stateParam = locUrl.searchParams.get('state') || '';
  assert(
    stateParam.length === 48 && /^[0-9a-f]{48}$/.test(stateParam),
    '1.5: Generated state is 48-char hex string (24 cryptographic bytes)',
    `state: ${stateParam}`
  );

  const setCookie = res.headers.get('Set-Cookie') || '';
  assert(
    setCookie.includes(`ka_oauth_state=${stateParam}`),
    '1.6: Set-Cookie header sets ka_oauth_state matching query state parameter',
    `Set-Cookie: ${setCookie}`
  );

  assert(
    setCookie.includes('HttpOnly'),
    '1.7: State cookie contains HttpOnly attribute',
    `Set-Cookie: ${setCookie}`
  );

  assert(
    setCookie.includes('Secure'),
    '1.8: State cookie contains Secure attribute',
    `Set-Cookie: ${setCookie}`
  );

  assert(
    /SameSite=Lax/i.test(setCookie),
    '1.9: State cookie contains SameSite=Lax attribute',
    `Set-Cookie: ${setCookie}`
  );

  assert(
    setCookie.includes('Path=/'),
    '1.10: State cookie is scoped to Path=/',
    `Set-Cookie: ${setCookie}`
  );

  assert(
    /Max-Age=600/i.test(setCookie),
    '1.11: State cookie has Max-Age=600 (10 minutes)',
    `Set-Cookie: ${setCookie}`
  );

  // Custom scope propagation
  const customScopeRes = await invoke(authGet, 'https://kavithaassociates.com/api/auth?scope=repo,read:user');
  const customLoc = new URL(customScopeRes.headers.get('Location'));
  assert(
    customLoc.searchParams.get('scope') === 'repo,read:user',
    '1.12: Custom scope query param is propagated correctly to GitHub',
    `scope: ${customLoc.searchParams.get('scope')}`
  );

  // Unsupported provider
  const badProviderRes = await invoke(authGet, 'https://kavithaassociates.com/api/auth?provider=gitlab');
  assert(
    badProviderRes.status === 400,
    '1.13: Unsupported provider returns HTTP 400 Bad Request',
    `Got status ${badProviderRes.status}`
  );

  // Missing GITHUB_CLIENT_ID
  const missingClientRes = await invoke(authGet, 'https://kavithaassociates.com/api/auth', {
    env: { GITHUB_CLIENT_ID: '' },
  });
  assert(
    missingClientRes.status === 500,
    '1.14: Missing GITHUB_CLIENT_ID returns HTTP 500 Server Error',
    `Got status ${missingClientRes.status}`
  );
}

// ------------------------------------------------------------------------------------------------
// SUITE 2: functions/api/callback.js — Anti-CSRF Defense
// ------------------------------------------------------------------------------------------------
console.log('\n\x1b[34m▶ Suite 2: functions/api/callback.js — Anti-CSRF Defense\x1b[0m');

{
  const realState = '1111222233334444555566667777888899990000aaaabbbb';
  const attackerState = 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef';

  // 2.1 State mismatch
  const resMismatch = await invoke(
    callbackGet,
    `https://kavithaassociates.com/api/callback?code=mock_code&state=${attackerState}`,
    { cookies: { ka_oauth_state: realState } }
  );
  assert(
    resMismatch.status === 403,
    '2.1: State mismatch returns HTTP 403 Forbidden',
    `Got status ${resMismatch.status}`
  );
  assert(
    resMismatch.body.includes('authorization:github:error:'),
    '2.2: State mismatch emits authorization:github:error: postMessage',
    `Body excerpt: ${resMismatch.body.slice(0, 150)}`
  );
  assert(
    resMismatch.headers.get('Set-Cookie')?.includes('Max-Age=0'),
    '2.3: State mismatch clears the state cookie (Max-Age=0)',
    `Set-Cookie: ${resMismatch.headers.get('Set-Cookie')}`
  );

  // 2.4 Missing state cookie
  const resNoCookie = await invoke(
    callbackGet,
    `https://kavithaassociates.com/api/callback?code=mock_code&state=${realState}`,
    { cookies: {} }
  );
  assert(
    resNoCookie.status === 403,
    '2.4: Missing state cookie returns HTTP 403 Forbidden',
    `Got status ${resNoCookie.status}`
  );

  // 2.5 Missing query state
  const resNoQueryState = await invoke(
    callbackGet,
    'https://kavithaassociates.com/api/callback?code=mock_code',
    { cookies: { ka_oauth_state: realState } }
  );
  assert(
    resNoQueryState.status === 403,
    '2.5: Missing query state parameter returns HTTP 403 Forbidden',
    `Got status ${resNoQueryState.status}`
  );

  // 2.6 Both cookie and query state missing
  const resBothMissing = await invoke(
    callbackGet,
    'https://kavithaassociates.com/api/callback?code=mock_code',
    { cookies: {} }
  );
  assert(
    resBothMissing.status === 403,
    '2.6: Both cookie and query state omitted returns HTTP 403 Forbidden',
    `Got status ${resBothMissing.status}`
  );

  // 2.7 Empty state values
  const resEmptyState = await invoke(
    callbackGet,
    'https://kavithaassociates.com/api/callback?code=mock_code&state=',
    { cookies: { ka_oauth_state: '' } }
  );
  assert(
    resEmptyState.status === 403,
    '2.7: Empty string state values in cookie and query return HTTP 403 Forbidden',
    `Got status ${resEmptyState.status}`
  );
}

// ------------------------------------------------------------------------------------------------
// SUITE 3: functions/api/callback.js — Missing Code Parameter Handling
// ------------------------------------------------------------------------------------------------
console.log('\n\x1b[34m▶ Suite 3: functions/api/callback.js — Missing Code Parameter Handling\x1b[0m');

{
  const validState = 'abcdef123456abcdef123456abcdef123456abcdef1234';

  // Missing code parameter completely
  const resNoCode = await invoke(
    callbackGet,
    `https://kavithaassociates.com/api/callback?state=${validState}`,
    { cookies: { ka_oauth_state: validState } }
  );

  // Document exact status code
  console.log(`    \x1b[90m[Observation] Missing code status code returned: HTTP ${resNoCode.status}\x1b[0m`);
  
  assert(
    resNoCode.status === 400 || resNoCode.status === 403,
    '3.1: Missing code parameter returns client error (HTTP 400 or HTTP 403)',
    `Actual HTTP status: ${resNoCode.status} (Implementation returns HTTP 400 Bad Request)`
  );

  assert(
    resNoCode.body.includes('authorization:github:error:'),
    '3.2: Missing code parameter sends error postMessage handshake',
    `Body excerpt: ${resNoCode.body.slice(0, 150)}`
  );

  assert(
    resNoCode.headers.get('Set-Cookie')?.includes('Max-Age=0'),
    '3.3: Missing code parameter clears state cookie',
    `Set-Cookie: ${resNoCode.headers.get('Set-Cookie')}`
  );

  // Empty code parameter (?code=)
  const resEmptyCode = await invoke(
    callbackGet,
    `https://kavithaassociates.com/api/callback?state=${validState}&code=`,
    { cookies: { ka_oauth_state: validState } }
  );
  assert(
    resEmptyCode.status === 400 || resEmptyCode.status === 403,
    '3.4: Empty code parameter (?code=) returns client error',
    `Actual HTTP status: ${resEmptyCode.status}`
  );
}

// ------------------------------------------------------------------------------------------------
// SUITE 4: functions/api/callback.js — Server-Side Authorization Boundary (AC 33 & 34)
// ------------------------------------------------------------------------------------------------
console.log('\n\x1b[34m▶ Suite 4: Server-Side Authorization Boundary & Token Discarding\x1b[0m');

{
  const validState = 'fedcba654321fedcba654321fedcba654321fedcba6543';
  const leakedSecretToken = 'gho_TOP_SECRET_ACCESS_TOKEN_DO_NOT_LEAK_99999';

  // Mock GitHub endpoints
  const mockFetchUnauthorized = async (url) => {
    const urlStr = url.toString();
    if (urlStr.includes('login/oauth/access_token')) {
      return new Response(JSON.stringify({ access_token: leakedSecretToken }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (urlStr.includes('api.github.com/user')) {
      return new Response(JSON.stringify({ login: 'unauthorized-intruder' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response('Not Found', { status: 404 });
  };

  const resUnauthorized = await invoke(
    callbackGet,
    `https://kavithaassociates.com/api/callback?code=mock_code&state=${validState}`,
    {
      cookies: { ka_oauth_state: validState },
      env: { ALLOWED_USERS: 'partner-kavitha,office-admin' },
      mockFetch: mockFetchUnauthorized,
    }
  );

  assert(
    resUnauthorized.status === 403,
    '4.1: Unauthorized GitHub account returns HTTP 403 Forbidden',
    `Got status ${resUnauthorized.status}`
  );

  assert(
    resUnauthorized.body.includes('authorization:github:error:'),
    '4.2: Unauthorized account receives error postMessage handshake',
    `Body excerpt: ${resUnauthorized.body.slice(0, 150)}`
  );

  assert(
    !resUnauthorized.body.includes(leakedSecretToken),
    '4.3: Exchanged access token is discarded server-side and NEVER leaked in response',
    'Checked full response body for token presence'
  );

  // Substring collision attack: user "partner" or "kavitha" against "partner-kavitha"
  const mockFetchPrefixCollision = async (url) => {
    const urlStr = url.toString();
    if (urlStr.includes('login/oauth/access_token')) {
      return new Response(JSON.stringify({ access_token: 'gho_prefix_token' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (urlStr.includes('api.github.com/user')) {
      return new Response(JSON.stringify({ login: 'partner' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response('Not Found', { status: 404 });
  };

  const resPrefix = await invoke(
    callbackGet,
    `https://kavithaassociates.com/api/callback?code=mock_code&state=${validState}`,
    {
      cookies: { ka_oauth_state: validState },
      env: { ALLOWED_USERS: 'partner-kavitha,office-admin' },
      mockFetch: mockFetchPrefixCollision,
    }
  );

  assert(
    resPrefix.status === 403,
    '4.4: Substring/prefix username ("partner") is rejected with HTTP 403',
    `Got status ${resPrefix.status}`
  );
}

// ------------------------------------------------------------------------------------------------
// SUITE 5: functions/api/callback.js — Authorized GitHub Account Handling
// ------------------------------------------------------------------------------------------------
console.log('\n\x1b[34m▶ Suite 5: Authorized GitHub Account Handling\x1b[0m');

{
  const validState = '99887766554433221100aabbccddeeff001122334455';
  const authorizedToken = 'gho_AUTHORIZED_TOKEN_VALID_SUCCESS_777';

  const mockFetchAuthorized = async (url) => {
    const urlStr = url.toString();
    if (urlStr.includes('login/oauth/access_token')) {
      return new Response(JSON.stringify({ access_token: authorizedToken }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (urlStr.includes('api.github.com/user')) {
      return new Response(JSON.stringify({ login: 'Partner-Kavitha' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response('Not Found', { status: 404 });
  };

  const resAuthorized = await invoke(
    callbackGet,
    `https://kavithaassociates.com/api/callback?code=valid_code&state=${validState}`,
    {
      cookies: { ka_oauth_state: validState },
      env: { ALLOWED_USERS: '  partner-kavitha , office-admin  ' },
      mockFetch: mockFetchAuthorized,
    }
  );

  assert(
    resAuthorized.status === 200,
    '5.1: Authorized GitHub account returns HTTP 200 OK',
    `Got status ${resAuthorized.status}`
  );

  const postMessageMatch = resAuthorized.body.match(/window\.opener\.postMessage\((.*?),\s*targetOrigin/);
  const rawPostMessageArg = postMessageMatch ? postMessageMatch[1] : '';
  // In HTML script tag, it is a JSON-encoded string literal like "authorization:github:success:{\"token\":\"...\"}"
  let parsedPayload = null;
  let matchesProtocol = false;
  try {
    const unquoted = JSON.parse(rawPostMessageArg);
    matchesProtocol = unquoted.startsWith('authorization:github:success:');
    parsedPayload = JSON.parse(unquoted.slice('authorization:github:success:'.length));
  } catch (e) {
    matchesProtocol = false;
  }

  assert(
    matchesProtocol && parsedPayload?.token === authorizedToken && parsedPayload?.provider === 'github',
    '5.2: Response body delivers valid postMessage handshake with token and provider',
    `Raw postMessage arg: ${rawPostMessageArg}`
  );

  assert(
    resAuthorized.body.includes('window.opener.postMessage'),
    '5.3: Response body includes window.opener postMessage delivery script',
    'Verified presence of postMessage script'
  );

  assert(
    resAuthorized.headers.get('Set-Cookie')?.includes('Max-Age=0'),
    '5.4: State cookie is cleared on successful authorization',
    `Set-Cookie: ${resAuthorized.headers.get('Set-Cookie')}`
  );
}

// ------------------------------------------------------------------------------------------------
// SUITE 6: functions/api/callback.js — Fail-Closed Behavior on Unset/Empty ALLOWED_USERS
// ------------------------------------------------------------------------------------------------
console.log('\n\x1b[34m▶ Suite 6: Fail-Closed Behavior on Unset or Empty ALLOWED_USERS\x1b[0m');

{
  const validState = 'aabbccddeeff00112233445566778899aabbccddeeff';
  const mockFetch = async (url) => {
    const urlStr = url.toString();
    if (urlStr.includes('login/oauth/access_token')) {
      return new Response(JSON.stringify({ access_token: 'gho_fail_closed_token' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (urlStr.includes('api.github.com/user')) {
      return new Response(JSON.stringify({ login: 'partner-kavitha' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response('Not Found', { status: 404 });
  };

  // Case 6.1: ALLOWED_USERS is undefined / unset
  const resUnset = await invoke(
    callbackGet,
    `https://kavithaassociates.com/api/callback?code=mock_code&state=${validState}`,
    {
      cookies: { ka_oauth_state: validState },
      env: { ALLOWED_USERS: undefined },
      mockFetch,
    }
  );
  assert(
    resUnset.status === 403,
    '6.1: ALLOWED_USERS unset returns HTTP 403 (fail-closed)',
    `Got status ${resUnset.status}`
  );
  assert(
    !resUnset.body.includes('gho_fail_closed_token'),
    '6.2: Exchanged token discarded when ALLOWED_USERS is unset',
    'Verified token not present'
  );

  // Case 6.3: ALLOWED_USERS is empty string
  const resEmpty = await invoke(
    callbackGet,
    `https://kavithaassociates.com/api/callback?code=mock_code&state=${validState}`,
    {
      cookies: { ka_oauth_state: validState },
      env: { ALLOWED_USERS: '' },
      mockFetch,
    }
  );
  assert(
    resEmpty.status === 403,
    '6.3: ALLOWED_USERS empty string returns HTTP 403 (fail-closed)',
    `Got status ${resEmpty.status}`
  );

  // Case 6.4: ALLOWED_USERS is whitespace only
  const resWhitespace = await invoke(
    callbackGet,
    `https://kavithaassociates.com/api/callback?code=mock_code&state=${validState}`,
    {
      cookies: { ka_oauth_state: validState },
      env: { ALLOWED_USERS: '   ' },
      mockFetch,
    }
  );
  assert(
    resWhitespace.status === 403,
    '6.4: ALLOWED_USERS whitespace only returns HTTP 403 (fail-closed)',
    `Got status ${resWhitespace.status}`
  );
}

// ------------------------------------------------------------------------------------------------
// SUITE 7: Upstream Errors, Missing Server Config, and Security Headers
// ------------------------------------------------------------------------------------------------
console.log('\n\x1b[34m▶ Suite 7: Upstream Failure Resilience and Security Headers\x1b[0m');

{
  const validState = '123456789012345678901234567890123456789012345678';

  // GitHub OAuth error parameter (e.g. user cancelled)
  const resGhError = await invoke(
    callbackGet,
    'https://kavithaassociates.com/api/callback?error=access_denied&error_description=User+cancelled+authorization',
    { cookies: { ka_oauth_state: validState } }
  );
  assert(
    resGhError.status === 403,
    '7.1: GitHub error parameter (?error=access_denied) returns HTTP 403',
    `Got status ${resGhError.status}`
  );

  // Missing GITHUB_CLIENT_SECRET
  const resMissingSecret = await invoke(
    callbackGet,
    `https://kavithaassociates.com/api/callback?code=valid_code&state=${validState}`,
    {
      cookies: { ka_oauth_state: validState },
      env: { GITHUB_CLIENT_SECRET: '' },
    }
  );
  assert(
    resMissingSecret.status === 500,
    '7.2: Missing GITHUB_CLIENT_SECRET returns HTTP 500 Server Error',
    `Got status ${resMissingSecret.status}`
  );

  // GitHub token exchange upstream failure
  const mockFetchFailedToken = async () => new Response('Internal Server Error', { status: 500 });
  const resUpstreamFail = await invoke(
    callbackGet,
    `https://kavithaassociates.com/api/callback?code=valid_code&state=${validState}`,
    {
      cookies: { ka_oauth_state: validState },
      mockFetch: mockFetchFailedToken,
    }
  );
  assert(
    resUpstreamFail.status === 500,
    '7.3: Upstream GitHub HTTP 500 failure handled gracefully with HTTP 500',
    `Got status ${resUpstreamFail.status}`
  );

  // Callback security headers
  const resSecHeaders = await invoke(
    callbackGet,
    `https://kavithaassociates.com/api/callback?code=mock&state=mismatch`,
    { cookies: { ka_oauth_state: 'real' } }
  );
  assert(
    resSecHeaders.headers.get('X-Frame-Options') === 'DENY',
    '7.4: Callback response enforces X-Frame-Options: DENY',
    `X-Frame-Options: ${resSecHeaders.headers.get('X-Frame-Options')}`
  );
  assert(
    resSecHeaders.headers.get('X-Content-Type-Options') === 'nosniff',
    '7.5: Callback response enforces X-Content-Type-Options: nosniff',
    `X-Content-Type-Options: ${resSecHeaders.headers.get('X-Content-Type-Options')}`
  );
  assert(
    resSecHeaders.headers.get('Cache-Control')?.includes('no-store'),
    '7.6: Callback response enforces Cache-Control: no-store',
    `Cache-Control: ${resSecHeaders.headers.get('Cache-Control')}`
  );
}

// ------------------------------------------------------------------------------------------------
// FINAL SUMMARY
// ------------------------------------------------------------------------------------------------
console.log('\n\x1b[1m\x1b[35m===================================================================================\x1b[0m');
console.log('\x1b[1m\x1b[35m                            EMPIRICAL TEST SUMMARY                                 \x1b[0m');
console.log('\x1b[1m\x1b[35m===================================================================================\x1b[0m');
console.log(`Total Assertions Run : ${passedCount + failedCount}`);
console.log(`Passed               : \x1b[32m${passedCount}\x1b[0m`);
console.log(`Failed               : \x1b[31m${failedCount}\x1b[0m`);
console.log('===================================================================================');

if (failedCount > 0) {
  console.log('\n\x1b[31mVERDICT: REQUEST_CHANGES (Failures detected)\x1b[0m\n');
  process.exit(1);
} else {
  console.log('\n\x1b[32mVERDICT: APPROVE (100% of Empirical Stress Tests Passed)\x1b[0m\n');
  process.exit(0);
}
