# GIATỘC BRAND GOVERNANCE SYSTEM v0.1
*(The Canonical Design Authority for giatoctrantrongthu.com)*

## 1. Brand Governance Specification & Foundation
Hệ thống này đóng vai trò là "Luật" thiết kế tối cao. Mọi implementation của Giatộc phải tuân thủ nghiêm ngặt các quy tắc dưới đây. 

### Brand Foundation
- **Bản sắc (Brand Identity):** Giatộc không phải là một SaaS (Software as a Service) hay một trang mạng xã hội. Giatộc là một **Thiết chế Văn hóa / Lưu trữ (Cultural/Family Institution)**. 
- **Thiết kế (Design Philosophy):** Kế thừa sự trang nghiêm, tĩnh lặng, và trường tồn. Các khoảng trắng (Whitespace) và nghệ thuật chữ (Typography) đóng vai trò dẫn dắt, thay vì các khối hộp (Cards) hay hiệu ứng (Shadows/Gradients).

---

## 2. Brand Governance Gap Analysis
Phân tích khoảng trống giữa Quyết định của Human và Code thực tế.

| Domain | Human-defined (Canonical) | Governance Gap (Missing) | Agy Proposal (To fill gap) |
|---|---|---|---|
| **Typography** | Font Serif (Times New Roman) | Scale (Heading/Body size), Line-height | `[PROPOSAL]` Xem Mục 3 |
| **Spacing/Grid** | Chưa có | Toàn bộ hệ thống khoảng trắng, max-width | `[PROPOSAL]` Xem Mục 3 |
| **Color** | Chưa duyệt chính thức | Semantic Colors (Background, Text, Border) | `[PROPOSAL]` Xem Mục 3 |
| **Geometry** | Radius = 0 (Từ bản D06) | Shadows, Borders | `[PROPOSAL]` Xem Mục 3 |
| **Component** | Chưa có | Component Grammar (Buttons, Cards, Headers) | `[PROPOSAL]` Xem Mục 4 |
| **Surface** | 5 Registers (Public, MẠCH...) | Visual rules cho từng Register | `[PROPOSAL]` Xem Mục 5 |

---

## 3. Design Token Specification `[PROPOSAL — HUMAN APPROVAL REQUIRED]`

### 3.1. Typography
- **Primary Typeface:** `Times New Roman, Times, serif`.
- **Scale (Desktop):**
  - `--type-display`: 3.5rem (56px) / 1.1 / W:400 (Dùng cho Tên Gia Tộc)
  - `--type-h1`: 2.5rem (40px) / 1.2 / W:400 (Dùng cho Tiêu đề trang)
  - `--type-h2`: 1.75rem (28px) / 1.3 / W:700 (Dùng cho Mục lớn)
  - `--type-h3`: 1.25rem (20px) / 1.4 / W:700
  - `--type-body`: 1.125rem (18px) / 1.6 / W:400
  - `--type-meta`: 0.875rem (14px) / 1.5 / W:400

