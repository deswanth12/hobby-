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
  ArrowRight
} from 'lucide-react';
import { SEOHead } from '../components/SEOHead';

export const IndustriesPage: React.FC = () => {
  const industryProfiles = [
    {
      name: "Startups & Emerging Ventures",
      icon: Rocket,
      focus: "Entity incorporation (Pvt Ltd / LLP), DPIIT recognition, 80-IAC tax exemptions, cap table advisory, angel tax compliance, and investor due diligence readiness."
    },
    {
      name: "MSMEs & Family Businesses",
      icon: Building2,
      focus: "Udyam registration, priority sector lending documentation, statutory turnover audits, internal financial controls, and working capital optimization."
    },
    {
      name: "Manufacturing & Industrial",
      icon: Factory,
      focus: "Cost accounting, inventory and stock audits, Input Tax Credit (ITC) optimization, excise/customs reconciliations, and capital asset depreciation schedules."
    },
    {
      name: "Real Estate & Infrastructure",
      icon: Home,
      focus: "RERA registration, quarterly project compliance, CA certificates for fund utilization and project completion, Joint Development Agreement (JDA) tax structuring."
    },
    {
      name: "Retail & Distribution",
      icon: ShoppingCart,
      focus: "Multi-branch GST reconciliation, point-of-sale inventory accounting, supply chain tax structuring, and periodic stock verification."
    },
    {
      name: "Healthcare & Pharmaceuticals",
      icon: Stethoscope,
      focus: "Hospital accounting, doctor TDS compliance under Section 194J, pharmaceutical stock audits, and trust taxation for charitable healthcare institutions."
    },
    {
      name: "Education & Academic Institutions",
      icon: GraduationCap,
      focus: "Section 12AB and 80G registrations for educational trusts, FCRA compliance, fee accounting, and statutory annual audit filings."
    },
    {
      name: "E-Commerce & Digital Commerce",
      icon: Globe,
      focus: "TCS compliance under GST Section 52, multi-state GST registrations, payment gateway reconciliations, and international payment tax withholding."
    },
    {
      name: "Professionals & Consultants",
      icon: UserCheck,
      focus: "Presumptive taxation under Section 44ADA for doctors, software architects, lawyers, and creative consultants; advance tax planning and wealth management."
    },
    {
      name: "NGOs, Societies & Public Trusts",
      icon: HeartHandshake,
      focus: "Trust incorporation, Form 10A / 10AB re-registrations, CSR fund audit certification, and strict foreign contribution reporting compliance."
    }
  ];

  return (
    <div className="bg-brand-warm page-reveal">
      <SEOHead
        title="Industry Expertise | Startups, MSMEs, Manufacturing, Healthcare"
        description="Sector-specific Chartered Accountancy expertise across 10 commercial sectors: Startups, MSMEs, Manufacturing, Real Estate, Retail, Healthcare, Education, and NGOs."
        canonicalPath="/industries"
      />
      {/* Header Banner */}
      <section className="bg-brand-surface py-14 sm:py-18 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block mb-2">
              Industry Domains
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-primary tracking-tight">
              Sector-Specific Financial & Regulatory Expertise
            </h1>
            <p className="mt-4 text-base sm:text-lg text-charcoal-muted leading-relaxed">
              Every industry faces unique statutory guidelines, accounting standards, and tax implications. We bring focused advisory suited to your business model.
            </p>
          </div>
        </div>
      </section>

      {/* Industry Cards Grid */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {industryProfiles.map((ind) => {
              const IconComponent = ind.icon;
              return (
                <div
                  key={ind.name}
                  className="bg-white rounded-xl p-6 sm:p-7 border border-border shadow-subtle card-tactile flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className="w-11 h-11 rounded-lg bg-brand-pale text-brand-primary flex items-center justify-center shrink-0 border border-emerald-200">
                        <IconComponent className="w-5 h-5 text-brand-primary" />
                      </div>
                      <h3 className="font-serif text-lg font-bold text-brand-primary">
                        {ind.name}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                      {ind.focus}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-xs text-emerald-800 font-medium">
                      Sector-Specific Scope
                    </span>
                    <Link
                      to="/contact"
                      className="text-xs font-semibold text-brand-primary hover:text-brand-deep underline underline-offset-2"
                    >
                      Consult Practice →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-brand-surface border-t border-border text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary">
            Operating in a Specialized Niche?
          </h2>
          <p className="mt-3 text-sm text-charcoal-muted">
            We adapt auditing programs and compliance calendars to match your unique operational risks and statutory framework.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-primary text-white text-sm font-semibold hover:bg-brand-deep shadow-sm transition-colors btn-tactile"
            >
              <span>Connect with Our Practice</span>
              <ArrowRight className="w-4 h-4 text-gold" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
