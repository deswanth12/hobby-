/**
 * src/v8/adapters/contentAdapter.ts
 * 
 * V8.0 Content Presentation & Draft Protection Adapter Layer for Kavitha & Associates.
 * 
 * Provides unified, strongly typed, and draft-quarantined access to:
 * 1. Published Editorial Regulatory Insights / Blog Articles (triple-layer draft quarantine)
 * 2. Practice Area Categories & Core Practice Disciplines for V8.0 Corridors
 * 3. Statutory FAQs & Knowledge Base Entries
 * 4. Audit Spotlight Engagements & Sub-service Scopes
 * 
 * Preserves 100% backwards compatibility with existing backend systems:
 * - BlogService static Git + adminStorage dynamic merging
 * - FIRM_DATA serviceCategories & faqs baseline
 * - adminStorage content overrides & slug redirects
 * - Triple-layer draft protection (database RLS, server 404, client service 404)
 */

import { BlogService, BlogPost } from '../../services/blogService';
import { FIRM_DATA, FirmProfile, ServiceCategory, FAQItem, AuditItem } from '../../data/firmData';
import { adminStorage } from '../../services/adminStorage';

// ---------------------------------------------------------------------------
// Type Definitions & Interface Contracts
// ---------------------------------------------------------------------------

export type { BlogPost, ServiceCategory, FAQItem, AuditItem };

/**
 * Presentation model for V8.0 practice area cards and overview grids.
 */
export interface ServiceCardView {
  id: string; // URL slug identifier
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  statutoryFramework?: string;
  targetClients?: string;
  typicalScenarios: string[];
  services: string[]; // Sub-services / deliverables
  isCorePractice: boolean;
  disciplineCode?: string; // e.g. "PRAC-01"
  order: number;
  routePath: string;
}

/**
 * Editorial bundle for Homepage Section 6 (Featured Regulatory Insights).
 * Strictly guarantees draft exclusion.
 */
export interface FeaturedInsightsBundle {
  leadArticle: BlogPost;
  companionArticles: BlogPost[];
  totalPublished: number;
}

// ---------------------------------------------------------------------------
// Slug & Route Canonical Mapping
// ---------------------------------------------------------------------------

/**
 * Maps dedicated V8 corridor URL slugs to internal category identifiers.
 */
const CANONICAL_CORRIDOR_SLUGS: Record<string, { id: string; code: string; route: string }> = {
  'audit-assurance': {
    id: 'audit-assurance',
    code: 'PRAC-01',
    route: '/services/audit-assurance',
  },
  'income-tax-consultant-tirupati': {
    id: 'income-tax',
    code: 'PRAC-02',
    route: '/services/income-tax-consultant-tirupati',
  },
  'income-tax': {
    id: 'income-tax',
    code: 'PRAC-02',
    route: '/services/income-tax-consultant-tirupati',
  },
  'gst-consultant-tirupati': {
    id: 'gst',
    code: 'PRAC-03',
    route: '/services/gst-consultant-tirupati',
  },
  'gst': {
    id: 'gst',
    code: 'PRAC-03',
    route: '/services/gst-consultant-tirupati',
  },
  'company-registration-tirupati': {
    id: 'corporate-business',
    code: 'PRAC-04',
    route: '/services/company-registration-tirupati',
  },
  'corporate-business': {
    id: 'corporate-business',
    code: 'PRAC-04',
    route: '/services/company-registration-tirupati',
  },
  'virtual-cfo-tirupati': {
    id: 'advisory-consulting',
    code: 'PRAC-05',
    route: '/services/virtual-cfo-tirupati',
  },
  'advisory-consulting': {
    id: 'advisory-consulting',
    code: 'PRAC-05',
    route: '/services/virtual-cfo-tirupati',
  },
  'rera-consultant-tirupati': {
    id: 'rera-compliance',
    code: 'PRAC-06',
    route: '/services/rera-consultant-tirupati',
  },
  'rera-compliance': {
    id: 'rera-compliance',
    code: 'PRAC-06',
    route: '/services/rera-consultant-tirupati',
  },
};

// ---------------------------------------------------------------------------
// Blog & Editorial Insights Accessors (Strict Draft Quarantine)
// ---------------------------------------------------------------------------

/**
 * Retrieves all published blog posts sorted by date descending.
 * Strictly filters out drafts (`draft === false`).
 */
export function getPublishedArticles(): BlogPost[] {
  return BlogService.getAllPosts(false);
}

/**
 * Retrieves a single published article by its slug.
 * Returns `undefined` if the slug is not found or if the article is marked as draft.
 * Serves as the primary client-side draft quarantine mechanism.
 */
export function getArticleBySlug(slug: string): BlogPost | undefined {
  if (!slug || typeof slug !== 'string') return undefined;
  return BlogService.getPostBySlug(slug.trim(), false);
}

