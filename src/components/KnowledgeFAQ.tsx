import React, { useState } from 'react';
import { 
  ChevronDown, 
  ExternalLink, 
  Phone, 
  ArrowRight, 
  BookOpen, 
  Scale 
} from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';

export const KnowledgeFAQ: React.FC = () => {
  const { data: FIRM_DATA } = useFirmData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>('statutory-audit-mandate');

  const categories = ['All', 'Audit & Assurance', 'Income Tax', 'GST Compliance', 'Corporate & RERA'];

  const filteredFaqs = selectedCategory === 'All' 
    ? FIRM_DATA.faqs 
    : FIRM_DATA.faqs.filter(faq => faq.category === selectedCategory);

  const toggleAccordion = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <section className="py-16 sm:py-24 bg-brand-warm border-y border-border" id="knowledge-faq">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-brand-pale text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
            <BookOpen className="w-3.5 h-3.5 text-gold-dark" />
            <span>Statutory Knowledge & Advisory FAQ</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-primary tracking-tight">
            Clear Answers to Core Compliance Questions
          </h2>
          <p className="mt-3 text-base text-charcoal-muted leading-relaxed">
            Straightforward explanations of Indian corporate laws, direct taxes, GST thresholds, and statutory audit mandates to help business leaders navigate regulatory obligations.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all btn-tactile ${
                selectedCategory === cat
                  ? 'bg-brand-primary text-white shadow-xs'
                  : 'bg-white text-charcoal border border-border hover:bg-brand-surface hover:border-gold/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion Grid */}
        <div className="max-w-4xl mx-auto space-y-3.5 mb-16">
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-xl border transition-all ${
                  isExpanded 
                    ? 'bg-white border-gold/60 shadow-card' 
                    : 'bg-white border-border shadow-subtle hover:border-border/80'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  aria-expanded={isExpanded}
                  className="w-full px-5 sm:px-6 py-4.5 text-left flex items-start justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-xl"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dark bg-brand-pale px-2 py-0.5 rounded border border-emerald-100">
                        {faq.category}
                      </span>
                      <span className="text-[11px] font-mono text-charcoal-light">
                        {faq.statuteReference}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-primary mt-1">
                      {faq.question}
                    </h3>
                  </div>

                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 mt-1 ${
                    isExpanded ? 'bg-brand-pale text-brand-primary rotate-180' : 'bg-brand-surface text-charcoal-muted'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-charcoal leading-relaxed border-t border-border/50 animate-fadeIn">
                    <p className="mt-2 text-charcoal-muted leading-relaxed">
                      {faq.answer}
                    </p>
                    <div className="mt-3.5 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-charcoal-light">
                      <span className="flex items-center gap-1.5 text-emerald-800 font-medium">
                        <Scale className="w-3.5 h-3.5 text-gold-dark" />
                        <span>Statutory Reference: {faq.statuteReference}</span>
                      </span>
                      <a
                        href={FIRM_DATA.contact.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold-dark hover:underline font-semibold"
                      >
                        Ask CA KavithaVijay SRJ →
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Official Government & Regulatory Portals Strip (Knowledge Resource) */}
        <div className="bg-brand-surface rounded-2xl p-6 sm:p-8 border border-border shadow-subtle">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block mb-1">
                Official Compliance Portals
              </span>
              <h3 className="font-serif text-2xl font-bold text-brand-primary">
                Direct Government & Statutory Resources
              </h3>
            </div>
            <p className="text-xs text-charcoal-muted max-w-md">
              Verified public portals for official e-filings, MCA company master data, GST registration checks, and ICAI standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FIRM_DATA.officialPortals.map((portal) => (
              <a
                key={portal.name}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-xl border border-border shadow-subtle hover:border-gold hover:shadow-card transition-all group card-tactile flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-brand-pale px-2 py-0.5 rounded border border-emerald-100">
                      {portal.authority}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-charcoal-light group-hover:text-gold-dark transition-colors" />
                  </div>
                  <h4 className="font-serif text-base font-bold text-brand-primary group-hover:text-brand-deep">
                    {portal.name}
                  </h4>
                  <p className="text-[11px] text-charcoal-muted mt-1 leading-relaxed">
                    {portal.purpose}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-border/50 text-[11px] font-semibold text-gold-dark flex items-center gap-1">
                  <span>Visit Official Portal</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </a>
            ))}

            {/* Direct Consultation Desk Prompt */}
            <div className="bg-[#0A2F24] text-white p-4 rounded-xl border border-emerald-900 shadow-subtle flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold bg-[#0F3E2E] px-2 py-0.5 rounded border border-gold/30">
                  Practice Assistance
                </span>
                <h4 className="font-serif text-base font-bold text-white mt-2">
                  Need Personalized Legal Guidance?
                </h4>
                <p className="text-[11px] text-emerald-100/90 mt-1 leading-relaxed">
                  Have an upcoming filing deadline or departmental notice? Schedule a direct discussion with CA KavithaVijay SRJ.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-emerald-800/80">
                <a
                  href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-gold-light"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {FIRM_DATA.contact.primaryPhone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
