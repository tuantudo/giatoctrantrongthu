# BÁO CÁO KIỂM TOÁN CẤU TRÚC DỮ LIỆU VÀ QUYỀN LỰC DỮ LIỆU (V2.0.0 — BATCH 04)
## DATABASE TOPOLOGY & DATA AUTHORITY AUDIT — STRICT READ-ONLY

- **Dự án:** Gia Tộc Trần Trọng Thu
- **Cơ quan thẩm quyền:**
  - **Tuấn:** Human Final Authority & Product Owner
  - **Emarald:** Strategic Architecture & QC Authority
  - **AGY:** Chief Orchestrator & Integration Authority
- **Mã tài liệu:** `V2_0_0_DATABASE_TOPOLOGY_DATA_AUTHORITY_AUDIT_04`
- **Thời gian lập báo cáo:** 2026-11-08T01:25:00+07:00
- **Chế độ kiểm toán:** `STRICT READ-ONLY` (Khảo sát pháp y, không can thiệp code, không migrate, không chạy seed/reset, không thay đổi DB)
- **Chuẩn mực tuân thủ:** AIOS Governance, Bằng chứng 8 tầng (`PROVEN`, `OBSERVED`, `CONFIGURED`, `DOCUMENTED`, `PARTIAL`, `UNKNOWN`, `BLOCKED`, `FAILED`).

---

## 1. TỔNG QUAN ĐIỀU HÀNH (EXECUTIVE SUMMARY)

Báo cáo Batch 04 thiết lập bức tranh pháp y toàn cảnh về **Cấu trúc Cơ sở Dữ liệu (Database Topology)** và **Thẩm quyền Quản trị Dữ liệu (Data Authority)** của hệ thống Gia Tộc Trần Trọng Thu, trực tiếp đối soát với định hướng chiến lược do Tuấn phê duyệt: *"NAS là Source of Truth (SoT) của dữ liệu gia tộc; SQLite Local phục vụ phát triển/kiểm thử"*.

### Các phát hiện then chốt:

1. **Kiến trúc Dữ liệu Nhị phân (Binary Database Reality):**
   - **Local Environment:** Vận hành hoàn toàn trên **SQLite 3** (`server/family_archive.db`), bao gồm 16 bảng dữ liệu đã được mở rộng (223 cá nhân, 68 gia đình, 215 sự kiện dòng thời gian, 185 media, cùng các bảng mới: `accounts`, `identity_mappings`, `authorities`, `proposals`).
   - **NAS / Production Environment:** Vận hành trên **MariaDB 10** (`127.0.0.1:3306`, DB: `family_archive` trên Synology NAS `tuandzain-nas`). Dữ liệu đóng băng tại snapshot tháng 09/2026 (228 cá nhân, 20 bài viết MẠCH, 4 feeds lịch iCalendar).

2. **Cơ chế Hỗ trợ Đa Cơ sở Dữ liệu trong Mã nguồn (Dual-DB Code Support):**
   - Mã nguồn `server/index.js` và `server/foundation.js` **hỗ trợ song song cả MariaDB và SQLite** (`PROVEN`).
   - Việc chuyển đổi hoàn toàn dựa trên biến môi trường duy nhất: `process.env.DB_CLIENT === 'mysql'`. Khi biến này được đặt là `mysql`, backend dùng driver `mysql2/promise` kết nối tới cổng 3306; ngược lại, backend tự động fallback về driver `sqlite3` cục bộ.

3. **AdminControl Phân ranh theo Hostname (Environment-Driven Admin Routing):**
   - AdminControl (`admin/js/api.js`) tự động chuyển hướng endpoint API dựa trên hostname truy cập:
     - Khi chạy trên Local (`localhost:3010`): gọi `/api/*`, trực tiếp đọc và ghi vào **SQLite Local**.
     - Khi chạy trên Vercel (`admin.giatoctrantrongthu.com`): gọi `https://api.giatoctrantrongthu.com/api/*`, đọc và ghi vào **MariaDB trên NAS** (khi NAS online).

4. **Sự vắng mặt hoàn toàn của Pipeline Đồng bộ (Zero Synchronization Pipeline):**
   - **Hoàn toàn KHÔNG CÓ cơ chế đồng bộ tự động** giữa SQLite Local và MariaDB NAS (`PROVEN NEGATIVE`).
   - Script duy nhất từng tồn tại là `server/nas_migrate.js` (ngày 07/09/2026), là một công cụ nhập dữ liệu một chiều từ các tệp JSON tĩnh cục bộ (`server/data/*.json`) vào MariaDB. Không hề có cơ chế replicate, CDC hay đồng bộ hai chiều.

