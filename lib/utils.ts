/**
 * Creates a throttled function that only invokes the provided function at most once per specified interval.
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Animation timing constants
 */
export const ANIMATION = {
  /** Duration for section transitions in ms */
  SECTION_TRANSITION: 1000,
  /** Scroll threshold for triggering navigation */
  SCROLL_THRESHOLD: 50,
  /** Throttle interval for scroll events in ms */
  SCROLL_THROTTLE: 100,
  /** Touch swipe threshold in pixels (reduced for mobile, but still requires velocity) */
  TOUCH_THRESHOLD: 40,
} as const;

/**
 * Section names for accessibility
 */
export const SECTION_NAMES = [
  'Hero',
  'Key Capabilities',
  'Pricing Plans',
  'Plan Comparison',
  'Get Started',
] as const;

