/**
 * GIATOC UI SYSTEM vNEXT — lab.js
 * Vibecode Lab Unified Controller & Prototyping Studio.
 *
 * Directive: EXECUTION ORDER 02 — ACTIVATE VIBECODE LAB
 * Mode: CONTROLLED LOCAL IMPLEMENTATION (Lab only)
 *
 * Capabilities:
 *   1. Content Prototyping: Live inline editing toggle, copy adjustment, text block testing.
 *   2. UI Prototyping: Layout, typography, spacing, responsive container preview.
 *   3. Interaction Prototyping: Search filters, navigation interception, person switcher,
 *      mock change proposal dialog, reading font-size switcher, marked mock toasts.
 *   4. Persona Preview: A-HD, A-OB, ACTIVE, PROVISIONED, UNMAPPED, ANONYMOUS.
 *   5. Responsive Preview: Device frames for 375px (Mobile), 768px (Tablet), 1024px (Laptop),
 *      1440px (Desktop), and 100% (Fluid).
 *   6. Seven UI Surfaces Preservation:
 *      - public: Cổng vào (Public /)
 *      - dashboard: Không gian của tôi (Member /me)
 *      - tree: Cây phả đồ (/me/tree)
 *      - person: Hồ sơ nhân vật (/me/tree/person/:id)
 *      - mach: MẠCH (/me/mach)
 *      - clara: Thư gửi Clara (/me/clara)
 *      - spaces: Không gian gia đình (/me/family-spaces)
 */

import { enableMock, getMockPersonaKey, setMockPersonaKey, PERSONAS } from './mock-adapter.js';
import { resolveContext } from './navigation.js';
import { renderShell, resolveMemberSessionFlags } from './shell.js';
import { api } from './data.js';
import { renderPublicHome } from './public-home.js';
import { renderDashboard } from './dashboard.js';
import { renderTree } from './tree.js';
import { renderPerson } from './person.js';
import { renderDiscoursePage } from './discourse.js';
import { renderSpacesPage } from './spaces.js';
import { renderGallery } from './gallery.js';
import { renderEvents } from './events.js';
import { loadAssetManifest } from './assets.js';
import { setTypographyStack, typography } from './tokens.js';
import { DISCOURSE, UX_CONTEXT } from './contexts.js';
import { StatePanel, STATE } from './states.js';
import { el } from './dom.js';
import { navStore } from './nav-store.js';
import { draftStore } from './draft-store.js';

// Enforce mock mode in Lab
enableMock(true);

export const LAB_SURFACES = [
  {
    id: 'public',
    label: '1. Cổng vào (/)',
    path: '/',
    title: 'Tiếng nói của gia tộc',
    componentFile: 'src/js/ui/public-home.js',
    fixtureFile: 'fixtures/synthetic_profile.json',
    scope: 'Public Gateway',
    context: UX_CONTEXT.PUBLIC
  },
  {
    id: 'dashboard',
    label: '2. Của tôi (/me)',
    path: '/me',
    title: 'Không gian của tôi',
    componentFile: 'src/js/ui/dashboard.js',
    fixtureFile: 'fixtures/synthetic_profile.json',
    scope: 'Member Home',
    context: UX_CONTEXT.MEMBER
  },
  {
    id: 'tree',
    label: '3. Phả đồ (/me/tree)',
    path: '/me/tree',
    title: 'Cây phả đồ',
    componentFile: 'src/js/ui/tree.js',
    fixtureFile: 'fixtures/synthetic_genealogy.json',
    scope: 'Archival Reference',
    context: UX_CONTEXT.GENEALOGY
  },
  {
    id: 'person',
    label: '4. Hồ sơ (/person)',
    path: '/me/tree/person/@I1@',
    title: 'Hồ sơ nhân vật',
    componentFile: 'src/js/ui/person.js',
    fixtureFile: 'fixtures/synthetic_genealogy.json',
    scope: 'Archival Record',
    context: UX_CONTEXT.GENEALOGY
  },
  {
    id: 'mach',
    label: '5. MẠCH (/me/mach)',
    path: '/me/mach',
    title: 'MẠCH',
    componentFile: 'src/js/ui/discourse.js',
    fixtureFile: 'fixtures/synthetic_mach.json',
    scope: 'Internal Discourse',
    context: UX_CONTEXT.EDITORIAL
  },
  {
    id: 'clara',
    label: '6. Thư Clara (/me/clara)',
    path: '/me/clara',
    title: 'Thư gửi Clara',
    componentFile: 'src/js/ui/discourse.js',
    fixtureFile: 'fixtures/synthetic_clara.json',
    scope: 'Intimate Discourse',
    context: UX_CONTEXT.EDITORIAL
  },
  {
    id: 'spaces',
    label: '7. Không gian (/spaces)',
    path: '/me/family-spaces',
    title: 'Không gian gia đình',
    componentFile: 'src/js/ui/spaces.js',
    fixtureFile: 'fixtures/synthetic_profile.json',
    scope: 'Family Spaces',
    context: UX_CONTEXT.MEMBER
  },
  {
    id: 'gallery',
    label: '8. Kho ảnh (/me/gallery)',
    path: '/me/gallery',
    title: 'Kho tư liệu & Di ảnh',
    componentFile: 'src/js/ui/gallery.js',
    fixtureFile: 'fixtures/synthetic_media.json',
    scope: 'Archival Gallery',
    context: UX_CONTEXT.GENEALOGY
  },
  {
    id: 'events',
    label: '9. Lịch & Giỗ (/me/events)',
    path: '/me/events',
    title: 'Lịch giỗ & Niên biểu',
    componentFile: 'src/js/ui/events.js',
    fixtureFile: 'fixtures/calendar_events.json',
    scope: 'Memorial Calendar & Timeline',
    context: UX_CONTEXT.GENEALOGY
  }
];

export const VIEWPORTS = [
  { key: 'fluid', label: '↔️ 100% (Fluid)', width: '100%', title: 'Full Browser Width' },
  { key: '1440', label: '🖥️ 1440px (Desktop)', width: '1440px', title: 'Desktop Display' },
  { key: '1024', label: '💻 1024px (Laptop)', width: '1024px', title: 'Laptop & Tablet Landscape' },
  { key: '768', label: '📱 768px (Tablet)', width: '768px', title: 'Tablet Portrait' },
  { key: '375', label: '📱 375px (Mobile)', width: '375px', title: 'Mobile Phone' }
];

export const SIMULATED_STATES = [
  { key: 'default', label: 'Bình thường (Dữ liệu mẫu)' },
  { key: 'loading', label: 'Đang tải (Loading State)' },
  { key: 'empty', label: 'Trống (Empty State)' },
  { key: '401', label: 'Chưa login (401 Unauthenticated)' },
  { key: '403', label: 'Không có quyền (403 Forbidden)' },
  { key: '500', label: 'Lỗi hệ thống (System Error)' }
];

// Persistent Studio State
const STATE_KEYS = {
  VIEWPORT: 'giatoc_lab_viewport',
  STATE_SIM: 'giatoc_lab_sim_state',
  INLINE_EDIT: 'giatoc_lab_inline_edit',
  FONT_SCALE: 'giatoc_lab_font_scale'
};

function getSavedState(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  return localStorage.getItem(key) || fallback;
}

function setSavedState(key, val) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, val);
  }
}

/**
 * Toast notification for mock actions
 */
