const { readDb, writeDb, AUTHORIZED_USERS, hashPassword, BASELINE_DATA } = require('./db.cjs');
const crypto = require('crypto');

function parseJsonBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.end(JSON.stringify(data));
}

// Token Verification Middleware
function authenticateRequest(req, db) {
  const authHeader = req.headers['authorization'] || '';
  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7).trim();
  const session = db.sessions?.[token];
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    delete db.sessions[token];
    writeDb(db);
    return null;
  }
  return session;
}

async function handleApiRequest(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const pathname = url.pathname;
  const method = req.method;

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
    
    // Honeypot spam detection
    if (body.website_fax_hp) {
      // Fake success for bots
      return sendJson(res, 200, { success: true, message: 'Enquiry registered.' });
    }

    // Input Validation
    const fullName = (body.fullName || '').trim();
    const phone = (body.phone || '').trim();
    const message = (body.message || '').trim();

    if (fullName.length < 2) {
      return sendJson(res, 400, { success: false, error: 'Full name must be at least 2 characters.' });
    }
    if (phone.length < 8) {
      return sendJson(res, 400, { success: false, error: 'Please provide a valid contact number (min 8 digits).' });
    }
    if (message.length < 5) {
      return sendJson(res, 400, { success: false, error: 'Message description must be at least 5 characters.' });
    }

    const db = readDb();
    const newEnquiry = {
      id: `ENQ-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 899 + 100)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fullName,
      entityType: (body.entityType || 'Private Limited Company').trim(),
      organization: (body.organization || '').trim(),
      phone,
      email: (body.email || '').trim(),
      serviceCategory: (body.serviceCategory || 'Audit & Assurance Services').trim(),
      city: (body.city || 'Tirupati').trim(),
      urgency: body.urgency || 'routine',
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
    });
  }

  // 5. Authentication: Login
  if (method === 'POST' && pathname === '/api/auth/login') {
    const body = await parseJsonBody(req);
    const username = (body.username || '').trim().toLowerCase();
    const password = (body.password || '').trim();

    const db = readDb();
    db.rateLimits = db.rateLimits || {};

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const rateKey = `${ip}_${username}`;
    const rateInfo = db.rateLimits[rateKey] || { attempts: 0, lockoutUntil: 0 };

    if (rateInfo.lockoutUntil && Date.now() < rateInfo.lockoutUntil) {
      const remainingMinutes = Math.ceil((rateInfo.lockoutUntil - Date.now()) / 60000);
      return sendJson(res, 429, {
        success: false,
        error: `Account locked due to consecutive failed attempts. Please retry in ${remainingMinutes} minute(s).`
      });
    }

    const matchUser = AUTHORIZED_USERS.find(
      u => (u.username === username || u.username === username.split('@')[0]) && 
           u.passwordHash === hashPassword(password)
    );

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

    // Issue cryptographic bearer token
    const token = `ka_tok_${crypto.randomBytes(32).toString('hex')}`;
    const session = {
      token,
      user: {
        username: matchUser.username,
        displayName: matchUser.displayName,
        role: matchUser.role,
        lastLogin: new Date().toISOString()
      },
      expiresAt: Date.now() + 60 * 60 * 1000 // 1 hour
    };

    db.sessions = db.sessions || {};
    db.sessions[token] = session;
    writeDb(db);

    return sendJson(res, 200, { success: true, session });
  }

  // 6. Authentication: Logout
  if (method === 'POST' && pathname === '/api/auth/logout') {
    const authHeader = req.headers['authorization'] || '';
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      const db = readDb();
      if (db.sessions && db.sessions[token]) {
        delete db.sessions[token];
        writeDb(db);
      }
    }
    return sendJson(res, 200, { success: true, message: 'Session terminated.' });
  }

  // 7. Authentication: Check Session
  if (method === 'GET' && pathname === '/api/auth/session') {
    const db = readDb();
    const session = authenticateRequest(req, db);
    if (!session) {
      return sendJson(res, 401, { success: false, error: 'Unauthorized or expired session.' });
    }
    return sendJson(res, 200, { success: true, session });
  }

  // ===========================================================================
  // PROTECTED ADMIN ENDPOINTS (Require Authorization: Bearer <token>)
  // ===========================================================================
  const db = readDb();
  const authenticatedSession = authenticateRequest(req, db);

  if (!authenticatedSession) {
    return sendJson(res, 401, {
      success: false,
      error: 'Unauthorized: Access to private practice records requires administrator credentials.'
    });
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
