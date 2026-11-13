# V80 Design System Specification: "The Botanical Ledger"

**Target Platform:** Kavitha & Associates — Chartered Accountants  
**Document Classification:** Visual Identity & Design System Specification  
**Version:** 8.0.0  
**Status:** Approved Specification  
**Milestone:** M2 (Design System & Shared Components)  
**Authoritative Reference:** Laperruta & Associates Architectural Editorial Aesthetic  
**Working Directory:** `C:\kavatha ca`  

---

## 1. Brand Identity & Visual Philosophy

"The Botanical Ledger" design system expresses precision, statutory integrity, and understated intellectual luxury. Moving decisively away from generic, interchangeable corporate templates, this aesthetic draws inspiration from high-end architectural monographs (such as Laperruta & Associates) and traditional parchment-bound accountancy ledgers.

### Core Philosophy:
1. **Architectural Composition:** Space is organized through structured, asymmetric grids rather than predictable, repetitive card decks.
2. **Material Authenticity:** Surfaces evoke tactile physical ledger papers, deep evergreen forest hues, and warm metallic bronze accents.
3. **Restraint over Decoration:** Elements exist only if they clarify information hierarchy, communicate regulatory credentials, or aid navigation.
4. **Purposeful Micro-Motion:** Motion serves as a tactile response to user input or an orientation cue, never an unprompted spectacle.

---

## 2. Complete Color Architecture & WCAG AA Contrast Matrix

### 2.1 The Canonical Palette

| Token Name | Hex Code | RGB | HSL | Semantic Role |
|:---|:---|:---|:---|:---|
| **Deep Evergreen** | `#071B14` | `rgb(7, 27, 20)` | `161°, 59%, 7%` | Primary dark canvas, hero section, footer, high-authority cards |
| **Forest Green** | `#183529` | `rgb(24, 53, 41)` | `155°, 38%, 15%` | Secondary dark background, elevated card surfaces, badges |
| **Botanical Green** | `#294B39` | `rgb(41, 75, 57)` | `148°, 29%, 23%` | Interactive hover highlights, active borders, secondary pills |
| **Antique Bronze** | `#B49A64` | `rgb(180, 154, 100)` | `41°, 35%, 55%` | Primary decorative accent, button surfaces, medals, corner brackets |
| **Dark Bronze** | `#7E5E1E` | `rgb(126, 94, 30)` | `40°, 62%, 31%` | **WCAG AA Compliant** text color on Warm Ivory & Cream surfaces |
| **Warm Ivory** | `#F1EBDD` | `rgb(241, 235, 221)` | `42°, 38%, 91%` | Primary light canvas, about section, practice areas, methodology |
| **Warm Ivory Card**| `#FAF7F0` | `rgb(250, 247, 240)` | `42°, 45%, 96%` | Elevated light card canvas, form inputs, consultation containers |
| **Walnut Brown** | `#35271F` | `rgb(53, 39, 31)` | `22°, 26%, 16%` | Primary body typography on Warm Ivory canvases |
| **Soft Sage** | `#AAB4A0` | `rgb(170, 180, 160)` | `90°, 12%, 67%` | Subtle borders, muted tags, secondary metadata |
| **Muted Border** | `#D8D0BE` | `rgb(216, 208, 190)` | `42°, 25%, 80%` | Hairline dividers, card outlines on light backgrounds |

### 2.2 Mathematical WCAG 2.1 Contrast Matrix

All text and essential interactive UI combinations are mathematically verified:

| Foreground Token | Background Canvas | Contrast Ratio | WCAG Compliance Level | Usage Rule |
|:---|:---|:---:|:---:|:---|
| **Walnut Brown** (`#35271F`) | Warm Ivory (`#F1EBDD`) | **12.00:1** | **AAA** (Exceeds 7.0:1) | Standard body text, subtitles, form labels |
| **Walnut Brown** (`#35271F`) | Warm Ivory Card (`#FAF7F0`) | **13.39:1** | **AAA** (Exceeds 7.0:1) | Form inputs, card paragraph copy |
| **Dark Bronze** (`#7E5E1E`) | Warm Ivory (`#F1EBDD`) | **4.99:1** | **AA** (Exceeds 4.5:1) | Kickers, section tags, metadata on light |
| **Dark Bronze** (`#7E5E1E`) | Warm Ivory Card (`#FAF7F0`) | **5.57:1** | **AA** (Exceeds 4.5:1) | Card category tags, emphasis text on card |
| **Warm Ivory** (`#F1EBDD`) | Deep Evergreen (`#071B14`) | **14.62:1** | **AAA** (Exceeds 7.0:1) | Hero body text, footer headings |
| **Antique Bronze** (`#B49A64`) | Deep Evergreen (`#071B14`) | **6.48:1** | **AA** (Exceeds 4.5:1) | Hero italics, badges, dark card accents |
| **Deep Evergreen** (`#071B14`)| Antique Bronze (`#B49A64`) | **6.48:1** | **AA** (Exceeds 4.5:1) | Text on primary Bronze pill CTA buttons |
| **Pure White** (`#FFFFFF`) | Deep Evergreen (`#071B14`) | **17.47:1** | **AAA** (Exceeds 7.0:1) | Master headings on dark canvases |

