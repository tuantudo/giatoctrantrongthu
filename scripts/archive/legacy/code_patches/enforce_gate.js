const fs = require('fs');
let code = fs.readFileSync('src/css/foundation/components.css', 'utf8');

code = code.replace(/\.gi-gate__door \{/g, '.gi-gate__door {\n  border-radius: 0;\n  box-shadow: none;');
fs.writeFileSync('src/css/foundation/components.css', code);
