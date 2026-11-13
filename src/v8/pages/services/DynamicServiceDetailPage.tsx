import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  Briefcase, 
  ShieldCheck, 
  FileText, 
  LineChart, 
  Building2, 
  Landmark, 
  CheckCircle2, 
  ArrowLeft,
  ChevronRight,
  Home
} from 'lucide-react';
import { getServiceBySlug, getPublishedFaqs } from '../../adapters/contentAdapter';
import { useFirmProfile } from '../../adapters/backendAdapter';
import { adminStorage } from '../../../services/adminStorage';
import { SEOHead } from '../../../components/SEOHead';
import { NotFoundPage } from '../NotFoundPage';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Accordion, AccordionItem } from '../../components/common/Accordion';

const CANONICAL_MAP: Record<string, string> = {
  'audit-assurance': '/services/audit-assurance',
  'income-tax-consultant-tirupati': '/services/income-tax-consultant-tirupati',
  'income-tax': '/services/income-tax-consultant-tirupati',
  'gst-consultant-tirupati': '/services/gst-consultant-tirupati',
  'gst': '/services/gst-consultant-tirupati',
  'company-registration-tirupati': '/services/company-registration-tirupati',
  'corporate-business': '/services/company-registration-tirupati',
  'virtual-cfo-tirupati': '/services/virtual-cfo-tirupati',
  'advisory-consulting': '/services/virtual-cfo-tirupati',
  'rera-consultant-tirupati': '/services/rera-consultant-tirupati',
  'rera-compliance': '/services/rera-consultant-tirupati',
};

const getServiceIcon = (name?: string) => {
  switch (name?.toLowerCase()) {
    case 'shieldcheck':
    case 'shield':
      return <ShieldCheck className="w-8 h-8 text-[#B49A64]" />;
    case 'filetext':
    case 'tax':
      return <FileText className="w-8 h-8 text-[#B49A64]" />;
    case 'linechart':
    case 'cfo':
      return <LineChart className="w-8 h-8 text-[#B49A64]" />;
    case 'building2':
    case 'corporate':
      return <Building2 className="w-8 h-8 text-[#B49A64]" />;
    case 'landmark':
    case 'rera':
      return <Landmark className="w-8 h-8 text-[#B49A64]" />;
    default:
      return <Briefcase className="w-8 h-8 text-[#B49A64]" />;
  }
};

