import fs from 'fs';
import path from 'path';

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf-8');
  for (const [target, replacement] of replacements) {
    // Normalize CRLF to LF for matching
    const normContent = content.replace(/\r\n/g, '\n');
    const normTarget = target.replace(/\r\n/g, '\n');
    if (!normContent.includes(normTarget)) {
      console.error(`Target not found in ${filePath}:`, normTarget.slice(0, 80));
      process.exit(1);
    }
    content = normContent.replace(normTarget, replacement.replace(/\r\n/g, '\n'));
  }
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${filePath}`);
}

// 1. AboutPage.tsx
replaceInFile(path.resolve('src/pages/AboutPage.tsx'), [
  [
    `              <div className="pt-2 flex flex-wrap gap-4 text-xs font-editorial-body text-emerald-200">
                <div>
                  <strong className="text-white block">Primary Desk:</strong>
                  <a href="tel:+919626350900" className="text-brand-gold hover:underline font-semibold">+91 96263 50900</a>
                </div>
                <div>
                  <strong className="text-white block">Alternative Line:</strong>
                  <a href="tel:+919542153906" className="text-brand-gold hover:underline font-semibold">+91 95421 53906</a>
                </div>
                <div>
                  <strong className="text-white block">Official Email:</strong>
                  <a href="mailto:cakavithasrj@gmail.com" className="text-brand-gold hover:underline font-semibold">cakavithasrj@gmail.com</a>
                </div>
              </div>`,
    `              <div className="pt-2 flex flex-wrap gap-4 text-xs font-editorial-body text-emerald-200">
                <div>
                  <strong className="text-white block">Primary Desk:</strong>
                  <a href={\`tel:\${firm.contact.primaryPhoneClean || firm.contact.primaryPhone.replace(/\\s+/g, '')}\`} className="text-brand-gold hover:underline font-semibold">{firm.contact.primaryPhone}</a>
                </div>
                <div>
                  <strong className="text-white block">Alternative Line:</strong>
                  <a href={\`tel:\${firm.contact.secondaryPhoneClean || firm.contact.secondaryPhone.replace(/\\s+/g, '')}\`} className="text-brand-gold hover:underline font-semibold">{firm.contact.secondaryPhone}</a>
                </div>
                <div>
                  <strong className="text-white block">Official Email:</strong>
                  <a href={\`mailto:\${firm.contact.email}\`} className="text-brand-gold hover:underline font-semibold">{firm.contact.email}</a>
                </div>
              </div>`
  ],
  [
    `className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0077b5]/20 border border-[#0077b5]/40 text-xs font-semibold text-sky-200 hover:text-white hover:bg-[#0077b5]/30 transition-colors"`,
    `className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] rounded-full bg-[#0077b5]/20 border border-[#0077b5]/40 text-xs font-semibold text-sky-200 hover:text-white hover:bg-[#0077b5]/30 transition-colors btn-tactile"`
  ]
]);

// 2. adminStorage.ts
replaceInFile(path.resolve('src/services/adminStorage.ts'), [
  [
    `  isCloudConnected(): boolean {
    return isSupabaseConfigured() || true; // Server API is active on port 5173
  },`,
    `  isCloudConnected(): boolean {
    return isSupabaseConfigured();
  },`
  ]
]);

// 3. AdminContentPage.tsx
replaceInFile(path.resolve('src/pages/admin/AdminContentPage.tsx'), [
  [
    `    const ok = adminStorage.savePost(postPayload);
    if (ok) {
      const updated = BlogService.getAllPosts(true);
      setPosts(updated);
      setSelectedPostSlug(cleanSlug);
      setIsCreatingNewPost(false);`,
    `    const ok = adminStorage.savePost(postPayload);
    if (ok) {
      if (!isCreatingNewPost && selectedPostSlug && selectedPostSlug !== cleanSlug) {
        adminStorage.deletePost(selectedPostSlug);
      }
      const updated = BlogService.getAllPosts(true);
      setPosts(updated);
      setSelectedPostSlug(cleanSlug);
      setIsCreatingNewPost(false);`
  ]
]);

// 4. AdminEnquiriesPage.tsx
replaceInFile(path.resolve('src/pages/admin/AdminEnquiriesPage.tsx'), [
  [
    `    if (fetchRemote && isCloud) {`,
    `    if (fetchRemote) {`
  ],
  [
    `      setSelectedEnquiry(prev => prev ? { ...prev, status: editStatus, notes: editNotes } : null);`,
    `      setSelectedEnquiry(prev => prev ? { ...prev, status: editStatus, followUpNotes: editNotes } : null);`
  ],
  [
    `    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };`,
    `    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };`
  ]
]);

// 5. AdminOverviewPage.tsx
replaceInFile(path.resolve('src/pages/admin/AdminOverviewPage.tsx'), [
  [
    `    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };`,
    `    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };`
  ]
]);

