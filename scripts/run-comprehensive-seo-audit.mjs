import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const TARGET_HOST = 'https://kavithaassociates.com';

const ROUTES = [
  { path: '/', name: 'Homepage' },
  { path: '/about', name: 'About' },
  { path: '/services', name: 'Services Spectrum' },
  { path: '/services/audit-assurance', name: 'Audit & Assurance Spotlight' },
  { path: '/industries', name: 'Industries' },
  { path: '/locations', name: 'Locations & Chambers' },
  { path: '/contact', name: 'Contact & Chambers' },
  { path: '/blog', name: 'Regulatory Insights (Blog)' },
  { path: '/blog/corporate-tax-planning-2026', name: 'Article: Corporate Tax Planning' },
  { path: '/blog/gst-annual-return-compliance', name: 'Article: GST Annual Return Compliance' },
  { path: '/blog/statutory-audit-guidelines-2026', name: 'Article: Statutory Audit Guidelines' },
  { path: '/404-nonexistent-route', name: '404 Error Page' }
];

async function runAudit() {
  console.log('================================================================');
  console.log('   CA KAVITHA & ASSOCIATES — COMPREHENSIVE SEO AUDIT SUITE      ');
  console.log('================================================================');
  console.log(`Auditing Target: ${TARGET_HOST}\n`);

  const auditReport = {
    timestamp: new Date().toISOString(),
    target: TARGET_HOST,
    httpAudit: {},
    technicalFiles: {},
    pageAudits: []
  };

  // 1. Technical Files Audit (robots.txt & sitemap.xml)
  console.log('--- 1. AUDITING TECHNICAL FILES ---');
  try {
    const robotsRes = await fetch(`${TARGET_HOST}/robots.txt`);
    const robotsText = await robotsRes.text();
    auditReport.technicalFiles.robots = {
      status: robotsRes.status,
      contentType: robotsRes.headers.get('content-type'),
      length: robotsText.length,
      hasSitemap: robotsText.includes('sitemap.xml'),
      disallowAdmin: robotsText.includes('Disallow: /admin'),
      content: robotsText.trim()
    };
    console.log(`✓ robots.txt: HTTP ${robotsRes.status}, Sitemap declared: ${auditReport.technicalFiles.robots.hasSitemap}`);
  } catch (err) {
    auditReport.technicalFiles.robots = { error: err.message };
    console.log(`✗ robots.txt error: ${err.message}`);
  }

  try {
    const sitemapRes = await fetch(`${TARGET_HOST}/sitemap.xml`);
    const sitemapText = await sitemapRes.text();
    const urls = [...sitemapText.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g)].map(m => m[1]);
    auditReport.technicalFiles.sitemap = {
      status: sitemapRes.status,
      contentType: sitemapRes.headers.get('content-type'),
      urlCount: urls.length,
      urls
    };
    console.log(`✓ sitemap.xml: HTTP ${sitemapRes.status}, URL count: ${urls.length}`);
  } catch (err) {
    auditReport.technicalFiles.sitemap = { error: err.message };
    console.log(`✗ sitemap.xml error: ${err.message}`);
  }

  // 2. Headless Browser Page Inspections
  console.log('\n--- 2. HEADLESS BROWSER AUDIT OF ALL ROUTES ---');
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const profileDir = path.resolve('reports/edge-profile-audit-temp');
  if (fs.existsSync(profileDir)) {
    try { fs.rmSync(profileDir, { recursive: true, force: true }); } catch (_) {}
  }

  const port = 9288;
  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profileDir}`,
    '--headless=new',
    'about:blank'
  ], { stdio: 'ignore' });

  let ws = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      const tabs = await res.json();
      const target = tabs.find(t => t.type === 'page');
      if (target) {
        ws = new WebSocket(target.webSocketDebuggerUrl);
        await new Promise(r => { ws.onopen = r; });
        break;
      }
    } catch (_) {}
  }

  if (!ws) {
    edgeProc.kill();
    throw new Error('Could not connect to headless browser.');
  }

  let reqId = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = reqId++;
    const timer = setTimeout(() => reject(new Error('Timeout on ' + method)), 15000);
    const handler = (evt) => {
      const d = JSON.parse(evt.data);
      if (d.id === id) {
        clearTimeout(timer);
        ws.removeEventListener('message', handler);
        if (d.error) reject(new Error(d.error.message));
        else resolve(d.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });

  await send('Page.enable');
  await send('Runtime.enable');

  for (const route of ROUTES) {
    const fullUrl = `${TARGET_HOST}${route.path}`;
    console.log(`Auditing: ${route.name} (${fullUrl})...`);
    await send('Page.navigate', { url: fullUrl });
    await new Promise(r => setTimeout(r, 2000));

    const evalResult = await send('Runtime.evaluate', {
      expression: `(() => {
        const title = document.title || '';
        const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        const metaRobots = document.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
        const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
        
        // Open Graph & Social
        const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
        const ogDesc = document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
        const ogUrl = document.querySelector('meta[property="og:url"]')?.getAttribute('content') || '';
        const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
        const ogType = document.querySelector('meta[property="og:type"]')?.getAttribute('content') || '';
        const twitterCard = document.querySelector('meta[name="twitter:card"]')?.getAttribute('content') || '';
        
        // Headings
        const h1Elements = Array.from(document.querySelectorAll('h1')).map(el => el.textContent.trim());
        const h2Elements = Array.from(document.querySelectorAll('h2')).map(el => el.textContent.trim());
        const h3Elements = Array.from(document.querySelectorAll('h3')).map(el => el.textContent.trim());
        
        // Images & Alts
        const images = Array.from(document.querySelectorAll('img')).map(img => ({
          src: img.getAttribute('src') || '',
          alt: img.getAttribute('alt') || '',
          hasAlt: img.hasAttribute('alt') && img.getAttribute('alt').trim().length > 0,
          loading: img.getAttribute('loading') || ''
        }));
        const missingAltImages = images.filter(i => !i.hasAlt);

        // Links
        const links = Array.from(document.querySelectorAll('a[href]')).map(a => ({
          href: a.getAttribute('href') || '',
          text: a.textContent.trim().replace(/\\s+/g, ' ')
        }));
        const internalLinks = links.filter(l => l.href.startsWith('/') || l.href.includes('kavithaassociates.com'));
        const externalLinks = links.filter(l => l.href.startsWith('http') && !l.href.includes('kavithaassociates.com'));

        // Structured Data
        const jsonLdElements = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
        const jsonLdData = jsonLdElements.map(s => {
          try {
            return { raw: s.textContent, parsed: JSON.parse(s.textContent) };
          } catch (e) {
            return { raw: s.textContent, parseError: e.message };
          }
        });

        // Content word count & keywords
        const bodyText = document.body.innerText || '';
        const words = bodyText.split(/\\s+/).filter(Boolean);
        const wordCount = words.length;

        // Tirupati keyword occurrences
        const tirupatiMatches = (bodyText.match(/tirupati/gi) || []).length;
        const caMatches = (bodyText.match(/chartered accountant/gi) || []).length;
        const gstMatches = (bodyText.match(/gst/gi) || []).length;
        const auditMatches = (bodyText.match(/audit/gi) || []).length;
        const taxMatches = (bodyText.match(/tax/gi) || []).length;

        return {
          title,
          metaDesc,
          metaRobots,
          canonical,
          ogTitle,
          ogDesc,
          ogUrl,
          ogImage,
          ogType,
          twitterCard,
          h1Count: h1Elements.length,
          h1s: h1Elements,
          h2Count: h2Elements.length,
          h2s: h2Elements.slice(0, 10),
          h3Count: h3Elements.length,
          totalImages: images.length,
          missingAltCount: missingAltImages.length,
          missingAltImages: missingAltImages.slice(0, 5),
          totalLinks: links.length,
          internalLinkCount: internalLinks.length,
          externalLinkCount: externalLinks.length,
          jsonLdCount: jsonLdElements.length,
          jsonLdSchemas: jsonLdData.map(j => j.parsed ? (j.parsed['@type'] || 'Unknown') : 'ParseError'),
          wordCount,
          keywordOccurrences: {
            tirupati: tirupatiMatches,
            charteredAccountant: caMatches,
            gst: gstMatches,
            audit: auditMatches,
            tax: taxMatches
          }
        };
      })()`,
      returnByValue: true
    });

    const pageData = evalResult.result.value;
    auditReport.pageAudits.push({
      route: route.path,
      name: route.name,
      ...pageData
    });

    console.log(`  ✓ Title (${pageData.title.length} chars): "${pageData.title}"`);
    console.log(`  ✓ Meta Desc (${pageData.metaDesc.length} chars): "${pageData.metaDesc.slice(0, 60)}..."`);
    console.log(`  ✓ H1 count: ${pageData.h1Count} (First H1: "${pageData.h1s[0] || 'NONE'}")`);
    console.log(`  ✓ Canonical: "${pageData.canonical}"`);
    console.log(`  ✓ Images: ${pageData.totalImages} (Missing Alt: ${pageData.missingAltCount})`);
    console.log(`  ✓ JSON-LD: ${pageData.jsonLdCount} (${pageData.jsonLdSchemas.join(', ')})`);
    console.log(`  ✓ Words: ${pageData.wordCount} | Tirupati mentions: ${pageData.keywordOccurrences.tirupati}`);
    console.log('');
  }

  ws.close();
  edgeProc.kill();

  const reportPath = path.resolve('reports/comprehensive-seo-audit-results.json');
  fs.writeFileSync(reportPath, JSON.stringify(auditReport, null, 2));
  console.log(`\nAudit finished! Detailed results saved to: ${reportPath}`);
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
