// ============================================================================
// Easing Functions
// ============================================================================

export type EasingFunction = (t: number) => number;

/**
 * Linear interpolation (no easing)
 */
export const linear: EasingFunction = (t) => t;

/**
 * Smooth ease in and out (cubic)
 */
export const easeInOutCubic: EasingFunction = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * Smooth ease in and out (quadratic) - subtler than cubic
 */
export const easeInOutQuad: EasingFunction = (t) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

/**
 * Ease out only (cubic) - starts fast, ends slow
 */
export const easeOutCubic: EasingFunction = (t) =>
  1 - Math.pow(1 - t, 3);

/**
 * Ease in only (cubic) - starts slow, ends fast
 */
export const easeInCubic: EasingFunction = (t) =>
  t * t * t;

/**
 * Smooth step - very smooth, no acceleration at edges
 */
export const smoothStep: EasingFunction = (t) =>
  t * t * (3 - 2 * t);

/**
 * Smoother step - even smoother than smoothStep
 */
export const smootherStep: EasingFunction = (t) =>
  t * t * t * (t * (t * 6 - 15) + 10);

// Default easing for camera transitions
export const defaultEasing = easeInOutCubic;
