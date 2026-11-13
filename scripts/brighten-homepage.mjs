import fs from 'fs';

// 1. Update HomePage.tsx
let home = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

// Replace card 6 dark container
const darkCfoCard = `<div
                  id="virtual-cfo"
                  className={\`bg-brand-deep text-brand-white rounded-2xl border border-brand-forest p-6 sm:p-8 shadow-card flex flex-col justify-between scroll-reveal service-card-interactive group/card \${
                    isCfoExpanded ? 'service-card-expanded border-brand-gold/80' : ''
                  }\`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-brand-forest text-brand-gold flex items-center justify-center border border-brand-gold/40 group-hover/card:bg-brand-gold group-hover/card:text-brand-deep transition-colors">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <span className="font-editorial-meta text-[11px] font-semibold text-brand-gold bg-brand-forest/60 px-2.5 py-1 rounded border border-brand-gold/30">
                        Strategic Retainer
                      </span>
                    </div>

                    <h3 className="font-editorial-h3 text-2xl text-white mb-2">
                      Virtual CFO & Retainerships
                    </h3>
                    <p className="font-editorial-body text-xs sm:text-sm text-emerald-100/90 leading-relaxed mb-4">
                      Outsourced financial leadership and integrated compliance retainers designed for high-growth enterprises and established businesses.
                    </p>

                    <div className="mb-4 p-2.5 rounded-lg bg-brand-forest/80 border border-brand-gold/20 text-xs">
                      <span className="text-xs font-semibold text-brand-gold block mb-0.5">
                        Target Entities:
                      </span>
                      <p className="font-editorial-body text-emerald-200/90 text-[11px] leading-relaxed">
                        Growth-Stage Startups, MSMEs & Established Corporate Enterprises
                      </p>
                    </div>

                    <div className="border-t border-brand-forest pt-4">
                      <span className="text-xs font-semibold text-brand-gold block mb-2.5">
                        Retainer Scope:
                      </span>
                      <ul className="space-y-2">
                        <li className="font-editorial-body text-xs text-emerald-100/90 flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-1.5" />
                          <span>Monthly MIS & Operational Cash Flow Budgeting</span>
                        </li>
                        <li className="font-editorial-body text-xs text-emerald-100/90 flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-1.5" />
                          <span>Continuous Advance Tax & Quarterly TDS Structuring</span>
                        </li>
                        <li className="font-editorial-body text-xs text-emerald-100/90 flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-1.5" />
                          <span>Bank Loan CMA Data & Project Financial Modeling</span>
                        </li>
                        <li className="font-editorial-body text-xs text-emerald-100/90 flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-1.5" />
                          <span>Board-Level Fiscal Counseling with Senior Partner</span>
                        </li>
                      </ul>
                    </div>

                    {/* Expanding Curtain Section for Virtual CFO */}
                    <div id="curtain-virtual-cfo" className="service-curtain-body mt-3">
                      <div className="service-curtain-inner pt-3 border-t border-brand-gold/20 space-y-2.5">
                        <div className="p-3 rounded-lg bg-brand-forest/90 border border-brand-gold/20 text-xs text-emerald-100">
                          <span className="text-[11px] font-semibold text-brand-gold block mb-1">
                            Executive Oversight:
                          </span>
                          <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                            Direct access to CA Kavitha Vijay for board reviews, debt restructuring, and investor due diligence briefings.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Mobile Tap Toggle */}
                    <button
                      type="button"
                      onClick={() => setExpandedCardId(isCfoExpanded ? null : 'virtual-cfo')}
                      className="mt-3 text-[11px] text-brand-gold hover:text-white font-semibold flex items-center gap-1 sm:hidden cursor-pointer"
                      aria-expanded={isCfoExpanded}
                      aria-controls="curtain-virtual-cfo"
                    >
                      <span>{isCfoExpanded ? 'Collapse Scope ↑' : 'Expand Full Scope ↓'}</span>
                    </button>
                  </div>

                  <div className="pt-5 mt-5 border-t border-brand-forest flex items-center justify-between">
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-gold hover:text-white group"
                    >
                      <span>Discuss Retainer Scope</span>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-gold group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <a
                      href={\`tel:\${FIRM_DATA.contact.primaryPhoneClean}\`}
                      className="text-[11px] font-semibold text-emerald-300 hover:text-white underline underline-offset-2"
                    >
                      Call Directly
                    </a>
                  </div>
                </div>`;

