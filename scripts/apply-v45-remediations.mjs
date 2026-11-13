import fs from 'fs';
import path from 'path';

console.log('=== Applying V4.5 Scope Compliance & Remediation Changes ===\n');

// Helper to do exact replacement and verify
function replaceInFile(filePath, searchStr, replaceStr, desc) {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  if (!content.includes(searchStr)) {
    throw new Error(`Target string not found in ${filePath} for: ${desc}\nTarget: ${JSON.stringify(searchStr)}`);
  }
  content = content.replace(searchStr, replaceStr);
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✔ [${filePath}] ${desc}`);
}

// 1. src/components/Navbar.tsx
// Remove Tax Calculators & Knowledge Bank link from serviceSublinks
{
  const filePath = 'src/components/Navbar.tsx';
  let content = fs.readFileSync(filePath, 'utf8');
  const target = "    { label: 'Tax Calculators & Knowledge Bank', path: '/knowledge-bank' },";
  if (!content.includes(target)) {
    throw new Error(`Target not found in ${filePath}`);
  }
  // Remove line with preceding/following newline
  content = content.replace(/^[ \t]*\{ label: 'Tax Calculators & Knowledge Bank', path: '\/knowledge-bank' \},(\r?\n)?/m, '');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✔ [${filePath}] Removed Tax Calculators & Knowledge Bank navigation link`);
}

// 2. src/components/Footer.tsx
// Remove Knowledge Bank link and Statutory FAQ anchor
{
  const filePath = 'src/components/Footer.tsx';
  let content = fs.readFileSync(filePath, 'utf8');
  
  const linkKB = '<Link to="/knowledge-bank" className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors">Knowledge Bank & Calculators</Link>';
  const linkFAQ = '<a href="/#knowledge-faq" className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors">Statutory FAQ</a>';
  
  if (!content.includes(linkKB) || !content.includes(linkFAQ)) {
    throw new Error(`Target links not found in ${filePath}`);
  }

  // Remove lines cleanly
  content = content.replace(/^[ \t]*<Link to="\/knowledge-bank"[^>]*>Knowledge Bank & Calculators<\/Link>(\r?\n)?/m, '');
  content = content.replace(/^[ \t]*<a href="\/#knowledge-faq"[^>]*>Statutory FAQ<\/a>(\r?\n)?/m, '');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✔ [${filePath}] Removed Knowledge Bank link & Statutory FAQ anchor`);
}

// 3. src/pages/HomePage.tsx
// Remove KnowledgeFAQ import, active section id, jump button, and Section 9 component mount
{
  const filePath = 'src/pages/HomePage.tsx';
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove import
  const importTarget = "import { KnowledgeFAQ } from '../components/KnowledgeFAQ';";
  if (!content.includes(importTarget)) {
    throw new Error(`Import not found in ${filePath}`);
  }
  content = content.replace(/^[ \t]*import \{ KnowledgeFAQ \} from '\.\.\/components\/KnowledgeFAQ';(\r?\n)?/m, '');

  // Remove 'knowledge-faq', from sectionIds
  const sectionIdTarget = "'knowledge-faq',";
  if (!content.includes(sectionIdTarget)) {
    throw new Error(`Section ID not found in ${filePath}`);
  }
  content = content.replace(/^[ \t]*'knowledge-faq',(\r?\n)?/m, '');

  // Remove subnav link for Statutory FAQ
  const buttonRegex = /<a\s+href="#knowledge-faq"[\s\S]*?<\/a>(\r?\n)?/;
  if (!buttonRegex.test(content)) {
    throw new Error(`Statutory FAQ anchor button not found in ${filePath}`);
  }
  content = content.replace(buttonRegex, '');

  // Remove Section 9 mount:
  const section9Regex = /\{\/\* =+[\s\S]*?SECTION 9: STATUTORY KNOWLEDGE & ADVISORY FAQ[\s\S]*?<\/div>(\r?\n)?/;
  if (!section9Regex.test(content)) {
    throw new Error(`Section 9 KnowledgeFAQ mount not found in ${filePath}`);
  }
  content = content.replace(section9Regex, '');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✔ [${filePath}] Removed KnowledgeFAQ import, sectionId, subnav button, and Section 9 mount`);
}

