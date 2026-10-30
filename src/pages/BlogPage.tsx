import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Search, 
  Tag, 
  ShieldCheck, 
  FileText,
  UserCheck,
  X,
  Sparkles
} from 'lucide-react';
import { BlogService, BlogPost } from '../services/blogService';
import { SEOHead } from '../components/SEOHead';

export const BlogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Retrieve strictly published posts (Layer 2 Draft Quarantine)
  const publishedPosts = useMemo(() => {
    return BlogService.getAllPosts(false);
  }, []);

  const allTags = useMemo(() => {
    return BlogService.getAllTags();
  }, []);

  // Designated featured post (latest published article)
  const featuredPost: BlogPost | undefined = publishedPosts.length > 0 ? publishedPosts[0] : undefined;

  // Live filter posts across 4 fields: title, excerpt, content, tags
  const filteredPosts = useMemo(() => {
    return publishedPosts.filter(post => {
      const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = q
        ? post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.content.toLowerCase().includes(q) ||
          post.tags.some(t => t.toLowerCase().includes(q))
        : true;
      return matchesTag && matchesQuery;
    });
  }, [publishedPosts, searchQuery, selectedTag]);

  return (
    <div className="bg-brand-ivory text-brand-charcoal min-h-screen page-reveal">
      <SEOHead
        title="Regulatory Insights & Technical Commentary | Kavitha & Associates"
        description="Authoritative tax, audit, GST, and corporate governance commentary prepared by CA Kavitha Vijay (ICAI Mem. 252985 | B.Com, CA, CMA AIR 49). Factual analysis for growing enterprises."
        canonicalPath="/blog"
      />

      {/* =========================================================================
          1. EDITORIAL HERO BANNER
          ========================================================================= */}
      <section className="bg-brand-surface py-20 sm:py-24 lg:py-28 border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-forest/10 text-brand-forest font-editorial-meta mb-4 border border-brand-forest/20 min-h-[44px]">
              <BookOpen className="w-3.5 h-3.5 text-brand-gold shrink-0" />
              <span>Technical Publications & Regulatory Insights • ICAI Mem. 252985</span>
            </div>
            <h1 className="font-editorial-h1 text-brand-forest tracking-tight">
              Regulatory Insights & Technical Commentary
            </h1>
            <p className="mt-4 font-editorial-body text-brand-muted leading-relaxed">
              Authoritative technical analysis on corporate statutory audits, GST reconciliation frameworks, Section 115BAA direct tax planning, and internal financial controls. Authored by CA Kavitha Vijay (ICAI Mem. 252985 | B.Com, CA, CMA AIR 49) under the informational pull model to foster fiscal governance and statutory compliance.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. ASYMMETRICAL FEATURED ARTICLE SHOWCASE CARD (DOUBLE-BEZEL ARCHITECTURE)
          ========================================================================= */}
      {featuredPost && !searchQuery && !selectedTag && (
        <section className="py-12 lg:py-16 border-b border-brand-border bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="double-bezel-dark animate-fade-up">
              <div className="double-bezel-inner-dark bg-brand-deep rounded-2xl p-7 sm:p-10 lg:p-12 text-white border border-white/10 shadow-editorial-lg relative overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  
                  {/* Left 7 Columns: Narrative & Metadata */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-forest border border-brand-gold/40 text-brand-gold font-editorial-meta min-h-[44px]">
                      <Sparkles className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>Featured Statutory Analysis • FY 2025-26</span>
                    </div>

                    <h2 className="font-editorial-h2 text-white leading-tight">
                      <Link to={`/blog/${featuredPost.slug}`} className="hover:text-brand-gold transition-colors">
                        {featuredPost.title}
                      </Link>
                    </h2>

                    <p className="font-editorial-body text-white/80 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-editorial-meta text-white/70">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                        <span>{new Date(featuredPost.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-brand-gold" />
                        <span>{featuredPost.readingTime} min read</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5 text-emerald-200">
                        <UserCheck className="w-3.5 h-3.5 text-brand-gold" />
                        <span>{featuredPost.author}</span>
                      </span>
                    </div>

                    <div className="pt-4">
                      <Link
                        to={`/blog/${featuredPost.slug}`}
                        className="btn-pill-action btn-tactile bg-brand-gold text-brand-deep hover:bg-white hover:text-brand-forest shadow-card font-semibold text-xs tracking-wide min-h-[44px]"
                      >
                        <span>Read Complete Analysis</span>
                        <span className="icon-badge bg-black/10 text-brand-deep">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* Right 5 Columns: Editorial Ledger Plaque */}
                  <div className="lg:col-span-5 bg-brand-forest/90 rounded-2xl p-6 sm:p-7 border border-brand-gold/30 backdrop-blur-sm space-y-5">
                    <div className="flex items-center justify-between pb-4 border-b border-brand-gold/20">
                      <div className="w-12 h-12 rounded-xl bg-brand-deep border border-brand-gold/40 flex items-center justify-center font-serif text-lg font-bold text-brand-gold shadow-sm">
                        KA
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

                    <div className="pt-2 text-xs text-emerald-100/80 leading-relaxed border-t border-brand-gold/20">
                      <strong className="text-white block font-medium mb-0.5">Author's Note</strong>
                      <p className="font-editorial-body text-xs text-emerald-100/80">
                        Structured technical walkthrough for corporate CFOs, finance directors, and compliance officers navigating Indian regulatory standards.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          3. INTERACTIVE SEARCH & CATEGORY FILTER CONTROLS
          ========================================================================= */}
      <section className="py-6 bg-brand-ivory/95 sticky top-20 z-20 border-b border-brand-border backdrop-blur-md shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Live Search Input with Instant Clear (X) Button */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-brand-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                aria-label="Search articles by title, excerpt, statute, or content"
                placeholder="Search by statute, title, excerpt, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-12 py-3 text-sm rounded-xl border border-brand-border bg-white text-brand-charcoal placeholder:text-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-forest focus:border-brand-forest transition-all shadow-subtle min-h-[44px]"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search input"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-muted hover:text-brand-forest transition-colors rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center btn-tactile"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills (WCAG 2.5.5 AAA min 44px Touch Targets) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedTag(null)}
                className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors btn-tactile flex items-center gap-1.5 ${
                  selectedTag === null
                    ? 'bg-brand-forest text-white shadow-subtle border border-brand-forest'
                    : 'bg-white text-brand-muted hover:bg-brand-surface hover:text-brand-forest border border-brand-border'
                }`}
              >
                <span>All Topics</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/10">
                  {publishedPosts.length}
                </span>
              </button>

              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors btn-tactile flex items-center gap-1.5 ${
                    selectedTag === tag
                      ? 'bg-brand-forest text-white shadow-subtle border border-brand-forest'
                      : 'bg-white text-brand-muted hover:bg-brand-surface hover:text-brand-forest border border-brand-border'
                  }`}
                >
                  <Tag className="w-3 h-3 opacity-70" />
                  <span>{tag}</span>
                </button>
              ))}
            </div>

          </div>

          {/* Active Filter Status */}
          {(searchQuery || selectedTag) && (
            <div className="mt-3 pt-3 border-t border-brand-border/60 flex items-center justify-between text-xs text-brand-muted font-editorial-meta">
              <div>
                Showing <strong className="text-brand-forest">{filteredPosts.length}</strong> {filteredPosts.length === 1 ? 'article' : 'articles'}
                {selectedTag && <> in category <strong className="text-brand-forest">"{selectedTag}"</strong></>}
                {searchQuery && <> matching <strong className="text-brand-forest">"{searchQuery}"</strong></>}
              </div>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedTag(null); }}
                className="text-xs font-semibold text-brand-forest hover:text-brand-deep underline min-h-[44px] inline-flex items-center btn-tactile"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          4. PUBLISHED ARTICLE CARDS GRID
          ========================================================================= */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {filteredPosts.length === 0 ? (
            <div className="max-w-lg mx-auto text-center py-16 bg-white rounded-2xl border border-brand-border shadow-card p-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-surface border border-brand-border flex items-center justify-center mx-auto text-brand-forest">
                <FileText className="w-7 h-7 stroke-1" />
              </div>
              <h3 className="font-editorial-h3 text-brand-forest">
                No matching articles found
              </h3>
              <p className="font-editorial-body text-xs sm:text-sm text-brand-muted leading-relaxed">
                We could not find any published articles matching "{searchQuery}". Try selecting another category or clear the active search filter.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setSelectedTag(null); }}
                  className="px-5 py-2.5 rounded-lg bg-brand-forest text-white text-xs font-semibold hover:bg-brand-deep transition-colors btn-tactile min-h-[44px] inline-flex items-center justify-center"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-2xl border border-brand-border shadow-card hover:shadow-card-hover card-tactile flex flex-col overflow-hidden group"
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
                        <span className="w-6 h-6 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center group-hover/link:bg-brand-forest group-hover/link:border-brand-forest transition-all">
                          <ArrowRight className="w-3.5 h-3.5 text-brand-gold group-hover/link:text-white group-hover/link:translate-x-0.5 transition-transform" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* =========================================================================
              5. REGULATORY ETHICS & COMPLIANCE NOTICE
              ========================================================================= */}
          <div className="mt-16 p-6 sm:p-8 rounded-2xl bg-brand-surface border border-brand-border flex items-start gap-4 shadow-subtle">
            <ShieldCheck className="w-6 h-6 text-brand-forest shrink-0 mt-0.5" />
            <div className="text-xs text-brand-muted leading-relaxed">
              <strong className="text-brand-forest block font-editorial-meta text-sm font-semibold mb-1">
                ICAI Guidelines & Ethics Notice
              </strong>
              <p className="font-editorial-body text-xs text-brand-muted">
                These technical articles are published by Kavitha & Associates strictly under the informational 'pull' model for general awareness and educational reference. They do not constitute statutory tax advice, legal counsel, or solicitation of professional services under the Chartered Accountants Act, 1949.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
export default BlogPage;
