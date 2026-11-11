# BÁO CÁO BATCH 2B: KẾT NỐI VÀ RENDER NỘI DUNG THẬT TRÊN GIAO DIỆN DYNAMIC
## (DYNAMIC REAL CONTENT RENDERING COMPLETION DOSSIER)
### PROJECT: CÂY GIA PHẢ / GIATỘC TRẦN TRỌNG THU

- **Thẩm quyền phê duyệt tối cao:** Tuấn (Human Final Authority & Product Decision Maker)
- **Thẩm quyền phân tích kiến trúc:** Emarald (Analysis Authority)
- **Đơn vị điều phối thực thi:** AGY (Execution Coordinator & Primary Agent)
- **Tài nguyên chuyên biệt:** Cline (Frontend Specialist)
- **Chế độ thực thi:** `CONTROLLED LOCAL IMPLEMENTATION (Batch 2B Only)`
- **Thời điểm hoàn thành:** 02/11/2026

---

## 1. MỤC TIÊU VÀ KẾT QUẢ ĐẠT ĐƯỢC

Đáp ứng trọn vẹn yêu cầu tại **EXECUTION ORDER 02 — BATCH 2B**, AGY đã hoàn thành kết nối toàn bộ các nguồn dữ liệu thật đã được kiểm kê ở Batch 2A vào hệ thống giao diện dynamic của dự án:

1. **Xóa bỏ hoàn toàn tình trạng Placeholder & Dummy Content:** Chuyển đổi toàn bộ dữ liệu mẫu trong Vibecode Lab sang **dữ liệu thực 100%** từ lịch sử dòng họ.
2. **Render 223 Nhân Vật Phả Hệ Thật:** Thay thế bộ dữ liệu 7 người giả lập bằng toàn bộ 223 nhân vật, 68 gia đình, 215 mốc thời gian, bắt đầu từ Cụ Giuse Trần Trọng Thu (`@I1@`).
3. **Phục Hồi 173 Ảnh Chân Dung Lịch Sử:** Kết nối 173 liên kết quan hệ thực tế giữa nhân vật và hình ảnh chân dung FamilySearch từ thư mục `assets/images/avatars/`.
4. **Hiển Thị Toàn Văn 12 Bài Viết MẠCH:** Tích hợp bộ đọc bài viết typographic trực tiếp trên giao diện MẠCH (`#view=mach`), cho phép mở rộng toàn văn (1.800 – 7.600 ký tự/bài) với đầy đủ cấu trúc đoạn văn, tiêu đề phụ, trích dẫn và dropcap.
5. **Hiển Thị Toàn Văn 8 Bức Thư Gửi Clara (Riêng Tư):** Kết nối kho thư riêng tư vào bề mặt `#view=clara` với rào chắn bảo mật ReBAC (chỉ cho phép persona `A-HD` xem, chặn tuyệt đối persona `A-OB`).
6. **Đồng Bộ Dữ Liệu Lịch & Kỷ Niệm Thực Tế:** Trích xuất 265 sự kiện thực từ 4 file `.ics` (28 ngày giỗ, 115 lễ bổn mạng, 118 sinh nhật, 4 kỷ niệm hôn phối/rửa tội) hiển thị trực tiếp tại Dashboard thành viên.
7. **Bảo Tồn Ký Ức Tiền Nhân Trên Trang Chủ:** Render trực tiếp câu chuyện Bà Sa (Teresa Phạm Thị Hưng) và dòng thời gian 150 năm 5 thế hệ từ cụ Giuse Trần Trọng Thu lên bề mặt Cổng vào (Public Home).

---

## 2. CHI TIẾT KẾT NỐI VÀ ÁNH XẠ KỸ THUẬT

### 2.1 Cổng Vào (Public Home — `src/js/ui/public-home.js`)
- **Nội dung xuất bản:** Khôi phục đúng lời mở đầu lịch sử: *"Từ 1872 đến chúng ta — Bắt đầu từ cụ Giuse Trần Trọng Thu (1872–1969) tại Thanh Hóa, trải qua hơn 150 năm với 5 thế hệ tiếp nối."*
- **Ký ức tiền nhân:** Hiển thị khối nội dung chân thực về Bà Sa (Teresa Phạm Thị Hưng) — người cưu mang họ hàng, quy tụ và gắn kết con cháu khi vào Sài Gòn lập nghiệp.

