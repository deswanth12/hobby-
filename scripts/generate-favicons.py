from PIL import Image
import os

source_path = 'C:/kavitha ca/logo fo kavitha/b8e9e601-3e21-4ef3-93a7-5bd1e5fc927d.png'
im = Image.open(source_path)

# Crop to non-transparent bounding box
bbox = im.getbbox()
crop = im.crop(bbox)

# Make it a clean square canvas with 3% breathing room so circular edges don't touch the border
max_dim = max(crop.width, crop.height)
pad = int(max_dim * 0.03)
canvas_size = max_dim + 2 * pad

square_img = Image.new('RGBA', (canvas_size, canvas_size), (0, 0, 0, 0))
paste_x = (canvas_size - crop.width) // 2
paste_y = (canvas_size - crop.height) // 2
square_img.paste(crop, (paste_x, paste_y), crop)

public_dir = 'C:/kavitha ca/public'
dist_dir = 'C:/kavitha ca/dist'

sizes = {
    'favicon-16x16.png': (16, 16),
    'favicon-32x32.png': (32, 32),
    'favicon-48x48.png': (48, 48),     # Primary Google Search snippet size
    'favicon-96x96.png': (96, 96),     # 2x Google Search mobile retina
    'favicon-144x144.png': (144, 144), # 3x Google Search high-DPI
    'favicon-192x192.png': (192, 192), # Android Chrome / PWA
    'apple-touch-icon.png': (180, 180), # iOS Safari & Mobile Crawlers
    'favicon-512x512.png': (512, 512), # Schema.org Knowledge Graph & Splash
}

for filename, size in sizes.items():
    resized = square_img.resize(size, Image.Resampling.LANCZOS)
    resized.save(os.path.join(public_dir, filename), 'PNG', optimize=True)
    if os.path.exists(dist_dir):
        resized.save(os.path.join(dist_dir, filename), 'PNG', optimize=True)
    print(f'Generated {filename} ({size[0]}x{size[1]})')

# Generate multi-resolution favicon.ico containing 16x16, 32x32, and 48x48
ico_path_public = os.path.join(public_dir, 'favicon.ico')
square_img.save(
    ico_path_public,
    format='ICO',
    sizes=[(16, 16), (32, 32), (48, 48)]
)
if os.path.exists(dist_dir):
    square_img.save(
        os.path.join(dist_dir, 'favicon.ico'),
        format='ICO',
        sizes=[(16, 16), (32, 32), (48, 48)]
    )
print('Generated multi-resolution favicon.ico (16, 32, 48)')

print('All favicon assets generated successfully!')
