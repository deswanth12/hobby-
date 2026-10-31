import fs from 'fs';

const layoutPath = 'src/components/admin/AdminLayout.tsx';
let code = fs.readFileSync(layoutPath, 'utf8');

// 1. Remove the accidental button inside NavLink
const badBlock = `                <div className="flex items-center gap-2.5">
            <Link
              to={\`\${ADMIN_ROUTES.articles}?action=new\`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <PenTool className="w-3 h-3 text-amber-300" />
              <span>+ Write Article</span>
            </Link>
                  <Icon className={\`w-4 h-4 \${isActive ? 'text-neutral-900' : 'text-neutral-400'}\`} />
                  <span>{item.name}</span>
                </div>`;

const goodBlock = `                <div className="flex items-center gap-2.5">
                  <Icon className={\`w-4 h-4 \${isActive ? 'text-neutral-900' : 'text-neutral-400'}\`} />
                  <span>{item.name}</span>
                </div>`;

code = code.replace(badBlock, goodBlock);

// 2. Add button in the top header before "View Site"
const headerTarget = `<Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-medium transition-colors"
            >`;

const headerReplacement = `<Link
              to={\`\${ADMIN_ROUTES.articles}?action=new\`}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <PenTool className="w-3 h-3 text-amber-300" />
              <span>+ Write Article</span>
            </Link>

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-medium transition-colors"
            >`;

if (!code.includes('hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs transition-colors')) {
  code = code.replace(headerTarget, headerReplacement);
}

fs.writeFileSync(layoutPath, code, 'utf8');
console.log('AdminLayout.tsx cleaned and aligned perfectly');
