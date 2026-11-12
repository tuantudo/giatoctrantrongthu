# BÁO CÁO THẨM ĐỊNH TOÀN DIỆN DESIGN SYSTEM (BATCH 2A)
## AUDIT HIỆN TRẠNG, LỖI KHÔNG NHẤT QUÁN & DANH MỤC THÀNH PHẦN THỪA
### GIỮ VỮNG BRAND DNA: KHÔNG GIAN GIA TỘC, KÝ ỨC, TRANG TRỌNG, 2D PLANAR, ZERO RADIUS

**Dự án:** Gia Tộc Trần Trọng Thu  
**Phiên bản:** Release v2.0.1 Candidate  
**Cơ quan thực hiện:** Agent B (`gt-design-qa` — Senior Product Designer / Design System Specialist)  
**Tọa độ Git:** Branch `release/v2.0.1`  
**Thời điểm thẩm định:** 2026-11-12  
**Đối tượng thẩm định:** 
- `src/css/foundation/` (`tokens.css`, `layout.css`, `components.css`, `states.css`, `foundation.css`)
- `brand/` (`BRAND_GOVERNANCE_v0.1.md`, `05_DESIGN_LANGUAGE.md`, `brand.css`)
- UI Views: `public-home.js`, `person.js`, `tree.js`, `gallery.js`, `editorial.js`, `server/member.js` (`/login`, `/me/change-password`), `help.js`, `recovery.js`, `events.js`, `contribute.js`, `requests.js`, `server-schedule.js`

---

## 1. TỔNG QUAN & BỐI CẢNH THẨM ĐỊNH (EXECUTIVE SUMMARY)

Trang web Gia Tộc Trần Trọng Thu là một **Thiết chế Văn hóa / Lưu trữ Gia tộc (Cultural/Family Institution)**, không phải một SaaS dashboard hay mạng xã hội. Trọng tâm của không gian là sự tôn nghiêm, tĩnh lặng, và trường tồn. Các khoảng trắng (Whitespace), nghệ thuật chữ (Typography) và bố cục phẳng 2D (2D Planar / Ink on Paper) đóng vai trò dẫn dắt, loại bỏ triệt để các hình khối nổi, góc bo tròn và bóng đổ của giao diện phần mềm hiện đại.

Đợt kiểm toán Batch 2A tiến hành khảo sát pháp y toàn diện mã nguồn CSS và JS giao diện nhằm:
1. Xác định mức độ tuân thủ Design Tokens theo Brand Governance v0.1 đã được Tuấn phê duyệt.
2. Phát hiện các điểm xung đột mã màu (Lacquer Red `#881337` vs Heritage Crimson `#8b261e` vs `#8c1d1d`; Imperial Gold `#b45309` vs `#c59b27`).
3. Quét sạch toàn bộ các tàn tích góc bo tròn (`border-radius > 0`), bóng đổ giả lập 3D (`box-shadow`), hiệu ứng bay nổi khi hover (`transform: translateY`) và kính mờ thời thượng (`backdrop-filter: blur`).
4. Kiểm toán danh mục thành phần (Component Inventory), phát hiện các class bị thiếu hoặc bị phân mảnh cục bộ (như `.gi-input` được gọi ở nhiều view nhưng chưa có trong CSS nền tảng).
5. Đánh giá tính nhất quán trên toàn bộ 7 bề mặt trải nghiệm người dùng.

---

## 2. KỶ LUẬT CHỨNG CỨ 6 TẦNG (EPISTEMIC FINDINGS SUMMARY)

