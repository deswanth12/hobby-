import re

# 1. Update src/components/AboutSection.tsx
with open('src/components/AboutSection.tsx', 'r', encoding='utf-8') as f:
    about_sec = f.read()

# Add animation imports
if "from './animations'" not in about_sec and "from '../components/animations'" not in about_sec:
    about_sec = about_sec.replace(
        "import { CheckCircle2, ArrowRight } from 'lucide-react';",
        "import { CheckCircle2, ArrowRight } from 'lucide-react';\nimport { AnimatedDotPattern, RotatingGeometricMesh, FloatingGeometricShapes } from './animations';"
    )

# Add rotating mesh, dot pattern, and floating ring behind the collage
old_collage_container = '''          <div className="lg:col-span-6 scroll-reveal-left">
            <div className="relative space-y-3 sm:space-y-4">'''

new_collage_container = '''          <div className="lg:col-span-6 scroll-reveal-left">
            <div className="relative space-y-3 sm:space-y-4">
              
              {/* Decorative Rotating Geometric Mesh behind collage */}
              <div className="absolute -top-10 -right-8 pointer-events-none -z-0 opacity-60 hidden sm:block">
                <RotatingGeometricMesh size={260} />
              </div>

              {/* Decorative Animated Dot Pattern beside collage */}
              <div className="absolute -bottom-8 -left-6 pointer-events-none -z-0 opacity-70 hidden sm:block">
                <AnimatedDotPattern rows={5} cols={6} variant="mixed" />
              </div>

              {/* Decorative Floating Ring Shape */}
              <div className="absolute -top-6 -left-6 pointer-events-none -z-0 hidden md:block">
                <FloatingGeometricShapes type="ring" size={64} />
              </div>'''

if old_collage_container in about_sec:
    about_sec = about_sec.replace(old_collage_container, new_collage_container)
    with open('src/components/AboutSection.tsx', 'w', encoding='utf-8') as f:
        f.write(about_sec)
    print("SUCCESS: Updated src/components/AboutSection.tsx")
else:
    print("WARNING: Could not find old_collage_container in AboutSection.tsx")

# 2. Update src/pages/AboutPage.tsx
with open('src/pages/AboutPage.tsx', 'r', encoding='utf-8') as f:
    about_page = f.read()

if "from '../components/animations'" not in about_page:
    about_page = about_page.replace(
        "import { SEOHead } from '../components/SEOHead';",
        "import { SEOHead } from '../components/SEOHead';\nimport { AnimatedDotPattern, RotatingGeometricMesh, FloatingGeometricShapes } from '../components/animations';"
    )

old_page_collage = '''            <div className="lg:col-span-6 scroll-reveal-left">
              <div className="relative space-y-3 sm:space-y-4">
                
                {/* 1. Large Professional Indian Business Consultation Image */}'''

new_page_collage = '''            <div className="lg:col-span-6 scroll-reveal-left">
              <div className="relative space-y-3 sm:space-y-4">
                
                {/* Decorative Rotating Geometric Mesh behind collage */}
                <div className="absolute -top-10 -right-8 pointer-events-none -z-0 opacity-60 hidden sm:block">
                  <RotatingGeometricMesh size={260} />
                </div>

                {/* Decorative Animated Dot Pattern beside collage */}
                <div className="absolute -bottom-8 -left-6 pointer-events-none -z-0 opacity-70 hidden sm:block">
                  <AnimatedDotPattern rows={5} cols={6} variant="mixed" />
                </div>

                {/* Decorative Floating Ring Shape */}
                <div className="absolute -top-6 -left-6 pointer-events-none -z-0 hidden md:block">
                  <FloatingGeometricShapes type="ring" size={64} />
                </div>

                {/* 1. Large Professional Indian Business Consultation Image */}'''

if old_page_collage in about_page:
    about_page = about_page.replace(old_page_collage, new_page_collage)
    with open('src/pages/AboutPage.tsx', 'w', encoding='utf-8') as f:
        f.write(about_page)
    print("SUCCESS: Updated src/pages/AboutPage.tsx")
else:
    print("WARNING: Could not find old_page_collage in AboutPage.tsx")

# 3. Update src/components/WhyChooseUs.tsx
with open('src/components/WhyChooseUs.tsx', 'r', encoding='utf-8') as f:
    why = f.read()

if "from './animations'" not in why:
    why = why.replace(
        "import {\n  ShieldCheck,",
        "import { AnimatedDotPattern, FloatingGeometricShapes } from './animations';\nimport {\n  ShieldCheck,"
    )

