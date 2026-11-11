const fs = require('fs');
let code = fs.readFileSync('src/css/foundation/components.css', 'utf8');

// Remove old gi-masthead and gi-identity
code = code.replace(/\/\* --- GRAPHIC ANCHOR \(Masthead\) --- \*\/[\s\S]*?\/\* --- SPLIT COMPOSITION --- \*\//, '/* --- SPLIT COMPOSITION --- */');

// Append new gi-threshold
const newCSS = `
/* --- FAMILY THRESHOLD --- */
.gi-threshold {
  text-align: center;
  padding: 80px 24px 64px;
  border-bottom: 3px double var(--color-border-strong);
  margin-bottom: 80px;
}
.gi-threshold__name {
  font-family: var(--font-display-active);
  font-size: clamp(40px, 6vw, 64px);
  font-weight: 700;
  line-height: 1.1;
  color: var(--color-text);
  margin: 0 0 24px 0;
  letter-spacing: -0.02em;
}
.gi-threshold__line {
  font-family: var(--font-text-active);
  font-size: var(--type-h3-size);
  color: var(--color-text-secondary);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}
`;
code += newCSS;

fs.writeFileSync('src/css/foundation/components.css', code);
