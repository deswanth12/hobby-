# 1. WhyChooseUs.tsx
with open('src/components/WhyChooseUs.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
if "import { AnimatedDotPattern }" not in content:
    content = "import { AnimatedDotPattern } from './animations';\n" + content
    with open('src/components/WhyChooseUs.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed WhyChooseUs.tsx")

# 2. HomePage.tsx
with open('src/pages/HomePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace(
    "import { DualArrowButton, SectorMarquee, AccentTicker } from '../components/animations';",
    "import { DualArrowButton, SectorMarquee, AccentTicker, AnimatedDotPattern, RotatingGeometricMesh, FloatingGeometricShapes } from '../components/animations';"
)
with open('src/pages/HomePage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed HomePage.tsx")

# 3. ServicesPage.tsx
with open('src/pages/ServicesPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace(
    "import { DualArrowButton } from '../components/animations/DualArrowButton';",
    "import { DualArrowButton } from '../components/animations/DualArrowButton';\nimport { AnimatedDotPattern } from '../components/animations';"
)
with open('src/pages/ServicesPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed ServicesPage.tsx")

# 4. AuditAssurancePage.tsx
with open('src/pages/AuditAssurancePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace(
    "import { AnimatedDotPattern, FloatingGeometricShapes } from '../components/animations';",
    "import { AnimatedDotPattern } from '../components/animations';"
)
with open('src/pages/AuditAssurancePage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed AuditAssurancePage.tsx")
