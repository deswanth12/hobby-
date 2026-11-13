import os
import re

# 1. Update src/pages/AboutPage.tsx
about_page_path = 'src/pages/AboutPage.tsx'
with open(about_page_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_sec_pattern = r'<section className="py-12 sm:py-16 md:py-20 lg:py-24 border-b border-\[#E9E0D2\] bg-\[#FBF7EF\] overflow-hidden">.*?</section>'

new_about_section = '''<section className="py-10 sm:py-14 lg:py-16 border-b border-[#E9E0D2] bg-[#FBF7EF] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* =========================================================================
                LEFT COLUMN: 3-IMAGE EDITORIAL PHOTOGRAPHY COLLAGE
                ========================================================================= */}
            <div className="lg:col-span-6 scroll-reveal-left">
              <div className="relative space-y-3 sm:space-y-4">
                
                {/* 1. Large Professional Indian Business Consultation Image */}
                <div className="rounded-2xl overflow-hidden shadow-card border border-[#E9E0D2] group bg-[#FFFDF8]">
                  <img
                    src="/images/about/consultation-main.webp"
                    alt="Professional Indian business consultation with CA Kavitha Vijay"
                    width="1200"
                    height="669"
                    loading="eager"
                    fetchPriority="high"
                    className="w-full h-64 sm:h-72 lg:h-80 object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>

                {/* 2 & 3. Two Companion Supporting Editorial Images */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {/* 2. Smaller Financial Document Review Image */}
                  <div className="rounded-2xl overflow-hidden shadow-subtle border border-[#E9E0D2] group bg-[#FFFDF8]">
                    <img
                      src="/images/about/document-review.webp"
                      alt="Financial document review and audit working papers"
                      width="1200"
                      height="669"
                      loading="lazy"
                      className="w-full h-32 sm:h-40 object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  </div>

                  {/* 3. Smaller Premium Office Interior Image */}
                  <div className="rounded-2xl overflow-hidden shadow-subtle border border-[#E9E0D2] group bg-[#FFFDF8]">
                    <img
                      src="/images/about/office-space.webp"
                      alt="Executive corporate strategy boardroom interior"
                      width="1200"
                      height="669"
                      loading="lazy"
                      className="w-full h-32 sm:h-40 object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* =========================================================================
                RIGHT COLUMN: EDITORIAL NARRATIVE, VALUE LABELS & STRENGTHS
                ========================================================================= */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-5 scroll-reveal-right">
              
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#183D30] text-[#C9A66B] font-editorial-meta text-xs border border-[#C9A66B]/40 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#C9A66B] motion-safe:animate-pulse" />
                <span className="tracking-widest uppercase font-semibold">ABOUT US</span>
              </div>

              {/* Single Main Heading H1 */}
              <h1 className="font-editorial-h1 text-2xl sm:text-3xl lg:text-4xl text-[#183D30] font-serif font-bold tracking-tight leading-tight">
                Professional Expertise. Personal Commitment.
              </h1>

              {/* Shortened Narrative */}
              <p className="font-editorial-body text-sm sm:text-base text-[#66665E] leading-relaxed">
                Founded by CA Kavitha Vijay, Kavitha &amp; Associates delivers statutory audit, direct tax, GST compliance, and corporate financial advisory services. We combine institutional rigor with personal attention to support businesses and institutions across India.
              </p>

              {/* Three Compact Value Labels */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#FFFDF8] border border-[#E9E0D2] shadow-subtle flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#356B50] shrink-0" />
                  <span className="text-xs font-semibold text-[#183D30]">Integrity First</span>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#FFFDF8] border border-[#E9E0D2] shadow-subtle flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C9A66B] shrink-0" />
                  <span className="text-xs font-semibold text-[#183D30]">Client Focused</span>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#FFFDF8] border border-[#E9E0D2] shadow-subtle flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#356B50] shrink-0" />
                  <span className="text-xs font-semibold text-[#183D30]">Professional Excellence</span>
                </div>
              </div>

              {/* Compact List of Three Professional Strengths */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-start gap-2.5">
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

                <div className="flex items-start gap-2.5">
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

                <div className="flex items-start gap-2.5">
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

              {/* Action Buttons & Navigation */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
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
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>'''

if re.search(old_sec_pattern, content, flags=re.DOTALL):
    new_content = re.sub(old_sec_pattern, new_about_section, content, flags=re.DOTALL)
    with open(about_page_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('Updated AboutPage.tsx successfully!')
else:
    print('Pattern not matched in AboutPage.tsx!')

# 2. Update src/components/AboutSection.tsx
about_sec_path = 'src/components/AboutSection.tsx'
about_sec_code = '''import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutSectionProps {
  showReadMore?: boolean;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ showReadMore = true }) => {
  return (
    <section className="py-10 sm:py-14 lg:py-16 bg-[#FBF7EF] border-b border-[#E9E0D2] overflow-hidden" id="about-us">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* =========================================================================
              LEFT COLUMN: 3-IMAGE EDITORIAL PHOTOGRAPHY COLLAGE
              ========================================================================= */}
          <div className="lg:col-span-6 scroll-reveal-left">
            <div className="relative space-y-3 sm:space-y-4">
              
              {/* 1. Large Professional Indian Business Consultation Image */}
              <div className="rounded-2xl overflow-hidden shadow-card border border-[#E9E0D2] group bg-[#FFFDF8]">
                <img
                  src="/images/about/consultation-main.webp"
                  alt="Professional Indian business consultation with CA Kavitha Vijay"
                  width="1200"
                  height="669"
                  loading="lazy"
                  className="w-full h-64 sm:h-72 lg:h-80 object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>

              {/* 2 & 3. Two Companion Supporting Editorial Images */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {/* 2. Smaller Financial Document Review Image */}
                <div className="rounded-2xl overflow-hidden shadow-subtle border border-[#E9E0D2] group bg-[#FFFDF8]">
                  <img
                    src="/images/about/document-review.webp"
                    alt="Financial document review and audit working papers"
                    width="1200"
                    height="669"
                    loading="lazy"
                    className="w-full h-32 sm:h-40 object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>

                {/* 3. Smaller Premium Office Interior Image */}
                <div className="rounded-2xl overflow-hidden shadow-subtle border border-[#E9E0D2] group bg-[#FFFDF8]">
                  <img
                    src="/images/about/office-space.webp"
                    alt="Executive corporate strategy boardroom interior"
                    width="1200"
                    height="669"
                    loading="lazy"
                    className="w-full h-32 sm:h-40 object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: EDITORIAL CONTENT, VALUE LABELS & STRENGTHS
              ========================================================================= */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5 scroll-reveal-right">
            
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#183D30] text-[#C9A66B] font-editorial-meta text-xs border border-[#C9A66B]/40 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#C9A66B] motion-safe:animate-pulse" />
              <span className="tracking-widest uppercase font-semibold">ABOUT US</span>
            </div>

            {/* Heading */}
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl text-[#183D30] font-serif font-bold tracking-tight leading-tight">
              Professional Expertise. Personal Commitment.
            </h2>

            {/* Shortened Narrative */}
            <p className="font-editorial-body text-sm sm:text-base text-[#66665E] leading-relaxed">
              Founded by CA Kavitha Vijay, Kavitha &amp; Associates delivers statutory audit, direct tax, GST compliance, and corporate financial advisory services. We combine institutional rigor with personal attention to support businesses and institutions across India.
            </p>

            {/* Three Compact Value Labels */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-2.5 sm:p-3 rounded-xl bg-[#FFFDF8] border border-[#E9E0D2] shadow-subtle flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#356B50] shrink-0" />
                <span className="text-xs font-semibold text-[#183D30]">Integrity First</span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-[#FFFDF8] border border-[#E9E0D2] shadow-subtle flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C9A66B] shrink-0" />
                <span className="text-xs font-semibold text-[#183D30]">Client Focused</span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-[#FFFDF8] border border-[#E9E0D2] shadow-subtle flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#356B50] shrink-0" />
                <span className="text-xs font-semibold text-[#183D30]">Professional Excellence</span>
              </div>
            </div>

            {/* Compact List of Three Professional Strengths */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#356B50]/10 text-[#356B50] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#356B50]" />
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

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#356B50]/10 text-[#356B50] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#356B50]" />
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

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#356B50]/10 text-[#356B50] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#356B50]" />
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

            {/* Action Buttons & Read More Navigation */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              {showReadMore && (
                <Link
                  to="/about"
                  className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#356B50] hover:bg-[#183D30] text-white font-editorial-meta text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm hover:shadow-md border border-[#C9A66B]/40 btn-tactile"
                >
                  <span>Read More About Us</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C9A66B]" />
                </Link>
              )}

              <Link
                to="/contact"
                className="min-h-[44px] inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#FFFDF8] hover:bg-[#F2E8D5] text-[#183D30] font-editorial-meta text-xs font-semibold tracking-wider uppercase transition-colors border border-[#E9E0D2] shadow-subtle btn-tactile"
              >
                <span>Schedule Consultation</span>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
'''

with open(about_sec_path, 'w', encoding='utf-8') as f:
    f.write(about_sec_code)
print('Updated AboutSection.tsx successfully!')
