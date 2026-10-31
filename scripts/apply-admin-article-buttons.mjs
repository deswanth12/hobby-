import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('.');

// =========================================================================
// 1. UPDATE src/pages/admin/AdminContentPage.tsx
// =========================================================================
const contentPagePath = path.join(ROOT, 'src/pages/admin/AdminContentPage.tsx');
let contentCode = fs.readFileSync(contentPagePath, 'utf8');

if (!contentCode.includes('interface AdminContentPageProps')) {
  // Add import useLocation if not present
  if (!contentCode.includes('useLocation')) {
    contentCode = contentCode.replace(
      /import React, \{ useState, useEffect, useMemo \} from 'react';/,
      `import React, { useState, useEffect, useMemo } from 'react';\nimport { useLocation } from 'react-router-dom';`
    );
  }

  // Add interface and update component declaration
  contentCode = contentCode.replace(
    /export const AdminContentPage: React\.FC = \(\) => \{\r?\n\s+const \{ data: firmData \} = useFirmData\(\);\r?\n\s+const \[activeTab, setActiveTab\] = useState<'services' \| 'faqs' \| 'posts'>\('services'\);/,
    `export interface AdminContentPageProps {\n  initialTab?: 'services' | 'faqs' | 'posts';\n}\n\nexport const AdminContentPage: React.FC<AdminContentPageProps> = ({ initialTab }) => {\n  const location = useLocation();\n  const { data: firmData } = useFirmData();\n  const [activeTab, setActiveTab] = useState<'services' | 'faqs' | 'posts'>(() => {\n    if (initialTab) return initialTab;\n    if (typeof window !== 'undefined' && window.location.pathname.includes('/articles')) return 'posts';\n    return 'services';\n  });`
  );

  // Add auto-detection effect after handleStartNewPost
  const effectCode = `\n\n  useEffect(() => {\n    const params = new URLSearchParams(location.search);\n    if (params.get('action') === 'new') {\n      setActiveTab('posts');\n      handleStartNewPost();\n    } else if (initialTab === 'posts' || location.pathname.includes('/articles')) {\n      setActiveTab('posts');\n    }\n  }, [location.pathname, location.search, initialTab]);\n`;
  
  contentCode = contentCode.replace(
    /(const handleStartNewPost = \(\) => \{[\s\S]*?setPostViewMode\('edit'\);\r?\n\s+\};)/,
    `$1${effectCode}`
  );

  // Make title in AdminLayout dynamic
  contentCode = contentCode.replace(
    /<AdminLayout \r?\n\s+title="Content & Services" \r?\n\s+subtitle="Edit practice disciplines, statutory FAQs, and technical articles\."\r?\n\s+>/,
    `<AdminLayout \n      title={activeTab === 'posts' ? "Articles & Insights" : "Content & Services"} \n      subtitle={activeTab === 'posts' ? "Write, edit, and publish statutory articles & commentary." : "Edit practice disciplines, statutory FAQs, and technical articles."}\n    >`
  );

  fs.writeFileSync(contentPagePath, contentCode, 'utf8');
  console.log('✔ Updated src/pages/admin/AdminContentPage.tsx');
} else {
  console.log('ℹ AdminContentPage.tsx already has AdminContentPageProps');
}

// =========================================================================
// 2. UPDATE src/components/admin/AdminLayout.tsx
// =========================================================================
const adminLayoutPath = path.join(ROOT, 'src/components/admin/AdminLayout.tsx');
let layoutCode = fs.readFileSync(adminLayoutPath, 'utf8');

// Ensure BookOpen and PenTool are imported
if (!layoutCode.includes('PenTool')) {
  layoutCode = layoutCode.replace(
    /ExternalLink,\r?\n\} from 'lucide-react';/,
    `ExternalLink,\n  BookOpen,\n  PenTool,\n} from 'lucide-react';`
  );
}

