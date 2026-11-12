# ĐẶC TẢ CHUẨN MỰC THIẾT KẾ GIA TỘC (DESIGN SYSTEM SPECIFICATION)
## CANONICAL TOKENS, COMPONENT GRAMMAR, INTERACTION STATES & RESPONSIVE BREAKPOINTS
### THIẾT CHẾ VĂN HÓA / LƯU TRỮ GIA TỘC TRẦN TRỌNG THU — V2.0.1 CANONICAL

**Dự án:** Gia Tộc Trần Trọng Thu  
**Cơ quan ban hành:** Agent B (`gt-design-qa` — Senior Product Designer / Design System Specialist)  
**Thẩm quyền phê chuẩn tối cao:** Tuấn — Human Final Authority / Product Owner  
**Trạng thái pháp lý:** BẮT BUỘC TUÂN THỦ (CANONICAL CONTRACT)  
**Phiên bản áp dụng:** V2.0.1 trở đi  

---

## 1. TRIẾT LÝ THIẾT KẾ & BRAND DNA BẤT BIẾN

Website Gia Tộc Trần Trọng Thu đại diện cho một **Thiết chế Văn hóa / Lưu trữ Gia tộc (Cultural/Family Institution)**. Mọi quyết định thiết kế và lập trình giao diện phải tuân thủ nghiêm ngặt 5 nguyên tắc trụ cột:

1. **Khoảng trắng & Nghệ thuật chữ làm chủ đạo (Whitespace & Typography First):**  
   Không gian thể hiện sự tĩnh lặng, trang trọng và trường tồn. Thay vì lấp đầy màn hình bằng các khối hộp (cards) và bảng điều khiển (dashboards) kiểu SaaS, giao diện sử dụng nhịp điệu khoảng trắng lớn (ít nhất 64px–96px giữa các vùng kiến trúc) và nghệ thuật sắp chữ Serif cổ điển.
2. **Mặt phẳng 2D Thuần khiết (2D Planar / Ink on Paper):**  
   Giao diện mô phỏng trang báo in truyền thống và mặt giấy Dó cổ truyền. Nói KHÔNG với hiệu ứng giả lập 3D:
   - **Tuyệt đối cấm bo góc (`border-radius: 0px`):** Mọi cạnh viền đều phẳng, sắc sảo và vuông vức.
   - **Tuyệt đối cấm bóng đổ (`box-shadow: none`):** Không dùng drop-shadow, inner-shadow hay glow effects.
   - **Tuyệt đối cấm kính mờ (`backdrop-filter: none`):** Không dùng blur kiểu iOS / macOS.
   - **Tuyệt đối cấm nhấc nổi khi hover (`transform: translateY` cấm triệt để):** Tương tác hover chỉ thay đổi màu viền (`border-color`) hoặc màu nền (`background-color`), mô phỏng vết mực in đè lên giấy.
3. **The Double Rule & The Single Rule (Ngữ pháp Đường kẻ):**  
   - **Đường kẻ đôi (`3px double var(--color-border-strong)`):** Dùng để phân tách các ranh giới kiến trúc tối thượng (Architecture Boundaries) như Header và Footer.
   - **Đường kẻ đơn (`1px solid var(--color-border-subtle)`):** Dùng để phân chia các khối nội dung bên trong trang.
4. **Tính Chân thực Tư liệu (Authentic Archival Invariant):**  
   Chỉ sử dụng hình ảnh tư liệu lịch sử có thật (185 tư liệu hiện có). Không sử dụng ảnh stock hiện đại, không dùng hình minh họa AI. Tuyệt đối không dùng ảnh bia mộ làm ảnh đại diện chân dung của tiền nhân; nếu chưa có di ảnh, bắt buộc hiển thị Biểu trưng Danh dự Monogram Crest (`HonorificCrest`).
5. **Không gian Thành viên Khép kín & Tôn nghiêm (Restricted by Default):**  
   Chỉ có Trang chủ (`/`) là cổng thông tin công khai tiếp cận con cháu dòng họ. Các phân vùng sâu (`#/gia-pha`, `#/mach`, `#/tu-lieu`, `#/lich`) đều được bảo vệ qua Cổng Xác thực / Đăng nhập (`/login`) với thông điệp tôn nghiêm.

