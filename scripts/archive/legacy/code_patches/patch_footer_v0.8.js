const fs = require('fs');
let code = fs.readFileSync('src/js/ui/components.js', 'utf8');

const oldFooterStart = `export function Footer() {
  return el('footer', { class: 'colophon', style:`;
const oldFooterEnd = `© 2026 Gia Tộc Trần Trọng Thu.' })
    ])
  ]);
}`;

const minimalFooter = `export function Footer() {
  return el('footer', { class: 'gi-region-footer', style: { padding: '48px 24px', borderTop: '1px solid var(--color-border-subtle)', textAlign: 'center', marginTop: '64px' } }, [
    el('p', { text: 'Nơi lưu giữ ký ức, hồ sơ và tiếng nói của dòng họ.', style: { fontFamily: 'var(--font-text-active)', fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '16px' } }),
    el('p', { text: '© 2026 Gia Tộc Trần Trọng Thu.', style: { fontFamily: 'var(--font-text-active)', fontSize: '12px', color: 'var(--color-text-muted)' } })
  ]);
}`;

// I will just use regex to replace the entire Footer function
code = code.replace(/export function Footer\(\) \{[\s\S]*?\n\}\n/g, minimalFooter + '\n');
fs.writeFileSync('src/js/ui/components.js', code);