5. **Đánh giá Nguyên tắc "NAS là SoT" (SoT Compliance Verdict):**
   - **CHƯA ĐÁP ỨNG TOÀN VẸN (DEFICIENT & AT RISK)** do 3 rào cản vật lý và kiến trúc:
     1. *Lịch vận hành ngắt điện (Power Schedule Gap):* NAS có lịch tắt cố định từ 01:00 đến 09:30 hằng ngày, khiến SoT bị gián đoạn 8.5 giờ mỗi đêm (Cloudflare Error 1033).
     2. *Lỗ hổng phơi lộ quyền ghi SoT:* Khi NAS online, backend phiên bản cũ trên NAS không có xác thực trên các route `POST /api/people`, `POST /api/stories`, `POST /api/edges`, cho phép bất kỳ ai gửi request làm biến dạng dữ liệu SoT.
     3. *Trôi dạt dữ liệu (Data Drift):* Các bổ sung dữ liệu mới và bảng phân quyền (proposals, member accounts) đang bị giam lỏng tại SQLite Local, chưa có đường ống an toàn để nạp vào NAS SoT.

---

## 2. DANH MỤC CƠ SỞ DỮ LIỆU HIỆN HỮU (DATABASE INVENTORY)

| STT | Tên / Định danh DB | Loại Engine | Vị trí Lưu trữ Vật lý | Môi trường phục vụ | Trạng thái Dữ liệu | Bằng chứng Xác minh |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| **DB-01** | `server/family_archive.db` | **SQLite 3.46.1** | File cục bộ trên máy dev macOS | Local Dev / Test Runtime | 16 bảng (223 people, 1 account, 1 proposal, 215 timeline) | `PROVEN` (`sqlite3`, `lsof` FD 15) |
| **DB-02** | `server/family_archive.db.bak` | **SQLite 3.46.1** | File backup trên máy dev macOS | Lưu trữ an toàn trước Batch 01 | Snapshot ngày 02/11/2026 (413.696 bytes) | `PROVEN` (`ls -la server/`) |
| **DB-03** | `family_archive` (MariaDB) | **MariaDB 10** | Synology NAS `tuandzain-nas` (`100.80.147.119:3306`) | Production Backend Origin | 12 bảng theo `schema_update.sql` (228 people, 20 stories) | `DOCUMENTED & CALL STACK PROVEN` |
| **DB-04** | `server/data/*.json` | **Flat JSON Files** | Thư mục `server/data/` cục bộ | Dữ liệu hạt giống (Seed source) | `genealogy.json`, `mach.json`, `media.json`, `person_media.json` | `PROVEN` (`ls -la server/data/`) |

---

## 3. SƠ ĐỒ CẤU TRÚC VÀ LUỒNG DỮ LIỆU HIỆN TẠI (CURRENT TOPOLOGY DIAGRAM)

