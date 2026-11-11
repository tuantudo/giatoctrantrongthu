const fs = require('fs');
let code = fs.readFileSync('server/member.js', 'utf8');
code = code.replace(/\\\$/g, '$');
fs.writeFileSync('server/member.js', code);
