# SYSTEM GAP MAP — P0.2

*Mission: P0.2 — SYSTEM WALKTHROUGH & IMPLEMENTATION AUDIT · Audit only · 2026-10-03*
*Companion: `docs/audit/SYSTEM_WALKTHROUGH_P0.2.md` (full walkthrough + evidence index E1–E25)*
*Severity: **P0** = architectural/security/blocking · **P1** = required for next usable stage · **P2** = later · **P3** = future*
*Status codes: EXISTING (code+runtime) · EXISTING-LOCAL (worktree only, uncommitted) · PARTIAL · PLANNED (docs only) · MISSING*
*Note: parallel missions P0.2A (owner test) and P0.2B (runtime/nav fixes) changed parts of the worktree mid-audit — affected rows are annotated "REMEDIATED mid-audit (uncommitted)"; full reconciliation: `SYSTEM_WALKTHROUGH_P0.2.md §22`.*

---

## A. FOUNDATION / PIPELINE GAPS

| AREA | CURRENT REALITY | TARGET | GAP | SEV | EVIDENCE | NEXT ACTION |
|---|---|---|---|---|---|---|
| Auth code preservation | P0/P0.1 files UNTRACKED; never in any commit | committed + reviewed source | entire identity layer at risk of loss | **P0** | E1, E2 | Human-gated commit of `server/auth.js|member.js|foundation.js`, admin login, test |
| Production write security | `POST/DELETE /api/people|stories|edges|events` unauthenticated in origin/main & live API | authenticated + authorized writes | open write surface on prod API | **P0** | E3, E18 (probe: 500 not 401), E9 | Human-gated auth rollout to production API |
| Prod admin console | no login page, `api.js` writes without credentials | login-gated console | admin = open write UI | **P0** | E9, E18, C10 | deploy worktree admin + API auth together |
| Deploy alignment | live Vercel serves V1 (20260906) while main = DESIGN-001 | live = main | deploy drift; commit msg falsely claims deploy | **P0** | E19, C1 | verify Vercel trigger/state; redeploy decision |
| Local runtime DB | runtime=SQLite; `.env`=MariaDB NAS; NAS creds DENIED | one declared source of truth | config≠runtime; prod schema unknown | **P0** | E10, E20, C3 | decide DB strategy; recover NAS creds |
| Public adapters local | `genealogy.json|mach.json` **fixed mid-audit** (tables added 19:00, 0 rows); `media.json|person_media.json` still 500 | 200 on local dev | `media/person_media` tables missing; new tables empty | **P1** | E12, E22, §22 | finish schema; load data |
| Pipeline documentation | no deploy workflow in CI; API deploy mechanism undocumented | documented LOCAL→GIT→GITHUB→BUILD→DEPLOY→PROD | pipeline mostly UNKNOWN | **P1** | E23, E24, §15 | document actual deploy paths |

## B. IDENTITY / AUTHENTICATION GAPS (P0/P0.1 audit)

