/**
 * tests/test_domain_editorial.mjs
 * Comprehensive automated test suite for Editorial Domain Core (SC-03 Slice 3).
 *
 * PURE DOMAIN VERIFICATION — ZERO DOM, ZERO BROWSER GLOBALS, ZERO SIDE EFFECTS.
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

// Import Pure Editorial Domain Core modules
import {
  // Articles
  extractArticleSummary,
  extractArticleTitle,
  formatEditorialDate,
  hasArticleContent,
  cleanMarkdownContent,
  splitMarkdownParagraphs,
  extractBlocksText,
  sortArticles,
  paginateArticles,
  searchArticles,
  findArticleBySlug,
  validateArticleStructure,

  // Series
  resolveArticleSeries,
  getSeriesTitle,
  getSeriesArticles,
  getSeriesNeighbors,
  filterArticlesBySeries,
  isEpistolarySeries,

  // Authors
  resolveArticleAuthor,
  getAuthorName,
  getAuthorRole,
  getAuthorBio,
  getAuthorInitials,
  filterArticlesByAuthor,

  // Scope & Clara Containment
  EDITORIAL_SCOPE,
  SERIES_SCOPE_MAP,
  classifyDiscourseScope,
  partitionByDiscourseScope,
  getScopeKindLabel
} from '../src/js/domain/editorial/index.js';

console.log('====================================================');
console.log('RUNNING EDITORIAL DOMAIN CORE VERIFICATION SUITE');
console.log('====================================================');

let testsPassed = 0;
let testsTotal = 0;

function test(name, fn) {
  testsTotal++;
  try {
    fn();
    console.log(`  ✅ [PASS] ${name}`);
    testsPassed++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
    throw err;
  }
}

// ---------------------------------------------------------------------------
// 1. Pure Environment & Zero DOM
// ---------------------------------------------------------------------------
test('Pure domain environment has zero DOM globals', () => {
  assert.strictEqual(typeof window, 'undefined', 'window must be undefined in Node runtime');
  assert.strictEqual(typeof document, 'undefined', 'document must be undefined in Node runtime');
});

// ---------------------------------------------------------------------------
// 2. Article Text & Summary Extraction
// ---------------------------------------------------------------------------
test('extractArticleSummary extracts summary with proper fallback precedence', () => {
  assert.strictEqual(extractArticleSummary(null), '');
  assert.strictEqual(extractArticleSummary({}), '');
  assert.strictEqual(extractArticleSummary({ excerpt: '  Excerpt text  ' }), 'Excerpt text');
  assert.strictEqual(extractArticleSummary({ deckLead: 'Deck lead text' }), 'Deck lead text');
  assert.strictEqual(extractArticleSummary({ subtitle: 'Subtitle text' }), 'Subtitle text');
  assert.strictEqual(extractArticleSummary({ deck: 'Deck text' }), 'Deck text');
  assert.strictEqual(extractArticleSummary({ dek: 'Dek text' }), 'Dek text');

  // Priority check: excerpt overrides deckLead overrides subtitle
  assert.strictEqual(
    extractArticleSummary({ excerpt: 'A', deckLead: 'B', subtitle: 'C' }),
    'A'
  );
  assert.strictEqual(
    extractArticleSummary({ deckLead: 'B', subtitle: 'C' }),
    'B'
  );
});

test('extractArticleTitle handles title, shortTitle and fallback', () => {
  assert.strictEqual(extractArticleTitle(null), 'Chưa có tiêu đề');
  assert.strictEqual(extractArticleTitle({}), 'Chưa có tiêu đề');
  assert.strictEqual(extractArticleTitle({ title: '  Tiêu đề bài viết  ' }), 'Tiêu đề bài viết');
  assert.strictEqual(extractArticleTitle({ shortTitle: 'Tiêu đề ngắn' }), 'Tiêu đề ngắn');
  assert.strictEqual(extractArticleTitle({}, 'Tùy chọn khác'), 'Tùy chọn khác');
});

test('formatEditorialDate formats ISO and human date strings cleanly', () => {
  assert.strictEqual(formatEditorialDate(null), null);
  assert.strictEqual(formatEditorialDate(''), null);

  const formatted = formatEditorialDate('2026-07-03T16:38:00+07:00');
  assert.ok(formatted && formatted.includes('2026'), `Should contain 2026: ${formatted}`);
  assert.ok(formatted.includes('tháng 7') || formatted.includes('7'), `Should format month: ${formatted}`);

  // Human non-ISO string preservation
  assert.strictEqual(formatEditorialDate('MẠCH — Số 01 (2026)'), 'MẠCH — Số 01 (2026)');
});

test('hasArticleContent checks blocks and contentMarkdown', () => {
  assert.strictEqual(hasArticleContent(null), false);
  assert.strictEqual(hasArticleContent({}), false);
  assert.strictEqual(hasArticleContent({ blocks: [] }), false);
  assert.strictEqual(hasArticleContent({ blocks: [{ type: 'paragraph', text: 'Hello' }] }), true);
  assert.strictEqual(hasArticleContent({ contentMarkdown: '   ' }), false);
  assert.strictEqual(hasArticleContent({ contentMarkdown: '# Hello\n\nWorld' }), true);
});

test('cleanMarkdownContent and splitMarkdownParagraphs clean frontmatter and headers', () => {
  const raw = `---
title: Test Article
date: 2026-07-03
---

# Title to be stripped

Đoạn văn thứ nhất của bài viết.

Đoạn văn thứ hai của bài viết.
`;
  const clean = cleanMarkdownContent(raw);
  assert.ok(!clean.includes('---'), 'Should remove frontmatter');
  assert.ok(!clean.startsWith('# Title'), 'Should remove leading h1 header');
  assert.ok(clean.includes('Đoạn văn thứ nhất'));

  const paras = splitMarkdownParagraphs(raw);
  assert.strictEqual(paras.length, 2, 'Should have exactly 2 paragraphs');
  assert.strictEqual(paras[0], 'Đoạn văn thứ nhất của bài viết.');
  assert.strictEqual(paras[1], 'Đoạn văn thứ hai của bài viết.');
});

test('extractBlocksText extracts text from structured blocks', () => {
  const blocks = [
    { type: 'heading', text: 'Tiêu đề mục' },
    { type: 'paragraph', text: 'Nội dung đoạn văn.' },
    { type: 'quote', html: 'Trích dẫn quan trọng.' },
    { type: 'divider' },
    null
  ];
  const items = extractBlocksText(blocks);
  assert.strictEqual(items.length, 3);
  assert.strictEqual(items[0].type, 'heading');
  assert.strictEqual(items[0].text, 'Tiêu đề mục');
  assert.strictEqual(items[1].type, 'paragraph');
  assert.strictEqual(items[2].type, 'quote');
  assert.strictEqual(items[2].text, 'Trích dẫn quan trọng.');
});

test('validateArticleStructure validates required structural fields', () => {
  const invalid1 = validateArticleStructure(null);
  assert.strictEqual(invalid1.valid, false);

  const invalid2 = validateArticleStructure({ title: 'Không có ID' });
  assert.strictEqual(invalid2.valid, false);
  assert.ok(invalid2.errors.some(e => e.includes('id or a slug')));

  const invalid3 = validateArticleStructure({ slug: 'bai-01' });
  assert.strictEqual(invalid3.valid, false);
  assert.ok(invalid3.errors.some(e => e.includes('title')));

  const valid = validateArticleStructure({ slug: 'bai-01', title: 'Bài viết hợp lệ' });
  assert.strictEqual(valid.valid, true);
  assert.strictEqual(valid.errors.length, 0);
});

// ---------------------------------------------------------------------------
// 3. Sorting, Pagination & Search
// ---------------------------------------------------------------------------
test('sortArticles sorts by order, date, and title immutably', () => {
  const articles = [
    { slug: 'b', editorialOrder: 3, title: 'Bài B', publishedAt: '2026-03-01' },
    { slug: 'c', editorialOrder: 1, title: 'Bài C', publishedAt: '2026-01-01' },
    { slug: 'a', editorialOrder: 2, title: 'Bài A', publishedAt: '2026-02-01' }
  ];

  // Sort by order asc
  const byOrderAsc = sortArticles(articles, { sortBy: 'order', direction: 'asc' });
  assert.deepStrictEqual(byOrderAsc.map(a => a.slug), ['c', 'a', 'b']);

  // Sort by order desc
  const byOrderDesc = sortArticles(articles, { sortBy: 'order', direction: 'desc' });
  assert.deepStrictEqual(byOrderDesc.map(a => a.slug), ['b', 'a', 'c']);

  // Sort by title asc
  const byTitleAsc = sortArticles(articles, { sortBy: 'title', direction: 'asc' });
  assert.deepStrictEqual(byTitleAsc.map(a => a.slug), ['a', 'b', 'c']);

  // Sort by date desc
  const byDateDesc = sortArticles(articles, { sortBy: 'date', direction: 'desc' });
  assert.deepStrictEqual(byDateDesc.map(a => a.slug), ['b', 'a', 'c']);

  // Verify immutability of original array
  assert.deepStrictEqual(articles.map(a => a.slug), ['b', 'c', 'a']);
});

test('paginateArticles accurately partitions pages and computes pagination metadata', () => {
  const list = Array.from({ length: 12 }, (_, i) => ({ id: `art-${i + 1}`, order: i + 1 }));

  // Page 1 with pageSize 5
  const p1 = paginateArticles(list, { page: 1, pageSize: 5 });
  assert.strictEqual(p1.total, 12);
  assert.strictEqual(p1.page, 1);
  assert.strictEqual(p1.pageSize, 5);
  assert.strictEqual(p1.totalPages, 3);
  assert.strictEqual(p1.items.length, 5);
  assert.strictEqual(p1.hasNext, true);
  assert.strictEqual(p1.hasPrev, false);
  assert.strictEqual(p1.items[0].id, 'art-1');
  assert.strictEqual(p1.items[4].id, 'art-5');

  // Page 2
  const p2 = paginateArticles(list, { page: 2, pageSize: 5 });
  assert.strictEqual(p2.items.length, 5);
  assert.strictEqual(p2.hasNext, true);
  assert.strictEqual(p2.hasPrev, true);
  assert.strictEqual(p2.items[0].id, 'art-6');

  // Page 3
  const p3 = paginateArticles(list, { page: 3, pageSize: 5 });
  assert.strictEqual(p3.items.length, 2);
  assert.strictEqual(p3.hasNext, false);
  assert.strictEqual(p3.hasPrev, true);
  assert.strictEqual(p3.items[0].id, 'art-11');
  assert.strictEqual(p3.items[1].id, 'art-12');

  // Out of bound clamped to page 3
  const pClamped = paginateArticles(list, { page: 99, pageSize: 5 });
  assert.strictEqual(pClamped.page, 3);
  assert.strictEqual(pClamped.items.length, 2);

  // Empty list
  const pEmpty = paginateArticles([], { page: 1, pageSize: 5 });
  assert.strictEqual(pEmpty.total, 0);
  assert.strictEqual(pEmpty.items.length, 0);
  assert.strictEqual(pEmpty.totalPages, 1);
  assert.strictEqual(pEmpty.hasNext, false);
  assert.strictEqual(pEmpty.hasPrev, false);
});

test('searchArticles filters by keyword across title, subtitle, summary, author, topics', () => {
  const sampleArticles = [
    { slug: '01', title: 'Giới Thiệu: MẠCH được bắt đầu như thế nào?', authorId: 'nguoi-giu-mach', topics: ['khoi-nguyen'] },
    { slug: '02', title: 'Cây Gia Phả và MẠCH', authorId: 'nguoi-giu-mach', excerpt: 'Mối quan hệ giữa dữ liệu và tự sự' },
    { slug: '03', title: 'Khi sự gần gũi không còn tự nhiên', authorId: 'nguoi-giu-mach', topics: ['gia-dinh'] },
    { slug: '12', title: 'Ghi chú và chú giải tư liệu', authorId: 'mach-editorial', subtitle: 'Tổng kết tập san' }
  ];

  // Search title
  const r1 = searchArticles(sampleArticles, 'Giới Thiệu');
  assert.strictEqual(r1.length, 1);
  assert.strictEqual(r1[0].slug, '01');

  // Search case-insensitive and Vietnamese diacritics
  const r2 = searchArticles(sampleArticles, 'mạch');
  assert.strictEqual(r2.length, 2); // 01 and 02

  // Search summary / excerpt
  const r3 = searchArticles(sampleArticles, 'dữ liệu');
  assert.strictEqual(r3.length, 1);
  assert.strictEqual(r3[0].slug, '02');

  // Search author
  const r4 = searchArticles(sampleArticles, 'mach-editorial');
  assert.strictEqual(r4.length, 1);
  assert.strictEqual(r4[0].slug, '12');

  // Search non-existing
  const rNone = searchArticles(sampleArticles, 'xyz-not-found');
  assert.strictEqual(rNone.length, 0);

  // Empty query returns all
  const rAll = searchArticles(sampleArticles, '');
  assert.strictEqual(rAll.length, 4);
});

test('findArticleBySlug looks up article by slug or id', () => {
  const articles = [
    { id: 'art-01', slug: 'bai-mot', title: 'Bài 1' },
    { id: 'art-02', slug: 'bai-hai', title: 'Bài 2' }
  ];
  assert.strictEqual(findArticleBySlug(articles, 'bai-mot').id, 'art-01');
  assert.strictEqual(findArticleBySlug(articles, 'art-02').slug, 'bai-hai');
  assert.strictEqual(findArticleBySlug(articles, 'khong-ton-tai'), null);
  assert.strictEqual(findArticleBySlug(null, 'bai-mot'), null);
});

// ---------------------------------------------------------------------------
// 4. Series Domain Logic
// ---------------------------------------------------------------------------
test('resolveArticleSeries resolves series from registry via seriesIds, seriesSlug, or series', () => {
  const seriesRegistry = {
    'issue-01': { id: 'issue-01', title: 'Tập san MẠCH — Số 01', shortTitle: 'Số 01' },
    'thu-gui-clara': { id: 'thu-gui-clara', title: 'Thư gửi Clara', seriesType: 'epistolary' }
  };

  assert.strictEqual(resolveArticleSeries(seriesRegistry, { seriesIds: ['issue-01'] }).id, 'issue-01');
  assert.strictEqual(resolveArticleSeries(seriesRegistry, { seriesSlug: 'issue-01' }).id, 'issue-01');
  assert.strictEqual(resolveArticleSeries(seriesRegistry, { series: 'thu-gui-clara' }).id, 'thu-gui-clara');
  assert.strictEqual(resolveArticleSeries(seriesRegistry, { seriesId: 'issue-01' }).id, 'issue-01');
  assert.strictEqual(resolveArticleSeries(seriesRegistry, { seriesSlug: 'unknown' }), null);
  assert.strictEqual(resolveArticleSeries(null, { seriesSlug: 'issue-01' }), null);
});

test('getSeriesTitle and isEpistolarySeries handle series attributes', () => {
  const ser1 = { id: 's1', shortTitle: 'Số 01', title: 'Tập san MẠCH — Số 01' };
  const ser2 = { id: 's2', title: 'Tập san MẠCH — Số 02' };
  const ser3 = { id: 'clara', seriesType: 'epistolary' };

  assert.strictEqual(getSeriesTitle(ser1), 'Số 01');
  assert.strictEqual(getSeriesTitle(ser2), 'Tập san MẠCH — Số 02');
  assert.strictEqual(getSeriesTitle(null), 'MẠCH');
  assert.strictEqual(getSeriesTitle(null, 'Dự phòng'), 'Dự phòng');

  assert.strictEqual(isEpistolarySeries(ser1), false);
  assert.strictEqual(isEpistolarySeries(ser3), true);
  assert.strictEqual(isEpistolarySeries(null), false);
});

test('getSeriesArticles orders articles matching series.articleIds', () => {
  const series = {
    id: 'issue-01',
    articleIds: ['art-03', 'art-01', 'art-02']
  };
  const articles = [
    { slug: 'art-01', title: '1' },
    { slug: 'art-02', title: '2' },
    { slug: 'art-03', title: '3' },
    { slug: 'art-other', title: 'Other' }
  ];

  const ordered = getSeriesArticles(series, articles);
  assert.strictEqual(ordered.length, 3);
  assert.deepStrictEqual(ordered.map(a => a.slug), ['art-03', 'art-01', 'art-02']);
});

test('getSeriesNeighbors computes previous and next article in series', () => {
  const series = {
    id: 'issue-01',
    articleIds: ['art-01', 'art-02', 'art-03']
  };
  const articles = [
    { slug: 'art-01', title: 'Bài 1' },
    { slug: 'art-02', title: 'Bài 2' },
    { slug: 'art-03', title: 'Bài 3' }
  ];

  // First article
  const n1 = getSeriesNeighbors(series, articles, 'art-01');
  assert.strictEqual(n1.prev, null);
  assert.strictEqual(n1.next.slug, 'art-02');
  assert.strictEqual(n1.index, 0);
  assert.strictEqual(n1.total, 3);

  // Middle article
  const n2 = getSeriesNeighbors(series, articles, 'art-02');
  assert.strictEqual(n2.prev.slug, 'art-01');
  assert.strictEqual(n2.next.slug, 'art-03');
  assert.strictEqual(n2.index, 1);

  // Last article
  const n3 = getSeriesNeighbors(series, articles, 'art-03');
  assert.strictEqual(n3.prev.slug, 'art-02');
  assert.strictEqual(n3.next, null);
  assert.strictEqual(n3.index, 2);

  // Unknown article
  const nUnknown = getSeriesNeighbors(series, articles, 'unknown');
  assert.strictEqual(nUnknown.prev, null);
  assert.strictEqual(nUnknown.next, null);
  assert.strictEqual(nUnknown.index, -1);
});

test('filterArticlesBySeries filters articles by series ID or slug', () => {
  const articles = [
    { slug: '1', seriesSlug: 'issue-01' },
    { slug: '2', seriesIds: ['issue-01'] },
    { slug: '3', seriesSlug: 'thu-gui-clara' }
  ];
  const machArticles = filterArticlesBySeries(articles, 'issue-01');
  assert.strictEqual(machArticles.length, 2);
  assert.deepStrictEqual(machArticles.map(a => a.slug), ['1', '2']);
});

// ---------------------------------------------------------------------------
// 5. Author Domain Logic
// ---------------------------------------------------------------------------
test('resolveArticleAuthor and author metadata helpers', () => {
  const authorsRegistry = {
    'nguoi-giu-mach': { id: 'nguoi-giu-mach', name: 'Người giữ mạch', role: 'Khảo cứu', bio: 'Khởi xướng...' },
    'mach-editorial': { id: 'mach-editorial', name: 'Ban Biên Tập MẠCH', role: 'Xuất bản' }
  };

  const a1 = resolveArticleAuthor(authorsRegistry, { authorIds: ['nguoi-giu-mach'] });
  assert.strictEqual(a1.id, 'nguoi-giu-mach');
  assert.strictEqual(getAuthorName(a1), 'Người giữ mạch');
  assert.strictEqual(getAuthorRole(a1), 'Khảo cứu');
  assert.strictEqual(getAuthorBio(a1), 'Khởi xướng...');
  assert.strictEqual(getAuthorInitials(a1), 'N');

  const aUnknown = resolveArticleAuthor(authorsRegistry, { authorId: 'unknown' });
  assert.strictEqual(aUnknown, null);
  assert.strictEqual(getAuthorName(aUnknown), 'Ban Biên Tập');
  assert.strictEqual(getAuthorInitials(aUnknown), 'B');
});

test('filterArticlesByAuthor filters articles written by author', () => {
  const articles = [
    { slug: '1', authorId: 'nguoi-giu-mach' },
    { slug: '2', authorIds: ['mach-editorial'] },
    { slug: '3', authorId: 'nguoi-giu-mach' }
  ];
  const list = filterArticlesByAuthor(articles, 'nguoi-giu-mach');
  assert.strictEqual(list.length, 2);
  assert.deepStrictEqual(list.map(a => a.slug), ['1', '3']);
});

// ---------------------------------------------------------------------------
// 6. Discourse Scope & Clara Privacy Containment
// ---------------------------------------------------------------------------
test('classifyDiscourseScope adheres strictly to explicit metadata and never guesses', () => {
  // 1. Explicit discourseScope
  assert.strictEqual(classifyDiscourseScope({ discourseScope: 'mach' }), EDITORIAL_SCOPE.MACH);
  assert.strictEqual(classifyDiscourseScope({ discourseScope: 'clara' }), EDITORIAL_SCOPE.CLARA);

  // 2. Series hints
  assert.strictEqual(classifyDiscourseScope({ seriesSlug: 'issue-01' }), EDITORIAL_SCOPE.MACH);
  assert.strictEqual(classifyDiscourseScope({ series: 'mach' }), EDITORIAL_SCOPE.MACH);
  assert.strictEqual(classifyDiscourseScope({ seriesIds: ['thu-gui-clara'] }), EDITORIAL_SCOPE.CLARA);
  assert.strictEqual(classifyDiscourseScope({ seriesSlug: 'clara' }), EDITORIAL_SCOPE.CLARA);

  // 3. Strict rule: does NOT infer from title, text, or author
  const ambiguous = {
    title: 'Thư gửi Clara và những tâm tư',
    authorId: 'tuan',
    content: 'Nội dung riêng tư gia đình...'
  };
  assert.strictEqual(
    classifyDiscourseScope(ambiguous),
    null,
    'Must NOT guess scope from title or content keywords without explicit series or scope metadata'
  );

  assert.strictEqual(classifyDiscourseScope(null), null);
  assert.strictEqual(classifyDiscourseScope({}), null);
});

test('partitionByDiscourseScope strictly isolates Clara from MẠCH and retains unattributed', () => {
  const mixedPayload = {
    stories: [
      { id: 'm1', seriesSlug: 'issue-01', title: 'Bài MẠCH 1' },
      { id: 'c1', seriesSlug: 'thu-gui-clara', title: 'Lá thư Clara 1' },
      { id: 'm2', seriesSlug: 'issue-01', title: 'Bài MẠCH 2' },
      { id: 'c2', discourseScope: 'clara', title: 'Lá thư Clara 2' },
      { id: 'u1', title: 'Bài chưa có metadata scope' }
    ]
  };

  const partitioned = partitionByDiscourseScope(mixedPayload);

  // Validate partitions
  assert.strictEqual(partitioned.mach.length, 2);
  assert.deepStrictEqual(partitioned.mach.map(s => s.id), ['m1', 'm2']);

  assert.strictEqual(partitioned.clara.length, 2);
  assert.deepStrictEqual(partitioned.clara.map(s => s.id), ['c1', 'c2']);

  assert.strictEqual(partitioned.unattributed.length, 1);
  assert.deepStrictEqual(partitioned.unattributed.map(s => s.id), ['u1']);

  // ZERO LEAK: Clara items MUST NOT appear in MẠCH
  const machString = JSON.stringify(partitioned.mach);
  assert.ok(!machString.includes('c1'), 'Clara c1 must not be in MẠCH');
  assert.ok(!machString.includes('c2'), 'Clara c2 must not be in MẠCH');
  assert.ok(!machString.toLowerCase().includes('clara'), 'No Clara keyword in MẠCH bucket');

  // Input immutability
  assert.strictEqual(mixedPayload.stories.length, 5);
});

test('getScopeKindLabel returns human-readable discourse descriptions', () => {
  assert.strictEqual(getScopeKindLabel('mach'), 'Diễn ngôn nội bộ của gia tộc');
  assert.strictEqual(getScopeKindLabel('internal'), 'Diễn ngôn nội bộ của gia tộc');
  assert.strictEqual(getScopeKindLabel('clara'), 'Diễn ngôn cá nhân, riêng tư');
  assert.strictEqual(getScopeKindLabel('intimate'), 'Diễn ngôn cá nhân, riêng tư');
  assert.strictEqual(getScopeKindLabel('public'), 'Tiếng nói hướng ra bên ngoài');
});

// ---------------------------------------------------------------------------
// 7. Verification Against Actual Repository Datasets
// ---------------------------------------------------------------------------
test('Full parity on real dataset: server/data/mach.json (12 MẠCH articles)', () => {
  const p = path.join(process.cwd(), 'server/data/mach.json');
  assert.ok(fs.existsSync(p), 'server/data/mach.json must exist');

  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  assert.strictEqual(data.articles.length, 12, 'Must contain 12 articles');

  // 1. Partition verification
  const partitioned = partitionByDiscourseScope(data);
  assert.strictEqual(partitioned.mach.length, 12, 'All 12 articles must partition into MẠCH');
  assert.strictEqual(partitioned.clara.length, 0, 'Zero Clara articles in server/data/mach.json');
  assert.strictEqual(partitioned.unattributed.length, 0, 'Zero unattributed articles');

  // 2. Validate all 12 articles
  for (const article of data.articles) {
    const val = validateArticleStructure(article);
    assert.strictEqual(val.valid, true, `Article ${article.slug} must be structurally valid`);

    // Verify series resolution
    const series = resolveArticleSeries(data.series, article);
    assert.ok(series, `Series must resolve for ${article.slug}`);
    assert.strictEqual(series.id, 'issue-01');

    // Verify author resolution
    const author = resolveArticleAuthor(data.authors, article);
    assert.ok(author, `Author must resolve for ${article.slug}`);
    assert.ok(getAuthorName(author).length > 0);

    // Verify content presence
    assert.strictEqual(hasArticleContent(article), true, `Article ${article.slug} must have content`);
  }

  // 3. Verify series neighbors across all 12 articles
  const series01 = data.series['issue-01'];
  for (let i = 0; i < data.articles.length; i++) {
    const slug = data.articles[i].slug;
    const n = getSeriesNeighbors(series01, data.articles, slug);
    assert.strictEqual(n.index, i, `Index match for ${slug}`);
    if (i > 0) {
      assert.strictEqual(n.prev.slug, data.articles[i - 1].slug);
    } else {
      assert.strictEqual(n.prev, null);
    }
    if (i < data.articles.length - 1) {
      assert.strictEqual(n.next.slug, data.articles[i + 1].slug);
    } else {
      assert.strictEqual(n.next, null);
    }
  }

  // 4. Verify search
  const found = searchArticles(data.articles, 'đời sống đương đại');
  assert.ok(found.length >= 1, 'Should find articles matching query');
});

test('Full parity on real dataset: fixtures/synthetic_clara.json (8 Clara letters)', () => {
  const p = path.join(process.cwd(), 'fixtures/synthetic_clara.json');
  assert.ok(fs.existsSync(p), 'fixtures/synthetic_clara.json must exist');

  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  assert.strictEqual(data.articles.length, 8, 'Must contain 8 Clara letters');

  // 1. Partition verification
  const partitioned = partitionByDiscourseScope(data);
  assert.strictEqual(partitioned.clara.length, 8, 'All 8 letters must partition into Clara');
  assert.strictEqual(partitioned.mach.length, 0, 'Zero Clara letters in MẠCH partition');
  assert.strictEqual(partitioned.unattributed.length, 0, 'Zero unattributed letters');

  // 2. Validate all 8 letters
  for (const letter of data.articles) {
    const val = validateArticleStructure(letter);
    assert.strictEqual(val.valid, true, `Letter ${letter.slug} must be structurally valid`);

    // Verify series resolution
    const series = resolveArticleSeries(data.series, letter);
    assert.ok(series, `Series must resolve for ${letter.slug}`);
    assert.strictEqual(series.id, 'thu-gui-clara');
    assert.strictEqual(isEpistolarySeries(series), true, 'Clara series is epistolary');

    // Verify author resolution
    const author = resolveArticleAuthor(data.authors, letter);
    assert.ok(author, `Author must resolve for ${letter.slug}`);
    assert.strictEqual(author.id, 'tuan');
  }
});

console.log('====================================================');
console.log(`TOTAL: ${testsPassed}/${testsTotal} tests PASSED.`);
console.log('====================================================');
