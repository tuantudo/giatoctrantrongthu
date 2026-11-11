# BÁO CÁO: LOCAL DB RUNTIME (SQLITE)

## 1. MỤC TIÊU & HIỆN TRẠNG
Tài liệu này xác nhận **SQLite (`family_archive.db`)** đã được thiết lập thành cơ sở dữ liệu Runtime chính thức cho môi trường Local Development. Không còn bất kỳ luồng dữ liệu nào ở frontend đọc trực tiếp từ static JSON. Kiến trúc hiện hành đảm bảo Frontend hoàn toàn decoupling (tách bạch) khỏi Database Engine. 

## 2. KIỂM TRA ĐƯỜNG ĐI DỮ LIỆU (API → DB PATH)
Toàn bộ request từ UI đều đi qua Backend Abstraction Layer:
- **UI Fetch** `GET /api/people` → **Express Route** `app.get('/api/people')` → **DB Abstraction** `allQuery('SELECT * FROM people')` → **SQLite Driver**.

Phân rã chi tiết các Endpoint:
*   **Các Endpoint đọc từ SQLite:**
    *   `/api/member/profile` (Query bảng `accounts`, `identity_mappings`, `people`)
    *   `/api/people` (Query bảng `people`)
    *   `/api/genealogy.json` (Query bảng `people`, `families`, `memories`, `timeline`)
    *   `/api/mach.json` (Query bảng `stories`, `authors`, `series`)
    *   `/api/media.json` và `/api/person_media.json` (Query bảng `media`, `person_media`)
*   **Các Endpoint đọc từ file tĩnh (`genealogy.json`):**
    *   **KHÔNG CÓ.** Tệp `genealogy.json` hiện chỉ đóng vai trò là **Seed Source** (Nguồn dữ liệu gốc dùng để nạp vào DB lần đầu), không phải Canonical DB.

## 3. CẤU HÌNH STARTUP & MIGRATION (MARIADB READY)
Hệ thống sử dụng cơ chế `DB_CLIENT` switch pattern tại `server/index.js`.
- **Startup Cấu hình hiện tại:** `DB_CLIENT=sqlite3 DB_PATH=./family_archive.db node index.js`
- **Sẵn sàng cho NAS MariaDB:** Khi cần nối với NAS, chỉ cần sửa `.env`:
  ```env
  DB_CLIENT=mysql
  DB_HOST=192.168...
  DB_USER=...
  DB_PASSWORD=...
  DB_NAME=family_archive
  ```
  Code Backend và Frontend sẽ tự động thích ứng mà không cần sửa đổi (Zero UI/API rewrite).

## 4. AUDIT HARDCODED SQLITE & KHUYẾN NGHỊ MIGRATION
Quá trình rà soát (`grep`) phát hiện ra một số file nằm ngoài DB Layer đang hardcode thư viện `sqlite3`:
*   `server/db_seed.js`
*   `server/db_reset.js`
*   `server/dev_setup_onboarding.js`
*   `server/create_admin_user.js`
*   `server/setup_db.js`

**Đánh giá & Xử lý:**
- Đây là các Script thao tác (Operation Scripts) phục vụ Data Seeding/Admin, không nằm trong Runtime API phục vụ User.
- Do scope an toàn, hiện tại em quyết định **KHÔNG** đập đi viết lại các file này.
- **Khuyến nghị Migration:** Khi chuyển sang Production MariaDB, các kịch bản Seeding (`db:seed`, `db:reset`) cần được viết lại bằng MySQL syntax (ví dụ tạo `db_seed_mysql.js`) HOẶC cấu trúc lại dùng chung Abstraction.

## 5. KẾT LUẬN
- Local App hoàn toàn có thể tiếp tục dev với SQLite khi NAS offline.
- Data flow chuẩn mực, đáp ứng 100% Acceptance Criteria.