// Add Desktop Sidebar Article Section below Practice Settings
if (!layoutCode.includes('Articles & Publications')) {
  const desktopSidebarBlock = `\n          {/* Dedicated Section & Action Button for Articles right below Practice Settings */}\n          <div className="pt-3 mt-3 border-t border-[#F0F0F0] space-y-1">\n            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 px-3 py-1">\n              Articles & Publications\n            </div>\n\n            <NavLink\n              to={ADMIN_ROUTES.articles}\n              className={({ isActive }) => \`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-150 \${\n                isActive || location.pathname.startsWith(ADMIN_ROUTES.articles)\n                  ? 'bg-neutral-100 text-neutral-900 font-semibold'\n                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'\n              }\`}\n            >\n              <div className="flex items-center gap-2.5">\n                <BookOpen className={\`w-4 h-4 \${location.pathname.startsWith(ADMIN_ROUTES.articles) ? 'text-neutral-900' : 'text-neutral-400'}\`} />\n                <span>Articles & Insights</span>\n              </div>\n            </NavLink>\n\n            <Link\n              to={\`\${ADMIN_ROUTES.articles}?action=new\`}\n              className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-medium shadow-xs transition-colors group"\n            >\n              <PenTool className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-6 transition-transform" />\n              <span>+ Write New Article</span>\n            </Link>\n          </div>\n        </nav>`;

  layoutCode = layoutCode.replace(
    /\{\/navItems\.map\(\(item\) => \{[\s\S]*?\}\)\}\r?\n\s+<\/nav>/,
    (match) => {
      return match.replace(/<\/nav>/, `${desktopSidebarBlock}`);
    }
  );

  // Add Mobile Drawer Article Section
  const mobileDrawerBlock = `\n          <div className="pt-2 mt-2 border-t border-[#F0F0F0] space-y-1">\n            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 px-3 py-1">\n              Articles & Publications\n            </div>\n            <Link\n              to={ADMIN_ROUTES.articles}\n              onClick={() => setMobileOpen(false)}\n              className={\`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors \${\n                location.pathname.startsWith(ADMIN_ROUTES.articles) ? 'bg-neutral-100 text-neutral-900 font-semibold' : 'text-neutral-600 hover:bg-neutral-50'\n              }\`}\n            >\n              <div className="flex items-center gap-2.5">\n                <BookOpen className="w-4 h-4 text-neutral-500" />\n                <span>Articles & Insights</span>\n              </div>\n            </Link>\n            <Link\n              to={\`\${ADMIN_ROUTES.articles}?action=new\`}\n              onClick={() => setMobileOpen(false)}\n              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-medium shadow-xs"\n            >\n              <PenTool className="w-3.5 h-3.5 text-amber-300" />\n              <span>+ Write New Article</span>\n            </Link>\n          </div>`;

  layoutCode = layoutCode.replace(
    /(<div className="pt-2 mt-2 border-t border-\[#F0F0F0\] flex items-center justify-between)/,
    `${mobileDrawerBlock}\n$1`
  );

  // Add Header button next to Encrypted Session
  const headerBtn = `<Link\n              to={\`\${ADMIN_ROUTES.articles}?action=new\`}\n              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-medium shadow-xs transition-colors"\n            >\n              <PenTool className="w-3 h-3 text-amber-300" />\n              <span>+ Write Article</span>\n            </Link>\n\n            `;

  layoutCode = layoutCode.replace(
    /(<div className="flex items-center gap-2\.5">\r?\n\s+)(<div className="inline-flex items-center gap-1\.5 px-2\.5 py-1)/,
    `$1${headerBtn}$2`
  );

  fs.writeFileSync(adminLayoutPath, layoutCode, 'utf8');
  console.log('✔ Updated src/components/admin/AdminLayout.tsx');
} else {
  console.log('ℹ AdminLayout.tsx already has Articles section');
}

// =========================================================================
// 3. UPDATE src/pages/admin/AdminOverviewPage.tsx
// =========================================================================
const overviewPath = path.join(ROOT, 'src/pages/admin/AdminOverviewPage.tsx');
let overviewCode = fs.readFileSync(overviewPath, 'utf8');

if (!overviewCode.includes('BookOpen')) {
  overviewCode = overviewCode.replace(
    /Sparkles\r?\n\} from 'lucide-react';/,
    `Sparkles,\n  BookOpen,\n} from 'lucide-react';`
  );
}

if (!overviewCode.includes('to={ADMIN_ROUTES.articles}')) {
  // Update grid from sm:grid-cols-3 to sm:grid-cols-2 lg:grid-cols-4
  overviewCode = overviewCode.replace(
    /<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">/,
    `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">`
  );

  const articleCard = `              <Link\n                to={ADMIN_ROUTES.articles}\n                className="p-4 rounded-xl border border-gray-200 hover:border-brand-darkgreen hover:bg-emerald-50/40 transition-colors duration-200 text-left flex flex-col justify-between group"\n              >\n                <div>\n                  <div className="w-8 h-8 rounded-lg bg-emerald-100/60 text-brand-darkgreen flex items-center justify-center mb-2">\n                    <BookOpen className="w-4 h-4" />\n                  </div>\n                  <div className="text-xs font-bold text-gray-900 group-hover:text-brand-darkgreen">\n                    Articles & Insights\n                  </div>\n                  <div className="text-[11px] text-gray-500 mt-0.5">\n                    Write, edit, and publish statutory commentary\n                  </div>\n                </div>\n                <div className="flex items-center text-[11px] font-bold text-brand-darkgreen mt-3">\n                  Write / Edit Articles <ArrowRight className="w-3 h-3 ml-1" />\n                </div>\n              </Link>\n\n`;

  // Place before Practice Settings
  overviewCode = overviewCode.replace(
    /(<Link\r?\n\s+to=\{ADMIN_ROUTES\.settings\})/,
    `${articleCard}$1`
  );

  fs.writeFileSync(overviewPath, overviewCode, 'utf8');
  console.log('✔ Updated src/pages/admin/AdminOverviewPage.tsx');
} else {
  console.log('ℹ AdminOverviewPage.tsx already has Articles card');
}

console.log('\nAll files processed successfully.');
