/**
 * GIATOC UI SYSTEM vNEXT — mock-adapter.js
 * Vibecode Lab In-Memory Mock Adapter & Persona Switcher.
 *
 * Provides 100% synthetic, PII-free datasets matching data.js signatures:
 *   - memberProfile(): Simulated user identity (ACTIVE, PROVISIONED, UNMAPPED, ANONYMOUS)
 *   - genealogy(): Synthetic 3-generation family tree
 *   - mach(): Synthetic MẠCH internal discourse & Clara intimate letters
 *   - media() & personMedia(): Synthetic archives
 *
 * Also provides an on-screen Lab Persona Switcher for Tuấn & agents to test
 * all 6 UI surfaces without a running backend.
 */

import { MockDataAdapter } from '../platform/data/index.js';

const STORAGE_KEY = 'giatoc_mock_persona';
const MOCK_FLAG_KEY = 'giatoc_mock';

export function isMockEnabled() {
  if (typeof window === 'undefined') return false;
  if (window.__GIATOC_MOCK__ === true) return true;
  try {
    const pathname = (window.location && window.location.pathname) || '';
    if (pathname === '/lab.html' || pathname.endsWith('/lab.html')) {
      window.__GIATOC_MOCK__ = true;
      return true;
    }
    const urlParams = new URLSearchParams((window.location && window.location.search) || '');
    const storage = window.localStorage || null;
    const mockParam = urlParams.get('mock');
    if (mockParam === '0' || mockParam === 'false') {
      window.__GIATOC_MOCK__ = false;
      if (storage && typeof storage.removeItem === 'function') {
        storage.removeItem(MOCK_FLAG_KEY);
      }
      return false;
    }
    if (mockParam === '1' || mockParam === 'true') {
      window.__GIATOC_MOCK__ = true;
      return true;
    }
    // Clean up any sticky legacy localStorage mock flag so real / and /me/* pages
    // never get stuck serving synthetic fixtures.
    if (storage && typeof storage.getItem === 'function' && storage.getItem(MOCK_FLAG_KEY)) {
      storage.removeItem(MOCK_FLAG_KEY);
    }
  } catch {
    // fallback
  }
  return false;
}

export function enableMock(enable = true) {
  if (typeof window !== 'undefined') {
    window.__GIATOC_MOCK__ = Boolean(enable);
    try {
      // Never persist sticky mock mode into localStorage across real pages
      const storage = window.localStorage || null;
      if (storage && typeof storage.removeItem === 'function') {
        storage.removeItem(MOCK_FLAG_KEY);
      }
    } catch {
      // fallback
    }
  }
}

/**
 * Underlying MockDataAdapter from Platform Data Layer.
 * Replaces legacy duplicate in-memory fixture fetcher.
 */
const platformMockAdapter = new MockDataAdapter();

export const mockApi = {
  memberProfile: (options) => platformMockAdapter.memberProfile(options),
  genealogy: (options) => platformMockAdapter.genealogy(options),
  mach: (options) => platformMockAdapter.mach(options),
  clara: (options) => platformMockAdapter.clara(options),
  media: (options) => platformMockAdapter.media(options),
  personMedia: (options) => platformMockAdapter.personMedia(options)
};

export function getMockPersonaKey() {
  return platformMockAdapter.getPersonaKey();
}

export function setMockPersonaKey(key) {
  platformMockAdapter.setPersonaKey(key);
}

export const PERSONAS = [
  { key: 'A-HD', label: 'A-HD · Tuấn / Nhánh Hạnh Đào (Quyền xem Clara)' },
  { key: 'A-OB', label: 'A-OB · Chi khác / Ngoài nhánh (Bị chặn Clara)' },
  { key: 'ACTIVE', label: 'ACTIVE · Trần Trọng Mẫu C (Đời 2 - Trưởng)' },
  { key: 'PROVISIONED', label: 'PROVISIONED · Trần Quốc Mẫu F (Mới tạo)' },
  { key: 'UNMAPPED', label: 'UNMAPPED · Thành viên chưa gắn phả hệ' },
  { key: 'ANONYMOUS', label: 'ANONYMOUS · Khách vãng lai (Chưa login)' }
];

/**
 * Mount a floating Lab Controller on the bottom-right of the screen
 * allowing Tuấn to test all personas and 6 surfaces instantly.
 */
export function mountLabSwitcher() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('gi-lab-switcher')) return;

  const current = getMockPersonaKey();
  const currentPath = window.location.pathname;

  const box = document.createElement('aside');
  box.id = 'gi-lab-switcher';
  box.setAttribute('aria-label', 'Vibecode Lab Dev Controller');
  box.style.cssText = `
    position: fixed;
    bottom: 12px;
    right: 12px;
    z-index: 99999;
    background: #1c1917;
    color: #f5f5f4;
    border: 1px solid #44403c;
    border-radius: 0;
    padding: 8px 12px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 11px;
    line-height: 1.4;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    max-width: 320px;
  `;

  box.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #292524; padding-bottom:4px; margin-bottom:6px;">
      <strong style="color:#f59e0b; text-transform:uppercase; letter-spacing:0.05em;">⚡ Vibecode Lab</strong>
      <span style="color:#a8a29e;">Mock Mode</span>
    </div>
    <div style="margin-bottom:6px;">
      <label style="display:block; color:#a8a29e; margin-bottom:2px;">Persona Giả Lập:</label>
      <select id="gi-lab-persona-select" style="width:100%; background:#292524; color:#fff; border:1px solid #44403c; padding:3px 4px; font-size:11px;">
        ${PERSONAS.map(p => `<option value="${p.key}" ${p.key === current ? 'selected' : ''}>${p.label}</option>`).join('')}
      </select>
    </div>
    <div style="margin-bottom:4px;">
      <label style="display:block; color:#a8a29e; margin-bottom:2px;">Chuyển Bề Mặt UI:</label>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:4px;">
        <a href="/lab.html#view=public" style="color:#38bdf8; text-decoration:none; background:#292524; padding:2px 4px; text-align:center;">1. Cổng vào (/)</a>
        <a href="/lab.html#view=dashboard" style="color:#38bdf8; text-decoration:none; background:#292524; padding:2px 4px; text-align:center;">2. Của tôi (/me)</a>
        <a href="/lab.html#view=tree" style="color:#38bdf8; text-decoration:none; background:#292524; padding:2px 4px; text-align:center;">3. Phả đồ (/tree)</a>
        <a href="/lab.html#view=person" style="color:#38bdf8; text-decoration:none; background:#292524; padding:2px 4px; text-align:center;">4. Hồ sơ (/person)</a>
        <a href="/lab.html#view=gallery" style="color:#38bdf8; text-decoration:none; background:#292524; padding:2px 4px; text-align:center;">5. Kho ảnh (/gallery)</a>
        <a href="/lab.html#view=events" style="color:#38bdf8; text-decoration:none; background:#292524; padding:2px 4px; text-align:center;">6. Lịch & Giỗ (/events)</a>
        <a href="/lab.html#view=mach" style="color:#38bdf8; text-decoration:none; background:#292524; padding:2px 4px; text-align:center;">7. MẠCH (/mach)</a>
        <a href="/lab.html#view=clara" style="color:#38bdf8; text-decoration:none; background:#292524; padding:2px 4px; text-align:center;">8. Clara (/clara)</a>
      </div>
    </div>
  `;

  document.body.appendChild(box);

  const select = box.querySelector('#gi-lab-persona-select');
  if (select) {
    select.addEventListener('change', (e) => {
      setMockPersonaKey(e.target.value);
      window.location.reload();
    });
  }
}