| Tầng Nhận Thức | Tóm tắt Bằng chứng |
| :--- | :--- |
| `[FACT]` | `tokens.css` đã khai báo đúng các token hình học chuẩn: `--radius-sm: 0; --radius-md: 0; --radius-lg: 0; --radius-pill: 0;` và `--elevation-*: none;`. |
| `[FACT]` | `layout.css` đã thiết lập document box-sizing reset `*, *::before, *::after { box-sizing: border-box; }` và reset margin cho `html, body`. |
| `[FACT]` | Đường phân tách kiến trúc lớn (The Double Rule `3px double`) đã được hiện thực hóa ở `.gi-region-header` và `.gi-region-footer`. |
| `[VIOLATION]` | Tìm thấy **47 vị trí** trong `src/css/foundation/components.css` và mã JS UI vẫn cài cắm `border-radius: 2px/3px/4px/6px/10px/12px/20px/50%`. |
| `[VIOLATION]` | Tìm thấy **14 vị trí** sử dụng `box-shadow` đổ bóng nổi khối (trong Lightbox Modal, Calendar App, Hero Plaque, Agenda Card, Feed Card, Keyframe Pulse). |
| `[VIOLATION]` | Tìm thấy **3 vị trí** sử dụng hiệu ứng hover nhấc nổi 3D (`transform: translateY(-1px)` và `translateY(-2px)`). |
| `[VIOLATION]` | Tìm thấy **3 vị trí** sử dụng hiệu ứng kính mờ (`backdrop-filter: blur(2px/4px/6px)`), vi phạm nguyên lý bề mặt giấy phẳng (Dó Paper). |
| `[GAP]` | Class `.gi-input` được sử dụng tại `events.js` (dòng 788, 996), `tree.js` (dòng 233), và `person.js` (dòng 604, 620, 628, 635), nhưng **hoàn toàn chưa được khai báo trong CSS foundation**. |
| `[INCONSISTENCY]` | Tồn tại sự phân mảnh giữa mã đỏ sơn mài `#881337` (brand.css/tokens.css) và `#8b261e` (hardcoded fallback rải rác trong `components.css` và `member.js`). |

---

## 3. THẨM ĐỊNH CHI TIẾT NỀN TẢNG DESIGN TOKENS (`tokens.css`)

### 3.1. Typography Tokens
- **Font Stack Hoạt động (Active):**
  - `--font-display-active: 'Times New Roman', Times, Georgia, serif;` — **[TUÂN THỦ]**
  - `--font-text-active: 'Times New Roman', Times, Georgia, serif;` — **[TUÂN THỦ]** (Serif toàn phần cho đọc nội dung).
  - `--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;` — **[TUÂN THỦ]** (Dùng cho nhãn phụ, ngày tháng, metadata).
  - `--font-mono-active: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;` — **[TUÂN THỦ]**.
- **Thang Tỷ lệ (Type Scale) & Line-height:**
  - `--type-display-size: 3.5rem;` (56px) / line-height: 1.1 / 400.
  - `--type-h1-size: 2.5rem;` (40px) / line-height: 1.35 / 400 (đã nâng từ 1.2 lên 1.35 tránh cắt dấu tiếng Việt).
  - `--type-h2-size: 1.75rem;` (28px) / line-height: 1.3 / 700.
  - `--type-h3-size: 1.25rem;` (20px) / line-height: 1.4 / 700.
  - `--type-body-size: 1.125rem;` (18px) / line-height: 1.6 / 400.
  - `--type-meta-size: 0.875rem;` (14px) / line-height: 1.5 / 400.
  - Độ dài dòng đọc tối ưu: `--type-reading-measure: 68ch;`.
- **Căn lề (Text Alignment):**
  - `editorial.js` đã chuyển sang `text-align: left;` triệt tiêu lỗi giãn từ không đều của `justify` trong tiếng Việt.
- **Tồn tại:** Trong `tokens.css` có khối `[data-typography="proposed"]` khai báo `Playfair Display` và `Inter`, tuy nhiên đây là dạng đề xuất chưa kích hoạt. Để tránh tải font ngoài mạng và giữ tính toàn vẹn, stack `Times New Roman` cục bộ được áp dụng làm chân lý tuyệt đối.

