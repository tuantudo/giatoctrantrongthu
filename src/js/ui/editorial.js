/**
 * GIATOC UI SYSTEM v0.4 — editorial.js
 * Reading-surface primitives for INTERNAL discourse (MẠCH) and INTIMATE
 * discourse (Thư gửi Clara).
 *
 * v0.4 STABILIZATION — the only change is structural:
 *   ScopeMasthead used to own an <h1> of its own, so /me/mach and /me/clara had
 *   a DIFFERENT page grammar from every other surface (no PageHeader at all).
 *   Now every surface uses PageHeader as step 2 of the skeleton and the scope
 *   explanation is a `nature` line underneath it (step 3). Same grammar,
 *   same visual language, scope still stated explicitly.
 *
 * SC-03 EDITORIAL DOMAIN EXTRACTION:
 *   Pure business rules (summary extraction, date formatting, markdown cleaning,
 *   sorting, pagination, series/author resolution, discourse partitioning)
 *   have been extracted into `src/js/domain/editorial/`.
 *   This UI module retains DOM rendering while delegating domain rules to Domain Core.
 *
 * Design constraints (unchanged, mission v0.3 §6, §7, §20; CONSOLIDATION §6.2):
 *  - Clara and MẠCH get SEPARATE surfaces with their own reading voice.
 *  - No generic "publication" component spans both scopes. ScopeMasthead's
 *    caller must name the scope, so a page cannot silently become "the
 *    publication page".
 *  - Reading first: typographic list + reading measure. NOT a SaaS card grid.
 *  - Nothing is rendered that the API did not return.
 */

import { el, textOrNull } from './dom.js';
import { DISCOURSE, scopeMeta } from './contexts.js';
import {
  extractArticleSummary,
  extractArticleTitle,
  formatEditorialDate,
  hasArticleContent,
  cleanMarkdownContent,
  splitMarkdownParagraphs,
  getScopeKindLabel
} from '../domain/editorial/index.js';

// Re-export domain rules to serve as a backward-compatible facade
export * from '../domain/editorial/index.js';

/* --------------------------------------------------------------- masthead */
/**
 * Step 3 of the page skeleton: the scope explanation for a reading surface.
 * It does NOT render its own <h1> — PageHeader owns the title on every surface,
 * so the heading hierarchy is identical everywhere.
 */
export function ScopeMasthead({ scope, count = null, note = null } = {}) {
  const meta = scopeMeta(scope);
  if (!meta) return null;
  return el('header', {
    class: `gi-masthead gi-masthead--${meta.visual}`,
    'data-scope': scope,
    'data-scope-kind': meta.kind
  }, [
    el('p', { class: 'gi-masthead__kind', text: getScopeKindLabel(meta.kind) }),
    el('p', { class: 'gi-masthead__nature', text: meta.readingNature }),
    Number.isFinite(count)
      ? el('p', { class: 'gi-masthead__count', text: `${count} bài trong phạm vi này` })
      : null,
    textOrNull(note) ? el('p', { class: 'gi-masthead__note', text: note }) : null
  ]);
}

/* ------------------------------------------------------------ meta / item */
export function ArticleMeta({ item, authorName = null, seriesName = null } = {}) {
  if (!item || typeof item !== 'object') return null;
  const bits = [
    authorName,
    seriesName,
    formatEditorialDate(item.publishedAt || item.date || item.updatedAt)
  ].filter(Boolean);
  if (!bits.length) return null;
  return el('p', { class: 'gi-article-meta', text: bits.join(' · ') });
}

/**
 * One reading entry. `href` is only set when a real route exists for the item
 * — v0.2/vNEXT have no public article route yet, so entries render as plain
 * reading rows rather than dead links.
 */
