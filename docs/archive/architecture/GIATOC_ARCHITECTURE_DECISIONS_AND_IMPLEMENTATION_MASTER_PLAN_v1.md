# GIATOC ARCHITECTURE DECISIONS & IMPLEMENTATION MASTER PLAN v1

Status: **NOT READY** — pending Human architectural decisions (primarily: MariaDB canonical, JSON fixture role, media storage, auth provider, backup RPO/RTO).

Predecessors: GIATOC System Map v1 (read-only), GIATOC System Map Closure & Control Plane Foundation (read-only).
Mission mode: MISSION 0 — lock decisions, no implementation. No code/data/API/validation/UI changes made.

---

## 1. Executive Summary

`giatoctrantrongthu.com` today is a **static-first SPA + hybrid API**. The frontend fetches exclusively from the live MariaDB-backed API (`api.giatoctrantrongthu.com/api/*`) with **no local fallback**. Git tracks source + Markdown + migrations; `server/data/*.json` + `server/calendars/*.ics` are **untracked generated artifacts** that live only on the local disk and are NOT what the public site consumes.

Evidence confirms the **live MariaDB is the de-facto public operational source** (228 people live vs 223 in `server/data/genealogy.json`, 20 stories live vs 19 compiled articles). The critical blockage is that the **live write API is unauthenticated** (POST `/api/edges` succeeded anonymously), and **backup/recovery is documented but not implemented** (no dump job, no restore procedure).

This report:
- Reconciles prior blockers against current evidence.
- Defines the 4-layer boundary model (GitHub / MariaDB / Private Storage / Publication).
- Establishes per-domain Source of Truth.
- Defines content state model (RAW→DRAFT→REVIEW→APPROVED→PUBLISHED→INTERACTIVE).
- Defines identity/authz target, backup/recovery architecture, validation target, brand canonicality, and operations.
- Produces a control-plane dependency graph and P0–P3 implementation master plan.
- Lists **Human Decisions Required** — 14 items, none implemented.

---

## 2. Current Architecture Reality

**VERIFIED:**

| Component | Reality |
|---|---|
| Frontend | Static vanilla HTML/CSS/JS SPA. Fetches 4 API endpoints + 4 ICS feeds from `api.giatoctrantrongthu.com`, **no fallback**. Hash routing. |
| API | Express (`server/index.js`), binds `127.0.0.1:3000`, **no auth middleware**, `cors()` permissive. |
| DB | MariaDB `family_archive` (live, 228 people / 68 families / 2 memories / 20 stories). Credentials in `server/.env` (host `100.80.147.119` Tailscale IP), gitignored. |
| Static datasets | `server/data/genealogy.json` (223) / `mach.json` (19) / `media.json` (185) / `person_media.json`. **Untracked** in git. |
| Calendar | 4 ICS files at `server/calendars/*.ics` (untracked). Live `/api/calendars/*.ics` all HTTP 200. |
| Admin | `admin/` UI → API, **no auth**. Live write probe succeeded. |
| Deploy | git push → Vercel auto-deploy → `giatoctrantrongthu.vercel.app` + `giatoctrantrongthu.com` (Cloudflare, HTTP 200). |
| NAS | Synology DS223j / 1GB RAM / 2.6TB free. Docs describe app dir + media + backups; **runtime not fully verified** (media binary path UNKNOWN). |
| Git | Remote `git@github.com:tuantudo/giatoctrantrongthu.git`. Migrations, Markdown, source tracked. `server/data`, `server/calendars`, `server/family_archive.db`, `.env*` gitignored. |
| Validation | `validate_integrity.py` reads root `data/` + `calendars/` → **RED** (dirs absent). `verify_mach_blocks.py` + `test_markdown_acceptance.py` expect root `data/mach.json` (19 articles) → mismatch with live 20. CI `validate-data.yml` triggers on root `data/**`,`calendars/**` — no-op given path mismatch. |

**Conflict:** Doc `family-site-deployment-topology-v1.md` says "SQLite removed from production" and "Git only source + migrations"; but `server/family_archive.db` exists (gitignored) and `DB_CLIENT=mysql` in `.env`. Live evidence (228 rows) confirms MariaDB is authoritative; the SQLite file is a dev fallback. Hence *SQLite dev-only* is the correct current reading.

