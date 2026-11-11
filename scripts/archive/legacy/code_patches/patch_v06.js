const fs = require('fs');

// 1. UPDATE public-home.js
const jsPath = 'src/js/ui/public-home.js';
const jsContent = `import { el } from './dom.js';

export function renderPublicHome(content, context, assets = null) {
  // 1. FAMILY THRESHOLD
  content.appendChild(el('div', { class: 'gi-threshold', id: 'threshold' }, [
    el('h1', { class: 'gi-threshold__name', text: 'Gia Tộc Trần Trọng Thu' }),
    el('p', { class: 'gi-threshold__line', text: 'Nơi lưu giữ ký ức, hồ sơ và tiếng nói của một gia tộc.' })
  ]));

  // 2. PUBLIC ARCHITECTURE GRID
  const grid = el('div', { class: 'gi-public-grid' }, []);
  
  // OUTWARD VOICE (Deliberate Silence) - Occupies full width or a dominant block
  const voiceZone = el('section', { class: 'gi-path gi-path--voice', id: 'voice' }, [
    el('h2', { class: 'gi-path__title', text: 'Tiếng nói của gia tộc' }),
    el('div', { class: 'gi-voice__absence' }, [
      el('p', { class: 'gi-voice__absence-line', text: 'Gia tộc hiện chưa có điều muốn nói ra ngoài.' })
    ])
  ]);
  
  const splitBottom = el('div', { class: 'gi-public-grid__split' }, []);

  // INSTITUTIONAL ABOUT
  const aboutZone = el('section', { class: 'gi-path gi-path--about', id: 'about' }, [
    el('h2', { class: 'gi-path__title', text: 'Về gia tộc' }),
    el('p', { class: 'gi-path__body', text: 'Đây là không gian chính thức của gia tộc trên mạng: nơi những điều thuộc về gia tộc được ghi lại và giữ theo thời gian.' })
  ]);
  
  // INWARD GATE
  const inwardZone = el('section', { class: 'gi-path gi-path--inward', id: 'gate' }, [
    el('h2', { class: 'gi-path__title', text: 'Người trong gia tộc' }),
    el('a', { class: 'gi-gate__door', href: '/login', 'data-gate': 'member-space' }, [
      el('span', { class: 'gi-gate__door-label', text: 'Vào không gian của gia tộc' }),
      el('span', { class: 'gi-gate__door-hint', text: 'Dành riêng cho những người trong nhà.' })
    ])
  ]);

  splitBottom.appendChild(aboutZone);
  splitBottom.appendChild(inwardZone);

  grid.appendChild(voiceZone);
  grid.appendChild(splitBottom);
  
  content.appendChild(grid);

  return content;
}
`;
fs.writeFileSync(jsPath, jsContent);

// 2. UPDATE components.css
const cssPath = 'src/css/foundation/components.css';
let css = fs.readFileSync(cssPath, 'utf8');

// Remove old dichotomy styles
css = css.replace(/\/\* ===* PUBLIC HOME — DICHOTOMY COMPOSITION v0\.4 ===* \/([\s\S]*)/, '');

const newCss = `
/* =============================================================================
   PUBLIC HOME — ARCHITECTURE COMPOSITION v0.6
   ========================================================================== */

.gi-public-grid {
  display: flex;
  flex-direction: column;
  gap: 80px;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 24px 120px;
}

.gi-public-grid__split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
}

@media (max-width: 900px) {
  .gi-public-grid {
    gap: 64px;
    padding: 0 24px 80px;
  }
  .gi-public-grid__split {
    grid-template-columns: 1fr;
    gap: 64px;
  }
}

.gi-path {
  display: flex;
  flex-direction: column;
}

.gi-path__title {
  font-family: var(--font-display-active);
  font-size: var(--type-h2-size);
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 32px 0;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border-default);
}

.gi-path__body {
  font-family: var(--font-text-active);
  font-size: var(--type-h4-size);
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin: 0;
  max-width: 400px;
}

/* OUTWARD PATH: Deliberate Silence */
.gi-voice__absence {
  padding: 64px 0 32px;
}
.gi-voice__absence-line {
  font-family: var(--font-text-active);
  font-style: italic;
  font-size: var(--type-h3-size);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.6;
}

/* INWARD PATH: Member Gate */
.gi-gate__door {
  display: flex;
  flex-direction: column;
  padding: 32px 0;
  border-top: 1px solid var(--color-border-strong);
  border-bottom: 1px solid var(--color-border-strong);
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s;
}
.gi-gate__door:hover, .gi-gate__door:focus {
  opacity: 0.6;
}

.gi-gate__door-label {
  font-family: var(--font-display-active);
  font-size: var(--type-h2-size);
  font-weight: 700;
  margin-bottom: 12px;
}
.gi-gate__door-hint {
  font-family: var(--font-text-active);
  font-size: var(--type-body-size);
  color: var(--color-text-secondary);
  line-height: 1.5;
}
`;

fs.writeFileSync(cssPath, css + newCss);
console.log('Patched JS and CSS.');
