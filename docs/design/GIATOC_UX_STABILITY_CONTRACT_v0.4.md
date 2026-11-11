# GIATỘC — UX STABILITY CONTRACT v0.4

*Mission: GIATỘC UX/UI STABILIZATION v0.4*
*Mục tiêu: UI ổn định đủ để Human dùng nó như **cognitive map** của hệ thống.*
*Không phải mission thêm feature, không phải redesign, không phải build backend.*

Nguồn chuẩn: `GIATOC_PROJECT_PURPOSE_SOURCE_MAP_AUDIT_v0.1.md` ·
`GIATOC_ARCHITECTURE_CONSOLIDATION_v0.1.md` · `GIATOC_UI_SYSTEM_vNEXT.md` ·
`GIATOC_APPLICATION_SHELL_vNEXT.md`

Nhãn nguồn xuyên suốt: `[CURRENT HUMAN DECISION]` · `[ARCHITECTURE CONSTRAINT]` ·
`[IMPLEMENTATION FACT]` · `[PROPOSAL]` · `[OPEN QUESTION]`

---

## 0. Câu hỏi mà UI phải trả lời

Mission §2 liệt kê 8 câu hỏi nhận thức. Contract này **gắn mỗi câu hỏi vào một cơ
chế UI cụ thể**, không phải vào một đoạn văn:

| # | Câu hỏi | Cơ chế UI | Nơi kiểm chứng |
|---|---|---|---|
| 1 | Tôi đang ở đâu? | `ContextBar` — 5 mục: Cấp / Không gian / Diễn ngôn / Dữ liệu / Truy cập | `data-level`, `data-context` |
| 2 | Đây là context nào? | `ContextBar` + `data-context` (5 UX context) | `contexts.js` |
| 3 | Account hay Person? | 2 khối `[data-identity]` riêng biệt ở `/me` | `dashboard.js` |
| 4 | Canonical Genealogy hay Content? | `ContextBar` mục **Dữ liệu** + `data-data-type` | `DATA_TYPE` |
| 5 | Intimate / Internal / External? | `ContextBar` mục **Diễn ngôn** + `data-discourse-kind` | `DISCOURSE_SCOPES` |
| 6 | Tôi có quyền gì? | `ContextBar` mục **Truy cập** + `data-access` | `ACCESS` |
| 7 | Nếu dữ liệu chưa có, tại sao? | State system 9 trạng thái, phân biệt EMPTY vs BACKEND_DEPENDENCY | `states.js` |
| 8 | Thiếu backend capability nào? | Trường `dependency` trong `StatePanel` | `data-state` |

> Nguyên tắc: **câu trả lời phải nằm trong cấu trúc** (attribute, nhãn, vị trí),
> không nằm trong prose. Đây là thay đổi lớn nhất của v0.4.

---

## A. APPLICATION SHELL

Một shell, một ngữ pháp. Không framework song song.

```
┌ gi-region-header ────────────────────────────────────────┐
│  brand · MemberNav/GlobalNav · Breadcrumb                │
├ gi-region-main ──────────────────────────────────────────┤
│  ① ContextBar          ← context identity (step 1)     │
│  ② BackNavigation                                       │
│  ③ <nội dung trang>                                    │
├ gi-region-footer ────────────────────────────────────────┤
│  Footer                                                 │
└──────────────────────────────────────────────────────────┘
```

**Hợp đồng:** `renderShell()` luôn đặt `ContextBar` **trước mọi thứ khác** trong
`main`. Không surface nào được render tiêu đề trước khi người đọc biết mình ở đâu.

**Cấm:** shell admin. `[OPEN QUESTION]` `CAPABILITY_MODEL.md` mô tả 5 actor nhưng chưa
có quyết định UI. Không dựng shell giả.

---

## B. CONTEXT HIERARCHY

Sáu cấp thông tin — mission §3. Mỗi cấp là một `LEVEL` trong `contexts.js`:

| Cấp | Level | Context | Dữ liệu |
|---|---|---|---|
| Application | `application` | Public | content |
| Identity | `identity` | (động trong `/me`) | identity |
| Space | `space` | Member Space, Family Space | identity / space |
| Discourse | `discourse` | MẠCH, Thư gửi Clara | content |
| Genealogy | `genealogy` | Cây phả đồ, Hồ sơ nhân vật | **canonical-genealogy** |
| Content | `content` | (Public shell) | content |

