# V80 Frontend Architecture & Implementation Specification

**Target Platform:** Kavitha & Associates — Chartered Accountants  
**Document Classification:** Frontend System Architecture & Engineering Contract  
**Version:** 8.0.0  
**Status:** Approved Specification  
**Milestone:** M2 (Frontend Architecture Specification)  
**Working Directory:** `C:\kavatha ca`  

---

## 1. Technical Stack & Architectural Principles

The V8.0 frontend architecture rebuilds the user interface from scratch as a production-grade Single Page Application (SPA), while strictly interfacing with the preserved Supabase backend and durable fallback store.

### 1.1 Core Technology Stack
- **Framework & Runtime:** React 18.3.1 (SPA)
- **Language:** TypeScript 5.6.3 (strict mode, zero implicit `any`)
- **Build Tool & Bundler:** Vite 5.4.11
- **Styling Architecture:** Tailwind CSS 3.4.16 + Custom CSS Variables
- **Routing Engine:** React Router DOM 6.28.0
- **Iconography:** Lucide React 1.16.0
- **Backend SDK:** `@supabase/supabase-js` 2.118.0

### 1.2 Core Architectural Principles
1. **Isolated Implementation Area (`src/v8/`):** All new components, pages, and adapters reside under `src/v8/`, preventing unintended regressions in legacy code during rebuild.
2. **Adapter-Driven Backend Communication:** Frontend components never call Supabase or `/api/*` directly; all data and mutations flow through strongly typed adapters in `src/v8/adapters/`.
3. **Triple-Layer Draft Quarantine:** Blog articles marked `draft = true` are quarantined across Database RLS, Server 404 handler, and Client route/adapter guards.
4. **Strict Regulatory Compliance:** Zero personal tax identifiers, individual ICAI membership numbers, or unapproved FRNs. ICMAI attribution for CMA AIR 49 is enforced.

---

## 2. Component Hierarchy & Directory Architecture under `src/v8/`

```
src/v8/
├── adapters/
│   ├── backendAdapter.ts        # Unified firm data, enquiry intake, anti-spam, and WhatsApp URL
│   └── contentAdapter.ts        # Draft-isolated blog engine, 6 practice corridors, FAQs
├── components/
│   ├── layout/
│   │   ├── PublicLayout.tsx     # Global public wrapper (ScrollProgress, Navbar, Footer, SkipToContent)
│   │   ├── Navbar.tsx           # Sticky navigation, active links, services dropdown, mobile drawer
│   │   ├── Footer.tsx           # 4-column ledger footer with verified firm credentials
│   │   ├── SkipToContent.tsx    # WCAG accessible bypass anchor (#main-content)
│   │   ├── ScrollProgress.tsx   # Top 3px scroll percentage indicator
│   │   ├── BackToTop.tsx        # Bottom-left floating back-to-top button
│   │   └── FloatingWhatsApp.tsx # Fixed bottom-right WhatsApp quick-consultation desk
│   ├── home/
│   │   ├── HeroSection.tsx              # Section 1: Asymmetric 7:5 hero with practice registry
│   │   ├── FirmIntroSection.tsx         # Section 2: Concise institutional overview (~64 words) + CTA
│   │   ├── PracticeAreasSection.tsx     # Section 3: Exactly 5 core disciplines (PRAC-01 to PRAC-05)
│   │   ├── WhyChooseUsSection.tsx       # Section 4: Exactly 4 factual institutional strengths
│   │   ├── MethodologySection.tsx       # Section 5: Exactly 3 chronological workflow steps
│   │   ├── FeaturedInsightsSection.tsx  # Section 6: Asymmetric editorial grid (1 lead + 2 companions)
│   │   └── ChambersIntakeSection.tsx    # Section 7: Tirupati coordinates + ContactForm
│   ├── forms/
│   │   ├── ContactForm.tsx      # Multi-field intake with honeypot & velocity guards
│   │   ├── FormInput.tsx        # Accessible styled text/email/tel inputs
│   │   ├── FormSelect.tsx       # Styled dropdown for entity types & service categories
│   │   └── FormTextarea.tsx     # Accessible styled requirement brief textarea
│   ├── common/
│   │   ├── CrestMonogram.tsx    # Neutral KV/KA crest medallion replacing partner portrait
│   │   ├── Badge.tsx            # Editorial gold, forest, and neutral badges
│   │   ├── Button.tsx           # Tactile pill buttons (primary, secondary, dual-arrow)
│   │   ├── ArchitecturalFrame.tsx # Architectural double-perimeter frame for photography
│   │   ├── Accordion.tsx        # Accessible disclosure accordion with ARIA attributes
│   │   ├── Tabs.tsx             # Accessible tab switcher with keyboard navigation
│   │   ├── LoadingSkeleton.tsx  # Shimmer loading skeleton variants
│   │   ├── ErrorBoundary.tsx    # Dignified React error boundary fallback
│   │   └── NotFoundPage.tsx     # 404 recovery portal with directory navigation
│   └── blog/
│       ├── ArticleCard.tsx      # Image-first card (large photo, tag, title, excerpt, 100% overlay)
│       ├── ArticleReader.tsx    # Comfortable 65–75ch single-column reading container
│       ├── ArticleHeader.tsx    # Cover image, title, date, reading time, author plaque
│       ├── MarkdownAST.tsx      # Sanitized AST markdown renderer
│       ├── AuthorPlaque.tsx     # Partner author box with neutral monogram
│       ├── RelatedArticles.tsx  # 2–3 related articles by tag matching
│       └── TagFilter.tsx        # Blog category pill filtering bar
└── pages/
    ├── HomePage.tsx             # 30-second comprehensive overview (7 sections)
    ├── AboutPage.tsx            # Institutional history, dual competence model, verified career bio
    ├── ServicesPage.tsx         # Directory of practice areas & 34 sub-service scopes
    ├── ServiceDetailPage.tsx    # Dedicated static corridors + dynamic CMS services
    ├── IndustriesPage.tsx       # Sector expertise directory
    ├── LocationsPage.tsx        # Chambers coordinates & pan-India client coverage
    ├── BlogPage.tsx             # Regulatory Insights hub with search and category tags
    ├── BlogArticlePage.tsx      # Dedicated article reading experience (draft-quarantined)
    ├── ContactPage.tsx          # Dedicated intake & consultation desk
    └── NotFoundPage.tsx         # Dignified 404 handler with statutory recovery links
```

