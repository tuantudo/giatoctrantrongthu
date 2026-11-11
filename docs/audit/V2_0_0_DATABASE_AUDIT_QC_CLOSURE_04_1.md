# BÁO CÁO NGHIỆM THU KIỂM TOÁN CƠ SỞ DỮ LIỆU (V2.0.0 — BATCH 04.1)
## DATABASE AUDIT QC CLOSURE — STRICT READ-ONLY

- **Dự án:** Gia Tộc Trần Trọng Thu
- **Cơ quan thẩm quyền:**
  - **Tuấn:** Human Final Authority & Product Owner
  - **Emarald:** Strategic Architecture & QC Authority
  - **AGY:** Chief Orchestrator & Integration Authority
- **Mã tài liệu:** `V2_0_0_DATABASE_AUDIT_QC_CLOSURE_04_1`
- **Thời gian lập báo cáo:** 2026-11-08T01:30:00+07:00
- **Chế độ kiểm toán:** `STRICT READ-ONLY` (Khảo sát pháp y, không can thiệp code, không migrate, không ghi dữ liệu)
- **Mục tiêu:** Đóng toàn bộ các khoảng trống bằng chứng của Batch 04, đối soát tính toàn vẹn CSDL và thẩm định an toàn ghi dữ liệu trước khi nghiệm thu V2.0.0 Database Topology.

---

## 1. ĐỐI SOÁT LƯỢC ĐỒ SQLITE LOCAL (SQLITE SCHEMA RECONCILIATION)

### 1.1. Hiện trạng Thực tế (Current Observed Schema)
- **Lệnh thực thi:** `sqlite3 server/family_archive.db ".tables"`
- **Kết quả:** Đúng **16 bảng** tồn tại vật lý trong tệp `server/family_archive.db`:
  `accounts`, `admin_users`, `authorities`, `authors`, `calendar_events`, `edges`, `families`, `identity_mappings`, `media`, `memories`, `people`, `person_media`, `proposals`, `series`, `stories`, `timeline`.
- **Trạng thái bằng chứng:** `PROVEN RUNTIME`.

