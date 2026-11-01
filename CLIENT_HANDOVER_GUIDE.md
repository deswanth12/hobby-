# Kavitha & Associates — Client Handover & Practice Operations Guide

**Target Client:** CA Kavitha Vijay, Managing Partner (B.Com, CA, CMA AIR 49)  
**Practice Chambers:** 19-12-46, 1st Floor, Near Bairagipetteda Arch, Bairagi Patteda, Tirupati, Andhra Pradesh – 517501  
**Live Website:** https://kavithaassociates.com/  
**Handover Date:** November 1, 2026  
**Document Version:** 2.0.0 (Production Handover Final)  

---

## 1. Welcome to Your New Digital Practice Platform

Dear CA Kavitha Vijay,

Your new digital platform has been custom-engineered to embody the institutional rigor, authority, and statutory precision of your Chartered Accountancy and Cost Accountancy practice. Designed with a **Luxury Editorial** aesthetic, it highlights your Big 4 audit pedigree at Deloitte, Fortune 50 corporate audit leadership at Ford Motor Company, and certified qualifications (B.Com, CA, CMA AIR 49).

This guide provides everything you and your chambers team need to manage client inquiries, publish tax commentary, maintain search engine rankings, and administer your digital presence without technical assistance.

---

## 2. Chambers Identity & Verified Practice Directory

All public information published on the website has been verified against your firm records:

- **Primary Chambers Address:** 19-12-46, 1st Floor, Near Bairagipetteda Arch, Bairagi Patteda, Tirupati, AP 517501 (GPS: 13.6192242, 79.418046)
- **Primary Voice & WhatsApp Line:** `+91 96263 50900` (`tel:919626350900`, `https://wa.me/919626350900`)
- **Alternative Chambers Line:** `+91 95421 53906` (`tel:919542153906`)
- **Official Practice Email:** `cakavithasrj@gmail.com` (`mailto:cakavithasrj@gmail.com`)
- **Google Maps Navigation:** `https://maps.app.goo.gl/p9ToGUtxqYDCghpF6`
- **Google Review Direct Link:** `https://g.page/r/CeX6UsjS_dyQEBM/review`

---

## 3. Completed Features & Capabilities Inventory

Your platform includes:

1. **Editorial Practice Showcase:**
   - **Homepage (`/`):** Strategic credentials plaque, partner profile, service spectrum, statutory calendar, corporate entity selector, and verified Google Maps chambers directions.
   - **About Firm (`/about`):** Managing Partner career trajectory (Deloitte, Ford, MCA articleship), academic distinctions (AIR 49 CMA Inter), award recognitions ("Move the Dot" & "Live the Dot"), and office photo gallery.
   - **Practice Areas Hub (`/services`):** Multi-disciplinary directory covering 5 practice areas and 34 specialized CA/CMA services.
   - **6 Specialized Service Landing Pages:**
     * Statutory & Internal Audit (`/services/audit-assurance`)
     * GST Advisory & Appellate (`/services/gst-consultant-tirupati`)
     * Income Tax & Scrutiny Defense (`/services/income-tax-consultant-tirupati`)
     * Corporate Incorporation & ROC (`/services/company-registration-tirupati`)
     * Virtual CFO & CMA Bank Reports (`/services/virtual-cfo-tirupati`)
     * RERA Advisory & Form 3 (`/services/rera-consultant-tirupati`)
   - **Commercial Verticals (`/industries`):** Specialized statutory frameworks for Startups, MSMEs, Manufacturing, Real Estate, Retail, Healthcare, and Education.
   - **Regional Footprint (`/locations`):** Primary Tirupati chambers with active client coverage across Chennai, Bengaluru, Hyderabad, and Coimbatore.
2. **Publishing & Thought Leadership Hub (`/blog`):**
   - Clean, readable editorial article viewer with automated reading time estimation.
   - Custom Luxury Editorial WebP cover graphics.
   - Multi-platform social share suite (Copy Link, WhatsApp, LinkedIn, Twitter/X).
   - Strict draft quarantine preventing accidental publication of internal working notes.
3. **Client Consultation Intake (`/contact`):**
   - Multi-field intake: Full Name, Organization, Phone, Email, Service Category, City, Entity Type, Urgency, Message.
   - Two-tier bot defense: Hidden honeypot trap + 1500ms velocity timing check.
   - Instant WhatsApp escalation button pre-filled with the client's inquiry reference code.
   - Local and database persistence with CSV export.
4. **Mobile & Accessibility Excellence:**
   - Zero horizontal overflow across all screens from compact smartphones (320px) to wide monitors (1440px).
   - Touch targets meet the 44px × 44px WCAG 2.1 AAA standard.
   - Mobile navigation drawer with keyboard focus trapping and body scroll lock.
   - Responsive floating WhatsApp button that fades in only after scrolling past the hero.

---

## 4. Domain, Hosting & Edge Infrastructure

