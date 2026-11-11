# EDITORIAL PUBLICATION SHELL DESIGN BRIEF

## 1. Problem Statement
Mặc dù `giatoctrantrongthu` đã áp dụng Editorial Masthead v0.2 (đặt Masthead làm trung tâm), trang chủ hiện tại vẫn mang lại cảm giác của một "web app" hoặc "landing page". Nguyên nhân đến từ:
- **Quá nhiều whitespace vô định:** Khoảng trắng không được dùng để phân tách typography mà bị dùng để lấp đầy không gian trống, tạo cảm giác "thưa thớt" (sparse).
- **Application Cards thay vì Editorial Sections:** Các nội dung (Gia Phả, Mạch, Tư Liệu, Lịch) đang hiển thị dưới dạng các "thẻ chức năng" (module/card) để người dùng click vào, giống một dashboard công cụ hơn là một trang chủ báo chí/tạp chí.
- **Thiếu Editorial Rhythm:** Không có nhịp điệu đọc (hierarchy của tin chính, tin phụ, danh sách, sidebar). Mọi khối nội dung dường như có trọng lượng thị giác ngang bằng nhau.

## 2. Owner Design Direction
> **Website phải được tổ chức như một ONLINE PUBLICATION / LIVING ARCHIVE của một dòng họ.**

Tham chiếu ngữ pháp trình bày (editorial grammar) từ Tia Sáng và các ấn phẩm lớn:
- Chuyển đổi từ giao diện "chọn tính năng" sang "đọc và khám phá nội dung".
- Homepage phải giống một **Trang nhất (Front Page)**, trưng bày các câu chuyện, tư liệu và dòng sự kiện mới nhất/đáng chú ý nhất của Gia Tộc, thay vì chỉ là các cánh cửa (portals) dẫn vào bên trong.

## 3. Editorial Model
Mô hình hệ thống chuyển từ **Web Application** sang **Publication System**:
- *App Card* → **Editorial Section** (Chuyên mục)
- *Feature* → **Collection / Series** (Tuyến bài / Bộ sưu tập)
- *Data Record* → **Story / Document** (Câu chuyện / Tài liệu lưu trữ)

## 4. Global Information Architecture
Cấu trúc vỏ bọc (Shell) toàn cục của hệ thống:
1. **Utility Strip (Top):** Công cụ bổ trợ và thông tin meta (Ngày tháng, Tìm kiếm nhỏ, Đăng nhập/Cài đặt).
2. **Masthead (Nameplate):** Nhận diện trung tâm `GIA TỘC TRẦN TRỌNG THU`.
3. **Primary Navigation (Table of Contents):** Dải menu điều hướng chính của ấn phẩm.
4. **Content Container:** Khu vực lưới nội dung (Grid), giới hạn độ rộng tối đa để đảm bảo dòng line-length tối ưu cho việc đọc (khoảng 1024px - 1200px max-width).
5. **Footer (Archive/Colophon):** Thông tin bản quyền, thông tin liên hệ Ban Liên Lạc, sitemap phụ, credits.

## 5. Navigation Model
Phân vai rõ ràng cho các items hiện có, không tự ý thay đổi route nhưng thay đổi tính chất hiển thị:

- **Primary Editorial Sections (Nằm trong Global Navigation - Chính giữa):**
  - `Trang Chủ` (Front Page)
  - `Gia Phả` (Cấu trúc / Cây phả hệ)
  - `Mạch` (Tập san / Bài viết / Câu chuyện)
  - `Tư Liệu` (Thư viện hình ảnh / Văn bản gốc)

- **Utility / Secondary Navigation (Nằm ở Utility Strip hoặc Góc phải/Sidebar):**
  - `Lịch` / Ngày giỗ (Tính chất tra cứu công cụ, có thể làm widget trên sidebar thay vì primary nav).
  - `Tìm Kiếm` (Icon ở góc phải hoặc dải utility).
  - `Cài Đặt` / Member Auth (Góc phải trên cùng).

