import fs from 'fs';

// 1. App.tsx: Add skip-to-content link and id="main-content"
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
const oldPublicLayout = `<main className="flex-grow">
        <Outlet />
      </main>`;
const newPublicLayout = `<a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-5 focus:py-2.5 focus:bg-brand-chambers focus:text-brand-tintedwhite focus:border focus:border-brand-gold focus:rounded-full focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-brand-gold text-xs font-semibold tracking-wide transition-all"
      >
        Skip to main content
      </a>
      <ScrollProgress />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-grow outline-none">
        <Outlet />
      </main>`;

if (appContent.includes('<main className="flex-grow">')) {
  appContent = appContent.replace(
    '<ScrollProgress />\n      <Navbar />\n      <main className="flex-grow">',
    newPublicLayout
  );
  // Also handle CRLF
  if (!appContent.includes('id="main-content"')) {
    appContent = appContent.replace(
      '<ScrollProgress />\r\n      <Navbar />\r\n      <main className="flex-grow">',
      newPublicLayout.replace(/\n/g, '\r\n')
    );
  }
  fs.writeFileSync('src/App.tsx', appContent, 'utf8');
  console.log('1. Updated App.tsx with keyboard-accessible skip-to-content link.');
} else {
  console.log('App.tsx already has skip-to-content or pattern not matched.');
}

// 2. Navbar.tsx: Add subtle gold active-route indicator in mobile navigation drawer
let navContent = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Function to generate the gold-accented mobile link class and inner template
// We will replace each mobile nav Link inside drawer with gold active indicator
const mobileLinks = [
  { name: 'Home', path: '/', condition: "location.pathname === '/'" },
  { name: 'About Firm', path: '/about', condition: "isActive('/about')" },
  { name: 'Audit Spotlight', path: '/services/audit-assurance', condition: "location.pathname === '/services/audit-assurance'" },
  { name: 'Industries We Serve', path: '/industries', condition: "isActive('/industries')" },
  { name: 'Service Reach', path: '/locations', condition: "isActive('/locations')" },
  { name: 'Publications & Articles', path: '/blog', condition: "isActive('/blog')" },
  { name: 'Contact Chambers', path: '/contact', condition: "isActive('/contact')" }
];

// Let's check how mobile nav links are currently written in Navbar.tsx
for (const item of mobileLinks) {
  // Regex to match the Link block for this item
  const regex = new RegExp(
    `<Link[\\s\\S]*?to="${item.path.replace('/', '\\/')}"[\\s\\S]*?>[\\s\\S]*?${item.name.replace('&', '&amp;')}[\\s\\S]*?<\\/Link>`,
    'm'
  );
  // Let's inspect Navbar.tsx to ensure exact replacement
}

console.log('Script initialized.');
