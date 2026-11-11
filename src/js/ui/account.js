/**
 * GIATOC UI SYSTEM vNEXT — account.js
 * Member Account Center (/me/account)
 *
 * Provides a clear, reassuring, family-oriented overview of the member's account:
 * - Credentials & Account Status
 * - Verified Person Profile & Pedigree Tree Linkage
 * - Security & Password Management
 * - Privacy Guarantees
 */

import { el } from './dom.js';
import { PageHeader, Section } from './components.js';
import { Region, StatePanel, STATE } from './states.js';
import { api } from './data.js';

export function renderAccount(content, context) {
  content.appendChild(PageHeader({
    title: 'Tài khoản của tôi',
    lead: 'Quản lý thông tin tài khoản, danh tính gắn liền trong gia phả và thiết lập bảo mật.'
  }));

  const mainZone = el('div', { id: 'zone-account-details', class: 'gi-stack' });
  content.appendChild(mainZone);

  Region(mainZone, {
    load: () => api.memberProfile(),
    render: (data) => {
      const account = (data && data.account) || {};
      const person = data && data.person;
      const isOwner = account.role === 'owner';
      const roleLabel = isOwner ? 'Quản trị viên gia tộc (Owner)' : (account.role === 'admin' ? 'Ban biên tập (Admin)' : 'Thành viên dòng họ');
      const statusLabel = account.status === 'ACTIVE' ? 'Đang hoạt động (Đã xác minh)' : (account.status === 'PROVISIONED' ? 'Cần đổi mật khẩu kích hoạt' : 'Tạm khóa');
      const statusColor = account.status === 'ACTIVE' ? '#15803d' : '#b45309';

      // 1. Identity & Profile Box
      const profileCard = el('div', {
        class: 'gi-card',
        style: {
          padding: '24px',
          border: '1px solid var(--color-border-subtle, #e7e5e4)',
          background: 'var(--color-surface-raised, #fff)',
          marginBottom: '24px'
        }
      }, [
        el('h3', {
          style: {
            margin: '0 0 16px',
            fontSize: '18px',
            fontFamily: 'var(--font-display-active, serif)',
            color: 'var(--color-brand-heritage, #8b261e)'
          },
          text: '1. Thông tin định danh & Phả hệ'
        }),
        el('div', {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '16px'
          }
        }, [
          el('div', {}, [
            el('p', { style: { margin: '0 0 4px', fontSize: '12px', color: 'var(--color-text-muted, #78716c)' }, text: 'Tên tài khoản (Tên đăng nhập)' }),
            el('p', { style: { margin: 0, fontSize: '15px', fontWeight: '600' }, text: account.username || 'Chưa xác định' })
          ]),
          el('div', {}, [
            el('p', { style: { margin: '0 0 4px', fontSize: '12px', color: 'var(--color-text-muted, #78716c)' }, text: 'Vai trò trong hệ thống' }),
            el('p', { style: { margin: 0, fontSize: '15px', fontWeight: '600' }, text: roleLabel })
          ]),
          el('div', {}, [
            el('p', { style: { margin: '0 0 4px', fontSize: '12px', color: 'var(--color-text-muted, #78716c)' }, text: 'Trạng thái tài khoản' }),
            el('p', { style: { margin: 0, fontSize: '15px', fontWeight: '600', color: statusColor }, text: statusLabel })
          ]),
          el('div', {}, [
            el('p', { style: { margin: '0 0 4px', fontSize: '12px', color: 'var(--color-text-muted, #78716c)' }, text: 'Hồ sơ gắn liền trên Cây phả đồ' }),
            el('p', {
              style: { margin: 0, fontSize: '15px', fontWeight: '600', color: person ? 'var(--color-text-primary, #1c1917)' : '#b45309' },
              text: person ? `${person.name} (${person.birthYear || 'Chưa rõ năm sinh'})` : 'Chưa gắn liên kết nhân vật'
            })
          ])
        ]),
        person ? el('div', {
          style: {
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid var(--color-border-subtle, #f5f5f4)',
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap'
          }
        }, [
          el('a', {
            class: 'gi-btn gi-btn--primary',
            href: `/me/tree/person/${encodeURIComponent(person.id)}`,
            text: '📄 Xem hồ sơ phả hệ của tôi →'
          }),
          el('a', {
            class: 'gi-btn gi-btn--secondary',
            href: `/me/tree?focus=${encodeURIComponent(person.id)}`,
            text: '🌳 Vị trí của tôi trên phả đồ →'
          })
        ]) : null
      ]);

      // 2. Security & Password Box
      const securityCard = el('div', {
        class: 'gi-card',
        style: {
          padding: '24px',
          border: '1px solid var(--color-border-subtle, #e7e5e4)',
          background: 'var(--color-surface-raised, #fff)',
          marginBottom: '24px'
        }
      }, [
        el('h3', {
          style: {
            margin: '0 0 12px',
            fontSize: '18px',
            fontFamily: 'var(--font-display-active, serif)',
            color: 'var(--color-brand-heritage, #8b261e)'
          },
          text: '2. Bảo mật & Mật khẩu'
        }),
        el('p', {
          style: { fontSize: '14px', color: 'var(--color-text-secondary, #57534e)', lineHeight: '1.6', margin: '0 0 16px' },
          text: 'Để bảo vệ không gian riêng tư của dòng họ, bạn nên thay đổi mật khẩu định kỳ hoặc khi nghi ngờ mật khẩu đã bị người ngoài biết.'
        }),
        el('div', { style: { display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' } }, [
          el('a', {
            class: 'gi-btn gi-btn--primary',
            href: '/me/change-password',
            text: '🔑 Đổi mật khẩu tài khoản →'
          }),
          el('a', {
            class: 'gi-btn gi-btn--subtle',
            href: '/help/recovery',
            text: 'Hướng dẫn khôi phục nếu quên mật khẩu'
          })
        ])
      ]);

      // 3. Family Actions Hub
      const actionsCard = el('div', {
        class: 'gi-card',
        style: {
          padding: '24px',
          border: '1px solid var(--color-border-subtle, #e7e5e4)',
          background: 'var(--color-surface-raised, #fff)',
          marginBottom: '24px'
        }
      }, [
        el('h3', {
          style: {
            margin: '0 0 12px',
            fontSize: '18px',
            fontFamily: 'var(--font-display-active, serif)',
            color: 'var(--color-brand-heritage, #8b261e)'
          },
          text: '3. Tương tác & Đóng góp cho dòng tộc'
        }),
        el('p', {
          style: { fontSize: '14px', color: 'var(--color-text-secondary, #57534e)', lineHeight: '1.6', margin: '0 0 16px' },
          text: 'Mỗi kỷ vật, bức ảnh cũ hay lời kể của bạn đều là viên gạch quý báu bồi đắp cho di sản chung của con cháu họ Trần.'
        }),
        el('div', { style: { display: 'flex', gap: '12px', flexWrap: 'wrap' } }, [
          el('a', {
            class: 'gi-btn gi-btn--secondary',
            href: '/me/contribute',
            text: '✍️ Gửi đóng góp tư liệu hoặc đính chính'
          }),
          el('a', {
            class: 'gi-btn gi-btn--secondary',
            href: '/me/requests',
            text: '📋 Xem trạng thái các yêu cầu đã gửi'
          }),
          el('a', {
            class: 'gi-btn gi-btn--subtle',
            href: '/help',
            text: '❓ Trung tâm trợ giúp & Hướng dẫn'
          })
        ])
      ]);

      // 4. Logout Card
      const logoutCard = el('div', {
        style: {
          padding: '16px 24px',
          background: 'var(--color-surface-sunken, #fafaf9)',
          border: '1px solid var(--color-border-subtle, #e7e5e4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }
      }, [
        el('div', {}, [
          el('p', { style: { margin: 0, fontSize: '14px', fontWeight: '600' }, text: 'Kết thúc phiên làm việc' }),
          el('p', { style: { margin: 0, fontSize: '12.5px', color: 'var(--color-text-muted, #78716c)' }, text: 'Đăng xuất để bảo đảm an toàn khi dùng chung thiết bị.' })
        ]),
        el('a', {
          class: 'gi-btn gi-btn--subtle',
          href: '/logout',
          style: { color: 'var(--color-brand-heritage, #8b261e)' },
          text: 'Đăng xuất khỏi tài khoản ➔'
        })
      ]);

      return el('div', { class: 'gi-stack' }, [profileCard, securityCard, actionsCard, logoutCard]);
    },
    empty: {
      title: 'Không thể tải thông tin tài khoản',
      body: 'Xin vui lòng đăng nhập lại hoặc liên hệ quản trị viên.'
    }
  });

  return content;
}

