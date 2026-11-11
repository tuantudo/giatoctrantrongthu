# TECHNICAL CAPABILITY INVENTORY — Agent Architecture Readiness

**Project:** giatoctrantrongthu
**Date:** 2026-09-15
**Role:** Technical Lead (READ-ONLY audit)
**Purpose:** Feed AGY for Agent Architecture design

---

## EXECUTIVE SUMMARY

Giatoc is a **vanilla SPA + Node.js API + MariaDB** system with zero framework dependency. The codebase is small (~9K lines of application code) but monolithic. Every layer is editable by OpenCode. The critical gap is **no automated test runner** and **broken CI**. Production data path is currently operational (verified 2026-09-15 09:28 UTC+7).

---

## 1. FRONTEND ARCHITECTURE

### 1.1 Structure

| File | Lines | Role |
|------|-------|------|
| `index.html` | 383 | SPA shell — all `data-view` sections defined inline |
| `src/js/app.js` | 2,964 | **Monolith** — routing, rendering, graph engine, calendar, MACH, search, modals, font scaling |
| `src/js/app-v2.js` | 202 | DESIGN-001 prototype (independent, loads via `index.html` only) |
| `src/js/core/ics-parser.js` | 53 | RFC 5545 ICS parser (IcsParser namespace) |
| `src/js/core/lunar-engine.js` | 87 | Vietnamese lunar calendar (LunarCal namespace) |
| `src/css/main.css` | 5,169 | Full design system — tokens, layout, all component styles |
| `src/css/prototype.css` | 287 | DESIGN-001 prototype stylesheet (independent) |

### 1.2 Capability Matrix

| Capability | EXISTS | AVAILABLE | PROJECT-READY | Notes |
|------------|--------|-----------|---------------|-------|
| Hash-based SPA routing | YES | YES | YES | 20+ routes in `ROUTE_CONTEXTS`, parameterized routes (`/person/:id`, `/mach/bai-viet/:slug`) |
| Component rendering (vanilla) | YES | YES | YES | All views rendered via DOM manipulation in app.js |
| BFS family graph engine | YES | YES | YES | `deriveFamilyGraphGenerations()` — generation levels, lineage paths, family unit derivation |
| Interactive pedigree tree | YES | YES | YES | Focus/Explore modes, pan, pinch zoom, touch support |
| Calendar (month + agenda) | YES | YES | YES | ICS parsing, lunar calendar, day drawer, event modals, subscription UI |
| MACH editorial module | YES | YES | YES | Article listing, series, author profiles, article detail with block rendering |
| Global search | YES | YES | YES | Cross-entity search (people, stories, series, authors) |
| Media resolver | YES | YES | YES | Person-media N:N, portrait resolution, gender-aware SVG fallbacks |
| Person/Family profiles | YES | YES | YES | Full profile views with relationships, avatars, memories |
| Font size control | YES | YES | YES | `--global-text-scale` with localStorage persistence |
| CSS design tokens | YES | YES | YES | 80+ CSS custom properties in `:root` |
| Brand system | YES | YES | YES | `brand/manifest.json` → `brand/generated/brand.css` (auto-generated) |
| Inline markdown renderer | YES | YES | YES | `formatInlineMarkdown()` — bold, italic, links, code, wikilinks, footnotes |
| Block content renderer | YES | YES | YES | `renderContentBlocks()` — 12 block types (paragraph, heading, media, quote, callout, etc.) |
| Admin Control Room | YES | YES | YES | Separate SPA (`admin/`) — CRUD for people, stories, events |
| Chatbot widget | EXISTS | PARTIAL | NO | `toggleChatbotDrawer()` exists, no backend connected |
| Service worker / offline | NO | NO | NO | Not implemented |
| SSR / SSG | NO | NO | NO | Pure client-side SPA |

### 1.3 OpenCode-Editable Frontend Layers

**YES — full read/write:**
- All HTML (index.html, admin/index.html)
- All JS (app.js, app-v2.js, ics-parser.js, lunar-engine.js)
- All CSS (main.css, prototype.css, brand generated)
- Brand manifest (manifest.json)

**CONSTRAINT: Must maintain:**
- Vanilla JS only (no framework引入)
- Hash-based routing pattern
- CSS variables design token system
- 100% data-driven rendering (zero hard-code)
- Vietnamese diacritics throughout
- Flat 2D design (radius 0, no shadows)

