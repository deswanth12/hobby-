with open('src/components/Footer.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re
col2 = re.search(r'{\/\* Column 2: Practice Areas \*\/}.*?{\/\* Column 3:', text, re.DOTALL)
if col2:
    for line in col2.group(0).splitlines():
        if 'to=' in line:
            print(line)
