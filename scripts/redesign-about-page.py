new_about_content = """import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Briefcase, 
  Users, 
  Globe, 
  ArrowRight, 
  Award, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Shield,
  GraduationCap,
  Trophy,
  ExternalLink,
  Sparkles,
  FileText,
  Calculator,
  Receipt,
  Building2,
  Search,
  LineChart,
  Clock
} from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';
import { FIRM_DATA } from '../data/firmData';
import { SEOHead } from '../components/SEOHead';

export const AboutPage: React.FC = () => {
  const { data } = useFirmData();
  const firm = data || FIRM_DATA;
  const { partner } = firm;

  return (
    <div className="bg-[#FBF7EF] text-[#292B27] min-h-screen page-reveal">
      <SEOHead
        title="About CA Kavitha Vijay | Chartered Accountant in Tirupati | Kavitha & Associates"
        description="Profile of CA Kavitha Vijay (B.Com, CA, CMA AIR 49), Managing Partner at Kavitha & Associates. 10+ years across Deloitte Big 4 audit, Ford internal audit, and Tirupati practice."
        canonicalPath="/about"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' }
        ]}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            '@id': 'https://kavithaassociates.com/about#webpage',
            url: 'https://kavithaassociates.com/about',
            name: 'About CA Kavitha Vijay | Chartered Accountant in Tirupati | Kavitha & Associates',
            isPartOf: {
              '@type': 'WebSite',
              '@id': 'https://kavithaassociates.com/#website',
              name: 'Kavitha & Associates',
              url: 'https://kavithaassociates.com/'
            },
            mainEntity: {
              '@type': 'Person',
              '@id': 'https://kavithaassociates.com/about#partner',
              name: 'CA Kavitha Vijay',
              givenName: 'Kavitha',
              familyName: 'Vijay',
              jobTitle: 'Managing Partner & Practicing Chartered Accountant',
              telephone: '+919626350900',
              email: 'cakavithasrj@gmail.com',
              url: 'https://kavithaassociates.com/about',
              sameAs: [
                'https://www.linkedin.com/in/ca-kavitha-srj-770988199',
                'https://maps.app.goo.gl/p9ToGUtxqYDCghpF6'
              ],
              worksFor: {
                '@type': 'AccountingService',
                '@id': 'https://kavithaassociates.com/#organization',
                name: 'Kavitha & Associates',
                telephone: '+919626350900',
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: '19-12-46, 1st Floor, Near Bairagipetteda Arch, Bairagi Patteda',
                  addressLocality: 'Tirupati',
                  addressRegion: 'Andhra Pradesh',
                  postalCode: '517501',
                  addressCountry: 'IN'
                }
              },
              alumniOf: [
                {
                  '@type': 'EducationalOrganization',
                  name: 'The Institute of Chartered Accountants of India'
                },
                {
                  '@type': 'EducationalOrganization',
                  name: 'The Institute of Cost Accountants of India'
                },
                {
                  '@type': 'EducationalOrganization',
                  name: 'Madras University'
                }
              ],
              knowsAbout: [
                'Statutory Audit',
                'Internal Audit & Risk-Based Auditing',
                'Income Tax Planning & Scrutiny Defense',
                'GST Compliance & Litigation',
                'Virtual CFO & Cost Accounting',
                'AP RERA CA Certification'
              ]
            }
          }
        ]}
      />

      {/* =========================================================================
          SECTION 1: ABOUT HERO (Asymmetric Editorial Split)
          ========================================================================= */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 border-b border-[#E9E0D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left 6 Columns: Editorial Narrative */}
            <div className="lg:col-span-6 space-y-6 scroll-reveal-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#183D30] text-[#C9A66B] font-editorial-meta text-xs border border-[#C9A66B]/40 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#C9A66B] motion-safe:animate-pulse" />
                <span className="tracking-widest uppercase font-semibold">ABOUT KAVITHA &amp; ASSOCIATES</span>
              </div>

              <h1 className="font-editorial-h1 text-[#183D30] tracking-tight">
                Professional Expertise. Personal Commitment.
              </h1>

              <p className="font-editorial-body text-base sm:text-lg text-[#66665E] leading-relaxed">
                We provide professional financial, taxation, audit and advisory services to support businesses and individuals across India.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/contact"
                  className="min-h-[48px] inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#356B50] hover:bg-[#183D30] text-white font-editorial-meta text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm hover:shadow-md border border-[#C9A66B]/40 btn-tactile"
                >
                  <span>Book a Consultation</span>
                  <ArrowRight className="w-4 h-4 text-[#C9A66B]" />
                </Link>

                <a
                  href="#profile"
                  className="min-h-[48px] inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFFDF8] hover:bg-[#F2E8D5] text-[#183D30] font-editorial-meta text-xs font-semibold tracking-wider uppercase transition-colors border border-[#E9E0D2] shadow-subtle btn-tactile"
                >
                  <span>Senior Partner Profile</span>
                  <span className="text-[#C9A66B]">↓</span>
                </a>
              </div>
            </div>

            {/* Right 6 Columns: Refined Chambers Visual Vignette */}
            <div className="lg:col-span-6 scroll-reveal-right">
              <div className="relative rounded-3xl p-2 bg-[#FFFDF8] border border-[#E9E0D2] shadow-card">
                <div className="overflow-hidden rounded-2xl relative">
                  <img
                    src="/images/about/office-interior.webp"
                    alt="Kavitha &amp; Associates Executive Consultation Chambers"
                    width="1200"
                    height="630"
                    loading="eager"
                    fetchPriority="high"
                    className="w-full h-72 sm:h-80 md:h-[390px] object-cover transition-transform duration-700 hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Floating badge */}
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-[#FFFDF8]/95 backdrop-blur-md p-4 rounded-xl border border-[#E9E0D2] shadow-md flex items-center justify-between">
                    <div>
                      <span className="font-editorial-meta text-[10px] text-[#C9A66B] uppercase tracking-wider block">
                        Principal Chambers
                      </span>
                      <p className="font-serif text-sm sm:text-base font-bold text-[#183D30]">
                        Bairagi Patteda, Tirupati
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#356B50]/10 text-[#356B50] font-editorial-meta text-[11px] font-semibold border border-[#356B50]/20">
                      Estd. Practice
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: FIRM INTRODUCTION (The Professional Approach)
          ========================================================================= */}
      <section className="py-14 sm:py-18 md:py-20 bg-[#FFFDF8] border-b border-[#E9E0D2]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center scroll-reveal">
          <span className="font-editorial-meta text-xs uppercase tracking-wider text-[#C9A66B] font-semibold block mb-2">
            Practice Philosophy
          </span>
          <h2 className="font-editorial-h2 text-2xl sm:text-3xl md:text-4xl font-bold text-[#183D30] max-w-3xl mx-auto leading-tight">
            A Professional Approach to Every Financial Decision
          </h2>
          <p className="font-editorial-body text-base text-[#66665E] max-w-3xl mx-auto mt-5 leading-relaxed">
            Founded by CA Kavitha Vijay, Kavitha &amp; Associates is a trusted Chartered Accountancy practice providing statutory auditing, taxation, compliance, and corporate advisory services across India. We operate on a foundation of rigorous evidence-based review, ICAI auditing standards, and direct senior partner supervision on every client engagement.
          </p>
          <p className="font-editorial-body text-sm sm:text-base text-[#66665E] max-w-3xl mx-auto mt-3 leading-relaxed">
            By integrating external statutory rigor with internal cost accounting insights, we assist business leaders, directors, and individual taxpayers in fulfilling their statutory duties legitimately while safeguarding long-term fiscal health.
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: PROFESSIONAL VALUES (4 Elegant Light Cards)
          ========================================================================= */}
      <section className="py-14 sm:py-18 md:py-20 bg-[#FBF7EF] border-b border-[#E9E0D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 scroll-reveal">
            <span className="font-editorial-meta text-xs uppercase tracking-wider text-[#C9A66B] font-semibold block mb-2">
              Foundational Principles
            </span>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-bold text-[#183D30]">
              Our Professional Values
            </h2>
            <p className="font-editorial-body text-xs sm:text-sm text-[#66665E] mt-2">
              Core ethical standards and institutional disciplines that guide every client interaction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 scroll-stagger">
            
            {/* Value 1: Professional Integrity */}
            <div className="p-6 rounded-2xl bg-[#FFFDF8] border border-[#E9E0D2] shadow-subtle card-premium-hover flex flex-col justify-between scroll-reveal">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#356B50]/10 text-[#356B50] flex items-center justify-center mb-5 border border-[#356B50]/20">
                  <ShieldCheck className="w-6 h-6 text-[#356B50]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#183D30] mb-2">
                  Professional Integrity
                </h3>
                <p className="font-editorial-body text-xs text-[#66665E] leading-relaxed">
                  Strict adherence to mandatory Indian Standards on Auditing (SAs) and the Chartered Accountants Act, 1949, ensuring objective and independent opinions.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#E9E0D2]/80 flex items-center gap-1.5 text-[11px] font-semibold text-[#356B50]">
                <span>ICAI Standards Benchmark</span>
              </div>
            </div>

            {/* Value 2: Industry Experience */}
            <div className="p-6 rounded-2xl bg-[#FFFDF8] border border-[#E9E0D2] shadow-subtle card-premium-hover flex flex-col justify-between scroll-reveal">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#356B50]/10 text-[#356B50] flex items-center justify-center mb-5 border border-[#356B50]/20">
                  <Briefcase className="w-6 h-6 text-[#356B50]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#183D30] mb-2">
                  Industry Experience
                </h3>
                <p className="font-editorial-body text-xs text-[#66665E] leading-relaxed">
                  Over a decade of progressive institutional background spanning Big 4 statutory audit (Deloitte) and multinational internal audit (Ford Motor Company).
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#E9E0D2]/80 flex items-center gap-1.5 text-[11px] font-semibold text-[#356B50]">
                <span>Big 4 &amp; MNC Governance</span>
              </div>
            </div>

            {/* Value 3: Client Focus */}
            <div className="p-6 rounded-2xl bg-[#FFFDF8] border border-[#E9E0D2] shadow-subtle card-premium-hover flex flex-col justify-between scroll-reveal">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#356B50]/10 text-[#356B50] flex items-center justify-center mb-5 border border-[#356B50]/20">
                  <Users className="w-6 h-6 text-[#356B50]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#183D30] mb-2">
                  Client Focus
                </h3>
                <p className="font-editorial-body text-xs text-[#66665E] leading-relaxed">
                  Every engagement is supervised directly by CA Kavitha Vijay, translating complex statutory provisions into clear, actionable financial roadmaps.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#E9E0D2]/80 flex items-center gap-1.5 text-[11px] font-semibold text-[#356B50]">
                <span>Direct Partner Sign-Off</span>
              </div>
            </div>

            {/* Value 4: Pan-India Reach */}
            <div className="p-6 rounded-2xl bg-[#FFFDF8] border border-[#E9E0D2] shadow-subtle card-premium-hover flex flex-col justify-between scroll-reveal">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#C9A66B]/15 text-[#C9A66B] flex items-center justify-center mb-5 border border-[#C9A66B]/30">
                  <Globe className="w-6 h-6 text-[#C9A66B]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#183D30] mb-2">
                  Pan-India Reach
                </h3>
                <p className="font-editorial-body text-xs text-[#66665E] leading-relaxed">
                  Serving enterprises, startups, and institutions across all States and Union Territories through seamless virtual advisory and in-person review.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#E9E0D2]/80 flex items-center gap-1.5 text-[11px] font-semibold text-[#C9A66B]">
                <span>Serving Clients Across India</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: PROFESSIONAL PROFILE (CA Kavitha Vijay)
          ========================================================================= */}
      <section id="profile" className="py-14 sm:py-20 md:py-24 bg-[#FFFDF8] border-b border-[#E9E0D2] scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left 5 Columns: Senior Partner Identification Card */}
            <div className="lg:col-span-5 scroll-reveal-left">
              <div className="bg-[#FFFDF8] rounded-3xl p-6 sm:p-8 border border-[#E9E0D2] shadow-card space-y-6">
                
                {/* Header with Official CA India Logo */}
                <div className="flex items-center justify-between pb-5 border-b border-[#E9E0D2]">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center p-1.5 border border-[#E9E0D2] shadow-xs shrink-0">
                      <img
                        src="/brand/ca-india-logo.png"
                        alt="Official CA India Emblem - Chartered Accountants"
                        width="56"
                        height="56"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <span className="font-editorial-meta text-[10px] uppercase tracking-wider text-[#C9A66B] font-bold block">
                        Senior Partner
                      </span>
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#183D30]">
                        {partner.name}
                      </h2>
                    </div>
                  </div>
                  <span className="font-editorial-meta text-[11px] font-semibold px-2.5 py-1 rounded bg-[#356B50]/10 text-[#356B50] border border-[#356B50]/20">
                    AIR 49
                  </span>
                </div>

                {/* Statutory Credentials */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#183D30]">
                    <GraduationCap className="w-4 h-4 text-[#C9A66B] shrink-0" />
                    <span>{partner.qualifications}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#66665E]">
                    <Shield className="w-4 h-4 text-[#C9A66B] shrink-0" />
                    <span>ICAI Mem. [REDACTED_MEMBERSHIP_NO]</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#66665E]">
                    <Sparkles className="w-4 h-4 text-[#C9A66B] shrink-0" />
                    <span>Dual Statutory Qualification (CA + CMA)</span>
                  </div>
                </div>

                {/* Brief Biography */}
                <p className="font-editorial-body text-xs sm:text-sm text-[#66665E] leading-relaxed border-t border-[#E9E0D2] pt-4">
                  Practicing Chartered Accountant and Cost &amp; Management Accountant with over 10 years of progressive institutional experience spanning Big 4 statutory audit at <strong>Deloitte Haskins &amp; Sells</strong> (field senior on a ₹1,000 Crore IPO) and multinational internal audit leadership at <strong>Ford Motor Company</strong>.
                </p>

                {/* Chambers Contact Lines */}
                <div className="space-y-2 pt-2 border-t border-[#E9E0D2] text-xs font-sans">
                  <div className="flex items-center gap-2 text-[#66665E]">
                    <MapPin className="w-4 h-4 text-[#C9A66B] shrink-0" />
                    <span>Chambers: Bairagi Patteda, Tirupati – 517501, AP</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#66665E]">
                    <Phone className="w-4 h-4 text-[#C9A66B] shrink-0" />
                    <a
                      href={`tel:${firm.contact.primaryPhoneClean || firm.contact.primaryPhone.replace(/\s+/g, '')}`}
                      className="text-[#183D30] font-semibold hover:text-[#356B50] hover:underline"
                    >
                      {firm.contact.primaryPhone}
                    </a>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-2">
                  <a
                    href={firm.contact.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#356B50] hover:bg-[#183D30] text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs btn-tactile"
                  >
                    <span>Consult CA Kavitha Vijay</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C9A66B]" />
                  </a>
                </div>

              </div>
            </div>

            {/* Right 7 Columns: Career Journey, Honors & Dual Advantage Matrix */}
            <div className="lg:col-span-7 space-y-8 scroll-reveal-right">
              
              {/* Career Journey */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-5 h-5 text-[#356B50]" />
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#183D30]">
                    Institutional Career Background
                  </h3>
                </div>

                <div className="space-y-4">
                  {partner.careerJourney.map((job) => (
                    <div
                      key={job.organization}
                      className="p-5 sm:p-6 rounded-2xl bg-[#FFFDF8] border border-[#E9E0D2] shadow-subtle card-premium-hover scroll-reveal"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-[#E9E0D2] mb-3">
                        <div>
                          <h4 className="font-serif text-base sm:text-lg font-bold text-[#183D30]">
                            {job.role}
                          </h4>
                          <span className="text-xs font-semibold text-[#356B50]">
                            {job.organization}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-[#66665E]">
                          {job.period}
                        </span>
                      </div>
                      <p className="font-editorial-body text-xs text-[#66665E] leading-relaxed">
                        {job.highlights[0]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Corporate Awards & Distinctions */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-5 h-5 text-[#C9A66B]" />
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#183D30]">
                    Corporate Honors &amp; Merit Distinctions
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {partner.awards.map((award) => (
                    <div
                      key={award.title}
                      className="p-4 rounded-xl bg-[#FFFDF8] border border-[#E9E0D2] shadow-subtle flex flex-col justify-between"
                    >
                      <div>
                        <span className="font-editorial-meta text-[10px] text-[#C9A66B] font-bold uppercase block mb-1">
                          {award.category}
                        </span>
                        <h4 className="font-serif text-sm font-bold text-[#183D30] leading-snug">
                          {award.title}
                        </h4>
                      </div>
                      <span className="text-[11px] text-[#66665E] mt-3 pt-2 border-t border-[#E9E0D2]">
                        {award.organization}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dual Qualification Advantage Matrix Table (Wrapped in overflow-x-auto for Test Invariant) */}
              <div className="p-6 rounded-2xl bg-[#FFFDF8] border border-[#E9E0D2] shadow-subtle space-y-4">
                <div>
                  <span className="font-editorial-meta text-[10px] uppercase tracking-wider text-[#C9A66B] font-bold block mb-1">
                    Dual Competence Model
                  </span>
                  <h4 className="font-serif text-lg font-bold text-[#183D30]">
                    The Dual CA + CMA Statutory &amp; Strategic Advantage
                  </h4>
                  <p className="text-xs text-[#66665E] mt-1">
                    How dual certification creates a balanced governance framework for our clients.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans border-collapse">
                    <thead>
                      <tr className="border-b border-[#E9E0D2] text-[#183D30] font-semibold">
                        <th className="py-2.5 pr-4">Dimension</th>
                        <th className="py-2.5 px-4 text-[#356B50]">Chartered Accountant (CA)</th>
                        <th className="py-2.5 pl-4 text-[#C9A66B]">Cost Accountant (CMA AIR 49)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E9E0D2]/60 text-[#66665E]">
                      <tr>
                        <td className="py-2.5 pr-4 font-semibold text-[#183D30]">Statutory Focus</td>
                        <td className="py-2.5 px-4">Mandatory Audit, Tax, ROC &amp; ICAI Compliance</td>
                        <td className="py-2.5 pl-4">Cost Governance, Efficiency &amp; Margin Planning</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 pr-4 font-semibold text-[#183D30]">Time Horizon</td>
                        <td className="py-2.5 px-4">Historical Verification &amp; Annual True and Fair View</td>
                        <td className="py-2.5 pl-4">Forward-Looking Unit Economics &amp; Working Capital</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 pr-4 font-semibold text-[#183D30]">Client Impact</td>
                        <td className="py-2.5 px-4">Complete Legal Immunity &amp; Clean Audit Reports</td>
                        <td className="py-2.5 pl-4">Operational Cash Flow Visibility &amp; Scalability</td>
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
          SECTION 5: AREAS OF EXPERTISE (Refined 6-Discipline Grid)
          ========================================================================= */}
      <section className="py-14 sm:py-20 bg-[#FBF7EF] border-b border-[#E9E0D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 scroll-reveal">
            <span className="font-editorial-meta text-xs uppercase tracking-wider text-[#C9A66B] font-semibold block mb-2">
              Practice Domains
            </span>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-bold text-[#183D30]">
              Areas of Expertise
            </h2>
            <p className="font-editorial-body text-xs sm:text-sm text-[#66665E] mt-2">
              Comprehensive accounting, tax, assurance, and advisory services tailored to businesses across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 scroll-stagger">
            
            {/* 1. Audit and Assurance */}
            <div className="p-6 rounded-2xl bg-[#FFFDF8] border border-[#E9E0D2] shadow-subtle card-premium-hover flex flex-col justify-between scroll-reveal">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#356B50]/10 text-[#356B50] flex items-center justify-center mb-4 border border-[#356B50]/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#183D30] mb-2">
                  Audit and Assurance
                </h3>
                <p className="font-editorial-body text-xs text-[#66665E] leading-relaxed">
                  Statutory opinions, internal financial controls (ICFR), CARO 2020 verification, and Section 44AB tax audits conducted under mandatory ICAI Standards on Auditing.
                </p>
              </div>
              <Link
                to="/services/audit-assurance"
                className="mt-5 pt-3 border-t border-[#E9E0D2] inline-flex items-center gap-1.5 text-xs font-semibold text-[#356B50] hover:text-[#183D30]"
              >
                <span>Explore Audit Practice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 2. Taxation */}
            <div className="p-6 rounded-2xl bg-[#FFFDF8] border border-[#E9E0D2] shadow-subtle card-premium-hover flex flex-col justify-between scroll-reveal">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#356B50]/10 text-[#356B50] flex items-center justify-center mb-4 border border-[#356B50]/20">
                  <Calculator className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#183D30] mb-2">
                  Taxation
                </h3>
                <p className="font-editorial-body text-xs text-[#66665E] leading-relaxed">
                  Direct tax advisory, corporate return filing, advance tax structuring, capital gains computation, and faceless departmental scrutiny defense.
                </p>
              </div>
              <Link
                to="/services/income-tax-consultant-tirupati"
                className="mt-5 pt-3 border-t border-[#E9E0D2] inline-flex items-center gap-1.5 text-xs font-semibold text-[#356B50] hover:text-[#183D30]"
              >
                <span>Explore Tax Advisory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 3. GST and Compliance */}
            <div className="p-6 rounded-2xl bg-[#FFFDF8] border border-[#E9E0D2] shadow-subtle card-premium-hover flex flex-col justify-between scroll-reveal">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#356B50]/10 text-[#356B50] flex items-center justify-center mb-4 border border-[#356B50]/20">
                  <Receipt className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#183D30] mb-2">
                  GST and Compliance
                </h3>
                <p className="font-editorial-body text-xs text-[#66665E] leading-relaxed">
                  Periodic GST return filing (GSTR-1, 3B, 9), Input Tax Credit (ITC) reconciliation, departmental notice response, and indirect tax health checks.
                </p>
              </div>
              <Link
                to="/services/gst-consultant-tirupati"
                className="mt-5 pt-3 border-t border-[#E9E0D2] inline-flex items-center gap-1.5 text-xs font-semibold text-[#356B50] hover:text-[#183D30]"
              >
                <span>Explore GST Services</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 4. Business Advisory */}
            <div className="p-6 rounded-2xl bg-[#FFFDF8] border border-[#E9E0D2] shadow-subtle card-premium-hover flex flex-col justify-between scroll-reveal">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#356B50]/10 text-[#356B50] flex items-center justify-center mb-4 border border-[#356B50]/20">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#183D30] mb-2">
                  Business Advisory
                </h3>
                <p className="font-editorial-body text-xs text-[#66665E] leading-relaxed">
                  Company formation (Private Limited, LLP), DPIIT Startup India enrollment, ROC secretarial compliance, and corporate restructuring.
                </p>
              </div>
              <Link
                to="/services/company-registration-tirupati"
                className="mt-5 pt-3 border-t border-[#E9E0D2] inline-flex items-center gap-1.5 text-xs font-semibold text-[#356B50] hover:text-[#183D30]"
              >
                <span>Explore Corporate Setup</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 5. Internal Audit */}
            <div className="p-6 rounded-2xl bg-[#FFFDF8] border border-[#E9E0D2] shadow-subtle card-premium-hover flex flex-col justify-between scroll-reveal">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#356B50]/10 text-[#356B50] flex items-center justify-center mb-4 border border-[#356B50]/20">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#183D30] mb-2">
                  Internal Audit
                </h3>
                <p className="font-editorial-body text-xs text-[#66665E] leading-relaxed">
                  Enterprise risk evaluations, process controls testing, operating variance diagnostics, and corporate governance reviews modeled on global standards.
                </p>
              </div>
              <Link
                to="/services/audit-assurance"
                className="mt-5 pt-3 border-t border-[#E9E0D2] inline-flex items-center gap-1.5 text-xs font-semibold text-[#356B50] hover:text-[#183D30]"
              >
                <span>Explore Risk Audits</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 6. Financial Consulting */}
            <div className="p-6 rounded-2xl bg-[#FFFDF8] border border-[#E9E0D2] shadow-subtle card-premium-hover flex flex-col justify-between scroll-reveal">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#356B50]/10 text-[#356B50] flex items-center justify-center mb-4 border border-[#356B50]/20">
                  <LineChart className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#183D30] mb-2">
                  Financial Consulting
                </h3>
                <p className="font-editorial-body text-xs text-[#66665E] leading-relaxed">
                  Virtual CFO leadership, Bank Loan CMA project data, cash flow forecasting, unit cost modeling, and executive board counsel.
                </p>
              </div>
              <Link
                to="/services/virtual-cfo-tirupati"
                className="mt-5 pt-3 border-t border-[#E9E0D2] inline-flex items-center gap-1.5 text-xs font-semibold text-[#356B50] hover:text-[#183D30]"
              >
                <span>Explore Virtual CFO</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: PAN-INDIA POSITIONING (Elegant Representation)
          ========================================================================= */}
      <section className="py-14 sm:py-20 bg-[#FFFDF8] border-b border-[#E9E0D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-8 sm:p-10 lg:p-12 bg-[#FBF7EF] border border-[#E9E0D2] shadow-subtle">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-4">
                <span className="font-editorial-meta text-xs uppercase tracking-wider text-[#C9A66B] font-semibold block">
                  National Representation
                </span>
                <h2 className="font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl font-bold text-[#183D30]">
                  Professional Guidance, Across India.
                </h2>
                <p className="font-editorial-body text-base text-[#66665E] leading-relaxed">
                  Connecting with businesses and individuals across India through professional financial and advisory services.
                </p>
                <p className="font-editorial-body text-xs sm:text-sm text-[#66665E] leading-relaxed">
                  From our principal chambers in Tirupati, Andhra Pradesh, we leverage modern cloud audit pipelines and virtual workspaces to provide seamless, confidential, and timely statutory counsel to clients across all States and Union Territories.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#356B50]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 motion-safe:animate-pulse" />
                  <span>Pan-India Remote Consultations &amp; Secure Digital Working Papers</span>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden border border-[#E9E0D2] shadow-xs bg-[#FFFDF8] p-2">
                  <img
                    src="/images/about/leadership-space.webp"
                    alt="Pan-India Corporate Consultation Environment"
                    width="600"
                    height="335"
                    loading="lazy"
                    className="w-full h-48 sm:h-56 object-cover rounded-xl"
                  />
                  <div className="pt-2 px-1 flex items-center justify-between text-[11px] text-[#66665E]">
                    <span>Remote &amp; In-Person Engagements</span>
                    <span className="font-semibold text-[#356B50]">Serving Clients Across India</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: CONSULTATION CTA & ETHICAL STANDARDS
          ========================================================================= */}
      <section className="py-14 sm:py-20 bg-[#FBF7EF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 scroll-reveal">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#183D30] text-[#C9A66B] font-editorial-meta text-xs border border-[#C9A66B]/40 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#C9A66B] motion-safe:animate-pulse" />
            <span className="tracking-widest uppercase font-semibold">GET IN TOUCH</span>
          </div>

          <h2 className="font-editorial-h2 text-2xl sm:text-3xl md:text-4xl font-bold text-[#183D30]">
            Let's Discuss Your Business Needs.
          </h2>

          <p className="font-editorial-body text-base text-[#66665E] max-w-2xl mx-auto leading-relaxed">
            Connect with our team to discuss your audit, taxation, compliance and advisory requirements.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="min-h-[48px] inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#356B50] hover:bg-[#183D30] text-white font-editorial-meta text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm hover:shadow-md border border-[#C9A66B]/40 btn-tactile"
            >
              <span>Book a Consultation</span>
              <ArrowRight className="w-4 h-4 text-[#C9A66B]" />
            </Link>

            <a
              href={`tel:${firm.contact.primaryPhoneClean || firm.contact.primaryPhone.replace(/\\s+/g, '')}`}
              className="min-h-[48px] inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#FFFDF8] hover:bg-[#F2E8D5] text-[#183D30] font-editorial-meta text-xs font-semibold tracking-wider uppercase transition-colors border border-[#E9E0D2] shadow-subtle btn-tactile"
            >
              <Phone className="w-4 h-4 text-[#C9A66B]" />
              <span>Call Senior Partner</span>
            </a>
          </div>

          {/* ICAI Code of Ethics Disclaimer */}
          <div className="mt-10 p-5 rounded-2xl bg-[#FFFDF8] border border-[#E9E0D2] text-xs text-[#66665E] max-w-2xl mx-auto text-left flex items-start gap-3.5 shadow-subtle">
            <Shield className="w-5 h-5 text-[#C9A66B] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-[#183D30] block font-semibold">
                Regulatory Standards &amp; ICAI Code of Ethics
              </strong>
              <p className="leading-relaxed">
                In strict accordance with the Chartered Accountants Act, 1949 and the Code of Ethics prescribed by the Institute of Chartered Accountants of India (ICAI), this website is maintained solely for providing verified professional information and does not constitute soliciting or advertising.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
"""

with open('src/pages/AboutPage.tsx', 'w', encoding='utf-8') as f:
    f.write(new_about_content)

print("Updated AboutPage.tsx successfully!")
