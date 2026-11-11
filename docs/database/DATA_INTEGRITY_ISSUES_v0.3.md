# DATA INTEGRITY ISSUES v0.3

*Tài liệu theo dõi các lỗi toàn vẹn dữ liệu đã được xác nhận (VERIFIED).*

## ISSUE 01: Mất toàn bộ liên kết hình ảnh
- **ID:** `DI-01-MEDIA-LINK`
- **TABLE:** `person_media`
- **FIELD:** `media_id`
- **OBSERVED CONDITION:** Chứa giá trị `NULL` cho tất cả các dòng.
- **COUNT:** 173/173 rows bị `NULL`.
- **EVIDENCE:** Truy vấn trực tiếp `SELECT COUNT(*) FROM person_media WHERE media_id IS NULL;` trả về 173. Không có bản ghi nào chứa ID thực sự.
- **POSSIBLE IMPACT:** Giao diện không thể load ảnh của nhân vật, hoặc sinh lỗi ở API khi query.
- **NOTES:** Lỗi này có khả năng cao xuất phát từ script import (`db_seed.js`).
- **RECOMMENDED HUMAN DECISION:** Viết script reseed riêng cho phần ảnh (Media) để cập nhật lại `media_id`.

## ISSUE 02: Lỗi hiển thị BirthYear [object Object]
- **ID:** `DI-02-BIRTHYEAR-REPRESENTATION`
- **TABLE:** `people`
- **FIELD:** `birthYear` / `payload`
- **OBSERVED CONDITION:** Giao diện hiển thị năm sinh là `[object Object]`.
- **COUNT:** 0 (Tại tầng Physical Database).
- **EVIDENCE:** Truy vấn `SELECT COUNT(*) FROM people WHERE birthYear LIKE '%[object Object]%'` trả về 0. Truy vấn vào cột `payload` cũng trả về 0.
- **POSSIBLE IMPACT:** Giao diện hoặc API sẽ render object JSON thay vì chuỗi text hợp lệ.
- **NOTES:** Lỗi này được xếp loại vào **Tầng Application/UI (Representation Issue)**, KHÔNG PHẢI lỗi dữ liệu vật lý. Khả năng cao Node.js đọc cột JSON `payload` và toString() một object mà chưa parse đúng key.
- **RECOMMENDED HUMAN DECISION:** Debug API endpoint hoặc Frontend Component lấy thông tin năm sinh, không cần can thiệp Database.