## 6. Homepage Structure (Trang Nhất)
Dựa trên các data/module sẵn có, Homepage được tổ chức lại theo nhịp điệu toà soạn:
- **Lead / Featured Story (Tiêu điểm):** Bài viết mới nhất/quan trọng nhất trích từ `MẠCH` hoặc sự kiện lớn sắp tới từ `Lịch`. Khối này chiếm không gian lớn, có ảnh cover, tiêu đề to, và trích dẫn (excerpt).
- **The Latest (Mới cập nhật):** Danh sách 3-4 mục mới thêm vào (Vd: Nhân vật mới cập nhật trong Gia Phả, hoặc tư liệu mới tải lên).
- **Section Modules:**
  - *Module Mạch:* 3-4 câu chuyện hiển thị dạng text/grid.
  - *Module Tư Liệu:* Hiển thị dạng thư viện thu nhỏ (gallery thumbnails) có viền khung.
- **The Sidebar (Cột phụ):** Nằm bên phải, chứa Widget `Lịch` (Hiển thị 2-3 ngày giỗ/sinh nhật sắp tới) và `Tra cứu` nhanh.

## 7. Module Architecture
Định nghĩa lại cách hiển thị thay vì dùng "Card":
- Bỏ các background color lốm đốm và border-radius lớn của card.
- Dùng **Horizontal Rules (đường kẻ ngang)** hoặc **Hairlines** màu nhạt để phân tách các mục.
- Tiêu đề module (Section Heading) dùng typography serif in hoa, có đường gạch dưới hoặc gạch trên để tạo ranh giới chuyên mục (vd: `— TẬP SAN MẠCH —`).

## 8. MẠCH Positioning
Hệ thống cấp bậc:
`GIA TỘC TRẦN TRỌNG THU` (Đại ấn phẩm / Nameplate)
   ↓
`MẠCH` (Một chuyên mục / Tạp chí nội bộ nằm trong ấn phẩm mẹ)
   ↓
`Stories / People / Memories` (Các bài viết)

- **Nguyên tắc:** `MẠCH` tuyệt đối không được thiết kế như một Masthead ngang hàng che lấp `Gia Tộc Trần Trọng Thu`. Mạch là một Section Heading lớn bên trong, có thể có typographic style riêng nhưng phải phục tùng Masthead chính.

## 9. Text Wireframe
Cấu trúc Visual Rhythm cho Homepage (Desktop):

```text
======================================================================
 [ Thứ Ba, 14/09/2026 ]                              [ Tìm kiếm ] [ Cài Đặt ]
======================================================================
                       GIA TỘC TRẦN TRỌNG THU
                       (Centered Nameplate)
----------------------------------------------------------------------
        TRANG CHỦ   |   GIA PHẢ   |   MẠCH   |   TƯ LIỆU
======================================================================

 [ FEATURED STORY / TIÊU ĐIỂM (Lấy từ MẠCH) ]      |  [ SỰ KIỆN SẮP TỚI ]
                                                   |
 (Ảnh Cover Lớn)                                   |  - 15/09: Giỗ ông A
                                                   |  - 20/09: Sinh nhật B
 Tiêu đề bài viết nổi bật (H1 Serif)               |
 Trích dẫn ngắn (Excerpt)...                       |  [ TÌM KIẾM NHANH ]
                                                   |  Input Box...
---------------------------------------------------|------------------
 — TẬP SAN MẠCH —                                  |  — GIA PHẢ —
                                                   |
 [Ảnh] Tiêu đề bài 2      [Ảnh] Tiêu đề bài 3      |  (Widget thống kê)
 Trích dẫn ngắn...        Trích dẫn ngắn...        |  150 thành viên
                                                   |  4 thế hệ
 [Ảnh] Tiêu đề bài 4      [Ảnh] Tiêu đề bài 5      |  
 Trích dẫn ngắn...        Trích dẫn ngắn...        |  > Xem cây phả hệ
                                                   |
---------------------------------------------------|------------------
 — TƯ LIỆU GỐC —                                   |
                                                   |
 [Thumb 1]  [Thumb 2]  [Thumb 3]  [Thumb 4]        |
 Dòng chú thích bên dưới từng ảnh                  |
                                                   |
======================================================================
 FOOTER: Thông tin bản quyền, Ban liên lạc, Các liên kết phụ
======================================================================
```

