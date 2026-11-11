const https = require('https');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

(async () => {
  try {
    const html = await fetch('https://giatoctrantrongthu.com/?bust=' + Date.now()); // bust CDN cache just in case for this test
    
    // 1: Extract app.js and main.css
    const jsMatch = html.match(/<script[^>]+src="([^"]+app\.js[^"]*)"/);
    const cssMatch = html.match(/<link[^>]+href="([^"]+main\.css[^"]*)"/);
    const jsUrl = jsMatch ? jsMatch[1] : 'NOT FOUND';
    const cssUrl = cssMatch ? cssMatch[1] : 'NOT FOUND';
    
    console.log(`[ASSETS] JS URL: ${jsUrl}`);
    console.log(`[ASSETS] CSS URL: ${cssUrl}`);

    // 2 & 3: Check KÝ ỨC and Thế hệ DOM in HTML
    const hasKyUcHtml = html.includes('id="kyUcCard"');
    const hasGenHtml = html.includes('id="statGenerations"');
    console.log(`[HTML_DOM] Has kyUcCard container: ${hasKyUcHtml}`);
    console.log(`[HTML_DOM] Has statGenerations container: ${hasGenHtml}`);

    // 4: Favicon
    const faviconMatch = html.match(/<link[^>]+rel="icon"[^>]+href="([^"]+)"/);
    console.log(`[FAVICON] URL: ${faviconMatch ? faviconMatch[1] : 'NOT FOUND'}`);

    // 5: Responsive Logo
    const logoBlock = html.match(/<picture class="editorial-logo-picture">([\s\S]*?)<\/picture>/);
    if (logoBlock) {
       const sources = logoBlock[1].match(/<source[^>]+>/g) || [];
       const img = logoBlock[1].match(/<img[^>]+>/) || [];
       console.log(`[LOGO] Sources: ${sources.join(' ')}`);
       console.log(`[LOGO] Fallback Img: ${img[0]}`);
       console.log(`[LOGO] Contains logoGiaToc.svg (icon-only): ${logoBlock[1].includes('logoGiaToc.svg') && !logoBlock[1].includes('logoGiaToc_ngang.svg') && !logoBlock[1].includes('logoGiaToc_original.svg')}`); // wait, simple regex is better
    } else {
       console.log(`[LOGO] Picture block not found.`);
    }

  } catch (e) {
    console.error(e);
  }
})();
