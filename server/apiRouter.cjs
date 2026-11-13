const { readDb, writeDb, AUTHORIZED_USERS, getAuthorizedUsers, setUserPassword, hashPassword, verifyPassword, BASELINE_DATA, SESSION_SECRET } = require('./db.cjs');
const durable = require('./durableStorage.cjs');
const crypto = require('crypto');
const assistant = require('./assistant/assistantController.cjs');

const MAX_BODY_SIZE = 1024 * 1024; // 1MB payload ceiling

// Strict Origin Allowlist:
// 1. Local development: localhost & loopback IP on any port
// 2. Production: canonical root and www domains
// 3. Staging/Preview (Cloudflare Pages): project-scoped deployments & branch previews
// 4. Staging/Preview (Vercel): project-scoped deployments & branch previews (no arbitrary wildcard)
// 5. Explicit Environment Variable: ALLOWED_ORIGINS (comma-separated list for custom preview domains)
const ALLOWED_ORIGIN_PATTERNS = [
  // Local development
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
  // Production canonical custom domains
  /^https:\/\/(?:www\.)?kavithaassociates\.com$/,
  // Cloudflare Pages project deployments & branch previews
  /^https:\/\/(?:[a-z0-9-]+\.)?kavitha-and-associates\.pages\.dev$/,
  // Scoped Vercel firm project deployment
  /^https:\/\/kavithaassociates\.vercel\.app$/,
  // Scoped Vercel firm team deployments and verified branch previews
  /^https:\/\/kavitha(?:-[a-z0-9-]+)?-deswanth12s-projects\.vercel\.app$/
];

