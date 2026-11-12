/**
 * GIATOC PLATFORM — data/http-adapter.js
 * Live HTTP Data Adapter making network calls to backend REST endpoints.
 */

export class HttpDataAdapter {
  /**
   * @param {Object} [options={}]
   * @param {string} [options.baseUrl='']
   * @param {Function} [options.fetchFn]
   * @param {string} [options.credentials='same-origin']
   * @param {Function} [options.on401]
   */
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || '';
    const rawFetch = options.fetchFn || (typeof window !== 'undefined' ? window.fetch : globalThis.fetch);
    this.fetchFn = typeof rawFetch === 'function' ? rawFetch.bind(typeof window !== 'undefined' ? window : globalThis) : rawFetch;
    this.credentials = options.credentials || 'same-origin';
    this.on401 = options.on401 || ((url, res) => {
      if (typeof window !== 'undefined' && window.location) {
        const publicPaths = ['/', '/login', '/help', '/help/recovery'];
        if (!publicPaths.includes(window.location.pathname)) {
          window.location.href = '/login';
        }
      }
    });
  }

  async request(endpoint, options = {}) {
    if (typeof this.fetchFn !== 'function') {
      throw new Error('HttpDataAdapter: No fetch function available.');
    }
    const url = `${this.baseUrl}${endpoint}`;
    const { signal, headers, credentials = this.credentials } = options;

    let res;
    try {
      res = await this.fetchFn(url, { credentials, signal, headers });
    } catch (netErr) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('giatoc:server-offline', { detail: { error: netErr, endpoint } }));
      }
      throw netErr;
    }

    if (res.status === 401) {
      if (typeof this.on401 === 'function') {
        this.on401(url, res);
      }
      const err = new Error('Phiên đăng nhập đã hết hạn.');
      err.status = 401;
      throw err;
    }

    if (res.status === 502 || res.status === 503 || res.status === 504 || res.status === 1033) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('giatoc:server-offline', { detail: { status: res.status, endpoint } }));
      }
    }

    if (!res.ok) {
      const err = new Error(`Tải dữ liệu thất bại (HTTP ${res.status}).`);
      err.status = res.status;
      throw err;
    }

    return await res.json();
  }

  async memberProfile(options = {}) {
    return this.request('/api/member/profile', options);
  }

  async genealogy(options = {}) {
    return this.request('/api/genealogy.json', options);
  }

  async media(options = {}) {
    return this.request('/api/media.json', options);
  }

  async personMedia(options = {}) {
    return this.request('/api/person_media.json', options);
  }

  async mach(options = {}) {
    return this.request('/api/mach.json', options);
  }

  async clara(options = {}) {
    return this.request('/api/member/clara.json', options);
  }

  async submitProposal(proposalData, options = {}) {
    if (typeof this.fetchFn !== 'function') {
      throw new Error('HttpDataAdapter: No fetch function available.');
    }
    const url = `${this.baseUrl}/api/member/proposals`;
    const { signal, credentials = this.credentials } = options;
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    let res;
    try {
      res = await this.fetchFn(url, {
        method: 'POST',
        credentials,
        signal,
        headers,
        body: JSON.stringify(proposalData)
      });
    } catch (netErr) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('giatoc:server-offline', { detail: { error: netErr, endpoint: '/api/member/proposals' } }));
      }
      throw netErr;
    }

    if (res.status === 401) {
      if (typeof this.on401 === 'function') {
        this.on401(url, res);
      }
      const err = new Error('Phiên đăng nhập đã hết hạn.');
      err.status = 401;
      throw err;
    }

    if (res.status === 502 || res.status === 503 || res.status === 504 || res.status === 1033) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('giatoc:server-offline', { detail: { status: res.status, endpoint: '/api/member/proposals' } }));
      }
    }

    if (!res.ok) {
      const err = new Error(`Gửi đề xuất thất bại (HTTP ${res.status}).`);
      err.status = res.status;
      throw err;
    }

    return await res.json();
  }
}