export function showLabToast(message, type = 'info') {
  let toastContainer = document.getElementById('gi-lab-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'gi-lab-toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 100000;
      display: flex;
      flex-direction: column;
      gap: 8px;
      pointer-events: none;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bg = type === 'success' ? '#14532d' : (type === 'warning' ? '#78350f' : '#1c1917');
  const border = type === 'success' ? '#22c55e' : (type === 'warning' ? '#f59e0b' : '#38bdf8');
  toast.style.cssText = `
    background: ${bg};
    color: #f8fafc;
    border: 1px solid ${border};
    padding: 10px 16px;
    font-size: 13px;
    line-height: 1.4;
    box-shadow: 0 4px 16px rgba(0,0,0,0.4);
    border-radius: 4px;
    max-width: 380px;
    pointer-events: auto;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  `;
  toast.innerHTML = `<span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/**
 * Main boot function for Vibecode Lab
 */
export async function bootLab() {
  const host = document.querySelector('#gi-app');
  if (!host) return;

  setTypographyStack(typography.active);

  // Hash parsing
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const currentViewId = hashParams.get('view') || 'public';
  const personId = hashParams.get('id') || '@I1@';
  const targetSurface = LAB_SURFACES.find(s => s.id === currentViewId) || LAB_SURFACES[0];

  const currentViewport = getSavedState(STATE_KEYS.VIEWPORT, 'fluid');
  const currentSimState = getSavedState(STATE_KEYS.STATE_SIM, 'default');
  const isInlineEdit = getSavedState(STATE_KEYS.INLINE_EDIT, 'false') === 'true';
  const fontScale = getSavedState(STATE_KEYS.FONT_SCALE, 'normal');

  // Set document viewport attribute for CSS breakpoints
  if (currentViewport === '375') document.documentElement.dataset.viewport = 'mobile';
  else if (currentViewport === '768') document.documentElement.dataset.viewport = 'tablet';
  else if (currentViewport === '1024') document.documentElement.dataset.viewport = 'laptop';
  else document.documentElement.dataset.viewport = 'desktop';

  await resolveMemberSessionFlags(api);
  const context = resolveContext(targetSurface.path);
  const assets = await loadAssetManifest();

  // Reset host
  host.innerHTML = '';
  host.style.cssText = 'background: #12100e; min-height: 100vh; display: flex; flex-direction: column;';

  // 1. Render Studio Topbar & Control Ribbon
  renderStudioHeader(host, targetSurface, {
    currentViewport,
    currentSimState,
    isInlineEdit,
    currentPersona: getMockPersonaKey()
  });

  // 2. Render Workspace Container (with responsive framing if active)
  const workspaceWrapper = document.createElement('main');
  workspaceWrapper.id = 'gi-lab-workspace';
  workspaceWrapper.style.cssText = `
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: ${currentViewport === 'fluid' ? '0' : '20px 16px 40px'};
    background: ${currentViewport === 'fluid' ? '#fff' : '#1c1917'};
    overflow-x: auto;
  `;
  host.appendChild(workspaceWrapper);

  // Responsive device frame wrapper
  const frameContainer = document.createElement('div');
  frameContainer.id = 'gi-lab-frame';

  if (currentViewport !== 'fluid') {
    frameContainer.style.cssText = `
      width: 100%;
      max-width: ${currentViewport}px;
      background: #fafaf9;
      box-shadow: 0 16px 40px rgba(0,0,0,0.6);
      border: 8px solid #292524;
      border-radius: ${currentViewport === '375' ? '24px' : '8px'};
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: max-width 0.25s ease;
    `;

    // Device header bar
    const deviceBar = document.createElement('div');
    deviceBar.style.cssText = `
      background: #292524;
      color: #a8a29e;
      padding: 6px 14px;
      font-size: 11px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      border-bottom: 1px solid #44403c;
    `;
    const vpInfo = VIEWPORTS.find(v => v.key === currentViewport);
    deviceBar.innerHTML = `
      <span>📱 <strong>${vpInfo ? vpInfo.label : currentViewport}</strong> · Simulated Viewport</span>
      <span style="font-size: 10px; color:#d6d3d1;">Bề mặt: ${targetSurface.label}</span>
    `;
    frameContainer.appendChild(deviceBar);
  } else {
    frameContainer.style.cssText = `
      width: 100%;
      background: #fafaf9;
      display: flex;
      flex-direction: column;
    `;
  }

  // Shell Container Host
  const shellContainer = document.createElement('div');
  shellContainer.id = 'gi-lab-shell-host';
  shellContainer.style.cssText = 'flex: 1; display: flex; flex-direction: column; width: 100%;';
  frameContainer.appendChild(shellContainer);
  workspaceWrapper.appendChild(frameContainer);

  // Render Shell
  const navAudience = targetSurface.id === 'public' ? 'public' : 'member';
  let customNavItems = navStore.getItems(navAudience);
  if (
    navAudience === 'member'
    && navStore.getTierStatus('member') === 'default'
    && Boolean(typeof window !== 'undefined' && window.__CLARA_ELIGIBLE__)
    && !customNavItems.some(it => it.href === '/me/clara')
  ) {
    const machIdx = customNavItems.findIndex(it => it.href === '/me/mach');
    const claraItem = { id: 'me-clara', label: 'Thư gửi Clara', href: '/me/clara' };
    customNavItems = [...customNavItems];
    if (machIdx !== -1) customNavItems.splice(machIdx + 1, 0, claraItem);
    else customNavItems.push(claraItem);
  }
  const { content } = renderShell(shellContainer, {
    context,
    assets,
    title: targetSurface.title,
    customNavItems
  });

  // Apply Font Scale preference
  if (fontScale === 'large') content.style.fontSize = '1.15em';
  else if (fontScale === 'small') content.style.fontSize = '0.9em';

  // 3. Render Simulated State OR Standard Surface
  if (currentSimState !== 'default') {
    renderSimulatedState(content, currentSimState, targetSurface);
  } else {
    renderSurfaceContent(content, targetSurface, context, assets, personId);
  }

  // Restore saved drafts onto DOM immediately so switching views/reloading never loses data
  draftStore.restoreAll(shellContainer);

  // 4. Mount Surface-Specific Mock Interaction Bars
  mountSurfaceInteractions(content, targetSurface, personId);

  // 5. Intercept internal in-lab links
  attachNavigationInterception(shellContainer);

  // 6. Initialize ScrollSpy for in-page anchors
  initScrollSpy(shellContainer);

  // 7. Apply Inline Editing if toggled on
  if (isInlineEdit) {
    applyInlineEditMode(shellContainer);
  }

  // 8. Render bottom Inspector Badge
  renderInspectorFooter(host, targetSurface, context, personId);
}

/**
 * Render Studio Header & Navigation Ribbon
 */
function renderStudioHeader(container, currentSurface, state) {
  const header = document.createElement('header');
  header.id = 'gi-lab-header';
  header.style.cssText = `
    background: #0c0a09;
    color: #e7e5e4;
    border-bottom: 2px solid #b45309;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    position: sticky;
    top: 0;
    z-index: 9999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  `;

  // Row 1: Brand & Surface Tabs
  const row1 = document.createElement('div');
  row1.style.cssText = `
    padding: 8px 16px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid #1c1917;
  `;

  const brandCluster = document.createElement('div');
  brandCluster.style.cssText = 'display: flex; align-items: center; gap: 8px; flex-wrap: wrap;';
  brandCluster.innerHTML = `
    <span style="background:#b45309; color:#fff; font-weight:800; padding:3px 8px; text-transform:uppercase; font-size:11px; letter-spacing:0.06em; border-radius:2px;">Vibecode Lab</span>
    <span style="font-weight:600; color:#fafaf9; font-size:12px;">Studio Thiết Kế & Prototype</span>
    <a href="/" style="background:#881337; color:#fff; font-weight:700; padding:3px 10px; text-decoration:none; border-radius:0; font-size:11px; margin-left:4px; display:inline-flex; align-items:center; gap:4px; border:1px solid #be123c;">
      🌐 Trang Công Khai (/) →
    </a>
  `;

  // 7 Surface Tabs
  const surfaceNav = document.createElement('nav');
  surfaceNav.style.cssText = 'display: flex; flex-wrap: wrap; gap: 4px;';
  surfaceNav.setAttribute('aria-label', '7 UI Surfaces');

  LAB_SURFACES.forEach(s => {
    const isCur = s.id === currentSurface.id;
    const a = document.createElement('a');
    a.href = `#view=${s.id}`;
    a.textContent = s.label;
    a.style.cssText = `
      text-decoration: none;
      padding: 4px 10px;
      font-size: 11px;
      border-radius: 2px;
      background: ${isCur ? '#d97706' : '#292524'};
      color: ${isCur ? '#000' : '#d6d3d1'};
      font-weight: ${isCur ? '700' : '500'};
      transition: all 0.15s ease;
      border: 1px solid ${isCur ? '#f59e0b' : '#3f3f46'};
    `;
    a.addEventListener('click', () => {
      setTimeout(() => bootLab(), 50);
    });
    surfaceNav.appendChild(a);
  });

  row1.appendChild(brandCluster);
  row1.appendChild(surfaceNav);
  header.appendChild(row1);

  // Row 2: Prototyping Controls Ribbon (Viewport, Persona, State Simulator, Inline Edit)
  const row2 = document.createElement('div');
  row2.style.cssText = `
    padding: 6px 16px;
    background: #18181b;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-size: 11px;
    border-bottom: 1px solid #27272a;
  `;

  // Left group: Viewport switcher
  const vpGroup = document.createElement('div');
  vpGroup.style.cssText = 'display: flex; align-items: center; gap: 6px; flex-wrap: wrap;';
  vpGroup.innerHTML = '<span style="color:#a1a1aa; font-weight:600;">Khung hình:</span>';

  VIEWPORTS.forEach(vp => {
    const isCur = vp.key === state.currentViewport;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = vp.label;
    btn.title = vp.title;
    btn.style.cssText = `
      padding: 3px 8px;
      border: 1px solid ${isCur ? '#38bdf8' : '#3f3f46'};
      background: ${isCur ? '#0369a1' : '#27272a'};
      color: ${isCur ? '#fff' : '#d4d4d8'};
      font-size: 11px;
      border-radius: 2px;
      cursor: pointer;
      font-weight: ${isCur ? '700' : '400'};
    `;
    btn.addEventListener('click', () => {
      setSavedState(STATE_KEYS.VIEWPORT, vp.key);
      bootLab();
    });
    vpGroup.appendChild(btn);
  });

  // Middle group: Persona Switcher & State Simulator
  const midGroup = document.createElement('div');
  midGroup.style.cssText = 'display: flex; align-items: center; gap: 12px; flex-wrap: wrap;';

  // Persona select
  const personaWrap = document.createElement('div');
  personaWrap.style.cssText = 'display: flex; align-items: center; gap: 4px;';
  personaWrap.innerHTML = '<span style="color:#a1a1aa; font-weight:600;">Persona:</span>';
  const personaSelect = document.createElement('select');
  personaSelect.style.cssText = `
    background: #27272a;
    color: #fafafa;
    border: 1px solid #52525b;
    padding: 3px 6px;
    font-size: 11px;
    border-radius: 2px;
    cursor: pointer;
  `;
  PERSONAS.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.key;
    opt.textContent = p.label;
    if (p.key === state.currentPersona) opt.selected = true;
    personaSelect.appendChild(opt);
  });
  personaSelect.addEventListener('change', (e) => {
    setMockPersonaKey(e.target.value);
    showLabToast(`Đã chuyển sang Persona: ${e.target.value}`, 'info');
    bootLab();
  });
  personaWrap.appendChild(personaSelect);
  midGroup.appendChild(personaWrap);

  // State Simulator select
  const stateWrap = document.createElement('div');
  stateWrap.style.cssText = 'display: flex; align-items: center; gap: 4px;';
  stateWrap.innerHTML = '<span style="color:#a1a1aa; font-weight:600;">Giả lập State:</span>';
  const stateSelect = document.createElement('select');
  stateSelect.style.cssText = `
    background: #27272a;
    color: #fafafa;
    border: 1px solid #52525b;
    padding: 3px 6px;
    font-size: 11px;
    border-radius: 2px;
    cursor: pointer;
  `;
  SIMULATED_STATES.forEach(st => {
    const opt = document.createElement('option');
    opt.value = st.key;
    opt.textContent = st.label;
    if (st.key === state.currentSimState) opt.selected = true;
    stateSelect.appendChild(opt);
  });
  stateSelect.addEventListener('change', (e) => {
    setSavedState(STATE_KEYS.STATE_SIM, e.target.value);
    showLabToast(`Giả lập trạng thái: ${e.target.value}`, 'warning');
    bootLab();
  });
  stateWrap.appendChild(stateSelect);
  midGroup.appendChild(stateWrap);

  // Right group: Inline Edit Mode & Actions
  const rightGroup = document.createElement('div');
  rightGroup.style.cssText = 'display: flex; align-items: center; gap: 8px; flex-wrap: wrap;';

  // Navigator Management Button
  const navAudience = currentSurface.id === 'public' ? 'public' : 'member';
  const navTier = navStore.getTierStatus(navAudience);
  const navTierBadge = navTier === 'working_draft' ? '🟡 Nháp' : (navTier === 'approved' ? '🟢 Đã duyệt' : '⚪ Mặc định');

  const navBtn = document.createElement('button');
  navBtn.type = 'button';
  navBtn.id = 'gi-btn-open-nav-modal';
  navBtn.style.cssText = `
    padding: 3px 10px;
    border: 1px solid #0284c7;
    background: #0369a1;
    color: #fff;
    font-size: 11px;
    border-radius: 2px;
    cursor: pointer;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  `;
  navBtn.innerHTML = `<span>🧭 Quản Lý Navigator</span> <span style="font-size:10px; background:#0c4a6e; padding:1px 5px; border-radius:3px;">${navTierBadge}</span>`;
  navBtn.title = 'Mở bảng quản lý menu điều hướng: đổi tên, đổi thứ tự, thêm/xóa mục, đổi liên kết';
  navBtn.addEventListener('click', () => {
    openNavigatorModal(navAudience);
  });
  rightGroup.appendChild(navBtn);

  // Inline Live Edit Toggle
  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.style.cssText = `
    padding: 3px 10px;
    border: 1px solid ${state.isInlineEdit ? '#22c55e' : '#71717a'};
    background: ${state.isInlineEdit ? '#15803d' : '#27272a'};
    color: #fff;
    font-size: 11px;
    border-radius: 2px;
    cursor: pointer;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  `;
  editBtn.innerHTML = state.isInlineEdit
    ? '<span>✏️ Sửa Nhanh: <strong>BẬT</strong></span>'
    : '<span>✏️ Sửa Nhanh: TẮT</span>';
  editBtn.title = 'Bật chế độ cho phép click trực tiếp vào văn bản để chỉnh sửa câu chữ, tiêu đề mẫu';
  editBtn.addEventListener('click', () => {
    const next = !state.isInlineEdit;
    setSavedState(STATE_KEYS.INLINE_EDIT, String(next));
    showLabToast(next ? 'Đã BẬT Chế độ Sửa Nhanh: Click vào chữ để sửa trực tiếp!' : 'Đã TẮT Chế độ Sửa Nhanh', next ? 'success' : 'info');
    bootLab();
  });
  rightGroup.appendChild(editBtn);

  row2.appendChild(vpGroup);
  row2.appendChild(midGroup);
  row2.appendChild(rightGroup);
  header.appendChild(row2);

  container.appendChild(header);
}

