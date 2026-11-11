/**
 * GIATOC UI SYSTEM vNEXT — nav-store.js
 * Dynamic Navigation Store with 3-Tier Configuration:
 *   1. Default Configuration (immutable base, aligns with config/navigation.json)
 *   2. Working Draft (active local edits in Vibecode Lab)
 *   3. Approved Configuration (human/admin ratified local configuration)
 *
 * Conforms to Decision: APPROVED WITH CONDITIONS (Condition 1 & 2)
 */

export const DEFAULT_PUBLIC_NAV = [
  { id: 'home', label: 'Trang chủ', href: '/' },
  { id: 'van-de', label: 'Vấn đề quan tâm', href: '#van-de' },
  { id: 'noi-dung', label: 'Nội dung công bố', href: '#noi-dung' },
  { id: 'mach', label: 'MẠCH', href: '#khong-gian-mach' },
  { id: 'nguon-goc', label: 'Phương pháp', href: '#nguon-goc' },
  { id: 'doi-thoai', label: 'Đối thoại', href: '#doi-thoai' },
  { id: 'login', label: 'Cổng thành viên →', href: '/login', title: 'Cổng không gian thành viên dòng họ' }
];

export const DEFAULT_MEMBER_NAV = [
  { id: 'me', label: 'Không gian của tôi', href: '/me' },
  { id: 'me-tree', label: 'Cây phả đồ', href: '/me/tree' },
  { id: 'me-gallery', label: 'Kho tư liệu ảnh', href: '/me/gallery' },
  { id: 'me-events', label: 'Lịch giỗ & Niên biểu', href: '/me/events' },
  { id: 'me-mach', label: 'MẠCH', href: '/me/mach' },
  { id: 'change-password', label: 'Đổi mật khẩu', href: '/me/change-password' },
  { id: 'public-home', label: 'Trang công khai', href: '/' },
  { id: 'logout', label: 'Đăng xuất', href: '/logout' }
];

const STORAGE_KEYS = {
  WORKING_DRAFT: (aud) => `gi_nav_working_draft_${aud}`,
  APPROVED_CONFIG: (aud) => `gi_nav_approved_config_${aud}`
};

class NavStore {
  getDefaultItems(audience = 'public') {
    const list = audience === 'member' ? DEFAULT_MEMBER_NAV : DEFAULT_PUBLIC_NAV;
    return JSON.parse(JSON.stringify(list));
  }

  getApprovedItems(audience = 'public') {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const raw = window.localStorage.getItem(STORAGE_KEYS.APPROVED_CONFIG(audience));
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
    } catch (e) {
      return null;
    }
  }

  getWorkingDraftItems(audience = 'public') {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const raw = window.localStorage.getItem(STORAGE_KEYS.WORKING_DRAFT(audience));
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Resolves active nav items following precedence:
   * 1. Working Draft (if exists)
   * 2. Approved Configuration (if exists)
   * 3. Default Configuration (fallback)
   */
  getItems(audience = 'public') {
    const draft = this.getWorkingDraftItems(audience);
    if (draft) return draft;
    const approved = this.getApprovedItems(audience);
    if (approved) return approved;
    return this.getDefaultItems(audience);
  }

  /**
   * Determine current active configuration tier
   * @returns {'working_draft' | 'approved' | 'default'}
   */
  getTierStatus(audience = 'public') {
    if (this.getWorkingDraftItems(audience)) return 'working_draft';
    if (this.getApprovedItems(audience)) return 'approved';
    return 'default';
  }

  saveWorkingDraft(items, audience = 'public') {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(STORAGE_KEYS.WORKING_DRAFT(audience), JSON.stringify(items));
  }

  approveWorkingDraft(audience = 'public') {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const current = this.getItems(audience);
    window.localStorage.setItem(STORAGE_KEYS.APPROVED_CONFIG(audience), JSON.stringify(current));
    // Clear working draft after promotion to approved
    window.localStorage.removeItem(STORAGE_KEYS.WORKING_DRAFT(audience));
  }

  revertToApproved(audience = 'public') {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.removeItem(STORAGE_KEYS.WORKING_DRAFT(audience));
  }

  resetToDefault(audience = 'public') {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.removeItem(STORAGE_KEYS.WORKING_DRAFT(audience));
    window.localStorage.removeItem(STORAGE_KEYS.APPROVED_CONFIG(audience));
  }

  addItem(audience, item) {
    const items = this.getItems(audience);
    items.push({
      id: item.id || `nav-${Date.now()}`,
      label: item.label || 'Mục mới',
      href: item.href || '#',
      title: item.title || null
    });
    this.saveWorkingDraft(items, audience);
    return items;
  }

  updateItem(audience, index, partial) {
    const items = this.getItems(audience);
    if (index >= 0 && index < items.length) {
      items[index] = { ...items[index], ...partial };
      this.saveWorkingDraft(items, audience);
    }
    return items;
  }

  removeItem(audience, index) {
    const items = this.getItems(audience);
    if (index >= 0 && index < items.length) {
      items.splice(index, 1);
      this.saveWorkingDraft(items, audience);
    }
    return items;
  }

  moveItem(audience, fromIndex, toIndex) {
    const items = this.getItems(audience);
    if (fromIndex >= 0 && fromIndex < items.length && toIndex >= 0 && toIndex < items.length) {
      const [item] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, item);
      this.saveWorkingDraft(items, audience);
    }
    return items;
  }

  exportJson(audience = 'public') {
    return JSON.stringify(this.getItems(audience), null, 2);
  }
}

export const navStore = new NavStore();

