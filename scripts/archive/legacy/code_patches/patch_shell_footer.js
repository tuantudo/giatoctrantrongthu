const fs = require('fs');
let code = fs.readFileSync('src/js/ui/shell.js', 'utf8');

const oldFooterCall = `  const footer = Footer({
    links: [
      { label: 'Trang công khai', href: '/' },
      isMember ? { label: 'Cây phả đồ', href: '/me/tree' } : { label: 'Đăng nhập', href: '/login' }
    ],
    // [FACT] No build/system jargon reaches the visitor. The earlier
    // "· UI System vNEXT" line printed internal tooling vocabulary in the public
    // footer — a technical label on a family gate (mission §5).
    legal: title || null
  });`;

const newFooterCall = `  const footer = Footer();`;

code = code.replace(oldFooterCall, newFooterCall);
fs.writeFileSync('src/js/ui/shell.js', code);
