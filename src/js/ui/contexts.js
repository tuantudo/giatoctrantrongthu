/**
 * GIATOC UI SYSTEM vNEXT — contexts.js
 * Product Model → UI context mapping. (mission §3, §4)
 *
 * SOURCE: docs/audit/GIATOC_PROJECT_PURPOSE_SOURCE_MAP_AUDIT_v0.1.md §5, §7
 *         docs/audit/GIATOC_ARCHITECTURE_CONSOLIDATION_v0.1.md §3.2, §6.2
 *
 * [CURRENT HUMAN DECISION] Three discourse scopes that must NEVER be merged:
 *   THƯ GỬI CLARA — intimate / personal / private discourse
 *   MẠCH          — internal family intellectual / cultural discourse
 *   PUBLIC        — external family voice
 *
 * This module exists so the separation lives in the UI *architecture*, not in
 * someone's memory: every surface declares which discourse scope it belongs to,
 * and no generic "publication" surface spans more than one scope.
 */

import { classifyDiscourseScope, SERIES_SCOPE_MAP } from '../domain/editorial/index.js';

/* ---------------------------------------------------------------- discourse */
export const DISCOURSE = Object.freeze({
  CLARA: 'clara',
  MACH: 'mach',
  PUBLIC: 'public'
});

export const DISCOURSE_SCOPES = Object.freeze({
  [DISCOURSE.CLARA]: Object.freeze({
    id: DISCOURSE.CLARA,
    label: 'Thư gửi Clara',
    kind: 'intimate',
    readingNature: 'Diễn ngôn cá nhân, thân mật, riêng tư.',
    memberOnly: true,
    visual: 'letter',           // quiet, letter-like reading surface
    terminologyLocked: true     // [CURRENT HUMAN DECISION] — do not rename
  }),
  [DISCOURSE.MACH]: Object.freeze({
    id: DISCOURSE.MACH,
    label: 'MẠCH',
    kind: 'internal',
    readingNature: 'Diễn ngôn trí tuệ và văn hóa nội bộ của gia tộc.',
    memberOnly: true,
    visual: 'editorial',
    terminologyLocked: true
  }),
  [DISCOURSE.PUBLIC]: Object.freeze({
    id: DISCOURSE.PUBLIC,
    label: 'Tiếng nói của gia tộc',
    kind: 'external',
    readingNature: 'Tiếng nói hướng ra bên ngoài của gia tộc.',
    memberOnly: false,
    visual: 'institution',
    terminologyLocked: true
  })
});

/* ------------------------------------------------------------------ contexts */
/* UX contexts (mission §4). Shared primitives, clear context. */
export const UX_CONTEXT = Object.freeze({
  PUBLIC: 'public',
  MEMBER: 'member',
  EDITORIAL: 'editorial',
  GENEALOGY: 'genealogy',
  ADMIN: 'admin'
});

/**
 * [IMPLEMENTATION FACT] Series identity as it exists in the projection artifact
 * `server/data/mach.json` (`series` keys). Recorded here ONLY so the UI can keep
 * Clara and MẠCH apart with the data that exists today.
 *
 * [BACKEND DEPENDENCY] The authoritative scope split must live in the data layer
 * (see ARCHITECTURE_CONSOLIDATION §5 Open Question 1: one table + visibility flag,
 * or separate tables). Until then this map is a presentation-time classifier that
 * is explicit, reversible and auditable — not a schema.
 */
const SERIES_SCOPE_HINTS = SERIES_SCOPE_MAP;

/**
 * Classify a content item into a discourse scope.
 * Returns null when the item cannot be attributed — the UI then must NOT guess.
 */
export function classifyContent(item) {
  return classifyDiscourseScope(item);
}

export function scopeMeta(scopeId) {
  return DISCOURSE_SCOPES[scopeId] || null;
}

/** Human-readable explanation used when content is unattributed. */
export const UNATTRIBUTED_NOTICE = 'Chưa xác định được phạm vi diễn ngôn (Clara / MẠCH) — cần quyết định về schema.';

/* ------------------------------------------------------------------ SoT note */
/**
 * [REMOVED — 2026-10-04, Inner Site implementation]
 *
 * `SOT_NOTE` used to state, on `/me`, that genealogy comes from NAS/MariaDB and
 * that the local copy is SQLite. That is ARCHITECTURE LANGUAGE (spec §16 forbids
 * "SoT / MariaDB / SQLite / Database" on the UI) and it was read by a member who
 * has no use for it.
 *
 * The underlying intent — never imply the local working copy is canonical — is
 * preserved differently: the UI simply makes no claim about storage at all. A
 * member sees the family data; how it is stored is not a product fact.
 */

/* =============================================================================
 * v0.4 STABILIZATION — CONTEXT META
 * -----------------------------------------------------------------------------
 * WHAT the human must be able to tell from the UI STRUCTURE, not from prose:
 *   1. Tôi đang ở đâu?                      -> level
 *   2. Đây là context nào?                  -> label
 *   4. Dữ liệu này là Genealogy hay Content? -> dataType
 *   5. Scope thuộc Intimate/Internal/External?-> discourseKind
 *   6. Tôi có quyền gì ở đây?               -> access
 *
 * [ARCHITECTURE CONSTRAINT] Nothing here invents a concept. Every value maps to
 * something already in the Current Human Decision / Architecture docs.
 * ========================================================================== */

/** Information-architecture levels (mission §3). */
export const LEVEL = Object.freeze({
  APPLICATION: 'application',   // the shell itself
  IDENTITY: 'identity',         // who am I: Account / Person
  SPACE: 'space',               // Member Space, Family Space
  DISCOURSE: 'discourse',       // MẠCH, Thư gửi Clara
  GENEALOGY: 'genealogy',       // canonical family data
  CONTENT: 'content'            // public-facing editorial
});

