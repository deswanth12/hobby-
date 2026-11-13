import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  Briefcase, 
  ShieldCheck, 
  FileText, 
  LineChart, 
  Building2, 
  Landmark, 
  CheckCircle2, 
  ChevronDown, 
  Phone, 
  MapPin, 
  ArrowRight, 
  Layers,
  ArrowLeft
} from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';
import { adminStorage } from '../services/adminStorage';
import { SEOHead } from '../components/SEOHead';
import { NotFoundPage } from './NotFoundPage';
import { WordReveal, BlurReveal } from '../components/animations';

// Icon resolver helper
const getServiceIcon = (name?: string) => {
  switch (name?.toLowerCase()) {
    case 'shieldcheck':
    case 'shield':
      return <ShieldCheck className="w-8 h-8 text-[#D8C296]" />;
    case 'filetext':
    case 'tax':
      return <FileText className="w-8 h-8 text-[#D8C296]" />;
    case 'linechart':
    case 'cfo':
      return <LineChart className="w-8 h-8 text-[#D8C296]" />;
    case 'building2':
    case 'corporate':
      return <Building2 className="w-8 h-8 text-[#D8C296]" />;
    case 'landmark':
    case 'rera':
      return <Landmark className="w-8 h-8 text-[#D8C296]" />;
    default:
      return <Briefcase className="w-8 h-8 text-[#D8C296]" />;
  }
};

