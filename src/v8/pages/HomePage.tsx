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
            areaServed: ['Tirupati', 'Chennai', 'Bengaluru', 'Hyderabad', 'Coimbatore', 'India'],
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
