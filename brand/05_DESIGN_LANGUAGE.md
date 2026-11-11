# DESIGN LANGUAGE (NGỮ PHÁP THIẾT KẾ)
*Trạng thái: [APPROVED]*

Đây là tầng chuyển dịch Chiến lược Thị giác thành các Nguyên tắc Thiết kế cụ thể (Reusable Grammar). Dựa trên nền tảng này, file `BRAND_GOVERNANCE_v0.1.md` sẽ định nghĩa các mã Token cụ thể.

## 1. LAYOUT GRAMMAR
- **The Masthead:** Đầu trang phải vững chắc. Sử dụng Logo hoặc Heading có kích thước cực lớn, canh giữa hoặc chiếm toàn bộ lưới ngang.
- **The Double Rule:** Sử dụng đường kẻ đôi (`3px double`) để phân tách các khu vực cấu trúc lớn (Architecture Boundaries) như Header, Footer, hoặc Masthead.
- **The Single Rule:** Sử dụng đường kẻ đơn (`1px solid`) để phân tách các mục nội dung (Content separation).
- **No Floating Cards:** Các cụm nội dung không trôi nổi trong các hộp bo góc (Cards) đổ bóng. Chúng phải được neo vào Grid hoặc phân cách bởi Borders (Solid lines).

## 2. TYPOGRAPHY GRAMMAR
- **Display:** `Times New Roman`. Dùng cho Tên Gia tộc, Tiêu đề trang, Masthead. Kích thước (Scale) rất lớn.
- **Reading (Body):** `Times New Roman`. Dùng cho nội dung văn bản dài (MẠCH, Clara).
- **Utility & Meta:** Font Sans-serif (có thể là system font). Chữ nhỏ, in hoa (Uppercase), khoảng cách chữ rộng (Letter-spacing). Dùng cho Ngày tháng, Tag, System Labels, Metadata.

## 3. SURFACE REGISTERS (PHÂN BIỆT BỀ MẶT)
*(Reference: Được áp dụng để xây dựng UI cho các trang tại `docs/design/GIATOC_INNER_SITE_UX_IA_SPEC_v0.1.md`)*
- **Public Surface:** Tĩnh lặng, đồ sộ, chia luồng rõ rệt. Không chứa ContextBar. Cấm rò rỉ dữ liệu nội bộ (Gate-only).
- **Member Space (Lobby):** Mang tính điều hướng. Hiển thị các khối dẫn vào các Không gian bên trong (MẠCH, Clara, Gia phả).
- **MẠCH Surface:** Editorial layout. Thiết kế dạng măng-sét báo in, có lưới bài viết.
- **Clara Surface:** Intimate layout. Căn giữa, lề lớn (Whitespace siêu rộng), cực kỳ ít viền kẻ. Tập trung 100% vào văn bản thư. Không có các yếu tố UI phân tâm.
- **Genealogy Surface:** Data-dense layout. Cho phép dùng lưới (Grid/Table dày đặc), chữ nhỏ gọn, nhiều Meta-data, hiển thị Relationship chằng chịt nhưng phải giữ form phẳng (Flat).

## 4. INTERACTION PRINCIPLES
- **Hover States:** Tuyệt đối không dùng hiệu ứng nổi (Lift) hoặc đổ bóng (Shadow) khi Hover. Sử dụng việc thay đổi màu viền (Border-color) hoặc màu nền (Background-color) một cách dứt khoát, mô phỏng mực in đè lên giấy.
- **Empty States:** Trạng thái trống (Empty) là "Sự vắng mặt có chủ đích" (Deliberate Absence). Dùng Typography và đường kẻ để thông báo tĩnh lặng. Tuyệt đối cấm dùng hộp viền nét đứt (Dashed box) kiểu SaaS.
- **Loaders:** Thanh loading dọc/ngang mảnh, tinh tế. Cấm dùng Spinner (vòng tròn xoay) của Material Design.
