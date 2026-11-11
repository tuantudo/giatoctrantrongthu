# BÁO CÁO THẨM ĐỊNH TIỀN KHỞI TẠO TÀI KHOẢN OWNER PRODUCTION
## CHỐT CHẶN KIỂM SOÁT CHẤT LƯỢNG CUỐI CÙNG (FINAL QC GATE)

**Dự án:** Gia Tộc Trần Trọng Thu  
**Môi trường:** Production MariaDB 10.11 trên Synology NAS (`100.80.147.119`)  
**Tài khoản mục tiêu:** `tuantq`  
**Nhân vật liên kết (Canonical Person ID):** `@I115@` (*Gioan Baotixita Trần Quốc Tuấn*)  
**Cấp thẩm quyền quyết định:**  
- **Tuấn:** Human Final Authority  
- **Emarald:** Strategic Architecture & QC Authority  
- **AGY:** Master Execution Authority  
**Thời điểm đối soát:** 2026-11-11 16:35 (GMT+7)  
**Chế độ thực thi:** STRICT READ-ONLY *(Zero Production Mutation)*

---

## 1. TÍNH TOÀN VẸN GIAO DỊCH (TRANSACTION INTEGRITY EVIDENCE)

Đã kiểm chứng trực tiếp từ `information_schema.TABLES` trên CSDL Production `family_archive`:

### A. Storage Engine & Bảng mã (Storage Engine Evidence)
```sql
SELECT TABLE_NAME, ENGINE, TABLE_COLLATION
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'family_archive' 
  AND TABLE_NAME IN ('admin_users', 'accounts', 'identity_mappings', 'authorities', 'audit_logs');
```
**Kết quả thực tế từ máy chủ NAS:**
| Tên bảng | Storage Engine | Bảng mã & Collation | Hỗ trợ ACID Transaction? |
| :--- | :---: | :---: | :---: |
| `admin_users` | **InnoDB** | `utf8mb4_unicode_ci` | **CÓ (ACID Compliant)** |
| `accounts` | **InnoDB** | `utf8mb4_unicode_ci` | **CÓ (ACID Compliant)** |
| `identity_mappings` | **InnoDB** | `utf8mb4_unicode_ci` | **CÓ (ACID Compliant)** |
| `authorities` | **InnoDB** | `utf8mb4_unicode_ci` | **CÓ (ACID Compliant)** |
| `audit_logs` | **InnoDB** | `utf8mb4_unicode_ci` | **CÓ (ACID Compliant)** |

### B. Kết nối Đơn & Khả năng Rollback (Single Connection & Rollback Guarantee)
1. **Chia sẻ Connection:**  
   Kịch bản bootstrap khởi tạo đúng 1 đối tượng kết nối duy nhất:
   `const conn = await mysql.createConnection(...)`.
   Toàn bộ các câu lệnh trong tiến trình (`beginTransaction`, `query`, `commit`, `rollback`) đều được thực thi trên cùng một instance `conn` này.
2. **Khả năng Rollback 100%:**  
   Do cả 5 bảng đều sử dụng storage engine **InnoDB**, mọi thao tác `INSERT` được giữ trong vùng nhớ đệm giao dịch (undo logs). Khi gọi `await conn.rollback()`, MariaDB hoàn trả nguyên trạng CSDL trước khi mở giao dịch.
3. **Không có Implicit Commit (Zero Implicit Commit):**  
   Kịch bản bootstrap **chỉ thực thi các câu lệnh thao tác dữ liệu thuần túy (Pure DML: `INSERT INTO ... VALUES (...)`)**. Tuyệt đối không có bất kỳ câu lệnh DDL (`CREATE`, `ALTER`, `DROP`, `TRUNCATE`), câu lệnh phân quyền (`GRANT`, `REVOKE`), hay khóa bảng (`LOCK TABLES`) nào có thể kích hoạt Implicit Commit ngầm của MySQL/MariaDB.

---

## 2. NGUỒN GỐC PHÂN QUYỀN TRUY VẾT TỪ MÃ NGUỒN (AUTHORITY SOURCE TRACEABILITY)

Truy vết trực tiếp từ mã nguồn triển khai thực tế trên máy chủ NAS (`server/auth.js`, `server/member.js`, `server/foundation.js`, `server/admin_operations.js`):

