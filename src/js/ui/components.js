/**
 * GIATOC UI SYSTEM v0.2 — components.js
 * Structure component factories. Every value coming from the DB/API is written
 * with textContent (see dom.js). No innerHTML anywhere in this file.
 * Component contract: docs/design/GIATOC_COMPONENT_INVENTORY_v0.2.md
 */

import { el, textOrNull, initials } from './dom.js';

/* --- InstitutionHeader ------------------------------------------------------ */
export function InstitutionHeader({
  brand = {}, nav = null, context = null, scopeLabel = null, actions = [], assets = null
} = {}) {
  const brandNode = el('a', { class: 'gi-header__brand', href: brand.href || '/' }, [
    (brand.mark !== false && assets && assets.logoNgang)
      ? el('img', {
        class: 'gi-header__brand-mark',
        src: assets.logoNgang,
        // When the text label is suppressed, the logo carries the accessible name.
        alt: brand.alt || (brand.hideText ? (brand.text || 'Gia Tộc Trần Trọng Thu') : 'Gia Tộc')
      })
      : null,
    // v0.2: the logo nameplate already reads "GIATỘC TRẦN TRỌNG THU", so repeating
    // it as red text beside the logo duplicated the family name on first screen.
    brand.hideText ? null : el('span', {
      class: 'gi-header__brand-text',
      text: brand.text || 'Gia Tộc Trần Trọng Thu'
    })
  ]);

  return el('div', { class: 'gi-region-header' }, [
    el('div', { class: 'gi-container' }, [
      el('div', { class: 'gi-header__inner' }, [
        brandNode,
        el('div', { class: 'gi-header__actions' }, [nav, ...actions.filter(Boolean)])
      ]),
      context || null,
      scopeLabel ? el('div', {}, [el('div', { class: 'gi-context' }, [el('span', { text: scopeLabel })])]) : null
    ])
  ]);
}

/* --- GlobalNav / MemberNav --------------------------------------------------- */
export function NavigationList(items = [], { ariaLabel = 'Điều hướng chính', id = 'nav' } = {}) {
  const list = el('ul', { class: 'gi-nav__list' }, items.filter(Boolean).map(item => {
    const isSection = typeof item.href === 'string' && item.href.startsWith('#');
    const ariaCurrent = item.ariaCurrent || (isSection ? 'location' : 'page');
    return el('li', { class: 'gi-nav__item' }, [
      el('a', {
        class: `gi-nav__link${item.current ? ' gi-nav__link--active' : ''}`,
        href: item.href,
        html: item.iconHtml || null,
        text: item.iconHtml ? null : item.label,
        'aria-label': item.iconHtml ? item.label : null,
        'aria-current': item.current ? ariaCurrent : null,
        'data-nav-href': item.href || '',
        title: textOrNull(item.title)
      })
    ]);
  }));
  return el('nav', { class: 'gi-nav', 'aria-label': ariaLabel }, [list]);
}

export const GlobalNav = (items, opts) => NavigationList(items,
  { ariaLabel: 'Điều hướng công khai', id: 'global-nav', ...(opts || {}) });
export const MemberNav = (items, opts) => NavigationList(items,
  { ariaLabel: 'Điều hướng thành viên', id: 'member-nav', ...(opts || {}) });

/* --- Breadcrumb -------------------------------------------------------------- */
export function Breadcrumb(crumbs = []) {
  if (!crumbs || crumbs.length === 0) return null;
  return el('nav', { class: 'gi-breadcrumb', 'aria-label': 'Đường dẫn' }, [
    el('ol', { class: 'gi-breadcrumb__list' }, crumbs.map(c => el('li', { class: 'gi-breadcrumb__item' }, [
      c.href && !c.current
        ? el('a', { class: 'gi-breadcrumb__link', href: c.href, text: c.label })
        : el('span', {
          class: c.current ? 'gi-breadcrumb__current' : '',
          text: c.label,
          'aria-current': c.current ? 'page' : null
        })
    ])))
  ]);
}

