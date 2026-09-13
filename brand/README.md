# Brand System

## Canonical Source

`brand/manifest.json` is the single source of truth for brand values.

## How to Change Brand Values

1. Edit `brand/manifest.json`
2. Run: `node scripts/generate-brand-css.mjs`
3. The generated CSS at `brand/generated/brand.css` updates automatically
4. Refresh browser — changes propagate everywhere

## Status Labels

| Label | Meaning |
|-------|---------|
| **CONFIRMED** | Owner has explicitly decided |
| **OBSERVED** | Currently in use, not yet confirmed as brand truth |
| **UNRESOLVED** | Needs Owner decision |

## Current Confirmed Values

| Category | Value | Status |
|----------|-------|--------|
| Brand font | Times New Roman | CONFIRMED |
| Logo primary | `assets/images/logoGiaToc_ngang.svg` | CONFIRMED |

## Observed Values (Not Confirmed)

| Category | Value | Note |
|----------|-------|------|
| Primary color | `#881337` | Used as --lacquer-red, --primary |
| Accent color | `#B45309` | Used as --imperial-gold |
| Ink color | `#1A1A1A` | Used for primary text |
| Radius | `0` | Flat 2D throughout CSS |

## Do NOT Edit

- `brand/generated/brand.css` — auto-generated, changes will be overwritten by generator

## File Structure

```
brand/
├── manifest.json              # Canonical source (edit this)
├── README.md                  # This file
└── generated/
    └── brand.css              # Generated output (DO NOT EDIT)

scripts/
└── generate-brand-css.mjs     # Generator script
```