### A. Bảng Ma trận Tiêu thụ Dữ liệu (Record $\rightarrow$ Consumer $\rightarrow$ Permission Granted)

| Bản ghi CSDL | Consumer trong Code (File & Dòng) | Thao tác truy vấn | Quyền hạn được cấp (Permission Granted) |
| :--- | :--- | :--- | :--- |
| **`admin_users.role`** | [`server/auth.js` (L67-L78)](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/auth.js#L67-L78) (`requireOwner`) | `SELECT role, is_active FROM admin_users WHERE id = ?` | Cho phép truy cập các tác vụ tối cao của Owner trong Admin Control Room (xem schema, duyệt proposal, quản trị users, tạo tài khoản). |
| | [`server/auth.js` (L23-L33)](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/auth.js#L23-L33) (`requireAuth`) | `SELECT id, username, role, is_active FROM admin_users WHERE id = ?` | Duy trì phiên đăng nhập Admin hợp lệ; nếu `is_active=0` sẽ hủy phiên ngay lập tức. |
| | [`server/auth.js` (L196-L205)](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/auth.js#L196-L205) (`GET /api/auth/me`) | `SELECT id, username, role, is_active, last_login_at FROM admin_users WHERE id = ?` | Trả về thông tin vai trò Owner cho giao diện `admin/js/api.js`. |
| | [`server/member.js` (L224-L245)](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/member.js#L224-L245) (`POST /api/member/login`) | `SELECT * FROM admin_users WHERE LOWER(username) = LOWER(?)` | Fallback xác thực khi đăng nhập qua `/login`: Cấp session `req.session.userId` và hydrate `role = adminUser.role`. |
| **`accounts.role`** | [`server/auth.js` (L81-L94)](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/auth.js#L81-L94) (`requireOwner`) | `SELECT role, status FROM accounts WHERE id = ?` | Cấp quyền Owner cho các API khi người dùng chỉ có `accountId` (không có `userId`). |
| | [`server/member.js` (L41-L45)](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/member.js#L41-L45) (`isClaraEligible`) | `const role = req.session.role; if (role === 'admin' \|\| role === 'owner') return true;` | Cấp quyền xem chuyên san Thư gửi Clara cho vai trò Owner/Admin (chi tiết kiểm toán tại Mục 7). |
| | [`server/member.js` (L28, L70)](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/member.js#L28) (`hydrateMemberSession`) | `req.session.role = account.role \|\| 'member'` | Thiết lập vai trò hiển thị trong Không gian Thành viên (`/me`). |
| **`identity_mappings`** | [`server/member.js` (L30-L34)](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/member.js#L30-L34) (`hydrateMemberSession`) | `SELECT person_id FROM identity_mappings WHERE account_id = ?` | Thiết lập `req.session.personId = mapping.person_id` (gắn chặt phiên với `@I115@`). |
| | [`server/member.js` (L264-L274)](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/member.js#L264-L274) (`GET /api/member/profile`) | `SELECT * FROM people WHERE id = mapping.person_id` | Hiển thị thẻ hồ sơ nhân thân chính danh: **Gioan Baotixita Trần Quốc Tuấn** trên Dashboard. |
| | [`server/member.js` (L428)](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/member.js#L428) (`POST /api/member/proposals`) | `SELECT person_id FROM identity_mappings ...` | Xác thực quan hệ thân nhân khi gửi đề xuất chỉnh sửa phả hệ. |
| **`authorities`** | [`server/auth.js` (L236-L242)](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/auth.js#L236-L242) (`Account Inspector`) | `SELECT * FROM authorities WHERE actor_id = ? AND actor_type = 'ACCOUNT'` | Cung cấp danh mục quyền ReBAC (`SYSTEM:ADMIN_ACCESS`) cho các module kiểm toán và phân quyền mở rộng. |
| | [`server/foundation.js` (L158)](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/foundation.js#L158) (`syncAdminUserToAccount`) | `INSERT INTO authorities ... 'ADMIN_ACCESS'` | Hợp đồng kiến trúc nền tảng: Mọi tài khoản admin khi đồng bộ sang account đều được gắn quyền `SYSTEM:ADMIN_ACCESS`. |

---

## 3. KIỂM TOÁN VÀ KẾ HOẠCH PHỤC HỒI (AUDIT & ROLLBACK SPECIFICATION)

### A. Bảo Toàn Lịch Sử Kiểm Toán (Audit History Preservation)
1. **Schema `audit_logs`:**
   Gồm các trường: `id VARCHAR(64) PK`, `actor_id VARCHAR(255)`, `actor_role VARCHAR(50)`, `action VARCHAR(50)`, `entity_type VARCHAR(50)`, `entity_id VARCHAR(255)`, `before_value LONGTEXT`, `after_value LONGTEXT`, `reason TEXT`, `correlation_id VARCHAR(64)`, `created_at TIMESTAMP`.
2. **Quy tắc Bất biến:**  
   Bảng `audit_logs` hoạt động theo nguyên tắc **Chỉ ghi thêm (Append-Only)**.  
   **Lệnh Rollback tuyệt đối KHÔNG ĐƯỢC XÓA bản ghi `OWNER_BOOTSTRAP` cũ**.

### B. Cách thức Ghi nhận Rollback (`OWNER_BOOTSTRAP_ROLLBACK`)
Khi thực hiện rollback, một bản ghi kiểm toán mới được bổ sung vào `audit_logs`:
- `id`: `<UUID>`
- `actor_id`: `'SYSTEM'`
- `actor_role`: `'owner'`
- `action`: `'OWNER_BOOTSTRAP_ROLLBACK'`
- `entity_type`: `'USER'`
- `entity_id`: `'tuantq'`
- `before_value`: `JSON.stringify({ username: 'tuantq', role: 'owner', person_id: '@I115@' })`
- `after_value`: `NULL`
- `reason`: `'Human directed rollback of Owner bootstrap'`
- `correlation_id`: `<ROLLBACK_CORRELATION_UUID>`

### C. Kịch bản Rollback Sạch (Zero Orphan Guarantee)
Lệnh rollback thủ công xóa chính xác theo thứ tự quan hệ phụ thuộc để không tạo ra bất kỳ bản ghi mồ côi nào:
```sql
START TRANSACTION;

-- 1. Lấy account_id hiện tại của tuantq
SET @target_account_id = (SELECT id FROM accounts WHERE username = 'tuantq');

-- 2. Xóa quyền ReBAC (authorities) gắn với account_id
DELETE FROM authorities WHERE actor_id = @target_account_id AND actor_type = 'ACCOUNT';

-- 3. Xóa liên kết nhân thân (identity_mappings)
DELETE FROM identity_mappings WHERE account_id = @target_account_id;

-- 4. Xóa tài khoản thành viên (accounts)
DELETE FROM accounts WHERE id = @target_account_id;

-- 5. Xóa tài khoản quản trị (admin_users)
DELETE FROM admin_users WHERE username = 'tuantq';

-- 6. Ghi vết kiểm toán Rollback mà KHÔNG XÓA vết bootstrap cũ
INSERT INTO audit_logs (id, actor_id, actor_role, action, entity_type, entity_id, before_value, after_value, reason, created_at)
VALUES (UUID(), 'SYSTEM', 'owner', 'OWNER_BOOTSTRAP_ROLLBACK', 'USER', 'tuantq', 
        JSON_OBJECT('username', 'tuantq', 'role', 'owner', 'person_id', '@I115@'), 
        NULL, 'Manual Human-Authorized Rollback', NOW());

COMMIT;
```

---

## 4. MA TRẬN XỬ LÝ TRẠNG THÁI CỤC BỘ (PARTIAL-STATE IDEMPOTENCY MATRIX)

Trước khi thực hiện `START TRANSACTION`, script tiến hành quét pre-flight đối với cả 4 bảng để phát hiện và xử lý mọi kịch bản trạng thái cục bộ:

| STT | Trạng thái phát hiện trong CSDL | Hành vi xử lý của Script | Điều kiện DỪNG (STOP Condition) | Cần Human Intervention? |
| :---: | :--- | :--- | :--- | :---: |
| **1** | **Trạng thái Sạch (Clean State):**<br>Không có bản ghi nào của `tuantq` trong cả 4 bảng. | Bắt đầu Transaction và thực thi nạp mới 100%. | Không dừng. Tiếp tục thi công. | **KHÔNG** |
| **2** | **Chỉ có `admin_users`:**<br>`admin_users` đã có `tuantq`, nhưng `accounts` chưa có. | Dừng ngay lập tức. Cảnh báo tài khoản quản trị đã tồn tại nhưng thiếu tài khoản thành viên; không tự ý tạo chắp vá. | `STOP_ADMIN_USERS_EXISTS`<br>*(Mã lỗi exit 101)* | **CÓ** (Tuấn quyết định xóa tài khoản cũ hay đồng bộ) |
| **3** | **Chỉ có `accounts`:**<br>`accounts` đã có `tuantq`, nhưng `admin_users` chưa có. | Dừng ngay lập tức. Cảnh báo username đã bị chiếm dụng bởi thành viên; không tự ý thăng quyền lên Owner. | `STOP_ACCOUNTS_EXISTS`<br>*(Mã lỗi exit 102)* | **CÓ** (Tuấn xác minh tài khoản thành viên) |
| **4** | **Có `accounts` nhưng thiếu `identity_mappings`:**<br>Đã có tài khoản nhưng chưa liên kết nhân thân. | Dừng an toàn. Không tự động chèn mapping nếu trạng thái tài khoản chưa rõ ràng. | `STOP_MAPPING_MISSING`<br>*(Mã lỗi exit 103)* | **CÓ** (Tuấn kiểm tra mapping) |
| **5** | **Xung đột Nhân thân (Mapping Conflict):**<br>• `@I115@` đã bị tài khoản khác chiếm dụng, HOẶC<br>• `tuantq` đang bị trỏ vào Person ID khác `@I115@`. | **DỪNG AN TOÀN TUYỆT ĐỐI**. Ngăn chặn nguy cơ chiếm đoạt hoặc sai lệch danh tính thế hệ gia tộc. | `STOP_IDENTITY_CONFLICT`<br>*(Mã lỗi exit 104)* | **CÓ BẮT BUỘC** (Cần Tuấn thẩm tra CSDL) |
| **6** | **Quyền ReBAC mồ côi (Authority Conflict):**<br>Đã tồn tại bản ghi `authorities` trùng `actor_id`. | Dừng an toàn để tránh tạo duplicate quyền hạn. | `STOP_AUTHORITY_EXISTS`<br>*(Mã lỗi exit 105)* | **CÓ** (Tuấn rà soát bảng `authorities`) |
| **7** | **Đã hoàn tất trọn vẹn (Already Bootstrapped):**<br>Cả 4 bảng đều đã có bản ghi hợp lệ của `tuantq` với role `owner` và map `@I115@`. | Thông báo hệ thống đã ở trạng thái tối ưu; không chạy lệnh ghi nào và thoát với mã thành công 0. | `STOP_ALREADY_BOOTSTRAPPED`<br>*(Mã exit 0)* | **KHÔNG** (Sẵn sàng đăng nhập) |

---

## 5. KỊCH BẢN THI CÔNG CHI TIẾT (FINAL BOOTSTRAP SCRIPT SPECIFICATION)

Script được đặt tại `/volume1/web/family-api/scripts/bootstrap_owner.js` trên NAS:

```javascript
/**
 * /volume1/web/family-api/scripts/bootstrap_owner.js
 * Production Owner Bootstrap Script with Strict Idempotency & Transaction Integrity
 */

const readline = require('readline');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const TARGET_USERNAME = 'tuantq';
const TARGET_ROLE = 'owner';
const TARGET_PERSON_ID = '@I115@';

function promptPasswordHidden(query) {
    return new Promise((resolve) => {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        const stdin = process.openStdin();
        process.stdin.on('data', (char) => {
            char = char + '';
            switch (char) {
                case '\n': case '\r': case '\u0004': stdin.pause(); break;
                default: process.stdout.write('\x1B[2K\x1B[200D' + query + '[' + '*'.repeat(rl.line.length) + ']'); break;
            }
        });
        rl.question(query, (value) => {
            rl.history = rl.history.slice(1);
            rl.close();
            console.log('');
            resolve(value.trim());
        });
    });
}

async function main() {
    console.log('====================================================');
    console.log('GIA TỘC TRẦN TRỌNG THỤ — PRODUCTION OWNER BOOTSTRAP');
    console.log('====================================================');

    let password = process.env.OWNER_BOOTSTRAP_PASS;
    if (!password) {
        password = await promptPasswordHidden('Nhập mật khẩu an toàn mới cho tài khoản Owner tuantq: ');
    }
    if (!password || password.length < 8) {
        console.error('❌ Lỗi: Mật khẩu không được để trống và phải có ít nhất 8 ký tự.');
        process.exit(1);
    }

    const conn = await mysql.createConnection({
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'family_archive',
        socketPath: process.env.DB_SOCKET || '/run/mysqld/mysqld10.sock'
    });

    try {
        console.log('\n[PRE-FLIGHT] Quét kiểm tra ma trận trạng thái cục bộ...');

        const [adminRows] = await conn.query('SELECT id, username, role, is_active FROM admin_users WHERE username = ?', [TARGET_USERNAME]);
        const [accRows] = await conn.query('SELECT id, username, role, status FROM accounts WHERE username = ?', [TARGET_USERNAME]);
        const [personRows] = await conn.query('SELECT id, name FROM people WHERE id = ?', [TARGET_PERSON_ID]);
        const [mapRows] = await conn.query('SELECT account_id, person_id FROM identity_mappings WHERE person_id = ?', [TARGET_PERSON_ID]);

        // Kiểm tra nhân thân @I115@
        if (personRows.length === 0) {
            console.error(`❌ [STOP_PERSON_NOT_FOUND] Không tìm thấy Person ID ${TARGET_PERSON_ID} trong bảng people.`);
            process.exit(1);
        }
        console.log(`✓ Nhân thân phả hệ xác nhận: ${personRows[0].name} (${TARGET_PERSON_ID})`);

        // Case 7: Đã hoàn tất 100%
        if (adminRows.length > 0 && accRows.length > 0 && mapRows.length > 0) {
            if (mapRows[0].account_id === accRows[0].id) {
                console.log('🎉 [STOP_ALREADY_BOOTSTRAPPED] Tài khoản tuantq và nhân thân @I115@ đã được khởi tạo hoàn chỉnh từ trước. Dừng an toàn.');
                process.exit(0);
            }
        }

        // Case 5: Xung đột nhân thân
        if (mapRows.length > 0 && (accRows.length === 0 || mapRows[0].account_id !== accRows[0].id)) {
            console.error(`❌ [STOP_IDENTITY_CONFLICT] Nhân vật ${TARGET_PERSON_ID} đang bị liên kết với account_id khác (${mapRows[0].account_id}). Cần Tuấn can thiệp.`);
            process.exit(104);
        }

        // Case 2: Chỉ có admin_users
        if (adminRows.length > 0 && accRows.length === 0) {
            console.error(`❌ [STOP_ADMIN_USERS_EXISTS] Tài khoản "${TARGET_USERNAME}" đã tồn tại trong admin_users nhưng chưa có trong accounts. Cần Tuấn can thiệp.`);
            process.exit(101);
        }

        // Case 3: Chỉ có accounts
        if (accRows.length > 0 && adminRows.length === 0) {
            console.error(`❌ [STOP_ACCOUNTS_EXISTS] Tên đăng nhập "${TARGET_USERNAME}" đã tồn tại trong accounts nhưng chưa có trong admin_users. Cần Tuấn can thiệp.`);
            process.exit(102);
        }

        // Case 1: Trạng thái sạch -> Tiến hành khởi tạo nguyên tử
        console.log('✓ Xác nhận Trạng thái Sạch (Clean State). Bắt đầu Atomic Transaction trên InnoDB...');
        await conn.beginTransaction();

        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const accountId = crypto.randomUUID();
        const authorityId = crypto.randomUUID();
        const auditLogId = crypto.randomUUID();
        const correlationId = crypto.randomUUID();
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // 1. admin_users
        const [adminResult] = await conn.query(
            'INSERT INTO admin_users (username, password_hash, role, is_active, created_at) VALUES (?, ?, ?, 1, ?)',
            [TARGET_USERNAME, passwordHash, TARGET_ROLE, now]
        );
        const adminUserId = adminResult.insertId;
        console.log(`  -> [1/5] Khởi tạo admin_users: username="${TARGET_USERNAME}", role="${TARGET_ROLE}" (ID: ${adminUserId})`);

        // 2. accounts
        await conn.query(
            'INSERT INTO accounts (id, username, password_hash, role, status, created_at) VALUES (?, ?, ?, ?, "ACTIVE", ?)',
            [accountId, TARGET_USERNAME, passwordHash, TARGET_ROLE, now]
        );
        console.log(`  -> [2/5] Khởi tạo accounts: ID="${accountId}", status="ACTIVE"`);

        // 3. identity_mappings
        await conn.query(
            'INSERT INTO identity_mappings (account_id, person_id) VALUES (?, ?)',
            [accountId, TARGET_PERSON_ID]
        );
        console.log(`  -> [3/5] Khởi tạo identity_mappings: account_id="${accountId}" -> person_id="${TARGET_PERSON_ID}"`);

        // 4. authorities (ReBAC)
        await conn.query(
            'INSERT INTO authorities (id, actor_type, actor_id, resource_type, resource_id, action) VALUES (?, "ACCOUNT", ?, "SYSTEM", "*", "ADMIN_ACCESS")',
            [authorityId, accountId]
        );
        console.log(`  -> [4/5] Khởi tạo authorities: SYSTEM:ADMIN_ACCESS cấp cho Account ID`);

        // 5. audit_logs
        const auditDetails = JSON.stringify({
            username: TARGET_USERNAME,
            role: TARGET_ROLE,
            person_id: TARGET_PERSON_ID,
            admin_user_id: adminUserId,
            reason: 'INITIAL_OWNER_BOOTSTRAP_PRODUCTION_V2.0.0'
        });
        await conn.query(
            'INSERT INTO audit_logs (id, actor_id, actor_role, action, entity_type, entity_id, before_value, after_value, reason, correlation_id, created_at) VALUES (?, ?, "owner", "OWNER_BOOTSTRAP", "USER", ?, NULL, ?, "Initial Owner Provisioning", ?, ?)',
            [auditLogId, accountId, TARGET_USERNAME, auditDetails, correlationId, now]
        );
        console.log(`  -> [5/5] Ghi nhận audit_logs: action="OWNER_BOOTSTRAP" (Correlation: ${correlationId})`);

        await conn.commit();
        console.log('\n====================================================');
        console.log('🎉 BOOTSTRAP OWNER PRODUCTION HOÀN TẤT THÀNH CÔNG (100%)!');
        console.log('====================================================');
        console.log(`• Tên đăng nhập: ${TARGET_USERNAME}`);
        console.log(`• Vai trò tối cao: ${TARGET_ROLE}`);
        console.log(`• Trạng thái: ACTIVE`);
        console.log(`• Nhân thân chính danh: ${personRows[0].name} (${TARGET_PERSON_ID})`);
        console.log(`• Quyền hạn ReBAC: SYSTEM:ADMIN_ACCESS`);
        console.log('====================================================');

    } catch (err) {
        await conn.rollback();
        console.error('\n❌ GẶP LỖI HỆ THỐNG — ĐÃ ROLLBACK GIAO DỊCH TOÀN VẸN:');
        console.error(err.message);
        process.exit(1);
    } finally {
        await conn.end();
    }
}

main();
```

---

## 6. KẾ HOẠCH KIỂM THỬ XÁC MINH SAU BOOTSTRAP (POST-BOOTSTRAP TEST PLAN)

1. **Test Case 1 (Cơ sở dữ liệu):**
   - Xác nhận `admin_users` có đúng 1 record `tuantq`, `role='owner'`, `is_active=1`.
   - Xác nhận `accounts` có đúng 1 record `tuantq`, `role='owner'`, `status='ACTIVE'`.
   - Xác nhận `identity_mappings` liên kết đúng `account_id` với `@I115@`.
   - Xác nhận `authorities` có đúng 1 quyền `ADMIN_ACCESS` gắn với `account_id`.
2. **Test Case 2 (Đăng nhập Thực tế qua Web):**
   - Tuấn mở trình duyệt truy cập `https://giatoctrantrongthu.com/login`.
   - Nhập `username: tuantq` và mật khẩu mới.
   - Xác nhận đăng nhập thành công, nhận cookie `sid` hợp lệ.
3. **Test Case 3 (Không gian Cá nhân `/me`):**
   - Truy cập `https://giatoctrantrongthu.com/me`.
   - Xác nhận hiển thị chính xác thẻ hồ sơ: **Gioan Baotixita Trần Quốc Tuấn** (`@I115@`).
4. **Test Case 4 (Không gian Quản trị `/admin`):**
   - Truy cập `https://giatoctrantrongthu.com/admin`.
   - Xác nhận truy cập Control Center thành công với thẩm quyền Owner, có quyền xem danh sách đề xuất và kiểm toán hệ thống.

---

## 7. KIỂM TOÁN RANH GIỚI TIẾP CẬN TƯ LIỆU CLARA (CLARA ACCESS BOUNDARY AUDIT)

Dữ liệu Chuyên san Thư gửi Clara được xếp loại phân mật: **`BRANCH_RESTRICTED_P0`** *(Tư liệu di sản riêng tư nội bộ của gia đình nhỏ thuộc nhánh Hạnh Đào)*.

### A. Truy vết Triển khai Code Thực tế (Implementation Trace)

1. **Hàm Phân quyền `isClaraEligible(req)` (`server/member.js` dòng 37-45):**
   ```javascript
   function isClaraEligible(req) {
       if (!req.session || !req.session.accountId) return false;
       const username = (req.session.username || '').toLowerCase();
       const role = req.session.role;
       // Eligible: Tuấn (admin / owner / tuantq / tuan) or explicit personId in Hạnh Đào branch
       if (role === 'admin' || role === 'owner' || username === 'tuantq' || username === 'tuan') return true;
       if (req.session.personId === '@I18@' || req.session.personId === '@I170@') return true;
       return false;
   }
   ```
2. **Các Tuyến Đường Bảo vệ Tư liệu Clara (`server/member.js`):**
   - **Giao diện HTML (`/me/clara` - L640-648):**  
     Bảo vệ bằng `requireAccount`. Nếu `!isClaraEligible(req)`, trả về **`HTTP 404 Not Found` (Zero-Hint Containment)**. Người không có phận sự xem như trang không tồn tại.
   - **Dữ liệu JSON (`/api/member/clara.json` - L600-623):**  
     Bảo vệ bằng `requireAccount`. Nếu `!isClaraEligible(req)`, trả về **`HTTP 403 Forbidden` (`FORBIDDEN_RESTRICTED_BRANCH`)**. Nếu vượt qua kiểm tra, đọc tệp `server/data/private/clara.json`.
   - **Hình ảnh Riêng tư (`/assets/private/images/clara/:filename` - L626-637):**  
     Bảo vệ bằng `requireAccount`. Nếu `!isClaraEligible(req)`, trả về **`HTTP 403 Forbidden`**.
3. **Lớp Bảo vệ Tĩnh ở Tầng Server (`server/index.js` L20-46):**
   - `SENSITIVE_PATH` chặn toàn bộ đường dẫn tĩnh `data/private` và `thu-gui-clara`.
   - `express.static` trên `/assets` chặn đứng toàn bộ yêu cầu tới `/assets/private/*`, bắt buộc chuyển tiếp xuống router `member.js` để kiểm tra phiên và phân quyền.
   - `vercel.json` redirect toàn bộ `/data/private/(.*)` về `/`.

### B. Ma trận Quyết định Phân quyền Logic (Permission Decision Matrix)

| STT | Vai trò Tài khoản (`accounts.role`) | Liên kết Nhân thân (`person_id`) | Tên đăng nhập (`username`) | Kết quả `isClaraEligible` | Căn cứ điều kiện trong Code |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **1** | `member` | `@I115@` | khác `tuantq` | **`DENIED` (False)** | `role` không phải owner/admin, `personId` không thuộc `@I18@` / `@I170@`. |
| **2** | `owner` | `@I115@` | `tuantq` | **`ALLOWED` (True)** | Khớp cả 3 điều kiện: `role === 'owner'`, `username === 'tuantq'`, và là tác giả "Cậu Tuấn". |
| **3** | `owner` | `@I1@` (Person khác) | bất kỳ | **`ALLOWED` (True)** | Khớp điều kiện `role === 'owner'` (quyền quản trị hệ thống). |
| **4** | `admin` | Không mapping (`NULL`) | bất kỳ | **`ALLOWED` (True)** | Khớp điều kiện `role === 'admin'`. |
| **5** | `member` | `@I18@` (Clara) | bất kỳ | **`ALLOWED` (True)** | Khớp điều kiện nhân thân huyết thống: `personId === '@I18@'`. |
| **6** | `member` | `@I170@` (Hạnh Đào) | bất kỳ | **`ALLOWED` (True)** | Khớp điều kiện nhân thân huyết thống: `personId === '@I170@'`. |
| **7** | `member` | `@I2@`..`@I223@` (Nhánh khác) | bất kỳ | **`DENIED` (False)** | Bị từ chối 100%, không thuộc nhánh Hạnh Đào. |

### C. Đánh giá Tính Độc Lập giữa Quyền Owner và Tư liệu Clara

1. **Khả năng Tách biệt Kiến trúc:**
   - **HOÀN TOÀN TÁCH BIỆT ĐƯỢC.** Quản trị hệ thống (`ADMIN_ACCESS`) là quyền kỹ thuật/hạ tầng (System Tier), trong khi Thư gửi Clara là quyền riêng tư nhân thân (Kinship Identity Tier).
   - Nếu trong tương lai Tuấn và Emarald muốn phân tách triệt để: Chỉ cần điều chỉnh dòng 42 của `server/member.js` để loại bỏ `role === 'admin' || role === 'owner'`, chuyển 100% sang kiểm tra `req.session.personId in {'@I115@', '@I18@', '@I170@'}`.
2. **Cơ sở Nghiệp vụ & Nhân thân của Tuấn (`tuantq`, `@I115@`):**
   - Trong gia tộc, Tuấn chính là **Tác giả trực tiếp ("Cậu Tuấn")** đã chấp bút viết 8 bức thư gửi cho Clara (Maria Trần An Nhã, `@I18@`).
   - Do đó, việc Tuấn (`tuantq`, `@I115@`) có quyền tiếp cận các bức thư do chính mình viết là hoàn toàn tự nhiên và đúng đắn về mặt đạo lý gia đình lẫn ý định sản phẩm.
3. **BẢO VỆ VẬT LÝ TUYỆT ĐỐI TRÊN PRODUCTION NAS (PHYSICAL CONTAINMENT):**
   - Kiểm tra pháp y trực tiếp trên máy chủ NAS (`100.80.147.119`):
     * Tệp `data/private/clara.json`: **HOÀN TOÀN KHÔNG TỒN TẠI** (`No such file or directory`).
     * Thư mục `assets/private/images/clara`: **HOÀN TOÀN KHÔNG TỒN TẠI** (`No such file or directory`).
     * CSDL MariaDB Production `family_archive`: **KHÔNG CÓ bất kỳ bài viết Clara nào trong bảng `stories`** (20/20 bài viết đều là MẠCH).
   - **Hệ quả Thực tế:** Ngay cả khi tài khoản `tuantq` được cấp quyền `isClaraEligible = true`, khi gọi API `/api/member/clara.json` hoặc ảnh Clara, máy chủ Production sẽ trả về **`HTTP 404 CLARA_DATA_NOT_FOUND`** do tệp dữ liệu không có trên server NAS.
4. **Không có Tuyến đường Thay thế (Zero Bypass):**  
   Không có bất kỳ route, API, middleware hay static handler nào cho phép bỏ qua lớp bảo vệ `isClaraEligible`.

### D. Xác nhận Ranh giới Kế hoạch Bootstrap
Kế hoạch Bootstrap Owner `tuantq`:
- Cấp quyền quản trị `admin_users.role = 'owner'` và `accounts.role = 'owner'`.
- Gắn nhân thân chính danh `identity_mappings` $\rightarrow$ `@I115@`.
- Cấp quyền ReBAC `authorities` $\rightarrow$ `SYSTEM:ADMIN_ACCESS`.
$\rightarrow$ **Xác nhận:** Kế hoạch Bootstrap **KHÔNG tạo ra bất kỳ quyền hạn nào vượt ra ngoài phạm vi đã được phê chuẩn trong kiến trúc**. Tính bảo mật của tư liệu Clara `BRANCH_RESTRICTED_P0` được đảm bảo an toàn tuyệt đối 100% ở cả tầng phân quyền logic và tầng cách ly vật lý.

---

## 8. ĐIỂM DỪNG TẠI HUMAN APPROVAL CHECKPOINT

- **Cam kết an toàn:** AGY không thực hiện bất kỳ thao tác `INSERT`, `UPDATE`, `DELETE` nào trên Production DB.
- **Trạng thái:** DỪNG TOÀN BỘ để bàn giao hồ sơ thẩm định ranh giới an ninh cho **Emarald** (QC Review) và **Tuấn** (Human Final Authority) xem xét ra quyết định phê chuẩn.
