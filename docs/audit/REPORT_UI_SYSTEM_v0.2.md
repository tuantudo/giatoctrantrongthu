# REPORT — GIATỘC UI SYSTEM v0.2 + APPLICATION SHELL

*Mission: DESIGN — GIATỘC UI SYSTEM v0.2 + APPLICATION SHELL · Executor: Cline (UI Architect)*
*Date: 2026-10-04 · Local runtime only · **No deploy, no push, no commit***

---

## 1. WHAT WAS IMPLEMENTED

### 1.1 Design system layer (`src/css/foundation/`)

| File | Purpose |
|---|---|
| `tokens.css` | 15 token groups: typography (switchable pair), brand/heritage, surface, text, border, semantic action, state, visibility vocabulary, epistemic vocabulary, spacing, radius, elevation, layout widths, z-index/motion, breakpoints. **Only file containing raw colour values.** |
| `layout.css` | Shell regions (header/context/main/footer), containers, stacks, grids, reading measure + responsive rules at 1024/768/375/1440. |
| `components.css` | 12 structural components (header, nav, breadcrumb, backnav, pageheader, section, card, personcard, buttons, status badge, epistemic badge, visibility, footer). |
| `states.css` | LoadingState / EmptyState / ErrorState / Notice + `prefers-reduced-motion`. |
| `foundation.css` | Entry (4 `@import`s). v0.1 monolith replaced; **no Google Fonts network call any more**. |

### 1.2 Component + behaviour layer (`src/js/ui/`, 14 ES modules)

`dom.js` (safe DOM only) · `tokens.js` (breakpoints + typography switch) · `navigation.js` (route registry + context resolution) · `components.js` (factories) · `states.js` (Region + 3 states) · `data.js` (fetch layer over existing endpoints) · `epistemic.js` (classification gate) · `visibility.js` (scope presentation) · `assets.js` (manifest loader) · `shell.js` (shared Public/Member shell) · `dashboard.js` (6 zones) · `person.js` (person surface) · `boot-dashboard.js` / `boot-person.js`.

### 1.3 Server + asset changes

| File | Change |
|---|---|
| `server/member_person.html` | **NEW** — 711 B shell host |
| `server/member_dashboard.html` | **REWRITTEN** — 10 229 B inline-HTML page → 766 B shell host (no inline style/script/data) |
| `server/member.js` | **ADDED** `GET /me/tree/person/:id` (behind `requireAccount`; PROVISIONED redirect preserved) |
| `server/member_baseline.html` | **FIXED** relative `srcset="assets/images/logoGiaToc_original.svg"` → absolute (relative form 404s under `/me/*`) |
| `assets/ASSET_MANIFEST.json` | **NEW** — 4 verified real brand assets, provenance-tagged |

### 1.4 Documentation
`docs/design/GIATOC_UI_SYSTEM_v0.2.md` · `docs/design/GIATOC_APPLICATION_SHELL_v0.2.md` · `docs/design/GIATOC_COMPONENT_INVENTORY_v0.2.md` · this report.

---

## 2. WHAT WAS DESIGNED BUT NOT IMPLEMENTED

