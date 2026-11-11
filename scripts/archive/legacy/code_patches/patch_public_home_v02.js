const fs = require('fs');

const code = `
import { el } from './dom.js';

const FAMILY_NAME = 'Gia Tộc Trần Trọng Thu';
const THRESHOLD_LINE = 'Nơi lưu giữ ký ức, hồ sơ và tiếng nói của một gia tộc.';

const INSTITUTION_LINES = [
  'Đây là không gian chính thức của gia tộc trên mạng: nơi những điều thuộc về gia tộc được ghi lại và giữ theo thời gian.'
];

const VOICE_ABSENCE_LINE = 'Gia tộc chưa có điều muốn nói ra ngoài.';
const VOICE_ABSENCE_NOTE = 'Đây là nơi dành cho những điều gia tộc chủ động chọn để chia sẻ với bên ngoài. Hiện gia tộc chưa chọn nội dung nào, nên trang còn trống.';

function SectionMarker({ index, title, lead = null }) {
  return el('header', { class: 'gi-sectionmark' }, [
    el('span', { class: 'gi-sectionmark__index', 'aria-hidden': 'true', text: index }),
    el('div', { class: 'gi-sectionmark__head' }, [
      el('h2', { class: 'gi-sectionmark__title', text: title }),
      lead ? el('p', { class: 'gi-sectionmark__lead', text: lead }) : null
    ])
  ]);
}

export function renderPublicHome(content, context, assets = null) {
  // 1. FAMILY THRESHOLD: True H1 with high visual weight, acting as Masthead
  content.appendChild(el('div', { class: 'gi-threshold', id: 'threshold' }, [
    el('h1', { class: 'gi-threshold__name', text: FAMILY_NAME }),
    el('p', { class: 'gi-threshold__line', text: THRESHOLD_LINE })
  ]));

  // 2. COMMUNICATION: Tiếng nói của gia tộc
  content.appendChild(el('section', { class: 'gi-zone gi-zone--voice', id: 'voice' }, [
    SectionMarker({ index: '01', title: 'Tiếng nói của gia tộc' }),
    el('div', { class: 'gi-voice', id: 'zone-voice' }, [
      el('div', {
        class: 'gi-voice__absence',
        'data-state': 'not-available'
      }, [
        el('p', { class: 'gi-voice__absence-line', text: VOICE_ABSENCE_LINE }),
        el('p', { class: 'gi-voice__absence-note', text: VOICE_ABSENCE_NOTE })
      ])
    ])
  ]));

  // 3. ABOUT & 4. GATE: Split composition
  const splitGrid = el('div', { class: 'gi-split-composition' }, []);
  
  const aboutZone = el('section', { class: 'gi-zone gi-zone--about', id: 'family' }, [
    SectionMarker({ index: '02', title: 'Về gia tộc' }),
    el('div', { class: 'gi-prose' }, INSTITUTION_LINES.map(
      (line) => el('p', { class: 'gi-prose__line', text: line })
    ))
  ]);
  
  const gateZone = el('section', { class: 'gi-gate', id: 'gate' }, [
    SectionMarker({ index: '03', title: 'Người trong gia tộc' }),
    el('a', { class: 'gi-gate__door', href: '/login', 'data-gate': 'member-space' }, [
      el('span', { class: 'gi-gate__door-label', text: 'Vào không gian của gia tộc' }),
      el('span', { class: 'gi-gate__door-hint', text: 'Đăng nhập để xem hồ sơ gia tộc, ký ức và những trao đổi riêng của những người trong nhà.' })
    ])
  ]);

  splitGrid.appendChild(aboutZone);
  splitGrid.appendChild(gateZone);
  content.appendChild(splitGrid);

  return content;
}
`;
fs.writeFileSync('src/js/ui/public-home.js', code);
