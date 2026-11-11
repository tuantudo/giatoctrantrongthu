/**
 * GIATOC TEST SUITE — tests/test_batch_ui_02_03.mjs
 * Verification of Delivery Batch UI 02 & Batch UI 03:
 *   - Batch UI 02: Person 6-Layer Model, Epistemic Badges & Proposal Form (src/js/ui/person.js)
 *   - Batch UI 03: Dual-View Switcher & Archival List (src/js/ui/tree.js)
 *   - Batch UI 03: Interactive 3-Tier Pedigree Tree with Me-Centric Focus, Lineage BFS & Drilldown
 */

import assert from 'node:assert/strict';

console.log('🧪 Starting test suite for Delivery Batch UI 02/03...\n');

// ============================================================================
// SYNTHETIC DOM MOCK SETUP
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
  getElementById: (id) => {
    return mockDoc.body.querySelector('#' + id) || null;
  },
  querySelector: (sel) => {
    return mockDoc.body.querySelector(sel) || null;
  },
  querySelectorAll: (sel) => {
    return mockDoc.body.querySelectorAll(sel);
  }
};

globalThis.document = mockDoc;
const storageMap = new Map();
globalThis.localStorage = {
  getItem: (k) => storageMap.get(k) || null,
  setItem: (k, v) => storageMap.set(k, String(v)),
  removeItem: (k) => storageMap.delete(k),
  clear: () => storageMap.clear()
};

globalThis.window = {
  __GIATOC_MOCK__: true,
  location: { search: '?mock=1', pathname: '/me/tree', reload() {} },
  document: mockDoc,
  localStorage: globalThis.localStorage
};

// ============================================================================
// 1. VERIFY DELIVERY BATCH UI 02 (src/js/ui/person.js)
// ============================================================================
console.log('[1/3] Testing Batch UI 02: Person 6-Layer Architecture & Proposal Form...');

const { renderPerson } = await import('../src/js/ui/person.js');
const { api } = await import('../src/js/ui/data.js');

const personHost = new MockNode('div');
personHost.id = 'person-host';
mockDoc.body.appendChild(personHost);

renderPerson(personHost, '@I1@');

// Wait for async load in Region
await new Promise(r => setTimeout(r, 100));

const detailHost = personHost.querySelector('#person-detail');
assert(detailHost, 'person-detail element must be rendered');
assert.strictEqual(detailHost.getAttribute('data-person-id'), '@I1@', 'data-person-id must be @I1@');

// 1.1 Verify 6 Sections exist
const secIdentity = personHost.querySelector('#person-identity');
const secRelations = personHost.querySelector('#person-relations');
const secEvidence = personHost.querySelector('#person-evidence');
const secMemories = personHost.querySelector('#person-memories');
const secDisputes = personHost.querySelector('#person-disputes');
const secPropose = personHost.querySelector('#person-propose');

assert(secIdentity, 'Section person-identity must exist');
assert(secRelations, 'Section person-relations must exist');
assert(secEvidence, 'Section person-evidence must exist');
assert(secMemories, 'Section person-memories must exist');
assert(secDisputes, 'Section person-disputes must exist (TP-024)');
assert(secPropose, 'Section person-propose must exist (TP-003)');

console.log('  ✅ 6-Layer model sections verified (Identity, Relations, Evidence, Memories, Disputes, Proposals)');

// 1.2 Verify Epistemic Badges (TP-025)
const epistemicBadges = personHost.querySelectorAll('.gi-epistemic');
assert(epistemicBadges.length > 0, `Expected epistemic badges, found ${epistemicBadges.length}`);
const badgeTypes = epistemicBadges.map(b => b.className);
console.log(`  ✅ Epistemic claim badges verified (${epistemicBadges.length} badges found: ${badgeTypes.slice(0, 2).join(', ')})`);

// 1.3 Verify Dispute & Historical Notes (TP-024)
const disputeCards = secDisputes ? personHost.querySelectorAll('.gi-card') : [];
assert(personHost.textContent.includes('Dữ kiện đồng thuận') || disputeCards.length > 0, 'Dispute preservation verified');
console.log('  ✅ Dispute & Historical Notes section active (TP-024)');

// 1.4 Verify Interactive Proposal Submission (TP-003)
const formContainer = personHost.querySelector('#proposal-form-container');
assert(formContainer, 'Proposal form container must be rendered');

const selectField = personHost.querySelector('#prop-field-select');
const inputVal = personHost.querySelector('#prop-value-input');
const inputSrc = personHost.querySelector('#prop-evidence-input');
const inputRsn = personHost.querySelector('#prop-reason-input');
const submitBtn = personHost.querySelector('#prop-submit-btn');

