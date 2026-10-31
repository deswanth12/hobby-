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
  ArrowRight,
  Compass,
  Phone
} from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';
import { FIRM_DATA } from '../data/firmData';
import { SEOHead } from '../components/SEOHead';

export const IndustriesPage: React.FC = () => {
  const { data } = useFirmData();
  const firm = data || FIRM_DATA;

  const industryProfiles = [
    {
      id: "startups",
      name: "Startups & Emerging Ventures",
      sectorKicker: "Venture & Tech",
      icon: Rocket,
      statuteBadge: "Sec 80-IAC • DPIIT",
      focus: "Entity incorporation (Pvt Ltd / LLP), DPIIT startup recognition, Section 80-IAC three-year income tax holiday, Angel Tax valuation under Section 56(2)(viib), cap table advisory, ESOP structuring, and investor due diligence readiness.",
      statutoryFoci: [
        "Section 80-IAC 100% Tax Holiday Certification",
        "DPIIT Recognition & Form 1 Angel Tax Exemption",
        "Cap Table Structuring & ESOP Plan Governance",
        "Pre-Series A / Series A Financial Due Diligence"
      ]
    },
    {
      id: "msmes",
      name: "MSMEs & Family Businesses",
      sectorKicker: "Enterprise & Trade",
      icon: Building2,
      statuteBadge: "Sec 43B(h) • Udyam",
      focus: "Udyam registration, strict Section 43B(h) 45-day vendor payment disallowance compliance, priority sector lending (PSL) documentation, statutory turnover audits, internal financial controls, and working capital CMA data optimization.",
      statutoryFoci: [
        "Section 43B(h) 45-Day Micro/Small Payment Audit",
        "CMA Data & Bank Project Reports for Working Capital",
        "Statutory Tax Audit Threshold Assessment",
        "Internal Financial Controls (ICFR) Implementation"
      ]
    },
    {
      id: "manufacturing",
      name: "Manufacturing & Industrial",
      sectorKicker: "Heavy & Process Industry",
      icon: Factory,
      statuteBadge: "CARO 2020 • Ind AS 2",
      focus: "Unit-cost accounting by qualified CMA (AIR 49), CARO 2020 Clause (ii) physical stock verification, Ind AS 2 inventory valuation, capital goods Input Tax Credit (ITC) optimization under Section 143 of CGST Act, and factory cost audits.",
      statutoryFoci: [
        "CARO 2020 Physical Inventory Verification",
        "CMA Unit-Cost & Margin Leakage Modeling",
        "Section 143 Job-Work ITC Reconciliations",
        "Drawing Power (DP) Bank Audit Certificates"
      ]
    },
    {
      id: "real-estate",
      name: "Real Estate & Infrastructure",
      sectorKicker: "Builders & Developers",
      icon: Home,
      statuteBadge: "RERA Form 3 • Sec 45(5A)",
      focus: "AP/TN RERA project registration, quarterly compliance returns, mandatory Form 3 CA escrow 70% withdrawal certificates under Section 4(2)(l)(D), Joint Development Agreement (JDA) capital gains structuring under Section 45(5A), and Ind AS 115 percentage-of-completion revenue recognition.",
      statutoryFoci: [
        "RERA Form 3 CA Escrow Withdrawal Certificates",
        "Section 45(5A) Joint Development Agreement (JDA) Tax",
        "Ind AS 115 Percentage-of-Completion Audit",
        "Quarterly RERA Financial Compliance Filings"
      ]
    },
    {
      id: "retail",
      name: "Retail & Distribution",
      sectorKicker: "Commerce & FMCG",
      icon: ShoppingCart,
      statuteBadge: "Multi-Branch GST • GSTR-2B",
      focus: "Multi-branch GST reconciliation, point-of-sale (POS) inventory accounting, supply chain tax structuring, GSTR-2B vs 3B ITC matching, shrinkage audits, and periodic stock ledger verification.",
      statutoryFoci: [
        "Multi-State & Multi-Branch GST Reconciliation",
        "Point-of-Sale (POS) Perpetual Inventory Audits",
        "GSTR-2B Automated ITC Matching & Vendor Scrutiny",
        "Store Shrinkage & Inventory Leakage Controls"
      ]
    },
    {
      id: "healthcare",
      name: "Healthcare & Pharmaceuticals",
      sectorKicker: "Hospitals & Diagnostics",
      icon: Stethoscope,
      statuteBadge: "Sec 194J TDS • Sec 12AB",
      focus: "Hospital accounting, doctor consultancy TDS withholding under Section 194J, pharmaceutical batch inventory audits, hospital equipment depreciation schedules, and Section 12AB tax exemptions for charitable healthcare trusts.",
      statutoryFoci: [
        "Section 194J Professional TDS Compliance for Doctors",
        "Pharma Batch Expiry & Stock Valuation Audits",
        "Section 12AB Trust Registrations for Hospitals",
        "Biomedical Equipment Depreciation Schedules"
      ]
    },
    {
      id: "education",
      name: "Education & Academic Institutions",
      sectorKicker: "Schools & Universities",
      icon: GraduationCap,
      statuteBadge: "Sec 12AB • Form 10B/10BB",
      focus: "Section 12AB and 80G registrations for educational trusts, Form 10B/10BB electronic audit filings, Foreign Contribution Regulation Act (FCRA) compliance, student fee accounting, and statutory annual audit filings.",
      statutoryFoci: [
        "Form 10B / 10BB Electronic Audit Report Filings",
        "Section 12AB & 80G Re-Registration Renewals",
        "Section 11(2) 85% Mandatory Income Accumulation",
        "FCRA Foreign Grant Utilization Certifications"
      ]
    },
    {
      id: "ecommerce",
      name: "E-Commerce & Digital Commerce",
      sectorKicker: "Marketplaces & D2C",
      icon: Globe,
      statuteBadge: "Sec 52 TCS • Sec 194-O",
      focus: "Tax Collected at Source (TCS) compliance under GST Section 52, 1% withholding under Section 194-O, multi-state GST registrations for Amazon/Flipkart fulfilment centers, payment gateway reconciliations, and Equalisation Levy advisory.",
      statutoryFoci: [
        "GST Section 52 Marketplace TCS Monthly Reporting",
        "Section 194-O E-Commerce Participant Withholding",
        "Principal Place of Business (PPOB/APOB) in Fulfilment Hubs",
        "Payment Gateway Settlement Reconciliations"
      ]
    },
    {
      id: "professionals",
      name: "Professionals & Consultants",
      sectorKicker: "Doctors, Architects, Tech",
      icon: UserCheck,
      statuteBadge: "Sec 44ADA Presumptive",
      focus: "Presumptive taxation under Section 44ADA up to ₹75 lakhs gross receipts (offering 50% deemed profit), quarterly advance tax scheduling, GST Letter of Undertaking (LUT) for IT service exports, and wealth protection.",
      statutoryFoci: [
        "Section 44ADA 50% Deemed Profit Scheme Planning",
        "Quarterly Advance Tax Scheduling (15/45/75/100%)",
        "GST Letter of Undertaking (LUT) for Zero-Rated Exports",
        "Personal Wealth & Capital Gains Asset Structuring"
      ]
    },
    {
      id: "ngos",
      name: "NGOs, Societies & Public Trusts",
      sectorKicker: "Charities & Social Sector",
      icon: HeartHandshake,
      statuteBadge: "Form 10A/10AB • CSR Audits",
      focus: "Trust incorporation, Form 10A / 10AB five-year re-registrations, Section 11 and 12 income exemptions, 85% mandatory income application rule under Section 11(2), CSR project fund audit certifications, and FCRA filings.",
      statutoryFoci: [
        "Form 10A / 10AB Trust Re-Registration under New Law",
        "Section 11(1)(a) & 11(2) Accumulation Tracking",
        "Corporate Social Responsibility (CSR) Fund Audits",
        "Form 10BD Donor Certificate Filings"
      ]
    }
  ];

  return (
    <div className="bg-brand-ivory page-reveal text-brand-charcoal min-h-screen">
      <SEOHead
        title="Industry Accounting & Tax Solutions in Tirupati | Kavitha & Associates"
        description="Sector-specific Chartered Accountancy expertise in Tirupati for Startups, MSMEs, Manufacturing, Real Estate, Retail, Healthcare, and Education sectors."
        canonicalPath="/industries"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Industries', path: '/industries' }
        ]}
      />

      {/* =========================================================================
          1. HEADER BANNER
          ========================================================================= */}
      <section className="bg-brand-surface py-20 sm:py-24 lg:py-28 border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl scroll-reveal">
            <span className="font-editorial-meta text-brand-gold block mb-3">
              Commercial Verticals • Specialized Statutory Frameworks
            </span>
            <h1 className="font-editorial-h1 text-brand-forest">
              Tailored Statutory Governance. Sector-Specific Precision.
            </h1>
            <p className="mt-4 font-editorial-body text-brand-muted leading-relaxed text-base sm:text-lg">
              Every industry operates under distinct tax incentive codes, regulatory scrutiny thresholds, and accounting standards. We configure custom audit procedures and compliance calendars tailored to your specific commercial vertical.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. STICKY SECTOR DIRECTORY INDEX JUMP BAR
          ========================================================================= */}
      <nav 
        aria-label="Industry Sector Jump Navigation" 
        className="bg-brand-surface/95 py-3 border-b border-brand-border sticky top-[57px] sm:top-[65px] z-30 shadow-xs backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-1">
            <span className="font-editorial-meta text-brand-gold shrink-0 flex items-center gap-1.5 text-[11px]">
              <Compass className="w-3.5 h-3.5 text-brand-gold" />
              <span>Sectors:</span>
            </span>
            <div className="flex items-center gap-2 shrink-0">
              {industryProfiles.map((ind) => (
                <a
                  key={ind.id}
                  href={`#${ind.id}`}
                  className="min-h-[44px] inline-flex items-center px-3.5 py-2.5 rounded-full bg-brand-white border border-brand-border text-xs font-semibold text-brand-forest hover:border-brand-gold hover:text-brand-deep transition-colors shadow-xs btn-tactile whitespace-nowrap"
                >
                  {ind.name.split(' ')[0]}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* =========================================================================
          3. THE 10 SECTOR PROFILES (Alternating Asymmetric Editorial Ledgers)
          ========================================================================= */}
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {industryProfiles.map((ind, idx) => {
            const IconComponent = ind.icon;
            const isEven = idx % 2 === 0;

            return (
              <div
                key={ind.id}
                id={ind.id}
                className="scroll-mt-32 p-5 sm:p-10 lg:p-12 rounded-2xl border border-brand-border bg-brand-white shadow-card card-tactile scroll-reveal"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                  
                  {/* Left Column: Sector Header & Core Focus */}
                  <div className={`lg:col-span-6 space-y-5 scroll-reveal-left ${isEven ? '' : 'lg:order-2'}`}>
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="w-12 h-12 rounded-xl bg-brand-forest/10 text-brand-forest flex items-center justify-center shrink-0 border border-brand-forest/20">
                        <IconComponent className="w-6 h-6 text-brand-forest" />
                      </div>
                      <div>
                        <span className="font-editorial-meta text-brand-gold text-[10px] block">
                          Sector 0{idx + 1} • {ind.sectorKicker}
                        </span>
                        <span className="font-editorial-meta text-brand-forest bg-brand-forest/10 px-2.5 py-0.5 rounded-full border border-brand-forest/20 text-[10px] inline-block mt-0.5">
                          {ind.statuteBadge}
                        </span>
                      </div>
                    </div>

                    <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-bold text-brand-forest">
                      {ind.name}
                    </h2>

                    <p className="font-editorial-body text-sm sm:text-base text-brand-muted leading-relaxed">
                      {ind.focus}
                    </p>

                    <div className="pt-2">
                      <Link
                        to="/contact"
                        className="min-h-[44px] w-full sm:w-auto text-center justify-center inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-forest text-white font-editorial-meta text-xs hover:bg-brand-deep transition-colors btn-tactile border border-brand-gold/30 shadow-card"
                      >
                        <span>Consult Practice Regarding {ind.name.split(' ')[0]}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Key Statutory Compliance Foci */}
                  <div className={`lg:col-span-6 bg-brand-surface rounded-2xl p-5 sm:p-8 border border-brand-border scroll-reveal-right ${isEven ? '' : 'lg:order-1'}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-border pb-4 mb-5">
                      <h3 className="font-editorial-h3 text-base font-bold text-brand-forest">
                        Critical Statutory & Tax Foci
                      </h3>
                      <span className="font-editorial-meta text-brand-gold text-[10px]">
                        Regulatory Mandates
                      </span>
                    </div>

                    <ul className="space-y-3.5 scroll-stagger">
                      {ind.statutoryFoci.map((focal, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-3 p-3 rounded-xl bg-brand-white border border-brand-border/70 shadow-subtle scroll-reveal">
                          <span className="w-2 h-2 rounded-full bg-brand-forest shrink-0 mt-2" />
                          <span className="font-editorial-body text-xs sm:text-sm text-brand-charcoal font-medium leading-relaxed">
                            {focal}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 pt-4 border-t border-brand-border/70 flex items-center justify-between text-xs font-editorial-body text-brand-muted">
                      <span>Compliant with prevailing Indian statutory frameworks</span>
                      <a
                        href={firm.contact.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-forest hover:text-brand-deep font-semibold hover:underline inline-flex items-center gap-1 min-h-[44px]"
                      >
                        <span>WhatsApp Query</span>
                        <span>→</span>
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          4. CROSS-SECTOR COMPLIANCE MATRIX
          ========================================================================= */}
      <section className="py-20 bg-brand-surface border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14 scroll-reveal">
            <span className="font-editorial-meta text-brand-gold block mb-2">
              Statutory Synthesis
            </span>
            <h2 className="font-editorial-h2 text-brand-forest">
              Cross-Sector Compliance Matrix
            </h2>
            <p className="font-editorial-body text-sm sm:text-base text-brand-muted mt-3">
              Key filing deadlines, audit thresholds, and governing statutes across primary commercial verticals.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-brand-border bg-brand-white shadow-card scroll-reveal-scale">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-brand-surface border-b border-brand-border">
                  <th className="py-4 px-5 font-editorial-meta text-brand-charcoal text-[11px]">Commercial Sector</th>
                  <th className="py-4 px-5 font-editorial-meta text-brand-forest text-[11px]">Primary Governing Statute</th>
                  <th className="py-4 px-5 font-editorial-meta text-brand-muted text-[11px]">Mandatory Audit Threshold</th>
                  <th className="py-4 px-5 font-editorial-meta text-brand-gold text-[11px]">Critical Annual Deadline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border font-editorial-body text-brand-charcoal">
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-brand-forest">Startups & Tech</td>
                  <td className="py-3.5 px-5">Income Tax Sec 80-IAC / DPIIT / Companies Act</td>
                  <td className="py-3.5 px-5">Annual Statutory Audit (All Pvt Ltd)</td>
                  <td className="py-3.5 px-5 text-brand-muted">Sept 30 (Audit) / Oct 31 (ITR)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-brand-forest">MSMEs & Trading</td>
                  <td className="py-3.5 px-5">Sec 43B(h) / Income Tax Sec 44AB / CGST</td>
                  <td className="py-3.5 px-5">Turnover &gt; ₹1 Cr (Cash &gt; 5%) / ₹10 Cr</td>
                  <td className="py-3.5 px-5 text-brand-muted">Sept 30 (Tax Audit) / Dec 31 (GSTR-9)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-brand-forest">Manufacturing Units</td>
                  <td className="py-3.5 px-5">CARO 2020 / Ind AS 2 / CGST Sec 143</td>
                  <td className="py-3.5 px-5">Companies Act Statutory + Sec 44AB</td>
                  <td className="py-3.5 px-5 text-brand-muted">Sept 30 (CARO) / Monthly DP</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-brand-forest">Real Estate & Builders</td>
                  <td className="py-3.5 px-5">RERA Act 2016 Sec 4(2)(l)(D) / Sec 45(5A)</td>
                  <td className="py-3.5 px-5">Quarterly Project Escrow 70% CA Certificate</td>
                  <td className="py-3.5 px-5 text-brand-muted">Quarterly RERA / Annual Form 5</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-brand-forest">Professionals</td>
                  <td className="py-3.5 px-5">Income Tax Sec 44ADA / CGST LUT</td>
                  <td className="py-3.5 px-5">Gross Receipts &gt; ₹75 Lakhs</td>
                  <td className="py-3.5 px-5 text-brand-muted">July 31 (44ADA) / Oct 31 (Audit)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-semibold text-brand-forest">Trusts & NGOs</td>
                  <td className="py-3.5 px-5">Sec 11, 12AB / Form 10B/10BB / FCRA</td>
                  <td className="py-3.5 px-5">Total Income Exceeds Basic Exemption</td>
                  <td className="py-3.5 px-5 text-brand-muted">Sept 30 (Form 10B) / Oct 31 (ITR-7)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. SPECIALIZED INDUSTRY CONSULTATION CTA
          ========================================================================= */}
      <section className="py-20 sm:py-24 bg-brand-surface text-center">
        <div className="max-w-3xl mx-auto px-4 scroll-reveal">
          <span className="font-editorial-meta text-brand-gold block mb-2.5">
            Specialized Industry Counsel
          </span>
          <h2 className="font-editorial-h2 text-brand-forest">
            Operating in a Regulated Commercial Sector?
          </h2>
          <p className="mt-4 font-editorial-body text-sm sm:text-base text-brand-muted leading-relaxed">
            We adapt auditing programs, tax withholding schedules, and compliance calendars to match your unique operational risks and statutory framework.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Link
              to="/contact"
              className="min-h-[44px] btn-pill-action bg-brand-forest text-white hover:bg-brand-deep group font-editorial-meta text-xs shadow-card hover:shadow-card-hover border border-brand-gold/40"
            >
              <span>Connect with Our Practice</span>
              <span className="icon-badge bg-white/10 text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-deep">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
            <a
              href={`tel:${firm.contact.primaryPhoneClean}`}
              className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3 rounded-full border border-brand-border bg-brand-white text-brand-forest font-editorial-meta text-xs hover:bg-brand-surface shadow-subtle transition-colors duration-200 active:scale-[0.98] btn-tactile"
            >
              <Phone className="w-4 h-4 text-brand-gold" />
              <span>Call Senior Partner</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
