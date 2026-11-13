# V6.8 Comprehensive Design System Specification
## The Architectural & Editorial Identity for Kavitha & Associates

**Project:** Kavitha & Associates, Chartered Accountants  
**Working Directory:** `C:\kavatha ca`  
**Date:** November 2026  
**Aesthetic World:** Deep Evergreen, Antique Bronze & Warm Ivory Editorial  
**Reference Influence:** Laperruta & Associates Design Principles  

---

## 1. Design Direction & Structural Overview

The visual direction moves away from standard green-and-cream templates to an **architectural editorial identity** defined by:

1. **Dark Evergreen Hero & Master Sections:** Establishing instant gravitas, institutional authority, and high aesthetic differentiation.
2. **Alternating Section Composition:** Clean transitions between Deep Evergreen (`#071B14`), Warm Ivory (`#F1EBDD`), and Forest Green (`#183529`) prevent cognitive fatigue and maintain optimal reading ergonomics.
3. **Double-Bezel Hardware Enclosures:** Important cards and interactive modules feature a machined, double-bezel framing structure with concentric corner radii.
4. **Restrained Editorial Typography:** Massive Cormorant Garamond serif headings with selective italic emphasis paired with clean, utilitarian Inter body copy.
5. **Tactile Micro-Physics:** Subtle settle-in image zooms (700ms), pill buttons with kinetic arrow translation (`translate-x-0.5`), and 100% clickable stretched overlay links.

---

## 2. Token Architecture & Variable Registry

### 2.1 CSS Variables (`src/index.css`)
```css
:root {
  /* V6.8 Deep Evergreen & Antique Bronze Identity */
  --color-deep-evergreen: #071B14;
  --color-forest-green: #183529;
  --color-botanical-green: #294B39;
  --color-antique-bronze: #B49A64;
  --color-antique-bronze-hover: #9E844E;
  --color-antique-bronze-dark: #7E5E1E;
  --color-warm-ivory: #F1EBDD;
  --color-warm-ivory-card: #FAF7F0;
  --color-walnut-brown: #35271F;
  --color-soft-sage: #AAB4A0;
  --color-muted-border: #D8D0BE;
  
  /* Retained Canonical Compatibility Aliases */
  --brand-forest-canonical: #153f32;
  --brand-deep-canonical: #102d25;
  --brand-gold-canonical: #c3a66b;
  --brand-ivory-canonical: #f5f1e8;
  --brand-charcoal-canonical: #252b27;
  --brand-secondary-canonical: #747a73;
  --brand-border-canonical: #e5e1d8;
}
```

### 2.2 Tailwind Extension Configuration (`tailwind.config.js`)
```javascript
colors: {
  evergreen: {
    DEFAULT: '#071B14',
    deep: '#071B14',
    surface: '#0C241B',
    light: '#133025',
  },
  bronze: {
    DEFAULT: '#B49A64',
    hover: '#9E844E',
    dark: '#7E5E1E',
    border: 'rgba(180, 154, 100, 0.3)',
  },
  ivory: {
    DEFAULT: '#F1EBDD',
    warm: '#F1EBDD',
    card: '#FAF7F0',
    border: '#D8D0BE',
  },
  walnut: {
    DEFAULT: '#35271F',
    muted: '#4A3B32',
  },
  sage: {
    DEFAULT: '#AAB4A0',
    light: '#C5CDC0',
  }
}
```

---

## 3. Section-by-Section Homepage Composition

