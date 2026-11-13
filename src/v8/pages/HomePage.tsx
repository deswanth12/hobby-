import React from 'react';
import { SEOHead } from '../../components/SEOHead';
import {
  HeroSection,
  FirmIntroSection,
  PracticeAreasSection,
  WhyChooseUsSection,
  MethodologySection,
  FeaturedInsightsSection,
  ChambersIntakeSection,
} from '../components/home';

export const HomePage: React.FC = () => {
  return (
    <div className="bg-[#F1EBDD] page-reveal">
      <SEOHead
        title="Chartered Accountant in Tirupati | Kavitha & Associates"
        description="Kavitha & Associates, led by CA Kavitha Vijay, provides professional accounting, taxation, audit and business compliance services in Tirupati, Andhra Pradesh."
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
            address: {
              '@type': 'PostalAddress',
              streetAddress: '19-12-46, 1st Floor, Near Bairagipetteda Arch, Bairagi Patteda',
              addressLocality: 'Tirupati',
              addressRegion: 'Andhra Pradesh',
              postalCode: '517501',
              addressCountry: 'IN',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 13.6192242,
              longitude: 79.418046,
            },
            hasMap: 'https://maps.app.goo.gl/p9ToGUtxqYDCghpF6',
            priceRange: '₹₹',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '5.0',
              reviewCount: '50',
              bestRating: '5',
              worstRating: '1',
            },
            openingHoursSpecification: [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '09:30',
                closes: '18:30',
              },
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Saturday'],
                opens: '10:00',
                closes: '14:00',
              },
            ],
            founder: {
              '@type': 'Person',
              name: 'CA Kavitha Vijay',
              jobTitle: 'Practicing Chartered Accountant & Cost Accountant',
              honorificPrefix: 'CA',
              description: 'B.Com, CA, CMA (AIR 49, ICMAI)',
            },
            areaServed: ['Tirupati', 'Sri City', 'Renigunta', 'Chittoor', 'Nellore', 'Kadapa', 'Chennai', 'Bengaluru', 'Hyderabad', 'Coimbatore', 'Andhra Pradesh', 'India'],
            knowsAbout: [
              'Statutory Audit',
              'Internal Audit',
              'Income Tax Return Filing',
              'GST Compliance & Litigation',
              'ROC & MCA Filings',
              'RERA Certifications',
              'Virtual CFO Services',
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Which entities require an independent Statutory Audit in India?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Under Section 139 of the Companies Act 2013, all incorporated Private Limited and Public Limited companies must conduct an annual statutory audit by an independent practicing Chartered Accountant.',
                },
              },
              {
                '@type': 'Question',
                name: 'When is a Tax Audit under Section 44AB mandatory?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'A tax audit under Section 44AB of the Income Tax Act 1961 is mandatory for businesses with turnover exceeding ₹1 Crore (or ₹10 Crore if digital transactions exceed 95%), and professionals with gross receipts over ₹50 Lakhs.',
                },
              },
              {
                '@type': 'Question',
                name: 'Where are Kavitha & Associates chambers located in Tirupati?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Our principal practice chambers are located at 19-12-46, 1st Floor, Near Bairagipetteda Arch, Bairagi Patteda, Tirupati – 517501, Andhra Pradesh.',
                },
              },
              {
                '@type': 'Question',
                name: 'What qualifications and experience does managing partner CA Kavitha Vijay hold?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'CA Kavitha Vijay is a dual-qualified Chartered Accountant (ICAI) and Cost Accountant with All India Rank 49 (AIR 49, ICMAI), with over 10 years of experience including Big 4 tenure at Deloitte Haskins & Sells and Ford Motor Company.',
                },
              },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Kavitha & Associates',
            url: 'https://kavithaassociates.com/',
          },
        ]}
      />

      {/* Section 1: Hero & Practice Registry (#hero) */}
      <HeroSection />

      {/* Section 2: The Firm Narrative (#the-firm) */}
      <FirmIntroSection />

      {/* Section 3: Core Practice Areas - 8 Disciplines (#practice-areas) */}
      <PracticeAreasSection />

      {/* Section 4: Professional Approach (#professional-approach) */}
      <WhyChooseUsSection />

      {/* Section 5: Engagement Methodology - 3 Steps (#methodology) */}
      <MethodologySection />

      {/* Section 6: Featured Regulatory Insights - 1 Lead + 2 Companions (#insights-overview) */}
      <FeaturedInsightsSection />

      {/* Section 7: Chambers Intake & Consultation (#chambers-contact) */}
      <ChambersIntakeSection />
    </div>
  );
};

export default HomePage;
