with open('src/pages/HomePage.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

if "import { WhyChooseUs } from '../components/WhyChooseUs';" not in text:
    text = text.replace(
        "import { AboutSection } from '../components/AboutSection';",
        "import { AboutSection } from '../components/AboutSection';\nimport { WhyChooseUs } from '../components/WhyChooseUs';"
    )

if "<WhyChooseUs />" not in text:
    text = text.replace(
        "<AboutSection showReadMore={true} />",
        "<AboutSection showReadMore={true} />\n\n      {/* =========================================================================\n          WHY CHOOSE US SECTION (Editorial Layout Inspired by CARVI)\n          ========================================================================= */}\n      <WhyChooseUs />"
    )

with open('src/pages/HomePage.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Mounted WhyChooseUs in HomePage.tsx!")
