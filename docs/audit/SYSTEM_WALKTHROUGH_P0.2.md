# SYSTEM WALKTHROUGH & IMPLEMENTATION AUDIT — P0.2

*Mission: P0.2 — SYSTEM WALKTHROUGH & IMPLEMENTATION AUDIT*
*Role: Implementation Auditor + System Investigator (Cline)*
*Date: 2026-10-03 · Scope: LOCAL ONLY · Mode: AUDIT (no fixes, no deploy, no push)*
*Golden rule: **IMPLEMENTATION REALITY > DOCUMENTED INTENT***

---

## 1. EXECUTIVE SUMMARY

1. **P0/P0.1 identity+member code exists ONLY in the local working tree and has NEVER been committed.** `server/auth.js`, `server/member.js`, `server/foundation.js`, `scripts/test_p01_onboarding.js` are all **untracked**; `git log --all -- <files>` returns empty. `server/index.js` has +190/-23 uncommitted lines. → Evidence: `git status --porcelain`, `git log --all --oneline -- server/auth.js` = empty.
2. **Production has NO authentication anywhere.** `origin/main` (42a7ed2) `server/index.js` contains no session/auth code; production API (`api.giatoctrantrongthu.com`) returns 404 for `/api/auth/*`, `/api/admin/*`, `/api/member/*`, and the live admin console (`admin.giatoctrantrongthu.com/admin/js/api.js`) calls `POST /api/people` etc. **with no login**. → Evidence: `git show HEAD:server/index.js` (no `requireAuth`/`session`), live probes (see §11).
3. **Members do NOT have a genuine private personal space.** `/me` is one server-rendered profile card (username + genealogy identity + hardcoded "ACTIVE" text + a **broken** logout link). No member-owned resources, no `/api/me/*` resource routes, no privacy boundaries. → Answer: **NO**.
4. **Family Space = MISSING. Discussion/Forum = MISSING.** No tables, routes, or UI (probed 404; grep empty).
5. **Local runtime is broken for public adapters:** running server uses SQLite (`DB_CLIENT=sqlite3` env, contradicting `server/.env` which says `mysql`) and the SQLite schema lacks `families/memories/timeline/media/person_media/authors/series` → `/api/genealogy.json`, `/api/mach.json`, `/api/media.json`, `/api/person_media.json` return **500** locally.
6. **Deployment drift:** commit 42a7ed2 says "Deploy DESIGN-001 Revision" but live `giatoctrantrongthu.vercel.app` serves the **older V1** (`app.js?v=20260906_0105`), not the DESIGN-001 prototype in main.
7. **P0.1 test currently FAILS** against the live local DB (credentials rotated; test is one-shot/stateful): `node scripts/test_p01_onboarding.js` → `Test Failed: Should login with temp password (401 !== 200)`.
8. **Authorization gaps (verified on isolated DB copy):** REVOKED status does not block login or `/me`; `authorities` table is never consulted by any route; `/api/member/login` has no rate limit.

Severity-tagged findings and next gates: see `docs/audit/SYSTEM_GAP_MAP_P0.2.md`.

---

## 2. CURRENT RUNTIME (observed, not assumed)

| Component | Observed reality | Evidence |
|---|---|---|
| Git | branch `main` @ `42a7ed2`, up-to-date with `origin/main`; **167 dirty entries** (modified/deleted/untracked) | `git status --porcelain` → 167 |
| Local API server | `node index.js` on `127.0.0.1:3000`, cwd `server/`, **SQLite** (`DB_CLIENT=sqlite3 DB_PATH=./family_archive.db`) | `lsof -iTCP:3000`, `ps eww <pid>`, `local_server.log` |
| Local static frontend | `python3 -m http.server 8080` serving repo root | `lsof -iTCP:8080`, `local_frontend.log` |
| DB in local runtime | `server/family_archive.db` (SQLite, 8 tables) | `sqlite3 .tables` + counts |
| DB configured in `server/.env` | `DB_CLIENT=mysql`, host `100.80.147.119:3306` (Tailscale/NAS), `family_archive` — **TCP reachable, auth DENIED with repo credentials** | `nc -z` OK; `mysql2` connect → `Access denied for user 'root'` |
| Production website | `giatoctrantrongthu.vercel.app` = **legacy V1** (`main.css?v=20260906_0100`, `app.js?v=20260906_0105`, hash routes `#/gia-pha/nhan-vat` …), `server: Vercel` | live curl |
| Production API | `api.giatoctrantrongthu.com` = Cloudflare-fronted Express; behavior matches `origin/main` (no auth/admin/member routes); real data: 228 people / 113,222 bytes | live curl + `git show HEAD:server/index.js` |
| Production admin | `admin.giatoctrantrongthu.com` → 307 → `/admin`, `api.js` with **no login function** | live curl |
| Session store | `express-session` default **MemoryStore** (lost on restart) | `server/index.js:27-39` |
| Runtime process note | During the audit window the :3000 process was recycled once by an external trigger (PID 48119 → 78244 @18:48:13, `local_server.log` rewritten); replacement verified equivalent (same cwd, same env, `/login` 200, `/api/people` 200). Cause UNKNOWN; no audit command starts servers on :3000. | `ps`, `local_server.log` mtime |

**CURRENT SOURCE OF TRUTH (declared):** `docs/architecture/ARCHITECTURE.md` per `README.md` — **but that file is deleted in the working tree** (drift). Actual functioning sources: code in working tree (local) vs `origin/main` (committed) vs live production (third state).

**DEPLOYMENT BOUNDARY:** 3 distinct states exist simultaneously — (a) dirty local worktree (includes P0/P0.1), (b) `origin/main` (public data API, no auth), (c) live production (Vercel V1 frontend + no-auth API). They are **not synchronized**.

---


## 3. REPOSITORY / SOURCE STRUCTURE

```
giatoctrantrongthu/
├── index.html                # PUBLIC entry (working tree = DESIGN-001 prototype, 10 hash views)
├── src/js/app-v2.js          # CURRENT frontend router/renderer (fetches PRODUCTION API)
├── src/js/app.js             # LEGACY V1 (DELETED in worktree; still served in production)
├── admin/                    # Staff console (worktree = login-enabled, UNCOMMITTED;
│   │                         #   origin/main + production = no-login version)
│   ├── login.html, js/login.js      # UNTRACKED (local only)
│   └── js/api.js                    # MODIFIED (auth layer) — production serves committed version
├── server/
│   ├── index.js              # Express API (worktree +190 lines: auth+member mounting; UNCOMMITTED delta)
│   ├── auth.js               # UNTRACKED — /api/auth/*, /api/admin/users (P0)
│   ├── member.js             # UNTRACKED — /login, /me, /me/change-password, /api/member/* (P0.1)
│   ├── foundation.js         # UNTRACKED — accounts/identity_mappings/authorities DDL + admin→account sync
│   ├── dev_setup_onboarding.js      # UNTRACKED — dev provisioning (DROPs foundation tables!)
│   ├── schema_update.sql     # REQUIRED-but-not-executed DDL (families, memories, timeline, media…)
│   ├── family_archive.db      # LOCAL SQLite runtime DB (gitignored)
│   └── .env                   # DB_CLIENT=mysql @100.80.147.119 (NOT what runtime uses)
├── scripts/test_p01_onboarding.js   # UNTRACKED — P0.1 test (currently FAILING, one-shot)
├── docs/                     # architecture/ux/research + docs/audit (this mission)
├── .github/workflows/        # validate-data.yml, instant-sync.yml (no app build/deploy CI)
├── vercel.json               # static hosting config (admin host redirect, security headers)
├── generator/                # GEDCOM→JSON, calendar ICS, integrity gate (Python)
└── archive/, chatbot-app/, prototype/, design-playground/  # legacy/scratch
```