**Not-present:** user/account/session/role/permission/ownership/audit; places domain; backup/restore scripts; monitoring/health; token/brand manifest.

---

## 3. Target Architecture

Four layers, clean boundary, per-domain Source of Truth. Target: a Human-operable system where GitHub holds source/schema/migrations/docs/brand-definitions; MariaDB holds operational data + identity/ownership; Private Storage holds binary originals; Publication is generated and never canonical.

```
 Layer 1 GITHUB / SOURCE SYSTEM       (schema, migrations, API, frontend, tests, build, deploy config, Brand definitions, docs)
   ↓  generates / migrates
 Layer 2 MARIADB / OPERATIONAL DATA   (genealogy, people, families, relationships, places, events, calendar-op, users, roles, permissions, ownership, contributions, content-state, audit)
   ↓  references metadata
 Layer 3 PRIVATE STORAGE / NAS / OBJ  (original media, private photos, archival documents, uploaded files)
   ↓  reads for derivatives
 Layer 4 PUBLICATION                  (static outputs, API responses, public media derivatives, CDN)
```

---

## 4. Four-Layer Boundary Model

### A. GitHub / Source System (Layer 1)

**Included:**
- Application source (frontend, backend/API)
- Database schema + migrations
- Validation rules + tests
- Build system (generators, MẠCH engine)
- Deployment configuration (vercel.json, workflows, env templates)
- Brand System definitions (manifest, tokens, guidelines)
- System documentation

**Excluded (NOT source repository):**
- Production runtime data (MariaDB), private media binaries, secrets, user-generated private data, generated publication output.

**Note:** The current repo carries generated artifacts inside source control by accident (root `data/`/`calendars/` was the historical output location; today output lives at `server/`, untracked). Target: generated output is NOT committed; it lives in the operational/publication layer.

### B. MariaDB / Operational Data (Layer 2)

Target canonical domains:

| Domain | Boundary | Ownership | Canonicality | Dependency | Migration Required |
|---|---|---|---|---|---|
| Person | profile + birth/death + bios | owner (future) | **canonical** (currently) | none | schema extension |
| Family | family unit + memberships | owner | canonical | Person | schema extension |
| Relationship | edges (PARENT/SPOUSE/CHILD/MENTION) | owner | canonical | Person/Family | schema extension |
| Place | place entities | owner | canonical (new) | Events/People | **ADD domain** |
| Event | lifecycle + calendar events | owner | canonical (new) | Person/Family | schema extension |
| Calendar | 4 ICS feed derivations | owner | **canonical** (operational) | Event | alignment |
| Content | posts/stories/articles, state | owner/moderator | **canonical** (dynamic) | User/Person | state model |
| User | account | user | canonical | none | **ADD domain** |
| Role/Permission | RBAC+ReBAC | system admin | canonical | User | **ADD domain** |
| Ownership | per-resource | owner | canonical | User/Resource | **ADD domain** |
| Visibility | public/private/restricted | owner | canonical | Ownership | **ADD domain** |
| Contribution | async edits/corrections | contributor | canonical | User/Content | **ADD domain** |
| Audit | immutable history | system | canonical | — | **ADD domain** |

### C. Private Media Storage (Layer 3)

Binary vs metadata **fully separated**:
- **Binary** (original): NAS / object storage; MariaDB stores only `media_id, owner, visibility, filename, MIME, checksum, path, permissions, timestamps, provenance`.
- **Public derivative:** generated thumbnail/web-size; served by CDN/API; never canonical.

Media lifecycle (target):
```
UPLOAD → INGEST → VALIDATE (checksum/MIME) → STORE → METADATA (hash, provenance) → ACCESS CONTROL → DERIVATIVE (public web thumb) → PUBLICATION (if allowed) → ARCHIVE → BACKUP → RECOVERY
```

### D. Publication Layer (Layer 4)

- Static SPA outputs, dynamic API responses, public media derivatives, generated JSON/ICS.
- **Publication output is NEVER canonical.** It is derived from Layers 1–3.
- **Migration requirement:** if any current output is treated as canonical (e.g., `server/data/*.json` read directly by frontend in some path, or static ICS used as truth), it must be flipped so MariaDB/NAS is the authority and publication is regenerated from it.

