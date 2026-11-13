import os
import glob
from PIL import Image

def compile_scroll_gif():
    frames_dir = 'reports/scroll_frames'
    files = sorted(glob.glob(os.path.join(frames_dir, 'scroll_frame_*.png')))
    if not files:
        print("No scroll frames found.")
        return

    images = []
    # Sample every frame, resize to 960x600 for high quality yet compact GIF
    for f in files:
        im = Image.open(f)
        w, h = im.size
        new_w = 960
        new_h = int(h * (new_w / w))
        im_resized = im.resize((new_w, new_h), Image.Resampling.LANCZOS)
        images.append(im_resized.convert('P', palette=Image.Palette.ADAPTIVE))

    out_path = 'reports/homepage_scroll_recording.gif'
    images[0].save(
        out_path,
        save_all=True,
        append_images=images[1:],
        duration=180,
        loop=0,
        optimize=True
    )
    print(f"Generated {out_path} ({os.path.getsize(out_path)} bytes) from {len(images)} frames.")

def create_responsive_comparison():
    # Load 1440px desktop, 768px tablet, and 390px mobile screenshots
    d_path = 'reports/screenshots/homepage_1440px.png'
    t_path = 'reports/color_redesign_after/after_homepage_768px.png'
    m_path = 'reports/screenshots/homepage_390px.png'

    if not (os.path.exists(d_path) and os.path.exists(t_path) and os.path.exists(m_path)):
        print("Comparison inputs not all found, skipping composite image.")
        return

    img_d = Image.open(d_path)
    img_t = Image.open(t_path)
    img_m = Image.open(m_path)

    # Scale them to common height 900px
    target_h = 900
    w_d = int(img_d.width * (target_h / img_d.height))
    w_t = int(img_t.width * (target_h / img_t.height))
    w_m = int(img_m.width * (target_h / img_m.height))

    res_d = img_d.resize((w_d, target_h), Image.Resampling.LANCZOS)
    res_t = img_t.resize((w_t, target_h), Image.Resampling.LANCZOS)
    res_m = img_m.resize((w_m, target_h), Image.Resampling.LANCZOS)

    gap = 24
    total_w = w_d + w_t + w_m + gap * 2
    canvas = Image.new('RGB', (total_w, target_h), color=(245, 241, 232))

    canvas.paste(res_d, (0, 0))
    canvas.paste(res_t, (w_d + gap, 0))
    canvas.paste(res_m, (w_d + gap + w_t + gap, 0))

    comp_path = 'reports/responsive_comparisons_grid.png'
    canvas.save(comp_path, optimize=True)
    print(f"Generated {comp_path} ({canvas.width}x{canvas.height}) successfully.")

if __name__ == '__main__':
    compile_scroll_gif()
    create_responsive_comparison()