export function EditorialItem({
  item,
  href = null,
  authorName = null,
  seriesName = null,
  rank = null,
  activeKey = null,
  onToggleArticle = null
} = {}) {
  if (!item || typeof item !== 'object') return null;
  const title = extractArticleTitle(item);
  const summary = extractArticleSummary(item);
  const itemKey = String(item.slug || item.id || '').trim();
  const isActiveMatch = Boolean(
    activeKey && (
      itemKey === activeKey
      || String(item.slug || '').trim() === activeKey
      || String(item.id || '').trim() === activeKey
    )
  );

  const titleNode = textOrNull(item.id)
    ? el('h3', { class: 'gi-article__title' }, [
      href ? el('a', { href, text: title, class: 'gi-article__link' }) : el('span', { text: title })
    ])
    : el('h3', { class: 'gi-article__title', text: title });

  // Full text article reading container
  const hasContent = hasArticleContent(item);
  const isInitiallyOpen = isActiveMatch && hasContent;
  let bodyContainer = null;
  let readBtn = null;
  let shareBtn = null;
  let articleEl = null;

  if (hasContent) {
    bodyContainer = el('div', {
      class: 'gi-article__body',
      style: {
        display: isInitiallyOpen ? 'block' : 'none',
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid var(--color-border-subtle, #e5e5e5)',
        fontFamily: 'var(--font-text-active, serif)',
        fontSize: 'var(--type-body-size, 1.125rem)',
        lineHeight: 'var(--type-body-line, 1.6)',
        color: 'var(--color-text-primary, #1c1917)',
        maxWidth: 'var(--type-reading-measure, 68ch)'
      }
    });

    if (item.blocks && item.blocks.length) {
      item.blocks.forEach(b => {
        if (!b) return;
        if (b.type === 'heading') {
          bodyContainer.appendChild(el('h4', {
            style: { margin: '24px 0 10px', fontSize: 'var(--type-h3-size, 1.25rem)', fontWeight: '700', color: 'var(--color-brand-heritage, #881337)', fontFamily: 'var(--font-display-active, serif)' },
            text: b.text || b.html
          }));
        } else if (b.type === 'paragraph') {
          bodyContainer.appendChild(el('p', {
            style: { marginBottom: '14px', textAlign: 'left', lineHeight: 'var(--type-body-line, 1.6)' },
            text: b.text || b.html
          }));
        } else if (b.type === 'divider') {
          bodyContainer.appendChild(el('hr', { style: { margin: '20px 0', border: '0', borderTop: '1px solid var(--color-border-default, #e3e0d8)' } }));
        } else if (b.type === 'quote' || b.type === 'callout') {
          bodyContainer.appendChild(el('blockquote', {
            style: {
              borderLeft: '3px solid var(--color-brand-gold, #b45309)',
              background: 'var(--color-brand-gold-subtle, #fbf0e3)',
              margin: '16px 0',
              padding: '10px 18px',
              fontStyle: 'italic',
              color: 'var(--color-text-primary, #1a1a1a)'
            },
            text: b.text || b.html
          }));
        }
      });
    } else if (item.contentMarkdown) {
      const paras = splitMarkdownParagraphs(item.contentMarkdown);
      paras.forEach(p => {
        const trimmed = p.trim();
        if (!trimmed) return;
        if (trimmed.startsWith('>')) {
          bodyContainer.appendChild(el('blockquote', {
            style: {
              borderLeft: '3px solid var(--color-brand-gold, #b45309)',
              background: 'var(--color-brand-gold-subtle, #fbf0e3)',
              margin: '16px 0',
              padding: '10px 18px',
              fontStyle: 'italic',
              color: 'var(--color-text-primary, #1a1a1a)'
            },
            text: trimmed.replace(/^>\s*/gm, '').trim()
          }));
        } else {
          bodyContainer.appendChild(el('p', {
            style: { marginBottom: '14px', textAlign: 'left', lineHeight: 'var(--type-body-line, 1.6)' },
            text: trimmed
          }));
        }
      });
    }

    readBtn = el('button', {
      type: 'button',
      class: 'gi-btn gi-btn--secondary gi-article__read-btn',
      style: { padding: '4px 10px', fontSize: '12px', cursor: 'pointer' },
      text: isInitiallyOpen ? 'Ẩn nội dung toàn văn ▴' : '📖 Đọc toàn văn bài viết ▾'
    });

    readBtn.addEventListener('click', () => {
      const isNowOpen = bodyContainer.style.display === 'none';
      bodyContainer.style.display = isNowOpen ? 'block' : 'none';
      readBtn.textContent = isNowOpen ? 'Ẩn nội dung toàn văn ▴' : '📖 Đọc toàn văn bài viết ▾';
      if (typeof onToggleArticle === 'function') {
        onToggleArticle(isNowOpen ? itemKey : null, articleEl);
      }
    });
  }

  if (itemKey) {
    shareBtn = el('button', {
      type: 'button',
      class: 'gi-btn gi-btn--subtle gi-article__share-btn',
      style: { padding: '4px 10px', fontSize: '12px', cursor: 'pointer' },
      text: '🔗 Liên kết bài viết'
    });

    shareBtn.addEventListener('click', () => {
      let shareUrl = `?article=${encodeURIComponent(itemKey)}`;
      if (typeof window !== 'undefined' && window.location) {
        try {
          const params = new URLSearchParams(window.location.search || '');
          params.set('article', itemKey);
          const qs = params.toString();
          const relUrl = `${window.location.pathname || ''}${qs ? `?${qs}` : ''}${window.location.hash || ''}`;
          if (window.history && typeof window.history.pushState === 'function') {
            window.history.pushState({ article: itemKey }, '', relUrl);
          }
          const origin = window.location.origin || '';
          shareUrl = origin ? `${origin}${relUrl}` : (window.location.href || relUrl);
        } catch {
          // Fallback to relative query URL in restricted environments
        }
      }

      const markCopied = () => {
        shareBtn.textContent = '✓ Đã chép liên kết';
        setTimeout(() => {
          shareBtn.textContent = '🔗 Liên kết bài viết';
        }, 2000);
      };

      if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        Promise.resolve(navigator.clipboard.writeText(shareUrl)).then(markCopied).catch(markCopied);
      } else {
        markCopied();
      }
    });
  }

  const actionsRow = (readBtn || shareBtn)
    ? el('div', {
        class: 'gi-article__actions',
        style: { display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginTop: '10px' }
      }, [readBtn, shareBtn])
    : null;

  articleEl = el('article', {
    class: 'gi-article',
    id: itemKey ? `article-${itemKey}` : null,
    'data-article-key': itemKey || null
  }, [
    Number.isFinite(rank) ? el('p', { class: 'gi-article__rank', text: String(rank).padStart(2, '0') }) : null,
    titleNode,
    ArticleMeta({ item, authorName, seriesName }),
    textOrNull(summary) ? el('p', { class: 'gi-article__summary', text: summary }) : null,
    actionsRow,
    bodyContainer
  ].filter(Boolean));

  return articleEl;
}

