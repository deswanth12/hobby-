import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  FileText, 
  Building2, 
  Users, 
  Landmark,
  ArrowRight 
} from 'lucide-react';
import { DualArrowButton } from './animations';
import { CornerBrackets, EditorialMarker, PrecisionDotMatrix, SectionBoundaryDots } from './architectural';

interface ServicesSectionProps {
  className?: string;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ className = '' }) => {
  const practiceCategories = [
    {
      discipline: '01 / DISCIPLINE',
      title: 'Statutory Audit & Assurance',
      description: 'Independent statutory audits, internal financial controls, and corporate governance for private and public limited entities.',
      link: '/services/audit-assurance',
      icon: ShieldCheck,
      badge: 'ICAI Standards on Auditing',
      id: 'audit-spotlight'
    },
    {
      discipline: '02 / DISCIPLINE',
      title: 'Direct & Indirect Taxation',
      description: 'Comprehensive corporate tax planning, GST filings, transfer pricing documentation, and dispute representation.',
      link: '/services/income-tax-consultant-tirupati',
      icon: FileText,
      badge: 'IT Act & GST Compliance'
    },
    {
      discipline: '03 / DISCIPLINE',
      title: 'Corporate Advisory & Governance',
      description: 'Company secretarial support, MCA statutory compliance, due diligence, and capital structuring counsel.',
      link: '/services/company-registration-tirupati',
      icon: Building2,
      badge: 'Companies Act & MCA21'
    },
    {
      discipline: '04 / DISCIPLINE',
      title: 'Virtual CFO & Accounting Systems',
      description: 'Executive financial leadership, MIS reporting, working capital optimization, and financial controller supervision.',
      link: '/services/virtual-cfo-tirupati',
      icon: Users,
      badge: 'CMA Cost Controllership'
    },
    {
      discipline: '05 / DISCIPLINE',
      title: 'Project Finance & Regulatory Compliance',
      description: 'Bank loan syndication, CMA data preparation, RERA compliance, and statutory project feasibility documentation.',
      link: '/services/rera-consultant-tirupati',
      icon: Landmark,
      badge: 'Banking & AP RERA'
    }
  ];

  return (
    <section 
      id="services-overview" 
      className={`py-10 sm:py-14 lg:py-16 bg-[#F1EBDD] border-b border-[#D8D0BE] relative overflow-hidden texture-warm-ivory scroll-mt-28 ${className}`.trim()}
    >
      {/* Anchor Aliases for Legacy Links, Hero CTAs, Deep Links, and Test Lookups */}
      <div id="practice-areas" className="scroll-mt-28" />
      <div id="services" className="scroll-mt-28" />
      <div id="services-preview" className="scroll-mt-28" />

      <PrecisionDotMatrix rows={4} cols={6} variant="gold" className="absolute top-10 right-10 opacity-20 hidden lg:block" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-5 scroll-reveal">
          <div>
            <div className="flex items-center gap-2.5 mb-2.5 flex-wrap">
              <EditorialMarker number="02" label="PRACTICE DISCIPLINES" />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F0] border border-[#B49A64]/60 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#183D30]" />
                <span className="font-editorial-meta text-xs font-semibold uppercase tracking-wider text-[#35271F]">
                  STATUTORY DISCIPLINES
                </span>
              </div>
            </div>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl text-[#35271F] font-serif font-bold tracking-tight">
              Statutory Assurance &amp; Strategic Governance
            </h2>
          </div>
          <div className="max-w-md">
            <p className="font-editorial-body text-xs sm:text-sm text-[#525954] leading-relaxed">
              Partner-supervised statutory auditing, taxation, corporate governance, and financial controllership across India.
            </p>
          </div>
        </div>

        {/* 5 Core Practice Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 scroll-stagger">
          {practiceCategories.map((cat, idx) => {
            const Icon = cat.icon;
            const isWideCard = idx === 4;

            return (
              <div
                key={cat.title}
                id={cat.id}
                className={`bg-[#FFFDF7] rounded-2xl border border-[#D8D0BE] shadow-card overflow-hidden flex flex-col justify-between group hover:border-[#B49A64] hover:shadow-card-hover transition-all duration-300 scroll-reveal relative ${
                  isWideCard ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <CornerBrackets size={14} variant="gold" />
                
                <div className="p-5 sm:p-6 flex flex-col h-full justify-between">
                  <div>
                    {/* Top Meta Line: Discipline Code & Badge */}
                    <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2">
                      <span className="font-mono text-xs font-bold text-[#7E5E1E]">
                        {cat.discipline}
                      </span>
                      <span className="text-[11px] font-semibold text-[#7E5E1E] bg-[#FFF6E8] border border-[#D8D0BE] px-2.5 py-0.5 rounded-md">
                        {cat.badge}
                      </span>
                    </div>

                    {/* Icon and Title */}
                    <div className="flex items-start gap-3.5 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[#183529] text-[#B49A64] flex items-center justify-center shrink-0 border border-[#B49A64]/40 shadow-xs group-hover:bg-[#071B14] transition-colors">
                        <Icon className="w-5 h-5 text-[#B49A64]" />
                      </div>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#35271F] group-hover:text-[#183529] transition-colors leading-snug pt-1">
                        {cat.title}
                      </h3>
                    </div>

                    {/* Concise Editorial Description (~15–25 words) */}
                    <p className="font-editorial-body text-xs sm:text-sm text-[#525954] leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  {/* Direct Dedicated Page Link */}
                  <div className="mt-5 pt-3.5 border-t border-[#D8D0BE]/60 flex items-center justify-between">
                    <Link
                      to={cat.link}
                      className="min-h-[44px] inline-flex items-center gap-1.5 font-editorial-meta text-xs font-semibold text-[#35271F] hover:text-[#7E5E1E] transition-colors group/link"
                    >
                      <span>Explore Practice Details</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#B49A64] group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Boundary Dots Divider */}
        <SectionBoundaryDots variant="gold" className="my-8 opacity-75" />

        {/* Section Call to Action */}
        <div className="text-center scroll-reveal">
          <DualArrowButton
            to="/services"
            variant="secondary"
            className="inline-flex text-xs sm:text-sm font-semibold justify-center py-2.5 px-6 min-h-[46px]"
          >
            Explore Complete Practice Directory
          </DualArrowButton>
        </div>

      </div>
    </section>
  );
};

export default ServicesSection;
