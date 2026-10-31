import fs from 'node:fs';
import path from 'node:path';

console.log('--- APPLYING PRODUCTION SEO IMPROVEMENTS ---');

// 1. Update MarkdownRenderer.tsx
const mdRendererPath = path.resolve('src/components/MarkdownRenderer.tsx');
let mdRenderer = fs.readFileSync(mdRendererPath, 'utf8');

if (!mdRenderer.includes('demoteHeadings')) {
  mdRenderer = mdRenderer.replace(
    /interface MarkdownRendererProps \{\r?\n\s*content: string;\r?\n\}/,
    'interface MarkdownRendererProps {\n  content: string;\n  demoteHeadings?: boolean;\n}'
  );

  mdRenderer = mdRenderer.replace(
    /export const MarkdownRenderer: React\.FC<MarkdownRendererProps> = \(\{ content \}\) => \{/,
    'export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, demoteHeadings = false }) => {'
  );

  // Update H1 rendering inside MarkdownRenderer
  const oldH1Regex = /if \(trimmed\.startsWith\('# '\)\) \{\r?\n\s*elements\.push\(\r?\n\s*<h1 key=\{`h1-\$\{index\+\+\}`\} className="font-serif text-3xl sm:text-4xl font-bold text-brand-primary mt-10 mb-4 leading-tight">\r?\n\s*\{renderFormattedInline\(trimmed\.slice\(2\)\)\}\r?\n\s*<\/h1>\r?\n\s*\);\r?\n\s*i\+\+;\r?\n\s*continue;\r?\n\s*\}/;

  const newH1Code = `if (trimmed.startsWith('# ')) {
      const headingText = renderFormattedInline(trimmed.slice(2));
      if (demoteHeadings) {
        elements.push(
          <h2 key={\`h2-\${index++}\`} className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary mt-8 mb-3.5 border-b border-border/80 pb-2">
            {headingText}
          </h2>
        );
      } else {
        elements.push(
          <h1 key={\`h1-\${index++}\`} className="font-serif text-3xl sm:text-4xl font-bold text-brand-primary mt-10 mb-4 leading-tight">
            {headingText}
          </h1>
        );
      }
      i++;
      continue;
    }`;

  mdRenderer = mdRenderer.replace(oldH1Regex, newH1Code);
  fs.writeFileSync(mdRendererPath, mdRenderer, 'utf8');
  console.log('✓ Updated src/components/MarkdownRenderer.tsx with demoteHeadings support.');
}

// 2. Update BlogArticlePage.tsx
const blogArticlePath = path.resolve('src/pages/BlogArticlePage.tsx');
let blogArticle = fs.readFileSync(blogArticlePath, 'utf8');

// Use demoteHeadings in MarkdownRenderer
blogArticle = blogArticle.replace(
  '<MarkdownRenderer content={post.content} />',
  '<MarkdownRenderer content={post.content} demoteHeadings={true} />'
);

// Add breadcrumbs to SEOHead in BlogArticlePage
const oldBlogSEOHeadRegex = /<SEOHead\r?\n\s*title=\{metaTitle\}\r?\n\s*description=\{metaDescription\}\r?\n\s*canonicalPath=\{`\/blog\/\$\{post\.slug\}`\}\r?\n\s*ogType="article"\r?\n\s*image=\{post\.coverImage\}\r?\n\s*article=\{\{\r?\n\s*author: post\.author,\r?\n\s*datePublished: post\.date,\r?\n\s*tags: post\.tags,\r?\n\s*\}\}\r?\n\s*\/>/;

const newBlogSEOHead = `<SEOHead
        title={metaTitle}
        description={metaDescription}
        canonicalPath={\`/blog/\${post.slug}\`}
        ogType="article"
        image={post.coverImage}
        article={{
          author: post.author,
          datePublished: post.date,
          tags: post.tags,
        }}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Regulatory Insights', path: '/blog' },
          { name: post.title, path: \`/blog/\${post.slug}\` },
        ]}
      />`;

blogArticle = blogArticle.replace(oldBlogSEOHeadRegex, newBlogSEOHead);
fs.writeFileSync(blogArticlePath, blogArticle, 'utf8');
console.log('✓ Updated src/pages/BlogArticlePage.tsx with breadcrumbs and demoteHeadings.');

// 3. Update HomePage.tsx: Single H1 and Optimized Keywords
const homePagePath = path.resolve('src/pages/HomePage.tsx');
let homePage = fs.readFileSync(homePagePath, 'utf8');

// Replace double H1 with single H1
const oldDoubleH1Regex = /<h1 className="font-editorial-h1 text-brand-forest leading-\[1\.15\]">\r?\n\s*Statutory Rigor\.\r?\n\s*<\/h1>\r?\n\s*<h1 className="font-editorial-h1 text-brand-gold leading-\[1\.15\]">\r?\n\s*Practical Commercial Counsel\.\r?\n\s*<\/h1>/;

const newSingleH1 = `<h1 className="font-editorial-h1 leading-[1.15]">
                <span className="block text-brand-forest">Chartered Accountant in Tirupati</span>
                <span className="block text-brand-gold font-serif italic text-[0.82em] mt-1.5 font-normal">Statutory Rigor & Commercial Tax Counsel</span>
              </h1>`;

homePage = homePage.replace(oldDoubleH1Regex, newSingleH1);

// Update SEOHead on HomePage
const oldHomeSEOHeadRegex = /<SEOHead\r?\n\s*title="Chartered Accountants & Cost Accountants \| Tirupati & Pan India"\r?\n\s*description="[^"]*"\r?\n\s*canonicalPath="\/"\r?\n\s*\/>/;

