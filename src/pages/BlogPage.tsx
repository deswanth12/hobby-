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
    <div className="bg-[#F1EBDD] text-[#35271F] min-h-screen page-reveal texture-warm-ivory">
      <SEOHead
        title="Tax & Regulatory Insights | CA Kavitha & Associates Tirupati"
        description="Authoritative Indian direct tax, GST compliance, and statutory audit insights by CA Kavitha Vijay (B.Com, CA, CMA AIR 49) for businesses and founders."
        canonicalPath="/blog"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Regulatory Insights', path: '/blog' }
        ]}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Kavitha & Associates Regulatory Insights',
          url: 'https://kavithaassociates.com/blog',
          description: 'Technical commentary on Direct Taxation, GST Compliance, Corporate Governance, and ICAI Auditing Standards.',
          publisher: {
            '@type': 'Organization',
            name: 'Kavitha & Associates'
          }
        }}
      />

      {/* =========================================================================
          1. EDITORIAL HERO BANNER
          ========================================================================= */}
      <section className="bg-[#071B14] text-[#F1EBDD] py-12 sm:py-16 md:py-20 border-b border-[#B49A64]/25 texture-architectural-lines">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B241C] text-[#B49A64] font-editorial-meta mb-4 border border-[#B49A64]/40 min-h-[44px]">
              <BookOpen className="w-3.5 h-3.5 text-[#B49A64] shrink-0" />
              <span>Technical Publications & Regulatory Insights • Tirupati Chambers</span>
            </div>
            <h1 className="font-editorial-h1 text-[#F1EBDD]">
              Regulatory Insights & Technical Commentary
            </h1>
            <p className="mt-4 font-editorial-body text-[#D8D0BE] leading-relaxed">
              Authoritative technical analysis on corporate statutory audits, GST reconciliation frameworks, Section 115BAA direct tax planning, and internal financial controls. Authored by CA Kavitha Vijay (B.Com, CA, CMA AIR 49) under the informational pull model to foster fiscal governance and statutory compliance.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. ASYMMETRICAL FEATURED ARTICLE SHOWCASE CARD (DOUBLE-BEZEL ARCHITECTURE)
          ========================================================================= */}
      {featuredPost && !searchQuery && !selectedTag && (
        <section className="py-12 lg:py-16 border-b border-[#D8D0BE] bg-[#F1EBDD]/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="double-bezel-dark scroll-reveal scroll-reveal-scale">
              <div 
                className="double-bezel-inner-dark bg-brand-deep rounded-2xl p-7 sm:p-10 lg:p-12 text-white border border-white/10 shadow-editorial-lg relative overflow-hidden"
                style={{ backgroundColor: '#071B14', color: '#F1EBDD' }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  
                  {/* Left 7 Columns: Narrative & Metadata */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-forest border border-brand-gold/40 text-[#B49A64] font-editorial-meta min-h-[44px]">
                      <Sparkles className="w-3.5 h-3.5 text-[#B49A64] shrink-0" />
                      <span>Featured Statutory Analysis • FY 2025-26</span>
                    </div>

                    <h2 className="font-editorial-h2 text-white leading-tight">
                      <Link to={`/blog/${featuredPost.slug}`} className="hover:text-[#B49A64] transition-colors">
                        {featuredPost.title}
                      </Link>
                    </h2>

                    <Link to={`/blog/${featuredPost.slug}`} className="block font-editorial-body text-white/80 hover:text-white transition-colors leading-relaxed">
                      {featuredPost.excerpt}
                    </Link>

                    <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-editorial-meta text-white/70">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#B49A64]" />
                        <span>{new Date(featuredPost.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#B49A64]" />
                        <span>{featuredPost.readingTime} min read</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5 text-emerald-200">
                        <UserCheck className="w-3.5 h-3.5 text-[#B49A64]" />
                        <span>{featuredPost.author}</span>
                      </span>
                    </div>

                    <div className="pt-4">
                      <Link
                        to={`/blog/${featuredPost.slug}`}
                        className="btn-pill-action btn-tactile bg-brand-gold text-brand-deep hover:bg-white hover:text-[#F1EBDD] shadow-card font-semibold text-xs tracking-wide min-h-[44px]"
                      >
                        <span>Read Complete Analysis</span>
                        <span className="icon-badge bg-black/10 text-brand-deep">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* Right 5 Columns: Prominent Featured Article Cover Image (MotionSites Spec) */}
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
                        <span className="font-editorial-meta text-[#F1EBDD] bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-brand-gold/40 text-xs font-bold shadow-sm">
                          {featuredPost.tags[0] || 'Statutory Analysis'}
                        </span>
                      </div>
                      <div className="absolute bottom-3.5 right-3.5 z-10 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-forest/95 text-[#B49A64] text-xs font-semibold backdrop-blur-md border border-brand-gold/40 shadow-sm group-hover:bg-brand-forest transition-colors">
                        <span>Read Full Analysis</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#B49A64] group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
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
      <section className="py-6 bg-brand-ivory/95 sticky top-20 z-20 border-b border-[#D8D0BE] backdrop-blur-md shadow-subtle">
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
                className="w-full pl-11 pr-12 py-3 text-sm rounded-xl border border-[#D8D0BE] bg-white text-brand-charcoal placeholder:text-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-forest focus:border-brand-forest transition-colors duration-200 shadow-subtle min-h-[44px]"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search input"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-muted hover:text-[#F1EBDD] transition-colors rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center btn-tactile"
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
                    : 'bg-white text-brand-muted hover:bg-brand-surface hover:text-[#F1EBDD] border border-[#D8D0BE]'
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
                      : 'bg-white text-brand-muted hover:bg-brand-surface hover:text-[#F1EBDD] border border-[#D8D0BE]'
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
            <div className="mt-3 pt-3 border-t border-[#D8D0BE]/60 flex items-center justify-between text-xs text-brand-muted font-editorial-meta">
              <div>
                Showing <strong className="text-[#F1EBDD]">{filteredPosts.length}</strong> {filteredPosts.length === 1 ? 'article' : 'articles'}
                {selectedTag && <> in category <strong className="text-[#F1EBDD]">"{selectedTag}"</strong></>}
                {searchQuery && <> matching <strong className="text-[#F1EBDD]">"{searchQuery}"</strong></>}
              </div>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedTag(null); }}
                className="text-xs font-semibold text-[#F1EBDD] hover:text-brand-deep underline min-h-[44px] inline-flex items-center btn-tactile"
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
      <section className="py-10 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {filteredPosts.length === 0 ? (
            <div className="max-w-lg mx-auto text-center py-16 bg-white rounded-2xl border border-[#D8D0BE] shadow-card p-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-surface border border-[#D8D0BE] flex items-center justify-center mx-auto text-[#F1EBDD]">
                <FileText className="w-7 h-7 stroke-1" />
              </div>
              <h3 className="font-editorial-h3 text-[#F1EBDD]">
                No matching articles found
              </h3>
              <p className="font-editorial-body text-xs sm:text-sm text-[#D8D0BE] leading-relaxed">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 scroll-stagger">
              {filteredPosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-2xl border border-[#D8D0BE] shadow-card hover:shadow-card-hover card-tactile flex flex-col overflow-hidden group scroll-reveal relative transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Invisible Full-Card Stretched Link (Entire Card Clickable per MotionSites Recipe) */}
                  <Link
                    to={`/blog/${post.slug}`}
                    className="absolute inset-0 z-10"
                    aria-label={`Read complete analysis: ${post.title}`}
                  />

                  {/* 1. Prominent Featured Image */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-brand-surface border-b border-[#D8D0BE] block group/img">
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
                          className="px-2.5 py-1 rounded-md bg-brand-forest/90 backdrop-blur-sm border border-brand-gold/40 text-[10px] font-semibold text-[#B49A64] uppercase tracking-wider font-editorial-meta shadow-sm"
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
                          <Calendar className="w-3.5 h-3.5 text-[#B49A64]" />
                          <span>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#B49A64]" />
                          <span>{post.readingTime} min read</span>
                        </span>
                      </div>

                      {/* 3. Article Title (Secondary Emphasis) */}
                      <h3 className="font-editorial-h3 text-[#F1EBDD] group-hover:text-brand-deep group-hover:underline transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h3>

                      {/* 4. Short Introductory Paragraph or Excerpt (Supporting Content) */}
                      <p className="mt-3 font-editorial-body text-xs sm:text-sm text-brand-muted group-hover:text-brand-charcoal transition-colors leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Card Footer: Author & 6. Read More Indicator */}
                    <div className="pt-4 border-t border-[#D8D0BE] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-[#F1EBDD]" />
                        <span className="text-xs font-semibold text-[#F1EBDD]">
                          {post.author}
                        </span>
                      </div>

                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F1EBDD] group-hover:text-brand-deep min-h-[44px]">
                        <span>Read More</span>
                        <span className="w-6 h-6 rounded-full bg-brand-surface border border-[#D8D0BE] flex items-center justify-center group-hover:bg-brand-forest group-hover:border-brand-forest transition-colors duration-200">
                          <ArrowRight className="w-3.5 h-3.5 text-[#B49A64] group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* =========================================================================
              5. REGULATORY ETHICS & COMPLIANCE NOTICE
              ========================================================================= */}
          <div className="mt-16 p-6 sm:p-8 rounded-2xl bg-brand-surface border border-[#D8D0BE] flex items-start gap-4 shadow-subtle scroll-reveal">
            <ShieldCheck className="w-6 h-6 text-[#F1EBDD] shrink-0 mt-0.5" />
            <div className="text-xs text-[#D8D0BE] leading-relaxed">
              <strong className="text-[#F1EBDD] block font-editorial-meta text-sm font-semibold mb-1">
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
