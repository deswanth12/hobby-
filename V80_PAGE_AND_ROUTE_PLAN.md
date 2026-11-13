# V80 Page and Route Plan Specification

**Target Platform:** Kavitha & Associates — Chartered Accountants  
**Document Classification:** Information Architecture, Route Inventory & Content Plan  
**Version:** 8.0.0  
**Status:** Publication-Ready & Verified  
**Milestone:** M3 (Information Architecture & Route Planning)  
**Authoritative Standards:** ICAI Code of Ethics, Laperruta & Associates Architectural Aesthetic, WCAG 2.1 AA  
**Working Directory:** `C:\kavatha ca`  

---

## 1. Executive Summary & Routing Philosophy

The Kavitha & Associates web platform (V8.0) is engineered as a high-authority, editorial Single Page Application (SPA) designed to project institutional competence, statutory rigor, and absolute client confidentiality.

### Core Principles:
1. **The 30-Second Homepage Mandate:** A visitor must fully understand the firm's identity, qualifications, core disciplines, and communication channels within approximately 30 seconds (~120–135 scannable words). Detailed technical scopes are relocated to dedicated inner corridors.
2. **Dedicated Practice Corridors:** High-intent statutory search queries are routed to dedicated, content-rich corridor pages (e.g. `/services/audit-assurance`, `/services/income-tax-consultant-tirupati`) rather than generic service lists.
3. **Triple-Layer Draft Quarantine:** Regulatory insights marked `draft: true` are isolated across the database, REST API, and client router, ensuring that unpublished or unverified commentary is never exposed to the public.
4. **Fails-Closed Administrative Obfuscation:** Legacy admin paths (`/admin`, `/admin/*`) are quarantined to 404. The administrative portal mounts exclusively at a cryptographically validated, high-entropy route slug (`VITE_ADMIN_SECRET_PATH`), which fails closed if unconfigured.
5. **Canonical 16-URL Sitemap Integrity:** Search engines and Generative Engine Optimization (GEO) crawlers are indexed across exactly 16 verified canonical URLs, completely sequestering administrative endpoints.

---

## 2. Complete Route Inventory & Technical Metadata Matrix

