/**
 * GIATOC UI SYSTEM vNEXT — tree.js
 * Cây phả đồ tương tác (/me/tree).
 *
 * Authority: docs/design/GIATOC_INNER_SITE_UX_IA_SPEC_v0.1.md §8
 *            brand/BRAND_GOVERNANCE_v0.1.md
 *            Master Plan: Delivery Batch UI 03 (TP-006, TP-016)
 *
 * Capabilities:
 *  1. Dual-View Mode Switcher:
 *     - Interactive 3-Tier Pedigree Tree (Me-Centric Focus Person)
 *     - Archival List Index (Vietnamese Collation, diacritic-insensitive search)
 *  2. Me-Centric Focus Navigation:
 *     - Parents (Tier 1), Focus & Spouse Union (Tier 2), Direct Children (Tier 3)
 *     - Lineage Breadcrumbs trail via BFS kinship path to root ancestor (@I1@ Cố Thu)
 *     - Branch expansion drilldown via [↓ N con] buttons
 *     - Quick jump selector and Reset to Root button
 *  3. Archival List:
 *     - Dense, searchable reference index with generation badges & relationship count
 *     - One-click [🌳 Mở trên phả đồ] to jump into pedigree view
 */

import { el, initials } from './dom.js';
import { PageHeader } from './components.js';
import { Region, StatePanel, STATE } from './states.js';
import { api } from './data.js';
import {
  indexPeople,
  lifeSpan,
  sortPeopleByName,
  normalizeVietnamese,
  deriveGenerations
} from '../domain/genealogy/index.js';
import {
  getGenerationMeta,
  findKinshipPath
} from '../domain/kinship/index.js';
import {
  resolvePrimaryPortrait
} from '../domain/archive/index.js';

const SEX_LABEL = { M: 'Nam', F: 'Nữ', U: 'Không rõ' };

/** Helper to render avatar with initials fallback */
function renderAvatar(person, size = 48) {
  const name = person.name || 'NN';
  if (person.avatar) {
    return el('img', {
      src: person.avatar,
      alt: name,
      class: 'gi-pedigree__avatar',
      style: { width: `${size}px`, height: `${size}px` }
    });
  }
  return el('div', {
    class: 'gi-pedigree__avatar',
    style: { width: `${size}px`, height: `${size}px` },
    text: initials(name)
  });
}

/** One archival row for list view. */
function ArchivalRow(person, people, query, onSelectForTree) {
  const details = person.details || person;
  const groups = ['parents', 'siblings', 'spouses', 'children'];
  const known = groups.reduce((n, k) => {
    const v = details[k];
    return n + (Array.isArray(v) ? v.filter(Boolean).length : 0);
  }, 0);

  const span = lifeSpan(person);
  const sex = SEX_LABEL[person.sex] || null;
  const genMeta = (person.generation !== undefined && person.generation !== null)
    ? getGenerationMeta(person.generation)
    : null;
  const isMatch = query
    ? String(person.name || '').toLowerCase().includes(query)
    : true;

  const btnOpenTree = el('button', {
    class: 'gi-pedigree__btn',
    type: 'button',
    text: '🌳 Phả đồ',
    title: 'Mở phả đồ lấy người này làm trọng tâm'
  });
  btnOpenTree.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof onSelectForTree === 'function') onSelectForTree(person.id);
  });

  return el('li', {
    class: isMatch ? 'gi-tree__row' : 'gi-tree__row gi-tree__row--hidden',
    'data-person-id': person.id
  }, [
    el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
      el('a', {
        class: 'gi-tree__name',
        href: `/me/tree/person/${encodeURIComponent(person.id)}`,
        text: person.name || 'Chưa có tên'
      }),
      genMeta ? el('span', { class: `gi-badge ${genMeta.badgeClass || ''}`, text: genMeta.label }) : null
    ]),
    el('span', { class: 'gi-tree__span', text: span || '—' }),
    el('span', { class: 'gi-tree__sex', text: sex || '—' }),
    el('span', {
      class: 'gi-tree__rel',
      text: known > 0 ? `${known} quan hệ` : '—'
    }),
    el('div', { class: 'gi-tree__actions' }, [btnOpenTree])
  ].filter(Boolean));
}

/**
 * Renders the Archival List View.
 */
