import fs from 'node:fs';

const filePath = 'src/pages/HomePage.tsx';
let code = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

const target = `            openingHoursSpecification: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
              opens: '09:30',
              closes: '18:30'
            },`;

const replacement = `            openingHoursSpecification: [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '09:30',
                closes: '18:30'
              },
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Saturday'],
                opens: '10:00',
                closes: '14:00'
              }
            ],`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync(filePath, code.replace(/\n/g, '\r\n'), 'utf8');
  console.log('HomePage.tsx openingHoursSpecification aligned with contact.json');
} else {
  console.log('Target not found in HomePage.tsx');
}
