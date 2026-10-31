import fs from 'node:fs';

const filePath = 'src/pages/ServicesPage.tsx';
let code = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

// 1. Add dedicatedPracticeMap above component
const helperMap = `const DEDICATED_PRACTICE_PAGES: Record<string, { path: string; label: string }> = {
  'income-tax': { path: '/services/income-tax-consultant-tirupati', label: 'Explore Dedicated Income Tax Practice' },
  'gst': { path: '/services/gst-consultant-tirupati', label: 'Explore Dedicated GST Practice' },
  'corporate-business': { path: '/services/company-registration-tirupati', label: 'Explore Company Registration Practice' },
  'rera-compliance': { path: '/services/rera-consultant-tirupati', label: 'Explore Dedicated RERA Advisory' },
  'advisory-consulting': { path: '/services/virtual-cfo-tirupati', label: 'Explore Virtual CFO Practice' },
};
`;

if (!code.includes('DEDICATED_PRACTICE_PAGES')) {
  code = code.replace('export const ServicesPage: React.FC = () => {', `${helperMap}\nexport const ServicesPage: React.FC = () => {`);
}

// 2. Add the dedicated practice link button right above the Inquire button in discipline overview
const targetButtonBlock = `                  <div className="pt-4 flex flex-wrap items-center gap-3.5 border-t border-brand-border">
                    <Link
                      to="/contact"`;

const newButtonBlock = `                  <div className="pt-4 flex flex-wrap items-center gap-3.5 border-t border-brand-border">
                    {DEDICATED_PRACTICE_PAGES[category.id] && (
                      <Link
                        to={DEDICATED_PRACTICE_PAGES[category.id].path}
                        className="min-h-[44px] w-full sm:w-auto text-center justify-center inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-surface text-brand-forest font-editorial-meta text-xs hover:bg-brand-pale hover:border-brand-gold transition-colors btn-tactile border border-brand-border shadow-xs"
                      >
                        <span>{DEDICATED_PRACTICE_PAGES[category.id].label}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      </Link>
                    )}
                    <Link
                      to="/contact"`;

if (code.includes(targetButtonBlock)) {
  code = code.replace(targetButtonBlock, newButtonBlock);
  console.log('ServicesPage.tsx action buttons updated');
} else {
  console.log('ServicesPage.tsx targetButtonBlock not matched');
}

fs.writeFileSync(filePath, code.replace(/\n/g, '\r\n'), 'utf8');
