/**
 * GIATOC UI SYSTEM vNEXT — server-schedule.js
 * NAS Operating Schedule — Simple UX Notice
 *
 * Operational Window (Asia/Ho_Chi_Minh):
 * - 01:00 – 09:00: NAS nghỉ (hiển thị thông báo nhỏ, nhã nhặn).
 * - 09:00 – 01:00 hôm sau: NAS hoạt động (không hiển thị thông báo).
 *
 * Boundaries:
 * - 00:59 -> Hoạt động (không hiển thị thông báo)
 * - 01:00 -> Bắt đầu nghỉ (hiển thị thông báo)
 * - 08:59 -> Đang nghỉ (hiển thị thông báo)
 * - 09:00 -> Kết thúc nghỉ, hoạt động trở lại (không hiển thị thông báo)
 */

import { el } from './dom.js';

export const SCHEDULE_CONFIG = Object.freeze({
  restStartHour: 1,      // 01:00
  restStartMinute: 0,
  restEndHour: 9,        // 09:00
  restEndMinute: 0,
  timeZone: 'Asia/Ho_Chi_Minh'
});

export const SCHEDULE_RESTING_TITLE = 'THÔNG BÁO GIỜ NGHỈ MÁY CHỦ';
export const SCHEDULE_RESTING_MESSAGE =
  'Máy chủ lưu trữ của Gia tộc đang trong khung giờ nghỉ định kỳ (01:00 – 09:00 hàng ngày) để bảo vệ độ bền thiết bị. Các chức năng cần kết nối máy chủ tạm thời không khả dụng và sẽ hoạt động trở lại sau 09:00 (giờ Việt Nam). Quý bà con vẫn có thể đọc tư liệu và gia phả bình thường.';

export const SCHEDULE_OFFLINE_TITLE = 'KẾT NỐI MÁY CHỦ TẠM THỜI GIÁN ĐOẠN';
export const SCHEDULE_OFFLINE_MESSAGE =
  'Máy chủ lưu trữ của Gia tộc hiện đang tạm thời gián đoạn kết nối. Các chức năng phụ thuộc máy chủ sẽ tự động hoạt động trở lại ngay khi kết nối được thiết lập.';

/**
 * Returns minute of day (0..1439) in Asia/Ho_Chi_Minh timezone.
 * Uses robust Intl.DateTimeFormat with hourCycle: 'h23'.
 * @param {Date} [date=new Date()]
 * @returns {number}
 */
export function getVietnamMinutes(date = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: SCHEDULE_CONFIG.timeZone,
      hourCycle: 'h23',
      hour: 'numeric',
      minute: 'numeric'
    }).formatToParts(date);
    let h = 0, m = 0;
    for (const p of parts) {
      if (p.type === 'hour') h = parseInt(p.value, 10);
      if (p.type === 'minute') m = parseInt(p.value, 10);
    }
    return h * 60 + m;
  } catch {
    return date.getHours() * 60 + date.getMinutes();
  }
}

/**
 * Checks if a given timestamp is within the scheduled resting window:
 * 01:00 <= t < 09:00 Asia/Ho_Chi_Minh (minutes 60..539).
 *
 * Boundaries:
 * - 00:59 -> false (59m)
 * - 01:00 -> true  (60m)
 * - 08:59 -> true  (539m)
 * - 09:00 -> false (540m)
 *
 * @param {Date} [date=new Date()]
 * @returns {boolean}
 */
export function isServerRestingWindow(date = new Date()) {
  const totalMinutes = getVietnamMinutes(date);
  return totalMinutes >= 60 && totalMinutes < 540;
}

/**
 * Returns simple schedule status:
 * - 'RESTING': In scheduled rest window (01:00 - 09:00)
 * - 'OFFLINE': Unexpected disconnect outside 01:00 - 09:00
 * - 'AVAILABLE': Operating normally (09:00 - 01:00)
 *
 * @param {Date} [date=new Date()]
 * @param {boolean} [isOffline=false]
 * @returns {'RESTING'|'OFFLINE'|'AVAILABLE'}
 */
export function getServerScheduleState(date = new Date(), isOffline = false) {
  if (isServerRestingWindow(date)) {
    return 'RESTING';
  }
  if (isOffline) {
    return 'OFFLINE';
  }
  return 'AVAILABLE';
}

