import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Target, 
  Eye, 
  ArrowRight, 
  Award, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Shield
} from 'lucide-react';
import { FIRM_DATA } from '../data/firmData';
import { SEOHead } from '../components/SEOHead';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-brand-warm page-reveal">
      <SEOHead
        title="About CA KavithaVijay SRJ & Practice Credentials"
        description="Learn about Kavitha & Associates, led by CA KavithaVijay SRJ (B.Com, FCA, CMA). Professional audit, direct taxation, GST, and corporate governance practice in Tirupati, AP."
        canonicalPath="/about"
      />

      {/* =========================================================================
          1. HEADER BANNER
          ========================================================================= */}
      <section className="bg-brand-surface py-14 sm:py-18 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-brand-pale text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-dark" />
              <span>Chartered & Cost Accountancy Practice</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-primary tracking-tight">
              About Kavitha & Associates
            </h1>
            <p className="mt-4 text-base sm:text-lg text-charcoal-muted leading-relaxed">
              Founded on the bedrock of statutory independence, partner-level accessibility, and comprehensive corporate governance expertise. Operating from Tirupati with regional coverage across southern economic corridors.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. SENIOR PARTNER PROFILE (NSKA Structural Rigor + Carvi Approachability)
          ========================================================================= */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Partner Credentials Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#0A2F24] rounded-xl p-8 text-white border border-emerald-900 shadow-card sticky top-24">
                <div className="flex items-center justify-between pb-6 border-b border-emerald-800/80 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-[#0F3E2E] border border-gold/40 flex items-center justify-center font-serif text-2xl font-bold text-gold">
                    CA
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gold bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
                    Senior Partner
                  </span>
                </div>

                <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold block">
                  {FIRM_DATA.partner.designation}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                  {FIRM_DATA.partner.name}
                </h2>
                <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#0F3E2E] border border-gold/30">
                  <span className="text-xs font-bold text-gold">{FIRM_DATA.partner.qualifications}</span>
                  <span className="text-[11px] text-emerald-200">Dual Credentials</span>
                </div>

                {/* Statutory Memberships */}
                <div className="mt-6 pt-6 border-t border-emerald-800/80 space-y-3 text-xs text-emerald-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold block">
                    Statutory Body Memberships
                  </span>
                  {FIRM_DATA.partner.memberships.map((membership) => (
                    <div key={membership} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{membership}</span>
                    </div>
                  ))}
                </div>

                {/* Location & Practice Desk */}
                <div className="mt-6 pt-5 border-t border-emerald-800/80 text-xs text-emerald-200 space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <span>Chambers: Bairagi Patteda, Tirupati – 517501</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gold shrink-0" />
                    <a href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`} className="hover:text-white transition-colors">
                      {FIRM_DATA.contact.primaryPhone}
                    </a>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-emerald-800/60">
                  <a
                    href={FIRM_DATA.contact.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors btn-tactile"
                  >
                    <span>Connect on WhatsApp</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gold" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Detailed Firm Background & Competencies */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block mb-2">
                  Firm Profile & Technical Orientation
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-brand-primary leading-tight">
                  Bridging Statutory Compliance with Practical Fiscal Strategy
                </h2>
                <div className="mt-4 space-y-4 text-sm sm:text-base text-charcoal-muted leading-relaxed">
                  <p>
                    <strong className="text-brand-primary font-semibold">Kavitha & Associates</strong> is an independent Chartered Accountancy practice founded by <strong className="text-brand-primary font-semibold">CA KavithaVijay SRJ</strong>. We provide end-to-end audit, direct taxation, indirect taxation (GST), corporate secretarial governance, and project advisory services to corporate bodies, MSMEs, entrepreneurs, and institutions across India.
                  </p>
                  <p>
                    Rooted in the commercial heart of Tirupati, Andhra Pradesh, the firm distinguishes itself through <strong className="text-brand-primary font-semibold">partner-supervised execution</strong>. Unlike larger multi-tier consultancies where client files are delegated to junior staff, every critical engagement at Kavitha & Associates receives the direct analytical oversight of a dual-qualified professional.
                  </p>
                </div>
              </div>

              {/* Core Competencies Grid */}
              <div className="bg-white rounded-xl p-6 sm:p-7 border border-border shadow-card">
                <span className="text-xs font-bold uppercase tracking-wider text-gold-dark block mb-4">
                  Partner Core Competencies
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {FIRM_DATA.partner.coreCompetencies.map((comp) => (
                    <div key={comp} className="flex items-start gap-2.5 p-2 rounded-lg bg-brand-surface/60 border border-border/50">
                      <span className="w-2 h-2 rounded-full bg-emerald-700 shrink-0 mt-1.5" />
                      <span className="text-xs font-semibold text-brand-primary leading-snug">
                        {comp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dual Qualification Strategic Advantage */}
              <div className="bg-brand-pale rounded-xl p-6 sm:p-7 border border-emerald-200/90 shadow-subtle">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <Award className="w-5 h-5 text-emerald-800 shrink-0" />
                  <h3 className="font-serif text-xl font-bold text-brand-primary">
                    The Dual FCA + CMA Strategic Advantage
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed mb-5">
                  Holding qualifications in both Chartered Accountancy (FCA) and Cost & Management Accountancy (CMA) provides a distinct dual capability: external statutory assurance and tax defense coupled with internal financial modeling, unit-cost analysis, and working capital optimization.
                </p>

                {/* Comparison Matrix Table */}
                <div className="overflow-x-auto rounded-lg border border-emerald-200/80 bg-white">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-brand-surface border-b border-emerald-200/80">
                        <th className="py-2.5 px-3.5 font-bold uppercase tracking-wider text-charcoal-muted text-[10px]">
                          Practice Dimension
                        </th>
                        <th className="py-2.5 px-3.5 font-bold uppercase tracking-wider text-charcoal-light text-[10px]">
                          Traditional Tax-Only Filing
                        </th>
                        <th className="py-2.5 px-3.5 font-bold uppercase tracking-wider text-emerald-800 text-[10px] bg-emerald-50/60">
                          Kavitha & Associates (FCA + CMA)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-100 text-charcoal">
                      <tr>
                        <td className="py-2.5 px-3.5 font-semibold text-brand-primary text-[11px]">Assurance Rigor</td>
                        <td className="py-2.5 px-3.5 text-charcoal-muted text-[11px]">Routine compilation</td>
                        <td className="py-2.5 px-3.5 font-medium text-emerald-950 bg-emerald-50/30 text-[11px]">Evidence-based ICAI SAs & IFC testing</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3.5 font-semibold text-brand-primary text-[11px]">Cost & Working Capital</td>
                        <td className="py-2.5 px-3.5 text-charcoal-muted text-[11px]">Not addressed</td>
                        <td className="py-2.5 px-3.5 font-medium text-emerald-950 bg-emerald-50/30 text-[11px]">Unit-cost modeling & margin leakage review (CMA)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3.5 font-semibold text-brand-primary text-[11px]">Tax & Scrutiny</td>
                        <td className="py-2.5 px-3.5 text-charcoal-muted text-[11px]">Reactive post-facto filing</td>
                        <td className="py-2.5 px-3.5 font-medium text-emerald-950 bg-emerald-50/30 text-[11px]">Proactive advance tax & ITC reconciliation</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3.5 font-semibold text-brand-primary text-[11px]">Partner Supervision</td>
                        <td className="py-2.5 px-3.5 text-charcoal-muted text-[11px]">Junior staff delegation</td>
                        <td className="py-2.5 px-3.5 font-medium text-emerald-950 bg-emerald-50/30 text-[11px]">Direct partner review by CA KavithaVijay SRJ</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Trust Creed */}
              <div className="p-4 rounded-xl bg-white border border-border flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-800 shrink-0" />
                  <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                    Trust • Expertise • Your Growth Partner
                  </span>
                </div>
                <span className="text-xs text-charcoal-muted hidden sm:inline">
                  Client Business Card Creed
                </span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          3. PRACTICE PHILOSOPHY & GOVERNANCE (NSKA Model)
          ========================================================================= */}
      <section className="py-16 sm:py-20 bg-brand-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block mb-2">
              Our Professional Foundation
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-primary tracking-tight">
              Governance, Independence & Ethics
            </h2>
            <p className="text-base text-charcoal-muted mt-3">
              {FIRM_DATA.philosophy.statement}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FIRM_DATA.philosophy.corePrinciples.map((principle, index) => (
              <div
                key={principle.title}
                className="bg-white rounded-xl p-6 sm:p-7 border border-border shadow-card flex items-start gap-4 card-tactile"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-pale text-brand-primary flex items-center justify-center font-serif font-bold text-sm shrink-0 border border-emerald-200 text-gold-dark">
                  0{index + 1}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-brand-primary mb-1.5">
                    {principle.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ICAI Code of Ethics Guarantee */}
          <div className="mt-8 bg-[#0A2F24] text-white rounded-xl p-6 sm:p-7 border border-emerald-900 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#0F3E2E] text-gold flex items-center justify-center shrink-0 border border-gold/40">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-white mb-1">
                  Commitment to ICAI Code of Ethics
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
                  In accordance with the Chartered Accountants Act, 1949 and ICAI regulations, this website operates strictly under the informational 'pull' model. We do not solicit work, advertise professional fees, or publish client testimonials.
                </p>
              </div>
            </div>
            <Link
              to="/contact"
              className="px-5 py-2.5 rounded-lg bg-gold-dark hover:bg-gold text-white text-xs font-bold uppercase tracking-wider shrink-0 transition-colors btn-tactile"
            >
              Consult the Practice
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. VISION & MISSION
          ========================================================================= */}
      <section className="py-16 sm:py-20 bg-brand-warm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl border border-border shadow-subtle space-y-4 card-tactile">
              <div className="w-12 h-12 rounded-lg bg-brand-pale text-brand-primary flex items-center justify-center border border-emerald-100">
                <Target className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-brand-primary">Our Professional Mission</h3>
              <p className="text-sm text-charcoal-muted leading-relaxed">
                To deliver uncompromising audit quality, strategic tax advisory, and transparent compliance guidance that empowers enterprises to operate with regulatory confidence and sustainable fiscal discipline.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-border shadow-subtle space-y-4 card-tactile">
              <div className="w-12 h-12 rounded-lg bg-brand-pale text-brand-primary flex items-center justify-center border border-emerald-100">
                <Eye className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-brand-primary">Our Operating Vision</h3>
              <p className="text-sm text-charcoal-muted leading-relaxed">
                To stand as the most dependable and accessible growth partner for emerging businesses, established corporations, and builders across India, driven by continuous learning and ethical practice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. APPROACHABLE CONSULTATION CTA (Carvi Desk)
          ========================================================================= */}
      <section className="py-16 text-center bg-brand-surface border-t border-border">
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block mb-2">
            In-Person & Remote Practice
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary">
            Schedule a Direct Professional Consultation
          </h2>
          <p className="mt-3 text-sm text-charcoal-muted leading-relaxed">
            Visit our chambers at Bairagi Patteda, Tirupati, or schedule a remote video/telephonic review of your compliance requirements.
          </p>
          <div className="mt-8 flex justify-center items-center gap-4 flex-wrap">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-primary text-white text-sm font-semibold hover:bg-brand-deep shadow-sm transition-colors btn-tactile"
            >
              <span>Contact the Practice</span>
              <ArrowRight className="w-4 h-4 text-gold" />
            </Link>
            <a
              href={FIRM_DATA.contact.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-white text-brand-primary text-sm font-semibold hover:bg-brand-pale shadow-subtle transition-colors btn-tactile"
            >
              <MapPin className="w-4 h-4 text-emerald-800" />
              <span>Directions to Chambers</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
