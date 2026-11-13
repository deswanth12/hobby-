with open('src/v8/pages/LeadershipPage.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("import { CrestMonogram } from '../components/common/CrestMonogram';\r\n", "")
text = text.replace("import { CrestMonogram } from '../components/common/CrestMonogram';\n", "")

with open('src/v8/pages/LeadershipPage.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print("Cleaned import successfully")
