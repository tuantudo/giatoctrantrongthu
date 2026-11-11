/**
 * GIATOC UI SYSTEM vNEXT — gallery.js
 * Member Space (/me/gallery) & Vibecode Lab Surface 8 — FAMILY PHOTO & ARCHIVE GALLERY
 *
 * Implements Increment 02 of Product Convergence V1.0:
 *   - 185 Media Assets & 173 Person Associations
 *   - 5 Standard Kind Buckets: All, Portrait, Document, Grave, Family/Milestone
 *   - Two-Way Cross Navigation with Person 6-Layer Profile (/me/tree/person/:id)
 *   - Lightbox Detail Modal with Dimensions, Provenance, and Person Links
 *   - Resilient UX: Loading states, empty states, error handling, broken image fallbacks
 *   - Multi-breakpoint responsive grid (375px, 768px, 1024px, 1440px)
 *
 * GOVERNANCE RULES:
 * - Brand Governance v0.1: Heritage Crimson (#8b261e), Dó paper (#f7f3ea), Noto/Playfair Serif.
 * - Zero unescaped HTML; safe DOM construction via el().
 * - Restrict by default: member-only space.
 */

import { el, clear } from './dom.js';
import { PageHeader, Section } from './components.js';
import { Region, StatePanel, STATE } from './states.js';
import { api } from './data.js';
import {
  normalizeMediaList,
  indexMediaById,
  filterMediaByKind,
  groupMediaByKind,
  resolveAssetIdFromPersonMedia,
  getPersonMediaList,
  formatMediaCaption,
  getMediaDimensionsOrAspect,
  getMediaKindLabel,
  isPersonMatch,
  normalizePersonId
} from '../domain/archive/index.js';

/** SVG Fallback icon for broken/missing media */
const HERITAGE_FALLBACK_SVG = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="none">
  <rect width="400" height="300" fill="#f7f3ea"/>
  <rect x="10" y="10" width="380" height="280" stroke="#8b261e" stroke-width="1.5" stroke-dasharray="4 4" fill="none" opacity="0.4"/>
  <circle cx="200" cy="130" r="42" fill="#eaddc7"/>
  <path d="M185 130 C185 120 192 112 200 112 C208 112 215 120 215 130 C215 138 208 145 200 145 C192 145 185 138 185 130 Z" fill="#8b261e"/>
  <path d="M172 165 C172 152 184 146 200 146 C216 146 228 152 228 165 L172 165 Z" fill="#8b261e"/>
  <text x="200" y="205" text-anchor="middle" font-family="serif" font-size="14" fill="#57534e" font-weight="600">GIA TỘC TRẦN TRỌNG THỤ</text>
  <text x="200" y="225" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#78716c">Tư liệu bảo tồn số hóa</text>
