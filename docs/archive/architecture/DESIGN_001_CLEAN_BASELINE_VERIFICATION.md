# DESIGN-001 CLEAN BASELINE VERIFICATION

**Verification Role:** OpenCode (Independent Post-Cleanup Audit)
**Target Revision:** `9166ed6` (DESIGN-001 Revision)
**Cleanup Commit:** `0eae852` (AGY cleanup)
**Date:** 2026-09-15
**Mode:** READ-ONLY — no code changes, no commit, no deploy

---

## 1. GIT / COMMIT INTEGRITY

| Check | Result |
|-------|--------|
| Branch | `main` |
| HEAD | `0eae8520900cac6971e0545a844e5166c09cec12` |
| `git status` | 4 modified (pre-existing, not from cleanup), 40+ untracked (pre-existing) |
| Commit scope | 13 files: 11 deleted, 1 modified, 1 added |

### Commit 0eae852 — File-Level Breakdown

| Status | File | Scope |
|--------|------|-------|
| D | `design-playground/design-001-homepage/assets/logoGiaToc_ngang.svg` | Orphan artifact |
| D | `design-playground/design-001-homepage/css/prototype.css` | Orphan artifact |
| D | `design-playground/design-001-homepage/index.html` | Orphan artifact |
| D | `design-playground/design-001-homepage/js/data-c.js` | Orphan artifact |
| D | `design-playground/design-001-homepage/js/data-d.js` | Orphan artifact |
| D | `design-playground/design-001-homepage/js/part-a.js` | Orphan artifact |
| D | `design-playground/design-001-homepage/js/part-b.js` | Orphan artifact |
| D | `design-playground/design-001/index.html` | Orphan artifact |
| D | `design-playground/design-001/prototype-data.js` | Orphan artifact |
| D | `design-playground/design-001/prototype.css` | Orphan artifact |
| D | `design-playground/design-001/prototype.js` | Orphan artifact |
| M | `design-playground/js/prototype.js` | Remove `SNAPSHOT_STORIES` duplicate |
| A | `docs/architecture/DESIGN_001_POST_CLINE_FORENSIC_AUDIT.md` | Audit documentation |

**Verdict:** Cleanup commit is **properly scoped**. No files outside `design-playground/` and `docs/architecture/` were touched. No production contamination.

---

## 2. ORPHAN ARTIFACT VERIFICATION

| Check | Result |
|-------|--------|
| `design-playground/design-001/` on filesystem | **DELETED** — directory does not exist |
| `design-playground/design-001-homepage/` on filesystem | **EMPTY** — only `data/` subdir remains (empty, not git-tracked) |
| `design-playground/design-001/` in git | **CLEAN** — `git ls-files` returns nothing |
| `design-playground/design-001-homepage/` in git | **CLEAN** — `git ls-files` returns nothing |
| Code references to orphan paths | **NONE** — `rg` finds zero matches in `design-playground/*.html`, `*.css`, `*.js` |
| Canonical prototype | `design-playground/index.html` — confirmed present, 383 lines |

**Note:** Empty `design-001-homepage/` directory with empty `data/` subdir exists on filesystem but is untracked. This is cosmetic only — can be cleaned with `rm -rf design-playground/design-001-homepage/` if desired, but has zero functional impact.

---

## 3. DUPLICATE DATA VERIFICATION

| Check | Result |
|-------|--------|
| `SNAPSHOT_STORIES` in prototype.js | **REMOVED** — zero matches |
| `SNAPSHOT_SIDEBAR` in prototype.js | **NEVER EXISTED** in current version |
| Story data canonical source | `design-playground/js/prototype-data.js` → `window.__D001_DATA.stories` |
| prototype.js role | Pure renderer — reads `window.__D001_DATA`, maps via `mapStories()`, renders via `renderHomeCurated()` |
| router.js role | Consumes `window.__D001_DATA.stories` or `window.__d001.mapStories()` |
| Semantic duplication check | **NONE FOUND** — no alternate story dataset definitions exist |

**Data Flow (post-cleanup):**
```
prototype-data.js  →  window.__D001_DATA.stories
                            ↓
prototype.js  →  mapStories()  →  renderHomeCurated()
                            ↓
router.js  →  stories()  →  renderFullMach() / showStory() / bindSearch()
```

---

## 4. RUNTIME REGRESSION

### 4A. Syntax Check

| File | `node --check` |
|------|---------------|
| `prototype-data.js` | PASS |
| `prototype.js` | PASS |
| `router.js` | PASS |
| `system.js` | PASS |

