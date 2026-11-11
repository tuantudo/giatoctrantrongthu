# DESIGN-001 PROTOTYPE REPORT — REVISION PASS

**Status:** DESIGN-001 REVISION PROTOTYPE COMPLETE — OWNER VISUAL / PRODUCT REVIEW REQUIRED
**Canonical entry point:** `design-playground/index.html`
**Data mode:** Real snapshot (mach.json + genealogy.json, 2026-09-14) + clearly-labelled draft copy.
**Production:** UNTOUCHED. **Deployment:** NOT PERFORMED.

---

## 1. Canonical path & discrepancy resolution

Audit of `design-playground/` found three artifact generations. Canonical = `design-playground/index.html` (the file Owner opened). Non-canonical `design-001/` and `design-001-homepage/` directories are earlier drafts; they were **not deleted** (no authorization to remove) and are not referenced by the canonical entry point.

## 2. Revision implemented (per DESIGN_001_REVISION_BRIEF.md)

### Homepage narrative
`IDENTITY (masthead) → INTRODUCTION (draft copy: "Gia Tộc Trần Trọng Thu là ai?") → ORIENTATION / CHOOSE YOUR PATH (public vs member) → CURATED CONTENT (3 MẠCH stories + 1 memory) → DEEPER EXPLORATION (colophon links)`

- No database dump. Stats (228 / 68 / 2) appear once as one restrained line inside Introduction, labelled "(số liệu thật, trình bày tiết chế)".
- Introduction copy marked `[DRAFT]` — not invented as fact.

### Public / Member / Owner boundary
- **Public nav:** Trang chủ, MẠCH, Tư Liệu, Gia Phả, Lịch, Tìm kiếm.
- **Member entry:** `Tư cách thành viên →` in utility strip + dedicated `#/tu-cach-thanh-vien` view + "Tôi là Thành viên" path block. Auth NOT implemented (honest placeholder).
- **Owner Control Plane:** NOT in public navigation; architectural indication in colophon only.

### Global publication shell
Utility strip → masthead (single `logoGiaToc_ngang.svg` artwork, tagline inside artwork as vector paths — no HTML tagline duplicate) → **sticky** publication nav (runtime-verified `position: sticky`) → views → colophon. Utilities iconified: `⌂` Trang chủ, `⌕` Tìm kiếm, `⚙` Cài đặt.


### Views / routes (10, all runtime-verified: exactly one visible view each)
| Route | View | Content |
|---|---|---|
| `#/` | home | Intro + paths + curated grid (3 real stories) + memory (real 423-char text) + teasers |
| `#/mach` | mach | Full real listing |
| `#/mach/bai-viet/<slug>` | story | Real article + reading tools |
| `#/tu-lieu` | tu-lieu | Honest state (metadata gap), archive-structured |
| `#/gia-pha` | gia-pha | Real stats + discovery direction, no people dump |
| `#/lich` | lich | Real memorial rows from ICS snapshot |
| `#/tim-kiem` | tim-kiem | Working client-side search over real data |
| `#/tu-cach-thanh-vien` | member entry | Placeholder, honest |
| `#/cai-dat` | settings | Placeholder |
| `#/gia-pha/ky-uc` | memories | Real memory list |

### Reading tools (story detail only — not in nav)
Runtime-verified: **A− / A+ / Share / Bookmark / Comment / Print**. A−/A+ functional. Share/Bookmark/Comment/Print are visual placeholders — no fake backend claims.

### System tools
- **Back-to-top:** runtime-verified (scrollY 1200 → 35 after click).
- **Chatbot:** FAB opens panel with honest "chưa kết nối" copy; closes correctly.

### Footer / Colophon
Source-backed content: publication identity, archive sections, member boundary note, Owner-Control-Plane architectural indication. No invented facts.

## 3. Verification evidence

| Check | Method | Result |
|---|---|---|
| JS syntax | `node --check` ×4 files | PASS |
| Asset paths | curl 200 ×8 (css, 4 js, 3 svg) | PASS |
| Logo rendered | Playwright: `logoGiaToc_ngang.svg`, naturalWidth > 0 | PASS |
| No HTML tagline duplicate | Runtime DOM query + `grep 1872` markup | PASS |
| Nav sticky | `getComputedStyle` = `sticky` | PASS |
| All 10 routes | Playwright: one visible `[data-view]` each | PASS |
| Back-to-top / chatbot | Playwright click-through | PASS |
| Reading tools | DOM extraction | 6 tools present |
| Responsive 1440/1024/768/390 | Playwright resize: no horizontal overflow, logo renders at all | PASS |
| Console | Playwright listener after favicon fix | **0 errors** |
| Production files | `git status`: only pre-existing mods (server/index.js, server.log, lunar-engine.js, assets/images/logoGiaToc_ngang.svg) | not mine, untouched |

## 4. Files created/modified (this revision)

- `design-playground/index.html` — revision IA, nav fix, favicon link
- `design-playground/css/prototype.css` — revision layout, sticky nav, paths, tools
- `design-playground/js/prototype.js` — narrative section renderers
- `design-playground/js/router.js` — 10-route hash router
- `design-playground/js/system.js` — back-to-top + chatbot panel
- `design-playground/js/prototype-data.js` — real snapshot data
- `design-playground/assets/logoGiaToc.svg` — favicon asset copy (icon-only = favicon only)
- `docs/architecture/DESIGN_001_PROTOTYPE_REPORT.md` — this report

## 5. Known limitations / open decisions for Owner

1. Member Space is a placeholder — auth/architecture is future work (out of DESIGN-001 scope).
2. Reading tools beyond A−/A+ are visual prototypes, not wired to any backend.
3. Chatbot panel is an entry mock only.
4. Introduction copy is `[DRAFT]` pending verified sources.
5. Brief Open Question §6.2 (calendar on public homepage) awaits Owner decision.
6. Brief Open Question §6.3 (stats line on homepage) awaits Owner decision.
7. Single-asset masthead (`ngang` only, no swap) is the hypothesis under test — confirmed rendering at all 4 viewports.

## 6. Explicit statements

- NO PRODUCTION DEPLOYMENT.
- NO production file modified by this task.
- NO visual acceptance declared. **OWNER VISUAL / PRODUCT REVIEW REQUIRED** (Dreamweaver: File → Open → `design-playground/index.html`, or open directly in browser).
