import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Share2, 
  Check, 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight, 
  Home, 
  MessageSquare,
  UserCheck
} from 'lucide-react';
import { 
  getArticleBySlug, 
  getRelatedArticles, 
  BlogPost 
} from '../adapters/contentAdapter';
import { MarkdownRenderer } from '../../components/MarkdownRenderer';
import { SEOHead } from '../../components/SEOHead';
import { NotFoundPage } from './NotFoundPage';
import { FIRM_DATA } from '../../data/firmData';

const LinkedInIcon: React.FC = () => (
  <svg className="w-4 h-4 text-[#0A66C2] fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.2a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26Z" />
  </svg>
);

const TwitterIcon: React.FC = () => (
  <svg className="w-4 h-4 text-[#35271F] fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const BlogArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = useState(false);
  const [coverImageFailed, setCoverImageFailed] = useState(false);
  const copyTimerRef = useRef<number | null>(null);

  // Layer 3 Draft Quarantine: Returns undefined if post is draft: true
  const post: BlogPost | undefined = slug ? getArticleBySlug(slug) : undefined;
  const relatedPosts: BlogPost[] = post ? getRelatedArticles(post.slug, 3) : [];

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  // Strict quarantine: If slug not found or is draft, immediately render canonical 404
  if (!post) {
    return <NotFoundPage />;
  }

  const handleCopyLink = () => {
    if (typeof window !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          setCopied(true);
          if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
          copyTimerRef.current = window.setTimeout(() => setCopied(false), 2500);
        })
        .catch(() => setCopied(false));
    }
  };

  const handleWhatsAppShare = () => {
    const text = `Read "${post.title}" by CA Kavitha Vijay: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleTwitterShare = () => {
    const text = `Read "${post.title}" by CA Kavitha Vijay (@KavithaAssoc): ${window.location.href}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const metaTitle = post.seo?.metaTitle || `${post.title} | Kavitha & Associates`;
  const metaDescription = post.seo?.metaDescription || post.excerpt;

  return (
    <div className="bg-[#FAF7F0] text-[#525954] min-h-screen texture-warm-ivory">
      <SEOHead
        title={metaTitle}
        description={metaDescription}
        canonicalPath={`/blog/${post.slug}`}
        ogType="article"
        image={post.coverImage}
        article={{
          author: post.author,
          datePublished: post.date,
          tags: post.tags,
        }}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Regulatory Insights', path: '/blog' },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />

      {/* ARTICLE READING SURFACE */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16 sm:pb-24">
        
        {/* =========================================================================
            STEP 1: BREADCRUMB NAVIGATION
            ========================================================================= */}
        <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[#525954]">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 hover:text-[#183529] transition-colors min-h-[44px] py-2"
          >
            <Home className="w-3.5 h-3.5 text-[#B49A64]" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#D8D0BE]" />
          <Link
            to="/blog"
            className="hover:text-[#183529] transition-colors min-h-[44px] py-2 inline-flex items-center"
          >
            <span>Regulatory Insights</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#D8D0BE]" />
          <span className="text-[#35271F] font-medium truncate max-w-[260px] sm:max-w-md" aria-current="page">
            {post.title}
          </span>
        </nav>

        {/* =========================================================================
            STEP 2: BACK TO INSIGHTS LINK
            ========================================================================= */}
        <div className="mb-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#183529] hover:text-[#7E5E1E] transition-colors min-h-[44px] group"
          >
            <ArrowLeft className="w-4 h-4 text-[#B49A64] group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Publications</span>
          </Link>
        </div>

        {/* =========================================================================
            STEP 3: CATEGORY AND PUBLICATION METADATA
            ========================================================================= */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-md bg-[#F1EBDD] border border-[#D8D0BE] text-xs font-mono font-bold text-[#183529] uppercase tracking-wider shadow-2xs"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#525954] font-editorial-meta ml-auto sm:ml-0">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#B49A64]" />
              <span>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#B49A64]" />
              <span>{post.readingTime} min read</span>
            </span>
          </div>
        </div>

        {/* =========================================================================
            STEP 4: LARGE READABLE ARTICLE TITLE (H1 in Walnut Brown #35271F)
            ========================================================================= */}
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold text-[#35271F] leading-[1.2] tracking-tight mb-5">
          {post.title}
        </h1>

        {/* =========================================================================
            STEP 5: SHORT INTRODUCTORY PARAGRAPH & EXECUTIVE STATUTORY SUMMARY
            ========================================================================= */}
        {post.excerpt && (
          <div className="my-6 p-5 sm:p-6 rounded-r-xl bg-[#F8EFDF] border border-[#D8D0BE] border-l-4 border-l-[#B49A64] shadow-2xs">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#7E5E1E] block mb-2">
              EXECUTIVE STATUTORY SUMMARY
            </span>
            <p className="font-editorial-body text-sm sm:text-base text-[#35271F] leading-relaxed italic font-serif">
              {post.excerpt}
            </p>
          </div>
        )}

        {/* =========================================================================
            STEP 6: AUTHOR INFORMATION (Verified CA Kavitha Vijay Plaque)
            ========================================================================= */}
        <div className="my-6 p-4 sm:p-5 rounded-xl bg-[#F8EFDF] border border-[#D8D0BE] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#071B14] border border-[#B49A64]/60 flex items-center justify-center font-serif text-lg font-bold text-[#B49A64] shrink-0 shadow-inner">
              KV
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-serif text-base sm:text-lg font-bold text-[#35271F]">
                  {post.author}
                </span>
                <span className="font-mono text-[10px] font-bold text-[#7E5E1E] bg-[#FAF7F0] px-2 py-0.5 rounded border border-[#D8D0BE]">
                  Managing Partner
                </span>
                <span className="font-mono text-[10px] font-bold text-[#183529] bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-300">
                  CMA AIR 49 (ICMAI)
                </span>
              </div>
              <p className="font-editorial-body text-xs text-[#525954] mt-0.5">
                B.Com, CA, CMA • Ex-Deloitte &amp; Ford Motor Company • Tirupati Chambers
              </p>
            </div>
          </div>
          <Link
            to="/about"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#D8D0BE] bg-[#FAF7F0] text-[#183529] text-xs font-semibold hover:bg-[#F1EBDD] transition-colors shrink-0 self-start sm:self-auto min-h-[44px]"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#B49A64]" />
            <span>Profile</span>
          </Link>
        </div>

        {/* =========================================================================
            STEP 7: SHARING CONTROLS (Multi-platform Social Share Suite)
            ========================================================================= */}
        <div className="py-4 border-y border-[#D8D0BE]/60 flex flex-wrap items-center justify-between gap-3 text-xs text-[#525954] mb-8">
          <span className="font-editorial-meta uppercase tracking-wider text-[11px] font-semibold text-[#7E5E1E]">
            Share Regulatory Analysis:
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#D8D0BE] bg-[#FAF7F0] hover:bg-[#F1EBDD] text-[#35271F] text-xs font-medium transition-colors min-h-[44px] shadow-2xs"
              title="Copy Article Link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#183529]" />
                  <span className="text-[#183529] font-semibold">Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#7E5E1E]" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#183529] hover:bg-[#071B14] text-white text-xs font-semibold transition-colors min-h-[44px] shadow-2xs"
              title="Share via WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#B49A64]" />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleLinkedInShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#D8D0BE] bg-[#FAF7F0] hover:bg-[#F1EBDD] text-[#35271F] text-xs font-medium transition-colors min-h-[44px] shadow-2xs"
              title="Share to LinkedIn"
              aria-label="Share to LinkedIn"
            >
              <LinkedInIcon />
            </button>

            <button
              type="button"
              onClick={handleTwitterShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#D8D0BE] bg-[#FAF7F0] hover:bg-[#F1EBDD] text-[#35271F] text-xs font-medium transition-colors min-h-[44px] shadow-2xs"
              title="Share on Twitter / X"
              aria-label="Share on Twitter / X"
            >
              <TwitterIcon />
            </button>
          </div>
        </div>

        {/* =========================================================================
            STEP 8: LARGE FEATURED IMAGE (Dominant 16:10 Photographic Frame)
            ========================================================================= */}
        {post.coverImage && !coverImageFailed && (
          <div className="mb-10 rounded-2xl overflow-hidden border border-[#D8D0BE] shadow-md bg-[#071B14] aspect-[16/10] relative">
            <img
              src={post.coverImage}
              alt={post.coverImageAlt || `Cover illustration for ${post.title}`}
              width="1200"
              height="750"
              className="w-full h-full object-cover"
              loading="eager"
              {...({ fetchpriority: 'high' } as any)}
              onError={() => setCoverImageFailed(true)}
            />
          </div>
        )}

        {/* =========================================================================
            STEP 9: FULL ARTICLE CONTENT (Markdown parsed body, high contrast)
            ========================================================================= */}
        <article className="bg-[#FAF7F0] rounded-2xl border border-[#D8D0BE] p-6 sm:p-10 md:p-12 shadow-sm font-editorial-body text-[#525954] leading-relaxed">
          <MarkdownRenderer content={post.content} demoteHeadings={true} />
        </article>

        {/* ICAI Professional Standards Notice & Statutory Disclaimer */}
        <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-[#071B14] text-[#F1EBDD] border border-[#B49A64]/30 shadow-card flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-[#B49A64] shrink-0 mt-0.5" />
          <div className="text-xs text-[#D8D0BE] leading-relaxed space-y-1">
            <strong className="text-white block font-serif text-sm font-semibold tracking-wide">
              ICAI Professional Standards &amp; Statutory Disclaimer
            </strong>
            <p className="font-editorial-body text-xs text-[#D8D0BE]">
              This technical commentary is published by Kavitha &amp; Associates strictly under the informational 'pull' model for general educational reference. In accordance with guidelines issued by the Institute of Chartered Accountants of India (ICAI) and the Chartered Accountants Act, 1949, this content does not constitute formal tax advice, statutory audit opinion, legal counsel, or solicitation of professional engagement.
            </p>
          </div>
        </div>

        {/* Technical Advisory & Consultation Intake CTA Banner */}
        <div className="mt-12 p-8 sm:p-10 rounded-2xl bg-[#F8EFDF] border border-[#D8D0BE] text-center space-y-4 shadow-sm">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#7E5E1E] block">
            PROFESSIONAL ADVISORY &amp; STATUTORY REVIEW
          </span>
          <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-serif font-bold text-[#35271F]">
            Require Technical Advisory on this Matter?
          </h2>
          <p className="font-editorial-body text-xs sm:text-sm text-[#525954] max-w-lg mx-auto leading-relaxed">
            Schedule a confidential chambers consultation with CA Kavitha Vijay to evaluate your organization's statutory audit schedules, tax filing positions, or internal controls framework.
          </p>
          <div className="pt-2 flex justify-center items-center gap-3 flex-wrap">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#183529] text-white hover:bg-[#071B14] font-semibold text-xs tracking-wide transition-all shadow-md min-h-[44px]"
            >
              <span>Consult Practice Chambers</span>
              <ArrowRight className="w-4 h-4 text-[#B49A64]" />
            </Link>
            <a
              href={FIRM_DATA.contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D8D0BE] bg-[#FAF7F0] text-[#35271F] hover:bg-[#F1EBDD] font-semibold text-xs tracking-wide transition-all min-h-[44px]"
            >
              <span>Chat via WhatsApp</span>
            </a>
          </div>
        </div>

        {/* CURATED RELATED REGULATORY PUBLICATIONS */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#D8D0BE]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#7E5E1E] block">
                  PRACTICE ARCHIVE
                </span>
                <h2 className="font-editorial-h2 text-2xl font-serif font-bold text-[#35271F]">
                  Related Regulatory Publications
                </h2>
              </div>
              <Link
                to="/blog"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#183529] hover:text-[#071B14] underline min-h-[44px]"
              >
                <span>View All Articles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <article
                  key={rel.slug}
                  className="rounded-2xl bg-[#FAF7F0] border border-[#D8D0BE] shadow-xs hover:border-[#B49A64]/60 hover:shadow-md flex flex-col justify-between overflow-hidden group relative transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Stretched Link (100% Clickable Overlay) */}
                  <Link
                    to={`/blog/${rel.slug}`}
                    className="absolute inset-0 z-10"
                    aria-label={`Read article: ${rel.title}`}
                  />

                  {/* Featured Cover Image */}
                  <div className="block relative aspect-[16/10] w-full overflow-hidden bg-[#071B14] border-b border-[#D8D0BE]">
                    <img
                      src={rel.coverImage || '/uploads/blog/statutory-audit-guidelines-2026.webp'}
                      alt={rel.coverImageAlt || rel.title}
                      loading="eager"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#B49A64] bg-[#183529]/90 backdrop-blur-sm px-2.5 py-0.5 rounded border border-[#B49A64]/30 shadow-sm">
                        {rel.tags[0] || 'Regulatory'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-editorial-h3 text-sm sm:text-base font-serif font-bold text-[#35271F] group-hover:text-[#183529] group-hover:underline transition-colors leading-snug line-clamp-2">
                        {rel.title}
                      </h3>
                      <p className="mt-2 font-editorial-body text-xs text-[#525954] group-hover:text-[#35271F] line-clamp-2 leading-relaxed">
                        {rel.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#D8D0BE]/60 flex items-center justify-between text-[11px] font-editorial-meta text-[#525954]">
                      <span>{rel.readingTime} min read</span>
                      <div className="text-[#183529] font-semibold group-hover:text-[#071B14] transition-colors inline-flex items-center gap-1 min-h-[44px]">
                        <span>Read Analysis</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#B49A64] group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default BlogArticlePage;
