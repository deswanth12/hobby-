# Kavitha & Associates — Google Search Console Client Action Guide

**Document Version:** 1.0.0  
**Target Domain:** `kavithaassociates.com`  
**Prepared For:** CA Kavitha Vijay & Administrative Management  
**Practice Chambers:** Kavitha & Associates, Tirupati, Andhra Pradesh  
**Confidentiality & Privacy Notice:** Never share or store your personal Google account password with any agency or external developer. Google Search Console permits secure, delegated access via user email permissions.

---

## 1. Domain Property Verification (DNS TXT Method)

To monitor organic search performance, indexing status, and Googlebot crawl activity, the firm must verify ownership of the root domain. **The Domain Property method is recommended** because it tracks all subdomains (`www`, non-`www`), protocols (`http`, `https`), and subdirectories simultaneously.

### Step-by-Step Verification Instructions:
1. Sign in to [Google Search Console](https://search.google.com/search-console/) using your official practice Google Account (`cakavithasrj@gmail.com`).
2. Click **Add Property** in the top-left dropdown menu.
3. Select the **Domain** property type (on the left) and enter:
   ```
   kavithaassociates.com
   ```
4. Click **Continue**. Google will generate a unique DNS TXT verification token (e.g. `google-site-verification=abc123xyz...`).
5. Open your DNS provider (Cloudflare, Namecheap, GoDaddy, or your domain registrar):
   - Add a new DNS record:
     - **Type:** `TXT`
     - **Name / Host:** `@` (or leave blank depending on provider)
     - **TTL:** Auto or 3600 seconds
     - **Value / Content:** Paste the verification token provided by Google.
6. Return to Google Search Console and click **Verify**. (DNS propagation may take between 5 minutes and 24 hours).

---

## 2. XML Sitemap Submission

Once the domain property is verified, submit the website sitemap to guide Googlebot to all 16 canonical indexable URLs:

1. In the left navigation menu, click **Sitemaps** (under the "Indexing" section).
2. Under "Add a new sitemap", enter:
   ```
   sitemap.xml
   ```
   *(The full path submitted will be `https://kavithaassociates.com/sitemap.xml`)*.
3. Click **Submit**.
4. **Expected Status:**
   - Within a few minutes to hours, the status will show **"Success"**.
   - The discovered URLs count will report **16 URLs**.
   - If the status displays *"Couldn't fetch"*, do not panic; Googlebot often queues sitemaps for the next crawl batch. Refresh after 24 hours.

---

## 3. URL Inspection Tool Workflow (Priority Indexing Requests)

The URL Inspection Tool allows you to check whether Googlebot has crawled a specific page and request priority recrawling after updates.

### Which URLs to Prioritize (Top 5 Priority Pages):
1. **Homepage:** `https://kavithaassociates.com/`
2. **About Page:** `https://kavithaassociates.com/about`
3. **Services Hub:** `https://kavithaassociates.com/services`
4. **GST Consultant Tirupati:** `https://kavithaassociates.com/services/gst-consultant-tirupati`
5. **Income Tax Consultant Tirupati:** `https://kavithaassociates.com/services/income-tax-consultant-tirupati`

### How to Inspect and Request Indexing:
1. Paste the full URL into the top search bar in Search Console (e.g. `https://kavithaassociates.com/about`).
2. Press Enter to retrieve Google's index data.
3. Click **"Test Live URL"** in the top right corner. This tests your live Vercel deployment in real time and confirms that:
   - The page is reachable (HTTP 200).
   - Structured data (Schema.org) is valid with zero errors.
   - The page is mobile-friendly.
4. If the page is not yet indexed or was recently updated, click **"Request Indexing"**.

> [!IMPORTANT]
> **Do not repeatedly click "Request Indexing" for the same URL.** Submitting repeated requests does not accelerate Google's crawl queue and may trigger temporary submission quotas. A single request is sufficient; Googlebot will recrawl the URL within several days.

---

## 4. Understanding Indexing Exclusions & Reports

In the **Pages** report (under "Indexing"), Google categorizes URLs into two main groups: **Indexed** and **Not indexed**. Here is how to interpret common exclusion statuses:

| Status Label in GSC | What It Means for Kavitha & Associates | Action Required? |
| :--- | :--- | :--- |
| **Crawled — currently not indexed** | Googlebot visited the URL but has not yet committed it to the search index. Common for new websites. | **None required**. Publishing internal links and sharing technical blog posts will naturally transition these pages to indexed. |
| **Discovered — currently not indexed** | Googlebot found the link (via sitemap or internal link) but has not yet crawled the content. | **None required**. Ensure server response times remain fast. |
| **Page with redirect** | Triggered when Google visits `http://` or `www` versions and is redirected to `https://kavithaassociates.com`. | **Expected behavior**. Confirms canonical redirects are functioning correctly. |
| **Excluded by 'noindex' tag** | Found on `/admin`, `/sec-ca-...`, or 404 pages. | **Expected behavior**. Verifies that private areas are protected from public search. |

---

## 5. Security & Manual Actions Monitoring

Check these two diagnostic tabs monthly to verify complete domain health:
1. **Manual Actions:** Navigate to *Security & Manual Actions* → *Manual Actions*.
   - **Expected Status:** *"No issues detected"* (Green checkmark).
   - This confirms the website is free from webmaster guideline penalties.
2. **Security Issues:** Navigate to *Security & Manual Actions* → *Security Issues*.
   - **Expected Status:** *"No issues detected"* (Green checkmark).
   - Confirms the domain is free from malware, phishing, or malicious injection.

---

## 6. Monitoring Search Performance & Queries

After 14–30 days of data collection, navigate to **Performance** → **Search Results** to review:
- **Total Clicks:** Real visitors visiting from Google Search.
- **Total Impressions:** How often your practice pages appear in search snippets.
- **Average CTR (Click-Through Rate):** The percentage of searchers clicking your listings.
- **Top Queries:** Watch for regional terms such as *"Chartered Accountant in Tirupati"*, *"CA Firm in Tirupati"*, and *"GST filing Tirupati"*.
- **Top Pages:** Monitor which service landing pages receive the most interest to guide future blog content creation.