const brightCfoCard = `<div
                  id="virtual-cfo"
                  className={\`bg-brand-white text-brand-charcoal rounded-2xl border-2 border-brand-gold/60 p-6 sm:p-8 shadow-card flex flex-col justify-between scroll-reveal service-card-interactive group/card \${
                    isCfoExpanded ? 'service-card-expanded border-brand-gold' : ''
                  }\`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-brand-pale text-brand-forest flex items-center justify-center border border-brand-gold/40 group-hover/card:bg-brand-forest group-hover/card:text-brand-gold transition-colors">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <span className="font-editorial-meta text-[11px] font-semibold text-gold-dark bg-brand-pale px-2.5 py-1 rounded border border-brand-gold/30">
                        Strategic Retainer
                      </span>
                    </div>

                    <h3 className="font-editorial-h3 text-2xl text-brand-forest mb-2 group-hover/card:text-brand-deep transition-colors">
                      Virtual CFO & Retainerships
                    </h3>
                    <p className="font-editorial-body text-xs sm:text-sm text-brand-muted leading-relaxed mb-4">
                      Outsourced financial leadership and integrated compliance retainers designed for high-growth enterprises and established businesses.
                    </p>

                    <div className="mb-4 p-2.5 rounded-lg bg-brand-surface/70 border border-brand-border/60 text-xs">
                      <span className="text-xs font-semibold text-gold-dark block mb-0.5">
                        Target Entities:
                      </span>
                      <p className="font-editorial-body text-brand-muted text-[11px] leading-relaxed">
                        Growth-Stage Startups, MSMEs & Established Corporate Enterprises
                      </p>
                    </div>

                    <div className="border-t border-brand-border/60 pt-4">
                      <span className="text-xs font-semibold text-gold-dark block mb-2.5">
                        Retainer Scope:
                      </span>
                      <ul className="space-y-2">
                        <li className="font-editorial-body text-xs text-brand-charcoal flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-1.5" />
                          <span>Monthly MIS & Operational Cash Flow Budgeting</span>
                        </li>
                        <li className="font-editorial-body text-xs text-brand-charcoal flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-1.5" />
                          <span>Continuous Advance Tax & Quarterly TDS Structuring</span>
                        </li>
                        <li className="font-editorial-body text-xs text-brand-charcoal flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-1.5" />
                          <span>Bank Loan CMA Data & Project Financial Modeling</span>
                        </li>
                        <li className="font-editorial-body text-xs text-brand-charcoal flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-1.5" />
                          <span>Board-Level Fiscal Counseling with Senior Partner</span>
                        </li>
                      </ul>
                    </div>

                    {/* Expanding Curtain Section for Virtual CFO */}
                    <div id="curtain-virtual-cfo" className="service-curtain-body mt-3">
                      <div className="service-curtain-inner pt-3 border-t border-brand-gold/30 space-y-2.5">
                        <div className="p-3 rounded-lg bg-brand-surface/90 border border-brand-border/80 text-xs text-brand-charcoal">
                          <span className="text-[11px] font-semibold text-gold-dark block mb-1">
                            Executive Oversight:
                          </span>
                          <p className="text-[11px] text-brand-muted leading-relaxed">
                            Direct access to CA Kavitha Vijay for board reviews, debt restructuring, and investor due diligence briefings.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Mobile Tap Toggle */}
                    <button
                      type="button"
                      onClick={() => setExpandedCardId(isCfoExpanded ? null : 'virtual-cfo')}
                      className="mt-3 text-[11px] text-gold-dark hover:text-brand-forest font-semibold flex items-center gap-1 sm:hidden cursor-pointer"
                      aria-expanded={isCfoExpanded}
                      aria-controls="curtain-virtual-cfo"
                    >
                      <span>{isCfoExpanded ? 'Collapse Scope ↑' : 'Expand Full Scope ↓'}</span>
                    </button>
                  </div>

                  <div className="pt-5 mt-5 border-t border-brand-border flex items-center justify-between">
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-forest hover:text-brand-deep group"
                    >
                      <span>Discuss Retainer Scope</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gold-dark group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <a
                      href={\`tel:\${FIRM_DATA.contact.primaryPhoneClean}\`}
                      className="text-[11px] font-semibold text-brand-forest hover:underline underline-offset-2"
                    >
                      Call Directly
                    </a>
                  </div>
                </div>\`;

// Replace ICAI ethics card
const darkIcaiCard = `<div className="bg-brand-deep text-brand-white rounded-xl p-6 border border-brand-forest shadow-card flex items-start gap-4 scroll-reveal">
              <div className="w-10 h-10 rounded-lg bg-brand-forest text-brand-gold flex items-center justify-center font-serif font-bold text-sm shrink-0 border border-brand-gold/40">
                <Shield className="w-5 h-5 text-brand-gold" />
              </div>
              <div>
                <h3 className="font-editorial-h3 text-lg font-bold text-white mb-1">
                  ICAI Code of Conduct & Independence
                </h3>
                <p className="font-editorial-body text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                  Every engagement strictly complies with the standards of independence, statutory integrity, and client confidentiality established by the Institute of Chartered Accountants of India.
                </p>
              </div>
            </div>`;

const brightIcaiCard = `<div className="bg-brand-white card-tactile rounded-xl p-6 border-2 border-brand-forest/20 shadow-card flex items-start gap-4 scroll-reveal">
              <div className="w-10 h-10 rounded-lg bg-brand-pale text-brand-forest flex items-center justify-center font-serif font-bold text-sm shrink-0 border border-brand-forest/20">
                <Shield className="w-5 h-5 text-brand-forest" />
              </div>
              <div>
                <h3 className="font-editorial-h3 text-lg font-bold text-brand-forest mb-1">
                  ICAI Code of Conduct & Independence
                </h3>
                <p className="font-editorial-body text-xs sm:text-sm text-brand-muted leading-relaxed">
                  Every engagement strictly complies with the standards of independence, statutory integrity, and client confidentiality established by the Institute of Chartered Accountants of India.
                </p>
              </div>
            </div>`;

if (home.includes('id="virtual-cfo"')) {
  // Use regex to replace card 6
  const cfoRegex = /<div\s+id="virtual-cfo"\s+className=\{`bg-brand-deep[\s\S]*?<\/div>\s*\)\(\)\}/;
  home = home.replace(cfoRegex, brightCfoCard);
}

if (home.includes('ICAI Code of Conduct & Independence')) {
  const icaiRegex = /<div className="bg-brand-deep text-brand-white rounded-xl p-6 border border-brand-forest shadow-card[\s\S]*?<\/p>\s*<\/div>\s*<\/div>/;
  home = home.replace(icaiRegex, brightIcaiCard);
}

fs.writeFileSync('src/pages/HomePage.tsx', home, 'utf8');
console.log('Updated HomePage.tsx to bright cream styling');
