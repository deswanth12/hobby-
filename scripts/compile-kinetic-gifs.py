import os
import glob
from PIL import Image

out_dir = 'reports/kinetic_typography'
art_dir = r'C:\Users\k deswanth\.gemini\antigravity\brain\441eee2e-7fd3-42ce-bd96-eec34be60162'
frames_dir = 'reports/kinetic_typography/frames'
reports_root = 'reports'

os.makedirs(out_dir, exist_ok=True)
try:
    os.makedirs(art_dir, exist_ok=True)
except Exception:
    pass

def make_gif(pattern, out_name, duration=180):
    files = sorted(glob.glob(os.path.join(frames_dir, pattern)))
    if not files:
        print(f"No frames found for pattern: {pattern}")
        return
    
    images = []
    for f in files:
        im = Image.open(f)
        w, h = im.size
        new_w = 960
        new_h = int(h * (new_w / w))
        im_resized = im.resize((new_w, new_h), Image.Resampling.LANCZOS)
        images.append(im_resized.convert('P', palette=Image.Palette.ADAPTIVE))
    
    paths = [
        os.path.join(out_dir, out_name),
        os.path.join(reports_root, out_name)
    ]
    if os.path.exists(art_dir):
        paths.append(os.path.join(art_dir, out_name))
    
    for p in paths:
        images[0].save(
            p,
            save_all=True,
            append_images=images[1:],
            duration=duration,
            loop=0,
            optimize=True
        )
    print(f"Generated {out_name} ({os.path.getsize(paths[0])} bytes) from {len(images)} frames.")

# Compile Animated GIFs
print("Compiling kinetic typography animated recordings...")
make_gif('hero_frame_*.png', 'hero_kinetic_motion.gif', duration=180)
make_gif('about_frame_*.png', 'about_kinetic_motion.gif', duration=180)
make_gif('services_frame_*.png', 'services_kinetic_motion.gif', duration=180)
make_gif('process_frame_*.png', 'process_kinetic_motion.gif', duration=180)
make_gif('why_choose_us_frame_*.png', 'why_choose_us_kinetic_motion.gif', duration=180)
make_gif('contact_frame_*.png', 'contact_kinetic_motion.gif', duration=180)
print("All animated kinetic typography GIFs generated successfully!")