const newHomeSEOHead = `<SEOHead
        title="Chartered Accountant in Tirupati | CA Kavitha & Associates"
        description="Leading Chartered Accountant in Tirupati. CA Kavitha & Associates provides expert Statutory Audit, Income Tax Return filing, GST, ROC compliance & CFO advisory."
        canonicalPath="/"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'AccountingService',
            name: 'Kavitha & Associates',
            legalName: 'Kavitha & Associates Chartered Accountants',
            url: 'https://kavithaassociates.com/',
            logo: 'https://kavithaassociates.com/favicon.svg',
            image: 'https://kavithaassociates.com/brand/ka-google-cover-banner.svg',
            telephone: '+919626350900',
            email: 'cakavithasrj@gmail.com',
            priceRange: '₹₹',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '19-12-46, 1st Floor, Near Bairagipetteda Arch, Bairagi Patteda',
              addressLocality: 'Tirupati',
              addressRegion: 'Andhra Pradesh',
              postalCode: '517501',
              addressCountry: 'IN'
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 13.6192242,
              longitude: 79.418046
            },
            hasMap: 'https://maps.app.goo.gl/p9ToGUtxqYDCghpF6',
            openingHoursSpecification: {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
              opens: '09:30',
              closes: '18:30'
            },
            founder: {
              '@type': 'Person',
              name: 'CA Kavitha Vijay',
              jobTitle: 'Practicing Chartered Accountant & Cost Accountant',
              honorificPrefix: 'CA',
              description: 'B.Com, CA, CMA (AIR 49) | ICAI Mem. [REDACTED_MEMBERSHIP_NO]'
            },
            areaServed: ['Tirupati', 'Chennai', 'Bengaluru', 'Hyderabad', 'Coimbatore', 'India'],
            knowsAbout: [
              'Statutory Audit',
              'Internal Audit',
              'Income Tax Return Filing',
              'GST Compliance & Litigation',
              'ROC & MCA Filings',
              'RERA Certifications',
              'Virtual CFO Services'
            ]
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Kavitha & Associates',
            url: 'https://kavithaassociates.com/'
          }
        ]}
      />`;

homePage = homePage.replace(oldHomeSEOHeadRegex, newHomeSEOHead);
fs.writeFileSync(homePagePath, homePage, 'utf8');
console.log('✓ Updated src/pages/HomePage.tsx with single H1 and rich AccountingService/WebSite schema.');

// 4. Update AboutPage.tsx
const aboutPagePath = path.resolve('src/pages/AboutPage.tsx');
let aboutPage = fs.readFileSync(aboutPagePath, 'utf8');

const oldAboutSEORegex = /<SEOHead\r?\n\s*title="About CA Kavitha Vijay \| Big 4 & MNC Auditor \| Kavitha & Associates"\r?\n\s*description="[^"]*"\r?\n\s*canonicalPath="\/about"\r?\n\s*\/>/;

