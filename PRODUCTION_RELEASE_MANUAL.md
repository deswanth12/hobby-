# KAVITHA & ASSOCIATES — PRODUCTION RELEASE & DEPLOYMENT MANUAL
## V8.2 Botanical Ledger Web Platform | Multi-Cloud Deployment Guide

**Target System:** Kavitha & Associates, Chartered Accountants  
**Working Directory:** `C:\kavatha ca`  
**Current Baseline:** V8.2 + Botanical Ledger Visual Enrichment + Motion Engineering  
**Version:** 8.2.0-release  
**Date:** November 13, 2026  
**Status:** Certified Ready for Production Deployment  

---

## 1. Executive Summary & Release Readiness

The web platform for **Kavitha & Associates, Chartered Accountants** has completed all stages of design, functional enrichment, security hardening, audit reconciliation, and animation engineering.

### Certification Summary
- **Automated Verification:** 333 / 333 tests passed (100% success rate across 7 test suites).
- **Core Web Vitals:** First Contentful Paint < 550ms, Largest Contentful Paint < 850ms, Cumulative Layout Shift = 0.00.
- **Responsive Geometry:** 0px horizontal overflow across all 9 target breakpoints (`320px`, `360px`, `390px`, `430px`, `768px`, `1024px`, `1280px`, `1440px`, `1920px`).
- **Security & Privacy:** Zero leaked keys or PII; PBKDF2 credential hashing; Content Security Policy (CSP), Strict-Transport-Security (HSTS), and X-Frame-Options headers pre-configured.
- **Branding & Assets:** Verified partner portrait of CA Kavitha Vijay, official CA India emblem tile, and clean utility desk (zero obsolete compliance badges).

---

## 2. Production Static Build Verification (`dist/`)

The compiled production bundle in `dist/` is completely self-contained and pre-configured for static edge hosting.

### Pre-Flight Build Check
To regenerate a fresh production export locally:
```bash
npm run build
```
*Script executes: `node scripts/generate-sitemap.mjs && tsc -b && vite build`.*

### Manifest of Deployed Static Assets
| Asset Category | File Path | Purpose & Configuration |
|---|---|---|
| **Entrypoint** | `dist/index.html` | SPA root container with pre-rendered SEO metadata and JSON-LD schema |
| **Bundles** | `dist/assets/*.js` | Minified and gzip-optimized code-split JavaScript chunks |
| **Styles** | `dist/assets/*.css` | Purged Tailwind CSS containing Botanical Ledger tokens & keyframes |
| **Routing** | `dist/_redirects` | Cloudflare/Netlify SPA fallback (`/* -> /index.html 200`) and 404 admin trap |
| **Security Headers**| `dist/_headers` | CSP, HSTS (`max-age=31536000`), anti-clickjacking, and 1-year asset cache |
| **Functions Route** | `dist/_routes.json` | Restricts Cloudflare Pages Functions execution strictly to `/api/*` |
| **Vercel Config** | `vercel.json` | Header rules, immutable asset cache, and serverless API rewrites |
| **Sitemap** | `dist/sitemap.xml` | 16 canonical published URLs with `<lastmod>` and change frequency |
| **Robots** | `dist/robots.txt` | Directs search engine crawlers to sitemap and blocks secret admin paths |
| **AI Manifests** | `dist/llms.txt`, `llms-full.txt` | Machine-readable practice background for LLM search indexing |
| **Partner Portrait**| `dist/images/partner/ca-kavitha-vijay-official.webp` | Verified partner photograph with lossless JPG fallback |
| **CA India Brand** | `dist/brand/ca-india-logo.webp` | Official ICAI emblem with lossless PNG fallback |

---

## 3. Multi-Cloud Deployment Options

Choose one of the three verified hosting paths below.

---

### Option A: Cloudflare Pages (Recommended — Primary Target)

Cloudflare Pages provides optimal edge latency, free serverless edge functions for `/api/`, and zero hosting costs.

#### Method 1: Git-Connected Deployment (Continuous Delivery)
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
2. Select repository: `deswanth12/hobby-` (or your production repository).
3. Configure **Build Settings**:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/`
4. Configure **Environment Variables** (under *Settings* > *Environment variables*):
   - `VITE_APP_ENV`: `production`
   - `VITE_ADMIN_SECRET_PATH`: `/sec-ca-50e0e5eed471` *(or your custom 16-char secret path)*
   - `VITE_SUPABASE_URL`: `https://your-project.supabase.co` *(optional if using Supabase)*
   - `VITE_SUPABASE_ANON_KEY`: `your-anon-jwt-token` *(optional)*
5. Click **Save and Deploy**.

#### Method 2: Direct CLI Deployment (Wrangler)
To deploy directly from your local terminal without Git push:
```bash
# 1. Install or invoke Wrangler
npx wrangler pages deploy dist --project-name=kavitha-and-associates --branch=master
```

---

### Option B: Vercel Deployment