export const DynamicServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const firmProfile = useFirmProfile();
  const cleanSlug = (slug || '').toLowerCase().trim();

  // 1. Canonical corridors redirection
  if (CANONICAL_MAP[cleanSlug]) {
    return <Navigate to={CANONICAL_MAP[cleanSlug]} replace />;
  }

  // 2. Slug renaming redirection from admin overrides
  const overrides = typeof window !== 'undefined' ? adminStorage.getContentOverrides() : null;
  if (overrides?.slugRedirects && overrides.slugRedirects[cleanSlug]) {
    const targetSlug = overrides.slugRedirects[cleanSlug];
    return <Navigate to={`/services/${targetSlug}`} replace />;
  }

  // 3. Draft & Deletion Quarantine
  const isDeleted = (overrides?.deletedServices || []).some(s => s.id.toLowerCase() === cleanSlug);
  const rawService = overrides?.services?.[cleanSlug];
  const isDraft = rawService?.status === 'draft';
  const service = getServiceBySlug(cleanSlug);

  if (!service || isDeleted || isDraft) {
    return <NotFoundPage />;
  }

  // Related FAQs
  const relatedFaqs = getPublishedFaqs(service.id);
  const faqItems: AccordionItem[] = relatedFaqs.map(f => ({
    id: f.id,
    title: f.question,
    content: <p>{f.answer}</p>
  }));

  const pageTitle = rawService?.seo?.metaTitle || `${service.title} in Tirupati | CA Kavitha & Associates`;
  const pageDescription = rawService?.seo?.metaDescription || service.shortDescription || `Professional ${service.title} services in Tirupati by Kavitha & Associates.`;

  return (
    <div className="bg-[#F1EBDD] text-[#35271F] min-h-screen page-reveal">
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        canonicalPath={`/services/${service.id}`}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: service.title, path: `/services/${service.id}` }
        ]}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'ProfessionalService',
            name: service.title,
            description: service.shortDescription,
            url: `https://kavithaassociates.com/services/${service.id}`,
            provider: {
              '@type': 'AccountingService',
              name: firmProfile.name,
              telephone: firmProfile.contact.primaryPhone,
            },
            areaServed: 'Tirupati, Andhra Pradesh, India'
          }
        ]}
      />

      {/* Header Banner */}
      <section className="bg-[#071B14] text-[#F1EBDD] py-12 sm:py-16 md:py-20 border-b border-[#B49A64]/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[#AAB4A0]">
            <Link to="/" className="inline-flex items-center gap-1.5 hover:text-[#F1EBDD] transition-colors min-h-[44px]">
              <Home className="w-3.5 h-3.5 text-[#B49A64]" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#B49A64]/50" />
            <Link to="/services" className="hover:text-[#F1EBDD] transition-colors min-h-[44px] inline-flex items-center">
              <span>Services</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#B49A64]/50" />
            <span className="text-[#B49A64] font-semibold">{service.title}</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2.5 flex-wrap">
              <Badge variant="kicker">STATUTORY PRACTICE AREA</Badge>
              {service.statutoryFramework && (
                <span className="font-mono text-xs text-[#B49A64] bg-[#0B241C] px-3 py-1 rounded-full border border-[#B49A64]/30">
                  {service.statutoryFramework}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#183529] border border-[#B49A64]/40 flex items-center justify-center shrink-0">
                {getServiceIcon(service.iconName)}
              </div>
              <h1 className="font-editorial-h1 text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#F1EBDD]">
                {service.title}
              </h1>
            </div>

            <p className="font-editorial-body text-sm sm:text-base text-[#F1EBDD]/80 leading-relaxed">
              {service.fullDescription || service.shortDescription}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button to="/contact" variant="primary" size="md" dualArrow>
                Consult on this Practice Area
              </Button>
              <Link
                to="/services"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[#D8D0BE]/40 text-xs font-semibold text-[#F1EBDD] hover:bg-white/10 transition-colors min-h-[44px]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Practice Areas</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main 2-Column Content */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 8 Columns: Deliverables & Scenarios */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* Engagement Deliverables */}
              {service.services && service.services.length > 0 && (
                <div className="bg-[#FAF7F0] p-6 sm:p-8 rounded-2xl border border-[#D8D0BE] shadow-xs space-y-4">
                  <div className="border-b border-[#D8D0BE] pb-3">
                    <h2 className="font-serif text-lg font-bold text-[#183529]">
                      Statutory Scope &amp; Engagements Included ({service.services.length} Areas)
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.services.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FFFFFF] border border-[#D8D0BE]/70">
                        <CheckCircle2 className="w-4 h-4 text-[#183529] shrink-0 mt-0.5" />
                        <span className="text-xs text-[#35271F] font-medium leading-relaxed">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Scenarios */}
              {service.typicalScenarios && service.typicalScenarios.length > 0 && (
                <div className="bg-[#FAF7F0] p-6 sm:p-8 rounded-2xl border border-[#D8D0BE] shadow-xs space-y-4">
                  <h3 className="font-serif text-base font-bold text-[#183529] uppercase tracking-wider">
                    Common Practice Triggers &amp; Client Scenarios
                  </h3>
                  <ul className="space-y-2">
                    {service.typicalScenarios.map((scen, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2.5 text-xs text-[#525954] leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B49A64] shrink-0 mt-1.5" />
                        <span>{scen}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Associated FAQs */}
              {faqItems.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-[#183529]">
                    Frequently Asked Questions Regarding {service.title}
                  </h3>
                  <Accordion items={faqItems} />
                </div>
              )}
            </div>

            {/* Right 4 Columns: Metadata Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#FAF7F0] p-6 rounded-2xl border border-[#D8D0BE] shadow-xs space-y-4">
                <span className="font-mono text-xs font-bold text-[#7E5E1E] uppercase tracking-wider block">
                  PRACTICE DOSSIER
                </span>

                <div className="space-y-3 text-xs">
                  {service.statutoryFramework && (
                    <div>
                      <strong className="block text-[#183529] font-semibold mb-0.5">Statutory Framework:</strong>
                      <span className="text-[#525954]">{service.statutoryFramework}</span>
                    </div>
                  )}

                  {service.targetClients && (
                    <div className="pt-2 border-t border-[#D8D0BE]/60">
                      <strong className="block text-[#183529] font-semibold mb-0.5">Target Entities:</strong>
                      <span className="text-[#525954]">{service.targetClients}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#D8D0BE]/60">
                    <strong className="block text-[#183529] font-semibold mb-0.5">Supervising Partner:</strong>
                    <span className="text-[#35271F] font-medium">CA Kavitha Vijay (B.Com, CA, CMA AIR 49 ICMAI)</span>
                  </div>

                  <div className="pt-2 border-t border-[#D8D0BE]/60">
                    <strong className="block text-[#183529] font-semibold mb-0.5">Jurisdiction:</strong>
                    <span className="text-[#525954]">Tirupati Chambers &amp; Pan-India Filings</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button to="/contact" variant="primary" size="sm" className="w-full">
                    Schedule Advisory Session
                  </Button>
                </div>
              </div>

              <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#D8D0BE] shadow-xs space-y-3 text-xs">
                <span className="font-serif text-sm font-bold text-[#183529] block">
                  Need Comprehensive Retainer Advisory?
                </span>
                <p className="text-[#525954] leading-relaxed">
                  Combine this service with our Virtual CFO controllership and annual compliance retainers.
                </p>
                <Link
                  to="/services/virtual-cfo-tirupati"
                  className="text-[#183529] hover:text-[#071B14] font-semibold inline-flex items-center gap-1 min-h-[44px]"
                >
                  <span>Explore Virtual CFO Retainers &rarr;</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default DynamicServiceDetailPage;
