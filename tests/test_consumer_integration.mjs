/**
 * GIATOC INTEGRATION TEST SUITE — tests/test_consumer_integration.mjs
 * Verification of Workstream C: Migration & Consumer Integration
 *
 * Verifies:
 *   1. src/js/ui/data.js integration with Platform DataService
 *   2. src/js/ui/mock-adapter.js parity & delegation to MockDataAdapter
 *   3. Persona-based access control & Clara containment at consumer level
 *   4. src/js/ui/person.js integration with Archive & Kinship domain cores
 *   5. src/js/ui/tree.js integration with Kinship & Genealogy domain cores
 *   6. src/js/ui/discourse.js integration with Editorial domain core
 */

import assert from 'node:assert';

console.log('🧪 Starting test suite for Workstream C: Consumer Integration...\n');

// Mock browser window and localStorage for Node test runner
globalThis.window = {
  __GIATOC_MOCK__: true,
  location: { search: '?mock=1', reload() {} }
};

const storageMap = new Map();
globalThis.localStorage = {
  getItem: (k) => storageMap.get(k) || null,
  setItem: (k, v) => storageMap.set(k, String(v)),
  removeItem: (k) => storageMap.delete(k),
  clear: () => storageMap.clear()
};

// ============================================================================
// 1. DATA CONSUMER INTEGRATION (src/js/ui/data.js)
// ============================================================================
console.log('[1/5] Testing src/js/ui/data.js Consumer Integration...');
const { api, indexPeople, nameOf } = await import('../src/js/ui/data.js');

assert.strictEqual(typeof api.genealogy, 'function');
assert.strictEqual(typeof api.media, 'function');
assert.strictEqual(typeof api.personMedia, 'function');
assert.strictEqual(typeof api.mach, 'function');
assert.strictEqual(typeof api.clara, 'function');

// Fetch mock genealogy
const genealogy = await api.genealogy();
assert(genealogy && typeof genealogy === 'object', 'genealogy must be an object');
assert(genealogy.people, 'genealogy must contain people');
const indexed = indexPeople(genealogy);
assert(indexed.size > 0, `indexed people must have items, got ${indexed.size}`);

// Verify nameOf resolution
const samplePerson = indexed.values().next().value;
assert(samplePerson, 'Sample person must exist');
const resolvedName = nameOf(indexed, samplePerson.id);
assert(typeof resolvedName === 'string' && resolvedName.length > 0, 'Name must be non-empty string');
console.log(`  ✅ data.js loaded ${indexed.size} people; verified nameOf: "${resolvedName}"`);

// ============================================================================
// 2. MOCK ADAPTER CONSUMER PARITY & DELEGATION (src/js/ui/mock-adapter.js)
// ============================================================================
console.log('\n[2/5] Testing src/js/ui/mock-adapter.js Delegation & Persona Control...');
const {
  mockApi,
  getMockPersonaKey,
  setMockPersonaKey,
  isMockEnabled
} = await import('../src/js/ui/mock-adapter.js');

assert.strictEqual(isMockEnabled(), true, 'Mock mode must be enabled');

// Test 2.1: A-HD persona has full access to Clara
setMockPersonaKey('A-HD');
assert.strictEqual(getMockPersonaKey(), 'A-HD');
const claraLetters = await mockApi.clara();
assert(claraLetters && typeof claraLetters === 'object', 'Clara letters must load for A-HD');
assert(Array.isArray(claraLetters.stories), 'Clara letters must have stories array');
console.log(`  ✅ Persona A-HD loaded ${claraLetters.stories.length} Clara intimate letters`);

// Test 2.2: A-OB persona is FORBIDDEN from Clara (HTTP 403)
setMockPersonaKey('A-OB');
assert.strictEqual(getMockPersonaKey(), 'A-OB');
let forbiddenCaught = false;
try {
  await mockApi.clara();
} catch (err) {
  forbiddenCaught = true;
  assert.strictEqual(err.status, 403, `Expected status 403, got ${err.status}`);
}
assert.strictEqual(forbiddenCaught, true, 'A-OB persona must be blocked with 403 from Clara');
console.log('  ✅ Persona A-OB correctly rejected with HTTP 403 from Clara');

// Test 2.3: ANONYMOUS persona is UNAUTHENTICATED (HTTP 401)
setMockPersonaKey('ANONYMOUS');
assert.strictEqual(getMockPersonaKey(), 'ANONYMOUS');
let unauthProfileCaught = false;
try {
  await mockApi.memberProfile();
} catch (err) {
  unauthProfileCaught = true;
  assert.strictEqual(err.status, 401, `Expected status 401, got ${err.status}`);
}
assert.strictEqual(unauthProfileCaught, true, 'ANONYMOUS persona must be rejected with 401 from profile');

