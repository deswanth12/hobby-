import os
import re

def enrich_practice_areas():
    path = "src/v8/components/home/PracticeAreasSection.tsx"
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    # Add imports
    if "from '../decorative'" not in code:
        code = code.replace(
            "import { Button } from '../common/Button';",
            "import { Button } from '../common/Button';\nimport { DotGrid, SectionAccent, DecorativeLayer } from '../decorative';"
        )

    # Add DecorativeLayer with subtle DotGrid
    if "Ambient Decorative Layer" not in code:
        code = code.replace(
            '<div id="services-preview" className="scroll-mt-28" />',
            '<div id="services-preview" className="scroll-mt-28" />\n\n      {/* Ambient Decorative Layer */}\n      <DecorativeLayer>\n        <DotGrid\n          variant="bronze"\n          width={280}\n          height={280}\n          className="absolute -top-12 -left-12 opacity-15 hidden lg:block"\n        />\n      </DecorativeLayer>'
        )

    # Add SectionAccent in header
    if '<SectionAccent' not in code:
        code = code.replace(
            '8 STATUTORY DISCIPLINES\n                </span>\n              </div>\n            </div>',
            '8 STATUTORY DISCIPLINES\n                </span>\n              </div>\n              <SectionAccent variant="bronze" className="hidden sm:flex ml-1.5" />\n            </div>'
        )

    # Add card hover and small bronze line
    if "Small Bronze Endpoint Accent" not in code:
        code = code.replace(
            "hover:border-[#B49A64] hover:shadow-card-hover transition-all duration-300 relative",
            "hover:border-[#B49A64] hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 relative"
        )
        code = code.replace(
            "{/* Direct Dedicated Page Link */}\n                  <div className=\"mt-4 pt-3 border-t border-[#D8D0BE]/60",
            "{/* Small Bronze Endpoint Accent */}\n                  <div className=\"h-[2px] w-6 bg-[#B49A64]/40 rounded-full group-hover:w-10 group-hover:bg-[#B49A64] transition-all duration-300 mt-3\" />\n\n                  {/* Direct Dedicated Page Link */}\n                  <div className=\"mt-2 pt-2.5 border-t border-[#D8D0BE]/60"
        )

    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Enriched PracticeAreasSection.tsx")

def enrich_why_choose_us():
    path = "src/v8/components/home/WhyChooseUsSection.tsx"
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    if "from '../decorative'" not in code:
        code = code.replace(
            "import { ShieldCheck, Award, Users, Lock } from 'lucide-react';",
            "import { ShieldCheck, Award, Users, Lock } from 'lucide-react';\nimport { OrbitalSphere, DotGrid, DecorativeLayer } from '../decorative';"
        )

    if "Ambient Decorative Layer" not in code:
        code = code.replace(
            '<div id="why-choose-us" className="scroll-mt-28" />',
            '<div id="why-choose-us" className="scroll-mt-28" />\n\n      {/* Ambient Decorative Layer */}\n      <DecorativeLayer>\n        <OrbitalSphere\n          size={380}\n          variant="bronze"\n          className="absolute -top-20 -right-20 opacity-20 hidden lg:block"\n        />\n        <DotGrid\n          variant="bronze"\n          width={200}\n          height={200}\n          className="absolute -bottom-8 -left-8 opacity-20 hidden md:block"\n        />\n      </DecorativeLayer>'
        )

    # Add card hover micro-lift
    code = code.replace(
        "hover:border-[#B49A64] transition-all duration-300 relative group flex flex-col justify-between",
        "hover:border-[#B49A64] hover:-translate-y-0.5 transition-all duration-300 relative group flex flex-col justify-between"
    )

    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Enriched WhyChooseUsSection.tsx")

