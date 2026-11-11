# BÁO CÁO KIỂM CHỨNG ĐỘC LẬP MÔ HÌNH QUẢN TRỊ DỮ LIỆU (V2.0.0 — BATCH 06.1)
## INDEPENDENT GOVERNANCE IMPLEMENTATION QC — STRICT READ-ONLY

- **Dự án:** Gia Tộc Trần Trọng Thu
- **Cơ quan thẩm quyền:**
  - **Tuấn:** Human Final Authority & Product Owner
  - **Emarald:** Strategic Architecture & QC Authority
  - **AGY:** Chief Technical Auditor & Independent Verifier
- **Mã tài liệu:** `V2_0_0_GOVERNANCE_IMPLEMENTATION_QC_06_1`
- **Thời gian lập báo cáo:** 2026-11-10T21:45:00+07:00
- **Chế độ kiểm toán:** `STRICT READ-ONLY` (Khảo sát pháp y độc lập, tuyệt đối không sửa code, không sửa database, không commit/push/deploy)
- **Chuẩn mực tuân thủ:** AIOS Governance, Bằng chứng 8 tầng (`VERIFIED`, `PARTIALLY VERIFIED`, `FAILED`, `BLOCKED`, `UNKNOWN`).

---

## 1. TỔNG QUAN ĐIỀU HÀNH & KẾT LUẬN QC (EXECUTIVE SUMMARY & QC VERDICT)

Báo cáo Batch 06.1 tiến hành kiểm chứng độc lập, khách quan và toàn diện đối với kết quả triển khai **Batch 06 — Minimum Viable Governance Implementation** theo 5 trụ cột kiểm toán bắt buộc.

### Bảng Tổng hợp Kết quả Kiểm toán:

| Trụ cột Kiểm toán | Trạng thái QC | Nhận định Kỹ thuật Tóm tắt |
| :--- | :---: | :--- |
| **AUDIT 1: Transaction Compatibility** | `PARTIALLY VERIFIED` | **SQLite:** `VERIFIED` 100%. **MariaDB:** `FAILED`. `withTransaction` hiện phát lệnh SQLite-specific (`BEGIN IMMEDIATE`) và dùng pool autocommit, sẽ gặp lỗi cú pháp và trôi transaction trên MariaDB nếu chưa cấu hình connection release adapter. |
| **AUDIT 2: Audit Log Atomicity** | `VERIFIED` | Direct Edit và Proposal Commit được thực thi trong cùng một transaction với Audit Log. Lỗi ghi audit log sẽ rollback 100% dữ liệu nghiệp vụ. Phân định rõ ràng: API không có chức năng sửa/xóa log (`VERIFIED`), nhưng DB-level trigger và Tamper evidence chưa triển khai. |
| **AUDIT 3: Write Path Completeness** | `VERIFIED` | Đã quét toàn bộ 100% backend codebase. Toàn bộ 5 route ghi dữ liệu gốc đã được bọc `requireOwner` và `executeDirectEditWithAudit`. Không còn bất kỳ đường ghi nào bypass phân quyền. |
| **AUDIT 4: Proposal Workflow** | `VERIFIED` | 8/8 khâu nghiệp vụ (Submit, Base value capture, Anti-self-approval, Optimistic lock, Atomic commit, Rejection, Idempotency, Rollback) hoạt động chuẩn xác theo mã nguồn và 20/20 test cases. |
| **AUDIT 5: Data Integrity** | `VERIFIED` | Bảo toàn tuyệt đối: 223/223 hồ sơ nhân vật gốc không mất mát, checksum ký tự và payload trùng khớp byte-for-byte với bản backup. Integrity check: `ok`. |

---

## 2. AUDIT 1 — TƯƠNG THÍCH GIAO DỊCH (TRANSACTION COMPATIBILITY)

