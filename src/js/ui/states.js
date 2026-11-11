/**
 * GIATOC UI SYSTEM v0.4 — state.js
 * ONE state grammar for the whole system (mission §6).
 *
 * WHY THIS FILE EXISTS
 * In vNEXT each surface improvised its own way of saying "no data here":
 * a prose sentence here, a dashed box there, a sentence inside a card. A human
 * could not tell "empty" from "not built yet" from "you are not allowed" from
 * "we are still deciding". That ambiguity is exactly what v0.4 removes.
 *
 * THE NINE STATES (mission §6, verbatim):
 *   LOADING EMPTY NOT_AVAILABLE NOT_AUTHENTICATED NOT_AUTHORIZED
 *   ERROR LEGACY OPEN_QUESTION BACKEND_DEPENDENCY
 *
 * CONTRACT for every state:
 *   - distinct visual treatment (see states.css [data-state])
 *   - a title   -> what situation you are in
 *   - an explanation -> why, in one sentence, no waffle
 *   - never fake data
 *   - never look like real content
 */

import { el, mount, textOrNull } from './dom.js';

export const STATE = Object.freeze({
  LOADING: 'loading',
  EMPTY: 'empty',
  NOT_AVAILABLE: 'not-available',
  NOT_AUTHENTICATED: 'not-authenticated',
  NOT_AUTHORIZED: 'not-authorized',
  ERROR: 'error',
  LEGACY: 'legacy',
  OPEN_QUESTION: 'open-question',
  BACKEND_DEPENDENCY: 'backend-dependency'
});

/** One-line default explanation per state. Never longer than this by default. */
export const STATE_MEANING = Object.freeze({
  [STATE.LOADING]: 'Đang tải dữ liệu từ hệ thống.',
  [STATE.EMPTY]: 'Hệ thống đã trả lời và không có dữ liệu trong phạm vi này.',
  [STATE.NOT_AVAILABLE]: 'Bề mặt này tồn tại trong thiết kế, nhưng chưa có chức năng chạy phía sau.',
  [STATE.NOT_AUTHENTICATED]: 'Bạn cần đăng nhập để xem khu vực này.',
  [STATE.NOT_AUTHORIZED]: 'Tài khoản của bạn không có quyền xem khu vực này.',
  [STATE.ERROR]: 'Không tải được dữ liệu. Đây là lỗi hệ thống, không phải kết quả rỗng.',
  [STATE.LEGACY]: 'Đây là bề mặt chuyển tiếp, được giữ để tương thích.',
  [STATE.OPEN_QUESTION]: 'Nội dung này chưa được quyết định. Giao diện không tự tạo nội dung thay cho quyết định đó.',
  [STATE.BACKEND_DEPENDENCY]: 'Cần thay đổi ở tầng dữ liệu trước khi bề mặt này có nội dung.'
});

/**
 * The single state panel. Every "nothing to show" situation in GIATỘC goes
 * through here — that consistency is the point.
 *
 * [CHANGED 2026-10-04 — Inner Site implementation]
 * The `dependency` line is NO LONGER RENDERED.
 *
 * UX/IA spec §13, State Model: "Dependency Missing: ẨN." — a missing dependency is
 * not information a member needs. It used to render in monospace as e.g.
 * "BACKEND DEPENDENCY — cần quan hệ IdentityMapping giữa Account và Person",
 * which put Identity Mapping, a data-layer term banned by spec §16, in front of
 * the reader.
 *
 * The parameter is still ACCEPTED so existing call sites keep working, and it is
 * still recorded as a `data-*` attribute for debugging — it is simply no longer
 * shown as prose. What the member reads is the title and one sentence.
 *
 * @param {object} o
 * @param {string} o.state          one of STATE
 * @param {string} o.title          what situation (required)
 * @param {string} o.explanation    why (defaults to the state meaning)
 * @param {string} o.dependency     recorded as data attribute only — NOT rendered
 * @param {Node}   o.action         optional single action (a link/button)
 */
