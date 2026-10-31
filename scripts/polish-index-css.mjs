import fs from 'fs';

const filePath = 'c:/kavitha ca/src/index.css';
let css = fs.readFileSync(filePath, 'utf8');

// 1. Add stamp & root tokens
const stampAndTokens = `/* Hallmark · v2.0.0 · Polish · Editorial */
:root {
  --color-forest: #153F32;
  --color-deep: #102D25;
  --color-chambers: #0A2F24;
  --color-darkgreen: #0F3E2E;
  --color-ivory: #F5F1E8;
  --color-tintedwhite: #FAF8F5;
  --color-gold: #C3A66B;
  --color-brightgold: #C5A059;
  --color-charcoal: #252B27;
  --color-muted: #747A73;
  --color-border: #E5E1D8;
  --color-surface: #EDE8DF;
  --font-serif: 'Cormorant Garamond', Georgia, serif;
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
}

`;

if (!css.startsWith('/* Hallmark')) {
  css = stampAndTokens + css;
}

// 2. Fix overflow-x: hidden to clip and colors to tokens
css = css.replace(/overflow-x:\s*hidden;/g, 'overflow-x: clip;');
css = css.replace(/color:\s*#252B27;/g, 'color: var(--color-charcoal);');
css = css.replace(/background-color:\s*#F5F1E8;/g, 'background-color: var(--color-ivory);');
css = css.replace(/outline:\s*2px solid #153F32;/g, 'outline: 2px solid var(--color-forest);');

// 3. Fix transition: all
css = css.replace('transition: all 350ms cubic-bezier(0.16, 1, 0.3, 1);', 'transition: transform 350ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 350ms ease, background-color 350ms ease, border-color 350ms ease;');
css = css.replace('transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);', 'transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease, background-color 300ms ease, border-color 300ms ease;');
css = css.replace('transition: all 260ms cubic-bezier(0.16, 1, 0.3, 1);', 'transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 260ms ease, background-color 260ms ease, border-color 260ms ease;');
css = css.replace('transition: all 240ms cubic-bezier(0.16, 1, 0.3, 1);', 'transition: transform 240ms cubic-bezier(0.16, 1, 0.3, 1), opacity 240ms ease, background-color 240ms ease;');
css = css.replace('transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);', 'transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), background-color 300ms ease, border-color 300ms ease;');

// 4. Fix pure #fff / #FFFFFF literals
css = css.replace(/color:\s*#FFFFFF;/g, 'color: var(--color-tintedwhite);');
css = css.replace(/background-color:\s*#FFFFFF;/g, 'background-color: var(--color-tintedwhite);');

// 5. Fix font-family literals in font-editorial classes
css = css.replace(/font-family:\s*["']Cormorant Garamond["'], Georgia, serif;/g, 'font-family: var(--font-serif);');
css = css.replace(/font-family:\s*["']Inter["'], system-ui, sans-serif;/g, 'font-family: var(--font-sans);');

fs.writeFileSync(filePath, css, 'utf8');
console.log('src/index.css successfully polished!');