| AREA | CURRENT REALITY | TARGET | GAP | SEV | EVIDENCE | NEXT ACTION |
|---|---|---|---|---|---|---|
| Password storage | bcrypt everywhere; temp cred hashed, printed once | bcrypt | none — VERIFIED | — | E11, E15 (M1–M8) | keep |
| Forced activation | PROVISIONED → 302 `/me/change-password`; old pwd invalidated | enforced lifecycle | none for PROVISIONED — VERIFIED | — | E15 M4–M8 | keep |
| Status lifecycle | REVOKED still logs in; `/me` shows hardcoded ACTIVE; only PROVISIONED handled | PROVISIONED/ACTIVE/REVOKED/DISABLED enforced | enforcement missing; UI lies about state | **P1** | E16, `member.js:229` | enforce status at login + read DB in `/me` |
| `/me` protected | 302/401 unauthenticated; identity from DB | protected + backend identity | VERIFIED | — | E13, E15 M9–M11 | keep |
| IDOR | identity endpoint session-bound; no param override | no cross-account reads | VERIFIED (no member resource endpoints exist) | — | E15 M11 | re-test when member resources land |
| `authorities` table | written on admin sync (1 row) but **never read** by any route | authority = actor+resource+action enforced | authority model decorative | **P1** | E11 (0 rows local), E15 A3, `foundation.js:86-90` | wire into middleware or de-scope |
| Member login throttle | none on `/api/member/login` | rate limit like admin login | brute-force exposure | **P1** | `index.js:207` vs `member.js:70` | add limiter |
| Admin/member boundary | admin creds accepted by member login (fallback) | distinct roles/flows | blurred boundary, undocumented | **P2** | `member.js:88-101` | decide & document |
| `/api/auth/me` vs `/me/identity` | two "who am I" endpoints; member gets 401 on `/api/auth/me` | single coherent identity API | split model confuses clients | **P2** | `auth.js:98,129`; E15 M12 | unify |
| Session store | MemoryStore; restart kills sessions | persistent/signed store | no session durability/audit | **P2** | `index.js:27-39` | evaluate before multi-instance |
| P0.1 test | currently FAILING (credential drift); one-shot, non-idempotent | green + repeatable gate | no reliable regression signal | **P1** | E14, E15 | reprovision/isolate + `npm test` |
| P0.1 deployment | routes 404 in production | deployed identity system | P0.1 invisible to users | **P0** | E18 | after commit: deploy |

## C. FOUR-SPACE GAPS

| AREA | CURRENT REALITY | TARGET | GAP | SEV | EVIDENCE | NEXT ACTION |
|---|---|---|---|---|---|---|
| **PUBLIC** homepage | prototype (local) + V1 (prod), divergent | one live publication site | generation split; deploy drift | **P0** | E19, C1 | reconcile per gate A3 |
| **PUBLIC** person pages | none in prototype; V1 routes live in prod | person pages (target P3) | prototype lacks them | **P1** | E19 | planned in DESIGN-001 work |
| **PUBLIC** search | client-side snapshot search only (`protoSearch`) | real search over data | no search API | **P2** | `index.html:265-283` | later |
| **PUBLIC** login entry | was zero links → **REMEDIATED mid-audit by P0.2B (uncommitted)**: `index.html:302 href="/login"` | "Tư cách thành viên" → real login | fixed in worktree; still not committed/deployed | **P1** | E7 + §22 | commit/deploy |
| **PERSONAL** `/me` | profile card only (local, uncommitted) | private space w/ ownership+privacy | **no member resources, no privacy model** — mission answer: **NO** | **P1** | §7 walkthrough, E15 | design after P0 commit |
| **PERSONAL** navigation return | navbar back-link added by P0.2B (uncommitted); **logout STILL 404** (GET link vs POST route, `member.js:260`) | coherent loop | dead end partially opened; logout broken | **P1** | E17, C8, §22 | fix link method + verify |
| **PERSONAL** settings/contributions/memories | absent | member workspace (spec §9) | whole workspace missing | **P2** | `MEMBER_SYSTEM_SPECIFICATION §9` | P1+ build order |
| **FAMILY** space entity | absent (`families` = genealogy only) | FamilySpace + Membership + space authz | full space system missing | **P2** (P1 per baseline) | E11, `ERD_v0.1 §A` | blocked by Human decisions (space definition) |
| **DISCUSSION** | absent everywhere | (ERD: FUTURE/OUT-OF-MVP) | nothing to gap against unless scope added | **P3** | E13, `ERD §E` | keep out of MVP until decided |
| **ADMIN** login | worktree-only login UI; prod none | login-gated console | not deployed | **P0** | E1, E9 | ship with auth rollout |
| **ADMIN** Inbox/Archive | Inbox MOCK (`badgeInbox hidden`), Archive nav | real inbox/archive | placeholders | **P3** | `admin.js:67` | later |

