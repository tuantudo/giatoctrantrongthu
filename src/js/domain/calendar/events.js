/**
 * GIATOC DOMAIN CORE — calendar/events.js
 * Business rules for family lineage calendar: grouping, sorting, filtering,
 * and lunar date association.
 *
 * ZERO DOM DEPENDENCY — Pure functions executable in browser and Node.js.
 */

import { convertSolar2Lunar } from './lunar.js';

/**
 * Standard family calendar layer configurations.
 */
export const CALENDAR_FEEDS = Object.freeze([
  {
    key: 'birthdays',
    file: '/api/calendars/CAL_01_BIRTHDAYS.ics',
    class: 'birth',
    icon: '🎂',
    label: 'Sinh nhật'
  },
  {
    key: 'patrons',
    file: '/api/calendars/CAL_02_PATRON_FEASTS.ics',
    class: 'patron',
    icon: '✝️',
    label: 'Bổn mạng'
  },
  {
    key: 'memorials',
    file: '/api/calendars/CAL_03_MEMORIALS.ics',
    class: 'mem',
    icon: '🕯️',
    label: 'Ngày giỗ'
  },
  {
    key: 'milestones',
    file: '/api/calendars/CAL_04_FAMILY_MILESTONES.ics',
    class: 'event',
    icon: '🏛️',
    label: 'Sự kiện'
  }
]);

/**
 * Sort calendar events chronologically by month and day.
 *
 * @param {Array<Object>} events
 * @returns {Array<Object>} New sorted array
 */
export function sortCalendarEvents(events) {
  if (!Array.isArray(events)) return [];
  return events.slice().sort((a, b) => {
    const monthDiff = (a.month || 0) - (b.month || 0);
    if (monthDiff !== 0) return monthDiff;
    return (a.day || 0) - (b.day || 0);
  });
}

/**
 * Group events into 12 calendar months (1 to 12).
 *
 * @param {Array<Object>} events
 * @returns {Object.<number, Array<Object>>} Object with keys 1..12 mapping to event arrays
 */
export function groupEventsByMonth(events) {
  const byMonth = {};
  for (let m = 1; m <= 12; m++) {
    byMonth[m] = [];
  }
  if (!Array.isArray(events)) return byMonth;

  for (const ev of events) {
    const m = ev && typeof ev.month === 'number' ? ev.month : 0;
    if (m >= 1 && m <= 12) {
      byMonth[m].push(ev);
    }
  }
  return byMonth;
}

/**
 * Filter events by active layer keys (e.g. ['birthdays', 'memorials']).
 *
 * @param {Array<Object>} events
 * @param {Array<string>|Object.<string, boolean>} activeLayers Array or record of enabled layers
 * @returns {Array<Object>} Filtered events
 */
export function filterEventsByLayers(events, activeLayers) {
  if (!Array.isArray(events)) return [];
  if (!activeLayers) return [];

  const isLayerActive = (layerKey) => {
    if (Array.isArray(activeLayers)) return activeLayers.includes(layerKey);
    if (typeof activeLayers === 'object') return Boolean(activeLayers[layerKey]);
    return false;
  };

  return events.filter((ev) => ev && isLayerActive(ev.layer));
}

/**
 * Find events occurring on a specific solar month and day.
 *
 * @param {Array<Object>} events
 * @param {number} month (1..12)
 * @param {number} day (1..31)
 * @returns {Array<Object>}
 */
export function findEventsForDate(events, month, day) {
  if (!Array.isArray(events)) return [];
  return events.filter((ev) => ev && ev.month === month && ev.day === day);
}

/**
 * Enriches an event with its corresponding Vietnamese Lunar date for a specific year.
 *
 * @param {Object} event Event with .month and .day
 * @param {number} year Target solar year
 * @returns {Object} Event cloned with added .lunar field
 */
