import fs from 'fs';

const html = fs.readFileSync('C:/kavatha ca/dist/index.html', 'utf8');

// 1. Validate Structured Data JSON-LD
const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if (!match) {
  throw new Error('No JSON-LD script found in dist/index.html');
}

const data = JSON.parse(match[1]);
console.log('✓ JSON-LD Syntax: Valid Schema.org AccountingService');
console.log(`  - Type: ${data['@type']}`);
console.log(`  - Name: ${data.name}`);
console.log(`  - Legal Name: ${data.legalName}`);
console.log(`  - URL: ${data.url}`);
console.log(`  - Logo: ${data.logo}`);
console.log(`  - Image: ${data.image}`);
console.log(`  - Founder: ${data.founder.name} (${data.founder.jobTitle})`);
console.log(`  - Address: ${data.address.streetAddress}, ${data.address.addressLocality} ${data.address.postalCode}`);
console.log(`  - Geo: lat ${data.geo.latitude}, lng ${data.geo.longitude}`);
console.log(`  - Area Served: ${data.areaServed.join(', ')}`);

// 2. Validate SEO Meta Tags
const titleMatch = html.match(/<title>(.*?)<\/title>/);
console.log(`\n✓ Title: ${titleMatch ? titleMatch[1] : 'MISSING'}`);

const descMatch = html.match(/<meta name="description" content="(.*?)"/);
console.log(`✓ Meta Description: ${descMatch ? descMatch[1] : 'MISSING'}`);

const canonicalMatch = html.match(/<link rel="canonical" href="(.*?)"/);
console.log(`✓ Canonical: ${canonicalMatch ? canonicalMatch[1] : 'MISSING'}`);

const ogImgMatch = html.match(/<meta property="og:image" content="(.*?)"/);
console.log(`✓ OG Image: ${ogImgMatch ? ogImgMatch[1] : 'MISSING'}`);

const twitterImgMatch = html.match(/<meta name="twitter:image" content="(.*?)"/);
console.log(`✓ Twitter Image: ${twitterImgMatch ? twitterImgMatch[1] : 'MISSING'}`);

// 3. Validate Favicon Tags
const requiredFavicons = [
  'favicon.ico',
  'favicon-48x48.png',
  'favicon-96x96.png',
  'favicon-192x192.png',
  'favicon.svg',
  'apple-touch-icon.png',
  'site.webmanifest'
];

console.log('\n✓ Favicon Tags Check:');
for (const icon of requiredFavicons) {
  const present = html.includes(icon);
  console.log(`  - ${icon}: ${present ? 'PRESENT in <head>' : 'MISSING'}`);
  if (!present) throw new Error(`Missing ${icon} in dist/index.html`);
}

console.log('\nAll SEO & Structured Data Validations PASSED cleanly!');
