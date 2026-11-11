/**
 * test_domain_kinship.mjs
 * Comprehensive automated verification for Pure Kinship Domain Core:
 * - src/js/domain/kinship/calc.js
 * - src/js/domain/kinship/addressing.js
 * - src/js/domain/kinship/index.js (barrel export)
 *
 * PURE NODE.JS EXECUTION — ZERO BROWSER, ZERO DOM MOCKS, ZERO SIDE EFFECTS.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

console.log('🧪 Starting test suite for Pure Kinship Domain Core...');

// =========================================================================
// 0. ENVIRONMENT CHECK — STRICT ZERO DOM / ZERO BROWSER GLOBALS
// =========================================================================
console.log('  [CHECK] Verifying Pure Domain Environment (Zero DOM globals)...');
assert.equal(typeof window, 'undefined', 'window must not exist in Pure Domain execution');
assert.equal(typeof document, 'undefined', 'document must not exist in Pure Domain execution');
console.log('  ✅ Environment check passed: 100% Pure Domain execution verified.');

// =========================================================================
// 1. TEST CALC.JS
// =========================================================================
console.log('\n  [TEST] Testing src/js/domain/kinship/calc.js...');
const {
  calculateGenerationalDelta,
  getRelationshipByDelta,
  calculateRelationship,
  getGenerationMeta,
  getFamilyGenerationMeta,
  buildKinshipAdjacency,
  findKinshipPath,
  analyzeKinshipPath
} = await import('../src/js/domain/kinship/calc.js');

// 1.1 calculateGenerationalDelta with numbers
assert.equal(calculateGenerationalDelta(0, 0), 0, 'F0 to F0 is 0');
assert.equal(calculateGenerationalDelta(0, 1), 1, 'F0 to F1 is +1 (child)');
assert.equal(calculateGenerationalDelta(0, 2), 2, 'F0 to F2 is +2 (grandchild)');
assert.equal(calculateGenerationalDelta(0, 3), 3, 'F0 to F3 is +3 (great-grandchild)');
assert.equal(calculateGenerationalDelta(0, 4), 4, 'F0 to F4 is +4 (great-great-grandchild)');
assert.equal(calculateGenerationalDelta(1, 0), -1, 'F1 to F0 is -1 (parent)');
assert.equal(calculateGenerationalDelta(2, 0), -2, 'F2 to F0 is -2 (grandparent)');
assert.equal(calculateGenerationalDelta(3, 1), -2, 'F3 to F1 is -2 (grandparent)');
assert.equal(calculateGenerationalDelta(-1, 2), 3, 'F-1 to F2 is +3');

// 1.2 calculateGenerationalDelta with person objects
assert.equal(calculateGenerationalDelta({ generation: 0 }, { generation: 2 }), 2);
assert.equal(calculateGenerationalDelta({ level: 1 }, { level: 4 }), 3);
assert.equal(calculateGenerationalDelta({ generation: 2 }, { level: 1 }), -1);
assert.equal(calculateGenerationalDelta(0, { generation: 1 }), 1);
assert.equal(calculateGenerationalDelta({ generation: 2 }, 0), -2);
assert.equal(calculateGenerationalDelta('1', '3'), 2, 'String numbers should parse safely');

// 1.3 calculateGenerationalDelta edge cases & null handling
assert.equal(calculateGenerationalDelta(null, 1), null);
assert.equal(calculateGenerationalDelta(1, null), null);
assert.equal(calculateGenerationalDelta(undefined, undefined), null);
assert.equal(calculateGenerationalDelta('abc', 1), null);
assert.equal(calculateGenerationalDelta({}, {}), null);
assert.equal(calculateGenerationalDelta(NaN, 1), null);
assert.equal(calculateGenerationalDelta(Infinity, 1), null);

// 1.4 getRelationshipByDelta
assert.equal(getRelationshipByDelta(-3), 'Tiền nhân');
assert.equal(getRelationshipByDelta(-5), 'Tiền nhân');
assert.equal(getRelationshipByDelta(-2), 'Ông bà');
assert.equal(getRelationshipByDelta(-1), 'Cha chú');
assert.equal(getRelationshipByDelta(0), 'Bằng vai');
assert.equal(getRelationshipByDelta(1), 'Con');
assert.equal(getRelationshipByDelta(2), 'Cháu');
assert.equal(getRelationshipByDelta(3), 'Chắt');
assert.equal(getRelationshipByDelta(4), 'Chút');
assert.equal(getRelationshipByDelta(5), 'Hậu duệ');
assert.equal(getRelationshipByDelta(10), 'Hậu duệ');
assert.equal(getRelationshipByDelta(null), 'Không xác định');
assert.equal(getRelationshipByDelta(undefined), 'Không xác định');
assert.equal(getRelationshipByDelta(NaN), 'Không xác định');

// 1.5 calculateRelationship
const relCon = calculateRelationship(0, 1);
assert.equal(relCon.delta, 1);
assert.equal(relCon.category, 'Con');
assert.equal(relCon.isAncestor, false);
assert.equal(relCon.isDescendant, true);
assert.equal(relCon.isSameGeneration, false);
assert(Object.isFrozen(relCon), 'Result must be immutable');

const relOngBa = calculateRelationship(2, 0);
assert.equal(relOngBa.delta, -2);
assert.equal(relOngBa.category, 'Ông bà');
assert.equal(relOngBa.isAncestor, true);
assert.equal(relOngBa.isDescendant, false);
assert.equal(relOngBa.isSameGeneration, false);

const relBangVai = calculateRelationship(2, 2);
assert.equal(relBangVai.delta, 0);
assert.equal(relBangVai.category, 'Bằng vai');
assert.equal(relBangVai.isAncestor, false);
assert.equal(relBangVai.isDescendant, false);
assert.equal(relBangVai.isSameGeneration, true);

const relInvalid = calculateRelationship(null, undefined);
assert.equal(relInvalid.delta, null);
assert.equal(relInvalid.category, 'Không xác định');
assert.equal(relInvalid.isAncestor, false);
assert.equal(relInvalid.isDescendant, false);
assert.equal(relInvalid.isSameGeneration, false);

// 1.6 getGenerationMeta
const meta0 = getGenerationMeta(0);
assert.equal(meta0.level, 0);
assert.equal(meta0.label, 'F0 · Gốc Phả Hệ');
assert.equal(meta0.badgeKey, 'gen-f0');
assert.equal(meta0.badgeCls, 'gen-f0');
assert.equal(meta0.borderCls, 'border-f0');
assert.equal(meta0.title, 'Cố Thu (Family Anchor)');
assert(Object.isFrozen(meta0), 'Meta must be frozen');

const meta1 = getGenerationMeta(1);
assert.equal(meta1.level, 1);
assert.equal(meta1.label, 'F1 · Đời Con');
assert.equal(meta1.badgeKey, 'gen-f1');
assert.equal(meta1.title, 'Thế hệ thứ 1 (Con)');

const meta2 = getGenerationMeta(2);
assert.equal(meta2.level, 2);
assert.equal(meta2.label, 'F2 · Đời Cháu');
assert.equal(meta2.badgeKey, 'gen-f2');

const meta3 = getGenerationMeta(3);
assert.equal(meta3.level, 3);
assert.equal(meta3.label, 'F3 · Đời Chắt');
assert.equal(meta3.badgeKey, 'gen-f3');

const meta4 = getGenerationMeta(4);
assert.equal(meta4.level, 4);
assert.equal(meta4.label, 'F4 · Đời Chút');
assert.equal(meta4.badgeKey, 'gen-f4');

const meta5 = getGenerationMeta(5);
assert.equal(meta5.level, 5);
assert.equal(meta5.label, 'F5 · Hậu duệ');
assert.equal(meta5.badgeKey, 'gen-f4');

const metaPre = getGenerationMeta(-1);
assert.equal(metaPre.level, -1);
assert.equal(metaPre.label, 'Tiền nhân (F-1)');
assert.equal(metaPre.badgeKey, 'gen-f0');

const metaNull = getGenerationMeta(null);
assert.equal(metaNull.level, 99);
assert.equal(metaNull.label, 'Gia tộc');
assert.equal(metaNull.badgeKey, 'gen-other');
assert.equal(metaNull.title, 'Thành viên gia tộc');

assert.equal(getGenerationMeta(undefined).label, 'Gia tộc');
assert.equal(getGenerationMeta('invalid').label, 'Gia tộc');
assert.equal(getGenerationMeta(NaN).label, 'Gia tộc');

// 1.7 getFamilyGenerationMeta
const fMeta0 = getFamilyGenerationMeta(0);
assert.equal(fMeta0.level, 0);
assert.equal(fMeta0.label, 'F0 · Đời Cố Thu');
assert.equal(fMeta0.badgeKey, 'gen-f0');
assert.equal(fMeta0.bgCls, 'bg-gen-f0');
assert.equal(fMeta0.title, 'Nhánh Cố Thu (Gốc phả hệ)');
assert(Object.isFrozen(fMeta0), 'Family meta must be frozen');

const fMeta1 = getFamilyGenerationMeta(1);
assert.equal(fMeta1.label, 'F1 · Đời Con');
assert.equal(fMeta1.bgCls, 'bg-gen-f1');

const fMeta2 = getFamilyGenerationMeta(2);
assert.equal(fMeta2.label, 'F2 · Đời Cháu');
assert.equal(fMeta2.bgCls, 'bg-gen-f2');

const fMeta3 = getFamilyGenerationMeta(3);
assert.equal(fMeta3.label, 'F3 · Đời Chắt');

const fMeta4 = getFamilyGenerationMeta(4);
assert.equal(fMeta4.label, 'F4 · Đời Chút');

const fMetaNeg = getFamilyGenerationMeta(-2);
assert.equal(fMetaNeg.label, 'Tiền nhân (F-2)');
assert.equal(fMetaNeg.bgCls, 'bg-gen-f0');

const fMetaNull = getFamilyGenerationMeta(null);
assert.equal(fMetaNull.level, 99);
assert.equal(fMetaNull.label, 'Gia tộc');
assert.equal(fMetaNull.bgCls, 'bg-gen-other');

// 1.8 buildKinshipAdjacency
const testGraphData = {
  '@P1@': { id: '@P1@', spouses: ['@P2@'], children: ['@C1@', '@C2@'], parents: ['@G1@'] },
  '@P2@': { id: '@P2@', spouses: ['@P1@'], children: ['@C1@', '@C2@'], parents: [] },
  '@C1@': { id: '@C1@', spouses: [], children: ['@GC1@'], parents: ['@P1@', '@P2@'] },
  '@C2@': { id: '@C2@', spouses: [], children: [], parents: ['@P1@', '@P2@'] },
  '@GC1@': { id: '@GC1@', spouses: [], children: [], parents: ['@C1@'] },
  '@G1@': { id: '@G1@', spouses: [], children: ['@P1@'], parents: [] },
  '@ORPHAN@': { id: '@ORPHAN@', spouses: [], children: [], parents: [] }
};

const adj = buildKinshipAdjacency(testGraphData);
assert(Array.isArray(adj['@P1@']), 'Adjacency list must be array');
assert(adj['@P1@'].some(e => e.id === '@C1@' && e.type === 'child' && e.delta === 1));
assert(adj['@P1@'].some(e => e.id === '@P2@' && e.type === 'spouse' && e.delta === 0));
assert(adj['@P1@'].some(e => e.id === '@G1@' && e.type === 'parent' && e.delta === -1));

// Adjacency from Map and Array
const testMap = new Map(Object.entries(testGraphData));
const adjMap = buildKinshipAdjacency(testMap);
assert.equal(adjMap['@P1@'].length, adj['@P1@'].length);

const testArr = Object.values(testGraphData);
const adjArr = buildKinshipAdjacency(testArr);
assert.equal(adjArr['@P1@'].length, adj['@P1@'].length);

// Adjacency edge cases
assert.deepEqual(buildKinshipAdjacency(null), {});
assert.deepEqual(buildKinshipAdjacency(undefined), {});
assert.deepEqual(buildKinshipAdjacency(123), {});

// 1.9 findKinshipPath
// Case A: Self
const selfPath = findKinshipPath('@P1@', '@P1@', testGraphData);
assert.equal(selfPath.found, true);
assert.equal(selfPath.distance, 0);
assert.equal(selfPath.generationalDelta, 0);
assert.equal(selfPath.relationship, 'Bản thân');
assert.deepEqual(selfPath.path, ['@P1@']);
assert(Object.isFrozen(selfPath));

// Case B: Direct Lineal Child
const childPath = findKinshipPath('@P1@', '@C1@', testGraphData);
assert.equal(childPath.found, true);
assert.equal(childPath.distance, 1);
assert.equal(childPath.generationalDelta, 1);
assert.equal(childPath.isDirectLineal, true);
assert.equal(childPath.isAffinal, false);
assert.deepEqual(childPath.path, ['@P1@', '@C1@']);

// Case C: Direct Lineal Grandchild
const gchildPath = findKinshipPath('@P1@', '@GC1@', testGraphData);
assert.equal(gchildPath.found, true);
assert.equal(gchildPath.distance, 2);
assert.equal(gchildPath.generationalDelta, 2);
assert.equal(gchildPath.isDirectLineal, true);
assert.deepEqual(gchildPath.path, ['@P1@', '@C1@', '@GC1@']);

// Case D: Direct Lineal Parent / Grandparent (reverse)
const parentPath = findKinshipPath('@C1@', '@P1@', testGraphData);
assert.equal(parentPath.found, true);
assert.equal(parentPath.distance, 1);
assert.equal(parentPath.generationalDelta, -1);
assert.equal(parentPath.isDirectLineal, true);

const gparPath = findKinshipPath('@GC1@', '@G1@', testGraphData);
assert.equal(gparPath.found, true);
assert.equal(gparPath.distance, 3);
assert.equal(gparPath.generationalDelta, -3);
assert.equal(gparPath.isDirectLineal, true);

// Case E: Siblings (Collateral)
const sibPath = findKinshipPath('@C1@', '@C2@', testGraphData);
assert.equal(sibPath.found, true);
assert.equal(sibPath.generationalDelta, 0);
assert.equal(sibPath.isCollateral, true);
assert.equal(sibPath.isDirectLineal, false);
assert(sibPath.distance >= 2, 'Sibling path is at least 2 hops');

// Case F: Spouse (Affinal)
const spousePath = findKinshipPath('@P1@', '@P2@', testGraphData);
assert.equal(spousePath.found, true);
assert.equal(spousePath.distance, 1);
assert.equal(spousePath.generationalDelta, 0);
assert.equal(spousePath.isAffinal, true);

// Case G: Disconnected / Orphan
const orphanPath = findKinshipPath('@P1@', '@ORPHAN@', testGraphData);
assert.equal(orphanPath.found, false);
assert.equal(orphanPath.distance, -1);
assert.deepEqual(orphanPath.path, []);

// Case H: Invalid inputs
assert.equal(findKinshipPath(null, '@P1@', testGraphData).found, false);
assert.equal(findKinshipPath('@P1@', null, testGraphData).found, false);
assert.equal(findKinshipPath('@P1@', '@P2@', null).found, false);

// 1.10 analyzeKinshipPath
const analysisSib = analyzeKinshipPath('@C1@', '@C2@', testGraphData);
assert.equal(analysisSib.pathResult.found, true);
assert(analysisSib.lowestCommonAncestor === '@P1@' || analysisSib.lowestCommonAncestor === '@P2@');

const analysisOrphan = analyzeKinshipPath('@P1@', '@ORPHAN@', testGraphData);
assert.equal(analysisOrphan.pathResult.found, false);
assert.equal(analysisOrphan.lowestCommonAncestor, null);

console.log('  ✅ calc.js tests passed successfully.');

// =========================================================================
// 2. TEST ADDRESSING.JS
// =========================================================================
console.log('\n  [TEST] Testing src/js/domain/kinship/addressing.js...');
const {
  normalizeGender,
  KINSHIP_TERMS,
  getAddressingTerm,
  resolveAddressingTerm,
  getAddressingTermsTable
} = await import('../src/js/domain/kinship/addressing.js');

// 2.1 normalizeGender
assert.equal(normalizeGender('M'), 'M');
assert.equal(normalizeGender('male'), 'M');
assert.equal(normalizeGender('Nam'), 'M');
assert.equal(normalizeGender('trai'), 'M');
assert.equal(normalizeGender('F'), 'F');
assert.equal(normalizeGender('female'), 'F');
assert.equal(normalizeGender('NỮ'), 'F');
assert.equal(normalizeGender('nu'), 'F');
assert.equal(normalizeGender('gái'), 'F');
assert.equal(normalizeGender(null), 'U');
assert.equal(normalizeGender(undefined), 'U');
assert.equal(normalizeGender('unknown'), 'U');
assert.equal(normalizeGender(123), 'U');

// 2.2 Delta -2: Grandparent Generation
// Paternal (Ông nội / Bà nội)
assert.equal(getAddressingTerm({ delta: -2, isPaternal: true, gender: 'M' }), 'Ông nội');
assert.equal(getAddressingTerm({ delta: -2, isPaternal: true, gender: 'F' }), 'Bà nội');
assert.equal(getAddressingTerm({ delta: -2, isPaternal: true }), 'Ông/Bà nội');

// Maternal (Ông ngoại / Bà ngoại)
assert.equal(getAddressingTerm({ delta: -2, isPaternal: false, gender: 'M' }), 'Ông ngoại');
assert.equal(getAddressingTerm({ delta: -2, isPaternal: false, gender: 'F' }), 'Bà ngoại');
assert.equal(getAddressingTerm({ delta: -2, isPaternal: false }), 'Ông/Bà ngoại');

// Unspecified branch
assert.equal(getAddressingTerm({ delta: -2, gender: 'M' }), 'Ông');
assert.equal(getAddressingTerm({ delta: -2, gender: 'F' }), 'Bà');
assert.equal(getAddressingTerm({ delta: -2 }), 'Ông/Bà');

// 2.3 Delta -1: Parent Tier
// Direct parents (Cha / Mẹ)
assert.equal(getAddressingTerm({ delta: -1, isDirect: true, gender: 'M' }), 'Cha');
assert.equal(getAddressingTerm({ delta: -1, isDirect: true, gender: 'F' }), 'Mẹ');
assert.equal(getAddressingTerm({ delta: -1, isDirect: true }), 'Cha/Mẹ');

// Older than parent: Bác
assert.equal(getAddressingTerm({ delta: -1, isOlder: true, gender: 'M' }), 'Bác');
assert.equal(getAddressingTerm({ delta: -1, isOlder: true, gender: 'F' }), 'Bác');
assert.equal(getAddressingTerm({ delta: -1, isOlder: true }), 'Bác');

// Paternal younger: Chú / Cô
assert.equal(getAddressingTerm({ delta: -1, isPaternal: true, isOlder: false, gender: 'M' }), 'Chú');
assert.equal(getAddressingTerm({ delta: -1, isPaternal: true, isOlder: false, gender: 'F' }), 'Cô');
assert.equal(getAddressingTerm({ delta: -1, isPaternal: true, isOlder: false }), 'Chú/Cô');

// Maternal younger: Cậu / Dì
assert.equal(getAddressingTerm({ delta: -1, isPaternal: false, isOlder: false, gender: 'M' }), 'Cậu');
assert.equal(getAddressingTerm({ delta: -1, isPaternal: false, isOlder: false, gender: 'F' }), 'Dì');
assert.equal(getAddressingTerm({ delta: -1, isPaternal: false, isOlder: false }), 'Cậu/Dì');

// Delta -1 fallbacks
assert.equal(getAddressingTerm({ delta: -1, isPaternal: false, gender: 'M' }), 'Cậu');
assert.equal(getAddressingTerm({ delta: -1, isPaternal: false, gender: 'F' }), 'Dì');
assert.equal(getAddressingTerm({ delta: -1, isPaternal: true, gender: 'M' }), 'Chú');
assert.equal(getAddressingTerm({ delta: -1, isPaternal: true, gender: 'F' }), 'Cô');
assert.equal(getAddressingTerm({ delta: -1, gender: 'M' }), 'Bác/Chú');
assert.equal(getAddressingTerm({ delta: -1, gender: 'F' }), 'Cô/Dì');
assert.equal(getAddressingTerm({ delta: -1 }), 'Bậc cha chú');

// 2.4 Delta 0: Same Generation (Anh / Chị / Em / Vợ / Chồng)
// Spouse: Vợ / Chồng
assert.equal(getAddressingTerm({ delta: 0, isSpouse: true, gender: 'M' }), 'Chồng');
assert.equal(getAddressingTerm({ delta: 0, isSpouse: true, gender: 'F' }), 'Vợ');
assert.equal(getAddressingTerm({ delta: 0, isSpouse: true }), 'Vợ/Chồng');

// Older: Anh / Chị
assert.equal(getAddressingTerm({ delta: 0, isOlder: true, gender: 'M' }), 'Anh');
assert.equal(getAddressingTerm({ delta: 0, isOlder: true, gender: 'F' }), 'Chị');
assert.equal(getAddressingTerm({ delta: 0, isOlder: true }), 'Anh/Chị');

// Younger: Em
assert.equal(getAddressingTerm({ delta: 0, isOlder: false, gender: 'M' }), 'Em');
assert.equal(getAddressingTerm({ delta: 0, isOlder: false, gender: 'F' }), 'Em');
assert.equal(getAddressingTerm({ delta: 0, isOlder: false }), 'Em');

// Fallback peer
assert.equal(getAddressingTerm({ delta: 0, gender: 'M' }), 'Anh/Em');
assert.equal(getAddressingTerm({ delta: 0, gender: 'F' }), 'Chị/Em');
assert.equal(getAddressingTerm({ delta: 0 }), 'Anh/Chị/Em');

// 2.5 Delta +1: Child Generation (Con trai / Con gái / Con)
assert.equal(getAddressingTerm({ delta: 1, gender: 'M' }), 'Con trai');
assert.equal(getAddressingTerm({ delta: 1, gender: 'F' }), 'Con gái');
assert.equal(getAddressingTerm({ delta: 1 }), 'Con');

// 2.6 Delta +2: Grandchild Generation (Cháu nội / Cháu ngoại / Cháu)
assert.equal(getAddressingTerm({ delta: 2, isPaternal: true }), 'Cháu nội');
assert.equal(getAddressingTerm({ delta: 2, isPaternal: false }), 'Cháu ngoại');
assert.equal(getAddressingTerm({ delta: 2 }), 'Cháu');

// 2.7 Delta +3: Great-Grandchild Generation (Chắt)
assert.equal(getAddressingTerm({ delta: 3 }), 'Chắt');
assert.equal(getAddressingTerm({ delta: 3, gender: 'M' }), 'Chắt');
assert.equal(getAddressingTerm({ delta: 3, gender: 'F' }), 'Chắt');

// 2.8 Delta +4: Great-Great-Grandchild Generation (Chút)
assert.equal(getAddressingTerm({ delta: 4 }), 'Chút');
assert.equal(getAddressingTerm({ delta: 4, gender: 'M' }), 'Chút');

// 2.9 Delta > 4: Further Descendants
assert.equal(getAddressingTerm({ delta: 5 }), 'Hậu duệ');
assert.equal(getAddressingTerm({ delta: 8 }), 'Hậu duệ');

// 2.10 Delta < -2: Earlier Ancestors
assert.equal(getAddressingTerm({ delta: -3, isPaternal: true }), 'Cụ nội');
assert.equal(getAddressingTerm({ delta: -3, isPaternal: false }), 'Cụ ngoại');
assert.equal(getAddressingTerm({ delta: -3 }), 'Cụ');
assert.equal(getAddressingTerm({ delta: -4 }), 'Kỵ');
assert.equal(getAddressingTerm({ delta: -5 }), 'Tiền nhân');

// 2.11 Negative & edge cases
assert.equal(getAddressingTerm(null), 'Gia tộc');
assert.equal(getAddressingTerm(undefined), 'Gia tộc');
assert.equal(getAddressingTerm({}), 'Gia tộc');
assert.equal(getAddressingTerm({ delta: null }), 'Gia tộc');
assert.equal(getAddressingTerm({ delta: NaN }), 'Gia tộc');
assert.equal(getAddressingTerm({ delta: 'invalid' }), 'Gia tộc');

// 2.12 resolveAddressingTerm alias identity
assert.strictEqual(resolveAddressingTerm, getAddressingTerm, 'resolveAddressingTerm must be exact alias');

// 2.13 Table export & immutability
const table = getAddressingTermsTable();
assert.equal(table.DELTA_PLUS_3.GENERAL, 'Chắt');
assert.equal(table.DELTA_PLUS_4.GENERAL, 'Chút');
assert(Object.isFrozen(table), 'Terms table must be immutable');
assert(Object.isFrozen(table.DELTA_MINUS_2), 'Nested tables must be immutable');

console.log('  ✅ addressing.js tests passed successfully.');

// =========================================================================
// 3. TEST BARREL EXPORT INDEX.JS
// =========================================================================
console.log('\n  [TEST] Testing src/js/domain/kinship/index.js (barrel export)...');
const barrel = await import('../src/js/domain/kinship/index.js');

assert.equal(typeof barrel.calculateGenerationalDelta, 'function');
assert.equal(typeof barrel.getRelationshipByDelta, 'function');
assert.equal(typeof barrel.calculateRelationship, 'function');
assert.equal(typeof barrel.getGenerationMeta, 'function');
assert.equal(typeof barrel.getFamilyGenerationMeta, 'function');
assert.equal(typeof barrel.buildKinshipAdjacency, 'function');
assert.equal(typeof barrel.findKinshipPath, 'function');
assert.equal(typeof barrel.analyzeKinshipPath, 'function');
assert.equal(typeof barrel.normalizeGender, 'function');
assert.equal(typeof barrel.getAddressingTerm, 'function');
assert.equal(typeof barrel.resolveAddressingTerm, 'function');
assert.equal(typeof barrel.getAddressingTermsTable, 'function');
assert.equal(typeof barrel.KINSHIP_TERMS, 'object');

console.log('  ✅ barrel export src/js/domain/kinship/index.js passed.');

// =========================================================================
// 4. VERIFY ON ACTUAL SYNTHETIC FIXTURE
// =========================================================================
console.log('\n  [TEST] Testing on fixtures/synthetic_genealogy.json (223+ individuals)...');
const fixturePath = path.join(ROOT_DIR, 'fixtures/synthetic_genealogy.json');
if (fs.existsSync(fixturePath)) {
  const fixtureData = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
  const people = fixtureData.people || {};
  const peopleCount = Object.keys(people).length;
  assert(peopleCount > 0, 'Fixture must contain people');

  // Adjacency build test
  const fullAdj = buildKinshipAdjacency(people);
  assert(Object.keys(fullAdj).length > 0, 'Adjacency graph must have nodes');
  console.log(`    ✓ Adjacency graph built for ${Object.keys(fullAdj).length} nodes.`);

  // Find root anchor person (e.g. @I1@)
  const rootPersonId = '@I1@';
  if (people[rootPersonId]) {
    let reachableCount = 0;
    let pathsTested = 0;

    for (const pid of Object.keys(people).slice(0, 50)) {
      pathsTested++;
      const pResult = findKinshipPath(rootPersonId, pid, people);
      if (pResult.found) {
        reachableCount++;
        // Verify addressing resolution along path
        const term = getAddressingTerm({
          delta: pResult.generationalDelta,
          isPaternal: true
        });
        assert(typeof term === 'string' && term.length > 0, 'Addressing term must be non-empty string');
      }
    }
    console.log(`    ✓ Kinship paths analyzed for sample: ${reachableCount}/${pathsTested} reachable from anchor ${rootPersonId}.`);
  }
}

console.log('\n🎉 ALL PURE KINSHIP DOMAIN CORE TESTS PASSED WITH 100% SUCCESS!');
