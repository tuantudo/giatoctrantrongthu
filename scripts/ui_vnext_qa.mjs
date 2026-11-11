/**
 * GIATOC UI SYSTEM vNEXT — browser QA harness.
 *
 * PURPOSE: real-browser verification of the vNEXT surfaces. This exists because
 * v0.2 shipped UNVERIFIED claims; static CSS analysis is not visual QA.
 *
 * RUN:  node scripts/ui_vnext_qa.mjs
 *   expects the app on :3000, and optionally an auth-enabled instance on :3100.
 *
 * AUTH: the authenticated leg uses the project's OWN dev auto-login against a
 * THROWAWAY instance started with DEV_AUTO_LOGIN in that process only:
 *   DEV_AUTO_LOGIN=true NODE_ENV=development PORT=3100 node server/index.js
 * Nothing is written to .env or any persistent config. If that instance is not
 * running, authenticated legs are reported NOT VERIFIED (never silently skipped).
 *
 * OUTPUT: docs/audit/evidence/ui_vnext/  (screenshots + qa_result.json)
 */
import puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';

/** Browser resolution: prefer puppeteer's own bundled Chrome (stable headless).
 *  Override with GIATOC_CHROME=/path/to/Chrome when a specific build is wanted. */
const CHROME = process.env.GIATOC_CHROME || undefined;
const PUBLIC_BASE = 'http://127.0.0.1:3000';
const AUTH_BASE = 'http://127.0.0.1:3100';
const WIDTHS = [375, 768, 1024, 1440];
const OUT = path.resolve('docs/audit/evidence/ui_vnext');
const SHOT_WIDTHS = [375, 1440];      // keep evidence small but meaningful

fs.mkdirSync(OUT, { recursive: true });

const results = [];
/** status: VERIFIED | FAILED | NOT VERIFIED | NOT AVAILABLE */
function log(name, status, detail) { results.push({ name, status, detail }); }
const ok = (n, c, d) => log(n, c ? 'VERIFIED' : 'FAILED', d);
const httpOk = (s) => s === 200 || s === 304;

const browserState = { browser: null };

async function getBrowser() {
  if (!browserState.browser || !browserState.browser.connected) {
    browserState.browser = await puppeteer.launch({
      headless: true,
      executablePath: CHROME,
      args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });
    log('harness / browser launched', 'VERIFIED', CHROME || 'puppeteer bundled Chrome');
  }
  return browserState.browser;
}

