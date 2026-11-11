/**
 * GIATOC UI SYSTEM vNEXT — shell.js
 * Shared application shell. v0.2 built ONE shell for two audiences; vNEXT
 * keeps that (shared primitives, no parallel framework) but makes the CONTEXT
 * explicit: public, member, editorial, genealogy, admin (contexts.js).
 *
 * Public and Member remain two contexts of ONE system — same header, nav,
 * breadcrumb, main and footer components; only nav items, scope indicator and
 * the auth boundary differ, driven by the resolved navigation context.
 */

import { el, mount } from './dom.js';
import {
  InstitutionHeader, MemberNav, GlobalNav, Breadcrumb, BackNavigation, Footer
} from './components.js';
import { ContextBar } from './visibility.js';
import { applyFavicon } from './assets.js';

/**
 * Public nav — the gate's own frontage.
 *
 * v0.1 decision, from IDENTITY_PUBLIC_DISCOURSE_AUDIT §13 (INFERENCE, High):
 * "xóa bỏ các thanh điều hướng trỏ tới 'Gia phả', 'Tư liệu'". Those links are
 * gone and must not come back while Public has no genealogy semantics.
 *
 * What remains: two anchors to this page's own sections + the member door.
 * No internal scope is named here, and no link leaves the family except /login.
 */
export const PUBLIC_NAV = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Cội nguồn', href: '#coi-nguon' },
  { label: 'Dòng chảy', href: '#dong-chay' },
  { label: 'Không gian gia tộc', href: '#khong-gian' },
  { label: 'Trợ giúp & Kết nối', href: '/help' },
  { label: 'Cổng thành viên →', href: '/login', title: 'Cổng không gian thành viên dòng họ' }
];

export const MEMBER_NAV = [
  { label: 'Không gian của tôi', href: '/me' },
  { label: 'Cây phả đồ', href: '/me/tree' },
  { label: 'Kho tư liệu ảnh', href: '/me/gallery' },
  { label: 'Lịch giỗ & Niên biểu', href: '/me/events' },
  { label: 'MẠCH', href: '/me/mach' },
  { label: 'Thư gửi nhau', href: '/me/letters' },
  { label: 'Tài khoản', href: '/me/account' },
  { label: 'Đóng góp & Yêu cầu', href: '/me/requests' },
  { label: 'Trợ giúp', href: '/help' },
  { label: 'Đổi mật khẩu', href: '/me/change-password' },
  { label: 'Đăng xuất', href: '/logout' }
];

export function buildMemberNav({ claraEligible = false } = {}) {
  const items = MEMBER_NAV.map(item => ({ ...item }));
  if (claraEligible === true) {
    const machIdx = items.findIndex(item => item.href === '/me/mach');
    const claraItem = { label: 'Thư gửi Clara', href: '/me/clara' };
    if (machIdx !== -1) {
      items.splice(machIdx + 1, 0, claraItem);
    } else {
      items.push(claraItem);
    }
  }
  return items;
}

export function isProfileClaraEligible(profile) {
  if (!profile) return false;
  if (typeof profile.claraEligible === 'boolean') {
    return profile.claraEligible;
  }
  return Boolean(
    (profile.account && (
      profile.account.role === 'admin'
      || profile.account.role === 'owner'
      || ['tuantq', 'tuan'].includes(String(profile.account.username || '').toLowerCase())
    ))
    || (profile.person && ['@I18@', '@I170@'].includes(profile.person.id))
  );
}

export async function resolveMemberSessionFlags(api) {
  let profile = null;
  let claraEligible = false;
  try {
    if (api && typeof api.memberProfile === 'function') {
      profile = await api.memberProfile();
      claraEligible = isProfileClaraEligible(profile);
    }
  } catch {
    profile = null;
    claraEligible = false;
  }
  if (typeof window !== 'undefined') {
    window.__CLARA_ELIGIBLE__ = claraEligible;
    window.__MEMBER_PROFILE__ = profile;
  }
  return { claraEligible, profile };
}

