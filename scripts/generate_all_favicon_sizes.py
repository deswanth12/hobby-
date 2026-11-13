import os
from PIL import Image

def main():
    master_path = 'public/favicon-512x512.png'
    if not os.path.exists(master_path):
        print("Error: master favicon 512 not found")
        return

    master = Image.open(master_path).convert('RGBA')
    print(f"Master loaded: {master.size}")

    # Generate individual PNG sizes
    sizes = [16, 32, 48, 96, 144, 192]
    for sz in sizes:
        resized = master.resize((sz, sz), Image.Resampling.LANCZOS)
        out_path = f'public/favicon-{sz}x{sz}.png'
        resized.save(out_path, 'PNG', optimize=True)
        print(f"Saved: {out_path} ({sz}x{sz})")

    # Apple touch icon (180x180)
    apple = master.resize((180, 180), Image.Resampling.LANCZOS)
    apple.save('public/apple-touch-icon.png', 'PNG', optimize=True)
    print("Saved: public/apple-touch-icon.png (180x180)")

    # Multi-resolution ICO (16, 24, 32, 48, 64, 128, 256)
    ico_img = master.resize((256, 256), Image.Resampling.LANCZOS)
    ico_img.save(
        'public/favicon.ico',
        format='ICO',
        sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    )
    print("Saved: public/favicon.ico (Multi-size ICO)")

if __name__ == '__main__':
    main()
