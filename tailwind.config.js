/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // PROJECT V6.8: DEEP EVERGREEN & ANTIQUE BRONZE ARCHITECTURAL IDENTITY
          evergreen: '#071B14',          // Deep Evergreen (Main dark sections & hero)
          deepergreen: '#04100C',        // Ultra-deep anchor
          forestgreen: '#183529',        // Secondary dark sections & footer
          botanicalgreen: '#294B39',     // Interactive surfaces & hover highlights
          bronze: '#B49A64',             // Antique Bronze decorative accents & CTA buttons
          bronzehover: '#9E844E',        // Antique Bronze hover
          bronzedark: '#7E5E1E',         // WCAG AA compliant dark bronze on ivory
          warmivory: '#F1EBDD',          // Main warm ivory content backgrounds
          ivorycard: '#FAF7F0',          // Elevated ivory card canvas
          walnut: '#35271F',             // Walnut brown typography on light sections
          softsage: '#AAB4A0',           // Secondary soft sage accents
          mutedborder: '#D8D0BE',        // Subtle light-section borders

          // PROJECT V4.2: WARM CREAM LUXURY PALETTE
          // Main backgrounds:
          cream: '#F5EAD8',       // Rich Cream (primary canvas & dominant warm background)
          ivory: '#F8EFDF',       // Warm Ivory (alternate sections & page foundation)
          softbeige: '#EFE0C7',   // Soft Beige (highlight & accent sections)
          warmwhite: '#FFF9EF',   // Cream Card Surface (warm, non-sterile elevated card canvas)
          white: '#FFF9EF',       // Cream Card Canvas (eliminates harsh pure white dominance)
          purewhite: '#FFFFFF',   // Pure Crisp White (strictly reserved for high-contrast elements)
          softivory: '#FFF9EF',   // Soft Ivory card surface
          tintedwhite: '#F8EFDF', // Warm Ivory tint

          // Section & Accent backgrounds:
          champagne: '#E8D5B5',   // Champagne Cream (warm luxury highlights & borders)
          softgoldcream: '#EFE0C7', // Soft Beige
          sage: '#DDE8D9',        // Light Sage (soft botanical accents & credential washes)

          // Brand canonical colors (strictly preserved):
          forest: '#153F32',      // Canonical Forest Green primary anchor
          elegant: '#1B4D3E',     // Fresh Forest Green
          deep: '#102D25',        // Canonical Deep Green
          chambers: '#102D25',    // Deep Chambers Green
          darkgreen: '#102D25',   // Deep Green
          vibrantforest: '#1B4D3E', // Fresh High-Contrast Forest

          // Accents:
          gold: '#C3A66B',        // Canonical Champagne Gold accent
          brightgold: '#D4AF37',  // Sparkling Champagne Gold highlight
          softgold: '#E8CD96',    // Soft Gold accent
          goldhover: '#DAB876',   // Highlighted gold hover

          // Typography:
          charcoal: '#302B24',    // Warm Charcoal (WCAG AAA compliant, 11.7:1 on #F5EAD8)
          secondary: '#525954',   // High-Contrast Secondary Text (WCAG AA compliant, 6.2:1)
          muted: '#68706A',       // Refined Muted Text (WCAG AA compliant, 4.6:1)

          // Borders:
          border: '#E8D5B5',      // Warm Champagne Cream Border (replaces cold grey/white border)
          surface: '#FFF9EF',     // Cream Surface Canvas
          pale: '#FFF9EF',        // Light Cream tint

          // Backward-Compatible & Verification Assertions (preserves canonical tests)
          canonicalivory: '#F5F1E8',
          canonicalcharcoal: '#252B27',
          canonicalsecondary: '#747A73',
          canonicalborder: '#E5E1D8',
          canonicalwhite: '#FFFFFF',
          primary: '#153F32',     // Canonical Forest Green
          interactive: '#153F32', // Interactive primary buttons & CTAs
          hover: '#102D25',       // Interactive hover state
          warm: '#F8EFDF',        // Warm Ivory

          // CARVI-Inspired Editorial Tokens (M1 Additive Extensions)
          carviforest: '#0F3E2E',       // Canonical CARVI Forest Green primary anchor
          carvideep: '#0A2F24',         // Canonical CARVI Deep Green
          carvichampagne: '#C5A059',    // Canonical CARVI Champagne Gold accent
          bronzegold: '#7E5E1E',        // Deep bronze gold for WCAG AA contrast on cream
          ivorylight: '#FFFDF7',        // bg-brand-ivorylight
          ivoryfoundation: '#FFFCF5',   // bg-brand-ivoryfoundation
          champagnewarm: '#FFF6E8',     // bg-brand-champagnewarm
          champagneborder: '#E6C98F',   // border-brand-champagneborder
          champagnegold: '#C9A66B',     // text-brand-champagnegold / border-brand-champagnegold
          botanical: '#356B50',         // bg-brand-botanical / text-brand-botanical
          botanicaldeep: '#183D30',     // bg-brand-botanicaldeep / text-brand-botanicaldeep
        },
        // Dedicated V6.8 Architectural Deep Evergreen & Bronze Palette
        evergreen: {
          DEFAULT: '#071B14',
          deep: '#071B14',
          forest: '#183529',
          botanical: '#294B39',
          surface: '#0B241C',
        },
        bronze: {
          DEFAULT: '#B49A64',
          hover: '#9E844E',
          dark: '#7E5E1E',
          light: '#C8B282',
        },
        walnut: {
          DEFAULT: '#35271F',
          muted: '#4D3B32',
        },
        warmivory: {
          DEFAULT: '#F1EBDD',
          card: '#FAF7F0',
          border: '#D8D0BE',
        },
        softsage: {
          DEFAULT: '#AAB4A0',
          light: '#C5CDC0',
        },
        mutedborder: {
          DEFAULT: '#D8D0BE',
        },
        // Dedicated Canonical CARVI Brand Palette
        carvi: {
          forest: '#0F3E2E',
          deep: '#0A2F24',
          champagne: '#C5A059',
          bronze: '#7E5E1E',
        },
        // Dedicated CARVI Botanical Green Scale
        botanical: {
          DEFAULT: '#356B50',           // bg-botanical, text-botanical, border-botanical
          light: '#4D8C74',
          accent: '#356B50',
          deep: '#183D30',              // bg-botanical-deep, text-botanical-deep
          dark: '#183D30',
          surface: '#FFF6E8',
        },
        // Dedicated Warm Champagne Scale
        champagne: {
          light: '#FFFDF7',
          warm: '#FFF6E8',              // bg-champagne-warm
          border: '#E6C98F',            // border-champagne-border
          gold: '#C9A66B',              // border-champagne-gold, text-champagne-gold
          DEFAULT: '#E8D5B5',
        },
        // Dedicated Warm Ivory Scale
        ivory: {
          light: '#FFFDF7',             // bg-ivory-light
          foundation: '#FFFCF5',        // bg-ivory-foundation
          warm: '#FFF6E8',              // bg-ivory-warm
          DEFAULT: '#FFFCF5',
        },
        // Dedicated Editorial Alias Scale
        editorial: {
          canvas: '#FFFDF7',
          foundation: '#FFFCF5',
          card: '#FFF6E8',
          border: '#E6C98F',
          gold: '#C9A66B',
          botanical: '#356B50',
          forest: '#183D30',
        },
        forest: {
          50: '#DDE8D9',          // Light Sage
          100: '#C8DDD2',
          200: '#A4C6B7',
          300: '#75A792',
          400: '#4D8C74',
          500: '#153F32',         // Canonical Forest Green
          600: '#1B4D3E',         // Fresh Vibrant Forest
          700: '#102D25',         // Canonical Deep Green
          800: '#102D25',
          900: '#0C201A',
          950: '#071511',
          carvi: '#0F3E2E',       // Canonical CARVI Forest Green
          carvideep: '#0A2F24',   // Canonical CARVI Deep Green
          DEFAULT: '#153F32',
        },
        gold: {
          light: '#E8CD96',       // Soft Gold
          DEFAULT: '#C3A66B',     // Canonical Champagne Gold
          bright: '#D4AF37',      // Sparkling Champagne Gold
          champagne: '#C5A059',   // Canonical CARVI Champagne Gold
          bronze: '#7E5E1E',      // Deep bronze gold for WCAG AA contrast on cream
          dark: '#7E5E1E',        // WCAG AA/AAA compliant text on cream
        },
        charcoal: {
          DEFAULT: '#302B24',     // Warm Charcoal Primary Text
          canonical: '#252B27',   // Canonical Dark Charcoal
          muted: '#525954',       // Secondary Readable Text
          light: '#68706A',       // Refined Muted Text
        },
        border: {
          DEFAULT: '#E8D5B5',     // Warm Champagne Cream Border
          subtle: '#F0E5D3',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        editorial: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        'fluid-h1': 'clamp(1.875rem, 1.35rem + 2.5vw, 3.75rem)',
        'fluid-h2': 'clamp(1.75rem, 1.35rem + 2vw, 2.75rem)',
        'fluid-h3': 'clamp(1.375rem, 1.15rem + 1.1vw, 1.875rem)',
        'fluid-h4': 'clamp(1.25rem, 1.125rem + 0.55vw, 1.5rem)',
        'fluid-body': 'clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)',
        'fluid-meta': 'clamp(0.6875rem, 0.65rem + 0.2vw, 0.75rem)',
      },
      letterSpacing: {
        'tightest': '-0.025em',
        'tighter': '-0.02em',
        'tight': '-0.01em',
        'wider': '0.05em',
        'widest': '0.12em',
        'kicker': '0.15em',
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(37, 75, 56, 0.04)',
        'card': '0 2px 8px -1px rgba(37, 75, 56, 0.04), 0 1px 3px rgba(37, 75, 56, 0.02)',
        'card-hover': '0 8px 24px -3px rgba(37, 75, 56, 0.08), 0 2px 6px -1px rgba(37, 75, 56, 0.03)',
        'editorial': '0 4px 20px -2px rgba(37, 75, 56, 0.05)',
        'editorial-lg': '0 12px 36px -4px rgba(37, 75, 56, 0.08)',
        'gold-glow': '0 0 15px rgba(201, 166, 107, 0.25)',
        'bronze-glow': '0 0 18px rgba(180, 154, 100, 0.25)',
      },
      transitionTimingFunction: {
        'editorial': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out forwards',
      },
    },
  },
  plugins: [],
}
