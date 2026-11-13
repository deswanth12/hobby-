import os

pages_to_patch = [
    {
        'file': 'src/pages/IncomeTaxPage.tsx',
        'import_target': "import { LetterReveal, WordReveal, TextHighlight } from '../components/animations';",
        'import_replace': "import { LetterReveal, WordReveal, TextHighlight } from '../components/animations';\nimport { CornerBrackets, EditorialMarker } from '../components/architectural';",
        'kicker_target': """            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDE8D9] text-[#153F32] font-editorial-meta mb-4 border border-[#153F32]/25 shadow-xs">
              <FileSpreadsheet className="w-4 h-4 text-[#153F32] shrink-0" />
              <span><LetterReveal text="Direct Tax Practice • Tirupati Chambers" /></span>
            </div>""",
        'kicker_replace': """            <div className="flex items-center gap-2.5 mb-4 flex-wrap">
              <EditorialMarker number="02" label="DIRECT TAXATION" />
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDE8D9] text-[#153F32] font-editorial-meta border border-[#153F32]/25 shadow-xs">
                <FileSpreadsheet className="w-4 h-4 text-[#153F32] shrink-0" />
                <span><LetterReveal text="Direct Tax Practice • Tirupati Chambers" /></span>
              </div>
            </div>"""
    },
    {
        'file': 'src/pages/GSTServicesPage.tsx',
        'import_target': "import { LetterReveal, WordReveal, TextHighlight } from '../components/animations';",
        'import_replace': "import { LetterReveal, WordReveal, TextHighlight } from '../components/animations';\nimport { CornerBrackets, EditorialMarker } from '../components/architectural';",
        'kicker_target': """            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDE8D9] text-[#153F32] font-editorial-meta mb-4 border border-[#153F32]/25 shadow-xs">
              <Receipt className="w-4 h-4 text-[#153F32] shrink-0" />
              <span><LetterReveal text="GST Compliance & Scrutiny Defense • Tirupati Chambers" /></span>
            </div>""",
        'kicker_replace': """            <div className="flex items-center gap-2.5 mb-4 flex-wrap">
              <EditorialMarker number="03" label="GST & INDIRECT TAX" />
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDE8D9] text-[#153F32] font-editorial-meta border border-[#153F32]/25 shadow-xs">
                <Receipt className="w-4 h-4 text-[#153F32] shrink-0" />
                <span><LetterReveal text="GST Compliance & Scrutiny Defense • Tirupati Chambers" /></span>
              </div>
            </div>"""
    },
    {
        'file': 'src/pages/CompanyRegistrationPage.tsx',
        'import_target': "import { LetterReveal, WordReveal, TextHighlight } from '../components/animations';",
        'import_replace': "import { LetterReveal, WordReveal, TextHighlight } from '../components/animations';\nimport { CornerBrackets, EditorialMarker } from '../components/architectural';",
        'kicker_target': """            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDE8D9] text-[#153F32] font-editorial-meta mb-4 border border-[#153F32]/25 shadow-xs">
              <Building2 className="w-4 h-4 text-[#153F32] shrink-0" />
              <span><LetterReveal text="Corporate Practice • SPICe+ & MCA Filings" /></span>
            </div>""",
        'kicker_replace': """            <div className="flex items-center gap-2.5 mb-4 flex-wrap">
              <EditorialMarker number="04" label="CORPORATE & ROC" />
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDE8D9] text-[#153F32] font-editorial-meta border border-[#153F32]/25 shadow-xs">
                <Building2 className="w-4 h-4 text-[#153F32] shrink-0" />
                <span><LetterReveal text="Corporate Practice • SPICe+ & MCA Filings" /></span>
              </div>
            </div>"""
    },
    {
        'file': 'src/pages/RERAConsultantPage.tsx',
        'import_target': "import { LetterReveal, WordReveal, TextHighlight } from '../components/animations';",
        'import_replace': "import { LetterReveal, WordReveal, TextHighlight } from '../components/animations';\nimport { CornerBrackets, EditorialMarker } from '../components/architectural';",
        'kicker_target': """            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDE8D9] text-[#153F32] font-editorial-meta mb-4 border border-[#153F32]/25 shadow-xs">
              <Home className="w-4 h-4 text-[#153F32] shrink-0" />
              <span><LetterReveal text="Real Estate Practice • AP RERA & TN RERA Compliance" /></span>
            </div>""",
        'kicker_replace': """            <div className="flex items-center gap-2.5 mb-4 flex-wrap">
              <EditorialMarker number="05" label="RERA ADVISORY" />
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDE8D9] text-[#153F32] font-editorial-meta border border-[#153F32]/25 shadow-xs">
                <Home className="w-4 h-4 text-[#153F32] shrink-0" />
                <span><LetterReveal text="Real Estate Practice • AP RERA & TN RERA Compliance" /></span>
              </div>
            </div>"""
    },
    {
        'file': 'src/pages/VirtualCFOPage.tsx',
        'import_target': "import { LetterReveal, WordReveal, TextHighlight } from '../components/animations';",
        'import_replace': "import { LetterReveal, WordReveal, TextHighlight } from '../components/animations';\nimport { CornerBrackets, EditorialMarker } from '../components/architectural';",
        'kicker_target': """            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDE8D9] text-[#153F32] font-editorial-meta mb-4 border border-[#153F32]/25 shadow-xs">
              <TrendingUp className="w-4 h-4 text-[#153F32] shrink-0" />
              <span><LetterReveal text="Executive Financial Leadership • Virtual CFO" /></span>
            </div>""",
        'kicker_replace': """            <div className="flex items-center gap-2.5 mb-4 flex-wrap">
              <EditorialMarker number="06" label="VIRTUAL CFO" />
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DDE8D9] text-[#153F32] font-editorial-meta border border-[#153F32]/25 shadow-xs">
                <TrendingUp className="w-4 h-4 text-[#153F32] shrink-0" />
                <span><LetterReveal text="Executive Financial Leadership • Virtual CFO" /></span>
              </div>
            </div>"""
    },
    {
        'file': 'src/pages/LocationsPage.tsx',
        'import_target': "import { LetterReveal, WordReveal, TextHighlight } from '../components/animations';",
        'import_replace': "import { LetterReveal, WordReveal, TextHighlight } from '../components/animations';\nimport { CornerBrackets, EditorialMarker } from '../components/architectural';",
        'kicker_target': """            <span className="font-editorial-meta text-gold-dark block mb-3">
              <LetterReveal text="Practice Chambers & Regional Corridors • South India Footprint" />
            </span>""",
        'kicker_replace': """            <div className="flex items-center gap-2.5 mb-3 flex-wrap">
              <EditorialMarker number="08" label="PRACTICE CHAMBERS" />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-white border border-brand-border shadow-xs">
                <span className="text-brand-gold font-mono font-bold">//</span>
                <LetterReveal text="REGIONAL CORRIDORS • SOUTH INDIA FOOTPRINT" as="span" className="tracking-widest uppercase font-semibold text-brand-forest text-xs" />
              </div>
            </div>"""
    }
]

for item in pages_to_patch:
    fpath = item['file']
    if not os.path.exists(fpath):
        print(f"[SKIP] {fpath} does not exist")
        continue
    with open(fpath, 'r', encoding='utf-8') as f:
        c = f.read()
    
    if item['import_target'] in c:
        c = c.replace(item['import_target'], item['import_replace'])
        print(f"[OK] Added imports to {fpath}")
    else:
        print(f"[WARN] Import target not found in {fpath}")
        
    if item['kicker_target'] in c:
        c = c.replace(item['kicker_target'], item['kicker_replace'])
        print(f"[OK] Replaced kicker in {fpath}")
    else:
        print(f"[WARN] Kicker target not found in {fpath}")
        
    with open(fpath, 'w', encoding='utf-8', newline='\n') as f:
        f.write(c)

print("[OK] Done patching service markers")
