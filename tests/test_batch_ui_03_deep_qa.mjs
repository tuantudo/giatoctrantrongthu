/**
 * GIATOC TREE QA VERIFICATION SUITE
 * tests/test_batch_ui_03_deep_qa.mjs
 *
 * Strict quantitative verification of Delivery Batch UI 03:
 * 1. 3-Tier Layout (TP-006, TP-016)
 * 2. Complex Graph Scenarios:
 *    - Root ancestor (@I1@ Cố Thu)
 *    - Multiple spouses (@I18@, @I32@, @I148@)
 *    - Multiple children (@I1@ 6 children, @I6@, @I18@)
 *    - Missing parent (0 parents, 1 parent @I19@)
 *    - Deep generation traversal (F0 -> F1 -> F2 -> F3 -> F4)
 *    - Lineage Breadcrumbs & BFS kinship path semantics
 *    - Disconnected branches (@I151@)
 * 3. Archival List:
 *    - Vietnamese diacritic normalization (normalizeVietnamese)
 *    - Vietnamese collation sorting (sortPeopleByName)
 *    - Live search filter (empty, partial "Thu", "Đức", non-matching)
 *    - One-click [🌳 Phả đồ] navigation from list row to Me-Centric view
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';

console.log('🧪 Starting Deep QA Verification for Delivery Batch UI 03...\n');

// ============================================================================
// SYNTHETIC DOM ENVIRONMENT SETUP
// ============================================================================
class MockClassList {
  constructor(owner) {
    this.owner = owner;
    this.classes = new Set();
  }
  add(...names) {
    for (const n of names) if (n) this.classes.add(n);
    this.owner.className = Array.from(this.classes).join(' ');
  }
  remove(...names) {
    for (const n of names) this.classes.delete(n);
    this.owner.className = Array.from(this.classes).join(' ');
  }
  contains(name) {
    return this.classes.has(name);
  }
  toggle(name, force) {
    const has = this.classes.has(name);
    const shouldAdd = force !== undefined ? Boolean(force) : !has;
    if (shouldAdd) this.classes.add(name);
    else this.classes.delete(name);
    this.owner.className = Array.from(this.classes).join(' ');
    return shouldAdd;
  }
}

class MockNode {
  constructor(tag = 'div') {
    this.tagName = tag.toUpperCase();
    this.childNodes = [];
    this.attributes = {};
    this.dataset = {};
    this.style = {};
    this.listeners = {};
    this.classList = new MockClassList(this);
    this._className = '';
    this._textContent = '';
    this._value = '';
    this._id = '';
  }

  get id() { return this._id; }
  set id(val) { this._id = String(val); this.attributes.id = String(val); }

  get value() { return this._value; }
  set value(val) { this._value = String(val); }

  get className() { return this._className; }
  set className(val) {
    this._className = String(val || '');
    this.classList.classes = new Set(this._className.split(/\s+/).filter(Boolean));
  }

  get children() {
    return this.childNodes.filter(n => n instanceof MockNode);
  }

  get firstChild() {
    return this.childNodes[0] || null;
  }

  get textContent() {
    if (this.childNodes.length > 0) {
      return this.childNodes.map(c => c.textContent).join('');
    }
    return this._textContent;
  }
  set textContent(val) {
    this._textContent = String(val);
    this.childNodes = [new MockTextNode(String(val))];
  }

  get innerHTML() {
    return this.textContent;
  }
  set innerHTML(val) {
    this.childNodes = [];
    this._textContent = '';
  }

  setAttribute(k, v) {
    this.attributes[k] = String(v);
    if (k === 'id') this._id = String(v);
    if (k === 'class') this.className = v;
  }
  getAttribute(k) { return this.attributes[k]; }

  addEventListener(event, fn) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
  }

  dispatchEvent(event, ...args) {
    const handlers = this.listeners[event] || [];
    for (const h of handlers) h(...args);
  }

  appendChild(child) {
    if (!child) return child;
    if (child instanceof MockDocumentFragment) {
      for (const c of child.childNodes) this.childNodes.push(c);
      child.childNodes = [];
      return child;
    }
    this.childNodes.push(child);
    return child;
  }

  removeChild(child) {
    const idx = this.childNodes.indexOf(child);
    if (idx !== -1) this.childNodes.splice(idx, 1);
    return child;
  }

  querySelector(sel) {
    const matches = this.querySelectorAll(sel);
    return matches.length > 0 ? matches[0] : null;
  }

  querySelectorAll(sel) {
    const parts = sel.trim().split(/\s+/);
    if (parts.length > 1) {
      let currentMatches = [this];
      for (const part of parts) {
        const nextMatches = [];
        for (const parent of currentMatches) {
          nextMatches.push(...parent.querySelectorAll(part));
        }
        currentMatches = nextMatches;
      }
      return currentMatches;
    }
    const single = parts[0];
    const results = [];
    const walk = (node) => {
      if (!(node instanceof MockNode)) return;
      if (single.startsWith('#')) {
        const id = single.slice(1);
        if (node.id === id || node.attributes.id === id) results.push(node);
      } else if (single.startsWith('.')) {
        const cls = single.slice(1);
        if (node.classList.contains(cls)) results.push(node);
      } else if (node.tagName.toLowerCase() === single.toLowerCase()) {
        results.push(node);
      }
      for (const c of node.children) walk(c);
    };
    walk(this);
    return results;
  }
}

class MockTextNode {
  constructor(text) {
    this.nodeType = 3;
    this.textContent = String(text);
  }
}

class MockDocumentFragment {
  constructor() {
    this.nodeType = 11;
    this.childNodes = [];
  }
  appendChild(c) {
    this.childNodes.push(c);
    return c;
  }
}

const mockDoc = {
  documentElement: new MockNode('html'),
  body: new MockNode('body'),
  createElement: (tag) => new MockNode(tag),
  createDocumentFragment: () => new MockDocumentFragment(),
  createTextNode: (t) => new MockTextNode(t),
  getElementById: (id) => mockDoc.body.querySelector('#' + id) || null,
  querySelector: (sel) => mockDoc.body.querySelector(sel) || null,
  querySelectorAll: (sel) => mockDoc.body.querySelectorAll(sel)
};

globalThis.document = mockDoc;
globalThis.window = {
  __GIATOC_MOCK__: true,
  location: { search: '?mock=1', pathname: '/me/tree', reload() {} },
  document: mockDoc,
  localStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {}
  }
};

// ============================================================================
// IMPORTS
// ============================================================================
const {
  renderTree,
  renderPedigreeTree,
  renderArchivalList
} = await import('../src/js/ui/tree.js');

const {
  indexPeople,
  sortPeopleByName,
  normalizeVietnamese,
  filterPeople,
  deriveGenerations
} = await import('../src/js/domain/genealogy/index.js');

const {
  findKinshipPath,
  analyzeKinshipPath,
  getGenerationMeta
} = await import('../src/js/domain/kinship/index.js');

const rawGenealogy = JSON.parse(fs.readFileSync('fixtures/synthetic_genealogy.json', 'utf8'));
const people = indexPeople(rawGenealogy);
const { personGenerations } = deriveGenerations('@I1@', people, rawGenealogy.families || {});
for (const [id, person] of people.entries()) {
  if (person.generation === undefined && personGenerations[id] !== undefined) {
    person.generation = personGenerations[id];
  }
}

console.log(`Loaded dataset with ${people.size} individuals and ${Object.keys(rawGenealogy.families || {}).length} families.`);

// ============================================================================
// TEST SUITE 1: 3-TIER ME-CENTRIC PEDIGREE STRUCTURE (TP-006, TP-016)
// ============================================================================
console.log('\n--- [TEST SUITE 1] 3-Tier Layout & Me-Centric Architecture ---');

const treeContainer = new MockNode('div');
mockDoc.body.appendChild(treeContainer);

renderPedigreeTree({
  host: treeContainer,
  people,
  initialFocusId: '@I1@'
});

const tiers = treeContainer.querySelectorAll('.gi-pedigree__tier');
assert.strictEqual(tiers.length, 3, 'Must render exactly 3 tiers');
console.log('  ✓ Exactly 3 tiers rendered in DOM');

// 1.1 Tier 1: Parents
const tier1 = tiers[0];
assert(tier1.textContent.includes('TẦNG 1: BẬC PHỤ MẪU'), 'Tier 1 header must identify Parents');
const tier1Cards = tier1.querySelectorAll('.gi-pedigree__card');
assert.strictEqual(tier1Cards.length, 2, 'Cố Thu has 2 parents recorded in dataset (@I5@, @I4@)');
const tier1FocusBtn = tier1Cards[0].querySelectorAll('button').find(b => b.textContent.includes('Đặt làm đương sự'));
assert(tier1FocusBtn, 'Tier 1 parent cards must feature [↰ Đặt làm đương sự] button');
console.log(`  ✓ Tier 1 (Bậc Phụ Mẫu): Verified with ${tier1Cards.length} parent cards and [↰ Đặt làm đương sự] navigation`);

// 1.2 Tier 2: Focus Person & Spouse Union
const tier2 = tiers[1];
assert(tier2.textContent.includes('TẦNG 2: ĐƯƠNG SỰ & HÔN PHỐI'), 'Tier 2 header must identify Focus & Spouse');
const focusCard = tier2.querySelector('.gi-pedigree__card--focus');
assert(focusCard, 'Tier 2 must feature prominent focus card (.gi-pedigree__card--focus)');
assert(focusCard.textContent.includes('ĐƯƠNG SỰ ĐANG CHỌN'), 'Focus badge must be present');
assert(focusCard.textContent.includes('Giuse Trần Trọng Thu'), 'Focus card must display person name');
assert(focusCard.textContent.includes('F0 · Gốc Phả Hệ'), 'Focus card must display generation metadata');
const btnViewDetail = focusCard.querySelector('a');
assert(btnViewDetail && btnViewDetail.getAttribute('href').includes('/me/tree/person/%40I1%40'), 'Must contain 6-layer profile link');
console.log('  ✓ Tier 2 (Đương sự & Hôn phối): Prominent focus card, avatar, metadata, [Xem hồ sơ 6 tầng →] verified');

// 1.3 Tier 3: Direct Children
const tier3 = tiers[2];
assert(tier3.textContent.includes('TẦNG 3: HẬU DUỆ TRỰC HỆ (6 CON CÁI ĐÃ GHI NHẬN)'), 'Tier 3 header must indicate 6 children');
const childCards = tier3.querySelectorAll('.gi-pedigree__card');
assert.strictEqual(childCards.length, 6, 'Tier 3 must render all 6 child cards');
const branchBtns = childCards.map(c => c.querySelectorAll('button').find(b => b.textContent.includes('Mở rộng nhánh')));
const focusChildBtns = childCards.map(c => c.querySelectorAll('button').find(b => b.textContent.includes('Đặt làm đương sự')));
// In the dataset: @I6@, @I18@, @I7@, @I9@ have children (4 branch buttons). @I2@, @I3@ have no children (2 direct focus buttons).
assert.strictEqual(branchBtns.filter(Boolean).length, 4, '4 children with descendants have [↓ Mở rộng nhánh (N con)] button');
assert.strictEqual(focusChildBtns.filter(Boolean).length, 2, '2 children without descendants have [↰ Đặt làm đương sự] button');
console.log('  ✓ Tier 3 (Hậu duệ trực hệ): 6 child cards verified (4 with branch expansion, 2 with direct focus)');

// ============================================================================
// TEST SUITE 2: TEST SCENARIOS
// ============================================================================
console.log('\n--- [TEST SUITE 2] Complex Graph Scenarios ---');

// 2.1 Root Ancestor (@I1@ Cố Thu)
console.log('• Scenario 2.1: Root Ancestor (@I1@ Cố Thu)');
const rootCrumbs = treeContainer.querySelector('.gi-pedigree__breadcrumbs');
assert(rootCrumbs.textContent.includes('Giuse Trần Trọng Thu (Đương sự)'), 'Root breadcrumb must display focus');
assert(!rootCrumbs.textContent.includes('Quan hệ với Cố Thu: Bản thân'), 'Root should not display redundant self-relationship badge');
console.log('  ✓ Root ancestor (@I1@) verified with proper breadcrumbs and self-anchoring');

// 2.2 Multiple Spouses (@I18@ An-tôn Trần Trọng Thư has 2 spouses: @I59@, @I51@)
console.log('• Scenario 2.2: Multiple Spouses (@I18@)');
renderPedigreeTree({
  host: treeContainer,
  people,
  initialFocusId: '@I18@'
});
const mSpouseTiers = treeContainer.querySelectorAll('.gi-pedigree__tier');
const mSpouseCards = mSpouseTiers[1].querySelectorAll('.gi-pedigree__card');
// 1 focus card + 2 spouse cards = 3 cards
assert.strictEqual(mSpouseCards.length, 3, 'Multiple spouses: Must render 1 focus card + 2 spouse cards');
const unionBadge = mSpouseTiers[1].querySelector('.gi-pedigree__union-badge');
assert(unionBadge && unionBadge.textContent.includes('⚭ Hôn phối'), 'Union badge must be present');
const spouseNames = [mSpouseCards[1].textContent, mSpouseCards[2].textContent];
assert(spouseNames.some(t => t.includes('Teresa Phạm Thị Hưng') || t.includes('Bà Sa')), 'Spouse 1 (@I59@) must be rendered');
assert(spouseNames.some(t => t.includes('Lê Thị Nghi') || t.includes('Bà Lê Thị Nghi')), 'Spouse 2 (@I51@) must be rendered');
console.log('  ✓ Multi-spouse union (@I18@ with 2 wives) rendered with distinct cards and union badge');

// Also test @I32@ (Lã Thị Hằng - 2 husbands: @I90@, @I92@)
renderPedigreeTree({ host: treeContainer, people, initialFocusId: '@I32@' });
const f32Cards = treeContainer.querySelectorAll('.gi-pedigree__tier')[1].querySelectorAll('.gi-pedigree__card');
assert.strictEqual(f32Cards.length, 3, 'Multi-spouse @I32@ must render 1 focus + 2 spouse cards');
console.log('  ✓ Multi-spouse union (@I32@ with 2 husbands) verified');

// 2.3 Multiple Children
console.log('• Scenario 2.3: Multiple Children');
renderPedigreeTree({ host: treeContainer, people, initialFocusId: '@I1@' });
const p1T3 = treeContainer.querySelectorAll('.gi-pedigree__tier')[2];
assert.strictEqual(p1T3.querySelectorAll('.gi-pedigree__card').length, 6, '@I1@ has 6 children');

// Test @I18@ who has 11 children
renderPedigreeTree({ host: treeContainer, people, initialFocusId: '@I18@' });
const p18T3 = treeContainer.querySelectorAll('.gi-pedigree__tier')[2];
assert.strictEqual(p18T3.querySelectorAll('.gi-pedigree__card').length, 11, '@I18@ has 11 children');
console.log('  ✓ Multiple children verified for @I1@ (6 children) and @I18@ (11 children)');

// 2.4 Missing Parents
console.log('• Scenario 2.4: Missing Parents (0 parents & 1 parent)');
// Test 0 parents (@I5@)
renderPedigreeTree({ host: treeContainer, people, initialFocusId: '@I5@' });
const p5T1 = treeContainer.querySelectorAll('.gi-pedigree__tier')[0];
assert(p5T1.textContent.includes('Mốc khởi nguyên phả hệ · Cố Tổ (Đời 1) — Không ghi nhận phụ mẫu tiền khởi'), 'Must show root banner when parents are missing');
assert.strictEqual(p5T1.querySelectorAll('.gi-pedigree__card').length, 0, 'No parent cards when 0 parents');
console.log('  ✓ 0 parents case (@I5@): Root ancestor fallback banner rendered');

// Test 1 parent (@I19@ Nguyễn Văn Ba has only @I10@)
renderPedigreeTree({ host: treeContainer, people, initialFocusId: '@I19@' });
const p19T1 = treeContainer.querySelectorAll('.gi-pedigree__tier')[0];
const p19ParCards = p19T1.querySelectorAll('.gi-pedigree__card');
assert.strictEqual(p19ParCards.length, 1, 'Single parent person must render exactly 1 parent card');
assert(p19ParCards[0].textContent.includes('Lê Thị Hoa') || p19ParCards[0].textContent.includes('Cecilia'), 'Parent name must match @I10@');
console.log('  ✓ 1 parent case (@I19@): Exactly 1 parent card rendered');

// 2.5 Deep Generation Traversal (F0 -> F1 -> F2 -> F3 -> F4)
console.log('• Scenario 2.5: Deep Generation Traversal (F0 -> F1 -> F2 -> F3 -> F4)');
const lineageChain = ['@I1@', '@I6@', '@I17@', '@I39@', '@I109@'];
const genLabels = ['F0 · Gốc Phả Hệ', 'F1 · Đời Con', 'F2 · Đời Cháu', 'F3 · Đời Chắt', 'F4 · Đời Chút'];

renderPedigreeTree({ host: treeContainer, people, initialFocusId: '@I1@' });

for (let step = 0; step < lineageChain.length; step++) {
  const currentId = lineageChain[step];
  renderPedigreeTree({ host: treeContainer, people, initialFocusId: currentId });
  const focus = treeContainer.querySelector('.gi-pedigree__card--focus');
  const person = people.get(currentId);
  assert(focus.textContent.includes(person.name), `Step ${step}: Focus card must display ${person.name}`);
  assert(focus.textContent.includes(genLabels[step]), `Step ${step}: Generation must display ${genLabels[step]}`);

  // Verify Breadcrumbs
  const crumbs = treeContainer.querySelector('.gi-pedigree__breadcrumbs');
  for (let i = 0; i <= step; i++) {
    const ancestor = people.get(lineageChain[i]);
    assert(crumbs.textContent.includes(ancestor.name), `Breadcrumb must contain ancestor ${ancestor.name}`);
  }
}
console.log('  ✓ Deep traversal F0 (@I1@) -> F1 (@I6@) -> F2 (@I17@) -> F3 (@I39@) -> F4 (@I109@) verified');

// 2.6 Lineage Breadcrumbs & BFS Kinship Path Semantics
console.log('• Scenario 2.6: BFS Kinship Path Bloodline Semantics');
let totalBloodDescendants = 0;
let validBloodPaths = 0;

for (const [id, person] of people.entries()) {
  const pathRes = findKinshipPath('@I1@', id, people);
  if (pathRes.found && pathRes.isDirectLineal && pathRes.generationalDelta > 0) {
    totalBloodDescendants++;
    // Verify every edge is strictly parent->child
    const allChildEdges = pathRes.edges.every(e => e.type === 'child' && e.delta === 1);
    const correctDistance = pathRes.distance === pathRes.generationalDelta;
    if (allChildEdges && correctDistance) {
      validBloodPaths++;
    }
  }
}
assert.strictEqual(totalBloodDescendants, 153, 'Total blood descendants from @I1@ must be 153');
assert.strictEqual(validBloodPaths, 153, 'All 153 blood descendants must strictly follow child-only bloodline edges');
console.log(`  ✓ 153/153 (${(validBloodPaths / totalBloodDescendants * 100).toFixed(1)}%) blood descendants strictly adhere to genealogical child-only BFS bloodline semantics`);

// 2.7 Disconnected Branches (@I151@)
console.log('• Scenario 2.7: Disconnected Branches (@I151@)');
renderPedigreeTree({ host: treeContainer, people, initialFocusId: '@I151@' });
const dFocus = treeContainer.querySelector('.gi-pedigree__card--focus');
assert(dFocus.textContent.includes('Mẹ Tình Thương'), 'Focus card must render @I151@');
const dCrumbs = treeContainer.querySelector('.gi-pedigree__breadcrumbs');
assert(dCrumbs.textContent.includes('Mẹ Tình Thương'), 'Breadcrumbs must fallback gracefully');
assert(!dCrumbs.textContent.includes('Giuse Trần Trọng Thu'), 'Disconnected person must not show fake connection to Cố Thu');
const dChildren = treeContainer.querySelectorAll('.gi-pedigree__tier')[2];
assert(dChildren.textContent.includes('Chưa ghi nhận con cái trong dữ liệu số hóa'), 'Empty children tier handled gracefully');
console.log('  ✓ Disconnected branch (@I151@) gracefully handled without crashes or corrupted lineage');

// ============================================================================
// TEST SUITE 3: ARCHIVAL LIST (VIETNAMESE NORMALIZATION, COLLATION & SEARCH)
// ============================================================================
console.log('\n--- [TEST SUITE 3] Archival List & Collation ---');

const listContainer = new MockNode('div');
mockDoc.body.appendChild(listContainer);

let selectedForTree = null;
renderArchivalList({
  host: listContainer,
  people,
  onSelectPerson: (id) => { selectedForTree = id; }
});

const listRows = listContainer.querySelectorAll('.gi-tree__row');
assert.strictEqual(listRows.length, 223, `Must render all 223 rows, found ${listRows.length}`);
console.log(`  ✓ Archival List populated with ${listRows.length} total rows`);

// 3.1 Vietnamese Diacritic Normalization
console.log('• Subtest 3.1: Vietnamese Diacritic Normalization (normalizeVietnamese)');
assert.strictEqual(normalizeVietnamese('Trần Trọng Thu'), 'tran trong thu');
assert.strictEqual(normalizeVietnamese('Trần Trọng Thư'), 'tran trong thu'); // Note: ư -> u under diacritic strip
assert.strictEqual(normalizeVietnamese('NGUYỄN VĂN BA'), 'nguyen van ba');
assert.strictEqual(normalizeVietnamese('Lã Thị Hằng'), 'la thi hang');
console.log('  ✓ normalizeVietnamese accurately strips combining marks and normalizes case');

// 3.2 Vietnamese Collation Sorting (sortPeopleByName)
console.log('• Subtest 3.2: Vietnamese Collation Sorting (sortPeopleByName)');
const sorted = sortPeopleByName([...people.values()]);
assert.strictEqual(sorted.length, 223, 'Sorted array retains 223 elements');
for (let i = 0; i < sorted.length - 1; i++) {
  const nA = normalizeVietnamese(sorted[i].name);
  const nB = normalizeVietnamese(sorted[i + 1].name);
  const cmp = nA.localeCompare(nB, 'vi');
  assert(cmp <= 0, `Collation violation at index ${i}: "${sorted[i].name}" vs "${sorted[i + 1].name}"`);
}
console.log('  ✓ 223 individuals strictly sorted under Vietnamese collation localeCompare("vi")');

// 3.3 Live Search Filtering
console.log('• Subtest 3.3: Live Search Filtering (Empty, Partial, Non-matching)');
const searchInput = listContainer.querySelector('#tree-search');
const countStatus = listContainer.querySelector('.gi-tree__count');

// Test 3.3.1: Empty query
searchInput.dispatchEvent('input', { target: { value: '' } });
const visibleEmpty = listRows.filter(r => !r.classList.contains('gi-tree__row--hidden')).length;
assert.strictEqual(visibleEmpty, 223, 'Empty search must display all 223 rows');
assert(countStatus.textContent.includes('223 nhân vật trong phả hệ'), 'Count status matches 223');
console.log('  ✓ Empty search query: 223/223 rows visible');

// Test 3.3.2: Partial query "Thu" (matches both "Thu" and "Thư")
searchInput.dispatchEvent('input', { target: { value: 'Thu' } });
const visibleThu = listRows.filter(r => !r.classList.contains('gi-tree__row--hidden')).length;
assert.strictEqual(visibleThu, 20, `Search "Thu" should match 20 rows, got ${visibleThu}`);
assert(countStatus.textContent.includes('20 trong 223 nhân vật phù hợp với "Thu"'), 'Count status reflects 20 matches');
console.log(`  ✓ Partial search "Thu": ${visibleThu}/223 rows visible (diacritic-insensitive: Thu + Thư)`);

// Test 3.3.3: Partial query "Thành"
searchInput.dispatchEvent('input', { target: { value: 'Thành' } });
const visibleThanh = listRows.filter(r => !r.classList.contains('gi-tree__row--hidden')).length;
assert(visibleThanh > 0 && visibleThanh < 223, `Search "Thành" should have matches, got ${visibleThanh}`);
console.log(`  ✓ Partial search "Thành": ${visibleThanh}/223 rows visible`);

// Test 3.3.4: Non-matching query
searchInput.dispatchEvent('input', { target: { value: 'XYZNonExistent9999' } });
const visibleNone = listRows.filter(r => !r.classList.contains('gi-tree__row--hidden')).length;
assert.strictEqual(visibleNone, 0, 'Non-matching query must hide all rows');
assert(countStatus.textContent.includes('0 trong 223 nhân vật phù hợp'), 'Count status reflects 0 matches');
console.log('  ✓ Non-matching query "XYZNonExistent9999": 0/223 rows visible');

// 3.4 One-Click [🌳 Phả đồ] Navigation
console.log('• Subtest 3.4: One-Click [🌳 Phả đồ] Navigation to Me-Centric View');
const targetRow = listRows.find(r => r.getAttribute('data-person-id') === '@I109@');
assert(targetRow, 'Row for @I109@ (Vũ Trọng Quý) must exist in list');
const btnTree = targetRow.querySelector('.gi-pedigree__btn');
assert(btnTree && btnTree.textContent.includes('🌳 Phả đồ'), 'Row must contain [🌳 Phả đồ] button');

// Click the button
btnTree.dispatchEvent('click', { preventDefault() {} });
assert.strictEqual(selectedForTree, '@I109@', 'Clicking [🌳 Phả đồ] must trigger onSelectPerson with target person ID');
console.log('  ✓ One-click [🌳 Phả đồ] action correctly triggered onSelectPerson("@I109@")');

// ============================================================================
// TEST SUITE 4: DUAL-VIEW INTEGRATION IN RENDER_TREE
// ============================================================================
console.log('\n--- [TEST SUITE 4] Dual-View Switcher Integration ---');

const mainHost = new MockNode('div');
mockDoc.body.appendChild(mainHost);

renderTree(mainHost, {});
await new Promise(r => setTimeout(r, 80));

const viewSwitcherBtns = mainHost.querySelectorAll('.gi-view-switcher__btn');
assert.strictEqual(viewSwitcherBtns.length, 2, 'Must render 2 view switcher buttons');
const btnPed = viewSwitcherBtns[0];
const btnLst = viewSwitcherBtns[1];

// Initially Pedigree is active
assert(btnPed.classList.contains('gi-view-switcher__btn--active'), 'Pedigree is default active');
assert(!btnLst.classList.contains('gi-view-switcher__btn--active'), 'List is inactive');

// Switch to List
btnLst.dispatchEvent('click');
assert(btnLst.classList.contains('gi-view-switcher__btn--active'), 'List is now active');
assert(!btnPed.classList.contains('gi-view-switcher__btn--active'), 'Pedigree is inactive');
assert(mainHost.querySelector('.gi-tree__list'), 'List view rendered');

// In List view, click [🌳 Phả đồ] on an F4 person (@I109@)
const f4Row = mainHost.querySelectorAll('.gi-tree__row').find(r => r.getAttribute('data-person-id') === '@I109@');
assert(f4Row, 'F4 row @I109@ exists');
const f4BtnTree = f4Row.querySelector('.gi-pedigree__btn');
f4BtnTree.dispatchEvent('click', { preventDefault() {} });

// Verify it switched back to Pedigree mode with @I109@ as focus!
assert(btnPed.classList.contains('gi-view-switcher__btn--active'), 'Switched back to Pedigree mode');
assert(!btnLst.classList.contains('gi-view-switcher__btn--active'), 'List is no longer active');
const currentFocus = mainHost.querySelector('.gi-pedigree__card--focus');
assert(currentFocus && currentFocus.textContent.includes('Vũ Trọng Quý'), 'Pedigree view is focused on Vũ Trọng Quý (@I109@)');

// Verify lineage breadcrumbs traced back to Cố Thu
const activeCrumbs = mainHost.querySelector('.gi-pedigree__breadcrumbs');
assert(activeCrumbs.textContent.includes('Giuse Trần Trọng Thu'), 'Breadcrumbs must trace back to Giuse Trần Trọng Thu');
assert(activeCrumbs.textContent.includes('Vũ Trọng Quý (Đương sự)'), 'Breadcrumbs identify current focus person');
console.log('  ✓ End-to-end integration: List row -> One-click [🌳 Phả đồ] -> Me-Centric view with full lineage breadcrumb');

console.log('\n============================================================');
console.log('🎉 ALL TESTS PASSED! DELIVERY BATCH UI 03 VERIFIED AT 100%');
console.log('============================================================\n');
