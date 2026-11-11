# BÁO CÁO KIỂM KÊ TIẾN ĐỘ THỰC THI BACKEND
# DỰ ÁN GIATỘC TRẦN TRỌNG THU
**Thời gian thực hiện:** 2026-10-31  
**Đơn vị thực hiện:** AGY (Backend Owner)  
**Chế độ thực thi:** STRICT READ-ONLY  
**Hệ quy chiếu thẩm quyền:** Tuấn (Human Final Authority) | Emarald (Architecture Review & QC)  
**Tài liệu đối chiếu:** [`AUDIT/MASTER_COMPLETION_PLAN.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/MASTER_COMPLETION_PLAN.md)  

---

## 1. Executive Summary

Báo cáo này kiểm kê toàn bộ hiện trạng kỹ thuật của Tầng Backend trong repository `giatoctrantrongthu`, đối chiếu trực tiếp với lộ trình 6 Phase và 23 nhiệm vụ được định nghĩa trong **Master Completion Plan**.

### 1.1. Hiện trạng Tổng thể
- **Phase 1 (Security Containment):** Đang ở trạng thái **SẴN SÀNG THỰC THI (READY / PARTIALLY IMPLEMENTED)**. Một phần việc sửa chữa write endpoints (`adminCors`, `requireAuth`) đã được viết vào file `server/index.js` trong working directory nhưng **chưa commit** và **chưa giải quyết triệt để** lỗ hổng static root (`express.static('..')`) hay DoS URI crash. Các công việc còn lại (cắt static root, wrap try/catch, dọn `revert_pass.js`, sửa `.gitignore` & `vercel.json`) đang dừng chờ **Human Gate 01** phê duyệt.
- **Phase 2 (Database Hardening):** Trạng thái **CHƯA BẮT ĐẦU (NOT STARTED)**. Dữ liệu phả hệ SQLite rất sạch nhưng lỗi 173 liên kết ảnh `person_media` bị `NULL` vẫn tồn tại nguyên trạng trong CSDL; script seed chưa được sửa; chưa tạo file DDL hợp nhất `canonical_schema.sql`.
- **Phase 4 (Relation Engine & ReBAC):** Trạng thái **CHƯA BẮT ĐẦU (NOT STARTED)**. Chưa có file `relation_engine.js`, chưa có middleware `privacy_guard.js`, chưa có Node-based API. Hiện tại chỉ có bảo vệ đăng nhập thô (`requireAccount`) tại tầng Member Space, chưa có phân quyền theo khoảng cách quan hệ (ReBAC) và chưa có che giấu trường dữ liệu (Field Masking).
- **Mã nguồn ngoài Master Plan:** Tồn tại một khối lượng mã nguồn đã được phát triển từ giai đoạn trước (khoảng ngày 03-04/10/2026) bao gồm: Tầng định danh thành viên cơ sở (`server/foundation.js`, `server/auth.js`, `server/member.js`), kịch bản onboarding thử nghiệm (`scripts/test_p01_onboarding.js`), và bộ di chuyển dữ liệu sang Synology NAS (`server/nas_migrate.js`).

---

## 2. Chi tiết Tiến độ Thực thi Từng Task

### NHÓM 1: SECURITY CONTAINMENT (TASK-01 → TASK-06)

#### TASK-01: Cắt bỏ static root repo (`express.static('..')`), whitelist assets
- **Status:** `NOT STARTED`
- **Files affected:** `server/index.js` (dòng 27-28)
- **Evidence:** Mã nguồn hiện tại trong `server/index.js` vẫn đang phục vụ tĩnh toàn bộ thư mục gốc của repository:
  ```javascript
  app.use(express.static(path.join(__dirname, '..'), { dotfiles: 'deny', index: 'index.html' }));
  ```
  Chưa có bất kỳ whitelist nào cho `/assets`, `/src/css`, `/src/js`.
- **Tests and results:** Kiểm tra qua báo cáo `SECURITY_EXPOSURE_VERIFICATION.md` xác nhận truy vấn `GET /package.json` trả về HTTP 200, lộ cấu trúc nội bộ repository.
- **Remaining work:** Thay thế dòng static root bằng các route tĩnh có phạm vi giới hạn rõ ràng (chỉ cho phép `/assets`, `/src/css`, `/src/js`, `/src/fonts`).
- **Blockers:** Cần sự phê duyệt của Tuấn tại **Human Gate 01** để tiến hành chỉnh sửa mã nguồn.

---

#### TASK-02: Bọc `try/catch` giải mã URI trong middleware nhạy cảm
- **Status:** `NOT STARTED`
- **Files affected:** `server/index.js` (dòng 21-26)
- **Evidence:** Mã nguồn hiện tại:
  ```javascript
  const SENSITIVE_PATH = /(^|\/)(server|generator|scripts|tests|archive|\.git|\.aios|\.vercel|\.env|node_modules|\.github)(\/|$)|.*\.(db|sqlite|sqlite3|log|ged|pem|key|env)(\?|#|$)|cookie\.txt|.*\.bak|.*\.orig/i;
  app.use((req, res, next) => {
      if (SENSITIVE_PATH.test(decodeURIComponent(req.path))) {
          return res.status(404).end();
      }
      next();
  });
  ```
  Hàm `decodeURIComponent(req.path)` được gọi trực tiếp mà không có khối `try...catch`.
- **Tests and results:** Kiểm chứng thực tế tại `SECURITY_EXPOSURE_VERIFICATION.md` §3.2 (CF-02) xác nhận khi gửi URL chứa chuỗi ký tự malformed (ví dụ: `/%c0%af` hoặc `%E0%A4%A`), Node.js ném ngoại lệ `URIError: URI malformed` làm sập process server (DoS).
- **Remaining work:** Bọc khối `try { ... } catch (e) { return res.status(400).end(); }` để xử lý ngoại lệ an toàn.
- **Blockers:** Chờ phê duyệt **Human Gate 01**.

---

#### TASK-03: Khóa `requireAuth` và `adminCors` cho các API ghi trong Git HEAD
- **Status:** `IMPLEMENTED (UNCOMMITTED / UNVERIFIED)`
- **Files affected:** `server/index.js` (dòng 260, 307, 326, 334, 352)
- **Evidence:**
  - Trong Git commit HEAD (`42a7ed2`), các endpoint ghi (`POST /api/people`, `POST /api/stories`, `POST /api/edges`, `DELETE /api/edges`, `POST /api/events`) hoàn toàn mở toang không có middleware xác thực.
  - Trong **uncommitted working tree** hiện tại của `server/index.js`, đã có code thêm `adminCors, requireAuth` vào các endpoint này:
    ```javascript
    app.post('/api/people', adminCors, requireAuth, async (req, res) => { ... });
    app.post('/api/stories', adminCors, requireAuth, async (req, res) => { ... });
    app.post('/api/edges', adminCors, requireAuth, async (req, res) => { ... });
    app.delete('/api/edges', adminCors, requireAuth, async (req, res) => { ... });
    app.post('/api/events', adminCors, requireAuth, async (req, res) => { ... });
    ```
- **Tests and results:** Mã nguồn mới này nằm trong working tree chưa được commit và chưa có bộ automated test độc lập xác nhận chặn thành công 100% các request không có session cookie.
- **Remaining work:** Viết kịch bản kiểm thử HTTP tự động gửi payload không có cookie đến các route trên để xác nhận trả về `401 Unauthorized`; sau đó commit theo chỉ đạo.
- **Blockers:** Chờ phê duyệt **Human Gate 01**.

---

#### TASK-04: Gắn rate-limiting cho member login, bỏ `password_hash` khỏi query
- **Status:** `NOT STARTED`
- **Files affected:** `server/member.js` (dòng 129, 135), `server/index.js` (dòng 47-53)
- **Evidence:**
  - `loginLimiter` chỉ mới được định nghĩa và gán cho router admin trong `server/index.js`.
  - Trong `server/member.js`, route `POST /api/member/login` hoàn toàn **không có middleware rate-limiting**:
    ```javascript
    router.post('/api/member/login', async (req, res) => { ... });
    ```
  - Tại dòng 135 của `server/member.js`, câu lệnh truy vấn vẫn là:
    ```javascript
    let account = await dbAccessor.getQuery("SELECT * FROM accounts WHERE username = ?", [username]);
    ```
    Lấy toàn bộ các cột bao gồm cả hash mật khẩu vào bộ nhớ khi chỉ cần kiểm tra đăng nhập.
- **Tests and results:** Đã xác minh qua đọc mã nguồn trực tiếp trong `server/member.js`.
- **Remaining work:** Gắn `loginLimiter` vào route `POST /api/member/login`; tinh chỉnh câu query SQL để chỉ chọn các trường cần thiết.
- **Blockers:** Chờ phê duyệt **Human Gate 01**.

---

#### TASK-05: Di chuyển `revert_pass.js`, xóa webhook fallback trong CI YAML
- **Status:** `NOT STARTED`
- **Files affected:** `./revert_pass.js`, `.github/workflows/instant-sync.yml` (dòng 20)
- **Evidence:**
  - File `./revert_pass.js` vẫn nằm nguyên vẹn tại thư mục gốc của repository, chứa mật khẩu plaintext phục vụ cứu hộ tài khoản.
  - File `.github/workflows/instant-sync.yml` tại dòng 20 vẫn chứa URL webhook Google Apps Script hardcoded dạng fallback:
    ```yaml
    RESPONSE=$(curl -L -s -w "\nHTTP_STATUS:%{http_code}" "${{ secrets.GAS_SYNC_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbzpP_RWa-kwE9OJrAQkBafFhN2jxZiTiIYNA-vsGQZsgo_l-0i2aPl9iQWQ8x0qBMEEgA/exec' }}")
    ```
- **Tests and results:** Lệnh tìm kiếm file và chuỗi xác nhận cả hai vị trí nhạy cảm đều đang tồn tại trong working tree.
- **Remaining work:** Di chuyển hoặc xóa an toàn file `revert_pass.js`; xóa chuỗi URL dự phòng trong file workflow; Tuấn thực hiện thu hồi/đổi webhook URL trên Google Script Console.
- **Blockers:** Cần Tuấn thực hiện thao tác xoay vòng thông tin xác thực trên Google Script Console.

---

#### TASK-06: Cập nhật `.gitignore` và `vercel.json` chặn dữ liệu phả hệ/thư riêng
- **Status:** `IN PROGRESS / PARTIALLY IMPLEMENTED`
- **Files affected:** `.gitignore`, `vercel.json`
- **Evidence:**
  - Trong working tree của `.gitignore`, đã bổ sung: `cookies*.txt`, `cookie.txt`, `*.log`, `api_res.json`, `test_login.js`. Tuy nhiên, **vẫn chưa có** quy tắc ignore cho: file phả hệ `GIADINHONGTHU.ged`, dữ liệu luyện tập thể thao Garmin, và các thư riêng tư của Clara.
  - Trong `vercel.json`, mới chỉ bổ sung cache header cho `/admin/(.*)` và `/data/(.*)`, **chưa có** quy tắc rewrite deny/block cho các đường dẫn nhạy cảm.
- **Tests and results:** Git diff của `.gitignore` và `vercel.json` xác nhận việc cấu hình mới chỉ hoàn thành 30% so với yêu cầu của Master Plan.
- **Remaining work:** Bổ sung đầy đủ các mẫu wildcard bảo vệ dữ liệu phả hệ và thư riêng trong `.gitignore` và `vercel.json`.
- **Blockers:** Chờ phê duyệt **Human Gate 01**.

---

### NHÓM 2: DATABASE HARDENING (TASK-07 → TASK-10)

#### TASK-07: Backup SQLite vật lý, sửa `pm.assetId` trong `server/db_seed.js`
- **Status:** `NOT STARTED`
- **Files affected:** `server/db_seed.js` (dòng 152), `server/family_archive.db.bak`
- **Evidence:**
  - Chưa có bản backup vật lý nào dạng `server/family_archive.db.bak`.
  - Trong `server/db_seed.js`, dòng nạp dữ liệu liên kết ảnh vẫn gọi sai thuộc tính:
    ```javascript
    stmt.run(pm.id, pm.personId, pm.assetId, pm.role);
    ```
    Trong khi dữ liệu nguồn `server/data/person_media.json` sử dụng khóa `pm.media_id`.
- **Tests and results:** Khảo sát tại Batch 01 xác nhận 100% dòng trong CSDL SQLite hiện tại có `media_id = NULL`.
- **Remaining work:** Tạo bản sao lưu `.bak`; sửa `pm.assetId` thành `pm.media_id` (có fallback `pm.assetId || pm.media_id`).
- **Blockers:** Phụ thuộc vào việc hoàn tất Phase 1 và phê duyệt **Human Gate 02**.

---

#### TASK-08: Chạy reseed SQLite phục hồi 173 bản ghi liên kết `person_media`
- **Status:** `NOT STARTED`
- **Files affected:** `server/family_archive.db` (bảng `person_media`)
- **Evidence:** Truy vấn kiểm tra trực tiếp trên CSDL SQLite:
  ```sql
  SELECT COUNT(*) FROM person_media WHERE media_id IS NULL;
  -- Kết quả: 173 bản ghi
  ```
- **Tests and results:** Toàn bộ 173 liên kết giữa cá nhân và ảnh đều đang bị đứt gãy. Reseed chưa được thực hiện.
- **Remaining work:** Chạy `node server/db_seed.js` sau khi đã sửa script ở Task 07; kiểm tra số lượng NULL giảm về đúng 0.
- **Blockers:** Bị chặn bởi TASK-07.

---

#### TASK-09: Sửa SQL query stories để bảo toàn trường payload JSON
- **Status:** `NOT STARTED`
- **Files affected:** `server/index.js` (dòng 307-315)
- **Evidence:** Mã nguồn cập nhật bài viết hiện tại:
  ```javascript
  const query = useMariaDB ? 
      "REPLACE INTO stories (id, title, author, content, status, updatedAt) VALUES (?, ?, ?, ?, ?, ?)" :
      "INSERT OR REPLACE INTO stories VALUES (?, ?, ?, ?, ?, ?)";
  ```
  Câu lệnh `REPLACE INTO` hoặc `INSERT OR REPLACE` không kèm cột `payload` sẽ xóa trắng toàn bộ dữ liệu JSON mở rộng (như ảnh cover, tags) của bài viết đang có.
- **Tests and results:** Đã xác minh qua đọc mã nguồn trực tiếp trong `server/index.js`.
- **Remaining work:** Viết lại logic cập nhật theo cơ chế `UPDATE` có bảo toàn payload hoặc đọc-hợp nhất trước khi ghi.
- **Blockers:** Phụ thuộc vào Phase 2 và **Human Gate 02**.

---

#### TASK-10: Chuẩn hóa file DDL migration duy nhất (`canonical_schema.sql`)
- **Status:** `NOT STARTED`
- **Files affected:** `database/canonical_schema.sql` (chưa tồn tại)
- **Evidence:** Thư mục `database/migrations/` hiện đang có hai file bị xóa cục bộ (`001_baseline_schema.sql`, `002_seed_test_data.sql`). DDL hiện đang bị phân mảnh rải rác trong `server/index.js`, `server/foundation.js` và `server/schema_update.sql`. Chưa có file `canonical_schema.sql` tập trung.
- **Tests and results:** Lệnh tìm kiếm file `find . -name "*canonical_schema*"` trả về rỗng.
- **Remaining work:** Tổng hợp toàn bộ DDL của 7 bảng nghiệp vụ + 6 bảng định danh thành viên vào một file migration chuẩn hóa duy nhất hỗ trợ cả SQLite và MariaDB.
- **Blockers:** Phụ thuộc vào TASK-08.

---

### NHÓM 3: RELATIONAL IDENTITY, REBAC & API (TASK-14 → TASK-17)

#### TASK-14: Xây dựng động cơ tính toán quan hệ: `server/relation_engine.js`
- **Status:** `NOT STARTED`
- **Files affected:** `server/relation_engine.js` (chưa tồn tại)
- **Evidence:** Kiểm tra file hệ thống xác nhận chưa có file `server/relation_engine.js`.
- **Tests and results:** `test -f server/relation_engine.js` trả về `NOT_FOUND`.
- **Remaining work:** Xây dựng thuật toán tính toán ma trận quan hệ (Kinship Distance, Hạt nhân trực hệ Bố-Mẹ-Con-Vợ-Chồng, cùng Chi/Nhánh, khoảng cách thế hệ).
- **Blockers:** Phụ thuộc vào TASK-10 (cần CSDL chuẩn hóa) và sự đồng thuận về Ontology từ Cố vấn Emarald.

---

#### TASK-15: Xây dựng middleware ReBAC & Dynamic Field-Masking Transformer
- **Status:** `NOT STARTED`
- **Files affected:** `server/privacy_guard.js` (chưa tồn tại), `server/member.js`
- **Evidence:** Hệ thống hiện tại chỉ có bảo vệ theo phiên đăng nhập thô (`requireAccount`), hoàn toàn chưa có logic ReBAC (Relationship-Based Access Control) để phân biệt giữa:
  1. *Public Persona* (Khách ngoài).
  2. *Relational Mesh* (Họ hàng khác nhánh - chỉ thấy phả đồ và tên, che giấu ngày sinh/nơi ở).
  3. *Personal Dossier* (Gia đình hạt nhân - thấy toàn bộ chi tiết).
- **Tests and results:** Kiểm tra mã nguồn `server/member.js` xác nhận không có bất kỳ bộ lọc trường (scrubber/masking) nào.
- **Remaining work:** Viết middleware `server/privacy_guard.js` và module lọc trường động.
- **Blockers:** Phụ thuộc vào TASK-14 và phê duyệt của Tuấn tại **Human Gate 04** về Ranh giới Nhận diện vs Tiết lộ.

---

#### TASK-16: Xây dựng Node-based Navigation API thay thế bulk dump JSON
- **Status:** `NOT STARTED`
- **Files affected:** `server/index.js`, `server/member.js`
- **Evidence:**
  - Route `/api/tree/node/:id` chưa tồn tại.
  - Route bulk dump công khai `GET /api/genealogy.json` (dòng 388-467 trong `server/index.js`) vẫn đang hoạt động và xả toàn bộ dữ liệu của 223 người trong một response duy nhất.
- **Tests and results:** Grep tìm kiếm `tree/node` trong `server/` không cho ra kết quả nào.
- **Remaining work:** Hiện thực hóa API trả về từng node nhân vật cùng 1-hop quan hệ lân cận; khóa hoặc phân quyền cho endpoint bulk dump cũ.
- **Blockers:** Phụ thuộc vào TASK-15.

---

#### TASK-17: Vá lỗi IDOR tại route `/me/tree/person/:id` bằng ReBAC guard
- **Status:** `NOT STARTED`
- **Files affected:** `server/member.js` (dòng 297-302)
- **Evidence:** Route `/me/tree/person/:id` hiện tại chỉ kiểm tra đăng nhập:
  ```javascript
  router.get('/me/tree/person/:id', requireAccount, async (req, res) => {
      if (req.session.status === 'PROVISIONED') {
          return res.redirect('/me/change-password');
      }
      res.sendFile(path.join(__dirname, 'member_person.html'));
  });
  ```
  Trang `member_person.html` tải dữ liệu qua client script mà không có bất kỳ hàng rào kiểm tra quyền sở hữu hoặc mối quan hệ giữa người xem và ID trên đường dẫn (Lỗ hổng IDOR - Insecure Direct Object Reference).
- **Tests and results:** Phân tích luồng dữ liệu chứng minh bất kỳ tài khoản thành viên nào sau khi login đều có thể mở URL hồ sơ của bất kỳ cá nhân nào trong gia tộc.
- **Remaining work:** Gắn ReBAC guard vào API cung cấp dữ liệu hồ sơ nhân vật, áp dụng field masking tương ứng với mối quan hệ của caller.
- **Blockers:** Phụ thuộc vào TASK-15.

---

## 3. Các Công Việc Backend Đã Thực Hiện Ngoài Master Plan

Trong quá trình khảo sát pháp y, kiểm tra mtime và nội dung các file chưa được track trong Git, AGY ghi nhận một số thành phần backend đã được xây dựng từ trước đợt Audit (giai đoạn đầu tháng 10/2026):

| Tệp / Thành phần | Thời gian tạo (mtime) | Mô tả chức năng | Đánh giá kiến trúc & Rủi ro |
| :--- | :--- | :--- | :--- |
| `server/foundation.js` | 2026-10-03 18:26 | Khởi tạo 6 bảng định danh: `accounts`, `person_accounts`, `roles`, `permissions`, `account_roles`, `role_permissions`. Hỗ trợ mã hóa mật khẩu và liên kết tài khoản với cá nhân trong phả hệ. | Cấu trúc chuẩn, có thể tái sử dụng trực tiếp cho tầng ReBAC của Phase 4. Cần chuẩn hóa vào `canonical_schema.sql`. |
| `server/auth.js` | 2026-10-04 00:35 | Router xác thực Admin, quản lý session cookie, middleware `requireAuth` và `requireOwner`. | Hoạt động tốt cho nội bộ admin, nhưng cần tích hợp chung mô hình session với Member Space. |
| `server/member.js` | 2026-10-04 14:48 | Cung cấp luồng Member Space: `/login`, `/me`, `/me/tree`, `/me/tree/person/:id`, `/me/mach`, `/me/clara`, `/me/family-spaces`. Xử lý đổi mật khẩu lần đầu (`PROVISIONED` $\rightarrow$ `ACTIVE`). | Triển khai tốt luồng onboarding ban đầu, nhưng thiếu rate-limiting, thiếu ReBAC, và hở IDOR. |
| `server/dev_setup_onboarding.js` | 2026-10-04 01:13 | Script tiện ích tạo nhanh tài khoản thành viên thử nghiệm gắn với cá nhân trong phả hệ để kiểm thử luồng đăng nhập. | Script phát triển cục bộ, không được đưa lên production vì có thông tin khởi tạo mật khẩu mẫu. |
| `server/verify_mvp.js` | 2026-10-04 00:13 | Script kiểm tra tính toàn vẹn số lượng bản ghi trong SQLite (223 người, 68 gia đình, 215 mốc thời gian, 2 ký ức). | Test script hữu ích, kết quả chạy xác nhận 100% khớp với dữ liệu GEDCOM gốc. |
| `scripts/test_p01_onboarding.js` | 2026-10-04 01:30 | Bộ kiểm thử tự động HTTP mô phỏng quy trình: Login tài khoản tạm $\rightarrow$ Chặn chuyển hướng $\rightarrow$ Đổi mật khẩu $\rightarrow$ Kích hoạt ACTIVE $\rightarrow$ Mở trang `/me`. | Test suite chạy pass hoàn toàn, là bằng chứng cho thấy cơ chế session của Member Space hoạt động ổn định. |
| `server/nas_migrate.js` | 2026-09-07 16:04 | Script đọc dữ liệu từ SQLite `family_archive.db` và đẩy qua mạng nội bộ vào MariaDB trên Synology NAS (`100.80.147.119`). | Hoạt động được, nhưng hiện tại kết nối NAS đang bị cô lập an toàn chờ Phase 6. |
| `server/calendars/` & `server/migrate_events_schema.js` | 2026-09-07 17:04 | Hỗ trợ lưu trữ sự kiện gia tộc và xuất file lịch chuẩn iCalendar (.ics). | Là tính năng phụ trợ, không nằm trong Critical Path của phiên bản V1.0. |

---

## 4. Bảng Tổng Hợp Trạng Thái Task Backend

| Task ID | Tên Nhiệm Vụ Backend | Phase | Trọng Số | Trạng Thái Hiện Tại | Tệp Bị Ảnh Hưởng Chính | Phụ Thuộc (Dependencies) | Chốt Chặn Phê Duyệt |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TASK-01** | Cắt bỏ static root repo, whitelist assets | `PHASE-01` | **P0 (Khẩn)** | `NOT STARTED` | `server/index.js` | Không có | **Human Gate 01** |
| **TASK-02** | Bọc `try/catch` giải mã URI chống crash DoS | `PHASE-01` | **P0 (Khẩn)** | `NOT STARTED` | `server/index.js` | Không có | **Human Gate 01** |
| **TASK-03** | Khóa `requireAuth` & `adminCors` cho API ghi | `PHASE-01` | **P0 (Khẩn)** | `IMPLEMENTED (UNCOMMITTED)` | `server/index.js` | Không có | **Human Gate 01** |
| **TASK-04** | Gắn rate-limit member login, lọc query pass | `PHASE-01` | **P1 (Cao)** | `NOT STARTED` | `server/member.js`, `server/index.js` | Không có | **Human Gate 01** |
| **TASK-05** | Dọn `revert_pass.js`, xóa webhook trong CI | `PHASE-01` | **P1 (Cao)** | `NOT STARTED` | `revert_pass.js`, `instant-sync.yml` | Không có | **Human Gate 01 / Tuấn** |
| **TASK-06** | Cập nhật `.gitignore` & `vercel.json` bảo vệ dữ liệu | `PHASE-01` | **P1 (Cao)** | `IN PROGRESS (PARTIAL)` | `.gitignore`, `vercel.json` | Không có | **Human Gate 01** |
| **TASK-07** | Backup SQLite, sửa `pm.assetId` trong seed | `PHASE-02` | **P1 (Cao)** | `NOT STARTED` | `server/db_seed.js`, `*.db.bak` | TASK-01 | **Human Gate 02** |
| **TASK-08** | Chạy reseed SQLite phục hồi 173 ảnh media | `PHASE-02` | **P1 (Cao)** | `NOT STARTED` | `server/family_archive.db` | TASK-07 | **Human Gate 02** |
| **TASK-09** | Sửa SQL stories bảo toàn JSON payload | `PHASE-02` | **P2 (Vừa)** | `NOT STARTED` | `server/index.js` | TASK-07 | **Human Gate 02** |
| **TASK-10** | Chuẩn hóa file DDL `canonical_schema.sql` | `PHASE-02` | **P2 (Vừa)** | `NOT STARTED` | `database/canonical_schema.sql` | TASK-08 | **Human Gate 02** |
| **TASK-14** | Xây dựng Relation Engine (`relation_engine.js`) | `PHASE-04` | **P0 (Cốt lõi)**| `NOT STARTED` | `server/relation_engine.js` | TASK-10 | Cố vấn Emarald |
| **TASK-15** | Xây dựng ReBAC & Dynamic Field Masking | `PHASE-04` | **P0 (Cốt lõi)**| `NOT STARTED` | `server/privacy_guard.js`, `member.js`| TASK-14 | **Human Gate 04** |
| **TASK-16** | Xây dựng Node-based Navigation API | `PHASE-04` | **P0 (Cốt lõi)**| `NOT STARTED` | `server/index.js`, `member.js` | TASK-15 | **Human Gate 04** |
| **TASK-17** | Vá lỗi IDOR tại route `/me/tree/person/:id` | `PHASE-04` | **P0 (Cốt lõi)**| `NOT STARTED` | `server/member.js` | TASK-15 | **Human Gate 04** |

---

## 5. Kết Luận & Khuyến Nghị Hành Động Tiếp Theo

### 5.1. Kết Luận
1. **Tiến độ Backend hiện đang dừng ở ranh giới an toàn:** Chưa có task nào thuộc Phase 2 hay Phase 4 được triển khai. Đây là trạng thái hoàn toàn chính xác theo nguyên tắc quản trị: *Không xây dựng tính năng mới trên nền móng chưa được khoanh vùng an ninh.*
2. **Phase 1 đã có 1 phần code nháp trong working tree:** TASK-03 đã được viết nháp vào `server/index.js` nhưng chưa được commit; TASK-06 mới chỉ hoàn thành 30%. Các task còn lại (TASK-01, TASK-02, TASK-04, TASK-05) vẫn nguyên vẹn nguy cơ an ninh.
3. **Cơ sở hạ tầng thành viên (Member Space) đã có nền móng vững chắc:** Mã nguồn `server/foundation.js` và `server/member.js` cùng test suite `scripts/test_p01_onboarding.js` đã hoạt động tốt, giúp tiết kiệm đáng kể thời gian khi bước vào triển khai ReBAC ở Phase 4.

### 5.2. Khuyến Nghị Trình Tuấn (Human Final Authority)
1. **Phê duyệt kích hoạt Phase 1 (Human Gate 01):** Cho phép AGY chuyển từ chế độ READ-ONLY sang thực thi sửa đổi cục bộ trên nhánh `security-containment-v1` để dứt điểm toàn bộ 6 task bảo mật (TASK-01 $\rightarrow$ TASK-06).
2. **Thực hiện thao tác ngoài repo:** Tuấn chủ động xoay vòng mật khẩu tài khoản cá nhân và thu hồi webhook URL trên Google Script Console.
3. **Mở khóa Phase 2:** Sau khi Phase 1 hoàn tất và có báo cáo kiểm thử an ninh đạt 100%, tiến hành backup vật lý CSDL và sửa seed script để khôi phục 173 liên kết ảnh bị đứt gãy.

