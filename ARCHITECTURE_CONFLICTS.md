# ARCHITECTURE_CONFLICTS

Evidence-backed conflicts and unresolved boundaries. This is not a redesign proposal.

| ID | Conflict / uncertainty | Evidence | Classification |
|---|---|---|---|
| C01 | Inline startup schema is smaller than schema used by endpoints | `server/index.js:42-67,97-105` vs queries at `:181-335` and `server/schema_update.sql:1-66` | OBSERVED |
| C02 | `people.payload` is used by writes/public adapter but omitted from inline DDL | `server/index.js:119-143,211-214` vs `:43-51` | OBSERVED |
| C03 | Baseline `images`/`events` differ from later `media`/`person_media`/`calendar_events` | `database/migrations/001_baseline_schema.sql:31-43` vs `server/schema_update.sql:29-52` | OBSERVED |
| C04 | Two frontend implementations coexist; root entrypoint loads only `app-v2.js` | `index.html:379`; `docs/architecture/GIATOC_CURRENT_STATE_SNAPSHOT_001.md:62-91,286-303` | OBSERVED / DOCUMENTED |
| C05 | Full app has media resolver, production app does not consume media endpoints | `src/js/app.js:54-153` vs `src/js/app-v2.js:78-153` | OBSERVED |
| C06 | Media path conventions are mixed: relative web paths and absolute NAS paths | `server/data/media.json:2-10`; `database/migrations/002_seed_test_data.sql:21` | OBSERVED |
| C07 | Architecture documents describe NAS/Cloudflare/MariaDB topology, but repository cannot prove current live wiring by source inspection alone | `PROJECT_ARCHITECTURE.md:4-28`; `docs/architecture/GIATOC_CURRENT_STATE_SNAPSHOT_001.md:110-120` | DOCUMENTED / UNKNOWN |
| C08 | Public media URL rewrite assumes relative paths and a fixed API origin; no canonical path translation is shown | `server/index.js:303-313` | OBSERVED |
| C09 | Logical media relationships have no declared SQL foreign keys | `server/schema_update.sql:36-43` | OBSERVED |
| C10 | `person_media` endpoint emits `status: MATCHED` for every returned row, regardless of any source status field | `server/index.js:322-330` | OBSERVED |
| C11 | Architecture module boundaries are documented as target/proposed, while actual backend remains one Express file with inline SQL | `docs/architecture/GIATOC_ARCHITECTURE_CODEBASE_RECONCILIATION_006.md:9-20,164-180` | DOCUMENTED / OBSERVED |
| C12 | NAS migration and abstract pointer ideas appear in documents/scripts but are not proof of completed migration | `docs/architecture/NAS_AUDIT/17_ARCHITECTURE_BASELINE_CANDIDATE.md:16-21`; `server/nas_migrate.js` | PROPOSED / UNKNOWN |

## Classification summary

- **CURRENT IMPLEMENTATION:** `server/index.js`, root `index.html` + `src/js/app-v2.js`, admin API client, and the later media/public adapter shapes are directly observed in code.
- **LEGACY/STAGED:** baseline `images`/`events` model, absolute `/volume1/web/web_images` seed, and `src/js/app.js` as a full but non-root-loaded frontend are observed/documented as older or staged paths.
- **DOCUMENTED BUT NOT PROVEN CURRENT:** NAS production topology, Cloudflare Tunnel state, exact live DB schema, and live media filesystem location.
- **PROPOSED/DOCUMENT-ONLY:** modular domain boundaries, eight-layer model, abstract DB pointers, and migration/organization plans. No approval or implementation conclusion is made here.

## Review questions that remain UNKNOWN

1. What exact schema is applied in the production MariaDB, including `payload`, `fsid`, all adapter tables, indexes, and constraints?
2. Which database rows are authoritative for production: relational columns, JSON payload, committed snapshots, or a combination?
3. What is the canonical production media root and what path format is stored in live `media.payload`?
4. Is `server/family_archive.db` only local fallback, or has it ever served a deployed environment?
5. Which of the architecture documents have been human-approved versus merely authored as proposals?

No answer above should be filled by assumption before Human Architecture Review.

**STOP — WAIT FOR ARCHITECTURE BASELINE**
