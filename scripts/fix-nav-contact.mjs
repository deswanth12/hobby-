import fs from 'fs';

let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Replace the two occurrences
content = content.replace(
  /(\r?\n\s+)(to="\/contact"[\r\n\s]+className=\{`py-2)/,
  '$1<Link\n            $2'
);

content = content.replace(
  /(\r?\n\s+)(to="\/contact"[\r\n\s]+onClick=\{)/,
  '$1<Link\n                  $2'
);

fs.writeFileSync('src/components/Navbar.tsx', content, 'utf8');
console.log('Restored <Link tags for /contact');
