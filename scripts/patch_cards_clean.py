def patch():
    # 1. BlogPage.tsx
    with open('src/pages/BlogPage.tsx', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    start_idx = -1
    end_idx = -1
    for i, line in enumerate(lines):
        if '{filteredPosts.map((post) => (' in line:
            start_idx = i
        if start_idx != -1 and '))}' in line and i > start_idx:
            end_idx = i
            break

    print(f"BlogPage.tsx grid slice: lines {start_idx} to {end_idx}")

    new_grid_lines = [
        "              {filteredPosts.map((post) => (\n",
        "                <article\n",
        "                  key={post.slug}\n",
        "                  className=\"bg-white rounded-2xl border border-brand-border shadow-card hover:shadow-card-hover card-tactile flex flex-col overflow-hidden group scroll-reveal relative transition-all duration-300 hover:-translate-y-1\"\n",
        "                >\n",
        "                  {/* Invisible Full-Card Stretched Link (Makes Entire Card 100% Clickable) */}\n",
        "                  <Link\n",
        "                    to={`/blog/${post.slug}`}\n",
        "                    className=\"absolute inset-0 z-10\"\n",
        "                    aria-label={`Read complete analysis: ${post.title}`}\n",
        "                  />\n",
        "\n",
        "                  {/* 1. Prominent Featured Image */}\n",
        "                  <div className=\"relative aspect-[16/10] w-full overflow-hidden bg-brand-surface border-b border-brand-border block group/img\">\n",
        "                    <img\n",
        "                      src={post.coverImage || '/uploads/blog/corporate-tax-planning-2026.webp'}\n",
        "                      alt={post.coverImageAlt || post.title}\n",
        "                      loading=\"lazy\"\n",
        "                      width=\"600\"\n",
        "                      height=\"375\"\n",
        "                      className=\"w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105\"\n",
        "                    />\n",
        "                    <div className=\"absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300\" />\n",
        "                    \n",
        "                    {/* 2. Blog Category Badge Overlay */}\n",
        "                    <div className=\"absolute top-3 left-3 z-20 flex flex-wrap gap-1.5 pointer-events-none\">\n",
        "                      {post.tags.slice(0, 2).map((t) => (\n",
        "                        <span \n",
        "                          key={t}\n",
        "                          className=\"px-2.5 py-1 rounded-md bg-brand-forest/90 backdrop-blur-sm border border-brand-gold/40 text-[10px] font-semibold text-brand-gold uppercase tracking-wider font-editorial-meta shadow-sm\"\n",
        "                        >\n",
        "                          {t}\n",
        "                        </span>\n",
        "                      ))}\n",
        "                    </div>\n",
        "                  </div>\n",
        "\n",
        "                  {/* Card Body */}\n",
        "                  <div className=\"p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4\">\n",
        "                    <div>\n",
        "                      {/* 5. Publication Date & Reading Time (Small Metadata) */}\n",
        "                      <div className=\"flex items-center gap-3 text-xs text-brand-muted mb-3 font-editorial-meta\">\n",
        "                        <span className=\"flex items-center gap-1\">\n",
        "                          <Calendar className=\"w-3.5 h-3.5 text-brand-gold\" />\n",
        "                          <span>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>\n",
        "                        </span>\n",
        "                        <span>•</span>\n",
        "                        <span className=\"flex items-center gap-1\">\n",
        "                          <Clock className=\"w-3.5 h-3.5 text-brand-gold\" />\n",
        "                          <span>{post.readingTime} min read</span>\n",
        "                        </span>\n",
        "                      </div>\n",
        "\n",
        "                      {/* 3. Article Title (Secondary Emphasis) */}\n",
        "                      <h3 className=\"font-editorial-h3 text-brand-forest group-hover:text-brand-deep group-hover:underline transition-colors leading-snug line-clamp-2\">\n",
        "                        {post.title}\n",
        "                      </h3>\n",
        "\n",
        "                      {/* 4. Short Introductory Paragraph or Excerpt (Supporting Content) */}\n",
        "                      <p className=\"mt-3 font-editorial-body text-xs sm:text-sm text-brand-muted group-hover:text-brand-charcoal transition-colors leading-relaxed line-clamp-3\">\n",
        "                        {post.excerpt}\n",
        "                      </p>\n",
        "                    </div>\n",
        "\n",
        "                    {/* Card Footer: Author & 6. Read More Link with Indicator */}\n",
        "                    <div className=\"pt-4 border-t border-brand-border flex items-center justify-between\">\n",
        "                      <div className=\"flex items-center gap-2\">\n",
        "                        <UserCheck className=\"w-4 h-4 text-brand-forest\" />\n",
        "                        <span className=\"text-xs font-semibold text-brand-forest\">\n",
        "                          {post.author}\n",
        "                        </span>\n",
        "                      </div>\n",
        "\n",
        "                      <div className=\"inline-flex items-center gap-1.5 text-xs font-bold text-brand-forest group-hover:text-brand-deep min-h-[44px]\">\n",
        "                        <span>Read More</span>\n",
        "                        <span className=\"w-6 h-6 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center group-hover:bg-brand-forest group-hover:border-brand-forest transition-colors duration-200\">\n",
        "                          <ArrowRight className=\"w-3.5 h-3.5 text-brand-gold group-hover:text-white group-hover:translate-x-0.5 transition-transform\" />\n",
        "                        </span>\n",
        "                      </div>\n",
        "                    </div>\n",
        "                  </div>\n",
        "                </article>\n",
        "              ))}\n"
    ]

    lines[start_idx:end_idx+1] = new_grid_lines
    with open('src/pages/BlogPage.tsx', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print("BlogPage.tsx patched successfully!")

    # 2. BlogArticlePage.tsx
    with open('src/pages/BlogArticlePage.tsx', 'r', encoding='utf-8') as f:
        art_lines = f.readlines()

    art_start_idx = -1
    art_end_idx = -1
    for i, line in enumerate(art_lines):
        if '{relatedPosts.map((rel) => (' in line:
            art_start_idx = i
        if art_start_idx != -1 and '))}' in line and i > art_start_idx:
            art_end_idx = i
            break

    print(f"BlogArticlePage.tsx related slice: lines {art_start_idx} to {art_end_idx}")

    new_rel_lines = [
        "                {relatedPosts.map((rel) => (\n",
        "                  <article\n",
        "                    key={rel.slug}\n",
        "                    className=\"rounded-2xl bg-white border border-border shadow-subtle hover:shadow-card card-tactile flex flex-col justify-between overflow-hidden group scroll-reveal relative transition-all duration-300 hover:-translate-y-1\"\n",
        "                  >\n",
        "                    {/* Invisible Full-Card Stretched Link */}\n",
        "                    <Link\n",
        "                      to={`/blog/${rel.slug}`}\n",
        "                      className=\"absolute inset-0 z-10\"\n",
        "                      aria-label={`Read article: ${rel.title}`}\n",
        "                    />\n",
        "\n",
        "                    {/* Featured Cover Image */}\n",
        "                    <div className=\"block relative aspect-[16/10] w-full overflow-hidden bg-brand-surface border-b border-brand-border\">\n",
        "                      <img\n",
        "                        src={rel.coverImage || '/uploads/blog/corporate-tax-planning-2026.webp'}\n",
        "                        alt={rel.coverImageAlt || rel.title}\n",
        "                        loading=\"lazy\"\n",
        "                        className=\"w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105\"\n",
        "                      />\n",
        "                      <div className=\"absolute top-2.5 left-2.5 z-20 pointer-events-none\">\n",
        "                        <span className=\"font-editorial-meta text-[10px] font-bold uppercase tracking-wider text-brand-gold bg-brand-forest/90 backdrop-blur-sm px-2.5 py-0.5 rounded border border-brand-gold/30 shadow-sm\">\n",
        "                          {rel.tags[0] || 'Regulatory'}\n",
        "                        </span>\n",
        "                      </div>\n",
        "                    </div>\n",
        "\n",
        "                    {/* Content */}\n",
        "                    <div className=\"p-5 flex-1 flex flex-col justify-between space-y-3\">\n",
        "                      <div>\n",
        "                        <h3 className=\"font-editorial-h3 text-sm sm:text-base font-bold text-brand-forest group-hover:text-emerald-800 group-hover:underline transition-colors leading-snug line-clamp-2\">\n",
        "                          {rel.title}\n",
        "                        </h3>\n",
        "                        <p className=\"mt-2 font-editorial-body text-xs text-brand-muted group-hover:text-brand-charcoal line-clamp-2 leading-relaxed\">\n",
        "                          {rel.excerpt}\n",
        "                        </p>\n",
        "                      </div>\n",
        "\n",
        "                      <div className=\"pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-editorial-meta text-brand-muted\">\n",
        "                        <span>{rel.readingTime} min read</span>\n",
        "                        <div className=\"text-brand-forest font-semibold group-hover:text-emerald-800 transition-colors inline-flex items-center gap-1 min-h-[36px]\">\n",
        "                          <span>Read Analysis</span>\n",
        "                          <ArrowRight className=\"w-3.5 h-3.5 text-brand-gold group-hover:translate-x-0.5 transition-transform\" />\n",
        "                        </div>\n",
        "                      </div>\n",
        "                    </div>\n",
        "                  </article>\n",
        "                ))}\n"
    ]

    art_lines[art_start_idx:art_end_idx+1] = new_rel_lines
    with open('src/pages/BlogArticlePage.tsx', 'w', encoding='utf-8') as f:
        f.writelines(art_lines)
    print("BlogArticlePage.tsx patched successfully!")

patch()
