/**
 * GIATOC DOMAIN CORE — genealogy/temporal.js
 * Domain logic for genealogical dates, lifespan calculation, and GEDCOM date normalization.
 *
 * ZERO DOM DEPENDENCY — Pure functions executable in browser and Node.js.
 */

import { textOrNull } from '../../shared/utils/formatting.js';

/** GEDCOM range/qualifier markers indicating an estimate rather than a pinpoint date. */
export const DATE_IS_ESTIMATE = /^(ABT|BET|CAL|EST|AND|BEF|AFT)\b/i;

/**
 * Normalizes a raw GEDCOM date string into a human-readable display string.
 *
 * - Formats 4-digit years into bounded spans (e.g. "1910 – 1985").
 * - Appends "(ước tính trong hồ sơ)" if the GEDCOM record denotes an estimate.
 * - Returns null if no valid year is found — never invents or guesses dates.
 *
 * @param {*} value Raw date string from record (e.g. "BET 15 OCT 1956 AND 19 OCT 1956")
 * @returns {string|null} Human-readable bounded year string or null.
 */
export function humanDate(value) {
  const raw = textOrNull(value);
  if (!raw) return null;

  const years = raw.match(/\b(1[0-9]{3}|20[0-2][0-9])\b/g);
  if (!years) return null;

  const first = years[0];
  const last = years[years.length - 1];
  const span = first !== last ? `${first} – ${last}` : first;

  return DATE_IS_ESTIMATE.test(raw) ? `${span} (ước tính trong hồ sơ)` : span;
}

/**
 * Formats a person's lifespan from birth and death records.
 *
 * @param {Object} person Person entity containing optional birth/death objects
 * @returns {string|null} "1875 – 1980", "1920 – …", "… – 1990", or null if no years available.
 */
export function lifeSpan(person) {
  if (!person || typeof person !== 'object') return null;
  const b = person.birth && person.birth.date;
  const d = person.death && person.death.date;
  if (b && d) return `${b} – ${d}`;
  if (b) return `${b} – …`;
  if (d) return `… – ${d}`;
  return null;
}

