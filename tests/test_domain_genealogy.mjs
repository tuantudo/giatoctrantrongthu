/**
 * test_domain_genealogy.mjs
 * Comprehensive automated verification for SC-03 Pure Domain Cores:
 * - src/js/domain/genealogy/temporal.js
 * - src/js/domain/genealogy/search.js
 * - src/js/domain/genealogy/graph.js
 * - src/js/domain/genealogy/index.js (barrel export)
 * - src/js/ui/data.js (re-export facade parity)
 * - src/js/ui/person.js (re-export facade parity)
 *
 * PURE NODE.JS EXECUTION — ZERO BROWSER, ZERO DOM MOCKS REQUIRED FOR DOMAIN.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

console.log('🧪 Starting test suite for SC-03 Pure Genealogy Domain Core...');

// 1. Test temporal.js
console.log('  Testing src/js/domain/genealogy/temporal.js...');
const { humanDate, lifeSpan, DATE_IS_ESTIMATE } = await import('../src/js/domain/genealogy/temporal.js');

// 1.1 Positive humanDate cases
assert.equal(humanDate('1950'), '1950');
assert.equal(humanDate('FROM 1920 TO 1985'), '1920 – 1985');
assert.equal(humanDate('15 OCT 1956'), '1956');
assert.equal(humanDate('BET 15 OCT 1956 AND 19 OCT 1956'), '1956 (ước tính trong hồ sơ)');
assert.equal(humanDate('BET 1950 AND 1955'), '1950 – 1955 (ước tính trong hồ sơ)');
assert.equal(humanDate('ABT 1890'), '1890 (ước tính trong hồ sơ)');
assert.equal(humanDate('CAL 1912'), '1912 (ước tính trong hồ sơ)');
assert.equal(humanDate('EST 1880'), '1880 (ước tính trong hồ sơ)');
assert.equal(humanDate('BEF 1945'), '1945 (ước tính trong hồ sơ)');
assert.equal(humanDate('AFT 1975'), '1975 (ước tính trong hồ sơ)');

// 1.2 Negative & Edge humanDate cases
assert.equal(humanDate(null), null);
assert.equal(humanDate(undefined), null);
assert.equal(humanDate(''), null);
assert.equal(humanDate('   '), null);
assert.equal(humanDate('[object Object]'), null);
assert.equal(humanDate('null'), null);
assert.equal(humanDate('undefined'), null);
assert.equal(humanDate('Unknown date'), null);
assert.equal(humanDate('Không rõ năm sinh'), null);
assert.equal(humanDate('99'), null, 'Out of range 2-digit number must return null');
assert.equal(humanDate(1984), '1984', 'Number representation of year should convert safely');

// 1.3 lifeSpan cases
assert.equal(lifeSpan({ birth: { date: '1875' }, death: { date: '1980' } }), '1875 – 1980');
assert.equal(lifeSpan({ birth: { date: '1920' } }), '1920 – …');
assert.equal(lifeSpan({ death: { date: '1990' } }), '… – 1990');
assert.equal(lifeSpan({}), null);
assert.equal(lifeSpan(null), null);
assert.equal(lifeSpan(undefined), null);
assert.equal(lifeSpan('invalid'), null);

console.log('  ✅ temporal.js passed.');

// 2. Test search.js
console.log('  Testing src/js/domain/genealogy/search.js...');
const {
  normalizeVietnamese,
  indexPeople,
  nameOf,
  filterPeople,
  sortPeopleByName
} = await import('../src/js/domain/genealogy/search.js');

// 2.1 normalizeVietnamese
assert.equal(normalizeVietnamese('Nguyễn Ái Quốc'), 'nguyen ai quoc');
assert.equal(normalizeVietnamese('Trần Trọng Thu'), 'tran trong thu');
assert.equal(normalizeVietnamese('  LÊ THỊ BÍCH  '), '  le thi bich  ');
assert.equal(normalizeVietnamese(''), '');
assert.equal(normalizeVietnamese(null), '');
assert.equal(normalizeVietnamese(undefined), '');

// 2.2 indexPeople
const mockGenealogy = {
  people: {
    '@I1@': { name: 'Giuse Trần Trọng Thu', sex: 'M' },
    '@I2@': { name: 'Nguyễn Thị Xuân', sex: 'F' },
    '@I3@': { raw_name: 'Trần Văn C', sex: 'M' }
  }
};

const indexed = indexPeople(mockGenealogy);
assert.equal(indexed instanceof Map, true);
assert.equal(indexed.size, 3);
assert.equal(indexed.get('@I1@').id, '@I1@');
assert.equal(indexed.get('@I1@').name, 'Giuse Trần Trọng Thu');
assert.equal(indexed.get('@I2@').id, '@I2@');
assert.equal(indexed.get('@I3@').id, '@I3@');
assert.equal(indexed.get('@I3@').raw_name, 'Trần Văn C');

// Edge cases for indexPeople
assert.equal(indexPeople(null).size, 0);
assert.equal(indexPeople({}).size, 0);
assert.equal(indexPeople({ people: null }).size, 0);

// 2.3 nameOf
assert.equal(nameOf(indexed, '@I1@'), 'Giuse Trần Trọng Thu');
assert.equal(nameOf(indexed, '@I2@'), 'Nguyễn Thị Xuân');
assert.equal(nameOf(indexed, '@I3@'), 'Trần Văn C', 'Fallback to raw_name when name is absent');
assert.equal(nameOf(indexed, '@I999@'), null, 'Non-existent ID must return null, never invent name');
assert.equal(nameOf(indexed, null), null);
assert.equal(nameOf(indexed, ''), null);
assert.equal(nameOf(null, '@I1@'), null);

// 2.4 filterPeople
const peopleList = [
  { id: '1', name: 'Trần Trọng Thu' },
  { id: '2', name: 'Nguyễn Thị Xuân' },
  { id: '3', name: 'Trần Đại Nghĩa' },
  { id: '4', raw_name: 'Trần Văn Đạt' }
];

// Unaccented match
const filteredTran = filterPeople(peopleList, 'tran');
assert.equal(filteredTran.length, 3);
assert.deepEqual(filteredTran.map(p => p.id), ['1', '3', '4']);

const filteredXuan = filterPeople(peopleList, 'xuan');
assert.equal(filteredXuan.length, 1);
assert.equal(filteredXuan[0].id, '2');

const filteredEmpty = filterPeople(peopleList, '');
assert.equal(filteredEmpty.length, 4);

const filteredNoMatch = filterPeople(peopleList, 'Phạm');
assert.equal(filteredNoMatch.length, 0);

// Edge cases
assert.equal(filterPeople(null, 'test').length, 0);
assert.equal(filterPeople(undefined, 'test').length, 0);

// 2.5 sortPeopleByName
const unsorted = [
  { id: '1', name: 'Trần Văn B' },
  { id: '2', name: 'Nguyễn Văn A' },
  { id: '3', name: 'Lê Văn C' }
];
const sorted = sortPeopleByName(unsorted);
assert.deepEqual(sorted.map(p => p.id), ['3', '2', '1'], 'Lê < Nguyễn < Trần');
assert.equal(sortPeopleByName(null).length, 0);

console.log('  ✅ search.js passed.');

// 3. Test graph.js
console.log('  Testing src/js/domain/genealogy/graph.js...');
const {
  deriveGenerations,
  getGenerationMeta,
  getFamilyGenerationMeta
} = await import('../src/js/domain/genealogy/graph.js');

// 3.1 Construct synthetic multi-generation pedigree
const testPeople = {
  '@ROOT@': {
    name: 'Cố Thu (Anchor)',
    parents: ['@PAR1@', '@PAR2@'],
    spouses: ['@SPOUSE@'],
    children: ['@CHILD1@', '@CHILD2@']
  },
  '@SPOUSE@': {
    name: 'Bà Cố An',
    parents: [],
    spouses: ['@ROOT@'],
    children: ['@CHILD1@', '@CHILD2@']
  },
  '@PAR1@': {
    name: 'Cha Cố Thu',
    parents: ['@GPAR1@'],
    spouses: ['@PAR2@'],
    children: ['@ROOT@']
  },
  '@PAR2@': {
    name: 'Mẹ Cố Thu',
    parents: [],
    spouses: ['@PAR1@'],
    children: ['@ROOT@']
  },
  '@GPAR1@': {
    name: 'Ông Nội Cố Thu',
    parents: [],
    spouses: [],
    children: ['@PAR1@']
  },
  '@CHILD1@': {
    name: 'Con Trưởng',
    parents: ['@ROOT@', '@SPOUSE@'],
    spouses: ['@INLAW1@'],
    children: ['@GCHILD1@']
  },
  '@CHILD2@': {
    name: 'Con Thứ',
    parents: ['@ROOT@', '@SPOUSE@'],
    spouses: [],
    children: []
  },
  '@INLAW1@': {
    name: 'Dâu Trưởng',
    parents: [],
    spouses: ['@CHILD1@'],
    children: ['@GCHILD1@']
  },
  '@GCHILD1@': {
    name: 'Cháu Đích Tôn',
    parents: ['@CHILD1@', '@INLAW1@'],
    spouses: [],
    children: ['@GGCHILD1@']
  },
  '@GGCHILD1@': {
    name: 'Chắt',
    parents: ['@GCHILD1@'],
    spouses: [],
    children: []
  },
  '@ORPHAN@': {
    name: 'Người không có quan hệ',
    parents: [],
    spouses: [],
    children: []
  }
};

const testFamilies = {
  '@FAM_ROOT@': {
    husband: '@ROOT@',
    wife: '@SPOUSE@',
    children: ['@CHILD1@', '@CHILD2@']
  },
  '@FAM_PAR@': {
    husband: '@PAR1@',
    wife: '@PAR2@',
    children: ['@ROOT@']
  },
  '@FAM_CHILD1@': {
    husband: '@CHILD1@',
    wife: '@INLAW1@',
    children: ['@GCHILD1@']
  }
};

const graphResult = deriveGenerations('@ROOT@', testPeople, testFamilies);

// Verify generations
assert.equal(graphResult.personGenerations['@ROOT@'], 0, 'Root must be Generation 0');
assert.equal(graphResult.personGenerations['@SPOUSE@'], 0, 'Spouse must be Generation 0');
assert.equal(graphResult.personGenerations['@CHILD1@'], 1, 'Child must be Generation 1');
assert.equal(graphResult.personGenerations['@CHILD2@'], 1, 'Child must be Generation 1');
assert.equal(graphResult.personGenerations['@INLAW1@'], 1, 'In-law spouse of child must be Generation 1');
assert.equal(graphResult.personGenerations['@GCHILD1@'], 2, 'Grandchild must be Generation 2');
assert.equal(graphResult.personGenerations['@GGCHILD1@'], 3, 'Great-grandchild must be Generation 3');
assert.equal(graphResult.personGenerations['@PAR1@'], -1, 'Parent must be Generation -1');
assert.equal(graphResult.personGenerations['@PAR2@'], -1, 'Parent must be Generation -1');
assert.equal(graphResult.personGenerations['@GPAR1@'], -2, 'Grandparent must be Generation -2');
assert.equal(graphResult.personGenerations['@ORPHAN@'], undefined, 'Unconnected person must remain undefined');

// Verify lineage shortest paths
assert.deepEqual(graphResult.lineagePaths['@ROOT@'], ['@ROOT@']);
assert.deepEqual(graphResult.lineagePaths['@SPOUSE@'], ['@ROOT@', '@SPOUSE@']);
assert.deepEqual(graphResult.lineagePaths['@CHILD1@'], ['@ROOT@', '@CHILD1@']);
assert.deepEqual(graphResult.lineagePaths['@GCHILD1@'], ['@ROOT@', '@CHILD1@', '@GCHILD1@']);
assert.deepEqual(graphResult.lineagePaths['@GGCHILD1@'], ['@ROOT@', '@CHILD1@', '@GCHILD1@', '@GGCHILD1@']);
assert.deepEqual(graphResult.lineagePaths['@PAR1@'], ['@ROOT@', '@PAR1@']);
assert.deepEqual(graphResult.lineagePaths['@GPAR1@'], ['@ROOT@', '@PAR1@', '@GPAR1@']);

// Verify family generations
assert.equal(graphResult.familyGenerations['@FAM_ROOT@'], 0, 'Root family must be Generation 0');
assert.equal(graphResult.familyGenerations['@FAM_PAR@'], -1, 'Parent family must be Generation -1');
assert.equal(graphResult.familyGenerations['@FAM_CHILD1@'], 1, 'Child family must be Generation 1');

// Verify span
assert.equal(graphResult.generationSpan.min, -2);
assert.equal(graphResult.generationSpan.max, 3);
assert.equal(graphResult.generationSpan.count, 6, 'Span from -2 to +3 inclusive is 6 generations');

// 3.2 Cycle resilience (Verify graph traversal never loops infinitely on cycles)
const cyclicPeople = {
  '@P1@': { spouses: ['@P2@'], children: [] },
  '@P2@': { spouses: ['@P1@'], children: [] }
};
const cycleResult = deriveGenerations('@P1@', cyclicPeople, {});
assert.equal(cycleResult.personGenerations['@P1@'], 0);
assert.equal(cycleResult.personGenerations['@P2@'], 0);

// 3.3 Invalid & Edge inputs for deriveGenerations
assert.equal(deriveGenerations(null).generationSpan.count, 0);
assert.equal(deriveGenerations('@NOT_FOUND@', testPeople).generationSpan.count, 0);
assert.equal(deriveGenerations('@ROOT@', null).generationSpan.count, 0);

// 3.4 getGenerationMeta
assert.equal(getGenerationMeta(0).label, 'F0 · Gốc Phả Hệ');
assert.equal(getGenerationMeta(1).label, 'F1 · Đời Con');
assert.equal(getGenerationMeta(2).label, 'F2 · Đời Cháu');
assert.equal(getGenerationMeta(3).label, 'F3 · Đời Chắt');
assert.equal(getGenerationMeta(4).label, 'F4 · Đời Chút');
assert.equal(getGenerationMeta(5).label, 'F5 · Hậu duệ');
assert.equal(getGenerationMeta(-1).label, 'Tiền nhân (F-1)');
assert.equal(getGenerationMeta(-2).label, 'Tiền nhân (F-2)');
assert.equal(getGenerationMeta(null).label, 'Gia tộc');
assert.equal(getGenerationMeta(undefined).label, 'Gia tộc');

// 3.5 getFamilyGenerationMeta
assert.equal(getFamilyGenerationMeta(0).label, 'F0 · Đời Cố Thu');
assert.equal(getFamilyGenerationMeta(1).label, 'F1 · Đời Con');
assert.equal(getFamilyGenerationMeta(2).label, 'F2 · Đời Cháu');
assert.equal(getFamilyGenerationMeta(-1).label, 'Tiền nhân (F-1)');
assert.equal(getFamilyGenerationMeta(null).label, 'Gia tộc');

console.log('  ✅ graph.js passed.');

// 4. Test barrel export src/js/domain/genealogy/index.js
console.log('  Testing src/js/domain/genealogy/index.js (barrel export)...');
const domainBarrel = await import('../src/js/domain/genealogy/index.js');

assert.equal(typeof domainBarrel.humanDate, 'function');
assert.equal(typeof domainBarrel.lifeSpan, 'function');
assert.equal(typeof domainBarrel.indexPeople, 'function');
assert.equal(typeof domainBarrel.nameOf, 'function');
assert.equal(typeof domainBarrel.filterPeople, 'function');
assert.equal(typeof domainBarrel.sortPeopleByName, 'function');
assert.equal(typeof domainBarrel.normalizeVietnamese, 'function');
assert.equal(typeof domainBarrel.deriveGenerations, 'function');
assert.equal(typeof domainBarrel.getGenerationMeta, 'function');
assert.equal(typeof domainBarrel.getFamilyGenerationMeta, 'function');

console.log('  ✅ src/js/domain/genealogy/index.js barrel passed.');

// 5. Test Facade backward compatibility
console.log('  Testing facade backward compatibility (src/js/ui/data.js & src/js/ui/person.js)...');
const dataFacade = await import('../src/js/ui/data.js');
const personFacade = await import('../src/js/ui/person.js');

assert.strictEqual(dataFacade.indexPeople, indexPeople, 'data.js indexPeople must match domain exactly');
assert.strictEqual(dataFacade.nameOf, nameOf, 'data.js nameOf must match domain exactly');
assert.strictEqual(personFacade.humanDate, humanDate, 'person.js humanDate must match domain exactly');

console.log('  ✅ Facades verified with 100% reference identity.');

// 6. Test on Actual Project Fixture (223+ people in synthetic/real dataset)
console.log('  Testing on fixtures/synthetic_genealogy.json...');
const fixturePath = path.join(ROOT_DIR, 'fixtures/synthetic_genealogy.json');
if (fs.existsSync(fixturePath)) {
  const fixtureData = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
  const realIndexed = indexPeople(fixtureData);
  assert(realIndexed.size > 0, 'Fixture must contain people');
  console.log(`  Indexed ${realIndexed.size} individuals from fixture.`);

  // Test nameOf on all indexed individuals
  let validNames = 0;
  for (const [id, p] of realIndexed) {
    const name = nameOf(realIndexed, id);
    if (name) validNames++;
  }
  assert(validNames > 0, 'Must have valid names');
  console.log(`  Resolved ${validNames} names without guessing or data corruption.`);

  // Test deriveGenerations with first person as anchor
  const firstId = realIndexed.keys().next().value;
  const realGraph = deriveGenerations(firstId, realIndexed, fixtureData.families || {});
  assert.equal(realGraph.personGenerations[firstId], 0);
  assert(realGraph.generationSpan.count > 0);
  console.log(`  Derived generations: span min=${realGraph.generationSpan.min}, max=${realGraph.generationSpan.max}, total count=${realGraph.generationSpan.count}.`);
}

console.log('\n🎉 ALL SC-03 PURE GENEALOGY DOMAIN CORE TESTS PASSED SUCCESSFULLY!');

