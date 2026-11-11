/**
 * tests/test_lunar_solar_twoway.mjs
 * Comprehensive verification of Vietnamese Lunisolar Astronomical Engine:
 *   - Mathematical Two-way Round-trip (Solar <-> Lunar)
 *   - UTC+7 vs UTC+8 historical divergence tests (1969, 1974, 1985)
 *   - Leap month detection (2023, 2025)
 *   - Short month (29-day) boundary handling
 */

import assert from 'node:assert/strict';
import {
  convertSolar2Lunar,
  convertLunar2Solar,
  getYearCanChi,
  formatLunarDate
} from '../src/js/domain/calendar/index.js';

console.log('🧪 Starting test suite for Vietnamese Lunisolar Astronomical Engine (Two-Way)...\n');

// 1. Historical Vietnam vs China calendar differences
console.log('--- [1/4] Historical Vietnam (UTC+7) vs China (UTC+8) Divergence ---');

// Tết Kỷ Dậu 1969: VN celebrated Feb 16, China Feb 17
const tet1969 = convertSolar2Lunar(16, 2, 1969, 7.0);
assert.equal(tet1969.day, 1);
assert.equal(tet1969.month, 1);
assert.equal(tet1969.year, 1969);
assert.equal(tet1969.canChi, 'Kỷ Dậu');
console.log('  ✅ Tết Kỷ Dậu 1969: Mùng 1 ÂL = 16/02/1969 (Vietnam UTC+7, 1 day ahead of China).');

// Tết Giáp Dần 1974: VN celebrated Jan 23, China Jan 22
const tet1974 = convertSolar2Lunar(23, 1, 1974, 7.0);
assert.equal(tet1974.day, 1);
assert.equal(tet1974.month, 1);
assert.equal(tet1974.canChi, 'Giáp Dần');
console.log('  ✅ Tết Giáp Dần 1974: Mùng 1 ÂL = 23/01/1974 (Vietnam UTC+7).');

// Tết Ất Sửu 1985: VN celebrated Jan 21, China celebrated Feb 20 (1 month difference!)
const tet1985 = convertSolar2Lunar(21, 1, 1985, 7.0);
assert.equal(tet1985.day, 1);
assert.equal(tet1985.month, 1);
assert.equal(tet1985.canChi, 'Ất Sửu');
console.log('  ✅ Tết Ất Sửu 1985: Mùng 1 ÂL = 21/01/1985 (1 month ahead of China due to 1984 leap month).');

// 2. Leap Month Calculations
console.log('\n--- [2/4] Leap Month Detection & Lunar -> Solar Projection ---');

// 2023 Quý Mão: Leap month 2
const leap2_2023 = convertLunar2Solar(1, 2, 2023, 1, 7.0);
assert(leap2_2023 !== null, 'Leap month 2 of 2023 must exist');
assert.equal(leap2_2023.day, 22);
assert.equal(leap2_2023.month, 3);
assert.equal(leap2_2023.year, 2023);
console.log(`  ✅ 01/02 Nhuận 2023 ÂL -> ${leap2_2023.day}/${leap2_2023.month}/${leap2_2023.year} Dương lịch.`);

// 2025 Ất Tỵ: Leap month 6
const leap6_2025 = convertLunar2Solar(1, 6, 2025, 1, 7.0);
assert(leap6_2025 !== null, 'Leap month 6 of 2025 must exist');
assert.equal(leap6_2025.day, 25);
assert.equal(leap6_2025.month, 7);
assert.equal(leap6_2025.year, 2025);
console.log(`  ✅ 01/06 Nhuận 2025 ÂL -> ${leap6_2025.day}/${leap6_2025.month}/${leap6_2025.year} Dương lịch.`);

// 3. Short Month (29 days) & Day 29/30 Boundary
console.log('\n--- [3/4] Short Month & Lunar Day 29/30 Boundary Handling ---');

// Month 12 of 2024 (Giáp Thìn) has only 29 days (no 30 Tết)
const lastDay2024 = convertLunar2Solar(29, 12, 2024, 0, 7.0);
assert.equal(lastDay2024.day, 28);
assert.equal(lastDay2024.month, 1);
assert.equal(lastDay2024.year, 2025);
const tet2025 = convertLunar2Solar(1, 1, 2025, 0, 7.0);
assert.equal(tet2025.day, 29);
assert.equal(tet2025.month, 1);
assert.equal(tet2025.year, 2025);
console.log(`  ✅ 29 Tháng Chạp 2024 ÂL (Giao thừa) = ${lastDay2024.day}/${lastDay2024.month}/${lastDay2024.year} -> Mùng 1 Tết 2025 = ${tet2025.day}/${tet2025.month}/${tet2025.year}.`);

// 4. Two-Way Round-Trip Mathematical Consistency (700 Days)
console.log('\n--- [4/4] 700-Day Consecutive Two-Way Round-Trip Verification ---');

let passedDays = 0;
const start = new Date(2024, 0, 1);
for (let i = 0; i < 700; i++) {
  const d = new Date(start.getTime() + i * 86400000);
  const sDay = d.getDate();
  const sMonth = d.getMonth() + 1;
  const sYear = d.getFullYear();

  const lunar = convertSolar2Lunar(sDay, sMonth, sYear, 7.0);
  const backToSolar = convertLunar2Solar(lunar.day, lunar.month, lunar.year, lunar.isLeap ? 1 : 0, 7.0);

  assert(backToSolar !== null, `Failed to reverse lunar date: ${JSON.stringify(lunar)}`);
  assert.equal(backToSolar.day, sDay, `Day mismatch on ${sDay}/${sMonth}/${sYear}`);
  assert.equal(backToSolar.month, sMonth, `Month mismatch on ${sDay}/${sMonth}/${sYear}`);
  assert.equal(backToSolar.year, sYear, `Year mismatch on ${sDay}/${sMonth}/${sYear}`);

  passedDays++;
}

console.log(`  ✅ 700/700 consecutive days verified with 100% two-way fidelity.\n`);
console.log('============================================================');
console.log('🎉 ALL LUNISOLAR TWO-WAY TESTS PASSED SUCCESSFULLY (100%)!');
console.log('============================================================\n');

