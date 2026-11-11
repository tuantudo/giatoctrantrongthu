# DESIGN-001 REVISION BRIEF: PUBLIC / MEMBER INFORMATION ARCHITECTURE

**Status:** REVISION (Chờ phản biện từ OpenCode & Prototype revision từ Cline)
**Tài liệu tham chiếu:** 2026_WEBDESIGN_WORKFLOW.md, PROJECT_CONTROL_SURFACE.md

## 1. BỐI CẢNH & KHÁM PHÁ (OWNER DISCOVERY)
Sau vòng Visual Review đầu tiên của DESIGN-001, Owner xác định prototype hiện tại đang mắc lỗi **"dump data"** (đổ ập toàn bộ dữ liệu 228 thành viên, 68 gia đình, cây gia phả ra trang chủ). 
Trang chủ cần phải trả lời câu hỏi cốt lõi trước: *"Gia Tộc Trần Trọng Thu là ai?"*, và phải phân tách rõ ràng luồng trải nghiệm của khách vãng lai (Public/World) so với người trong họ (Member).

## 2. PHÂN ĐỊNH AUDIENCE & BOUNDARIES
Kiến trúc luồng thông tin (IA) phải được phân chia thành 3 lớp ranh giới rạch ròi:

### A. PUBLIC / WORLD (Khách vãng lai)
- **Mục tiêu:** Tìm hiểu lịch sử, con người, ký ức, và giá trị của dòng họ.
- **Trải nghiệm:** Nhìn nhận trang web như một *Online Publication / Living Archive*.
- **Giới hạn:** Không bị choáng ngợp bởi database nội bộ. Khai thác dữ liệu dưới dạng "Curated Content" (Nội dung được biên tập).

### B. MEMBER (Người trong dòng họ)
- **Mục tiêu:** Kết nối, giao tiếp, xem lịch giỗ/chạp, tương tác với cây gia phả chi tiết, và đóng góp tư liệu.
- **Trải nghiệm:** "Tư cách thành viên" là một không gian riêng tư (Member Space), bước qua cánh cửa từ Public Homepage. 
- **Giới hạn:** Tách biệt với nhóm Public. Member Space có chức năng như một community portal thu nhỏ, không phơi bày ra homepage.

### C. OWNER CONTROL PLANE (Admin/Governance)
- **Mục tiêu:** Quản trị dữ liệu, cấu hình hệ thống, duyệt nội dung.
- **Giới hạn:** Tuyệt đối không được trộn lẫn vào Publication IA hay Navigation công khai. Nó là bề mặt kiểm soát (Control Surface) hoàn toàn độc lập ở phía sau.

## 3. HOMEPAGE NARRATIVE & INFORMATION HIERARCHY MỚI
Trang chủ không phải là một Dashboard. Trình tự kể chuyện (Narrative Hierarchy) mới được đề xuất:

1. **IDENTITY (Nhận diện):** Masthead ngang tĩnh tại, định vị thương hiệu "Gia Tộc Trần Trọng Thu - Từ 1872 đến chúng ta".
2. **INTRODUCTION (Giới thiệu):** Một Lead section / Hero section trả lời ngắn gọn "Chúng tôi là ai?".
3. **ORIENTATION & CHOOSE YOUR PATH (Định hướng):**
   - Rẽ nhánh 1: Khám phá Publication / Living Archive (Đọc MẠCH, xem Tư Liệu).
   - Rẽ nhánh 2: Bước vào Tư cách Thành viên (Member Entry / Cổng nội bộ).
4. **CURATED CONTENT (Nội dung biên tập):** Các bài viết MẠCH nổi bật, Ký ức được chọn lọc kể chuyện (không phải database dump).
5. **DEEPER EXPLORATION (Khám phá sâu):** Các liên kết đi vào kho lưu trữ (Archive), footer, colophon.

