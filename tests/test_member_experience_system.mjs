/**
 * tests/test_member_experience_system.mjs
 * In-Memory Integration & Security Test Suite for Member Experience & Interaction System
 *
 * Covers:
 * 1. Public & Onboarding Gateways (/login, /help, /help/recovery)
 * 2. Member Onboarding & First-Time Activation (PROVISIONED -> ACTIVE)
 * 3. Member Dedicated Surfaces (/me/account, /me/requests, /me/contribute)
 * 4. Multi-Tenant IDOR Protection on /api/member/proposals/my
 * 5. Support & Contribution Submission API (/api/member/support)
 * 6. Clara Branch-Restricted Protection (Zero-Hint 404 & 403)
 * 7. Session Invalidation on Disabled Accounts
 */

import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sqlite3 = require('../server/node_modules/sqlite3');
const bcrypt = require('../server/node_modules/bcrypt');

import { createMemberRouter } from '../server/member.js';

console.log('🧪 Starting Member Experience & Interaction System Test Suite...\n');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testDbPath = path.join(__dirname, 'test_member_experience_scratch.db');

if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
}

const db = new sqlite3.Database(testDbPath);

const runQuery = (q, params = []) => new Promise((res, rej) => db.run(q, params, function (err) {
  if (err) return rej(err);
  res({ changes: this.changes, lastID: this.lastID });
}));
const getQuery = (q, params = []) => new Promise((res, rej) => db.get(q, params, (err, row) => err ? rej(err) : res(row)));
const allQuery = (q, params = []) => new Promise((res, rej) => db.all(q, params, (err, rows) => err ? rej(err) : res(rows)));

const dbAccessor = { runQuery, getQuery, allQuery, isMySQL: false };

