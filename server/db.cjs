const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, '..', 'data', 'practice_db.json');

// Baseline fallback data
const BASELINE_DATA = {
  settings: {
    primaryPhone: '+91 96263 50900',
    secondaryPhone: '+91 95421 53906',
    email: 'cakavithasrj@gmail.com',
    primaryLocation: 'Bairagi Patteda, Tirupati, Andhra Pradesh – 517501',
    googleMapsUrl: 'https://www.google.com/maps?q=13.61925,79.418028',
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
  rateLimits: {}
};

function readDb() {
  try {
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

// Hash password with salt
function hashPassword(password, salt = 'ka_salt_tirupati_ca') {
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

const AUTHORIZED_USERS = [
  {
    username: 'kavitha',
    passwordHash: hashPassword('Tirupati@CA2026'),
    displayName: 'CA Kavitha Vijay',
    role: 'Managing Partner'
  },
  {
    username: 'admin',
    passwordHash: hashPassword('KavithaAssoc#2026'),
    displayName: 'Practice Administrator',
    role: 'Practice Administrator'
  }
];

module.exports = {
  readDb,
  writeDb,
  BASELINE_DATA,
  AUTHORIZED_USERS,
  hashPassword
};
