# GIATỘC — UI SYSTEM v0.2 (Design System Specification)

*Mission: DESIGN — GIATỘC UI SYSTEM v0.2 + APPLICATION SHELL · Executor: Cline (UI Architect)*
*Status: v0.2 implemented in `src/css/foundation/` + `src/js/ui/` · [FACT] unless marked otherwise*

## 0. PROVENANCE LEGEND (applied to every claim in this document)

| Tag | Meaning |
|---|---|
| `[FACT]` | Traceable to existing source, verified by reading files or running the local runtime |
| `[INFERENCE]` | Cline's derivation from existing source, for continuity |
| `[PROPOSAL]` | New proposal — **not approved by Human Authority** |
| `[OPEN QUESTION]` | Deliberately undecided; blocks an honest implementation |

## 1. WHAT v0.2 IS — AND IS NOT

**Is:** a token layer (`src/css/foundation/tokens.css`); a structural component layer (`components.css` + `src/js/ui/components.js`) shared by Public and Member contexts; a navigation-context model (`src/js/ui/navigation.js`) implementing SITEMAP_v0.1 + NAVIGATION_MODEL_v0.1; an application shell (`src/js/ui/shell.js`); a data-driven Member Dashboard (`src/js/ui/dashboard.js`) and a Person detail surface (`src/js/ui/person.js`).

