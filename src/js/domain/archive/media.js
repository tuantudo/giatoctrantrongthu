/**
 * GIATOC DOMAIN CORE — archive/media.js
 * Pure business logic and domain catalog operations for media assets and associations.
 *
 * PURE DOMAIN LAYER — ZERO DOM, ZERO BROWSER GLOBALS, ZERO SIDE EFFECTS.
 */

/**
 * Normalizes an arbitrary media input (Array, Object map, or Map) into an Array of media items.
 *
 * @param {Array|Object|Map} mediaInput Media items collection
 * @returns {Array<Object>} Flat array of media items
 */
export function normalizeMediaList(mediaInput) {
  if (!mediaInput) return [];
  if (Array.isArray(mediaInput)) return mediaInput.filter(Boolean);
  if (mediaInput instanceof Map) return Array.from(mediaInput.values()).filter(Boolean);
  if (typeof mediaInput === 'object') return Object.values(mediaInput).filter(Boolean);
  return [];
}

/**
 * Indexes media items into a plain dictionary keyed by asset ID.
 * Falls back to item.id if assetId is absent.
 *
 * @param {Array|Object|Map} mediaInput Collection of media items
 * @returns {Record<string, Object>} Dictionary of media items keyed by assetId
 */
export function indexMediaById(mediaInput) {
  const items = normalizeMediaList(mediaInput);
  const index = {};
  for (const item of items) {
    if (!item || typeof item !== 'object') continue;
    const key = item.assetId || item.id;
    if (key && typeof key === 'string') {
      index[key] = item;
    }
  }
  return index;
}

/**
 * Filters media items by specific media kind ('portrait', 'document', 'grave', 'milestone', 'family').
 * Comparison is case-insensitive.
 *
 * @param {Array|Object|Map} mediaInput Collection of media items
 * @param {string} kind Target media kind
 * @returns {Array<Object>} Filtered media items
 */
export function filterMediaByKind(mediaInput, kind) {
  if (!kind || typeof kind !== 'string') return [];
  const targetKind = kind.trim().toLowerCase();
  const items = normalizeMediaList(mediaInput);
  return items.filter(item => {
    if (!item || typeof item !== 'object') return false;
    const itemKind = (item.kind || '').trim().toLowerCase();
    return itemKind === targetKind;
  });
}

/**
 * Groups media items into standard kind buckets.
 *
 * @param {Array|Object|Map} mediaInput Collection of media items
 * @returns {{ portrait: Array, document: Array, grave: Array, milestone: Array, family: Array, other: Array }}
 */
export function groupMediaByKind(mediaInput) {
  const groups = {
    portrait: [],
    document: [],
    grave: [],
    milestone: [],
    family: [],
    other: []
  };

  const items = normalizeMediaList(mediaInput);
  for (const item of items) {
    if (!item || typeof item !== 'object') continue;
    const kind = (item.kind || '').trim().toLowerCase();
    if (groups[kind]) {
      groups[kind].push(item);
    } else {
      groups.other.push(item);
    }
  }

  return groups;
}

/**
 * Derives an assetId from a relationId format using heuristic mapping.
 * Example: 'PMR_I223_G1B5-W5Y' -> 'MEDIA_FS_G1B5-W5Y' (as in scripts/tools/test_media_assoc.py).
 * If the relationId is already in 'MEDIA_' format, it is returned directly.
 *
 * @param {string} relationId Relation identifier string
 * @returns {string|null} Derived assetId or null if unmappable
 */
export function deriveAssetIdFromRelationId(relationId) {
  if (!relationId || typeof relationId !== 'string') return null;
  const trimmed = relationId.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('MEDIA_')) {
    return trimmed;
  }

  const parts = trimmed.split('_');
  if (parts.length >= 3) {
    const mediaHash = parts[parts.length - 1];
    if (mediaHash) {
      return `MEDIA_FS_${mediaHash}`;
    }
  }

  return null;
}

