# BÁO CÁO BATCH 2A: KHẢO SÁT, KIỂM KÊ VÀ ÁNH XẠ NỘI DUNG THẬT
## (REAL CONTENT INVENTORY & DATA MAPPING DOSSIER)
### PROJECT: CÂY GIA PHẢ / GIATỘC TRẦN TRỌNG THU

- **Thẩm quyền phê duyệt tối cao:** Tuấn (Human Final Authority & Product Decision Maker)
- **Thẩm quyền phân tích kiến trúc:** Emarald (Analysis Authority)
- **Đơn vị điều phối thực thi:** AGY (Execution Coordinator & Primary Agent)
- **Chế độ thực thi:** `CONTROLLED LOCAL IMPLEMENTATION (Batch 2A Only)`
- **Thời điểm hoàn thành:** 02/11/2026

---

## 1. NGUỒN DỮ LIỆU ĐỐI SOÁT (SOURCES OF CONTENT)

### NGUỒN 01 — Repository Hiện Hữu (`/Users/tuantq/Projects/Personal/giatoctrantrongthu`)
1. **Phả hệ cốt lõi:** `server/data/genealogy.json` (195 KB) — Chứa toàn bộ 223 nhân vật, 68 gia đình, 215 mốc thời gian lịch sử, trục gốc `@I1@` Cụ Giuse Trần Trọng Thu.
2. **Khảo cứu MẠCH:** `server/data/mach.json` (715 KB) — Chứa 12 bài viết hoàn chỉnh kèm cấu trúc AST blocks và Markdown nguyên bản của Tập san MẠCH Số 01, 2 tác giả, 1 series.
3. **Tư liệu & Chân dung:** `server/data/media.json` (110 KB) và `server/data/person_media.json` (36 KB) — Chứa 185 tài sản tư liệu (chân dung FamilySearch, tài liệu ảnh) và 173 liên kết quan hệ thực tế giữa nhân vật và hình ảnh.
4. **Kho ảnh cục bộ:** `assets/images/avatars/` (185 ảnh chân dung) và `assets/images/mach/issue-01/` (10 ảnh tư liệu bài viết).
5. **Dữ liệu Lịch gia đình:** `server/calendars/` chứa 4 tệp chuẩn iCalendar:
   - `CAL_01_BIRTHDAYS.ics` (118 sự kiện sinh nhật).
   - `CAL_02_PATRON_FEASTS.ics` (115 ngày lễ bổn mạng Công giáo).
   - `CAL_03_MEMORIALS.ics` (28 ngày giỗ tiên nhân kèm ngày âm/dương).
   - `CAL_04_FAMILY_MILESTONES.ics` (4 kỷ niệm hôn phối và bí tích rửa tội lớn).
6. **Không gian Thư gửi Clara (Riêng tư):** `server/data/private/clara.json` (720 KB) — Chứa 8 lá thư riêng biệt kèm AST blocks và Markdown.
7. **Mã nguồn Website Static cũ:** `archive/legacy_frontend/index.html` và `archive/legacy_frontend/app.js`.

### NGUỒN 02 — Website Static Xuất Bản Lịch Sử (`https://giatoctrantrongthu.vercel.app/`)
AGY đã kết nối trực tiếp và đối soát bằng Playwright browser:
- **Trạng thái:** HTTP 200 OK — Đang hoạt động trực tuyến.
- **Tiêu đề gốc:** `GIA TỘC TRẦN TRỌNG THU — TỪ 1872 ĐẾN CHÚNG TA`.
- **Cấu trúc 6 tab lịch sử:** `Trang Chủ`, `Gia Phả`, `Mạch`, `Tư Liệu`, `Lịch`, `Tìm kiếm`.
- **Nội dung trang chủ:** Xác nhận sự tích cụ Giuse Trần Trọng Thu (1872–1969) tại Thanh Hóa, 5 thế hệ tiếp nối và bài viết "KÝ ỨC TIỀN NHÂN — CÂU CHUYỆN VỀ BÀ SA (Teresa Phạm Thị Hưng)".
- **Số liệu thống kê xác nhận:** Khớp 100% với các tệp dữ liệu lưu trong `server/data/` và `server/calendars/`.

