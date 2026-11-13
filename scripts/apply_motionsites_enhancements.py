import os

def update_files():
    # -------------------------------------------------------------
    # 1. Update src/pages/BlogPage.tsx
    # -------------------------------------------------------------
    path_bp = 'src/pages/BlogPage.tsx'
    with open(path_bp, 'r', encoding='utf-8') as f:
        bp_content = f.read()

    bp_norm = bp_content.replace('\r\n', '\n')

    # Update Featured Showcase Card Right 5 cols
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

    new_feat_right = '''                  {/* Right 5 Columns: Prominent Featured Article Cover Image (MotionSites Spec) */}
                  <div className="lg:col-span-5 relative group">
                    <Link
                      to={`/blog/${featuredPost.slug}`}
                      className="block relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden border border-[#E8D5B5] shadow-card group-hover:shadow-xl transition-all duration-300"
                      aria-label={`Read featured analysis: ${featuredPost.title}`}
                    >
                      <img 
                        src={featuredPost.coverImage || '/uploads/blog/statutory-audit-guidelines-2026.webp'} 
                        alt={featuredPost.coverImageAlt || featuredPost.title} 
                        width="800"
                        height="600"
                        loading="eager"
                        fetchPriority="high"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                      <div className="absolute top-3.5 left-3.5 z-10">
                        <span className="font-editorial-meta text-[#153F32] bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C3A66B]/50 text-xs font-bold shadow-sm">
                          {featuredPost.tags[0] || 'Statutory Analysis'}
                        </span>
                      </div>
                      <div className="absolute bottom-3.5 right-3.5 z-10 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#153F32]/95 text-brand-gold text-xs font-semibold backdrop-blur-md border border-brand-gold/40 shadow-sm group-hover:bg-[#153F32] transition-colors">
                        <span>Read Full Analysis</span>
                        <ArrowRight className="w-3.5 h-3.5 text-brand-gold group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  </div>'''

    if old_feat_right in bp_norm:
        bp_norm = bp_norm.replace(old_feat_right, new_feat_right)
        print("Updated Featured Card Right Column in BlogPage.tsx")

    # Update Featured excerpt link
    old_feat_p = '''                    <p className="font-editorial-body text-[#525954] leading-relaxed">
                      {featuredPost.excerpt}
                    </p>'''
    new_feat_p = '''                    <Link to={`/blog/${featuredPost.slug}`} className="block font-editorial-body text-[#525954] hover:text-[#153F32] transition-colors leading-relaxed">
                      {featuredPost.excerpt}
                    </Link>'''
    if old_feat_p in bp_norm:
        bp_norm = bp_norm.replace(old_feat_p, new_feat_p)
        print("Updated Featured Card Excerpt Link in BlogPage.tsx")

    # Update Published Cards Grid
    old_grid_block = '''              {filteredPosts.map((post) => (
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

    new_grid_block = '''              {filteredPosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-2xl border border-brand-border shadow-card hover:shadow-card-hover card-tactile flex flex-col overflow-hidden group scroll-reveal relative transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Invisible Full-Card Stretched Link (Entire Card Clickable per MotionSites Recipe) */}
                  <Link
                    to={`/blog/${post.slug}`}
                    className="absolute inset-0 z-10"
                    aria-label={`Read complete analysis: ${post.title}`}
                  />

                  {/* 1. Prominent Featured Image */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-brand-surface border-b border-brand-border block group/img">
                    <img
                      src={post.coverImage || '/uploads/blog/corporate-tax-planning-2026.webp'}
                      alt={post.coverImageAlt || post.title}
                      loading="lazy"
                      width="600"
                      height="375"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* 2. Blog Category Badge Overlay */}
                    <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5 pointer-events-none">
                      {post.tags.slice(0, 2).map((t) => (
                        <span 
                          key={t}
                          className="px-2.5 py-1 rounded-md bg-brand-forest/90 backdrop-blur-sm border border-brand-gold/40 text-[10px] font-semibold text-brand-gold uppercase tracking-wider font-editorial-meta shadow-sm"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

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

                      {/* 3. Article Title (Secondary Emphasis) */}
                      <h3 className="font-editorial-h3 text-brand-forest group-hover:text-brand-deep group-hover:underline transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h3>

                      {/* 4. Short Introductory Paragraph or Excerpt (Supporting Content) */}
                      <p className="mt-3 font-editorial-body text-xs sm:text-sm text-brand-muted group-hover:text-brand-charcoal transition-colors leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Card Footer: Author & 6. Read More Indicator */}
                    <div className="pt-4 border-t border-brand-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-brand-forest" />
                        <span className="text-xs font-semibold text-brand-forest">
                          {post.author}
                        </span>
                      </div>

                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-forest group-hover:text-brand-deep min-h-[44px]">
                        <span>Read More</span>
                        <span className="w-6 h-6 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center group-hover:bg-brand-forest group-hover:border-brand-forest transition-colors duration-200">
                          <ArrowRight className="w-3.5 h-3.5 text-brand-gold group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}'''

    if old_grid_block in bp_norm:
        bp_norm = bp_norm.replace(old_grid_block, new_grid_block)
        print("Updated Published Grid in BlogPage.tsx")

    with open(path_bp, 'w', encoding='utf-8') as f:
        f.write(bp_norm.replace('\n', '\r\n'))

    # -------------------------------------------------------------
    # 2. Update src/pages/BlogArticlePage.tsx
    # -------------------------------------------------------------
    path_ap = 'src/pages/BlogArticlePage.tsx'
    with open(path_ap, 'r', encoding='utf-8') as f:
        ap_content = f.read()

    ap_norm = ap_content.replace('\r\n', '\n')

    # Add Lead Executive Summary paragraph
    old_article_tag = '''          {/* Render Markdown Article Body */}
          <article className="bg-white rounded-2xl border border-border p-6 sm:p-12 shadow-card font-editorial-body text-charcoal scroll-reveal">'''

    new_article_tag = '''          {/* Full Introductory Lead Paragraph (MotionSites Executive Summary) */}
          {post.excerpt && (
            <div className="mb-8 p-6 sm:p-8 rounded-2xl bg-white border border-brand-border border-l-4 border-l-brand-gold shadow-card scroll-reveal">
              <span className="font-editorial-meta text-[11px] font-bold text-brand-gold uppercase tracking-wider block mb-2">
                Executive Statutory Summary &amp; Scope
              </span>
              <p className="font-editorial-body text-base sm:text-lg text-brand-charcoal font-medium leading-relaxed italic">
                {post.excerpt}
              </p>
            </div>
          )}

          {/* Render Markdown Article Body */}
          <article className="bg-white rounded-2xl border border-border p-6 sm:p-12 shadow-card font-editorial-body text-charcoal scroll-reveal">'''

    if old_article_tag in ap_norm:
        ap_norm = ap_norm.replace(old_article_tag, new_article_tag)
        print("Added Lead Executive Summary to BlogArticlePage.tsx")

    # Update Related Articles
    old_rel_block = '''              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 scroll-stagger">
                {relatedPosts.map((rel) => (
                  <Link
                    key={rel.slug}
                    to={`/blog/${rel.slug}`}
                    className="p-6 rounded-2xl bg-white border border-border shadow-subtle card-tactile flex flex-col justify-between group min-h-[44px] scroll-reveal"
                  >
                    <div>
                      <span className="font-editorial-meta text-[10px] font-bold uppercase tracking-wider text-gold-dark block mb-2">
                        {rel.tags[0] || 'Regulatory'}
                      </span>
                      <h3 className="font-editorial-h3 text-base font-bold text-brand-primary group-hover:text-emerald-800 transition-colors leading-snug line-clamp-2">
                        {rel.title}
                      </h3>
                      <p className="font-editorial-body mt-2.5 text-xs text-charcoal-muted line-clamp-3 leading-relaxed">
                        {rel.excerpt}
                      </p>
                    </div>
                    <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-editorial-meta text-charcoal-muted">
                      <span>{rel.readingTime} min read</span>
                      <span className="text-emerald-800 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        <span>Read</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>'''

    new_rel_block = '''              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 scroll-stagger">
                {relatedPosts.map((rel) => (
                  <article
                    key={rel.slug}
                    className="rounded-2xl bg-white border border-border shadow-subtle hover:shadow-card card-tactile flex flex-col justify-between overflow-hidden group scroll-reveal relative transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Invisible Full-Card Stretched Link (MotionSites Recipe) */}
                    <Link
                      to={`/blog/${rel.slug}`}
                      className="absolute inset-0 z-10"
                      aria-label={`Read article: ${rel.title}`}
                    />

                    {/* Featured Cover Image */}
                    <div className="block relative aspect-[16/10] w-full overflow-hidden bg-brand-surface border-b border-brand-border">
                      <img
                        src={rel.coverImage || '/uploads/blog/corporate-tax-planning-2026.webp'}
                        alt={rel.coverImageAlt || rel.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
                        <span className="font-editorial-meta text-[10px] font-bold uppercase tracking-wider text-brand-gold bg-brand-forest/90 backdrop-blur-sm px-2.5 py-0.5 rounded border border-brand-gold/30 shadow-sm">
                          {rel.tags[0] || 'Regulatory'}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-editorial-h3 text-sm sm:text-base font-bold text-brand-forest group-hover:text-emerald-800 group-hover:underline transition-colors leading-snug line-clamp-2">
                          {rel.title}
                        </h3>
                        <p className="mt-2 font-editorial-body text-xs text-brand-muted group-hover:text-brand-charcoal line-clamp-2 leading-relaxed">
                          {rel.excerpt}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-editorial-meta text-brand-muted">
                        <span>{rel.readingTime} min read</span>
                        <div className="text-brand-forest font-semibold group-hover:text-emerald-800 transition-colors inline-flex items-center gap-1 min-h-[36px]">
                          <span>Read Analysis</span>
                          <ArrowRight className="w-3.5 h-3.5 text-brand-gold group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>'''

    if old_rel_block in ap_norm:
        ap_norm = ap_norm.replace(old_rel_block, new_rel_block)
        print("Updated Related Articles in BlogArticlePage.tsx")

    with open(path_ap, 'w', encoding='utf-8') as f:
        f.write(ap_norm.replace('\n', '\r\n'))

update_files()
