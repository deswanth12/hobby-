# V8.1 COMPONENT ARCHITECTURE & COMPONENT TREE
**Project:** Kavitha & Associates  
**Tree Root:** `src/v8/`  
**Layout Container:** `src/v8/components/layout/PublicLayout.tsx`  

---

## 1. Directory Structure
```
src/v8/
├── adapters/
│   ├── backendAdapter.ts        # Preserved Supabase, enquiry, anti-spam, firm profile
│   └── contentAdapter.ts        # Published articles, services, FAQs, draft isolation
├── components/
│   ├── about/
│   │   └── LeadershipProfile.tsx
│   ├── common/
│   │   ├── Accordion.tsx
│   │   ├── ArchitecturalFrame.tsx
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── CrestMonogram.tsx    # Official KV/KA neutral crest monogram
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── Tabs.tsx
│   ├── forms/
│   │   └── ContactForm.tsx      # Anti-spam (honeypot + 1500ms velocity defense)
│   ├── home/
│   │   ├── ChambersIntakeSection.tsx   # id="chambers-contact"
│   │   ├── FeaturedInsightsSection.tsx # id="insights-overview"
│   │   ├── FirmIntroSection.tsx        # id="the-firm"
│   │   ├── HeroSection.tsx             # id="hero"
│   │   ├── MethodologySection.tsx      # id="methodology"
│   │   ├── PracticeAreasSection.tsx    # id="practice-areas" (8 disciplines)
│   │   ├── WhyChooseUsSection.tsx      # id="professional-approach"
│   │   └── index.ts
│   └── layout/
│       ├── BackToTop.tsx
│       ├── FloatingWhatsApp.tsx
│       ├── Footer.tsx
│       ├── MobileDrawer.tsx
│       ├── Navbar.tsx
│       ├── PublicLayout.tsx
│       ├── ScrollProgress.tsx
│       └── SkipToContent.tsx
└── pages/
    ├── AboutPage.tsx
    ├── BlogArticlePage.tsx
    ├── BlogPage.tsx
    ├── ContactPage.tsx
    ├── DynamicServiceDetailPage.tsx
    ├── HomePage.tsx
    ├── IndustriesPage.tsx
    ├── LeadershipPage.tsx       # Dedicated /leadership route
    ├── LocationsPage.tsx
    ├── NotFoundPage.tsx
    ├── ServicesPage.tsx
    ├── index.ts
    └── services/
        ├── AuditAssurancePage.tsx
        ├── CompanyRegistrationPage.tsx
        ├── GSTServicesPage.tsx
        ├── IncomeTaxPage.tsx
        ├── RERAConsultantPage.tsx
        ├── VirtualCFOPage.tsx
        └── index.ts
```

---

## 2. Component Responsibility Contracts
- **`PublicLayout`:** Renders global skip link, scroll progress indicator, primary navigation bar, main route outlet, floating WhatsApp pill, back-to-top button, and practice chambers footer.
- **`Navbar`:** Features institutional logo with crest monogram, primary links (Home, The Firm, Leadership, Services corridor dropdown, Insights, Contact), and primary CTA `Request Consultation`.
- **`MobileDrawer`:** Focus-trapped, keyboard accessible (Esc key), scroll-locked drawer with full navigational parity.
- **`CrestMonogram`:** Neutral Roman serif monogram (`KV` or `KA`) within architectural double borders and laurels, providing dignified institutional branding while strictly maintaining client privacy.
- **`ContactForm`:** Submits to backend adapter with honeypot (`website_fax_hp`), client-side velocity check (`>= 1500ms`), and XSS input sanitization.
