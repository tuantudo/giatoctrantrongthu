/**
 * GIATOC DOMAIN CORE — kinship/addressing.js
 * Vietnamese relational addressing terms based on generational difference, gender, and lineage branch.
 *
 * PURE DOMAIN LAYER — ZERO DOM, ZERO BROWSER GLOBALS, ZERO SIDE EFFECTS.
 */

/**
 * Normalizes input gender representation into canonical form: 'M', 'F', or 'U'.
 *
 * @param {string|null|undefined} gender
 * @returns {'M'|'F'|'U'}
 */
export function normalizeGender(gender) {
  if (!gender || typeof gender !== 'string') return 'U';
  const g = gender.trim().toLowerCase();
  if (g === 'm' || g === 'male' || g === 'nam' || g === 'trai') return 'M';
  if (g === 'f' || g === 'female' || g === 'nu' || g === 'nữ' || g === 'gái') return 'F';
  return 'U';
}

/**
 * Canonical dictionary of Vietnamese kinship addressing terms by generational delta.
 */
export const KINSHIP_TERMS = Object.freeze({
  DELTA_MINUS_4: Object.freeze({
    GENERAL: 'Kỵ',
    PATERNAL: 'Kỵ nội',
    MATERNAL: 'Kỵ ngoại'
  }),
  DELTA_MINUS_3: Object.freeze({
    GENERAL: 'Cụ',
    PATERNAL: 'Cụ nội',
    MATERNAL: 'Cụ ngoại'
  }),
  DELTA_MINUS_2: Object.freeze({
    GENERAL: 'Ông/Bà',
    PATERNAL_MALE: 'Ông nội',
    PATERNAL_FEMALE: 'Bà nội',
    PATERNAL_GENERAL: 'Ông/Bà nội',
    MATERNAL_MALE: 'Ông ngoại',
    MATERNAL_FEMALE: 'Bà ngoại',
    MATERNAL_GENERAL: 'Ông/Bà ngoại',
    MALE_GENERAL: 'Ông',
    FEMALE_GENERAL: 'Bà'
  }),
  DELTA_MINUS_1: Object.freeze({
    DIRECT_MALE: 'Cha',
    DIRECT_FEMALE: 'Mẹ',
    DIRECT_GENERAL: 'Cha/Mẹ',
    OLDER: 'Bác',
    PATERNAL_YOUNGER_MALE: 'Chú',
    PATERNAL_YOUNGER_FEMALE: 'Cô',
    PATERNAL_YOUNGER_GENERAL: 'Chú/Cô',
    MATERNAL_YOUNGER_MALE: 'Cậu',
    MATERNAL_YOUNGER_FEMALE: 'Dì',
    MATERNAL_YOUNGER_GENERAL: 'Cậu/Dì',
    COLLATERAL_GENERAL: 'Bậc cha chú'
  }),
  DELTA_0: Object.freeze({
    SPOUSE_MALE: 'Chồng',
    SPOUSE_FEMALE: 'Vợ',
    SPOUSE_GENERAL: 'Vợ/Chồng',
    OLDER_MALE: 'Anh',
    OLDER_FEMALE: 'Chị',
    OLDER_GENERAL: 'Anh/Chị',
    YOUNGER: 'Em',
    PEER_GENERAL: 'Anh/Chị/Em'
  }),
  DELTA_PLUS_1: Object.freeze({
    MALE: 'Con trai',
    FEMALE: 'Con gái',
    GENERAL: 'Con'
  }),
  DELTA_PLUS_2: Object.freeze({
    PATERNAL: 'Cháu nội',
    MATERNAL: 'Cháu ngoại',
    GENERAL: 'Cháu'
  }),
  DELTA_PLUS_3: Object.freeze({
    GENERAL: 'Chắt'
  }),
  DELTA_PLUS_4: Object.freeze({
    GENERAL: 'Chút'
  }),
  DELTA_BEYOND_4: Object.freeze({
    GENERAL: 'Hậu duệ'
  }),
  DELTA_BEFORE_4: Object.freeze({
    GENERAL: 'Tiền nhân'
  }),
  FALLBACK: 'Gia tộc'
});

