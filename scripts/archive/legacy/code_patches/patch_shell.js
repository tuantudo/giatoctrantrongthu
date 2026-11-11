const fs = require('fs');
let code = fs.readFileSync('src/js/ui/shell.js', 'utf8');

const oldNav = `const PUBLIC_NAV = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Tiếng nói của gia tộc', href: '/#voice' },
  { label: 'Về gia tộc', href: '/#family' },
  { label: 'Đăng nhập', href: '/login' }
];`;

const newNav = `const PUBLIC_NAV = [
  { label: 'Trang chủ', href: '/', iconHtml: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>' },
  { label: 'Tiếng nói của gia tộc', href: '#voice' },
  { label: 'Về gia tộc', href: '#family' },
  { label: 'Đăng nhập', href: '/login' }
];`;

code = code.replace(oldNav, newNav);

fs.writeFileSync('src/js/ui/shell.js', code);
