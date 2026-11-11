---
name: database-migration
description: >-
  Quy trình sao lưu vật lý, chỉnh sửa cấu trúc (DDL), nạp lại dữ liệu (Reseed)
  và đối soát toàn vẹn cơ sở dữ liệu SQLite và MariaDB.
---

# KỸ NĂNG: DATABASE MIGRATION & HARDENING

## 1. Điều Kiện Kích Hoạt (Trigger)
- Thực hiện TASK-07 (Sửa seed script), TASK-08 (Reseed dữ liệu media), hoặc TASK-10 (Tạo canonical DDL).
- Khi cần cập nhật cấu trúc bảng, thêm cột, hoặc đồng bộ hóa sang MariaDB NAS.

## 2. Phạm Vi & Phân Quyền (Scope & Ownership)
- **Chủ sở hữu:** AGY (Backend Owner).
- **Thư mục liên quan:** `server/family_archive.db`, `server/db_seed.js`, `database/canonical_schema.sql`.
- **Chốt chặn:** BẮT BUỘC có phê duyệt của Tuấn tại **GATE-02** trước khi can thiệp vào CSDL.

## 3. Quy Trình Thực Hiện (Procedure)
1. **Bước 0: Sao lưu vật lý nguyên trạng (Physical Backup):**
   ```bash
   cp server/family_archive.db server/family_archive.db.bak
   ```
   Xác nhận kích thước và checksum của file `.bak`.
2. **Sửa đổi script nạp / migration:**
   - Sửa thuộc tính ánh xạ trường (ví dụ: `pm.media_id` trong `db_seed.js`).
   - Chuẩn hóa câu lệnh SQL tương thích cả SQLite lẫn MariaDB.
3. **Thực thi migration / reseed trong môi trường cô lập:**
   - Chạy script seed/migration trên SQLite cục bộ.
4. **Đối soát tính toàn vẹn dữ liệu (Integrity Verification):**
   - Đếm số lượng cá nhân: `SELECT COUNT(*) FROM people` (phải = 223).
   - Đếm số lượng gia đình: `SELECT COUNT(*) FROM families` (phải = 68).
   - Đếm số lượng mốc thời gian: `SELECT COUNT(*) FROM timeline` (phải = 215).
   - Đếm số lượng media: `SELECT COUNT(*) FROM media` (phải = 185).
   - Đếm số lượng liên kết lỗi: `SELECT COUNT(*) FROM person_media WHERE media_id IS NULL` (phải = 0).
5. **Kế hoạch Rollback:**
   Nếu có bất kỳ lỗi nào, khôi phục ngay lập tức từ file `.bak`:
   ```bash
   cp server/family_archive.db.bak server/family_archive.db
   ```

## 4. Tiêu Chí Nghiệm Thu (Completion Criteria)
- Đã tạo bản sao lưu `.bak`.
- Kết quả đếm số lượng bản ghi đạt chuẩn 100%, 0 bản ghi mồ côi.
- Tỷ lệ `media_id IS NULL` giảm chính xác về 0.

