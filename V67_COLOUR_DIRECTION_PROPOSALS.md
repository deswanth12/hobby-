# V6.7: Master Colour Direction Proposals & Design Systems
## Architectural Tokens, Color Psychology & Mathematical WCAG Contrast Specifications

**Project:** Kavitha & Associates, Chartered Accountants  
**Working Directory:** `C:\kavatha ca`  
**Client Mandate:**  
1. Rich, professional, sophisticated identity.
2. Simple but premium combinations exploring **Rich Brown & Botanical Green**.
3. One alternative professional backup palette outside brown/green.
4. Clean, elegant, easy-to-understand visual systems.

**Author:** Antigravity Senior UI/UX Creative Director & Lead Design Auditor  

---

## 1. Executive Palette Architecture & Strategy

Modern financial institutions serving high-net-worth individuals, institutional lenders, and multi-state corporations require visual systems that inspire trust, stability, and enduring prestige. The client's rejection of generic corporate blues and desire to explore rich brown and botanical green provides an opportunity to create a deeply distinctive identity.

When properly balanced:
- **Rich Browns (Walnut, Espresso, Dark Chocolate)** evoke stability, organic grounding, heritage, and fiscal prudence.
- **Botanical Greens (Forest, Heritage Sage, Spruce)** symbolize continuous economic growth, compliance vitality, and renewal.
- **Warm Canvas Surfaces (Ivory Parchment, Alabaster, Linen)** replace stark, eye-straining digital white with tactile editorial luxury.

We have engineered four cohesive design directions:
- **Concept A: Walnut & Forest Botanical** (Rich, Deep, Authoritative — The Premier Recommendation)
- **Concept B: Deep Chocolate & Muted Sage** (Warm, Sophisticated, High-End Editorial)
- **Concept C: Botanical Emerald & Raw Umber** (Vibrant Botanical, Modern Architectural Precision)
- **Concept D: Alternative Modern Sovereign** (Architectural Slate & Royal Cognac — Non-Brown/Green Backup)

---

## 2. Comprehensive Token Specifications

```
+-----------------------------------------------------------------------------------------------+
| THE FOUR V6.7 BRAND DIRECTIONS                                                               |
|                                                                                               |
| CONCEPT A: WALNUT & FOREST BOTANICAL (Balanced, Grounded Authority)                           |
| [Walnut #2A1D17] [Forest #1E382B] [Ivory #FBF9F4] [Sage #4A6B56] [Border #E6DFD5]             |
|                                                                                               |
| CONCEPT B: DEEP CHOCOLATE & MUTED SAGE (Warm Editorial Luxury)                                |
| [Espresso #1E140E] [Muted Sage #3D5647] [Alabaster #F8F6F0] [Bronze #8C6737] [Border #E8E2D8]|
|                                                                                               |
| CONCEPT C: BOTANICAL EMERALD & RAW UMBER (Crisp Botanical Precision)                          |
| [Spruce #0F251E] [Raw Umber #32251D] [Linen #F9F9F6] [Mint #1E6B52] [Border #E1E5E1]         |
|                                                                                               |
| CONCEPT D: ARCHITECTURAL SLATE & COGNAC (Alternative Modern Backup)                           |
| [Slate #1A222D] [Cognac #A65D37] [Chalk #F6F7F9] [Indigo #2B3B4E] [Border #E2E6EC]           |
+-----------------------------------------------------------------------------------------------+
```

---

### Concept A: Walnut & Forest Botanical
**Design Theme:** Balanced Organic Authority & Fiscal Grounding.  
**Inspiration:** High-end British private banks, heritage legal chambers, and sustainable wealth management.