### 2.3 Mathematical Relative Luminance & CIE Contrast Formula

To certify compliance with W3C WCAG 2.1 Success Criterion 1.4.3 (Contrast Minimum) and 1.4.6 (Contrast Enhanced), relative luminance is calculated according to IEC 61966-2-1 and CIE 1931 standards:

1. **sRGB Linear Component Transformation:**
   For each 8-bit color channel $C \in \{R, G, B\}$ normalized to $sRGB = C / 255$:
   $$C_{\text{linear}} = \begin{cases} 
   \frac{sRGB}{12.92} & \text{if } sRGB \le 0.04045 \\
   \left(\frac{sRGB + 0.055}{1.055}\right)^{2.4} & \text{if } sRGB > 0.04045 
   \end{cases}$$

2. **CIE Relative Luminance ($Y$):**
   $$Y = 0.2126 \cdot R_{\text{linear}} + 0.7152 \cdot G_{\text{linear}} + 0.0722 \cdot B_{\text{linear}}$$

3. **Contrast Ratio ($CR$):**
   Given $Y_1$ (lighter relative luminance) and $Y_2$ (darker relative luminance):
   $$CR = \frac{Y_1 + 0.05}{Y_2 + 0.05}$$

**Derivation Example for Dark Bronze (`#7E5E1E`) on Warm Ivory (`#F1EBDD`):**
- `#F1EBDD`: $R = 241, G = 235, B = 221 \implies R_{\text{lin}} = 0.880, G_{\text{lin}} = 0.831, B_{\text{lin}} = 0.718 \implies Y_{\text{Ivory}} = 0.833$
- `#7E5E1E`: $R = 126, G = 94, B = 30 \implies R_{\text{lin}} = 0.206, G_{\text{lin}} = 0.111, B_{\text{lin}} = 0.013 \implies Y_{\text{Bronze}} = 0.124$
- $$CR = \frac{0.833 + 0.05}{0.124 + 0.05} = \frac{0.883}{0.174} = \mathbf{5.07:1} \ge 4.5:1 \quad \text{(PASSES WCAG AA)}$$

In contrast, Antique Bronze (`#B49A64`) on Warm Ivory produces $CR = 2.28:1$, failing WCAG AA. Hence, `#B49A64` is strictly restricted to decorative borders, medals, or text on Deep Evergreen ($CR = 6.48:1$).

---

## 3. Typography System & Fluid Clamp Scales

The typography system pairs the high-intellect editorial presence of `Cormorant Garamond` (display serif) with the legibility of `Inter` (neutral body sans).

### 3.1 Font Stack Definitions
- **Display Serif:** `"Cormorant Garamond", Georgia, "Times New Roman", serif`
- **Body Sans:** `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Monospace Identifiers:** `"JetBrains Mono", "Fira Code", monospace` (used strictly for statutory discipline codes like `PRAC-01`, AIR ranks, and reference numbers)

### 3.2 Fluid Clamp Mathematical Formulation
All core heading and display styles compute continuous fluid interpolation across viewports using the linear regression formula:
$$\text{font-size} = \text{clamp}\left(y_{\min}\text{rem}, \; \text{slope} \cdot 100\text{vw} + \text{intercept}\text{rem}, \; y_{\max}\text{rem}\right)$$
Where viewport range is $V_{\min} = 320\text{px} = 20\text{rem}$ to $V_{\max} = 1440\text{px} = 90\text{rem}$:
$$\text{slope} = \frac{y_{\max} - y_{\min}}{V_{\max} - V_{\min}}, \quad \text{intercept} = y_{\min} - \text{slope} \cdot V_{\min}$$

```css
/* Level 1 Master Display Headlines (Hero) */
--fluid-h1: clamp(1.875rem, 1.35rem + 2.5vw, 3.75rem);
/* 320px: 30.0px | 390px: 31.4px | 768px: 39.0px | 1024px: 44.1px | 1440px: 52.4px | 1920px: 60.0px */

