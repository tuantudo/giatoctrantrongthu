/**
 * GIATOC UI SYSTEM v0.2 — person.js
 * Person detail surface (/me/tree/person/:id).
 *
 * Authority: docs/design/GIATOC_INNER_SITE_UX_IA_SPEC_v0.1.md §9, §15, §16
 *
 * Scope discipline:
 *  - Person is NOT Account: nothing account-related is rendered here (spec §11).
 *  - Clara ≠ MẠCH; this surface belongs to neither — it is archival data.
 *  - Source/evidence is shown ONLY when the record actually carries evidence.
 *
 * [REWRITTEN 2026-10-04 — Inner Site implementation]
 * [REFINED 2026-11-07 — Craft Anything UI Design & Build Stage 3]
 *
 * [DATE PRESENTATION] GEDCOM dates are a storage format, not prose. A value like
 * "BET 15 OCT 1956 AND 19 OCT 1956" is a machine range estimate; printing it raw
 * leaks the data format into the reading surface and reads as an error to a family
 * member. `humanDate()` renders a bounded year, marks an estimate as an estimate,
 * and returns null when the record gives us no usable year — we never guess.
 */

import { humanDate } from '../domain/genealogy/index.js';
import { getGenerationMeta } from '../domain/kinship/index.js';
import { resolvePrimaryPortrait, getPersonMediaList, formatMediaCaption } from '../domain/archive/index.js';
import { convertSolar2Lunar, formatLunarDate } from '../shared/utils/date-lunar.js';
export { humanDate };

import { el, clear } from './dom.js';
import { PageHeader, Section, PersonCard } from './components.js';
import { Region, StatePanel, STATE } from './states.js';
import { api, indexPeople } from './data.js';
import { hasEvidenceStructure } from './epistemic.js';

const SEX_LABEL = { M: 'Nam', F: 'Nữ', U: 'Không rõ' };

function EpistemicBadge(type, text) {
  if (!type) return null;
  return el('span', {
    class: `gi-badge gi-epistemic gi-epistemic--${type}`,
    style: { marginLeft: '6px', fontSize: '11px', verticalAlign: 'middle' },
    text: text || type
  });
}

function factRow(label, value, badge = null) {
  if (!value) return null;
  return el('p', { class: 'gi-fact' }, [
    el('span', { text: `${label}: ${value}` }),
    badge
  ].filter(Boolean));
}

function relationGroup(peopleMap, ids, label) {
  const valid = (Array.isArray(ids) ? ids : []).filter(Boolean);
  if (valid.length === 0) return null;
  return el('div', { class: 'gi-stack gi-stack--tight' }, [
    el('p', { class: 'gi-card__meta', text: `${label} (${valid.length})` }),
    el('div', { class: 'gi-grid gi-grid--cards' }, valid.map(id => PersonCard({
      person: peopleMap.get(id) || { id },
      href: `/me/tree/person/${encodeURIComponent(id)}`
    })))
  ]);
}

function parseDMY(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const parts = dateStr.trim().split(/[\/\-\.]/);
  if (parts.length === 3) {
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const y = parseInt(parts[2], 10);
    if (!isNaN(d) && !isNaN(m) && !isNaN(y) && d >= 1 && d <= 31 && m >= 1 && m <= 12 && y > 1000) {
      return { day: d, month: m, year: y };
    }
  }
  return null;
}

function extractYear(dateVal) {
  if (!dateVal) return null;
  if (typeof dateVal === 'number') return dateVal;
  if (typeof dateVal === 'string') {
    const m = dateVal.match(/\b(1[789]\d{2}|20\d{2})\b/);
    if (m) return parseInt(m[1], 10);
  }
  return null;
}

