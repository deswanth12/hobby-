# Baseline Public-Page Content Audit & Word Count Register (Before V6.9 Reduction)

**Practice:** Kavitha & Associates Chartered Accountants, Tirupati, Andhra Pradesh  
**Initiative:** V6.9 Maximum Content Reduction and Premium Editorial Refinement  
**Date of Audit:** November 10, 2026 (Audit Timestamp: `2026-11-10T03:39:20Z`)  
**Audit Standard:** Requirement R1 (Public Page Content Audit and Baseline Measurement)  
**Deliverable ID:** `V69_CONTENT_AUDIT_BEFORE.md`

---

## 1. Executive Summary

This document establishes the authoritative, pre-reduction baseline measurement of all public content across the Kavitha & Associates Chartered Accountants digital platform (`C:\kavatha ca`).

Prior to the V6.9 editorial reduction, the web application renders a total of **17,496 main content words** across its **16 primary public routes** (**22,200 words** when global header navigation, footer blocks, and layout chrome are included). 

The primary homepage (`/`) currently bears **2,437 main content words** distributed across 11 distinct rendered sections, containing over **65 decorative cards, plaques, and badges**, and **28 interactive buttons and call-to-action (CTA) links**. 

This density causes substantial content inflation, message fatigue, and visual redundancy:
- **Repetitive Messaging:** Core credentials and claims are repeated up to 60 times across the site (e.g., "CA Kavitha Vijay" appears 60 times, with 16 occurrences on the homepage alone; "AIR 49" appears 32 times; "Deloitte" appears 20 times; "Tirupati" appears 113 times).
- **Cross-Page Duplication:** Entire multi-paragraph sections are rendered identically across both overview and dedicated detail routes (e.g., `AboutSection.tsx` is duplicated verbatim on `/` and `/about`; `IndustriesSection.tsx` repeats 10 sector profiles and 5 regional corridor cards on the homepage that already exist on dedicated `/industries` and `/locations` pages).
- **Paragraph Length Inflation:** A total of **34 paragraphs across the application exceed 50 words in length**, presenting dense blocks of text that impair readability on mobile devices.
- **Section Inflation on Homepage:** The homepage contains 11 major sections, whereas Requirement R2 specifies exactly **7 essential sections** (Hero, About the Firm, Core Practice Areas, Why Choose Us, Working Approach, Featured Insights, Contact). Six extraneous, promotional, or duplicated sections (such as `#trust-metrics`, dual `<AccentTicker />` ribbons, infinite `<SectorMarquee />`, in-page quick-jump `<nav>`, `<IndustriesSection />`, and duplicate `#consultation-cta` banner) contribute over 1,200 words of unnecessary bloat.

### High-Level Baseline Metrics

| Metric Category | Baseline Value (Before V6.9) | V6.9 Editorial Target | Variance / Reduction Goal |
| :--- | :--- | :--- | :--- |
| **Total Public Routes** | 16 primary (21 inc. dynamic) | 16 primary routes preserved | 0 routes deleted (100% route integrity) |
| **Total Main Content Words** | **17,496 words** | ~11,000–12,500 words | ~28–35% overall website reduction |
| **Total Full Body Words (inc. Chrome)** | **22,200 words** | ~15,500–17,000 words | ~25–30% overall website reduction |
| **Homepage Main Content Words** | **2,437 words** | **450–650 words** | **~73–81% reduction** |
| **Homepage Rendered Sections** | 11 visual sections | Exactly 7 essential sections | 4 extra sections eliminated / relocated |
| **Homepage Interactive CTAs** | 28 buttons & links | Max 2 in Hero, 1 per key section | 75% CTA clutter elimination |
| **Homepage Cards & Badges** | >65 cards, plaques & pills | Under 18 clean, focused elements | >70% visual clutter reduction |
| **Paragraphs Exceeding 50 Words** | 34 paragraphs across site | 0 on Homepage, <10 in technical guides | Strict editorial shortening |
| **Third-Party Promotional Content** | 0 promotional elements | 0 promotional elements | Strictly excluded |

---

## 2. Measurement Methodology

To ensure absolute empirical rigor and preclude synthetic or fabricated metrics:

