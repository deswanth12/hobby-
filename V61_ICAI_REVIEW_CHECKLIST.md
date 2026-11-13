# V6.1 ICAI Ethical Guidelines & Regulatory Review Checklist
## Kavitha & Associates Chartered Accountants
**Regulatory Framework:** Chartered Accountants Act, 1949 & ICAI Code of Ethics (Revised 13th Edition, applicable from 1 April 2026)  
**Document Classification:** Evidence-Based Professional Review & Compliance Audit  
**Date of Audit:** November 4, 2026  
**Status:** Pre-Release Review for Practicing Chartered Accountant Verification  

---

## 1. Regulatory Context & Legal Disclaimers

### 1.1 Non-Legal Disclaimer & Purpose
> [!IMPORTANT]
> This review is an internal technical and content audit conducted from an engineering and compliance-readiness perspective. It does **not** constitute a formal legal opinion, statutory certification, or regulatory sign-off. Under the Chartered Accountants Act, 1949 and regulations framed thereunder, all public disclosures, marketing, representations, and firm communications remain the sole legal and ethical responsibility of the practicing member and Managing Partner (**CA Kavitha Vijay**).

### 1.2 Applicable Regulatory Statutes
This audit evaluates the public website (`https://kavithaassociates.com`) against:
1. **The Chartered Accountants Act, 1949 (Act No. XXXVIII of 1949):**
   - Section 7: Use of the name "Chartered Accountant" and prohibition of unauthorized designations.
   - First Schedule, Part I, Clause (6): Prohibition against soliciting professional work or clients directly or indirectly.
   - First Schedule, Part I, Clause (7): Prohibition against advertising professional attainments or services, except as permitted by Council Guidelines.
2. **ICAI Code of Ethics (13th Edition, Revised Volume II — Effective 1 April 2026):**
   - Section 200 & Part 2: Council Guidelines on Website Publication by Members in Practice.
   - Council Guidelines for Advertisement / Pull Model Communication.
   - Guidelines on the Use of the Official CA Logo.
   - Guidelines on Firm Names, Stationery, Visiting Cards, and Electronic Communication.

---

## 2. Executive Summary: Compliance Status Overview

| Regulatory Dimension | Requirement Code | Observed Website Status | Conformance Finding | Action Required Prior to Live Release |
| :--- | :--- | :--- | :--- | :--- |
| **Pull vs. Push Model** | First Sched., Cl. (6) | Purely informative; zero unsolicited push notifications, zero pop-up ad banners. | **Compliant** | Maintain pull architecture. |
| **Non-Solicitation Notice** | Council Guidelines | Prominently displayed in website footer and contact submission workflow. | **Compliant** | None. Notice is permanently affixed. |
| **Client Testimonials / Logos**| Council Guidelines | Zero client logos, zero client names, zero commercial reviews or star ratings. | **Compliant** | Strict policy: continue prohibiting client logos. |
| **Fee Quotation on Website** | Council Guidelines | Zero public fee schedules, zero automated pricing calculators, zero cost comparisons. | **Compliant** | None. Fees remain private on inquiry. |
| **CA India Logo Usage** | Council Guidelines | Official CA logo displayed in Navbar header without distortion or modification. | **Compliant** | Verify exact pixel dimensions against ICAI guidelines. |
| **Partner Qualifications** | Sec. 7 / Cl. (7) | "B.Com, CA, CMA" stated accurately. "AIR 49" displayed. | **Requires Qualification** | Clarify "AIR 49" as CMA Intermediate (ICMAI). |
| **Past Corporate Experience** | Cl. (7) | Factual references to Deloitte Haskins & Sells and Ford Motor Company. | **Requires CA Verification** | Ensure employer awards are designated as corporate. |
| **Practice Area Descriptions** | Cl. (7) | Factual descriptions of Audit, Taxation, Corporate Law, and Advisory services. | **Compliant** | Superlative terms ("Best", "Top", "Guaranteed") absent. |
| **Statutory Identifiers** | Council Guidelines | Placeholders present: `[REDACTED_MEMBERSHIP_NO]` & `[REDACTED_FRN]`. | **Pending Partner Input** | Insert verified ICAI Membership No. and FRN. |

---

## 3. Detailed Audit by Clause & Guideline

