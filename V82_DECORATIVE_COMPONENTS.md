# V8.2 Decorative Component Architecture
## Botanical Ledger | Ambient Decorative Element System

**Firm:** Kavitha & Associates, Chartered Accountants  
**Date:** November 10, 2026  
**Implementation Directory:** `src/v8/components/decorative/`  
**Author:** Antigravity Engineering Team  

---

## 1. Overview

The V8.2 Decorative Element System provides a suite of modular, self-contained SVG and CSS components designed to bring subtle ambient depth, architectural precision, and editorial refinement to the **Botanical Ledger** design system.

All decorative components strictly follow these architectural principles:
1. **Zero Layout Impact:** All elements are non-interactive (`pointer-events-none`), accessible-hidden (`aria-hidden="true"`), and positioned without disrupting document flow.
2. **Radial Masking:** Dot grids and orbital lines incorporate radial fade masks (`maskImage: radial-gradient(...)`) so they never create harsh cutoff edges.
3. **Strict Opacity Caps:** Decorative elements operate strictly within prescribed opacity boundaries:
   - Bronze: 8% to 25%
   - Sage: 8% to 20%
   - Forest Green: 5% to 15%
4. **Hardware Acceleration:** Animations utilize GPU-composited properties (`transform: rotate(...)`, `opacity`) with `will-change: transform`.
5. **Reduced-Motion Support:** All animations immediately halt and lock to static, balanced positions when `prefers-reduced-motion: reduce` is detected.

---

## 2. Component Specifications

### 2.1 `DotGrid.tsx`
Lightweight SVG coordinate dot grid pattern rendered on a customizable grid pitch.

- **Props:**
  - `variant?: 'bronze' | 'sage' | 'forest'` (Default: `'bronze'`)
  - `dotSize?: number` (Default: `1.5` px)
  - `spacing?: number` (Default: `20` px grid pitch)
  - `width?: number | string` (Default: `300` px)
  - `height?: number | string` (Default: `300` px)
  - `fadeRadius?: number` (Default: `70` % radial gradient spread)
  - `className?: string`
- **Implementation Detail:** Generates SVG `<pattern>` with circular coordinate markers, masked by a smooth CSS radial gradient to achieve soft perimeter fading.

### 2.2 `OrbitalSphere.tsx`
Concentric and inclined elliptical orbital rings with orbital satellite accent markers and ultra-slow rotational physics.

- **Props:**
  - `size?: number` (Default: `320` px diameter)
  - `variant?: 'bronze' | 'sage' | 'mixed'` (Default: `'bronze'`)
  - `rotationDuration?: number` (Default: `75` seconds)
  - `showSatellites?: boolean` (Default: `true`)
  - `tiltAngle?: number` (Default: `-25` degrees)
  - `className?: string`
- **Animation Physics:**
  - Primary Outer Ring: Counter-clockwise 75s continuous rotation (`orbital-spin-slow`).
  - Inner Elliptical Ring: Clockwise 90s reverse rotation (`orbital-spin-reverse`).
  - Satellites: Microscopic 2.5px circular nodes pinned to orbital perimeters.

### 2.3 `ArchitecturalLines.tsx`
Precision coordinate lines, double-rule ledger dividers, vertical plumb axes, and corner framing brackets.

- **Props:**
  - `variant?: 'horizontal-rule' | 'vertical-axis' | 'double-rule' | 'corner-bracket'` (Default: `'horizontal-rule'`)
  - `color?: 'bronze' | 'sage' | 'border'` (Default: `'bronze'`)
  - `length?: number | string`
  - `withTerminalDots?: boolean` (Default: `true`)
  - `className?: string`
- **Design Use:** Used to create editorial structure between sections and establish rhythmic alignment along margins.

### 2.4 `FlowingCurves.tsx`
Delicate multi-stroke Bezier curves representing institutional momentum and organic growth.

- **Props:**
  - `width?: number | string` (Default: `800` px)
  - `height?: number | string` (Default: `200` px)
  - `variant?: 'single' | 'dual' | 'wave'` (Default: `'dual'`)
  - `color?: 'bronze' | 'sage' | 'mixed'` (Default: `'bronze'`)
  - `className?: string`
- **Implementation Detail:** Pure SVG quadratic and cubic curves rendered with fine hairline stroke widths (1px–1.5px) and linear gradient fills that fade out at the endpoints.

### 2.5 `SectionAccent.tsx`
Refined diamond section marker and hairline kicker accent.

- **Props:**
  - `variant?: 'bronze' | 'sage'` (Default: `'bronze'`)
  - `lineWidth?: number` (Default: `32` px)
  - `diamondSize?: number` (Default: `6` px)
  - `className?: string`
- **Design Use:** Positioned alongside section kicker labels (e.g., `02 / STATUTORY DISCIPLINES`, `05 / REGULATORY INSIGHTS`) to signal editorial rigor.

### 2.6 `DecorativeLayer.tsx`
Zero-leakage container wrapper that handles background containment and viewport clipping.

- **Props:**
  - `children: React.ReactNode`
  - `vignette?: boolean` (Adds subtle top/bottom gradient fade)
  - `className?: string`
- **Implementation Detail:** Configured with `absolute inset-0 overflow-hidden pointer-events-none z-0` to guarantee that decorative elements never trigger horizontal scrollbars or trap pointer events.

---

## 3. Directory Layout & Module Exports

```
src/v8/components/decorative/
├── DotGrid.tsx             # SVG coordinate dot matrix
├── OrbitalSphere.tsx       # Dual-axis geometric orbital rings
├── ArchitecturalLines.tsx  # Coordinate lines and ledger dividers
├── FlowingCurves.tsx       # Sweeping hairline Bezier curves
├── SectionAccent.tsx       # Diamond kicker accent
├── DecorativeLayer.tsx     # Viewport-safe background wrapper
└── index.ts                # Unified barrel export
```

Re-exported through the root component barrel:
```ts
// src/v8/components/index.ts
export * from './decorative';
```