/**
 * Render individual surface components
 */
function renderSurfaceContent(content, targetSurface, context, assets, personId) {
  switch (targetSurface.id) {
    case 'public':
      renderPublicHome(content, context, assets);
      break;
    case 'dashboard':
      renderDashboard(content, context);
      break;
    case 'tree':
      renderTree(content, context);
      break;
    case 'person':
      renderPerson(content, personId, context.route);
      break;
    case 'mach':
      renderDiscoursePage(content, context, DISCOURSE.MACH);
      break;
    case 'clara':
      renderDiscoursePage(content, context, DISCOURSE.CLARA);
      break;
    case 'spaces':
      renderSpacesPage(content, context);
      break;
    case 'gallery':
      renderGallery(content, context, { personId });
      break;
    case 'events':
      renderEvents(content, context);
      break;
    default:
      renderPublicHome(content, context, assets);
  }
}

/**
 * Render simulated edge case states
 */
function renderSimulatedState(content, simState, surface) {
  content.innerHTML = '';
  const title = `Giả lập Trạng Thái: ${surface.title}`;

  let panel;
  if (simState === 'loading') {
    panel = StatePanel({
      state: STATE.LOADING,
      title: 'Đang tải dữ liệu mô phỏng...',
      explanation: `Hệ thống đang yêu cầu tải dữ liệu cho bề mặt ${surface.title}. Vui lòng chờ.`
    });
  } else if (simState === 'empty') {
    panel = StatePanel({
      state: STATE.EMPTY,
      title: 'Chưa có bản ghi nào',
      explanation: `Hệ thống đã truy vấn thành công nhưng bề mặt ${surface.title} không có dữ liệu nào phù hợp.`
    });
  } else if (simState === '401') {
    panel = StatePanel({
      state: STATE.NOT_AUTHENTICATED,
      title: 'Yêu cầu đăng nhập thành viên',
      explanation: 'Bạn cần đăng nhập để truy cập vào không gian gia tộc này.',
      action: el('a', {
        class: 'gi-btn gi-btn--primary',
        href: '#view=public',
        text: 'Về Cổng vào đăng nhập →'
      })
    });
  } else if (simState === '403') {
    panel = StatePanel({
      state: STATE.NOT_AUTHORIZED,
      title: 'Không có quyền truy cập',
      explanation: 'Tài khoản của bạn không thuộc nhánh gia phả được phép tiếp cận tài liệu hoặc không gian này.',
      action: el('a', {
        class: 'gi-btn gi-btn--secondary',
        href: '#view=dashboard',
        text: '← Về Không gian của tôi'
      })
    });
  } else if (simState === '500') {
    panel = StatePanel({
      state: STATE.ERROR,
      title: 'Lỗi nạp dữ liệu (Simulated Error)',
      explanation: 'Không thể kết nối đến máy chủ hoặc máy chủ trả về mã lỗi 500. Đây là lỗi mô phỏng.',
      action: el('button', {
        class: 'gi-btn gi-btn--secondary',
        type: 'button',
        text: 'Thử lại (Mock Retry)',
        onClick: () => {
          setSavedState(STATE_KEYS.STATE_SIM, 'default');
          bootLab();
        }
      })
    });
  }

  const wrapper = el('div', { class: 'gi-container', style: 'padding: 48px 16px;' }, [
    el('div', { style: 'background:#fef3c7; border:1px solid #d97706; padding:10px 14px; margin-bottom:24px; font-size:12px; color:#78350f;' }, [
      el('strong', { text: '⚠️ ĐANG TRONG CHẾ ĐỘ GIẢ LẬP TRẠNG THÁI: ' }),
      el('span', { text: `Bạn đang kiểm tra cách hiển thị trạng thái "${simState}" trên bề mặt "${surface.title}". Chọn lại "Bình thường" trên thanh công cụ để xem dữ liệu mẫu.` })
    ]),
    panel
  ]);

  content.appendChild(wrapper);
}

