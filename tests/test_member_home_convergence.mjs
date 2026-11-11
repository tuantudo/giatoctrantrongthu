/**
 * tests/test_member_home_convergence.mjs
 * Verification of Member Home Convergence across 4 Slices:
 *   - Slice 1: Personal Context (Identity Hero & Person Profile Links)
 *   - Slice 2: Family Calendar (Upcoming Memorials & Feasts with Lunar calculation)
 *   - Slice 3: MẠCH Knowledge (Scope Isolation & Article Listing)
 *   - Slice 4: Family Archive Entry (185 Media & 173 Person Associations)
 */

import assert from 'node:assert/strict';

// Synthetic DOM Mock Setup
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
    if (c) {
      this.children.push(c);
      this._recomputeText();
    }
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
  querySelectorAll(sel) {
    const res = [];
    const walk = (node) => {
      for (const ch of node.children) {
        if (!ch || typeof ch !== 'object') continue;
        if (sel.startsWith('.') && ch.className && ch.className.split(/\s+/).includes(sel.slice(1))) {
          res.push(ch);
        } else if (sel.startsWith('#') && ch.attributes && ch.attributes.id === sel.slice(1)) {
          res.push(ch);
        } else if (ch.tagName && ch.tagName.toLowerCase() === sel.toLowerCase()) {
          res.push(ch);
        }
        walk(ch);
      }
    };
    walk(this);
    return res;
  }
  querySelector(sel) {
    return this.querySelectorAll(sel)[0] || null;
  }
  addEventListener() {}
}

const mockDoc = {
  createElement: (tag) => new MockElement(tag),
  createDocumentFragment: () => new MockElement('fragment'),
  createTextNode: (t) => ({ textContent: String(t) }),
  body: new MockElement('body'),
  getElementById: (id) => new MockElement('div')
};

globalThis.window = {
  scrollTo: () => {},
  location: { pathname: '/me', search: '', href: 'http://localhost:3000/me' }
};
globalThis.document = mockDoc;
globalThis.Element = MockElement;

console.log('🧪 Starting test suite for Member Home Convergence (4 Slices)...\n');

// 1. Test getUpcomingEvents from Calendar Domain Core
const { getUpcomingEvents } = await import('../src/js/domain/calendar/events.js');

const sampleEvents = [
  { month: 8, day: 15, summary: 'Ngày giỗ Cố Thu', category: 'memorial' },
  { month: 11, day: 20, summary: 'Sinh nhật Cháu Tuấn', category: 'birthday' },
  { month: 12, day: 25, summary: 'Lễ Giáng Sinh', category: 'milestone' },
  { month: 1, day: 1, summary: 'Ngày đầu năm mới', category: 'milestone' }
];

// Test with reference date Nov 1, 2026
const refDate = new Date(2026, 10, 1); // Month index 10 = November
const upcoming = getUpcomingEvents(sampleEvents, refDate, 3);
assert.equal(upcoming.length, 3, 'Must return 3 upcoming events');
assert.equal(upcoming[0].summary, 'Sinh nhật Cháu Tuấn', 'Earliest upcoming is in November');
assert.equal(upcoming[1].summary, 'Lễ Giáng Sinh', 'Second upcoming is in December');
assert.equal(upcoming[2].summary, 'Ngày đầu năm mới', 'Third upcoming crosses into January next year');
assert(upcoming[0].lunar, 'Upcoming event must be enriched with lunar calculation');
console.log('  ✅ [PASS] Calendar Domain Core: getUpcomingEvents circular calendar calculation verified.');

