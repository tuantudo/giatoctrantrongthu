/**
 * GIATOC UI vNEXT — gateway.js
 * INVITATION CARD & GATEWAY HARDENING IMPLEMENTATION (W-B01-01 / TP-001 / TP-002)
 *
 * Implements the canonical Member Gateway / Invitation Card when visitors access
 * internal threshold routes (#/gia-pha, #/mach, #/tu-lieu, #/lich, #/tim-kiem).
 *
 * GOVERNANCE RULES:
 * 1. Only Home (#/) is the outward-facing public discourse.
 * 2. Hash routes #/mach, #/gia-pha, #/lich, #/tim-kiem are NOT public content pages.
 * 3. When an unauthenticated visitor hits them, the interface MUST render this
 *    dignified Invitation Card; ZERO internal genealogy, PII or text is leaked.
 * 4. Safe DOM creation with el() — 100% XSS protected.
 */

import { el, clear } from './dom.js';

const GATEWAY_DETAILS = Object.freeze({
  'gia-pha': {
    tag: 'CỔNG PHẢ HỆ NỘI BỘ · GIA TỘC TRẦN TRỌNG THU',
    title: 'Cây Phả Hệ & Hồ Sơ Dòng Dõi',
    lead: 'Hệ thống phả hệ 223 nhân vật, quan hệ huyết thống 5 thế hệ và tư liệu gia phả là tài sản tinh thần nội bộ của dòng họ.',
    explanation: 'Nhằm bảo vệ sự tôn nghiêm của tiền nhân và quyền riêng tư của các gia đình con cháu, không gian này chỉ mở cho thành viên gia tộc đã xác minh danh tính.',
    cta: 'Vào Không Gian Phả Hệ (Đăng Nhập) →'
  },
  'mach': {
    tag: 'CỔNG DIỄN NGÔN NỘI BỘ · GIA TỘC TRẦN TRỌNG THU',
    title: 'Không Gian Tri Thức & Biên Tập MẠCH',
    lead: 'MẠCH là ấn phẩm nội san lưu giữ suy nghĩ, bài khảo cứu và câu chuyện gia đình do các thế hệ con cháu và dâu rể cùng đóng góp.',
    explanation: 'Vui lòng đăng nhập tài khoản thành viên để đọc toàn văn các bài viết, tham gia đối thoại và đề xuất bài viết mới.',
    cta: 'Đăng Nhập Đọc MẠCH →'
  },
  'tu-lieu': {
    tag: 'CỔNG KHO KỶ VẬT · GIA TỘC TRẦN TRỌNG THU',
    title: 'Kho Lưu Trữ Di Ảnh & Bút Tích Lịch Sử',
    lead: 'Kho tư liệu 185 ảnh chụp, chứng thư, văn bia và kỷ vật dòng họ được quản lý theo chuẩn bảo tồn số UNESCO.',
    explanation: 'Truy cập kho tư liệu được phân quyền theo quy chế bảo vệ hình ảnh người thân và quyền riêng tư gia đình.',
    cta: 'Đăng Nhập Tra Cứu Tư Liệu →'
  },
  'lich': {
    tag: 'CỔNG LỊCH GIA TỘC · GIA TỘC TRẦN TRỌNG THU',
    title: 'Sổ Lịch Giỗ Tết & Lễ Bổn Mạng',
    lead: 'Lịch phụng vụ và 265 mốc thời gian ngày kỵ giỗ, lễ kính thánh bổn mạng và kỷ niệm gia đình.',
    explanation: 'Dành riêng cho con cháu dòng họ tra cứu ngày âm dương và chuẩn bị các dịp phụng vụ gia tiên.',
    cta: 'Đăng Nhập Xem Lịch Gia Tộc →'
  },
  'tim-kiem': {
    tag: 'CỔNG TRA CỨU · GIA TỘC TRẦN TRỌNG THU',
    title: 'Tra Cứu Thông Tin Gia Tộc',
    lead: 'Công cụ tìm kiếm thông tin phả hệ, tư liệu và biên tập nội bộ có phân quyền.',
    explanation: 'Để bảo vệ tính toàn vẹn và quyền riêng tư, kết quả tìm kiếm chỉ hiển thị tương ứng với cấp độ xác thực của tài khoản thành viên.',
    cta: 'Đăng Nhập Để Tra Cứu →'
  }
});

