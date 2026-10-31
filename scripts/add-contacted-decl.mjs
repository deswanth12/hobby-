import fs from 'fs';

const file = 'C:/kavitha ca/src/pages/admin/AdminOverviewPage.tsx';
let raw = fs.readFileSync(file, 'utf8');
const isCrlf = raw.includes('\r\n');
let code = raw.replace(/\r\n/g, '\n');

code = code.replace(
  "const inReviewEnquiries = enquiries.filter(e => e.status === 'in-progress' || e.status === 'in-review').length;",
  "const inReviewEnquiries = enquiries.filter(e => e.status === 'in-progress' || e.status === 'in-review').length;\n  const contactedEnquiries = enquiries.filter(e => e.status === 'contacted').length;"
);

fs.writeFileSync(file, isCrlf ? code.replace(/\n/g, '\r\n') : code, 'utf8');
console.log('Added contactedEnquiries declaration.');
