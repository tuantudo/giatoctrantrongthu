# GIATỘC — UI SYSTEM vNEXT

*Mission: GIATỘC UI / PRODUCT EXPERIENCE v0.3 · Thiết kế từ Architecture Handoff*
*Status: IMPLEMENTED (browser-verified where stated) · v0.2 KHÔNG bị reset*

---

## 1. QUY TẮC ĐỌC TÀI LIỆU NÀY

Mọi khẳng định được gắn nhãn nguồn:

| Nhãn | Ý nghĩa |
|---|---|
| `[CURRENT HUMAN DECISION]` | Quyết định sản phẩm đã được Human chốt — UI phải tuân thủ |
| `[ARCHITECTURE CONSTRAINT]` | Ràng buộc kiến trúc đã chốt — UI không được sửa |
| `[IMPLEMENTATION FACT]` | Điều đang đúng trong code/runtime ngay lúc này |
| `[PROPOSAL]` | Ý tưởng của agent — CHƯA duyệt, chưa phải sự thật |
| `[OPEN QUESTION]` | Cố ý chưa quyết — cần Human/Architecture quyết |

Nguồn chuẩn:
`docs/audit/GIATOC_PROJECT_PURPOSE_SOURCE_MAP_AUDIT_v0.1.md` (CANONICAL) ·
`docs/audit/GIATOC_ARCHITECTURE_CONSOLIDATION_v0.1.md` (HANDOFF cho UI)

---

## 2. MÔ HÌNH SẢN PHẨM — ĐIỀU UI PHẢI PHẢN ÁN

`[CURRENT HUMAN DECISION]` (Purpose Audit §5, §7)

```text
                          GIA TỘC
                             │
                     CONTENT / DISCOURSE
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        THƯ GỬI CLARA      MẠCH          PUBLIC
              │              │              │
          intimate       internal        external
          personal       family          family
          discourse      intellectual    voice
                         / cultural
                         discourse
```

Ba scope **tuyệt đối không gộp**. Ràng buộc UI và nơi thực thi:

| Ràng buộc | Nơi thực thi trong code |
|---|---|
| Clara ≠ chuyên mục MẠCH | `contexts.js` (`DISCOURSE.CLARA`), route riêng `/me/clara`, `ScopeSeparationNote()` |
| MẠCH ≠ Public | MẠCH chỉ trong Member Space (`requireAccount`); Public không route tới |
| Public ≠ public genealogy DB | `public-home.js` không render person/tree; `/me/tree` yêu cầu đăng nhập |
| Genealogy ≠ discourse | Cây phả đồ thuộc `UX_CONTEXT.GENEALOGY`, không có `discourse` |
| Account ≠ Person | `dashboard.js` tách `[data-identity="account"]` / `[data-identity="person"]` |
| FamilySpace ≠ GenealogyConstruct | `spaces.js` liệt kê 4 khái niệm khác nhau, không gộp |
| SoT = NAS, không phải SQLite | `contexts.js` `SOT_NOTE`, hiển thị ở `/me` |

---

## 3. v0.2 → vNEXT: EVOLVE, KHÔNG RESET

### 3.1 GIỮ NGUYÊN (không viết lại)

| Hạng mục | Vì sao giữ |
|---|---|
| `tokens/layout/components/states.css` | Token contract v0.2 đúng, chỉ bổ sung |
| Palette / typography hiện hành | Bám đúng site còn sống; không tự thay |
| `dom.js` (safe DOM, không `innerHTML`) | Nguyên tắc an toàn, giữ nguyên |
| `epistemic.js`, `visibility.js` | Badge chỉ hiện khi có dữ liệu thật |
| `Region()` + 3 state nền | Xương sống của mọi zone |
| `/me/tree`, `/me/tree/person/:id` | Theo chỉ đạo mission: giữ route legacy |
| Mọi endpoint, schema, dữ liệu | UI không được tự tạo API |

### 3.2 EVOLVE

| Hạng mục | v0.2 | vNEXT |
|---|---|---|
| Context | 2 (public/member) | 5: `public, member, editorial, genealogy, admin` |
| Discourse | Không có khái niệm | `clara / mach / public` + classifier + guard |
| Nav registry | Còn route hash `/#/mach` | Phẳng, mỗi route mang `context` + `discourse` |
| Nav công khai | MẠCH, Gia phả, Tìm kiếm | Chỉ Trang chủ + Đăng nhập (5 route hash bị **retire**) |
| Nav Member | "Bảng điều khiển", "Ấn phẩm MẠCH" → `/#/mach` | "Không gian của tôi", MẠCH `/me/mach`, Thư gửi Clara `/me/clara` |
| Trạng thái | Loading/Empty/Error | + **`NotAvailableState`** (có kiến trúc, chưa có backend) |
| Đọc | Không có lớp riêng | `editorial.js`: masthead + reading list + scope note |
---

## 4. DESIGN TOKEN (không reset)

### 4.1 Typography — KHÔNG tự thay

