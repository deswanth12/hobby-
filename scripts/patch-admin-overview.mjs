import fs from 'fs';

const path = 'src/pages/admin/AdminOverviewPage.tsx';
let code = fs.readFileSync(path, 'utf8');

// Add BookOpen and PenTool to imports
code = code.replace(
  /FileEdit,\s*Sliders,/,
  'FileEdit,\n  Sliders,\n  BookOpen,\n  PenTool,'
);

// Replace grid-cols-1 sm:grid-cols-3 gap-3 with 4-card grid
const oldGrid = `<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">`;
const newGrid = `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">`;

code = code.replace(oldGrid, newGrid);

// Insert Articles card before Content Editor
const targetContentCard = `<Link
                to={ADMIN_ROUTES.content}`;

const articlesCard = `<Link
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

code = code.replace(targetContentCard, articlesCard);

fs.writeFileSync(path, code, 'utf8');
console.log('Successfully patched AdminOverviewPage.tsx');