#### Color Tokens:
| Token Name | Value | Purpose | WCAG Contrast on Background |
| :--- | :--- | :--- | :--- |
| `--bg-canvas` | `#FBF9F4` | Warm Ivory Parchment canvas | — |
| `--bg-card` | `#FFFFFF` | Crisp White card elevation | — |
| `--text-primary` | `#2A1D17` | Deep Warm Walnut Brown | **15.51:1** on Canvas / **16.32:1** on White (AAA) |
| `--text-muted` | `#5C524B` | Warm Umber Slate | **7.22:1** on Canvas (AAA) |
| `--brand-primary` | `#1E382B` | Forest Botanical Green | **12.68:1** (White on Forest) (AAA) |
| `--brand-secondary`| `#2A1D17` | Warm Walnut Brown | **16.32:1** (White on Walnut) (AAA) |
| `--accent-sage` | `#4A6B56` | Soft Heritage Sage | **5.66:1** on Canvas (AA Normal) |
| `--border-subtle` | `#E6DFD5` | Warm Hairline Stone divider | Non-text structural boundary |
| `--badge-bg` | `rgba(30,56,43,0.08)` | Botanical tint badge container | High readability |

---

### Concept B: Deep Chocolate & Muted Sage
**Design Theme:** Warm Editorial Luxury & Artisanal Precision.  
**Inspiration:** European boutique advisory houses, bespoke wealth trusts, and CARVI-style approachable warmth elevated to institutional corporate standards.

#### Color Tokens:
| Token Name | Value | Purpose | WCAG Contrast on Background |
| :--- | :--- | :--- | :--- |
| `--bg-canvas` | `#F8F6F0` | Soft Warm Alabaster canvas | — |
| `--bg-card` | `#FFFFFF` | Pure Off-White card surface | — |
| `--text-primary` | `#1E140E` | Espresso Dark Chocolate | **16.73:1** on Canvas / **18.08:1** on White (AAA) |
| `--text-muted` | `#5E534B` | Espresso Taupe | **6.90:1** on Canvas (AA Normal; near AAA) |
| `--brand-primary` | `#3D5647` | Muted Heritage Sage | **8.01:1** (White on Sage) (AAA) |
| `--accent-bronze` | `#8C6737` | Antique Bronze Gold | **4.73:1** on Canvas (AA Normal) |
| `--border-subtle` | `#E8E2D8` | Warm Sandstone divider | Structural clarity |
| `--badge-bg` | `rgba(140,103,55,0.1)` | Bronze tint container | High-end refinement |

---

### Concept C: Botanical Emerald & Raw Umber
**Design Theme:** Modern Botanical Precision & Architectural Rigor.  
**Inspiration:** Contemporary Scandinavian financial studios, clean architectural practices, and progressive ESG advisory firms.

#### Color Tokens:
| Token Name | Value | Purpose | WCAG Contrast on Background |
| :--- | :--- | :--- | :--- |
| `--bg-canvas` | `#F9F9F6` | Porcelain Linen canvas | — |
| `--bg-card` | `#FFFFFF` | Crisp Optical White card | — |
| `--text-primary` | `#0F251E` | Deep Botanical Spruce | **15.27:1** on Canvas / **16.11:1** on White (AAA) |
| `--text-muted` | `#4D5954` | Deep Spruce Charcoal | **6.93:1** on Canvas (AA Normal; near AAA) |
| `--brand-primary` | `#0F251E` | Deep Botanical Spruce | **16.11:1** (White on Spruce) (AAA) |
| `--brand-secondary`| `#32251D` | Deep Raw Umber | **14.04:1** on Canvas (AAA) |
| `--accent-mint` | `#1E6B52` | Verdant Botanical Mint | **6.07:1** on Canvas (AA Normal) |
| `--border-subtle` | `#E1E5E1` | Muted Olive-Stone divider | Hairline separation |

---

### Concept D: Alternative Modern Sovereign (Non-Brown/Green Backup)
**Design Theme:** Sovereign Modernity & Corporate Statesmanship.  
**Inspiration:** High-tier international corporate advisors, institutional rating agencies, and elite appellate law practices.

#### Color Tokens:
| Token Name | Value | Purpose | WCAG Contrast on Background |
| :--- | :--- | :--- | :--- |
| `--bg-canvas` | `#F6F7F9` | Studio Warm Chalk canvas | — |
| `--bg-card` | `#FFFFFF` | Crisp White card surface | — |
| `--text-primary` | `#1A222D` | Deep Architectural Slate | **14.95:1** on Canvas / **16.02:1** on White (AAA) |
| `--text-muted` | `#556272` | Muted Charcoal Slate | **5.80:1** on Canvas (AA Normal) |
| `--brand-primary` | `#1A222D` | Deep Architectural Slate | **16.02:1** (White on Slate) (AAA) |
| `--accent-cognac` | `#A65D37` | Royal Cognac / Warm Amber Copper| **4.62:1** on Canvas / **4.95:1** (White on Cognac) (AA) |
| `--accent-indigo` | `#2B3B4E` | Slate Indigo | **11.45:1** on White (AAA) |
| `--border-subtle` | `#E2E6EC` | Cool Grey hairline border | Architectural line |