---

## 2. HỆ THỐNG DESIGN TOKENS CHUẨN MỰC (`tokens.css`)

```css
:root {
  /* =========================================================================
     1. TYPOGRAPHY TOKENS
     ========================================================================= */
  --font-display-active: 'Times New Roman', Times, Georgia, serif;
  --font-text-active: 'Times New Roman', Times, Georgia, serif;
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono-active: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

  /* Thang kích thước chữ (Modular Type Scale - 1rem = 16px) */
  --type-display-size: 3.5rem;    --type-display-line: 1.1;  --type-display-weight: 400; /* 56px - Tên Gia Tộc */
  --type-h1-size: 2.5rem;         --type-h1-line: 1.35;      --type-h1-weight: 400; /* 40px - Tiêu đề trang */
  --type-h2-size: 1.75rem;        --type-h2-line: 1.3;       --type-h2-weight: 700; /* 28px - Mục lớn */
  --type-h3-size: 1.25rem;        --type-h3-line: 1.4;       --type-h3-weight: 700; /* 20px - Tiêu đề card/bộ phận */
  --type-body-size: 1.125rem;     --type-body-line: 1.6;     --type-body-weight: 400; /* 18px - Bài đọc văn bản */
  --type-meta-size: 0.875rem;     --type-meta-line: 1.5;     --type-meta-weight: 400; /* 14px - Nhãn phụ, ngày tháng */
  --type-small-size: var(--type-meta-size);
  --type-reading-measure: 68ch; /* Độ dài dòng đọc tối ưu báo in */

  /* =========================================================================
     2. COLOR TOKENS (BẢNG MÀU THIẾT CHẾ VĂN HÓA)
     ========================================================================= */
  /* Đỏ Sơn Mài Bắc Bộ (Brand Primary) */
  --color-brand-heritage: #881337;
  --color-brand-red: var(--color-brand-heritage);
  --color-brand-heritage-strong: #701a2b; /* Dùng cho Hover state */
  --color-brand-heritage-subtle: #f7eaee; /* Dùng cho Nền vinh danh nhạt */

  /* Hoàng Kim / Đồng Cổ (Brand Accent) */
  --color-brand-gold: #b45309;
  --color-brand-gold-subtle: #fbf0e3;

  /* Bề mặt Giấy & Thẻ (Surfaces) */
  --color-surface-page: #f6f4f0;    /* Giấy ngà cổ / Giấy Dó */
  --color-surface-raised: #ffffff;  /* Nền thẻ nổi trắng */
  --color-surface-sunken: #fbf9f6;  /* Nền lún nhạt */
  --color-surface-inverse: #1a1a1a; /* Nền tối footer */
  --color-surface-scrim: rgba(26, 26, 26, 0.55);
  --color-surface-overlay: rgba(18, 16, 15, 0.75); /* Lớp phủ Modal/Drawer */

  /* Mực Than & Văn bản (Ink Palette - Không dùng đen tuyệt đối #000000) */
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #4a4a4a;
  --color-text-muted: #5c5b5a;     /* Đạt WCAG AA 4.6:1 trên nền #f6f4f0 */
  --color-text-on-dark: #f5f2ea;
  --color-text-link: var(--color-brand-heritage);

  /* Đường viền Mộc (Borders - Governance §3.2) */
  --color-border-subtle: #eceadf;
  --color-border-default: #e3e0d8;  /* Nét mảnh tinh tế 1px */
  --color-border-strong: #c9c4b6;   /* Dùng cho The Double Rule 3px double */
  --color-border-focus: var(--color-brand-heritage);

  /* =========================================================================
     3. SPACING & LAYOUT TOKENS (Base 4px)
     ========================================================================= */
  --space-0: 0;
  --space-1: 0.25rem; /* 4px */
  --space-2: 0.5rem;  /* 8px */
  --space-3: 0.75rem; /* 12px */
  --space-4: 1rem;    /* 16px */
  --space-5: 1.25rem; /* 20px */
  --space-6: 1.5rem;  /* 24px */
  --space-8: 2rem;    /* 32px */
  --space-10: 2.5rem; /* 40px */
  --space-12: 3rem;   /* 48px */
  --space-16: 4rem;   /* 64px */
  --space-24: 6rem;   /* 96px  - Khoảng lặng cấu trúc */
  --space-32: 8rem;   /* 128px - Khoảng đệm đại diện */

  /* Độ rộng Khung chứa (Layout Widths) */
  --layout-max: 1200px;
  --layout-wide: 1440px;
  --layout-content: 1040px;
  --layout-narrow: 760px;
  --layout-sidebar: 260px;
  --layout-gutter: var(--space-4);

  /* =========================================================================
     4. GEOMETRY & ELEVATION INVARIANTS (2D PLANAR)
     ========================================================================= */
  --radius-sm: 0;
  --radius-md: 0;
  --radius-lg: 0;
  --radius-pill: 0;

  --elevation-0: none;
  --elevation-1: none;
  --elevation-2: none;
  --elevation-focus-ring: none;

  /* Motion */
  --motion-fast: 120ms;
  --motion-base: 180ms;
  --motion-ease: cubic-bezier(0.2, 0, 0.2, 1);
}
```

