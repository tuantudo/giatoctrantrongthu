/**
 * scripts/test_proposal_and_containment.mjs
 * Comprehensive Verification of Proposal Backend API, Authorization, Data Immutability, and Clara Containment.
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import http from 'node:http';
import crypto from 'node:crypto';
import { Readable } from 'node:stream';
import { createRequire } from 'node:module';
import { MockDataAdapter } from '../src/js/platform/data/mock-adapter.js';

const REPO_ROOT = process.cwd();
const serverRequire = createRequire(path.join(REPO_ROOT, 'server/index.js'));
const express = serverRequire('express');
const sqlite3 = serverRequire('sqlite3').verbose();

console.log('================================================================');
console.log('COMPREHENSIVE BACKEND, PROPOSAL & CLARA CONTAINMENT VERIFICATION');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;
const testRecords = [];

async function recordTest(id, name, fn) {
  totalTests++;
  try {
    const detail = await fn();
    console.log(`  ✅ [PASS] ${id}: ${name}`);
    passedTests++;
    testRecords.push({ id, name, status: 'VERIFIED', detail });
  } catch (err) {
    console.error(`  ❌ [FAIL] ${id}: ${name} — ${err.message}`);
    testRecords.push({ id, name, status: 'FAILED', detail: err.message });
  }
}

// -------------------------------------------------------------------------
// SECTION 1: MockDataAdapter Proposal Lifecycle
// -------------------------------------------------------------------------
console.log('[SECTION 1] Testing MockDataAdapter Proposal Lifecycle...');

await recordTest('PROP-MOCK-01', 'MockDataAdapter validation: rejects empty/missing fields with 400', async () => {
  const adapter = new MockDataAdapter();

  // Test null / undefined
  await assert.rejects(async () => await adapter.submitProposal(null), { status: 400 });
  await assert.rejects(async () => await adapter.submitProposal({}), { status: 400 });

  // Missing personId
  await assert.rejects(async () => await adapter.submitProposal({ field: 'name', suggestedValue: 'X' }), { status: 400 });

  // Missing field
  await assert.rejects(async () => await adapter.submitProposal({ personId: '@I1@', suggestedValue: 'X' }), { status: 400 });

  // Missing suggestedValue (undefined)
  await assert.rejects(async () => await adapter.submitProposal({ personId: '@I1@', field: 'name' }), { status: 400 });

  return 'All malformed/incomplete payloads correctly rejected with HTTP 400 Error';
});

await recordTest('PROP-MOCK-02', 'MockDataAdapter proposal creation: PROP_ ID format, PENDING_REVIEW status', async () => {
  const adapter = new MockDataAdapter();
  const payload = {
    personId: '@I1@',
    field: 'birth_year',
    suggestedValue: '1875',
    sourceEvidence: 'Family tomb inscription',
    reason: 'Correction based on field survey'
  };

  const res = await adapter.submitProposal(payload);

  assert.strictEqual(res.ok, true, 'res.ok must be true');
  assert.ok(res.proposal, 'res.proposal object must exist');
  assert.match(res.proposal.id, /^PROP_\d+$/, 'ID must match PROP_<timestamp>');
  assert.strictEqual(res.proposal.status, 'PENDING_REVIEW', 'Status must be PENDING_REVIEW');
  assert.strictEqual(res.proposal.personId, '@I1@');
  assert.strictEqual(res.proposal.field, 'birth_year');
  assert.strictEqual(res.proposal.suggestedValue, '1875');
  assert.ok(res.proposal.timestamp, 'timestamp must be present');
  assert.ok(typeof res.message === 'string' && res.message.length > 0, 'User feedback message present');

  return { id: res.proposal.id, status: res.proposal.status, contract: 'ok, proposal, message' };
});

await recordTest('PROP-MOCK-03', 'MockDataAdapter storage: in-memory queue & simulated localStorage', async () => {
  // Simulate window.localStorage
  const storageMap = new Map();
  globalThis.window = {
    localStorage: {
      getItem: (k) => storageMap.get(k) || null,
      setItem: (k, v) => storageMap.set(k, String(v))
    }
  };

  const adapter = new MockDataAdapter();
  await adapter.submitProposal({ personId: '@I1@', field: 'name', suggestedValue: 'Giuse Thu 1' });
  await adapter.submitProposal({ personId: '@I2@', field: 'name', suggestedValue: 'Bà Cử 2' });

  // Verify internal memory array
  assert.strictEqual(adapter._proposals.length, 2, 'Internal _proposals array has 2 records');

  // Verify simulated localStorage
  const rawStored = globalThis.window.localStorage.getItem('giatoc_mock_proposals');
  assert.ok(rawStored, 'localStorage key giatoc_mock_proposals exists');
  const parsed = JSON.parse(rawStored);
  assert.strictEqual(parsed.length, 2);
  assert.strictEqual(parsed[0].suggestedValue, 'Giuse Thu 1');
  assert.strictEqual(parsed[1].suggestedValue, 'Bà Cử 2');

  delete globalThis.window;
  return 'Proposals stored in this._proposals and localStorage[giatoc_mock_proposals]';
});

await recordTest('PROP-MOCK-04', 'MockDataAdapter persona behavior check (ANONYMOUS vs ACTIVE)', async () => {
  const adapter = new MockDataAdapter();
  adapter.setPersonaKey('ANONYMOUS');
  
  // Note: MockDataAdapter submitProposal currently does not throw on ANONYMOUS persona
  const res = await adapter.submitProposal({ personId: '@I1@', field: 'name', suggestedValue: 'Test Anonymous' });
  assert.strictEqual(res.ok, true);
  return 'MockDataAdapter does not gate submitProposal by persona; accepts all submissions into mock queue';
});

// -------------------------------------------------------------------------
// SECTION 2: Express Server Proposals API & Immutability Check
// -------------------------------------------------------------------------
console.log('\n[SECTION 2] Testing Express Proposals API (server/member.js) & Immutability...');

process.env.DB_CLIENT = 'sqlite3';
process.env.DB_PATH = path.join(REPO_ROOT, 'server/family_archive.db');
process.env.SESSION_SECRET = 'security-test-secret';
process.env.NODE_ENV = 'production'; // Enforce production for strict auth tests
process.env.DEV_AUTO_LOGIN = 'false'; // Disable auto-login bypass

const { app: fullServerApp, initDB } = await import(path.join(REPO_ROOT, 'server/index.js'));
await initDB();

const { createMemberRouter } = await import(path.join(REPO_ROOT, 'server/member.js'));

// Initialize direct SQLite helpers for assertions
const db = new sqlite3.Database(process.env.DB_PATH);
const dbGet = (q, p = []) => new Promise((resolve, reject) => db.get(q, p, (err, row) => err ? reject(err) : resolve(row)));
const dbAll = (q, p = []) => new Promise((resolve, reject) => db.all(q, p, (err, rows) => err ? reject(err) : resolve(rows)));
const dbRun = (q, p = []) => new Promise((resolve, reject) => db.run(q, p, (err) => err ? reject(err) : resolve()));

const dbAccessor = {
  getQuery: dbGet,
  allQuery: dbAll,
  runQuery: dbRun
};

// Create test express app with controllable session middleware
function createTestApp() {
  const testApp = express();
  testApp.use(express.json());
  testApp.use((req, res, next) => {
    // If request has simulated session header, parse it
    if (req.headers['x-test-session']) {
      try {
        req.session = JSON.parse(req.headers['x-test-session']);
      } catch (e) {
        req.session = {};
      }
    } else {
      req.session = {};
    }
    next();
  });
  testApp.use('/', createMemberRouter(dbAccessor));
  return testApp;
}

const testRouterApp = createTestApp();

function executeRequest(targetApp, method, urlPath, headers = {}, body = null) {
  return new Promise((resolve) => {
    const socket = new Readable({ read() {} });
    const req = new http.IncomingMessage(socket);
    req.method = method;
    req.url = urlPath;
    req.path = urlPath.split('?')[0];
    req.headers = { host: 'localhost', ...headers };

    if (body) {
      const payload = typeof body === 'string' ? body : JSON.stringify(body);
      req.headers['content-length'] = Buffer.byteLength(payload);
      req.push(payload);
    }
    req.push(null);

    const res = new http.ServerResponse(req);
    let chunks = [];

    res.write = function (chunk, encoding) {
      if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding));
      return true;
    };

    res.end = function (chunk, encoding) {
      if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding));
      const bodyStr = Buffer.concat(chunks).toString('utf8');
      resolve({
        status: res.statusCode,
        headers: res.getHeaders(),
        body: bodyStr,
        json: () => {
          try {
            return JSON.parse(bodyStr);
          } catch {
            return null;
          }
        }
      });
    };

    targetApp(req, res);
  });
}

// Ensure test account exists in SQLite for member auth testing
const TEST_MEMBER_ACCOUNT_ID = 'test-member-acc-001';
const TEST_UNAUTH_MEMBER_ACCOUNT_ID = 'test-unauth-acc-002';

await dbRun(`INSERT OR REPLACE INTO accounts (id, username, role, status) VALUES 
  (?, 'testmember', 'member', 'ACTIVE'),
  (?, 'unauthmember', 'member', 'ACTIVE')
`, [TEST_MEMBER_ACCOUNT_ID, TEST_UNAUTH_MEMBER_ACCOUNT_ID]);

await recordTest('PROP-EXP-01', 'Express POST /api/member/proposals: Anonymous access rejected with 401', async () => {
  // Test against router with no session
  const res = await executeRequest(testRouterApp, 'POST', '/api/member/proposals', {
    'content-type': 'application/json'
  }, {
    personId: '@I1@',
    field: 'name',
    suggestedValue: 'Hacker'
  });

  assert.strictEqual(res.status, 401, `Expected 401, got ${res.status}`);
  const data = res.json();
  assert.strictEqual(data.ok, false);
  assert.strictEqual(data.error, 'Chưa đăng nhập');
  return 'Anonymous access correctly denied with HTTP 401 and Vietnamese message';
});

await recordTest('PROP-EXP-02', 'Express POST /api/member/proposals: Payload validation rejects empty/malformed bodies with 400', async () => {
  const sessionHeader = JSON.stringify({ accountId: TEST_MEMBER_ACCOUNT_ID, status: 'ACTIVE' });

  // Empty body
  let res = await executeRequest(testRouterApp, 'POST', '/api/member/proposals', {
    'content-type': 'application/json',
    'x-test-session': sessionHeader
  }, {});
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.json().ok, false);

  // Missing personId
  res = await executeRequest(testRouterApp, 'POST', '/api/member/proposals', {
    'content-type': 'application/json',
    'x-test-session': sessionHeader
  }, { field: 'name', suggestedValue: 'Val' });
  assert.strictEqual(res.status, 400);

  // Missing field
  res = await executeRequest(testRouterApp, 'POST', '/api/member/proposals', {
    'content-type': 'application/json',
    'x-test-session': sessionHeader
  }, { personId: '@I1@', suggestedValue: 'Val' });
  assert.strictEqual(res.status, 400);

  // Missing suggestedValue
  res = await executeRequest(testRouterApp, 'POST', '/api/member/proposals', {
    'content-type': 'application/json',
    'x-test-session': sessionHeader
  }, { personId: '@I1@', field: 'name' });
  assert.strictEqual(res.status, 400);

  return 'Missing personId, field, or suggestedValue strictly returns HTTP 400 Bad Request';
});

await recordTest('PROP-EXP-03', 'Express POST /api/member/proposals: Valid submission contract & PROP_ ID format', async () => {
  const sessionHeader = JSON.stringify({ accountId: TEST_MEMBER_ACCOUNT_ID, status: 'ACTIVE' });
  const payload = {
    personId: '@I1@',
    field: 'notes',
    suggestedValue: 'Bổ sung thông tin sắc phong',
    sourceEvidence: 'Văn bia nhà thờ họ',
    reason: 'Phát hiện tư liệu cổ năm 2026'
  };

  const res = await executeRequest(testRouterApp, 'POST', '/api/member/proposals', {
    'content-type': 'application/json',
    'x-test-session': sessionHeader
  }, payload);

  assert.strictEqual(res.status, 200);
  const data = res.json();
  assert.strictEqual(data.ok, true);
  assert.match(data.proposalId, /^PROP_\d+$/);
  assert.strictEqual(data.message, 'Đề xuất đã được tiếp nhận.');

  return { proposalId: data.proposalId, message: data.message };
});

await recordTest('PROP-EXP-04', 'Express POST /api/member/proposals: Duplicate submission handling', async () => {
  const sessionHeader = JSON.stringify({ accountId: TEST_MEMBER_ACCOUNT_ID, status: 'ACTIVE' });
  const payload = {
    personId: '@I1@',
    field: 'name',
    suggestedValue: 'Trùng lặp'
  };

  const res1 = await executeRequest(testRouterApp, 'POST', '/api/member/proposals', {
    'content-type': 'application/json',
    'x-test-session': sessionHeader
  }, payload);
  await new Promise(r => setTimeout(r, 10)); // Ensure distinct timestamp
  const res2 = await executeRequest(testRouterApp, 'POST', '/api/member/proposals', {
    'content-type': 'application/json',
    'x-test-session': sessionHeader
  }, payload);

  assert.strictEqual(res1.status, 200);
  assert.strictEqual(res2.status, 200);
  const id1 = res1.json().proposalId;
  const id2 = res2.json().proposalId;
  assert.notStrictEqual(id1, id2, 'Proposals receive independent unique timestamp IDs');

  return { id1, id2, distinct: true };
});

await recordTest('PROP-IMMUTABILITY', 'Database Immutability: Submitting proposals NEVER mutates SQLite people or families tables', async () => {
  // 1. Snapshot database state before proposal
  const initialPeople = await dbAll('SELECT id, name, birthYear, deathYear, payload FROM people ORDER BY id');
  const initialFamilies = await dbAll('SELECT id, husband_id, wife_id, payload FROM families ORDER BY id');
  const initialCount = initialPeople.length;
  assert.ok(initialCount > 0, 'People table must have records');

  const initialPeopleHash = crypto.createHash('sha256').update(JSON.stringify(initialPeople)).digest('hex');
  const initialFamiliesHash = crypto.createHash('sha256').update(JSON.stringify(initialFamilies)).digest('hex');

  const targetPersonBefore = await dbGet('SELECT * FROM people WHERE id = ?', ['@I1@']);
  const originalName = targetPersonBefore.name;

  // 2. Submit aggressive proposals attempting to change name and birth year
  const sessionHeader = JSON.stringify({ accountId: TEST_MEMBER_ACCOUNT_ID, status: 'ACTIVE' });
  await executeRequest(testRouterApp, 'POST', '/api/member/proposals', {
    'content-type': 'application/json',
    'x-test-session': sessionHeader
  }, {
    personId: '@I1@',
    field: 'name',
    suggestedValue: 'VANDALIZED_NAME_ATTEMPT'
  });

  await executeRequest(testRouterApp, 'POST', '/api/member/proposals', {
    'content-type': 'application/json',
    'x-test-session': sessionHeader
  }, {
    personId: '@I1@',
    field: 'birthYear',
    suggestedValue: '9999'
  });

  // 3. Snapshot database state after proposal
  const afterPeople = await dbAll('SELECT id, name, birthYear, deathYear, payload FROM people ORDER BY id');
  const afterFamilies = await dbAll('SELECT id, husband_id, wife_id, payload FROM families ORDER BY id');
  const targetPersonAfter = await dbGet('SELECT * FROM people WHERE id = ?', ['@I1@']);

  const afterPeopleHash = crypto.createHash('sha256').update(JSON.stringify(afterPeople)).digest('hex');
  const afterFamiliesHash = crypto.createHash('sha256').update(JSON.stringify(afterFamilies)).digest('hex');

  // Assertions
  assert.strictEqual(afterPeople.length, initialCount, 'Total number of people records must be unchanged');
  assert.strictEqual(targetPersonAfter.name, originalName, 'Target person name must be 100% untouched');
  assert.strictEqual(targetPersonAfter.birthYear, targetPersonBefore.birthYear, 'Target person birthYear untouched');
  assert.strictEqual(initialPeopleHash, afterPeopleHash, 'Canonical people table hash is bit-for-bit identical');
  assert.strictEqual(initialFamiliesHash, afterFamiliesHash, 'Canonical families table hash is bit-for-bit identical');

  return {
    verified: true,
    initialCount,
    afterCount: afterPeople.length,
    canonicalHashMatch: initialPeopleHash === afterPeopleHash,
    personUntouched: targetPersonAfter.name === originalName
  };
});

await recordTest('PROP-STORAGE-PERSIST', 'Storage & Persistence Audit: Proposals persistence & Review Workflow', async () => {
  // Check if proposals table exists in SQLite
  const tableCheck = await dbGet("SELECT name FROM sqlite_master WHERE type='table' AND name='proposals'");
  const hasProposalsTable = !!tableCheck;

  // Check if server/member.js has any SELECT / INSERT into proposals
  const memberJs = fs.readFileSync(path.join(REPO_ROOT, 'server/member.js'), 'utf8');
  const hasDbInsertInRoute = memberJs.includes('INSERT INTO proposals');

  return {
    hasProposalsTableInSqlite: hasProposalsTable,
    hasServerPersistence: hasDbInsertInRoute,
    reviewWorkflowStatus: 'BACKLOG_P2 (bảng proposals đang chờ triển khai theo SPEC TP-003 / ARCHITECTURE §6)',
    persistenceMechanism: 'Client localStorage (giatoc_mock_proposals) in browser; Express route acknowledges receipt with PROP_ id but drops in-memory without persistent DB insert'
  };
});

// -------------------------------------------------------------------------
// SECTION 3: Clara Containment & Persona Boundaries
// -------------------------------------------------------------------------
console.log('\n[SECTION 3] Testing Clara P0 Privacy Containment & Persona Authorization...');

await recordTest('CLARA-AUTH-01', 'Anonymous access to /api/member/clara.json redirected to /login (302)', async () => {
  const res = await executeRequest(testRouterApp, 'GET', '/api/member/clara.json');
  assert.strictEqual(res.status, 302);
  assert.strictEqual(res.headers.location, '/login');
  return 'Anonymous request redirected to /login with HTTP 302';
});

await recordTest('CLARA-AUTH-02', 'Unauthorized member account denied access to Clara letters with 403', async () => {
  const unauthorizedSession = {
    accountId: TEST_UNAUTH_MEMBER_ACCOUNT_ID,
    username: 'unauthmember',
    role: 'member',
    personId: '@I99@',
    status: 'ACTIVE'
  };

  const res = await executeRequest(testRouterApp, 'GET', '/api/member/clara.json', {
    'x-test-session': JSON.stringify(unauthorizedSession)
  });

  assert.strictEqual(res.status, 403, `Expected 403 Forbidden, got ${res.status}`);
  const json = res.json();
  assert.strictEqual(json.error, 'FORBIDDEN_RESTRICTED_BRANCH');
  assert.ok(json.message.includes('Thư gửi Clara là di sản riêng tư'));
  return 'Unauthorized member correctly blocked with HTTP 403 FORBIDDEN_RESTRICTED_BRANCH';
});

await recordTest('CLARA-AUTH-03', 'Unauthorized member denied access to private Clara image assets with 403', async () => {
  const unauthorizedSession = {
    accountId: TEST_UNAUTH_MEMBER_ACCOUNT_ID,
    username: 'unauthmember',
    role: 'member',
    personId: '@I99@',
    status: 'ACTIVE'
  };

  const res = await executeRequest(testRouterApp, 'GET', '/assets/private/images/clara/001.png', {
    'x-test-session': JSON.stringify(unauthorizedSession)
  });

  assert.strictEqual(res.status, 403, `Expected 403 Forbidden, got ${res.status}`);
  return 'Guarded static route /assets/private/images/clara/:filename returns 403 for unauthorized members';
});

await recordTest('CLARA-AUTH-04', 'Authorized member (tuantq / admin) granted access to Clara letters with 200', async () => {
  const authorizedSession = {
    accountId: TEST_MEMBER_ACCOUNT_ID,
    username: 'tuantq',
    role: 'admin',
    status: 'ACTIVE'
  };

  const res = await executeRequest(testRouterApp, 'GET', '/api/member/clara.json', {
    'x-test-session': JSON.stringify(authorizedSession)
  });

  assert.strictEqual(res.status, 200, `Expected 200 OK, got ${res.status}`);
  const data = res.json();
  assert.ok(data.stories && data.stories.length === 8, 'Must return 8 Clara letters');
  return `Authorized tuantq session retrieved ${data.stories.length} letters successfully`;
});

await recordTest('CLARA-PUBLIC-01', 'Public surfaces have zero Clara leakage (mach.json has 0 Clara, private routes 404)', async () => {
  // Check mach.json via fullServerApp
  const resMach = await executeRequest(fullServerApp, 'GET', '/api/mach.json');
  assert.strictEqual(resMach.status, 200);
  const machData = resMach.json();
  assert.strictEqual(machData.stories.length, 12);
  assert.ok(!resMach.body.toLowerCase().includes('clara'));

  // Direct access to private paths via fullServerApp
  const blockedPaths = [
    '/content/private/clara/Thư gửi Clara - 001.md',
    '/assets/private/images/clara/001.png',
    '/data/private/clara.json',
    '/thu-gui-clara'
  ];

  for (const p of blockedPaths) {
    const res = await executeRequest(fullServerApp, 'GET', p);
    assert.strictEqual(res.status, 404, `Path ${p} must return 404`);
  }

  return 'mach.json verified 0 Clara stories; all direct private paths blocked with 404';
});

// Clean up test records
await dbRun('DELETE FROM accounts WHERE id IN (?, ?)', [TEST_MEMBER_ACCOUNT_ID, TEST_UNAUTH_MEMBER_ACCOUNT_ID]);
db.close();

console.log('\n================================================================');
console.log(`VERIFICATION SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
console.log('================================================================');

if (passedTests !== totalTests) {
  process.exit(1);
}
