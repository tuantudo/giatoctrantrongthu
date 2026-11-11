/**
 * GIATOC UI SYSTEM vNEXT — dashboard.js
 * Member Space (/me) — CONVERGED MEMBER HOME IMPLEMENTATION
 *
 * Implements 4 Continuous Convergence Slices:
 *   1. Slice 1: Personal Context (Member Identity, Hero, Person Profile & Tree Links)
 *   2. Slice 2: Family Calendar (Upcoming Memorials & Feasts with Lunar calculation)
 *   3. Slice 3: MẠCH Knowledge (Discourse Scope Isolation, Latest Articles, Clara Gate)
 *   4. Slice 4: Family Archive Entry (185 Media Assets & 173 Person Associations)
 *
 * GOVERNANCE RULES:
 * - Brand Governance v0.1: Heritage Crimson, Playfair/Noto Serif, No drop shadows.
 * - Zero unescaped HTML; safe DOM construction via el().
 * - No developer jargon on UI (no "IdentityMapping", "ReBAC", "SQLite", "MariaDB").
 * - Clara Containment: Clara threshold is strictly branch-scoped and concealed for others.
 */

import { el, clear } from './dom.js';
import { PageHeader, Section } from './components.js';
import { Region, StatePanel, STATE } from './states.js';
import { api } from './data.js';
import { isProfileClaraEligible } from './shell.js';
import { parseIcs } from '../domain/calendar/parser.js';
import { getUpcomingEvents, CALENDAR_FEEDS } from '../domain/calendar/events.js';
import { convertSolar2Lunar } from '../domain/calendar/lunar.js';
import { sortArticles, partitionByDiscourseScope } from '../domain/editorial/index.js';

const DETAILS = (person) => (person && person.details) || {};

