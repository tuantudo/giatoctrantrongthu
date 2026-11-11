# GIATỘC — COMPONENT INVENTORY v0.2

*Executor: Cline · Scope: the component layer delivered by "DESIGN — GIATỘC UI SYSTEM v0.2 + APPLICATION SHELL"*
*Status values: IMPLEMENTED (code + local runtime verified) · IMPLEMENTED-UNVERIFIED (code only; no browser) · SPEC ONLY (not built in v0.2)*

## 1. REQUIRED COMPONENT COVERAGE (mission Phase 1 list)

| # | Component | Factory (`src/js/ui/components.js`) | Styles | Status |
|---|---|---|---|---|
| 1 | InstitutionHeader | `InstitutionHeader({brand, nav, context, scopeLabel, actions, assets})` | `.gi-header__*`, `.gi-context` | IMPLEMENTED-UNVERIFIED |
| 2 | GlobalNav | `GlobalNav(items)` → `NavigationList` | `.gi-nav__*` | IMPLEMENTED-UNVERIFIED |
| 3 | MemberNav | `MemberNav(items)` → `NavigationList` | `.gi-nav__*` | IMPLEMENTED-UNVERIFIED |
| 4 | Breadcrumb | `Breadcrumb(crumbs[])` | `.gi-breadcrumb__*` | IMPLEMENTED (logic verified) |
| 5 | BackNavigation | `BackNavigation({mode, href, label})` | `.gi-backnav__*` | IMPLEMENTED (logic verified) |
| 6 | PageHeader | `PageHeader({eyebrow, title, subtitle, meta[]})` | `.gi-pageheader__*` | IMPLEMENTED-UNVERIFIED |
| 7 | Section | `Section({id, title, action, lead, children})` | `.gi-section__*` | IMPLEMENTED-UNVERIFIED |
| 8 | Card | `Card({title, meta, children, variant, href})` | `.gi-card__*` | IMPLEMENTED-UNVERIFIED |
| 9 | PersonCard | `PersonCard({person, relationLabel, href})` | `.gi-personcard__*` | IMPLEMENTED-UNVERIFIED |
| 10 | StatusBadge | `StatusBadge({label, tone, title})` | `.gi-badge--{neutral,info,success,warning,danger}` | IMPLEMENTED-UNVERIFIED |
| 11 | EpistemicBadge | `EpistemicBadge({claimType, source, label})` | `.gi-epistemic--{fact,inference,proposal,evidence-needed}` | IMPLEMENTED (gate verified — null without data) |
| 12 | EmptyState | `EmptyState({title, body, meta})` in `states.js` | `.gi-empty__*` | IMPLEMENTED-UNVERIFIED |
| 13 | LoadingState | `LoadingState({label})` in `states.js` | `.gi-loading__*` | IMPLEMENTED-UNVERIFIED |
| 14 | ErrorState | `ErrorState({title, body, onRetry})` in `states.js` | `.gi-error__*` | IMPLEMENTED-UNVERIFIED |
| 15 | Footer | `Footer({links, legal, brand})` | `.gi-footer__*` | IMPLEMENTED-UNVERIFIED |