/**
 * Mount surface-specific prototyping tools & interactive widgets
 */
function mountSurfaceInteractions(content, targetSurface, currentPersonId) {
  // 1. PERSON SURFACE INTERACTION (Person Switcher + Mock Proposal Dialog)
  if (targetSurface.id === 'person') {
    const personToolbar = document.createElement('div');
    personToolbar.id = 'gi-lab-person-toolbar';
    personToolbar.style.cssText = `
      background: #f4efe6;
      border: 1px dashed #b45309;
      padding: 10px 14px;
      margin: 16px 0 24px;
      border-radius: 4px;
      font-size: 12px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    `;

    const switcherDiv = document.createElement('div');
    switcherDiv.style.cssText = 'display:flex; align-items:center; gap:6px; flex-wrap:wrap;';
    switcherDiv.innerHTML = '<strong>Đổi người xem mẫu:</strong>';

    const testPeople = [
      { id: '@I1@', name: 'Giuse Trần Trọng Thu (Root 1872)' },
      { id: '@I18@', name: 'An-tôn Trần Trọng Thư (Đời 1)' },
      { id: '@I59@', name: 'Bà Sa - Teresa Phạm Thị Hưng' },
      { id: '@I6@', name: 'Trần Thị Thi (Đời 1)' },
      { id: '@I7@', name: 'Catarina Trần Thị Vị (Đời 1)' },
      { id: '@I9@', name: 'Gioan Trần Trọng Thả (Đời 1)' },
      { id: '@I2@', name: 'Bà Cử - hai (Đời 1)' }
    ];

    testPeople.forEach(p => {
      const isCur = p.id === currentPersonId;
      const btn = document.createElement('a');
      btn.href = `#view=person&id=${p.id}`;
      btn.textContent = p.name;
      btn.style.cssText = `
        padding: 3px 8px;
        background: ${isCur ? '#881337' : '#e7e5e4'};
        color: ${isCur ? '#fff' : '#1c1917'};
        text-decoration: none;
        border-radius: 2px;
        font-size: 11px;
        font-weight: ${isCur ? '700' : '500'};
      `;
      btn.addEventListener('click', () => setTimeout(() => bootLab(), 50));
      switcherDiv.appendChild(btn);
    });

    // Mock Proposal Button
    const proposeBtn = document.createElement('button');
    proposeBtn.type = 'button';
    proposeBtn.style.cssText = `
      background: #881337;
      color: #fff;
      border: none;
      padding: 6px 12px;
      font-weight: 700;
      font-size: 11px;
      border-radius: 3px;
      cursor: pointer;
    `;
    proposeBtn.textContent = '✏️ Thử nghiệm Form Đề Xuất Thay Đổi (Mock)';
    proposeBtn.addEventListener('click', () => openMockProposalModal(currentPersonId));

    personToolbar.appendChild(switcherDiv);
    personToolbar.appendChild(proposeBtn);

    const firstChild = content.firstChild;
    if (firstChild) content.insertBefore(personToolbar, firstChild.nextSibling);
    else content.appendChild(personToolbar);
  }

  // 2. DISCOURSE SURFACES (Font Size & Reading Controls)
  if (targetSurface.id === 'mach' || targetSurface.id === 'clara') {
    const readingBar = document.createElement('div');
    readingBar.id = 'gi-lab-reading-bar';
    readingBar.style.cssText = `
      background: #fafaf9;
      border: 1px solid #d6d3d1;
      padding: 8px 14px;
      margin: 12px 0 20px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      font-size: 12px;
    `;

    const fontControls = document.createElement('div');
    fontControls.style.cssText = 'display:flex; align-items:center; gap:6px;';
    fontControls.innerHTML = '<span>Kích thước chữ đọc:</span>';

    const scales = [
      { key: 'small', label: 'A- (Nhỏ)' },
      { key: 'normal', label: 'A (Chuẩn)' },
      { key: 'large', label: 'A+ (Lớn)' }
    ];

    const currentScale = getSavedState(STATE_KEYS.FONT_SCALE, 'normal');
    scales.forEach(s => {
      const isCur = s.key === currentScale;
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = s.label;
      b.style.cssText = `
        padding: 2px 8px;
        background: ${isCur ? '#881337' : '#f5f5f4'};
        color: ${isCur ? '#fff' : '#292524'};
        border: 1px solid #a8a29e;
        border-radius: 2px;
        cursor: pointer;
        font-size: 11px;
      `;
      b.addEventListener('click', () => {
        setSavedState(STATE_KEYS.FONT_SCALE, s.key);
        bootLab();
      });
      fontControls.appendChild(b);
    });

    const mockFeedbackBtn = document.createElement('button');
    mockFeedbackBtn.type = 'button';
    mockFeedbackBtn.textContent = '✍️ Gửi Lời Bình / Suy Ngẫm (Mock)';
    mockFeedbackBtn.style.cssText = `
      background: #292524;
      color: #fafaf9;
      border: 1px solid #57534e;
      padding: 4px 10px;
      font-size: 11px;
      cursor: pointer;
      border-radius: 2px;
    `;
    mockFeedbackBtn.addEventListener('click', () => {
      showLabToast('✅ [MOCK PROTOTYPE] Đã gửi suy ngẫm vào không gian lưu giữ gia tộc (Simulated Action).', 'success');
    });

    readingBar.appendChild(fontControls);
    readingBar.appendChild(mockFeedbackBtn);

    const firstChild = content.firstChild;
    if (firstChild) content.insertBefore(readingBar, firstChild.nextSibling);
    else content.appendChild(readingBar);
  }

  // 3. SPACES SURFACE (Mock Create Space)
  if (targetSurface.id === 'spaces') {
    const spacesBar = document.createElement('div');
    spacesBar.style.cssText = `
      background: #f4efe6;
      border: 1px dashed #b45309;
      padding: 10px 14px;
      margin: 16px 0;
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
    `;
    spacesBar.innerHTML = '<span>⚡ <strong>Thử nghiệm chức năng Không gian:</strong> Cho phép các nhánh tạo góc sinh hoạt riêng.</span>';

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.textContent = '➕ Thử Tạo Không Gian Mới (Mock)';
    addBtn.style.cssText = `
      background: #881337;
      color: #fff;
      border: none;
      padding: 5px 10px;
      font-size: 11px;
      border-radius: 2px;
      cursor: pointer;
      font-weight: 600;
    `;
    addBtn.addEventListener('click', () => {
      showLabToast('✅ [MOCK PROTOTYPE] Đã tạo yêu cầu mở Không Gian Gia Đình mới (Simulated Action).', 'success');
    });
    spacesBar.appendChild(addBtn);

    content.appendChild(spacesBar);
  }
}