Ranh giới ngữ nghĩa **không đổi** so với Human decision:

```
Clara ≠ MẠCH      MẠCH ≠ Public      Public ≠ Genealogy
Person ≠ Account  Member ≠ Admin     FamilySpace ≠ GenealogyConstruct
```

Mỗi bất biến được *cơ chế hóa*, không chỉ ghi trong tài liệu:

| Bất biến | Cơ chế |
|---|---|
| Clara ≠ MẠCH | `data-discourse-kind` khác nhau (`intimate` vs `internal`) + `ScopeSeparationNote` |
| MẠCH ≠ Public | `data-access` khác nhau (`authenticated` vs `public`) |
| Public ≠ Genealogy | Public không có `data-level="genealogy"`; `/me/tree` member-only |
| Person ≠ Account | Hai `[data-identity]` riêng, có lead text phân biệt |
| Member ≠ Admin | Member = `space`; `admin` không có UI nào dùng |
| FamilySpace ≠ GenealogyConstruct | `spaces.js` liệt kê 4 khái niệm khác nhau |
---

## C. NAVIGATION CONTRACT

Mỗi route phải trả lời 6 câu. Đây là bảng contract:

| Route | Parent | Context | Đi được tới | Auth | Data dependency | Unavailable state |
|---|---|---|---|---|---|---|
| `/` | — | public | `/login` | none | content (chưa có) | `OPEN_QUESTION` |
| `/login` | `/` | public | `/me` | none | `/api/member/login` | `ERROR` khi sai |
| `/me` | — | member | mach, clara, tree, spaces | `requireAccount` | profile + genealogy + media | `BACKEND_DEPENDENCY` (IdentityMapping) |
| `/me/mach` | `/me` | editorial / `mach` | clara, `/me` | `requireAccount` | `/api/mach.json` (**không phục vụ corpus**) | `BACKEND_DEPENDENCY` |
| `/me/clara` | `/me` | editorial / `clara` | mach, `/me` | `requireAccount` | `/api/mach.json` (**không phục vụ corpus**) | `BACKEND_DEPENDENCY` |
| `/me/tree` | `/me` | genealogy | `/me` | `requireAccount` | legacy SPA | `LEGACY` |
| `/me/tree/person/:id` | `/me/tree` | genealogy | tree, `/me` | `requireAccount` | `/api/genealogy.json` | `LEGACY` + `EMPTY` |
| `/me/family-spaces` | `/me` | member | `/me` | `requireAccount` | **không có** | `BACKEND_DEPENDENCY` |
| `/me/change-password` | `/me` | member | — | `requireAccount` | `/api/member/...` | `ERROR` |
| `/logout` | `/me` | member | `/` | session | — | — |

**Back navigation:** `hierarchy` khi có parent; `history` chỉ khi không có parent.
Không trộn hai hành vi.

**Cấm navigation imply quan hệ chưa được quyết.** Cụ thể:
- Không link nào từ Public trỏ tới MẠCH/Clara/genealogy.
- Không cây nào hiển thị MẠCH bên cạnh Clara như hai mục cùng cấp của "ấn phẩm".
- `FamilySpace` không nằm dưới Cây phả đồ trong breadcrumb.
- `/me/tree` breadcrumb là `Không gian của tôi → Cây phả đồ`, không phải nhánh nào của MẠCH.

---

## D. PAGE SKELETON

Bảy bước, **cùng thứ tự trên mọi surface** (mission §5):

| # | Bước | Component | Bắt buộc? |
|---|---|---|---|
| 1 | Context identity | `ContextBar` (trong shell) | ✅ luôn |
| 2 | Page title | `PageHeader` → đúng 1 `<h1>` | ✅ luôn |
| 3 | Scope explanation | `ScopeMasthead` / subtitle | khi scope cần nói |
| 4 | Primary content | `Section` + `Region` | ✅ |
| 5 | State | `StatePanel` | khi không có dữ liệu |
| 6 | Actions | `gi-btn` | tùy |
| 7 | Navigation | `BackNavigation`, `DiscourseEntry` | ✅ |

**Quy tắc đã sửa ở v0.4:** `/me/mach` và `/me/clara` **không còn tự render `<h1>`
riêng**. Trước v0.4 chúng dùng `ScopeMasthead` với `<h1>` riêng → **hai ngữ pháp trang**
trong cùng một sản phẩm. Nay mọi surface dùng `PageHeader`; khác biệt giọng đọc (Clara
nghiêng như thư, MẠCH như biên tập) được giữ qua `variant`, không phải qua một
grammar thứ hai.

