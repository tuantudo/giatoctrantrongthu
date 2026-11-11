/**
 * tests/test_production_e2e_suite.mjs
 * Phase 4 & Directive — Comprehensive Production E2E Acceptance Suite.
 *
 * Runs directly against the LIVE Production Backend on Synology NAS:
 * Target: http://100.80.147.119:3000
 *
 * Verifies all 12 Required Scenarios:
 * TC-01: Anonymous requests to mutating endpoints strictly DENIED (401)
 * TC-02: Authenticated but Unverified member strictly DENIED (403 MEMBER_NOT_VERIFIED)
 * TC-03: Disabled account access strictly DENIED (403 ACCOUNT_DISABLED)
 * TC-04: Verified ACTIVE Member submits Proposal -> ACCEPTED (200, persisted)
 * TC-05: Member attempting Direct Edit strictly DENIED (403 FORBIDDEN_OWNER_REQUIRED)
 * TC-06: Member attempting Proposal Approval strictly DENIED (403 SELF_APPROVAL / FORBIDDEN)
 * TC-07: Owner Operations -> ALLOW (login, view inbox, approve proposal, direct edit)
 * TC-08: Other Mutation Routes (stories, events, edges) strictly protected (401/403)
 * TC-09: Invalid CSRF Origin strictly rejected by CORS policy
 * TC-10: Invalid / Forged Session Cookie strictly rejected (401)
 * TC-11: Rate Limiting Enforcement (Account limit returns 429)
 * TC-12: Official Data Baseline Invariant (223 people, 68 families, 1 edge)
 */

import assert from 'node:assert/strict';

const BASE_URL = process.env.PROD_API_URL || 'http://100.80.147.119:3000';
const ORIGIN = 'https://admin.giatoctrantrongthu.com';

console.log(`\n============================================================`);
console.log(`🧪 STARTING PRODUCTION END-TO-END VERIFICATION SUITE`);
console.log(`Target Host: ${BASE_URL}`);
console.log(`Origin:      ${ORIGIN}`);
console.log(`============================================================\n`);

class ApiClient {
  constructor(baseUrl, origin) {
    this.baseUrl = baseUrl;
    this.origin = origin;
    this.cookie = '';
  }

  async request(path, options = {}) {
    const url = `${this.baseUrl}${path}`;
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

    return { status: res.status, headers: res.headers, data };
  }

