import fs from 'fs';
import path from 'path';

function checkAnchors(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const hrefMatches = [...content.matchAll(/href=["']#([a-zA-Z0-9_-]+)["']/g)].map(m => m[1]);
  const idMatches = new Set([...content.matchAll(/id=["']([a-zA-Z0-9_-]+)["']/g)].map(m => m[1]));
  
  const missing = hrefMatches.filter(h => !idMatches.has(h));
  console.log(`[${filePath}] Hrefs: ${hrefMatches.length}, Missing on same page:`, missing);
}

checkAnchors('src/pages/HomePage.tsx');
checkAnchors('src/pages/ServicesPage.tsx');
checkAnchors('src/pages/AboutPage.tsx');
checkAnchors('src/pages/ContactPage.tsx');