export function enrichEventWithLunar(event, year) {
  if (!event || typeof event !== 'object') return null;
  const m = event.month;
  const d = event.day;
  const y = typeof year === 'number' ? year : new Date().getFullYear();

  if (!m || !d) {
    return { ...event, lunar: null };
  }

  const lunar = convertSolar2Lunar(d, m, y);
  return {
    ...event,
    lunar
  };
}

/**
 * Computes lunar summary for a given solar month (evaluated at mid-month, day 15).
 *
 * @param {number} month Solar month (1..12)
 * @param {number} year Solar year (e.g. 2026)
 * @returns {{ month: number, canChi: string, fullText: string }}
 */
export function getLunarMonthSummary(month, year) {
  const m = typeof month === 'number' ? month : 1;
  const y = typeof year === 'number' ? year : new Date().getFullYear();
  const midLunar = convertSolar2Lunar(15, m, y);

  return {
    month: midLunar.month,
    canChi: midLunar.canChi,
    fullText: `Tháng ${midLunar.month} ÂL · Năm ${midLunar.canChi}`
  };
}

/**
 * Calculates calendar day presentation data (solar day, lunar day label, matching events)
 * completely independent of any DOM structure.
 *
 * @param {number} day Day (1..31)
 * @param {number} month Month (1..12)
 * @param {number} year Year (e.g. 2026)
 * @param {Array<Object>} events List of available calendar events
 * @returns {{
 *   day: number,
 *   month: number,
 *   year: number,
 *   lunar: Object,
 *   lunarLabel: string,
 *   events: Array<Object>
 * }}
 */
export function deriveDayCalendarState(day, month, year, events = []) {
  const lunar = convertSolar2Lunar(day, month, year);
  let lunarLabel = `${lunar.day}`;
  if (lunar.day === 1 || lunar.day === 15) {
    lunarLabel = `${lunar.day}/${lunar.month}${lunar.isLeap ? ' (N)' : ''}`;
  }

  const matchingEvents = findEventsForDate(events, month, day);

  return {
    day,
    month,
    year,
    lunar,
    lunarLabel,
    events: matchingEvents
  };
}

/**
 * Computes the chronological upcoming events from a given reference date.
 * Accurately loops across the year boundary.
 *
 * @param {Array<Object>} events
 * @param {Date} [referenceDate=new Date()]
 * @param {number} [limit=4]
 * @returns {Array<Object>}
 */
export function getUpcomingEvents(events, referenceDate = new Date(), limit = 4) {
  if (!Array.isArray(events) || events.length === 0) return [];

  const ref = referenceDate instanceof Date && !isNaN(referenceDate) ? referenceDate : new Date();
  const refMonth = ref.getMonth() + 1; // 1..12
  const refDay = ref.getDate(); // 1..31
  const refYear = ref.getFullYear();

  const scored = [];
  for (const ev of events) {
    if (!ev || typeof ev !== 'object') continue;
    const m = typeof ev.month === 'number' ? ev.month : 0;
    const d = typeof ev.day === 'number' ? ev.day : 0;
    if (m < 1 || m > 12 || d < 1 || d > 31) continue;

    // Approximate days until this event occurs
    // First try this year
    const evDateThisYear = new Date(refYear, m - 1, d);
    let diffMs = evDateThisYear.getTime() - ref.getTime();
    let targetYear = refYear;

    // If event already passed today (more than 1 day ago), project to next year
    if (diffMs < -24 * 3600 * 1000) {
      const evDateNextYear = new Date(refYear + 1, m - 1, d);
      diffMs = evDateNextYear.getTime() - ref.getTime();
      targetYear = refYear + 1;
    }

    const diffDays = Math.ceil(diffMs / (24 * 3600 * 1000));
    const enriched = enrichEventWithLunar(ev, targetYear);

    scored.push({ ev: enriched, diffDays });
  }

  scored.sort((a, b) => a.diffDays - b.diffDays);
  return scored.slice(0, limit).map(item => item.ev);
}