/* --- BackNavigation ---------------------------------------------------------- */
/* mode is always explicit and visible: 'hierarchy' (IA parent) or 'history'. */
export function BackNavigation(back) {
  if (!back) return null;
  const link = el('a', {
    class: 'gi-backnav__link',
    href: back.href || '#',
    text: back.label,
    'data-back-mode': back.mode,
    onclick: back.mode === 'history'
      ? (event) => { event.preventDefault(); window.history.back(); }
      : null
  });
  return el('div', { class: 'gi-backnav' }, [
    link,
    el('span', {
      class: 'gi-backnav__mode',
      text: back.mode === 'hierarchy' ? 'theo phân cấp' : 'theo lịch sử trình duyệt',
      title: back.mode === 'hierarchy'
        ? 'Quay về trang cha trong cây điều hướng, không phụ thuộc lịch sử trình duyệt'
        : 'Không có trang cha trong cây điều hướng nên dùng lịch sử trình duyệt'
    })
  ]);
}

/* --- PageHeader -------------------------------------------------------------- */
/**
 * Step 2 of the page skeleton on EVERY surface (mission §5): a single <h1>.
 * `variant` lets a surface keep its own voice (e.g. Clara reads as a letter)
 * WITHOUT introducing a second heading grammar.
 */
export function PageHeader({ eyebrow, title, subtitle, meta = [], variant = null } = {}) {
  return el('div', { class: `gi-pageheader${variant ? ` gi-pageheader--${variant}` : ''}` }, [
    textOrNull(eyebrow) ? el('p', { class: 'gi-pageheader__eyebrow', text: eyebrow }) : null,
    textOrNull(title) ? el('h1', { class: 'gi-pageheader__title', text: title }) : null,
    textOrNull(subtitle) ? el('p', { class: 'gi-pageheader__subtitle', text: subtitle }) : null,
    meta.filter(Boolean).length ? el('div', { class: 'gi-pageheader__meta' }, meta.filter(Boolean)) : null
  ]);
}

/* --- Section ----------------------------------------------------------------- */
export function Section({ id, title, action = null, children = [], lead } = {}) {
  return el('section', { class: 'gi-section', id: id || null, 'aria-labelledby': id ? `${id}-title` : null }, [
    (title || action) ? el('div', { class: 'gi-section__head' }, [
      el('h2', { class: 'gi-section__title', id: id ? `${id}-title` : null, text: title || '' }),
      action
    ]) : null,
    textOrNull(lead) ? el('p', { class: 'gi-card__meta', text: lead }) : null,
    ...children.filter(Boolean)
  ]);
}

/* --- Card -------------------------------------------------------------------- */
export function Card({ title, meta, children = [], variant = '', href = null } = {}) {
  const body = [
    title ? el('h3', { class: 'gi-card__title', text: title }) : null,
    textOrNull(meta) ? el('p', { class: 'gi-card__meta', text: meta }) : null,
    ...children.filter(Boolean)
  ];
  const classes = ['gi-card', variant].filter(Boolean).join(' ');
  if (href) {
    return el('a', {
      class: `${classes} gi-card--interactive`, href,
      style: { textDecoration: 'none', color: 'inherit' }
    }, body);
  }
  return el('div', { class: classes }, body);
}
/**
 * DiscourseEntry — vNEXT addition.
 * One entrance to ONE discourse scope (MẠCH / Thư gửi Clara / Cây phả đồ).
 *
 * The `nature` line is deliberate: a member (and a future developer reading the
 * DOM) must be able to tell these three apart without opening them. A generic
 * "Xem tất cả nội dung" entry would erase the very distinction the Human
 * decision requires (mission §3, CONSOLIDATION §6.2).
 */
export function DiscourseEntry({ label, nature, href, note = null, kind = null } = {}) {
  return el('a', {
    class: 'gi-card gi-card--interactive gi-discourse-entry',
    href,
    'data-scope': kind,
    style: { textDecoration: 'none', color: 'inherit' }
  }, [
    el('h3', { class: 'gi-card__title', text: label }),
    textOrNull(nature) ? el('p', { class: 'gi-discourse-entry__nature', text: nature }) : null,
    textOrNull(note) ? el('p', { class: 'gi-card__meta', text: note }) : null
  ]);
}

