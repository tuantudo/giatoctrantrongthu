# GIATỘC GLOBAL DESIGN GRAMMAR AUDIT v0.1

## 1. Executive Summary
Hệ thống thiết kế của GIATỘC hiện tại đang bị chia cắt trầm trọng thành nhiều "Ngữ pháp thiết kế" (Design Dialects) độc lập. Mặc dù Human đã thiết lập một Nguồn Chân Lý (Source of Truth) cho Brand tại `/brand/manifest.json`, nhưng toàn bộ bộ khung UI vNEXT (Sử dụng `foundation.css` cho các trang Public và Member) lại hoàn toàn ngó lơ thư mục này và tự định nghĩa một bộ Design Tokens riêng (Sử dụng Sans-serif thay vì Serif theo yêu cầu của Brand). 

Báo cáo này vạch rõ những điểm gãy đứt về mặt Design System, chỉ ra sự chồng chéo của các bộ CSS (`main.css` vs `foundation.css`), và xây dựng một Implementation Brief chi tiết để Cline hợp nhất toàn bộ giao diện về chung MỘT ngữ pháp duy nhất.

---

## 2. Design System Authority Map
Xác định Source of Truth cho các thành phần thiết kế:

| Domain | Current Authority | Status | Conflicts |
|---|---|---|---|
| **Logo** | `/brand/manifest.json` | CONFIRMED | Không có. UI vNEXT đã dùng đúng logo ngang. |
| **Typography** | `/brand/manifest.json` | CONFIRMED | **CONFLICT NẶNG:** Brand chỉ định `Times New Roman` cho toàn bộ văn bản. Nhưng `src/css/foundation/tokens.css` lại dùng `sans-serif` làm active stack cho text. |
| **Color** | `/brand/manifest.json` | OBSERVED | `main.css` lưu hardcode hex. `tokens.css` dùng palette riêng rẽ. |
| **Spacing & Grid**| `src/css/foundation/tokens.css` | PROPOSED | `/brand` chưa định nghĩa hệ thống khoảng cách. UI vNEXT đang tự tạo rule spacing riêng. |
| **Components** | `src/css/foundation/components.css`| PROPOSED | Xảy ra Component Stacking, chưa có component chuẩn cho dạng Editorial (MẠCH/Clara). |
| **Responsive** | `src/css/foundation/layout.css` | PROPOSED | Mobile bị vỡ do thẻ ContextBar. |

=> **Kết luận:** Authority tối cao là `/brand`, nhưng code thực tế (Implementation) đang chạy theo UI vNEXT (`foundation.css`) và hoàn toàn phớt lờ Authority.

---

## 3. Brand → Code Traceability
Dấu vết triển khai từ Brand System xuống Code:

1. **Brand Rule:** Serif Font (Times New Roman) for all text.
   - **Token:** `tokens.css` đặt `--font-text-active: sans-serif`. => `[CONFLICTING]`
   - **Component:** PageHeader, Prose dùng font sans-serif mặc định của thẻ. => `[NOT IMPLEMENTED]`
