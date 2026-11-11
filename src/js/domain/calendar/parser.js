/**
 * GIATOC DOMAIN CORE — calendar/parser.js
 * RFC 5545 iCalendar Parser for family calendar feeds.
 *
 * ZERO DOM DEPENDENCY — Pure functions executable in browser and Node.js.
 */

/**
 * Unescapes RFC 5545 text sequences: \n, \,, \;, \\.
 *
 * @param {string} v Raw escaped text
 * @returns {string} Unescaped text
 */
export function unescapeIcs(v) {
  if (!v) return '';
  return String(v)
    .replace(/\\n/g, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\');
}

/**
 * Strips leading decorative emojis often prefixed to calendar event titles.
 *
 * @param {string} summary
 * @returns {string}
 */
export function cleanEventSummary(summary) {
  if (!summary) return '';
  return summary.replace(/^[\u{1F300}-\u{1FAFF}\u2600-\u27BF\u2B00-\u2BFF\uFE0F]+\s*/u, '');
}

/**
 * Extracts FamilySearch ID (e.g. "G123-ABC" or "KLMN-1234") from UID string if present.
 *
 * @param {string} uid
 * @returns {string|null}
 */
export function extractFsidFromUid(uid) {
  if (!uid || typeof uid !== 'string') return null;
  const match = uid.match(/([A-Z0-9]{4}-[A-Z0-9]{3,4})@/i) || uid.match(/(?:^|[^a-z0-9])([A-Z0-9]{4}-[A-Z0-9]{3,4})(?:$|[^a-z0-9])/i);
  return match ? (match[1] || match[0]).trim() : null;
}

/**
 * Parses an RFC 5545 .ics text feed into structured VEVENT objects.
 * Handles unfolded lines, UID, DTSTART, SUMMARY, and DESCRIPTION fields.
 *
 * @param {string} icsText Raw iCalendar feed string
 * @param {Object} [feedMeta={}] Metadata descriptors for the feed (key, class, icon, label)
 * @returns {Array<Object>} List of parsed event objects
 */
export function parseIcs(icsText, feedMeta = {}) {
  if (!icsText || typeof icsText !== 'string') return [];

  const meta = feedMeta || {};
  // RFC 5545 unfolding: replace CRLF or LF followed by a space or tab
  const unfolded = icsText.replace(/\r?\n[ \t]/g, '');
  const lines = unfolded.split(/\r?\n/);
  const events = [];

  let inEv = false;
  let cur = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === 'BEGIN:VEVENT') {
      inEv = true;
      cur = {
        layer: meta.key || '',
        chipCls: meta.class || '',
        icon: meta.icon || '',
        label: meta.label || ''
      };
    } else if (trimmed === 'END:VEVENT') {
      if (inEv && cur.summary && cur.dtstart) {
        cur.mmdd = cur.dtstart.length >= 8 ? cur.dtstart.substring(4, 8) : '';
        cur.month = parseInt(cur.dtstart.substring(4, 6), 10) || 0;
        cur.day = parseInt(cur.dtstart.substring(6, 8), 10) || 0;
        cur.fsid = extractFsidFromUid(cur.uid);

        events.push(cur);
      }
      inEv = false;
      cur = {};
    } else if (inEv) {
      const idx = line.indexOf(':');
      if (idx > -1) {
        const keyPart = line.substring(0, idx).split(';')[0].toUpperCase();
        const valPart = line.substring(idx + 1);

        if (keyPart === 'SUMMARY') {
          cur.summary = cleanEventSummary(unescapeIcs(valPart));
        } else if (keyPart === 'DTSTART') {
          cur.dtstart = valPart.trim();
        } else if (keyPart === 'DESCRIPTION') {
          cur.description = unescapeIcs(valPart);
        } else if (keyPart === 'UID') {
          cur.uid = valPart.trim();
        }
      }
    }
  }

  return events;
}

export default {
  unescapeIcs,
  cleanEventSummary,
  extractFsidFromUid,
  parseIcs
};

