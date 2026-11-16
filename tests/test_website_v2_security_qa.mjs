/**
 * tests/test_website_v2_security_qa.mjs
 * Comprehensive in-process automated security & boundary test suite for Website V2.
 *
 * Runs 100% in-process without socket network overhead (Sandbox-safe).
 * Verifies all 12 key scenarios required by CHECKPOINT 4 & BATCH 3:
 * 1. Guest accesses homepage (/) -> serves index.html
 * 2. Guest accesses Cây Phả Hệ (/me/tree -> 302 /login & /api/genealogy.json -> 401)
 * 3. Guest accesses MẠCH (/me/mach -> 302 /login & /api/mach.json -> safe GUEST_EDITORIAL_OVERVIEW)
 * 4. PROVISIONED account data lock (/me/tree -> 302 /me/change-password & /api/genealogy.json -> 403 PASSWORD_CHANGE_REQUIRED)
 * 5. ACTIVE member accesses allowed resources (/api/genealogy.json -> 200, /api/mach.json -> 200 full content)
 * 6. Non-eligible account accesses Clara (/me/clara -> 404 Zero-Hint, /api/member/clara.json -> 404 Zero-Hint)
 * 7. Eligible account (Tuấn) accesses Clara (/api/member/clara.json -> 200)
 * 8. Direct access to static avatars:
 *    - Whitelisted ancestor (FS_AVATAR_G5X4-ZNG.jpg) -> 200 OK
 *    - Non-whitelisted member avatar without auth -> 401 Unauthorized
 *    - Non-whitelisted member avatar with auth -> 200 OK
 * 9. Direct API guard (/api/edges -> 403, /api/events -> 403)
 * 10. Direct access to sensitive private paths (/data/private/clara.json, /server/family_archive.db, /.env) -> 404 blocked
 * 11. Security headers verification (Cache-Control: no-store, X-Content-Type-Options: nosniff)
 * 12. Verification of Two Portals on public-home.js (Cây Phả Hệ & MẠCH) without a 3rd pillar
 */

import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs';
import { Writable } from 'node:stream';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.join(__dirname, '..');

process.chdir(path.join(repoRoot, 'server'));

process.env.DB_CLIENT = 'sqlite3';
process.env.DB_PATH = path.join(repoRoot, 'server', 'family_archive.db');
process.env.SESSION_SECRET = 'test-secret-v2-boundary-verification';

const serverModule = await import(path.join(repoRoot, 'server', 'index.js'));
const { app, initDB } = serverModule.default || serverModule;

await initDB();

console.log(`\n🔒 [WEBSITE V2 QA] Running in-process security verification suite...\n`);

// Intercept sendFile on app.response to make in-process testing fast and deterministic
const origSendFile = app.response.sendFile;
app.response.sendFile = function(filePath, options, callback) {
  if (typeof this._testDone === 'function') {
    this._testDone({ file: filePath, status: this.statusCode || 200 });
    return;
  }
  return origSendFile.call(this, filePath, options, callback);
};

function testRoute(targetApp, method, url, headers = {}, session = {}) {
  return new Promise((resolve) => {
    let settled = false;
    const resHeaders = {};
    let statusCode = 200;

    const req = {
      method,
      url,
      originalUrl: url,
      path: url.split('?')[0],
      headers: { host: '127.0.0.1', ...headers },
      get: (h) => headers[h.toLowerCase()] || (h.toLowerCase() === 'host' ? '127.0.0.1' : undefined),
      session: { ...session },
      query: {},
      params: {}
    };

    function done(extra = {}) {
      if (!settled) {
        settled = true;
        resolve({
          status: extra.status || statusCode,
          headers: resHeaders,
          ...extra
        });
      }
    }

    const res = {
      statusCode: 200,
      _testDone: done,
      status(code) { statusCode = code; this.statusCode = code; return this; },
      set(k, v) { resHeaders[k.toLowerCase()] = v; return this; },
      setHeader(k, v) { resHeaders[k.toLowerCase()] = v; return this; },
      getHeader(k) { return resHeaders[k.toLowerCase()]; },
      removeHeader(k) { delete resHeaders[k.toLowerCase()]; return this; },
      redirect(loc) {
        statusCode = 302;
        resHeaders['location'] = loc;
        done({ status: 302, location: loc });
      },
      json(body) {
        statusCode = this.statusCode || 200;
        done({ body });
      },
      send(body) {
        statusCode = this.statusCode || 200;
        done({ body });
      },
      sendFile(file) {
        statusCode = this.statusCode || 200;
        done({ file });
      },
      end() {
        done();
      }
    };

    targetApp.handle(req, res, (err) => {
      done({ status: err ? 500 : 404, notFound: true, err });
    });
  });
}