---

## 3. DANH MỤC THÀNH PHẦN CHUẨN MỰC (COMPONENT INVENTORY)

### 3.1. Nút Bấm (`.gi-btn`)
Mọi nút bấm đều có chiều cao tiếp xúc tối thiểu 44px trên thiết bị di động, `border-radius: 0;`, không có bóng đổ.

| Phân lớp (Variant) | Bộ chọn CSS | Quy chuẩn Thị giác | Trường hợp Sử dụng |
| :--- | :--- | :--- | :--- |
| **Primary** | `.gi-btn--primary` | Nền đỏ sơn mài `var(--color-brand-heritage)`, chữ trắng, viền 1px đỏ cùng màu. Hover đổi sang `--color-brand-heritage-strong`. | Nút kêu gọi hành động chính (CTA): Bước vào Không gian Gia tộc, Đăng nhập, Gửi đề xuất. |
| **Secondary** | `.gi-btn--secondary` | Nền trong suốt, chữ mực than `var(--color-text-primary)`, viền 1px `var(--color-border-default)`. Hover đổi nền sang `var(--color-surface-sunken)`. | Hành động phụ: Đổi mật khẩu, Mở phả đồ, Đọc toàn văn bài viết. |
| **Subtle** | `.gi-btn--subtle` | Nền trong suốt, viền trong suốt, chữ mực phai `var(--color-text-secondary)`. Hover đổi màu chữ sang đỏ sơn mài. | Nút đóng thông báo, nút quay lại, thao tác tiện ích trong bảng hoặc danh sách. |

### 3.2. Biểu Mẫu & Ô Nhập Liệu (`.gi-form`, `.gi-input`, `.gi-login-*`)
Chuẩn hóa triệt để không dùng inline styles:
- `.gi-form`: Khung biểu mẫu chung, khoảng cách `gap: var(--space-4);`.
- `.gi-field`: Cụm nhãn + ô nhập, `gap: var(--space-1);`.
- `.gi-label`: Font chữ nhỏ 14px, đậm (`font-weight: 600`), màu `--color-text-primary`.
- `.gi-input`: Ô nhập dữ liệu đơn dòng, chiều cao tối thiểu 44px, viền 1px `--color-border-default`, nền `--color-surface-raised`, `border-radius: 0;`. Khi focus: `outline: none; border-color: var(--color-brand-heritage);`.
- `.gi-textarea`: Ô nhập nhiều dòng, padding `var(--space-2) var(--space-3)`, line-height 1.6, `border-radius: 0;`.
- `.gi-select`: Hộp chọn thả xuống có cùng chiều cao 44px và góc vuông phẳng.
- Bộ đăng nhập: `.gi-login`, `.gi-login-form`, `.gi-login-input`, `.gi-login-submit`, `.gi-login-error` (dành riêng cho `/login`).

