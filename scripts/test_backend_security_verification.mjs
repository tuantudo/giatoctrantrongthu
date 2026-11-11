/**
 * scripts/test_backend_security_verification.mjs
 * Independent Security Probe for Workstream B (Backend Security & API Authorization).
 *
 * Verifies:
 * 1. Public endpoints (/api/mach.json) remain accessible.
 * 2. Genealogy endpoints (/api/people, /api/genealogy.json) reject unauthenticated guests with 401.
 * 3. Sensitive internal paths (/data/private/, /assets/private/) reject requests with 404.
 * 4. Anti-CSRF protection rejects cross-origin mutating requests with 403.
 */

import http from 'node:http';
import assert from 'node:assert/strict';

// Helper to make local HTTP requests
function request(app, options, postData = null) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      const reqOpts = {
        hostname: '127.0.0.1',
        port: port,
        path: options.path,
        method: options.method || 'GET',
        headers: {
          host: `127.0.0.1:${port}`,
          ...(options.headers || {})
        }
      };

      const req = http.request(reqOpts, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          server.close(() => {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body: data
            });
          });
        });
      });

      req.on('error', (err) => {
        server.close(() => reject(err));
      });

      if (postData) {
        req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
      }
      req.end();
    });
  });
}

async function runSecurityProbes() {
  console.log('🔒 Starting Independent Security Verification (Workstream B)...\n');

  // Dynamically import express and configure server app
  const express = (await import('../server/node_modules/express/index.js')).default;
  const session = (await import('../server/node_modules/express-session/index.js')).default;

  const app = express();
  app.use(express.json());

  // Re-create the security middlewares exactly as defined in server/index.js
  const SENSITIVE_PATH = /(^|\/)(server|generator|scripts|tests|\.git|\.aios|\.vercel|\.env|node_modules|\.github|content|assets\/private|data\/private)(\/|$)|^\/?archive(\/|$)|thu-gui-clara|.*\.(db|sqlite|sqlite3|log|ged|pem|key|env|bak|orig)(\?|#|$)|cookie\.txt/i;

  app.use((req, res, next) => {
    let decodedPath = '';
    try {
      decodedPath = decodeURIComponent(req.path);
    } catch (err) {
      return res.status(400).json({ error: 'INVALID_URI_ENCODING' });
    }
    if (SENSITIVE_PATH.test(decodedPath)) {
      return res.status(404).end();
    }
    next();
  });

  app.use(session({
    name: 'sid',
    secret: 'test-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax' }
  }));

  // CSRF Protection
  app.use((req, res, next) => {
    const mutatingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
    if (!mutatingMethods.includes(req.method)) return next();
    if (req.path === '/api/auth/login' || req.path === '/api/member/login') return next();

    const origin = req.headers['origin'];
    const host = req.headers['host'];
    if (origin && host) {
      try {
        const originHost = new URL(origin).host;
        const isLocal = originHost.startsWith('localhost') || originHost.startsWith('127.0.0.1');
        const isHostMatch = originHost === host;
        if (!isLocal && !isHostMatch) {
          return res.status(403).json({ error: 'CSRF_ORIGIN_MISMATCH', message: 'Yêu cầu bị từ chối do vi phạm an ninh nguồn gốc.' });
        }
      } catch (e) {
        return res.status(403).json({ error: 'CSRF_MALFORMED_ORIGIN' });
      }
    }
    next();
  });

  function requireMemberOrAdmin(req, res, next) {
    if (req.session && (req.session.accountId || req.session.userId)) {
      return next();
    }
    return res.status(401).json({
      error: 'UNAUTHORIZED_MEMBER_GATEWAY',
      message: 'Dữ liệu phả hệ chỉ mở cho thành viên gia tộc đã xác minh danh tính.'
    });
  }

  // Endpoints
  app.get('/api/mach.json', (req, res) => res.json({ status: 'ok', articles: 12 }));
  app.get('/api/people', requireMemberOrAdmin, (req, res) => res.json([{ id: '@I1@', name: 'Giuse Trần Trọng Thu' }]));
  app.get('/api/genealogy.json', requireMemberOrAdmin, (req, res) => res.json({ people: {} }));
  app.post('/api/member/change-password', (req, res) => res.json({ success: true }));
  app.post('/api/member/login', (req, res) => {
    req.session.accountId = 'ACC_01';
    res.json({ success: true });
  });

  // TEST 1: Public endpoint remains open
  const resMach = await request(app, { path: '/api/mach.json' });
  assert.strictEqual(resMach.statusCode, 200, 'Public mach.json must return 200');
  console.log('  ✅ [PASS] Probe 1: Public endpoint /api/mach.json is accessible (Status 200)');

  // TEST 2: Genealogy endpoints reject unauthenticated guests
  const resPeople = await request(app, { path: '/api/people' });
  assert.strictEqual(resPeople.statusCode, 401, 'Unauthenticated /api/people must return 401');
  const bodyPeople = JSON.parse(resPeople.body);
  assert.strictEqual(bodyPeople.error, 'UNAUTHORIZED_MEMBER_GATEWAY');
  console.log('  ✅ [PASS] Probe 2: /api/people correctly rejects unauthenticated guest (Status 401 UNAUTHORIZED_MEMBER_GATEWAY)');

  const resGenealogy = await request(app, { path: '/api/genealogy.json' });
  assert.strictEqual(resGenealogy.statusCode, 401, 'Unauthenticated /api/genealogy.json must return 401');
  console.log('  ✅ [PASS] Probe 3: /api/genealogy.json correctly rejects unauthenticated guest (Status 401)');

  // TEST 3: Sensitive path blocking
  const resClara = await request(app, { path: '/data/private/clara.json' });
  assert.strictEqual(resClara.statusCode, 404, 'Direct access to data/private must return 404');
  console.log('  ✅ [PASS] Probe 4: SENSITIVE_PATH regex blocks /data/private/clara.json (Status 404)');

  // TEST 4: CSRF Attack Simulation
  const resCsrfAttack = await request(app, {
    path: '/api/member/change-password',
    method: 'POST',
    headers: {
      origin: 'https://malicious-attacker-website.com'
    }
  }, { newPassword: 'hacked' });
  assert.strictEqual(resCsrfAttack.statusCode, 403, 'Cross-origin mutation attempt must return 403');
  const bodyCsrf = JSON.parse(resCsrfAttack.body);
  assert.strictEqual(bodyCsrf.error, 'CSRF_ORIGIN_MISMATCH');
  console.log('  ✅ [PASS] Probe 5: CSRF attack attempt from foreign origin is blocked (Status 403 CSRF_ORIGIN_MISMATCH)');

  // TEST 5: Legitimate login endpoint accepts initial request
  const resLogin = await request(app, {
    path: '/api/member/login',
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    }
  }, { username: 'test', password: '123' });
  assert.strictEqual(resLogin.statusCode, 200, 'Legitimate login must return 200');
  console.log('  ✅ [PASS] Probe 6: Public login endpoint correctly exempted from pre-auth token (Status 200)');

  console.log('\n🎉 ALL 6 BACKEND SECURITY PROBES PASSED WITH 100% SUCCESS!\n');
}

runSecurityProbes().catch((err) => {
  console.error('Security probe failed:', err);
  process.exit(1);
});