## D. GENEALOGY / DATA GAPS

| AREA | CURRENT REALITY | TARGET | GAP | SEV | EVIDENCE | NEXT ACTION |
|---|---|---|---|---|---|---|
| Canonical tables | `people/edges/stories/calendar_events` real; 7 referenced tables absent locally | all API-referenced tables exist | schema fragmentation (no canonical migration dir; `database/migrations` deleted in worktree) | **P1** | E11, E22 | restore/version migrations |
| Test data in canonical | `ptest`, `finaltest` rows in `people` | clean canonical data | hygiene/trust issue | **P1** | E11 | purge (Human-approved) |
| Dual model payload/columns | JSON `payload` + columns; overwrite can lose `payload` | single canonical representation | known E2E bug (HELP Q-DATA-001) | **P2** | `docs/HELP.md` | later canonicalization |
| Frontend/API contract | `app-v2.js:122` reads `data.fams`; API returns `families` (`index.js:379`) → family counts always 0 | matching contract | silent data-shape mismatch | **P2** | §22 | fix when touching homepage stats |
| Evidence/Source | absent | Claim→Evidence (P0 in baseline) | provenance missing | **P1** | baseline §2 | after P0 foundation ships |
| Submission/Review | absent — writes go straight to canonical | proposal workflow | governance missing (expected now, blocking at P2) | **P2** | baseline §2 | P2 stage |

## E. DOCUMENTATION GAPS

| AREA | CURRENT REALITY | TARGET | GAP | SEV | EVIDENCE | NEXT ACTION |
|---|---|---|---|---|---|---|
| Member User Guide | **MISSING** | member-facing guide | members have no instructions | **P2** | E21 | write after member journey stabilized |
| Member Help | **MISSING** (dev `docs/HELP.md` ≠ member help) | in-product help | — | **P2** | E21 | later |
| Privacy guidance | **MISSING** (arch mentions only) | privacy policy/data handling doc | required before real member data | **P1** | E21 | before Family/Personal space launch |
| Onboarding doc | **MISSING** (only code+test describe P0.1) | accurate onboarding doc | docs lag implementation | **P1** | E6, E21 | after P0.1 commit |
| README SoT pointer | broken (`ARCHITECTURE.md` deleted in worktree) | valid pointer | broken link | **P2** | C4 | fix in doc pass |
| Baseline/Domain staleness | baseline says IdentityMapping "KHÔNG CÓ" (now built) | accurate status | doc drift | **P2** | C5 | next doc revision (AGY scope) |

---

## F. SEVERITY SUMMARY

- **P0 (7):** unauthenticated prod writes; unauth prod admin console; P0/P0.1 code uncommitted; P0.1 not deployed (404s); deploy drift (Vercel≠main); DB source-of-truth contradiction + NAS creds denied; (pipeline undocumented → counted P1 below but blocks P0 closure).
- **P1 (13):** member journey dead-ends (no login link, broken logout, hardcoded ACTIVE); status lifecycle unenforced; member login unthrottled; `authorities` decorative; local public adapters 500; schema fragmentation; test-data contamination; P0.1 test red; pipeline docs; privacy doc before real member data; onboarding doc; evidence/source missing; person pages missing in prototype.
- **P2 (9) / P3 (3):** member workspace breadth, family space design decisions, session store, admin-vs-member boundary split, payload dual-model, discussion (scope), inbox/archive mock.

**Top recommended gate (single next action):** *Human-gated P0 preservation + security decision* — commit the local identity layer and decide how to close the unauthenticated production write surface, then reconcile deploy state (worktree ↔ main ↔ live). All other gates depend on this ordering.

---
*End of artifact. Evidence codes E1–E25 and full descriptions: `docs/audit/SYSTEM_WALKTHROUGH_P0.2.md §18`. No fixes, migrations, deployments, or schema changes were performed.*

