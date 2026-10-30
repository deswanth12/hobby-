/**
 * Cloudflare Pages Function: /api/callback
 * Handles GitHub OAuth callback, verifies anti-CSRF state, exchanges code for access token,
 * validates user authorization against ALLOWED_USERS whitelist, and returns HTML postMessage bridge.
 * Route: GET /api/callback
 */

/**
 * Safely escapes HTML special characters to prevent Reflected Cross-Site Scripting (XSS).
 * @param {*} str - Raw input string or value to escape
 * @returns {string} - HTML-safe escaped string
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Serializes data into a JSON string safe for direct interpolation inside inline <script> tags.
 * Escapes '<', '>', and '&' to Unicode escape sequences (\u003c, \u003e, \u0026) to prevent
 * HTML script tag breakouts (e.g., </script>) and HTML entity confusion.
 * @param {*} data - Data to serialize
 * @returns {string} - Script-safe JSON string
 */
function safeJsonStringify(data) {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const ghError = url.searchParams.get('error');
  const ghErrorDesc = url.searchParams.get('error_description');

  // 1. Extract cookies
  const cookieHeader = request.headers.get('Cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );
  const storedState = cookies['ka_oauth_state'];

  // Helper to render HTML postMessage handshake response
  const renderResponse = (statusCode, type, messageOrToken) => {
    const isSuccess = type === 'success';
    const payload = isSuccess
      ? JSON.stringify({ token: messageOrToken, provider: 'github' })
      : JSON.stringify({ message: messageOrToken });
    const messageType = isSuccess ? 'authorization:github:success:' : 'authorization:github:error:';
    const messageData = messageType + payload;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Kavitha & Associates — Content Manager Authentication</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #FCFCFA;
      color: #0F3E2E;
    }
    .card {
      background: #FFFFFF;
      padding: 2.25rem 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(15, 62, 46, 0.08);
      text-align: center;
      max-width: 440px;
      width: 90%;
      border: 1px solid #E5E7EB;
    }
    .badge {
      display: inline-block;
      width: 48px;
      height: 48px;
      line-height: 48px;
      border-radius: 50%;
      background: ${isSuccess ? '#E8F5E9' : '#FFEBEE'};
      color: ${isSuccess ? '#1B5E20' : '#B71C1C'};
      font-size: 24px;
      margin-bottom: 1rem;
    }
    h2 {
      font-size: 1.25rem;
      margin: 0 0 0.5rem;
      color: #0F3E2E;
      font-weight: 600;
    }
    p {
      font-size: 0.875rem;
      color: #4B5563;
      line-height: 1.5;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">${isSuccess ? '✓' : '✕'}</div>
    <h2>${isSuccess ? 'Authorization Successful' : 'Authentication Failed'}</h2>
    <p id="status-text">${isSuccess ? 'Connecting securely to management console...' : escapeHtml(messageOrToken)}</p>
  </div>
  <script>
    (function () {
      var sent = false;
      var serverOrigin = ${JSON.stringify(url.origin)};
      var trustedOrigin = window.location.origin || serverOrigin || 'https://kavithaassociates.com';

      // Strict whitelist of trusted origins:
      // 1. Current window origin (same-origin with CMS admin)
      // 2. Cloudflare request origin
      // 3. Canonical production domains
      var allowedOrigins = [
        window.location.origin,
        serverOrigin,
        'https://kavithaassociates.com',
        'https://www.kavithaassociates.com'
      ].filter(Boolean);

      function isOriginAllowed(origin) {
        if (!origin || typeof origin !== 'string') return false;
        var normalized = origin.replace(/\\/+$/, '');
        if (allowedOrigins.indexOf(normalized) !== -1) return true;
        if (/^https?:\\/\\/(localhost|127\\.0\\.0\\.1)(:\\d+)?$/.test(normalized)) return true;
        if (/^https?:\\/\\/(?:[a-z0-9-]+\\.)?kavitha-and-associates\\.pages\\.dev$/.test(normalized)) return true;
        return false;
      }

      function deliverMessage(targetOrigin) {
        if (sent) return;
        
        // Enforce that targetOrigin is strictly trusted and NEVER wildcard '*'
        var verifiedOrigin = isOriginAllowed(targetOrigin) ? targetOrigin : (isOriginAllowed(trustedOrigin) ? trustedOrigin : 'https://kavithaassociates.com');
        if (!isOriginAllowed(verifiedOrigin)) {
          console.error('PostMessage delivery aborted: Target origin is not trusted:', targetOrigin);
          return;
        }
        targetOrigin = verifiedOrigin;

        sent = true;
        try {
          if (window.opener) {
            window.opener.postMessage(${safeJsonStringify(messageData)}, targetOrigin);
          }
        } catch (err) {
          console.error('PostMessage transmission error:', err);
        }
        setTimeout(function () {
          window.close();
        }, 300);
      }

      function onMessage(e) {
        // Enforce that message source is strictly the parent opener window
        if (e.source && e.source !== window.opener) return;
        // Enforce incoming message origin verification
        if (isOriginAllowed(e.origin)) {
          deliverMessage(e.origin);
        } else {
          console.warn('Ignored postMessage handshake from untrusted origin:', e.origin);
        }
      }

      if (window.opener) {
        var handshakeOrigin = isOriginAllowed(trustedOrigin) ? trustedOrigin : 'https://kavithaassociates.com';
        window.addEventListener('message', onMessage, false);
        window.opener.postMessage('authorizing:github', handshakeOrigin);
        // Fallback: If opener does not echo handshake within 1200ms, deliver directly to trusted origin
        setTimeout(function () {
          deliverMessage(handshakeOrigin);
        }, 1200);
      } else {
        var el = document.getElementById('status-text');
        if (el) {
          el.textContent = 'Error: Window opener not found. Please log in directly from the CMS admin dashboard.';
        }
      }
    })();
  </script>
</body>
</html>`;

    const headers = new Headers({
      'Content-Type': 'text/html; charset=utf-8',
      'Set-Cookie': 'ka_oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
    });

    return new Response(html, {
      status: statusCode,
      headers: headers
    });
  };

  // 2. Check for GitHub OAuth error parameters (e.g. user cancelled consent)
  if (ghError) {
    return renderResponse(403, 'error', ghErrorDesc || `GitHub OAuth error: ${ghError}`);
  }

  // 3. Validate CSRF state
  if (!state || !storedState || state !== storedState) {
    return renderResponse(403, 'error', 'CSRF State validation failed. Possible cross-site request forgery or session expired.');
  }

  // 4. Validate authorization code
  if (!code) {
    return renderResponse(400, 'error', 'Missing authorization code from GitHub callback.');
  }

  // 5. Validate server environment configuration
  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return renderResponse(500, 'error', 'Server configuration error: OAuth credentials missing.');
  }

  try {
    // 6. Server-to-server token exchange with GitHub
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Cloudflare-Pages-Auth-Proxy-Kavitha'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code
      })
    });

    if (!tokenRes.ok) {
      return renderResponse(tokenRes.status, 'error', `GitHub token exchange failed with HTTP status ${tokenRes.status}.`);
    }

    const tokenData = await tokenRes.json();
    if (tokenData.error || !tokenData.access_token) {
      return renderResponse(403, 'error', tokenData.error_description || tokenData.error || 'Failed to exchange authorization code for GitHub access token.');
    }

    const accessToken = tokenData.access_token;

    // 7. Server-Side Authorization Boundary Check (AC 33 & AC 34)
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'Cloudflare-Pages-Auth-Proxy-Kavitha',
        'Accept': 'application/vnd.github+json'
      }
    });

    if (!userRes.ok) {
      return renderResponse(userRes.status, 'error', 'Failed to retrieve GitHub user profile for authorization verification.');
    }

    const userData = await userRes.json();
    const username = (userData.login || '').trim().toLowerCase();

    // 8. Whitelist verification against ALLOWED_USERS (Fail-closed)
    const rawAllowed = env.ALLOWED_USERS || '';
    if (!rawAllowed.trim()) {
      return renderResponse(403, 'error', 'Access Denied: ALLOWED_USERS whitelist is not configured on server (fail-closed).');
    }

    const allowedList = rawAllowed
      .split(',')
      .map(u => u.trim().toLowerCase())
      .filter(Boolean);

    if (!allowedList.includes(username)) {
      return renderResponse(403, 'error', `Access Denied: Account '${username}' is not authorized to manage content for Kavitha & Associates.`);
    }

    // 9. Successful authorization
    return renderResponse(200, 'success', accessToken);

  } catch (err) {
    return renderResponse(500, 'error', `Internal server error during authentication: ${err.message}`);
  }
}