## 10. Current → Proposed Comparison

| Khía cạnh | Current Homepage | Proposed Homepage |
|---|---|---|
| **Cảm giác** | Landing page ứng dụng, Dashboard thưa thớt | Trang nhất báo chí, Kho lưu trữ lịch sử đĩnh đạc |
| **Khoảng trắng** | Vô định, tràn ngập không có cấu trúc | Có chủ đích, dùng làm thước đo typography (Editorial Whitespace) |
| **Hierarchy** | Flat (Các tính năng nằm ngang hàng bằng thẻ Card) | Sâu (Tin chính, tin phụ, Sidebar, Section Headings) |
| **Phân tách** | Card UI, box-shadow, background màu | Kẻ chỉ ngang/dọc (Hairlines, rules), typography contrast |
| **Chức năng** | Cung cấp lối vào tính năng | Kể chuyện ngay từ trang nhất (hiển thị content thay vì icon tính năng) |

## 11. Design Principles

1. **Publication-first & Content-first:** Thiết kế vì nội dung đang nói gì, không phải vì tính năng nó làm gì.
2. **Masthead as Identity:** Logo Gia Tộc là điểm neo bất khả xâm phạm.
3. **Navigation as Table of Contents:** Menu là mục lục, không phải tool-bar.
4. **Sections as Editorial Modules:** Trình bày theo chuyên mục báo chí.
5. **Whitespace có chủ đích:** Khoảng trắng định hình cấu trúc, không phải để lấp chỗ trống.
6. **Typography Hierarchy:** Dùng kích thước, độ đậm và Serif/Sans-serif để dẫn dắt mắt đọc.
7. **Rules / Dividers:** Dùng đường kẻ truyền thống thay vì box model đổ bóng.
8. **Archival Character:** Đậm chất tư liệu, không mang tính SaaS/Dashboard.

## 12. Implementation Boundaries (For Cline)
- **KHÔNG code backend:** Dùng hoàn toàn JSON/API hiện có để móc data (Ví dụ: móc bài mới nhất từ `mach.json` để render Featured Story).
- **KHÔNG đổi framework:** Vẫn dùng Vanilla JS + HTML tĩnh + CSS hiện tại.
- **KHÔNG đổi Brand:** Giữ nguyên màu sắc, logo `logoGiaToc_ngang.svg`, font chữ (Times New Roman / Inter) như đã định.
- **KHÔNG đập phá Logic Auth/Members:** Tập trung cấu trúc lại UI/DOM của `index.html` và file CSS liên quan đến Layout.

---

## 13. OWNER DECISION REQUIRED

Trước khi giao Cline triển khai thiết kế này (implementation), Owner cần xem xét và chốt các điểm sau:

1. **Dữ liệu cho Trang Nhất:** Để render được "Featured Story" và danh sách bài viết từ `MẠCH` ra trang chủ, frontend sẽ cần fetch `mach.json` ngay tại Homepage. Owner có đồng ý với việc trộn một phần dữ liệu content ra thẳng trang chủ để tạo cảm giác publication không?
2. **Sidebar Widgets:** Việc di chuyển `Lịch` thành một widget dọc bên phải trên trang chủ (như wireframe) có đáp ứng đúng nhu cầu tra cứu thường xuyên của gia tộc không?
3. **Tư Liệu:** Tư liệu hiển thị ở trang chủ sẽ là một gallery ảnh random hay bài viết tư liệu mới nhất?

*(Chờ Owner phản hồi trước khi tiến hành viết code/CSS).*
