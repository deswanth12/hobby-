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
  FileQuestion
} from 'lucide-react';
import { BlogService } from '../services/blogService';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { SEOHead } from '../components/SEOHead';
import { FIRM_DATA } from '../data/firmData';

export const BlogArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = useState(false);

  // Retrieve post (strictly published only)
  const post = slug ? BlogService.getPostBySlug(slug, false) : undefined;
  const relatedPosts = post ? BlogService.getRelatedPosts(post.slug, 3) : [];

  // Share functionality
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    if (!post) return;
    const text = `Read "${post.title}" by CA Kavitha Vijay: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  // Missing or Draft Article Fallback
  if (!post) {
    return (
      <div className="bg-brand-warm min-h-[70vh] flex items-center justify-center py-20 px-4">
        <SEOHead
          title="Article Not Found | Kavitha & Associates"
          description="The requested regulatory publication or article is unavailable, has been moved, or remains unpublished under editorial review."
          canonicalPath="/blog"
        />
        <div className="max-w-md w-full bg-white rounded-2xl border border-border p-8 text-center shadow-card space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-brand-surface border border-border flex items-center justify-center mx-auto text-gold-dark">
            <FileQuestion className="w-8 h-8 stroke-1" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-brand-primary">
              Article Not Found
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-charcoal-muted leading-relaxed">
              The article you are searching for may be an unpublished draft, has been relocated, or is no longer accessible.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              to="/blog"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-brand-primary text-white text-xs font-semibold hover:bg-brand-deep transition-colors btn-tactile"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Browse All Published Articles</span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-white text-brand-primary text-xs font-semibold hover:bg-brand-pale transition-colors btn-tactile"
            >
              <span>Contact Practice Chambers</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const metaTitle = post.seo?.metaTitle || `${post.title} | Kavitha & Associates`;
  const metaDescription = post.seo?.metaDescription || post.excerpt;

  return (
    <div className="bg-brand-warm page-reveal">
      <SEOHead
        title={metaTitle}
        description={metaDescription}
        canonicalPath={`/blog/${post.slug}`}
      />

      {/* =========================================================================
          1. ARTICLE HEADER & BREADCRUMBS
          ========================================================================= */}
      <section className="bg-brand-surface py-12 sm:py-16 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back Navigation */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Publications</span>
          </Link>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md bg-brand-pale border border-emerald-200 text-xs font-bold text-emerald-800 uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Article Title */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-primary tracking-tight leading-[1.2]">
            {post.title}
          </h1>

          {/* Metadata Row */}
          <div className="mt-6 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4 text-xs text-charcoal-muted">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gold-dark" />
                <span>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gold-dark" />
                <span>{post.readingTime} min read</span>
              </span>
            </div>

            {/* Share Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-white hover:bg-brand-pale text-charcoal text-xs font-medium transition-colors"
                title="Copy Article Link"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="text-emerald-800 font-semibold">Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-charcoal-muted" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
                title="Share via WhatsApp"
              >
                <span>Share</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          2. ARTICLE CONTENT & AUTHOR PROFILE
          ========================================================================= */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Author Card Banner with Double-Bezel Architecture */}
          <div className="double-bezel mb-10">
            <div className="double-bezel-inner bg-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0F3E2E] border border-gold/40 flex items-center justify-center font-serif text-lg font-bold text-gold shrink-0 shadow-sm">
                  CA
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-brand-primary">
                      {post.author}
                    </h3>
                    <span className="text-[10px] font-bold text-gold-dark bg-brand-surface px-2 py-0.5 rounded border border-border">
                      ICAI Mem. 252985
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-muted mt-0.5">
                    {post.authorRole} • Big 4 & MNC Auditor (10+ Years)
                  </p>
                </div>
              </div>

              <Link
                to="/about"
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline shrink-0"
              >
                View Partner Credentials →
              </Link>
            </div>
          </div>

          {/* Render Markdown Article Body */}
          <div className="bg-white rounded-2xl border border-border p-6 sm:p-10 shadow-card">
            <MarkdownRenderer content={post.content} />
          </div>

          {/* Regulatory Ethics Disclaimer */}
          <div className="mt-10 p-6 rounded-2xl bg-[#0A2F24] text-white border border-emerald-900 shadow-card flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-gold shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-100/90 leading-relaxed">
              <strong className="text-white block font-semibold mb-1">
                ICAI Professional Standards Notice
              </strong>
              This publication is released by Kavitha & Associates solely for statutory education and general corporate awareness. In strict compliance with the Chartered Accountants Act, 1949 and ICAI ethical regulations, this analysis does not constitute formal tax or audit opinion.
            </div>
          </div>

          {/* Consultation CTA Banner */}
          <div className="mt-12 p-8 rounded-2xl bg-brand-surface border border-border text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-dark block">
              Professional Advisory & Statutory Review
            </span>
            <h3 className="font-serif text-2xl font-bold text-brand-primary">
              Require Technical Advisory on this Subject?
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted max-w-lg mx-auto leading-relaxed">
              Schedule a direct consultation with CA Kavitha Vijay to evaluate your company's statutory audit schedules, tax position, or internal controls framework.
            </p>
            <div className="pt-2 flex justify-center items-center gap-3 flex-wrap">
              <Link
                to="/contact"
                className="btn-pill-action bg-brand-primary text-white hover:bg-brand-deep group text-xs shadow-card hover:shadow-card-hover border border-gold/40"
              >
                <span>Consult the Practice</span>
                <span className="icon-badge bg-white/10 text-gold group-hover:bg-gold group-hover:text-brand-deep">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
              <a
                href={FIRM_DATA.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-border bg-white text-brand-primary text-xs font-semibold hover:bg-brand-pale transition-colors btn-tactile"
              >
                <span>Chat via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* =========================================================================
              3. RELATED ARTICLES
              ========================================================================= */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-12 border-t border-border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gold-dark block">
                    Curated Reading
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-brand-primary">
                    Related Regulatory Publications
                  </h3>
                </div>
                <Link
                  to="/blog"
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline"
                >
                  View All →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((rel) => (
                  <Link
                    key={rel.slug}
                    to={`/blog/${rel.slug}`}
                    className="p-5 rounded-2xl bg-white border border-border shadow-subtle card-premium-hover flex flex-col justify-between group"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dark block mb-2">
                        {rel.tags[0] || 'Regulatory'}
                      </span>
                      <h4 className="font-serif text-base font-bold text-brand-primary group-hover:text-emerald-800 transition-colors leading-snug line-clamp-2">
                        {rel.title}
                      </h4>
                      <p className="mt-2 text-xs text-charcoal-muted line-clamp-2 leading-relaxed">
                        {rel.excerpt}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-charcoal-muted">
                      <span>{rel.readingTime} min read</span>
                      <span className="text-emerald-800 font-semibold group-hover:translate-x-0.5 transition-transform">
                        Read →
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