> WHAT/WHERE/WHY/IMPACT rõ ràng nhất của v0.4: WHAT = hai page grammar ·
> WHERE = `editorial.js ScopeMasthead` vs `components.js PageHeader` · WHY = tách
> surface thay vì tách nội dung · IMPACT = người đọc không có "tiêu đề trang" thống
> nhất để dựa vào.

---

## E. STATE SYSTEM

Chín trạng thái. Mỗi cái **phải nhìn khác nhau**, có title, có giải thích một câu,
không fake data, không trông như nội dung thật.

| State | `data-state` | Nghĩa | Visual |
|---|---|---|---|
| LOADING | `loading` | đang tải | progress bar, `role="status"` |
| EMPTY | `empty` | đã hỏi, thật sự không có | nền sunken, viền đặc |
| NOT_AVAILABLE | `not-available` | có bề mặt, chưa có chức năng | viền đứt |
| NOT_AUTHENTICATED | `not-authenticated` | cần đăng nhập | nền cảnh báo |
| NOT_AUTHORIZED | `not-authorized` | không có quyền | nền cảnh báo, tiêu đề đỏ nâu |
| ERROR | `error` | lỗi hệ thống | nền nguy hiểm, `role="alert"` |
| LEGACY | `legacy` | bề mặt chuyển tiếp | viền chấm, thanh trái xám |
| OPEN_QUESTION | `open-question` | chưa ai quyết | viền đứt, thanh trái vàng |
---

## F. IDENTITY SEMANTICS

`[CURRENT HUMAN DECISION]` Account ≠ Person.

`/me` render hai khối **riêng biệt**, mỗi khối có một câu dẫn dắt:

```text
[data-identity="account"]  "Bạn đang đăng nhập bằng tài khoản:"  + tài khoản
                          "Tài khoản KHÔNG phải là một người trong gia phả."
[data-identity="person"]   "Bạn đại diện cho nhân vật này trong gia phả:" + PersonCard
```

- Khối account có viền trái **xám**; khối person có viền trái **heritage đỏ**. Phân
  biệt thấy được trước khi đọc chữ.
- Person page (`/me/tree/person/:id`) **không** render bất kứ nội dung account nào.
- Không có trang nào hiển thị Person như một bản ghi của Account.
- Không có nơi nào gộp hai khối vào một danh sách chung.

---

## G. CONTENT / DISCOURSE SEMANTICS

`[CURRENT HUMAN DECISION]` ba scope, không gộp.

| | Thư gửi Clara | MẠCH | Public |
|---|---|---|---|
| `data-discourse` | `clara` | `mach` | `public` |
| `data-discourse-kind` | `intimate` | `internal` | `external` |
| Nhãn | Thư gửi Clara | MẠCH | Tiếng nói của gia tộc |
| Giọng đọc | thư (nghiêng) | biên tập | thể chế |
| Truy cập | member | member | public |

**Cơ chế chống gộp (nguyên tắc, không chỉ tài liệu):**

1. `ScopeMasthead` bắt buộc nhận `scope`; không có scope hợp lệ → `null`.
2. `partitionByScope()` tách theo series; **bản ghi không xác định được phạm vi thì
   không được gán vào MẠCH** — hiển thị riêng kèm thông báo. Fallback "MẠCH" chính là
   lỗi ngữ nghĩa Human đã sửa.
3. `ScopeSeparationNote()` nói thẳng quan hệ: Clara *không phải chuyên mục MẠCH*;
   MẠCH *không phải tạp chí công khai*.
4. Không tồn tại view "tất cả nội dung" cho MẠCH + Clara.

> **Bài học ghi lại từ chính mission này (v0.4):** khi viết lại câu chữ cho trạng
> thái OPEN_QUESTION trên Public, có lần đã vô tình viết lại tên "MẠCH" vào bề mặt
> công khai. QA bắt được ngay. Bất kỳ câu chữ nào trên Public kể lại cấu trúc nội
> bộ đều là một rò rỉ phạm vi.

---

## H. RESPONSIVE CONTRACT

Giữ nguyên 4 bề rộng đã test: **375 / 768 / 1024 / 1440**.