/**
 * Checks if a given slug belongs to a draft article (used for 404 quarantine validation).
 */
export function isDraftArticle(slug: string): boolean {
  if (!slug || typeof slug !== 'string') return false;
  const allPosts = BlogService.getAllPosts(true);
  const found = allPosts.find(p => p.slug.toLowerCase().trim() === slug.toLowerCase().trim());
  return Boolean(found && found.draft);
}

/**
 * Retrieves the featured articles bundle for Homepage Section 6 (1 lead + 2 companions).
 * Strictly guarantees draft exclusion.
 */
export function getFeaturedInsights(limit: number = 3): FeaturedInsightsBundle | null {
  const published = getPublishedArticles();
  if (published.length === 0) return null;

  const leadArticle = published[0];
  const companionArticles = published.slice(1, limit);

  return {
    leadArticle,
    companionArticles,
    totalPublished: published.length,
  };
}

/**
 * Retrieves related published articles based on common tags, excluding the current article and all drafts.
 */
export function getRelatedArticles(currentSlug: string, limit: number = 3): BlogPost[] {
  return BlogService.getRelatedPosts(currentSlug, limit);
}

/**
 * Retrieves all unique categories/tags across published articles.
 */
export function getAllArticleTags(): string[] {
  return BlogService.getAllTags();
}

/**
 * Filters published articles by a specific tag.
 */
export function getArticlesByTag(tag: string): BlogPost[] {
  if (!tag) return getPublishedArticles();
  const cleanTag = tag.toLowerCase().trim();
  return getPublishedArticles().filter(p => 
    p.tags.some(t => t.toLowerCase().trim() === cleanTag)
  );
}

/**
 * Full-text search over published articles (title, excerpt, content, tags).
 * Strictly excludes drafts.
 */
export function searchPublishedArticles(query: string): BlogPost[] {
  const clean = (query || '').toLowerCase().trim();
  if (!clean) return getPublishedArticles();

  return getPublishedArticles().filter(p => {
    return (
      p.title.toLowerCase().includes(clean) ||
      p.excerpt.toLowerCase().includes(clean) ||
      p.tags.some(t => t.toLowerCase().includes(clean)) ||
      p.content.toLowerCase().includes(clean)
    );
  });
}

// ---------------------------------------------------------------------------
// Practice Areas & Services Accessors
// ---------------------------------------------------------------------------

/**
 * Retrieves all published practice areas, combining baseline with dynamic overrides.
 * Strictly excludes soft-deleted services and draft services.
 */
export function getAllServices(): ServiceCategory[] {
  const base: FirmProfile = JSON.parse(JSON.stringify(FIRM_DATA));
  let services = [...base.serviceCategories];

  if (typeof window !== 'undefined') {
    try {
      const overrides = adminStorage.getContentOverrides();
      if (overrides.services) {
        const deletedIds = new Set((overrides.deletedServices || []).map(d => d.id));
        const existingIds = new Set(services.map(c => c.id));

        // 1. Update existing baseline services
        const updatedExisting = services
          .filter(cat => {
            if (deletedIds.has(cat.id)) return false;
            const override = overrides.services?.[cat.id];
            return override ? override.status !== 'draft' : true;
          })
          .map(cat => {
            const override = overrides.services?.[cat.id];
            if (override) {
              return {
                ...cat,
                title: override.title || cat.title,
                shortDescription: override.shortDescription || cat.shortDescription,
                fullDescription: override.fullDescription || cat.fullDescription,
                statutoryFramework: override.statutoryFramework ?? cat.statutoryFramework,
                targetClients: override.targetClients ?? cat.targetClients,
                typicalScenarios: override.typicalScenarios ?? cat.typicalScenarios,
                services: override.services ?? cat.services,
                iconName: override.iconName ?? cat.iconName,
              };
            }
            return cat;
          });

        // 2. Add dynamically created published services
        const dynamicServices: ServiceCategory[] = Object.values(overrides.services)
          .filter(s => s && s.id && !existingIds.has(s.id) && !deletedIds.has(s.id) && s.status === 'published')
          .map(s => ({
            id: s.id,
            title: s.title || s.id,
            shortDescription: s.shortDescription || '',
            fullDescription: s.fullDescription || '',
            iconName: s.iconName || 'Briefcase',
            statutoryFramework: s.statutoryFramework,
            targetClients: s.targetClients,
            typicalScenarios: s.typicalScenarios || [],
            services: s.services || [],
          }));

        services = [...updatedExisting, ...dynamicServices];
      }
    } catch {
      // Fallback to static services
    }
  }

  return services;
}

/**
 * Synthesizes an independent ServiceCategory representation for Audit & Assurance
 * from FIRM_DATA.auditSpotlight.
 */
