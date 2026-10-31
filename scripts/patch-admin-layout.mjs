import fs from 'fs';

const layoutPath = 'src/components/admin/AdminLayout.tsx';
let layoutCode = fs.readFileSync(layoutPath, 'utf8');

// Add BookOpen and PenTool to imports
layoutCode = layoutCode.replace(
  /FileEdit,\s*Sliders,/,
  'FileEdit,\n  Sliders,\n  BookOpen,\n  PenTool,'
);

// Update navItems to include Articles & Insights
layoutCode = layoutCode.replace(
  `{ name: 'Content Editor', path: ADMIN_ROUTES.content, icon: FileEdit },`,
  `{ name: 'Articles & Insights', path: ADMIN_ROUTES.articles, icon: BookOpen },\n    { name: 'Content Editor', path: ADMIN_ROUTES.content, icon: FileEdit },`
);

// Add prominent Write Article button in sidebar
const sidebarButton = `          })}

          {/* Quick Action: Write Article (Prominent button requested by user) */}
          <div className="pt-3 px-1">
            <Link
              to={\`\${ADMIN_ROUTES.articles}?action=new\`}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all duration-150 group"
            >
              <PenTool className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform duration-200" />
              <span>+ Write New Article</span>
            </Link>
          </div>
        </nav>`;

layoutCode = layoutCode.replace(
  `          })}\n        </nav>`,
  sidebarButton
);

// Add + Write Article button in the top header
const headerButton = `            <Link
              to={\`\${ADMIN_ROUTES.articles}?action=new\`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <PenTool className="w-3 h-3 text-amber-300" />
              <span>+ Write Article</span>
            </Link>

            <Link
              to="/"`;

layoutCode = layoutCode.replace(
  `            <Link\n              to="/"`,
  headerButton
);

// Add in mobile drawer
const mobileDrawerButton = `          })}

          <div className="px-2 pt-2">
            <Link
              to={\`\${ADMIN_ROUTES.articles}?action=new\`}
              onClick={() => setMobileOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-800 text-white text-xs font-semibold"
            >
              <PenTool className="w-3.5 h-3.5 text-amber-300" />
              <span>+ Write Article</span>
            </Link>
          </div>`;

layoutCode = layoutCode.replace(
  `          })}\n          <div className="pt-2 mt-2 border-t border-[#F0F0F0]`,
  `${mobileDrawerButton}\n          <div className="pt-2 mt-2 border-t border-[#F0F0F0]`
);

fs.writeFileSync(layoutPath, layoutCode, 'utf8');
console.log('Successfully patched AdminLayout.tsx');
