with open('src/index.css', 'r', encoding='utf-8') as f:
    content = f.read()

target = '/* 5. Restrained Card Hover & Micro-Interactions */'

advanced_keyframes = '''/* Staggered Dot Wave Animation */
@keyframes motionDotWave {
  0%, 100% {
    opacity: 0.25;
    transform: translateY(0) scale(0.95);
  }
  50% {
    opacity: 0.95;
    transform: translateY(-3px) scale(1.12);
  }
}
.motion-dot-wave-1 { animation: motionDotWave 3.5s ease-in-out infinite; will-change: opacity, transform; }
.motion-dot-wave-2 { animation: motionDotWave 3.5s ease-in-out infinite; animation-delay: 0.7s; will-change: opacity, transform; }
.motion-dot-wave-3 { animation: motionDotWave 3.5s ease-in-out infinite; animation-delay: 1.4s; will-change: opacity, transform; }
.motion-dot-wave-4 { animation: motionDotWave 3.5s ease-in-out infinite; animation-delay: 2.1s; will-change: opacity, transform; }

/* Organic Rotating Mesh with Scale Breathing */
@keyframes motionSpinMeshOrganic {
  0% { transform: rotate(0deg) scale(0.98); }
  50% { transform: rotate(180deg) scale(1.02); }
  100% { transform: rotate(360deg) scale(0.98); }
}
.motion-spin-mesh-organic {
  animation: motionSpinMeshOrganic 36s linear infinite;
  transform-origin: center center;
  will-change: transform;
}

/* Hero Section Subtle Floating Vertical Movement */
@keyframes motionFloatHero {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
.motion-float-hero {
  animation: motionFloatHero 6s cubic-bezier(0.45, 0, 0.55, 1) infinite;
  will-change: transform;
}

/* Thin Pulsing Circular Outline */
@keyframes motionPulseRing {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.04); opacity: 0.65; }
}
.motion-pulse-ring {
  animation: motionPulseRing 8s ease-in-out infinite;
  transform-origin: center center;
  will-change: transform, opacity;
}

/* Process Timeline Connecting Line Reveal */
@keyframes motionLineDraw {
  0% { transform: scaleY(0); }
  100% { transform: scaleY(1); }
}
.motion-timeline-spine {
  transform-origin: top center;
  animation: motionLineDraw 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  will-change: transform;
}

/* 5. Restrained Card Hover & Micro-Interactions */
.motion-card-lift {
  transition: transform 280ms cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 280ms cubic-bezier(0.16, 1, 0.3, 1),
              border-color 280ms ease;
  will-change: transform, box-shadow;
}
.motion-card-lift:hover {
  transform: translateY(-4px);
  border-color: #C9A66B;
  box-shadow: 0 14px 28px -8px rgba(37, 75, 56, 0.12), 0 6px 12px -4px rgba(201, 166, 107, 0.15);
}

.motion-icon-hover {
  transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}
.group:hover .motion-icon-hover {
  transform: scale(1.1) rotate(3deg);
}

.motion-arrow-hover {
  transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}
.group:hover .motion-arrow-hover {
  transform: translate(3px, -3px);
}
'''

if target in content:
    content = content.replace(target, advanced_keyframes, 1)
    
    # Also update reduced motion list to include the new classes
    reduced_target = '.motion-card-hover {'
    reduced_replacement = '''.motion-dot-wave-1,
  .motion-dot-wave-2,
  .motion-dot-wave-3,
  .motion-dot-wave-4,
  .motion-spin-mesh-organic,
  .motion-float-hero,
  .motion-pulse-ring,
  .motion-timeline-spine,
  .motion-card-lift,
  .motion-icon-hover,
  .motion-arrow-hover,
  .motion-card-hover {'''
    content = content.replace(reduced_target, reduced_replacement, 1)
    
    with open('src/index.css', 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS: Advanced keyframes and micro-interactions added to src/index.css")
else:
    print("WARNING: target not found in src/index.css")