---

## 2. BẢNG KIỂM KÊ NỘI DUNG CHI TIẾT (CONTENT INVENTORY)

| Phân Vùng | Số Lượng Bản Ghi Thật | Thành Phần Chính | Tình Trạng Tài Sản Đi Kèm |
| :--- | :--- | :--- | :--- |
| **A. Trang Chủ (Public Home)** | 1 bản ghi tổng hợp | - Tiêu đề xuất bản di sản<br>- Lời dẫn mở đầu 150 năm<br>- Ký ức tiền nhân: Câu chuyện Bà Sa<br>- Mốc lịch sử 5 thế hệ | - Biểu tượng Logo Gia Tộc (`assets/images/logoGiaToc_ngang.svg`)<br>- Trực quan hóa cây thế hệ |
| **B. MẠCH (Diễn ngôn Văn hóa)** | 12 bài viết chuyên đề<br>(Issue 01) | - Toàn văn 12 bài viết (1.800 – 7.600 ký tự/bài)<br>- 2 tác giả (Người giữ mạch, Ban biên tập)<br>- Trích dẫn, chú giải, lời giới thiệu | - 10 ảnh minh họa lịch sử (`assets/images/mach/issue-01/`)<br>- Cấu trúc AST paragraphs, dropcaps, inlines |
| **C. Tư Liệu (Archival Media)** | 185 tài sản tư liệu | - 185 ảnh chân dung nhân vật có mã băm SHA-256<br>- Nguồn gốc xác minh (FamilySearch Descendancy)<br>- Metadata: kích thước, mimeType | - 185 file ảnh JPEG có sẵn trên ổ đĩa tại `assets/images/avatars/` |
| **D. Gia Phả (Genealogy Tree)** | 223 nhân vật<br>68 gia đình | - Họ tên, Giới tính, Đời (F0 - F4)<br>- Năm sinh, năm mất, nơi an táng<br>- Quan hệ cha mẹ, phối ngẫu, con cái<br>- 173 liên kết chân dung nhân vật | - Cây phả hệ liên tục từ Cụ Thu `@I1@`<br>- Sạch PII ngoài luồng, chuẩn hóa từ GEDCOM |
| **E. Lịch Gia Đình (Calendar)** | 265 sự kiện thực | - 118 Sinh nhật<br>- 115 Ngày lễ bổn mạng<br>- 28 Ngày giỗ (Có ghi chú âm/dương, nhánh)<br>- 4 Sự kiện kỷ niệm hôn phối/rửa tội | - 4 file `.ics` có sẵn trong `server/calendars/` |
| **F. Tra Cứu (Search)** | 600+ thực thể tra cứu | - 223 Nhân vật gia phả<br>- 12 Bài viết MẠCH<br>- 185 Tư liệu ảnh<br>- 265 Sự kiện lịch | - Tìm kiếm thời gian thực không dùng danh sách giả lập |
| **G. Không Gian Thành Viên (/me)** | 1 hồ sơ trung tâm | - 4 cánh cửa dẫn vào các không gian<br>- Lược bỏ hoàn toàn thuật ngữ kỹ thuật CSDL | - Kết nối trực tiếp vào các kho nội dung thật |
| **H. Thư Gửi Clara (Riêng Tư)** | 8 lá thư thân mật | - Toàn văn 8 bức thư (3.100 – 10.500 ký tự/bức)<br>- Tác giả: Bố của Clara<br>- Trọng tâm: Triết lý, đạo đức, gia đình | - **BỊ CÔ LẬP TUYỆT ĐỐI:** Không rò rỉ vào Public, MẠCH, Search hay Tư liệu |

---

## 3. MA TRẬN ÁNH XẠ DỮ LIỆU (DATA MAPPING MATRIX)