export const DynamicServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data } = useFirmData();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const cleanSlug = (slug || '').toLowerCase().trim();
  const contentOverrides = adminStorage.getContentOverrides();

  // Check for redirects if slug was renamed
  if (contentOverrides.slugRedirects && contentOverrides.slugRedirects[cleanSlug]) {
    const targetSlug = contentOverrides.slugRedirects[cleanSlug];
    return <Navigate to={`/services/${targetSlug}`} replace />;
  }

  // Find service in merged context
  const service = (data.serviceCategories || []).find(s => s.id.toLowerCase() === cleanSlug);
  const rawService = contentOverrides.services?.[cleanSlug];

  // If deleted, draft, or not found, show 404
  const isDeleted = (contentOverrides.deletedServices || []).some(s => s.id.toLowerCase() === cleanSlug);
  const isDraft = rawService?.status === 'draft';

  if (!service || isDeleted || isDraft) {
    return <NotFoundPage />;
  }

  // Find related FAQs assigned to this service
  const relatedFaqs = (data.faqs || []).filter(faq => {
    const override = contentOverrides.faqs?.[faq.id];
    if (override?.serviceIds && Array.isArray(override.serviceIds)) {
      return override.serviceIds.includes(cleanSlug);
    }
    return false;
  });

  // Prepare SEO values
  const pageTitle = rawService?.seo?.metaTitle || `${service.title} in Tirupati | CA Kavitha & Associates`;
  const pageDescription = rawService?.seo?.metaDescription || service.shortDescription || `Professional ${service.title} services in Tirupati, Andhra Pradesh by Kavitha & Associates.`;
  const canonicalUrl = rawService?.seo?.canonicalUrl || `https://kavithaassociates.com/services/${service.id}`;

  // Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    'name': service.title,
    'description': service.shortDescription,
    'url': canonicalUrl,
    'provider': {
      '@type': 'AccountingService',
      'name': data.name,
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': data.contact.primaryLocation,
        'addressRegion': 'Andhra Pradesh',
        'addressCountry': 'IN'
      },
      'telephone': data.contact.primaryPhone
    }
  };

  // FAQ Schema if eligible
  const faqSchema = relatedFaqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': relatedFaqs.map(f => ({
      '@type': 'Question',
      'name': f.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': f.answer
      }
    }))
  } : undefined;

  return (
    <>
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        canonicalPath={`/services/${service.id}`}
        jsonLd={[jsonLd, ...(faqSchema ? [faqSchema] : [])]}
      />

      <div className="bg-[#F8EFDF] min-h-screen text-[#252B27]">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-[#F8EFDF] via-[#F5EAD8] to-[#EFE0C7] text-[#252B27] pt-28 pb-16 sm:pt-36 sm:pb-20 border-b border-[#E8D5B5] overflow-hidden">
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-pattern-architectural-dots" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center space-x-2 text-xs uppercase tracking-wider text-[#7E5E1E] font-editorial-meta font-semibold">
                <li>
                  <Link to="/" className="text-[#7E5E1E] hover:text-[#153F32] transition-colors">Home</Link>
                </li>
                <li>/</li>
                <li>
                  <Link to="/services" className="text-[#7E5E1E] hover:text-[#153F32] transition-colors">Services</Link>
                </li>
                <li>/</li>
                <li className="text-[#153F32] font-semibold truncate max-w-xs sm:max-w-md">{service.title}</li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#DDE8D9] rounded-full border border-[#153F32]/25 text-[#153F32] text-xs font-editorial-meta tracking-wider uppercase mb-6 shadow-xs">
                <Layers className="w-3.5 h-3.5 text-[#153F32]" />
                <span>Practice Domain</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#153F32] mb-6 leading-tight">
                <WordReveal text={service.title} />
              </h1>

              <BlurReveal className="mb-8">
                <p className="text-base sm:text-lg text-[#525954] font-normal leading-relaxed">
                  {service.shortDescription}
                </p>
              </BlurReveal>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/contact"
                  className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3.5 bg-[#153F32] hover:bg-[#102D25] text-white font-editorial-meta text-xs font-semibold tracking-wider uppercase rounded-full transition-colors shadow-sm hover:shadow-md border border-[#C3A66B]/50 btn-tactile"
                >
                  <span>Request Consultation</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                </Link>

                <a
                  href={`tel:${data.contact.primaryPhoneClean}`}
                  className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-[#FFF9EE] border border-[#E8D5B5] hover:border-[#C3A66B] text-[#153F32] font-editorial-meta text-xs font-semibold tracking-wider uppercase rounded-full transition-colors shadow-card btn-tactile"
                >
                  <Phone className="w-4 h-4 text-[#153F32]" />
                  <span>{data.contact.primaryPhone}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Core Scope & Statutory Framework */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Left Column: Scope & Deliverables */}
              <div className="lg:col-span-2 space-y-12">
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl text-[#102D25] font-light mb-6">
                    Statutory Scope & Engagement Methodology
                  </h2>
                  <div className="prose prose-stone text-base text-[#102D25]/80 font-light leading-relaxed">
                    <p className="whitespace-pre-line">
                      {service.fullDescription || service.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Sub-services / Deliverables */}
                {service.services && service.services.length > 0 && (
                  <div className="bg-white p-8 rounded-2xl border border-[#E8D5B5] shadow-card">
                    <h3 className="font-serif text-xl font-bold text-[#153F32] mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#DDE8D9] text-[#153F32] flex items-center justify-center border border-[#153F32]/15">
                        <CheckCircle2 className="w-4 h-4 text-[#153F32]" />
                      </div>
                      <span>Engagement Deliverables & Practice Coverage</span>
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {service.services.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-[#252B27]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C3A66B] mt-2 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Typical Practice Scenarios */}
                {service.typicalScenarios && service.typicalScenarios.length > 0 && (
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#153F32] mb-6">
                      Applicable Scenarios & Business Triggers
                    </h3>
                    <div className="space-y-3">
                      {service.typicalScenarios.map((scenario, idx) => (
                        <div 
                          key={idx}
                          className="p-4 rounded-xl bg-white border border-[#E8D5B5] shadow-subtle flex items-start gap-3"
                        >
                          <span className="font-serif text-xs text-[#7E5E1E] font-bold mt-0.5">
                            {String(idx + 1).padStart(2, '0')}.
                          </span>
                          <span className="text-sm text-[#252B27] leading-relaxed">
                            {scenario}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Metadata Sidebar */}
              <div className="space-y-6">
                <div className="bg-white text-[#252B27] p-8 rounded-2xl border border-[#E8D5B5] shadow-card space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-[#DDE8D9] text-[#153F32] flex items-center justify-center border border-[#153F32]/20">
                    {getServiceIcon(service.iconName)}
                  </div>

                  <div>
                    <span className="text-xs font-editorial-meta uppercase tracking-wider text-[#7E5E1E] font-semibold block mb-1">
                      Statutory Framework
                    </span>
                    <p className="text-sm font-semibold text-[#153F32]">
                      {service.statutoryFramework || 'ICAI Standards & Applicable Central/State Acts'}
                    </p>
                  </div>

                  <hr className="border-[#E8D5B5]" />

                  <div>
                    <span className="text-xs font-editorial-meta uppercase tracking-wider text-[#7E5E1E] font-semibold block mb-1">
                      Target Entities & Sectors
                    </span>
                    <p className="text-sm font-semibold text-[#153F32]">
                      {service.targetClients || 'Corporates, MSMEs, High Net-Worth Individuals & LLPs'}
                    </p>
                  </div>

                  <hr className="border-[#E8D5B5]" />

                  <div>
                    <span className="text-xs font-editorial-meta uppercase tracking-wider text-[#7E5E1E] font-semibold block mb-1">
                      Jurisdiction
                    </span>
                    <p className="text-sm font-semibold text-[#153F32] flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#C3A66B]" />
                      <span>Tirupati, Rayalaseema & Andhra Pradesh</span>
                    </p>
                  </div>

                  <div className="pt-4">
                    <Link
                      to="/contact"
                      className="w-full text-center block px-4 py-3 bg-[#153F32] hover:bg-[#102D25] text-white font-editorial-meta text-xs font-semibold tracking-wider uppercase rounded-full transition-colors shadow-sm hover:shadow-md border border-[#C3A66B]/50"
                    >
                      Schedule Advisory Session
                    </Link>
                  </div>
                </div>

                <div className="p-6 rounded-lg bg-white border border-[#102D25]/10 text-center">
                  <h4 className="font-serif text-lg text-[#102D25] mb-2">Need Further Guidance?</h4>
                  <p className="text-xs text-[#102D25]/70 mb-4 leading-relaxed">
                    Direct your technical statutory queries to our chartered accountancy team in Tirupati.
                  </p>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 text-xs font-mono text-[#102D25] font-semibold hover:text-[#D8C296] transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>View All Practice Services</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Related FAQs Accordion */}
        {relatedFaqs.length > 0 && (
          <section className="py-16 bg-white border-t border-[#102D25]/10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-xl mx-auto mb-12">
                <span className="text-xs font-mono uppercase tracking-wider text-[#D8C296]">
                  Regulatory Clarifications
                </span>
                <h2 className="font-serif text-2xl md:text-3xl text-[#102D25] font-light mt-2">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-4">
                {relatedFaqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div 
                      key={faq.id}
                      className="border border-[#102D25]/10 rounded-lg overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-[#FAF9F6] transition-colors"
                        aria-expanded={isOpen}
                      >
                        <span className="font-serif text-base text-[#102D25] font-normal">
                          {faq.question}
                        </span>
                        <ChevronDown 
                          className={`w-5 h-5 text-[#102D25]/60 transition-transform duration-200 flex-shrink-0 ${
                            isOpen ? 'transform rotate-180' : ''
                          }`} 
                        />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-2 text-sm text-[#102D25]/80 font-light leading-relaxed border-t border-[#102D25]/5 bg-[#FAF9F6]/50">
                          <p>{faq.answer}</p>
                          {faq.statuteReference && (
                            <p className="mt-3 text-xs font-mono text-[#102D25]/60">
                              Statutory Ref: {faq.statuteReference}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};