function getAuditAssuranceService(): ServiceCategory {
  const spotlight = FIRM_DATA.auditSpotlight;
  return {
    id: 'audit-assurance',
    title: spotlight.title,
    shortDescription: spotlight.description,
    fullDescription: `${spotlight.description} Comprehensive audit and assurance portfolio covering statutory company audits under the Companies Act 2013, tax audits under Section 44AB of the Income Tax Act, internal operational risk audits under Section 138, and banking concurrent audits.`,
    iconName: 'ShieldCheck',
    statutoryFramework: 'Companies Act, 2013 | Income Tax Act, 1961 | ICAI Auditing Standards (SAs)',
    targetClients: 'Private & Public Companies, LLPs, Banks, Funded Startups & MSMEs',
    typicalScenarios: [
      'Mandatory annual statutory audit for incorporated entities under Companies Act 2013',
      'Tax audit under Section 44AB for business turnover exceeding statutory thresholds',
      'Internal financial control (IFC) and CARO 2020 compliance reporting',
      'Stock and inventory audits for bank working capital drawing power certifications'
    ],
    services: spotlight.services.map(s => `${s.name}: ${s.scope}`),
  };
}

/**
 * Retrieves a service category by its URL slug or canonical alias.
 * Returns `undefined` if the service does not exist or is marked as draft.
 */
export function getServiceBySlug(slug: string): ServiceCategory | undefined {
  if (!slug || typeof slug !== 'string') return undefined;
  const cleanSlug = slug.toLowerCase().trim();

  // Special case: Audit & Assurance corridor
  if (cleanSlug === 'audit-assurance') {
    return getAuditAssuranceService();
  }

  // Resolve canonical alias if applicable
  const aliasTarget = CANONICAL_CORRIDOR_SLUGS[cleanSlug];
  const targetId = aliasTarget ? aliasTarget.id : cleanSlug;

  const allServices = getAllServices();
  return allServices.find(s => s.id.toLowerCase() === targetId.toLowerCase() || s.id.toLowerCase() === cleanSlug);
}

/**
 * Returns the core practice disciplines configured for Homepage Section 3 and navigation.
 */
export function getCorePracticeAreas(): ServiceCardView[] {
  const audit = getAuditAssuranceService();
  const allServices = getAllServices();

  const incomeTax = allServices.find(s => s.id === 'income-tax') || FIRM_DATA.serviceCategories.find(s => s.id === 'income-tax')!;
  const gst = allServices.find(s => s.id === 'gst') || FIRM_DATA.serviceCategories.find(s => s.id === 'gst')!;
  const corporate = allServices.find(s => s.id === 'corporate-business') || FIRM_DATA.serviceCategories.find(s => s.id === 'corporate-business')!;
  const rera = allServices.find(s => s.id === 'rera-compliance') || FIRM_DATA.serviceCategories.find(s => s.id === 'rera-compliance')!;
  const advisory = allServices.find(s => s.id === 'advisory-consulting') || FIRM_DATA.serviceCategories.find(s => s.id === 'advisory-consulting')!;

  const coreList: ServiceCardView[] = [
    {
      id: 'audit-assurance',
      title: 'Statutory Audit & Assurance',
      shortDescription: audit.shortDescription,
      fullDescription: audit.fullDescription,
      iconName: 'ShieldCheck',
      statutoryFramework: audit.statutoryFramework,
      targetClients: audit.targetClients,
      typicalScenarios: audit.typicalScenarios || [],
      services: audit.services,
      isCorePractice: true,
      disciplineCode: 'PRAC-01',
      order: 1,
      routePath: '/services/audit-assurance',
    },
    {
      id: 'income-tax-consultant-tirupati',
      title: 'Direct Tax Advisory & Litigation',
      shortDescription: incomeTax.shortDescription,
      fullDescription: incomeTax.fullDescription,
      iconName: incomeTax.iconName || 'FileSpreadsheet',
      statutoryFramework: incomeTax.statutoryFramework,
      targetClients: incomeTax.targetClients,
      typicalScenarios: incomeTax.typicalScenarios || [],
      services: incomeTax.services,
      isCorePractice: true,
      disciplineCode: 'PRAC-02',
      order: 2,
      routePath: '/services/income-tax-consultant-tirupati',
    },
    {
      id: 'gst-consultant-tirupati',
      title: 'Indirect Tax & GST Compliance',
      shortDescription: gst.shortDescription,
      fullDescription: gst.fullDescription,
      iconName: gst.iconName || 'Receipt',
      statutoryFramework: gst.statutoryFramework,
      targetClients: gst.targetClients,
      typicalScenarios: gst.typicalScenarios || [],
      services: gst.services,
      isCorePractice: true,
      disciplineCode: 'PRAC-03',
      order: 3,
      routePath: '/services/gst-consultant-tirupati',
    },
    {
      id: 'company-registration-tirupati',
      title: 'Corporate Governance & Secretarial',
      shortDescription: corporate.shortDescription,
      fullDescription: corporate.fullDescription,
      iconName: corporate.iconName || 'Building2',
      statutoryFramework: corporate.statutoryFramework,
      targetClients: corporate.targetClients,
      typicalScenarios: corporate.typicalScenarios || [],
      services: corporate.services,
      isCorePractice: true,
      disciplineCode: 'PRAC-04',
      order: 4,
      routePath: '/services/company-registration-tirupati',
    },
    {
      id: 'virtual-cfo-tirupati',
      title: 'Virtual CFO & Financial Strategy',
      shortDescription: advisory.shortDescription,
      fullDescription: advisory.fullDescription,
      iconName: advisory.iconName || 'LineChart',
      statutoryFramework: advisory.statutoryFramework,
      targetClients: advisory.targetClients,
      typicalScenarios: advisory.typicalScenarios || [],
      services: advisory.services,
      isCorePractice: true,
      disciplineCode: 'PRAC-05',
      order: 5,
      routePath: '/services/virtual-cfo-tirupati',
    },
    {
      id: 'rera-consultant-tirupati',
      title: 'Real Estate & RERA Regulatory Advisory',
      shortDescription: rera.shortDescription,
      fullDescription: rera.fullDescription,
      iconName: rera.iconName || 'Building',
      statutoryFramework: rera.statutoryFramework,
      targetClients: rera.targetClients,
      typicalScenarios: rera.typicalScenarios || [],
      services: rera.services,
      isCorePractice: true,
      disciplineCode: 'PRAC-06',
      order: 6,
      routePath: '/services/rera-consultant-tirupati',
    },
  ];

  return coreList;
}

