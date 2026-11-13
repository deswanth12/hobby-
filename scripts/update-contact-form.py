import os

# 1. Update ContactForm.tsx
with open('src/components/ContactForm.tsx', 'r', encoding='utf-8') as f:
    form_code = f.read()

# Update container classes and form header styling
form_code = form_code.replace(
    'className="bg-white rounded-2xl shadow-card border border-border p-6 sm:p-8 lg:p-10 transition-[border-color,box-shadow] duration-200"',
    'className="bg-[#FFFDF8] rounded-3xl shadow-editorial border border-[#E9E0D2] p-6 sm:p-8 lg:p-10 transition-[border-color,box-shadow] duration-200"'
)

# Replace the Form Header
old_header = '''          <div className="border-b border-border pb-4">
            <span className="text-xs font-semibold text-gold-dark block mb-1">
              Direct Enquiry
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-primary">
              Request a Professional Consultation
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
              Connect directly with our practice for audit, corporate advisory, or tax compliance requirements.
            </p>
          </div>'''

new_header = '''          <div className="border-b border-[#E9E0D2] pb-5">
            <span className="font-editorial-meta text-xs uppercase tracking-wider text-[#C9A66B] font-semibold block mb-1">
              Direct Practice Intake
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#183D30]">
              Request a Consultation
            </h3>
            <p className="font-editorial-body text-xs sm:text-sm text-[#66665E] mt-1.5 leading-relaxed">
              Connect directly with our practice for statutory audit, taxation, corporate advisory, or compliance across India.
            </p>
          </div>'''

form_code = form_code.replace(old_header, new_header)

# Update form field labels and input styling
form_code = form_code.replace(
    'text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1.5',
    'text-xs font-semibold text-[#183D30] tracking-wider mb-1.5'
)

form_code = form_code.replace(
    'className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border text-base sm:text-sm text-charcoal transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none ${\n                  errors.fullName ? \'border-red-400 bg-red-50/30\' : \'border-border bg-brand-surface hover:bg-white\'\n                }`}',
    'className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-base sm:text-sm text-[#292B27] transition-colors focus:ring-2 focus:ring-[#356B50] focus:border-[#356B50] focus:outline-none ${\n                  errors.fullName ? \'border-red-400 bg-red-50/30\' : \'border-[#E9E0D2] bg-[#FBF7EF]/80 hover:bg-white focus:bg-white\'\n                }`}'
)

form_code = form_code.replace(
    'className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-border bg-brand-surface hover:bg-white text-base sm:text-sm text-charcoal transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none"',
    'className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-[#E9E0D2] bg-[#FBF7EF]/80 hover:bg-white focus:bg-white text-base sm:text-sm text-[#292B27] transition-colors focus:ring-2 focus:ring-[#356B50] focus:border-[#356B50] focus:outline-none"'
)

form_code = form_code.replace(
    'className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border text-base sm:text-sm text-charcoal transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none ${\n                  errors.phone ? \'border-red-400 bg-red-50/30\' : \'border-border bg-brand-surface hover:bg-white\'\n                }`}',
    'className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-base sm:text-sm text-[#292B27] transition-colors focus:ring-2 focus:ring-[#356B50] focus:border-[#356B50] focus:outline-none ${\n                  errors.phone ? \'border-red-400 bg-red-50/30\' : \'border-[#E9E0D2] bg-[#FBF7EF]/80 hover:bg-white focus:bg-white\'\n                }`}'
)

form_code = form_code.replace(
    'className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border text-base sm:text-sm text-charcoal transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none ${\n                  errors.email ? \'border-red-400 bg-red-50/30\' : \'border-border bg-brand-surface hover:bg-white\'\n                }`}',
    'className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-base sm:text-sm text-[#292B27] transition-colors focus:ring-2 focus:ring-[#356B50] focus:border-[#356B50] focus:outline-none ${\n                  errors.email ? \'border-red-400 bg-red-50/30\' : \'border-[#E9E0D2] bg-[#FBF7EF]/80 hover:bg-white focus:bg-white\'\n                }`}'
)

form_code = form_code.replace(
    'className={`w-full px-3.5 py-2.5 rounded-lg border text-base sm:text-sm text-charcoal transition-colors focus:ring-2 focus:ring-brand-primary focus:outline-none ${\n                errors.message ? \'border-red-400 bg-red-50/30\' : \'border-border bg-brand-surface hover:bg-white\'\n              }`}',
    'className={`w-full px-3.5 py-2.5 rounded-xl border text-base sm:text-sm text-[#292B27] transition-colors focus:ring-2 focus:ring-[#356B50] focus:border-[#356B50] focus:outline-none ${\n                errors.message ? \'border-red-400 bg-red-50/30\' : \'border-[#E9E0D2] bg-[#FBF7EF]/80 hover:bg-white focus:bg-white\'\n              }`}'
)

# Update submit button styling
old_btn = 'className="w-full sm:w-auto min-h-[48px] btn-pill-action bg-brand-primary text-white hover:bg-brand-deep shadow-sm hover:shadow-md border border-gold/40 group text-xs sm:text-sm focus:ring-2 focus:ring-brand-primary focus:outline-none disabled:opacity-50"'
new_btn = 'className="w-full sm:w-auto min-h-[48px] btn-pill-action bg-[#356B50] text-white hover:bg-[#183D30] shadow-sm hover:shadow-md border border-[#C9A66B]/40 group text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-[#356B50] focus:outline-none disabled:opacity-50"'
form_code = form_code.replace(old_btn, new_btn)

# Update notice box
old_notice = '''          {/* Direct Communication & Privacy Notice */}
          <div className="text-xs text-charcoal-muted leading-relaxed bg-brand-surface p-4 rounded-xl border border-border">
            <p>
              <strong className="text-brand-primary">Direct Communication Notice:</strong> Submitting this form formats your consultation inquiry so you can review and send it directly to CA Kavitha Vijay via WhatsApp or telephone. We do not solicit or store PAN, Aadhaar numbers, or financial files through this website.
            </p>
          </div>'''

new_notice = '''          {/* Direct Communication & Privacy Notice */}
          <div className="text-xs text-[#66665E] leading-relaxed bg-[#FBF7EF] p-4 rounded-xl border border-[#E9E0D2]">
            <p>
              <strong className="text-[#183D30]">Direct Communication Notice:</strong> Submitting this form formats your consultation inquiry so you can review and send it directly to CA Kavitha Vijay via WhatsApp or telephone. We do not solicit or store PAN, Aadhaar numbers, or financial files through this website.
            </p>
          </div>'''
form_code = form_code.replace(old_notice, new_notice)

with open('src/components/ContactForm.tsx', 'w', encoding='utf-8') as f:
    f.write(form_code)

print("Updated ContactForm.tsx!")
