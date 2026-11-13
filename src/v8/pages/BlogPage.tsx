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
import { 
  getPublishedArticles, 
  getAllArticleTags, 
  BlogPost 
} from '../adapters/contentAdapter';
import { SEOHead } from '../../components/SEOHead';
import { DotGrid, DecorativeLayer } from '../components/decorative';
import { Reveal, StaggerContainer, StaggerItem } from '../components/animation';

export const BlogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Layer 3 Draft Quarantine: Strictly retrieves published articles
  const publishedPosts = useMemo(() => {
    return getPublishedArticles();
  }, []);

  const allTags = useMemo(() => {
    return getAllArticleTags();
  }, []);

  // Designated lead featured post
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
    <div className="bg-[#F1EBDD] text-[#35271F] min-h-screen texture-warm-ivory page-reveal">
      <SEOHead
        title="Tax & Regulatory Insights | CA Kavitha & Associates Tirupati"
        description="Authoritative Indian direct tax, GST compliance, and statutory audit insights by CA Kavitha Vijay (B.Com, CA, CMA AIR 49 (ICMAI)) for growth enterprises."
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

      {/* 1. EDITORIAL HERO BANNER */}
      <section className="bg-[#071B14] text-[#F1EBDD] py-12 sm:py-16 md:py-20 border-b border-[#B49A64]/30 relative overflow-hidden">
        {/* Blog Ambient Decorative Layer */}
        <DecorativeLayer>
          <DotGrid
            variant="bronze"
            width={240}
            height={240}
            className="absolute -top-10 -right-10 opacity-15 hidden md:block"
          />
        </DecorativeLayer>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Reveal delay={60} duration={650}>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B241C] text-[#B49A64] font-mono text-xs mb-4 border border-[#B49A64]/40 min-h-[44px]">
                <BookOpen className="w-3.5 h-3.5 text-[#B49A64] shrink-0" />
                <span>Technical Publications &amp; Regulatory Insights • Tirupati Chambers</span>
              </div>
              <h1 className="font-editorial-h1 text-[#F1EBDD] font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                Regulatory Insights &amp; Technical Commentary
              </h1>
              <p className="mt-4 font-editorial-body text-sm sm:text-base text-[#D8D0BE] leading-relaxed">
                Authoritative technical analysis on corporate statutory audits, GST reconciliation frameworks, Section 115BAA direct tax planning, and internal financial controls. Authored by CA Kavitha Vijay (B.Com, CA, CMA AIR 49 (ICMAI)) under the informational pull model to foster fiscal governance.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. ASYMMETRICAL FEATURED ARTICLE SHOWCASE CARD */}
      {featuredPost && !searchQuery && !selectedTag && (
        <section className="py-10 lg:py-14 border-b border-[#D8D0BE] bg-[#F1EBDD]/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal delay={80} duration={650}>
              <div className="rounded-3xl p-2 sm:p-2.5 bg-[#0B241C]/85 border border-[#B49A64]/30 shadow-2xl transition-all duration-300 hover:border-[#B49A64]/60">
                <div className="rounded-2xl p-7 sm:p-10 lg:p-12 bg-[#071B14] text-[#F1EBDD] border border-white/10 relative overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    
                    {/* Left 7 Columns: Narrative & Metadata */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#183529] border border-[#B49A64]/40 text-[#B49A64] text-xs font-semibold min-h-[44px]">
                        <Sparkles className="w-3.5 h-3.5 text-[#B49A64] shrink-0" />
                        <span>Featured Statutory Analysis • FY 2025-26</span>
                      </div>

                      <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
                        <Link to={`/blog/${featuredPost.slug}`} className="hover:text-[#B49A64] transition-colors">
                          {featuredPost.title}
                        </Link>
                      </h2>

                      <p className="font-editorial-body text-sm sm:text-base text-white/80 leading-relaxed">
                        {featuredPost.excerpt}
                      </p>

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
                          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#B49A64] text-[#071B14] hover:bg-[#F1EBDD] font-semibold text-xs tracking-wide transition-all shadow-md min-h-[44px]"
                        >
                          <span>Read Complete Analysis</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>

                    {/* Right 5 Columns: Large 16:10 Photo Frame */}
                    <div className="lg:col-span-5 relative group">
                      <Link
                        to={`/blog/${featuredPost.slug}`}
                        className="block relative aspect-[16/10] rounded-2xl overflow-hidden border border-[#B49A64]/30 shadow-xl"
                        aria-label={`Read featured analysis: ${featuredPost.title}`}
                      >
                        <img 
                          src={featuredPost.coverImage || '/uploads/blog/statutory-audit-guidelines-2026.webp'} 
                          alt={featuredPost.coverImageAlt || featuredPost.title} 
                          width="800"
                          height="600"
                          loading="eager"
                          {...({ fetchpriority: 'high' } as any)}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                        <div className="absolute top-3.5 left-3.5 z-10">
                          <span className="font-editorial-meta text-[#071B14] bg-[#F1EBDD]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#B49A64]/40 text-xs font-bold shadow-sm">
                            {featuredPost.tags[0] || 'Statutory Analysis'}
                          </span>
                        </div>
                      </Link>
                    </div>

                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* 3. INTERACTIVE SEARCH & CATEGORY FILTER CONTROLS */}
      <section className="py-6 bg-[#F1EBDD]/95 sticky top-20 z-20 border-b border-[#D8D0BE] backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Live Search Input with Instant Clear (X) Button */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#7E5E1E] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                aria-label="Search articles by title, excerpt, statute, or content"
                placeholder="Search by statute, title, excerpt, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-12 py-3 text-sm rounded-xl border border-[#D8D0BE] bg-[#FAF7F0] text-[#35271F] placeholder:text-[#525954]/70 focus:outline-none focus:ring-2 focus:ring-[#183529] focus:border-[#183529] transition-colors shadow-inner min-h-[44px]"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search input"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#7E5E1E] hover:text-[#071B14] transition-colors rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills (WCAG 2.5.5 min 44px Touch Targets) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedTag(null)}
                className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  selectedTag === null
                    ? 'bg-[#183529] text-white shadow-sm border border-[#183529]'
                    : 'bg-[#FAF7F0] text-[#525954] hover:bg-[#F1EBDD] hover:text-[#071B14] border border-[#D8D0BE]'
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
                  className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    selectedTag === tag
                      ? 'bg-[#183529] text-white shadow-sm border border-[#183529]'
                      : 'bg-[#FAF7F0] text-[#525954] hover:bg-[#F1EBDD] hover:text-[#071B14] border border-[#D8D0BE]'
                  }`}
                >
                  <Tag className="w-3 h-3 opacity-70" />
                  <span>{tag}</span>
                </button>
              ))}
            </div>

          </div>

          {/* Active Filter Indicator */}
          {(searchQuery || selectedTag) && (
            <div className="mt-3 pt-3 border-t border-[#D8D0BE]/60 flex items-center justify-between text-xs text-[#525954]">
              <div>
                Showing <strong className="text-[#35271F]">{filteredPosts.length}</strong> {filteredPosts.length === 1 ? 'article' : 'articles'}
                {selectedTag && <> in category <strong className="text-[#35271F]">"{selectedTag}"</strong></>}
                {searchQuery && <> matching <strong className="text-[#35271F]">"{searchQuery}"</strong></>}
              </div>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedTag(null); }}
                className="text-xs font-semibold text-[#7E5E1E] hover:text-[#071B14] underline min-h-[44px] inline-flex items-center"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. PUBLISHED ARTICLE CARDS GRID */}
      <section className="py-10 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {filteredPosts.length === 0 ? (
            <div className="max-w-lg mx-auto text-center py-16 bg-[#FAF7F0] rounded-2xl border border-[#D8D0BE] shadow-card p-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F1EBDD] border border-[#D8D0BE] flex items-center justify-center mx-auto text-[#7E5E1E]">
                <FileText className="w-7 h-7 stroke-1" />
              </div>
              <h3 className="font-editorial-h3 text-xl font-serif font-bold text-[#35271F]">
                No matching articles found
              </h3>
              <p className="font-editorial-body text-xs sm:text-sm text-[#525954] leading-relaxed">
                We could not find any published articles matching "{searchQuery}". Try selecting another category or clear the active filter.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setSelectedTag(null); }}
                  className="px-5 py-2.5 rounded-lg bg-[#183529] text-white text-xs font-semibold hover:bg-[#071B14] transition-colors min-h-[44px] inline-flex items-center justify-center"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          ) : (
            <StaggerContainer staggerMs={60} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, i) => (
                <StaggerItem key={post.slug} index={i} distance={18} durationMs={500}>
                  <article
                    className="h-full bg-[#FAF7F0] rounded-2xl border border-[#D8D0BE] shadow-sm flex flex-col overflow-hidden group relative card-interactive transition-all duration-300 hover:-translate-y-1 hover:border-[#B49A64] hover:shadow-card-hover"
                  >
                    {/* Invisible Full-Card Stretched Link (100% Clickable Overlay) */}
                    <Link
                      to={`/blog/${post.slug}`}
                      className="absolute inset-0 z-10"
                      aria-label={`Read complete analysis: ${post.title}`}
                    />

                    {/* 1. Large 16:10 Photographic Cover Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#071B14] border-b border-[#D8D0BE] block">
                      <img
                        src={post.coverImage || '/uploads/blog/statutory-audit-guidelines-2026.webp'}
                        alt={post.coverImageAlt || post.title}
                        loading="eager"
                        width="600"
                        height="375"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Category Pill Overlay */}
                      <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-1.5 pointer-events-none">
                        {post.tags.slice(0, 2).map((t) => (
                          <span 
                            key={t}
                            className="px-2.5 py-1 rounded-md bg-[#183529]/90 backdrop-blur-sm border border-[#B49A64]/40 text-[10px] font-semibold text-[#B49A64] uppercase tracking-wider font-mono shadow-sm"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        {/* Metadata Row */}
                        <div className="flex items-center gap-3 text-xs text-[#525954] mb-3">
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

                        {/* Article Title */}
                        <h3 className="font-editorial-h3 text-lg font-serif font-bold text-[#35271F] group-hover:text-[#183529] group-hover:underline transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </h3>

                        {/* Short Introductory Excerpt (3-Line Clamped) */}
                        <p className="mt-3 font-editorial-body text-xs sm:text-sm text-[#525954] group-hover:text-[#35271F] transition-colors leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Card Footer: Author & Read More Indicator */}
                      <div className="pt-4 border-t border-[#D8D0BE] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-[#7E5E1E]" />
                          <span className="text-xs font-semibold text-[#35271F]">
                            {post.author}
                          </span>
                        </div>

                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#183529] group-hover:text-[#071B14] min-h-[44px]">
                          <span>Read More</span>
                          <span className="w-6 h-6 rounded-full bg-[#F1EBDD] border border-[#D8D0BE] flex items-center justify-center group-hover:bg-[#183529] group-hover:border-[#183529] transition-colors duration-200">
                            <ArrowRight className="w-3.5 h-3.5 text-[#B49A64] group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          {/* 5. REGULATORY ETHICS & COMPLIANCE NOTICE */}
          <Reveal delay={60} duration={650}>
            <div className="mt-16 p-6 sm:p-8 rounded-2xl bg-[#FAF7F0] border border-[#D8D0BE] flex items-start gap-4 shadow-sm transition-all duration-300 hover:border-[#B49A64]/60">
              <ShieldCheck className="w-6 h-6 text-[#7E5E1E] shrink-0 mt-0.5" />
              <div className="text-xs text-[#525954] leading-relaxed">
                <strong className="text-[#35271F] block text-sm font-semibold mb-1">
                  ICAI Guidelines &amp; Ethics Notice
                </strong>
                <p className="font-editorial-body text-xs text-[#525954]">
                  These technical articles are published by Kavitha &amp; Associates strictly under the informational 'pull' model for general awareness and educational reference. They do not constitute statutory tax advice, legal counsel, or solicitation of professional services under the Chartered Accountants Act, 1949.
                </p>
              </div>
            </div>
          </Reveal>

        </div>
      </section>
    </div>
  );
};

export default BlogPage;