### 3.2. Color (Institutional Palette)
- **Brand Primary:** `#881337` (Đỏ Sơn Mài)
- **Brand Accent:** `#B45309` (Hoàng Kim)
- **Surface Background:** `#F6F4F0` (Giấy ngà cổ - cho Editorial), `#FFFFFF` (Trắng - cho Data/Member Space)
- **Text Primary (Ink):** `#1A1A1A` (Tuyệt đối không dùng #000000)
- **Border:** `#E3E0D8` (Nét mảnh, tinh tế)

### 3.3. Spacing & Layout Grid
- **Base unit:** `4px`
- **Scale:** `8px, 16px, 24px, 32px, 48px, 64px, 96px, 128px`
- **Grid:** Max-width Content: `68ch` (Tương đương khoảng 700px cho bài đọc). Max-width Container: `1200px`. Padding mobile: `16px`.

### 3.4. Geometry
- **Border-radius:** `0px` (Flat & Sharp). Cấm dùng bo góc.
- **Shadows:** Cấm dùng box-shadow đổ bóng nổi khối (SaaS style). Có thể dùng Elevation bằng border mảnh 1px.

---

## 4. Component Governance `[PROPOSAL — HUMAN APPROVAL REQUIRED]`
Mỗi shared component chỉ được có MỘT visual grammar.

- **Buttons (CTA):** Viền mảnh 1px (Ghost button) hoặc nền Đỏ Sơn Mài chữ trắng (Solid). Cấm tạo outline đỏ như Alert Box.
- **Cards:** Cấm dùng border bo góc, cấm đổ bóng. Thẻ nội dung chỉ phân chia bằng khoảng trắng hoặc gạch chân (divider line).
- **PageHeader:** Chỉ chứa H1 (Serif) và 1 dòng Subtitle. Khoảng trắng dưới Header phải lớn (ít nhất 64px) để tạo sự tĩnh lặng.
- **StatePanel (Empty State):** Không dùng viền nét đứt (Dashed). Sử dụng chữ `--type-meta` căn giữa, màu Mực Phai (Muted).

---

## 5. Surface Register Specification `[PROPOSAL — HUMAN APPROVAL REQUIRED]`
Toàn bộ website chia sẻ chung Token (Font Serif, Flat Radius), nhưng tuỳ chỉnh (Register) theo không gian:

1. **PUBLIC (External Voice):**
   - *Grammar:* Rộng rãi, tĩnh lặng, căn giữa (Centered alignment), nhiều khoảng trắng (96px padding).
   - *Tone:* Institutional / Uy nghiêm.
2. **MẠCH (Internal Discourse):**
   - *Grammar:* Cấu trúc cột báo (Columnar). Text max-width `68ch`. Background giấy ngà (`#F6F4F0`).
   - *Tone:* Editorial / Trí thức.
3. **CLARA (Intimate Discourse):**
   - *Grammar:* Tương tự MẠCH nhưng Header thiên về định dạng thư tín (Kính gửi, Ngày tháng).
   - *Tone:* Personal / Thân mật.
4. **GENEALOGY (Canonical Data):**
   - *Grammar:* Dense (Dày đặc). Ưu tiên dùng Table hoặc Grid lưới mảnh. Background Trắng tinh để rõ ràng.
   - *Tone:* Archival / Khoa học.
5. **MEMBER SPACE (Private Participation):**
   - *Grammar:* Căn lề trái, cấu trúc Menu điều hướng rõ ràng, ưu tiên tính công năng (Domestic/Dashboard nhưng không dùng bo góc).

---

## 6. Anti-Pattern Specification
Cấm tuyệt đối trên GIATỘC:
- Cấm dùng **Sans-serif font** cho phần Body text. (Phá vỡ Brand Identity).
- Cấm dùng **Dashed borders (Viền đứt)** cho Empty state. (Tạo cảm giác unfinished app).
- Cấm **ContextBar** kỹ thuật rò rỉ ra Public Home. (Làm hỏng cảm giác Institutional).
- Cấm **Rounded Corners (Bo góc)** và **Drop Shadows**. (Chống "SaaS-ification").

---

## 7. Brand → Code Traceability Matrix
Kiểm tra chéo với bộ UI vNEXT hiện hành (`src/css/foundation/`):

| Rule | Token/Implementation | Page/Surface | Status |
|---|---|---|---|
| Font Serif cho toàn bộ Text | `tokens.css` dùng `--font-text-active: sans-serif` | Public, Member | **CONFLICTING** |
| Không rò rỉ Kỹ thuật ra Public | `ContextBar` component hiển thị ở `/` | Public Home | **CONFLICTING** |
| Bỏ nét đứt (Dashed) Empty | `states.css` (.gi-state) dùng dashed | Public Home | **CONFLICTING** |
| Radius = 0 | `tokens.css` định nghĩa radius 2px, 4px | Shared Components | **CONFLICTING** |

=> *Kết luận: Code (UI vNEXT) đang vi phạm nghiêm trọng Brand Governance.*

---

## 8. Cline Implementation Governance (Binding Contract)

Đây là Hợp đồng thực thi (Implementation Contract) ràng buộc Agent `Cline`:

1. **CLINE IS AN IMPLEMENTATION AGENT, NOT A BRAND AUTHORITY.**
2. Cline **PHẢI** tuân thủ tuyệt đối các Brand Tokens được Human phê duyệt (Mục 3).
3. Cline **PHẢI** xóa bỏ bộ token rác/conflicting trong `foundation.css` và kế thừa từ `/brand/generated/brand.css`.
4. Cline **KHÔNG ĐƯỢC** tự phát minh Font, Color, Spacing, hay Geometry mới ngoài Brand Governance.
5. Cline **KHÔNG ĐƯỢC** tự ý ghi đè Token ở cấp độ Trang (Page-level).
6. Khi gặp Design Decision chưa có trong Governance: Cline **PHẢI DỪNG LẠI (STOP)**, báo cáo Governance Gap, và yêu cầu Quyết định. Không tự suy diễn.

---

## 9. HUMAN APPROVAL REQUIRED

Các quyết định sau đang ở trạng thái `[PROPOSAL]` và CẦN HUMAN PHÊ DUYỆT (Approve) hoặc BÁC BỎ (Reject) để trở thành `[CANONICAL]`:

1. **Typography Scale:** Kích thước H1, Body, Meta (Có đồng ý dùng tỷ lệ lớn hơn để tạo phong thái Institutional không?) (Mục 3.1)
2. **Spacing / Layout:** Đồng ý dùng Grid 68ch cho bài đọc và Spacing scale cơ bản 4px không? (Mục 3.3)
3. **Geometry:** Xác nhận Radius = 0 (Tuyệt đối không bo góc) và Không Drop Shadow toàn hệ thống? (Mục 3.4)
4. **Surface Registers:** Phê duyệt 5 ngữ điệu giao diện như đã định nghĩa ở Mục 5?

*Lưu ý: Cline chỉ được phép code sau khi Human đã Resolve các Proposal này.*
