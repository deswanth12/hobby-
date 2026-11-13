const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR_PATH = path.join(__dirname, '..', 'data', 'practice_db.json');
const VERCEL_TMP_PATH = '/tmp/practice_db.json';
const DB_PATH = process.env.VERCEL ? VERCEL_TMP_PATH : DATA_DIR_PATH;

// Baseline fallback data
const BASELINE_DATA = {
  settings: {
    primaryPhone: '+91 96263 50900',
    secondaryPhone: '+91 95421 53906',
    email: 'cakavithasrj@gmail.com',
    primaryLocation: '19-12-46, 1st Floor, Near Bairagipetteda Arch, Tirupati, Andhra Pradesh 517501, India',
    googleMapsUrl: 'https://maps.app.goo.gl/p9ToGUtxqYDCghpF6',
    whatsappLink: 'https://wa.me/919626350900?text=Hello%20CA%20Kavitha%20Vijay%2C%20I%20would%20like%20to%20enquire%20about%20your%20Chartered%20Accountancy%20services.',
    openingHours: 'Mon - Sat: 9:30 AM - 7:30 PM | Sun: Closed / Prior Appointment Only',
    updatedAt: new Date().toISOString()
  },
  services: [
    {
      id: 'income-tax',
      title: 'Income Tax Services',
      shortDescription: 'Strategic direct tax planning, corporate filing, scrutiny representation, and appellate support.',
      fullDescription: 'Comprehensive direct tax services from routine return preparation to complex dispute resolution before appellate authorities, structured to protect financial compliance.',
      statutoryFramework: 'Income Tax Act, 1961 & CBDT Guidelines',
      targetClients: 'Companies, LLPs, High-Net-Worth Individuals, Trusts',
      status: 'published',
      order: 1,
      typicalScenarios: [
        'Filing mandatory corporate or individual annual ITR with complex capital gains',
        'Responding to scrutiny notices under Section 143(2) or 148',
        'Structuring advance tax and minimizing TDS non-compliance penalties'
      ],
      services: [
        'ITR Filing - Individuals, Firms & Companies',
        'Corporate Tax Planning & Advance Tax',
        'Scrutiny & Assessment Representation',
        'TDS / TCS Compliance & Filings'
      ],
      iconName: 'FileSpreadsheet',
      seo: {
        metaTitle: 'Income Tax Consultant in Tirupati | ITR | Kavitha & Associates',
        metaDescription: 'Expert Income Tax consultant in Tirupati. CA Kavitha & Associates provides corporate tax planning, Section 44AB tax audit, capital gains advisory & ITR filing.',
        canonicalUrl: 'https://kavithaassociates.com/services/income-tax-consultant-tirupati'
      },
      updatedAt: new Date().toISOString()
    },
    {
      id: 'gst',
      title: 'GST Services',
      shortDescription: 'End-to-end Indirect Tax management, periodic filings, audit reconciliation, and departmental representation.',
      fullDescription: 'Specialized GST counsel including return preparation (GSTR-1, 3B, 9/9C), input tax credit optimization, refund processing, and departmental notice defense.',
      statutoryFramework: 'CGST Act, 2017 & State GST Regulations',
      targetClients: 'Manufacturers, Traders, Service Providers, Exporters',
      status: 'published',
      order: 2,
      typicalScenarios: [
        'Resolving GSTR-2B vs. GSTR-3B Input Tax Credit (ITC) mismatches',
        'Handling Departmental Scrutiny notices (ASMT-10, DRC-01)',
        'Annual GST return preparation and reconciliation (GSTR-9 & 9C)'
      ],
      services: [
        'GST Registration & Amendment',
        'Monthly & Quarterly Returns (GSTR-1, GSTR-3B)',
        'Annual Return & Reconciliation (GSTR-9, GSTR-9C)',
        'Departmental Scrutiny & Notice Defense'
      ],
      iconName: 'Receipt',
      seo: {
        metaTitle: 'GST Consultant in Tirupati | GST Filing | Kavitha & Associates',
        metaDescription: 'Expert GST consultant in Tirupati. CA Kavitha & Associates provides GST registration, monthly GSTR-1 & 3B return filing, GSTR-9/9C reconciliation & notice defense.',
        canonicalUrl: 'https://kavithaassociates.com/services/gst-consultant-tirupati'
      },
      updatedAt: new Date().toISOString()
    },
    {
      id: 'corporate-business',
      title: 'Corporate & Business Services',
      shortDescription: 'Entity incorporation, MCA/ROC filings, restructuring, loan syndication, and Virtual CFO support.',
      fullDescription: 'End-to-end secretarial and corporate governance assistance under Company Law, including annual filings, director disclosures, and strategic restructuring advisory.',
      statutoryFramework: 'Companies Act, 2013 & MCA Mandates',
      targetClients: 'Private Limited Companies, Section 8 Entities, LLPs',
      status: 'published',
      order: 3,
      typicalScenarios: [
        'Incorporating a Private Limited or LLP entity with DPIIT startup recognition',
        'Mandatory annual ROC filings (AOC-4, MGT-7, DIR-3 KYC)',
        'Director additions/resignations, share transfers, and capital increases'
      ],
      services: [
        'Company & LLP Incorporation via SPICe+',
        'Annual ROC Compliance & Secretarial Filings',
        'Startup Structuring & DPIIT Recognition',
        'Director KYC & Board Governance'
      ],
      iconName: 'Building2',
      seo: {
        metaTitle: 'Company Registration in Tirupati | ROC | Kavitha & Associates',
        metaDescription: 'Expert company registration in Tirupati. CA Kavitha & Associates provides Private Limited, LLP, OPC incorporation, DPIIT Startup India & annual ROC compliance.',
        canonicalUrl: 'https://kavithaassociates.com/services/company-registration-tirupati'
      },
      updatedAt: new Date().toISOString()
    },
    {
      id: 'rera-compliance',
      title: 'RERA Compliance & Certification',
      shortDescription: 'Specialized advisory for builders and developers, quarterly compliance, and mandatory CA certificates.',
      fullDescription: 'Statutory escrow account audits, quarterly project progress disclosures, Form 3 CA certifications, and registration support under Real Estate Regulatory authorities.',
      statutoryFramework: 'Real Estate (Regulation and Development) Act, 2016',
      targetClients: 'Real Estate Developers, Builders, Promoters',
      status: 'published',
      order: 4,
      typicalScenarios: [
        'Securing mandatory CA Form 3 Certificates for fund withdrawals from designated escrow',
        'Project completion cost verification and percentage-of-completion audits',
        'Quarterly RERA portal updating and statutory project compliance audit'
      ],
      services: [
        'Mandatory CA Form 3 Escrow Certificates',
        'Project Cost & Fund Utilization Certification',
        'Quarterly RERA Portal Compliance Updates',
        'Real Estate Tax Planning & JDA Advisory'
      ],
      iconName: 'Building',
      seo: {
        metaTitle: 'RERA Advisory & CA Certificates in Tirupati | Kavitha & Associates',
        metaDescription: 'Specialized RERA advisory in Tirupati. CA Kavitha & Associates provides mandatory Form 3 CA certificates for escrow withdrawal, AP RERA compliance & JDA tax planning.',
        canonicalUrl: 'https://kavithaassociates.com/services/rera-consultant-tirupati'
      },
      updatedAt: new Date().toISOString()
    },
    {
      id: 'advisory-consulting',
      title: 'Advisory & Consulting',
      shortDescription: 'Internal controls, fraud review, business process enhancement, and forward financial planning.',
      fullDescription: 'Operational reviews, standard operating procedure audits, cash flow planning, and financial due diligence designed to build institutional strength in growing firms.',
      statutoryFramework: 'ICAI Technical Standards & Industry Best Practices',
      targetClients: 'Growing Enterprises, Family Businesses, Healthcare & Hospitality',
      status: 'published',
      order: 5,
      typicalScenarios: [
        'Auditing internal financial controls (IFC) and operating SOPs to prevent leakage',
        'Budgeting, variance reporting, and margin analysis by a qualified CMA',
        'Bank loan CMA data preparation for credit facilities'
      ],
      services: [
        'Virtual CFO & Strategic Financial Leadership',
        'CMA Data & Bank Loan Documentation',
        'Internal Financial Controls & Risk Audits',
        'Business Process & Working Capital Review'
      ],
      iconName: 'LineChart',
      seo: {
        metaTitle: 'Virtual CFO Services in Tirupati | CMA | Kavitha & Associates',
        metaDescription: 'Strategic Virtual CFO services in Tirupati. CA Kavitha & Associates provides bank loan CMA data, cost governance, cash flow forecasting & accounting advisory.',
        canonicalUrl: 'https://kavithaassociates.com/services/virtual-cfo-tirupati'
      },
      updatedAt: new Date().toISOString()
    },
    {
      id: 'audit-assurance',
      title: 'Audit & Assurance (Statutory Focus)',
      shortDescription: 'Statutory Company Audits, Tax Audits under Section 44AB, Internal Audits, and Special Bank Audits.',
      fullDescription: 'Independent, objective examination of books of accounts in strict adherence to Standards on Auditing (SAs) issued by ICAI, ensuring true and fair view reporting.',
      statutoryFramework: 'Companies Act 2013, Section 139–143 & SAs by ICAI',
      targetClients: 'Public & Private Corporates, Banks, Statutory Boards',
      status: 'published',
      order: 6,
      typicalScenarios: [
        'Independent examination of financial statements under Companies Act 2013',
        'Tax Audit under Section 44AB of Income Tax Act 1961',
        'Stock verification and bank concurrent audits'
      ],
      services: [
        'Statutory Company Audit (Sec 143)',
        'Tax Audit under Section 44AB',
        'Internal & Concurrent Audits',
        'Stock & Inventory Physical Verification'
      ],
      iconName: 'ShieldCheck',
      seo: {
        metaTitle: 'Statutory Audit in Tirupati | Tax & Internal Audits | Kavitha & Associates',
        metaDescription: 'Independent Statutory Audit under Companies Act 2013, Tax Audit under Sec 44AB, Internal Audit, Concurrent Audit & Stock Verification in Tirupati, AP.',
        canonicalUrl: 'https://kavithaassociates.com/services/audit-assurance'
      },
      updatedAt: new Date().toISOString()
    }
  ],
  faqs: [
    {
      id: 'statutory-audit-mandate',
      question: 'Which businesses are legally required to undergo a Statutory Audit in India?',
      answer: 'Under Section 139 of the Companies Act, 2013, every incorporated company (Private Limited, Public Limited, or One Person Company) must appoint an independent statutory auditor and have its annual accounts audited, regardless of turnover or capital. For non-corporate entities (proprietorships, firms, LLPs), audit requirements are triggered by turnover thresholds under Section 44AB of the Income Tax Act, 1961.',
      statuteReference: 'Companies Act, 2013 — Section 139; Income Tax Act, 1961 — Section 44AB',
      category: 'Audit & Assurance',
      serviceIds: ['audit-assurance'],
      status: 'published',
      order: 1,
      updatedAt: new Date().toISOString()
    },
    {
      id: 'tax-audit-thresholds',
      question: 'What are the turnover limits for a Tax Audit under Section 44AB?',
      answer: 'For businesses carrying on business operations, Tax Audit under Section 44AB is generally mandatory if total sales, turnover, or gross receipts exceed ₹1 Crore in the financial year. However, if cash receipts and cash payments do not exceed 5% of aggregate transactions (digital transaction incentive), the turnover threshold is increased to ₹10 Crores. For professionals, the threshold is ₹50 Lakhs gross receipts.',
      statuteReference: 'Income Tax Act, 1961 — Section 44AB & Budget amendments',
      category: 'Income Tax',
      serviceIds: ['income-tax', 'audit-assurance'],
      status: 'published',
      order: 2,
      updatedAt: new Date().toISOString()
    },
    {
      id: 'gst-annual-return-audit',
      question: 'When is GST Annual Return (GSTR-9) and Reconciliation (GSTR-9C) mandatory?',
      answer: 'GSTR-9 is mandatory for registered regular taxpayers whose aggregate annual turnover exceeds ₹2 Crores. The self-certified reconciliation statement in Form GSTR-9C is mandatory for taxpayers whose aggregate turnover exceeds ₹5 Crores in the financial year.',
      statuteReference: 'CGST Act, 2017 — Section 44 & CGST Rules 80',
      category: 'GST Compliance',
      serviceIds: ['gst'],
      status: 'published',
      order: 3,
      updatedAt: new Date().toISOString()
    },
    {
      id: 'rera-quarterly-ca-certificates',
      question: 'Why do real estate developers require CA Certificates under RERA?',
      answer: 'Under Section 4(2)(l)(D) of RERA 2016, 70% of amounts realized for real estate projects must be deposited in a scheduled bank separate account (Escrow). Withdrawals require three certificates: from the Project Engineer, Architect, and a Practicing Chartered Accountant (Form 3) certifying that withdrawal is in proportion to the percentage of project completion.',
      statuteReference: 'Real Estate (Regulation and Development) Act, 2016 — Section 4(2)(l)(D)',
      category: 'Corporate & RERA',
      serviceIds: ['rera-compliance'],
      status: 'published',
      order: 4,
      updatedAt: new Date().toISOString()
    }
  ],
  deletedServices: [],
  deletedFaqs: [],
  slugRedirects: {},
  posts: [],
  enquiries: [],
  sessions: {},
  revokedTokens: {},
  userRevocationEpochs: {},
  rateLimits: {}
};

