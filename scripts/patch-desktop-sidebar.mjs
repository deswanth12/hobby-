import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('.');
const layoutPath = path.join(ROOT, 'src/components/admin/AdminLayout.tsx');
let code = fs.readFileSync(layoutPath, 'utf8');

// 1. Add Articles & Insights to navItems
if (!code.includes("name: 'Articles & Insights', path: ADMIN_ROUTES.articles")) {
  code = code.replace(
    /(\{ name: 'Practice Settings', path: ADMIN_ROUTES\.settings, icon: Sliders \},)/,
    `$1\n    { name: 'Articles & Insights', path: ADMIN_ROUTES.articles, icon: BookOpen },`
  );
  console.log('✔ Added Articles & Insights to navItems');
}

// 2. Add button right under navItems in Desktop Sidebar
if (!code.includes('+ Write New Article</span>\n            </Link>\n          </div>\n        </nav>')) {
  const desktopBtn = `          <div className="pt-3 px-1 mt-2 border-t border-[#F0F0F0]">\n            <Link\n              to={\`\${ADMIN_ROUTES.articles}?action=new\`}\n              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors group"\n            >\n              <PenTool className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />\n              <span>+ Write New Article</span>\n            </Link>\n          </div>\n        </nav>`;

  code = code.replace(
    /(\s+<\/NavLink>\r?\n\s+\);\r?\n\s+\}\)\}\r?\n)(\s+<\/nav>)/,
    `$1${desktopBtn}`
  );
  console.log('✔ Added + Write New Article button to Desktop Sidebar');
}

fs.writeFileSync(layoutPath, code, 'utf8');
console.log('AdminLayout.tsx patch applied successfully.');
