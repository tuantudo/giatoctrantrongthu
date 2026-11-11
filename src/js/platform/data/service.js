/**
 * GIATOC PLATFORM — data/service.js
 * Platform Data Service wrapping underlying data adapter with in-memory caching.
 *
 * PURE PLATFORM LAYER — ZERO DOM, ZERO BROWSER GLOBALS.
 */

export class DataService {
  /**
   * @param {Object} adapter - Data adapter implementing the data access contract.
   * @param {Object} [options={}] - Service options.
   * @param {number|null} [options.defaultTtl=null] - Default TTL in milliseconds (null = indefinite).
   */
  constructor(adapter, options = {}) {
    if (!adapter) {
      throw new Error('DataService requires an underlying adapter.');
    }
    this.adapter = adapter;
    this.cache = new Map();
    this.defaultTtl = options.defaultTtl ?? null;
  }

  getAdapter() {
    return this.adapter;
  }

  setAdapter(adapter) {
    if (!adapter) throw new Error('DataService adapter cannot be null or undefined.');
    this.adapter = adapter;
  }

  /**
   * Check if a cache key exists and has not expired.
   * @param {string} key
   * @returns {boolean}
   */
  hasCached(key) {
    if (!this.cache.has(key)) return false;
    const entry = this.cache.get(key);
    if (entry.expiresAt !== null && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  /**
   * Retrieve cached item if valid.
   * @param {string} key
   * @returns {*|undefined}
   */
  getCached(key) {
    if (!this.hasCached(key)) return undefined;
    return this.cache.get(key).value;
  }

  /**
   * Set cached item with optional TTL.
   * @param {string} key
   * @param {*} value
   * @param {number|null} [ttl=this.defaultTtl]
   */
  setCached(key, value, ttl = this.defaultTtl) {
    const expiresAt = typeof ttl === 'number' && ttl > 0 ? Date.now() + ttl : null;
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Clear a specific cache entry, or clear all cache if key is omitted.
   * @param {string} [key]
   */
  clearCache(key) {
    if (key !== undefined) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Internal execution wrapper applying caching rules.
   * @private
   */
  async _execute(methodName, defaultKey, options = {}) {
    if (typeof this.adapter[methodName] !== 'function') {
      throw new Error(`DataService: Adapter does not implement method "${methodName}".`);
    }

    const {
      cacheKey: explicitCacheKey,
      bypassCache = false,
      ttl = this.defaultTtl
    } = options;

    const cacheKey = (explicitCacheKey === null || explicitCacheKey === false)
      ? null
      : (explicitCacheKey || defaultKey);

    if (cacheKey && !bypassCache && this.hasCached(cacheKey)) {
      return this.getCached(cacheKey);
    }

    const data = await this.adapter[methodName](options);

    if (cacheKey) {
      this.setCached(cacheKey, data, ttl);
    }

    return data;
  }

  async memberProfile(options = {}) {
    return this._execute('memberProfile', 'member:profile', options);
  }

  async genealogy(options = {}) {
    return this._execute('genealogy', 'genealogy', options);
  }

  async media(options = {}) {
    return this._execute('media', 'media', options);
  }

  async personMedia(options = {}) {
    return this._execute('personMedia', 'person-media', options);
  }

  async mach(options = {}) {
    return this._execute('mach', 'mach', options);
  }

  async clara(options = {}) {
    return this._execute('clara', 'clara', options);
  }

  async submitProposal(proposalData) {
    if (typeof this.adapter.submitProposal !== 'function') {
      throw new Error('DataService: Adapter does not implement method "submitProposal".');
    }
    return this.adapter.submitProposal(proposalData);
  }
}
