import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
  noIndex?: boolean;
}

export const SEOHead = ({ title, description, canonicalPath, noIndex }: SEOProps) => {
  useEffect(() => {
    // 1. Update Document Title
    const fullTitle = `${title} | Kavitha & Associates`;
    document.title = fullTitle;

    // 2. Update Primary Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 3. Update Robots Meta Tag (for 404 / noindex pages)
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (noIndex) {
      if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.setAttribute('name', 'robots');
        document.head.appendChild(metaRobots);
      }
      metaRobots.setAttribute('content', 'noindex, nofollow');
    } else if (metaRobots) {
      metaRobots.setAttribute('content', 'index, follow');
    }

    // 4. Update Open Graph Title & Description
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', fullTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    // 5. Update Canonical Tag if path specified
    if (canonicalPath) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      // Provisional production domain pending client final domain purchase confirmation
      const productionDomain = 'https://kavithaassociates.com';
      canonical.setAttribute('href', `${productionDomain}${canonicalPath}`);
    }
  }, [title, description, canonicalPath, noIndex]);

  return null;
};