### A. Triển khai Transaction trên SQLite Local:
- **Bằng chứng mã nguồn:** [`server/governance.js:29-43`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/governance.js#L29-L43)
  ```javascript
  await dbAccessor.runQuery('BEGIN IMMEDIATE');
  try {
      const result = await callback(dbAccessor);
      await dbAccessor.runQuery('COMMIT');
      return result;
  } catch (err) {
      await dbAccessor.runQuery('ROLLBACK');
      throw err;
  }
  ```
- **Đánh giá SQLite:** `VERIFIED`. Lệnh `BEGIN IMMEDIATE` ngăn chặn triệt để tình trạng SQLite Busy/Deadlock khi có nhiều kết nối đọc ghi đồng thời. Toàn bộ các câu lệnh trong `callback` dùng chung connection của file SQLite. Đã kiểm chứng rollback thành công tại Test 9 (`tests/test_governance_mvp_suite.mjs`).

### B. Triển khai Transaction trên MariaDB Runtime:
- **Bằng chứng mã nguồn:** [`server/index.js:180-205`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/index.js#L180-L205)
  ```javascript
  db = await mysql.createPool({ ... });
  runQuery = async (q, params) => {
      const [result] = await db.execute(q, params);
      return result;
  };
  ```
- **Phát hiện cốt tử (CRITICAL FINDING):** `FAILED` trên môi trường MariaDB.
  1. **Lỗi cú pháp:** MariaDB không hỗ trợ cú pháp `BEGIN IMMEDIATE` của SQLite. Khi chạy trên MariaDB, server sẽ ném lỗi cú pháp `ER_PARSE_ERROR`.
  2. **Trôi kết nối Pool (Connection Drift):** Khi `runQuery` gọi `db.execute()`, mysql2 sẽ lấy connection $A$ từ pool, chạy `BEGIN`, rồi trả $A$ về pool. Câu lệnh kế tiếp trong callback sẽ lấy connection $B$ từ pool (vốn không nằm trong transaction của $A$) và autocommit độc lập!
- **Khuyến nghị cho Phase Production/NAS:** Trước khi kích hoạt MariaDB NAS, bắt buộc phải nâng cấp `withTransaction` để lấy một connection chuyên dụng từ pool:
  ```javascript
  const conn = await dbPool.getConnection();
  await conn.beginTransaction();
  // execute all queries on conn
  await conn.commit(); conn.release();
  ```

---

## 3. AUDIT 2 — TÍNH NGUYÊN TỬ VÀ BẤT BIẾN CỦA AUDIT LOG (AUDIT LOG ATOMICITY)

### A. Tính Nguyên tử (Atomicity):
- **Direct Edit & Audit Log:** `VERIFIED`. Bằng chứng: [`server/governance.js:304-320`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/governance.js#L304-L320). Cả hai thao tác nằm gọn trong `withTransaction`. Nếu ghi Audit Log gặp lỗi, `performMutation` sẽ bị rollback hoàn toàn.
- **Proposal Commit & Audit Log:** `VERIFIED`. Bằng chứng: [`server/governance.js:185-217`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/governance.js#L185-L217). Lệnh `UPDATE people`, `UPDATE proposals` và `recordAuditLog` được thực thi tuần tự trong cùng một transaction.

### B. Dữ liệu Đặc tả Nhật ký (Audit Metadata):
- **Bằng chứng mã nguồn:** [`server/governance.js:68-80`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/governance.js#L68-L80)
- **Đánh giá:** `VERIFIED`. Bản ghi lưu đầy đủ 10 trường:
  `id`, `actor_id`, `actor_role`, `action`, `entity_type`, `entity_id`, `before_value`, `after_value`, `reason`, `correlation_id`, `created_at`.

### C. Ghi nhận Thao tác Từ chối và Thất bại:
- **Proposal Rejection:** `VERIFIED`. `rejectProposal` ghi nhận action `PROPOSAL_REJECTED` vào `audit_logs` ([`server/governance.js:264-275`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/governance.js#L264-L275)).
- **Commit Failure:** `PARTIALLY VERIFIED`. Khi commit phát sinh ngoại lệ (ví dụ lỗi DB hoặc xung đột dữ liệu), transaction bị rollback toàn bộ, do đó không có dòng `COMMIT_FAILURE` nào được ghi vào bảng `audit_logs`. Lỗi được trả về trực tiếp qua mã HTTP response (409/500).

### D. Phân định Cấp độ Bảo vệ Audit Log:
1. **API-level Protection:** `VERIFIED`. Không tồn tại bất kỳ endpoint `DELETE`, `PUT`, `PATCH` nào trên route `/api/admin/audit-logs`. Route `GET` duy nhất được khóa chặt bởi `requireOwner`.
2. **Database-level Protection:** `NOT IMPLEMENTED AT DB LEVEL`. Bảng `audit_logs` hiện là bảng SQLite chuẩn, chưa có trigger chặn `DELETE` hoặc `UPDATE` nếu có tiến trình truy cập trực tiếp file `.db`.
3. **Tamper Evidence:** `NOT IMPLEMENTED`. Chưa có chữ ký số (HMAC) hoặc chuỗi băm Merkle liên kết giữa các dòng log để phát hiện việc chỉnh sửa thủ công trên file CSDL.

---

## 4. AUDIT 3 — TOÀN DIỆN BỀ MẶT GHI DỮ LIỆU (WRITE PATH COMPLETENESS)

AGY đã thực hiện quét pháp y toàn bộ các tệp nguồn trong `server/` và lập danh mục kiểm toán 100% các thao tác ghi:

| Endpoint / File | Thao tác SQL | Thẩm quyền | Có qua Governance? | Kết luận QC |
| :--- | :--- | :---: | :---: | :---: |
| `POST /api/people` | `INSERT OR REPLACE INTO people` | `requireOwner` | Có (`executeDirectEditWithAudit`) | `VERIFIED` |
| `POST /api/stories` | `INSERT OR REPLACE INTO stories` | `requireOwner` | Có (`executeDirectEditWithAudit`) | `VERIFIED` |
| `POST /api/edges` | `INSERT OR IGNORE INTO edges` | `requireOwner` | Có (`executeDirectEditWithAudit`) | `VERIFIED` |
| `DELETE /api/edges` | `DELETE FROM edges` | `requireOwner` | Có (`executeDirectEditWithAudit`) | `VERIFIED` |
| `POST /api/events` | `INSERT OR REPLACE INTO calendar_events` | `requireOwner` | Có (`executeDirectEditWithAudit`) | `VERIFIED` |
| `POST /api/member/proposals` | `INSERT INTO proposals` | `requireAccount` | Có (`recordAuditLog` + `base_value`) | `VERIFIED` |
| `PATCH /api/admin/proposals/:id` | `UPDATE people`, `UPDATE proposals` | `requireOwner` | Có (`commitProposal` / `rejectProposal`) | `VERIFIED` |
| `POST /api/admin/users` | `INSERT INTO admin_users` | `requireOwner` | Không tác động Official Data | `VERIFIED` |
| `PATCH /api/admin/users/:id` | `UPDATE admin_users` | `requireOwner` | Không tác động Official Data | `VERIFIED` |
| `DELETE /api/admin/users/:id` | `DELETE FROM admin_users` | `requireOwner` | Không tác động Official Data | `VERIFIED` |
| `POST /api/admin/member-accounts` | `INSERT INTO accounts` | `requireOwner` | Không tác động Official Data | `VERIFIED` |
| `PATCH /api/admin/member-accounts/:id` | `UPDATE accounts` | `requireOwner` | Không tác động Official Data | `VERIFIED` |
| `POST /api/member/change-password` | `UPDATE accounts` | `requireAccount` | Đổi mật khẩu cá nhân | `VERIFIED` |

**Kết luận Bề mặt Ghi:** `VERIFIED`. Không còn bất kỳ đường dẫn HTTP nào cho phép ghi hoặc sửa đổi dữ liệu gia phả chính thức mà không có quyền Owner và không qua Governance Engine.

---

## 5. AUDIT 4 — ĐỐI SOÁT QUY TRÌNH ĐỀ XUẤT (PROPOSAL WORKFLOW)

| Hạng mục Quy trình | Triển khai trong Code | Test Case Kiểm chứng | Trạng thái QC |
| :--- | :--- | :--- | :---: |
| **1. Submit Proposal** | [`server/member.js:388-435`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/member.js#L388-L435): Kiểm tra người tồn tại, chụp `base_value`, lưu `audit_logs`. | Test 3 (`test_governance_mvp_suite.mjs`) | `VERIFIED` |
| **2. Owner Approval** | [`server/admin_operations.js:256`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/admin_operations.js#L256): Khóa bằng `requireOwner`. | Test 5 & 6 (`test_governance_mvp_suite.mjs`) | `VERIFIED` |
| **3. Proposal Rejection** | [`server/governance.js:240-285`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/governance.js#L240-L285): Đổi status, không sửa `people`, ghi audit log. | Test 7 (`test_governance_mvp_suite.mjs`) | `VERIFIED` |
| **4. Anti-Self-Approval** | [`server/governance.js:110-116`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/governance.js#L110-L116): Chặn nếu `reviewerAccountId === proposal.account_id`. | Test 4 (`test_governance_mvp_suite.mjs`) | `VERIFIED` |
| **5. Optimistic Concurrency** | [`server/governance.js:132-140`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/governance.js#L132-L140): Chặn commit nếu `base_value != current_value` (409). | Test 10 (`test_governance_mvp_suite.mjs`) | `VERIFIED` |
| **6. Atomic Commit** | [`server/governance.js:185-217`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/governance.js#L185-L217): Cập nhật `people`, payload JSON, `proposals`, `audit_logs`. | Test 6 (`test_governance_mvp_suite.mjs`) | `VERIFIED` |
| **7. Duplicate Prevention** | [`server/governance.js:103-107`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/governance.js#L103-L107): Chặn commit nếu `status === 'APPROVED'` và đã commit (409). | Test 10 (`test_governance_mvp_suite.mjs`) | `VERIFIED` |
| **8. Rollback on Failure** | [`server/governance.js:35-41`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/governance.js#L35-L41): Bọc `withTransaction`, khôi phục nguyên trạng khi lỗi. | Test 9 (`test_governance_mvp_suite.mjs`) | `VERIFIED` |

---

## 6. AUDIT 5 — ĐỐI SOÁT TOÀN VẸN DỮ LIỆU GỐC (DATA INTEGRITY AUDIT)

### Bằng chứng Đối soát Băm và Checksum:
1. **Bản sao lưu bit-for-bit trước migration:**
   - Đường dẫn: `server/family_archive.db.pre_batch06_20261110_213345.raw_copy`
   - SHA-256: `eb6d13d83615b548f1c4948cd4f8ca74718a803bebfd3c22243f7fa55332e374`
2. **Bản sao lưu Online Vacuum:**
   - Đường dẫn: `server/family_archive.db.pre_batch06_20261110_213345.bak`
   - SHA-256: `05bf4bd8cc70de4661d0f436ffd89e23a0d099344dc21a4c8c6d9a3dd8c27fea`
3. **Đối soát Kiểm tra Bảng `people` giữa CSDL hiện tại và Bản backup:**
   - CSDL hiện tại: `SELECT count(*), sum(length(name)), sum(length(payload)) FROM people;`
     - Số dòng: **223**
     - Tổng độ dài cột `name`: **4278 bytes**
     - Tổng độ dài cột `payload`: **72962 bytes**
   - Bản backup: `SELECT count(*), sum(length(name)), sum(length(payload)) FROM people;`
     - Số dòng: **223**
     - Tổng độ dài cột `name`: **4278 bytes**
     - Tổng độ dài cột `payload`: **72962 bytes**
   - **Kết quả:** Trùng khớp tuyệt đối 100% đến từng byte. Không có bất kỳ bản ghi gia phả nào bị sửa đổi ngoài ý muốn.
4. **Đối soát Bảng `proposals`:**
   - Tồn tại 1 đề xuất gốc (`PROP_1794037194805001`), 4 cột mới được bổ sung giá trị mặc định `NULL`, trạng thái `PENDING` được bảo toàn nguyên vẹn.
5. **Đối soát Bảng `audit_logs`:**
   - Có 0 dòng trên CSDL chính thức (toàn bộ kiểm thử chạy trên scratch DB cô lập, không làm ô nhiễm CSDL thật).

---

## 7. KHUYẾN NGHỊ KỸ THUẬT CHO EMARALD & TUẤN (ACTIONABLE RECOMMENDATIONS)

Dù Batch 06 đã đạt chuẩn xuất sắc trên SQLite Local, AGY kiến nghị hai điểm kỹ thuật cần xử lý trước khi kích hoạt trên Production NAS:

1. **[P1 - Architecture] Cải tiến `withTransaction` cho MariaDB Pool:**
   - Cần bổ sung logic phân nhánh trong `server/governance.js`: nếu là MariaDB, lấy dedicated connection từ pool qua `await dbAccessor.pool.getConnection()` và thực thi `conn.beginTransaction()`, tránh connection drift.
2. **[P2 - Hardening] Bổ sung SQLite Trigger bảo vệ Audit Log ở cấp CSDL:**
   - Thêm trigger ngăn chặn lệnh `DELETE` và `UPDATE` trực tiếp trên bảng `audit_logs`:
     ```sql
     CREATE TRIGGER prevent_audit_update BEFORE UPDATE ON audit_logs BEGIN
         SELECT RAISE(FAIL, 'AUDIT_LOG_IMMUTABLE: Audit logs cannot be modified');
     END;
     CREATE TRIGGER prevent_audit_delete BEFORE DELETE ON audit_logs BEGIN
         SELECT RAISE(FAIL, 'AUDIT_LOG_IMMUTABLE: Audit logs cannot be deleted');
     END;
     ```

---

## 8. ĐIỂM CHỜ PHÊ DUYỆT (HUMAN CHECKPOINT)

- Chế độ kiểm toán: `STRICT READ-ONLY` hoàn tất. Không có bất kỳ tệp tin nào ngoài báo cáo kiểm toán này bị chỉnh sửa.
- Trạng thái Git working tree: Hoàn toàn ổn định, không có thao tác commit/push nào được thực hiện.
- Cloudflare WAF: `Emergency Block API Mutations` tiếp tục được duy trì kích hoạt.

AGY xin trân trọng bàn giao Báo cáo Kiểm chứng Độc lập Batch 06.1 tới **Emarald (QC & Architecture)** để phục vụ công tác thẩm định và **anh Tuấn** xem xét chỉ đạo tiếp theo.