def enrich_methodology():
    path = "src/v8/components/home/MethodologySection.tsx"
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    if "from '../decorative'" not in code:
        code = code.replace(
            "import { Search, FileCheck2, TrendingUp, ShieldCheck } from 'lucide-react';",
            "import { Search, FileCheck2, TrendingUp, ShieldCheck } from 'lucide-react';\nimport { ArchitecturalLines, DotGrid, DecorativeLayer } from '../decorative';"
        )

    if "Ambient Decorative Layer" not in code:
        code = code.replace(
            '<div id="working-process" className="scroll-mt-28" />',
            '<div id="working-process" className="scroll-mt-28" />\n\n      {/* Ambient Decorative Layer */}\n      <DecorativeLayer>\n        <DotGrid\n          variant="sage"\n          width={240}\n          height={240}\n          className="absolute -bottom-10 -right-10 opacity-20 hidden md:block"\n        />\n      </DecorativeLayer>'
        )

    # Add horizontal connecting line between steps
    if "Connecting Track Line Between Steps" not in code:
        code = code.replace(
            '{/* Exactly 3 Chronological Steps Grid */}\n        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative z-10">',
            '{/* Connecting Track Line Between Steps (Desktop Only) */}\n        <div className="hidden md:flex items-center justify-between absolute top-1/2 left-[18%] right-[18%] -translate-y-20 pointer-events-none z-0 opacity-40" aria-hidden="true">\n          <span className="w-2.5 h-2.5 rounded-full bg-[#B49A64]" />\n          <div className="flex-1 h-[1px] bg-gradient-to-r from-[#B49A64]/40 via-[#B49A64]/60 to-[#B49A64]/40" />\n          <span className="w-2.5 h-2.5 rounded-full bg-[#B49A64]" />\n          <div className="flex-1 h-[1px] bg-gradient-to-r from-[#B49A64]/40 via-[#B49A64]/60 to-[#B49A64]/40" />\n          <span className="w-2.5 h-2.5 rounded-full bg-[#B49A64]" />\n        </div>\n\n        {/* Exactly 3 Chronological Steps Grid */}\n        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative z-10">'
        )

    # Add card hover micro-lift
    code = code.replace(
        "hover:border-[#B49A64] transition-all duration-300 relative flex flex-col justify-between group",
        "hover:border-[#B49A64] hover:-translate-y-0.5 transition-all duration-300 relative flex flex-col justify-between group"
    )

    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Enriched MethodologySection.tsx")

def enrich_featured_insights():
    path = "src/v8/components/home/FeaturedInsightsSection.tsx"
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    if "from '../decorative'" not in code:
        code = code.replace(
            "import { Button } from '../common/Button';",
            "import { Button } from '../common/Button';\nimport { DotGrid, DecorativeLayer } from '../decorative';"
        )

    if "Ambient Decorative Layer" not in code:
        code = code.replace(
            '<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">',
            '{/* Ambient Decorative Layer */}\n      <DecorativeLayer>\n        <DotGrid\n          variant="bronze"\n          width={260}\n          height={260}\n          className="absolute -top-10 -right-10 opacity-15 hidden md:block"\n        />\n      </DecorativeLayer>\n\n      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">'
        )

    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Enriched FeaturedInsightsSection.tsx")

def enrich_chambers_intake():
    path = "src/v8/components/home/ChambersIntakeSection.tsx"
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    if "from '../decorative'" not in code:
        code = code.replace(
            "import { ContactForm } from '../forms/ContactForm';",
            "import { ContactForm } from '../forms/ContactForm';\nimport { OrbitalSphere, DotGrid, DecorativeLayer } from '../decorative';"
        )

    if "Ambient Decorative Layer" not in code:
        code = code.replace(
            '<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">',
            '{/* Ambient Decorative Layer */}\n      <DecorativeLayer>\n        <OrbitalSphere\n          size={420}\n          variant="bronze"\n          className="absolute -top-24 -left-24 opacity-20 hidden lg:block"\n        />\n        <DotGrid\n          variant="sage"\n          width={220}\n          height={220}\n          className="absolute -bottom-8 -right-8 opacity-20 hidden md:block"\n        />\n      </DecorativeLayer>\n\n      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">'
        )

    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Enriched ChambersIntakeSection.tsx")

def enrich_about_page():
    path = "src/v8/pages/AboutPage.tsx"
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    if "from '../components/decorative'" not in code:
        code = code.replace(
            "import { useFirmProfile } from '../adapters/backendAdapter';",
            "import { useFirmProfile } from '../adapters/backendAdapter';\nimport { OrbitalSphere, DotGrid, SectionAccent, DecorativeLayer } from '../components/decorative';"
        )

    # In hero section of AboutPage, add an OrbitalSphere behind decorative area
    if "About Page Ambient Decorative Layer" not in code:
        code = code.replace(
            '<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">',
            '{/* About Page Ambient Decorative Layer */}\n        <DecorativeLayer>\n          <OrbitalSphere\n            size={360}\n            variant="sage"\n            className="absolute -top-16 -right-16 opacity-15 hidden lg:block"\n          />\n          <DotGrid\n            variant="bronze"\n            width={240}\n            height={240}\n            className="absolute -bottom-10 -left-10 opacity-15 hidden md:block"\n          />\n        </DecorativeLayer>\n\n        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">'
        )

    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Enriched AboutPage.tsx")