### 3.2. Color Tokens (Bảng màu Thiết chế Gia tộc)
- **Đỏ Thương hiệu (Heritage Crimson / Sơn Mài):**
  - `--color-brand-heritage: #881337;` (Sơn Mài Bắc Bộ, tương phản cao, trang trọng).
  - `--color-brand-heritage-strong: #701a2b;` (Dùng cho hover state).
  - `--color-brand-heritage-subtle: #f7eaee;` (Dùng cho nền tôn vinh nhạt).
  - *Lỗi xung đột:* Nhiều thành phần trong `components.css` (dòng 2865, 2950, 3154, 3206, 3237, 3359, 3373) khai báo fallback cứng `#8b261e` thay vì kế thừa biến `--color-brand-heritage`. Cần chuẩn hóa toàn bộ về token duy nhất.
- **Hoàng Kim / Đồng Cổ (Brand Gold):**
  - `--color-brand-gold: #b45309;` (Sắc đồng cổ ấm áp, dùng cho huy hiệu và đường kẻ điểm xuyết).
  - `--color-brand-gold-subtle: #fbf0e3;` (Nền giấy ánh kim nhạt, dùng cho banner giờ nghỉ).
  - *Lỗi xung đột:* Dòng 4055, 4069, 4118 trong `components.css` xuất hiện mã vàng chói `#c59b27` (vàng kim loại công nghiệp), phá vỡ tông màu trầm ấm của gia tộc.
- **Màu Mực & Văn bản (Ink Palette):**
  - `--color-text-primary: #1a1a1a;` (Mực than nguyên chất, cấm dùng đen tuyền `#000000`).
  - `--color-text-secondary: #4a4a4a;` (Mực phai nhẹ).
  - `--color-text-muted: #5c5b5a;` (Mực mờ, đã nâng độ tương phản đạt WCAG AA 4.6:1 trên nền ngà).
  - `--color-text-on-dark: #f5f2ea;` (Chữ trên nền footer đen than).
  - *Lỗi xung đột:* Một số view inject trực tiếp mã màu bộ Tailwind Stone (`#1c1917`, `#57534e`, `#78716c`, `#44403c`) thay vì dùng token `--color-text-*`.
- **Màu Bề mặt (Surfaces):**
  - `--color-surface-page: #f6f4f0;` (Màu giấy Dó / giấy ngà cổ).
  - `--color-surface-raised: #ffffff;` (Bề mặt thẻ nổi trắng).
  - `--color-surface-sunken: #fbf9f6;` (Nền lún nhạt).
  - `--color-surface-inverse: #1a1a1a;` (Nền footer đảo ngược).
  - *Thiếu hụt:* Chưa có token `--color-surface-overlay` cho lớp phủ modal backdrop, dẫn đến việc modal tự viết `rgba(18, 16, 15, 0.82)` hoặc `rgba(0,0,0,0.55)`.
- **Màu Viền (Borders):**
  - `--color-border-subtle: #eceadf;`
  - `--color-border-default: #e3e0d8;` (Nét mảnh, tinh tế, chuẩn Governance §3.2).
  - `--color-border-strong: #c9c4b6;`

### 3.3. Spacing Tokens & Hệ thống Lưới
- **Đơn vị cơ sở:** `4px`.
- **Thang đo (Index scale):**
  - `--space-1`: `4px` (0.25rem)
  - `--space-2`: `8px` (0.5rem)
  - `--space-3`: `12px` (0.75rem)
  - `--space-4`: `16px` (1rem)
  - `--space-5`: `20px` (1.25rem)
  - `--space-6`: `24px` (1.5rem)
  - `--space-8`: `32px` (2rem)
  - `--space-10`: `40px` (2.5rem)
  - `--space-12`: `48px` (3rem)
  - `--space-16`: `64px` (4rem)
  - `--space-24`: `96px` (6rem) — *Khoảng đệm tĩnh lặng Public*
  - `--space-32`: `128px` (8rem) — *Khoảng đệm đại diện cấu trúc*
- **Độ rộng Container:**
  - Max container: `--layout-max: 1200px;`
  - Wide container: `--layout-wide: 1440px;`
  - Content container: `--layout-content: 1040px;`
  - Narrow container: `--layout-narrow: 760px;`
  - Sidebar: `--layout-sidebar: 260px;`