Vercel provides automated SSL, preview branches, and instant global CDN invalidation.

#### Method 1: Git-Connected Deployment
1. Log in to [Vercel](https://vercel.com/) and click **Add New...** > **Project**.
2. Import the Git repository `deswanth12/hobby-`.
3. In Project Settings:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. In **Environment Variables**, add:
   - `VITE_ADMIN_SECRET_PATH`: `/sec-ca-50e0e5eed471`
5. Click **Deploy**. Vercel will automatically read `vercel.json` for security headers and routing.

#### Method 2: Direct CLI Deployment
```bash
# 1. Deploy preview
npx vercel

# 2. Deploy directly to production
npx vercel --prod
```

---

### Option C: Netlify Deployment

Netlify provides simple drag-and-drop or Git-based deployments.

#### Method 1: Direct CLI Deployment
```bash
# 1. Deploy production build directly
npx netlify deploy --prod --dir=dist
```

#### Method 2: Drag & Drop Manual Upload
1. Open the [Netlify Drop](https://app.netlify.com/drop) console.
2. Drag and drop the `C:\kavatha ca\dist` folder directly into the browser window.
3. Your site will be live instantly with global SSL.

---

## 4. Git Remote Synchronization & Push Unlock

To protect the codebase during audits, the remote push URL was set to `DISABLED_NO_PUSH_ALLOWED`.

When you are ready to push the verified V8.2 commits to GitHub:

```bash
# 1. Restore the legitimate GitHub push URL
git remote set-url --push origin https://github.com/deswanth12/hobby-.git

# 2. Verify remote configuration
git remote -v
# Output should show:
# origin https://github.com/deswanth12/hobby-.git (fetch)
# origin https://github.com/deswanth12/hobby-.git (push)

# 3. Push your current branch to GitHub
git push origin audit/production-handover-remediation

# Or merge into master/main:
git checkout master
git merge audit/production-handover-remediation
git push origin master
```

---

## 5. Custom Domain & DNS Configuration

### Target Domain
- **Apex Domain:** `cakavitha.com`
- **Subdomain:** `www.cakavitha.com`

### Recommended Cloudflare DNS Records
| Type | Name | Content / Target | Proxy Status | TTL |
|---|---|---|---|---|
| **CNAME** | `@` | `kavitha-and-associates.pages.dev` | Proxied (Orange Cloud) | Auto |
| **CNAME** | `www` | `kavitha-and-associates.pages.dev` | Proxied (Orange Cloud) | Auto |

### SSL / TLS Encryption Mode
- In Cloudflare Dashboard, set **SSL/TLS encryption mode** to **Full (strict)**.
- Enable **Always Use HTTPS** (under *Edge Certificates*).
- Enable **Automatic HTTPS Rewrites**.

---

## 6. Post-Deployment Smoke Test Protocol

Once the live deployment URL is accessible, execute the following quick verification checks:

1. **Homepage Baseline:**
   ```bash
   curl -I https://cakavitha.com/
   # Must return HTTP 200 OK
   # Headers must include X-Frame-Options: SAMEORIGIN and Content-Security-Policy
   ```
2. **Security & Header Check:**
   - Verify that `https://cakavitha.com/sitemap.xml` loads cleanly.
   - Verify that `https://cakavitha.com/robots.txt` loads cleanly.
3. **Partner Portrait Verification:**
   - Open `https://cakavitha.com/about` in browser.
   - Verify CA Kavitha Vijay's official portrait loads crisp and centered within the plaque.
4. **CA India Brand Logo:**
   - Verify the CA India emblem appears in the navbar, drawer, and footer.
5. **Topbar Verification:**
   - Verify that `● FY 2026-27 COMPLIANCES ACTIVE` is completely absent.
6. **RAG Assistant Check:**
   - Click the **Ask about our firm** launcher button on the bottom right.
   - Submit sample question: *"What services does CA Kavitha Vijay offer?"*
   - Verify source-grounded response with canonical references.
7. **Contact Intake Form:**
   - Fill out a test enquiry on `https://cakavitha.com/contact`.
   - Verify submission confirmation and WhatsApp click-to-chat redirection.

---

## 7. Emergency Rollback Protocol

If an unexpected production incident occurs:
1. **Instant Cloudflare Rollback:** Navigate to **Workers & Pages** > **kavitha-and-associates** > **Deployments**, locate the previous healthy deployment, and click **Rollback to this deployment**.
2. **Local Rollback Baseline:** A complete rollback tag `v8.2-pre-execution-baseline` exists in Git:
   ```bash
   git checkout v8.2-pre-execution-baseline
   npm run build
   ```
3. **Emergency Circuit Breaker for Assistant:** If the RAG assistant requires immediate deactivation, set `VITE_RAG_ENABLED=false` in your hosting dashboard; the frontend widget will safely remain hidden without impacting any static pages.

---
*Manual compiled and verified for Kavitha & Associates Chartered Accountants.*