/**
 * Resolves the target assetId from a person_media record.
 * Checks explicit assetId, mediaId, snake_case variants, and falls back to relationId heuristic.
 *
 * @param {Object} pmRecord Person-media relationship record
 * @returns {string|null} Resolved assetId or null
 */
export function resolveAssetIdFromPersonMedia(pmRecord) {
  if (!pmRecord || typeof pmRecord !== 'object') return null;

  const directId = pmRecord.assetId || pmRecord.asset_id || pmRecord.mediaId || pmRecord.media_id;
  if (directId && typeof directId === 'string' && directId.trim()) {
    return directId.trim();
  }

  const relId = pmRecord.relationId || pmRecord.relation_id;
  if (relId && typeof relId === 'string') {
    return deriveAssetIdFromRelationId(relId);
  }

  return null;
}

/**
 * Normalizes a person identifier by trimming and stripping enclosing '@' signs.
 * E.g., '@I223@' -> 'I223'.
 *
 * @param {string} personId Person identifier
 * @returns {string} Normalized person ID
 */
export function normalizePersonId(personId) {
  if (!personId || typeof personId !== 'string') return '';
  return personId.trim().replace(/^@+|@+$/g, '');
}

/**
 * Checks whether two person IDs match, supporting both exact and normalized forms.
 *
 * @param {string} candidateId Candidate ID from record
 * @param {string} targetId Target ID to match
 * @returns {boolean} True if matched
 */
export function isPersonMatch(candidateId, targetId) {
  if (!candidateId || !targetId) return false;
  if (candidateId === targetId) return true;
  const normA = normalizePersonId(candidateId);
  const normB = normalizePersonId(targetId);
  return Boolean(normA && normB && normA.toLowerCase() === normB.toLowerCase());
}

/**
 * Helper to lookup an asset in a mediaMap (supporting Map, Object dictionary, or Array).
 *
 * @param {string} assetId Asset ID
 * @param {Array|Object|Map} mediaMap Media collection or map
 * @returns {Object|null}
 */
function lookupMediaItem(assetId, mediaMap) {
  if (!assetId || !mediaMap) return null;
  if (mediaMap instanceof Map) {
    return mediaMap.get(assetId) || null;
  }
  if (Array.isArray(mediaMap)) {
    return mediaMap.find(item => item && (item.assetId === assetId || item.id === assetId)) || null;
  }
  if (typeof mediaMap === 'object') {
    return mediaMap[assetId] || null;
  }
  return null;
}

/**
 * Resolves the primary portrait media item for a specific person.
 *
 * Priority heuristic:
 * 1. Matching personId where role is 'PORTRAIT' and isPrimary is true.
 * 2. Matching personId with role 'PORTRAIT' (non-primary portrait fallback).
 * 3. Matching personId with isPrimary is true (any primary asset fallback).
 * 4. First matching association for the person.
 *
 * @param {string} personId Target person identifier (e.g. '@I223@' or 'I223')
 * @param {Array<Object>} personMediaList List of person_media relationship records
 * @param {Array|Object|Map} mediaMap Media assets map or collection
 * @returns {Object|null} The resolved media asset item or null
 */
