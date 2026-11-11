/**
 * tests/test_v1_public_readiness.mjs
 * Comprehensive End-to-End Verification Suite for V1.0 Public Launch Readiness.
 *
 * Runs against an isolated temporary copy of `server/family_archive.db` in `/tmp`
 * (ZERO mutation to canonical `server/family_archive.db`).
 *
 * Verifies:
 *  1. AF-01: Single shell host in `index.html` (no duplicate static header/nav/footer).
 *  2. AF-08: Strict anonymous & PROVISIONED containment across all data APIs & unmounted `/api/spaces`.
 *  3. AF-10: Admin member account provisioning (`POST /api/admin/member-accounts`) & person mapping.
 *  4. AF-06: First-login password activation (`>=8` chars) AND voluntary password change for ACTIVE members.
 *  5. AF-05: Clara Zero-Hint containment (`claraEligible: false`, `404` on `/me/clara`, `403` on `/api/member/clara.json`).
 *  6. AF-02: Full session hydration on `POST /api/member/login` enabling `tuantq` Clara access (`8` letters).
 *  7. AF-07: Vercel Same-Origin Proxy (`vercel.json` rewrites + `X-Forwarded-Host`/`ALLOWED_ORIGINS` CSRF protection).
 *  8. AF-10: Persistent SQLite storage for member proposals (`POST /api/member/proposals`) & Admin Inbox review (`PATCH /api/admin/proposals/:id`).
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { EventEmitter } from 'node:events';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const require = createRequire(import.meta.url);

console.log('🧪 Starting V1.0 Public Launch Readiness E2E Verification Suite...\n');

// ---------------------------------------------------------------------------
// 1. Verify index.html Single Shell & vercel.json Rewrite Proxy Contract
// ---------------------------------------------------------------------------
const indexHtml = fs.readFileSync(path.join(repoRoot, 'index.html'), 'utf8');
assert(!indexHtml.includes('id="pubNav"'), 'AF-01: index.html must not contain duplicate static #pubNav');
assert(!indexHtml.includes('class="gi-masthead"'), 'AF-01: index.html must not contain duplicate static .gi-masthead');
assert(!indexHtml.includes('class="gi-colophon"'), 'AF-01: index.html must not contain duplicate static .gi-colophon');
assert(!indexHtml.includes('#/cai-dat'), 'AF-12: index.html must not contain dead #/cai-dat link');
assert(indexHtml.includes('<div id="gi-app">'), 'index.html must mount #gi-app');
assert(indexHtml.includes('/src/js/ui/boot-public.js'), 'index.html must load boot-public.js');
console.log('  ✅ [1/8] Public Root index.html single-shell host verified (AF-01, AF-12).');

const vercelCfg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'vercel.json'), 'utf8'));
const rewriteSources = new Set((vercelCfg.rewrites || []).map(r => r.source));
for (const expected of ['/login', '/logout', '/me', '/me/:path*', '/api/:path*', '/assets/private/:path*']) {
  assert(rewriteSources.has(expected), `vercel.json missing rewrite for ${expected}`);
}
const redirectSources = new Set((vercelCfg.redirects || []).map(r => r.source));
assert(!redirectSources.has('/assets/private/(.*)'), 'vercel.json must not redirect /assets/private/(.*) before rewrite proxy');
console.log('  ✅ [2/8] vercel.json Same-Origin Rewrite Proxy & edge containment verified (AF-07).');

// ---------------------------------------------------------------------------
// 2. Setup Isolated Temporary SQLite Copy & Express App In-Memory Harness
// ---------------------------------------------------------------------------
const tmpDbPath = path.join(os.tmpdir(), `v1_readiness_${Date.now()}_${process.pid}.db`);
fs.copyFileSync(path.join(repoRoot, 'server', 'family_archive.db'), tmpDbPath);

process.env.DB_CLIENT = 'sqlite3';
process.env.DB_PATH = tmpDbPath;
process.env.DEV_AUTO_LOGIN = 'false';
process.env.SESSION_SECRET = 'test-v1-readiness-secret-key-2026';

const bcrypt = require(path.join(repoRoot, 'server', 'node_modules', 'bcrypt'));
const sqlite3 = require(path.join(repoRoot, 'server', 'node_modules', 'sqlite3'));

// Seed known test credentials in the isolated temp DB copy ONLY
await new Promise((resolve, reject) => {
  const tmpDb = new sqlite3.Database(tmpDbPath);
  const adminHash = bcrypt.hashSync('AdminPass123!', 10);
  const tuanHash = bcrypt.hashSync('TuanPass123!', 10);
  tmpDb.serialize(() => {
    tmpDb.run(
      `INSERT OR REPLACE INTO admin_users (id, username, password_hash, role, is_active)
       VALUES ('adm_owner_test', 'owner_v1', ?, 'owner', 1)`,
      [adminHash]
    );
    tmpDb.run(
      `UPDATE accounts SET password_hash = ?, status = 'ACTIVE', role = 'admin' WHERE username = 'tuantq'`,
      [tuanHash],
      (err) => {
        tmpDb.close();
        if (err) reject(err);
        else resolve();
      }
    );
  });
});

const { app, initDB } = require(path.join(repoRoot, 'server', 'index.js'));
await initDB();

/**
 * Lightweight in-process HTTP dispatcher for Express 5 (sandbox-safe, zero TCP sockets needed).
 */
