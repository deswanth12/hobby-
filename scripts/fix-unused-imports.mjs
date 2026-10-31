import fs from 'node:fs';

function cleanImports(file, unusedList, unusedFullLines = []) {
  let content = fs.readFileSync(file, 'utf8');
  for (const item of unusedList) {
    const regex = new RegExp(`\\s*${item},?`, 'g');
    content = content.replace(regex, '');
  }
  for (const line of unusedFullLines) {
    content = content.replace(line, '');
  }
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Cleaned imports for ${file}`);
}

cleanImports('src/pages/CompanyRegistrationPage.tsx', ['ShieldCheck', 'Clock', 'Briefcase']);
cleanImports('src/pages/GSTServicesPage.tsx', ['ShieldCheck', 'FileText', 'AlertCircle', 'Layers'], ["import { DualArrowButton } from '../components/animations/DualArrowButton';"]);
cleanImports('src/pages/IncomeTaxPage.tsx', ['ShieldCheck', 'Calculator', 'Clock']);
cleanImports('src/pages/RERAConsultantPage.tsx', ['FileCheck', 'ShieldCheck', 'Clock']);
cleanImports('src/pages/VirtualCFOPage.tsx', ['Scale', 'ShieldCheck', 'TrendingUp', 'Clock', 'Layers']);
