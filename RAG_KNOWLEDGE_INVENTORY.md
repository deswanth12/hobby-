# RAG Knowledge Source Inventory & Ingestion Registry

**Project:** Kavitha & Associates, Chartered Accountants  
**Date:** November 10, 2026  
**Status:** Approved Knowledge Registry Baseline  
**Scope:** Authorized Public Knowledge Sources & Strict Quarantine Boundary  

---

## 1. Inventory Policy & Criteria

The Kavitha & Associates Firm Assistant operates exclusively on **verified public information** and **published website content**. In compliance with professional ethics, privacy standards, and ICAI guidelines, the ingestion pipeline enforces strict approval and publication criteria before indexing any content.

---

## 2. Approved Public Knowledge Sources

### Category A: Core Public Website Pages

| Source ID | Title | Canonical URL | Source Type | Approved Status |
| :--- | :--- | :--- | :--- | :--- |
| `page-home` | Home & Practice Overview | `/` | Web Page | Approved / Published |
| `page-about` | About the Firm & Practice History | `/about` | Web Page | Approved / Published |
| `page-leadership` | Senior Leadership & Partner Credentials | `/leadership` | Web Page | Approved / Published |
| `page-services` | Practice Disciplines Directory | `/services` | Web Page | Approved / Published |
| `page-contact` | Chambers Coordinates & Intake | `/contact` | Web Page | Approved / Published |
| `page-locations` | Chambers Footprint & Jurisdictions | `/locations` | Web Page | Approved / Published |
| `page-industries` | Industry Sectors & Practice Scope | `/industries` | Web Page | Approved / Published |

### Category B: Six Approved Practice Corridors

| Source ID | Corridor Title | Canonical URL | Statutory Framework |
| :--- | :--- | :--- | :--- |
| `prac-01-audit` | Statutory Audit & Assurance | `/services/audit-assurance` | Companies Act, 2013; Standards on Auditing (SAs) |
| `prac-02-income-tax` | Direct Tax & Corporate ITR | `/services/income-tax-consultant-tirupati` | Income Tax Act, 1961 & CBDT Guidelines |
| `prac-03-gst` | Indirect Tax & GST Compliance | `/services/gst-consultant-tirupati` | CGST/SGST Acts, 2017 & CBIC Circulars |
| `prac-04-corporate` | Corporate Secretarial & Incorporation | `/services/company-registration-tirupati` | MCA & Companies Act, 2013 |
| `prac-05-cfo` | Virtual CFO & Management Advisory | `/services/virtual-cfo-tirupati` | Cost & Management Accounting (ICMAI Principles) |
| `prac-06-rera` | Real Estate RERA Advisory | `/services/rera-consultant-tirupati` | RERA Act, 2016 & AP RERA Rules |

### Category C: Published Editorial Insights (Blog)

| Source ID | Article Title | Slug / Canonical URL | Status | Ingestion Action |
| :--- | :--- | :--- | :--- | :--- |
| `post-corp-tax` | Corporate Tax Planning & Compliance Strategies for FY 2026-27 | `/blog/corporate-tax-planning-2026` | Published | **INGEST** |
| `post-gst-annual` | GST Annual Return & Audit Readiness Guide | `/blog/gst-annual-return-compliance` | Published | **INGEST** |
| `post-stat-audit` | Statutory Audit Guidelines & Internal Financial Controls | `/blog/statutory-audit-guidelines-2026` | Published | **INGEST** |
| `post-internal-audit` | Internal Audit Best Practices for Growing Enterprises | `/blog/internal-audit-best-practices` | **DRAFT** | **STRICTLY EXCLUDED / QUARANTINED** |

### Category D: Approved Partner Credentials Baseline

- **Managing Partner:** CA Kavitha Vijay
- **Designation:** Managing Partner & Senior Practitioner
- **Professional Degrees:** B.Com, CA (Chartered Accountant), CMA (Cost & Management Accountant)
- **Competitive Rank:** All India Rank 49 (AIR 49) in CMA Intermediate, strictly attributed to the Institute of Cost Accountants of India (**ICMAI**).
- **Professional Accreditations:** Fellow Chartered Accountant (**FCA / ICAI Practicing Fellow**), Associate Cost & Management Accountant (**ACMA / ICMAI**).
- **Pedigree & Career History:**
  - Former Big 4 Senior Auditor at **Deloitte** (statutory audits, enterprise internal controls, cross-border corporate engagements).
  - Internal Audit & Financial Controls at **Ford Motor Company** (Asia-Pacific operations, process governance).
  - 10+ Years of progressive professional experience across public practice, corporate governance, and statutory compliance.
- **Physical Chambers:** 19-12-46, 1st Floor, Near Bairagipetteda Arch, Bairagi Patteda, Tirupati, Andhra Pradesh – 517501, India.
- **Official Contact Channels:** Phone: `+91 96263 50900`, `+91 95421 53906` | Email: `cakavithasrj@gmail.com`

---

## 3. Strict Quarantine & Prohibition Register

The ingestion pipeline enforces automated filters that permanently block the following data classes from entering the knowledge store:

1. **Draft Articles:** Any article with `draft: true` (e.g. `internal-audit-best-practices.md`) is blocked.
2. **Personal Identifiers (PII):** 
   - Zero Permanent Account Numbers (PAN).
   - Zero Aadhaar numbers.
   - Zero bank account or financial details.
   - Individual ICAI membership number is permanently redacted (`[REDACTED_MEMBERSHIP_NO]`).
3. **Private Records & CVs:** Unapproved CV files, internal memos, and draft documents are excluded.
4. **Client Information:** Client names, consultation intake records, and private communications are completely barred.
5. **Administrative Secrets:** JWT session secrets, admin passwords, PBKDF2 hashes, and service keys.