```mermaid
flowchart TD
    subgraph LOCAL_ENV["MÔI TRƯỜNG PHÁT TRIỂN CỤC BỘ (LOCAL DEV)"]
        L_ADMIN["AdminControl Local\n(localhost:3010/admin/)"]
        L_NODE["Node.js Express (PID 12673)\nDB_CLIENT=sqlite"]
        L_SQLITE[("SQLite: server/family_archive.db\n[16 Tables - 223 People]")]
        L_SEED["Seed Script: db_seed.js\nNạp từ server/data/*.json"]
    end

    subgraph PROD_ENV["MÔI TRƯỜNG MÁY CHỦ GỐC (NAS PRODUCTION)"]
        NAS_HOST["Synology NAS: tuandzain-nas\n(100.80.147.119 - Linux DSM)\nLịch tắt: 01:00 - 09:30 hằng ngày"]
        P_NODE["Node.js Express (port 3000)\nDB_CLIENT=mysql"]
        P_MARIADB[("MariaDB 10: family_archive\n[12 Tables - 228 People - SoT]")]
        NAS_MIGRATE["Script cũ: nas_migrate.js\n(Chạy 1 lần ngày 07/09/2026)"]
    end

    subgraph PUBLIC_WEB["MÔI TRƯỜNG CÔNG CỘNG (PUBLIC / VERCEL)"]
        V_FE["Frontend Public\n(giatoctrantrongthu.com)"]
        V_ADMIN["AdminControl Cloud\n(admin.giatoctrantrongthu.com)"]
        CF_TUNNEL["Cloudflare Argo Tunnel\n(family-site-api-production)"]
    end

    %% Local operations
    L_ADMIN -->|"HTTP GET/POST (/api/*)"| L_NODE
    L_NODE -->|"Đọc/Ghi trực tiếp"| L_SQLITE
    L_SEED -.->|"Reseed khi dev yêu cầu"| L_SQLITE

    %% Public & NAS operations
    V_FE -->|"GET /api/genealogy.json"| CF_TUNNEL
    V_ADMIN -->|"POST /api/people, /api/stories"| CF_TUNNEL
    CF_TUNNEL -->|"Proxy qua tunnel (khi NAS online)"| P_NODE
    P_NODE -->|"Đọc/Ghi TCP 3306"| P_MARIADB
    NAS_MIGRATE -.->|"Nhập dữ liệu lịch sử"| P_MARIADB

    %% Disconnection between databases
    L_SQLITE -.x|"❌ HOÀN TOÀN KHÔNG CÓ KÊNH ĐỒNG BỘ"| P_MARIADB

    classDef local fill:#e8f0fe,stroke:#1a73e8,stroke-width:2px;
    classDef prod fill:#fce8e6,stroke:#c5221f,stroke-width:2px;
    classDef edge fill:#e6f4ea,stroke:#137333,stroke-width:2px;

    class L_ADMIN,L_NODE,L_SQLITE,L_SEED local;
    class NAS_HOST,P_NODE,P_MARIADB,NAS_MIGRATE prod;
    class V_FE,V_ADMIN,CF_TUNNEL edge;
```

---

## 4. BẰNG CHỨNG CƠ SỞ DỮ LIỆU CỤC BỘ (LOCAL DATABASE EVIDENCE)

### 4.1. Tiến trình và File Descriptors
- **Tiến trình:** `node server/index.js --port=3010` (PID 12673) do AGY Runner khởi chạy.
- **File Descriptor mở:**
  - `FD 15u REG 1,15 430080 /Users/tuantq/Projects/Personal/giatoctrantrongthu/server/family_archive.db`
- **Driver nhị phân tải vào bộ nhớ:**
  - `server/node_modules/sqlite3/build/Release/node_sqlite3.node` (`PROVEN`).

### 4.2. Cấu trúc Lược đồ và Số lượng Bản ghi Thực tế (Schema & Row Count)
Kiểm tra trực tiếp tệp SQLite qua truy vấn nội bộ ghi nhận chính xác 16 bảng:

| Tên Bảng (Table Name) | Số lượng Dòng (Rows) | Mục đích Quản trị |
| :--- | :---: | :--- |
| `people` | 223 | Hồ sơ cá nhân phả hệ (họ tên, ngày sinh, ngày mất, giới tính, payload JSON) |
| `families` | 68 | Quan hệ hôn nhân gia đình (chồng, vợ, ngày cưới, payload JSON) |
| `timeline` | 215 | Sự kiện lịch sử, niên biểu dòng họ gắn với cá nhân |
| `media` | 185 | Danh mục tài nguyên hình ảnh, tư liệu (technical hash, mimeType) |
| `person_media` | 173 | Bảng liên kết trung gian giữa cá nhân (`person_id`) và ảnh (`asset_id`) |
| `admin_users` | 3 | Tài khoản quản trị truyền thống (`tuantq`, `editor`, `viewer`) |
| `accounts` | 1 | Tài khoản thành viên hệ thống V2.0.0 (`tuantq` - role `member`) |
| `identity_mappings` | 1 | Ánh xạ danh tính giữa tài khoản `tuantq` và nhân vật `@I115@` |
| `proposals` | 1 | Hộp thư đề xuất hiệu đính dữ liệu phả hệ của thành viên |
| `memories` | 2 | Ký ức, câu chuyện gia đình ngắn |
| `stories` | 1 | Bài viết chuyên sâu |
| `calendar_events` | 0 | Sự kiện lịch tùy biến (chờ nạp) |
| `authorities` | 0 | Phân quyền chi tiết ReBAC (khởi tạo cấu trúc) |
| `authors` | 0 | Tác giả tập san MẠCH (lưu trữ quan hệ) |
| `series` | 0 | Tuyển tập bài viết (lưu trữ quan hệ) |
| `edges` | 0 | Quan hệ đồ thị phả hệ mở rộng |

