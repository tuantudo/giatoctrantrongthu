# DATABASE DECISIONS REQUIRED v0.3
*(Human Decision Queue)*

Dưới đây là hàng đợi các quyết định (Decisions) mà Human (Owner) cần đưa ra để hệ thống có thể chuyển sang bước vận hành/phát triển tiếp theo một cách an toàn. Agent không được tự ý quyết định thay.

## 1. Xử lý Sự cố Bảo mật (Secret Exposure)
- **Vấn đề:** Mật khẩu MariaDB đã bị ghi lại dưới dạng Plaintext trong phiên làm việc của Agent.
- **Quyết định cần đưa ra:** Human có cần Rotate (Đổi) mật khẩu `<SECRET_REMOVED>` ở server NAS hay không? (Đặc biệt nếu mật khẩu này được dùng chung ở nhiều chỗ).

## 2. Phương thức kiểm chứng MariaDB an toàn
- **Vấn đề:** Hiện tại MariaDB đang `NOT VERIFIED`. 
- **Quyết định cần đưa ra:** Cung cấp cho hệ thống/Agent một phương thức kết nối an toàn (ví dụ: SSH Tunnel, cấp quyền IP, hoặc chạy Script Migration qua một cổng trung gian không lộ credential) để đồng bộ hóa MariaDB với SQLite.

## 3. Xử lý 173 NULL media_id
- **Vấn đề:** `person_media` chứa toàn NULL, gây hỏng phần hiển thị ảnh.
- **Quyết định cần đưa ra:** Cho phép tạo một Task "Reseed Media Data" để viết lại script bóc tách JSON và cập nhật cột `media_id` cho chuẩn xác.

## 4. Xử lý Bug hiển thị `birthYear [object Object]`
- **Vấn đề:** Lỗi nằm ở tầng API/UI, không phải Database.
- **Quyết định cần đưa ra:** Giao Task cho Agent Cline hoặc Backend để sửa logic parse JSON trong `app-v2.js` / API Endpoint.

## 5. Quy trình Backup & Đồng bộ
- **Vấn đề:** SQLite đang hoạt động tốt như một Runtime Working Copy. 
- **Quyết định cần đưa ra:** Khi nào thì SQLite này cần được nạp lại (Reseed) từ NAS `genealogy.json`? Quy trình Backup tự động trước khi Reseed sẽ diễn ra như thế nào?

## 6. Lộ trình Migration & Chuẩn hóa
- **Vấn đề:** Code hiện tại dùng SQL chắp vá (JSON payload, không Foreign Keys).
- **Quyết định cần đưa ra:** Bao giờ thì dự án chính thức cho phép gỡ bỏ thiết kế "Cache JSON" hiện tại để chạy Database Migration tạo Constraints và chia tách các bảng (Table Normalization)? (Nên đợi hoàn thành UI Prototype hay làm ngay?).
