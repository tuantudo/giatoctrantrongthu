const fs = require('fs');
let code = fs.readFileSync('src/css/foundation/states.css', 'utf8');

code = code.replace(
  `  background-color: var(--color-surface-sunken);
  border: 1px dashed var(--color-border-default);
  border-radius: var(--radius-md);`,
  `  border-top: 1px solid var(--color-border-subtle);
  border-bottom: 1px solid var(--color-border-subtle);`
);

code = code.replace(
  `  border: 1px solid var(--color-state-danger-border);
  border-radius: var(--radius-md);`,
  `  border: 1px solid var(--color-state-danger-border);`
);

code = code.replace(
  `  border: 1px solid var(--color-state-warning-border);
  border-radius: var(--radius-md);`,
  `  border: 1px solid var(--color-state-warning-border);`
);

code = code.replace(
  `  background-color: var(--color-surface-sunken);
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-md);`,
  `  border-top: 1px solid var(--color-border-subtle);
  border-bottom: 1px solid var(--color-border-subtle);`
);

fs.writeFileSync('src/css/foundation/states.css', code);
