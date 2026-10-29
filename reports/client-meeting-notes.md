# Kavitha & Associates — Website Proposal & Client Meeting Notes

**Document Type:** Client Meeting Guide, Commercial Proposal & On-Site Consultation Record  
**Target Client:** CA KavithaVijay SRJ (B.Com, FCA, CMA), Senior Partner  
**Firm Name:** Kavitha & Associates (Chartered Accountants | Cost Accountants)  
**Primary Practice Base:** Tirupati, Andhra Pradesh, India  
**Meeting Purpose:** Live Website Demonstration, Scope & Commercial Review, Operational Data Collection, and Launch Planning  
**Prepared By:** Senior Client-Success Manager & Website Project Consultant  
**Date:** October 29, 2026  
**Document Version:** 1.0 (Production / Meeting-Ready)  

---

## 1. Executive Briefing & Project Materials Inspection

### 1.1 Available Workspace Artifacts Inspected
Prior to preparing this client document, a thorough inspection of the project repository (`c:\kavatha ca`) and client-provided assets was conducted. The specific evidentiary sources reviewed include:

| Source File / Asset | Location | Status | Key Information Extracted |
|---|---|:---:|---|
| **Firm Profile PDF** | `Kavitha_and_Associates_Firm_Profile.pdf` | **Available** (897 KB, 2 Pages) | Confirmed partner qualifications (B.Com, FCA, CMA), practice areas (Audit, Tax, GST, Corporate, RERA, Advisory), 9 statutory audit streams, 10 industry sectors, phones (+91 96263 50900 / 95421 53906), email (`cakavithasrj@gmail.com`), and 5 practice cities (Tirupati, Chennai, Bengaluru, Hyderabad, Coimbatore). |
| **Comprehensive Website Audit** | `reports/ca-website-audit.md` | **Available** (25.8 KB) | 15-section technical audit confirming 0 build errors, clean SPA routing, technical SEO implementation, responsive testing across 5 viewports, benchmark comparison against 6 CA practices, and strict alignment with ICAI Code of Ethics (pull-model, no superlatives, no fee claims). |
| **Client Confirmation Checklist** | `reports/client-confirmation-checklist.md` | **Available** (2.4 KB) | Highlights the 5 pre-launch blockers requiring client decision: Tirupati physical address, FRN/MRN display permissions, branch office vs. service corridor status, domain selection, and communication routing. |
| **Firm Data Model** | `src/data/firmData.ts` | **Available** (11.1 KB) | Central single source of truth for all content across the 7 application routes, including structured WhatsApp URL generation, industry tags, and qualification notes. |
| **Entry Point & Metadata** | `index.html` | **Available** (3.7 KB) | Contains dynamic OpenGraph tags, canonical link, Google Fonts (`Cormorant Garamond` & `Plus Jakarta Sans`), and JSON-LD `AccountingService` schema markup. |
| **Technical SEO Files** | `public/robots.txt`, `public/sitemap.xml` | **Available** | Crawler index file allowing search engines and XML sitemap covering all 7 canonical routes with update frequencies. |
| **Hosting Rewrites** | `public/_redirects`, `vercel.json` | **Available** | Production SPA rewrites configuring clean fallback to `/index.html` on deep route refreshes for Netlify, Cloudflare, and Vercel. |
| **Production Build Assets** | `dist/` | **Verified** | Production build compiled cleanly via `tsc -b && vite build` in 13.3s with 0 TypeScript errors. Output: `dist/index.html` (3.83 kB), CSS (31.41 kB), JS (294.97 kB). |
| **Official Firm Logo Asset** | Workspace root | **Unavailable** | Official vector/high-res PNG logo has not been provided. Currently utilizing a clean typographic monogram badge ("KA") in Forest Green and Gold. Needs client confirmation. |
| **High-Resolution Partner Photo** | Workspace root | **Unavailable** | High-resolution executive photograph of CA KavithaVijay SRJ is pending client supply. |

