import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, FileCheck, Search, Scale } from 'lucide-react';

export const AuditAssurancePage: React.FC = () => {
  const auditDetails = [
    {
      title: "Statutory Audit",
      description: "Comprehensive independent examination of financial statements under the Companies Act, ensuring true and fair presentation, internal financial controls (IFC), and strict statutory reporting compliance.",
      category: "Statutory Governance"
    },
    {
      title: "Internal Audit",
      description: "Systematic evaluation of internal operational controls, accounting systems, process efficiency, and risk-management protocols to prevent leakages and ensure operational resilience.",
      category: "Operational Oversight"
    },
    {
      title: "Tax Audit",
      description: "Rigorous verification under Section 44AB of the Income Tax Act, examining books of accounts, deductions, compliance with ICDS standards, and mandatory tax reporting disclosures.",
      category: "Direct Taxation"
    },
    {
      title: "Concurrent Audit",
      description: "Real-time, continuous audit of financial transactions and bank branches/operations to ensure ongoing compliance with prudential norms, documentation, and authority limits.",
      category: "Continuous Verification"
    },
    {
      title: "Stock & Inventory Audit",
      description: "Physical verification and valuation of inventory, raw materials, and finished goods, establishing physical reconciliation against general ledger records for lenders and boards.",
      category: "Asset Protection"
    },
    {
      title: "Due Diligence",
      description: "Comprehensive financial, legal compliance, and tax due diligence for investors, acquirers, or funding rounds, identifying hidden liabilities and validating valuation assumptions.",
      category: "Transaction Advisory"
    },
    {
      title: "Turnover Audit",
      description: "Accurate verification of enterprise gross revenue, sales turnovers, and contract volumes required for statutory certifications, licensing, tender bidding, and GST reconciliation.",
      category: "Statutory Thresholds"
    },
    {
      title: "Compliance Review & Risk Assessment",
      description: "Broad-spectrum audit evaluating adherence to labour laws, ROC filings, GST, direct taxes, and environmental statutory requirements, identifying exposure areas early.",
      category: "Risk Mitigation"
    },
    {
      title: "Management Audit",
      description: "Strategic appraisal of management efficiency, control frameworks, organizational systems, and resource utilization to assist executive leadership in optimizing operations.",
      category: "Executive Strategy"
    }
  ];

  return (
    <div className="bg-brand-warm">
      {/* Header Banner */}
      <section className="bg-[#0F3E2E] bg-gradient-to-b from-[#0F3E2E] to-[#0A2F24] text-white py-16 sm:py-20 border-b-2 border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-gold text-xs font-bold uppercase tracking-wider mb-4 border border-gold/30">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>Audit Spotlight Practice</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              Audit & Assurance Services
            </h1>
            <p className="mt-4 text-base sm:text-lg text-emerald-100 leading-relaxed">
              Independent, thorough, and compliant audits that build trust with lenders, investors, boards, and regulators, delivered with direct partner-level attention.
            </p>
          </div>
        </div>
      </section>

      {/* Core Principle Strip */}
      <section className="py-6 bg-brand-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-charcoal">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand-pale text-brand-primary flex items-center justify-center shrink-0 border border-emerald-100">
                <FileCheck className="w-4 h-4 text-emerald-800" />
              </div>
              <div>
                <strong className="text-brand-primary">ICAI Auditing Standards</strong>
                <p className="text-charcoal-muted mt-0.5">Strict adherence to Standards on Auditing (SAs).</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand-pale text-brand-primary flex items-center justify-center shrink-0 border border-emerald-100">
                <Search className="w-4 h-4 text-emerald-800" />
              </div>
              <div>
                <strong className="text-brand-primary">Evidence-Based Assurance</strong>
                <p className="text-charcoal-muted mt-0.5">Substantive verification and analytical review procedures.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-brand-pale text-brand-primary flex items-center justify-center shrink-0 border border-emerald-100">
                <Scale className="w-4 h-4 text-emerald-800" />
              </div>
              <div>
                <strong className="text-brand-primary">Partner-Level Review</strong>
                <p className="text-charcoal-muted mt-0.5">Direct oversight by CA KavithaVijay SRJ (FCA, CMA).</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9 Audit Practice Streams */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block mb-2">
              Assurance Disciplines
            </span>
            <h2 className="font-serif text-3xl font-bold text-brand-primary">
              The 9 Pillars of Our Audit Practice
            </h2>
            <p className="text-sm text-charcoal-muted mt-2">
              Every audit is performed with independence, objective skepticism, and rigorous technical methodologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auditDetails.map((audit, idx) => (
              <div
                key={audit.title}
                className="bg-white rounded-xl p-6 border border-border shadow-subtle hover:border-brand-primary hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-gold-dark uppercase tracking-wider bg-brand-pale px-2.5 py-1 rounded border border-emerald-100">
                      {audit.category}
                    </span>
                    <span className="text-xs font-serif font-bold text-charcoal-light">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-brand-primary mb-2">
                    {audit.title}
                  </h3>

                  <p className="text-xs text-charcoal-muted leading-relaxed">
                    {audit.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-xs text-emerald-800 font-medium">
                    ICAI Standards on Auditing
                  </span>
                  <Link
                    to="/contact"
                    className="text-brand-primary font-semibold hover:text-brand-deep underline underline-offset-2"
                  >
                    Enquire
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-16 bg-brand-surface border-t border-border">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-5">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary">
            Plan Your Upcoming Audit Cycle
          </h2>
          <p className="text-sm text-charcoal-muted max-w-xl mx-auto">
            Reach out early to establish timelines, review scope requirements, and maintain timely statutory filing compliance.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-primary text-white text-sm font-semibold hover:bg-brand-deep shadow-sm transition-colors"
            >
              <span>Schedule Audit Consultation</span>
              <ArrowRight className="w-4 h-4 text-gold" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