### 3.3. Thẻ & Khối Trưng Bày (Cards & Plaque)
- `.gi-card`: Nền trắng `var(--color-surface-raised)`, viền đơn 1px `var(--color-border-subtle)`, `border-radius: 0; box-shadow: none;`. Phân tách với nhau bằng khoảng trắng.
- `.gi-personcard`: Thẻ thông tin cá nhân trong phả hệ. Khung avatar hình vuông 48x48px (hoặc 40x40px), có viền mảnh 1px, **tuyệt đối không dùng avatar tròn**.
- `.gi-gallery__card`: Thẻ ảnh tư liệu. Khung ảnh tỷ lệ 1:1, viền mảnh 1px. Khi hover, ảnh zoom nhẹ 1.03 (transition mượt 250ms), thẻ cố định vị trí, không nhảy nổi (no lift).
- `.gi-cr-ancestor-card`: Thẻ vinh danh tiền nhân sáng lập (Cụ Thu & Cụ Bà Út) tại Trang chủ. Kết hợp cùng biểu trưng danh dự `HonorificCrest`.
- `.gi-memory`: Thẻ ký ức truyền khẩu. Viền trái 3px solid `--color-brand-gold`, dòng trích dẫn nguồn in nghiêng phía cuối (`.gi-memory__credit`).

### 3.4. Thanh Điều Hướng & Khung Ứng Dụng (Navigation & App Shell)
- `.gi-region-header`: Cố định trên đỉnh (`position: sticky`), phân cách bằng **The Double Rule (3px double var(--color-border-strong))**.
- `.gi-nav__list`:
  - Desktop: Dàn trải ngang mộc mạc, khoảng cách `var(--space-1)`.
  - Mobile / Tablet (<= 900px): Dải cuộn ngang mượt mà (`flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none;`), không gãy dòng làm phình chiều cao header.
  - Trạng thái trang hiện tại (`[aria-current="page"]`): Gạch chân 2px đỏ sơn mài `border-bottom: 2px solid var(--color-brand-heritage);`.
- `.gi-region-footer`: Chân trang kết thúc với The Double Rule 3px double ở đỉnh, nền đen than `#1a1a1a`, chữ màu kem `#f5f2ea`.
- `.gi-cr-footer`: Bố cục colophon 4 cột mộc mạc tại Trang chủ.

### 3.5. Biểu Ngữ Thông Báo Giờ Nghỉ (`.gi-schedule-banner`)
Kiểm soát 3 trạng thái hoạt động độc lập nhằm bảo tồn phần cứng NAS:
- **State A — Scheduled Rest (`.gi-schedule-banner--resting`):** Khung giờ 01:00 – 09:05 (Giờ Việt Nam). Biểu tượng trăng khuyết 🌙, tiêu đề "GIỜ NGHỈ CỦA KHO LƯU TRỮ", thông báo giảm hao mòn đĩa cứng và hẹn giờ mở lại sau 09:05 sáng.
- **State B — Unexpected Outage (`.gi-schedule-banner--offline`):** Ngoài giờ nghỉ nhưng mất kết nối NAS hoặc lỗi Cloudflare Tunnel (502/503/504/1033). Biểu tượng bánh răng ⚙️, thông báo tạm thời gián đoạn, tự động kết nối lại khi có mạng (không hứa hẹn mốc 09:05 sai sự thật).
- **Quy chuẩn hiển thị:** Nền giấy ánh kim `var(--color-brand-gold-subtle)`, viền 1px vàng đồng, viền trái 4px solid vàng đồng, `border-radius: 0; box-shadow: none;`.

### 3.6. Huy Hiệu & Phân Cấp Nhận Thức (`.gi-badge`, `.gi-epistemic`)
- Thể thức: Chữ nhỏ in hoa, nét mảnh, viền 1px, `border-radius: 0;` (góc vuông phẳng hoàn toàn).
- Phân tầng nhận thức (Epistemic Status):
  - `.gi-epistemic--fact`: Sự thật đã kiểm chứng qua văn bia, gia phả gốc (Nền xanh nhạt, chữ xanh đậm).
  - `.gi-epistemic--inference`: Suy luận suy diễn phả hệ qua liên kết đời (Nền vàng nhạt, chữ vàng nâu).
  - `.gi-epistemic--proposal`: Đề xuất sửa đổi đang chờ duyệt (Nền xám nhạt, chữ xanh than).
  - `.gi-epistemic--evidence-needed`: Cần bổ sung tư liệu xác minh (Nền xanh dương nhạt).

---

## 4. MA TRẬN PHÂN VÙNG BỀ MẶT (SURFACE REGISTERS)