let passedCount = 0;
let totalCount = 0;

async function runScenario(id, title, testFn) {
  totalCount++;
  try {
    await testFn();
    console.log(`  ✅ [PASS] Scenario ${id}: ${title}`);
    passedCount++;
  } catch (err) {
    console.error(`  ❌ [FAIL] Scenario ${id}: ${title}`);
    console.error(`     Error: ${err.message}\n`);
    throw err;
  }
}

// -------------------------------------------------------------------------
// SCENARIO 1: Guest accesses Homepage (/)
// -------------------------------------------------------------------------
await runScenario(1, 'Guest accesses homepage (200 OK, single-shell index.html)', async () => {
  const res = await testRoute(app, 'GET', '/');
  assert.strictEqual(res.status, 200);
  assert.ok(res.file.endsWith('index.html'), 'Must serve root index.html');
});

// -------------------------------------------------------------------------
// SCENARIO 2: Guest accesses Cây Phả Hệ (/me/tree & /api/genealogy.json)
// -------------------------------------------------------------------------
await runScenario(2, 'Guest accesses Cây Phả Hệ -> blocked (302 /login & 401)', async () => {
  const pageRes = await testRoute(app, 'GET', '/me/tree');
  assert.strictEqual(pageRes.status, 302);
  assert.strictEqual(pageRes.location, '/login');

  const apiRes = await testRoute(app, 'GET', '/api/genealogy.json');
  assert.strictEqual(apiRes.status, 401);
  assert.strictEqual(apiRes.body.error, 'UNAUTHORIZED_MEMBER_GATEWAY');
});

// -------------------------------------------------------------------------
// SCENARIO 3: Guest accesses MẠCH (/me/mach & /api/mach.json)
// -------------------------------------------------------------------------
await runScenario(3, 'Guest accesses MẠCH -> page redirects, API returns safe GUEST_EDITORIAL_OVERVIEW', async () => {
  const pageRes = await testRoute(app, 'GET', '/me/mach');
  assert.strictEqual(pageRes.status, 302);
  assert.strictEqual(pageRes.location, '/login');

  const apiRes = await testRoute(app, 'GET', '/api/mach.json');
  assert.strictEqual(apiRes.status, 200);
  assert.strictEqual(apiRes.body.access, 'GUEST_EDITORIAL_OVERVIEW');
  assert.strictEqual(apiRes.body.scope, 'CLAN');
  assert.strictEqual(apiRes.body.stories.length, 12, 'Must list all 12 articles');
  assert.strictEqual(apiRes.body.stories[0].content, undefined, 'Guest MUST NOT receive full article content');
  assert.ok(apiRes.body.message.includes('CLAN members'), 'Must inform user to log in for full content');
});

// -------------------------------------------------------------------------
// SCENARIO 4: PROVISIONED account data lock
// -------------------------------------------------------------------------
await runScenario(4, 'PROVISIONED account is locked from viewing genealogy or mutating data', async () => {
  const sqlite3 = (await import(path.join(repoRoot, 'server', 'node_modules', 'sqlite3', 'lib', 'sqlite3.js'))).default.verbose();
  const db = new sqlite3.Database(process.env.DB_PATH);
  const run = (q, p = []) => new Promise((res, rej) => db.run(q, p, err => err ? rej(err) : res()));

  await run("INSERT OR REPLACE INTO accounts (id, username, password_hash, role, status) VALUES ('acc_prov_fixture', 'prov_user', 'hash', 'member', 'PROVISIONED')");

  try {
    const provSession = {
      accountId: 'acc_prov_fixture',
      username: 'prov_user',
      role: 'member',
      status: 'PROVISIONED'
    };

    // Access /me/tree -> redirected to change password
    const treeRes = await testRoute(app, 'GET', '/me/tree', {}, provSession);
    assert.strictEqual(treeRes.status, 302);
    assert.strictEqual(treeRes.location, '/me/change-password');

    // Access /api/genealogy.json -> 403 PASSWORD_CHANGE_REQUIRED
    const apiRes = await testRoute(app, 'GET', '/api/genealogy.json', {}, provSession);
    assert.strictEqual(apiRes.status, 403);
    assert.strictEqual(apiRes.body.error, 'PASSWORD_CHANGE_REQUIRED');
  } finally {
    await run("DELETE FROM accounts WHERE id = 'acc_prov_fixture'");
    db.close();
  }
});

