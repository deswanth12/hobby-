import fs from 'fs';
import path from 'path';

// Exact string replacements for HomePage.tsx
{
  const filePath = path.resolve('src/pages/HomePage.tsx');
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Remove import
  const imp = "import { KnowledgeFAQ } from '../components/KnowledgeFAQ';";
  if (!content.includes(imp)) throw new Error('KnowledgeFAQ import not found');
  content = content.replace(imp + '\r\n', '').replace(imp + '\n', '');

  // 2. Remove sectionId
  const sec = "      'knowledge-faq',";
  if (!content.includes(sec)) throw new Error('knowledge-faq sectionId not found');
  content = content.replace(sec + '\r\n', '').replace(sec + '\n', '');

  // 3. Remove anchor button
  const btn = `              <a
                href="#knowledge-faq"
                className={\`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors duration-200 shadow-xs btn-tactile \${
                  activeSection === 'knowledge-faq'
                    ? 'bg-brand-forest text-brand-white border-brand-gold'
                    : 'bg-brand-white text-brand-forest border-brand-border hover:border-brand-gold'
                }\`}
              >
                Statutory FAQ
              </a>`;
  const btnNormalized = btn.replace(/\r?\n/g, '\r\n');
  const btnLF = btn.replace(/\r?\n/g, '\n');
  if (content.includes(btnNormalized)) {
    content = content.replace(btnNormalized + '\r\n', '');
  } else if (content.includes(btnLF)) {
    content = content.replace(btnLF + '\n', '');
  } else {
    throw new Error('Statutory FAQ button not found');
  }

  // 4. Remove Section 9 mount
  const s9 = `      {/* =========================================================================
          SECTION 9: STATUTORY KNOWLEDGE & ADVISORY FAQ
          Canvas: Surface Tint #EDE8DF (bg-brand-surface)
          ========================================================================= */}
      <div id="knowledge-faq" className="scroll-mt-28 scroll-reveal">
        <KnowledgeFAQ />
      </div>`;
  const s9Normalized = s9.replace(/\r?\n/g, '\r\n');
  const s9LF = s9.replace(/\r?\n/g, '\n');
  if (content.includes(s9Normalized)) {
    content = content.replace(s9Normalized + '\r\n', '');
  } else if (content.includes(s9LF)) {
    content = content.replace(s9LF + '\n', '');
  } else {
    throw new Error('Section 9 mount not found');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✔ HomePage.tsx cleaned successfully');
}

// Exact string replacements for ServicesPage.tsx
{
  const filePath = path.resolve('src/pages/ServicesPage.tsx');
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Remove import
  const imp = "import { StatutoryEntityAdvisor } from '../components/StatutoryEntityAdvisor';";
  if (!content.includes(imp)) throw new Error('StatutoryEntityAdvisor import not found');
  content = content.replace(imp + '\r\n', '').replace(imp + '\n', '');

  // 2. Remove subnav anchor
  const anchor = `              <a 
                href="#statutory-advisor" 
                className="min-h-[44px] inline-flex items-center px-3.5 py-2.5 rounded-full bg-brand-gold/15 border border-brand-gold/40 text-xs font-semibold text-brand-forest hover:bg-brand-gold/25 hover:text-brand-deep transition-colors shadow-xs btn-tactile"
              >
                Entity Advisor
              </a>`;
  const anchorNormalized = anchor.replace(/\r?\n/g, '\r\n');
  const anchorLF = anchor.replace(/\r?\n/g, '\n');
  if (content.includes(anchorNormalized)) {
    content = content.replace(anchorNormalized + '\r\n', '');
  } else if (content.includes(anchorLF)) {
    content = content.replace(anchorLF + '\n', '');
  } else {
    throw new Error('Entity Advisor subnav anchor not found');
  }

  // 3. Remove mount
  const mount = `      {/* =========================================================================
          INTERACTIVE STATUTORY SCOPE & ENTITY ADVISOR
          ========================================================================= */}
      <StatutoryEntityAdvisor />`;
  const mountNormalized = mount.replace(/\r?\n/g, '\r\n');
  const mountLF = mount.replace(/\r?\n/g, '\n');
  if (content.includes(mountNormalized)) {
    content = content.replace(mountNormalized + '\r\n', '');
  } else if (content.includes(mountLF)) {
    content = content.replace(mountLF + '\n', '');
  } else {
    throw new Error('StatutoryEntityAdvisor mount not found');
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✔ ServicesPage.tsx cleaned successfully');
}
