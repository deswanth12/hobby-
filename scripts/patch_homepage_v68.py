import re

with open('src/pages/HomePage.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Update Hero section background to Deep Evergreen with architectural lines
c = c.replace(
    'bg-brand-ivory pt-6 xs:pt-8 sm:pt-14 lg:pt-16 pb-10 sm:pb-16 lg:pb-16 border-b border-brand-border relative overflow-hidden min-h-0 flex items-center texture-paper-grain',
    'bg-[#071B14] text-[#F1EBDD] pt-8 sm:pt-16 lg:pt-20 pb-12 sm:pb-18 lg:pb-20 border-b border-[#B49A64]/20 relative overflow-hidden min-h-0 flex items-center texture-architectural-lines'
)

# 2. Hero typography and colors
c = c.replace('text-brand-forest tracking-wide', 'text-[#B49A64] tracking-widest uppercase')
c = c.replace('bg-brand-surface border border-brand-border/80 shadow-xs', 'bg-[#0B241C] border border-[#B49A64]/30 shadow-xs')
c = c.replace('text-brand-forest font-semibold', 'text-[#F1EBDD] font-semibold')
c = c.replace('text-brand-forest', 'text-[#F1EBDD]')
c = c.replace('text-gold-dark font-serif italic mt-1.5 sm:mt-2 font-medium', 'text-[#B49A64] font-serif italic mt-1.5 sm:mt-2 font-medium')
c = c.replace('text-brand-charcoal/90', 'text-[#D8D0BE]')
c = c.replace('text-brand-muted', 'text-[#D8D0BE]')

# 3. Hero CTA buttons
c = c.replace(
    'Explore Practice Disciplines',
    'Explore Our Practice'
)

# 4. Hero Right-column framing
c = c.replace(
    'bg-[#FFF9EF]/90 border border-[#C5A059]/40 shadow-card',
    'bg-[#0B241C]/85 border border-[#B49A64]/30 shadow-2xl backdrop-blur-sm'
)
c = c.replace('border-[#C5A059]/60', 'border-[#B49A64]/60')
c = c.replace('border-[#E8D5B5]', 'border-[#B49A64]/30')
c = c.replace('bg-[#153F32]', 'bg-[#071B14]')
c = c.replace('text-brand-brightgold', 'text-[#B49A64]')
c = c.replace('text-brand-gold', 'text-[#B49A64]')

# 5. Quick-Jump Navigation Strip
c = c.replace('bg-[#FFFDF7]/95 backdrop-blur-md border-b border-[#E8D5B5]', 'bg-[#071B14]/95 backdrop-blur-md border-b border-[#B49A64]/25')
c = c.replace('bg-brand-forest text-brand-white border-brand-gold', 'bg-[#B49A64] text-[#071B14] border-[#B49A64]')
c = c.replace('bg-brand-white text-brand-forest border-brand-border hover:border-brand-gold', 'bg-[#0B241C] text-[#F1EBDD] border-[#B49A64]/30 hover:border-[#B49A64]')

# 6. Section 9 / Insights on Homepage: Update container and cards
c = c.replace(
    'bg-[#F8EFDF] border-b border-[#E8D5B5] relative overflow-hidden texture-warm-plaster\" id=\"insights-overview\"',
    'bg-[#F1EBDD] border-b border-[#D8D0BE] relative overflow-hidden texture-warm-ivory\" id=\"insights-overview\"'
)

# Replace the homepage recentArticles card block with the image-first stretched link cards
old_articles_loop = '''          {/* 3 Technical Publication Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 scroll-stagger">
            {recentArticles.map((article) => (
              <article
                key={article.slug}
                className="bg-[#FFF9EF] rounded-2xl border border-[#E8D5B5] shadow-card p-6 flex flex-col justify-between hover:border-[#C3A66B] transition-all duration-300 card-tactile scroll-reveal group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#7E5E1E] mb-3">
                    <span className="font-editorial-meta font-semibold uppercase tracking-wider bg-[#E8D5B5] px-2.5 py-0.5 rounded-full border border-[#C3A66B]/40 text-[10px]">
                      {article.tags[0] || 'Statutory Analysis'}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-[#525954]">
                      <Clock className="w-3 h-3 text-[#C3A66B]" />
                      <span>{article.readingTime} min read</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#153F32] group-hover:text-[#102D25] leading-snug line-clamp-2 transition-colors">
                    <Link to={`/blog/${article.slug}`} className="hover:underline">
                      {article.title}
                    </Link>
                  </h3>

                  <p className="font-editorial-body text-xs text-[#525954] mt-2.5 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E8D5B5] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#525954]">
                    <Calendar className="w-3.5 h-3.5 text-[#C3A66B]" />
                    <span>{new Date(article.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <Link
                    to={`/blog/${article.slug}`}
                    className="font-editorial-meta text-xs font-semibold text-[#153F32] group-hover:text-[#C3A66B] flex items-center gap-1 transition-colors"
                  >
                    <span>Read Briefing</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#C3A66B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>'''

new_articles_loop = '''          {/* 3 Technical Publication Cards with Prominent Featured Images & 100% Clickable Surfaces */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 scroll-stagger">
            {recentArticles.map((article) => (
              <article
                key={article.slug}
                className="bg-[#FAF7F0] rounded-2xl border border-[#D8D0BE] shadow-card flex flex-col justify-between hover:shadow-card-hover hover:border-[#B49A64] transition-all duration-300 relative overflow-hidden group scroll-reveal"
              >
                {/* 100% Stretched Full-Card Overlay Link */}
                <Link
                  to={`/blog/${article.slug}`}
                  className="absolute inset-0 z-10"
                  aria-label={`Read article: ${article.title}`}
                />

                <div>
                  {/* Aspect 16:10 Dominant Cover Image Frame */}
                  <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-[#071B14]/10">
                    <img
                      src={article.coverImage || '/images/ai-generated/about/document-review.webp'}
                      alt={`Featured analysis: ${article.title}`}
                      width="600"
                      height="375"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80 pointer-events-none" />
                    
                    {/* Floating Category Pill */}
                    <div className="absolute top-3 left-3 z-20 pointer-events-none">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#071B14]/85 backdrop-blur-md border border-[#B49A64]/40 text-[#F1EBDD] font-editorial-meta text-[10px] font-semibold uppercase tracking-wider shadow-sm">
                        {article.tags[0] || 'Statutory Analysis'}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-[#525954] mb-2.5">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3 text-[#B49A64]" />
                        <span>{article.readingTime} min read</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3 text-[#B49A64]" />
                        <span>{new Date(article.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </span>
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#35271F] group-hover:text-[#183529] group-hover:underline leading-snug line-clamp-2 transition-colors">
                      {article.title}
                    </h3>

                    <p className="font-editorial-body text-xs text-[#525954] mt-2.5 leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0 flex items-center justify-between text-xs relative z-20 pointer-events-none">
                  <span className="text-[11px] font-medium text-[#7E5E1E]">
                    CA Kavitha Vijay
                  </span>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#071B14]/5 text-[#183529] font-editorial-meta text-xs font-semibold group-hover:bg-[#183529] group-hover:text-white transition-all duration-300">
                    <span>Read Analysis</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </article>
            ))}
          </div>'''

# Normalize newlines
c_norm = c.replace('\r\n', '\n')
old_loop_norm = old_articles_loop.replace('\r\n', '\n')
new_loop_norm = new_articles_loop.replace('\r\n', '\n')

if old_loop_norm in c_norm:
    c_norm = c_norm.replace(old_loop_norm, new_loop_norm)
    print('Replaced articles loop successfully')
else:
    print('Warning: old_articles_loop not found exactly')

# 7. Contact Section on Homepage: Deep Evergreen
c_norm = c_norm.replace(
    'className=\"py-12 sm:py-16 md:py-20 lg:py-24 bg-brand-ivory border-b border-brand-border texture-ivory-paper relative overflow-hidden\" id=\"contact-section\"',
    'className=\"py-12 sm:py-16 md:py-20 lg:py-24 bg-[#071B14] text-[#F1EBDD] border-b border-[#B49A64]/20 texture-architectural-lines relative overflow-hidden\" id=\"contact-section\"'
)

with open('src/pages/HomePage.tsx', 'w', encoding='utf-8') as f:
    f.write(c_norm)

print('HomePage updated successfully')
