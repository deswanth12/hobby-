# Kavitha & Associates — Official Website & Practice Portal

Professional, responsive corporate website built for **Kavitha & Associates**, Chartered Accountants & Cost Accountants, headquartered in Tirupati, Andhra Pradesh, with client service reach across South India (Chennai, Bengaluru, Hyderabad, Coimbatore) and Pan-India.

---

## 1. Quick Start & Setup

### Prerequisites
- Node.js (v18.0.0 or higher recommended, tested on v24.15.0)
- npm (v9.0.0 or higher)

### Installation & Run
```bash
# Clone or navigate to the directory
cd "c:\kavatha ca"

# Install dependencies (already executed)
npm install

# Start local development server
npm run dev

# Open in browser:
http://localhost:5173/
```

### Production Build & Verification
```bash
# Type check and build optimized bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 2. Technology Stack
- **Framework:** React 18 with TypeScript
- **Bundler & Dev Server:** Vite 5
- **Routing:** React Router v6 (SPA routing with automatic `ScrollToTop` handling)
- **Styling:** Tailwind CSS with custom corporate design tokens
- **Icons:** Lucide React
- **Typography:** Cinzel / Playfair Display (Serif) & Inter (Sans) via Google Fonts
- **SEO & Structured Data:** Schema.org `AccountingService` JSON-LD, Open Graph tags, semantic HTML5

---

## 3. Brand Identity & Design Tokens

Designed strictly according to the client's preference: **white background, green typography, gold accents, and high-trust corporate layout** inspired by CA KavithaVijay SRJ's business card.

| Design Token | Hex Code | Visual Application |
|---|---|---|
| **Deep Forest Green** (`brand-primary`) | `#0f3e2e` | Primary headings, brand emblem, navigation bar, footer |
| **Interactive Medium Green** (`brand-interactive`) | `#1b734f` | Primary buttons, active tabs, interactive links |
| **Hover Green** (`brand-hover`) | `#145c3e` | Hover states on interactive buttons |
| **Pale Green / Sage** (`brand-pale`) | `#f0f7f3` | Subtle section backgrounds, pill badges, card highlights |
| **Muted Gold** (`gold`) | `#c5a059` | Divider accents, badge borders, premium highlights |
| **Dark Charcoal** (`charcoal`) | `#22252a` | High-legibility body typography (WCAG AAA compliant) |
| **Pure White** (`white`) | `#ffffff` | Clean primary canvas and card surfaces |

---

## 4. Website Route Architecture

1. **Home (`/`):**
   - Header with contact information and practicing CA credentials
   - Hero section with value proposition: *"Trusted Financial, Tax and Compliance Support"*
   - Partner Credentials Card: **CA KavithaVijay SRJ (B.Com, FCA, CMA)**
   - **Audit Spotlight:** Independent assurance and 9 featured audit streams
   - **Comprehensive Practice Spectrum:** Income Tax, GST, ROC/MCA, RERA, and Advisory
   - **Firm Pillars:** Partner-level attention, practical expertise, ICAI ethics, timely delivery
   - **Industries We Serve:** 10 sector profiles
   - **Service Footprint:** Tirupati headquarters & 4 regional client hubs
   - **Consultation Section:** Interactive form and direct contact links
2. **About (`/about`):** Detailed firm background, partner credentials, mission, and operating vision
3. **Services (`/services`):** Full breakdown of all 5 service categories and sub-services
4. **Audit & Assurance (`/services/audit-assurance`):** Dedicated spotlight on the 9 audit disciplines
5. **Industries (`/industries`):** Tailored accounting and compliance scopes for 10 industries
6. **Locations (`/locations`):** Transparent geographic presence (Tirupati principal practice + 4 regional client hubs)
7. **Contact (`/contact`):** Full contact details, click-to-call, email, WhatsApp, and validated enquiry form
8. **404 Not Found (`*`):** Graceful fallback page

---

## 5. Contact & WhatsApp Integration

- **Click-to-Call Links:** Configured via `tel:+919626350900` and `tel:+919542153906`
- **Email Dispatch:** Configured via `mailto:cakavithasrj@gmail.com`
- **WhatsApp Integration:** Correctly encoded WhatsApp API link with pre-filled greeting:
  `https://wa.me/919626350900?text=Hello%20CA%20KavithaVijay%20SRJ...`
- **Interactive Form:** Client-side validation for Name, Phone, Email, Service Category, and Requirement. In demo mode, it prevents false expectations by clearly notifying the user that data is verified locally and provides an immediate one-click action to forward the enquiry directly into WhatsApp.

---

## 6. Client Meeting Walkthrough Script (Tomorrow Morning)

1. **Introduction (1 min):**
   > *"Good morning CA Kavitha garu. We've translated your firm's profile and visiting card into a high-trust digital presence that reflects your standing as a Fellow Chartered Accountant (FCA) and Cost & Management Accountant (CMA)."*
2. **Hero & Brand Identity (2 mins):**
   > *"Notice the white background with deep forest green typography and refined gold accents. It aligns with your brand card's trust marks: 'Trust • Expertise • Your Growth Partner'. We also prominently feature your dual credentials."*
3. **Audit Spotlight (2 mins):**
   > *"Rather than presenting routine card lists, we built a dedicated Audit Spotlight highlighting your 9 core audit practices—from Statutory and Tax Audits to Stock, Concurrent, and Due Diligence audits."*
4. **Interactive Demo (2 mins):**
   > *"Every phone link triggers a direct call on mobile, and the enquiry form automatically validates and offers an instant WhatsApp dispatch directly to your consultation number (+91 96263 50900)."*
5. **Review Questions (3 mins):**
   > *"We have a brief checklist of 5 items to review with you regarding your corporate experience phrasing, firm registration number, and preferred consultation schedule."*
