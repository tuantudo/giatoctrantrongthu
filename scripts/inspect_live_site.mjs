/**
 * scripts/inspect_live_site.mjs
 * Live Product Forensic Inspection for https://giatoctrantrongthu.com
 *
 * Runs headless browser to examine live pages, navigation, console errors,
 * network calls, API responses, and captures screenshots for evidence.
 */

import puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';

const LIVE_URL = 'https://giatoctrantrongthu.com';
const OUT_DIR = path.join(process.cwd(), 'docs', 'audit', 'evidence', 'live_inspection');
fs.mkdirSync(OUT_DIR, { recursive: true });

const ROUTES_TO_TEST = [
  { path: '/', name: 'home', hash: '#/' },
  { path: '/#mach', name: 'mach', hash: '#/mach' },
  { path: '/#tu-lieu', name: 'tu_lieu', hash: '#/tu-lieu' },
  { path: '/#gia-pha', name: 'gia_pha', hash: '#/gia-pha' },
  { path: '/#lich', name: 'lich', hash: '#/lich' },
  { path: '/#tim-kiem', name: 'tim_kiem', hash: '#/tim-kiem' },
  { path: '/#tu-cach-thanh-vien', name: 'tu_cach_thanh_vien', hash: '#/tu-cach-thanh-vien' },
  { path: '/#thanh-vien', name: 'member_space_placeholder', hash: '#/thanh-vien' },
  { path: '/login', name: 'login_direct', isDirect: true },
  { path: '/admin', name: 'admin_direct', isDirect: true },
  { path: '/admin/login.html', name: 'admin_login_direct', isDirect: true },
  { path: '/me', name: 'me_direct', isDirect: true },
  { path: '/me/tree', name: 'me_tree_direct', isDirect: true }
];

const APIS_TO_TEST = [
  '/api/genealogy.json',
  '/api/mach.json',
  '/api/media.json',
  '/api/person_media.json',
  '/api/member/profile',
  '/api/auth/status',
  '/data/family_tree_snapshot.json',
  '/data/mach_snapshot.json'
];

