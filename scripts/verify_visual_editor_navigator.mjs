/**
 * scripts/verify_visual_editor_navigator.mjs
 * Automated verification script for Vibecode Visual Editor & Dynamic Navigator.
 *
 * Verifies:
 *   1. Dynamic Navigation 3-Tier Configuration (Default, Working Draft, Approved)
 *   2. In-Page Anchor Navigation (No Hash Collision, scrollIntoView)
 *   3. Active State Indicators (aria-current="location" vs "page")
 *   4. Dedicated Navigator Configuration Panel
 *   5. DraftStore Persistence with stable data-editable-id
 *   6. Zero Draft Loss across view transitions and reloads
 */

import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:8888/lab.html#view=public';

async function runVerification() {
  console.log('🚀 [STARTING VERIFICATION] Vibecode Visual Editor & Navigator...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  let passCount = 0;
  let failCount = 0;

  const test = (name, condition, detail = '') => {
    if (condition) {
      console.log(`  ✅ [PASS] ${name}${detail ? ` — ${detail}` : ''}`);
      passCount++;
    } else {
      console.error(`  ❌ [FAIL] ${name}${detail ? ` — ${detail}` : ''}`);
      failCount++;
    }
  };

  try {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    // 1. Initial State
    const navLinks = await page.$$eval('.gi-nav__link', els => els.map(e => ({
      text: e.textContent.trim(),
      href: e.getAttribute('href'),
      ariaCurrent: e.getAttribute('aria-current')
    })));

    test('TC-01: Nav items count is 7', navLinks.length === 7, `Total: ${navLinks.length}`);
    test('TC-02: Initial active state is aria-current="page" on Home', 
      navLinks[0].href === '/' && navLinks[0].ariaCurrent === 'page',
      `Home: href=${navLinks[0].href}, aria-current=${navLinks[0].ariaCurrent}`
    );

    // 2. In-Page Anchor Click (Condition 4 & 5)
    await page.click('.gi-nav__link[href="#van-de"]');
    await page.waitForTimeout(200);

    const hash = await page.evaluate(() => window.location.hash);
    const vanDeAriaCurrent = await page.$eval('.gi-nav__link[href="#van-de"]', el => el.getAttribute('aria-current'));
    const homeAriaCurrent = await page.$eval('.gi-nav__link[href="/"]', el => el.getAttribute('aria-current'));

    test('TC-03: Zero hash collision on anchor click', hash.includes('view=public'), `Hash=${hash}`);
    test('TC-04: Section navigation applies aria-current="location"', 
      vanDeAriaCurrent === 'location' && homeAriaCurrent === null,
      `vanDe=${vanDeAriaCurrent}, home=${homeAriaCurrent}`
    );

    // 3. Navigator Management Modal (Condition 1 & 2)
    const modalBtnExists = await page.$('#gi-btn-open-nav-modal');
    test('TC-05: Navigator Configuration button exists', !!modalBtnExists);

    await page.click('#gi-btn-open-nav-modal');
    await page.waitForSelector('#gi-nav-modal', { state: 'visible' });
    test('TC-06: Dedicated Navigator Modal opened', true);

    // Edit item in modal
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('.gi-nav-label-input');
      if (inputs[1]) {
        inputs[1].value = 'Chủ Đề Khảo Cứu';
        inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    await page.click('#gi-nav-save-btn');
    await page.waitForTimeout(200);

    const updatedNavTexts = await page.$$eval('.gi-nav__link', els => els.map(e => e.textContent.trim()));
    test('TC-07: Saving working draft updates live preview', updatedNavTexts.includes('Chủ Đề Khảo Cứu'), `Nav: ${updatedNavTexts.join(', ')}`);

    const workingDraftStored = await page.evaluate(() => !!localStorage.getItem('gi_nav_working_draft_public'));
    test('TC-08: Working draft persisted in localStorage', workingDraftStored);

    // Reset back to default
    await page.click('#gi-btn-open-nav-modal');
    await page.waitForSelector('#gi-nav-modal', { state: 'visible' });
    await page.evaluate(() => {
      window.confirm = () => true;
      document.querySelector('#gi-nav-reset-default-btn').click();
    });
    await page.waitForTimeout(200);

    const revertedNavTexts = await page.$$eval('.gi-nav__link', els => els.map(e => e.textContent.trim()));
    test('TC-09: Reset to default restores original nav items', revertedNavTexts.includes('Vấn đề quan tâm'));

    // 4. DraftStore Content Persistence (Condition 3 & 6)
    const heroTitleId = await page.$eval('.gi-pub-hero-title', el => el.getAttribute('data-editable-id'));
    test('TC-10: Stable data-editable-id attribute exists', heroTitleId === 'pub.hero.title', `id=${heroTitleId}`);

    // Mutate hero title
    await page.evaluate(() => {
      const el = document.querySelector('[data-editable-id="pub.hero.title"]');
      el.textContent = 'GIA TỘC TRẦN TRỌNG THU — BẢN NHÁP KIỂM THỬ';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });

    const contentDraftStored = await page.evaluate(() => !!localStorage.getItem('gi_content_working_draft'));
    test('TC-11: Content draft automatically saved on input', contentDraftStored);

    // Switch view to /me (dashboard) and back to / (public)
    await page.evaluate(() => { window.location.hash = '#view=dashboard'; });
    await page.waitForTimeout(200);
    await page.evaluate(() => { window.location.hash = '#view=public'; });
    await page.waitForTimeout(200);

    const restoredText = await page.$eval('[data-editable-id="pub.hero.title"]', el => el.textContent.trim());
    test('TC-12: Zero draft loss across view transitions', restoredText.includes('BẢN NHÁP KIỂM THỬ'), `Restored: "${restoredText}"`);

    // Clean up
    await page.evaluate(() => {
      localStorage.removeItem('gi_content_working_draft');
      localStorage.removeItem('gi_nav_working_draft_public');
      localStorage.removeItem('gi_nav_approved_config_public');
    });
    await page.reload();
    await page.waitForTimeout(200);

    const cleanedText = await page.$eval('[data-editable-id="pub.hero.title"]', el => el.textContent.trim());
    test('TC-13: Storage cleanup restores default baseline', cleanedText === 'Gia Tộc Trần Trọng Thu', `Cleaned: "${cleanedText}"`);

  } catch (err) {
    console.error('CRITICAL EXECUTION ERROR:', err);
    failCount++;
  } finally {
    await browser.close();
  }

  console.log(`\n========================================`);
  console.log(`🏁 SUMMARY: ${passCount} PASSED, ${failCount} FAILED (TOTAL: ${passCount + failCount})`);
  console.log(`========================================\n`);

  if (failCount > 0) process.exit(1);
}

runVerification();

