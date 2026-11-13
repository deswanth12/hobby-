# V7.0 Design System Specification: The Botanical Ledger

**Project:** Kavitha & Associates, Chartered Accountants  
**Working Directory:** `C:\kavatha ca`  
**Date:** November 2026  
**Author:** Principal Design Systems Engineer & Frontend Architect  
**Scope:** Design Token Dictionary, Typography Scales, Component Architecture, Motion Rules, and Accessibility Ratios

---

## 1. Design Token Dictionary & Palette Architecture

The V7.0 design system establishes eight foundational color tokens engineered for high-contrast legibility, material authenticity, and institutional elegance:

| Token Name | Hex Code | Functional Role | Surface Mapping |
| :--- | :---: | :--- | :--- |
| **`evergreen`** | `#071B14` | Primary Dark Canvas | Hero background, navigation bar, footer |
| **`forestgreen`** | `#183529` | Secondary Dark Tone | Card borders on dark, header accents, dark badges |
| **`botanicalgreen`**| `#294B39` | Mid-Green Accent | Hover highlights, subtle gradients, focus borders |
| **`bronze`** | `#B49A64` | Primary Metallic Accent| Primary CTA buttons, step markers, card borders |
| **`warmivory`** | `#F1EBDD` | Primary Light Canvas | Reading sections, about, services, inner pages |
| **`ivorycard`** | `#FAF7F0` | Light Surface Fill | Bento card containers, summary insets |
| **`walnut`** | `#35271F` | Light Canvas Typography| Primary headlines and body copy on ivory |
| **`softsage`** | `#AAB4A0` | Secondary Botanical Tint| Subtle decorative tag lines, muted chips |
| **`mutedborder`** | `#D8D0BE` | Hairline Structural Rule| Section dividers, double-bezel borders on light |

---

## 2. Mathematical Color Contrast Audit Matrix

Every color combination in the interface was validated against WCAG 2.1 relative luminance standards:

$$L = 0.2126 \times R + 0.7152 \times G + 0.0722 \times B$$
$$\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$$

| Foreground Element | Foreground Hex | Background Hex | Calculated Contrast | WCAG Rating | Usage Rule |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Hero Headlines / Nav** | `#F1EBDD` | `#071B14` | **15.02:1** | **AAA** | Primary text on Deep Evergreen |
| **Editorial Body / Headings**| `#35271F` | `#F1EBDD` | **12.09:1** | **AAA** | Primary text on Warm Ivory |
| **Card Subtitles / Excerpts**| `#4A3B32` | `#FAF7F0` | **10.24:1** | **AAA** | Body copy on Ivory Cards |
| **Muted Metadata / Dates** | `#7A6A5E` | `#FAF7F0` | **5.38:1** | **AA** | Dates, tags, reading times |
| **Primary CTA Button** | `#071B14` | `#B49A64` | **6.59:1** | **AA / AAA Large**| Dark text on Antique Bronze pill |
| **Secondary Button Outline** | `#F1EBDD` | `#071B14` | **15.02:1** | **AAA** | Ivory outline button on evergreen |
| **BANNED: Bronze on Ivory** | `#B49A64` | `#F1EBDD` | **2.28:1** | **FAIL** | **FORBIDDEN FOR TEXT** (Decorative only) |

> [!CAUTION]
> **Enforced Lint Rule:** Bronze (`#B49A64`) text on Warm Ivory (`#F1EBDD`) is strictly banned across all stylesheets. On light surfaces, Antique Bronze is exclusively permitted on non-text borders, hairline rules, and backgrounds where dark evergreen text is overlaid.

---

## 3. Typography Hierarchy & Micro-Metrics

The typographic engine pairs high-contrast display serif with clean grotesque sans:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TYPOGRAPHIC HIERARCHY                           │
├────────────────────────────────────────────────────────────────────────┤
│ • Display H1:   Cormorant Garamond, 48–64px, Leading 1.05–1.1, Italic   │
│ • Section H2:   Cormorant Garamond, 32–40px, Leading 1.15, Semi-Bold   │
│ • Card H3:      Cormorant Garamond / Inter, 20–24px, Leading 1.25       │
│ • Body Text:    Inter, 16–18px, Leading 1.6–1.75, Regular (400)         │
│ • Micro Labels: Inter, 11–13px, Tracking +0.15em, Uppercase, Medium     │
└────────────────────────────────────────────────────────────────────────┘
```

### Scale Specifications
- **Display Heading 1:** `text-4xl sm:text-5xl lg:text-6xl font-editorial-heading leading-[1.1] tracking-tight`. Includes curated italic accent phrases (*"Confidence in Every Decision"*).
- **Section Heading 2:** `text-2xl sm:text-3xl lg:text-4xl font-editorial-heading font-semibold text-[#35271F]`.
- **Card Heading 3:** `text-xl font-editorial-heading font-bold text-[#35271F] group-hover:text-[#183529]`.
- **Editorial Body:** `text-base sm:text-lg text-[#4A3B32] font-editorial-body leading-relaxed`.
- **Metadata & Eyebrows:** `text-xs uppercase tracking-widest font-semibold text-[#B49A64]`.

---

## 4. Component Architectural Blueprints

### 4.1 Tactile Action Pill Button
```tsx
<Link
  to="/contact"
  className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#B49A64] hover:bg-[#9E844E] text-[#071B14] font-semibold text-xs tracking-wider uppercase transition-all duration-300 shadow-sm hover:shadow-md"
>
  <span>Request Consultation</span>
  <span className="w-5 h-5 rounded-full bg-[#071B14] text-[#B49A64] flex items-center justify-center transform group-hover:translate-x-1 transition-transform duration-300">
    &rarr;
  </span>
</Link>
```

### 4.2 Hairline Outline Button
```tsx
<Link
  to="/services"
  className="inline-flex items-center px-7 py-3.5 rounded-full border border-[#B49A64]/40 hover:border-[#B49A64] text-[#F1EBDD] hover:bg-[#B49A64]/10 text-xs font-semibold tracking-wider uppercase transition-all duration-300"
>
  Explore Practice Areas
</Link>
```

### 4.3 Double-Bezel Architectural Card
```tsx
<div className="relative p-2 rounded-2xl border border-[#D8D0BE] bg-[#F1EBDD]/50 shadow-sm">
  <div className="p-8 rounded-xl bg-[#FAF7F0] border border-[#D8D0BE]/60">
    {/* Card Content */}
  </div>
</div>
```

---

## 5. Kinetic Motion & Hardware Acceleration

In accordance with `fixing-motion-performance`:
- **Compositor Isolation:** Layer transitions strictly modulate `transform` and `opacity`.
- **Hover Scale Budget:** Cover images scale smoothly to `scale-105` over 700ms with a `cubic-bezier(0.16, 1, 0.3, 1)` easing.
- **Subpixel Anti-Aliasing:** Cards utilize `backface-visibility: hidden` and `transform: translateZ(0)` to prevent text jitter during scale transitions.
- **Vestibular Accessibility:** Full `@media (prefers-reduced-motion: reduce)` bypass:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, ::before, ::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```

This system codifies the visual rules of **The Botanical Ledger**, guaranteeing that every screen rendered communicates custom, agency-level craftsmanship.
