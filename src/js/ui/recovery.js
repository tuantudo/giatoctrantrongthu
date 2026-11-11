/**
 * GIATOC UI SYSTEM vNEXT — recovery.js
 * Account Recovery Guide & Request (/help/recovery)
 *
 * Implements Family Steward Assisted Recovery:
 * Personal, secure, respectful, without risky third-party OTP or SMS dependencies.
 */

import { el } from './dom.js';
import { PageHeader, Section } from './components.js';

export function renderRecovery(content, context) {
  content.appendChild(PageHeader({
    title: 'Khôi phục tài khoản khi quên mật khẩu',
    lead: 'Quy trình hỗ trợ thân tình dành cho người thân trong dòng họ Trần Trọng Thu.'
  }));

  const mainContainer = el('div', { class: 'gi-stack', style: { maxWidth: '760px', margin: '0 auto 40px' } });
  content.appendChild(mainContainer);

  // Khung nguyên tắc & Lời trấn an
  const philosophyCard = el('div', {
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
      text: 'Bảo mật gia đình qua sự kết nối thân thuộc'
    }),
    el('p', {
      style: { fontSize: '14.5px', color: 'var(--color-text-secondary, #57534e)', lineHeight: '1.7', margin: 0 },
      text: 'Trong gia đình, không có thủ tục công nghệ nào an toàn và ấm áp hơn sự kết nối trực tiếp giữa những người thân. Để bảo vệ không gian gia phả tuyệt đối và tránh các rủi ro lộ lọt thông tin qua dịch vụ viễn thông hay email bên ngoài, hệ thống áp dụng cơ chế xác minh hỗ trợ trực tiếp từ Ban Quản Trị dòng họ.'
    })
  ]);
  mainContainer.appendChild(philosophyCard);

  // 4 Bước khôi phục
  const stepsCard = el('div', {
    class: 'gi-card',
    style: {
      padding: '24px',
      border: '1px solid var(--color-border-subtle, #e7e5e4)',
      background: 'var(--color-surface-raised, #fff)',
      marginBottom: '24px'
    }
  }, [
    el('h3', {
      style: { margin: '0 0 16px', fontSize: '18px', fontFamily: 'var(--font-display-active, serif)' },
      text: '4 Bước lấy lại quyền truy cập'
    }),
    el('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' } }, [
      el('div', { style: { display: 'flex', gap: '14px', alignItems: 'flex-start' } }, [
        el('div', {
          style: {
            background: 'var(--color-brand-heritage, #8b261e)',
            color: '#fff',
            fontWeight: '700',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            flexShrink: 0
          },
          text: '1'
        }),
        el('div', {}, [
          el('h4', { style: { margin: '0 0 4px', fontSize: '15px' }, text: 'Liên hệ Người quản lý gia tộc' }),
          el('p', { style: { margin: 0, fontSize: '14px', color: 'var(--color-text-secondary, #57534e)', lineHeight: '1.5' }, text: 'Gửi tin nhắn hoặc gọi điện cho anh Tuấn (hoặc người phụ trách gia đình bạn) qua Zalo/Điện thoại.' })
        ])
      ]),
      el('div', { style: { display: 'flex', gap: '14px', alignItems: 'flex-start' } }, [
        el('div', {
          style: {
            background: 'var(--color-brand-heritage, #8b261e)',
            color: '#fff',
            fontWeight: '700',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            flexShrink: 0
          },
          text: '2'
        }),
        el('div', {}, [
          el('h4', { style: { margin: '0 0 4px', fontSize: '15px' }, text: 'Cung cấp thông tin xác minh người thân' }),
          el('p', { style: { margin: 0, fontSize: '14px', color: 'var(--color-text-secondary, #57534e)', lineHeight: '1.5' }, text: 'Nêu rõ: "Tôi là [Tên], con/cháu của [Tên cha mẹ/nhánh phả hệ], nhờ gia đình cấp lại mật khẩu giúp tôi."' })
        ])
      ]),
      el('div', { style: { display: 'flex', gap: '14px', alignItems: 'flex-start' } }, [
        el('div', {
          style: {
            background: 'var(--color-brand-heritage, #8b261e)',
            color: '#fff',
            fontWeight: '700',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            flexShrink: 0
          },
          text: '3'
        }),
        el('div', {}, [
          el('h4', { style: { margin: '0 0 4px', fontSize: '15px' }, text: 'Nhận mật khẩu tạm thời' }),
          el('p', { style: { margin: 0, fontSize: '14px', color: 'var(--color-text-secondary, #57534e)', lineHeight: '1.5' }, text: 'Sau khi xác minh đúng người trong họ, Người quản lý sẽ cấp một mật khẩu tạm mới và gửi riêng cho bạn.' })
        ])
      ]),
      el('div', { style: { display: 'flex', gap: '14px', alignItems: 'flex-start' } }, [
        el('div', {
          style: {
            background: 'var(--color-brand-heritage, #8b261e)',
            color: '#fff',
            fontWeight: '700',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            flexShrink: 0
          },
          text: '4'
        }),
        el('div', {}, [
          el('h4', { style: { margin: '0 0 4px', fontSize: '15px' }, text: 'Đăng nhập & Tự đặt lại mật khẩu mới' }),
          el('p', { style: { margin: 0, fontSize: '14px', color: 'var(--color-text-secondary, #57534e)', lineHeight: '1.5' }, text: 'Bạn vào trang Đăng nhập (/login), nhập mật khẩu tạm. Hệ thống sẽ tự động mở trang để bạn đổi sang mật khẩu riêng tư của mình.' })
        ])
      ])
    ])
  ]);
  mainContainer.appendChild(stepsCard);

  // Action Buttons
  const actionCluster = el('div', {
    style: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      flexWrap: 'wrap',
      margin: '24px 0 16px'
    }
  }, [
    el('a', {
      class: 'gi-btn gi-btn--primary',
      href: '/login',
      text: '🔑 Quay lại trang Đăng nhập'
    }),
    el('a', {
      class: 'gi-btn gi-btn--secondary',
      href: '/help',
      text: 'Gửi yêu cầu hỗ trợ trực tuyến'
    })
  ]);
  mainContainer.appendChild(actionCluster);

  return content;
}

