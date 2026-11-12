/**
 * GIATOC UI SYSTEM vNEXT — letters.js
 * First-Class Content Domain: THƯ GỬI NHAU (LETTERS & LEGACY)
 *
 * Implements the epistolary heritage space where family members create,
 * preserve, and transmit intergenerational letters, wisdom, and reflections.
 *
 * Architecture Invariants:
 * - Epistolary dignity: Serif typography, spacious layout, zero chat/social noise.
 * - Multi-dimensional recipient scoping: Individual, Branch, Family, Future Generations.
 * - Clara Preservation: 8 historical Clara letters remain restricted under BRANCH_RESTRICTED_P0.
 */

import { el, clear } from './dom.js';
import { PageHeader, Section } from './components.js';
import { Region, StatePanel, STATE } from './states.js';
import { api } from './data.js';

// Sample canonical seed letters for the initial preview / dev environment
const SAMPLE_LETTERS = [
  {
    id: 'LTR_2026_001',
    title: 'Gửi các cháu ngày giỗ Tổ họ Trần',
    subtitle: 'Lời dặn dò con cháu giữ gìn nền nếp gia phong và tình đoàn kết huyết thống',
    author_name: 'Bác Trần Trọng Hùng',
    author_kinship: 'Bác ruột (Chi trưởng)',
    recipient_type: 'FAMILY',
    recipient_label: 'Toàn thể con cháu Gia Tộc Trần Trọng Thu',
    date: '2026-10-15',
    scope: 'FAMILY_WIDE',
    legacy_intent: 'FAMILY_ARCHIVE',
    body: `Các cháu thương quý,\n\nNhân ngày giỗ Cố Thu năm nay, khi ngồi đối chiếu lại những trang sổ thờ gia phả, bác muốn gửi gắm tới các cháu đôi lời tâm huyết.\n\nDòng họ ta qua bao biến cố thăng trầm của lịch sử, từ Bắc vào Nam, từ thời chiến tranh bom đạn cho đến ngày hôm nay, tài sản lớn nhất mà tổ tiên truyền lại không phải là ruộng vườn hay vàng bạc, mà chính là chữ "Nhân", là tấm lòng hiếu thảo và sự đùm bọc giữa anh chị em trong họ.\n\nCác cháu dù đi đâu, lập nghiệp ở phương trời nào, làm bất cứ nghề gì trong xã hội, hãy luôn nhớ về gốc rễ cội nguồn. Cây có gốc mới nở ngành xanh ngọn, nước có nguồn mới biển rộng sông sâu. Hãy luôn sống trung thực, yêu thương gia đình và sẵn sàng chìa tay giúp đỡ nhau khi gặp hoạn nạn.\n\nBác mong những dòng chữ này sẽ được lưu giữ lại mãi về sau, để đến đời con, đời cháu của các cháu, khi mở cây gia phả này ra, vẫn cảm nhận được hơi ấm và tình thương của những người đi trước.\n\nThương mến chúc các cháu bình an và thành đạt.`
  },
  {
    id: 'LTR_2026_002',
    title: 'Bức thư gửi thế hệ mai sau — 50 năm ngày dựng nghiệp',
    subtitle: 'Lưu giữ ký ức về thời kỳ đầu xây dựng nền móng công nghệ cho gia phả',
    author_name: 'Trần Quang Tuấn',
    author_kinship: 'Hậu duệ đời thứ 4',
    recipient_type: 'FUTURE',
    recipient_label: 'Con cháu thế hệ tương lai (Mở vào năm 2050)',
    date: '2026-11-11',
    scope: 'TIME_CAPSULE',
    legacy_intent: 'FAMILY_ARCHIVE',
    body: `Gửi những người thân của tôi ở tương lai xa,\n\nKhi các bạn đọc những dòng này, có thể thế giới đã thay đổi rất nhiều so với thời điểm tôi đang ngồi gõ từng dòng chữ vào năm 2026. Công nghệ có thể đã tiến xa vượt bậc, nhưng tôi tin rằng niềm khao khát được biết mình là ai, tổ tiên mình đã từng sống và yêu thương như thế nào vẫn luôn vẹn nguyên trong trái tim mỗi con người.\n\nNền tảng số này được chúng tôi dựng nên không phải để phô trương, mà là để nhặt nhạnh từng mảnh ký ức: một tấm ảnh thẻ bạc màu, một ngày giỗ xưa bên mâm cơm gia đình, một bức thư tay đầy xúc động.\n\nHy vọng các bạn sẽ tiếp tục giữ gìn ngọn lửa này cho những thế hệ tiếp nối.`
  }
];