/**
 * Returns audit spotlight engagements from FIRM_DATA.
 */
export function getAuditSpotlightServices(): AuditItem[] {
  return FIRM_DATA.auditSpotlight.services;
}

// ---------------------------------------------------------------------------
// FAQ & Statutory Knowledge Accessors
// ---------------------------------------------------------------------------

/**
 * Retrieves published FAQs, optionally filtered by service slug/id.
 * Strictly excludes drafts and soft-deleted entries.
 */
export function getPublishedFaqs(serviceId?: string): FAQItem[] {
  const base: FirmProfile = JSON.parse(JSON.stringify(FIRM_DATA));
  let faqs = [...base.faqs];

  if (typeof window !== 'undefined') {
    try {
      const overrides = adminStorage.getContentOverrides();
      if (overrides.faqs) {
        const deletedIds = new Set((overrides.deletedFaqs || []).map(d => d.id));
        const existingIds = new Set(faqs.map(f => f.id));

        const updatedExisting = faqs
          .filter(faq => {
            if (deletedIds.has(faq.id)) return false;
            const override = overrides.faqs?.[faq.id];
            return override ? override.status !== 'draft' : true;
          })
          .map(faq => {
            const override = overrides.faqs?.[faq.id];
            if (override) {
              return {
                ...faq,
                question: override.question || faq.question,
                answer: override.answer || faq.answer,
                statuteReference: override.statuteReference ?? faq.statuteReference,
                category: (override.category || faq.category) as FAQItem['category'],
              };
            }
            return faq;
          });

        const dynamicFaqs: FAQItem[] = Object.values(overrides.faqs)
          .filter(f => f && f.id && !existingIds.has(f.id) && !deletedIds.has(f.id) && f.status === 'published')
          .map(f => ({
            id: f.id,
            category: (f.category || 'Audit & Assurance') as FAQItem['category'],
            question: f.question || '',
            answer: f.answer || '',
            statuteReference: f.statuteReference || '',
          }));

        faqs = [...updatedExisting, ...dynamicFaqs];
      }
    } catch {
      // Fallback to static FAQs
    }
  }

  if (serviceId) {
    const cleanId = serviceId.toLowerCase().trim();
    // Filter matching category or service association
    return faqs.filter(f => {
      const catLower = f.category.toLowerCase();
      if (cleanId.includes('tax') && catLower.includes('tax')) return true;
      if (cleanId.includes('gst') && catLower.includes('gst')) return true;
      if (cleanId.includes('audit') && catLower.includes('audit')) return true;
      if ((cleanId.includes('corporate') || cleanId.includes('rera') || cleanId.includes('company')) && catLower.includes('corporate')) return true;
      return false;
    });
  }

  return faqs;
}

/**
 * Retrieves published FAQs by their statutory category.
 */
export function getFaqsByCategory(category: FAQItem['category']): FAQItem[] {
  return getPublishedFaqs().filter(f => f.category === category);
}
