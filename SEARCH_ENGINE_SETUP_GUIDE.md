# Search Engine Setup & Indexing Guide: Kavitha & Associates
**Firm**: Kavitha & Associates (Chartered Accountants & Cost Accountants)  
**Production Domain**: `https://kavithaassociates.com/`  
**Chambers Location**: Tirupati, Andhra Pradesh, India  
**Date**: November 3, 2026

---

## Overview

This guide provides operational step-by-step procedures for activating, verifying, and monitoring search engine performance and indexation across Google Search Console (GSC) and Bing Webmaster Tools (BWT), as well as guidelines for managing local search assets (Google Business Profile).

---

## 1. Google Search Console (GSC) Setup & Verification

### Step 1: Account Access & Property Selection
1. Log in to [Google Search Console](https://search.google.com/search-console) using the firm's authorized administrative Google account (`cakavithasrj@gmail.com`).
2. Verify the property type:
   * **Domain Property (Recommended)**: `kavithaassociates.com` (covers `https://`, `http://`, `www`, and non-www). Requires DNS TXT verification.
   * **URL Prefix Property**: `https://kavithaassociates.com/` (verified via HTML file, HTML tag, or DNS).

### Step 2: Verification Methods
* **HTML Verification File**:
  * Note: The repository already contains an authorized verification token at [`public/google66e0145809155f23.html`](file:///c:/kavatha%20ca/public/google66e0145809155f23.html).
  * URL: `https://kavithaassociates.com/google66e0145809155f23.html`
* **DNS TXT Record (Domain Property)**:
  * In your DNS manager (Cloudflare or domain registrar), add a TXT record for `@`:
    * Host: `@`
    * Record Type: `TXT`
    * Value: `google-site-verification=...`
  * Click **Verify** in Search Console.

### Step 3: XML Sitemap Submission
1. In the left navigation sidebar of Search Console, navigate to **Indexing &rarr; Sitemaps**.
2. Under "Add a new sitemap", enter:
   `sitemap.xml`
3. Click **Submit**.
4. Confirm the submission status returns **Success** with 17 discovered URLs.

### Step 4: URL Inspection & Manual Indexing Priority
For newly updated or high-priority pages, use the **URL Inspection** tool (top search bar):
1. Enter the canonical URL: `https://kavithaassociates.com/knowledge-bank`
2. Click **Test Live URL** to confirm that Googlebot can fetch the page and render JavaScript successfully.
3. Click **Request Indexing**.
4. Repeat for the core service pages:
   * `https://kavithaassociates.com/services/audit-assurance`
   * `https://kavithaassociates.com/services/gst-consultant-tirupati`
   * `https://kavithaassociates.com/services/income-tax-consultant-tirupati`

---

## 2. Bing Webmaster Tools (BWT) Setup & Integration

Bing Webmaster Tools powers search results for Microsoft Bing, Yahoo, and Microsoft Copilot (generative AI search).

### Step 1: Account Connection
1. Log in to [Bing Webmaster Tools](https://www.bing.com/webmasters).
2. Click **Add a site**.
3. **Instant Import Method (Recommended)**: Select **Import from Google Search Console**. Bing will authenticate via your Google account, verify ownership instantly, and import your verified sitemap automatically.
4. **Manual Verification Method**:
   * Add a DNS CNAME or TXT record as specified by Bing Webmaster Tools.

### Step 2: Sitemap Submission in Bing
1. Navigate to **Sitemaps** in the left menu.
2. Click **Submit sitemap**.
3. Enter: `https://kavithaassociates.com/sitemap.xml`
4. Click **Submit**.

### Step 3: IndexNow Integration
Bing supports the IndexNow protocol for real-time URL submission whenever articles or services are published or updated, bypassing standard crawl delays.

---

## 3. Google Business Profile (GBP) Local Optimization Guidelines

> [!IMPORTANT]
> **Client Authorization Rule**: Do **not** create duplicate or unverified Google Business Profiles. Optimization must be performed solely on the authorized profile verified by CA Kavitha Vijay.

### Profile Alignment Checklist
To maximize local pack rankings for *"Chartered Accountant in Tirupati"* and *"CA Firm in Tirupati"*:

1. **Business Name Accuracy**:
   * Exact Match: `Kavitha & Associates` or `Kavitha & Associates Chartered Accountants`
   * Avoid keyword spamming in the legal name field (e.g. do not name the profile "Kavitha & Associates Best CA Firm Tax Consultant").
2. **Primary Category**:
   * Primary: **Chartered Accountant**
   * Secondary Categories: **Tax Consultant**, **Accounting Firm**, **Auditor**
3. **Address & Map Pin Consistency**:
   * Physical Address: `19-12-46, 1st Floor, Near Bairagipetteda Arch, Bairagi Patteda, Tirupati, Andhra Pradesh – 517501`
   * Map Link: `https://maps.app.goo.gl/p9ToGUtxqYDCghpF6`
   * Confirm the map pin points accurately to the entrance of the chambers.
4. **Phone Numbers & Website URL**:
   * Primary Phone: `+91 96263 50900`
   * Secondary Phone: `+91 95421 53906`
   * Website URL: `https://kavithaassociates.com/`
   * Appointment Link: `https://kavithaassociates.com/contact`
5. **Operating Hours**:
   * Monday – Saturday: `09:30 AM – 07:30 PM`
   * Sunday: `Closed` (Special appointments by prior arrangement only).
6. **Services List on GBP**:
   * Populate the GBP Services tab matching the website disciplines:
     * Statutory Audit (Companies Act 2013)
     * Tax Audit (Section 44AB)
     * Income Tax Return (ITR) Filing & Scrutiny
     * GST Registration, Filings & ASMT-10 Notice Defense
     * Company & LLP Incorporation (SPICe+)
     * Virtual CFO & CMA Bank Loan Data
     * RERA Form 3 Chartered Accountant Certification

---

## 4. Ongoing SEO & Health Monitoring Cadence

| Cadence | Tool | Metric / Action | Healthy Benchmark |
| :--- | :--- | :--- | :--- |
| **Weekly** | Google Search Console | **Performance Report**: Clicks, Impressions, CTR, Average Position | Upward trend in impressions on brand + local queries |
| **Weekly** | Google Search Console | **Indexing & Coverage**: Inspect Valid vs. Excluded URLs | 17 Valid URLs; 0 Server (5xx) or Soft 404 errors |
| **Monthly** | Google Search Console | **Core Web Vitals**: Good / Needs Improvement / Poor URLs | 100% URLs in "Good" status on mobile and desktop |
| **Monthly** | Bing Webmaster Tools | **Search Performance & Crawl Control**: Crawl requests & errors | 0 crawl errors |
| **Monthly** | Schema.org Validator | **Structured Data**: Test live pages on `validator.schema.org` | 0 errors, 0 warnings |
| **Quarterly** | Google Search Console | **Security & Manual Actions**: Review security status | "No issues detected" |
| **Quarterly** | Search Engines | **Generative Query Test**: Test firm queries in Perplexity / ChatGPT | Verified citation of `kavithaassociates.com` |
