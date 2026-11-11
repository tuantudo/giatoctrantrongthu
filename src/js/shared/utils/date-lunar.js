/**
 * GIATOC SHARED UTILITIES — date-lunar.js
 * Vietnamese Lunar Calendar Astronomical Computation Engine (Algorithm by Hồ Ngọc Đức).
 * Standardized pure ES Module for GMT+7 (Asia/Ho_Chi_Minh).
 */

const INT = (d) => Math.floor(d);

export const CAN = Object.freeze(["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"]);
export const CHI = Object.freeze(["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"]);

/**
 * Compute Julian day number from Gregorian date.
 */
export function jdFromDate(dd, mm, yy) {
  let a = INT((14 - mm) / 12);
  let y = yy + 4800 - a;
  let m = mm + 12 * a - 3;
  let jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
  if (jd < 2299161) {
    jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
  }
  return jd;
}

/**
 * Astronomical computation for New Moon Day.
 */
export function getNewMoonDay(k, timeZone = 7.0) {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = Math.PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(2 * dr * Mpr);
  C1 = C1 - 0.0004 * Math.sin(3 * dr * Mpr);
  C1 = C1 + 0.0104 * Math.sin(2 * dr * F) - 0.0051 * Math.sin((M + Mpr) * dr);
  C1 = C1 - 0.0074 * Math.sin((M - Mpr) * dr) + 0.0004 * Math.sin((2 * F + M) * dr);
  C1 = C1 - 0.0004 * Math.sin((2 * F - M) * dr) - 0.0006 * Math.sin((2 * F + Mpr) * dr);
  C1 = C1 + 0.0010 * Math.sin((2 * F - Mpr) * dr) + 0.0005 * Math.sin((2 * Mpr + M) * dr);
  const deltat = (T < -11) ? (0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3) : (-0.000278 + 0.000265 * T + 0.000262 * T2);
  return INT(Jd1 + C1 - deltat + 0.5 + timeZone / 24);
}

/**
 * Sun longitude in terms of 30-degree Zodiac segments (0..11).
 */
export function getSunLongitude(dayNumber, timeZone = 7.0) {
  const T = (dayNumber - 2451545.5 - timeZone / 24) / 36525;
  const dr = Math.PI / 180;
  const M = 357.52910 + 35999.05029 * T;
  const L0 = 280.46645 + 36000.76983 * T;
  const DL = (1.914602 - 0.004817 * T) * Math.sin(dr * M) + 0.019993 * Math.sin(dr * 2 * M);
  let L = (L0 + DL) * dr;
  L = L - Math.PI * 2 * INT(L / (Math.PI * 2));
  return INT(L / (Math.PI / 6));
}

/**
 * Determine new moon day of 11th lunar month in year `yy`.
 */
export function getLunarMonth11(yy, timeZone = 7.0) {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = INT(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  if (getSunLongitude(nm, timeZone) >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
}

/**
 * Determine leap month offset after month 11.
 */
export function getLeapMonthOffset(a11, timeZone = 7.0) {
  const k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);
  return i - 1;
}

/**
 * Calculate Can Chi representation for a Gregorian year.
 */
export function getYearCanChi(year) {
  return `${CAN[(year + 6) % 10]} ${CHI[(year + 8) % 12]}`;
}

/**
 * Convert Solar (Gregorian) date to Vietnamese Lunar date.
 *
 * @param {number} dd Day (1..31)
 * @param {number} mm Month (1..12)
 * @param {number} yy Year
 * @param {number} [timeZone=7.0] Default GMT+7 (Asia/Ho_Chi_Minh)
 * @returns {{ day: number, month: number, year: number, isLeap: boolean, canChi: string, fullText: string }}
 */
export function convertSolar2Lunar(dd, mm, yy, timeZone = 7.0) {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = INT((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
  }

  const a11_this = getLunarMonth11(yy, timeZone);
  let a11;
  let b11;
  let lunarYear;
  if (a11_this >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, timeZone);
    b11 = a11_this;
  } else {
    lunarYear = yy + 1;
    a11 = a11_this;
    b11 = getLunarMonth11(yy + 1, timeZone);
  }

  const lunarDay = dayNumber - monthStart + 1;
  const diff = INT((monthStart - a11) / 29);
  let lunarLeap = 0;
  let lunarMonth = diff + 11;
  if ((b11 - a11) > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) lunarLeap = 1;
    }
  }

  if (lunarMonth > 12) lunarMonth -= 12;
  if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;

  const canChi = getYearCanChi(lunarYear);
  const ddStr = lunarDay < 10 ? `0${lunarDay}` : `${lunarDay}`;
  const mmStr = lunarMonth < 10 ? `0${lunarMonth}` : `${lunarMonth}`;
  const leapSuffix = lunarLeap === 1 ? ' (Nhuận)' : '';

  return {
    day: lunarDay,
    month: lunarMonth,
    year: lunarYear,
    isLeap: lunarLeap === 1,
    canChi,
    fullText: `${ddStr}/${mmStr}${leapSuffix} ÂL · Năm ${canChi}`
  };
}

