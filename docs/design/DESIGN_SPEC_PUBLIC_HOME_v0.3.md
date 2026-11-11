# DESIGN SPECIFICATION — PUBLIC HOME v0.3
*Trạng thái: [READY FOR HUMAN REVIEW]*

## 1. PAGE PURPOSE & NARRATIVE HIERARCHY
**Purpose:** Public Home không phải là một Homepage thông thường, nó là **Cổng (Gate) của Gia tộc**.
**Narrative Hierarchy:**
1. **The Threshold (Điểm Nhận Diện):** Khẳng định danh tính, sự trang nghiêm và mục đích tồn tại.
2. **The Outward Path (Hướng Ngoại):** Tiếng nói của gia tộc gửi ra thế giới (hoặc sự im lặng có chủ đích).
3. **The Inward Path (Hướng Nội):** Lối vào dành riêng cho người trong nhà.
*(Khối "Về gia tộc" cũ mang tính giải thích hệ thống sẽ được hợp nhất hoặc lược bỏ để ưu tiên cho 2 con đường trên).*

## 2. COMPOSITION & SPATIAL HIERARCHY
Thay vì dàn trang tuyến tính (01, 02, 03) từ trên xuống dưới, trang sẽ được tổ chức lại theo dạng **Bố cục Phân đôi (Dichotomy Composition)** sau khi vượt qua Threshold:
- **First Viewport (Masthead):** Trống trải, chỉ chứa duy nhất Tên Gia Tộc cực lớn và Dòng định danh (Identity).
- **Second Viewport (Split Path):** Chia màn hình thành hai nửa (trái/phải hoặc trên/dưới nhưng không phải danh sách).
  - Một nửa: Tiếng nói của gia tộc (Outward).
  - Một nửa: Cánh cửa bước vào (Inward).

## 3. COMPONENT BEHAVIOR
### A. Family Threshold
- Không dùng Graphic/SVG logo nếu nó tạo ra sự trùng lặp với Header.
- Sử dụng chính thẻ `<h1>` làm Visual Anchor bằng nghệ thuật chữ (Typographic Graphic).
- **Whitespace:** Tối đa hóa khoảng trắng xung quanh Threshold để tạo sự cô lập, tĩnh lặng và "đắt giá".

### B. Outward Path (Tiếng nói của gia tộc)
- Thay vì dùng khối báo lỗi hoặc "Chưa có dữ liệu", khoảng trống này được biểu diễn bằng một vùng **Editorial Silence**.
- Sử dụng khoảng trắng cực lớn, kết hợp với một đường kẻ đơn (single rule) mỏng manh và dòng chữ nhỏ, sắc nét: *Gia tộc chưa có điều muốn nói ra thế giới.*
- Xóa bỏ câu giải thích hệ thống: "Đây là nơi dành cho những điều...". Sự im lặng tự nó là một thông điệp, không cần giải thích.

### C. Inward Path (Member Gate)
- Không dùng Nút bấm (Button/Pill) kiểu SaaS.
- **Gate UI:** Là một khối typography vức, được bao bọc bởi một đường viền (border) tinh tế, giống như một khung cửa thật sự.
- Tương tác (Hover): Không nhấc bổng (lift), không bóng đổ, chỉ đảo màu (invert) mô phỏng vết mực in để xác nhận trạng thái.

### D. Header & Footer
- **Header:** Ẩn toàn bộ logo hoặc text tên gia tộc trên thanh điều hướng để dồn toàn bộ Sức nặng Thị giác (Visual Weight) cho Family Threshold ở giữa màn hình.
- **Footer:** Sạch sẽ tuyệt đối. Chỉ còn 1 dòng: `© 2026 Gia Tộc Trần Trọng Thu`.

## 4. TYPOGRAPHY HIERARCHY
- **Masthead (H1):** `Times New Roman`, Kích thước khổng lồ, Tracking (khoảng cách chữ) khít lại để tạo thành một khối đồ họa.
- **Định danh (Subtitle):** `Times New Roman`, Italic, kích thước vừa, căn giữa.
- **Gate Label:** Cứng cáp, in hoa (Uppercase), khoảng cách chữ rộng (Wide tracking) để mô phỏng một tấm biển đồng/khắc đá (nhưng không dùng hiệu ứng 3D).

## 5. PROHIBITED PATTERNS
- Cấm sử dụng các con số `01, 02, 03` làm xương sống dàn trang (linear numbering).
- Cấm dùng Gray Alert, Dashed Box cho trạng thái Voice Empty.
- Cấm dùng từ ngữ hướng dẫn kỹ thuật ("Đây là không gian chính thức...").
