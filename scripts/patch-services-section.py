import re

file_path = 'src/components/ServicesSection.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    c = f.read()

# Add architectural imports
c = c.replace(
    "import { DualArrowButton } from './animations';",
    "import { DualArrowButton } from './animations';\nimport { CornerBrackets, EditorialMarker, PrecisionDotMatrix, GeometricSymbol } from './architectural';"
)

# Insert EditorialMarker in Section Header
old_header_badge = """            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF9EF] border border-[#C3A66B]/60 shadow-xs mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#183D30]" />
              <span className="font-editorial-meta text-xs font-semibold uppercase tracking-wider text-[#183D30]">
                PRACTICE DISCIPLINES &amp; SERVICES
              </span>
            </div>"""

new_header_badge = """            <div className="flex items-center gap-2.5 mb-3 flex-wrap">
              <EditorialMarker number="02" label="PRACTICE DISCIPLINES" />
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF9EF] border border-[#C3A66B]/60 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#183D30]" />
                <span className="font-editorial-meta text-xs font-semibold uppercase tracking-wider text-[#183D30]">
                  STATUTORY DISCIPLINES
                </span>
              </div>
            </div>"""

c = c.replace(old_header_badge, new_header_badge)

# CARD 1: Remove img and add architectural icon header
card1_old_img = """              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden mb-5 border border-[#E6C98F]/70 bg-[#183D30]/10">
                <img
                  src="/images/ai-generated/services/audit.webp"
                  alt="Statutory and internal audit verification schedule adhering to ICAI standards"
                  width="1280"
                  height="720"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#183D30]/90 text-[#E6C98F] font-editorial-meta text-[10px] font-semibold border border-[#C9A66B]/30 backdrop-blur-xs">
                  9 Specialized Streams
                </div>
              </div>"""

card1_new_header = """              <div className="flex items-center justify-between py-3 mb-4 border-y border-[#E6C98F]/50">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#183D30] text-[#E6C98F] flex items-center justify-center border border-[#C9A66B]/40 shadow-xs shrink-0">
                    <ShieldCheck className="w-5 h-5 text-[#E6C98F]" />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold text-[#C9A66B] block">01 / DISCIPLINE</span>
                    <span className="font-editorial-meta text-[11px] font-semibold text-[#183D30] uppercase">ICAI Auditing Standards</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#7E5E1E] bg-[#FFF6E8] border border-[#E6C98F] px-2.5 py-1 rounded-md">
                  9 Audit Streams
                </span>
              </div>"""

c = c.replace(card1_old_img, card1_new_header)

# CARD 2: Remove img and add architectural icon header
card2_old_img = """              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden mb-5 border border-[#E6C98F]/70 bg-[#183D30]/10">
                <img
                  src="/images/ai-generated/services/taxation.webp"
                  alt="Corporate direct and indirect taxation, GST compliance and tax advisory"
                  width="1280"
                  height="720"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#183D30]/90 text-[#E6C98F] font-editorial-meta text-[10px] font-semibold border border-[#C9A66B]/30 backdrop-blur-xs">
                  Tax Strategy &amp; Defense
                </div>
              </div>"""

card2_new_header = """              <div className="flex items-center justify-between py-3 mb-4 border-y border-[#E6C98F]/50">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#FFF6E8] text-[#7E5E1E] flex items-center justify-center border border-[#E6C98F] shadow-xs shrink-0">
                    <FileText className="w-5 h-5 text-[#C9A66B]" />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold text-[#C9A66B] block">02 / DISCIPLINE</span>
                    <span className="font-editorial-meta text-[11px] font-semibold text-[#183D30] uppercase">Direct &amp; Indirect Tax</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#356B50] bg-[#FFF6E8] border border-[#E6C98F] px-2.5 py-1 rounded-md">
                  IT &amp; GST Acts
                </span>
              </div>"""

c = c.replace(card2_old_img, card2_new_header)

# CARD 3: Remove img and add architectural icon header
card3_old_img = """              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden mb-5 border border-[#E6C98F]/70 bg-[#183D30]/10">
                <img
                  src="/images/ai-generated/services/advisory.webp"
                  alt="Corporate structuring, company registration, and due diligence advisory"
                  width="1280"
                  height="720"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#183D30]/90 text-[#E6C98F] font-editorial-meta text-[10px] font-semibold border border-[#C9A66B]/30 backdrop-blur-xs">
                  MCA &amp; ROC Governance
                </div>
              </div>"""

card3_new_header = """              <div className="flex items-center justify-between py-3 mb-4 border-y border-[#E6C98F]/50">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#FFF6E8] text-[#7E5E1E] flex items-center justify-center border border-[#E6C98F] shadow-xs shrink-0">
                    <Building2 className="w-5 h-5 text-[#C9A66B]" />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold text-[#C9A66B] block">03 / DISCIPLINE</span>
                    <span className="font-editorial-meta text-[11px] font-semibold text-[#183D30] uppercase">MCA &amp; ROC Secretarial</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#356B50] bg-[#FFF6E8] border border-[#E6C98F] px-2.5 py-1 rounded-md">
                  Companies Act 2013
                </span>
              </div>"""

c = c.replace(card3_old_img, card3_new_header)

# CARD 4: Remove img and add architectural icon header
card4_old_img = """              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden mb-5 border border-[#C9A66B]/30 bg-[#153F32]">
                <img
                  src="/images/ai-generated/services/virtual-cfo.webp"
                  alt="Virtual CFO financial leadership, CMA cost modeling, and strategic controllership"
                  width="1280"
                  height="720"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#183D30]/90 text-[#E6C98F] font-editorial-meta text-[10px] font-semibold border border-[#C9A66B]/40 backdrop-blur-xs">
                  Strategic Retainer
                </div>
              </div>"""

card4_new_header = """              <div className="flex items-center justify-between py-3 mb-4 border-y border-[#356B50]">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#153F32] text-[#E6C98F] flex items-center justify-center border border-[#C9A66B]/40 shadow-xs shrink-0">
                    <Users className="w-5 h-5 text-[#E6C98F]" />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold text-[#E6C98F] block">04 / DISCIPLINE</span>
                    <span className="font-editorial-meta text-[11px] font-semibold text-emerald-100 uppercase">CFO &amp; Cost Controllership</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#E6C98F] bg-[#153F32] border border-[#C9A66B]/30 px-2.5 py-1 rounded-md">
                  CMA AIR 49 Merit
                </span>
              </div>"""

c = c.replace(card4_old_img, card4_new_header)

with open(file_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(c)

print("[OK] ServicesSection.tsx converted to minimalist typography-first layout (4 card images removed)")
