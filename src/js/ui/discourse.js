/**
 * GIATOC UI SYSTEM vNEXT — discourse.js
 * Page controller for the two INTERNAL discourse surfaces:
 *   /me/mach   -> MẠCH          (internal intellectual / cultural discourse)
 *   /me/clara  -> Thư gửi Clara (intimate, personal, private discourse)
 *
 * They share this controller but NEVER share a surface: the scope comes from
 * the navigation registry, the masthead names it, and content is filtered into
 * exactly one scope. There is no combined "All discourse" view — that view is
 * what made Clara look like a MẠCH series.
 *
 * DATA (mission §15 — no fabricated content):
 *   [FACT] GET /api/mach.json -> { authors, series, stories }
 *   [FACT] In the current local runtime that endpoint returns an essentially
 *          empty editorial set; the rich MẠCH + Clara corpus lives in the
 *          seed artifact server/data/mach.json, which no endpoint serves.
 *   => The page therefore renders honest Empty/NotAvailable states today.
 *   [BACKEND DEPENDENCY] serving + separating Clara/MẠCH (ARCHITECTURE_
 *          CONSOLIDATION §5 Open Question 1). Not invented here.
 */

import { el } from './dom.js';
import { api } from './data.js';
import { Region, EmptyState, StatePanel, STATE } from './states.js';
import { ScopeMasthead, EditorialList, ScopeSeparationNote } from './editorial.js';
import { PageHeader } from './components.js';
import { DISCOURSE, classifyContent, scopeMeta, UNATTRIBUTED_NOTICE } from './contexts.js';
import {
  resolveArticleAuthor,
  getAuthorName,
  resolveArticleSeries,
  getSeriesTitle,
  partitionByDiscourseScope
} from '../domain/editorial/index.js';

function authorNameFor(authors, item) {
  const author = resolveArticleAuthor(authors, item);
  return author ? getAuthorName(author, null) : null;
}

function seriesNameFor(series, item) {
  const s = resolveArticleSeries(series, item);
  return s ? getSeriesTitle(s, null) : null;
}

/**
 * Partition the returned stories by discourse scope.
 * `unattributed` is surfaced explicitly — it is never silently folded into
 * MẠCH, because that would reproduce the exact semantic error the Human
 * decision corrected.
 */
export function partitionByScope(payload) {
  return partitionByDiscourseScope(payload);
}

