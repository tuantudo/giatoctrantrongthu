/**
 * GIATOC UI SYSTEM vNEXT — requests.js
 * Member Requests & Contribution Tracking (/me/requests)
 *
 * Allows family members to track their submitted proposals, corrections,
 * and support requests with transparent, human-friendly status updates.
 */

import { el, clear } from './dom.js';
import { PageHeader, Section } from './components.js';
import { Region, StatePanel, STATE } from './states.js';

function formatDate(isoStr) {
  if (!isoStr) return '';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  } catch {
    return isoStr;
  }
}

function fieldLabel(field) {
  const map = {
    birthYear: 'Năm sinh',
    deathYear: 'Năm mất',
    name: 'Họ và tên',
    gender: 'Giới tính',
    notes: 'Tiểu sử / Ghi chú',
    burial: 'Nơi an nghỉ (Mộ phần)',
    FACT_UPDATE: 'Đính chính thông tin phả hệ',
    MEDIA_CONTRIBUTION: 'Đóng góp di ảnh & hiện vật',
    STORY_CONTRIBUTION: 'Kể lại ký ức & câu chuyện',
    SUPPORT_REQUEST: 'Yêu cầu trợ giúp thành viên'
  };
  return map[field] || field || 'Đóng góp thông tin';
}

function parseContent(val) {
  if (!val) return '';
  if (typeof val === 'string' && val.startsWith('{') && val.endsWith('}')) {
    try {
      const obj = JSON.parse(val);
      if (obj.message) return obj.message;
      if (obj.subject) return `${obj.subject}: ${obj.message || ''}`;
    } catch {
      return val;
    }
  }
  return val;
}

export function renderRequests(content, context) {
  content.appendChild(PageHeader({
    title: 'Đóng góp & Yêu cầu của tôi',
    lead: 'Theo dõi tiến trình tiếp nhận, đối chiếu và phản hồi từ Ban Quản Trị gia tộc.'
  }));

  const topBar = el('div', {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '12px',
      marginBottom: '24px'
    }
  }, [
    el('p', {
      style: { margin: 0, fontSize: '14px', color: 'var(--color-text-secondary, #57534e)' },
      text: 'Mọi đề xuất sửa đổi và tư liệu gửi lên đều được Ban Quản Trị lưu giữ cẩn trọng.'
    }),
    el('a', {
      class: 'gi-btn gi-btn--primary',
      href: '/me/contribute',
      text: '✍️ Gửi đóng góp mới'
    })
  ]);
  content.appendChild(topBar);

  const listZone = el('div', { id: 'zone-my-proposals', class: 'gi-stack' });
  content.appendChild(listZone);

  Region(listZone, {
    load: async () => {
      const res = await fetch('/api/member/proposals/my');
      if (!res.ok) throw new Error('Không thể tải danh sách đề xuất');
      const data = await res.json();
      return data.proposals || [];
    },
    render: (proposals) => {
      if (!proposals || proposals.length === 0) {
        return StatePanel({
          state: STATE.EMPTY,
          title: 'Chưa có đóng góp hoặc yêu cầu nào',
          explanation: 'Bạn chưa gửi đề xuất đính chính phả hệ hoặc đóng góp tư liệu nào cho dòng họ. Hãy chia sẻ bức ảnh xưa hoặc mẩu chuyện kỷ niệm của gia đình nhé!'
        });
      }

      const cards = proposals.map((p) => {
        const isPending = p.status === 'PENDING';
        const isApproved = p.status === 'APPROVED';
        const statusBadge = isPending
          ? el('span', {
              style: {
                background: '#fef3c7',
                color: '#92400e',
                fontSize: '12px',
                fontWeight: '600',
                padding: '3px 8px',
                borderRadius: '0'
              },
              text: '⏳ Đang chờ tiếp nhận & đối chiếu'
            })
          : (isApproved
              ? el('span', {
                  style: {
                    background: '#dcfce7',
                    color: '#166534',
                    fontSize: '12px',
                    fontWeight: '600',
                    padding: '3px 8px',
                    borderRadius: '0'
                  },
                  text: '✅ Đã phê duyệt vào phả hệ'
                })
              : el('span', {
                  style: {
                    background: '#fee2e2',
                    color: '#991b1b',
                    fontSize: '12px',
                    fontWeight: '600',
                    padding: '3px 8px',
                    borderRadius: '0'
                  },
                  text: 'ℹ️ Ban biên tập đã phản hồi'
                }));

        const targetPersonName = p.person_name ? `${p.person_name} (${p.person_id})` : (p.person_id === '@GENERAL@' ? 'Toàn gia tộc' : p.person_id);
        const displayValue = parseContent(p.suggested_value);

        return el('div', {
          class: 'gi-card',
          style: {
            padding: '20px',
            border: '1px solid var(--color-border-subtle, #e7e5e4)',
            background: 'var(--color-surface-raised, #fff)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }
        }, [
          el('div', {
            style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }
          }, [
            el('div', {}, [
              el('span', {
                style: { fontSize: '11px', color: 'var(--color-text-muted, #78716c)', letterSpacing: '0.05em' },
                text: `Mã số: ${p.id} · Ngày gửi: ${formatDate(p.created_at)}`
              }),
              el('h4', {
                style: { margin: '4px 0 0', fontSize: '16px', fontFamily: 'var(--font-display-active, serif)' },
                text: `${fieldLabel(p.field)} · ${targetPersonName}`
              })
            ]),
            statusBadge
          ]),
          el('div', {
            style: {
              background: 'var(--color-surface-sunken, #fafaf9)',
              padding: '12px 14px',
              borderLeft: '3px solid var(--color-brand-heritage, #8b261e)',
              fontSize: '14px',
              color: 'var(--color-text-primary, #1c1917)',
              lineHeight: '1.6'
            }
          }, [
            el('p', { style: { margin: '0 0 4px', fontWeight: '600', fontSize: '13px', color: 'var(--color-text-secondary, #57534e)' }, text: 'Nội dung đề xuất / Đóng góp:' }),
            el('p', { style: { margin: 0 }, text: displayValue })
          ]),
          p.reason ? el('p', {
            style: { margin: 0, fontSize: '13px', color: 'var(--color-text-muted, #78716c)' },
            text: `Lý do / Lời kể: ${p.reason}`
          }) : null,
          p.reviewer_note ? el('div', {
            style: {
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              padding: '10px 14px',
              borderRadius: '0',
              fontSize: '13.5px',
              color: '#166534'
            }
          }, [
            el('strong', { text: 'Ghi chú phản hồi từ Ban Quản Trị: ' }),
            el('span', { text: p.reviewer_note })
          ]) : null
        ]);
      });

      return el('div', { class: 'gi-stack' }, cards);
    },
    empty: {
      title: 'Không thể tải danh sách đề xuất',
      body: 'Xin vui lòng thử lại sau.'
    }
  });

  return content;
}

