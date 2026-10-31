import fs from 'node:fs';

// 1. Update index.html
let indexHtml = fs.readFileSync('index.html', 'utf8').replace(/\r\n/g, '\n');
const metaTarget = '<meta name="theme-color" content="#153F32" />';
const metaReplacement = '<meta name="theme-color" content="#153F32" />\n    <meta name="robots" content="index, follow" />';

if (!indexHtml.includes('name="robots"')) {
  indexHtml = indexHtml.replace(metaTarget, metaReplacement);
  fs.writeFileSync('index.html', indexHtml.replace(/\n/g, '\r\n'), 'utf8');
  console.log('index.html updated with explicit robots meta');
}

// 2. Update SEOHead.tsx
let seoHead = fs.readFileSync('src/components/SEOHead.tsx', 'utf8').replace(/\r\n/g, '\n');
const seoTarget = `    // 4. Update Robots Meta
    let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (noIndex) {
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.setAttribute('name', 'robots');
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute('content', 'noindex, nofollow');
    } else {
      if (robotsMeta) robotsMeta.remove();
    }`;

const seoReplacement = `    // 4. Update Robots Meta
    let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    if (noIndex) {
      robotsMeta.setAttribute('content', 'noindex, nofollow');
    } else {
      robotsMeta.setAttribute('content', 'index, follow');
    }`;

if (seoHead.includes(seoTarget)) {
  seoHead = seoHead.replace(seoTarget, seoReplacement);
  fs.writeFileSync('src/components/SEOHead.tsx', seoHead.replace(/\n/g, '\r\n'), 'utf8');
  console.log('SEOHead.tsx updated with explicit robots meta');
}
