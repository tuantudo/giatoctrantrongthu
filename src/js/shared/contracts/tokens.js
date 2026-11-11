/**
 * GIATOC SHARED CONTRACTS — tokens.js
 * JavaScript mirror of the design token contract.
 *
 * CSS custom properties cannot be evaluated inside CSS media queries, so
 * breakpoint values live here for JavaScript runtime decisions and in tokens.css
 * for stylesheet rules.
 */

export const breakpoints = Object.freeze({
  xs: 375,
  sm: 768,
  md: 1024,
  lg: 1440
});

/**
 * Coarse label for the current viewport width — used to explain layout in QA and adaptive logic.
 *
 * @param {number} [width] Viewport width in pixels (defaults to window.innerWidth if available).
 * @returns {'xs'|'sm'|'md'|'lg'}
 */
export function viewportClass(width) {
  const w = typeof width === 'number'
    ? width
    : (typeof window !== 'undefined' && window.innerWidth ? window.innerWidth : breakpoints.lg);

  if (w <= breakpoints.xs) return 'xs';
  if (w <= breakpoints.sm) return 'sm';
  if (w <= breakpoints.md) return 'md';
  return 'lg';
}

/**
 * Typography contract definitions.
 *
 * active: 'site' — Times New Roman + system sans, matching the live public site.
 * proposed: Georgia / Segoe UI alternate stack.
 */
export const typography = Object.freeze({
  active: 'site',
  available: Object.freeze({
    site: 'site',
    proposed: 'proposed'
  })
});

/**
 * Dynamically toggle the typography stack via data-typography on document root.
 *
 * @param {'site'|'proposed'} choice
 * @returns {string} The activated typography choice.
 */
export function setTypographyStack(choice) {
  const value = typography.available[choice] ? choice : typography.active;
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.dataset.typography = value;
  }
  return value;
}