function readDb() {
  try {
    if (process.env.VERCEL && !fs.existsSync(DB_PATH)) {
      if (fs.existsSync(DATA_DIR_PATH)) {
        try {
          const initial = fs.readFileSync(DATA_DIR_PATH, 'utf8');
          fs.writeFileSync(DB_PATH, initial, 'utf8');
          const parsed = JSON.parse(initial);
          ensureDbDefaults(parsed);
          return parsed;
        } catch {
          writeDb(BASELINE_DATA);
          return JSON.parse(JSON.stringify(BASELINE_DATA));
        }
      } else {
        writeDb(BASELINE_DATA);
        return JSON.parse(JSON.stringify(BASELINE_DATA));
      }
    }
    if (!fs.existsSync(DB_PATH)) {
      writeDb(BASELINE_DATA);
      return JSON.parse(JSON.stringify(BASELINE_DATA));
    }
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    ensureDbDefaults(parsed);
    return parsed;
  } catch (err) {
    console.error('[DB] Read error, serving baseline:', err);
    return JSON.parse(JSON.stringify(BASELINE_DATA));
  }
}

function ensureDbDefaults(db) {
  db.services = db.services || JSON.parse(JSON.stringify(BASELINE_DATA.services));
  db.faqs = db.faqs || JSON.parse(JSON.stringify(BASELINE_DATA.faqs));
  db.deletedServices = db.deletedServices || [];
  db.deletedFaqs = db.deletedFaqs || [];
  db.slugRedirects = db.slugRedirects || {};
  db.posts = db.posts || [];
  db.enquiries = db.enquiries || [];
  db.sessions = db.sessions || {};
  db.revokedTokens = db.revokedTokens || {};
  db.userRevocationEpochs = db.userRevocationEpochs || {};
  db.rateLimits = db.rateLimits || {};

  // Ensure services have order, seo, and arrays
  db.services.forEach((s, idx) => {
    if (s.order === undefined) s.order = idx + 1;
    if (!s.status) s.status = 'published';
    if (!Array.isArray(s.typicalScenarios)) s.typicalScenarios = [];
    if (!Array.isArray(s.services)) s.services = [];
    if (!s.seo) {
      s.seo = {
        metaTitle: `${s.title} | Kavitha & Associates`,
        metaDescription: s.shortDescription || '',
        canonicalUrl: `https://kavithaassociates.com/services/${s.id}`
      };
    }
  });

  // Ensure FAQs have order, category, and serviceIds
  db.faqs.forEach((f, idx) => {
    if (f.order === undefined) f.order = idx + 1;
    if (!f.status) f.status = 'published';
    if (!f.category) f.category = 'General Practice';
    if (!Array.isArray(f.serviceIds)) f.serviceIds = [];
  });
}

