import os

def update_about_section():
    file_path = 'src/components/AboutSection.tsx'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Normalize CRLF
    normalized = content.replace('\r\n', '\n')

    old_target = """              {/* Floating Partner Credential Card (R1.4, R2: Zero AI Portraits, Verified Data) */}
              <div className="absolute -bottom-4 right-3 sm:-bottom-5 sm:right-6 z-20 bg-[#153F32] rounded-2xl p-3.5 sm:p-4 text-white border border-[#C3A66B]/40 shadow-xl backdrop-blur-md max-w-[260px] sm:max-w-xs">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                    <span className="font-editorial-meta text-[10px] sm:text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wider">
                      ICAI Practice Lead
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#0D2820] text-[#D4AF37] border border-[#C3A66B]/30">
                    AIR 49
                  </span>
                </div>
                <p className="font-serif text-sm sm:text-base font-bold text-white tracking-wide leading-tight">
                  {FIRM_DATA.partner.name}
                </p>
                <p className="font-editorial-body text-[11px] text-[#A3B899] mt-0.5">
                  {FIRM_DATA.partner.qualifications} • 10+ Years Experience
                </p>
                <div className="mt-2 pt-1.5 border-t border-[#1F5443] flex items-center justify-between text-[10px] text-[#DDE8D9]">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#D4AF37]" />
                    <span>100% Partner-Led</span>
                  </span>
                  <span className="font-editorial-meta uppercase tracking-wider text-[#D4AF37]">
                    Pan-India
                  </span>
                </div>
              </div>"""

    new_replacement = """              {/* Floating Partner Credential Card with Authentic Client Portrait */}
              <div className="absolute -bottom-4 right-2 sm:-bottom-5 sm:right-6 z-20 bg-[#153F32] rounded-2xl p-3 sm:p-3.5 text-white border border-[#C3A66B]/50 shadow-2xl backdrop-blur-md max-w-[290px] sm:max-w-sm">
                <div className="flex items-center gap-3">
                  {/* Authentic Client Portrait in Editorial Frame */}
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 border-[#C3A66B] shadow-md shrink-0 bg-[#0D2820]">
                    <img
                      src="/images/partner/ca-kavitha-vijay.webp"
                      alt="CA Kavitha Vijay, Managing Partner & Practicing Chartered Accountant at Kavitha & Associates"
                      width="400"
                      height="400"
                      loading="lazy"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl pointer-events-none" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <div className="flex items-center gap-1 min-w-0">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        <span className="font-editorial-meta text-[10px] sm:text-[11px] font-semibold text-[#D4AF37] uppercase tracking-wider truncate">
                          ICAI Practice Lead
                        </span>
                      </div>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#0D2820] text-[#D4AF37] border border-[#C3A66B]/30 shrink-0">
                        AIR 49
                      </span>
                    </div>
                    <p className="font-serif text-sm sm:text-base font-bold text-white tracking-wide leading-tight truncate">
                      {FIRM_DATA.partner.name}
                    </p>
                    <p className="font-editorial-body text-[10px] sm:text-[11px] text-[#A3B899] mt-0.5 truncate">
                      {FIRM_DATA.partner.qualifications} • 10+ Years Experience
                    </p>
                  </div>
                </div>

                <div className="mt-2 pt-1.5 border-t border-[#1F5443] flex items-center justify-between text-[10px] text-[#DDE8D9]">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#D4AF37]" />
                    <span>100% Partner-Led</span>
                  </span>
                  <span className="font-editorial-meta uppercase tracking-wider text-[#D4AF37]">
                    Pan-India
                  </span>
                </div>
              </div>"""

    if old_target in normalized:
        updated = normalized.replace(old_target, new_replacement)
        with open(file_path, 'w', encoding='utf-8', newline='\n') as f:
            f.write(updated)
        print("[OK] Updated AboutSection.tsx with authentic portrait")
    else:
        print("[ERROR] Could not find target in AboutSection.tsx")


