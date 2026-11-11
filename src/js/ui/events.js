/**
 * GIATOC UI SYSTEM vNEXT — events.js
 * Increment 03B: Unified Family Calendar, Memorials, Timeline & Device Sync System
 *
 * Inherited from Vercel #/lich & Re-architected under Brand Governance v0.1:
 *  1. Lịch Vạn Niên & Sự Kiện (Online Family Calendar):
 *     - Month Grid View (Lưới tháng) & Agenda View (Danh sách lịch trình)
 *     - Astronomical lunisolar sync for every solar day (Can Chi, leap months)
 *     - 4 event layers: Sinh nhật (118), Bổn mạng (115), Ngày giỗ (28), Mốc kỷ niệm (4)
 *     - Entity deep-linking to Person Profile (/me/tree/person/:id)
 *  2. Lịch Kỵ Giỗ Tiền Nhân (Memorial Calendar):
 *     - 28 deceased ancestors strictly classified across 3 epistemic tiers:
 *         * ĐÃ XÁC MINH (12 tiền nhân ngày mất chính xác)
 *         * CẦN KIỂM CHỨNG (6 tiền nhân chỉ ghi nhận năm mất)
 *         * CHƯA XÁC ĐỊNH (10 tiền nhân chưa rõ ngày; tuyệt đối không dùng ngày giả định 01/01)
 *  3. Niên Biểu Lịch Sử (Historical Timeline):
 *     - 219 stream events (1872 - present) with family milestones
 *  4. Đồng Bộ Lịch Thiết Bị (Add to Phone & Subscriptions):
 *     - Apple Calendar 1-click via webcal:// protocol (iOS / iPadOS / macOS)
 *     - Google Calendar 1-click web subscription & Android instructions
 *     - Microsoft Outlook & Direct .ics download for offline import
 *
 * Brand Governance v0.1: Heritage Crimson, Dó paper, serif display, institutional restraint.
 */

import { el, clear } from './dom.js';
import { PageHeader, Section } from './components.js';
import { StatePanel, STATE, Region } from './states.js';
import { api } from './data.js';
import {
  parseIcs,
  CALENDAR_FEEDS,
  convertSolar2Lunar,
  convertLunar2Solar,
  formatLunarDate,
  getYearCanChi
} from '../domain/calendar/index.js';

/**
 * Parse date string in format dd/mm/yyyy or dd-mm-yyyy or yyyy.
 */
export function parseDateString(str) {
  if (!str || typeof str !== 'string') return null;
  const trimmed = str.trim();

  const dmyMatch = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10);
    const year = parseInt(dmyMatch[3], 10);
    return { day, month, year, isExact: true };
  }

  const yearMatch = trimmed.match(/^(\d{4})$/);
  if (yearMatch) {
    const year = parseInt(yearMatch[1], 10);
    return { day: null, month: null, year, isExact: false };
  }

  return null;
}

/**
 * Calculate memorial anniversary date for a given death date and target year.
 */
export function calculateMemorialDate(deathDateStr, targetYear = 2026) {
  const parsed = parseDateString(deathDateStr);
  if (!parsed) return null;

  if (!parsed.isExact) {
    return {
      isExact: false,
      deathYear: parsed.year,
      originalDateText: deathDateStr,
      notes: `Chỉ ghi nhận năm mất (${parsed.year}), chưa rõ ngày âm lịch.`
    };
  }

  const originalLunar = convertSolar2Lunar(parsed.day, parsed.month, parsed.year, 7.0);
  let projectedSolar = convertLunar2Solar(originalLunar.day, originalLunar.month, targetYear, 0, 7.0);

  if (!projectedSolar && originalLunar.day === 30) {
    projectedSolar = convertLunar2Solar(29, originalLunar.month, targetYear, 0, 7.0);
  }

  const anniversaryCount = targetYear - parsed.year;

  return {
    isExact: true,
    deathYear: parsed.year,
    originalSolar: { day: parsed.day, month: parsed.month, year: parsed.year },
    originalDateText: deathDateStr,
    originalLunar,
    lunarDay: originalLunar.day,
    lunarMonth: originalLunar.month,
    projectedSolar,
    targetYear,
    anniversaryCount: anniversaryCount > 0 ? anniversaryCount : null,
    lunarDisplay: `Ngày ${String(originalLunar.day).padStart(2, '0')}/${String(originalLunar.month).padStart(2, '0')} Âm lịch`,
    solarDisplay: projectedSolar ? `${String(projectedSolar.day).padStart(2, '0')}/${String(projectedSolar.month).padStart(2, '0')}/${targetYear}` : ''
  };
}

/**
 * Extract all 28 deceased persons from canonical people records.
 */
function extractDeceasedPersons(peopleMap) {
  const list = [];
  for (const [id, person] of Object.entries(peopleMap || {})) {
    const deathDate = person.deathDate || (person.death && person.death.date) || person.deathYear || null;
    const isDead = person.isLiving === false || !!person.death || !!deathDate;
    if (isDead) {
      list.push({
        personId: id,
        personName: person.name || 'Tiền nhân',
        deathDate: deathDate ? String(deathDate).trim() : '',
        person
      });
    }
  }
  return list;
}

/**
 * Loads family calendar events from ICS feeds or fixture fallback.
 */