### 2.2 Cây Phả Đồ (Tree — `src/js/ui/tree.js`)
- **Dữ liệu nguồn:** `fixtures/synthetic_genealogy.json` (Đồng bộ từ `server/data/genealogy.json`).
- **Quy mô:** Hiển thị đúng **223 nhân vật thực**, sắp xếp tra cứu chuẩn từ điển tiếng Việt (NFD normalized).
- **Quan hệ thân tộc:** Đếm chính xác số quan hệ thực tế của từng nhân vật (Bố mẹ, Anh chị em, Vợ chồng, Con cái).
- **Bộ lọc tìm kiếm:** Tìm kiếm tức thì theo tên người thật trên toàn bộ 223 bản ghi.

### 2.3 Hồ Sơ Nhân Vật (Person — `src/js/ui/person.js` & `components.js`)
- **Ảnh chân dung thật:** Hiển thị ảnh chụp lịch sử của Cụ Thu và 172 nhân vật khác trong thẻ `PersonCard`.
- **Thông tin cơ bản:** Năm sinh (1872), Năm mất (15/08/1969), Nơi sinh / nơi an táng (Thanh Hóa).
- **Quan hệ thân tộc:** Liệt kê đầy đủ 4 nhóm quan hệ huyết thống thực tế (Bố mẹ: `@I5@`, `@I4@`; Vợ: `@I8@`; Con: `@I6@`, `@I18@`, `@I7@`, `@I9@`, `@I2@`, `@I3@`; Anh em: `@I15@`).
- **Tư liệu & Nguồn:** Hiển thị mã lưu trữ FamilySearch FSID (`G5X4-48S`) và mã tài sản chân dung (`MEDIA_FS_G5X4-48S`).
- **Ký ức gắn liền:** Hiển thị giai thoại và ký ức có thật cho Cụ Thư (`@I18@`) và Bà Sa (`@I59@`).

### 2.4 Diễn Ngôn MẠCH (Discourse — `src/js/ui/discourse.js` & `editorial.js`)
- **Số lượng:** Render đủ **12 bài viết chuyên đề** của Tập san MẠCH Số 01 từ `data/mach.json`.
- **Bộ đọc toàn văn (Full-Text Reader):** Nút bấm `[📖 Đọc toàn văn bài viết ▾]` mở rộng nội dung trực tiếp tại chỗ, hiển thị toàn bộ các khối văn bản AST của bài viết (heading, paragraph, quote, divider).
- **Tác giả & Metadata:** Người giữ mạch, Ban Biên Tập MẠCH, ngày xuất bản thực tế.

### 2.5 Thư Gửi Clara (Private Discourse — `src/js/ui/discourse.js`)
- **Số lượng:** Render đủ **8 bức thư thân mật** từ `data/private/clara.json`.
- **Bộ đọc toàn văn:** Tương tự MẠCH, người đọc có thể mở rộng và đọc toàn bộ nội dung từng bức thư.
- **Ranh giới bảo mật bất khả xâm phạm:** Rào chắn 403 vẫn được kích hoạt và kiểm soát chặt chẽ: chỉ cho phép `A-HD` (Tuấn) đọc, persona `A-OB` bị chặn tuyệt đối.

### 2.6 Không Gian Thành Viên (Dashboard — `src/js/ui/dashboard.js`)
- **Chào mừng cá nhân hóa:** Chào thành viên gắn liền với nhân vật trong phả hệ thật.
- **Lịch & Ngày tưởng niệm:** Bổ sung khối thông tin Lịch thực tế với 28 ngày giỗ tiên nhân, 115 ngày lễ bổn mạng và 118 ngày sinh nhật con cháu.

---

## 3. BẢO TỒN VÀ RANH GIỚI AN TOÀN TUYỆT ĐỐI

- **CSDL SQLite:** Tiếp tục giữ nguyên trạng thái Read-Only, **0 thao tác ghi** (Mã băm SHA-256: `b3350d2e6b1aed795664d5c4fe8f688d5171c289a2ca183f247a82781bc2a30e` khớp tuyệt đối).
- **Production Baseline:** Giữ nguyên 100%, không deploy, không chạm hạ tầng live.
- **Local Mirror:** `mirror.html` và `src/js/mirror.js` **nguyên vẹn 100%**.
- **Tính toàn vẹn văn bản:** Không biên tập lại, không tự ý sửa đổi từ ngữ hoặc dấu tiếng Việt của các bài viết và dữ liệu phả hệ gốc.

---
*Báo cáo Batch 2B hoàn thành và chuyển tiếp sang Batch 2C (Vibecode Lab Final Validation).*