// 2. Test Editorial Domain Core partition & sorting
const { sortArticles, partitionByDiscourseScope } = await import('../src/js/domain/editorial/index.js');
const sampleStories = [
  { id: '1', title: 'Bài viết 1', series: 'issue-01', date: '2026-08-01' },
  { id: '2', title: 'Thư Clara 1', series: 'thu-gui-clara', date: '2026-09-01' },
  { id: '3', title: 'Bài viết 2', series: 'issue-01', date: '2026-09-15' }
];
const partitioned = partitionByDiscourseScope(sampleStories);
assert.equal(partitioned.mach.length, 2, 'MẠCH scope must contain exactly 2 articles');
assert.equal(partitioned.clara.length, 1, 'Clara scope must contain exactly 1 article');
const sortedMach = sortArticles(partitioned.mach, { sortBy: 'date', direction: 'desc' });
assert.equal(sortedMach[0].title, 'Bài viết 2', 'Sorted articles must place newest first');
console.log('  ✅ [PASS] Editorial Domain Core: Scope isolation & article sorting verified.');

// 3. Test Dashboard Component Rendering with Slices
const { renderDashboard } = await import('../src/js/ui/dashboard.js');
const container = new MockElement('div');

// Render dashboard shell
renderDashboard(container, { audience: 'member', route: { path: '/me', label: 'Member' } });

// Check sections existence
const welcomeSec = container.querySelector('#welcome');
assert(welcomeSec, 'Section #welcome must be present for Slice 1');

const calSec = container.querySelector('#calendar-upcoming');
assert(calSec, 'Section #calendar-upcoming must be present for Slice 2');

const machSec = container.querySelector('#mach-knowledge');
assert(machSec, 'Section #mach-knowledge must be present for Slice 3');

const archiveSec = container.querySelector('#family-archive');
assert(archiveSec, 'Section #family-archive must be present for Slice 4');

const doorsSec = container.querySelector('#doors');
assert(doorsSec, 'Section #doors must be present for Four Doors Navigation');

console.log('  ✅ [PASS] Member Home Structure: All 4 Slices and Navigation Doors rendered.');

// Verify V1.0 Doors & Clara Zero-Hint Concealment by default
const doorsText = doorsSec._recomputeText();
assert(doorsText.includes('Cây phả đồ dòng dõi'), 'Must contain tree door');
assert(doorsText.includes('Kho di ảnh & Kỷ vật'), 'Must contain gallery door');
assert(doorsText.includes('Lịch giỗ & Niên biểu'), 'Must contain events door');
assert(doorsText.includes('Ấn phẩm MẠCH'), 'Must contain MẠCH door');
assert(!doorsText.includes('Không gian gia đình'), 'Family spaces door must be omitted in V1.0');
assert(!doorsText.includes('Thư gửi Clara'), 'Clara door must be concealed by default (Zero-Hint)');

// Verify Clara Door appears cleanly without duplicates when eligible
globalThis.window.__CLARA_ELIGIBLE__ = true;
const eligibleContainer = new MockElement('div');
renderDashboard(eligibleContainer, { audience: 'member', route: { path: '/me', label: 'Member' } });
const eligibleDoorsSec = eligibleContainer.querySelector('#doors');
const eligibleDoorsText = eligibleDoorsSec._recomputeText();
assert(eligibleDoorsText.includes('Thư gửi Clara'), 'Clara door must appear when __CLARA_ELIGIBLE__ is true');
assert.equal(
  eligibleDoorsSec.querySelectorAll('.gi-door').filter(d => d._recomputeText().includes('Thư gửi Clara')).length,
  1,
  'Clara door must render exactly once without duplicates'
);
globalThis.window.__CLARA_ELIGIBLE__ = false;

console.log('  ✅ [PASS] V1.0 Member Doors & Clara Zero-Hint Containment verified.');

// 4. Verify Shell Navigation & Breadcrumb Convergence (AF-03, AF-04, AF-05, AF-09)
const { PUBLIC_NAV, MEMBER_NAV, buildMemberNav } = await import('../src/js/ui/shell.js');
const { resolveContext } = await import('../src/js/ui/navigation.js');

assert(PUBLIC_NAV.some(i => i.href === '#khong-gian-mach'), 'PUBLIC_NAV must use #khong-gian-mach section anchor');
assert(!PUBLIC_NAV.some(i => i.href === '#mach'), 'PUBLIC_NAV must not collide with #mach');
assert(PUBLIC_NAV.some(i => i.href === '/login' && i.label === 'Cổng thành viên →'), 'PUBLIC_NAV must display Cổng thành viên →');