| Item | Reason |
|---|---|
| Public shell adoption (`/` on v0.2 header/footer + GlobalNav) | Rule #1 — no full-site redesign. Public keeps `prototype.css`. |
| `/me/tree` rebuilt on the v0.2 shell | Phase 5 defers genealogy visualisation; legacy SPA retained. |
| `/login` + `/me/change-password` migrated onto the component system | P0/P0.1 auth pages with inline `<style>`; separate mission. |
| Member-space index page (so `/me` gets a hierarchy parent) | IA change → Agy/Human. |
| Real visibility enforcement | Data/architecture decision, not UI. |
| Epistemic badges actually appearing | Requires a schema field that does not exist. |
| Server-side relative-name resolution endpoint | Would be an API change (outside Cline's authority). |

---

## 3. `[FACT]` — verified in this mission

1. **All 15 required components exist** as factories + styles (inventory §1): 12 structural + 3 state.
2. **No `innerHTML`** in `src/js/ui/` or either page (grep; the word appears only inside comments stating the rule).
3. **No hardcoded genealogy values** (`@I…@`, personal names, years) in `src/js/ui/` or the two pages (grep).
4. **Navigation context resolution** (executed in Node against the real registry): every route yields parent, breadcrumb, explicit back mode and next destinations. Public routes are **not** prefixed with "Member Space" (bug found and fixed during this mission — §7).
5. **Epistemic gate** (executed): real v0.2 record → `{claimType:null}` (renders nothing); claim without evidence → `evidence-needed`; claim + evidence → `fact`; bogus type → `null`.
6. **Routes:** `/` 200 · `/login` 302→/me (auto-login, §8) · `/me` 302 unauth · `/me/tree` 302 unauth · `/me/tree/person/:I115@` 302 unauth · `/logout` 302 · `/admin/login.html` 200 · `src/js/app-v2.js` 200 · `src/css/prototype.css` 200.
7. **All v0.2 static assets serve 200** (`foundation.css`, its 4 imports, `ASSET_MANIFEST.json`).
8. **All 14 JS modules pass `node --check`** (one real syntax error was introduced and fixed during authoring).
9. **Security posture closed:** `/server/family_archive.db`, `/server/.env`, `/server/member_dashboard.html`, `/server.log` → **404**; credential logging removed from `member.js`. *(Both fixes were made by a concurrent agent during this mission; Cline re-verified them instead of duplicating the work.)*
10. **No schema change, no data change, no genealogy data edited** (rules #2, #3).

## 4. `[INFERENCE]`

- Palette/type values were sampled from `src/css/prototype.css` to preserve continuity with the live public site, rather than reusing the unapproved v0.1 values (`#8B0000/#D4AF37`, Playfair/Inter).
- Hierarchy Back is the default back mode; history mode is reserved for surfaces without an IA parent, because NAVIGATION_MODEL_v0.1 §3A warns history-back can eject users out of the app.
- Client-side name resolution is acceptable **for v0.2** but is a known inefficiency, not a good pattern.

## 5. `[PROPOSAL]`

- Typography pair Playfair Display + Inter — declared but **not** active, **not** approved, switchable in one line.
- Visibility vocabulary tokens (presentation only, `data-visibility-enforced="false"`).
- Breakpoint verification widths 375 / 768 / 1024 / 1440.
- `/me/tree/person/:id` as a new-UI companion to the legacy hash route (sitemap untouched; ratification requested, not assumed).

## 6. `[OPEN QUESTION]`

1. Visibility semantics (PRIVATE/MEMBERS/PUBLIC), per-record default, enforcement point — Human.
2. Provenance/claim schema — without it epistemic UI stays inert (ERD_v0.1 marks Claim/Evidence as "to be created").
3. Typography approval (site stacks vs Playfair/Inter).
4. Framework adoption (Tailwind 4 proposed in VINHDANHBUTPHA research §G.1, **not** adopted; that research lists it as open in §I.1).
5. Whether `/me` should gain an IA parent (would switch its back mode to hierarchy).
6. Server-side name resolution to replace the client-side bundle download.
7. Mobile tree interaction model (research §I.2 — unanswered upstream too).

## 7. BROWSER VERIFICATION STATUS — **NOT PERFORMED**

| Level | Status | Evidence |
|---|---|---|
| API / HTTP (curl + Node fetch, incl. auth-gated routes) | ✅ performed | route matrix §3.6 |
| HTML/DOM **source** inspection | ✅ performed | file reads |
| **Browser rendering / visual / responsive** | ❌ **NOT PERFORMED** | Playwright MCP returned `Not connected` on every attempt this session |
| **Authenticated DOM render** | ❌ **NOT PERFORMED** | the member account password is owned/rotated by Tuấn; Cline does not have credentials and will not reset them |
| WCAG contrast audit | ❌ not performed | needs rendering |

**Consequence:** v0.2 is **NOT visually verified**. Per mission Phase 8, responsive PASS **cannot** be claimed — only that the CSS rules exist and are internally consistent. Every design doc marks component status `IMPLEMENTED-UNVERIFIED` accordingly.

## 8. RESPONSIVE VERIFICATION STATUS — **STATIC ONLY**

Rules exist at 375 / 768 / 1024 / 1440 (`layout.css`, `components.css`); the breakpoint contract is mirrored in `tokens.css` §15 + `tokens.js`. **No viewport was rendered.** Known risks to check on the first browser pass: header crowding at 375px, horizontal nav-strip discoverability at 768px, breadcrumb truncation on long person names.

## 9. REGRESSION STATUS — **NO REGRESSION FOUND (within verifiable scope)**

| Surface | Result |
|---|---|
| `/` public prototype | 200; `index.html` + `prototype.css` + `app-v2.js` unchanged **by this mission** (they carry edits from other missions) |
| `/admin/login.html` | 200 |
| `/me/tree` legacy SPA | 200, `member-app.js` + all legacy hash routes intact; only the broken logo path fixed |
| `/me` | 302 unauth (unchanged contract) |
| `/login` | **behaviour changed by another agent**: now 302 → `/me` because `DEV_AUTO_LOGIN=true` is set in `server/.env` |
| Schema / genealogy data | untouched |
| Security | exposure closed (404 on `/server/*`, `.db`, `.env`) |

## 10. FINDINGS RAISED BY CLINE (not fixed here — outside Cline's authority)

| Sev | Finding | Recommendation |
|---|---|---|
| **HIGH** | `server/member.js` dev auto-login treats **missing `NODE_ENV` as "isDev"** (`NODE_ENV === 'development' \|\| !NODE_ENV`). `DEV_AUTO_LOGIN=true` is set in `server/.env`. If this code+config ran on a host with `NODE_ENV` unset, **any visitor to `/login` is silently authenticated as the configured account.** | Fail closed: require `NODE_ENV === 'development'` explicitly, and never ship `DEV_AUTO_LOGIN` in a shared config. Owner decision before any deploy. |
| MED | Local DB rows still contain `birthYear = '[object Object]'` from the old seeding bug (the seeding script is fixed; re-seeding is destructive and was **not** run). | Owner-approved re-seed or a data migration. Until then `/api/people` returns `[object Object]'` for some rows; v0.2 UI masks it via `textOrNull()`. |
| LOW | v0.1 dashboard asserted genealogy facts in static markup ("Sinh năm 1987", "Chi 2, Đời 4") — **removed** in v0.2. | none |
| LOW | Stray artifacts in repo root from earlier missions: `api_res.json` (96 KB family data incl. fsid), `cookies.txt` (live session cookie), `test_login.js`, `server.log` — none gitignored. | Housekeeping + `.gitignore` |
| INFO | Concurrent agents edited `server/member.js`, `server/index.js`, `index.html`, `src/css/prototype.css`, `server/db_seed.js` **during** this mission. | Cline re-verified rather than overwrote; a coordinated commit is needed. |

## 11. FILES CHANGED BY THIS MISSION

**Created (20):** `src/css/foundation/{tokens,layout,components,states}.css` · `src/js/ui/{dom,tokens,navigation,components,states,data,epistemic,visibility,assets,shell,dashboard,person,boot-dashboard,boot-person}.js` · `assets/ASSET_MANIFEST.json` · `server/member_person.html` · `docs/design/GIATOC_{UI_SYSTEM,APPLICATION_SHELL,COMPONENT_INVENTORY}_v0.2.md` · `docs/audit/REPORT_UI_SYSTEM_V0.2.md`

**Modified (4):** `src/css/foundation/foundation.css` (v0.1 → v0.2 entry) · `server/member_dashboard.html` (rewritten to shell host) · `server/member.js` (+1 route) · `server/member_baseline.html` (1 line, logo path)

**Not touched:** `index.html`, `src/js/app-v2.js`, `src/css/prototype.css`, `src/js/member-app.js`, `admin/**`, `server/index.js`, any schema, any genealogy data.

## 12. STOP

Mission complete: design system + application shell designed, implemented, statically verified and documented. **Not** deployed, **not** pushed, **not** committed. No further work self-assigned.


