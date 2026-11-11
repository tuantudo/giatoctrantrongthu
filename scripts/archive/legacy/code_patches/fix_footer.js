const fs = require('fs');
let code = fs.readFileSync('src/js/ui/components.js', 'utf8');

const newFooter = `export function Footer() {
  return el('footer', { class: 'gi-region-footer', style: { padding: '48px 24px', borderTop: '1px solid var(--color-border-subtle)', textAlign: 'center', marginTop: '64px' } }, [
    el('p', { text: '© 2026 Gia Tộc Trần Trọng Thu.', style: { fontFamily: 'var(--font-text-active)', fontSize: '12px', color: 'var(--color-text-muted)' } })
  ]);
}`;

code = code.replace(/export function Footer\(\) \{[\s\S]*?\n\}\n/, newFooter + '\n');
fs.writeFileSync('src/js/ui/components.js', code);
