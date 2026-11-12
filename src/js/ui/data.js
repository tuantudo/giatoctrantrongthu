/**
 * GIATOC UI SYSTEM vNEXT — data.js
 * Backward-compatible Facade over Data Inversion Layer (Platform Data Service).
 *
 * Supports dual operation modes:
 *   1. LIVE API MODE (Default in production / staging)
 *   2. VIBECODE LAB MOCK MODE (When window.__GIATOC_MOCK__ is true or in lab testing)
 *      Routes calls to 100% synthetic, PII-free datasets in fixtures/ via MockDataAdapter.
 */

import { createDataService } from '../platform/data/index.js';
import { isMockEnabled, mountLabSwitcher } from './mock-adapter.js';

// Auto-mount Lab Persona Switcher if mock mode is detected in browser
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (isMockEnabled()) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => mountLabSwitcher());
    } else {
      mountLabSwitcher();
    }
  }
}

/**
 * Platform DataService instance.
 * Mode is auto-detected ('live' vs 'mock').
 */
export const dataService = createDataService();

const legacyCache = new Map();

/**
 * Low-level JSON fetcher with optional caching and 401 redirection.
 * Maintained for backward compatibility.
 */
export async function fetchJSON(url, { cacheKey = null, signal = null } = {}) {
  if (cacheKey && legacyCache.has(cacheKey)) return legacyCache.get(cacheKey);
  let res;
  try {
    res = await fetch(url, { credentials: 'same-origin', signal });
  } catch (netErr) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('giatoc:server-offline', { detail: { error: netErr } }));
    }
    throw netErr;
  }
  if (res.status === 401) {
    if (typeof window !== 'undefined' && window.location) {
      const publicPaths = ['/', '/login', '/help', '/help/recovery'];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }
    throw new Error('Phiên đăng nhập đã hết hạn.');
  }
  if (res.status === 502 || res.status === 503 || res.status === 504 || res.status === 1033) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('giatoc:server-offline', { detail: { status: res.status } }));
    }
  }
  if (!res.ok) throw new Error(`Tải dữ liệu thất bại (HTTP ${res.status}).`);
  const data = await res.json();
  if (cacheKey) legacyCache.set(cacheKey, data);
  return data;
}

/**
 * Unified API Facade consumed by all UI modules.
 * Delegated to Platform DataService to fulfill Dependency Inversion Principle (DIP).
 */
export const api = {
  memberProfile: (options) => dataService.memberProfile(options),
  genealogy: (options) => dataService.genealogy(options),
  media: (options) => dataService.media(options),
  personMedia: (options) => dataService.personMedia(options),
  mach: (options) => dataService.mach(options),
  clara: (options) => dataService.clara(options),
  submitProposal: (proposalData) => dataService.submitProposal(proposalData)
};

/**
 * Domain entity re-exports from Genealogy Domain.
 * Maintained for 100% backward compatibility with existing view controllers.
 */
export { indexPeople, nameOf } from '../domain/genealogy/index.js';
