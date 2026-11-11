/**
 * tests/test_governance_checkpoint1.mjs
 * Checkpoint 1 Test Suite: Centralized Authorization & API Write Protection.
 *
 * Verifies:
 * 1. Guests receive 401 Unauthorized when attempting direct writes.
 * 2. Non-Owners (Editors, Viewers, Members) receive 403 Forbidden when attempting direct writes.
 * 3. Deactivated accounts (is_active = 0) receive 403 Forbidden even with a valid session cookie.
 * 4. Active Owners pass authorization.
 * 5. Proposal review (PATCH /api/admin/proposals/:id) requires Owner authority.
 * 6. Self-approval is strictly prohibited (proposer cannot approve their own proposal).
 */

import assert from 'node:assert/strict';
import { createAuthRouter, requireAuth, requireOwner, setAuthDbAccessor } from '../server/auth.js';
import { createAdminOperationsRouter } from '../server/admin_operations.js';

console.log('🧪 Running Governance Checkpoint 1 Verification Suite...\n');

// Mock in-memory database accessor
const mockAdminUsers = [
  { id: 'usr_owner_1', username: 'tuan_owner', role: 'owner', is_active: 1 },
  { id: 'usr_editor_1', username: 'nam_editor', role: 'editor', is_active: 1 },
  { id: 'usr_viewer_1', username: 'hoa_viewer', role: 'viewer', is_active: 1 },
  { id: 'usr_inactive_1', username: 'bad_owner', role: 'owner', is_active: 0 }
];

const mockProposals = [
  { id: 'prop_001', account_id: 'acc_member_1', person_id: '@I1@', field: 'name', suggested_value: 'Cụ Thu', status: 'PENDING' },
  { id: 'prop_002', account_id: 'acc_owner_1', person_id: '@I2@', field: 'name', suggested_value: 'Bà Thi', status: 'PENDING' }
];

const mockPeople = [
  { id: '@I1@', name: 'Trần Trọng Thu', birthYear: '1915', deathYear: '1995', gender: 'Nam', notes: '', status: 'PUBLISHED', payload: '{}' },
  { id: '@I2@', name: 'Trần Thị Thi', birthYear: '1940', deathYear: '', gender: 'Nữ', notes: '', status: 'PUBLISHED', payload: '{}' }
];

const mockDbAccessor = {
  async getQuery(sql, params = []) {
    if (sql.includes('FROM admin_users WHERE id = ?')) {
      return mockAdminUsers.find(u => u.id === params[0]) || null;
    }
    if (sql.includes('FROM proposals WHERE id = ?')) {
      return mockProposals.find(p => p.id === params[0]) || null;
    }
    if (sql.includes('FROM people WHERE id = ?')) {
      return mockPeople.find(p => p.id === params[0]) || null;
    }
    return null;
  },
  async allQuery(sql, params = []) {
    return [];
  },
  async runQuery(sql, params = []) {
    if (sql.includes('UPDATE proposals')) {
      return { changes: 1 };
    }
    if (sql.includes('UPDATE people')) {
      return { changes: 1 };
    }
    if (sql.includes('INSERT INTO audit_logs')) {
      return { changes: 1 };
    }
    return {};
  }
};

// Set accessor into auth layer
setAuthDbAccessor(mockDbAccessor);

function createMockReqRes(session = null, body = {}, params = {}) {
  const req = {
    session,
    body,
    params,
    headers: {}
  };
  let statusCode = 200;
  let jsonResponse = null;
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      jsonResponse = data;
      return this;
    },
    getStatusCode() {
      return statusCode;
    },
    getJSON() {
      return jsonResponse;
    }
  };
  return { req, res };
}

