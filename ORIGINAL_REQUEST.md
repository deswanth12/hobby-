# Original User Request

## Initial Request — 2026-10-30T01:36:25Z

Team: a world-class digital agency consisting of Creative Director, Senior UI/UX Designer, Brand Identity Designer, Senior React Engineer, Frontend Architect, Accessibility Specialist, Technical SEO Engineer, Performance Engineer, and QA Engineer. Completely redesign the existing Kavitha & Associates Chartered Accountancy website into a distinctive, premium, luxury editorial-style professional-services website for production, delivering a completely new visual identity while preserving existing architecture, functionality, and verified client data.

Working directory: c:\kavitha ca
Integrity mode: development

Repository: https://github.com/deswanth12/hobby-

## Requirements

### R1. Luxury Editorial Design System & Brand Identity
Establish and implement a luxury editorial visual identity across the website. Use the defined palette (Primary forest green #153F32, Deep green #102D25, Warm ivory #F5F1E8, Pure white #FFFFFF, Muted gold #C3A66B accent, Charcoal #252B27, Secondary text #747A73, Borders #E5E1D8), editorial typography (Cormorant Garamond or equivalent editorial serif for headings, Inter or clean sans-serif for body, restrained sans-serif for navigation, uppercase spaced labels for metadata, responsive scales via clamp()), generous whitespace, editorial asymmetry, responsive grid systems, and distinct section compositions. Avoid generic SaaS landing page layouts, repetitive 3-column cards, excessive gradients, glassmorphism, floating decorative elements, overused animations, oversized rounded cards, unnecessary badges, fake statistics, fake testimonials, fake awards, invented qualifications, and unsupported marketing claims.

### R2. Phased Route Redesign
Execute the route redesign in structured sequence:
1. Complete and review the Homepage (`/`) and site-wide navigation/footer before applying the design system across other pages.
2. Redesign all remaining public routes with bespoke, editorial-grade compositions:
   - About page (`/about`)
   - Services page (`/services`)
   - Audit Spotlight page (`/services/audit-assurance`)
   - Industries page (`/industries`)
   - Locations page (`/locations`)
   - Blog listing page (`/blog`)
   - Blog article page (`/blog/:slug`)
   - Contact page (`/contact`)
   - 404 page (`*`)

### R3. Client Data & Professional Credibility Preservation
Preserve all supplied details for CA Kavitha Vijay exactly: ICAI Mem. 252985, B.Com, CA, CMA AIR 49, 10+ Years experience across Deloitte, Ford Motor Company, Manohar Chowdhry & Associates, Move the Dot & Live the Dot awards, and Tirupati chambers. Cross-check every credential, award, and employment claim against client-approved records in the repository before publication. Do not invent, alter, or embellish any professional credentials, firm history, or client representations.

### R4. Functional Preservation & Integrations
Preserve and verify all existing functionality with zero recurring hosting costs:
- Contact form: Preserve the existing working submission mechanism or document any external service required; static hosting does not automatically provide form handling.
- CMS: Verify Sveltia CMS authentication and GitHub backend compatibility with Cloudflare Pages (`public/admin/config.yml`), ensuring secure authentication rather than assuming configuration alone provides it.
- WhatsApp integration: Verify button and links initiate chat with correct phone number and prefilled message.
- Blog functionality: Verify frontmatter markdown parsing and strict draft quarantine (drafts excluded from public routes, feeds, and sitemaps).
- Cloudflare Pages configuration: Maintain routing and header rules (`_routes.json`, `_redirects`, `_headers`).
- SEO: Preserve and verify metadata, canonical links, Open Graph tags, sitemap.xml, and robots.txt.

### R5. Architecture Preservation & Git Integrity
Work directly inside the existing project (`c:\kavitha ca`). Do not interpret "complete redesign" as permission to rewrite the entire architecture. Maintain the existing React, Vite, and Tailwind CSS architecture. Work on a dedicated redesign branch, preserve any uncommitted user changes, and avoid automatic pushes or rewriting Git history. Discover and execute all actual test files in the project rather than relying on assumed assertion numbers.

## Implementation Sequence
1. **Repository Audit**: Inspect the entire project, Git status, working tree, routes, assets, components, and test suites.
2. **Design System**: Implement the approved palette, Cormorant Garamond, Inter, spacing, typography, and responsive layout foundations.
3. **Homepage Redesign**: Complete and review the homepage and navigation/footer before propagating across other pages.
4. **All Remaining Routes**: Redesign About, Services, Audit, Industries, Locations, Blog, Articles, Contact, and 404.
5. **Integrations**: Restore and verify forms, WhatsApp, CMS auth, Cloudflare configuration, and SEO.
6. **Production Validation**: Run TypeScript compilation, production build, all discovered automated tests, accessibility checks, and responsive viewport tests.

## Acceptance Criteria

### Visual Design & Typography
- [ ] Visual identity adheres to the specified luxury editorial palette (Primary forest green #153F32, Deep green #102D25, Warm ivory #F5F1E8, Pure white #FFFFFF, Muted gold #C3A66B accent, Charcoal #252B27, Borders #E5E1D8).
- [ ] Heading typography uses Cormorant Garamond (or verified high-quality editorial serif) and body text uses Inter (or clean sans-serif) with responsive clamp() scaling.
- [ ] Section layouts avoid generic SaaS templates, repetitive 3-column cards, floating decorative elements, excessive glassmorphism, and oversized rounded cards.
- [ ] Typography and layouts render legibly without horizontal overflow across mobile (375px), tablet (768px), and desktop (1280px+) viewports.

### Route Coverage & Content Integrity
- [ ] Homepage and navigation/footer are completed and validated first, followed by all remaining routes (`/about`, `/services`, `/services/audit-assurance`, `/industries`, `/locations`, `/blog`, `/blog/:slug`, `/contact`, `*`).
- [ ] Verified profile data for CA Kavitha Vijay (ICAI Mem. 252985, B.Com, CA, CMA AIR 49, 10+ years experience, Deloitte / Ford / Manohar Chowdhry background, Move/Live the Dot awards, Tirupati chambers) is verbatim accurate and cross-checked against client-approved records.
- [ ] No fake testimonials, fake awards, fake statistics, or invented credentials exist on any page.

### Functional Preservation & Integrations
- [ ] Contact form submission mechanism is verified and operational, or required external service is clearly documented.
- [ ] Sveltia CMS authentication and GitHub backend compatibility with Cloudflare Pages are verified.
- [ ] WhatsApp integration button/links initiate chat with correct phone number and prefilled message.
- [ ] Blog markdown articles parse frontmatter correctly, and draft posts remain strictly quarantined from public listings, feeds, and sitemaps.
- [ ] Cloudflare Pages routing and headers (`_routes.json`, `_redirects`, `_headers`) and CMS configuration (`public/admin/config.yml`) remain intact and functional.
- [ ] SEO tags (title, meta description, canonical link, Open Graph) are present and accurate on all routes.

### Codebase, Build & Automated Verification
- [ ] Work is performed on a dedicated redesign branch; uncommitted changes are preserved and no automatic pushes occur.
- [ ] Existing project architecture is preserved without unnecessary full rewrites.
- [ ] All actual test files in the project are discovered and executed, passing with zero failures.
- [ ] TypeScript check (`tsc -b`) compiles with zero errors.
- [ ] Production build (`npm run build`) succeeds with zero errors.
- [ ] Interactive elements support keyboard navigation and pass accessibility contrast/focus requirements.
