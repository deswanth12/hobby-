import https from 'https';

const previewHost = 'kavitha-git-maintenance-dead-code-cleanup-deswanth12s-projects.vercel.app';

function fetchUrl(path) {
  return new Promise((resolve) => {
    https.get({
      hostname: previewHost,
      path,
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body
        });
      });
    }).on('error', (err) => resolve({ error: err.message }));
  });
}

async function test() {
  console.log(`Auditing Deployed Vercel Preview: https://${previewHost}`);

  // 1. Homepage HTML & Hero Headline
  const home = await fetchUrl('/');
  console.log(`\n1. Homepage Status: ${home.status}`);
  if (home.body) {
    const hasH1 = home.body.includes('Chartered Accountant in Tirupati');
    const hasSub = home.body.includes('Statutory Rigor &amp; Commercial Tax Counsel') || home.body.includes('Statutory Rigor & Commercial Tax Counsel');
    const hasFavicon48 = home.body.includes('favicon-48x48.png');
    const hasFaviconIco = home.body.includes('favicon.ico');
    const hasAppleTouch = home.body.includes('apple-touch-icon.png');
    const hasManifest = home.body.includes('site.webmanifest');
    const hasSchemaLogo = home.body.includes('https://kavithaassociates.com/favicon-512x512.png');

    console.log(`  - Main H1 'Chartered Accountant in Tirupati': ${hasH1 ? 'VERIFIED' : 'MISSING'}`);
    console.log(`  - Subtitle 'Statutory Rigor & Commercial Tax Counsel': ${hasSub ? 'VERIFIED' : 'MISSING'}`);
    console.log(`  - favicon-48x48.png link in <head>: ${hasFavicon48 ? 'VERIFIED' : 'MISSING'}`);
    console.log(`  - favicon.ico link in <head>: ${hasFaviconIco ? 'VERIFIED' : 'MISSING'}`);
    console.log(`  - apple-touch-icon.png link: ${hasAppleTouch ? 'VERIFIED' : 'MISSING'}`);
    console.log(`  - site.webmanifest link: ${hasManifest ? 'VERIFIED' : 'MISSING'}`);
    console.log(`  - Schema.org 512x512 logo link: ${hasSchemaLogo ? 'VERIFIED' : 'MISSING'}`);
  }

  // 2. Favicon Assets Direct HTTP Check on Preview
  console.log('\n2. Favicon Static Asset Retrieval on Preview:');
  const fav48 = await fetchUrl('/favicon-48x48.png');
  console.log(`  - /favicon-48x48.png: ${fav48.status} (ctype: ${fav48.headers['content-type']}, length: ${fav48.headers['content-length']})`);
  const favIco = await fetchUrl('/favicon.ico');
  console.log(`  - /favicon.ico: ${favIco.status} (ctype: ${favIco.headers['content-type']}, length: ${favIco.headers['content-length']})`);

  // 3. Security Headers Check
  console.log('\n3. Preview Security Headers:');
  console.log(`  - Content-Type-Options: ${home.headers['x-content-type-options']}`);
  console.log(`  - X-Frame-Options: ${home.headers['x-frame-options']}`);
  console.log(`  - Referrer-Policy: ${home.headers['referrer-policy']}`);
  console.log(`  - Strict-Transport-Security: ${home.headers['strict-transport-security']}`);
  console.log(`  - CSP Header: ${home.headers['content-security-policy'] ? 'CONFIGURED' : 'NONE'}`);

  // 4. API Health & Environment Status
  console.log('\n4. Backend API Status on Preview:');
  const health = await fetchUrl('/api/health');
  console.log(`  - /api/health: ${health.status}`);
  if (health.body) {
    console.log(`    Body: ${health.body}`);
  }
}

test().catch(console.error);
