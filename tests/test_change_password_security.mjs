/**
 * tests/test_change_password_security.mjs
 * Security Verification Suite for Member Password Change Endpoint
 *
 * Verifies:
 * 1. Unauthenticated request without session is rejected (HTTP 401).
 * 2. Request with invalid current password is rejected (HTTP 401).
 * 3. Request with valid current password succeeds and updates both accounts & admin_users.
 * 4. New password is verified against bcrypt.compare.
 * 5. Atomic transaction rollback prevents partial update if an error occurs.
 * 6. Audit trail is recorded without storing plaintext passwords or hashes.
 * 7. Multi-tenant isolation: Request can ONLY mutate the caller's own account (scoped to session.accountId).
 * 8. Rate limiting kicks in after exceeding threshold.
 */

import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sqlite3 = require('../server/node_modules/sqlite3');
const bcrypt = require('../server/node_modules/bcrypt');
const express = require('../server/node_modules/express');

import { createMemberRouter } from '../server/member.js';
import { withTransaction, recordAuditLog } from '../server/governance.js';

console.log('🔒 Starting Change Password Security Verification Suite...\n');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testDbPath = path.join(__dirname, 'test_pwd_security_scratch.db');

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
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    password_hash TEXT,
    role TEXT DEFAULT 'editor',
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  await runQuery(`CREATE TABLE identity_mappings (
    account_id TEXT PRIMARY KEY,
    person_id TEXT
  )`);

  await runQuery(`CREATE TABLE audit_logs (
    id TEXT PRIMARY KEY,
    actor_id TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    before_value TEXT,
    after_value TEXT,
    reason TEXT,
    correlation_id TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);
}

async function runTests() {
  await setupSchema();

  // Create test accounts (User A and User B)
  const initialHashA = await bcrypt.hash('TestPassA123!', 10);
  const initialHashB = await bcrypt.hash('TestPassB123!', 10);

  await runQuery("INSERT INTO accounts (id, username, password_hash, role, status) VALUES ('ACC_A', 'usera', ?, 'owner', 'ACTIVE')", [initialHashA]);
  await runQuery("INSERT INTO admin_users (id, username, password_hash, role, is_active) VALUES ('ADM_A', 'usera', ?, 'owner', 1)", [initialHashA]);

  await runQuery("INSERT INTO accounts (id, username, password_hash, role, status) VALUES ('ACC_B', 'userb', ?, 'member', 'ACTIVE')", [initialHashB]);

  // Rate limiter mock for test
  let rateLimitCalls = 0;
  const mockPasswordChangeLimiter = (req, res, next) => {
    rateLimitCalls++;
    if (rateLimitCalls > 5) {
      return res.status(429).json({ error: 'RATE_LIMIT_EXCEEDED' });
    }
    next();
  };

  const memberRouter = createMemberRouter(dbAccessor, {
    passwordChangeLimiter: mockPasswordChangeLimiter
  });

  // Mock Request/Response helper
  function makeRequest({ session = null, body = {}, path = '/api/member/change-password' }) {
    return new Promise((resolve) => {
      const req = {
        method: 'POST',
        path,
        url: path,
        session,
        body,
        headers: {}
      };

      const res = {
        statusCode: 200,
        headers: {},
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(data) {
          resolve({ status: this.statusCode, body: data });
        },
        redirect(url) {
          resolve({ status: 302, redirectUrl: url });
        }
      };

      // Dispatch to router
      memberRouter.handle(req, res, (err) => {
        if (err) resolve({ status: 500, error: err.message });
        else resolve({ status: 404, body: 'Not Handled' });
      });
    });
  }

  console.log('--- TEST 1: Unauthenticated request without session is rejected (401) ---');
  {
    const res = await makeRequest({ session: null, body: { oldPassword: 'foo', newPassword: 'BarPass123456!' } });
    assert.equal(res.status, 401, 'Expected 401 for request without session');
    assert.equal(res.body.error, 'Chưa đăng nhập');
    console.log('✓ PASS: Rejected with 401 JSON');
  }

  console.log('\n--- TEST 2: Request with invalid current password is rejected (401) ---');
  {
    const session = { accountId: 'ACC_A', username: 'usera', role: 'owner', status: 'ACTIVE' };
    const res = await makeRequest({
      session,
      body: { oldPassword: 'WrongPassword!', newPassword: 'NewValidPassword123!' }
    });
    assert.equal(res.status, 401, 'Expected 401 for wrong current password');
    assert.equal(res.body.error, 'Mật khẩu hiện tại không đúng');
    console.log('✓ PASS: Rejected with 401 (Mật khẩu hiện tại không đúng)');
  }

  console.log('\n--- TEST 3: Request with short new password (< 8 chars) is rejected (400) ---');
  {
    const session = { accountId: 'ACC_A', username: 'usera', role: 'owner', status: 'ACTIVE' };
    const res = await makeRequest({
      session,
      body: { oldPassword: 'TestPassA123!', newPassword: 'short' }
    });
    assert.equal(res.status, 400, 'Expected 400 for new password < 8 chars');
    console.log('✓ PASS: Rejected with 400');
  }

  console.log('\n--- TEST 4: Valid password change updates BOTH accounts & admin_users atomically ---');
  {
    const session = { accountId: 'ACC_A', username: 'usera', role: 'owner', status: 'ACTIVE' };
    const res = await makeRequest({
      session,
      body: { oldPassword: 'TestPassA123!', newPassword: 'UpdatedSecret2026!' }
    });
    assert.equal(res.status, 200, 'Expected 200 for valid change');
    assert.equal(res.body.success, true);

    // Verify accounts table
    const accA = await getQuery("SELECT * FROM accounts WHERE id = 'ACC_A'");
    const accOk = await bcrypt.compare('UpdatedSecret2026!', accA.password_hash);
    assert.equal(accOk, true, 'New password must match in accounts');

    // Verify admin_users table
    const admA = await getQuery("SELECT * FROM admin_users WHERE username = 'usera'");
    const admOk = await bcrypt.compare('UpdatedSecret2026!', admA.password_hash);
    assert.equal(admOk, true, 'New password must match in admin_users');

    // Verify old password no longer works
    const oldWorks = await bcrypt.compare('TestPassA123!', accA.password_hash);
    assert.equal(oldWorks, false, 'Old password must no longer work');
    console.log('✓ PASS: Both accounts & admin_users updated with new bcrypt hash');
  }

  console.log('\n--- TEST 5: Audit log is recorded without password or hash leakage ---');
  {
    const audits = await allQuery("SELECT * FROM audit_logs WHERE entity_id = 'ACC_A'");
    assert.equal(audits.length, 1, 'Expected exactly 1 audit log entry');
    const log = audits[0];
    assert.equal(log.action, 'PASSWORD_CHANGE');
    assert.equal(log.actor_id, 'ACC_A');
    assert.equal(log.entity_type, 'ACCOUNT');
    assert.equal(log.reason, 'VOLUNTARY_PASSWORD_UPDATE');
    // Ensure no password or hash leaked in before/after values
    assert.equal(log.before_value, null, 'before_value must be null');
    assert.equal(log.after_value, null, 'after_value must be null');
    console.log('✓ PASS: Audit log recorded cleanly without plaintext or hash exposure');
  }

  console.log('\n--- TEST 6: Multi-tenant isolation (Cannot change password of another account) ---');
  {
    // Session is for User A, attempts to submit password change.
    // Ensure User B is 100% untouched.
    const accBBefore = await getQuery("SELECT * FROM accounts WHERE id = 'ACC_B'");
    const sessionA = { accountId: 'ACC_A', username: 'usera', role: 'owner', status: 'ACTIVE' };
    await makeRequest({
      session: sessionA,
      body: { oldPassword: 'UpdatedSecret2026!', newPassword: 'AnotherPassword999!' }
    });

    const accBAfter = await getQuery("SELECT * FROM accounts WHERE id = 'ACC_B'");
    assert.equal(accBBefore.password_hash, accBAfter.password_hash, 'User B hash must be completely untouched');
    console.log('✓ PASS: User B was completely isolated and untouched');
  }

  console.log('\n--- TEST 7: Atomic rollback prevents partial update if error occurs ---');
  {
    // Simulate transaction failure by forcing an error inside withTransaction
    const failingDbAccessor = {
      ...dbAccessor,
      runQuery: async (q, params) => {
        if (q.includes('UPDATE admin_users')) {
          throw new Error('Simulated DB Constraint Failure on admin_users');
        }
        return runQuery(q, params);
      }
    };

    const failingRouter = createMemberRouter(failingDbAccessor);

    const hashBeforeAcc = (await getQuery("SELECT password_hash FROM accounts WHERE id = 'ACC_A'")).password_hash;
    const hashBeforeAdm = (await getQuery("SELECT password_hash FROM admin_users WHERE username = 'usera'")).password_hash;

    const sessionA = { accountId: 'ACC_A', username: 'usera', role: 'owner', status: 'ACTIVE' };
    const res = await new Promise((resolve) => {
      const req = {
        method: 'POST',
        path: '/api/member/change-password',
        url: '/api/member/change-password',
        session: sessionA,
        body: { oldPassword: 'AnotherPassword999!', newPassword: 'RollbackTarget123!' }
      };
      const r = {
        status(code) { this.statusCode = code; return this; },
        json(data) { resolve({ status: this.statusCode || 200, body: data }); }
      };
      failingRouter.handle(req, r, () => resolve({ status: 500 }));
    });

    assert.equal(res.status, 500, 'Expected 500 on failure');

    const hashAfterAcc = (await getQuery("SELECT password_hash FROM accounts WHERE id = 'ACC_A'")).password_hash;
    const hashAfterAdm = (await getQuery("SELECT password_hash FROM admin_users WHERE username = 'usera'")).password_hash;

    assert.equal(hashBeforeAcc, hashAfterAcc, 'accounts MUST be rolled back');
    assert.equal(hashBeforeAdm, hashAfterAdm, 'admin_users MUST be unchanged');
    console.log('✓ PASS: Full rollback verified, zero partial update occurred');
  }

  console.log('\n--- TEST 8: Rate limiting enforcement ---');
  {
    // We already made 4 calls earlier with mockPasswordChangeLimiter. Next 2 calls should exceed 5.
    const sessionA = { accountId: 'ACC_A', username: 'usera', role: 'owner', status: 'ACTIVE' };
    const res5 = await makeRequest({ session: sessionA, body: { oldPassword: 'foo', newPassword: 'bar' } });
    const res6 = await makeRequest({ session: sessionA, body: { oldPassword: 'foo', newPassword: 'bar' } });
    assert.equal(res6.status, 429, 'Expected 429 when exceeding rate limit');
    assert.equal(res6.body.error, 'RATE_LIMIT_EXCEEDED');
    console.log('✓ PASS: Rate limit enforced (HTTP 429)');
  }

  db.close();
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }

  console.log('\n🎉 ALL 8 SECURITY TESTS PASSED 100%!');
}

runTests().catch((err) => {
  console.error('\n❌ TEST FAILED:', err);
  db.close();
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
  process.exit(1);
});