### 3.1 Website Architectural Model: "Pull" vs. "Push"
* **Statutory Requirement:** Under Council Guidelines issued under Clause (6) of Part I of the First Schedule, a website operated by a Chartered Accountant in practice must operate strictly on a **"Pull" model**. It must not be designed to push information onto unsuspecting visitors or use automated unsolicited communication.
* **Code Review & Evidence:**
  - `src/components/Footer.tsx` (Lines 225–233):
    ```tsx
    {/* Verbatim Regulatory & ICAI Compliance Disclaimer */}
    <div className="pt-8 pb-4 text-xs text-emerald-200/80 border-b border-brand-forest/50 leading-relaxed scroll-reveal">
      <div className="flex items-start gap-2.5 max-w-4xl">
        <ShieldCheck className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
        <p>
          <strong className="text-emerald-100">ICAI Compliance Notice:</strong> As per the code of ethics and guidelines issued by the Institute of Chartered Accountants of India (ICAI), this website is intended solely for providing basic information about the firm, its practice areas, and public contact information. It is not intended to advertise or solicit work in any form or manner.
        </p>
      </div>
    </div>
    ```
  - `src/components/ContactForm.tsx` (Lines 472–476):
    ```tsx
    <strong className="text-[#153F32]">Direct Communication Notice:</strong> Submitting this form formats your consultation inquiry so you can review and send it directly to CA Kavitha Vijay via WhatsApp or telephone. We do not solicit or store PAN, Aadhaar numbers, or financial files through this website.
    ```
  - **Audit Finding:** The website is accessible only upon direct visitor request (browser navigation). There are zero automated marketing chat popups, zero forced contact capture modals, and zero cookie-tracking remarketing pixels. **Status: COMPLIANT**.

---

### 3.2 Prohibition of Direct or Indirect Solicitation (Clause 6)
* **Statutory Requirement:** No member in practice may solicit clients or professional work by advertisement, circular, personal communication, or any other means.
* **Review Findings:**
  1. **Absence of Superlatives:** A full-repository search across all TypeScript (`.ts`, `.tsx`) source files revealed **zero instances** of prohibited marketing claims such as:
     - *"Best CA firm in Chennai"*
     - *"Leading tax consultant"*
     - *"Guaranteed minimum tax liability"*
     - *"Unmatched audit quality"*
  2. **Educational & Interactive Knowledge Tools:**
     - The interactive computational tools (`GSTCalculator.tsx`, `IncomeTaxCalculator.tsx`, `TaxAuditChecker.tsx`) contain prominent statutory disclaimers stating:
       ```
       "STATUTORY NOTICE & ETHICAL DECLARATION: This calculator is an illustrative computational tool for preliminary assessment. In accordance with the Chartered Accountants Act, 1949 and ICAI ethical guidelines, calculations do not constitute formal legal opinion or tax audit advice. Please consult CA Kavitha Vijay with verified financial statements for statutory filings."
       ```
     - Calculations run client-side in browser memory without storing or harvesting user financial figures. **Status: COMPLIANT**.

---

### 3.3 Representation of Professional Attainments & Honors (Clause 7)
* **Statutory Requirement:** Under Clause (7), a member must not advertise professional attainments or use designations other than "Chartered Accountant" on professional documents or websites, except degrees of a recognized university or titles recognized by the Council.
* **Review Findings & Actionable Discrepancies:**

#### Finding 1: Examination Rank ("AIR 49")
* **Code Location:** `src/components/AboutSection.tsx` (Line 120) & `src/data/firmData.ts` (Line 150)
* **Current Display:**
  - In `AboutSection.tsx`, a badge next to "ICAI Practice Lead" displays: `AIR 49`.
  - In `firmData.ts`, the full title is: `"The Institute of Cost Accountants of India (ICMAI) — All India Rank 49 in CMA Intermediate"`.
* **Risk Assessment:** A visitor viewing the badge `AIR 49` positioned directly beneath `ICAI Practice Lead` could inadvertently infer that the All India Rank was secured in the ICAI CA Final or Intermediate examination, rather than the ICMAI CMA Intermediate examination.
* **Remediation Recommendation:** Update the badge text in `AboutSection.tsx` to read: `CMA AIR 49 (ICMAI)` or ensure the accompanying text explicitly qualifies the rank:
  ```tsx
  {/* Recommended clarification */}
  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#0D2820] text-[#D4AF37] border border-[#C3A66B]/30" title="All India Rank 49 in CMA Intermediate (ICMAI)">
    CMA AIR 49
  </span>
  ```

#### Finding 2: Corporate Employer Recognition Awards
* **Code Location:** `src/data/firmData.ts` (Lines 164–180)
* **Current Text:** Lists awards from corporate tenure:
  - *"Move the Dot — Individual Excellence Award, Deloitte Haskins & Sells"*
  - *"Live the Dot — Team Achievement Award, Deloitte Haskins & Sells"*
* **Risk Assessment:** ICAI Council Guidelines permit factual statements of biographical history and career experience. However, internal corporate awards must not be presented as statutory professional honours or certifications awarded by the ICAI Council.
* **Remediation Recommendation:** Ensure these accolades are explicitly headed as *"Past Corporate Employment Recognition (Deloitte Haskins & Sells)"* to maintain absolute transparency.

---

