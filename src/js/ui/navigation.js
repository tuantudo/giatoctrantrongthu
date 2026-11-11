/**
 * GIATOC UI SYSTEM vNEXT — navigation.js
 * Flat, context-aware navigation registry.
 *
 * v0.2 -> vNEXT delta:
 *  - Registry carries `context` (UX context) and `discourse` (scope) per route.
 *  - Member Space is FLAT (no `#` hash routing) per ARCHITECTURE_CONSOLIDATION
 *    §6.5 ("Thiết kế Sitemap v0.2 phằng cho Member Space").
 *  - Obsolete public hash routes are RETIRED — kept only as an audit trail.
 *
 * SOURCE: docs/architecture/SITEMAP_v0.1.md (OBSOLETE per consolidation §2),
 *         NAVIGATION_MODEL_v0.1.md, USER_FLOWS_v0.1.md,
 *         docs/audit/GIATOC_ARCHITECTURE_CONSOLIDATION_v0.1.md §6.
 *
 * TWO DISTINCT BACK BEHAVIOURS — never one ambiguous "Back":
 *   back.mode = 'hierarchy' -> static link to the IA parent (default, safe)
 *   back.mode = 'history'   -> browser history, only when no IA parent exists
 */

import { UX_CONTEXT, DISCOURSE } from './contexts.js';

export const AUDIENCE = Object.freeze({ PUBLIC: 'public', MEMBER: 'member' });

/** [IMPLEMENTATION FACT] Retired public hash routes — never mounted again. */
export const RETIRED_PUBLIC_ROUTES = Object.freeze([
  { path: '/#/gia-pha', reason: 'Public ≠ public genealogy database (ARCHITECTURE_CONSOLIDATION §6.2)' },
  { path: '/#/gia-dinh', reason: 'Genealogy data is not public discourse' },
  { path: '/#/tu-lieu', reason: 'Media library is not external voice' },
  { path: '/#/mach', reason: 'MẠCH is internal discourse, must not be a public mirror' },
  { path: '/#/tim-kiem', reason: 'No public search scope defined' }
]);

export const routes = Object.freeze([
  { id: 'public.home', path: '/', label: 'Trang chủ', audience: AUDIENCE.PUBLIC,
    context: UX_CONTEXT.PUBLIC, discourse: DISCOURSE.PUBLIC, parent: null, status: 'shell' },

  { id: 'public.login', path: '/login', label: 'Đăng nhập', audience: AUDIENCE.PUBLIC,
    context: UX_CONTEXT.PUBLIC, discourse: DISCOURSE.PUBLIC, parent: '/', status: 'existing' },

  { id: 'member.dashboard', path: '/me', label: 'Không gian của tôi', audience: AUDIENCE.MEMBER,
    context: UX_CONTEXT.MEMBER, discourse: null, parent: null, status: 'existing' },

  { id: 'member.mach', path: '/me/mach', label: 'MẠCH', audience: AUDIENCE.MEMBER,
    context: UX_CONTEXT.EDITORIAL, discourse: DISCOURSE.MACH, parent: '/me', status: 'new' },

  { id: 'member.letters', path: '/me/letters', label: 'Thư gửi nhau', audience: AUDIENCE.MEMBER,
    context: UX_CONTEXT.EDITORIAL, discourse: DISCOURSE.MACH, parent: '/me', status: 'new' },

  { id: 'member.clara', path: '/me/clara', label: 'Thư gửi Clara', audience: AUDIENCE.MEMBER,
    context: UX_CONTEXT.EDITORIAL, discourse: DISCOURSE.CLARA, parent: '/me', status: 'new' },

  { id: 'member.genealogy', path: '/me/tree', label: 'Cây phả đồ', audience: AUDIENCE.MEMBER,
    context: UX_CONTEXT.GENEALOGY, discourse: null, parent: '/me', status: 'legacy-spa' },

  { id: 'member.gallery', path: '/me/gallery', label: 'Kho tư liệu ảnh', audience: AUDIENCE.MEMBER,
    context: UX_CONTEXT.GENEALOGY, discourse: null, parent: '/me', status: 'new' },

  { id: 'member.events', path: '/me/events', label: 'Lịch giỗ & Niên biểu', audience: AUDIENCE.MEMBER,
    context: UX_CONTEXT.GENEALOGY, discourse: null, parent: '/me', status: 'new' },

  { id: 'member.person', path: '/me/tree/person/:id', label: 'Hồ sơ nhân vật',
    audience: AUDIENCE.MEMBER, context: UX_CONTEXT.GENEALOGY, discourse: null,
    parent: '/me/tree', status: 'existing',
    sitemapNote: 'companion to legacy /me/tree#/person/:id — ratification requested' },

  { id: 'member.spaces', path: '/me/family-spaces', label: 'Không gian gia đình',
    audience: AUDIENCE.MEMBER, context: UX_CONTEXT.MEMBER, discourse: null,
    parent: '/me', status: 'placeholder' },

  { id: 'member.changePassword', path: '/me/change-password', label: 'Đổi mật khẩu',
    audience: AUDIENCE.MEMBER, context: UX_CONTEXT.MEMBER, discourse: null,
    parent: '/me', status: 'existing' },

  { id: 'member.account', path: '/me/account', label: 'Tài khoản của tôi',
    audience: AUDIENCE.MEMBER, context: UX_CONTEXT.MEMBER, discourse: null,
    parent: '/me', status: 'new' },

  { id: 'member.requests', path: '/me/requests', label: 'Đóng góp & Yêu cầu',
    audience: AUDIENCE.MEMBER, context: UX_CONTEXT.MEMBER, discourse: null,
    parent: '/me', status: 'new' },

  { id: 'member.contribute', path: '/me/contribute', label: 'Đóng góp tư liệu',
    audience: AUDIENCE.MEMBER, context: UX_CONTEXT.MEMBER, discourse: null,
    parent: '/me/requests', status: 'new' },

  { id: 'public.help', path: '/help', label: 'Trợ giúp & Hướng dẫn',
    audience: AUDIENCE.PUBLIC, context: UX_CONTEXT.PUBLIC, discourse: DISCOURSE.PUBLIC,
    parent: '/', status: 'new' },

  { id: 'public.recovery', path: '/help/recovery', label: 'Khôi phục tài khoản',
    audience: AUDIENCE.PUBLIC, context: UX_CONTEXT.PUBLIC, discourse: DISCOURSE.PUBLIC,
    parent: '/help', status: 'new' },

  { id: 'member.logout', path: '/logout', label: 'Đăng xuất', audience: AUDIENCE.MEMBER,
    context: UX_CONTEXT.MEMBER, discourse: null, parent: '/me', status: 'existing' }
]);