---

## 5. Source of Truth Matrix

| Domain | Current SOT | Target SOT | Current State | Migration Needed | Human Decision |
|---|---|---|---|---|---|
| genealogy (aggregate) | MariaDB + JSON (divergent) | MariaDB | CONFLICT (228 live vs 223) | YES | **H1** |
| people | MariaDB / JSON | MariaDB | CONFLICT | YES | **H1** |
| relationships (edges) | MariaDB | MariaDB | VERIFIED (live) | align | **H1** |
| families | MariaDB / JSON | MariaDB | CONFLICT | YES | **H1** |
| places | NOT PRESENT | MariaDB (new) | NOT PRESENT | ADD | H10 |
| events/calendar | ICS / MariaDB (ambiguous) | MariaDB (op) + derived ICS | PARTIAL | YES | H4 |
| content (editorial) | Markdown / MariaDB (conflict) | state-dependent (see §6) | CONFLICT | YES | H7/H8 |
| content (operational) | MariaDB | MariaDB | PARTIAL | align | H8 |
| content (UGC) | NOT PRESENT | MariaDB | NOT PRESENT | ADD | H8 |
| media metadata | `media.json` (untracked) | MariaDB | CONFLICT (185 local vs DB) | YES | H3 |
| media binaries | NAS/assets (UNKNOWN) | Private Storage | UNKNOWN | YES | H3 |
| users | NOT PRESENT | MariaDB | NOT PRESENT | ADD | H5 |
| permissions | NOT PRESENT | MariaDB (RBAC+ReBAC) | NOT PRESENT | ADD | H5/H9 |
| ownership | NOT PRESENT | MariaDB | NOT PRESENT | ADD | H5/H9 |
| brand | CSS (+ docs) | Brand Manifest (canonical) | CONFLICT (10 dup tokens) | YES | H11 |
| configuration | `.env`/Vercel/Cloudflare | env/secret manager | PARTIAL | YES | H6 |
| publication output | static/API (non-canonical) | derived (never canonical) | PARTIAL | YES | H4 |

**H1–H11 = Human Decision numbers (see §17).**

---

## 6. Content State Model

```
RAW → DRAFT → REVIEW → APPROVED → PUBLISHED → INTERACTIVE / USER-GENERATED
```

| Type | SOT | Owner | Editor | Visibility | Validation | Publication | Audit | Rollback |
|---|---|---|---|---|---|---|---|---|
| Editorial (essays/stories/articles) | MariaDB (approved states); Markdown optional raw | Owner | Editor/Admin | public/private | Markdown gate | gated | required | yes |
| Operational (genealogy records, calendar) | MariaDB | Owner | Editor | owner-set | schema/invariant | API | required | yes |
| User-Generated (comments, contributions, corrections, memories) | MariaDB | Contributor/User | Self+moderator | owner-set (ReBAC) | moderation | moderation gate | required | yes |
| Dynamic Interaction (profile updates, relationships, reactions, moderation workflows) | MariaDB | User/resource-owner | Self+moderator | ReBAC | rate/constraints | event | required | yes |

No single global SOT — content is SOT by state/domain. Publication output is derived only.

---

## 7. Identity / Auth / Authorization Model

Target model: **Identity + Ownership + Relationship + Attributes + Role + Visibility + Action**.

- **Authentication:** external provider (Human choice, H5) — e.g., OIDC (Google/Apple) for family members; email/password optional.
- **Session:** short-lived tokens; refresh rotation.
- **Account/User:** registered identity with profile.
- **Role:** RBAC for platform roles (Visitor, Registered User, Family Member, Content Contributor, Family Moderator, Admin, System Owner).
- **Permission:** RBAC for role-grants PLUS ReBAC for per-resource ownership (resource visibility = owner + role + relationship).
- **Ownership:** every resource has `owner_id`; owner controls edit/visibility/share/delete unless system override.
- **Relationship:** family graph (Person/Family edges) used as ReBAC relationship factor.
- **Attributes:** person/entity attributes (e.g., `is_alive`, `branch`, `privacy_flag`).
- **Visibility:** public / family / private / restricted bound to resource.
- **Action:** explicit allowed-actions per resource (view/edit/comment/publish/archive/delete/share).
- **Audit:** immutable append-only log for every mutation.

