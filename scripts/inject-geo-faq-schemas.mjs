import fs from 'node:fs';

const pages = [
  {
    file: 'src/pages/GSTServicesPage.tsx',
    faqVar: 'gstFaqs'
  },
  {
    file: 'src/pages/IncomeTaxPage.tsx',
    faqVar: 'taxFaqs'
  },
  {
    file: 'src/pages/CompanyRegistrationPage.tsx',
    faqVar: 'corpFaqs'
  },
  {
    file: 'src/pages/VirtualCFOPage.tsx',
    faqVar: 'cfoFaqs'
  },
  {
    file: 'src/pages/RERAConsultantPage.tsx',
    faqVar: 'reraFaqs'
  }
];

for (const { file, faqVar } of pages) {
  let content = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');

  if (content.includes(`mainEntity: ${faqVar}.map`)) {
    console.log(`${file} already has FAQPage schema`);
    continue;
  }

  // Find jsonLd={{ ... }}
  const jsonLdStart = content.indexOf('jsonLd={{');
  if (jsonLdStart === -1) {
    console.log(`Could not find jsonLd in ${file}`);
    continue;
  }

  const jsonLdEnd = content.indexOf('}}', jsonLdStart);
  if (jsonLdEnd === -1) {
    console.log(`Could not find end of jsonLd in ${file}`);
    continue;
  }

  const serviceBlock = content.slice(jsonLdStart + 8, jsonLdEnd + 1); // { ... }
  
  const replacement = `jsonLd={[
          ${serviceBlock},
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: ${faqVar}.map(f => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: f.a
              }
            }))
          }
        ]}`;

  content = content.slice(0, jsonLdStart) + replacement + content.slice(jsonLdEnd + 2);
  fs.writeFileSync(file, content.replace(/\n/g, '\r\n'), 'utf8');
  console.log(`Successfully injected FAQPage schema into ${file}`);
}