/**
 * Convert Julian day number back to Gregorian date (dd, mm, yy).
 */
export function jdToDate(jd) {
  let a, b, c, d, e;
  if (jd > 2299160) {
    let alpha = INT((jd - 1867216.25) / 36524.25);
    a = jd + 1 + alpha - INT(alpha / 4);
  } else {
    a = jd;
  }
  b = a + 1524;
  c = INT((b - 122.1) / 365.25);
  d = INT(365.25 * c);
  e = INT((b - d) / 30.6001);
  const day = INT(b - d - INT(30.6001 * e));
  const month = (e < 14) ? e - 1 : e - 13;
  const year = (month > 2) ? c - 4716 : c - 4715;
  return { day, month, year };
}

/**
 * Convert Vietnamese Lunar date to Solar (Gregorian) date.
 * (Algorithm by Hồ Ngọc Đức, UTC+7).
 *
 * @param {number} lunarDay Day of lunar month (1..30)
 * @param {number} lunarMonth Month of lunar year (1..12)
 * @param {number} lunarYear Lunar year
 * @param {number|boolean} [lunarLeap=0] 1 or true if leap month
 * @param {number} [timeZone=7.0] Default GMT+7 (Asia/Ho_Chi_Minh)
 * @returns {{ day: number, month: number, year: number }|null}
 */
export function convertLunar2Solar(lunarDay, lunarMonth, lunarYear, lunarLeap = 0, timeZone = 7.0) {
  const isLeapNum = (lunarLeap === true || lunarLeap === 1) ? 1 : 0;
  let a11, b11;
  if (lunarMonth < 11) {
    a11 = getLunarMonth11(lunarYear - 1, timeZone);
    b11 = getLunarMonth11(lunarYear, timeZone);
  } else {
    a11 = getLunarMonth11(lunarYear, timeZone);
    b11 = getLunarMonth11(lunarYear + 1, timeZone);
  }
  let k = INT(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  let off = lunarMonth - 11;
  if (off < 0) off += 12;
  if (b11 - a11 > 365) {
    let leapOff = getLeapMonthOffset(a11, timeZone);
    let leapMonth = leapOff - 2;
    if (leapMonth < 0) leapMonth += 12;
    if (isLeapNum !== 0 && lunarMonth !== leapMonth) {
      return null;
    } else if (isLeapNum !== 0 || off >= leapOff) {
      off += 1;
    }
  }
  let monthStart = getNewMoonDay(k + off, timeZone);
  return jdToDate(monthStart + lunarDay - 1);
}

/**
 * Format lunar date object into standardized string.
 */
export function formatLunarDate(lunar) {
  if (!lunar) return '';
  const ddStr = lunar.day < 10 ? `0${lunar.day}` : `${lunar.day}`;
  const mmStr = lunar.month < 10 ? `0${lunar.month}` : `${lunar.month}`;
  const leapSuffix = lunar.isLeap ? ' (Nhuận)' : '';
  const yearSuffix = lunar.canChi ? ` · Năm ${lunar.canChi}` : (lunar.year ? ` · ${lunar.year}` : '');
  return `${ddStr}/${mmStr}${leapSuffix} ÂL${yearSuffix}`;
}

export default {
  CAN,
  CHI,
  jdFromDate,
  jdToDate,
  getNewMoonDay,
  getSunLongitude,
  getLunarMonth11,
  getLeapMonthOffset,
  getYearCanChi,
  convertSolar2Lunar,
  convertLunar2Solar,
  formatLunarDate
};

