const { readDb, writeDb, AUTHORIZED_USERS, getAuthorizedUsers, setUserPassword, hashPassword, verifyPassword, BASELINE_DATA, SESSION_SECRET } = require('./db.cjs');
const crypto = require('crypto');

const MAX_BODY_SIZE = 1024 * 1024; // 1MB payload ceiling

const ALLOWED_ORIGIN_PATTERNS = [
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
  /^https:\/\/(?:[a-z0-9-]+\.)?kavitha-and-associates\.pages\.dev$/,
  /^https:\/\/(?:www\.)?kavithaassociates\.com$/,
  /^https:\/\/(?:[a-z0-9-]+\.)?vercel\.app$/
];

function isOriginAllowed(origin) {
  if (!origin || typeof origin !== 'string') return false;
  return ALLOWED_ORIGIN_PATTERNS.some(p => p.test(origin.trim()));
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function safeJsonStringify(data) {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

function parseCookies(req) {
  const cookieHeader = req.headers['cookie'] || '';
  if (!cookieHeader) return {};
  const cookies = {};
  for (const c of cookieHeader.split(';')) {
    const idx = c.indexOf('=');
    if (idx !== -1) {
      const k = c.slice(0, idx).trim();
      const v = c.slice(idx + 1).trim();
      try {
        cookies[k] = decodeURIComponent(v);
      } catch {
        cookies[k] = v;
      }
    }
  }
  return cookies;
}

const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

function isValidIp(ip) {
  if (!ip || typeof ip !== 'string') return false;
  const clean = ip.startsWith('::ffff:') ? ip.slice(7) : ip;
  return IPV4_REGEX.test(clean) || clean.includes(':');
}

function getClientIp(req) {
  const cfIp = req.headers['cf-connecting-ip'];
  if (typeof cfIp === 'string' && cfIp.trim()) {
    let ip = cfIp.trim();
    if (ip.startsWith('::ffff:')) ip = ip.slice(7);
    if (isValidIp(ip)) return ip;
  }
  const rawForwarded = req.headers['x-forwarded-for'];
  if (typeof rawForwarded === 'string') {
    const parts = rawForwarded.split(',').map(s => s.trim()).filter(Boolean);
    for (const part of parts) {
      let candidate = part.startsWith('::ffff:') ? part.slice(7) : part;
      if (isValidIp(candidate)) return candidate;
    }
  }
  let ip = req.socket?.remoteAddress || '127.0.0.1';
  if (ip.startsWith('::ffff:')) {
    ip = ip.slice(7);
  }
  return ip;
}

function parseJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return Promise.resolve(req.body);
  }
  if (typeof req.body === 'string') {
    try {
      return Promise.resolve(JSON.parse(req.body));
    } catch {
      return Promise.resolve({});
    }
  }
  return new Promise((resolve) => {
    let body = '';
    let bytesReceived = 0;
    let aborted = false;

    req.on('data', chunk => {
      if (aborted) return;
      bytesReceived += chunk.length;
      if (bytesReceived > MAX_BODY_SIZE) {
        aborted = true;
        req.destroy();
        resolve(null);
        return;
      }
      body += chunk;
    });

    req.on('end', () => {
      if (aborted) return;
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });

    req.on('error', () => {
      resolve({});
    });
  });
}

function sendJson(res, statusCode, data, req) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  const origin = req?.headers?.['origin'];
  if (origin && isOriginAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.end(JSON.stringify(data));
}

// Extract session token from Authorization Header or HttpOnly Cookie
function extractSessionToken(req) {
  const authHeader = req.headers['authorization'] || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  const cookieHeader = req.headers['cookie'] || '';
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').map(c => c.trim());
    for (const c of cookies) {
      if (c.startsWith('ka_admin_session=')) {
        return decodeURIComponent(c.substring('ka_admin_session='.length));
      }
    }
  }
  return null;
}

// Sign a stateless cryptographic session token (HMAC-SHA256 JWT)
function signSessionToken(user, db) {
  const jti = crypto.randomBytes(16).toString('hex');
  const nowSec = Math.floor(Date.now() / 1000);
  const userEpoch = db?.userRevocationEpochs?.[user.username] || 0;
  const iat = Math.max(nowSec, userEpoch + 1);
  const exp = iat + 3600; // 1 hour expiration
  const payload = {
    jti,
    sub: user.username,
    name: user.displayName,
    role: user.role,
    iat,
    exp
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payloadB64).digest('base64url');
  return {
    token: `ka_jwt.${payloadB64}.${sig}`,
    payload
  };
}

