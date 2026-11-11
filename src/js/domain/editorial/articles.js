/**
 * GIATOC DOMAIN CORE — editorial/articles.js
 * Pure business logic and domain operations for MẠCH and editorial articles.
 *
 * PURE DOMAIN LAYER — ZERO DOM, ZERO BROWSER GLOBALS, ZERO SIDE EFFECTS.
 */

/**
 * Extracts the primary summary or excerpt from an article record.
 * Falls back in order: excerpt -> deckLead -> subtitle -> deck -> dek.
 *
 * @param {Object} item Article item record
 * @returns {string} Trimmed summary string or empty string
 */
export function extractArticleSummary(item) {
  if (!item || typeof item !== 'object') return '';
  const candidate = item.excerpt || item.deckLead || item.subtitle || item.deck || item.dek || '';
  return typeof candidate === 'string' ? candidate.trim() : '';
}

/**
 * Extracts a normalized title for an article record.
 *
 * @param {Object} item Article item record
 * @param {string} [fallback='Chưa có tiêu đề'] Fallback title
 * @returns {string} Article title
 */
export function extractArticleTitle(item, fallback = 'Chưa có tiêu đề') {
  if (!item || typeof item !== 'object') return fallback;
  const candidate = item.title || item.shortTitle;
  if (typeof candidate === 'string' && candidate.trim()) {
    return candidate.trim();
  }
  return fallback;
}

/**
 * Formats a publication date into Vietnamese standard long format.
 * Pure date formatting without DOM or browser dependencies.
 *
 * @param {string|Date|number} value Date input
 * @param {string} [locale='vi-VN'] Locale string
 * @returns {string|null} Formatted date string or null if invalid
 */
export function formatEditorialDate(value, locale = 'vi-VN') {
  if (!value) return null;
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(value);
  }
  if (typeof value === 'number') {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    // Check if it matches ISO date / timestamp pattern (e.g. 2026-07-03 or 2026-07-03T16:38:00+07:00)
    if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(trimmed)) {
      const d = new Date(trimmed);
      if (!Number.isNaN(d.getTime())) {
        return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
      }
    }
    // If it's already a human/editorial descriptive text string (e.g. "MẠCH — Số 01 (2026)")
    return trimmed;
  }
  return null;
}

/**
 * Checks if an article contains readable content (either blocks or contentMarkdown).
 *
 * @param {Object} item Article item record
 * @returns {boolean} True if article has readable content
 */
export function hasArticleContent(item) {
  if (!item || typeof item !== 'object') return false;
  if (Array.isArray(item.blocks) && item.blocks.length > 0) return true;
  if (typeof item.contentMarkdown === 'string' && item.contentMarkdown.trim().length > 0) return true;
  return false;
}

/**
 * Cleans raw markdown content by removing YAML frontmatter and leading H1 header.
 *
 * @param {string} markdown Raw markdown string
 * @returns {string} Cleaned markdown text
 */
export function cleanMarkdownContent(markdown) {
  if (typeof markdown !== 'string') return '';
  let text = markdown.replace(/^---[\s\S]*?---\s*/, '').trim();
  text = text.replace(/^#\s+[^\n]+\n+/, '').trim();
  return text;
}

/**
 * Splits markdown content into an array of clean paragraphs.
 *
 * @param {string} markdown Raw or cleaned markdown string
 * @returns {string[]} Array of non-empty paragraphs
 */
export function splitMarkdownParagraphs(markdown) {
  const clean = cleanMarkdownContent(markdown);
  if (!clean) return [];
  return clean
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);
}

/**
 * Extracts plain text items from an array of structured content blocks.
 *
 * @param {Array<Object>} blocks Array of content blocks
 * @returns {Array<{ type: string, text: string }>} Extracted text entries
 */
export function extractBlocksText(blocks) {
  if (!Array.isArray(blocks)) return [];
  const results = [];
  for (const b of blocks) {
    if (!b || typeof b !== 'object') continue;
    const raw = b.text || b.html || '';
    if (typeof raw === 'string' && raw.trim()) {
      results.push({
        type: b.type || 'paragraph',
        text: raw.trim()
      });
    }
  }
  return results;
}

/**
 * Pure article sorting by order, date, or title.
 * Does NOT mutate the source array.
 *
 * @param {Array<Object>} articles Array of articles
 * @param {Object} options Sorting options
 * @param {'order'|'date'|'title'} [options.sortBy='order'] Sorting criterion
 * @param {'asc'|'desc'} [options.direction='asc'] Sort direction
 * @returns {Array<Object>} Sorted copy of articles
 */
