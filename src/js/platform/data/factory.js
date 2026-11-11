/**
 * GIATOC PLATFORM — data/factory.js
 * Factory for creating configured DataService instances with automatic mode detection.
 */

import { DataService } from './service.js';
import { HttpDataAdapter } from './http-adapter.js';
import { MockDataAdapter } from './mock-adapter.js';

/**
 * Determine if mock mode is requested via browser query string, localStorage, or env var.
 * @returns {boolean}
 */
export function isMockRequested() {
  if (typeof window !== 'undefined') {
    if (window.__GIATOC_MOCK__ === true) return true;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('mock') === '1' || urlParams.get('mock') === 'true') {
        return true;
      }
      if (window.localStorage && window.localStorage.getItem('giatoc_mock') === 'true') {
        return true;
      }
    } catch {
      // Browser security sandbox might restrict search or localStorage
    }
  } else if (typeof process !== 'undefined' && process.env) {
    if (process.env.GIATOC_MOCK === '1' || process.env.GIATOC_MOCK === 'true') {
      return true;
    }
  }
  return false;
}

/**
 * Detect runtime data mode.
 * @returns {'mock'|'live'}
 */
export function detectMode() {
  return isMockRequested() ? 'mock' : 'live';
}

/**
 * Factory creating DataService.
 * @param {Object} [config={}]
 * @param {Object} [config.adapter] - Explicit adapter instance.
 * @param {'auto'|'mock'|'live'} [config.mode='auto'] - Resolution mode.
 * @param {Object} [config.httpOptions] - Options passed to HttpDataAdapter.
 * @param {Object} [config.mockOptions] - Options passed to MockDataAdapter.
 * @param {Object} [config.serviceOptions] - Options passed to DataService.
 * @returns {DataService}
 */
export function createDataService(config = {}) {
  const {
    adapter,
    mode = 'auto',
    httpOptions,
    mockOptions,
    ...serviceOptions
  } = config;

  if (adapter) {
    return new DataService(adapter, serviceOptions);
  }

  const effectiveMode = mode === 'auto' ? detectMode() : mode;

  let selectedAdapter;
  if (effectiveMode === 'mock') {
    selectedAdapter = new MockDataAdapter(mockOptions);
  } else {
    selectedAdapter = new HttpDataAdapter(httpOptions);
  }

  return new DataService(selectedAdapter, serviceOptions);
}
