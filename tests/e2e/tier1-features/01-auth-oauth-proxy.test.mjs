import fs from 'fs';
import path from 'path';
import { describe, it, assert } from '../helpers/test-harness.mjs';
import { loadPagesFunction, invokeFunction } from '../helpers/cf-runner.mjs';

describe('Tier 1 - Feature 1: Server-Side Auth & OAuth Proxy', () => {
  const authFunctionPath = path.resolve('functions/api/auth.js');
  const callbackFunctionPath = path.resolve('functions/api/callback.js');

  it('1.1: functions/api/auth.js exists and exports onRequestGet handler', async () => {
    assert.ok(fs.existsSync(authFunctionPath), 'Expected functions/api/auth.js to exist');
    const mod = await loadPagesFunction(authFunctionPath);
    assert.strictEqual(typeof mod.onRequestGet, 'function', 'auth.js must export onRequestGet function');
  });

  it('1.2: /api/auth initiates GitHub OAuth redirect with client_id, scope, and state', async () => {
    const mod = await loadPagesFunction(authFunctionPath);
    const mockEnv = { GITHUB_CLIENT_ID: 'test_client_id_44' };
    const res = await invokeFunction(mod.onRequestGet, 'https://kavithaassociates.com/api/auth?scope=repo', {
      env: mockEnv,
    });

    assert.strictEqual(res.status, 302, 'Expected HTTP 302 redirect to GitHub');
    const location = res.headers.get('Location');
    assert.ok(location, 'Expected Location header on redirect');
    
    const redirectUrl = new URL(location);
    assert.strictEqual(redirectUrl.origin, 'https://github.com');
    assert.strictEqual(redirectUrl.pathname, '/login/oauth/authorize');
    assert.strictEqual(redirectUrl.searchParams.get('client_id'), 'test_client_id_44');
    assert.strictEqual(redirectUrl.searchParams.get('scope'), 'repo');
    assert.ok(redirectUrl.searchParams.get('state'), 'Expected generated anti-CSRF state parameter');
  });

  it('1.3: /api/auth sets HttpOnly, Secure, SameSite=Lax cookie with state token', async () => {
    const mod = await loadPagesFunction(authFunctionPath);
    const mockEnv = { GITHUB_CLIENT_ID: 'test_client_id_44' };
    const res = await invokeFunction(mod.onRequestGet, 'https://kavithaassociates.com/api/auth', {
      env: mockEnv,
    });

    const setCookie = res.headers.get('Set-Cookie');
    assert.ok(setCookie, 'Expected Set-Cookie header for anti-CSRF state');
    assert.includes(setCookie, 'HttpOnly', 'Cookie must be HttpOnly');
    assert.includes(setCookie, 'Secure', 'Cookie must be Secure');
    assert.includes(setCookie.toLowerCase(), 'samesite=lax', 'Cookie must be SameSite=Lax');
  });

  it('1.4: functions/api/callback.js exists and exports onRequestGet handler', async () => {
    assert.ok(fs.existsSync(callbackFunctionPath), 'Expected functions/api/callback.js to exist');
    const mod = await loadPagesFunction(callbackFunctionPath);
    assert.strictEqual(typeof mod.onRequestGet, 'function', 'callback.js must export onRequestGet function');
  });

  it('1.5: /api/callback validates CSRF state matching the stored cookie', async () => {
    const mod = await loadPagesFunction(callbackFunctionPath);
    const mockEnv = {
      GITHUB_CLIENT_ID: 'test_id',
      GITHUB_CLIENT_SECRET: 'test_sec',
      ALLOWED_USERS: 'authorized-editor',
    };

    // State mismatch test
    const res = await invokeFunction(
      mod.onRequestGet,
      'https://kavithaassociates.com/api/callback?code=mock_code&state=attack_state',
      {
        env: mockEnv,
        cookies: { ka_oauth_state: 'real_secure_state' },
      }
    );

    // Mismatched state should return 403 or error postMessage
    const body = await res.text();
    const isDenied = res.status === 403 || body.includes('authorization:github:error:');
    assert.ok(isDenied, 'CSRF state mismatch must be strictly rejected');
  });

  it('1.6: /api/callback enforces ALLOWED_USERS whitelist server-side before granting token', async () => {
    const mod = await loadPagesFunction(callbackFunctionPath);
    const stateToken = 'state_12345';
    const mockEnv = {
      GITHUB_CLIENT_ID: 'test_id',
      GITHUB_CLIENT_SECRET: 'test_sec',
      ALLOWED_USERS: 'partner-cakavitha,office-admin',
    };

    // Mock fetch to simulate GitHub returning an unauthorized user
    const mockFetch = async (url) => {
      if (url.toString().includes('access_token')) {
        return new Response(JSON.stringify({ access_token: 'gho_secret_token_123' }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (url.toString().includes('api.github.com/user')) {
        return new Response(JSON.stringify({ login: 'unauthorized-intruder' }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(null, { status: 404 });
    };

    const res = await invokeFunction(
      mod.onRequestGet,
      `https://kavithaassociates.com/api/callback?code=valid_code&state=${stateToken}`,
      {
        env: mockEnv,
        cookies: { ka_oauth_state: stateToken },
        mockFetch,
      }
    );

    const body = await res.text();
    const isBlocked = res.status === 403 || body.includes('authorization:github:error:');
    assert.ok(isBlocked, 'User not in ALLOWED_USERS must be blocked with 403 or error message');
    assert.notIncludes(body, 'gho_secret_token_123', 'Token must NEVER be granted to unauthorized user');
  });

  it('1.7: /api/callback transmits token via postMessage handshake to CMS for authorized user', async () => {
    const mod = await loadPagesFunction(callbackFunctionPath);
    const stateToken = 'state_valid_token';
    const mockEnv = {
      GITHUB_CLIENT_ID: 'test_id',
      GITHUB_CLIENT_SECRET: 'test_sec',
      ALLOWED_USERS: 'partner-cakavitha',
    };

    const mockFetch = async (url) => {
      if (url.toString().includes('access_token')) {
        return new Response(JSON.stringify({ access_token: 'gho_valid_authorized_token' }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (url.toString().includes('api.github.com/user')) {
        return new Response(JSON.stringify({ login: 'partner-cakavitha' }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(null, { status: 404 });
    };

    const res = await invokeFunction(
      mod.onRequestGet,
      `https://kavithaassociates.com/api/callback?code=valid_code&state=${stateToken}`,
      {
        env: mockEnv,
        cookies: { ka_oauth_state: stateToken },
        mockFetch,
      }
    );

    assert.strictEqual(res.status, 200, 'Expected HTTP 200 for authorized handshake');
    const body = await res.text();
    assert.includes(body, 'authorization:github:success:', 'Expected postMessage success protocol format');
    assert.includes(body, 'gho_valid_authorized_token', 'Expected authorized token in payload');
  });
});