| Nguồn Dữ Liệu Gốc | Dữ Liệu Cụ Thể | Điểm Đích Kiến Trúc Dynamic | Trạng Thái Ánh Xạ | Ghi Chú Kỹ Thuật & Giám Sát |
| :--- | :--- | :--- | :---: | :--- |
| `archive/legacy_frontend/` & Static Web | Tiêu đề, dẫn nhập, ký ức Bà Sa, thống kê 5 đời | Bề mặt 1: Cổng vào (`src/js/ui/public-home.js`) | **`MAPPED`** | Ánh xạ trực tiếp vào nhịp Dichotomy Grid của Public Home. |
| `server/data/mach.json` | 12 bài viết Tập san Số 01, AST blocks, Markdown, metadata tác giả | Bề mặt 5: MẠCH (`src/js/ui/discourse.js`) | **`MAPPED`** | Chuyển toàn bộ 12 bài thật vào `fixtures/synthetic_mach.json` / Lab runtime. Hiển thị toàn văn bài đọc. |
| `server/data/media.json` & `assets/images/avatars/` | 185 ảnh chân dung, SHA-256, nguồn gốc FamilySearch | Bề mặt 4: Hồ sơ nhân vật & Module Tư liệu (`src/js/ui/person.js`) | **`MAPPED`** | Phục hồi liên kết hiển thị ảnh chân dung theo đúng PersonMedia mapping. |
| `server/data/genealogy.json` | 223 nhân vật, 68 gia đình, cha mẹ, con cái, năm sinh/mất | Bề mặt 3: Cây phả đồ (`src/js/ui/tree.js`) & Bề mặt 4: Hồ sơ (`person.js`) | **`MAPPED`** | Đưa toàn bộ 223 nhân vật thật vào phả đồ tra cứu; thay thế bộ 7 người giả lập. |
| `server/calendars/*.ics` | 265 sự kiện ngày giỗ, sinh nhật, bổn mạng, kỷ niệm | Bề mặt Lịch & Dashboard (`src/js/ui/dashboard.js`) | **`MAPPED`** | Trích xuất sự kiện ngày giỗ và sự kiện tháng vào giao diện Của tôi và Lịch. |
| `server/data/private/clara.json` | 8 bức thư thân mật gửi Clara, 1 tác giả, 1 series | Bề mặt 6: Thư Clara (`src/js/ui/discourse.js`) | **`RESTRICTED`** | Ánh xạ vào không gian Thư Clara với rào chắn bảo mật nghiêm ngặt (chỉ cấp cho Persona `A-HD`). CẤM public. |
| Các tính năng quản trị / sửa phả hệ | Form admin cũ trên static | Bề mặt 4: Form Đề xuất thay đổi (Mock Form) | **`PARTIAL`** | Static site cũ cho phép sửa in-place; dynamic site vNEXT chuẩn hóa thành luồng "Đề xuất thay đổi" an toàn. |
| Không gian gia đình mới | Chưa có trong static site cũ | Bề mặt 7: Không gian (`src/js/ui/spaces.js`) | **`UNMAPPED`** | Static site cũ chưa có không gian nhánh riêng biệt; giữ nguyên trạng thái chờ mở rộng theo thiết kế. |

---

## 4. XÁC ĐỊNH BỘ DỮ LIỆU LÀM VIỆC CỤC BỘ CHO BATCH 2B

Nhằm bảo vệ tuyệt đối cơ sở dữ liệu thật, AGY đã chuẩn bị giải pháp kết nối dữ liệu an toàn cho Vibecode Lab:
- **Tạo Adapter dữ liệu thật Read-Only trong Lab:** Cập nhật cơ chế nạp dữ liệu của Vibecode Lab (`mock-adapter.js` và `fixtures/`) để trỏ thẳng tới **nội dung thật từ `server/data/`** thay vì dùng dữ liệu giả lập 7 người.
- **Bảo toàn 100% nguyên trạng:**
  - Không thay đổi dù chỉ một dấu chấm hay dấu phẩy của văn bản gốc.
  - Giữ trọn vẹn 223 nhân vật, 12 bài viết MẠCH, 185 tư liệu ảnh và 8 thư Clara.
  - SQLite Database `server/family_archive.db` và Production tiếp tục được cách ly với **0 thao tác ghi**.

---
*Báo cáo Batch 2A hoàn thành và sẵn sàng chuyển tiếp sang Batch 2B (Dynamic Rendering).*

