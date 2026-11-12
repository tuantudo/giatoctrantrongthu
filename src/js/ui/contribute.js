/**
 * GIATOC UI SYSTEM vNEXT — contribute.js
 * Member Contribution Center (/me/contribute)
 *
 * Provides a warm, intuitive form for members to contribute:
 * - Historical photos & heirlooms (Di ảnh & Kỷ vật)
 * - Oral history & memories (Ký ức & Lời kể)
 * - Genealogical facts & corrections (Đính chính thông tin phả hệ)
 */

import { el, clear } from './dom.js';
import { PageHeader, Section } from './components.js';

export function renderContribute(content, context) {
  content.appendChild(PageHeader({
    title: 'Đóng góp di ảnh, tư liệu & ký ức',
    lead: 'Mỗi kỷ vật, câu chuyện hay lời kể của bạn đều góp phần làm sống động di sản của Gia Tộc Trần Trọng Thu.'
  }));

  const formCard = el('div', {
    class: 'gi-card',
    style: {
      padding: '24px',
      border: '1px solid var(--color-border-subtle, #e7e5e4)',
      background: 'var(--color-surface-raised, #fff)',
      maxWidth: '720px',
      margin: '0 auto 32px'
    }
  });
  content.appendChild(formCard);

  let activeType = 'MEDIA_CONTRIBUTION';

  const typeButtons = [
    { type: 'MEDIA_CONTRIBUTION', icon: '🖼️', label: 'Di ảnh & Kỷ vật' },
    { type: 'STORY_CONTRIBUTION', icon: '📖', label: 'Ký ức & Lời kể' },
    { type: 'FACT_UPDATE', icon: '✍️', label: 'Đính chính phả hệ' }
  ];

  const typeSelector = el('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '8px',
      marginBottom: '24px'
    }
  });

  const formBody = el('div', {});

  function renderForm() {
    clear(formBody);

    const isMedia = activeType === 'MEDIA_CONTRIBUTION';
    const isStory = activeType === 'STORY_CONTRIBUTION';
    const isFact = activeType === 'FACT_UPDATE';

    const introText = isMedia
      ? 'Gửi tặng dòng họ những bức ảnh xưa của ông bà, cha mẹ hoặc ảnh chụp gia bảo, văn bia, mộ phần.'
      : (isStory
          ? 'Kể lại những kỷ niệm ấm áp, lời dặn của người xưa hoặc các biến cố lịch sử mà người thân đã trải qua.'
          : 'Đề xuất sửa đổi năm sinh, năm mất, quê quán hoặc bổ sung thông tin một người thân trong phả hệ.');

    const form = el('form', {
      style: { display: 'flex', flexDirection: 'column', gap: '16px' }
    }, [
      el('p', {
        style: { fontSize: '14px', color: 'var(--color-text-secondary, #57534e)', lineHeight: '1.6', margin: '0 0 8px' },
        text: introText
      }),
      el('div', { id: 'contribute-error', class: 'gi-login-error', style: { display: 'none' }, role: 'alert' }),
      el('div', { id: 'contribute-success', style: { display: 'none' } }),

      // Tiêu đề
      el('div', {}, [
        el('label', {
          style: { display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' },
          text: isMedia ? 'Tên bức ảnh / Kỷ vật' : (isStory ? 'Tiêu đề câu chuyện' : 'Thông tin cần đính chính')
        }),
        el('input', {
          type: 'text',
          id: 'contrib-subject',
          required: true,
          placeholder: isMedia ? 'Ví dụ: Ảnh cưới cụ Hạnh - cụ Đào năm 1954' : (isStory ? 'Ví dụ: Kỷ niệm ngày dời nhà vào Nam' : 'Ví dụ: Năm sinh của cụ Trần Trọng Thu'),
          style: {
            width: '100%',
            padding: '10px 12px',
            border: '1px solid var(--color-border-subtle, #e7e5e4)',
            fontSize: '14px',
            boxSizing: 'border-box'
          }
        })
      ]),

      // Nhân vật liên quan
      el('div', {}, [
        el('label', {
          style: { display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' },
          text: 'Nhân vật liên quan trong gia đình (nếu biết)'
        }),
        el('input', {
          type: 'text',
          id: 'contrib-person',
          placeholder: 'Ví dụ: Cụ Giuse Trần Trọng Thu, hoặc Bác Trần Trọng Hùng...',
          style: {
            width: '100%',
            padding: '10px 12px',
            border: '1px solid var(--color-border-subtle, #e7e5e4)',
            fontSize: '14px',
            boxSizing: 'border-box'
          }
        })
      ]),

      // Nội dung chi tiết
      el('div', {}, [
        el('label', {
          style: { display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' },
          text: isMedia ? 'Mô tả bức ảnh (Thời gian chụp, những ai có mặt trong ảnh...)' : 'Nội dung chi tiết câu chuyện / Lời kể'
        }),
        el('textarea', {
          id: 'contrib-message',
          required: true,
          rows: '6',
          placeholder: isMedia
            ? 'Bức ảnh này được chụp vào dịp tết năm... Người ngồi giữa là... Bức ảnh hiện do gia đình bác... lưu giữ.'
            : 'Lời kể của bác... dặn lại con cháu: ...',
          style: {
            width: '100%',
            padding: '10px 12px',
            border: '1px solid var(--color-border-subtle, #e7e5e4)',
            fontSize: '14px',
            lineHeight: '1.6',
            boxSizing: 'border-box',
            fontFamily: 'inherit'
          }
        })
      ]),

      // Nguồn gốc / Chứng cứ
      el('div', {}, [
        el('label', {
          style: { display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' },
          text: 'Nguồn gốc thông tin / Chứng cứ (Sổ thờ, bia mộ, lời kể của ai...)'
        }),
        el('input', {
          type: 'text',
          id: 'contrib-evidence',
          placeholder: 'Ví dụ: Theo gia phả giấy lưu tại từ đường / Theo lời cụ bà kể lại',
          style: {
            width: '100%',
            padding: '10px 12px',
            border: '1px solid var(--color-border-subtle, #e7e5e4)',
            fontSize: '14px',
            boxSizing: 'border-box'
          }
        })
      ]),

      // Thông tin liên hệ
      el('div', {}, [
        el('label', {
          style: { display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' },
          text: 'Số điện thoại / Zalo của bạn (để Ban Quản Trị tiện liên lạc hỏi thăm khi cần)'
        }),
        el('input', {
          type: 'text',
          id: 'contrib-contact',
          placeholder: 'Ví dụ: 0912.345.678',
          style: {
            width: '100%',
            padding: '10px 12px',
            border: '1px solid var(--color-border-subtle, #e7e5e4)',
            fontSize: '14px',
            boxSizing: 'border-box'
          }
        })
      ]),

      // Nút gửi
      el('div', { style: { marginTop: '8px' } }, [
        el('button', {
          class: 'gi-btn gi-btn--primary',
          type: 'submit',
          id: 'btn-submit-contrib',
          style: { width: '100%', padding: '12px', fontSize: '15px' },
          text: 'Gửi tới Ban Quản Trị Gia Tộc'
        })
      ])
    ]);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const errBox = document.getElementById('contribute-error');
      const succBox = document.getElementById('contribute-success');
      const submitBtn = document.getElementById('btn-submit-contrib');

      errBox.style.display = 'none';
      succBox.style.display = 'none';

      const subject = document.getElementById('contrib-subject').value;
      const personText = document.getElementById('contrib-person').value;
      const message = document.getElementById('contrib-message').value;
      const evidence = document.getElementById('contrib-evidence').value;
      const contactInfo = document.getElementById('contrib-contact').value;

      if (!message || message.trim().length < 5) {
        errBox.innerText = 'Vui lòng nhập nội dung chi tiết (ít nhất 5 ký tự).';
        errBox.style.display = 'block';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerText = 'Đang gửi...';

      try {
        const fullMessage = `${message}\n\n[Nhân vật liên quan]: ${personText || 'Không nêu'}\n[Nguồn gốc chứng cứ]: ${evidence || 'Không nêu'}`;
        const res = await fetch('/api/member/support', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: activeType,
            subject,
            message: fullMessage,
            contactInfo
          })
        });

        const data = await res.json();
        if (res.ok) {
          form.style.display = 'none';
          succBox.innerHTML = `
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 24px; text-align: center; border-radius: 0;">
              <p style="font-size: 32px; margin: 0 0 12px;">❤️</p>
              <h3 style="margin: 0 0 8px; color: #166534; font-family: var(--font-display-active, serif); font-size: 20px;">Cảm ơn tấm lòng của bạn!</h3>
              <p style="margin: 0 0 16px; font-size: 14.5px; color: #15803d; line-height: 1.6;">
                Đóng góp của bạn đã được chuyển tới Ban Quản Trị gia tộc với mã số <strong>${data.requestId || 'REQ_...'}</strong>.<br>
                Gia đình sẽ đối chiếu và lưu vào kho tàng chung của dòng họ.
              </p>
              <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                <a href="/me/requests" class="gi-btn gi-btn--primary">📋 Xem trạng thái yêu cầu của tôi</a>
                <a href="/me" class="gi-btn gi-btn--secondary">Về Không gian của tôi</a>
              </div>
            </div>
          `;
          succBox.style.display = 'block';
        } else {
          errBox.innerText = data.error || 'Không thể gửi yêu cầu lúc này. Vui lòng thử lại sau.';
          errBox.style.display = 'block';
          submitBtn.disabled = false;
          submitBtn.innerText = 'Gửi tới Ban Quản Trị Gia Tộc';
        }
      } catch (err) {
        errBox.innerText = 'Lỗi kết nối máy chủ. Vui lòng thử lại sau.';
        errBox.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.innerText = 'Gửi tới Ban Quản Trị Gia Tộc';
      }
    });

    formBody.appendChild(form);
  }

  function syncTypeSelector() {
    clear(typeSelector);
    typeButtons.forEach((btn) => {
      const isSelected = btn.type === activeType;
      const button = el('button', {
        type: 'button',
        style: {
          padding: '12px',
          border: isSelected ? '2px solid var(--color-brand-heritage, #8b261e)' : '1px solid var(--color-border-subtle, #e7e5e4)',
          background: isSelected ? 'var(--color-surface-sunken, #fafaf9)' : 'var(--color-surface-raised, #fff)',
          fontWeight: isSelected ? '700' : '500',
          color: isSelected ? 'var(--color-brand-heritage, #8b261e)' : 'var(--color-text-primary, #1c1917)',
          cursor: 'pointer',
          textAlign: 'center',
          fontSize: '13.5px'
        },
        text: `${btn.icon} ${btn.label}`
      });
      button.addEventListener('click', () => {
        activeType = btn.type;
        syncTypeSelector();
        renderForm();
      });
      typeSelector.appendChild(button);
    });
  }

  syncTypeSelector();
  renderForm();

  formCard.appendChild(typeSelector);
  formCard.appendChild(formBody);

  return content;
}

