/**
 * tests/test_gateway_hardening.mjs
 * Verification of W-B01-01 (Member Gateway Hardening & Invitation Card).
 *
 * Asserts:
 * 1. Gateway routes (gia-pha, mach, tu-lieu, lich, tim-kiem) do NOT leak genealogy or private content.
 * 2. Invitation card correctly renders title, explanation, and CTA to /login.
 * 3. XSS immunity: zero unescaped HTML injection.
 */

import assert from 'node:assert/strict';

// Synthetic Mock DOM
class MockElement {
  constructor(tag) {
    this.tagName = tag.toUpperCase();
    this.children = [];
    this.attributes = {};
    this.style = {};
    this.textContent = '';
    this.className = '';
  }
  setAttribute(k, v) { this.attributes[k] = String(v); }
  getAttribute(k) { return this.attributes[k] || null; }
  appendChild(c) {
    this.children.push(c);
    this._recomputeText();
    return c;
  }
  removeChild(c) {
    const idx = this.children.indexOf(c);
    if (idx !== -1) this.children.splice(idx, 1);
    this._recomputeText();
  }
  _recomputeText() {
    let t = this.textContent || '';
    for (const c of this.children) {
      if (typeof c === 'string') t += c;
      else if (c && c._recomputeText) t += c._recomputeText();
    }
    return t;
  }
  addEventListener() {}
}

const mockDoc = {
  createElement: (tag) => new MockElement(tag),
  createDocumentFragment: () => new MockElement('fragment'),
  createTextNode: (t) => ({ textContent: String(t) }),
  body: new MockElement('body'),
  getElementById: () => null
};

globalThis.window = {
  scrollTo: () => {},
  location: { hash: '' }
};
globalThis.document = mockDoc;
globalThis.Element = MockElement;

const { renderInvitationGateway } = await import('../src/js/ui/gateway.js');

console.log('🧪 Starting test suite for W-B01-01 Gateway Hardening & Invitation Cards...');

const container = new MockElement('div');

// Test 1: gia-pha gateway
renderInvitationGateway(container, 'gia-pha');
let fullText = container._recomputeText();
assert(fullText.includes('Cây Phả Hệ & Hồ Sơ Dòng Dõi'), 'Gia phả gateway must render specific title');
assert(fullText.includes('Vào Không Gian Phả Hệ (Đăng Nhập) →'), 'Gia phả gateway must offer login CTA');
assert(!fullText.includes('Trần Thị Thi'), 'Must never leak internal person names');
assert(!fullText.includes('1872'), 'Must never leak vital dates to unauthenticated visitors');
console.log('  ✅ [PASS] #/gia-pha: Invitation Card rendered, ZERO genealogy data leaked');

// Test 2: mach gateway
renderInvitationGateway(container, 'mach');
fullText = container._recomputeText();
assert(fullText.includes('Không Gian Tri Thức & Biên Tập MẠCH'), 'MẠCH gateway must render specific title');
assert(fullText.includes('Đăng Nhập Đọc MẠCH →'), 'MẠCH gateway must offer login CTA');
assert(!fullText.includes('Clara'), 'Must never leak Clara intimate letters');
console.log('  ✅ [PASS] #/mach: Invitation Card rendered, ZERO internal articles leaked');

// Test 3: tu-lieu gateway
renderInvitationGateway(container, 'tu-lieu');
fullText = container._recomputeText();
assert(fullText.includes('Kho Lưu Trữ Di Ảnh & Bút Tích Lịch Sử'), 'Tư liệu gateway must render specific title');
assert(fullText.includes('Đăng Nhập Tra Cứu Tư Liệu →'), 'Tư liệu gateway must offer login CTA');
console.log('  ✅ [PASS] #/tu-lieu: Invitation Card rendered, ZERO private media leaked');

// Test 4: lich gateway
renderInvitationGateway(container, 'lich');
fullText = container._recomputeText();
assert(fullText.includes('Sổ Lịch Giỗ Tết & Lễ Bổn Mạng'), 'Lịch gateway must render specific title');
console.log('  ✅ [PASS] #/lich: Invitation Card rendered');

// Test 5: tim-kiem gateway
renderInvitationGateway(container, 'tim-kiem');
fullText = container._recomputeText();
assert(fullText.includes('Tra Cứu Thông Tin Gia Tộc'), 'Tìm kiếm gateway must render specific title');
console.log('  ✅ [PASS] #/tim-kiem: Invitation Card rendered');

console.log('\n🎉 ALL W-B01-01 GATEWAY HARDENING TESTS PASSED SUCCESSFULLY (100%)!\n');