---

## 3. Routing Architecture & Route Protection Contracts

### 3.1 Public Routes (Wrapped in `PublicLayout`)
```typescript
<Route element={<PublicLayout />}>
  <Route path="/" element={<HomePage />} />
  <Route path="/about" element={<AboutPage />} />
  <Route path="/services" element={<ServicesPage />} />
  <Route path="/services/audit-assurance" element={<ServiceDetailPage corridorId="audit-assurance" />} />
  <Route path="/services/income-tax-consultant-tirupati" element={<ServiceDetailPage corridorId="income-tax" />} />
  <Route path="/services/gst-consultant-tirupati" element={<ServiceDetailPage corridorId="gst" />} />
  <Route path="/services/company-registration-tirupati" element={<ServiceDetailPage corridorId="corporate-business" />} />
  <Route path="/services/virtual-cfo-tirupati" element={<ServiceDetailPage corridorId="advisory-consulting" />} />
  <Route path="/services/rera-consultant-tirupati" element={<ServiceDetailPage corridorId="rera-compliance" />} />
  <Route path="/services/:slug" element={<ServiceDetailPage />} />
  <Route path="/industries" element={<IndustriesPage />} />
  <Route path="/locations" element={<LocationsPage />} />
  <Route path="/blog" element={<BlogPage />} />
  <Route path="/blog/:slug" element={<BlogArticlePage />} />
  <Route path="/contact" element={<ContactPage />} />
  <Route path="*" element={<NotFoundPage />} />
</Route>
```

### 3.2 Quarantined Legacy Admin Routes
Public probing of legacy admin paths is strictly quarantined to return a 404:
```typescript
<Route path="/admin" element={<NotFoundPage />} />
<Route path="/admin/*" element={<NotFoundPage />} />
```

### 3.3 Obfuscated Secret Admin Console
The administrative management console is code-split and mounts strictly at `VITE_ADMIN_SECRET_PATH` (`/sec-ca-50e0e5eed471/*`):
```typescript
{IS_ADMIN_CONFIGURED && (
  <>
    <Route path={ADMIN_ROUTES.login} element={<React.Suspense fallback={<AdminFallback />}><AdminLoginPage /></React.Suspense>} />
    <Route path={ADMIN_ROUTES.root} element={<AdminProtectedRoute><React.Suspense fallback={<AdminFallback />}><AdminOverviewPage /></React.Suspense></AdminProtectedRoute>} />
    <Route path={ADMIN_ROUTES.enquiries} element={<AdminProtectedRoute><React.Suspense fallback={<AdminFallback />}><AdminEnquiriesPage /></React.Suspense></AdminProtectedRoute>} />
    <Route path={ADMIN_ROUTES.content} element={<AdminProtectedRoute><React.Suspense fallback={<AdminFallback />}><AdminContentPage /></React.Suspense></AdminProtectedRoute>} />
    <Route path={ADMIN_ROUTES.settings} element={<AdminProtectedRoute><React.Suspense fallback={<AdminFallback />}><AdminSettingsPage /></React.Suspense></AdminProtectedRoute>} />
  </>
)}
```