export function navItemsFor(audience, pathname, customItems = null) {
  const defaultMemberItems = buildMemberNav({
    claraEligible: Boolean(typeof window !== 'undefined' && window.__CLARA_ELIGIBLE__)
  });
  const items = customItems || (audience === 'member' ? defaultMemberItems : PUBLIC_NAV);
  const current = pathname || '/';
  return items.map(item => ({
    ...item,
    current: item.href === current
      || (current.startsWith(`${item.href}/`) && item.href !== '/')
  }));
}

/**
 * Render the shell into a host element.
 * @param {string|HTMLElement} host
 * @param {object} options { context, assets, title, customNavItems }
 * @returns {{ main: HTMLElement, footerMount: HTMLElement }}
 */
export function renderShell(host, { context, assets = null, title, customNavItems = null } = {}) {
  const isMember = context && context.audience === 'member';
  const nav = isMember
    ? MemberNav(navItemsFor('member', context.route && context.route.path, customNavItems))
    : GlobalNav(navItemsFor('public', context.route && context.route.path, customNavItems));

  if (assets) applyFavicon(assets);

  /* v0.2 — CONTEXTBAR DECISION (deliberate, public surface only)
   *
   * The ContextBar ("Cấp / Không gian / Diễn ngôn / Dữ liệu / Truy cập") is
   * application chrome. It belongs on Member Space, where a person is *using
   * the system* and benefits from knowing which dataset and access level they
   * are in.
   *
   * On Public Home it does the opposite: it turns the front door of a family
   * institution into an application status readout. Mission v0.2 §3 names this
   * exactly ("APPLICATION DIAGNOSTIC SURFACE" vs "SPECIAL PRESENTATION
   * SURFACE"), and §13 sanctions this one difference.
   *
   * So: ContextBar is REMOVED on `/` ONLY. It is NOT replaced by any other
   * metadata component — semantic orientation on Public is carried by the page
   * itself (the family name, the Family Voice section, the gate), which is
   * how a real institution orients a visitor. Member surfaces are untouched.
   */
  const isPublicHome = !isMember && (!context || !context.route || context.route.id === 'public.home');
  const scope = isPublicHome ? null : ContextBar(context);

  const header = InstitutionHeader({
    // On Public Home the logo nameplate IS the wordmark, so the redundant red
    // text beside it is suppressed (v0.2 UX-03 follow-up). Member surfaces keep
    // the text label — there the header is a navigation anchor, not a hero.
    brand: {
      text: 'Gia Tộc Trần Trọng Thu',
      href: isMember ? '/me' : '/',
      mark: true,
      hideText: true
    },
    nav,
    context: Breadcrumb(context.breadcrumb),
    scopeLabel: null,
    actions: [],
    assets
  });

  const main = el('main', { class: 'gi-region-main' }, [
    el('div', { class: 'gi-container gi-container--content', id: 'gi-main-content' }, [
      // v0.4 page skeleton — same order on EVERY surface (mission §5):
      //   1 context identity -> 2 page title -> 3 scope explanation
      //   -> 4 primary content -> 5 state -> 6 actions -> 7 navigation
      // Context identity comes first so "where am I?" is answered before
      // anything else on the page.
      scope,
      BackNavigation(context.back)
    ])
  ]);

  const footer = Footer();

  const container = typeof host === 'string' ? document.querySelector(host) : host;
  const shell = el('div', { class: 'gi-body' }, [header, main, footer]);
  mount(container, shell);

  return {
    main,
    content: main.querySelector('#gi-main-content')
  };
}

/**
 * v0.4: context identity now comes from ContextBar (structured, resolved from
 * contexts.js). This helper is kept only for compatibility with older call
 * sites and returns the VISIBLE Vietnamese label — the English "Member Space"
 * phrasing must not reach the UI (CONSOLIDATION §6.4).
 */
export function contextLabelFor(context) {
  if (!context) return null;
  return context.audience === 'member' ? 'Không gian của tôi' : 'Trang công khai';
}