export function renderLetters(content, context) {
  content.appendChild(PageHeader({
    title: 'Thư Gửi Nhau · Letters & Legacy',
    lead: 'Không gian sáng tạo, lưu giữ và truyền trao những bức thư, lời nhắn nhủ và di sản tinh thần giữa các thế hệ.'
  }));

  const mainWrapper = el('div', { class: 'gi-stack', style: { maxWidth: '860px', margin: '0 auto 40px' } });
  content.appendChild(mainWrapper);

  let activeTab = 'inbox'; // 'inbox' | 'sent' | 'compose'
  let readingLetter = null;

  const tabContainer = el('div', {
    style: {
      display: 'flex',
      gap: '8px',
      borderBottom: '1px solid var(--color-border-subtle, #e7e5e4)',
      marginBottom: '24px',
      flexWrap: 'wrap'
    }
  });
  mainWrapper.appendChild(tabContainer);

  const viewZone = el('div', { id: 'zone-letters-content' });
  mainWrapper.appendChild(viewZone);

  function renderTabs() {
    clear(tabContainer);

    const tabs = [
      { key: 'inbox', label: '✉️ Thư tôi nhận được', icon: '✉️' },
      { key: 'sent', label: '📤 Thư tôi đã gửi', icon: '📤' },
      { key: 'compose', label: '✍️ Soạn thư di sản mới', icon: '✍️' }
    ];

    if (typeof window !== 'undefined' && window.__CLARA_ELIGIBLE__) {
      tabs.push({ key: 'clara', label: '📜 Kỷ vật Thư gửi Clara', icon: '📜', isClara: true });
    }

    tabs.forEach((t) => {
      const isSelected = activeTab === t.key && !readingLetter;
      const btn = el('button', {
        type: 'button',
        style: {
          padding: '10px 16px',
          border: 'none',
          borderBottom: isSelected ? '3px solid var(--color-brand-heritage, #8b261e)' : '3px solid transparent',
          background: 'none',
          fontWeight: isSelected ? '700' : '500',
          color: isSelected ? 'var(--color-brand-heritage, #8b261e)' : 'var(--color-text-secondary, #57534e)',
          fontSize: '14px',
          cursor: 'pointer'
        },
        text: t.label
      });

      btn.addEventListener('click', () => {
        if (t.isClara) {
          window.location.href = '/me/clara';
          return;
        }
        readingLetter = null;
        activeTab = t.key;
        renderTabs();
        renderView();
      });

      tabContainer.appendChild(btn);
    });
  }

  function renderDetail(letter) {
    clear(viewZone);

    const backBtn = el('button', {
      type: 'button',
      class: 'gi-btn gi-btn--subtle',
      style: { marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px' },
      text: '← Trở về danh sách thư'
    });
    backBtn.addEventListener('click', () => {
      readingLetter = null;
      renderTabs();
      renderView();
    });

    const letterPaper = el('article', {
      class: 'gi-card gi-letter-paper',
      style: {
        padding: '36px 40px',
        border: '1px solid var(--color-border-subtle, #e7e5e4)',
        background: 'var(--color-surface-sunken, #fafaf9)',
        boxShadow: 'none',
        lineHeight: '1.8'
      }
    }, [
      // Header con dấu
      el('div', {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '1px solid var(--color-border-subtle, #e7e5e4)',
          paddingBottom: '16px',
          marginBottom: '24px'
        }
      }, [
        el('div', {}, [
          el('span', {
            style: {
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--color-brand-heritage, #8b261e)',
              fontWeight: '700',
              display: 'block',
              marginBottom: '4px'
            },
            text: 'DI SẢN THƯ TÍN GIA TỘC TRẦN TRỌNG THU'
          }),
          el('h2', {
            style: { margin: 0, fontSize: '24px', fontFamily: 'var(--font-display-active, serif)' },
            text: letter.title
          }),
          letter.subtitle ? el('p', {
            style: { margin: '4px 0 0', fontSize: '14px', color: 'var(--color-text-secondary, #57534e)', fontStyle: 'italic' },
            text: letter.subtitle
          }) : null
        ]),
        el('div', {
          style: {
            border: '2px dashed var(--color-brand-heritage, #8b261e)',
            padding: '6px 12px',
            textAlign: 'center',
            fontSize: '11px',
            color: 'var(--color-brand-heritage, #8b261e)',
            fontWeight: '700'
          }
        }, [
          el('div', { text: 'CHỨNG TÍCH' }),
          el('div', { text: letter.id })
        ])
      ]),

      // Meta dòng họ
      el('div', {
        style: {
          background: 'var(--color-surface-raised, #fff)',
          padding: '12px 16px',
          border: '1px solid var(--color-border-subtle, #f5f5f4)',
          marginBottom: '28px',
          fontSize: '13.5px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          color: 'var(--color-text-secondary, #57534e)'
        }
      }, [
        el('div', {}, [
          el('strong', { text: 'Người gửi: ' }),
          el('span', { text: `${letter.author_name} (${letter.author_kinship || 'Thành viên'})` })
        ]),
        el('div', {}, [
          el('strong', { text: 'Gửi tới: ' }),
          el('span', { text: letter.recipient_label })
        ]),
        el('div', {}, [
          el('strong', { text: 'Thời gian: ' }),
          el('span', { text: letter.date })
        ])
      ]),

      // Toàn văn bức thư
      el('div', {
        style: {
          fontSize: '16px',
          color: 'var(--color-text-primary, #1c1917)',
          fontFamily: 'var(--font-display-active, serif)',
          whiteSpace: 'pre-line',
          marginBottom: '32px'
        },
        text: letter.body
      }),

      // Chữ ký cuối thư
      el('div', {
        style: {
          textAlign: 'right',
          marginTop: '32px',
          borderTop: '1px solid var(--color-border-subtle, #f5f5f4)',
          paddingTop: '16px'
        }
      }, [
        el('p', {
          style: { margin: 0, fontStyle: 'italic', fontSize: '14px', color: 'var(--color-text-secondary, #57534e)' },
          text: 'Người gửi gắm tâm thư,'
        }),
        el('h4', {
          style: { margin: '4px 0 0', fontSize: '18px', fontFamily: 'var(--font-display-active, serif)' },
          text: letter.author_name
        })
      ])
    ]);

    viewZone.appendChild(backBtn);
    viewZone.appendChild(letterPaper);
  }

  function renderView() {
    clear(viewZone);

    if (readingLetter) {
      renderDetail(readingLetter);
      return;
    }

    if (activeTab === 'compose') {
      renderComposeForm();
      return;
    }

    // List view (Inbox or Sent)
    const list = activeTab === 'inbox'
      ? SAMPLE_LETTERS
      : SAMPLE_LETTERS.filter(l => l.author_name.includes('Tuấn')); // user's own sent letters

    if (list.length === 0) {
      const panel = StatePanel({
        state: STATE.EMPTY,
        title: activeTab === 'inbox' ? 'Chưa có lá thư nào gửi đến bạn' : 'Bạn chưa gửi lá thư nào',
        explanation: 'Hãy là người đầu tiên đặt bút viết những dòng thư di sản gửi gắm cho người thân hoặc con cháu mai sau.'
      });
      viewZone.appendChild(panel);
      return;
    }

    const cards = list.map((l) => {
      const card = el('div', {
        class: 'gi-card',
        style: {
          padding: '20px 24px',
          border: '1px solid var(--color-border-subtle, #e7e5e4)',
          background: 'var(--color-surface-raised, #fff)',
          marginBottom: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }
      }, [
        el('div', {
          style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }
        }, [
          el('span', {
            style: {
              background: '#fef3c7',
              color: '#92400e',
              fontSize: '11px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '0',
              letterSpacing: '0.05em'
            },
            text: l.recipient_type === 'FUTURE' ? '⏳ Gửi thế hệ tương lai' : (l.recipient_type === 'FAMILY' ? '📜 Thư gửi toàn họ' : '✉️ Thư riêng')
          }),
          el('span', {
            style: { fontSize: '12px', color: 'var(--color-text-muted, #78716c)' },
            text: l.date
          })
        ]),
        el('h3', {
          style: { margin: 0, fontSize: '18px', fontFamily: 'var(--font-display-active, serif)' },
          text: l.title
        }),
        el('p', {
          style: { margin: 0, fontSize: '13.5px', color: 'var(--color-text-secondary, #57534e)' },
          text: `${l.author_name} (${l.author_kinship}) ➔ ${l.recipient_label}`
        }),
        el('p', {
          style: { margin: '4px 0 0', fontSize: '14px', color: 'var(--color-text-primary, #1c1917)', lineHeight: '1.6' },
          text: l.body.length > 150 ? `${l.body.substring(0, 150)}...` : l.body
        }),
        el('div', { style: { marginTop: '8px' } }, [
          el('button', {
            type: 'button',
            class: 'gi-btn gi-btn--primary',
            style: { fontSize: '13px', padding: '6px 14px' },
            text: 'Đọc toàn văn bức thư →'
          })
        ])
      ]);

      card.querySelector('button').addEventListener('click', () => {
        readingLetter = l;
        renderTabs();
        renderDetail(l);
      });

      return card;
    });

    viewZone.appendChild(el('div', { class: 'gi-stack' }, cards));
  }

  function renderComposeForm() {
    clear(viewZone);

    const composeCard = el('div', {
      class: 'gi-card',
      style: {
        padding: '28px',
        border: '1px solid var(--color-border-subtle, #e7e5e4)',
        background: 'var(--color-surface-raised, #fff)'
      }
    }, [
      el('h3', {
        style: { margin: '0 0 8px', fontSize: '20px', fontFamily: 'var(--font-display-active, serif)', color: 'var(--color-brand-heritage, #8b261e)' },
        text: 'Soạn thảo Lá Thư Di Sản Mới'
      }),
      el('p', {
        style: { fontSize: '14px', color: 'var(--color-text-secondary, #57534e)', margin: '0 0 20px', lineHeight: '1.6' },
        text: 'Lá thư của bạn sẽ được lưu giữ cẩn trọng như một kỷ vật gia đình truyền lại cho các thế hệ.'
      }),

      el('form', {
        style: { display: 'flex', flexDirection: 'column', gap: '16px' }
      }, [
        el('div', {}, [
          el('label', { style: { display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }, text: 'Phạm vi tiếp nhận lá thư' }),
          el('select', {
            id: 'letter-scope',
            style: { width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-subtle, #e7e5e4)', fontSize: '14px' }
          }, [
            el('option', { value: 'INDIVIDUAL', text: 'Cá nhân một người thân trong họ' }),
            el('option', { value: 'BRANCH', text: 'Chi nhánh gia đình (con cháu của một cụ)' }),
            el('option', { value: 'FAMILY', text: 'Toàn thể bà con trong Gia Tộc Trần Trọng Thu' }),
            el('option', { value: 'FUTURE', text: 'Thế hệ tương lai (Mở khóa theo thời gian)' })
          ])
        ]),

        el('div', {}, [
          el('label', { style: { display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }, text: 'Người nhận cụ thể (Họ tên hoặc Danh xưng)' }),
          el('input', {
            type: 'text',
            id: 'letter-recipient-name',
            required: true,
            placeholder: 'Ví dụ: Con gái Clara, hoặc Toàn thể con cháu nhánh Cụ Hạnh...',
            style: { width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-subtle, #e7e5e4)', fontSize: '14px', boxSizing: 'border-box' }
          })
        ]),

        el('div', {}, [
          el('label', { style: { display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }, text: 'Tiêu đề bức thư' }),
          el('input', {
            type: 'text',
            id: 'letter-title',
            required: true,
            placeholder: 'Ví dụ: Lời dặn dò con cháu ngày mừng thọ',
            style: { width: '100%', padding: '10px 12px', border: '1px solid var(--color-border-subtle, #e7e5e4)', fontSize: '14px', boxSizing: 'border-box' }
          })
        ]),

        el('div', {}, [
          el('label', { style: { display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }, text: 'Nội dung tâm thư' }),
          el('textarea', {
            id: 'letter-body',
            required: true,
            rows: '10',
            placeholder: 'Kính gửi... / Con yêu quý...',
            style: {
              width: '100%',
              padding: '12px',
              border: '1px solid var(--color-border-subtle, #e7e5e4)',
              fontSize: '15px',
              lineHeight: '1.7',
              boxSizing: 'border-box',
              fontFamily: 'var(--font-display-active, serif)'
            }
          })
        ]),

        el('div', {
          style: {
            background: 'var(--color-surface-sunken, #fafaf9)',
            padding: '14px',
            border: '1px solid var(--color-border-subtle, #e7e5e4)'
          }
        }, [
          el('label', { style: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', cursor: 'pointer' } }, [
            el('input', { type: 'checkbox', id: 'letter-archive-consent', checked: true }),
            el('span', { text: 'Lưu giữ vĩnh viễn bức thư này trong kho tàng di sản số của gia tộc họ Trần.' })
          ])
        ]),

        el('div', { style: { display: 'flex', gap: '12px' } }, [
          el('button', {
            type: 'submit',
            class: 'gi-btn gi-btn--primary',
            style: { padding: '12px 24px', fontSize: '15px' },
            text: 'Gửi & Lưu vào Di Sản Gia Tộc'
          }),
          el('button', {
            type: 'button',
            class: 'gi-btn gi-btn--subtle',
            text: 'Hủy bỏ',
            click: () => { activeTab = 'inbox'; renderTabs(); renderView(); }
          })
        ])
      ])
    ]);

    composeCard.querySelector('form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('letter-title').value;
      const recipientName = document.getElementById('letter-recipient-name').value;
      const body = document.getElementById('letter-body').value;
      const scope = document.getElementById('letter-scope').value;

      // Add to sample list for immediate feedback
      const newLetter = {
        id: 'LTR_' + Date.now(),
        title,
        subtitle: `Thư gửi ${recipientName}`,
        author_name: 'Trần Quang Tuấn',
        author_kinship: 'Tác giả',
        recipient_type: scope,
        recipient_label: recipientName,
        date: new Date().toISOString().slice(0, 10),
        scope,
        legacy_intent: 'FAMILY_ARCHIVE',
        body
      };

      SAMPLE_LETTERS.unshift(newLetter);

      // Persist to support/proposal queue as a heritage record
      try {
        await fetch('/api/member/support', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'STORY_CONTRIBUTION',
            subject: `[Thư Di Sản]: ${title}`,
            message: `Người nhận: ${recipientName} (${scope})\n\n${body}`
          })
        });
      } catch {
        // Continue local feedback
      }

      activeTab = 'sent';
      renderTabs();
      renderView();
    });

    viewZone.appendChild(composeCard);
  }

  renderTabs();
  renderView();

  return content;
}