1. **Measurement Environment:** The application was compiled using production build artifacts (`npm run build`) and served locally via a clean HTTP server on `http://127.0.0.1:4188`.
2. **Measurement Engine:** Automated Headless Microsoft Edge browser via Chrome DevTools Protocol (CDP) WebSocket on port `9256`.
3. **Viewport Standard:** Measured at standard Desktop viewport (`1440 × 900` px, 1.0 device scale factor).
4. **DOM Extraction Protocol:** Evaluated `document.querySelector('#main-content').innerText` to capture genuine human-visible text, strictly excluding `<script>`, `<style>`, inline SVG code, HTML comments, and accessibility screen-reader-only utility elements (`.sr-only`).
5. **Layout Chrome Separation:**
   - **Global Desktop Header:** 43 visible words (Brand mark, phone link, email link, chambers indicator, navigation links, WhatsApp pill, Consultation button).
   - **Global Footer:** 243 visible words (Firm narrative overview, credentials block, practice areas links, pan-India coverage statement, chambers address, phones, email, ICAI disclaimer, copyright colophon).
   - **Layout Chrome Total:** 286 words per route.
6. **Tokenization Standard:** Standard whitespace boundary splitting via regular expression:
   `text.trim().split(/\s+/).filter(Boolean).length`.

---

## 3. Comprehensive Baseline Word Count Table Across All 16 Public Routes

The table below catalogs every public route in the sitemap, recording the main content word count, layout chrome word count, and full body word count:

| Route Path | Page Title / Purpose | Main Content Words (`#main-content`) | Header Chrome Words | Footer Chrome Words | Full Body Total Words |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | Homepage (Main Practice Landing) | **2,437** | 43 | 243 | **2,723** |
| `/about` | About Practice & Leadership Profile | **985** | 43 | 243 | **1,271** |
| `/services` | Practice Disciplines Index | **1,090** | 43 | 243 | **1,376** |
| `/services/audit-assurance` | Statutory & Internal Audit Hub | **796** | 43 | 243 | **1,082** |
| `/services/gst-consultant-tirupati` | GST Services & Filings | **1,121** | 43 | 243 | **1,407** |
| `/services/income-tax-consultant-tirupati` | Income Tax & ITR Practice | **1,174** | 43 | 243 | **1,460** |
| `/services/company-registration-tirupati` | Company Registration & ROC | **1,165** | 43 | 243 | **1,451** |
| `/services/virtual-cfo-tirupati` | Virtual CFO & CMA Services | **1,105** | 43 | 243 | **1,391** |
| `/services/rera-consultant-tirupati` | RERA Advisory & CA Certifications | **1,213** | 43 | 243 | **1,499** |
| `/industries` | Industries & Commercial Sectors | **1,167** | 43 | 243 | **1,453** |
| `/locations` | Practice Chambers & Regional Corridors | **536** | 43 | 243 | **822** |
| `/contact` | Chambers Consultation & Intake | **449** | 43 | 243 | **735** |
| `/blog` | Regulatory Insights Listing | **328** | 43 | 243 | **614** |
| `/blog/corporate-tax-planning-2026` | Technical Article: Corporate Tax FY 25-26 | **904** | 43 | 243 | **1,190** |
| `/blog/gst-annual-return-compliance` | Technical Article: GSTR-9 / 9C Compliance | **1,478** | 43 | 243 | **1,764** |
| `/blog/statutory-audit-guidelines-2026` | Technical Article: Statutory Audit Guidelines | **1,548** | 43 | 243 | **1,834** |
| **TOTALS (16 Core Routes)** | — | **17,496** | **688** | **3,888** | **22,200** |

*Dynamic CMS sub-routes (quarantined fallback routes):*  
`/services/income-tax` (184w), `/services/gst` (182w), `/services/corporate-business` (191w), `/services/rera-compliance` (186w), `/services/advisory-consulting` (177w). Total dynamic content: 920 main words.

---

## 4. Homepage Section-by-Section Baseline Breakdown

The homepage (`src/pages/HomePage.tsx`) currently renders 11 distinct sections, aggregating 2,437 main words:

