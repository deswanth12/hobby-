with open('src/pages/AboutPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Section 1 in AboutPage.tsx
old_sec1_start = "      {/* =========================================================================\n          SECTION 1: ABOUT HERO"
old_sec1_end = "      {/* =========================================================================\n          SECTION 2: FIRM INTRODUCTION"

start_idx = content.find(old_sec1_start)
end_idx = content.find(old_sec1_end)

if start_idx != -1 and end_idx != -1:
    new_sec1 = """      {/* =========================================================================
          SECTION 1: ABOUT US (Two-Column Editorial Collage & Overview)
          Canvas: Warm Cream #FBF7EF
          ========================================================================= */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 border-b border-[#E9E0D2] bg-[#FBF7EF] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* =========================================================================
                LEFT COLUMN: 3-IMAGE EDITORIAL COLLAGE WITH VERIFIED CREDENTIAL
                ========================================================================= */}
            <div className="lg:col-span-6 scroll-reveal-left">
              <div className="relative">
                
                {/* Primary Main Image: Sunlit Executive Practice Chambers */}
                <div className="relative rounded-2xl overflow-hidden shadow-card border border-[#E9E0D2] group">
                  <img
                    src="/images/about/office-interior.webp"
                    alt="Kavitha &amp; Associates Executive Practice Chambers"
                    width="1200"
                    height="630"
                    loading="eager"
                    fetchPriority="high"
                    className="w-full h-64 sm:h-72 lg:h-80 object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>

                {/* Two Companion Supporting Images */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                  <div className="rounded-2xl overflow-hidden shadow-subtle border border-[#E9E0D2] group">
                    <img
                      src="/images/about/leadership-space.webp"
                      alt="Corporate Financial Advisory Boardroom"
                      width="1200"
                      height="630"
                      loading="lazy"
                      className="w-full h-32 sm:h-40 object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-subtle border border-[#E9E0D2] group">
                    <img
                      src="/images/services/advisory.webp"
                      alt="Strategic Tax Planning &amp; Compliance Suite"
                      width="1200"
                      height="630"
                      loading="lazy"
                      className="w-full h-32 sm:h-40 object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  </div>
                </div>

                {/* Compact Verified Achievement Highlight Badge */}
                <div className="absolute top-3 right-3 sm:top-5 sm:right-5 bg-[#FFFDF8] p-3 sm:p-4 rounded-xl border border-[#E9E0D2] shadow-editorial-md max-w-[200px] sm:max-w-[220px]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-5 h-5 rounded-md bg-[#356B50]/10 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#356B50]" />
                    </div>
                    <span className="font-editorial-meta text-[10px] font-semibold text-[#C9A66B] uppercase tracking-wider">
                      Verified Practice
                    </span>
                  </div>
                  <p className="font-serif text-xs sm:text-sm font-bold text-[#183D30] leading-snug">
                    Dual CA &amp; CMA (AIR 49)
                  </p>
                  <span className="font-editorial-meta text-[10px] text-[#66665E] block mt-0.5">
                    100% Partner-Led Supervision
                  </span>
                </div>

              </div>
            </div>

            {/* =========================================================================
                RIGHT COLUMN: EDITORIAL NARRATIVE, VALUE LABELS & STRENGTHS
                ========================================================================= */}
            <div className="lg:col-span-6 space-y-5 scroll-reveal-right">
              
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#183D30] text-[#C9A66B] font-editorial-meta text-xs border border-[#C9A66B]/40 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#C9A66B] motion-safe:animate-pulse" />
                <span className="tracking-widest uppercase font-semibold">ABOUT US</span>
              </div>

              {/* Single Main Heading H1 */}
              <h1 className="font-editorial-h1 text-2xl sm:text-3xl lg:text-4xl text-[#183D30] font-serif font-bold tracking-tight leading-tight">
                Professional Expertise. Personal Commitment.
              </h1>

              {/* Short Narrative */}
              <p className="font-editorial-body text-sm sm:text-base text-[#66665E] leading-relaxed">
                Founded by CA Kavitha Vijay, Kavitha &amp; Associates is an established Chartered Accountancy practice delivering statutory audit, direct tax counsel, GST compliance, and corporate financial advisory services across India. We combine institutional rigor with personal attention to support businesses, startups, and institutions nationwide.
              </p>

              {/* Three Compact Value Labels */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="p-3 rounded-xl bg-[#FFFDF8] border border-[#E9E0D2] shadow-subtle flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#356B50] shrink-0" />
                  <span className="text-xs font-semibold text-[#183D30]">Integrity First</span>
                </div>
                <div className="p-3 rounded-xl bg-[#FFFDF8] border border-[#E9E0D2] shadow-subtle flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C9A66B] shrink-0" />
                  <span className="text-xs font-semibold text-[#183D30]">Client Focused</span>
                </div>
                <div className="p-3 rounded-xl bg-[#FFFDF8] border border-[#E9E0D2] shadow-subtle flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#356B50] shrink-0" />
                  <span className="text-xs font-semibold text-[#183D30]">Professional Excellence</span>
                </div>
              </div>

              {/* Compact List of Three Professional Strengths */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#356B50]/10 text-[#356B50] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#356B50]" />
                  </div>
                  <div>
                    <strong className="text-xs sm:text-sm font-semibold text-[#183D30] block">
                      Dual CA &amp; CMA Strategic Advantage
                    </strong>
                    <p className="text-xs text-[#66665E] leading-relaxed">
                      Integrating statutory audit reporting with internal cost management, unit economics, and working capital modeling.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#356B50]/10 text-[#356B50] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#356B50]" />
                  </div>
                  <div>
                    <strong className="text-xs sm:text-sm font-semibold text-[#183D30] block">
                      Direct Senior Partner Supervision
                    </strong>
                    <p className="text-xs text-[#66665E] leading-relaxed">
                      Every audit memo, scrutiny defense brief, and regulatory return is personally directed by CA Kavitha Vijay.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#356B50]/10 text-[#356B50] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#356B50]" />
                  </div>
                  <div>
                    <strong className="text-xs sm:text-sm font-semibold text-[#183D30] block">
                      Pan-India Digital &amp; On-Site Practice
                    </strong>
                    <p className="text-xs text-[#66665E] leading-relaxed">
                      Seamless virtual compliance pipelines and encrypted collaboration serving clients across all states and Union Territories.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons & "Read More" Navigation */}
              <div className="pt-3 flex flex-wrap items-center gap-3.5">
                <a
                  href="#firm-overview"
                  className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#356B50] hover:bg-[#183D30] text-white font-editorial-meta text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm hover:shadow-md border border-[#C9A66B]/40 btn-tactile"
                >
                  <span>Read More About Us</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C9A66B]" />
                </a>

                <Link
                  to="/contact"
                  className="min-h-[44px] inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#FFFDF8] hover:bg-[#F2E8D5] text-[#183D30] font-editorial-meta text-xs font-semibold tracking-wider uppercase transition-colors border border-[#E9E0D2] shadow-subtle btn-tactile"
                >
                  <span>Schedule Consultation</span>
                  <span className="text-[#C9A66B]">→</span>
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>\n\n"""

    content = content[:start_idx] + new_sec1 + content[end_idx:]

    # Also make sure Section 2 has id="firm-overview"
    content = content.replace(
        '<section className="py-14 sm:py-18 md:py-20 bg-[#FFFDF8] border-b border-[#E9E0D2]">',
        '<section id="firm-overview" className="py-14 sm:py-18 md:py-20 bg-[#FFFDF8] border-b border-[#E9E0D2] scroll-mt-28">'
    )

    with open('src/pages/AboutPage.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Section 1 in AboutPage.tsx successfully redesigned to CARVI-inspired collage!")
else:
    print(f"Could not locate Section 1 markers: start_idx={start_idx}, end_idx={end_idx}")