---

## 3. Mathematical Contrast Verification Matrix (WCAG 2.1)

All calculations follow the official W3C relative luminance formula:
$$\text{Luminance } L = 0.2126 \cdot R_{lin} + 0.7152 \cdot G_{lin} + 0.0722 \cdot B_{lin}$$
$$\text{Contrast Ratio } CR = \frac{L_{brightest} + 0.05}{L_{darkest} + 0.05}$$

| Combination | Hex 1 | Hex 2 | Calculated Ratio | WCAG AA (4.5:1) | WCAG AAA (7.0:1) | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Concept A: Primary Text on Canvas** | `#2A1D17` | `#FBF9F4` | **15.51:1** | PASS | PASS | Exceeds AAA |
| **Concept A: Primary Text on Card** | `#2A1D17` | `#FFFFFF` | **16.32:1** | PASS | PASS | Exceeds AAA |
| **Concept A: Sage Accent on Canvas** | `#4A6B56` | `#FBF9F4` | **5.66:1** | PASS | — | Meets AA |
| **Concept A: Muted Text on Canvas** | `#5C524B` | `#FBF9F4` | **7.22:1** | PASS | PASS | Exceeds AAA |
| **Concept A: White Text on Forest CTA**| `#FFFFFF` | `#1E382B` | **12.68:1** | PASS | PASS | Exceeds AAA |
| **Concept B: Primary Text on Canvas** | `#1E140E` | `#F8F6F0` | **16.73:1** | PASS | PASS | Exceeds AAA |
| **Concept B: Sage Accent on Canvas** | `#3D5647` | `#F8F6F0` | **7.42:1** | PASS | PASS | Exceeds AAA |
| **Concept B: Bronze Accent on Canvas**| `#8C6737` | `#F8F6F0` | **4.73:1** | PASS | — | Meets AA |
| **Concept B: White Text on Sage CTA** | `#FFFFFF` | `#3D5647` | **8.01:1** | PASS | PASS | Exceeds AAA |
| **Concept C: Primary Text on Canvas** | `#0F251E` | `#F9F9F6` | **15.27:1** | PASS | PASS | Exceeds AAA |
| **Concept C: Mint Accent on Canvas** | `#1E6B52` | `#F9F9F6` | **6.07:1** | PASS | — | Meets AA |
| **Concept C: White Text on Spruce CTA**| `#FFFFFF` | `#0F251E` | **16.11:1** | PASS | PASS | Exceeds AAA |
| **Concept D: Primary Text on Canvas** | `#1A222D` | `#F6F7F9` | **14.95:1** | PASS | PASS | Exceeds AAA |
| **Concept D: Cognac Accent on Canvas**| `#A65D37` | `#F6F7F9` | **4.62:1** | PASS | — | Meets AA |
| **Concept D: White Text on Slate CTA** | `#FFFFFF` | `#1A222D` | **16.02:1** | PASS | PASS | Exceeds AAA |
| **Concept D: White Text on Cognac CTA**| `#FFFFFF` | `#A65D37` | **4.95:1** | PASS | — | Meets AA |

**Result:** Zero accessibility failures across all four proposed color directions.

---

## 4. Typography Scale & Hierarchy

To avoid illegibility across mobile screens, every concept implements a strict type floor:
- **No text below 12px (0.75rem)**. Helper labels and badges sit comfortably at `12px` / `13px` with generous letter-spacing (`0.05em`).
- **Body text sits at 15px - 17px (`0.9375rem` - `1.0625rem`)** with a 1.6 to 1.7 line-height.
- **Section Headings scale responsively** from `28px` on mobile to `42px` on desktop.
- **Hero Headline sits at `40px` (mobile) to `56px` (desktop)** with tight, authoritative letter-spacing (`-0.025em`).