async function setupSchema() {
  await runQuery(`CREATE TABLE accounts (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    password_hash TEXT,
    role TEXT DEFAULT 'member',
    status TEXT DEFAULT 'ACTIVE',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  await runQuery(`CREATE TABLE admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password_hash TEXT,
    role TEXT DEFAULT 'editor',
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  await runQuery(`CREATE TABLE people (
    id TEXT PRIMARY KEY,
    name TEXT,
    birthYear TEXT,
    deathYear TEXT,
    gender TEXT,
    notes TEXT,
    payload TEXT
  )`);

  await runQuery(`CREATE TABLE identity_mappings (
    account_id TEXT PRIMARY KEY,
    person_id TEXT
  )`);

  await runQuery(`CREATE TABLE proposals (
    id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL,
    person_id TEXT NOT NULL,
    field TEXT NOT NULL,
    suggested_value TEXT NOT NULL,
    base_value TEXT,
    source_evidence TEXT,
    reason TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING',
    reviewer_note TEXT,
    reviewer_id TEXT,
    committed_at TEXT,
    commit_error TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TEXT
  )`);

  await runQuery(`CREATE TABLE audit_logs (
    id TEXT PRIMARY KEY,
    actor_id TEXT,
    actor_role TEXT,
    action TEXT,
    entity_type TEXT,
    entity_id TEXT,
    before_value TEXT,
    after_value TEXT,
    reason TEXT,
    correlation_id TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  // Seed sample people
  await runQuery(`INSERT INTO people (id, name, birthYear) VALUES ('@I1@', 'Trần Trọng Thu', '1880')`);
  await runQuery(`INSERT INTO people (id, name, birthYear) VALUES ('@I115@', 'Trần Quang Tuấn', '1990')`);
  await runQuery(`INSERT INTO people (id, name, birthYear) VALUES ('@I6@', 'Trần Thị Thi', '1910')`);
}

async function runTestSuite() {
  await setupSchema();

  const memberRouter = createMemberRouter(dbAccessor, {});

  // Mock Request/Response dispatcher for sandboxed execution
  function makeRequest({ method = 'GET', path = '/', session = null, body = {} } = {}) {
    return new Promise((resolve) => {
      const req = {
        method,
        path,
        url: path,
        session,
        body,
        headers: {},
        params: {}
      };

      const res = {
        statusCode: 200,
        headers: {},
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(data) {
          resolve({ status: this.statusCode, json: data });
        },
        send(data) {
          resolve({ status: this.statusCode, text: String(data) });
        },
        sendFile(filePath) {
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            resolve({ status: this.statusCode, text: content, file: filePath });
          } catch (e) {
            resolve({ status: 500, error: e.message });
          }
        },
        redirect(url) {
          resolve({ status: 302, redirectUrl: url });
        },
        end() {
          resolve({ status: this.statusCode });
        }
      };

      memberRouter(req, res, (err) => {
        if (err) resolve({ status: 500, error: err });
        else resolve({ status: 404, text: 'Not Found' });
      });
    });
  }

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Public Gateways Availability
    // -------------------------------------------------------------------------
    console.log('--- TEST 1: Public Gateways Availability (/login, /help, /help/recovery) ---');

    const resLogin = await makeRequest({ method: 'GET', path: '/login' });
    assert.equal(resLogin.status, 200, 'Login page must be accessible');
    assert.match(resLogin.text, /Hiện mật khẩu/, 'Login must have show password toggle');
    assert.match(resLogin.text, /help\/recovery/, 'Login must link to recovery');
    assert.match(resLogin.text, /help/, 'Login must link to help for new members');
    console.log('✓ PASS: Login page verified with accessibility & recovery navigation');

    const resHelp = await makeRequest({ method: 'GET', path: '/help' });
    assert.equal(resHelp.status, 200, 'Help page must be accessible');
    assert.match(resHelp.text, /boot-help\.js/, 'Help page must load boot-help.js');
    console.log('✓ PASS: Help page verified');

    const resRecovery = await makeRequest({ method: 'GET', path: '/help/recovery' });
    assert.equal(resRecovery.status, 200, 'Recovery page must be accessible');
    assert.match(resRecovery.text, /boot-recovery\.js/, 'Recovery page must load boot-recovery.js');
    console.log('✓ PASS: Account recovery page verified');

    // -------------------------------------------------------------------------
    // TEST 2: Onboarding & First-Time Activation Flow (PROVISIONED -> ACTIVE)
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 2: Member Onboarding & First-Time Activation (PROVISIONED -> ACTIVE) ---');
    const tempHash = await bcrypt.hash('TempPass123', 10);
    const acc1Id = 'acc-new-001';
    await runQuery(`INSERT INTO accounts (id, username, password_hash, role, status) VALUES (?, ?, ?, 'member', 'PROVISIONED')`, [acc1Id, 'nguoithan1', tempHash]);
    await runQuery(`INSERT INTO identity_mappings (account_id, person_id) VALUES (?, ?)`, [acc1Id, '@I6@']);

    // Session in PROVISIONED status
    let sessionUser1 = { accountId: acc1Id, username: 'nguoithan1', role: 'member', status: 'PROVISIONED' };

    // Should be able to view /me/change-password
    const resPwdPage = await makeRequest({ method: 'GET', path: '/me/change-password', session: sessionUser1 });
    assert.equal(resPwdPage.status, 200);
    assert.match(resPwdPage.text, /Đặt mật khẩu của bạn/, 'First-time activation title expected');

    // Calling proposals before activation must be blocked
    const resBlockedProp = await makeRequest({
      method: 'POST',
      path: '/api/member/proposals',
      session: sessionUser1,
      body: { personId: '@I6@', field: 'birthYear', suggestedValue: '1911' }
    });
    assert.equal(resBlockedProp.status, 403);
    assert.equal(resBlockedProp.json.error, 'PASSWORD_CHANGE_REQUIRED');
    console.log('✓ PASS: PROVISIONED account strictly blocked from mutating genealogy data');

    // Perform password change to activate
    const resActivate = await makeRequest({
      method: 'POST',
      path: '/api/member/change-password',
      session: sessionUser1,
      body: { oldPassword: 'TempPass123', newPassword: 'NewSecurePassword2026' }
    });
    assert.equal(resActivate.status, 200);
    assert.equal(resActivate.json.success, true);

    // Verify DB status is now ACTIVE
    const updatedAcc1 = await getQuery(`SELECT status, password_hash FROM accounts WHERE id = ?`, [acc1Id]);
    assert.equal(updatedAcc1.status, 'ACTIVE');
    const isNewPassValid = await bcrypt.compare('NewSecurePassword2026', updatedAcc1.password_hash);
    assert.equal(isNewPassValid, true);
    console.log('✓ PASS: Account successfully transitioned from PROVISIONED to ACTIVE');

    // -------------------------------------------------------------------------
    // TEST 3: Accessing Dedicated Member Surfaces
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 3: Member Dedicated Surfaces (/me/account, /me/requests, /me/contribute) ---');
    sessionUser1.status = 'ACTIVE';

    const resAccount = await makeRequest({ method: 'GET', path: '/me/account', session: sessionUser1 });
    assert.equal(resAccount.status, 200);
    assert.match(resAccount.text, /boot-account\.js/);
    console.log('✓ PASS: /me/account served cleanly');

    const resRequests = await makeRequest({ method: 'GET', path: '/me/requests', session: sessionUser1 });
    assert.equal(resRequests.status, 200);
    assert.match(resRequests.text, /boot-requests\.js/);
    console.log('✓ PASS: /me/requests served cleanly');

    const resContribute = await makeRequest({ method: 'GET', path: '/me/contribute', session: sessionUser1 });
    assert.equal(resContribute.status, 200);
    assert.match(resContribute.text, /boot-contribute\.js/);
    console.log('✓ PASS: /me/contribute served cleanly');

    const resLetters = await makeRequest({ method: 'GET', path: '/me/letters', session: sessionUser1 });
    assert.equal(resLetters.status, 200);
    assert.match(resLetters.text, /boot-letters\.js/);
    console.log('✓ PASS: /me/letters (First-Class Letters & Legacy) served cleanly');

    // -------------------------------------------------------------------------
    // TEST 4: IDOR Protection on /api/member/proposals/my
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 4: IDOR Protection on /api/member/proposals/my ---');
    // Seed proposal for User 1
    await runQuery(`INSERT INTO proposals (id, account_id, person_id, field, suggested_value, reason, status)
      VALUES ('PROP_USER1_01', ?, '@I6@', 'birthYear', '1910', 'Bia mộ', 'PENDING')`, [acc1Id]);

    // Seed proposal for User 2
    const acc2Id = 'acc-user-002';
    await runQuery(`INSERT INTO accounts (id, username, password_hash, role, status) VALUES (?, 'nguoithan2', 'hash', 'member', 'ACTIVE')`, [acc2Id]);
    await runQuery(`INSERT INTO proposals (id, account_id, person_id, field, suggested_value, reason, status)
      VALUES ('PROP_USER2_01', ?, '@I115@', 'notes', 'Ghi chú riêng tư của User 2', 'Bí mật', 'PENDING')`, [acc2Id]);

    // Caller is User 1
    const resUser1Proposals = await makeRequest({ method: 'GET', path: '/api/member/proposals/my', session: sessionUser1 });
    assert.equal(resUser1Proposals.status, 200);
    assert.equal(resUser1Proposals.json.proposals.length, 1);
    assert.equal(resUser1Proposals.json.proposals[0].id, 'PROP_USER1_01');
    assert.equal(resUser1Proposals.json.proposals.some(p => p.id === 'PROP_USER2_01'), false, 'User 1 MUST NOT see User 2 proposals');
    console.log('✓ PASS: User 1 only sees their own proposals, User 2 data is 100% isolated');

    // -------------------------------------------------------------------------
    // TEST 5: Support & Contribution Submission (/api/member/support)
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 5: Member Support & Contribution Submission (/api/member/support) ---');
    const resSupport = await makeRequest({
      method: 'POST',
      path: '/api/member/support',
      session: sessionUser1,
      body: {
        type: 'MEDIA_CONTRIBUTION',
        subject: 'Di ảnh cụ Hạnh năm 1960',
        message: 'Bức ảnh chụp gia đình tại Hải Phòng.',
        contactInfo: '0988.123.456'
      }
    });
    assert.equal(resSupport.status, 200);
    assert.equal(resSupport.json.ok, true);
    assert.match(resSupport.json.requestId, /^REQ_\d+/);

    // Verify stored in DB
    const savedReq = await getQuery(`SELECT * FROM proposals WHERE id = ?`, [resSupport.json.requestId]);
    assert.ok(savedReq);
    assert.equal(savedReq.account_id, acc1Id);
    assert.equal(savedReq.field, 'MEDIA_CONTRIBUTION');
    assert.equal(savedReq.status, 'PENDING');
    console.log('✓ PASS: Contribution successfully stored in proposals queue with PENDING status');

    // -------------------------------------------------------------------------
    // TEST 6: Clara Branch-Restricted Protection (Zero-Hint)
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 6: Clara Branch-Restricted Protection (Zero-Hint) ---');
    // User 1 is not eligible for Clara
    const resClaraApi = await makeRequest({ method: 'GET', path: '/api/member/clara.json', session: sessionUser1 });
    assert.equal(resClaraApi.status, 403, 'Unauthorized member must receive 403 on Clara API');

    const resClaraPage = await makeRequest({ method: 'GET', path: '/me/clara', session: sessionUser1 });
    assert.equal(resClaraPage.status, 404, 'Unauthorized member must receive 404 on Clara HTML page (Zero-Hint)');
    console.log('✓ PASS: Clara Zero-Hint containment strictly intact');

    // -------------------------------------------------------------------------
    // TEST 7: Session Invalidation on Disabled Accounts
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 7: Session Invalidation on Disabled Accounts ---');
    await runQuery(`UPDATE accounts SET status = 'DISABLED' WHERE id = ?`, [acc1Id]);

    let sessionDestroyed = false;
    const sessionDisabled = {
      accountId: acc1Id,
      status: 'ACTIVE', // old cached status in session
      destroy: (cb) => { sessionDestroyed = true; if (cb) cb(); }
    };

    const resDisabledApi = await makeRequest({ method: 'GET', path: '/api/member/profile', session: sessionDisabled });
    assert.equal(resDisabledApi.status, 403);
    assert.equal(sessionDestroyed, true, 'Session must be destroyed when account is DISABLED in database');
    console.log('✓ PASS: Real-time DB check instantly revokes session for DISABLED accounts');

    console.log('\n============================================================');
    console.log('🎉 ALL 7 MEMBER EXPERIENCE INTEGRATION TESTS PASSED 100%!');
    console.log('============================================================\n');
  } finally {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  }
}

runTestSuite().catch((err) => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