| Persona | Identity | Ownership | Capabilities | Restrictions | Visibility | Moderation |
|---|---|---|---|---|---|---|
| Visitor | none | — | read public | no writes | public only | — |
| Registered User | account | own profile | comment/contribute | limited writes | own visibility | — |
| Family Member | verified | own profile/memories | edit own, request | cannot edit others' owned | family scope | — |
| Content Contributor | account | own drafts | create/edit own | no publish | pending | — |
| Family Moderator | built-in | — | review/approve/moderation | no ownership override | family+ | yes |
| Admin | built-in | — | full CRUD | bounded by authz | all | yes |
| System Owner | built-in | all | infra/recovery | bounded by code | all | yes |

**Admin is NOT default owner of all information.** Ownership is per-resource and transferable only by the owner (or System Owner by override audit).

---

## 8. Ownership Model

- Every domain entity (Person, Family, Place, Event, Content, Media, etc.) carries `owner_id`.
- Owner controls visibility, share, edit, delete, archive (subject to genealogy invariants — a Person referenced by others may be archivable but not silently deletable).
- Ownership transfer requires owner + target consent (or System Owner override with audit).
- Admin edits on another's resource creates an audit record; does NOT change ownership.
- ReBAC relationship factor: a Family Member may view/edit relatives' records per family visibility model (H9), never cross-branch unless granted.

---

## 9. Media & Private Storage Model

- **Canonical = Private Storage (NAS/object).** Original binary never committed to git.
- **Metadata canonical = MariaDB** (see §2C). Metadata schema (target):
  `media_id, owner, visibility, filename, mime_type, checksum (sha256), storage_location (bucket/volume + relative path), permissions, timestamps, provenance (source, original_url, harvested_at)`.
- **Public derivatives** (thumbnail/web-size) generated by API/media pipeline; stored under CDN path; non-canonical; regenerable from original.
- **Lifecycle:** UPLOAD → INGEST (checksum/MIME validate) → STORE (private) → METADATA → ACCESS CONTROL → DERIVATIVE → PUBLICATION (if visibility allows) → ARCHIVE → BACKUP → RECOVERY.
- **Backup:** NAS local snapshot + offsite mirror (see §10). Deep-link/URL stability maintained (`assets/images/...` paths preserved as public derivative aliases; never regenerate IDs).
- Current: `media.json` (185 entries, sha256 present, provenance present) is a **derived manifest**, not canonical; must migrate to MariaDB.

---

## 10. Backup & Recovery Model

| Asset Class | Primary | Backup | Offsite | RPO | RTO | Restore |
|---|---|---|---|---|---|---|
| CODE | Git (local) | GitHub | mirror/archive (optional) | per-commit | minutes | git clone/revert |
| DATABASE | MariaDB (NAS) | mysqldump daily → NAS `/backups/` | Hyper Backup → cloud | 24h | 4–8h (per doc v2) | restore from latest dump 5.1 |
| MEDIA | Private Storage (NAS) | NAS snapshot | cloud mirror | 24h | hours | copy back + verify checksum |
| SECRETS | `.env` (local) + Vault | manual, encrypted | owner-held | — | — | re-key + re-provision |
| CONFIG/deploy | GitHub + Vercel | Vercel/CF | — | — | — | redeploy from git |

**Recovery target:** prove restore of CODE + DATABASE + MEDIA + CONFIGURATION + SECRETS from backup (documented drill). Current state: **no db dump job, no restore script, no automated offsite.** Backups documented but NOT implemented.

Secrets: never in git. Managed via repo-excluded `.env` + a Vault (Bitwarden per existing credential-exposure audit) + secret manager for Vercel/API. RPO: DB daily (H6 target). RTO: define per disaster scenario (H6).

---

## 11. Validation Architecture

**Current (VERIFIED broken):** `validate_integrity.py` reads root `data/`+`calendars/` (absent). `verify_mach_blocks.py` reads root `data/mach.json` (absent). `test_markdown_acceptance.py` expects root `data/mach.json` with 19 articles (real: `server/data/mach.json` 19, live API 20). CI `.github/workflows/validate-data.yml` triggers on `data/**`,`calendars/**` only.

