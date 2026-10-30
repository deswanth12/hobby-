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
  Shield,
  Briefcase,
  GraduationCap,
  Globe2,
  Trophy,
  Languages,
  Sparkles,
  Building2,
  FileCheck2
} from 'lucide-react';
import { FIRM_DATA } from '../data/firmData';
import { SEOHead } from '../components/SEOHead';

export const AboutPage: React.FC = () => {
  const { partner } = FIRM_DATA;

  return (
    <div className="bg-brand-warm page-reveal">
      <SEOHead
        title="About CA Kavitha Vijay | Big 4 & MNC Auditor | Kavitha & Associates"
        description="Profile of CA Kavitha Vijay (ICAI 252985, B.Com, CA, CMA AIR 49). 10+ years across Deloitte Big 4 audit, Ford Motor Company internal audit, and independent practice in Tirupati."
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
              <span>Chartered & Cost Accountancy Practice • ICAI Mem. 252985</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-primary tracking-tight">
              About CA Kavitha Vijay & Practice
            </h1>
            <p className="mt-4 text-base sm:text-lg text-charcoal-muted leading-relaxed">
              MNC Auditor with Big 4 Experience of 10+ Years spanning Deloitte, Ford Motor Company, and public practice. Bringing global audit rigor, ₹1,000 Cr IPO experience, and enterprise risk governance directly to emerging businesses and corporations in Tirupati and pan-India.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. PARTNER PROFILE & INSTITUTIONAL PEDIGREE
          ========================================================================= */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Partner Credentials Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#0A2F24] rounded-2xl p-7 sm:p-8 text-white border border-emerald-900 shadow-xl sticky top-24">
                <div className="flex items-center justify-between pb-6 border-b border-emerald-800/80 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-[#0F3E2E] border border-gold/40 flex items-center justify-center font-serif text-2xl font-bold text-gold shadow-inner">
                    CA
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800 block">
                      ICAI Mem. {partner.membershipNumber}
                    </span>
                    <span className="text-[10px] text-emerald-300 mt-1 block">AIR 49 CMA Inter</span>
                  </div>
                </div>

                <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold block">
                  {partner.designation}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                  {partner.name}
                </h2>
                <p className="text-xs text-gold-light mt-1 font-medium">
                  {partner.tagline}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0F3E2E] border border-gold/30 text-xs font-bold text-gold">
                    <Award className="w-3.5 h-3.5" />
                    <span>{partner.qualifications}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800 text-[11px] text-emerald-200">
                    <Globe2 className="w-3 h-3 text-gold" />
                    <span>International Exposure</span>
                  </span>
                </div>

                {/* Specialization / Mentorship Badge */}
                <div className="mt-5 p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/70 text-xs text-emerald-100">
                  <div className="flex items-center gap-2 text-gold font-semibold text-[11px] uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Focus Domains</span>
                  </div>
                  <p className="leading-relaxed text-[11px] text-emerald-200">
                    Audit & Assurance • Enterprise Risk Management • Career Mentorship & Financial Literacy for B2C and B2B
                  </p>
                </div>

                {/* Statutory Memberships */}
                <div className="mt-5 pt-5 border-t border-emerald-800/80 space-y-2.5 text-xs text-emerald-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold block">
                    Statutory Qualifications
                  </span>
                  {partner.education.map((edu) => (
                    <div key={edu.degree} className="flex items-start gap-2.5">
                      <GraduationCap className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-white">{edu.degree} ({edu.year})</div>
                        <div className="text-[11px] text-emerald-300">
                          {edu.institution} {edu.distinction && `• ${edu.distinction}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Languages & Traits */}
                <div className="mt-5 pt-5 border-t border-emerald-800/80 text-xs text-emerald-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-gold shrink-0" />
                    <span><strong>Languages:</strong> {partner.languages.join(' • ')}</span>
                  </div>
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

                {/* Action CTA */}
                <div className="mt-6 pt-4 border-t border-emerald-800/60">
                  <a
                    href={FIRM_DATA.contact.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors btn-tactile shadow-md"
                  >
                    <span>Consult CA Kavitha Vijay on WhatsApp</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gold" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Detailed Journey, Honors, Experience & Competencies */}
            <div className="lg:col-span-7 space-y-10">
              
              {/* Professional Summary */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block mb-2">
                  Professional Profile & Leadership
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-brand-primary leading-tight">
                  Global Audit Rigor Combined with Independent Practice
                </h2>
                <div className="mt-4 space-y-4 text-sm sm:text-base text-charcoal-muted leading-relaxed">
                  <p>
                    {partner.summary}
                  </p>
                  <p>
                    Operating from Tirupati, Andhra Pradesh, <strong className="text-brand-primary font-semibold">Kavitha & Associates</strong> offers companies and growing ventures direct access to senior Big 4-trained audit and advisory expertise. Every audit file, tax defense memo, and internal controls engagement is directly led and signed by <strong className="text-brand-primary font-semibold">CA Kavitha Vijay</strong>.
                  </p>
                </div>
              </div>

              {/* Honors & Key Achievements */}
              <div className="bg-brand-surface rounded-2xl p-6 sm:p-7 border border-border shadow-card">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-5 h-5 text-gold-dark" />
                  <h3 className="font-serif text-xl font-bold text-brand-primary">
                    Key Achievements & Professional Honors
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {partner.awards.map((award) => (
                    <div key={award.title} className="p-4 rounded-xl bg-white border border-border/80 shadow-subtle flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dark block mb-1">
                          {award.category}
                        </span>
                        <h4 className="font-serif text-base font-bold text-brand-primary">
                          {award.title}
                        </h4>
                      </div>
                      <p className="text-xs text-charcoal-muted mt-2 pt-2 border-t border-border/60">
                        {award.organization}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Professional Experience & Career Journey */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-800" />
                  <h3 className="font-serif text-2xl font-bold text-brand-primary">
                    Institutional Career Experience
                  </h3>
                </div>

                <div className="space-y-5">
                  {partner.careerJourney.map((job) => (
                    <div key={job.organization} className="bg-white rounded-xl p-6 sm:p-7 border border-border shadow-card">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border/70 mb-4 gap-1">
                        <div>
                          <h4 className="font-serif text-lg sm:text-xl font-bold text-brand-primary">
                            {job.role}
                          </h4>
                          <span className="text-sm font-semibold text-emerald-800 flex items-center gap-1.5 mt-0.5">
                            <Building2 className="w-4 h-4 text-gold-dark shrink-0" />
                            {job.organization}
                          </span>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="text-xs font-bold text-charcoal-muted bg-brand-surface px-2.5 py-1 rounded border border-border inline-block">
                            {job.period}
                          </span>
                          <span className="text-[11px] text-charcoal-muted block mt-1">
                            {job.location}
                          </span>
                        </div>
                      </div>

                      <ul className="space-y-2 text-xs sm:text-sm text-charcoal-muted">
                        {job.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{h}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Key Engagements Pill Cloud if present */}
                      {job.keyEngagements && (
                        <div className="mt-5 pt-4 border-t border-border/70">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-gold-dark block mb-2.5">
                            Key Audit & International Engagements
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {job.keyEngagements.map((eng) => (
                              <span 
                                key={eng} 
                                className="px-2.5 py-1 rounded-md bg-brand-surface text-brand-primary text-[11px] font-medium border border-border/80"
                              >
                                {eng}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Competencies Grid */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-border shadow-card">
                <div className="flex items-center gap-2 mb-4">
                  <FileCheck2 className="w-5 h-5 text-emerald-800" />
                  <h3 className="font-serif text-xl font-bold text-brand-primary">
                    Core Technical Competencies
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {partner.coreCompetencies.map((comp) => (
                    <div key={comp} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-brand-surface/70 border border-border/60">
                      <span className="w-2 h-2 rounded-full bg-emerald-700 shrink-0 mt-1.5" />
                      <span className="text-xs font-semibold text-brand-primary leading-snug">
                        {comp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Traits Grid */}
              <div className="bg-brand-surface rounded-xl p-5 border border-border">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gold-dark block mb-3">
                  Professional Traits & Working Style
                </span>
                <div className="flex flex-wrap gap-2">
                  {partner.traits.map((trait) => (
                    <span 
                      key={trait}
                      className="px-3 py-1 rounded-full bg-white text-brand-primary text-xs font-semibold border border-border shadow-subtle"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dual Qualification Strategic Advantage Matrix */}
              <div className="bg-brand-pale rounded-2xl p-6 sm:p-7 border border-emerald-200/90 shadow-subtle">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <Award className="w-5 h-5 text-emerald-800 shrink-0" />
                  <h3 className="font-serif text-xl font-bold text-brand-primary">
                    The Dual CA + CMA Strategic Advantage
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed mb-5">
                  Holding qualifications in both Chartered Accountancy (ICAI Mem. 252985) and Cost & Management Accountancy (AIR 49) provides a rare dual capability: external statutory assurance and direct tax defense coupled with internal financial controls (ICFR), unit-cost modeling, and operational risk mitigation.
                </p>

                {/* Comparison Matrix Table */}
                <div className="overflow-x-auto rounded-lg border border-emerald-200/80 bg-white shadow-sm">
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
                          Kavitha & Associates (CA + CMA)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-100 text-charcoal">
                      <tr>
                        <td className="py-2.5 px-3.5 font-semibold text-brand-primary text-[11px]">Assurance Rigor</td>
                        <td className="py-2.5 px-3.5 text-charcoal-muted text-[11px]">Routine compilation</td>
                        <td className="py-2.5 px-3.5 font-medium text-emerald-950 bg-emerald-50/30 text-[11px]">Big 4 & ICAI SAs methodology with ICFR testing</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3.5 font-semibold text-brand-primary text-[11px]">Cost & Working Capital</td>
                        <td className="py-2.5 px-3.5 text-charcoal-muted text-[11px]">Not addressed</td>
                        <td className="py-2.5 px-3.5 font-medium text-emerald-950 bg-emerald-50/30 text-[11px]">Unit-cost modeling & margin leakage review (CMA AIR 49)</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3.5 font-semibold text-brand-primary text-[11px]">Tax & Scrutiny</td>
                        <td className="py-2.5 px-3.5 text-charcoal-muted text-[11px]">Reactive post-facto filing</td>
                        <td className="py-2.5 px-3.5 font-medium text-emerald-950 bg-emerald-50/30 text-[11px]">Proactive advance tax, transfer pricing & ITC reconciliation</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3.5 font-semibold text-brand-primary text-[11px]">Partner Supervision</td>
                        <td className="py-2.5 px-3.5 text-charcoal-muted text-[11px]">Junior staff delegation</td>
                        <td className="py-2.5 px-3.5 font-medium text-emerald-950 bg-emerald-50/30 text-[11px]">Direct partner leadership by CA Kavitha Vijay</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          3. PRACTICE PHILOSOPHY & GOVERNANCE
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
          5. APPROACHABLE CONSULTATION CTA
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
            Visit our chambers at Bairagi Patteda, Tirupati, or schedule a remote video/telephonic review of your compliance requirements with CA Kavitha Vijay.
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