| Bề rộng | Hợp đồng |
|---|---|
| ≤768 | Nav thành dải cuộn ngang, `min-width: 0` bắt buộc |
| >1024 | Nav wrap, container `--layout-content` |
| 1440 | Container giữ trần, không giãn vô hạn |
| Mọi | `scrollWidth == innerWidth` (không tràn ngang) |

**Không claim** responsive ngoài 4 bề rộng này. Đó là giới hạn của việc đo, không
phải khẳng định về mọi thiết bị.

---

## I. ACCESSIBILITY STATUS

| Hạng mục | Trạng thái | Cơ sở |
|---|---|---|
| 1 `<h1>` mỗi trang | ✅ VERIFIED | đo bằng browser QA |
| Landmark (`main`, `nav`, `section`) | ✅ VERIFIED (source) | shell thống nhất |
| `aria-label` cho nav | ✅ VERIFIED (source) | phân biệt global/member |
| `aria-current="page"` | ✅ VERIFIED (source) | breadcrumb + nav |
| Live region / `role="alert"` | ✅ VERIFIED (source) | LOADING/ERROR |
| `.gi-visually-hidden` cho heading phụ | ✅ v0.4 thêm | context bar không làm nhiễu outline |
| Focus visible | ✅ VERIFIED (source) | không bỏ outline |
| **Tương phản WCAG** | ⚠️ **NOT VERIFIED** | chưa đo bằng công cụ |
| **Screen reader** | ⚠️ **NOT VERIFIED** | không có máy đọc màn hình |
| **Keyboard traversal end-to-end** | ⚠️ **NOT VERIFIED** | chưa chạy |

> Mission §9: **không claim WCAG PASS.** Ba dòng trên là NOT VERIFIED, không phải PASS.

---

## J. EXPLICITLY UNRESOLVED

Những gì UI **không** được tự quyết:

| # | Vấn đề | Ảnh hưởng UI | Ai quyết |
|---|---|---|---|
| 1 | Nội dung Public là gì | `/` chỉ có khung + `OPEN_QUESTION` | Human/Architecture |
| 2 | Clara/MẠCH tách bảng hay chung bảng | quyết định URL + API, không phải ngược lại | Architecture |
| 3 | Có admin console không | `UX_CONTEXT.ADMIN` khai báo nhưng **không có UI** | Human |
| 4 | IA cuối cùng Cây phả đồ | `/me/tree` + `/me/tree/person/:id` còn LEGACY | Architecture |
| 5 | Mô hình visibility có enforce không | `data-access` chỉ mô tả **route contract**, không phải quyền nội dung | Architecture |
| 6 | Typography Playfair/Inter | vẫn `[PROPOSAL]`, cần ship font | Human |
| 7 | Có admin ≠ có RBAC | UI **không** có RBAC matrix nào | Human |

> Điểm 5 quan trọng: `ACCESS.AUTHENTICATED` nghĩa là "route này yêu cầu đăng nhập",
> **không** nghĩa là "bạn được thấy nội dung này vì bạn có quyền". Không có mô hình
> phân quyền nội dung, và UI không giả vờ có.

---

## K. ĐIỀU UI KHÔNG ĐƯỢC LÀM (ràng buộc vĩnh viễn)

1. Không phát minh concept không có trong Human decision / Architecture.
2. Không gộp Clara / MẠCH / Public.
3. Không biến genealogy thành nội dung công khai.
4. Không trộn Account và Person.
5. Không fake dữ liệu để lấp trạng thái rỗng.
6. Không tạo placeholder asset.
7. Không claim accessibility/responsive chưa đo.
8. Không đổi palette / typography / spacing khi không có lỗi.
| BACKEND_DEPENDENCY | `backend-dependency` | thiếu khả năng backend | viền đứt + dòng `dependency` |

**Phân biệt quan trọng nhất — EMPTY vs BACKEND_DEPENDENCY:**

| | EMPTY | BACKEND_DEPENDENCY |
|---|---|---|
| Nghĩa | Hệ thống đã trả lời: không có gì | Chưa có API để hỏi |
| Hiện ở đâu | zone con trong `/me`, `/me/tree/person/:id` | `/me/mach`, `/me/clara`, `/me/family-spaces` |
| Có dòng dependency? | không | **có**, ghi rõ thiếu gì |

`NotAvailableState` là **SYSTEM STATE** (mission §5), không phải lỗi UI tạm thời: nó
không tự biến mất, và nói đúng thứ đang thiếu.