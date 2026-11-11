# EDITORIAL TIASANG EQUIVALENCE DESIGN BRIEF

## 1. Owner Decision
Owner đã chốt định hướng sản phẩm: Lấy cấu trúc trình bày (structural grammar) của `tiasang.com.vn` làm template, giữ nguyên logic sắp xếp module và phân bổ thị giác, sau đó thay lớp ý nghĩa/nội dung bằng dữ liệu của Gia Tộc Trần Trọng Thu.

**Nguyên lý cốt lõi: SAME STRUCTURE - DIFFERENT MEANING.**
Dự án KHÔNG tái sáng tạo (invent) một layout báo chí mới, cũng KHÔNG copy branding (màu sắc, typography, logo) của Tia Sáng. Nhiệm vụ là **Reverse-Engineer** và **Map** cấu trúc để biến đổi Homepage từ dạng "Card-based Application" sang "Online Publication".

## 2. Tia Sáng Structural Anatomy
Phân tích ngữ pháp cấu trúc thực tế của Tia Sáng:

- **A. Top / Utility:** Dải mỏng trên cùng. Trái: Ngày tháng hiện tại. Phải: Công cụ tìm kiếm, icon tài khoản.
- **B. Masthead:** Không gian rộng. Logo lớn đặt chính giữa (centered), có khoảng trắng (vertical space) dồi dào trên/dưới.
- **C. Primary Navigation:** Nằm dưới masthead, kẹp giữa hai đường kẻ ngang (horizontal rules). Các item căn giữa hoặc dàn đều, font chữ rõ ràng, không kèm icon rườm rà (trừ Home icon).
- **D. Front Page / Lead Content:** Khu vực ngay dưới navigation. Thường chia tỷ lệ (ví dụ: 60/40 hoặc 70/30). Bài đinh (Featured) có ảnh cover lớn, title to, excerpt rõ ràng.
- **E. Editorial Sections:** Cấu trúc lặp lại:
  `SECTION HEADING` (chữ in hoa, có gạch ngang) → `Bài nổi bật của section` → `Các bài phụ` → `Xem thêm` → `Horizontal Rule` phân cách section tiếp theo.
- **F. Multi-column Modules:** Content chính ở cột trái/giữa. Sidebar ở cột phải chứa các nội dung ngắn, danh sách sự kiện, hoặc tin vắn.
- **G. Footer:** Chứa logo (nhỏ hơn), thông tin liên hệ toà soạn, bản quyền, và các link phụ. Có đường viền trên (top rule) dày hoặc rõ nét.

## 3. Gia Tộc Structural Equivalent
Bảng ánh xạ (Mapping) Cấu trúc - Ý nghĩa:

| Tia Sáng Structure | Gia Tộc Meaning / Data Equivalent |
|---|---|
| Masthead (Nameplate) | Nhận diện Gia Tộc Trần Trọng Thu |
| Tagline ("Dòng chảy tri thức") | "Từ 1872 đến chúng ta" |
| Chuyên mục (Khoa học, Văn hóa) | MẠCH, TƯ LIỆU GỐC, GIA PHẢ |
| Hồ sơ - Nhân vật | Tuyến bài/Hồ sơ người trong gia tộc |
| Nội dung / Bài viết | Câu chuyện, ký ức, tài liệu lịch sử |
| Lịch sự kiện (Sidebar) | Lịch / Ngày giỗ / Sinh nhật |
| Tìm kiếm | Tra cứu gia phả / nhân vật |
| Footer / Toà soạn | Ban Liên Lạc / Thông tin lưu trữ |

## 4. Masthead Mapping
- **Vị trí:** Giữ nguyên Centered Identity Zone đã implement ở v0.2.
- **Logo:** Dùng `logoGiaToc_ngang.svg`.
- **Relationship:** Đảm bảo spacing trên/dưới logo tương đương nhịp điệu của Tia Sáng (khoảng 2-3 rem). 
- **Utility:** Đẩy ngày tháng lên dải meta góc trái. Góc phải đặt Tìm kiếm & Cài đặt. Không để các thành phần này nằm cùng hàng với Logo.

## 5. Navigation Mapping
- **Vị trí:** Ngay dưới Masthead, kẹp giữa 2 hairline borders.
- **Routes (Giữ nguyên):** TRANG CHỦ | GIA PHẢ | MẠCH | TƯ LIỆU | LỊCH | TÌM KIẾM
- **Styling:** Không dùng nút bấm (buttons) hay card. Dùng plain text, uppercase hoặc title case, có trạng thái `active` bằng màu mực (ink) đậm hoặc gạch chân.

