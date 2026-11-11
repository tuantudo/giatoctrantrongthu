# GIATOC ARCHITECTURE ↔ CODEBASE RECONCILIATION

**Status:** `PARTIALLY_RECONCILED`  
**Date:** 2026-09-17  
**Agent:** OpenCode — Technical Lead / Systems Engineer  

---

## 1. EXECUTIVE SUMMARY

The AGY proposed architecture (`GIATOC_MODULAR_SYSTEM_ARCHITECTURE.md`) describes a **target state** — a composable "assembly house" with clean module boundaries (CORE → DOMAIN MODULES → APPLICATION COMPOSITION → EXPERIENCE MODULES → INFRASTRUCTURE). The current codebase is a **working monolith with emerging modular signals** but significant coupling between layers.

**Key finding:** The proposed modules (`Genealogy`, `Archive`, `Narrative`, `Testament`, `Access & Governance`) do NOT exist as isolated, contract-bounded units in the codebase today. What exists are:
- **Frontend entrypoints:** `app.js` (full, 2964 lines, NOT in production), `app-v2.js` (minimal, 332 lines, IS in production), `admin.js` (admin SPA, 591 lines)
- **Backend:** Single `server/index.js` (362 lines) serving all API endpoints with inline SQL
- **Core parsers:** `ics-parser.js`, `lunar-engine.js` (truly independent utilities)
- **Data layer:** MariaDB with 11 tables, no ORM, no repository layer, no domain services
- **Static data snapshots:** `server/data/*.json` (generated artifacts, not source of truth)

The architecture gap is **structural**: no module boundaries, no public contracts, no mapper/DTO layer, shared mutable state (`window.__D001_DATA`, `appData`, `machData`), and UI directly coupled to API response shapes.

---

## 2. CURRENT SYSTEM COMPONENT MAP

| Component | Files | Responsibility | Data Touched | Dependencies |
|-----------|-------|----------------|--------------|--------------|
| **Production Frontend** | `index.html`, `src/js/app-v2.js` (332L), `src/css/prototype.css` (287L), `src/js/core/ics-parser.js` | Public UI: Home, MẠCH curated, Memories excerpt, Stats, Calendar (newly wired), Search prototype, Member entry | `/api/mach.json`, `/api/genealogy.json`, 4 ICS feeds | `IcsParser` (local) |
| **Full Frontend (staged)** | `src/js/app.js` (2964L), `src/css/main.css` (5169L) | Complete app: Calendar, Graph, People/Families dir, Timeline, Memories, MẠCH full, Search, Series, Authors | All 4 JSON + 4 ICS + media | `IcsParser`, `LunarCal` |
| **Admin Frontend** | `admin/index.html`, `admin/js/admin.js` (591L), `admin/js/api.js` | CRUD for People, Stories, Edges, Events; Typeahead; Preview | `/api/people`, `/api/stories`, `/api/edges`, `/api/events` | `admin/js/api.js` → live API |
| **Backend API** | `server/index.js` (362L) | Express server; inline SQL; dual MariaDB/SQLite; CORS; static assets | All 11 tables: `people`, `stories`, `edges`, `families`, `memories`, `timeline`, `media`, `person_media`, `calendar_events`, `authors`, `series` | `mysql2`, `sqlite3`, `dotenv`, `cors` |
| **Core Utilities** | `src/js/core/ics-parser.js` (53L), `src/js/core/lunar-engine.js` (126L) | RFC 5545 ICS parser; Vietnamese lunar calendar | None (pure functions) | None |
| **Data Generators** | `server/data/*.json` (4 files), `scripts/archive/fs_pilot.js` | Static snapshots for CDN; FamilySearch media harvest | Genealogy, MẠCH, Media, Person-Media links | Playwright, FamilySearch |
| **Migrations** | `database/migrations/001_baseline_schema.sql`, `server/schema_update.sql` (75L) | Schema evolution | All tables | Manual SQL |
| **Verification** | `verify-gate6.js`, `preflight.js`, `final-preflight.js` | Production asset/DOM checks | Live HTML/CSS/JS | HTTPS fetch |

---

## 3. PROPOSED MODULE ↔ ACTUAL CODEBASE MATRIX

