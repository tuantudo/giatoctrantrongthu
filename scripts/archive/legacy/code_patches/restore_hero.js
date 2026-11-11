const fs = require('fs');
let code = fs.readFileSync('src/js/ui/public-home.js', 'utf8');

const heroHtml = `  content.appendChild(el('div', { class: 'gi-threshold', id: 'threshold' }, [
    el('h1', { class: 'gi-threshold__name', text: FAMILY_NAME }),
    el('div', { class: 'gi-threshold__rule', 'aria-hidden': 'true' })
  ]));

  /* ------------------------------------------------------------------`;

code = code.replace(`  /* ------------------------------------------------------------------`, heroHtml);

fs.writeFileSync('src/js/ui/public-home.js', code);
