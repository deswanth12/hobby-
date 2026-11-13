#!/usr/bin/env python3
"""
Project V4.8: Image Restoration and Optimization Pipeline
Restores and optimizes authentic Indian professional photography for Kavitha & Associates.
"""

import os
import shutil
from PIL import Image, ImageEnhance
import numpy as np

def grade_and_save(src_path, dest_paths, target_size=(1280, 720), warm_tint=(248, 239, 223), tint_factor=0.035, quality=90):
    print(f"Processing: {src_path} -> {dest_paths[0]}...")
    with Image.open(src_path) as im:
        im = im.convert('RGB')
        
        # Center-crop to target aspect ratio
        target_ratio = target_size[0] / target_size[1]
        curr_ratio = im.size[0] / im.size[1]
        
        if abs(curr_ratio - target_ratio) > 0.005:
            if curr_ratio > target_ratio:
                # too wide
                new_w = int(im.size[1] * target_ratio)
                left = (im.size[0] - new_w) // 2
                im = im.crop((left, 0, left + new_w, im.size[1]))
            else:
                # too tall
                new_h = int(im.size[0] / target_ratio)
                top = (im.size[1] - new_h) // 2
                im = im.crop((0, top, im.size[0], top + new_h))
                
        # Resize using high quality Lanczos filter
        im = im.resize(target_size, Image.Resampling.LANCZOS)
        
        # Subtle lighting & contrast enhancements
        im = ImageEnhance.Brightness(im).enhance(1.03)
        im = ImageEnhance.Contrast(im).enhance(1.05)
        im = ImageEnhance.Color(im).enhance(1.04)
        im = ImageEnhance.Sharpness(im).enhance(1.15)
        
        # Subtle warm tint blend matching the #F8EFDF palette
        arr = np.array(im).astype(float)
        tint = np.array(warm_tint).astype(float)
        arr = arr * (1.0 - tint_factor) + tint * tint_factor
        arr = np.clip(arr, 0, 255).astype(np.uint8)
        graded = Image.fromarray(arr)
        
        for dp in dest_paths:
            os.makedirs(os.path.dirname(dp), exist_ok=True)
            graded.save(dp, 'WEBP', quality=quality, method=6)
            print(f"  -> Saved {dp} ({target_size[0]}x{target_size[1]}, size: {os.path.getsize(dp)} bytes)")

def main():
    mappings = [
        # 1. Primary consultation image: 16:9 ratio
        {
            'src': 'public/brand/chambers/chamber-consultation.jpeg',
            'dest': [
                'public/images/about/consultation-main.webp',
                'dist/images/about/consultation-main.webp'
            ],
            'size': (1280, 720), # 16:9
            'tint_factor': 0.035
        },
        # 2. Supporting 1: Financial documents review (balanced 3:2 ratio)
        {
            'src': 'public/brand/process/step-02-strategy.webp',
            'dest': [
                'public/images/about/document-review.webp',
                'dist/images/about/document-review.webp'
            ],
            'size': (1200, 800), # 3:2 balanced
            'tint_factor': 0.035
        },
        # 3. Supporting 2: Executive corporate advisory (balanced 3:2 ratio)
        {
            'src': 'public/brand/process/step-04-advisory.webp',
            'dest': [
                'public/images/about/office-space.webp',
                'dist/images/about/office-space.webp'
            ],
            'size': (1200, 800), # 3:2 balanced
            'tint_factor': 0.035
        },
        # 4. Leadership space / Pan-India environment (16:9)
        {
            'src': 'public/brand/chambers/chamber-workstations.jpeg',
            'dest': [
                'public/images/about/leadership-space.webp',
                'dist/images/about/leadership-space.webp'
            ],
            'size': (1280, 720),
            'tint_factor': 0.030
        },
        # 5. Chamber interior / Library (16:9)
        {
            'src': 'public/brand/chambers/chamber-library.jpeg',
            'dest': [
                'public/images/about/office-interior.webp',
                'dist/images/about/office-interior.webp'
            ],
            'size': (1280, 720),
            'tint_factor': 0.030
        },
        # 6. Why Choose Us: Arched Senior Advisory Consultation (16:9)
        {
            'src': 'public/brand/process/step-01-consultation.webp',
            'dest': [
                'public/images/why-choose-us/consultation.webp',
                'dist/images/why-choose-us/consultation.webp'
            ],
            'size': (1280, 720),
            'tint_factor': 0.035
        },
        # 7. Why Choose Us: Financial Scrutiny & Analysis Companion (3:2 balanced)
        {
            'src': 'public/brand/process/step-02-strategy.webp',
            'dest': [
                'public/images/why-choose-us/analysis.webp',
                'dist/images/why-choose-us/analysis.webp'
            ],
            'size': (1200, 800),
            'tint_factor': 0.035
        },
        # 8. Working Process Step 01: Understanding Needs (16:9)
        {
            'src': 'public/brand/process/step-01-consultation.webp',
            'dest': [
                'public/images/working-process/understanding.webp',
                'dist/images/working-process/understanding.webp'
            ],
            'size': (1280, 720),
            'tint_factor': 0.035
        },
        # 9. Working Process Step 02: Planning & Strategy (16:9)
        {
            'src': 'public/brand/process/step-02-strategy.webp',
            'dest': [
                'public/images/working-process/planning.webp',
                'dist/images/working-process/planning.webp'
            ],
            'size': (1280, 720),
            'tint_factor': 0.035
        },
        # 10. Working Process Step 03: Execution (16:9)
        {
            'src': 'public/brand/process/step-03-execution.webp',
            'dest': [
                'public/images/working-process/execution.webp',
                'dist/images/working-process/execution.webp'
            ],
            'size': (1280, 720),
            'tint_factor': 0.035
        },
        # 11. Working Process Step 04: Ongoing Support (16:9)
        {
            'src': 'public/brand/process/step-04-advisory.webp',
            'dest': [
                'public/images/working-process/ongoing-support.webp',
                'dist/images/working-process/ongoing-support.webp'
            ],
            'size': (1280, 720),
            'tint_factor': 0.035
        },
        # 12. Contact Consultation (16:9)
        {
            'src': 'public/brand/process/step-01-consultation.webp',
            'dest': [
                'public/images/contact/consultation.webp',
                'dist/images/contact/consultation.webp'
            ],
            'size': (1280, 720),
            'tint_factor': 0.035
        }
    ]

    for m in mappings:
        grade_and_save(
            src_path=m['src'],
            dest_paths=m['dest'],
            target_size=m['size'],
            tint_factor=m.get('tint_factor', 0.035)
        )

    print("\nAll target images successfully restored and optimized!")

if __name__ == '__main__':
    main()