| | CURRENT (đang dùng) | PROPOSED (chưa duyệt) |
|---|---|---|
| Display | `'Times New Roman', Times, Georgia, serif` | Playfair Display / Georgia |
| Text | `-apple-system, 'Segoe UI', Helvetica, Arial` | Inter / Segoe UI |
| Nguồn | `[FACT]` `src/css/prototype.css` (site còn sống) | `[PROPOSAL]` |

**Lý do không đổi:** token hiện hành đã khớp site thật; đổi typography là quyết định thương hiệu, thuộc Human Authority. Mission §12 yêu cầu ghi CURRENT/PROPOSED/REASON và chỉ triển khai khi cần — **không cần cho mission này**, nên không đổi.

`[PROPOSAL] Playfair Display + Inter` vẫn là proposal vì **không có file font trong repo**. Kích hoạt chúng mà không ship font là một tuyên bố không kiểm chứng được — đúng thứ hệ thống này tránh. Khi `data-typography="proposed"` được set, nó map sang Georgia/Segoe UI **có sẵn trên máy**: switch thật sự hoạt động, nhưng không hứa hào font không tồn tại.

### 4.2 Color — KHÔNG tự thay

`[FACT]` Heritage `#8c1d1d`, gold `#8c6d1d`, paper `#fdfcf9`/`#fbf6ef`/`#f7f3ea` — lấy từ site hiện hành. Palette v0.1 (`#8B0000`/`#D4AF37`) là đề xuất chưa duyệt, đã bị loại ở v0.2 và giữ nguyên lập trường đó.

### 4.3 Breakpoint

375 / 768 / 1024 / 1440 — khai báo ở `tokens.css` §15 và `tokens.js`, kiểm chứng thực tế bằng QA (mục 7).

---

## 5. COMPONENT MỚI

| Component | File | Vai trò |
|---|---|---|
| `ScopeMasthead` | `editorial.js` | Tuyên bố scope của trang; **bắt buộc** truyền scope → không thể vô tình thành "trang ấn phẩm" chung |
| `EditorialList` / `EditorialItem` | `editorial.js` | Danh sách đọc theo kiểu chữ, **không** card grid |
| `ScopeSeparationNote` | `editorial.js` | Chống nhầm "Clara là series MẠCH" |
| `DiscourseEntry` | `components.js` | Một lối vào = đúng một discourse scope |
| `NotAvailableState` | `states.js` | Surface có kiến trúc, backend chưa có |

---

## 6. NGUYÊN TẮC DỮ LIỆU (mission §15)

- **Không hardcode** person, tên, năm sinh, quan hệ, visibility, epistemic, authority, membership.
- Mọi zone: `LoadingState` → (`data` | `EmptyState` | `ErrorState` | `NotAvailableState`).
- `[FACT]` `epistemic.js` chỉ render badge khi có **cả** claim type **và** source metadata → schema hiện tại không render badge nào. Đúng.
- **Unattributed content không được tự gán vào MẠCH.** `classifyContent()` trả `null` khi không xác định được; UI hiển thị riêng kèm thông báo yêu cầu quyết định schema. Đây là chỗ dễ sai nhất: fallback "MẠCH" chính là lỗi ngữ nghĩa mà Human đã sửa.

---

## 7. XÁC MINH

- Chrome headless qua puppeteer, 4 bề rộng, có journey đã đăng nhập.
- Kiểm tra: HTTP status, ngữ nghĩa hiển thị, tràn ngang, lỗi script, 404.
- Harness: `scripts/ui_vnext_qa.mjs` → `docs/audit/evidence/ui_vnext/`.
- Chi tiết mức độ xác minh: `docs/audit/REPORT_UI_SYSTEM_vNEXT.md`.

---

## 8. GIỚI HẠN ĐÃ BIẾT

- `[IMPLEMENTATION FACT]` `/api/mach.json` hiện trả **1 story placeholder, series/authors rỗng**; corpus MẠCH + Clara thật nằm ở `server/data/mach.json` (seed artifact) mà không endpoint nào phục vụ → 2 trang đọc hiển thị `NotAvailableState`. Đây là **BACKEND DEPENDENCY**, không phải lỗi UI.
- `/favicon.ico` 404 (yêu cầu mặc định của trình duyệt) — không ship placeholder asset.
- Chưa có kiểm thử hồi quy tự động cho `member-app.js` legacy.
| Public `/` | Prototype DESIGN-001 (hash) | Shell identity riêng, taxonomy để `[OPEN QUESTION]` |
| Typography switch | `setTypographyStack()` **vô hiệu** | Đã có CSS selector thật |
| Box model | **Thiếu `box-sizing`** | Đã thêm reset ở `layout.css` |

### 3.3 LỖI v0.2 ĐÃ SỬA (chỉ lộ ra khi browser render thật)

1. **Thiếu `box-sizing: border-box`** — foundation không có rule nào. `.gi-container { width:100% + padding }` làm tràn ngang ở **mọi** bề mặt (375→383, 768→784, 1024→1048).
2. **Nav không co lại được** — flex item thiếu `min-width: 0`; nav 8 mục đẩy `scrollWidth` lên 1099px ở viewport 375px.
3. **`setTypographyStack()` vô hiệu** — chỉ set data attribute, không CSS nào đọc. Mission v0.2 ghi như đã sửa; thực tế không có gì đổi.