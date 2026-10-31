export interface ServiceCategory {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  statutoryFramework?: string;
  targetClients?: string;
  typicalScenarios?: string[];
  services: string[];
}

export interface AuditItem {
  name: string;
  statute: string;
  scope: string;
  deliverable?: string;
  applicableEntity?: string;
}

export interface FAQItem {
  id: string;
  category: 'Audit & Assurance' | 'Income Tax' | 'GST Compliance' | 'Corporate & RERA';
  question: string;
  answer: string;
  statuteReference: string;
}

export interface OfficialPortal {
  name: string;
  authority: string;
  url: string;
  purpose: string;
}

export interface FirmProfile {
  name: string;
  legalType: string;
  tagline: string;
  partner: {
    name: string;
    designation: string;
    qualifications: string;
    membershipNumber?: string;
    role: string;
    tagline: string;
    summary: string;
    experienceYears: string;
    specialization: string;
    memberships: string[];
    coreCompetencies: string[];
    linkedinUrl?: string;
    awards: {
      title: string;
      category: string;
      organization: string;
    }[];
    education: {
      year: string;
      degree: string;
      institution: string;
      distinction?: string;
    }[];
    careerJourney: {
      role: string;
      organization: string;
      period: string;
      location: string;
      highlights: string[];
      keyEngagements?: string[];
    }[];
    languages: string[];
    traits: string[];
  };
  philosophy: {
    statement: string;
    corePrinciples: {
      title: string;
      description: string;
    }[];
  };
  workflow: {
    step: string;
    title: string;
    description: string;
  }[];
  contact: {
    primaryPhone: string;
    primaryPhoneClean: string;
    secondaryPhone: string;
    secondaryPhoneClean: string;
    email: string;
    primaryLocation: string;
    streetAddress: string;
    locality: string;
    postalCode: string;
    geoCoordinates: {
      latitude: number;
      longitude: number;
      dms: string;
    };
    googleMapsUrl: string;
    region: string;
    whatsappNumber: string;
    linkedinUrl?: string;
    whatsappLink: string;
  };
  serviceFootprint: {
    city: string;
    state: string;
    type: 'Primary Chambers' | 'Regional Client Coverage';
    description: string;
  }[];
  pillars: {
    title: string;
    description: string;
  }[];
  industries: string[];
  serviceCategories: ServiceCategory[];
  auditSpotlight: {
    title: string;
    subtitle: string;
    description: string;
    services: AuditItem[];
  };
  faqs: FAQItem[];
  officialPortals: OfficialPortal[];
  verificationNotes: {
    experienceNote: string;
    branchesNote: string;
  };
}

