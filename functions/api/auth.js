/**
 * Cloudflare Pages Function: /api/auth
 * Initiates GitHub OAuth authorization flow with anti-CSRF protection.
 * Route: GET /api/auth
 */
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // 1. Validate provider (default to github)
  const provider = url.searchParams.get('provider') || 'github';
  if (provider !== 'github') {
    return new Response(
      JSON.stringify({ error: `Unsupported OAuth provider: '${provider}'. Only 'github' is supported.` }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // 2. Validate server environment configuration
  const clientId = env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response(
      JSON.stringify({ error: 'Server configuration error: GITHUB_CLIENT_ID is not configured.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // 3. Generate 24-byte cryptographically secure random state (48 hex characters)
  const stateBytes = new Uint8Array(24);
  crypto.getRandomValues(stateBytes);
  const state = Array.from(stateBytes, b => b.toString(16).padStart(2, '0')).join('');

  // 4. Construct callback URL and authorization parameters
  const callbackUrl = `${url.origin}/api/callback`;
  const rawScope = url.searchParams.get('scope') || 'repo';
  const ALLOWED_SCOPES = new Set(['repo', 'public_repo', 'user', 'read:user', 'user:email']);
  const requestedScopes = rawScope.split(',').map(s => s.trim()).filter(Boolean);
  const validScopes = requestedScopes.filter(s => ALLOWED_SCOPES.has(s));
  const scope = validScopes.length > 0 ? validScopes.join(',') : 'repo';

  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
  githubAuthUrl.searchParams.set('client_id', clientId);
  githubAuthUrl.searchParams.set('redirect_uri', callbackUrl);
  githubAuthUrl.searchParams.set('scope', scope);
  githubAuthUrl.searchParams.set('state', state);

  // 5. Construct response with 302 redirect and secure state cookie
  const headers = new Headers();
  headers.set('Location', githubAuthUrl.toString());
  headers.append(
    'Set-Cookie',
    `ka_oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`
  );

  return new Response(null, {
    status: 302,
    headers: headers
  });
}
