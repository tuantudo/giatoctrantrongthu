const fs = require('fs');
let code = fs.readFileSync('src/css/foundation/components.css', 'utf8');

// 1. Remove old gi-threshold completely
code = code.replace(/\.gi-threshold \{[\s\S]*?\}\n/g, '');
code = code.replace(/\.gi-threshold__name \{[\s\S]*?\}\n/g, '');
code = code.replace(/\.gi-threshold__rule \{[\s\S]*?\}\n/g, '');
code = code.replace(/\.gi-threshold__line \{[\s\S]*?\}\n/g, '');
code = code.replace(/\.gi-threshold__eyebrow \{[\s\S]*?\}\n/g, '');

// 2. Append new rules
const newCSS = `
/* --- GRAPHIC ANCHOR (Masthead) --- */
.gi-masthead {
  text-align: center;
  padding: 64px 24px 32px;
  border-bottom: 3px double var(--color-border-strong);
  margin-bottom: 48px;
}
.gi-masthead__logo {
  width: 100%;
  max-width: 600px; /* Big graphic weight */
  height: auto;
}

/* --- ORIENTATION (Identity) --- */
.gi-identity {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 80px;
}
.gi-identity__line {
  font-family: var(--font-text-active);
  font-size: var(--type-h3-size);
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* --- SPLIT COMPOSITION --- */
.gi-split-composition {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  margin-top: 80px;
  padding-bottom: 80px;
}
@media (max-width: 768px) {
  .gi-split-composition {
    grid-template-columns: 1fr;
    gap: 48px;
  }
}

/* --- Voice Zone --- */
.gi-zone--voice {
  margin-bottom: 80px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
`;

code += newCSS;
fs.writeFileSync('src/css/foundation/components.css', code);
