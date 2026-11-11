const fs = require('fs');
let code = fs.readFileSync('src/css/foundation/tokens.css', 'utf8');

// Fix Font Stacks (Make Serif default for text as per Brand Governance)
code = code.replace(
  `  --font-display-active: 'Times New Roman', Times, Georgia, serif;
  --font-text-active: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;`,
  `  --font-display-active: 'Times New Roman', Times, Georgia, serif;
  --font-text-active: 'Times New Roman', Times, Georgia, serif; /* FIXED: Institutional Serif */`
);

// Fix Type Scale (Make it larger and more elegant like V0)
code = code.replace(
  `  --type-display-size: 2rem;    --type-display-line: 1.2;  --type-display-weight: 700;
  --type-h1-size: 1.625rem;     --type-h1-line: 1.25;       --type-h1-weight: 700;
  --type-h2-size: 1.375rem;     --type-h2-line: 1.3;        --type-h2-weight: 600;
  --type-h3-size: 1.125rem;     --type-h3-line: 1.4;        --type-h3-weight: 600;
  --type-h4-size: 1rem;         --type-h4-line: 1.4;        --type-h4-weight: 600;
  --type-body-size: 1rem;       --type-body-line: 1.6;      --type-body-weight: 400;`,
  `  --type-display-size: clamp(2.5rem, 5vw, 4.5rem); --type-display-line: 1.1; --type-display-weight: 400;
  --type-h1-size: clamp(2rem, 3vw, 2.75rem);     --type-h1-line: 1.2;       --type-h1-weight: 400;
  --type-h2-size: clamp(1.25rem, 1.5vw + 0.5rem, 1.75rem); --type-h2-line: 1.3; --type-h2-weight: 700;
  --type-h3-size: 1.25rem;      --type-h3-line: 1.4;        --type-h3-weight: 700;
  --type-h4-size: 1.125rem;     --type-h4-line: 1.4;        --type-h4-weight: 700;
  --type-body-size: 1.125rem;   --type-body-line: 1.7;      --type-body-weight: 400;`
);

fs.writeFileSync('src/css/foundation/tokens.css', code);