assert(MEMBER_NAV.some(i => i.href === '/me/gallery'), 'MEMBER_NAV must include /me/gallery');
assert(MEMBER_NAV.some(i => i.href === '/me/events'), 'MEMBER_NAV must include /me/events');
assert(!MEMBER_NAV.some(i => i.href === '/me/family-spaces'), 'MEMBER_NAV must omit /me/family-spaces in V1.0');
assert(!MEMBER_NAV.some(i => i.href === '/me/clara'), 'Default MEMBER_NAV must omit /me/clara (Zero-Hint)');

const navIneligible = buildMemberNav({ claraEligible: false });
assert(!navIneligible.some(i => i.href === '/me/clara'), 'buildMemberNav(false) must omit /me/clara');

const navEligible = buildMemberNav({ claraEligible: true });
const machIndex = navEligible.findIndex(i => i.href === '/me/mach');
assert.equal(navEligible[machIndex + 1]?.href, '/me/clara', 'buildMemberNav(true) must insert /me/clara right after /me/mach');

// Breadcrumb duplicate fix (AF-09) & next links Zero-Hint
globalThis.window.__CLARA_ELIGIBLE__ = false;
const treeCtx = resolveContext('/me/tree');
assert.equal(
  treeCtx.breadcrumb.filter(c => c.label === 'Không gian của tôi').length,
  1,
  'Breadcrumb on /me/tree must contain Không gian của tôi only once'
);
const dashCtx = resolveContext('/me');
assert(!dashCtx.next.some(n => n.id === 'member.clara'), 'resolveContext(/me) must filter out member.clara when ineligible');
assert(!dashCtx.next.some(n => n.id === 'member.spaces'), 'resolveContext(/me) must omit member.spaces');

globalThis.window.__CLARA_ELIGIBLE__ = true;
const dashCtxEligible = resolveContext('/me');
assert(dashCtxEligible.next.some(n => n.id === 'member.clara'), 'resolveContext(/me) must include member.clara when eligible');
globalThis.window.__CLARA_ELIGIBLE__ = false;
console.log('  ✅ [PASS] Shell Navigation, Breadcrumb De-duplication & Zero-Hint Context verified.');

// 5. Verify Editorial Article Deep-Linking (?article=<slug>) (AF-11)
const { EditorialList } = await import('../src/js/ui/editorial.js');
let toggledSlug = 'UNSET';
const deepLinkList = EditorialList({
  items: [
    { slug: '01-gioi-thieu', title: 'Bài Mở Đầu', contentMarkdown: 'Nội dung bài mở đầu.' },
    { slug: '02-cay-gia-pha', title: 'Cây Gia Phả', contentMarkdown: 'Nội dung bài hai.' }
  ],
  scope: 'mach',
  activeKey: '02-cay-gia-pha',
  onToggleArticle: (key) => { toggledSlug = key; }
});
const renderedArticles = deepLinkList.querySelectorAll('.gi-article');
assert.equal(renderedArticles.length, 2, 'EditorialList must render 2 articles');
assert.equal(renderedArticles[0].getAttribute('data-article-key'), '01-gioi-thieu');
assert.equal(renderedArticles[1].getAttribute('id'), 'article-02-cay-gia-pha');
assert.equal(renderedArticles[0].querySelector('.gi-article__body').style.display, 'none', 'Non-matching article must stay collapsed');
assert.equal(renderedArticles[1].querySelector('.gi-article__body').style.display, 'block', 'Matching activeKey article must auto-expand');
assert(renderedArticles[1].querySelector('.gi-article__share-btn'), 'Article must render share deep-link button');
console.log('  ✅ [PASS] Article Deep-Linking (?article=<slug>) auto-expand & share controls verified.');

console.log('\n🎉 ALL MEMBER HOME CONVERGENCE TESTS PASSED SUCCESSFULLY (100%)!\n');