### 3.4. Geometry & Elevation Invariant (Quy tắc Bất biến)
- **Quy tắc:**
  - `border-radius: 0px` (Flat & Sharp). Cấm dùng bo góc trên mọi thành phần.
  - `box-shadow: none`. Cấm dùng bóng đổ giả lập nổi 3D.
  - Phân tầng không gian hoàn toàn bằng viền đơn (`1px solid`) hoặc viền đôi (`3px double`).

---

## 4. CHI TIẾT CÁC LỖI VI PHẠM BRAND DNA TRONG CODE THỰC TẾ

### 4.1. Danh sách 47 Vị trí Vi phạm Góc Bo Tròn (`border-radius > 0`)

| Tệp tin | Vị trí (Dòng) | Bộ chọn / Phần tử | Giá trị vi phạm | Đánh giá & Rủi ro |
| :--- | :--- | :--- | :--- | :--- |
| `src/css/foundation/components.css` | 2846 | `.gi-gallery__tab` | `border-radius: 4px;` | Vi phạm SaaS bo góc |
| `src/css/foundation/components.css` | 2874 | `.gi-gallery__tab-count` | `border-radius: 10px;` | Viên thuốc (pill) không đúng chuẩn |
| `src/css/foundation/components.css` | 2892 | `.gi-gallery__person-filter-banner` | `border-radius: 0 4px 4px 0;` | Bo góc bất đối xứng |
| `src/css/foundation/components.css` | 2906 | `.gi-gallery__clear-btn` | `border-radius: 4px;` | Bo góc nút bấm |
| `src/css/foundation/components.css` | 2919 | `.gi-gallery__search-box` | `border-radius: 4px;` | Bo góc ô nhập liệu |
| `src/css/foundation/components.css` | 2982 | `.gi-gallery__badge` | `border-radius: 3px;` | Bo góc badge ảnh |
| `src/css/foundation/components.css` | 3037 | `.gi-gallery__tag` | `border-radius: 12px;` | Tag bo tròn mạng xã hội |
| `src/css/foundation/components.css` | 3069 | `.gi-modal-dialog` | `border-radius: 6px;` | Hộp thoại Lightbox bo góc |
| `src/css/foundation/components.css` | 3176 | `.gi-events-header-bar` | `border-radius: 4px;` | Bo góc thanh công cụ lịch |
| `src/css/foundation/components.css` | 3224 | `.gi-memorial-card` | `border-radius: 4px;` | Thẻ ngày giỗ bo góc |
| `src/css/foundation/components.css` | 3251 | `.gi-memorial-date-badge` | `border-radius: 4px;` | Badge ngày tháng bo góc |
| `src/css/foundation/components.css` | 3296 | `.gi-timeline-entry::before` | `border-radius: 50%;` | Điểm timeline hình tròn |
| `src/css/foundation/components.css` | 3308 | `.gi-timeline-card` | `border-radius: 4px;` | Thẻ sự kiện timeline bo góc |
| `src/css/foundation/components.css` | 3359 | `.gi-hero-plaque` | `border-radius: 4px;` | Bảng vinh danh nhân vật bo góc |
| `src/css/foundation/components.css` | 3371 | `.gi-hero-plaque__avatar-wrap`| `border-radius: 2px;` | Khung ảnh chân dung bo góc |
| `src/css/foundation/components.css` | 3420 | `.gi-hero-plaque__role` (badge) | `border-radius: 20px;` | Viên thuốc bo tròn 20px |
| `src/css/foundation/components.css` | 3431 | `.gi-memorial-callout` | `border-radius: 3px;` | Khung ghi chú giỗ bo góc |
| `src/css/foundation/components.css` | 3464 | `.gi-life-timeline` | `border-radius: 4px;` | Khung niên biểu cuộc đời bo góc |
| `src/css/foundation/components.css` | 3511 | `.gi-life-timeline__dot` | `border-radius: 50%;` | Điểm tròn trên niên biểu |
| `src/css/foundation/components.css` | 4030 | `.gi-cr-footer-social-link` | `border-radius: 4px;` | Nút liên kết Facebook bo góc |
| `src/css/foundation/components.css` | 4078 | `.gi-calendar-app` | `border-radius: 6px;` | Khung ứng dụng lịch bo góc |
| `src/css/foundation/components.css` | 4124 | `.gi-cal-view-switch` | `border-radius: 4px;` | Bộ chuyển đổi chế độ xem bo góc |
| `src/css/foundation/components.css` | 4145 | `.gi-cal-chip` | `border-radius: 4px;` | Nút lọc lịch bo góc |
| `src/css/foundation/components.css` | 4335 | `.gi-agenda-date-head` | `border-radius: 0 4px 4px 0;` | Bo góc tab ngày lịch |
| `src/css/foundation/components.css` | 4342 | `.gi-agenda-card` | `border-radius: 4px;` | Thẻ lịch sự kiện bo góc |
| `src/css/foundation/components.css` | 4361 | `.gi-sub-banner` | `border-radius: 6px;` | Banner hướng dẫn đăng ký lịch |
| `src/css/foundation/components.css` | 4397 | `.gi-sub-feed-card` | `border-radius: 6px;` | Thẻ feed đăng ký lịch bo góc |
| `src/css/foundation/components.css` | 4443 | `.gi-cal-modal-box` | `border-radius: 6px;` | Modal chi tiết sự kiện lịch bo góc |
| `src/js/ui/recovery.js` | 72, 93, 114, 135 | Số thứ tự bước 1, 2, 3, 4 | `borderRadius: '50%'` | Huy hiệu số tròn mạng xã hội |
| `src/js/ui/help.js` | 199 | Hộp thông báo thành công | `border-radius: 2px;` | Bo góc inline |
| `src/js/ui/contribute.js` | 232 | Hộp thông báo thành công | `border-radius: 2px;` | Bo góc inline |
| `src/js/ui/letters.js` | 307 | Thẻ hành động thư từ | `borderRadius: '2px'` | Bo góc inline |
| `src/js/ui/requests.js` | 113, 125, 136, 192 | Thẻ trạng thái đề xuất | `borderRadius: '2px'` | Bo góc inline |
| `src/js/ui/events.js` | 727, 737, 757, 789... | Các khối panel sự kiện lịch | `borderRadius: '3px/4px/6px'` | 11 lỗi bo góc rải rác |