def enrich_leadership_page():
    path = "src/v8/pages/LeadershipPage.tsx"
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    if "from '../components/decorative'" not in code:
        code = code.replace(
            "import { Button } from '../components/common/Button';",
            "import { Button } from '../components/common/Button';\nimport { OrbitalSphere, DotGrid, SectionAccent, DecorativeLayer } from '../components/decorative';"
        )

    # Add abstract orbital composition near the neutral KV / KA monogram
    if "Crest Monogram Orbital Composition" not in code:
        code = code.replace(
            '<div className="lg:col-span-5 relative">',
            '<div className="lg:col-span-5 relative">\n            {/* Crest Monogram Orbital Composition */}\n            <OrbitalSphere\n              size={340}\n              variant="mixed"\n              className="absolute -top-14 -left-14 opacity-25 hidden sm:block pointer-events-none z-0"\n            />'
        )

    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Enriched LeadershipPage.tsx")

def enrich_services_page():
    path = "src/v8/pages/ServicesPage.tsx"
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    if "from '../components/decorative'" not in code:
        code = code.replace(
            "import { Button } from '../components/common/Button';",
            "import { Button } from '../components/common/Button';\nimport { SectionAccent, DotGrid, DecorativeLayer } from '../components/decorative';"
        )

    # Add SectionAccent to header
    if '<SectionAccent' not in code:
        code = code.replace(
            '<div className="flex items-center gap-2.5 mb-3 flex-wrap">',
            '<div className="flex items-center gap-2.5 mb-3 flex-wrap">\n            <SectionAccent variant="bronze" className="hidden sm:flex mr-1" />'
        )

    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Enriched ServicesPage.tsx")

def enrich_blog_page():
    path = "src/v8/pages/BlogPage.tsx"
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    if "from '../components/decorative'" not in code:
        code = code.replace(
            "import { Button } from '../components/common/Button';",
            "import { Button } from '../components/common/Button';\nimport { SectionAccent, DotGrid, DecorativeLayer } from '../components/decorative';"
        )

    if "Blog Ambient Decorative Layer" not in code:
        code = code.replace(
            '<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">',
            '{/* Blog Ambient Decorative Layer */}\n        <DecorativeLayer>\n          <DotGrid\n            variant="bronze"\n            width={240}\n            height={240}\n            className="absolute -top-10 -right-10 opacity-15 hidden md:block"\n          />\n        </DecorativeLayer>\n\n        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">'
        )

    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Enriched BlogPage.tsx")

def enrich_contact_page():
    path = "src/v8/pages/ContactPage.tsx"
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    if "from '../components/decorative'" not in code:
        code = code.replace(
            "import { ContactForm } from '../components/forms/ContactForm';",
            "import { ContactForm } from '../components/forms/ContactForm';\nimport { OrbitalSphere, DotGrid, ArchitecturalLines, DecorativeLayer } from '../components/decorative';"
        )

    if "Contact Ambient Decorative Layer" not in code:
        code = code.replace(
            '<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">',
            '{/* Contact Ambient Decorative Layer */}\n        <DecorativeLayer>\n          <OrbitalSphere\n            size={360}\n            variant="sage"\n            className="absolute -bottom-16 -left-16 opacity-18 hidden lg:block"\n          />\n          <DotGrid\n            variant="bronze"\n            width={220}\n            height={220}\n            className="absolute -top-8 -right-8 opacity-18 hidden md:block"\n          />\n        </DecorativeLayer>\n\n        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">'
        )

    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Enriched ContactPage.tsx")

if __name__ == "__main__":
    enrich_practice_areas()
    enrich_why_choose_us()
    enrich_methodology()
    enrich_featured_insights()
    enrich_chambers_intake()
    enrich_about_page()
    enrich_leadership_page()
    enrich_services_page()
    enrich_blog_page()
    enrich_contact_page()
    print("All sections enriched successfully!")
