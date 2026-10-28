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
          primary: '#0F3E2E',     // Primary forest green
          deep: '#0A2F24',        // Deep rich green
          interactive: '#1B734F', // Interactive green for buttons & states
          hover: '#145C3E',       // Hover green
          pale: '#F0F7F3',        // Pale sage for section backgrounds
          surface: '#F7FAF8',     // Very soft sage canvas
          warm: '#FCFCFA',        // Warm white background
          border: '#E1E8E3',      // Architectural border color
        },
        forest: {
          50: '#F2F8F5',
          100: '#E1EFE8',
          200: '#C4E0D2',
          300: '#9ACAB6',
          400: '#6BAEA7',
          500: '#418F7A',
          600: '#2D7260',
          700: '#235A4D',
          800: '#1B473D',
          900: '#0F3E2E',
          950: '#0A2F24',
          DEFAULT: '#0F3E2E',
        },
        gold: {
          light: '#DFC282',
          DEFAULT: '#C5A059',     // Muted refined gold accent
          dark: '#9D7B37',
        },
        charcoal: {
          DEFAULT: '#24342F',     // Dark green-tinted charcoal for maximum legibility
          muted: '#64716C',       // Secondary readable text
          light: '#8C9993',       // Subdued tertiary annotations
        },
        border: {
          DEFAULT: '#E1E8E3',     // Design token for subtle borders
          subtle: '#EAEFEA',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(15, 62, 46, 0.04)',
        'card': '0 4px 20px rgba(15, 62, 46, 0.06)',
        'card-hover': '0 12px 32px rgba(15, 62, 46, 0.1)',
        'elevated': '0 20px 40px rgba(10, 47, 36, 0.12)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.25s ease-out forwards',
      },
    },
  },
  plugins: [],
}
