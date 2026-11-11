/**
 * tests/test_public_cloudflare_acceptance.mjs
 * Comprehensive 12-Check Acceptance Suite for Public Cloudflare Hostname.
 * Target: https://api.giatoctrantrongthu.com
 *
 * Directive: EXECUTION DIRECTIVE — PUBLIC MEMBER CONTRIBUTION ACTIVATION
 * Phase: POST-WAF DEPLOYMENT VERIFICATION
 *
 * 12 Required Acceptance Checks:
 * TC-01: Anonymous login/proposal -> DENY (400 / 401 from Express)
 * TC-02: Authenticated but unverified -> 403 MEMBER_NOT_VERIFIED
 * TC-03: Disabled account -> DENY (403 from Express)
 * TC-04: Verified ACTIVE Member -> Gửi Proposal thành công (200 + PENDING_REVIEW + proposalId)
 * TC-05: Member Direct Edit -> DENY (403 from Cloudflare Edge)
 * TC-06: Member Approval -> DENY (403 from Cloudflare Edge)
 * TC-07: Owner Operations -> ALLOW via Admin Plane according to Governance policy
 * TC-08: Other mutation endpoints -> 403 Cloudflare Edge Block
 * TC-09: Invalid CSRF -> Origin rejection
 * TC-10: Forged/invalid session -> 401 Unauthorized
 * TC-11: Account rate limit -> 429 RATE_LIMIT_EXCEEDED_ACCOUNT
 * TC-12: IP rate limit -> 429 RATE_LIMIT_EXCEEDED_IP
 */

import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';

const PUBLIC_API_URL = process.env.PUBLIC_API_URL || 'https://api.giatoctrantrongthu.com';
const ADMIN_API_URL = process.env.ADMIN_API_URL || 'http://100.80.147.119:3000';
const TRUSTED_ORIGIN = 'https://admin.giatoctrantrongthu.com';
const UNTRUSTED_ORIGIN = 'https://attacker-domain.xyz';

console.log(`\n============================================================`);
console.log(`🌐 CLOUDFLARE PUBLIC ACCEPTANCE VERIFICATION (12-CHECK SUITE)`);
console.log(`Target Public Host: ${PUBLIC_API_URL}`);
console.log(`Admin Gateway Host: ${ADMIN_API_URL}`);
console.log(`Trusted Origin:     ${TRUSTED_ORIGIN}`);
console.log(`============================================================\n`);

class PublicClient {
  constructor(baseUrl, origin = TRUSTED_ORIGIN) {
    this.baseUrl = baseUrl;
    this.origin = origin;
    this.cookie = '';
  }

  async request(path, options = {}) {
    const url = `${this.baseUrl}${path}`;
    const method = options.method || 'GET';
    const headers = {
      'Content-Type': 'application/json',
      'Origin': this.origin,
      'Referer': `${this.origin}/`,
      ...(options.headers || {})
    };
    if (this.cookie) {
      headers['Cookie'] = this.cookie;
    }

    const res = await fetch(url, {
      ...options,
      headers,
      signal: AbortSignal.timeout(15000)
    });

    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      const match = setCookie.match(/(sid|connect\.sid)=[^;]+/);
      if (match) {
        this.cookie = match[0];
      }
    }

    let data = null;
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    const serverHeader = res.headers.get('server') || '';
    const cfRay = res.headers.get('cf-ray') || '';
    const xPoweredBy = res.headers.get('x-powered-by') || '';
    const isEdgeBlock = serverHeader.toLowerCase().includes('cloudflare') && typeof data === 'string' && data.includes('Attention Required');
    const isExpress = xPoweredBy.toLowerCase().includes('express');

    return {
      url,
      method,
      status: res.status,
      headers: res.headers,
      serverHeader,
      cfRay,
      xPoweredBy,
      isEdgeBlock,
      isExpress,
      data
    };
  }

  async login(username, password) {
    return this.request('/api/member/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  }

  async loginOwnerAdmin(username, password) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  }
}