</svg>
`);

/**
 * Normalizes media file path to a displayable URL
 */
function resolveMediaUrl(mediaItem) {
  if (!mediaItem) return '';
  const file = mediaItem.file || mediaItem.path || mediaItem.url || '';
  if (!file) return '';
  if (file.startsWith('http://') || file.startsWith('https://') || file.startsWith('data:')) {
    return file;
  }
  if (file.startsWith('/')) {
    return file;
  }
  return `/${file}`;
}

/**
 * Builds bidirectional associations between media items and genealogy individuals.
 */
function buildAssociationIndex(mediaItems, personMediaList, peopleList) {
  const peopleMap = new Map();
  if (Array.isArray(peopleList)) {
    for (const p of peopleList) {
      if (!p || !p.id) continue;
      peopleMap.set(p.id, p);
      peopleMap.set(normalizePersonId(p.id), p);
    }
  }

  // Map: assetId -> Array of { person, role, isPrimary }
  const assetToPeople = new Map();

  if (Array.isArray(personMediaList)) {
    for (const pm of personMediaList) {
      if (!pm) continue;
      const assetId = resolveAssetIdFromPersonMedia(pm);
      if (!assetId) continue;

      const pId = pm.personId || pm.person_id;
      const personObj = peopleMap.get(pId) || peopleMap.get(normalizePersonId(pId)) || {
        id: pId,
        name: pId
      };

      if (!assetToPeople.has(assetId)) {
        assetToPeople.set(assetId, []);
      }
      assetToPeople.get(assetId).push({
        person: personObj,
        role: pm.role || 'PORTRAIT',
        isPrimary: pm.isPrimary === true || pm.is_primary === 1 || pm.is_primary === true
      });
    }
  }

  return { peopleMap, assetToPeople };
}

/**
 * Main Gallery Rendering Entry Point
 *
 * @param {HTMLElement} content Container element
 * @param {Object} context Route context
 * @param {Object} [options] Optional initial filters { personId, kind }
 */
export function renderGallery(content, context, options = {}) {
  clear(content);

  // 1. Page Header
  content.appendChild(PageHeader({
    eyebrow: 'Kho tư liệu & Di sản hình ảnh',
    title: 'Kho Tư Liệu Di Ảnh Gia Tộc',
    subtitle: 'Lưu trữ và bảo tồn 185 tư liệu ảnh, chân dung tiền nhân, bia ký và chứng thư lịch sử qua các thế hệ.'
  }));

  const mainSection = Section({ id: 'gallery-main', title: null });
  content.appendChild(mainSection);

  const zone = el('div', { id: 'zone-gallery' });
  mainSection.appendChild(zone);

  Region(zone, {
    load: () => Promise.all([
      api.media().catch(() => ({})),
      api.personMedia().catch(() => []),
      api.genealogy().catch(() => ({ people: [] }))
    ]),
    render: ([rawMedia, personMediaList, genealogy]) => {
      const allMedia = normalizeMediaList(rawMedia);
      const peopleList = Array.isArray(genealogy) ? genealogy : (genealogy.people || []);
      const { peopleMap, assetToPeople } = buildAssociationIndex(allMedia, personMediaList, peopleList);

      // Gallery State
      let activeKind = options.kind || 'all';
      let activePersonId = options.personId || null;
      let searchQuery = '';

      const galleryContainer = el('div', { class: 'gi-gallery' });

      // Modal container (appended once)
      let modalBackdrop = null;

      function closeModal() {
        if (modalBackdrop && modalBackdrop.parentNode) {
          modalBackdrop.parentNode.removeChild(modalBackdrop);
          modalBackdrop = null;
        }
      }

      function openModal(mediaItem) {
        closeModal();

        const assetId = mediaItem.assetId || mediaItem.id;
        const caption = formatMediaCaption(mediaItem, 'Tư liệu di sản gia tộc');
        const kindLabel = getMediaKindLabel(mediaItem.kind);
        const imgUrl = resolveMediaUrl(mediaItem);
        const dims = getMediaDimensionsOrAspect(mediaItem);
        const taggedPeople = assetToPeople.get(assetId) || [];

        const modalImg = el('img', {
          src: imgUrl,
          alt: caption,
          loading: 'eager'
        });
        modalImg.onerror = () => {
          modalImg.src = HERITAGE_FALLBACK_SVG;
        };

        const peopleElements = taggedPeople.length > 0
          ? el('div', { class: 'gi-stack gi-stack--tight' }, taggedPeople.map(({ person, role, isPrimary }) => {
              const pName = person.name || person.id;
              const pId = person.id;
              const isLab = typeof window !== 'undefined' && window.location.pathname.includes('lab.html');
              const profileHref = isLab
                ? `#view=person&id=${encodeURIComponent(pId)}`
                : `/me/tree/person/${encodeURIComponent(pId)}`;

              return el('div', {
                class: 'gi-card',
                style: {
                  padding: '10px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--color-surface-sunken, #fafaf9)',
                  border: '1px solid var(--color-border-subtle, #e7e5e4)'
                }
              }, [
                el('div', {}, [
                  el('span', {
                    style: { fontWeight: '600', color: 'var(--color-text-primary, #1c1917)', marginRight: '6px' },
                    text: `👤 ${pName}`
                  }),
                  isPrimary ? el('span', {
                    class: 'gi-badge gi-badge--primary',
                    style: { fontSize: '10px', padding: '2px 6px' },
                    text: 'Ảnh chính'
                  }) : null
                ]),
                el('div', { style: { display: 'flex', gap: '8px' } }, [
                  el('a', {
                    class: 'gi-btn gi-btn--subtle',
                    style: { padding: '4px 8px', fontSize: '12px' },
                    href: profileHref,
                    text: 'Hồ sơ 6 tầng →'
                  }),
                  el('button', {
                    class: 'gi-btn gi-btn--subtle',
                    style: { padding: '4px 8px', fontSize: '12px' },
                    text: 'Lọc ảnh người này',
                    click: (e) => {
                      e.preventDefault();
                      closeModal();
                      activePersonId = pId;
                      renderView();
                    }
                  })
                ])
              ]);
            }))
          : el('p', {
              style: { fontSize: '13px', color: 'var(--color-text-muted, #78716c)', fontStyle: 'italic', margin: 0 },
              text: 'Chưa có nhân vật nào được gắn thẻ trực tiếp trong tư liệu này.'
            });

        modalBackdrop = el('div', {
          class: 'gi-modal-backdrop',
          click: (e) => {
            if (e.target === modalBackdrop) closeModal();
          }
        }, [
          el('div', { class: 'gi-modal-dialog' }, [
            // Modal Header
            el('div', { class: 'gi-modal-header' }, [
              el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
                el('span', {
                  class: 'gi-badge',
                  style: {
                    background: 'var(--color-brand-heritage, #8b261e)',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: '600'
                  },
                  text: kindLabel
                }),
                el('span', {
                  style: { fontSize: '12px', color: 'var(--color-text-muted, #78716c)' },
                  text: `Mã tài sản: ${assetId}`
                })
              ]),
              el('button', {
                class: 'gi-btn gi-btn--subtle',
                style: { fontSize: '16px', padding: '2px 8px', lineHeight: '1' },
                text: '✕',
                click: closeModal
              })
            ]),

            // Modal Body
            el('div', { class: 'gi-modal-content' }, [
              el('div', { class: 'gi-modal-media-pane' }, [modalImg]),
              el('div', { class: 'gi-modal-details-pane' }, [
                el('div', {}, [
                  el('h3', {
                    style: {
                      margin: '0 0 8px',
                      fontFamily: 'var(--font-display-active, serif)',
                      fontSize: '18px',
                      color: 'var(--color-text-primary, #1c1917)'
                    },
                    text: caption
                  }),
                  dims.aspectRatioString ? el('p', {
                    style: { fontSize: '12px', color: 'var(--color-text-secondary, #57534e)', margin: '0 0 6px' },
                    text: `Tỷ lệ khung hình: ${dims.aspectRatioString} ${dims.width && dims.height ? `(${dims.width} × ${dims.height}px)` : ''}`
                  }) : null,
                  mediaItem.provenance?.harvestedAt ? el('p', {
                    style: { fontSize: '12px', color: 'var(--color-text-muted, #78716c)', margin: 0 },
                    text: `Ngày số hóa / thu thập: ${mediaItem.provenance.harvestedAt}`
                  }) : null,
                  mediaItem.provenance?.sourceName ? el('p', {
                    style: { fontSize: '12px', color: 'var(--color-text-muted, #78716c)', margin: '4px 0 0' },
                    text: `Nguồn gốc: ${mediaItem.provenance.sourceName}`
                  }) : null
                ]),

                el('hr', { style: { border: 'none', borderTop: '1px solid var(--color-border-subtle, #e7e5e4)', margin: '4px 0' } }),

                el('div', {}, [
                  el('h4', {
                    style: {
                      fontSize: '13px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--color-brand-heritage, #8b261e)',
                      margin: '0 0 10px'
                    },
                    text: 'Nhân vật liên quan'
                  }),
                  peopleElements
                ])
              ])
            ])
          ])
        ]);

        document.body.appendChild(modalBackdrop);
      }

      // Escape key listener for closing modal
      function handleKeyDown(e) {
        if (e.key === 'Escape') closeModal();
      }
      window.addEventListener('keydown', handleKeyDown);

      // Filter Calculation
      function getFilteredItems() {
        let items = allMedia;

        // 1. Kind filter
        if (activeKind !== 'all') {
          if (activeKind === 'family') {
            items = items.filter(m => {
              const k = (m.kind || '').toLowerCase();
              return k === 'family' || k === 'milestone';
            });
          } else {
            items = filterMediaByKind(items, activeKind);
          }
        }

        // 2. Person filter
        if (activePersonId) {
          items = items.filter(m => {
            const assetId = m.assetId || m.id;
            const tagged = assetToPeople.get(assetId) || [];
            return tagged.some(t => isPersonMatch(t.person.id, activePersonId));
          });
        }

        // 3. Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase();
          items = items.filter(m => {
            const cap = formatMediaCaption(m, '').toLowerCase();
            const assetId = (m.assetId || m.id || '').toLowerCase();
            const source = (m.provenance?.sourceName || '').toLowerCase();
            const tagged = assetToPeople.get(m.assetId || m.id) || [];
            const hasPersonMatch = tagged.some(t => (t.person.name || '').toLowerCase().includes(q));

            return cap.includes(q) || assetId.includes(q) || source.includes(q) || hasPersonMatch;
          });
        }

        return items;
      }

      // Sub-component: Filter Tabs
      const kindGroups = groupMediaByKind(allMedia);
      const tabCounts = {
        all: allMedia.length,
        portrait: (kindGroups.portrait || []).length,
        document: (kindGroups.document || []).length,
        grave: (kindGroups.grave || []).length,
        family: (kindGroups.family || []).length + (kindGroups.milestone || []).length
      };

      const tabs = [
        { key: 'all', label: 'Tất cả' },
        { key: 'portrait', label: 'Chân dung' },
        { key: 'document', label: 'Tài liệu' },
        { key: 'grave', label: 'Mộ phần & Bia ký' },
        { key: 'family', label: 'Kỷ niệm & Gia đình' }
      ];

      function renderView() {
        clear(galleryContainer);

        // Header controls (Search & Tabs)
        const headerControls = el('div', { class: 'gi-gallery__header' }, [
          // Filter Tabs Bar & Search Box
          el('div', {
            style: {
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              justifyContent: 'space-between',
              alignItems: 'center'
            }
          }, [
            el('div', { class: 'gi-gallery__filter-bar' }, tabs.map(tab => {
              const isActive = activeKind === tab.key;
              const count = tabCounts[tab.key] || 0;
              return el('button', {
                class: `gi-gallery__tab ${isActive ? 'gi-gallery__tab--active' : ''}`,
                'data-kind': tab.key,
                click: () => {
                  activeKind = tab.key;
                  renderView();
                }
              }, [
                el('span', { text: tab.label }),
                el('span', { class: 'gi-gallery__tab-count', text: String(count) })
              ]);
            })),

            el('input', {
              class: 'gi-gallery__search-box',
              type: 'text',
              placeholder: 'Tìm theo tên ảnh, người gắn thẻ, tài sản...',
              value: searchQuery,
              input: (e) => {
                searchQuery = e.target.value;
                renderView();
              }
            })
          ])
        ]);

        // Person Filter Banner (if active)
        if (activePersonId) {
          const targetPerson = peopleMap.get(activePersonId) || peopleMap.get(normalizePersonId(activePersonId));
          const pName = targetPerson ? (targetPerson.name || targetPerson.id) : activePersonId;

          const banner = el('div', { class: 'gi-gallery__person-filter-banner' }, [
            el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
              el('span', { text: '🔍' }),
              el('span', { text: `Đang lọc tư liệu ảnh của nhân vật: ` }),
              el('strong', { text: pName })
            ]),
            el('button', {
              class: 'gi-gallery__clear-btn',
              click: () => {
                activePersonId = null;
                renderView();
              }
            }, [el('span', { text: '✕ Bỏ lọc người này' })])
          ]);

          headerControls.appendChild(banner);
        }

        galleryContainer.appendChild(headerControls);

        // Filtered Grid
        const filteredItems = getFilteredItems();

        if (filteredItems.length === 0) {
          galleryContainer.appendChild(StatePanel({
            state: STATE.EMPTY,
            title: 'Không tìm thấy tư liệu ảnh phù hợp',
            explanation: 'Không có ảnh nào khớp với bộ lọc hoặc từ khóa tìm kiếm hiện tại.',
            action: activePersonId || activeKind !== 'all' || searchQuery ? el('button', {
              class: 'gi-btn gi-btn--secondary',
              text: 'Xóa toàn bộ bộ lọc',
              click: () => {
                activeKind = 'all';
                activePersonId = null;
                searchQuery = '';
                renderView();
              }
            }) : null
          }));
          return;
        }

        const grid = el('div', { class: 'gi-gallery__grid' }, filteredItems.map(item => {
          const assetId = item.assetId || item.id;
          const caption = formatMediaCaption(item, 'Tư liệu di sản gia tộc');
          const kindLabel = getMediaKindLabel(item.kind);
          const imgUrl = resolveMediaUrl(item);
          const taggedPeople = assetToPeople.get(assetId) || [];

          const imgEl = el('img', {
            class: 'gi-gallery__img',
            src: imgUrl,
            alt: caption,
            loading: 'lazy'
          });
          imgEl.onerror = () => {
            imgEl.src = HERITAGE_FALLBACK_SVG;
          };

          const card = el('div', {
            class: 'gi-gallery__card',
            'data-asset-id': assetId,
            'data-kind': item.kind || 'unknown',
            click: () => openModal(item)
          }, [
            // Media thumbnail
            el('div', { class: 'gi-gallery__media-wrapper' }, [
              imgEl,
              el('span', { class: 'gi-gallery__badge', text: kindLabel })
            ]),

            // Card body
            el('div', { class: 'gi-gallery__body' }, [
              el('h4', { class: 'gi-gallery__caption', text: caption }),
              el('div', { class: 'gi-gallery__meta' }, [
                el('span', { text: item.provenance?.harvestedAt || item.source || 'Lưu trữ' }),
                taggedPeople.length > 0
                  ? el('span', { text: `${taggedPeople.length} người được gắn thẻ` })
                  : el('span', { text: '' })
              ]),

              // Tagged people pills
              taggedPeople.length > 0 ? el('div', { class: 'gi-gallery__tags' }, taggedPeople.map(({ person }) => {
                const pId = person.id;
                const pName = person.name || pId;
                const isLab = typeof window !== 'undefined' && window.location.pathname.includes('lab.html');
                const profileHref = isLab
                  ? `#view=person&id=${encodeURIComponent(pId)}`
                  : `/me/tree/person/${encodeURIComponent(pId)}`;

                return el('a', {
                  class: 'gi-gallery__tag',
                  href: profileHref,
                  click: (e) => {
                    // Stop event from bubbling to card openModal if clicking person chip
                    e.stopPropagation();
                  }
                }, [
                  el('span', { text: '👤' }),
                  el('span', { text: pName })
                ]);
              })) : null
            ])
          ]);

          return card;
        }));

        galleryContainer.appendChild(grid);
      }

      renderView();
      return galleryContainer;
    },
    empty: {
      title: 'Kho tư liệu đang cập nhật',
      body: 'Hiện chưa có ảnh nào trong cơ sở lưu trữ.'
    }
  });

  return content;
}