export function renderInvitationGateway(container, routeKey = 'gia-pha') {
  clear(container);

  const cleanKey = String(routeKey || '').replace(/^#\/?/, '').toLowerCase();
  const info = GATEWAY_DETAILS[cleanKey] || {
    tag: 'CỔNG TIẾP CẬN NỘI BỘ · GIA TỘC TRẦN TRỌNG THU',
    title: 'Xác Minh Tư Cách Thành Viên',
    lead: 'Không gian nội bộ dành riêng cho con cháu và người thân trong Gia Tộc Trần Trọng Thu.',
    explanation: 'Vui lòng đăng nhập tài khoản thành viên hoặc sử dụng liên kết mời để tiếp cận các dữ liệu gia phả và tư liệu dòng họ.',
    cta: 'Vào Không Gian Thành Viên →'
  };

  const section = el('section', {
    class: 'gi-pub-section gi-gateway-section',
    'data-section': 'gateway',
    style: {
      maxWidth: '840px',
      margin: 'var(--space-12, 48px) auto',
      padding: 'var(--space-8, 32px) var(--space-6, 24px)'
    }
  }, [
    el('div', {
      class: 'gi-pub-tag',
      text: info.tag,
      style: { marginBottom: 'var(--space-4, 16px)' }
    }),
    el('h2', {
      class: 'gi-pub-section-title',
      text: info.title,
      style: {
        fontFamily: 'var(--font-display-active, serif)',
        fontSize: 'var(--type-h2-size, 28px)',
        letterSpacing: '0.05em',
        marginBottom: 'var(--space-4, 16px)'
      }
    }),
    el('div', { class: 'gi-pub-rule', style: { marginBottom: 'var(--space-6, 24px)' } }),
    
    // Dignified Heritage Box
    el('div', {
      class: 'gi-member-gate-banner',
      style: {
        padding: 'var(--space-8, 32px)',
        border: '1px solid var(--color-border-strong, #8b261e)',
        background: 'var(--color-bg-subtle, rgba(139, 38, 30, 0.03))',
        marginBottom: 'var(--space-8, 32px)'
      }
    }, [
      el('p', {
        class: 'gi-pub-hero-lead',
        text: info.lead,
        style: {
          fontSize: 'var(--type-h3-size, 18px)',
          fontWeight: '600',
          marginBottom: 'var(--space-4, 16px)',
          color: 'var(--color-brand-heritage, #8b261e)'
        }
      }),
      el('p', {
        class: 'gi-pub-prose',
        text: info.explanation,
        style: {
          lineHeight: '1.7',
          color: 'var(--color-text-secondary, #444)',
          marginBottom: 'var(--space-6, 24px)'
        }
      }),

      // Action row
      el('div', {
        style: {
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-4, 16px)',
          alignItems: 'center',
          marginTop: 'var(--space-6, 24px)'
        }
      }, [
        el('a', {
          class: 'gi-btn gi-btn--primary gi-btn--gate',
          href: '/login',
          text: info.cta,
          style: {
            display: 'inline-block',
            padding: '12px 24px',
            textDecoration: 'none'
          }
        }),
        el('a', {
          class: 'gi-btn gi-btn--subtle',
          href: '/',
          text: '← Về Trang Nhất Công Khai',
          click: (e) => {
            e.preventDefault();
            window.location.hash = '';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          },
          style: {
            display: 'inline-block',
            padding: '12px 20px',
            textDecoration: 'none',
            cursor: 'pointer'
          }
        })
      ])
    ]),

    // Clarification of Privacy & Ethics
    el('div', {
      class: 'gi-ethics-box',
      style: {
        fontSize: '13.5px',
        color: 'var(--color-text-muted, #666)',
        borderTop: '1px solid var(--color-border-subtle, #eee)',
        paddingTop: 'var(--space-4, 16px)'
      }
    }, [
      el('strong', { text: 'Quy tắc quản trị dữ liệu: ' }),
      el('span', {
        text: 'Nền tảng vận hành theo nguyên tắc bảo vệ quyền riêng tư gia đình. Mọi hành vi truy cập dữ liệu phả hệ đều yêu cầu định danh phiên thành viên hợp lệ.'
      })
    ])
  ]);

  container.appendChild(section);
  window.scrollTo({ top: 0, behavior: 'instant' });
}