export function sortArticles(articles, { sortBy = 'order', direction = 'asc' } = {}) {
  if (!Array.isArray(articles)) return [];
  const copy = articles.slice();
  const dir = direction === 'desc' ? -1 : 1;

  copy.sort((a, b) => {
    if (!a && !b) return 0;
    if (!a) return 1;
    if (!b) return -1;

    if (sortBy === 'order') {
      const orderA = Number.isFinite(a.editorialOrder)
        ? a.editorialOrder
        : Number.isFinite(a.seriesOrder) ? a.seriesOrder : 999999;
      const orderB = Number.isFinite(b.editorialOrder)
        ? b.editorialOrder
        : Number.isFinite(b.seriesOrder) ? b.seriesOrder : 999999;
      if (orderA !== orderB) return (orderA - orderB) * dir;
      // Secondary sort: title
      return String(a.title || '').localeCompare(String(b.title || ''), 'vi') * dir;
    }

    if (sortBy === 'date') {
      const timeA = new Date(a.publishedAt || a.date || a.updatedAt || 0).getTime() || 0;
      const timeB = new Date(b.publishedAt || b.date || b.updatedAt || 0).getTime() || 0;
      if (timeA !== timeB) return (timeA - timeB) * dir;
      return 0;
    }

    if (sortBy === 'title') {
      const titleA = String(a.title || a.shortTitle || '').normalize('NFC');
      const titleB = String(b.title || b.shortTitle || '').normalize('NFC');
      return titleA.localeCompare(titleB, 'vi') * dir;
    }

    return 0;
  });

  return copy;
}

/**
 * Paginates a list of articles.
 *
 * @param {Array<Object>} articles Array of articles
 * @param {Object} options Pagination options
 * @param {number} [options.page=1] Current page number (1-indexed)
 * @param {number} [options.pageSize=10] Items per page
 * @returns {{ items: Array<Object>, total: number, page: number, pageSize: number, totalPages: number, hasNext: boolean, hasPrev: boolean }}
 */
export function paginateArticles(articles, { page = 1, pageSize = 10 } = {}) {
  const list = Array.isArray(articles) ? articles : [];
  const total = list.length;
  const validPageSize = Math.max(1, Number(pageSize) || 10);
  const totalPages = Math.max(1, Math.ceil(total / validPageSize));
  const validPage = Math.min(Math.max(1, Number(page) || 1), totalPages);

  const start = (validPage - 1) * validPageSize;
  const items = list.slice(start, start + validPageSize);

  return {
    items,
    total,
    page: validPage,
    pageSize: validPageSize,
    totalPages,
    hasNext: validPage < totalPages,
    hasPrev: validPage > 1
  };
}

/**
 * Normalizes text for search indexing and comparison.
 *
 * @param {string} text Text to normalize
 * @returns {string} Lowercase, trimmed string
 */
function normalizeSearchText(text) {
  if (typeof text !== 'string') return '';
  return text.toLowerCase().normalize('NFC').trim();
}

/**
 * Searches articles matching a keyword query across title, shortTitle,
 * summary, topics, and author.
 *
 * @param {Array<Object>} articles Array of articles
 * @param {string} query Search keyword
 * @returns {Array<Object>} Matching articles
 */
export function searchArticles(articles, query) {
  if (!Array.isArray(articles)) return [];
  const q = normalizeSearchText(query);
  if (!q) return articles.slice();

  return articles.filter(a => {
    if (!a || typeof a !== 'object') return false;
    if (normalizeSearchText(a.title).includes(q)) return true;
    if (normalizeSearchText(a.shortTitle).includes(q)) return true;
    if (normalizeSearchText(a.subtitle).includes(q)) return true;
    if (normalizeSearchText(extractArticleSummary(a)).includes(q)) return true;
    if (normalizeSearchText(a.authorId).includes(q)) return true;
    if (normalizeSearchText(a.seriesSlug).includes(q)) return true;
    if (Array.isArray(a.topics) && a.topics.some(t => normalizeSearchText(t).includes(q))) return true;
    if (Array.isArray(a.topicIds) && a.topicIds.some(t => normalizeSearchText(t).includes(q))) return true;
    return false;
  });
}

/**
 * Finds an article by its slug or ID.
 *
 * @param {Array<Object>} articles Array of articles
 * @param {string} slugOrId Article slug or ID
 * @returns {Object|null} Matching article or null
 */
export function findArticleBySlug(articles, slugOrId) {
  if (!Array.isArray(articles) || !slugOrId) return null;
  const target = String(slugOrId).trim();
  return articles.find(a => a && (a.slug === target || a.id === target)) || null;
}

/**
 * Validates basic structural contract of an article record.
 *
 * @param {Object} item Article item
 * @returns {{ valid: boolean, errors: string[] }} Validation result
 */
export function validateArticleStructure(item) {
  const errors = [];
  if (!item || typeof item !== 'object') {
    return { valid: false, errors: ['Item must be a non-null object'] };
  }
  if (!item.id && !item.slug) {
    errors.push('Article must have either an id or a slug');
  }
  if (!item.title || !String(item.title).trim()) {
    errors.push('Article must have a non-empty title');
  }
  return {
    valid: errors.length === 0,
    errors
  };
}
