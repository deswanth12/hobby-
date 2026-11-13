# Structured Data (Schema.org JSON-LD) Validation Report
**Firm**: Kavitha & Associates (Chartered Accountants & Cost Accountants)  
**Production Domain**: `https://kavithaassociates.com/`  
**Syntax**: JSON-LD (`application/ld+json`)  
**Standard**: Schema.org Vocabulary & Google Search Central Rich Results Specifications  
**Date**: November 3, 2026

---

## 1. Structured Data Architecture Overview

The platform uses a connected Knowledge Graph architecture where every page-level schema references the primary organization entity node (`https://kavithaassociates.com/#organization`). This enables search engines and AI crawlers to construct a unified, unambiguous knowledge graph rather than interpreting fragmented, disconnected schemas.

```mermaid
graph TD
    Org["AccountingService / Organization<br/>(@id: #organization)"] --> Founder["Person: CA Kavitha Vijay<br/>(B.Com, CA, CMA AIR 49)"]
    Org --> Website["WebSite (@id: #website)"]
    Website --> Pages["WebPage Nodes<br/>(Home, About, Services, Contact, etc.)"]
    Pages --> Breadcrumbs["BreadcrumbList Hierarchy"]
    Pages --> Services["Service & OfferCatalog Nodes<br/>(Audit, GST, Tax, ROC, CFO, RERA)"]
    Pages --> FAQs["FAQPage Nodes<br/>(Statutory Questions & Answers)"]
    Pages --> Tools["WebApplication Nodes<br/>(Income Tax & GST Calculators)"]
    Pages --> Articles["BlogPosting Nodes<br/>(Technical Regulatory Guides)"]
```

---

## 2. Core Schema Implementations & Verified JSON-LD Payloads

### A. Primary Organization Schema (`AccountingService`)
Embedded in `index.html` with `id="schema-organization"`:

```json
{
  "@context": "https://schema.org",
  "@type": "AccountingService",
  "@id": "https://kavithaassociates.com/#organization",
  "name": "Kavitha & Associates",
  "legalName": "Kavitha & Associates Chartered Accountants",
  "url": "https://kavithaassociates.com/",
  "logo": "https://kavithaassociates.com/favicon-512x512.png",
  "image": "https://kavithaassociates.com/favicon-512x512.png",
  "founder": {
    "@type": "Person",
    "@id": "https://kavithaassociates.com/about#person",
    "name": "CA Kavitha Vijay",
    "jobTitle": "Practicing Chartered Accountant & Cost Accountant",
    "honorificPrefix": "CA",
    "description": "B.Com, CA, CMA (AIR 49)"
  },
  "telephone": ["+919626350900", "+919542153906"],
  "email": "cakavithasrj@gmail.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "19-12-46, 1st Floor, Near Bairagipetteda Arch, Bairagi Patteda",
    "addressLocality": "Tirupati",
    "addressRegion": "Andhra Pradesh",
    "postalCode": "517501",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 13.6192242,
    "longitude": 79.418046
  },
  "hasMap": "https://maps.app.goo.gl/p9ToGUtxqYDCghpF6",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:30",
      "closes": "19:30"
    }
  ],
  "areaServed": [
    "Tirupati",
    "Chennai",
    "Bengaluru",
    "Hyderabad",
    "Coimbatore",
    "India"
  ],
  "knowsAbout": [
    "Statutory Audit",
    "Internal Audit",
    "Income Tax Return Filing",
    "GST Compliance & Litigation",
    "ROC & MCA Filings",
    "RERA Certifications",
    "Virtual CFO Services"
  ]
}
```

---

