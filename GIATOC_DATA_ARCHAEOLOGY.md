# GiaToc Data Architecture Archaeology

Phạm vi: read-only archaeology của repository `giatoctrantrongthu` tại ngày 2026-09-19. Không sửa production, database production, NAS, schema, hay code runtime.

Quy ước: mỗi finding được gắn `OBSERVED`, `DOCUMENTED`, `INFERRED`, `PROPOSED`, hoặc `UNKNOWN`. `INFERRED` không được coi là fact.

## Executive summary

- **[OBSERVED]** Repository chứa một backend Express tại `server/index.js`, một frontend production được `index.html` load bằng `src/js/app-v2.js`, một frontend đầy đủ hơn nhưng không được root `index.html` load là `src/js/app.js`, và các snapshot JSON trong `server/data/`.
- **[OBSERVED]** Code backend hỗ trợ hai nhánh DB: MariaDB khi `DB_CLIENT=mysql`, hoặc SQLite local tại `server/family_archive.db` nếu không phải MariaDB (`server/index.js:11-12,14-27,87-105`).
- **[DOCUMENTED]** Các architecture/current-state reports mô tả production API nằm sau Cloudflare Tunnel, Node.js trên Synology NAS, MariaDB và filesystem media trên NAS. Đây là documentation trong repo; repo này không tự chứng minh được trạng thái live tại thời điểm archaeology.
- **[OBSERVED]** `PERSON` tồn tại trực tiếp dưới entity/table `people`, trong GEDCOM-derived JSON dưới key `people`, và trong UI dưới person profile/directory của `app.js`.
- **[OBSERVED]** Relationship media hiện là `media` + `person_media`: frontend tải hai endpoint riêng, index theo `personId`, rồi resolve `assetId -> asset.file` (`src/js/app.js:54-72,120-153`).
- **[OBSERVED]** Có hai media conventions: production/API artifacts dùng relative web paths như `assets/images/avatars/...`; baseline seed/legacy image table dùng absolute NAS path `/volume1/web/web_images/family.jpg`.
- **[OBSERVED]** API rewrite URL media trong các public adapters bằng prefix `https://api.giatoctrantrongthu.com/`; static serving chỉ mount `/assets/images` từ `path.join(__dirname, 'assets/images')` (`server/index.js:9,224-229,269-286,303-313`).
- **[OBSERVED]** Root website production currently loads `app-v2.js`, which fetches `mach.json`, `genealogy.json`, and four calendar feeds, but not `media.json` or `person_media.json` (`index.html:379`, `src/js/app-v2.js:78-153`).
- **[DOCUMENTED]** `docs/architecture/GIATOC_CURRENT_STATE_SNAPSHOT_001.md` reports live HTTP verification of production surfaces and data counts, but this archaeology does not re-verify external systems; treat those claims as documented evidence, not fresh observation here.

## 1. Database hiện tại nằm ở đâu?