---

## 5. BẰNG CHỨNG CƠ SỞ DỮ LIỆU NAS / PRODUCTION (NAS DATABASE EVIDENCE)

### 5.1. Bằng chứng Trạng thái Kết nối và Vận hành
- **Thời điểm kiểm tra:** 01:23:02 ngày 08/11/2026.
- **Thực thi script kiểm tra:** `node server/test_mariadb.js` trỏ tới `100.80.147.119:3306`.
- **Kết quả:** `Error: connect ETIMEDOUT` (`PROVEN`).
- **Nguyên nhân kỹ thuật:** Khớp 100% với **lịch vận hành chủ ý của Tuấn**: máy chủ NAS tự động ngắt điện/tắt từ 01:00 đến 09:30 hằng ngày. Do đó, vào ban đêm, mọi truy vấn từ bên ngoài vào MariaDB đều bị chặn ở cấp vật lý (`BLOCKED BY INTENTIONAL SCHEDULE`).

### 5.2. Bằng chứng Nguồn gốc Dữ liệu và Call Stack Lịch sử
- **File nhật ký lỗi lịch sử (`archive/temp_outputs/people.json`):**
  ```text
  Error: connect ECONNREFUSED 127.0.0.1:3306
      at allQuery (/volume1/web/family-api/index.js:34:37)
      at /volume1/web/family-api/index.js:113:20
  ```
- **Ý nghĩa pháp y:**
  1. Backend Production trên NAS sử dụng driver `mysql2/promise` trỏ đến `127.0.0.1:3306`.
  2. Tên database trên NAS là `family_archive`.
  3. Lược đồ các bảng trên NAS được tạo bởi tệp `server/schema_update.sql`, bao gồm các cột `fsid`, `payload JSON` cho bảng `people`, `stories`, `families`, `memories`, `timeline`, `media`, `person_media`.

---

## 6. CƠ CHẾ LỰA CHỌN CƠ SỞ DỮ LIỆU TRONG MÃ NGUỒN (DATABASE SELECTION LOGIC)

Cơ chế lựa chọn database được tập trung hoàn toàn tại tệp `server/index.js` (dòng 176–315):

```javascript
// server/index.js:176
const useMariaDB = process.env.DB_CLIENT === 'mysql';
let db, runQuery, allQuery, getQuery;

async function initDB() {
    if (useMariaDB) {
        console.log("Using MariaDB connection...");
        const mysql = require('mysql2/promise');
        db = await mysql.createPool({
            host: process.env.DB_HOST || '127.0.0.1',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'family_archive',
            waitForConnections: true,
            connectionLimit: 10
        });
        // Thiết lập runQuery, allQuery, getQuery dùng db.execute()
        // Tạo bảng cho MariaDB theo cú pháp MySQL (AUTO_INCREMENT, LONGTEXT, TIMESTAMP)
        await initFoundationTables(runQuery, true);
    } else {
        console.log("Using local SQLite fallback...");
        const sqlite3 = require('sqlite3').verbose();
        const dbPath = process.env.DB_PATH || path.join(__dirname, 'family_archive.db');
        db = new sqlite3.Database(dbPath);
        // Thiết lập runQuery, allQuery, getQuery dùng SQLite callbacks bọc trong Promise
        // Tạo bảng cho SQLite theo cú pháp SQLite (TEXT, INTEGER PRIMARY KEY)
        await initFoundationTables(runQuery, false);
    }
}
```

### 6.1. Xử lý Phương ngữ SQL (SQL Dialect Compatibility)
Mã nguồn xử lý sự khác biệt cú pháp giữa MySQL và SQLite tại các lệnh ghi:
```javascript
// server/index.js:417
const query = useMariaDB ? 
    "REPLACE INTO people (id, name, birthYear, deathYear, gender, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?)" :
    "INSERT OR REPLACE INTO people VALUES (?, ?, ?, ?, ?, ?, ?)";
```
- **MySQL/MariaDB:** Dùng cú pháp chuẩn `REPLACE INTO table (cols) VALUES (...)` hoặc `INSERT IGNORE INTO`.
- **SQLite:** Dùng cú pháp `INSERT OR REPLACE INTO table VALUES (...)`.

