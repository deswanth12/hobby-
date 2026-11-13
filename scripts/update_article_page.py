def update_article_page():
    path = 'src/pages/BlogArticlePage.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    content_norm = content.replace('\r\n', '\n')

    # 1. Add introductory lead paragraph before <article
    old_article_start = '''          {/* Render Markdown Article Body */}
          <article className="bg-white rounded-2xl border border-border p-6 sm:p-12 shadow-card font-editorial-body text-charcoal scroll-reveal">'''

    new_article_start = '''          {/* Full Introductory Lead Paragraph (Executive Summary / Scope) */}
          {post.excerpt && (
            <div className="mb-8 p-6 sm:p-8 rounded-2xl bg-white border border-brand-border border-l-4 border-l-brand-gold shadow-card scroll-reveal">
              <span className="font-editorial-meta text-[11px] font-bold text-brand-gold uppercase tracking-wider block mb-2">
                Executive Statutory Summary & Scope
              </span>
              <p className="font-editorial-body text-base sm:text-lg text-brand-charcoal font-medium leading-relaxed italic">
                {post.excerpt}
              </p>
            </div>
          )}

          {/* Render Markdown Article Body */}
          <article className="bg-white rounded-2xl border border-border p-6 sm:p-12 shadow-card font-editorial-body text-charcoal scroll-reveal">'''

    if old_article_start in content_norm:
        content_norm = content_norm.replace(old_article_start, new_article_start)
        print("Added Lead Introductory Paragraph to BlogArticlePage.tsx")
    else:
        print("WARNING: old_article_start not found in BlogArticlePage.tsx")

    # 2. Upgrade Related Publications
    old_related = '''              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 scroll-stagger">
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

    new_related = '''              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 scroll-stagger">
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

    if old_related in content_norm:
        content_norm = content_norm.replace(old_related, new_related)
        print("Updated Related Publications in BlogArticlePage.tsx")
    else:
        print("WARNING: old_related not found in BlogArticlePage.tsx")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content_norm.replace('\n', '\r\n'))

update_article_page()
