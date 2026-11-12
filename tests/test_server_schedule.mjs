import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  getVietnamMinutes,
  isServerRestingWindow,
  getServerScheduleState,
  renderServerScheduleBanner,
  SCHEDULE_CONFIG,
  SCHEDULE_RESTING_TITLE,
  SCHEDULE_RESTING_MESSAGE,
  SCHEDULE_OFFLINE_TITLE,
  SCHEDULE_OFFLINE_MESSAGE
} from '../src/js/ui/server-schedule.js';

describe('NAS Operating Schedule — Simple UX Notice (Closeout Specification)', () => {
  test('SCHED-01: Verifies message baseline & operating hours', () => {
    assert.equal(SCHEDULE_RESTING_TITLE, 'THÔNG BÁO GIỜ NGHỈ MÁY CHỦ');
    assert.match(SCHEDULE_RESTING_MESSAGE, /01:00 – 09:00 hàng ngày/);
    assert.match(SCHEDULE_RESTING_MESSAGE, /sau 09:00 \(giờ Việt Nam\)/);
    assert.match(SCHEDULE_RESTING_MESSAGE, /Quý bà con vẫn có thể đọc tư liệu và gia phả bình thường/);

    assert.equal(SCHEDULE_OFFLINE_TITLE, 'KẾT NỐI MÁY CHỦ TẠM THỜI GIÁN ĐOẠN');
    assert.match(SCHEDULE_OFFLINE_MESSAGE, /Máy chủ lưu trữ của Gia tộc hiện đang tạm thời gián đoạn kết nối/);
    assert.doesNotMatch(SCHEDULE_OFFLINE_MESSAGE, /01:00/);
    assert.doesNotMatch(SCHEDULE_OFFLINE_MESSAGE, /09:00/);
  });

  test('SCHED-02: Boundary minute verification in Asia/Ho_Chi_Minh timezone', () => {
    // 1. 00:59:00+07:00 -> 59 minutes: Operating (no notice needed)
    const d0059 = new Date('2026-11-12T00:59:00+07:00');
    assert.equal(getVietnamMinutes(d0059), 59);
    assert.equal(isServerRestingWindow(d0059), false);
    assert.equal(getServerScheduleState(d0059, false), 'AVAILABLE');
    assert.equal(getServerScheduleState(d0059, true), 'OFFLINE');

    // 2. 01:00:00+07:00 -> 60 minutes: Rest begins (notice shown)
    const d0100 = new Date('2026-11-12T01:00:00+07:00');
    assert.equal(getVietnamMinutes(d0100), 60);
    assert.equal(isServerRestingWindow(d0100), true);
    assert.equal(getServerScheduleState(d0100, false), 'RESTING');
    assert.equal(getServerScheduleState(d0100, true), 'RESTING'); // Resting takes precedence over generic offline

    // 3. 08:59:00+07:00 -> 539 minutes: Still resting (notice shown)
    const d0859 = new Date('2026-11-12T08:59:00+07:00');
    assert.equal(getVietnamMinutes(d0859), 539);
    assert.equal(isServerRestingWindow(d0859), true);
    assert.equal(getServerScheduleState(d0859, false), 'RESTING');

    // 4. 09:00:00+07:00 -> 540 minutes: Rest ends, operating normally (no notice needed)
    const d0900 = new Date('2026-11-12T09:00:00+07:00');
    assert.equal(getVietnamMinutes(d0900), 540);
    assert.equal(isServerRestingWindow(d0900), false);
    assert.equal(getServerScheduleState(d0900, false), 'AVAILABLE');
    assert.equal(getServerScheduleState(d0900, true), 'OFFLINE');

    // 5. 09:01:00+07:00 -> 541 minutes: Operating normally
    const d0901 = new Date('2026-11-12T09:01:00+07:00');
    assert.equal(getVietnamMinutes(d0901), 541);
    assert.equal(isServerRestingWindow(d0901), false);
    assert.equal(getServerScheduleState(d0901, false), 'AVAILABLE');
  });

  test('SCHED-03: UTC conversion boundary check', () => {
    // 01:00 Vietnam time (UTC+7) is 18:00 UTC previous day
    const utcStart = new Date('2026-11-11T18:00:00.000Z');
    assert.equal(isServerRestingWindow(utcStart), true);
    assert.equal(getServerScheduleState(utcStart), 'RESTING');

    // 08:59:59 Vietnam time is 01:59:59 UTC same day -> Still resting
    const utcRestEnd = new Date('2026-11-12T01:59:59.000Z');
    assert.equal(isServerRestingWindow(utcRestEnd), true);
    assert.equal(getServerScheduleState(utcRestEnd), 'RESTING');

    // 09:00:00 Vietnam time is 02:00:00 UTC same day -> Available
    const utcEnd = new Date('2026-11-12T02:00:00.000Z');
    assert.equal(isServerRestingWindow(utcEnd), false);
    assert.equal(getServerScheduleState(utcEnd), 'AVAILABLE');
  });

  test('SCHED-04: Lightweight DOM Banner structure & zero-radius', () => {
    if (typeof document === 'undefined') {
      globalThis.document = {
        createElement: (tag) => ({
          tagName: tag.toUpperCase(),
          style: {},
          classList: new Set(),
          className: '',
          children: [],
          attributes: {},
          setAttribute(k, v) { this.attributes[k] = v; },
          getAttribute(k) { return this.attributes[k]; },
          appendChild(c) { this.children.push(c); return c; },
          addEventListener() {},
          remove() {}
        })
      };
    }

    const banner = renderServerScheduleBanner({ type: 'resting' });
    assert.equal(banner.getAttribute('role'), 'status');
    assert.equal(banner.getAttribute('aria-live'), 'polite');
    assert.equal(banner.style.borderRadius, '0');
    assert.equal(banner.style.boxShadow, 'none');

    const offlineBanner = renderServerScheduleBanner({ type: 'offline' });
    assert.equal(offlineBanner.getAttribute('role'), 'status');
    assert.equal(offlineBanner.getAttribute('data-schedule-type'), 'offline');
    assert.equal(offlineBanner.style.borderRadius, '0');
    assert.equal(offlineBanner.style.boxShadow, 'none');
  });
});
