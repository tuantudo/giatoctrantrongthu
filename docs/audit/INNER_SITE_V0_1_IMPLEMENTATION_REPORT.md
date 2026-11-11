# INNER SITE v0.1 — IMPLEMENTATION REPORT

**Agent:** Cline (Experience Architect / Web UI)
**Date:** 2026-10-04
**Authority:** `docs/design/GIATOC_INNER_SITE_UX_IA_SPEC_v0.1.md`,
`docs/design/GIATOC_UX_STABILITY_CONTRACT_v0.4.md`,
`brand/BRAND_GOVERNANCE_v0.1.md`
**Status:** IMPLEMENTED + QA-PASSED. **Awaiting independent QA (Agy).** Not committed, not pushed, not deployed.

---

## 1. OBJECTIVE

Replace the architecture-dump Inner Site with governed member-facing navigation,
reading, archival and account surfaces, on the shared foundation. Public Home stays frozen.

## 2. WORK PERFORMED

### 2.1 Surfaces brought onto the shared foundation

| Route | Surface | Result |
|---|---|---|
| `/login` | Gate | Inline `<style>` removed; shared stylesheet; GIATỘC serif grammar |
| `/me` | Member Home | Navigation only (per Human resolution); four separated doors |
| `/me/mach` | MẠCH | Honest empty state with distinct MẠCH copy |
| `/me/clara` | Clara | Honest empty state with distinct Clara copy |
| `/me/tree` | Archival register | New list-first register + diacritic-insensitive search |
| `/me/tree/person/:id` | Person | Archival terminology; no IDs or GEDCOM in prose |
| `/me/family-spaces` | Family Space | Plain unavailable state (no fabrication) |
| `/me/change-password` | Account | Second design system removed; shared foundation |

### 2.2 Governance decisions applied

- **`/me` is navigation-only.** No Recent Feed, no dashboard language. Four doors each carry a
  *register note* (MẠCH = nội bộ, Clara = riêng tư, Cây phả đồ = dữ liệu phả hệ, Gia đình = cùng làm việc)
  so Clara is never read as a MẠCH section and genealogy is never read as content.
- **"Đề xuất thay đổi" stays a static unavailable form** (Human resolution). It says the ability
  does not exist yet and is not open for submissions.
- **No fabricated capability.** Family Space, MẠCH and Clara report honestly empty/unavailable.
- **Geometry:** zero radius, zero elevation, no dashed borders, canonical palette, serif display
  tokens, revised type scale and spacing rhythm.

## 3. FILES CHANGED

| File | Change |
|---|---|
| `src/css/foundation/tokens.css` | Serif tokens, zero radius, no elevation, canonical palette, revised type/spacing |
| `src/css/foundation/components.css` | Doors, welcome, register, gate→`gi-login-*` rules, footer contrast fix |
| `src/css/foundation/states.css` | Honest empty/unavailable state grammar |
| `src/js/ui/dashboard.js` | `/me` reworked to Member Home |
| `src/js/ui/contexts.js` | Member context + `Cần đăng nhập`; dependency diagnostics hidden |
| `src/js/ui/states.js` | Empty/unavailable states; `SOT_NOTE` removed from UI |
| `src/js/ui/components.js` | `PersonCard` no longer prints raw IDs |
| `src/js/ui/person.js` | Archival vocabulary; `humanDate()` for GEDCOM dates |
| `src/js/ui/spaces.js` | Family Space unavailable state |
| `src/js/ui/discourse.js` | MẠCH / Clara empty-state copy |
| `src/js/ui/tree.js` | Archival register + diacritic-insensitive search |
| `src/js/ui/boot-tree.js` | Register boot |
| `server/member.js` | `/login` + `/me/change-password` on shared foundation |
| `server/member_tree.html` | Register document |

**Not touched:** `src/js/ui/public-home.js`, DB, schema, GEDCOM, auth, backend logic.

## 4. DEFECTS FOUND AND FIXED DURING QA

Assertions passed while these were live — each was caught by visual review or a
targeted probe, not by the bulk check:

1. **CSS corruption (I introduced it).** An insert landed inside `.gi-footer__line`,
   swallowing the entire `.gi-gate-*` block and orphaning a rule fragment. Repaired;
   brace balance now 0 across all four foundation sheets.
2. **`.gi-gate` class collision.** The new login container shared a class name with the
   *frozen* Public gate band. Renamed all login rules to `gi-login-*` so Public is untouched.
