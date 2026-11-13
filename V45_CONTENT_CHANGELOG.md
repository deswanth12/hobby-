# Project V4.5 Content & Structural Changelog

**Project:** Kavitha & Associates Chartered Accountants  
**Date:** November 3, 2026  
**Auditor / Remediator:** Antigravity Autonomous Engineering & Statutory Compliance Worker  
**Audit Reference:** `FINAL_CLIENT_SCOPE_AUDIT.md`  

This document logs every textual, structural, metadata, and routing modification performed in Project V4.5 to align the public website with the client-approved scope.

---

## 1. Public Route & Navigation Cleanup (Rejected Features)

### 1.1 `src/App.tsx`
* **Substance of Change**: Unmounted public route `/knowledge-bank` and removed unused `KnowledgeBankPage` component import.
* **Rationale**: Client rejected public exposure of the Knowledge Bank and interactive statutory tools. Direct requests now resolve to the dedicated 404 recovery template.
* **Code Diff**:
```diff
--- a/src/App.tsx
+++ b/src/App.tsx
@@ -26,7 +26,6 @@ import { LocationsPage } from './pages/LocationsPage';
 import { ContactPage } from './pages/ContactPage';
 import { BlogPage } from './pages/BlogPage';
 import { BlogArticlePage } from './pages/BlogArticlePage';
-import { KnowledgeBankPage } from './pages/KnowledgeBankPage';
 import { NotFoundPage } from './pages/NotFoundPage';
@@ -105,7 +104,6 @@ export const App: React.FC = () => {
               <Route path="/locations" element={<LocationsPage />} />
               <Route path="/blog" element={<BlogPage />} />
               <Route path="/blog/:slug" element={<BlogArticlePage />} />
-              <Route path="/knowledge-bank" element={<KnowledgeBankPage />} />
               <Route path="/contact" element={<ContactPage />} />
               <Route path="*" element={<NotFoundPage />} />
```

### 1.2 `src/components/Navbar.tsx`
* **Substance of Change**: Removed "Tax Calculators & Knowledge Bank" from the primary header navigation `serviceSublinks` dropdown.
* **Rationale**: Eliminates public access link across all pages on desktop and mobile menus.
* **Code Diff**:
```diff
--- a/src/components/Navbar.tsx
+++ b/src/components/Navbar.tsx
@@ -114,4 +114,3 @@
     { label: 'Company & Business Registration', path: '/services/company-registration-tirupati' },
     { label: 'Virtual CFO & CMA Services', path: '/services/virtual-cfo-tirupati' },
     { label: 'RERA Advisory & Real Estate', path: '/services/rera-consultant-tirupati' },
-    { label: 'Tax Calculators & Knowledge Bank', path: '/knowledge-bank' },
   ];
```

### 1.3 `src/components/Footer.tsx`
* **Substance of Change**: Removed Knowledge Bank link and `#knowledge-faq` homepage anchor from the footer site directory.
* **Rationale**: Prevents crawler discovery and user navigation to unmounted or rejected sections.
* **Code Diff**:
```diff
--- a/src/components/Footer.tsx
+++ b/src/components/Footer.tsx
@@ -161,6 +161,4 @@
                 <Link to="/blog" className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors">Articles & Insights</Link>
                 <Link to="/industries" className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors">Industries</Link>
-                <Link to="/knowledge-bank" className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors">Knowledge Bank & Calculators</Link>
                 <Link to="/locations" className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors">Pan-India Reach</Link>
-                <a href="/#knowledge-faq" className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors">Statutory FAQ</a>
                 <Link to="/contact" className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors">Contact</Link>
```

### 1.4 `src/pages/HomePage.tsx`
* **Substance of Change**:
  1. Removed `import { KnowledgeFAQ } from '../components/KnowledgeFAQ'`.
  2. Removed `'knowledge-faq'` from active `sectionIds` intersection observer array.
  3. Removed `Statutory FAQ` quick-jump anchor button from the sticky subnav strip.
  4. Removed Section 9 (`<div id="knowledge-faq"><KnowledgeFAQ /></div>`).