| # | Route Path | Component Name | Layout Wrapper | Access Level | Sitemap Priority | Change Freq | SEO Title | Breadcrumb Structure | Auth Guard |
|---|------------|----------------|----------------|--------------|:----------------:|:-----------:|-----------|----------------------|------------|
| 1 | `/` | `HomePage` | `PublicLayout` | Public | `1.0` | `weekly` | Chartered Accountant in Tirupati \| Kavitha & Associates | None (Root) | None |
| 2 | `/about` | `AboutPage` | `PublicLayout` | Public | `0.8` | `monthly` | About CA Kavitha Vijay \| Chartered Accountant in Tirupati \| Kavitha & Associates | Home > About | None |
| 3 | `/services` | `ServicesPage` | `PublicLayout` | Public | `0.9` | `monthly` | Accounting & Tax Services in Tirupati \| Kavitha & Associates | Home > Services | None |
| 4 | `/services/audit-assurance` | `AuditAssurancePage` | `PublicLayout` | Public | `0.9` | `monthly` | Statutory Audit in Tirupati \| Tax & Internal Audits \| Kavitha & Associates | Home > Services > Audit & Assurance | None |
| 5 | `/services/income-tax-consultant-tirupati` | `IncomeTaxPage` | `PublicLayout` | Public | `0.9` | `monthly` | Income Tax Consultant in Tirupati \| ITR \| Kavitha & Associates | Home > Services > Income Tax | None |
| 6 | `/services/gst-consultant-tirupati` | `GSTServicesPage` | `PublicLayout` | Public | `0.9` | `monthly` | GST Consultant in Tirupati \| GST Filing \| Kavitha & Associates | Home > Services > GST Services | None |
| 7 | `/services/company-registration-tirupati` | `CompanyRegistrationPage` | `PublicLayout` | Public | `0.9` | `monthly` | Company Registration in Tirupati \| ROC \| Kavitha & Associates | Home > Services > Company Registration | None |
| 8 | `/services/virtual-cfo-tirupati` | `VirtualCFOPage` | `PublicLayout` | Public | `0.9` | `monthly` | Virtual CFO Services in Tirupati \| CMA \| Kavitha & Associates | Home > Services > Virtual CFO | None |
| 9 | `/services/rera-consultant-tirupati` | `RERAConsultantPage` | `PublicLayout` | Public | `0.9` | `monthly` | RERA Advisory & CA Certificates in Tirupati \| Kavitha & Associates | Home > Services > RERA Consultant | None |
| 10 | `/services/:slug` | `DynamicServiceDetailPage` | `PublicLayout` | Public | Dynamic | `monthly` | `{service.title} in Tirupati \| CA Kavitha & Associates` | Home > Services > `{service.title}` | None (404 on draft) |
| 11 | `/industries` | `IndustriesPage` | `PublicLayout` | Public | `0.7` | `monthly` | Industry Accounting & Tax Solutions in Tirupati \| Kavitha & Associates | Home > Industries | None |
| 12 | `/locations` | `LocationsPage` | `PublicLayout` | Public | `0.7` | `monthly` | CA Chambers in Tirupati & Regional Client Coverage \| Kavitha & Associates | Home > Locations | None |
| 13 | `/blog` | `BlogPage` | `PublicLayout` | Public | `0.8` | `weekly` | Tax & Regulatory Insights \| CA Kavitha & Associates Tirupati | Home > Regulatory Insights | None |
| 14 | `/blog/:slug` | `BlogArticlePage` | `PublicLayout` | Public | `0.7` | `monthly` | `{post.title} \| Kavitha & Associates` | Home > Regulatory Insights > `{post.title}` | None (404 on draft) |
| 15 | `/contact` | `ContactPage` | `PublicLayout` | Public | `0.8` | `monthly` | Contact Chartered Accountant in Tirupati \| Kavitha & Associates | Home > Contact | None |
| 16 | `*` | `NotFoundPage` | `PublicLayout` | Public | Excluded | `never` | 404 — Page Not Found \| Kavitha & Associates | None (Directory Recovery) | None |
| 17 | `/admin` | `NotFoundPage` | None | Quarantined | Excluded | `never` | 404 — Page Not Found \| Kavitha & Associates | None | Quarantined (404) |
| 18 | `/admin/*` | `NotFoundPage` | None | Quarantined | Excluded | `never` | 404 — Page Not Found \| Kavitha & Associates | None | Quarantined (404) |
| 19 | `${ADMIN_ROUTES.login}` | `AdminLoginPage` | None | Secret | Excluded | `never` | Admin Login — Practice Console | None | Fails closed (404) |
| 20 | `${ADMIN_ROUTES.root}` | `AdminOverviewPage` | `AdminLayout` | Secret | Excluded | `never` | Practice Management Console \| Kavitha & Associates | Console > Overview | `AdminProtectedRoute` |
| 21 | `${ADMIN_ROUTES.enquiries}` | `AdminEnquiriesPage` | `AdminLayout` | Secret | Excluded | `never` | Consultation Inquiries Desk \| Practice Console | Console > Enquiries | `AdminProtectedRoute` |
| 22 | `${ADMIN_ROUTES.content}` | `AdminContentPage` | `AdminLayout` | Secret | Excluded | `never` | CMS Content Management \| Practice Console | Console > Content | `AdminProtectedRoute` |
| 23 | `${ADMIN_ROUTES.articles}` | `AdminContentPage` | `AdminLayout` | Secret | Excluded | `never` | Regulatory Articles Management \| Practice Console | Console > Articles | `AdminProtectedRoute` |
| 24 | `${ADMIN_ROUTES.settings}` | `AdminSettingsPage` | `AdminLayout` | Secret | Excluded | `never` | Chambers Settings & Overrides \| Practice Console | Console > Settings | `AdminProtectedRoute` |

---

## 3. The 30-Second Homepage Architecture

The homepage is calibrated to communicate core competence within 30 seconds (~120–135 words), transitioning prospective clients smoothly into focused corridors.

