import re

path = 'src/pages/HomePage.tsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Hero section background
text = re.sub(
    r'<section className="bg-brand-ivory pt-6 xs:pt-8 sm:pt-14 lg:pt-16 pb-10 sm:pb-16 lg:pb-16 border-b border-brand-border relative overflow-hidden min-h-0 flex items-center">',
    r'<section className="bg-[#FFFCF5] pt-6 xs:pt-8 sm:pt-14 lg:pt-16 pb-10 sm:pb-16 lg:pb-16 border-b border-[#EDE2CF] relative overflow-hidden min-h-0 flex items-center">',
    text
)

# Hero Eyebrow badge
text = text.replace(
    'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-surface border border-brand-border text-brand-charcoal font-editorial-meta mb-5 shadow-xs',
    'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1D9] border border-[#EDE2CF] text-[#855E1C] font-editorial-meta mb-5 shadow-xs'
)
text = text.replace(
    '<span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0" />',
    '<span className="w-1.5 h-1.5 rounded-full bg-[#356B50] shrink-0" />'
)

# Hero H1 & Kicker
text = text.replace(
    '<h1 className="font-editorial-h1 text-brand-forest tracking-tight leading-none">',
    '<h1 className="font-editorial-h1 text-[#254B38] tracking-tight leading-none font-serif font-bold">'
)
text = text.replace(
    '<span className="font-editorial-hero-sub text-gold-dark italic block mt-2 font-normal">',
    '<span className="font-editorial-hero-sub text-[#855E1C] italic block mt-2 font-normal">'
)
text = text.replace(
    '<p className="mt-5 font-editorial-body text-brand-muted text-base sm:text-lg leading-relaxed max-w-xl">',
    '<p className="mt-5 font-editorial-body text-[#625F55] text-base sm:text-lg leading-relaxed max-w-xl">'
)

# Hero CTA buttons
text = text.replace(
    'px-7 py-4 rounded-full bg-brand-forest hover:bg-forest-600 text-brand-white font-editorial-meta text-xs tracking-wider uppercase transition-all shadow-card hover:shadow-editorial border border-brand-gold/40 flex items-center gap-2 group btn-tactile',
    'px-7 py-4 rounded-full bg-[#356B50] hover:bg-[#254B38] text-white font-editorial-meta text-xs tracking-wider uppercase transition-all shadow-card hover:shadow-editorial border border-[#C9A66B]/40 flex items-center gap-2 group btn-tactile'
)
text = text.replace(
    'px-7 py-4 rounded-full bg-brand-surface hover:bg-brand-cream text-brand-forest font-editorial-meta text-xs tracking-wider uppercase transition-all border border-brand-border hover:border-brand-gold shadow-subtle hover:shadow-card flex items-center gap-2 group btn-tactile',
    'px-7 py-4 rounded-full bg-white hover:bg-[#FFF1D9] text-[#254B38] font-editorial-meta text-xs tracking-wider uppercase transition-all border border-[#EDE2CF] hover:border-[#C9A66B] shadow-subtle hover:shadow-card flex items-center gap-2 group btn-tactile'
)