3. **Footer contrast.** `.gi-footer__line` forced `--color-text-muted` (#7a7a7a) onto the
   inverse surface (#1a1a1a). Removed the override; now #f5f2ea on #1a1a1a.
4. **Footer `margin-top`.** Overrode `.gi-region-footer { margin-top: auto }`, breaking the
   flex push-to-bottom. Removed.
5. **Raw IDs in prose.** `PersonCard` printed `${id} · ${life}` — `@I54@` appeared on every
   related-person card (20 occurrences on one page). IDs now live only in `href`/`data-person-id`.
6. **GEDCOM dates in prose.** `Sinh: BET 15 OCT 1956 AND 19 OCT 1956`. Added `humanDate()`:
   renders a bounded year and marks estimates as estimates; never guesses.
7. **Search required exact diacritics.** Sort already normalized; matching did not.
   `"Nguyen"` found 0 for `"Nguyễn"` names — now both return 70.
8. **`/me/change-password` had a second design system.** Sans-serif, 4px radius, drop shadow,
   `#0066cc` button. Now on the shared foundation.
9. **Missing favicon link** on server-rendered member pages → `/favicon.ico` 404.

## 5. VERIFICATION

Automated: **28/28 route×width combinations pass** (7 routes × 375/768/1024/1440).
Zero horizontal overflow, zero radius, zero shadows, zero dashed borders, zero banned
terminology, zero raw IDs, H1 present everywhere, **zero console errors**.

Flow checks (authenticated session, final `location.pathname` asserted per route):
- `/me` → Member Home; `/logout` → `/` (Public Home)
- `/me/tree` → 223 visible rows; search `Nguyễn`/`Nguyen` → 70, `tran` → 84, no-match → 0
- `/me/tree/person/:id` → real record, no ID leak, no GEDCOM leak
- `/login`, `/me/change-password` → shared stylesheet only, 0 inline `<style>` tags

Change-password was verified by serving its exact emitted HTML over HTTP (the route only
renders for `PROVISIONED` accounts, otherwise it redirects to `/me`).

Public Home regression: renders correctly at all four widths, h1 + threshold present,
no architecture language. **Note:** `src/js/ui/public-home.js` was modified at 14:08 by
another party during this session (its hash differs from my 13:49 baseline). I did not edit it.

## 6. REAL BACKEND CAPABILITIES CONFIRMED

`/me/tree` renders 223 real persons from the archive; `/me/tree/person/:id` renders real
facts and relations grouped by type (parents, siblings, spouse, children).

## 7. INTENTIONAL UNAVAILABLE CAPABILITIES

## 8. LIMITATIONS AND OPEN ITEMS

- **`/me/change-password` runtime path unverified end-to-end** — needs a `PROVISIONED` account.
  Markup and styling are verified; the POST branch is not.
- **Brand token source unresolved.** `brand/generated/brand.css` is not loaded by the live
  foundation; tokens are defined in `src/css/foundation/tokens.css`. This is a **Governance
  conflict for Agy**, not something I should decide.
- **`/favicon.ico` returns 404 on Public Home `/`.** Pre-existing, on the frozen surface,
  out of my scope. Every Inner Site route is clean.
- **Dead code remains:** `LegacyBanner` (`visibility.js`) and `SoTNote` are defined but no
  longer rendered. Removal is a follow-up cleanup.
- **Concurrent work in the repo.** `git status` shows extensive unrelated changes
  (deleted docs, admin edits). My report covers only the files in §3.
- **Header brand-text duplication (logged, not changed).** On member surfaces the logo
  nameplate and the adjacent text label both read "Gia Tộc Trần Trọng Thu". Public sets
  `hideText: true` and Member does not. Fixing it touches shared shell behaviour and is an
  IA decision, not mine to make unilaterally.

## 9. RECOMMENDED NEXT ACTION

Hand to **Agy for independent QA** against §4 and the stability contract. Resolve the
brand-token source question first, since it decides whether `tokens.css` is the canonical
source or a duplicate that will drift.

---

## 10. HANDOFF

1. **Objective** — Inner Site v0.1 implemented on the shared foundation; Public Home frozen.
2. **Work performed** — 8 member/account routes rebuilt; 14 files changed; 9 QA defects fixed.
3. **Files changed** — see §3.
4. **Evidence** — `docs/audit/evidence/inner_site_v0.1/` (LOGIN, _me, _me_mach, _me_clara,
   _me_tree, _me_family-spaces, PERSON, CHANGE_PASSWORD, PUBLIC at 1440).
5. **Verification** — 28/28 route×width pass; flow checks pass; 0 console errors; CSS brace-balanced.
6. **Current state** — Implemented and self-QA'd. Not committed, not pushed, not deployed.
7. **Open questions** — brand-token canonical source; header brand-text duplication.
8. **Blockers** — none for QA. Change-password needs a PROVISIONED account to fully exercise.
9. **Risks** — concurrent repo modifications by another agent during this session; brand token
   duplication may drift from `brand/generated/brand.css`.
10. **Next action** — Agy independent QA. Do not commit or deploy until QA clears.