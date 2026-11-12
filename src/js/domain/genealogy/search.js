/**
 * GIATOC DOMAIN CORE — genealogy/search.js
 * Indexing, lookup, Vietnamese collation, and search filtering for genealogy entities.
 *
 * ZERO DOM DEPENDENCY — Pure functions executable in browser and Node.js.
 */

import { textOrNull } from '../../shared/utils/formatting.js';

/**
 * Normalizes Vietnamese text by stripping diacritical marks (NFD) and converting to lowercase.
 * Used for accent-insensitive search and uniform collation.
 *
 * @param {string} str
 * @returns {string}
 */
export function normalizeVietnamese(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/**
 * Build a Map<personId, personRecord> from a genealogy bundle.
 * Guarantees personId is preserved without name invention or ID mutation.
 *
 * @param {Object} genealogy Raw genealogy bundle with a `people` dictionary
 * @returns {Map<string, Object>}
 */
export function indexPeople(genealogy) {
  const map = new Map();
  const people = (genealogy && genealogy.people) || {};
  for (const [id, person] of Object.entries(people)) {
    if (person && typeof person === 'object') {
      map.set(id, { id, ...person });
    }
  }

  // F-01: Root-level `genealogy.memories` records (oral-history stories) are
  // attached to their person by `personId` (or `person_id`), so the person profile can render
  // them. Existing per-person `memories` are preserved and listed first.
  const rootMemories = Array.isArray(genealogy && genealogy.memories) ? genealogy.memories : [];
  for (const memory of rootMemories) {
    if (!memory || typeof memory !== 'object') continue;
    const targetPersonId = memory.personId || memory.person_id;
    if (!targetPersonId) continue;
    const person = map.get(targetPersonId);
    if (!person) continue;
    const existing = Array.isArray(person.memories) ? person.memories : [];
    if (memory.id && existing.some((m) => m && typeof m === 'object' && m.id === memory.id)) continue;
    person.memories = [...existing, memory];
  }
  return map;
}

/**
 * Safely retrieve the display name of a person by ID.
 * Returns null if ID is missing or unknown in the index — never invents names.
 *
 * @param {Map<string, Object>} peopleMap Index created by indexPeople
 * @param {string} id Person ID
 * @returns {string|null}
 */
export function nameOf(peopleMap, id) {
  if (!id || !(peopleMap instanceof Map)) return null;
  const person = peopleMap.get(id);
  if (!person) return null;
  return textOrNull(person.name) || textOrNull(person.raw_name) || null;
}

/**
 * Filter an iterable/array of people against a search query.
 * Matches if the query matches the normalized name.
 *
 * @param {Array<Object>} peopleList Array of person entities
 * @param {string} rawQuery Search input
 * @returns {Array<Object>}
 */
export function filterPeople(peopleList, rawQuery) {
  if (!Array.isArray(peopleList)) return [];
  const query = normalizeVietnamese(String(rawQuery || '').trim());
  if (!query) return peopleList.slice();

  return peopleList.filter((person) => {
    if (!person || typeof person !== 'object') return false;
    const name = person.name || person.raw_name || '';
    return normalizeVietnamese(name).includes(query);
  });
}

/**
 * Sort people by name using Vietnamese collation.
 *
 * @param {Array<Object>} peopleList
 * @returns {Array<Object>} New sorted array
 */
export function sortPeopleByName(peopleList) {
  if (!Array.isArray(peopleList)) return [];
  return peopleList.slice().sort((a, b) => {
    const nameA = normalizeVietnamese(a && (a.name || a.raw_name));
    const nameB = normalizeVietnamese(b && (b.name || b.raw_name));
    return nameA.localeCompare(nameB, 'vi');
  });
}

