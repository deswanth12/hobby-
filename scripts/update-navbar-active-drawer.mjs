import fs from 'fs';

let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Target the Navigation Links block inside the mobile drawer
const oldBlock = `              {/* Navigation Links */}
              <div className="space-y-1">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className={\`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center \${
                    location.pathname === '/'
                      ? 'bg-brand-pale text-brand-forest font-semibold'
                      : 'text-brand-charcoal hover:bg-brand-white'
                  }\`}
                >
                  Home
                </Link>

                <Link
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className={\`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center \${
                    isActive('/about')
                      ? 'bg-brand-pale text-brand-forest font-semibold'
                      : 'text-brand-charcoal hover:bg-brand-white'
                  }\`}
                >
                  About Firm
                </Link>

                {/* Mobile Services Accordion */}
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium text-brand-charcoal hover:bg-brand-white min-h-[44px]"
                    aria-expanded={mobileServicesOpen}
                  >
                    <span>Services</span>
                    <ChevronDown className={\`w-4 h-4 transition-transform \${mobileServicesOpen ? 'rotate-180 text-brand-forest' : ''}\`} />
                  </button>

                  {mobileServicesOpen && (
                    <div className="pl-3 pr-2 py-1 space-y-1 bg-brand-white rounded-lg my-1 border border-brand-border">
                      {serviceSublinks.map((child) => (
                        <Link
                          key={child.label}
                          to={child.path}
                          onClick={() => setIsOpen(false)}
                          className="py-2.5 px-3 text-xs font-medium text-brand-charcoal hover:text-brand-forest flex items-center gap-2 min-h-[44px]"
                        >
                          <ChevronRight className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                          <span>{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  to="/services/audit-assurance"
                  onClick={() => setIsOpen(false)}
                  className={\`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center \${
                    location.pathname === '/services/audit-assurance'
                      ? 'bg-brand-pale text-brand-forest font-semibold'
                      : 'text-brand-charcoal hover:bg-brand-white'
                  }\`}
                >
                  Audit Spotlight
                </Link>

                <Link
                  to="/industries"
                  onClick={() => setIsOpen(false)}
                  className={\`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center \${
                    isActive('/industries')
                      ? 'bg-brand-pale text-brand-forest font-semibold'
                      : 'text-brand-charcoal hover:bg-brand-white'
                  }\`}
                >
                  Industries We Serve
                </Link>

                <Link
                  to="/locations"
                  onClick={() => setIsOpen(false)}
                  className={\`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center \${
                    isActive('/locations')
                      ? 'bg-brand-pale text-brand-forest font-semibold'
                      : 'text-brand-charcoal hover:bg-brand-white'
                  }\`}
                >
                  Service Reach
                </Link>

                {/* MANDATORY for Test 13.2: to="/blog" */}
                <Link
                  to="/blog"
                  onClick={() => setIsOpen(false)}
                  className={\`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center \${
                    isActive('/blog')
                      ? 'bg-brand-pale text-brand-forest font-semibold'
                      : 'text-brand-charcoal hover:bg-brand-white'
                  }\`}
                >
                  Publications & Articles
                </Link>

                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className={\`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center \${
                    isActive('/contact')
                      ? 'bg-brand-pale text-brand-forest font-semibold'
                      : 'text-brand-charcoal hover:bg-brand-white'
                  }\`}
                >
                  Contact Chambers
                </Link>
              </div>`;

