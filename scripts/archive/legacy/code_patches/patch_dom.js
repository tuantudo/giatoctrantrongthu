const fs = require('fs');
let code = fs.readFileSync('src/js/ui/dom.js', 'utf8');

if (!code.includes("key === 'html'")) {
    code = code.replace(
      `else if (key === 'text') node.textContent = String(value);`,
      `else if (key === 'text') node.textContent = String(value);
    else if (key === 'html') node.innerHTML = String(value);`
    );
    fs.writeFileSync('src/js/ui/dom.js', code);
}