```
+--------------------------------------------------------------------------+
|                     SHARED NAVIGATION BAR (Sticky)                       |
|   KV Crest | About | Services [v] | Industries | Locations | Blog | Contact   |
+--------------------------------------------------------------------------+
|  SECTION 1: HERO & PRACTICE REGISTRY                                     |
|  - Asymmetric 7:5 Grid (Deep Evergreen #071B14)                          |
|  - Headline: "Clarity in Finance. Confidence in Every Decision."         |
|  - Supporting Sentence (20 words) | Dual CTAs (Services, Consultation)  |
|  - Double-Bezel Frame: Consultation Photo + Seal Medallion + Partner Bar |
+--------------------------------------------------------------------------+
|  SECTION 2: FIRM INTRODUCTION (The Professional Approach)                |
|  - Warm Ivory Canvas (#F1EBDD) | Centered Statement (~64 words)          |
|  - Single Clean CTA: "Read Firm Overview ->" (/about)                    |
+--------------------------------------------------------------------------+
|  SECTION 3: CORE PRACTICE AREAS                                          |
|  - Exactly 5 Disciplines (PRAC-01 to PRAC-05) (~15-25 words each)        |
|  - Direct Route Anchors to Specialized Inner Corridors                   |
+--------------------------------------------------------------------------+
|  SECTION 4: WHY CHOOSE US (Institutional Strengths)                      |
|  - Deep Evergreen Canvas (#071B14) | Exactly 4 Verified Strengths        |
|  - Big 4 Experience | Dual CA+CMA AIR 49 | Direct Partner Review | Ethics |
+--------------------------------------------------------------------------+
|  SECTION 5: WORKING METHODOLOGY (3-Stage Chronological Approach)         |
|  - Warm Ivory Canvas (#F1EBDD) | 3 Clean Sequential Cards                 |
|  - Step 1: Scoping | Step 2: Technical Execution | Step 3: UDIN Archival |
+--------------------------------------------------------------------------+
|  SECTION 6: FEATURED REGULATORY INSIGHTS                                 |
|  - Warm Cream Canvas (#F8EFDF) | Asymmetric Editorial Grid (1 Lead + 2)  |
|  - 100% Clickable Card Overlays | Zero Draft Exposure (draft = false)    |
+--------------------------------------------------------------------------+
|  SECTION 7: CHAMBERS INTAKE & CONSULTATION                               |
|  - Deep Evergreen Canvas (#071B14) | Split 5:7 Layout                    |
|  - Left: Tirupati Chambers Coordinates & Channels                        |
|  - Right: Embedded ContactForm (Honeypot + Velocity Check)               |
+--------------------------------------------------------------------------+
|                     SHARED 4-COLUMN LEDGER FOOTER                        |
+--------------------------------------------------------------------------+
```

### Detailed Section Specifications:

#### Section 1: Hero & Practice Registry
- **Canvas & Tone:** Deep Evergreen (`#071B14`), text Warm Ivory (`#F1EBDD`), Antique Bronze (`#B49A64`) accents.
- **Grid Ratio:** Asymmetric 7:5 (Desktop) stacking to single reading column on mobile (< 1024px).
- **Left Column (7 cols):**
  - Institutional Marker: `EditorialMarker` "01" + Pill badge: `INDEPENDENT CHARTERED ACCOUNTANCY PRACTICE • TIRUPATI`.
  - Master Display Headline: Level 1 fluid clamp (`font-serif`, leading 1.14): *"Clarity in Finance. Confidence in Every Decision."*
  - Supporting Statement (Strictly 20 words): *"Partner-led Chartered Accountancy and statutory counsel in Tirupati, advising growth enterprises and established businesses across India."*
  - Dual CTAs: Primary Pill (`Explore Practice Areas` -> `#practice-areas` / `/services`), Secondary Pill (`Schedule Consultation` -> `#contact-section` / `/contact`).
- **Right Column (5 cols):**
  - Double-Bezel Architectural Frame (`rounded-2xl p-2.5 bg-[#0B241C]/85 border border-[#B49A64]/30 shadow-2xl`).
  - Hero Photograph: `hero-consultation.webp` (1376x768 WebP, 16:9 aspect, eager loading, fetchpriority high).
  - Floating Practice Seal: Antique Bronze seal medallion badge reading *"Estd. Tirupati Chambers"*.
  - Partner Credential Strip: Dark plaque presenting CA Kavitha Vijay (Managing Partner, B.Com, CA, CMA AIR 49 ICMAI).
