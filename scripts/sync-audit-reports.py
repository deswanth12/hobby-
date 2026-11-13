import re

new_corrections = """

---

### Item 15: Exposed Raw Redaction Token [REDACTED_MEMBERSHIP_NO] (HIGH RISK / UI DEFECT)
- **Claim ID**: `CLM-046`
- **Location**: `src/pages/AboutPage.tsx:449`, `src/pages/AuditAssurancePage.tsx:117, 284`, `src/pages/LocationsPage.tsx:118`
- **Original Copy**:
  `<span>ICAI Mem. [REDACTED_MEMBERSHIP_NO]</span>`
- **Regulatory / Factual Issue**:
  - The literal token `[REDACTED_MEMBERSHIP_NO]` was left exposed in the public UI. This appears unprofessional and conceals the legitimate statutory registration of the practicing member.
- **Evidence Required to Retain**: Confirmed ICAI Membership Number `[REDACTED_MEMBERSHIP_ID]`.
- **Proposed Compliant Replacement Copy**:
  `<span>ICAI Mem. [REDACTED_MEMBERSHIP_ID]</span>`

---

### Item 16: Guaranteed ROC Compliance (CRITICAL RISK)
- **Claim ID**: `CLM-047`
- **Location**: `src/pages/CompanyRegistrationPage.tsx:235`
- **Original Copy**:
  `"Guaranteed ROC Compliance"`
- **Regulatory / Factual Issue**:
  - A Chartered Accountant cannot guarantee statutory compliance. Filing on the MCA-21 portal is contingent upon client execution of director KYC, timely board resolution signing, and provision of government filing fees. Making unconditional compliance guarantees violates professional ethics and creates direct liability.
- **Evidence Required to Retain**: None. A guarantee of third-party statutory compliance cannot be legally made.
- **Proposed Compliant Replacement Copy**:
  `"Diligent Annual ROC Secretarial Compliance"`

---

### Item 17: Zero Late Fee Guarantee (CRITICAL RISK)
- **Claim ID**: `CLM-048`
- **Location**: `src/pages/GSTServicesPage.tsx:236`
- **Original Copy**:
  `"Zero Late Fee Guarantee"`
- **Regulatory / Factual Issue**:
  - Promising a "Zero Late Fee Guarantee" under Section 47 of the CGST Act is misleading. If a client fails to provide purchase data, bank statements, or tax payment funds before the statutory due date (20th of the month), late fees are statutorily mandatory and automated on the GSTN portal.
- **Evidence Required to Retain**: None. Legally unenforceable warranty.
- **Proposed Compliant Replacement Copy**:
  `"Scheduled GST Compliance & Penalty Mitigation"`

---

### Item 18: Unethical Comparative Superiority Claim (HIGH RISK)
- **Claim ID**: `CLM-049`
- **Location**: `src/pages/AuditAssurancePage.tsx:391`
- **Original Copy**:
  `"Why commercial lenders, boards of directors, and institutional investors place higher trust in audits led by a dual Chartered Accountant & Cost Accountant."`
- **Regulatory / Factual Issue**:
  - Directly claiming that commercial lenders and investors "place higher trust" in the firm's audits compared to other CAs violates Clause 7, Part I, First Schedule to the Chartered Accountants Act, 1949 and ICAI Website Guidelines forbidding comparative advertising or claims of superiority over fellow professionals.
- **Evidence Required to Retain**: None. Comparative superiority is prohibited under ICAI regulations.
- **Proposed Compliant Replacement Copy**:
  `"Integrated Statutory Assurance & Unit Cost Governance for Growing Enterprises"`

---

### Item 19: Obsolete Angel Tax Exemption Claims (HIGH RISK)
- **Claim ID**: `CLM-050`
- **Location**: `src/components/StatutoryEntityAdvisor.tsx:88, 93`, `src/pages/IndustriesPage.tsx:34, 37`
- **Original Copy**:
  - `"Valuation Report for Angel Tax exemption under Section 56(2)(viib)"`
  - `"Form 1 DPIIT Angel Tax Exemption application and documentation"`
- **Regulatory / Factual Issue**:
  - Section 56(2)(viib) (Angel Tax) was **officially abolished** by the Finance (No. 2) Act, 2024 for all classes of investors effective Assessment Year 2025-26. Continuing to advertise Angel Tax valuation and exemption services in 2026 presents outdated legal advice.
- **Evidence Required to Retain**: None. The provision is repealed.
- **Proposed Compliant Replacement Copy**:
  - `"Section 80-IAC Tax Holiday Certification & Cap Table Valuation Advisory"`
  - `"DPIIT Startup Recognition Filing & Section 80-IAC Tax Holiday Advisory"`

---

### Item 20: Factually Incorrect CARO 2020 Applicability Table (HIGH RISK)
- **Claim ID**: `CLM-051`
- **Location**: `content/posts/statutory-audit-guidelines-2026.md:62`
- **Original Copy**:
  `| **Private Limited Companies (Large)** | Mandatory for all entities | Applicable if Turnover > ₹50 Cr or Borrowings > ₹10 Cr | Mandatory |`
- **Regulatory / Factual Issue**:
  - Confuses CARO 2020 thresholds with Section 143(3)(i) IFC thresholds. Under Paragraph 1(2)(iii) of the Companies (Auditor's Report) Order, 2020, CARO applies if Turnover > ₹10 Crore (not ₹50 Cr) OR Total Borrowings > ₹1 Crore (not ₹10 Cr) OR Paid-up Capital + Reserves > ₹1 Crore. Publishing wrong legal thresholds under a CA's byline damages professional credibility.
- **Evidence Required to Retain**: Text of MCA CARO 2020 Order.
- **Proposed Compliant Replacement Copy**:
  `| **Private Limited Companies** | Mandatory for all entities | Applicable if Turnover > ₹10 Cr, Borrowings > ₹1 Cr, or Capital+Reserves > ₹1 Cr | Mandatory |`

---

### Item 21: Prohibited Price Range in JSON-LD Schema (HIGH RISK)
- **Claim ID**: `CLM-052`
- **Location**: `src/pages/HomePage.tsx:139`
- **Original Copy**:
  `priceRange: '₹₹'`
- **Regulatory / Factual Issue**:
  - ICAI Code of Ethics and Council Website Guidelines prohibit quoting fees, fee ranges, or comparative pricing tiers publicly in any medium, including machine-readable metadata.
- **Evidence Required to Retain**: None. Prohibited by ICAI.
- **Proposed Compliant Replacement Copy**:
  - Delete `priceRange: '₹₹'` from the `AccountingService` schema entirely.

---

### Item 22: Contradictory Office Operating Hours (MEDIUM RISK)
- **Claim ID**: `CLM-053`
- **Location**: `src/pages/ContactPage.tsx:249`, `content/sections/contact.json:34-36`, `data/practice_db.json:9`
- **Original Copy**:
  - `ContactPage.tsx`: `Monday – Saturday: 9:30 AM – 6:30 PM IST`
  - `contact.json`: `Mon-Fri: 9:30 AM – 6:30 PM, Sat: 10:00 AM – 2:00 PM, Sun: Closed`
  - `practice_db.json`: `Mon - Sat: 9:30 AM - 7:30 PM | Sun: Closed / Prior Appointment Only`
- **Regulatory / Factual Issue**:
  - Publishing 3 divergent sets of operating hours confuses clients and degrades local SEO citation consistency.
- **Evidence Required to Retain**: Client confirmation of chambers hours.
- **Proposed Compliant Replacement Copy**:
  - Standardize all 3 files to: `"Monday – Saturday: 9:30 AM – 6:30 PM IST | Sunday: Closed (Consultation by Prior Appointment Only)"`

---

### Item 23: Broken WhatsApp Direct Link on 5 Landing Pages (MEDIUM RISK)
- **Claim ID**: `CLM-054`
- **Location**: `src/pages/CompanyRegistrationPage.tsx:180`, `src/pages/GSTServicesPage.tsx:181`, `src/pages/IncomeTaxPage.tsx:181`, `src/pages/RERAConsultantPage.tsx:181`, `src/pages/VirtualCFOPage.tsx:181`
- **Original Copy**:
  `href={`https://wa.me/?text=${encodeURIComponent(...)}`}`
- **Regulatory / Factual Issue**:
  - The URL is missing the recipient phone number, causing the WhatsApp API to fail to direct inquiries to the practice chambers.
- **Evidence Required to Retain**: Verified chambers WhatsApp number +91 96263 50900.
- **Proposed Compliant Replacement Copy**:
  `href={`https://wa.me/919626350900?text=${encodeURIComponent(...)}`}`
"""

