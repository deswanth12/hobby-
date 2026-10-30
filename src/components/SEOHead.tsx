import { useEffect } from 'react';

export interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
  noIndex?: boolean;
  ogType?: 'website' | 'article' | string;
  image?: string;
  article?: {
    author?: string;
    datePublished?: string;
    dateModified?: string;
    tags?: string[];
  };
  jsonLd?: Record<string, any>;
}

export const SEOHead = ({
  title,
  description,
  canonicalPath,
  noIndex,
  ogType = 'website',
  image,
  article,
  jsonLd,
}: SEOProps) => {
  useEffect(() => {
    // 1. Update Document Title
    const fullTitle = `${title} | Kavitha & Associates`;
    document.title = fullTitle;

    const getOrCreateMeta = (attr: string, value: string): HTMLMetaElement => {
      let meta = document.querySelector(`meta[${attr}="${value}"]`) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, value);
        document.head.appendChild(meta);
      }
      return meta;
    };

    // 2. Update Primary Meta Description
    const metaDesc = getOrCreateMeta('name', 'description');
    metaDesc.setAttribute('content', description);

    // 3. Update Robots Meta Tag (for 404 / noindex pages)
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
    }

    // 4. Update Open Graph Meta Tags (og:title, og:description, og:type, og:url, og:image)
    const productionDomain = 'https://kavithaassociates.com';
    const currentUrl = canonicalPath ? `${productionDomain}${canonicalPath}` : window.location.href;

    const ogTitle = getOrCreateMeta('property', 'og:title');
    ogTitle.setAttribute('content', fullTitle);

    const ogDesc = getOrCreateMeta('property', 'og:description');
    ogDesc.setAttribute('content', description);

    const ogTypeMeta = getOrCreateMeta('property', 'og:type');
    ogTypeMeta.setAttribute('content', ogType);

    const ogUrlMeta = getOrCreateMeta('property', 'og:url');
    ogUrlMeta.setAttribute('content', currentUrl);

    if (image) {
      const ogImageMeta = getOrCreateMeta('property', 'og:image');
      const fullImageUrl = image.startsWith('http') ? image : `${productionDomain}${image}`;
      ogImageMeta.setAttribute('content', fullImageUrl);
    }

    // 5. Update Canonical Tag if path specified
    if (canonicalPath) {
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', currentUrl);
    }

    // 6. Schema.org JSON-LD Structured Data Injection
    // Inject <script type="application/ld+json" id="seo-jsonld"> rendering Schema.org BlogPosting
    let scriptTag = document.getElementById('seo-jsonld') as HTMLScriptElement | null;

    let structuredData: Record<string, any> | null = jsonLd || null;

    if (!structuredData && ogType === 'article') {
      structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description: description,
        author: {
          '@type': 'Person',
          name: article?.author || 'CA Kavitha Vijay',
          jobTitle: 'Practicing Chartered Accountant',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Kavitha & Associates',
          logo: {
            '@type': 'ImageObject',
            url: `${productionDomain}/favicon.svg`,
          },
        },
        datePublished: article?.datePublished,
        dateModified: article?.dateModified || article?.datePublished,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': currentUrl,
        },
        ...(image ? { image: image.startsWith('http') ? image : `${productionDomain}${image}` } : {}),
        ...(article?.tags ? { keywords: article.tags.join(', ') } : {}),
      };
    }

    if (structuredData) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.type = 'application/ld+json';
        scriptTag.id = 'seo-jsonld';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(structuredData, null, 2);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, canonicalPath, noIndex, ogType, image, article, jsonLd]);

  return null;
};