function isOriginAllowed(origin) {
  if (!origin || typeof origin !== 'string') return false;
  const normalized = origin.trim().replace(/\/+$/, '');

  // Support explicit comma-separated runtime environment variable
  if (process.env.ALLOWED_ORIGINS) {
    const extraAllowed = process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim().replace(/\/+$/, '')).filter(Boolean);
    if (extraAllowed.includes(normalized)) return true;
  }

  return ALLOWED_ORIGIN_PATTERNS.some(p => p.test(normalized));
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
  // 1. Prioritize Cloudflare edge header if present
  const cfIp = req.headers['cf-connecting-ip'];
  if (typeof cfIp === 'string' && cfIp.trim()) {
    let ip = cfIp.trim();
    if (ip.startsWith('::ffff:')) ip = ip.slice(7);
    if (isValidIp(ip)) return ip;
  }

  // 2. Direct socket remote address (prioritized when not behind trusted proxy)
  const rawSocket = req.socket?.remoteAddress;
  let socketIp = rawSocket ? (rawSocket.startsWith('::ffff:') ? rawSocket.slice(7) : rawSocket) : null;

  // If running behind a verified reverse proxy (Vercel or explicit TRUST_PROXY=true)
  if (process.env.VERCEL || process.env.TRUST_PROXY === 'true') {
    const rawForwarded = req.headers['x-forwarded-for'];
    if (typeof rawForwarded === 'string') {
      const parts = rawForwarded.split(',').map(s => s.trim()).filter(Boolean);
      for (const part of parts) {
        let candidate = part.startsWith('::ffff:') ? part.slice(7) : part;
        if (isValidIp(candidate)) return candidate;
      }
    }
  }

  // If socket remote address is a valid non-empty address, prioritize it over untrusted X-Forwarded-For
  if (socketIp && isValidIp(socketIp)) {
    return socketIp;
  }

  // Fallback for mock requests in unit tests where socket is omitted
  const rawForwarded = req.headers['x-forwarded-for'];
  if (typeof rawForwarded === 'string') {
    const parts = rawForwarded.split(',').map(s => s.trim()).filter(Boolean);
    for (const part of parts) {
      let candidate = part.startsWith('::ffff:') ? part.slice(7) : part;
      if (isValidIp(candidate)) return candidate;
    }
  }

  return '127.0.0.1';
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
async function verifySessionToken(token, db) {
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

    // 6. Durable revocation check in Supabase across serverless instances
    const isRevoked = await durable.isTokenRevokedDurable(payload.jti, payload.sub, payload.iat);
    if (isRevoked) {
      return null;
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
  if (typeof token !== 'string' || ['constructor', '__proto__', 'prototype', 'toString', 'valueOf', 'toLocaleString', 'isPrototypeOf', 'propertyIsEnumerable', 'hasOwnProperty'].includes(token.trim())) {
    return null;
  }
  if (!db.sessions || typeof db.sessions !== 'object') return null;
  if (!Object.prototype.hasOwnProperty.call(db.sessions, token)) return null;

  const session = db.sessions[token];
  if (!session || typeof session !== 'object' || typeof session.expiresAt !== 'number') {
    return null;
  }
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
  } else if (db.sessions && Object.prototype.hasOwnProperty.call(db.sessions, token)) {
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

// In-memory short-term deduplication cache for submissions across warm/cold serverless handlers
const recentSubmissionsCache = new Map();

function canonicalizeUsername(input) {
  if (!input || typeof input !== 'string') return '';
  const trimmed = input.trim().toLowerCase();
  const prefix = trimmed.split('@')[0].trim();
  if (trimmed === 'cakavithasrj@gmail.com' || prefix === 'cakavithasrj' || prefix === 'kavitha') {
    return 'kavitha';
  }
  if (prefix === 'admin') {
    return 'admin';
  }
  return prefix || trimmed;
}

// Token Verification Middleware
async function authenticateRequest(req, db) {
  const token = extractSessionToken(req);
  if (!token) {
    return null;
  }
  return await verifySessionToken(token, db);
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
    const durableStatus = durable.getDurableStatus();
    const isConfigured = durable.isDurableConfigured();
    const allEnqs = await durable.readAllEnquiries();
    return sendJson(res, 200, {
      status: isConfigured ? 'connected' : 'local-fallback',
      engine: isConfigured ? 'shared-database' : 'local-file',
      database: isConfigured ? 'PostgreSQL / Shared Database Active' : 'Local File System / Development Fallback',
      synchronized: isConfigured,
      storage: durableStatus,
      totalEnquiries: allEnqs.length,
      timestamp: new Date().toISOString()
    });
  }

  // 2. Public Content Endpoint (Returns published items)
  if (method === 'GET' && pathname === '/api/content') {
    const db = readDb();
    const session = await authenticateRequest(req, db);
    const { active: services, deleted: deletedServices } = await durable.readAllServices();
    const { active: faqs, deleted: deletedFaqs } = await durable.readAllFaqs();
    const slugRedirects = await durable.readSlugRedirects();
    const settings = await durable.readSettings();
    const posts = typeof durable.readAllPosts === 'function' ? await durable.readAllPosts() : (db.posts || []);

    const publishedServices = (services || db.services || []).filter(s => s.status === 'published' && !s.deletedAt).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const publishedFaqs = (faqs || db.faqs || []).filter(f => f.status === 'published' && !f.deletedAt).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const publishedPosts = (posts || db.posts || []).filter(p => !p.draft && !p.deletedAt);

    if (session) {
      // Authenticated admin: include full administrative management datasets
      return sendJson(res, 200, {
        services: publishedServices,
        allServices: (services || db.services || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
        deletedServices: deletedServices || db.deletedServices || [],
        faqs: publishedFaqs,
        allFaqs: (faqs || db.faqs || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
        deletedFaqs: deletedFaqs || db.deletedFaqs || [],
        slugRedirects: slugRedirects || db.slugRedirects || {},
        settings: settings || db.settings,
        posts: publishedPosts,
        allPosts: posts || db.posts || []
      });
    }

    // Unauthenticated caller: return ONLY published, non-deleted items (zero draft or deleted leaks)
    return sendJson(res, 200, {
      services: publishedServices,
      faqs: publishedFaqs,
      slugRedirects: slugRedirects || db.slugRedirects || {},
      settings: settings || db.settings,
      posts: publishedPosts
    });
  }

  // 3. Public Practice Settings Endpoint
  if (method === 'GET' && pathname === '/api/settings') {
    const settings = await durable.readSettings();
    return sendJson(res, 200, settings);
  }

  // 3b. Public Assistant Status Endpoint
  if (method === 'GET' && (pathname === '/api/public/assistant/status' || pathname === '/api/assistant/status')) {
    return assistant.handleAssistantStatus(req, res, { sendJson });
  }

  // 3c. Public Assistant Chat Endpoint
  if (method === 'POST' && (pathname === '/api/public/assistant/chat' || pathname === '/api/assistant/chat')) {
    return assistant.handleAssistantChat(req, res, { parseJsonBody, sendJson, getClientIp });
  }

  // 3d. Authenticated Assistant Reindex Endpoint
  if (method === 'POST' && (pathname === '/api/admin/assistant/reindex' || pathname === '/api/assistant/reindex')) {
    return assistant.handleAssistantReindex(req, res, { sendJson, authenticateRequest, readDb });
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
    const dedupeKey = `${phone}_${message}`;
    const recentDuplicate = (db.enquiries || []).find(e => 
      e.phone === phone && 
      e.message === message && 
      (Date.now() - new Date(e.createdAt).getTime()) < 60000
    ) || (recentSubmissionsCache.has(dedupeKey) && (Date.now() - recentSubmissionsCache.get(dedupeKey).timestamp < 60000) ? recentSubmissionsCache.get(dedupeKey).enquiry : null);

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

    const saveRes = await durable.saveEnquiry(newEnquiry);
    if (!saveRes.success) {
      return sendJson(res, 500, {
        success: false,
        error: saveRes.error || 'Failed to save enquiry in durable storage.'
      }, req);
    }

    recentSubmissionsCache.set(dedupeKey, { timestamp: Date.now(), enquiry: newEnquiry });

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
    const rawUsername = (body.username || '').trim();
    const canonicalUser = canonicalizeUsername(rawUsername);
    const password = (body.password || '').trim();

    const db = readDb();
    db.rateLimits = db.rateLimits || {};

    const ip = getClientIp(req);
    const rateKey = `${ip}_${canonicalUser}`;
    const rateInfo = db.rateLimits[rateKey] || { attempts: 0, lockoutUntil: 0 };

    if (rateInfo.lockoutUntil && Date.now() < rateInfo.lockoutUntil) {
      const remainingMinutes = Math.ceil((rateInfo.lockoutUntil - Date.now()) / 60000);
      return sendJson(res, 429, {
        success: false,
        error: `Account locked due to consecutive failed attempts. Please retry in ${remainingMinutes} minute(s).`
      });
    }

    // Distributed Rate Limiting Check (Across Serverless Containers)
    const durableRate = await durable.checkLoginRateLimit(rateKey);
    if (durableRate.locked) {
      return sendJson(res, 429, {
        success: false,
        error: `Account locked due to consecutive failed attempts. Please retry in ${durableRate.remainingMinutes} minute(s).`
      });
    }

    const authorizedUsers = await durable.readAuthorizedUsers();
    const matchUser = authorizedUsers.find(u => {
      const uName = u.username.toLowerCase();
      return uName === canonicalUser;
    });

    if (!matchUser) {
      const updatedRate = await durable.recordFailedLoginAttempt(rateKey);
      const remaining = Math.max(0, 5 - updatedRate.attempts);
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
      const updatedRate = await durable.recordFailedLoginAttempt(rateKey);
      const remaining = Math.max(0, 5 - updatedRate.attempts);
      return sendJson(res, 401, {
        success: false,
        error: `Invalid credentials. (${remaining} attempts remaining before security lockout)`
      });
    }

    // Success: Reset rate limits across local and distributed stores
    delete db.rateLimits[rateKey];
    writeDb(db);
    await durable.clearLoginRateLimit(rateKey);

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
      if (token.startsWith('ka_jwt.')) {
        try {
          const parts = token.split('.');
          const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
          if (payload.jti) {
            await durable.revokeTokenDurable(payload.jti, payload.exp || (Math.floor(Date.now() / 1000) + 3600));
          }
        } catch {}
      }
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
    const session = await authenticateRequest(req, db);
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
        if (/^https?:\\/\\/kavithaassociates\\.vercel\\.app$/.test(normalized)) return true;
        if (/^https?:\\/\\/kavitha(?:-[a-z0-9-]+)?-deswanth12s-projects\\.vercel\\.app$/.test(normalized)) return true;
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
  const authenticatedSession = await authenticateRequest(req, db);

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

    const authorizedUsers = await durable.readAuthorizedUsers();
    const currentUser = authorizedUsers.find(u => u.username === authenticatedSession.user.username);

    if (!currentUser || !currentUser.passwordHash || !currentUser.salt) {
      return sendJson(res, 404, { success: false, error: 'User not found or unconfigured in practice directory.' }, req);
    }

    const isValidCurrent = verifyPassword(currentPassword, currentUser.passwordHash, currentUser.salt, currentUser.iterations);
    if (!isValidCurrent) {
      return sendJson(res, 401, { success: false, error: 'Incorrect current password.' }, req);
    }

    const updateRes = await durable.updateUserPassword(authenticatedSession.user.username, newPassword);
    if (!updateRes.success) {
      return sendJson(res, 500, { success: false, error: updateRes.error || 'Failed to persist password update in durable store.' }, req);
    }

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
    await durable.revokeAllUserSessionsDurable('kavitha');
    await durable.revokeAllUserSessionsDurable('admin');

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

    let list = await durable.readAllEnquiries();

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
    const ALLOWED_STATUSES = ['new', 'contacted', 'in-progress', 'closed'];
    if (body.status !== undefined && !ALLOWED_STATUSES.includes(body.status)) {
      return sendJson(res, 400, {
        success: false,
        error: `Invalid status '${body.status}'. Status must be one of: ${ALLOWED_STATUSES.join(', ')}.`
      });
    }

    const updateRes = await durable.updateEnquiryStatus(id, body.status, body.followUpNotes);

    if (!updateRes.success) {
      return sendJson(res, 500, { success: false, error: updateRes.error || 'Failed to update enquiry in durable storage.' });
    }

    const allEnqs = await durable.readAllEnquiries();
    const enquiry = allEnqs.find(e => e.id === id);
    if (!enquiry) {
      return sendJson(res, 404, { success: false, error: 'Enquiry record not found.' });
    }

    return sendJson(res, 200, { success: true, enquiry });
  }

  // --- C. Delete Enquiry ---
  if (method === 'DELETE' && pathname.startsWith('/api/admin/enquiries/')) {
    const id = pathname.replace('/api/admin/enquiries/', '');
    const delRes = await durable.deleteEnquiry(id);
    if (!delRes.success) {
      return sendJson(res, 500, { success: false, error: delRes.error || 'Failed to delete enquiry from durable storage.' });
    }
    return sendJson(res, 200, { success: true, message: `Enquiry ${id} deleted.` });
  }

  // --- D. Service Management (CRUD, Reorder, Recovery) ---
  
  // Reorder Services
  if (method === 'PUT' && pathname === '/api/admin/content/services-reorder') {
    const body = await parseJsonBody(req);
    const orderedIds = Array.isArray(body?.orderedIds) ? body.orderedIds : [];
    if (!orderedIds.length) {
      return sendJson(res, 400, { success: false, error: 'orderedIds array required' });
    }
    const reorderRes = await durable.reorderServices(orderedIds);
    if (!reorderRes.success) {
      return sendJson(res, 500, { success: false, error: reorderRes.error || 'Failed to reorder services in durable storage.' });
    }
    return sendJson(res, 200, { success: true, services: reorderRes.services });
  }

  // Create Service
  if (method === 'POST' && pathname === '/api/admin/content/services') {
    const body = await parseJsonBody(req);
    const title = (body?.title || '').trim();
    if (!title || title.length < 2 || title.length > 150) {
      return sendJson(res, 400, { success: false, error: 'Service title must be between 2 and 150 characters.' });
    }

    let slug = (body?.slug || '').trim().toLowerCase();
    if (!slug) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return sendJson(res, 400, { success: false, error: 'Invalid slug format. Use lowercase letters, numbers, and single hyphens.' });
    }

    const { active: existingServices } = await durable.readAllServices();
    if (existingServices.some(s => s.id === slug)) {
      return sendJson(res, 400, { success: false, error: `Service slug "${slug}" already exists.` });
    }

    const maxOrder = existingServices.reduce((max, s) => Math.max(max, s.order || 0), 0);
    const newService = {
      id: slug,
      title,
      shortDescription: (body?.shortDescription || '').trim(),
      fullDescription: (body?.fullDescription || '').trim(),
      statutoryFramework: (body?.statutoryFramework || '').trim(),
      targetClients: (body?.targetClients || '').trim(),
      typicalScenarios: Array.isArray(body?.typicalScenarios) ? body.typicalScenarios.filter(Boolean) : [],
      services: Array.isArray(body?.services) ? body.services.filter(Boolean) : [],
      iconName: (body?.iconName || 'Briefcase').trim(),
      status: body?.status === 'draft' ? 'draft' : 'published',
      order: typeof body?.order === 'number' ? body.order : maxOrder + 1,
      seo: {
        metaTitle: (body?.seo?.metaTitle || `${title} in Tirupati | CA Kavitha & Associates`).trim(),
        metaDescription: (body?.seo?.metaDescription || body?.shortDescription || `Professional ${title} services in Tirupati, AP.`).trim(),
        canonicalUrl: (body?.seo?.canonicalUrl || `https://kavithaassociates.com/services/${slug}`).trim()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saveRes = await durable.saveService(newService);
    if (!saveRes.success) {
      return sendJson(res, 500, { success: false, error: saveRes.error || 'Failed to save service in durable storage.' });
    }
    return sendJson(res, 201, { success: true, service: newService });
  }

  // Recover Service
  if (method === 'POST' && pathname.startsWith('/api/admin/content/services/') && pathname.endsWith('/recover')) {
    const id = pathname.replace('/api/admin/content/services/', '').replace('/recover', '');
    const { active, deleted } = await durable.readAllServices();
    if (!deleted.some(s => s.id === id)) {
      return sendJson(res, 404, { success: false, error: `Service ${id} not found in recovery store.` });
    }
    if (active.some(s => s.id === id)) {
      return sendJson(res, 400, { success: false, error: `An active service with slug "${id}" already exists.` });
    }
    const recRes = await durable.recoverService(id);
    if (!recRes.success) {
      return sendJson(res, 500, { success: false, error: recRes.error || 'Failed to recover service from durable storage.' });
    }
    return sendJson(res, 200, { success: true, service: recRes.service });
  }

  // Update Service
  if (method === 'PUT' && pathname.startsWith('/api/admin/content/services/')) {
    const id = pathname.replace('/api/admin/content/services/', '');
    const body = await parseJsonBody(req);
    const { active: services } = await durable.readAllServices();
    let service = services.find(s => s.id === id);

    if (!service) {
      return sendJson(res, 404, { success: false, error: `Service ${id} not found.` });
    }

    if (body.slug && body.slug !== id) {
      const newSlug = body.slug.trim().toLowerCase();
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(newSlug)) {
        return sendJson(res, 400, { success: false, error: 'Invalid slug format.' });
      }
      if (services.some(s => s.id === newSlug && s.id !== id)) {
        return sendJson(res, 400, { success: false, error: `Slug "${newSlug}" is already in use by another service.` });
      }
      await durable.recordSlugRedirect(id, newSlug);
      await durable.deleteService(id);
      service.id = newSlug;
    }

    if (body.title !== undefined) service.title = body.title.trim();
    if (body.shortDescription !== undefined) service.shortDescription = body.shortDescription.trim();
    if (body.fullDescription !== undefined) service.fullDescription = body.fullDescription.trim();
    if (body.statutoryFramework !== undefined) service.statutoryFramework = body.statutoryFramework.trim();
    if (body.targetClients !== undefined) service.targetClients = body.targetClients.trim();
    if (Array.isArray(body.typicalScenarios)) service.typicalScenarios = body.typicalScenarios.filter(Boolean);
    if (Array.isArray(body.services)) service.services = body.services.filter(Boolean);
    if (body.iconName !== undefined) service.iconName = body.iconName.trim();
    if (body.status !== undefined) service.status = body.status === 'draft' ? 'draft' : 'published';
    if (typeof body.order === 'number') service.order = body.order;
    if (body.seo) {
      service.seo = {
        metaTitle: (body.seo.metaTitle || service.title || '').trim(),
        metaDescription: (body.seo.metaDescription || service.shortDescription || '').trim(),
        canonicalUrl: (body.seo.canonicalUrl || `https://kavithaassociates.com/services/${service.id}`).trim()
      };
    }
    service.updatedAt = new Date().toISOString();

    const saveRes = await durable.saveService(service);
    if (!saveRes.success) {
      return sendJson(res, 500, { success: false, error: saveRes.error || 'Failed to update service in durable storage.' });
    }
    return sendJson(res, 200, { success: true, service });
  }

  // Delete Service (Safe archive)
  if (method === 'DELETE' && pathname.startsWith('/api/admin/content/services/')) {
    const id = pathname.replace('/api/admin/content/services/', '');
    const { active: services } = await durable.readAllServices();
    const service = services.find(s => s.id === id);
    if (!service) {
      return sendJson(res, 404, { success: false, error: `Service ${id} not found.` });
    }
    const delRes = await durable.deleteService(id);
    if (!delRes.success) {
      return sendJson(res, 500, { success: false, error: delRes.error || 'Failed to delete service from durable storage.' });
    }
    return sendJson(res, 200, { success: true, message: `Service ${id} archived to recovery store.` });
  }

  // --- E. FAQ Management (CRUD, Reorder, Recovery) ---

  // Reorder FAQs
  if (method === 'PUT' && pathname === '/api/admin/content/faqs-reorder') {
    const body = await parseJsonBody(req);
    const orderedIds = Array.isArray(body?.orderedIds) ? body.orderedIds : [];
    if (!orderedIds.length) {
      return sendJson(res, 400, { success: false, error: 'orderedIds array required' });
    }
    const reorderRes = await durable.reorderFaqs(orderedIds);
    if (!reorderRes.success) {
      return sendJson(res, 500, { success: false, error: reorderRes.error || 'Failed to reorder FAQs in durable storage.' });
    }
    return sendJson(res, 200, { success: true, faqs: reorderRes.faqs });
  }

  // Create FAQ
  if (method === 'POST' && pathname === '/api/admin/content/faqs') {
    const body = await parseJsonBody(req);
    const question = (body?.question || '').trim();
    const answer = (body?.answer || '').trim();
    if (!question) {
      return sendJson(res, 400, { success: false, error: 'FAQ question is required and cannot be empty.' });
    }
    if (!answer) {
      return sendJson(res, 400, { success: false, error: 'FAQ answer is required and cannot be empty.' });
    }

    const { active: existingFaqs } = await durable.readAllFaqs();
    const id = (body?.id || `faq-${Date.now().toString(36)}-${Math.floor(Math.random() * 899 + 100)}`).trim();
    const maxOrder = existingFaqs.reduce((max, f) => Math.max(max, f.order || 0), 0);
    const newFaq = {
      id,
      question,
      answer,
      statuteReference: (body?.statuteReference || '').trim(),
      category: (body?.category || 'General Practice').trim(),
      serviceIds: Array.isArray(body?.serviceIds) ? body.serviceIds.filter(Boolean) : [],
      status: body?.status === 'draft' ? 'draft' : 'published',
      order: typeof body?.order === 'number' ? body.order : maxOrder + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saveRes = await durable.saveFaq(newFaq);
    if (!saveRes.success) {
      return sendJson(res, 500, { success: false, error: saveRes.error || 'Failed to save FAQ in durable storage.' });
    }
    return sendJson(res, 201, { success: true, faq: newFaq });
  }

  // Recover FAQ
  if (method === 'POST' && pathname.startsWith('/api/admin/content/faqs/') && pathname.endsWith('/recover')) {
    const id = pathname.replace('/api/admin/content/faqs/', '').replace('/recover', '');
    const { deleted } = await durable.readAllFaqs();
    if (!deleted.some(f => f.id === id)) {
      return sendJson(res, 404, { success: false, error: `FAQ ${id} not found in recovery store.` });
    }
    const recRes = await durable.recoverFaq(id);
    if (!recRes.success) {
      return sendJson(res, 500, { success: false, error: recRes.error || 'Failed to recover FAQ from durable storage.' });
    }
    return sendJson(res, 200, { success: true, faq: recRes.faq });
  }

  // Update FAQ
  if (method === 'PUT' && pathname.startsWith('/api/admin/content/faqs/')) {
    const id = pathname.replace('/api/admin/content/faqs/', '');
    const body = await parseJsonBody(req);
    const { active: faqs } = await durable.readAllFaqs();
    let faq = faqs.find(f => f.id === id);

    if (!faq) {
      return sendJson(res, 404, { success: false, error: `FAQ ${id} not found.` });
    }

    if (body.question !== undefined) {
      const q = body.question.trim();
      if (!q) {
        return sendJson(res, 400, { success: false, error: 'FAQ question cannot be empty.' });
      }
      faq.question = q;
    }
    if (body.answer !== undefined) {
      const a = body.answer.trim();
      if (!a) {
        return sendJson(res, 400, { success: false, error: 'FAQ answer cannot be empty.' });
      }
      faq.answer = a;
    }
    if (body.statuteReference !== undefined) faq.statuteReference = body.statuteReference.trim();
    if (body.category !== undefined) faq.category = body.category.trim();
    if (Array.isArray(body.serviceIds)) faq.serviceIds = body.serviceIds.filter(Boolean);
    if (body.status !== undefined) faq.status = body.status === 'draft' ? 'draft' : 'published';
    if (typeof body.order === 'number') faq.order = body.order;
    faq.updatedAt = new Date().toISOString();

    const saveRes = await durable.saveFaq(faq);
    if (!saveRes.success) {
      return sendJson(res, 500, { success: false, error: saveRes.error || 'Failed to update FAQ in durable storage.' });
    }
    return sendJson(res, 200, { success: true, faq });
  }

  // Delete FAQ (Safe archive)
  if (method === 'DELETE' && pathname.startsWith('/api/admin/content/faqs/')) {
    const id = pathname.replace('/api/admin/content/faqs/', '');
    const { active: faqs } = await durable.readAllFaqs();
    const faq = faqs.find(f => f.id === id);
    if (!faq) {
      return sendJson(res, 404, { success: false, error: `FAQ ${id} not found.` });
    }
    const delRes = await durable.deleteFaq(id);
    if (!delRes.success) {
      return sendJson(res, 500, { success: false, error: delRes.error || 'Failed to delete FAQ from durable storage.' });
    }
    return sendJson(res, 200, { success: true, message: `FAQ ${id} archived to recovery store.` });
  }

  // --- E2. Update / Create Post Content ---
  if ((method === 'PUT' || method === 'POST') && pathname.startsWith('/api/admin/content/posts/')) {
    const slug = pathname.replace('/api/admin/content/posts/', '').toLowerCase().trim();
    const body = await parseJsonBody(req);
    db.posts = db.posts || [];
    let post = db.posts.find(p => p.slug && p.slug.toLowerCase().trim() === slug);

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

    const saveRes = await durable.savePost(post);
    if (!saveRes.success) {
      return sendJson(res, 500, { success: false, error: saveRes.error || 'Failed to save post in durable storage.' });
    }
    return sendJson(res, 200, { success: true, post: saveRes.post || post });
  }

  // --- E3. Delete Post Content ---
  if (method === 'DELETE' && pathname.startsWith('/api/admin/content/posts/')) {
    const slug = pathname.replace('/api/admin/content/posts/', '').toLowerCase().trim();
    const delRes = await durable.deletePost(slug);
    if (!delRes.success) {
      return sendJson(res, 500, { success: false, error: delRes.error || 'Failed to delete post from durable storage.' });
    }
    return sendJson(res, 200, { success: true, message: `Post ${slug} removed.` });
  }

  // --- F. Reset Content to Baseline ---
  if (method === 'POST' && pathname === '/api/admin/content/reset') {
    db.services = JSON.parse(JSON.stringify(BASELINE_DATA.services));
    db.faqs = JSON.parse(JSON.stringify(BASELINE_DATA.faqs));
    db.deletedServices = [];
    db.deletedFaqs = [];
    db.slugRedirects = {};
    db.posts = [];
    writeDb(db);
    return sendJson(res, 200, { success: true, message: 'Content restored to baseline.' });
  }

  // --- G. Update Practice Settings ---
  if (method === 'PUT' && pathname === '/api/admin/settings') {
    const body = await parseJsonBody(req);
    const saveRes = await durable.saveSettings(body);
    if (!saveRes.success) {
      return sendJson(res, 500, { success: false, error: saveRes.error || 'Failed to update settings in durable storage.' });
    }
    return sendJson(res, 200, { success: true, settings: saveRes.settings });
  }

  // --- H. Reset Settings to Baseline ---
  if (method === 'POST' && pathname === '/api/admin/settings/reset') {
    const saveRes = await durable.saveSettings(BASELINE_DATA.settings);
    if (!saveRes.success) {
      return sendJson(res, 500, { success: false, error: saveRes.error || 'Failed to reset settings in durable storage.' });
    }
    return sendJson(res, 200, { success: true, settings: saveRes.settings });
  }

  return sendJson(res, 404, { error: `Endpoint ${pathname} not found.` });
}

module.exports = {
  handleApiRequest
};
