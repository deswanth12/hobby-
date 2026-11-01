# Kavitha & Associates — Client Handover & Operations Guide

**Target Client:** CA Kavitha Vijay, Managing Partner, Kavitha & Associates  
**Practice Office:** 19-12-46, 1st Floor, Near Bairagipetteda Arch, Tirupati, AP 517501  
**Handover Date:** November 1, 2026  
**Technology Stack:** React 18, TypeScript, Tailwind CSS, Vite, Cloudflare Pages, Decap/Sveltia CMS  

---

## 1. Welcome to Your New Digital Chambers

Dear CA Kavitha Vijay,

Your new digital platform has been custom engineered to reflect the precision, prestige, and rigor of your Chartered Accountancy practice. Designed with a **Luxury Editorial** aesthetic, it highlights your Big 4 audit tenure at Deloitte, Fortune 50 corporate audit leadership at Ford Motor Company, and certified qualifications (B.Com, CA, CMA AIR 49).

This guide explains how you and your chambers staff can easily manage content, review client inquiries, and maintain your website without needing programming knowledge.

---

## 2. Managing Prospective Client Inquiries

### 2.1 The Consultation Intake Workflow
1. When a business or individual visits your website and completes the consultation form on `/contact`:
   * The inquiry is instantly validated (checking name, telephone number, and email).
   * A unique statutory inquiry reference is generated (e.g. `KA-1730441234567`).
   * The client is immediately given a **Direct WhatsApp Escalation** option prefilled with their specific requirement.
2. The inquiry is saved to your practice register.

### 2.2 Accessing the Inquiries Management Drawer
1. Log into your private administrative portal using your secret URL.
2. In the left navigation, click **Client Inquiries**.
3. You can:
   * Filter inquiries by status: `New`, `Contacted`, `In Progress`, `Closed`.
   * Filter by urgency: `Routine`, `Statutory Deadline Near`, `Immediate Priority`.
   * Click any inquiry row to open the side drawer.
   * Add internal **Follow-up Notes** (e.g. *"Spoke with Director on 2nd Nov; scheduled ITR audit review for Thursday"*).
   * Click **Export CSV** to download all inquiries into Microsoft Excel for offline recordkeeping.

---

## 3. Publishing Articles & Tax Insights

Your website includes a high-performance publishing engine for statutory alerts, budget analyses, and advisory articles.

### 3.1 Creating or Editing an Article via Administrative Portal
1. Navigate to **Content & Articles** in your admin console.
2. Click **New Publication**.
3. Fill in:
   * **Title:** e.g., *"Budget 2027: Key Direct Tax Amendments for Manufacturing Entities"*.
   * **Slug:** Auto-generated, or customize as `budget-2027-tax-updates`.
   * **Author:** Defaults to *"CA Kavitha Vijay"*.
   * **Category / Tags:** Select `Taxation`, `GST`, `Corporate & MCA`, or `Audit`.
   * **Excerpt:** Brief 2-sentence summary that appears on the blog card and Google search results.
   * **Content:** Type your article using standard Markdown formatting (supports headings, bold text, bullet points, tables, and blockquotes).
4. **Draft vs. Published:**
   * Leave status as **Draft** while drafting. Draft articles are strictly hidden from the public website and search engines.
   * Switch status to **Published** and click **Save Publication** when ready to go live.
   * The publication immediately appears on `https://kavithaassociates.com/blog`.

---

## 4. Updating Chambers Contact Information & Hours

If your office hours change or you wish to adjust contact phone numbers:
1. In the admin console, navigate to **Chambers Settings**.
2. Update:
   * **Primary Desk Telephone**
   * **Alternative Line**
   * **Official Email**
   * **Chambers Address & Google Maps Link**
   * **Official Chambers Hours** (e.g. `Mon – Sat: 09:30 AM – 06:30 PM IST`)
3. Click **Save Chambers Settings**. The updates take effect immediately.

---

## 5. Security & Account Best Practices

1. **Keep Your Admin URL Confidential:** Your management portal is accessed via a private, unlisted URL rather than an obvious `/admin` link. Do not share this URL publicly or post it on social media.
2. **Password Updates:** You can update your administrative password anytime directly in the admin portal under **Chambers Settings > Security > Change Password**.
3. **ICAI Compliance Reminder:** Avoid adding exaggerated marketing superlatives or unverified claims. The platform is pre-calibrated to adhere strictly to the ICAI Code of Ethics.

---

## 6. Technical Support & Emergency Handoff

* **Hosting Infrastructure:** Cloudflare Pages (Enterprise-grade security, global CDN, 100% free tier hosting).
* **Backup Copies:** All publications and settings can be downloaded at any time as JSON or CSV from your admin portal.
* **Emergency Contact:** For any technical assistance or infrastructure questions, your technical leads are available to assist.
