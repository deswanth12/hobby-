import re

def update_blog_page():
    path = 'src/pages/BlogPage.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update Featured Showcase Card
    # Pattern matching the Right 5 Columns in featured card
    old_feat_right = '''                  {/* Right 5 Columns: Editorial Ledger Plaque */}
                  <div className="lg:col-span-5 bg-[#F8EFDF] rounded-2xl p-6 sm:p-7 border border-[#E8D5B5] space-y-5 text-[#252B27]">
                    <div className="flex items-center justify-between pb-4 border-b border-[#E8D5B5]">
                      <div className="w-12 h-12 flex items-center justify-center shrink-0 bg-white rounded-xl p-1.5 border border-[#C3A66B]/40 shadow-sm">
                        <img 
                          src="/brand/ca-india-logo.png" 
                          alt="Official CA India Logo" 
                          width="48"
                          height="48"
                          loading="eager"
                          fetchPriority="high"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="font-editorial-meta text-[#7E5E1E] bg-[#E8D5B5] px-3 py-1.5 rounded-full border border-[#C3A66B]/40 text-xs font-semibold">
                        ICAI Standards SA 700
                      </span>
                    </div>

                    <div className="space-y-2">
                      <span className="font-editorial-meta text-[#153F32] font-semibold block">
                        Statutory Focus Areas
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {featuredPost.tags.map(t => (
                          <span
                            key={t}
                            className="px-2.5 py-1 rounded-md bg-white border border-[#E8D5B5] text-[11px] font-semibold text-[#153F32]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 text-xs text-[#525954] leading-relaxed border-t border-[#E8D5B5]">
                      <strong className="text-[#153F32] block font-semibold mb-0.5">Author's Note</strong>
                      <p className="font-editorial-body text-xs text-[#525954]">
                        Structured technical walkthrough for corporate CFOs, finance directors, and compliance officers navigating Indian regulatory standards.
                      </p>
                    </div>
                  </div>'''

    new_feat_right = '''                  {/* Right 5 Columns: Prominent Featured Article Cover Image (Clickable) */}
                  <div className="lg:col-span-5 relative group">
                    <Link
                      to={`/blog/${featuredPost.slug}`}
                      className="block relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden border border-[#E8D5B5] shadow-card group-hover:shadow-xl transition-all duration-300"
                      aria-label={`Read featured article: ${featuredPost.title}`}
                    >
                      <img 
                        src={featuredPost.coverImage || '/uploads/blog/corporate-tax-planning-2026.webp'} 
                        alt={featuredPost.coverImageAlt || featuredPost.title} 
                        width="800"
                        height="600"
                        loading="eager"
                        fetchPriority="high"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                      <div className="absolute top-3.5 left-3.5 z-10">
                        <span className="font-editorial-meta text-[#153F32] bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-[#C3A66B]/50 text-xs font-bold shadow-sm">
                          {featuredPost.tags[0] || 'Statutory Analysis'}
                        </span>
                      </div>
                      <div className="absolute bottom-3.5 right-3.5 z-10 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#153F32]/95 text-brand-gold text-xs font-semibold backdrop-blur-sm border border-brand-gold/40 shadow-sm group-hover:bg-[#153F32] transition-colors">
                        <span>Read Full Analysis</span>
                        <ArrowRight className="w-3.5 h-3.5 text-brand-gold group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  </div>'''

    # Normalize CRLF
    content_norm = content.replace('\r\n', '\n')
    old_feat_norm = old_feat_right.replace('\r\n', '\n')
    new_feat_norm = new_feat_right.replace('\r\n', '\n')

    if old_feat_norm in content_norm:
        content_norm = content_norm.replace(old_feat_norm, new_feat_norm)
        print("Updated Featured Showcase Card in BlogPage.tsx")
    else:
        print("WARNING: old_feat_norm not found in BlogPage.tsx")

    # Update Featured Excerpt clickability
    old_feat_excerpt = '''                    <p className="font-editorial-body text-[#525954] leading-relaxed">
                      {featuredPost.excerpt}
                    </p>'''
    new_feat_excerpt = '''                    <Link to={`/blog/${featuredPost.slug}`} className="block font-editorial-body text-[#525954] hover:text-[#252B27] transition-colors leading-relaxed">
                      {featuredPost.excerpt}
                    </Link>'''
    if old_feat_excerpt in content_norm:
        content_norm = content_norm.replace(old_feat_excerpt, new_feat_excerpt)
        print("Updated Featured Excerpt Link in BlogPage.tsx")
    else:
        print("WARNING: old_feat_excerpt not found in BlogPage.tsx")

    # 2. Update Published Article Grid Card
    old_grid = '''              {filteredPosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-2xl border border-brand-border shadow-card hover:shadow-card-hover card-tactile flex flex-col overflow-hidden group scroll-reveal"
                >
                  {/* Card Visual Top Plaque */}
                  <div className="bg-brand-deep p-6 relative flex flex-col justify-between overflow-hidden border-b border-brand-border">
                    {/* Top Tag Badges */}
                    <div className="flex flex-wrap gap-1.5 relative z-10 mb-4">
                      {post.tags.slice(0, 2).map((t) => (
                        <span 
                          key={t}
                          className="px-2.5 py-0.5 rounded bg-brand-forest/90 border border-brand-gold/30 text-[10px] font-semibold text-brand-gold uppercase tracking-wider font-editorial-meta"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Monogram Seal & Author Header */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-brand-forest border border-brand-gold/40 flex items-center justify-center font-serif text-sm font-bold text-brand-gold shadow-sm">
                        KA
                      </div>
                      <span className="font-editorial-meta text-emerald-300">
                        Kavitha & Associates
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Meta stats */}
                      <div className="flex items-center gap-3 text-xs text-brand-muted mb-3 font-editorial-meta">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                          <span>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-brand-gold" />
                          <span>{post.readingTime} min read</span>
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-editorial-h3 text-brand-forest group-hover:text-brand-deep transition-colors leading-snug line-clamp-2">
                        <Link to={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>

                      {/* Excerpt */}
                      <p className="mt-3 font-editorial-body text-xs sm:text-sm text-brand-muted leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-4 border-t border-brand-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-brand-forest" />
                        <span className="text-xs font-semibold text-brand-forest">
                          {post.author}
                        </span>
                      </div>

                      <Link
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-forest hover:text-brand-deep group/link min-h-[44px]"
                      >
                        <span>Read Analysis</span>
                        <span className="w-6 h-6 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center group-hover/link:bg-brand-forest group-hover/link:border-brand-forest transition-colors duration-200">
                          <ArrowRight className="w-3.5 h-3.5 text-brand-gold group-hover/link:text-white group-hover/link:translate-x-0.5 transition-transform" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}'''

    new_grid = '''              {filteredPosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-2xl border border-brand-border shadow-card hover:shadow-card-hover card-tactile flex flex-col overflow-hidden group scroll-reveal"
                >
                  {/* 1. Prominent Featured Image (Clickable) */}
                  <Link
                    to={`/blog/${post.slug}`}
                    className="relative aspect-[16/10] w-full overflow-hidden bg-brand-surface border-b border-brand-border block group/img"
                    aria-label={`Read ${post.title}`}
                  >
                    <img
                      src={post.coverImage || '/uploads/blog/corporate-tax-planning-2026.webp'}
                      alt={post.coverImageAlt || post.title}
                      loading="lazy"
                      width="600"
                      height="375"
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* 2. Blog Category Badge Overlay */}
                    <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 2).map((t) => (
                        <span 
                          key={t}
                          className="px-2.5 py-1 rounded-md bg-brand-forest/90 backdrop-blur-sm border border-brand-gold/40 text-[10px] font-semibold text-brand-gold uppercase tracking-wider font-editorial-meta shadow-sm"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </Link>

                  {/* Card Body */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* 5. Publication Date & Reading Time (Small Metadata) */}
                      <div className="flex items-center gap-3 text-xs text-brand-muted mb-3 font-editorial-meta">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                          <span>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-brand-gold" />
                          <span>{post.readingTime} min read</span>
                        </span>
                      </div>

                      {/* 3. Article Title (Secondary Emphasis - Clickable) */}
                      <h3 className="font-editorial-h3 text-brand-forest group-hover:text-brand-deep transition-colors leading-snug line-clamp-2">
                        <Link to={`/blog/${post.slug}`} className="hover:underline">
                          {post.title}
                        </Link>
                      </h3>

                      {/* 4. Short Introductory Paragraph or Excerpt (Supporting Content - Clickable) */}
                      <Link
                        to={`/blog/${post.slug}`}
                        className="block mt-3 font-editorial-body text-xs sm:text-sm text-brand-muted hover:text-brand-charcoal transition-colors leading-relaxed line-clamp-3"
                      >
                        {post.excerpt}
                      </Link>
                    </div>

                    {/* Card Footer: Author & 6. Read More Link with Indicator */}
                    <div className="pt-4 border-t border-brand-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-brand-forest" />
                        <span className="text-xs font-semibold text-brand-forest">
                          {post.author}
                        </span>
                      </div>

                      <Link
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-forest hover:text-brand-deep group/link min-h-[44px]"
                      >
                        <span>Read More</span>
                        <span className="w-6 h-6 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center group-hover/link:bg-brand-forest group-hover/link:border-brand-forest transition-colors duration-200">
                          <ArrowRight className="w-3.5 h-3.5 text-brand-gold group-hover/link:text-white group-hover/link:translate-x-0.5 transition-transform" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}'''

    old_grid_norm = old_grid.replace('\r\n', '\n')
    new_grid_norm = new_grid.replace('\r\n', '\n')

    if old_grid_norm in content_norm:
        content_norm = content_norm.replace(old_grid_norm, new_grid_norm)
        print("Updated Published Article Grid in BlogPage.tsx")
    else:
        print("WARNING: old_grid_norm not found in BlogPage.tsx")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content_norm.replace('\n', '\r\n'))

update_blog_page()
