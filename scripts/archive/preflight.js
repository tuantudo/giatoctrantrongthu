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
    const html = await fetch('https://giatoctrantrongthu.com/');
    
    // 1 & 2: Extract app.js and main.css
    const jsMatch = html.match(/<script[^>]+src="([^"]+app\.js[^"]*)"/);
    const cssMatch = html.match(/<link[^>]+href="([^"]+main\.css[^"]*)"/);
    const jsUrl = jsMatch ? jsMatch[1] : 'NOT FOUND';
    const cssUrl = cssMatch ? cssMatch[1] : 'NOT FOUND';
    
    console.log(`[ASSETS] JS URL: ${jsUrl}`);
    console.log(`[ASSETS] CSS URL: ${cssUrl}`);
    
    // 3: Fetch the actual JS being served to the browser
    if (jsUrl !== 'NOT FOUND') {
      const fullJsUrl = jsUrl.startsWith('http') ? jsUrl : `https://giatoctrantrongthu.com/${jsUrl}`;
      const jsContent = await fetch(fullJsUrl);
      const hasKyUcLogic = jsContent.includes('kyUcCard');
      const hasDerivedGen = jsContent.includes('genLevels = Object.values(derivedGenerations)');
      console.log(`[JS_EVIDENCE] Has kyUcCard logic: ${hasKyUcLogic}`);
      console.log(`[JS_EVIDENCE] Has derivedGenerations stats logic: ${hasDerivedGen}`);
    }

    // 4 & 5: Check KÝ ỨC and Thế hệ DOM in HTML
    const hasKyUcHtml = html.includes('id="kyUcCard"');
    const hasGenHtml = html.includes('id="statGenerations"');
    console.log(`[HTML_DOM] Has kyUcCard container: ${hasKyUcHtml}`);
    console.log(`[HTML_DOM] Has statGenerations container: ${hasGenHtml}`);

    // 6: Favicon
    const faviconMatch = html.match(/<link[^>]+rel="icon"[^>]+href="([^"]+)"/);
    console.log(`[FAVICON] URL: ${faviconMatch ? faviconMatch[1] : 'NOT FOUND'}`);

    // 7: Responsive Logo
    const logoBlock = html.match(/<picture class="editorial-logo-picture">([\s\S]*?)<\/picture>/);
    if (logoBlock) {
       console.log(`[LOGO] Picture block found.`);
       const sources = logoBlock[1].match(/<source[^>]+>/g) || [];
       const img = logoBlock[1].match(/<img[^>]+>/) || [];
       console.log(`[LOGO] Sources: ${sources.join(' ')}`);
       console.log(`[LOGO] Fallback Img: ${img[0]}`);
    } else {
       console.log(`[LOGO] Picture block not found.`);
    }

  } catch (e) {
    console.error(e);
  }
})();