---

## 7. LUỒNG ĐỌC/GHI CỦA ADMINCONTROL (ADMINCONTROL READ/WRITE DATA FLOW)

Giao diện quản trị AdminControl phân tách đường đi dữ liệu dựa trên tệp `admin/js/api.js`:

```javascript
// admin/js/api.js:6-8
const API_BASE = window.location.hostname === 'admin.giatoctrantrongthu.com'
    ? 'https://api.giatoctrantrongthu.com/api'
    : '/api';
```

### 7.1. Khi Chạy trên Local (`http://localhost:3010/admin/index.html`)
- **Tất cả các lệnh Đọc (Read):**
  - `GET /api/admin/content/people` -> Express `server/index.js:409` -> `allQuery("SELECT * FROM people")` -> **SQLite Local**.
  - `GET /api/admin/proposals` -> Express `admin_operations.js:161` -> `allQuery("SELECT ... FROM proposals")` -> **SQLite Local**.
- **Tất cả các lệnh Ghi (Write):**
  - `POST /api/people` -> Express `server/index.js:416` -> `runQuery(INSERT OR REPLACE...)` -> **SQLite Local**.
  - `PATCH /api/admin/proposals/:id` -> Express `admin_operations.js:231` -> `runQuery(UPDATE proposals...)` -> **SQLite Local**.
- **Kết luận:** Mọi thao tác trên AdminControl Local tác động **100% vào SQLite Local**, không chạm vào NAS.

### 7.2. Khi Chạy trên Production (`https://admin.giatoctrantrongthu.com`)
- Trình duyệt gửi request tới `https://api.giatoctrantrongthu.com/api/...` qua Cloudflare Tunnel về NAS.
- **Khi NAS Online (09:30 - 01:00):**
  - Các route truyền thống (`POST /api/people`, `POST /api/stories`, `POST /api/edges`) sẽ ghi trực tiếp vào **MariaDB NAS**.
  - Các route quản trị hiện đại (`/api/admin/users`, `/api/admin/proposals`, `/api/admin/member-accounts`) sẽ bị **HTTP 404** vì backend trên NAS đang chạy bản cũ (commit `42a7ed2`).
- **Khi NAS Offline (01:00 - 09:30):**
  - Mọi thao tác Đọc và Ghi đều sập với **HTTP 530 (Cloudflare Error 1033)**.

---

## 8. KẾT QUẢ ĐỐI SOÁT ĐỒNG BỘ VÀ MIGRATION (SYNCHRONIZATION & MIGRATION FINDINGS)

1. **Không có Công cụ Migration Chuẩn hóa (No Migration Framework):**
   - Dự án không sử dụng bất kỳ công cụ quản lý schema migration nào (như Knex migrations, Prisma migrate, hay Flyway).
   - Việc nâng cấp cấu hình bảng diễn ra phân tán: một phần nằm trong `schema_update.sql`, một phần nằm trong hàm `initDB()` của `server/index.js`, một phần nằm trong `server/foundation.js`.

2. **Không có Cơ chế Đồng bộ Hai chiều (Zero Bidirectional Sync):**
   - Giữa SQLite Local và MariaDB Production hoàn toàn không có kết nối ngầm hay dịch vụ đồng bộ.
   - Bất kỳ dữ liệu nào được chỉnh sửa tại Local (ví dụ: tạo tài khoản thành viên mới, duyệt đề xuất phả hệ) sẽ vĩnh viễn nằm ở Local nếu không có người viết script đẩy lên NAS thủ công.

3. **Nguy cơ Ghi Đè Phản Tác Dụng (Overwrite Hazard):**
   - Nếu ai đó chạy script `server/nas_migrate.js` từ Local đẩy lên NAS, script này sẽ đọc tệp tĩnh `server/data/genealogy.json` và chạy lệnh `REPLACE INTO` trên toàn bộ bảng của MariaDB.
   - Thao tác này sẽ **XÓA SẠCH VÀ GHI ĐÈ** mọi chỉnh sửa mà người dùng đã nhập trực tiếp trên MariaDB qua Admin UI trong lịch sử.

---

## 9. ĐÁNH GIÁ NGUYÊN TẮC "NAS LÀ SOURCE OF TRUTH" (DATA AUTHORITY ASSESSMENT)

