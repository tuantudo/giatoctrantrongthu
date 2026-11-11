/**
 * GIATỘC UI v0.4 — context-bar.js
 * The answer to "Tôi đang ở đâu?" — rendered as STRUCTURE, not as prose.
 *
 * WHAT / WHERE / WHY / IMPACT  (v0.4 audit)
 *   WHAT   : only two contexts were visible (Public / Member Space)
 *   WHERE  : visibility.js ScopeIndicator(audience), wired in shell.js
 *   WHY    : written in v0.2, BEFORE contexts.js existed. It reads `audience`,
 *            which has 2 values, while the product actually has 5 UX contexts
 *            and 3 discourse scopes.
 *   IMPACT : on /me/mach, /me/clara, /me/tree and /me/family-spaces the header
 *            said the same four words. A human could NOT tell those four apart
 *            without reading the page body. This was the single largest source
 *            of semantic ambiguity in vNEXT.
 *
 * The bar is a compact key/value strip. Each key is a labelled fact, so the
 * human reads a STRUCTURE (level -> context -> discourse -> data -> access)
 * instead of a paragraph.
 */

import { el, textOrNull } from './dom.js';
import { describeContext, LEVEL, ACCESS } from './contexts.js';

const DISCOURSE_KIND_LABEL = Object.freeze({
  intimate: 'Riêng tư',
  internal: 'Nội bộ',
  external: 'Bên ngoài'
});

function fact(key, value, extra = {}) {
  if (!textOrNull(value)) return null;
  return el('div', { class: 'gi-contextbar__fact', 'data-fact': key }, [
    el('dt', { class: 'gi-contextbar__key', text: key }),
    el('dd', {
      class: `gi-contextbar__value${extra.tone ? ` gi-contextbar__value--${extra.tone}` : ''}`,
      text: value,
      title: extra.title || null
    })
  ]);
}

/**
 * @param {object} navigationContext the object returned by resolveContext()
 */
export function ContextBar(navigationContext) {
  const info = describeContext(navigationContext);

  const facts = [
    fact('Cấp', info.levelLabel),
    fact('Không gian', info.label),
    fact('Diễn ngôn', info.discourseKind
      ? `${info.discourseLabel} · ${DISCOURSE_KIND_LABEL[info.discourseKind] || ''}`.trim()
      : null),
    fact('Dữ liệu', info.dataTypeLabel),
    fact('Truy cập', info.accessLabel, {
      tone: info.access === ACCESS.UNDEFINED ? 'warn' : null,
      title: info.access === ACCESS.AUTHENTICATED
        ? 'Khu vực yêu cầu đăng nhập. Đây là hợp đồng route, không phải mô hình phân quyền nội dung.'
        : null
    })
  ].filter(Boolean);

  return el('section', {
    class: 'gi-contextbar',
    'data-level': info.level,
    'data-context': info.context,
    'data-discourse': info.discourse || null,
    'data-discourse-kind': info.discourseKind || null,
    'data-data-type': info.dataType,
    'data-access': info.access,
    'aria-label': 'Ngữ cảnh hiện tại'
  }, [
    el('h2', { class: 'gi-visually-hidden', text: 'Ngữ cảnh hiện tại' }),
    el('dl', { class: 'gi-contextbar__list' }, facts)
  ]);
}

/**
 * LEGACY marker for transitional surfaces. [IMPLEMENTATION FACT] `/me/tree` is
 * the old SPA and `/me/tree/person/:id` is its new-UI companion; both are kept
 * for compatibility and are NOT the final IA decision.
 */
export function LegacyBanner({ route = null } = {}) {
  return el('div', {
    class: 'gi-state gi-state--legacy gi-legacy-banner',
    'data-state': 'legacy',
    role: 'note'
  }, [
    el('p', { class: 'gi-state__title', text: 'Bề mặt chuyển tiếp (legacy)' }),
    el('p', {
      class: 'gi-state__meaning',
      text: 'Trang này được giữ để bảo toàn tương thích với phiên bản trước. Đây chưa phải quyết định cuối cùng về điều hướng.'
    }),
    route && route.sitemapNote
      ? el('p', { class: 'gi-state__dependency', text: route.sitemapNote })
      : null
  ]);
}

/**
 * Neutral notice for surfaces where a visibility model would be expected.
 * States the limitation instead of pretending enforcement exists.
 *
 * [FACT] No visibility model exists: no visibility column in the schema, no
 * server-side filtering, and several data endpoints are public. The UI may only
 * describe WHERE THE VISITOR IS. It must never state that content is private,
 * members-only or restricted.
 */
export function VisibilityLimitationNotice() {
  return el('div', { class: 'gi-notice', role: 'note' }, [
    el('span', {
      text: 'Lưu ý: mô hình PRIVATE / MEMBERS / PUBLIC chưa được triển khai ở tầng dữ liệu. '
          + 'Giao diện chỉ hiển thị ngữ cảnh, không thực thi phân quyền nội dung.'
    })
  ]);
}
