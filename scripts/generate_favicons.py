import base64
import os
from PIL import Image, ImageDraw

def main():
    logo_path = 'public/brand/ca-india-logo.png'
    if not os.path.exists(logo_path):
        print(f"Error: {logo_path} not found")
        return

    logo = Image.open(logo_path).convert('RGBA')
    print(f"Loaded logo: {logo.size}, mode: {logo.mode}")

    def make_icon(size):
        canvas = Image.new('RGBA', (size, size), (255, 255, 255, 0))
        draw = ImageDraw.Draw(canvas)
        
        # Rounded white squircle tile with subtle gold luxury border
        margin = max(1, int(size * 0.03))
        radius = int(size * 0.24)
        border_width = max(1, int(size * 0.04))
        
        draw.rounded_rectangle(
            [margin, margin, size - margin, size - margin],
            radius=radius,
            fill=(255, 255, 255, 255),
            outline=(180, 154, 100, 255),  # Antique Bronze #B49A64
            width=border_width
        )
        
        # Resize logo with generous padding so the CA India mark is crystal clear and centered
        pad = int(size * 0.12)
        target_w = size - 2 * pad
        target_h = int(target_w * (logo.height / logo.width))
        if target_h > (size - 2 * pad):
            target_h = size - 2 * pad
            target_w = int(target_h * (logo.width / logo.height))
        
        resized_logo = logo.resize((target_w, target_h), Image.Resampling.LANCZOS)
        pos_x = (size - target_w) // 2
        pos_y = (size - target_h) // 2
        
        canvas.paste(resized_logo, (pos_x, pos_y), resized_logo)
        return canvas

    # Generate PNG sizes
    sizes = [16, 32, 48, 96, 144, 192, 512]
    for sz in sizes:
        icon = make_icon(sz)
        out_path = f'public/favicon-{sz}x{sz}.png'
        icon.save(out_path, 'PNG', optimize=True)
        print(f"Saved: {out_path} ({sz}x{sz})")

    # Apple touch icon (180x180)
    apple_icon = make_icon(180)
    apple_icon.save('public/apple-touch-icon.png', 'PNG', optimize=True)
    print("Saved: public/apple-touch-icon.png (180x180)")

    # Multi-resolution ICO (16, 24, 32, 48, 64, 128, 256)
    ico_img = make_icon(256)
    ico_img.save(
        'public/favicon.ico',
        format='ICO',
        sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    )
    print("Saved: public/favicon.ico (Multi-size ICO)")

    # Generate SVG with embedded Base64 of the high-res 192px PNG
    with open('public/favicon-192x192.png', 'rb') as f:
        b64_png = base64.b64encode(f.read()).decode('utf-8')

    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <image href="data:image/png;base64,{b64_png}" x="0" y="0" width="64" height="64" preserveAspectRatio="xMidYMid meet"/>
</svg>
'''
    with open('public/favicon.svg', 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print("Saved: public/favicon.svg (with base64 embedded data URI)")

if __name__ == '__main__':
    main()