export function StatePanel({ state, title, explanation, dependency = null, action = null } = {}) {
  const key = STATE[state] ? state : STATE.NOT_AVAILABLE;
  const classes = ['gi-state', `gi-state--${key}`];
  if (action) classes.push('gi-state--has-action');

  return el('div', {
    class: classes.join(' '),
    'data-state': key,
    'data-dependency': dependency,
    role: (key === STATE.ERROR) ? 'alert' : (key === STATE.LOADING ? 'status' : null),
    'aria-live': (key === STATE.LOADING) ? 'polite' : null
  }, [
    el('p', { class: 'gi-state__title', text: textOrNull(title) || key }),
    el('p', { class: 'gi-state__meaning', text: textOrNull(explanation) || STATE_MEANING[key] }),
    action ? el('div', { class: 'gi-state__actions' }, [action]) : null
  ]);
}

/** Convenience: a BACKEND DEPENDENCY panel that names the missing capability. */
export function BackendDependencyPanel({ title, explanation, dependency, action = null } = {}) {
  return StatePanel({
    state: STATE.BACKEND_DEPENDENCY,
    title,
    explanation,
    dependency,
    action
  });
}

/* -----------------------------------------------------------------------------
 * Backwards-compatible wrappers (v0.2 call sites keep working).
 * They now all render through StatePanel, so there is exactly ONE visual and
 * semantic grammar for "nothing to show here" across the whole product.
 * -------------------------------------------------------------------------- */

export function LoadingState({ label = 'Đang tải dữ liệu…' } = {}) {
  return el('div', { class: 'gi-loading', role: 'status', 'aria-live': 'polite' }, [
    el('div', { class: 'gi-loading__bar', 'aria-hidden': 'true' }),
    el('span', { text: label })
  ]);
}

export function EmptyState({ title, body, meta } = {}) {
  return StatePanel({
    state: STATE.EMPTY,
    title: title || 'Chưa có dữ liệu',
    explanation: body,
    dependency: meta || null
  });
}

/**
 * NotAvailableState — a SYSTEM STATE, not a temporary error (mission §5).
 * "The surface is designed; the backend capability is not there yet."
 * It must never be used to dress up missing data as content.
 */
export function NotAvailableState({ title, body, dependency, nextStep } = {}) {
  return StatePanel({
    state: dependency ? STATE.BACKEND_DEPENDENCY : STATE.NOT_AVAILABLE,
    title,
    explanation: body,
    // nextStep is folded into the explanation: one sentence, no separate meta line.
    dependency: nextStep ? `${dependency ? `${dependency} ` : ''}${nextStep}` : (dependency || null)
  });
}

export function ErrorState({ title = 'Không tải được dữ liệu', body, onRetry } = {}) {
  return StatePanel({
    state: STATE.ERROR,
    title,
    explanation: body,
    action: typeof onRetry === 'function'
      ? el('button', { class: 'gi-btn gi-btn--secondary', type: 'button', text: 'Thử lại', onclick: onRetry })
      : null
  });
}

/**
 * Region — owns one async zone.
 * loading -> data -> (data | empty | error). Never invents placeholder content.
 */
export function Region(host, {
  load, render, empty = null, label, retryDelay = 0
} = {}) {
  const target = typeof host === 'string' ? document.querySelector(host) : host;
  if (!target) return { destroy() {} };

  let disposed = false;

  async function run() {
    mount(target, LoadingState({ label }));
    try {
      const data = await load();
      if (disposed) return;
      const view = render(data);
      if (view === null || view === undefined) {
        mount(target, EmptyState(empty || {
          title: 'Chưa có dữ liệu',
          body: 'Khu vực này sẽ hiển thị khi có dữ liệu tương ứng từ hệ thống.'
        }));
      } else if (view === false) {
        mount(target, EmptyState(empty || { title: 'Chưa có dữ liệu' }));
      } else {
        mount(target, view);
      }
    } catch (err) {
      if (disposed) return;
      if (err && (err.status === 403 || (err.message && err.message.includes('403')))) {
        mount(target, StatePanel({
          state: STATE.NOT_AUTHORIZED,
          title: 'Khu vực giới hạn quyền riêng tư',
          explanation: err.message || 'Tài khoản của bạn không thuộc nhánh gia đình có thẩm quyền tiếp cận ngăn thư này.'
        }));
        return;
      }
      mount(target, ErrorState({
        body: err && err.message ? err.message : 'Đã xảy ra lỗi khi tải dữ liệu.',
        onRetry: () => setTimeout(run, retryDelay)
      }));
    }
  }

  run();
  return { destroy() { disposed = true; } };
}