export function renderArchivalList({ host, people, onSelectPerson }) {
  host.innerHTML = '';
  const all = [...people.values()];
  const sorted = sortPeopleByName(all);

  const input = el('input', {
    class: 'gi-tree__search',
    type: 'search',
    id: 'tree-search',
    placeholder: 'Tìm theo tên nhân vật (ví dụ: Thu, Đức, Thành)…',
    'aria-label': 'Tìm nhân vật theo tên'
  });

  const count = el('p', { class: 'gi-tree__count', role: 'status', 'aria-live': 'polite' });
  const list = el('ul', { class: 'gi-tree__list' }, sorted.map((p) => ArchivalRow(p, people, null, onSelectPerson)));

  const applyFilter = (raw) => {
    const q = normalizeVietnamese(String(raw || '').trim());
    let shown = 0;
    for (const row of list.children) {
      const name = (row.querySelector('.gi-tree__name') || {}).textContent || '';
      const hit = !q || normalizeVietnamese(name).includes(q);
      row.classList.toggle('gi-tree__row--hidden', !hit);
      if (hit) shown++;
    }
    count.textContent = q
      ? `${shown} trong ${all.length} nhân vật phù hợp với "${String(raw).trim()}"`
      : `${all.length} nhân vật trong phả hệ`;
  };

  input.addEventListener('input', (e) => applyFilter(e.target.value));
  applyFilter('');

  const container = el('div', { class: 'gi-stack' }, [
    el('div', { class: 'gi-tree__toolbar' }, [input]),
    count,
    el('p', { class: 'gi-tree__head', 'aria-hidden': 'true' }, [
      el('span', { text: 'Tên nhân vật & Thế hệ' }),
      el('span', { text: 'Vòng đời' }),
      el('span', { text: 'Giới tính' }),
      el('span', { text: 'Quan hệ' }),
      el('span', { text: 'Thao tác' })
    ]),
    list
  ]);

  host.appendChild(container);
  return container;
}

/**
 * Renders the Interactive 3-Tier Pedigree Tree (Me-Centric Focus).
 */