- **[OBSERVED]** Runtime branch MariaDB reads `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, defaulting database name to `family_archive` and host to `127.0.0.1` (`server/index.js:15-27`).
- **[OBSERVED]** Runtime fallback opens `server/family_archive.db` (`server/index.js:87-105`). The file exists in this checkout, but its live/production role is not established by the repository alone.
- **[DOCUMENTED]** `PROJECT_ARCHITECTURE.md:4-28` and `docs/infrastructure/nas-family-genealogy-inventory-v1.md:17-23` place production MariaDB and media on Synology NAS, with a proposed/application directory under `/volume1/web/`.
- **[UNKNOWN]** Exact production DB host, schema revision, and whether the checked-in SQLite file is used in any deployed environment. `server/.env` is present but only key names were inspected; secret values were not read into this report.

## 2. Schema hiện tại

- **[OBSERVED]** `database/migrations/001_baseline_schema.sql` defines `people`, `stories`, `edges`, `events`, and `images`.
- **[OBSERVED]** `server/schema_update.sql` adds/defines `people.fsid`, JSON `payload` columns, `families`, `memories`, `timeline`, `media`, `person_media`, `calendar_events`, `authors`, and `series`.
- **[OBSERVED]** `server/index.js:42-67` creates only `people`, `stories`, and `edges` on the MariaDB startup path; its SQLite path creates only those three tables at `:97-105`.
- **[OBSERVED]** Other endpoints query `families`, `memories`, `timeline`, `calendar_events`, `authors`, `series`, `media`, and `person_media` (`server/index.js:181-335`) without creating them in that file.
- **[INFERRED]** A separate schema application step, migration, or pre-existing production schema is required for all public adapters to work. This is not equivalent to proof that such a step is currently applied.
- **[UNKNOWN]** The exact live production schema after all migrations. The checked-in definitions conflict with the inline startup DDL and therefore cannot be collapsed into one confirmed schema without DB inspection.

## 3. Entity inventory / PERSON

- **[OBSERVED]** Relational entities/tables represented in code or migrations: `people`, `stories`, `edges`, `events` (baseline), `images` (baseline), `families`, `memories`, `timeline`, `media`, `person_media`, `calendar_events`, `authors`, `series`.
- **[OBSERVED]** `PERSON` exists as SQL table `people`, JSON collection `genealogy.people`, and UI concepts in `app.js` such as `getPersonMedia`, profile rendering, people directory, and graph nodes.
- **[OBSERVED]** Person identifiers include GEDCOM-style IDs such as `@I1@` and a separate `fsid` field in `server/data/genealogy.json`; `person_media` references `personId` and media references `assetId`.
- **[OBSERVED]** Foreign-key constraints are not defined in `server/schema_update.sql`; relationships are represented by IDs and joined in application code or payloads.

## 4. Media/file relationship and filesystem paths

- **[OBSERVED]** Intended/current API relationship is `person_media.person_id -> media.id` conceptually, exposed as `personId -> assetId` by `/api/person_media.json` and `/api/media.json` (`server/index.js:303-335`). No SQL FK is declared.
- **[OBSERVED]** Media artifact records contain `assetId`, kind, MIME type, relative `file`, checksum, source, source ID, and provenance (`server/data/media.json:2-14`).
- **[OBSERVED]** Frontend resolves `personId -> PersonMedia -> assetId -> asset.file`, and uses `asset.file` as the browser URL. It does not infer a filename from FSID (`src/js/app.js:114-153`).
- **[OBSERVED]** Server exposes local binaries only under `/assets/images` from the repository/server process asset directory (`server/index.js:9`).
- **[OBSERVED]** Hard-coded filesystem/path strings exist in `database/migrations/002_seed_test_data.sql:21`, `server/create_schema.js:34`, `PROJECT_ARCHITECTURE.md:25`, and docs describing NAS deployment. The seed path is `/volume1/web/web_images/family.jpg`; architecture docs cite `/volume1/web/family-api/assets/images/`.
- **[OBSERVED]** Application/public URL strings are also hard-coded: API domain in `src/js/app.js`, `src/js/app-v2.js`, and `admin/js/api.js`; media URL rewriting in `server/index.js`.
- **[UNKNOWN]** Whether production DB rows currently contain absolute NAS paths, relative API paths, or both. The repository artifacts show both conventions, but do not provide a live DB dump.

## 5. API media resolution

- **[OBSERVED]** `/api/media.json` reads `SELECT * FROM media`, parses `payload`, prefixes non-HTTP `file`/`path` with the API origin, and returns a map keyed by `id` (`server/index.js:303-318`).
- **[OBSERVED]** `/api/person_media.json` reads `person_media` and maps snake_case columns to `relationId`, `personId`, `assetId`, `role`, `isPrimary`, and a hard-coded `status: "MATCHED"` (`server/index.js:320-335`).
- **[OBSERVED]** `/api/genealogy.json` rewrites `memory.file` and `memory.path`; `/api/mach.json` rewrites cover/image fields and replaces `assets/images/` in content (`server/index.js:224-229,269-286`).
- **[OBSERVED]** The staged/full frontend consumes media endpoints. The currently loaded `app-v2.js` does not consume them according to source (`src/js/app-v2.js:78-153`).

## 6. Website dependency on filesystem and NAS/media

- **[OBSERVED]** Root frontend depends on the API domain for genealogy, MẠCH, and calendar data. If those fetches fail, its handlers log errors or return empty values (`src/js/app-v2.js:78-153`).
- **[OBSERVED]** Full `app.js` additionally depends on media endpoints and returned file URLs for portraits/articles (`src/js/app.js:54-153,1938-1980,2376-2528`).
- **[DOCUMENTED]** `PROJECT_ARCHITECTURE.md:4-28` states Vercel serves the frontend, while API, MariaDB, and media binaries are on NAS behind Cloudflare Tunnel.
- **[INFERRED]** The full/staged UI has a stronger filesystem/media availability dependency than the currently loaded `app-v2.js`; this follows from source fetches, not from a new architecture claim.
- **[UNKNOWN]** Current tunnel uptime, NAS mount state, actual media availability, and whether Vercel has a working fallback at this date.

## 7. CURRENT IMPLEMENTATION / LEGACY / DOCUMENT-ONLY

### CURRENT IMPLEMENTATION (repository evidence)

- **[OBSERVED]** `index.html -> src/js/app-v2.js` is the current root entrypoint in this checkout (`index.html:379`).
- **[OBSERVED]** `server/index.js` is the single backend implementation with inline SQL and public adapters.
- **[OBSERVED]** `server/data/*.json` are committed/generated artifacts present in the repository; source comments/docs do not make them the DB source of truth.
- **[OBSERVED]** Admin API client calls `people`, `stories`, `edges`, and `events` at the hard-coded API origin (`admin/js/api.js:1-54`).

### LEGACY / STAGED / INCONSISTENT IMPLEMENTATION

- **[DOCUMENTED]** `docs/architecture/GIATOC_CURRENT_STATE_SNAPSHOT_001.md:88-106,286-303` classifies `src/js/app.js` as a full app not loaded by root production, while `app-v2.js` is the limited loaded app.
- **[OBSERVED]** Baseline `images` table and `/volume1/web/web_images/family.jpg` seed path coexist with later `media`/`person_media`; no evidence in this checkout proves the older path was removed from production.
- **[OBSERVED]** `server/index.js` writes/reads `payload` in admin/public code, while its startup DDL omits `payload`; this is an implementation inconsistency, not a resolved legacy/current boundary.

### DOCUMENTED / PROPOSED ONLY

- **[DOCUMENTED]** `PROJECT_ARCHITECTURE.md` describes a clean Vercel → Cloudflare → NAS/API → MariaDB/filesystem topology.
- **[DOCUMENTED]** `docs/architecture/GIATOC_MODULAR_SYSTEM_ARCHITECTURE.md` and reconciliation reports describe modular Genealogy/Archive/Narrative/Testament/Access boundaries. The reconciliation itself says those isolated modules do not exist today.
- **[PROPOSED]** `docs/architecture/NAS_AUDIT/17_ARCHITECTURE_BASELINE_CANDIDATE.md:16-21` proposes abstract database pointers instead of physical filesystem paths and an eight-layer model. This is explicitly marked proposed and must not be treated as current implementation.
- **[PROPOSED]** NAS migration/organization plans and `server/nas_migrate.js` describe migration/normalization work; their presence is not evidence that migration has happened.

## Review boundary

This file is evidence for Human Architecture Review only. It does not approve a schema, migration, NAS move, refactor, or target architecture.

**STOP — WAIT FOR ARCHITECTURE BASELINE**
