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
  Compass,
  Phone,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { FIRM_DATA } from '../../data/firmData';
import { SEOHead } from '../../components/SEOHead';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Reveal } from '../components/animation';

export const IndustriesPage: React.FC = () => {
  const firm = FIRM_DATA;

  const industryProfiles = [
    {
      id: 'startups',
      name: 'Startups & Emerging Ventures',
      sectorKicker: 'Venture & Tech',
      icon: Rocket,
      statuteBadge: 'Sec 80-IAC • DPIIT',
      focus: 'Entity incorporation (Pvt Ltd / LLP), DPIIT startup recognition, Section 80-IAC three-year income tax holiday, Cap Table Valuation Advisory, ESOP structuring, and investor due diligence readiness.',
      statutoryFoci: [
        'Section 80-IAC 100% Tax Holiday Certification',
        'DPIIT Recognition & Section 80-IAC Tax Holiday',
        'Cap Table Structuring & ESOP Plan Governance',
        'Pre-Series A / Series A Financial Due Diligence'
      ]
    },
    {
      id: 'msmes',
      name: 'MSMEs & Family Businesses',
      sectorKicker: 'Enterprise & Trade',
      icon: Building2,
      statuteBadge: 'Sec 43B(h) • Udyam',
      focus: 'Udyam registration, strict Section 43B(h) 45-day vendor payment disallowance compliance, priority sector lending (PSL) documentation, statutory turnover audits, internal financial controls, and working capital CMA data optimization.',
      statutoryFoci: [
        'Section 43B(h) 45-Day Micro/Small Payment Audit',
        'CMA Data & Bank Project Reports for Working Capital',
        'Statutory Tax Audit Threshold Assessment',
        'Internal Financial Controls (ICFR) Implementation'
      ]
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing & Industrial',
      sectorKicker: 'Heavy & Process Industry',
      icon: Factory,
      statuteBadge: 'CARO 2020 • Ind AS 2',
      focus: 'Unit-cost accounting by qualified CMA (AIR 49 ICMAI), CARO 2020 Clause (ii) physical stock verification, Ind AS 2 inventory valuation, capital goods Input Tax Credit (ITC) optimization under Section 143 of CGST Act, and factory cost audits.',
      statutoryFoci: [
        'CARO 2020 Physical Inventory Verification',
        'CMA Unit-Cost & Margin Leakage Modeling',
        'Section 143 Job-Work ITC Reconciliations',
        'Drawing Power (DP) Bank Audit Certificates'
      ]
    },
    {
      id: 'real-estate',
      name: 'Real Estate & Infrastructure',
      sectorKicker: 'Builders & Developers',
      icon: Home,
      statuteBadge: 'RERA Form 3 • Sec 45(5A)',
      focus: 'AP/TN RERA project registration, quarterly compliance returns, mandatory Form 3 CA escrow 70% withdrawal certificates under Section 4(2)(l)(D), Joint Development Agreement (JDA) capital gains structuring under Section 45(5A), and Ind AS 115 percentage-of-completion revenue recognition.',
      statutoryFoci: [
        'RERA Form 3 CA Escrow Withdrawal Certificates',
        'Section 45(5A) Joint Development Agreement (JDA) Tax',
        'Ind AS 115 Percentage-of-Completion Audit',
        'Quarterly RERA Financial Compliance Filings'
      ]
    },
    {
      id: 'retail',
      name: 'Retail & Distribution',
      sectorKicker: 'Commerce & FMCG',
      icon: ShoppingCart,
      statuteBadge: 'Multi-Branch GST • GSTR-2B',
      focus: 'Multi-branch GST reconciliation, point-of-sale (POS) inventory accounting, supply chain tax structuring, GSTR-2B vs 3B ITC matching, shrinkage audits, and periodic stock ledger verification.',
      statutoryFoci: [
        'Multi-State & Multi-Branch GST Reconciliation',
        'Point-of-Sale (POS) Perpetual Inventory Audits',
        'GSTR-2B Automated ITC Matching & Vendor Scrutiny',
        'Store Shrinkage & Inventory Leakage Controls'
      ]
    },
    {
      id: 'healthcare',
      name: 'Healthcare & Pharmaceuticals',
      sectorKicker: 'Hospitals & Diagnostics',
      icon: Stethoscope,
      statuteBadge: 'Sec 194J TDS • Sec 12AB',
      focus: 'Hospital accounting, doctor consultancy TDS withholding under Section 194J, pharmaceutical batch inventory audits, hospital equipment depreciation schedules, and Section 12AB tax exemptions for charitable healthcare trusts.',
      statutoryFoci: [
        'Section 194J Professional TDS Compliance for Doctors',
        'Pharma Batch Expiry & Stock Valuation Audits',
        'Section 12AB Trust Registrations for Hospitals',
        'Biomedical Equipment Depreciation Schedules'
      ]
    },
    {
      id: 'education',
      name: 'Education & Academic Institutions',
      sectorKicker: 'Schools & Universities',
      icon: GraduationCap,
      statuteBadge: 'Sec 12AB • Form 10B/10BB',
      focus: 'Section 12AB and 80G registrations for educational trusts, Form 10B/10BB electronic audit filings, Foreign Contribution Regulation Act (FCRA) compliance, student fee accounting, and statutory annual audit filings.',
      statutoryFoci: [
        'Form 10B / 10BB Electronic Audit Report Filings',
        'Section 12AB & 80G Re-Registration Renewals',
        'Section 11(2) 85% Mandatory Income Accumulation',
        'FCRA Foreign Grant Utilization Certifications'
      ]
    },
    {
      id: 'ecommerce',
      name: 'E-Commerce & Digital Commerce',
      sectorKicker: 'Marketplaces & D2C',
      icon: Globe,
      statuteBadge: 'Sec 52 TCS • Sec 194-O',
      focus: 'Tax Collected at Source (TCS) compliance under GST Section 52, 1% withholding under Section 194-O, multi-state GST registrations for Amazon/Flipkart fulfilment centers, payment gateway reconciliations, and Equalisation Levy advisory.',
      statutoryFoci: [
        'GST Section 52 Marketplace TCS Monthly Reporting',
        'Section 194-O E-Commerce Participant Withholding',
        'Principal Place of Business (PPOB/APOB) in Fulfilment Hubs',
        'Payment Gateway Settlement Reconciliations'
      ]
    },
    {
      id: 'professionals',
      name: 'Professionals & Consultants',
      sectorKicker: 'Doctors, Architects, Tech',
      icon: UserCheck,
      statuteBadge: 'Sec 44ADA Presumptive',
      focus: 'Presumptive taxation under Section 44ADA up to ₹75 lakhs gross receipts (offering 50% deemed profit), quarterly advance tax scheduling, GST Letter of Undertaking (LUT) for IT service exports, and wealth protection.',
      statutoryFoci: [
        'Section 44ADA 50% Deemed Profit Scheme Planning',
        'Quarterly Advance Tax Scheduling (15/45/75/100%)',
        'GST Letter of Undertaking (LUT) for Zero-Rated Exports',
        'Personal Wealth & Capital Gains Asset Structuring'
      ]
    },
    {
      id: 'ngos',
      name: 'NGOs, Societies & Public Trusts',
      sectorKicker: 'Charities & Social Sector',
      icon: HeartHandshake,
      statuteBadge: 'Form 10A/10AB • CSR Audits',
      focus: 'Trust incorporation, Form 10A / 10AB five-year re-registrations, Section 11 and 12 income exemptions, 85% mandatory income application rule under Section 11(2), CSR project fund audit certifications, and FCRA filings.',
      statutoryFoci: [
        'Form 10A / 10AB Trust Re-Registration under New Law',
        'Section 11(1)(a) & 11(2) Accumulation Tracking',
        'Corporate Social Responsibility (CSR) Fund Audits',
        'Form 10BD Donor Certificate Filings'
      ]
    }
  ];

  return (
    <div className="bg-[#F1EBDD] text-[#35271F] min-h-screen page-reveal">
      <SEOHead
        title="Industry Accounting & Tax Solutions in Tirupati | Kavitha & Associates"
        description="Sector-specific Chartered Accountancy expertise in Tirupati for Startups, MSMEs, Manufacturing, Real Estate, Retail, Healthcare, and Education sectors."
        canonicalPath="/industries"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Industries', path: '/industries' }
        ]}
      />

      {/* 1. Header Banner */}
      <section className="bg-[#071B14] text-[#F1EBDD] py-12 sm:py-16 md:py-20 border-b border-[#B49A64]/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal delay={60} duration={650}>
            <div>
              <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[#AAB4A0]">
                <Link to="/" className="inline-flex items-center gap-1.5 hover:text-[#F1EBDD] transition-colors min-h-[44px]">
                  <Home className="w-3.5 h-3.5 text-[#B49A64]" />
                  <span>Home</span>
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-[#B49A64]/50" />
                <span className="text-[#B49A64] font-semibold">Industries</span>
              </nav>

              <div className="max-w-3xl space-y-4">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <Badge variant="kicker">05 / COMMERCIAL VERTICALS</Badge>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B241C] border border-[#B49A64]/30 text-xs text-[#B49A64]">
                    <Building2 className="w-4 h-4 text-[#B49A64] shrink-0" />
                    <span>Specialized Frameworks • 10 Commercial Domains</span>
                  </div>
                </div>

                <h1 className="font-editorial-h1 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#F1EBDD] leading-tight">
                  Tailored Statutory Governance. Sector-Specific Precision.
                </h1>

                <p className="font-editorial-body text-sm sm:text-base text-[#F1EBDD]/80 leading-relaxed">
                  Every industry operates under distinct legislative provisions, statutory audit thresholds, and tax compliance cycles. Our practice customizes audit programs and financial controllership to the specific regulatory demands of your sector.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. Sticky Sector Quick-Jump Strip */}
      <nav 
        aria-label="Industries Quick Navigation" 
        className="bg-[#FAF7F0]/95 py-3 border-b border-[#D8D0BE] sticky top-[57px] sm:top-[65px] z-30 shadow-xs backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-1">
            <span className="font-mono text-xs text-[#7E5E1E] font-semibold shrink-0 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#B49A64]" />
              <span>Sector Quick Jump:</span>
            </span>
            <div className="flex items-center gap-2 shrink-0">
              {industryProfiles.map((sector) => (
                <a
                  key={sector.id}
                  href={`#${sector.id}`}
                  className="min-h-[44px] inline-flex items-center px-3.5 py-2 rounded-full bg-[#F1EBDD] border border-[#D8D0BE] text-xs font-semibold text-[#183529] hover:border-[#B49A64] hover:text-[#071B14] transition-colors btn-tactile"
                >
                  {sector.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* 3. 10 Detailed Sector Profiles */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {industryProfiles.map((sector, idx) => {
            const SectorIcon = sector.icon;
            return (
              <Reveal key={sector.id} delay={60 + (idx % 4) * 30} duration={650}>
                <div
                  id={sector.id}
                  className="scroll-mt-32 p-6 sm:p-10 lg:p-12 rounded-2xl border border-[#D8D0BE] bg-[#FAF7F0] shadow-card relative transition-all duration-300 hover:border-[#B49A64]/60 hover:shadow-editorial"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                    
                    {/* Left 6 Columns */}
                    <div className="lg:col-span-6 space-y-4">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#183529]/10 text-[#183529] font-mono text-xs font-semibold border border-[#183529]/20">
                          Sector 0{idx + 1} • {sector.sectorKicker}
                        </span>
                        <span className="font-mono text-[11px] text-[#7E5E1E] bg-[#F1EBDD] px-2.5 py-0.5 rounded-full border border-[#D8D0BE]">
                          {sector.statuteBadge}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#183529] text-[#B49A64] flex items-center justify-center shrink-0 border border-[#B49A64]/30">
                          <SectorIcon className="w-5 h-5" />
                        </div>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#183529]">
                          {sector.name}
                        </h2>
                      </div>

                      <p className="font-editorial-body text-xs sm:text-sm text-[#525954] leading-relaxed">
                        {sector.focus}
                      </p>

                      <div className="pt-2">
                        <Button to="/contact" variant="primary" size="sm" dualArrow className="min-h-[44px]">
                          Consult for {sector.name}
                        </Button>
                      </div>
                    </div>

                    {/* Right 6 Columns: Statutory Foci */}
                    <div className="lg:col-span-6 bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#D8D0BE] shadow-xs space-y-4">
                      <h3 className="font-serif text-sm font-bold text-[#183529] uppercase tracking-wider border-b border-[#D8D0BE] pb-2">
                        Primary Compliance &amp; Audit Focus
                      </h3>
                      <div className="space-y-2.5">
                        {sector.statutoryFoci.map((focusItem, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF7F0] border border-[#D8D0BE]/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B49A64]/40">
                            <CheckCircle2 className="w-4 h-4 text-[#183529] shrink-0 mt-0.5" />
                            <span className="text-xs text-[#35271F] font-medium leading-relaxed">
                              {focusItem}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* 4. Cross-Sector Compliance Matrix Table */}
      <section className="py-12 sm:py-16 bg-[#FAF7F0] border-t border-[#D8D0BE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <Reveal delay={60} duration={650}>
            <div className="max-w-3xl space-y-2">
              <Badge variant="gold">COMPARATIVE STATUTORY MATRIX</Badge>
              <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-serif font-bold text-[#183529]">
                Cross-Sector Compliance &amp; Audit Thresholds
              </h2>
              <p className="font-editorial-body text-xs sm:text-sm text-[#525954]">
                Key filing deadlines, audit thresholds, and governing statutes across primary commercial verticals.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100} duration={650}>
            <div className="overflow-x-auto rounded-2xl border border-[#D8D0BE] bg-[#FFFFFF] shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAF7F0] border-b border-[#D8D0BE] text-[#7E5E1E] font-mono">
                    <th className="py-3.5 px-5">Commercial Sector</th>
                    <th className="py-3.5 px-5 text-[#183529]">Primary Governing Statute</th>
                    <th className="py-3.5 px-5">Mandatory Audit Threshold</th>
                    <th className="py-3.5 px-5">Critical Annual Deadline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D0BE]/60 text-[#35271F]">
                  <tr className="transition-colors hover:bg-[#FAF7F0]/60">
                    <td className="py-3.5 px-5 font-semibold text-[#183529]">Startups &amp; Tech</td>
                    <td className="py-3.5 px-5">Income Tax Sec 80-IAC / DPIIT / Companies Act</td>
                    <td className="py-3.5 px-5">Annual Statutory Audit (All Pvt Ltd)</td>
                    <td className="py-3.5 px-5 text-[#525954]">Sept 30 (Audit) / Oct 31 (ITR)</td>
                  </tr>
                  <tr className="transition-colors hover:bg-[#FAF7F0]/60">
                    <td className="py-3.5 px-5 font-semibold text-[#183529]">MSMEs &amp; Trading</td>
                    <td className="py-3.5 px-5">Sec 43B(h) / Income Tax Sec 44AB / CGST</td>
                    <td className="py-3.5 px-5">Turnover &gt; ₹1 Cr (Cash &gt; 5%) / ₹10 Cr</td>
                    <td className="py-3.5 px-5 text-[#525954]">Sept 30 (Tax Audit) / Dec 31 (GSTR-9)</td>
                  </tr>
                  <tr className="transition-colors hover:bg-[#FAF7F0]/60">
                    <td className="py-3.5 px-5 font-semibold text-[#183529]">Manufacturing Units</td>
                    <td className="py-3.5 px-5">CARO 2020 / Ind AS 2 / CGST Sec 143</td>
                    <td className="py-3.5 px-5">Companies Act Statutory + Sec 44AB</td>
                    <td className="py-3.5 px-5 text-[#525954]">Sept 30 (CARO) / Monthly DP</td>
                  </tr>
                  <tr className="transition-colors hover:bg-[#FAF7F0]/60">
                    <td className="py-3.5 px-5 font-semibold text-[#183529]">Real Estate &amp; Builders</td>
                    <td className="py-3.5 px-5">RERA Act 2016 Sec 4(2)(l)(D) / Sec 45(5A)</td>
                    <td className="py-3.5 px-5">Quarterly Project Escrow 70% CA Certificate</td>
                    <td className="py-3.5 px-5 text-[#525954]">Quarterly RERA / Annual Form 5</td>
                  </tr>
                  <tr className="transition-colors hover:bg-[#FAF7F0]/60">
                    <td className="py-3.5 px-5 font-semibold text-[#183529]">Professionals</td>
                    <td className="py-3.5 px-5">Income Tax Sec 44ADA / CGST LUT</td>
                    <td className="py-3.5 px-5">Gross Receipts &gt; ₹75 Lakhs</td>
                    <td className="py-3.5 px-5 text-[#525954]">July 31 (44ADA) / Oct 31 (Audit)</td>
                  </tr>
                  <tr className="transition-colors hover:bg-[#FAF7F0]/60">
                    <td className="py-3.5 px-5 font-semibold text-[#183529]">Trusts &amp; NGOs</td>
                    <td className="py-3.5 px-5">Sec 11, 12AB / Form 10B/10BB / FCRA</td>
                    <td className="py-3.5 px-5">Total Income Exceeds Basic Exemption</td>
                    <td className="py-3.5 px-5 text-[#525954]">Sept 30 (Form 10B) / Oct 31 (ITR-7)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5. Sector Consultation Desk CTA */}
      <section className="py-12 sm:py-16 bg-[#F1EBDD] text-center border-t border-[#D8D0BE]">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <Reveal delay={60} duration={650}>
            <div className="space-y-4">
              <Badge variant="gold">SPECIALIZED INDUSTRY COUNSEL</Badge>
              <h2 className="font-editorial-h2 text-2xl sm:text-4xl font-serif font-bold text-[#183529]">
                Operating in a Regulated Commercial Sector?
              </h2>
              <p className="font-editorial-body text-xs sm:text-sm text-[#525954] max-w-xl mx-auto leading-relaxed">
                We adapt auditing programs, tax withholding schedules, and compliance calendars to match your unique operational risks and statutory framework.
              </p>
              <div className="pt-4 flex justify-center gap-4 flex-wrap">
                <Button to="/contact" variant="primary" size="md" dualArrow className="min-h-[44px]">
                  Connect with Our Practice
                </Button>
                <Button href={`tel:${firm.contact.primaryPhoneClean}`} variant="outline" size="md" leftIcon={<Phone className="w-4 h-4 text-[#B49A64]" />} className="min-h-[44px]">
                  Call Senior Partner
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default IndustriesPage;