// 6. BlogArticlePage.tsx
replaceInFile(path.resolve('src/pages/BlogArticlePage.tsx'), [
  [
    `  // Social share actions
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };`,
    `  const copyTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  // Social share actions
  const handleCopyLink = () => {
    if (typeof window !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          setCopied(true);
          if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
          copyTimerRef.current = window.setTimeout(() => setCopied(false), 2500);
        })
        .catch(() => {
          setCopied(false);
        });
    }
  };`
  ]
]);

// 7. SEOHead.tsx
replaceInFile(path.resolve('src/components/SEOHead.tsx'), [
  [
    `  useEffect(() => {`,
    `  const articleStr = JSON.stringify(article);
  const jsonLdStr = JSON.stringify(jsonLd);
  const breadcrumbsStr = JSON.stringify(breadcrumbs);

  useEffect(() => {`
  ],
  [
    `  }, [title, description, canonicalPath, noIndex, ogType, image, article, jsonLd, breadcrumbs]);`,
    `  }, [title, description, canonicalPath, noIndex, ogType, image, articleStr, jsonLdStr, breadcrumbsStr]);`
  ]
]);

// 8. ScrollToTop.tsx
replaceInFile(path.resolve('src/components/ScrollToTop.tsx'), [
  [
    `  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);`,
    `  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      let attempts = 0;
      const tryScroll = () => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else if (attempts < 5) {
          attempts++;
          requestAnimationFrame(tryScroll);
        } else {
          window.scrollTo(0, 0);
        }
      };
      requestAnimationFrame(tryScroll);
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);`
  ]
]);

// 9. ContactPage.tsx
replaceInFile(path.resolve('src/pages/ContactPage.tsx'), [
  [
    `<div className="pt-2 pl-13 space-y-1 text-sm font-semibold text-brand-primary">`,
    `<div className="pt-2 pl-[52px] space-y-1 text-sm font-semibold text-brand-primary">`
  ],
  [
    `<div className="pt-2 pl-13 text-sm font-semibold text-brand-primary">`,
    `<div className="pt-2 pl-[52px] text-sm font-semibold text-brand-primary">`
  ],
  [
    `<div className="pt-2 pl-13">`,
    `<div className="pt-2 pl-[52px]">`
  ],
  [
    `<div className="pt-1 pl-13 text-xs text-charcoal leading-relaxed space-y-1">`,
    `<div className="pt-1 pl-[52px] text-xs text-charcoal leading-relaxed space-y-1">`
  ]
]);

// 10. Duplicate CSS classes
replaceInFile(path.resolve('src/components/Navbar.tsx'), [
  [
    `transition-colors duration-200 duration-200 btn-tactile`,
    `transition-colors duration-200 btn-tactile`
  ]
]);

replaceInFile(path.resolve('src/components/animations/DualArrowButton.tsx'), [
  [
    `transition-colors duration-200 duration-300`,
    `transition-colors duration-300`
  ]
]);

replaceInFile(path.resolve('src/components/StatutoryEntityAdvisor.tsx'), [
  [
    `text-brand-forest text-xs text-xs font-semibold mb-3`,
    `text-brand-forest text-xs font-semibold mb-3`
  ]
]);

replaceInFile(path.resolve('src/pages/BlogPage.tsx'), [
  [
    `py-10 sm:py-16 md:py-20 lg:py-24 lg:py-28`,
    `py-10 sm:py-16 md:py-20 lg:py-24`
  ],
  [
    `py-16 sm:py-10 sm:py-16 md:py-20 lg:py-24`,
    `py-10 sm:py-16 md:py-20 lg:py-24`
  ]
]);

// 11. StatutoryCalendar.tsx (remove as any and duplicate classes)
replaceInFile(path.resolve('src/components/StatutoryCalendar.tsx'), [
  [
    `  const [activeFilter, setActiveFilter] = useState<'all' | 'tax' | 'gst' | 'corporate' | 'audit'>('all');`,
    `  type CalendarFilter = 'all' | 'tax' | 'gst' | 'corporate' | 'audit';
  const [activeFilter, setActiveFilter] = useState<CalendarFilter>('all');`
  ],
  [
    `          {[
            { id: 'all', label: 'All Dates' },
            { id: 'tax', label: 'Income Tax' },
            { id: 'gst', label: 'GST' },
            { id: 'audit', label: 'Audits' },
            { id: 'corporate', label: 'MCA / ROC' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id as any)}`,
    `          {([
            { id: 'all' as const, label: 'All Dates' },
            { id: 'tax' as const, label: 'Income Tax' },
            { id: 'gst' as const, label: 'GST' },
            { id: 'audit' as const, label: 'Audits' },
            { id: 'corporate' as const, label: 'MCA / ROC' }
          ]).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}`
  ],
  [
    `text-[11px] text-xs font-semibold text-brand-gold font-bold mb-2`,
    `text-xs font-bold text-brand-gold mb-2`
  ]
]);

console.log('All R9 code fixes successfully applied!');
