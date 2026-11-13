def clean_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()

    # If there are \r\r\n or \r\n, normalize to \n first
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    
    # Check if alternate lines are empty
    lines = text.split('\n')
    # If the file has doubled empty lines throughout, clean it
    cleaned_lines = []
    prev_empty = False
    for line in lines:
        if line == '' and prev_empty:
            continue
        cleaned_lines.append(line)
        prev_empty = (line == '')

    cleaned_text = '\n'.join(cleaned_lines)
    with open(path, 'w', encoding='utf-8', newline='\r\n') as f:
        f.write(cleaned_text)
    print(f"Cleaned {path}: reduced from {len(lines)} to {len(cleaned_lines)} lines")

clean_file('src/pages/BlogPage.tsx')
clean_file('src/pages/BlogArticlePage.tsx')
