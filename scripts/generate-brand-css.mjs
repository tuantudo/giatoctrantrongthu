#!/usr/bin/env node
/**
 * Brand System CSS Generator
 * 
 * Reads: brand/manifest.json
 * Writes: brand/generated/brand.css
 * 
 * DETERMINISTIC — running multiple times produces identical output.
 * DO NOT EDIT brand/generated/brand.css MANUALLY.
 * 
 * Usage: node scripts/generate-brand-css.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Read manifest
const manifest = JSON.parse(readFileSync(join(root, 'brand/manifest.json'), 'utf-8'));

// Extract confirmed/observed values
const { typography, colors, shape } = manifest;

// Generate CSS
const lines = [
  '/* ============================================',
  '   BRAND SYSTEM — GENERATED FROM MANIFEST',
  '   DO NOT EDIT MANUALLY',
  `   Source: brand/manifest.json`,
  '   ============================================ */',
  '',
  ':root {',
  '  /* === BRAND TYPOGRAPHY (Owner confirmed) === */',
  `  --font-brand: "${typography.family.value}", ${typography.family.fallback};`,
  '',
  '  /* Semantic aliases — derive from brand */',
  '  --font-serif: var(--font-brand);',
  '  --font-sans: var(--font-brand);',
  '  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;',
  '',
  '  /* === BRAND COLORS (Observed values — Owner to confirm) === */',
  `  --brand-primary: ${colors.brand.primary.value}; /* ${colors.brand.primary.name} — ${colors.brand.primary.status} */`,
  `  --brand-accent: ${colors.brand.accent.value};  /* ${colors.brand.accent.name} — ${colors.brand.accent.status} */`,
  `  --brand-ink: ${colors.brand.ink.value};        /* ${colors.brand.ink.name} — ${colors.brand.ink.status} */`,
  '',
  '  /* === SEMANTIC COLORS (Derived from brand) === */',
  '  --color-primary: var(--brand-primary);',
  '  --color-primary-hover: #701A2B;',
  '  --color-accent: var(--brand-accent);',
  '  --color-accent-hover: #92400E;',
  '  --color-ink: var(--brand-ink);',
  '  --color-ink-muted: #5C5B5A;',
  '',
  '  /* === SHAPE (Observed — Owner to confirm as brand invariant) === */',
  `  --radius: ${shape.radius.value};`,
  '}',
  ''
];

// Write output
writeFileSync(join(root, 'brand/generated/brand.css'), lines.join('\n'));

console.log('✓ Generated brand/generated/brand.css from brand/manifest.json');