// Verify a stateless cryptographic session token against signature, expiry & persistent revocation ledger
function verifySessionToken(token, db) {
  if (!token || typeof token !== 'string') return null;

  if (token.startsWith('ka_jwt.')) {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [, payloadB64, sig] = parts;

    // 1. Cryptographic HMAC-SHA256 Verification
    const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(payloadB64).digest('base64url');
    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return null; // Signature mismatch / forged token
    }

    // 2. Decode claims
    let payload;
    try {
      payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    } catch {
      return null;
    }

    // 3. Expiration check
    const nowSec = Math.floor(Date.now() / 1000);
    if (!payload.exp || nowSec >= payload.exp) {
      return null;
    }

    // 4. Shared persistent revocation check (survives restarts and syncs across instances)
    db.revokedTokens = db.revokedTokens || {};
    if (payload.jti && db.revokedTokens[payload.jti]) {
      return null; // Token revoked
    }

    // 5. User-level revocation epoch
    db.userRevocationEpochs = db.userRevocationEpochs || {};
    const userEpoch = db.userRevocationEpochs[payload.sub] || 0;
    if (payload.iat <= userEpoch) {
      return null; // User sessions invalidated
    }

    return {
      token,
      user: {
        username: payload.sub,
        displayName: payload.name,
        role: payload.role
      },
      jti: payload.jti,
      expiresAt: payload.exp * 1000
    };
  }

  // Fallback for legacy local development tokens
  const session = db.sessions?.[token];
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    delete db.sessions[token];
    writeDb(db);
    return null;
  }
  return session;
}

// Revoke session token in shared persistent ledger
function revokeSessionToken(token, db) {
  if (!token || typeof token !== 'string') return;
  db.revokedTokens = db.revokedTokens || {};

  if (token.startsWith('ka_jwt.')) {
    try {
      const parts = token.split('.');
      const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
      if (payload.jti) {
        db.revokedTokens[payload.jti] = payload.exp || Math.floor(Date.now() / 1000) + 3600;
      }
    } catch {
      // ignore
    }
  } else if (db.sessions && db.sessions[token]) {
    delete db.sessions[token];
  }

  // Prune expired revocations
  const nowSec = Math.floor(Date.now() / 1000);
  for (const id in db.revokedTokens) {
    if (db.revokedTokens[id] < nowSec) {
      delete db.revokedTokens[id];
    }
  }
  writeDb(db);
}

// Token Verification Middleware
function authenticateRequest(req, db) {
  const token = extractSessionToken(req);
  if (!token) {
    return null;
  }
  return verifySessionToken(token, db);
}