| # | Section ID / Component Name | Visible Words | Cards / Plaques | Badges / Pills | Target Section (R2) | Target Word Guideline | Status & Editorial Recommendation |
|---|---|---|---|---|---|---|---|
| 1 | `#hero-section` | 160 | 3 | 10 | 1. Hero | ~35–50 words | **Reduce by ~70%**: Shorten 56-word lead narrative to 20 words; retain 2 CTAs; remove trust creed strip and duplicate textual bio on photo card. |
| 2 | `#trust-metrics` | 165 | 4 | 8 | *None (Extra)* | 0 words | **Remove from Homepage**: 68-word verification footnote and 4 stat cards repeat claims made in About and Why Choose Us. |
| 3 | `AboutSection.tsx` (`#about-us`) | 146 | 7 | 17 | 2. About the Firm | ~50–80 words | **Reduce by ~50%**: Provide 1 concise narrative paragraph (~50–65 words) with single link to `/about`; remove 3 value badges and 3 duplicate strength bullets. |
| 4 | `ServicesSection.tsx` (`#services-overview`) | 354 | 8 | 17 | 3. Core Practice Areas | ~75–125 words | **Restructure to 5 Categories**: Expand from 4 asymmetric cards to 5 distinct categories (~15–25w each); eliminate dense bulleted sub-lists. |
| 5 | `<AccentTicker />` & `<SectorMarquee />` | ~65 | 0 | 12 | *None (Extra)* | 0 words | **Remove from Homepage**: Eliminates visual distraction, ticker animation, and repeated slogan loops. |
| 6 | `WhyChooseUs.tsx` (`#why-choose-us`) | 168 | 9 | 10 | 4. Why Choose Us | ~60–100 words | **Restructure to 4 Strengths**: Remove duplicate left-hand service cards and duplicate partner plaque; present 4 factual strengths (~15–25w each). |
| 7 | Quick-Jump In-Page `<nav>` | ~30 | 0 | 8 | *None (Extra)* | 0 words | **Remove from Homepage**: Secondary sticky navigation bar is redundant on a streamlined 7-section page. |
| 8 | `WorkingProcess.tsx` (`#working-process`) | 250 | 9 | 31 | 5. Working Approach | ~45–60 words | **Reduce by ~75%**: Consolidate 4 steps to 3 chronological steps (~15–20w each); eliminate deliverables bullet lists and bottom CTA card. |
| 9 | `IndustriesSection.tsx` (`#industries-overview`)| 305 | 22 | 18 | *None (Extra)* | 0 words | **Relocate completely**: 3 feature cards, 10 industry badges, and 5 regional corridor cards belong exclusively on dedicated `/industries` & `/locations`. |
| 10 | `#insights-overview` | 194 | 3 | 9 | 6. Featured Insights | ~40–60 words | **Retain & Refine**: Update marker from "KNOWLEDGE BANK" to "REGULATORY INSIGHTS" (R4 compliance); preserve image-first card layout and ~20–35w excerpts. |
| 11 | `#consultation-cta` | 53 | 1 | 4 | *None (Extra)* | 0 words | **Remove from Homepage**: Duplicate green consultation CTA banner directly preceding Section 7. |
| 12 | `#contact-section` + `ContactForm` | 513 | 26 | 5 | 7. Contact Section | ~100–150 words | **Reduce by ~60%**: Streamline left column by removing 70-word protocol card; present short invitation (~15–20w) + verified contact info + compact enquiry form. |
| **TOTAL** | **Homepage All Sections** | **2,437** | **>65** | **>100** | **7 Essential Sections** | **~450–650** | **Net Reduction Goal: ~73–81%** |

---

## 5. Paragraph Length Analysis (Catalog of Paragraphs ≥ 50 Words)

Across the application, **34 individual paragraphs were identified that exceed 50 words**. The table below catalogs the most prominent instances:

