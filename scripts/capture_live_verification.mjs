import puppeteer from 'puppeteer';
import path from 'node:path';
import fs from 'node:fs';

const BASE_URL = 'http://127.0.0.1:3000';
const LAB_URL = 'http://127.0.0.1:8888/lab.html';
const SHOTS_DIR = path.resolve('shots');

fs.mkdirSync(SHOTS_DIR, { recursive: true });

async function run() {
  console.log('🚀 Starting Runtime & Delivery Verification Harness...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // 1. Authenticate on Backend 3000
  console.log('🔑 Authenticating via dev auto-login...');
  await page.goto(`${BASE_URL}/login?force_auto=1`, { waitUntil: 'networkidle2' });
  console.log('Current URL after login redirect:', page.url());

  // 2. Step 1: Default Me-Centric Tree View
  console.log('🌳 Navigating to /me/tree...');
  await page.goto(`${BASE_URL}/me/tree`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('#pedigree-tree-container', { timeout: 10000 });
  await page.waitForSelector('.gi-pedigree__card--focus', { timeout: 10000 });
  
  // Wait a bit for layout rendering & images
  await new Promise(r => setTimeout(r, 1000));

  const focusName = await page.$eval('.gi-pedigree__card--focus .gi-pedigree__name', el => el.textContent.trim());
  console.log(`Focus person detected: ${focusName}`);

  const shotDefaultPath = path.join(SHOTS_DIR, 'tree_default.png');
  await page.screenshot({ path: shotDefaultPath, fullPage: false });
  console.log(`📸 Saved tree_default.png to ${shotDefaultPath}`);

  // 3. Step 2: Branch Drilldown
  console.log('🔍 Executing branch drilldown on child...');
  // Find a child button with branch expansion
  const branchBtnSelector = 'section.gi-pedigree__tier:last-child button.gi-pedigree__btn--primary';
  await page.waitForSelector(branchBtnSelector, { timeout: 5000 });
  
  const branchBtnText = await page.$eval(branchBtnSelector, el => el.textContent.trim());
  console.log(`Clicking branch button: "${branchBtnText}"`);
  await page.click(branchBtnSelector);

  // Wait for breadcrumbs to update
  await new Promise(r => setTimeout(r, 1000));
  await page.waitForSelector('.gi-pedigree__breadcrumbs', { timeout: 5000 });
  const breadcrumbText = await page.$eval('.gi-pedigree__breadcrumbs', el => el.textContent.trim());
  const newFocusName = await page.$eval('.gi-pedigree__card--focus .gi-pedigree__name', el => el.textContent.trim());
  console.log(`Updated Focus: ${newFocusName}`);
  console.log(`Lineage Breadcrumbs: ${breadcrumbText}`);

  const shotDrilldownPath = path.join(SHOTS_DIR, 'tree_drilldown.png');
  await page.screenshot({ path: shotDrilldownPath, fullPage: false });
  console.log(`📸 Saved tree_drilldown.png to ${shotDrilldownPath}`);

  // 4. Step 3: Archival List View Switcher
  console.log('📋 Switching to Archival List view...');
  // Click button "📋 Danh sách tra cứu"
  const listBtnSelector = '.gi-view-switcher button:last-child';
  await page.click(listBtnSelector);
  await page.waitForSelector('.gi-tree__search', { timeout: 5000 });
  await page.waitForSelector('.gi-tree__count', { timeout: 5000 });

  const countText = await page.$eval('.gi-tree__count', el => el.textContent.trim());
  console.log(`Archival count: ${countText}`);

  const shotListPath = path.join(SHOTS_DIR, 'archival_list.png');
  await page.screenshot({ path: shotListPath, fullPage: false });
  console.log(`📸 Saved archival_list.png to ${shotListPath}`);

  // 5. Step 4: Person Profile 6 Layers of @I1@
  console.log('👤 Navigating to /me/tree/person/@I1@...');
  await page.goto(`${BASE_URL}/me/tree/person/@I1@`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('#person-identity', { timeout: 10000 });
  await page.waitForSelector('#person-relations', { timeout: 5000 });
  await page.waitForSelector('#person-evidence', { timeout: 5000 });
  await page.waitForSelector('#person-memories', { timeout: 5000 });
  await page.waitForSelector('#person-disputes', { timeout: 5000 });
  await page.waitForSelector('#person-propose', { timeout: 5000 });

  await new Promise(r => setTimeout(r, 1000));

  const shotPersonPath = path.join(SHOTS_DIR, 'person_profile.png');
  // Capture full page or tall viewport to show layers
  await page.screenshot({ path: shotPersonPath, fullPage: true });
  console.log(`📸 Saved person_profile.png to ${shotPersonPath}`);

  // 6. Step 5: Proposal Form Interaction & Submission
  console.log('✍️ Testing Proposal Form submission...');
  await page.waitForSelector('#prop-field-select', { timeout: 5000 });
  await page.select('#prop-field-select', 'birth_date');
  await page.type('#prop-value-input', '15/08/1872');
  await page.type('#prop-evidence-input', 'Gia phả lưu truyền chi 2 & Trích lục hộ tịch số 42');
  await page.type('#prop-reason-input', 'Đối chiếu với bản khắc văn bia mộ tổ họ Trần tại quê nhà');

  // Scroll proposal section into view
  await page.evaluate(() => {
    document.querySelector('#person-propose').scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 500));

  // Click submit
  await page.click('#prop-submit-btn');

  // Wait for status message
  await page.waitForSelector('#proposal-status .gi-badge--success', { timeout: 5000 });
  const statusMsg = await page.$eval('#proposal-status', el => el.textContent.trim());
  console.log(`Proposal Submission Result: "${statusMsg}"`);

  const shotProposalPath = path.join(SHOTS_DIR, 'proposal_form.png');
  // Capture view focused on the proposal form
  await page.screenshot({ path: shotProposalPath, fullPage: false });
  console.log(`📸 Saved proposal_form.png to ${shotProposalPath}`);

  // 7. Step 6: Responsive Mobile Viewport (375px)
  console.log('📱 Testing Mobile Viewport (375px)...');
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await page.goto(`${BASE_URL}/me/tree`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('#pedigree-tree-container', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 1000));

  const shotMobilePath = path.join(SHOTS_DIR, 'responsive_mobile.png');
  await page.screenshot({ path: shotMobilePath, fullPage: false });
  console.log(`📸 Saved responsive_mobile.png to ${shotMobilePath}`);

  // 8. Step 7: Verify Lab Preview at port 8888
  console.log('🧪 Verifying Vibecode Lab at :8888/lab.html...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(LAB_URL, { waitUntil: 'networkidle2' });
  await page.waitForSelector('#gi-app', { timeout: 10000 });

  // Switch to Tree surface in Lab
  console.log('Selecting Tab 3 (Tree) in Lab...');
  const labTreeTab = await page.$('button[data-surface="tree"], .gi-lab__tab:nth-child(3)');
  if (labTreeTab) {
    await labTreeTab.click();
    await new Promise(r => setTimeout(r, 1000));
  }
  const labTitle = await page.title();
  console.log(`Lab Title: ${labTitle}`);

  await browser.close();
  console.log('🎉 Verification completed successfully!');
}

run().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
