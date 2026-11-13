import fs from 'fs';

let lines = fs.readFileSync('src/components/Navbar.tsx', 'utf8').split(/\r?\n/);
let filtered = [];
let skipping = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('to="/knowledge-bank"')) {
    // If previous line was a comment about Knowledge Bank, remove it from filtered
    if (filtered.length > 0 && filtered[filtered.length - 1].includes('Knowledge Bank')) {
      filtered.pop();
    }
    // Skip until </Link>
    while (i < lines.length && !lines[i].includes('</Link>')) {
      i++;
    }
    continue;
  }
  filtered.push(line);
}

fs.writeFileSync('src/components/Navbar.tsx', filtered.join('\r\n'), 'utf8');

const after = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
console.log('After removal, has KB link:', after.includes('to="/knowledge-bank"'));
