import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Award, 
  Briefcase, 
  GraduationCap, 
  FileCheck2, 
  ArrowRight, 
  Home,
  ChevronRight
} from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';
import { Badge } from '../components/common/Badge';
import { CrestMonogram } from '../components/common/CrestMonogram';
import { useFirmProfile } from '../adapters/backendAdapter';
import { Reveal, StaggerContainer, StaggerItem } from '../components/animation';

export const LeadershipPage: React.FC = () => {
  const firmProfile = useFirmProfile();
  const { contact } = firmProfile;

  return (
    <div className="bg-[#F1EBDD] text-[#35271F] min-h-screen texture-warm-ivory page-reveal">
      <SEOHead
        title="Leadership & Credentials | Kavitha & Associates Chartered Accountants"
        description="Professional credentials and career background of CA Kavitha Vijay (B.Com, CA, CMA AIR 49 ICMAI), Managing Partner of Kavitha & Associates in Tirupati."
        canonicalPath="/leadership"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'The Firm', path: '/about' },
          { name: 'Leadership & Credentials', path: '/leadership' },
        ]}
      />

      {/* Header Plaque */}
      <section className="bg-[#071B14] text-[#F1EBDD] pt-12 sm:pt-16 pb-16 sm:pb-20 border-b border-[#B49A64]/25 texture-architectural-lines relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <Reveal delay={60} duration={650}>
            <div>
              {/* Breadcrumbs */}
              <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[#AAB4A0]">
                <Link to="/" className="inline-flex items-center gap-1.5 hover:text-[#F1EBDD] transition-colors py-1">
                  <Home className="w-3.5 h-3.5 text-[#B49A64]" />
                  <span>Home</span>
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-[#B49A64]/40" />
                <Link to="/about" className="hover:text-[#F1EBDD] transition-colors py-1">
                  <span>The Firm</span>
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-[#B49A64]/40" />
                <span className="text-[#B49A64] font-medium" aria-current="page">
                  Leadership &amp; Credentials
                </span>
              </nav>

              <div className="max-w-3xl space-y-4">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <Badge variant="kicker">PRACTICE LEADERSHIP</Badge>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B241C] border border-[#B49A64]/30 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[#B49A64]" />
                    <span className="text-[10px] sm:text-xs font-semibold text-[#B49A64] tracking-wider uppercase">
                      VERIFIED STATUTORY CREDENTIALS
                    </span>
                  </div>
                </div>

                <h1 className="font-editorial-h1 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#F1EBDD] leading-[1.15]">
                  Leadership, Audit Pedigree &amp; Professional Governance
                </h1>

                <p className="font-editorial-body text-sm sm:text-base text-[#D8D0BE] max-w-2xl leading-relaxed border-l-2 border-[#B49A64]/40 pl-4">
                  Direct partner supervision, rigorous Standards on Auditing (SAs) compliance, and institutional-grade financial counsel led by CA Kavitha Vijay.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Main Leadership Profile Surface */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Reveal delay={100} duration={650}>
          {/* Core Credentials Plaque */}
          <div className="bg-[#FAF7F0] rounded-2xl border border-[#D8D0BE] p-6 sm:p-10 shadow-sm mb-12 transition-all duration-300 hover:border-[#B49A64]/60">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-[#D8D0BE]/70 pb-8">
              
              {/* Left Column: Verified Executive Partner Portrait with CA India Crest Badge */}
              <div className="md:col-span-4 flex flex-col items-center justify-center">
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl bg-[#071B14] border-2 border-[#B49A64]/60 p-2 shadow-xl overflow-hidden relative group">
                  <div className="w-full h-full rounded-xl overflow-hidden border border-[#B49A64]/40 bg-[#0B241C] relative">
                    <picture className="w-full h-full">
                      <source srcSet="/images/partner/ca-kavitha-vijay-official.webp" type="image/webp" />
                      <img
                        src="/images/partner/ca-kavitha-vijay-official.jpg"
                        alt="CA Kavitha Vijay - Managing Partner"
                        width="400"
                        height="400"
                        loading="eager"
                        className="w-full h-full object-cover object-top"
                      />
                    </picture>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071B14]/40 via-transparent to-transparent pointer-events-none" />
                    {/* Official CA India Crest Monogram Badge */}
                    <div className="absolute bottom-2 right-2" title="Official CA India Emblem">
                      <CrestMonogram variant="compact" size="sm" className="shadow-md border-[#B49A64]" />
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-[#525954] mt-2.5 text-center italic font-medium">
                  CA Kavitha Vijay · Managing Partner
                </p>
              </div>

              {/* Right Column: Key Statutory Titles & Honors */}
              <div className="md:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#7E5E1E] bg-[#F1EBDD] px-3 py-1 rounded-md border border-[#D8D0BE]">
                    MANAGING PARTNER
                  </span>
                  <span className="font-mono text-xs font-bold text-[#183529] bg-emerald-100/80 px-3 py-1 rounded-md border border-emerald-300">
                    CMA ALL INDIA RANK 49 (ICMAI)
                  </span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#35271F] leading-tight">
                  CA Kavitha Vijay
                </h2>

                <p className="font-editorial-meta text-sm font-semibold text-[#7E5E1E]">
                  B.Com, Chartered Accountant (ICAI) &amp; Cost Accountant (ICMAI AIR 49)
                </p>

                <p className="font-editorial-body text-sm sm:text-base text-[#525954] leading-relaxed">
                  Practicing Chartered Accountant with extensive statutory audit and advisory experience spanning Big 4 assurance (Deloitte Haskins &amp; Sells), corporate multinational controllership (Ford Motor Company), and mid-market advisory. Specializes in statutory audits under Companies Act 2013, corporate tax litigation, GST compliance protocols, and strategic Virtual CFO retainerships.
                </p>

                {/* Direct Metrics Strip */}
                <StaggerContainer staggerMs={60} className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <StaggerItem index={0} distance={12} durationMs={450}>
                    <div className="p-3 rounded-xl bg-[#F1EBDD] border border-[#D8D0BE] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B49A64]/60">
                      <span className="text-[10px] uppercase font-bold text-[#7E5E1E] block font-editorial-meta">Experience</span>
                      <span className="font-serif text-sm font-bold text-[#35271F]">10+ Years</span>
                    </div>
                  </StaggerItem>
                  <StaggerItem index={1} distance={12} durationMs={450}>
                    <div className="p-3 rounded-xl bg-[#F1EBDD] border border-[#D8D0BE] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B49A64]/60">
                      <span className="text-[10px] uppercase font-bold text-[#7E5E1E] block font-editorial-meta">Audit Pedigree</span>
                      <span className="font-serif text-sm font-bold text-[#35271F]">Deloitte Big 4</span>
                    </div>
                  </StaggerItem>
                  <StaggerItem index={2} distance={12} durationMs={450}>
                    <div className="p-3 rounded-xl bg-[#F1EBDD] border border-[#D8D0BE] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B49A64]/60">
                      <span className="text-[10px] uppercase font-bold text-[#7E5E1E] block font-editorial-meta">CMA Rank</span>
                      <span className="font-serif text-sm font-bold text-[#35271F]">AIR 49 (ICMAI)</span>
                    </div>
                  </StaggerItem>
                  <StaggerItem index={3} distance={12} durationMs={450}>
                    <div className="p-3 rounded-xl bg-[#F1EBDD] border border-[#D8D0BE] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B49A64]/60">
                      <span className="text-[10px] uppercase font-bold text-[#7E5E1E] block font-editorial-meta">Practice Base</span>
                      <span className="font-serif text-sm font-bold text-[#35271F]">Tirupati, AP</span>
                    </div>
                  </StaggerItem>
                </StaggerContainer>

              </div>

            </div>

            {/* Institutional Career History & Education */}
            <div className="mt-8 pt-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Professional Audit & Corporate History */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#B49A64]" />
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#35271F]">
                    Professional Career Record
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-[#F8EFDF] border border-[#D8D0BE]/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B49A64]/60">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-sm font-bold text-[#35271F]">Deloitte Haskins &amp; Sells</span>
                      <span className="text-[11px] font-mono text-[#7E5E1E]">Senior Audit Team</span>
                    </div>
                    <p className="font-editorial-body text-xs text-[#525954] mt-1">
                      Statutory assurance, internal controls testing (IFCoFR), and CARO reporting for major corporate entities across manufacturing and consumer sectors.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8EFDF] border border-[#D8D0BE]/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B49A64]/60">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-sm font-bold text-[#35271F]">Ford Motor Company</span>
                      <span className="text-[11px] font-mono text-[#7E5E1E]">Financial Controls</span>
                    </div>
                    <p className="font-editorial-body text-xs text-[#525954] mt-1">
                      Corporate accounting oversight, internal financial governance, cost optimization, and multinational controllership.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8EFDF] border border-[#D8D0BE]/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B49A64]/60">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-sm font-bold text-[#35271F]">Manohar Chowdhry &amp; Associates</span>
                      <span className="text-[11px] font-mono text-[#7E5E1E]">Chartered Accountants</span>
                    </div>
                    <p className="font-editorial-body text-xs text-[#525954] mt-1">
                      Direct tax compliance, transfer pricing review, appellate documentation, and bank concurrent audits.
                    </p>
                  </div>
                </div>
              </div>

              {/* Academic & Professional Qualifications */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#B49A64]" />
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#35271F]">
                    Qualifications &amp; Honors
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-[#F8EFDF] border border-[#D8D0BE]/70 flex items-start gap-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B49A64]/60">
                    <Award className="w-5 h-5 text-[#B49A64] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-serif text-sm font-bold text-[#35271F] block">
                        All India Rank 49 (AIR 49) in CMA Intermediate — ICMAI
                      </span>
                      <p className="font-editorial-body text-xs text-[#525954] mt-0.5">
                        National merit rank awarded in the CMA Intermediate Examination by The Institute of Cost Accountants of India (ICMAI), demonstrating mastery of industrial cost structures and financial modeling.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8EFDF] border border-[#D8D0BE]/70 flex items-start gap-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B49A64]/60">
                    <ShieldCheck className="w-5 h-5 text-[#B49A64] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-serif text-sm font-bold text-[#35271F] block">
                        Chartered Accountant — ICAI
                      </span>
                      <p className="font-editorial-body text-xs text-[#525954] mt-0.5">
                        Member of The Institute of Chartered Accountants of India (ICAI). Practicing statutory auditor authorized under Section 139 of the Companies Act 2013.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8EFDF] border border-[#D8D0BE]/70 flex items-start gap-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#B49A64]/60">
                    <FileCheck2 className="w-5 h-5 text-[#B49A64] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-serif text-sm font-bold text-[#35271F] block">
                        Bachelor of Commerce (B.Com)
                      </span>
                      <p className="font-editorial-body text-xs text-[#525954] mt-0.5">
                        Rigorous academic foundation in financial accounting, auditing, commercial law, and taxation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Action & Consultation Strip */}
            <div className="mt-8 pt-6 border-t border-[#D8D0BE]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#7E5E1E] block font-mono">
                  PRACTICE ADVISORY CONSULTATION
                </span>
                <p className="text-xs text-[#525954] mt-0.5">
                  Direct partner discussions on statutory audit scopes, corporate tax defense, or Virtual CFO retainerships.
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#183529] hover:bg-[#071B14] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md min-h-[44px]"
                >
                  <span>Request Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#B49A64]" />
                </Link>
                <a
                  href={contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#D8D0BE] bg-[#F1EBDD] hover:bg-[#FAF7F0] text-[#35271F] text-xs font-semibold transition-colors min-h-[44px]"
                >
                  <span>WhatsApp Desk</span>
                </a>
              </div>
            </div>

          </div>
        </Reveal>

      </main>
    </div>
  );
};

export default LeadershipPage;
