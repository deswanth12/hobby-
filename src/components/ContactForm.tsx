import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { FIRM_DATA } from '../data/firmData';

interface FormData {
  fullName: string;
  organization: string;
  phone: string;
  email: string;
  serviceCategory: string;
  city: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  serviceCategory?: string;
  message?: string;
}

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    organization: '',
    phone: '',
    email: '',
    serviceCategory: 'Audit & Assurance Services',
    city: 'Tirupati',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+\s-]{8,15}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please provide a valid contact number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email format';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please provide a brief description of your requirement';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate clean local processing for demo without pretending fake database
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const generateWhatsAppUrl = () => {
    const text = `Hello CA Kavitha & Associates,\n\nName: ${formData.fullName}\nOrganization: ${formData.organization || 'Individual'}\nPhone: ${formData.phone}\nService Required: ${formData.serviceCategory}\nCity: ${formData.city}\nRequirement: ${formData.message}`;
    return `https://wa.me/919626350900?text=${encodeURIComponent(text)}`;
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      organization: '',
      phone: '',
      email: '',
      serviceCategory: 'Audit & Assurance Services',
      city: 'Tirupati',
      message: '',
    });
    setSubmitted(false);
    setErrors({});
  };

  return (
    <div className="bg-white rounded-2xl shadow-card border border-border p-6 sm:p-8 lg:p-10 transition-all">
      {submitted ? (
        <div className="text-center py-8 space-y-5 animate-fadeIn">
          <div className="w-16 h-16 bg-brand-pale text-brand-primary rounded-full flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-9 h-9 text-brand-interactive" />
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-2xl font-bold text-brand-primary">
              Consultation Inquiry Prepared
            </h3>
            <p className="text-sm text-charcoal-muted max-w-md mx-auto">
              Thank you, <strong>{formData.fullName}</strong>. Your inquiry for{' '}
              <strong>{formData.serviceCategory}</strong> has been structured.
            </p>
          </div>

          <div className="bg-brand-pale border border-emerald-200/80 rounded-xl p-4 max-w-lg mx-auto text-left text-xs text-brand-primary space-y-2">
            <div className="font-semibold text-brand-deep flex items-center gap-1.5">
              <span>Direct Communication Step</span>
            </div>
            <p className="text-emerald-900 leading-relaxed">
              This demo formats your message so you can transmit it directly to CA KavithaVijay SRJ via WhatsApp or direct phone call. Web entries are not stored on an external database.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={generateWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm transition-colors shadow-sm"
            >
              <MessageSquare className="w-4 h-4 text-gold-light" />
              <span>Send via WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 rounded-lg border border-border text-charcoal hover:bg-brand-pale text-sm font-medium transition-colors"
            >
              Reset / Edit Details
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="border-b border-border pb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark block mb-1">
              Direct Enquiry
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-primary">
              Request a Professional Consultation
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
              Connect directly with our practice for audit, corporate advisory, or tax compliance requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-charcoal transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none ${
                  errors.fullName ? 'border-red-400 bg-red-50/30' : 'border-border bg-brand-surface hover:bg-white'
                }`}
                placeholder="e.g. S. Ramanathan"
                aria-required="true"
                aria-invalid={!!errors.fullName}
              />
              {errors.fullName && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Organization / Entity */}
            <div>
              <label htmlFor="organization" className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1.5">
                Company / Organization <span className="text-xs font-normal text-charcoal-light">(Optional)</span>
              </label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-brand-surface hover:bg-white text-sm text-charcoal transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none"
                placeholder="e.g. Enterprise / LLP / Individual"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1.5">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-charcoal transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none ${
                  errors.phone ? 'border-red-400 bg-red-50/30' : 'border-border bg-brand-surface hover:bg-white'
                }`}
                placeholder="+91 98765 43210"
                aria-required="true"
                aria-invalid={!!errors.phone}
              />
              {errors.phone && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-charcoal transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none ${
                  errors.email ? 'border-red-400 bg-red-50/30' : 'border-border bg-brand-surface hover:bg-white'
                }`}
                placeholder="client@domain.com"
                aria-required="true"
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Service Category */}
            <div>
              <label htmlFor="serviceCategory" className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1.5">
                Service Category <span className="text-red-500">*</span>
              </label>
              <select
                id="serviceCategory"
                name="serviceCategory"
                value={formData.serviceCategory}
                onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-brand-surface hover:bg-white text-sm text-charcoal transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none"
              >
                <option value="Audit & Assurance Services">Audit & Assurance (Statutory, Internal, Tax Audit)</option>
                <option value="Income Tax Services">Income Tax (Filing, Planning, Scrutiny, Appeals)</option>
                <option value="GST Services">GST Services (Returns, Audit, ITC Optimization, Litigation)</option>
                <option value="Corporate & Business Services">Corporate Services (ROC, MCA, Virtual CFO)</option>
                <option value="RERA Compliance & Certification">RERA Compliance & Certifications</option>
                <option value="Advisory & Consulting">Advisory & Management Consulting</option>
                <option value="Other Financial Inquiry">General Professional Enquiry</option>
              </select>
            </div>

            {/* Client Location */}
            <div>
              <label htmlFor="city" className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1.5">
                Your Location
              </label>
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-brand-surface hover:bg-white text-sm text-charcoal transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none"
              >
                <option value="Tirupati">Tirupati</option>
                <option value="Chennai">Chennai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Other Location">Other (Pan-India)</option>
              </select>
            </div>
          </div>

          {/* Message / Requirement */}
          <div>
            <label htmlFor="message" className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1.5">
              Enquiry Summary <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-charcoal transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none ${
                errors.message ? 'border-red-400 bg-red-50/30' : 'border-border bg-brand-surface hover:bg-white'
              }`}
              placeholder="Please describe your specific requirements (e.g., upcoming statutory audit deadline, GST dispute notice, company incorporation, or tax advisory)..."
              aria-required="true"
              aria-invalid={!!errors.message}
            />
            {errors.message && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.message}
              </p>
            )}
          </div>

          {/* Direct Communication & Privacy Notice */}
          <div className="text-xs text-charcoal-muted leading-relaxed bg-brand-surface p-4 rounded-xl border border-border">
            <p>
              <strong className="text-brand-primary">Direct Communication Notice:</strong> Submitting this form formats your consultation inquiry so you can review and send it directly to CA KavithaVijay SRJ via WhatsApp or telephone. We do not solicit or store PAN, Aadhaar numbers, or financial files through this demo website.
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 pl-6 pr-2 py-2 rounded-full bg-brand-primary text-white font-semibold text-sm hover:bg-brand-deep shadow-card hover:shadow-card-hover transition-all duration-300 focus:ring-2 focus:ring-brand-primary focus:outline-none disabled:opacity-50 active:scale-[0.985]"
            >
              {isSubmitting ? (
                <span>Formatting Inquiry...</span>
              ) : (
                <>
                  <span>Prepare WhatsApp Inquiry</span>
                  <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">
                    <Send className="w-3.5 h-3.5" />
                  </span>
                </>
              )}
            </button>

            <span className="text-xs text-charcoal-muted text-center sm:text-right">
              Direct consultation line:{' '}
              <a
                href={`tel:${FIRM_DATA.contact.primaryPhoneClean}`}
                className="font-semibold text-brand-primary hover:text-brand-deep underline"
              >
                {FIRM_DATA.contact.primaryPhone}
              </a>
            </span>
          </div>
        </form>
      )}
    </div>
  );
};