const newBlock = `              {/* Navigation Links with Subtle Gold Active Route Indicators */}
              <div className="space-y-1">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className={\`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center justify-between border-l-[3px] transition-colors \${
                    location.pathname === '/'
                      ? 'border-brand-brightgold bg-brand-surface text-brand-forest font-semibold'
                      : 'border-transparent text-brand-charcoal hover:bg-brand-white'
                  }\`}
                >
                  <span>Home</span>
                  {location.pathname === '/' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-brightgold shrink-0" aria-hidden="true" />
                  )}
                </Link>

                <Link
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className={\`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center justify-between border-l-[3px] transition-colors \${
                    isActive('/about')
                      ? 'border-brand-brightgold bg-brand-surface text-brand-forest font-semibold'
                      : 'border-transparent text-brand-charcoal hover:bg-brand-white'
                  }\`}
                >
                  <span>About Firm</span>
                  {isActive('/about') && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-brightgold shrink-0" aria-hidden="true" />
                  )}
                </Link>

                {/* Mobile Services Accordion */}
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className={\`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] border-l-[3px] transition-colors \${
                      isActive('/services')
                        ? 'border-brand-brightgold bg-brand-surface text-brand-forest font-semibold'
                        : 'border-transparent text-brand-charcoal hover:bg-brand-white'
                    }\`}
                    aria-expanded={mobileServicesOpen}
                  >
                    <span>Services</span>
                    <ChevronDown className={\`w-4 h-4 transition-transform \${mobileServicesOpen ? 'rotate-180 text-brand-forest' : ''}\`} />
                  </button>

                  {mobileServicesOpen && (
                    <div className="pl-3 pr-2 py-1 space-y-1 bg-brand-white rounded-lg my-1 border border-brand-border">
                      {serviceSublinks.map((child) => {
                        const childActive = location.pathname === child.path;
                        return (
                          <Link
                            key={child.label}
                            to={child.path}
                            onClick={() => setIsOpen(false)}
                            className={\`py-2.5 px-3 text-xs font-medium flex items-center justify-between min-h-[44px] rounded-md transition-colors \${
                              childActive
                                ? 'bg-brand-surface text-brand-forest font-semibold'
                                : 'text-brand-charcoal hover:text-brand-forest'
                            }\`}
                          >
                            <span className="flex items-center gap-2">
                              <ChevronRight className={\`w-3.5 h-3.5 shrink-0 \${childActive ? 'text-brand-brightgold' : 'text-gold-dark'}\`} />
                              <span>{child.label}</span>
                            </span>
                            {childActive && (
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-brightgold shrink-0" aria-hidden="true" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                <Link
                  to="/services/audit-assurance"
                  onClick={() => setIsOpen(false)}
                  className={\`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center justify-between border-l-[3px] transition-colors \${
                    location.pathname === '/services/audit-assurance'
                      ? 'border-brand-brightgold bg-brand-surface text-brand-forest font-semibold'
                      : 'border-transparent text-brand-charcoal hover:bg-brand-white'
                  }\`}
                >
                  <span>Audit Spotlight</span>
                  {location.pathname === '/services/audit-assurance' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-brightgold shrink-0" aria-hidden="true" />
                  )}
                </Link>

                <Link
                  to="/industries"
                  onClick={() => setIsOpen(false)}
                  className={\`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center justify-between border-l-[3px] transition-colors \${
                    isActive('/industries')
                      ? 'border-brand-brightgold bg-brand-surface text-brand-forest font-semibold'
                      : 'border-transparent text-brand-charcoal hover:bg-brand-white'
                  }\`}
                >
                  <span>Industries We Serve</span>
                  {isActive('/industries') && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-brightgold shrink-0" aria-hidden="true" />
                  )}
                </Link>

                <Link
                  to="/locations"
                  onClick={() => setIsOpen(false)}
                  className={\`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center justify-between border-l-[3px] transition-colors \${
                    isActive('/locations')
                      ? 'border-brand-brightgold bg-brand-surface text-brand-forest font-semibold'
                      : 'border-transparent text-brand-charcoal hover:bg-brand-white'
                  }\`}
                >
                  <span>Service Reach</span>
                  {isActive('/locations') && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-brightgold shrink-0" aria-hidden="true" />
                  )}
                </Link>

                {/* MANDATORY for Test 13.2: to="/blog" */}
                <Link
                  to="/blog"
                  onClick={() => setIsOpen(false)}
                  className={\`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center justify-between border-l-[3px] transition-colors \${
                    isActive('/blog')
                      ? 'border-brand-brightgold bg-brand-surface text-brand-forest font-semibold'
                      : 'border-transparent text-brand-charcoal hover:bg-brand-white'
                  }\`}
                >
                  <span>Publications & Articles</span>
                  {isActive('/blog') && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-brightgold shrink-0" aria-hidden="true" />
                  )}
                </Link>

                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className={\`px-3.5 py-2.5 rounded-lg text-sm font-medium min-h-[44px] flex items-center justify-between border-l-[3px] transition-colors \${
                    isActive('/contact')
                      ? 'border-brand-brightgold bg-brand-surface text-brand-forest font-semibold'
                      : 'border-transparent text-brand-charcoal hover:bg-brand-white'
                  }\`}
                >
                  <span>Contact Chambers</span>
                  {isActive('/contact') && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-brightgold shrink-0" aria-hidden="true" />
                  )}
                </Link>
              </div>`;

// Normalize line endings for replacement
const norm = (s) => s.replace(/\r\n/g, '\n');
if (norm(content).includes(norm(oldBlock))) {
  // Replace with matching line endings of original content
  const isCRLF = content.includes('\r\n');
  const targetOld = isCRLF ? oldBlock.replace(/\n/g, '\r\n') : oldBlock;
  const targetNew = isCRLF ? newBlock.replace(/\n/g, '\r\n') : newBlock;
  content = content.replace(targetOld, targetNew);
  fs.writeFileSync('src/components/Navbar.tsx', content, 'utf8');
  console.log('2. Updated Navbar.tsx with subtle gold active-route indicators in mobile drawer.');
} else {
  console.error('Navbar.tsx block did not match.');
  process.exit(1);
}