# Hero Right Column: Transform dark plaque into bright ivory/white executive card
old_plaque = '''<div 
                className="double-bezel-dark animate-fade-up rounded-3xl p-1.5 overflow-hidden"
                
              >
                <div 
                  className="double-bezel-inner-dark bg-brand-deep text-brand-white p-6 sm:p-8 relative overflow-hidden rounded-2xl"
                  
                >
                  
                  {/* Subtle decorative seal watermark */}
                  <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 rounded-full bg-brand-gold/5 border border-brand-gold/10 pointer-events-none" />

                  {/* Plaque Header & Monogram Seal */}
                  <div className="flex items-center justify-between border-b border-brand-forest pb-5 mb-5">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 flex items-center justify-center shrink-0 bg-white rounded-xl p-1.5 border border-brand-gold/40 shadow-sm">
                        <img 
                          src="/brand/ca-india-logo.png" 
                          alt="Official CA India Logo" 
                          width="56"
                          height="56"
                          loading="eager"
                          fetchPriority="high"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <span 
                          className="text-xs font-semibold text-brand-brightgold block">
                          Practice Register , Estd. Tirupati
                        </span>
                        <h2 
                          className="font-editorial-h3 text-2xl font-bold text-white tracking-wide"
                          
                        >
                          Kavitha & Associates
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* Senior Partner Credential Block */}
                  <div 
                    className="bg-brand-forest/90 rounded-xl p-4 border border-brand-gold/30 mb-5 space-y-1"
                    
                  >
                    <div className="flex items-center justify-between">
                      <span 
                        className="text-[11px] font-semibold text-brand-brightgold bg-brand-deep px-2.5 py-0.5 rounded border border-brand-gold/30">
                        Senior Partner
                      </span>
                      <span 
                        className="text-[10px] text-emerald-200 font-medium"
                        
                      >
                        Chartered Accountant, CMA AIR 49
                      </span>
                    </div>
                    <h3 
                      className="font-editorial-h3 text-xl font-bold text-white mt-1"
                      
                    >
                      {FIRM_DATA.partner.name}
                    </h3>
                    <p 
                      className="text-xs text-brand-gold font-semibold tracking-wide"
                      
                    >
                      {FIRM_DATA.partner.qualifications} (Dual Qualifications)
                    </p>
                  </div>

                  {/* Architectural Ledger Rows */}
                  <div className="space-y-3 font-editorial-body text-xs divide-y divide-brand-forest/60 pt-1">
                    
                    {/* Chambers & GPS Coordinates */}
                    <div className="flex items-start justify-between gap-3 pt-2">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5"  />
                        <div>
                          <strong 
                            className="text-white block text-xs font-semibold"
                            
                          >
                            Principal Chambers:
                          </strong>
                          <span 
                            className="text-emerald-100 text-xs font-normal"
                            
                          >
                            19-12-46, Near Bairagipetteda Arch, Tirupati 517501, AP
                          </span>
                        </div>
                      </div>
                      <a
                        href={FIRM_DATA.contact.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[44px] inline-flex items-center text-xs font-semibold text-brand-gold hover:text-white hover:underline shrink-0"
                        
                      >
                        <span>Map Pin</span><ArrowUpRight className="w-3.5 h-3.5 ml-1 inline text-brand-gold" aria-hidden="true" />
                      </a>
                    </div>

                    {/* Dual Strategic Competence */}
                    <div className="flex items-start gap-2.5 pt-3">
                      <ShieldCheck className="w-4 h-4 text-brand-gold shrink-0 mt-0.5"  />
                      <div>
                        <strong 
                          className="text-white block text-xs font-semibold"
                          
                        >
                          Dual Strategic Advantage:
                        </strong>
                        <span 
                          className="text-emerald-100 text-xs font-normal"
                          
                        >
                          External Statutory Audit + Internal Cost Accounting (CMA)
                        </span>
                      </div>
                    </div>

                    {/* Regional Service Corridors */}
                    <div className="flex items-start gap-2.5 pt-3">
                      <Compass className="w-4 h-4 text-brand-gold shrink-0 mt-0.5"  />
                      <div>
                        <strong 
                          className="text-white block text-xs font-semibold"
                          
                        >
                          Pan-India Service Reach:
                        </strong>
                        <span 
                          className="text-emerald-100 text-xs font-normal"
                          
                        >
                          Pan-India Advisory & Statutory Compliance Across All States & UTs
                        </span>
                      </div>
                    </div>

                    {/* Partner Supervision Guarantee */}
                    <div className="flex items-start gap-2.5 pt-3">
                      <UserCheck className="w-4 h-4 text-brand-gold shrink-0 mt-0.5"  />
                      <div>
                        <strong 
                          className="text-white block text-xs font-semibold"
                          
                        >
                          Partner-Supervised Accountability:
                        </strong>
                        <span 
                          className="text-emerald-100 text-xs font-normal"
                          
                        >
                          Every file reviewed directly by CA Kavitha Vijay
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Plaque Footer & Direct Action */}
                  <div className="mt-5 pt-4 border-t border-brand-forest flex items-center justify-between text-xs">
                    <div 
                      className="flex items-center gap-1.5 text-emerald-300 text-[11px] font-medium"
                      
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400 motion-safe:animate-pulse" />
                      <span>Practice Chambers Open</span>
                    </div>
                    <a
                      href={FIRM_DATA.contact.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-brand-gold hover:text-white font-semibold text-xs transition-colors"
                      
                    >
                      <span>Direct WhatsApp Desk</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                </div>
              </div>'''