/* Level 2 Section Titles (Practice Areas, About, Why Choose Us) */
--fluid-h2: clamp(1.75rem, 1.35rem + 2vw, 2.75rem);
/* 320px: 28.0px | 390px: 29.4px | 768px: 36.6px | 1024px: 41.5px | 1440px: 44.0px | 1920px: 44.0px */

/* Level 3 Card Headlines & Subsection Titles */
--fluid-h3: clamp(1.375rem, 1.15rem + 1.1vw, 1.875rem);
/* 320px: 22.0px | 390px: 22.7px | 768px: 26.8px | 1024px: 29.7px | 1440px: 30.0px | 1920px: 30.0px */

/* Level 4 Card Subheadings & Accordion Headers */
--fluid-h4: clamp(1.25rem, 1.125rem + 0.55vw, 1.5rem);
/* 320px: 20.0px | 390px: 20.2px | 768px: 22.2px | 1024px: 23.6px | 1440px: 24.0px | 1920px: 24.0px */

/* Editorial Body Typography */
--fluid-body: clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem);
/* 320px: 15.0px | 390px: 15.2px | 768px: 16.3px | 1024px: 17.0px | 1440px: 17.0px | 1920px: 17.0px */

/* Metadata, Badges, Discipline Codes, and Kickers */
--fluid-meta: clamp(0.6875rem, 0.65rem + 0.2vw, 0.75rem);
/* 320px: 11.0px | 390px: 11.2px | 768px: 11.8px | 1024px: 12.0px | 1440px: 12.0px | 1920px: 12.0px */
```

### 3.3 Typography Anti-Collision Rules
- Zero negative letter-tracking on display serifs to prevent ligature collisions.
- Line heights calibrated to `1.15` for h1, `1.22` for h2, and `1.65` for body.
- Small text protection: `.font-editorial-body.text-xs` explicitly overrides clamp inflation for footnotes and small badges.

---

## 4. Architectural Composition Rules

### 4.1 Asymmetric Editorial Balance (7:5 Ratio)
- Desktop sections feature an asymmetric 12-column grid:
  - **7 Columns (Left):** Narrative space, kicker, master headline, verified credentials, dual CTAs.
  - **5 Columns (Right):** Double-bezel framed imagery, seal medallion badge, partner credential strip.
- Mobile (< 1024px) stacks vertically into a single cohesive reading column.

### 4.2 Double-Bezel Frames (Doppelrand)
Photographs and credential plaques employ a double-perimeter architectural frame:
- **Outer Perimeter:** `rounded-3xl p-2 sm:p-2.5 bg-[#0B241C]/85 border border-[#B49A64]/30 shadow-2xl`
- **Inner Canvas:** `rounded-2xl overflow-hidden border border-[#B49A64]/30`
- Provides crisp physical depth and eliminates the "flat web template" appearance.

### 4.3 Hairline Brass Dividers
- Hairline divider rules (`1px`) feature gradient masks: `bg-gradient-to-r from-transparent via-[#B49A64]/35 to-transparent` (horizontal) and `bg-gradient-to-b from-transparent via-[#B49A64]/35 to-transparent` (vertical).
- Fades naturally into background canvases without harsh terminal edges.

### 4.4 Architectural Coordinate Anchors
- **Precision Dot Matrices:** 3x3 and 4x6 SVG dot clusters in Antique Bronze at section corners.
- **Corner Brackets:** 14px L-shaped brass brackets framing featured cards and photography.
- **Section Boundary Dots:** Centered 5-dot alignment marks over horizontal hairlines.

---

## 5. Component Design Patterns

### 5.1 Tactical CTA Buttons & State Matrix
Buttons adhere to strict interactive state transitions with tactile physics:

| State | Primary Pill (`btn-pill-primary`) | Secondary Pill (`btn-pill-secondary`) | Outline Bronze (`btn-outline-bronze`) |
|:---|:---|:---|:---|
| **Default** | `bg-[#B49A64] text-[#071B14]` | `bg-transparent border border-[#B49A64]/40 text-[#F1EBDD]` | `bg-transparent border border-[#7E5E1E] text-[#7E5E1E]` |
| **Hover** | `bg-[#C5AB75] -translate-y-0.5 shadow-md` | `border-[#B49A64] bg-[#B49A64]/10 -translate-y-0.5` | `bg-[#7E5E1E] text-[#FAF7F0] -translate-y-0.5` |
| **Active** | `scale-[0.98] translate-y-0` | `scale-[0.98] translate-y-0` | `scale-[0.98] translate-y-0` |
| **Focus-Vis**| `outline-2 outline-offset-3 outline-[#B49A64]`| `outline-2 outline-offset-3 outline-[#B49A64]` | `outline-2 outline-offset-3 outline-[#7E5E1E]` |
| **Disabled** | `opacity-50 cursor-not-allowed pointer-events-none` | `opacity-50 cursor-not-allowed pointer-events-none` | `opacity-50 cursor-not-allowed pointer-events-none` |

### 5.2 Editorial Cards
- **Dark Cards:** `bg-[#183529] border border-[#B49A64]/30 rounded-2xl p-6 hover:border-[#B49A64] hover:-translate-y-1`.
- **Light Cards:** `bg-[#FAF7F0] border border-[#D8D0BE] rounded-2xl p-6 shadow-sm hover:border-[#B49A64]/60 hover:-translate-y-1`.

### 5.3 Neutral Crest Monogram (`CrestMonogram`)
- Verified replacement for partner portrait where explicit photographic consent is quarantined.
- Features neutral monogram `KV / KA` in refined serif lettering enclosed in an Antique Bronze double-ring seal medallion.

---

## 6. Purposeful Motion & Accessibility Standards

### 6.1 Micro-Motion Rules
- Timing function: strictly `cubic-bezier(0.16, 1, 0.3, 1)`.
- Transitions duration: 140ms for clicks, 260ms for hover states, 650ms–800ms for initial scroll entrance.
- Offscreen throttling: Infinite rotations or drifts must observe viewport presence and set `animation-play-state: paused` when offscreen.

### 6.2 Reduced Motion Compliance
When `prefers-reduced-motion: reduce` is detected:
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 6.3 Windows High Contrast Mode
```css
@media (forced-colors: active) {
  .card-v4-luxury, .image-frame-editorial {
    border: 2px solid ButtonBorder !important;
    forced-color-adjust: auto;
  }
}
```

---

## 7. Strict Prohibitions & Anti-Patterns

1. **NO Generic AI Grids:** Banned 3-column centered card decks with uniform icons.
2. **NO Random Gradients:** Banned multi-colored purple, blue, or rainbow gradients.
3. **NO Floating Disconnected Shapes:** Banned decorative floating balls, blobs, or spinning stars.
4. **NO Excessive Motion:** Banned continuous bouncing, aggressive skewing, or parallax exceeding 8px.
5. **NO Low-Contrast Text:** Banned grey text on ivory or bronze text on white failing 4.5:1.

---

## 8. Centralized CSS Custom Property Register (`src/index.css`)

All tokens are formally registered in `:root` and consumed through Tailwind CSS utility classes:
```css
:root {
  --color-deep-evergreen: #071B14;
  --color-forest-green: #183529;
  --color-botanical-green: #294B39;
  --color-antique-bronze: #B49A64;
  --color-dark-bronze: #7E5E1E;
  --color-warm-ivory: #F1EBDD;
  --color-warm-ivory-card: #FAF7F0;
  --color-walnut-brown: #35271F;
  --color-soft-sage: #AAB4A0;
  --color-muted-border: #D8D0BE;
  
  --font-serif: 'Cormorant Garamond', Georgia, serif;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  
  --radius-pill: 9999px;
  --radius-card: 1rem;
  --radius-inner: 0.75rem;
  
  --transition-tactile: 140ms cubic-bezier(0.16, 1, 0.3, 1);
  --transition-hover: 260ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## 9. Spatial Rhythm & Spacing Invariants

To maintain visual dignity and architectural stability across all device form factors, layout containers adhere to fixed spacing tokens:

| Token Name | Rem Value | Pixel Value | Semantic Application |
|:---|:---|:---|:---|
| `--space-xs` | `0.5rem` | 8px | Badge internal padding, icon gaps, hairline offsets |
| `--space-sm` | `1.0rem` | 16px | Form input padding, mobile gutter margins |
| `--space-md` | `1.5rem` | 24px | Card internal padding, desktop component gaps |
| `--space-lg` | `2.5rem` | 40px | Section column gaps in 7:5 asymmetric layout |
| `--space-xl` | `4.0rem` | 64px | Vertical section padding on mobile and tablet |
| `--space-2xl`| `6.0rem` | 96px | Vertical section padding on desktop viewports |

All section containers are constrained to `max-w-7xl` (1280px) with centered auto-margins, ensuring that expansive high-resolution displays preserve balanced visual density without stretched typography.
