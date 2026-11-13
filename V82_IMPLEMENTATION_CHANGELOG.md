# V8.2 Implementation Changelog
**Project:** Kavitha & Associates, Chartered Accountants  
**Date:** November 10, 2026  
**Document Ref:** `V82_IMPLEMENTATION_CHANGELOG.md`  
**Status:** Approved & Implemented  

---

## 1. Overview of Changes

The V8.2 release represents a targeted quality refinement and content precision pass on the V8 frontend architecture. No existing backend schemas, databases, or third-party integrations were modified.

---

## 2. File-by-File Changes

### 2.1 `src/v8/components/common/ArchitecturalFrame.tsx`
- **Change:** Refactored the inner bezel container to enforce default internal padding (`p-6 sm:p-8 lg:p-9`).
- **Impact:** Eliminates child element border collisions (such as the `INSTITUTIONAL METRICS` card) by ensuring padding is always applied inside the double border rather than on the outer shell.

### 2.2 `src/v8/pages/AboutPage.tsx`
- **Collision Fix:** Removed outer frame padding that compressed child elements; wrapped `INSTITUTIONAL METRICS` in a dedicated styled badge with `bg-[#F1EBDD] px-2.5 py-1 rounded-md border border-[#D8D0BE]`. Bounding box clearance expanded from 1.2px to 44px.
- **Content Accuracy:**
  - Separated firm identity from partner career experience: changed headline to *"A Decade of Professional Governance & Statutory Precision"*.
  - Metric 1: Changed `12+ Years` to `10+ Years` (Partner Career Experience).
  - Metric 2: Changed `100% Direct` to `Partner-Led` (Engagement Supervision).
  - Metric 3: Changed `Absolute` to `Governed` (ICAI Code of Ethics Confidentiality).
  - Replaced promotional phrases *"Twelve Years of Unwavering Statutory Defense"* and *"Zero Tolerance for Compliance Ambiguity"* with objective governance text.
  - Aligned auditing assurance language with ICAI SA 200: replaced *"absolute assurance"* with *"statutory assurance in accordance with ICAI Standards on Auditing"*.

### 2.3 `src/v8/pages/ContactPage.tsx`
- **Claim Correction:** Replaced *"absolute confidentiality"* with *"strict professional confidentiality standards of the ICAI Code of Ethics"*.

### 2.4 `src/v8/components/layout/FloatingWhatsApp.tsx` & `src/components/FloatingWhatsApp.tsx`
- **Precautionary UX & Presentation Decision:** Completely removed the intrusive `Active Partner Desk` speech bubble, 12-second trigger timer, auto-open state, pulsing beacon animation, and sessionStorage dismissal logic to eliminate visual clutter and maintain a quiet, dignified institutional presentation.
- **Accessible Floating CTA:** Preserved a discrete, accessible floating WhatsApp button (`48px x 48px`, `aria-label="Connect via WhatsApp"`, direct link to `https://wa.me/919626350900`) without availability claims.

### 2.5 `src/v8/components/home/FeaturedInsightsSection.tsx`
- **Image Loading:** Updated companion article images from `loading="lazy"` to `loading="eager"` to eliminate layout jitter and deferred load gaps.
- **DOM Attribute Standard:** Replaced camelCase `fetchPriority="high"` with standard `fetchpriority="high"` to eliminate React DOM console warnings.

### 2.6 `src/v8/components/home/HeroSection.tsx`
- **DOM Attribute Standard:** Standardized `fetchPriority` to `fetchpriority` on hero background imagery.

### 2.7 `src/v8/pages/BlogArticlePage.tsx` & `src/v8/pages/BlogPage.tsx`
- **Image Loading:** Changed companion article covers to `loading="eager"` and fixed `fetchPriority` prop casing.

### 2.8 `public/uploads/blog/` WebP Assets
- Verified 16:10 aspect ratio (`1200x750`) across all editorial blog cover assets:
  - `statutory-audit-guidelines-2026.webp` (Financial records & document review)
  - `gst-annual-return-compliance.webp` (Tax documentation & business accounting)
  - `corporate-tax-planning-2026.webp` (Financial planning & professional advisory)
  - `internal-audit-best-practices.webp` (Risk appraisal & internal controls)
