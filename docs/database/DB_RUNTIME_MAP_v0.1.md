# DB RUNTIME MAP v0.1

## 1. Môi trường Thực thi (Runtime Environment)
- **MariaDB Production (Target):**
  - Host: `100.80.147.119` (từ file `.env`)
  - Port: `3306`
  - Tên CSDL: `family_archive`
  - Role: Production Database.
  - *Trạng thái:* **NOT VERIFIED**. Không thể kết nối từ local dev hiện tại (Lỗi "Access denied for user 'root'@'localhost'"). Có thể do MariaDB server hạn chế kết nối từ xa hoặc cấu hình host map.

- **SQLite Local (Working Copy):**
  - File: `server/family_archive.db`
  - Role: Development / Runtime Working Copy.
  - *Trạng thái:* **VERIFIED**. Code `server/index.js` có hỗ trợ khởi tạo và truy vấn trên SQLite này thông qua `dbAccessor`.

## 2. Các Thành phần Dữ liệu (Data Components)
Để tránh nhầm lẫn "tất cả là database", đây là sự phân định:
- **MariaDB Runtime (NAS):** Hệ quản trị cơ sở dữ liệu (RDBMS) vận hành hệ thống thực tế (khi deploy).
- **SQLite Runtime (Local):** Bản sao thu gọn dùng file `.db` để dev mà không cần NAS bật.
- **NAS Canonical Files (Synology):** Nơi chứa phả hệ gốc và kho ảnh gốc (Source of Truth).
- **`genealogy.json`:** Một Artifact tĩnh dạng JSON được sinh ra (seed/projection), sau đó nạp (import) vào SQLite/MariaDB.
- **Application Variables:** Cấu hình qua `.env`, xác định dùng `mysql` (MariaDB) hay `sqlite3` thông qua biến `DB_CLIENT`.

## 3. Kiến trúc Truy xuất CSDL (Data Access Layer)
- **Driver:** Node.js dùng `mysql2/promise` (cho MariaDB) và `sqlite3` (cho SQLite local).
- **Trừu tượng hóa:** File `server/index.js` tự động định nghĩa object `dbAccessor` chứa 3 hàm `runQuery`, `allQuery`, `getQuery`.
- **Logic tự động hóa:** Các lệnh SQL được cấu trúc sử dụng cú pháp tương thích, hoặc dùng câu lệnh rẻ nhánh `useMariaDB ? "REPLACE INTO..." : "INSERT OR REPLACE INTO..."`.

## 4. Initialization & Migration
- **Khởi tạo bảng (Init):** Code tạo bảng tự động chạy mỗi khi khởi động server, dùng câu lệnh `CREATE TABLE IF NOT EXISTS` trong `server/index.js`.
- **Seed Data:** Nạp từ `server/db_seed.js`, lấy dữ liệu gốc từ `genealogy.json` nén vào cột `payload`.
- **Onboarding:** `server/dev_setup_onboarding.js` để tự động tạo tài khoản giả lập và mock identity mappings.

## 5. Kết luận phần này
Vì MariaDB thật không thể tiếp cận (do permission/mạng), các Inventory tiếp theo sẽ soi chiếu dựa trên bản **SQLite Local Runtime**, nơi cấu trúc bảng giống hệt do cùng được sinh ra từ `server/index.js`.
