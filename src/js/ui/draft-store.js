/**
 * GIATOC UI SYSTEM vNEXT — draft-store.js
 * Content Draft Store with 3-Tier Configuration:
 *   1. Default Content (DOM baseline rendered by components)
 *   2. Working Draft (active local inline edits saved per data-editable-id)
 *   3. Approved Configuration (promoted local snapshots)
 *
 * Conforms to Decision: APPROVED WITH CONDITIONS (Condition 1, 3, 6)
 * PRIMARY IDENTIFIER: data-editable-id (stable and explicit)
 */

const STORAGE_KEYS = {
  WORKING_DRAFT: 'gi_content_working_draft',
  APPROVED_CONFIG: 'gi_content_approved_config'
};

class DraftStore {
  _getStorageMap(key) {
    if (typeof window === 'undefined' || !window.localStorage) return {};
    const raw = window.localStorage.getItem(key);
    if (!raw) return {};
    try {
      const parsed = JSON.parse(raw);
      return typeof parsed === 'object' && parsed !== null ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  _setStorageMap(key, map) {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(key, JSON.stringify(map));
  }

  getWorkingDraftMap() {
    return this._getStorageMap(STORAGE_KEYS.WORKING_DRAFT);
  }

  getApprovedConfigMap() {
    return this._getStorageMap(STORAGE_KEYS.APPROVED_CONFIG);
  }

  /**
   * Get draft for a specific data-editable-id
   */
  getDraft(editableId) {
    if (!editableId) return null;
    const working = this.getWorkingDraftMap();
    if (working[editableId]) return { ...working[editableId], tier: 'working_draft' };
    const approved = this.getApprovedConfigMap();
    if (approved[editableId]) return { ...approved[editableId], tier: 'approved' };
    return null;
  }

  getTierStatus(editableId) {
    if (!editableId) return 'default';
    const working = this.getWorkingDraftMap();
    if (working[editableId]) return 'working_draft';
    const approved = this.getApprovedConfigMap();
    if (approved[editableId]) return 'approved';
    return 'default';
  }

  /**
   * Save an edit directly into Working Draft
   * @param {string} editableId - Stable element identifier
   * @param {string} content - Text or HTML content
   * @param {boolean} isHtml - Whether content contains markup
   */
  save(editableId, content, isHtml = false) {
    if (!editableId) return;
    const working = this.getWorkingDraftMap();
    working[editableId] = {
      content,
      isHtml,
      updatedAt: Date.now()
    };
    this._setStorageMap(STORAGE_KEYS.WORKING_DRAFT, working);
  }

  /**
   * Restore all saved drafts to elements matching [data-editable-id] in container.
   * Ensures reloading or view switching never loses edits.
   * @param {HTMLElement} container
   */
  restoreAll(container) {
    if (!container) return;
    const working = this.getWorkingDraftMap();
    const approved = this.getApprovedConfigMap();

    const editables = container.querySelectorAll('[data-editable-id]');
    editables.forEach(el => {
      const id = el.getAttribute('data-editable-id');
      if (!id) return;

      // Cache default DOM value before first mutation
      if (!el.dataset.giDefaultContent) {
        el.dataset.giDefaultContent = el.innerHTML;
      }

      const draft = working[id] || approved[id];
      if (draft && draft.content !== undefined) {
        if (draft.isHtml) {
          el.innerHTML = draft.content;
        } else {
          el.innerText = draft.content;
        }
        el.dataset.giDraftTier = working[id] ? 'working_draft' : 'approved';
      }
    });
  }

  /**
   * Revert a single element back to its default or approved content
   */
  revertElement(editableId, container = null) {
    if (!editableId) return;
    const working = this.getWorkingDraftMap();
    delete working[editableId];
    this._setStorageMap(STORAGE_KEYS.WORKING_DRAFT, working);

    if (container) {
      const el = container.querySelector(`[data-editable-id="${editableId}"]`);
      if (el) {
        const approved = this.getApprovedConfigMap();
        if (approved[editableId]) {
          const draft = approved[editableId];
          if (draft.isHtml) el.innerHTML = draft.content;
          else el.innerText = draft.content;
          el.dataset.giDraftTier = 'approved';
        } else if (el.dataset.giDefaultContent) {
          el.innerHTML = el.dataset.giDefaultContent;
          delete el.dataset.giDraftTier;
        }
      }
    }
  }

  /**
   * Revert all working drafts back to approved or default
   */
  revertAll(container = null) {
    this._setStorageMap(STORAGE_KEYS.WORKING_DRAFT, {});
    if (container) {
      this.restoreAll(container);
      const editables = container.querySelectorAll('[data-editable-id]');
      editables.forEach(el => {
        const id = el.getAttribute('data-editable-id');
        const approved = this.getApprovedConfigMap();
        if (!approved[id] && el.dataset.giDefaultContent) {
          el.innerHTML = el.dataset.giDefaultContent;
          delete el.dataset.giDraftTier;
        }
      });
    }
  }

  /**
   * Promote working drafts into Approved Configuration
   */
  approveAll() {
    const working = this.getWorkingDraftMap();
    const approved = this.getApprovedConfigMap();
    const merged = { ...approved, ...working };
    this._setStorageMap(STORAGE_KEYS.APPROVED_CONFIG, merged);
    this._setStorageMap(STORAGE_KEYS.WORKING_DRAFT, {});
  }

  /**
   * Reset everything (clear working drafts and approved configs)
   */
  resetToDefault(container = null) {
    this._setStorageMap(STORAGE_KEYS.WORKING_DRAFT, {});
    this._setStorageMap(STORAGE_KEYS.APPROVED_CONFIG, {});
    if (container) {
      const editables = container.querySelectorAll('[data-editable-id]');
      editables.forEach(el => {
        if (el.dataset.giDefaultContent) {
          el.innerHTML = el.dataset.giDefaultContent;
          delete el.dataset.giDraftTier;
        }
      });
    }
  }

  countWorkingDrafts() {
    return Object.keys(this.getWorkingDraftMap()).length;
  }

  countApproved() {
    return Object.keys(this.getApprovedConfigMap()).length;
  }

  exportJson() {
    return JSON.stringify({
      workingDraft: this.getWorkingDraftMap(),
      approvedConfig: this.getApprovedConfigMap()
    }, null, 2);
  }
}

export const draftStore = new DraftStore();

