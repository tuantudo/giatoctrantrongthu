/**
 * GIATOC DOMAIN CORE — editorial/series.js
 * Pure business logic for MẠCH publication series and thematic issues.
 *
 * PURE DOMAIN LAYER — ZERO DOM, ZERO BROWSER GLOBALS, ZERO SIDE EFFECTS.
 */

/**
 * Resolves a series object from a registry for a given article.
 *
 * @param {Object} seriesRegistry Map of series by ID or slug
 * @param {Object} item Article record
 * @returns {Object|null} Series record or null
 */
export function resolveArticleSeries(seriesRegistry, item) {
  if (!seriesRegistry || typeof seriesRegistry !== 'object' || !item || typeof item !== 'object') {
    return null;
  }
  const id = (Array.isArray(item.seriesIds) && item.seriesIds[0])
    || item.seriesSlug
    || item.series
    || item.seriesId;
  if (!id) return null;
  return seriesRegistry[id] || null;
}

/**
 * Extracts the canonical display title for a series.
 *
 * @param {Object} series Series record
 * @param {string} [fallback='MẠCH'] Fallback title
 * @returns {string} Series title
 */
export function getSeriesTitle(series, fallback = 'MẠCH') {
  if (!series || typeof series !== 'object') return fallback;
  return series.shortTitle || series.title || series.name || fallback;
}

/**
 * Retrieves and orders all articles belonging to a specific series.
 * Respects series.articleIds ordering when present.
 *
 * @param {Object} series Series record
 * @param {Array<Object>} allArticles All available articles
 * @returns {Array<Object>} Ordered articles for the series
 */
export function getSeriesArticles(series, allArticles = []) {
  if (!series || typeof series !== 'object' || !Array.isArray(allArticles)) {
    return [];
  }

  const explicitOrder = Array.isArray(series.articleIds)
    ? series.articleIds
    : Array.isArray(series.stories) ? series.stories : null;

  if (explicitOrder && explicitOrder.length > 0) {
    const list = explicitOrder
      .map(slugOrId => allArticles.find(a => a && (a.slug === slugOrId || a.id === slugOrId)))
      .filter(Boolean);
    if (list.length > 0) return list;
  }

  const seriesKey = series.slug || series.id;
  if (!seriesKey) return [];

  return allArticles.filter(a => {
    if (!a || typeof a !== 'object') return false;
    if (a.seriesSlug === seriesKey || a.seriesId === seriesKey || a.series === seriesKey) return true;
    if (Array.isArray(a.seriesIds) && a.seriesIds.includes(seriesKey)) return true;
    return false;
  });
}

/**
 * Calculates previous and next navigation neighbors within a series.
 *
 * @param {Object} series Series record
 * @param {Array<Object>} allArticles All available articles
 * @param {string} currentSlugOrId Target article slug or ID
 * @returns {{ prev: Object|null, next: Object|null, index: number, total: number }}
 */
export function getSeriesNeighbors(series, allArticles, currentSlugOrId) {
  const empty = { prev: null, next: null, index: -1, total: 0 };
  if (!series || !currentSlugOrId) return empty;

  const seriesItems = getSeriesArticles(series, allArticles);
  if (!seriesItems.length) return empty;

  const target = String(currentSlugOrId).trim();
  const idx = seriesItems.findIndex(a => a && (a.slug === target || a.id === target));

  if (idx === -1) {
    return { prev: null, next: null, index: -1, total: seriesItems.length };
  }

  return {
    prev: idx > 0 ? seriesItems[idx - 1] : null,
    next: idx < seriesItems.length - 1 ? seriesItems[idx + 1] : null,
    index: idx,
    total: seriesItems.length
  };
}

/**
 * Filters an array of articles by series slug or ID.
 *
 * @param {Array<Object>} articles Articles to filter
 * @param {string} seriesSlugOrId Series identifier
 * @returns {Array<Object>} Filtered articles
 */
export function filterArticlesBySeries(articles, seriesSlugOrId) {
  if (!Array.isArray(articles) || !seriesSlugOrId) return [];
  const target = String(seriesSlugOrId).trim();

  return articles.filter(a => {
    if (!a || typeof a !== 'object') return false;
    if (a.seriesSlug === target || a.seriesId === target || a.series === target) return true;
    if (Array.isArray(a.seriesIds) && a.seriesIds.includes(target)) return true;
    return false;
  });
}

/**
 * Checks whether a series is of epistolary (letters/diễn ngôn thư từ) format.
 *
 * @param {Object} series Series record
 * @returns {boolean} True if epistolary
 */
export function isEpistolarySeries(series) {
  if (!series || typeof series !== 'object') return false;
  return series.seriesType === 'epistolary';
}