export const FIRM_DATA: FirmProfile = {
  name: "Kavitha & Associates",
  legalType: "Chartered Accountants | Cost Accountants",
  tagline: "TRUST | EXPERTISE | YOUR GROWTH PARTNER",
  partner: {
    name: "CA Kavitha Vijay",
    designation: "Practicing Chartered Accountant & Cost Accountant",
    qualifications: "B.Com, CA, CMA (AIR 49)",
    role: "Managing Partner",
    tagline: "MNC Auditor with Big 4 Experience of 10+ Years",
    linkedinUrl: "https://www.linkedin.com/in/ca-kavitha-srj-770988199",
    summary: "Results-driven Chartered Accountant and Cost & Management Accountant with 10+ years of progressive experience spanning Big 4 audit (Deloitte), multinational internal audit (Ford Motor Company), and public practice. Demonstrated expertise across enterprise risk management, internal controls, statutory audits, IPO engagements, and cross-border audit projects in Asia-Pacific, Africa, and Europe. Recognised with prestigious individual and team performance awards at Ford Motor Company and Deloitte. Known for translating complex audit findings into impactful management insights.",
    experienceYears: "10+ Years",
    specialization: "Audit Expert | Compliance & Advisory Expert | International Exposure | Career Mentorship & Financial Literacy for B2C & B2B",
    memberships: [
      "The Institute of Chartered Accountants of India (ICAI)",
      "The Institute of Cost Accountants of India (ICMAI) — All India Rank 49 in CMA Intermediate"
    ],
    coreCompetencies: [
      "Enterprise Risk Management",
      "Internal Audit & Risk-Based Auditing",
      "Statutory & Tax Audits (ICAI Standards)",
      "Internal Financial Controls (ICFR)",
      "IPO Audit Engagements",
      "Transfer Pricing & Global Compliance",
      "Cross-Border & Onsite Audit Execution",
      "GST & Income Tax Compliance",
      "Management Reporting & Advisory",
      "Conflict Resolution & Stakeholder Management"
    ],
    awards: [
      {
        title: "Move the Dot",
        category: "Individual Excellence Award",
        organization: "Deloitte Haskins & Sells"
      },
      {
        title: "Live the Dot",
        category: "Team Achievement Award",
        organization: "Deloitte Haskins & Sells"
      },
      {
        title: "All India 49th Rank",
        category: "CMA Intermediate Merit",
        organization: "Institute of Cost Accountants of India"
      }
    ],
    education: [
      {
        year: "2019",
        degree: "Chartered Accountant (CA)",
        institution: "Institute of Chartered Accountants of India (ICAI)",
        distinction: "Chartered Accountant"
      },
      {
        year: "2019",
        degree: "Cost & Management Accountant (CMA)",
        institution: "Institute of Cost Accountants of India (ICMAI)",
        distinction: "All India Rank 49 in CMA Intermediate"
      },
      {
        year: "2017",
        degree: "Bachelor of Commerce (B.Com)",
        institution: "Madras University"
      }
    ],
    careerJourney: [
      {
        role: "Business Auditor",
        organization: "Ford Motor Company Private Limited",
        period: "April 2022 – January 2026",
        location: "Chennai, India (Onsite in South Africa & Australia)",
        highlights: [
          "Led comprehensive enterprise risk interviews with C-suite and senior leadership, prioritising key operational and strategic risks across multiple business functions.",
          "Executed risk-based audits assessing process effectiveness, internal controls, and compliance, delivering corrective action plans that measurably strengthened the control environment.",
          "Visited South Africa and Australia, demonstrating cross-border audit execution across diverse international regulatory environments.",
          "Provided advisory support for new system launches — proactively identifying process bottlenecks and control gaps before go-live.",
          "Collaborated with global SMEs, skill teams, and senior leadership to align audit findings with enterprise business priorities."
        ],
        keyEngagements: [
          "Global Warranty Reserve & Forecast Audit",
          "Global Transfer Pricing Audit",
          "FCSD India Strategy Post-Restructuring Audit",
          "Change Management Audit — New IT System",
          "Ford Motor Company South Africa Manufacturing Audit (Onsite)",
          "Ford–Volkswagen Strategic Alliance Audit",
          "South Africa – DEI & Sustainability Review",
          "Australia Market Review (Onsite)",
          "IMPRS Segmentation Implementation & Governance",
          "GPDS Market Equation Audit"
        ]
      },
      {
        role: "Deputy Manager — Assurance (Statutory Audit)",
        organization: "Deloitte Haskins & Sells",
        period: "February 2020 – March 2022",
        location: "Chennai, India",
        highlights: [
          "Field Senior on a landmark ₹1,000 Crore IPO engagement — one of India's significant public listings, demanding the highest standards of audit rigour and investor confidence.",
          "Conferred Move the Dot (Individual Excellence) & Live the Dot (Team Achievement) Awards for outstanding audit delivery and cross-functional leadership.",
          "Directed statutory, tax, and limited review audits with full ICFR assessments for listed and private entities across service and manufacturing sectors (up to ₹2,000 Crore turnover).",
          "Designed and executed audit plans aligned with ICAI professional standards and Deloitte global methodology, consistently delivering within deadlines.",
          "Reported findings and management letters directly to the Engagement Partner — reflecting senior-level trust and accountability."
        ]
      },
      {
        role: "Articled Assistant",
        organization: "Manohar Chowdhry & Associates",
        period: "September 2016 – September 2019",
        location: "Chennai, India",
        highlights: [
          "Conducted statutory, internal, and GST audits for listed and private companies across multiple sectors.",
          "Independently managed income tax matters — assessments, scrutiny cases, and return filings — for corporate and high-net-worth individual clients.",
          "Prepared and filed income tax returns, building deep expertise in Indian direct taxation and appellate procedure."
        ]
      }
    ],
    languages: ["Tamil", "Telugu", "English (Professional Proficiency)"],
    traits: ["Optimistic", "Conflict Resolution", "Decision Making", "Team Worker", "Self-Motivated", "Diligent"]
  },
  philosophy: {
    statement: "Technical precision rooted in statutory independence and practical commercial thinking. We bridge rigorous compliance with strategic business growth.",
    corePrinciples: [
      {
        title: "Statutory Independence & Integrity",
        description: "Uncompromising adherence to ICAI Auditing Standards, ensuring true, fair, and legally resilient financial reporting."
      },
      {
        title: "Partner-Supervised Accountability",
        description: "Every engagement is directly supervised by CA Kavitha Vijay, ensuring senior technical competence at every stage."
      },
      {
        title: "Integrated CA + CMA Competence",
        description: "Dual Chartered Accountancy and Cost Accountancy capability delivering both tax compliance and internal operational cost governance."
      },
      {
        title: "Strict Confidentiality & Ethics",
        description: "Zero-compromise data integrity protecting client fiscal records under the strict ethical code of the ICAI."
      }
    ]
  },
  workflow: [
    {
      step: "01",
      title: "Discovery & Scoping",
      description: "Direct initial consultation to evaluate your business structure, statutory calendar, and specific filing or audit requirements."
    },
    {
      step: "02",
      title: "Document Review & Reconciliations",
      description: "Structured verification of general ledgers, GST returns, bank statements, and tax credit registers to identify variances early."
    },
    {
      step: "03",
      title: "Partner-Supervised Execution",
      description: "Rigorous statutory examination, tax computation, or audit verification executed under the direct oversight of CA Kavitha Vijay."
    },
    {
      step: "04",
      title: "Filing, Certification & Advisory",
      description: "Timely portal submissions, statutory certificates, and actionable fiscal insights to protect your business against penalties."
    }
  ],
  contact: {
    primaryPhone: "+91 96263 50900",
    primaryPhoneClean: "919626350900",
    secondaryPhone: "+91 95421 53906",
    secondaryPhoneClean: "919542153906",
    email: "cakavithasrj@gmail.com",
    primaryLocation: "19-12-46, 1st Floor, Near Bairagipetteda Arch, Tirupati, Andhra Pradesh 517501, India",
    streetAddress: "19-12-46, 1st Floor, Near Bairagipetteda Arch, Bairagi Patteda",
    locality: "Tirupati",
    postalCode: "517501",
    geoCoordinates: {
      latitude: 13.6192242,
      longitude: 79.418046,
      dms: "13°37'09.2\"N 79°25'05.0\"E"
    },
    googleMapsUrl: "https://maps.app.goo.gl/p9ToGUtxqYDCghpF6",
    region: "India (Pan-India Service Reach)",
    whatsappNumber: "+91 96263 50900",
    linkedinUrl: "https://www.linkedin.com/in/ca-kavitha-srj-770988199",
    whatsappLink: "https://wa.me/919626350900?text=Hello%20CA%20Kavitha%20Vijay%20(Kavitha%20%26%20Associates)%2C%20I%20would%20like%20to%20enquire%20about%20your%20Chartered%20Accountancy%20services."
  },
  serviceFootprint: [
    { 
      city: "Tirupati", 
      state: "Andhra Pradesh", 
      type: "Primary Chambers",
      description: "Principal operating practice of CA Kavitha Vijay located at Bairagi Patteda, 19-12-46, 1st Floor, Near Bairagipetteda Arch, Tirupati – 517501."
    },
    { 
      city: "Chennai", 
      state: "Tamil Nadu", 
      type: "Regional Client Coverage",
      description: "Corporate compliance, GST litigation, and statutory audits for Tamil Nadu business corridors."
    },
    { 
      city: "Bengaluru", 
      state: "Karnataka", 
      type: "Regional Client Coverage",
      description: "Startup structuring, virtual CFO mandates, and technology sector audit support."
    },
    { 
      city: "Hyderabad", 
      state: "Telangana", 
      type: "Regional Client Coverage",
      description: "Real estate RERA advisory, project finance assistance, and corporate tax compliance."
    },
    { 
      city: "Coimbatore", 
      state: "Tamil Nadu", 
      type: "Regional Client Coverage",
      description: "Manufacturing stock audits, MSME financial controls, and indirect tax health checks."
    }
  ],
  pillars: [
    {
      title: "Partner-Level Attention",
      description: "Direct engagement with CA Kavitha Vijay on complex accounting standards, tax litigation, and statutory reporting matters."
    },
    {
      title: "Robust Corporate & Practical Expertise",
      description: "Deep proficiency spanning statutory audit frameworks, direct tax statutes, GST litigation, and MCA corporate affairs."
    },
    {
      title: "Ethical & Transparent Professional Standards",
      description: "Rigorous adherence to the Institute of Chartered Accountants of India (ICAI) code of ethics, ensuring total confidentiality and independence."
    },
    {
      title: "Timely Compliance & Reliable Delivery",
      description: "Structured compliance calendars and diligent tracking to safeguard businesses from interest, penalties, and procedural lapses."
    },
    {
      title: "Business-Focused Advisory Approach",
      description: "Practical financial intelligence and risk-mitigated strategies tailored to the economic realities of founders and corporations."
    }
  ],
  industries: [
    "Startups",
    "MSMEs",
    "Manufacturing",
    "Real Estate & Construction",
    "Retail & Trading",
    "Healthcare",
    "Education",
    "E-Commerce",
    "Professionals & Consultants",
    "NGOs & Trusts"
  ],
  auditSpotlight: {
    title: "Audit & Assurance Services",
    subtitle: "AUDIT SPOTLIGHT",
    description: "Independent, thorough, and compliant audits that build trust with lenders, investors, and regulators, delivered with dedicated partner-level attention.",
    services: [
      {
        name: "Statutory Audit",
        statute: "Companies Act, 2013",
        scope: "Independent opinion on true and fair financial statements, Internal Financial Controls (IFC), and CARO reporting.",
        deliverable: "Independent Auditor's Report & IFC Assurance",
        applicableEntity: "Private & Public Companies, LLPs"
      },
      {
        name: "Tax Audit",
        statute: "Sec 44AB, Income Tax Act",
        scope: "Verification of books, allowable deductions, 3CD reporting clauses, and tax compliance reconciliations.",
        deliverable: "Form 3CA/3CB & Form 3CD Filing",
        applicableEntity: "Businesses with turnover > ₹1 Cr / ₹10 Cr & Professionals"
      },
      {
        name: "Internal Audit",
        statute: "Corporate Governance",
        scope: "Objective risk appraisal, process gap analysis, and fraud prevention controls for operating management.",
        deliverable: "Executive Internal Audit & Risk Matrix Report",
        applicableEntity: "Growing Enterprises, Corporates & Multi-Branch Entities"
      },
      {
        name: "Concurrent Audit",
        statute: "Banking & Treasury Norms",
        scope: "Continuous verification of high-value transactions, loan disbursements, and prudential banking compliance.",
        deliverable: "Monthly Concurrent Compliance Certification",
        applicableEntity: "Commercial Banks, Financial Institutions & Treasuries"
      },
      {
        name: "Stock & Inventory Audit",
        statute: "Asset Verification",
        scope: "Physical inventory counting, valuation, obsolete stock identification, and bank drawing-power certification.",
        deliverable: "Physical Verification Certificate & DP Reconciliation",
        applicableEntity: "Manufacturers, Warehouses & Borrowers with CC Limits"
      },
      {
        name: "Due Diligence",
        statute: "M&A / Investment",
        scope: "Comprehensive financial, legal, and tax scrutiny evaluating liabilities and asset valuations for investors.",
        deliverable: "Comprehensive Due Diligence & Valuation Report",
        applicableEntity: "Funded Startups, Acquirers & Institutional Investors"
      },
      {
        name: "Turnover Audit",
        statute: "Statutory Certifications",
        scope: "Independent turnover verification required for tender bids, government schemes, and revenue thresholds.",
        deliverable: "Chartered Accountant Turnover Certificate",
        applicableEntity: "Government Contractors, Tender Bidders & MSMEs"
      },
      {
        name: "Compliance Review & Risk Assessment",
        statute: "Multi-Statute Verification",
        scope: "Holistic review of labor, direct tax, GST, and secretarial requirements to preempt regulatory scrutiny.",
        deliverable: "Comprehensive Statutory Health-Check Report",
        applicableEntity: "Mid-Market Corporations & Expansion-Stage Firms"
      },
      {
        name: "Management Audit",
        statute: "Executive Oversight",
        scope: "Appraisal of departmental efficiency, capital utilization, and organizational governance effectiveness.",
        deliverable: "Strategic Management Appraisal & Operational Insights",
        applicableEntity: "Boards of Directors & Enterprise Promoters"
      }
    ]
  },
  serviceCategories: [
    {
      id: "income-tax",
      title: "Income Tax Services",
      shortDescription: "Strategic direct tax planning, corporate filing, scrutiny representation, and appellate support.",
      fullDescription: "Comprehensive direct tax services from routine return preparation to complex dispute resolution before appellate authorities, structured to protect financial compliance.",
      statutoryFramework: "Income Tax Act, 1961 & CBDT Guidelines",
      targetClients: "Companies, LLPs, High-Net-Worth Individuals, Trusts & MSMEs",
      typicalScenarios: [
        "Filing mandatory corporate or individual annual ITR with complex capital gains",
        "Responding to scrutiny notices under Section 143(2) or 148",
        "Structuring advance tax and minimizing TDS non-compliance penalties",
        "Appeals before Commissioner of Income Tax (Appeals)"
      ],
      iconName: "FileSpreadsheet",
      services: [
        "ITR Filing - Individuals, Firms, Companies & Trusts",
        "Tax Planning & Advisory",
        "Corporate Tax Compliance",
        "TDS Returns & Advisory",
        "Assessment & Scrutiny Handling",
        "Appeals before Tax Authorities",
        "Capital Gains Planning",
        "International Tax Advisory"
      ]
    },
    {
      id: "gst",
      title: "GST Services",
      shortDescription: "End-to-end Indirect Tax management, periodic filings, audit reconciliation, and departmental representation.",
      fullDescription: "Holistic Goods & Services Tax compliance, health-checks, ITC optimization, and representation during audits and departmental inquiries.",
      statutoryFramework: "Central & State Goods and Services Tax Acts (CGST/SGST/IGST)",
      targetClients: "Manufacturers, Traders, Real Estate Developers, Tech Startups & Service Providers",
      typicalScenarios: [
        "Resolving GSTR-2B vs. GSTR-3B Input Tax Credit (ITC) mismatches",
        "Handling Departmental Scrutiny notices (ASMT-10, DRC-01)",
        "Annual GST return preparation and reconciliation (GSTR-9 & 9C)",
        "Multi-state GST registration for inter-state businesses and e-commerce"
      ],
      iconName: "Receipt",
      services: [
        "GST Registration & Amendment",
        "Monthly / Quarterly Returns (GSTR-1, GSTR-3B, GSTR-9, GSTR-9C)",
        "GST Audit & Reconciliation",
        "GST Advisory & Structuring",
        "GST Health Check & Compliance Review",
        "GST Litigation & Departmental Representation",
        "Input Tax Credit Optimization"
      ]
    },
    {
      id: "corporate-business",
      title: "Corporate & Business Services",
      shortDescription: "Entity incorporation, MCA/ROC filings, restructuring, loan syndication, and Virtual CFO support.",
      fullDescription: "From early-stage business incorporation to ongoing secretarial compliance, project financing, and outsourced CFO leadership for growing enterprises.",
      statutoryFramework: "Companies Act, 2013 & LLP Act, 2008 (Ministry of Corporate Affairs)",
      targetClients: "Growing Startups, Private Limited Companies, LLPs & Family Businesses",
      typicalScenarios: [
        "Incorporating a Private Limited or LLP entity with DPIIT startup recognition",
        "Mandatory annual ROC filings (AOC-4, MGT-7, DIR-3 KYC)",
        "Director additions/resignations, share transfers, and capital increases",
        "Preparing Bank Loan CMA data and project reports for working capital"
      ],
      iconName: "Building2",
      services: [
        "Company Incorporation & LLP Registration",
        "ROC & MCA Compliance",
        "Director Services & Shareholding Changes",
        "Startup Advisory & Business Structuring",
        "Corporate Restructuring",
        "Project Finance & Loan Assistance",
        "Virtual CFO Services",
        "MIS & Financial Reporting"
      ]
    },
    {
      id: "rera-compliance",
      title: "RERA Compliance & Certification",
      shortDescription: "Specialized advisory for builders and developers, quarterly compliance, and mandatory CA certificates.",
      fullDescription: "Dedicated regulatory guidance for real-estate project developers ensuring compliance with Real Estate (Regulation and Development) Act standards.",
      statutoryFramework: "Real Estate (Regulation and Development) Act, 2016 (AP RERA / TN RERA)",
      targetClients: "Real Estate Developers, Commercial Builders & Layout Promoters",
      typicalScenarios: [
        "Securing mandatory CA Form 3 Certificates for fund withdrawals from designated escrow",
        "Project completion cost verification and percentage-of-completion audits",
        "Quarterly RERA portal updating and statutory project compliance audit",
        "Joint Development Agreement (JDA) tax structuring and capital gains"
      ],
      iconName: "Building",
      services: [
        "RERA Registration for Builders & Developers",
        "Quarterly & Annual RERA Compliance",
        "CA Certificates under RERA",
        "Project Cost & Fund Utilization Certification",
        "Ongoing Advisory for Real Estate Projects"
      ]
    },
    {
      id: "advisory-consulting",
      title: "Advisory & Consulting",
      shortDescription: "Internal controls, fraud review, business process enhancement, and forward financial planning.",
      fullDescription: "High-level management consulting designed to strengthen governance, identify operational leakage, and assist founders with structured capital and growth paths.",
      statutoryFramework: "ICAI Internal Control Guidance & Management Accounting Frameworks",
      targetClients: "Established Enterprises, Mid-Market Corporates & Professional Partnerships",
      typicalScenarios: [
        "Auditing internal financial controls (IFC) and operating SOPs to prevent leakage",
        "Budgeting, variance reporting, and margin analysis by a qualified CMA",
        "Pre-investment transaction financial due diligence for investors and founders",
        "Forensic accounting reviews and fraud prevention safeguards"
      ],
      iconName: "LineChart",
      services: [
        "Business Process Improvement",
        "Financial Planning & Budgeting",
        "Internal Control & Risk Management",
        "Forensic Accounting & Fraud Review",
        "Strategic Business Advisory",
        "Investment & Growth Planning"
      ]
    }
  ],
  faqs: [
    {
      id: "statutory-audit-mandate",
      category: "Audit & Assurance",
      question: "Which entities are legally mandated to conduct an independent Statutory Audit in India?",
      answer: "Under Section 139 of the Companies Act, 2013, every incorporated company—whether Private Limited, One Person Company (OPC), or Public Limited—must appoint an independent practicing Chartered Accountant to conduct an annual statutory audit of its financial statements. This statutory requirement applies regardless of capital base, turnover volume, or whether the company made a profit or loss during the financial year.",
      statuteReference: "Section 139, Companies Act, 2013"
    },
    {
      id: "tax-audit-thresholds",
      category: "Income Tax",
      question: "When does a business enterprise or professional require a Tax Audit under Section 44AB?",
      answer: "Under Section 44AB of the Income Tax Act, 1961, businesses with gross turnover exceeding ₹1 Crore (or ₹10 Crores where aggregate cash receipts and payments do not exceed 5% of total turnover) are required to have their accounts audited by a Chartered Accountant. For professionals declaring income under presumptive schemes (Section 44ADA) claiming profits below the prescribed percentage, a formal tax audit report in Form 3CA/3CB and Form 3CD must be furnished.",
      statuteReference: "Section 44AB, Income Tax Act, 1961"
    },
    {
      id: "gst-itc-reconciliation",
      category: "GST Compliance",
      question: "How are Input Tax Credit (ITC) discrepancies between GSTR-2B and GSTR-3B resolved?",
      answer: "Under Section 16(2)(aa) of the CGST Act, Input Tax Credit can strictly be availed only if invoice details are uploaded by suppliers and reflected in the auto-generated GSTR-2B. We execute line-by-line invoice reconciliations, identify default vendors, advise on reverse charge applicability, and draft structured factual replies to departmental intimations such as Form DRC-01A or ASMT-10 notices.",
      statuteReference: "Section 16(2)(aa), CGST Act, 2017 & Rule 36(4)"
    },
    {
      id: "pvtltd-vs-llp",
      category: "Corporate & RERA",
      question: "What are the statutory differences between incorporating as a Private Limited Company vs. an LLP?",
      answer: "A Private Limited Company is the standard legal structure for venture capital investment, angel funding, employee stock options (ESOPs), and DPIIT startup tax exemptions (under Section 80-IAC). An LLP provides corporate limited liability with lower mandatory secretarial filing burdens and no dividend distribution tax complexities, making it ideal for consulting firms, professional practices, and closely held service businesses.",
      statuteReference: "Companies Act, 2013 & LLP Act, 2008"
    },
    {
      id: "rera-ca-certificates",
      category: "Corporate & RERA",
      question: "Why are Chartered Accountant certificates mandatory for real estate project developers under RERA?",
      answer: "Under Section 4(2)(l)(D) of the Real Estate (Regulation and Development) Act, 2016, 70% of funds realized from allottees must be deposited in a designated escrow bank account. CA certificates (Form 3) are legally required before funds can be withdrawn, verifying project completion percentages, incurred land and construction costs, and ensuring funds are not diverted away from project execution.",
      statuteReference: "Section 4(2)(l)(D), RERA Act, 2016"
    },
    {
      id: "consultation-confidentiality",
      category: "Audit & Assurance",
      question: "How does CA Kavitha & Associates conduct consultations and maintain client data security?",
      answer: "Initial discussions can be conducted either in person at our practice chambers at 19-12-46, 1st Floor, Near Bairagipetteda Arch, Tirupati, or through encrypted remote video/WhatsApp channels. In strict accordance with the Institute of Chartered Accountants of India (ICAI) Code of Ethics, all financial records, audit workpapers, and corporate disclosures are maintained under total professional confidentiality.",
      statuteReference: "ICAI Code of Ethics (Chartered Accountants Act, 1949)"
    }
  ],
  officialPortals: [
    {
      name: "Income Tax Department e-Filing",
      authority: "Central Board of Direct Taxes (CBDT)",
      url: "https://www.incometax.gov.in/",
      purpose: "ITR Filing, AIS/TIS Verification, PAN Services & Tax Scrutiny Portal"
    },
    {
      name: "GST Common Portal",
      authority: "Goods and Services Tax Network (GSTN)",
      url: "https://www.gst.gov.in/",
      purpose: "GSTR Returns, E-Way Bill, ITC Reconciliation & Departmental Notices"
    },
    {
      name: "Ministry of Corporate Affairs (MCA21)",
      authority: "Government of India",
      url: "https://www.mca.gov.in/",
      purpose: "Company & LLP Incorporation, Annual ROC Filings & Director KYC"
    },
    {
      name: "Institute of Chartered Accountants of India",
      authority: "ICAI Apex Regulatory Body",
      url: "https://www.icai.org/",
      purpose: "Standards on Auditing (SAs), Ethics Guidance & UDIN Verification"
    },
    {
      name: "Andhra Pradesh RERA Portal",
      authority: "AP Real Estate Regulatory Authority",
      url: "https://rera.ap.gov.in/",
      purpose: "Real Estate Project Registration, Quarterly Compliance & CA Certificates"
    }
  ],
  verificationNotes: {
    experienceNote: "Pending Client Clarification: The supplied profile states 'more than ten years of robust corporate experience'. As per project guidelines, this claim is set aside from marketing headlines until CA Kavitha Vijay confirms the exact wording, dates, and regulatory scope.",
    branchesNote: "Locations to confirm: Tirupati is presented as the primary practice base; Chennai, Bengaluru, Hyderabad, and Coimbatore are presented as regional client coverage areas. Confirm operational wording with the client."
  }
};
