import os
from PIL import Image

def create_v4_responsive_grid():
    d_path = 'reports/v4_qa/v4_homepage_1440px_desktop.png'
    t_path = 'reports/v4_qa/v4_homepage_768px_tablet.png'
    m_path = 'reports/v4_qa/v4_homepage_390px_mobile.png'

    if not (os.path.exists(d_path) and os.path.exists(t_path) and os.path.exists(m_path)):
        print("V4 viewports not all found, skipping.")
        return

    img_d = Image.open(d_path)
    img_t = Image.open(t_path)
    img_m = Image.open(m_path)

    target_h = 900
    w_d = int(img_d.width * (target_h / img_d.height))
    w_t = int(img_t.width * (target_h / img_t.height))
    w_m = int(img_m.width * (target_h / img_m.height))

    res_d = img_d.resize((w_d, target_h), Image.Resampling.LANCZOS)
    res_t = img_t.resize((w_t, target_h), Image.Resampling.LANCZOS)
    res_m = img_m.resize((w_m, target_h), Image.Resampling.LANCZOS)

    gap = 20
    total_w = w_d + w_t + w_m + gap * 2
    canvas = Image.new('RGB', (total_w, target_h), color=(245, 241, 232))

    canvas.paste(res_d, (0, 0))
    canvas.paste(res_t, (w_d + gap, 0))
    canvas.paste(res_m, (w_d + gap + w_t + gap, 0))

    comp_path = 'reports/responsive_comparisons_grid.png'
    canvas.save(comp_path, optimize=True)
    print(f"Generated {comp_path} ({canvas.width}x{canvas.height}) successfully.")

if __name__ == '__main__':
    create_v4_responsive_grid()