**Target pipeline:**
```
DATA → VALIDATE (against canonical DB + expected paths) → BUILD (from source) → PUBLICATION GATE (compare derived vs expected) → DEPLOY
```
- Repoint validators to the true output paths (`server/data/`, `server/calendars/`) or, after canonicalization, to MariaDB.
- CI must fail on source/dependency mismatch so the gate is meaningful.
- Publication gate: compiled MẠCH output (`.md` → `mach.json`) must match expected schema/count before deploy.
- Fix order (proposed, not implemented): (1) path constants → (2) expected article count aligns to live → (3) CI trigger paths → (4) gate status green.

---

## 12. Brand System Architecture

**Canonical:** a single **Brand Manifest** (tokens in JSON/YAML) — colors, typography, logo, spacing, radius, shadow, iconography, components, voice. This is the authoritative source. CSS is **DERIVED** (generated from manifest), never the sole truth (currently CSS IS the truth — 123 vars, 10 duplicated).

**Derived:** `docs/design/*.md` guidelines; `assets/images/logo*.svg/jpg`; generated `main.css` token blocks.

**Consumed:** frontend runtime.

| Item | Canonical Source | Derived | Consumed by | Human-editable? | Propagation |
|---|---|---|---|---|---|
| Logo | Brand Manifest + `Brand Systems/Logo` | PNG exports | index.html | yes (SVG) | automatic via manifest |
| Fonts | Manifest (EB Garamond + Inter) | font-face URLs | index.html | yes | automatic |
| Colors | Manifest tokens | generated CSS vars | frontend | yes | automatic |
| Design tokens | Manifest | generated CSS | all components | yes | automatic |
| Components | Manifest + component spec | compiled UI | frontend | yes | automatic |
| Guidelines | Manifest doc | design docs | designers/AI | yes | reference |

**"Change one brand color today":** currently edit CSS + propagate duplicates manually (risk). Target: edit manifest → regenerate CSS → deploy. NOT implemented.

---

## 13. Deployment & Operations

**Current (VERIFIED):** git push → Vercel auto-deploy; custom domain via Cloudflare; `vercel.json` routes admin subdomain + headers; API on NAS behind Cloudflare Tunnel; `server/.env` for API DB creds.

**Target operations surface (Human checkable):**
- "Website currently healthy?" → health endpoint (`/health`), 200 + DB ping, status page.
- "Which version is production?" → deploy version/commit exposed; Vercel API.
- "When was last deploy?" → Vercel deployments list.
- "Any errors?" → structured log aggregation (API + frontend).
- "Rollback to which version?" → Vercel rollback + git revert.

Determined gaps: no health endpoint, no error monitoring, no release-status surface, no logs pipeline, no rollback button. Deployment (git push) vs Operations (monitoring/release) split is the key.

---

## 14. Control Plane Dependency Graph

```
IDENTITY (auth/account/session)
  ↓
OWNERSHIP (owner_id + ReBAC)
  ↓
DATA ACCESS (visibility + permission)
  ↓
CONTENT CONTROL (state machine + moderation)
  ↓
PUBLICATION (derived output + gates)
  ↓
OPERATIONS (health/deploy/rollback/monitoring)

AND (parallel foundation):
BACKUP
  ↓
RECOVERY (drill-verified)
  ↓
SAFE CONTROL PLANE
```
Control Plane UI must NOT be built before foundation is safe (auth + backup + recovery + canonical data). Backend security (write API auth) precedes UI.

---

## 15. Implementation Master Plan

**Validated order (dependency-checked, may deviate from naive P0→P3):**

### P0 (Foundation — nothing before this is safe)
1. **Architecture decisions (this doc)** — H1–H3, H5, H6 locked.
2. **Identity/Auth foundation** — external provider, sessions, account model.
3. **Secure write API** — auth middleware on all mutating routes; rate-limit; deny CORS wildcard for writes.
4. **Canonical MariaDB operational data** — decide + migrate JSON→MariaDB; treat JSON as legacy fixture; repoint validators.
5. **Backup/Recovery foundation** — daily dump → NAS → offsite; documented restore drill.
6. **Validation gate repair** — repoint paths; align counts; CI meaningful.

