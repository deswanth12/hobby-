import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  ArrowUpRight, 
  UserCheck 
} from 'lucide-react';
import { BlogPost } from '../services/blogService';
import { DualArrowButton } from './animations';
import { CornerBrackets, EditorialMarker } from './architectural';

interface FeaturedInsightsProps {
  articles: BlogPost[];
}

export const FeaturedInsights: React.FC<FeaturedInsightsProps> = ({ articles }) => {
  if (!articles || articles.length === 0) return null;

  const leadArticle = articles[0];
  const companionArticles = articles.slice(1, 3);

  return (
    <section 
      id="insights-overview"
      className="scroll-mt-28 pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28 bg-[#F8EFDF] border-b border-[#B49A64]/30 relative overflow-hidden texture-warm-plaster" 
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* =========================================================================
            1. SECTION HEADER
            Refined spacing, clear hierarchy, author attribution, zero line overlap
            ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-14 lg:mb-16 gap-6 sm:gap-8 scroll-reveal">
          <div>
            <div className="flex items-center gap-2.5 mb-4 sm:mb-5 flex-wrap">
              <EditorialMarker number="06" label="REGULATORY INSIGHTS" />
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF9EF] border border-[#C3A66B]/50 shadow-2xs">
                <BookOpen className="w-3.5 h-3.5 text-[#35271F]" />
                <span className="font-editorial-meta text-xs font-semibold uppercase tracking-wider text-[#35271F]">
                  TECHNICAL COMMENTARY
                </span>
              </div>
            </div>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl text-[#35271F] font-serif font-bold tracking-tight leading-[1.2]">
              Professional Insights &amp; Regulatory Analysis
            </h2>
          </div>
          <div className="max-w-md">
            <p className="font-editorial-body text-xs sm:text-sm text-[#525954] leading-relaxed border-l-2 border-[#B49A64]/60 pl-4 py-1">
              Technical commentary examining statutory precedents, Companies Act provisions, GST notifications, and direct tax compliance frameworks.
            </p>
          </div>
        </div>

        {/* =========================================================================
            2. ASYMMETRIC EDITORIAL GRID (1 Primary Lead + 2 Stacked Companions)
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch scroll-stagger">
          
          {/* ---------------------------------------------------------------------
              LEFT 7 COLUMNS: PRIMARY LEAD ARTICLE (Expansive 16:10 Dominance)
              --------------------------------------------------------------------- */}
          {leadArticle && (
            <div className="lg:col-span-7 flex">
              <article className="w-full bg-[#FAF7F0] rounded-2xl border border-[#D8D0BE] shadow-card hover:border-[#B49A64] hover:shadow-card-hover transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
                {/* Full-Surface Stretched Overlay Link */}
                <Link
                  to={`/blog/${leadArticle.slug}`}
                  className="absolute inset-0 z-10"
                  aria-label={`Read full analysis: ${leadArticle.title}`}
                />
                
                <CornerBrackets size={16} variant="gold" />

                <div>
                  {/* Dominant 16:10 Pure Photographic Frame (Zero Embedded Text) */}
                  <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-[#071B14]/10">
                    <img
                      src={leadArticle.coverImage || '/uploads/blog/statutory-audit-guidelines-2026.webp'}
                      alt={`Featured analysis: ${leadArticle.title}`}
                      width="1200"
                      height="750"
                      loading="eager"
                      fetchPriority="high"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
                    
                    {/* Floating Frosted Category Pill */}
                    <div className="absolute top-4 left-4 z-20 pointer-events-none">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#071B14]/90 backdrop-blur-md border border-[#B49A64]/40 text-[#F1EBDD] font-editorial-meta text-xs font-semibold uppercase tracking-wider shadow-sm">
                        {leadArticle.tags[0] || 'Statutory Analysis'}
                      </span>
                    </div>
                  </div>

                  {/* Primary Editorial Content */}
                  <div className="p-6 sm:p-8">
                    {/* Secondary Metadata */}
                    <div className="flex items-center gap-3 text-xs text-[#525954] mb-3 font-editorial-meta">
                      <span className="flex items-center gap-1.5 text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-[#B49A64]" />
                        <span>{new Date(leadArticle.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1.5 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-[#B49A64]" />
                        <span>{leadArticle.readingTime} min read</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1.5 text-[11px] text-[#7E5E1E] font-medium">
                        <UserCheck className="w-3.5 h-3.5 text-[#B49A64]" />
                        <span>CA Kavitha Vijay</span>
                      </span>
                    </div>

                    {/* Generous Title without Ellipses Truncation */}
                    <h3 className="font-serif text-xl sm:text-2xl lg:text-[26px] font-bold text-[#35271F] group-hover:text-[#183529] transition-colors leading-snug">
                      {leadArticle.title}
                    </h3>

                    {/* Authoritative 25-30 Word Excerpt */}
                    <p className="font-editorial-body text-xs sm:text-sm text-[#525954] mt-3 leading-relaxed">
                      {leadArticle.excerpt}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="px-6 sm:px-8 pb-6 pt-0 flex items-center justify-between text-xs relative z-20 pointer-events-none border-t border-[#D8D0BE]/40 mt-4 pt-4">
                  <span className="text-[11px] font-mono font-semibold text-[#7E5E1E] uppercase tracking-wider">
                    ICAI Technical Commentary
                  </span>
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#183529] text-white font-editorial-meta text-xs font-semibold group-hover:bg-[#071B14] transition-all duration-300 shadow-xs">
                    <span>Read Full Analysis</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#B49A64] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </article>
            </div>
          )}

          {/* ---------------------------------------------------------------------
              RIGHT 5 COLUMNS: TWO STACKED COMPANION ARTICLES
              --------------------------------------------------------------------- */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {companionArticles.map((article, idx) => (
              <article
                key={article.slug}
                className="bg-[#FAF7F0] rounded-2xl border border-[#D8D0BE] shadow-card hover:border-[#B49A64] hover:shadow-card-hover transition-all duration-300 relative overflow-hidden group p-5 sm:p-6 flex flex-col justify-between flex-1"
              >
                {/* Full-Surface Stretched Overlay Link */}
                <Link
                  to={`/blog/${article.slug}`}
                  className="absolute inset-0 z-10"
                  aria-label={`Read article: ${article.title}`}
                />

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
                  {/* Compact 16:10 Pure Photographic Frame */}
                  <div className="w-full sm:w-44 shrink-0 aspect-[16/10] rounded-xl overflow-hidden bg-[#071B14]/10 relative">
                    <img
                      src={article.coverImage || (idx === 0 ? '/uploads/blog/gst-annual-return-compliance.webp' : '/uploads/blog/corporate-tax-planning-2026.webp')}
                      alt={`Analysis: ${article.title}`}
                      width="400"
                      height="250"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-50 pointer-events-none" />
                    
                    {/* Mini Category Badge */}
                    <div className="absolute top-2 left-2 z-20 pointer-events-none">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-[#071B14]/90 backdrop-blur-sm border border-[#B49A64]/40 text-[#F1EBDD] font-editorial-meta text-[9px] font-semibold uppercase tracking-wider shadow-xs">
                        {article.tags[0] || 'Tax Advisory'}
                      </span>
                    </div>
                  </div>

                  {/* Companion Text Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[11px] text-[#525954] mb-1.5 font-editorial-meta">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#B49A64]" />
                        <span>{new Date(article.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#B49A64]" />
                        <span>{article.readingTime}m</span>
                      </span>
                    </div>

                    <h4 className="font-serif text-base sm:text-lg font-bold text-[#35271F] group-hover:text-[#183529] transition-colors leading-snug">
                      {article.title}
                    </h4>

                    <p className="font-editorial-body text-xs text-[#525954] mt-1.5 leading-relaxed line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                {/* Sub-footer Link */}
                <div className="pt-3 mt-3 border-t border-[#D8D0BE]/40 flex items-center justify-between text-xs relative z-20 pointer-events-none">
                  <span className="text-[11px] text-[#7E5E1E] font-medium">
                    CA Kavitha Vijay
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#183529] group-hover:text-[#B49A64] transition-colors">
                    <span>Read Analysis</span>
                    <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </article>
            ))}
          </div>

        </div>

        {/* =========================================================================
            3. VIEW ALL ARTICLES ACTION
            ========================================================================= */}
        <div className="mt-10 sm:mt-12 text-center scroll-reveal">
          <DualArrowButton
            to="/blog"
            variant="secondary"
            className="inline-flex text-xs sm:text-sm font-semibold justify-center py-2.5 px-6 min-h-[46px]"
          >
            Explore All Regulatory Insights &amp; Publications
          </DualArrowButton>
        </div>

      </div>
    </section>
  );
};
