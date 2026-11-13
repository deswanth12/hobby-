import os
import glob
from PIL import Image

def compile_hero_gif():
    frames_dir = 'reports/hero_frames'
    files = sorted(glob.glob(os.path.join(frames_dir, 'hero_frame_*.png')))
    if not files:
        print("No hero frames found.")
        return

    images = []
    for f in files:
        im = Image.open(f)
        w, h = im.size
        new_w = 960
        new_h = int(h * (new_w / w))
        im_resized = im.resize((new_w, new_h), Image.Resampling.LANCZOS)
        images.append(im_resized.convert('P', palette=Image.Palette.ADAPTIVE))

    out_path = 'reports/hero_kinetic_motion.gif'
    images[0].save(
        out_path,
        save_all=True,
        append_images=images[1:],
        duration=200,
        loop=0,
        optimize=True
    )
    print(f"Generated {out_path} ({os.path.getsize(out_path)} bytes) from {len(images)} frames.")

if __name__ == '__main__':
    compile_hero_gif()
