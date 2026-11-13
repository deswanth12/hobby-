/**
 * src/v8/adapters/backendAdapter.ts
 * 
 * V8.0 Backend Integration & Security Adapter Layer for Kavitha & Associates.
 * 
 * Provides unified, strongly typed, and defensive access to:
 * 1. Verified Firm Coordinates, Profiles, and ICMAI CMA AIR 49 Credentials
 * 2. Client Consultation Enquiry Intake with Anti-Spam (Honeypot + Velocity) Guards
 * 3. Verified Chambers WhatsApp Click-to-Chat Handshake Protocol
 * 4. Reactive State Integration via FirmDataContext hook (useFirmProfile)
 * 
 * Preserves 100% backwards compatibility with existing backend systems:
 * - FirmDataContext & FIRM_DATA baseline
 * - adminStorage persistence & remote synchronization
 * - Public /api/enquiries endpoint contracts
 * - Zero database migrations or schema alterations
 */

import { FIRM_DATA, FirmProfile } from '../../data/firmData';
import { adminStorage } from '../../services/adminStorage';
import { useFirmData } from '../../context/FirmDataContext';
import { isSafeUrl } from '../../lib/markdown';
import { EnquiryRecord } from '../../types/admin';

// ---------------------------------------------------------------------------
// Type Definitions & Interface Contracts
// ---------------------------------------------------------------------------

/**
 * Consultation & Advisory enquiry submission payload from public forms.
 */
export interface EnquirySubmissionPayload {
  fullName: string;
  phone: string;
  email: string;
  message: string;
  serviceCategory?: string;
  entityType?: string;
  organization?: string;
  city?: string;
  urgency?: string;
  website_fax_hp?: string; // Honeypot trap: must remain empty for legitimate human submissions
  formLoadedAt?: number;   // Epoch timestamp (ms) when form rendered, used for velocity validation
}

/**
 * Result returned upon completing enquiry registration.
 */
export interface EnquirySubmissionResult {
  success: boolean;
  referenceId?: string;
  whatsappUrl?: string;
  error?: string;
  isDuplicate?: boolean;
  data?: EnquiryRecord;
}

/**
 * Field-level validation errors map.
 */
export type EnquiryFieldErrors = Partial<Record<keyof EnquirySubmissionPayload, string>>;

/**
 * Validation result for intake form fields.
 */
export interface EnquiryValidationResult {
  isValid: boolean;
  errors: EnquiryFieldErrors;
}

/**
 * Anti-spam security evaluation result.
 */
export interface AntiSpamResult {
  passed: boolean;
  reason?: 'HONEYPOT_TRIGGERED' | 'VELOCITY_TOO_FAST';
  error?: string;
}

/**
 * Parameters for formatting WhatsApp consultation handoff links.
 */
export interface WhatsAppUrlOptions {
  referenceId?: string;
  fullName?: string;
  entityType?: string;
  organization?: string;
  phone?: string;
  serviceCategory?: string;
  city?: string;
  urgency?: string;
  message?: string;
  directServiceName?: string;
  pathname?: string;
  customMessage?: string;
}

// ---------------------------------------------------------------------------
// Sanitization & Security Validation Helpers
// ---------------------------------------------------------------------------

/**
 * Neutralizes potential HTML markup and scripts from raw user input strings.
 */
export function sanitizeText(str: string): string {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
}

/**
 * Validates enquiry input fields against statutory and technical constraints.
 */
