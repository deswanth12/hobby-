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
  FileCheck2,
  Scale
} from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';
import { FIRM_DATA } from '../data/firmData';
import { SEOHead } from '../components/SEOHead';

export const AboutPage: React.FC = () => {
  const { data } = useFirmData();
  const firm = data || FIRM_DATA;
  const { partner } = firm;

  return (
    <div className="bg-brand-ivory page-reveal text-brand-charcoal min-h-screen">
      <SEOHead
        title="About CA Kavitha Vijay | Big 4 & MNC Auditor | Kavitha & Associates"
        description="Profile of CA Kavitha Vijay (ICAI 252985, B.Com, CA, CMA AIR 49). 10+ years across Deloitte Big 4 audit, Ford Motor Company internal audit, and independent practice in Tirupati."
        canonicalPath="/about"
      />

      {/* =========================================================================
          1. HEADER BANNER
          ========================================================================= */}
      <section className="bg-brand-surface py-20 sm:py-24 lg:py-28 border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-forest/10 text-brand-forest font-editorial-meta mb-4 border border-brand-forest/20">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-gold shrink-0" />
              <span>Chartered & Cost Accountancy Practice • ICAI Mem. 252985</span>
            </div>
            <h1 className="font-editorial-h1 text-brand-forest tracking-tight">
              Institutional Rigor. Independent Counsel.
            </h1>
            <p className="mt-4 font-editorial-body text-brand-muted leading-relaxed">
              MNC Auditor with Big 4 Experience of 10+ Years spanning Deloitte, Ford Motor Company, and public practice. Bringing global audit rigor, ₹1,000 Cr IPO experience, and enterprise risk governance directly to emerging businesses, institutions, and corporations in Tirupati and pan-India.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. PARTNER PROFILE & INSTITUTIONAL PEDIGREE (ASYMMETRIC 5:7 SPLIT)
          ========================================================================= */}
      <section className="py-20 sm:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
            
            {/* Left 5 Cols: Sticky Double-Bezel Plaque */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="double-bezel-dark animate-fade-up">
                <div className="double-bezel-inner-dark bg-brand-deep rounded-2xl p-7 sm:p-8 text-white border border-white/10 shadow-editorial-lg">
                  <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-brand-forest border border-brand-gold/40 flex items-center justify-center font-serif text-2xl font-bold text-brand-gold shadow-inner">
                      KA
                    </div>
                    <div className="text-right">
                      <span className="font-editorial-meta text-brand-gold bg-black/40 px-3 py-1 rounded-full border border-brand-gold/30 block">
                        ICAI Mem. {partner.membershipNumber}
                      </span>
                      <span className="font-editorial-meta text-emerald-300 mt-1.5 block normal-case">
                        AIR 49 CMA Inter
                      </span>
                    </div>
                  </div>

                  <span className="font-editorial-meta text-brand-gold tracking-widest block">
                    {partner.designation}
                  </span>
                  <h2 className="font-editorial-h2 text-white mt-1.5">
                    {partner.name}
                  </h2>
                  <p className="font-editorial-body text-xs text-brand-gold mt-1 font-medium">
                    {partner.tagline}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-forest border border-brand-gold/40 text-xs font-semibold text-brand-gold">
                      <Award className="w-3.5 h-3.5 shrink-0" />
                      <span>{partner.qualifications}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/30 border border-white/10 text-xs text-emerald-200">
                      <Globe2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>International Exposure</span>
                    </span>
                  </div>

                  {/* Focus Domains */}
                  <div className="mt-6 p-4 rounded-xl bg-brand-forest/60 border border-brand-forest text-xs text-emerald-100">
                    <div className="flex items-center gap-2 text-brand-gold font-editorial-meta mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span>Focus Domains</span>
                    </div>
                    <p className="font-editorial-body text-xs text-emerald-100/90 leading-relaxed">
                      Audit & Assurance • Enterprise Risk Management • Career Mentorship & Financial Literacy for B2C and B2B
                    </p>
                  </div>

                  {/* Statutory Qualifications */}
                  <div className="mt-6 pt-6 border-t border-white/10 space-y-3 text-xs text-emerald-100">
                    <span className="font-editorial-meta text-brand-gold block">
                      Statutory Qualifications
                    </span>
                    {partner.education.map((edu) => (
                      <div key={edu.degree} className="flex items-start gap-2.5">
                        <GraduationCap className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-white text-xs">{edu.degree} ({edu.year})</div>
                          <div className="text-[11px] text-emerald-300/90 font-editorial-body">
                            {edu.institution} {edu.distinction && `• ${edu.distinction}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Languages & Chambers Info */}
                  <div className="mt-6 pt-6 border-t border-white/10 space-y-2.5 text-xs text-emerald-200">
                    <div className="flex items-center gap-2">
                      <Languages className="w-4 h-4 text-brand-gold shrink-0" />
                      <span><strong>Languages:</strong> {partner.languages.join(' • ')}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                      <span>Chambers: Bairagi Patteda, Tirupati – 517501</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                      <a href={`tel:${firm.contact.primaryPhoneClean}`} className="min-h-[44px] inline-flex items-center hover:text-white transition-colors">
                        {firm.contact.primaryPhone}
                      </a>
                    </div>
                  </div>

                  {/* Action CTA */}
                  <div className="mt-6 pt-5 border-t border-white/10">
                    <a
                      href={firm.contact.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full min-h-[44px] inline-flex items-center justify-between px-5 py-3 rounded-full bg-brand-forest hover:bg-brand-forest/80 text-white font-editorial-meta text-xs transition-all group btn-tactile shadow-md border border-brand-gold/40"
                    >
                      <span>Consult CA Kavitha Vijay</span>
                      <span className="w-7 h-7 rounded-full bg-black/40 flex items-center justify-center group-hover:translate-x-1 group-hover:bg-brand-gold group-hover:text-brand-deep transition-all">
                        <ArrowRight className="w-3.5 h-3.5 text-brand-gold group-hover:text-brand-deep" />
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Detailed Journey, Honors, Experience & Competencies */}
            <div className="lg:col-span-7 space-y-12">
              
              {/* Professional Summary */}
              <div>
                <span className="font-editorial-meta text-brand-gold block mb-2">
                  Professional Profile & Leadership
                </span>
                <h2 className="font-editorial-h2 text-brand-forest leading-tight">
                  Global Audit Rigor Combined with Independent Practice
                </h2>
                <div className="mt-5 space-y-4 font-editorial-body text-brand-muted leading-relaxed">
                  <p>
                    {partner.summary}
                  </p>
                  <p>
                    Operating from Tirupati, Andhra Pradesh, <strong className="text-brand-forest font-semibold">Kavitha & Associates</strong> offers companies and growing ventures direct access to senior Big 4-trained audit and advisory expertise. Every audit file, tax defense memo, and internal controls engagement is directly led and signed by <strong className="text-brand-forest font-semibold">CA Kavitha Vijay</strong>.
                  </p>
                </div>
              </div>

              {/* Honors & Key Achievements */}
              <div className="bg-brand-white rounded-2xl p-7 sm:p-8 border border-brand-border shadow-card card-tactile">
                <div className="flex items-center gap-2.5 mb-6">
                  <Trophy className="w-5 h-5 text-brand-gold shrink-0" />
                  <h3 className="font-editorial-h3 text-brand-forest">
                    Key Achievements & Professional Honors
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {partner.awards.map((award) => (
                    <div key={award.title} className="p-5 rounded-xl bg-brand-surface/70 border border-brand-border shadow-subtle card-premium-hover flex flex-col justify-between">
                      <div>
                        <span className="font-editorial-meta text-brand-gold block mb-1.5 text-[10px]">
                          {award.category}
                        </span>
                        <h4 className="font-editorial-h3 text-base font-bold text-brand-forest">
                          {award.title}
                        </h4>
                      </div>
                      <p className="font-editorial-body text-xs text-brand-muted mt-3 pt-3 border-t border-brand-border/60">
                        {award.organization}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Professional Experience & Career Journey */}
              <div className="space-y-6">
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-5 h-5 text-brand-forest shrink-0" />
                  <h3 className="font-editorial-h3 text-brand-forest">
                    Institutional Career Experience
                  </h3>
                </div>

                <div className="space-y-6">
                  {partner.careerJourney.map((job) => (
                    <div key={job.organization} className="bg-brand-white rounded-2xl p-7 sm:p-8 border border-brand-border shadow-card card-premium-hover">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-brand-border mb-5 gap-2">
                        <div>
                          <h4 className="font-editorial-h3 text-lg sm:text-xl font-bold text-brand-forest">
                            {job.role}
                          </h4>
                          <span className="text-xs font-semibold text-brand-forest flex items-center gap-1.5 mt-1 font-editorial-meta">
                            <Building2 className="w-4 h-4 text-brand-gold shrink-0" />
                            {job.organization}
                          </span>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="font-editorial-meta text-brand-charcoal bg-brand-surface px-3 py-1.5 rounded-full border border-brand-border inline-block text-[11px]">
                            {job.period}
                          </span>
                          <span className="font-editorial-body text-xs text-brand-muted block mt-1">
                            {job.location}
                          </span>
                        </div>
                      </div>

                      <ul className="space-y-2.5 text-xs sm:text-sm font-editorial-body text-brand-muted">
                        {job.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-brand-forest shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{h}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Key Engagements Pill Cloud if present */}
                      {job.keyEngagements && (
                        <div className="mt-6 pt-5 border-t border-brand-border">
                          <span className="font-editorial-meta text-brand-gold block mb-3 text-[11px]">
                            Key Audit & International Engagements
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {job.keyEngagements.map((eng) => (
                              <span 
                                key={eng} 
                                className="px-3 py-1 rounded-md bg-brand-surface text-brand-forest text-xs font-medium border border-brand-border"
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
              <div className="bg-brand-white rounded-2xl p-7 sm:p-8 border border-brand-border shadow-card card-tactile">
                <div className="flex items-center gap-2.5 mb-6">
                  <FileCheck2 className="w-5 h-5 text-brand-forest shrink-0" />
                  <h3 className="font-editorial-h3 text-brand-forest">
                    Core Technical Competencies
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {partner.coreCompetencies.map((comp) => (
                    <div key={comp} className="flex items-start gap-3 p-3.5 rounded-xl bg-brand-surface/60 border border-brand-border/70">
                      <span className="w-2 h-2 rounded-full bg-brand-forest shrink-0 mt-2" />
                      <span className="font-editorial-body text-xs font-semibold text-brand-forest leading-snug">
                        {comp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Traits Grid */}
              <div className="bg-brand-surface rounded-2xl p-6 sm:p-7 border border-brand-border">
                <span className="font-editorial-meta text-brand-gold block mb-3.5">
                  Professional Traits & Working Style
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {partner.traits.map((trait) => (
                    <span 
                      key={trait}
                      className="px-3.5 py-1.5 rounded-full bg-brand-white text-brand-forest text-xs font-semibold border border-brand-border shadow-subtle"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dual Qualification Strategic Advantage Matrix */}
              <div className="bg-brand-surface rounded-2xl p-7 sm:p-8 border border-brand-border shadow-subtle">
                <div className="flex items-center gap-2.5 mb-3">
                  <Scale className="w-5 h-5 text-brand-forest shrink-0" />
                  <h3 className="font-editorial-h3 text-brand-forest">
                    The Dual CA + CMA Strategic Advantage
                  </h3>
                </div>
                <p className="font-editorial-body text-xs sm:text-sm text-brand-muted leading-relaxed mb-6">
                  Holding qualifications in both Chartered Accountancy (ICAI Mem. 252985) and Cost & Management Accountancy (AIR 49) provides a rare dual capability: external statutory assurance and direct tax defense coupled with internal financial controls (ICFR), unit-cost modeling, and operational risk mitigation.
                </p>

                {/* Comparison Matrix Table */}
                <div className="overflow-x-auto rounded-xl border border-brand-border bg-brand-white shadow-subtle">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-brand-surface border-b border-brand-border">
                        <th className="py-3 px-4 font-editorial-meta text-brand-charcoal text-[10px]">
                          Practice Dimension
                        </th>
                        <th className="py-3 px-4 font-editorial-meta text-brand-muted text-[10px]">
                          Traditional Tax-Only Filing
                        </th>
                        <th className="py-3 px-4 font-editorial-meta text-brand-forest text-[10px] bg-brand-forest/5">
                          Kavitha & Associates (CA + CMA)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border font-editorial-body text-brand-charcoal">
                      <tr>
                        <td className="py-3 px-4 font-semibold text-brand-forest text-xs">Assurance Rigor</td>
                        <td className="py-3 px-4 text-brand-muted text-xs">Routine compilation</td>
                        <td className="py-3 px-4 font-medium text-brand-forest bg-brand-forest/5 text-xs">Big 4 & ICAI SAs methodology with ICFR testing</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-brand-forest text-xs">Cost & Working Capital</td>
                        <td className="py-3 px-4 text-brand-muted text-xs">Not addressed</td>
                        <td className="py-3 px-4 font-medium text-brand-forest bg-brand-forest/5 text-xs">Unit-cost modeling & margin leakage review (CMA AIR 49)</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-brand-forest text-xs">Tax & Scrutiny</td>
                        <td className="py-3 px-4 text-brand-muted text-xs">Reactive post-facto filing</td>
                        <td className="py-3 px-4 font-medium text-brand-forest bg-brand-forest/5 text-xs">Proactive advance tax, transfer pricing & ITC reconciliation</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-brand-forest text-xs">Partner Supervision</td>
                        <td className="py-3 px-4 text-brand-muted text-xs">Junior staff delegation</td>
                        <td className="py-3 px-4 font-medium text-brand-forest bg-brand-forest/5 text-xs">Direct partner leadership by CA Kavitha Vijay</td>
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
      <section className="py-20 sm:py-24 lg:py-28 bg-brand-surface border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="font-editorial-meta text-brand-gold block mb-2.5">
              Our Professional Foundation
            </span>
            <h2 className="font-editorial-h2 text-brand-forest tracking-tight">
              Governance, Independence & Ethics
            </h2>
            <p className="font-editorial-body text-base text-brand-muted mt-4">
              {firm.philosophy.statement}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {firm.philosophy.corePrinciples.map((principle, index) => (
              <div
                key={principle.title}
                className="bg-brand-white rounded-2xl p-7 sm:p-8 border border-brand-border shadow-card flex items-start gap-5 card-tactile"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-forest/10 text-brand-forest flex items-center justify-center font-serif font-bold text-base shrink-0 border border-brand-forest/20 text-brand-gold">
                  0{index + 1}
                </div>
                <div>
                  <h3 className="font-editorial-h3 text-brand-forest mb-2">
                    {principle.title}
                  </h3>
                  <p className="font-editorial-body text-xs sm:text-sm text-brand-muted leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ICAI Code of Ethics Guarantee Plaque */}
          <div className="mt-12 bg-brand-deep text-white rounded-2xl p-7 sm:p-9 border border-brand-gold/30 shadow-editorial-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-xl bg-brand-forest text-brand-gold flex items-center justify-center shrink-0 border border-brand-gold/40 shadow-inner">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-editorial-h3 text-white mb-2">
                  Commitment to ICAI Code of Ethics
                </h3>
                <p className="font-editorial-body text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
                  In accordance with the Chartered Accountants Act, 1949 and ICAI regulations, this website operates strictly under the informational 'pull' model. We do not solicit work, advertise professional fees, or publish client testimonials.
                </p>
              </div>
            </div>
            <Link
              to="/contact"
              className="min-h-[44px] px-6 py-3 rounded-full bg-brand-gold hover:bg-brand-gold/90 text-brand-deep font-editorial-meta text-xs font-bold uppercase tracking-wider shrink-0 transition-colors btn-tactile shadow-md inline-flex items-center justify-center"
            >
              Consult the Practice
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. VISION & MISSION
          ========================================================================= */}
      <section className="py-20 sm:py-24 bg-brand-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-brand-white p-8 sm:p-10 rounded-2xl border border-brand-border shadow-subtle space-y-4 card-tactile">
              <div className="w-12 h-12 rounded-xl bg-brand-forest/10 text-brand-forest flex items-center justify-center border border-brand-forest/20">
                <Target className="w-6 h-6 text-brand-forest" />
              </div>
              <h3 className="font-editorial-h3 text-brand-forest">Our Professional Mission</h3>
              <p className="font-editorial-body text-sm text-brand-muted leading-relaxed">
                To deliver uncompromising audit quality, strategic tax advisory, and transparent compliance guidance that empowers enterprises to operate with regulatory confidence and sustainable fiscal discipline.
              </p>
            </div>

            <div className="bg-brand-white p-8 sm:p-10 rounded-2xl border border-brand-border shadow-subtle space-y-4 card-tactile">
              <div className="w-12 h-12 rounded-xl bg-brand-forest/10 text-brand-forest flex items-center justify-center border border-brand-forest/20">
                <Eye className="w-6 h-6 text-brand-forest" />
              </div>
              <h3 className="font-editorial-h3 text-brand-forest">Our Operating Vision</h3>
              <p className="font-editorial-body text-sm text-brand-muted leading-relaxed">
                To stand as the most dependable and accessible growth partner for emerging businesses, established corporations, and builders across India, driven by continuous learning and ethical practice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. APPROACHABLE CONSULTATION CTA
          ========================================================================= */}
      <section className="py-20 sm:py-24 text-center bg-brand-surface border-t border-brand-border">
        <div className="max-w-3xl mx-auto px-4">
          <span className="font-editorial-meta text-brand-gold block mb-2.5">
            In-Person & Remote Practice
          </span>
          <h2 className="font-editorial-h2 text-brand-forest">
            Schedule a Direct Professional Consultation
          </h2>
          <p className="mt-4 font-editorial-body text-sm sm:text-base text-brand-muted leading-relaxed">
            Visit our chambers at Bairagi Patteda, Tirupati, or schedule a remote video/telephonic review of your compliance requirements with CA Kavitha Vijay.
          </p>
          <div className="mt-8 flex justify-center items-center gap-4 flex-wrap">
            <Link
              to="/contact"
              className="min-h-[44px] btn-pill-action bg-brand-forest text-white hover:bg-brand-deep group font-editorial-meta text-xs shadow-card hover:shadow-card-hover border border-brand-gold/40"
            >
              <span>Contact the Practice</span>
              <span className="icon-badge bg-white/10 text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-deep">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
            <a
              href={firm.contact.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3 rounded-full border border-brand-border bg-brand-white text-brand-forest font-editorial-meta text-xs hover:bg-brand-surface shadow-subtle transition-all active:scale-[0.98] btn-tactile"
            >
              <MapPin className="w-4 h-4 text-brand-gold" />
              <span>Directions to Chambers</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
