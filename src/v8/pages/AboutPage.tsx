import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  Lock, 
  Compass,
  Phone,
  MessageSquare
} from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';
import { LeadershipProfile } from '../components/about/LeadershipProfile';
import { ArchitecturalFrame } from '../components/common/ArchitecturalFrame';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useFirmProfile } from '../adapters/backendAdapter';
import { DotGrid, ArchitecturalLines, DecorativeLayer } from '../components/decorative';
import { Reveal, StaggerContainer, StaggerItem } from '../components/animation';

export const AboutPage: React.FC = () => {
  const firmProfile = useFirmProfile();
  const { contact } = firmProfile;

  return (
    <div className="bg-[#F1EBDD] text-[#071B14] min-h-screen page-reveal">
      <SEOHead
        title="About the Firm & Leadership | Kavitha & Associates Chartered Accountants"
        description="Learn about Kavitha & Associates, an independent Chartered Accountancy practice in Tirupati led by CA Kavitha Vijay (B.Com, CA, CMA AIR 49 ICMAI). 10+ years of statutory audit, taxation, and financial governance."
        canonicalPath="/about"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'About the Firm', path: '/about' },
        ]}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            '@id': 'https://kavithaassociates.com/about#webpage',
            url: 'https://kavithaassociates.com/about',
            name: 'About the Firm & Leadership | Kavitha & Associates',
            isPartOf: {
              '@type': 'WebSite',
              '@id': 'https://kavithaassociates.com/#website',
              name: 'Kavitha & Associates',
              url: 'https://kavithaassociates.com/',
            },
            mainEntity: {
              '@type': 'AccountingService',
              name: 'Kavitha & Associates',
              legalName: 'Kavitha & Associates Chartered Accountants',
              description: 'Independent Chartered Accountancy practice in Tirupati providing statutory audit, direct tax litigation, GST advisory, and corporate financial governance.',
              telephone: '+919626350900',
              email: 'cakavithasrj@gmail.com',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '19-12-46, 1st Floor, Near Bairagipetteda Arch, Bairagi Patteda',
                addressLocality: 'Tirupati',
                addressRegion: 'Andhra Pradesh',
                postalCode: '517501',
                addressCountry: 'IN',
              },
              founder: {
                '@type': 'Person',
                name: 'CA Kavitha Vijay',
                jobTitle: 'Practicing Chartered Accountant & Senior Partner',
                honorificPrefix: 'CA',
                description: 'B.Com, CA, CMA (AIR 49, The Institute of Cost Accountants of India - ICMAI)',
              },
            },
          },
        ]}
      />

      {/* ---------------------------------------------------------------------
          Section 1: Architectural Hero Banner
          --------------------------------------------------------------------- */}
      <section className="bg-[#071B14] text-[#F1EBDD] pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 border-b border-[#B49A64]/25 texture-architectural-lines relative overflow-hidden">
        {/* Precision Dot Grid Accent */}
        <div className="absolute top-6 left-6 pointer-events-none hidden lg:block opacity-30" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            {[0, 16, 32].map((x) =>
              [0, 16, 32].map((y) => (
                <circle key={`${x}-${y}`} cx={x + 4} cy={y + 4} r="1.5" fill="#B49A64" />
              ))
            )}
          </svg>
        </div>

        {/* About Page Ambient Decorative Layer */}
        <DecorativeLayer>
          <DotGrid
            variant="bronze"
            width={240}
            height={240}
            className="absolute -bottom-10 -left-10 opacity-15 hidden md:block"
          />
        </DecorativeLayer>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal delay={60} duration={650}>
            <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2.5 flex-wrap">
              <Badge variant="kicker">ABOUT THE FIRM</Badge>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B241C] border border-[#B49A64]/30 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#B49A64]" />
                <span className="text-[10px] sm:text-xs font-semibold text-[#B49A64] tracking-wider uppercase">
                  PRACTICE FOUNDED ON STATUTORY RIGOUR
                </span>
              </div>
            </div>

            <h1 className="font-editorial-h1 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#F1EBDD] leading-[1.15]">
              Chambers Background &amp; Institutional Heritage
            </h1>

            <p className="font-editorial-body text-sm sm:text-base text-[#D8D0BE] leading-relaxed border-l-2 border-[#B49A64]/50 pl-4">
              Kavitha &amp; Associates is an independent Chartered Accountancy practice headquartered in Tirupati, Andhra Pradesh. Led by CA Kavitha Vijay, drawing upon over a decade of verified professional experience in corporate audit and cost controllership, our practice provides partner-supervised statutory auditing, taxation compliance, and financial advisory services to enterprises and emerging businesses across South India.
            </p>

            {/* About Double-Rule Accent */}
            <ArchitecturalLines type="double-rule" variant="bronze" length="100px" className="my-3.5 opacity-60" />
          </div>
        </Reveal>
      </div>
      </section>

      {/* ---------------------------------------------------------------------
          Section 2: Firm Story & Institutional Ethos
          --------------------------------------------------------------------- */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#F1EBDD] border-b border-[#D8D0BE] texture-warm-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left 7 cols: Editorial Story */}
            <div className="lg:col-span-7 space-y-5">
              <Reveal direction="left" delay={60} duration={650}>
                <div className="space-y-5">
                  <span className="text-xs font-semibold text-[#7E5E1E] font-mono uppercase tracking-wider block">
                    PRACTICE PHILOSOPHY &amp; ETHOS
                  </span>
                  <h2 className="font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#071B14] leading-tight">
                    A Decade of Professional Governance &amp; Statutory Precision
                  </h2>

                  <p className="font-editorial-body text-sm text-[#35271F] leading-relaxed">
                    Founded with a conviction that statutory accounting requires meticulous technical rigor and ethical discipline, Kavitha &amp; Associates delivers partner-supervised counsel designed to withstand regulatory review and departmental scrutiny. Drawing on more than 10 years of individual professional experience in Tirupati and commercial corridors across South India, our practice emphasizes thorough documentation, defensible tax reporting, and reliable corporate governance.
                  </p>

                  <p className="font-editorial-body text-sm text-[#35271F] leading-relaxed">
                    Our practice is distinguished by its unique dual-qualification heritage: Senior Partner CA Kavitha Vijay holds credentials as both a Chartered Accountant (ICAI) and a Cost and Management Accountant with All India Rank 49 (AIR 49), conferred by The Institute of Cost Accountants of India (ICMAI). This integrated perspective allows our clients to secure statutory defensibility while optimizing operating margins and internal financial controls.
                  </p>

                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#D8D0BE] shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B49A64]/60">
                      <div className="flex items-center gap-2 text-[#183529] font-serif font-bold text-sm mb-1">
                        <CheckCircle2 className="w-4 h-4 text-[#7E5E1E]" />
                        <span>Pure Advisory Independence</span>
                      </div>
                      <p className="font-editorial-body text-xs text-[#525954] leading-relaxed">
                        Operating strictly under the ICAI Code of Ethics on an informational pull model, with zero commercial commissions or third-party conflicts.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#D8D0BE] shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B49A64]/60">
                      <div className="flex items-center gap-2 text-[#183529] font-serif font-bold text-sm mb-1">
                        <CheckCircle2 className="w-4 h-4 text-[#7E5E1E]" />
                        <span>Cross-Border Audit Pedigree</span>
                      </div>
                      <p className="font-editorial-body text-xs text-[#525954] leading-relaxed">
                        Senior leadership experience encompassing Deloitte Big 4 statutory audits and Ford Motor Company multinational internal controls.
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right 5 cols: Architectural Plaque */}
            <div className="lg:col-span-5">
              <Reveal direction="right" delay={120} duration={650}>
                <ArchitecturalFrame variant="ivory" className="shadow-editorial transition-all duration-300 hover:-translate-y-1 hover:border-[#B49A64]">
                  <div className="space-y-6">
                    <div className="border-b border-[#D8D0BE] pb-4">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#7E5E1E] bg-[#F1EBDD] px-2.5 py-1 rounded-md border border-[#D8D0BE] shadow-2xs">
                          INSTITUTIONAL METRICS
                        </span>
                        <span className="text-[10px] font-mono text-[#525954] uppercase tracking-wider">
                          Verified Practice Standards
                        </span>
                      </div>
                      <h3 className="font-editorial-h3 text-xl font-bold font-serif text-[#071B14] mt-1">
                        Practice Standards at a Glance
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start justify-between border-b border-[#D8D0BE]/60 pb-3">
                        <div>
                          <strong className="block font-serif text-sm text-[#071B14]">Partner Career Experience</strong>
                          <span className="text-xs text-[#525954]">Big 4 &amp; Corporate Controllership</span>
                        </div>
                        <span className="font-serif text-base font-bold text-[#183529]">10+ Years</span>
                      </div>

                      <div className="flex items-start justify-between border-b border-[#D8D0BE]/60 pb-3">
                        <div>
                          <strong className="block font-serif text-sm text-[#071B14]">Engagement Supervision</strong>
                          <span className="text-xs text-[#525954]">Direct Partner Leadership on All Mandates</span>
                        </div>
                        <span className="font-serif text-base font-bold text-[#183529]">Partner-Led</span>
                      </div>

                      <div className="flex items-start justify-between border-b border-[#D8D0BE]/60 pb-3">
                        <div>
                          <strong className="block font-serif text-sm text-[#071B14]">ICMAI Standing</strong>
                          <span className="text-xs text-[#525954]">The Institute of Cost Accountants of India</span>
                        </div>
                        <span className="font-serif text-base font-bold text-[#7E5E1E]">AIR 49</span>
                      </div>

                      <div className="flex items-start justify-between">
                        <div>
                          <strong className="block font-serif text-sm text-[#071B14]">Confidentiality Standard</strong>
                          <span className="text-xs text-[#525954]">Statutory Non-Disclosure &amp; ICAI Code of Ethics</span>
                        </div>
                        <span className="font-serif text-base font-bold text-[#183529]">Governed</span>
                      </div>
                    </div>
                  </div>
                </ArchitecturalFrame>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          Section 3: Core Firm Values (4 Pillars)
          --------------------------------------------------------------------- */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#FAF7F0] border-b border-[#D8D0BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal delay={60} duration={650}>
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
              <span className="text-xs font-semibold text-[#7E5E1E] font-mono uppercase tracking-wider block mb-2">
                GOVERNANCE PILLARS
              </span>
              <h2 className="font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#071B14]">
                Four Foundational Commitments of Our Chambers
              </h2>
              <p className="font-editorial-body text-xs sm:text-sm text-[#525954] mt-3">
                Every mandate undertaken by our firm is governed by four professional standards designed to protect clients through statutory precision and ethical rigor.
              </p>
            </div>
          </Reveal>

          <StaggerContainer staggerMs={80} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Pillar 1 */}
            <StaggerItem index={0} distance={18} durationMs={550}>
              <div className="h-full p-6 rounded-2xl bg-[#F1EBDD] border border-[#D8D0BE] flex flex-col justify-between shadow-xs card-interactive transition-all duration-300 hover:-translate-y-1 hover:border-[#B49A64] hover:shadow-card-hover">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#183529] text-[#B49A64] flex items-center justify-center shadow-xs">
                    <ShieldCheck className="w-5 h-5 text-[#B49A64]" />
                  </div>
                  <span className="font-mono text-[11px] font-bold text-[#7E5E1E] block uppercase tracking-wider">
                    PILLAR 01
                  </span>
                  <h3 className="font-editorial-h3 text-lg font-serif font-bold text-[#071B14] leading-snug">
                    Statutory Precision &amp; Defensible Reporting
                  </h3>
                  <p className="font-editorial-body text-xs text-[#35271F] leading-relaxed">
                    Every computation, disclosure, audit opinion, and tax position is prepared strictly in accordance with applicable accounting standards and statutory provisions, designed to withstand regulatory review.
                  </p>
                </div>
              </div>
            </StaggerItem>

            {/* Pillar 2 */}
            <StaggerItem index={1} distance={18} durationMs={550}>
              <div className="h-full p-6 rounded-2xl bg-[#F1EBDD] border border-[#D8D0BE] flex flex-col justify-between shadow-xs card-interactive transition-all duration-300 hover:-translate-y-1 hover:border-[#B49A64] hover:shadow-card-hover">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#183529] text-[#B49A64] flex items-center justify-center shadow-xs">
                    <Compass className="w-5 h-5 text-[#B49A64]" />
                  </div>
                  <span className="font-mono text-[11px] font-bold text-[#7E5E1E] block uppercase tracking-wider">
                    PILLAR 02
                  </span>
                  <h3 className="font-editorial-h3 text-lg font-serif font-bold text-[#071B14] leading-snug">
                    Principal-Led Engagement (Direct Partner Oversight)
                  </h3>
                  <p className="font-editorial-body text-xs text-[#35271F] leading-relaxed">
                    Clients interface directly with CA Kavitha Vijay. We reject junior-staff delegation models to ensure nuanced senior fiscal judgment is applied to every client matter.
                  </p>
                </div>
              </div>
            </StaggerItem>

            {/* Pillar 3 */}
            <StaggerItem index={2} distance={18} durationMs={550}>
              <div className="h-full p-6 rounded-2xl bg-[#F1EBDD] border border-[#D8D0BE] flex flex-col justify-between shadow-xs card-interactive transition-all duration-300 hover:-translate-y-1 hover:border-[#B49A64] hover:shadow-card-hover">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#183529] text-[#B49A64] flex items-center justify-center shadow-xs">
                    <TrendingUp className="w-5 h-5 text-[#B49A64]" />
                  </div>
                  <span className="font-mono text-[11px] font-bold text-[#7E5E1E] block uppercase tracking-wider">
                    PILLAR 03
                  </span>
                  <h3 className="font-editorial-h3 text-lg font-serif font-bold text-[#071B14] leading-snug">
                    Proactive Regulatory Foresight &amp; Notice Mitigation
                  </h3>
                  <p className="font-editorial-body text-xs text-[#35271F] leading-relaxed">
                    We resolve reconciliation variances, AIS/TIS mismatches, and GST 2B discrepancies before statutory notices are triggered, insulating enterprises from penal interest.
                  </p>
                </div>
              </div>
            </StaggerItem>

            {/* Pillar 4 */}
            <StaggerItem index={3} distance={18} durationMs={550}>
              <div className="h-full p-6 rounded-2xl bg-[#F1EBDD] border border-[#D8D0BE] flex flex-col justify-between shadow-xs card-interactive transition-all duration-300 hover:-translate-y-1 hover:border-[#B49A64] hover:shadow-card-hover">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#183529] text-[#B49A64] flex items-center justify-center shadow-xs">
                    <Lock className="w-5 h-5 text-[#B49A64]" />
                  </div>
                  <span className="font-mono text-[11px] font-bold text-[#7E5E1E] block uppercase tracking-wider">
                    PILLAR 04
                  </span>
                  <h3 className="font-editorial-h3 text-lg font-serif font-bold text-[#071B14] leading-snug">
                    Radical Transparency &amp; Clean Independence
                  </h3>
                  <p className="font-editorial-body text-xs text-[#35271F] leading-relaxed">
                    Uncompromising adherence to ICAI ethical standards with zero commercial conflicts of interest, upfront fee schedules, and confidential client document protection.
                  </p>
                </div>
              </div>
            </StaggerItem>

          </StaggerContainer>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          Section 4: Leadership Dossier (CA Kavitha Vijay)
          --------------------------------------------------------------------- */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#F1EBDD] border-b border-[#D8D0BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal delay={60} duration={650}>
            <div className="mb-8">
              <span className="text-xs font-semibold text-[#7E5E1E] font-mono uppercase tracking-wider block mb-1">
                SENIOR LEADERSHIP
              </span>
              <h2 className="font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#071B14]">
                Leadership Profile &amp; Verified Professional Credentials
              </h2>
              <p className="font-editorial-body text-xs sm:text-sm text-[#525954] mt-2 max-w-3xl">
                Partner profile presenting verified educational qualifications, Big 4 audit pedigree, and institutional honors in strict accordance with the ICAI disclosure guidelines and R4 privacy standards.
              </p>
            </div>
          </Reveal>

          {/* Embedded Leadership Profile Component */}
          <Reveal delay={120} duration={650}>
            <LeadershipProfile />
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          Section 5: Dual Competence Advantage Matrix (ICAI + ICMAI)
          --------------------------------------------------------------------- */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#FAF7F0] border-b border-[#D8D0BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal delay={60} duration={650}>
            <div className="max-w-3xl mb-10">
              <span className="text-xs font-semibold text-[#7E5E1E] font-mono uppercase tracking-wider block mb-1">
                THE DUAL QUALIFICATION ADVANTAGE
              </span>
              <h2 className="font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#071B14]">
                Integrated ICAI (Chartered) &amp; ICMAI (Cost) Governance
              </h2>
              <p className="font-editorial-body text-xs sm:text-sm text-[#525954] mt-2">
                Most enterprises engage external auditors solely for statutory compliance while lacking cost accounting insight. Our chambers combine both competencies to ensure total regulatory defensibility paired with sharp operating margin control.
              </p>
            </div>
          </Reveal>

          <StaggerContainer staggerMs={90} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* ICAI Discipline Card */}
            <StaggerItem index={0} distance={20} durationMs={600}>
              <div className="h-full p-6 sm:p-8 rounded-2xl bg-[#F1EBDD] border border-[#D8D0BE] space-y-5 shadow-xs card-interactive transition-all duration-300 hover:-translate-y-1 hover:border-[#B49A64] hover:shadow-card-hover">
                <div className="flex items-center justify-between border-b border-[#D8D0BE] pb-4">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#183529] uppercase tracking-wider block">
                      STATUTORY PILLAR
                    </span>
                    <h3 className="font-editorial-h3 text-xl font-serif font-bold text-[#071B14] mt-0.5">
                      Chartered Accountancy (ICAI)
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#183529] text-[#F1EBDD] flex items-center justify-center font-serif font-bold text-sm">
                    CA
                  </div>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-[#35271F]">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#183529] shrink-0 mt-0.5" />
                    <span>Mandatory Statutory Audit under Companies Act 2013 and CARO 2020 reporting.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#183529] shrink-0 mt-0.5" />
                    <span>Section 44AB Tax Audits, Section 115BAA corporate tax, and faceless assessment defense.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#183529] shrink-0 mt-0.5" />
                    <span>Comprehensive GST Annual Returns (GSTR-9/9C) and Input Tax Credit (ITC 2B) audits.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#183529] shrink-0 mt-0.5" />
                    <span>True and fair financial reporting providing regulatory stakeholders and financial institutions statutory assurance in accordance with ICAI Standards on Auditing.</span>
                  </li>
                </ul>
              </div>
            </StaggerItem>

            {/* ICMAI Discipline Card */}
            <StaggerItem index={1} distance={20} durationMs={600}>
              <div className="h-full p-6 sm:p-8 rounded-2xl bg-[#F1EBDD] border border-[#D8D0BE] space-y-5 shadow-xs card-interactive transition-all duration-300 hover:-translate-y-1 hover:border-[#B49A64] hover:shadow-card-hover">
                <div className="flex items-center justify-between border-b border-[#D8D0BE] pb-4">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#7E5E1E] uppercase tracking-wider block">
                      OPERATIONAL PILLAR
                    </span>
                    <h3 className="font-editorial-h3 text-xl font-serif font-bold text-[#071B14] mt-0.5">
                      Cost &amp; Management (ICMAI AIR 49)
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#7E5E1E] text-[#F1EBDD] flex items-center justify-center font-serif font-bold text-sm">
                    CMA
                  </div>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-[#35271F]">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7E5E1E] shrink-0 mt-0.5" />
                    <span>Granular unit cost modeling, cost allocation keys, and inventory valuation (Ind AS 2).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7E5E1E] shrink-0 mt-0.5" />
                    <span>Internal Financial Controls over Financial Reporting (ICFR) diagnostic testing.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7E5E1E] shrink-0 mt-0.5" />
                    <span>Working capital optimization, operating cash flow forecasts, and bank CMA data preparation.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#7E5E1E] shrink-0 mt-0.5" />
                    <span>Conferred All India Rank 49 (AIR 49) in CMA Intermediate by The Institute of Cost Accountants of India (ICMAI).</span>
                  </li>
                </ul>
              </div>
            </StaggerItem>

          </StaggerContainer>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          Section 6: Chambers Coordinates & Consultation CTA
          --------------------------------------------------------------------- */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#071B14] text-[#F1EBDD] border-b border-[#B49A64]/20 relative overflow-hidden texture-architectural-lines">
        {/* About Page Ambient Decorative Layer */}
        <DecorativeLayer>
          <DotGrid
            variant="bronze"
            width={240}
            height={240}
            className="absolute -bottom-10 -left-10 opacity-15 hidden md:block"
          />
        </DecorativeLayer>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <Reveal direction="left" delay={60} duration={650}>
                <div className="space-y-4">
                  <span className="text-xs font-semibold text-[#B49A64] font-mono uppercase tracking-wider block">
                    CHAMBERS INTAKE &amp; ENGAGEMENT
                  </span>
                  <h2 className="font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#F1EBDD]">
                    Consult Our Practicing Desk in Tirupati
                  </h2>
                  <p className="font-editorial-body text-xs sm:text-sm text-[#D8D0BE] max-w-2xl leading-relaxed">
                    Whether you require partner-supervised statutory audit certification, corporate tax restructuring, or proactive response to a regulatory notice, our practicing chambers in Tirupati are at your service.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Button
                      to="/contact"
                      variant="primary-bronze"
                      size="md"
                      showArrow
                      className="min-h-[44px]"
                    >
                      Schedule Formal Consultation
                    </Button>

                    <a
                      href={`tel:${contact.primaryPhoneClean}`}
                      className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#183529] text-[#F1EBDD] hover:bg-[#294B39] font-semibold text-xs border border-[#B49A64]/30 btn-tactile"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#B49A64]" />
                      <span>Call Chambers: {contact.primaryPhone}</span>
                    </a>

                    <a
                      href={contact.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0B241C] text-[#B49A64] hover:bg-[#183529] font-semibold text-xs border border-[#B49A64]/40 btn-tactile"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#B49A64]" />
                      <span>Connect on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-4">
              <Reveal direction="right" delay={120} duration={650}>
                <div className="p-6 rounded-2xl bg-[#0B241C] border border-[#B49A64]/30 space-y-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B49A64]">
                  <span className="text-[10px] uppercase font-bold text-[#B49A64] tracking-wider block font-mono">
                    PHYSICAL CHAMBERS
                  </span>
                  <p className="text-xs text-[#F1EBDD] font-medium leading-relaxed">
                    19-12-46, 1st Floor, Near Bairagipetteda Arch, Bairagi Patteda, Tirupati, Andhra Pradesh 517501
                  </p>
                  <div className="pt-2 text-[11px] text-[#AAB4A0] border-t border-[#B49A64]/20 space-y-1">
                    <p>Mon – Fri: 09:30 – 18:30 IST</p>
                    <p>Saturday: 10:00 – 14:00 IST</p>
                    <p className="text-[#B49A64] font-medium">Sunday: Prior Appointment Only</p>
                  </div>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
