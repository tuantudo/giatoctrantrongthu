# DESIGN-001 PROTOTYPE REPORT (REPAIRED — NAVIGABLE WEBSITE PROTOTYPE)

**Status:** PROTOTYPE REPAIRED — AWAITING OWNER VISUAL REVIEW
**Date:** 2026-09-14 (repair pass, verification pass)
**NO PRODUCTION DEPLOYMENT. NO PRODUCTION FILES TOUCHED.**

---

## 1. Canonical prototype path + old discrepancy

Canonical entry (Owner opens this in Dreamweaver: File > Open):

`design-playground/index.html`

Filesystem audit found THREE prototype generations:

- `design-playground/index.html` — **CANONICAL.** Full navigable prototype: utility strip, centered masthead (single `ngang` asset), publication navigation, 7 views (home / gia-pha / mach / story / tu-lieu / lich / tim-kiem), vanilla hash router (`js/router.js`), honest snapshot data (`js/prototype-data.js`). This is what Owner reviews.
- `design-playground/design-001/` — OLD artifact (earlier standalone iteration with its own `prototype.css/js` + its own `.masthead-tagline`). Not referenced by canonical. Left untouched (no deletion of suspected duplicates).
- `design-playground/design-001-homepage/` — OLD artifact (earlier homepage-only iteration: `part-a/part-b/data-c/data-d` split, local asset copy, HTML tagline `Từ 1872 đến chúng ta`). Not referenced by canonical. Left untouched.

Previous report described only `design-001-homepage/` as the prototype — **WRONG/outdated**. This repair pass corrects the record: Owner reviews `design-playground/index.html`.

## 2. Files created / modified (this repair pass — playground + report only)

- `design-playground/index.html` — canonical entry; masthead uses single `assets/logoGiaToc_ngang.svg`; NO HTML tagline; 7 `data-view` blocks; nav with `data-route`; footer colophon.
- `design-playground/css/prototype.css` — removed stale `.masthead-tagline` rules (element does not exist in canonical); all other responsive rules intact.
- `design-playground/js/router.js` — vanilla hash router (home / gia-pha / mach / story / tu-lieu / lich / tim-kiem + snapshot search handler).
- `design-playground/js/prototype.js` — snapshot renderers (lead, MACH rows, sidebar, memory, stats) + live-API upgrade path (fails silent offline).
- `design-playground/js/prototype-data.js` — REAL 2026-09-14 snapshot (mach.json / genealogy.json / CAL ICS rows), UTF-8 verbatim.
- `design-playground/assets/logoGiaToc_ngang.svg` — local copy of production asset for `file://` + Dreamweaver Live View.
- `docs/architecture/DESIGN_001_PROTOTYPE_REPORT.md` — this rewrite (removed stale duplicate second-half describing `design-001-homepage/`).

NO production files created/modified. NO deploy.

## 3. Logo fix + duplicate tagline removal (SOURCE + RUNTIME + VISUAL verified)

- Masthead markup: single `<img class="masthead-logo" src="assets/logoGiaToc_ngang.svg">`. No `<picture>` swap. No icon-only logo. No `logoGiaToc_original.svg` in prototype (prototype hypothesis = single asset).
- Asset resolves: HTTP 200, 26518 bytes at `/assets/logoGiaToc_ngang.svg`.
- Rendered evidence (live browser at `http://127.0.0.1:8931/index.html`): `naturalWidth = 300`; rendered 560px (1440) / 460px (1024, 768) / 320px (390); `hScroll = 0` at every width.
- Artwork `grep -c '<text'` = 0 → tagline lives in SVG artwork as vector paths.
## 4. Navigation implementation (navigable website prototype, not dead links)