export function renderPedigreeTree({ host, people, initialFocusId, onSelectPerson }) {
  host.innerHTML = '';
  let focusId = initialFocusId || '@I1@';
  if (!people.has(focusId)) {
    focusId = people.keys().next().value || null;
  }

  const container = el('div', { class: 'gi-pedigree__container', id: 'pedigree-tree-container' });
  host.appendChild(container);

  function drawFocus(targetId) {
    if (!people.has(targetId)) return;
    focusId = targetId;
    if (typeof onSelectPerson === 'function') onSelectPerson(focusId);
    container.innerHTML = '';

    const person = people.get(focusId);
    const genMeta = (person.generation !== undefined && person.generation !== null)
      ? getGenerationMeta(person.generation)
      : null;

    // --- 1. Lineage Breadcrumbs & Navigation Toolbar -------------------------
    const pathResult = findKinshipPath('@I1@', focusId, people);
    const breadcrumbItems = [];

    if (pathResult.found && Array.isArray(pathResult.path) && pathResult.path.length > 0) {
      pathResult.path.forEach((pid, idx) => {
        const isCurrent = (pid === focusId);
        const p = people.get(pid);
        const pName = p ? p.name : pid;
        if (!isCurrent) {
          const btnCrumb = el('button', {
            type: 'button',
            class: 'gi-pedigree__crumb-link',
            text: pName
          });
          btnCrumb.addEventListener('click', () => drawFocus(pid));
          breadcrumbItems.push(btnCrumb);
          breadcrumbItems.push(el('span', { class: 'gi-breadcrumb__sep', text: ' › ' }));
        } else {
          breadcrumbItems.push(el('strong', {
            class: 'gi-pedigree__crumb-current',
            text: `${pName} (Đương sự)`
          }));
        }
      });
      if (pathResult.relationship && pathResult.relationship !== 'Bản thân') {
        breadcrumbItems.push(el('span', {
          class: 'gi-badge gi-badge--neutral',
          style: { marginLeft: '8px' },
          text: `Quan hệ với Cố Thu: ${pathResult.relationship}`
        }));
      }
    } else {
      breadcrumbItems.push(el('span', { text: person.name || 'Đương sự' }));
    }

    const breadcrumbBar = el('div', { class: 'gi-pedigree__breadcrumbs' }, [
      el('span', { style: { fontWeight: '600', marginRight: '6px' }, text: 'Đường dẫn huyết thống:' }),
      ...breadcrumbItems
    ]);

    // Quick jump selector
    const allPeopleSorted = sortPeopleByName([...people.values()]);
    const jumpSelect = el('select', {
      class: 'gi-input',
      'aria-label': 'Nhảy nhanh đến nhân vật'
    }, allPeopleSorted.map(p => {
      const g = (p.generation !== undefined && p.generation !== null) ? getGenerationMeta(p.generation) : null;
      return el('option', {
        value: p.id,
        selected: p.id === focusId ? 'selected' : null,
        text: `${p.name || 'Chưa có tên'} (${g ? g.label : 'Gia tộc'})`
      });
    }));
    jumpSelect.addEventListener('change', (e) => drawFocus(e.target.value));

    const btnResetRoot = el('button', {
      type: 'button',
      class: 'gi-pedigree__btn',
      text: '⌂ Về mốc Cố Thu'
    });
    btnResetRoot.addEventListener('click', () => drawFocus('@I1@'));

    const toolbar = el('div', { class: 'gi-pedigree__toolbar' }, [
      breadcrumbBar,
      el('div', { class: 'gi-pedigree__actions' }, [
        el('label', { style: { fontSize: '13px' }, text: 'Chuyển trọng tâm:' }, [jumpSelect]),
        btnResetRoot
      ])
    ]);

    // --- 2. TIER 1: Parents (Bậc Phụ Mẫu) -----------------------------------
    const parentIds = (Array.isArray(person.parents) ? person.parents : []).filter(id => people.has(id));
    const parentCards = parentIds.map(parId => {
      const par = people.get(parId);
      const parGen = (par.generation !== undefined && par.generation !== null) ? getGenerationMeta(par.generation) : null;
      const btnFocusPar = el('button', {
        type: 'button',
        class: 'gi-pedigree__btn gi-pedigree__btn--primary',
        text: '↰ Đặt làm đương sự'
      });
      btnFocusPar.addEventListener('click', () => drawFocus(parId));

      return el('div', { class: 'gi-pedigree__card' }, [
        el('div', { class: 'gi-pedigree__card-header' }, [
          renderAvatar(par, 40),
          el('div', {}, [
            el('a', {
              class: 'gi-pedigree__name',
              href: `/me/tree/person/${encodeURIComponent(parId)}`,
              text: par.name || 'Chưa rõ tên'
            }),
            parGen ? el('p', { class: 'gi-pedigree__meta', text: parGen.label }) : null
          ])
        ]),
        el('p', { class: 'gi-pedigree__meta', text: lifeSpan(par) || '—' }),
        el('div', { class: 'gi-pedigree__btn-row' }, [
          btnFocusPar,
          el('a', {
            class: 'gi-pedigree__btn',
            href: `/me/tree/person/${encodeURIComponent(parId)}`,
            text: '↗ Hồ sơ'
          })
        ])
      ]);
    });

    const tierParents = el('section', { class: 'gi-pedigree__tier' }, [
      el('h4', { class: 'gi-pedigree__tier-header', text: 'TẦNG 1: BẬC PHỤ MẪU (CHA / MẸ)' }),
      parentCards.length > 0
        ? el('div', { class: 'gi-pedigree__cards-row' }, parentCards)
        : el('div', {
            class: 'gi-pedigree__union-badge',
            text: 'Mốc khởi nguyên phả hệ · Cố Tổ (Đời 1) — Không ghi nhận phụ mẫu tiền khởi trong dữ liệu số hóa'
          })
    ]);

    // --- 3. TIER 2: Focus Person & Spouse Union -----------------------------
    const btnViewDetail = el('a', {
      class: 'gi-pedigree__btn gi-pedigree__btn--primary',
      href: `/me/tree/person/${encodeURIComponent(person.id)}`,
      text: '📄 Xem hồ sơ chi tiết (6 tầng) →'
    });

    const focusCard = el('div', { class: 'gi-pedigree__card gi-pedigree__card--focus' }, [
      el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
        el('span', { class: 'gi-badge gi-badge--brand', text: 'ĐƯƠNG SỰ ĐANG CHỌN' }),
        genMeta ? el('span', { class: `gi-badge ${genMeta.badgeClass || ''}`, text: genMeta.label }) : null
      ]),
      el('div', { class: 'gi-pedigree__card-header', style: { marginTop: '8px' } }, [
        renderAvatar(person, 56),
        el('div', {}, [
          el('a', {
            class: 'gi-pedigree__name',
            style: { fontSize: '18px' },
            href: `/me/tree/person/${encodeURIComponent(person.id)}`,
            text: person.name || 'Chưa rõ tên'
          }),
          el('p', { class: 'gi-pedigree__meta', text: `${SEX_LABEL[person.sex] || '—'} · ${lifeSpan(person) || '—'}` })
        ])
      ]),
      el('div', { class: 'gi-pedigree__btn-row', style: { marginTop: '12px' } }, [btnViewDetail])
    ]);

    const spouseIds = (Array.isArray(person.spouses) ? person.spouses : []).filter(id => people.has(id));
    const spouseCards = spouseIds.map(spId => {
      const sp = people.get(spId);
      const spGen = (sp.generation !== undefined && sp.generation !== null) ? getGenerationMeta(sp.generation) : null;
      const btnFocusSp = el('button', {
        type: 'button',
        class: 'gi-pedigree__btn gi-pedigree__btn--primary',
        text: '↰ Đặt làm đương sự'
      });
      btnFocusSp.addEventListener('click', () => drawFocus(spId));

      return el('div', { class: 'gi-pedigree__card' }, [
        el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
          el('span', { class: 'gi-badge gi-badge--neutral', text: 'HÔN PHỐI / BẠN ĐỜI' }),
          spGen ? el('span', { class: `gi-badge ${spGen.badgeClass || ''}`, text: spGen.label }) : null
        ]),
        el('div', { class: 'gi-pedigree__card-header', style: { marginTop: '8px' } }, [
          renderAvatar(sp, 44),
          el('div', {}, [
            el('a', {
              class: 'gi-pedigree__name',
              href: `/me/tree/person/${encodeURIComponent(spId)}`,
              text: sp.name || 'Chưa rõ tên'
            }),
            el('p', { class: 'gi-pedigree__meta', text: lifeSpan(sp) || '—' })
          ])
        ]),
        el('div', { class: 'gi-pedigree__btn-row', style: { marginTop: '8px' } }, [
          btnFocusSp,
          el('a', {
            class: 'gi-pedigree__btn',
            href: `/me/tree/person/${encodeURIComponent(spId)}`,
            text: '↗ Hồ sơ'
          })
        ])
      ]);
    });

    const unionRow = el('div', { class: 'gi-pedigree__cards-row' }, [
      focusCard,
      spouseCards.length > 0
        ? el('div', { class: 'gi-pedigree__union-badge', text: '⚭ Hôn phối' })
        : null,
      ...spouseCards
    ].filter(Boolean));

    const tierFocus = el('section', { class: 'gi-pedigree__tier' }, [
      el('h4', { class: 'gi-pedigree__tier-header', text: 'TẦNG 2: ĐƯƠNG SỰ & HÔN PHỐI' }),
      unionRow
    ]);

    // --- 4. TIER 3: Direct Children (Hậu Duệ Trực Hệ) ------------------------
    const childIds = (Array.isArray(person.children) ? person.children : []).filter(id => people.has(id));
    const childCards = childIds.map(cid => {
      const ch = people.get(cid);
      const chGen = (ch.generation !== undefined && ch.generation !== null) ? getGenerationMeta(ch.generation) : null;
      const grandChildren = (Array.isArray(ch.children) ? ch.children : []).filter(id => people.has(id));

      const btnBranch = el('button', {
        type: 'button',
        class: grandChildren.length > 0 ? 'gi-pedigree__btn gi-pedigree__btn--primary' : 'gi-pedigree__btn',
        text: grandChildren.length > 0 ? `↓ Mở rộng nhánh (${grandChildren.length} con)` : '↰ Đặt làm đương sự'
      });
      btnBranch.addEventListener('click', () => drawFocus(cid));

      return el('div', { class: 'gi-pedigree__card' }, [
        el('div', { class: 'gi-pedigree__card-header' }, [
          renderAvatar(ch, 40),
          el('div', {}, [
            el('a', {
              class: 'gi-pedigree__name',
              href: `/me/tree/person/${encodeURIComponent(cid)}`,
              text: ch.name || 'Chưa rõ tên'
            }),
            chGen ? el('p', { class: 'gi-pedigree__meta', text: chGen.label }) : null
          ])
        ]),
        el('p', { class: 'gi-pedigree__meta', text: `${SEX_LABEL[ch.sex] || '—'} · ${lifeSpan(ch) || '—'}` }),
        el('div', { class: 'gi-pedigree__btn-row' }, [
          btnBranch,
          el('a', {
            class: 'gi-pedigree__btn',
            href: `/me/tree/person/${encodeURIComponent(cid)}`,
            text: '↗ Hồ sơ'
          })
        ])
      ]);
    });

    const tierChildren = el('section', { class: 'gi-pedigree__tier' }, [
      el('h4', {
        class: 'gi-pedigree__tier-header',
        text: `TẦNG 3: HẬU DUỆ TRỰC HỆ (${childCards.length} CON CÁI ĐÃ GHI NHẬN)`
      }),
      childCards.length > 0
        ? el('div', { class: 'gi-pedigree__cards-row' }, childCards)
        : el('div', {
            class: 'gi-pedigree__union-badge',
            text: 'Chưa ghi nhận con cái trong dữ liệu số hóa của đương sự này'
          })
    ]);

    // Append tiers
    container.appendChild(toolbar);
    container.appendChild(tierParents);
    container.appendChild(tierFocus);
    container.appendChild(tierChildren);
  }

  drawFocus(focusId);
  return container;
}

