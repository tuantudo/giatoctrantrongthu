/**
 * GIATOC DOMAIN CORE — editorial/authors.js
 * Pure business logic for editorial authors and contributors.
 *
 * PURE DOMAIN LAYER — ZERO DOM, ZERO BROWSER GLOBALS, ZERO SIDE EFFECTS.
 */

/**
 * Resolves an author object from a registry for a given article.
 *
 * @param {Object} authorsRegistry Map of authors by ID or slug
 * @param {Object} item Article record
 * @returns {Object|null} Author record or null
 */
export function resolveArticleAuthor(authorsRegistry, item) {
  if (!authorsRegistry || typeof authorsRegistry !== 'object' || !item || typeof item !== 'object') {
    return null;
  }
  const id = (Array.isArray(item.authorIds) && item.authorIds[0])
    || item.authorId
    || item.author;
  if (!id) return null;
  return authorsRegistry[id] || null;
}

/**
 * Extracts author display name with graceful fallback.
 *
 * @param {Object} author Author record
 * @param {string} [fallback='Ban Biên Tập'] Fallback author name
 * @returns {string} Author name
 */
export function getAuthorName(author, fallback = 'Ban Biên Tập') {
  if (!author || typeof author !== 'object') return fallback;
  return author.name || author.title || fallback;
}

/**
 * Extracts author role or editorial position.
 *
 * @param {Object} author Author record
 * @param {string} [fallback=''] Fallback role
 * @returns {string} Author role
 */
export function getAuthorRole(author, fallback = '') {
  if (!author || typeof author !== 'object') return fallback;
  return author.role || fallback;
}

/**
 * Extracts author bio or profile description.
 *
 * @param {Object} author Author record
 * @param {string} [fallback=''] Fallback bio
 * @returns {string} Author bio
 */
export function getAuthorBio(author, fallback = '') {
  if (!author || typeof author !== 'object') return fallback;
  return author.bio || fallback;
}

/**
 * Generates single-character initials for author avatar placeholder.
 *
 * @param {Object} author Author record
 * @param {string} [fallback='B'] Fallback initial character
 * @returns {string} Single uppercase letter
 */
export function getAuthorInitials(author, fallback = 'B') {
  const name = getAuthorName(author, fallback);
  const clean = name.trim();
  return clean ? clean.charAt(0).toUpperCase() : fallback;
}

/**
 * Filters an array of articles by author ID or slug.
 *
 * @param {Array<Object>} articles Articles to filter
 * @param {string} authorIdOrSlug Author identifier
 * @returns {Array<Object>} Filtered articles
 */
export function filterArticlesByAuthor(articles, authorIdOrSlug) {
  if (!Array.isArray(articles) || !authorIdOrSlug) return [];
  const target = String(authorIdOrSlug).trim();

  return articles.filter(a => {
    if (!a || typeof a !== 'object') return false;
    if (a.authorId === target || a.author === target) return true;
    if (Array.isArray(a.authorIds) && a.authorIds.includes(target)) return true;
    return false;
  });
}

