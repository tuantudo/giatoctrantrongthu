const fs = require('fs');
let code = fs.readFileSync('src/css/foundation/components.css', 'utf8');

// Update gi-threshold to be centered and elegant
code = code.replace(
  /\.gi-threshold \{.*?\}/s,
  `.gi-threshold {
  padding: 120px 24px 64px;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}`
);

code = code.replace(
  /\.gi-threshold__name \{.*?\}/s,
  `.gi-threshold__name {
  font-family: var(--font-display-active);
  font-size: var(--type-display-size);
  line-height: var(--type-display-line);
  font-weight: var(--type-display-weight);
  color: var(--color-text);
  margin: 0 0 32px 0;
  letter-spacing: -0.02em;
}`
);

// Update section marks to match V0 elegance
code = code.replace(
  /\.gi-sectionmark \{.*?\}/s,
  `.gi-sectionmark {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 40px;
  border-bottom: 1px solid var(--color-border-subtle);
  padding-bottom: 16px;
}`
);
code = code.replace(
  /\.gi-sectionmark__index \{.*?\}/s,
  `.gi-sectionmark__index {
  font-family: var(--font-display-active);
  font-size: 1.125rem;
  color: var(--color-brand-accent, #B45309);
  font-weight: 700;
}`
);
code = code.replace(
  /\.gi-sectionmark__title \{.*?\}/s,
  `.gi-sectionmark__title {
  font-family: var(--font-display-active);
  font-size: var(--type-h2-size);
  font-weight: 400;
  color: var(--color-text);
  margin: 0;
}`
);

// Update gi-prose to match V0 editorial feel
code = code.replace(
  /\.gi-prose__line \{.*?\}/s,
  `.gi-prose__line {
  font-family: var(--font-text-active);
  font-size: var(--type-body-size);
  line-height: var(--type-body-line);
  color: var(--color-text);
  margin: 0 0 24px;
  max-width: 68ch;
}`
);

// Make the gate door an elegant centered link
code = code.replace(
  /\.gi-gate__door \{.*?\}/s,
  `.gi-gate__door {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 48px 24px;
  background-color: var(--color-surface-sunken);
  border: 1px solid var(--color-border-subtle);
  text-decoration: none;
  transition: all 0.2s ease;
  margin-top: 24px;
}`
);
code = code.replace(
  /\.gi-gate__door:hover \{.*?\}/s,
  `.gi-gate__door:hover {
  background-color: #F6F4F0;
  border-color: var(--color-brand-heritage, #881337);
}`
);
code = code.replace(
  /\.gi-gate__door-label \{.*?\}/s,
  `.gi-gate__door-label {
  font-family: var(--font-display-active);
  font-size: var(--type-h3-size);
  color: var(--color-brand-heritage, #881337);
  margin-bottom: 12px;
}`
);
code = code.replace(
  /\.gi-gate__door-hint \{.*?\}/s,
  `.gi-gate__door-hint {
  font-family: var(--font-text-active);
  font-size: var(--type-small-size);
  color: var(--color-text-secondary);
  max-width: 500px;
}`
);

fs.writeFileSync('src/css/foundation/components.css', code);