### 4.2. Danh sách 14 Vị trí Vi phạm Bóng Đổ Nổi Khối (`box-shadow`)

1. `components.css:3076`: `.gi-modal-dialog { box-shadow: 0 16px 36px rgba(0, 0, 0, 0.25); }` — Bóng đổ nổi khối SaaS.
2. `components.css:3299`: `.gi-timeline-entry::before { box-shadow: 0 0 0 2px var(--color-border-subtle); }` — Vòng halo bóng đổ.
3. `components.css:3365`: `.gi-hero-plaque { box-shadow: 0 1px 3px rgba(0,0,0,0.05); }` — Bóng mờ dưới bảng vinh danh.
4. `components.css:3376`: `.gi-hero-plaque__avatar-wrap { box-shadow: 0 2px 8px rgba(0,0,0,0.08); }` — Bóng nổi chân dung.
5. `components.css:4053-4061`: `@keyframes giHighlightPulse` sử dụng `box-shadow` mở rộng theo bán kính.
6. `components.css:4080`: `.gi-calendar-app { box-shadow: 0 1px 3px rgba(0,0,0,0.03); }` — Bóng viền lịch.
7. `components.css:4234`: `.gi-cal-cell--today { box-shadow: inset 0 0 0 2px var(--color-brand-heritage); }` — Inner shadow.
8. `components.css:4350`: `.gi-agenda-card:hover { box-shadow: 0 2px 6px rgba(0,0,0,0.04); }` — Bóng đổ hover.
9. `components.css:4402`: `.gi-sub-feed-card { box-shadow: 0 1px 3px rgba(0,0,0,0.02); }` — Bóng mờ card.
10. `components.css:4449`: `.gi-cal-modal-box { box-shadow: 0 12px 30px rgba(0,0,0,0.25); }` — Bóng đổ modal lịch.