| Bề mặt (Register) | Mục đích & Ngữ cảnh | Bố cục (Layout) | Kiểu chữ (Typography) | Quy tắc Viền & Bề mặt |
| :--- | :--- | :--- | :--- | :--- |
| **PUBLIC** (`/`) | Giới thiệu cội nguồn, kêu gọi con cháu sum vầy, hướng dẫn đăng nhập. | Rộng rãi, khoảng trắng lớn (64–96px), căn giữa, tĩnh lặng. | Display 56px, H1 40px, H2 28px. Serif trang nghiêm. | The Double Rule, phẳng 2D, không ContextBar, không rò rỉ PII. |
| **MẠCH** (`/me/mach`) | Lưu trữ ấn phẩm, bài khảo cứu lịch sử, dòng suy tưởng dòng họ. | Cột báo in (Columnar), giới hạn tối đa `68ch`. Căn lề trái. | Body 18px / 1.6 Serif. Trích dẫn nghiêng viền vàng đồng. | Nền giấy ngà `#f6f4f0`, phân đoạn bằng đường kẻ đơn 1px. |
| **CLARA** (`/me/clara`) | Thư từ thân mật, trao đổi tâm tình nội bộ gia đình. | Thư tín trang trọng, khoảng lề cực rộng, tối giản viền. | Serif chữ nghiêng phong thái thủ bút. | Cực ít viền kẻ, tập trung 100% vào nội dung tâm tư. |
| **GENEALOGY** (`/me/tree`) | Phả đồ, hồ sơ 223 nhân vật, quan hệ huyết thống 5 thế hệ. | Lưới dày đặc (Data-dense), bảng xếp vần, cây Me-Centric. | Chữ nhỏ gọn, nhiều metadata sans-serif 14px. | Viền lưới mộc 1px, avatar vuông 1:1, không bóng đổ. |
| **MEMBER GATE** (`/login`) | Điểm xác thực danh tính bước vào không gian gia đình. | Khung đơn 440px căn giữa màn hình, nhã nhặn, tôn nghiêm. | Title 28px Serif, nhãn 14px sans. | Nền giấy ngà, viền đơn 1px, tích hợp banner giờ nghỉ. |

---

## 5. ĐẶC TẢ RESPONSIVE 4 MỐC ĐỘ PHÂN GIẢI (RESPONSIVE BREAKPOINTS)

```
        375px (Mobile)            768px (Tablet)           1024px (Laptop)          1440px (Desktop)
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│ Single Column        │  │ 2-Col Grid / Nav     │  │ Full Nav / 2-3 Col   │  │ Wide Layout Content  │
│ Gutter: 8px (--sp-2) │  │ Gutter: 12px (--sp-3)│  │ Gutter: 16px (--sp-4)│  │ Gutter: 16px (--sp-4)│
│ Nav: Horizontal Strip│  │ Nav: Scroll Strip    │  │ Sidebar: 260px       │  │ Max-width: 1200px    │
│ Avatar: 68x85 Crest  │  │ Header: Wrap safety  │  │ Content: 1040px      │  │ Wide: 1440px         │
│ Scroll X: NONE       │  │ Scroll X: NONE       │  │ Scroll X: NONE       │  │ Scroll X: NONE       │
└──────────────────────┘  └──────────────────────┘  └──────────────────────┘  └──────────────────────┘
```

### 5.1. Mobile (375px) — Mốc Nghiêm ngặt nhất
- **Gutter:** `--layout-gutter: var(--space-2);` (8px).
- **Tránh tràn ngang:** Ép `min-width: 0` trên mọi flex item và container. Tuyệt đối `scroll_x == 0`.
- **Navigation:** Thanh menu chuyển thành dải cuộn ngang vuốt cảm ứng (`overflow-x: auto; scrollbar-width: none;`).
- **Typography:** Tiêu đề H1/Display tự co vừa màn hình, không bị ngắt từ dị thường (`word-break: break-word; text-wrap: balance;`).
- **Touch Targets:** Nút bấm và ô nhập tối thiểu 44px x 44px.

### 5.2. Tablet (768px)
- **Gutter:** `--layout-gutter: var(--space-3);` (12px).
- **Bố cục lưới:** Các lưới 4 cột (thống kê) chuyển sang 2 cột x 2 hàng; lưới cửa không gian chuyển sang 1 cột.
- **Thanh menu:** Giữ cuộn ngang mượt mà chống tràn header.

