# GIA TỘC TRẦN TRỌNG THU — Project AGENTS.md

Project-local instruction layer for the `giatoctrantrongthu.com` web project (`giatoctrantrongthu`).
Complements (does not replace) `~/.config/opencode/AGENTS.md`. This is a working doc for code, not a governance document.

---

## 1. Project Purpose

Vietnamese family heritage publishing system for the **Trần Trọng Thu** lineage (est. 1872). A static-first SPA that preserves, connects, and transmits family memory across generations. Core ethos: **"Giữ lại trước khi diễn giải"** (preserve before interpreting) — never fabricate history; label certainty honestly.

Canonical identity (never rewrite wording without Owner decision):
- Family name: `GIA TỘC TRẦN TRỌNG THU`
- Motto/narrative: `TỪ 1872 ĐẾN CHÚNG TA`

Three publication territories: **GIA PHẢ** (structured genealogy), **MẠCH** (essays/memories), **TƯ LIỆU** (archival records). System capabilities (Calendar, Search, Family Graph) are functions, never separate brands.

---

## 2. Tech Stack (actual, verified 2026-09-10)

- **Frontend:** Vanilla HTML/CSS/JS single-page app — no bundler, no framework. Entry `index.html` → `src/js/app.js` (hash-routing), stylesheet `src/css/main.css` (CSS variables design tokens).
- **Data layer:** JSON datasets served at `https://api.giatoctrantrongthu.com/api/*`. Local source: `server/data/genealogy.json`, `server/data/mach.json`, `server/data/media.json`, `server/data/person_media.json`, plus 4 iCalendar feeds in `server/calendars/`.
- **Data generation (Python):** `generator/export_genealogy_json.py` (GEDCOM→JSON, GED sourcing via `GEDCOM_FILE_PATH`), `generator/generate_calendar_feeds.py` (4 ICS feeds, RFC 5545), `generator/validate_integrity.py` (integrity gate).
- **MẠCH publication engine:** `scripts/build_mach.py` — compiles `content/mach/**` Markdown into `mach.json` / rendered HTML (custom Markdown extension: strikethrough, safe inlines).
- **Admin/API backend (Node/Express):** `server/index.js` — Express API with MariaDB (production) or SQLite fallback (`server/family_archive.db`). Seed `database/migrations/*.sql`. Auth not yet implemented (V1).
- **Languages:** Python 3.11+ (CI) / 3.14 (local), Node v26.7.0.

---

## 3. Repository Structure (key paths)

```
index.html                  # SPA shell (routes, sections)
src/js/app.js               # App controller: routing, graph engine, calendar, MẠCH
src/js/core/ics-parser.js   # RFC 5545 ICS parser
src/js/core/lunar-engine.js # Lunar (âm lịch) converter (Hồ Ngọc Đức algorithm)
src/css/main.css            # All styles, canonical design tokens (CSS variables)
admin/                      # Admin control room (no auth yet)
  index.html / css/admin.css / js/admin.js / js/api.js / js/mockData.js
server/                     # Node API (Express + MariaDB/SQLite) + datasets + feeds
  index.js  data/*.json  calendars/*.ics  create_schema.js  migrate_events_schema.js
generator/                  # Python data pipeline + integrity validator
content/mach/               # Markdown source for MẠCH articles/series (issues, thư gửi Clara)
scripts/                    # build_mach.py + migration/QA helper scripts
database/migrations/        # MariaDB schema + seed SQL
docs/                       # Architecture, design system, ontology, audits (Vietnamese)
  README.md (doc index)  architecture/  design/  ontology/  ux/  product/  publication/
tests/                      # Python acceptance tests (MẠCH), no wired test runner
prototype/                  # Old prototype (superseded by main app)
```

---

## 4. Important Application Architecture

