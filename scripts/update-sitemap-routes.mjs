import fs from 'node:fs';

const filePath = 'scripts/generate-sitemap.mjs';
let code = fs.readFileSync(filePath, 'utf8');

const target = `{ path: '/services/audit-assurance', priority: '0.9', changefreq: 'monthly' },`;
const additions = `{ path: '/services/audit-assurance', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/gst-consultant-tirupati', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/income-tax-consultant-tirupati', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/company-registration-tirupati', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/virtual-cfo-tirupati', priority: '0.9', changefreq: 'monthly' },
  { path: '/services/rera-consultant-tirupati', priority: '0.9', changefreq: 'monthly' },`;

if (code.includes(target) && !code.includes('/services/gst-consultant-tirupati')) {
  code = code.replace(target, additions);
  fs.writeFileSync(filePath, code, 'utf8');
  console.log('scripts/generate-sitemap.mjs updated successfully');
} else {
  console.log('Already updated or target not found');
}
