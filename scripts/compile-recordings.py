import os
import glob
from PIL import Image

out_dir = 'reports/final_motion_audit'
art_dir = r'C:\Users\k deswanth\.gemini\antigravity\brain\441eee2e-7fd3-42ce-bd96-eec34be60162'
frames_dir = 'reports/final_motion_audit/frames'

def make_gif(pattern, out_name, duration=200):
    files = sorted(glob.glob(os.path.join(frames_dir, pattern)))
    if not files:
        print(f"No frames found for {pattern}")
        return
    
    images = []
    for f in files:
        im = Image.open(f)
        # Resize to 960 width for compact animated GIF delivery
        w, h = im.size
        new_w = 960
        new_h = int(h * (new_w / w))
        im_resized = im.resize((new_w, new_h), Image.Resampling.LANCZOS)
        images.append(im_resized.convert('P', palette=Image.Palette.ADAPTIVE))
    
    gif_path = os.path.join(out_dir, out_name)
    art_path = os.path.join(art_dir, out_name)
    
    images[0].save(
        gif_path,
        save_all=True,
        append_images=images[1:],
        duration=duration,
        loop=0,
        optimize=True
    )
    images[0].save(
        art_path,
        save_all=True,
        append_images=images[1:],
        duration=duration,
        loop=0,
        optimize=True
    )
    print(f"Generated {out_name} ({os.path.getsize(gif_path)} bytes) with {len(images)} frames.")

# Compile Hero Section Live Animation
make_gif('hero_frame_*.png', 'hero_live_motion.gif', duration=200)

# Compile About Section Live Animation
make_gif('about_frame_*.png', 'about_live_motion.gif', duration=200)

# Compile Process Section Live Animation
make_gif('process_frame_*.png', 'process_live_motion.gif', duration=200)