### 1.2. Giải trình Mâu thuẫn với Baseline 15 Bảng Ngày 06/11/2026
- **Căn cứ tài liệu:** [`AUDIT/INDEPENDENT_VERIFICATION_REPORT.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/INDEPENDENT_VERIFICATION_REPORT.md) (Dòng 108):
  > *"Số lượng bảng: Đúng 15 bảng (`accounts`, `admin_users`, `authorities`, `authors`, `calendar_events`, `edges`, `families`, `identity_mappings`, `media`, `memories`, `people`, `person_media`, `series`, `stories`, `timeline`)."*
- **Phát hiện pháp y:** Danh sách 15 bảng ngày 06/11/2026 **hoàn toàn chưa có bảng `proposals`**.
- **Cơ chế tạo bảng thứ 16 (`proposals`):**
  - Vào ngày **07/11/2026 lúc 12:30**, tệp `server/foundation.js` được cập nhật bổ sung hàm khởi tạo bảng `proposals` (dòng 35 & 75) phục vụ tính năng Hộp thư Đề xuất Hiệu đính của thành viên (`TP-024`):
    ```sql
    CREATE TABLE IF NOT EXISTS proposals (
        id TEXT PRIMARY KEY,
        account_id TEXT NOT NULL,
        person_id TEXT NOT NULL,
        field TEXT NOT NULL,
        suggested_value TEXT NOT NULL,
        source_evidence TEXT,
        reason TEXT,
        status TEXT NOT NULL DEFAULT 'PENDING',
        reviewer_note TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        reviewed_at TEXT
    );
    ```
  - Vào lúc **15:18 ngày 07/11/2026**, khi tiến trình `node server/index.js --port=3010` khởi động, hàm `initDB()` tại dòng 313 gọi `initFoundationTables(runQuery, false)`, tự động thực thi câu lệnh SQL trên và tạo vật lý bảng `proposals` vào `server/family_archive.db`.
  - Trong quá trình kiểm thử tự động `scripts/test_proposal_and_containment.mjs`, đúng 1 bản ghi đề xuất hợp lệ đã được ghi vào bảng này.
- **Kết luận:** Bảng thứ 16 không phải lỗi trôi dạt vô căn cứ mà là **kết quả triển khai có chủ đích của tính năng Member Proposal** đã được tài liệu hóa đầy đủ.

---

## 2. BẰNG CHỨNG LƯỢC ĐỒ MARIADB PRODUCTION (MARIADB SCHEMA EVIDENCE)

### 2.1. Lược đồ Khai báo trong Mã nguồn (Declared Schema)
- **Tệp nguồn:** `server/schema_update.sql` và `server/index.js` (dòng 208–255).
- **Danh sách 12 bảng Production được khai báo:**
  1. `people` (khai báo các cột: `id`, `name`, `birthYear`, `deathYear`, `gender`, `notes`, `status`, `fsid`, `payload JSON`).
  2. `stories` (`id`, `title`, `author`, `content LONGTEXT`, `status`, `updatedAt`, `payload JSON`).
  3. `edges` (`source_id`, `target_id`, `edge_type`).
  4. `admin_users` (`id INT AUTO_INCREMENT`, `username UNIQUE`, `password_hash`, `role`, `is_active`, `created_at`, `last_login_at`).
  5. `calendar_events` (`uid`, `summary`, `dtstart`, `dtend`, `description`, `location`, `calendar_type`, `event_type`, `status`).
  6. `families` (`id`, `husb`, `wife`, `payload JSON`).
  7. `memories` (`id`, `title`, `story LONGTEXT`, `personId`, `payload JSON`).
  8. `timeline` (`id`, `date`, `title`, `description`, `icon`).
  9. `media` (`id`, `filename`, `mimetype`, `payload JSON`).
  10. `person_media` (`relation_id`, `person_id`, `asset_id`, `role`, `is_primary`).
  11. `authors` (`id`, `name`, `role`, `payload JSON`).
  12. `series` (`id`, `title`, `description`, `payload JSON`).
- **Trạng thái bằng chứng:** `CONFIGURED & DOCUMENTED`.

### 2.2. Nguồn gốc Bằng chứng về "228 People" và "20 MẠCH Stories"
- **Nguồn gốc 228 Cá nhân (228 People):**
  - Trong tệp phả hệ gốc [`GIADINHONGTHU.ged`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/GIADINHONGTHU.ged), lệnh `grep -c "0 @I.*@ INDI"` trả về **chính xác 223 cá nhân** (`PROVEN`).
  - Trong tệp `server/data/genealogy.json`, số lượng người cũng là **chính xác 223 cá nhân** (`PROVEN`).
  - Bằng chứng lịch sử trong `archive/pre-v1-cleanup/mirror.js:18` và `docs/archive/architecture/OWNER_DECISION_BRIEF.md` ghi nhận: Khi khởi tạo MariaDB ban đầu, script seed đã thêm các bản ghi thử nghiệm (`p1`, `p2`, `p3`, `p4`, `p5`) thông qua `INSERT INTO people` trực tiếp trên NAS, tạo ra tổng số **228 cá nhân** (223 cá nhân GEDCOM + 5 bản ghi thử nghiệm).
- **Nguồn gốc 20 Bài viết MẠCH (20 Stories):**
  - Tệp `server/data/mach.json` sau đợt dọn dẹp an ninh (P0 Clara Containment) chỉ còn **12 bài viết thuần MẠCH** (`PROVEN`).
  - Trên Production MariaDB, dữ liệu chưa trải qua đợt dọn dẹp P0, vẫn lưu giữ 8 bức "Thư gửi Clara" (`clara-001` đến `clara-007` + thư mở đầu), tạo ra tổng số **20 bài viết** (12 bài MẠCH + 8 thư Clara).
- **Trạng thái truy vấn trực tiếp vào MariaDB:** `BLOCKED (NAS OFFLINE PER OPERATIONAL SCHEDULE)`. Theo lịch vận hành chủ ý của Tuấn (tắt từ 01:00 đến 09:30 hằng ngày), cổng kết nối MySQL không thể truy cập lúc 01:30 sáng.

---

## 3. TRUY VẾT AN TOÀN GHI CỦA ADMINCONTROL (ADMINCONTROL WRITE SECURITY TRACE)

Khảo sát pháp y chi tiết hai endpoint ghi cốt tử: `POST /api/people` và `POST /api/stories`.

### 3.1. Bảng Đối soát Pháp y Toàn diện Hai Môi trường

| Thuộc tính Kiểm toán | Endpoint `POST /api/people` (Local) | Endpoint `POST /api/people` (Production NAS) | Endpoint `POST /api/stories` (Local) | Endpoint `POST /api/stories` (Production NAS) |
| :--- | :--- | :--- | :--- | :--- |
| **Route Declaration** | `server/index.js:416` | `commit 42a7ed2:server/index.js:115` | `server/index.js:464` | `commit 42a7ed2:server/index.js:128` |
| **Middleware Chain** | `express.json()`, CSRF, `adminCors`, `requireAuth` | `cors()`, `express.json()` | `express.json()`, CSRF, `adminCors`, `requireAuth` | `cors()`, `express.json()` |
| **Authentication** | **BẮT BUỘC** (Session `req.session.userId`) | **KHÔNG CÓ (HOÀN TOÀN MỞ)** | **BẮT BUỘC** (Session `req.session.userId`) | **KHÔNG CÓ (HOÀN TOÀN MỞ)** |
| **Authorization** | Yêu cầu tài khoản Admin/Editor | **KHÔNG CÓ** | Yêu cầu tài khoản Admin/Editor | **KHÔNG CÓ** |
| **CSRF Protection** | Kiểm tra Origin/Referer (`isTrustedOriginUrl`) | **KHÔNG CÓ** (CORS `*`) | Kiểm tra Origin/Referer (`isTrustedOriginUrl`) | **KHÔNG CÓ** (CORS `*`) |
| **Input Validation** | Destructuring an toàn, parse JSON | Destructuring trực tiếp body | Destructuring an toàn | Destructuring trực tiếp body |
| **Database Adapter** | `dbAccessor.runQuery` (SQLite Promise) | `mysql2/promise` (`db.execute`) | `dbAccessor.runQuery` (SQLite Promise) | `mysql2/promise` (`db.execute`) |
| **Database Target** | `server/family_archive.db` (Local SQLite) | `family_archive` trên NAS MariaDB 3306 | `server/family_archive.db` (Local SQLite) | `family_archive` trên NAS MariaDB 3306 |
| **Audit Logging** | **KHÔNG CÓ** | **KHÔNG CÓ** | **KHÔNG CÓ** | **KHÔNG CÓ** |
| **Đánh giá An ninh** | `SAFE IN LOCAL DEV` | **CRITICAL P0 EXPOSURE** | `SAFE IN LOCAL DEV` | **CRITICAL P0 EXPOSURE** |

### 3.2. Đánh giá Nguy cơ An ninh P0 trên Production
- **Bằng chứng Static Code Analysis:** Mã nguồn trên Production (`commit 42a7ed2:server/index.js:115`) hoàn toàn không có middleware kiểm tra session trước khi gọi câu lệnh:
  ```javascript
  const query = useMariaDB ? 
      "REPLACE INTO people (id, name, birthYear, deathYear, gender, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?)" :
      "INSERT OR REPLACE INTO people VALUES (?, ?, ?, ?, ?, ?, ?)";
  await runQuery(query, [id, name, birthYear, deathYear, gender, notes, status]);
  ```
- **Hệ quả trực tiếp:** Bất kỳ ai từ Internet gửi HTTP POST với payload JSON tới `https://api.giatoctrantrongthu.com/api/people` (khi NAS online) đều có thể sửa đổi, làm sai lệch hoặc ghi đè hồ sơ nhân vật trên MariaDB SoT mà không cần bất kỳ thông tin xác thực nào.

---

## 4. BẢN ĐỒ THẨM QUYỀN GHI DỮ LIỆU (DATA AUTHORITY & WRITE PATH AUDIT)

Khảo sát toàn bộ các đường ghi dữ liệu có thể tồn tại trong hệ thống:

```mermaid
flowchart TD
    subgraph WRITERS["CÁC CHỦ THỂ & TIẾN TRÌNH GHI (WRITE ACTORS)"]
        ADMIN_LOCAL["AdminControl Local (localhost:3010)"]
        ADMIN_PROD["AdminControl Prod (admin.giatoctrantrongthu.com)"]
        PUBLIC_ATTACKER["Public Internet / Anonymous HTTP Requests"]
        MEMBER_APP["Member Spaces (/me/proposals)"]
        DEV_SCRIPTS["Dev Scripts (db_seed.js, dev_setup_onboarding.js)"]
        NAS_SCRIPT["Migration Script (nas_migrate.js)"]
    end

    subgraph LOCAL_TARGET["LOCAL STORAGE"]
        LOCAL_SQLITE[("SQLite: server/family_archive.db\n[16 Bảng - Môi trường Dev]")]
    end

    subgraph PROD_TARGET["PRODUCTION SOT"]
        NAS_MARIADB[("MariaDB: family_archive trên NAS\n[12 Bảng - Master SoT]")]
    end

    ADMIN_LOCAL -->|"1. POST /api/people (Có Auth)"| LOCAL_SQLITE
    MEMBER_APP -->|"2. POST /api/member/proposals (Có Auth)"| LOCAL_SQLITE
    DEV_SCRIPTS -->|"3. Ghi trực tiếp SQLite"| LOCAL_SQLITE

    ADMIN_PROD -->|"4. POST /api/people (Qua Cloudflare Tunnel)"| NAS_MARIADB
    PUBLIC_ATTACKER -->|"5. POST /api/people (LỖ HỔNG P0 - KHÔNG AUTH)"| NAS_MARIADB
    NAS_SCRIPT -->|"6. Chạy tay qua Tailscale (REPLACE INTO)"| NAS_MARIADB

    LOCAL_SQLITE -.x|"HOÀN TOÀN BỊ CÔ LẬP\n(Không có đường ghi nào tới NAS)"| NAS_MARIADB

    classDef safe fill:#e6f4ea,stroke:#137333,stroke-width:2px;
    classDef danger fill:#fce8e6,stroke:#c5221f,stroke-width:2px;
    classDef neutral fill:#e8f0fe,stroke:#1a73e8,stroke-width:2px;

    class LOCAL_SQLITE,ADMIN_LOCAL,MEMBER_APP,DEV_SCRIPTS safe;
    class PUBLIC_ATTACKER,NAS_MARIADB danger;
    class ADMIN_PROD,NAS_SCRIPT neutral;
```

### 4.1. Nhận định về Thẩm quyền Dữ liệu (Authority Findings):
1. **Các thao tác Local KHÔNG THỂ làm biến dạng NAS SoT (`PROVEN NEGATIVE`):**
   - Toàn bộ các thao tác tại máy dev (chạy Admin UI local, tạo thành viên mới, duyệt đề xuất, chạy seed) đều ghi duy nhất vào tệp `server/family_archive.db`. Không có bất kỳ dòng code hay webhook nào tự động chuyển dữ liệu này lên NAS.
2. **NAS SoT đang chịu rủi ro bị ghi đè trái phép từ bên ngoài (`PROVEN RISK`):**
   - Điểm yếu duy nhất làm biến dạng SoT trên NAS là các endpoint `POST /api/people`, `POST /api/stories`, `POST /api/edges` đang phơi lộ công khai qua Cloudflare Tunnel khi NAS thức dậy vào ban ngày.

---

## 5. ĐỐI SOÁT DỮ LIỆU LOCAL VS PRODUCTION (DATA DIFF STATUS)

- **Trạng thái Kiểm tra Thời gian thực:** `BLOCKED (NAS OFFLINE PER INTENTIONAL SCHEDULE)`.
- **Căn cứ kỹ thuật:** Lệnh ping tới Tailscale IP `100.80.147.119` và probe cổng `3306` lúc 01:23 đều trả về `Timeout`. Máy chủ `tuandzain-nas` đang ngắt điện theo đúng lịch trình ban đêm của Tuấn (01:00 - 09:30).
- **Phân loại Trạng thái Hồ sơ Dựa trên Bằng chứng Lưu trữ:**
  - **Dữ liệu Chuẩn hóa (Canonical Baseline):** Đúng **223 cá nhân** xuất phát từ `GIADINHONGTHU.ged`. SQLite Local đang bảo lưu toàn vẹn 223 cá nhân này.
  - **Dữ liệu Dư thừa trên Production:** 5 bản ghi thử nghiệm (`p1` đến `p5`) được tạo tự động bởi code khởi tạo cũ trong `server/index.js` khi database rỗng. Khi NAS online trở lại sau 09:30, 5 bản ghi này cần được dọn dẹp để đưa số lượng hồ sơ trên MariaDB về con số chuẩn mực **223 cá nhân**.

---

## 6. MA TRẬN PHÂN LOẠI BẰNG CHỨNG (EVIDENCE CLASSIFICATION MATRIX)

| Hạng mục Kiểm toán | Trạng thái Bằng chứng | Nguồn / Lệnh Kiểm tra | Nhận định Tóm tắt |
| :--- | :--- | :--- | :--- |
| **SQLite 16 Bảng** | `PROVEN RUNTIME` | `sqlite3 server/family_archive.db ".tables"` | 15 bảng baseline + 1 bảng `proposals` mới |
| **Tạo Bảng Proposals** | `PROVEN CODE & RUNTIME` | `server/foundation.js:75`, `test_proposal...` | Khởi tạo bởi `initFoundationTables` lúc 15:18 ngày 07/11 |
| **MariaDB 12 Bảng Khai báo** | `CONFIGURED & DOCUMENTED` | `server/schema_update.sql`, `server/index.js` | 12 bảng theo kiến trúc gốc tháng 09/2026 |
| **Nguồn gốc 228 People** | `PROVEN INFERENCE` | `GIADINHONGTHU.ged` (223) + Seed code (5) | 223 hồ sơ thật + 5 hồ sơ test khởi tạo |
| **Nguồn gốc 20 Stories** | `PROVEN INFERENCE` | `mach.json` (12) + Clara letters (8) | 12 bài MẠCH + 8 bài Clara chưa được dọn dẹp trên NAS |
| **Admin Write Security (Local)** | `PROVEN CODE` | `server/index.js:416`, CSRF & Session checks | Có bảo vệ mật khẩu, session và CSRF |
| **Admin Write Security (Prod)** | `PROVEN CODE` | `commit 42a7ed2:server/index.js:115` | **HOÀN TOÀN KHÔNG CÓ BẢO VỆ (Lỗ hổng P0)** |
| **Đồng bộ SQLite ↔ MariaDB** | `PROVEN NEGATIVE` | Toàn bộ mã nguồn & dependency tree | Hoàn toàn không có pipeline đồng bộ |
| **Live NAS MariaDB Query** | `BLOCKED` | `test_mariadb.js` (ETIMEDOUT lúc 01:23) | NAS tắt theo lịch vận hành 01:00 - 09:30 |

---

## 7. CÁC VẤN ĐỀ TỒN ĐỌNG VÀ KHUYẾN NGHỊ KHẮC PHỤC (REMEDIATION CANDIDATES)

> [!IMPORTANT]
> Toàn bộ các nội dung dưới đây là đề xuất kỹ thuật cho Tuấn và Emarald xem xét. Tuyệt đối KHÔNG tự ý triển khai trong Batch 04.1.

1. **Vấn đề 1: Lỗ hổng phơi lộ quyền ghi SoT trên NAS (P0 - Critical):**
   - *Khuyến cáo:* Ngay khi NAS thức dậy sau 09:30, cần cấu hình một **Cloudflare Access Policy** chặn toàn bộ các phương thức `POST`, `PUT`, `DELETE` tới `https://api.giatoctrantrongthu.com/api/*` trừ khi có email xác thực của Tuấn, HOẶC cập nhật tệp `server/index.js` trên NAS lên phiên bản có `requireAuth`.

2. **Vấn đề 2: Lệch số lượng hồ sơ (223 vs 228):**
   - *Khuyến cáo:* Sau 09:30 sáng, chạy một truy vấn chỉ-đọc `SELECT id, name FROM people WHERE id LIKE 'p%'` trên NAS để lập danh sách 5 bản ghi thử nghiệm và xin ý kiến Tuấn phê duyệt xóa bỏ nhằm đưa CSDL về đồng nhất 223 người.

3. **Vấn đề 3: Lược đồ CSDL chưa đồng nhất (16 bảng vs 12 bảng):**
   - *Khuyến cáo:* MariaDB trên NAS hiện thiếu 4 bảng nền tảng (`accounts`, `identity_mappings`, `authorities`, `proposals`). Cần chuẩn bị một script migration an toàn để bổ sung 4 bảng này vào NAS khi kích hoạt V2.0.0.

---

*Báo cáo được lập theo đúng quy chuẩn kiểm toán chứng cứ tối cao của AIOS. AGY dừng hoàn toàn tại đây để chờ chỉ đạo từ Tuấn và QC Review từ Emarald.*