## 6. Homepage Structural Mapping
Trật tự trang chủ được tổ chức lại theo trục dọc (Vertical Flow):
1. **Masthead & Navigation** (Như mục 4, 5).
2. **Lead Content (Trang nhất):** Lấy 1 bài mới/quan trọng nhất từ `MẠCH` làm Featured Story, hiển thị ảnh lớn, tiêu đề H1. (Layout 2 cột: Cột trái Lead Story, Cột phải Sidebar Lịch).
3. **MẠCH (Section):** 3-4 câu chuyện tiếp theo, trình bày dạng list báo chí hoặc grid.
4. **TƯ LIỆU (Section):** Hiển thị dạng Gallery thumbnails, tập trung vào hình ảnh di sản.
5. **GIA PHẢ (Section):** Khối tóm tắt, thống kê số lượng thành viên, các nhánh, nút CTA "Xem phả đồ".
6. **Footer:** Nằm dưới cùng.

## 7. Section Mapping
Khuôn mẫu cho mỗi Section (Mạch, Tư Liệu):
```text
— [ TÊN SECTION ] —
[ Nội dung / Bài viết 1 ] (Kèm thumbnail)
[ Nội dung / Bài viết 2 ]
[ Nội dung / Bài viết 3 ]
> Xem tất cả...
-------------------------------------------------- (Horizontal rule)
```

## 8. Module Mapping (Từ Card sang Editorial)
- **LOẠI BỎ:** Background color nền nổi (colored blocks), border-radius lớn (bo góc), box-shadow (đổ bóng).
- **THAY THẾ BẰNG:** Horizontal rules (đường kẻ ngang), typography hierarchy (cấp bậc font chữ Serif/Sans-serif), column alignment (căn lề cột nghiêm ngặt), và khoảng trắng (editorial whitespace) để phân tách nội dung.

## 9. MẠCH Positioning
- `MẠCH` là một Chuyên mục (Section) nằm bên trong Ấn phẩm `Gia Tộc Trần Trọng Thu`.
- `MẠCH` xuất hiện dưới dạng một SECTION HEADING trên Homepage.
- Không đưa `MẠCH` lên làm global masthead ngang hàng với tên Gia Tộc.

## 10. Footer Mapping
- **Tia Sáng:** Địa chỉ toà soạn, giấy phép, liên hệ, logo footer.
- **Gia Tộc Equivalent:** Thông tin Ban Liên Lạc, năm lưu trữ (Est. 1872), copyright, các liên kết nhanh (Sitemap), và logo gia tộc phụ (nhỏ hơn masthead).

## 11. Responsive / Mobile Structural Rules
- **Masthead:** Vẫn centered trên mobile, thu nhỏ tỷ lệ logo nhưng không được nhét vào cùng hàng với menu hamburger (để bảo toàn tính editorial).
- **Nav:** Thu gọn thành Hamburger Menu, hoặc dải scroll ngang (overflow-x: auto) tùy biến.
- **Sidebar:** Cột Lịch/Sự kiện bên phải trên Desktop sẽ trôi (stack) xuống bên dưới Lead Content hoặc dưới đáy trang trên Mobile.

## 12. Current → Proposed (Sự thay đổi mong đợi)
- **Current:** Các module Gia Phả, Mạch, Lịch đang xếp thành từng thẻ (card) bơ vơ trên một nền trắng mênh mông, thiếu vắng sự kết nối và nhịp điệu đọc.
- **Proposed:** Homepage trở thành một dòng chảy liên tục. Các thẻ (cards) bị phá vỡ để trở thành các đoạn văn, hình ảnh và tiêu đề xếp cạnh nhau, được phân cách bởi các đường kẻ mảnh. Mật độ thông tin cao hơn nhưng mạch lạc hơn nhờ Typography Hierarchy.

## 13. Exact Cline Implementation Scope
Khi Cline nhận task này, phạm vi công việc là:
- **Refactor HTML/CSS** của `index.html` và các file CSS liên quan (vd: `main.css`).
- Áp dụng CSS Grid / Flexbox để tái hiện lại bố cục Lead Content + Sidebar + Sections.
- Loại bỏ các class liên quan đến Card UI.
- Thêm các hairline borders.
- **Mock Data:** Cline phải sử dụng JavaScript để fetch dữ liệu từ `mach.json`, `genealogy.json` và render trực tiếp ra các section trên Homepage để lấp đầy cấu trúc mới.

## 14. Explicit Non-Goals
- KHÔNG tạo ra design system mới. Vẫn dùng biến CSS hiện tại.
- KHÔNG sao chép màu đỏ/nhận diện riêng của Tia Sáng.
- KHÔNG thay đổi Backend API hay Database.
- KHÔNG thay đổi logic Authentication.
- KHÔNG thay đổi Font chữ (vẫn giữ Times New Roman / Inter đã chốt).

## 15. Owner Decision Required
Trước khi giao Cline bắt tay vào code, Owner vui lòng xác nhận:
1. **Dữ liệu Lead Content:** Đồng ý dùng dữ liệu bài viết mới nhất từ tập san `MẠCH` làm Featured Story (Trang nhất) của Homepage?
2. **Tagline:** Chốt sử dụng câu *"Từ 1872 đến chúng ta"* làm Tagline chính thức dưới Nameplate?
3. **Sidebar:** Lịch (Ngày giỗ, sinh nhật) sẽ được đặt ở cột phụ (Sidebar) bên phải (trên Desktop)?
