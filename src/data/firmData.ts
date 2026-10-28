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
  services: string[];
}

export interface AuditItem {
  name: string;
  statute: string;
  scope: string;
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
  };
  contact: {
    primaryPhone: string;
    primaryPhoneClean: string;
    secondaryPhone: string;
    secondaryPhoneClean: string;
    email: string;
    primaryLocation: string;
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
    role: "Senior Partner"
  },
  contact: {
    primaryPhone: "+91 96263 50900",
    primaryPhoneClean: "919626350900",
    secondaryPhone: "+91 95421 53906",
    secondaryPhoneClean: "919542153906",
    email: "cakavithasrj@gmail.com",
    primaryLocation: "Tirupati, Andhra Pradesh",
    region: "India (Pan-India Service Reach)",
    whatsappNumber: "+91 96263 50900",
    whatsappLink: "https://wa.me/919626350900?text=Hello%20CA%20KavithaVijay%20SRJ%2C%20I%20would%20like%20to%20enquire%20about%20your%20Chartered%20Accountancy%20services."
  },
  serviceFootprint: [
    { 
      city: "Tirupati", 
      state: "Andhra Pradesh", 
      type: "Primary Chambers",
      description: "Principal operating practice and registered chambers of CA KavithaVijay SRJ."
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
    description: "Independent, thorough, and compliant audits that build trust with lenders, investors, and regulators — delivered with dedicated partner-level attention.",
    services: [
      {
        name: "Statutory Audit",
        statute: "Companies Act, 2013",
        scope: "Independent opinion on true and fair financial statements, Internal Financial Controls (IFC), and CARO reporting."
      },
      {
        name: "Concurrent Audit",
        statute: "Banking & Treasury Norms",
        scope: "Continuous verification of high-value transactions, loan disbursements, and prudential banking compliance."
      },
      {
        name: "Internal Audit",
        statute: "Corporate Governance",
        scope: "Objective risk appraisal, process gap analysis, and fraud prevention controls for operating management."
      },
      {
        name: "Stock & Inventory Audit",
        statute: "Asset Verification",
        scope: "Physical inventory counting, valuation, obsolete stock identification, and bank drawing-power certification."
      },
      {
        name: "Tax Audit",
        statute: "Sec 44AB, Income Tax Act",
        scope: "Verification of books, allowable deductions, 3CD reporting clauses, and tax compliance reconciliations."
      },
      {
        name: "Due Diligence",
        statute: "M&A / Investment",
        scope: "Comprehensive financial, legal, and tax scrutiny evaluating liabilities and asset valuations for investors."
      },
      {
        name: "Turnover Audit",
        statute: "Statutory Certifications",
        scope: "Independent turnover verification required for tender bids, government schemes, and revenue thresholds."
      },
      {
        name: "Compliance Review & Risk Assessment",
        statute: "Multi-Statute Verification",
        scope: "Holistic review of labor, direct tax, GST, and secretarial requirements to preempt regulatory scrutiny."
      },
      {
        name: "Management Audit",
        statute: "Executive Oversight",
        scope: "Appraisal of departmental efficiency, capital utilization, and organizational governance effectiveness."
      }
    ]
  },
  serviceCategories: [
    {
      id: "income-tax",
      title: "Income Tax Services",
      shortDescription: "Strategic direct tax planning, corporate filing, scrutiny representation, and appellate support.",
      fullDescription: "Comprehensive direct tax services from routine return preparation to complex dispute resolution before appellate authorities, structured to protect financial compliance.",
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
    branchesNote: "Verified: Tirupati is the registered primary practice. The 4 additional cities (Chennai, Bengaluru, Hyderabad, Coimbatore) are presented strictly as active client service coverage corridors, not brick-and-mortar branch offices."
  }
};