export function renderDiscoursePage(host, context, scope) {
  const meta = scopeMeta(scope);
  if (!meta) return;

  // v0.4 page skeleton, steps 2 and 3 (context identity is already rendered
  // by the shell): title then scope explanation — same order as every surface.
  host.appendChild(PageHeader({
    eyebrow: 'Không gian nội bộ của gia tộc',
    title: meta.label,
    subtitle: null,
    // Keeps each scope's reading voice inside the ONE page grammar.
    variant: meta.visual
  }));

  host.appendChild(el('div', { class: 'gi-stack' }, [
    ScopeMasthead({ scope }),
    ScopeSeparationNote({ scope }),
    el('div', { class: 'gi-reading' })
  ]));

  const readingHost = host.querySelector('.gi-reading');

  Region(readingHost, {
    label: `Đang tải ${meta.label}…`,
    load: () => (scope === DISCOURSE.CLARA ? api.clara() : api.mach()),
    render: (payload) => {
      const { authors, series } = payload || {};
      const buckets = partitionByScope(payload);
      let items = buckets[scope];
      if ((!items || !items.length) && payload && payload.stories) {
        if (payload.discourseScope === scope) {
          items = payload.stories;
        }
      }
      items = items || [];

      if (!items.length) {
        /* Empty text is fixed by the UX/IA spec and differs per register, because
           the two surfaces must not read as two sections of one publication:
             spec §6  MẠCH   → "Hiện chưa có bài viết nào trên MẠCH."
             spec §7  Clara → "Ngăn thư hiện đang trống."

           spec §13 "Dependency Missing: ẨN" — the missing capability is recorded as
           a data attribute for debugging and is NOT shown to the member. State is
           EMPTY, not BACKEND_DEPENDENCY: from the reader's side the answer to
           "is there anything here?" is "no", and "no" is the whole truth. */
        const EMPTY_COPY = scope === DISCOURSE.MACH
          ? {
              title: 'Hiện chưa có bài viết nào trên MẠCH.',
              explanation: 'Khi gia tộc có bài để chia sẻ trong không gian nội bộ, chúng sẽ xuất hiện ở đây.'
            }
          : {
              title: 'Ngăn thư hiện đang trống.',
              explanation: 'Những lá thư gửi riêng sẽ được lưu ở đây. Ngăn thư này tách riêng khỏi MẠCH — nó không phải một chuyên mục của bất kỳ ấn phẩm nào.'
            };

        return StatePanel({
          state: STATE.EMPTY,
          title: EMPTY_COPY.title,
          explanation: EMPTY_COPY.explanation,
          dependency: buckets.unattributed.length
            ? `${buckets.unattributed.length} bản ghi chưa xác định được phạm vi.`
            : null
        });
      }

      const getActiveKeyFromLocation = () => {
        if (typeof window === 'undefined' || !window.location) return null;
        try {
          const val = new URLSearchParams(window.location.search || '').get('article');
          return val ? val.trim() : null;
        } catch {
          return null;
        }
      };

      const syncUrlArticleParam = (newKey) => {
        if (typeof window === 'undefined' || !window.location || !window.history || typeof window.history.pushState !== 'function') {
          return;
        }
        try {
          const params = new URLSearchParams(window.location.search || '');
          if (newKey) {
            params.set('article', newKey);
          } else {
            params.delete('article');
          }
          const qs = params.toString();
          const nextUrl = `${window.location.pathname || ''}${qs ? `?${qs}` : ''}${window.location.hash || ''}`;
          window.history.pushState({ article: newKey || null }, '', nextUrl);
        } catch {
          // Guarded for test/sandbox environments
        }
      };

      const initialActiveKey = getActiveKeyFromLocation();

      const listNode = EditorialList({
        items,
        scope,
        authorName: (item) => authorNameFor(authors, item),
        seriesName: (item) => seriesNameFor(series, item),
        activeKey: initialActiveKey,
        onToggleArticle: (newKey) => {
          syncUrlArticleParam(newKey);
        }
      });

      const scrollToMatchingArticle = (key) => {
        if (!key || !listNode || typeof listNode.querySelectorAll !== 'function') return;
        const articles = listNode.querySelectorAll('.gi-article');
        const matched = Array.from(articles).find(a => a.getAttribute && a.getAttribute('data-article-key') === key);
        if (matched && typeof matched.scrollIntoView === 'function') {
          matched.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      if (initialActiveKey) {
        setTimeout(() => scrollToMatchingArticle(initialActiveKey), 0);
      }

      if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
        window.addEventListener('popstate', () => {
          const popKey = getActiveKeyFromLocation();
          if (listNode && typeof listNode.querySelectorAll === 'function') {
            const articles = listNode.querySelectorAll('.gi-article');
            Array.from(articles).forEach((artEl) => {
              const key = artEl.getAttribute && artEl.getAttribute('data-article-key');
              const isOpen = Boolean(popKey && key === popKey);
              const body = artEl.querySelector && artEl.querySelector('.gi-article__body');
              const btn = artEl.querySelector && artEl.querySelector('.gi-article__read-btn');
              if (body) body.style.display = isOpen ? 'block' : 'none';
              if (btn) btn.textContent = isOpen ? 'Ẩn nội dung toàn văn ▴' : '📖 Đọc toàn văn bài viết ▾';
            });
          }
          if (popKey) {
            scrollToMatchingArticle(popKey);
          }
        });
      }

      return el('div', {}, [
        listNode,
        buckets.unattributed.length
          ? EmptyState({
            title: 'Bài chưa xác định phạm vi',
            body: UNATTRIBUTED_NOTICE,
            meta: `${buckets.unattributed.length} bản ghi không được đưa vào MẠCH hay Thư gửi Clara.`
          })
          : null
      ]);
    }
  });
}