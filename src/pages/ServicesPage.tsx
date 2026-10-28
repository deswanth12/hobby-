import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { FIRM_DATA } from '../data/firmData';
import { SEOHead } from '../components/SEOHead';

export const ServicesPage: React.FC = () => {
  return (
    <div className="bg-brand-warm">
      <SEOHead
        title="Comprehensive Accounting, Audit & Tax Services"
        description="Explore the full spectrum of Chartered Accountancy services: Statutory Audit, Income Tax Return filing, GST compliance, ROC corporate secretarial, and RERA certifications."
        canonicalPath="/services"
      />
      {/* Header Banner */}
      <section className="bg-brand-surface py-14 sm:py-18 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block mb-2">
              Practice Areas
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-primary tracking-tight">
              Comprehensive Financial & Compliance Services
            </h1>
            <p className="mt-4 text-base sm:text-lg text-charcoal-muted leading-relaxed">
              End-to-end financial, tax, audit, and regulatory support designed to ensure total statutory compliance and support business expansion.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Audit & Assurance Spotlight Banner */}
      <section className="py-8 bg-brand-pale/70 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 sm:p-7 rounded-xl border border-border shadow-subtle">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-primary text-gold flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-gold-dark uppercase tracking-wider block">
                  Highlighted Practice
                </span>
                <h3 className="font-serif text-xl font-bold text-brand-primary mt-0.5">
                  Audit & Assurance Services
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-muted mt-1 max-w-xl">
                  Independent, thorough, and compliant statutory, internal, tax, and concurrent audits delivered with partner-level attention.
                </p>
              </div>
            </div>

            <Link
              to="/services/audit-assurance"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-primary text-white text-xs font-semibold hover:bg-brand-deep transition-colors shrink-0 shadow-sm"
            >
              <span>View Audit Spotlight</span>
              <ArrowRight className="w-4 h-4 text-gold" />
            </Link>
          </div>
        </div>
      </section>

      {/* All Service Categories Detailed */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {FIRM_DATA.serviceCategories.map((category, idx) => (
            <div
              key={category.id}
              id={category.id}
              className="scroll-mt-24 p-6 sm:p-8 lg:p-10 rounded-xl border border-border bg-white hover:border-emerald-300 shadow-subtle hover:shadow-card transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Overview */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-pale text-brand-primary text-xs font-semibold">
                    <span>Category 0{idx + 1}</span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary">
                    {category.title}
                  </h2>

                  <p className="text-sm text-charcoal-muted leading-relaxed">
                    {category.fullDescription}
                  </p>

                  <div className="pt-4">
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-brand-primary hover:text-brand-deep underline underline-offset-4"
                    >
                      <span>Enquire regarding {category.title}</span>
                      <ChevronRight className="w-4 h-4 text-gold-dark" />
                    </Link>
                  </div>
                </div>

                {/* Right Service Bullet List */}
                <div className="lg:col-span-7 bg-brand-surface rounded-xl p-6 border border-border">
                  <h3 className="font-serif text-xs font-bold text-brand-primary uppercase tracking-wider mb-4 border-b border-border pb-2">
                    Scope of Services Included:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {category.services.map((item) => (
                      <div key={item} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 shrink-0 mt-1.5" />
                        <span className="text-xs text-charcoal font-medium leading-relaxed">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand-surface border-t border-border text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary">
            Need Custom Accounting or Regulatory Structuring?
          </h2>
          <p className="mt-3 text-sm text-charcoal-muted">
            We provide tailored compliance calendars, virtual CFO retainers, and cross-border advisory.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-primary text-white text-sm font-semibold hover:bg-brand-deep shadow-sm transition-colors"
            >
              <span>Schedule a Discussion</span>
              <ArrowRight className="w-4 h-4 text-gold" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
