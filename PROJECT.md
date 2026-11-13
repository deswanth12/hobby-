# Project: Kavitha & Associates — Frontend Redesign & Rebuild V8.0

## Architecture
- **Framework & Bundler**: React 18.3.1 (SPA), Vite 5.4.11, TypeScript 5.6.3 (strict mode), Tailwind CSS 3.4.16.
- **Visual Identity & Creative Direction**:
  - The Botanical Ledger brand identity.
  - Architectural editorial aesthetic influenced by Laperruta & Associates.
  - Palette: Deep Evergreen (`#071B14`), Forest Green (`#183529`), Botanical Green (`#294B39`), Antique Bronze (`#B49A64`), Warm Ivory (`#F1EBDD`), Walnut Brown (`#35271F`), Soft Sage (`#AAB4A0`), WCAG AA Dark Bronze (`#7E5E1E`).
  - Typography: Editorial serif display headlines (`Cormorant Garamond`), clean modern body sans (`Inter`).
  - Architectural composition: Asymmetric layouts, double-bezel photo frames, hairline brass dividers, architectural corner brackets, generous balanced whitespace, purposeful subtle micro-motion.
  - Explicit prohibitions: Generic AI templates, repetitive card grids, random gradients, floating disconnected decorations, and excessive animations.
- **Backend Preservation & Integration Layer**:
  - Strict preservation of existing Supabase PostgreSQL schema, tables, relationships, and RLS policies (`profiles`, `enquiries`, `content_services`, `content_faqs`, `content_posts`, `practice_settings`).
  - Strict preservation of server routes and middleware in `server/apiRouter.cjs`, `server/db.cjs`, `server/durableStorage.cjs`.
  - Zero database reset, deletion, or destructive migration.
  - Secret admin route obfuscation via `VITE_ADMIN_SECRET_PATH` (`/sec-ca-50e0e5eed471`), quarantining public `/admin` and `/admin/*` to 404.
  - Integration adapter layer connecting new frontend components to `FirmDataContext`, `BlogService`, `adminStorage`, and `/api/*`.
- **Content Security, Privacy & Regulatory Compliance**:
  - ICMAI attribution for CMA AIR 49 (All India Rank 49 in CMA Intermediate explicitly attributed to ICMAI).
  - Absolute privacy quarantine: Zero personal tax identifiers (PAN, Aadhaar), individual ICAI membership numbers, or unapproved FRNs.
  - Partner portrait quarantined without explicit consent; neutral crest monogram `KV / KA` and practice medallion used.
  - Zero fabricated testimonials, client reviews, ratings, awards, or statistics.
  - Exclusion of rejected public tax calculators and Knowledge Bank from public navigation.
  - Triple-layer blog draft protection: SQL RLS (`draft = false`), server 404 handler, and client router/service 404.

---

