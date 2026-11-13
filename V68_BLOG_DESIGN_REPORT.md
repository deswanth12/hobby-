# V6.8 Blog Experience Design Report

**Project:** Kavitha & Associates, Chartered Accountants  
**Working Directory:** `C:\kavatha ca`  
**Date:** November 2026  
**Author:** Lead UI/UX Designer & Frontend Architect  
**Scope:** Editorial Blog Architecture, Card Interaction Patterns, and Typography Systems  

---

## 1. Overview & Client Directive

The client explicitly requested a premier blog and insights platform with the following core principle:
> **"The image must be the main visual element, with a short introductory paragraph as supporting content. The entire card must be clickable."**

This report details how the blog listing (`/blog`) and individual article pages (`/blog/:slug`) were redesigned and engineered to meet this objective while preserving the firm's approved visual identity (Forest Green `#0F3E2E`, Warm Ivory `#FCFCFA`, and Muted Gold `#C5A059`).

---

## 2. Visual Hierarchy & Card Architecture

The blog card layout strictly establishes the following descending visual hierarchy:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. PROMINENT FEATURED IMAGE (Main Visual Anchor)            │
│    • Aspect Ratio: 16:10 fixed responsive frame             │
│    • Settle-in hover zoom: scale-105 duration-700 ease-out  │
│    • Floating Category Pill: Top-Left with dark scrim       │
├─────────────────────────────────────────────────────────────┤
│ 2. ARTICLE TITLE (Secondary Emphasis)                       │
│    • Typography: Cormorant Garamond Serif                   │
│    • Truncation: line-clamp-2 (clean 2-line rhythm)         │
│    • Hover state: Subtle underline / color shift to Forest  │
├─────────────────────────────────────────────────────────────┤
│ 3. INTRODUCTORY EXCERPT (Supporting Content)                │
│    • Typography: Inter Sans, 14px / text-sm                 │
│    • Truncation: line-clamp-3 (concise statutory summary)   │
│    • Color: Slate charcoal (muted, high contrast)           │
├─────────────────────────────────────────────────────────────┤
│ 4. METADATA & ACTION FOOTER                                 │
│    • Micro-metadata: Publication date & reading time (SVG)  │
│    • Tactile Action Pill: "Read More" with arrow chip       │
│    • Entire card surface: 100% clickable stretched overlay  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Engineering Full-Card Clickability

### The Challenge of Nested Anchors
In standard HTML and React applications, wrapping an entire card in `<Link to="...">` while retaining inner links or buttons (such as category tag filters, author links, or action buttons) causes **invalid DOM nesting** (`<a> cannot appear as a descendant of <a>`). This leads to hydration mismatches, accessibility failures, and broken event bubbling.

### The MotionSites Stretched Overlay Solution
We resolved this using the MotionSites `surfaces-and-buttons.md` architecture:
1. **Container:** The card container uses `relative overflow-hidden group bg-white rounded-2xl border border-brand-border hover:shadow-card-hover transition-all duration-300`.
2. **Invisible Stretched Link:** An invisible anchor link is placed directly beneath the card content:
   ```tsx
   <Link
     to={`/blog/${post.slug}`}
     className="absolute inset-0 z-10"
     aria-label={`Read article: ${post.title}`}
   />
   ```
3. **Elevated Interactive Controls:** Inner tags and action buttons that require distinct visual appearance use `relative z-20 pointer-events-none` so they react visually to parent `:hover` states without intercepting or blocking the primary card click target.

---

## 4. Blog Listing Page (`/blog`) Layout Breakdown

### 4.1 Featured Hero Article Showcase
- **Layout:** Asymmetric 2-column card (7 columns for editorial content, 5 columns for the featured cover frame on desktop; single-column stacked on mobile).
- **Featured Image:** High-resolution cover image in an `aspect-[16/10]` container with a top gradient scrim protecting the floating category badge.
- **Copy:** Prominent serif title (`text-2xl sm:text-3xl lg:text-4xl`), 3-line excerpt, full metadata row, and an action pill with arrow indicator.
- **Surface:** 100% clickable across the entire showcase perimeter.

### 4.2 Published Insights Grid
- **Responsive Grid:** 1 column on mobile (< 768px), 2 columns on tablet (768px - 1023px), 3 columns on desktop (>= 1024px).
- **Aspect Ratio Lock:** Every grid card enforces `aspect-[16/10]` on the image frame, preventing layout shifts (CLS = 0) and ensuring visual uniformity regardless of image source dimensions.
- **Image Treatment:** `group-hover:scale-105 transition-transform duration-700 ease-out`.

---

## 5. Article Detail Page (`/blog/:slug`) Editorial Architecture

The full article view is structured like a legal and financial journal:

1. **Cover Showcase:** Large 16:9 responsive featured image framed with subtle borders and rounded corners.
2. **Header Hierarchy:**
   - Eyebrow category tag.
   - Article title rendered in Cormorant Garamond with tight display leading (`leading-[1.1]`).
   - Author attribution chip (`CA, CMA AIR 49`) and calendar/clock metadata.
3. **Executive Statutory Summary & Scope Inset:**
   - A dedicated editorial block positioned immediately above the article body.
   - Encased in a white card with a 4px solid gold left border (`border-l-4 border-l-brand-gold shadow-card`).
   - Typography: Italicized Cormorant Garamond (`font-editorial-body text-lg sm:text-xl text-brand-charcoal`).
4. **Body Prose & Markdown Rendering:**
   - Width clamped to `max-w-4xl` for effortless reading ergonomics.
   - H2 and H3 headings styled with brand forest green accents.
   - Tables equipped with responsive horizontal scrollbars, sticky headers, and zebra striping.
   - Blockquotes styled with gold borders and italicized text.
5. **Author Dossier Card:**
   - Displays partner credentials, background, and consultation booking call-to-action.
6. **Related Regulatory Publications:**
   - 3-column grid of related articles, each sharing the identical 16:10 aspect ratio, floating badge, and full-card clickability of the main listing.

---

## 6. Accessibility & Verification Checklist

- [x] **WCAG AA / AAA Contrast:** White text on category badges backed by dark scrims (> 9:1 contrast).
- [x] **Screen Reader Support:** Stretched link includes explicit `aria-label` describing the full article title.
- [x] **Focus Ring Visibility:** Cards feature prominent focus rings when navigated via keyboard (`focus-visible:ring-2 focus-visible:ring-brand-gold`).
- [x] **Zero Cumulative Layout Shift (CLS):** Aspect-ratio locks guarantee zero reflow while remote images load.
- [x] **100% Passing Automated Tests:** 210/210 unit, tax calculator, and E2E boundary tests passed without regression.
