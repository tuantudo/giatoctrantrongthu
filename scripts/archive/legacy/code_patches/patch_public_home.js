const fs = require('fs');
const path = 'src/css/foundation/components.css';
let css = fs.readFileSync(path, 'utf8');

// Remove old .gi-split-composition and .gi-zone--voice
css = css.replace(/\.gi-split-composition \{[\s\S]*?\}\n\}/, '');
css = css.replace(/\.gi-zone--voice \{[\s\S]*?\}/, '');
css = css.replace(/\.gi-sectionmark \{[\s\S]*?\}\n\}/, '');
css = css.replace(/\.gi-sectionmark__[\s\S]*?\}/g, '');

const newCss = `
/* =============================================================================
   PUBLIC HOME — DICHOTOMY COMPOSITION v0.4
   ========================================================================== */

.gi-dichotomy {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px 120px;
}

@media (max-width: 900px) {
  .gi-dichotomy {
    grid-template-columns: 1fr;
    gap: 64px;
    padding: 0 24px 80px;
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

/* OUTWARD PATH: Deliberate Silence */
.gi-voice__absence {
  padding: 48px 0;
}
.gi-voice__absence-line {
  font-family: var(--font-text-active);
  font-style: italic;
  font-size: var(--type-h3-size);
  color: var(--color-text-muted);
  margin: 0;
  line-height: 1.6;
}

/* INWARD PATH: Member Gate */
.gi-gate__door {
  display: flex;
  flex-direction: column;
  padding: 40px;
  border: 1px solid var(--color-border-strong);
  text-decoration: none;
  color: inherit;
  background-color: var(--color-bg);
  transition: background-color 0s, color 0s; /* Instant, no fade */
}
.gi-gate__door:hover, .gi-gate__door:focus {
  background-color: var(--color-text);
  color: var(--color-bg);
}
.gi-gate__door:hover .gi-gate__door-hint, 
.gi-gate__door:focus .gi-gate__door-hint {
  color: var(--color-bg);
  opacity: 0.8;
}

.gi-gate__door-label {
  font-family: var(--font-display-active);
  font-size: var(--type-h2-size);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
}
.gi-gate__door-hint {
  font-family: var(--font-text-active);
  font-size: var(--type-body-size);
  color: var(--color-text-secondary);
  line-height: 1.5;
}
`;

css += '\n' + newCss;
fs.writeFileSync(path, css);