/**
 * Modal dialog for Mock Change Proposal
 */
function openMockProposalModal(personId) {
  const existing = document.getElementById('gi-lab-mock-modal');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.id = 'gi-lab-mock-modal';
  backdrop.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    z-index: 100001;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  `;

  const modal = document.createElement('div');
  modal.style.cssText = `
    background: #fff;
    color: #1c1917;
    width: 100%;
    max-width: 500px;
    border-radius: 6px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    overflow: hidden;
  `;

  modal.innerHTML = `
    <div style="background:#881337; color:#fff; padding:12px 16px; display:flex; justify-content:space-between; align-items:center;">
      <h3 style="margin:0; font-size:14px; font-weight:700;">Đề Xuất Chỉnh Sửa Thông Tin (Mock Prototype)</h3>
      <button type="button" id="mock-modal-close" style="background:transparent; border:none; color:#fff; font-size:16px; cursor:pointer;">✕</button>
    </div>
    <div style="padding:16px; font-size:13px; line-height:1.5;">
      <p style="margin-top:0; color:#78350f; background:#fef3c7; padding:8px 10px; border-radius:3px; font-size:12px;">
        ⚠️ <strong>Nguyên tắc bảo vệ dữ liệu:</strong> Đây là biểu mẫu giả lập trong Vibecode Lab. Thao tác gửi sẽ KHÔNG ghi vào CSDL thật hoặc thay đổi file nguồn.
      </p>
      <div style="margin-bottom:12px;">
        <label style="display:block; font-weight:600; margin-bottom:4px;">Nhân vật liên quan:</label>
        <input type="text" value="Hồ sơ nhân vật: ${personId}" disabled style="width:100%; padding:6px; background:#f5f5f4; border:1px solid #d6d3d1; font-size:12px;">
      </div>
      <div style="margin-bottom:12px;">
        <label style="display:block; font-weight:600; margin-bottom:4px;">Nội dung đề xuất chỉnh sửa:</label>
        <textarea rows="3" placeholder="Ví dụ: Bổ sung ngày giỗ cụ thể, đính chính năm sinh..." style="width:100%; padding:6px; border:1px solid #d6d3d1; font-size:12px;"></textarea>
      </div>
      <div style="margin-bottom:16px;">
        <label style="display:block; font-weight:600; margin-bottom:4px;">Tư liệu / Nguồn dẫn chứng kèm theo:</label>
        <input type="text" placeholder="Gia phả giấy trang 14 / Lời kể ông trưởng họ..." style="width:100%; padding:6px; border:1px solid #d6d3d1; font-size:12px;">
      </div>
      <div style="display:flex; justify-content:flex-end; gap:8px;">
        <button type="button" id="mock-modal-cancel" style="padding:6px 12px; background:#e7e5e4; border:none; border-radius:3px; font-size:12px; cursor:pointer;">Hủy bỏ</button>
        <button type="button" id="mock-modal-submit" style="padding:6px 14px; background:#881337; color:#fff; border:none; border-radius:3px; font-size:12px; font-weight:600; cursor:pointer;">Gửi Đề Xuất (Mock)</button>
      </div>
    </div>
  `;

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  const closeBtn = modal.querySelector('#mock-modal-close');
  const cancelBtn = modal.querySelector('#mock-modal-cancel');
  const submitBtn = modal.querySelector('#mock-modal-submit');

  const close = () => backdrop.remove();
  closeBtn.addEventListener('click', close);
  cancelBtn.addEventListener('click', close);
  submitBtn.addEventListener('click', () => {
    close();
    showLabToast('✅ [MOCK PROTOTYPE] Đã tiếp nhận đề xuất chỉnh sửa! Hệ thống sẽ chuyển tiếp đến ban biên tập gia phả.', 'success');
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * ScrollSpy: Dynamically syncs aria-current="location" with in-page scroll position
 */
let activeScrollSpyObserver = null;
let activeScrollListener = null;
let isAnchorClicking = false;

function initScrollSpy(container) {
  if (typeof window === 'undefined') return;
  if (activeScrollSpyObserver) {
    activeScrollSpyObserver.disconnect();
    activeScrollSpyObserver = null;
  }
  if (activeScrollListener) {
    window.removeEventListener('scroll', activeScrollListener);
    activeScrollListener = null;
  }

  const sections = Array.from(container.querySelectorAll('section[id], [data-section]'));
  const navLinks = Array.from(container.querySelectorAll('.gi-nav__link'));
  if (sections.length === 0 || navLinks.length === 0) return;

  if ('IntersectionObserver' in window) {
    activeScrollSpyObserver = new IntersectionObserver((entries) => {
      if (isAnchorClicking) return;
      const intersecting = entries.filter(e => e.isIntersecting);
      if (intersecting.length === 0) return;

      intersecting.sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
      const targetSec = intersecting[0].target;
      const targetId = targetSec.id || targetSec.dataset.section;
      if (!targetId) return;

      const targetHref = `#${targetId}`;
      navLinks.forEach(link => {
        const href = link.getAttribute('data-nav-href') || link.getAttribute('href');
        if (href === targetHref) {
          link.setAttribute('aria-current', 'location');
          link.classList.add('gi-nav__link--active');
        } else {
          link.removeAttribute('aria-current');
          link.classList.remove('gi-nav__link--active');
        }
      });
    }, {
      root: null,
      rootMargin: '-10% 0px -60% 0px',
      threshold: [0, 0.2, 0.5, 0.8]
    });

    sections.forEach(s => activeScrollSpyObserver.observe(s));
  }

  activeScrollListener = () => {
    if (isAnchorClicking) return;
    if (window.scrollY < 50) {
      navLinks.forEach(link => {
        const href = link.getAttribute('data-nav-href') || link.getAttribute('href');
        if (href === '/' || href === '/me') {
          link.setAttribute('aria-current', 'page');
          link.classList.add('gi-nav__link--active');
        } else {
          link.removeAttribute('aria-current');
          link.classList.remove('gi-nav__link--active');
        }
      });
    }
  };
  window.addEventListener('scroll', activeScrollListener, { passive: true });
}