* **Rationale**: Eliminates the rejected public statutory FAQ, compliance calendar, and government portal strip from the homepage narrative while preserving all approved V4.4 sections.
* **Code Diff**:
```diff
--- a/src/pages/HomePage.tsx
+++ b/src/pages/HomePage.tsx
@@ -27,7 +27,6 @@
 import { useFirmData } from '../context/FirmDataContext';
 import { ContactForm } from '../components/ContactForm';
-import { KnowledgeFAQ } from '../components/KnowledgeFAQ';
 import { SEOHead } from '../components/SEOHead';
@@ -47,7 +46,6 @@
       'corporate-business',
       'rera-compliance',
       'advisory-consulting',
-      'knowledge-faq',
       'contact-section'
     ];
@@ -539,11 +537,0 @@
-              <a
-                href="#knowledge-faq"
-                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors duration-200 shadow-xs btn-tactile ${
-                  activeSection === 'knowledge-faq'
-                    ? 'bg-brand-forest text-brand-white border-brand-gold'
-                    : 'bg-brand-white text-brand-forest border-brand-border hover:border-brand-gold'
-                }`}
-              >
-                Statutory FAQ
-              </a>
@@ -1157,8 +1145,0 @@
-      {/* =========================================================================
-          SECTION 9: STATUTORY KNOWLEDGE & ADVISORY FAQ
-          Canvas: Surface Tint #EDE8DF (bg-brand-surface)
-          ========================================================================= */}
-      <div id="knowledge-faq" className="scroll-mt-28 scroll-reveal">
-        <KnowledgeFAQ />
-      </div>
```

### 1.5 `src/pages/ServicesPage.tsx`
* **Substance of Change**:
  1. Removed `import { StatutoryEntityAdvisor } from '../components/StatutoryEntityAdvisor'`.
  2. Removed `Entity Advisor` jump link from the services quick-navigation subnav.
  3. Removed the `<StatutoryEntityAdvisor />` interactive widget section mount.
* **Rationale**: Quarantines rejected interactive advisor tool from public presentation while keeping the underlying component preserved in the repository.
* **Code Diff**:
```diff
--- a/src/pages/ServicesPage.tsx
+++ b/src/pages/ServicesPage.tsx
@@ -10,7 +10,6 @@
 import { useFirmData } from '../context/FirmDataContext';
 import { FIRM_DATA } from '../data/firmData';
 import { SEOHead } from '../components/SEOHead';
-import { StatutoryEntityAdvisor } from '../components/StatutoryEntityAdvisor';
 import { DualArrowButton } from '../components/animations/DualArrowButton';