### P1 (Model/architecture expansion)
7. Ownership/Relationship/Visibility/Action model
8. Content architecture (state machine + UGC)
9. Places domain
10. Brand manifest (CSS generated from it)
11. Media storage architecture (binary vs metadata split)
12. Audit trail

### P2 (Control Plane)
13. Control Plane (auth-gated)
14. Data management (people/families/relationships/places/events)
15. Content management (drafts/review/publish)
16. User/permission management
17. Brand management
18. Storage/backup management
19. Deployment/operations surface (health/version/logs/rollback)

### P3 (Dynamic family platform)
20. Dynamic family platform
21. Contributions
22. Moderation
23. Privacy
24. User interaction
25. Family collaboration

**Note:** P0.4 (canonicalization) and P0.2 (auth) are co-dependent; ownership (P1.7) depends on identity (P0.2). Validation gate repair (P0.6) doesn't depend on auth.

---

## 16. Dependency Matrix

| Item | Depends On |
|---|---|
| Identity/auth | H5 human decision; provider choice |
| Secure write API | auth foundation |
| Canonical MariaDB | H1 decision; backup foundation |
| Backup/recovery | H6 decision; NAS/offsite availability |
| Validation gate | canonical path decision (§11) |
| Ownership/ReBAC | identity |
| Visibility | ownership |
| Content state machine | ownership + moderation authority |
| Brand manifest | H11 decision |
| Media storage | H3 decision; NAS/object |
| Places domain | canonical DB model |
| Audit | all mutations |
| Control Plane | P0 + P1 + backup/recovery |
| Dynamic platform | Control Plane + moderation |

---

## 17. Human Decisions Required

| # | Decision | Options | Evidence/Dependency |
|---|---|---|---|
| H1 | MariaDB = canonical operational data; JSON = legacy/publication fixture | Yes / No | live 228 vs local 223; backends read DB |
| H2 | Ownership model: reject admin-as-owner by default; per-resource owner | Confirm | target model |
| H3 | Private media storage: NAS / object storage / hybrid | NAS vs cloud | current NAS 2.6TB; media UNKNOWN |
| H4 | Calendar SOT: MariaDB-derived ICS vs static ICS | MariaDB-derived | live feeds 200 from DB |
| H5 | Authentication provider | Google OIDC / email+password / other | no current auth |
| H6 | Backup RPO/RTO + retention + offsite | define | none today |
| H7 | Editorial content canonicality (Markdown raw vs DB approved) | hybrid | conflict now |
| H8 | UGC moderation authority + workflow | moderator/admin | none today |
| H9 | Family visibility model (ReBAC rules) | per-branch/per-family | none today |
| H10 | Places domain scope (place entities references) | minimal/full | absent today |
| H11 | Brand manifest tooling/format | JSON/YAML token manifest | 10 duplicate CSS tokens |
| H12 | Deployment authority (who can deploy/rollback) | restricted roles | none today |
| H13 | Secrets management (Bitwarden → Vault vs direct) | confirm per audit | existing credential audit |
| H14 | Public/private boundary for Tư Liệu domain | define scope | NOT PRESENT domain |

---

## 18. Risks

| Risk | Severity | Evidence | Resolution |
|---|---|---|---|
| Unauthenticated public write API | CRITICAL | POST /api/edges → `{"success":true}` | P0.2/P0.3 |
| No backup/recovery | CRITICAL | no dump/restore/drill | P0.5 |
| Two divergent genealogy sources | HIGH | 228 vs 223 | H1+P0.4 |
| Content SOT conflict | HIGH | 19 compiled vs 20 live | H7/H8 |
| Secrets on local disk | MED-HIGH | `server/.env` (gitignored) | H13 |
| Validation gate RED | MED | root paths absent | P0.6 |
| Media path UNKNOWN | MED | docs only | H3 |
| NAS 1GB swap risk | MED | readiness doc | ops |

---

## 19. Migration Requirements

1. JSON (`server/data/*.json`, `media.json`) → MariaDB canonical (bi-directional migration script; JSON becomes fixture).
2. Repoint validators/tests/CI from root `data/`+`calendars/` to true paths (or DB).
3. Add places, users, roles, permissions, ownership, visibility, audit tables (schema migration).
4. Brand: CSS → manifest + generated CSS (dedupe 10 tokens).
5. Media: move binaries to private storage, metadata to MariaDB, keep public URLs stable.
6. Calendar: derive ICS from MariaDB (keep UID stability).
7. Align article counts (validate 19 vs live 20) — decide which is truth (H7).
8. Secrets: centralize, remove root `.env.local` + `server/.env` from repo risk surface.

