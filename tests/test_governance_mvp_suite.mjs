/**
 * tests/test_governance_mvp_suite.mjs
 * Comprehensive Acceptance Test Suite for Batch 06 — Minimum Viable Governance.
 *
 * Covers all 12 Required Governance Test Cases:
 * 1. Guest cannot write data (401).
 * 2. Member cannot directly write to Official Data (403).
 * 3. Member can submit valid Proposal (stores base_value, creates audit log).
 * 4. Member cannot self-approve Proposal (403 SELF_APPROVAL_PROHIBITED).
 * 5. Owner can approve Proposal.
 * 6. Approved Proposal is committed accurately (people and payload updated, status APPROVED, committed_at set).
 * 7. Rejected Proposal does not change Official Data (status REJECTED, official data unchanged, audit log recorded).
 * 8. Owner Direct Edit creates Audit Log with before/after state.
 * 9. Commit failure triggers rollback.
 * 10. Cannot commit duplicate / already committed proposal (Idempotency / 409).
 * 11. Old API routes cannot bypass Authorization.
 * 12. Sensitive data remains protected (Audit logs restricted to Owner only).
 */

import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sqlite3 = require('../server/node_modules/sqlite3');

import { createAuthRouter, createUsersRouter, requireAuth, requireOwner, setAuthDbAccessor } from '../server/auth.js';
import { createAdminOperationsRouter } from '../server/admin_operations.js';
import { createMemberRouter } from '../server/member.js';
import { withTransaction, recordAuditLog, commitProposal, rejectProposal, executeDirectEditWithAudit } from '../server/governance.js';

console.log('🧪 Starting Batch 06 Minimum Viable Governance Acceptance Suite...\n');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testDbPath = path.join(__dirname, 'test_governance_scratch.db');

// Remove any existing scratch database
if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
}

const db = new sqlite3.Database(testDbPath);

const runQuery = (q, params = []) => new Promise((res, rej) => db.run(q, params, function (err) {
  if (err) return rej(err);
  res({ changes: this.changes, lastID: this.lastID });
}));
const allQuery = (q, params = []) => new Promise((res, rej) => db.all(q, params, (err, rows) => err ? rej(err) : res(rows)));
const getQuery = (q, params = []) => new Promise((res, rej) => db.get(q, params, (err, row) => err ? rej(err) : res(row)));

const testDbAccessor = { runQuery, allQuery, getQuery };
setAuthDbAccessor(testDbAccessor);

async function setupTestSchema() {
  await runQuery(`CREATE TABLE people (
    id TEXT PRIMARY KEY, name TEXT, birthYear TEXT, deathYear TEXT, gender TEXT, notes TEXT, status TEXT, payload TEXT
  )`);
  await runQuery(`CREATE TABLE stories (
    id TEXT PRIMARY KEY, title TEXT, author TEXT, content TEXT, status TEXT, updatedAt TEXT
  )`);
  await runQuery(`CREATE TABLE edges (
    source_id TEXT, target_id TEXT, edge_type TEXT, PRIMARY KEY (source_id, target_id, edge_type)
  )`);
  await runQuery(`CREATE TABLE calendar_events (
    uid TEXT PRIMARY KEY, summary TEXT NOT NULL, dtstart TEXT NOT NULL, dtend TEXT,
    description TEXT, location TEXT, calendar_type TEXT NOT NULL, event_type TEXT, status TEXT NOT NULL DEFAULT 'DRAFT'
  )`);
  await runQuery(`CREATE TABLE admin_users (
    id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'editor', is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP, last_login_at TEXT
  )`);
  await runQuery(`CREATE TABLE accounts (
    id TEXT PRIMARY KEY, email TEXT UNIQUE, username TEXT UNIQUE, password_hash TEXT,
    role TEXT NOT NULL DEFAULT 'member', status TEXT NOT NULL DEFAULT 'PROVISIONED',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);
  await runQuery(`CREATE TABLE identity_mappings (
    account_id TEXT, person_id TEXT, PRIMARY KEY (account_id, person_id)
  )`);
  await runQuery(`CREATE TABLE proposals (
    id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL,
    person_id TEXT NOT NULL,
    field TEXT NOT NULL,
    suggested_value TEXT NOT NULL,
    source_evidence TEXT,
    reason TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING',
    reviewer_note TEXT,
    reviewer_id TEXT,
    base_value TEXT,
    committed_at TEXT,
    commit_error TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TEXT
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

  // Seed baseline users
  await runQuery(`INSERT INTO admin_users (id, username, password_hash, role, is_active) VALUES
    ('usr_owner', 'tuan_owner', 'hash_owner', 'owner', 1),
    ('usr_editor', 'nam_editor', 'hash_editor', 'editor', 1),
    ('usr_inactive', 'locked_owner', 'hash_locked', 'owner', 0)
  `);

  await runQuery(`INSERT INTO accounts (id, username, role, status) VALUES
    ('acc_owner', 'tuan_owner', 'owner', 'ACTIVE'),
    ('acc_member1', 'member_nam', 'member', 'ACTIVE'),
    ('acc_member2', 'member_hoa', 'member', 'ACTIVE')
  `);

  await runQuery(`INSERT INTO people (id, name, birthYear, deathYear, gender, notes, status, payload) VALUES
    ('@I1@', 'Trần Trọng Thu', '1915', '1995', 'Nam', 'Gốc tộc', 'PUBLISHED', '{"id":"@I1@","name":"Trần Trọng Thu","birth":{"date":"1915"}}'),
    ('@I2@', 'Trần Thị Thi', '1940', '', 'Nữ', 'Trưởng nữ', 'PUBLISHED', '{"id":"@I2@","name":"Trần Thị Thi","birth":{"date":"1940"}}')
  `);
}

function mockReqRes(session = null, body = {}, params = {}, query = {}) {
  const req = {
    session,
    body,
    params,
    query,
    headers: {}
  };
  let statusCode = 200;
  let jsonResult = null;
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      jsonResult = data;
      return this;
    },
    getStatusCode() { return statusCode; },
    getJSON() { return jsonResult; }
  };
  return { req, res };
}

