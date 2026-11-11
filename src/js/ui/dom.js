/**
 * GIATOC UI SYSTEM v0.2 — dom.js (Facade)
 * Safe DOM construction and formatting helpers facade.
 *
 * Re-exports from shared layer (`../shared/utils/dom-helpers.js` and `../shared/utils/formatting.js`).
 * Maintained for 100% backward compatibility with all existing UI components and tests.
 *
 * RULE (mission constraint #9): database/API values are NEVER written through
 * innerHTML. Everything here goes through createElement + textContent.
 */

export { el, frag, clear, mount } from '../shared/utils/dom-helpers.js';
export { textOrNull, initials } from '../shared/utils/formatting.js';