## Feature Inventory
Every feature from user requirements (R1–R5) and the Survey phase is mapped to a milestone:

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Baseline Isolation & Snapshot | Immutable filesystem backup in `backup_v70_baseline/` and local git reference tracking | M1 | R5, Survey |
| 2 | Backend Integration Map | Formal documentation of all 30 endpoints, schemas, RLS, and contracts in `V80_BACKEND_INTEGRATION_MAP.md` | M1 | R2, Deliverables |
| 3 | Backend Adapter Layer | Unified frontend integration adapter connecting to `FirmDataContext`, `BlogService`, `adminStorage`, `/api/*` | M1 | R2 |
| 4 | The Botanical Ledger Color System | Centralized CSS variables & Tailwind tokens: Deep Evergreen, Forest Green, Botanical Green, Antique Bronze, Warm Ivory, Walnut Brown, Soft Sage, Dark Bronze | M2 | R3 |
| 5 | Architectural Typography System | Paired Cormorant Garamond display serif & Inter sans body with CSS clamp fluid scales | M2 | R3 |
| 6 | Shared Layout Components | Reusable `PublicLayout`, sticky `Navbar`, 4-column ledger `Footer`, accessibility Skip-to-Content, scroll progress, neutral `CrestMonogram` | M2 | R1, R3, R4 |
| 7 | Reusable Form & Intake Components | `ContactForm` with honeypot (`website_fax_hp`), velocity check (>= 1500ms), input sanitization, WhatsApp URL generator | M2 | R1, R2 |
| 8 | Interaction, Loading & Error States | Accessible buttons, accordions, tabs, mobile drawer with focus trap, loading skeletons, dignified 404 `NotFoundPage`, ErrorBoundary | M2 | R1 |
| 9 | Frontend Architecture Specification | Publication of `V80_FRONTEND_ARCHITECTURE.md` and `V80_DESIGN_SYSTEM.md` | M2 | R1, R3, Deliverables |
| 10 | Homepage: 30-Second Architecture | 7 essential sections (Hero, About, Practice Areas, Professional Approach, Working Methodology, Featured Insights, Contact) | M3 | R1 |
| 11 | Homepage: Section 1 Hero | Two-column architectural composition, verified headline, supporting copy, dual CTAs, double-bezel consultation frame, credential strip | M3 | R1, R3 |
| 12 | Homepage: Section 2 Firm Introduction | Concise overview (~64 words) on Warm Ivory canvas with single clean CTA linking to `/about` | M3 | R1 |
| 13 | Homepage: Section 3 Core Practice Areas | Exactly 5 distinct practice disciplines with discipline codes, badges, icons, direct links to practice corridors | M3 | R1 |
| 14 | Homepage: Section 4 Why Choose Us | 4 verified institutional strengths (Deloitte Big 4 audit, dual CA & CMA AIR 49 ICMAI, partner supervision, ethical compliance) on Deep Evergreen canvas | M3 | R1, R4 |
| 15 | Homepage: Section 5 Working Methodology | 3 chronological steps (Assessment, Technical Execution, Ongoing Compliance) on Warm Ivory canvas | M3 | R1 |
| 16 | Homepage: Section 6 Featured Insights | Asymmetric editorial grid (1 primary 16:10 lead + 2 companions) labeled "REGULATORY INSIGHTS" with strict draft exclusion | M3 | R1 |
| 17 | Homepage: Section 7 Chambers Intake | Physical coordinates, 17-word invitation, embedded `ContactForm` with spam guards | M3 | R1 |
| 18 | Dedicated About Page (`/about`) | Institutional history, dual competence model, verified career bio of CA Kavitha Vijay, education, awards, chambers coordinates | M3 | R1, R4 |
| 19 | Dedicated Leadership Section | Verified professional profiles, career history (Deloitte, Ford, Manohar Chowdhry), neutral monogram `KV / KA` | M3 | R1, R4 |
| 20 | Dedicated Contact Page (`/contact`) | Chambers address in Bairagi Patteda, Tirupati, phone desk, email, business hours, interactive intake form, WhatsApp handoff | M3 | R1 |
| 21 | Page and Route Plan Documentation | Publication of `V80_PAGE_AND_ROUTE_PLAN.md` | M3 | R1, Deliverables |
| 22 | Services Overview Page (`/services`) | Directory of practice areas, statutory frameworks, 34 sub-service scopes, target client segments, typical engagement scenarios | M4 | R1 |
| 23 | Dedicated Service Detail Corridors | 6 dedicated static pages: `/services/audit-assurance`, `/services/income-tax-consultant-tirupati`, `/services/gst-consultant-tirupati`, `/services/company-registration-tirupati`, `/services/virtual-cfo-tirupati`, `/services/rera-consultant-tirupati` | M4 | R1 |
| 24 | Dynamic Service Detail (`/services/:slug`) | Dynamic practice area rendering for custom CMS services with statutory frameworks and FAQs | M4 | R1, R2 |
| 25 | Secondary Corridor Pages | Dedicated `/industries` and `/locations` pages maintaining existing route continuity | M4 | R1, R5 |
| 26 | Insights / Blog Hub (`/blog`) | Image-first listing cards featuring large photographs, category tags, article title, excerpt, publication date, 100% clickable card overlays, search & tag filters | M4 | R1 |
| 27 | Individual Article Reading Experience (`/blog/:slug`) | Dedicated reading experience, large cover image, heading hierarchy, executive summary, AST MarkdownRenderer, author plaque with neutral `KV` monogram, related articles, comfortable width | M4 | R1 |
| 28 | Strict Blog Draft Protection | Triple-layer draft isolation: SQL RLS, server HTTP 404, client service/route 404; public visitors cannot access drafts; zero duplicate CMS/DB | M4 | R1, R2 |
| 29 | Blog & Core Implementation Reports | Publication of `V80_BLOG_IMPLEMENTATION_REPORT.md` and `V80_IMPLEMENTATION_REPORT.md` | M4 | R1, Deliverables |
| 30 | Admin Route Preservation & Role Auth | Preserve `VITE_ADMIN_SECRET_PATH` portal, PBKDF2 auth, session tokens, CSRF protection, and public `/admin` 404 quarantine | M5 | R1, R2 |
| 31 | Multi-Viewport Visual QA & Screenshots | Actual browser screenshot captures across 320px, 390px, 768px, 1024px, 1440px, and 1920px demonstrating flawless responsive layout | M5 | R5, Deliverables |
| 32 | Security Hardening & Audit | Edge security headers, XSS sanitization, anti-CSRF, rate limiting, zero secret leakage, honeypot spam defense; publish `V80_SECURITY_REPORT.md` | M5 | R4, R5, Deliverables |
| 33 | WCAG AA Accessibility Audit | Contrast ratios (>= 4.5:1 text, >= 3:1 UI), keyboard navigation, focus management, ARIA roles, screen reader testing; publish `V80_ACCESSIBILITY_REPORT.md` | M5 | R5, Deliverables |
| 34 | Performance & Core Web Vitals Audit | LCP optimization, responsive image sizing, font display swap, clean bundling (< 4s build); publish `V80_PERFORMANCE_REPORT.md` and `V80_RESPONSIVE_QA.md` | M5 | R5, Deliverables |
| 35 | Automated Test Suite Validation | 100% pass rate on 210 existing automated tests (23 statutory + 187 E2E) with zero regressions; publish `V80_TEST_RESULTS.md` | M6 | R5, Deliverables |
| 36 | Production Build Verification | Zero errors on `npm run build`, clean TypeScript compilation (`tsc -b`), 16 canonical sitemap URLs | M6 | R5 |
| 37 | Migration & Rollback Strategy Verification | Verified local-only migration, tested rollback from `backup_v70_baseline/`, zero remote git push; publish `V80_MIGRATION_AND_ROLLBACK_REPORT.md` and `V80_IMPLEMENTATION_CHANGELOG.md` | M6 | R5, Deliverables |
| 38 | Final Acceptance Verification | Verification of all 13 required V80 markdown deliverables against user acceptance criteria | M6 | R5 |