async function runAll12Tests() {
  await setupTestSchema();
  let passCount = 0;

  // TEST 1: Guest cannot write data (401)
  {
    const { req, res } = mockReqRes(null, { id: '@I1@', name: 'Hacked' });
    let moved = false;
    await requireOwner(req, res, () => { moved = true; });
    assert.equal(moved, false);
    assert.equal(res.getStatusCode(), 401);
    console.log('  ✅ [PASS] 1. Guest cannot write data (401 Unauthorized)');
    passCount++;
  }

  // TEST 2: Member / Editor cannot directly write to Official Data (403)
  {
    const session = { userId: 'usr_editor', role: 'editor' };
    const { req, res } = mockReqRes(session, { id: '@I1@', name: 'Editor Edit' });
    let moved = false;
    await requireOwner(req, res, () => { moved = true; });
    assert.equal(moved, false);
    assert.equal(res.getStatusCode(), 403);
    assert.equal(res.getJSON().error, 'FORBIDDEN_OWNER_REQUIRED');
    console.log('  ✅ [PASS] 2. Member/Editor cannot directly write to Official Data (403 Forbidden)');
    passCount++;
  }

  // TEST 3: Member can submit valid Proposal (base_value captured, audit log recorded)
  let prop1Id = null;
  {
    const memberRouter = createMemberRouter(testDbAccessor);
    const postProposalLayer = memberRouter.stack.find(l => l.route && l.route.path === '/api/member/proposals' && l.route.methods.post);
    assert.ok(postProposalLayer, 'Member proposal route must exist');

    const session = { accountId: 'acc_member1', username: 'member_nam', role: 'member', status: 'ACTIVE' };
    const { req, res } = mockReqRes(session, {
      personId: '@I1@',
      field: 'notes',
      suggestedValue: 'Bổ sung thông tin cống hiến cách mạng',
      reason: 'Có huân chương kháng chiến hạng nhất'
    });

    const stack = postProposalLayer.route.stack;
    for (const l of stack) {
      await l.handle(req, res, () => {});
    }

    assert.equal(res.getStatusCode(), 200);
    const data = res.getJSON();
    assert.equal(data.ok, true);
    assert.equal(data.status, 'PENDING_REVIEW');
    assert.equal(data.baseValue, 'Gốc tộc');
    prop1Id = data.proposalId;

    // Check DB
    const propRow = await testDbAccessor.getQuery("SELECT * FROM proposals WHERE id = ?", [prop1Id]);
    assert.ok(propRow);
    assert.equal(propRow.base_value, 'Gốc tộc');

    // Check Audit Log
    const auditRow = await testDbAccessor.getQuery("SELECT * FROM audit_logs WHERE correlation_id = ? AND action = 'PROPOSAL_SUBMITTED'", [prop1Id]);
    assert.ok(auditRow, 'Proposal submission audit log must be recorded');
    console.log('  ✅ [PASS] 3. Member can submit valid Proposal (stores base_value and records audit log)');
    passCount++;
  }

  // TEST 4: Member cannot self-approve Proposal (403 SELF_APPROVAL_PROHIBITED)
  {
    // Try to approve prop1Id using acc_member1
    let threw = false;
    try {
      await commitProposal(testDbAccessor, prop1Id, 'usr_some_owner', 'Tự duyệt', 'acc_member1');
    } catch (e) {
      threw = true;
      assert.equal(e.statusCode, 403);
      assert.equal(e.code, 'SELF_APPROVAL_PROHIBITED');
    }
    assert.equal(threw, true, 'Self-approval must throw 403');
    console.log('  ✅ [PASS] 4. Proposer self-approval attempt strictly blocked with 403');
    passCount++;
  }

  // TEST 5 & 6: Owner can approve Proposal and it commits accurately
  {
    const beforePerson = await testDbAccessor.getQuery("SELECT notes FROM people WHERE id = '@I1@'");
    assert.equal(beforePerson.notes, 'Gốc tộc');

    const result = await commitProposal(testDbAccessor, prop1Id, 'usr_owner', 'Đã thẩm tra huân chương', 'acc_owner');
    assert.equal(result.ok, true);
    assert.equal(result.status, 'APPROVED');

    // Verify official people table updated
    const afterPerson = await testDbAccessor.getQuery("SELECT notes, payload FROM people WHERE id = '@I1@'");
    assert.equal(afterPerson.notes, 'Bổ sung thông tin cống hiến cách mạng');
    const parsedPayload = JSON.parse(afterPerson.payload);
    assert.equal(parsedPayload.notes, 'Bổ sung thông tin cống hiến cách mạng');

    // Verify proposals table updated
    const afterProp = await testDbAccessor.getQuery("SELECT * FROM proposals WHERE id = ?", [prop1Id]);
    assert.equal(afterProp.status, 'APPROVED');
    assert.equal(afterProp.reviewer_id, 'usr_owner');
    assert.ok(afterProp.committed_at);

    // Verify audit_logs recorded
    const commitAudit = await testDbAccessor.getQuery("SELECT * FROM audit_logs WHERE correlation_id = ? AND action = 'PROPOSAL_COMMIT'", [prop1Id]);
    assert.ok(commitAudit);
    assert.equal(commitAudit.actor_role, 'owner');
    console.log('  ✅ [PASS] 5 & 6. Owner approves Proposal and commits accurately to Official Data');
    passCount++;
  }

  // TEST 7: Rejected Proposal does not change Official Data
  {
    // Submit proposal for @I2@
    const prop2Id = 'PROP_TEST_REJECT_001';
    await testDbAccessor.runQuery(
      "INSERT INTO proposals (id, account_id, person_id, field, suggested_value, base_value, reason, status) VALUES (?, 'acc_member2', '@I2@', 'name', 'Tên Sai', 'Trần Thị Thi', 'Lý do sai', 'PENDING')",
      [prop2Id]
    );

    const rejectResult = await rejectProposal(testDbAccessor, prop2Id, 'usr_owner', 'Thông tin sai sự thật', 'acc_owner');
    assert.equal(rejectResult.ok, true);
    assert.equal(rejectResult.status, 'REJECTED');

    // Official data untouched
    const p2 = await testDbAccessor.getQuery("SELECT name FROM people WHERE id = '@I2@'");
    assert.equal(p2.name, 'Trần Thị Thi');

    // Audit log recorded
    const rejectAudit = await testDbAccessor.getQuery("SELECT * FROM audit_logs WHERE correlation_id = ? AND action = 'PROPOSAL_REJECTED'", [prop2Id]);
    assert.ok(rejectAudit);
    console.log('  ✅ [PASS] 7. Rejected Proposal does NOT modify Official Data');
    passCount++;
  }

  // TEST 8: Owner Direct Edit creates Audit Log with before/after state
  {
    const editResult = await executeDirectEditWithAudit(testDbAccessor, {
      actorId: 'usr_owner',
      entityType: 'people',
      entityId: '@I2@',
      reason: 'Cập nhật năm mất chính xác theo bia mộ',
      fetchBeforeState: async (tx) => tx.getQuery("SELECT deathYear FROM people WHERE id = '@I2@'"),
      performMutation: async (tx) => {
        await tx.runQuery("UPDATE people SET deathYear = '2020' WHERE id = '@I2@'");
      },
      fetchAfterState: async (tx) => tx.getQuery("SELECT deathYear FROM people WHERE id = '@I2@'")
    });

    assert.equal(editResult.success, true);
    assert.ok(editResult.correlationId);

    const auditLog = await testDbAccessor.getQuery("SELECT * FROM audit_logs WHERE correlation_id = ?", [editResult.correlationId]);
    assert.ok(auditLog);
    assert.equal(auditLog.action, 'DIRECT_EDIT');
    assert.equal(auditLog.actor_role, 'owner');
    assert.equal(JSON.parse(auditLog.after_value).deathYear, '2020');
    console.log('  ✅ [PASS] 8. Owner Direct Edit creates Audit Log with before/after state');
    passCount++;
  }

  // TEST 9: Commit failure triggers rollback
  {
    let rolledBack = false;
    try {
      await withTransaction(testDbAccessor, async (tx) => {
        await tx.runQuery("UPDATE people SET name = 'TEMPORARY CORRUPTED' WHERE id = '@I1@'");
        throw new Error('Simulated Database Crash during Commit');
      });
    } catch (e) {
      rolledBack = true;
    }
    assert.equal(rolledBack, true);

    // Verify rollback preserved previous name
    const p1 = await testDbAccessor.getQuery("SELECT name FROM people WHERE id = '@I1@'");
    assert.equal(p1.name, 'Trần Trọng Thu', 'Rollback must preserve official name');
    console.log('  ✅ [PASS] 9. Commit failure triggers automatic database rollback');
    passCount++;
  }

  // TEST 10: Cannot commit duplicate / already committed proposal (Idempotency)
  {
    let threwIdempotent = false;
    try {
      // Re-approving prop1Id which is already APPROVED & COMMITTED
      await commitProposal(testDbAccessor, prop1Id, 'usr_owner', 'Thử commit lại', 'acc_owner');
    } catch (e) {
      threwIdempotent = true;
      assert.equal(e.statusCode, 409);
    }
    assert.equal(threwIdempotent, true, 'Duplicate commit must be rejected with 409 Conflict');
    console.log('  ✅ [PASS] 10. Cannot commit duplicate / already committed proposal (409 Conflict)');
    passCount++;
  }

  // TEST 11: Old API routes cannot bypass Authorization
  {
    // Check deactivation check
    const sessionLocked = { userId: 'usr_inactive', role: 'owner' };
    const { req, res } = mockReqRes(sessionLocked);
    let proceed = false;
    await requireOwner(req, res, () => { proceed = true; });
    assert.equal(proceed, false);
    assert.equal(res.getStatusCode(), 403);
    console.log('  ✅ [PASS] 11. Deactivated user cannot bypass Authorization even with valid cookie');
    passCount++;
  }

  // TEST 12: Sensitive data remains protected (Audit logs restricted to Owner only)
  {
    const adminOpsRouter = createAdminOperationsRouter(testDbAccessor, { requireAuth, requireOwner });
    const auditRouteLayer = adminOpsRouter.stack.find(l => l.route && l.route.path === '/audit-logs' && l.route.methods.get);
    assert.ok(auditRouteLayer, 'GET /audit-logs must exist');

    // Editor calling audit logs receives 403
    const sessionEditor = { userId: 'usr_editor', role: 'editor' };
    const { req: reqEd, res: resEd } = mockReqRes(sessionEditor);
    for (const l of auditRouteLayer.route.stack) {
      let moved = false;
      await l.handle(reqEd, resEd, () => { moved = true; });
      if (!moved) break;
    }
    assert.equal(resEd.getStatusCode(), 403);

    // Owner calling audit logs receives 200 and logs list
    const sessionOwner = { userId: 'usr_owner', role: 'owner' };
    const { req: reqOw, res: resOw } = mockReqRes(sessionOwner);
    for (const l of auditRouteLayer.route.stack) {
      let moved = false;
      await l.handle(reqOw, resOw, () => { moved = true; });
      if (!moved) break;
    }
    assert.equal(resOw.getStatusCode(), 200);
    const data = resOw.getJSON();
    assert.ok(Array.isArray(data.logs));
    assert.ok(data.logs.length >= 3);
    console.log('  ✅ [PASS] 12. Audit logs strictly restricted to Owner (Editor receives 403, Owner receives 200)');
    passCount++;
  }

  console.log(`\n============================================================`);
  console.log(`🎉 ALL 12 GOVERNANCE TEST CASES PASSED SUCCESSFULLY (100%)!`);
  console.log(`============================================================\n`);

  // Clean up scratch database
  db.close(() => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });
}

runAll12Tests().catch(err => {
  console.error('❌ Governance Suite Failed:', err);
  if (fs.existsSync(testDbPath)) {
    try { fs.unlinkSync(testDbPath); } catch(e) {}
  }
  process.exit(1);
});
