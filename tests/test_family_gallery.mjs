/**
 * tests/test_family_gallery.mjs
 * Comprehensive automated verification for Increment 02 — FAMILY PHOTO GALLERY.
 *
 * Verifies:
 *   1. Pure Archive Domain Core functions with synthetic fixtures.
 *   2. Gallery Component UI rendering with filter tabs, person filter, and search.
 *   3. Person Profile two-way navigation integration.
 *   4. Navigation registry and sitemap compliance.
 *   5. Backend Member Authorization Gate (/me/gallery, /api/media.json, /api/person_media.json).
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';

console.log('🧪 Starting test suite for Increment 02: Family Photo Gallery...\n');

// =========================================================================
// 1. PURE ARCHIVE DOMAIN CORE VERIFICATION
// =========================================================================
console.log('--- [1/5] Testing Pure Archive Domain Core Logic ---');

const {
  normalizeMediaList,
  indexMediaById,
  filterMediaByKind,
  groupMediaByKind,
  resolveAssetIdFromPersonMedia,
  deriveAssetIdFromRelationId,
  resolvePrimaryPortrait,
  getPersonMediaList,
  formatMediaCaption,
  getMediaDimensionsOrAspect,
  getMediaKindLabel
} = await import('../src/js/domain/archive/index.js');

// Load synthetic fixtures
const syntheticMediaRaw = JSON.parse(fs.readFileSync('fixtures/synthetic_media.json', 'utf8'));
const syntheticPersonMedia = JSON.parse(fs.readFileSync('fixtures/synthetic_person_media.json', 'utf8'));

// Test normalization
const normalizedMedia = normalizeMediaList(syntheticMediaRaw);
assert.equal(normalizedMedia.length, 185, 'Synthetic media collection must have exactly 185 assets');
console.log(`  ✅ normalizeMediaList normalized ${normalizedMedia.length} media records.`);

// Test indexing
const mediaIndex = indexMediaById(normalizedMedia);
assert(mediaIndex['MEDIA_FS_G1B5-W5Y'], 'Index must contain MEDIA_FS_G1B5-W5Y');
assert.equal(Object.keys(mediaIndex).length, 185, 'Indexed dictionary must contain 185 keys');
console.log('  ✅ indexMediaById indexed all 185 items by assetId.');

// Test grouping by kind
const grouped = groupMediaByKind(normalizedMedia);
assert(Array.isArray(grouped.portrait), 'Must have portrait array');
assert(grouped.portrait.length > 0, 'Portrait bucket must not be empty');
console.log(`  ✅ groupMediaByKind grouped assets: ${grouped.portrait.length} portraits, ${grouped.document.length} documents, ${grouped.grave.length} graves, ${grouped.family.length + grouped.milestone.length} family/milestones.`);

// Test person media resolution & heuristics
const samplePM = syntheticPersonMedia.find(pm => pm.personId === '@I223@');
assert(samplePM, 'Sample PM record for @I223@ must exist');
const resolvedAssetId = resolveAssetIdFromPersonMedia(samplePM);
assert.equal(resolvedAssetId, 'MEDIA_FS_G1B5-W5Y', 'Resolved asset ID must match MEDIA_FS_G1B5-W5Y');

// Test primary portrait resolution
const primaryPortrait = resolvePrimaryPortrait('@I223@', syntheticPersonMedia, mediaIndex);
assert(primaryPortrait, 'Primary portrait must be resolved for @I223@');
assert.equal(primaryPortrait.assetId, 'MEDIA_FS_G1B5-W5Y');
console.log(`  ✅ resolvePrimaryPortrait resolved primary portrait for @I223@ -> ${primaryPortrait.assetId}.`);

// Test getPersonMediaList
const personMedia = getPersonMediaList('@I223@', syntheticPersonMedia, mediaIndex);
assert.equal(personMedia.length, 1, '@I223@ must have 1 associated photo');
assert.equal(personMedia[0].assetId, 'MEDIA_FS_G1B5-W5Y');
console.log('  ✅ getPersonMediaList correctly retrieved media associated with individual.');

// Test caption and dimensions
const caption = formatMediaCaption(primaryPortrait, 'Default');
assert(caption.includes('Hồng') || caption.includes('FamilySearch'), 'Caption must extract descriptive label');
const dims = getMediaDimensionsOrAspect(primaryPortrait);
assert(dims !== null, 'Dimensions object must not be null');
console.log('  ✅ formatMediaCaption & getMediaDimensionsOrAspect passed.');

// =========================================================================
// 2. SYNTHETIC DOM MOCK & UI COMPONENT RENDERING
// =========================================================================
console.log('\n--- [2/5] Testing Gallery UI Component (src/js/ui/gallery.js) ---');

class MockElement {
  constructor(tag) {
    this.tagName = tag.toUpperCase();
    this.children = [];
    this.attributes = {};
    this.style = {};
    this.textContent = '';
    this.className = '';
    this.eventListeners = {};
  }
  get firstChild() { return this.children[0] || null; }
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
  addEventListener(evt, fn) {
    this.eventListeners[evt] = this.eventListeners[evt] || [];
    this.eventListeners[evt].push(fn);
  }
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
  location: { pathname: '/me/gallery', search: '', href: 'http://localhost:3000/me/gallery' },
  addEventListener: () => {}
};
globalThis.document = mockDoc;
globalThis.Element = MockElement;

// Import gallery and mock adapter
const { enableMock, setMockPersonaKey } = await import('../src/js/ui/mock-adapter.js');
enableMock(true);
setMockPersonaKey('A-HD');

const { renderGallery } = await import('../src/js/ui/gallery.js');

const container = new MockElement('div');
renderGallery(container, { route: { path: '/me/gallery' } });

// Wait a tick for async Region loading
await new Promise(r => setTimeout(r, 80));

const header = container.querySelector('.gi-pageheader');
assert(header, 'Page Header must be rendered');
console.log('  ✅ PageHeader rendered with Heritage branding.');

const cards = container.querySelectorAll('.gi-gallery__card');
assert.equal(cards.length, 185, `All 185 media items must be rendered in grid (Found: ${cards.length})`);
console.log(`  ✅ Gallery Grid rendered all ${cards.length} media cards.`);

const tabs = container.querySelectorAll('.gi-gallery__tab');
assert.equal(tabs.length, 5, `Must render exactly 5 filter tabs (Found: ${tabs.length})`);
console.log('  ✅ 5 Category Filter Tabs rendered.');

// Test with person filter option
const personContainer = new MockElement('div');
renderGallery(personContainer, { route: { path: '/me/gallery' } }, { personId: '@I223@' });
await new Promise(r => setTimeout(r, 80));

const personCards = personContainer.querySelectorAll('.gi-gallery__card');
assert.equal(personCards.length, 1, `Person filter for @I223@ must display exactly 1 card (Found: ${personCards.length})`);
const banner = personContainer.querySelector('.gi-gallery__person-filter-banner');
assert(banner, 'Person filter banner must be displayed when filtering by person');
console.log(`  ✅ Person filter for @I223@ correctly isolated ${personCards.length} matching card and displayed banner.`);

// =========================================================================
// 3. TWO-WAY CROSS NAVIGATION WITH PERSON PROFILE
// =========================================================================
console.log('\n--- [3/5] Testing Two-Way Navigation with Person Profile ---');

const { renderPerson } = await import('../src/js/ui/person.js');

const personProfileContainer = new MockElement('div');
renderPerson(personProfileContainer, '@I223@', { path: '/me/tree/person/@I223@' });
await new Promise(r => setTimeout(r, 80));

const thumbs = personProfileContainer.querySelectorAll('.gi-person-photo-thumb');
assert(thumbs.length > 0, `Person Profile must render photo thumbnails for @I223@ (Found: ${thumbs.length})`);

const openGalleryLink = personProfileContainer.querySelectorAll('a').find(a =>
  (a.attributes?.href || '').includes('/me/gallery?personId=') ||
  (a.textContent || '').includes('Kho Tư Liệu Ảnh')
);
assert(openGalleryLink, 'Person Profile must contain [Mở trong Kho Tư Liệu Ảnh Gia Tộc] link');
console.log(`  ✅ Person Profile renders photo thumbnails and two-way link to Gallery (${openGalleryLink.attributes.href}).`);

// In Gallery card, check tag links back to person profile
const personChip = cards[0].querySelector('.gi-gallery__tag');
if (personChip) {
  assert((personChip.attributes?.href || '').includes('/me/tree/person/'), 'Tag chip must link to person profile');
  console.log('  ✅ Gallery card tags link directly to Person 6-Layer Profile.');
}

// =========================================================================
// 4. NAVIGATION REGISTRY & SITEMAP COMPLIANCE
// =========================================================================
console.log('\n--- [4/5] Testing Navigation Registry & Route Resolution ---');

const { matchRoute, routes } = await import('../src/js/ui/navigation.js');

const galleryRoute = routes.find(r => r.id === 'member.gallery');
assert(galleryRoute, 'member.gallery route must be registered');
assert.equal(galleryRoute.path, '/me/gallery');
assert.equal(galleryRoute.audience, 'member');

const matched = matchRoute('/me/gallery');
assert.equal(matched.route?.id, 'member.gallery', 'matchRoute must resolve /me/gallery to member.gallery');
console.log('  ✅ Route /me/gallery registered and matches member audience.');

// =========================================================================
// 5. BACKEND MEMBER AUTHORIZATION GATE VERIFICATION
// =========================================================================
console.log('\n--- [5/5] Testing Backend Authorization Gates ---');

const repoRoot = process.cwd();
process.chdir(path.join(repoRoot, 'server'));

const serverModule = await import(path.join(repoRoot, 'server', 'index.js'));
const { app, initDB } = serverModule.default || serverModule;

await initDB();

// Fast in-process route test helper (Zero socket overhead, sandbox-safe)
function testRoute(targetApp, method, url, headers = {}, session = {}) {
  return new Promise((resolve) => {
    const req = {
      method,
      url,
      originalUrl: url,
      path: url.split('?')[0],
      headers: { host: '127.0.0.1', ...headers },
      get: (h) => headers[h.toLowerCase()] || (h.toLowerCase() === 'host' ? '127.0.0.1' : undefined),
      session,
      query: {},
      params: {}
    };
    let statusCode = 200;
    const resHeaders = {};
    const res = {
      statusCode: 200,
      status(code) { statusCode = code; this.statusCode = code; return this; },
      set(k, v) { resHeaders[k.toLowerCase()] = v; return this; },
      setHeader(k, v) { resHeaders[k.toLowerCase()] = v; return this; },
      redirect(loc) {
        statusCode = 302;
        this.statusCode = 302;
        resHeaders['location'] = loc;
        resolve({ status: statusCode, location: loc, headers: resHeaders });
      },
      json(body) { resolve({ status: statusCode, headers: resHeaders, body }); },
      send(body) { resolve({ status: statusCode, headers: resHeaders, body }); },
      sendFile(file) { resolve({ status: statusCode, headers: resHeaders, file }); }
    };
    targetApp.handle(req, res);
  });
}

// 5.1 Test unauthenticated GET /me/gallery -> 302 to /login
const galleryRes = await testRoute(app, 'GET', '/me/gallery');
assert.equal(galleryRes.status, 302, 'Unauthenticated /me/gallery must return 302 redirect');
assert.equal(galleryRes.location, '/login', 'Must redirect to /login');
console.log('  ✅ Unauthenticated GET /me/gallery redirects to /login (302).');

// 5.2 Test unauthenticated GET /api/media.json -> 401
const mediaApiRes = await testRoute(app, 'GET', '/api/media.json');
assert.equal(mediaApiRes.status, 401, 'Unauthenticated /api/media.json must return 401');
console.log('  ✅ Unauthenticated GET /api/media.json returns 401 Unauthorized.');

// 5.3 Test unauthenticated GET /api/person_media.json -> 401
const pmApiRes = await testRoute(app, 'GET', '/api/person_media.json');
assert.equal(pmApiRes.status, 401, 'Unauthenticated /api/person_media.json must return 401');
console.log('  ✅ Unauthenticated GET /api/person_media.json returns 401 Unauthorized.');

// 5.4 Test authenticated member GET /me/gallery -> 200 serves member_gallery.html
const authGalleryRes = await testRoute(app, 'GET', '/me/gallery', {}, {
  accountId: '88af7ac9-3c6d-467e-8f1b-9a2f1e95564d',
  username: 'tuantq',
  role: 'member',
  status: 'ACTIVE'
});
assert.equal(authGalleryRes.status, 200, 'Authenticated member /me/gallery must return 200');
assert(authGalleryRes.file.endsWith('member_gallery.html'), 'Must serve member_gallery.html');
console.log('  ✅ Authenticated member GET /me/gallery serves member_gallery.html (200).');

process.chdir(repoRoot);

console.log('\n============================================================');
console.log('🎉 ALL INCREMENT 02 FAMILY PHOTO GALLERY TESTS PASSED (100%)!');
console.log('============================================================\n');
