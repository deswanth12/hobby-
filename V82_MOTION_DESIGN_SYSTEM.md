# V8.2 The Botanical Ledger Motion Design System

**Practice Entity**: Kavitha & Associates, Chartered Accountants  
**Chambers Location**: Tirupati, Andhra Pradesh, India  
**System Specification**: V8.2 Botanical Ledger Motion Architecture  
**Release Version**: V8.2 (Production Baseline)  
**Date**: November 12, 2026 (`2026-11-12T13:51:00Z`)  
**Status**: Authoritative Architectural Standard  

---

## 1. Motion Philosophy & Institutional Aesthetic Principles

A Chartered Accountancy practice represents fiduciary stewardship, statutory rigor, confidentiality, and long-term institutional stability. Digital interfaces representing such an institution must embody these exact qualities.

The **Botanical Ledger Motion Design System** operates under a foundational principle:
> **"Felt, not seen. Motion must serve comprehension, hierarchy, and tactile assurance — never spectacle."**

### Architectural Tenets
1. **Dignified Restraint**: All transitions favor calm, deliberate deceleration over snappy or spring-loaded dynamics. Elements enter the screen with measured elegance, mimicking physical vellum parchment settling upon an executive desk.
2. **Strict Elimination of Gimmicks**:
   - Zero bounce physics, rubber-banding, or coordinate overshoots ($y > 1.0$ in cubic-bezier formulas).
   - Zero 3D tumbling cards, continuous bobbing badges, or flashy neon glows.
   - Zero unsolicited popups, intrusive flyouts, auto-playing animations, or sound triggers.
3. **Fiduciary Spatial Envelope**: Displacements are strictly bounded to modest physical distances ($\le 24\text{px}$ for section entrances, $\le 4\text{px}$ for hover lifts, and $\le 8\text{px}$ for magnetic cursor attraction). Elements never fly across the viewport.
4. **Compositor Efficiency**: Animations execute exclusively on the GPU compositor thread using CSS `transform` (`translate3d`, `scale3d`) and `opacity`. Mutating layout-triggering properties (`width`, `height`, `top`, `left`, `margin`, `padding`) is strictly prohibited.

---

## 2. Palette Integration & Contrast Harmonies

The motion design system integrates seamlessly with the verified **Botanical Ledger** color palette. When elements transition through intermediate opacity states, contrast ratios must be mathematically maintained to ensure legibility across the entire animation cycle.

### The Botanical Ledger Palette

| Color Name | Hex Token | CSS Variable Token | Role & Semantic Application |
|---|---|---|---|
| **Deep Evergreen** | `#071B14` | `--color-deep-evergreen` | Primary dark container canvas, hero background, footer, dark card surfaces |
| **Forest Green** | `#183529` | `--color-forest-green` | Elevated card surfaces, container fills, secondary dark panels |
| **Botanical Deep Accent** | `#294B39` | `--color-botanical-green` | Subtle card borders, badge backgrounds, dark hover fills |
| **Antique Bronze** | `#B49A64` | `--color-antique-bronze` | Architectural corner brackets, hairline dividers, medal accents, focus rings |
| **Dark Bronze** | `#7E5E1E` | `--color-antique-bronze-dark` | WCAG AA compliant text & badges on light ivory surfaces ($\ge 4.5:1$) |
| **Warm Ivory** | `#F1EBDD` | `--color-warm-ivory` | Primary light section canvases, about narrative, methodology backdrop |
| **Ivory Card Fill** | `#FAF7F0` | `--color-warm-ivory-card` | Light card elevated surfaces, accordion curtain interiors |
| **Walnut Brown** | `#35271F` | `--color-walnut-brown` | Primary typography on light ivory backgrounds ($\ge 12:1$) |
| **Soft Sage** | `#AAB4A0` | `--color-soft-sage` | Muted metadata tags, secondary borders, architectural watermark lines |
| **Muted Border** | `#D8D0BE` | `--color-muted-border` | Hairline dividers, subtle card bezel outlines, accordion rules |

### Mathematical Contrast Preservation
During opacity fades, intermediate alpha steps could theoretically drop contrast below statutory accessibility thresholds. The Botanical Ledger enforces strict contrast floors:

$$\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$$

- **Walnut Brown (`#35271F`) on Warm Ivory (`#F1EBDD`)**:
  - Relative Luminance $L_{\text{ivory}} = 0.825$, $L_{\text{walnut}} = 0.022$
  - Calculated Contrast Ratio: **12.09:1** (Exceeds WCAG AAA requirement of 7.0:1)
  - During entrance reveals, text maintains $\ge 4.5:1$ contrast as soon as opacity reaches $42\%$.
- **Dark Bronze (`#7E5E1E`) on Warm Ivory (`#F1EBDD`)**:
  - Calculated Contrast Ratio: **5.04:1** (Exceeds WCAG AA requirement of 4.5:1)
- **Antique Bronze (`#B49A64`) on Deep Evergreen (`#071B14`)**:
  - Calculated Contrast Ratio: **6.59:1** (Exceeds WCAG AA requirement of 4.5:1)
- **Warm Ivory (`#F1EBDD`) on Deep Evergreen (`#071B14`)**:
  - Calculated Contrast Ratio: **15.02:1** (Exceeds WCAG AAA requirement of 7.0:1)

---

## 3. Duration Hierarchy & Timing Tiers

The Botanical Ledger motion architecture divides all animations into four distinct, non-overlapping timing tiers, plus a dedicated page transition standard:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   BOTANICAL LEDGER 4-TIER TIMING SYSTEM                │
├─────────────────┬───────────────┬──────────────────────────────────────┤
│ Tier 1: Micro   │ 140ms – 320ms │ Button presses, input focus rings,   │
│                 │               │ link hovers, drawer slide (280ms)    │
├─────────────────┼───────────────┼──────────────────────────────────────┤
│ Tier 2: Macro   │ 450ms – 750ms │ Section reveals, card grid staggers, │
│                 │               │ display heading text unmasking       │
├─────────────────┼───────────────┼──────────────────────────────────────┤
│ Tier 3: Struct. │ 900ms – 1600ms│ Hairline divider expansion, SVG      │
│                 │               │ frame draw, metric count-up (1200ms) │
├─────────────────┼───────────────┼──────────────────────────────────────┤
│ Tier 4: Ambient │ 16s – 90s     │ Atmospheric pulse, slow orbital drift│
└─────────────────┴───────────────┴──────────────────────────────────────┘
```

### Detailed Duration Matrix

| Tier | Duration Constant | Value | Canonical Application |
|---|---|---|---|
| **Tier 1: Micro** | `microTap` | **140ms** | Tactile button press depression (`scale(0.98)`) |
| **Tier 1: Micro** | `microFast` | **180ms** | Form input focus ring transitions, quick tooltips |
| **Tier 1: Micro** | `microBase` | **240ms** | Action link arrows, accordion curtain opacity fade |
| **Tier 1: Micro** | `microHover` | **280ms** | Card elevation hover lift, mobile drawer slide |
| **Tier 1: Micro** | `microSlow` | **320ms** | Complex multi-property micro-interactions |
| **Tier 2: Macro** | `entranceFast` | **450ms** | Subtle image zoom transitions (`scale(1.02)`) |
| **Tier 2: Macro** | `entranceBase` | **550ms** | Individual stagger item entrance |
| **Tier 2: Macro** | `entranceDeliberate`| **650ms** | Standard `<Reveal>` container entrance (default) |
| **Tier 2: Macro** | `entranceSlow` | **750ms** | Primary editorial heading entrance |
| **Tier 3: Structural**| `lineDrawQuick` | **900ms** | Compact card divider line expansion |
| **Tier 3: Structural**| `lineDrawBase` | **1100ms**| Section `<AnimatedDivider>` line draw (default) |
| **Tier 3: Structural**| `counterBase` | **1200ms**| Statistical `<CountUp>` metric cycle (default) |
| **Tier 3: Structural**| `counterDeliberate`| **1400ms**| High-magnitude numeric currency counter |
| **Tier 3: Structural**| `lineDrawExtended`| **1600ms**| Full-width architectural banner dividers |
| **Route Transitions**| `pageTransition` | **280ms** | Route change mount opacity blend |
| **Tier 4: Ambient** | `ambientPulse` | **16,000ms**| Deep atmospheric breathing pulse (16s cycle) |
| **Tier 4: Ambient** | `ambientDrift` | **22,000ms**| Subtle background gradient translation (22s) |
| **Tier 4: Ambient** | `ambientSpin` | **38,000ms**| Continuous slow seal rotation (38s) |
| **Tier 4: Ambient** | `ambientOrbitalSlow`| **75,000ms**| Outer watermark orbital circle (75s) |
| **Tier 4: Ambient** | `ambientOrbitalReverse`| **90,000ms**| Counter-rotating inner orbit (90s) |

---

## 4. Easing Equations & Mathematical Curvature

Natural motion decelerates smoothly. The Botanical Ledger defines five mathematical cubic-bezier curves tailored to distinct physical metaphors:

```
Easing Curves Visualization:

Standard (0.22, 1, 0.36, 1)    Editorial (0.16, 1, 0.3, 1)    Micro (0.4, 0, 0.2, 1)
 1.0 ┌───────────────          1.0 ┌───────────────          1.0 ┌───────────────
     │             .               │            ..               │           ... 
     │           ..                │          ..                 │        ...    
     │         ..                  │        ..                   │     ...       
     │       ..                    │      ..                     │  ...          
 0.0 └───....────────          0.0 └──....─────────          0.0 └───────────────
     0.0          1.0              0.0          1.0              0.0          1.0
     Velvety Decel                 Exponential Decel             Crisp Mechanical
```

### Mathematical Easing Profiles

1. **Botanical Ledger Standard Ease-Out**:
   $$\text{cubic-bezier}(0.22, 1, 0.36, 1)$$
   - *Physical Metaphor*: Heavy vellum paper gliding across polished hardwood, coming to a soft, natural halt.
   - *Application*: Default for all `<Reveal>`, `<FadeIn>`, `<SlideUp>`, and card elevation hovers.
   - *Mathematical Property*: Peak velocity occurs at $t \approx 18\%$; prolonged, velvet deceleration between $t = 40\%$ and $t = 100\%$. Strict invariant: zero overshoot ($y \le 1.0$ everywhere).
2. **Editorial Ease-Out**:
   $$\text{cubic-bezier}(0.16, 1, 0.3, 1)$$
   - *Physical Metaphor*: A guillotine paper cutter or ink line drawn deliberately with a drafting pen.
   - *Application*: `<TextReveal>` mask unmasking, `<AnimatedDivider>` line drawing, and `Accordion` curtain row expansion.
   - *Mathematical Property*: Immediate steep velocity curve ($80\%$ of motion completed by $t = 35\%$), followed by long, imperceptible settling.
3. **Restrained Micro-Interaction**:
   $$\text{cubic-bezier}(0.4, 0, 0.2, 1)$$
   - *Physical Metaphor*: Mechanical actuation of a high-precision brass lever or typewriter key.
   - *Application*: Button active depression (`.btn-tactile`), tab switches, and input borders.
   - *Mathematical Property*: Symmetric S-curve providing instant tactile feedback without sluggishness.
4. **Ambient Breathing Pulse**:
   $$\text{cubic-bezier}(0.45, 0, 0.55, 1)$$
   - *Physical Metaphor*: Organic diurnal respiration or slow ocean tide.
   - *Application*: Decorative watermark orbits, atmospheric ambient background glows.
   - *Mathematical Property*: True sinusoidal symmetry for smooth continuous looping without visible inflection points.
5. **Linear**:
   $$\text{linear}$$
   - *Application*: Continuous 360-degree decorative watermark rotations where acceleration would create artificial strobing.

### Prohibited Easing Equations
The following curves are explicitly banned in the codebase:
- `cubic-bezier(0.175, 0.885, 0.32, 1.275)` (Bounce / overshoot physics)
- `cubic-bezier(0.68, -0.55, 0.265, 1.55)` (Anticipation / overshoot)
- `steps(...)` (Stepped mechanical animations)

---

## 5. Motion Boundaries & Spatial Envelopes

To prevent visual clutter, distortion, and responsive layout breakage, the motion system enforces strict physical bounds across all transform channels:

| Channel | Allowed Range | Enforcement Rule | Violation Condition |
|---|---|---|---|
| **Vertical Displacement ($\Delta y$)** | **$0\text{px}$ to $24\text{px}$** | Entrances use $16\text{px}$–$24\text{px}$; hovers use $\le 4\text{px}$ | $\Delta y > 24\text{px}$ (disruptive flight) |
| **Horizontal Displacement ($\Delta x$)** | **$0\text{px}$ to $4\text{px}$** | Link arrow icons glide max $4\text{px}$ | $\Delta x > 4\text{px}$ (breaks column alignment) |
| **Card Scale Factor ($S_{\text{card}}$)** | **$0.98$ to $1.02$** | Hover lifts scale max $1.02$; presses depress to $0.98$ | $S > 1.02$ (overlaps adjacent grid tracks) |
| **Photo Scale Factor ($S_{\text{photo}}$)** | **$1.00$ to $1.03$** | Contained overflow zoom inside rigid aspect frame | $S > 1.03$ (causes image blur or pixelation) |
| **Rotation ($\theta_{\text{content}}$)** | **Strictly $0^{\circ}$** | All typography, cards, badges, and UI controls remain $0^{\circ}$ | $\theta \ne 0^{\circ}$ (destroys readability) |
| **Rotation ($\theta_{\text{decorative}}$)** | **$0^{\circ}$ to $360^{\circ}$** | Background SVG watermark circles only; cycle $\ge 75\text{s}$ | Period $< 60\text{s}$ (creates dizzying motion) |
| **Magnetic Pull ($D_{\text{magnetic}}$)** | **$\pm 8\text{px}$ max** | Clamped displacement; disabled on touch devices | $D > 8\text{px}$ (detaches from cursor) |

---

## 6. CSS Custom Properties & Token Architecture

All Botanical Ledger motion tokens are codified in `src/v8/components/animation/motionTokens.ts` and declared globally in `src/index.css`:

### 6.1 `src/index.css` Custom Properties
```css
:root {
  /* Botanical Ledger Easing Tokens */
  --ease-botanical-standard: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-botanical-editorial: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-botanical-micro: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-botanical-ambient: cubic-bezier(0.45, 0, 0.55, 1);

  /* Botanical Ledger Duration Tokens */
  --duration-micro-tap: 140ms;
  --duration-micro-fast: 180ms;
  --duration-micro-base: 240ms;
  --duration-micro-hover: 280ms;
  --duration-entrance-fast: 450ms;
  --duration-entrance-base: 550ms;
  --duration-entrance-deliberate: 650ms;
  --duration-entrance-slow: 750ms;
  --duration-line-base: 1100ms;
  --duration-counter-base: 1200ms;
  --duration-page-transition: 280ms;
}
```

### 6.2 Keyframe Declarations
```css
/* Eager mount cascade for above-the-fold Hero LCP */
@keyframes v8HeroCascade {
  from {
    opacity: 0;
    transform: translate3d(0, 20px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

/* Hairline horizontal divider draw */
@keyframes v8LineDrawHorizontal {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

/* Hairline vertical divider draw */
@keyframes v8LineDrawVertical {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}

/* Masked typography reveal */
@keyframes v8TextRevealUp {
  from {
    opacity: 0;
    transform: translate3d(0, 105%, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

/* Form error feedback */
@keyframes v8FormErrorIn {
  from {
    opacity: 0;
    transform: translate3d(0, -3px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
```

---

## 7. Compliance & Verification Blueprint

Every motion token and keyframe declaration is validated by automated regression suites:
- `tests/v82-animation.test.mjs`:
  - Suite 3: Validates all 8 palette constants and contrast ratios.
  - Suite 4: Validates all 5 duration constants across all 4 tiers.
  - Suite 5: Validates mathematical bounds of all 4 easing curves.
  - Suite 8: Validates Hero eager cascade keyframe and duration parameters.
  - Suite 10: Validates compositor-only motion execution.

**Conclusion**: The Botanical Ledger Motion Design System establishes an immutable, production-grade standard of visual refinement, accessibility, and performance for Kavitha & Associates.
