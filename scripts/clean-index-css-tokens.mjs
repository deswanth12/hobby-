import fs from 'fs';

const cssPath = 'c:/kavitha ca/src/index.css';
let css = fs.readFileSync(cssPath, 'utf8');

// Declare tokens in :root
const tokenAdditions = `  --color-gold-border: rgba(195, 166, 107, 0.45);
  --color-gold-border-strong: rgba(195, 166, 107, 0.85);
  --color-gold-border-gold: rgba(195, 166, 107, 0.75);
  --color-gold-divider: rgba(195, 166, 107, 0.4);
  --color-gold-shadow: rgba(195, 166, 107, 0.5);
  --color-gold-glow-sm: rgba(195, 166, 107, 0.4);
  --color-gold-glow-md: rgba(195, 166, 107, 0.6);
  --color-gold-progress: #E0CDA9;
  --color-forest-shadow-xs: rgba(21, 63, 50, 0.04);
  --color-forest-shadow-sm: rgba(21, 63, 50, 0.06);
  --color-forest-shadow-subtle: rgba(21, 63, 50, 0.08);
  --color-forest-shadow-md: rgba(21, 63, 50, 0.12);
  --color-forest-shadow-focus: rgba(21, 63, 50, 0.14);
  --color-forest-shadow-primary: rgba(21, 63, 50, 0.18);
  --color-forest-shadow-btn: rgba(21, 63, 50, 0.25);
  --color-forest-shadow-hover: rgba(21, 63, 50, 0.28);
  --color-forest-shadow-dark: rgba(21, 63, 50, 0.35);
  --color-forest-border-pill: rgba(21, 63, 50, 0.15);
  --color-deep-shadow: rgba(16, 45, 37, 0.45);
  --color-white-faint: rgba(255, 255, 255, 0.12);
  --color-white-subtle: rgba(255, 255, 255, 0.15);
  --color-white-glow: rgba(255, 255, 255, 0.85);
  --color-charcoal-shadow: rgba(37, 43, 39, 0.04);
  --color-parchment-glass: rgba(245, 241, 232, 0.85);
  --color-border-glass: rgba(229, 225, 216, 0.95);
  --color-scrollbar-thumb: #D8D2C5;
  --color-scrollbar-hover: #C3BAA7;
`;

css = css.replace(
  '  --font-sans: \'Inter\', system-ui, -apple-system, sans-serif;\r\n}',
  '  --font-sans: \'Inter\', system-ui, -apple-system, sans-serif;\r\n' + tokenAdditions + '}'
);
if (!css.includes('--color-gold-border:')) {
  css = css.replace(
    '  --font-sans: \'Inter\', system-ui, -apple-system, sans-serif;\n}',
    '  --font-sans: \'Inter\', system-ui, -apple-system, sans-serif;\n' + tokenAdditions + '}'
  );
}

// Replace literal occurrences in index.css body
css = css.replace(/rgba\(195, 166, 107, 0\.45\)/g, 'var(--color-gold-border)');
css = css.replace(/rgba\(195, 166, 107, 0\.85\)/g, 'var(--color-gold-border-strong)');
css = css.replace(/rgba\(195, 166, 107, 0\.75\)/g, 'var(--color-gold-border-gold)');
css = css.replace(/rgba\(195, 166, 107, 0\.4\)/g, 'var(--color-gold-divider)');
css = css.replace(/rgba\(195, 166, 107, 0\.5\)/g, 'var(--color-gold-shadow)');
css = css.replace(/rgba\(195, 166, 107, 0\.6\)/g, 'var(--color-gold-glow-md)');
css = css.replace(/#E0CDA9/g, 'var(--color-gold-progress)');

css = css.replace(/rgba\(21, 63, 50, 0\.04\)/g, 'var(--color-forest-shadow-xs)');
css = css.replace(/rgba\(21, 63, 50, 0\.06\)/g, 'var(--color-forest-shadow-sm)');
css = css.replace(/rgba\(21, 63, 50, 0\.08\)/g, 'var(--color-forest-shadow-subtle)');
css = css.replace(/rgba\(21, 63, 50, 0\.12\)/g, 'var(--color-forest-shadow-md)');
css = css.replace(/rgba\(21, 63, 50, 0\.14\)/g, 'var(--color-forest-shadow-focus)');
css = css.replace(/rgba\(21, 63, 50, 0\.18\)/g, 'var(--color-forest-shadow-primary)');
css = css.replace(/rgba\(21, 63, 50, 0\.25\)/g, 'var(--color-forest-shadow-btn)');
css = css.replace(/rgba\(21, 63, 50, 0\.28\)/g, 'var(--color-forest-shadow-hover)');
css = css.replace(/rgba\(21, 63, 50, 0\.35\)/g, 'var(--color-forest-shadow-dark)');
css = css.replace(/rgba\(21, 63, 50, 0\.15\)/g, 'var(--color-forest-border-pill)');

css = css.replace(/rgba\(16, 45, 37, 0\.45\)/g, 'var(--color-deep-shadow)');
css = css.replace(/rgba\(255, 255, 255, 0\.12\)/g, 'var(--color-white-faint)');
css = css.replace(/rgba\(255, 255, 255, 0\.15\)/g, 'var(--color-white-subtle)');
css = css.replace(/rgba\(255, 255, 255, 0\.85\)/g, 'var(--color-white-glow)');
css = css.replace(/rgba\(37, 43, 39, 0\.04\)/g, 'var(--color-charcoal-shadow)');
css = css.replace(/rgba\(245, 241, 232, 0\.85\)/g, 'var(--color-parchment-glass)');
css = css.replace(/rgba\(229, 225, 216, 0\.95\)/g, 'var(--color-border-glass)');

css = css.replace(/#D8D2C5/g, 'var(--color-scrollbar-thumb)');
css = css.replace(/#C3BAA7/g, 'var(--color-scrollbar-hover)');

// Fix tracking on btn-pill-secondary
css = css.replace('letter-spacing: 0.04em;\r\n    box-shadow', 'box-shadow');
css = css.replace('letter-spacing: 0.04em;\n    box-shadow', 'box-shadow');

// Fix arrow-secondary
css = css.replace(
  '.dual-arrow-badge .arrow-secondary {\r\n    position: absolute;\r\n    transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 240ms ease;\r\n    transform: translate(-120%, 120%);\r\n    opacity: 0;',
  '.dual-arrow-badge .arrow-secondary {\r\n    position: absolute;\r\n    transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 240ms ease;\r\n    transform: translate(-120%, 120%);\r\n    display: none;'
);
css = css.replace(
  '.dual-arrow-badge .arrow-secondary {\n    position: absolute;\n    transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 240ms ease;\n    transform: translate(-120%, 120%);\n    opacity: 0;',
  '.dual-arrow-badge .arrow-secondary {\n    position: absolute;\n    transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 240ms ease;\n    transform: translate(-120%, 120%);\n    display: none;'
);
css = css.replace(
  '.group:hover .dual-arrow-badge .arrow-secondary {\r\n    transform: translate(0, 0);\r\n    opacity: 1;',
  '.group:hover .dual-arrow-badge .arrow-secondary {\r\n    transform: translate(0, 0);\r\n    display: block;'
);
css = css.replace(
  '.group:hover .dual-arrow-badge .arrow-secondary {\n    transform: translate(0, 0);\n    opacity: 1;',
  '.group:hover .dual-arrow-badge .arrow-secondary {\n    transform: translate(0, 0);\n    display: block;'
);

fs.writeFileSync(cssPath, css, 'utf8');
console.log('✓ src/index.css tokens cleaned!');