def update_about_page():
    file_path = 'src/pages/AboutPage.tsx'
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    normalized = content.replace('\r\n', '\n')

    old_target = """            {/* Left 5 Columns: Senior Partner Identification Card */}
            <div className="lg:col-span-5 scroll-reveal-left">
              <div className="bg-[#FFF9EF] rounded-2xl p-6 sm:p-8 border border-[#E8D5B5] shadow-card space-y-6">
                
                {/* Header with Official CA India Logo */}
                <div className="flex items-center justify-between pb-5 border-b border-[#E8D5B5]">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center p-1.5 border border-[#E8D5B5] shadow-xs shrink-0">
                      <img
                        src="/brand/ca-india-logo.png"
                        alt="Official CA India Emblem - Chartered Accountants"
                        width="56"
                        height="56"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <span className="font-editorial-meta text-[10px] uppercase tracking-wider text-[#C3A66B] font-bold block">
                        Senior Partner
                      </span>
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#153F32]">
                        {partner.name}
                      </h2>
                    </div>
                  </div>
                  <span className="font-editorial-meta text-[11px] font-semibold px-2.5 py-1 rounded bg-[#DDE8D9] text-[#153F32] border border-[#153F32]/20">
                    AIR <StatCounter value={49} />
                    {/* AIR 49 */}
                  </span>
                </div>

                {/* Statutory Credentials */}"""

    new_replacement = """            {/* Left 5 Columns: Senior Partner Identification Card */}
            <div className="lg:col-span-5 scroll-reveal-left">
              <div className="bg-[#FFF9EF] rounded-2xl p-6 sm:p-8 border border-[#E8D5B5] shadow-card space-y-6">
                
                {/* Header with Official CA India Logo */}
                <div className="flex items-center justify-between pb-5 border-b border-[#E8D5B5]">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center p-1.5 border border-[#E8D5B5] shadow-xs shrink-0">
                      <img
                        src="/brand/ca-india-logo.png"
                        alt="Official CA India Emblem - Chartered Accountants"
                        width="56"
                        height="56"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <span className="font-editorial-meta text-[10px] uppercase tracking-wider text-[#C3A66B] font-bold block">
                        Senior Partner
                      </span>
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#153F32]">
                        {partner.name}
                      </h2>
                    </div>
                  </div>
                  <span className="font-editorial-meta text-[11px] font-semibold px-2.5 py-1 rounded bg-[#DDE8D9] text-[#153F32] border border-[#153F32]/20">
                    AIR <StatCounter value={49} />
                    {/* AIR 49 */}
                  </span>
                </div>

                {/* Editorial Portrait Presentation Frame (Cream and Forest-Green Framing) */}
                <div className="relative rounded-2xl overflow-hidden bg-[#153F32] border border-[#C3A66B]/50 p-2 sm:p-2.5 shadow-card group">
                  {/* Subtle Architectural Corner Accents in Gold */}
                  <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#C3A66B] rounded-tl-sm pointer-events-none z-10" aria-hidden="true" />
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#C3A66B] rounded-br-sm pointer-events-none z-10" aria-hidden="true" />

                  {/* Inner Portrait Container */}
                  <div className="relative rounded-xl overflow-hidden aspect-square w-full bg-[#102D25] border border-[#C3A66B]/30">
                    <img
                      src="/images/partner/ca-kavitha-vijay.webp"
                      alt="CA Kavitha Vijay, Managing Partner & Practicing Chartered Accountant at Kavitha & Associates"
                      width="400"
                      height="400"
                      loading="lazy"
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                    {/* Subtle grounded gradient vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#153F32]/85 via-[#153F32]/20 to-transparent pointer-events-none" />

                    {/* Grounded Plaque Labels */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                      <span className="font-editorial-meta font-semibold uppercase tracking-wider text-[#D4AF37] px-2.5 py-1 rounded-md bg-[#153F32]/90 backdrop-blur-sm border border-[#C3A66B]/40 shadow-xs">
                        Managing Partner
                      </span>
                      <span className="font-mono text-[10px] text-white/90 bg-[#102D25]/90 px-2 py-1 rounded-md border border-[#C3A66B]/30 shadow-xs">
                        10+ Years Practice
                      </span>
                    </div>
                  </div>
                </div>

                {/* Statutory Credentials */}"""

    if old_target in normalized:
        updated = normalized.replace(old_target, new_replacement)
        with open(file_path, 'w', encoding='utf-8', newline='\n') as f:
            f.write(updated)
        print("[OK] Updated AboutPage.tsx with editorial portrait frame")
    else:
        print("[ERROR] Could not find target in AboutPage.tsx")

if __name__ == '__main__':
    update_about_section()
    update_about_page()