---

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Baseline Isolation & Backend Integration Layer | Create `backup_v70_baseline/`, local git reference; implement backend adapter layer in `src/v8/adapters/`; produce `V80_BACKEND_INTEGRATION_MAP.md`; copy `PROJECT.md` to root | none | DONE |
| M2 | The Botanical Ledger Design System & Shared Components | Reusable design tokens, Tailwind config, Cormorant Garamond & Inter typography, `PublicLayout`, `Navbar`, `Footer`, `CrestMonogram`, `ContactForm`, states; produce `V80_DESIGN_SYSTEM.md` and `V80_FRONTEND_ARCHITECTURE.md` | M1 | DONE |
| M3 | Public Pages Rebuild: Homepage & Institutional Corridors | Rebuild Homepage (7 essential sections in ~30s), `/about`, Leadership, `/contact`; produce `V80_PAGE_AND_ROUTE_PLAN.md` | M2 | DONE |
| M4 | Practice Areas & Regulatory Insights (Blog Engine) | Rebuild `/services` & 6 dedicated corridors, dynamic `/services/:slug`, `/industries`, `/locations`, `/blog` hub, `/blog/:slug` reader with triple-layer draft quarantine; produce `V80_BLOG_IMPLEMENTATION_REPORT.md` and `V80_IMPLEMENTATION_REPORT.md` | M3 | DONE |
| M5 | Admin Preservation, Multi-Viewport QA & Quality Audits | Preserve secret admin portal & CMS; capture screenshots across 320px, 390px, 768px, 1024px, 1440px, 1920px; produce `V80_SECURITY_REPORT.md`, `V80_ACCESSIBILITY_REPORT.md`, `V80_PERFORMANCE_REPORT.md`, `V80_RESPONSIVE_QA.md` | M4 | DONE |
| M6 | Final Verification, Rollback Audit & Deliverables Synthesis | Validate 210/210 tests pass, clean build, rollback test, produce `V80_TEST_RESULTS.md`, `V80_MIGRATION_AND_ROLLBACK_REPORT.md`, `V80_IMPLEMENTATION_CHANGELOG.md`, verify all 13 reports | M5 | DONE |

---

## Interface Contracts

### 1. Backend Adapter Layer (`src/v8/adapters/`)
- `getFirmProfile()`: returns `FirmProfile` with verified firm coordinates, phones, emails, and credentials from `FirmDataContext`.
- `getPublishedArticles()`: calls `BlogService.getAllPosts(false)`, returning strictly published articles.
- `getArticleBySlug(slug: string)`: calls `BlogService.getPostBySlug(slug, false)`. Returns `undefined` if slug not found or is draft.
- `submitEnquiry(payload: EnquiryPayload)`: validates fields, passes through honeypot (`website_fax_hp`) and velocity check (>= 1500ms), calls `adminStorage.recordEnquiryAsync`, returns `{ success: boolean, referenceId: string, whatsappUrl: string }`.