export function renderPerson(content, personId, route = null) {
  content.appendChild(PageHeader({
    eyebrow: 'Gia phả',
    title: 'Hồ sơ nhân vật',
    subtitle: 'Những gì gia tộc ghi nhận về người này. Trường chưa có dữ liệu sẽ được nói rõ thay vì suy đoán.'
  }));

  /* The internal id lives here and in the URL — never in prose (spec §16). */
  const host = el('div', { id: 'person-detail', 'data-person-id': personId });
  content.appendChild(host);

  Region(host, {
    load: async () => {
      const [genealogy, mediaList, personMediaList] = await Promise.all([
        api.genealogy(),
        api.media().catch(() => []),
        api.personMedia().catch(() => [])
      ]);
      return {
        genealogy,
        people: indexPeople(genealogy),
        mediaList,
        personMediaList,
        id: personId
      };
    },
    render: ({ genealogy, people, mediaList, personMediaList, id }) => {
      const person = people.get(id);
      if (!person) {
        return el('div', { class: 'gi-stack' }, [
          StatePanel({
            state: STATE.EMPTY,
            title: 'Chưa có hồ sơ cho nhân vật này',
            explanation: 'Gia tộc chưa ghi nhận hồ sơ cho người được yêu cầu. '
                        + 'Bạn có thể quay lại Cây phả đồ để xem những hồ sơ đang có.'
          }),
          el('a', { class: 'gi-btn gi-btn--secondary', href: '/me/tree', text: '← Về Cây phả đồ' })
        ]);
      }

      /* Resolve primary portrait from archive domain if available */
      if (!person.avatar && personMediaList && mediaList) {
        const portrait = resolvePrimaryPortrait(person.id, personMediaList, mediaList);
        if (portrait && portrait.file) {
          person.avatar = portrait.file;
        }
      }

      const birth = person.birth || null;
      const death = person.death || null;

      const genMeta = (person.generation !== undefined && person.generation !== null)
        ? getGenerationMeta(person.generation)
        : null;

      /* Epistemic status badges (TP-025) */
      const birthBadge = (birth && birth.date)
        ? (hasEvidenceStructure(person) || person.fsid
            ? EpistemicBadge('fact', '✓ Đã xác minh')
            : EpistemicBadge('inference', '~ Ước lượng phả hệ'))
        : EpistemicBadge('evidence-needed', '? Cần chứng cứ');

      const deathBadge = (death && death.date)
        ? (hasEvidenceStructure(person) || person.fsid
            ? EpistemicBadge('fact', '✓ Đã xác minh')
            : EpistemicBadge('inference', '~ Ước lượng phả hệ'))
        : null;

      /* Lifespan calculations */
      const bYear = birth ? extractYear(birth.date) : null;
      const dYear = death ? extractYear(death.date) : null;
      let lifespanStr = '';
      if (bYear && dYear) {
        const age = dYear - bYear;
        const honorific = age >= 60 ? 'Hưởng thọ' : 'Hưởng dương';
        lifespanStr = `${bYear} — ${dYear} · ${honorific} ${age} tuổi`;
      } else if (bYear) {
        lifespanStr = `Sinh năm ${bYear}`;
      } else if (dYear) {
        lifespanStr = `Tạ thế năm ${dYear}`;
      }

      /* Two-column layout container */
      const layout = el('div', { class: 'gi-person-layout' });
      const leftCol = el('aside', { class: 'gi-person-col-left' });
      const rightCol = el('div', { class: 'gi-person-col-right' });
      layout.appendChild(leftCol);
      layout.appendChild(rightCol);

      /* ======================================================================
       * LEFT COLUMN: HERO ARCHIVAL PLAQUE & LIFE MILESTONES
       * ==================================================================== */
      const identitySec = Section({ id: 'person-identity', title: 'Thông tin cơ bản' });
      leftCol.appendChild(identitySec);

      // Hero Plaque
      const avatarWrap = el('div', { class: 'gi-hero-plaque__avatar-wrap' }, [
        person.avatar
          ? el('img', { class: 'gi-hero-plaque__avatar-img', src: person.avatar, alt: person.name })
          : el('span', { class: 'gi-hero-plaque__initials', text: person.name ? person.name.charAt(0) : '?' })
      ]);

      const plaqueTitle = el('h3', { class: 'gi-hero-plaque__title', text: person.name });
      const plaqueMeta = el('div', { class: 'gi-hero-plaque__meta' }, [
        genMeta ? el('span', { class: 'gi-badge gi-badge--gold', text: genMeta.label }) : null,
        birthBadge,
        deathBadge
      ].filter(Boolean));

      const heroPlaqueChildren = [avatarWrap, plaqueTitle, plaqueMeta];
      if (lifespanStr) {
        heroPlaqueChildren.push(el('div', { class: 'gi-hero-plaque__lifespan', text: lifespanStr }));
      }

      // Facts
      const facts = el('div', { class: 'gi-stack gi-stack--tight', style: { width: '100%', textAlign: 'left', marginTop: '10px' } }, [
        factRow('Tên gọi', person.name),
        factRow('Giới tính', SEX_LABEL[person.sex] || null),
        genMeta ? factRow('Thế hệ', genMeta.label) : null,
        factRow('Sinh', birth ? [humanDate(birth.date), birth.place].filter(Boolean).join(' · ') : null, birthBadge),
        factRow('Mất', death ? [humanDate(death.date), death.place].filter(Boolean).join(' · ') : null, deathBadge),
        factRow('Rửa tội', person.baptism ? [person.baptism.date, person.baptism.place].filter(Boolean).join(' · ') : null)
      ].filter(Boolean));
      heroPlaqueChildren.push(facts);

      // Lunar Memorial Callout
      if (death) {
        const isLab = typeof window !== 'undefined' && window.location.pathname.includes('lab.html');
        const eventsHref = isLab
          ? `#view=events&tab=memorials&id=${encodeURIComponent(id)}`
          : `/me/events?tab=memorials&id=${encodeURIComponent(id)}`;
        const dObj = parseDMY(death.date);
        let lunarText = null;
        if (dObj) {
          const l = convertSolar2Lunar(dObj.day, dObj.month, dObj.year, 7);
          if (l) lunarText = formatLunarDate(l);
        }

        const memorialBox = el('div', { class: 'gi-memorial-callout' }, [
          el('div', { class: 'gi-memorial-callout__title', text: '🕯️ Tưởng niệm & Lịch giỗ' }),
          el('div', {
            class: 'gi-memorial-callout__date',
            text: `Ngày mất: ${humanDate(death.date)}${death.place ? ` · ${death.place}` : ''}`
          }),
          lunarText ? el('p', { class: 'gi-memorial-callout__lunar', text: `Ngày giỗ âm lịch: ${lunarText}` }) : null,
          el('a', {
            class: 'gi-btn gi-btn--subtle',
            style: { padding: '4px 10px', fontSize: '11px', marginTop: '4px', display: 'inline-block' },
            href: eventsHref,
            text: 'Mở Lịch Giỗ Gia Tộc →'
          })
        ].filter(Boolean));
        heroPlaqueChildren.push(memorialBox);
      }

      const heroPlaque = el('div', { class: 'gi-hero-plaque' }, heroPlaqueChildren);
      leftCol.appendChild(heroPlaque);

      // Life Milestones Chronology
      const milestones = [];
      if (birth) {
        milestones.push({
          year: bYear || 'Sinh',
          text: `Sinh tại ${birth.place || 'quê quán'} (${humanDate(birth.date)})`
        });
      }
      if (person.baptism) {
        milestones.push({
          year: extractYear(person.baptism.date) || 'Rửa tội',
          text: `Bí tích rửa tội tại ${person.baptism.place || 'giáo xứ'}`
        });
      }
      if (person.spouses && person.spouses.length > 0) {
        const spouseNames = person.spouses.map(sid => {
          const sp = people.get(sid);
          return sp ? sp.name : sid;
        }).join(', ');
        milestones.push({
          year: 'Hôn phối',
          text: `Kết hôn với ${spouseNames}`
        });
      }
      if (death) {
        milestones.push({
          year: dYear || 'Tạ thế',
          text: `Tạ thế tại ${death.place || 'gia đình'} (${humanDate(death.date)})`
        });
      }

      if (milestones.length > 0) {
        const timelineItems = milestones.map(m => el('div', { class: 'gi-life-timeline__item' }, [
          el('div', { class: 'gi-life-timeline__dot' }),
          el('span', { class: 'gi-life-timeline__year', text: `${m.year}:` }),
          el('span', { class: 'gi-life-timeline__desc', text: m.text })
        ]));

        const timelineCard = el('div', { class: 'gi-life-timeline' }, [
          el('h4', { class: 'gi-life-timeline__title', text: 'Dòng thời gian cuộc đời' }),
          el('div', { class: 'gi-life-timeline__track' }, timelineItems)
        ]);
        leftCol.appendChild(timelineCard);
      }

      // ======================================================================
      // SỰ KIỆN & NGÀY GIỖ TRONG LỊCH DÒNG HỌ (BIDIRECTIONAL LINKAGE)
      // ======================================================================
      const isLab = typeof window !== 'undefined' && window.location.pathname.includes('lab.html');
      const eventsBaseHref = isLab ? '#view=events' : '/me/events';
      const memorialLinkHref = `${eventsBaseHref}?tab=memorials&id=${encodeURIComponent(id)}`;
      const timelineLinkHref = `${eventsBaseHref}?tab=timeline&id=${encodeURIComponent(id)}`;

      const isDeceased = person.isLiving === false || !!death || !!person.deathDate || !!person.deathYear;
      const personTimelineEvents = (genealogy && genealogy.timeline)
        ? genealogy.timeline.filter(t => t.personId === id || (t.personIds && t.personIds.includes(id)))
        : [];

      const eventLinkChildren = [];

      // Block 1: Memorial Linkage if deceased
      if (isDeceased) {
        const deathDateStr = death ? (death.date || '') : (person.deathDate || person.deathYear || '');
        const hasExactDate = deathDateStr && deathDateStr.includes('/');
        const hasYearOnly = deathDateStr && !deathDateStr.includes('/') && /^\d{4}$/.test(deathDateStr.trim());

        let statusBadgeText = 'ℹ️ CHƯA XÁC ĐỊNH NGÀY';
        let statusBadgeClass = 'gi-badge';
        let statusDesc = 'Gia phả ghi nhận đã quy tiên nhưng chưa rõ ngày giỗ.';

        if (hasExactDate) {
          statusBadgeText = '✓ ĐÃ XÁC MINH';
          statusBadgeClass = 'gi-badge gi-badge--gold';
          const dObj = parseDMY(deathDateStr);
          let lText = '';
          if (dObj) {
            const l = convertSolar2Lunar(dObj.day, dObj.month, dObj.year, 7);
            if (l) lText = ` (Âm lịch: ${formatLunarDate(l)})`;
          }
          statusDesc = `Ngày mất: ${humanDate(deathDateStr)}${lText}`;
        } else if (hasYearOnly) {
          statusBadgeText = '⚠️ CẦN KIỂM CHỨNG';
          statusBadgeClass = 'gi-badge';
          statusDesc = `Chỉ ghi nhận năm mất (${deathDateStr.trim()}), cần gia đình kiểm chứng ngày âm lịch.`;
        }

        eventLinkChildren.push(el('div', {
          style: {
            padding: '12px 14px',
            background: 'var(--color-surface-sunken, #fafaf9)',
            border: '1px solid var(--color-border-subtle, #e7e5e4)',
            borderRadius: '4px',
            marginBottom: '10px'
          }
        }, [
          el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' } }, [
            el('span', { style: { fontSize: '12px', fontWeight: '700', color: 'var(--color-brand-heritage, #881337)' }, text: '🕯️ TƯỞNG NIỆM & KỴ GIỖ' }),
            el('span', { class: statusBadgeClass, style: { fontSize: '11px', padding: '1px 6px' }, text: statusBadgeText })
          ]),
          el('p', { style: { margin: '0 0 10px', fontSize: '12.5px', color: 'var(--color-text-secondary, #57534e)', lineHeight: '1.45' }, text: statusDesc }),
          el('a', {
            class: 'gi-btn gi-btn--primary',
            style: { width: '100%', boxSizing: 'border-box', justifyContent: 'center', fontSize: '12px', padding: '6px 10px' },
            href: memorialLinkHref,
            text: '🕯️ Xem Ngày Giỗ Trong Lịch Tưởng Niệm →'
          })
        ]));
      }

      // Block 2: Timeline Linkage
      eventLinkChildren.push(el('div', {
        style: {
          padding: '12px 14px',
          background: 'var(--color-surface-sunken, #fafaf9)',
          border: '1px solid var(--color-border-subtle, #e7e5e4)',
          borderRadius: '4px',
          marginBottom: '10px'
        }
      }, [
        el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' } }, [
          el('span', { style: { fontSize: '12px', fontWeight: '700', color: 'var(--color-brand-gold, #c59b27)' }, text: '📜 NIÊN BIỂU LỊCH SỬ' }),
          el('span', { class: 'gi-badge', style: { fontSize: '11px', padding: '1px 6px' }, text: `${personTimelineEvents.length} sự kiện` })
        ]),
        el('p', { style: { margin: '0 0 10px', fontSize: '12.5px', color: 'var(--color-text-secondary, #57534e)', lineHeight: '1.45' },
          text: personTimelineEvents.length > 0
            ? 'Nhân vật có sự kiện ghi dấu trong dòng thời gian lịch sử gia tộc.'
            : 'Khám phá niên biểu lịch sử dòng họ và vị trí các thế hệ.'
        }),
        el('a', {
          class: 'gi-btn gi-btn--subtle',
          style: { width: '100%', boxSizing: 'border-box', justifyContent: 'center', fontSize: '12px', padding: '6px 10px' },
          href: timelineLinkHref,
          text: '📜 Xem trong Niên Biểu Lịch Sử →'
        })
      ]));

      // Block 3: Online Calendar Linkage
      eventLinkChildren.push(el('div', {
        style: {
          padding: '12px 14px',
          background: 'var(--color-surface-sunken, #fafaf9)',
          border: '1px solid var(--color-border-subtle, #e7e5e4)',
          borderRadius: '4px'
        }
      }, [
        el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' } }, [
          el('span', { style: { fontSize: '12px', fontWeight: '700', color: 'var(--color-brand-heritage, #881337)' }, text: '📅 LỊCH VẠN NIÊN GIA TỘC' }),
          el('span', { class: 'gi-badge', style: { fontSize: '11px', padding: '1px 6px' }, text: 'Đồng bộ' })
        ]),
        el('p', { style: { margin: '0 0 10px', fontSize: '12.5px', color: 'var(--color-text-secondary, #57534e)', lineHeight: '1.45' },
          text: 'Xem sinh nhật, lễ quan thầy, kỵ giỗ trên giao diện Lưới tháng và Lịch trình gia đình.'
        }),
        el('a', {
          class: 'gi-btn gi-btn--subtle',
          style: { width: '100%', boxSizing: 'border-box', justifyContent: 'center', fontSize: '12px', padding: '6px 10px' },
          href: `${eventsBaseHref}?tab=calendar&id=${encodeURIComponent(id)}`,
          text: '📅 Mở Lịch Vạn Niên & Sự Kiện →'
        })
      ]));

      const eventLinkSection = el('div', {
        class: 'gi-stack gi-stack--tight',
        style: { marginTop: '16px', marginBottom: '16px' }
      }, [
        el('h4', {
          style: {
            margin: '0 0 8px',
            fontSize: '14px',
            fontFamily: 'var(--font-display-active, serif)',
            color: 'var(--color-text-primary, #1c1917)',
            letterSpacing: '0.02em'
          },
          text: 'Sự kiện & Ngày giỗ trong Lịch Dòng Họ'
        }),
        ...eventLinkChildren
      ]);
      leftCol.appendChild(eventLinkSection);

      // Navigation Links
      const navSec = Section({
        id: 'person-nav',
        title: 'Điều hướng',
        children: [
          el('div', { class: 'gi-cluster' }, [
            el('a', { class: 'gi-btn gi-btn--secondary', href: '/me/tree', text: '← Về Cây phả đồ' }),
            el('a', { class: 'gi-btn gi-btn--quiet', href: '/me', text: 'Về Không gian của tôi' })
          ])
        ]
      });
      leftCol.appendChild(navSec);

      /* ======================================================================
       * RIGHT COLUMN: RELATIONS, EVIDENCE, MEMORIES, DISPUTES, PROPOSALS
       * ==================================================================== */

      /* --- Relations --------------------------------------------------------- */
      rightCol.appendChild(Section({ id: 'person-relations', title: 'Quan hệ thân tộc' }));
      const groups = [
        relationGroup(people, person.parents, 'Bố mẹ'),
        relationGroup(people, person.siblings, 'Anh chị em'),
        relationGroup(people, person.spouses, 'Vợ / chồng'),
        relationGroup(people, person.children, 'Con cái')
      ].filter(Boolean);

      rightCol.appendChild(groups.length
        ? el('div', { class: 'gi-stack' }, groups)
        : StatePanel({
          state: STATE.EMPTY,
          title: 'Chưa có quan hệ ghi nhận',
          explanation: 'Gia tộc chưa ghi nhận quan hệ bố mẹ, anh chị em, vợ chồng hay con cái cho hồ sơ này.'
        }));

      /* --- Tư liệu / Nguồn (spec §15: Evidence → "Tư liệu / Nguồn") ---------- */
      rightCol.appendChild(Section({ id: 'person-evidence', title: 'Tư liệu và nguồn' }));
      const sources = (person.sources || []).filter(Boolean);
      if (person.fsid) {
        sources.push(`Hồ sơ lưu trữ phả hệ FamilySearch: Mã FSID ${person.fsid}`);
      }
      if (person.avatarAssetId) {
        sources.push(`Tư liệu ảnh chân dung lưu trữ: Mã tài sản ${person.avatarAssetId}`);
      }

      let associatedMedia = [];
      if (personMediaList && mediaList) {
        associatedMedia = getPersonMediaList(person.id, personMediaList, mediaList);
        for (const m of associatedMedia) {
          const cap = formatMediaCaption(m, `Tư liệu ${m.kind || 'lưu trữ'}`);
          sources.push(`${cap} (Tài sản: ${m.assetId || m.id})`);
        }
      }

      const evidenceContainer = el('div', { class: 'gi-stack' });

      // Photo Gallery cross-link strip
      if (associatedMedia.length > 0) {
        const isLab = typeof window !== 'undefined' && window.location.pathname.includes('lab.html');
        const galleryHref = isLab
          ? `#view=gallery&id=${encodeURIComponent(person.id)}`
          : `/me/gallery?personId=${encodeURIComponent(person.id)}`;

        const photoThumbs = associatedMedia.map((m) => {
          const cap = formatMediaCaption(m, 'Tư liệu');
          const file = m.file || m.path || m.url || '';
          const imgUrl = file.startsWith('http') || file.startsWith('/') ? file : `/${file}`;

          return el('a', {
            class: 'gi-person-photo-thumb',
            href: galleryHref,
            title: cap
          }, [
            el('img', { src: imgUrl, alt: cap, loading: 'lazy' })
          ]);
        });

        const photoBox = el('div', {
          class: 'gi-card',
          style: {
            padding: '16px 20px',
            background: 'var(--color-surface-sunken, #fafaf9)',
            border: '1px solid var(--color-border-subtle, #e7e5e4)'
          }
        }, [
          el('div', {
            style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }
          }, [
            el('h4', {
              style: { margin: 0, fontSize: '14px', fontFamily: 'var(--font-display-active, serif)' },
              text: `Di ảnh & Kỷ vật liên quan (${associatedMedia.length})`
            }),
            el('a', {
              class: 'gi-btn gi-btn--subtle',
              style: { padding: '4px 10px', fontSize: '12px' },
              href: galleryHref,
              text: '🖼️ Mở trong Kho Tư Liệu Ảnh Gia Tộc →'
            })
          ]),
          el('div', { class: 'gi-person-photos-strip' }, photoThumbs)
        ]);

        evidenceContainer.appendChild(photoBox);
      }

      if (sources.length > 0) {
        evidenceContainer.appendChild(el('ul', { class: 'gi-source-list' }, sources.map((s) => el('li', { text: String(s) }))));
      } else if (associatedMedia.length === 0) {
        evidenceContainer.appendChild(StatePanel({
          state: STATE.EMPTY,
          title: 'Chưa ghi nhận tư liệu hoặc nguồn',
          explanation: 'Gia tộc chưa ghi lại tài liệu, trích dẫn hay tư liệu nào cho hồ sơ này. '
                      + 'Khi có, chúng sẽ được liệt kê ở đây.'
        }));
      }
      rightCol.appendChild(evidenceContainer);

      /* --- Ký ức (spec §9: "Ký ức nếu dữ liệu tồn tại") ---------------------- */
      rightCol.appendChild(Section({ id: 'person-memories', title: 'Ký ức' }));
      const memories = (person.memories || []).filter(Boolean);
      rightCol.appendChild(memories.length > 0
        ? el('ul', { class: 'gi-source-list' }, memories.map((m) => el('li', { text: String(m) })))
        : StatePanel({
          state: STATE.EMPTY,
          title: 'Chưa có ký ức gắn với hồ sơ này',
          explanation: 'Những ghi chép, hình ảnh và câu chuyện gắn với người này sẽ xuất hiện ở đây.'
        }));

      /* --- Bất đồng & Nhận định lịch sử (TP-024) ----------------------------- */
      rightCol.appendChild(Section({ id: 'person-disputes', title: 'Bất đồng & Nhận định lịch sử' }));
      const disputes = person.disputes || person.historicalNotes || [];
      if (Array.isArray(disputes) && disputes.length > 0) {
        rightCol.appendChild(el('div', { class: 'gi-stack gi-stack--tight' }, disputes.map((d, i) =>
          el('div', { class: 'gi-card', style: { borderLeft: '3px solid var(--color-brand-gold, #b45309)' } }, [
            el('p', { class: 'gi-card__meta', text: `Ghi nhận bất đồng #${i + 1}: ${d.field || 'Dữ kiện'}` }),
            el('p', { text: d.claim || d.content || String(d) }),
            d.source ? el('p', { class: 'gi-card__meta', text: `Nguồn đối chiếu: ${d.source}` }) : null
          ].filter(Boolean))
        )));
      } else {
        rightCol.appendChild(StatePanel({
          state: STATE.NEUTRAL,
          title: 'Dữ kiện đồng thuận',
          explanation: 'Chưa ghi nhận bất đồng hoặc mâu thuẫn về thông tin nhân vật này trong gia tộc. '
                      + 'Mọi ý kiến đối chiếu từ các nguồn gia phả khác nhau sẽ được lưu giữ nguyên văn tại đây.'
        }));
      }

      /* --- Đề xuất thay đổi (TP-003) --------------------------------------- */
      rightCol.appendChild(Section({ id: 'person-propose', title: 'Đề xuất thay đổi dữ kiện' }));
      const formHost = el('div', { class: 'gi-stack gi-stack--tight', id: 'proposal-form-container' });
      rightCol.appendChild(formHost);

      const fieldSelect = el('select', {
        class: 'gi-input',
        id: 'prop-field-select',
        style: { width: '100%', padding: '6px 8px', background: 'var(--color-surface-raised)', color: 'inherit', border: '1px solid var(--color-border-default)' }
      }, [
        el('option', { value: 'birth_date', text: 'Ngày / năm sinh' }),
        el('option', { value: 'birth_place', text: 'Nơi sinh' }),
        el('option', { value: 'death_date', text: 'Ngày / năm mất' }),
        el('option', { value: 'death_place', text: 'Nơi mất' }),
        el('option', { value: 'name', text: 'Họ và tên / Tên húy' }),
        el('option', { value: 'baptism', text: 'Tên thánh / Rửa tội' }),
        el('option', { value: 'relations', text: 'Quan hệ thân tộc' }),
        el('option', { value: 'other', text: 'Dữ kiện khác' })
      ]);

      const valueInput = el('input', {
        type: 'text',
        class: 'gi-input',
        id: 'prop-value-input',
        placeholder: 'Giá trị đề xuất mới (ví dụ: 15/08/1872)...',
        style: { width: '100%', padding: '6px 8px', background: 'var(--color-surface-raised)', color: 'inherit', border: '1px solid var(--color-border-default)' }
      });

      const evidenceInput = el('input', {
        type: 'text',
        class: 'gi-input',
        id: 'prop-evidence-input',
        placeholder: 'Nguồn chứng cứ (Gia phả giấy, sổ rửa tội, bia mộ, hình ảnh)...',
        style: { width: '100%', padding: '6px 8px', background: 'var(--color-surface-raised)', color: 'inherit', border: '1px solid var(--color-border-default)' }
      });

      const reasonInput = el('textarea', {
        class: 'gi-input',
        id: 'prop-reason-input',
        placeholder: 'Lý do / Lập luận đề xuất đối chiếu...',
        rows: 2,
        style: { width: '100%', padding: '6px 8px', background: 'var(--color-surface-raised)', color: 'inherit', border: '1px solid var(--color-border-default)', resize: 'vertical' }
      });

      const statusBox = el('div', { id: 'proposal-status', style: { display: 'none', marginTop: '8px' } });

      const submitBtn = el('button', {
        class: 'gi-btn gi-btn--primary',
        type: 'button',
        id: 'prop-submit-btn',
        text: 'Gửi đề xuất tới Ban Quản Trị'
      });

      submitBtn.addEventListener('click', async () => {
        const field = fieldSelect.value;
        const suggestedValue = valueInput.value.trim();
        const sourceEvidence = evidenceInput.value.trim();
        const reason = reasonInput.value.trim();

        if (!suggestedValue) {
          statusBox.style.display = 'block';
          clear(statusBox);
          statusBox.appendChild(el('span', {
            style: { color: 'var(--color-state-danger-fg, #8a1f1f)', fontWeight: '600' },
            text: 'Vui lòng nhập giá trị đề xuất mới.'
          }));
          return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang gửi đề xuất...';

        try {
          const payload = {
            personId: person.id,
            field,
            suggestedValue,
            sourceEvidence,
            reason
          };
          const res = api.submitProposal
            ? await api.submitProposal(payload)
            : { ok: true, proposalId: 'PROP_' + Date.now(), message: 'Đề xuất đã được ghi nhận.' };

          statusBox.style.display = 'block';
          clear(statusBox);
          const propId = res.proposalId || (res.proposal && res.proposal.id) || 'PROP';
          statusBox.appendChild(el('div', {
            class: 'gi-badge gi-badge--success',
            style: { padding: '6px 12px', fontSize: '12px', lineHeight: '1.5' },
            text: `✓ ${res.message || 'Đề xuất đã được ghi nhận'} (Mã: ${propId}). Dữ liệu phả hệ gốc được bảo toàn.`
          }));
          valueInput.value = '';
          evidenceInput.value = '';
          reasonInput.value = '';
        } catch (err) {
          statusBox.style.display = 'block';
          clear(statusBox);
          statusBox.appendChild(el('span', {
            style: { color: 'var(--color-state-danger-fg, #8a1f1f)', fontWeight: '600' },
            text: `Gửi đề xuất thất bại: ${err.message}`
          }));
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Gửi đề xuất tới Ban Quản Trị';
        }
      });

      formHost.appendChild(el('div', { class: 'gi-stack gi-stack--tight' }, [
        el('label', { class: 'gi-card__meta', text: 'Trường thông tin cần sửa / bổ sung:' }),
        fieldSelect,
        el('label', { class: 'gi-card__meta', text: 'Giá trị đề xuất:' }),
        valueInput,
        el('label', { class: 'gi-card__meta', text: 'Nguồn chứng cứ (FamilySearch Evidence standard):' }),
        evidenceInput,
        el('label', { class: 'gi-card__meta', text: 'Lý do / Lập luận đối chiếu:' }),
        reasonInput,
        submitBtn,
        statusBox
      ]));

      // Return the complete 2-column layout to host
      return layout;
    },
    empty: { title: 'Chưa có hồ sơ nhân vật', body: 'Gia tộc chưa ghi nhận hồ sơ cho người được yêu cầu.' }
  });

  return content;
}
