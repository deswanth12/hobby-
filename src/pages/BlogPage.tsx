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
  UserCheck
} from 'lucide-react';
import { BlogService } from '../services/blogService';
import { SEOHead } from '../components/SEOHead';

export const BlogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Retrieve published posts only
  const publishedPosts = useMemo(() => {
    return BlogService.getAllPosts(false);
  }, []);

  const allTags = useMemo(() => {
    return BlogService.getAllTags();
  }, []);

  // Filter posts based on query and tag
  const filteredPosts = useMemo(() => {
    return publishedPosts.filter(post => {
      const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = q
        ? post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.tags.some(t => t.toLowerCase().includes(q))
        : true;
      return matchesTag && matchesQuery;
    });
  }, [publishedPosts, searchQuery, selectedTag]);

  return (
    <div className="bg-brand-warm page-reveal">
      <SEOHead
        title="Regulatory Analysis & Technical Commentary | Kavitha & Associates"
        description="Authoritative tax, audit, GST, and corporate governance commentary prepared by CA Kavitha Vijay (ICAI Mem. 252985 | B.Com, CA, CMA AIR 49). Factual analysis for growing enterprises."
        canonicalPath="/blog"
      />

      {/* =========================================================================
          1. HEADER BANNER
          ========================================================================= */}
      <section className="bg-brand-surface py-14 sm:py-18 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-brand-pale text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
              <BookOpen className="w-3.5 h-3.5 text-gold-dark" />
              <span>Technical Publications & Insights</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-primary tracking-tight">
              Regulatory Insights & Advisory Commentary
            </h1>
            <p className="mt-4 text-base sm:text-lg text-charcoal-muted leading-relaxed">
              Structured technical analysis on corporate statutory audits, GST reconciliation frameworks, and direct tax planning. Authored by CA Kavitha Vijay to foster fiscal compliance and governance awareness.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. FILTER & SEARCH CONTROLS
          ========================================================================= */}
      <section className="py-8 bg-white border-b border-border/80 sticky top-20 z-20 shadow-xs backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles by topic, statute, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-border bg-brand-surface focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all text-charcoal"
              />
            </div>

            {/* Tag Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedTag === null
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'bg-brand-surface text-charcoal-muted hover:bg-brand-pale hover:text-brand-primary border border-border/70'
                }`}
              >
                All Topics ({publishedPosts.length})
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                    selectedTag === tag
                      ? 'bg-brand-primary text-white shadow-xs'
                      : 'bg-brand-surface text-charcoal-muted hover:bg-brand-pale hover:text-brand-primary border border-border/70'
                  }`}
                >
                  <Tag className="w-3 h-3 opacity-70" />
                  <span>{tag}</span>
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          3. ARTICLE CARDS GRID
          ========================================================================= */}
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {filteredPosts.length === 0 ? (
            <div className="max-w-lg mx-auto text-center py-16 bg-white rounded-2xl border border-border shadow-subtle p-8">
              <FileText className="w-12 h-12 text-charcoal-muted mx-auto mb-4 stroke-1" />
              <h3 className="font-serif text-xl font-bold text-brand-primary mb-2">
                No matching articles found
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-muted mb-6">
                We could not find any published articles matching "{searchQuery}". Try selecting another category or clear the search filter.
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedTag(null); }}
                className="px-4 py-2 rounded-lg bg-brand-primary text-white text-xs font-semibold hover:bg-brand-deep transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all flex flex-col overflow-hidden group card-tactile"
                >
                  {/* Card Visual Header */}
                  <div className="h-48 bg-gradient-to-br from-[#0A2F24] to-[#0F3E2E] p-6 relative flex flex-col justify-between overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
                    
                    {/* Top Tag Badges */}
                    <div className="flex flex-wrap gap-1.5 relative z-10">
                      {post.tags.slice(0, 2).map((t) => (
                        <span 
                          key={t}
                          className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-[10px] font-semibold text-emerald-200 uppercase tracking-wider"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Monogram Seal */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-[#0F3E2E] border border-gold/40 flex items-center justify-center font-serif text-sm font-bold text-gold">
                        CA
                      </div>
                      <span className="text-[11px] text-emerald-300 font-medium">
                        Kavitha & Associates
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Meta stats */}
                      <div className="flex items-center gap-3 text-xs text-charcoal-muted mb-2.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-gold-dark" />
                          <span>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gold-dark" />
                          <span>{post.readingTime} min read</span>
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="font-serif text-xl font-bold text-brand-primary group-hover:text-emerald-800 transition-colors leading-snug line-clamp-2">
                        <Link to={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h2>

                      {/* Excerpt */}
                      <p className="mt-2.5 text-xs sm:text-sm text-charcoal-muted leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-border/70 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-emerald-700" />
                        <span className="text-xs font-semibold text-brand-primary">
                          {post.author}
                        </span>
                      </div>

                      <Link
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 group/link"
                      >
                        <span>Read</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gold group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Regulatory Ethics Disclaimer */}
          <div className="mt-16 p-6 rounded-2xl bg-brand-surface border border-border flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-emerald-800 shrink-0 mt-0.5" />
            <div className="text-xs text-charcoal-muted leading-relaxed">
              <strong className="text-brand-primary block font-semibold mb-1">
                ICAI Guidelines & Ethics Notice
              </strong>
              These technical articles are published by Kavitha & Associates strictly under the informational 'pull' model for general awareness and educational reference. They do not constitute statutory tax advice, legal counsel, or solicitation of professional services under the Chartered Accountants Act, 1949.
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
