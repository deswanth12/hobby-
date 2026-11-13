import os
import re

def refine_hero_section():
    path = "src/v8/components/home/HeroSection.tsx"
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    # Ensure ArchitecturalLines is imported
    if "ArchitecturalLines" not in code:
        code = code.replace(
            "import { DotGrid, OrbitalSphere, FlowingCurves, DecorativeLayer } from '../decorative';",
            "import { DotGrid, OrbitalSphere, FlowingCurves, ArchitecturalLines, DecorativeLayer } from '../decorative';"
        )

    # Add ArchitecturalLines double-rule under the sub-headline
    if "Hero Double-Rule Accent" not in code:
        code = code.replace(
            "direct supervision of CA Kavitha Vijay (B.Com, CA, CMA AIR 49 ICMAI).\n            </p>",
            "direct supervision of CA Kavitha Vijay (B.Com, CA, CMA AIR 49 ICMAI).\n            </p>\n\n            {/* Hero Double-Rule Accent */}\n            <ArchitecturalLines type=\"double-rule\" variant=\"bronze\" length=\"100px\" className=\"my-4 opacity-60\" />"
        )

    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Refined HeroSection.tsx")

def refine_why_choose_us():
    path = "src/v8/components/home/WhyChooseUsSection.tsx"
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    # Replace OrbitalSphere import with ArchitecturalLines
    code = re.sub(
        r"import\s*\{\s*OrbitalSphere,\s*DotGrid,\s*DecorativeLayer\s*\}\s*from\s*'../decorative';",
        "import { DotGrid, ArchitecturalLines, DecorativeLayer } from '../decorative';",
        code
    )

    # Remove OrbitalSphere JSX block
    code = re.sub(
        r"<OrbitalSphere\s+size=\{380\}[\s\S]*?/>\s*",
        "",
        code
    )

    # Add ArchitecturalLines double-rule under description
    if "WhyChooseUs Double-Rule Accent" not in code:
        code = code.replace(
            "across India.\n          </p>",
            "across India.\n          </p>\n\n          {/* WhyChooseUs Double-Rule Accent */}\n          <ArchitecturalLines type=\"double-rule\" variant=\"bronze\" length=\"100px\" className=\"mt-3.5 opacity-60\" />"
        )

    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Refined WhyChooseUsSection.tsx (OrbitalSphere removed, ArchitecturalLines added)")

def refine_chambers_intake():
    path = "src/v8/components/home/ChambersIntakeSection.tsx"
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    # Replace OrbitalSphere import with ArchitecturalLines
    code = re.sub(
        r"import\s*\{\s*OrbitalSphere,\s*DotGrid,\s*DecorativeLayer\s*\}\s*from\s*'../decorative';",
        "import { DotGrid, ArchitecturalLines, DecorativeLayer } from '../decorative';",
        code
    )

    # Remove OrbitalSphere JSX block
    code = re.sub(
        r"<OrbitalSphere\s+size=\{420\}[\s\S]*?/>\s*",
        "",
        code
    )

    # Add ArchitecturalLines double-rule under invitation text
    if "Chambers Double-Rule Accent" not in code:
        code = code.replace(
            "practice desk in Tirupati.\n              </p>",
            "practice desk in Tirupati.\n              </p>\n\n              {/* Chambers Double-Rule Accent */}\n              <ArchitecturalLines type=\"double-rule\" variant=\"bronze\" length=\"90px\" className=\"my-3 opacity-60\" />"
        )

    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Refined ChambersIntakeSection.tsx (OrbitalSphere removed, ArchitecturalLines added)")

def refine_about_page():
    path = "src/v8/pages/AboutPage.tsx"
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    # Replace OrbitalSphere with ArchitecturalLines
    code = code.replace(
        "import { OrbitalSphere, DotGrid, DecorativeLayer } from '../components/decorative';",
        "import { DotGrid, ArchitecturalLines, DecorativeLayer } from '../components/decorative';"
    )

    # Remove OrbitalSphere JSX blocks
    code = re.sub(
        r"<OrbitalSphere\s+size=\{360\}[\s\S]*?/>\s*",
        "",
        code
    )

    # Add ArchitecturalLines double-rule in Hero
    if "About Hero Double-Rule Accent" not in code:
        code = code.replace(
            "supervision of CA Kavitha Vijay (B.Com, CA, CMA AIR 49 ICMAI).\n            </p>",
            "supervision of CA Kavitha Vijay (B.Com, CA, CMA AIR 49 ICMAI).\n            </p>\n\n            {/* About Hero Double-Rule Accent */}\n            <ArchitecturalLines type=\"double-rule\" variant=\"bronze\" length=\"100px\" className=\"my-3 opacity-60\" />"
        )

    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Refined AboutPage.tsx (OrbitalSphere removed, ArchitecturalLines added)")