### 3.1 Module: Genealogy

| Aspect | PROPOSED | ACTUAL FILES | MATCH | EVIDENCE |
|--------|----------|--------------|-------|----------|
| Owns | Person, Family, Relationship | `people`, `families`, `edges` tables; `server/index.js:202-251` (`/api/genealogy.json`); `app.js:9-18,76-110` (`appData.people`, `appData.families`) | **PARTIAL** | Data exists but no module boundary. Single endpoint `/api/genealogy.json` returns entire graph (people + families + memories + timeline + stats). Frontend `appData` is a global mutable object holding entire genealogy. |
| Public Interface | `getPerson(id)`, `getAncestors(id)` | None. `app.js` has `deriveFamilyGraphGenerations()`, `getGenerationMeta()`, `getFamilyGenerationMeta()` but these are internal functions, not contracts. Admin has `API.getPeople()`, `API.getEdges()` but these hit admin CRUD endpoints, not genealogy domain. | **MISSING** | No public interface. UI directly consumes full JSON. |
| Does Not Own | Media (Archive), Stories (Narrative) | `app.js` media resolver (`getPersonMedia`, `getPersonPortrait`) queries `mediaDb` (from `/api/media.json`, `/api/person_media.json`) — cross-domain coupling. `app.js` renders memories from `appData.memories` (genealogy) but also from `machData` (MẠCH). | **CONFLICT** | Genealogy frontend code directly accesses Archive (media) and Narrative (memories) data. |
| Forbidden Dependencies | `MOD-TESTAMENT` | `app.js` has no testament concept. Admin `stories` table mixes MẠCH articles and could include testament letters — no separation. | **UNKNOWN** | Testament module doesn't exist yet. |

### 3.2 Module: Archive

| Aspect | PROPOSED | ACTUAL FILES | MATCH | EVIDENCE |
|--------|----------|--------------|-------|----------|
| Owns | MediaAsset, PersonMedia link | `media`, `person_media` tables; `/api/media.json`, `/api/person_media.json` endpoints; `app.js:36-40,120-153` (mediaDb, getPersonMedia, getPersonPortrait) | **PARTIAL** | Data + API endpoints exist. But `mediaDb` is a global in `app.js` — Archive logic lives in frontend. No Archive module on backend. |
| Public Interface | None defined | `getPersonMedia(personId, role)`, `getPersonPortrait(personId)` in `app.js` — frontend functions, not backend contracts. | **MISSING** | No backend contract. Frontend owns the resolver logic. |
| Does Not Own | Person (Genealogy) | `person_media` table has `person_id` FK but no FK constraint. `app.js` joins by `personId` in JS. | **IMPLICIT** | Reference by ID only, but join logic in frontend. |

### 3.3 Module: Narrative (MẠCH)

| Aspect | PROPOSED | ACTUAL FILES | MATCH | EVIDENCE |
|--------|----------|--------------|-------|----------|
| Owns | Story, Series, Author, Topic | `stories`, `authors`, `series` tables; `/api/mach.json` endpoint; `app.js:20-26,92-104` (`machData`); `app-v2.js:30-48` (`renderHomeCurated`), `app-v2.js:155-171` (`renderMachList`), `app-v2.js:173-201` (`renderStory`) | **PARTIAL** | Data + API + frontend rendering exist. But `machData` is a global mutable object in `app.js`. No backend domain service — SQL inline in endpoint. |
| Public Interface | None defined | `/api/mach.json` returns entire publication (authors + series + stories). No granular endpoints. | **MISSING** | Consumer-driven contract absent. UI gets full dump. |
| Does Not Own | Person (Genealogy) | `stories` payload has `linkedPeople` (array of person IDs). Admin UI tags people via `edges` table (`MENTION` edge_type). `app-v2.js` story rendering doesn't resolve person names. | **IMPLICIT** | Reference by ID, but join logic would need Genealogy. |

### 3.4 Module: Testament