- **Word Count:** ~38 words. **Target Reading Time:** ~9 seconds.

#### Section 2: Firm Introduction & Values Overview
- **Canvas:** Warm Ivory (`#F1EBDD`), text Walnut Brown (`#35271F`).
- **Component:** `AboutSection` with `showReadMore={true}`, `headingLevel="h2"`, `readMoreHref="/about"`.
- **Content:** Concise institutional narrative (~64 words) explaining partner supervision, evidence-based review, and ICAI auditing standards.
- **Word Count:** ~64 words. **Target Reading Time:** ~8 seconds.

#### Section 3: Core Practice Areas
- **Canvas:** Warm Ivory (`#F1EBDD`).
- **Composition:** Exactly 5 primary practice disciplines (`PRAC-01` to `PRAC-05`):
  1. *Audit and Assurance (`PRAC-01`):* Statutory audits, tax audits (44AB), CARO 2020 -> `/services/audit-assurance`.
  2. *Direct Taxation & Advisory (`PRAC-02`):* Corporate tax, capital gains, scrutiny defense -> `/services/income-tax-consultant-tirupati`.
  3. *GST & Indirect Tax Compliance (`PRAC-03`):* GSTR-1, 3B, 9/9C reconciliation -> `/services/gst-consultant-tirupati`.
  4. *Corporate Law & Governance (`PRAC-04`):* Company incorporation, ROC secretarial -> `/services/company-registration-tirupati`.
  5. *Strategic Business Advisory (`PRAC-05`):* Virtual CFO, CMA data, cost accounting -> `/services/virtual-cfo-tirupati`.
- **Word Count:** ~20 scannable words. **Target Reading Time:** ~5 seconds.

#### Section 4: Why Choose Us (Factual Institutional Strengths)
- **Canvas:** Deep Evergreen (`#071B14`), text Warm Ivory (`#F1EBDD`).
- **Composition:** 4 verified institutional strengths:
  1. *Big 4 Audit Foundation:* Experience spanning Deloitte Haskins & Sells (field senior on ₹1,000 Cr IPO).
  2. *Dual CA + CMA AIR 49 Qualification:* All India Rank 49 in CMA Intermediate (ICMAI), combining external assurance with internal cost governance.
  3. *Direct Partner Supervision:* Direct partner review on every working paper and client filing.
  4. *Regulatory Compliance & Ethics:* Strict adherence to the Chartered Accountants Act, 1949 and ICAI Code of Ethics.
- **Word Count:** ~80 words (~20 words per strength). **Target Reading Time:** ~4 seconds.

#### Section 5: Working Methodology
- **Canvas:** Warm Ivory (`#F1EBDD`).
- **Composition:** 3 chronological workflow phases:
  - Phase 1: *Scoping & Statute Assessment* (statutory deadlines, compliance backlog).
  - Phase 2: *Technical Execution & Reconciliation* (working paper compilation, ledger triangulation).
  - Phase 3: *Statutory Sign-Off & Archival* (UDIN generation, portal upload, certified archival).
- **Word Count:** ~42 words (~14 words per step). **Target Reading Time:** ~3 seconds.

#### Section 6: Featured Regulatory Insights
- **Canvas:** Warm Cream (`#F8EFDF`).
- **Composition:** Asymmetric 12-column editorial grid. Left: 1 prominent 16:10 lead article card; Right: 2 companion cards.
- **Interaction:** 100% card overlay clickable links to `/blog/:slug`.
- **Draft Exclusion:** Strictly filters `draft === false`.
- **Word Count:** ~45 scannable words. **Target Reading Time:** ~3 seconds.

#### Section 7: Chambers Consultation & Intake
- **Canvas:** Deep Evergreen (`#071B14`), text Warm Ivory (`#F1EBDD`).
- **Composition:** Split 5:7 layout. Left 5 cols: Chambers telephone (`+91 96263 50900`), official email (`cakavithasrj@gmail.com`), physical coordinates (Bairagi Patteda, Tirupati), short 17-word invitation. Right 7 cols: Embedded `ContactForm` with honeypot (`website_fax_hp`), velocity check (>= 1500ms), and direct WhatsApp handoff.
- **Word Count:** ~35 words. **Target Reading Time:** ~3 seconds.

