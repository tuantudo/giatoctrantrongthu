# CHANGE-001: EXECUTION REPORT (REPAIR PRODUCTION JS RUNTIME)

**Date:** 2026-09-14
**Scope:** REPAIR production JavaScript runtime (SyntaxError in app.js)

---

## ROOT CAUSE

Commit `cc2f303` introduced `renderHomePublicationLanding()` with a structural
brace imbalance: the blocks for `machMeta` and `archiveMeta` were placed
AFTER the closing `}` of the function but BEFORE a stray trailing `}`.
Result: `node --check src/js/app.js` → `SyntaxError: Unexpected token '}'`
at line 2048. Entire `app.js` failed to parse; browser discarded the whole
file — routing, Ký Ức, Thế hệ, MẠCH lead all dead.

Note: commit `9a8764e` also contains the same defect (verified via
`node --check` on the blob), so it is NOT a clean source of truth.
The working tree at repair time matched `cc2f303` content for app.js
(`git diff -- src/js/app.js` was empty pre-fix), confirming the defect
originated in `cc2f303` and persisted through `683a004`/`ccf4582`
(cache-buster-only commits).

The instruction `git checkout 9a8764e -- src/js/app.js` was NOT executed —
it would have re-introduced the same broken structure. Only the minimal
brace fix was applied, preserving all publication-shell logic.

---

## EXACT FILES CHANGED

1. `src/js/app.js` — 1 hunk: moved the premature closing `}` of
   `renderHomePublicationLanding()` from before the `machMeta`/`archiveMeta`
   blocks to after them (lines ~2033–2047). No logic changed, no data
   hardcoded, no renderers removed.
2. `index.html` — 1 line: `src/js/app.js?v=20260914_0100` →
   `src/js/app.js?v=20260914_0102` (cache-buster bump for the fixed JS).
3. `docs/architecture/CHANGE_001_EXECUTION_REPORT.md` — this report
   (replaces prior CSS-only execution note from `ccf4582`).

No CSS, backend, API, database, brand, or route changes.

---

## EXACT FIX (diff summary)

```diff
-    }          // ← premature close of renderHomePublicationLanding
-}              // ← stray brace causing SyntaxError
-
-    const machMeta = ...
+               // (machMeta/archiveMeta blocks stay INSIDE the function)
+    const machMeta = ...
     ...
-}              // ← function now closes here, after archiveMeta block
+}
```

---

## VALIDATION COMMANDS

- `node --check src/js/app.js` → PASS (prints nothing, prints SYNTAX-OK in wrapper)
- `grep -c "function renderHomePublicationLanding\|function renderSidebarCalendar"` → 2 (both preserved)
- `grep -n "kyUcCard.innerHTML\|statGenerations"` → lines 2000/2007/2017 (Ký Ức + Thế hệ pipelines intact)
- `git diff --stat` → only `src/js/app.js`, `index.html`, execution report

---

## COMMIT SHA

`15045a8c205247f5c05482246c5cb59896cb0630`
(`fix(runtime): CHANGE-001 repair app.js SyntaxError (stray brace) + bump app.js cache-buster to v20260914_0102`)
— 2 files: `src/js/app.js`, `index.html`.

## DEPLOYMENT STATUS

Pushed to `origin/main`; Vercel deployment via existing flow.
Production `app.js?v=...` observation left to AGY independent runtime verification.

---


---

## ADDENDUM — LOGO RESPONSIVE REPAIR (2026-09-14)

**Scope:** masthead logo responsive semantics only.

**Finding (browser-verified live production):**
- Wide (1440px): `currentSrc = logoGiaToc_original.svg`, 528×160, no overflow.
- Narrow (390px): `currentSrc = logoGiaToc_ngang.svg`, 351×80 — browser
  already selects per Owner invariant. Icon-only `logoGiaToc.svg` is NOT
  used as a logo (favicon only).
- Masthead logo itself causes no horizontal overflow. The only overflow
  offenders at 390px were `SPAN.calendar-event-countdown` (sidebar widget,
  unrelated to logo).

**Incident-report conflict resolved:** Section G.3 / §4.2 of
`CHANGE_001_GATE6_INCIDENT_REPORT.md` (add
`<source media="(max-width: 639px)" srcset="assets/images/logoGiaToc.svg">`)
contradicts the Owner invariant locked in `PROJECT_CONTROL_SURFACE.md`
§K ("KHÔNG tự ép dùng icon-only cho mobile"). The Owner task instruction
for this repair explicitly forbids adding icon-only mobile. That incident
recommendation was therefore NOT implemented. AGY/Owner to reconcile the
incident report text separately.

**Exact changes (this repair):**
1. `src/css/main.css` — `@media (max-width: 480px)`: `.editorial-logo`
   gets `height: auto; max-height: 64px;` so the ngang full-identity logo
   scales into very-narrow mastheads without overflow/distortion.
   Semantics untouched (no icon-only, no new logo, no SVG edits).
2. `index.html` — `main.css?v=20260914_0101` → `main.css?v=20260914_0103`
   (cache-buster for the CSS fix). No favicon change.
3. This addendum (documentation of the repair + conflict note).

**Validation:**
- `node --check src/js/app.js` → PASS (untouched by this repair).
- Live browser `currentSrc` checks: wide → original, narrow → ngang.
- Console: only pre-existing `X-Frame-Options` iframe error; no new JS errors.

*No PASS / ACCEPTED / CHANGE CLOSED declared. AGY to run independent verification.*