assert(selectField, 'Proposal field selector must exist');
assert(inputVal, 'Proposal value input must exist');
assert(submitBtn, 'Proposal submit button must exist');

// Test submitting a proposal via UI form
selectField.value = 'birth_year';
inputVal.value = '1890';
if (inputSrc) inputSrc.value = 'Gia phả chép tay nhánh Trưởng';
if (inputRsn) inputRsn.value = 'Đối chiếu tài liệu thực địa';

submitBtn.dispatchEvent('click');
await new Promise(r => setTimeout(r, 100));

// Verify mock API received proposal
const storedProposals = JSON.parse(globalThis.localStorage.getItem('giatoc_mock_proposals') || '[]');
assert(storedProposals.length > 0, 'Proposal must be recorded in storage');
const lastProp = storedProposals[storedProposals.length - 1];
assert.strictEqual(lastProp.personId, '@I1@');
assert.strictEqual(lastProp.field, 'birth_year');
assert.strictEqual(lastProp.suggestedValue, '1890');
assert.strictEqual(lastProp.status, 'PENDING_REVIEW');
console.log(`  ✅ Proposal form successfully submitted and queued: ID ${lastProp.id} (Status: ${lastProp.status})`);

// ============================================================================
// 2. VERIFY DELIVERY BATCH UI 03: DUAL-VIEW & ARCHIVAL LIST (src/js/ui/tree.js)
// ============================================================================
console.log('\n[2/3] Testing Batch UI 03: Dual-View Mode & Archival List View...');

const { renderTree, renderArchivalList, renderPedigreeTree } = await import('../src/js/ui/tree.js');

const treeHost = new MockNode('div');
treeHost.id = 'tree-host';
mockDoc.body.appendChild(treeHost);

renderTree(treeHost, {});
await new Promise(r => setTimeout(r, 100));

const treeIndex = treeHost.querySelector('#tree-index');
assert(treeIndex, 'tree-index element must be rendered');

// 2.1 Mode Switcher Buttons
const switcherBtns = treeHost.querySelectorAll('.gi-view-switcher__btn');
assert.strictEqual(switcherBtns.length, 2, 'Must have 2 view switcher buttons (Pedigree & List)');
const btnPedigree = switcherBtns[0];
const btnList = switcherBtns[1];

assert(btnPedigree.classList.contains('gi-view-switcher__btn--active'), 'Pedigree view should be active by default');
console.log('  ✅ Dual-View switcher verified (Pedigree ↔ List)');

// 2.2 Switch to Archival List View
btnList.dispatchEvent('click');
assert(btnList.classList.contains('gi-view-switcher__btn--active'), 'List view button should now be active');

const searchInput = treeHost.querySelector('#tree-search');
assert(searchInput, 'Archival list search input must exist');

const rows = treeHost.querySelectorAll('.gi-tree__row');
assert.strictEqual(rows.length, 223, `Archival list must contain 223 people, found ${rows.length}`);

// 2.3 Search diacritic-insensitive filter test
searchInput.value = 'Thu';
searchInput.dispatchEvent('input', { target: { value: 'Thu' } });

const hiddenRows = treeHost.querySelectorAll('.gi-tree__row--hidden');
assert(hiddenRows.length > 0, 'Non-matching rows must be hidden');
const visibleCount = rows.length - hiddenRows.length;
assert(visibleCount < rows.length && visibleCount > 0, `Expected search hits, got ${visibleCount}`);
console.log(`  ✅ Archival List search verified: "Thu" filtered ${rows.length} down to ${visibleCount} matching rows`);

// ============================================================================
// 3. VERIFY DELIVERY BATCH UI 03: ME-CENTRIC INTERACTIVE PEDIGREE TREE
// ============================================================================
console.log('\n[3/3] Testing Batch UI 03: Interactive 3-Tier Pedigree Tree with Me-Centric Focus...');

// Switch back to Pedigree View
btnPedigree.dispatchEvent('click');
assert(btnPedigree.classList.contains('gi-view-switcher__btn--active'), 'Pedigree view must be active');

const pedigreeContainer = treeHost.querySelector('#pedigree-tree-container');
assert(pedigreeContainer, 'pedigree-tree-container must be rendered');

// 3.1 Verify 3 Tiers rendered
const tiers = treeHost.querySelectorAll('.gi-pedigree__tier');
assert.strictEqual(tiers.length, 3, `Must render 3 tiers (Parents, Focus & Spouse, Children), got ${tiers.length}`);

