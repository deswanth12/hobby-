# Project V5.0 Functional & Regulatory Regression Report
**Firm:** Kavitha & Associates Chartered Accountants (Tirupati, Andhra Pradesh)  
**Execution Date:** November 3, 2026  
**E2E Test Suite Status:** 187 / 187 PASSED (100% Success)  
**Tax & Statutory Suite Status:** 23 / 23 PASSED (100% Success)  
**Regulatory Compliance Status:** 100% ICAI Guidelines Conforming  

---

## 1. Executive Summary

A zero-regression policy was strictly enforced during the implementation of Project V5.0. While the visual aesthetic, layout architecture, and motion mechanics of the website were comprehensively modernized to CARVI Associates standards, all existing test suites, functional endpoints, administrative authentication mechanisms, and strict client boundaries established in previous versions (V4.5, V4.7, V4.8) were preserved without regression.

---

## 2. Test Execution Record

### Part A: Statutory Audit & Tax Verification Suite
Executed via `node tests/tax-calculators.test.mjs`:
- **Suite 1: Section 87A Old Regime Across Age Categories (4/4 tests passed)**
  - TC1.1: General Assessee (<60 yrs) gets ₹12,500 rebate under Sec 87A (Net Tax ₹0) — PASS
  - TC1.2: Senior Citizen (60-79 yrs) gets ₹10,000 rebate under Sec 87A (Net Tax ₹0) — PASS
  - TC1.3: Super Senior Citizen (80+ yrs) has zero tax via ₹5,00,000 basic exemption — PASS
  - TC1.4: Senior Citizen boundary at ₹5,10,000 gets ZERO Sec 87A rebate — PASS
- **Suite 2: FY 2026-27 Provisional Designation (2/2 tests passed)**
  - TC2.1: FY 2026-27 explicitly flagged as provisional — PASS
  - TC2.2: FY 2025-26 & FY 2024-25 verified as enacted statutes — PASS
- **Suite 3: Enacted Direct Tax Slabs & Section 87A Rebates (5/5 tests passed)**
  - TC3.1: FY 2025-26 basic exemption ₹4,00,000 under New Regime — PASS
  - TC3.2: FY 2025-26 salaried ₹12,75,000 pays zero tax — PASS
  - TC3.3: FY 2025-26 marginal relief under Sec 87A for ₹12,10,000 — PASS
  - TC3.4: FY 2024-25 salaried ₹7,75,000 pays zero tax — PASS
  - TC3.5: FY 2024-25 marginal relief under Sec 87A for ₹7,10,000 — PASS
- **Suite 4: GSTR-9 State Turnover Input & Section 47(2) Cap (4/4 tests passed)**
  - TC4.1: Missing State turnover flags error (no silent default) — PASS
  - TC4.2: Zero or negative turnover flags error — PASS
  - TC4.3: State turnover ₹50 Lakhs correctly capped at 0.04% (₹2,000) — PASS
  - TC4.4: State turnover ₹10 Cr applies ₹100/day capped at 0.04% — PASS
- **Suite 5: Return-Specific GST Rules (4/4 tests passed)**
  - TC5.1: GSTR-3B Monthly on-time filing zero penalty — PASS
  - TC5.2: GSTR-3B Section 50 interest at 18% p.a. on cash liability — PASS
  - TC5.3: GSTR-1 Monthly Section 50 interest strictly ₹0 — PASS
  - TC5.4: GSTR-1 QRMP Section 50 interest strictly ₹0 — PASS
- **Suite 6: Section 44AB Clauses & Statutory Due Dates (4/4 tests passed)**
  - TC6.1: Turnover ₹1.5 Cr with cash > 5% triggers Section 44AB(a) — PASS
  - TC6.2: Turnover ₹8 Cr with cash <= 5% qualifies for elevated ₹10 Cr limit — PASS
  - TC6.3: Opting out of 44AD in 5-year lock-in triggers Section 44AB(e) — PASS
  - TC6.4: Professional declaring profit < 50% under 44ADA triggers Section 44AB(d) — PASS

