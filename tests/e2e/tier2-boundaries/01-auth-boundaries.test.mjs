import fs from 'fs';
import path from 'path';
import { describe, it, assert } from '../helpers/test-harness.mjs';
import { loadPagesFunction, invokeFunction } from '../helpers/cf-runner.mjs';

describe('Tier 2 - Boundaries: Feature 1 (Auth & OAuth Proxy)', () => {
  const callbackFunctionPath = path.resolve('functions/api/callback.js');

  it('B1.1: Missing code parameter in /api/callback returns HTTP 400 error response', async () => {
    assert.ok(fs.existsSync(callbackFunctionPath), 'Expected callback.js to exist');
    const mod = await loadPagesFunction(callbackFunctionPath);
    const res = await invokeFunction(mod.onRequestGet, 'https://kavithaassociates.com/api/callback?state=xyz', {
      cookies: { ka_oauth_state: 'xyz' },
    });
    
    assert.ok(res.status === 400 || (await res.text()).includes('authorization:github:error:'), 'Missing code must be rejected with 400 or error postMessage');
  });

  it('B1.2: Missing state parameter in query returns 403 CSRF rejection', async () => {
    const mod = await loadPagesFunction(callbackFunctionPath);
    const res = await invokeFunction(mod.onRequestGet, 'https://kavithaassociates.com/api/callback?code=mock_code', {
      cookies: { ka_oauth_state: 'xyz' },
    });
    
    assert.ok(res.status === 403 || (await res.text()).includes('authorization:github:error:'), 'Missing state must trigger CSRF rejection');
  });

  it('B1.3: Missing state cookie returns 403 CSRF rejection', async () => {
    const mod = await loadPagesFunction(callbackFunctionPath);
    const res = await invokeFunction(mod.onRequestGet, 'https://kavithaassociates.com/api/callback?code=mock_code&state=xyz', {
      cookies: {}, // No cookie passed
    });
    
    assert.ok(res.status === 403 || (await res.text()).includes('authorization:github:error:'), 'Missing state cookie must trigger CSRF rejection');
  });

  it('B1.4: Tampered state parameter (mismatch with cookie) returns 403 CSRF error', async () => {
    const mod = await loadPagesFunction(callbackFunctionPath);
    const res = await invokeFunction(mod.onRequestGet, 'https://kavithaassociates.com/api/callback?code=mock_code&state=forged_state', {
      cookies: { ka_oauth_state: 'genuine_state' },
    });
    
    assert.ok(res.status === 403 || (await res.text()).includes('authorization:github:error:'), 'State mismatch must trigger CSRF rejection');
  });

  it('B1.5: Unauthorized username not in ALLOWED_USERS returns 403 and error postMessage', async () => {
    const mod = await loadPagesFunction(callbackFunctionPath);
    const state = 'secure_state_val';
    const mockEnv = {
      GITHUB_CLIENT_ID: 'id',
      GITHUB_CLIENT_SECRET: 'sec',
      ALLOWED_USERS: 'valid-partner',
    };

    const mockFetch = async (url) => {
      if (url.toString().includes('access_token')) {
        return new Response(JSON.stringify({ access_token: 'gho_tok_1' }), { headers: { 'Content-Type': 'application/json' } });
      }
      if (url.toString().includes('api.github.com/user')) {
        return new Response(JSON.stringify({ login: 'random-hacker' }), { headers: { 'Content-Type': 'application/json' } });
      }
      return new Response(null, { status: 404 });
    };

    const res = await invokeFunction(mod.onRequestGet, `https://kavithaassociates.com/api/callback?code=c&state=${state}`, {
      env: mockEnv,
      cookies: { ka_oauth_state: state },
      mockFetch,
    });

    const body = await res.text();
    assert.ok(res.status === 403 || body.includes('authorization:github:error:'), 'Unauthorized username must be blocked');
    assert.notIncludes(body, 'gho_tok_1', 'Access token must never be leaked to unauthorized user');
  });
});
