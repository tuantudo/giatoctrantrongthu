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
    const html = await fetch('https://giatoctrantrongthu.com/?bust=' + Date.now()); 
    
    // Check Assets
    const jsMatch = html.match(/<script[^>]+src="([^"]+app\.js[^"]*)"/);
    const cssMatch = html.match(/<link[^>]+href="([^"]+main\.css[^"]*)"/);
    const jsUrl = jsMatch ? jsMatch[1] : 'NOT FOUND';
    const cssUrl = cssMatch ? cssMatch[1] : 'NOT FOUND';
    console.log(`[ASSETS] JS URL: ${jsUrl}`);
    console.log(`[ASSETS] CSS URL: ${cssUrl}`);

    // Favicon
    const faviconMatch = html.match(/<link[^>]+rel="icon"[^>]+href="([^"]+)"/);
    console.log(`[FAVICON] URL: ${faviconMatch ? faviconMatch[1] : 'NOT FOUND'}`);

    // Responsive Logo
    const logoBlock = html.match(/<picture class="editorial-logo-picture">([\s\S]*?)<\/picture>/);
    if (logoBlock) {
       console.log(`[LOGO] Wide: ${logoBlock[1].includes('logoGiaToc_original.svg')}`);
       console.log(`[LOGO] Narrow: ${logoBlock[1].includes('logoGiaToc_ngang.svg')}`);
       console.log(`[LOGO] No Icon-Only Mobile: ${!logoBlock[1].includes('logoGiaToc.svg')}`);
    }

    // Verify JS logic exists (Runtime simulation)
    const fullJsUrl = jsUrl.startsWith('http') ? jsUrl : `https://giatoctrantrongthu.com/${jsUrl}`;
    const jsContent = await fetch(fullJsUrl);
    console.log(`[RUNTIME] kyUcCard logic: ${jsContent.includes('kyUcCard.innerHTML =')}`);
    console.log(`[RUNTIME] derivedGenerations logic: ${jsContent.includes('genLevels = Object.values(derivedGenerations)')}`);

    // Verify CSS logic exists
    const fullCssUrl = cssUrl.startsWith('http') ? cssUrl : `https://giatoctrantrongthu.com/${cssUrl}`;
    const cssContent = await fetch(fullCssUrl);
    console.log(`[CSS] .ky-uc-card styling: ${cssContent.includes('.ky-uc-card {')}`);

  } catch (e) {
    console.error(e);
  }
})();
