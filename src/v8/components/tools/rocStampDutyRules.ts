/**
 * src/v8/components/tools/rocStampDutyRules.ts
 *
 * Statutory ROC Fees, Andhra Pradesh Stamp Duty, and Incorporation Dues
 * according to:
 * 1. Ministry of Corporate Affairs (MCA) SPICe+ (INC-32) Framework
 *    - Companies (Registration Offices and Fees) Rules, 2014
 *    - Zero ROC fee exemption for Authorized Capital up to ₹15,00,000 (Notification G.S.R. 208(E))
 * 2. Andhra Pradesh Stamp Act, 1899 (as amended by AP Stamp Schedule)
 *    - Article 10 (Articles of Association - 0.15% of authorized capital, min ₹1,000)
 *    - Article 39 (Memorandum of Association - ₹1,000 / ₹2,000 / ₹5,000 slab)
 *    - INC-9 Electronic Affidavit Stamp: ₹100
 * 3. Central Statutory Dues:
 *    - PAN & TAN generation (CBDT integration): ₹131
 *    - DIN for up to 3 directors: ₹0 in SPICe+
 */

export type CorporateEntityType = 'pvt_ltd' | 'opc' | 'section_8' | 'producer_co';

export interface IncorporationInputs {
  entityType: CorporateEntityType;
  authorizedCapital: number; // in INR
  numberOfDirectors: number; // 1 (for OPC), 2, 3, or 4
  needNameReservationPreApproval: boolean; // RUN (₹1,000) vs integrated SPICe+ Part A (₹0)
}

export interface StatutoryCostBreakdown {
  authorizedCapital: number;
  entityType: CorporateEntityType;
  entityTypeName: string;
  numberOfDirectors: number;

  // 1. Government ROC SPICe+ Fee
  rocBaseFee: number;
  isRocFeeExempt: boolean;
  rocFeeExemptionCitation: string;
  rocFilingFee: number;

  // 2. State Stamp Duty (Andhra Pradesh)
  moaStampDuty: number;
  aoaStampDuty: number;
  inc9AffidavitDuty: number;
  totalApStampDuty: number;

  // 3. Central Government Dues
  panTanFee: number;
  nameReservationFee: number; // ₹1,000 if RUN pre-approval, ₹0 if integrated
  dinGovtFee: number; // ₹0 up to 3 directors in SPICe+

  // 4. Mandatory Hardware & Cryptographic Assets
  dscEstimatedCost: number; // Class 3 USB Hardware tokens (~₹1,400 per director)

  // 5. Aggregate Totals
  totalGovernmentStatutoryDues: number;
  estimatedTotalIncorporationOutlay: number; // Includes DSC hardware and CA professional drafting/certification baseline

  // 6. Regulatory Notes
  statuteCitations: string[];
  mandatoryDeliverables: string[];
  requiredDocuments: string[];
}

