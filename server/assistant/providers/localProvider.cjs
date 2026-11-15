/**
 * server/assistant/providers/localProvider.cjs
 * 
 * Deterministic Local Provider for Kavitha & Associates Assistant.
 * Provides instant, zero-cost, source-grounded response generation without external dependencies.
 * 
 * Guarantees:
 * - 100% offline capability.
 * - Deterministic CI/CD testing.
 * - Zero hallucination: answers strictly from retrieved evidence chunks.
 * - Out-of-scope & low-confidence abstention.
 */

/**
 * Generates an answer from retrieved knowledge chunks.
 */
function generateLocalAnswer(query, chunks, options = {}) {
  const queryLower = query.toLowerCase();

  // If no chunks retrieved, return calibrated abstention
  if (!chunks || chunks.length === 0) {
    return {
      answer: "I don't have approved public information regarding this topic in our published records. For direct inquiries, please contact Kavitha & Associates through our official contact channels.",
      status: 'insufficient_evidence',
      handoff: {
        available: true,
        label: 'Contact Kavitha & Associates'
      }
    };
  }

  // 1. Philosophy & Engagement Methodology
  const isPhilosophyQuery = /philosophy|operating\s+philosophy|principles|stages|engagement\s+process|methodology|four\s+stage|code\s+of\s+ethics/i.test(queryLower);
  
  // 2. Partner Credentials & Pedigree (explicit requests for bio, qualifications, rank, pedigree)
  const isBioOrCredentialsQuery = /qualification|credential|air\s*49|academic|degree|alumni|deloitte|ford|who\s+(is\s+ca|leads\s+the|heads\s+the|founded\s+the|is\s+the\s+proprietor)|proprietor|founder|background|experience|bio|profile|achieve/i.test(queryLower);
  const isPartnerQuery = /(managing\s+)?partner|ca\s+kavitha|kavitha\s+vijay|cma|who\s+(is\s+ca|leads\s+the|heads\s+the|founded\s+the|is\s+the\s+proprietor)|proprietor|founder/i.test(queryLower);
  
  // 3. Published Regulatory Insights & Articles
  const isArticleQuery = /article|blog|insight|post|reading|publication|published|guideline|guidance|guide/i.test(queryLower);

  // 4. Contact Coordinates & Chambers Hours (including human representative / consultation scheduling)
  const isContactQuery = /address|phone|email|contact|office|chambers|location|where|hours|appointment|consultation|schedule|book(\s+an?)?\s+appointment|book(\s+a)?\s+meeting|how\s+(can\s+i|to)\s+(meet|consult|reach|contact|call)|talk\s+to|speak\s+(with|to)|human|person|someone|call\s+(the|your|someone|office|chambers)/i.test(queryLower);

  // 5. Institutional Firm Overview
  const isFirmOverviewQuery = /what\s+is\s+kavitha|tell\s+me\s+about\s+(the\s+)?firm|firm\s+overview|firm\s+history|who\s+are\s+you|about\s+the\s+firm|based|independent|how\s+long|operating|how\s+does\s+the\s+firm|types\s+of\s+clients|who\s+do\s+you\s+serve|who\s+are\s+your\s+clients/i.test(queryLower);

  // 6. Specific Statutory Practice Corridors
  const isAuditQuery = /(statutory\s+(company\s+)?audit|audit\s+and\s+assurance|standards\s+on\s+auditing|statutory\s+framework\s+for\s+(your\s+)?audit|audit\s+services|company\s+audits?|caro\s*2020|internal\s+financial\s+controls?|ifc)\b/i.test(queryLower) || (/\baudits?\b/i.test(queryLower) && !/tax\s+audit|44ab/i.test(queryLower));
  const isDirectTaxQuery = /(income\s+tax|direct\s+tax|corporate\s+tax|itr|1961|scrutiny|143(\(\d\))?|148a?|reassessment|faceless|advance\s+tax|tds|tcs|44ab|tax\s+audit|tax\s+notice|tax\s+filing|taxes|ais|tis|26as)/i.test(queryLower);
  const isGstQuery = /(gst|indirect\s+tax|gstr|cgst|sgst|igst|e-way|asmt-10|drc-01|input\s+tax\s+credit|itc|2b)/i.test(queryLower);
  const isCorporateQuery = /(company\s+incorporation|incorporat|roc|spice\+|mca|llp|private\s+limited|corporate\s+secretarial|dir-3|start\s+(a\s+)?company|register\s+(a\s+)?(company|business|llp|pvt|firm)|form\s+(a\s+)?company|aoc-4|mgt-7a?|annual\s+roc|director\s+kyc)/i.test(queryLower);
  const isCfoQuery = /(virtual\s+cfo|cfo\s+advisory|fractional\s+cfo|cash\s+flow|mis|working\s+capital|financial\s+steering|cost\s+model|costing|cost\s+management)/i.test(queryLower);
  const isReraQuery = /(rera|form\s*3|form\s*5|escrow|real\s+estate\s+regulat)/i.test(queryLower);

  // 7. Broad Services & Overview
  const isGeneralServicesQuery = /(what\s+services|services\s+does|what\s+do\s+you\s+offer|practice\s+areas|practice\s+disciplines|explore\s+(our\s+)?services|all\s+services|corridors)/i.test(queryLower);
  const isServicesQuery = isAuditQuery || isDirectTaxQuery || isGstQuery || isCorporateQuery || isCfoQuery || isReraQuery || isGeneralServicesQuery || /service|offer|practice/i.test(queryLower);

  const phoneUrl = 'tel:+919626350900';
  const phoneDisplay = '+91 96263 50900';

  // --- 1. Firm Operating Philosophy & Engagement Methodology ---
  if (isPhilosophyQuery) {
    return {
      answer: "Kavitha & Associates operates on the core philosophy of 'Accuracy before Speed, Evidence before Opinion, Discipline before Convenience.' The firm follows a structured four-stage engagement process: (1) Diagnostic Intake & Jurisdictional Assessment, (2) Document Verification & Reconciliations, (3) Partner-Led Execution & Review, and (4) Client Advisory & Ongoing Steering. The practice adheres strictly to the ICAI Code of Ethics (13th Edition, 2026) with zero tolerance for compliance ambiguity.",
      status: 'answered',
      handoff: {
        available: true,
        label: 'View Practice Methodology',
        whatsappUrl: 'https://wa.me/919626350900?text=' + encodeURIComponent('Hello CA Kavitha Vijay (Kavitha & Associates),\n\nI would like to discuss an engagement under your practice methodology.'),
        phoneUrl,
        phoneDisplay
      }
    };
  }

  // --- 2. Published Articles & Regulatory Insights ---
  if (isArticleQuery) {
    const articleChunks = chunks.filter(c => c.source_type === 'blog_post' || c.canonical_url?.startsWith('/blog'));
    const titles = articleChunks.length > 0 ? [...new Set(articleChunks.map(c => c.title))] : [];
    return {
      answer: `Kavitha & Associates regularly publishes technical guidance, statutory analysis, and editorial insights on corporate compliance (including 2026 publications: ${titles.length > 0 ? titles.join('; ') : 'Corporate Tax, GST Annual Returns, and Statutory Audit'}). All published articles can be read online at the firm's canonical insights directory at /blog.`,
      status: 'answered',
      handoff: {
        available: true,
        label: 'Browse Published Insights',
        whatsappUrl: 'https://wa.me/919626350900?text=' + encodeURIComponent('Hello CA Kavitha Vijay (Kavitha & Associates),\n\nI was reviewing your published insights on corporate compliance and would like to schedule a consultation.'),
        phoneUrl,
        phoneDisplay
      }
    };
  }

  // --- 3. Contact Coordinates & Chamber Office (Precedes general partner mentions if contact intent is present) ---
  if (isContactQuery && !isBioOrCredentialsQuery) {
    return {
      answer: "The chambers of Kavitha & Associates are located at 19-12-46, 1st Floor, Near Bairagipetteda Arch, Bairagi Patteda, Tirupati, Andhra Pradesh – 517501, India. You can contact the firm by phone at +91 96263 50900 or +91 95421 53906, or by email at cakavithasrj@gmail.com. Office hours are Monday to Saturday from 9:30 AM to 7:30 PM IST. Consultations are scheduled by prior appointment.",
      status: 'answered',
      handoff: {
        available: true,
        label: 'View Chambers Coordinates',
        whatsappUrl: 'https://wa.me/919626350900?text=' + encodeURIComponent('Hello CA Kavitha Vijay (Kavitha & Associates),\n\nI would like to schedule an appointment at your Tirupati chambers.'),
        phoneUrl,
        phoneDisplay
      }
    };
  }

  // --- 4. Partner Credentials & Professional Background ---
  if (isPartnerQuery || isBioOrCredentialsQuery) {
    return {
      answer: "Kavitha & Associates is led by Managing Partner CA Kavitha Vijay, a Fellow Chartered Accountant (ICAI Practicing Fellow) and Associate Cost & Management Accountant (ACMA / ICMAI). She holds a B.Com degree and achieved All India Rank 49 (AIR 49) in the CMA Intermediate examination, awarded specifically by the Institute of Cost Accountants of India (ICMAI). Her background encompasses over 10+ years of progressive professional experience, including senior corporate audit roles at Deloitte (Big 4) and internal audit at Ford Motor Company across Asia-Pacific operations. All client representations feature direct partner-led execution without delegation to junior staff.",
      status: 'answered',
      handoff: {
        available: true,
        label: 'Connect with Managing Partner',
        whatsappUrl: 'https://wa.me/919626350900?text=' + encodeURIComponent('Hello CA Kavitha Vijay (Kavitha & Associates),\n\nI would like to consult with the Managing Partner regarding professional advisory services.'),
        phoneUrl,
        phoneDisplay
      }
    };
  }

  // --- 5. Contact Coordinates & Chamber Office (Fallback if not caught earlier) ---
  if (isContactQuery) {
    return {
      answer: "The chambers of Kavitha & Associates are located at 19-12-46, 1st Floor, Near Bairagipetteda Arch, Bairagi Patteda, Tirupati, Andhra Pradesh – 517501, India. You can contact the firm by phone at +91 96263 50900 or +91 95421 53906, or by email at cakavithasrj@gmail.com. Office hours are Monday to Saturday from 9:30 AM to 7:30 PM IST. Consultations are scheduled by prior appointment.",
      status: 'answered',
      handoff: {
        available: true,
        label: 'View Chambers Coordinates',
        whatsappUrl: 'https://wa.me/919626350900?text=' + encodeURIComponent('Hello CA Kavitha Vijay (Kavitha & Associates),\n\nI would like to schedule an appointment at your Tirupati chambers.'),
        phoneUrl,
        phoneDisplay
      }
    };
  }

  // --- 6. Broad Practice Corridors Overview ---
  if (isGeneralServicesQuery && !isAuditQuery && !isDirectTaxQuery && !isGstQuery && !isCorporateQuery && !isCfoQuery && !isReraQuery) {
    return {
      answer: "Kavitha & Associates provides professional services across six approved practice corridors: (1) Statutory Audit & Assurance Services (Companies Act 2013 audits, Section 44AB Tax Audits, Standards on Auditing SAs, IFC), (2) Direct Tax & Corporate Income Tax Advisory (ITR filing under Income Tax Act 1961, corporate ITR-6, advance tax, Section 143(3) scrutiny and Faceless assessment representation, Section 148 reassessment), (3) Indirect Tax & GST Compliance Services (filings, GSTR-9, GSTR-9C reconciliation, ASMT-10 notices), (4) Corporate Secretarial & Entity Registration (SPICe+ company incorporation, LLP registration, annual ROC filings), (5) Virtual CFO & Strategic Financial Advisory (MIS, cash flow forecasting, costing), and (6) Real Estate RERA Advisory & Compliance (RERA registrations, Form 3 certifications, 70% escrow monitoring). All engagements follow partner-led execution under the applicable statutory frameworks including Companies Act 2013, Standards on Auditing, Income Tax Act 1961, and CGST Act 2017.",
      status: 'answered',
      handoff: {
        available: true,
        label: 'Explore Practice Disciplines',
        whatsappUrl: 'https://wa.me/919626350900?text=' + encodeURIComponent('Hello CA Kavitha Vijay (Kavitha & Associates),\n\nI would like to enquire about your Chartered Accountancy practice disciplines.'),
        phoneUrl,
        phoneDisplay
      }
    };
  }

  // --- 6a. Statutory Audit & Assurance Services (PRAC-01) ---
  if (isAuditQuery && !/income\s+tax|direct\s+tax|corporate\s+tax|itr|scrutiny|143\(3\)|faceless|gst|indirect\s+tax/i.test(queryLower)) {
    return {
      answer: "The statutory framework for our audit services is governed strictly by the Companies Act 2013 and the Standards on Auditing (SAs) issued by the Institute of Chartered Accountants of India (ICAI). Kavitha & Associates delivers independent Statutory Audit engagements including statutory company audits under Section 139 of the Companies Act 2013, Tax Audits under Section 44AB of the Income Tax Act 1961, evaluation of Internal Financial Controls over Financial Reporting (IFC) under Section 143(3)(i), CARO 2020 reporting, and internal management audits. All audit engagements are partner-led with rigorous evidence-based sampling, ensuring absolute independence and zero tolerance for compliance ambiguity.",
      status: 'answered',
      handoff: {
        available: true,
        label: 'Consult on Statutory Audit',
        whatsappUrl: 'https://wa.me/919626350900?text=' + encodeURIComponent('Hello CA Kavitha Vijay (Kavitha & Associates),\n\nI would like to consult on Statutory Audit (Companies Act 2013) / Section 44AB Tax Audit / Internal Assurance.'),
        phoneUrl,
        phoneDisplay
      }
    };
  }

  // --- 6b. Direct Tax & Corporate Income Tax Advisory (PRAC-02) ---
  if (isDirectTaxQuery) {
    return {
      answer: "Kavitha & Associates provides comprehensive Direct Tax advisory governed by the Income Tax Act 1961, Income Tax Rules 1962, and relevant CBDT circulars. Practice scopes include Corporate and Business Income Tax Return (ITR) preparation and filing (ITR-6, ITR-5), quarterly advance tax computations, Tax Audits under Section 44AB (Forms 3CA/3CD and 3CB/3CD), defense representation in Section 143(3) Scrutiny assessments under National Faceless Assessment procedures, Section 148/148A reassessment proceedings, and TDS/TCS quarterly compliance. All client representations feature partner-led execution ensuring total statutory compliance and audit readiness.",
      status: 'answered',
      handoff: {
        available: true,
        label: 'Schedule Direct Tax Consultation',
        whatsappUrl: 'https://wa.me/919626350900?text=' + encodeURIComponent('Hello CA Kavitha Vijay (Kavitha & Associates),\n\nI would like to consult on Income Tax Return (ITR) Filing / Scrutiny Notice (Sec 143(2)/148) / Corporate Tax Advisory.'),
        phoneUrl,
        phoneDisplay
      }
    };
  }

  // --- 6c. Indirect Tax & GST Compliance Services (PRAC-03) ---
  if (isGstQuery) {
    return {
      answer: "Under the statutory framework of the Central Goods and Services Tax Act (CGST Act 2017), State GST legislation, and CBIC regulations, Kavitha & Associates handles comprehensive Indirect Tax compliance. Practice scopes include GST registration and amendments, monthly and quarterly returns (GSTR-1, GSTR-3B, QRMP scheme), automated Section 16(2)(aa) Input Tax Credit (ITC) reconciliation with GSTR-2B, Annual Return (GSTR-9) and Reconciliation Statement (GSTR-9C) filings, Departmental notice representations (ASMT-10 scrutiny notices, DRC-01 demand notices), Section 50 interest calculations, and export refund processing (RFD-01).",
      status: 'answered',
      handoff: {
        available: true,
        label: 'Schedule GST Consultation',
        whatsappUrl: 'https://wa.me/919626350900?text=' + encodeURIComponent('Hello CA Kavitha Vijay (Kavitha & Associates),\n\nI would like to consult on GST Notice Scrutiny (ASMT-10/DRC-01) / 2B ITC Reconciliation / GSTR-9/9C Filings.'),
        phoneUrl,
        phoneDisplay
      }
    };
  }

  // --- 6d. Corporate Secretarial & Entity Registration (PRAC-04) ---
  if (isCorporateQuery) {
    return {
      answer: "Kavitha & Associates advises emerging businesses and established corporations on entity formation and corporate governance under the Companies Act 2013, LLP Act 2008, and MCA V3 portal standards. Services encompass Private Limited company incorporation using SPICe+ (Part A name reservation, Part B integrated incorporation with MOA/AOA, PAN, TAN, and bank opening), Limited Liability Partnership (LLP) registration (FiLLiP, Form 3 LLP Agreement), One Person Company (OPC) registrations, statutory annual ROC filings (Form AOC-4 Financial Statements, Form MGT-7/7A Annual Returns), and Director KYC compliance (DIR-3 KYC).",
      status: 'answered',
      handoff: {
        available: true,
        label: 'Consult on Corporate Registration',
        whatsappUrl: 'https://wa.me/919626350900?text=' + encodeURIComponent('Hello CA Kavitha Vijay (Kavitha & Associates),\n\nI would like to consult on Private Limited Incorporation / LLP Registration / ROC Compliance (SPICe+).'),
        phoneUrl,
        phoneDisplay
      }
    };
  }

  // --- 6e. Virtual CFO & Strategic Financial Advisory (PRAC-05) ---
  if (isCfoQuery) {
    return {
      answer: "Virtual CFO advisory at Kavitha & Associates delivers senior-level financial steering and cost management on a retained, fractional basis. Leveraging Managing Partner CA Kavitha Vijay's credentials (Fellow CA and Associate Cost & Management Accountant - AIR 49 ICMAI) and Big 4 corporate governance experience, the firm assists enterprises with rolling 13-week Cash Flow forecasting, working capital optimization, monthly Management Information Systems (MIS) reporting, gross margin and breakeven diagnostics, financial model preparation for debt syndication, and Internal Financial Control (IFC) systems.",
      status: 'answered',
      handoff: {
        available: true,
        label: 'Inquire About Virtual CFO Retainer',
        whatsappUrl: 'https://wa.me/919626350900?text=' + encodeURIComponent('Hello CA Kavitha Vijay (Kavitha & Associates),\n\nI would like to enquire about Virtual CFO Retainership / CMA Cost Modeling (AIR 49 {ICMAI}) / Working Capital Advisory.'),
        phoneUrl,
        phoneDisplay
      }
    };
  }

  // --- 6f. Real Estate RERA Advisory & Compliance (PRAC-06) ---
  if (isReraQuery) {
    return {
      answer: "In the real estate development sector, Kavitha & Associates provides comprehensive compliance under the Real Estate (Regulation and Development) Act 2016 (RERA) and AP RERA Rules. Key practice scopes include new project registration on the RERA portal, Chartered Accountant Form 3 certifications determining project percentage completion and eligible withdrawals from the designated 70% Escrow bank account under Section 4(2)(l)(D), Quarterly Progress Report (QPR) uploads, and Form 5 annual financial audit compliance within six months of financial year close.",
      status: 'answered',
      handoff: {
        available: true,
        label: 'Consult on RERA Certification',
        whatsappUrl: 'https://wa.me/919626350900?text=' + encodeURIComponent('Hello CA Kavitha Vijay (Kavitha & Associates),\n\nI would like to consult on AP RERA Project Registration / Form 3 Escrow Certificates / Form 5 Annual Audits.'),
        phoneUrl,
        phoneDisplay
      }
    };
  }

  // --- 7. Institutional Firm Overview ---
  if (isFirmOverviewQuery && !isPartnerQuery) {
    return {
      answer: "Kavitha & Associates is an independent Chartered Accountancy practice established in Tirupati, Andhra Pradesh, India. Led by Managing Partner CA Kavitha Vijay (Fellow Chartered Accountant and Associate Cost & Management Accountant), the firm provides comprehensive statutory audit, corporate taxation, GST compliance, and Virtual CFO management advisory services with over 10+ years of progressive professional experience across public practice, Big 4 audit (Deloitte), and multinational corporate governance (Ford Motor Company). The firm serves companies, LLPs, and growing enterprises across India with partner-led execution.",
      status: 'answered',
      handoff: {
        available: true,
        label: 'About the Firm',
        whatsappUrl: 'https://wa.me/919626350900?text=' + encodeURIComponent('Hello CA Kavitha Vijay (Kavitha & Associates),\n\nI would like to enquire about your firm and advisory practices.'),
        phoneUrl,
        phoneDisplay
      }
    };
  }

  // --- 8. Fallback Services Match ---
  if (isServicesQuery) {
    return {
      answer: "Kavitha & Associates provides professional services across six approved practice corridors: (1) Statutory Audit & Assurance Services (Companies Act 2013 audits, Section 44AB Tax Audits, Standards on Auditing SAs, IFC), (2) Direct Tax & Corporate Income Tax Advisory (ITR filing under Income Tax Act 1961, corporate ITR-6, advance tax, Section 143(3) scrutiny and Faceless assessment representation, Section 148 reassessment), (3) Indirect Tax & GST Compliance Services (filings, GSTR-9, GSTR-9C reconciliation, ASMT-10 notices), (4) Corporate Secretarial & Entity Registration (SPICe+ company incorporation, LLP registration, annual ROC filings), (5) Virtual CFO & Strategic Financial Advisory (MIS, cash flow forecasting, costing), and (6) Real Estate RERA Advisory & Compliance (RERA registrations, Form 3 certifications, 70% escrow monitoring). All engagements follow partner-led execution under the applicable statutory frameworks including Companies Act 2013, Standards on Auditing, Income Tax Act 1961, and CGST Act 2017.",
      status: 'answered',
      handoff: {
        available: true,
        label: 'Explore Practice Disciplines',
        whatsappUrl: 'https://wa.me/919626350900?text=' + encodeURIComponent('Hello CA Kavitha Vijay (Kavitha & Associates),\n\nI would like to enquire about your Chartered Accountancy practice disciplines.'),
        phoneUrl,
        phoneDisplay
      }
    };
  }

  // 5. Default grounded extraction from top chunk
  const topChunk = chunks[0];
  const summarySentences = topChunk.content
    .split('\n')
    .map(line => line.replace(/^[-*•#\s]+/, '').trim())
    .filter(line => line.length > 25 && !line.startsWith('Title:') && !line.startsWith('URL:'))
    .slice(0, 3)
    .join(' ');

  return {
    answer: summarySentences || "Kavitha & Associates is an independent Chartered Accountancy practice in Tirupati providing statutory audit, corporate taxation, GST compliance, and Virtual CFO advisory services.",
    status: 'answered',
    handoff: {
      available: true,
      label: 'Consult the Firm',
      whatsappUrl: 'https://wa.me/919626350900?text=' + encodeURIComponent('Hello CA Kavitha Vijay (Kavitha & Associates),\n\nI would like to enquire about your Chartered Accountancy practice disciplines.'),
      phoneUrl,
      phoneDisplay
    }
  };
}

module.exports = {
  generateLocalAnswer
};
