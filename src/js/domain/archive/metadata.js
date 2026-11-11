/**
 * GIATOC DOMAIN CORE — archive/metadata.js
 * Pure business logic and metadata helpers for archive media assets.
 *
 * PURE DOMAIN LAYER — ZERO DOM, ZERO BROWSER GLOBALS, ZERO SIDE EFFECTS.
 */

/**
 * Standard supported media kinds within the Gia Tộc archive domain.
 */
export const SUPPORTED_MEDIA_KINDS = Object.freeze([
  'portrait',
  'document',
  'grave',
  'milestone',
  'family'
]);

/**
 * Common image MIME types supported across the archive catalog.
 */
export const SUPPORTED_IMAGE_MIME_TYPES = Object.freeze([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif'
]);

/**
 * Validates whether a given MIME type string represents an image.
 *
 * @param {string} mimeType MIME type candidate
 * @returns {boolean} True if MIME is an image type
 */
export function isImageMimeType(mimeType) {
  if (typeof mimeType !== 'string') return false;
  const trimmed = mimeType.trim().toLowerCase();
  if (!trimmed) return false;
  return trimmed.startsWith('image/');
}

/**
 * Validates a media item record for required domain fields:
 * - assetId (or id)
 * - kind
 * - file (or path, or url)
 *
 * @param {Object} mediaItem Media asset record
 * @returns {{ valid: boolean, errors: string[] }} Validation result
 */
export function validateMediaRecord(mediaItem) {
  const errors = [];
  if (!mediaItem || typeof mediaItem !== 'object' || Array.isArray(mediaItem)) {
    return { valid: false, errors: ['Media item must be a non-null object'] };
  }

  const assetId = mediaItem.assetId || mediaItem.id;
  if (!assetId || typeof assetId !== 'string' || !assetId.trim()) {
    errors.push('Media item must have a non-empty assetId or id');
  }

  const kind = mediaItem.kind;
  if (!kind || typeof kind !== 'string' || !kind.trim()) {
    errors.push('Media item must have a valid non-empty kind');
  }

  const fileRef = mediaItem.file || mediaItem.path || mediaItem.url;
  if (!fileRef || typeof fileRef !== 'string' || !fileRef.trim()) {
    errors.push('Media item must have a valid non-empty file, path, or url');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Normalizes a media kind string into lowercase canonical form.
 *
 * @param {string} kind Input kind string
 * @returns {string} Normalized kind or 'unknown'
 */
export function normalizeMediaKind(kind) {
  if (typeof kind !== 'string') return 'unknown';
  const trimmed = kind.trim().toLowerCase();
  return trimmed || 'unknown';
}

/**
 * Returns a human-friendly label for a media kind in Vietnamese.
 *
 * @param {string} kind Media kind
 * @param {string} [locale='vi-VN'] Locale
 * @returns {string} Localized label
 */
export function getMediaKindLabel(kind, locale = 'vi-VN') {
  const norm = normalizeMediaKind(kind);
  const labelsVi = {
    portrait: 'Chân dung',
    document: 'Tài liệu',
    grave: 'Mộ phần',
    milestone: 'Cột mốc',
    family: 'Gia đình'
  };

  if (locale.startsWith('vi') && labelsVi[norm]) {
    return labelsVi[norm];
  }
  return norm.charAt(0).toUpperCase() + norm.slice(1);
}

/**
 * Formats or extracts the caption/title for a media item.
 * Falls back in order: title -> caption -> description -> provenance.description -> provenance.originalName -> fallback.
 *
 * @param {Object} mediaItem Media asset item
 * @param {string} [fallback=''] Fallback caption if none is found
 * @returns {string} Trimmed caption or fallback
 */
export function formatMediaCaption(mediaItem, fallback = '') {
  if (!mediaItem || typeof mediaItem !== 'object') {
    return fallback;
  }

  const candidates = [
    mediaItem.title,
    mediaItem.caption,
    mediaItem.description,
    mediaItem.provenance && mediaItem.provenance.description,
    mediaItem.provenance && mediaItem.provenance.originalName,
    mediaItem.provenance && mediaItem.provenance.sourceName
  ];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
  }

  return fallback;
}

/**
 * Calculates greatest common divisor helper for aspect ratio strings.
 *
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

/**
 * Extracts dimensions (width, height) and calculates/parses aspect ratio for a media item.
 *
 * @param {Object} mediaItem Media asset item
 * @returns {{ width: number|null, height: number|null, aspectRatio: number|null, aspectRatioString: string|null }}
 */
export function getMediaDimensionsOrAspect(mediaItem) {
  const result = {
    width: null,
    height: null,
    aspectRatio: null,
    aspectRatioString: null
  };

  if (!mediaItem || typeof mediaItem !== 'object') {
    return result;
  }

  const rawWidth = mediaItem.width ?? mediaItem.dimensions?.width;
  const rawHeight = mediaItem.height ?? mediaItem.dimensions?.height;

  const w = Number(rawWidth);
  const h = Number(rawHeight);

  if (Number.isFinite(w) && w > 0 && Number.isFinite(h) && h > 0) {
    result.width = w;
    result.height = h;
    result.aspectRatio = w / h;

    const divisor = gcd(Math.round(w), Math.round(h));
    if (divisor > 0) {
      result.aspectRatioString = `${Math.round(w) / divisor}:${Math.round(h) / divisor}`;
    }
    return result;
  }

  // Check if aspect ratio is provided as string or number
  const rawAspect = mediaItem.aspectRatio ?? mediaItem.aspect ?? mediaItem.dimensions?.aspectRatio;
  if (typeof rawAspect === 'number' && Number.isFinite(rawAspect) && rawAspect > 0) {
    result.aspectRatio = rawAspect;
    result.aspectRatioString = `${rawAspect.toFixed(2)}:1`;
    return result;
  }

  if (typeof rawAspect === 'string') {
    const trimmed = rawAspect.trim();
    if (trimmed.includes(':') || trimmed.includes('/')) {
      const parts = trimmed.split(/[:/]/);
      if (parts.length === 2) {
        const pw = Number(parts[0]);
        const ph = Number(parts[1]);
        if (Number.isFinite(pw) && pw > 0 && Number.isFinite(ph) && ph > 0) {
          result.aspectRatio = pw / ph;
          result.aspectRatioString = `${pw}:${ph}`;
          return result;
        }
      }
    }
    const parsedNum = Number(trimmed);
    if (Number.isFinite(parsedNum) && parsedNum > 0) {
      result.aspectRatio = parsedNum;
      result.aspectRatioString = `${parsedNum.toFixed(2)}:1`;
      return result;
    }
  }

  return result;
}
