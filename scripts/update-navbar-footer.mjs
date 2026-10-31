import fs from 'node:fs';

function updateFile(filePath, updater) {
  let content = fs.readFileSync(filePath, 'utf8');
  const isCrlf = content.includes('\r\n');
  let normalized = content.replace(/\r\n/g, '\n');
  
  normalized = updater(normalized);
  
  if (isCrlf) {
    normalized = normalized.replace(/\n/g, '\r\n');
  }
  fs.writeFileSync(filePath, normalized, 'utf8');
}

// 1. Update Navbar.tsx
updateFile('src/components/Navbar.tsx', (code) => {
  const target = `  const serviceSublinks = [
    { label: 'All Services Overview', path: '/services' },
    { label: 'Audit & Assurance (Spotlight)', path: '/services/audit-assurance' },
    { label: 'Income Tax Services', path: '/services#income-tax' },
    { label: 'GST Services', path: '/services#gst' },
    { label: 'Corporate & ROC Compliance', path: '/services#corporate-business' },
    { label: 'RERA Compliance', path: '/services#rera-compliance' },
    { label: 'Advisory & Consulting', path: '/services#advisory-consulting' },
  ];`;

  const replacement = `  const serviceSublinks = [
    { label: 'All Services Overview', path: '/services' },
    { label: 'Audit & Assurance (9 Streams)', path: '/services/audit-assurance' },
    { label: 'GST Consultant & Filings', path: '/services/gst-consultant-tirupati' },
    { label: 'Income Tax Consultant & ITR', path: '/services/income-tax-consultant-tirupati' },
    { label: 'Company & Business Registration', path: '/services/company-registration-tirupati' },
    { label: 'Virtual CFO & CMA Services', path: '/services/virtual-cfo-tirupati' },
    { label: 'RERA Advisory & Real Estate', path: '/services/rera-consultant-tirupati' },
  ];`;

  if (code.includes(target)) {
    console.log('Replacing Navbar.tsx serviceSublinks');
    return code.replace(target, replacement);
  } else {
    console.log('Navbar.tsx target not matched');
    return code;
  }
});

// 2. Update Footer.tsx
updateFile('src/components/Footer.tsx', (code) => {
  const target = `<ul className="space-y-2.5 text-xs font-sans">
              <li>
                <Link
                  to="/services"
                  className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors duration-200 flex items-center gap-2 text-emerald-100 font-medium hover:translate-x-1 transform pb-1 mb-1 border-b border-brand-forest/40"
                >
                  <span className="text-brand-gold font-bold">→</span> All Practice Areas Overview
                </Link>
              </li>
              <li>
                <Link
                  to="/services/audit-assurance"
                  className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors duration-200 flex items-center gap-2 text-emerald-100/90 hover:translate-x-1 transform"
                >
                  <span className="text-brand-gold">•</span> Audit & Assurance (Spotlight)
                </Link>
              </li>
              <li>
                <Link
                  to="/services#income-tax"
                  className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors duration-200 flex items-center gap-2 text-emerald-100/90 hover:translate-x-1 transform"
                >
                  <span className="text-brand-gold">•</span> Income Tax Filing & Advisory
                </Link>
              </li>
              <li>
                <Link
                  to="/services#gst"
                  className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors duration-200 flex items-center gap-2 text-emerald-100/90 hover:translate-x-1 transform"
                >
                  <span className="text-brand-gold">•</span> GST Compliance & Representation
                </Link>
              </li>
              <li>
                <Link
                  to="/services#corporate-business"
                  className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors duration-200 flex items-center gap-2 text-emerald-100/90 hover:translate-x-1 transform"
                >
                  <span className="text-brand-gold">•</span> ROC & Corporate Secretarial
                </Link>
              </li>
              <li>
                <Link
                  to="/services#rera-compliance"
                  className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors duration-200 flex items-center gap-2 text-emerald-100/90 hover:translate-x-1 transform"
                >
                  <span className="text-brand-gold">•</span> RERA Certification & Compliance
                </Link>
              </li>
              <li>
                <Link
                  to="/services#advisory-consulting"
                  className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors duration-200 flex items-center gap-2 text-emerald-100/90 hover:translate-x-1 transform"
                >
                  <span className="text-brand-gold">•</span> Strategic Financial Advisory
                </Link>
              </li>
            </ul>`;

  const replacement = `<ul className="space-y-2.5 text-xs font-sans">
              <li>
                <Link
                  to="/services"
                  className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors duration-200 flex items-center gap-2 text-emerald-100 font-medium hover:translate-x-1 transform pb-1 mb-1 border-b border-brand-forest/40"
                >
                  <span className="text-brand-gold font-bold">→</span> All Practice Areas Overview
                </Link>
              </li>
              <li>
                <Link
                  to="/services/audit-assurance"
                  className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors duration-200 flex items-center gap-2 text-emerald-100/90 hover:translate-x-1 transform"
                >
                  <span className="text-brand-gold">•</span> Audit & Assurance (9 Streams)
                </Link>
              </li>
              <li>
                <Link
                  to="/services/income-tax-consultant-tirupati"
                  className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors duration-200 flex items-center gap-2 text-emerald-100/90 hover:translate-x-1 transform"
                >
                  <span className="text-brand-gold">•</span> Income Tax Consultant & ITR
                </Link>
              </li>
              <li>
                <Link
                  to="/services/gst-consultant-tirupati"
                  className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors duration-200 flex items-center gap-2 text-emerald-100/90 hover:translate-x-1 transform"
                >
                  <span className="text-brand-gold">•</span> GST Consultant & Filings
                </Link>
              </li>
              <li>
                <Link
                  to="/services/company-registration-tirupati"
                  className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors duration-200 flex items-center gap-2 text-emerald-100/90 hover:translate-x-1 transform"
                >
                  <span className="text-brand-gold">•</span> Company & Business Registration
                </Link>
              </li>
              <li>
                <Link
                  to="/services/virtual-cfo-tirupati"
                  className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors duration-200 flex items-center gap-2 text-emerald-100/90 hover:translate-x-1 transform"
                >
                  <span className="text-brand-gold">•</span> Virtual CFO & CMA Services
                </Link>
              </li>
              <li>
                <Link
                  to="/services/rera-consultant-tirupati"
                  className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-gold transition-colors duration-200 flex items-center gap-2 text-emerald-100/90 hover:translate-x-1 transform"
                >
                  <span className="text-brand-gold">•</span> RERA Advisory & Real Estate
                </Link>
              </li>
            </ul>`;

  if (code.includes(target)) {
    console.log('Replacing Footer.tsx links');
    return code.replace(target, replacement);
  } else {
    console.log('Footer.tsx target not matched');
    return code;
  }
});
