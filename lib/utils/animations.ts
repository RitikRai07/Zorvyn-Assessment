// Tailwind CSS animation utilities and helpers
// These utilities provide consistent animation patterns across the dashboard

/**
 * Animation timing values (in milliseconds)
 */
export const AnimationTiming = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 800,
} as const

/**
 * Animation directional classes
 * Usage: className={animateSlideIn('up', 'md')}
 */
export function animateSlideIn(direction: 'up' | 'down' | 'left' | 'right', delay?: 'sm' | 'md' | 'lg'): string {
  const directionMap = {
    up: 'animate-in slide-in-from-bottom',
    down: 'animate-in slide-in-from-top',
    left: 'animate-in slide-in-from-right',
    right: 'animate-in slide-in-from-left',
  }

  const delayMap = {
    sm: 'delay-75',
    md: 'delay-150',
    lg: 'delay-300',
  }

  return `${directionMap[direction]} ${delay ? delayMap[delay] : ''} duration-500`
}

/**
 * Animate fade in
 */
export function animateFadeIn(delay?: 'sm' | 'md' | 'lg'): string {
  const delayMap = {
    sm: 'delay-75',
    md: 'delay-150',
    lg: 'delay-300',
  }

  return `animate-in fade-in ${delay ? delayMap[delay] : ''} duration-300`
}

/**
 * Animate scale in
 */
export function animateScaleIn(delay?: 'sm' | 'md' | 'lg'): string {
  const delayMap = {
    sm: 'delay-75',
    md: 'delay-150',
    lg: 'delay-300',
  }

  return `animate-in zoom-in ${delay ? delayMap[delay] : ''} duration-400`
}

/**
 * Staggered animation for list items
 * Usage: children.map((item, i) => <div className={animateStagger(i)} />)
 */
export function animateStagger(index: number, baseDelay = 50): string {
  const delayMs = index * baseDelay
  const delayClass = getDelayClass(delayMs)
  return `animate-in slide-in-from-bottom ${delayClass} duration-500`
}

/**
 * Map delay milliseconds to Tailwind delay class
 */
function getDelayClass(ms: number): string {
  if (ms <= 75) return 'delay-75'
  if (ms <= 100) return 'delay-100'
  if (ms <= 150) return 'delay-150'
  if (ms <= 200) return 'delay-200'
  if (ms <= 300) return 'delay-300'
  if (ms <= 500) return 'delay-500'
  if (ms <= 700) return 'delay-700'
  return 'delay-1000'
}

/**
 * Pulse animation class
 */
export const PULSE_ANIMATION = 'animate-pulse'

/**
 * Shimmer animation (for skeleton/loading states)
 * Add to your Tailwind config: @keyframes shimmer { ... }
 */
export const SHIMMER_ANIMATION = 'animate-shimmer'

/**
 * Bounce animation
 */
export const BOUNCE_ANIMATION = 'animate-bounce'

/**
 * Spin animation
 */
export const SPIN_ANIMATION = 'animate-spin'

/**
 * Group hover animation utilities
 * These work with Tailwind's group modifier
 */
export const GroupHoverAnimations = {
  SCALE_UP: 'group-hover:scale-110 transition-transform duration-300',
  SCALE_DOWN: 'group-hover:scale-95 transition-transform duration-300',
  FADE_IN: 'group-hover:opacity-100 transition-opacity duration-300',
  ROTATE: 'group-hover:-rotate-6 transition-transform duration-300',
  LIFT: 'group-hover:-translate-y-2 transition-transform duration-300',
  GLOW: 'group-hover:shadow-lg transition-shadow duration-300',
} as const

/**
 * Hover effect utilities
 * Applied directly to interactive elements
 */
export const HoverEffects = {
  SCALE: 'hover:scale-105 transition-transform duration-300',
  LIFT: 'hover:-translate-y-1 transition-transform duration-300',
  GLOW: 'hover:shadow-lg transition-shadow duration-300',
  SHADOW: 'hover:shadow-2xl transition-shadow duration-300',
  COLOR: 'hover:bg-primary/10 transition-colors duration-300',
} as const

/**
 * Transition utilities for smooth property changes
 */
export const Transitions = {
  DEFAULT: 'transition-all duration-300',
  FAST: 'transition-all duration-150',
  SLOW: 'transition-all duration-500',
  COLOR: 'transition-colors duration-300',
  TRANSFORM: 'transition-transform duration-300',
  OPACITY: 'transition-opacity duration-300',
  SHADOW: 'transition-shadow duration-300',
  BACKGROUND: 'transition-colors duration-300',
} as const

/**
 * Combined animation and transition classes
 */
export const AnimationPresets = {
  CARD_HOVER: `hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`,
  BUTTON_HOVER: `hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200`,
  INPUT_FOCUS: `focus:ring-2 focus:ring-primary/50 focus:shadow-lg transition-all duration-200`,
  ICON_HOVER: `hover:scale-125 hover:rotate-12 transition-all duration-300`,
  SMOOTH_TRANSITION: `transition-all duration-300 ease-in-out`,
} as const

/**
 * CSS keyframe definitions (add to your Tailwind config)
 * These provide custom animations beyond Tailwind defaults
 */
export const CustomKeyframes = {
  shimmer: `
    @keyframes shimmer {
      0% {
        background-position: -1000px 0;
      }
      100% {
        background-position: 1000px 0;
      }
    }
  `,
  glow: `
    @keyframes glow {
      0%, 100% {
        box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
      }
      50% {
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
      }
    }
  `,
  slideUp: `
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  fadeInScale: `
    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `,
  pulse: `
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  `,
} as const
