export interface ServiceItem {
  id: string;
  name: string;
  description?: string;
}

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

export interface FirmProfile {
  name: string;
  legalType: string;
  tagline: string;
  partner: {
    name: string;
    designation: string;
    qualifications: string;
    role: string;
    memberships: string[];
    coreCompetencies: string[];
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
    name: "CA KavithaVijay SRJ",
    designation: "Practicing Chartered Accountant",
    qualifications: "B.Com, FCA, CMA",
    role: "Senior Partner",
    memberships: [
      "Fellow Member of the Institute of Chartered Accountants of India (ICAI)",
      "Member of the Institute of Cost Accountants of India (ICMAI)"
    ],
    coreCompetencies: [
      "Corporate & Statutory Audit",
      "Direct Tax Planning & Appellate Litigation",
      "GST Audits & ITC Reconciliations",
      "Cost Accounting & Internal Financial Controls",
      "MCA / ROC Secretarial Governance",
      "RERA Project Certification & Compliance"
    ]
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
        description: "Every engagement is directly supervised by CA KavithaVijay SRJ, ensuring senior technical competence at every stage."
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
      description: "Rigorous statutory examination, tax computation, or audit verification executed under the direct oversight of CA KavithaVijay SRJ."
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
    primaryLocation: "Bairagi Patteda, Tirupati, Andhra Pradesh – 517501",
    streetAddress: "Bairagi Patteda",
    locality: "Tirupati",
    postalCode: "517501",
    geoCoordinates: {
      latitude: 13.61925,
      longitude: 79.418028,
      dms: "13°37'09.3\"N 79°25'04.9\"E"
    },
    googleMapsUrl: "https://www.google.com/maps?q=13.61925,79.418028",
    region: "India (Pan-India Service Reach)",
    whatsappNumber: "+91 96263 50900",
    whatsappLink: "https://wa.me/919626350900?text=Hello%20CA%20KavithaVijay%20SRJ%2C%20I%20would%20like%20to%20enquire%20about%20your%20Chartered%20Accountancy%20services."
  },
  serviceFootprint: [
    { 
      city: "Tirupati", 
      state: "Andhra Pradesh", 
      type: "Primary Chambers",
      description: "Principal operating practice of CA KavithaVijay SRJ located at Bairagi Patteda, Tirupati – 517501."
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
      description: "Direct engagement with CA KavithaVijay SRJ on complex accounting standards, tax litigation, and statutory reporting matters."
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
  verificationNotes: {
    experienceNote: "Pending Client Clarification: The supplied profile states 'more than ten years of robust corporate experience'. As per project guidelines, this claim is set aside from marketing headlines until CA KavithaVijay SRJ confirms the exact wording, dates, and regulatory scope.",
    branchesNote: "Locations to confirm: Tirupati is presented as the primary practice base; Chennai, Bengaluru, Hyderabad, and Coimbatore are presented as regional client coverage areas. Confirm operational wording with the client."
  }
};