### 4.1 Production Hosting Architecture
The website is architected with dual-hosting support:
- **Vercel Production Deployment:** Currently serving `https://kavithaassociates.com/` with automated SSL certificates, global edge routing, and Node.js serverless API routes (`/api/*`). Comprehensive security headers (CSP, HSTS, X-Frame-Options) are configured in `vercel.json`.
- **Cloudflare Pages Edge Compatibility:** The repository includes full edge function support (`functions/api/auth.js`, `public/_headers`, `public/_redirects`), enabling one-click migration to Cloudflare Pages if desired.

### 4.2 Custom Domain & DNS Records
- **Primary Domain:** `kavithaassociates.com`
- **Subdomain:** `www.kavithaassociates.com` (redirects automatically to apex)
- **SSL / TLS Certificate:** Managed automatically via Let's Encrypt / Vercel Edge with HTTP/2 and HTTP/3 support and forced HTTPS redirection.

---

## 5. Google Business Profile & Google Search Console Status

### 5.1 Google Search Console Verification
- **Verification Method:** Embedded HTML verification page `public/google66e0145809155f23.html` responding with `google-site-verification: google66e0145809155f23.html`.
- **Sitemap Index:** Registered at `https://kavithaassociates.com/sitemap.xml`.
- **Robots Directives:** Standard crawler and AI engine permissions declared in `https://kavithaassociates.com/robots.txt`.

### 5.2 Google Business Profile
- **Status:** Registered and active for primary chambers at Bairagi Patteda, Tirupati.
- **Direct Review URL:** `https://g.page/r/CeX6UsjS_dyQEBM/review` (embedded in Google QR code).

---

## 6. Content Publishing & CMS Authoring Instructions

The platform supports Git-backed CMS authoring via **Sveltia / Decap CMS**:

### 6.1 Publishing an Article via CMS
1. Access the administrative content manager via your designated login URL.
2. Under **Collections**, click **Publications**.
3. Click **New Publication** and fill in:
   - **Title:** e.g., *"Statutory Audit Guidelines FY 2026-27"*.
   - **Slug:** Auto-generated from title or custom (e.g. `statutory-audit-guidelines-2027`).
   - **Draft:** Set to `true` while drafting; toggle to `false` when ready to go live.
   - **Excerpt:** Brief 2-sentence summary for search snippets and blog cards.
   - **Category Tags:** Select relevant tax/audit disciplines.
   - **Cover Image:** Upload an image to `/uploads/blog/`. Recommended resolution: 1200x630 pixels.
   - **Body:** Compose your commentary using standard Markdown.
4. Click **Publish**. When connected to GitHub, the CMS automatically commits the change to your repository, triggering an automated production build in ~3 minutes.

### 6.2 Draft Quarantine Rule
Any article with `draft: true` is **strictly excluded** from:
- The public `/blog` listing page.
- The XML sitemap (`https://kavithaassociates.com/sitemap.xml`).
- Direct URL requests (returns the canonical 404 page).
You can safely keep draft working papers in the system without risk of premature client viewing.

---

## 7. Client Inquiries Management

### 7.1 Reviewing Inquiries
1. Log into your private administrative portal using your secret URL.
2. In the navigation menu, click **Client Inquiries**.
3. View the inquiry ledger with columns for Date, Reference ID, Client Name, Entity Type, Phone, Service Requested, and Urgency.
4. Click any inquiry row to view full brief details and manage follow-up notes.
5. Click **Export CSV** to download a spreadsheet copy for your chambers records.

---

## 8. Backup & Disaster Recovery Procedures

1. **Git Repository History:** Every file, article, configuration, and image is version-controlled in your GitHub repository. Any prior version of the website can be restored in seconds with `git checkout <commit>`.
2. **Database Snapshots:** Practice inquiry data is mirrored locally in `data/practice_db.json`. Regular automated backups of this file ensure zero client records are lost.
3. **Zero Third-Party Vendor Lock-in:** The website is built entirely with standard open-source tools (React, Vite, Tailwind CSS). It can be hosted on any static or serverless web host (Vercel, Cloudflare Pages, Netlify, AWS S3, or self-hosted VPS) without paying proprietary CMS licensing fees.

---

## 9. Client Account Ownership & Credential Handover Checklist

In strict accordance with security protocols, **zero plaintext passwords or secret API keys are stored in source code**:

| Service / Platform | Purpose | Ownership / Access Details | Action Required by Client |
| :--- | :--- | :--- | :--- |
| **Domain Registrar** | `kavithaassociates.com` DNS | Managed by Client | Maintain active annual renewal |
| **Hosting Account** | Vercel / Cloudflare Pages | Connected to Client GitHub | Ensure build environment variables are set |
| **Admin Portal Passwords** | Private Practice Console | Controlled via `ADMIN_KAVITHA_PASSWORD` env var | Configure strong private password (min 12 chars) |
| **GitHub OAuth App** | CMS Content Manager Login | GitHub Developer Settings | Register Client ID and Secret in hosting dashboard |
| **Supabase Cloud (Optional)** | Multi-device cloud sync | Supabase Project Settings | Add URL and Anon Key if multi-device sync is desired |
| **Google Search Console** | Search Ranking & Indexing | Google Account | Claim ownership via HTML verification tag |
| **Google Business Profile** | Local Maps & Client Reviews | Google Account | Monitor client reviews and update chambers hours |
