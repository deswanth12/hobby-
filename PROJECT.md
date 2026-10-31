# Project: Kavitha & Associates Luxury Editorial Redesign

## Architecture
- **Framework & Core**: React 18.3.1 (SPA), TypeScript 5.6.3 (strict), Vite 5.4.11, Tailwind CSS 3.4.16.
- **Routing**: `react-router-dom` v6.28.0 with `PublicLayout` (`Navbar`, `Outlet`, `Footer`, `FloatingWhatsApp`).
- **Design System**: Luxury Editorial Aesthetic (Primary Forest Green `#153F32`, Deep Green `#102D25`, Warm Ivory `#F5F1E8`, Pure White `#FFFFFF`, Muted Gold `#C3A66B`, Charcoal `#252B27`, Secondary Text `#747A73`, Borders `#E5E1D8`).
- **Typography**: Cormorant Garamond (headings, display serifs), Inter (body, UI, metadata, navigation), uppercase spaced tracking for metadata, responsive `clamp()` scaling.
- **Zero-Cost Edge Infrastructure**: Cloudflare Pages (`_routes.json`, `_redirects`, `_headers`), Cloudflare Pages Functions (`functions/api/auth.js`, `callback.js` for secure GitHub OAuth proxy), Sveltia CMS (`public/admin/config.yml`).
- **State & Content**: Centralized immutable practice registry in `src/data/firmData.ts`, reactive `FirmDataContext.tsx`, and Markdown CMS posts in `content/posts/`.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Dedicated Git Redesign Branch | Create `redesign/editorial-luxury` branch, preserving uncommitted files and forbidding automatic pushes | M1 | ORIGINAL_REQUEST §R5 |
| 2 | Luxury Editorial Color Tokens | Implement palette: `#153F32`, `#102D25`, `#F5F1E8`, `#FFFFFF`, `#C3A66B`, `#252B27`, `#747A73`, `#E5E1D8` in `tailwind.config.js` | M1 | ORIGINAL_REQUEST §R1 |
| 3 | Editorial Typography & Clamp Scales | Integrate Cormorant Garamond & Inter with responsive clamp() scaling in `index.html`, Tailwind, and `src/index.css` | M1 | ORIGINAL_REQUEST §R1 |
| 4 | Editorial Utility Classes & Micro-Physics | Refine `.card-tactile`, `.btn-tactile`, editorial borders, bento grids, and `@media (prefers-reduced-motion)` | M1 | ORIGINAL_REQUEST §R1 |
| 5 | Package.json Test Script | Add `"test": "node tests/e2e/run-e2e.mjs"` to package.json | M1 | Survey Finding |
| 6 | Site-Wide Navigation Header | Redesign `Navbar.tsx` with top utility strip, verified phone/email, monogram badge, responsive drawer, keyboard accessibility | M2 | ORIGINAL_REQUEST §R1, §R2.1 |
| 7 | Site-Wide Editorial Footer | Redesign `Footer.tsx` with verified CA credentials, practice columns, regional corridor badges, and verbatim ICAI disclaimer | M2 | ORIGINAL_REQUEST §R1, §R2.1, §R3 |
| 8 | Homepage Hero & Practice Plaque | Redesign hero section with Cormorant Garamond typography and double-bezel practice credentials plaque | M2 | ORIGINAL_REQUEST §R1, §R2.1 |
| 9 | Homepage Audit Spotlight & Services | Asymmetric audit assurance showcase and structured service spectrum on homepage | M2 | ORIGINAL_REQUEST §R1, §R2.1 |
| 10 | Homepage Governance & Philosophy | Dual CA+CMA advantage, partner profile preview, and ICAI ethical standards section | M2 | ORIGINAL_REQUEST §R1, §R2.1, §R3 |
| 11 | Homepage Industries & Geographic Reach | 10 industry profiles summary and 5-location footprint showcase | M2 | ORIGINAL_REQUEST §R1, §R2.1 |
| 12 | Homepage Statutory FAQ & Consultation CTA | Accordion FAQ and consultation intake section with embedded ContactForm | M2 | ORIGINAL_REQUEST §R1, §R2.1, §R4 |
| 13 | About Page Redesign | Complete `/about` with verified bio for CA Kavitha Vijay (ICAI Mem. [REDACTED_MEMBERSHIP_NO], B.Com, CA, CMA AIR 49, Deloitte/Ford/MCA, Move/Live the Dot awards) | M3 | ORIGINAL_REQUEST §R2.2, §R3 |
| 14 | Services Page Redesign | Complete `/services` with 5 practice areas, 34 services, and statutory citations | M3 | ORIGINAL_REQUEST §R2.2 |
| 15 | Audit Spotlight Page Redesign | Complete `/services/audit-assurance` with 9 statutory audit streams and ICAI auditing standards | M3 | ORIGINAL_REQUEST §R2.2 |
| 16 | Industries Page Redesign | Complete `/industries` with 10 detailed sector profiles, regulatory focal points, and tax benefits | M3 | ORIGINAL_REQUEST §R2.2 |
| 17 | Locations Page Redesign | Complete `/locations` with Tirupati principal chambers (GPS: 13°37'09.3"N 79°25'04.9"E) and 4 regional corridors | M3 | ORIGINAL_REQUEST §R2.2 |
| 18 | Blog Listing Page Redesign | Complete `/blog` with editorial cards, search, category pills, reading time, and published post isolation | M4 | ORIGINAL_REQUEST §R2.2, §R4 |
| 19 | Blog Article Page Redesign | Complete `/blog/:slug` with breadcrumbs, hero header, author bio card, social sharing, and related articles | M4 | ORIGINAL_REQUEST §R2.2 |
| 20 | Pure React Markdown Renderer | Retain zero-dangerouslySetInnerHTML virtual DOM markdown renderer in `MarkdownRenderer.tsx` | M4 | Survey Finding |
| 21 | Strict 4-Layer Draft Quarantine | Quarantines drafts across BlogService, listing page, `/blog/:slug` 404 fallback, and sitemap generation | M4 | ORIGINAL_REQUEST §R4 |
| 22 | Blog Component Re-Export / Alias | Ensure `src/pages/BlogPostPage.tsx` re-exports `BlogArticlePage.tsx` for E2E test harness compatibility | M4 | Survey Finding |
| 23 | Bespoke Editorial 404 Page | Redesign `NotFoundPage.tsx` (`*`) with directory recovery grid, search links, and assistance contacts | M4 | ORIGINAL_REQUEST §R2.2 |
| 24 | Client Data & Name Uniformity | Align all occurrences of partner name to verified `CA Kavitha Vijay` across `firmData.ts`, `index.html`, and `about.json` | M5 | ORIGINAL_REQUEST §R3 |
| 25 | Contact Form Submission Mechanism | Honeypot field, 1500ms velocity check, local enquiry registration (`ENQ-...`), instant WhatsApp handoff | M5 | ORIGINAL_REQUEST §R4 |
| 26 | WhatsApp Integration & Deep Links | Floating widget and button links with verified phone `+91 96263 50900` and prefilled message templates | M5 | ORIGINAL_REQUEST §R4 |
| 27 | Sveltia CMS & Edge Auth Security | Verify `public/admin/config.yml`, `functions/api/auth.js`, `callback.js` with fail-closed user whitelist | M5 | ORIGINAL_REQUEST §R4 |
| 28 | Cloudflare Pages Routing & Headers | Verify `_routes.json`, `_redirects`, and `_headers` (HSTS, strict CSP without unsafe-eval, 1-yr asset cache) | M5 | ORIGINAL_REQUEST §R4 |
| 29 | Comprehensive SEO & JSON-LD | Update `SEOHead.tsx` with `og:type` support, Schema.org `BlogPosting` JSON-LD, sitemap generator with 11 URLs | M5 | ORIGINAL_REQUEST §R4 |
| 30 | E2E Test Suite 100% Pass (Tiers 1-4) | Resolve fixture mismatches and pass all 167 tests in `tests/e2e/run-e2e.mjs` | M6 | ORIGINAL_REQUEST §R5 |
| 31 | Challenger Security Suites 100% Pass | Pass all 528 assertions across 5 challenger security and stress test harnesses | M6 | Survey Finding |
| 32 | TypeScript & Production Build Verification | Zero errors in `tsc -b` and `npm run build` | M6 | ORIGINAL_REQUEST Acceptance Criteria |
| 33 | Accessibility & Responsive Viewport Audit | Audit WCAG contrast, keyboard navigation, focus indicators, and 375px/768px/1280px+ viewports without overflow | M6 | ORIGINAL_REQUEST Acceptance Criteria |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Git Branch & Luxury Editorial Design System Foundation | Features 1, 2, 3, 4, 5 | none | DONE |
| M2 | Navigation, Footer & Homepage Redesign (`/`) | Features 6, 7, 8, 9, 10, 11, 12 | M1 | DONE |
| M3 | Core Practice & Firm Public Routes Redesign | Features 13, 14, 15, 16, 17 | M2 | DONE |
| M4 | Editorial Blog Engine, Article Experience & 404 Route | Features 18, 19, 20, 21, 22, 23 | M2, M3 | DONE |
| M5 | Integrations, Data Alignment, WhatsApp, CMS & SEO | Features 24, 25, 26, 27, 28, 29 | M3, M4 | DONE |
| M6 | Full Test Suite Pass & Production Validation | Features 30, 31, 32, 33 | M5 | IN_PROGRESS |

## Interface Contracts
### Design Tokens ↔ Component Layer
- Color tokens exported in `tailwind.config.js`:
  - `brand-forest`: `#153F32`
  - `brand-deep`: `#102D25`
  - `brand-ivory`: `#F5F1E8`
  - `brand-white`: `#FFFFFF`
  - `brand-gold`: `#C3A66B`
  - `brand-charcoal`: `#252B27`
  - `brand-muted`: `#747A73`
  - `brand-border`: `#E5E1D8`
- Font families:
  - `font-serif`: `"Cormorant Garamond", Georgia, serif`
  - `font-sans`: `"Inter", system-ui, sans-serif`

### Data Layer ↔ Page Components
- `src/data/firmData.ts` provides immutable constants:
  - `FIRM_DETAILS`: verified firm name, registration details, lead partner (`CA Kavitha Vijay`).
  - `AUDIT_SERVICES`: 9 statutory audit streams.
  - `PRACTICE_AREAS`: 5 practice categories (34 services).
  - `INDUSTRIES`: 10 industry profiles.
  - `LOCATIONS`: 1 principal practice center (Tirupati) + 4 regional coverage hubs.
  - `FAQS`: 6 statutory compliance questions with legal citations.

### Blog Service ↔ Markdown Rendering
- `src/services/blogService.ts`:
  - `getAllPosts(includeDrafts: boolean = false): BlogPost[]`
  - `getPostBySlug(slug: string, includeDrafts: boolean = false): BlogPost | undefined`
- `src/components/MarkdownRenderer.tsx`:
  - Props: `{ content: string }`
  - Output: Pure React JSX virtual DOM nodes (Zero raw HTML).

### Form Service ↔ Inquiries & WhatsApp
- `src/components/ContactForm.tsx`:
  - Honeypot: `<input name="website_fax_hp" ... tabIndex={-1} />`
  - Timing check: `Date.now() - formMountedAt >= 1500`
  - Storage: `adminStorage.recordEnquiryAsync(payload)` -> returns `referenceId: "ENQ-..."`
  - WhatsApp redirect: `https://wa.me/919626350900?text=${encodeURIComponent(brief)}`

## Code Layout
- `src/data/firmData.ts`: Central verified client data repository.
- `src/components/`: Reusable UI components (`Navbar.tsx`, `Footer.tsx`, `SEOHead.tsx`, `ContactForm.tsx`, `FloatingWhatsApp.tsx`, `MarkdownRenderer.tsx`, `KnowledgeFAQ.tsx`).
- `src/pages/`:
  - `HomePage.tsx` (`/`)
  - `AboutPage.tsx` (`/about`)
  - `ServicesPage.tsx` (`/services`)
  - `AuditAssurancePage.tsx` (`/services/audit-assurance`)
  - `IndustriesPage.tsx` (`/industries`)
  - `LocationsPage.tsx` (`/locations`)
  - `BlogPage.tsx` (`/blog`)
  - `BlogArticlePage.tsx` (`/blog/:slug`) & `BlogPostPage.tsx` (alias)
  - `ContactPage.tsx` (`/contact`)
  - `NotFoundPage.tsx` (`*`)
- `tailwind.config.js` & `src/index.css`: Design system definitions.
- `content/posts/`: Markdown articles with frontmatter.
- `content/sections/`: Sveltia CMS JSON singleton files.
- `public/`: Static assets, `_routes.json`, `_redirects`, `_headers`, `robots.txt`, and `admin/`.
- `functions/api/`: Cloudflare Pages Functions (`auth.js`, `callback.js`).
- `tests/`: Automated E2E runner (`tests/e2e/run-e2e.mjs`) and 5 challenger test suites.