/**
 * Resolves the appropriate Vietnamese relational addressing term.
 *
 * Rules:
 * - Delta -2: Ông nội / Bà nội (paternal), Ông ngoại / Bà ngoại (maternal)
 * - Delta -1: Bác (older than parent), Chú / Cô (paternal younger), Cậu / Dì (maternal younger), Cha / Mẹ (direct)
 * - Delta 0: Anh / Chị (older), Em (younger), Vợ / Chồng (spouse)
 * - Delta +1: Con trai / Con gái / Con
 * - Delta +2: Cháu nội / Cháu ngoại / Cháu
 * - Delta +3: Chắt
 * - Delta +4: Chút
 *
 * @param {Object} [options={}]
 * @param {number} [options.delta] Generational difference (target - reference)
 * @param {string} [options.gender] Target gender ('M', 'F', 'male', 'female', etc.)
 * @param {boolean} [options.isPaternal] Whether relation is on paternal branch (true) or maternal (false)
 * @param {boolean} [options.isOlder] Whether target is older than reference (or older than parent)
 * @param {boolean} [options.isDirect] Whether relation is direct lineal parent-child
 * @param {boolean} [options.isSpouse] Whether target is spouse of reference
 * @returns {string} Vietnamese addressing term
 */
export function getAddressingTerm(options = {}) {
  if (!options || typeof options !== 'object') {
    return KINSHIP_TERMS.FALLBACK;
  }

  const { delta, gender, isPaternal, isOlder, isDirect, isSpouse } = options;

  if (delta === null || delta === undefined || typeof delta !== 'number' || !Number.isFinite(delta)) {
    return KINSHIP_TERMS.FALLBACK;
  }

  const g = normalizeGender(gender);
  const d = Math.round(delta);

  // Delta -2: Grandparent Generation
  if (d === -2) {
    if (isPaternal === false) {
      if (g === 'M') return KINSHIP_TERMS.DELTA_MINUS_2.MATERNAL_MALE;
      if (g === 'F') return KINSHIP_TERMS.DELTA_MINUS_2.MATERNAL_FEMALE;
      return KINSHIP_TERMS.DELTA_MINUS_2.MATERNAL_GENERAL;
    }
    if (isPaternal === true) {
      if (g === 'M') return KINSHIP_TERMS.DELTA_MINUS_2.PATERNAL_MALE;
      if (g === 'F') return KINSHIP_TERMS.DELTA_MINUS_2.PATERNAL_FEMALE;
      return KINSHIP_TERMS.DELTA_MINUS_2.PATERNAL_GENERAL;
    }
    // Fallback when branch is unspecified
    if (g === 'M') return KINSHIP_TERMS.DELTA_MINUS_2.MALE_GENERAL;
    if (g === 'F') return KINSHIP_TERMS.DELTA_MINUS_2.FEMALE_GENERAL;
    return KINSHIP_TERMS.DELTA_MINUS_2.GENERAL;
  }

  // Delta -1: Parent Tier
  if (d === -1) {
    if (isDirect === true) {
      if (g === 'M') return KINSHIP_TERMS.DELTA_MINUS_1.DIRECT_MALE;
      if (g === 'F') return KINSHIP_TERMS.DELTA_MINUS_1.DIRECT_FEMALE;
      return KINSHIP_TERMS.DELTA_MINUS_1.DIRECT_GENERAL;
    }

    if (isOlder === true) {
      return KINSHIP_TERMS.DELTA_MINUS_1.OLDER;
    }

    if (isOlder === false) {
      if (isPaternal === false) {
        if (g === 'M') return KINSHIP_TERMS.DELTA_MINUS_1.MATERNAL_YOUNGER_MALE;
        if (g === 'F') return KINSHIP_TERMS.DELTA_MINUS_1.MATERNAL_YOUNGER_FEMALE;
        return KINSHIP_TERMS.DELTA_MINUS_1.MATERNAL_YOUNGER_GENERAL;
      }
      // Paternal younger (default in paternal clan)
      if (g === 'M') return KINSHIP_TERMS.DELTA_MINUS_1.PATERNAL_YOUNGER_MALE;
      if (g === 'F') return KINSHIP_TERMS.DELTA_MINUS_1.PATERNAL_YOUNGER_FEMALE;
      return KINSHIP_TERMS.DELTA_MINUS_1.PATERNAL_YOUNGER_GENERAL;
    }

    // Fallback when neither direct nor age-ordering is specified
    if (isPaternal === false) {
      if (g === 'M') return KINSHIP_TERMS.DELTA_MINUS_1.MATERNAL_YOUNGER_MALE;
      if (g === 'F') return KINSHIP_TERMS.DELTA_MINUS_1.MATERNAL_YOUNGER_FEMALE;
      return KINSHIP_TERMS.DELTA_MINUS_1.MATERNAL_YOUNGER_GENERAL;
    }
    if (isPaternal === true) {
      if (g === 'M') return KINSHIP_TERMS.DELTA_MINUS_1.PATERNAL_YOUNGER_MALE;
      if (g === 'F') return KINSHIP_TERMS.DELTA_MINUS_1.PATERNAL_YOUNGER_FEMALE;
      return KINSHIP_TERMS.DELTA_MINUS_1.PATERNAL_YOUNGER_GENERAL;
    }
    if (g === 'M') return 'Bác/Chú';
    if (g === 'F') return 'Cô/Dì';
    return KINSHIP_TERMS.DELTA_MINUS_1.COLLATERAL_GENERAL;
  }

  // Delta 0: Same Generation
  if (d === 0) {
    if (isSpouse === true) {
      if (g === 'M') return KINSHIP_TERMS.DELTA_0.SPOUSE_MALE;
      if (g === 'F') return KINSHIP_TERMS.DELTA_0.SPOUSE_FEMALE;
      return KINSHIP_TERMS.DELTA_0.SPOUSE_GENERAL;
    }

    if (isOlder === true) {
      if (g === 'M') return KINSHIP_TERMS.DELTA_0.OLDER_MALE;
      if (g === 'F') return KINSHIP_TERMS.DELTA_0.OLDER_FEMALE;
      return KINSHIP_TERMS.DELTA_0.OLDER_GENERAL;
    }

    if (isOlder === false) {
      return KINSHIP_TERMS.DELTA_0.YOUNGER;
    }

    // Fallback when age-ordering is unspecified
    if (g === 'M') return 'Anh/Em';
    if (g === 'F') return 'Chị/Em';
    return KINSHIP_TERMS.DELTA_0.PEER_GENERAL;
  }

  // Delta +1: Child Generation
  if (d === 1) {
    if (g === 'M') return KINSHIP_TERMS.DELTA_PLUS_1.MALE;
    if (g === 'F') return KINSHIP_TERMS.DELTA_PLUS_1.FEMALE;
    return KINSHIP_TERMS.DELTA_PLUS_1.GENERAL;
  }

  // Delta +2: Grandchild Generation
  if (d === 2) {
    if (isPaternal === true) return KINSHIP_TERMS.DELTA_PLUS_2.PATERNAL;
    if (isPaternal === false) return KINSHIP_TERMS.DELTA_PLUS_2.MATERNAL;
    return KINSHIP_TERMS.DELTA_PLUS_2.GENERAL;
  }

  // Delta +3: Great-Grandchild Generation
  if (d === 3) {
    return KINSHIP_TERMS.DELTA_PLUS_3.GENERAL;
  }

  // Delta +4: Great-Great-Grandchild Generation
  if (d === 4) {
    return KINSHIP_TERMS.DELTA_PLUS_4.GENERAL;
  }

  // Delta > 4: Further Descendants
  if (d > 4) {
    return KINSHIP_TERMS.DELTA_BEYOND_4.GENERAL;
  }

  // Delta -3: Great-Grandparent
  if (d === -3) {
    if (isPaternal === false) return KINSHIP_TERMS.DELTA_MINUS_3.MATERNAL;
    if (isPaternal === true) return KINSHIP_TERMS.DELTA_MINUS_3.PATERNAL;
    return KINSHIP_TERMS.DELTA_MINUS_3.GENERAL;
  }

  // Delta -4: Great-Great-Grandparent
  if (d === -4) {
    return KINSHIP_TERMS.DELTA_MINUS_4.GENERAL;
  }

  // Delta < -4: Earlier Ancestors
  return KINSHIP_TERMS.DELTA_BEFORE_4.GENERAL;
}

/**
 * Alias for getAddressingTerm.
 */
export const resolveAddressingTerm = getAddressingTerm;

/**
 * Returns structured addressing terms dictionary for documentation and UI helpers.
 *
 * @returns {typeof KINSHIP_TERMS}
 */
export function getAddressingTermsTable() {
  return KINSHIP_TERMS;
}