// 4. src/pages/ServicesPage.tsx
// Remove StatutoryEntityAdvisor import, subnav anchor, and component mount
{
  const filePath = 'src/pages/ServicesPage.tsx';
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove import
  const importTarget = "import { StatutoryEntityAdvisor } from '../components/StatutoryEntityAdvisor';";
  if (!content.includes(importTarget)) {
    throw new Error(`Import not found in ${filePath}`);
  }
  content = content.replace(/^[ \t]*import \{ StatutoryEntityAdvisor \} from '\.\.\/components\/StatutoryEntityAdvisor';(\r?\n)?/m, '');

  // Remove subnav anchor for Entity Advisor
  const anchorRegex = /<a\s+href="#statutory-advisor"[\s\S]*?<\/a>(\r?\n)?/;
  if (!anchorRegex.test(content)) {
    throw new Error(`Statutory advisor anchor not found in ${filePath}`);
  }
  content = content.replace(anchorRegex, '');

  // Remove StatutoryEntityAdvisor mount block
  const advisorMountRegex = /\{\/\* =+[\s\S]*?INTERACTIVE STATUTORY SCOPE & ENTITY ADVISOR[\s\S]*?<\/div>(\r?\n)?/;
  if (!advisorMountRegex.test(content)) {
    throw new Error(`StatutoryEntityAdvisor mount block not found in ${filePath}`);
  }
  content = content.replace(advisorMountRegex, '');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✔ [${filePath}] Removed StatutoryEntityAdvisor import, subnav anchor, and section mount`);
}

// 5. scripts/generate-sitemap.mjs
// Remove /knowledge-bank from STATIC_ROUTES
{
  const filePath = 'scripts/generate-sitemap.mjs';
  let content = fs.readFileSync(filePath, 'utf8');
  const target = "{ path: '/knowledge-bank', priority: '0.8', changefreq: 'monthly' },";
  if (!content.includes(target)) {
    throw new Error(`Target not found in ${filePath}`);
  }
  content = content.replace(/^[ \t]*\{ path: '\/knowledge-bank', priority: '0\.8', changefreq: 'monthly' \},(\r?\n)?/m, '');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✔ [${filePath}] Removed /knowledge-bank from STATIC_ROUTES`);
}

// 6. public/llms.txt
// Remove /knowledge-bank listing
{
  const filePath = 'public/llms.txt';
  let content = fs.readFileSync(filePath, 'utf8');
  const targetRegex = /^[ \t]*- \[Tax Calculators & Knowledge Bank\]\(https:\/\/kavithaassociates\.com\/knowledge-bank\)[\s\S]*?portal directory\.(\r?\n)?/m;
  if (!targetRegex.test(content)) {
    throw new Error(`Target entry not found in ${filePath}`);
  }
  content = content.replace(targetRegex, '');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✔ [${filePath}] Removed /knowledge-bank entry from llms.txt`);
}

// 7. public/llms-full.txt
// Remove /knowledge-bank entry and renumber 14-17 -> 13-16
{
  const filePath = 'public/llms-full.txt';
  let content = fs.readFileSync(filePath, 'utf8');
  const target = '13. **Knowledge Bank & Tax Calculators**: https://kavithaassociates.com/knowledge-bank';
  if (!content.includes(target)) {
    throw new Error(`Target entry not found in ${filePath}`);
  }
  content = content.replace(/13\. \*\*Knowledge Bank & Tax Calculators\*\*: https:\/\/kavithaassociates\.com\/knowledge-bank\r?\n/, '');
  content = content.replace('14. **Regulatory Commentary & Articles**', '13. **Regulatory Commentary & Articles**');
  content = content.replace('15. **Article: Corporate Tax Planning 2026**', '14. **Article: Corporate Tax Planning 2026**');
  content = content.replace('16. **Article: GST Annual Return Compliance**', '15. **Article: GST Annual Return Compliance**');
  content = content.replace('17. **Article: Statutory Audit Guidelines 2026**', '16. **Article: Statutory Audit Guidelines 2026**');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✔ [${filePath}] Removed /knowledge-bank and renumbered items in llms-full.txt`);
}