let page = null;
let consoleErrors = [];
let http404s = [];
const attach = (p) => {
  p.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  p.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`));
  // Capture the URL of failing requests so a 404 can be attributed, not guessed.
  p.on('response', (r) => { if (r.status() === 404) http404s.push(r.url()); });
  return p;
};

/** Chrome drops the renderer target during long screenshot runs. Recreate the
 *  page (and the browser if the whole connection went away) rather than aborting
 *  verification — a dropped page is NOT a product failure. */
async function ensurePage() {
  const browser = await getBrowser();
  if (!page || page.isClosed()) {
    page = attach(await browser.newPage());
    consoleErrors = [];
    http404s = [];
    log('harness / page recreated', 'VERIFIED', 'previous target was unavailable');
  }
  return page;
}

async function visit(url, width, waitFor = '.gi-pageheader') {
  await ensurePage();
  await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
  const res = await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
  await page.waitForFunction(waitFor, { timeout: 12000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 500));
  return res;
}
const bodyText = () => page.evaluate(() => document.body.innerText);
const metrics = () => page.evaluate(() => ({
  scrollW: document.documentElement.scrollWidth,
  innerW: window.innerWidth,
  overflowing: document.documentElement.scrollWidth > window.innerWidth + 1
}));

/** Screenshots are evidence, not assertions: a capture failure must never
 *  abort the run. It is recorded as NOT AVAILABLE instead. */
async function shoot(name) {
  try {
    await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
    log(`evidence / screenshot ${name}.png`, 'VERIFIED', 'captured');
  } catch (e) {
    log(`evidence / screenshot ${name}.png`, 'NOT AVAILABLE', `capture failed: ${e.message}`);
  }
}

/* ---------------------------------------------------------- PUBLIC (real) */
for (const w of WIDTHS) {
  process.stderr.write(`[qa] public @${w} start\n`);
  const res = await visit(`${PUBLIC_BASE}/`, w);
  ok(`public / http status @${w}`, httpOk(res.status()), `status=${res.status()}`);
  const t = await bodyText();
  const low = t.toLowerCase();

  /* --- 1. Family identity rõ ràng ------------------------------------- */
  ok(`public / family identity @${w}`, t.includes('Gia Tộc Trần Trọng Thu'), 'family name is the page identity');
  ok(`public / threshold line @${w}`, /cửa vào của gia tộc/i.test(t), 'declares itself as the gate');

  /* --- 2. Family Gate rõ ràng ----------------------------------------- */
  ok(`public / gate question @${w}`, /bạn là người trong gia tộc/i.test(t), 'recognises the member');
  ok(`public / gate door @${w}`, /vào không gian của gia tộc/i.test(t), 'door is a semantic entrance, not a bare login button');
  ok(`public / gate door explains sign-in @${w}`, /đăng nhập để xem/i.test(t), 'visitor knows the door leads to sign-in');

  /* --- 3. Family Voice zone present, honest when empty ------------------ */
  ok(`public / family voice zone @${w}`, /tiếng nói của gia tộc/i.test(t), 'external voice zone exists');
  ok(`public / family voice uses semantic state @${w}`, await page.evaluate(() => {
    const z = document.querySelector('#zone-voice .gi-voice__absence');
    return !!z && z.getAttribute('data-state') === 'not-available';
  }), 'honest state, not fabricated content');

  /* --- UX-02: no dashed "unfinished feature" box on Public --- */
  ok(`public / voice absence not a dashed box @${w}`, await page.evaluate(() => {
    const z = document.querySelector('#zone-voice .gi-voice__absence');
    if (!z) return false;
    const cs = getComputedStyle(z);
    return cs.borderTopStyle !== 'dashed' && cs.borderStyle !== 'dashed';
  }), 'editorial treatment, not a warning panel');

  /* --- UX-03: family name must not be repeated across the first screen --- */
  const nameHits = await page.evaluate(() => {
    const hits = [];
    const walker = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      if ((n.nodeValue || '').includes('Gia Tộc Trần Trọng Thu')) {
        hits.push(n.parentElement ? (n.parentElement.className || n.parentElement.tagName) : '?');
      }
    }
    return hits;
  });
  ok(`public / family name stated once in main @${w}`, nameHits.length === 1,
    `occurrences=${nameHits.length} in ${JSON.stringify(nameHits)}`);

  /* --- 4/5. Không leakage, không technical audit prose ----------------- */
  ok(`public / no internal discourse names @${w}`, !/MẠCH|Clara/i.test(t), 'Public must not name internal scopes');
  ok(`public / no genealogy surface @${w}`, !/Gia Phả|Cây phả đồ|Hồ sơ nhân vật/i.test(t), 'no genealogy / person records');
  const BANNED = /open question|architecture|ui system|backend dependency|phạm vi trang công khai|có ở đây|không ở đây/i;
  ok(`public / no technical audit prose @${w}`, !BANNED.test(t), 'no diagnostic prose');
  ok(`public / no admin exposure @${w}`, !/admin|quản trị|bảng điều khiển/i.test(low), 'no admin surface');

  /* --- 6. Không fabricated family content ------------------------------ */
  ok(`public / no fabricated dates @${w}`, !/\b(18|19|20)\d{2}\b/.test(t), 'no invented years');

  /* --- 7. Đường vào Member Space --------------------------------------- */
  ok(`public / member door href @${w}`, await page.evaluate(() => {
    const door = document.querySelector('[data-gate="member-space"]');
    return !!door && door.getAttribute('href') === '/login';
  }), 'door points at /login');

  /* --- UX-01: ContextBar must be ABSENT on Public, PRESENT on Member --- */
  const pCtx = await page.evaluate(() => {
    const bar = document.querySelector('.gi-contextbar');
    return {
      present: !!bar,
      h1: document.querySelectorAll('main h1').length,
      h1Text: (document.querySelector('main h1') || {}).textContent || '',
      markers: document.querySelectorAll('.gi-sectionmark__index').length,
      img: document.querySelectorAll('main img').length,
      imgOk: [...document.querySelectorAll('main img')].every((i) => i.complete && i.naturalWidth > 0)
    };
  });
  ok(`public / context bar removed @${w}`, pCtx.present === false, 'application chrome off the front door');
  ok(`public / exactly one h1 @${w}`, pCtx.h1 === 1, `h1 count=${pCtx.h1}`);
  ok(`public / h1 is the family name @${w}`, /Gia Tộc Trần Trọng Thu/.test(pCtx.h1Text), `h1="${pCtx.h1Text}"`);
  ok(`public / section rhythm markers @${w}`, pCtx.markers === 3, `markers=${pCtx.markers}`);
  ok(`public / real assets load @${w}`, pCtx.imgOk, `images=${pCtx.img}`);
  const m = await metrics();
  ok(`public / no horizontal overflow @${w}`, !m.overflowing, `scrollW=${m.scrollW} innerW=${m.innerW}`);
  if (SHOT_WIDTHS.includes(w)) await shoot(`public_${w}`);
}

/* ------------------------------------------- AUTH surfaces (throwaway) */
const authUp = await fetch(`${AUTH_BASE}/login`, { redirect: 'manual' }).then(() => true).catch(() => false);
if (!authUp) {
  for (const s of ['/me', '/me/mach', '/me/clara', '/me/family-spaces', '/me/tree/person/p1']) {
    log(`auth ${s}`, 'NOT VERIFIED', `auth instance not running on :3100 (${AUTH_BASE})`);
  }
} else {
  await visit(`${AUTH_BASE}/login`, 1440, 'body');
  const landed = page.url();
  ok('auth / session established', landed.includes('/me'), `landed=${landed}`);

  const SURFACES = [
    { path: '/me', key: 'member dashboard',
      must: ['tài khoản', 'nhân vật', 'cây phả đồ', 'nguồn gốc dữ liệu', 'nas'],
      forbid: [/bảng điều khiển/i],
      ctx: { context: 'member', level: 'space', dataType: 'identity' } },
    { path: '/me/mach', key: 'MACH surface',
      must: ['mạch', 'nội bộ', 'backend dependency', 'không phải tạp chí công khai'],
      ctx: { context: 'editorial', discourse: 'mach', discourseKind: 'internal', dataType: 'content' } },
    { path: '/me/clara', key: 'Clara surface',
      must: ['thư gửi clara', 'không phải một chuyên mục của mạch', 'backend dependency'],
      ctx: { context: 'editorial', discourse: 'clara', discourseKind: 'intimate', dataType: 'content' } },
    { path: '/me/family-spaces', key: 'family space',
      must: ['không gian gia đình', 'backend dependency'],
      ctx: { context: 'member', level: 'space' } },
    { path: '/me/tree/person/p1', key: 'person detail',
      must: ['cây phả đồ', 'chuyển tiếp'],
      ctx: { context: 'genealogy', level: 'genealogy', dataType: 'canonical-genealogy' } }
  ];

  for (const s of SURFACES) {
    for (const w of WIDTHS) {
      const before = consoleErrors.length;
      const res = await visit(`${AUTH_BASE}${s.path}`, w);
      ok(`${s.key} / http status @${w}`, httpOk(res.status()), `status=${res.status()} url=${page.url()}`);
      const t = (await bodyText()).toLowerCase();
      for (const needle of s.must) {
        ok(`${s.key} / contains "${needle}" @${w}`, t.includes(needle.toLowerCase()), 'semantic assertion');
      }
      for (const rx of (s.forbid || [])) {
        ok(`${s.key} / does not match ${rx} @${w}`, !rx.test(t), 'terminology guard');
      }

      /* --- v0.4 STABILITY: context identity must be machine-checkable ------ */
      const ctxDom = await page.evaluate(() => {
        const bar = document.querySelector('.gi-contextbar');
        if (!bar) return null;
        const states = [...document.querySelectorAll('[data-state]')].map((n) => n.getAttribute('data-state'));
        return {
          context: bar.dataset.context,
          level: bar.dataset.level,
          discourse: bar.dataset.discourse || null,
          discourseKind: bar.dataset.discourseKind || null,
          dataType: bar.dataset.dataType,
          access: bar.dataset.access,
          h1: document.querySelectorAll('main h1').length,
          statePanel: !!document.querySelector('.gi-state'),
          states: [...new Set(states)]
        };
      });
      ok(`${s.key} / has context bar @${w}`, ctxDom !== null, 'context identity must be present');
      if (ctxDom) {
        for (const [k, v] of Object.entries(s.ctx || {})) {
          ok(`${s.key} / context ${k} == ${v} @${w}`, ctxDom[k] === v, `got=${ctxDom[k]}`);
        }
        ok(`${s.key} / exactly one h1 @${w}`, ctxDom.h1 === 1, `h1 count=${ctxDom.h1}`);
      }
      const m = await metrics();
      ok(`${s.key} / no horizontal overflow @${w}`, !m.overflowing, `scrollW=${m.scrollW} innerW=${m.innerW}`);
      const real404 = http404s.filter((u) => !/favicon\.ico/i.test(u));
      // The favicon 404 also emits a generic console line. Drop it ONLY when
      // there is no other 404 to explain it — otherwise a real one is hidden.
      const fresh = consoleErrors.slice(before)
        .filter((e) => !(real404.length === 0 && /404 \(Not Found\)/.test(e)));
      ok(`${s.key} / no failed request @${w}`, real404.length === 0,
        real404.length ? `404: ${real404.join(', ')}` : 'no non-favicon 404 responses');
      ok(`${s.key} / no script error @${w}`, fresh.length === 0,
        fresh.length ? fresh.slice(0, 2).join(' | ') : 'no console/page errors');
      if (http404s.some((u) => /favicon\.ico/i.test(u))) {
        log(`${s.key} / favicon @${w}`, 'NOT AVAILABLE',
          'browser default /favicon.ico is 404 — pre-existing, no placeholder asset shipped');
      }
      if (SHOT_WIDTHS.includes(w)) {
        const slug = s.path.replace(/\//g, '').slice(0, 14) || 'me';
        await shoot(`${slug}_${w}`);
      }
    }
  }

  const res = await visit(`${AUTH_BASE}/me/tree`, 1440, 'body');
  ok('legacy /me/tree still reachable', httpOk(res.status()), `status=${res.status()}`);
}

if (browserState.browser) await browserState.browser.close().catch(() => {});

/* Coverage guard: the report may only claim a width if it was actually exercised. */
const exercised = new Set(results.map((r) => (r.name.match(/@(\d+)/) || [])[1]).filter(Boolean));
for (const w of WIDTHS) {
  log(`coverage / width ${w} exercised`, exercised.has(String(w)) ? 'VERIFIED' : 'FAILED',
    exercised.has(String(w)) ? 'assertions recorded at this width' : 'no assertions recorded — NOT VERIFIED');
}

const tally = results.reduce((acc, r) => { acc[r.status] = (acc[r.status] || 0) + 1; return acc; }, {});
const summary = {
  generatedAt: new Date().toISOString(),
  engine: 'Google Chrome (headless) via puppeteer',
  widths: WIDTHS,
  screenshotWidths: SHOT_WIDTHS,
  totals: tally,
  results
};
fs.writeFileSync(path.join(OUT, 'qa_result.json'), JSON.stringify(summary, null, 2));

console.log(JSON.stringify(tally, null, 1));
console.log('FAILURES:');
results.filter((r) => r.status === 'FAILED').forEach((r) => console.log(' -', r.name, '::', r.detail));
console.log('NOT VERIFIED:');
results.filter((r) => r.status === 'NOT VERIFIED').forEach((r) => console.log(' -', r.name, '::', r.detail));