/**
 * Typographic reading list. Deliberately list-based (no card grid) so an
 * archive keeps an editorial rhythm rather than a product-dashboard rhythm.
 */
export function EditorialList({
  items,
  scope,
  authorName,
  seriesName,
  hrefFor,
  activeKey = null,
  onToggleArticle = null
} = {}) {
  const list = (items || []).map((item, i) => EditorialItem({
    item,
    href: typeof hrefFor === 'function' ? hrefFor(item) : null,
    authorName: typeof authorName === 'function' ? authorName(item) : authorName,
    seriesName: typeof seriesName === 'function' ? seriesName(item) : seriesName,
    rank: i + 1,
    activeKey,
    onToggleArticle
  })).filter(Boolean);
  return el('div', { class: 'gi-reading-list', 'data-scope': scope }, list);
}

/* ------------------------------------------------------- scope separation */
/**
 * Guard used by the discourse pages: it states plainly that this surface is
 * NOT the other scope. Prevents a reader (and future developer) from assuming
 * Clara is a MẠCH series — the conflation the Human decision forbids.
 */
export function ScopeSeparationNote({ scope } = {}) {
  if (scope === DISCOURSE.CLARA) {
    return el('p', {
      class: 'gi-scope-note',
      'data-scope-note': 'clara-not-mach',
      text: 'Thư gửi Clara là diễn ngôn cá nhân, riêng tư — không phải một chuyên mục của MẠCH.'
    });
  }
  if (scope === DISCOURSE.MACH) {
    return el('p', {
      class: 'gi-scope-note',
      'data-scope-note': 'mach-internal',
      text: 'MẠCH là diễn ngôn trí tuệ, văn hóa nội bộ của gia tộc — không phải tạp chí công khai.'
    });
  }
  return null;
}
