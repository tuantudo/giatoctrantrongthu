const fs = require('fs');
let code = fs.readFileSync('src/js/ui/public-home.js', 'utf8');

// The threshold block:
//   content.appendChild(el('div', { class: 'gi-threshold', id: 'threshold' }, [
//     el('p', { class: 'gi-threshold__eyebrow', text: 'Cửa vào của gia tộc' }),
//     el('h1', { class: 'gi-threshold__name', text: FAMILY_NAME }),
//     el('div', { class: 'gi-threshold__rule', 'aria-hidden': 'true' }),
//     el('p', { class: 'gi-threshold__line', text: THRESHOLD_LINE })
//   ]));

const thresholdRegex = /content\.appendChild\(el\('div', \{ class: 'gi-threshold'.*?\n\s*\}\]\)\);/s;
code = code.replace(thresholdRegex, '');

fs.writeFileSync('src/js/ui/public-home.js', code);