/**
 * Main surface entry point for /me/tree.
 */
export function renderTree(content, context) {
  content.appendChild(PageHeader({
    eyebrow: 'Gia phả',
    title: 'Cây phả đồ',
    subtitle: 'Khảo sát và tương tác phả hệ dòng họ qua mô hình phả hệ 3 tầng hoặc tra cứu toàn bộ danh bạ gia tộc.'
  }));

  const host = el('div', { id: 'tree-index' });
  content.appendChild(host);

  Region(host, {
    load: async () => {
      const [genealogy, mediaList, personMediaList] = await Promise.all([
        api.genealogy(),
        api.media().catch(() => []),
        api.personMedia().catch(() => [])
      ]);

      const people = indexPeople(genealogy);

      // Derive generations anchored at @I1@ (Cố Thu)
      const { personGenerations } = deriveGenerations('@I1@', people, genealogy.families || {});
      for (const [id, person] of people.entries()) {
        if (person.generation === undefined && personGenerations[id] !== undefined) {
          person.generation = personGenerations[id];
        }
        // Enrich avatars from archive assets if not directly specified
        if (!person.avatar && personMediaList && mediaList) {
          const portrait = resolvePrimaryPortrait(person.id, personMediaList, mediaList);
          if (portrait && portrait.file) {
            person.avatar = portrait.file;
          }
        }
      }

      return { people, mediaList, personMediaList };
    },
    render: ({ people }) => {
      const all = [...people.values()];
      if (all.length === 0) {
        return StatePanel({
          state: STATE.EMPTY,
          title: 'Cây phả đồ đang được cập nhật',
          explanation: 'Gia tộc chưa ghi nhận nhân vật nào vào gia phả. '
                      + 'Khi có, những nhân vật và quan hệ sẽ xuất hiện ở đây.'
        });
      }

      let currentMode = 'pedigree'; // 'pedigree' | 'list'
      let currentFocusId = '@I1@';
      if (typeof window !== 'undefined' && window.location && window.location.search) {
        try {
          const pFocus = new URLSearchParams(window.location.search).get('focus');
          if (pFocus && people.has(pFocus)) {
            currentFocusId = pFocus;
          }
        } catch {
          // fallback
        }
      }
      if (!people.has(currentFocusId)) {
        currentFocusId = people.keys().next().value;
      }

      const viewport = el('div', { id: 'tree-viewport' });

      const btnPedigree = el('button', {
        type: 'button',
        class: 'gi-view-switcher__btn gi-view-switcher__btn--active',
        text: '🌳 Phả đồ tương tác'
      });

      const btnList = el('button', {
        type: 'button',
        class: 'gi-view-switcher__btn',
        text: '📋 Danh sách tra cứu'
      });

      function switchMode(mode, focusId = null) {
        currentMode = mode;
        if (focusId && people.has(focusId)) {
          currentFocusId = focusId;
        }

        if (currentMode === 'pedigree') {
          btnPedigree.classList.add('gi-view-switcher__btn--active');
          btnList.classList.remove('gi-view-switcher__btn--active');
          renderPedigreeTree({
            host: viewport,
            people,
            initialFocusId: currentFocusId,
            onSelectPerson: (id) => { currentFocusId = id; }
          });
        } else {
          btnList.classList.add('gi-view-switcher__btn--active');
          btnPedigree.classList.remove('gi-view-switcher__btn--active');
          renderArchivalList({
            host: viewport,
            people,
            onSelectPerson: (id) => switchMode('pedigree', id)
          });
        }
      }

      btnPedigree.addEventListener('click', () => switchMode('pedigree'));
      btnList.addEventListener('click', () => switchMode('list'));

      const switcher = el('div', { class: 'gi-view-switcher' }, [
        btnPedigree,
        btnList
      ]);

      const wrapper = el('div', { class: 'gi-stack' }, [
        switcher,
        viewport
      ]);

      // Initial render in pedigree mode
      switchMode('pedigree');

      return wrapper;
    },
    empty: {
      title: 'Cây phả đồ đang được cập nhật',
      body: 'Gia tộc chưa ghi nhận nhân vật nào vào gia phả.'
    }
  });

  return content;
}