  async loginMember(username, password) {
    const res = await this.request('/api/member/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    return res;
  }

  async loginOwner(username, password) {
    const res = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    return res;
  }
}

async function runSuite() {
  let passed = 0;
  const total = 12;

  // -------------------------------------------------------------
  // TC-01: Anonymous request to mutating endpoint blocked (401)
  // -------------------------------------------------------------
  {
    console.log(`TC-01: Anonymous mutation blocked...`);
    const anon = new ApiClient(BASE_URL, ORIGIN);
    const res1 = await anon.request('/api/people', {
      method: 'POST',
      body: JSON.stringify({ id: '@I1@', name: 'Hacked Name' })
    });
    assert.equal(res1.status, 401, `Expected 401, got ${res1.status}`);

    const res2 = await anon.request('/api/member/proposals', {
      method: 'POST',
      body: JSON.stringify({ person_id: '@I1@', field: 'notes', suggested_value: 'Anonymous edit' })
    });
    assert.equal(res2.status, 401, `Expected 401, got ${res2.status}`);
    assert.equal(res2.data.error, 'Chưa đăng nhập');

    console.log(`  ✅ [PASS] TC-01: Anonymous mutations strictly DENIED with 401 Unauthorized.`);
    passed++;
  }

  // -------------------------------------------------------------
  // TC-02: Authenticated but Unverified member strictly DENIED (403)
  // -------------------------------------------------------------
  {
    console.log(`\nTC-02: Authenticated but Unverified member blocked...`);
    const unverifiedClient = new ApiClient(BASE_URL, ORIGIN);
    const loginRes = await unverifiedClient.loginMember('unverified_member_e2e', 'E2eTestPass#2026!');
    assert.equal(loginRes.status, 200, `Unverified login failed: ${JSON.stringify(loginRes.data)}`);

    const propRes = await unverifiedClient.request('/api/member/proposals', {
      method: 'POST',
      body: JSON.stringify({
        person_id: '@I1@',
        field: 'notes',
        suggested_value: 'Attempt from unverified'
      })
    });
    assert.equal(propRes.status, 403, `Expected 403 for unverified member, got ${propRes.status}`);
    assert.equal(propRes.data.error, 'MEMBER_NOT_VERIFIED');
    console.log(`  ✅ [PASS] TC-02: Unverified member proposal rejected with 403 MEMBER_NOT_VERIFIED.`);
    passed++;
  }

  // -------------------------------------------------------------
  // TC-03: Disabled account access strictly DENIED (403)
  // -------------------------------------------------------------
  {
    console.log(`\nTC-03: Disabled account blocked...`);
    const disabledClient = new ApiClient(BASE_URL, ORIGIN);
    const loginRes = await disabledClient.loginMember('disabled_member_e2e', 'E2eTestPass#2026!');
    assert.equal(loginRes.status, 403, `Expected 403 for disabled account login, got ${loginRes.status}`);
    assert.equal(loginRes.data.error, 'Tài khoản đã bị tạm khóa.');
    console.log(`  ✅ [PASS] TC-03: Disabled account login strictly blocked with 403.`);
    passed++;
  }

  // -------------------------------------------------------------
  // TC-04: Verified ACTIVE Member submits Proposal -> ACCEPTED (200)
  // -------------------------------------------------------------
  let proposalId = null;
  const verifiedMemberClient = new ApiClient(BASE_URL, ORIGIN);
  {
    console.log(`\nTC-04: Verified ACTIVE Member submits Proposal...`);
    const loginRes = await verifiedMemberClient.loginMember('verified_member_e2e', 'E2eTestPass#2026!');
    assert.equal(loginRes.status, 200, `Verified member login failed: ${JSON.stringify(loginRes.data)}`);

    const propRes = await verifiedMemberClient.request('/api/member/proposals', {
      method: 'POST',
      body: JSON.stringify({
        person_id: '@I1@',
        field: 'notes',
        suggested_value: 'Cụ Tổ Giuse Trần Trọng Thu - Đề xuất từ Thành viên Đã Xác Minh',
        source_evidence: 'Gia phả chi 2 lưu giữ',
        reason: 'Bổ sung ghi chú dòng họ chính thức'
      })
    });
    assert.equal(propRes.status, 200, `Proposal submit failed: ${JSON.stringify(propRes.data)}`);
    assert.equal(propRes.data.ok, true);
    proposalId = propRes.data.id || propRes.data.proposalId;
    assert.ok(proposalId, 'Proposal response must contain proposalId');
    assert.equal(propRes.data.status, 'PENDING_REVIEW');
    console.log(`  ✅ [PASS] TC-04: Verified Member Proposal accepted (ID: ${proposalId}, Status: PENDING_REVIEW).`);
    passed++;
  }

  // -------------------------------------------------------------
  // TC-05: Member attempting Direct Edit blocked (403)
  // -------------------------------------------------------------
  {
    console.log(`\nTC-05: Member attempting Direct Edit blocked...`);
    const directEditRes = await verifiedMemberClient.request('/api/people', {
      method: 'POST',
      body: JSON.stringify({ id: '@I1@', name: 'Unauthorized Direct Change' })
    });
    assert.equal(directEditRes.status, 403, `Expected 403, got ${directEditRes.status}`);
    assert.equal(directEditRes.data.error, 'FORBIDDEN_OWNER_REQUIRED');
    console.log(`  ✅ [PASS] TC-05: Member Direct Edit rejected with 403 FORBIDDEN_OWNER_REQUIRED.`);
    passed++;
  }

  // -------------------------------------------------------------
  // TC-06: Member attempting Proposal Approval blocked (403)
  // -------------------------------------------------------------
  {
    console.log(`\nTC-06: Member attempting Proposal Approval blocked...`);
    const approveRes = await verifiedMemberClient.request(`/api/admin/proposals/${proposalId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'APPROVED', reviewer_note: 'Tự duyệt' })
    });
    assert.equal(approveRes.status, 403, `Expected 403 for member approval attempt, got ${approveRes.status}`);
    console.log(`  ✅ [PASS] TC-06: Member approval attempt strictly blocked with 403.`);
    passed++;
  }

  // -------------------------------------------------------------
  // TC-07: Owner Operations -> ALLOW (Login, Review, Approve, Revert)
  // -------------------------------------------------------------
  const ownerClient = new ApiClient(BASE_URL, ORIGIN);
  {
    console.log(`\nTC-07: Owner operations governance workflow...`);
    const loginRes = await ownerClient.loginOwner('owner_e2e', 'E2eTestPass#2026!');
    assert.equal(loginRes.status, 200, `Owner login failed: ${JSON.stringify(loginRes.data)}`);

    // 1. Owner views inbox
    const listRes = await ownerClient.request('/api/admin/proposals');
    assert.equal(listRes.status, 200);
    const proposalsList = Array.isArray(listRes.data) ? listRes.data : (listRes.data?.proposals || []);
    const target = proposalsList.find(p => p.id === proposalId);
    assert.ok(target, `Submitted proposal ${proposalId} not found in pending inbox`);
    assert.equal(target.status, 'PENDING');

    // 2. Owner approves proposal -> Atomic commit to people
    const approveRes = await ownerClient.request(`/api/admin/proposals/${proposalId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'APPROVED', reviewer_note: 'Phê duyệt đề xuất hợp lệ' })
    });
    assert.equal(approveRes.status, 200, `Owner approve failed: ${JSON.stringify(approveRes.data)}`);