```
┌────────────────────────────────────────────────────────────────────────┐
│ SECTION A: MASTER HERO (Deep Evergreen #071B14)                        │
│ • Architectural vertical lines & radial gradient highlight             │
│ • Monumental Cormorant Garamond title:                                 │
│   "Clarity in Finance. Confidence in Every Decision." (Italic emphasis)│
│ • Uppercase Antique Bronze kicker: "CHARTERED ACCOUNTANTS • TIRUPATI"  │
│ • Primary CTA: Antique Bronze pill with dark evergreen text            │
│ • Secondary CTA: Hairline bronze outline button with ivory text        │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION B: FIRM INTRODUCTION (Warm Ivory #F1EBDD)                      │
│ • Walnut Brown typography on warm ivory canvas                         │
│ • Factual institutional credentials: Big 4 heritage, MNC audit rigor   │
│ • 3-Image editorial photo collage in double-bezel frame                │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION C: PRACTICE DISCIPLINES (Warm Ivory with Ivory Cards)          │
│ • Structured grid of approved practice areas:                          │
│   Statutory Audit, Internal Audit, Direct Tax, GST, Corporate, RERA   │
│ • Double-bezel cards with subtle borders (#D8D0BE) and bronze accents  │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION D: WHY KAVITHA & ASSOCIATES (Deep Evergreen #071B14)           │
│ • Factual institutional pillars: Fiduciary Rigor, Partner Stewardship  │
│ • Dark background with bronze divider rules and soft sage tags         │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION E: WORKING APPROACH (Warm Ivory #F1EBDD)                       │
│ • 3 Clean, sequential stages:                                          │
│   1. Entity Appraisal & Scope                                          │
│   2. Statutory Verification & Ledgers                                  │
│   3. Formal Opinion & Filing                                           │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION F: INSTITUTIONAL LEADERSHIP (Warm Ivory #F1EBDD)               │
│ • Neutral Leadership Crest placeholder (KV / KA)                       │
│ • Verified partner credentials: B.Com, CA, CMA AIR 49 (ICMAI)         │
│ • Strict privacy preservation (zero personal IDs or member numbers)   │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION G: REGULATORY INSIGHTS & ARTICLES (Warm Ivory Canvas)          │
│ • 16:10 aspect-locked cover images with settle-in zoom                 │
│ • Floating category pill over linear scrim                             │
│ • Cormorant Garamond serif titles with hover underline                 │
│ • 100% full-surface stretched overlay link clickability                │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION H: CONTACT & OPERATING CHAMBERS (Deep Evergreen #071B14)       │
│ • Physical chambers: Bairagi Patteda, Tirupati                         │
│ • Regional corporate coverage distinguished from physical address      │
│ • Accessible consultation intake form with phone and email             │
├────────────────────────────────────────────────────────────────────────┤
│ SECTION I: INSTITUTIONAL FOOTER (Deep Forest Green #183529)           │
│ • Required statutory ICAI disclosures, verified credentials, links     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Component Micro-Interaction Specifications

1. **Primary Button (Antique Bronze):**
   - Base: `bg-[#B49A64] text-[#071B14] font-semibold rounded-full px-6 py-3 shadow-sm`.
   - Hover: `hover:bg-[#9E844E] hover:shadow-md transition-all duration-300`.
   - Active: `active:scale-[0.98]`.
   - Trailing Arrow: Embedded in a circular chip (`w-7 h-7 rounded-full bg-[#071B14]/10`), translating `translate-x-0.5` on hover.

2. **Secondary Button (Outline):**
   - Base: `border border-[#B49A64]/60 text-[#F1EBDD] font-medium rounded-full px-6 py-3`.
   - Hover: `hover:bg-[#B49A64]/10 hover:border-[#B49A64] transition-all duration-300`.

3. **Article Cards:**
   - Image frame: `aspect-[16/10] overflow-hidden rounded-t-xl relative`.
   - Image transform: `transition-transform duration-700 ease-out group-hover:scale-105`.
   - Card lift: `hover:-translate-y-1 hover:shadow-lg transition-all duration-300`.
   - Click target: `<Link to={...} className="absolute inset-0 z-10" />`.

---

## 5. Accessibility & Performance Guardrails

- **WCAG AA Compliance:** Every text-to-background contrast ratio meets or exceeds **4.5:1** (body) and **3:1** (large headers). Antique Bronze on Ivory is strictly avoided for text.
- **Hardware Acceleration:** Animations target exclusively `transform` and `opacity`. Zero layout thrashing.
- **Touch Ergonomics:** All interactive buttons and links enforce minimum bounding boxes of **44 × 44 px**.
- **Reduced Motion:** Fully integrated `@media (prefers-reduced-motion: reduce)` fallbacks disable transitions and scale transforms instantaneously.