### 3.4 Client Testimonials, Client Lists, and Case Studies
* **Statutory Requirement:** Council Guidelines strictly prohibit publishing names of clients, client logos, or client testimonials on a firm's public website without specific regulatory exemption.
* **Review Findings:**
  - **Client Logos:** Checked `src/components/` and `public/images/`. Zero client corporate logos are stored or rendered.
  - **Testimonials:** Zero client quotes, star reviews, or customer success stories are present.
  - **Case Studies:** All scenario examples in `KnowledgeBankPage.tsx` and `ServicesSection.tsx` are generic, anonymized industry illustrations (e.g., "Manufacturing Company under Section 44AB", "Private Limited Company Annual Return"). No specific enterprise or individual client is identified. **Status: COMPLIANT**.

---

### 3.5 Use of the Official CA India Logo
* **Statutory Requirement:** The CA logo with the emerald green tick and blue lettermark is the registered intellectual property of the ICAI. Members in practice are permitted to display the logo provided:
  1. It is reproduced in exact proportion without distortion or modification.
  2. It is not combined with personal symbols or commercial graphics.
  3. The word "Chartered Accountants" is displayed alongside.
* **Review Findings:**
  - `src/components/Navbar.tsx` (Lines 185–190):
    ```tsx
    <img
      src="/images/ca-logo.svg"
      alt="Official CA India Logo - Chartered Accountants"
      width="48"
      height="48"
      className="h-10 w-10 sm:h-11 sm:w-11 object-contain shrink-0"
    />
    ```
  - The SVG is the official vector provided by ICAI with standard color values. **Status: COMPLIANT**.

---

### 3.6 Statutory Membership & Firm Registration Identifiers
* **Statutory Requirement:** Council Guidelines recommend that a firm website clearly state the Firm Registration Number (FRN) and the Membership Number of the practicing proprietor/partners to enable public verification on the ICAI official portal (`icai.org`).
* **Review Findings:**
  - In `src/components/Footer.tsx` (Line 50):
    ```tsx
    <p className="text-xs text-emerald-300/80">ICAI Mem. [REDACTED_MEMBERSHIP_NO] • Chartered &amp; Cost Accountant</p>
    ```
  - In `src/data/firmData.ts` (Lines 180–185):
    - `membershipNo: "[REDACTED_MEMBERSHIP_NO]"`
    - `firmRegistrationNo: "[REDACTED_FRN]"`
* **Action Required:** Prior to final production launch on the public domain, CA Kavitha Vijay must supply the official 6-digit ICAI Membership Number and Firm Registration Number (FRN) to replace the redaction placeholders.

---

## 4. Pre-Publication CA Verification Checklist

The following 10 verification items must be reviewed and signed off by **CA Kavitha Vijay** prior to live public deployment:

```markdown
[ ] 1. ICAI Membership Number: Verify the exact 6-digit number to replace [REDACTED_MEMBERSHIP_NO].
[ ] 2. Firm Registration Number (FRN): Verify the 6-digit/7-digit FRN to replace [REDACTED_FRN].
[ ] 3. Examination Rank Clarification: Confirm that "AIR 49" is explicitly attributed to ICMAI CMA Intermediate in all UI badges.
[ ] 4. Employment History Wording: Approve the factual description of progressive experience at Deloitte Haskins & Sells and Ford Motor Company.
[ ] 5. Service Offerings Scope: Verify that all listed service verticals (Statutory Audit, Tax Audit, GST, Cross-Border Advisory, Company Secretarial) reflect the firm's actual active competencies.
[ ] 6. Non-Solicitation Disclaimer: Review the prominent disclaimer in Footer.tsx and confirm alignment with ICAI Code of Ethics (13th Edition).
[ ] 7. Absence of Fee Indications: Confirm that no public page hints at fee scales, discounts, or minimum costs.
[ ] 8. Anonymized Knowledge Articles: Verify that all published guides, FAQs, and articles in the Knowledge Bank contain general legal explanations without reference to specific client files.
[ ] 9. Contact / Consultation Routing: Verify that inquiry submissions route directly to the partner's designated business WhatsApp and email without intermediate third-party brokers.
[ ] 10. Pull Model Maintenance: Confirm that no automated remarketing, unsolicited email captures, or aggressive call triggers are enabled on the production server.
```

---

## 5. Summary Conclusion

The V6.0 implementation demonstrates high fidelity to the ethical spirit of the ICAI regulatory framework:
- Zero aggressive commercialization, superlatives, or fee bidding.
- Zero client logos, ratings, or solicited testimonials.
- Clear, unequivocal disclaimers on all computational tools and page footers.
- Strict adherence to the "Pull" model of information dissemination.

**Final Recommendation:** Once CA Kavitha Vijay provides the verified statutory numbers (FRN & Membership No.) and approves the minor badge qualification for CMA Intermediate AIR 49, the website will be fully aligned with the requirements of the ICAI Code of Ethics (13th Edition, 2026).