### 4.3. Các Vị trí Vi phạm Hover Nhấc Nổi (`transform: translateY`)
Theo `brand/05_DESIGN_LANGUAGE.md §4`: "Tuyệt đối không dùng hiệu ứng nổi (Lift) hoặc đổ bóng (Shadow) khi Hover. Sử dụng việc thay đổi màu viền hoặc màu nền một cách dứt khoát, mô phỏng mực in đè lên giấy."
- `components.css:3237`: `.gi-memorial-card:hover { transform: translateY(-2px); }`
- `components.css:3617`: `.gi-cr-hero-btn:hover { transform: translateY(-1px); }`
- `components.css:3908`: `.gi-cr-door-card:hover { transform: translateY(-2px); }`

### 4.4. Các Vị trí Kính Mờ (`backdrop-filter: blur`)
- `components.css:2985`: `.gi-gallery__badge { backdrop-filter: blur(4px); }`
- `components.css:3057`: `.gi-modal-backdrop { backdrop-filter: blur(6px); }`
- `components.css:4433`: `.gi-cal-modal-overlay { backdrop-filter: blur(2px); }`

---

## 5. THẨM ĐỊNH TÍNH NHẤT QUÁN GIỮA CÁC TRANG (CROSS-SURFACE EVALUATION)

| Bề mặt (Surface / Trang) | Hiện trạng Kiến trúc | Đánh giá Tuân thủ Brand DNA | Tồn đọng Cần Chuẩn hóa |
| :--- | :--- | :--- | :--- |
| **Trang chủ (`public-home.js`)** | 5 Section rõ ràng; sử dụng ảnh tư liệu thật (`Haudue-ongThu-baSa.jpg`), biểu trưng `HonorificCrest` tôn nghiêm thay thế ảnh bia mộ Cụ Thu & Cụ Bà Út. | **RẤT TỐT (95%)** | Bỏ `translateY(-1px/-2px)` trên nút Hero và thẻ Door; bỏ `border-radius: 4px` ở nút liên kết Footer. |
| **Hồ sơ nhân vật (`person.js`)** | 6 Tầng cấu trúc tôn ti; hiển thị `MemoryStory` với đường viền vàng đồng; các liên kết quan hệ và ảnh tư liệu đã đưa về `borderRadius: '0'`. | **TỐT (90%)** | Bỏ `border-radius` và `box-shadow` trong class `.gi-hero-plaque`; chuẩn hóa các ô nhập liệu đề xuất sang class `.gi-input`. |
| **Phả đồ (`tree.js`)** | Chế độ kép (Dual-view) hoàn chỉnh: Cây 3 tầng Me-Centric (Bậc Cha Mẹ, Bản Thân/Phối Ngẫu, Hậu Duệ) và Danh mục Lưu trữ Xếp vần Tiếng Việt. | **XUẤT SẮC (98%)** | Ô tìm kiếm dùng class `.gi-input` chưa có trong CSS foundation; cần bổ sung CSS `.gi-input`. |
| **Tư liệu / Kho ảnh (`gallery.js`)** | Danh mục phân 5 loại (`all`, `portrait`, `document`, `grave`, `family`); lưới ảnh 1:1; điều hướng 2 chiều với hồ sơ nhân vật. | **TRUNG BÌNH (75%)** | Còn nhiều lỗi `border-radius: 4px/10px/12px`, modal dùng `backdrop-filter: blur(6px)` và `box-shadow`. |
| **Đọc MẠCH (`editorial.js`)** | Bố cục măng-sét báo in trang trọng; max-width `68ch`; trích dẫn viền vàng đồng chữ nghiêng; căn lề `text-align: left`. | **XUẤT SẮC (98%)** | Tuân thủ tuyệt đối triết lý báo in truyền thống. |
| **Đăng nhập (`/login`) & Đổi MK (`/me/change-password`)** | Khung đăng nhập 440px trên nền giấy ngà `#f6f4f0`, dùng font Serif trang nghiêm, tích hợp banner giờ nghỉ có kiểm soát biên thời gian. | **XUẤT SẮC (98%)** | Đồng bộ triệt để mã màu đỏ `#881337` cho các liên kết và nút bấm. |
| **Trợ giúp (`/help`, `/help/recovery`)** | Văn phong mộc mạc, gần gũi, ấm áp với người lớn tuổi; FAQ rõ ràng; biểu mẫu gửi câu hỏi trực tiếp không bắt đăng nhập. | **TỐT (88%)** | Thay thế 4 huy hiệu số tròn (`borderRadius: '50%'`) trong `recovery.js` thành hình vuông phẳng hoặc chữ số mộc. |