# Add motion-path-reveal-loop on concentric arcs & add dot pattern
old_arcs = '''      {/* Refined Architectural Concentric Arcs Motif (Emanating from bottom-left corner, inspired by CARVI) */}
      <svg 
        className="absolute -bottom-6 -left-6 w-72 h-72 sm:w-88 sm:h-88 pointer-events-none text-[#C9A66B]/30 hidden md:block" 
        viewBox="0 0 320 320" 
        fill="none" 
        aria-hidden="true" 
      >
        <circle cx="0" cy="320" r="60" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
        <circle cx="0" cy="320" r="110" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        <circle cx="0" cy="320" r="160" stroke="currentColor" strokeWidth="1.5" opacity="0.75" />
        <circle cx="0" cy="320" r="210" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <circle cx="0" cy="320" r="260" stroke="currentColor" strokeWidth="1.5" opacity="0.65" />
        <circle cx="0" cy="320" r="310" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      </svg>'''

new_arcs = '''      {/* Refined Architectural Concentric Arcs Motif with Curved Path Reveal */}
      <svg 
        className="absolute -bottom-6 -left-6 w-72 h-72 sm:w-88 sm:h-88 pointer-events-none text-[#C9A66B]/30 hidden md:block" 
        viewBox="0 0 320 320" 
        fill="none" 
        aria-hidden="true" 
      >
        <circle cx="0" cy="320" r="60" stroke="currentColor" strokeWidth="1.5" opacity="0.8" className="motion-path-reveal-loop" />
        <circle cx="0" cy="320" r="110" stroke="currentColor" strokeWidth="1.5" opacity="0.6" className="motion-path-reveal-loop" />
        <circle cx="0" cy="320" r="160" stroke="currentColor" strokeWidth="1.5" opacity="0.75" className="motion-path-reveal-loop" />
        <circle cx="0" cy="320" r="210" stroke="currentColor" strokeWidth="1.5" opacity="0.5" className="motion-path-reveal-loop" />
        <circle cx="0" cy="320" r="260" stroke="currentColor" strokeWidth="1.5" opacity="0.65" />
        <circle cx="0" cy="320" r="310" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      </svg>

      {/* Reusable Animated Dot Pattern in Top-Right of Section */}
      <div className="absolute top-6 right-8 pointer-events-none -z-0 opacity-50 hidden lg:block">
        <AnimatedDotPattern rows={4} cols={6} variant="gold" />
      </div>'''

if old_arcs in why:
    why = why.replace(old_arcs, new_arcs)
    # Add motion-card-hover to card links
    why = why.replace(
        "className=\"min-h-[44px] group flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#EDE2CF] shadow-subtle hover:border-[#C9A66B] hover:shadow-card transition-all duration-300 btn-tactile\"",
        "className=\"min-h-[44px] group flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#EDE2CF] shadow-subtle motion-card-hover btn-tactile\""
    )
    with open('src/components/WhyChooseUs.tsx', 'w', encoding='utf-8') as f:
        f.write(why)
    print("SUCCESS: Updated src/components/WhyChooseUs.tsx")
else:
    print("WARNING: Could not find old_arcs in WhyChooseUs.tsx")

# 4. Update src/pages/HomePage.tsx
with open('src/pages/HomePage.tsx', 'r', encoding='utf-8') as f:
    home = f.read()

if "AnimatedDotPattern" not in home:
    home = home.replace(
        "import { DualArrowButton } from '../components/animations';",
        "import { DualArrowButton, AnimatedDotPattern, RotatingGeometricMesh, FloatingGeometricShapes } from '../components/animations';"
    )

old_home_hero_sec = '<section className="bg-[#FFFCF5] pt-6 xs:pt-8 sm:pt-14 lg:pt-16 pb-10 sm:pb-16 lg:pb-16 border-b border-[#EDE2CF] relative overflow-hidden min-h-0 flex items-center">'
new_home_hero_sec = '''<section className="bg-[#FFFCF5] pt-6 xs:pt-8 sm:pt-14 lg:pt-16 pb-10 sm:pb-16 lg:pb-16 border-b border-[#EDE2CF] relative overflow-hidden min-h-0 flex items-center">
        {/* Subtle Decorative Animated Dot Pattern in Top-Left */}
        <div className="absolute top-4 left-6 pointer-events-none -z-0 opacity-50 hidden md:block">
          <AnimatedDotPattern rows={5} cols={5} variant="mixed" />
        </div>
        {/* Floating Ring Accent near Top Center */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none -z-0 opacity-40 hidden xl:block">
          <FloatingGeometricShapes type="cluster" size={90} />
        </div>'''