async function handleApiRequest(req, res) {
  const url = new URL(req.url, 'http://localhost');
  let pathname = url.pathname;
  if (!pathname.startsWith('/api')) {
    pathname = '/api' + (pathname.startsWith('/') ? pathname : '/' + pathname);
  }
  const method = req.method;

  // OPTIONS Preflight Handling with Strict Whitelist
  if (method === 'OPTIONS') {
    res.statusCode = 204;
    const origin = req.headers['origin'];
    if (origin && isOriginAllowed(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.end();
  }

  // Google Search Console Site Verification
  if (pathname === '/google66e0145809155f23.html' || pathname === '/api/google66e0145809155f23.html') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.end('google-site-verification: google66e0145809155f23.html');
  }

  // 1. Health & Database Mode Endpoint
  if (method === 'GET' && (pathname === '/api/health' || pathname === '/api/status')) {
    const db = readDb();
    return sendJson(res, 200, {
      status: 'connected',
      engine: 'shared-database',
      database: 'PostgreSQL / Shared Database Active',
      synchronized: true,
      totalEnquiries: db.enquiries.length,
      timestamp: new Date().toISOString()
    });
  }

  // 2. Public Content Endpoint (Returns published items)
  if (method === 'GET' && pathname === '/api/content') {
    const db = readDb();
    return sendJson(res, 200, {
      services: db.services.filter(s => s.status === 'published'),
      allServices: db.services,
      faqs: db.faqs.filter(f => f.status === 'published'),
      allFaqs: db.faqs,
      settings: db.settings
    });
  }

  // 3. Public Practice Settings Endpoint
  if (method === 'GET' && pathname === '/api/settings') {
    const db = readDb();
    return sendJson(res, 200, db.settings);
  }

  // 4. Public Contact Form Submission Endpoint
  if (method === 'POST' && pathname === '/api/enquiries') {
    const body = await parseJsonBody(req);
    if (body === null) {
      return sendJson(res, 413, { success: false, error: 'Payload too large. Maximum size is 1MB.' }, req);
    }
    
    // Honeypot spam detection
    if (body.website_fax_hp) {
      // Fake success for bots
      return sendJson(res, 200, { success: true, message: 'Enquiry registered.' }, req);
    }

    // Enquiry Rate Limiting by IP (max 20 per 10 minutes)
    const clientIp = getClientIp(req);
    const db = readDb();
    db.enquiryRateLimits = db.enquiryRateLimits || {};
    const enqKey = `enq_${clientIp}`;
    const enqInfo = db.enquiryRateLimits[enqKey] || { count: 0, resetAt: Date.now() + 10 * 60 * 1000 };

    if (Date.now() > enqInfo.resetAt) {
      enqInfo.count = 0;
      enqInfo.resetAt = Date.now() + 10 * 60 * 1000;
    }

    if (enqInfo.count >= 20) {
      return sendJson(res, 429, {
        success: false,
        error: 'Too many consultation inquiries submitted from this network. Please retry in 10 minutes.'
      }, req);
    }

    // Input Validation
    const fullName = (body.fullName || '').trim();
    const phone = (body.phone || '').trim();
    const message = (body.message || '').trim();
    const email = (body.email || '').trim();

    if (fullName.length < 2 || fullName.length > 100) {
      return sendJson(res, 400, { success: false, error: 'Full name must be between 2 and 100 characters.' }, req);
    }
    const digitCount = (phone.replace(/\D/g, '')).length;
    if (phone.length < 8 || phone.length > 20 || !/^[0-9+\s\-()]{8,20}$/.test(phone) || digitCount < 7) {
      return sendJson(res, 400, { success: false, error: 'Please provide a valid contact number (min 7 digits, max 20).' }, req);
    }
    if (message.length < 5 || message.length > 3000) {
      return sendJson(res, 400, { success: false, error: 'Message description must be between 5 and 3000 characters.' }, req);
    }
    if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      return sendJson(res, 400, { success: false, error: 'Please provide a valid email address.' }, req);
    }

    enqInfo.count += 1;
    db.enquiryRateLimits[enqKey] = enqInfo;

    // Deduplication Guard: Check if an identical submission was received within the last 60 seconds
    const recentDuplicate = (db.enquiries || []).find(e => 
      e.phone === phone && 
      e.message === message && 
      (Date.now() - new Date(e.createdAt).getTime()) < 60000
    );

    if (recentDuplicate) {
      return sendJson(res, 200, {
        success: true,
        enquiry: recentDuplicate,
        duplicate: true,
        message: 'Consultation inquiry registered successfully in practice database.'
      }, req);
    }

    const newEnquiry = {
      id: `ENQ-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 899 + 100)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fullName,
      entityType: (body.entityType || 'Private Limited Company').trim().slice(0, 100),
      organization: (body.organization || '').trim().slice(0, 150),
      phone,
      email,
      serviceCategory: (body.serviceCategory || 'Audit & Assurance Services').trim().slice(0, 100),
      city: (body.city || 'Tirupati').trim().slice(0, 100),
      urgency: (body.urgency || 'routine').slice(0, 50),
      message,
      status: 'new',
      followUpNotes: ''
    };

    db.enquiries.unshift(newEnquiry);
    writeDb(db);

    return sendJson(res, 201, {
      success: true,
      enquiry: newEnquiry,
      message: 'Consultation inquiry registered successfully in practice database.'
    }, req);
  }

  // 5. Authentication: Login
  if (method === 'POST' && pathname === '/api/auth/login') {
    const body = await parseJsonBody(req);
    if (body === null) {
      return sendJson(res, 413, { success: false, error: 'Payload too large.' }, req);
    }
    const username = (body.username || '').trim().toLowerCase();
    const password = (body.password || '').trim();

    const db = readDb();
    db.rateLimits = db.rateLimits || {};

    const ip = getClientIp(req);
    const rateKey = `${ip}_${username}`;
    const rateInfo = db.rateLimits[rateKey] || { attempts: 0, lockoutUntil: 0 };

    if (rateInfo.lockoutUntil && Date.now() < rateInfo.lockoutUntil) {
      const remainingMinutes = Math.ceil((rateInfo.lockoutUntil - Date.now()) / 60000);
      return sendJson(res, 429, {
        success: false,
        error: `Account locked due to consecutive failed attempts. Please retry in ${remainingMinutes} minute(s).`
      });
    }

    const authorizedUsers = getAuthorizedUsers(db);
    const matchUser = authorizedUsers.find(u => {
      const uName = u.username.toLowerCase();
            const input = username.toLowerCase();
            const inputPrefix = input.split('@')[0];
            if (uName === 'kavitha') {
              return (
                input === 'kavitha' || 
                inputPrefix === 'kavitha' || 
                input === 'cakavithasrj@gmail.com' || 
                inputPrefix === 'cakavithasrj'
              );
            }
            if (uName === 'admin') {
              return input === 'admin' || inputPrefix === 'admin';
            }
            return uName === input || uName === inputPrefix;
    });

    if (!matchUser) {
      rateInfo.attempts += 1;
      if (rateInfo.attempts >= 5) {
        rateInfo.lockoutUntil = Date.now() + 15 * 60 * 1000; // 15 mins
      }
      db.rateLimits[rateKey] = rateInfo;
      writeDb(db);

      const remaining = Math.max(0, 5 - rateInfo.attempts);
      return sendJson(res, 401, {
        success: false,
        error: `Invalid credentials. (${remaining} attempts remaining before security lockout)`
      });
    }

    // Fail-Closed Enforcement: If account credentials are not configured in environment or database, deny login
    if (!matchUser.isConfigured || !matchUser.passwordHash || !matchUser.salt) {
      return sendJson(res, 503, {
        success: false,
        error: 'Administrative access for this account has not been configured in server environment. Authentication failed closed.'
      }, req);
    }

    const isValid = verifyPassword(password, matchUser.passwordHash, matchUser.salt, matchUser.iterations);
    if (!isValid) {
      rateInfo.attempts += 1;
      if (rateInfo.attempts >= 5) {
        rateInfo.lockoutUntil = Date.now() + 15 * 60 * 1000; // 15 mins
      }
      db.rateLimits[rateKey] = rateInfo;
      writeDb(db);

      const remaining = Math.max(0, 5 - rateInfo.attempts);
      return sendJson(res, 401, {
        success: false,
        error: `Invalid credentials. (${remaining} attempts remaining before security lockout)`
      });
    }

    // Success: Reset rate limits
    delete db.rateLimits[rateKey];

    // Issue stateless cryptographic token with embedded claims and HMAC signature
    const { token, payload } = signSessionToken(matchUser, db);
    const session = {
      token,
      user: {
        username: matchUser.username,
        displayName: matchUser.displayName,
        role: matchUser.role,
        lastLogin: new Date().toISOString()
      },
      expiresAt: payload.exp * 1000
    };

    // Also persist in db.sessions for audit and backward compatibility
    db.sessions = db.sessions || {};
    db.sessions[token] = session;
    writeDb(db);

    const origin = req.headers['origin'] || '';
    const forwardedHost = req.headers['x-forwarded-host'] || req.headers['host'] || '';
    const isProdDomain = origin.includes('kavithaassociates.com') || origin.includes('pages.dev') ||
                         forwardedHost.includes('kavithaassociates.com') || forwardedHost.includes('pages.dev');
    const isSecure = isProdDomain || req.headers['x-forwarded-proto'] === 'https' || req.socket?.encrypted || process.env.NODE_ENV === 'production';
    const cookieFlags = [
      `ka_admin_session=${encodeURIComponent(token)}`,
      'Path=/',
      'HttpOnly',
      'SameSite=Strict',
      'Max-Age=3600'
    ];
    if (isSecure) {
      cookieFlags.push('Secure');
    }
    res.setHeader('Set-Cookie', cookieFlags.join('; '));

    return sendJson(res, 200, { success: true, session }, req);
  }

  // 6. Authentication: Logout
  if (method === 'POST' && pathname === '/api/auth/logout') {
    const token = extractSessionToken(req);
    if (token) {
      const db = readDb();
      revokeSessionToken(token, db);
    }
    const origin = req.headers['origin'] || '';
    const forwardedHost = req.headers['x-forwarded-host'] || req.headers['host'] || '';
    const isProdDomain = origin.includes('kavithaassociates.com') || origin.includes('pages.dev') ||
                         forwardedHost.includes('kavithaassociates.com') || forwardedHost.includes('pages.dev');
    const isSecure = isProdDomain || req.headers['x-forwarded-proto'] === 'https' || req.socket?.encrypted || process.env.NODE_ENV === 'production';
    const cookieFlags = [
      'ka_admin_session=',
      'Path=/',
      'HttpOnly',
      'SameSite=Strict',
      'Max-Age=0'
    ];
    if (isSecure) {
      cookieFlags.push('Secure');
    }
    res.setHeader('Set-Cookie', cookieFlags.join('; '));
    return sendJson(res, 200, { success: true, message: 'Session terminated and revoked in persistent ledger.' }, req);
  }

  // 7. Authentication: Check Session
  if (method === 'GET' && pathname === '/api/auth/session') {
    const db = readDb();
    const session = authenticateRequest(req, db);
    if (!session) {
      return sendJson(res, 401, { success: false, error: 'Unauthorized or expired session.' }, req);
    }
    return sendJson(res, 200, { success: true, session }, req);
  }

  // 7b. GitHub OAuth: Initiate Authorization (GET /api/auth)
  if (method === 'GET' && (pathname === '/api/auth' || pathname === '/api/auth/')) {
    const provider = url.searchParams.get('provider') || 'github';
    if (provider !== 'github') {
      return sendJson(res, 400, { error: `Unsupported OAuth provider: '${provider}'. Only 'github' is supported.` }, req);
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    if (!clientId) {
      return sendJson(res, 500, { error: 'Server configuration error: GITHUB_CLIENT_ID is not configured.' }, req);
    }

    // Generate 24-byte cryptographically secure random state (48 hex characters)
    const state = crypto.randomBytes(24).toString('hex');

    // Construct callback URL and authorization parameters
    const forwardedProto = req.headers['x-forwarded-proto'] || (req.socket?.encrypted ? 'https' : 'http');
    const host = req.headers['x-forwarded-host'] || req.headers['host'] || 'localhost';
    const callbackUrl = `${forwardedProto}://${host}/api/callback`;

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

    const isSecure = forwardedProto === 'https' || req.socket?.encrypted || process.env.NODE_ENV === 'production';
    const cookieFlags = [
      `ka_oauth_state=${state}`,
      'Path=/',
      'HttpOnly',
      'SameSite=Lax',
      'Max-Age=600'
    ];
    if (isSecure) {
      cookieFlags.push('Secure');
    }
    res.setHeader('Set-Cookie', cookieFlags.join('; '));
    res.statusCode = 302;
    res.setHeader('Location', githubAuthUrl.toString());
    return res.end();
  }

  // 7c. GitHub OAuth: Callback & Token Exchange (GET /api/callback)
  if (method === 'GET' && (pathname === '/api/callback' || pathname === '/api/callback/')) {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const ghError = url.searchParams.get('error');
    const ghErrorDesc = url.searchParams.get('error_description');

    const cookies = parseCookies(req);
    const storedState = cookies['ka_oauth_state'];

    const forwardedProto = req.headers['x-forwarded-proto'] || (req.socket?.encrypted ? 'https' : 'http');
    const host = req.headers['x-forwarded-host'] || req.headers['host'] || 'localhost';
    const serverOrigin = `${forwardedProto}://${host}`;
    const isSecure = forwardedProto === 'https' || req.socket?.encrypted || process.env.NODE_ENV === 'production';

    const renderOAuthResponse = (statusCode, type, messageOrToken) => {
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
  <title>Kavitha &amp; Associates — Content Manager Authentication</title>
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
      var serverOrigin = ${JSON.stringify(serverOrigin)};
      var trustedOrigin = window.location.origin || serverOrigin || 'https://kavithaassociates.com';

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
        if (/^https?:\\/\\/(?:[a-z0-9-]+\\.)?vercel\\.app$/.test(normalized)) return true;
        return false;
      }

      function deliverMessage(targetOrigin) {
        if (sent) return;
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
        if (e.source && e.source !== window.opener) return;
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
        setTimeout(function () {
          deliverMessage(trustedOrigin);
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

      const cookieClear = [
        'ka_oauth_state=',
        'Path=/',
        'HttpOnly',
        'SameSite=Lax',
        'Max-Age=0'
      ];
      if (isSecure) cookieClear.push('Secure');

      res.statusCode = statusCode;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Set-Cookie', cookieClear.join('; '));
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
      return res.end(html);
    };

    if (ghError) {
      return renderOAuthResponse(403, 'error', ghErrorDesc || `GitHub OAuth error: ${ghError}`);
    }

    if (!state || !storedState || state !== storedState) {
      return renderOAuthResponse(403, 'error', 'CSRF State validation failed. Possible cross-site request forgery or session expired.');
    }

    if (!code) {
      return renderOAuthResponse(400, 'error', 'Missing authorization code from GitHub callback.');
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return renderOAuthResponse(500, 'error', 'Server configuration error: OAuth credentials missing.');
    }

    try {
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Vercel-Node-Auth-Proxy-Kavitha'
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code: code
        })
      });

      if (!tokenRes.ok) {
        return renderOAuthResponse(tokenRes.status, 'error', `GitHub token exchange failed with HTTP status ${tokenRes.status}.`);
      }

      const tokenData = await tokenRes.json();
      if (tokenData.error || !tokenData.access_token) {
        return renderOAuthResponse(403, 'error', tokenData.error_description || tokenData.error || 'Failed to exchange authorization code for GitHub access token.');
      }

      const accessToken = tokenData.access_token;

      // Verify user identity
      const userRes = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'Vercel-Node-Auth-Proxy-Kavitha',
          'Accept': 'application/vnd.github+json'
        }
      });

      if (!userRes.ok) {
        return renderOAuthResponse(userRes.status, 'error', 'Failed to retrieve GitHub user profile for authorization verification.');
      }

      const userData = await userRes.json();
      const username = (userData.login || '').trim().toLowerCase();

      // Whitelist verification against ALLOWED_USERS (Fail-closed)
      const rawAllowed = process.env.ALLOWED_USERS || '';
      if (!rawAllowed.trim()) {
        return renderOAuthResponse(403, 'error', 'Access Denied: ALLOWED_USERS whitelist is not configured on server (fail-closed).');
      }

      const allowedList = rawAllowed
        .split(',')
        .map(u => u.trim().toLowerCase())
        .filter(Boolean);

      if (!allowedList.includes(username)) {
        return renderOAuthResponse(403, 'error', `Access Denied: Account '${username}' is not authorized to manage content for Kavitha & Associates.`);
      }

      return renderOAuthResponse(200, 'success', accessToken);
    } catch (err) {
      return renderOAuthResponse(500, 'error', `Internal server error during authentication: ${err.message}`);
    }
  }

  // ===========================================================================
  // PROTECTED ADMIN ENDPOINTS (Require Authorization: Bearer <token> or ka_admin_session cookie)
  // ===========================================================================
  const db = readDb();
  const authenticatedSession = authenticateRequest(req, db);

  if (!authenticatedSession) {
    return sendJson(res, 401, {
      success: false,
      error: 'Unauthorized: Access to private practice records requires administrator credentials.'
    }, req);
  }

  // Anti-CSRF Protection for State-Changing Administrative Requests (Enforced on ALL mutations)
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const origin = req.headers['origin'];
    if (origin && !isOriginAllowed(origin)) {
      return sendJson(res, 403, { success: false, error: 'Forbidden: Cross-origin administrative mutation denied.' }, req);
    }
    const referer = req.headers['referer'];
    if (!origin && referer) {
      try {
        const refUrl = new URL(referer);
        if (!isOriginAllowed(refUrl.origin)) {
          return sendJson(res, 403, { success: false, error: 'Forbidden: Cross-origin administrative referer denied.' }, req);
        }
      } catch {
        return sendJson(res, 403, { success: false, error: 'Forbidden: Malformed referer header.' }, req);
      }
    }
  }

  // --- A0. Password Change Endpoint ---
  if (method === 'POST' && pathname === '/api/admin/auth/change-password') {
    const body = await parseJsonBody(req);
    if (body === null) {
      return sendJson(res, 413, { success: false, error: 'Payload too large.' }, req);
    }
    const currentPassword = (body.currentPassword || '').trim();
    const newPassword = (body.newPassword || '').trim();

    if (!currentPassword || !newPassword) {
      return sendJson(res, 400, { success: false, error: 'Both current password and new password are required.' }, req);
    }

    if (newPassword.length < 12) {
      return sendJson(res, 400, { success: false, error: 'New password must be at least 12 characters long.' }, req);
    }

    const hasUpper = /[A-Z]/.test(newPassword);
    const hasLower = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

    if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      return sendJson(res, 400, { success: false, error: 'Password must include uppercase, lowercase, numbers, and special characters.' }, req);
    }

    const authorizedUsers = getAuthorizedUsers(db);
    const currentUser = authorizedUsers.find(u => u.username === authenticatedSession.user.username);

    if (!currentUser || !currentUser.passwordHash || !currentUser.salt) {
      return sendJson(res, 404, { success: false, error: 'User not found or unconfigured in practice directory.' }, req);
    }

    const isValidCurrent = verifyPassword(currentPassword, currentUser.passwordHash, currentUser.salt, currentUser.iterations);
    if (!isValidCurrent) {
      return sendJson(res, 401, { success: false, error: 'Incorrect current password.' }, req);
    }

    setUserPassword(authenticatedSession.user.username, newPassword);

    res.setHeader('Set-Cookie', [
      'ka_admin_session=',
      'Path=/',
      'HttpOnly',
      'SameSite=Strict',
      'Max-Age=0'
    ].join('; '));

    return sendJson(res, 200, {
      success: true,
      message: 'Password updated successfully with PBKDF2-SHA512. All existing sessions have been terminated. Please log in with your new password.'
    }, req);
  }

  // --- A1. Global Session Revocation Endpoint ---
  if (method === 'POST' && pathname === '/api/admin/auth/revoke-all') {
    const epoch = Math.floor(Date.now() / 1000) + 1;
    db.userRevocationEpochs = db.userRevocationEpochs || {};
    db.userRevocationEpochs['kavitha'] = epoch;
    db.userRevocationEpochs['admin'] = epoch;
    db.sessions = {};
    writeDb(db);

    res.setHeader('Set-Cookie', [
      'ka_admin_session=',
      'Path=/',
      'HttpOnly',
      'SameSite=Strict',
      'Max-Age=0'
    ].join('; '));

    return sendJson(res, 200, {
      success: true,
      message: 'All administrative sessions and tokens across all users have been revoked.'
    }, req);
  }

  // --- A. Enquiries Management ---
  if (method === 'GET' && pathname === '/api/admin/enquiries') {
    const search = (url.searchParams.get('search') || '').toLowerCase().trim();
    const status = url.searchParams.get('status') || 'all';
    const urgency = url.searchParams.get('urgency') || 'all';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '8', 10);

    let list = db.enquiries || [];

    if (search) {
      list = list.filter(e =>
        e.id.toLowerCase().includes(search) ||
        e.fullName.toLowerCase().includes(search) ||
        (e.organization || '').toLowerCase().includes(search) ||
        e.phone.toLowerCase().includes(search) ||
        (e.email || '').toLowerCase().includes(search) ||
        e.serviceCategory.toLowerCase().includes(search) ||
        e.city.toLowerCase().includes(search)
      );
    }

    if (status !== 'all') {
      list = list.filter(e => e.status === status || (status === 'in-progress' && e.status === 'in-review'));
    }

    if (urgency !== 'all') {
      list = list.filter(e => e.urgency === urgency || (urgency === 'statutory-deadline' && e.urgency === 'Urgent / Approaching Deadline'));
    }

    const total = list.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const paginated = list.slice(start, start + limit);

    return sendJson(res, 200, {
      success: true,
      enquiries: paginated,
      allEnquiries: list,
      total,
      page,
      totalPages
    });
  }

  // --- B. Update Enquiry Status / Notes ---
  if (method === 'PATCH' && pathname.startsWith('/api/admin/enquiries/')) {
    const id = pathname.replace('/api/admin/enquiries/', '');
    const body = await parseJsonBody(req);
    const enquiry = db.enquiries.find(e => e.id === id);

    if (!enquiry) {
      return sendJson(res, 404, { success: false, error: 'Enquiry record not found.' });
    }

    if (body.status) enquiry.status = body.status;
    if (body.followUpNotes !== undefined) enquiry.followUpNotes = body.followUpNotes;
    enquiry.updatedAt = new Date().toISOString();

    writeDb(db);
    return sendJson(res, 200, { success: true, enquiry });
  }

  // --- C. Delete Enquiry ---
  if (method === 'DELETE' && pathname.startsWith('/api/admin/enquiries/')) {
    const id = pathname.replace('/api/admin/enquiries/', '');
    db.enquiries = db.enquiries.filter(e => e.id !== id);
    writeDb(db);
    return sendJson(res, 200, { success: true, message: `Enquiry ${id} deleted.` });
  }

  // --- D. Update Service Content ---
  if (method === 'PUT' && pathname.startsWith('/api/admin/content/services/')) {
    const id = pathname.replace('/api/admin/content/services/', '');
    const body = await parseJsonBody(req);
    let service = db.services.find(s => s.id === id);

    if (!service) {
      service = { id };
      db.services.push(service);
    }

    if (body.title) service.title = body.title.trim();
    if (body.shortDescription) service.shortDescription = body.shortDescription.trim();
    if (body.fullDescription) service.fullDescription = body.fullDescription.trim();
    if (body.statutoryFramework !== undefined) service.statutoryFramework = body.statutoryFramework.trim();
    if (body.targetClients !== undefined) service.targetClients = body.targetClients.trim();
    if (body.status) service.status = body.status;
    service.updatedAt = new Date().toISOString();

    writeDb(db);
    return sendJson(res, 200, { success: true, service });
  }

  // --- E. Update FAQ Content ---
  if (method === 'PUT' && pathname.startsWith('/api/admin/content/faqs/')) {
    const id = pathname.replace('/api/admin/content/faqs/', '');
    const body = await parseJsonBody(req);
    let faq = db.faqs.find(f => f.id === id);

    if (!faq) {
      faq = { id };
      db.faqs.push(faq);
    }

    if (body.question) faq.question = body.question.trim();
    if (body.answer) faq.answer = body.answer.trim();
    if (body.statuteReference !== undefined) faq.statuteReference = body.statuteReference.trim();
    if (body.status) faq.status = body.status;
    faq.updatedAt = new Date().toISOString();

    writeDb(db);
    return sendJson(res, 200, { success: true, faq });
  }

  // --- E2. Update / Create Post Content ---
  if ((method === 'PUT' || method === 'POST') && pathname.startsWith('/api/admin/content/posts/')) {
    const slug = pathname.replace('/api/admin/content/posts/', '').toLowerCase().trim();
    const body = await parseJsonBody(req);
    db.posts = db.posts || [];
    let post = db.posts.find(p => p.slug.toLowerCase().trim() === slug);

    if (!post) {
      post = { slug };
      db.posts.push(post);
    }

    if (body.title) post.title = body.title.trim();
    if (body.excerpt !== undefined) post.excerpt = body.excerpt.trim();
    if (body.content !== undefined) post.content = body.content;
    if (body.tags !== undefined) post.tags = Array.isArray(body.tags) ? body.tags : String(body.tags).split(',').map(t => t.trim()).filter(Boolean);
    if (body.author) post.author = body.author.trim();
    if (body.authorRole) post.authorRole = body.authorRole.trim();
    if (body.coverImage !== undefined) post.coverImage = body.coverImage.trim();
    if (body.coverImageAlt !== undefined) post.coverImageAlt = body.coverImageAlt.trim();
    if (body.draft !== undefined) post.draft = Boolean(body.draft);
    if (body.readingTime !== undefined) post.readingTime = body.readingTime;
    if (body.seo !== undefined) post.seo = body.seo;
    if (!post.date) post.date = new Date().toISOString();
    post.updatedAt = new Date().toISOString();

    writeDb(db);
    return sendJson(res, 200, { success: true, post });
  }

  // --- E3. Delete Post Content ---
  if (method === 'DELETE' && pathname.startsWith('/api/admin/content/posts/')) {
    const slug = pathname.replace('/api/admin/content/posts/', '').toLowerCase().trim();
    db.posts = (db.posts || []).filter(p => p.slug.toLowerCase().trim() !== slug);
    writeDb(db);
    return sendJson(res, 200, { success: true, message: `Post ${slug} removed.` });
  }

  // --- F. Reset Content to Baseline ---
  if (method === 'POST' && pathname === '/api/admin/content/reset') {
    db.services = JSON.parse(JSON.stringify(BASELINE_DATA.services));
    db.faqs = JSON.parse(JSON.stringify(BASELINE_DATA.faqs));
    db.posts = [];
    writeDb(db);
    return sendJson(res, 200, { success: true, message: 'Content restored to baseline.' });
  }

  // --- G. Update Practice Settings ---
  if (method === 'PUT' && pathname === '/api/admin/settings') {
    const body = await parseJsonBody(req);
    db.settings = {
      ...db.settings,
      ...body,
      updatedAt: new Date().toISOString()
    };
    writeDb(db);
    return sendJson(res, 200, { success: true, settings: db.settings });
  }

  // --- H. Reset Settings to Baseline ---
  if (method === 'POST' && pathname === '/api/admin/settings/reset') {
    db.settings = JSON.parse(JSON.stringify(BASELINE_DATA.settings));
    writeDb(db);
    return sendJson(res, 200, { success: true, settings: db.settings });
  }

  return sendJson(res, 404, { error: `Endpoint ${pathname} not found.` });
}

module.exports = {
  handleApiRequest
};