### 5.3. Laptop (1024px)
- **Gutter:** `--layout-gutter: var(--space-4);` (16px).
- **Bố cục lưới:** Bắt đầu mở rộng lưới 2 cột cho hồ sơ nhân vật (`360px 1fr`) và lưới phả đồ.
- **Menu:** Mở đầy đủ danh sách liên kết không cần cuộn.

### 5.4. Desktop Lớn (1440px)
- **Max-width:** Cố định container nội dung tại `1200px` (hoặc `1440px` cho chế độ wide) căn giữa trang (`margin-inline: auto`).
- **Độ dài đọc:** Khóa cứng `gi-prose` tại `68ch` để giữ thị giác người đọc không bị mỏi mắt khi quét ngang.

---

## 6. QUY TẮC TƯƠNG TÁC & TIÊU CHUẨN TRUY CẬP (A11Y)

1. **Hiệu ứng Hover:**
   - Dùng chuyển dịch màu mực in: Thay đổi màu viền (`border-color`) từ xám sang đỏ sơn mài `var(--color-brand-heritage)`.
   - CẤM các hiệu ứng nhảy giật 3D (`transform: translateY(-2px)`, `box-shadow`, `scale(1.05)`).
2. **Vòng Viền Focus Tiếp Cận (Focus Visible):**
   - Không được dùng `box-shadow` để làm vòng focus.
   - Bắt buộc dùng `outline: 2px solid var(--color-border-focus); outline-offset: 2px;`.
3. **Độ Tương Phản Màu Sắc (WCAG AA Compliance):**
   - Chữ mực chính `#1a1a1a` trên nền giấy `#f6f4f0`: Tỷ lệ tương phản 13.5:1 (Vượt chuẩn AAA).
   - Chữ phụ `#5c5b5a` trên nền giấy `#f6f4f0`: Tỷ lệ tương phản 4.6:1 (Đạt chuẩn AA).
   - Chữ trắng `#ffffff` trên nền đỏ sơn mài `#881337`: Tỷ lệ tương phản 7.2:1 (Vượt chuẩn AAA).
4. **Cấu trúc Thẻ Ngữ nghĩa & ARIA Landmarks:**
   - Đảm bảo đầy đủ 4 landmark cốt lõi: `<header class="gi-region-header">`, `<nav class="gi-nav">`, `<main class="gi-region-main">`, `<footer class="gi-region-footer">`.
   - 0 hình ảnh thiếu thẻ `alt`.
   - 0 nút bấm hoặc liên kết thiếu nhãn văn bản tiếp cận.

---

## 7. DANH MỤC CẤM KỴ TUYỆT ĐỐI (ANTI-PATTERNS & STRICT PROHIBITIONS)

- ❌ **CẤM BO GÓC:** Bất kỳ class nào mang `border-radius > 0` đều bị coi là lỗi hồi quy (regression) và bị từ chối merge.
- ❌ **CẤM BÓNG ĐỔ:** Mọi thuộc tính `box-shadow` (trừ khi dùng cho chỉ báo focus kỹ thuật có phê duyệt) đều bị cấm.
- ❌ **CẤM HOVER NHẤC NỔI:** Cấm dùng `transform: translateY` để giả vờ nút hay thẻ có độ dày 3D.
- ❌ **CẤM HIỆU ỨNG KÍNH MỜ:** Cấm dùng `backdrop-filter: blur` của giao diện điện thoại hiện đại.
- ❌ **CẤM AVATAR TRÒN:** Avatar tiền nhân hay con cháu bắt buộc là hình vuông/chữ nhật phẳng 1:1, cấm bo tròn 50%.
- ❌ **CẤM FONT SANS CHO BÀI ĐỌC NỘI DUNG:** Toàn bộ phần chữ nội dung phải dùng font Serif trang trọng (`Times New Roman`).
- ❌ **CẤM DÙNG ẢNH BIA MỘ LÀM DI ẢNH CHÂN DUNG:** Bắt buộc dùng `HonorificCrest`.
- ❌ **CẤM TẠO BADGE NHẬN THỨC TỪ MARKUP TĨNH:** Phải có trường dữ liệu thật mới được sinh badge.
