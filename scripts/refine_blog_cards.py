def refine_blog_cards():
    # 1. Update BlogPage.tsx
    path = 'src/pages/BlogPage.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    content_norm = content.replace('\r\n', '\n')

    old_article_block = '''                <article
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
                </article>'''

    new_article_block = '''                <article
                  key={post.slug}
                  className="bg-white rounded-2xl border border-brand-border shadow-card hover:shadow-card-hover card-tactile flex flex-col overflow-hidden group scroll-reveal relative transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Invisible Full-Card Stretched Link (Makes Entire Card 100% Clickable) */}
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

                    {/* Card Footer: Author & 6. Read More Link with Indicator */}
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
                </article>'''

    if old_article_block in content_norm:
        content_norm = content_norm.replace(old_article_block, new_article_block)
        print("Upgraded BlogPage article card with full-card clickability")
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content_norm.replace('\n', '\r\n'))
    else:
        print("WARNING: old_article_block not found in BlogPage.tsx")

    # 2. Update BlogArticlePage.tsx
    path_art = 'src/pages/BlogArticlePage.tsx'
    with open(path_art, 'r', encoding='utf-8') as f:
        art_content = f.read()

    art_content_norm = art_content.replace('\r\n', '\n')

    old_rel_block = '''              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 scroll-stagger">
                {relatedPosts.map((rel) => (
                  <article
                    key={rel.slug}
                    className="rounded-2xl bg-white border border-border shadow-subtle hover:shadow-card card-tactile flex flex-col justify-between overflow-hidden group scroll-reveal"
                  >
                    {/* Featured Cover Image (Clickable) */}
                    <Link
                      to={`/blog/${rel.slug}`}
                      className="block relative aspect-[16/10] w-full overflow-hidden bg-brand-surface border-b border-brand-border"
                      aria-label={`Read ${rel.title}`}
                    >
                      <img
                        src={rel.coverImage || '/uploads/blog/corporate-tax-planning-2026.webp'}
                        alt={rel.coverImageAlt || rel.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <span className="font-editorial-meta text-[10px] font-bold uppercase tracking-wider text-brand-gold bg-brand-forest/90 backdrop-blur-sm px-2.5 py-0.5 rounded border border-brand-gold/30 shadow-sm">
                          {rel.tags[0] || 'Regulatory'}
                        </span>
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-editorial-h3 text-sm sm:text-base font-bold text-brand-forest group-hover:text-emerald-800 transition-colors leading-snug line-clamp-2">
                          <Link to={`/blog/${rel.slug}`} className="hover:underline">
                            {rel.title}
                          </Link>
                        </h3>
                        <Link to={`/blog/${rel.slug}`} className="block mt-2 font-editorial-body text-xs text-brand-muted hover:text-brand-charcoal line-clamp-2 leading-relaxed">
                          {rel.excerpt}
                        </Link>
                      </div>

                      <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-editorial-meta text-brand-muted">
                        <span>{rel.readingTime} min read</span>
                        <Link
                          to={`/blog/${rel.slug}`}
                          className="text-brand-forest font-semibold hover:text-brand-deep group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1 min-h-[36px]"
                        >
                          <span>Read Analysis</span>
                          <ArrowRight className="w-3 h-3 text-brand-gold" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>'''

    new_rel_block = '''              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 scroll-stagger">
                {relatedPosts.map((rel) => (
                  <article
                    key={rel.slug}
                    className="rounded-2xl bg-white border border-border shadow-subtle hover:shadow-card card-tactile flex flex-col justify-between overflow-hidden group scroll-reveal relative transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Invisible Full-Card Stretched Link */}
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
                          <ArrowRight className="w-3 h-3 text-brand-gold group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>'''

    if old_rel_block in art_content_norm:
        art_content_norm = art_content_norm.replace(old_rel_block, new_rel_block)
        print("Upgraded BlogArticlePage related cards with full-card clickability")
        with open(path_art, 'w', encoding='utf-8') as f:
            f.write(art_content_norm.replace('\n', '\r\n'))
    else:
        print("WARNING: old_rel_block not found in BlogArticlePage.tsx")

refine_blog_cards()
