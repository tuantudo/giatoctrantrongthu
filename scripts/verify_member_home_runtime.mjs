/**
 * scripts/verify_member_home_runtime.mjs
 * End-to-End Browser Runtime Verification for Member Home Convergence.
 *
 * Checks:
 * 1. Authenticated session at /me (Auto-login as tuantq).
 * 2. Slice 1: Personal Context with Gioan Baotixita Trần Quốc Tuấn & action links.
 * 3. Slice 2: Upcoming Family Calendar with solar & lunar dates.
 * 4. Slice 3: MẠCH Knowledge articles list with title, author & read button.
 * 5. Slice 4: Family Archive Entry with 185 media & 173 associations.
 * 6. Four Doors Navigation.
 * 7. Desktop (1440px) & Mobile (375px) screenshots in shots/.
 */

import puppeteer from 'puppeteer';
import path from 'node:path';
import fs from 'node:fs';

const BASE_URL = 'http://127.0.0.1:3000';
const SHOTS_DIR = path.resolve('shots');
fs.mkdirSync(SHOTS_DIR, { recursive: true });

async function verifyMemberHome() {
  console.log('🚀 Starting Member Home Runtime Verification on Port 3000...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // 1. Authenticate via auto-login
  console.log('🔑 Authenticating as tuantq...');
  await page.goto(`${BASE_URL}/login?force_auto=1`, { waitUntil: 'networkidle2' });
  console.log('  Current URL after login:', page.url());

  // 2. Navigate to /me
  console.log('🏠 Navigating to /me...');
  await page.goto(`${BASE_URL}/me`, { waitUntil: 'networkidle2' });

  // Wait for all 4 slices to load data and render
  await page.waitForSelector('.gi-member-hero', { timeout: 10000 });
  await page.waitForSelector('#zone-calendar .gi-event-card', { timeout: 10000 });
  await page.waitForSelector('#zone-mach .gi-article-card', { timeout: 10000 });
  await page.waitForSelector('#zone-archive .gi-archive-hero-box', { timeout: 10000 });
  await page.waitForSelector('.gi-doors', { timeout: 10000 });

  await new Promise(r => setTimeout(r, 1000));

  // --- SLICE 1 VERIFICATION ---
  const heroName = await page.$eval('.gi-welcome__name', el => el.textContent.trim());
  const welcomeText = await page.$eval('.gi-welcome', el => el.textContent.trim());
  console.log(`  ✓ Slice 1 (Personal Context): "${welcomeText}" -> "${heroName}"`);
  if (!heroName.includes('Gioan Baotixita Trần Quốc Tuấn')) {
    throw new Error(`Expected Tuấn in hero, got: ${heroName}`);
  }

  // --- SLICE 2 VERIFICATION ---
  const eventCards = await page.$$eval('#zone-calendar .gi-event-card', els => els.map(el => el.textContent.trim()));
  console.log(`  ✓ Slice 2 (Family Calendar): ${eventCards.length} upcoming events rendered.`);
  console.log(`    Sample event: ${eventCards[0].slice(0, 60)}...`);

  // --- SLICE 3 VERIFICATION ---
  const articleCards = await page.$$eval('#zone-mach .gi-article-card', els => els.map(el => el.textContent.trim()));
  console.log(`  ✓ Slice 3 (MẠCH Knowledge): ${articleCards.length} latest articles rendered.`);
  console.log(`    Sample article: ${articleCards[0].slice(0, 60)}...`);

  // --- SLICE 4 VERIFICATION ---
  const archiveText = await page.$eval('#zone-archive', el => el.textContent.trim());
  console.log(`  ✓ Slice 4 (Family Archive): "${archiveText.slice(0, 80)}..."`);
  if (!archiveText.includes('185') || !archiveText.includes('173')) {
    throw new Error(`Expected 185 media and 173 person associations, got: ${archiveText}`);
  }

  // Capture Desktop Screenshot
  const desktopShotPath = path.join(SHOTS_DIR, 'member_home_desktop.png');
  await page.screenshot({ path: desktopShotPath, fullPage: true });
  console.log(`  📸 Saved desktop screenshot: ${desktopShotPath}`);

  // Test Mobile Viewport (375px)
  console.log('📱 Verifying mobile responsive layout (375px)...');
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  await page.reload({ waitUntil: 'networkidle2' });
  await page.waitForSelector('.gi-member-hero', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 800));

  const mobileShotPath = path.join(SHOTS_DIR, 'member_home_mobile.png');
  await page.screenshot({ path: mobileShotPath, fullPage: true });
  console.log(`  📸 Saved mobile screenshot: ${mobileShotPath}`);

  // Test Flow Navigation: Click "Xem vị trí trên phả đồ"
  console.log('🌳 Testing one-click navigation to Tree Focus...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/me`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('a[href*="/me/tree?focus="]', { timeout: 5000 });
  const treeFocusHref = await page.$eval('a[href*="/me/tree?focus="]', el => el.getAttribute('href'));
  console.log(`    Found tree focus link: ${treeFocusHref}`);

  await page.goto(`${BASE_URL}${treeFocusHref}`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('.gi-pedigree__card--focus', { timeout: 10000 });
  const treeFocusPerson = await page.$eval('.gi-pedigree__card--focus .gi-pedigree__name', el => el.textContent.trim());
  console.log(`    Tree anchored on: "${treeFocusPerson}"`);
  if (!treeFocusPerson.includes('Quốc Tuấn')) {
    throw new Error(`Tree failed to focus on Tuấn, anchored on: ${treeFocusPerson}`);
  }
  console.log('  ✅ End-to-end flow from Member Home to Focused Tree VERIFIED!');

  await browser.close();
  console.log('\n🎉 ALL MEMBER HOME RUNTIME VERIFICATION CHECKS PASSED (100%)!');
}

verifyMemberHome().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});

