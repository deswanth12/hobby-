import fs from 'fs';

// 1. AdminLayout.tsx
const layoutPath = 'src/components/admin/AdminLayout.tsx';
let layoutCode = fs.readFileSync(layoutPath, 'utf8');

// Clean up unused PenTool if not inserted properly
layoutCode = layoutCode.replace('  PenTool,\n', '');

// Add PenTool back cleanly
layoutCode = layoutCode.replace(
  '  BookOpen,',
  '  BookOpen,\n  PenTool,'
);

// Add the button right before </nav>
if (!layoutCode.includes('+ Write New Article')) {
  layoutCode = layoutCode.replace(
    /(\s*)<\/nav>/,
    `$1  {/* Quick Action: Write Article (Directly where user requested) */}
$1  <div className="pt-3 px-1">
$1    <Link
$1      to={\`\${ADMIN_ROUTES.articles}?action=new\`}
$1      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all duration-150 group"
$1    >
$1      <PenTool className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform duration-200" />
$1      <span>+ Write New Article</span>
$1    </Link>
$1  </div>
$1</nav>`
  );
}

// Add top header button if not present
if (!layoutCode.includes('<span>+ Write Article</span>')) {
  layoutCode = layoutCode.replace(
    /(<div className="flex items-center gap-2\.5">)/,
    `$1
            <Link
              to={\`\${ADMIN_ROUTES.articles}?action=new\`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <PenTool className="w-3 h-3 text-amber-300" />
              <span>+ Write Article</span>
            </Link>`
  );
}

fs.writeFileSync(layoutPath, layoutCode, 'utf8');
console.log('AdminLayout.tsx updated cleanly');

// 2. AdminOverviewPage.tsx
const overviewPath = 'src/pages/admin/AdminOverviewPage.tsx';
let overviewCode = fs.readFileSync(overviewPath, 'utf8');

// Remove unused PenTool from imports if present
overviewCode = overviewCode.replace('  PenTool,\n', '');

// Insert Articles Card right after Enquiries card
if (!overviewCode.includes('Articles & Insights')) {
  const needle = '              </Link>\n\n              <Link\n                to={ADMIN_ROUTES.content}';
  const articlesCard = `              </Link>

              <Link
                to={ADMIN_ROUTES.articles}
                className="p-4 rounded-xl border border-gray-200 hover:border-brand-darkgreen hover:bg-emerald-50/40 transition-colors duration-200 text-left flex flex-col justify-between group"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100/60 text-brand-darkgreen flex items-center justify-center mb-2">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-gray-900 group-hover:text-brand-darkgreen">
                    Articles & Insights
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    Write, edit & publish articles
                  </div>
                </div>
                <div className="flex items-center text-[11px] font-bold text-brand-darkgreen mt-3">
                  Write / Edit <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </Link>

              <Link
                to={ADMIN_ROUTES.content}`;

  if (overviewCode.includes(needle)) {
    overviewCode = overviewCode.replace(needle, articlesCard);
  } else {
    // Regex fallback
    overviewCode = overviewCode.replace(
      /(to=\{ADMIN_ROUTES\.content\})/i,
      `to={ADMIN_ROUTES.articles}\n                className="p-4 rounded-xl border border-gray-200 hover:border-brand-darkgreen hover:bg-emerald-50/40 transition-colors duration-200 text-left flex flex-col justify-between group"\n              >\n                <div>\n                  <div className="w-8 h-8 rounded-lg bg-emerald-100/60 text-brand-darkgreen flex items-center justify-center mb-2">\n                    <BookOpen className="w-4 h-4" />\n                  </div>\n                  <div className="text-xs font-bold text-gray-900 group-hover:text-brand-darkgreen">\n                    Articles & Insights\n                  </div>\n                  <div className="text-[11px] text-gray-500 mt-0.5">\n                    Write, edit & publish articles\n                  </div>\n                </div>\n                <div className="flex items-center text-[11px] font-bold text-brand-darkgreen mt-3">\n                  Write / Edit <ArrowRight className="w-3 h-3 ml-1" />\n                </div>\n              </Link>\n\n              <Link\n                $1`
    );
  }
}

fs.writeFileSync(overviewPath, overviewCode, 'utf8');
console.log('AdminOverviewPage.tsx updated cleanly');
