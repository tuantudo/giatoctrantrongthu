# GIATỘC — COMPONENT INVENTORY vNEXT

*Mission: GIATỘC UI / PRODUCT EXPERIENCE v0.3*
*Thừa kế `GIATOC_COMPONENT_INVENTORY_v0.2.md` — tài liệu đó vẫn đúng cho các
component chưa đổi. Tài liệu này chỉ ghi **delta**.*

---

## 1. TỔNG QUAN

| Nhóm | v0.2 | vNEXT | Ghi chú |
|---|---|---|---|
| Module JS (`src/js/ui/`) | 14 | **21** | +7 file mới |
| Entry (`boot-*.js`) | 2 | **5** | +3 boot |
| Lớp CSS | 4 + entry | 4 + entry | Không thêm file, chỉ bổ sung khối |
| Host HTML | 3 | **6** | +3 host |

---

## 2. MODULE MỚI

| File | Trách nhiệm | Phụ thuộc |
|---|---|---|
| `contexts.js` | Product Model → UI context. Khai báo `DISCOURSE`, `DISCOURSE_SCOPES`, `UX_CONTEXT`, `SOT_NOTE`; `classifyContent()` | — |
| `editorial.js` | `ScopeMasthead`, `EditorialList`, `EditorialItem`, `ArticleMeta`, `ScopeSeparationNote` | `dom.js`, `contexts.js` |
| `discourse.js` | Controller chung cho 2 trang MẠCH/Clara; `partitionByScope()` tách Clara / MẠCH / unattributed | `states.js`, `editorial.js`, `data.js`, `contexts.js` |
| `public-home.js` | Public shell P1 — identity + ranh giới phạm vi, **không** invent taxonomy | `components.js`, `dom.js` |
| `spaces.js` | Placeholder Family Space + phân biệt 4 khái niệm | `components.js`, `states.js` |
| `boot-public.js` | Entry `/` | `shell.js`, `public-home.js` |
| `boot-discourse.js` | Entry `/me/mach` + `/me/clara`; scope lấy từ registry, **không** từ tên file | `shell.js`, `discourse.js` |
| `boot-spaces.js` | Entry `/me/family-spaces` | `shell.js`, `spaces.js` |

---

## 3. MODULE ĐÃ EVOLVE

| File | Delta |
|---|---|
| `navigation.js` | Route registry phẳng, mỗi route có `context` + `discourse`; thêm `RETIRED_PUBLIC_ROUTES`; `resolveContext()` trả thêm `context`/`discourse`; breadcrumb dùng "Không gian của tôi" |
| `shell.js` | `PUBLIC_NAV` rút từ 5 → 2 mục; `MEMBER_NAV` phẳng 8 mục; bỏ "Ấn phẩm MẠCH"; `navItemsFor()` so khớp prefix |
| `components.js` | + `DiscourseEntry` |
| `states.js` | + `NotAvailableState` |
| `dashboard.js` | Tách Account/Person; + zone "Các không gian nội bộ"; zone MẠCH chỉ lọc MẠCH scope; + ghi chú SoT; "Bảng điều khiển" → "Không gian của tôi"; zone MẠCH cũ → zone Family Space |
| `tokens.js` | Sửa claim typography switch vô hiệu (giờ có CSS selector thật) |

---

## 4. COMPONENT MỚI — CHI TIẾT

### 4.1 `NotAvailableState` — `states.js`

Phân biệt có chủ đích với `EmptyState`:

| State | Nghĩa |
|---|---|
| `Empty` | Đã truy vấn, thật sự không có gì |
| `NotAvailable` | Bề mặt tồn tại về kiến trúc, **backend chưa có chức năng** |

Render `dependency` (BACKEND DEPENDENCY) và `nextStep` riêng. Không bao giờ dùng
để bày nội dung giả.

### 4.2 `ScopeMasthead` — `editorial.js`

Bắt buộc nhận `scope`. Không có `scope` hợp lệ → trả `null`. Đây là cơ chế
**kỹ thuật** ngăn một trang đọc trở thành "trang ấn phẩm" chung cho Clara + MẠCH:
không thể render masthead mà không nói rõ đang ở scope nào.