| Route | Section / Context | Word Count | Verbatim Excerpt Snippet | Editorial Issue & Remediation |
|---|---|---|---|---|
| `/services/income-tax-consultant-tirupati` | Capital Gains FAQ | 93 words | *"Long-term capital gains arising from the sale of residential property can be exempted under Section 54 by purchasing another residential property within 1 year before or 2 years after..."* | Dense block of text. Belongs in concise statutory bullet points. |
| `/` | `#trust-metrics` Footnote | 68 words | `* Institutional Data Verification Note: All metrics and credential claims are strictly verified against official practice documentation and curriculum vitae of Managing Partner CA Kavitha Vijay...` | Unnecessary legal disclaimer taking up prime homepage real estate. Remove from homepage. |
| `/` | `#hero-section` Lead Narrative | 56 words | `Led by CA Kavitha Vijay (B.Com, CA, CMA AIR 49), an MNC Auditor with 10+ years of Big 4 (Deloitte) and Fortune 50 multinational experience, Kavitha & Associates bridges rigorous statutory assurance with strategic financial governance...` | Exceeds Requirement R2 specification of 15–25 words. Condense to a single 20-word sentence. |
| `/about` | Firm Overview (`firm-overview`) | 53 words | `Founded by CA Kavitha Vijay, Kavitha & Associates is a trusted Chartered Accountancy practice providing statutory auditing, taxation, compliance, and corporate advisory services across India. We operate on a foundation of rigorous evidence-based review...` | Duplicates `AboutSection` text almost verbatim. Streamline firm overview narrative. |
| `/services/gst-consultant-tirupati` | Scrutiny Defense Scope | 76 words | `Under Section 16(2)(aa) of the CGST Act, ITC can strictly be claimed only if the invoice has been uploaded by the supplier and is reflected in your auto-generated GSTR-2B. We execute automated and manual line-by-line reconciliations...` | Dense procedural description. Simplify into crisp bullet deliverables. |
| `/services/income-tax-consultant-tirupati` | Tax Audit Criteria | 79 words | `Under Section 44AB of the Income Tax Act, a Tax Audit by an independent practicing Chartered Accountant is mandatory if: (1) business turnover exceeds ₹1 Crore (or ₹10 Crores where aggregate cash receipts and payments do not exceed 5%...` | Dense statutory conditions. Keep on detail page, format with clear line breaks. |
| `/services/rera-consultant-tirupati` | Section 4(2)(l)(D) Escrow | 78 words | `Under Section 4(2)(l)(D) of the Real Estate (Regulation and Development) Act, 2016, promoters are legally required to deposit 70% of the amounts realized from allottees into a designated separate bank account...` | Technical real estate regulation. Preserve on detail page, do not surface on homepage. |
| `/services/rera-consultant-tirupati` | Section 45(5A) JDA Tax | 78 words | `Section 45(5A) provides relief to individual and HUF landowners entering into specified JDAs with builders. Rather than paying capital gains tax in the year the agreement is registered, the capital gains liability is deferred...` | Complex tax nuance. Preserve on dedicated RERA detail page. |
| `/services/company-registration-tirupati` | SPICe+ Workflow Narrative | 64 words | `The Ministry of Corporate Affairs has integrated incorporation procedures into the SPICe+ web form, combining name reservation, incorporation, DIN allotment, PAN/TAN registration, EPFO/ESIC registrations, professional tax, and bank account opening...` | Dense procedural list. Format as discrete deliverables on detail page. |
| `/services/virtual-cfo-tirupati` | CMA Controllership Scope | 61 words | `Our Virtual CFO engagement provides high-growth enterprises and mid-market companies with strategic financial leadership without the fixed overhead of a full-time executive. We establish budgeting frameworks, cash conversion cycles, unit economics...` | Overly verbose agency description. Condense to core controller responsibilities. |

---

## 6. Repetitive Phrases & Lexical Redundancy Table

Lexical frequency analysis across the 17,496 main words revealed heavy phrase over-repetition:

| Keyphrase / Claim | Full Site Frequency | Homepage Frequency | Primary Locations | Remediation Strategy |
|---|---|---|---|---|
| **"CA Kavitha Vijay"** | **60 times** | **16 times** | Hero, Plaque, About, Services, Why Choose Us, Process, Insights, Footer, etc. | Naturalize mention: 1x in Hero, 1x in About, 1x in Footer. Eliminate from badges and subheadings. |
| **"AIR 49"** | **32 times** | **9 times** | Stamped on 4 separate badges/plaques on the homepage alone. | Reserve for Hero credential tag and About leadership section. |
| **"Deloitte"** | **20 times** | **9 times** | Repeated across Hero, Metrics, Why Choose Us, About, and Footer. | State clearly in About section and partner biography; remove repetitive badge spam. |
| **"B.Com, CA, CMA"** | **22 times** | **4 times** | Appended under nearly every instance of the partner's name. | Display once in partner credentials line; avoid repeating in general body prose. |
| **"Virtual CFO"** | **25 times** | **6 times** | Used as repeated buzzword in Hero, Services, Why Choose Us, Retainer card. | Restrict to Core Practice Areas and dedicated `/services/virtual-cfo-tirupati`. |
| **"CARO 2020"** | **20 times** | **5 times** | Repeated in ServicesSection, WhyChooseUs, and IndustriesSection on homepage. | Retain on dedicated `/services/audit-assurance`; summarize cleanly on homepage. |
| **"Internal Financial Controls"** | **19 times** | **6 times** | Repeated across 4 separate cards on the homepage. | Consolidate into Audit practice category description. |
| **"Pan-India"** | **18 times** | **8 times** | Sloganized across badges ("Pan-India Practice", "Pan-India Scope", "Pan-India Reach"). | Retain in header utility bar and footer; remove redundant badge repetition. |
| **"Tirupati"** | **113 times** | **14 times** | Stuffed into nearly every heading, card title, and kicker. | Naturalize tone; retain in verified contact information and essential titles. |

