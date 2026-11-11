/**
 * GIATOC SHARED UTILITIES — formatting.js
 * Text normalization and display formatting helpers.
 */

/**
 * Text or null-safe fallback.
 * Keeps "no data" honest instead of printing garbage like "[object Object]", "null", "undefined".
 *
 * @param {*} value
 * @returns {string|null} Clean string or null if empty/invalid.
 */
export function textOrNull(value) {
  if (value === null || value === undefined) return null;
  const str = typeof value === 'object' ? '' : String(value).trim();
  if (!str || str === '[object Object]' || str === 'null' || str === 'undefined') return null;
  return str;
}

/**
 * Initials for avatars. Purely presentational, derived from a person's display name.
 *
 * @param {string} name
 * @returns {string} 1-character uppercase initial or '?' fallback.
 */
export function initials(name) {
  const clean = textOrNull(name);
  if (!clean) return '?';
  const parts = clean.split(/\s+/).filter(Boolean);
  const tail = parts[parts.length - 1] || '';
  return (tail.charAt(0) || clean.charAt(0)).toUpperCase();
}