function writeDb(data) {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const tmpPath = `${DB_PATH}.tmp.${Date.now()}.${Math.random().toString(36).slice(2, 7)}`;
  try {
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8');

    // On Windows, atomic renameSync may throw EPERM/EBUSY if destination is held open by AV/indexer.
    // We retry up to 5 times with brief backoff, then fallback to copyFileSync + unlinkSync.
    let written = false;
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        fs.renameSync(tmpPath, DB_PATH);
        written = true;
        break;
      } catch (renameErr) {
        if (attempt === 4) {
          // Fallback to copy + unlink
          fs.copyFileSync(tmpPath, DB_PATH);
          try { fs.unlinkSync(tmpPath); } catch (_) {}
          written = true;
          break;
        }
        // Brief synchronous backoff for Windows file locks
        const end = Date.now() + 20;
        while (Date.now() < end) {}
      }
    }
    return written;
  } catch (err) {
    try {
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    } catch (_) {}
    console.error('[DB] Write error:', err);
    return false;
  }
}

// Cryptographically secure password hashing using PBKDF2-HMAC-SHA512 with unique per-credential salt
const PBKDF2_ITERATIONS = 100000;
const PBKDF2_KEY_LEN = 64;
const PBKDF2_DIGEST = 'sha512';

function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

function hashPassword(password, salt, iterations = PBKDF2_ITERATIONS) {
  return crypto.pbkdf2Sync(password, salt, iterations, PBKDF2_KEY_LEN, PBKDF2_DIGEST).toString('hex');
}

