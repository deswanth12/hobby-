with open('src/index.css', 'r', encoding='utf-8') as f:
    content = f.read()

target = '''  .motion-dot-pulse,
  .motion-dot-pulse-delayed,
  .motion-dot-pulse-alt,
  .motion-spin-mesh,
  .motion-spin-mesh-reverse,
  .motion-float-subtle,
  .motion-float-subtle-reverse,
  .motion-path-reveal-loop,
  .motion-card-hover {
    animation: none !important;
    transform: none !important;
    transition: none !important;
    stroke-dashoffset: 0 !important;
    opacity: 0.6 !important;
  }'''

replacement = '''  .motion-dot-pulse,
  .motion-dot-pulse-delayed,
  .motion-dot-pulse-alt,
  .motion-dot-wave-1,
  .motion-dot-wave-2,
  .motion-dot-wave-3,
  .motion-dot-wave-4,
  .motion-spin-mesh,
  .motion-spin-mesh-reverse,
  .motion-spin-mesh-organic,
  .motion-float-subtle,
  .motion-float-subtle-reverse,
  .motion-float-hero,
  .motion-pulse-ring,
  .motion-timeline-spine,
  .motion-path-reveal-loop,
  .motion-card-lift,
  .motion-icon-hover,
  .motion-arrow-hover,
  .motion-card-hover {
    animation: none !important;
    transform: none !important;
    transition: none !important;
    stroke-dashoffset: 0 !important;
    opacity: 0.6 !important;
  }'''

if target in content:
    content = content.replace(target, replacement, 1)
    with open('src/index.css', 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS: Fixed reduced motion overrides in src/index.css")
else:
    print("ERROR: Target not found")
