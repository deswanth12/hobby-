/**
 * Botanical Ledger Motion Design System Tokens (V8.2)
 *
 * Defines canonical timings, cubic-bezier easing curves, and color tokens
 * in strict alignment with R1 specifications and the Botanical Ledger visual identity.
 */

export const BOTANICAL_COLORS = {
  evergreen: '#071B14',
  forest: '#183529',
  botanical: '#294B39',
  bronze: '#B49A64',
  bronzeDark: '#7E5E1E', // WCAG AA text on cream
  ivory: '#F1EBDD',
  ivoryCard: '#FAF7F0',
  walnut: '#35271F',
  sage: '#AAB4A0',
  mutedBorder: '#D8D0BE',
} as const;

export const MOTION_EASINGS = {
  // Botanical Ledger Primary Ease-Out: velvety deceleration with 0 overshoot
  standard: 'cubic-bezier(0.22, 1, 0.36, 1)',
  // Editorial Ease-Out: deep exponential deceleration for reveals & unmasks
  editorial: 'cubic-bezier(0.16, 1, 0.3, 1)',
  // Ambient Ease-In-Out: smooth breathing for continuous organic pulses
  ambient: 'cubic-bezier(0.45, 0, 0.55, 1)',
  // Restrained Micro-Interaction: crisp response for button presses and taps
  micro: 'cubic-bezier(0.4, 0, 0.2, 1)',
  // Mechanical linear
  linear: 'linear',
} as const;

export const MOTION_DURATIONS = {
  // Interface & micro-interaction feedback (160ms – 320ms)
  microTap: 140,
  microFast: 180,
  microBase: 240,
  microHover: 280,
  microSlow: 320,

  // Text, section & component entrances (450ms – 750ms)
  entranceFast: 450,
  entranceBase: 550,
  entranceDeliberate: 650,
  entranceSlow: 750,

  // Decorative hairline line-drawings & statistic counters (900ms – 1600ms)
  lineDrawQuick: 900,
  lineDrawBase: 1100,
  lineDrawSlow: 1400,
  lineDrawExtended: 1600,
  counterBase: 1200,
  counterDeliberate: 1400,

  // Route page transitions (240ms – 280ms)
  pageTransition: 280,

  // Ambient & background motion (20s – 60s+)
  ambientPulse: 16000,
  ambientDrift: 22000,
  ambientSpin: 38000,
  ambientOrbitalSlow: 75000,
  ambientOrbitalReverse: 90000,
} as const;

export const MOTION_TOKENS = {
  colors: BOTANICAL_COLORS,
  easings: MOTION_EASINGS,
  durations: MOTION_DURATIONS,
} as const;

export default MOTION_TOKENS;