function verifyPassword(candidatePassword, storedHash, salt, iterations = PBKDF2_ITERATIONS) {
  if (!candidatePassword || !storedHash || !salt) return false;
  try {
    const candidateHash = hashPassword(candidatePassword, salt, iterations);
    const candidateBuf = Buffer.from(candidateHash, 'hex');
    const expectedBuf = Buffer.from(storedHash, 'hex');
    if (candidateBuf.length !== expectedBuf.length) return false;
    return crypto.timingSafeEqual(candidateBuf, expectedBuf);
  } catch {
    return false;
  }
}

// Session signing secret (server-side only, rotated per process if missing in environment)
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

// Process-stable unique salts for environment variable credentials
const PROCESS_KAVITHA_SALT = crypto.randomBytes(16).toString('hex');
const PROCESS_ADMIN_SALT = crypto.randomBytes(16).toString('hex');

function getAuthorizedUsers(db) {
  const currentDb = db || readDb();
  const dbUsers = currentDb && currentDb.userCredentials;

  const kavithaEnvPass = process.env.ADMIN_KAVITHA_PASSWORD;
  const adminEnvPass = process.env.ADMIN_PASSWORD;

  // 1. Managing Partner Account
  let kavithaHash = dbUsers?.kavitha?.passwordHash || null;
  let kavithaSalt = dbUsers?.kavitha?.salt || null;
  let kavithaIterations = dbUsers?.kavitha?.iterations || PBKDF2_ITERATIONS;

  if (!kavithaHash && kavithaEnvPass) {
    kavithaSalt = PROCESS_KAVITHA_SALT;
    kavithaHash = hashPassword(kavithaEnvPass, kavithaSalt, kavithaIterations);
  }

  // 2. Practice Administrator Account
  let adminHash = dbUsers?.admin?.passwordHash || null;
  let adminSalt = dbUsers?.admin?.salt || null;
  let adminIterations = dbUsers?.admin?.iterations || PBKDF2_ITERATIONS;

  if (!adminHash && adminEnvPass) {
    adminSalt = PROCESS_ADMIN_SALT;
    adminHash = hashPassword(adminEnvPass, adminSalt, adminIterations);
  }

  return [
    {
      username: 'kavitha',
      passwordHash: kavithaHash,
      salt: kavithaSalt,
      iterations: kavithaIterations,
      isConfigured: Boolean(kavithaHash),
      displayName: 'CA Kavitha Vijay',
      role: 'Managing Partner'
    },
    {
      username: 'admin',
      passwordHash: adminHash,
      salt: adminSalt,
      iterations: adminIterations,
      isConfigured: Boolean(adminHash),
      displayName: 'Practice Administrator',
      role: 'Practice Administrator'
    }
  ];
}

const AUTHORIZED_USERS = getAuthorizedUsers();

function setUserPassword(username, newPassword) {
  const db = readDb();
  db.userCredentials = db.userCredentials || {};
  const salt = generateSalt();
  const iterations = PBKDF2_ITERATIONS;
  db.userCredentials[username] = {
    salt,
    passwordHash: hashPassword(newPassword, salt, iterations),
    iterations,
    algorithm: 'pbkdf2-sha512',
    updatedAt: new Date().toISOString()
  };
  // Immediately invalidate all existing sessions and tokens for this user
  db.userRevocationEpochs = db.userRevocationEpochs || {};
  const currentEpoch = db.userRevocationEpochs[username] || 0;
  db.userRevocationEpochs[username] = Math.max(Math.floor(Date.now() / 1000), currentEpoch + 1);
  writeDb(db);
  return true;
}

module.exports = {
  readDb,
  writeDb,
  BASELINE_DATA,
  AUTHORIZED_USERS,
  getAuthorizedUsers,
  setUserPassword,
  hashPassword,
  verifyPassword,
  generateSalt,
  SESSION_SECRET
};