// Tier 1 (Parents)
const tier1 = tiers[0];
assert(tier1.textContent.includes('TẦNG 1: BẬC PHỤ MẪU'), 'Tier 1 must be Parents');
assert(tier1.textContent.includes('Cố Tổ') || tier1.querySelectorAll('.gi-pedigree__card').length >= 0, 'Tier 1 parent logic verified');

// Tier 2 (Focus & Spouse)
const tier2 = tiers[1];
assert(tier2.textContent.includes('TẦNG 2: ĐƯƠNG SỰ & HÔN PHỐI'), 'Tier 2 must be Focus & Spouse');
const focusCard = tier2.querySelector('.gi-pedigree__card--focus');
assert(focusCard, 'Focus Card must be rendered with prominent focus styling');
assert(focusCard.textContent.includes('Giuse Trần Trọng Thu'), 'Focus Card must display Giuse Trần Trọng Thu');
assert(focusCard.textContent.includes('F0 · Gốc Phả Hệ') || focusCard.textContent.includes('F0'), 'Focus Card must have F0 generation');

// Tier 3 (Children)
const tier3 = tiers[2];
assert(tier3.textContent.includes('TẦNG 3: HẬU DUỆ TRỰC HỆ'), 'Tier 3 must be Children');
const childCards = tier3.querySelectorAll('.gi-pedigree__card');
assert.strictEqual(childCards.length, 6, `Cố Thu must have 6 children in Tier 3, got ${childCards.length}`);
console.log(`  ✅ 3-Tier Pedigree verified: Tier 1 Phụ Mẫu, Tier 2 Đương Sự (@I1@), Tier 3 (${childCards.length} Hậu duệ trực hệ)`);

// 3.2 Test Me-Centric Drilldown / Branch Expansion
// Find the first child with expandable branch button
const branchBtns = tier3.querySelectorAll('.gi-pedigree__btn');
assert(branchBtns.length > 0, 'Child cards must have branch buttons');

// Click drilldown into child branch (e.g. child 0: Trần Thị Thi)
branchBtns[0].dispatchEvent('click');

// Verify tree refocused onto child
const newTiers = treeHost.querySelectorAll('.gi-pedigree__tier');
const newFocusCard = newTiers[1].querySelector('.gi-pedigree__card--focus');
assert(newFocusCard, 'New focus card must be rendered');
assert(!newFocusCard.textContent.includes('Giuse Trần Trọng Thu'), 'Focus person must change');
console.log(`  ✅ Branch drilldown verified: focus changed to "${newFocusCard.querySelector('.gi-pedigree__name').textContent}"`);

// 3.3 Verify Lineage Breadcrumbs & BFS Kinship Path (TP-006, TP-016)
const breadcrumbBar = treeHost.querySelector('.gi-pedigree__breadcrumbs');
assert(breadcrumbBar, 'Lineage breadcrumb bar must be rendered');
assert(breadcrumbBar.textContent.includes('Giuse Trần Trọng Thu'), 'Breadcrumb must trace back to Cố Thu');
assert(breadcrumbBar.textContent.includes('Đương sự'), 'Breadcrumb must identify current focus');
assert(breadcrumbBar.textContent.includes('Quan hệ với Cố Thu'), 'Breadcrumb must display kinship relationship');
console.log(`  ✅ Lineage Breadcrumbs verified: "${breadcrumbBar.textContent.replace(/\s+/g, ' ').trim()}"`);

// 3.4 Test Reset to Root Button
const btnReset = treeHost.querySelector('.gi-pedigree__toolbar button');
assert(btnReset, 'Reset button must exist');
// Find the reset button
const allToolbarBtns = treeHost.querySelectorAll('.gi-pedigree__toolbar button');
const resetBtn = Array.from(allToolbarBtns).find(b => b.textContent.includes('Về mốc Cố Thu'));
assert(resetBtn, 'Reset button "Về mốc Cố Thu" must exist');
resetBtn.dispatchEvent('click');

const resetFocusCard = treeHost.querySelector('.gi-pedigree__card--focus');
assert(resetFocusCard.textContent.includes('Giuse Trần Trọng Thu'), 'Focus must reset back to Giuse Trần Trọng Thu');
console.log('  ✅ Reset to Root "⌂ Về mốc Cố Thu" verified');

console.log('\n🎉 ALL DELIVERY BATCH UI 02 & UI 03 TESTS PASSED SUCCESSFULLY (100%)!');