### 2. Design System Tokens ↔ Components
- Palette Tokens:
  - Deep Evergreen: `#071B14` (dark container canvases, hero, footer, dark cards)
  - Forest Green: `#183529` (card backgrounds, elevated containers, dark badges)
  - Botanical Green: `#294B39` (accent pills, secondary badges, active borders)
  - Antique Bronze: `#B49A64` (refined accents, icons, medals, corner brackets)
  - Dark Bronze: `#7E5E1E` (WCAG AA compliant text on light surfaces >= 4.5:1)
  - Warm Ivory: `#F1EBDD` (light section canvases, about, practice areas, methodology)
  - Walnut Brown: `#35271F` (body text on ivory canvases >= 9:1 contrast)
  - Soft Sage: `#AAB4A0` (subtle borders, muted tags, secondary meta text)
- Typography Classes:
  - Display Serif: `font-serif` (`Cormorant Garamond`) with fluid clamp sizing
  - Body Sans: `font-sans` (`Inter`, `system-ui`) with 1.6 line height

### 3. Route & Component Architecture (`src/App.tsx`)
- Public Routes wrapped in `PublicLayout`:
  - `/` -> `HomePage`
  - `/about` -> `AboutPage`
  - `/services` -> `ServicesPage`
  - `/services/audit-assurance` -> `AuditAssurancePage`
  - `/services/income-tax-consultant-tirupati` -> `IncomeTaxPage`
  - `/services/gst-consultant-tirupati` -> `GSTServicesPage`
  - `/services/company-registration-tirupati` -> `CompanyRegistrationPage`
  - `/services/virtual-cfo-tirupati` -> `VirtualCFOPage`
  - `/services/rera-consultant-tirupati` -> `RERAConsultantPage`
  - `/services/:slug` -> `DynamicServiceDetailPage`
  - `/industries` -> `IndustriesPage`
  - `/locations` -> `LocationsPage`
  - `/blog` -> `BlogPage`
  - `/blog/:slug` -> `BlogArticlePage`
  - `/contact` -> `ContactPage`
  - `*` -> `NotFoundPage`
- Quarantined Route:
  - `/admin` & `/admin/*` -> `<NotFoundPage />` (404)
- Secret Admin Portal:
  - `VITE_ADMIN_SECRET_PATH` (`/sec-ca-50e0e5eed471/*`) mounts `AdminLayout` and protected admin pages.

---

## Code Layout
```
C:\kavatha ca\
├── backup_v70_baseline/          # Immutable V7.0 baseline snapshot
├── src/
│   ├── v8/                       # Clean V8.0 architectural tree
│   │   ├── components/           # Reusable V8.0 design components
│   │   │   ├── layout/           # Navbar, Footer, PublicLayout, SkipToContent
│   │   │   ├── home/             # 7 Essential Homepage sections
│   │   │   ├── forms/            # ContactForm with honeypot & velocity guards
│   │   │   ├── common/           # CrestMonogram, Badge, Button, Frame, Card
│   │   │   └── blog/             # ArticleCard, ArticleReader, MarkdownAST
│   │   ├── pages/                # V8.0 page implementations
│   │   │   ├── HomePage.tsx
│   │   │   ├── AboutPage.tsx
│   │   │   ├── ServicesPage.tsx
│   │   │   ├── ServiceDetailPage.tsx
│   │   │   ├── BlogPage.tsx
│   │   │   ├── BlogArticlePage.tsx
│   │   │   ├── ContactPage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   └── adapters/             # Backend integration adapters
│   │       ├── backendAdapter.ts
│   │       └── contentAdapter.ts
│   ├── components/               # Legacy & shared components
│   ├── pages/                    # Active route page entrypoints
│   ├── context/                  # FirmDataContext
│   ├── services/                 # adminStorage, blogService
│   ├── data/                     # firmData.ts
│   ├── lib/                      # supabase.ts
│   ├── App.tsx                   # Central router & layout configuration
│   ├── main.tsx                  # React DOM bootstrap
│   └── index.css                 # The Botanical Ledger design tokens & utility styles
├── public/
│   ├── brand/                    # CA India logos, seal medallions, monograms
│   ├── images/                   # Curated WebP photography
│   └── uploads/                  # CMS media uploads
├── tests/
│   ├── tax-calculators.test.mjs  # 23 statutory calculation tests
│   └── e2e/                      # 187 E2E tests across Tiers 1-4
└── package.json                  # Scripts and dependencies
```
