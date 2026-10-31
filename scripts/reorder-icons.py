with open('C:/kavitha ca/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

old_snippet = """    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />"""

new_snippet = """    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />"""

if old_snippet in text:
    text = text.replace(old_snippet, new_snippet)
    with open('C:/kavitha ca/index.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Updated successfully")
else:
    # normalize newlines and try
    text_norm = text.replace("\r\n", "\n")
    if old_snippet in text_norm:
        text_norm = text_norm.replace(old_snippet, new_snippet)
        with open('C:/kavitha ca/index.html', 'w', encoding='utf-8') as f:
            f.write(text_norm)
        print("Updated normalized successfully")
    else:
        print("Could not find snippet")
