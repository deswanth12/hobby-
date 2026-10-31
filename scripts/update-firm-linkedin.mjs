import fs from 'fs';
import path from 'path';

const file = 'C:/kavitha ca/src/data/firmData.ts';
let code = fs.readFileSync(file, 'utf8');

// Update FirmProfile interface
if (!code.includes('linkedinUrl?: string;') && code.includes('awards: {')) {
  code = code.replace('awards: {', 'linkedinUrl?: string;\n    awards: {');
}
if (!code.includes('linkedinUrl?: string;') && code.includes('whatsappLink: string;')) {
  code = code.replace('whatsappLink: string;', 'whatsappLink: string;\n    linkedinUrl?: string;');
}

// Update FIRM_DATA partner object
if (!code.includes('https://www.linkedin.com/in/ca-kavitha-srj-770988199')) {
  code = code.replace(
    'tagline: "MNC Auditor with Big 4 Experience of 10+ Years",',
    'tagline: "MNC Auditor with Big 4 Experience of 10+ Years",\n    linkedinUrl: "https://www.linkedin.com/in/ca-kavitha-srj-770988199",'
  );
  code = code.replace(
    'whatsappNumber: "+91 96263 50900",',
    'whatsappNumber: "+91 96263 50900",\n    linkedinUrl: "https://www.linkedin.com/in/ca-kavitha-srj-770988199",'
  );
}

fs.writeFileSync(file, code, 'utf8');
console.log('firmData.ts updated with LinkedIn profile.');