async function loadCalendarEvents() {
  try {
    const fetchFn = typeof window !== 'undefined' && window.fetch ? window.fetch.bind(window) : globalThis.fetch;
    const rawFeeds = await Promise.all(CALENDAR_FEEDS.map(async (f) => {
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
    // Fallback to fixture
  }

  // Fallback for Vibecode Lab / Synthetic mock environment
  try {
    const mockRes = await fetch('/fixtures/calendar_events.json');
    if (mockRes.ok) {
      const data = await mockRes.json();
      if (data && Array.isArray(data.events)) {
        return data.events.map((e) => {
          const cat = e.category || 'event';
          let feedMeta = CALENDAR_FEEDS.find(f => f.key === cat || f.class === cat) || CALENDAR_FEEDS[3];
          return {
            layer: feedMeta.key,
            label: feedMeta.label,
            icon: feedMeta.icon,
            chipCls: feedMeta.class,
            summary: (e.SUMMARY || '').replace(/^[\u{1F300}-\u{1FAFF}\u2600-\u27BF\u2B00-\u2BFF\uFE0F]+\s*/u, ''),
            dtstart: e.DTSTART || '',
            month: e.DTSTART && e.DTSTART.length >= 6 ? parseInt(e.DTSTART.substring(4, 6), 10) : 0,
            day: e.DTSTART && e.DTSTART.length >= 8 ? parseInt(e.DTSTART.substring(6, 8), 10) : 0,
            description: (e.DESCRIPTION || '').replace(/\\n/g, '\n'),
            uid: e.UID || '',
            fsid: (e.UID && e.UID.match(/([A-Z0-9]{4}-[A-Z0-9]{3,4})@/i)) ? e.UID.match(/([A-Z0-9]{4}-[A-Z0-9]{3,4})@/i)[1] : null
          };
        });
      }
    }
  } catch {
    // Return empty array
  }
  return [];
}

/**
 * Calendar URL generator helpers.
 */
function getAbsoluteFeedUrl(file) {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return new URL(file, window.location.origin).href;
  }
  return `https://giatoctrantrongthu.vercel.app${file}`;
}

function getWebcalUrl(file) {
  const httpUrl = getAbsoluteFeedUrl(file);
  return httpUrl.replace(/^https?:\/\//i, 'webcal://');
}

function getGoogleCalUrl(file) {
  const webcal = getWebcalUrl(file);
  return `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcal)}`;
}

/**
 * Render Main Events & Calendar Page
 */
export function renderEvents(content, context = {}) {
  clear(content);

  const isLab = typeof window !== 'undefined' && window.location.pathname.includes('lab.html');
  const backHref = isLab ? '#view=dashboard' : '/me';

  // Read URL query parameters for deep linking (search + hash query)
  const urlParams = (typeof window !== 'undefined' && window.location)
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams();

  let hashQuery = '';
  if (typeof window !== 'undefined' && window.location && window.location.hash) {
    const hash = window.location.hash;
    const qIdx = hash.indexOf('?');
    if (qIdx !== -1) hashQuery = hash.slice(qIdx + 1);
    else if (hash.includes('&')) hashQuery = hash.slice(hash.indexOf('&') + 1);
  }
  const hashParams = new URLSearchParams(hashQuery);

  const paramTab = urlParams.get('tab') || hashParams.get('tab');
  const paramId = urlParams.get('id') || hashParams.get('id');
  const monthVal = urlParams.get('month') || hashParams.get('month');
  const yearVal = urlParams.get('year') || hashParams.get('year');
  const paramMonth = monthVal ? parseInt(monthVal, 10) - 1 : null;
  const paramYear = yearVal ? parseInt(yearVal, 10) : null;

  // Page Header
  content.appendChild(PageHeader({
    eyebrow: 'Không gian tưởng niệm & Di sản',
    title: 'Lịch Giỗ & Niên Biểu Dòng Họ',
    subtitle: 'Hệ thống lịch gia đình trực tuyến, tính toán âm dương thiên văn, kỵ giỗ tiền nhân và đồng bộ lịch thiết bị di động.',
    back: { mode: 'hierarchy', href: backHref, label: 'Về Không gian của tôi' }
  }));

  const mainSection = Section({ id: 'events-main', title: null });
  content.appendChild(mainSection);

  const zone = el('div', { id: 'zone-events' });
  mainSection.appendChild(zone);

  // Initial State Management
  const now = new Date();
  let activeTab = paramTab || 'calendar'; // 'calendar' | 'memorials' | 'timeline' | 'subscribe'
  let curCalDate = new Date(paramYear || now.getFullYear(), paramMonth !== null ? paramMonth : now.getMonth(), 1);
  let calViewMode = 'month'; // 'month' | 'agenda'
  let calLayers = { birthdays: true, patrons: true, memorials: true, milestones: true };

  // Memorials state
  let targetYear = paramYear || 2026;

  // Timeline state
  let timelineTypeFilter = 'all'; // 'all' | 'birth' | 'death' | 'milestone'
  let timelineSearchQuery = '';
  let timelineSortOrder = 'asc';

  // Subscribe platform state
  let subPlatform = 'apple';
  if (typeof navigator !== 'undefined') {
    if (/Android/i.test(navigator.userAgent)) subPlatform = 'google';
    else if (/Windows/i.test(navigator.userAgent)) subPlatform = 'other';
  }

  Region(zone, {
    load: async () => {
      const [genealogyData, calendarEvents] = await Promise.all([
        api.genealogy(),
        loadCalendarEvents()
      ]);
      return { genealogyData, calendarEvents };
    },
    render: ({ genealogyData, calendarEvents }) => {
      const people = (genealogyData && genealogyData.people) || {};
      const timeline = (genealogyData && genealogyData.timeline) || [];

      // Extract all 28 deceased persons
      const allDeceased = extractDeceasedPersons(people);
      const verifiedExactDeceased = allDeceased.filter((d) => d.deathDate && d.deathDate.includes('/'));
      const needsVerificationDeceased = allDeceased.filter((d) => d.deathDate && !d.deathDate.includes('/') && /^\d{4}$/.test(d.deathDate));
      const unknownDateDeceased = allDeceased.filter((d) => !d.deathDate || d.deathDate === 'UNKNOWN' || d.deathDate.trim() === '');

      // Container for entire interface
      const container = el('div', { class: 'gi-stack', style: { gap: '20px' } });

      // Tab Switcher Bar (4 Unified Tabs)
      const tabsBar = el('div', { class: 'gi-events-tabs' });
      
      const tabCalendarBtn = el('button', {
        class: `gi-events-tab ${activeTab === 'calendar' ? 'gi-events-tab--active' : ''}`,
        type: 'button',
        text: `📅 Lịch Vạn Niên (${calendarEvents.length})`
      });
      const tabMemorialsBtn = el('button', {
        class: `gi-events-tab ${activeTab === 'memorials' ? 'gi-events-tab--active' : ''}`,
        type: 'button',
        text: `🕯️ Lịch Kỵ Giỗ (${allDeceased.length})`
      });
      const tabTimelineBtn = el('button', {
        class: `gi-events-tab ${activeTab === 'timeline' ? 'gi-events-tab--active' : ''}`,
        type: 'button',
        text: `📜 Niên Biểu (${timeline.length})`
      });
      const tabSubscribeBtn = el('button', {
        class: `gi-events-tab ${activeTab === 'subscribe' ? 'gi-events-tab--active' : ''}`,
        type: 'button',
        text: `📲 Đồng Bộ Lịch Thiết Bị`
      });

      tabsBar.appendChild(tabCalendarBtn);
      tabsBar.appendChild(tabMemorialsBtn);
      tabsBar.appendChild(tabTimelineBtn);
      tabsBar.appendChild(tabSubscribeBtn);
      container.appendChild(tabsBar);

      // Views Content Host
      const viewsContainer = el('div', { class: 'gi-events-views' });
      container.appendChild(viewsContainer);

      function setTab(tabKey) {
        activeTab = tabKey;
        tabCalendarBtn.classList.toggle('gi-events-tab--active', tabKey === 'calendar');
        tabMemorialsBtn.classList.toggle('gi-events-tab--active', tabKey === 'memorials');
        tabTimelineBtn.classList.toggle('gi-events-tab--active', tabKey === 'timeline');
        tabSubscribeBtn.classList.toggle('gi-events-tab--active', tabKey === 'subscribe');
        renderActiveView();
      }

      tabCalendarBtn.onclick = () => setTab('calendar');
      tabMemorialsBtn.onclick = () => setTab('memorials');
      tabTimelineBtn.onclick = () => setTab('timeline');
      tabSubscribeBtn.onclick = () => setTab('subscribe');

      function renderActiveView() {
        clear(viewsContainer);

        if (activeTab === 'calendar') {
          renderCalendarView(viewsContainer, calendarEvents, people);
        } else if (activeTab === 'memorials') {
          renderMemorialsView(viewsContainer, {
            exact: verifiedExactDeceased,
            needsVerification: needsVerificationDeceased,
            unknown: unknownDateDeceased
          }, people);
        } else if (activeTab === 'timeline') {
          renderTimelineView(viewsContainer, timeline, people);
        } else if (activeTab === 'subscribe') {
          renderSubscribeView(viewsContainer, calendarEvents);
        }

        // Deep-linking target highlight
        if (paramId) {
          setTimeout(() => {
            const cleanId = paramId.replace(/[^a-zA-Z0-9]/g, '');
            let targetEl = document.getElementById(`memorial-${cleanId}`)
              || document.getElementById(`timeline-${cleanId}`)
              || document.querySelector(`[data-person-id="${paramId}"]`);
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
              targetEl.classList.add('gi-highlight-target');
              setTimeout(() => targetEl.classList.remove('gi-highlight-target'), 2800);
            }
          }, 150);
        }
      }

      // =======================================================================
      // VIEW 1: ONLINE FAMILY CALENDAR (LỊCH VẠN NIÊN & SỰ KIỆN GIA TỘC)
      // =======================================================================
      function renderCalendarView(parent, events, peopleMap) {
        const y = curCalDate.getFullYear();
        const m = curCalDate.getMonth(); // 0..11
        const midLunar = convertSolar2Lunar(15, m + 1, y, 7.0);

        const calApp = el('div', { class: 'gi-calendar-app' });

        // Toolbar Header
        const header = el('div', { class: 'gi-cal-header' }, [
          // Nav Group
          el('div', { class: 'gi-cal-nav-group' }, [
            el('button', {
              class: 'gi-btn gi-btn--subtle',
              type: 'button',
              text: '◀ Trước',
              onclick: () => {
                curCalDate.setMonth(curCalDate.getMonth() - 1);
                renderActiveView();
              }
            }),
            el('button', {
              class: 'gi-btn gi-btn--subtle',
              type: 'button',
              style: { fontWeight: '700' },
              text: 'Hôm nay',
              onclick: () => {
                curCalDate = new Date();
                renderActiveView();
              }
            }),
            el('button', {
              class: 'gi-btn gi-btn--subtle',
              type: 'button',
              text: 'Sau ▶',
              onclick: () => {
                curCalDate.setMonth(curCalDate.getMonth() + 1);
                renderActiveView();
              }
            })
          ]),

          // Month Title
          el('div', { class: 'gi-cal-month-title' }, [
            el('h3', {
              class: 'gi-cal-solar-title',
              text: `Tháng ${m + 1} năm ${y}`
            }),
            el('div', {
              class: 'gi-cal-lunar-title',
              text: `Tháng ${midLunar.month} ÂL · Năm ${midLunar.canChi}`
            })
          ]),

          // Right Controls: View Switch & Fast Add-to-Phone Button
          el('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' } }, [
            el('div', { class: 'gi-cal-view-switch' }, [
              el('button', {
                class: `gi-btn ${calViewMode === 'month' ? 'gi-btn--primary' : 'gi-btn--subtle'}`,
                style: { padding: '5px 10px', fontSize: '12px' },
                type: 'button',
                text: 'Lưới tháng',
                onclick: () => { calViewMode = 'month'; renderActiveView(); }
              }),
              el('button', {
                class: `gi-btn ${calViewMode === 'agenda' ? 'gi-btn--primary' : 'gi-btn--subtle'}`,
                style: { padding: '5px 10px', fontSize: '12px' },
                type: 'button',
                text: 'Danh sách',
                onclick: () => { calViewMode = 'agenda'; renderActiveView(); }
              })
            ]),
            el('button', {
              class: 'gi-btn gi-btn--gold',
              style: { padding: '6px 12px', fontSize: '12.5px', fontWeight: '600' },
              type: 'button',
              text: '📲 Thêm vào điện thoại',
              onclick: () => setTab('subscribe')
            })
          ])
        ]);
        calApp.appendChild(header);

        // Filter Bar (Layer Chips)
        const filterBar = el('div', { class: 'gi-cal-filter-bar' });
        filterBar.appendChild(el('span', {
          style: { fontWeight: '700', fontSize: '12px', color: 'var(--color-text-secondary, #57534e)', textTransform: 'uppercase' },
          text: 'Lọc sự kiện:'
        }));

        const layersConfig = [
          { key: 'birthdays', class: 'birth', label: 'Sinh nhật', icon: '🎂' },
          { key: 'patrons', class: 'patron', label: 'Bổn mạng', icon: '✝️' },
          { key: 'memorials', class: 'mem', label: 'Ngày giỗ', icon: '🕯️' },
          { key: 'milestones', class: 'event', label: 'Sự kiện', icon: '🏛️' }
        ];

        layersConfig.forEach((cfg) => {
          const count = events.filter((e) => e.layer === cfg.key).length;
          const isActive = Boolean(calLayers[cfg.key]);
          const chip = el('label', {
            class: `gi-cal-chip ${isActive ? `gi-cal-chip--active-${cfg.class}` : ''}`,
            onclick: (e) => {
              e.preventDefault();
              calLayers[cfg.key] = !calLayers[cfg.key];
              renderActiveView();
            }
          }, [
            el('span', { text: `${cfg.icon} ${cfg.label} (${count})` })
          ]);
          filterBar.appendChild(chip);
        });
        calApp.appendChild(filterBar);

        // Content Area: Month Grid or Agenda List
        if (calViewMode === 'month') {
          renderMonthGrid(calApp, y, m, events, peopleMap);
        } else {
          renderAgendaList(calApp, y, m, events, peopleMap);
        }

        parent.appendChild(calApp);
      }

      function renderMonthGrid(parent, y, m, events, peopleMap) {
        const gridView = el('div', { class: 'gi-month-grid' });

        // Weekday Headers
        const weekdaysBar = el('div', { class: 'gi-month-weekdays' }, [
          'Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'
        ].map((dayName) => el('div', { text: dayName })));
        gridView.appendChild(weekdaysBar);

        // Day Cells Grid
        const cellsGrid = el('div', { class: 'gi-month-cells' });

        const firstDayOfWeek = new Date(y, m, 1).getDay(); // 0..6
        const daysInCurrentMonth = new Date(y, m + 1, 0).getDate();
        const daysInPrevMonth = new Date(y, m, 0).getDate();
        const today = new Date();
        const isCurrentMonthActual = (today.getFullYear() === y && today.getMonth() === m);

        const totalCells = (firstDayOfWeek + daysInCurrentMonth > 35) ? 42 : 35;

        for (let i = 0; i < totalCells; i++) {
          let cy = y, cm = m + 1, cd = 0, isOther = false;
          if (i < firstDayOfWeek) {
            isOther = true;
            cd = daysInPrevMonth - (firstDayOfWeek - i - 1);
            cm = m === 0 ? 12 : m;
            cy = m === 0 ? y - 1 : y;
          } else if (i >= firstDayOfWeek + daysInCurrentMonth) {
            isOther = true;
            cd = i - (firstDayOfWeek + daysInCurrentMonth) + 1;
            cm = m === 11 ? 1 : m + 2;
            cy = m === 11 ? y + 1 : y;
          } else {
            cd = i - firstDayOfWeek + 1;
          }

          const isToday = isCurrentMonthActual && !isOther && (today.getDate() === cd);
          const lunar = convertSolar2Lunar(cd, cm, cy, 7.0);

          // Filter matching events for this cell date
          const matchedEvs = events.filter((ev) => calLayers[ev.layer] && ev.month === cm && ev.day === cd);

          const cell = el('div', {
            class: `gi-day-cell ${isOther ? 'gi-day-cell--other' : ''} ${isToday ? 'gi-day-cell--today' : ''}`,
            onclick: () => openDayModal(cd, cm, cy, lunar, matchedEvs, peopleMap)
          });

          // Top Header: Solar Number & Lunar Badge
          let lunarText = `${lunar.day}`;
          if (lunar.day === 1 || lunar.day === 15) {
            lunarText = `${lunar.day}/${lunar.month}${lunar.isLeap ? '(N)' : ''}`;
          }

          const cellTop = el('div', { class: 'gi-day-cell-top' }, [
            el('span', { class: 'gi-solar-num', text: String(cd) }),
            el('span', { class: 'gi-lunar-num', text: lunarText })
          ]);
          cell.appendChild(cellTop);

          // Event Chips
          const eventsHost = el('div', { class: 'gi-cell-events' });
          const maxChips = 3;
          matchedEvs.slice(0, maxChips).forEach((ev) => {
            const chip = el('div', {
              class: `gi-cal-event-chip gi-cal-event-chip--${ev.chipCls}`,
              title: ev.summary,
              text: ev.summary,
              onclick: (e) => {
                e.stopPropagation();
                openEventDetailModal(ev, cy, peopleMap);
              }
            });
            eventsHost.appendChild(chip);
          });

          if (matchedEvs.length > maxChips) {
            eventsHost.appendChild(el('div', {
              class: 'gi-more-events-badge',
              text: `+${matchedEvs.length - maxChips} sự kiện khác...`,
              onclick: (e) => {
                e.stopPropagation();
                openDayModal(cd, cm, cy, lunar, matchedEvs, peopleMap);
              }
            }));
          }

          cell.appendChild(eventsHost);
          cellsGrid.appendChild(cell);
        }

        gridView.appendChild(cellsGrid);
        parent.appendChild(gridView);
      }

      function renderAgendaList(parent, y, m, events, peopleMap) {
        const agendaContainer = el('div', { class: 'gi-agenda-view' });
        const daysInMonth = new Date(y, m + 1, 0).getDate();
        let hasAny = false;

        for (let d = 1; d <= daysInMonth; d++) {
          const matchedEvs = events.filter((ev) => calLayers[ev.layer] && ev.month === (m + 1) && ev.day === d);
          if (matchedEvs.length === 0) continue;
          hasAny = true;

          const lunar = convertSolar2Lunar(d, m + 1, y, 7.0);
          const group = el('div', { class: 'gi-agenda-group' });

          const head = el('div', { class: 'gi-agenda-date-head' }, [
            el('span', { text: `Ngày ${String(d).padStart(2, '0')}/${String(m + 1).padStart(2, '0')}/${y}` }),
            el('span', { style: { color: 'var(--color-brand-gold, #c59b27)', fontSize: '13px', fontWeight: '600' }, text: lunar.fullText })
          ]);
          group.appendChild(head);

          matchedEvs.forEach((ev) => {
            // Find person profile match
            const personMatch = ev.fsid ? Object.values(peopleMap).find(p => p.fsid === ev.fsid) : null;
            const profileHref = personMatch
              ? (isLab ? `#view=person&id=${encodeURIComponent(personMatch.id)}` : `/me/tree/person/${encodeURIComponent(personMatch.id)}`)
              : null;

            const card = el('div', {
              class: 'gi-agenda-card',
              onclick: () => openEventDetailModal(ev, y, peopleMap)
            }, [
              el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
                el('h4', {
                  style: { margin: 0, fontSize: '15.5px', fontFamily: 'var(--font-display-active, Georgia, serif)', color: 'var(--color-text-primary, #1c1917)' },
                  text: ev.summary
                }),
                el('span', {
                  class: `gi-badge gi-badge--${ev.chipCls}`,
                  style: { fontSize: '11px', padding: '2px 8px' },
                  text: `${ev.icon || ''} ${ev.label}`
                })
              ]),
              ev.description ? el('p', {
                style: { margin: '6px 0', fontSize: '12.5px', color: 'var(--color-text-secondary, #57534e)', whiteSpace: 'pre-line', maxHeight: '44px', overflow: 'hidden' },
                text: ev.description.split('\n').slice(0, 2).join('\n')
              }) : null,
              personMatch ? el('div', { style: { marginTop: '8px' } }, [
                el('a', {
                  class: 'gi-btn gi-btn--subtle',
                  style: { fontSize: '11.5px', padding: '3px 8px' },
                  href: profileHref,
                  onclick: (e) => e.stopPropagation(),
                  text: `👤 Hồ sơ ${personMatch.name} →`
                })
              ]) : null
            ]);
            group.appendChild(card);
          });

          agendaContainer.appendChild(group);
        }

        if (!hasAny) {
          agendaContainer.appendChild(StatePanel({
            state: STATE.EMPTY,
            title: `Không có sự kiện gia phả nào trong Tháng ${m + 1}`,
            explanation: 'Vui lòng kiểm tra lại bộ lọc danh mục sự kiện hoặc chuyển sang tháng khác.'
          }));
        }

        parent.appendChild(agendaContainer);
      }

      // Modal Dialogs for Day & Event Details
      function openDayModal(day, month, year, lunar, matchedEvents, peopleMap) {
        const overlay = el('div', { class: 'gi-cal-modal-overlay', onclick: (e) => { if (e.target === overlay) overlay.remove(); } });
        const box = el('div', { class: 'gi-cal-modal-box' });

        const header = el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e7e5e4', paddingBottom: '12px', marginBottom: '16px' } }, [
          el('div', {}, [
            el('h3', { style: { margin: 0, fontSize: '18px', fontFamily: 'var(--font-display-active, Georgia, serif)', color: 'var(--color-brand-heritage, #881337)' }, text: `Sự Kiện Ngày ${day}/${month}/${year}` }),
            el('div', { style: { fontSize: '13px', color: 'var(--color-brand-gold, #c59b27)', fontWeight: '600', marginTop: '3px' }, text: `Âm lịch: ${lunar.fullText}` })
          ]),
          el('button', {
            class: 'gi-btn gi-btn--subtle',
            style: { padding: '4px 8px', fontSize: '14px' },
            type: 'button',
            text: '✕',
            onclick: () => overlay.remove()
          })
        ]);
        box.appendChild(header);

        if (matchedEvents.length === 0) {
          box.appendChild(el('p', { style: { color: 'var(--color-text-muted, #78716c)', textAlign: 'center', padding: '24px 0' }, text: 'Không có sự kiện gia phả nào trong ngày này.' }));
        } else {
          const list = el('div', { class: 'gi-stack', style: { gap: '10px' } });
          matchedEvents.forEach((ev) => {
            const card = el('div', {
              class: 'gi-agenda-card',
              onclick: () => {
                overlay.remove();
                openEventDetailModal(ev, year, peopleMap);
              }
            }, [
              el('div', { style: { fontWeight: '700', fontSize: '15px' }, text: ev.summary }),
              el('div', { style: { fontSize: '12.5px', color: 'var(--color-text-secondary, #57534e)', marginTop: '4px' }, text: `Loại: ${ev.label} • Xem chi tiết hồ sơ →` })
            ]);
            list.appendChild(card);
          });
          box.appendChild(list);
        }

        overlay.appendChild(box);
        document.body.appendChild(overlay);
      }

      function openEventDetailModal(ev, yr, peopleMap) {
        const overlay = el('div', { class: 'gi-cal-modal-overlay', onclick: (e) => { if (e.target === overlay) overlay.remove(); } });
        const box = el('div', { class: 'gi-cal-modal-box' });

        const lunar = convertSolar2Lunar(ev.day, ev.month, yr, 7.0);
        const personMatch = ev.fsid ? Object.values(peopleMap).find(p => p.fsid === ev.fsid) : null;
        const profileHref = personMatch
          ? (isLab ? `#view=person&id=${encodeURIComponent(personMatch.id)}` : `/me/tree/person/${encodeURIComponent(personMatch.id)}`)
          : null;

        const header = el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e7e5e4', paddingBottom: '12px', marginBottom: '14px' } }, [
          el('div', {}, [
            el('span', { class: 'gi-badge', style: { fontSize: '11px', marginBottom: '6px', display: 'inline-block' }, text: `${ev.icon || ''} ${ev.label}` }),
            el('h3', { style: { margin: 0, fontSize: '18px', fontFamily: 'var(--font-display-active, Georgia, serif)', color: 'var(--color-brand-heritage, #881337)' }, text: ev.summary })
          ]),
          el('button', {
            class: 'gi-btn gi-btn--subtle',
            style: { padding: '4px 8px', fontSize: '14px' },
            type: 'button',
            text: '✕',
            onclick: () => overlay.remove()
          })
        ]);
        box.appendChild(header);

        // Date Info
        const dateBlock = el('div', {
          style: { padding: '12px', background: 'var(--color-surface-sunken, #fafaf9)', border: '1px solid #e7e5e4', borderRadius: '4px', marginBottom: '16px', fontSize: '13px' }
        }, [
          el('div', {}, [el('strong', { text: 'Dương lịch: ' }), el('span', { text: `Ngày ${String(ev.day).padStart(2, '0')}/${String(ev.month).padStart(2, '0')}/${yr}` })]),
          el('div', { style: { color: 'var(--color-brand-gold, #c59b27)', marginTop: '4px' } }, [el('strong', { text: 'Âm lịch: ' }), el('span', { text: lunar.fullText })])
        ]);
        box.appendChild(dateBlock);

        // Person Profile Link Strip
        if (personMatch) {
          const personBox = el('div', {
            style: { padding: '12px 14px', background: '#fffdf5', border: '1px solid #fde047', borderRadius: '4px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
          }, [
            el('div', {}, [
              el('div', { style: { fontSize: '11px', textTransform: 'uppercase', color: '#854d0e', fontWeight: '700' }, text: 'Thành viên liên quan' }),
              el('div', { style: { fontSize: '14.5px', fontWeight: '700', color: '#1c1917', marginTop: '2px' }, text: personMatch.name })
            ]),
            el('a', {
              class: 'gi-btn gi-btn--primary',
              style: { fontSize: '12px', padding: '5px 10px' },
              href: profileHref,
              onclick: () => overlay.remove(),
              text: '👤 Xem Hồ Sơ Phả Đồ →'
            })
          ]);
          box.appendChild(personBox);
        }

        // Full Description
        if (ev.description) {
          const descBlock = el('div', {
            style: { fontSize: '13px', lineHeight: '1.6', color: 'var(--color-text-secondary, #57534e)', whiteSpace: 'pre-line', background: '#ffffff', padding: '12px', border: '1px solid #e7e5e4', borderRadius: '4px' },
            text: ev.description
          });
          box.appendChild(descBlock);
        }

        overlay.appendChild(box);
        document.body.appendChild(overlay);
      }

      // =======================================================================
      // VIEW 2: MEMORIALS CALENDAR (LỊCH KỴ GIỖ TIỀN NHÂN - 3 TẦNG XÁC MINH)
      // =======================================================================
      function renderMemorialsView(parent, deceasedGroups, peopleMap) {
        const headerBar = el('div', { class: 'gi-events-header-bar' }, [
          el('div', {}, [
            el('h3', {
              style: { margin: '0 0 4px', fontSize: '18px', fontFamily: 'var(--font-display-active, serif)' },
              text: `Lịch Kỵ Giỗ Tiền Nhân — Năm ${targetYear} (${getYearCanChi(targetYear)})`
            }),
            el('p', {
              style: { margin: 0, fontSize: '13px', color: 'var(--color-text-secondary, #57534e)' },
              text: 'Ngày dương lịch được tính toán động theo chuẩn thiên văn âm lịch Việt Nam (UTC+7), không trôi dạt như lịch Tây.'
            })
          ]),
          el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
            el('label', {
              style: { fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary, #1c1917)' },
              text: 'Năm tra cứu:'
            }),
            el('select', {
              class: 'gi-input',
              style: { padding: '6px 12px', fontSize: '14px', borderRadius: '4px', cursor: 'pointer' },
              onchange: (e) => {
                targetYear = parseInt(e.target.value, 10);
                renderActiveView();
              }
            }, [2024, 2025, 2026, 2027, 2028, 2029, 2030].map((y) => {
              const opt = el('option', { value: String(y), text: `Năm ${y} (${getYearCanChi(y)})` });
              if (y === targetYear) opt.selected = true;
              return opt;
            }))
          ])
        ]);
        parent.appendChild(headerBar);

        // TIER 1: ĐÃ XÁC MINH (12 TIỀN NHÂN CÓ NGÀY MẤT CHÍNH XÁC)
        const processedExact = deceasedGroups.exact.map((d) => {
          const calc = calculateMemorialDate(d.deathDate, targetYear);
          const isRoot = d.personId === '@I1@';
          return { ...d, calc, isRoot };
        });

        processedExact.sort((a, b) => {
          if (a.isRoot) return -1;
          if (b.isRoot) return 1;
          const sa = a.calc ? a.calc.projectedSolar : null;
          const sb = b.calc ? b.calc.projectedSolar : null;
          if (!sa || !sb) return 0;
          if (sa.month !== sb.month) return sa.month - sb.month;
          return sa.day - sb.day;
        });

        const tier1Heading = el('div', { style: { margin: '24px 0 12px', display: 'flex', alignItems: 'center', gap: '8px' } }, [
          el('h4', {
            style: { margin: 0, fontSize: '16px', fontFamily: 'var(--font-display-active, serif)', color: 'var(--color-brand-heritage, #881337)' },
            text: `Kỵ Giỗ Tiền Nhân — Đã Xác Minh Ngày Giỗ (${processedExact.length})`
          }),
          el('span', {
            class: 'gi-badge gi-badge--gold',
            style: { fontSize: '11px', padding: '2px 8px' },
            text: '✓ ĐÃ XÁC MINH THIÊN VĂN'
          })
        ]);
        parent.appendChild(tier1Heading);

        const grid = el('div', { class: 'gi-events-grid' });
        processedExact.forEach(({ personId, personName, calc, isRoot }) => {
          const cleanId = personId.replace(/[^a-zA-Z0-9]/g, '');
          const personProfileHref = isLab
            ? `#view=person&id=${encodeURIComponent(personId)}`
            : `/me/tree/person/${encodeURIComponent(personId)}`;
          const galleryHref = isLab
            ? `#view=gallery&id=${encodeURIComponent(personId)}`
            : `/me/gallery?personId=${encodeURIComponent(personId)}`;

          const card = el('div', {
            id: `memorial-${cleanId}`,
            'data-person-id': personId,
            class: `gi-memorial-card ${isRoot ? 'gi-memorial-card--root' : ''}`
          }, [
            el('div', { class: 'gi-stack', style: { gap: '10px' } }, [
              el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' } }, [
                el('span', {
                  style: {
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: isRoot ? 'var(--color-brand-heritage, #8b261e)' : 'var(--color-text-muted, #78716c)'
                  },
                  text: isRoot ? '⭐ KHỞI TỔ DÒNG TỘC (F0)' : '🕯️ KỴ GIỖ TIỀN NHÂN'
                }),
                calc && calc.anniversaryCount ? el('span', {
                  style: {
                    fontSize: '11.5px',
                    color: 'var(--color-brand-gold, #c59b27)',
                    fontWeight: '600',
                    background: 'rgba(197, 155, 39, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '3px'
                  },
                  text: `Lễ giỗ lần thứ ${calc.anniversaryCount}`
                }) : null
              ]),
              el('h4', {
                style: { margin: '2px 0 0', fontSize: '17px', fontFamily: 'var(--font-display-active, serif)', color: 'var(--color-text-primary, #1c1917)' },
                text: personName
              }),
              calc ? el('div', { class: 'gi-memorial-date-badge' }, [
                el('div', {}, [
                  el('div', { class: 'gi-memorial-date-badge__solar', text: `${calc.solarDisplay} (Dương lịch ${targetYear})` }),
                  el('div', { class: 'gi-memorial-date-badge__lunar', text: `Trùng ngày: ${calc.lunarDisplay}` })
                ])
              ]) : null,
              calc ? el('div', {
                style: { fontSize: '12px', color: 'var(--color-text-secondary, #57534e)', background: 'var(--color-surface-sunken, #fafaf9)', padding: '8px 12px', borderRadius: '3px', border: '1px solid var(--color-border-subtle, #f5f5f4)' }
              }, [
                el('div', { text: `📅 Ngày mất gốc: ${calc.originalDateText} (${calc.originalLunar.fullText})` }),
                el('div', { style: { marginTop: '2px', color: 'var(--color-text-muted, #a8a29e)', fontSize: '11px' }, text: 'Dữ liệu gốc được bảo toàn, đối soát từ Gia phả gốc và bia ký di sản.' })
              ]) : null
            ]),
            el('div', { class: 'gi-memorial-actions' }, [
              el('a', { class: 'gi-btn gi-btn--primary', style: { fontSize: '12.5px', padding: '5px 10px' }, href: personProfileHref, text: '👤 Xem Hồ sơ nhân vật →' }),
              el('a', { class: 'gi-btn gi-btn--subtle', style: { fontSize: '12.5px', padding: '5px 10px' }, href: galleryHref, text: '🖼️ Di ảnh & Kỷ vật →' })
            ])
          ]);
          grid.appendChild(card);
        });
        parent.appendChild(grid);

        // TIER 2: CẦN KIỂM CHỨNG (6 TIỀN NHÂN)
        if (deceasedGroups.needsVerification.length > 0) {
          const inexactSection = el('div', {
            style: { marginTop: '40px', padding: '22px', background: '#fffdf5', border: '1px solid #fef08a', borderRadius: '6px' }
          }, [
            el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' } }, [
              el('span', { style: { fontSize: '18px' }, text: '⚠️' }),
              el('h4', { style: { margin: 0, fontSize: '16px', fontFamily: 'var(--font-display-active, serif)', color: '#854d0e' }, text: `Tiền nhân chỉ ghi nhận năm mất — Cần kiểm chứng ngày giỗ chính xác (${deceasedGroups.needsVerification.length})` }),
              el('span', { style: { fontSize: '11px', fontWeight: '600', padding: '2px 8px', background: '#fef9c3', color: '#713f12', border: '1px solid #fde047', borderRadius: '3px' }, text: 'CẦN KIỂM CHỨNG' })
            ]),
            el('p', { style: { margin: '0 0 16px', fontSize: '13px', color: '#713f12', lineHeight: '1.55' }, text: 'Dữ liệu gia phả hiện tại chỉ lưu lại năm mất, chưa ghi nhận ngày và tháng âm lịch chính xác. Ban biên tập kính mời quý gia đình cung cấp thêm thông tin.' }),
            el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' } }, deceasedGroups.needsVerification.map(({ personId, personName, deathDate }) => {
              const cleanId = personId.replace(/[^a-zA-Z0-9]/g, '');
              const pProfileHref = isLab ? `#view=person&id=${encodeURIComponent(personId)}` : `/me/tree/person/${encodeURIComponent(personId)}`;
              return el('div', {
                id: `memorial-${cleanId}`,
                'data-person-id': personId,
                style: { padding: '12px 14px', background: '#ffffff', border: '1px solid #fde047', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }
              }, [
                el('div', {}, [
                  el('div', { style: { fontWeight: '600', fontSize: '14px', color: '#1c1917' }, text: personName }),
                  el('div', { style: { fontSize: '12px', color: '#854d0e', marginTop: '2px' }, text: `Năm mất ghi nhận: ${deathDate}` })
                ]),
                el('a', { class: 'gi-btn gi-btn--subtle', style: { padding: '5px 10px', fontSize: '12px', whiteSpace: 'nowrap' }, href: pProfileHref, text: 'Hồ sơ nhân vật →' })
              ]);
            }))
          ]);
          parent.appendChild(inexactSection);
        }

        // TIER 3: CHƯA XÁC ĐỊNH (10 TIỀN NHÂN)
        if (deceasedGroups.unknown.length > 0) {
          const unknownSection = el('div', {
            style: { marginTop: '28px', padding: '22px', background: 'var(--color-surface-sunken, #fafaf9)', border: '1px solid var(--color-border-subtle, #e7e5e4)', borderRadius: '6px' }
          }, [
            el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' } }, [
              el('span', { style: { fontSize: '18px' }, text: '🕊️' }),
              el('h4', { style: { margin: 0, fontSize: '16px', fontFamily: 'var(--font-display-active, serif)', color: 'var(--color-text-primary, #1c1917)' }, text: `Tiền nhân chưa rõ ngày kỵ giỗ — Tưởng niệm trang trọng (${deceasedGroups.unknown.length})` }),
              el('span', { style: { fontSize: '11px', fontWeight: '600', padding: '2px 8px', background: '#f5f5f4', color: '#78716c', border: '1px solid #d6d3d1', borderRadius: '3px' }, text: 'CHƯA XÁC ĐỊNH NGÀY' })
            ]),
            el('p', { style: { margin: '0 0 16px', fontSize: '13px', color: 'var(--color-text-secondary, #57534e)', lineHeight: '1.55' }, text: 'Các bậc tiền nhân đã quy tiên nhưng gia phả chưa lưu truyền lại ngày tháng năm mất. Tuyệt đối không gán ngày giả định (01/01).' }),
            el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' } }, deceasedGroups.unknown.map(({ personId, personName }) => {
              const cleanId = personId.replace(/[^a-zA-Z0-9]/g, '');
              const pProfileHref = isLab ? `#view=person&id=${encodeURIComponent(personId)}` : `/me/tree/person/${encodeURIComponent(personId)}`;
              return el('div', {
                id: `memorial-${cleanId}`,
                'data-person-id': personId,
                style: { padding: '12px 14px', background: '#ffffff', border: '1px solid var(--color-border-subtle, #e7e5e4)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }
              }, [
                el('div', {}, [
                  el('div', { style: { fontWeight: '600', fontSize: '14px', color: 'var(--color-text-primary, #1c1917)' }, text: personName }),
                  el('div', { style: { fontSize: '12px', color: 'var(--color-text-muted, #a8a29e)', marginTop: '2px' }, text: 'Đã tạ thế · Chưa rõ ngày mất' })
                ]),
                el('a', { class: 'gi-btn gi-btn--subtle', style: { padding: '5px 10px', fontSize: '12px', whiteSpace: 'nowrap' }, href: pProfileHref, text: 'Hồ sơ nhân vật →' })
              ]);
            }))
          ]);
          parent.appendChild(unknownSection);
        }
      }

      // =======================================================================
      // VIEW 3: HISTORICAL TIMELINE (NIÊN BIỂU LỊCH SỬ)
      // =======================================================================
      function renderTimelineView(parent, events, peopleMap) {
        const births = events.filter((e) => e.type === 'BIRTH' || e.event === 'BIRTH');
        const deaths = events.filter((e) => e.type === 'DEATH' || e.event === 'DEATH');
        const milestones = events.filter((e) => ['MARRIAGE', 'BAPTISM', 'MILESTONE'].includes(e.type || e.event));

        const filterBar = el('div', { class: 'gi-events-header-bar' }, [
          el('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } }, [
            el('button', {
              class: `gi-btn ${timelineTypeFilter === 'all' ? 'gi-btn--primary' : 'gi-btn--subtle'}`,
              type: 'button',
              text: `Tất cả (${events.length})`,
              onclick: () => { timelineTypeFilter = 'all'; renderActiveView(); }
            }),
            el('button', {
              class: `gi-btn ${timelineTypeFilter === 'birth' ? 'gi-btn--primary' : 'gi-btn--subtle'}`,
              type: 'button',
              text: `🎂 Sinh nhật (${births.length})`,
              onclick: () => { timelineTypeFilter = 'birth'; renderActiveView(); }
            }),
            el('button', {
              class: `gi-btn ${timelineTypeFilter === 'death' ? 'gi-btn--primary' : 'gi-btn--subtle'}`,
              type: 'button',
              text: `🕯️ Kỵ giỗ (${deaths.length})`,
              onclick: () => { timelineTypeFilter = 'death'; renderActiveView(); }
            }),
            el('button', {
              class: `gi-btn ${timelineTypeFilter === 'milestone' ? 'gi-btn--primary' : 'gi-btn--subtle'}`,
              type: 'button',
              text: `⭐ Mốc kỷ niệm (${milestones.length})`,
              onclick: () => { timelineTypeFilter = 'milestone'; renderActiveView(); }
            })
          ]),
          el('div', { style: { display: 'flex', gap: '10px', alignItems: 'center' } }, [
            el('input', {
              class: 'gi-input',
              type: 'search',
              placeholder: 'Tìm theo tên, năm...',
              value: timelineSearchQuery,
              style: { padding: '6px 12px', fontSize: '13px', width: '180px' },
              oninput: (e) => {
                timelineSearchQuery = e.target.value.toLowerCase().trim();
                renderActiveView();
              }
            }),
            el('button', {
              class: 'gi-btn gi-btn--subtle',
              type: 'button',
              style: { fontSize: '13px', padding: '6px 10px' },
              text: timelineSortOrder === 'asc' ? 'Thời gian: Cũ → Mới ↑' : 'Thời gian: Mới → Cũ ↓',
              onclick: () => {
                timelineSortOrder = timelineSortOrder === 'asc' ? 'desc' : 'asc';
                renderActiveView();
              }
            })
          ])
        ]);
        parent.appendChild(filterBar);

        let filtered = events.filter((ev) => {
          const isBirth = ev.type === 'BIRTH' || ev.event === 'BIRTH';
          const isDeath = ev.type === 'DEATH' || ev.event === 'DEATH';
          const isMilestone = ['MARRIAGE', 'BAPTISM', 'MILESTONE'].includes(ev.type || ev.event);

          if (timelineTypeFilter === 'birth' && !isBirth) return false;
          if (timelineTypeFilter === 'death' && !isDeath) return false;
          if (timelineTypeFilter === 'milestone' && !isMilestone) return false;

          if (timelineSearchQuery) {
            const name = (ev.personName || '').toLowerCase();
            const date = String(ev.date || '').toLowerCase();
            const title = (ev.title || '').toLowerCase();
            if (!name.includes(timelineSearchQuery) && !date.includes(timelineSearchQuery) && !title.includes(timelineSearchQuery)) {
              return false;
            }
          }
          return true;
        });

        filtered.sort((a, b) => {
          const ya = a.year || (parseDateString(a.date)?.year) || 0;
          const yb = b.year || (parseDateString(b.date)?.year) || 0;
          return timelineSortOrder === 'asc' ? ya - yb : yb - ya;
        });

        if (filtered.length === 0) {
          parent.appendChild(StatePanel({
            state: STATE.EMPTY,
            title: 'Không tìm thấy sự kiện phù hợp',
            explanation: 'Vui lòng thay đổi từ khóa tìm kiếm hoặc bộ lọc danh mục.'
          }));
          return;
        }

        const stream = el('div', { class: 'gi-timeline-stream' });
        filtered.forEach((ev) => {
          const isBirth = ev.type === 'BIRTH' || ev.event === 'BIRTH';
          const isDeath = ev.type === 'DEATH' || ev.event === 'DEATH';
          const isMarriage = ev.type === 'MARRIAGE' || ev.event === 'MARRIAGE';
          const isBaptism = ev.type === 'BAPTISM' || ev.event === 'BAPTISM';

          const person = (ev.personId && peopleMap[ev.personId]) || {};
          const personName = ev.personName || person.name || ev.title || 'Thành viên gia tộc';
          const cleanId = (ev.personId || ev.id || '').replace(/[^a-zA-Z0-9]/g, '');

          let typeLabel = '⭐ Mốc lịch sử';
          let typeColor = 'var(--color-brand-gold, #c59b27)';
          if (isBirth) {
            typeLabel = '🎂 Sinh nhật';
            typeColor = 'var(--color-brand-gold, #c59b27)';
          } else if (isDeath) {
            typeLabel = '🕯️ Qua đời';
            typeColor = 'var(--color-brand-heritage, #8b261e)';
          } else if (isMarriage) {
            typeLabel = '💍 Kỷ niệm hôn phối';
            typeColor = '#0284c7';
          } else if (isBaptism) {
            typeLabel = '🕊️ Bí tích Rửa Tội';
            typeColor = '#059669';
          }

          const personLinks = [];
          const targetIds = (ev.personIds && ev.personIds.length > 0) ? ev.personIds : (ev.personId ? [ev.personId] : []);
          targetIds.forEach((pid) => {
            const pObj = peopleMap[pid] || {};
            const pName = pObj.name || pid;
            const href = isLab ? `#view=person&id=${encodeURIComponent(pid)}` : `/me/tree/person/${encodeURIComponent(pid)}`;
            personLinks.push(el('a', {
              class: 'gi-btn gi-btn--subtle',
              style: { padding: '4px 8px', fontSize: '12px' },
              href,
              text: targetIds.length > 1 ? `👤 Hồ sơ ${pName} →` : '👤 Xem hồ sơ trong phả đồ →'
            }));
          });

          if (isDeath && ev.personId) {
            const galleryHref = isLab ? `#view=gallery&id=${encodeURIComponent(ev.personId)}` : `/me/gallery?personId=${encodeURIComponent(ev.personId)}`;
            personLinks.push(el('a', {
              class: 'gi-btn gi-btn--subtle',
              style: { padding: '4px 8px', fontSize: '12px' },
              href: galleryHref,
              text: '🖼️ Di ảnh & Lăng mộ →'
            }));
          }

          const entry = el('div', {
            id: `timeline-${cleanId}`,
            'data-person-id': ev.personId || '',
            'data-event-id': ev.id || '',
            class: `gi-timeline-entry ${isBirth ? 'gi-timeline-entry--birth' : (isDeath ? 'gi-timeline-entry--death' : 'gi-timeline-entry--milestone')}`
          }, [
            el('div', { class: 'gi-timeline-card' }, [
              el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, [
                el('span', { style: { fontWeight: '700', fontSize: '15px', color: typeColor }, text: `${typeLabel} · Năm ${ev.year || ev.date}` }),
                el('span', { style: { fontSize: '12px', color: 'var(--color-text-muted, #78716c)' }, text: ev.date && ev.date.includes('/') ? `Ngày ${ev.date}` : `Năm ${ev.date || ev.year}` })
              ]),
              el('h4', { style: { margin: '4px 0 2px', fontSize: '16px', fontFamily: 'var(--font-display-active, serif)', color: 'var(--color-text-primary, #1c1917)' }, text: ev.title || personName }),
              personLinks.length > 0 ? el('div', { style: { display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' } }, personLinks) : null
            ])
          ]);
          stream.appendChild(entry);
        });
        parent.appendChild(stream);
      }

      // =======================================================================
      // VIEW 4: ADD TO PHONE & SUBSCRIPTIONS (ĐỒNG BỘ LỊCH THIẾT BỊ)
      // =======================================================================
      function renderSubscribeView(parent, events) {
        const subContainer = el('div', { class: 'gi-sub-panel' });

        // Platform Switcher Tabs
        const platTabs = el('div', { class: 'gi-cluster', style: { marginBottom: '18px' } }, [
          el('button', {
            class: `gi-btn ${subPlatform === 'apple' ? 'gi-btn--primary' : 'gi-btn--subtle'}`,
            type: 'button',
            text: '🍏 Apple Calendar (iPhone / Mac)',
            onclick: () => { subPlatform = 'apple'; renderActiveView(); }
          }),
          el('button', {
            class: `gi-btn ${subPlatform === 'google' ? 'gi-btn--primary' : 'gi-btn--subtle'}`,
            type: 'button',
            text: '🤖 Google Calendar (Android / Web)',
            onclick: () => { subPlatform = 'google'; renderActiveView(); }
          }),
          el('button', {
            class: `gi-btn ${subPlatform === 'other' ? 'gi-btn--primary' : 'gi-btn--subtle'}`,
            type: 'button',
            text: '💻 Microsoft Outlook & Khác',
            onclick: () => { subPlatform = 'other'; renderActiveView(); }
          })
        ]);
        subContainer.appendChild(platTabs);

        // Platform Instructions Banner
        let bannerText = '';
        let bannerTheme = 'apple-theme';
        if (subPlatform === 'apple') {
          bannerTheme = 'apple-theme';
          bannerText = 'Dành cho iPhone, iPad và máy Mac: Bấm nút "Thêm vào Apple Calendar" để ứng dụng Lịch trên máy tự động mở và đăng ký đồng bộ trực tiếp.';
        } else if (subPlatform === 'google') {
          bannerTheme = 'google-theme';
          bannerText = 'Dành cho Google Calendar: Bấm nút "Thêm vào Google Calendar" để đăng ký 1-click trên Web. Ứng dụng Google Calendar trên điện thoại Android sẽ tự động đồng bộ sau vài phút.';
        } else {
          bannerTheme = 'other-theme';
          bannerText = 'Dành cho Microsoft Outlook, Thunderbird và ứng dụng khác: Bấm "Sao chép URL feed" để thêm lịch từ web, hoặc bấm "Tải tệp .ics" để nạp trực tiếp vào ứng dụng.';
        }

        const banner = el('div', { class: `gi-sub-banner ${bannerTheme}` }, [
          el('strong', { text: subPlatform === 'apple' ? '🍏 Hướng dẫn iOS / macOS:' : (subPlatform === 'google' ? '🤖 Hướng dẫn Google / Android:' : '💻 Hướng dẫn Outlook / Máy tính:') }),
          el('div', { style: { marginTop: '4px' }, text: bannerText })
        ]);
        subContainer.appendChild(banner);

        // 4 Feeds Grid
        const feedGrid = el('div', { class: 'gi-sub-feed-grid' });
        const feedMeta = {
          birthdays: { desc: 'Sinh nhật dương lịch của mọi thành viên trong gia tộc họ Trần Trọng Thu' },
          patrons: { desc: 'Lễ Quan thầy / Thánh bổn mạng của các thành viên Công giáo trong gia đình' },
          memorials: { desc: 'Lễ giỗ phụ mẫu, ông bà, tổ tiên & các bậc tiền nhân (tính theo Âm lịch & Dương lịch)' },
          milestones: { desc: 'Kỷ niệm thành lập, các sự kiện họp mặt và ngày kỷ niệm chung của dòng họ' }
        };

        CALENDAR_FEEDS.forEach((f) => {
          const absUrl = getAbsoluteFeedUrl(f.file);
          const webcalUrl = getWebcalUrl(f.file);
          const googleUrl = getGoogleCalUrl(f.file);
          const count = events.filter((e) => e.layer === f.key).length;
          const meta = feedMeta[f.key] || { desc: '' };

          const card = el('div', { class: 'gi-sub-feed-card' }, [
            el('div', {}, [
              el('div', { class: 'gi-sub-feed-title' }, [
                el('span', { text: `${f.icon} Lịch ${f.label}` }),
                el('span', { class: 'gi-badge', style: { fontSize: '11px', fontWeight: '600' }, text: `${count} sự kiện` })
              ]),
              el('p', { class: 'gi-sub-feed-desc', text: meta.desc })
            ]),
            el('div', { class: 'gi-sub-actions-row' }, [
              subPlatform === 'apple' ? el('a', {
                class: 'gi-btn gi-btn--primary',
                style: { fontSize: '12px', padding: '6px 12px' },
                href: webcalUrl,
                text: 'Thêm vào Apple Calendar'
              }) : null,

              subPlatform === 'google' ? el('a', {
                class: 'gi-btn gi-btn--primary',
                style: { fontSize: '12px', padding: '6px 12px' },
                href: googleUrl,
                target: '_blank',
                rel: 'noopener noreferrer',
                text: 'Thêm vào Google Calendar ↗'
              }) : null,

              el('button', {
                class: 'gi-btn gi-btn--subtle',
                style: { fontSize: '12px', padding: '6px 12px' },
                type: 'button',
                text: 'Sao chép URL',
                onclick: (e) => {
                  const btn = e.currentTarget;
                  if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(absUrl).then(() => {
                      const oldText = btn.textContent;
                      btn.textContent = '✓ Đã sao chép!';
                      setTimeout(() => { btn.textContent = oldText; }, 2000);
                    });
                  } else {
                    const tmp = document.createElement('textarea');
                    tmp.value = absUrl;
                    document.body.appendChild(tmp);
                    tmp.select();
                    document.execCommand('copy');
                    tmp.remove();
                    const oldText = btn.textContent;
                    btn.textContent = '✓ Đã sao chép!';
                    setTimeout(() => { btn.textContent = oldText; }, 2000);
                  }
                }
              }),

              el('a', {
                class: 'gi-btn gi-btn--subtle',
                style: { fontSize: '12px', padding: '6px 12px' },
                href: absUrl,
                download: `${f.key}.ics`,
                text: 'Tải tệp .ics'
              })
            ].filter(Boolean))
          ]);
          feedGrid.appendChild(card);
        });

        subContainer.appendChild(feedGrid);
        parent.appendChild(subContainer);
      }

      // Initial Render
      renderActiveView();

      return container;
    },
    empty: {
      title: 'Chưa có dữ liệu lịch gia tộc',
      body: 'Dữ liệu lịch vạn niên và sự kiện phả hệ đang được đồng bộ.'
    }
  });

  return content;
}
