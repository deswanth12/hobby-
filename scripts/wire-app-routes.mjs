import fs from 'node:fs';

const filePath = 'src/App.tsx';
let code = fs.readFileSync(filePath, 'utf8');

const importTarget = "import { AuditAssurancePage } from './pages/AuditAssurancePage';";
const newImports = `import { AuditAssurancePage } from './pages/AuditAssurancePage';
import { GSTServicesPage } from './pages/GSTServicesPage';
import { IncomeTaxPage } from './pages/IncomeTaxPage';
import { CompanyRegistrationPage } from './pages/CompanyRegistrationPage';
import { VirtualCFOPage } from './pages/VirtualCFOPage';
import { RERAConsultantPage } from './pages/RERAConsultantPage';`;

if (code.includes(importTarget) && !code.includes('GSTServicesPage')) {
  code = code.replace(importTarget, newImports);
}

const routeTarget = '<Route path="/services/audit-assurance" element={<AuditAssurancePage />} />';
const newRoutes = `<Route path="/services/audit-assurance" element={<AuditAssurancePage />} />
              <Route path="/services/gst-consultant-tirupati" element={<GSTServicesPage />} />
              <Route path="/services/income-tax-consultant-tirupati" element={<IncomeTaxPage />} />
              <Route path="/services/company-registration-tirupati" element={<CompanyRegistrationPage />} />
              <Route path="/services/virtual-cfo-tirupati" element={<VirtualCFOPage />} />
              <Route path="/services/rera-consultant-tirupati" element={<RERAConsultantPage />} />`;

if (code.includes(routeTarget) && !code.includes('/services/gst-consultant-tirupati')) {
  code = code.replace(routeTarget, newRoutes);
}

fs.writeFileSync(filePath, code, 'utf8');
console.log('App.tsx updated successfully');