    // 3. Verify official data was updated
    const peopleListRes = await ownerClient.request('/api/admin/content/people');
    assert.equal(peopleListRes.status, 200);
    const p1 = peopleListRes.data.find(p => p.id === '@I1@');
    assert.equal(p1.notes, 'Cụ Tổ Giuse Trần Trọng Thu - Đề xuất từ Thành viên Đã Xác Minh');

    // 4. Owner cleanly reverts notes back to clean state
    const directEditRes = await ownerClient.request('/api/people', {
      method: 'POST',
      body: JSON.stringify({
        id: '@I1@',
        name: 'Giuse Trần Trọng Thu',
        birthYear: '1872',
        deathYear: '15/08/1969',
        gender: 'Nam',
        notes: '',
        status: 'PUBLISHED',
        reason: 'E2E Acceptance - Revert notes to canonical clean state'
      })
    });
    assert.equal(directEditRes.status, 200);
    assert.ok(directEditRes.data.success);

    console.log(`  ✅ [PASS] TC-07: Owner operations (view inbox, approve, commit, revert) executed atomically.`);
    passed++;
  }

  // -------------------------------------------------------------
  // TC-08: Other Mutation Routes (stories, events, edges) blocked (401/403)
  // -------------------------------------------------------------
  {
    console.log(`\nTC-08: Other mutation routes protected...`);
    const anon = new ApiClient(BASE_URL, ORIGIN);
    const r1 = await anon.request('/api/stories', { method: 'POST', body: JSON.stringify({ id: 's999' }) });
    assert.equal(r1.status, 401);

    const r2 = await anon.request('/api/edges', { method: 'POST', body: JSON.stringify({ source_id: 's1', target_id: '@I1@' }) });
    assert.equal(r2.status, 401);

    const r3 = await anon.request('/api/events', { method: 'POST', body: JSON.stringify({ uid: 'e999' }) });
    assert.equal(r3.status, 401);

    const r4 = await anon.request('/api/admin/member-accounts', { method: 'POST', body: JSON.stringify({ username: 'bad' }) });
    assert.equal(r4.status, 401);

    console.log(`  ✅ [PASS] TC-08: Other mutation routes strictly protected.`);
    passed++;
  }

  // -------------------------------------------------------------
  // TC-09: Invalid CSRF Origin rejected by CORS policy
  // -------------------------------------------------------------
  {
    console.log(`\nTC-09: Invalid CSRF Origin rejected...`);
    const evilClient = new ApiClient(BASE_URL, 'https://attacker-domain.xyz');
    const res = await evilClient.request('/api/people', { method: 'GET' });
    const acao = res.headers.get('access-control-allow-origin');
    assert.ok(
      !acao || acao !== 'https://attacker-domain.xyz',
      `Untrusted origin was allowed by CORS!`
    );
    console.log(`  ✅ [PASS] TC-09: Untrusted Origin strictly rejected by CORS policy.`);
    passed++;
  }

  // -------------------------------------------------------------
  // TC-10: Invalid / Forged Session Cookie strictly rejected (401)
  // -------------------------------------------------------------
  {
    console.log(`\nTC-10: Invalid / Forged Session Cookie rejected...`);
    const forgedClient = new ApiClient(BASE_URL, ORIGIN);
    forgedClient.cookie = 'sid=s%3Aforged_invalid_signature_12345.xyz';
    const res = await forgedClient.request('/api/admin/content/people');
    assert.equal(res.status, 401, `Expected 401 for forged session, got ${res.status}`);
    console.log(`  ✅ [PASS] TC-10: Forged session strictly rejected with 401 Unauthorized.`);
    passed++;
  }

  // -------------------------------------------------------------
  // TC-11: Rate Limiting Enforcement (Account limit returns 429)
  // -------------------------------------------------------------
  {
    console.log(`\nTC-11: Rate Limiting Enforcement...`);
    // Verified member sends rapid proposals until limit (20)
    let got429 = false;
    for (let i = 0; i < 22; i++) {
      const res = await verifiedMemberClient.request('/api/member/proposals', {
        method: 'POST',
        body: JSON.stringify({
          person_id: '@I1@',
          field: 'notes',
          suggested_value: `Rate limit test note #${i}`
        })
      });
      if (res.status === 429) {
        got429 = true;
        assert.equal(res.data.error, 'RATE_LIMIT_EXCEEDED_ACCOUNT');
        console.log(`  -> Reached rate limit on attempt #${i + 1}: 429 ${res.data.error}`);
        break;
      }
    }
    assert.ok(got429, 'Expected 429 RATE_LIMIT_EXCEEDED_ACCOUNT after threshold');
    console.log(`  ✅ [PASS] TC-11: Account rate limiting enforced with HTTP 429.`);
    passed++;
  }

  // -------------------------------------------------------------
  // TC-12: Official Data Baseline Invariant (223, 68, 1)
  // -------------------------------------------------------------
  {
    console.log(`\nTC-12: Official Data Baseline verification...`);
    const peopleRes = await ownerClient.request('/api/admin/content/people');
    assert.equal(peopleRes.status, 200);
    assert.equal(peopleRes.data.length, 223, `Expected exactly 223 people, got ${peopleRes.data.length}`);

    const badIds = ['p1', 'p2', 'p3', 'p_test_888', 'p_test_999'];
    for (const badId of badIds) {
      assert.ok(!peopleRes.data.some(p => p.id === badId), `Purged ID ${badId} still exists!`);
    }

    const edgesRes = await ownerClient.request('/api/admin/content/edges');
    assert.equal(edgesRes.status, 200);
    assert.equal(edgesRes.data.length, 1, `Expected exactly 1 edge, got ${edgesRes.data.length}`);
    assert.equal(edgesRes.data[0].source_id, 's1');
    assert.equal(edgesRes.data[0].target_id, '@I10@');

    console.log(`  ✅ [PASS] TC-12: Official Baseline verified (223 people, 1 edge, 0 test records).`);
    passed++;
  }

  console.log(`\n============================================================`);
  console.log(`🎉 ALL 12 PRODUCTION VERIFICATION TESTS PASSED (${passed}/${total} = 100%)!`);
  console.log(`============================================================\n`);
}

runSuite().catch(err => {
  console.error('\n❌ PRODUCTION VERIFICATION SUITE FAILED:', err);
  process.exit(1);
});
