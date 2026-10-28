/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f8f5',
          100: '#e1efe8',
          200: '#c4e0d2',
          300: '#9acab6',
          400: '#6baea7',
          500: '#418f7a',
          600: '#2d7260',
          700: '#235a4d',
          800: '#1b473d',
          900: '#133830',
          950: '#0a201b',
          DEFAULT: '#0f3e2e',
        },
        brand: {
          primary: '#0f3e2e',    // Deep forest green for main titles & brand
          secondary: '#165b44',  // Medium forest green for interactive highlights
          interactive: '#1b734f', // Medium green for buttons & active states
          hover: '#145c3e',      // Hover dark green
          pale: '#f0f7f3',       // Pale green for section backgrounds
          surface: '#f7faf8',    // Very soft green-tinted canvas
        },
        gold: {
          light: '#dfc282',
          DEFAULT: '#c5a059',    // Muted gold accent details from card
          dark: '#9d7b37',
        },
        charcoal: {
          DEFAULT: '#22252a',    // Dark charcoal for high readability
          muted: '#4b5563',      // Secondary text
          light: '#6b7280',      // Tertiary labels
        }
      },
      fontFamily: {
        serif: ['"Cinzel"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(15, 62, 46, 0.04)',
        'card': '0 4px 20px rgba(15, 62, 46, 0.06)',
        'card-hover': '0 10px 30px rgba(15, 62, 46, 0.1)',
      }
    },
  },
  plugins: [],
}
