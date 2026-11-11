const fs = require('fs');

// 1. UPDATE public-home.js
const jsPath = 'src/js/ui/public-home.js';
const jsContent = `import { el } from './dom.js';

export function renderPublicHome(content, context, assets = null) {
  const container = el('div', { class: 'gi-archive-entrance' }, []);

  // A. HERO (The Monument)
  const hero = el('div', { class: 'gi-archive-hero' }, [
    el('h1', { class: 'gi-archive-hero__name', text: 'Gia Tộc Trần Trọng Thu' }),
    el('p', { class: 'gi-archive-hero__line', text: 'Nơi lưu giữ ký ức, hồ sơ và tiếng nói của một gia tộc.' })
  ]);

  // B. INTRODUCTION (Tự Sự)
  // Limited reading measure, center axis
  const intro = el('section', { class: 'gi-archive-intro' }, [
    el('p', { class: 'gi-archive-intro__text', text: 'Đây là không gian chính thức của gia tộc trên mạng: nơi những điều thuộc về gia tộc được ghi lại và giữ theo thời gian.' })
  ]);

  // C. MEMBER GATE (Cửa Vào Nội Bộ)
  // Not a button, but a discrete structural transition
  const gate = el('section', { class: 'gi-archive-gate' }, [
    el('h2', { class: 'gi-archive-gate__title', text: 'Người trong gia tộc' }),
    el('a', { class: 'gi-archive-gate__link', href: '/login', 'data-gate': 'member-space' }, [
      el('span', { class: 'gi-archive-gate__action', text: 'VÀO KHÔNG GIAN CỦA GIA TỘC →' }),
      el('span', { class: 'gi-archive-gate__hint', text: 'Dành riêng cho những người trong nhà.' })
    ])
  ]);

  container.appendChild(hero);
  container.appendChild(intro);
  container.appendChild(gate);
  
  content.appendChild(container);

  return content;
}
`;
fs.writeFileSync(jsPath, jsContent);

// 2. UPDATE components.css
const cssPath = 'src/css/foundation/components.css';
let css = fs.readFileSync(cssPath, 'utf8');

// Strip out old threshold and grid
css = css.replace(/\.gi-threshold \{[\s\S]*?\}\n\}/g, '');
css = css.replace(/\.gi-threshold__[\s\S]*?\}/g, '');
css = css.replace(/\/\* ===* PUBLIC HOME — ARCHITECTURE COMPOSITION v0\.6 ===* \/([\s\S]*)/, '');

const newCss = `
/* =============================================================================
   PUBLIC HOME — ARCHIVE ENTRANCE v0.3
   ========================================================================== */

.gi-archive-entrance {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 120px 24px;
  text-align: center;
}

/* HERO */
.gi-archive-hero {
  margin-bottom: 80px;
}
.gi-archive-hero__name {
  font-family: var(--font-display-active);
  font-size: clamp(40px, 6vw, 64px);
  font-weight: 700;
  line-height: 1.1;
  color: var(--color-text);
  margin: 0 0 24px 0;
  letter-spacing: -0.02em;
  text-transform: uppercase;
}
.gi-archive-hero__line {
  font-family: var(--font-text-active);
  font-size: var(--type-h3-size);
  color: var(--color-text-secondary);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

/* INTRODUCTION */
.gi-archive-intro {
  margin-bottom: 100px;
  max-width: 500px;
}
.gi-archive-intro__text {
  font-family: var(--font-text-active);
  font-size: var(--type-h4-size);
  color: var(--color-text-secondary);
  line-height: 1.8;
  margin: 0;
}

/* MEMBER GATE */
.gi-archive-gate {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 64px;
  border-top: 1px solid var(--color-border-strong);
  width: 100%;
}
.gi-archive-gate__title {
  font-family: var(--font-display-active);
  font-size: var(--type-h4-size);
  font-weight: 400;
  color: var(--color-text-secondary);
  margin: 0 0 24px 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.gi-archive-gate__link {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: var(--color-text);
  transition: opacity 0.2s;
}
.gi-archive-gate__link:hover, .gi-archive-gate__link:focus {
  opacity: 0.6;
}
.gi-archive-gate__action {
  font-family: var(--font-display-active);
  font-size: var(--type-h3-size);
  font-weight: 700;
  margin-bottom: 12px;
  letter-spacing: 0.05em;
}
.gi-archive-gate__hint {
  font-family: var(--font-text-active);
  font-size: var(--type-body-size);
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .gi-archive-entrance {
    padding: 80px 24px;
  }
  .gi-archive-hero {
    margin-bottom: 64px;
  }
  .gi-archive-intro {
    margin-bottom: 80px;
  }
}
`;

fs.writeFileSync(cssPath, css + newCss);
console.log('Patched JS and CSS.');