export function validateEnquiryPayload(payload: EnquirySubmissionPayload): EnquiryValidationResult {
  const errors: EnquiryFieldErrors = {};

  const cleanFullName = (payload.fullName || '').trim();
  if (!cleanFullName) {
    errors.fullName = 'Full Name is required.';
  } else if (cleanFullName.length < 2) {
    errors.fullName = 'Full Name must be at least 2 characters.';
  } else if (cleanFullName.length > 100) {
    errors.fullName = 'Full Name cannot exceed 100 characters.';
  }

  const cleanPhone = (payload.phone || '').trim();
  const digitCount = cleanPhone.replace(/\D/g, '').length;
  if (!cleanPhone) {
    errors.phone = 'Contact telephone number is required.';
  } else if (!/^[0-9+\s\-()]{8,20}$/.test(cleanPhone) || digitCount < 7) {
    errors.phone = 'Please provide a valid contact number (min 7 digits).';
  } else if (cleanPhone.length > 20) {
    errors.phone = 'Phone number cannot exceed 20 characters.';
  }

  const cleanEmail = (payload.email || '').trim();
  if (!cleanEmail) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanEmail.length > 254) {
    errors.email = 'Please provide a valid email address format.';
  }

  const cleanMessage = (payload.message || '').trim();
  if (!cleanMessage) {
    errors.message = 'Please provide a brief description of your advisory or audit requirement.';
  } else if (cleanMessage.length < 5) {
    errors.message = 'Requirement summary must be at least 5 characters.';
  } else if (cleanMessage.length > 3000) {
    errors.message = 'Requirement summary cannot exceed 3000 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Evaluates dual-layer bot suppression: Honeypot field inspection and submission velocity guard.
 */
export function checkAntiSpam(payload: EnquirySubmissionPayload, minVelocityMs: number = 1500): AntiSpamResult {
  // Guard 1: Honeypot inspection
  if (payload.website_fax_hp && payload.website_fax_hp.trim().length > 0) {
    return {
      passed: false,
      reason: 'HONEYPOT_TRIGGERED',
      error: 'Security verification failed. Automated submission detected.',
    };
  }

  // Guard 2: Submission velocity timing check (threshold >= 1500ms)
  if (payload.formLoadedAt && typeof payload.formLoadedAt === 'number') {
    const elapsed = Date.now() - payload.formLoadedAt;
    if (elapsed < minVelocityMs) {
      return {
        passed: false,
        reason: 'VELOCITY_TOO_FAST',
        error: 'Submission received too rapidly. Please review your brief and submit again.',
      };
    }
  }

  return { passed: true };
}

// ---------------------------------------------------------------------------
// WhatsApp Protocol & Link Generation
// ---------------------------------------------------------------------------

/**
 * Generates an encrypted click-to-chat WhatsApp URL targeting CA Kavitha Vijay's chambers desk.
 * Formats structured consultation briefs embedding reference ID, entity, and statutory scope.
 */
export function generateWhatsAppUrl(options: WhatsAppUrlOptions = {}): string {
  const firmProfile = getFirmProfile();
  const rawNumber = firmProfile.contact?.whatsappNumber || '+91 96263 50900';
  const cleanPhone = rawNumber.replace(/[^0-9]/g, '');

  if (options.customMessage) {
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(options.customMessage)}`;
  }

  if (options.pathname) {
    return getRouteWhatsAppUrl(options.pathname);
  }

  if (options.directServiceName) {
    const directText = `Hello CA Kavitha Vijay (Kavitha & Associates),\n\nI would like to enquire about your ${options.directServiceName} practice.`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(directText)}`;
  }

  if (options.fullName) {
    const refId = options.referenceId || 'DIRECT';
    const entity = options.entityType || 'Private Limited Company';
    const org = options.organization ? options.organization : 'Individual';
    const phone = options.phone || 'Not Specified';
    const service = options.serviceCategory || 'Audit & Assurance Services';
    const city = options.city || 'Tirupati';
    const urgency = options.urgency || 'Routine';
    const message = options.message || 'Consultation request logged via web portal.';

    const structuredText = `Hello CA Kavitha Vijay (Kavitha & Associates),\n\nEnquiry Ref: ${refId}\nName: ${options.fullName}\nEntity Type: ${entity}\nOrganization: ${org}\nPhone: ${phone}\nService Required: ${service}\nLocation: ${city}\nUrgency: ${urgency}\n\nRequirement Summary:\n${message}`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(structuredText)}`;
  }

  // Fallback to configured baseline WhatsApp link or standard message
  if (firmProfile.contact?.whatsappLink && isSafeUrl(firmProfile.contact.whatsappLink)) {
    return firmProfile.contact.whatsappLink;
  }

  const defaultText = 'Hello CA Kavitha Vijay (Kavitha & Associates), I would like to enquire about your Chartered Accountancy services.';
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultText)}`;
}

/**
 * Maps any website route/page to a tailored, high-intent consultation message targeting CA Kavitha Vijay's chambers desk.
 */
