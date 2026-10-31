import fs from 'fs';
import path from 'path';

const homePagePath = path.resolve('C:/kavitha ca/src/pages/HomePage.tsx');
let content = fs.readFileSync(homePagePath, 'utf8');

// 1. Remove Award from import
content = content.replace(/\s+Award,?\r?\n/, '\n');

// 2. Remove activeChamberPhoto state
content = content.replace(/\s+const \[activeChamberPhoto, setActiveChamberPhoto\] = useState<'consultation' \| 'library'>\('consultation'\);\r?\n/, '\n');

// 3. Remove photo card block
const targetStart = '{/* Authentic Chambers Photo Card with Floating Gold Accreditation Badges */}';
const targetEnd = '{/* Executive Practice Registry Plaque (Double-Bezel Architecture) */}';

if (content.includes(targetStart) && content.includes(targetEnd)) {
  const startIndex = content.indexOf(targetStart);
  const endIndex = content.indexOf(targetEnd);

  const before = content.substring(0, startIndex);
  const after = content.substring(endIndex);

  content = before + after;

  // Clean up right column wrapper
  content = content.replace(
    '<div className="lg:col-span-5 space-y-5 scroll-reveal-right">',
    '<div className="lg:col-span-5 scroll-reveal-right">'
  );

  content = content.replace(
    '{/* Right 5 Columns: Authentic Chambers Photo Card & Executive Registry Plaque */}',
    '{/* Right 5 Columns: Executive Practice Registry Plaque */}'
  );

  fs.writeFileSync(homePagePath, content, 'utf8');
  console.log('SUCCESS: Photo card removed successfully from HomePage.tsx');
} else {
  console.error('ERROR: Could not find target markers in HomePage.tsx');
  process.exit(1);
}
