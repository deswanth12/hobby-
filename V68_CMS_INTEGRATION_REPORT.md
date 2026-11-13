# V6.8 CMS Integration & Content Governance Report

**Project:** Kavitha & Associates, Chartered Accountants  
**Working Directory:** `C:\kavatha ca`  
**Date:** November 2026  
**Author:** Lead Full-Stack & CMS Systems Engineer  
**Scope:** Admin Console Content Management (`AdminContentPage.tsx`), Storage Engine (`adminStorage.ts`), Build-Time Git Loader (`blogService.ts`), and Draft Quarantine Enforcement  

---

## 1. CMS Architecture & Operational Strategy

Kavitha & Associates operates on a **zero-cost, Git-backed and Edge-resilient CMS architecture**. Articles and regulatory analyses can be authored, previewed, drafted, published, and revised without any third-party SaaS subscriptions, external database maintenance costs, or fragile proprietary plugins.

### Architecture Topology
```
[Content Source]
  ├── content/posts/*.md (Git Markdown Files with YAML Frontmatter)
  ├── public/uploads/blog/*.webp (Optimized Featured Images)
         │
         ▼
[Build-Time & Runtime Engine: blogService.ts]
  ├── import.meta.glob (Zero-cost build-time compilation)
  ├── Safe YAML Frontmatter Parser (No eval, strict type-checking)
  └── Reading Time & Fail-Closed Draft Filter
         │
         ├───> Public Routes (/blog, /blog/:slug) ──> STRICTLY PUBLISHED ONLY (Drafts -> 404)
         │
         └───> Admin Console (/admin/content?tab=posts) ──> Full Management (Drafts + Published)
                   │
                   └── AdminStorage (Local + Server API Sync /api/content)
```

---

## 2. Article Management Features (`AdminContentPage.tsx`)

The dedicated **Articles Management Console** provides a comprehensive editorial workspace:

### 2.1 Complete Field Coverage
| Field Name | Type | Validation & Formatting | Purpose |
| :--- | :--- | :--- | :--- |
| **Title** | `string` | Required; sanitized; triggers auto-slug | Primary article headline |
| **Slug** | `string` | Regex `^[a-z0-9-]+$`; normalized lower-case | Canonical URL route `/blog/:slug` |
| **Category / Tags** | `string` | Comma-delimited; parsed to array | Topical classification & filter pills |
| **Author Name** | `string` | Defaults to `CA Kavitha Vijay` | Authoritative attribution |
| **Author Role** | `string` | Defaults to `Managing Partner (B.Com, CA, CMA AIR 49)` | Credential assertion |
| **Cover Image** | `string` | Path relative to `/uploads/blog/` | Prominent visual element for cards & hero |
| **Cover Image Alt** | `string` | Descriptive fallback text | Screen reader accessibility (WCAG AA) |
| **Status** | `'published' \| 'draft'` | Explicit toggle | Quarantine control |
| **Short Excerpt** | `string` | Textarea; 1-3 sentences | Supporting lead paragraph & card summary |
| **Article Content** | `string` (Markdown) | Full Markdown syntax support | Deep statutory commentary |

### 2.2 Split-Screen Live Markdown Preview
- Authors can toggle between **`Edit` mode** (raw markdown with syntax guidance) and **`Preview` mode** (real-time rendering via `MarkdownRenderer`).
- Headings are automatically demoted (`demoteHeadings={true}`) to maintain a single `H1` tag per page for strict SEO compliance.
- Code blocks, tables, blockquotes, and statutory checklists render with identical styles to the live website.

---

## 3. Four-Tier Draft Quarantine & Boundary Defense

To guarantee that draft commentary or unfinished statutory notes never leak to prospective clients or regulatory bodies, Kavitha & Associates implements **Defense-in-Depth Draft Isolation**:

### Tier 1: Build-Time & Runtime Loader Quarantine (`blogService.ts`)
```typescript
export function isDraft(rawDraft: any): boolean {
  if (rawDraft === undefined || rawDraft === null) return true; // Fail-closed default
  if (typeof rawDraft === 'boolean') return rawDraft;
  if (typeof rawDraft === 'string') {
    return rawDraft.trim().toLowerCase() !== 'false';
  }
  return true;
}

// Public API strictly filters drafts
export function getAllPosts(includeDrafts = false): BlogPost[] {
  return allLoadedPosts.filter(post => includeDrafts || !post.draft);
}
```

### Tier 2: Direct URL Slug Interception (`BlogArticlePage.tsx`)
If an external visitor attempts to access a draft article by guessing its slug (e.g., `/blog/internal-audit-best-practices`):
```typescript
const post = slug ? BlogService.getPostBySlug(slug, false) : undefined;
if (!post) {
  return <NotFoundPage />; // Strictly returns 404 page; zero content revealed
}
```
*Verified via Tier 3 & Tier 4 automated test suites: Status 404 returned; draft remains 100% quarantined.*

### Tier 3: Search Engine Sitemap Exclusion (`scripts/generate-sitemap.mjs`)
The build process executes `node scripts/generate-sitemap.mjs` before bundle generation.
- Inspects frontmatter for `draft: true`.
- **Build Output Log:** `[sitemap] Wrote 16 URLs to C:\kavatha ca\public\sitemap.xml (3 published, 1 drafts excluded).`
- Draft URLs are strictly omitted from `sitemap.xml` and robots indexing directives.

### Tier 4: Edge Serverless API Segregation (`server/apiRouter.cjs` & Cloudflare Functions)
Public `/api/content` endpoints sanitize output objects, ensuring unauthenticated GET requests receive only published posts.

---

## 4. Media & Asset Upload Workflow

- Images uploaded through the admin console or placed in `public/uploads/blog/` are validated for valid MIME types (`image/webp`, `image/png`, `image/jpeg`).
- Recommended dimensions: **1200 x 750 px** (16:10 aspect ratio), compressed to < 80 KB using WebP encoding.
- The UI handles image load failures gracefully via `onError` handlers, displaying a fallback card visual without breaking layout constraints.

---

## 5. Verification & Test Compliance

The CMS workflow and draft quarantine mechanism are verified by **10 automated tests** across Tier 1, Tier 3, and Tier 4:
- `Pairwise 1: Draft Post + Direct URL Access (F7 + F9 + F12)` — **PASSED**
- `Pairwise 2: Publish Post + Build-time Sitemap Generator (F3 + F7 + F11)` — **PASSED**
- `Tier 4 Scenario 1: Complete Blog Publishing Lifecycle` — **PASSED**
- `Tier 4 Scenario 2: Draft Quarantine & Unpublish Verification Flow` — **PASSED**

The CMS architecture is verified production-grade, secure, and ready for continuous editorial use.