new_plaque = '''<div 
                className="animate-fade-up rounded-2xl p-1 bg-gradient-to-br from-[#EDE2CF] to-[#FFF1D9] shadow-editorial-lg overflow-hidden"
              >
                <div 
                  className="bg-white text-[#292B27] p-6 sm:p-8 relative overflow-hidden rounded-2xl border border-[#EDE2CF]"
                >
                  
                  {/* Subtle decorative gold seal accent */}
                  <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 rounded-full bg-[#FFF1D9]/40 border border-[#EDE2CF] pointer-events-none" />

                  {/* Plaque Header & Monogram Seal */}
                  <div className="flex items-center justify-between border-b border-[#EDE2CF] pb-5 mb-5 relative z-10">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 flex items-center justify-center shrink-0 bg-[#FFFCF5] rounded-xl p-1.5 border border-[#EDE2CF] shadow-xs">
                        <img 
                          src="/brand/ca-india-logo.png" 
                          alt="Official CA India Logo" 
                          width="56"
                          height="56"
                          loading="eager"
                          fetchPriority="high"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <span 
                          className="text-xs font-semibold text-[#855E1C] block">
                          Practice Register • Estd. Tirupati
                        </span>
                        <h2 
                          className="font-editorial-h3 text-2xl font-bold text-[#254B38] tracking-wide"
                        >
                          Kavitha &amp; Associates
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* Senior Partner Credential Block */}
                  <div 
                    className="bg-[#EAF3E9] rounded-xl p-4 border border-[#356B50]/20 mb-5 space-y-1 relative z-10"
                  >
                    <div className="flex items-center justify-between">
                      <span 
                        className="text-[11px] font-semibold text-[#356B50] bg-white px-2.5 py-0.5 rounded border border-[#356B50]/20">
                        Senior Partner
                      </span>
                      <span 
                        className="text-[10px] text-[#625F55] font-medium"
                      >
                        Chartered Accountant, CMA AIR 49
                      </span>
                    </div>
                    <h3 
                      className="font-editorial-h3 text-xl font-bold text-[#254B38] mt-1"
                    >
                      {FIRM_DATA.partner.name}
                    </h3>
                    <p 
                      className="text-xs text-[#855E1C] font-semibold tracking-wide"
                    >
                      {FIRM_DATA.partner.qualifications} (Dual Qualifications)
                    </p>
                  </div>

                  {/* Architectural Ledger Rows */}
                  <div className="space-y-3 font-editorial-body text-xs divide-y divide-[#EDE2CF] pt-1 relative z-10">
                    
                    {/* Chambers & GPS Coordinates */}
                    <div className="flex items-start justify-between gap-3 pt-2">
                      <div className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-[#EAF3E9] text-[#356B50] flex items-center justify-center shrink-0 mt-0.5">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <strong 
                            className="text-[#254B38] block text-xs font-semibold"
                          >
                            Principal Chambers:
                          </strong>
                          <span 
                            className="text-[#625F55] text-xs font-normal"
                          >
                            19-12-46, Near Bairagipetteda Arch, Tirupati 517501, AP
                          </span>
                        </div>
                      </div>
                      <a
                        href={FIRM_DATA.contact.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[44px] inline-flex items-center text-xs font-semibold text-[#356B50] hover:text-[#254B38] hover:underline shrink-0"
                      >
                        <span>Map Pin</span><ArrowUpRight className="w-3.5 h-3.5 ml-1 inline text-[#356B50]" aria-hidden="true" />
                      </a>
                    </div>

                    {/* Dual Strategic Competence */}
                    <div className="flex items-start gap-2.5 pt-3">
                      <div className="w-6 h-6 rounded-md bg-[#EAF3E9] text-[#356B50] flex items-center justify-center shrink-0 mt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <strong 
                          className="text-[#254B38] block text-xs font-semibold"
                        >
                          Dual Strategic Advantage:
                        </strong>
                        <span 
                          className="text-[#625F55] text-xs font-normal"
                        >
                          External Statutory Audit + Internal Cost Accounting (CMA)
                        </span>
                      </div>
                    </div>

                    {/* Regional Service Corridors */}
                    <div className="flex items-start gap-2.5 pt-3">
                      <div className="w-6 h-6 rounded-md bg-[#EAF3E9] text-[#356B50] flex items-center justify-center shrink-0 mt-0.5">
                        <Compass className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <strong 
                          className="text-[#254B38] block text-xs font-semibold"
                        >
                          Pan-India Service Reach:
                        </strong>
                        <span 
                          className="text-[#625F55] text-xs font-normal"
                        >
                          Pan-India Advisory &amp; Statutory Compliance Across All States &amp; UTs
                        </span>
                      </div>
                    </div>

                    {/* Partner Supervision Guarantee */}
                    <div className="flex items-start gap-2.5 pt-3">
                      <div className="w-6 h-6 rounded-md bg-[#EAF3E9] text-[#356B50] flex items-center justify-center shrink-0 mt-0.5">
                        <UserCheck className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <strong 
                          className="text-[#254B38] block text-xs font-semibold"
                        >
                          Partner-Supervised Accountability:
                        </strong>
                        <span 
                          className="text-[#625F55] text-xs font-normal"
                        >
                          Every file reviewed directly by CA Kavitha Vijay
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Plaque Footer & Direct Action */}
                  <div className="mt-5 pt-4 border-t border-[#EDE2CF] flex items-center justify-between text-xs relative z-10">
                    <div 
                      className="flex items-center gap-1.5 text-[#356B50] text-[11px] font-medium"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#356B50] motion-safe:animate-pulse" />
                      <span>Practice Chambers Open</span>
                    </div>
                    <a
                      href={FIRM_DATA.contact.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#356B50] hover:text-[#254B38] font-semibold text-xs transition-colors"
                    >
                      <span>Direct WhatsApp Desk</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                </div>
              </div>'''

if old_plaque in text:
    text = text.replace(old_plaque, new_plaque)
    print("Replaced old dark plaque with bright executive card!")
else:
    print("Plaque not matched exactly, trying regex.")

# Audit spotlight section on homepage
text = re.sub(
    r'<section\s+className="py-10 sm:py-16 md:py-20 lg:py-28 bg-brand-white border-b border-brand-border scroll-mt-28"\s+id="audit-spotlight"\s*>',
    r'<section className="py-10 sm:py-16 md:py-20 lg:py-28 bg-[#FFFCF5] border-b border-[#EDE2CF] scroll-mt-28" id="audit-spotlight">',
    text
)

# Practice Philosophy section
text = re.sub(
    r'<section className="py-10 sm:py-16 md:py-20 lg:py-24 bg-brand-ivory border-b border-brand-border">',
    r'<section className="py-10 sm:py-16 md:py-20 lg:py-24 bg-[#FFF1D9] border-b border-[#EDE2CF]">',
    text
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated HomePage.tsx successfully!')
