patches = [
    {
        'file': 'src/pages/GSTServicesPage.tsx',
        'target': """            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDE8D9] text-[#153F32] font-editorial-meta mb-4 border border-[#153F32]/25 shadow-xs">
              <Receipt className="w-4 h-4 text-[#153F32] shrink-0" />
              <span><LetterReveal text="Indirect Tax Practice • Tirupati Chambers" /></span>
            </div>""",
        'replace': """            <div className="flex items-center gap-2.5 mb-4 flex-wrap">
              <EditorialMarker number="03" label="GST & INDIRECT TAX" />
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDE8D9] text-[#153F32] font-editorial-meta border border-[#153F32]/25 shadow-xs">
                <Receipt className="w-4 h-4 text-[#153F32] shrink-0" />
                <span><LetterReveal text="Indirect Tax Practice • Tirupati Chambers" /></span>
              </div>
            </div>"""
    },
    {
        'file': 'src/pages/CompanyRegistrationPage.tsx',
        'target': """            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDE8D9] text-[#153F32] font-editorial-meta mb-4 border border-[#153F32]/25 shadow-xs">
              <Building2 className="w-4 h-4 text-[#153F32] shrink-0" />
              <span><LetterReveal text="Corporate Secretarial Practice • MCA 21" /></span>
            </div>""",
        'replace': """            <div className="flex items-center gap-2.5 mb-4 flex-wrap">
              <EditorialMarker number="04" label="CORPORATE & ROC" />
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDE8D9] text-[#153F32] font-editorial-meta border border-[#153F32]/25 shadow-xs">
                <Building2 className="w-4 h-4 text-[#153F32] shrink-0" />
                <span><LetterReveal text="Corporate Secretarial Practice • MCA 21" /></span>
              </div>
            </div>"""
    },
    {
        'file': 'src/pages/RERAConsultantPage.tsx',
        'target': """            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDE8D9] text-[#153F32] font-editorial-meta mb-4 border border-[#153F32]/25 shadow-xs">
              <Building className="w-4 h-4 text-[#153F32] shrink-0" />
              <span><LetterReveal text="Real Estate Regulatory Practice • AP RERA" /></span>
            </div>""",
        'replace': """            <div className="flex items-center gap-2.5 mb-4 flex-wrap">
              <EditorialMarker number="05" label="RERA ADVISORY" />
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDE8D9] text-[#153F32] font-editorial-meta border border-[#153F32]/25 shadow-xs">
                <Building className="w-4 h-4 text-[#153F32] shrink-0" />
                <span><LetterReveal text="Real Estate Regulatory Practice • AP RERA" /></span>
              </div>
            </div>"""
    },
    {
        'file': 'src/pages/VirtualCFOPage.tsx',
        'target': """            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDE8D9] text-[#153F32] font-editorial-meta mb-4 border border-[#153F32]/25 shadow-xs">
              <LineChart className="w-4 h-4 text-[#153F32] shrink-0" />
              <span><LetterReveal text="CFO & Cost Advisory • Dual CA + CMA Competence" /></span>
            </div>""",
        'replace': """            <div className="flex items-center gap-2.5 mb-4 flex-wrap">
              <EditorialMarker number="06" label="VIRTUAL CFO" />
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDE8D9] text-[#153F32] font-editorial-meta border border-[#153F32]/25 shadow-xs">
                <LineChart className="w-4 h-4 text-[#153F32] shrink-0" />
                <span><LetterReveal text="CFO & Cost Advisory • Dual CA + CMA Competence" /></span>
              </div>
            </div>"""
    }
]

for p in patches:
    fpath = p['file']
    with open(fpath, 'r', encoding='utf-8') as f:
        c = f.read()
    if p['target'] in c:
        c = c.replace(p['target'], p['replace'])
        print(f"[OK] Replaced kicker in {fpath}")
    else:
        # try regex replace
        import re
        pat = r'<div className="inline-flex items-center gap-2 px-3\.5 py-1\.5 rounded-full bg-\[#DDE8D9\] text-\[#153F32\] font-editorial-meta mb-4 border border-\[#153F32\]/25 shadow-xs">\s*<([A-Za-z0-9]+) className="w-4 h-4 text-\[#153F32\] shrink-0" />\s*<span><LetterReveal text="([^"]+)" /></span>\s*</div>'
        m = re.search(pat, c)
        if m:
            icon_tag = m.group(1)
            text_val = m.group(2)
            lbl = p['replace'].split('label="')[1].split('"')[0]
            num = p['replace'].split('number="')[1].split('"')[0]
            rep = f'''            <div className="flex items-center gap-2.5 mb-4 flex-wrap">
              <EditorialMarker number="{num}" label="{lbl}" />
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDE8D9] text-[#153F32] font-editorial-meta border border-[#153F32]/25 shadow-xs">
                <{icon_tag} className="w-4 h-4 text-[#153F32] shrink-0" />
                <span><LetterReveal text="{text_val}" /></span>
              </div>
            </div>'''
            c = c.replace(m.group(0), rep)
            print(f"[OK via regex] Replaced kicker in {fpath}")
        else:
            print(f"[WARN] Target not found in {fpath}")
    with open(fpath, 'w', encoding='utf-8', newline='\n') as f:
        f.write(c)

print("[OK] Done updating remaining kickers")