**Frontend entry points:** `index.html` → `src/js/app-v2.js` (hash router: `""/gia-pha/mach/tu-lieu/lich/tim-kiem/tu-cach-thanh-vien/thanh-vien/cai-dat` + `mach/bai-viet/:slug` — `app-v2.js:275-286`).
**Backend entry points:** `server/index.js` (Express, binds `127.0.0.1:3000`, `index.js:497-503`).
**Scripts:** root `package.json` and `server/package.json` both have `test` = placeholder error; no npm test harness. Tests live in `tests/` (2 Python acceptance scripts, Sep) + `scripts/test_p01_onboarding.js` (P0.1).

---

## 4. PUBLIC SPACE — status: **PARTIAL (prototype, locally) / LEGACY-V1 (production)**

| Item | Status | Source | Route | API | DB | Runtime behavior | Test |
|---|---|---|---|---|---|---|---|
| Homepage | EXISTS (prototype) | `index.html:66-164`, `app-v2.js` | `#/` | `GET https://api.giatoctrantrongthu.com/api/mach.json`, `/api/genealogy.json` (`app-v2.js:80,92`) | prod MariaDB | Loads; stats/narrative from **production** API even locally | HTTP 200 on :8080 + all assets 200 |
| Genealogy nav | EXISTS (stats only) | `index.html:165-189` | `#/gia-pha` | via `genealogy.json` (counts only) | prod MariaDB | "Chi tiết phả đồ … dành cho thành viên" — detail **not built** | view present |
| Person pages | MISSING in prototype | — | — | — | — | Prototype has NO person detail view; production **V1** has `#/gia-pha/nhan-vat` (+ `gia-dinh`, `ky-uc`, `dong-thoi-gian`) routes (live homepage hrefs) backed by `genealogy.json` | route-level only (V1 render not verified) |
| Family/tree views | PARTIAL | V1 routes `#/gia-pha/gia-dinh` | `genealogy.json → families` | `families` (schema_update.sql; absent in local SQLite) | local `genealogy.json` = **500**; production 200 | — |
| Search | PARTIAL (client-side) | `index.html:265-283` (`protoSearch`); `app-v2.js` has **no** search implementation | `#/tim-kiem` | NONE — "Tra cứu prototype trên snapshot MẠCH + Ký ức (không gọi backend)" | none | Form + `#protoResults` only | code inspection |
| MẠCH stories | EXISTS | `app-v2.js:80` (`renderMachList/renderStory`) | `#/mach`, `#/mach/bai-viet/:slug` | `GET /api/mach.json` (prod) | `stories/authors/series` | Works against production; **local** `mach.json` = 500 | prod 200; local 500 |
| Calendar | EXISTS | `app-v2.js:128-135` + `ics-parser.js` | `#/lich` | `GET /api/calendars/*.ics` (prod) | `calendar_events` (local table exists, 0 rows) | Prod 200 | prod 200 |
| Media | EXISTS in API | `index.js:439-471` | `/api/media.json`, `/api/person_media.json` | local 500 (tables missing) / prod OK | `media`, `person_media` | — | local 500 |
| Login entry | **MISSING from public site** | `grep -rn 'login' index.html` → **0 matches** | real login exists only at server route `/login` (`member.js:18`) | `/api/member/login` | `accounts` | Prototype member entry `#/tu-cach-thanh-vien` → `#/thanh-vien` is an explicit placeholder: *"PROTOTYPE — xác thực (auth) và backend chưa được triển khai"* (`index.html:300-301, 323-324`) | grep + HTTP |
| Public memories/stories | PARTIAL | V1 `#/gia-pha/ky-uc`; prototype none | — | `genealogy.json.memories` | `memories` (missing locally) | prod only | — |

**Conclusion:** Public Space = a navigable **DESIGN-001 prototype** whose data comes from the production API, plus a **legacy V1 actually deployed**. The two do not match (see §16). No public page links to authentication.

---

## 5. GENEALOGY — status: **PARTIAL (canonical core exists; presentation split across 3 generations)**

**Canonical operational data (real):**
- `people` — DDL `index.js:90-99` (MySQL) / `index.js:172-174` (SQLite); columns `id,name,birthYear,deathYear,gender,notes,status,payload(+fsid)`; public read `GET /api/people` filtered `status='PUBLISHED'` (`index.js:216-223`); admin read `index.js:224-230`; admin write `index.js:231-263`.
- `edges` — triples `(source_id,target_id,edge_type)` (PARENT/CHILD/MENTION); public read locked: `GET /api/edges` → **403** (`index.js:288-290`); admin read `index.js:291-297`; POST/DELETE `index.js:298-310`.
- `stories` — editorial MẠCH content; `GET /api/stories` published-only (`index.js:265-271`).
- Dual-model caveat: relational columns + legacy JSON `payload` per row; `docs/HELP.md Q-DATA-001` records known E2E issue where admin overwrite can lose `payload`.

**Legacy / never created by runtime code:** `families`, `memories`, `timeline`, `media`, `person_media`, `authors`, `series` — exist only in `server/schema_update.sql`; `server/index.js` never executes that file → **absent in local SQLite** (proven: `sqlite3 .tables` lists only 8 tables; `GET /api/genealogy.json` → `SQLITE_ERROR: no such table: families`).

**Frontend-only presentation:** prototype `#/gia-pha` renders 3 counters + orientation copy (`index.html:165-189`); `app-v2.js` contains **no** tree/person renderer. Production V1 renders `#/gia-pha/nhan-vat|gia-dinh|ky-uc|dong-thoi-gian`.

**Hardcoded / test data:**
- root anchor logic `rootAnchor: '@I1@'` (`index.js:377`); MySQL-only seed of `p1/p2/p3` when table empty (`index.js:144-161`).
- Local canonical `people` contains test rows `ptest`, `finaltest` alongside real seed `p1/p2/p3` and `test_tuantq` (runtime `SELECT` on `server/family_archive.db`).

**Do-not-redesign constraint respected.**

---
## 6. IDENTITY / AUTHENTICATION (P0 + P0.1) — status: **EXISTING but LOCAL-ONLY (uncommitted); PARTIAL enforcement**

### 6.1 Chain Person → Account → IdentityMapping → Auth → Session → /me (traced)

