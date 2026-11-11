# GIATỘC — APPLICATION SHELL v0.2

*Executor: Cline · Status: implemented for Member surfaces; Public shell specified but NOT adopted (rule #1)*
*Sources: `docs/architecture/SITEMAP_v0.1.md`, `NAVIGATION_MODEL_v0.1.md`, `USER_FLOWS_v0.1.md`*

## 1. PRINCIPLE — ONE SYSTEM, TWO CONTEXTS

`[FACT]` Public Space and Member Space are **two contexts of one UI system**, not two systems.
`src/js/ui/shell.js` renders both from the same components (`InstitutionHeader`, `GlobalNav`/`MemberNav`, `Breadcrumb`, `BackNavigation`, `PageHeader`, `Section`, `Card`, `Footer`). Differences are supplied as data, not as forked code:

| Context | Nav items | Scope indicator | Auth boundary |
|---|---|---|---|
| Public | Trang chủ · MẠCH · Gia phả · Tìm kiếm · Đăng nhập | `Public` (neutral) | `/login` → member space |
| Member | Bảng điều khiển · Gia phả toàn tộc · MẠCH · Trang công khai · Đổi mật khẩu · Đăng xuất | `Member Space` (neutral) | `/me/*` + `/api/member/*` behind `requireAccount` |

## 2. REGION MODEL

Every page in both contexts is composed of the same four regions (`src/css/foundation/layout.css`):

```
gi-body
├── gi-region-header     (InstitutionHeader + nav + breadcrumb + scope)
├── gi-region-context    (context strip — reserved; used by Member)
├── gi-region-main       (gi-container > PageHeader + Section*)
└── gi-region-footer     (Footer: brand, links, legal line)
```

`[FACT]` Header is sticky (`z-index: var(--z-header)`); `gi-region-main` flexes so the footer sits at the bottom (`min-height: 100vh` on `.gi-body`).

## 3. PAGE ANATOMY (server-rendered Member pages)

```
/me  and  /me/tree/person/:id
└── #gi-app  (empty host)
    └── built by boot-*.js:  assets → navigation context → shell → page content
```

Both pages are deliberately tiny (`server/member_dashboard.html` = 766 B, `server/member_person.html` = 711 B): no inline styles, no inline scripts, no hardcoded values. `[FACT]` This is the separation-of-concerns pattern borrowed from VINHDANHBUTPHA research §C.3 — **method only, no content copied**.

## 4. NAVIGATION CONTEXT MODEL (Phase 3)

`src/js/ui/navigation.js` holds a route registry mirroring SITEMAP_v0.1 and resolves, for **every** location: `route · params · parent · audience · breadcrumb · back · next · unknown`.

### 4.1 Verified resolution table
`[FACT]` produced by executing `resolveContext()` in Node against the real registry:

| Location | Breadcrumb | Back | Next |
|---|---|---|---|
| `/` | Trang chủ | — | — |
| `/login` | Trang chủ > Đăng nhập | hierarchy → `/` | — |
| `/#/mach` | Trang chủ > MẠCH | hierarchy → `/` | — |
| `/me` | Bảng điều khiển | **history** (no IA parent) | Gia phả toàn tộc |
| `/me/change-password` | Member Space > Bảng điều khiển > Đổi mật khẩu | hierarchy → `/me` | — |
| `/me/tree` | Member Space > Bảng điều khiển > Gia phả toàn tộc | hierarchy → `/me` | Bảng điều khiển |
| `/me/tree/person/:id` | Member Space > Gia phả toàn tộc > Hồ sơ cá nhân | hierarchy → `/me/tree` | Gia phả toàn tộc, Bảng điểu khiển |
| `/nope` | — | — | — (unknown surface) |

### 4.2 Hierarchy Back vs Browser History Back
`[FACT]` They are distinct and **explicitly labelled in the UI**, never hidden behind one generic "Back":

- `mode="hierarchy"` → static `<a href>` to the IA parent; badge *"theo phân cấp"*; works with JS disabled.
- `mode="history"` → `history.back()`; badge *"theo lịch sử trình duyệt"*; used only when no IA parent exists (`/me` today), per NAVIGATION_MODEL_v0.1 §3A which warns history-back can eject users out of the app.

### 4.3 Deep-linking & state preservation
`[FACT]` `/me/tree/person/:id` is a real server route → copy/paste works (USER_FLOWS_v0.1 §4).
`[OPEN QUESTION]` Scroll/filter preservation when returning from a detail view inside the legacy SPA is **not** implemented — that is legacy SPA behaviour, outside v0.2 scope.

## 5. MEMBER DASHBOARD COMPOSITION (Phase 4)

Six data zones, each with its own Loading/Empty/Error lifecycle (`Region()`), each driven by a real endpoint, each with EmptyState when data is absent — **no filler content**:

| Zone | Data source | Empty condition |
|---|---|---|
| 1 Danh tính | `GET /api/member/profile` (session-scoped) | account has no IdentityMapping |
| 2 Ngữ cảnh gia đình | `profile.person.details.{parents,siblings,spouses,children}` + `genealogy.json` name index | no relation ids on the record |
| 3 Nội dung gần đây | `GET /api/mach.json` stories sorted by `updatedAt`, top 3 | no published stories |
| 4 Lối vào gia phả | profile + `genealogy.json.stats` | always renders (links + counts) |
| 5 Ký ức & Tư liệu | `person_media.json` ∩ own personId + `media.json` | no media links for the person |
| 6 MẠCH | `mach.json` series + story count | both empty |

`[FACT]` The v0.1 static epistemic sample card ("FACT Sinh năm 1987", "INFERENCE Chi 2, Đời 4") is **deleted** — it asserted genealogy facts that no data source supplied.

## 6. PERSON SURFACE (Phase 5)

`/me/tree/person/:id` renders, from `genealogy.json` only: identity (name, raw_name, sex, birth/death/baptism date+place), relations (parents, siblings, spouses, children) linking to sibling person pages, and a **Nguồn & Thiệu chứng** section that renders an EmptyState explaining that the schema has no provenance field — instead of faking a FACT badge.

`[FACT]` **Person ≠ Account**: no account field, username, role or session data appears on this surface (verified by source review of `src/js/ui/person.js`).

`[PROPOSAL]` The route `/me/tree/person/:id` is a **new-UI companion** to the legacy hash route `/me/tree#/person/:id` in SITEMAP_v0.1. The sitemap was not modified (rule #5); ratification is requested, not assumed.

## 7. LEGACY COMPATIBILITY

`[FACT]` `/me/tree` continues to serve `server/member_baseline.html` + `src/js/member-app.js` (legacy SPA). v0.2 changed exactly one line there: relative `srcset="assets/images/logoGiaToc_original.svg"` → absolute `/assets/images/...` (the relative form 404s under `/me/*`). All legacy hash routes, styling and behaviour are untouched — v0.2 does not rebuild genealogy visualisation (Phase 5 constraint).

## 8. RESPONSIVE SHELL BEHAVIOUR (Phase 8 — static analysis only)

| Width | Header | Nav | Breadcrumb | Cards / grid |
|---|---|---|---|---|
| 1440px | inline brand + actions | inline | full chain | auto-fill up to 260px |
| 1024px | inline | inline | full chain | sidebar collapses |
| 768px | full-width actions | horizontal scroll strip | full chain | 1 column; buttons 44px |
| 375px | stacked | scroll strip | separators hidden | 1 column; tight gutters |

`[FACT]` Implemented in CSS. **Not visually verified** — see `docs/audit/REPORT_UI_SYSTEM_V0.2.md`.

## 9. DESIGNED BUT NOT IMPLEMENTED IN v0.2

| Item | Why |
|---|---|
| Public shell adoption (`/` using v0.2 header/footer) | Rule #1 — no full-site redesign; public keeps `prototype.css`. |
| GlobalNav swap into `index.html` | Same — would restructure the prototype shell. |
| Member-space index page (parent for `/me`) | Would change IA; `[PROPOSAL]`, needs Agy/Human. |
| `/me/tree` rebuilt on the v0.2 shell | Legacy SPA retained by design; migration is a separate mission. |
| Real visibility enforcement | Data/architecture decision, not UI. |
| Server-side name resolution endpoint | Would be an API change (out of Cline's authority); currently resolved client-side from the public bundle — see UI_SYSTEM §9 and the report's OPEN QUESTIONS. |