- **Static-first SPA:** `index.html` loads app, fetches JSON from `api.giatoctrantrongthu.com`, renders all views client-side. Hash-routing (`#/...`), routes + context defined in `ROUTE_CONTEXTS` in `app.js`.
- **Data-driven, zero hard-code:** app does not hardcode family data. People/families/timeline/memories come from `genealogy.json`; MẠCH from `mach.json`; media from `media.json` + `person_media.json`.
- **BFS graph engine** (`deriveFamilyGraphGenerations`): derives generation levels (F0–F4) and lineage paths from relationship edges at runtime.
- **Calendar:** 4 ICS feeds parsed by `IcsParser` (`src/js/core/ics-parser.js`), plus `LunarCal` (`lunar-engine.js`) for âm lịch rendering.
- **Media resolver:** `getPersonMedia` / `resolvePersonAvatar` — media IDs link people to NAS-hosted asset URLs. Presentation never infers filenames from FSID.
- **Admin→API→DB loop:** admin optionally updates MariaDB; public API reads DB tables and merges `payload` JSON with structured columns. (Known issue: People/Stories payload merge is partially broken — see PROJECT_STATE.md.)

---

## 5. Database / Data Model

- **Canonical contract:** `docs/architecture/DATA_CONTRACT.md` (genealogy.json shape: `people`, `families`, `timeline`, `memories`, `stats`, `rootAnchor`).
- **Source of truth:** private GEDCOM `GIADINHONGTHU.ged` (never committed; loaded from `GEDCOM_FILE_PATH` or env).
- **MariaDB tables** (admin/production, see `server/create_schema.js` + `database/migrations`): `people`, `stories`, `edges`, `events`→`calendar_events`, `families`, `memories`, `timeline`, `authors`, `series`, `media`, `person_media`. Structured columns + `payload` JSON column coexist.
- **SQLite fallback** (`server/family_archive.db`): local dev without MariaDB.
- **Media:** binaries live on NAS (`/volume1/web/family-api/assets/images/`); DB stores metadata + relative path; API maps to absolute `https://api.giatoctrantrongthu.com/...`.

---

## 6. Content / Data Conventions

- **Epistemic certainty (7 levels)** from `docs/ontology/ONTOLOGY_AND_RULES.md`: `CONFIRMED`, `ORAL_TRADITION`, `MEMORY`, `INTERPRETATION`, `UNVERIFIED`, `DISPUTED`, `UNKNOWN`. Label data honestly; **never invent** names/dates/lineages to "fill gaps."
- **Never** fabricate history, upgrade hypotheses to fact, or "beautify" genealogy to make the family look grand.
- **Retain historical IDs/slugs/URLs** — do not break deep links (compatibility preservation rule).
- **MẠCH content:** Markdown in `content/mach/<issue>/NN — SLUG.md`; compiled by `scripts/build_mach.py`. Articles can carry editorial voice but must stay distinct from historical fact.
- **Calendar UIDs:** stable — `memorial-{FSID}-{YEAR}` pattern per ontology rules.

---

## 7. Design / UI Conventions

- **Canonical tokens** live in `src/css/main.css` `:root` (authoritative runtime) and `docs/design/family-site-design-system-v1.md`.
- **Typography:** EB Garamond (serif, display/story) + Inter (sans, utility/UI). System font scale via `--global-text-scale` (`calc()`), never smaller than 14px on mobile.
- **Colors:** archival paper (`--bg #FAF9F5`), seal/lacquer red `#881337`, imperial gold `#B45309`, ink black `#1A1A1A`/`#1A1A1B`. Avoid `#000`; use `#1A1A1A`.
- **No emoji as system icon** (iconography = functional monochrome, currentColor, no rainbow). Gia Phả/Mạch/Tư Liệu are territories, NOT separate color themes.
- **JS must not inject inline styles**; CSS variables manage color/typography/spacing. Flat 2D (radius 0, no shadows) is intentional.
- **Vietnam-grade fonts:** use Vietnamese diacritics fully; ensure EB Garamond/Inter render diacritics correctly.

---

## 8. Development Commands

