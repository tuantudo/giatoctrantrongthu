/**
 * GIATOC UI SYSTEM v0.2 — epistemic.js
 * Data-driven epistemic classification. (Phase 6)
 *
 * [FACT] v0.2 schema reality: the `people` table stores id/name/birthYear/
 * deathYear/gender/notes/status + a JSON `payload`. There is NO provenance,
 * confidence or claim-type column anywhere (ERD_v0.1 marks Claim/Evidence as
 * "KHÔNG CÓ — Tạo mới").
 *
 * CONSEQUENCE: for v0.2 no genealogy value can legitimately be labelled
 * FACT / INFERENCE / PROPOSAL / EVIDENCE NEEDED. This module therefore returns
 * null unless a real field supplies a classification, and pages must degrade to
 * a neutral presentation. Epistemic badges can only start appearing once a
 * source field exists — see [OPEN QUESTION] in docs/design/GIATOC_UI_SYSTEM_v0.2.md.
 */

/** Field names that WOULD carry a claim classification if the schema had them. */
const CLAIM_TYPE_FIELDS = ['claim_type', 'claimType', 'epistemic_status', 'epistemicStatus'];
const EVIDENCE_FIELDS = ['source_ids', 'sourceIds', 'citations', 'sources', 'provenance'];

function firstString(record, fields) {
  if (!record || typeof record !== 'object') return null;
  for (const field of fields) {
    const value = record[field];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return null;
}

/**
 * @returns {{claimType: string|null, source: string|null}}
 * claimType is null when the data carries no classification (the v0.2 case).
 */
export function classifyClaim(record) {
  const raw = firstString(record, CLAIM_TYPE_FIELDS);
  if (!raw) return { claimType: null, source: null };
  const normalized = raw.toLowerCase().replace(/[\s_]+/g, '-');
  const allowed = ['fact', 'inference', 'proposal', 'evidence-needed'];
  if (!allowed.includes(normalized)) return { claimType: null, source: null };

  const evidence = record[EVIDENCE_FIELDS[0]] || record[EVIDENCE_FIELDS[1]] ||
    record[EVIDENCE_FIELDS[2]] || record[EVIDENCE_FIELDS[3]] || record.provenance;
  const source = Array.isArray(evidence)
    ? `evidence list (${evidence.length} mục)`
    : (evidence ? 'provenance field' : null);

  // No evidence reference -> the honest label is "evidence needed", not "fact".
  if (!source) return { claimType: 'evidence-needed', source: 'record declares a claim but carries no evidence reference' };
  return { claimType: normalized, source };
}

/** True when a record carries any evidence/citation structure at all. */
export function hasEvidenceStructure(record) {
  if (!record || typeof record !== 'object') return false;
  return EVIDENCE_FIELDS.some(field => {
    const value = record[field];
    if (Array.isArray(value)) return value.length > 0;
    return Boolean(value && typeof value === 'object');
  });
}