const newAboutSEO = `<SEOHead
        title="About CA Kavitha Vijay | Chartered Accountant in Tirupati"
        description="Profile of CA Kavitha Vijay (ICAI Mem. [REDACTED_MEMBERSHIP_NO], B.Com, CA, CMA AIR 49). 10+ years across Deloitte Big 4 audit, Ford Motor Company internal audit & Tirupati practice."
        canonicalPath="/about"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' }
        ]}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'CA Kavitha Vijay',
          jobTitle: 'Practicing Chartered Accountant & Cost Accountant',
          honorificPrefix: 'CA',
          description: 'Managing Partner at Kavitha & Associates. B.Com, CA, CMA (AIR 49) with 10+ years experience across Deloitte, Ford Motor Company, and public practice in Tirupati.',
          worksFor: {
            '@type': 'AccountingService',
            name: 'Kavitha & Associates',
            url: 'https://kavithaassociates.com/'
          },
          alumniOf: [
            {
              '@type': 'EducationalOrganization',
              name: 'Institute of Chartered Accountants of India'
            },
            {
              '@type': 'EducationalOrganization',
              name: 'Institute of Cost Accountants of India'
            },
            {
              '@type': 'EducationalOrganization',
              name: 'Madras University'
            }
          ],
          sameAs: [
            'https://www.linkedin.com/in/ca-kavitha-srj-770988199'
          ]
        }}
      />`;

aboutPage = aboutPage.replace(oldAboutSEORegex, newAboutSEO);
fs.writeFileSync(aboutPagePath, aboutPage, 'utf8');
console.log('✓ Updated src/pages/AboutPage.tsx with breadcrumbs and Person schema.');

// 5. Update ServicesPage.tsx
const servicesPagePath = path.resolve('src/pages/ServicesPage.tsx');
let servicesPage = fs.readFileSync(servicesPagePath, 'utf8');

const oldServicesSEORegex = /<SEOHead\r?\n\s*title="Comprehensive Accounting, Audit & Tax Services \| Kavitha & Associates"\r?\n\s*description="[^"]*"\r?\n\s*canonicalPath="\/services"\r?\n\s*\/>/;

const newServicesSEO = `<SEOHead
        title="Accounting & Tax Services in Tirupati | Kavitha & Associates"
        description="Comprehensive CA services in Tirupati: Statutory Audit, Income Tax Return (ITR) filing, GST compliance, Company Incorporation, ROC filings & Virtual CFO advisory."
        canonicalPath="/services"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' }
        ]}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Chartered Accountancy & Advisory Services',
          provider: {
            '@type': 'AccountingService',
            name: 'Kavitha & Associates',
            url: 'https://kavithaassociates.com/'
          },
          areaServed: 'Tirupati, Andhra Pradesh, India',
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'CA Services Spectrum',
            itemListElement: [
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Income Tax Return (ITR) Filing & Scrutiny Defense' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'GST Registration, Monthly Returns & ITC Reconciliation' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Company Incorporation & MCA / ROC Annual Filings' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'RERA Compliance & Chartered Accountant Certification' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Virtual CFO & Strategic Financial Governance' } }
            ]
          }
        }}
      />`;

servicesPage = servicesPage.replace(oldServicesSEORegex, newServicesSEO);
fs.writeFileSync(servicesPagePath, servicesPage, 'utf8');
console.log('✓ Updated src/pages/ServicesPage.tsx with breadcrumbs and Service catalog schema.');

// 6. Update AuditAssurancePage.tsx
const auditPagePath = path.resolve('src/pages/AuditAssurancePage.tsx');
let auditPage = fs.readFileSync(auditPagePath, 'utf8');

const oldAuditSEORegex = /<SEOHead\r?\n\s*title="Audit & Assurance Practice \| Statutory, Tax & Internal Audits \| Kavitha & Associates"\r?\n\s*description="[^"]*"\r?\n\s*canonicalPath="\/services\/audit-assurance"\r?\n\s*\/>/;

const newAuditSEO = `<SEOHead
        title="Statutory Audit in Tirupati | Tax & Internal Audits | Kavitha & Associates"
        description="Independent Statutory Audit under Companies Act 2013, Tax Audit under Sec 44AB, Internal Audit, Concurrent Audit & Stock Verification in Tirupati, AP."
        canonicalPath="/services/audit-assurance"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: 'Audit & Assurance', path: '/services/audit-assurance' }
        ]}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Statutory, Tax & Internal Audit Services',
          serviceType: 'Audit and Assurance',
          provider: {
            '@type': 'AccountingService',
            name: 'Kavitha & Associates',
            url: 'https://kavithaassociates.com/'
          },
          areaServed: 'Tirupati, Andhra Pradesh, India',
          description: 'Comprehensive audit practice supervised by CA Kavitha Vijay, ensuring independent statutory opinions, IFC evaluations, and Sec 44AB tax audit certifications.'
        }}
      />`;

auditPage = auditPage.replace(oldAuditSEORegex, newAuditSEO);
fs.writeFileSync(auditPagePath, auditPage, 'utf8');
console.log('✓ Updated src/pages/AuditAssurancePage.tsx with breadcrumbs and Audit Service schema.');