### 4B. Route Verification (10 routes)

| # | Route | View | Expected Behavior |
|---|-------|------|-------------------|
| 1 | `#/` | home | Intro → Paths → Curated MẠCH → Ký ức → Tư liệu → Deep links |
| 2 | `#/mach` | mach | Full MẠCH listing from snapshot |
| 3 | `#/mach/bai-viet/:slug` | story | Story detail + reading tools |
| 4 | `#/gia-pha` | gia-pha | Stats (de-prioritized) + member redirect |
| 5 | `#/tu-lieu` | tu-lieu | Honest archive placeholder |
| 6 | `#/lich` | lich | Calendar rows from snapshot |
| 7 | `#/tim-kiem` | tim-kiem | Snapshot search |
| 8 | `#/tu-cach-thanh-vien` | tu-cach-thanh-vien | Member entry (product entry point) |
| 9 | `#/thanh-vien` | thanh-vien | Member space (placeholder) |
| 10 | `#/cai-dat` | cai-dat | Settings (placeholder) |

Router handles all 10 routes. `aria-current` updates correctly. `window.scrollTo(0,0)` on route change.

### 4C. Asset Loading

| Asset | Status |
|-------|--------|
| `assets/logoGiaToc_ngang.svg` | EXISTS (26,518 bytes) |
| `assets/logoGiaToc.svg` (favicon) | EXISTS (1,312 bytes) |
| `css/prototype.css` | EXISTS (287 lines) |
| `js/prototype-data.js` | EXISTS (50 lines) |
| `js/prototype.js` | EXISTS (122 lines) |
| `js/router.js` | EXISTS (122 lines) |
| `js/system.js` | EXISTS (109 lines) |

### 4D. Functional Components

| Component | Status |
|-----------|--------|
| Sticky nav | CSS `position: sticky; top: 0` ✓ |
| Reading tools (A-/A+, Share, Bookmark, Comment, Print) | system.js binds all 6 buttons ✓ |
| Back-to-top | system.js — shows after 400px scroll, smooth scroll ✓ |
| Chatbot entry | system.js — toggle panel, close button ✓ |
| Toast notifications | system.js — 2600ms auto-hide ✓ |
| Font size adjustment | system.js — 3 levels (fs-m1, default, fs-1, fs-2) ✓ |
| Search | router.js — searches MẠCH + Ký ức from snapshot ✓ |
| Live API upgrade | prototype.js — fetches `api.giatoctrantrongthu.com/api/mach.json` ✓ |

---

## 5. RESPONSIVE REGRESSION

| Viewport | Breakpoint | Layout | Nav | Masthead | Notes |
|----------|-----------|--------|-----|----------|-------|
| 1440 | (default) | 2-col paths, 2-col curated grid | Full horizontal | 560px | Full layout |
| 1024 | `@media (max-width: 1024px)` | Adjusted grid gap | Full horizontal | 460px | Minor spacing |
| 768 | `@media (max-width: 768px)` | Single col paths, single col curated | Full horizontal (reduced padding) | 460px | Paths stack |
| 390 | `@media (max-width: 480px)` | Single col everything | Reduced padding, flex-wrap | 320px | Footer 1-col, floating tools repositioned |

**Note:** No dedicated 390px breakpoint — the 480px rule covers it. The `min(320px, 84vw)` logo ensures no overflow at 390px.

**Responsive additions (Revision):**
- `@media (max-width: 900px)`: Footer grid → 2-col
- `@media (max-width: 768px)`: Paths → 1-col, curated grid → 1-col
- `@media (max-width: 480px)`: Footer → 1-col, floating tools repositioned, intro title scales

No horizontal overflow detected. Floating elements (back-to-top, chatbot) properly repositioned at small viewports.

---

## 6. PRODUCTION BOUNDARY

| Check | Result |
|-------|--------|
| `src/` touched | **NO** — `git diff 9166ed6..0eae852 -- src/` = empty |
| `server/` touched | **NO** |
| `admin/` touched | **NO** |
| `assets/images/` touched | **NO** |
| `vercel.json` touched | **NO** |
| `.vercel/` touched | **NO** |
| API/Database touched | **NO** |
| Deploy performed | **NO** |
| Prototype sandboxed | **YES** — all files within `design-playground/` |

---

## 7. DOCUMENTATION CONSISTENCY

### 7A. Phantom Document: `DESIGN_001_REVISION_TECHNICAL_IA_REVIEW.md`

