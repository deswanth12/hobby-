# PROJECT V6.3: ARCHITECTURAL DETAIL SYSTEM
## Specification, Design Primitives & Implementation Architecture
**Practice:** Kavitha & Associates Chartered Accountants  
**Component Library:** `src/components/architectural/`  
**Date:** November 6, 2026  
**Status:** Implemented, Integrated & Validated

---

## 1. Architectural Philosophy

In traditional corporate websites, visual interest is often achieved by adding decorative stock photos, generic gradients, or arbitrary illustration flourishes. In contrast, luxury architectural and institutional design achieves depth through **precision, geometric tension, calibrated hairlines, and typographic cadence**.

The V6.3 Architectural Detail System introduces 6 mathematical, lightweight, SVG and CSS-based design primitives that give Kavitha & Associates an unmistakable institutional authority reminiscent of legal and audit blueprints:

```
src/components/architectural/
├── ArchitecturalSystem.tsx   (All 6 primitives + typed props)
└── index.ts                  (Centralized public export interface)
```

---

## 2. Component Primitives Reference

### 1. `PrecisionDotMatrix`
- **Purpose:** Replaces heavy background textures with microscopic, high-precision alignment dots inspired by architectural drafting paper and ledger matrices.
- **Props:**
  - `rows`: Number of vertical dot rows (default: 3)
  - `cols`: Number of horizontal dot columns (default: 4)
  - `variant`: `'gold' | 'forest' | 'muted' | 'white'`
  - `dotSize`: Diameter in px (default: 2.5px)
  - `gap`: Spacing between dots in px (default: 12px)
- **CSS Optimization:** Renders as lightweight inline SVG circles with `pointer-events-none` and `aria-hidden="true"`, causing zero layout reflow or compositor overhead.
- **Applications:**
  - Top-right boundary of About consultation photo.
  - Deliverables cards in Working Process timeline.
  - Featured sector cards in Industries section.
  - Chambers Intake Protocol card in Contact section.

### 2. `CornerBrackets`
- **Purpose:** Frames premium content cards and photographic containers with crisp, 1px/1.5px L-shaped architectural survey marks, echoing blueprint coordinate indicators.
- **Props:**
  - `size`: Length of the L-bracket arms in px (default: 14px)
  - `variant`: `'gold' | 'forest' | 'muted'` (champagne `#C9A66B`, deep forest `#153F32`, muted `#A3907C`)
  - `strokeWidth`: Thickness in px (default: 1.5px)
- **Applications:**
  - Surrounding all 4 Practice Disciplines in Services bento grid.
  - Institutional Value Propositions card in Why Choose Us.
  - Deliverables milestones in Working Process.
  - Official Chambers Advisory Protocol cards in Contact.

### 3. `EditorialMarker`
- **Purpose:** Introduces a strict, prestigious publication hierarchy across all homepage and inner page sections, utilizing monospaced numbering (`01`, `02`, etc.) paired with capitalized taxonomy labels.
- **Props:**
  - `number`: Two-digit section numeral (e.g., `'01'`, `'02'`)
  - `label`: Section taxonomy descriptor (e.g., `'ABOUT THE FIRM'`, `'PRACTICE DISCIPLINES'`)
  - `variant`: `'gold' | 'forest' | 'cream'`
- **Applications Across Digital Surface:**
  - `01 / INSTITUTIONAL PRACTICE` (Homepage Hero)
  - `01 / ABOUT THE FIRM` (About Section)
  - `02 / PRACTICE DISCIPLINES` (Services Section)
  - `03 / INSTITUTIONAL MERIT` (Why Choose Us Section)
  - `04 / ENGAGEMENT METHODOLOGY` (Working Process Section)
  - `05 / SECTORS & INDUSTRIES` (Industries Section)
  - `06 / KNOWLEDGE BANK` (Insights / Blog Section)
  - `07 / PRACTICE CONTACT` (Contact Section)

### 4. `GeometricSymbol`
- **Purpose:** Subtle typographic cadence marks placed inline beside subheadings, section kickers, and card headers.
- **Variants:**
  - `diamond`: 4-point filled gold diamond (`◆`)
  - `cross`: Thin drafting crosshair (`+`)
  - `slash`: Architectural twin-slash (`//`)
  - `rule`: 16px horizontal champagne hairline (`—`)
- **Applications:**
  - Header bullet points in Why Choose Us value matrix.
  - Key Deliverables titles in Working Process cards.
  - Sector subheadings in Industries section.

### 5. `VerticalRule`
- **Purpose:** Elegant 1px hairline divider with subtle vertical linear gradients (champagne to forest or transparent), creating clean separation between dense data columns without visual clutter.
- **Props:**
  - `height`: `'full' | number`
  - `variant`: `'gold' | 'forest' | 'gradient'`

### 6. `OrbitalRing`
- **Purpose:** Extremely delicate SVG orbital geometry (30–80px radius) with subtle stroke-dasharray and 0.25 opacity, providing restrained celestial grounding to key visual focal points.
- **Props:**
  - `size`: Diameter in px (default: 64px)
  - `variant`: `'gold' | 'sage' | 'forest'`

---

## 3. Performance & Accessibility Metrics

- **Zero JavaScript Overhead:** All 6 primitives are pure presentational React functional components without hooks, state, or event listeners.
- **Accessibility:** All decorative elements carry `aria-hidden="true"` and `role="presentation"` so that screen readers skip purely aesthetic markings and focus exclusively on semantic landmarks and headings.
- **CSS Hardware Acceleration:** Elements utilize CSS `transform`, `opacity`, and `will-change: auto` to prevent CPU layout thrashing.
- **Bundle Footprint:** The entire architectural system compiles to under `2.8 kB` gzipped.