| Aspect | PROPOSED | ACTUAL FILES | MATCH | EVIDENCE |
|--------|----------|--------------|-------|----------|
| Owns | Letters, Wills, Spiritual messages | **MISSING** | **MISSING** | No tables, no endpoints, no frontend code for testament. `mach.json` has series `thu-gui-clara` (epistolary) but it's mixed in Narrative. |
| Separation Rationale | Lifecycle + meaning different from Narrative | `thu-gui-clara` series exists in `mach.json` with `seriesType: "epistolary"`, `audience: "descendants"`, `editorialVoice: "personal"` — semantic markers present but not architecturally separated. | **INFERENCE** | Semantic distinction exists in data but not in module boundary. |

### 3.5 Module: Access & Governance

| Aspect | PROPOSED | ACTUAL FILES | MATCH | EVIDENCE |
|--------|----------|--------------|-------|----------|
| Owns | Identity, Roles, Permissions | **MISSING** | **MISSING** | No auth tables, no JWT/session, no role enforcement. Admin UI has `sidebar-footer: "Vai trò: Ban Biên Tập"` but it's static HTML. Public UI has "Tư cách thành viên" placeholder (prototypes only). |
| Public Interface | None | None | **MISSING** | Zero implementation. |

### 3.6 Experience Modules