/* --- PersonCard -------------------------------------------------------------- */
export function PersonCard({ person = {}, relationLabel = null, href = null } = {}) {
  const name = textOrNull(person.name) || textOrNull(person.raw_name) || 'Chưa có tên';
  const life = [textOrNull(person.birthYear), textOrNull(person.deathYear)].filter(Boolean).join(' – ');
  const place = person.birth && textOrNull(person.birth.place) ? `Nơi sinh: ${person.birth.place}` : null;

  /* [GOVERNANCE §16] The internal id (e.g. "@I54@") is an addressing mechanism, not
     prose. It lives in the `href` and in `data-person-id` ONLY — it is never painted.
     Previously this printed `${id} · ${life}`, which leaked a data-layer token into
     the reading surface on every related-person card. */
  return el('div', {
    class: 'gi-card',
    ...(person.id ? { 'data-person-id': person.id } : {})
  }, [
    el('div', { class: 'gi-personcard' }, [
      person.avatar
        ? el('img', {
            src: person.avatar,
            alt: name,
            class: 'gi-personcard__avatar gi-personcard__avatar--img',
            style: { width: '40px', height: '40px', objectFit: 'cover', borderRadius: '0' }
          })
        : el('div', { class: 'gi-personcard__avatar', 'aria-hidden': 'true', text: initials(name) }),
      el('div', { class: 'gi-personcard__body' }, [
        href
          ? el('a', { class: 'gi-personcard__name', href, text: name, style: { color: 'inherit' } })
          : el('p', { class: 'gi-personcard__name', text: name }),
        life ? el('p', { class: 'gi-personcard__facts', text: life }) : null,
        place ? el('p', { class: 'gi-personcard__facts', text: place }) : null,
        relationLabel ? el('div', { class: 'gi-personcard__relations' }, [el('span', { text: relationLabel })]) : null
      ])
    ])
  ]);
}

/* --- StatusBadge ------------------------------------------------------------- */
export function StatusBadge({ label, tone = 'neutral', title } = {}) {
  const text = textOrNull(label);
  if (!text) return null;
  return el('span', { class: `gi-badge gi-badge--${tone}`, text, title: textOrNull(title) });
}

/* --- EpistemicBadge ---------------------------------------------------------- */
/**
 * [RULE] Rendered ONLY when a data source supplies the claim type.
 * `source` must describe where the classification came from; without it the
 * component renders nothing. Static markup badges are prohibited.
 */
export function EpistemicBadge({ claimType, source, label } = {}) {
  const allowed = ['fact', 'inference', 'proposal', 'evidence-needed'];
  const type = allowed.includes(claimType) ? claimType : null;
  if (!type || !textOrNull(source)) return null;
  const text = textOrNull(label) || {
    fact: 'FACT', inference: 'INFERENCE', proposal: 'PROPOSAL', 'evidence-needed': 'EVIDENCE NEEDED'
  }[type];
  return el('span', {
    class: `gi-badge gi-epistemic gi-epistemic--${type}`,
    text,
    title: `Phân loại: ${text} · nguồn: ${source}`
  });
}

/* --- Footer ------------------------------------------------------------------ */
/**
 * Shared by PUBLIC and INNER. The CONTENT is the same on both surfaces — a single
 * copyright line. It carries no internal scope names, no build identifiers and no
 * diagnostics (spec §16).
 *
 * [CHANGED 2026-10-04] Presentation moved out of inline `style` attributes into
 * `foundation.css`, because Governance §8.5 forbids page-level style overrides and
 * hard-coded values. The rendered result is identical: the same 48px/24px padding,
 * the same 1px rule, the same 64px top margin, now expressed with approved tokens.
 */
export function Footer() {
  return el('footer', { class: 'gi-region-footer gi-footer' }, [
    el('p', { class: 'gi-footer__line', text: '© 2026 Gia Tộc Trần Trọng Thu.' })
  ]);
}