| Check | Result |
|-------|--------|
| File exists on filesystem | **NO** |
| File in git history | **NO** — `git log --all --oneline` returns nothing |
| References to this file | **1 reference** — in `DESIGN_001_POST_CLINE_FORENSIC_AUDIT.md:24` (marked as "Missing / Phantom Doc") |
| Impact | **NONE** — no code or runtime depends on this file |

**Classification:** Historical artifact from a previous mission. The audit doc correctly identifies it as phantom. No action required — it's a documentation note, not a functional dependency.

### 7B. Stale References to `design-001-homepage/`

| File | Line | Context |
|------|------|---------|
| `DESIGN_001_REVISION_BRIEF.md:68` | "Áp dụng ngay Narrative mới vào `/design-playground/design-001-homepage/`" | **STALE** — references deleted path |
| `2026_WEBDESIGN_WORKFLOW.md:238` | "`/design-playground/design-001-homepage/` (Dành riêng cho việc Tuấn mở trực tiếp)" | **STALE** — references deleted path |
| `DESIGN_001_PROTOTYPE_REPORT.md:12` | "Non-canonical `design-001/` and `design-001-homepage/` directories are earlier drafts" | **HISTORICAL** — accurate at time of writing, but now outdated |
| `DESIGN_001_POST_CLINE_FORENSIC_AUDIT.md:70` | "đã bị xóa (`git rm -r`)" | **CORRECT** — documents the cleanup that happened |

**Classification:** MEDIUM — 2 documents (`DESIGN_001_REVISION_BRIEF.md`, `2026_WEBDESIGN_WORKFLOW.md`) contain stale paths. These are informational references, not functional dependencies. **Owner should be aware** but this does not block clean baseline.

### 7C. Documentation Cross-Check

| Document | Status | Notes |
|----------|--------|-------|
| `DESIGN_001_REVISION_BRIEF.md` | EXISTS | Stale path reference (§7B) |
| `DESIGN_001_PROTOTYPE_REPORT.md` | EXISTS | Historical reference (§7B) |
| `DESIGN_001_POST_CLINE_FORENSIC_AUDIT.md` | EXISTS | Added in cleanup commit, accurate |
| `PROJECT_CONTROL_SURFACE.md` | EXISTS | No issues found |
| `2026_WEBDESIGN_WORKFLOW.md` | EXISTS | Stale path reference (§7B) |

---

## 8. REMAINING FINDINGS

| # | Finding | Severity | Classification |
|---|---------|----------|---------------|
| 1 | Empty `design-001-homepage/` directory on filesystem (untracked) | LOW | Cosmetic — can `rm -rf` |
| 2 | Stale path references in `DESIGN_001_REVISION_BRIEF.md` and `2026_WEBDESIGN_WORKFLOW.md` | MEDIUM | Documentation inconsistency — Owner note |
| 3 | CSS token drift: prototype uses `--accent: #8c1d1d` / `--paper: #fdfcf9` vs production `--lacquer-red: #881337` / `--bg: #FAF9F5` | LOW | Expected for prototype — not a regression |
| 4 | `DESIGN_001_REVISION_TECHNICAL_IA_REVIEW.md` never created (phantom) | LOW | Historical — correctly identified in audit doc |

---

## 9. CLEAN BASELINE DECISION

### Criteria Assessment

| Criterion | Status |
|-----------|--------|
| Canonical source clear | ✓ |
| Orphan artifacts removed from git | ✓ |
| Duplicate data removed | ✓ |
| Runtime intact (10 routes, all JS passes syntax) | ✓ |
| No production contamination | ✓ |
| Cleanup commit scoped correctly | ✓ |
| Unresolved CRITICAL/HIGH issues | **NONE** |

### Verdict

**DESIGN-001 CLEAN BASELINE: PASS WITH OWNER NOTE**

**Owner Note:** Two documentation files (`DESIGN_001_REVISION_BRIEF.md` line 68, `2026_WEBDESIGN_WORKFLOW.md` line 238) still reference the deleted `design-001-homepage/` path. These are informational/historical references and do not affect runtime or source integrity. Recommended: update these references to point to the canonical `design-playground/index.html` in a future documentation pass.

---

**POST-CLEANUP VERIFICATION COMPLETE**
**FINAL VERDICT: DESIGN-001 CLEAN BASELINE: PASS WITH OWNER NOTE**
**PRODUCTION TOUCHED: NO**
**CHANGES MADE: NONE**