Biến thể theo `meta.visual`: `letter` (Clara — chữ nghiêng), `editorial` (MẠCH),
`institution` (public).

### 4.3 `EditorialList` / `EditorialItem`

Danh sách đọc theo kiểu chữ, viền trên/dưới, số thứ tự. **Không** lưới card —
mission §25 cấm card quá mức và dashboard clutter. `href` chỉ được set khi có route
thật; hiện chưa có route bài viết nên entry render dạng văn bản, **không** tạo
link chết.

### 4.4 `DiscourseEntry` — `components.js`

Một lối vào = đúng một discourse scope, kèm dòng `nature` mô tả bản chất. Có
`data-scope` để kiểm chứng bằng máy. Ở `/me` dùng 3 entry: MẠCH, Thư gửi Clara,
Cây phả đồ — riêng biệt, không có "xem tất cả".

### 4.5 `classifyContent()` / `partitionByScope()` — `contexts.js`, `discourse.js`

Phân loại theo `seriesIds`/`seriesSlug`. Trả `null` khi không xác định được.

> **Đây là `[BACKEND DEPENDENCY]`, không phải schema.** Map `SERIES_SCOPE_HINTS`
> dựa trên `server/data/mach.json` (`thu-gui-clara`, `issue-01`) — tức dữ liệu đang
> tồn tại. Nhưng nguồn chân lý phải nằm ở tầng dữ liệu (CONSOLIDATION §5 Open
> Question 1). Map này tường minh, đảo ngược được, có thể gỡ trong một commit.

---

## 5. HOST HTML MỚI

| File | Route | Boot |
|---|---|---|
| `server/member_mach.html` | `/me/mach` | `boot-discourse.js` |
| `server/member_clara.html` | `/me/clara` | `boot-discourse.js` |
| `server/member_spaces.html` | `/me/family-spaces` | `boot-spaces.js` |

`index.html` được viết lại thành public shell vNEXT (18 dòng). Bản gốc
**DESIGN-001 được copy** nguyên vẹn sang `prototype/design-001-public/`
(`index.html`, `app-v2.js`, `prototype.css`) — không xóa gì.

---

## 6. HOST HTML ĐÃ EVOLVE

| File | Delta |
|---|---|
| `server/member.js` | +3 route `/me/mach`, `/me/clara`, `/me/family-spaces`, tất cả `requireAccount` |
| `index.html` | Public shell mới; bỏ `app-v2.js`/`prototype.css` khỏi entry `/` |
| `server/member_dashboard.html` | Không đổi (vẫn trỏ `boot-dashboard.js`) |

---

## 7. CSS BỔ SUNG

| File | Khối mới |
|---|---|
| `layout.css` | Reset box model (`box-sizing: border-box`), `text-size-adjust`, `img/svg` responsive, `min-width:0` cho nav |
| `components.css` | `gi-identity__lead`, `gi-discourse-entry`, `gi-masthead*`, `gi-scope-note`, `gi-reading-list`, `gi-article*`, `gi-boundary-list`, `gi-sot-note*` |
| `states.css` | `gi-notavail*` |
| `tokens.css` | `[data-typography="proposed"]` (sửa lỗi switch vô hiệu) |

Không có CSS nào bị xóa hoặc viết lại ở phần v0.2.

---

## 8. KHÔNG CÓ GÌ ĐƯỢC TẠO

Ghi lại để không ai hiểu nhầm "thiếu hụt":

- **Không** tạo admin console / RBAC matrix / badge phân quyền.
- **Không** tạo dữ liệu MẠCH/Clara giả.
- **Không** tạo route bài viết (`/me/mach/bai-viet/:slug`) vì chưa có nguồn thật.
- **Không** tạo placeholder asset (`favicon.ico`, ảnh mẫu).
- **Không** tạo taxonomy nội dung Public.
- **Không** tạo UI cho `FamilySpace` có vẻ hoạt động.