async function dispatch(appInstance, { method = 'GET', url = '/', headers = {}, body = null, jar = {} } = {}) {
  const cookieHeader = Object.entries(jar).map(([k, v]) => `${k}=${v}`).join('; ');
  const rawHeaders = {
    host: 'localhost:3000',
    ...Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]))
  };
  if (cookieHeader) {
    rawHeaders.cookie = rawHeaders.cookie ? `${rawHeaders.cookie}; ${cookieHeader}` : cookieHeader;
  }

  return new Promise((resolve, reject) => {
    const req = new EventEmitter();
    req.method = method.toUpperCase();
    req.url = url;
    req.originalUrl = url;
    req.headers = rawHeaders;
    req.connection = { remoteAddress: '127.0.0.1', encrypted: false };
    req.socket = req.connection;
    req.ip = '127.0.0.1';
    req.get = (name) => rawHeaders[String(name).toLowerCase()];
    req.header = req.get;
    if (body !== null) {
      req.body = body;
      req._body = true;
    }

    const resHeaders = {};
    const chunks = [];
    const res = new EventEmitter();
    res.statusCode = 200;
    res.headersSent = false;
    res.locals = {};

    res.setHeader = (k, v) => { resHeaders[String(k).toLowerCase()] = v; };
    res.getHeader = (k) => resHeaders[String(k).toLowerCase()];
    res.getHeaders = () => ({ ...resHeaders });
    res.hasHeader = (k) => Object.prototype.hasOwnProperty.call(resHeaders, String(k).toLowerCase());
    res.removeHeader = (k) => { delete resHeaders[String(k).toLowerCase()]; };
    res.writeHead = (code, hdrs) => {
      res.statusCode = code;
      if (hdrs && typeof hdrs === 'object') {
        for (const [hk, hv] of Object.entries(hdrs)) res.setHeader(hk, hv);
      }
      res.headersSent = true;
      return res;
    };
    res.status = (code) => { res.statusCode = code; return res; };
    res.write = (chunk) => {
      if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
      return true;
    };
    res.end = (chunk) => {
      if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
      res.headersSent = true;

      const setCookies = resHeaders['set-cookie'];
      const cookieArr = Array.isArray(setCookies) ? setCookies : (setCookies ? [setCookies] : []);
      for (const sc of cookieArr) {
        const pair = String(sc).split(';')[0];
        const eqIdx = pair.indexOf('=');
        if (eqIdx > 0) {
          const ck = pair.slice(0, eqIdx).trim();
          const cv = pair.slice(eqIdx + 1).trim();
          if (!cv || sc.includes('1970')) delete jar[ck];
          else jar[ck] = cv;
        }
      }

      const text = Buffer.concat(chunks).toString('utf8');
      let json = null;
      try { json = JSON.parse(text); } catch (_) {}
      res.emit('finish');
      resolve({ status: res.statusCode, headers: resHeaders, text, json });
    };
    res.sendFile = (filePath) => {
      try {
        const buf = fs.readFileSync(filePath);
        res.end(buf);
      } catch (err) {
        res.statusCode = 404;
        res.end('Not found');
      }
    };

    try {
      appInstance.handle(req, res, (err) => {
        if (err) reject(err);
        else {
          res.statusCode = 404;
          res.end('Not Found');
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

try {
  // -------------------------------------------------------------------------
  // 3. Anonymous Containment Checks (AF-08)
  // -------------------------------------------------------------------------
  for (const apiUrl of [
    '/api/genealogy.json',
    '/api/media.json',
    '/api/person_media.json',
    '/api/people',
    '/api/stories',
    '/api/calendars/CAL_03_MEMORIALS.ics',
    '/api/admin/member-accounts',
    '/api/admin/proposals'
  ]) {
    const r = await dispatch(app, { url: apiUrl });
    assert.equal(r.status, 401, `Anonymous ${apiUrl} must return 401 (got ${r.status})`);
  }
  const anonSpaces = await dispatch(app, { url: '/api/spaces?persona=family' });
  assert.notEqual(anonSpaces.status, 200, 'Unused /api/spaces router must be unmounted in V1.0');

  for (const pageUrl of ['/me', '/me/tree', '/me/gallery', '/me/events', '/me/mach', '/me/clara']) {
    const r = await dispatch(app, { url: pageUrl });
    assert.equal(r.status, 302, `Anonymous ${pageUrl} must redirect 302 to /login`);
    assert.equal(r.headers.location, '/login');
  }
  console.log('  ✅ [3/8] Anonymous containment across all HTML & JSON endpoints verified (AF-08).');

  // -------------------------------------------------------------------------
  // 4. Admin Provisioning of a New Member Account (AF-10)
  // -------------------------------------------------------------------------
  const adminJar = {};
  const adminLogin = await dispatch(app, {
    method: 'POST',
    url: '/api/auth/login',
    headers: { 'content-type': 'application/json', origin: 'http://localhost:3000' },
    body: { username: 'owner_v1', password: 'AdminPass123!' },
    jar: adminJar
  });
  assert.equal(adminLogin.status, 200, 'Admin owner login must succeed');

  const createMem = await dispatch(app, {
    method: 'POST',
    url: '/api/admin/member-accounts',
    headers: { 'content-type': 'application/json', origin: 'http://localhost:3000' },
    body: {
      username: 'thanhvien.f1',
      password: 'TempPass123!',
      personId: '@I6@'
    },
    jar: adminJar
  });
  assert.equal(createMem.status, 201, `Admin create member must return 201 (got ${createMem.status}: ${createMem.text})`);
  assert.equal(createMem.json.account.status, 'PROVISIONED');
  assert.equal(createMem.json.account.person_id, '@I6@');
  const createdMemberId = createMem.json.account.id;

  const listMem = await dispatch(app, { url: '/api/admin/member-accounts', jar: adminJar });
  assert.equal(listMem.status, 200);
  assert(listMem.json.accounts.some(a => a.username === 'thanhvien.f1' && a.person_id === '@I6@'));
  console.log('  ✅ [4/8] Admin member account provisioning & person identity mapping verified (AF-10).');

  // -------------------------------------------------------------------------
  // 5. PROVISIONED Onboarding Gate -> Password Change -> ACTIVE Member Journey
  // -------------------------------------------------------------------------
  const memberJar = {};
  const memLogin = await dispatch(app, {
    method: 'POST',
    url: '/api/member/login',
    headers: { 'content-type': 'application/json' },
    body: { username: 'thanhvien.f1', password: 'TempPass123!' },
    jar: memberJar
  });
  assert.equal(memLogin.status, 200);
  assert.equal(memLogin.json.status, 'PROVISIONED');

  // PROVISIONED account must be blocked from data APIs until password change!
  const provGen = await dispatch(app, { url: '/api/genealogy.json', jar: memberJar });
  assert.equal(provGen.status, 403, 'PROVISIONED account must get 403 on /api/genealogy.json');
  assert.equal(provGen.json.error, 'PASSWORD_CHANGE_REQUIRED');

  const provTree = await dispatch(app, { url: '/me/tree', jar: memberJar });
  assert.equal(provTree.status, 302);
  assert.equal(provTree.headers.location, '/me/change-password');

  // Weak password (<8 chars) rejected
  const weakChange = await dispatch(app, {
    method: 'POST',
    url: '/api/member/change-password',
    headers: { 'content-type': 'application/json', origin: 'http://localhost:3000' },
    body: { oldPassword: 'TempPass123!', newPassword: 'short' },
    jar: memberJar
  });
  assert.equal(weakChange.status, 400);

  // Strong password activates account
  const okChange = await dispatch(app, {
    method: 'POST',
    url: '/api/member/change-password',
    headers: { 'content-type': 'application/json', origin: 'http://localhost:3000' },
    body: { oldPassword: 'TempPass123!', newPassword: 'NewMemberPass2026!' },
    jar: memberJar
  });
  assert.equal(okChange.status, 200);

  // Voluntary password change page for ACTIVE member must NOT redirect-loop!
  const activeChangePage = await dispatch(app, { url: '/me/change-password', jar: memberJar });
  assert.equal(activeChangePage.status, 200, 'AF-06: ACTIVE member must open /me/change-password without redirect loop');
  assert(activeChangePage.text.includes('Đổi mật khẩu tài khoản'));
  assert(activeChangePage.text.includes('← Quay lại Không gian của tôi'));
  console.log('  ✅ [5/8] PROVISIONED data lock & ACTIVE voluntary password change verified (AF-06, AF-08).');

  // -------------------------------------------------------------------------
  // 6. Regular Member Journey, Zero-Hint Clara Containment & Deferred Spaces
  // -------------------------------------------------------------------------
  const memProfile = await dispatch(app, { url: '/api/member/profile', jar: memberJar });
  assert.equal(memProfile.status, 200);
  assert.equal(memProfile.json.claraEligible, false, 'Regular member must have claraEligible: false');
  assert.equal(memProfile.json.person.id, '@I6@');

  const claraHtmlDenied = await dispatch(app, { url: '/me/clara', jar: memberJar });
  assert.equal(claraHtmlDenied.status, 404, 'AF-05: Regular member must get 404 Zero-Hint on /me/clara HTML');

  const claraJsonDenied = await dispatch(app, { url: '/api/member/clara.json', jar: memberJar });
  assert.equal(claraJsonDenied.status, 403, 'Regular member must get 403 on /api/member/clara.json');

  const spacesRedirect = await dispatch(app, { url: '/me/family-spaces', jar: memberJar });
  assert.equal(spacesRedirect.status, 302, 'Deferred /me/family-spaces must redirect 302 to /me');
  assert.equal(spacesRedirect.headers.location, '/me');

  const machHtml = await dispatch(app, { url: '/me/mach', jar: memberJar });
  assert.equal(machHtml.status, 200);
  assert(machHtml.text.includes('<title>MẠCH · Gia Tộc Trần Trọng Thu</title>'), 'AF-15: Clean UTF-8 title in member_mach.html');
  console.log('  ✅ [6/8] Clara Zero-Hint containment, UTF-8 HTML & /me/family-spaces deferral verified (AF-05, AF-15).');

  // -------------------------------------------------------------------------
  // 7. Vercel Proxy CSRF Validation + Real SQLite Proposal Persistence + Inbox
  // -------------------------------------------------------------------------
  const csrfBlocked = await dispatch(app, {
    method: 'POST',
    url: '/api/member/proposals',
    headers: {
      'content-type': 'application/json',
      host: 'api.giatoctrantrongthu.com',
      origin: 'https://malicious-attacker.example'
    },
    body: { personId: '@I6@', field: 'notes', suggestedValue: 'Fake edit' },
    jar: memberJar
  });
  assert.equal(csrfBlocked.status, 403, 'Cross-site attacker origin must be blocked by CSRF');

  const propCreated = await dispatch(app, {
    method: 'POST',
    url: '/api/member/proposals',
    headers: {
      'content-type': 'application/json',
      host: 'api.giatoctrantrongthu.com',
      'x-forwarded-host': 'giatoctrantrongthu.com',
      origin: 'https://giatoctrantrongthu.com'
    },
    body: {
      personId: '@I6@',
      field: 'birthYear',
      suggestedValue: '1908',
      sourceEvidence: 'Sổ gia phả gốc trang 4',
      reason: 'Đối chiếu bia mộ'
    },
    jar: memberJar
  });
  assert.equal(propCreated.status, 200, `Proxied proposal POST must succeed (got ${propCreated.status}: ${propCreated.text})`);
  assert.match(propCreated.json.proposalId, /^PROP_\d+$/);

  const adminInbox = await dispatch(app, { url: '/api/admin/proposals', jar: adminJar });
  assert.equal(adminInbox.status, 200);
  assert.equal(adminInbox.json.pendingCount, 1);
  assert.equal(adminInbox.json.proposals[0].id, propCreated.json.proposalId);
  assert.equal(adminInbox.json.proposals[0].account_username, 'thanhvien.f1');

  const reviewRes = await dispatch(app, {
    method: 'PATCH',
    url: `/api/admin/proposals/${propCreated.json.proposalId}`,
    headers: { 'content-type': 'application/json', origin: 'https://giatoctrantrongthu.com', host: 'api.giatoctrantrongthu.com' },
    body: { status: 'APPROVED', reviewer_note: 'Đã đối chiếu sổ thờ họ Trần.' },
    jar: adminJar
  });
  assert.equal(reviewRes.status, 200);
  assert.equal(reviewRes.json.status, 'APPROVED');

  // Lock member account via Admin PATCH and verify session revocation
  const lockRes = await dispatch(app, {
    method: 'PATCH',
    url: `/api/admin/member-accounts/${createdMemberId}`,
    headers: { 'content-type': 'application/json', origin: 'http://localhost:3000' },
    body: { status: 'DISABLED' },
    jar: adminJar
  });
  assert.equal(lockRes.status, 200);
  const lockedCheck = await dispatch(app, { url: '/api/genealogy.json', jar: memberJar });
  assert.equal(lockedCheck.status, 401, 'DISABLED member session must immediately lose API access');
  console.log('  ✅ [7/8] Vercel Proxy CSRF, persistent Proposal DB & Admin Inbox/Lock workflow verified (AF-07, AF-10).');

  // -------------------------------------------------------------------------
  // 8. Clara-Eligible Session Hydration via /api/member/login (AF-02)
  // -------------------------------------------------------------------------
  const tuanJar = {};
  const tuanLogin = await dispatch(app, {
    method: 'POST',
    url: '/api/member/login',
    headers: { 'content-type': 'application/json' },
    body: { username: 'tuantq', password: 'TuanPass123!' },
    jar: tuanJar
  });
  assert.equal(tuanLogin.status, 200);

  const tuanProfile = await dispatch(app, { url: '/api/member/profile', jar: tuanJar });
  assert.equal(tuanProfile.status, 200);
  assert.equal(tuanProfile.json.claraEligible, true, 'AF-02: tuantq must have claraEligible: true after /api/member/login');

  const tuanClaraHtml = await dispatch(app, { url: '/me/clara', jar: tuanJar });
  assert.equal(tuanClaraHtml.status, 200);
  assert(tuanClaraHtml.text.includes('<title>Thư gửi Clara · Gia Tộc Trần Trọng Thu</title>'));

  const tuanClaraJson = await dispatch(app, { url: '/api/member/clara.json', jar: tuanJar });
  assert.equal(tuanClaraJson.status, 200);
  assert.equal(tuanClaraJson.json.stories.length, 8, 'tuantq must receive all 8 Clara letters');
  console.log('  ✅ [8/8] Clara session hydration & 8-letter delivery for authorized account verified (AF-02).');

  console.log('\n============================================================');
  console.log('🎉 ALL V1.0 PUBLIC LAUNCH READINESS E2E TESTS PASSED (100%)!');
  console.log('============================================================\n');
} finally {
  try { fs.unlinkSync(tmpDbPath); } catch (_) {}
}
