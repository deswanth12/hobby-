import React, { useState } from 'react';
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
  MessageSquare
} from 'lucide-react';

const LinkedInIcon: React.FC = () => (
  <svg className="w-4 h-4 text-[#0A66C2] fill-current" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.2a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26Z" />
  </svg>
);

const TwitterIcon: React.FC = () => (
  <svg className="w-4 h-4 text-charcoal fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
import { BlogService } from '../services/blogService';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { SEOHead } from '../components/SEOHead';
import { NotFoundPage } from './NotFoundPage';
import { FIRM_DATA } from '../data/firmData';

export const BlogArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = useState(false);

  // Retrieve post (strictly published only - drafts quarantined)
  const post = slug ? BlogService.getPostBySlug(slug, false) : undefined;
  const relatedPosts = post ? BlogService.getRelatedPosts(post.slug, 3) : [];

  // Strictly quarantine drafts & nonexistent slugs by rendering canonical 404 page
  if (!post) {
    return <NotFoundPage />;
  }

  // Social share actions
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
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
    <div className="bg-brand-warm page-reveal min-h-screen">
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

      {/* =========================================================================
          1. EDITORIAL ARTICLE HEADER & BREADCRUMBS
          ========================================================================= */}
      <section className="bg-brand-surface py-12 sm:py-16 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-reveal">
          
          {/* Accessible Semantic Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs font-editorial-meta text-charcoal-muted">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 hover:text-brand-primary transition-colors min-h-[44px] py-2"
            >
              <Home className="w-3.5 h-3.5 text-gold-dark" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-charcoal-light" />
            <Link
              to="/blog"
              className="hover:text-brand-primary transition-colors min-h-[44px] py-2 inline-flex items-center"
            >
              <span>Insights</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-charcoal-light" />
            <span className="text-brand-primary font-semibold truncate max-w-[280px] sm:max-w-md" aria-current="page">
              {post.title}
            </span>
          </nav>

          {/* Back Navigation Button */}
          <div className="mb-6">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-white text-charcoal text-xs font-semibold hover:bg-brand-pale transition-colors btn-tactile min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-800" />
              <span>Back to All Publications</span>
            </Link>
          </div>

          {/* Category Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-md bg-brand-pale border border-emerald-200 text-xs font-editorial-meta font-bold text-emerald-900 uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Article Title */}
          <h1 className="font-editorial-h1 text-brand-forest leading-[1.22]">
            {post.title}
          </h1>

          {/* Metadata Row */}
          <div className="mt-6 pt-6 border-t border-brand-border flex flex-wrap items-center justify-between gap-4 text-xs font-editorial-meta text-brand-muted">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-brand-gold" />
                <span>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-gold" />
                <span>{post.readingTime} min read</span>
              </span>
              <span>•</span>
              <span className="text-brand-forest font-semibold">
                Authored by {post.author}
              </span>
            </div>

            {/* Multi-Platform Social Share Suite (WCAG AAA min 44px) */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-border bg-white hover:bg-brand-pale text-charcoal text-xs font-medium transition-colors btn-tactile min-h-[44px]"
                title="Copy Article Link"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-700" />
                    <span className="text-emerald-800 font-semibold">Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-charcoal-muted" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors btn-tactile min-h-[44px]"
                title="Share via WhatsApp"
              >
                <MessageSquare className="w-4 h-4 text-gold" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleLinkedInShare}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-border bg-white hover:bg-brand-pale text-charcoal text-xs font-medium transition-colors btn-tactile min-h-[44px]"
                title="Share to LinkedIn"
                aria-label="Share to LinkedIn"
              >
                <LinkedInIcon />
              </button>

              <button
                type="button"
                onClick={handleTwitterShare}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-border bg-white hover:bg-brand-pale text-charcoal text-xs font-medium transition-colors btn-tactile min-h-[44px]"
                title="Share on Twitter / X"
                aria-label="Share on Twitter / X"
              >
                <TwitterIcon />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          2. ARTICLE CONTENT & AUTHOR PLAQUE
          ========================================================================= */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Accessible Cover Illustration */}
          {post.coverImage && (
            <div className="mb-10 rounded-2xl overflow-hidden border border-border shadow-card bg-brand-surface scroll-reveal scroll-reveal-image">
              <img
                src={post.coverImage}
                alt={post.coverImageAlt || `Cover illustration for ${post.title}`}
                className="w-full h-auto max-h-[500px] object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Verified Lead Partner Credentials Plaque (Double-Bezel Architecture) */}
          <div className="double-bezel mb-10 card-tactile scroll-reveal scroll-reveal-left">
            <div className="double-bezel-inner bg-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-brand-darkgreen border border-gold/40 flex items-center justify-center font-serif text-xl font-bold text-gold shrink-0 shadow-sm">
                  KV
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-editorial-h3 text-xl font-bold text-brand-primary">
                      {post.author}
                    </h3>
                    <span className="font-editorial-meta text-[10px] font-bold text-gold-dark bg-brand-surface px-2.5 py-0.5 rounded border border-border">
                      ICAI Mem. 252985
                    </span>
                    <span className="font-editorial-meta text-[10px] font-bold text-emerald-800 bg-brand-pale px-2.5 py-0.5 rounded border border-emerald-200">
                      CMA AIR 49
                    </span>
                  </div>
                  <p className="font-editorial-body text-xs sm:text-sm text-charcoal-muted mt-1 leading-relaxed">
                    B.Com, CA, CMA • 10+ Years Experience across Deloitte, Ford Motor Company, Manohar Chowdhry & Associates.
                  </p>
                  <p className="font-editorial-meta text-[11px] text-gold-dark mt-0.5">
                    Move the Dot & Live the Dot Awardee • Tirupati Chambers
                  </p>
                </div>
              </div>

              <Link
                to="/about"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-emerald-200 bg-brand-pale text-emerald-900 text-xs font-semibold hover:bg-emerald-100 transition-colors btn-tactile shrink-0 min-h-[44px]"
              >
                <span>View Practice History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Render Markdown Article Body */}
          <article className="bg-white rounded-2xl border border-border p-6 sm:p-12 shadow-card font-editorial-body text-charcoal scroll-reveal">
            <MarkdownRenderer content={post.content} demoteHeadings={true} />
          </article>

          {/* ICAI Professional Standards Notice & Regulatory Ethics Disclaimer */}
          <div 
            className="mt-10 p-6 sm:p-8 rounded-2xl bg-brand-deep text-white border border-brand-gold/30 shadow-card flex items-start gap-4 scroll-reveal"
            style={{ backgroundColor: '#102D25', color: '#FFFFFF' }}
          >
            <ShieldCheck className="w-6 h-6 text-brand-gold shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-100/90 leading-relaxed space-y-1">
              <strong className="text-white block font-editorial-meta text-sm font-semibold tracking-wide">
                ICAI Professional Standards & Statutory Disclaimer
              </strong>
              <p className="font-editorial-body text-xs text-emerald-100/80">
                This technical commentary is published by Kavitha & Associates strictly under the informational 'pull' model for general educational reference. In accordance with guidelines issued by the Institute of Chartered Accountants of India (ICAI) and the Chartered Accountants Act, 1949, this content does not constitute formal tax advice, statutory audit opinion, legal counsel, or solicitation of professional engagement.
              </p>
            </div>
          </div>

          {/* Technical Advisory & Consultation Intake CTA Banner */}
          <div className="mt-12 p-8 sm:p-10 rounded-2xl bg-brand-surface border border-brand-border text-center space-y-4 scroll-reveal scroll-reveal-scale">
            <span className="font-editorial-meta text-xs font-bold uppercase tracking-wider text-brand-gold block">
              PROFESSIONAL ADVISORY & STATUTORY REVIEW
            </span>
            <h2 className="font-editorial-h2 text-2xl sm:text-3xl font-bold text-brand-forest">
              Require Technical Advisory on this Matter?
            </h2>
            <p className="font-editorial-body text-xs sm:text-sm text-brand-muted max-w-lg mx-auto leading-relaxed">
              Schedule a confidential chambers consultation with CA Kavitha Vijay to evaluate your organization's statutory audit schedules, tax filing positions, or internal controls framework.
            </p>
            <div className="pt-2 flex justify-center items-center gap-3 flex-wrap">
              <Link
                to="/contact"
                className="btn-pill-primary"
              >
                <span>Consult Practice Chambers</span>
                <span className="icon-badge">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
              <a
                href={FIRM_DATA.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill-secondary"
              >
                <span>Chat via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* =========================================================================
              3. CURATED RELATED REGULATORY PUBLICATIONS
              ========================================================================= */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-12 border-t border-border scroll-reveal">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="font-editorial-meta text-xs font-bold uppercase tracking-wider text-gold-dark block">
                    PRACTICE ARCHIVE
                  </span>
                  <h2 className="font-editorial-h2 text-2xl font-bold text-brand-primary">
                    Related Regulatory Publications
                  </h2>
                </div>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline min-h-[44px]"
                >
                  <span>View All Articles</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 scroll-stagger">
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
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};
export default BlogArticlePage;