| Action | Command |
|--------|---------|
| Serve static site locally | `python3 -m http.server 8080` → http://localhost:8080 |
| Serve/run Node API locally (SQLite) | `cd server && node index.js` (needs `server/.env`, falls back SQLite) |
| Regenerate genealogy JSON | `python3 generator/export_genealogy_json.py` (GED source required) |
| Generate 4 ICS feeds | `python3 generator/generate_calendar_feeds.py` |
| Compile MẠCH content | `python3 scripts/build_mach.py` |
| **Data integrity gate** | `python3 generator/validate_integrity.py` |
| MẠCH render QA | `python3 tests/test_markdown_acceptance.py`, `python3 tests/verify_mach_blocks.py` |

**NOTE (verified 2026-09-10):** the integrity gate currently FAILS because `validate_integrity.py` expects root `data/genealogy.json` + root `calendars/`, but the live datasets are at `server/data/*.json` + `server/calendars/*.ics`. Treat the gate's "missing data" result as an environment/consistency issue until resolved — do not treat it as proof the data is corrupt.

---

## 9. Build Commands

There is **no bundler/server build step** — the frontend is static (Vercel serves `index.html` + static assets directly). The only "builds" are data/content generation:
- `python3 generator/export_genealogy_json.py` (genealogy JSON)
- `python3 generator/generate_calendar_feeds.py` (ICS feeds)
- `python3 scripts/build_mach.py` (MẠCH compiled output)

Vercel itself just serves the static repo; `.vercel` project + `vercel.json` handle routing/headers/cache. Deploy via git push (Vercel auto-builds the branch).

---

## 10. Test / Lint / Typecheck Commands

- **Test:** no formal JS test runner or lint/typecheck is wired. `npm test` is a stub.
- **Available checks:** `python3 tests/test_markdown_acceptance.py`, `python3 tests/verify_mach_blocks.py`, and `python3 generator/validate_integrity.py`.
- **Manual QA:** open `index.html` in browser / `python3 -m http.server 8080`; verify JS console has no errors, all sections render, calendar grid, genealogy graph, MẠCH article rendering (semantic HTML, not raw markdown), and mobile layout.

---

## 11. Local Development Workflow

1. Serve static preview: `python3 -m http.server 8080` (or open `index.html`).
2. To use the API locally: `cd server && node index.js` (SQLite fallback if no MariaDB env), then point app to `http://localhost:3000` where relevant.
3. Iterate: edit `src/js/app.js`, `src/css/main.css`, `index.html`. No build step — refresh browser.
4. After data/content changes, regenerate + run integrity gate; keep datasets in `server/data/` + `server/calendars/`.
5. Open the app in a browser (or automated browser MCP) to verify visuals & behavior.

---

## 12. Deployment Workflow

- **Production:** pushes to `main` auto-deploy to `https://giatoctrantrongthu.vercel.app` via Vercel; domain `giatoctrantrongthu.com` (Cloudflare proxy) serves it. `vercel.json` defines routes, headers, security headers, and the `admin.` subdomain → `/admin` redirect.
- **Admin/API:** Node API + MariaDB live on NAS behind Cloudflare Tunnel (route `/api/*`, `/assets/images/*`); deploy Node/DB changes via ssh/rsync to NAS (manual, documented in `docs/infrastructure/`).
- **CI:** `.github/workflows/validate-data.yml` runs `validate_integrity.py` on push (currently red for the same root-`data/` mismatch); `instant-sync.yml` triggers Google Calendar sync webhook after `calendars/**` change.
- **Local preview before deploy:** `python3 generator/validate_integrity.py` + browser QA.

---

## 13. Important Environment / Configuration Constraints

- **Do NOT commit**: `.env`, `local_secrets.*`, `*.ged`/`*.gedcom`, `server/family_archive.db`, node_modules, `.vercel` (see `.gitignore`).
- **Domains/endpoints:** prod `https://giatoctrantrongthu.vercel.app`; API `https://api.giatoctrantrongthu.com`; admin `admin.giatoctrantrongthu.com`. In code, `CAL_FEEDS` and fetch URLs use the API origin directly.
- **Admin V1 has no authentication** — treat admin UI as a public-but-obscure endpoint; never add credentials/secrets to repo.
- **Python version drift:** CI uses Python 3.11; local is 3.14 — keep scripts compatible with 3.11.
- **Node backend expects `server/.env`** (DB_CLIENT, DB_HOST, DB_USER, DB_PASSWORD, etc.) — do not commit.

