/**
 * GIATOC DOMAIN CORE — editorial/scope.js
 * Pure business rules for discourse scope classification and partitioning.
 *
 * PURE DOMAIN LAYER — ZERO DOM, ZERO BROWSER GLOBALS, ZERO SIDE EFFECTS.
 *
 * [CLARA PRIVACY GOVERNANCE — CRITICAL MANDATE]
 * 1. Scope separation is an inviolable architectural boundary:
 *    - THƯ GỬI CLARA: Intimate, personal, private discourse.
 *    - MẠCH: Internal family intellectual and cultural discourse.
 *    - PUBLIC: External family institutional voice.
 * 2. Scope classification MUST rely strictly on explicit metadata.
 *    It must NEVER guess, speculate, or infer privacy status from title, body text,
 *    or author names.
 * 3. Any item lacking unambiguous metadata MUST be classified as `unattributed`,
 *    preventing accidental leakage into public or internal scopes.
 */

export const EDITORIAL_SCOPE = Object.freeze({
  CLARA: 'clara',
  MACH: 'mach',
  PUBLIC: 'public'
});

/**
 * Series-level hints recognized in the existing domain data artifacts.
 */
export const SERIES_SCOPE_MAP = Object.freeze({
  'thu-gui-clara': EDITORIAL_SCOPE.CLARA,
  clara: EDITORIAL_SCOPE.CLARA,
  'issue-01': EDITORIAL_SCOPE.MACH,
  mach: EDITORIAL_SCOPE.MACH
});

/**
 * Classifies an article into a discourse scope based strictly on explicit metadata.
 * Returns null if the item cannot be unambiguously classified.
 *
 * @param {Object} item Article record
 * @returns {string|null} 'clara' | 'mach' | 'public' | null
 */
export function classifyDiscourseScope(item) {
  if (!item || typeof item !== 'object') return null;

  // 1. Direct explicit discourseScope property on the record
  if (typeof item.discourseScope === 'string') {
    const scope = item.discourseScope.toLowerCase().trim();
    if (scope === EDITORIAL_SCOPE.CLARA) return EDITORIAL_SCOPE.CLARA;
    if (scope === EDITORIAL_SCOPE.MACH) return EDITORIAL_SCOPE.MACH;
    if (scope === EDITORIAL_SCOPE.PUBLIC) return EDITORIAL_SCOPE.PUBLIC;
  }

  // 2. Check series hints on explicit series fields
  const candidateIds = []
    .concat(item.seriesIds || [], item.seriesSlug || [], item.series || [], item.seriesId || [])
    .filter(Boolean)
    .map(v => String(v).toLowerCase().trim());

  for (const id of candidateIds) {
    if (SERIES_SCOPE_MAP[id]) {
      return SERIES_SCOPE_MAP[id];
    }
  }

  // 3. Strict privacy rule: if no explicit metadata matches, return null.
  // Never guess based on titles, keywords, or author names.
  return null;
}

/**
 * Partitions a collection or payload of articles into discourse buckets:
 * { clara: [], mach: [], unattributed: [] }
 *
 * @param {Object|Array<Object>} payloadOrStories Payload object or array of articles
 * @returns {{ clara: Array<Object>, mach: Array<Object>, unattributed: Array<Object> }}
 */
export function partitionByDiscourseScope(payloadOrStories) {
  let stories = [];
  let payloadScope = null;

  if (Array.isArray(payloadOrStories)) {
    stories = payloadOrStories;
  } else if (payloadOrStories && typeof payloadOrStories === 'object') {
    stories = payloadOrStories.stories || payloadOrStories.articles || [];
    if (typeof payloadOrStories.discourseScope === 'string') {
      payloadScope = payloadOrStories.discourseScope.toLowerCase().trim();
    }
  }

  const out = {
    [EDITORIAL_SCOPE.CLARA]: [],
    [EDITORIAL_SCOPE.MACH]: [],
    unattributed: []
  };

  for (const item of stories) {
    let scope = classifyDiscourseScope(item);

    // If item lacked individual series tag but container payload explicitly declared scope
    if (!scope && payloadScope) {
      if (payloadScope === EDITORIAL_SCOPE.CLARA || payloadScope === EDITORIAL_SCOPE.MACH) {
        scope = payloadScope;
      }
    }

    if (scope === EDITORIAL_SCOPE.CLARA) {
      out[EDITORIAL_SCOPE.CLARA].push(item);
    } else if (scope === EDITORIAL_SCOPE.MACH) {
      out[EDITORIAL_SCOPE.MACH].push(item);
    } else {
      out.unattributed.push(item);
    }
  }

  return out;
}

/**
 * Returns a human-readable nature label for a discourse scope or kind.
 *
 * @param {string} scopeOrKind Scope or kind key
 * @returns {string} Human-readable label
 */
export function getScopeKindLabel(scopeOrKind) {
  if (scopeOrKind === 'internal' || scopeOrKind === EDITORIAL_SCOPE.MACH) {
    return 'Diễn ngôn nội bộ của gia tộc';
  }
  if (scopeOrKind === 'intimate' || scopeOrKind === EDITORIAL_SCOPE.CLARA) {
    return 'Diễn ngôn cá nhân, riêng tư';
  }
  return 'Tiếng nói hướng ra bên ngoài';
}