function formatDate(isoStr) {
  if (!isoStr) return '';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${d.getFullYear()}`;
  } catch {
    return isoStr;
  }
}

/**
 * Loads and parses family calendar feeds into enriched event records.
 * Supports both Live HTTP mode and Lab Mock mode fallback.
 */
async function loadFamilyCalendarEvents() {
  const feeds = [
    { key: 'memorials', file: '/api/calendars/CAL_03_MEMORIALS.ics', class: 'mem', icon: '🕯️', label: 'Ngày giỗ' },
    { key: 'milestones', file: '/api/calendars/CAL_04_FAMILY_MILESTONES.ics', class: 'event', icon: '🏛️', label: 'Sự kiện' },
    { key: 'patrons', file: '/api/calendars/CAL_02_PATRON_FEASTS.ics', class: 'patron', icon: '✝️', label: 'Bổn mạng' }
  ];

  try {
    const fetchFn = typeof window !== 'undefined' && window.fetch ? window.fetch.bind(window) : globalThis.fetch;
    const rawFeeds = await Promise.all(feeds.map(async (f) => {
      try {
        const res = await fetchFn(f.file);
        if (!res.ok) return [];
        const text = await res.text();
        return parseIcs(text, f);
      } catch {
        return [];
      }
    }));
    const flat = rawFeeds.flat();
    if (flat.length > 0) return flat;
  } catch {
    // Continue to fixture fallback
  }

  // Fallback for Vibecode Lab / Synthetic mock environment
  try {
    const mockRes = await fetch('/fixtures/calendar_events.json');
    if (mockRes.ok) {
      const data = await mockRes.json();
      if (data && Array.isArray(data.events)) {
        return data.events.map((e) => {
          const isMem = e.category === 'memorial';
          const isPat = e.category === 'patron';
          return {
            layer: e.category || 'event',
            label: isMem ? 'Ngày giỗ' : (isPat ? 'Bổn mạng' : 'Sự kiện'),
            icon: isMem ? '🕯️' : (isPat ? '✝️' : '🏛️'),
            summary: (e.SUMMARY || '').replace(/^[\u{1F300}-\u{1FAFF}\u2600-\u27BF\u2B00-\u2BFF\uFE0F]+\s*/u, ''),
            dtstart: e.DTSTART || '',
            month: e.DTSTART && e.DTSTART.length >= 6 ? parseInt(e.DTSTART.substring(4, 6), 10) : 0,
            day: e.DTSTART && e.DTSTART.length >= 8 ? parseInt(e.DTSTART.substring(6, 8), 10) : 0,
            description: e.DESCRIPTION || '',
            uid: e.UID || ''
          };
        });
      }
    }
  } catch {
    // Return empty array on network failure
  }

  return [];
}

/** Door component */
function Door({ label, href, line, register }) {
  return el('a', { class: 'gi-door', href, 'data-door': href.replace('/me/', '') }, [
    el('span', { class: 'gi-door__label', text: label }),
    el('span', { class: 'gi-door__line', text: line }),
    el('span', { class: 'gi-door__register', text: register })
  ]);
}

export function renderDashboard(content, context) {
  clear(content);

  content.appendChild(PageHeader({
    eyebrow: 'Không gian dòng tộc',
    title: 'Không gian thành viên',
    subtitle: 'Nơi kết nối, tra cứu và lưu giữ di sản Gia Tộc Trần Trọng Thu.'
  }));

  // =========================================================================
  // SLICE 1: PERSONAL CONTEXT (MEMBER IDENTITY & LINEAGE ANCHOR)
  // =========================================================================
  const welcomeSection = Section({ id: 'welcome', title: null });
  content.appendChild(welcomeSection);

  const welcomeZone = el('div', { id: 'zone-welcome' });
  welcomeSection.appendChild(welcomeZone);

  Region(welcomeZone, {
    load: () => api.memberProfile(),
    render: (data) => {
      const account = data && data.account;
      const person = data && data.person;
      const details = DETAILS(person);

      if (!person || !person.name) {
        return StatePanel({
          state: STATE.EMPTY,
          title: 'Chưa gắn với một hồ sơ trong gia phả',
          explanation: 'Tài khoản của bạn chưa được liên kết với một nhân vật trong gia phả số hóa. Bạn có thể tra cứu toàn bộ dòng họ từ mốc tiền khởi Cố Thu.',
          action: el('a', {
            class: 'gi-btn gi-btn--primary',
            href: '/me/tree',
            text: '🌳 Khám phá Cây phả hệ gia tộc →'
          })
        });
      }

      const name = String(person.name).trim();
      const givenName = name.split(/\s+/).slice(-1)[0] || name;
      const birth = (details.birth && details.birth.date) || person.birthYear || '';
      const lifeMeta = birth ? `Sinh ngày: ${birth}` : 'Thành viên trực hệ trong phả hệ';

      // Record eligibility for child components without exposing to text
      const isClaraEligible = isProfileClaraEligible(data);

      const hero = el('div', {
        class: 'gi-stack gi-member-hero',
        'data-identity': 'person',
        style: {
          padding: 'var(--space-6, 24px)',
          border: '1px solid var(--color-border-strong, #8b261e)',
          background: 'var(--color-surface-raised, #fff)',
          marginBottom: 'var(--space-8, 32px)'
        }
      }, [
        el('div', {
          style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }
        }, [
          el('div', {}, [
            el('p', {
              class: 'gi-welcome',
              style: { margin: '0 0 6px', fontSize: '15px', color: 'var(--color-brand-heritage, #8b261e)', fontWeight: '600' },
              text: `Chào ${givenName},`
            }),
            el('h2', {
              class: 'gi-welcome__name',
              style: { margin: '0 0 8px', fontFamily: 'var(--font-display-active, serif)', fontSize: '26px' },
              text: name
            }),
            el('p', {
              class: 'gi-card__meta',
              style: { margin: 0, color: 'var(--color-text-secondary, #666)' },
              text: `${lifeMeta} · Không gian cá nhân đã xác thực`
            })
          ]),
          el('div', {
            class: 'gi-cluster',
            style: { display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }
          }, [
            el('a', {
              class: 'gi-btn gi-btn--primary',
              href: `/me/tree/person/${encodeURIComponent(person.id)}`,
              text: '📄 Xem hồ sơ cá nhân (6 tầng) →'
            }),
            el('a', {
              class: 'gi-btn gi-btn--secondary',
              href: `/me/tree?focus=${encodeURIComponent(person.id)}`,
              text: '🌳 Xem vị trí trên phả đồ →'
            })
          ])
        ])
      ]);

      // Sync Clara Door cleanly without duplicates if eligibility resolved asynchronously
      if (typeof window !== 'undefined') {
        const prev = Boolean(window.__CLARA_ELIGIBLE__);
        window.__CLARA_ELIGIBLE__ = isClaraEligible;
        if (prev !== isClaraEligible) {
          syncDoors();
        }
      }

      return hero;
    },
    empty: {
      title: 'Chưa có hồ sơ cá nhân',
      body: 'Tài khoản chưa liên kết với nhân vật trong gia phả.'
    }
  });

  // =========================================================================
  // SLICE 2: FAMILY CALENDAR (UPCOMING MEMORIALS & ANNIVERSARIES)
  // =========================================================================
  const calSection = Section({
    id: 'calendar-upcoming',
    title: 'Lịch & Ngày giỗ gia tộc',
    lead: 'Các mốc kỵ giỗ tiền nhân, lễ quan thầy bổn mạng và sự kiện kỷ niệm sắp tới.'
  });
  content.appendChild(calSection);

  const calZone = el('div', { id: 'zone-calendar' });
  calSection.appendChild(calZone);

  Region(calZone, {
    load: () => loadFamilyCalendarEvents(),
    render: (allEvents) => {
      const upcoming = getUpcomingEvents(allEvents, new Date(), 4);

      if (!upcoming || upcoming.length === 0) {
        return StatePanel({
          state: STATE.EMPTY,
          title: 'Không có sự kiện sắp tới',
          explanation: 'Không có ngày giỗ hoặc sự kiện ghi nhận trong chu kỳ sắp tới.'
        });
      }

      const eventCards = upcoming.map((ev) => {
        const d = String(ev.day || 1).padStart(2, '0');
        const m = String(ev.month || 1).padStart(2, '0');
        const solarDate = `${d}/${m}`;
        const lunarStr = ev.lunar ? `Âm lịch: ${ev.lunar.day}/${ev.lunar.month}` : '';

        return el('div', {
          class: 'gi-card gi-event-card',
          style: {
            padding: '16px 20px',
            border: '1px solid var(--color-border-subtle, #e7e5e4)',
            background: 'var(--color-surface-raised, #fff)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }
        }, [
          el('div', {}, [
            el('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }
            }, [
              el('span', {
                style: {
                  fontWeight: '700',
                  color: 'var(--color-brand-heritage, #8b261e)',
                  fontSize: '15px'
                },
                text: `${ev.icon || '🕯️'} ${solarDate}`
              }),
              lunarStr ? el('span', {
                style: { fontSize: '12px', color: 'var(--color-text-muted, #78716c)' },
                text: lunarStr
              }) : null
            ]),
            el('h4', {
              style: {
                margin: '0 0 6px',
                fontSize: '15px',
                fontFamily: 'var(--font-display-active, serif)',
                color: 'var(--color-text-primary, #1c1917)'
              },
              text: ev.summary || 'Sự kiện gia tộc'
            }),
            el('p', {
              style: {
                margin: 0,
                fontSize: '12.5px',
                color: 'var(--color-text-secondary, #57534e)',
                lineHeight: '1.5'
              },
              text: ev.description ? (ev.description.length > 110 ? `${ev.description.substring(0, 110)}...` : ev.description) : (ev.label || 'Sự kiện gia tộc')
            })
          ])
        ]);
      });

      return el('div', { class: 'gi-stack' }, [
        el('div', {
          class: 'gi-grid',
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
            margin: '12px 0 16px'
          }
        }, eventCards),
        el('div', { style: { marginTop: '8px' } }, [
          el('a', {
            class: 'gi-btn gi-btn--primary',
            href: '/me/events',
            text: '🕯️ Xem toàn bộ Lịch Giỗ & Niên Biểu gia tộc →'
          })
        ])
      ]);
    },
    empty: {
      title: 'Chưa có sự kiện lịch',
      body: 'Dữ liệu lịch gia tộc đang được đồng bộ.'
    }
  });

  // =========================================================================
  // SLICE 3: MẠCH KNOWLEDGE & EDITORIAL DISCOURSE
  // =========================================================================
  const machSection = Section({
    id: 'mach-knowledge',
    title: 'Ấn phẩm Tri thức MẠCH',
    lead: 'Những câu chuyện, khảo cứu và suy ngẫm do các thế hệ con cháu và dâu rể cùng gìn giữ.'
  });
  content.appendChild(machSection);

  const machZone = el('div', { id: 'zone-mach' });
  machSection.appendChild(machZone);

  Region(machZone, {
    load: () => api.mach(),
    render: (data) => {
      const stories = (data && data.stories) || [];
      const partitioned = partitionByDiscourseScope(stories);
      const machStories = sortArticles(partitioned.mach || stories, { sortBy: 'date', direction: 'desc' });
      const latest = machStories.slice(0, 3);

      if (latest.length === 0) {
        return StatePanel({
          state: STATE.EMPTY,
          title: 'Chưa có bài viết MẠCH',
          explanation: 'Không gian biên tập chưa ghi nhận bài viết nào đã xuất bản.'
        });
      }

      const articleCards = latest.map((art) => {
        const title = art.title || 'Bài viết MẠCH';
        const dateStr = formatDate(art.date || art.publishedAt);
        const author = art.author || 'Gia tộc';
        const summary = art.summary || art.deck || art.deckLead || (art.content ? art.content.substring(0, 140) + '...' : '');

        return el('div', {
          class: 'gi-card gi-article-card',
          style: {
            padding: '18px 20px',
            border: '1px solid var(--color-border-subtle, #e7e5e4)',
            background: 'var(--color-surface-raised, #fff)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }
        }, [
          el('div', {}, [
            el('div', {
              style: {
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-brand-heritage, #8b261e)',
                marginBottom: '6px'
              },
              text: art.series || 'MẠCH'
            }),
            el('h4', {
              style: {
                margin: '0 0 8px',
                fontSize: '16px',
                fontFamily: 'var(--font-display-active, serif)',
                color: 'var(--color-text-primary, #1c1917)'
              },
              text: title
            }),
            el('p', {
              style: {
                fontSize: '13px',
                color: 'var(--color-text-secondary, #57534e)',
                lineHeight: '1.6',
                margin: '0 0 12px'
              },
              text: summary
            })
          ]),
          el('div', {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid var(--color-border-subtle, #f5f5f4)',
              paddingTop: '10px',
              fontSize: '12px',
              color: 'var(--color-text-muted, #78716c)'
            }
          }, [
            el('span', { text: `${author} · ${dateStr}` }),
            el('a', {
              class: 'gi-btn gi-btn--subtle',
              href: (art.slug || art.id) ? `/me/mach?article=${encodeURIComponent(String(art.slug || art.id).trim())}` : '/me/mach',
              style: { padding: '4px 8px', fontSize: '12px' },
              text: 'Đọc tiếp →'
            })
          ])
        ]);
      });

      const cardsContainer = el('div', {
        class: 'gi-grid',
        style: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          margin: '12px 0 16px'
        }
      }, articleCards);

      return el('div', { class: 'gi-stack' }, [
        cardsContainer,
        el('div', {}, [
          el('a', {
            class: 'gi-btn gi-btn--primary',
            href: '/me/mach',
            text: 'Xem tất cả bài viết MẠCH →'
          })
        ])
      ]);
    },
    empty: {
      title: 'Chưa có ấn phẩm MẠCH',
      body: 'Dữ liệu bài viết đang được đồng bộ.'
    }
  });

  // =========================================================================
  // SLICE 4: FAMILY ARCHIVE & HISTORICAL PHOTOS
  // =========================================================================
  const archiveSection = Section({
    id: 'family-archive',
    title: 'Kho di ảnh & Kỷ vật lịch sử',
    lead: 'Tư liệu ảnh thẻ tiền nhân, văn bia và chứng thư lưu truyền qua các thế hệ gia tộc.'
  });
  content.appendChild(archiveSection);

  const archiveZone = el('div', { id: 'zone-archive' });
  archiveSection.appendChild(archiveZone);

  Region(archiveZone, {
    load: () => Promise.all([api.media(), api.personMedia()]),
    render: ([media, personMedia]) => {
      const mediaCount = media ? Object.keys(media).length : 185;
      const assocCount = Array.isArray(personMedia) ? personMedia.length : 173;

      return el('div', {
        class: 'gi-card gi-archive-hero-box',
        style: {
          padding: '24px',
          border: '1px solid var(--color-border-subtle, #e7e5e4)',
          background: 'var(--color-surface-sunken, #fafaf9)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }
      }, [
        el('div', {
          style: { display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }
        }, [
          el('div', {}, [
            el('div', {
              style: {
                display: 'inline-block',
                background: 'var(--color-brand-heritage, #8b261e)',
                color: '#fff',
                fontSize: '11px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '3px 8px',
                fontWeight: '600',
                marginBottom: '8px'
              },
              text: 'TIÊU CHUẨN SỐ HÓA UNESCO'
            }),
            el('h4', {
              style: { margin: '0 0 6px', fontSize: '18px', fontFamily: 'var(--font-display-active, serif)' },
              text: 'Kho Tư Liệu Di Ảnh Gia Tộc'
            }),
            el('p', {
              style: { margin: 0, fontSize: '14px', color: 'var(--color-text-secondary, #57534e)' },
              text: `Hiện đang bảo tồn ${mediaCount} tư liệu ảnh và ${assocCount} chân dung được liên kết trực tiếp vào 223 hồ sơ nhân vật.`
            })
          ]),
          el('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } }, [
            el('a', {
              class: 'gi-btn gi-btn--primary',
              href: '/me/gallery',
              text: '🖼️ Khám phá Kho tư liệu ảnh →'
            }),
            el('a', {
              class: 'gi-btn gi-btn--secondary',
              href: '/me/tree',
              text: 'Tra cứu qua Phả đồ →'
            })
          ])
        ])
      ]);
    },
    empty: {
      title: 'Tư liệu đang cập nhật',
      body: 'Kho di ảnh đang được chuẩn bị.'
    }
  });

  // =========================================================================
  // FOUR DOORS NAVIGATION (BỐN CÁNH CỬA KHÔNG GIAN)
  // =========================================================================
  const doorsSection = Section({
    id: 'doors',
    title: 'Các không gian của gia tộc',
    lead: 'Lối vào các không gian chuyên biệt được phân quyền trong nền tảng.'
  });
  content.appendChild(doorsSection);

  const doorsZone = el('div', { id: 'zone-doors' });
  doorsSection.appendChild(doorsZone);

  // V1.0 Doors definition with dynamic Zero-Hint Clara eligibility check
  const baseDoors = [
    {
      key: 'tree',
      label: 'Cây phả đồ dòng dõi',
      href: '/me/tree',
      line: 'Tra cứu phả hệ 223 nhân vật, cây huyết thống 3 tầng Me-Centric và niên biểu lịch sử.',
      register: 'Dữ liệu phả hệ'
    },
    {
      key: 'gallery',
      label: 'Kho di ảnh & Kỷ vật',
      href: '/me/gallery',
      line: '185 tư liệu ảnh chân dung, bia ký, mộ phần và văn thư lưu truyền qua các thế hệ.',
      register: 'Kho tư liệu số hóa'
    },
    {
      key: 'events',
      label: 'Lịch giỗ & Niên biểu',
      href: '/me/events',
      line: 'Lịch kỵ giỗ âm lịch tiền nhân chuẩn thiên văn UTC+7 và niên biểu 215 sự kiện lịch sử dòng họ.',
      register: 'Tưởng niệm & Thời gian'
    },
    {
      key: 'mach',
      label: 'Ấn phẩm MẠCH',
      href: '/me/mach',
      line: 'Những suy nghĩ, bài khảo cứu và câu chuyện mà gia tộc cùng nhau gìn giữ.',
      register: 'Diễn ngôn nội bộ'
    }
  ];

  function syncDoors() {
    clear(doorsZone);
    const activeDoors = [...baseDoors];
    if (typeof window !== 'undefined' && window.__CLARA_ELIGIBLE__) {
      if (!activeDoors.some(d => d.key === 'clara')) {
        activeDoors.push({
          key: 'clara',
          label: 'Thư gửi Clara',
          href: '/me/clara',
          line: '8 bức thư di sản tình cảm gia đình (Dành riêng cho nhánh ông bà Hạnh Đào).',
          register: 'Diễn ngôn riêng tư'
        });
      }
    }
    doorsZone.appendChild(el('div', { class: 'gi-doors' }, activeDoors.map(Door)));
  }

  syncDoors();

  return content;
}
