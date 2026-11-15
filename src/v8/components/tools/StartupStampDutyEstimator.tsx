import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Copy, 
  Check, 
  RotateCcw, 
  CheckCircle2, 
  BadgePercent,
  Landmark
} from 'lucide-react';
import { 
  CorporateEntityType, 
  calculateApIncorporationCosts 
} from './rocStampDutyRules';

export const StartupStampDutyEstimator: React.FC = () => {
  const navigate = useNavigate();

  // Inputs state
  const [entityType, setEntityType] = useState<CorporateEntityType>('pvt_ltd');
  const [authorizedCapital, setAuthorizedCapital] = useState<number>(100000);
  const [numberOfDirectors, setNumberOfDirectors] = useState<number>(2);
  const [needNameReservationPreApproval, setNeedNameReservationPreApproval] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Capital presets
  const CAPITAL_PRESETS = [
    { label: '₹1 Lakh', value: 100000, tag: 'Standard Startup' },
    { label: '₹10 Lakhs', value: 1000000, tag: 'Commercial MSME' },
    { label: '₹15 Lakhs', value: 1500000, tag: 'Max ₹0 ROC Fee' },
    { label: '₹25 Lakhs', value: 2500000, tag: 'Growth Entity' },
    { label: '₹50 Lakhs', value: 5000000, tag: 'Enterprise Scale' },
    { label: '₹1 Crore', value: 10000000, tag: 'Institutional' },
  ];

  // Computation
  const result = useMemo(() => {
    return calculateApIncorporationCosts({
      entityType,
      authorizedCapital: Math.max(10000, Number(authorizedCapital) || 100000),
      numberOfDirectors: entityType === 'opc' ? 1 : Math.max(2, numberOfDirectors),
      needNameReservationPreApproval,
    });
  }, [entityType, authorizedCapital, numberOfDirectors, needNameReservationPreApproval]);

  const handleReset = () => {
    setEntityType('pvt_ltd');
    setAuthorizedCapital(100000);
    setNumberOfDirectors(2);
    setNeedNameReservationPreApproval(false);
  };

  const handleCopySummary = async () => {
    const summaryText = `KAVITHA & ASSOCIATES — STATUTORY INCORPORATION & ROC STAMP DUTY ESTIMATE
------------------------------------------------------------------------
Jurisdiction: Andhra Pradesh (Tirupati / Sri City / Chittoor / Statewide)
Entity Structure: ${result.entityTypeName}
Authorized Share Capital: ₹${result.authorizedCapital.toLocaleString('en-IN')}
Number of Proposed Directors: ${result.numberOfDirectors}

1. GOVERNMENT STATUTORY DUES & ROC FILING FEES:
   - MCA SPICe+ ROC Filing Fee: ₹${result.rocFilingFee.toLocaleString('en-IN')} ${result.isRocFeeExempt ? '(EXEMPT - Zero Fee up to ₹15L Capital)' : ''}
   - Andhra Pradesh e-MoA Stamp Duty: ₹${result.moaStampDuty.toLocaleString('en-IN')}
   - Andhra Pradesh e-AoA Stamp Duty (0.15%): ₹${result.aoaStampDuty.toLocaleString('en-IN')}
   - INC-9 Electronic Affidavit Stamp: ₹${result.inc9AffidavitDuty.toLocaleString('en-IN')}
   - PAN & TAN Generation (CBDT-MCA Challan): ₹${result.panTanFee.toLocaleString('en-IN')}
   - Name Reservation (RUN / SPICe+ Part A): ₹${result.nameReservationFee.toLocaleString('en-IN')}
   - TOTAL STATUTORY GOVERNMENT DUES: ₹${result.totalGovernmentStatutoryDues.toLocaleString('en-IN')}

2. MANDATORY ASSETS & CRYPTOGRAPHIC TOKENS:
   - Class-3 Digital Signature Certificates (DSC) & Hardware USB Tokens: ₹${result.dscEstimatedCost.toLocaleString('en-IN')} (${result.numberOfDirectors} Directors)

3. ESTIMATED TOTAL INCORPORATION OUTLAY (Govt + DSC + Chambers Drafting & INC-8 Certification):
   - Approx. ₹${result.estimatedTotalIncorporationOutlay.toLocaleString('en-IN')} (All inclusive)

MANDATORY DELIVERABLES:
${result.mandatoryDeliverables.map(d => `• ${d}`).join('\n')}

Chambers: Bairagi Patteda, Tirupati | CA Kavitha Vijay (B.Com, CA, CMA AIR 49 ICMAI)
URL: https://kavithaassociates.com/services/company-registration-tirupati`;

    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handleInitiateConsultation = () => {
    navigate('/contact?service=company-registration&ref=roc-estimator');
  };

  return (
    <div 
      id="roc-stamp-estimator"
      className="w-full bg-[#071B14] rounded-2xl sm:rounded-3xl border border-[#B49A64]/40 p-5 sm:p-7 md:p-9 shadow-2xl relative overflow-hidden"
    >
      {/* Background Architectural Watermark */}
      <div 
        className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-[#183529]/30 pointer-events-none blur-3xl z-0" 
        aria-hidden="true" 
      />

      {/* Header Plaque */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#B49A64]/25 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="font-mono text-[10px] sm:text-xs font-bold text-[#071B14] bg-[#B49A64] px-2.5 py-0.5 rounded uppercase tracking-wider">
              ANDHRA PRADESH STAMP ACT &amp; MCA V3
            </span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#183529] border border-[#B49A64]/30 text-[10px] sm:text-xs text-[#B49A64]">
              <Landmark className="w-3 h-3 text-[#B49A64]" />
              <span>SPICe+ Incorporation Estimator</span>
            </div>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[#F1EBDD] tracking-tight">
            Startup Capital &amp; AP ROC Stamp Duty Estimator
          </h3>

          <p className="font-editorial-body text-xs sm:text-sm text-[#D8D0BE] mt-1.5 max-w-2xl leading-relaxed">
            Statutory breakdown of Ministry of Corporate Affairs (MCA) filing fees, Andhra Pradesh MoA/AoA state stamp duty, PAN/TAN integration dues, and DSC cryptographic assets for company incorporation in Tirupati and Andhra Pradesh.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="self-start md:self-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#183529] hover:bg-[#0B241C] text-[#B49A64] border border-[#B49A64]/30 text-xs font-semibold transition-all min-h-[44px]"
          title="Reset to standard startup defaults"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* 2-Column Responsive Workspace */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 pt-6">
        
        {/* Left Column: Interactive Incorporation Parameters (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Entity Structure Selector */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#B49A64] uppercase tracking-wider mb-2">
              Proposed Corporate Structure
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'pvt_ltd' as CorporateEntityType, label: 'Private Limited', sub: 'Most Popular' },
                { id: 'opc' as CorporateEntityType, label: 'One Person (OPC)', sub: 'Single Founder' },
                { id: 'section_8' as CorporateEntityType, label: 'Section 8 NGO', sub: 'Non-Profit' },
                { id: 'producer_co' as CorporateEntityType, label: 'Producer Co.', sub: 'Agri / Farmers' },
              ].map((ent) => (
                <button
                  key={ent.id}
                  type="button"
                  onClick={() => {
                    setEntityType(ent.id);
                    if (ent.id === 'opc') setNumberOfDirectors(1);
                    else if (numberOfDirectors < 2) setNumberOfDirectors(2);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all duration-200 min-h-[44px] ${
                    entityType === ent.id
                      ? 'bg-[#183529] border-[#B49A64] text-[#F1EBDD] ring-1 ring-[#B49A64]/40 shadow-sm'
                      : 'bg-[#0B241C] border-[#B49A64]/25 text-[#D8D0BE] hover:border-[#B49A64]/60'
                  }`}
                >
                  <span className="font-serif font-bold text-xs sm:text-sm block">{ent.label}</span>
                  <span className="text-[10px] text-[#B49A64] font-mono mt-0.5 block">{ent.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Authorized Share Capital Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="capital-input" className="text-xs font-mono font-bold text-[#B49A64] uppercase tracking-wider">
                Authorized Share Capital
              </label>
              <div className="flex items-center gap-2">
                {result.isRocFeeExempt && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                    ZERO ROC FEE QUALIFIED
                  </span>
                )}
                <span className="font-mono text-sm sm:text-base font-bold text-[#F1EBDD] bg-[#183529] px-2.5 py-0.5 rounded border border-[#B49A64]/30">
                  ₹{result.authorizedCapital.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
              {CAPITAL_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setAuthorizedCapital(preset.value)}
                  className={`p-2 rounded-lg border text-left transition-all min-h-[44px] ${
                    authorizedCapital === preset.value
                      ? 'bg-[#B49A64] text-[#071B14] font-bold border-[#B49A64]'
                      : 'bg-[#0B241C] border-[#B49A64]/20 text-[#D8D0BE] hover:border-[#B49A64]/60'
                  }`}
                >
                  <div className="font-mono text-xs">{preset.label}</div>
                  <div className={`text-[9px] truncate ${authorizedCapital === preset.value ? 'text-[#071B14]/80 font-semibold' : 'text-[#AAB4A0]'}`}>
                    {preset.tag}
                  </div>
                </button>
              ))}
            </div>

            {/* Capital Range Slider & Numeric Input */}
            <div className="space-y-2">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#B49A64]">₹</span>
                <input
                  id="capital-input"
                  type="number"
                  min="10000"
                  step="50000"
                  value={authorizedCapital || ''}
                  onChange={(e) => setAuthorizedCapital(Math.max(10000, parseInt(e.target.value) || 0))}
                  className="w-full bg-[#0B241C] border border-[#B49A64]/30 rounded-xl pl-8 pr-4 py-2.5 text-sm font-mono text-[#F1EBDD] focus:outline-none focus:border-[#B49A64] focus:ring-1 focus:ring-[#B49A64] min-h-[44px]"
                  placeholder="Enter authorized share capital in INR"
                />
              </div>

              <input
                type="range"
                min="100000"
                max="10000000"
                step="100000"
                value={Math.min(10000000, Math.max(100000, authorizedCapital))}
                onChange={(e) => setAuthorizedCapital(parseInt(e.target.value))}
                className="w-full accent-[#B49A64] cursor-pointer"
                aria-label="Authorized Capital Range Slider"
              />
            </div>
          </div>

          {/* Number of Directors & Name Reservation Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Number of Directors */}
            <div>
              <label className="block text-xs font-mono font-bold text-[#B49A64] uppercase tracking-wider mb-2">
                Number of Proposed Directors
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(entityType === 'opc' ? [1] : [2, 3, 4]).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setNumberOfDirectors(num)}
                    className={`py-2 px-3 rounded-xl border text-center text-xs font-semibold transition-all min-h-[44px] ${
                      numberOfDirectors === num
                        ? 'bg-[#183529] border-[#B49A64] text-[#F1EBDD] ring-1 ring-[#B49A64]/40'
                        : 'bg-[#0B241C] border-[#B49A64]/25 text-[#D8D0BE] hover:border-[#B49A64]/60'
                    }`}
                  >
                    {num} {num === 1 ? 'Director' : 'Directors'}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-[#AAB4A0] mt-1.5 block">
                Class-3 DSC tokens included for each director.
              </span>
            </div>

            {/* Name Reservation Mode */}
            <div>
              <label className="block text-xs font-mono font-bold text-[#B49A64] uppercase tracking-wider mb-2">
                Name Approval Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNeedNameReservationPreApproval(false)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all min-h-[44px] ${
                    !needNameReservationPreApproval
                      ? 'bg-[#183529] border-[#B49A64] text-[#F1EBDD] ring-1 ring-[#B49A64]/40'
                      : 'bg-[#0B241C] border-[#B49A64]/25 text-[#D8D0BE]'
                  }`}
                >
                  <span className="font-semibold block">Integrated SPICe+</span>
                  <span className="text-[10px] text-emerald-400 font-mono">₹0 (Included)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setNeedNameReservationPreApproval(true)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all min-h-[44px] ${
                    needNameReservationPreApproval
                      ? 'bg-[#183529] border-[#B49A64] text-[#F1EBDD] ring-1 ring-[#B49A64]/40'
                      : 'bg-[#0B241C] border-[#B49A64]/25 text-[#D8D0BE]'
                  }`}
                >
                  <span className="font-semibold block">RUN Pre-Approval</span>
                  <span className="text-[10px] text-[#B49A64] font-mono">₹1,000 Govt Fee</span>
                </button>
              </div>
            </div>

          </div>

          {/* Statutory Zero Fee Exemption Notification Banner */}
          <div className="p-4 rounded-xl bg-[#0B241C] border border-[#B49A64]/30 space-y-2">
            <div className="flex items-center gap-2">
              <BadgePercent className="w-4 h-4 text-[#B49A64]" />
              <span className="text-xs font-serif font-bold text-[#F1EBDD]">
                Government of India Startup Fee Relief (MCA V3)
              </span>
            </div>
            <p className="text-[11px] text-[#D8D0BE] leading-relaxed">
              Under MCA Notification G.S.R. 208(E), companies with authorized capital up to ₹15,00,000 enjoy a <strong>100% waiver of ROC filing fees</strong>. Startups in Andhra Pradesh pay only state stamp duty and nominal PAN/TAN integration dues.
            </p>
          </div>

        </div>

        {/* Right Column: Statutory Cost Breakdown Dossier (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-5 bg-[#0B241C] p-5 sm:p-6 rounded-2xl border border-[#B49A64]/40 shadow-xl">
          
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#B49A64]/20">
              <span className="font-mono text-xs font-bold text-[#B49A64] uppercase tracking-wider">
                STATUTORY DUES BREAKDOWN
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#183529] text-[#B49A64] border border-[#B49A64]/30">
                ANDHRA PRADESH
              </span>
            </div>

            {/* Line Items */}
            <div className="space-y-3 pt-3 text-xs">
              
              {/* 1. MCA ROC SPICe+ Fee */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[#F1EBDD] font-medium block">MCA ROC SPICe+ Filing Fee</span>
                  <span className="text-[10px] text-[#AAB4A0]">
                    {result.isRocFeeExempt ? 'Exempt under G.S.R. 208(E)' : 'Calculated per capital slab'}
                  </span>
                </div>
                <span className={`font-mono font-bold ${result.isRocFeeExempt ? 'text-emerald-400' : 'text-[#F1EBDD]'}`}>
                  {result.isRocFeeExempt ? '₹0' : `₹${result.rocFilingFee.toLocaleString('en-IN')}`}
                </span>
              </div>

              {/* 2. AP MoA Stamp Duty */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[#F1EBDD] font-medium block">Andhra Pradesh e-MoA Stamp Duty</span>
                  <span className="text-[10px] text-[#AAB4A0]">AP Stamp Act Article 39</span>
                </div>
                <span className="font-mono font-semibold text-[#F1EBDD]">
                  ₹{result.moaStampDuty.toLocaleString('en-IN')}
                </span>
              </div>

              {/* 3. AP AoA Stamp Duty */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[#F1EBDD] font-medium block">Andhra Pradesh e-AoA Stamp Duty</span>
                  <span className="text-[10px] text-[#AAB4A0]">0.15% of Capital (Article 10)</span>
                </div>
                <span className="font-mono font-semibold text-[#F1EBDD]">
                  ₹{result.aoaStampDuty.toLocaleString('en-IN')}
                </span>
              </div>

              {/* 4. INC-9 Electronic Affidavit */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[#F1EBDD] font-medium block">INC-9 Director Declarations</span>
                  <span className="text-[10px] text-[#AAB4A0]">₹100 per director affidavit</span>
                </div>
                <span className="font-mono font-semibold text-[#F1EBDD]">
                  ₹{result.inc9AffidavitDuty.toLocaleString('en-IN')}
                </span>
              </div>

              {/* 5. PAN & TAN CBDT Challan */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[#F1EBDD] font-medium block">Corporate PAN &amp; TAN Generation</span>
                  <span className="text-[10px] text-[#AAB4A0]">NSDL / CBDT Integrated Fee</span>
                </div>
                <span className="font-mono font-semibold text-[#F1EBDD]">
                  ₹{result.panTanFee.toLocaleString('en-IN')}
                </span>
              </div>

              {/* 6. Name Reservation Fee */}
              {result.nameReservationFee > 0 && (
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[#F1EBDD] font-medium block">RUN Name Pre-Approval</span>
                    <span className="text-[10px] text-[#AAB4A0]">MCA RUN Portal Fee</span>
                  </div>
                  <span className="font-mono font-semibold text-[#F1EBDD]">
                    ₹{result.nameReservationFee.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              {/* Government Total Subtotal */}
              <div className="flex items-center justify-between pt-2.5 border-t border-[#B49A64]/20 font-bold">
                <span className="text-[#B49A64]">Total Statutory Government Dues</span>
                <span className="font-mono text-sm text-[#B49A64]">
                  ₹{result.totalGovernmentStatutoryDues.toLocaleString('en-IN')}
                </span>
              </div>

              {/* DSC Hardware Tokens */}
              <div className="flex items-center justify-between pt-2 text-[#AAB4A0]">
                <div>
                  <span className="text-[#D8D0BE] block">Class-3 DSC USB Hardware Tokens</span>
                  <span className="text-[10px] text-[#AAB4A0]">{result.numberOfDirectors} Directors (2-Yr Validity)</span>
                </div>
                <span className="font-mono">
                  ₹{result.dscEstimatedCost.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Total Estimated All-Inclusive Outlay Plaque */}
              <div className="p-3.5 rounded-xl bg-[#183529] border border-[#B49A64]/40 mt-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-xs text-[#F1EBDD]">
                    Total Estimated Formation Outlay
                  </span>
                  <span className="font-mono text-base sm:text-lg font-bold text-emerald-400">
                    ≈ ₹{result.estimatedTotalIncorporationOutlay.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="text-[10px] text-[#D8D0BE]/80 block leading-tight">
                  Includes Govt dues, {result.numberOfDirectors} Class-3 DSC tokens, customized MoA/AoA drafting, and Section 7(1) CA statutory certification.
                </span>
              </div>

            </div>
          </div>

          {/* Mandatory Documents Checklist */}
          <div className="space-y-2 pt-2 border-t border-[#B49A64]/20">
            <span className="text-[11px] font-mono font-bold text-[#B49A64] uppercase block">
              Required Incorporation Documents
            </span>
            <ul className="space-y-1 text-[11px] text-[#D8D0BE]">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A64] shrink-0" />
                <span>Self-attested PAN &amp; Aadhaar / Passport of Directors</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A64] shrink-0" />
                <span>Registered Office proof in AP (EB Bill / Tax Receipt &lt; 2 mo)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A64] shrink-0" />
                <span>Landlord No Objection Certificate (NOC)</span>
              </li>
            </ul>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={handleInitiateConsultation}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-br from-[#C5A059] via-[#B49A64] to-[#9E844E] hover:from-[#D4AF37] hover:via-[#C5A059] hover:to-[#B49A64] text-[#071B14] font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md hover:shadow-gold-glow border border-[#C5A059]/60 min-h-[44px] group btn-shimmer"
            >
              <span>Schedule Partner Scoping</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={handleCopySummary}
              className="py-3 px-3.5 rounded-xl bg-[#183529] hover:bg-[#071B14] text-[#B49A64] border border-[#B49A64]/40 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
              title="Copy ROC and Stamp Duty Estimate"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default StartupStampDutyEstimator;