### Phân loại nội dung trang chủ cũ:
- **Giữ lại (Nhưng quy hoạch lại):** Masthead, Lead bài viết MẠCH.
- **Chuyển thành Curated Content:** Ký ức (Chỉ hiện 1-2 câu chuyện truyền cảm hứng, không phải danh sách), Tư liệu (Hiển thị dạng Featured Document).
- **Di chuyển xuống dưới (De-prioritize):** Các con số thống kê tổng quát (Nếu có giữ thì chỉ đóng vai trò gia vị cho phần Introduction).
- **Loại khỏi homepage & Đẩy vào Member Space:** Danh sách 228 thành viên, 68 gia đình, cây phả đồ chi tiết, Lịch giỗ/sinh nhật chi tiết (Lịch có thể hiện ở sidebar Public nhưng dưới dạng "Sự kiện sắp tới của dòng họ" mang tính chất văn hóa, thay vì nhắc nhở cá nhân).

## 4. GLOBAL PUBLICATION SHELL (INVENTORY)
Lấy cảm hứng từ cấu trúc xương (skeleton) của Tia Sáng, hệ thống Shell (Chrome) của Gia Tộc cần có các thành phần sau:

### A. Navigation & Masthead
- **Sticky/Persistent Navigation:** Navigation bar tiếp tục bám dính khi cuộn trang (Scroll).
- **Trạng thái đầu trang:** Masthead to, rõ ràng, mang tính editorial.
- **Icon Hóa:** Các menu tiện ích (Home, Search, Settings) nên được chuyển thành Icon để tối ưu không gian cho các Chuyên mục chính (MẠCH, Tư Liệu, v.v.).

### B. Reading Tools (Công cụ đọc)
Dành riêng cho trang chi tiết bài viết (Article detail), không nhét vào Navigation chính:
- Tăng/Giảm cỡ chữ (`A-`, `A+`)
- Share / Social
- Comment / Bookmark
- Print

### C. System Tools
- Back-to-top (Floating action).
- Chatbot (Nút gọi trợ lý ảo).

### D. Footer / Colophon
- Footer phải có nội dung thật mang tính lưu trữ (Thông tin ban liên lạc, địa chỉ, năm thành lập, bản quyền, link đến các phân hệ chính), không phải footer dummy.

## 5. PHÂN RÃ CÔNG VIỆC (ARCHITECTURE SEPARATION)
Để tránh lạm dụng Prototype, cần làm rõ:
- **Design Revision (Nhiệm vụ của Prototype hiện tại):** Áp dụng ngay Narrative mới vào `/design-playground/design-001-homepage/`. Thay đổi HTML/CSS layout để hiển thị cấu trúc Public vs Member Entry. Thiết lập Sticky Nav.
- **Design System:** Quy chuẩn hóa kích thước icon (Home/Search/Settings), font size của Reading Tools vào biến CSS.
- **Future Product Architecture:** Xây dựng luồng Authenticated Member Space (Xử lý DB, Auth, Role) -> Đây là dự án tương lai, KHÔNG nằm trong DESIGN-001.
- **Production Implementation:** Áp dụng code từ Prototype sang `app.js` và `index.html` của Production (CHỈ thực hiện sau khi Tuấn duyệt Visual/IA).

## 6. OPEN QUESTIONS (CÂU HỎI CHỜ OWNER QUYẾT ĐỊNH)
1. **Member Entry Design:** Nút/Khu vực "Tư cách thành viên" nên nằm ở góc phải trên cùng (Utility bar) hay là một khối nội dung to (Block) nằm giữa trang chủ?
2. **Lịch (Calendar):** Nên giữ Sidebar Lịch trên trang chủ Public hay dời hoàn toàn vào Member Space? (Nếu để Public, người ngoài sẽ thấy ngày giỗ của các cụ - điều này có phù hợp với văn hóa lưu trữ mở không?).
3. **Thống kê Gia Phả:** Các con số (228 người, 68 gia đình) có nên giữ lại 1 dòng text nhỏ trên Homepage (để chứng minh bề dày) hay giấu đi hoàn toàn?

---
*Tài liệu này là cơ sở để OpenCode phản biện kỹ thuật và Cline tiến hành cập nhật bản nháp (Prototype Revision) trong Design Playground.*
