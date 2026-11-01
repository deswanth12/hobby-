import re

with open('C:/kavatha ca/src/services/adminStorage.ts', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = r"headers:\s*\{\s*['\"]Content-Type['\"]:\s*['\"]application/json['\"],\s*\.\.\.\(session \? \{ ['\"]Authorization['\"]: `Bearer \$\{session\.token\}` \} : \{\}\)\s*\}"
text = re.sub(pattern, "headers: this.getAuthHeaders(true)", text)

text = re.sub(r"const session = this\.getSession\(\);\s*(?=fetch)", "", text)

with open('C:/kavatha ca/src/services/adminStorage.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print('Regex replacement complete')