Vanilla hash router `js/router.js` (file:// safe, no build step, no production code). Verified live by clicking — each destination shows exactly one view and updates `aria-current`:

- `#/` → **home** (utility, masthead, nav, lead with sidebar, MACH list, Ký ức, Tư liệu, Gia phả stats, colophon)
- `#/gia-pha` → **gia-pha** (stats 228/68/2, discovery direction, back-to-home)
- `#/mach` → **mach** (full listing, 5 real stories)
- `#/mach/bai-viet/:slug` → **story** (verified: title + kicker render from snapshot)
- `#/tu-lieu` → **tu-lieu** (honest archive placeholder + future structure note)
- `#/lich` → **lich** (3 real memorial rows from snapshot)
- `#/tim-kiem` → **tim-kiem** (snapshot search; live test "MẠCH" → 2 hits rendered)

Utility-strip `#cai-dat` link routes via router fallback to home (docs state production route is `#/cai-dat`; prototype-only, no settings view).

## 5. Data sources (REAL snapshots 2026-09-14, UTF-8 verbatim; NO fakes)

- `mach.json → stories[0..4]`: lead = "Giới Thiệu: MẠCH được bắt đầu như thế nào?" (deckLead verbatim, publishedAt, seriesSlug). Rows 02–05 with verbatim deckLead.
- `genealogy.json → memories[0]`: "KÝ ỨC VỀ ÔNG AN-TÔN TRẦN TRỌNG THƯ" (title/person verbatim, story excerpt). Stats verbatim: 228 / 68 / 2.
- `CAL_03_MEMORIALS.ics → SUMMARY/DTSTART rows`: Giuse Trần Trọng Thu (15/08), Trương Công Trạng + Trần Thị An (01/01).
- Tư Liệu: honest placeholder — media.json lacks semantic metadata; no gallery fabricated.
- Representative data: none. All rendered content is verbatim real snapshot. No lorem ipsum. No DB/API writes.

## 6. Responsive verification (RUNTIME via live browser, CSS viewport widths)

Single `ngang` asset at every viewport; responsiveness from layout/CSS only. No horizontal overflow anywhere:

| Viewport | Logo rendered | Lead layout | Overflow |
|---|---|---|---|
| 1440 | 560px | 2-col 65%/35% (749 + 363px) | 0 |
| 1024 | 460px | 2-col 60%/35% (586 + 362px) | 0 |
| 768 | 460px | single col (720px); sidebar stacks below | 0 |
| 390 | 320px | single col (358px); stats stack | 0 |

## 7. Dreamweaver compatibility

Single self-contained folder, relative paths (`css/`, `js/`, `assets/`), vanilla HTML/CSS/JS, no build step, no server required for basic render. Owner: Dreamweaver → File → Open → `design-playground/index.html` → Design/Live/Split all work; responsive viewport testing at 1440/1024/768/390.

## 8. Browser verification + console

- Playwright Chromium on `http://127.0.0.1:8931/index.html`.
- Logo rendered, all 7 views switch, story detail renders, search returns 2 results for "MẠCH".
- Console: `0` errors, `0` warnings (this verification session).
- `node --check` PASS on `js/prototype.js`, `js/prototype-data.js`, `js/router.js`.

## 9. Production scope verification

`git status` shows production `index.html`, `src/css/main.css`, `src/js/app.js` UNMODIFIED. Pre-existing dirty files (this session did NOT touch): `assets/images/logoGiaToc_ngang.svg`, `server/index.js`, `server/server.log`, `src/js/core/lunar-engine.js` — already modified before this task. CHANGE-001 not executed. No backend/API/database/auth/Vercel/DNS changes. No deploy.

## 10. Known limitations

- Snapshot data frozen 2026-09-14 (live-API upgrade path exists in `prototype.js` but fails silent offline).
- Old `design-001/` + `design-001-homepage/` artifacts remain on disk (intentionally not deleted; canonical unambiguous per §1).
- Lead hero art uses an honest placeholder frame (heroMediaId unresolvable from media.json).
- Utility `Cài đặt` link maps to home (no settings view in prototype; production route unchanged).
- Local verification server (port 8931) used for runtime checks; NO production deployment performed.

## 11. Exact next step: OWNER VISUAL REVIEW requested

Open `design-playground/index.html` in Dreamweaver + browser at 1440 / 1024 / 768 / 390. Judge:
1. Identity — vẫn là Gia Tộc Trần Trọng Thu?
2. Publication — giống online publication / living archive?
3. Hierarchy — mắt đi đúng: masthead → nav → lead → sections?
4. Editorial character — publication hơn web app?
5. Responsive — layout thích nghi tự nhiên khi hẹp?
6. Logo — một masthead ngang duy nhất có giữ identity đủ tốt ở mọi viewport?
7. Content — real data giúp đánh giá thay vì làm prototype giả tạo?

Decide: **APPROVE / REVISE / REJECT**. No agent-declared visual approval.
- Duplicate tagline: canonical `index.html` has ZERO `.masthead-tagline` elements; `grep` on canonical HTML/CSS = no match; live DOM check = no `Từ 1872 đến chúng ta` text. (`design-001-homepage/` old artifact still contains one — out of scope, not Owner-facing.)