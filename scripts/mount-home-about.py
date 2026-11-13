with open('src/pages/HomePage.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

if "import { AboutSection } from '../components/AboutSection';" not in text:
    text = text.replace(
        "import { WorkingProcess } from '../components/WorkingProcess';",
        "import { WorkingProcess } from '../components/WorkingProcess';\nimport { AboutSection } from '../components/AboutSection';"
    )

if "<AboutSection showReadMore={true} />" not in text:
    text = text.replace(
        "<WorkingProcess />",
        "<WorkingProcess />\n\n      {/* =========================================================================\n          ABOUT US SECTION (Two-Column Editorial Collage & Value Overview)\n          ========================================================================= */}\n      <AboutSection showReadMore={true} />"
    )

with open('src/pages/HomePage.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Mounted AboutSection in HomePage.tsx successfully!")