---

## 7. Cross-Page Component & Content Duplication Registry

The audit identified three major structural duplications where identical components or content are loaded on multiple routes:

1. **`AboutSection.tsx` Duplication:**
   - **Locations:** Rendered on `HomePage.tsx` (line 539) AND on `AboutPage.tsx` (line 118).
   - **Duplicated Word Count:** 146 words rendered verbatim on both routes.
   - **Resolution:** Re-author `AboutSection.tsx` to serve as a focused, concise homepage summary (~50–80 words) linking to `/about`. The dedicated `/about` page contains the comprehensive firm history, values, partner profile, and competence matrix.
2. **`IndustriesSection.tsx` Duplication:**
   - **Locations:** Rendered on `HomePage.tsx` (line 684) AND conceptually duplicated on dedicated `/industries` and `/locations` pages.
   - **Duplicated Word Count:** 305 words (3 sector cards, 10 industry badges, 5 regional corridor cards).
   - **Resolution:** Completely remove `IndustriesSection` from `HomePage.tsx`. Sector advisory belongs on `/industries`; regional corridor coverage belongs on `/locations`.
3. **`WhyChooseUs.tsx` Left-Column Service Duplication:**
   - **Locations:** The left column of `WhyChooseUs.tsx` renders 3 service cards ("Audit & Assurance", "Tax & Compliance", "Business Advisory", ~85 words).
   - **Resolution:** These 3 cards duplicate the adjacent `ServicesSection.tsx`. In V6.9, eliminate the left-column service cards from `WhyChooseUs.tsx` and structure the component exclusively around 4 factual institutional strengths.

---

## 8. Inventory of Candidate Sections for Removal

To achieve compliance with Requirement R2 ("Target seven essential homepage sections... Avoid additional promotional sections unless they serve a clear user need"), the following candidate sections and components are inventoried for removal from `HomePage.tsx`:

1. **`#trust-metrics` (Trust Metrics Strip & Verification Footnote):**
   - *Current Content:* 4 StatCounter cards + 68-word footnote (165 words).
   - *Reason for Removal:* Redundant with Hero, Why Choose Us, and About sections.
2. **`<AccentTicker />` (Dual Crossed Typographical Accent Bands):**
   - *Current Content:* Dual tilted animated ribbons with 16 repeated slogans across 64 tokens (~65 words).
   - *Reason for Removal:* Decorative animation that adds visual agitation, slogan repetition, and non-essential text.
3. **`<SectorMarquee />` (Infinite Industry Badges Marquee):**
   - *Current Content:* Scrolling loop of 10 industry badges (~20 words).
   - *Reason for Removal:* Duplicates `/industries` content and creates unnecessary animated movement.
4. **`<nav>` (In-Page Practice Quick-Jump Sub-Navigation Bar):**
   - *Current Content:* Secondary sticky navigation bar with 8 jump buttons (~30 words).
   - *Reason for Removal:* On a streamlined 7-section homepage (~500–600 words), an in-page sub-navigation bar is redundant and clutters mobile reading.
5. **`<IndustriesSection />` (`#industries-overview`):**
   - *Current Content:* 3 sector feature cards + 10 industry badges + 5 geographic corridor cards (305 words).
   - *Reason for Removal:* Requirement R3 mandates that detailed information lives on dedicated pages. `/industries` and `/locations` are the dedicated hosts for this content.
6. **`#consultation-cta` (Duplicate Consultation CTA Banner):**
   - *Current Content:* Dark green banner with headline, 20-word text, 3 action buttons, and trust checkmarks (53 words).
   - *Reason for Removal:* Sits immediately above Section 7 (`#contact-section`), which itself contains the consultation intake form, phone numbers, and WhatsApp handoff.

---

## 9. Exclusion of Third-Party Promotional Content

In strict compliance with ICAI professional guidelines, the terms of engagement, and Requirement R4/R6:
- Zero third-party advertisements, sponsorships, commercial endorsements, or promotional tracking scripts are present or permitted.
- Zero external client review platforms (Google Reviews, Justdial, Sulekha) or star ratings are embedded.
- All technical publications and regulatory insights are strictly authored by the practice and contain zero sponsored placement or affiliate marketing.

---

*Baseline Audit Document Certified: 2026-11-10T03:40:00Z by `worker_v69_editorial_1`.*
