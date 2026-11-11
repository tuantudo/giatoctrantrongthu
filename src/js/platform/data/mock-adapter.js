/**
 * GIATOC PLATFORM — data/mock-adapter.js
 * Vibecode Lab In-Memory Mock Adapter wrapping synthetic fixtures.
 */

export class MockDataAdapter {
  /**
   * @param {Object} [options={}]
   * @param {Object} [options.fixtures] - In-memory preloaded fixtures map
   * @param {string} [options.fixtureBasePath='/fixtures']
   * @param {Function} [options.fixtureLoader] - Custom loader async (path) => data
   * @param {Function} [options.fetchFn]
   * @param {string} [options.persona] - Default persona key
   * @param {Function} [options.personaGetter] - Custom persona resolver
   */
  constructor(options = {}) {
    this.fixtures = options.fixtures || {};
    this.fixtureBasePath = options.fixtureBasePath || '/fixtures';
    this.fixtureLoader = options.fixtureLoader || null;
    const rawFetch = options.fetchFn || (typeof window !== 'undefined' ? window.fetch : globalThis.fetch);
    this.fetchFn = typeof rawFetch === 'function' ? rawFetch.bind(typeof window !== 'undefined' ? window : globalThis) : rawFetch;
    this.currentPersona = options.persona || null;
    this.personaGetter = options.personaGetter || null;
    this._cache = {};
  }

  getPersonaKey() {
    if (typeof this.personaGetter === 'function') {
      return this.personaGetter();
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = window.localStorage.getItem('giatoc_mock_persona');
        if (stored) return stored;
      } catch {
        // ignore
      }
    }
    return this.currentPersona || 'A-HD';
  }

  setPersonaKey(key) {
    this.currentPersona = key;
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem('giatoc_mock_persona', key);
      } catch {
        // ignore
      }
    }
  }

  async _loadFixture(filename) {
    // 1. Direct in-memory fixtures injected via constructor
    const nameKey = filename.replace(/\.json$/, '').replace(/^synthetic_/, '');
    if (this.fixtures[filename]) return this.fixtures[filename];
    if (this.fixtures[nameKey]) return this.fixtures[nameKey];

    // 2. Adapter internal cache
    if (this._cache[filename]) return this._cache[filename];

    // 3. Custom fixture loader if provided
    if (typeof this.fixtureLoader === 'function') {
      const data = await this.fixtureLoader(filename);
      this._cache[filename] = data;
      return data;
    }

    const fixturePath = `${this.fixtureBasePath}/${filename}`;

    // 4. In Node.js environment (including test environments with mocked window)
    if (typeof process !== 'undefined' && process.versions?.node) {
      try {
        const { readFile } = await import('node:fs/promises');
        const { resolve } = await import('node:path');
        const filePath = resolve(process.cwd(), fixturePath.replace(/^\//, ''));
        const content = await readFile(filePath, 'utf-8');
        const data = JSON.parse(content);
        this._cache[filename] = data;
        return data;
      } catch (err) {
        // Fallback to fetch if fs fails
      }
    }

    // 5. Standard fetch in browser or configured fetchFn
    if (typeof this.fetchFn === 'function') {
      try {
        const res = await this.fetchFn(fixturePath);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        this._cache[filename] = data;
        return data;
      } catch (e) {
        // Return null on failure
      }
    }

    return null;
  }

  async memberProfile(options = {}) {
    const profile = await this._loadFixture('synthetic_profile.json');
    const currentKey = this.getPersonaKey();
    const personas = (profile && profile.personas) || {};
    const active = personas[currentKey] || personas['ACTIVE'];

    if (currentKey === 'ANONYMOUS' || !active || !active.account) {
      const err = new Error('Chưa đăng nhập (Lab Simulated Anonymous).');
      err.status = 401;
      throw err;
    }
    return {
      account: active.account,
      person: active.person
    };
  }

  async genealogy(options = {}) {
    const data = await this._loadFixture('synthetic_genealogy.json');
    return data || { rootAnchor: 'p1', people: {}, families: {} };
  }

  async mach(options = {}) {
    const data = await this._loadFixture('synthetic_mach.json');
    return data || { authors: {}, series: {}, stories: [] };
  }

  async clara(options = {}) {
    const currentKey = this.getPersonaKey();
    if (currentKey === 'ANONYMOUS') {
      const err = new Error('Chưa đăng nhập (Lab Simulated Anonymous).');
      err.status = 401;
      throw err;
    }
    if (currentKey !== 'A-HD' && currentKey !== 'ACTIVE') {
      const err = new Error('Không gian Thư gửi Clara chỉ dành cho con cháu nhánh Trưởng (Tuấn & Hạnh Đào).');
      err.status = 403;
      throw err;
    }
    const data = await this._loadFixture('synthetic_clara.json');
    return data || { authors: {}, series: {}, stories: [] };
  }

  async media(options = {}) {
    const data = await this._loadFixture('synthetic_media.json');
    return data || {};
  }

  async personMedia(options = {}) {
    const data = await this._loadFixture('synthetic_person_media.json');
    return data || [];
  }

  async submitProposal(proposalData) {
    if (!proposalData || !proposalData.personId || !proposalData.field || proposalData.suggestedValue === undefined) {
      const err = new Error('Dữ liệu đề xuất không hợp lệ (thiếu personId, field hoặc suggestedValue).');
      err.status = 400;
      throw err;
    }

    const record = {
      id: 'PROP_' + Date.now(),
      ...proposalData,
      timestamp: new Date().toISOString(),
      status: 'PENDING_REVIEW'
    };

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = JSON.parse(window.localStorage.getItem('giatoc_mock_proposals') || '[]');
        stored.push(record);
        window.localStorage.setItem('giatoc_mock_proposals', JSON.stringify(stored));
      } catch {
        // fallback in-memory
      }
    }

    if (!this._proposals) {
      this._proposals = [];
    }
    this._proposals.push(record);

    return {
      ok: true,
      proposal: record,
      message: 'Đề xuất đã được ghi nhận vào hàng đợi kiểm duyệt.'
    };
  }
}
