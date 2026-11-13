def update_featured():
    path_bp = 'src/pages/BlogPage.tsx'
    with open(path_bp, 'r', encoding='utf-8') as f:
        content = f.read()

    norm = content.replace('\r\n', '\n')

    # 1. Update excerpt link
    old_p = '''                    <p className="font-editorial-body text-white/80 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>'''
    new_p = '''                    <Link to={`/blog/${featuredPost.slug}`} className="block font-editorial-body text-white/80 hover:text-white transition-colors leading-relaxed">
                      {featuredPost.excerpt}
                    </Link>'''

    if old_p in norm:
        norm = norm.replace(old_p, new_p)
        print("Updated featured excerpt link in BlogPage.tsx")

    # 2. Update Right 5 Columns
    old_right = '''                  {/* Right 5 Columns: Editorial Ledger Plaque */}
                  <div className="lg:col-span-5 bg-brand-forest/90 rounded-2xl p-6 sm:p-7 border border-brand-gold/30 backdrop-blur-sm space-y-5">
                    <div className="flex items-center justify-between pb-4 border-b border-brand-gold/20">
                      <div className="w-12 h-12 flex items-center justify-center shrink-0">
                        <img 
                          src="/brand/ka-seal-medallion.webp" 
                          alt="KA Monogram Seal" 
                          width="48"
                          height="48"
                          loading="eager"
                          fetchPriority="high"
                          className="w-full h-full object-contain drop-shadow-sm"
                        />
                      </div>
                      <span className="font-editorial-meta text-brand-gold bg-black/30 px-3 py-1.5 rounded-full border border-brand-gold/30">
                        ICAI Standards SA 700
                      </span>
                    </div>

                    <div className="space-y-2">
                      <span className="font-editorial-meta text-brand-gold/90 block">
                        Statutory Focus Areas
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {featuredPost.tags.map(t => (
                          <span
                            key={t}
                            className="px-2.5 py-1 rounded-md bg-brand-deep/80 border border-brand-gold/30 text-[11px] font-semibold text-brand-gold"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 text-xs text-emerald-200/80 leading-relaxed border-t border-brand-gold/20">
                      <strong className="text-white block font-semibold mb-0.5">Author's Note</strong>
                      <p className="font-editorial-body text-xs text-emerald-100/70">
                        Structured technical walkthrough for corporate CFOs, finance directors, and compliance officers navigating Indian regulatory standards.
                      </p>
                    </div>
                  </div>'''

    new_right = '''                  {/* Right 5 Columns: Prominent Featured Article Cover Image (MotionSites Spec) */}
                  <div className="lg:col-span-5 relative group">
                    <Link
                      to={`/blog/${featuredPost.slug}`}
                      className="block relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden border border-brand-gold/30 shadow-card hover:shadow-xl transition-all duration-300"
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
                        <span className="font-editorial-meta text-brand-forest bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-brand-gold/40 text-xs font-bold shadow-sm">
                          {featuredPost.tags[0] || 'Statutory Analysis'}
                        </span>
                      </div>
                      <div className="absolute bottom-3.5 right-3.5 z-10 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-forest/95 text-brand-gold text-xs font-semibold backdrop-blur-md border border-brand-gold/40 shadow-sm group-hover:bg-brand-forest transition-colors">
                        <span>Read Full Analysis</span>
                        <ArrowRight className="w-3.5 h-3.5 text-brand-gold group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  </div>'''

    if old_right in norm:
        norm = norm.replace(old_right, new_right)
        print("Updated Right 5 Columns in BlogPage.tsx")
    else:
        print("WARNING: old_right not found in BlogPage.tsx")

    with open(path_bp, 'w', encoding='utf-8') as f:
        f.write(norm.replace('\n', '\r\n'))

update_featured()
