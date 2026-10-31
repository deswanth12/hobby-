import fs from 'node:fs';

function replaceInFile(file, searchStr, replaceStr) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes(searchStr)) {
    content = content.replace(searchStr, replaceStr);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`String not found in ${file}`);
  }
}

replaceInFile(
  'src/pages/GSTServicesPage.tsx',
  'title="GST Consultant in Tirupati | GST Registration & Filing Services"',
  'title="GST Consultant in Tirupati | GST Filing | Kavitha & Associates"'
);

replaceInFile(
  'src/pages/IncomeTaxPage.tsx',
  'title="Income Tax Consultant in Tirupati | ITR Filing & Tax Planning"',
  'title="Income Tax Consultant in Tirupati | ITR | Kavitha & Associates"'
);

replaceInFile(
  'src/pages/CompanyRegistrationPage.tsx',
  'title="Company Registration in Tirupati | Business & ROC Consultant"',
  'title="Company Registration in Tirupati | ROC | Kavitha & Associates"'
);

replaceInFile(
  'src/pages/VirtualCFOPage.tsx',
  'title="Virtual CFO Services in Tirupati | CMA & Accounting Advisory"',
  'title="Virtual CFO Services in Tirupati | CMA | Kavitha & Associates"'
);