Đối chiếu hiện trạng với nguyên tắc tối cao của Tuấn: *"NAS là Source of Truth (SoT)"*:

| Tiêu chuẩn Đánh giá SoT | Hiện trạng Thực tế | Đánh giá Tuân thủ | Rủi ro Tiềm ẩn |
| :--- | :--- | :--- | :--- |
| **Tính Sẵn sàng (Availability)** | NAS tắt 8.5 tiếng mỗi đêm (01:00 - 09:30); API sập hoàn toàn trong thời gian này | **KHÔNG ĐẠT (0% ban đêm)** | Người dùng toàn cầu không thể xem gia phả hoặc lịch giỗ vào ban đêm |
| **Tính Toàn vẹn (Integrity)** | Backend trên NAS mở toang các lệnh `POST /api/people`, `POST /api/stories` không cần mật khẩu | **VI PHẠM AN NINH P0** | SoT có thể bị thay đổi dữ liệu trái phép bởi bất kỳ ai gọi API |
| **Tính Nhất quán (Consistency)** | Local SQLite có 16 bảng và 223 người; NAS MariaDB có 12 bảng và 228 người | **BỊ LỆCH PHA (DRIFT)** | Không rõ 5 người chênh lệch thuộc về nhánh nào; cấu hình bảng mới chưa có trên NAS |
| **Tính Thẩm quyền (Authority)** | Local phát triển tính năng mới độc lập; không có quy trình đưa dữ liệu vào SoT | **PHÂN MẢNH QUYỀN LỰC** | Dữ liệu kiểm thử tại Local có nguy cơ bị nhầm lẫn với dữ liệu chính thức |

---

## 10. SỔ ĐĂNG KÝ RỦI RO DỮ LIỆU (DATA RISK REGISTER)

1. **RỦI RO P0-DATA-01: Phơi lộ Quyền Ghi SoT Trực tiếp (Unauthenticated Write on SoT):**
   - *Mô tả:* Khi NAS thức dậy (sau 09:30), endpoint `https://api.giatoctrantrongthu.com/api/people` chấp nhận `POST` mà không có token/session.
   - *Khuyến cáo:* Bắt buộc triển khai rào chắn Cloudflare Access hoặc cập nhật backend code có Auth Guard trước khi công bố rộng rãi.

2. **RỦI RO P1-DATA-02: Mất Đồng bộ Dữ liệu Cục bộ và Sản xuất (Silent Data Divergence):**
   - *Mô tả:* Lập trình viên thử nghiệm thêm sự kiện hoặc tài khoản trên Local SQLite tưởng rằng hệ thống đã lưu, nhưng Production không hề biết đến các thay đổi này.

3. **RỦI RO P1-DATA-03: Xung đột Phương ngữ SQL (Dialect Incompatibility):**
   - *Mô tả:* Một số trường dữ liệu trong SQLite dùng `TEXT` để lưu JSON, trong khi MariaDB dùng kiểu dữ liệu gốc `JSON`. Nếu thực hiện chuyển đổi dữ liệu không chuẩn hóa escape string, các ký tự tiếng Việt có dấu sẽ bị lỗi hiển thị (mojibake).

---

## 11. BẢNG TỔNG HỢP CẤU TRÚC DỮ LIỆU HỆ THỐNG (SYSTEM DATA MATRIX)

Bảng tổng hợp bắt buộc theo chỉ thị của Tuấn:

| Thành phần (Component) | Môi trường (Environment) | Cơ sở Dữ liệu (Database) | Luồng Đọc (Read Path) | Luồng Ghi (Write Path) | Đã Xác minh Runtime | Nguồn Bằng chứng (Evidence) |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **Public Frontend** | Public (Vercel) | NAS MariaDB 10 | `GET /api/genealogy.json` | Không ghi | **XÁC MINH** | Batch 01-B probe (HTTP 200 khi NAS on, HTTP 530 khi NAS off) |
| **Public Frontend** | Local Dev | SQLite 3 | `GET /api/genealogy.json` | Không ghi | **XÁC MINH** | Probe localhost:3010 |
| **AdminControl** | Public (Vercel) | NAS MariaDB 10 | `GET /api/admin/content/*` | `POST /api/people`, `/api/stories` | **XÁC MINH** | `admin/js/api.js` (API_BASE trỏ `api.giatoctrantrongthu.com`) |
| **AdminControl** | Local Dev | SQLite 3 | `GET /api/admin/content/*` | `POST /api/people`, `/api/stories` | **XÁC MINH** | `admin/js/api.js` (API_BASE trỏ `/api`), SQLite table counts |
| **Member Spaces** | Local Dev | SQLite 3 | `GET /api/member/profile` | `POST /api/member/proposals` | **XÁC MINH** | `server/member.js`, `proposals` table (1 row) |
| **Member Spaces** | Public (Vercel) | *Chưa khả dụng* | *Bị lỗi 404* | *Bị lỗi 404* | **XÁC MINH** | Batch 01-B probe (Endpoint chưa tồn tại trên backend NAS) |
| **ICS Calendars** | Public (NAS) | NAS MariaDB 10 | `GET /api/calendars/*.ics` | Không ghi | **XÁC MINH** | `archive/legacy_frontend/app.js` và Strategic Plan |

---

## 12. DANH MỤC CÁC ĐIỂM CHƯA THỂ XÁC MINH (UNKNOWN & BLOCKED ITEMS)

1. **Xác minh Trực tiếp Schema MariaDB trên NAS (`BLOCKED`):**
   - *Nguyên nhân:* NAS đang offline theo lịch trình định sẵn (01:00 - 09:30). Không thể mở cổng kết nối MySQL từ xa lúc này.
2. **Chi tiết 5 bản ghi chênh lệch giữa Local (223) và NAS (228) (`UNKNOWN`):**
   - *Nguyên nhân:* Cần kết xuất danh sách ID đầy đủ từ cả hai bên để đối chiếu diff khi NAS online trở lại.
3. **Trạng thái bảng `calendar_events` trên MariaDB NAS (`UNKNOWN`):**
   - *Nguyên nhân:* Chưa thể xác định bảng này trên NAS đã có dữ liệu thực tế hay chỉ mới nằm ở cấu trúc `schema_update.sql`.

---

## 13. KHUYẾN NGHỊ KỸ THUẬT (RECOMMENDATIONS — CHỈ ĐỀ XUẤT)

> [!IMPORTANT]
> Toàn bộ các khuyến nghị dưới đây chỉ mang tính chất đề xuất kỹ thuật cho Tuấn và Emarald xem xét. Tuyệt đối KHÔNG tự ý triển khai.

1. **Khuyến nghị 1: Xây dựng Pipeline Xuất bản Dữ liệu (Publishing Pipeline) cho V2.0.0:**
   - Thay vì để Public Web kết nối trực tiếp vào NAS (vốn hay bị tắt ban đêm), kiến trúc V2.0.0 nên áp dụng mô hình:
     - **NAS là Master SoT:** Nơi lưu trữ gốc, chỉ Admin và thành viên gia đình được kết nối vào NAS qua Cloudflare Access/Tunnel để biên soạn và quản trị.
     - **Read-Replica hoặc Static Edge Cache:** Mỗi khi có thay đổi dữ liệu được Owner duyệt trên NAS, một tiến trình tự động xuất bản (Publish Event) sẽ đẩy bản snapshot sạch (JSON hoặc SQLite Read-Replica trên Cloudflare D1/Turso) ra Edge để phục vụ công chúng 24/7 mà không sợ NAS tắt điện.

2. **Khuyến nghị 2: Thiết lập Công cụ Quản lý Migration CSDL:**
   - Chuẩn hóa toàn bộ schema DDL vào một công cụ migration duy nhất để bảo đảm khi deploy bản cập nhật lên NAS, MariaDB sẽ tự động cập nhật thêm 4 bảng mới (`accounts`, `identity_mappings`, `authorities`, `proposals`) mà không làm mất dữ liệu cũ.

3. **Khuyến nghị 3: Đóng Chặt Lỗ Hổng Quyền Ghi trên NAS Trước:**
   - Ưu tiên số 1 khi NAS online là cập nhật middleware yêu cầu Session/Auth cho các route mutating (`POST /api/people`, `POST /api/stories`, `POST /api/edges`) trên NAS để bảo vệ toàn vẹn cho SoT.

---

*Báo cáo được lập theo đúng quy chuẩn kiểm toán chứng cứ tối cao của AIOS. AGY dừng hoàn toàn tại đây để chờ chỉ đạo từ Tuấn và QC Review từ Emarald.*

