# GIA TỘC DBA CHECKLIST v0.1

*Bảng kiểm tra định kỳ dành cho Data Steward của Gia Tộc*

## ☀️ DAILY / KHI CẦN THIẾT (Monitoring nhanh)
- [ ] **Database Reachable?** Truy cập thử trang web, dữ liệu có tải lên bình thường không?
- [ ] **Application can connect?** Check log server xem có văng lỗi "Access denied" hay "ECONNREFUSED" không. (Ví dụ lỗi MariaDB hiện tại).
- [ ] **Unexpected Errors?** Có ai than phiền không tạo được Ký ức hoặc không lưu được bài MẠCH?
- [ ] **Disk Space?** NAS còn dung lượng không? Ổ cứng chứa MariaDB/SQLite có bị đầy do file log phình to không?
- [ ] **Suspicious Growth?** File `family_archive.db` có tự nhiên phình từ 1MB lên 1GB trong 1 ngày không?

## 📅 WEEKLY / ĐỊNH KỲ (Bảo trì)
- [ ] **Backup Status:** Lịch backup MariaDB trên NAS có chạy thành công không? (Cần thiết lập Synology HyperBackup hoặc cronjob mysqldump).
- [ ] **Integrity Check:** Có Orphan records (Rác) nào sinh ra trong tuần qua không? (Ví dụ bài viết MẠCH bị mất nội dung, hoặc Hình ảnh không có liên kết).
- [ ] **Storage Growth:** Dữ liệu hình ảnh (media) tải lên tốn bao nhiêu GB?
- [ ] **Unusual Rows:** Bảng `admin_users` hoặc `accounts` có xuất hiện user lạ không?

## 🛠️ BEFORE SCHEMA CHANGE (Trước khi sửa cấu trúc Bảng)
- [ ] **Backup exists?** Đã copy file `family_archive.db` hoặc mysqldump MariaDB ra chỗ an toàn chưa?
- [ ] **Current schema inspected?** Đã biết cột chuẩn bị sửa đang có kiểu dữ liệu gì chưa?
- [ ] **Affected tables known?** Sửa bảng `people` có làm vỡ bảng `identity_mappings` không?
- [ ] **Rollback plan?** Nếu update thất bại, làm sao để phục hồi trong vòng 5 phút?
- [ ] **Migration tested locally?** Đã chạy thử lệnh UPDATE/ALTER trên SQLite chưa trước khi đâm vào MariaDB?
- [ ] **Production untouched?** Đã đảm bảo MỌI TEST CHỈ CHẠY TRÊN LOCAL chưa?

## ✍️ BEFORE DATA CHANGE (Trước khi cập nhật Data lớn/Seed lại)
- [ ] **Source verified?** File `genealogy.json` mới nhất có chứa lỗi không?
- [ ] **Transaction used?** Đã dùng chế độ Transaction chưa hay chạy lệnh trực tiếp?
- [ ] **Backup available?** Có bản copy trước khi chạy lệnh đè dữ liệu (REPLACE/UPDATE) không?
- [ ] **Rollback available?** Đã biết cách revert lại trạng thái cũ chưa?
