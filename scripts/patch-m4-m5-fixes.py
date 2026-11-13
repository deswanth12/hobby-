import os

# 1. Patch BlogPage.tsx
with open('src/pages/BlogPage.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_part = 'Authored by <TextHighlight>CA Kavitha Vijay</TextHighlight> (B.Com, CA, CMA AIR 49)'
new_part = 'Authored by <TextHighlight>CA Kavitha Vijay</TextHighlight> (B.Com, CA [ICAI Mem. [REDACTED_MEMBERSHIP_NO]], CMA AIR 49)'
if old_part in text:
    text = text.replace(old_part, new_part)

old_link = '<Link to={`/blog/${featuredPost.slug}`} className="hover:text-[#102D25] transition-colors">'
new_link = '<Link to={`/blog/${featuredPost.slug}`} className="hover:text-[#102D25] transition-colors min-h-[44px] inline-block">'
if old_link in text:
    text = text.replace(old_link, new_link)

with open('src/pages/BlogPage.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('BlogPage.tsx patched')

# 2. Patch BlogArticlePage.tsx
with open('src/pages/BlogArticlePage.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_article_part = "Schedule a confidential chambers consultation with CA Kavitha Vijay to evaluate your organization's statutory audit schedules, tax filing positions, or internal controls framework."
new_article_part = "Schedule a confidential chambers consultation with CA Kavitha Vijay (B.Com, CA [ICAI Mem. [REDACTED_MEMBERSHIP_NO]], CMA AIR 49) to evaluate your organization's statutory audit schedules, tax filing positions, or internal controls framework."
if old_article_part in text:
    text = text.replace(old_article_part, new_article_part)

old_pill_primary = '''              <Link
                to="/contact"
                className="btn-pill-primary"
              >'''
new_pill_primary = '''              <Link
                to="/contact"
                className="btn-pill-primary min-h-[44px]"
              >'''
if old_pill_primary in text:
    text = text.replace(old_pill_primary, new_pill_primary)

old_pill_sec = '''              <a
                href={FIRM_DATA.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill-secondary"
              >'''
new_pill_sec = '''              <a
                href={FIRM_DATA.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill-secondary min-h-[44px]"
              >'''
if old_pill_sec in text:
    text = text.replace(old_pill_sec, new_pill_sec)

with open('src/pages/BlogArticlePage.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('BlogArticlePage.tsx patched')

# 3. Patch NotFoundPage.tsx
with open('src/pages/NotFoundPage.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_nf_1 = '''            <Link
              to="/"
              className="btn-pill-primary"
            >'''
new_nf_1 = '''            <Link
              to="/"
              className="btn-pill-primary min-h-[44px]"
            >'''
if old_nf_1 in text:
    text = text.replace(old_nf_1, new_nf_1)

old_nf_2 = '''            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-pill-secondary"
            >'''
new_nf_2 = '''            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-pill-secondary min-h-[44px]"
            >'''
if old_nf_2 in text:
    text = text.replace(old_nf_2, new_nf_2)

old_nf_3 = '''            <Link
              to="/contact"
              className="btn-pill-secondary"
            >'''
new_nf_3 = '''            <Link
              to="/contact"
              className="btn-pill-secondary min-h-[44px]"
            >'''
if old_nf_3 in text:
    text = text.replace(old_nf_3, new_nf_3)

with open('src/pages/NotFoundPage.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('NotFoundPage.tsx patched')

# 4. Patch ContactForm.tsx (literal https://wa.me/919626350900)
with open('src/components/ContactForm.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_target = "    const targetNumber = FIRM_DATA.contact.primaryPhoneClean || '919626350900';\n    return `https://wa.me/${targetNumber}?text=${encodeURIComponent(text)}`;"
new_target = "    return `https://wa.me/919626350900?text=${encodeURIComponent(text)}`;"
if old_target in text:
    text = text.replace(old_target, new_target)
else:
    # try CRLF
    old_target_crlf = "    const targetNumber = FIRM_DATA.contact.primaryPhoneClean || '919626350900';\r\n    return `https://wa.me/${targetNumber}?text=${encodeURIComponent(text)}`;"
    if old_target_crlf in text:
        text = text.replace(old_target_crlf, new_target)

with open('src/components/ContactForm.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('ContactForm.tsx patched')

# 5. Patch Footer.tsx
with open('src/components/Footer.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_f = '<p className="text-xs text-emerald-200/90 font-medium">B.Com, CA, CMA AIR 49</p>'
new_f = '<p className="text-xs text-emerald-200/90 font-medium">B.Com, CA (ICAI Mem. [REDACTED_MEMBERSHIP_NO]), CMA AIR 49</p>'
if old_f in text:
    text = text.replace(old_f, new_f)

with open('src/components/Footer.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Footer.tsx patched')

# 6. Patch index.html
with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

old_idx = '"description": "B.Com, CA, CMA (AIR 49)"'
new_idx = '"description": "B.Com, CA, CMA (AIR 49) | ICAI Mem. [REDACTED_MEMBERSHIP_NO]"'
if old_idx in text:
    text = text.replace(old_idx, new_idx)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
print('index.html patched')

# 7. Patch content/sections/about.json
with open('content/sections/about.json', 'r', encoding='utf-8') as f:
    text = f.read()

old_c = '"credentials": "B.Com, CA, CMA (AIR 49)",'
new_c = '"credentials": "B.Com, CA (ICAI Mem. [REDACTED_MEMBERSHIP_NO]), CMA (AIR 49)",'
if old_c in text:
    text = text.replace(old_c, new_c)

with open('content/sections/about.json', 'w', encoding='utf-8') as f:
    f.write(text)
print('about.json patched')