@@ -93,7 +92,0 @@
-              <a 
-                href="#statutory-advisor" 
-                className="min-h-[44px] inline-flex items-center px-3.5 py-2.5 rounded-full bg-brand-gold/15 border border-brand-gold/40 text-xs font-semibold text-brand-forest hover:bg-brand-gold/25 hover:text-brand-deep transition-colors shadow-xs btn-tactile"
-              >
-                Entity Advisor
-              </a>
@@ -180,5 +173,0 @@
-      {/* =========================================================================
-          INTERACTIVE STATUTORY SCOPE & ENTITY ADVISOR
-          ========================================================================= */}
-      <StatutoryEntityAdvisor />
```

---

## 2. Expunction of Statutory Guarantees

### 2.1 `src/pages/AboutPage.tsx` (Line 596)
* **Original Copy**: `Complete Legal Immunity & Clean Audit Reports`
* **Remediated Copy**: `Statutory Assurance Compliance & Objective True and Fair Reporting`
* **Regulatory Rationale**: Under the Companies Act, 2013 and ICAI Standards on Auditing (SA 700 / SA 705), an auditor cannot guarantee "legal immunity" or pre-determine a "clean" (unmodified) audit opinion prior to evidence gathering. The remediated copy reflects ethical, objective professional assurance.

### 2.2 `src/pages/CompanyRegistrationPage.tsx` (Line 235)
* **Original Copy**: `Guaranteed ROC Compliance`
* **Remediated Copy**: `Diligent Annual ROC Secretarial Compliance`
* **Regulatory Rationale**: Statutory compliance is contingent on timely client submission of financial statements and corporate registers. Promising "guaranteed" compliance creates statutory liability under the CA Act, 1949.

### 2.3 `src/pages/GSTServicesPage.tsx` (Line 236)
* **Original Copy**: `Zero Late Fee Guarantee`
* **Remediated Copy**: `Scheduled GST Compliance & Penalty Mitigation`
* **Regulatory Rationale**: Automated GSTN portal late fees and Section 50 interest are governed by strict portal timestamps. Professional firms provide scheduled compliance and mitigation support rather than commercial warranty guarantees.

---

## 3. Data Integrity & Placeholder Corrections

### 3.1 `src/pages/admin/AdminSettingsPage.tsx` (Line 339)
* **Original Placeholder**: `+91 94443 89800`
* **Remediated Placeholder**: `+91 95421 53906`
* **Rationale**: Aligned form input placeholder with the verified secondary/operations contact number established in `Firm Profile.pdf` and `firmData.ts`.

### 3.2 `src/components/WorkingProcess.tsx` (Line 81)
* **Original Alt Text**: `Continuous business advisory and dedicated Chartered Accountant team`
* **Remediated Alt Text**: `Continuous business advisory and dedicated professional audit team`
* **Rationale**: Solves misleading team representation identified in Item 142 of the audit. CA Kavitha Vijay operates as the sole qualified CA partner leading an internal professional staff.

### 3.3 Replacement of `[REDACTED_MEMBERSHIP_NO]`
* **Original UI String**: `ICAI Mem. [REDACTED_MEMBERSHIP_NO]`
* **Remediated UI String**: `Chartered Accountant (ICAI Member)`
* **Locations Updated**:
  1. `src/pages/AboutPage.tsx:444`
  2. `src/pages/AuditAssurancePage.tsx:117`
  3. `src/pages/AuditAssurancePage.tsx:284`
  4. `src/pages/LocationsPage.tsx:118`
* **Rationale**: Replaces raw brackets and placeholder tokens exposed to public website visitors with a dignified, professional designation compliant with ICAI guidelines.

---

## 4. Search Engine & AI Optimization Cleanup

### 4.1 `scripts/generate-sitemap.mjs`
* Removed `{ path: '/knowledge-bank', priority: '0.8', changefreq: 'monthly' }` from `STATIC_ROUTES`.
* Generated URL count synchronized to **16 canonical URLs**.

### 4.2 `public/sitemap.xml` & `dist/sitemap.xml`
* Regenerated and verified: `https://kavithaassociates.com/knowledge-bank` has been expunged from search engine index manifests.

### 4.3 `public/llms.txt` & `public/llms-full.txt`
* Removed `/knowledge-bank` entry and descriptions of calculator tools.
* Renumbered structured articles in `public/llms-full.txt` to maintain a sequential index (items 13 through 16).

---

## 5. Protected Disputed Information Register

The following items referenced in audit logs or external prompts were verified and intentionally preserved without modification:
1. **Disputed Phone `+91 99896 89025`**: Confirmed 0 occurrences in source code. NOT added.
2. **Domain Email `info@kavithaassociates.com`**: Kept unactivated pending DNS verification. Active inbox remains `cakavithasrj@gmail.com`.
3. **Primary Contact Data**: Primary phone `+91 96263 50900` and chambers address preserved verbatim.
4. **Operating Hours**: Preserved without speculative alteration pending client choice.
5. **Experience Timeline**: Claims of "10+ Years" preserved pending client selection of preferred chronological phrasing.
