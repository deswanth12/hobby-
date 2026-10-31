import https from 'https';

const TARGET = ['252', '985'].join('');
const BASE_URL = 'https://kavithaassociates.com';

const ROUTES = [
  '/',
  '/about',
  '/services',
  '/services/audit-assurance',
  '/services/income-tax-consultant-tirupati',
  '/services/gst-consultant-tirupati',
  '/services/company-registration-tirupati',
  '/services/virtual-cfo-tirupati',
  '/services/rera-consultant-tirupati',
  '/industries',
  '/locations',
  '/contact',
  '/blog',
  '/blog/corporate-tax-planning-2026',
  '/blog/gst-annual-return-compliance',
  '/blog/statutory-audit-guidelines-2026'
];

const STATIC_FILES = [
  '/robots.txt',
  '/sitemap.xml',
  '/llms.txt',
  '/admin/config.yml',
  '/brand/ka-business-card-back.svg',
  '/brand/ka-google-cover-banner.svg'
];

function fetchUrl(path) {
  return new Promise((resolve) => {
    https.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ path, status: res.statusCode, data, headers: res.headers }));
    }).on('error', (err) => resolve({ path, status: 500, error: err.message, data: '' }));
  });
}

async function verify() {
  console.log('================================================================');
  console.log('   LIVE PRODUCTION PRIVACY VERIFICATION: ' + BASE_URL);
  console.log('================================================================\n');

  let totalFailures = 0;
  const jsBundlesSet = new Set();

  console.log('--- 1. Canonical Public Routes Inspection ---');
  for (const route of ROUTES) {
    const res = await fetchUrl(route);
    const hasTarget = res.data.includes(TARGET);
    const hasJsonLd = res.data.includes('application/ld+json');
    const hasCanonical = res.data.includes('rel="canonical"');
    
    // Extract any JS bundles referenced
    const bundleMatches = res.data.match(/\/assets\/[a-zA-Z0-9_.-]+\.js/g) || [];
    bundleMatches.forEach(b => jsBundlesSet.add(b));

    if (res.status !== 200 || hasTarget) {
      totalFailures++;
      console.error(`[FAIL] ${route} -> Status: ${res.status}, TargetFound: ${hasTarget}`);
    } else {
      console.log(`[PASS] ${route} -> Status: 200, PrivacyClean: true, JSON-LD: ${hasJsonLd}, Canonical: ${hasCanonical}`);
    }
  }

  console.log('\n--- 2. Static & AI Discovery Files Inspection ---');
  for (const sf of STATIC_FILES) {
    const res = await fetchUrl(sf);
    const hasTarget = res.data.includes(TARGET);
    if (res.status !== 200 || hasTarget) {
      totalFailures++;
      console.error(`[FAIL] ${sf} -> Status: ${res.status}, TargetFound: ${hasTarget}`);
    } else {
      console.log(`[PASS] ${sf} -> Status: 200, PrivacyClean: true, Size: ${res.data.length} bytes`);
    }
  }

  console.log('\n--- 3. Live Production JavaScript Bundles Inspection ---');
  const jsBundles = Array.from(jsBundlesSet);
  console.log(`Discovered ${jsBundles.length} active JavaScript asset bundles:`, jsBundles);
  
  for (const bundle of jsBundles) {
    const res = await fetchUrl(bundle);
    const hasTarget = res.data.includes(TARGET);
    if (res.status !== 200 || hasTarget) {
      totalFailures++;
      console.error(`[FAIL BUNDLE] ${bundle} -> Status: ${res.status}, TargetFound: ${hasTarget}`);
    } else {
      console.log(`[PASS BUNDLE] ${bundle} -> Status: 200, PrivacyClean: true (${res.data.length} bytes)`);
    }
  }

  console.log('\n--- 4. Live HTML Content & Credentials Verification ---');
  const homeRes = await fetchUrl('/');
  const aboutRes = await fetchUrl('/about');

  // Verify approved credentials exist
  const hasApprovedQuals = homeRes.data.includes('B.Com, CA, CMA') || aboutRes.data.includes('B.Com, CA, CMA');
  const hasPartnerName = homeRes.data.includes('CA Kavitha Vijay');
  console.log('Approved Qualifications present:', hasApprovedQuals);
  console.log('Approved Partner Name present:', hasPartnerName);

  console.log('\n================================================================');
  console.log(`FINAL RESULT: ${ROUTES.length + STATIC_FILES.length + jsBundles.length} items tested, ${totalFailures} failures.`);
  console.log('================================================================');

  if (totalFailures > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

verify().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
