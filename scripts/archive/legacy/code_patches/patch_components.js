const fs = require('fs');
let code = fs.readFileSync('src/js/ui/components.js', 'utf8');

code = code.replace(
  `        text: item.label,`,
  `        html: item.iconHtml || null,
        text: item.iconHtml ? null : item.label,
        'aria-label': item.iconHtml ? item.label : null,`
);

fs.writeFileSync('src/js/ui/components.js', code);