---

## 14. Things That Must Not Be Broken

- **Canonical brand wording** `GIA TỘC TRẦN TRỌNG THU / TỪ 1872 ĐẾN CHÚNG TA` — no alternate phrasings, no `CÂY GIA PHẢ` as a brand line.
- **Historical facts & epistemic labels** — never fabricate or "beautify" lineage; preserve 7-level certainty labels.
- **Deep links / slugs / IDs** — person/family/story routes (`#/person/...`, slug-based MẠCH) must keep working.
- **Calendar feeds & UID stability** — 4 ICS feeds and stable UIDs (`memorial-{FSID}-{YEAR}`) are canonical.
- **100% data-driven rendering** — avoid hardcoding people/family data in JS/HTML.
- **Design-system invariants** — canonical typography/color/iconography; no emoji-as-icon, no inline styles from JS, no color-coding territories.
- **Vietnamese diacritics** in all user-facing UI and MẠCH content.
- **Repository hygiene** — no secrets, no GED/DB/`.vercel` artifacts committed.

---

## 15. Verification Expectations

After any change, verify what you touched:
- JS/CSS/HTML edits → reload in browser (or browser MCP), check console for errors, confirm affected sections render.
- Data/content changes → regenerate + run `validate_integrity.py` (note §8 current gate mismatch) → confirm the app displays correct counts/facts.
- MẠCH edits → run `scripts/build_mach.py` + `tests/verify_mach_blocks.py` / `test_markdown_acceptance.py`, and view a rendered article.
- API/server changes → run Node server locally (SQLite) and smoke-test affected endpoints (`/api/*`).
- Deployment → rely on CI gate + preview before pushing to main.

Report verification status honestly (VERIFY OK / PARTIAL / UNKNOWN). If a check cannot run (e.g., no GED source available), say so.

---

## 16. Vibe-Coding Behavior

- **Intent clear + low-risk/reversible** → proceed directly. Do the edit, run the relevant check, report. No ceremony.
- **Read enough context first** — understand the file/route/module before touching it; use Grep/Glob to locate exactly rather than reading the whole repo.
- **Parallelize independent reads/checks** when safe.
- **Precise search over bulk reads** — e.g., find a CSS token before editing it.
- **Do not stop to ask permission for each small file edit** — batch small, clear changes and verify.
- **Do not expand scope** because you noticed something else — record it, don't make it a new mission.
- **If something is architectural / destructive / high-risk** (delete, restructure, migration, brand-wording change, real data change) → pause and ask Human first.
- **Verify after change** with the appropriate check (§15). Fix failures within scope.
- **Report short on completion:** what changed, what was verified, what remains.

---

## 17. Key Reference Docs (read on demand, not upfront)

- `docs/README.md` — documentation pipeline & reading guide by persona
- `docs/architecture/ARCHITECTURE.md` — canonical architecture (3 tiers, brand, iconography/color principles)
- `docs/architecture/DATA_CONTRACT.md` — genealogy.json schema
- `docs/architecture/SITEMAP_01_INFORMATION_ARCHITECTURE.md` — IA/routing
- `docs/ontology/ONTOLOGY_AND_RULES.md` — epistemic certainty + entity model
- `docs/publication/PUBLICATION_MODEL_01.md` — 3 territories, page types
- `docs/design/family-site-design-system-v1.md` — visual language/design tokens
- `docs/design/family-site-art-direction-v1.md` — art direction (Living Chronicle)
- `PROJECT_STATE.md` — live E2E status (events PASS; people/stories PARTIAL-FAIL)
- `PROJECT_ROADMAP.md`, `PROJECT_DECISIONS.md` — direction + decisions