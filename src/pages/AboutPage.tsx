import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Target, Eye, ArrowRight, CheckCircle2 } from 'lucide-react';
import { FIRM_DATA } from '../data/firmData';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-brand-warm">
      {/* Header Banner */}
      <section className="bg-brand-surface py-14 sm:py-18 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block mb-2">
              About Kavitha & Associates
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-primary tracking-tight">
              A Professionally Operated Chartered Accountancy Practice
            </h1>
            <p className="mt-4 text-base sm:text-lg text-charcoal-muted leading-relaxed">
              Founded on the bedrock of statutory integrity, partner-level accessibility, and comprehensive corporate governance expertise.
            </p>
          </div>
        </div>
      </section>

      {/* Main Profile & Leadership */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5">
              <div className="bg-[#0F3E2E] bg-gradient-to-br from-[#0F3E2E] to-[#0A2F24] rounded-xl p-8 text-white border border-gold/40 shadow-card relative overflow-hidden">
                <div className="w-14 h-14 rounded-xl bg-white/10 border border-gold/40 flex items-center justify-center font-serif text-2xl font-bold text-gold mb-6">
                  CA
                </div>
                <span className="text-xs uppercase tracking-wider text-gold font-semibold block">
                  Practicing Chartered Accountant
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                  {FIRM_DATA.partner.name}
                </h2>
                <p className="text-sm text-emerald-200 mt-1 font-medium">
                  {FIRM_DATA.partner.qualifications}
                </p>

                <div className="mt-6 pt-6 border-t border-emerald-800/80 space-y-3 text-xs text-emerald-100">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                    <span>Member of Institute of Chartered Accountants of India (ICAI)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                    <span>Cost and Management Accountant (CMA) Credentials</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                    <span>Principal Operating Practice: Tirupati, Andhra Pradesh</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-emerald-800/60 text-xs text-emerald-200/90 leading-relaxed">
                  Direct engagement on complex audits, scrutiny assessments, and corporate structuring.
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block">
                Firm Background & Philosophy
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary leading-snug">
                Delivering Dependable, Compliant, and Growth-Oriented Advisory
              </h2>
              
              <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed">
                Kavitha & Associates is a professionally operated Chartered Accountancy firm providing a wide spectrum of services including financial, taxation, audit, and regulatory support to businesses, startups, corporations, and individuals throughout India.
              </p>

              <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed">
                Rooted in deep technical expertise and corporate understanding, the firm prioritizes prompt compliance, thorough reporting, and risk mitigation. We combine institutional rigor with personal accountability, ensuring founders, CFOs, and business owners have direct access to experienced counsel.
              </p>

              {/* Tagline Box */}
              <div className="bg-brand-pale rounded-xl p-5 border border-emerald-200/80 flex items-center gap-4">
                <ShieldCheck className="w-8 h-8 text-brand-primary shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-gold-dark uppercase tracking-wider block">
                    Core Firm Creed
                  </span>
                  <p className="font-serif text-lg font-bold text-brand-primary">
                    Trust • Expertise • Your Growth Partner
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Vision & Mission / Commitment */}
      <section className="py-16 bg-brand-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl border border-border shadow-subtle space-y-3">
              <div className="w-12 h-12 rounded-lg bg-brand-pale text-brand-primary flex items-center justify-center">
                <Target className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="font-serif text-xl font-bold text-brand-primary">Our Professional Mission</h3>
              <p className="text-sm text-charcoal-muted leading-relaxed">
                To deliver uncompromising audit quality, strategic tax advisory, and transparent compliance guidance that empowers enterprises to operate with regulatory confidence and sustainable fiscal discipline.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-border shadow-subtle space-y-3">
              <div className="w-12 h-12 rounded-lg bg-brand-pale text-brand-primary flex items-center justify-center">
                <Eye className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="font-serif text-xl font-bold text-brand-primary">Our Operating Vision</h3>
              <p className="text-sm text-charcoal-muted leading-relaxed">
                To stand as the most dependable and accessible growth partner for emerging businesses, established corporations, and builders across India, driven by continuous learning and ethical practice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-16 text-center bg-brand-warm">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary">
            Explore How We Can Support Your Compliance Needs
          </h2>
          <p className="mt-3 text-sm text-charcoal-muted">
            Connect directly with CA KavithaVijay SRJ to discuss audit, direct taxation, GST, or corporate advisory.
          </p>
          <div className="mt-8 flex justify-center items-center gap-4 flex-wrap">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 pl-6 pr-2 py-2 rounded-full bg-brand-primary text-white text-sm font-semibold hover:bg-brand-deep shadow-card hover:shadow-card-hover transition-all active:scale-[0.985]"
            >
              <span>Contact the Practice</span>
              <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-gold group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-white text-brand-primary text-sm font-semibold hover:bg-brand-pale shadow-subtle transition-all active:scale-[0.985]"
            >
              <span>View Services</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