// 7. Update IndustriesPage.tsx
const indPagePath = path.resolve('src/pages/IndustriesPage.tsx');
let indPage = fs.readFileSync(indPagePath, 'utf8');

const oldIndSEORegex = /<SEOHead\r?\n\s*title="Industry Expertise \| Startups, MSMEs, Manufacturing, Healthcare[^"]*"\r?\n\s*description="[^"]*"\r?\n\s*canonicalPath="\/industries"\r?\n\s*\/>/;

const newIndSEO = `<SEOHead
        title="Industry Accounting & Tax Solutions in Tirupati | Kavitha & Associates"
        description="Sector-specific Chartered Accountancy expertise in Tirupati for Startups, MSMEs, Manufacturing, Real Estate, Retail, Healthcare, and Education sectors."
        canonicalPath="/industries"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Industries', path: '/industries' }
        ]}
      />`;

indPage = indPage.replace(oldIndSEORegex, newIndSEO);
fs.writeFileSync(indPagePath, indPage, 'utf8');
console.log('✓ Updated src/pages/IndustriesPage.tsx with breadcrumbs and optimized title.');

// 8. Update LocationsPage.tsx
const locPagePath = path.resolve('src/pages/LocationsPage.tsx');
let locPage = fs.readFileSync(locPagePath, 'utf8');

const oldLocSEORegex = /<SEOHead\r?\n\s*title="Service Footprint & Regional Presence \| Tirupati & South India[^"]*"\r?\n\s*description="[^"]*"\r?\n\s*canonicalPath="\/locations"\r?\n\s*\/>/;

const newLocSEO = `<SEOHead
        title="CA Chambers in Tirupati & Regional Client Coverage | Kavitha & Associates"
        description="Principal practice chambers located at Bairagi Patteda, Tirupati, Andhra Pradesh, with verified regional client coverage across Chennai, Bengaluru, and Hyderabad."
        canonicalPath="/locations"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Locations', path: '/locations' }
        ]}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Place',
          name: 'Kavitha & Associates Chambers',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '19-12-46, 1st Floor, Near Bairagipetteda Arch, Bairagi Patteda',
            addressLocality: 'Tirupati',
            addressRegion: 'Andhra Pradesh',
            postalCode: '517501',
            addressCountry: 'IN'
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 13.6192242,
            longitude: 79.418046
          },
          hasMap: 'https://maps.app.goo.gl/p9ToGUtxqYDCghpF6'
        }}
      />`;

locPage = locPage.replace(oldLocSEORegex, newLocSEO);
fs.writeFileSync(locPagePath, locPage, 'utf8');
console.log('✓ Updated src/pages/LocationsPage.tsx with breadcrumbs and Place schema.');

// 9. Update ContactPage.tsx
const contactPagePath = path.resolve('src/pages/ContactPage.tsx');
let contactPage = fs.readFileSync(contactPagePath, 'utf8');

const oldContactSEORegex = /<SEOHead\r?\n\s*title="Contact CA Kavitha Vijay \| Tirupati Practice Chambers[^"]*"\r?\n\s*description="[^"]*"\r?\n\s*canonicalPath="\/contact"\r?\n\s*\/>/;

const newContactSEO = `<SEOHead
        title="Contact Chartered Accountant in Tirupati | Kavitha & Associates"
        description="Schedule a consultation with CA Kavitha Vijay in Tirupati. Call +91 96263 50900 or WhatsApp for statutory audit, income tax filing, and GST advisory inquiries."
        canonicalPath="/contact"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' }
        ]}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'AccountingService',
          name: 'Kavitha & Associates',
          url: 'https://kavithaassociates.com/contact',
          telephone: '+919626350900',
          email: 'cakavithasrj@gmail.com',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '19-12-46, 1st Floor, Near Bairagipetteda Arch, Bairagi Patteda',
            addressLocality: 'Tirupati',
            addressRegion: 'Andhra Pradesh',
            postalCode: '517501',
            addressCountry: 'IN'
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 13.6192242,
            longitude: 79.418046
          },
          hasMap: 'https://maps.app.goo.gl/p9ToGUtxqYDCghpF6',
          openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '09:30',
            closes: '18:30'
          }
        }}
      />`;

contactPage = contactPage.replace(oldContactSEORegex, newContactSEO);
fs.writeFileSync(contactPagePath, contactPage, 'utf8');
console.log('✓ Updated src/pages/ContactPage.tsx with breadcrumbs and Contact AccountingService schema.');

// 10. Update BlogPage.tsx
const blogPagePath = path.resolve('src/pages/BlogPage.tsx');
let blogPage = fs.readFileSync(blogPagePath, 'utf8');

const oldBlogSEORegex = /<SEOHead\r?\n\s*title="Regulatory Insights & Technical Commentary \| Kavitha & Associates"\r?\n\s*description="[^"]*"\r?\n\s*canonicalPath="\/blog"\r?\n\s*\/>/;

