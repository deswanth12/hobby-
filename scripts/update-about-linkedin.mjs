import fs from 'fs';

const file = 'C:/kavitha ca/src/pages/AboutPage.tsx';
let raw = fs.readFileSync(file, 'utf8');
const isCrlf = raw.includes('\r\n');
let code = raw.replace(/\r\n/g, '\n');

// Add Linkedin import
if (!code.includes('Linkedin,') && code.includes('Languages,')) {
  code = code.replace('Languages,', 'Languages,\n  Linkedin,');
}

// Add LinkedIn link in badges
const target = `<span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/30 border border-white/10 text-xs text-emerald-200">
                      <Globe2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>International Exposure</span>
                    </span>`;

const replacement = `<span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/30 border border-white/10 text-xs text-emerald-200">
                      <Globe2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>International Exposure</span>
                    </span>
                    {partner.linkedinUrl && (
                      <a 
                        href={partner.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0077b5]/20 border border-[#0077b5]/40 text-xs font-semibold text-sky-200 hover:text-white hover:bg-[#0077b5]/30 transition-colors"
                      >
                        <Linkedin className="w-3.5 h-3.5 text-[#00a0dc] shrink-0" />
                        <span>LinkedIn Profile</span>
                      </a>
                    )}`;

if (!code.includes('partner.linkedinUrl') && code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync(file, isCrlf ? code.replace(/\n/g, '\r\n') : code, 'utf8');
  console.log('AboutPage.tsx updated with LinkedIn link.');
} else {
  console.log('Target still not found.');
}