2. **Brand Rule:** Primary Color (#881337).
   - **Token:** Không thấy ánh xạ trực tiếp trong `tokens.css`. => `[NOT IMPLEMENTED]`
3. **Brand Rule:** Radius = 0 (Flat).
   - **Token:** Component trong vNEXT có vẻ follow. => `[PARTIALLY IMPLEMENTED]`

---

## 4. Current Design Dialects
Trang web đang nói bằng 3 "ngôn ngữ" (Dialects) khác nhau:

### Dialect 1: The Legacy Prototype (V0)
- **Affected:** Web tĩnh (app-v2.js), các route cũ.
- **Characteristics:** Dùng `main.css` khổng lồ (>5000 lines). Phong cách Editorial / Magazine.
- **Verdict:** Should be SUPERSEDED by vNEXT, nhưng ta cần giữ lại cái "hồn" Editorial của nó.

### Dialect 2: The vNEXT Dashboard (V1 Candidate)
- **Affected:** Trang Public (`/`), toàn bộ Member Space (`/me/*`).
- **Characteristics:** Dùng `foundation.css` + `components.css`. Phong cách SaaS/Dashboard. Dùng thẻ hộp (Card stacking), border nét đứt (Dashed), sans-serif.
- **Verdict:** Đây là xương sống mới, nhưng UI/UX đang bị "App-ify" quá mức. Cần **TRANSFORM** để trở thành Thiết chế Văn hóa (Institutional).

### Dialect 3: The Technical Admin
- **Affected:** Owner Control Surface.
- **Characteristics:** Thô cứng, chẩn đoán (ContextBar).
- **Verdict:** Chỉ giữ cho Admin, cấm rò rỉ ra Public/Member.

---

## 5. Whole-site Component Inventory

| Component | Variants | Used Where | Grammar | Status |
|---|---|---|---|---|
| PageHeader | Default | Public, Member Spaces | Thừa thãi H1 và Logo | Duplicate Focus |
| StatePanel | Not Available | Public Voice | Dashed Border (SaaS) | Conflict w/ Brand |
| Gate CTA | Button | Public Home | Red outline box | Too App-like |
| ContextBar | Diagnostic | Toàn hệ thống | Technical Monospace | Technical Leakage |

---

## 6. CSS Architecture Audit
- **Tình trạng:** Khảo cổ học (Archaeological stack).
- Hệ thống V0 dùng `main.css` khổng lồ.
- Hệ thống V1 dùng cụm `foundation.css` -> `tokens.css`, `layout.css`, `components.css`.
- **Cảnh báo đỏ:** `foundation.css` bỏ qua lệnh `@import` từ thư mục `/brand/generated/brand.css`. Toàn bộ Design Tokens của V1 được code tay (Hardcoded) trong `tokens.css`, dẫn đến việc Human sửa `/brand` nhưng UI không thay đổi.

---

## 7. Valid Semantic Variations vs Violations
- **Violation:** Dùng font sans-serif cho Member Space (Vi phạm Brand Authority).
- **Violation:** Để ContextBar lọt ra trang Public (Phá vỡ Institutional Grammar).
- **Valid Variation:** Giao diện Genealogy có thể dùng data-table / card dày đặc vì bản chất nó là dữ liệu lưu trữ (Archival Data).
- **Valid Variation:** MẠCH cần khoảng trắng lớn, font to, căn lề giữa (Editorial) khác với Member Dashboard (Grid/Menu).

---

## 8. V0 → V1 Design Continuity
V1 (vNEXT) đã làm mất đi sự trang nghiêm và nhịp điệu (rhythm) của V0. Nó biến một "Ấn phẩm số" thành một "Ứng dụng rỗng". Việc đồng nhất (Consolidation) không có nghĩa là biến mọi thứ thành thẻ Card (Uniformity). 

---

## 9. Human Decisions Required
1. Human cần xác nhận: Liệu bộ CSS tự sinh trong `/brand/generated/brand.css` có phải là Root Token duy nhất cho V1 hay không? (Nếu đúng, phải bắt Cline nối nó vào `foundation.css` và xóa các token trùng lặp).
2. Human cần bổ sung Spacing và Grid system vào `/brand`, vì hiện tại nó chỉ mới quản lý Font và Color.

---

## 10. Implementation Brief For Cline

> **GỬI CLINE (EXECUTION AGENT):**
> Nhiệm vụ của bạn là dập tắt sự chia rẽ giữa các Dialect và hợp nhất toàn bộ UI vNEXT (`foundation.css`) dưới trướng của Brand System. Hãy làm theo các Phase sau:

### Phase 1 — Foundation (The Root Fix)
- **Token Override:** Xóa bỏ việc ghi đè Font trong `src/css/foundation/tokens.css`. Bạn **PHẢI** link `/brand/generated/brand.css` vào đầu hệ thống V1, và đảm bảo `--font-text-active` nhận giá trị Serif (`Times New Roman`) của Brand. 
- Xóa bỏ mọi font `sans-serif` đang dùng làm body text.

### Phase 2 — Primitives (De-App-ification)
- Xóa bỏ kiểu dáng Dashboard/SaaS: Xóa nét đứt (dashed borders) trên các Panel tĩnh lặng (Ví dụ: Tiếng nói gia tộc).
- Chuyển button CTA thành dạng thanh lịch, viền mỏng hoặc khối màu chìm (Flat & Sharp), không dùng Alert-style outline.

### Phase 3 — Shared Components
- **PageHeader:** Hợp nhất Typography. Tránh lặp lại H1 và Logo trong cùng một vùng Threshold.
- **ContextBar:** Ẩn hoàn toàn khỏi trang Public (`/`). Chỉ cho hiển thị trong Member Space / Admin.

### Phase 4 — Surface Registers
- Mặc dù chung một ngôn ngữ (Times New Roman, Flat Radius), hãy thiết kế các khoảng trắng (Whitespace) khác nhau:
  - **Public:** Rộng, tĩnh lặng, căn giữa (Institutional).
  - **MẠCH / Clara:** Cấu trúc bài báo, tập trung vào Typography và Line-height (Editorial).
  - **Member Dashboard:** Có thể dùng Grid/Card để điều hướng (Domestic).

### Phase 5 — Page Consolidation
- Sửa lại `public-home.js` và `member-app.js` (hoặc các màn hình đang dùng vNEXT) để ăn đúng class và token mới.
- Xóa hoàn toàn các tàn dư của thẻ Card dày đặc, nhường chỗ cho văn bản tự thở.

### Phase 6 — Regression QA
Kiểm tra chéo trên Mobile (375px) để chắc chắn việc bỏ ContextBar đã cứu được trang Public Home.
