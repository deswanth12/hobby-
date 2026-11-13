with open('src/components/Footer.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

target = '<p className="text-xs text-emerald-200/90 font-medium">B.Com, CA (ICAI Mem. [REDACTED_MEMBERSHIP_NO]), CMA AIR 49</p>\n              <p className="text-xs text-emerald-300/80">Chartered &amp; Cost Accountant</p>'
replacement = '<p className="text-xs text-emerald-200/90 font-medium">B.Com, CA, CMA AIR 49</p>\n              <p className="text-xs text-emerald-300/80">ICAI Mem. [REDACTED_MEMBERSHIP_NO] · Chartered &amp; Cost Accountant</p>'

if target not in text:
    # try CRLF
    target_crlf = '<p className="text-xs text-emerald-200/90 font-medium">B.Com, CA (ICAI Mem. [REDACTED_MEMBERSHIP_NO]), CMA AIR 49</p>\r\n              <p className="text-xs text-emerald-300/80">Chartered &amp; Cost Accountant</p>'
    text = text.replace(target_crlf, replacement.replace('\n', '\r\n'))
else:
    text = text.replace(target, replacement)

with open('src/components/Footer.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Footer.tsx updated')
