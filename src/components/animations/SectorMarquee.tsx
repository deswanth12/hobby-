import React from 'react';
import { 
  Rocket, 
  Building2, 
  Factory, 
  Home, 
  ShoppingCart, 
  Stethoscope, 
  GraduationCap, 
  Globe, 
  UserCheck, 
  HeartHandshake 
} from 'lucide-react';
import { useFirmData } from '../../context/FirmDataContext';

const getIndustryIcon = (name: string) => {
  switch (name) {
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

interface SectorMarqueeProps {
  className?: string;
}

export const SectorMarquee: React.FC<SectorMarqueeProps> = ({ className = '' }) => {
  const { data: FIRM_DATA } = useFirmData();
  const sectors = FIRM_DATA.industries;

  // Quadruple items to guarantee seamless infinite loop on ultra-wide screens
  const marqueeItems = [...sectors, ...sectors, ...sectors, ...sectors];

  return (
    <div
      className={`relative w-full overflow-hidden marquee-container py-4 ${className}`.trim()}
      aria-label="Verified Industry Sectors Marquee"
    >
      {/* Gradient Mask Overlays for Edge Fading */}
      <div className="relative w-full overflow-hidden marquee-mask">
        <div className="animate-marquee-track flex items-center gap-4 py-2">
          {marqueeItems.map((sector, index) => {
            const Icon = getIndustryIcon(sector);
            return (
              <div
                key={`${sector}-${index}`}
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-brand-surface/90 border border-brand-border hover:border-brand-gold/70 shadow-xs transition-colors duration-200 duration-300 hover:scale-[1.02] shrink-0 group cursor-default"
                aria-hidden={index >= sectors.length ? 'true' : undefined}
              >
                <span className="w-7 h-7 rounded-full bg-brand-pale text-brand-forest group-hover:bg-brand-forest group-hover:text-brand-gold flex items-center justify-center transition-colors shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <span className="font-editorial-meta text-xs font-semibold text-brand-forest tracking-wider uppercase whitespace-nowrap">
                  {sector}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/60 shrink-0" aria-hidden="true" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