function queryDb(querySql, params = []) {
  const code = `
    require("dotenv").config();
    const mysql = require("mysql2/promise");
    (async () => {
      const conn = await mysql.createConnection({
        host: process.env.DB_HOST || "127.0.0.1",
        port: process.env.DB_PORT || 3307,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        socketPath: process.env.DB_SOCKET || "/run/mysqld/mysqld10.sock"
      });
      const [rows] = await conn.query(${JSON.stringify(querySql)}, ${JSON.stringify(params)});
      console.log("__RESULT__" + JSON.stringify(rows));
      await conn.end();
    })();
  `;
  const b64 = Buffer.from(code).toString('base64');
  const cmd = `ssh -o BatchMode=yes -o StrictHostKeyChecking=no tuandzain@100.80.147.119 "cd /volume1/web/family-api && /var/packages/Node.js_v22/target/usr/local/bin/node -e \\"eval(Buffer.from('${b64}', 'base64').toString())\\""`;
  const raw = execSync(cmd).toString().trim();
  const match = raw.split('\n').find(l => l.startsWith('__RESULT__'));
  if (!match) throw new Error('No result from DB: ' + raw);
  return JSON.parse(match.replace('__RESULT__', ''));
}

async function runPublicAcceptance() {
  let passed = 0;
  const total = 12;
  const createdProposalIds = [];

  console.log('>>> [PHASE 5 PRE-CHECK] Recording baseline test accounts state...');
  const initialAccounts = queryDb("SELECT id, username, status FROM accounts WHERE username LIKE '%_e2e'");
  const initialAdmins = queryDb("SELECT id, username, is_active FROM admin_users WHERE username LIKE '%_e2e'");
  console.log('  -> Pre-test accounts:', JSON.stringify(initialAccounts));
  console.log('  -> Pre-test admins:', JSON.stringify(initialAdmins));

  console.log('>>> [PHASE 5 SETUP] Activating ONLY required test accounts...');
  queryDb("UPDATE accounts SET status = 'ACTIVE' WHERE username IN ('owner_e2e', 'editor_e2e', 'verified_member_e2e', 'unverified_member_e2e')");
  queryDb("UPDATE admin_users SET is_active = 1 WHERE username IN ('owner_e2e', 'editor_e2e')");
  queryDb("UPDATE accounts SET status = 'DISABLED' WHERE username = 'disabled_member_e2e'");

  try {

  // =============================================================
  // TC-01: Anonymous login/proposal -> DENY
  // =============================================================
  {
    console.log(`[TC-01] Testing Anonymous Login & Proposal...`);
    const anon = new PublicClient(PUBLIC_API_URL);

    // 1. Missing login credentials -> 400 Bad Request
    const loginRes = await anon.request('/api/member/login', {
      method: 'POST',
      body: JSON.stringify({})
    });
    console.log(`  -> POST /api/member/login: Status ${loginRes.status}, PoweredBy: ${loginRes.xPoweredBy}, Body: ${JSON.stringify(loginRes.data)}`);
    assert.equal(loginRes.status, 400, `Expected 400 for empty login, got ${loginRes.status}`);
    assert.equal(loginRes.isExpress, true, 'Response must come from Express backend');

    // 2. Anonymous proposal -> 401 Unauthorized
    const propRes = await anon.request('/api/member/proposals', {
      method: 'POST',
      body: JSON.stringify({ person_id: '@I1@', field: 'notes', suggested_value: 'Anonymous Attempt' })
    });
    console.log(`  -> POST /api/member/proposals: Status ${propRes.status}, PoweredBy: ${propRes.xPoweredBy}, Body: ${JSON.stringify(propRes.data)}`);
    assert.equal(propRes.status, 401, `Expected 401 for anonymous proposal, got ${propRes.status}`);
    assert.equal(propRes.data.error, 'Chưa đăng nhập');
    assert.equal(propRes.isExpress, true, 'Response must come from Express backend');

    console.log(`  ✅ [PASS] TC-01: Anonymous login/proposal strictly DENIED (400/401 from Express).`);
    passed++;
  }

  // =============================================================
  // TC-02: Authenticated but Unverified Member -> 403 MEMBER_NOT_VERIFIED
  // =============================================================
  {
    console.log(`\n[TC-02] Testing Authenticated but Unverified Member...`);
    const unverifiedClient = new PublicClient(PUBLIC_API_URL);
    const loginRes = await unverifiedClient.login('unverified_member_e2e', 'E2eTestPass#2026!');
    console.log(`  -> Login status: ${loginRes.status}, Body: ${JSON.stringify(loginRes.data)}`);
    assert.equal(loginRes.status, 200, `Login failed for unverified member`);

    const propRes = await unverifiedClient.request('/api/member/proposals', {
      method: 'POST',
      body: JSON.stringify({
        person_id: '@I1@',
        field: 'notes',
        suggested_value: 'Attempt from unverified account'
      })
    });
    console.log(`  -> Proposal status: ${propRes.status}, Body: ${JSON.stringify(propRes.data)}`);
    assert.equal(propRes.status, 403, `Expected 403 MEMBER_NOT_VERIFIED, got ${propRes.status}`);
    assert.equal(propRes.data.error, 'MEMBER_NOT_VERIFIED');
    assert.equal(propRes.isExpress, true);

    console.log(`  ✅ [PASS] TC-02: Authenticated but unverified member rejected with 403 MEMBER_NOT_VERIFIED.`);
    passed++;
  }

  // =============================================================
  // TC-03: Disabled Account -> DENY
  // =============================================================
  {
    console.log(`\n[TC-03] Testing Disabled Account Login...`);
    const disabledClient = new PublicClient(PUBLIC_API_URL);
    const loginRes = await disabledClient.login('disabled_member_e2e', 'E2eTestPass#2026!');
    console.log(`  -> Login status: ${loginRes.status}, Body: ${JSON.stringify(loginRes.data)}`);
    assert.equal(loginRes.status, 403, `Expected 403 for disabled account, got ${loginRes.status}`);
    assert.equal(loginRes.data.error, 'Tài khoản đã bị tạm khóa.');
    assert.equal(loginRes.isExpress, true);

    console.log(`  ✅ [PASS] TC-03: Disabled account strictly DENIED (403 from Express).`);
    passed++;
  }

  // =============================================================
  // TC-04: Verified ACTIVE Member -> Gửi Proposal thành công
  // =============================================================
  const verifiedClient = new PublicClient(PUBLIC_API_URL);
  let verifiedProposalId = null;
  {
    console.log(`\n[TC-04] Testing Verified ACTIVE Member Proposal Submission...`);
    const loginRes = await verifiedClient.login('verified_member_e2e', 'E2eTestPass#2026!');
    console.log(`  -> Login status: ${loginRes.status}, Body: ${JSON.stringify(loginRes.data)}`);
    assert.equal(loginRes.status, 200, `Login failed for verified member`);

    const propRes = await verifiedClient.request('/api/member/proposals', {
      method: 'POST',
      body: JSON.stringify({
        person_id: '@I1@',
        field: 'notes',
        suggested_value: 'Cụ Tổ Giuse Trần Trọng Thu - Public Acceptance Verification Note',
        source_evidence: 'Tài liệu phả hệ chi 2 lưu giữ',
        reason: 'Xác minh vận hành cổng đóng góp qua Cloudflare'
      })
    });
    console.log(`  -> Proposal status: ${propRes.status}, Body: ${JSON.stringify(propRes.data)}`);
    assert.equal(propRes.status, 200, `Proposal submission failed: ${JSON.stringify(propRes.data)}`);
    assert.equal(propRes.data.ok, true);
    assert.equal(propRes.data.status, 'PENDING_REVIEW');
    verifiedProposalId = propRes.data.proposalId || propRes.data.id;
    assert.ok(verifiedProposalId, 'Must return proposalId');
    createdProposalIds.push(verifiedProposalId);

    console.log(`  ✅ [PASS] TC-04: Verified Active Member Proposal ACCEPTED (ID: ${verifiedProposalId}, Status: PENDING_REVIEW).`);
    passed++;
  }

  // =============================================================
  // TC-05: Member Direct Edit -> DENY
  // =============================================================
  {
    console.log(`\n[TC-05] Testing Member Direct Edit via Public Hostname...`);
    const directRes = await verifiedClient.request('/api/people', {
      method: 'POST',
      body: JSON.stringify({ id: '@I1@', name: 'Tampered Direct Name' })
    });
    console.log(`  -> Public POST /api/people: Status ${directRes.status}, Server: ${directRes.serverHeader}, isEdgeBlock: ${directRes.isEdgeBlock}`);
    assert.equal(directRes.status, 403, `Direct edit must be 403`);
    assert.equal(directRes.isEdgeBlock, true, 'Must be blocked at Cloudflare Edge');

    console.log(`  ✅ [PASS] TC-05: Member Direct Edit strictly blocked at Cloudflare Edge (403 Forbidden).`);
    passed++;
  }

  // =============================================================
  // TC-06: Member Approval -> DENY
  // =============================================================
  {
    console.log(`\n[TC-06] Testing Member Approval Attempt via Public Hostname...`);
    const approveRes = await verifiedClient.request(`/api/admin/proposals/${verifiedProposalId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'APPROVED', reviewer_note: 'Tự duyệt trái phép' })
    });
    console.log(`  -> Public PATCH /api/admin/proposals/:id: Status ${approveRes.status}, Server: ${approveRes.serverHeader}, isEdgeBlock: ${approveRes.isEdgeBlock}`);
    assert.equal(approveRes.status, 403, `Approval endpoint must be 403`);
    assert.equal(approveRes.isEdgeBlock, true, 'Must be blocked at Cloudflare Edge');

    console.log(`  ✅ [PASS] TC-06: Member Approval attempt strictly blocked at Cloudflare Edge (403 Forbidden).`);
    passed++;
  }

  // =============================================================
  // TC-07: Owner Operations -> ALLOW via Governance Workflow
  // =============================================================
  {
    console.log(`\n[TC-07] Testing Owner Operations via Admin Governance Plane...`);
    const ownerAdminClient = new PublicClient(ADMIN_API_URL, TRUSTED_ORIGIN);
    const loginRes = await ownerAdminClient.loginOwnerAdmin('owner_e2e', 'E2eTestPass#2026!');
    console.log(`  -> Owner admin login status: ${loginRes.status}, User: ${JSON.stringify(loginRes.data?.user?.username)}`);
    assert.equal(loginRes.status, 200, `Owner login failed`);

    // 1. Owner views proposal inbox
    const inboxRes = await ownerAdminClient.request('/api/admin/proposals');
    assert.equal(inboxRes.status, 200);
    const proposalsList = Array.isArray(inboxRes.data) ? inboxRes.data : (inboxRes.data?.proposals || []);
    const targetProposal = proposalsList.find(p => p.id === verifiedProposalId);
    assert.ok(targetProposal, `Submitted proposal ${verifiedProposalId} not found in inbox`);
    assert.equal(targetProposal.status, 'PENDING');
    console.log(`  -> Owner verified proposal in inbox: ${targetProposal.id} (status: PENDING)`);

    // 2. Owner approves proposal -> Atomic commit to people
    const approveRes = await ownerAdminClient.request(`/api/admin/proposals/${verifiedProposalId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'APPROVED', reviewer_note: 'Public Acceptance Test Approval' })
    });
    assert.equal(approveRes.status, 200);
    console.log(`  -> Owner approved proposal ${verifiedProposalId}: ok`);

    // 3. Verify official data was updated in MariaDB directly
    const peopleRows = queryDb("SELECT id, name, notes FROM people WHERE id = ?", ['@I1@']);
    assert.equal(peopleRows.length, 1);
    const p1 = peopleRows[0];
    assert.equal(p1.notes, 'Cụ Tổ Giuse Trần Trọng Thu - Public Acceptance Verification Note');
    console.log(`  -> Verified official data committed to MariaDB: notes = "${p1.notes}"`);

    // 4. Owner cleanly reverts field back to canonical clean state
    const revertRes = await ownerAdminClient.request('/api/people', {
      method: 'POST',
      body: JSON.stringify({
        id: '@I1@',
        name: 'Giuse Trần Trọng Thu',
        birthYear: '1872',
        deathYear: '15/08/1969',
        gender: 'Nam',
        notes: '',
        status: 'PUBLISHED',
        reason: 'Public Acceptance Revert - Restore clean baseline'
      })
    });
    assert.equal(revertRes.status, 200);
    assert.equal(revertRes.data.success, true);

    const revertedRows = queryDb("SELECT id, name, notes FROM people WHERE id = ?", ['@I1@']);
    assert.equal(revertedRows[0].notes, '');
    console.log(`  -> Owner cleanly reverted field back to canonical clean baseline (notes = "")`);

    // 5. Verify Owner cannot mutate through public Cloudflare hostname (Edge protection)
    const publicOwnerClient = new PublicClient(PUBLIC_API_URL);
    publicOwnerClient.cookie = ownerAdminClient.cookie;
    const publicMutateRes = await publicOwnerClient.request('/api/people', {
      method: 'POST',
      body: JSON.stringify({ id: '@I1@', name: 'Attempt from public' })
    });
    assert.equal(publicMutateRes.status, 403);
    assert.equal(publicMutateRes.isEdgeBlock, true);
    console.log(`  -> Public edge mutation attempt by Owner strictly blocked by Cloudflare WAF (403)`);

    console.log(`  ✅ [PASS] TC-07: Owner Operations successfully executed through Governance Plane.`);
    passed++;
  }

  // =============================================================
  // TC-08: Other Mutation Endpoints -> Cloudflare Edge Block
  // =============================================================
  {
    console.log(`\n[TC-08] Testing Other Mutation Endpoints (Cloudflare Edge Protection)...`);
    const endpoints = [
      { method: 'POST', path: '/api/stories', body: { id: 's999' } },
      { method: 'POST', path: '/api/edges', body: { source_id: 's1', target_id: '@I1@' } },
      { method: 'DELETE', path: '/api/edges', body: { source_id: 's1', target_id: '@I1@' } },
      { method: 'POST', path: '/api/events', body: { uid: 'e999' } },
      { method: 'POST', path: '/api/admin/member-accounts', body: { username: 'probe' } }
    ];

    const probeClient = new PublicClient(PUBLIC_API_URL);
    for (const ep of endpoints) {
      const res = await probeClient.request(ep.path, {
        method: ep.method,
        body: JSON.stringify(ep.body)
      });
      console.log(`  -> ${ep.method} ${ep.path}: Status ${res.status}, Server: ${res.serverHeader}, isEdgeBlock: ${res.isEdgeBlock}`);
      assert.equal(res.status, 403, `${ep.method} ${ep.path} must be 403`);
      assert.equal(res.isEdgeBlock, true, `${ep.method} ${ep.path} must be blocked at Cloudflare Edge`);
    }

    console.log(`  ✅ [PASS] TC-08: All other mutation endpoints strictly blocked at Cloudflare Edge (403).`);
    passed++;
  }

  // =============================================================
  // TC-09: CORS & CSRF Security Verification (Target Policy)
  // =============================================================
  {
    console.log(`\n[TC-09] Testing CORS & CSRF Protection...`);
    
    // 1. Untrusted Origin on GET request
    const untrustedClient = new PublicClient(PUBLIC_API_URL, UNTRUSTED_ORIGIN);
    const getRes = await untrustedClient.request('/api/people', { method: 'GET' });
    const acaoUntrusted = getRes.headers.get('access-control-allow-origin');
    const acacUntrusted = getRes.headers.get('access-control-allow-credentials');
    console.log(`  -> Untrusted Origin: ${UNTRUSTED_ORIGIN}, ACAO: ${acaoUntrusted || 'NONE'}, ACAC: ${acacUntrusted || 'NONE'}`);
    assert.equal(acaoUntrusted, null, `Untrusted origin must receive NO Access-Control-Allow-Origin header`);
    assert.notEqual(acaoUntrusted, '*', `Must NEVER emit wildcard * Access-Control-Allow-Origin`);
    assert.notEqual(acaoUntrusted, UNTRUSTED_ORIGIN, `Must NEVER reflect untrusted origin`);
    assert.equal(acacUntrusted, null, `Untrusted origin must receive NO Access-Control-Allow-Credentials header`);

    // 2. Trusted Origin on GET request
    const trustedClient = new PublicClient(PUBLIC_API_URL, TRUSTED_ORIGIN);
    const trustedRes = await trustedClient.request('/api/people', { method: 'GET' });
    const acaoTrusted = trustedRes.headers.get('access-control-allow-origin');
    const acacTrusted = trustedRes.headers.get('access-control-allow-credentials');
    const varyTrusted = trustedRes.headers.get('vary');
    console.log(`  -> Trusted Origin: ${TRUSTED_ORIGIN}, ACAO: ${acaoTrusted}, ACAC: ${acacTrusted}, Vary: ${varyTrusted}`);
    assert.equal(acaoTrusted, TRUSTED_ORIGIN, `Trusted origin must receive exact ACAO match`);
    assert.equal(acacTrusted, 'true', `Trusted origin must receive ACAC: true`);
    assert.ok(varyTrusted && varyTrusted.includes('Origin'), `Vary header must include Origin`);

    // 3. Mutating request with Untrusted Origin + Session (Anti-CSRF)
    const csrfAttackerClient = new PublicClient(PUBLIC_API_URL, UNTRUSTED_ORIGIN);
    csrfAttackerClient.cookie = verifiedClient.cookie; // attach valid session
    const csrfPostRes = await csrfAttackerClient.request('/api/member/proposals', {
      method: 'POST',
      body: JSON.stringify({ person_id: '@I1@', field: 'notes', suggested_value: 'CSRF Attack' })
    });
    console.log(`  -> Untrusted Origin Mutation: Status ${csrfPostRes.status}, Error: ${csrfPostRes.data?.error}`);
    assert.equal(csrfPostRes.status, 403, `Untrusted origin mutation must be 403 Forbidden`);
    assert.equal(csrfPostRes.data?.error, 'CSRF_ORIGIN_MISMATCH', `Must return CSRF_ORIGIN_MISMATCH`);

    // 4. Missing Origin + Valid Referer -> ALLOW
    const refererRes = await fetch(`${PUBLIC_API_URL}/api/member/proposals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': `${TRUSTED_ORIGIN}/dashboard`,
        'Cookie': verifiedClient.cookie
      },
      body: JSON.stringify({ person_id: '@I1@', field: 'notes', suggested_value: 'Valid Referer Proposal' })
    });
    console.log(`  -> Missing Origin + Valid Referer: Status ${refererRes.status}`);
    assert.equal(refererRes.status, 200, 'Valid referer without origin must be accepted');
    const refererData = await refererRes.json();
    if (refererData.proposalId || refererData.id) createdProposalIds.push(refererData.proposalId || refererData.id);

    // 5. Missing Origin/Referer + Missing Token (Stripped Headers with Session) -> 403 CSRF_ORIGIN_REQUIRED
    const strippedRes = await fetch(`${PUBLIC_API_URL}/api/member/proposals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': verifiedClient.cookie
      },
      body: JSON.stringify({ person_id: '@I1@', field: 'notes', suggested_value: 'Stripped Header Attack' })
    });
    console.log(`  -> Stripped Headers with Session: Status ${strippedRes.status}`);
    assert.equal(strippedRes.status, 403, 'Stripped headers with session must be 403');
    const strippedData = await strippedRes.json();
    assert.equal(strippedData.error, 'CSRF_ORIGIN_REQUIRED');

    // 6. Invalid CSRF Token -> 403 CSRF_INVALID_TOKEN
    const invalidTokenRes = await fetch(`${PUBLIC_API_URL}/api/member/proposals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': verifiedClient.cookie,
        'X-CSRF-Token': 'malformed_invalid_token_999'
      },
      body: JSON.stringify({ person_id: '@I1@', field: 'notes', suggested_value: 'Invalid Token Attack' })
    });
    console.log(`  -> Invalid CSRF Token: Status ${invalidTokenRes.status}`);
    assert.equal(invalidTokenRes.status, 403, 'Invalid CSRF token must be 403');
    const invalidTokenData = await invalidTokenRes.json();
    assert.equal(invalidTokenData.error, 'CSRF_INVALID_TOKEN');

    // 7. Fetch valid CSRF Token via GET /api/csrf-token and verify Stripped Headers with Valid Token -> ALLOW
    const tokenFetchRes = await fetch(`${PUBLIC_API_URL}/api/csrf-token`, {
      headers: {
        'Origin': TRUSTED_ORIGIN,
        'Cookie': verifiedClient.cookie
      }
    });
    assert.equal(tokenFetchRes.status, 200);
    const tokenFetchData = await tokenFetchRes.json();
    assert.ok(tokenFetchData.csrfToken, 'Must receive valid CSRF token');
    console.log(`  -> Acquired CSRF Token: ${tokenFetchData.csrfToken.substring(0, 16)}...`);

    const validTokenRes = await fetch(`${PUBLIC_API_URL}/api/member/proposals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': verifiedClient.cookie,
        'X-CSRF-Token': tokenFetchData.csrfToken
      },
      body: JSON.stringify({ person_id: '@I1@', field: 'notes', suggested_value: 'Valid CSRF Token Proposal' })
    });
    console.log(`  -> Stripped Headers + Valid CSRF Token: Status ${validTokenRes.status}`);
    assert.equal(validTokenRes.status, 200, 'Valid CSRF token with stripped headers must be accepted');
    const validTokenData = await validTokenRes.json();
    if (validTokenData.proposalId || validTokenData.id) createdProposalIds.push(validTokenData.proposalId || validTokenData.id);

    console.log(`  ✅ [PASS] TC-09: CORS & CSRF target security policy strictly verified (All 7 sub-checks passed).`);
    passed++;
  }

  // =============================================================
  // TC-10: Forged / Invalid Session -> 401 Unauthorized
  // =============================================================
  {
    console.log(`\n[TC-10] Testing Forged / Invalid Session Cookie...`);
    const forgedClient = new PublicClient(PUBLIC_API_URL);
    forgedClient.cookie = 'sid=s%3Aforged_tampered_signature_99999.xyz';
    const res = await forgedClient.request('/api/admin/content/people', { method: 'GET' });
    console.log(`  -> Status ${res.status}, Body: ${JSON.stringify(res.data)}`);
    assert.equal(res.status, 401, `Forged session must receive 401`);
    assert.equal(res.isExpress, true);

    console.log(`  ✅ [PASS] TC-10: Forged session strictly rejected with 401 Unauthorized.`);
    passed++;
  }

  // =============================================================
  // TC-11: Account Rate Limit -> 429 RATE_LIMIT_EXCEEDED_ACCOUNT
  // =============================================================
  {
    console.log(`\n[TC-11] Testing Account Rate Limiting (20 proposals/hour threshold)...`);
    let reachedAccountLimit = false;
    for (let i = 0; i < 22; i++) {
      const res = await verifiedClient.request('/api/member/proposals', {
        method: 'POST',
        body: JSON.stringify({
          person_id: '@I1@',
          field: 'notes',
          suggested_value: `Account rate limit note #${i + 1}`
        })
      });
      if (res.status === 200) {
        const id = res.data.proposalId || res.data.id;
        if (id) createdProposalIds.push(id);
      } else if (res.status === 429) {
        console.log(`  -> Reached 429 on request #${i + 1}: ${JSON.stringify(res.data)}`);
        assert.equal(res.data.error, 'RATE_LIMIT_EXCEEDED_ACCOUNT');
        assert.equal(res.isExpress, true);
        reachedAccountLimit = true;
        break;
      }
    }
    assert.ok(reachedAccountLimit, 'Must trigger 429 RATE_LIMIT_EXCEEDED_ACCOUNT');

    console.log(`  ✅ [PASS] TC-11: Account-level Rate Limiting enforced with HTTP 429 RATE_LIMIT_EXCEEDED_ACCOUNT.`);
    passed++;
  }

  // =============================================================
  // TC-12: IP Rate Limit -> 429 RATE_LIMIT_EXCEEDED_IP
  // =============================================================
  {
    console.log(`\n[TC-12] Testing IP Rate Limiting (30 requests/hour threshold)...`);
    // Create a new client (different session) from same IP
    const secondMemberClient = new PublicClient(PUBLIC_API_URL);
    // Send requests until IP limiter (max 30) trips
    let reachedIpLimit = false;
    for (let i = 0; i < 15; i++) {
      const res = await secondMemberClient.request('/api/member/proposals', {
        method: 'POST',
        body: JSON.stringify({
          person_id: '@I1@',
          field: 'notes',
          suggested_value: `IP rate limit probe #${i + 1}`
        })
      });
      if (res.status === 429 && res.data?.error === 'RATE_LIMIT_EXCEEDED_IP') {
        console.log(`  -> Reached IP 429 on request #${i + 1}: ${JSON.stringify(res.data)}`);
        assert.equal(res.isExpress, true);
        reachedIpLimit = true;
        break;
      }
    }
    assert.ok(reachedIpLimit, 'Must trigger 429 RATE_LIMIT_EXCEEDED_IP');

    console.log(`  ✅ [PASS] TC-12: IP-level Rate Limiting enforced with HTTP 429 RATE_LIMIT_EXCEEDED_IP.`);
    passed++;
  }

  } finally {
    console.log('\n>>> [PHASE 5 NEUTRALIZATION] Locking 100% of test accounts in Production DB...');
    queryDb("UPDATE accounts SET status = 'DISABLED' WHERE username LIKE '%_e2e'");
    queryDb("UPDATE admin_users SET is_active = 0 WHERE username LIKE '%_e2e'");

    const postAccounts = queryDb("SELECT username, status FROM accounts WHERE username LIKE '%_e2e'");
    const postAdmins = queryDb("SELECT username, is_active FROM admin_users WHERE username LIKE '%_e2e'");
    console.log('  -> Post-test accounts:', JSON.stringify(postAccounts));
    console.log('  -> Post-test admins:', JSON.stringify(postAdmins));

    const activeCount = postAccounts.filter(a => a.status === 'ACTIVE').length + postAdmins.filter(a => a.is_active === 1).length;
    assert.equal(activeCount, 0, 'ZERO test accounts must remain active in Production DB');
    console.log('  ✅ [PASS] Phase 5 Verification: ZERO test accounts remain active (100% DISABLED).');

    // Baseline Data Invariant Check
    const peopleCount = queryDb("SELECT COUNT(*) as c FROM people");
    const familyCount = queryDb("SELECT COUNT(*) as c FROM families");
    const edgeCount = queryDb("SELECT COUNT(*) as c FROM edges");
    const p1 = queryDb("SELECT notes FROM people WHERE id = '@I1@'");
    console.log(`  -> Baseline Check: People=${peopleCount[0].c}, Families=${familyCount[0].c}, Edges=${edgeCount[0].c}, @I1@ notes="${p1[0].notes}"`);
    assert.equal(peopleCount[0].c, 223, 'Must maintain exactly 223 people baseline');
    assert.equal(familyCount[0].c, 68, 'Must maintain exactly 68 families baseline');
    assert.equal(edgeCount[0].c, 1, 'Must maintain exactly 1 edge baseline');
    assert.equal(p1[0].notes, '', 'Cụ Tổ notes must be reverted clean');
    console.log('  ✅ [PASS] Phase 5 Verification: Official Production Baseline Preserved (223/68/1).');
  }

  console.log(`\n============================================================`);
  console.log(`🎉 ALL 12 PUBLIC CLOUDFLARE ACCEPTANCE TESTS PASSED (${passed}/${total} = 100%)!`);
  console.log(`Total test proposals created: ${createdProposalIds.length}`);
  console.log(`============================================================\n`);

  return { passed, total, createdProposalIds };
}

runPublicAcceptance().then(res => {
  console.log(`Summary: ${JSON.stringify(res)}`);
}).catch(err => {
  console.error('\n❌ PUBLIC ACCEPTANCE SUITE FAILED:', err);
  process.exit(1);
});