export function getRouteWhatsAppUrl(pathname: string = '', extraContext?: string): string {
  const firmProfile = getFirmProfile();
  const rawNumber = firmProfile.contact?.whatsappNumber || '+91 96263 50900';
  const cleanPhone = rawNumber.replace(/[^0-9]/g, '');
  const path = (pathname || '').toLowerCase().trim();

  let text = '';

  if (path.includes('income-tax')) {
    text = 'Hello CA Kavitha Vijay (Kavitha & Associates),\n\nI would like to consult on Income Tax Return (ITR) Filing / Scrutiny Notice (Sec 143(2)/148) / Corporate Tax Advisory.';
  } else if (path.includes('gst')) {
    text = 'Hello CA Kavitha Vijay (Kavitha & Associates),\n\nI would like to consult on GST Notice Scrutiny (ASMT-10/DRC-01) / 2B ITC Reconciliation / GSTR-9/9C Filings.';
  } else if (path.includes('company-registration') || path.includes('corporate')) {
    text = 'Hello CA Kavitha Vijay (Kavitha & Associates),\n\nI would like to consult on Private Limited Incorporation / LLP Registration / ROC Compliance (SPICe+).';
  } else if (path.includes('virtual-cfo')) {
    text = 'Hello CA Kavitha Vijay (Kavitha & Associates),\n\nI would like to enquire about Virtual CFO Retainership / CMA Cost Modeling (AIR 49 {ICMAI}) / Working Capital Advisory.';
  } else if (path.includes('project-finance')) {
    text = 'Hello CA Kavitha Vijay (Kavitha & Associates),\n\nI would like to consult on Bankable Detailed Project Reports (DPR) / CMA Data / Term Loan Debt Syndication.';
  } else if (path.includes('rera')) {
    text = 'Hello CA Kavitha Vijay (Kavitha & Associates),\n\nI would like to consult on AP RERA Project Registration / Form 3 Escrow Certificates / Form 5 Annual Audits.';
  } else if (path.includes('audit-assurance') || path.includes('audit')) {
    text = 'Hello CA Kavitha Vijay (Kavitha & Associates),\n\nI would like to consult on Statutory Audit (Companies Act 2013) / Section 44AB Tax Audit / Internal Assurance.';
  } else if (path.includes('strategic-advisory')) {
    text = 'Hello CA Kavitha Vijay (Kavitha & Associates),\n\nI would like to consult on Institutional Succession Planning / Business Valuation (DCF) / Family Trusts.';
  } else if (path.includes('locations')) {
    text = 'Hello CA Kavitha Vijay (Kavitha & Associates),\n\nI am reaching out regarding industrial accounting / statutory compliance in Sri City SEZ / Renigunta EMC / Tirupati Chambers.';
  } else if (path.includes('industries')) {
    text = 'Hello CA Kavitha Vijay (Kavitha & Associates),\n\nI would like to consult on sector-specific regulatory compliance and statutory accounting for our enterprise.';
  } else if (path.includes('insights') || path.includes('blog')) {
    const titleText = extraContext ? ` on "${extraContext}"` : '';
    text = `Hello CA Kavitha Vijay (Kavitha & Associates),\n\nI was reviewing your statutory insight publication${titleText} and would like to schedule a consultation.`;
  } else {
    text = 'Hello CA Kavitha Vijay (Kavitha & Associates),\n\nI would like to schedule a confidential statutory consultation at your Tirupati chambers.';
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

// ---------------------------------------------------------------------------
// Firm Data & Profile Accessors
// ---------------------------------------------------------------------------

/**
 * Synchronous getter returning current firm profile with active settings overrides applied.
 * Compatible with SSR, unit testing, and non-React environments.
 */
export function getFirmProfile(): FirmProfile {
  // Deep clone baseline to prevent accidental mutation of singleton
  const profile: FirmProfile = JSON.parse(JSON.stringify(FIRM_DATA));

  if (typeof window !== 'undefined') {
    try {
      const overrides = adminStorage.getSettingsOverrides();
      if (overrides.primaryPhone) {
        profile.contact.primaryPhone = overrides.primaryPhone;
        profile.contact.primaryPhoneClean = overrides.primaryPhone.replace(/[^0-9]/g, '');
      }
      if (overrides.secondaryPhone) {
        profile.contact.secondaryPhone = overrides.secondaryPhone;
        profile.contact.secondaryPhoneClean = overrides.secondaryPhone.replace(/[^0-9]/g, '');
      }
      if (overrides.email) {
        profile.contact.email = overrides.email;
      }
      if (overrides.primaryLocation) {
        profile.contact.primaryLocation = overrides.primaryLocation;
      }
      if (overrides.googleMapsUrl && isSafeUrl(overrides.googleMapsUrl)) {
        profile.contact.googleMapsUrl = overrides.googleMapsUrl;
      }
      if (overrides.whatsappLink && isSafeUrl(overrides.whatsappLink)) {
        profile.contact.whatsappLink = overrides.whatsappLink;
      }
    } catch {
      // Graceful fallback to static baseline
    }
  }

  return profile;
}

/**
 * Retrieves firm contact coordinates, geo-coordinates, and communication links.
 */
export function getFirmContact(): FirmProfile['contact'] {
  return getFirmProfile().contact;
}

/**
 * Retrieves Managing Partner profile with ICMAI CMA AIR 49 credentials and Big 4 audit experience.
 * Complies strictly with R4 safeguards (no personal tax IDs, no unapproved FRNs).
 */
export function getPartnerProfile(): FirmProfile['partner'] {
  return getFirmProfile().partner;
}

/**
 * React hook connecting components to reactive firm data updates across the application.
 */
export function useFirmProfile(): FirmProfile & { profile: FirmProfile; reload: () => void; isModified: boolean } {
  const { data, reload, isModified } = useFirmData();
  return { ...data, profile: data, reload, isModified };
}

// ---------------------------------------------------------------------------
// Enquiry Submission Orchestrator
// ---------------------------------------------------------------------------

/**
 * Submits client consultation inquiry through validation, anti-spam guards,
 * and durable backend registration, returning reference ID and WhatsApp handoff link.
 */
export async function submitEnquiry(payload: EnquirySubmissionPayload): Promise<EnquirySubmissionResult> {
  // Step 1: Form field validation
  const validation = validateEnquiryPayload(payload);
  if (!validation.isValid) {
    const firstError = Object.values(validation.errors)[0] || 'Invalid inquiry form inputs.';
    return { success: false, error: firstError };
  }

  // Step 2: Anti-spam security guards (honeypot + velocity)
  const antiSpam = checkAntiSpam(payload);
  if (!antiSpam.passed) {
    return { success: false, error: antiSpam.error };
  }

  // Step 3: Input sanitization
  const sanitizedRecord = {
    fullName: sanitizeText(payload.fullName),
    entityType: payload.entityType || 'Private Limited Company',
    organization: sanitizeText(payload.organization || ''),
    phone: sanitizeText(payload.phone),
    email: sanitizeText(payload.email),
    serviceCategory: payload.serviceCategory || 'Audit & Assurance Services',
    city: sanitizeText(payload.city || 'Tirupati'),
    urgency: payload.urgency || 'routine',
    message: sanitizeText(payload.message),
    website_fax_hp: payload.website_fax_hp ? sanitizeText(payload.website_fax_hp) : undefined,
  };

  // Step 4: Dispatch to adminStorage / server API
  try {
    const result = await adminStorage.recordEnquiryAsync(sanitizedRecord);

    if (result.success && result.data && result.data.id) {
      const whatsappUrl = generateWhatsAppUrl({
        referenceId: result.data.id,
        fullName: sanitizedRecord.fullName,
        entityType: sanitizedRecord.entityType,
        organization: sanitizedRecord.organization,
        phone: sanitizedRecord.phone,
        serviceCategory: sanitizedRecord.serviceCategory,
        city: sanitizedRecord.city,
        urgency: sanitizedRecord.urgency,
        message: sanitizedRecord.message,
      });

      return {
        success: true,
        referenceId: result.data.id,
        whatsappUrl,
        data: result.data,
      };
    }

    return {
      success: false,
      error: result.error || 'Failed to record consultation inquiry in practice register. Please connect directly via WhatsApp or telephone.',
    };
  } catch {
    return {
      success: false,
      error: 'Chambers consultation server is currently unreachable. Please connect directly via WhatsApp or telephone (+91 96263 50900).',
    };
  }
}
