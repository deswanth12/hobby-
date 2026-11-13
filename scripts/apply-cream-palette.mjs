import fs from 'fs';

// 1. Update src/index.css
let indexCss = fs.readFileSync('src/index.css', 'utf8');

const oldRootMatch = /:root\s*\{[\s\S]*?--font-sans:[^;]+;/;
const newRoot = `:root {
  --color-forest: #245B45;
  --color-deep: #183D30;
  --color-chambers: #183D30;
  --color-darkgreen: #183D30;
  --color-ivory: #FBF7EF;
  --color-cream: #FBF7EF;
  --color-softivory: #FFFDF8;
  --color-tintedwhite: #FFFDF8;
  --color-champagne: #F2E8D5;
  --color-gold: #C9A66B;
  --color-brightgold: #C9A66B;
  --color-softgold: #E4D0A5;
  --color-goldhover: #D8B880;
  --color-charcoal: #292B27;
  --color-secondary: #66665E;
  --color-muted: #66665E;
  --color-border: #E9E0D2;
  --color-surface: #FBF7EF;
  --font-serif: 'Cormorant Garamond', Georgia, serif;
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;`;

indexCss = indexCss.replace(oldRootMatch, newRoot);
fs.writeFileSync('src/index.css', indexCss, 'utf8');
console.log('Updated src/index.css root variables');

// 2. Update tailwind.config.js
let tailwindConfig = fs.readFileSync('tailwind.config.js', 'utf8');

const oldColorsMatch = /colors:\s*\{[\s\S]*?fontFamily:/;
const newColors = `colors: {
        brand: {
          // Brighter, Elegant Cream & Forest Green Palette
          forest: '#245B45',      // Forest Green
          elegant: '#356B50',     // Elegant Green
          deep: '#183D30',        // Deep Green
          chambers: '#183D30',    // Rich dark chambers green
          darkgreen: '#183D30',   // Dark green header token
          ivory: '#FBF7EF',       // Warm Cream background (primary)
          cream: '#FBF7EF',       // Warm Cream alias
          softivory: '#FFFDF8',   // Soft Ivory for content cards
          white: '#FFFFFF',       // Warm White
          tintedwhite: '#FFFDF8', // Soft Ivory tint
          champagne: '#F2E8D5',   // Light Champagne
          gold: '#C9A66B',        // Champagne Gold accent
          brightgold: '#C9A66B',  // Champagne Gold
          softgold: '#E4D0A5',    // Soft Gold accent
          goldhover: '#D8B880',   // Highlighted gold hover
          charcoal: '#292B27',    // Primary Text
          secondary: '#66665E',   // Secondary Text
          muted: '#66665E',       // Secondary Text (calibrated for WCAG AA 5.6:1+ on #FBF7EF)
          border: '#E9E0D2',      // Soft Beige border
          surface: '#FBF7EF',     // Surface cream tint
          pale: '#F4EDE0',        // Light Cream tint

          // Backward-Compatible Aliases
          primary: '#245B45',     // Maps to brand-forest
          interactive: '#245B45', // Interactive primary buttons & CTAs
          hover: '#183D30',       // Interactive hover state
          warm: '#FBF7EF',        // Maps to brand-ivory
        },
        forest: {
          50: '#F4F7F5',
          100: '#E4ECE7',
          200: '#C8D9D0',
          300: '#A4BFB2',
          400: '#67907E',
          500: '#356B50',
          600: '#2C5E47',
          700: '#245B45',
          800: '#245B45', // Forest green
          900: '#183D30', // Deep green
          950: '#0F261E',
          DEFAULT: '#245B45',
        },
        gold: {
          light: '#E4D0A5',       // Soft Gold
          DEFAULT: '#C9A66B',     // Champagne Gold Accent
          dark: '#855E1C',        // WCAG AA compliant on cream
        },
        charcoal: {
          DEFAULT: '#292B27',     // Primary Text
          muted: '#66665E',       // Secondary Text
          light: '#858176',       // Muted Text
        },
        border: {
          DEFAULT: '#E9E0D2',     // Soft Beige Border
          subtle: '#F2ECE1',
        }
      },
      fontFamily:`;

tailwindConfig = tailwindConfig.replace(oldColorsMatch, newColors);
fs.writeFileSync('tailwind.config.js', tailwindConfig, 'utf8');
console.log('Updated tailwind.config.js colors');
