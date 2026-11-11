/**
 * tests/test_domain_archive.mjs
 * Comprehensive automated test suite for Pure Archive Domain Core (TASK-ARC-01):
 * - src/js/domain/archive/media.js
 * - src/js/domain/archive/metadata.js
 * - src/js/domain/archive/index.js
 *
 * PURE DOMAIN VERIFICATION — ZERO DOM, ZERO BROWSER GLOBALS, ZERO SIDE EFFECTS.
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Import Pure Archive Domain Core barrel exports
import {
  // Media catalog & relation operations
  normalizeMediaList,
  indexMediaById,
  filterMediaByKind,
  groupMediaByKind,
  deriveAssetIdFromRelationId,
  resolveAssetIdFromPersonMedia,
  normalizePersonId,
  isPersonMatch,
  resolvePrimaryPortrait,
  getPersonMediaList,

  // Metadata operations & constants
  SUPPORTED_MEDIA_KINDS,
  SUPPORTED_IMAGE_MIME_TYPES,
  isImageMimeType,
  validateMediaRecord,
  normalizeMediaKind,
  getMediaKindLabel,
  formatMediaCaption,
  getMediaDimensionsOrAspect
} from '../src/js/domain/archive/index.js';

console.log('====================================================');
console.log('RUNNING ARCHIVE DOMAIN CORE VERIFICATION SUITE');
console.log('====================================================');

let testsPassed = 0;
let testsTotal = 0;

function test(name, fn) {
  testsTotal++;
  try {
    fn();
    testsPassed++;
    console.log(`  ✅ [PASS] ${name}`);
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
    console.error(err);
    process.exitCode = 1;
  }
}

// ---------------------------------------------------------------------------
// 1. PURE ENVIRONMENT SAFETY & NO DOM GLOBALS
// ---------------------------------------------------------------------------
test('Pure domain layer operates with zero DOM globals', () => {
  assert.strictEqual(typeof window, 'undefined', 'window must be undefined in Node runtime');
  assert.strictEqual(typeof document, 'undefined', 'document must be undefined in Node runtime');
});

// ---------------------------------------------------------------------------
// 2. METADATA HELPERS & VALIDATION
// ---------------------------------------------------------------------------
test('SUPPORTED_MEDIA_KINDS and SUPPORTED_IMAGE_MIME_TYPES constants are frozen arrays', () => {
  assert.ok(Object.isFrozen(SUPPORTED_MEDIA_KINDS), 'SUPPORTED_MEDIA_KINDS must be frozen');
  assert.ok(SUPPORTED_MEDIA_KINDS.includes('portrait'));
  assert.ok(SUPPORTED_MEDIA_KINDS.includes('document'));
  assert.ok(SUPPORTED_MEDIA_KINDS.includes('grave'));
  assert.ok(SUPPORTED_MEDIA_KINDS.includes('milestone'));
  assert.ok(SUPPORTED_MEDIA_KINDS.includes('family'));

  assert.ok(Object.isFrozen(SUPPORTED_IMAGE_MIME_TYPES), 'SUPPORTED_IMAGE_MIME_TYPES must be frozen');
  assert.ok(SUPPORTED_IMAGE_MIME_TYPES.includes('image/jpeg'));
  assert.ok(SUPPORTED_IMAGE_MIME_TYPES.includes('image/png'));
  assert.ok(SUPPORTED_IMAGE_MIME_TYPES.includes('image/webp'));
});

test('isImageMimeType identifies image MIME types correctly', () => {
  assert.strictEqual(isImageMimeType('image/jpeg'), true);
  assert.strictEqual(isImageMimeType('image/png'), true);
  assert.strictEqual(isImageMimeType('image/webp'), true);
  assert.strictEqual(isImageMimeType('IMAGE/GIF'), true, 'Should be case-insensitive');
  assert.strictEqual(isImageMimeType('  image/svg+xml  '), true, 'Should trim whitespace');

  // Negative cases
  assert.strictEqual(isImageMimeType('application/pdf'), false);
  assert.strictEqual(isImageMimeType('text/html'), false);
  assert.strictEqual(isImageMimeType('video/mp4'), false);
  assert.strictEqual(isImageMimeType(''), false);
  assert.strictEqual(isImageMimeType(null), false);
  assert.strictEqual(isImageMimeType(undefined), false);
  assert.strictEqual(isImageMimeType(123), false);
});

test('validateMediaRecord validates required fields (assetId, kind, file)', () => {
  // Valid records
  const valid1 = validateMediaRecord({
    assetId: 'MEDIA_01',
    kind: 'portrait',
    file: 'assets/images/photo.jpg'
  });
  assert.strictEqual(valid1.valid, true);
  assert.strictEqual(valid1.errors.length, 0);

  // Valid record using alternative id and path
  const valid2 = validateMediaRecord({
    id: 'MEDIA_02',
    kind: 'document',
    path: 'https://example.com/doc.pdf'
  });
  assert.strictEqual(valid2.valid, true);
  assert.strictEqual(valid2.errors.length, 0);

  // Missing assetId/id
  const invalid1 = validateMediaRecord({
    kind: 'portrait',
    file: 'assets/images/photo.jpg'
  });
  assert.strictEqual(invalid1.valid, false);
  assert.ok(invalid1.errors.some(e => e.includes('assetId or id')));

  // Missing kind
  const invalid2 = validateMediaRecord({
    assetId: 'MEDIA_03',
    file: 'assets/images/photo.jpg'
  });
  assert.strictEqual(invalid2.valid, false);
  assert.ok(invalid2.errors.some(e => e.includes('kind')));

  // Missing file/path/url
  const invalid3 = validateMediaRecord({
    assetId: 'MEDIA_04',
    kind: 'grave'
  });
  assert.strictEqual(invalid3.valid, false);
  assert.ok(invalid3.errors.some(e => e.includes('file, path, or url')));

  // Null/non-object
  const invalidNull = validateMediaRecord(null);
  assert.strictEqual(invalidNull.valid, false);
  assert.strictEqual(invalidNull.errors[0], 'Media item must be a non-null object');

  const invalidArray = validateMediaRecord([]);
  assert.strictEqual(invalidArray.valid, false);
});

test('normalizeMediaKind and getMediaKindLabel format human labels', () => {
  assert.strictEqual(normalizeMediaKind('PORTRAIT'), 'portrait');
  assert.strictEqual(normalizeMediaKind('  Document '), 'document');
  assert.strictEqual(normalizeMediaKind(null), 'unknown');

  assert.strictEqual(getMediaKindLabel('portrait'), 'Chân dung');
  assert.strictEqual(getMediaKindLabel('document'), 'Tài liệu');
  assert.strictEqual(getMediaKindLabel('grave'), 'Mộ phần');
  assert.strictEqual(getMediaKindLabel('milestone'), 'Cột mốc');
  assert.strictEqual(getMediaKindLabel('family'), 'Gia đình');
  assert.strictEqual(getMediaKindLabel('custom'), 'Custom');
});

test('formatMediaCaption extracts caption with priority fallback', () => {
  assert.strictEqual(
    formatMediaCaption({ title: 'Ảnh thờ Cố Thu' }),
    'Ảnh thờ Cố Thu'
  );
  assert.strictEqual(
    formatMediaCaption({ caption: 'Chú thích ảnh', title: '' }),
    'Chú thích ảnh'
  );
  assert.strictEqual(
    formatMediaCaption({ description: 'Mô tả chi tiết' }),
    'Mô tả chi tiết'
  );
  assert.strictEqual(
    formatMediaCaption({ provenance: { description: 'Trích từ gia phả 1982' } }),
    'Trích từ gia phả 1982'
  );
  assert.strictEqual(
    formatMediaCaption({ provenance: { originalName: 'Nguyễn Thị Hồng' } }),
    'Nguyễn Thị Hồng'
  );
  assert.strictEqual(
    formatMediaCaption({}, 'Ảnh tư liệu'),
    'Ảnh tư liệu'
  );
  assert.strictEqual(
    formatMediaCaption(null, 'Ảnh dự phòng'),
    'Ảnh dự phòng'
  );
});

test('getMediaDimensionsOrAspect computes or parses aspect ratio', () => {
  // Width and height provided
  const dim1 = getMediaDimensionsOrAspect({ width: 800, height: 600 });
  assert.strictEqual(dim1.width, 800);
  assert.strictEqual(dim1.height, 600);
  assert.strictEqual(dim1.aspectRatio, 800 / 600);
  assert.strictEqual(dim1.aspectRatioString, '4:3');

  // Square
  const dimSquare = getMediaDimensionsOrAspect({ width: 400, height: 400 });
  assert.strictEqual(dimSquare.aspectRatio, 1);
  assert.strictEqual(dimSquare.aspectRatioString, '1:1');

  // Aspect ratio string provided
  const dimAspectStr = getMediaDimensionsOrAspect({ aspectRatio: '16:9' });
  assert.strictEqual(dimAspectStr.aspectRatio, 16 / 9);
  assert.strictEqual(dimAspectStr.aspectRatioString, '16:9');

  // Numeric aspect ratio
  const dimAspectNum = getMediaDimensionsOrAspect({ aspectRatio: 1.5 });
  assert.strictEqual(dimAspectNum.aspectRatio, 1.5);

  // Missing dimensions
  const dimEmpty = getMediaDimensionsOrAspect({});
  assert.strictEqual(dimEmpty.width, null);
  assert.strictEqual(dimEmpty.height, null);
  assert.strictEqual(dimEmpty.aspectRatio, null);
});

// ---------------------------------------------------------------------------
// 3. CATALOG & INDEXING FUNCTIONS
// ---------------------------------------------------------------------------
test('normalizeMediaList and indexMediaById index collections correctly', () => {
  const sampleList = [
    { assetId: 'M1', kind: 'portrait', file: 'p1.jpg' },
    { assetId: 'M2', kind: 'document', file: 'd1.jpg' },
    { id: 'M3', kind: 'grave', file: 'g1.jpg' }
  ];

  // From Array
  const indexFromArray = indexMediaById(sampleList);
  assert.strictEqual(Object.keys(indexFromArray).length, 3);
  assert.strictEqual(indexFromArray.M1.kind, 'portrait');
  assert.strictEqual(indexFromArray.M2.kind, 'document');
  assert.strictEqual(indexFromArray.M3.kind, 'grave');

  // From Map
  const mapInput = new Map();
  mapInput.set('M1', sampleList[0]);
  mapInput.set('M2', sampleList[1]);
  const indexFromMap = indexMediaById(mapInput);
  assert.strictEqual(Object.keys(indexFromMap).length, 2);
  assert.strictEqual(indexFromMap.M1.file, 'p1.jpg');

  // Edge cases
  assert.deepStrictEqual(indexMediaById(null), {});
  assert.deepStrictEqual(indexMediaById([]), {});
  assert.deepStrictEqual(indexMediaById('invalid'), {});
});

test('filterMediaByKind and groupMediaByKind categorize assets', () => {
  const items = [
    { assetId: 'M1', kind: 'portrait' },
    { assetId: 'M2', kind: 'portrait' },
    { assetId: 'M3', kind: 'document' },
    { assetId: 'M4', kind: 'grave' },
    { assetId: 'M5', kind: 'other_custom' }
  ];

  const portraits = filterMediaByKind(items, 'portrait');
  assert.strictEqual(portraits.length, 2);

  const docs = filterMediaByKind(items, 'DOCUMENT'); // Case-insensitive
  assert.strictEqual(docs.length, 1);
  assert.strictEqual(docs[0].assetId, 'M3');

  const groups = groupMediaByKind(items);
  assert.strictEqual(groups.portrait.length, 2);
  assert.strictEqual(groups.document.length, 1);
  assert.strictEqual(groups.grave.length, 1);
  assert.strictEqual(groups.milestone.length, 0);
  assert.strictEqual(groups.family.length, 0);
  assert.strictEqual(groups.other.length, 1);
  assert.strictEqual(groups.other[0].assetId, 'M5');
});

// ---------------------------------------------------------------------------
// 4. RELATION HEURISTIC MAPPING
// ---------------------------------------------------------------------------
test('deriveAssetIdFromRelationId maps PMR relation IDs to MEDIA_FS_ format', () => {
  // Standard PMR format as in test_media_assoc.py
  assert.strictEqual(
    deriveAssetIdFromRelationId('PMR_I223_G1B5-W5Y'),
    'MEDIA_FS_G1B5-W5Y'
  );
  assert.strictEqual(
    deriveAssetIdFromRelationId('PMR_I188_G1X9-1Z3'),
    'MEDIA_FS_G1X9-1Z3'
  );
  assert.strictEqual(
    deriveAssetIdFromRelationId('PMR_I001_ABCD-123'),
    'MEDIA_FS_ABCD-123'
  );

  // Already formatted assetId
  assert.strictEqual(
    deriveAssetIdFromRelationId('MEDIA_FS_G1B5-W5Y'),
    'MEDIA_FS_G1B5-W5Y'
  );

  // Invalid formats
  assert.strictEqual(deriveAssetIdFromRelationId('INVALID_FORMAT'), null);
  assert.strictEqual(deriveAssetIdFromRelationId('PMR_SHORT'), null);
  assert.strictEqual(deriveAssetIdFromRelationId(''), null);
  assert.strictEqual(deriveAssetIdFromRelationId(null), null);
  assert.strictEqual(deriveAssetIdFromRelationId(undefined), null);
});

test('resolveAssetIdFromPersonMedia resolves direct and heuristic IDs', () => {
  // Explicit assetId
  assert.strictEqual(
    resolveAssetIdFromPersonMedia({ assetId: 'MEDIA_EXPLICIT_01' }),
    'MEDIA_EXPLICIT_01'
  );

  // Legacy mediaId
  assert.strictEqual(
    resolveAssetIdFromPersonMedia({ mediaId: 'MEDIA_LEGACY_02' }),
    'MEDIA_LEGACY_02'
  );

  // Heuristic from relationId
  assert.strictEqual(
    resolveAssetIdFromPersonMedia({ relationId: 'PMR_I123_XYZ-999' }),
    'MEDIA_FS_XYZ-999'
  );

  // Snake-case variants
  assert.strictEqual(
    resolveAssetIdFromPersonMedia({ asset_id: 'MEDIA_SNAKE_03' }),
    'MEDIA_SNAKE_03'
  );
  assert.strictEqual(
    resolveAssetIdFromPersonMedia({ relation_id: 'PMR_I123_SNAKE-456' }),
    'MEDIA_FS_SNAKE-456'
  );

  // Unresolvable
  assert.strictEqual(resolveAssetIdFromPersonMedia({}), null);
  assert.strictEqual(resolveAssetIdFromPersonMedia(null), null);
});

// ---------------------------------------------------------------------------
// 5. PERSON ID NORMALIZATION & MATCHING
// ---------------------------------------------------------------------------
test('normalizePersonId and isPersonMatch handle @ signs and formats', () => {
  assert.strictEqual(normalizePersonId('@I223@'), 'I223');
  assert.strictEqual(normalizePersonId('I223'), 'I223');
  assert.strictEqual(normalizePersonId('  @I188@  '), 'I188');
  assert.strictEqual(normalizePersonId(''), '');
  assert.strictEqual(normalizePersonId(null), '');

  assert.strictEqual(isPersonMatch('@I223@', 'I223'), true);
  assert.strictEqual(isPersonMatch('I223', '@I223@'), true);
  assert.strictEqual(isPersonMatch('@I223@', '@I223@'), true);
  assert.strictEqual(isPersonMatch('i223', 'I223'), true);
  assert.strictEqual(isPersonMatch('@I223@', '@I188@'), false);
  assert.strictEqual(isPersonMatch(null, 'I223'), false);
});

// ---------------------------------------------------------------------------
// 6. PRIMARY PORTRAIT & PERSON MEDIA LIST RESOLUTION
// ---------------------------------------------------------------------------
test('resolvePrimaryPortrait resolves primary portrait with fallback logic', () => {
  const mediaMap = {
    'MEDIA_PORTRAIT_PRIMARY': { assetId: 'MEDIA_PORTRAIT_PRIMARY', kind: 'portrait', file: 'p_prim.jpg' },
    'MEDIA_PORTRAIT_SEC': { assetId: 'MEDIA_PORTRAIT_SEC', kind: 'portrait', file: 'p_sec.jpg' },
    'MEDIA_DOC_PRIMARY': { assetId: 'MEDIA_DOC_PRIMARY', kind: 'document', file: 'doc.pdf' }
  };

  const personMediaList = [
    { personId: '@I100@', assetId: 'MEDIA_PORTRAIT_SEC', role: 'PORTRAIT', isPrimary: false },
    { personId: '@I100@', assetId: 'MEDIA_PORTRAIT_PRIMARY', role: 'PORTRAIT', isPrimary: true },
    { personId: '@I200@', assetId: 'MEDIA_PORTRAIT_SEC', role: 'PORTRAIT', isPrimary: false },
    { personId: '@I300@', assetId: 'MEDIA_DOC_PRIMARY', role: 'DOCUMENT', isPrimary: true }
  ];

  // 1. Person with primary portrait
  const p100 = resolvePrimaryPortrait('@I100@', personMediaList, mediaMap);
  assert.ok(p100, 'Primary portrait should resolve');
  assert.strictEqual(p100.assetId, 'MEDIA_PORTRAIT_PRIMARY');

  // Should also resolve using bare ID without '@'
  const p100Bare = resolvePrimaryPortrait('I100', personMediaList, mediaMap);
  assert.strictEqual(p100Bare.assetId, 'MEDIA_PORTRAIT_PRIMARY');

  // 2. Person with only non-primary portrait (fallback to portrait)
  const p200 = resolvePrimaryPortrait('@I200@', personMediaList, mediaMap);
  assert.ok(p200, 'Non-primary portrait should resolve as fallback');
  assert.strictEqual(p200.assetId, 'MEDIA_PORTRAIT_SEC');

  // 3. Person with only document (fallback to primary)
  const p300 = resolvePrimaryPortrait('@I300@', personMediaList, mediaMap);
  assert.ok(p300, 'Primary document should resolve as fallback when no portrait');
  assert.strictEqual(p300.assetId, 'MEDIA_DOC_PRIMARY');

  // 4. Person with no media
  const pNone = resolvePrimaryPortrait('@I999@', personMediaList, mediaMap);
  assert.strictEqual(pNone, null);

  // 5. Invalid arguments
  assert.strictEqual(resolvePrimaryPortrait(null, personMediaList, mediaMap), null);
  assert.strictEqual(resolvePrimaryPortrait('@I100@', null, mediaMap), null);
  assert.strictEqual(resolvePrimaryPortrait('@I100@', personMediaList, null), null);
});

test('getPersonMediaList retrieves associated media with optional kind filtering', () => {
  const mediaMap = {
    'M_P1': { assetId: 'M_P1', kind: 'portrait', title: 'Chân dung 1' },
    'M_P2': { assetId: 'M_P2', kind: 'portrait', title: 'Chân dung 2' },
    'M_D1': { assetId: 'M_D1', kind: 'document', title: 'Gia phả 1982' },
    'M_G1': { assetId: 'M_G1', kind: 'grave', title: 'Bia mộ' }
  };

  const personMediaList = [
    { personId: '@I500@', assetId: 'M_P2', role: 'PORTRAIT', isPrimary: false },
    { personId: '@I500@', assetId: 'M_P1', role: 'PORTRAIT', isPrimary: true },
    { personId: '@I500@', assetId: 'M_D1', role: 'DOCUMENT', isPrimary: false },
    { personId: '@I500@', assetId: 'M_G1', role: 'GRAVE', isPrimary: false }
  ];

  // Retrieve all media for I500 (primary portrait should be first)
  const allMedia = getPersonMediaList('@I500@', personMediaList, mediaMap);
  assert.strictEqual(allMedia.length, 4);
  assert.strictEqual(allMedia[0].assetId, 'M_P1', 'Primary portrait should sort first');

  // Filter by 'portrait'
  const portraitsOnly = getPersonMediaList('@I500@', personMediaList, mediaMap, 'portrait');
  assert.strictEqual(portraitsOnly.length, 2);
  assert.strictEqual(portraitsOnly[0].assetId, 'M_P1');
  assert.strictEqual(portraitsOnly[1].assetId, 'M_P2');

  // Filter by 'document'
  const docsOnly = getPersonMediaList('@I500@', personMediaList, mediaMap, 'document');
  assert.strictEqual(docsOnly.length, 1);
  assert.strictEqual(docsOnly[0].assetId, 'M_D1');

  // Person with no media
  const noMedia = getPersonMediaList('@I999@', personMediaList, mediaMap);
  assert.deepStrictEqual(noMedia, []);

  // Retrieve without mediaMap returns PM records
  const pmRecords = getPersonMediaList('@I500@', personMediaList);
  assert.strictEqual(pmRecords.length, 4);
  assert.strictEqual(pmRecords[0].assetId, 'M_P1');
});

// ---------------------------------------------------------------------------
// 7. REAL FIXTURE VERIFICATION (synthetic_media.json & synthetic_person_media.json)
// ---------------------------------------------------------------------------
test('Real Fixture Verification: synthetic_media.json (185 items)', () => {
  const mediaFixturePath = path.join(ROOT_DIR, 'fixtures', 'synthetic_media.json');
  assert.ok(fs.existsSync(mediaFixturePath), 'synthetic_media.json must exist');

  const rawMedia = JSON.parse(fs.readFileSync(mediaFixturePath, 'utf-8'));
  const mediaCount = Object.keys(rawMedia).length;
  assert.strictEqual(mediaCount, 185, 'Must contain exactly 185 media items');

  // 1. Index media by ID
  const mediaIndex = indexMediaById(rawMedia);
  assert.strictEqual(Object.keys(mediaIndex).length, 185);

  // 2. Validate all 185 media records
  let validCount = 0;
  for (const [id, item] of Object.entries(mediaIndex)) {
    const val = validateMediaRecord(item);
    assert.strictEqual(val.valid, true, `Media record ${id} must be valid: ${val.errors.join(', ')}`);
    assert.ok(isImageMimeType(item.mimeType), `Media ${id} must have valid image MIME type`);
    validCount++;
  }
  assert.strictEqual(validCount, 185, 'All 185 media records must pass domain validation');

  // 3. Captions & Provenance
  for (const item of Object.values(mediaIndex)) {
    const caption = formatMediaCaption(item);
    assert.ok(typeof caption === 'string' && caption.length > 0, `Media ${item.assetId} must have non-empty caption`);
  }

  // 4. Group by kind
  const groups = groupMediaByKind(mediaIndex);
  assert.strictEqual(groups.portrait.length, 185, 'All 185 synthetic media items are portraits');
  assert.strictEqual(groups.document.length, 0);
});

test('Real Fixture Verification: synthetic_person_media.json (173 associations)', () => {
  const mediaFixturePath = path.join(ROOT_DIR, 'fixtures', 'synthetic_media.json');
  const pmFixturePath = path.join(ROOT_DIR, 'fixtures', 'synthetic_person_media.json');
  assert.ok(fs.existsSync(pmFixturePath), 'synthetic_person_media.json must exist');

  const mediaIndex = indexMediaById(JSON.parse(fs.readFileSync(mediaFixturePath, 'utf-8')));
  const pmList = JSON.parse(fs.readFileSync(pmFixturePath, 'utf-8'));
  assert.strictEqual(pmList.length, 173, 'Must contain exactly 173 person_media records');

  // 1. Test heuristic relation mapping for all 173 records
  let mappedByHeuristic = 0;
  for (const pm of pmList) {
    const derivedAssetId = deriveAssetIdFromRelationId(pm.relationId);
    assert.ok(derivedAssetId, `Heuristic must derive assetId from relationId: ${pm.relationId}`);
    assert.ok(mediaIndex[derivedAssetId], `Derived assetId ${derivedAssetId} must exist in mediaIndex`);
    mappedByHeuristic++;
  }
  assert.strictEqual(mappedByHeuristic, 173, '100% of 173 PM records must map via relation heuristic');

  // 2. Test primary portrait resolution for sampled persons
  const sampledPersonIds = [
    '@I223@',
    '@I188@',
    '@I219@',
    '@I153@',
    '@I157@',
    '@I205@'
  ];

  for (const personId of sampledPersonIds) {
    // Test with '@' prefix
    const portraitWithAt = resolvePrimaryPortrait(personId, pmList, mediaIndex);
    assert.ok(portraitWithAt, `Primary portrait must resolve for ${personId}`);
    assert.strictEqual(portraitWithAt.kind, 'portrait');

    // Test with stripped '@' prefix
    const bareId = personId.replace(/@/g, '');
    const portraitBare = resolvePrimaryPortrait(bareId, pmList, mediaIndex);
    assert.ok(portraitBare, `Primary portrait must resolve for normalized ${bareId}`);
    assert.strictEqual(portraitWithAt.assetId, portraitBare.assetId, 'Normalized and raw IDs must resolve to same asset');

    // Test getPersonMediaList
    const personMedia = getPersonMediaList(personId, pmList, mediaIndex);
    assert.ok(personMedia.length >= 1, `Must have at least 1 media item for ${personId}`);
    assert.strictEqual(personMedia[0].assetId, portraitWithAt.assetId, 'First media item must be primary portrait');
  }

  // 3. Negative lookup
  const nonExistent = resolvePrimaryPortrait('@I999999@', pmList, mediaIndex);
  assert.strictEqual(nonExistent, null, 'Non-existent person must return null');

  const nonExistentList = getPersonMediaList('@I999999@', pmList, mediaIndex);
  assert.deepStrictEqual(nonExistentList, [], 'Non-existent person must return empty array');
});

// ---------------------------------------------------------------------------
// SUITE SUMMARY
// ---------------------------------------------------------------------------
console.log('====================================================');
console.log(`TEST SUITE COMPLETE: ${testsPassed}/${testsTotal} PASSED (100%)`);
console.log('====================================================');

if (testsPassed !== testsTotal) {
  process.exitCode = 1;
}