// 8. Misleading Guarantees
// 8a. AboutPage.tsx
replaceInFile(
  'src/pages/AboutPage.tsx',
  '<td className="py-2.5 px-4">Complete Legal Immunity &amp; Clean Audit Reports</td>',
  '<td className="py-2.5 px-4">Statutory Assurance Compliance &amp; Objective True and Fair Reporting</td>',
  'Expunged "Complete Legal Immunity & Clean Audit Reports" guarantee'
);

// 8b. CompanyRegistrationPage.tsx
replaceInFile(
  'src/pages/CompanyRegistrationPage.tsx',
  'Guaranteed ROC Compliance',
  'Diligent Annual ROC Secretarial Compliance',
  'Expunged "Guaranteed ROC Compliance" guarantee'
);

// 8c. GSTServicesPage.tsx
replaceInFile(
  'src/pages/GSTServicesPage.tsx',
  'Zero Late Fee Guarantee',
  'Scheduled GST Compliance & Penalty Mitigation',
  'Expunged "Zero Late Fee Guarantee" guarantee'
);

// 9. Confirmed Data Issues
// 9a. AdminSettingsPage.tsx - Secondary Phone Placeholder
replaceInFile(
  'src/pages/admin/AdminSettingsPage.tsx',
  'placeholder="+91 94443 89800"',
  'placeholder="+91 95421 53906"',
  'Corrected secondary phone placeholder to +91 95421 53906'
);

// 9b. WorkingProcess.tsx - Misleading Alt Text
replaceInFile(
  'src/components/WorkingProcess.tsx',
  "imageAlt: 'Continuous business advisory and dedicated Chartered Accountant team',",
  "imageAlt: 'Continuous business advisory and dedicated professional audit team',",
  'Corrected misleading image alt text in WorkingProcess.tsx'
);

// 9c. AboutPage.tsx - Replace [REDACTED_MEMBERSHIP_NO]
replaceInFile(
  'src/pages/AboutPage.tsx',
  '<span>ICAI Mem. [REDACTED_MEMBERSHIP_NO]</span>',
  '<span>Chartered Accountant (ICAI Member)</span>',
  'Replaced [REDACTED_MEMBERSHIP_NO] on AboutPage.tsx'
);

// 9d. AuditAssurancePage.tsx - Replace [REDACTED_MEMBERSHIP_NO] (2 occurrences)
{
  const filePath = 'src/pages/AuditAssurancePage.tsx';
  let content = fs.readFileSync(filePath, 'utf8');
  const target1 = 'Supervised and signed by CA Kavitha Vijay (B.Com, CA, CMA AIR 49, ICAI Mem. [REDACTED_MEMBERSHIP_NO]) with mandatory UDIN generation.';
  const rep1 = 'Supervised and signed by CA Kavitha Vijay (B.Com, CA, CMA AIR 49, Chartered Accountant (ICAI Member)) with mandatory UDIN generation.';
  const target2 = 'Supervised & Signed by CA Kavitha Vijay (B.Com, CA, CMA AIR 49, ICAI Mem. [REDACTED_MEMBERSHIP_NO])';
  const rep2 = 'Supervised & Signed by CA Kavitha Vijay (B.Com, CA, CMA AIR 49, Chartered Accountant (ICAI Member))';
  
  if (!content.includes(target1) || !content.includes(target2)) {
    throw new Error(`Targets not found in ${filePath}`);
  }
  content = content.replace(target1, rep1);
  content = content.replace(target2, rep2);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✔ [${filePath}] Replaced [REDACTED_MEMBERSHIP_NO] in 2 locations`);
}

// 9e. LocationsPage.tsx - Replace [REDACTED_MEMBERSHIP_NO]
replaceInFile(
  'src/pages/LocationsPage.tsx',
  '(B.Com, CA, CMA AIR 49, ICAI Mem. [REDACTED_MEMBERSHIP_NO])',
  '(B.Com, CA, CMA AIR 49, Chartered Accountant (ICAI Member))',
  'Replaced [REDACTED_MEMBERSHIP_NO] on LocationsPage.tsx'
);

console.log('\n=== All V4.5 Scope Compliance & Remediation Changes Applied Successfully ===');
