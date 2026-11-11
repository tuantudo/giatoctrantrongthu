/**
 * GIATOC UI SYSTEM vNEXT — help.js
 * Member & Public Help Center (/help & /me/help)
 *
 * Warm, accessible guide for elders, relatives, and new members:
 * - Onboarding FAQs (Làm sao để có tài khoản?)
 * - Navigation guide (Cách xem phả đồ, ngày giỗ, di ảnh)
 * - Direct contact & support request form
 */

import { el } from './dom.js';
import { PageHeader, Section } from './components.js';

export function renderHelp(content, context) {
  content.appendChild(PageHeader({
    title: 'Trung tâm Hướng dẫn & Trợ giúp',
    lead: 'Nơi giải đáp thắc mắc, hướng dẫn bà con cô bác sử dụng và kết nối cùng dòng họ.'
  }));

  const mainContainer = el('div', { class: 'gi-stack', style: { maxWidth: '840px', margin: '0 auto 40px' } });
  content.appendChild(mainContainer);

  // 1. Phục hồi mật khẩu nhanh
  const recoveryBanner = el('div', {
    style: {
      padding: '16px 20px',
      background: '#fffbeb',
      border: '1px solid #fef3c7',
      borderLeft: '4px solid #d97706',
      marginBottom: '24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '12px'
    }
  }, [
    el('div', {}, [
      el('h4', { style: { margin: '0 0 4px', fontSize: '15px', color: '#92400e', fontWeight: '700' }, text: '🔑 Quên mật khẩu hoặc không đăng nhập được?' }),
      el('p', { style: { margin: 0, fontSize: '13.5px', color: '#78350f' }, text: 'Đừng lo lắng! Người quản lý gia tộc sẽ hỗ trợ bạn cấp lại mật khẩu tạm thời ngay lập tức.' })
    ]),
    el('a', {
      class: 'gi-btn gi-btn--primary',
      href: '/help/recovery',
      style: { background: '#d97706', borderColor: '#b45309' },
      text: 'Xem hướng dẫn khôi phục →'
    })
  ]);
  mainContainer.appendChild(recoveryBanner);

  // 2. Câu hỏi thường gặp (FAQs)
  const faqSection = Section({
    id: 'faqs',
    title: 'Câu hỏi thường gặp',
    lead: 'Những giải đáp mộc mạc cho bà con cô bác và các bạn trẻ trong họ.'
  });
  mainContainer.appendChild(faqSection);

  const faqs = [
    {
      q: '1. Tôi là con cháu trong dòng họ nhưng chưa có tài khoản, làm sao để tham gia?',
      a: 'Rất đơn giản! Trang web Gia Tộc Trần Trọng Thu là không gian riêng tư của dòng họ. Để bảo đảm tính xác thực, tài khoản thành viên sẽ do Ban Quản Trị (hoặc người phụ trách gia đình) tạo và liên kết với vị trí của bạn trên cây phả hệ. Bạn chỉ cần liên hệ với Người quản trị (Tuấn / Trưởng ban) qua Zalo/Điện thoại hoặc điền biểu mẫu bên dưới, cung cấp họ tên và cha mẹ của bạn, Ban Quản Trị sẽ gửi tên đăng nhập và mật khẩu tạm để bạn kích hoạt.'
    },
    {
      q: '2. Lần đầu đăng nhập, tôi cần làm những gì?',
      a: 'Khi nhận được mật khẩu tạm, bạn vào trang Đăng nhập (/login), nhập tên tài khoản và mật khẩu tạm được cấp. Hệ thống sẽ tự động đưa bạn tới trang Đặt mật khẩu của bạn (/me/change-password). Bạn hãy đặt một mật khẩu riêng (ít nhất 8 ký tự) mà chỉ mình bạn biết. Sau bước này, tài khoản của bạn được kích hoạt chính thức!'
    },
    {
      q: '3. Tôi thấy năm sinh hoặc thông tin của người thân trong họ chưa chính xác, tôi sửa thế nào?',
      a: 'Bạn có thể vào trang hồ sơ của nhân vật đó trên Cây phả đồ và bấm nút [Gợi ý đính chính thông tin], hoặc vào mục [Đóng góp tư liệu & ký ức] (/me/contribute). Điền thông tin chuẩn xác kèm nguồn gốc (ví dụ: theo bia mộ, sổ thờ). Ban Quản Trị sẽ đối chiếu và cập nhật vào gia phả chung.'
    },
    {
      q: '4. Xem ngày kỵ giỗ của ông bà ở đâu?',
      a: 'Tại thanh menu thành viên, bạn chọn [Lịch giỗ & Niên biểu] (/me/events). Hệ thống đã tự động tính toán ngày âm lịch chuẩn xác và hiển thị các ngày giỗ sắp tới trong tháng để con cháu cùng nhớ về thắp hương tưởng niệm.'
    },
    {
      q: '5. Thông tin trên trang web có bị lộ ra ngoài Internet không?',
      a: 'Tuyệt đối không. Toàn bộ cây phả đồ, hồ sơ nhân vật, kho di ảnh và bài viết nội bộ đều được khóa chặn an toàn. Người ngoài Internet chỉ xem được trang giới thiệu cội nguồn chung, không thể tra cứu danh sách người thân hay dữ liệu riêng tư của dòng họ.'
    }
  ];

  const faqCards = faqs.map((f) => el('div', {
    class: 'gi-card',
    style: {
      padding: '18px 20px',
      border: '1px solid var(--color-border-subtle, #e7e5e4)',
      background: 'var(--color-surface-raised, #fff)',
      marginBottom: '12px'
    }
  }, [
    el('h4', {
      style: { margin: '0 0 8px', fontSize: '15.5px', fontFamily: 'var(--font-display-active, serif)', color: 'var(--color-brand-heritage, #8b261e)' },
      text: f.q
    }),
    el('p', {
      style: { margin: 0, fontSize: '14px', color: 'var(--color-text-secondary, #57534e)', lineHeight: '1.6' },
      text: f.a
    })
  ]));

  const faqContainer = el('div', { style: { marginBottom: '32px' } }, faqCards);
  faqSection.appendChild(faqContainer);

  // 3. Biểu mẫu gửi câu hỏi trực tiếp
  const contactSection = Section({
    id: 'contact-form',
    title: 'Gửi yêu cầu hoặc câu hỏi tới Ban Quản Trị',
    lead: 'Nếu bạn có bất kỳ câu hỏi nào chưa được giải đáp, xin hãy gửi lời nhắn tại đây.'
  });
  mainContainer.appendChild(contactSection);

  const formBox = el('div', {
    class: 'gi-card',
    style: {
      padding: '24px',
      border: '1px solid var(--color-border-subtle, #e7e5e4)',
      background: 'var(--color-surface-raised, #fff)',
      marginBottom: '32px'
    }
  });
  contactSection.appendChild(formBox);

  const helpForm = el('form', {
    style: { display: 'flex', flexDirection: 'column', gap: '14px' }
  }, [
    el('div', { id: 'help-error', class: 'gi-login-error', style: { display: 'none' }, role: 'alert' }),
    el('div', { id: 'help-success', style: { display: 'none' } }),

    el('div', {}, [
      el('label', { style: { display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }, text: 'Họ và tên của bạn' }),
      el('input', {
        type: 'text',
        id: 'help-name',
        required: true,
        placeholder: 'Ví dụ: Trần Trọng Hùng',
        style: { width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-subtle, #e7e5e4)', fontSize: '14px', boxSizing: 'border-box' }
      })
    ]),
    el('div', {}, [
      el('label', { style: { display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }, text: 'Số điện thoại hoặc Zalo liên lạc' }),
      el('input', {
        type: 'text',
        id: 'help-phone',
        required: true,
        placeholder: 'Ví dụ: 0912.345.678',
        style: { width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-subtle, #e7e5e4)', fontSize: '14px', boxSizing: 'border-box' }
      })
    ]),
    el('div', {}, [
      el('label', { style: { display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }, text: 'Nội dung câu hỏi hoặc yêu cầu cần giúp đỡ' }),
      el('textarea', {
        id: 'help-message',
        required: true,
        rows: '4',
        placeholder: 'Ví dụ: Tôi là con của bác... ở chi nhánh... nhờ gia đình hỗ trợ tạo tài khoản giúp tôi.',
        style: { width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-subtle, #e7e5e4)', fontSize: '14px', lineHeight: '1.6', boxSizing: 'border-box', fontFamily: 'inherit' }
      })
    ]),
    el('button', {
      class: 'gi-btn gi-btn--primary',
      type: 'submit',
      id: 'btn-help-submit',
      style: { padding: '12px', fontSize: '15px' },
      text: 'Gửi yêu cầu tới Ban Quản Trị Gia Tộc'
    })
  ]);

  helpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errBox = document.getElementById('help-error');
    const succBox = document.getElementById('help-success');
    const submitBtn = document.getElementById('btn-help-submit');

    errBox.style.display = 'none';
    succBox.style.display = 'none';

    const name = document.getElementById('help-name').value;
    const phone = document.getElementById('help-phone').value;
    const msg = document.getElementById('help-message').value;

    submitBtn.disabled = true;
    submitBtn.innerText = 'Đang gửi...';

    try {
      const res = await fetch('/api/member/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'SUPPORT_REQUEST',
          subject: `Yêu cầu hỗ trợ từ ${name}`,
          message: `${msg}\n\n[Họ tên người gửi]: ${name}\n[Liên hệ]: ${phone}`,
          contactInfo: phone
        })
      });

      const data = await res.json();
      if (res.ok) {
        helpForm.style.display = 'none';
        succBox.innerHTML = `
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; text-align: center; border-radius: 2px;">
            <p style="font-size: 28px; margin: 0 0 8px;">📬</p>
            <h4 style="margin: 0 0 6px; color: #166534; font-size: 17px;">Yêu cầu đã được gửi thành công!</h4>
            <p style="margin: 0; font-size: 14px; color: #15803d; line-height: 1.6;">
              Cảm ơn bạn! Ban Quản Trị gia tộc đã nhận được tin nhắn và sẽ liên lạc lại qua số điện thoại/Zalo <strong>${phone}</strong> trong thời gian sớm nhất.
            </p>
          </div>
        `;
        succBox.style.display = 'block';
      } else {
        errBox.innerText = data.error || 'Không thể gửi yêu cầu lúc này. Vui lòng thử lại sau.';
        errBox.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.innerText = 'Gửi yêu cầu tới Ban Quản Trị Gia Tộc';
      }
    } catch {
      errBox.innerText = 'Lỗi kết nối máy chủ. Vui lòng thử lại sau.';
      errBox.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.innerText = 'Gửi yêu cầu tới Ban Quản Trị Gia Tộc';
    }
  });

  formBox.appendChild(helpForm);

  return content;
}

