with open('src/index.css', 'r', encoding='utf-8') as f:
    content = f.read()

target = '''/* =========================================================================
   Accessibility: Reduced Motion Overrides
   ========================================================================= */'''

new_motion_css = '''/* =========================================================================
   Premium Motion Design System (Kavitha & Associates)
   GPU-Accelerated, Accessible, Lightweight CSS Keyframes
   ========================================================================= */

/* 1. Animated Dot Pattern: Gentle Opacity Variation & Subtle Micro-Drift */
@keyframes motionDotPulse {
  0%, 100% {
    opacity: 0.35;
    transform: translateY(0) scale(1);
  }
  50% {
    opacity: 0.85;
    transform: translateY(-2px) scale(1.08);
  }
}

.motion-dot-pulse {
  animation: motionDotPulse 4.5s ease-in-out infinite;
  will-change: opacity, transform;
}

.motion-dot-pulse-delayed {
  animation: motionDotPulse 4.5s ease-in-out infinite;
  animation-delay: 2.25s;
  will-change: opacity, transform;
}

.motion-dot-pulse-alt {
  animation: motionDotPulse 5.5s ease-in-out infinite;
  animation-delay: 1.2s;
  will-change: opacity, transform;
}

/* 2. Rotating Geometric Mesh: Slow, Continuous 38s & 44s Linear Cycles */
@keyframes motionSpinMesh {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.motion-spin-mesh {
  animation: motionSpinMesh 38s linear infinite;
  transform-origin: center center;
  will-change: transform;
}

.motion-spin-mesh-reverse {
  animation: motionSpinMesh 44s linear infinite reverse;
  transform-origin: center center;
  will-change: transform;
}

/* 3. Floating Geometric Shapes: Restrained Organic Vertical Drift */
@keyframes motionFloatSubtle {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-5px) rotate(1.5deg);
  }
}

.motion-float-subtle {
  animation: motionFloatSubtle 6.5s ease-in-out infinite;
  will-change: transform;
}

.motion-float-subtle-reverse {
  animation: motionFloatSubtle 8s ease-in-out infinite reverse;
  will-change: transform;
}

/* 4. Curved Path Reveal: Stroke-Dash Animation for Decorative Arcs */
@keyframes motionPathRevealLoop {
  0% {
    stroke-dashoffset: 700;
    opacity: 0.2;
  }
  50% {
    stroke-dashoffset: 0;
    opacity: 0.75;
  }
  100% {
    stroke-dashoffset: -700;
    opacity: 0.2;
  }
}

.motion-path-reveal-loop {
  stroke-dasharray: 700;
  stroke-dashoffset: 700;
  animation: motionPathRevealLoop 14s ease-in-out infinite;
  will-change: stroke-dashoffset, opacity;
}

/* 5. Restrained Card Hover & Micro-Interactions */
.motion-card-hover {
  transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 320ms cubic-bezier(0.16, 1, 0.3, 1),
              border-color 320ms ease;
  will-change: transform, box-shadow;
}

.motion-card-hover:hover {
  transform: translateY(-3px);
  border-color: #C9A66B;
  box-shadow: 0 10px 24px -6px rgba(53, 107, 80, 0.08), 0 4px 8px -2px rgba(201, 166, 107, 0.12);
}

/* Pause continuous rotations on mobile (< 768px) */
@media (max-width: 767px) {
  .motion-spin-mesh,
  .motion-spin-mesh-reverse {
    animation-play-state: paused !important;
  }
}

/* =========================================================================
   Accessibility: Reduced Motion Overrides
   ========================================================================= */'''

if target in content:
    content = content.replace(target, new_motion_css)
    
    # Also update reduced motion block to cancel these animations
    reduced_target = '''  .service-curtain-body {
    grid-template-rows: 1fr !important;
    opacity: 1 !important;
    transition: none !important;
  }'''
  
    reduced_replacement = '''  .service-curtain-body {
    grid-template-rows: 1fr !important;
    opacity: 1 !important;
    transition: none !important;
  }
  .motion-dot-pulse,
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
  
    content = content.replace(reduced_target, reduced_replacement)
    with open('src/index.css', 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS: Added motion CSS to src/index.css")
else:
    print("ERROR: Target not found in src/index.css")