---

## 6. LẬP DANH MỤC & CHUẨN HÓA COMPONENT (COMPONENT INVENTORY AUDIT)

### 6.1. Buttons (`.gi-btn`)
- **Hiện trạng:** Hệ thống có 3 biến thể chính:
  1. `.gi-btn--primary`: Nền đỏ sơn mài `var(--color-action-primary-bg)`, chữ trắng, viền trong suốt hoặc viền đỏ cùng màu.
  2. `.gi-btn--secondary`: Nền trong suốt, chữ mực đậm `var(--color-text-primary)`, viền mảnh 1px `var(--color-border-default)`.
  3. `.gi-btn--subtle` (và `.gi-btn--quiet`): Nền trong suốt, viền trong suốt, chữ màu mực phai `var(--color-text-secondary)`. Hover chuyển màu đỏ sơn mài.
- **Vấn đề:** `.gi-btn--subtle` được dùng ở 20+ vị trí trong code JS nhưng lại được khai báo rời rạc ở nhiều đoạn khác nhau trong `components.css` (dòng 1210, 1351, 1838) thay vì nằm chung trong khối Button chuẩn tại dòng 223–251.

### 6.2. Forms & Inputs (`.gi-form`, `.gi-input`, `.gi-login-*`)
- **Hiện trạng:**
  - Trang đăng nhập sở hữu bộ class chuyên biệt hoàn chỉnh: `.gi-login-body`, `.gi-login`, `.gi-login-eyebrow`, `.gi-login-title`, `.gi-login-line`, `.gi-login-form`, `.gi-login-label`, `.gi-login-input`, `.gi-login-submit`, `.gi-login-error`, `.gi-login-back`.
  - Các trang chức năng bên trong (`tree.js`, `person.js`, `events.js`, `help.js`, `contribute.js`) gọi class `.gi-input` hoặc nhúng inline style tự phát.
- **Kết luận:** Cần bổ sung ngay bộ form chuẩn hóa cấp foundation (`.gi-form`, `.gi-field`, `.gi-label`, `.gi-input`, `.gi-textarea`, `.gi-select`) vào `components.css`. Mọi input phải có chiều cao tối thiểu 44px (đáp ứng touch target mobile) và `border-radius: 0`.

### 6.3. Cards & Plaque
- **Hiện trạng:**
  - `.gi-card`: Thẻ nội dung chuẩn, viền 1px `var(--color-border-subtle)`, nền `var(--color-surface-raised)`, `border-radius: 0; box-shadow: none;`.
  - `.gi-personcard`: Thẻ nhân vật trong phả hệ, avatar vuông (cấm tròn), tên, ngày tháng, mối quan hệ.
  - `.gi-gallery__card`: Thẻ ảnh tỷ lệ 1:1, có viền mảnh, hiệu ứng zoom nhẹ ảnh khi hover mà không nhấc thẻ.
  - `.gi-cr-ancestor-card`: Thẻ tưởng niệm tiền nhân sáng lập ở Trang chủ, kết hợp với Monogram Crest.
  - `.gi-memory`: Thẻ ký ức truyền khẩu, viền trái 3px vàng đồng `--color-brand-gold`, dòng dẫn nguồn in nghiêng.
