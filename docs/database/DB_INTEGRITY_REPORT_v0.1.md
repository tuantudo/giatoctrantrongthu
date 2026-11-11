# DB INTEGRITY REPORT v0.1

*Báo cáo dựa trên 100% dữ liệu Local SQLite (`family_archive.db`)*

## DATA INVENTORY (SỐ LƯỢNG RECORD THỰC TẾ)
- `people`: 223
- `families`: 68
- `timeline`: 215
- `media`: 185
- `person_media`: 173
- `accounts`: 1
- `identity_mappings`: 1
- `admin_users`: 2
- `memories`: 2
- `stories`: 1
- Bảng rỗng (0 rows): `edges`, `authorities`, `calendar_events`, `authors`, `series`.

## BÁO CÁO TOÀN VẸN DỮ LIỆU (INTEGRITY FINDINGS)

### [CRITICAL] Mất toàn bộ liên kết hình ảnh (Media Link Loss)
- **Triệu chứng:** Trong bảng `person_media`, toàn bộ 173 records đều chứa giá trị `NULL` ở cột `media_id`. 
- **Hệ quả:** Bất kỳ query nào join từ `people` ra `media` đều sẽ không tìm thấy ảnh chân dung/tài liệu của nhân vật, gây lỗi hiển thị (avatar trống hoặc vỡ layout hình ảnh).
- **Nguyên nhân cốt lõi:** Lỗi trong script `server/db_seed.js`. Khả năng cao do đoạn lấy JSON bị sai tên trường nên khi `INSERT INTO person_media (..., media_id)` biến bị undefined/null.

### [CRITICAL] Không có Foreign Key Constraints ở Database Level
- **Triệu chứng:** Lệnh khởi tạo bảng (CREATE TABLE) trong `server/index.js` không hề khai báo `FOREIGN KEY (...) REFERENCES ...`.
- **Hệ quả:** Nếu có bug ở Code, nó có thể xóa một `Person` nhưng để lại rác trong `memories` hoặc `identity_mappings` mà Database không thể chặn hay báo lỗi.
- **Lời khuyên:** Cần cấy `FOREIGN KEY` trong bản migration tiếp theo nếu MariaDB chưa có.

### [HIGH] Dữ liệu Cấu trúc phả hệ (Genealogy Construct) bị "Nén" vào JSON
- **Triệu chứng:** Bảng `families` có cấu trúc Relation vợ chồng (`husband_id`, `wife_id`), NHƯNG toàn bộ danh sách Con Cái (Children) bị tống hết vào cột `payload` dưới dạng mảng JSON `["@I1@", "@I15@"]`.
- **Hệ quả:** Rất khó cho DBA query "Liệt kê tất cả con cái của người này" bằng SQL chuẩn mà không dùng hàm bóc tách JSON (JSON_EXTRACT). Bảng `edges` sinh ra để khắc phục chuyện này thì lại đang RỖNG (0 rows).

### [MEDIUM] Admin và Member Account chưa hợp nhất
- **Triệu chứng:** Tồn tại cả bảng `admin_users` (2 rows) và `accounts` (1 row).
- **Hệ quả:** Phân mảnh dữ liệu User và Session. Một người nếu vừa là Member vừa là Admin sẽ phải quản lý đăng nhập 2 nơi.

### [INFO] Thiết kế tĩnh (Stateless Cache Design)
- **Triệu chứng:** Mọi bảng cốt lõi (people, families, timeline) đều có cột `payload` dạng text (chứa nguyên chuỗi JSON).
- **Đánh giá:** SQLite đang được sử dụng như một Cache/Document Store hơn là Relational DB thực sự. DB Runtime chỉ đóng vai trò chứa dữ liệu được copy từ File NAS (`genealogy.json`). Do đó rủi ro sai lệch dữ liệu nội tại ở SQLite không ảnh hưởng trực tiếp đến dữ liệu Gốc.