---

## 20. Definition of Ready for Implementation

**NOT READY.** Blockers:
- **H1** (MariaDB canonical + JSON fixture) — no Human decision yet.
- **H5** (auth provider) — no Human decision.
- **H6** (backup RPO/RTO) — no Human decision.
- **H3** (media storage) — no Human decision.
- **H7/H8** (content canonicality + moderation) — no Human decision.
- **Unauthenticated write API** (P0) — verify-blocked until auth decision.
- **Backup/recovery** (P0) — not implemented.
- Validation gate remains RED (source-path conflict).

Implementation must not begin until H1, H5, H6 are locked (minimum). H3/H7/H8 are needed before their respective P1/P2 lines.

---

## 21. Evidence Register

| ID | Claim | Evidence | Status |
|---|---|---|---|
| E1 | API binds loopback + no auth | `app.listen(port,'127.0.0.1')`, no middleware | VERIFIED |
| E2 | Live write API unauthenticated | POST `/api/edges` → `{"success":true}` (removed after) | VERIFIED |
| E3 | Live genealogy 228 vs local 223 | curl vs file | VERIFIED |
| E4 | Frontend only fetches live API | `app.js` 4 fetch calls, no fallback | VERIFIED |
| E5 | No auth in admin | admin/js grep no login/token | VERIFIED |
| E6 | Migrations tracked | database/migrations | VERIFIED |
| E7 | server/data + calendars UNTRACKED | git status `??` | VERIFIED |
| E8 | Validator RED | targets root `data/`+`calendars/` | VERIFIED |
| E9 | 4 ICS feeds live | curl 200 | VERIFIED |
| E10 | MariaDB has real data (228) | /api/people 113KB | VERIFIED |
| E11 | CSS 10 duplicate tokens | grep | VERIFIED |
| E12 | API/prod live | curl HTTP 200 | VERIFIED |
| E13 | Deployment = git push | .vercel + docs + 200 | INFERRED |
| E14 | NAS holds MariaDB @ 100.80.147.119 | .env + docs | VERIFIED (Tailscale IP) |
| E15 | Media binary path | docs only | UNVERIFIED |
| E16 | Backup/dumps exist | none found | NOT IMPLEMENTED |
| E17 | content/mach tracked | git ls-files 20 | VERIFIED |
| E18 | media.json 185 entries + sha256 | file | VERIFIED |
| E19 | tests expect root data/mach.json, 19 articles | file | VERIFIED |
| E20 | live mach stories 20 vs compiled 19 | curl + file | VERIFIED |

---

## 22. UNKNOWN / CONFLICT / PARTIAL Register

| Item | Status | Reason |
|---|---|---|
| MariaDB vs JSON canonical | **CONFLICT** | 228 vs 223; backend reads DB, frontend reads DB |
| Calendar SOT | **CONFLICT** | static ICS files vs DB-derived feed; both live |
| Editorial content SOT | **CONFLICT** | Markdown tracked vs MariaDB stories vs compiled mach.json |
| Backup/recovery | **NOT IMPLEMENTED** | documented only |
| Media binary path | **UNKNOWN** | docs only |
| Where MariaDB runs (NAS vs local-loopback) | **PARTIAL** | .env Tailscale IP + loopback bind; live MariaDB 228 confirms remote path |
| SQLite role | **CONFLICT** | doc says removed; file exists (dev fallback) |
| Secrets handling | **PARTIAL** | `.env` gitignored; credential audit exists; no vault |
| Places domain | **NOT PRESENT** | none in schema |
| Monitoring/health | **NOT PRESENT** | no endpoint |
| Brand manifest | **NOT PRESENT** | CSS is only source |
| User/permission/ownership/audit | **NOT PRESENT** | no tables |

---

**End of report.** No code, no schema change, no deployment, no data mutation performed. This mission produces decisions + roadmap only. Human must lock H1, H5, H6 (minimum) before the first implementation mission.