/**
 * Dedicated Navigator Configuration Panel (Modal)
 * Conforms to Decision Condition 1 & 2: Dedicated management UI, 3-tier config
 */
function openNavigatorModal(audience = 'public') {
  const existing = document.querySelector('#gi-nav-modal-backdrop');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.id = 'gi-nav-modal-backdrop';
  backdrop.style.cssText = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 10000;
    display: flex; align-items: center; justify-content: center; padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  `;

  const modal = document.createElement('div');
  modal.id = 'gi-nav-modal';
  modal.style.cssText = `
    background: #18181b; color: #f4f4f5; border: 1px solid #3f3f46;
    border-radius: 8px; width: 100%; max-width: 760px; max-height: 90vh;
    display: flex; flex-direction: column; box-shadow: 0 20px 40px rgba(0,0,0,0.8);
  `;

  let items = JSON.parse(JSON.stringify(navStore.getItems(audience)));

  const renderModalContent = () => {
    const tier = navStore.getTierStatus(audience);
    const tierBadge = tier === 'working_draft'
      ? '<span style="background:#854d0e; color:#fef08a; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:700;">🟡 Bản Nháp (Working Draft)</span>'
      : (tier === 'approved'
        ? '<span style="background:#14532d; color:#bbf7d0; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:700;">🟢 Đã Phê Duyệt (Approved)</span>'
        : '<span style="background:#27272a; color:#d4d4d8; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:700;">⚪ Mặc Định (Default)</span>');

    modal.innerHTML = `
      <div style="padding:14px 20px; border-bottom:1px solid #27272a; display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; align-items:center; gap:10px;">
          <h3 style="margin:0; font-size:15px; font-weight:700; color:#fafafa;">🧭 Quản Lý Navigator (${audience === 'public' ? 'Public /' : 'Member /me'})</h3>
          ${tierBadge}
        </div>
        <button type="button" id="gi-nav-close" style="background:none; border:none; color:#a1a1aa; font-size:18px; cursor:pointer; padding:4px 8px;">✕</button>
      </div>

      <div style="padding:10px 20px; background:#09090b; font-size:12px; color:#a1a1aa; border-bottom:1px solid #27272a;">
        💡 <em>Chỉnh sửa nhãn hiển thị, đường dẫn, thêm hoặc đổi thứ tự mục menu. Bản nháp được lưu riêng biệt trong Lab và không ghi đè cấu hình chính thức.</em>
      </div>

      <div id="gi-nav-items-list" style="padding:16px 20px; overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:10px;">
        ${items.map((it, idx) => {
          const isSection = it.href && it.href.startsWith('#');
          const typeBadge = isSection
            ? '<span style="font-size:10px; background:#312e81; color:#c7d2fe; padding:2px 6px; border-radius:3px;">Section (location)</span>'
            : '<span style="font-size:10px; background:#14532d; color:#bbf7d0; padding:2px 6px; border-radius:3px;">Page (page)</span>';
          return `
            <div class="gi-nav-item-row" data-index="${idx}" style="display:flex; align-items:center; gap:8px; background:#27272a; padding:8px 12px; border-radius:6px; border:1px solid #3f3f46;">
              <span style="font-size:12px; font-weight:700; color:#71717a; width:22px;">#${idx + 1}</span>
              <div style="flex:1; display:flex; gap:8px; align-items:center;">
                <input type="text" class="gi-nav-label-input" value="${escapeHtml(it.label || '')}" placeholder="Tên mục" style="flex:1; background:#18181b; color:#fff; border:1px solid #52525b; padding:4px 8px; font-size:12px; border-radius:4px;" />
                <input type="text" class="gi-nav-href-input" value="${escapeHtml(it.href || '')}" placeholder="Đường dẫn (ví dụ: #van-de hoặc /)" style="flex:1; background:#18181b; color:#38bdf8; border:1px solid #52525b; padding:4px 8px; font-size:12px; border-radius:4px; font-family:monospace;" />
              </div>
              ${typeBadge}
              <div style="display:flex; gap:4px;">
                <button type="button" class="gi-nav-move-up" style="background:#3f3f46; color:#fff; border:none; padding:4px 7px; border-radius:3px; cursor:pointer; font-size:11px;" ${idx === 0 ? 'disabled style="opacity:0.3;"' : ''}>▲</button>
                <button type="button" class="gi-nav-move-down" style="background:#3f3f46; color:#fff; border:none; padding:4px 7px; border-radius:3px; cursor:pointer; font-size:11px;" ${idx === items.length - 1 ? 'disabled style="opacity:0.3;"' : ''}>▼</button>
                <button type="button" class="gi-nav-delete" style="background:#7f1d1d; color:#fca5a5; border:none; padding:4px 7px; border-radius:3px; cursor:pointer; font-size:11px;">🗑️</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div style="padding:10px 20px; border-top:1px solid #27272a; display:flex; justify-content:space-between; align-items:center; background:#18181b; flex-wrap:wrap; gap:8px;">
        <div>
          <button type="button" id="gi-nav-add-btn" style="background:#27272a; color:#38bdf8; border:1px dashed #0284c7; padding:5px 12px; font-size:12px; border-radius:4px; cursor:pointer; font-weight:600;">+ Thêm Mục Điều Hướng</button>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button type="button" id="gi-nav-revert-btn" style="background:#27272a; color:#a1a1aa; border:1px solid #52525b; padding:5px 10px; font-size:11px; border-radius:4px; cursor:pointer;">↺ Khôi Phục Đã Duyệt</button>
          <button type="button" id="gi-nav-reset-default-btn" style="background:#27272a; color:#f87171; border:1px solid #7f1d1d; padding:5px 10px; font-size:11px; border-radius:4px; cursor:pointer;">⏮️ Reset Mặc Định</button>
          <button type="button" id="gi-nav-export-btn" style="background:#27272a; color:#f59e0b; border:1px solid #b45309; padding:5px 10px; font-size:11px; border-radius:4px; cursor:pointer;">📋 Xuất JSON</button>
          <button type="button" id="gi-nav-approve-btn" style="background:#15803d; color:#fff; border:none; padding:5px 12px; font-size:11px; border-radius:4px; cursor:pointer; font-weight:700;">✅ Phê Duyệt Cấu Hình</button>
          <button type="button" id="gi-nav-save-btn" style="background:#0284c7; color:#fff; border:none; padding:5px 14px; font-size:12px; border-radius:4px; cursor:pointer; font-weight:700;">💾 Lưu Bản Nháp</button>
        </div>
      </div>
    `;

    // Bind event handlers
    modal.querySelector('#gi-nav-close').addEventListener('click', () => backdrop.remove());

    modal.querySelectorAll('.gi-nav-label-input').forEach(input => {
      input.addEventListener('input', (e) => {
        const row = e.target.closest('.gi-nav-item-row');
        const idx = parseInt(row.dataset.index, 10);
        items[idx].label = e.target.value;
      });
    });

    modal.querySelectorAll('.gi-nav-href-input').forEach(input => {
      input.addEventListener('input', (e) => {
        const row = e.target.closest('.gi-nav-item-row');
        const idx = parseInt(row.dataset.index, 10);
        items[idx].href = e.target.value;
      });
    });

    modal.querySelectorAll('.gi-nav-move-up').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const row = e.target.closest('.gi-nav-item-row');
        const idx = parseInt(row.dataset.index, 10);
        if (idx > 0) {
          const [moved] = items.splice(idx, 1);
          items.splice(idx - 1, 0, moved);
          renderModalContent();
        }
      });
    });

    modal.querySelectorAll('.gi-nav-move-down').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const row = e.target.closest('.gi-nav-item-row');
        const idx = parseInt(row.dataset.index, 10);
        if (idx < items.length - 1) {
          const [moved] = items.splice(idx, 1);
          items.splice(idx + 1, 0, moved);
          renderModalContent();
        }
      });
    });

    modal.querySelectorAll('.gi-nav-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const row = e.target.closest('.gi-nav-item-row');
        const idx = parseInt(row.dataset.index, 10);
        items.splice(idx, 1);
        renderModalContent();
      });
    });

    modal.querySelector('#gi-nav-add-btn').addEventListener('click', () => {
      items.push({
        id: `nav-${Date.now()}`,
        label: 'Mục mới',
        href: '#',
        title: null
      });
      renderModalContent();
    });

    modal.querySelector('#gi-nav-save-btn').addEventListener('click', () => {
      navStore.saveWorkingDraft(items, audience);
      showLabToast('💾 Đã lưu cấu hình Navigator vào Bản Nháp (Working Draft)!', 'success');
      backdrop.remove();
      bootLab();
    });

    modal.querySelector('#gi-nav-approve-btn').addEventListener('click', () => {
      navStore.saveWorkingDraft(items, audience);
      navStore.approveWorkingDraft(audience);
      showLabToast('✅ Đã Phê Duyệt Cấu Hình Navigator (Approved Configuration)!', 'success');
      backdrop.remove();
      bootLab();
    });

    modal.querySelector('#gi-nav-revert-btn').addEventListener('click', () => {
      navStore.revertToApproved(audience);
      items = JSON.parse(JSON.stringify(navStore.getItems(audience)));
      renderModalContent();
      showLabToast('↺ Đã khôi phục về Cấu Hình Đã Phê Duyệt!', 'info');
      bootLab();
    });

    modal.querySelector('#gi-nav-reset-default-btn').addEventListener('click', () => {
      if (confirm('Khôi phục toàn bộ mục menu về Mặc Định ban đầu?')) {
        navStore.resetToDefault(audience);
        items = JSON.parse(JSON.stringify(navStore.getItems(audience)));
        renderModalContent();
        showLabToast('⏮️ Đã đặt lại cấu hình Navigator về Mặc Định ban đầu!', 'warning');
        bootLab();
      }
    });

    modal.querySelector('#gi-nav-export-btn').addEventListener('click', () => {
      const json = JSON.stringify(items, null, 2);
      navigator.clipboard ? navigator.clipboard.writeText(json) : null;
      alert(`Đã copy cấu hình Navigator JSON vào clipboard:\n\n${json}`);
    });
  };

  renderModalContent();
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);
}

