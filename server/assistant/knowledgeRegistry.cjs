/**
 * server/assistant/knowledgeRegistry.cjs
 * 
 * Approved Public Knowledge Sources Registry for Kavitha & Associates.
 * Strictly extracts public, verified facts while blocking:
 * - Draft articles (e.g. internal-audit-best-practices)
 * - Personal PII (PAN, Aadhaar, private bank details)
 * - Individual ICAI membership numbers (redacted to [REDACTED_MEMBERSHIP_NO])
 * - Unapproved CV files, employee records, or client names.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function sha256(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

/**
 * Loads all approved public knowledge documents.
 * Returns an array of logical document specifications.
 */
function getApprovedKnowledgeSources() {
  const sources = [];

  // =========================================================================
  // 1. Core Institutional & Partner Credentials Baseline
  // =========================================================================
  const firmProfileContent = `
Kavitha & Associates is an independent Chartered Accountancy firm established in Tirupati, Andhra Pradesh, India.
The firm is led by Managing Partner CA Kavitha Vijay, a Fellow Chartered Accountant (ICAI Practicing Fellow) and Associate Cost & Management Accountant (ACMA / ICMAI).
Professional Credentials of Managing Partner CA Kavitha Vijay:
- Educational Qualifications: Bachelor of Commerce (B.Com).
- Professional Qualifications: Chartered Accountant (CA) from The Institute of Chartered Accountants of India (ICAI).
- Cost & Management Accountant (CMA) from The Institute of Cost Accountants of India (ICMAI).
- Competitive Honor: Achieved All India Rank 49 (AIR 49) in the CMA Intermediate examination, awarded specifically by ICMAI.
- Professional Membership: ICAI Practicing Fellow with redacted public identifier [REDACTED_MEMBERSHIP_NO], complying with professional privacy and disclosure standards.
- Experience & Pedigree: Over 10+ years of progressive professional experience across Big 4 audit, multinational internal audit, and independent public practice.
- Former Senior Auditor at Deloitte (Big 4 audit firm), leading enterprise statutory audits, internal financial controls (IFC), and corporate compliance reviews.
- Former Internal Audit professional at Ford Motor Company, overseeing cross-border financial governance and operational internal audits across the Asia-Pacific region.
- Core Specializations: Statutory audit, corporate taxation, GST compliance, internal controls, RERA advisory, and Virtual CFO management advisory.
`.trim();

  sources.push({
    source_id: 'firm-profile-core',
    source_type: 'institutional_profile',
    title: 'Firm Overview & Senior Leadership Profile',
    canonical_url: '/about',
    content: firmProfileContent,
    content_hash: sha256(firmProfileContent),
    publication_status: 'published',
    approval_status: 'approved',
    visibility: 'public',
    language: 'en',
    published_at: '2026-04-01T00:00:00.000Z',
    last_indexed_at: new Date().toISOString(),
    source_version: '8.2'
  });

  // =========================================================================
  // 2. Chambers Coordinates & Contact Information
  // =========================================================================
  const contactContent = `
Chambers Address & Physical Office Coordinates:
- Physical Office Address: 19-12-46, 1st Floor, Near Bairagipetteda Arch, Bairagi Patteda, Tirupati, Andhra Pradesh – 517501, India.
- Primary Chambers Contact Number: +91 96263 50900.
- Secondary Chambers Contact Number: +91 95421 53906.
- Official Practice Email: cakavithasrj@gmail.com.
- Office Hours: Monday to Saturday, 9:30 AM to 7:30 PM IST. Sunday: Closed / Prior Appointment Only.
- Client Engagement Protocol: Chambers consultations are scheduled by prior appointment. Direct WhatsApp and phone connections are available for corporate and individual advisory inquiries.
`.trim();

  sources.push({
    source_id: 'chambers-contact',
    source_type: 'contact_directory',
    title: 'Chambers Coordinates & Contact Desk',
    canonical_url: '/contact',
    content: contactContent,
    content_hash: sha256(contactContent),
    publication_status: 'published',
    approval_status: 'approved',
    visibility: 'public',
    language: 'en',
    published_at: '2026-04-01T00:00:00.000Z',
    last_indexed_at: new Date().toISOString(),
    source_version: '8.2'
  });

  // =========================================================================
  // 3. Six Approved Practice Corridors
  // =========================================================================
  const corridors = [
    {
      id: 'prac-01-audit',
      title: 'Statutory Audit & Assurance Services',
      canonical_url: '/services/audit-assurance',
      content: `
Practice Corridor PRAC-01: Statutory Audit & Assurance Services
Statutory Framework: Companies Act 2013, Standards on Auditing (SAs) issued by ICAI.
Target Entities: Private Limited Companies, Public Limited Companies, Trusts, and Specified Section 44AB Entities.
Scope of Services:
- Statutory Company Audits under Section 139 of the Companies Act 2013.
- Tax Audits under Section 44AB of the Income Tax Act 1961.
- Internal Financial Controls (IFC) audits and testing.
- Management and Operational Internal Audits.
- Stock Audits and Bank Concurrent Audits.
Deliverables: Independent Auditor's Report, Form 3CA/3CD or 3CB/3CD, IFC evaluation memorandums, and Board audit recommendations.
Engagement Approach: Partner-led audit planning, risk-based sampling, and strict adherence to ICAI auditing standards without delegating core verification to junior staff.
`.trim()
    },
    {
      id: 'prac-02-income-tax',
      title: 'Direct Tax & Corporate ITR Advisory',
      canonical_url: '/services/income-tax-consultant-tirupati',
      content: `
Practice Corridor PRAC-02: Direct Tax & Corporate Income Tax Advisory
Statutory Framework: Income Tax Act 1961, Income Tax Rules 1962, CBDT Circulars and Notifications.
Target Entities: Corporate Entities, LLPs, Partnership Firms, High Net-Worth Individuals (HNIs), and Charitable Trusts.
Scope of Services:
- Corporate and Business Income Tax Return (ITR) Preparation and Filing (ITR-6, ITR-5).
- Advance Tax Computations and Quarterly Tax Steering.
- Scrutiny Assessment Representation under Section 143(3) and Faceless Assessment Support.
- Income Tax Reassessment defense under Section 148 / 148A.
- TDS / TCS Quarterly Filings (Form 24Q, 26Q, 27Q) and Lower Deduction Certificates (Form 13).
- Appeals and Dispute Resolution before the Commissioner of Income Tax (Appeals) - CIT(A).
`.trim()
    },
    {
      id: 'prac-03-gst',
      title: 'Indirect Tax & GST Compliance Services',
      canonical_url: '/services/gst-consultant-tirupati',
      content: `
Practice Corridor PRAC-03: Indirect Tax & GST Compliance Services
Statutory Framework: Central Goods and Services Tax (CGST) Act 2017, State GST Acts, Integrated GST (IGST) Act, and CBIC Circulars.
Target Entities: Manufacturers, Wholesalers, Retailers, E-commerce Operators, and Service Providers.
Scope of Services:
- GST Registration, Amendment, and Cancellation filings.
- Monthly and Quarterly GST Returns (GSTR-1, GSTR-3B, QRMP Scheme support).
- Input Tax Credit (ITC) Reconciliation under GSTR-2B with Vendor Follow-up.
- Annual Return Filing (GSTR-9) and Reconciliation Statement (GSTR-9C).
- Handling Departmental GST Notices (ASMT-10, DRC-01) and Scrutiny Proceedings.
- First Appellate Representation before Additional Commissioner / Joint Commissioner (Appeals).
- GST Refund Processing for Exporters and Inverted Duty Structures (RFD-01).
`.trim()
    },
    {
      id: 'prac-04-corporate',
      title: 'Corporate Secretarial & Company Incorporation',
      canonical_url: '/services/company-registration-tirupati',
      content: `
Practice Corridor PRAC-04: Corporate Secretarial & Entity Registration
Statutory Framework: Companies Act 2013, Ministry of Corporate Affairs (MCA) V3 Portal regulations, LLP Act 2008.
Target Entities: Startups, Founders, Family Businesses, and Growing Enterprises.
Scope of Services:
- Private Limited Company Incorporation (SPICe+ Part A & B, RUN name reservation).
- Limited Liability Partnership (LLP) Registration (FiLLiP, Form 3 LLP Agreement).
- One Person Company (OPC) and Section 8 Non-Profit Company Incorporations.
- Drafting Articles of Association (AOA) and Memorandum of Association (MOA).
- Annual Statutory ROC Filings (AOC-4 Financials, MGT-7/7A Annual Returns).
- Director KYC (DIR-3 KYC) and Active Company Tagging (INC-22A).
- Secretarial Compliance for Director Appointments, Resignations, and Capital Alterations.
`.trim()
    },
    {
      id: 'prac-05-cfo',
      title: 'Virtual CFO & Strategic Financial Advisory',
      canonical_url: '/services/virtual-cfo-tirupati',
      content: `
Practice Corridor PRAC-05: Virtual CFO & Strategic Financial Advisory
Statutory & Professional Framework: Cost & Management Accounting principles (ICMAI), Financial Steering Standards.
Target Entities: Growing SMEs, Family Enterprises, Seed/Series Funded Startups, and Mid-Market Businesses.
Scope of Services:
- Fractional / Virtual Chief Financial Officer (CFO) Services.
- Cash Flow Forecasting, Liquidity Management, and Working Capital Optimization.
- Budgetary Control, Variance Analysis, and Management Information Systems (MIS) Reporting.
- Product Costing, Breakeven Analysis, and Gross Margin Diagnostic Audits.
- Financial Modeling, Investor Due Diligence Readiness, and Cap Table Oversight.
- Internal Financial Controls (IFC) implementation and SOP formalization.
`.trim()
    },
    {
      id: 'prac-06-rera',
      title: 'Real Estate RERA Advisory & Compliance',
      canonical_url: '/services/rera-consultant-tirupati',
      content: `
Practice Corridor PRAC-06: Real Estate RERA Advisory & Compliance
Statutory Framework: Real Estate (Regulation and Development) Act 2016 (RERA), Andhra Pradesh RERA Rules.
Target Entities: Real Estate Promoters, Property Developers, Housing Society Builders, and Commercial Developers.
Scope of Services:
- RERA Project Registration for Residential and Commercial Layouts/Apartments.
- Form 3 (Chartered Accountant Certificate) for Project Cost Estimates and Percentage Completion.
- Designated Separate Bank Account (70% RERA Escrow Account) Monitoring and Withdrawal Certifications.
- Quarterly Project Progress Reports (QPR) Upload and Compliance Filings on RERA Portal.
- Annual RERA Audit under Section 4(2)(l)(D) of the RERA Act.
- Representation in RERA Scrutiny, Defect Notice Rectification, and Extension Filings.
`.trim()
    }
  ];

  corridors.forEach(c => {
    sources.push({
      source_id: c.id,
      source_type: 'practice_corridor',
      title: c.title,
      canonical_url: c.canonical_url,
      content: c.content,
      content_hash: sha256(c.content),
      publication_status: 'published',
      approval_status: 'approved',
      visibility: 'public',
      language: 'en',
      published_at: '2026-04-01T00:00:00.000Z',
      last_indexed_at: new Date().toISOString(),
      source_version: '8.2'
    });
  });

  // =========================================================================
  // 4. Published Editorial Regulatory Insights (from content/posts/)
  // =========================================================================
  const postsDir = path.join(__dirname, '..', '..', 'content', 'posts');
  if (fs.existsSync(postsDir)) {
    const postFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
    for (const file of postFiles) {
      const fullPath = path.join(postsDir, file);
      const raw = fs.readFileSync(fullPath, 'utf8');

      // Check draft flag in frontmatter
      const isDraft = /draft:\s*true/i.test(raw);
      if (isDraft) {
        // STRICTLY EXCLUDED: Never ingest draft articles!
        continue;
      }

      // Extract metadata from frontmatter
      const titleMatch = raw.match(/title:\s*["']?([^"\n\r]+)["']?/i);
      const title = titleMatch ? titleMatch[1].trim() : file.replace('.md', '');
      const slug = file.replace('.md', '');
      const url = `/blog/${slug}`;

      // Clean body text (strip frontmatter)
      let body = raw.replace(/^---[\s\S]*?---/, '').trim();
      // Remove excess markdown formatting for clean indexing
      body = body.replace(/!\[.*?\]\(.*?\)/g, ''); // strip images

      sources.push({
        source_id: `post-${slug}`,
        source_type: 'blog_post',
        title: title,
        canonical_url: url,
        content: `Title: ${title}\nURL: ${url}\n\n${body}`,
        content_hash: sha256(body),
        publication_status: 'published',
        approval_status: 'approved',
        visibility: 'public',
        language: 'en',
        published_at: '2026-04-01T00:00:00.000Z',
        last_indexed_at: new Date().toISOString(),
        source_version: '8.2'
      });
    }
  }

  // =========================================================================
  // 5. Published Insights & Articles Directory
  // =========================================================================
  const insightsDirectoryContent = `
Published Regulatory Insights & Blog Directory:
Kavitha & Associates regularly publishes technical guidance, statutory analysis, and editorial insights for corporate leaders, founders, and practitioners.
All published articles and insights can be read at the canonical directory /blog.
Key published technical insights include:
- Corporate Tax Planning and Assessment Strategies under the Income Tax Act 1961.
- GST Annual Return and Reconciliation Statement: Comprehensive Technical Guide for Form GSTR-9 and Form GSTR-9C.
- Statutory Audit Guidelines under the Companies Act 2013: Auditor Obligations and Internal Financial Controls (IFC).
Visitors can browse all published insights and regulatory analysis online at /blog.
`.trim();

  sources.push({
    source_id: 'published-insights-directory',
    source_type: 'blog_post',
    title: 'Published Regulatory Insights & Blog Directory',
    canonical_url: '/blog',
    content: insightsDirectoryContent,
    content_hash: sha256(insightsDirectoryContent),
    publication_status: 'published',
    approval_status: 'approved',
    visibility: 'public',
    language: 'en',
    published_at: '2026-04-01T00:00:00.000Z',
    last_indexed_at: new Date().toISOString(),
    source_version: '8.2'
  });

  // =========================================================================
  // 6. Practice Methodology & Ethical Approach
  // =========================================================================
  const methodologyContent = `
Engagement Methodology & Ethical Practice Approach:
- Core Operating Philosophy: Accuracy before Speed, Evidence before Opinion, Discipline before Convenience.
- Four-Stage Engagement Process:
  1. Diagnostic Intake & Jurisdictional Assessment: Confidential fact-finding and statutory scoping.
  2. Document Verification & Reconciliations: Multi-point verification of trial balances, statutory returns, and vouchers.
  3. Partner-Led Execution & Review: Direct oversight by CA Kavitha Vijay on all compliance and audit deliverables.
  4. Client Advisory & Ongoing Steering: Transparent reporting, clear actionables, and statutory deadline tracking.
- Ethical Standards: The firm adheres strictly to the ICAI Code of Ethics (13th Edition, 2026). The firm practices zero tolerance for compliance ambiguity and does not provide fraudulent tax evasion schemes or speculative filings.
`.trim();

  sources.push({
    source_id: 'firm-methodology',
    source_type: 'methodology',
    title: 'Engagement Methodology & Ethical Philosophy',
    canonical_url: '/about',
    content: methodologyContent,
    content_hash: sha256(methodologyContent),
    publication_status: 'published',
    approval_status: 'approved',
    visibility: 'public',
    language: 'en',
    published_at: '2026-04-01T00:00:00.000Z',
    last_indexed_at: new Date().toISOString(),
    source_version: '8.2'
  });

  return sources;
}

module.exports = {
  getApprovedKnowledgeSources,
  sha256
};
