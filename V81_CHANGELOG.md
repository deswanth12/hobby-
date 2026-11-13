# V8.1 RELEASE CHANGELOG & MIGRATION SUMMARY
**Project:** Kavitha & Associates, Chartered Accountants  
**Release Tag:** `v8.1.0-release-candidate`  
**Previous Baseline:** `v8.0.3`  

---

## 1. Summary of Changes in V8.1
### Added
- Created dedicated `/leadership` route (`src/v8/pages/LeadershipPage.tsx`) documenting partner credentials, audit background, and ICMAI CMA attribution.
- Added all 8 approved practice disciplines to `src/v8/components/home/PracticeAreasSection.tsx` (PRAC-01 through PRAC-08).
- Added `Executive Statutory Summary` callout to `src/v8/pages/BlogArticlePage.tsx` with `#B49A64` accent.
- Added comprehensive V8.1 screenshot suite in `reports/screenshots/v81/`.
- Authored all 13 required V8.1 technical documentation reports.

### Changed
- Aligned all 7 Homepage section IDs:
  - Hero Section: `#hero`
  - Firm Introduction: `#the-firm`
  - Practice Areas: `#practice-areas`
  - Professional Approach: `#professional-approach`
  - Working Methodology: `#methodology`
  - Featured Insights: `#insights-overview`
  - Chambers Intake: `#chambers-contact`
- Updated Navbar and MobileDrawer links to: Home (`/`), The Firm (`/about`), Leadership (`/leadership`), Services (`/services`), Insights (`/blog`), Contact (`/contact`).
- Updated Navbar primary CTA button to `Request Consultation`.
- Refined Blog Article Page typography to Walnut Brown `#35271F` (12.09:1 AAA contrast) and Slate-Charcoal `#525954` (6.06:1 contrast).
- Replaced text-heavy blog infographic covers with pure 16:10 editorial photography.
- Updated all interactive buttons and links across BlogArticlePage to enforce `min-h-[44px]`.

### Fixed
- Fixed section ID discrepancies across homepage components while maintaining legacy anchor aliases.
- Fixed 3 test assertions in `tests/v8-milestone4.test.mjs` (now 58/58 passing).
- Fixed TypeScript compile errors in `LeadershipPage.tsx`.

### Security & Compliance
- Strictly maintained quarantine on unapproved partner portrait; utilized official neutral crest monogram (`KV`/`KA`).
- Verified zero personal PAN numbers or unredacted membership numbers in public code.
- Maintained 100% backend preservation of Supabase database, RLS policies, and PBKDF2/JWT admin console.
