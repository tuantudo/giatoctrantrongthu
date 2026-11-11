const fs = require('fs');

const code = `
import { el } from './dom.js';

const FAMILY_NAME = 'Gia Tộc Trần Trọng Thu';

const THRESHOLD_LINE = 'Nơi lưu giữ ký ức, hồ sơ và tiếng nói của một gia tộc.';

const INSTITUTION_LINES = [
  'Đây là không gian chính thức của gia tộc trên mạng: nơi những điều thuộc về gia tộc được ghi lại và giữ theo thời gian.',
  'Bên trong là những khoảng không gian dành riêng cho người trong nhà. Phần đó không mở ra cho người ngoài — và cũng không phải ai cũng cần thấy.'
];

const VOICE_ABSENCE_LINE = 'Gia tộc chưa có điều muốn nói ra ngoài.';
const VOICE_ABSENCE_NOTE = 'Phần này dành cho những điều gia tộc chọn để chia sẻ với bên ngoài. Hiện gia tộc chưa chọn nội dung nào, nên trang còn trống — và trang sẽ không tự lấy nội dung từ kho lưu trữ bên trong để lấp chỗ.';

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
  // 1. ANCHOR: Graphic Masthead
  content.appendChild(el('div', { class: 'gi-masthead' }, [
    el('img', { 
      src: '/assets/images/logoGiaToc_ngang.svg', 
      alt: FAMILY_NAME, 
      class: 'gi-masthead__logo' 
    })
  ]));

  // 2. ORIENTATION: Identity (replaces the textual H1 threshold)
  content.appendChild(el('div', { class: 'gi-identity', id: 'threshold' }, [
    el('h1', { class: 'sr-only', text: FAMILY_NAME }), // for screen readers
    el('div', { class: 'gi-identity__rule', 'aria-hidden': 'true' }),
    el('p', { class: 'gi-identity__line', text: THRESHOLD_LINE })
  ]));

  // 3. COMMUNICATION: Family Voice
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

  // 4. SPLIT COMPOSITION: Identity & Action
  const splitGrid = el('div', { class: 'gi-split-composition' }, []);
  
  // Left: About Family
  const aboutZone = el('section', { class: 'gi-zone gi-zone--about', id: 'family' }, [
    SectionMarker({ index: '02', title: 'Về gia tộc' }),
    el('div', { class: 'gi-prose' }, INSTITUTION_LINES.map(
      (line) => el('p', { class: 'gi-prose__line', text: line })
    ))
  ]);
  
  // Right: Member Gate
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