- **Đánh giá:** Các card đều có ngữ pháp rõ ràng. Cần dọn dẹp các bo góc còn sót trong `.gi-hero-plaque` và `.gi-agenda-card`.

### 6.4. Navigation & App Shell
- **Hiện trạng:**
  - Header: Mang đường kẻ đôi kiến trúc (`3px double var(--color-border-strong)`).
  - Navigation: Danh sách mục điều hướng cuộn ngang mượt mà trên mobile (`overflow-x: auto; flex-wrap: nowrap; scrollbar-width: none;`). Mục active được đánh dấu bằng đường gạch chân 2px đỏ sơn mài `border-bottom: 2px solid var(--color-action-primary-bg)`.
  - Footer: Đóng lại bằng đường kẻ đôi (`3px double`), màu nền đen than `#1a1a1a`, chữ sáng `#f5f2ea`.
- **Đánh giá:** 100% tuân thủ quy chuẩn The Double Rule.

### 6.5. Banners (`.gi-schedule-banner`)
- **Hiện trạng:** Đã hiện thực hóa triệt để 3 trạng thái tại Batch 1:
  - `STATE A — SCHEDULED REST` (01:00 – 09:05): Biểu tượng trăng khuyết 🌙, thông báo bảo tồn phần cứng NAS, hẹn giờ mở lại sau 09:05.
  - `STATE B — UNEXPECTED OUTAGE`: Biểu tượng bánh răng kỹ thuật ⚙️, thông báo gián đoạn mạng không cam kết giờ sai sự thật.
  - `STATE C — AVAILABLE`: Ẩn hoàn toàn.
- **Đánh giá:** Cần đưa các style từ inline JS vào class CSS chuẩn trong `components.css`.

### 6.6. Badges & Tags (`.gi-badge`, `.gi-epistemic`)
- **Hiện trạng:**
  - Thang phân loại nhận thức (Epistemic Vocab): Fact (Sự thật), Inference (Suy luận), Proposal (Đề xuất), Evidence Needed (Cần kiểm chứng).
  - Quy tắc bất biến: Chỉ render khi có dữ liệu thật từ API/CSDL, cấm tạo badge từ markup tĩnh.

---

## 7. ĐỀ XUẤT HÀNH ĐỘNG KHẮC PHỤC (REMEDIATION ACTION PLAN)

1. **Làm sạch CSS Nền tảng (`src/css/foundation/components.css`):**
   - Đưa toàn bộ 47 vị trí `border-radius` về `0`.
   - Xóa bỏ toàn bộ 14 thuộc tính `box-shadow` nổi khối.
   - Xóa bỏ 3 hiệu ứng `transform: translateY` khi hover; thay thế bằng chuyển màu viền `border-color: var(--color-brand-heritage)`.
   - Xóa bỏ `backdrop-filter: blur()`, dùng màu nền phẳng với opacity tĩnh (`rgba(18, 16, 15, 0.75)`).
   - Thêm bộ class form chuẩn hóa `.gi-form`, `.gi-label`, `.gi-input`, `.gi-textarea`, `.gi-select`.
   - Hợp nhất khai báo `.gi-btn--subtle` và `.gi-schedule-banner`.
2. **Làm sạch JS Giao diện:**
   - Thay đổi các huy hiệu số tròn trong `recovery.js` sang hình vuông phẳng (`borderRadius: '0'`).
   - Xóa các `border-radius: 2px` trong các thông báo thành công tại `help.js` và `contribute.js`.
3. **Biên soạn Tài liệu Đặc tả Chuẩn mực:**
   - Hoàn tất tài liệu `docs/design/DESIGN_SYSTEM_SPEC.md` làm kim chỉ nam chính thức cho toàn bộ dự án từ V2.0.1 trở đi.
