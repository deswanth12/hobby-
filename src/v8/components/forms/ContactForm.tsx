import React, { useState, useRef } from 'react';
import { CheckCircle2, AlertCircle, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';
import {
  submitEnquiry,
  validateEnquiryPayload,
  generateWhatsAppUrl,
  EnquirySubmissionPayload,
  EnquiryFieldErrors,
} from '../../adapters/backendAdapter';
import { EnquiryRecord } from '../../../types/admin';

export interface ContactFormProps {
  initialService?: string;
  initialEntity?: string;
  onSuccess?: (referenceId: string) => void;
  className?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  initialService = 'Statutory Audit & Assurance',
  initialEntity = 'Private Limited Company',
  onSuccess,
  className = '',
}) => {
  const formLoadedAt = useRef<number>(Date.now());
  const [honeypot, setHoneypot] = useState('');

  const [formData, setFormData] = useState<EnquirySubmissionPayload>({
    fullName: '',
    entityType: initialEntity,
    organization: '',
    phone: '',
    email: '',
    serviceCategory: initialService,
    city: 'Tirupati',
    urgency: 'Routine Statutory Cycle',
    message: '',
  });

  const [errors, setErrors] = useState<EnquiryFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [savedRecord, setSavedRecord] = useState<EnquiryRecord | null>(null);
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState<string>('');
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleFieldChange = (field: keyof EnquirySubmissionPayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    // Prepare full submission payload with security metadata
    const payload: EnquirySubmissionPayload = {
      ...formData,
      website_fax_hp: honeypot,
      formLoadedAt: formLoadedAt.current,
    };

    // Client validation
    const validation = validateEnquiryPayload(payload);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitEnquiry(payload);
      if (result.success && result.data) {
        setSavedRecord(result.data);
        const waUrl = result.whatsappUrl || generateWhatsAppUrl({
          referenceId: result.data.id,
          fullName: formData.fullName,
          entityType: formData.entityType,
          organization: formData.organization,
          phone: formData.phone,
          serviceCategory: formData.serviceCategory,
          city: formData.city,
          urgency: formData.urgency,
          message: formData.message,
        });
        setGeneratedWhatsAppUrl(waUrl);
        setSubmitted(true);
        if (onSuccess && result.referenceId) {
          onSuccess(result.referenceId);
        }
      } else {
        setSubmissionError(result.error || 'Failed to record consultation inquiry. Please connect directly via WhatsApp.');
      }
    } catch {
      setSubmissionError('Chambers consultation server is currently unreachable. Please connect directly via telephone (+91 96263 50900).');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    formLoadedAt.current = Date.now();
    setHoneypot('');
    setFormData({
      fullName: '',
      entityType: initialEntity,
      organization: '',
      phone: '',
      email: '',
      serviceCategory: initialService,
      city: 'Tirupati',
      urgency: 'Routine Statutory Cycle',
      message: '',
    });
    setErrors({});
    setSubmitted(false);
    setSavedRecord(null);
    setGeneratedWhatsAppUrl('');
    setSubmissionError(null);
  };

  // SUCCESS STATE VIEW
  if (submitted && savedRecord) {
    return (
      <div className={`v8-form-success p-8 sm:p-10 rounded-2xl bg-[#0B241C] border border-[#B49A64]/50 shadow-editorial text-center space-y-6 ${className}`.trim()}>
        <div className="w-16 h-16 rounded-full bg-[#183529] border-2 border-[#B49A64] flex items-center justify-center mx-auto text-[#B49A64] shadow-sm">
          <CheckCircle2 className="w-8 h-8 text-[#B49A64]" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#183529] text-[#B49A64] text-xs font-semibold border border-[#B49A64]/30">
            <span>REGISTRATION CONFIRMED</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F1EBDD]">
            Consultation Brief Logged
          </h3>
          <p className="text-xs sm:text-sm text-[#AAB4A0] max-w-md mx-auto leading-relaxed">
            Your inquiry has been entered into the practice register. Chambers will review your requirement under partner supervision.
          </p>
        </div>

        {/* Reference ID Plaque */}
        <div className="bg-[#071B14] p-4 rounded-xl border border-[#B49A64]/40 max-w-sm mx-auto">
          <span className="block text-[11px] font-semibold text-[#AAB4A0] uppercase tracking-wider">
            Practice Reference Number
          </span>
          <span className="block font-mono text-lg font-bold text-[#B49A64] mt-0.5 tracking-wider">
            {savedRecord.id}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {generatedWhatsAppUrl && (
            <a
              href={generatedWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#183529] hover:bg-[#294B39] text-[#F1EBDD] border border-[#B49A64]/60 text-xs font-semibold tracking-wider transition-all shadow-sm group min-h-[44px]"
            >
              <MessageSquare className="w-4 h-4 text-[#B49A64] transition-transform group-hover:scale-110" />
              <span>Connect on WhatsApp Now</span>
            </a>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-transparent hover:bg-[#183529]/50 text-[#F1EBDD] border border-[#AAB4A0]/30 text-xs font-semibold tracking-wider transition-all min-h-[44px]"
          >
            <span>Submit Another Brief</span>
          </button>
        </div>
      </div>
    );
  }

  // ACTIVE INTAKE FORM VIEW
  return (
    <form onSubmit={handleSubmit} className={`space-y-5 ${className}`.trim()} noValidate>
      {/* Honeypot trap: Must remain blank for humans */}
      <div className="absolute -left-[9999px] top-auto w-1 h-1 opacity-0 overflow-hidden" aria-hidden="true" tabIndex={-1}>
        <label htmlFor="website_fax_hp">Anti-spam verification: leave blank</label>
        <input
          id="website_fax_hp"
          type="text"
          name="website_fax_hp"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {submissionError && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-3" role="alert">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">{submissionError}</p>
            <p className="text-[11px] text-red-300">
              For direct assistance, call Chambers at{' '}
              <a href="tel:+919626350900" className="underline font-bold text-[#F1EBDD]">
                +91 96263 50900
              </a>.
            </p>
          </div>
        </div>
      )}

      {/* Row 1: Full Name & Telephone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="fullName" className="block text-xs font-semibold text-[#F1EBDD] mb-1.5 uppercase tracking-wider">
            Full Name <span className="text-[#B49A64]">*</span>
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            value={formData.fullName}
            onChange={(e) => handleFieldChange('fullName', e.target.value)}
            placeholder="e.g. R. Sundaram"
            className={`w-full px-4 py-2.5 rounded-lg bg-[#071B14] text-[#F1EBDD] border text-xs focus:outline-none focus:ring-1 focus:ring-[#B49A64] transition-all duration-[180ms] ease-out ${
              errors.fullName ? 'border-red-500' : 'border-[#B49A64]/30 hover:border-[#B49A64]/60'
            }`}
          />
          {errors.fullName && (
            <p id="fullName-error" className="v8-form-error text-[11px] text-red-400 mt-1 font-medium">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-xs font-semibold text-[#F1EBDD] mb-1.5 uppercase tracking-wider">
            Contact Number <span className="text-[#B49A64]">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            value={formData.phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            placeholder="+91 98765 43210"
            className={`w-full px-4 py-2.5 rounded-lg bg-[#071B14] text-[#F1EBDD] border text-xs focus:outline-none focus:ring-1 focus:ring-[#B49A64] transition-all duration-[180ms] ease-out ${
              errors.phone ? 'border-red-500' : 'border-[#B49A64]/30 hover:border-[#B49A64]/60'
            }`}
          />
          {errors.phone && (
            <p id="phone-error" className="v8-form-error text-[11px] text-red-400 mt-1 font-medium">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Row 2: Email & Entity Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-[#F1EBDD] mb-1.5 uppercase tracking-wider">
            Email Address <span className="text-[#B49A64]">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            value={formData.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            placeholder="finance@company.com"
            className={`w-full px-4 py-2.5 rounded-lg bg-[#071B14] text-[#F1EBDD] border text-xs focus:outline-none focus:ring-1 focus:ring-[#B49A64] transition-all duration-[180ms] ease-out ${
              errors.email ? 'border-red-500' : 'border-[#B49A64]/30 hover:border-[#B49A64]/60'
            }`}
          />
          {errors.email && (
            <p id="email-error" className="v8-form-error text-[11px] text-red-400 mt-1 font-medium">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="entityType" className="block text-xs font-semibold text-[#F1EBDD] mb-1.5 uppercase tracking-wider">
            Entity Structure
          </label>
          <select
            id="entityType"
            name="entityType"
            value={formData.entityType}
            onChange={(e) => handleFieldChange('entityType', e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-[#071B14] text-[#F1EBDD] border border-[#B49A64]/30 hover:border-[#B49A64]/60 text-xs focus:outline-none focus:ring-1 focus:ring-[#B49A64] transition-all duration-[180ms] ease-out"
          >
            <option value="Private Limited Company">Private Limited Company</option>
            <option value="Limited Liability Partnership (LLP)">Limited Liability Partnership (LLP)</option>
            <option value="Partnership Firm">Partnership Firm</option>
            <option value="Proprietorship / Individual">Proprietorship / Individual</option>
            <option value="Trust / Society / NGO">Trust / Society / NGO</option>
            <option value="Public Limited Company">Public Limited Company</option>
            <option value="Foreign Subsidiary / Branch">Foreign Subsidiary / Branch</option>
          </select>
        </div>
      </div>

      {/* Row 3: Practice Discipline & Urgency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="serviceCategory" className="block text-xs font-semibold text-[#F1EBDD] mb-1.5 uppercase tracking-wider">
            Practice Area Required
          </label>
          <select
            id="serviceCategory"
            name="serviceCategory"
            value={formData.serviceCategory}
            onChange={(e) => handleFieldChange('serviceCategory', e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-[#071B14] text-[#F1EBDD] border border-[#B49A64]/30 hover:border-[#B49A64]/60 text-xs focus:outline-none focus:ring-1 focus:ring-[#B49A64] transition-all duration-[180ms] ease-out"
          >
            <option value="Statutory Audit & Assurance">Statutory Audit & Assurance (Companies Act 2013)</option>
            <option value="Direct Tax Advisory & Litigation">Direct Tax Advisory & Section 44AB Tax Audit</option>
            <option value="Indirect Tax & GST Compliance">GST Advisory, Audit & Litigations</option>
            <option value="Corporate Governance & Secretarial">Company Incorporation & MCA Compliance</option>
            <option value="Virtual CFO & Financial Strategy">Virtual CFO & CMA Management Reporting</option>
            <option value="Real Estate RERA Advisory">RERA Compliance & Project Registrations</option>
            <option value="General Financial Consultation">General Financial Consultation</option>
          </select>
        </div>

        <div>
          <label htmlFor="urgency" className="block text-xs font-semibold text-[#F1EBDD] mb-1.5 uppercase tracking-wider">
            Engagement Urgency
          </label>
          <select
            id="urgency"
            name="urgency"
            value={formData.urgency}
            onChange={(e) => handleFieldChange('urgency', e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-[#071B14] text-[#F1EBDD] border border-[#B49A64]/30 hover:border-[#B49A64]/60 text-xs focus:outline-none focus:ring-1 focus:ring-[#B49A64] transition-all duration-[180ms] ease-out"
          >
            <option value="Routine Statutory Cycle">Routine Statutory Cycle</option>
            <option value="Priority within 48 Hours">Priority within 48 Hours</option>
            <option value="Urgent Regulatory Notice / Demand">Urgent Regulatory Notice / Demand</option>
          </select>
        </div>
      </div>

      {/* Row 4: Requirement Summary */}
      <div>
        <label htmlFor="message" className="block text-xs font-semibold text-[#F1EBDD] mb-1.5 uppercase tracking-wider">
          Requirement Brief <span className="text-[#B49A64]">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'message-error' : undefined}
          value={formData.message}
          onChange={(e) => handleFieldChange('message', e.target.value)}
          placeholder="Briefly describe your statutory filing, audit, tax dispute, or advisory requirement..."
          className={`w-full px-4 py-2.5 rounded-lg bg-[#071B14] text-[#F1EBDD] border text-xs focus:outline-none focus:ring-1 focus:ring-[#B49A64] transition-all duration-[180ms] ease-out ${
            errors.message ? 'border-red-500' : 'border-[#B49A64]/30 hover:border-[#B49A64]/60'
          }`}
        />
        {errors.message && (
          <p id="message-error" className="v8-form-error text-[11px] text-red-400 mt-1 font-medium">{errors.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#B49A64] hover:bg-[#9E844E] text-[#071B14] font-semibold text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] group"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-[#071B14] border-t-transparent rounded-full animate-spin" />
              <span>Registering Consultation...</span>
            </>
          ) : (
            <>
              <span>Submit Consultation Brief</span>
              <ArrowRight className="w-4 h-4 text-[#071B14] transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>

      <div className="text-center pt-1">
        <p className="text-[10px] text-[#AAB4A0] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#B49A64]" />
          <span>Strict Confidentiality Guaranteed • ICAI Code of Ethics Compliant</span>
        </p>
      </div>
    </form>
  );
};

export default ContactForm;
