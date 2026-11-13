with open('src/pages/HomePage.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = None
end_idx = None
for i, line in enumerate(lines):
    if '{/* 3 Technical Publication Cards */}' in line:
        start_idx = i
    if start_idx is not None and '{/* View All Articles Action */}' in line:
        end_idx = i
        break

if start_idx is not None and end_idx is not None:
    print(f'Found block from line {start_idx+1} to {end_idx+1}')
    new_block = '''          {/* 3 Technical Publication Cards with Prominent Featured Images & 100% Clickable Surfaces */}
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
          </div>

'''
    new_lines = lines[:start_idx] + [new_block] + lines[end_idx:]
    with open('src/pages/HomePage.tsx', 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print('Replaced successfully')
else:
    print('Failed to find indices')
