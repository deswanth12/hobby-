import re

files = ['GSTServicesPage.tsx', 'CompanyRegistrationPage.tsx', 'RERAConsultantPage.tsx', 'VirtualCFOPage.tsx']
for f in files:
    with open(f'src/pages/{f}', 'r', encoding='utf-8') as file:
        content = file.read()
    
    # search around LetterReveal
    lines = content.splitlines()
    for i, l in enumerate(lines):
        if 'LetterReveal' in l and i > 50:
            print(f"=== {f} around line {i+1} ===")
            for j in range(max(0, i-4), min(len(lines), i+6)):
                print(f"{j+1}: {lines[j]}")
            break
