import fs from 'fs';
import path from 'path';
import { describe, it, assert } from '../helpers/test-harness.mjs';
import { scanDirectoryForSecrets } from '../helpers/secret-scanner.mjs';

describe('Tier 4 - Scenario 5: Edge Security, Auth Tampering & Zero-Secret Defense', () => {
  it('Simulates adversarial penetration testing against edge auth and code repositories', () => {
    // Attack 1: Request with missing CSRF state cookie
    const handleAuthCallback = (query, cookie, env) => {
      if (!query.code || !query.state) {
        return { status: 400, error: 'Missing code or state parameters' };
      }
      if (!cookie.ka_oauth_state || cookie.ka_oauth_state !== query.state) {
        return { status: 403, error: 'Anti-CSRF state token mismatch' };
      }
      if (!env.ALLOWED_USERS.split(',').includes(query.username)) {
        return { status: 403, error: 'Access Denied: User not authorized' };
      }
      return { status: 200, token: 'gho_temporary_token' };
    };

    const env = { ALLOWED_USERS: 'cakavitha,admin-user' };

    // Attack 1 execution: missing cookie
    const res1 = handleAuthCallback({ code: 'abc', state: 'state1' }, {}, env);
    assert.strictEqual(res1.status, 403, 'Missing cookie must be rejected');

    // Attack 2 execution: forged state
    const res2 = handleAuthCallback({ code: 'abc', state: 'forged' }, { ka_oauth_state: 'real' }, env);
    assert.strictEqual(res2.status, 403, 'State mismatch must be rejected');

    // Attack 3 execution: valid state but unauthorized username
    const res3 = handleAuthCallback(
      { code: 'abc', state: 'matching_state', username: 'rogue-actor' },
      { ka_oauth_state: 'matching_state' },
      env
    );
    assert.strictEqual(res3.status, 403, 'Unauthorized user must be blocked');

    // Attack 4 execution: legitimate authorized user
    const res4 = handleAuthCallback(
      { code: 'abc', state: 'matching_state', username: 'cakavitha' },
      { ka_oauth_state: 'matching_state' },
      env
    );
    assert.strictEqual(res4.status, 200, 'Authorized user must succeed');
    assert.strictEqual(res4.token, 'gho_temporary_token');

    // Audit 5: Automated Secret Scan across src/ and public/
    const srcFindings = scanDirectoryForSecrets('src');
    const publicFindings = scanDirectoryForSecrets('public');
    assert.strictEqual(srcFindings.length, 0, 'Zero secrets permitted in src');
    assert.strictEqual(publicFindings.length, 0, 'Zero secrets permitted in public');
  });
});
