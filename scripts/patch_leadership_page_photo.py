with open('src/v8/pages/LeadershipPage.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

target = '''            {/* Left Column: Official Crest Monogram (Neutral Ethical Safeguard) */}
            <div className="md:col-span-4 flex flex-col items-center justify-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl bg-[#071B14] border-2 border-[#B49A64]/60 p-4 shadow-xl flex flex-col items-center justify-center text-center relative group">
                <CrestMonogram variant="crest" size="lg" />
                <div className="mt-3 text-center">
                  <span className="block font-serif text-xs font-bold text-[#F1EBDD] tracking-wide">
                    OFFICIAL PRACTICE CREST
                  </span>
                  <span className="block text-[10px] font-mono text-[#B49A64] uppercase tracking-widest mt-0.5">
                    Kavitha &amp; Associates
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-[#525954] mt-2.5 text-center italic">
                Official Institutional Crest · Tirupati Chambers
              </p>
            </div>'''

replacement = '''            {/* Left Column: Verified Executive Partner Portrait */}
            <div className="md:col-span-4 flex flex-col items-center justify-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl bg-[#071B14] border-2 border-[#B49A64]/60 p-2 shadow-xl overflow-hidden relative group">
                <div className="w-full h-full rounded-xl overflow-hidden border border-[#B49A64]/40 bg-[#0B241C] relative">
                  <img
                    src="/images/partner/ca-kavitha-vijay-official.webp"
                    alt="CA Kavitha Vijay - Managing Partner"
                    width="400"
                    height="400"
                    loading="eager"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071B14]/40 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
              <p className="text-[11px] text-[#525954] mt-2.5 text-center italic font-medium">
                CA Kavitha Vijay · Managing Partner
              </p>
            </div>'''

if target in text:
    text = text.replace(target, replacement, 1)
    with open('src/v8/pages/LeadershipPage.tsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Patched LeadershipPage.tsx successfully")
else:
    # Try CRLF
    target_crlf = target.replace('\n', '\r\n')
    replacement_crlf = replacement.replace('\n', '\r\n')
    if target_crlf in text:
        text = text.replace(target_crlf, replacement_crlf, 1)
        with open('src/v8/pages/LeadershipPage.tsx', 'w', encoding='utf-8') as f:
            f.write(text)
        print("Patched LeadershipPage.tsx (CRLF) successfully")
    else:
        print("Target not found in LeadershipPage.tsx")