### 1.2 Known Practice & Infrastructure Details
- **Client Practice:** Kavitha & Associates
- **Professional Categories:** Chartered Accountants & Cost Accountants
- **Lead Partner:** CA KavithaVijay SRJ (B.Com, FCA, CMA)
- **Primary Physical Base:** Bairagi Patteda, Tirupati, Andhra Pradesh – 517501, India (GPS Coordinates: 13°37'09.3"N 79°25'04.9"E • Map: https://maps.google.com/?q=13.61925,79.418028)
- **Primary Phone & WhatsApp Desk:** `+91 96263 50900`
- **Secondary Phone Desk:** `+91 95421 53906`
- **Official Email:** `cakavithasrj@gmail.com`
- **Local Demo Server URL:** `http://localhost:5173/` *(Important: This is a local development server address running on the consultant’s demonstration device. It is not publicly accessible over the internet.)*
- **Active Web Application Pages in Demo:**
  1. `Home (/)`: Editorial hero, partner credentials, practice pillars, audit spotlight preview, 5 service streams, geographic reach, and direct consultation desk.
  2. `About (/about)`: Executive biography of CA KavithaVijay SRJ, dual FCA/CMA credentials, professional philosophy, and regulatory compliance commitment.
  3. `Practice Services (/services)`: Comprehensive breakdown of 5 core domains: Income Tax, GST, Corporate/MCA, RERA, and Advisory.
  4. `Audit & Assurance (/services/audit-assurance)`: Dedicated spotlight showcasing 9 statutory audit specializations with statutory references.
  5. `Industries (/industries)`: Sector-specific financial advisory capabilities across 10 commercial sectors.
  6. `Service Locations (/locations)`: Structured geographic breakdown distinguishing Tirupati Primary Chambers from regional client coverage corridors.
  7. `Contact & Inquiry (/contact)`: Direct communication hub with clickable call/email links and structured WhatsApp inquiry form.
  8. `Not Found (/*)`: Polished 404 recovery page guiding users back to active sections.
- **Technology Stack:** React 18.3.1, TypeScript 5.6.3, Vite 5.4.11, Tailwind CSS 3.4.16, Lucide Icons 1.16.0.
- **Project Readiness Classification:**
  - *Completed & Verified:* Production build, TypeScript validation, 7-route navigation, mobile drawer, touch targets, color contrast, WhatsApp URL generation, basic on-page SEO, sitemap.xml, robots.txt, hosting rewrite rules.
  - *Completed in Code / Pending Client Confirmation:* Tirupati physical door/street address, ICAI FRN/MRN display permissions, 4 regional cities classification (branches vs. coverage corridors), exact wording of experience claims ("10+ years").
  - *Work Needing Post-Launch Testing:* Domain DNS propagation, SSL certificate validation, Google Search Console indexing, and Google Business Profile phone/postcard verification.

---

## 2. Practical Meeting Agenda (15–20 Minutes)

### 2.1 Time-Boxed Meeting Structure
This agenda is designed to keep the discussion professional, focused, and efficient, respecting the client’s busy practice schedule.

```
[00:00 - 03:00]  1. Welcome, Business Context & Client Objectives
[03:00 - 09:00]  2. Live Website Demonstration & Walkthrough
[09:00 - 12:00]  3. Review of Practice Services & Professional Details
[12:00 - 14:00]  4. Google Business Profile & Local Search Review
[14:00 - 17:00]  5. Commercial Proposal & Scope Clarity
[17:00 - 20:00]  6. Action Decisions, Next Steps & Target Launch Date
```

### 2.2 Natural Spoken Opening Script (To Say Aloud)
> *"Good morning / afternoon, CA Kavitha. Thank you very much for taking time out of your schedule today. Based on the practice profile and credentials you shared, my team has designed and built a working website prototype for Kavitha & Associates.*  
> *The entire website is built around your visiting-card identity—dignified forest green and warm white—and is tailored specifically to present your dual FCA and CMA qualifications with the statutory dignity required under ICAI standards.*  
> *Today, I’d love to walk you through the live demo on my screen, gather your direct feedback on the layout and services, confirm a few practical office details, and agree on our launch plan. Does that sound good?"*

### 2.3 Demonstration Order & Screen Flow
To present the website logically and persuasively, demonstrate the screens in this exact sequence:

1. **Home Page (`/`) — First Impressions & Dignified Identity:**
   - Highlight the clean typography (`Cormorant Garamond` serif headings with `Plus Jakarta Sans` body), the emerald-and-gold visual balance, and the immediate credibility of the partner card.
   - Show that the site avoids flashy popups or generic stock templates, presenting an established, authoritative advisory presence.
2. **Audit & Assurance Spotlight (`/services/audit-assurance`) — Statutory Depth:**
   - Demonstrate the dedicated spotlight page detailing the 9 audit specializations (Statutory, Internal, Tax 44AB, Concurrent, Stock/Inventory, Due Diligence, Turnover, Compliance Review, Management).
   - Point out the statutory tags (Companies Act 2013, Income Tax Act, Banking Norms) that build instant confidence with corporate clients, banks, and regulators.
3. **Practice Services Portfolio (`/services`) — Breadth of Advisory:**
   - Walk through the 5 categorized practice cards: Income Tax, GST, Corporate & MCA Affairs, RERA Certification, and Advisory & Consulting.
   - Show how clear bullet points make it easy for prospective business clients to identify required services.
4. **Partner & Firm Profile (`/about`) — Qualifications & Ethics:**
   - Showcase the biographical profile celebrating CA KavithaVijay SRJ’s credentials (B.Com, FCA, CMA).
   - Emphasize the clear ICAI compliance statement and commitment to professional independence and client confidentiality.
5. **Geographic Footprint (`/locations`) — Managing Branch vs. Reach:**
   - Show how Tirupati is prominently established as the Principal Practice Chambers, while Chennai, Bengaluru, Hyderabad, and Coimbatore are framed as active regional client coverage corridors.
   - Explain how this builds regional prestige while remaining fully transparent and compliant with ICAI rules on branch offices.
6. **Direct Consultation Desk & WhatsApp Integration (`/contact`):**
   - Click the phone number to demonstrate native smartphone dialing.
   - Click the email address to demonstrate immediate email client launch.
   - Demonstrate the interactive consultation inquiry form: show how it compiles the prospective client’s name, entity type, service interest, and city into a clean, pre-filled WhatsApp message routed directly to CA Kavitha’s desk with zero third-party database storage.
7. **Mobile Responsiveness Check:**
   - Switch browser view to mobile viewport (iPhone/Android width) to demonstrate the smooth collapsible navigation drawer, easy thumb access, and distortion-free readability.

---

## 3. Commercial Proposal & Pricing Clarity

### 3.1 Transparent Commercial Structure
The commercial proposal is structured into distinct, transparent tiers. There are no hidden fees, recurring lock-ins, or inflated hosting markups.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           COMMERCIAL PROPOSAL SUMMARY                           │
├─────────────────────────────────────────────────┬───────────────────────────────┤
│ Core Package: Professional Website Development  │ ₹5,000  (One-time fee)        │
│ Optional Add-on: Google Business Profile Setup  │ ₹3,000  (One-time fee)        │
│ Third-Party Costs: Domain & Static Cloud Host   │ At Cost (Paid to Registrars)  │
├─────────────────────────────────────────────────┼───────────────────────────────┤
│ COMBINED TOTAL OPTIONS:                         │                               │
│ • Option A: Website Development Only            │ ₹5,000  + Domain (~₹800-1200) │
│ • Option B: Website + Google Business Profile   │ ₹8,000  + Domain (~₹800-1200) │
└─────────────────────────────────────────────────┴───────────────────────────────┘
```

### 3.2 Package Breakdowns & Detailed Inclusions

#### Package 1: Professional Business Website — ₹5,000 (One-Time)
- **Included Scope:**
  - Complete, responsive business website custom-built for Kavitha & Associates.
  - 7 structured content routes + 404 error recovery page:
    1. Home (`/`)
    2. About Partner & Practice (`/about`)
    3. Practice Services Portfolio (`/services`)
    4. Statutory Audit & Assurance Spotlight (`/services/audit-assurance`)
    5. Commercial Industries Served (`/industries`)
    6. Practice Chambers & Regional Reach (`/locations`)
    7. Direct Consultation Desk & Contact (`/contact`)
  - Integration of approved partner credentials, firm profile, and service descriptions.
  - Native click-to-call links for both phone numbers (+91 96263 50900 / 95421 53906).
  - Native clickable email link (`cakavithasrj@gmail.com`).
  - Interactive WhatsApp consultation desk routing inquiries directly to `+91 96263 50900`.
  - Comprehensive technical on-page SEO: title tags, meta descriptions, OpenGraph social cards, and Schema.org `AccountingService` JSON-LD structured data.
  - Search engine indexing assets: `robots.txt` and `sitemap.xml`.
  - Fast, secure static hosting setup on high-reliability cloud infrastructure (Netlify, Cloudflare Pages, or Vercel).
  - One consolidated round of post-demo revisions to fine-tune text, contact details, or layout prior to final deployment.

#### Package 2 (Optional Add-On): Google Business Profile Setup & Optimization — ₹3,000 (One-Time)
- **Included Scope:**
  - Assistance in claiming, creating, or optimizing the official Google Business Profile for Kavitha & Associates.
  - Entry of verified legal business name, exact physical address in Tirupati, and accurate business categories (`Chartered Accountant` as primary, `Tax Consultant` as secondary).
  - Configuration of operating hours, official contact numbers, and verified website link.
  - Addition of approved practice service categories matching the website.
  - Upload of client-provided office photographs and logo.
  - Configuration of service areas covering Chennai, Bengaluru, Hyderabad, and Coimbatore as regional corridors (without misrepresenting them as physical branches).
  - Delivery of an easy-to-follow guide on requesting authentic client reviews and managing the profile.
  - *Crucial Clarification:* Google verification methods (phone, video call, postcard) and local ranking algorithms are solely controlled by Google LLC and cannot be guaranteed by any third party.

#### Separate Third-Party Expenses (Payable Directly by Client)
- **Domain Registration:** Approximately ₹800 to ₹1,200 per year (for `.com` or `.in` purchased directly from registrars such as Namecheap, Cloudflare, or GoDaddy). The domain remains 100% owned and controlled by the client.
- **Web Hosting:** Hosted on high-performance static cloud networks (Cloudflare Pages / Netlify). For standard professional firm traffic, hosting is typically **₹0 / month** on free-tier infrastructure. If specialized paid server hosting is required, it is billed at exact cost.
- **Out-of-Scope Items:** Ongoing monthly SEO retainers, unlimited content revisions, custom portal logins, interactive tax calculators requiring regular legislative maintenance, or additional web pages are not included and can be quoted separately upon request.

---

## 4. Spoken Pricing Script (Clear, Confident & Non-Pushy)

Use this script during Section 5 of the agenda to communicate value and pricing naturally:

> *"Regarding the investment for this project, we have structured it into two clear, straightforward components:*  
>  
> *First, the complete website package is a one-time fee of **₹5,000**. That covers the full design and development of all seven pages you just saw, full mobile responsiveness, the direct WhatsApp inquiry system, basic search engine setup, and deploying the site to a fast, reliable cloud host. It also includes a round of revisions so we can update any text, addresses, or photos you provide.*  
>  
> *Second, we offer an optional setup service for your **Google Business Profile on Google Maps for an additional ₹3,000**. If you choose this, we handle the entire setup: configuring your exact Tirupati location, entering your services correctly under Chartered Accountant and Tax Consultant categories, linking your website, and setting up your regional service areas. Because Google independently controls their verification and ranking algorithms, no honest consultant can promise an automatic '#1 ranking,' but we ensure your profile is completely optimized according to Google’s best practices.*  
>  
> *The only separate cost is your domain name—such as `kavithaassociates.com`—which typically costs around ₹800 to ₹1,200 a year paid directly to the registrar. That ensures you retain 100% ownership and control over your web address.*  
>  
> *If you’d like us to handle just the website, your total investment is ₹5,000 plus the domain. If you’d like us to set up your Google profile as well, it’s ₹8,000 plus the domain. The Google setup is entirely optional—you are very welcome to start with just the website today if you prefer.*  
>  
> *How does that scope and structure feel to you?"*

---

## 5. Client Question Checklist & Priority Filter

Use this checklist during the meeting to gather missing information. **Do not interrogate the client; weave these questions naturally into the conversation.**

### ⭐ THE 5 ESSENTIAL LAUNCH QUESTIONS (MUST CONFIRM TODAY)
These five questions are critical dependencies. The website cannot be launched to the public without them:

1. **[CRITICAL 1] Specific Building & Door/Suite Number in Bairagi Patteda:**  
   *The firm's GPS coordinates (13°37'09.3"N 79°25'04.9"E) pinpoint your chambers in Bairagi Patteda, Tirupati – 517501. What is the specific Door/Suite/Flat number and Building/Complex name to print on official invoices, website contact section, and Google Maps listing?*  
   *(Locality and coordinates verified; exact suite/building details needed for final postal accuracy).*
2. **[CRITICAL 2] ICAI Registration Numbers Display:**  
   *Would you like your official Firm Registration Number (FRN) and your individual Membership Number (MRN) displayed in the website footer, or should we display partner qualifications only?*  
   *(ICAI guidelines permit both; we recommend displaying FRN/MRN for enhanced institutional credibility).*
3. **[CRITICAL 3] Practice Footprint & Regional Corridors:**  
   *Are Chennai, Bengaluru, Hyderabad, and Coimbatore physical registered branch offices with local street addresses, or are they active regional client service corridors where you serve clients and travel on mandate?*  
   *(In the demo, we have framed them as 'Regional Client Coverage Corridors' to ensure 100% compliance with ICAI Section 27).*
4. **[CRITICAL 4] Preferred Domain Name & Existing Ownership:**  
   *Which web address do you prefer—such as `kavithaassociates.com`, `cakavithasrj.com`, or `kavithaassociates.in`—and do you already own any domains, or do you need us to assist you in registering one today?*
5. **[CRITICAL 5] Commercial Package Selection & Launch Target:**  
   *Would you like to proceed with the core Website Package (₹5,000) or the combined Website + Google Business Profile Package (₹8,000), and what is your target date to have the website live?*

---

### Comprehensive Practice & Branding Questions (As Time Permits)

#### Section A: Business Goals & Target Audience
- [ ] What is the single most important purpose of this website for your practice? (e.g., Establishing corporate credibility for bank empanelment, attracting startup/MSME clients, or serving as a digital visiting card?)
- [ ] Among your practice areas, which three services do you want prospective clients to notice first? (e.g., Statutory & Internal Audit, GST Litigation, Corporate/MCA compliance, RERA certification?)
- [ ] Who is your primary target clientele? (e.g., Local Tirupati MSMEs, corporate entities across South India, real estate builders, tech startups?)

#### Section B: Firm Profile & Team Representation
- [ ] Is the official, registered firm name strictly **"Kavitha & Associates"**?
- [ ] Should the website focus exclusively on CA KavithaVijay SRJ as the Senior Partner, or are there additional partners, paid chartered accountants, or senior consultants to feature?
- [ ] The supplied profile mentions *"more than ten years of robust corporate experience"*. Is this exact wording approved for the website bio, or should we specify exact years or focus areas?

#### Section C: Branding, Content & Media Assets
- [ ] Do you approve of the current forest green (`#0F3E2E`), warm white, and gold color scheme shown in the demo?
- [ ] Does the firm have an existing high-resolution logo file (vector, PDF, or PNG), or should we continue using the clean typographic "KA" seal created for the demo?
- [ ] Can you provide a professional headshot of CA KavithaVijay SRJ for the partner bio section?
- [ ] Is English-only content sufficient for your practice, or will you require bilingual content (e.g., English + Telugu) in a future phase?

#### Section D: Google Presence & Local Search Expectations
- [ ] Does Kavitha & Associates already have an active Google Maps / Google Business Profile listing?
- [ ] If yes, who in your office has manager or owner access to the Google account?
- [ ] Are you comfortable displaying your physical Tirupati office address publicly on Google Maps, or do you operate as a client-visit practice?
- [ ] Do you understand that Google independently verifies listings (via phone, video, or postal verification) and that organic rankings cannot be guaranteed?

#### Section E: Project Approvals & Administration
- [ ] Who in your firm has the final authority to approve text revisions and authorize public website launch?
- [ ] Who will approve and process payment for the domain name purchase?
- [ ] What is the preferred payment schedule (e.g., 50% advance to initiate revisions and domain setup, 50% upon public launch)?

---

## 6. Live Meeting Notes Sheet (Printable / Fillable Form)

*Use this section during the meeting to record client responses and decisions in real time.*

```
=================================================================================
                     KAVITHA & ASSOCIATES — LIVE MEETING RECORD
=================================================================================

Meeting Date: ____________________        Meeting Time: _________________________
Meeting Location / Venue: _______________________________________________________
Client Attendees: _______________________________________________________________
Consultant / Project Lead: ______________________________________________________

---------------------------------------------------------------------------------
1. PRACTICE PROFILE & CONTACT VERIFICATION
---------------------------------------------------------------------------------
Approved Legal Firm Name: _______________________________________________________
Lead Partner Name: ______________________________________________________________
Approved Qualifications: [ ] B.Com, FCA, CMA    [ ] Other: ______________________

Tirupati Chambers Physical Address (GPS Coordinates Verified):
GPS Coordinates:  13°37'09.3"N 79°25'04.9"E  (Lat: 13.61925, Lon: 79.418028)
Locality & Post:  Bairagi Patteda, Tirupati – 517501, Andhra Pradesh
Building / Complex Name: _______________________________________________________
Door / Suite / Flat No.: _______________________________________________________
Street / Cross Road:     _______________________________________________________

Official Phone 1 (Primary / WhatsApp): [ ] +91 96263 50900   [ ] Other: _________
Official Phone 2 (Alternative Voice):  [ ] +91 95421 53906   [ ] Other: _________
Official Practice Email:               [ ] cakavithasrj@gmail.com [ ] Other: _____

Firm Registration Number (FRN): ____________________  [ ] Display on Website Footer
Partner Membership Number (MRN): ___________________  [ ] Display on Website Footer

Regional Cities Classification:
[ ] Option A: Tirupati is Primary Chambers; Chennai, Bengaluru, Hyderabad, 
              Coimbatore are Regional Client Service Corridors (Recommended).
[ ] Option B: Physical branch offices exist in: _________________________________
              (Full street addresses to be supplied by client).

---------------------------------------------------------------------------------
2. WEBSITE CONTENT & DESIGN FEEDBACK
---------------------------------------------------------------------------------
Design & Color Palette:     [ ] Approved as demonstrated
                            [ ] Revisions requested: ____________________________
Logo Status:                [ ] Client will provide high-res logo file by: ______
                            [ ] Approved to use typographic "KA" seal
Partner Photograph:         [ ] Client will supply professional photo by: _______
                            [ ] Omit photo; retain text biographical profile
Service Descriptions:       [ ] Approved as demonstrated
                            [ ] Changes needed in: ______________________________
Experience Claim Wording:   [ ] Approved ("10+ Years Corporate Experience")
                            [ ] Revised wording: ________________________________

---------------------------------------------------------------------------------
3. DOMAIN & INFRASTRUCTURE DECISION
---------------------------------------------------------------------------------
Preferred Domain Name:      [ ] kavithaassociates.com     [ ] kavithaassociates.in
                            [ ] cakavithasrj.com          [ ] Other: ____________
Domain Ownership:           [ ] Client already owns this domain (Registrar: _____)
                            [ ] Consultant to assist with new registration today
Quoted Domain Cost:         ₹_______________ / year       [ ] Approved by client
Hosting Infrastructure:     [ ] Standard high-speed static cloud (₹0/mo free tier)
                            [ ] Custom hosting required: ₹_______ / yr

---------------------------------------------------------------------------------
4. COMMERCIAL PACKAGE SELECTION & PAYMENT TERMS
---------------------------------------------------------------------------------
Commercial Decision:
[ ] PACKAGE A: Professional Website Development Only ────────────── ₹5,000
[ ] PACKAGE B: Website Development + Google Business Profile Setup ─ ₹8,000
[ ] PENDING: Client will decide by: _____________________________________________

Agreed Payment Terms:
Advance Payment Amount:     ₹_______________  (Date Paid / Due: _________________)
Balance Payment Amount:     ₹_______________  (Due upon final launch authorization)
Payment Method:             [ ] UPI / Bank Transfer    [ ] Cheque    [ ] Other

Target Public Launch Date:  _____________________________________________________
Next Scheduled Follow-up:   _____________________________________________________

---------------------------------------------------------------------------------
5. ADDITIONAL MEETING NOTES & SPECIFIC CLIENT REQUESTS
---------------------------------------------------------------------------------
_________________________________________________________________________________
_________________________________________________________________________________
_________________________________________________________________________________
_________________________________________________________________________________
_________________________________________________________________________________
```

---

## 7. Decision and Action Tracker

This tracking matrix defines post-meeting responsibilities, realistic timelines, and delivery milestones.

| # | Action Item | Responsible Person | Target Due Date | Status | Notes / Instructions |
|:---:|---|:---:|:---:|:---:|---|
| **1** | Confirm building/door no. in Bairagi Patteda (GPS: 13°37'09.3"N 79°25'04.9"E) | CA KavithaVijay SRJ | To be agreed | Coordinates Verified | Locality confirmed as Bairagi Patteda – 517501; confirm building name & door number. |
| **2** | Confirm FRN & MRN numbers and footer display permission | CA KavithaVijay SRJ | To be agreed | Pending Client | Confirm whether numbers should be published publicly. |
| **3** | Confirm branch vs. service corridor status for 4 regional cities | CA KavithaVijay SRJ | To be agreed | Pending Client | Ensures compliance with ICAI Section 27. |
| **4** | Supply official firm logo (if available) & partner photograph | Client Office | To be agreed | Pending Client | If unavailable, website will retain dignified typographic styling. |
| **5** | Finalize domain selection and approve registration cost | Client / Consultant | To be agreed | Pending Client | Register preferred `.com` or `.in` name under client ownership. |
| **6** | Implement client’s feedback and text revisions in website code | Developer | To be agreed | Ready to Execute | Single consolidated revision pass to finalize all pages. |
| **7** | Configure custom domain DNS records & deploy to static cloud | Developer | To be agreed | Ready to Execute | Point DNS A/CNAME records to Netlify / Cloudflare / Vercel. |
| **8** | Verify SSL certificate and test all live forms & links | Developer | Post-Deployment | Scheduled | Test live telephone, email, WhatsApp, and meta tags on live domain. |
| **9** | Setup / optimize Google Business Profile (if Package B selected) | Consultant / Client | Post-Deployment | Conditional | Add verified address, hours, photos, and guide client through verification. |
| **10** | Conduct final pre-launch review and secure written launch sign-off | Client / Consultant | Target Launch Date | Scheduled | Client inspects live site and authorizes public launch. |

---

## 8. Scope Boundaries & Technical Governance

To maintain total transparency and protect both the firm and the consultant, project boundaries are clearly categorized below:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          PROJECT BOUNDARY CLASSIFICATION                        │
├───────────────────────────────────────┬─────────────────────────────────────────┤
│ 1. INCLUDED IN WEBSITE BASE (₹5,000)  │ 2. INCLUDED IN GOOGLE ADD-ON (₹3,000)   │
│ • 7 Content pages + 404 recovery page │ • Profile creation / claiming assistance│
│ • Partner bio & service descriptions  │ • Accurate NAP and category entry       │
│ • Click-to-call and mailto links      │ • Upload of client photos & service info│
│ • WhatsApp consultation message desk  │ • Service areas configuration (4 cities)│
│ • Basic on-page SEO & Schema.org data │ • Local review strategy guidance        │
│ • Sitemap.xml & robots.txt assets     │ • Clear explanation of Google rules     │
│ • Static cloud deployment setup       │                                         │
│ • One consolidated revision round     │                                         │
├───────────────────────────────────────┼─────────────────────────────────────────┤
│ 3. SEPARATE THIRD-PARTY COSTS         │ 4. ADDITIONAL WORK (SEPARATE ESTIMATE)  │
│ • Annual domain registration fee      │ • Additional custom pages or subpages   │
│ • Specialized paid hosting / servers  │ • Interactive tax calculators / portals │
│ • Paid stock imagery or graphic design│ • Dynamic CMS / blogging platform       │
│ • Paid third-party API services       │ • Ongoing monthly SEO retainer          │
│                                       │ • Multi-language translation engine     │
├───────────────────────────────────────┼─────────────────────────────────────────┤
│ 5. CREDENTIALS & AUTHORIZATION RULES  │ 6. EXTERNAL DEPENDENCIES & DISCLAIMERS  │
│ • PASSWORDS MUST NEVER BE WRITTEN     │ • No guaranteed #1 Google rankings      │
│ • Client uses delegated access        │ • Google controls verification methods  │
│ • Client retains full account control │ • ICAI compliance is client’s legal duty│
│ • Consultant never retains credentials│ • No guaranteed leads, traffic, or sales│
└───────────────────────────────────────┴─────────────────────────────────────────┘
```

### Critical Security & Credential Rules
- **Never Request or Record Passwords:** At no point should the client disclose or write down email passwords, registrar master passwords, or Google account credentials in meeting notes.
- **Delegated Access Protocols:** For domain DNS management and Google Business Profile configuration, the consultant will guide the client to use official, secure delegation methods (e.g., adding the consultant as a "Manager" or "DNS Manager"), or perform setup together via screenshare.
- **Client Ownership:** All domains, hosting accounts, and Google listings remain the sole property of Kavitha & Associates.

### Explicit Warranties & Results Disclaimers
- **No Search Engine Ranking Guarantees:** Search rankings depend on Google’s proprietary algorithms, searcher location, domain age, and organic prominence. No consultant can guarantee a "#1 ranking" on Google.
- **No Commercial Conversion Guarantees:** The website serves as a dignified, informational, and compliant professional presence. The consultant does not warrant specific inquiry volumes, client acquisition numbers, or practice revenue.
- **Regulatory Independence:** The consultant provides technical and design best practices aligned with public ICAI guidelines. Final statutory and professional compliance remains the professional responsibility of the practicing chartered accountant.

---

## 9. Pre-Launch & Handover Checklist

This checklist tracks every operational checkpoint from demo to final public handover.

| # | Inspection Item | Current Status | Verification Source / Evidence |
|:---:|---|:---:|---|
| **1** | **Client Content Approval** | ⏳ *Pending Client* | Awaiting final review of service descriptions, partner biography, and experience claims. |
| **2** | **Contact Details Verification** | ✅ **Verified** | Primary phone (`+91 96263 50900`), alternate phone (`+91 95421 53906`), and email (`cakavithasrj@gmail.com`) verified in `firmData.ts`. |
| **3** | **Address & GPS Location (Bairagi Patteda)** | 📍 **Coordinates Verified** | GPS `13°37'09.3"N 79°25'04.9"E` mapped to Bairagi Patteda, Tirupati – 517501; confirm building name and door no. |
| **4** | **Regional Office Classification** | ⚠️ *Needs Confirmation* | Currently labeled as *"Regional Client Coverage Corridors"* in demo; client must confirm no formal branch registration is claimed. |
| **5** | **ICAI Disclaimers & Ethics Review** | ✅ **Implemented** | Mandatory non-solicitation disclaimer implemented in footer; zero superlatives, fee cards, or fake reviews in codebase. |
| **6** | **Domain Registration & Ownership** | ⏳ *Pending Client* | Preferred domain name to be confirmed and registered under client ownership. |
| **7** | **Mobile & Desktop Responsiveness** | ✅ **Verified** | Tested across 5 viewports (320px, 375px, 768px, 1024px, 1440px). Touch targets ≥ 44px, zero horizontal overflow. |
| **8** | **Interactive Communication Links** | ✅ **Verified** | Click-to-call (`tel:`), mailto, and WhatsApp URL generation verified in `verify-site.cjs` and automated tests. |
| **9** | **Technical SEO & Structured Data** | ✅ **Verified** | Dynamic `<title>` and `<meta description>` via `SEOHead.tsx`, OpenGraph cards, and Schema.org JSON-LD verified in build. |
| **10** | **Search Engine Discovery Assets** | ✅ **Verified** | `public/robots.txt` and `public/sitemap.xml` authored and included in production build bundle. |
| **11** | **Host Rewrite & SPA Routing Rules** | ✅ **Verified** | `public/_redirects` (Netlify/Cloudflare) and `vercel.json` (Vercel) created to prevent deep refresh 404 errors. |
| **12** | **Deployment Authorization & Handover** | ⏳ *Pending Client* | Final sign-off required prior to pointing production DNS records to cloud infrastructure. |

---

## 10. Professional Regulatory & Compliance Note

### Indian Chartered Accountancy Regulatory Framework
Kavitha & Associates is governed by the regulatory framework established under **The Chartered Accountants Act, 1949 (Act No. 38 of 1949)**, the Chartered Accountants Regulations, 1988, and the **Code of Ethics** issued by the Institute of Chartered Accountants of India (ICAI).

#### Key Ethical Requirements Implemented in Website Code:
1. **The "Pull" Model (Clause 6, Part I, First Schedule):**  
   Websites of CA firms must operate purely on a "pull" basis. Information is made available only to those who actively navigate to the site. The codebase strictly excludes automated push popups, intrusive newsletter overlays, unsolicited chat prompts, or commercial advertisement banners.
2. **Strict Prohibition on Self-Aggrandizement (Clause 7, Part I, First Schedule):**  
   The Code of Ethics strictly prohibits CA firms from using superlative descriptors such as *"Best CA in Andhra Pradesh"*, *"Top Accounting Firm"*, or *"Lowest Price Tax Filing"*. All website copy has been scrubbed to ensure factual, dignified, and professional language.
3. **Prohibition of Fee Advertising & Commercial Solicitations:**  
   No fees, rate cards, price lists, or promotional discounts are displayed on any page of the website.
4. **No Client Names, Testimonials, or Commercial Logos:**  
   In compliance with Council guidelines, no client names, corporate logos, or client testimonials are published on the website.
5. **Office Location & Branch Registration Rules (Section 27):**  
   Under Section 27 of the Chartered Accountants Act, a CA firm opening a branch office must ensure that each office is in the separate charge of a member of the Institute. To ensure strict compliance, the website classifies Chennai, Bengaluru, Hyderabad, and Coimbatore as **"Regional Client Coverage Corridors"** rather than physical branches, unless the client confirms formal registered branch status with resident partners.

> [!IMPORTANT]
> **Regulatory Disclaimer:**  
> While the development team has conducted extensive automated and manual code audits against known ICAI website guidelines, automated tools cannot provide formal legal or regulatory certification. CA KavithaVijay SRJ is requested to conduct a final review of all published copy, credentials, and practice disclosures to ensure complete alignment with currently applicable ICAI Council notifications.

---

## 11. Consultant’s Quick Pre-Meeting Cheat Sheet

Keep this one-page summary in mind when walking into the meeting:

1. **The Core Message:**  
   *"We have built a working, elegant, mobile-friendly website that respects your professional dignity as an FCA and CMA, avoids cheap marketing gimmicks, and makes it effortless for corporate and MSME clients to reach your desk."*
2. **The Demo Strategy:**  
   Start with the Home hero → showcase the 9 Audit specializations → walk through the 5 practice areas → demonstrate the WhatsApp consultation desk on mobile.
3. **The Commercial Rule:**  
   The website package is **₹5,000**. The Google Business Profile setup is an **optional ₹3,000**. Domain is paid directly at cost (~₹800–₹1,200). Never pressure the client on the Google add-on.
4. **The Security Rule:**  
   Never ask for or record passwords. All access is handled via delegated manager permissions or shared screen setup.
5. **The Five Essential Confirmations for Launch:**  
   - 1. Complete Tirupati street address and PIN code.
   - 2. ICAI FRN and MRN display permission in footer.
   - 3. Confirmation that Chennai/Bengaluru/Hyderabad/Coimbatore are client service corridors (not physical branches).
   - 4. Preferred domain name (`.com` or `.in`).
   - 5. Decision on commercial package (Website ₹5,000 vs. Website+GBP ₹8,000) and target launch date.

---
*End of Client Meeting Document — Kavitha & Associates*
