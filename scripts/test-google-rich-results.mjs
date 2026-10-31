import fs from 'fs';

const html = fs.readFileSync('C:/kavatha ca/dist/index.html', 'utf8');
const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
const schema = JSON.parse(match[1]);

const checks = [];
function assert(name, condition, details = '') {
  checks.push({ name, passed: Boolean(condition), details });
}

assert('@context is https://schema.org', schema['@context'] === 'https://schema.org');
assert('@type is AccountingService', schema['@type'] === 'AccountingService');
assert('name present', typeof schema.name === 'string' && schema.name.length > 0, schema.name);
assert('legalName present', typeof schema.legalName === 'string', schema.legalName);
assert('url is valid https', schema.url.startsWith('https://'), schema.url);
assert('logo is valid https image URL', schema.logo.startsWith('https://') && schema.logo.endsWith('.png'), schema.logo);
assert('image is valid https image URL', schema.image.startsWith('https://') && schema.image.endsWith('.png'), schema.image);
assert('telephone is array with valid +91 numbers', Array.isArray(schema.telephone) && schema.telephone.length >= 2, schema.telephone.join(', '));
assert('email is valid format', schema.email.includes('@'), schema.email);
assert('address has streetAddress, locality, region, postalCode, country', 
  schema.address && schema.address.streetAddress && schema.address.addressLocality && schema.address.postalCode, 
  schema.address.streetAddress + ', ' + schema.address.addressLocality);
assert('geo coordinates have latitude and longitude as numbers', 
  typeof schema.geo?.latitude === 'number' && typeof schema.geo?.longitude === 'number', 
  schema.geo?.latitude + ', ' + schema.geo?.longitude);
assert('hasMap is valid Google Maps URL', schema.hasMap && schema.hasMap.includes('maps.app.goo.gl'), schema.hasMap);
assert('areaServed contains covered cities', Array.isArray(schema.areaServed) && schema.areaServed.includes('Tirupati'), schema.areaServed.join(', '));
assert('founder is Person with name and CA title', schema.founder?.['@type'] === 'Person' && schema.founder?.name === 'CA Kavitha Vijay', schema.founder?.name);

console.log('Google Rich Results & Schema.org Specification Audit:');
let allPassed = true;
for (const c of checks) {
  console.log(`[${c.passed ? 'PASS' : 'FAIL'}] ${c.name} (${c.details})`);
  if (!c.passed) allPassed = false;
}
console.log('\nFinal Structured Data Verdict:', allPassed ? '100% ELIGIBLE FOR GOOGLE RICH RESULTS' : 'ISSUES DETECTED');