**Supporting components (needed to satisfy the mission's rules):** `ScopeIndicator` + `VisibilityLimitationNotice` (`visibility.js`), `Region` async-zone helper (`states.js`), plus the two page controllers (`dashboard.js`, `person.js`).

## 2. DATA CONTRACTS

| Component | Input contract | Safety rule |
|---|---|---|
| `InstitutionHeader` | `assets` object from `ASSET_MANIFEST.json`; falls back to **text-only brand** when the manifest is missing | never hardcode an asset filename |
| `GlobalNav` / `MemberNav` | `[{label, href, current?, title?}]` | `aria-current="page"` set from `current` only |
| `Breadcrumb` | `[{label, href, current}]` (output of `resolveContext`) | last crumb is `current`, never a link |
| `BackNavigation` | `{mode:'hierarchy'\|'history', href, label}` | mode rendered as visible text; `history` requires JS |
| `Card` | `{title, meta, children, variant, href}` | with `href` renders as `<a>` (keyboard-navigable) |
| `PersonCard` | `{person:{id,name,raw_name,birthYear,deathYear,birth:{place}}, relationLabel, href}` | text via `textContent`; unknown id → shows the id, never a guessed name |
| `StatusBadge` | `{label, tone, title}` | returns `null` for empty/invalid labels |
| `EpistemicBadge` | `{claimType ∈ {fact,inference,proposal,evidence-needed}, source, label}` | returns `null` unless `claimType` **and** `source` are present |
| `EmptyState` | `{title, body, meta}` | body states *why* it is empty (data absence) |
| `ErrorState` | `{title, body, onRetry}` | `role="alert"`; retry is a real callback |
| `ScopeIndicator` | `audience:'public'\|'member'` | emits `data-visibility-enforced="false"`; copy fixed in `visibility.js` |

## 3. BEHAVIOURAL CONTRACTS

| Rule | Where enforced |
|---|---|
| DB/API values never via `innerHTML` | `dom.js` is the only sanctioned constructor; `[FACT]` grep-verified |
| Unknown ids never become invented names | `data.js#nameOf()` returns `null`; `PersonCard` shows the raw id |
| `[object Object]` never rendered | `textOrNull()` rejects it (guards the real seeding defect seen in v0.1) |
| No zone may show fabricated content | `Region()` falls back to `EmptyState` when a renderer returns `false`/`null` |
| Reduced motion respected | `states.css` `@media (prefers-reduced-motion: reduce)` |
| Responsive touch targets | `.gi-btn { min-height: 44px }` at ≤768px |

## 4. DEPENDENCY MAP

```
member_dashboard.html ─┐
                       ├─► boot-dashboard.js ─► navigation.js ─► (route registry mirrors SITEMAP v0.1)
member_person.html ────┘   boot-person.js  ─►   shell.js ─────►  components.js ─► dom.js
                                                    │                │
                                                    │                └─► states.js (Region/Empty/Error/Loading)
                                                    ├─► visibility.js (ScopeIndicator)
                                                    └─► assets.js ──► assets/ASSET_MANIFEST.json
                              dashboard.js / person.js ─► data.js (fetch layer) ─► existing /api/* endpoints
                                                      └─► epistemic.js (classification gate)
```

`[FACT]` The legacy SPA (`src/js/member-app.js` + `src/css/main.css`) is **not** part of this graph; `/me/tree` keeps using it.

## 5. ADOPTION STATUS

| Surface | Uses v0.2? | Note |
|---|---|---|
| `/me` (Member Dashboard) | ✅ yes | rewritten onto v0.2 |
| `/me/tree/person/:id` | ✅ yes | new |
| `/me/tree` (legacy SPA) | ❌ no | retained; only the broken logo path was fixed |
| `/` public prototype | ❌ no | rule #1 — `index.html` untouched |
| `/admin` staff console | ❌ no | out of scope |
| `/login`, `/me/change-password` | ❌ no | server-rendered inline pages from P0/P0.1; migrating them is a separate mission (`[OPEN QUESTION]`) |

## 6. DEBT CARRIED FORWARD

| Debt | Why not fixed here |
|---|---|
| Public shell + admin console still on their own CSS | Rule #1 forbids a full-site redesign in one pass |
| `/login` and `/me/change-password` still use inline `<style>` blocks from P0/P0.1 | Auth-gated pages; migrating them is a separate, low-risk mission |
| Member space has no index parent, so `/me` back-mode is `history` | Adding a parent page is an IA change (Agy/Human) |
| Client-side name resolution downloads the full public genealogy bundle | A server-side endpoint would be an API change (not Cline's authority) |
| No automated test runner in the repo (`package.json` test script is a placeholder) | Out of scope; v0.2 logic was verified by ad-hoc Node execution |