*Total 30-Second Homepage Reading Time: ~35 seconds (scannable headline & core copy: ~30 seconds).*

---

## 4. Institutional Corridor Route Specifications

### 4.1 `/about` — About the Practice & Leadership
- **Component:** `AboutPage.tsx`
- **Layout & Canvas:** Wrapped in `PublicLayout`. Warm Cream (`#F8EFDF`) and Warm Ivory (`#FFF9EF`).
- **Key Sections:**
  1. *Institutional Overview:* Narrative detailing practice establishment and dual CA+CMA governance philosophy.
  2. *Foundational Values:* 4 light cards (Professional Integrity, Industry Experience, Client Focus, Pan-India Reach).
  3. *Leadership Dossier (CA Kavitha Vijay):* Verified biography, education (Madras University, ICAI, ICMAI), honors (AIR 49 in CMA Intermediate, Move the Dot award), career history (Deloitte, Ford Motor Company, Manohar Chowdhry). Quarantined portrait replaced by neutral `KV / KA` crest medallion.
  4. *Dual Competence Advantage Matrix:* Table comparing Chartered Accountant (statutory compliance, true & fair view) vs Cost Accountant (unit cost modeling, operating margins).
  5. *Practice Domains Grid:* 6 areas of expertise with direct links to corridors.
  6. *ICAI Code of Ethics Notice:* Affirmation that information is presented strictly under the informational pull model.
- **SEO & Structured Data:** `ProfilePage` and `Person` JSON-LD linked to ICAI/ICMAI alumni records.

### 4.2 `/contact` — Chambers Intake Desk & Physical Coordinates
- **Component:** `ContactPage.tsx`
- **Layout & Canvas:** Wrapped in `PublicLayout`. Warm Ivory Paper texture (`#F5EAD8`).
- **Key Sections:**
  1. *Primary Consultation Header:* Practice invitation and direct phone/email channels.
  2. *4 Contact Cards:* Direct Telephone Desk, Written Email Desk, WhatsApp Quick Consultation, Pan-India Virtual Desk.
  3. *Chambers Intake Protocol:* Office hours (Mon–Sat 9:30 AM–7:00 PM), strict confidentiality under ICAI Code of Ethics.
  4. *Physical Location Dossier:* `19-12-46, 1st Floor, Near Bairagipetteda Arch, Bairagi Patteda, Tirupati – 517501, AP`.
  5. *Interactive Google Maps Embed:* Centered on coordinates `13.6192242, 79.418046`.
  6. *Form:* Embedded `ContactForm` with anti-spam security.

### 4.3 `/industries` — Specialized Commercial Verticals
- **Component:** `IndustriesPage.tsx`
- **Layout & Canvas:** Wrapped in `PublicLayout`. Warm Ivory canvas with sticky jump bar.
- **Key Sections:**
  1. *Sector Directory:* 10 commercial profiles:
     - Startups & Tech (Sec 80-IAC, DPIIT, cap tables)
     - MSMEs & Family Businesses (Sec 43B(h), Udyam, priority lending)
     - Manufacturing Units (CARO 2020 stock audits, Ind AS 2, Sec 143 ITC)
     - Real Estate & Builders (AP RERA Form 3, Sec 45(5A) JDA tax)
     - Retail & Distribution (Multi-branch GST, POS shrinkage audits)
     - Healthcare & Pharma (Sec 194J TDS, Sec 12AB hospital trusts)
     - Education & Trusts (Sec 12AB, Form 10B/10BB, FCRA)
     - E-Commerce & D2C (Sec 52 TCS, Sec 194-O, fulfillment hubs)
     - Professionals & Consultants (Sec 44ADA presumptive 50% profit, GST LUT)
     - NGOs & Public Trusts (Form 10A/10AB re-registrations, CSR fund audits)
  2. *Cross-Sector Compliance Matrix:* Table comparing sector, governing statute, audit threshold, and critical annual filing date.