### B. Lead Partner Schema (`Person` on `/about`)
Defined within `AboutPage.tsx`:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://kavithaassociates.com/about#partner",
  "name": "CA Kavitha Vijay",
  "givenName": "Kavitha",
  "familyName": "Vijay",
  "jobTitle": "Managing Partner & Practicing Chartered Accountant",
  "telephone": "+919626350900",
  "email": "cakavithasrj@gmail.com",
  "url": "https://kavithaassociates.com/about",
  "sameAs": [
    "https://www.linkedin.com/in/ca-kavitha-srj-770988199",
    "https://maps.app.goo.gl/p9ToGUtxqYDCghpF6"
  ],
  "worksFor": {
    "@type": "AccountingService",
    "@id": "https://kavithaassociates.com/#organization"
  },
  "alumniOf": [
    {
      "@type": "EducationalOrganization",
      "name": "The Institute of Chartered Accountants of India"
    },
    {
      "@type": "EducationalOrganization",
      "name": "The Institute of Cost Accountants of India"
    },
    {
      "@type": "EducationalOrganization",
      "name": "Madras University"
    }
  ]
}
```

---

### C. Statutory Service Schema (`Service` & `OfferCatalog`)
Rendered on `/services`:

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Chartered Accountancy & Advisory Services",
  "provider": {
    "@type": "AccountingService",
    "@id": "https://kavithaassociates.com/#organization"
  },
  "areaServed": "Tirupati, Andhra Pradesh, India",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "CA Services Spectrum",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Statutory Company Audits & Tax Audits under Section 44AB" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Income Tax Return (ITR) Filing & Scrutiny Defense" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "GST Registration, Monthly Returns & ITC Reconciliation" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Company Incorporation & MCA / ROC Annual Filings" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "RERA Compliance & Chartered Accountant Certification" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Virtual CFO & Strategic Financial Governance" } }
    ]
  }
}
```

---

### D. Statutory FAQ Schema (`FAQPage`)
Rendered dynamically on GST, Practice, and Knowledge Bank pages:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Which businesses are legally required to undergo a Statutory Audit in India?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Under Section 139 of the Companies Act, 2013, every incorporated company (Private Limited, Public Limited, or OPC) must appoint an independent statutory auditor and have its annual accounts audited, regardless of turnover. For non-corporate entities, audit is governed by Section 44AB of the Income Tax Act."
      }
    },
    {
      "@type": "Question",
      "name": "What are the turnover limits for a Tax Audit under Section 44AB?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Under Section 44AB, Tax Audit is mandatory if business turnover exceeds ₹1 Crore, or ₹10 Crores if aggregate cash transactions do not exceed 5%. For professionals, the threshold is ₹50 Lakhs (or ₹75 Lakhs under Section 44ADA if cash receipts do not exceed 5%)."
      }
    },
    {
      "@type": "Question",
      "name": "Why do real estate developers require CA Certificates under RERA?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Under Section 4(2)(l)(D) of RERA 2016, 70% of project proceeds must be deposited in a scheduled bank escrow account. Withdrawals require a Form 3 certificate from a practicing Chartered Accountant certifying withdrawal is proportionate to completion percentage."
      }
    }
  ]
}
```

---

### E. Financial WebApplication Schema (`WebApplication`)
Rendered on `/knowledge-bank`:

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Kavitha & Associates Tax & Compliance Calculation Suite",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires modern web browser with JavaScript enabled.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "INR"
  },
  "featureList": [
    "Income Tax Comparison (Old vs New Regime FY 2025-26 / FY 2024-25)",
    "Section 87A Rebate and Marginal Relief Calculation",
    "GST Late Fee under Section 47 with Notification 19/2021-CT Caps",
    "GST Interest under Section 50 at 18% per annum on Net Cash Liability",
    "Section 44AB Tax Audit Applicability 5% Digital Transaction Assessment"
  ]
}
```

---

## 3. Strict Compliance & Negative Testing Verification

The structured data implementation adheres to stringent verification checks:

1. **Zero Invented Reviews (`aggregateRating` / `review`)**:
   * *Status*: **PASSED**. No `aggregateRating` or fake client testimonials are injected into schema.
2. **Zero Invented Prices (`priceRange`)**:
   * *Status*: **PASSED**. Artificial `priceRange: '₹₹'` was eradicated from the homepage schema.
3. **Zero Phantom Branch Offices**:
   * *Status*: **PASSED**. Only the verified physical chambers address in Tirupati is declared as `PostalAddress`.
4. **Verified Educational & Professional Affiliations**:
   * *Status*: **PASSED**. References to ICAI, ICMAI, and Madras University strictly reflect verified partner credentials.
5. **No Schema Collisions**:
   * *Status*: **PASSED**. `index.html` static schema uses `id="schema-organization"`, while runtime views manipulate `id="seo-jsonld"`.
6. **Syntax & Validator Compliance**:
   * All JSON-LD payloads comply with Schema.org specifications and parse without syntax errors.