/**
 * Renders a lightweight, unobtrusive notice banner adhering strictly to Brand Governance v0.1:
 * 2D planar, zero radius (border-radius: 0), no box-shadow, heritage gold accents.
 *
 * @param {Object} [options={}]
 * @param {'resting'|'offline'} [options.type='resting']
 * @param {string} [options.customTitle=null]
 * @param {string} [options.customMessage=null]
 * @param {boolean} [options.dismissible=true]
 * @param {Function} [options.onDismiss=null]
 * @returns {HTMLElement}
 */
export function renderServerScheduleBanner({
  type = 'resting',
  customTitle = null,
  customMessage = null,
  dismissible = true,
  onDismiss = null
} = {}) {
  const isOffline = type === 'offline';
  const title = customTitle || (isOffline ? SCHEDULE_OFFLINE_TITLE : SCHEDULE_RESTING_TITLE);
  const message = customMessage || (isOffline ? SCHEDULE_OFFLINE_MESSAGE : SCHEDULE_RESTING_MESSAGE);

  const banner = el('aside', {
    class: `gi-schedule-banner gi-schedule-banner--${type}`,
    role: 'status',
    'aria-live': 'polite',
    'data-schedule-type': type,
    style: {
      background: 'var(--color-brand-gold-subtle, #fbf0e3)',
      border: '1px solid var(--color-brand-gold, #b45309)',
      borderLeft: '4px solid var(--color-brand-gold, #b45309)',
      padding: '12px 16px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      borderRadius: '0',
      boxShadow: 'none'
    }
  }, [
    el('div', {
      class: 'gi-schedule-banner__icon',
      'aria-hidden': 'true',
      style: {
        fontSize: '18px',
        lineHeight: '1.2',
        color: 'var(--color-brand-gold, #b45309)',
        flexShrink: '0'
      },
      text: isOffline ? '⚙️' : '🌙'
    }),
    el('div', {
      class: 'gi-schedule-banner__content',
      style: { flex: '1', minWidth: '0' }
    }, [
      el('h4', {
        class: 'gi-schedule-banner__title',
        style: {
          margin: '0 0 4px',
          fontFamily: 'var(--font-display-active, serif)',
          fontSize: '15px',
          fontWeight: '700',
          color: 'var(--color-brand-gold, #b45309)',
          letterSpacing: '0.01em'
        },
        text: title
      }),
      el('p', {
        class: 'gi-schedule-banner__message',
        style: {
          margin: '0',
          fontFamily: 'var(--font-text-active, serif)',
          fontSize: '13.5px',
          lineHeight: '1.5',
          color: 'var(--color-text-primary, #1a1a1a)'
        },
        text: message
      })
    ]),
    dismissible ? el('button', {
      type: 'button',
      class: 'gi-btn gi-btn--subtle gi-schedule-banner__close',
      'aria-label': 'Đóng thông báo',
      style: {
        border: 'none',
        background: 'transparent',
        fontSize: '15px',
        color: 'var(--color-text-muted, #5c5b5a)',
        cursor: 'pointer',
        padding: '0 4px',
        lineHeight: '1',
        flexShrink: '0',
        borderRadius: '0'
      },
      text: '✕',
      click: (e) => {
        e.preventDefault();
        banner.remove();
        if (typeof onDismiss === 'function') onDismiss();
      }
    }) : null
  ]);

  return banner;
}

/**
 * Mounts server schedule monitoring to a container.
 * When in resting window (01:00-09:00), displays a small notice.
 * When operating (09:00-01:00), displays nothing.
 *
 * @param {HTMLElement} host
 * @returns {Function} Unsubscribe cleanup function
 */
export function initServerScheduleMonitoring(host) {
  if (!host || typeof window === 'undefined') return () => {};

  let activeBanner = null;

  function showBanner(type) {
    if (activeBanner && activeBanner.dataset.scheduleType === type) return;
    if (activeBanner) activeBanner.remove();

    activeBanner = renderServerScheduleBanner({
      type,
      dismissible: true,
      onDismiss: () => { activeBanner = null; }
    });

    if (host.firstChild) {
      host.insertBefore(activeBanner, host.firstChild);
    } else {
      host.appendChild(activeBanner);
    }
  }

  // Initial check: only show if currently resting
  if (isServerRestingWindow()) {
    showBanner('resting');
  }

  function onServerOffline() {
    if (isServerRestingWindow()) {
      showBanner('resting');
    } else {
      showBanner('offline');
    }
  }

  window.addEventListener('giatoc:server-offline', onServerOffline);

  return () => {
    window.removeEventListener('giatoc:server-offline', onServerOffline);
    if (activeBanner) activeBanner.remove();
  };
}