---

## 2. BACKEND / API

### 2.1 Structure

| File | Lines | Role |
|------|-------|------|
| `server/index.js` | 362 | Express API — all routes in single file |
| `server/package.json` | 20 | Dependencies: express@5.2.1, cors, dotenv, mysql2, sqlite3 |
| `server/.env.example` | 6 | DB_CLIENT, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME |

### 2.2 API Endpoints

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/genealogy.json` | GET | Public genealogy (228 people, 68 families) | OPERATIONAL |
| `/api/mach.json` | GET | Public MACH (3 authors, 2 series, 20 stories) | OPERATIONAL |
| `/api/media.json` | GET | Public media registry (203 assets) | OPERATIONAL |
| `/api/person_media.json` | GET | Person-media relations (173 entries) | OPERATIONAL |
| `/api/calendars/:filename` | GET | ICS calendar feeds (4 feeds) | OPERATIONAL |
| `/api/people` | GET/POST | Admin CRUD | OPERATIONAL |
| `/api/stories` | GET/POST | Admin CRUD | OPERATIONAL |
| `/api/edges` | GET/POST/DELETE | Admin graph edges | OPERATIONAL |
| `/api/events` | GET/POST | Admin calendar events | OPERATIONAL |

### 2.3 Capability Matrix

| Capability | EXISTS | AVAILABLE | PROJECT-READY | Notes |
|------------|--------|-----------|---------------|-------|
| Express.js API server | YES | YES | YES | Single-file server, port 3000 |
| CORS enabled | YES | YES | YES | `cors()` middleware |
| MariaDB connection pool | YES | YES | YES | mysql2/promise, connectionLimit: 10 |
| SQLite fallback | YES | YES | YES | Automatic when DB_CLIENT !== 'mysql' |
| Auto schema creation | YES | YES | YES | `CREATE TABLE IF NOT EXISTS` on startup |
| Public data adapters | YES | YES | YES | 4 JSON endpoints + 4 ICS endpoints |
| Admin CRUD | YES | YES | YES | People, stories, edges, events |
| Payload JSON merge | YES | PARTIAL | **BROKEN** | Admin REPLACE INTO overwrites payload column |
| Authentication | NO | NO | NO | Admin V1 has zero auth |
| Rate limiting | NO | NO | NO | Not implemented |
| Input validation | NO | NO | NO | No sanitization on admin endpoints |
| Error handling | MINIMAL | MINIMAL | PARTIAL | try/catch with 500 responses |
| Logging | MINIMAL | MINIMAL | PARTIAL | console.log only |
| Health check | NO | NO | NO | No `/api/health` endpoint |

### 2.4 OpenCode-Editable Backend Layers

**YES — full read/write:**
- `server/index.js` (all routes)
- `server/package.json` (dependencies)
- `server/schema_update.sql` (schema migrations)
- `server/create_schema.js`, `server/nas_migrate.js`, `server/migrate_events_schema.js`

**CONSTRAINT: No SSH to NAS from OpenCode runtime. Deploy via rsync/SSH (Human操作).**

---

## 3. DATABASE

### 3.1 Schema

| Table | Columns | Purpose | Rows |
|-------|---------|---------|------|
| `people` | id, name, birthYear, deathYear, gender, notes, status, fsid, payload(JSON) | Family members | 228 |
| `families` | id, husb, wife, payload(JSON) | Family units | 68 |
| `stories` | id, title, author, content, status, updatedAt, payload(JSON) | MACH articles | 20 |
| `edges` | source_id, target_id, edge_type | Relationship graph | — |
| `memories` | id, title, story, personId, payload(JSON) | Family memories | 2 |
| `timeline` | id, date, title, description, icon | Timeline events | 215 |
| `media` | id, filename, mimetype, payload(JSON) | Media registry | 203 |
| `person_media` | relation_id, person_id, asset_id, role, is_primary | Person-media N:N | 173 |
| `calendar_events` | uid, summary, dtstart, description, calendar_type, status, event_type, location, dtend | Calendar events | — |
| `authors` | id, name, role, payload(JSON) | MACH authors | 3 |
| `series` | id, title, description, payload(JSON) | MACH series | 2 |

### 3.2 Capability Matrix

| Capability | EXISTS | AVAILABLE | PROJECT-READY | Notes |
|------------|--------|-----------|---------------|-------|
| MariaDB (production) | YES | YES (on NAS) | YES | UTF-8mb4, connection pool |
| SQLite (local dev) | YES | YES | YES | Automatic fallback |
| Schema migrations | YES | YES | PARTIAL | 3 SQL files, no versioning system |
| Payload JSON column | YES | YES | **BROKEN** | Admin writes lose payload data |
| Referential integrity | NO | NO | NO | No foreign keys |
| Indexes | NO | NO | NO | No explicit indexes beyond PKs |
| Seed data | YES | YES | YES | Baseline + test seed scripts |

### 3.3 OpenCode-Editable Database Layers

**YES — full read/write:**
- `database/migrations/*.sql` (schema definitions)
- `server/schema_update.sql` (incremental migrations)
- `server/create_schema.js` (migration runner)
- `server/nas_migrate.js` (data loader)

**NO — cannot execute:**
- Direct MariaDB queries (NAS only)
- Database backup/restore

---

## 4. MEDIA

### 4.1 Architecture

```
NAS filesystem: /volume1/web/family-api/assets/images/
  └── mach/thu-gui-clara/001.png ... 020.png  (MACH article images)
  └── (other directories)

DB: media table (203 entries) → payload JSON (file, sha256, mimeType, source, sourceId)
DB: person_media table (173 entries) → person_id ↔ asset_id N:N

API: Express static middleware → /assets/images/* → NAS filesystem
Frontend: resolvePersonAvatar() → getPersonMedia() → asset.file URL
```

### 4.2 Capability Matrix

| Capability | EXISTS | AVAILABLE | PROJECT-READY | Notes |
|------------|--------|-----------|---------------|-------|
| Media metadata registry | YES | YES | YES | 203 entries in media table |
| Person-media N:N relations | YES | YES | YES | 173 entries, role-based (PORTRAIT, etc.) |
| Static file serving | YES | YES | YES | Express `express.static()` middleware |
| Avatar resolver | YES | YES | YES | `resolvePersonAvatar()` with gender-aware fallbacks |
| Media upload (admin) | NO | NO | NO | No admin UI for media management |
| Image optimization | NO | NO | NO | Original files served as-is |
| CDN / caching | PARTIAL | PARTIAL | PARTIAL | Cloudflare caches, but no explicit cache headers for images |
| Media provenance tracking | YES | YES | YES | source, sourceId, sha256 in media payload |

### 4.3 OpenCode-Editable Media Layers

**YES — read metadata:**
- `server/data/media.json` (static snapshot)
- `server/data/person_media.json` (static snapshot)
- DB schema for media/person_media tables

**NO — cannot:**
- Upload files to NAS
- Manage NAS filesystem
- Resize/optimize images

---

## 5. DEPLOYMENT

### 5.1 Infrastructure

| Component | Technology | Host | Status |
|-----------|-----------|------|--------|
| Frontend | Vercel (static) | Vercel CDN | LIVE |
| API server | Node.js/Express | NAS (100.80.147.119) | LIVE (verified) |
| Database | MariaDB 10.x | NAS | LIVE (inferred) |
| Tunnel | Cloudflare Tunnel | Cloudflare ↔ NAS | LIVE (inferred) |
| Domain | Cloudflare DNS | Cloudflare | LIVE |
| Media files | NAS filesystem | `/volume1/web/family-api/` | LIVE (inferred) |
| CI | GitHub Actions | GitHub | PARTIAL (validate-data broken) |

### 5.2 Capability Matrix

| Capability | EXISTS | AVAILABLE | PROJECT-READY | Notes |
|------------|--------|-----------|---------------|-------|
| Auto-deploy frontend (git push) | YES | YES | YES | Vercel auto-builds from `main` |
| Custom domain | YES | YES | YES | `giatoctrantrongthu.com` via Cloudflare |
| Cloudflare Tunnel | YES | YES | YES | Routes `api.*` to NAS |
| Vercel headers/redirects | YES | YES | YES | `vercel.json` configured |
| CI: data validation | YES | YES | **BROKEN** | Path mismatch (`data/` vs `server/data/`) |
| CI: calendar sync | YES | YES | YES | Google Apps Script webhook |
| Staging environment | NO | NO | NO | No preview deployments |
| Rollback capability | YES | YES | YES | Vercel supports instant rollback |
| Infrastructure as Code | NO | NO | NO | Manual NAS setup |

### 5.3 OpenCode-Editable Deployment Layers

**YES — full read/write:**
- `vercel.json` (routing, headers, redirects)
- `.github/workflows/*.yml` (CI pipelines)
- `package.json` (root-level scripts)

**NO — cannot:**
- SSH to NAS
- Restart cloudflared
- Restart Node.js process on NAS
- Modify Cloudflare account settings
- Trigger Vercel deploy (git push required)

---

## 6. TESTING / E2E

### 6.1 Current State

| Test | File | Framework | Status |
|------|------|-----------|--------|
| MACH markdown acceptance | `tests/test_markdown_acceptance.py` | Python unittest | EXISTS |
| MACH block verification | `tests/verify_mach_blocks.py` | Python script | EXISTS |
| Data integrity gate | `generator/validate_integrity.py` | Python script | **BROKEN** (path mismatch) |
| JavaScript unit tests | — | — | **NONE** |
| E2E browser tests | — | — | **NONE** |
| API integration tests | — | — | **NONE** |
| `npm test` | `package.json` | — | STUB (`echo "Error: no test specified"`) |

### 6.2 Capability Matrix

| Capability | EXISTS | AVAILABLE | PROJECT-READY | Notes |
|------------|--------|-----------|---------------|-------|
| Python acceptance tests | YES | YES | YES | MACH markdown rendering validation |
| CI data integrity gate | YES | YES | **BROKEN** | Expects root `data/`, live data in `server/data/` |
| JS unit test framework | NO | NO | NO | No jest/vitest/mocha configured |
| E2E browser testing | NO | NO | NO | No Playwright/Cypress |
| API smoke tests | NO | NO | NO | No automated endpoint verification |
| Manual browser QA | YES | YES | YES | Open `index.html` or `localhost:8080` |
| curl API testing | YES | YES | YES | Manual verification |

### 6.3 OpenCode-Editable Testing Layers

**YES — can create/modify:**
- Python test files (`tests/*.py`)
- CI workflow files (`.github/workflows/*.yml`)
- JavaScript test files (if test framework added)
- `package.json` scripts

**YES — can execute (with bash):**
- `python3 tests/test_markdown_acceptance.py`
- `python3 tests/verify_mach_blocks.py`
- `python3 generator/validate_integrity.py` (after path fix)
- `curl` API endpoint tests

**CONSTRAINT: No browser automation MCP available in current runtime.**

---

## 7. DESIGN SYSTEM / UI STRUCTURE

### 7.1 Token System

| Category | Tokens | Source |
|----------|--------|--------|
| Colors | `--bg`, `--surface`, `--text-main`, `--lacquer-red`, `--imperial-gold`, etc. | `main.css :root` |
| Generation colors | `--gen-f0` through `--gen-f4` (bg, border variants) | `main.css :root` |
| Category colors | `--cat-birth`, `--cat-patron`, `--cat-mem`, `--cat-event` | `main.css :root` |
| Typography | `--font-brand` (Times New Roman), scale tokens, weight tokens | `brand/generated/brand.css` |
| Layout | `--container-max`, `--nav-height`, transitions | `main.css :root` |
| Shape | `--radius-md/sm/lg: 0` (flat 2D), `--shadow-*: none` | `main.css :root` |

### 7.2 Component Inventory

| Component | CSS Class Pattern | Usage |
|-----------|------------------|-------|
| Top navigation | `.nav-item-btn`, `.nav-search`, `.nav-dropdown` | Global nav bar |
| Person card | `.person-card`, `.card-avatar-box`, `.gen-badge` | People directory, tree nodes |
| Family card | `.family-card`, `.f-gen-badge` | Families directory |
| Graph node | `.graph-node`, `.node-avatar-box`, `.union-hub` | Interactive pedigree tree |
| Story card | `.story-card`, `.story-card-tag` | MACH article listing |
| Series card | `.series-card`, `.series-card-badge` | MACH series |
| Author card | `.author-card`, `.author-avatar` | MACH authors |
| Calendar grid | `.grid-day-cell`, `.event-chip-item` | Calendar month view |
| Agenda list | `.agenda-group`, `.agenda-event-card` | Calendar agenda view |
| Profile container | `.profile-container`, `.rel-link` | Person/Family profiles |
| Modals | `.modal-overlay`, `.modal-window` | Event detail, calendar subscribe |
| Drawers | `.day-drawer` | Day detail drawer |
| Search | `.search-dropdown`, `.search-row` | Global search |
| Stats | `.stats`, `.stat` | Homepage/family stats |
| Buttons | `.cal-nav-btn`, `.btn-plat-primary` | Navigation, platform actions |

### 7.3 Capability Matrix

| Capability | EXISTS | AVAILABLE | PROJECT-READY | Notes |
|------------|--------|-----------|---------------|-------|
| CSS custom properties design system | YES | YES | YES | 80+ tokens |
| Responsive design | YES | YES | YES | Fluid type scales, mobile-friendly |
| Accessibility (basic) | YES | YES | PARTIAL | ARIA labels, semantic HTML, keyboard nav |
| Dark mode | NO | NO | NO | Not implemented |
| Animation system | MINIMAL | MINIMAL | PARTIAL | `--transition-fast/base` only |
| Iconography | SVG inline | YES | YES | Gender-aware avatar SVGs |
| Print styles | NO | NO | NO | Print button exists but no print CSS |

---

## 8. TECHNICAL DEBT

### 8.1 Critical Debt

| Issue | Severity | Impact | Files |
|-------|----------|--------|-------|
| **app.js monolith** (2,964 lines) | HIGH | All frontend logic in one file; hard to maintain, test, or hand off to agents | `src/js/app.js` |
| **Admin payload overwrite** | HIGH | Admin saves destroy `payload` JSON column → data loss on public site | `server/index.js:115-148` |
| **Broken CI** | HIGH | `validate_integrity.py` expects root `data/`, actual data in `server/data/` | `.github/workflows/validate-data.yml` |
| **No JS tests** | HIGH | Zero automated verification for 2,964 lines of frontend logic | `package.json` |
| **No auth on admin** | HIGH | Admin endpoints are publicly accessible | `server/index.js` |
| **E2E people/stories FAIL** | HIGH | Admin → DB → Public API pipeline loses metadata | `PROJECT_STATE.md` |

### 8.2 Moderate Debt

| Issue | Severity | Impact | Files |
|-------|----------|--------|-------|
| Duplicate `bindStats()` | LOW | Function defined twice in app.js (lines 524, 1911) | `src/js/app.js` |
| Duplicate CSS radius declarations | LOW | `--radius-md/sm/lg` defined 5 times | `src/css/main.css:146-152` |
| Inline styles in JS | MEDIUM | Some rendering uses inline `style=""` instead of CSS classes | `src/js/app.js` (scattered) |
| Hardcoded wikilink map | LOW | Article cross-reference map hardcoded in JS | `src/js/app.js:2564-2584` |
| No environment separation | MEDIUM | Same code runs local dev and production | `server/index.js` |
| Two frontend implementations | LOW | `app.js` (production) and `app-v2.js` (prototype) coexist | `src/js/` |
| Schema versioning | MEDIUM | SQL migrations are ad-hoc files, no version tracking | `database/migrations/`, `server/schema_update.sql` |

### 8.3 Minor Debt

| Issue | Severity |
|-------|----------|
| `prototype.css` and `app-v2.js` are DESIGN-001 artifacts | LOW |
| `server_8084.log` committed | LOW |
| `check_js.py`, `check_prod.py`, various `*.py` utility scripts in root | LOW |
| `tmp_renderHome.txt`, `tmp_renderHome_old.txt` in root | LOW |
| `node_modules/` in server (26MB) — gitignored but present locally | LOW |

---

## 9. PRODUCTION BLOCKERS

| Blocker | Status | Impact | Owner Action Required |
|---------|--------|--------|-----------------------|
| API endpoint status | OBSERVED: LIVE (verified 09:28) | None currently | Monitor — audit showed 530 earlier |
| CI broken (path mismatch) | VERIFIED: BROKEN | No automated validation on push | Fix `validate_integrity.py` paths |
| People/stories E2E FAIL | VERIFIED: BROKEN | Admin saves lose metadata | Fix `server/index.js` payload merge |
| Admin no auth | VERIFIED: MISSING | Public access to admin endpoints | Implement authentication |
| No static data fallback | VERIFIED: ABSENT | Frontend empty when API down | Deploy JSON to Vercel root |

---

## 10. OpenCode TECHNICAL LEAD CAPABILITY MAP

### 10.1 Capabilities OpenCode SHOULD OWN in Giatoc

| Capability | Why | How |
|------------|-----|-----|
| **Codebase navigation** | Must understand full architecture before any change | Grep/Glob/Read across all files |
| **Frontend editing** | Primary development surface (2,964-line monolith) | Edit tool on app.js, main.css, index.html |
| **Backend editing** | API fixes, route additions, payload merge fix | Edit tool on server/index.js |
| **Schema management** | Database migrations, new tables | Edit SQL files + migration scripts |
| **Data pipeline understanding** | GEDCOM → JSON → API → Frontend chain | Read generator/, scripts/, server/data/ |
| **Design system adherence** | Must maintain CSS variable system, brand tokens | Read main.css, brand/manifest.json before any UI change |
| **Testing execution** | Run Python tests, curl API, verify changes | Bash tool for test commands |
| **API verification** | Confirm endpoints return correct data | curl + jq parsing |
| **Deployment awareness** | Know what triggers deploys, how to verify | Read vercel.json, .github/workflows/ |
| **Technical debt tracking** | Identify and record issues without expanding scope | Read code, write to reports |
| **Git discipline** | Check status, diff, log before/after changes | Bash git commands |
| **Production state reading** | Verify live API, frontend, tunnel status | curl public endpoints |

### 10.2 Capabilities OpenCode CANNOT OWN (Blocked)

| Capability | Blocker | Human Action Required |
|------------|---------|----------------------|
| NAS SSH access | No SSH keys in runtime | Human must execute NAS commands |
| MariaDB direct queries | No DB client in runtime | Human or NAS-based tooling |
| Vercel deployment trigger | Requires git push | Human must push to `main` |
| Cloudflare Tunnel management | Requires NAS access | Human must restart `cloudflared` |
| Browser automation | No Playwright/Puppeteer MCP | Human must do visual QA |
| Secret management | `.env` files blocked by permission rules | Human must manage credentials |
| Infrastructure changes | DNS, Cloudflare account, NAS config | Human must operate |

### 10.3 Capabilities OpenCode CAN EXTEND (With Setup)

| Capability | Current State | What's Needed |
|------------|---------------|---------------|
| JS unit testing | NONE | Add jest/vitest + write tests for app.js functions |
| E2E browser testing | NONE | Add Playwright MCP or Playwright tests |
| API integration testing | NONE | Write curl-based or node-based API tests |
| CI pipeline fix | BROKEN | Fix path mismatch in validate_integrity.py |
| Schema versioning | Ad-hoc SQL files | Add migration versioning (e.g., umzug or manual) |
| Admin authentication | NONE | Implement JWT or session-based auth |

---

## 11. RECOMMENDATIONS FOR AGENT ARCHITECTURE

### 11.1 Suggested Agent Roles

| Role | Scope | Key Capabilities |
|------|-------|-----------------|
| **Frontend Agent** | app.js, CSS, index.html | Edit frontend code, maintain design tokens, verify rendering |
| **Backend Agent** | server/index.js, routes, schema | Edit API code, fix payload merge, add endpoints |
| **Data Agent** | generator/, scripts/, server/data/ | Run data pipeline, verify JSON output, manage content |
| **Testing Agent** | tests/, .github/workflows/ | Write/run tests, fix CI, verify API endpoints |
| **Ops Agent** | vercel.json, deployment, monitoring | Verify deployment, check production state, report blockers |

### 11.2 Critical Path for Agent Onboarding

1. **Fix CI** → `validate_integrity.py` path fix → enables automated validation
2. **Fix payload merge** → `server/index.js` admin save → restores E2E data flow
3. **Add JS tests** → jest/vitest for app.js core functions → enables safe refactoring
4. **Document architecture** → This inventory + AGENTS.md → enables agent context loading

### 11.3 Files Agents Must Read Before Any Change

| File | Why |
|------|-----|
| `AGENTS.md` | Project conventions, constraints, commands |
| `PROJECT_STATE.md` | Current E2E status, known failures |
| `src/js/app.js` | All frontend logic (must understand before editing) |
| `server/index.js` | All backend logic |
| `src/css/main.css` | Design system tokens and component styles |
| `brand/manifest.json` | Brand identity decisions |
| `docs/architecture/DATA_CONTRACT.md` | Genealogy.json schema contract |

---

**END OF INVENTORY**
**NO PRODUCTION COMPONENTS WERE CHANGED**
**NO CODE WAS MODIFIED**
