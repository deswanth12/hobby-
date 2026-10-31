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
          // Canonical Luxury Editorial Tokens
          forest: '#153F32',     // Primary forest green
          deep: '#102D25',       // Deep rich green
          chambers: '#0A2F24',   // Deepest dark chambers green
          darkgreen: '#0F3E2E',  // Official header dark forest green
          ivory: '#F5F1E8',      // Warm ivory background
          white: '#FFFFFF',      // Pure white canvas
          tintedwhite: '#FAF8F5', // Hallmark tinted surface (non-absolute)
          gold: '#C3A66B',       // Muted refined gold accent
          brightgold: '#C5A059', // Hallmark warm editorial gold
          goldhover: '#D4B26F',  // Highlighted gold hover
          charcoal: '#252B27',   // Dark charcoal body text
          muted: '#4A524D',      // Calibrated for WCAG AA 4.5:1+ contrast      // Secondary readable text
          border: '#E5E1D8',     // Architectural hairline border
          surface: '#EDE8DF',    // Approved surface tint
          pale: '#EDE8DF',       // Muted ivory tint

          // Backward-Compatible Aliases mapping to the new palette
          primary: '#153F32',     // Maps to brand-forest
          interactive: '#153F32', // Interactive primary buttons & CTAs
          hover: '#102D25',       // Interactive hover state
          warm: '#F5F1E8',        // Maps to brand-ivory
        },
        forest: {
          50: '#F4F7F5',
          100: '#E4ECE7',
          200: '#C8D9D0',
          300: '#A4BFB2',
          400: '#67907E',
          500: '#346958',
          600: '#215444',
          700: '#1B473A',
          800: '#153F32', // Primary forest green
          900: '#102D25', // Deep green
          950: '#0B1F19',
          DEFAULT: '#153F32',
        },
        gold: {
          light: '#D8C296',
          DEFAULT: '#C3A66B',     // Approved Muted Gold Accent
          dark: '#73561E',       // Calibrated for WCAG AA 4.5:1+ contrast on light surfaces (6.02:1 on Ivory)
        },
        charcoal: {
          DEFAULT: '#252B27',     // Approved Charcoal Body Text
          muted: '#4A524D',       // Approved Secondary Text (Calibrated for WCAG AA 4.5:1+)
          light: '#5A625C',      // Calibrated for 4.5:1+ contrast       // Subdued Tertiary Annotations
        },
        border: {
          DEFAULT: '#E5E1D8',     // Approved Border Token
          subtle: '#EEEAE2',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        editorial: ['"Cormorant Garamond"', 'Georgia', 'serif'],
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
        'subtle': '0 1px 3px rgba(21, 63, 50, 0.04)',
        'card': '0 2px 8px -1px rgba(21, 63, 50, 0.04), 0 1px 3px rgba(21, 63, 50, 0.02)',
        'card-hover': '0 8px 24px -3px rgba(21, 63, 50, 0.08), 0 2px 6px -1px rgba(21, 63, 50, 0.03)',
        'editorial': '0 4px 20px -2px rgba(21, 63, 50, 0.05)',
        'editorial-lg': '0 12px 36px -4px rgba(21, 63, 50, 0.08)',
        'gold-glow': '0 0 15px rgba(195, 166, 107, 0.25)',
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