| Step | Implementation | Evidence |
|---|---|---|
| Provisioning | `dev_setup_onboarding.js`: DROP+recreate foundation tables, insert `people.test_tuantq`, bcrypt-hash temp credential (`050787`), insert `accounts` (role `member`, status `PROVISIONED`) + `identity_mappings` | `dev_setup_onboarding.js` (whole file) |
| Login | `POST /api/member/login` → lookup `accounts` (bcrypt) → fallback `admin_users` + `syncAdminUserToAccount` → `req.session.accountId` (+`userId` for admin fallback, + hardcoded `status:'ACTIVE'` for admins) | `member.js:70-107` |
| Session | `express-session` cookie `sid`, httpOnly, SameSite=Lax, 24h; dev secret fallback if `SESSION_SECRET` missing | `index.js:27-39`; runtime Set-Cookie observed |
| Forced change | `GET /me` → 302 `/me/change-password` when `session.status==='PROVISIONED'`; `POST /api/member/change-password` verifies old hash, sets new bcrypt hash, `status='ACTIVE'` | `member.js:110-118, 171-189, 192-195` |
| Identity resolution | `GET /me` reads `identity_mappings.account_id → person_id → people`, renders genealogy name | `member.js:197-211` |
| Identity API | `GET /api/auth/me/identity` reads `accounts` + `identity_mappings` + `authorities` **from session only** | `auth.js:129-151` |
| Admin identity | `POST /api/auth/login` (admin_users, bcrypt, `is_active` check, rate-limit 10/15min, admin CORS) → session `userId/username/role/accountId` + `syncAdminUserToAccount` (inserts `authorities` `SYSTEM/* ADMIN_ACCESS`) | `auth.js:32-87`, `foundation.js:67-93`, `index.js:41-56,207-209` |
| `/me` protection | `GET /api/auth/me` requires `session.userId` → 401; `GET /me` requires `session.accountId` → 302 `/login` | `auth.js:98-101`, `member.js:10-15`; runtime observed |

### 6.2 Verification checklist (runtime, on isolated DB copy — methodology §18)

| Requirement | Result | Evidence |
|---|---|---|
| Password hashed | **YES** — bcrypt `$2b$10$` in `accounts` + `admin_users` | sqlite `substr(password_hash,1,7)` |
| Temp credential not stored plaintext | **YES** — hash only; temp value printed once by setup script | `dev_setup_onboarding.js` |
| Old password invalid after change | **YES** — old login → 401 | test M7 PASS |
| PROVISIONED forced change enforced | **YES** — `/me` 302 → `/me/change-password` | tests M4/M5 PASS |
| ACTIVE state enforced | **PARTIAL** — `status='REVOKED'` still logs in and `/me` still 200; `/me` prints **hardcoded** "Trạng thái: … (ACTIVE)" regardless of DB | REVOKED login → 200 `{status:"REVOKED"}`; `member.js:229` |
| Identity resolved from backend | **YES** — `/me` shows `Trần Quốc Tuấn` from `identity_mappings→people` | curl `/me` on test instance |
| Frontend does not hardcode identity | **YES (server-rendered)** — prototype member pages are placeholders; no frontend identity code exists | `index.html:285-331` |
| `/me` protected | **YES** — 401/302 unauthenticated | runtime |
| Admin independent | **PARTIAL** — separate `admin_users` + `requireOwner`; **caveat:** member login falls back to `admin_users` (`member.js:88-101`), so admin credentials also open member space; `/me` logout link uses `GET /api/auth/logout` but route is `POST` → **404 broken link** | code; `curl GET /api/auth/logout` → 404 |
| Rate limiting | admin login limited (`index.js:41-47`); **`/api/member/login` has NO rate limit** | code |
| P0.1 test suite | **FAILING today** — one-shot test expects fresh PROVISIONED account; live credentials rotated | `node scripts/test_p01_onboarding.js` → `401 !== 200` |
| Deployment | **NOT DEPLOYED** — auth/member/foundation never committed; production API 404 on all these routes | `git log --all -- <files>` empty; live probes |

## 7. PERSONAL SPACE (CRITICAL AUDIT) — answer: **NO — members do NOT have a genuine private personal space**

**What `/me` actually is:** a single server-rendered HTML card (`member.js:192-237`) containing: username, genealogy identity (name + birthYear from `identity_mappings→people`), a **hardcoded** status line, and a logout link. Nothing else. It is a member **profile page**, not a space.

**What does NOT exist (verified by source grep + route probing):**
- No `/api/me/*` resource routes (route inventory §11 — only `GET /me`, `GET /me/change-password`, `POST /api/member/change-password`).
- No personal data entities: no `memories` owned by account, no `contributions`, no `discussion activity`, no `settings`, no `notifications`, no `private resources` of any kind.
- No privacy model: no `visibility`/`owner_id` columns anywhere in created schema (`foundation.js` DDL = accounts/identity_mappings/authorities only).
- No account settings UI beyond forced password change.
- Prototype member views `#/tu-cach-thanh-vien` and `#/thanh-vien` are explicitly labeled placeholders ("sẽ có", "PROTOTYPE — auth/authorization/backend chưa hiện diện", `index.html:300-324`).

**IDOR / cross-identity test (performed on isolated DB copy):**
- `GET /api/auth/me/identity?account_id=<foreign>` → returns **own** session account only; parameter ignored (test M11 PASS) — session-bound, no injection point.
- There is **no endpoint taking an account/person resource ID from a member** to test against — because member-owned resources do not exist.
- Member session → `/api/admin/users` 401, `/api/admin/content/people` 401, `POST /api/people` 401 (tests M13–M15 PASS) — members are fully excluded from admin/canonical writes.

**Verdict: NO.** `/me` is only an authenticated profile card. The "personal/private space with resource ownership and privacy boundaries" described in `MEMBER_SYSTEM_SPECIFICATION.md §9 MEMBER WORKSPACE` is **PLANNED, not implemented**. (Note the positive: since no private resources exist, there is currently also nothing to leak — the privacy risk is prospective, except the identity data shown on `/me`.)

---

## 8. FAMILY SPACE — status: **MISSING**

- No `spaces` / `space_members` / `membership` tables: `foundation.js` creates only `accounts`, `identity_mappings`, `authorities`; runtime SQLite `.tables` = 8 tables, none space-related.
- No space routes: grep `family.?space|membership|space_role|spaceMember` over `server/*.js` → **0 matches**; `/api/family` → **404** (runtime).
- No space UI: prototype has no space view; member placeholder page only lists "(sẽ) có" items (`index.html:316-322`).
- The existing `families` table (in `server/schema_update.sql`, absent locally) is **genealogy husb/wife construct** — explicitly distinguished from Family Space by `DOMAIN_MODEL.md §D` and `ERD_v0.1.md §A` ("KHÔNG CÓ → FamilySpace → Tạo mới"). Per mission rule, it is **NOT** counted as Family Space.
- Status per docs: `IMPLEMENTATION_BASELINE.md §2` priority P1 "Tạo `spaces` entity" — remains **PLANNED**.

---

## 9. DISCUSSION / FORUM — status: **MISSING**

- Tables: no topics/posts/comments/replies anywhere (runtime `.tables`; `schema_update.sql` has none).
- Routes: `/api/discussion` → **404** locally and on production API; grep `discussion|forum` over `server/*.js` → 0 functional matches (only `post` verb false-positives).
- UI: no discussion view in `index.html` (10 views enumerated §3) nor in admin nav.
- Moderation/visibility/authorization: N/A — nothing to moderate.
- `ERD_v0.1.md §E` lists "Comment, Reaction" under **FUTURE (Bỏ qua trong MVP)** — consistent: PLANNED/OUT-OF-SCOPE, not implemented.

---
## 9A. PUBLIC ↔ MEMBER NAVIGATION — actual user journey (mission §8)