if old_home_hero_sec in home:
    home = home.replace(old_home_hero_sec, new_home_hero_sec)
    with open('src/pages/HomePage.tsx', 'w', encoding='utf-8') as f:
        f.write(home)
    print("SUCCESS: Updated src/pages/HomePage.tsx")
else:
    print("WARNING: Could not find old_home_hero_sec in HomePage.tsx")

# 5. Update src/pages/ServicesPage.tsx
with open('src/pages/ServicesPage.tsx', 'r', encoding='utf-8') as f:
    services = f.read()

if "AnimatedDotPattern" not in services:
    services = services.replace(
        "import { DualArrowButton } from '../components/animations';",
        "import { DualArrowButton, AnimatedDotPattern, FloatingGeometricShapes } from '../components/animations';"
    )

old_serv_sec = '<section className="py-12 bg-brand-surface/70 border-b border-brand-border scroll-mt-32" id="audit-spotlight-banner">'
new_serv_sec = '''<section className="py-12 bg-brand-surface/70 border-b border-brand-border scroll-mt-32 relative overflow-hidden" id="audit-spotlight-banner">
        {/* Decorative Animated Dot Pattern */}
        <div className="absolute top-4 right-6 pointer-events-none -z-0 opacity-40 hidden md:block">
          <AnimatedDotPattern rows={4} cols={5} variant="gold" />
        </div>'''

if old_serv_sec in services:
    services = services.replace(old_serv_sec, new_serv_sec)
    with open('src/pages/ServicesPage.tsx', 'w', encoding='utf-8') as f:
        f.write(services)
    print("SUCCESS: Updated src/pages/ServicesPage.tsx")
else:
    print("WARNING: Could not find old_serv_sec in ServicesPage.tsx")

# 6. Update src/pages/AuditAssurancePage.tsx
with open('src/pages/AuditAssurancePage.tsx', 'r', encoding='utf-8') as f:
    audit = f.read()

if "AnimatedDotPattern" not in audit:
    audit = audit.replace(
        "import { SEOHead } from '../components/SEOHead';",
        "import { SEOHead } from '../components/SEOHead';\nimport { AnimatedDotPattern, FloatingGeometricShapes } from '../components/animations';"
    )

old_audit_sec = '<section className="py-10 sm:py-16 md:py-20 lg:py-24 bg-[#FFFCF5] border-b border-[#EDE2CF]">'
new_audit_sec = '''<section className="py-10 sm:py-16 md:py-20 lg:py-24 bg-[#FFFCF5] border-b border-[#EDE2CF] relative overflow-hidden">
        {/* Decorative Animated Dot Pattern */}
        <div className="absolute top-8 right-8 pointer-events-none -z-0 opacity-45 hidden md:block">
          <AnimatedDotPattern rows={4} cols={6} variant="forest" />
        </div>'''

if old_audit_sec in audit:
    audit = audit.replace(old_audit_sec, new_audit_sec)
    with open('src/pages/AuditAssurancePage.tsx', 'w', encoding='utf-8') as f:
        f.write(audit)
    print("SUCCESS: Updated src/pages/AuditAssurancePage.tsx")
else:
    print("WARNING: Could not find old_audit_sec in AuditAssurancePage.tsx")

# 7. Update src/components/ContactForm.tsx
with open('src/components/ContactForm.tsx', 'r', encoding='utf-8') as f:
    contact = f.read()

if "AnimatedDotPattern" not in contact:
    contact = contact.replace(
        "import { CheckCircle2, AlertCircle, Send, ArrowRight, ShieldCheck, Clock, MapPin, Phone, Mail, MessageSquare } from 'lucide-react';",
        "import { CheckCircle2, AlertCircle, Send, ArrowRight, ShieldCheck, Clock, MapPin, Phone, Mail, MessageSquare } from 'lucide-react';\nimport { AnimatedDotPattern, FloatingGeometricShapes, CurvedPathReveal } from './animations';"
    )

old_contact_sec = '<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">'
new_contact_sec = '''{/* Decorative Elements */}
      <div className="absolute top-6 right-8 pointer-events-none -z-0 opacity-40 hidden lg:block">
        <AnimatedDotPattern rows={4} cols={6} variant="gold" />
      </div>
      <div className="absolute -bottom-10 -left-10 pointer-events-none -z-0 opacity-30 hidden md:block">
        <CurvedPathReveal variant="corner" width={220} height={220} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">'''

if old_contact_sec in contact:
    contact = contact.replace(old_contact_sec, new_contact_sec, 1)
    with open('src/components/ContactForm.tsx', 'w', encoding='utf-8') as f:
        f.write(contact)
    print("SUCCESS: Updated src/components/ContactForm.tsx")
else:
    print("WARNING: Could not find old_contact_sec in ContactForm.tsx")