---

## 4. State Management & Adapter Consumption

### 4.1 Reactive Firm Profile State
`FirmDataContext` provides firm coordinates, telephone desks, email channels, and verified credentials across the component tree:
```typescript
const { data: FIRM_DATA, isModified } = useFirmData();
```
Automatically synchronizes with remote overrides on mount and listens for `ka_firm_data_updated` custom events.

### 4.2 Consultation Intake Submission (`backendAdapter.ts`)
```typescript
const result = await submitEnquiry({
  fullName: "Client Name",
  phone: "+91 9876543210",
  email: "client@example.com",
  message: "Statutory audit requirement brief",
  serviceCategory: "Audit & Assurance",
  website_fax_hp: "",       // Honeypot field (must be empty)
  formLoadedAt: 1731223200000 // Velocity check (Date.now())
});

if (result.success) {
  // Navigate to confirmation or offer WhatsApp click-to-chat
  window.open(result.whatsappUrl, '_blank');
}
```

### 4.3 Content & Draft Isolation (`contentAdapter.ts`)
```typescript
// Homepage Section 6: Excludes drafts 100%
const { leadArticle, companionArticles } = getFeaturedInsights();

// Blog Article Reader: Returns undefined if article is a draft
const article = getArticleBySlug(slug);
if (!article) {
  return <NotFoundPage />;
}
```

### 4.3 Client Intake State Machine & Lifecycle Transitions

To enforce anti-spam validation and predictable user feedback, `ContactForm.tsx` implements a deterministic finite state machine (FSM):

```
+-----------------------------------------------------------------------------------------+
|                               INTAKE FORM FINITE STATE MACHINE                           |
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|       [ MOUNT ] ----> ( IDLE / CLEAN )                                                  |
|                              |                                                          |
|                    User types in field                                                  |
|                              v                                                          |
|                       ( DIRTY / EDITING ) <-------------------+                         |
|                              |                                |                         |
|                    User clicks Submit                         | Validation error        |
|                              v                                | (e.g. invalid phone/GST)|
|                   [ CLIENT FIELD VALIDATION ] ----------------+                         |
|                              |                                                          |
|                        Fields Valid                                                     |
|                              v                                                          |
|                 [ VELOCITY & HONEYPOT AUDIT ]                                           |
|                     /                   \                                               |
|       Time < 1500ms / HP set             Time >= 1500ms & HP clean                      |
|                   /                       \                                             |
|                  v                         v                                            |
|       ( TRAPPED / DISCARDED )          ( DISPATCHING / SUBMITTING )                     |
|       * Fake HTTP 200 returned                 |                                        |
|       * 0 DB insertion                Network request to /api/enquiries                 |
|                                       or durable local JSON store                       |
|                                                |                                        |
|                                     +----------+----------+                             |
|                                     |                     |                             |
|                                  Success                Failure                         |
|                                     v                     v                             |
|                             ( PERSISTED / OK )     ( ERROR / RETRYABLE )                |
|                             * Reset form           * Display user-safe error            |
|                             * Reveal WhatsApp CTA  * Enable retry button                |
|                             * Provide Reference ID                                      |
+-----------------------------------------------------------------------------------------+
```

State transitions are modeled using strictly typed action discriminators, preventing duplicate submissions via a disabled button invariant while `status === 'submitting'`.

---

## 5. Accessibility (a11y) Architecture

1. **Skip to Main Content:** Accessible link anchored at `#main-content`, visible on keyboard focus.
2. **High-Contrast Focus Indicators:** `:focus-visible` sets a 2px outline with 3px offset in `#B49A64` (Antique Bronze) or `#153F32` (Forest Green).
3. **Keyboard Focus Trapping:** Mobile navigation drawer traps keyboard Tab cycles between first and last focusable elements; dismissed immediately via `Escape`.
4. **Body Scroll Locking:** Opening modal drawers locks `document.body.style.overflow = 'hidden'` and `touchAction = 'none'`.
5. **Screen Reader Semantics:**
   - Decorative icons and visual SVGs set `aria-hidden="true"`.
   - Meaningful status badges include descriptive text.
   - Heading hierarchy strictly follows `h1` -> `h2` -> `h3` -> `h4` with zero skipped levels.
