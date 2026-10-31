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
      status: 'published',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'tax-audit-thresholds',
      question: 'What are the turnover limits for a Tax Audit under Section 44AB?',
      answer: 'For businesses carrying on business operations, Tax Audit under Section 44AB is generally mandatory if total sales, turnover, or gross receipts exceed ₹1 Crore in the financial year. However, if cash receipts and cash payments do not exceed 5% of aggregate transactions (digital transaction incentive), the turnover threshold is increased to ₹10 Crores. For professionals, the threshold is ₹50 Lakhs gross receipts.',
      statuteReference: 'Income Tax Act, 1961 — Section 44AB & Budget amendments',
      category: 'Income Tax',
      status: 'published',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'gst-annual-return-audit',
      question: 'When is GST Annual Return (GSTR-9) and Reconciliation (GSTR-9C) mandatory?',
      answer: 'GSTR-9 is mandatory for registered regular taxpayers whose aggregate annual turnover exceeds ₹2 Crores. The self-certified reconciliation statement in Form GSTR-9C is mandatory for taxpayers whose aggregate turnover exceeds ₹5 Crores in the financial year.',
      statuteReference: 'CGST Act, 2017 — Section 44 & CGST Rules 80',
      category: 'GST Compliance',
      status: 'published',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'rera-quarterly-ca-certificates',
      question: 'Why do real estate developers require CA Certificates under RERA?',
      answer: 'Under Section 4(2)(l)(D) of RERA 2016, 70% of amounts realized for real estate projects must be deposited in a scheduled bank separate account (Escrow). Withdrawals require three certificates: from the Project Engineer, Architect, and a Practicing Chartered Accountant (Form 3) certifying that withdrawal is in proportion to the percentage of project completion.',
      statuteReference: 'Real Estate (Regulation and Development) Act, 2016 — Section 4(2)(l)(D)',
      category: 'Corporate & RERA',
      status: 'published',
      updatedAt: new Date().toISOString()
    }
  ],
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
          return JSON.parse(initial);
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
    return JSON.parse(raw);
  } catch (err) {
    console.error('[DB] Read error, serving baseline:', err);
    return JSON.parse(JSON.stringify(BASELINE_DATA));
  }
}

function writeDb(data) {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    // Atomic write to prevent file corruption
    const tmpPath = `${DB_PATH}.tmp.${Date.now()}`;
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tmpPath, DB_PATH);
    return true;
  } catch (err) {
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
  db.userRevocationEpochs[username] = Math.floor(Date.now() / 1000);
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
