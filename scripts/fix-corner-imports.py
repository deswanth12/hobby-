import re

files = [
    'src/pages/CompanyRegistrationPage.tsx',
    'src/pages/GSTServicesPage.tsx',
    'src/pages/IncomeTaxPage.tsx',
    'src/pages/LocationsPage.tsx',
    'src/pages/RERAConsultantPage.tsx',
    'src/pages/VirtualCFOPage.tsx'
]

for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        c = f.read()
    
    # Just import EditorialMarker if CornerBrackets isn't needed yet
    c = c.replace(
        "import { CornerBrackets, EditorialMarker } from '../components/architectural';",
        "import { EditorialMarker } from '../components/architectural';"
    )
    with open(fpath, 'w', encoding='utf-8', newline='\n') as f:
        f.write(c)

print("[OK] Cleaned imports to EditorialMarker")