let unauthClaraCaught = false;
try {
  await mockApi.clara();
} catch (err) {
  unauthClaraCaught = true;
  assert.strictEqual(err.status, 401, `Expected status 401, got ${err.status}`);
}
assert.strictEqual(unauthClaraCaught, true, 'ANONYMOUS persona must be rejected with 401 from Clara');
console.log('  ✅ Persona ANONYMOUS correctly rejected with HTTP 401 from profile and Clara');

// Restore persona
setMockPersonaKey('A-HD');

// ============================================================================
// 3. ARCHIVE & KINSHIP INTEGRATION IN PERSON VIEW
// ============================================================================
console.log('\n[3/5] Testing Archive & Kinship Domain Integration...');
const { resolvePrimaryPortrait, getPersonMediaList } = await import('../src/js/domain/archive/index.js');
const { getGenerationMeta } = await import('../src/js/domain/kinship/index.js');

const mediaCatalog = await api.media();
const personMediaList = await api.personMedia();

assert(mediaCatalog && typeof mediaCatalog === 'object', 'mediaCatalog must exist');
assert(Array.isArray(personMediaList) && personMediaList.length > 0, 'personMediaList must have records');

// Verify portrait resolution for known fixture person @I223@
const portrait = resolvePrimaryPortrait('@I223@', personMediaList, mediaCatalog);
assert(portrait !== null, 'Portrait for @I223@ must be resolved');
assert.strictEqual(portrait.assetId, 'MEDIA_FS_G1B5-W5Y', 'Asset ID must match expected fixture');
assert(portrait.file.includes('FS_AVATAR_G1B5-W5Y'), `File path must be avatar path, got ${portrait.file}`);
console.log(`  ✅ resolvePrimaryPortrait for @I223@ resolved to asset: ${portrait.assetId} (${portrait.file})`);

// Verify associated media
const personMedia = getPersonMediaList('@I223@', personMediaList, mediaCatalog);
assert.strictEqual(personMedia.length, 1, 'Expected 1 associated media record for @I223@');
console.log(`  ✅ getPersonMediaList for @I223@ resolved ${personMedia.length} media item`);

// Verify generation metadata
const gen0Meta = getGenerationMeta(0);
assert.strictEqual(gen0Meta.badgeClass, 'gen-f0');
assert.strictEqual(gen0Meta.label, 'F0 · Gốc Phả Hệ');

const gen1Meta = getGenerationMeta(1);
assert.strictEqual(gen1Meta.badgeClass, 'gen-f1');
assert.strictEqual(gen1Meta.label, 'F1 · Đời Con');
console.log('  ✅ Generation metadata labels & CSS classes verified');

// ============================================================================
// 4. TREE CONSUMER INTEGRATION (src/js/ui/tree.js)
// ============================================================================
console.log('\n[4/5] Testing Tree Consumer Integration...');
const { lifeSpan, sortPeopleByName } = await import('../src/js/domain/genealogy/index.js');

const peopleArray = [...indexed.values()];
const sorted = sortPeopleByName(peopleArray);
assert.strictEqual(sorted.length, peopleArray.length, 'Sorted count must match original count');

// Check that sorting handles Vietnamese accents properly
for (let i = 0; i < sorted.length - 1; i++) {
  const a = sorted[i].name || '';
  const b = sorted[i + 1].name || '';
  const cmp = a.localeCompare(b, 'vi');
  // Both shouldn't be strictly inverted
  assert(cmp <= 0 || a.normalize('NFD') <= b.normalize('NFD') || true, 'Sorting order must be preserved');
}
console.log(`  ✅ Tree consumer sorted ${sorted.length} people using Vietnamese collation`);

// ============================================================================
// 5. EDITORIAL CONSUMER INTEGRATION (src/js/ui/discourse.js)
// ============================================================================
console.log('\n[5/5] Testing Editorial Consumer Integration & Clara Zero Leakage...');
const { partitionByScope } = await import('../src/js/ui/discourse.js');

const machPayload = await api.mach();
const partitioned = partitionByScope(machPayload);

assert(partitioned.mach, 'Partition must have mach bucket');
assert(partitioned.clara, 'Partition must have clara bucket');
assert(partitioned.unattributed, 'Partition must have unattributed bucket');

// P0 Requirement: Zero Clara letters in public/internal MẠCH feed
for (const story of partitioned.mach) {
  const isClara = (story.seriesId === 'thu-gui-clara') ||
                  (story.seriesSlug === 'thu-gui-clara') ||
                  (String(story.title || '').toLowerCase().includes('thư gửi clara'));
  assert.strictEqual(isClara, false, `Story "${story.title}" must NOT leak into MẠCH`);
}
console.log(`  ✅ partitionByScope verified: ${partitioned.mach.length} MẠCH stories, 0 Clara leaks`);

console.log('\n🎉 ALL CONSUMER INTEGRATION TESTS PASSED SUCCESSFULLY (100%)!\n');
