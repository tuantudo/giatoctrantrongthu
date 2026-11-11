import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER_ERROR:', error.message));

  await page.goto('https://giatoctrantrongthu.com/', { waitUntil: 'networkidle' });
  
  const leadStoryTitle = await page.evaluate(() => {
     const el = document.getElementById('leadStoryTitle');
     return el ? el.textContent : 'NOT_FOUND';
  });
  
  const kyUc = await page.evaluate(() => {
     const el = document.getElementById('kyUcCard');
     return el ? el.textContent.trim() : 'NOT_FOUND';
  });
  
  const genEl = await page.evaluate(() => {
     const el = document.getElementById('statGenerations');
     return el ? el.textContent : 'NOT_FOUND';
  });
  
  console.log('Lead Story Title:', leadStoryTitle);
  console.log('Ky Uc Card:', kyUc);
  console.log('Generations:', genEl);
  
  await browser.close();
})();