def refine_contact_page():
    path = "src/v8/pages/ContactPage.tsx"
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    # Replace OrbitalSphere with ArchitecturalLines
    code = code.replace(
        "import { OrbitalSphere, DotGrid, DecorativeLayer } from '../components/decorative';",
        "import { DotGrid, ArchitecturalLines, DecorativeLayer } from '../components/decorative';"
    )

    # Remove OrbitalSphere JSX block
    code = re.sub(
        r"<OrbitalSphere\s+size=\{360\}[\s\S]*?/>\s*",
        "",
        code
    )

    # Add ArchitecturalLines double-rule under header description
    if "Contact Double-Rule Accent" not in code:
        code = code.replace(
            "Tirupati, Andhra Pradesh.\n            </p>",
            "Tirupati, Andhra Pradesh.\n            </p>\n\n            {/* Contact Double-Rule Accent */}\n            <ArchitecturalLines type=\"double-rule\" variant=\"bronze\" length=\"90px\" className=\"my-3 opacity-60\" />"
        )

    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Refined ContactPage.tsx (OrbitalSphere removed, ArchitecturalLines added)")

def refine_practice_areas():
    path = "src/v8/components/home/PracticeAreasSection.tsx"
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    if "ArchitecturalLines" not in code:
        code = code.replace(
            "import { DotGrid, SectionAccent, DecorativeLayer } from '../decorative';",
            "import { DotGrid, SectionAccent, ArchitecturalLines, DecorativeLayer } from '../decorative';"
        )

    if "Practice Areas Double-Rule Accent" not in code:
        code = code.replace(
            "direct oversight of CA Kavitha Vijay.\n            </p>",
            "direct oversight of CA Kavitha Vijay.\n            </p>\n\n            {/* Practice Areas Double-Rule Accent */}\n            <ArchitecturalLines type=\"double-rule\" variant=\"bronze\" length=\"100px\" className=\"my-3 opacity-60\" />"
        )

    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Refined PracticeAreasSection.tsx (ArchitecturalLines added)")

def refine_methodology():
    path = "src/v8/components/home/MethodologySection.tsx"
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    if "ArchitecturalLines" not in code:
        code = code.replace(
            "import { DotGrid, DecorativeLayer } from '../decorative';",
            "import { DotGrid, ArchitecturalLines, DecorativeLayer } from '../decorative';"
        )

    if "Methodology Double-Rule Accent" not in code:
        code = code.replace(
            "every statutory deliverable.\n            </p>",
            "every statutory deliverable.\n            </p>\n\n            {/* Methodology Double-Rule Accent */}\n            <ArchitecturalLines type=\"double-rule\" variant=\"bronze\" length=\"90px\" className=\"my-3 opacity-60\" />"
        )

    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Refined MethodologySection.tsx (ArchitecturalLines added)")

def refine_featured_insights():
    path = "src/v8/components/home/FeaturedInsightsSection.tsx"
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    if "ArchitecturalLines" not in code:
        code = code.replace(
            "import { DotGrid, DecorativeLayer } from '../decorative';",
            "import { DotGrid, ArchitecturalLines, DecorativeLayer } from '../decorative';"
        )

    if "Insights Double-Rule Accent" not in code:
        code = code.replace(
            "direct tax compliance frameworks.\n            </p>",
            "direct tax compliance frameworks.\n            </p>\n\n            {/* Insights Double-Rule Accent */}\n            <ArchitecturalLines type=\"double-rule\" variant=\"bronze\" length=\"100px\" className=\"my-3 opacity-60\" />"
        )

    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Refined FeaturedInsightsSection.tsx (ArchitecturalLines added)")

def refine_services_page():
    path = "src/v8/pages/ServicesPage.tsx"
    with open(path, "r", encoding="utf-8") as f:
        code = f.read()

    if "ArchitecturalLines" not in code:
        code = code.replace(
            "import { SectionAccent, DotGrid, DecorativeLayer } from '../components/decorative';",
            "import { SectionAccent, DotGrid, ArchitecturalLines, DecorativeLayer } from '../components/decorative';"
        )

    if "Services Header Double-Rule" not in code:
        code = code.replace(
            "supervision of CA Kavitha Vijay (B.Com, CA, CMA AIR 49 ICMAI).\n            </p>",
            "supervision of CA Kavitha Vijay (B.Com, CA, CMA AIR 49 ICMAI).\n            </p>\n\n            {/* Services Header Double-Rule */}\n            <ArchitecturalLines type=\"double-rule\" variant=\"bronze\" length=\"100px\" className=\"my-3 opacity-60\" />"
        )

    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Refined ServicesPage.tsx (ArchitecturalLines added)")

if __name__ == "__main__":
    refine_hero_section()
    refine_why_choose_us()
    refine_chambers_intake()
    refine_about_page()
    refine_contact_page()
    refine_practice_areas()
    refine_methodology()
    refine_featured_insights()
    refine_services_page()
    print("\nVisual Identity Balance Refinement applied successfully!")