### 4.4 `/locations` — Chambers Coordinates & Regional Corridors
- **Component:** `LocationsPage.tsx`
- **Layout & Canvas:** Wrapped in `PublicLayout`. Warm Ivory canvas.
- **Key Sections:**
  1. *Principal Chambers Dossier:* Tirupati registered chambers, geodetic coordinates, physical appointment scheduling.
  2. *4 Regional Coverage Corridors:*
     - Chennai: High Court tax appeals, Guindy/Sriperumbudur corporate audits.
     - Bengaluru: Tech venture Virtual CFO, DPIIT compliance, cross-border audit.
     - Hyderabad: Construction RERA certifications, project finance CMA data.
     - Coimbatore: Textile/engineering unit cost audits, MSME stock verification.
  3. *Pan-India Virtual Infrastructure:* Encrypted cloud document exchange, MCA V3 / ITD integration.
  4. *ICAI Regulatory Disclosure:* Formal notice under Chartered Accountants Act, 1949 clarifying that regional corridors represent active client engagement corridors, not autonomous branch offices under Section 27.

---

## 5. Practice Area & Blog Route Specifications

### 5.1 Practice Area Routes
1. `/services` — Full practice spectrum, 5 core disciplines + Virtual CFO showcase, 34 sub-service scopes, 4-stage engagement workflow.
2. 6 Dedicated Static Practice Corridors:
   - `/services/audit-assurance` (`PRAC-01`): 9 statutory audit streams (Companies Act statutory, Tax 44AB, Internal IFC, Stock, Bank Concurrent).
   - `/services/income-tax-consultant-tirupati` (`PRAC-02`): Corporate tax (115BAA), capital gains (54/54EC/JDA), faceless scrutiny defense.
   - `/services/gst-consultant-tirupati` (`PRAC-03`): GSTR-1, 3B, 9/9C reconciliation, ITC 2B matching, departmental notices.
   - `/services/company-registration-tirupati` (`PRAC-04`): Pvt Ltd, LLP, OPC incorporation, DPIIT Startup India, MCA secretarial.
   - `/services/virtual-cfo-tirupati` (`PRAC-05`): Bank CMA data, monthly MIS variance, cash flow forecasting, board advisory.
   - `/services/rera-consultant-tirupati` (`PRAC-06`): AP/TN RERA registration, quarterly returns, Form 3 CA escrow 70% certificates.
3. Dynamic Practice Area Route (`/services/:slug`):
   - Renders custom CMS services stored in Supabase `content_services`.
   - Handles `slugRedirects`: If slug was renamed in database, automatically executes 301 `<Navigate replace />`.
   - Draft & Deletion Guard: If service status is `draft` or `deleted_at != null`, immediately serves `NotFoundPage` (404).

### 5.2 Regulatory Insights Hub (`/blog`)
- **Component:** `BlogPage.tsx`
- **Design Pattern:** Image-first listing cards featuring large photographs (16:10 aspect ratio), category pill tag, article title, 3-line excerpt, publication date, reading time, and 100% clickable card overlay.
- **Search & Filter:** Live text search across 4 fields (title, excerpt, content, tags) with instant clear button (`X`), plus touch-friendly category filter pills with article counts.
- **Draft Isolation:** Calls `BlogService.getAllPosts(false)`; draft articles are strictly excluded.

### 5.3 Individual Blog Reading Experience (`/blog/:slug`)
- **Component:** `BlogArticlePage.tsx`
- **Reading Container:** Focused 65–75ch comfortable width container.
- **Features:** Cover image with error fallback, breadcrumb navigation, executive statutory summary quote box, sanitized AST Markdown renderer (`MarkdownRenderer`), author plaque with neutral `KV` monogram and CMA AIR 49 ICMAI attribution, multi-platform social share suite (Copy Link, WhatsApp, LinkedIn, Twitter/X), ICAI Code of Ethics disclaimer, and 2–3 related articles by tag matching.
- **Triple-Layer Draft Quarantine Protocol:**
  - *Layer 1 (Database):* SQL RLS policy `draft = false AND deleted_at IS NULL` prevents anonymous query retrieval.
  - *Layer 2 (Server REST):* Public `/api/content` filters out all draft articles.
  - *Layer 3 (Client Router & Adapter):* `BlogService.getPostBySlug(slug, false)` returns `undefined` for drafts. `BlogArticlePage` detects `!post` and immediately renders `<NotFoundPage />`. Direct visits to draft URLs produce a 404 response.