export const LEVEL_LABEL = Object.freeze({
  [LEVEL.APPLICATION]: 'Ứng dụng',
  [LEVEL.IDENTITY]: 'Danh tính',
  [LEVEL.SPACE]: 'Không gian',
  [LEVEL.DISCOURSE]: 'Diễn ngôn',
  [LEVEL.GENEALOGY]: 'Gia phả',
  [LEVEL.CONTENT]: 'Nội dung'
});

/** What KIND of data this context reads. Answers "Genealogy hay Content?". */
export const DATA_TYPE = Object.freeze({
  NONE: 'none',
  IDENTITY: 'identity',              // Account / IdentityMapping
  CANONICAL_GENEALOGY: 'canonical-genealogy',
  CONTENT: 'content',
  SPACE: 'space'
});

export const DATA_TYPE_LABEL = Object.freeze({
  [DATA_TYPE.NONE]: '—',
  [DATA_TYPE.IDENTITY]: 'Dữ liệu danh tính',
  [DATA_TYPE.CANONICAL_GENEALOGY]: 'Dữ liệu phả hệ chuẩn',
  [DATA_TYPE.CONTENT]: 'Dữ liệu nội dung',
  [DATA_TYPE.SPACE]: 'Dữ liệu không gian'
});

/** What the visitor is ALLOWED here. Answers "Tôi có quyền gì?". */
export const ACCESS = Object.freeze({
  PUBLIC: 'public',
  AUTHENTICATED: 'authenticated',
  UNDEFINED: 'undefined'      // no enforcement model exists — must be stated, not faked
});

export const ACCESS_LABEL = Object.freeze({
  [ACCESS.PUBLIC]: 'Công khai',
  /* [FIX 2026-10-04 — browser QA on /me] The label read "Cần đăng nhập"
     ("login required") on surfaces the visitor had ALREADY passed login to
     reach. /me greeted "Chào Tuấn" while this same bar claimed login was
     required — a self-contradiction on one screen.

     The intent was never "you are not logged in"; `visibility.js` already
     states in the tooltip that this is a ROUTE CONTRACT, not a content
     permission model (UX Stability Contract §J.5). So the fix is to make the
     VISIBLE label say the same thing the contract actually is, rather than to
     invent a new access state.

     `data-access="authenticated"` is UNCHANGED — it is the machine-readable
     contract value every other surface keys off. Only the human string changed. */
  [ACCESS.AUTHENTICATED]: 'Khu vực yêu cầu đăng nhập',
  [ACCESS.UNDEFINED]: 'Chưa có mô hình phân quyền'
});

/**
 * Per-context facts, resolved from the route registry by UI shell.
 * [IMPLEMENTATION FACT] `access` describes the ROUTE CONTRACT that exists today
 * (requireAccount), NOT a content permission model — no such model exists.
 */
export const CONTEXT_META = Object.freeze({
  [UX_CONTEXT.PUBLIC]: Object.freeze({
    level: LEVEL.APPLICATION,
    dataType: DATA_TYPE.CONTENT,
    access: ACCESS.PUBLIC,
    discourseKind: DISCOURSE.PUBLIC
  }),
  [UX_CONTEXT.MEMBER]: Object.freeze({
    level: LEVEL.SPACE,
    dataType: DATA_TYPE.IDENTITY,
    access: ACCESS.AUTHENTICATED,
    discourseKind: null
  }),
  [UX_CONTEXT.EDITORIAL]: Object.freeze({
    level: LEVEL.DISCOURSE,
    dataType: DATA_TYPE.CONTENT,
    access: ACCESS.AUTHENTICATED,
    discourseKind: null            // resolved per-route from DISCOURSE_SCOPES
  }),
  [UX_CONTEXT.GENEALOGY]: Object.freeze({
    level: LEVEL.GENEALOGY,
    dataType: DATA_TYPE.CANONICAL_GENEALOGY,
    access: ACCESS.AUTHENTICATED,
    discourseKind: null
  }),
  [UX_CONTEXT.ADMIN]: Object.freeze({
    level: LEVEL.SPACE,
    dataType: DATA_TYPE.NONE,
    access: ACCESS.UNDEFINED,
    discourseKind: null
  })
});

/** Resolve everything a surface needs to describe itself. */
export function describeContext(context) {
  const ctx = context && context.context ? context.context : UX_CONTEXT.PUBLIC;
  const meta = CONTEXT_META[ctx] || CONTEXT_META[UX_CONTEXT.PUBLIC];
  const route = context && context.route;
  const discourse = (context && context.discourse) || null;
  const scope = discourse ? DISCOURSE_SCOPES[discourse] : null;

  return {
    context: ctx,
    label: (route && route.label) || LEVEL_LABEL[meta.level] || ctx,
    level: meta.level,
    levelLabel: LEVEL_LABEL[meta.level] || null,
    dataType: meta.dataType,
    dataTypeLabel: DATA_TYPE_LABEL[meta.dataType] || null,
    access: meta.access,
    accessLabel: ACCESS_LABEL[meta.access] || null,
    discourse: discourse,
    discourseKind: discourse ? scope.kind : meta.discourseKind,
    discourseLabel: scope ? scope.label : null,
    // Legacy / transitional surfaces must say so, not hide it.
    status: (route && route.status) || null,
    isLegacy: !!(route && (route.status === 'legacy-spa' || route.status === 'legacy-compat'))
  };
}