**Is NOT:** not a redesign of the public site (rule #1 — `index.html`, `src/js/app-v2.js`, `src/css/prototype.css` untouched); not a genealogy visualisation rebuild (`/me/tree` keeps the legacy SPA); not a visibility model; not an epistemic data model; not a framework adoption (no Tailwind/React/build step).

## 2. TYPOGRAPHY (Phase 2)

### 2.1 Correction of a v0.1 claim
`FINAL_REPORT_UI_FOUNDATION.md` §2 stated the palette was inherited "từ website cũ". `[FACT]` Inaccurate: v0.1 used `#8B0000 / #D4AF37 / #F9F7F1`, which are **not** the live site's values. The live site (`src/css/prototype.css`) uses `--serif: "Times New Roman", …`, `--sans: -apple-system, "Segoe UI", …`, `#8c1d1d`, `#8c6d1d`, `#fdfcf9`.

### 2.2 v0.2 policy
| Token | Value | Tag |
|---|---|---|
| `--font-display-active` | `'Times New Roman', Times, Georgia, serif` | `[FACT]` (matches prototype.css) |
| `--font-text-active` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif` | `[FACT]` |
| `--font-display-proposed` | `'Playfair Display', Georgia, …` | `[PROPOSAL]` **not approved** |
| `--font-text-proposed` | `'Inter', -apple-system, …` | `[PROPOSAL]` **not approved** |

- Playfair Display + Inter are **not** declared as approved anywhere in v0.2.
- `[FACT]` v0.1 fetched them from Google Fonts over the network; v0.2 loads **no external font**.
- **Swappability (requirement):** components reference only `--font-*-active`. Changing typography = one line in `tokens.css`, or `setTypographyStack('proposed')` from `src/js/ui/tokens.js`. No component file changes.
- Scale: `--type-display-size … --type-meta-size` (rem) + `--type-reading-measure: 68ch`.

## 3. COLOUR (Phase 1 — separated layers, never hardcoded in components)

| Layer | Tokens | Source |
|---|---|---|
| Brand / Heritage | `--color-brand-heritage #8c1d1d`, `-strong/subtle`, `--color-brand-gold #8c6d1d`, `-subtle` | `[INFERENCE]` from prototype.css |
| Surface | `--color-surface-page #fdfcf9`, `-raised #ffffff`, `-sunken #f7f3ea`, `-inverse #1a1a1a`, `-scrim` | `[INFERENCE]` |
| Text | `--color-text-primary #1a1a1a`, `-secondary #4a4a4a`, `-muted #7a7a7a`, `-on-dark`, `-link` | `[FACT]` prototype.css |
| Border | `--color-border-subtle #e8e2d4`, `-default #d8d2c4`, `-strong #b9b2a0`, `-focus` | `[INFERENCE]` |
| Semantic (action) | `--color-action-primary-*`, `-secondary-*`, `-quiet-fg` | v0.2 |
| State | `--color-state-{info,success,warning,danger}-{bg,fg,border}` | v0.2 |
| Layout | `--layout-max 1200px`, `-wide 1440px`, `-content 1040px`, `-narrow 760px`, `-sidebar 260px` | `[INFERENCE]` |
| Space/Radius/Elevation/Motion | `--space-*` (4px base), `--radius-*`, `--elevation-*`, `--motion-*`, `--z-*` | v0.2 |

**Rule enforced in code:** `[FACT]` no raw colour literal exists outside `tokens.css` in the v0.2 CSS/JS.

## 4. VISIBILITY (Phase 7) — PRESENTATION ONLY

`[FACT]` No visibility model exists: no visibility column, no server-side filtering, and `GET /api/people` + `GET /api/genealogy.json` are public.

- `--color-visibility-scope-*` / `--color-visibility-model-*` are a **neutral vocabulary** only.
- `src/js/ui/visibility.js` sets `data-visibility-enforced="false"` and prints *"Chỉ là ngữ cảnh hiển thị — hiện chưa có mô hình phân quyền nội dung trong hệ thống."*
- The v0.1 wording "Chỉ thành viên nội bộ gia tộc" is **removed** — `[FACT]` it was factually wrong while the endpoints were public.
- `[OPEN QUESTION]` PRIVATE/MEMBERS/PUBLIC semantics, per-record default, enforcement point → Human decision (DOMAIN_MODEL §D, ERD_v0.1 FamilySpace).

## 5. EPISTEMIC UI (Phase 6) — DATA-DRIVEN OR ABSENT

`[FACT]` The schema has no provenance/confidence/claim-type field; ERD_v0.1 lists Claim/Evidence as "KHÔNG CÓ — Tạo mới".

| Rule | Implementation | Verified by |
|---|---|---|
| Never render a badge from static markup | `EpistemicBadge()` is only ever called with `classifyClaim(record)` output | `[FACT]` grep: no static `.gi-epistemic` in HTML |
| No classification without data | `classifyClaim()` returns `{claimType:null}` for v0.2 records | `[FACT]` node test → `{"claimType":null,"source":null}` |
| A claim without evidence is not a fact | returns `evidence-needed`, never `fact` | `[FACT]` node test case 2 |
| Bogus values ignored | unknown `claim_type` → `null` | `[FACT]` node test case 4 |
| Inference never becomes canonical | no code path promotes a record to "canonical" | `[FACT]` source review |

**Consequence:** on real v0.2 data the dashboard renders **zero** epistemic badges. That is the honest state, not a bug. `src/js/ui/epistemic.js` documents which fields (`claim_type`, `citations`, `provenance`, …) would switch badges on once the schema provides them.

## 6. RESPONSIVE CONTRACT (Phase 8)

`[PROPOSAL]` Verification widths: **375 / 768 / 1024 / 1440**.
Declared in `tokens.css` §15 and mirrored as literals in `layout.css` / `components.css` media queries (CSS custom properties cannot be referenced inside `@media`); also mirrored in `src/js/ui/tokens.js` for JS-side decisions.

| Width | Rules |
|---|---|
| ≤1024px | `.gi-grid--sidebar` → 1 column; card grid min 220px |
| ≤768px | single column; nav becomes a horizontally scrollable strip; `.gi-btn` min-height 44px (touch target) |
| ≤375px | tighter gutters; header stacks; breadcrumb separators hidden to prevent overflow |
| ≥1440px | content capped at 1120px to protect line length |

`[OPEN QUESTION]` Mobile tree navigation (drag-to-pan vs list view) is unanswered in VINHDANHBUTPHA research §I.2 and remains unanswered here.

## 7. ACCESSIBILITY BASICS

Focus-visible ring via `--elevation-focus-ring`; `aria-current="page"` on the active nav item; `role="status"`/`aria-live` on loading; `role="alert"` on errors; `aria-label` on navs/breadcrumb; `aria-hidden` on decorative avatars; `<noscript>` fallback on both pages.

`[OPEN QUESTION]` A full WCAG contrast audit was not performed (no browser tooling available in this environment).

## 8. TOKEN DISCIPLINE RULES (enforced)

1. Components never write a raw colour/font/spacing value — tokens only. `[FACT]` verified by grep.
2. Database/API values never reach the DOM through `innerHTML` — `src/js/ui/dom.js` is the only sanctioned constructor (`createElement` + `textContent`). `[FACT]` verified by grep across `src/js/ui/` and both pages.
3. Assets are referenced through `assets/ASSET_MANIFEST.json` (`src/js/ui/assets.js`). `[FACT]` no asset filename is hardcoded in v0.2 components/pages.
4. Every async zone must declare Loading + Empty + Error — enforced by `Region()` in `src/js/ui/states.js`.
5. Typography is switched in exactly one place.

## 9. WHAT THIS DOCUMENT DOES NOT DECIDE

- Framework adoption (Tailwind 4 proposed by VINHDANHBUTPHA research §G.1/§H.1, **not** adopted; the same research lists it as open in §I.1).
- Typography approval (Playfair/Inter remain `[PROPOSAL]`).
- Visibility model, epistemic schema, genealogy storage, IA or sitemap changes — Human/architecture decisions.
- Any genealogy data change (rule #2 — none made).