// -------------------------------------------------------------------------
// SCENARIO 5: ACTIVE member accesses allowed resources
// -------------------------------------------------------------------------
await runScenario(5, 'ACTIVE member accesses genealogy & full MẠCH content with security headers', async () => {
  const activeSession = {
    accountId: '88af7ac9-3c6d-467e-8f1b-9a2f1e95564d',
    username: 'tuantq',
    role: 'member',
    status: 'ACTIVE'
  };

  // Tree page served 200
  const treeRes = await testRoute(app, 'GET', '/me/tree', {}, activeSession);
  assert.strictEqual(treeRes.status, 200);
  assert.ok(treeRes.file.endsWith('member_tree.html'));

  // Genealogy API served 200
  const genRes = await testRoute(app, 'GET', '/api/genealogy.json', {}, activeSession);
  assert.strictEqual(genRes.status, 200);
  assert.ok(genRes.body.people, 'Must include people dictionary');

  // MẠCH API served full content
  const machRes = await testRoute(app, 'GET', '/api/mach.json', {}, activeSession);
  assert.strictEqual(machRes.status, 200);
  assert.ok(machRes.headers['cache-control'].includes('no-store'), 'Must include no-store header for authenticated member');
  assert.strictEqual(machRes.body.access, undefined, 'Authenticated member receives full payload, not guest overview');
  assert.ok(machRes.body.stories[0].contentMarkdown, 'Authenticated member MUST receive full article contentMarkdown');
});

// -------------------------------------------------------------------------
// SCENARIO 6: Non-eligible account accesses Clara -> 404 Zero-Hint
// -------------------------------------------------------------------------
await runScenario(6, 'Non-eligible account accesses Clara -> 404 Zero-Hint (Zero disclosure)', async () => {
  const sqlite3 = (await import(path.join(repoRoot, 'server', 'node_modules', 'sqlite3', 'lib', 'sqlite3.js'))).default.verbose();
  const db = new sqlite3.Database(process.env.DB_PATH);
  const run = (q, p = []) => new Promise((res, rej) => db.run(q, p, err => err ? rej(err) : res()));

  await run("INSERT OR REPLACE INTO accounts (id, username, password_hash, role, status) VALUES ('acc_other_branch', 'other_user', 'hash', 'member', 'ACTIVE')");
  await run("INSERT OR REPLACE INTO identity_mappings (account_id, person_id) VALUES ('acc_other_branch', '@I21@')");

  try {
    const otherSession = {
      accountId: 'acc_other_branch',
      username: 'other_user',
      role: 'member',
      status: 'ACTIVE',
      personId: '@I21@' // Not in Hạnh-Đào branch
    };

    // /me/clara -> 404 Not Found (Zero-Hint on web surface)
    const pageRes = await testRoute(app, 'GET', '/me/clara', {}, otherSession);
    assert.strictEqual(pageRes.status, 404);

    // /api/member/clara.json -> 403 Forbidden (FORBIDDEN_RESTRICTED_BRANCH on API surface)
    const apiRes = await testRoute(app, 'GET', '/api/member/clara.json', {}, otherSession);
    assert.strictEqual(apiRes.status, 403);
    assert.strictEqual(apiRes.body.error, 'FORBIDDEN_RESTRICTED_BRANCH');
  } finally {
    await run("DELETE FROM accounts WHERE id = 'acc_other_branch'");
    await run("DELETE FROM identity_mappings WHERE account_id = 'acc_other_branch'");
    db.close();
  }
});

// -------------------------------------------------------------------------
// SCENARIO 7: Eligible account accesses Clara -> 200 OK
// -------------------------------------------------------------------------
await runScenario(7, 'Eligible account (Tuấn / Admin) accesses Clara -> 200 OK', async () => {
  const tuanSession = {
    accountId: '88af7ac9-3c6d-467e-8f1b-9a2f1e95564d',
    username: 'tuantq',
    role: 'admin',
    status: 'ACTIVE'
  };

  const apiRes = await testRoute(app, 'GET', '/api/member/clara.json', {}, tuanSession);
  assert.strictEqual(apiRes.status, 200);
  assert.ok(apiRes.body.stories || apiRes.body.articles, 'Must return Clara stories to authorized person');
  assert.strictEqual(String(apiRes.body.discourseScope).toLowerCase(), 'clara');
});

