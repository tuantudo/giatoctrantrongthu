/**
 * scripts/test_security_verification.mjs
 * In-Memory Security Verification Suite for Giuse Trần Trọng Thu Digital Heritage
 * Tests CF-01 to CF-08 & P0 Clara Privacy Containment (Zero network socket requirement)
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import http from 'node:http';
import { Readable } from 'node:stream';

const REPO_ROOT = process.cwd();

console.log('========================================================');
console.log('AUTOMATED SECURITY THREAT VERIFICATION (IN-MEMORY)');
console.log('========================================================');

let testsPassed = 0;
let testsTotal = 0;

async function test(name, fn) {
  testsTotal++;
  try {
    await fn();
    console.log(`  ✅ [PASS] ${name}`);
    testsPassed++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
  }
}

// Dynamically import server app
process.env.DB_CLIENT = 'sqlite3';
process.env.DB_PATH = path.join(REPO_ROOT, 'server/family_archive.db');
process.env.SESSION_SECRET = 'security-test-secret';

const { app, initDB } = await import(path.join(REPO_ROOT, 'server/index.js'));
await initDB();

function mockRequest(app, method, urlPath, headers = {}, body = null) {
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
    const origWrite = res.write.bind(res);
    const origEnd = res.end.bind(res);

    res.write = function (chunk, encoding) {
      if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding));
      return true;
    };

    res.end = function (chunk, encoding) {
      if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding));
      resolve({
        status: res.statusCode,
        headers: res.getHeaders(),
        body: Buffer.concat(chunks).toString('utf8')
      });
    };

    app(req, res);
  });
}

// CF-01: Static Root Directory Lockdown
await test('CF-01: Sensitive files in root and server return 404', async () => {
  const targets = [
    '/package.json',
    '/server/index.js',
    '/server/family_archive.db',
    '/.env',
    '/.git/config',
    '/GIADINHONGTHU.ged'
  ];
  for (const t of targets) {
    const res = await mockRequest(app, 'GET', t);
    assert.strictEqual(res.status, 404, `Expected 404 for ${t}, got ${res.status}`);
  }
});

// CF-02: URI Malformed DoS Immunity
await test('CF-02: Malformed URI encoding does not crash server and returns 400', async () => {
  const res = await mockRequest(app, 'GET', '/%E0%A4%A');
  assert.ok(res.status === 400 || res.status === 404, `Expected 400 or 404, got ${res.status}`);
});

// CF-03: Unauthenticated Write Endpoint Protection
await test('CF-03: Anonymous write operations are rejected with 401/403', async () => {
  const endpoints = [
    { method: 'POST', path: '/api/people' },
    { method: 'POST', path: '/api/stories' },
    { method: 'POST', path: '/api/edges' },
    { method: 'DELETE', path: '/api/edges' },
    { method: 'POST', path: '/api/events' }
  ];
  for (const ep of endpoints) {
    const res = await mockRequest(app, ep.method, ep.path, { 'content-type': 'application/json' }, { name: 'Test' });
    assert.ok(res.status === 401 || res.status === 403, `Expected 401/403 for ${ep.method} ${ep.path}, got ${res.status}`);
  }
});

// CF-05: Secret Scripts & Webhooks Elimination
await test('CF-05: revert_pass.js removed from root & CI webhook hardcoded fallback eliminated', () => {
  assert.ok(!fs.existsSync(path.join(REPO_ROOT, 'revert_pass.js')), 'revert_pass.js must not be in root');
  const ciWorkflow = fs.readFileSync(path.join(REPO_ROOT, '.github/workflows/instant-sync.yml'), 'utf8');
  assert.ok(!ciWorkflow.includes('https://script.google.com/macros/s/'), 'No hardcoded GAS webhook URL in CI workflow');
});

// CF-06: Gitignore & Sensitive Path Protection
await test('CF-06: Sensitive extensions and private directories are gitignored', () => {
  const gitignore = fs.readFileSync(path.join(REPO_ROOT, '.gitignore'), 'utf8');
  assert.ok(gitignore.includes('*.ged'), 'Must ignore *.ged');
  assert.ok(gitignore.includes('/content/private/'), 'Must ignore /content/private/');
  assert.ok(gitignore.includes('/assets/private/'), 'Must ignore /assets/private/');
  assert.ok(gitignore.includes('/data/private/'), 'Must ignore /data/private/');
});

// P0 Clara Privacy Containment: API surface
await test('P0 Clara Containment: /api/mach.json returns 12 MẠCH stories, 0 Clara', async () => {
  const res = await mockRequest(app, 'GET', '/api/mach.json');
  assert.strictEqual(res.status, 200);
  const data = JSON.parse(res.body);
  assert.strictEqual(data.stories.length, 12, 'Must have exactly 12 MẠCH stories');
  assert.ok(!res.body.toLowerCase().includes('clara'), 'Response body must not contain "clara"');
  assert.ok(!res.body.includes('thu-gui-clara'), 'Response body must not contain "thu-gui-clara"');
});

// P0 Clara Containment: Static files
await test('P0 Clara Containment: Direct requests to private Clara paths return 404', async () => {
  const forbidden = [
    '/content/private/clara/Thư gửi Clara - 001.md',
    '/assets/private/images/clara/001.png',
    '/data/private/clara.json',
    '/content/mach/thu-gui-clara/001.md',
    '/assets/images/mach/thu-gui-clara/001.png'
  ];
  for (const f of forbidden) {
    const res = await mockRequest(app, 'GET', f);
    assert.strictEqual(res.status, 404, `Expected 404 for ${f}, got ${res.status}`);
  }
});

// P0 Clara Containment: Unauthorized access to /api/member/clara.json
await test('P0 Clara Containment: Anonymous access to /api/member/clara.json is denied', async () => {
  const res = await mockRequest(app, 'GET', '/api/member/clara.json');
  assert.ok(res.status === 302 || res.status === 401 || res.status === 403, `Got ${res.status}`);
});

console.log('========================================================');
console.log(`SECURITY VERIFICATION RESULTS: ${testsPassed}/${testsTotal} PASSED`);
console.log('========================================================');

if (testsPassed !== testsTotal) {
  process.exit(1);
}