/** Sibling destinations offered as "next" on each page (ordered, IA-aware). */
export const nextByRoute = Object.freeze({
  'member.dashboard': ['member.mach', 'member.clara', 'member.genealogy', 'member.gallery', 'member.events', 'member.account', 'member.requests'],
  'member.account': ['member.dashboard', 'member.requests', 'member.changePassword'],
  'member.requests': ['member.contribute', 'member.dashboard', 'member.account'],
  'member.contribute': ['member.requests', 'member.dashboard'],
  'public.help': ['public.recovery', 'public.login', 'public.home'],
  'public.recovery': ['public.login', 'public.help'],
  'member.mach': ['member.clara', 'member.dashboard'],
  'member.clara': ['member.mach', 'member.dashboard'],
  'member.genealogy': ['member.gallery', 'member.events', 'member.dashboard'],
  'member.gallery': ['member.events', 'member.genealogy', 'member.dashboard'],
  'member.events': ['member.gallery', 'member.genealogy', 'member.dashboard'],
  'member.person': ['member.events', 'member.gallery', 'member.genealogy', 'member.dashboard'],
  'public.home': ['public.login', 'public.help']
});

export function matchRoute(pathname) {
  const path = (pathname || '/').replace(/\/+$/, '') || '/';
  for (const route of routes) {
    if (!route.path.includes(':')) {
      if (route.path === path) return { route, params: {} };
      continue;
    }
    const pattern = route.path.split('/').filter(Boolean);
    const actual = path.split('/').filter(Boolean);
    if (pattern.length !== actual.length) continue;
    const params = {};
    let ok = true;
    for (let i = 0; i < pattern.length; i += 1) {
      if (pattern[i].startsWith(':')) params[pattern[i].slice(1)] = decodeURIComponent(actual[i]);
      else if (pattern[i] !== actual[i]) { ok = false; break; }
    }
    if (ok) return { route, params };
  }
  return { route: null, params: {} };
}

function findById(id) {
  return routes.find(r => r.id === id) || null;
}

/**
 * Resolve the full navigation context for a location.
 * Accepts pathname only (hash routes inside the legacy SPA are handled by the
 * legacy app itself; v0.2 provides context for server-rendered pages).
 */
export function resolveContext(pathname) {
  const { route, params } = matchRoute(pathname);
  if (!route) {
    return {
      route: null, params, parent: null, audience: null, context: null, discourse: null,
      breadcrumb: [], back: null, next: [], unknown: true
    };
  }

  const parent = route.parent ? findById(routes.find(r => r.path === route.parent)?.id) : null;

  // A breadcrumb with no parent and no children is noise, not navigation: on the
// root route it rendered a single crumb ("Trang chủ") that duplicated the nav
// item already marked as the current page.
const trail = [];
  if (route.audience === AUDIENCE.MEMBER) {
    // Member Space hierarchy: Không gian của tôi -> section -> page.
    // Terminology: "Member Space" only in audit docs — the UI says "Không gian của tôi"
    // (ARCHITECTURE_CONSOLIDATION §6.4 forbids "Admin Dashboard").
    if (route.id !== 'member.dashboard') trail.push({ label: 'Không gian của tôi', href: '/me' });
    if (parent && parent.path !== '/me' && route.id !== 'member.dashboard') trail.push({ label: parent.label, href: parent.path });
  } else if (parent) {
    // Public space keeps its own (shallower) chain — never prefixed with Member Space.
    trail.push({ label: parent.label, href: parent.path });
  }
  trail.push({ label: route.label, href: null, current: true });

  // A breadcrumb with no parent and no depth is noise, not navigation: on the
  // public root it rendered one crumb ("Trang chủ") duplicating the nav item
  // already marked as the current page.
  const crumbs = (route.parent || (route.audience === AUDIENCE.MEMBER && route.id !== 'member.dashboard'))
    ? trail
    : [];

  let back = null;
  if (parent) {
    back = {
      mode: route.backMode || 'hierarchy',
      href: parent.path,
      label: `← ${parent.label}`
    };
  } else if (route.audience === AUDIENCE.MEMBER) {
    back = { mode: 'history', href: null, label: '← Quay lại trang trước' };
  }

  const claraEligible = Boolean(typeof window !== 'undefined' && window.__CLARA_ELIGIBLE__);
  const next = (nextByRoute[route.id] || [])
    .filter(id => id !== 'member.spaces' && (id !== 'member.clara' || claraEligible))
    .map(findById)
    .filter(Boolean)
    .map(r => ({ id: r.id, label: r.label, href: r.path, status: r.status, discourse: r.discourse }));

  return {
    route, params, parent, audience: route.audience,
    context: route.context, discourse: route.discourse,
    breadcrumb: crumbs, back, next, unknown: false,
    sitemapNote: route.sitemapNote || null
  };
}