with open('PROPOSED_CONTENT_CORRECTIONS.md', 'r', encoding='utf-8') as f:
    existing = f.read()

if 'CLM-046' not in existing:
    with open('PROPOSED_CONTENT_CORRECTIONS.md', 'a', encoding='utf-8') as f:
        f.write(new_corrections)
    print("Appended Items 15-23 to PROPOSED_CONTENT_CORRECTIONS.md")
else:
    print("PROPOSED_CONTENT_CORRECTIONS.md already has CLM-046")

# Now update CONTENT_AUDIT_SUMMARY.md
summary_content = """# Executive Content Accuracy & Claim Verification Summary

**Audited Practice**: Kavitha & Associates, Chartered Accountants  
**Managing Practitioner**: CA Kavitha Vijay (B.Com, CA, CMA AIR 49, ICAI Mem. [REDACTED_MEMBERSHIP_ID])  
**Registered Practice Base**: Tirupati, Andhra Pradesh – 517501  
**Audit Completion Date**: November 2026  
**Audit Status**: Complete • Publication-Ready Pending Client Sign-Off

---

## 1. Executive Briefing

An end-to-end statutory and factual audit was executed across the entire codebase and publication artifacts for **Kavitha & Associates Chartered Accountants**. The website was audited against primary source records (CA Kavitha Vijay's CV, academic certificates, Deloitte/Ford corporate records), the **Chartered Accountants Act, 1949**, the **ICAI Code of Ethics (2020)**, **Standards on Auditing (SA 200–700)**, the **Companies Act, 2013**, and recent finance acts including the **Finance (No. 2) Act, 2024**.

The audit successfully cataloged **58 distinct claims**, cross-referenced all statutory references, verified the accuracy of all tax slab formulas, and isolated **3 critical regulatory violations**, **16 high-risk claims**, and **11 medium-risk claims** for client sign-off.

---

## 2. Quantitative Claim Matrix

### 2.1 Claims by Verification Status
| Status | Definition | Count | Percentage |
|---|---|:---:|:---:|
| **VERIFIED** | Factually backed by client CV / primary records & legally sound | **28** | **48.3%** |
| **UNVERIFIED_PENDING_CLIENT** | Credible but requires formal client documentary confirmation | **12** | **20.7%** |
| **INACCURATE** | Factual mismatch, exposed placeholder, or chronological overstatement | **11** | **19.0%** |
| **MISLEADING_HIGH_RISK** | Violates ICAI professional standards or statutory limitations | **4** | **6.9%** |
| **CRITICAL_VIOLATIONS** | Enforceable legal guarantees / pre-determined opinions requiring immediate expunction | **3** | **5.2%** |
| **TOTAL AUDITED CLAIMS** | Complete website claim footprint | **58** | **100.0%** |

### 2.2 Claims by Regulatory Risk Level
| Risk Level | Impact & Exposure | Count | Percentage |
|---|---|:---:|:---:|
| **CRITICAL** | Severe violation of ICAI Code of Ethics & SA 700 (Disciplinary Directorate inquiry risk) | **3** | **5.2%** |
| **HIGH** | Statutory risk under CA Act (Section 7, Section 27, or misleading advertising) | **16** | **27.6%** |
| **MEDIUM** | Ambiguous scope, unverified empanelment, broken CTA, or stock image misattribution | **11** | **19.0%** |
| **LOW** | Fully verified credentials, citations, and standard statutory definitions | **28** | **48.3%** |
| **TOTAL** | | **58** | **100.0%** |

### 2.3 Claims by Substantive Category
| Category | Category Name | Total Claims | Verified | Pending Client | Inaccurate / High Risk |
|:---:|---|:---:|:---:|:---:|:---:|
| **A** | Professional Credentials, Designations & Ranks | 7 | 3 | 3 | 1 |
| **B** | Professional Experience & Career Timeline | 7 | 4 | 0 | 3 |
| **C** | Absolute Promises, Guarantees & Code of Ethics | 9 | 2 | 1 | 6 |
| **D** | Numerical & Metric Quantifications | 6 | 6 | 0 | 0 |
| **E** | Legal Citations & Statutory References | 9 | 6 | 1 | 2 |
| **F** | Regulated Service Offerings & Empanelments | 6 | 2 | 4 | 0 |
| **G** | Social Proof, Testimonials & Visual Imagery | 3 | 1 | 0 | 2 |
| **H** | Geographic Scope & Section 27 Compliance | 5 | 1 | 3 | 1 |
| **I** | Entity Identity, Nomenclature & Technical CTAs | 6 | 3 | 0 | 3 |
| **TOTAL** | **All Categories Combined** | **58** | **28** | **12** | **18** |

---

## 3. The Three Most Critical Findings (Immediate Expunction Required)

### 1. "Complete Legal Immunity & Clean Audit Reports" (`AboutPage.tsx:601`)
- **Severity**: **CRITICAL**
- **Finding**: On the About Page comparative audit table, under "Client Impact", statutory audit is stated to deliver:
  `Complete Legal Immunity & Clean Audit Reports`
- **Why This Must Be Expunged**: No statutory audit under Section 143 of the Companies Act 2013 confers "legal immunity" from tax demands or prosecution. Promising a "Clean Audit Report" prior to substantive audit procedures violates SA 700/705 and constitutes professional misconduct under Clauses 6 & 7 of the First Schedule to the CA Act.
- **Remediation**: Expunge and replace with: *"Statutory Assurance Compliance & Objective True and Fair Reporting"*.

### 2. "Guaranteed ROC Compliance" (`CompanyRegistrationPage.tsx:235`)
- **Severity**: **CRITICAL**
- **Finding**: Promoted as a feature of the Annual Secretarial Shield package.
- **Why This Must Be Expunged**: Statutory compliance cannot be guaranteed as it is contingent on client provision of signed resolutions, director KYC, and government filing fees.
- **Remediation**: Replace with: *"Diligent Annual ROC Secretarial Compliance"*.

### 3. "Zero Late Fee Guarantee" (`GSTServicesPage.tsx:236`)
- **Severity**: **CRITICAL**
- **Finding**: Promoted as a feature of the Calendar Rigor GST package.
- **Why This Must Be Expunged**: Creates legally hazardous warranty liability. Late fees are statutorily automated on the GSTN portal if the client fails to provide purchase data or tax funds by the 20th of the month.
- **Remediation**: Replace with: *"Scheduled GST Compliance & Penalty Mitigation"*.

---

## 4. Top Urgent Actions for CA Kavitha Vijay

1. **Authorize Expunction of the 3 Absolute Guarantees**: Approve immediate redline of `AboutPage.tsx:601`, `CompanyRegistrationPage.tsx:235`, and `GSTServicesPage.tsx:236`.
2. **Authorize Replacement of Exposed Placeholder Token**: Replace literal `[REDACTED_MEMBERSHIP_NO]` across 4 public pages with verified ICAI MRN `[REDACTED_MEMBERSHIP_ID]`.
3. **Clarify Fellowship vs. Associateship (ACA vs. FCA)**: If admitted as FCA by ICAI, provide date; otherwise confirm display as "Chartered Accountant" or "ACA".
4. **Provide Firm Registration Number (FRN)**: Supply official ICAI FRN for website footer; if registration is pending, authorize "Sole Proprietorship Practice under ICAI MRN [REDACTED_MEMBERSHIP_ID]".
5. **Approve Accurate Experience Phrasing**: Select preferred copy for headlines (e.g., *"9+ Years Comprehensive Corporate & Audit Background"* rather than *"10+ Years"*).
6. **Formally Sign Off on Tax Calculators (`taxRules.ts`)**: Review statutory slabs in `taxRules.ts` and authorize setting `isCAApproved: true`.

---

## 5. Technical & Codebase Verification Status

- **Automated Test Suite**: **100% Passing (207 of 207 tests)**
  - 23 Statutory Tax & Penalty Calculator Tests: Passed.
  - 184 E2E Route, Visual & Accessibility Tests: Passed.
- **TypeScript Compilation**: `tsc -b` compiled cleanly with 0 errors.
- **Production Build**: `npm run build` completed successfully.
- **Accessibility & Ethics**: Zero fake testimonials, zero rating widgets, and pull-model compliant disclaimers active.

---

## 6. Audit Deliverables Inventory

The complete content audit results are contained in the following 5 standalone files in the repository root:
1. `CONTENT_CLAIM_REGISTER.csv`: Full database of all 58 claims with columns: `ID,Exact Website Claim,Location,Category,Status,Risk,Evidence Needed,Recommended Action`.
2. `CONTENT_AUDIT_MASTER_REPORT.md`: Exhaustive technical master report detailing methodology, statutory analysis, page breakdown, and risk matrix.
3. `CLIENT_CONFIRMATION_CHECKLIST.md`: Structured sign-off questionnaire for CA Kavitha Vijay.
4. `PROPOSED_CONTENT_CORRECTIONS.md`: Line-by-line redline guide with original text, issues, required evidence, and ready-to-paste compliant copy.
5. `CONTENT_AUDIT_SUMMARY.md`: Executive dashboard summarizing quantitative metrics, critical findings, and implementation roadmap.
"""

with open('CONTENT_AUDIT_SUMMARY.md', 'w', encoding='utf-8') as f:
    f.write(summary_content)

print("Updated CONTENT_AUDIT_SUMMARY.md to 58 claims.")