| Proposed | Actual | MATCH | Evidence |
|----------|--------|-------|----------|
| `Home` | `app-v2.js` home view + `app.js` `renderHomePublicationLanding()` | **PARTIAL** | Two different implementations (production vs staged). |
| `Magazine (MẠCH) UI` | `app-v2.js` curated + full list + story detail; `app.js` full MẠCH module | **PARTIAL** | Two implementations. |
| `Family Tree UI` | `app.js` only (graph, pedigree, generation bands) — NOT in production | **MISSING** (prod) / **PARTIAL** (staged) | `app-v2.js` has zero genealogy UI. |
| `Archive UI` | `app.js` only (media blocks in articles); `app-v2.js` honest placeholder | **MISSING** (prod) / **PARTIAL** (staged) | |
| `Calendar UI` | `app-v2.js` now wired (Assignment #003); `app.js` full calendar | **PARTIAL** | Production has minimal; staged has full. |
| `Search UI` | `app-v2.js` prototype (client-side only); `app.js` full search page | **PARTIAL** | |
| `Admin Control Room` | `admin.js` full CRUD SPA | **OBSERVED** | Separate entrypoint, separate routes, same backend. |

### 3.7 Application Composition

| Proposed | Actual | MATCH | Evidence |
|----------|--------|-------|----------|
| Composition layer | **MISSING** | **MISSING** | No composition layer. Frontend entrypoints (`app.js`, `app-v2.js`, `admin.js`) each directly call all APIs. No gateway, no contract validation, no access control. |

### 3.8 Infrastructure

| Proposed | Actual | MATCH | Evidence |
|----------|--------|-------|----------|
| MariaDB, Vercel, Cloudflare, NAS | MariaDB (prod), SQLite (fallback), Vercel (implied), Cloudflare Tunnel (implied), NAS (Tailscale) | **OBSERVED** | Infrastructure exists but not abstracted. `server/index.js` has hardcoded `useMariaDB` flag and inline SQL for both dialects. |

---

## 4. ACTUAL DEPENDENCY GRAPH

### 4.1 Critical Coupling Paths

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PRODUCTION FRONTEND (app-v2.js)                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  window.__D001_DATA (global mutable state)                                 │
│       │                                                                    │
│       ├─→ fetchRealData()                                                  │
│       │     ├─→ GET /api/mach.json → server.index:253-301 → stories table │
│       │     │       └─→ inline SQL: SELECT * FROM stories WHERE status...  │
│       │     │       └─→ payload JSON parsing, image URL rewriting         │
│       │     └─→ GET /api/genealogy.json → server.index:202-251            │
│       │             ├─→ people, families, memories, timeline tables       │
│       │             └─→ payload JSON parsing, stats computation           │
│       │                                                                    │
│       └─→ fetchCalendarData() → 4× GET /api/calendars/*.ics               │
│             └─→ server.index:337-359 → calendar_events table → ICS gen    │
│                                                                             │
│  renderHomeCurated() → reads __D001_DATA.stories (direct)                 │
│  renderMemory() → reads __D001_DATA.mem (direct)                          │
│  renderStats() → reads __D001_DATA.stats (direct)                         │
│  renderCalendarList() → reads __D001_DATA.calendarEvents (direct)         │
│  renderStory() → reads __D001_DATA.stories.find(slug) (direct)            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                        STAGED FRONTEND (app.js)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  appData (global) ← /api/genealogy.json (full graph)                       │
│  machData (global) ← /api/mach.json (full publication)                     │
│  mediaDb (global) ← /api/media.json + /api/person_media.json               │
│  calEvents (global) ← 4 ICS feeds (via loadCalendarFeeds)                 │
│                                                                             │
│  deriveFamilyGraphGenerations() → mutates derivedGenerations, derivedPaths │
│  getPersonMedia() → reads mediaDb (cross-domain: Genealogy → Archive)      │
│  renderPeopleDirectory() → reads appData.people (direct)                   │
│  renderFamiliesDirectory() → reads appData.families (direct)               │
│  renderTimeline() → reads appData.timeline (direct)                        │
│  renderMemories() → reads appData.memories (direct)                        │
│  renderMachModule() → reads machData (direct)                              │
│  renderArticleComposition() → reads machData + mediaDb (cross-domain)      │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          ADMIN FRONTEND (admin.js)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  allPeopleCache (global) ← /api/people (admin CRUD)                        │
│  router() → renders views with inline HTML templates                       │
│  renderPersonEditor() → calls API.getEdges() → filters PARENT/SPOUSE       │
│  renderStoryEditor() → calls API.getEdges() → filters MENTION              │
│  renderEventEditor() → calls API.getEdges() → filters INVOLVES             │
│  Typeahead → filters allPeopleCache in-memory                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND (server/index.js)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  Single file: Express + inline SQL for ALL domains                         │
│                                                                             │
│  Admin CRUD: /api/people, /api/stories, /api/edges, /api/events           │
│    → Direct table access: people, stories, edges, calendar_events         │
│    → Payload JSON column stores rich domain data                          │
│                                                                             │
│  Public Adapters:                                                           │
│    /api/genealogy.json → JOINS people + families + memories + timeline    │
│    /api/mach.json → JOINS stories + authors + series                      │
│    /api/media.json → media table                                           │
│    /api/person_media.json → person_media table                             │
│    /api/calendars/:filename → calendar_events table → ICS generation      │
│                                                                             │
│  NO: Repository layer, Service layer, DTO/Mapper, Contract validation     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Dangerous Dependencies Identified

| Dependency | Type | Severity |
|------------|------|----------|
| `app.js` global `appData` → `mediaDb` (Genealogy UI calls Archive resolver) | UI → Domain cross | HIGH |
| `app.js` global `machData` → `mediaDb` (Narrative UI calls Archive resolver) | UI → Domain cross | HIGH |
| `app-v2.js` `__D001_DATA` single global for ALL domains | Shared mutable state | HIGH |
| Admin `allPeopleCache` used for typeahead in People/Stories/Events editors | Shared mutable state | MEDIUM |
| `/api/genealogy.json` returns 5 domain entities in one response | API over-fetching | MEDIUM |
| `/api/mach.json` returns authors + series + stories in one response | API over-fetching | MEDIUM |
| Backend inline SQL for all domains in one file | No module boundary | HIGH |
| `edges` table used for PARENT, SPOUSE, MENTION, INVOLVES — no domain separation | Schema overloading | MEDIUM |
| `payload` JSON column in multiple tables — schema-less domain data | Implicit schema | MEDIUM |

### 4.3 Circular Dependencies

**None observed** — the dependency graph is a "star" with backend at center and three frontends as leaves. No frontend-to-frontend or module-to-module cycles because modules don't exist.

---

## 5. CONTRACT AUDIT

| Contract | EXISTS | PARTIAL | IMPLICIT | MISSING | Evidence |
|----------|--------|---------|----------|---------|----------|
| **API Contract: `/api/genealogy.json`** | | ✅ | | | Returns `{rootAnchor, people, families, memories, timeline, stats}` — but shape tied to `app.js` expectations, not a versioned contract. No OpenAPI/schema. |
| **API Contract: `/api/mach.json`** | | ✅ | | | Returns `{authors, series, stories}` — shape matches `app.js` `machData` global. No versioning. |
| **API Contract: `/api/media.json`** | | ✅ | | | Returns `{assetId: {file, mimeType, ...}}` — `app.js` expects exact keys. |
| **API Contract: `/api/person_media.json`** | | ✅ | | | Returns `[{personId, assetId, role, isPrimary, status}]` — `app.js` `mediaDb.byPersonId` index depends on this. |
| **API Contract: `/api/calendars/:filename`** | | ✅ | | | Returns RFC 5545 ICS. `app-v2.js` `IcsParser` expects specific fields (SUMMARY, DTSTART, UID, DESCRIPTION). |
| **API Contract: Admin CRUD (`/api/people`, etc.)** | | | ✅ | | No schema validation. `admin.js` sends whatever form produces. Backend accepts any JSON. |
| **Domain Contract: Genealogy** | | | | ✅ | No `getPerson(id)`, `getAncestors(id)`. Only full-graph dump endpoint. |
| **Domain Contract: Archive** | | | | ✅ | No backend contract. Frontend `getPersonMedia()` IS the contract. |
| **Domain Contract: Narrative** | | | | ✅ | No backend contract. Only full-publication dump. |
| **Domain Contract: Testament** | | | | ✅ | Module doesn't exist. |
| **Module Interface: Genealogy → Archive** | | | | ✅ | `app.js` `getPersonMedia()` directly accesses `mediaDb` — no interface. |
| **Module Interface: Narrative → Archive** | | | | ✅ | `app.js` `renderArticleComposition()` calls `renderMediaBlock()` → `mediaDb`. |
| **Module Interface: Narrative → Genealogy** | | | | ✅ | `mach.json` stories have `linkedPeople` (person IDs) but no resolver contract. |
| **DTO/Mapper Layer** | | | | ✅ | Backend does inline JSON parsing + URL rewriting in endpoint handlers. No separate mapper. |
| **Database Schema as Contract** | | | ✅ | | `payload` JSON columns are de facto schema. Migration `schema_update.sql` adds columns but no versioning. |

---

## 6. BLAST RADIUS ANALYSIS

### 6.1 Observed Blast Radius (Verified by Code Inspection)

| Change | Files Affected | Radius |
|--------|----------------|--------|
| **Change UI layout (index.html DOM IDs)** | `app-v2.js` (11 `getElementById` calls), `app.js` (111 `getElementById` calls) | **HIGH** — both frontends hardcode DOM IDs |
| **Change `/api/genealogy.json` response shape** | `app.js` (reads `people`, `families`, `memories`, `timeline`, `stats`, `rootAnchor`), `app-v2.js` (reads `people`, `fams`, `memories`, `stats`) | **HIGH** — two frontends with different expectations |
| **Change `/api/mach.json` response shape** | `app.js` (`machData.authors`, `series`, `stories`), `app-v2.js` (`stories` with `slug`, `title`, `dek`, `date`, `series`), `admin.js` (via `API.getStories()`) | **HIGH** — three consumers |
| **Change `people` table schema** | `server/index.js` (5 queries), `server/schema_update.sql`, `database/migrations/001_baseline_schema.sql`, admin CRUD, genealogy adapter, edges (PARENT/SPOUSE) | **HIGH** — pervasive |
| **Change `stories` table schema** | `server/index.js` (4 queries), mach adapter, admin CRUD, edges (MENTION) | **HIGH** |
| **Add Search backend** | New endpoint needed; `app-v2.js` search is client-only; `app.js` has `runSearchPage()` expecting genealogy + mach data | **MEDIUM** — frontend partially ready |
| **Add Testament module** | New tables, new endpoints; `mach.json` already has `thu-gui-clara` series — would need data migration | **MEDIUM** |
| **Change media handling** | `media`, `person_media` tables, `/api/media.json`, `/api/person_media.json`, `app.js` mediaDb, `app-v2.js` (no media) | **MEDIUM-HIGH** |
| **Change router (hash-based)** | `app-v2.js` `route()`, `app.js` `handleHashRoute()`, `admin.js` `router()`, `design-playground/js/router.js` | **HIGH** — 4 different routers |
| **Change frontend entrypoint** | `index.html` script tag, Vercel config, Cloudflare config | **LOW** (config only) |

### 6.2 Inferred Blast Radius

| Change | Inferred Impact | Confidence |
|--------|-----------------|------------|
| Migrate MariaDB → PostgreSQL | `server/index.js` has dual-dialect inline SQL (lines 15-106, 137-143, 155-158, 167-169, 191-194, 204-205, 218-219, 264-265, 303-304, 320-321, 338-358) — **every query would need change** | HIGH |
| Extract Genealogy to separate service | Would need to extract 110 lines of inline SQL + payload parsing + 5 table dependencies + `edges` shared with Narrative/Events | HIGH |
| Add authentication | Zero auth infrastructure. Every endpoint (admin + public) would need middleware. Admin UI has no login. | HIGH |
| Version API contracts | No versioning infrastructure. Would need proxy/gateway layer. | HIGH |

---

## 7. ASSEMBLY-HOUSE TEST

| Test | Result | Evidence |
|------|--------|----------|
| **A. Swap Experience Module without touching Domain Module?** | **FAIL** | Two frontends exist (`app-v2.js` production, `app.js` staged) but they have DIFFERENT data expectations. `app-v2.js` needs only 2 endpoints; `app.js` needs 4 + media + person_media. Swapping would require backend changes or adapter layer. No composition layer to mediate. |
| **B. Swap Domain Module implementation without touching consumers?** | **FAIL** | Backend has no domain modules — all inline in `server/index.js`. Changing Genealogy SQL requires editing the same file that handles Narrative, Archive, Calendar, Admin. No interface to preserve. |
| **C. Add new module without modifying existing modules?** | **PARTIAL** | Could add new table + endpoint in `server/index.js` without breaking existing endpoints (open for extension). BUT: frontend would need new global state + renderers + router entries. No plugin system. `edges` table is shared — new edge types risk collision. |
| **D. Swap Infrastructure (DB) without UI coupling?** | **FAIL** | UI (`app.js`, `app-v2.js`, `admin.js`) directly consumes API response shapes that mirror `payload` JSON columns. No mapper/DTO layer. Changing DB → changes payload → changes API → breaks UI. |
| **E. Isolate module failure?** | **FAIL** | Single `server/index.js` process. If Genealogy query crashes, `/api/mach.json` still works (different route) but same process. No circuit breakers. Frontend `app-v2.js` `fetchRealData()` catches errors per-fetch but `app.js` chain has `.catch()` only at end — one failure can block later fetches. |

---

## 8. ARCHITECTURE GAPS

| Gap Category | Current State | Proposed State | Gap Size |
|--------------|---------------|----------------|----------|
| **Module Boundaries** | None. Single backend file, global frontend state. | 5 Bounded Modules with ownership rules. | **LARGE** — structural |
| **Public Contracts** | Implicit API response shapes. No versioning, no schema. | Consumer-driven contracts with DTO/mapper layer. | **LARGE** |
| **Data Ownership** | `edges` table shared by Genealogy (PARENT/SPOUSE), Narrative (MENTION), Events (INVOLVES). `payload` JSON in multiple tables. | Single Source of Truth per entity. Reference by ID. | **MEDIUM** |
| **Mapper/DTO Layer** | Inline in endpoint handlers (e.g., `server/index.js:209-247`). | Dedicated layer between DB and API. | **MEDIUM** |
| **Composition Layer** | Missing. Each frontend calls all APIs directly. | Application Composition layer gating access, composing domains. | **LARGE** |
| **Auth/Governance** | None. | `Access & Governance` module. | **LARGE** |
| **Testament Module** | Mixed into Narrative (`thu-gui-clara` series). | Separate module with Snapshot semantics. | **MEDIUM** |
| **Frontend Modularity** | Two competing entrypoints (`app.js` vs `app-v2.js`), admin separate. No shared component library. | Experience Modules pluggable via Composition. | **LARGE** |
| **Dependency Direction** | UI → DB (via API), UI → Domain logic (in frontend). | UI → Contract → Domain → DB. | **LARGE** |

---

## 9. CRITICAL FINDINGS

1. **No Module Boundaries Exist** — The proposed 5 modules are **aspirational**, not implemented. The codebase is a three-frontend, one-backend monolith with inline SQL and global mutable state.

2. **Two Incompatible Production Frontends** — `app-v2.js` (production) and `app.js` (staged) have fundamentally different data requirements and DOM expectations. They cannot coexist without a composition layer.

3. **API Responses Are UI-Coupled** — `/api/genealogy.json` and `/api/mach.json` return shapes that exactly match `app.js` globals. They are not consumer-driven contracts.

4. **Zero Auth/Governance** — The `Access & Governance` module is entirely absent. Admin UI has static role text; public UI has prototype member entry.

5. **Testament Not Separated** — `thu-gui-clara` exists as a series in `mach.json` with distinct semantics (`seriesType: "epistolary"`, `audience: "descendants"`) but shares `stories` table and `/api/mach.json` endpoint with editorial MẠCH.

6. **Archive Logic Lives in Frontend** — `getPersonMedia()`, `getPersonPortrait()`, `mediaDb` index are all in `app.js`. Backend has no Archive domain service.

7. **Schema = Implicit Contract** — `payload` JSON columns in `people`, `stories`, `families`, `media`, `memories`, `authors`, `series` tables store rich domain data with no schema validation. Migrations add columns but don't version contracts.

8. **Four Routers, Zero Coordination** — `app-v2.js`, `app.js`, `admin.js`, `design-playground/js/router.js` all implement hash routing independently.

---

## 10. UNKNOWNS

| Unknown | Why Unknown | Risk |
|---------|-------------|------|
| Production data volume / query performance | No load testing evidence; `genealogy.json` 195KB, `mach.json` 1.3MB | MEDIUM |
| NAS media file serving architecture | `server/index.js:9` serves `/assets/images` but media.json URLs rewritten to `api.giatoctrantrongthu.com` — unclear if proxied or direct | LOW |
| FamilySearch sync strategy | `scripts/archive/fs_pilot.js` exists but not integrated; `media.json` has `source: "FamilySearch"` items | MEDIUM |
| Vercel/Cloudflare configuration | Not in repo (or not found); `vercel.json` not seen | LOW |
| `.env.local` contents | Blocked from reading; contains DB credentials | LOW |
| Real user traffic patterns | No analytics/metrics visible | LOW |

---

## 11. RECOMMENDATION FOR NEXT GATE

**`NOT READY — ADDITIONAL ARCHAEOLOGY REQUIRED`**

### Rationale

The reconciliation reveals that the AGY proposed architecture is a **target state** with **zero implementation** in the current codebase. Before any canonicalization:

1. **Human must decide**: Is the "assembly house" model the right direction, or should we evolve the monolith incrementally?
2. **Missing archaeology**: 
   - Production traffic/performance baseline
   - FamilySearch integration strategy (pilot exists but not connected)
   - Auth requirements (member entry is prototype)
   - Data governance policy (Snapshot vs Reference for Testament)
3. **Current production UI (`app-v2.js`) is minimal** — wiring real data (Assignment #003) is valid but doesn't address architectural gaps.

### Immediate Next Steps (if Human approves direction)

1. **Define first contract**: `/api/genealogy.json` v1 schema with versioning
2. **Extract backend domain services**: Split `server/index.js` into route handlers + service layer
3. **Add mapper/DTO layer**: Decouple `payload` JSON from API responses
4. **Choose single production frontend**: Deprecate either `app.js` or `app-v2.js`
5. **Implement `Access & Governance` skeleton**: Even minimal auth for admin

---

## 12. EVIDENCE CLASSIFICATION LEGEND

| Tag | Meaning |
|-----|---------|
| `OBSERVED` | Directly seen in code/files |
| `EVIDENCE` | Verifiable artifact (file, query, response) |
| `INFERENCE` | Deduced from evidence, not directly seen |
| `PROPOSED` | From AGY architecture document |
| `MATCH` | Proposed ≈ Actual |
| `PARTIAL` | Some alignment, significant gaps |
| `CONFLICT` | Proposed contradicts actual |
| `MISSING` | Proposed has no actual counterpart |
| `UNKNOWN` | Insufficient evidence |