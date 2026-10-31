import fs from 'node:fs';

let seoHead = fs.readFileSync('src/components/SEOHead.tsx', 'utf8').replace(/\r\n/g, '\n');
const seoTarget = `    // 3. Update Robots Meta Tag (for 404 / noindex pages)
    let metaRobots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (noIndex) {
      if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.setAttribute('name', 'robots');
        document.head.appendChild(metaRobots);
      }
      metaRobots.setAttribute('content', 'noindex, nofollow');
    } else if (metaRobots) {
      metaRobots.setAttribute('content', 'index, follow');
    }`;

const seoReplacement = `    // 3. Update Robots Meta Tag
    let metaRobots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', noIndex ? 'noindex, nofollow' : 'index, follow');`;

if (seoHead.includes(seoTarget)) {
  seoHead = seoHead.replace(seoTarget, seoReplacement);
  fs.writeFileSync('src/components/SEOHead.tsx', seoHead.replace(/\n/g, '\r\n'), 'utf8');
  console.log('SEOHead.tsx updated successfully');
} else {
  console.log('Target not found in SEOHead.tsx');
}
