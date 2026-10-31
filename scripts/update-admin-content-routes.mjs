import fs from 'fs';

const file = 'C:/kavitha ca/src/pages/admin/AdminContentPage.tsx';
let raw = fs.readFileSync(file, 'utf8');
const isCrlf = raw.includes('\r\n');
let code = raw.replace(/\r\n/g, '\n');

code = code.replace(/canonicalUrl: `https:\/\/kavithaassociates\.com\/insights\/\${cleanSlug}`/g, 'canonicalUrl: `https://kavithaassociates.com/blog/${cleanSlug}`');
code = code.replace(/href=\{activeTab === 'posts' \? '\/insights' : '\/services'\}/g, "href={activeTab === 'posts' ? '/blog' : '/services'}");
code = code.replace(/Route: \/insights\/\{postSlug \|\| '\.\.\.'\}/g, "Route: /blog/{postSlug || '...'}");
code = code.replace(/href=\{`\/insights\/\$\{postSlug\}`\}/g, "href={`/blog/${postSlug}`}");

fs.writeFileSync(file, isCrlf ? code.replace(/\n/g, '\r\n') : code, 'utf8');
console.log('AdminContentPage.tsx updated /insights to /blog.');