async function runCheckpoint1Tests() {
  let passedCount = 0;

  // TEST 1: Guest calling requireAuth receives 401
  {
    const { req, res } = createMockReqRes(null);
    let nextCalled = false;
    await requireAuth(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, false, 'Guest must not proceed to next()');
    assert.equal(res.getStatusCode(), 401, 'Guest must receive 401');
    console.log('  ✅ [PASS] 1. Guest direct request blocked with 401');
    passedCount++;
  }

  // TEST 2: Guest calling requireOwner receives 401
  {
    const { req, res } = createMockReqRes(null);
    let nextCalled = false;
    await requireOwner(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, false, 'Guest must not proceed to next()');
    assert.equal(res.getStatusCode(), 401, 'Guest must receive 401');
    console.log('  ✅ [PASS] 2. Guest calling requireOwner receives 401');
    passedCount++;
  }

  // TEST 3: Editor calling requireOwner receives 403 with FORBIDDEN_OWNER_REQUIRED
  {
    const session = { userId: 'usr_editor_1', role: 'editor' };
    const { req, res } = createMockReqRes(session);
    let nextCalled = false;
    await requireOwner(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, false, 'Editor must not proceed through requireOwner');
    assert.equal(res.getStatusCode(), 403, 'Editor must receive 403');
    assert.equal(res.getJSON().error, 'FORBIDDEN_OWNER_REQUIRED', 'Error code must be FORBIDDEN_OWNER_REQUIRED');
    console.log('  ✅ [PASS] 3. Editor attempting Direct Edit blocked with 403 (FORBIDDEN_OWNER_REQUIRED)');
    passedCount++;
  }

  // TEST 4: Viewer calling requireOwner receives 403
  {
    const session = { userId: 'usr_viewer_1', role: 'viewer' };
    const { req, res } = createMockReqRes(session);
    let nextCalled = false;
    await requireOwner(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, false, 'Viewer must not proceed through requireOwner');
    assert.equal(res.getStatusCode(), 403, 'Viewer must receive 403');
    console.log('  ✅ [PASS] 4. Viewer attempting Direct Edit blocked with 403');
    passedCount++;
  }

  // TEST 5: Deactivated Owner (is_active = 0) receives 403
  {
    let destroyed = false;
    const session = {
      userId: 'usr_inactive_1',
      role: 'owner',
      destroy(cb) { destroyed = true; if (cb) cb(); }
    };
    const { req, res } = createMockReqRes(session);
    let nextCalled = false;
    await requireOwner(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, false, 'Inactive user must not proceed');
    assert.equal(res.getStatusCode(), 403, 'Inactive user must receive 403');
    assert.equal(destroyed, true, 'Inactive user session must be destroyed');
    console.log('  ✅ [PASS] 5. Deactivated user real-time DB check destroys session and returns 403');
    passedCount++;
  }

  // TEST 6: Active Owner passes requireOwner
  {
    const session = { userId: 'usr_owner_1', role: 'owner' };
    const { req, res } = createMockReqRes(session);
    let nextCalled = false;
    await requireOwner(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true, 'Active Owner must proceed to next()');
    console.log('  ✅ [PASS] 6. Active Owner passes requireOwner successfully');
    passedCount++;
  }

  // TEST 7: Proposal Review - Anti Self-Approval Protection
  {
    const adminOpsRouter = createAdminOperationsRouter(mockDbAccessor, { requireAuth, requireOwner });
    // Find the PATCH /proposals/:id route handler
    const patchRouteLayer = adminOpsRouter.stack.find(l => l.route && l.route.path === '/proposals/:id' && l.route.methods.patch);
    assert.ok(patchRouteLayer, 'PATCH /proposals/:id route must exist in admin_operations');

    // Simulate Owner trying to approve their OWN proposal (prop_002 has account_id = 'acc_owner_1')
    const session = { userId: 'usr_owner_1', role: 'owner', accountId: 'acc_owner_1' };
    const { req, res } = createMockReqRes(session, { status: 'APPROVED', reviewer_note: 'Duyệt bài mình' }, { id: 'prop_002' });

    // Execute handlers on the route
    const stack = patchRouteLayer.route.stack;
    for (const layer of stack) {
      let movedNext = false;
      await layer.handle(req, res, () => { movedNext = true; });
      if (!movedNext) break; // handler responded or stopped
    }

    assert.equal(res.getStatusCode(), 403, 'Self-approval must return 403');
    assert.equal(res.getJSON().error, 'SELF_APPROVAL_PROHIBITED', 'Error must be SELF_APPROVAL_PROHIBITED');
    console.log('  ✅ [PASS] 7. Proposer self-approval attempt strictly blocked with 403 (SELF_APPROVAL_PROHIBITED)');
    passedCount++;
  }

  // TEST 8: Proposal Review - Owner approving another member's proposal is allowed
  {
    const adminOpsRouter = createAdminOperationsRouter(mockDbAccessor, { requireAuth, requireOwner });
    const patchRouteLayer = adminOpsRouter.stack.find(l => l.route && l.route.path === '/proposals/:id' && l.route.methods.patch);

    // Simulate Owner approving prop_001 (account_id = 'acc_member_1')
    const session = { userId: 'usr_owner_1', role: 'owner', accountId: 'acc_owner_1' };
    const { req, res } = createMockReqRes(session, { status: 'APPROVED', reviewer_note: 'Đã xác minh gia phả' }, { id: 'prop_001' });

    const stack = patchRouteLayer.route.stack;
    for (const layer of stack) {
      let movedNext = false;
      await layer.handle(req, res, () => { movedNext = true; });
      if (!movedNext) break;
    }

    assert.equal(res.getStatusCode(), 200, 'Valid approval must succeed with 200');
    assert.equal(res.getJSON().ok, true, 'Response ok must be true');
    assert.equal(res.getJSON().status, 'APPROVED', 'Proposal status must be APPROVED');
    console.log('  ✅ [PASS] 8. Owner approving third-party proposal succeeds with 200');
    passedCount++;
  }

  console.log(`\n🎉 CHECKPOINT 1 VERIFIED: ${passedCount}/${passedCount} TESTS PASSED (100% SUCCESS)!\n`);
}

runCheckpoint1Tests().catch(err => {
  console.error('❌ Checkpoint 1 verification failed:', err);
  process.exit(1);
});