| Leg | Expected | Observed | Evidence |
|---|---|---|---|
| Public → Login | link on public site | **BROKEN/ABSENT** — `grep -rn 'login' index.html` = 0 matches; member entry `#/tu-cach-thanh-vien` is a placeholder that links to another placeholder `#/thanh-vien` and states "auth … chưa được triển khai" | `index.html:285-331` |
| Login page | renders | **EXISTS** — `GET :3000/login` → 200 "Đăng nhập Giatộc" with form; posts to `/api/member/login`; PROVISIONED → `/me/change-password`, else → `/me` | `member.js:18-67`; curl |
| Login → /me | member home | **EXISTS** — full flow verified on isolated instance: login → 302 `/me` (ACTIVE) with genealogy identity shown | audit tests M2–M9 |
| /me → back to public | link | **BROKEN** — `/me` contains only `<a href="/api/auth/logout">Đăng xuất</a>`; route is `POST`-only → `GET /api/auth/logout` = **404** (dead end); no link back to `/` | `member.js:232`; `auth.js:90`; curl 404 |
| Logout → public | return | API logout works (`POST` → 200, cookie cleared, `/me` → 302 `/login`), but **no redirect target** to public website | audit test A9/A10 |
| Public ↔ Family | — | N/A — Family Space MISSING | §8 |
| Public ↔ Discussion | — | N/A — Discussion MISSING | §9 |
| Public ↔ Admin | footer link? | Prototype: "Owner Control Plane NOT in public navigation (architectural indication in footer only)" (`index.html` header comment). Real admin = `/admin/*` (separate host on production via `vercel.json` redirect `admin.giatoctrantrongthu.com` → `/admin`) | `vercel.json` |
| Local Admin | login-gated console | `GET :3000/admin/login.html` 200, `/admin/index.html` 200 (worktree versions include login flow — UNCOMMITTED) | curl |

**Verdict:** coherent multi-space navigation does **not** exist yet. The journey Public → Login only works if the user already knows the `/login` URL; returning from `/me` is a dead end (broken logout link). Family/Discussion spaces have no routes to navigate to.

---

## 10. ADMIN — status: **EXISTING (2 divergent generations)**

| Aspect | Local worktree (UNCOMMITTED) | origin/main + PRODUCTION |
|---|---|---|
| Login page | `admin/login.html` + `admin/js/login.js` (**untracked**) | **NONE** — production serves `/admin` dashboard directly |
| API client | `admin/js/api.js` modified: `API_BASE` switches localhost↔prod, `credentials:'include'`, `login/logout/getCurrentUser` (lines 6-44) | committed `api.js`: direct `GET/POST https://api.giatoctrantrongthu.com/api/*`, **no auth calls at all** (live: `admin.giatoctrantrongthu.com/admin/js/api.js`) |
| Console nav | Dashboard, Inbox (**mock**, `admin.js:67 "mock inbox out of DB for now"`), People (Nhân sự), Stories (MẠCH), Archive (Di sản), Events, Users (owner-only section `#nav-section-admin`) | same dashboard family (committed `admin/index.html`) |
| Protection (API) | `/api/admin/users` → `requireAuth`+`requireOwner`; `/api/admin/content/*` → `requireAuth`; writes → `requireAuth` (editor role allowed) | **NO protection** — no auth code exists (`git show HEAD:server/index.js`) |
| Session | express-session cookie, MemoryStore | none |

**Admin verification (isolated instance):** editor login ✓ `/api/auth/me` ✓ authorities row created ✓; editor blocked from `/api/admin/users` (403) ✓; editor CAN write canonical `POST /api/people` (200) ✓ — write authorization = **role-string only** (any authenticated admin account, no resource-level check); owner lists users ✓; logout → 401 ✓ (tests A1–A10).

**Production admin reality:** console reachable at `admin.giatoctrantrongthu.com/admin` (307→200) but its `api.js` performs unauthenticated writes against production API. Whether login-gated flow exists in production = NO (no login page, no auth endpoints on API).

---


## 11. BACKEND / API — route inventory (only routes that actually exist in source)

**Legend:** RUNTIME = local server (worktree code, running); PROD = live `api.giatoctrantrongthu.com` behavior; AUTHN = authentication required; AUTHZ = authorization beyond authentication.

### A. Auth / Member / Admin (worktree-only — NEVER committed, NOT in production)

| METHOD | PATH | PURPOSE | AUTHN | AUTHZ | SOURCE | DB | STATUS |
|---|---|---|---|---|---|---|---|
| POST | /api/auth/login | admin login | — (rate-limited 10/15m, admin CORS) | — | `auth.js:32` | admin_users | EXISTING-LOCAL; PROD 404 |
| POST | /api/auth/logout | destroy session | session | — | `auth.js:90` | — | EXISTING-LOCAL; PROD 404 |
| GET | /api/auth/me | current admin user | session.userId | — | `auth.js:98` | admin_users | EXISTING-LOCAL; PROD 404 |
| GET | /api/auth/me/identity | account+mapping+authorities | session.accountId | session-bound only | `auth.js:129` | accounts, identity_mappings, authorities | EXISTING-LOCAL; PROD 404 |
| GET | /api/admin/users | list admin users | session.userId | role=owner | `auth.js:165` (mount `index.js:209`) | admin_users | EXISTING-LOCAL; PROD 404 |
| POST | /api/admin/users | create admin user | session.userId | role=owner | `auth.js:177` | admin_users | EXISTING-LOCAL; PROD 404 |
| PATCH | /api/admin/users/:id | change role/active | session.userId | role=owner | `auth.js:211` | admin_users | EXISTING-LOCAL; PROD 404 |
| DELETE | /api/admin/users/:id | delete admin user | session.userId | role=owner | `auth.js:244` | admin_users | EXISTING-LOCAL; PROD 404 |
| GET | /login | member login page (HTML) | — | — | `member.js:18` | — | EXISTING-LOCAL; PROD 404 |
| POST | /api/member/login | member login | — (**no rate limit**) | — | `member.js:70` | accounts→admin_users fallback | EXISTING-LOCAL; PROD 404 |
| GET | /me/change-password | forced-change page | session.accountId | status=PROVISIONED | `member.js:110` | — | EXISTING-LOCAL; PROD 404 |
| POST | /api/member/change-password | change password | session.accountId | own account only | `member.js:171` | accounts | EXISTING-LOCAL; PROD 404 |
| GET | /me | member home (HTML) | session.accountId | own session | `member.js:192` | accounts, identity_mappings, people | EXISTING-LOCAL; PROD 404 |

### B. Content / Admin-content / Public adapters (worktree — committed variants differ)