const newBlogSEO = `<SEOHead
        title="Tax & Regulatory Insights | CA Kavitha & Associates Tirupati"
        description="Authoritative Indian direct tax, GST compliance, and statutory audit insights by CA Kavitha Vijay (ICAI Mem. [REDACTED_MEMBERSHIP_NO], CMA AIR 49) for businesses and founders."
        canonicalPath="/blog"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Regulatory Insights', path: '/blog' }
        ]}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Kavitha & Associates Regulatory Insights',
          url: 'https://kavithaassociates.com/blog',
          description: 'Technical commentary on Direct Taxation, GST Compliance, Corporate Governance, and ICAI Auditing Standards.',
          publisher: {
            '@type': 'Organization',
            name: 'Kavitha & Associates'
          }
        }}
      />`;

blogPage = blogPage.replace(oldBlogSEORegex, newBlogSEO);
fs.writeFileSync(blogPagePath, blogPage, 'utf8');
console.log('✓ Updated src/pages/BlogPage.tsx with breadcrumbs and Blog schema.');

// 11. Update NotFoundPage.tsx: Ensure no canonical on 404
const notFoundPagePath = path.resolve('src/pages/NotFoundPage.tsx');
let notFoundPage = fs.readFileSync(notFoundPagePath, 'utf8');

const oldNotFoundSEORegex = /<SEOHead\r?\n\s*title="404[^"]*"\r?\n\s*description="[^"]*"\r?\n\s*noIndex=\{true\}\r?\n\s*\/>/;

const newNotFoundSEO = `<SEOHead
        title="404 — Page Not Found | Kavitha & Associates"
        description="The requested page could not be located in our practice registry. Browse our verified practice areas or contact our Tirupati chambers."
        noIndex={true}
      />`;

notFoundPage = notFoundPage.replace(oldNotFoundSEORegex, newNotFoundSEO);
fs.writeFileSync(notFoundPagePath, notFoundPage, 'utf8');
console.log('✓ Updated src/pages/NotFoundPage.tsx with clean title and no canonical.');

// 12. Add contextual internal links in content/posts/*.md
const post1Path = path.resolve('content/posts/corporate-tax-planning-2026.md');
let post1 = fs.readFileSync(post1Path, 'utf8');
if (!post1.includes('/services#income-tax')) {
  // Add contextual advisory cross-link at the end
  post1 = post1.trim() + '\n\n---\n\n*For corporate tax planning, advance tax forecasting, or faceless assessment defense, explore our verified [Income Tax Services](/services#income-tax) or [schedule a confidential consultation](/contact) with CA Kavitha Vijay at our Tirupati practice chambers.*\n';
  fs.writeFileSync(post1Path, post1, 'utf8');
  console.log('✓ Added contextual internal links to corporate-tax-planning-2026.md.');
}

const post2Path = path.resolve('content/posts/gst-annual-return-compliance.md');
let post2 = fs.readFileSync(post2Path, 'utf8');
if (!post2.includes('/services#gst')) {
  post2 = post2.trim() + '\n\n---\n\n*To resolve GSTR-2B vs. 3B reconciliation mismatches, ITC disallowances, or departmental notices under Form DRC-01A, review our [GST Services Spectrum](/services#gst) or [connect directly with our practice chambers](/contact).*\n';
  fs.writeFileSync(post2Path, post2, 'utf8');
  console.log('✓ Added contextual internal links to gst-annual-return-compliance.md.');
}

const post3Path = path.resolve('content/posts/statutory-audit-guidelines-2026.md');
let post3 = fs.readFileSync(post3Path, 'utf8');
if (!post3.includes('/services/audit-assurance')) {
  post3 = post3.trim() + '\n\n---\n\n*For comprehensive statutory, internal, or tax audits conducted strictly under ICAI Auditing Standards, visit our [Audit & Assurance Practice](/services/audit-assurance) or [request an audit engagement consultation](/contact).*\n';
  fs.writeFileSync(post3Path, post3, 'utf8');
  console.log('✓ Added contextual internal links to statutory-audit-guidelines-2026.md.');
}

console.log('\n--- ALL SEO IMPROVEMENTS APPLIED SUCCESSFULLY ---');