### Part B: Complete Automated E2E Test Suite (Tiers 1 - 4)
Executed via `node tests/e2e/run-e2e.mjs`:
- **Tier 1 (Feature Coverage):** 94 / 94 Passed (100%)
  - Server-side auth & OAuth proxy, Zero hosting cost boundary, Static blog generation, Route resolution, Admin console security, Media management, Git-backed content persistence, SEO metadata, Security headers, etc.
- **Tier 2 (Boundary & Corner Cases):** 78 / 78 Passed (100%)
  - XSS payload sanitization, Content Security Policy (CSP), Strict-Transport-Security (HSTS), Edge routing, High-entropy secret detection, Zero-secret bundle purity.
- **Tier 3 (Pairwise Combinations):** 10 / 10 Passed (100%)
  - Draft post + direct URL, Publish post + sitemap, Media upload + render, Auth whitelist + mutation, Markdown XSS + sanitized view, Static section schema + public render, Edge headers + fallback routing, Zero-secret bundle + serverless OAuth.
- **Tier 4 (Real-World Scenarios):** 5 / 5 Passed (100%)
  - Scenario 1: Complete Blog Publishing Lifecycle.
  - Scenario 2: Draft Quarantine & Unpublish Verification Flow.
  - Scenario 3: Malicious Markdown & Adversarial XSS Attack Defense.
  - Scenario 4: Client Inquiry & Existing Routes Regression Defense.
  - Scenario 5: Edge Security, Auth Tampering & Zero-Secret Defense.
- **Total E2E Tests:** 187 Passed, 0 Failed, 0 Skipped (Duration: 59.41s).

---

## 3. Client Scope & Boundary Enforcement Verification

| Client Scope Requirement | Status | Verification & Code Evidence |
| :--- | :--- | :--- |
| **No Knowledge Bank** | **✔ ENFORCED** | `/knowledge-bank` route remains strictly eliminated from `App.tsx` and sitemap. |
| **No Public Tax Calculators** | **✔ ENFORCED** | Public tax calculator UI pages remain removed from public navigation and routes. |
| **No Statutory FAQ Section 9** | **✔ ENFORCED** | Section 9 remains excluded from homepage; technical insights originate purely from published blog posts. |
| **No Entity Advisor Tool** | **✔ ENFORCED** | Public wizard / calculator tools remain strictly omitted. |
| **No Misleading Commercial Guarantees** | **✔ ENFORCED** | Zero instances of "Complete Legal Immunity", "Guaranteed ROC Compliance", or "Zero Late Fee Guarantee". Verified via ripgrep across entire `src/`. |
| **Exact Verified Contact Information** | **✔ ENFORCED** | Primary: `+91 96263 50900`, Secondary: `+91 95421 53906`, Email: `cakavithasrj@gmail.com`. |
| **Verified Institutional Framing** | **✔ ENFORCED** | Managing partner title: "Chartered Accountant (ICAI Member)". Clear differentiation between partner career history (Deloitte & Ford) and firm metrics. |
| **Institutional Validation Note** | **✔ ENFORCED** | Section 2 Trust Metrics includes explicit compliance footnote explaining career foundation. |

---

## 4. Navigation & Anchor Continuity

All critical deep-links and page section anchors from prior versions were preserved and verified in `src/pages/HomePage.tsx`:
- `#services-preview` (Section 3 CARVI Practice Preview)
- `#about-us` (Section 4 About the Practice)
- `#why-choose-us` (Section 5 Why Choose Us)
- `#audit-spotlight` (Section 6 Audit Spotlight Dossier)
- `#services-overview` (Section 6 Categorical Practice Disciplines)
- `#working-process` (Section 7 Chronological 4-Step Process)
- `#industries-overview` (Section 8 Industry Sectors & Corridors)
- `#insights-overview` (Section 9 Professional Insights & Articles)
- `#consultation-cta` (Section 10 Direct Consultation Line)
- `#contact-section` (Section 11 Contact Form & Details)

---

## 5. Summary Conclusion

The V5.0 transformation has delivered massive aesthetic and architectural upgrades while upholding 100% of the firm's functional, legal, and client-specified boundaries.
