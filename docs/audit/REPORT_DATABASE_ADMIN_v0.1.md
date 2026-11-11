# BÁO CÁO NHIỆM VỤ DATABASE ADMIN v0.1

## 1. What was inspected
- Kiểm tra file biến môi trường (`server/.env` và `server/.env.example`).
- Viết script Node.js kiểm tra kết nối tới MariaDB ở host `100.80.147.119`.
- Query cấu trúc bảng (schema) và đếm số dòng (row counts) trên SQLite Runtime (`server/family_archive.db`).
- Kiểm tra tính toàn vẹn khóa ngoại (Foreign Keys) trên các bảng `memories`, `person_media`, `identity_mappings`.

## 2. What was verified
- **Local SQLite DB** đã được map hoàn chỉnh và hiểu rõ dữ liệu thực tế đang có gì. Cấu trúc bảng trùng khớp với Node initialization.
- Đã phát hiện được cách dữ liệu Genealogy được lưu trữ (nhét mảng JSON con cái vào payload của `families`, không xài `edges`).

## 3. What was NOT verified
- **MariaDB Production:** Không thể truy cập vì nhận lỗi `Access denied for user 'root'@'localhost'` (hoặc có thể do permission/host map). Nên dừng ở mức READ-ONLY SQLite và báo cáo NOT VERIFIED.
- **Synology File Structure:** Không nằm trong scope mission này.

## 4. Current physical database
- DB name: `family_archive`
- Table count: 14 (bao gồm các bảng trống)
- Các bảng quan trọng: `people`, `families`, `memories`, `media`, `person_media`, `accounts`.
- Mọi bảng đều có chung một kiểu thiết kế tĩnh, cột `payload` đóng vai trò lưu trữ JSON. Không có constraint.

## 5. Current data counts
- `people`: 223
- `families`: 68
- `timeline`: 215
- `media`: 185
- `person_media`: 173

## 6. Integrity findings
- **[CRITICAL]** Toàn bộ `person_media` bị hỏng giá trị `media_id` (trị số `NULL`).
- **[CRITICAL]** Database thiếu khai báo Foreign Key ở cấp độ schema.

## 7. Current vs Target gap
- Domain model (Target) có `FamilySpace`, `Claim`, `Evidence`, `Submission` nhưng Database (Current) hoàn toàn chưa có những bảng này.
- Relationship trong Target được mong đợi lưu ở bảng trung gian, nhưng Database nhét cứng vào JSON trong `payload`.

## 8. UI implemented
- Đã thêm màn hình `Database` vào Admin Control Room (route `#/database`).
- Đã code endpoint `/api/admin/database/schema` ở `server/index.js` trả về danh sách table, engine và số dòng.
- Admin UI hiển thị rõ ràng Overview, SoT, Tables, và các lỗi Integrity được trích xuất.

## 9. Files changed
- Tạo mới 5 file trong thư mục `docs/database/`.
- `admin/index.html` (Thêm nút điều hướng).
- `server/index.js` (Thêm API backend).
- `admin/js/admin.js` (Thêm hàm render).

## 10. Security considerations
- Toàn bộ quá trình là READ-ONLY. Tuyệt đối không xóa/sửa dữ liệu.
- Không in credential hay hash ra report. 
- Không sửa production.

## 11. Remaining decisions
- Khi có quyền truy cập MariaDB thật sự, DBA Guide cần được bổ sung cụ thể cách connect bằng IDE như DBeaver.
- Cần có Human Decision về việc bao giờ sẽ bổ sung Database Constraint và tách JSON payload ra các cột SQL thuần.

## 12. Recommended next step
- Fix lỗi `media_id = NULL` bằng cách cho chạy lại một script Seed riêng cho ảnh.
- Bổ sung Foreign Keys cho SQLite/MariaDB để siết chặt tính toàn vẹn (Integrity).
