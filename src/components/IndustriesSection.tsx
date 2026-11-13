import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Rocket, 
  Factory, 
  Home, 
  ShoppingCart, 
  Stethoscope, 
  GraduationCap, 
  Globe, 
  UserCheck, 
  HeartHandshake, 
  MapPin, 
  ArrowRight 
} from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';
import { FIRM_DATA as DEFAULT_FIRM_DATA } from '../data/firmData';
import { LetterReveal, AnimatedDotPattern } from './animations';
import { 
  CornerBrackets, 
  EditorialMarker, 
  PrecisionDotMatrix, 
  GeometricSymbol 
} from './architectural';

interface IndustriesSectionProps {
  className?: string;
}

export const IndustriesSection: React.FC<IndustriesSectionProps> = ({ className = '' }) => {
  const { data } = useFirmData();
  const firm = data || DEFAULT_FIRM_DATA;

  // Contextual icon map for the 10 industry sectors
  const getIndustryIcon = (industryName: string) => {
    switch (industryName) {
      case 'Startups':
        return Rocket;
      case 'MSMEs':
        return Building2;
      case 'Manufacturing':
        return Factory;
      case 'Real Estate & Construction':
        return Home;
      case 'Retail & Trading':
        return ShoppingCart;
      case 'Healthcare':
        return Stethoscope;
      case 'Education':
        return GraduationCap;
      case 'E-Commerce':
        return Globe;
      case 'Professionals & Consultants':
        return UserCheck;
      case 'NGOs & Trusts':
        return HeartHandshake;
      default:
        return Building2;
    }
  };

  const verifiedIndustries = [
    {
      id: 'manufacturing',
      title: 'Manufacturing & Industrial',
      statutorySubhead: 'CMA Unit-Cost & CARO 2020 Inventory Assurance',
      badge: 'Manufacturing & Heavy Industry',
      icon: Factory,
      description: 'Integrated statutory audit under Companies Act 2013 and Section 44AB. Specialized cost center accounting by qualified CMA (AIR 49), fixed asset registers, and physical stock reconciliations.',
      statutoryPills: [
        'CARO 2020 Inventory Verification',
        'CMA Unit-Cost & Margin Modeling',
        'Ind AS 2 Inventory Valuation',
        'Drawing Power (DP) Bank Audit'
      ]
    },
    {
      id: 'technology',
      title: 'Technology, IT/ITeS & Startups',
      statutorySubhead: 'DPIIT Recognition & Section 80-IAC Tax Exemption',
      badge: 'Technology & Startups',
      icon: Rocket,
      description: 'Comprehensive financial architecture for emerging ventures and software enterprises. Structuring cross-border zero-rated GST exports, founder equity, angel tax, and monthly investor MIS.',
      statutoryPills: [
        'Sec 80-IAC 3-Year Tax Holiday',
        'DPIIT Startup Recognition',
        'Cap Table & ESOP Structuring',
        'Export LUT & Virtual CFO'
      ]
    },
    {
      id: 'corporate',
      title: 'Corporate & Real Estate',
      statutorySubhead: 'RERA Form 3 Certifications & ROC Compliance',
      badge: 'Corporate & Real Estate',
      icon: Building2,
      description: 'Institutional compliance for corporate entities, builders, and developers. Form 3 CA escrow 70% certificates under AP/TN RERA, Joint Development Agreement tax planning, and annual MCA filings.',
      statutoryPills: [
        'RERA Form 3 Escrow 70% Audit',
        'Sec 45(5A) JDA Tax Planning',
        'Annual ROC (AOC-4 / MGT-7)',
        'Statutory Board Governance'
      ]
    }
  ];

  return (
    <section 
      id="industries-overview"
      className={`py-12 sm:py-16 lg:py-24 bg-[#FFFCF5] border-b border-[#E6C98F] relative overflow-hidden texture-warm-plaster scroll-mt-28 ${className}`.trim()} 
    >
      {/* Luminous Ambient Background Lighting */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-ambient-radial-gold pointer-events-none -z-0" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-ambient-radial-sage pointer-events-none -z-0" />

      {/* Subtle Dot Pattern Accent */}
      <div className="absolute top-12 right-12 pointer-events-none z-0 opacity-20 hidden lg:block">
        <AnimatedDotPattern rows={3} cols={4} variant="gold" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6 scroll-reveal">
          <div>
            <div className="flex items-center gap-2.5 mb-3 flex-wrap">
              <EditorialMarker number="05" label="SECTORS & INDUSTRIES" />
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFDF7] text-[#183D30] font-editorial-meta text-xs border border-[#E6C98F] shadow-xs">
                <span className="text-[#C9A66B] font-mono font-bold">//</span>
                <LetterReveal text="INDUSTRIES SERVED" as="span" className="tracking-widest uppercase font-semibold text-[#183D30]" />
              </div>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#183D30] tracking-tight">
              Sector Expertise &amp; Tailored Advisory
            </h2>
          </div>
          <div className="max-w-md">
            <p className="font-editorial-body text-xs sm:text-sm text-[#525954] leading-relaxed">
              Specialized statutory audit, cost management, and regulatory compliance frameworks engineered for the commercial and legal realities of India's key economic sectors.
            </p>
          </div>
        </div>

        {/* 3 Minimalist Architectural Industry Feature Cards (Photos Replaced with Icon-Led Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-14 scroll-stagger">
          {verifiedIndustries.map((ind) => {
            const IndIcon = ind.icon;
            return (
              <div 
                key={ind.id}
                className="rounded-2xl p-6 sm:p-7 border border-[#E6C98F] bg-[#FFFDF7] shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 group scroll-reveal flex flex-col justify-between relative card-v4-inner-border"
              >
                <CornerBrackets size={14} variant="gold" />
                <PrecisionDotMatrix rows={2} cols={3} variant="gold" className="absolute top-4 right-4 opacity-20 hidden sm:block" />

                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-[#153F32] flex items-center justify-center text-[#D4AF37] shadow-xs group-hover:scale-105 transition-transform duration-300">
                      <IndIcon className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#FFF6E8] text-[#183D30] border border-[#E6C98F]/60 text-[11px] font-semibold">
                      {ind.badge}
                    </span>
                  </div>

                  {/* Subhead & Title */}
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-[#C9A66B] flex items-center gap-1.5 mb-1.5">
                    <GeometricSymbol type="diamond" />
                    <span>{ind.statutorySubhead}</span>
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#183D30] mb-3 group-hover:text-[#102D25] transition-colors">
                    {ind.title}
                  </h3>
                  <p className="font-editorial-body text-xs sm:text-sm text-[#525954] leading-relaxed mb-5">
                    {ind.description}
                  </p>

                  {/* Statutory Focus Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#E6C98F]/40 mb-6">
                    {ind.statutoryPills.map((pill) => (
                      <span 
                        key={pill}
                        className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#FFF6E8] text-[#183D30] border border-[#E6C98F]/50"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer Link */}
                <div className="pt-2 border-t border-[#E6C98F]/20">
                  <Link
                    to="/industries"
                    className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-semibold text-[#183D30] hover:text-[#C9A66B] transition-colors"
                  >
                    <span>Explore Sector Advisory</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* 10 Industry Badges Strip (Preserving FIRM_DATA.industries.map invariant) */}
        <div className="bg-[#FFFDF7] rounded-2xl border border-[#E6C98F] p-6 sm:p-8 shadow-card mb-14 relative card-v4-inner-border">
          <CornerBrackets size={14} variant="gold" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-[#E6C98F]/40 gap-2">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#C9A66B] block">
                Multi-Sector Regulatory Versatility
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#183D30]">
                Commercial Sectors Under Active Compliance Coverage
              </h3>
            </div>
            <span className="text-xs text-[#525954]">
              10 Profiled Commercial Domains
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 scroll-stagger">
            {firm.industries.map((ind) => {
              const IconComp = getIndustryIcon(ind);
              return (
                <div
                  key={ind}
                  className="bg-[#FFFCF5] card-tactile rounded-xl p-3.5 sm:p-4 text-center border border-[#E6C98F]/60 shadow-subtle group hover:border-[#C9A66B] hover:shadow-card transition-all duration-200 scroll-reveal"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#FFF6E8] text-[#183D30] flex items-center justify-center mx-auto mb-2 border border-[#E6C98F]/40 group-hover:bg-[#FFFDF7] transition-colors">
                    <IconComp className="w-4 h-4 text-[#183D30]" />
                  </div>
                  <span className="font-editorial-meta text-xs font-semibold text-[#183D30] block leading-tight">
                    {ind}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Geographic Corridors Strip (Preserving FIRM_DATA.serviceFootprint.map invariant) */}
        <div className="pt-8 border-t border-[#E6C98F]/60">
          <div className="text-center max-w-2xl mx-auto mb-8 scroll-reveal">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#C9A66B] block mb-1">
              Regional Consultation Footprint
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#183D30]">
              Chambers in Tirupati, Client Coverage Across South India
            </h3>
            <p className="font-editorial-body text-xs text-[#525954] mt-1.5">
              Operating under Section 27 compliance with scheduled virtual and in-person advisory appointments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 scroll-stagger">
            {firm.serviceFootprint.map((loc) => (
              <div
                key={loc.city}
                className={`rounded-xl p-4 border text-center card-tactile flex flex-col justify-between scroll-reveal transition-all duration-200 ${
                  loc.type === 'Primary Chambers'
                    ? 'bg-[#FFFDF7] border-2 border-[#183D30] shadow-card'
                    : 'bg-[#FFFDF7] border-[#E6C98F]/80 shadow-subtle hover:border-[#C9A66B]'
                }`}
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-[#FFF6E8] text-[#183D30] flex items-center justify-center mx-auto mb-2.5 border border-[#E6C98F]/50">
                    <MapPin className="w-4 h-4 text-[#183D30]" />
                  </div>
                  <h4 className="font-serif text-base font-bold text-[#183D30]">{loc.city}</h4>
                  <span className="font-editorial-body text-xs text-[#525954] block mt-0.5">{loc.state}</span>
                  {loc.type === 'Primary Chambers' && (
                    <span className="font-editorial-meta text-[11px] text-[#183D30] font-semibold block mt-1">
                      Bairagi Patteda
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold ${
                      loc.type === 'Primary Chambers'
                        ? 'bg-[#183D30] text-[#FFFDF7]'
                        : 'bg-[#FFF6E8] text-[#183D30] border border-[#E6C98F]/60'
                    }`}
                  >
                    {loc.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default IndustriesSection;
