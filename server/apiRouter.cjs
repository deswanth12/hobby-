const { readDb, writeDb, AUTHORIZED_USERS, hashPassword, BASELINE_DATA, SESSION_SECRET } = require('./db.cjs');
const crypto = require('crypto');

const MAX_BODY_SIZE = 1024 * 1024; // 1MB payload ceiling

const ALLOWED_ORIGIN_PATTERNS = [
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
  /^https:\/\/(?:[a-z0-9-]+\.)?kavitha-and-associates\.pages\.dev$/,
  /^https:\/\/(?:www\.)?kavithaassociates\.com$/
];

function isOriginAllowed(origin) {
  if (!origin || typeof origin !== 'string') return false;
  return ALLOWED_ORIGIN_PATTERNS.some(p => p.test(origin.trim()));
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
function signSessionToken(user) {
  const jti = crypto.randomBytes(16).toString('hex');
  const iat = Math.floor(Date.now() / 1000);
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
    if (payload.iat < userEpoch) {
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
  const pathname = url.pathname;
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

    const candidateHash = hashPassword(password);
    const candidateBuffer = Buffer.from(candidateHash, 'hex');

    const matchUser = AUTHORIZED_USERS.find(u => {
      const isUser = (u.username === username || u.username === username.split('@')[0]);
      if (!isUser) return false;
      const expectedBuffer = Buffer.from(u.passwordHash, 'hex');
      return candidateBuffer.length === expectedBuffer.length &&
             crypto.timingSafeEqual(candidateBuffer, expectedBuffer);
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

    // Success: Reset rate limits
    delete db.rateLimits[rateKey];

    // Issue stateless cryptographic token with embedded claims and HMAC signature
    const { token, payload } = signSessionToken(matchUser);
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

  // Anti-CSRF Protection for State-Changing Administrative Requests
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

  // --- F. Reset Content to Baseline ---
  if (method === 'POST' && pathname === '/api/admin/content/reset') {
    db.services = JSON.parse(JSON.stringify(BASELINE_DATA.services));
    db.faqs = JSON.parse(JSON.stringify(BASELINE_DATA.faqs));
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
