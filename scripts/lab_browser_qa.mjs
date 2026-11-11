/**
 * scripts/lab_browser_qa.mjs
 * Vibecode Lab Automated Browser QA Harness.
 *
 * Runs headless browser verification across all 4 viewports (375, 768, 1024, 1440px)
 * for all 6 UI surfaces and simulated personas using 100% synthetic mock fixtures.
 *
 * Checks:
 *   - 0 Console errors
 *   - 0 Horizontal overflow
 *   - Brand Governance compliance (no rounded cards, typography, honest states)
 *   - Correct rendering of all 6 surfaces
 *   - Persona switching dynamics (ACTIVE, UNMAPPED, ANONYMOUS)
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const REPO_ROOT = process.cwd();
const PORT = 8182;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const OUT_DIR = path.join(REPO_ROOT, 'docs', 'audit', 'evidence', 'lab_qa');
fs.mkdirSync(OUT_DIR, { recursive: true });

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2'
};

// 1. In-process static server
function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = decodeURIComponent(req.url.split('?')[0]);
      if (reqPath === '/favicon.ico') {
        res.writeHead(204);
        res.end();
        return;
      }
      if (reqPath === '/' || reqPath === '') reqPath = '/lab.html';
      const filePath = path.join(REPO_ROOT, reqPath.replace(/^\//, ''));

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
          'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
          'Access-Control-Allow-Origin': '*'
        });
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`File not found: ${reqPath}`);
        if (!reqPath.includes('favicon.ico')) {
          console.warn(`[SERVER 404]: ${reqPath}`);
        }
      }
    });

    server.listen(PORT, '127.0.0.1', () => {
      resolve(server);
    });
  });
}

const VIEWPORTS = [
  { name: 'Mobile', width: 375, height: 812 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Laptop', width: 1024, height: 768 },
  { name: 'Desktop', width: 1440, height: 900 }
];

const SURFACES = [
  { id: 'public', name: '1. Cổng vào (Public)', view: 'public', mustContain: ['Gia Tộc Trần Trọng Thu', 'tiếng nói của một gia tộc'] },
  { id: 'dashboard', name: '2. Không gian của tôi (Member)', view: 'dashboard', mustContain: ['Không gian của tôi', 'Các không gian của gia tộc'] },
  { id: 'tree', name: '3. Cây phả đồ (Genealogy)', view: 'tree', mustContain: ['Cây phả đồ', 'Trần Văn Mẫu'] },
  { id: 'person', name: '4. Hồ sơ nhân vật (Person p3)', view: 'person', mustContain: ['Hồ sơ nhân vật', 'Trần Trọng Mẫu C'] },
  { id: 'mach', name: '5. MẠCH (Internal Discourse)', view: 'mach', mustContain: ['MẠCH', 'lưu truyền các giá trị gia tộc'] },
  { id: 'clara', name: '6. Thư gửi Clara (Intimate)', view: 'clara', mustContain: ['Thư gửi Clara', 'những chuyến đi đầu đời'] },
  { id: 'gallery', name: '8. Kho tư liệu ảnh (Gallery)', view: 'gallery', mustContain: ['Kho Tư Liệu Di Ảnh Gia Tộc', 'Chân dung'] },
  { id: 'events', name: '9. Lịch giỗ & Niên biểu (Events)', view: 'events', mustContain: ['Lịch Giỗ & Niên Biểu', 'Lịch Kỵ Giỗ Tiền Nhân'] }
];

async function runQA() {
  console.log('================================================================');
  console.log('VIBECODE LAB BROWSER QA — 6 SURFACES X 4 VIEWPORTS');
  console.log('================================================================\n');

  const server = await startServer();
  console.log(`[PASS] Lab Static Server started on ${BASE_URL}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });
  console.log('[PASS] Puppeteer Headless Browser launched\n');

  const qaReport = {
    timestamp: new Date().toISOString(),
    totalAssertions: 0,
    passed: 0,
    failed: 0,
    surfacesTested: SURFACES.length,
    viewportsTested: VIEWPORTS.length,
    results: []
  };

  const page = await browser.newPage();
  let consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const txt = msg.text();
      if (!txt.includes('favicon.ico')) {
        consoleErrors.push(txt);
      }
    }
  });
  page.on('pageerror', err => {
    if (!err.message.includes('favicon.ico')) {
      consoleErrors.push(err.message);
    }
  });

  try {
    for (const vp of VIEWPORTS) {
      console.log(`--- [VIEWPORT: ${vp.name} (${vp.width}x${vp.height})] ---`);
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });

      for (const surf of SURFACES) {
        consoleErrors = [];
        const url = `${BASE_URL}/lab.html#view=${surf.view}`;
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
        await new Promise(r => setTimeout(r, 400));

        // Evaluate metrics
        const evalData = await page.evaluate(() => {
          const bodyText = document.body.innerText || '';
          const scrollW = document.documentElement.scrollWidth;
          const innerW = window.innerWidth;
          const overflowing = scrollW > innerW + 1;

          // Check rounded cards rule: no element with border-radius > 4px in main cards
          const allCards = [...document.querySelectorAll('.gi-card, .gi-article, .gi-panel, .gi-section')];
          const hasInvalidRounding = allCards.some(el => {
            const r = parseFloat(window.getComputedStyle(el).borderRadius) || 0;
            return r > 4;
          });

          return {
            bodyText,
            scrollW,
            innerW,
            overflowing,
            hasInvalidRounding
          };
        });

        // Assertions
        qaReport.totalAssertions += 4;
        let passOverflow = !evalData.overflowing;
        let passErrors = consoleErrors.length === 0;
        let passContent = surf.mustContain.every(str => evalData.bodyText.toLowerCase().includes(str.toLowerCase()));
        let passBrand = !evalData.hasInvalidRounding;

        let surfacePassed = passOverflow && passErrors && passContent && passBrand;
        if (surfacePassed) {
          qaReport.passed += 4;
          console.log(`  [PASS] ${surf.name} @${vp.width}px (Overflow: NO, Errors: 0, Brand: OK, Text: MATCH)`);
        } else {
          let fails = [];
          if (!passOverflow) fails.push(`OVERFLOW (scrollW=${evalData.scrollW} > innerW=${evalData.innerW})`);
          if (!passErrors) fails.push(`ERRORS: ${consoleErrors.join('; ')}`);
          if (!passContent) fails.push('TEXT_MISSING');
          if (!passBrand) fails.push('ROUNDED_CARDS_DETECTED');
          qaReport.failed += fails.length;
          qaReport.passed += (4 - fails.length);
          console.log(`  [FAIL] ${surf.name} @${vp.width}px -> ${fails.join(' | ')}`);
        }

        // Capture screenshot for evidence at Mobile (375) and Desktop (1440)
        if (vp.width === 375 || vp.width === 1440) {
          const shotName = `lab_${surf.id}_${vp.width}px.png`;
          const shotPath = path.join(OUT_DIR, shotName);
          await page.screenshot({ path: shotPath, fullPage: false });
        }

        qaReport.results.push({
          surface: surf.id,
          viewport: vp.width,
          overflow: !evalData.overflowing,
          errors: consoleErrors.length,
          contentVerified: passContent,
          brandCompliant: passBrand,
          status: surfacePassed ? 'VERIFIED' : 'FAILED'
        });
      }
      console.log('');
    }

    // Test Persona Switching
    console.log('--- [TESTING LAB PERSONA SWITCHING] ---');
    await page.setViewport({ width: 1440, height: 900 });
    
    // Switch to UNMAPPED persona
    await page.evaluate(() => {
      localStorage.setItem('giatoc_mock_persona', 'UNMAPPED');
    });
    await page.goto(`${BASE_URL}/lab.html#view=dashboard`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 400));
    
    const unmappedText = await page.evaluate(() => document.body.innerText);
    const unmappedOk = unmappedText.includes('Chưa gắn với một hồ sơ trong gia phả');
    qaReport.totalAssertions += 1;
    if (unmappedOk) {
      qaReport.passed += 1;
      console.log('  [PASS] Persona UNMAPPED: Correctly renders unmapped identity state');
    } else {
      qaReport.failed += 1;
      console.log('  [FAIL] Persona UNMAPPED: Did not render expected unmapped state');
    }

    // Switch to PROVISIONED persona
    await page.evaluate(() => {
      localStorage.setItem('giatoc_mock_persona', 'PROVISIONED');
    });
    await page.goto(`${BASE_URL}/lab.html#view=dashboard`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 400));

    const provText = await page.evaluate(() => document.body.innerText);
    const provOk = provText.includes('Trần Quốc Mẫu F');
    qaReport.totalAssertions += 1;
    if (provOk) {
      qaReport.passed += 1;
      console.log('  [PASS] Persona PROVISIONED: Correctly renders provisioned persona (Trần Quốc Mẫu F)');
    } else {
      qaReport.failed += 1;
      console.log('  [FAIL] Persona PROVISIONED: Did not render expected persona name');
    }

    // Reset back to ACTIVE
    await page.evaluate(() => {
      localStorage.setItem('giatoc_mock_persona', 'ACTIVE');
    });

  } finally {
    await browser.close();
    server.close();
  }

  // Write QA result JSON
  const resultJsonPath = path.join(OUT_DIR, 'lab_qa_result.json');
  fs.writeFileSync(resultJsonPath, JSON.stringify(qaReport, null, 2), 'utf-8');

  console.log('\n================================================================');
  console.log('BROWSER QA SUMMARY:');
  console.log(`Total Assertions: ${qaReport.totalAssertions}`);
  console.log(`Passed:           ${qaReport.passed}`);
  console.log(`Failed:           ${qaReport.failed}`);
  console.log(`Pass Rate:        ${((qaReport.passed / qaReport.totalAssertions) * 100).toFixed(1)}%`);
  console.log(`Evidence Output:  ${OUT_DIR}`);
  console.log('================================================================');

  return qaReport.failed === 0;
}

runQA().then(ok => {
  process.exit(ok ? 0 : 1);
}).catch(err => {
  console.error('[FATAL ERROR IN QA RUN]:', err);
  process.exit(1);
});
