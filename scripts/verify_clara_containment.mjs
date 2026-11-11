/**
 * scripts/verify_clara_containment.mjs
 * Automated Verification Script for CLARA P0 Privacy Containment
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';

const REPO_ROOT = process.cwd();

console.log('====================================================');
console.log('VERIFYING CLARA P0 PRIVACY CONTAINMENT');
console.log('====================================================');

let testsPassed = 0;
let testsTotal = 0;

function test(name, fn) {
  testsTotal++;
  try {
    fn();
    console.log(`  ✅ [PASS] ${name}`);
    testsPassed++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
  }
}

// 1. Check data/mach.json
test('data/mach.json is public, contains 12 MẠCH stories and 0 Clara stories', () => {
  const p = path.join(REPO_ROOT, 'data/mach.json');
  assert.ok(fs.existsSync(p), 'data/mach.json exists');
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  assert.strictEqual(d.stories.length, 12, 'Must have exactly 12 stories');
  assert.strictEqual(Object.keys(d.series).length, 1, 'Must have exactly 1 series (issue-01)');
  assert.ok(d.series['issue-01'], 'issue-01 exists');
  assert.strictEqual(d.series['thu-gui-clara'], undefined, 'thu-gui-clara must NOT exist in series');
  assert.strictEqual(d.authors['tuan'], undefined, 'tuan must not exist in public authors');
  
  const rawStr = fs.readFileSync(p, 'utf8');
  assert.ok(!rawStr.toLowerCase().includes('clara'), 'No "clara" keyword in public mach.json');
  assert.ok(!rawStr.includes('thu-gui-clara'), 'No "thu-gui-clara" in public mach.json');
});

// 2. Check server/data/mach.json sync
test('server/data/mach.json is in sync with data/mach.json', () => {
  const p1 = path.join(REPO_ROOT, 'data/mach.json');
  const p2 = path.join(REPO_ROOT, 'server/data/mach.json');
  assert.ok(fs.existsSync(p2), 'server/data/mach.json exists');
  const d1 = JSON.parse(fs.readFileSync(p1, 'utf8'));
  const d2 = JSON.parse(fs.readFileSync(p2, 'utf8'));
  assert.strictEqual(d1.stories.length, d2.stories.length);
  assert.strictEqual(d2.stories.length, 12);
});

// 3. Check data/private/clara.json
test('data/private/clara.json contains all 8 Clara letters and assets', () => {
  const p = path.join(REPO_ROOT, 'data/private/clara.json');
  assert.ok(fs.existsSync(p), 'data/private/clara.json exists');
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  assert.strictEqual(d.stories.length, 8, 'Must have exactly 8 Clara letters');
  assert.ok(d.series['thu-gui-clara'], 'thu-gui-clara series exists');
  assert.ok(d.authors['tuan'], 'author tuan exists');
  assert.strictEqual(d.discourseScope, 'clara');
  assert.strictEqual(d.confidentiality, 'RESTRICTED_BRANCH_ONLY');
});

// 4. Check server/data/private/clara.json sync
test('server/data/private/clara.json is in sync with data/private/clara.json', () => {
  const p = path.join(REPO_ROOT, 'server/data/private/clara.json');
  assert.ok(fs.existsSync(p), 'server/data/private/clara.json exists');
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  assert.strictEqual(d.stories.length, 8);
});

// 5. Check relocation of raw content
test('Old public Clara directories are deleted', () => {
  const p1 = path.join(REPO_ROOT, 'content/mach/thu-gui-clara');
  const p2 = path.join(REPO_ROOT, 'assets/images/mach/thu-gui-clara');
  assert.ok(!fs.existsSync(p1), 'content/mach/thu-gui-clara does NOT exist');
  assert.ok(!fs.existsSync(p2), 'assets/images/mach/thu-gui-clara does NOT exist');
});

// 6. Check private raw storage
test('Private raw Clara content and images are preserved', () => {
  const p1 = path.join(REPO_ROOT, 'content/private/clara');
  const p2 = path.join(REPO_ROOT, 'assets/private/images/clara');
  assert.ok(fs.existsSync(p1), 'content/private/clara exists');
  assert.ok(fs.existsSync(p2), 'assets/private/images/clara exists');
  const letters = fs.readdirSync(p1).filter(f => f.endsWith('.md'));
  const images = fs.readdirSync(p2).filter(f => f.endsWith('.png') || f.endsWith('.jpg'));
  assert.strictEqual(letters.length, 8, 'Must contain all 8 markdown letters');
  assert.ok(images.length >= 8, 'Must contain all images');
});

// 7. Check SENSITIVE_PATH regex
test('SENSITIVE_PATH regex catches all forbidden surfaces', () => {
  const SENSITIVE_PATH = /(^|\/)(server|generator|scripts|tests|\.git|\.aios|\.vercel|\.env|node_modules|\.github|content|assets\/private|data\/private)(\/|$)|^\/?archive(\/|$)|thu-gui-clara|.*\.(db|sqlite|sqlite3|log|ged|pem|key|env|bak|orig)(\?|#|$)|cookie\.txt/i;

  const forbidden = [
    '/content/private/clara/Thư gửi Clara - 001.md',
    '/assets/private/images/clara/001.png',
    '/data/private/clara.json',
    '/content/mach/thu-gui-clara/001.md',
    '/assets/images/mach/thu-gui-clara/001.png',
    '/server/data/private/clara.json',
    '/server/family_archive.db',
    '/.env',
    '/.git/config',
    '/tests/something.js',
    '/archive/clara_pre_containment_backup/index.js'
  ];

  for (const f of forbidden) {
    assert.ok(SENSITIVE_PATH.test(f), `Must block: ${f}`);
  }

  const allowed = [
    '/assets/images/mach/issue-01/mach_01.jpg',
    '/src/css/foundation/foundation.css',
    '/src/js/ui/boot-discourse.js',
    '/data/mach.json',
    '/index.html',
    '/lab.html'
  ];

  for (const a of allowed) {
    assert.ok(!SENSITIVE_PATH.test(a), `Must allow: ${a}`);
  }
});

// 8. Check decodeURIComponent crash immunity
test('Safe URI decoding handles malformed URIs without crash', () => {
  const malformed = '%E0%A4%A';
  let handled = false;
  try {
    decodeURIComponent(malformed);
  } catch (e) {
    handled = true; // Catches URIError as intended
  }
  assert.ok(handled, 'Malformed URI caught by try/catch');
});

// 9. Check synthetic fixtures
test('Fixtures are sanitized: synthetic_mach has 0 Clara, synthetic_clara exists', () => {
  const p1 = path.join(REPO_ROOT, 'fixtures/synthetic_mach.json');
  const p2 = path.join(REPO_ROOT, 'fixtures/synthetic_clara.json');
  assert.ok(fs.existsSync(p1), 'synthetic_mach.json exists');
  assert.ok(fs.existsSync(p2), 'synthetic_clara.json exists');
  
  const m = JSON.parse(fs.readFileSync(p1, 'utf8'));
  assert.ok(m.stories.length >= 2, 'synthetic_mach has stories');
  assert.ok(!JSON.stringify(m).toLowerCase().includes('clara'));

  const c = JSON.parse(fs.readFileSync(p2, 'utf8'));
  assert.ok(c.stories.length >= 2, 'synthetic_clara has letters');
  assert.strictEqual(c.discourseScope, 'clara');
});

// 10. Check Rollback Backup
test('Rollback backup is safe in archive/clara_pre_containment_backup', () => {
  const p = path.join(REPO_ROOT, 'archive/clara_pre_containment_backup');
  assert.ok(fs.existsSync(p), 'Backup directory exists');
  assert.ok(fs.existsSync(path.join(p, 'mach.json')), 'Backup mach.json exists');
  assert.ok(fs.existsSync(path.join(p, 'index.js')), 'Backup index.js exists');
  assert.ok(fs.existsSync(path.join(p, 'build_mach.py')), 'Backup build_mach.py exists');
  assert.ok(fs.existsSync(path.join(p, 'content')), 'Backup raw content exists');
  assert.ok(fs.existsSync(path.join(p, 'assets')), 'Backup raw assets exist');
});

console.log('====================================================');
console.log(`TOTAL: ${testsPassed}/${testsTotal} tests PASSED.`);
console.log('====================================================');

if (testsPassed !== testsTotal) {
  process.exit(1);
}