/**
 * Inline Edit Mode: Makes content blocks editable with 3-tier DraftStore persistence
 * Conforms to Decision Condition 1, 3, 6 (Uses data-editable-id, persists across views)
 */
function applyInlineEditMode(container) {
  const existingBanner = document.querySelector('#gi-lab-edit-banner');
  if (existingBanner) existingBanner.remove();

  const draftCount = draftStore.countWorkingDrafts();
  const approvedCount = draftStore.countApproved();

  const banner = document.createElement('div');
  banner.id = 'gi-lab-edit-banner';
  banner.style.cssText = `
    background: #fef08a;
    color: #854d0e;
    padding: 8px 16px;
    font-size: 12px;
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px dashed #ca8a04;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    position: sticky;
    top: 0;
    z-index: 9990;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  `;

  banner.innerHTML = `
    <div style="display:flex; align-items:center; gap:10px;">
      <span>✏️ <strong>CHẾ ĐỘ SỬA TRỰC QUAN ĐANG BẬT:</strong> Click trực tiếp vào nội dung để sửa chữ.</span>
      <span id="gi-draft-status-pill" style="font-size:11px; background:#ca8a04; color:#fff; padding:2px 8px; border-radius:12px;">
        ${draftCount > 0 ? `🟡 ${draftCount} mục nháp chưa duyệt` : (approvedCount > 0 ? `🟢 ${approvedCount} mục đã phê duyệt` : '⚪ Chưa có chỉnh sửa')}
      </span>
    </div>
    <div style="display:flex; align-items:center; gap:8px;">
      <button type="button" id="gi-draft-approve-all" style="background:#15803d; color:#fff; border:none; padding:4px 10px; font-size:11px; border-radius:3px; cursor:pointer; font-weight:700;">✅ Phê Duyệt Nháp</button>
      <button type="button" id="gi-draft-revert-all" style="background:#991b1b; color:#fff; border:none; padding:4px 10px; font-size:11px; border-radius:3px; cursor:pointer;">↺ Hoàn Tác Tất Cả</button>
      <button type="button" id="gi-draft-export-json" style="background:#d97706; color:#fff; border:none; padding:4px 10px; font-size:11px; border-radius:3px; cursor:pointer;">📋 Xuất JSON</button>
    </div>
  `;
  container.insertBefore(banner, container.firstChild);

  // Targets: elements with [data-editable-id] OR headings, paragraphs, card titles, facts
  const targets = container.querySelectorAll('[data-editable-id], h1, h2, h3, h4, p, .gi-card__title, .gi-card__meta, .gi-fact, .gi-masthead__nature');
  let fallbackCounter = 1;

  targets.forEach(el => {
    // Avoid editing lab chrome, banners, or ANY navigation element (Strict Condition 2)
    if (el.closest('#gi-lab-header') || el.closest('#gi-lab-reading-bar') || el.closest('#gi-lab-person-toolbar') || el.closest('#gi-lab-edit-banner') || el.closest('.gi-nav') || el.closest('nav')) return;

    let editableId = el.getAttribute('data-editable-id');
    if (!editableId) {
      const parentSection = el.closest('section[id], [data-section]');
      const secPrefix = parentSection ? (parentSection.id || parentSection.dataset.section) : 'page';
      editableId = `auto.${secPrefix}.${el.tagName.toLowerCase()}-${fallbackCounter++}`;
      el.setAttribute('data-editable-id', editableId);
    }

    el.setAttribute('contenteditable', 'true');
    el.style.cursor = 'text';

    const hasDraft = draftStore.getTierStatus(editableId) === 'working_draft';
    const isApproved = draftStore.getTierStatus(editableId) === 'approved';

    el.style.outline = hasDraft ? '2px dashed #22c55e' : (isApproved ? '1px dashed #3b82f6' : '1px dashed #d97706');
    el.style.outlineOffset = '2px';
    el.title = `[ID: ${editableId}] Click để sửa - Tự động lưu bản nháp`;

    // Listen to input and blur to persist automatically into Working Draft (Condition 6)
    el.addEventListener('input', () => {
      draftStore.save(editableId, el.innerHTML, true);
      el.style.outline = '2px dashed #22c55e';
      const count = draftStore.countWorkingDrafts();
      const pill = document.querySelector('#gi-draft-status-pill');
      if (pill) pill.innerHTML = `🟡 ${count} mục nháp chưa duyệt`;
    });
  });

  banner.querySelector('#gi-draft-approve-all').addEventListener('click', () => {
    draftStore.approveAll();
    showLabToast('✅ Đã Phê Duyệt toàn bộ nội dung nháp vào Cấu Hình Được Phê Duyệt!', 'success');
    bootLab();
  });

  banner.querySelector('#gi-draft-revert-all').addEventListener('click', () => {
    if (confirm('Hoàn tác tất cả các nội dung đang sửa dở về bản đã duyệt hoặc ban đầu?')) {
      draftStore.revertAll(container);
      showLabToast('↺ Đã hoàn tác toàn bộ nội dung nháp!', 'info');
      bootLab();
    }
  });

  banner.querySelector('#gi-draft-export-json').addEventListener('click', () => {
    const json = draftStore.exportJson();
    navigator.clipboard ? navigator.clipboard.writeText(json) : null;
    alert(`Đã copy nội dung nháp JSON vào clipboard:\n\n${json}`);
  });
}