6. **Windows High Contrast Mode:** `@media (forced-colors: active)` rules preserve visible borders on cards, buttons, and form inputs.
7. **ARIA Live Region Management & Focus Recovery:** Dynamic form errors and confirmation messages announce immediately to screen readers via an isolated `<div aria-live="polite" aria-atomic="true">` wrapper. When the mobile navigation drawer closes, focus is deterministically restored to the hamburger toggle trigger button via React refs, preventing keyboard navigation disorientation.

---

## 6. Performance & Core Web Vitals Strategy

1. **Code Splitting & Lazy Loading:**
   - Admin routes and large modules are split into asynchronous chunks (`React.lazy`).
   - Core public bundle size targets < 120KB gzipped.
2. **Largest Contentful Paint (LCP) Optimization (< 2.5s):**
   - Hero photography uses modern WebP format (`hero-consultation.webp`).
   - Image includes explicit `width="1376"` and `height="768"`.
   - Preloaded with `loading="eager"` and `fetchpriority="high"`.
3. **Cumulative Layout Shift (CLS = 0):**
   - Aspect ratio boxes (`aspect-[16/9]`, `aspect-[16/10]`) reserve exact layout dimensions prior to image network download.
   - Web fonts utilize `font-display: swap` with calibrated size-adjust fallback metrics.
4. **Interaction to Next Paint (INP < 200ms):**
   - Scroll and resize event handlers are strictly passive (`{ passive: true }`).
   - Expensive keyframe rotations pause automatically when scrolled offscreen via `IntersectionObserver`.
5. **Vite Bundle Chunking Topology & Module Graph Analysis:**
   - Manual chunking in `vite.config.ts` isolates third-party frameworks from application code:
     - `vendor-react`: Bundles `react`, `react-dom`, and `react-router-dom` (69.77 kB Gzip).
     - `vendor-supabase`: Bundles `@supabase/supabase-js` (58.97 kB Gzip).
     - `index`: Core public SPA bundle (114.62 kB Gzip).
     - Admin chunks (`AdminLoginPage`, `AdminLayout`, `AdminOverviewPage`, `AdminEnquiriesPage`, `AdminSettingsPage`, `AdminContentPage`): Loaded dynamically via `React.lazy` only upon accessing the high-entropy route `/sec-ca-50e0e5eed471/*`.
   - Result: Public visitors download only 141.64 kB Brotli compressed assets on first load, eliminating administrative code parsing overhead entirely.

---

## 7. Testing & Quality Assurance Plan

1. **Automated Test Suite (Regression-Free Gate):**
   - Full pass on 23 statutory calculation tests (`node tests/tax-calculators.test.mjs`).
   - Full pass on 187 E2E tests across Tiers 1–4 (`node tests/e2e/run-e2e.mjs`).
2. **Adapter Contract Suite:**
   - 39 assertions in `tests/v8-adapters.test.mjs` verifying anti-spam, draft quarantine, and corridor resolution.
3. **Multi-Viewport Visual QA:**
   - Layout testing across 6 viewports: 320px (iPhone SE), 390px (iPhone 14), 768px (iPad Mini), 1024px (iPad Pro), 1440px (Desktop), 1920px (Full HD).
   - Zero horizontal overflow (`scrollWidth <= clientWidth`).
4. **Production Build Validation:**
   - Clean compilation via `tsc -b` with zero TypeScript errors.
   - Clean Vite production packaging via `npm run build`.

---

## 8. Migration, Rollback & Boundary Defense

1. **Recoverable Baseline:** The V7.0 baseline snapshot is immutably archived in `backup_v70_baseline/`.
2. **Zero Destructive DB Mutations:** The Supabase database schemas, tables, RLS policies, and data remain completely untouched.
3. **Local Repository Execution:** All development, testing, and report generation execute strictly on the local machine; zero Git push to remote and zero remote deployment.
4. **Route Fallback & Edge Hydration Resilience:** In the event of a client-side JavaScript execution anomaly, the Express server and edge redirect rules fallback cleanly to standard HTTP status codes, serving `index.html` with pre-rendered OpenGraph metadata and JSON-LD schemas to preserve search crawler indexing.

