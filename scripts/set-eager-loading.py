for path in ['src/pages/AboutPage.tsx', 'src/components/AboutSection.tsx']:
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    
    # Replace lazy with eager for about images
    text = text.replace(
        'src="/images/about/document-review.webp"\n                      alt="Financial document review and audit working papers"\n                      width="1200"\n                      height="669"\n                      loading="lazy"',
        'src="/images/about/document-review.webp"\n                      alt="Financial document review and audit working papers"\n                      width="1200"\n                      height="669"\n                      loading="eager"'
    )
    text = text.replace(
        'src="/images/about/office-space.webp"\n                      alt="Executive corporate strategy boardroom interior"\n                      width="1200"\n                      height="669"\n                      loading="lazy"',
        'src="/images/about/office-space.webp"\n                      alt="Executive corporate strategy boardroom interior"\n                      width="1200"\n                      height="669"\n                      loading="eager"'
    )
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"Updated {path}")