| METHOD | PATH | PURPOSE | AUTHN | AUTHZ | SOURCE | DB | STATUS |
|---|---|---|---|---|---|---|---|
| GET | /api/people | public published people | — (public CORS) | — | `index.js:216` | people | EXISTING (local+PROD 200) |
| POST | /api/people | upsert person | session.userId (worktree) | none (editor+) | `index.js:231` | people | EXISTING-LOCAL; **PROD: exists WITHOUT auth** (live POST {} → 500, no 401) |
| GET | /api/admin/content/people | all people for admin | session.userId | none | `index.js:224` | people | EXISTING-LOCAL; PROD 404 |
| GET | /api/stories | published stories | — | — | `index.js:265` | stories | EXISTING (local+PROD 200) |
| POST | /api/stories | upsert story | session.userId (worktree) | none | `index.js:279` | stories | EXISTING-LOCAL; **PROD unauthenticated** (HEAD has no auth) |
| GET | /api/admin/content/stories | admin stories | session.userId | none | `index.js:272` | stories | EXISTING-LOCAL; PROD 404 |
| GET | /api/edges | relationships | **403 always** (locked) | — | `index.js:288` | edges | EXISTING |
| GET | /api/admin/content/edges | admin edges | session.userId | none | `index.js:291` | edges | EXISTING-LOCAL; PROD 404 |
| POST/DELETE | /api/edges | add/remove edge | session.userId (worktree) | none | `index.js:298,306` | edges | EXISTING-LOCAL; **PROD unauthenticated** |
| GET | /api/events | 403 always (locked) | — | — | `index.js:314` | calendar_events | EXISTING |
| GET | /api/admin/content/events | admin events | session.userId | none | `index.js:317` | calendar_events | EXISTING-LOCAL; PROD 404 |
| POST | /api/events | upsert event | session.userId (worktree) | none | `index.js:324` | calendar_events | EXISTING-LOCAL; **PROD unauthenticated** |
| GET | /api/genealogy.json | public genealogy bundle | — | — | `index.js:338` | people,families,memories,timeline | EXISTING; **LOCAL 500** (missing tables), PROD 200 |
| GET | /api/mach.json | public MẠCH bundle | — | — | `index.js:389` | stories,authors,series | EXISTING; **LOCAL 500**, PROD 200 |
| GET | /api/media.json | public media map | — | — | `index.js:439` | media | EXISTING; **LOCAL 500**, PROD 200 |
| GET | /api/person_media.json | person↔media links | — | — | `index.js:456` | person_media | EXISTING; **LOCAL 500**, PROD 200 |
| GET | /api/calendars/:filename | ICS feeds | — | — | `index.js:473` | calendar_events | EXISTING (local table empty → 404 text; PROD 200) |
| GET | /assets/images/* , /* (static) | static files (admin UI + site) | — | — | `index.js:17,21` | — | EXISTING |

### C. ABSENT routes (probed 404 / grep-empty) — PLANNED or MISSING

`/api/discussion*`, `/api/family*` (space), `/api/memory*`, `/api/me/*` (member resources), `/api/search*`, `/api/spaces*`, `/api/submissions*`, `/api/admin/content/media` — **do not exist in any generation**. No deprecated routes observed; "LEGACY" = the entire unauthenticated HEAD variant still live in production.


## 12. DATABASE — no schema modified during this mission

### A. Local runtime DB — `server/family_archive.db` (SQLite) — THE DB ACTUALLY IN USE by :3000

| TABLE | DOMAIN ENTITY | PURPOSE | ROWS | CLASS |
|---|---|---|---|---|
| people | Person | canonical genealogy nodes | 6 (incl. **test rows** `ptest`, `finaltest`) | CANONICAL + test-data contamination |
| edges | Relationship | parent/child/mention triples | 3 | CANONICAL |
| stories | Story (editorial) | MẠCH articles | 1 | CANONICAL |
| calendar_events | Event | ICS sources | 0 | CANONICAL (empty locally) |
| admin_users | Staff account (legacy identity) | admin login | 2 (`testadmin`,`tuan`, owner) | FOUNDATION/legacy-parallel |
| accounts | Account (P0) | member login | 1 (`tuantq`, ACTIVE) | FOUNDATION (P0) |
| identity_mappings | IdentityMapping (P0) | account↔person | 1 (`tuantq`→`test_tuantq`) | FOUNDATION (P0) |
| authorities | Authority (P0) | resource permissions | **0** | FOUNDATION (P0) — **never read by any route** |
| families, memories, timeline, media, person_media, authors, series | GenealogyConstruct / Memory / Media / … | referenced by API | **TABLE DOES NOT EXIST** | MISSING locally (DDL only in `server/schema_update.sql`) |

### B. Configured-but-unused DB — MariaDB `family_archive` @ `100.80.147.119:3306` (NAS/Tailscale)
- `server/.env`: `DB_CLIENT=mysql`, root user — **runtime overrides to sqlite3** (`ps eww` shows `DB_CLIENT=sqlite3 DB_PATH=./family_archive.db`), contradicting `.env`.
- TCP 3306 reachable; authentication with repo credentials **DENIED** → schema/data **NOT INSPECTED** (see §19 UNKNOWNs). Production API clearly reads a populated DB (228 people) — that data is not in local SQLite.

### C. Other data stores
- `server/data/*.json` (genealogy/mach/media/person_media snapshots) & `server/calendars/*.ics` — static artifacts consumed in production.
- Filesystem media: `assets/images/` (+ per `docs/SOURCE_MAP.md` physical media on NAS `/volume1/web/family-api/assets/images/`).
- `GIADINHONGTHU.ged` — GEDCOM source of truth (gitignored).
- Legacy DB dumps: `archive/legacy_database/` (not audited in depth — classified LEGACY by location).

---

## 13. PRIVACY / AUTHORITY AUDIT — actual enforcement (not intended design)

**What the backend actually enforces:**

```
WORKTREE RUNTIME:                      PRODUCTION (origin/main):
Account → authentication ONLY          Account → (no account system at all)
  ├─ member session: session.accountId     └─ anonymous POST/DELETE on /api/people,
  │   → /me, change-password (own rows)         /api/stories, /api/edges, /api/events
  ├─ admin session: session.userId
  │   ├─ role string 'owner'  → /api/admin/users   ← the ONLY AUTHZ check
  │   └─ role string 'editor'+→ all content writes ← no resource-level check
  └─ authorities table: created on admin sync, NEVER consulted by any route (0 reads)
```

**Findings (audit only — no remediation performed):**
1. **[P0] Production write endpoints have no authentication.** Evidence: `git show HEAD:server/index.js` (no auth code); live `POST /api/people {}` → 500 (handler ran, not 401); production admin `api.js` writes without credentials. (Disclosure: this probe used an empty body; verified no row written — people list byte-identical before/after: 113,222 bytes / 228 rows / no null rows.)
2. **[P0] P0/P0.1 code uncommitted** — entire identity/authority layer exists only in worktree; loss risk + never deployed (§6).
3. **[P1] `authorities` never enforced** — `foundation.js` writes rows; no middleware reads them → authority model is decorative (tables + `/api/auth/me/identity` output only).
4. **[P1] Status lifecycle not enforced** — REVOKED still authenticates (runtime test); only PROVISIONED is handled (`member.js:193`); no code sets/validates other states.
5. **[P1] Member login unthrottled** — rate limiter mounted only on `/api/auth/login` (`index.js:207`); `/api/member/login` unlimited.
6. **[P2] Split identity on `/api/auth/me` vs `/api/auth/me/identity`** — member sessions get 401 on `/api/auth/me` (no `userId`); two parallel "who am I" endpoints (admin vs member) risk frontend confusion.
7. **[P2] Admin credentials accepted by member login** (fallback `member.js:88-101`) — admin/member boundary blurred by design choice, undocumented.
8. **[P2] Session store = MemoryStore** — restart invalidates all sessions; no session persistence/audit trail; `SESSION_SECRET` fallback secret if unset (`index.js:29`).
9. **[P1] `/me` displays hardcoded ACTIVE** and its logout link is broken (GET vs POST) — misleading state + dead end.
10. Positive controls verified: bcrypt everywhere; httpOnly+SameSite cookies; admin login rate-limited + `is_active` checked; member excluded from all admin/canonical writes (401); identity endpoint session-bound (no IDOR vector); `/api/edges`+`/api/events` reads locked to 403; admin CORS restricted to allow-list.

---
## 14. DOCUMENTATION AUDIT

**A. Developer / Agent documentation (EXISTS, substantial):** `README.md`, `docs/README.md` (pipeline hierarchy + persona reading guides), `docs/HELP.md` (agent-first FAQ/knowledge layer), `docs/SOURCE_MAP.md` (source classification + change-points), root `PROJECT_*.md`, `ARCHITECTURE_CONFLICTS.md`, `CURRENT_SCHEMA_MAP.md`, `GIATOC_*ARCHAEOLOGY*`, `.aios/PROJECT_CONTRACT.json` + `AGENTS.md` (governance), `server/README-admin.md`.

**B. Architecture documentation (EXISTS, target-heavy):** `docs/architecture/DOMAIN_MODEL.md` (PROPOSED/TARGET), `ERD_v0.1.md` (PROPOSED), `IMPLEMENTATION_BASELINE.md` (claims "COMPLETED" but its §2 table is already **stale** — states Identity Mapping "KHÔNG CÓ" although `foundation.js` implements it locally), `MEMBER_SYSTEM_SPECIFICATION.md`, `CURRENT_ARCHITECTURE/CURRENT_STATE/DECISION_LOG/CAPABILITY_MODEL`, `MISSION_REGISTRY`, Synology inventories. Older architecture set was **deleted in worktree** (incl. `ARCHITECTURE.md` — still referenced as Source of Truth by `README.md` → **broken pointer**).

**C. Member / User documentation — answers to mission questions:**
- **Does a real member-facing User Guide exist? NO.** Nothing under `docs/` addresses members; `docs/HELP.md` is explicitly a *project knowledge* layer for agents/humans working on the codebase.
- **Does member-facing Help exist? NO.** (`docs/HELP.md` is dev/agent FAQ — title "HỆ THỐNG TRỢ GIÚP & TRI THỨC DỰ ÁN (PROJECT HELP / KNOWLEDGE SYSTEM)".)
- **Does Privacy guidance exist? NO member-facing privacy doc.** Only architecture-level mentions (`MEMBER_SYSTEM_SPECIFICATION.md`, `SYNOLOGY_CAPABILITY_INVENTORY.md`); no privacy policy/data handling doc for users.
- **Does onboarding documentation describe the ACTUAL implementation? NO.** No onboarding doc at all for the P0.1 flow (provision → temp credential → forced change → /me). Closest artifacts are the code itself (`dev_setup_onboarding.js`, `scripts/test_p01_onboarding.js`) — neither is documentation, and the P0.1 state is not described in `docs/` (only in uncommitted code).
- Member Guide / Account docs: search hits only in `docs/archive/**` (archived, historical).

---

## 15. PIPELINE AUDIT

### A. Delivery pipeline (what is known vs unknown)

```
LOCAL worktree ──(uncommitted: ALL of P0/P0.1 + admin login + doc deletions)──▶ (nothing)
LOCAL main HEAD 42a7ed2 ──push──▶ GITHUB origin/main ──???──▶ VERCEL (production website)
                                                  └──???──▶ PRODUCTION API (api.giatoctrantrongthu.com,
                                                            Cloudflare-fronted Express, host UNKNOWN,
                                                            code ≈ origin/main (no auth))
                                                            └─▶ MariaDB family_archive
                                                                @100.80.147.119 (NAS, creds DENIED)
```

| Stage | Known | Evidence | Unknown |
|---|---|---|---|
| LOCAL | two services: :3000 API (SQLite) + :8080 static; prototype fetches **production** API | `lsof`, logs, `app-v2.js:80,92` | who restarts :3000 (recycled once during audit) |
| GIT | `main` = `origin/main` = 42a7ed2; 167 dirty entries incl. entire auth layer | `git status`, `git log` | commit plans for P0.1 |
| GITHUB | remote `git@github.com:tuantudo/giatoctrantrongthu.git` | `git remote -v` | branch protection, deploy hooks |
| CI | `validate-data.yml` (Python integrity gate on push/PR), `instant-sync.yml` (Google Calendar webhook) — **no build/deploy workflow** | `.github/workflows/*` | — |
| VERCEL | project `gionghotrantrongthu` (`.vercel/project.json`); prod serves **V1** (`app.js?v=20260906_0105`) while main HEAD = DESIGN-001 prototype | live curl vs `git show HEAD:index.html` | deploy trigger/state — **commit message claims deploy that is NOT live** |
| API DEPLOY | behavior matches origin/main (404 on auth/admin, unauth writes); Cloudflare-fronted Express; media rewrite URLs point to `api.giatoctrantrongthu.com` | live probes, `index.js:418-422` | hosting box (NAS implied by docs/SOURCE_MAP `family-api`), deploy mechanism, secrets |
| DB | production data 228 people (live API); NAS MariaDB reachable | live curl, `nc` | NAS schema/credentials (DENIED) |

### B. Application runtime (local)

```
Browser → :8080 (Python static) or :3000 (Express static) → index.html + app-v2.js
        → fetch https://api.giatoctrantrongthu.com/* (PRODUCTION data — not local API!)
        → auth: NONE wired in prototype (real /login only via direct URL on :3000)
        → :3000 Express API → SQLite ./family_archive.db (NOT the configured MySQL)
        → filesystem media assets/ (+ NAS volume in production)
```

**Production runtime:** Browser → Vercel (V1 static) → `api.giatoctrantrongthu.com` (Cloudflare → Express) → MariaDB (NAS) → filesystem media. Admin host → Vercel `/admin` → same API **without authentication**.


## 16. CURRENT → TARGET ARCHITECTURE (comparison against DOMAIN_MODEL / IMPLEMENTATION_BASELINE / ERD_v0.1 / P0 FOUNDATION / P0.1 ONBOARDING)

| Target concept (docs) | Current reality (code/runtime) | Verdict |
|---|---|---|
| Person (P0) | `people` table + payload; public/admin routes | **IMPLEMENTED** (test-data contamination locally) |
| Account (P0) | `accounts` table + member login — **uncommitted, not deployed** | **IMPLEMENTED-LOCAL / MISSING-PROD** |
| IdentityMapping (P0) | `identity_mappings` + `/me` identity display + `/api/auth/me/identity` — **uncommitted** | **IMPLEMENTED-LOCAL / MISSING-PROD** (baseline doc still says "KHÔNG CÓ" → stale) |
| Authentication (P0) | session+bcrypt, admin & member logins — **uncommitted** | **IMPLEMENTED-LOCAL / MISSING-PROD** (prod = no auth at all) |
| Authority foundation (P0) | `authorities` table + admin sync row — **never enforced by any route** | **PARTIAL (decorative)** |
| Existing genealogy preservation (P0) | `people`/`edges` preserved; public adapters broken locally (missing tables) | **PARTIAL** |
| Relationship (P0 extend) | `edges` 3 columns only; no provenance/evidence | **BASIC-ONLY** |
| Evidence/Source (P0 in baseline) | nothing | **MISSING** |
| Family Space / Membership / space permissions (P1) | nothing | **MISSING** |
| Media ownership/moderation (P1) | `media/person_media` DDL-only locally; no owner/upload tracking | **MISSING/LEGACY** |
| Memory/Story member contributions (P1) | `memories` DDL-only; stories = staff-only writes | **MISSING (stories = staff PARTIAL)** |
| Submission/Proposal (P1) | nothing (writes go straight to canonical) | **MISSING** |
| Public projection / person pages (P3) | V1 has them in production; DESIGN-001 prototype does not | **LEGACY-EXISTS / PROTOTYPE-MISSING** |
| P0.1 ONBOARDING (provision→temp→forced change→ACTIVE) | fully coded + tested locally; test currently red; never committed | **IMPLEMENTED-LOCAL, UNTESTED-GREEN, NOT DEPLOYED** |
| Member workspace (`MEMBER_SYSTEM_SPECIFICATION §9`) | single `/me` card | **MISSING** (spec ahead of reality) |

Full severity matrix: `docs/audit/SYSTEM_GAP_MAP_P0.2.md`.

---

## 17. FOUR-SPACE PRODUCT MAP

| | PUBLIC SPACE | FAMILY SPACE | DISCUSSION SPACE | PERSONAL SPACE |
|---|---|---|---|---|
| **CURRENT** | Prototype (DESIGN-001, 10 hash views) locally + legacy V1 in production; data from production API | nothing (`families` = genealogy construct only) | nothing | one `/me` profile card (local only, uncommitted) |
| **TARGET** | publication + genealogy overview + person pages (DOMAIN_MODEL, IMPLEMENTATION_BASELINE P3) | space entity + membership + space authz + shared content (ERD §B.3) | not in MVP scope (ERD §E FUTURE: comment/reaction) | member workspace w/ ownership + privacy (MEMBER_SYSTEM_SPEC §9) |
| **DATA** | `people/edges/stories/calendar_events` (+ families/memories/media DDL-only) | none | none | `accounts/identity_mappings` only |
| **AUTHORITY** | anonymous read (`status='PUBLISHED'` filter) | none | none | session-only; own rows implicit (nothing to own) |
| **PRIVACY** | public | none defined | none defined | none defined (no private resources) |
| **ROUTES** | `GET /api/people|stories|genealogy.json|mach.json|media.json|person_media.json|calendars/:f` + static | — | — | `GET /login`, `/me`, `/me/change-password`, `POST /api/member/login|change-password`, `GET /api/auth/me/identity` (LOCAL ONLY) |
| **UI** | `index.html` views + V1 in prod | — | — | server-rendered `/me` card + placeholder `#/thanh-vien` (no link to real /me) |
| **STATUS** | PARTIAL (split generations) | **MISSING** | **MISSING** | **NO / PARTIAL-as-profile** — answer to mission Q5 = **NO genuine private space** |

**Navigation between spaces (tested):** Public ⇄ Member = disconnected (no link public→/login; /me → broken logout, no return link). Family & Discussion = N/A. Admin = separate host/entry, worktree-only login.

---
## 18. EVIDENCE INDEX

**Methodology (non-destructive):** live read-only probes of local + production services; SQLite inspection via `sqlite3` CLI; authenticated flows verified against an **isolated copy** of the DB (`/tmp/p02_audit/family_archive.db`) on `127.0.0.1:3001` with a re-provisioned account — the real local DB and production were never written to. One disclosure: a single `POST /api/people` with empty JSON `{}` was sent to the production API to determine auth behavior; it returned 500 (param binding failure), and data was verified unchanged before/after (113,222 bytes / 228 rows / no malformed rows).

| # | Evidence | Type |
|---|---|---|
| E1 | `git status --porcelain` → 167 entries; `server/auth.js|member.js|foundation.js`, `scripts/test_p01_onboarding.js`, `admin/login.html|js/login.js` untracked | GIT |
| E2 | `git log --all --oneline -- server/auth.js server/member.js server/foundation.js scripts/test_p01_onboarding.js` → empty (never committed) | GIT |
| E3 | `git show HEAD:server/index.js` → routes without any auth/session/requireAuth | GIT |
| E4 | `server/index.js:207-213` router mounts; `:41-56` rate-limit/CORS; `:216-473` route table; `:497-503` listen | SOURCE |
| E5 | `server/auth.js:8-21,32-151,161-255`; `server/member.js:10-15,70-237`; `server/foundation.js:8-93` | SOURCE |
| E6 | `server/dev_setup_onboarding.js` (DROP tables + temp credential), `scripts/test_p01_onboarding.js` (P0.1 assertions) | SOURCE/TEST |
| E7 | `index.html:66/165/190/202/235/253/265/285/309/334` (10 views), `:300-301,323-324` prototype auth disclaimers; `grep login index.html` → 0 | SOURCE |
| E8 | `src/js/app-v2.js:80,92,128-135` (production API base hardcoded), `:275-286` (router; no search impl) | SOURCE |
| E9 | `admin/js/api.js:6-7,24-44` (worktree auth client) vs `git show HEAD:admin/js/api.js` (no auth) vs live `admin.giatoctrantrongthu.com/admin/js/api.js` (no auth) | SOURCE/RUNTIME |
| E10 | Local runtime: `lsof -iTCP:3000,8080`; `ps eww` → `DB_CLIENT=sqlite3`; `local_server.log` | RUNTIME |
| E11 | `sqlite3 server/family_archive.db .tables` → 8 tables; counts; `people` test rows; bcrypt prefixes; authorities=0; identity_mappings=1 | DB |
| E12 | `GET :3000/api/genealogy.json → 500 "no such table: families"`; `/api/mach.json → 500`; `/api/media.json → 500` | RUNTIME |
| E13 | `GET :3000/api/auth/me → 401`; `GET /me → 302 /login`; `GET /login → 200`; `GET /api/discussion|/api/family|/api/memory → 404` | RUNTIME |
| E14 | `node scripts/test_p01_onboarding.js` → FAIL `Should login with temp password (401 !== 200)` (against real local DB) | TEST |
| E15 | Isolated-instance test suite (27 checks, 25 PASS / 2 FAIL): M1–M17 member flow+IDOR, A1–A10 admin flow — see §6.2/§10; script at `/tmp/p02_audit/audit_test.js` | TEST |
| E16 | REVOKED-status probe: login → 200 `{status:"REVOKED"}`, `/me` → 200 (isolation copy) | RUNTIME |
| E17 | `curl GET :3000/api/auth/logout → 404` (broken link in `/me`) vs `POST → 200` | RUNTIME |
| E18 | Live production: `api.giatoctrantrongthu.com/api/auth/login → 404`, `/api/admin/content/people → 404`, `/api/member/login → 404`, `/me → 404`; `POST /api/people {} → 500` (not 401) | RUNTIME (PROD) |
| E19 | Live production website: `main.css?v=20260906_0100` + `app.js?v=20260906_0105`, hrefs `#/gia-pha/nhan-vat|gia-dinh|ky-uc|dong-thoi-gian` — vs `git show HEAD:index.html` = DESIGN-001 prototype title | RUNTIME (PROD)/GIT |
| E20 | `nc 100.80.147.119:3306` OK; `mysql2` connect with `server/.env` creds → `Access denied for user 'root'` | RUNTIME (NAS) |
| E21 | `docs/` inventory: no member/user/privacy guide; `docs/HELP.md` = agent knowledge layer; `README.md` SoT pointer → deleted `docs/architecture/ARCHITECTURE.md` | DOCS |
| E22 | `server/schema_update.sql` = DDL for families/memories/timeline/media/person_media/authors/series — never executed by server code | SOURCE |
| E23 | `.github/workflows/validate-data.yml`, `instant-sync.yml` — data gates only, no deploy job | SOURCE |
| E24 | `.vercel/project.json` (project `gionghotrantrongthu`); `vercel.json` (admin host redirect + headers) | SOURCE |
| E25 | `curl :8080/*` → 200 (site + assets); production API `/api/mach.json|genealogy.json|people|calendars` → 200 | RUNTIME |

## 19. UNKNOWNS

1. **NAS MariaDB schema/data** — reachable but repo credentials denied (E20). Cannot map production tables or verify `families/memories/media` exist there.
2. **Production API hosting & deploy mechanism** — Cloudflare-fronted Express; box, release process, secrets history not evidenced in repo.
3. **Vercel deploy state** — why live ≠ `origin/main` despite commit message "Deploy DESIGN-001…"; deploy logs/branch settings not inspectable locally.
4. **Credentials for current local `tuantq` account** — rotated; unknown (test fails). Lifecycle of `testadmin`/`tuan` admin passwords unknown.
5. **Cause of :3000 server process recycle during audit** (48119 → 78244) — replacement healthy/equivalent; trigger external & unidentified.
6. **Whether production `POST /api/people` with a well-formed body actually persists** — NOT tested (would mutate production); code path implies yes.
7. **V1 person-detail rendering fidelity** — route hrefs observed, render not verified in a browser.
8. **Intent/plan for committing P0/P0.1** — no mission record in repo (`docs/architecture/MISSION_REGISTRY.md` not updated for P0/P0.1).
9. **Browser-based interactive QA** — Playwright MCP unavailable this session; journeys verified at HTTP/source level instead.

---
## 20. CONTRADICTIONS

| # | Contradiction | Evidence A | Evidence B |
|---|---|---|---|
| C1 | "Deploy DESIGN-001 Revision" vs live V1 site | commit `42a7ed2` | E19 |
| C2 | P0/P0.1 "exists" (code, tests, spec) vs never committed/deployed | worktree E1/E2 | production E18 |
| C3 | `server/.env` says MySQL/NAS vs runtime uses SQLite | `.env` | E10 |
| C4 | README SoT = `docs/architecture/ARCHITECTURE.md` vs file deleted in worktree | `README.md` | `git status` |
| C5 | `IMPLEMENTATION_BASELINE` "Identity Mapping KHÔNG CÓ" vs `foundation.js` implements it locally | baseline §2 | E5 |
| C6 | `DOMAIN_MODEL` `[CURRENT] families table` vs local DB has no `families` table | DOMAIN_MODEL §H | E11/E12 |
| C7 | `/me` shows "Trạng thái: ACTIVE" vs DB may say otherwise (REVOKED still displayed ACTIVE) | `member.js:229` | E16 |
| C8 | `/me` logout link (`GET`) vs logout route (`POST`) | `member.js:232` | E17 |
| C9 | Prototype fetches production API while local API adapters 500 — "local dev" does not actually exercise local data | `app-v2.js:80` | E12 |
| C10 | Admin console live in production, but production API has no auth endpoints to support a login flow | E9 (live api.js) | E18 |

## 21. RECOMMENDED NEXT GATES (for the Orchestrator — not self-assigned)

1. **[P0 · HUMAN GATE — security]** Decide + execute: close unauthenticated production write endpoints (`POST/DELETE /api/people|stories|edges|events`) and the no-auth production admin console. Production changes require Tuấn's approval per Human Gate rules.
2. **[P0 · HUMAN GATE — code preservation]** Commit (or otherwise back up) the P0/P0.1 implementation (`server/auth.js|member.js|foundation.js`, admin login UI, test script) — currently one machine failure away from being lost; decide commit granularity + review.
3. **[P0]** Reconcile 3-way drift: worktree ↔ `origin/main` ↔ live Vercel/API — define "production truth" and how deploys actually run (pipeline undocumented).
4. **[P0]** DB truth: decide SQLite-vs-MariaDB for local runtime, recover/rotate NAS credentials, then inspect production schema (currently UNKNOWN).
5. **[P1]** Member journey blockers: broken logout link (GET/POST), missing public→`/login` navigation, `/me` hardcoded status, member-login rate limiting, REVOKED/ACTIVE enforcement, make `authorities` authoritative or remove it.
6. **[P1]** Make the P0.1 test green + repeatable (reprovision path or isolation) and wire a real `npm test` entry.
7. **[P1]** Schema canonicalization: version/execute the `schema_update.sql` DDL so local `genealogy.json|mach.json|media.json` stop 500ing; purge test rows (`ptest`, `finaltest`) from canonical `people`.
8. **[P2]** Documentation: member guide/help/privacy/onboarding for the *actual* implementation; fix README SoT pointer; refresh stale baseline docs.
9. **[P2/P3]** Family Space, Discussion, Personal-space resources — only after P0/P1 gates (per `IMPLEMENTATION_BASELINE` build order).

## 22. ADDENDUM — CONCURRENT CHANGES DURING THE AUDIT WINDOW (post-evidence remediation)

Between evidence capture (≈18:37–18:55) and report finalization (19:1x), two parallel missions touched the same workspace. Their artifacts: `docs/audit/OWNER_TEST_P0.2A.md` (18:42) and `docs/audit/P0.2B_RUNTIME_FIX_REPORT.md` (18:50). Impact on this audit's findings — re-verified live at 19:0x:

| # | Finding (as captured) | Status NOW | Re-verification evidence |
|---|---|---|---|
| §4/E7 | No link from public site to `/login` | **REMEDIATED (uncommitted)** — `index.html:302` now `<a href="/login">Đăng nhập Thành viên →</a>`; placeholder copy updated to "P0.1 đã triển khai backend" | grep `index.html` |
| §4/E8 | `app-v2.js` hardcodes production API URL | **REMEDIATED (uncommitted)** — `app-v2.js:1` env-aware `API_BASE` (localhost → same-origin), all fetches use it; local frontend now talks to local :3000 | grep `app-v2.js` |
| §12/E12 | Local `genealogy.json`/`mach.json` → 500 | **PARTIALLY REMEDIATED** — local DB modified at 19:00: `families, memories, timeline, authors, series` tables created (0 rows) → both now **200**; `media` + `person_media` **still missing** → `/api/media.json`, `/api/person_media.json` still **500** | `sqlite3 .tables`; curl |
| §9A/E17 | `/me` dead end (no return link; broken logout) | **PARTIALLY REMEDIATED** — redesigned `/me` adds navbar with `href="/"` back-link (`member.js:256-259`); **logout STILL BROKEN**: link `member.js:260` uses GET, route is POST-only → `GET /api/auth/logout` = **404** (re-tested after 18:48 restart) | curl after restart |
| §6/E16 | `/me` status hardcoded ACTIVE | **STILL PRESENT** — `member.js:268` renders static `status-badge ACTIVE` regardless of DB | source |
| §14/E14 | P0.1 test fails on temp password | **ROOT CAUSE IDENTIFIED** — owner logged in with `tuantq/050787` and changed the password during P0.2A testing (`OWNER_TEST_P0.2A.md §3`) → account ACTIVE with owner-chosen password | owner test doc |
| Runtime note §2 | :3000 process recycled 18:48:13 | **EXPLAINED** — P0.2B restarted the server to load the new `member.js` (mtime 18:48) | mtimes + report |
| NEW | — | **NEW DEFECT OBSERVED**: frontend/API contract mismatch — `app-v2.js:122` reads `data.fams` but API returns `families` (`index.js:379`) → family statistics always 0 | source comparison |

**Unaffected (still valid as written):** all P0 findings — P0/P0.1 code uncommitted (P0.2B's own changes are likewise uncommitted; dirty count 167→168), production API/admin without authentication, Vercel↔main deploy drift, NAS DB credentials denied, `authorities` never enforced, REVOKED not enforced, member-login rate limit absent, Family Space/Discussion missing, member documentation missing, `README` SoT pointer broken.

---
*End of artifact. No application code, schema, production resource, or git state was modified by this mission (the two files below are its only outputs). Concurrent missions P0.2A/P0.2B made separate changes — see §22.*