/**
 * Intercept internal navigation to stay within Vibecode Lab hash routes
 * Conforms to Decision Condition 5: In-page anchor scrolling without hash collision
 */
function attachNavigationInterception(container) {
  container.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Do not intercept external links or mailto
    if (href.startsWith('http') || href.startsWith('mailto')) return;

    // Condition 5: In-page section anchor links (#van-de, #noi-dung, etc.) inside Vibecode Lab
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.replace(/^#/, '');
      const targetEl = container.querySelector(href) || document.getElementById(targetId) || container.querySelector(`[data-section="${targetId}"]`);
      if (targetEl) {
        isAnchorClicking = true;
        setTimeout(() => { isAnchorClicking = false; }, 800);
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update active location on navigation links (Condition 4)
        const navLinks = container.querySelectorAll('.gi-nav__link');
        navLinks.forEach(nl => {
          const lHref = nl.getAttribute('data-nav-href') || nl.getAttribute('href');
          if (lHref === href) {
            nl.setAttribute('aria-current', 'location');
            nl.classList.add('gi-nav__link--active');
          } else {
            nl.removeAttribute('aria-current');
            nl.classList.remove('gi-nav__link--active');
          }
        });
      }
      return;
    }

    // Intercept person routes: /me/tree/person/:id
    const personMatch = href.match(/\/me\/tree\/person\/([^/#?]+)/);
    if (personMatch) {
      e.preventDefault();
      const rawPid = decodeURIComponent(personMatch[1]);
      window.location.hash = `#view=person&id=${encodeURIComponent(rawPid)}`;
      setTimeout(() => bootLab(), 50);
      return;
    }

    // Intercept surface routes (including optional query strings)
    const cleanPath = href.split('?')[0].replace(/\/+$/, '') || '/';
    if (cleanPath === '/me/tree') {
      e.preventDefault();
      window.location.hash = '#view=tree';
      setTimeout(() => bootLab(), 50);
      return;
    }
    if (cleanPath === '/me/gallery') {
      e.preventDefault();
      window.location.hash = '#view=gallery';
      setTimeout(() => bootLab(), 50);
      return;
    }
    if (cleanPath === '/me/events') {
      e.preventDefault();
      window.location.hash = '#view=events';
      setTimeout(() => bootLab(), 50);
      return;
    }
    if (cleanPath === '/me/mach') {
      e.preventDefault();
      window.location.hash = '#view=mach';
      setTimeout(() => bootLab(), 50);
      return;
    }
    if (cleanPath === '/me/clara') {
      e.preventDefault();
      window.location.hash = '#view=clara';
      setTimeout(() => bootLab(), 50);
      return;
    }
    if (cleanPath === '/me/family-spaces') {
      e.preventDefault();
      window.location.hash = '#view=spaces';
      setTimeout(() => bootLab(), 50);
      return;
    }
    if (href === '/me' || href === '/me/') {
      e.preventDefault();
      window.location.hash = '#view=dashboard';
      setTimeout(() => bootLab(), 50);
      return;
    }
    if (href === '/' || href === '/login') {
      e.preventDefault();
      window.location.hash = '#view=public';
      setTimeout(() => bootLab(), 50);
      return;
    }
  });
}

/**
 * Render Inspector Footer showing exact files and data sources
 */
function renderInspectorFooter(container, surface, context, personId) {
  const footer = document.createElement('footer');
  footer.id = 'gi-lab-inspector-footer';
  footer.style.cssText = `
    background: #09090b;
    color: #a1a1aa;
    border-top: 1px solid #27272a;
    padding: 8px 16px;
    font-size: 11px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    z-index: 9998;
  `;

  footer.innerHTML = `
    <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
      <span>📍 <strong>Bề mặt:</strong> <span style="color:#fafafa;">${surface.label}</span></span>
      <span>📄 <strong>Component:</strong> <code style="color:#38bdf8; background:#18181b; padding:1px 4px;">${surface.componentFile}</code></span>
      <span>📦 <strong>Fixture:</strong> <code style="color:#f59e0b; background:#18181b; padding:1px 4px;">${surface.fixtureFile}</code></span>
      <span>🧭 <strong>Route:</strong> <code style="color:#a3e635; background:#18181b; padding:1px 4px;">${surface.path}</code></span>
      ${surface.id === 'person' ? `<span>👤 <strong>ID Nhân vật:</strong> <code style="color:#fb7185; background:#18181b; padding:1px 4px;">${personId}</code></span>` : ''}
    </div>
    <div>
      <span style="color:#71717a;">Vibecode Lab v2.0 · Mock Mode (0 write to DB)</span>
    </div>
  `;

  container.appendChild(footer);
}

// Window popstate / hashchange listener
if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => bootLab());
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => bootLab());
  } else {
    bootLab();
  }
}
