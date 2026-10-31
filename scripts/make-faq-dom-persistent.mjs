import fs from 'node:fs';

// 1. Update KnowledgeFAQ.tsx
let kFaq = fs.readFileSync('src/components/KnowledgeFAQ.tsx', 'utf8').replace(/\r\n/g, '\n');
const kTarget = `{isExpanded && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-charcoal leading-relaxed border-t border-border/50 animate-fadeIn">`;
const kReplacement = `<div className={\`px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-charcoal leading-relaxed border-t border-border/50 animate-fadeIn \${isExpanded ? 'block' : 'hidden'}\`}>`;

if (kFaq.includes(kTarget)) {
  // Replace the closing tag as well
  kFaq = kFaq.replace(kTarget, kReplacement);
  // remove the matching )}
  kFaq = kFaq.replace(`                  </div>\n                )}`, `                  </div>`);
  fs.writeFileSync('src/components/KnowledgeFAQ.tsx', kFaq.replace(/\n/g, '\r\n'), 'utf8');
  console.log('KnowledgeFAQ.tsx updated to persistent DOM');
} else {
  console.log('KnowledgeFAQ.tsx target not matched');
}

// 2. Update the 5 service pages
const pages = [
  'src/pages/GSTServicesPage.tsx',
  'src/pages/IncomeTaxPage.tsx',
  'src/pages/CompanyRegistrationPage.tsx',
  'src/pages/VirtualCFOPage.tsx',
  'src/pages/RERAConsultantPage.tsx'
];

for (const p of pages) {
  let content = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
  const target = `{openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 border-t border-brand-border/60 bg-brand-surface/40 space-y-3">`;
  const replacement = `<div className={\`px-5 pb-5 pt-1 border-t border-brand-border/60 bg-brand-surface/40 space-y-3 \${openFaq === idx ? 'block' : 'hidden'}\`}>`;

  if (content.includes(target)) {
    content = content.replace(target, replacement);
    content = content.replace(`                  </div>\n                )}`, `                  </div>`);
    fs.writeFileSync(p, content.replace(/\n/g, '\r\n'), 'utf8');
    console.log(`${p} updated to persistent DOM`);
  } else {
    console.log(`${p} target not matched`);
  }
}
