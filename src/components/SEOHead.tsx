import { useEffect } from 'react';

export interface BreadcrumbItem {
  name: string;
  path: string;
}

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
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
  breadcrumbs?: BreadcrumbItem[];
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
  breadcrumbs,
}: SEOProps) => {
  const articleStr = JSON.stringify(article);
  const jsonLdStr = JSON.stringify(jsonLd);
  const breadcrumbsStr = JSON.stringify(breadcrumbs);

  useEffect(() => {
    const productionDomain = 'https://kavithaassociates.com';

    // 1. Update Document Title and Meta Title (strictly identical)
    const fullTitle = title.includes('Kavitha & Associates')
      ? title
      : `${title} | Kavitha & Associates`;
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

    // Update <meta name="title"> to be identical to document.title
    const metaTitle = getOrCreateMeta('name', 'title');
    metaTitle.setAttribute('content', fullTitle);

    // 2. Update Primary Meta Description
    const metaDesc = getOrCreateMeta('name', 'description');
    metaDesc.setAttribute('content', description);

    // 3. Update Robots Meta Tag
    let metaRobots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', noIndex ? 'noindex, nofollow' : 'index, follow');

    // 4. Update Open Graph Meta Tags (og:title, og:description, og:type, og:url, og:image)
    const currentUrl = canonicalPath ? `${productionDomain}${canonicalPath}` : window.location.href;

    const ogTitle = getOrCreateMeta('property', 'og:title');
    ogTitle.setAttribute('content', fullTitle);

    const ogDesc = getOrCreateMeta('property', 'og:description');
    ogDesc.setAttribute('content', description);

    const ogTypeMeta = getOrCreateMeta('property', 'og:type');
    ogTypeMeta.setAttribute('content', ogType);

    const ogUrlMeta = getOrCreateMeta('property', 'og:url');
    ogUrlMeta.setAttribute('content', currentUrl);

    const defaultImage = `${productionDomain}/favicon-512x512.png`;
    const fullImageUrl = image
      ? (image.startsWith('http') ? image : `${productionDomain}${image}`)
      : defaultImage;

    const ogImageMeta = getOrCreateMeta('property', 'og:image');
    ogImageMeta.setAttribute('content', fullImageUrl);

    // Twitter Card Meta Tags (twitter:title, twitter:description, twitter:url, twitter:image)
    const twitterTitle = getOrCreateMeta('name', 'twitter:title');
    twitterTitle.setAttribute('content', fullTitle);

    const twitterDesc = getOrCreateMeta('name', 'twitter:description');
    twitterDesc.setAttribute('content', description);

    const twitterUrlMeta = getOrCreateMeta('name', 'twitter:url');
    twitterUrlMeta.setAttribute('content', currentUrl);

    const twitterImageMeta = getOrCreateMeta('name', 'twitter:image');
    twitterImageMeta.setAttribute('content', fullImageUrl);

    // 5. Update Canonical Tag
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (noIndex) {
      if (canonical) canonical.remove();
    } else if (canonicalPath) {
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', currentUrl);
    }

    // 6. Schema.org JSON-LD Structured Data Injection
    let scriptTag = document.getElementById('seo-jsonld') as HTMLScriptElement | null;

    const schemasToRender: Array<Record<string, any>> = [];

    // Custom or article structured data
    if (jsonLd) {
      if (Array.isArray(jsonLd)) {
        schemasToRender.push(...jsonLd);
      } else {
        schemasToRender.push(jsonLd);
      }
    } else if (ogType === 'article') {
      schemasToRender.push({
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
      });
    }

    // BreadcrumbList Structured Data
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemasToRender.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: crumb.name,
          item: crumb.path.startsWith('http') ? crumb.path : `${productionDomain}${crumb.path}`,
        })),
      });
    }

    if (schemasToRender.length === 1) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.type = 'application/ld+json';
        scriptTag.id = 'seo-jsonld';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schemasToRender[0], null, 2);
    } else if (schemasToRender.length > 1) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.type = 'application/ld+json';
        scriptTag.id = 'seo-jsonld';
        document.head.appendChild(scriptTag);
      }
      const graphData = {
        '@context': 'https://schema.org',
        '@graph': schemasToRender.map((schema) => {
          const { '@context': _ctx, ...rest } = schema;
          return rest;
        }),
      };
      scriptTag.textContent = JSON.stringify(graphData, null, 2);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, canonicalPath, noIndex, ogType, image, articleStr, jsonLdStr, breadcrumbsStr]);

  return null;
};