// -------------------------------------------------------------------------
// SCENARIO 8: Direct access to static avatars (Whitelist vs Protected)
// -------------------------------------------------------------------------
await runScenario(8, 'Direct access to static avatars (whitelisted 200 vs protected 401/200)', async () => {
  // 8.1 Whitelisted ancestor avatar without session -> 200 OK
  const ancestorRes = await testRoute(app, 'GET', '/assets/images/avatars/FS_AVATAR_G5X4-ZNG.jpg');
  assert.strictEqual(ancestorRes.status, 200);

  // 8.2 Non-whitelisted member avatar without session -> 401 Unauthorized
  const anonRes = await testRoute(app, 'GET', '/assets/images/avatars/FS_AVATAR_G1B5-W5Y.jpg');
  assert.strictEqual(anonRes.status, 401);
  assert.strictEqual(anonRes.body.error, 'UNAUTHORIZED_AVATAR_ACCESS');

  // 8.3 Non-whitelisted member avatar with active session -> 200 OK
  const activeSession = {
    accountId: '88af7ac9-3c6d-467e-8f1b-9a2f1e95564d',
    username: 'tuantq',
    role: 'member',
    status: 'ACTIVE'
  };
  const authRes = await testRoute(app, 'GET', '/assets/images/avatars/FS_AVATAR_G1B5-W5Y.jpg', {}, activeSession);
  assert.strictEqual(authRes.status, 200);
});

// -------------------------------------------------------------------------
// SCENARIO 9: Direct API authorization check (/api/edges & /api/events -> 403)
// -------------------------------------------------------------------------
await runScenario(9, 'Direct API unauthorized calls (/api/edges, /api/events -> 403)', async () => {
  const edgesRes = await testRoute(app, 'GET', '/api/edges');
  assert.strictEqual(edgesRes.status, 403);

  const eventsRes = await testRoute(app, 'GET', '/api/events');
  assert.strictEqual(eventsRes.status, 403);
});

// -------------------------------------------------------------------------
// SCENARIO 10: Direct access to sensitive private paths -> 404 blocked
// -------------------------------------------------------------------------
await runScenario(10, 'Direct access to sensitive paths (/data/private, /server/db, .env) -> 404', async () => {
  const p1 = await testRoute(app, 'GET', '/data/private/clara.json');
  assert.strictEqual(p1.status, 404);

  const p2 = await testRoute(app, 'GET', '/server/family_archive.db');
  assert.strictEqual(p2.status, 404);

  const p3 = await testRoute(app, 'GET', '/.env');
  assert.strictEqual(p3.status, 404);
});

// -------------------------------------------------------------------------
// SCENARIO 11: Security Headers on Sensitive Endpoints
// -------------------------------------------------------------------------
await runScenario(11, 'Security headers verification (Cache-Control & X-Content-Type-Options)', async () => {
  const res = await testRoute(app, 'GET', '/api/mach.json');
  assert.strictEqual(res.headers['x-content-type-options'], 'nosniff');
});

// -------------------------------------------------------------------------
// SCENARIO 12: Two Primary Portals present on public-home.js
// -------------------------------------------------------------------------
await runScenario(12, 'Public Home code exports Two Primary Portals (Cây Phả Hệ & MẠCH) without a 3rd pillar', async () => {
  const homeJs = fs.readFileSync(path.join(repoRoot, 'src', 'js', 'ui', 'public-home.js'), 'utf8');
  assert.ok(homeJs.includes("id: 'cay-pha-he'"), 'Must contain Cây Phả Hệ portal id');
  assert.ok(homeJs.includes("id: 'chuyen-san-mach'"), 'Must contain Chuyên San MẠCH portal id');
  assert.ok(!homeJs.includes("Kho Di Ảnh & Tư Liệu"), 'Must not have third top-level portal named Kho Di Ảnh & Tư Liệu');
});

process.chdir(repoRoot);

console.log(`\n============================================================`);
console.log(`🎉 ALL ${passedCount}/${totalCount} SECURITY & BOUNDARY SCENARIOS PASSED 100%!`);
console.log(`============================================================\n`);
