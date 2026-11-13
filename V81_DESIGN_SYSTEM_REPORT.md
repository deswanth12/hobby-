# V8.1 DESIGN SYSTEM SPECIFICATION: "THE BOTANICAL LEDGER"
**Brand:** Kavitha & Associates, Chartered Accountants  
**System Name:** The Botanical Ledger V8.1  
**Tokens File:** `src/index.css` & `tailwind.config.js`  

---

## 1. Visual Philosophy & Design Language
The Botanical Ledger is an institutional design system reflecting the permanence, discipline, and prestige of traditional British-Indian chartered accountancy chambers. It merges deep botanical evergreens with warm archival paper textures, hand-finished antique bronze hairlines, and chiseled display typography.

### Core Atmospheric Principles
1. **Dignified Restraint:** Generous whitespace, disciplined mathematical proportions (65–75ch reading widths, 16:10 editorial photography), and elimination of aggressive tech gradients.
2. **Material Authenticity:** Surfaces inspired by heavyweight linen ledger paper (`#FAF7F0`), parchment ivory (`#F1EBDD`), and deep oxblood/walnut ink (`#35271F`).
3. **Architectural Grounding:** Hand-fitted brass corner brackets, subtle hairline dividers, and double-bezel frames echoing institutional library glass and bronze plaques.

---

## 2. Master Color Tokens & Contrast Register
| Token Name | Hex Code | Role in System | WCAG 2.1 Contrast & Target Surface |
| :--- | :--- | :--- | :--- |
| **Deep Evergreen** | `#071B14` | Primary dark surface, hero, footer, intake | 15.02:1 against Ivory text (AAA) |
| **Forest Green** | `#183529` | Secondary dark surface, dark buttons, cards | 11.45:1 against Ivory text (AAA) |
| **Botanical Accent** | `#294B39` | Subtle dark borders, interactive hovers | 8.21:1 against Ivory text (AAA) |
| **Warm Ivory** | `#F1EBDD` | Primary page surface, background wash | Background for dark text |
| **Ledger Paper** | `#FAF7F0` | Card surfaces, article reading background | Background for dark text |
| **Walnut Brown** | `#35271F` | Primary text, article H1, section titles | 12.09:1 against Ivory (AAA Pass) |
| **Slate Charcoal** | `#525954` | Body text, metadata, secondary captions | 6.06:1 against Ivory (AA/AAA Pass) |
| **Antique Bronze** | `#B49A64` | Primary accent, corner brackets, badges | 6.59:1 against Evergreen (AA Pass) |
| **Dark Bronze** | `#7E5E1E` | High-contrast bronze text on Ivory surfaces | 5.04:1 against Warm Ivory (AA Pass) |
| **Muted Border** | `#D8D0BE` | Structural hairlines, subtle dividers | Subtle non-text border |

---

## 3. Typography Scale & Hierarchy
- **Display Serif (Headlines & Chambers Titles):** `Cormorant Garamond`, `Playfair Display`, Georgia, serif.
- **Editorial Sans (Body, Navigation & Data):** `Inter`, system-ui, sans-serif.
- **Monospace Registry (Codes & Statutory Markers):** `JetBrains Mono`, `SFMono-Regular`, monospace.

### Fluid Type Clamps
- `font-editorial-h1`: `clamp(2rem, 4vw + 1rem, 3.25rem)` · Line height: 1.15
- `font-editorial-h2`: `clamp(1.5rem, 2.5vw + 1rem, 2.25rem)` · Line height: 1.2
- `font-editorial-h3`: `clamp(1.25rem, 1.5vw + 0.75rem, 1.625rem)` · Line height: 1.25
- `font-editorial-body`: `clamp(0.875rem, 0.5vw + 0.75rem, 1.0625rem)` · Line height: 1.7
- `font-editorial-meta`: `0.75rem (12px)` · Tracking: `0.08em` · Uppercase

---

## 4. UI Components & Architectural Accents
1. **Corner Brass Brackets:** `4px` top-left and bottom-right L-shaped brass corners (`#B49A64`) framing key cards.
2. **Double-Bezel Framing:** 2px interior gutter with double hairline borders for high-value photography.
3. **Stretched Link Overlays:** 100% clickable surface area (`absolute inset-0 z-10`) with zero dead click zones.
4. **Touch Target Standard:** Strict adherence to `>= 44px` height across all interactive elements (`min-h-[44px]`).
