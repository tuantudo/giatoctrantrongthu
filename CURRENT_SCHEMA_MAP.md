# CURRENT_SCHEMA_MAP

Read-only map of schema evidence in the repository. “Current” below means present in implementation/artifacts; it does not claim that every table exists in the live production DB.

## Table/entity map

| Entity/table | Evidence | Classification | Notes |
|---|---|---|---|
| `people` / PERSON | `database/migrations/001_baseline_schema.sql:4-12`; `server/index.js:43-51` | OBSERVED | Basic columns; later `fsid` and `payload` are declared in `server/schema_update.sql:1-2`. |
| `stories` | baseline migration:14-21; inline DDL:53-60 | OBSERVED | Later JSON `payload` declared by `schema_update.sql:4`. |
| `edges` | baseline migration:23-29; inline DDL:62-67 | OBSERVED | Generic ID-to-ID graph; no FK. |
| `events` | baseline migration:31-36 | OBSERVED / LEGACY-CANDIDATE | Public runtime uses `calendar_events`, not this baseline table. |
| `images` | baseline migration:38-43; `server/create_schema.js:26-35` | OBSERVED / LEGACY-CANDIDATE | Stores `path`; seed uses absolute `/volume1/web/web_images/family.jpg`. |
| `families` | `server/schema_update.sql:6-11`; query `server/index.js:205` | OBSERVED | Public genealogy adapter reads it. |
| `memories` | `schema_update.sql:13-19`; query `server/index.js:206` | OBSERVED | Public genealogy adapter reads it. |
| `timeline` | `schema_update.sql:21-27`; query `server/index.js:207` | OBSERVED | Public genealogy adapter reads it. |
| `media` | `schema_update.sql:29-34`; query `server/index.js:305` | OBSERVED | Metadata/payload record; no binary storage in DB shown. |
| `person_media` | `schema_update.sql:36-43`; query `server/index.js:322` | OBSERVED | Link table; no declared FK. |
| `calendar_events` | `schema_update.sql:45-52`; query `server/index.js:183,341` | OBSERVED | ICS is generated from this table. |
| `authors` | `schema_update.sql:54-59`; query `server/index.js:256` | OBSERVED | MẠCH adapter. |
| `series` | `schema_update.sql:61-66`; query `server/index.js:257` | OBSERVED | MẠCH adapter. |

## Shape conflicts

1. **[OBSERVED]** Startup DDL in `server/index.js:42-67,97-105` creates only three tables and omits `payload`, `fsid`, and all adapter tables.
2. **[OBSERVED]** Admin people write path inserts into `people(..., payload)` (`server/index.js:137-143`), while the same file's inline DDL does not define that column.
3. **[OBSERVED]** `events`/`images` exist in the baseline migration, but later code queries `calendar_events`/`media`/`person_media`.
4. **[INFERRED]** The repository represents schema evolution across multiple stages, with a separate `schema_update.sql` expected somewhere outside the startup DDL. This is an inference from code coexistence, not proof of deployment order.
5. **[UNKNOWN]** Live schema version, applied migrations, indexes beyond primary keys, FK constraints, and actual row counts.

## Data model as implemented

```text
people (PERSON)
  ├── payload JSON [declared later; used by API]
  ├── fsid [declared later; used by genealogy artifacts]
  └── edges.source_id / target_id  [generic graph IDs]

media
  └── person_media.person_id -> person_media.asset_id -> media.id
       [logical ID relationship; no SQL FK observed]

stories -> authors / series via payload or returned document shape
calendar_events -> generated ICS
families + memories + timeline -> /api/genealogy.json
```

This diagram describes observed references, not a proposed redesign.

**STOP — WAIT FOR ARCHITECTURE BASELINE**