export function resolvePrimaryPortrait(personId, personMediaList, mediaMap) {
  if (!personId || !Array.isArray(personMediaList) || !mediaMap) {
    return null;
  }

  // Find all associations matching this person
  const matches = personMediaList.filter(pm => {
    if (!pm || typeof pm !== 'object') return false;
    const pmPersonId = pm.personId || pm.person_id;
    return isPersonMatch(pmPersonId, personId);
  });

  if (matches.length === 0) {
    return null;
  }

  // 1. Look for explicit primary portrait
  let candidate = matches.find(pm => {
    const role = (pm.role || '').toUpperCase();
    const isPrimary = pm.isPrimary === true || pm.is_primary === 1 || pm.is_primary === true;
    return (role === 'PORTRAIT' || !role) && isPrimary;
  });

  // 2. Fallback to any portrait
  if (!candidate) {
    candidate = matches.find(pm => {
      const role = (pm.role || '').toUpperCase();
      return role === 'PORTRAIT' || !role;
    });
  }

  // Memorial/archival roles (grave, tombstone) are NEVER used as a portrait
  // avatar — they remain available in the archival media list (IMG-01).
  const NON_AVATAR_ROLES = new Set(['GRAVE', 'TOMBSTONE', 'MEMORIAL']);
  const avatarEligible = matches.filter(pm => !NON_AVATAR_ROLES.has((pm.role || '').toUpperCase()));

  // 3. Fallback to any primary
  if (!candidate) {
    candidate = avatarEligible.find(pm => {
      return pm.isPrimary === true || pm.is_primary === 1 || pm.is_primary === true;
    });
  }

  // 4. Fallback to first avatar-eligible association
  if (!candidate) {
    candidate = avatarEligible[0];
  }

  if (!candidate) {
    return null;
  }

  const assetId = resolveAssetIdFromPersonMedia(candidate);
  if (!assetId) {
    return null;
  }

  return lookupMediaItem(assetId, mediaMap);
}

/**
 * Returns a list of media items associated with a person, optionally filtered by media kind.
 *
 * @param {string} personId Target person identifier
 * @param {Array<Object>} personMediaList List of person_media relationship records
 * @param {Array|Object|Map} [mediaMap] Optional media map to resolve full media items
 * @param {string} [filterKind] Optional media kind to filter by ('portrait', 'document', etc.)
 * @returns {Array<Object>} List of associated media items (or PM records if mediaMap is omitted)
 */
export function getPersonMediaList(personId, personMediaList, mediaMap, filterKind) {
  if (!personId || !Array.isArray(personMediaList)) {
    return [];
  }

  const matches = personMediaList.filter(pm => {
    if (!pm || typeof pm !== 'object') return false;
    const pmPersonId = pm.personId || pm.person_id;
    return isPersonMatch(pmPersonId, personId);
  });

  if (matches.length === 0) {
    return [];
  }

  // Sort matches: primary portrait first, then other primary, then rest
  const sortedMatches = [...matches].sort((a, b) => {
    const aIsPrimary = a.isPrimary === true || a.is_primary === 1 || a.is_primary === true;
    const bIsPrimary = b.isPrimary === true || b.is_primary === 1 || b.is_primary === true;
    const aIsPortrait = (a.role || '').toUpperCase() === 'PORTRAIT';
    const bIsPortrait = (b.role || '').toUpperCase() === 'PORTRAIT';

    if (aIsPrimary && aIsPortrait && !(bIsPrimary && bIsPortrait)) return -1;
    if (bIsPrimary && bIsPortrait && !(aIsPrimary && aIsPortrait)) return 1;
    if (aIsPrimary && !bIsPrimary) return -1;
    if (bIsPrimary && !aIsPrimary) return 1;
    return 0;
  });

  if (!mediaMap) {
    // If no mediaMap provided, return PM records directly, optionally filtered by role/filterKind
    if (!filterKind) return sortedMatches;
    const targetRole = filterKind.trim().toUpperCase();
    return sortedMatches.filter(pm => {
      const role = (pm.role || pm.kind || '').toUpperCase();
      return role === targetRole;
    });
  }

  const targetKind = filterKind ? filterKind.trim().toLowerCase() : null;
  const resolvedList = [];
  const seenAssetIds = new Set();

  for (const pm of sortedMatches) {
    const assetId = resolveAssetIdFromPersonMedia(pm);
    if (!assetId || seenAssetIds.has(assetId)) continue;

    const mediaItem = lookupMediaItem(assetId, mediaMap);
    if (!mediaItem) continue;

    if (targetKind) {
      const itemKind = (mediaItem.kind || '').trim().toLowerCase();
      if (itemKind !== targetKind) continue;
    }

    seenAssetIds.add(assetId);
    resolvedList.push(mediaItem);
  }

  return resolvedList;
}
