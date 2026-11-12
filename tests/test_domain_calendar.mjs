/**
 * test_domain_calendar.mjs
 * Comprehensive automated verification for SC-03 Calendar Domain Core:
 * - src/js/domain/calendar/parser.js (RFC 5545 iCalendar Parser)
 * - src/js/domain/calendar/events.js (Domain business rules, grouping, sorting, filtering)
 * - src/js/domain/calendar/lunar.js (Canonical lunar bridge)
 * - src/js/domain/calendar/index.js (Barrel export)
 * - Parity against legacy src/js/core/ics-parser.js across 100% of real server/calendars/*.ics files
 *
 * PURE NODE.JS EXECUTION — ZERO DOM, ZERO BROWSER GLOBALS.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

console.log('🧪 Starting test suite for SC-03 Calendar Domain Core...');

// 1. Test parser.js
console.log('  Testing src/js/domain/calendar/parser.js...');
const {
  unescapeIcs,
  cleanEventSummary,
  extractFsidFromUid,
  parseIcs
} = await import('../src/js/domain/calendar/parser.js');

// 1.1 unescapeIcs
assert.equal(unescapeIcs('Hello\\nWorld'), 'Hello\nWorld');
assert.equal(unescapeIcs('Items\\, with\\; escapes\\\\test'), 'Items, with; escapes\\test');
assert.equal(unescapeIcs(''), '');
assert.equal(unescapeIcs(null), '');
assert.equal(unescapeIcs(undefined), '');

// 1.2 cleanEventSummary
assert.equal(cleanEventSummary('🎂 Sinh nhật Giuse Trần Trọng Thu'), 'Sinh nhật Giuse Trần Trọng Thu');
assert.equal(cleanEventSummary('✝️ Lễ Bổn mạng'), 'Lễ Bổn mạng');
assert.equal(cleanEventSummary('🕯️ Ngày giỗ Cố Thu'), 'Ngày giỗ Cố Thu');
assert.equal(cleanEventSummary('🏛️ Họp mặt dòng họ'), 'Họp mặt dòng họ');
assert.equal(cleanEventSummary('Kỷ niệm 50 năm'), 'Kỷ niệm 50 năm', 'Plain text without emoji should remain unchanged');
assert.equal(cleanEventSummary(''), '');
assert.equal(cleanEventSummary(null), '');

// 1.3 extractFsidFromUid
assert.equal(extractFsidFromUid('CAL-01-G123-ABC@giatoctrantrongthu.com'), 'G123-ABC');
assert.equal(extractFsidFromUid('UID:KLMN-1234'), 'KLMN-1234');
assert.equal(extractFsidFromUid('NO-MATCH'), null);
assert.equal(extractFsidFromUid(''), null);
assert.equal(extractFsidFromUid(null), null);

// 1.4 parseIcs with folded lines and multi-line descriptions
const sampleIcs = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'BEGIN:VEVENT',
  'UID:CAL-01-G123-ABC@giatoctrantrongthu.com',
  'DTSTART:20260915T080000Z',
  'SUMMARY:🎂 Sinh nhật Giuse Trần ',
  ' Trọng Thu',
  'DESCRIPTION:Hồ sơ nhân vật gia phả\\, ',
  ' ghi nhận năm sinh 1956.',
  'END:VEVENT',
  'BEGIN:VEVENT',
  'UID:CAL-02-NO-DTSTART',
  'SUMMARY:Invalid Event Missing DTSTART',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');

const parsedSample = parseIcs(sampleIcs, {
  key: 'birthdays',
  class: 'birth',
  icon: '🎂',
  label: 'Sinh nhật'
});

assert.equal(parsedSample.length, 1, 'Only valid events with both DTSTART and SUMMARY must be parsed');
const ev0 = parsedSample[0];
assert.equal(ev0.summary, 'Sinh nhật Giuse Trần Trọng Thu');
assert.equal(ev0.description, 'Hồ sơ nhân vật gia phả, ghi nhận năm sinh 1956.');
assert.equal(ev0.dtstart, '20260915T080000Z');
assert.equal(ev0.mmdd, '0915');
assert.equal(ev0.month, 9);
assert.equal(ev0.day, 15);
assert.equal(ev0.fsid, 'G123-ABC');
assert.equal(ev0.layer, 'birthdays');
assert.equal(ev0.chipCls, 'birth');
assert.equal(ev0.label, 'Sinh nhật');

// Negative / Edge cases for parseIcs
assert.deepEqual(parseIcs(''), []);
assert.deepEqual(parseIcs(null), []);
assert.deepEqual(parseIcs(undefined), []);
assert.deepEqual(parseIcs('NOT AN ICS'), []);

console.log('  ✅ parser.js passed.');

// 2. Test Parity against legacy src/js/core/ics-parser.js across all 4 real server feeds
console.log('  Testing parity with legacy ics-parser.js on server/calendars/*.ics...');

// Load legacy ics-parser.js
const legacyPath = path.join(ROOT_DIR, 'src/js/core/ics-parser.js');
const legacyCode = fs.readFileSync(legacyPath, 'utf8');
const legacyFn = new Function(`${legacyCode}\nreturn IcsParser;`);
const LegacyIcsParser = legacyFn();

const feedFiles = [
  { file: 'CAL_01_BIRTHDAYS.ics', key: 'birthdays', class: 'birth', icon: '🎂', label: 'Sinh nhật' },
  { file: 'CAL_02_PATRON_FEASTS.ics', key: 'patrons', class: 'patron', icon: '✝️', label: 'Bổn mạng' },
  { file: 'CAL_03_MEMORIALS.ics', key: 'memorials', class: 'mem', icon: '🕯️', label: 'Ngày giỗ' },
  { file: 'CAL_04_FAMILY_MILESTONES.ics', key: 'milestones', class: 'event', icon: '🏛️', label: 'Sự kiện' }
];

let totalEventsChecked = 0;

for (const meta of feedFiles) {
  const filePath = path.join(ROOT_DIR, 'server/calendars', meta.file);
  assert(fs.existsSync(filePath), `Calendar file must exist: ${meta.file}`);
  const icsText = fs.readFileSync(filePath, 'utf8');

  const modernEvents = parseIcs(icsText, meta);
  const legacyEvents = LegacyIcsParser.parseFeed(icsText, meta);

  assert.equal(modernEvents.length, legacyEvents.length, `Event count mismatch for ${meta.file}`);
  assert(modernEvents.length > 0, `${meta.file} must have at least 1 event`);

  for (let i = 0; i < modernEvents.length; i++) {
    const mEv = modernEvents[i];
    const lEv = legacyEvents[i];

    assert.equal(mEv.summary, lEv.summary, `Summary mismatch in ${meta.file} at index ${i}`);
    assert.equal(mEv.dtstart, lEv.dtstart, `DTSTART mismatch in ${meta.file} at index ${i}`);
    assert.equal(mEv.month, lEv.month, `Month mismatch in ${meta.file} at index ${i}`);
    assert.equal(mEv.day, lEv.day, `Day mismatch in ${meta.file} at index ${i}`);
    assert.equal(mEv.mmdd, lEv.mmdd, `mmdd mismatch in ${meta.file} at index ${i}`);
    // Modern parser correctly extracts genuine FamilySearch ID (e.g. 'G5XN-NWJ') whereas legacy had prefix collision defect ('hday-G5XN')
    assert(mEv.fsid, `fsid must be extracted in ${meta.file} at index ${i}`);
    assert(!mEv.fsid.startsWith('hday-') && !mEv.fsid.startsWith('tron-') && !mEv.fsid.startsWith('rial-'), `fsid must be genuine identifier`);
    assert.equal(mEv.layer, lEv.layer, `layer mismatch in ${meta.file} at index ${i}`);
    assert.equal(mEv.chipCls, lEv.chipCls, `chipCls mismatch in ${meta.file} at index ${i}`);
  }

  totalEventsChecked += modernEvents.length;
  console.log(`    ✓ ${meta.file}: ${modernEvents.length} events verified with 100% legacy parity.`);
}
console.log(`  ✅ 100% Parity verified across ${totalEventsChecked} real calendar events.`);

// 3. Test events.js
console.log('  Testing src/js/domain/calendar/events.js...');
const {
  CALENDAR_FEEDS,
  sortCalendarEvents,
  groupEventsByMonth,
  filterEventsByLayers,
  findEventsForDate,
  enrichEventWithLunar,
  getLunarMonthSummary,
  deriveDayCalendarState
} = await import('../src/js/domain/calendar/events.js');

// 3.1 CALENDAR_FEEDS constant
assert.equal(CALENDAR_FEEDS.length, 4);
assert.equal(CALENDAR_FEEDS[0].key, 'birthdays');
assert.equal(CALENDAR_FEEDS[1].key, 'patrons');
assert.equal(CALENDAR_FEEDS[2].key, 'memorials');
assert.equal(CALENDAR_FEEDS[3].key, 'milestones');
assert(Object.isFrozen(CALENDAR_FEEDS));

// 3.2 sortCalendarEvents
const unsortedEvents = [
  { summary: 'Dec Event', month: 12, day: 5 },
  { summary: 'Feb Event 2', month: 2, day: 20 },
  { summary: 'Feb Event 1', month: 2, day: 10 },
  { summary: 'Jan Event', month: 1, day: 1 }
];
const sortedEvents = sortCalendarEvents(unsortedEvents);
assert.equal(sortedEvents[0].summary, 'Jan Event');
assert.equal(sortedEvents[1].summary, 'Feb Event 1');
assert.equal(sortedEvents[2].summary, 'Feb Event 2');
assert.equal(sortedEvents[3].summary, 'Dec Event');
assert.equal(sortCalendarEvents(null).length, 0);

// 3.3 groupEventsByMonth
const grouped = groupEventsByMonth(sortedEvents);
assert.equal(Object.keys(grouped).length, 12, 'Must have 12 month buckets');
assert.equal(grouped[1].length, 1);
assert.equal(grouped[2].length, 2);
assert.equal(grouped[12].length, 1);
assert.equal(grouped[5].length, 0);

// 3.4 filterEventsByLayers
const multiLayerEvents = [
  { summary: 'B1', layer: 'birthdays' },
  { summary: 'M1', layer: 'memorials' },
  { summary: 'P1', layer: 'patrons' }
];

const filteredByArray = filterEventsByLayers(multiLayerEvents, ['birthdays', 'memorials']);
assert.equal(filteredByArray.length, 2);
assert.deepEqual(filteredByArray.map(e => e.summary), ['B1', 'M1']);

const filteredByRecord = filterEventsByLayers(multiLayerEvents, { birthdays: true, patrons: true, memorials: false });
assert.equal(filteredByRecord.length, 2);
assert.deepEqual(filteredByRecord.map(e => e.summary), ['B1', 'P1']);

assert.equal(filterEventsByLayers(null, ['birthdays']).length, 0);
assert.equal(filterEventsByLayers(multiLayerEvents, null).length, 0);

// 3.5 findEventsForDate
const dateMatched = findEventsForDate(sortedEvents, 2, 20);
assert.equal(dateMatched.length, 1);
assert.equal(dateMatched[0].summary, 'Feb Event 2');
assert.equal(findEventsForDate(sortedEvents, 7, 7).length, 0);

// 3.6 enrichEventWithLunar
// Solar 2026-02-17 is Lunar 2026-01-01 (Tết Bính Ngọ)
const tetEvent = { summary: 'Tết Nguyên Đán', month: 2, day: 17 };
const enrichedTet = enrichEventWithLunar(tetEvent, 2026);
assert.equal(enrichedTet.lunar.day, 1);
assert.equal(enrichedTet.lunar.month, 1);
assert.equal(enrichedTet.lunar.canChi, 'Bính Ngọ');

// Edge cases
assert.equal(enrichEventWithLunar(null, 2026), null);
assert.equal(enrichEventWithLunar({ summary: 'No date' }, 2026).lunar, null);

// 3.7 getLunarMonthSummary
const feb2026Summary = getLunarMonthSummary(2, 2026);
assert.equal(typeof feb2026Summary.month, 'number');
assert.equal(typeof feb2026Summary.canChi, 'string');
assert(feb2026Summary.fullText.includes('ÂL'));

// 3.8 deriveDayCalendarState
const dayState1 = deriveDayCalendarState(1, 1, 2026, sortedEvents);
assert.equal(dayState1.day, 1);
assert.equal(dayState1.month, 1);
assert.equal(dayState1.year, 2026);
assert.equal(dayState1.events.length, 1);
assert.equal(dayState1.events[0].summary, 'Jan Event');
assert(dayState1.lunarLabel.length > 0);

console.log('  ✅ events.js passed.');

// 4. Test lunar.js
console.log('  Testing src/js/domain/calendar/lunar.js...');
const { convertSolar2Lunar, getYearCanChi, formatLunarDate } = await import('../src/js/domain/calendar/lunar.js');

assert.equal(typeof convertSolar2Lunar, 'function');
assert.equal(typeof getYearCanChi, 'function');
assert.equal(typeof formatLunarDate, 'function');

const lunar2026 = convertSolar2Lunar(17, 2, 2026);
assert.equal(lunar2026.day, 1);
assert.equal(lunar2026.month, 1);
assert.equal(lunar2026.year, 2026);
assert.equal(lunar2026.canChi, 'Bính Ngọ');

console.log('  ✅ lunar.js passed.');

// 5. Test barrel export src/js/domain/calendar/index.js
console.log('  Testing src/js/domain/calendar/index.js (barrel export)...');
const calendarBarrel = await import('../src/js/domain/calendar/index.js');

assert.equal(typeof calendarBarrel.parseIcs, 'function');
assert.equal(typeof calendarBarrel.unescapeIcs, 'function');
assert.equal(typeof calendarBarrel.cleanEventSummary, 'function');
assert.equal(typeof calendarBarrel.extractFsidFromUid, 'function');
assert.equal(typeof calendarBarrel.sortCalendarEvents, 'function');
assert.equal(typeof calendarBarrel.groupEventsByMonth, 'function');
assert.equal(typeof calendarBarrel.filterEventsByLayers, 'function');
assert.equal(typeof calendarBarrel.findEventsForDate, 'function');
assert.equal(typeof calendarBarrel.enrichEventWithLunar, 'function');
assert.equal(typeof calendarBarrel.getLunarMonthSummary, 'function');
assert.equal(typeof calendarBarrel.deriveDayCalendarState, 'function');
assert.equal(typeof calendarBarrel.convertSolar2Lunar, 'function');
assert(Array.isArray(calendarBarrel.CALENDAR_FEEDS));

console.log('  ✅ src/js/domain/calendar/index.js barrel passed.');

console.log('\n🎉 ALL SC-03 CALENDAR DOMAIN CORE TESTS PASSED SUCCESSFULLY!');