export function calculateApIncorporationCosts(inputs: IncorporationInputs): StatutoryCostBreakdown {
  const { entityType, authorizedCapital, numberOfDirectors, needNameReservationPreApproval } = inputs;

  const entityTypeNames: Record<CorporateEntityType, string> = {
    pvt_ltd: 'Private Limited Company',
    opc: 'One Person Company (OPC)',
    section_8: 'Section 8 Non-Profit Company',
    producer_co: 'Producer Company (Farmers / Agritech)',
  };

  // 1. MCA ROC Filing Fee (Companies Registration Offices and Fees Rules)
  // Up to ₹15 Lakhs: ₹0 filing fee for SPICe+ Part B
  let rocFilingFee = 0;
  let isRocFeeExempt = false;
  const rocFeeExemptionCitation = 'MCA Notification G.S.R. 208(E) dated 06.03.2019 (Zero ROC filing fee up to ₹15L capital)';

  if (authorizedCapital <= 1500000) {
    rocFilingFee = 0;
    isRocFeeExempt = true;
  } else {
    // Slabs above ₹15L:
    // Base fee up to ₹15L is ₹0 (exempt).
    // From 15L to 50L: ₹300 per ₹10,000 (i.e. 3%)
    // From 50L to 1Cr: ₹100 per ₹10,000 (i.e. 1%)
    // Above 1Cr: ₹75 per ₹10,000
    let excess = authorizedCapital - 1500000;
    if (excess <= 3500000) {
      rocFilingFee = Math.round((excess / 10000) * 300);
    } else {
      rocFilingFee = Math.round((3500000 / 10000) * 300);
      excess -= 3500000;
      if (excess <= 5000000) {
        rocFilingFee += Math.round((excess / 10000) * 100);
      } else {
        rocFilingFee += Math.round((5000000 / 10000) * 100);
        excess -= 5000000;
        rocFilingFee += Math.round((excess / 10000) * 75);
      }
    }
  }

  // 2. Andhra Pradesh Stamp Duty
  // Memorandum of Association (MOA) under AP Stamp Act:
  let moaStampDuty = 1000;
  if (authorizedCapital > 1000000 && authorizedCapital <= 5000000) {
    moaStampDuty = 2000;
  } else if (authorizedCapital > 5000000) {
    moaStampDuty = 5000;
  }

  // Articles of Association (AOA) under AP Stamp Schedule (Article 10):
  // 0.15% of authorized capital, minimum ₹1,000
  let aoaStampDuty = Math.max(1000, Math.round(authorizedCapital * 0.0015));

  // Section 8 companies enjoy concessional stamp duty
  if (entityType === 'section_8') {
    moaStampDuty = 500;
    aoaStampDuty = 500;
  }

  const inc9AffidavitDuty = 100 * numberOfDirectors;
  const totalApStampDuty = moaStampDuty + aoaStampDuty + inc9AffidavitDuty;

  // 3. Central Government Integrated Dues
  const panTanFee = 131; // Mandatory combined NSDL/CBDT challan via SPICe+
  const nameReservationFee = needNameReservationPreApproval ? 1000 : 0;
  const dinGovtFee = 0; // Up to 3 directors free in SPICe+

  // 4. Hardware Token & DSC (Class 3 Signing + Encryption)
  const dscEstimatedCost = numberOfDirectors * 1400;

  // 5. Totals
  const totalGovernmentStatutoryDues = rocFilingFee + totalApStampDuty + panTanFee + nameReservationFee;
  // Professional chambers baseline for drafting customized MoA/AoA, INC-8 certification, and compliance filing
  const professionalChambersBaseline = 6000; 
  const estimatedTotalIncorporationOutlay = totalGovernmentStatutoryDues + dscEstimatedCost + professionalChambersBaseline;

  return {
    authorizedCapital,
    entityType,
    entityTypeName: entityTypeNames[entityType],
    numberOfDirectors,
    rocBaseFee: rocFilingFee,
    isRocFeeExempt,
    rocFeeExemptionCitation,
    rocFilingFee,
    moaStampDuty,
    aoaStampDuty,
    inc9AffidavitDuty,
    totalApStampDuty,
    panTanFee,
    nameReservationFee,
    dinGovtFee,
    dscEstimatedCost,
    totalGovernmentStatutoryDues,
    estimatedTotalIncorporationOutlay,
    statuteCitations: [
      'Companies Act, 2013 (Section 7 - Incorporation of Company)',
      'Companies (Registration Offices and Fees) Rules, 2014 as amended',
      'MCA Notification G.S.R. 208(E) (Zero ROC Fee up to ₹15 Lakhs Capital)',
      'Indian Stamp Act, 1899 (Andhra Pradesh State Schedule, Article 10 & 39)',
      'CBDT-MCA Integration for Instant PAN & TAN Generation',
    ],
    mandatoryDeliverables: [
      'Certificate of Incorporation (CoI) with unique 21-digit CIN',
      'Corporate PAN & TAN allotment letters from Income Tax Department',
      'Approved e-MoA (INC-33) with customized corporate objects clause',
      'Approved e-AoA (INC-34) containing governance & share transfer rules',
      'Director Identification Numbers (DIN) & EPFO/ESIC/Prof Tax registration',
    ],
    requiredDocuments: [
      'Self-attested PAN card copy of all directors & shareholders',
      'Identity & address proof (Aadhaar / Voter ID / Passport / Driving License)',
      'Recent passport-size photographs of all proposed directors',
      'Registered office proof in AP (Electricity bill / Municipal tax receipt < 2 months old)',
      'No Objection Certificate (NOC) from registered office property owner',
    ],
  };
}