async function runLiveInspection() {
  console.log(`Starting live forensic inspection for: ${LIVE_URL}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const inspectionReport = {
    timestamp: new Date().toISOString(),
    liveUrl: LIVE_URL,
    routes: [],
    apis: [],
    consoleErrors: [],
    failedRequests: [],
    overallObservations: {}
  };

  page.on('console', msg => {
    if (msg.type() === 'error') {
      inspectionReport.consoleErrors.push({ url: page.url(), text: msg.text() });
    }
  });

  page.on('requestfailed', req => {
    inspectionReport.failedRequests.push({
      url: req.url(),
      errorText: req.failure() ? req.failure().errorText : 'unknown'
    });
  });

  // 1. Inspect direct HTTP APIs and static json files on live
  console.log('\n--- 1. Testing Live APIs and Data Endpoints ---');
  for (const endpoint of APIS_TO_TEST) {
    const fullUrl = `${LIVE_URL}${endpoint}`;
    try {
      const res = await page.goto(fullUrl, { waitUntil: 'networkidle2', timeout: 10000 });
      const status = res.status();
      const cType = res.headers()['content-type'] || '';
      let isJson = false;
      let dataSample = null;
      let textLen = 0;

      try {
        const text = await res.text();
        textLen = text.length;
        if (cType.includes('application/json')) {
          const parsed = JSON.parse(text);
          isJson = true;
          dataSample = Object.keys(parsed);
        }
      } catch (e) {
        // ignore parse error
      }

      console.log(`[API/DATA] ${endpoint} -> HTTP ${status} | Type: ${cType} | Len: ${textLen}`);
      inspectionReport.apis.push({
        endpoint,
        status,
        contentType: cType,
        isJson,
        length: textLen,
        sampleKeys: dataSample
      });
    } catch (err) {
      console.log(`[API/DATA FAIL] ${endpoint} -> ${err.message}`);
      inspectionReport.apis.push({
        endpoint,
        status: 'ERROR',
        error: err.message
      });
    }
  }

  // 2. Inspect Routes and Views
  console.log('\n--- 2. Inspecting Live UI Routes and Views ---');
  for (const item of ROUTES_TO_TEST) {
    const targetUrl = item.isDirect ? `${LIVE_URL}${item.path}` : `${LIVE_URL}/${item.hash}`;
    console.log(`Testing Route: ${item.name} (${targetUrl})`);

    try {
      const res = await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 15000 });
      const status = res ? res.status() : 'client-routed';

      // Small pause for client render
      await new Promise(r => setTimeout(r, 600));

      const pageState = await page.evaluate(() => {
        const title = document.title;
        const visibleHeading = document.querySelector('h1, h2')?.innerText || '';
        const bodySnippet = document.body.innerText.slice(0, 300).replace(/\s+/g, ' ');
        const activeNav = document.querySelector('.pub-nav a[aria-current="page"]')?.innerText || '';
        const views = [...document.querySelectorAll('[data-view]')].map(v => ({
          view: v.getAttribute('data-view'),
          hidden: v.hasAttribute('hidden')
        }));

        // Check stats in intro
        const statInd = document.getElementById('statInd')?.innerText;
        const statFam = document.getElementById('statFam')?.innerText;
        const statMem = document.getElementById('statMem')?.innerText;

        return {
          title,
          visibleHeading,
          bodySnippet,
          activeNav,
          views,
          stats: { statInd, statFam, statMem }
        };
      });

      const shotPath = path.join(OUT_DIR, `live_${item.name}.png`);
      await page.screenshot({ path: shotPath, fullPage: false });

      console.log(`  -> Status: ${status} | Heading: "${pageState.visibleHeading}" | ActiveNav: "${pageState.activeNav}"`);
      if (pageState.stats.statInd) {
        console.log(`  -> Live stats displayed: Ind: ${pageState.stats.statInd}, Fam: ${pageState.stats.statFam}, Mem: ${pageState.stats.statMem}`);
      }

      inspectionReport.routes.push({
        name: item.name,
        targetUrl,
        httpStatus: status,
        screenshot: `docs/audit/evidence/live_inspection/live_${item.name}.png`,
        pageState
      });
    } catch (err) {
      console.log(`  -> Error loading route: ${err.message}`);
      inspectionReport.routes.push({
        name: item.name,
        targetUrl,
        error: err.message
      });
    }
  }

  // 3. Test interactive elements on Home
  console.log('\n--- 3. Testing Interactive Elements on Live Home ---');
  try {
    await page.goto(`${LIVE_URL}/#/`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 500));

    // Test FAB assistant click
    const chatBtn = await page.$('#chatFab');
    if (chatBtn) {
      await chatBtn.click();
      await new Promise(r => setTimeout(r, 300));
      const panelVisible = await page.evaluate(() => {
        const p = document.getElementById('chatPanel');
        return p && !p.hasAttribute('hidden');
      });
      console.log(`  -> Chat FAB click toggles chatPanel: ${panelVisible}`);
      inspectionReport.overallObservations.chatPanelInteractive = panelVisible;
    }

    // Test search box interaction
    await page.goto(`${LIVE_URL}/#/tim-kiem`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 500));
    const searchInput = await page.$('#searchInput, input[type="search"]');
    if (searchInput) {
      await searchInput.type('Trần');
      await new Promise(r => setTimeout(r, 400));
      const searchResultsCount = await page.evaluate(() => {
        return document.querySelectorAll('.search-result-item, [data-search-result]').length;
      });
      console.log(`  -> Search input test for "Trần" returned results: ${searchResultsCount}`);
      inspectionReport.overallObservations.searchResultsCount = searchResultsCount;
    }
  } catch (e) {
    console.log(`  -> Interaction test error: ${e.message}`);
  }

  await browser.close();

  // Save report JSON
  const reportPath = path.join(OUT_DIR, 'live_inspection_result.json');
  fs.writeFileSync(reportPath, JSON.stringify(inspectionReport, null, 2), 'utf-8');
  console.log(`\nLive inspection completed. Report saved to: ${reportPath}`);
}

runLiveInspection().catch(err => {
  console.error('Fatal inspection error:', err);
  process.exit(1);
});