---

## 6. Admin Route Preservation & Security Controls

```
                                  INCOMING TRAFFIC
                                         |
               +-------------------------+-------------------------+
               |                                                   |
      Starts with /admin ?                                Starts with Secret Path ?
               |                                                   |
              YES                                                 YES
               |                                                   |
     +-------------------+                             +-----------------------+
     |   RETURN HTTP 404 |                             | Has Active ka_jwt     |
     |   NotFoundPage    |                             | HMAC-SHA256 Token?    |
     +-------------------+                             +-----------+-----------+
                                                                   |
                                                      +------------+------------+
                                                      |                         |
                                                     YES                        NO
                                                      |                         |
                                            +--------------------+    +--------------------+
                                            | Mount Admin Portal |    | Redirect to Secret |
                                            | (Overview, Enq, CMS|    | /login Page        |
                                            +--------------------+    +--------------------+
```

### Administrative Security Guardrails:
1. **Quarantine of Public `/admin`:** In `src/App.tsx` and `public/_redirects`, `/admin` and `/admin/*` map strictly to `NotFoundPage` (404), eliminating all attack surface on default paths.
2. **Secret Route Obfuscation (`VITE_ADMIN_SECRET_PATH`):**
   - Must begin with `/` and contain at least 12 high-entropy characters.
   - Banned words rejected: `admin`, `login`, `portal`, `cpanel`, `dashboard`, `root`, `kavitha`, `superuser`, `console`, `manager`, `4464654646464654`.
   - Fails closed: If unconfigured, `IS_ADMIN_CONFIGURED` is false, and admin routes are never registered.
3. **Information Leakage Prevention:**
   - Excluded from `sitemap.xml`, `robots.txt`, and footer links.
   - Production build disables source maps (`sourcemap: false` in `vite.config.ts`).
   - `/api/health`, `/api/content`, and `/api/settings` omit all secret path references.
4. **Stateless Session Token Architecture:**
   - Login issues a stateless HMAC-SHA256 token signed with `SESSION_SECRET`.
   - Stored in a production cookie: `ka_admin_session`, `HttpOnly; SameSite=Strict; Secure; Path=/`.
   - Server validates token and checks database table `revoked_tokens` and user revocation epochs, ensuring persistent session termination across restarts.

---

## 7. Transition & Cutover Strategy

### Step-by-Step Implementation Sequence:

```
[M1: Baseline & Adapter Layer] ---> [M2: Design Tokens & Shared Layout]
                                                   |
                                                   v
[M3: Wire V8 PublicLayout & 30s Homepage] <--------+
  - Step 1: Mount V8 PublicLayout in src/App.tsx
  - Step 2: Implement 7 Essential Homepage Sections in src/v8/components/home/
  - Step 3: Wire Institutional Corridors (/about, /contact, /industries, /locations)
                                                   |
                                                   v
[M4: Wire Practice Corridors & Blog Engine] <------+
  - Step 4: Wire 6 Dedicated Static Corridors & Dynamic /services/:slug
  - Step 5: Wire Blog Engine (/blog, /blog/:slug) with Triple-Layer Draft Isolation
                                                   |
                                                   v
[M5: Preserve Secret Admin Portal & Run Multi-Viewport QA]
                                                   |
                                                   v
[M6: Execute Full Test Harness (210/210 Tests) & Clean Build Validation]
```

### Rollback & Safety Boundaries:
1. **Baseline Snapshot:** `backup_v70_baseline/` holds an immutable copy of the V7.0 codebase.
2. **Isolated Tree:** All new components reside in `src/v8/`.
3. **Atomic Cutover:** If any regression occurs during testing, restoring `src/App.tsx` immediately rolls back to the V7.0 baseline within seconds.
4. **Local-Only Execution:** All work is committed locally without pushing to remote Git or deploying to remote hosting environments.
