import os

posts_dir = 'content/posts'
print('=== BLOG POST AUDIT ===')
for f in os.listdir(posts_dir):
    if f.endswith('.md'):
        p = os.path.join(posts_dir, f)
        with open(p, 'r', encoding='utf-8') as fh:
            txt = fh.read()
            lines = txt.split('\n')
            title = ''
            excerpt = ''
            cover = ''
            author = ''
            published = True
            for l in lines:
                if l.startswith('title:'): title = l.split(':', 1)[1].strip().strip('"\'')
                if l.startswith('excerpt:'): excerpt = l.split(':', 1)[1].strip().strip('"\'')
                if l.startswith('coverImage:'): cover = l.split(':', 1)[1].strip().strip('"\'')
                if l.startswith('author:'): author = l.split(':', 1)[1].strip().strip('"\'')
                if l.startswith('published:'): published = 'true' in l.lower()
            
            cover_exists = os.path.exists(os.path.join('public', cover.lstrip('/'))) if cover else False
            word_count = len(excerpt.split())
            print(f'File: {f}')
            print(f'  Title: {title[:50]}...')
            print(f'  Published: {published}')
            print(f'  Author: {author}')
            print(f'  Excerpt: {word_count} words -> "{excerpt[:60]}..."')
            print(f'  Cover Image: {cover} (Exists on disk: {cover_exists})')
            print()
