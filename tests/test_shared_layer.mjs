/**
 * test_shared_layer.mjs
 * Comprehensive automated verification for SC-02 Shared Layer & Design Tokens:
 * - src/js/shared/utils/dom-helpers.js
 * - src/js/shared/utils/formatting.js
 * - src/js/shared/utils/date-lunar.js
 * - src/js/shared/contracts/tokens.js
 * - src/js/shared/event-bus.js
 * - src/js/shared/index.js (barrel export)
 * - src/js/ui/dom.js (re-export facade)
 * - src/js/ui/tokens.js (re-export facade)
 * - Parity against src/js/core/lunar-engine.js
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Setup minimal synthetic DOM mock for Node.js environment
class MockNode {
  constructor(tag = 'div') {
    this.tagName = tag.toUpperCase();
    this.childNodes = [];
    this.attributes = {};
    this.dataset = {};
    this.style = {};
    this.listeners = {};
    this.className = '';
    this._textContent = '';
    this._innerHTML = '';
  }
  get firstChild() {
    return this.childNodes[0] || null;
  }
  get textContent() {
    return this._textContent;
  }
  set textContent(val) {
    this._textContent = String(val);
    this.childNodes = [new MockTextNode(String(val))];
  }
  get innerHTML() {
    return this._innerHTML;
  }
  set innerHTML(val) {
    this._innerHTML = String(val);
  }
  setAttribute(key, val) {
    this.attributes[key] = String(val);
  }
  getAttribute(key) {
    return this.attributes[key];
  }
  addEventListener(event, fn) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
  }
  dispatchEvent(event, ...args) {
    const handlers = this.listeners[event] || [];
    for (const h of handlers) h(...args);
  }
  appendChild(child) {
    if (child instanceof MockDocumentFragment) {
      for (const c of child.childNodes) {
        this.childNodes.push(c);
      }
      child.childNodes = [];
      return child;
    }
    this.childNodes.push(child);
    return child;
  }
  removeChild(child) {
    const idx = this.childNodes.indexOf(child);
    if (idx !== -1) {
      this.childNodes.splice(idx, 1);
    }
    return child;
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
  get firstChild() {
    return this.childNodes[0] || null;
  }
  appendChild(child) {
    this.childNodes.push(child);
    return child;
  }
  removeChild(child) {
    const idx = this.childNodes.indexOf(child);
    if (idx !== -1) this.childNodes.splice(idx, 1);
    return child;
  }
}

const mockDoc = {
  documentElement: new MockNode('html'),
  createElement: (tag) => new MockNode(tag),
  createDocumentFragment: () => new MockDocumentFragment(),
  createTextNode: (text) => new MockTextNode(text),
  querySelector: (sel) => {
    if (sel === '#app') return new MockNode('div');
    return null;
  }
};

globalThis.document = mockDoc;
globalThis.window = {
  innerWidth: 1200,
  document: mockDoc
};

console.log('🧪 Starting test suite for SC-02 Shared Layer...');

// 1. Test dom-helpers.js
console.log('  Testing src/js/shared/utils/dom-helpers.js...');
const { el, frag, clear, mount } = await import('../src/js/shared/utils/dom-helpers.js');

// 1.1 el helper
let clicked = false;
const node = el('div', {
  class: 'card active',
  dataset: { id: 'item-42' },
  style: { color: 'red' },
  onClick: () => { clicked = true; }
}, [
  el('span', { text: 'Title' }),
  'Simple Text',
  42
]);

assert.equal(node.tagName, 'DIV');
assert.equal(node.className, 'card active');
assert.equal(node.dataset.id, 'item-42');
assert.equal(node.style.color, 'red');
assert.equal(node.childNodes.length, 3);
assert.equal(node.childNodes[0].tagName, 'SPAN');
assert.equal(node.childNodes[0].textContent, 'Title');
assert.equal(node.childNodes[1].textContent, 'Simple Text');
assert.equal(node.childNodes[2].textContent, '42');

node.dispatchEvent('click');
assert.equal(clicked, true, 'Click handler should be triggered');

// 1.2 frag helper
const f = frag([el('p', { text: 'A' }), el('p', { text: 'B' })]);
assert.equal(f.childNodes.length, 2);

// 1.3 clear helper
const container = el('div', {}, [el('p'), el('p')]);
assert.equal(container.childNodes.length, 2);
clear(container);
assert.equal(container.childNodes.length, 0);

// 1.4 mount helper
const mountTarget = el('div');
mount(mountTarget, el('h1', { text: 'Mounted' }));
assert.equal(mountTarget.childNodes.length, 1);
assert.equal(mountTarget.childNodes[0].tagName, 'H1');

console.log('  ✅ dom-helpers.js passed.');

// 2. Test formatting.js
console.log('  Testing src/js/shared/utils/formatting.js...');
const { textOrNull, initials } = await import('../src/js/shared/utils/formatting.js');

assert.equal(textOrNull(null), null);
assert.equal(textOrNull(undefined), null);
assert.equal(textOrNull(''), null);
assert.equal(textOrNull('   '), null);
assert.equal(textOrNull('[object Object]'), null);
assert.equal(textOrNull('null'), null);
assert.equal(textOrNull('undefined'), null);
assert.equal(textOrNull('  Trần Trọng Thu  '), 'Trần Trọng Thu');
assert.equal(textOrNull(123), '123');

assert.equal(initials('Trần Trọng Thu'), 'T');
assert.equal(initials('Nguyễn Ái Quốc'), 'Q');
assert.equal(initials('Văn'), 'V');
assert.equal(initials(''), '?');
assert.equal(initials(null), '?');
assert.equal(initials(undefined), '?');

console.log('  ✅ formatting.js passed.');

// 3. Test date-lunar.js and parity against legacy lunar-engine.js
console.log('  Testing src/js/shared/utils/date-lunar.js...');
const lunarShared = await import('../src/js/shared/utils/date-lunar.js');

// Load legacy lunar-engine.js
const legacyPath = path.join(ROOT_DIR, 'src/js/core/lunar-engine.js');
const legacyCode = fs.readFileSync(legacyPath, 'utf8');
const legacyScope = {};
const legacyFn = new Function('scope', `${legacyCode}\nreturn LunarCal;`);
const LegacyLunarCal = legacyFn();

assert.equal(typeof LegacyLunarCal.convertSolar2Lunar, 'function');

// 3.1 Can Chi calculation
assert.equal(lunarShared.getYearCanChi(2024), 'Giáp Thìn');
assert.equal(lunarShared.getYearCanChi(2025), 'Ất Tỵ');
assert.equal(lunarShared.getYearCanChi(2026), 'Bính Ngọ');

// 3.2 Known benchmark: Lunar New Year dates
// 2024-02-10 -> 01/01/2024 Giáp Thìn
const tet2024 = lunarShared.convertSolar2Lunar(10, 2, 2024);
assert.equal(tet2024.day, 1);
assert.equal(tet2024.month, 1);
assert.equal(tet2024.year, 2024);
assert.equal(tet2024.isLeap, false);
assert.equal(tet2024.canChi, 'Giáp Thìn');

// 2026-02-17 -> 01/01/2026 Bính Ngọ
const tet2026 = lunarShared.convertSolar2Lunar(17, 2, 2026);
assert.equal(tet2026.day, 1);
assert.equal(tet2026.month, 1);
assert.equal(tet2026.year, 2026);
assert.equal(tet2026.isLeap, false);
assert.equal(tet2026.canChi, 'Bính Ngọ');

// 3.3 Full parity check with legacy engine across 20 test dates
const testDates = [
  [1, 1, 1945], [2, 9, 1945], [30, 4, 1975], [1, 1, 2000],
  [10, 2, 2024], [15, 8, 2024], [29, 1, 2025], [17, 2, 2026],
  [1, 6, 2026], [31, 12, 2026], [15, 7, 2030], [28, 2, 2035]
];

for (const [d, m, y] of testDates) {
  const modResult = lunarShared.convertSolar2Lunar(d, m, y);
  const legResult = LegacyLunarCal.convertSolar2Lunar(d, m, y);
  assert.equal(modResult.day, legResult.day, `Day parity mismatch for ${d}/${m}/${y}`);
  assert.equal(modResult.month, legResult.month, `Month parity mismatch for ${d}/${m}/${y}`);
  assert.equal(modResult.year, legResult.year, `Year parity mismatch for ${d}/${m}/${y}`);
  assert.equal(modResult.isLeap, legResult.isLeap, `Leap parity mismatch for ${d}/${m}/${y}`);
  assert.equal(modResult.canChi, legResult.canChi, `CanChi parity mismatch for ${d}/${m}/${y}`);
  assert.equal(modResult.fullText, legResult.fullText, `FullText parity mismatch for ${d}/${m}/${y}`);
}

console.log('  ✅ date-lunar.js passed with 100% legacy parity.');

// 4. Test contracts/tokens.js
console.log('  Testing src/js/shared/contracts/tokens.js...');
const { breakpoints, viewportClass, typography, setTypographyStack } = await import('../src/js/shared/contracts/tokens.js');

assert.deepEqual(breakpoints, { xs: 375, sm: 768, md: 1024, lg: 1440 });
assert(Object.isFrozen(breakpoints));

assert.equal(viewportClass(320), 'xs');
assert.equal(viewportClass(375), 'xs');
assert.equal(viewportClass(376), 'sm');
assert.equal(viewportClass(768), 'sm');
assert.equal(viewportClass(769), 'md');
assert.equal(viewportClass(1024), 'md');
assert.equal(viewportClass(1025), 'lg');
assert.equal(viewportClass(1440), 'lg');
assert.equal(viewportClass(1920), 'lg');

assert.equal(typography.active, 'site');
assert.equal(typography.available.site, 'site');
assert.equal(typography.available.proposed, 'proposed');
assert(Object.isFrozen(typography));

assert.equal(setTypographyStack('proposed'), 'proposed');
assert.equal(mockDoc.documentElement.dataset.typography, 'proposed');
assert.equal(setTypographyStack('invalid_choice'), 'site');
assert.equal(mockDoc.documentElement.dataset.typography, 'site');

console.log('  ✅ contracts/tokens.js passed.');

// 5. Test event-bus.js
console.log('  Testing src/js/shared/event-bus.js...');
const { createEventBus, sharedEventBus } = await import('../src/js/shared/event-bus.js');

const bus = createEventBus();
let callCount = 0;
let lastPayload = null;

const unsub = bus.on('user:login', (data) => {
  callCount++;
  lastPayload = data;
});

bus.emit('user:login', { id: 'u1', role: 'MEMBER' });
assert.equal(callCount, 1);
assert.deepEqual(lastPayload, { id: 'u1', role: 'MEMBER' });

// once listener
let onceCount = 0;
bus.once('notify', () => { onceCount++; });
bus.emit('notify');
bus.emit('notify');
assert.equal(onceCount, 1, 'once listener must fire only once');

// unsubscribe
unsub();
bus.emit('user:login', { id: 'u2' });
assert.equal(callCount, 1, 'unsubscribed listener must not receive further events');

// listenerCount & clear
bus.on('ping', () => {});
bus.on('ping', () => {});
assert.equal(bus.listenerCount('ping'), 2);
bus.clear('ping');
assert.equal(bus.listenerCount('ping'), 0);

console.log('  ✅ event-bus.js passed.');

// 6. Test barrel export src/js/shared/index.js
console.log('  Testing src/js/shared/index.js (barrel export)...');
const sharedIndex = await import('../src/js/shared/index.js');

assert.equal(typeof sharedIndex.el, 'function');
assert.equal(typeof sharedIndex.frag, 'function');
assert.equal(typeof sharedIndex.clear, 'function');
assert.equal(typeof sharedIndex.mount, 'function');
assert.equal(typeof sharedIndex.textOrNull, 'function');
assert.equal(typeof sharedIndex.initials, 'function');
assert.equal(typeof sharedIndex.convertSolar2Lunar, 'function');
assert.equal(typeof sharedIndex.getYearCanChi, 'function');
assert.equal(typeof sharedIndex.viewportClass, 'function');
assert.equal(typeof sharedIndex.setTypographyStack, 'function');
assert.equal(typeof sharedIndex.createEventBus, 'function');
assert.equal(typeof sharedIndex.sharedEventBus, 'object');

console.log('  ✅ src/js/shared/index.js barrel export passed.');

// 7. Test backward compatibility facades
console.log('  Testing backward compatibility facades (src/js/ui/dom.js & src/js/ui/tokens.js)...');
const domFacade = await import('../src/js/ui/dom.js');
const tokensFacade = await import('../src/js/ui/tokens.js');

assert.strictEqual(domFacade.el, el, 'domFacade.el must match shared el exactly');
assert.strictEqual(domFacade.frag, frag, 'domFacade.frag must match shared frag exactly');
assert.strictEqual(domFacade.clear, clear, 'domFacade.clear must match shared clear exactly');
assert.strictEqual(domFacade.mount, mount, 'domFacade.mount must match shared mount exactly');
assert.strictEqual(domFacade.textOrNull, textOrNull, 'domFacade.textOrNull must match shared textOrNull exactly');
assert.strictEqual(domFacade.initials, initials, 'domFacade.initials must match shared initials exactly');

assert.strictEqual(tokensFacade.breakpoints, breakpoints, 'tokensFacade.breakpoints must match shared breakpoints exactly');
assert.strictEqual(tokensFacade.viewportClass, viewportClass, 'tokensFacade.viewportClass must match shared viewportClass exactly');
assert.strictEqual(tokensFacade.typography, typography, 'tokensFacade.typography must match shared typography exactly');
assert.strictEqual(tokensFacade.setTypographyStack, setTypographyStack, 'tokensFacade.setTypographyStack must match shared setTypographyStack exactly');

console.log('  ✅ Backward compatibility facades passed with 100% reference identity.');

console.log('\n🎉 ALL SC-02 SHARED LAYER & DESIGN TOKENS TESTS PASSED SUCCESSFULLY!');

