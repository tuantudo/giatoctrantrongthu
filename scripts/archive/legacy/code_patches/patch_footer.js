const fs = require('fs');
let code = fs.readFileSync('src/js/ui/components.js', 'utf8');

const oldFooter = `export function Footer({ links = [], legal, brand = 'Gia Tộc Trần Trọng Thu' } = {}) {
  return el('div', { class: 'gi-region-footer' }, [
    el('div', { class: 'gi-container' }, [
      el('div', { class: 'gi-footer__inner' }, [
        el('p', { class: 'gi-footer__brand', text: brand }),
        links.length ? el('ul', { class: 'gi-footer__links' }, links.filter(Boolean).map(l =>
          el('li', {}, [el('a', { href: l.href, text: l.label })]))) : null,
        legal ? el('p', { class: 'gi-footer__legal', text: legal }) : null
      ])
    ])
  ]);
}`;

const newFooter = `export function Footer() {
  return el('footer', { class: 'colophon', style: { padding: '48px 16px', background: 'var(--color-surface-sunken, #f9f9f9)', borderTop: '1px solid var(--color-border-subtle)', marginTop: '64px', fontSize: '14px', lineHeight: '1.6' } }, [
    el('div', { class: 'col-grid', style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', maxWidth: '1200px', margin: '0 auto' } }, [
      el('div', { class: 'col-block' }, [
        el('div', { class: 'c-name', text: 'GIA TỘC TRẦN TRỌNG THU', style: { fontWeight: '700', marginBottom: '8px' } }),
        el('p', { text: 'Ấn phẩm số · kho lưu trữ sống của dòng họ — prototype DESIGN-001.' })
      ]),
      el('nav', { class: 'col-block col-links', style: { display: 'flex', flexDirection: 'column', gap: '8px' } }, [
        el('a', { href: '#/mach', text: 'MẠCH', style: { textDecoration: 'none', color: 'inherit' } }),
        el('a', { href: '#/tu-lieu', text: 'Tư liệu', style: { textDecoration: 'none', color: 'inherit' } }),
        el('a', { href: '#/gia-pha', text: 'Gia phả', style: { textDecoration: 'none', color: 'inherit' } }),
        el('a', { href: '#/lich', text: 'Lịch', style: { textDecoration: 'none', color: 'inherit' } })
      ]),
      el('div', { class: 'col-block col-members', style: { display: 'flex', flexDirection: 'column', gap: '8px' } }, [
        el('p', { class: 'col-heading', text: 'THÀNH VIÊN', style: { fontWeight: '700' } }),
        el('a', { href: '#/tu-cach-thanh-vien', text: 'Tư cách thành viên →', style: { textDecoration: 'none', color: 'inherit' } }),
        el('a', { href: '/login', text: 'Member Space →', style: { textDecoration: 'none', color: 'inherit' } })
      ]),
      el('div', { class: 'col-block col-contact' }, [
        el('p', { class: 'col-heading', text: 'LIÊN HỆ / BAN LIÊN LẠC', style: { fontWeight: '700', marginBottom: '8px' } }),
        el('p', { class: 'note-caps', text: 'Thông tin liên hệ chính thức sẽ được cập nhật từ nguồn được xác minh (chưa có source).', style: { fontSize: '12px', color: 'var(--color-text-muted, #666)' } })
      ])
    ]),
    el('div', { class: 'col-legal', style: { maxWidth: '1200px', margin: '48px auto 0', paddingTop: '16px', borderTop: '1px solid var(--color-border-subtle)', color: 'var(--color-text-muted, #666)' } }, [
      el('small', { text: '© 2026 Gia Tộc Trần Trọng Thu.' })
    ])
  ]);
}`;

code = code.replace(oldFooter, newFooter);
fs.writeFileSync('src/js/ui/components.js', code);
