# QUY TRÌNH THI CÔNG KHỞI TẠO TÀI KHOẢN OWNER (OWNER BOOTSTRAP RUNBOOK)

**Dự án:** Gia Tộc Trần Trọng Thu  
**Cấp thẩm quyền:**  
- **Tuấn:** Human Final Authority  
- **Emarald:** Strategic Architecture & QC Authority  
- **AGY:** Execution Agent  
**Thời điểm soạn thảo:** 2026-11-11 16:00 (GMT+7)  
**Trạng thái:** DỰ THẢO KỸ THUẬT (CHƯA THI CÔNG)  
**Chế độ thực thi:** STRICT READ-ONLY *(Tuyệt đối không chạy lệnh trên Production DB khi chưa có lệnh)*

---

## 1. MỤC TIÊU VÀ NGUYÊN TẮC THIẾT KẾ

Thiết lập tài khoản Quản trị Tối cao (Owner) cho Tuấn (`username: tuantq`) trên Cơ sở dữ liệu Production MariaDB trên NAS Synology nhằm đảm bảo:
1. **Tính Bất biến (Idempotency):** Có thể chạy lại nhiều lần mà không tạo bản ghi trùng lặp, không phá hủy hoặc ghi đè tài khoản đã tồn tại.
2. **An toàn Mật khẩu Tối đa:**  
   - **Tuyệt đối không truyền mật khẩu qua tham số dòng lệnh CLI** (tránh bị lưu trong lịch sử shell `history` hoặc lộ qua lệnh `ps aux`).
   - **Tuyệt đối không sao chép password hash từ môi trường Local**.
   - Mật khẩu được nhập trực tiếp qua cơ chế **ẩn ký tự (Hidden Input / TTY Prompt)** hoặc truyền qua biến môi trường phiên cô lập.
   - Không in mật khẩu hoặc hash ra màn hình / file log dưới bất kỳ hình thức nào.
3. **Đồng bộ Kiến trúc Xác thực (Auth Alignment):**  
   Khởi tạo đồng bộ và nguyên tử (Atomic Transaction) trên 4 bảng:
   - `admin_users`: Cấp quyền Quản trị cấp cao với `role = 'owner'`, `is_active = 1`.
   - `accounts`: Cấp không gian thành viên với `role = 'owner'`, `status = 'ACTIVE'`.
   - `identity_mappings`: Liên kết chính danh với Person ID gốc **`@I115@`** (*Gioan Baotixita Trần Quốc Tuấn*).
   - `authorities`: Cấp quyền ReBAC tối cao `actor_type = 'ACCOUNT', resource_type = 'SYSTEM', action = 'ADMIN_ACCESS'`.
   - `audit_logs`: Ghi vết kiểm toán biến động hệ thống `action = 'OWNER_BOOTSTRAP'`.

---

## 2. MÃ NGUỒN SCRIPT THI CÔNG CỤC BỘ TRÊN NAS

Script được thiết kế để lưu tại `/volume1/web/family-api/scripts/bootstrap_owner.js` trên NAS:

```javascript
/**
 * /volume1/web/family-api/scripts/bootstrap_owner.js
 * Idempotent CLI script to safely bootstrap the Owner account.
 * 
 * Usage:
 *   node scripts/bootstrap_owner.js
 * (Prompts securely for password without echoing to terminal)
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
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        const stdin = process.openStdin();
        process.stdin.on('data', (char) => {
            char = char + '';
            switch (char) {
                case '\n':
                case '\r':
                case '\u0004':
                    stdin.pause();
                    break;
                default:
                    process.stdout.write('\x1B[2K\x1B[200D' + query + '[' + '*'.repeat(rl.line.length) + ']');
                    break;
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
    console.log('GIA TỘC TRẦN TRỌNG THỤ — OWNER BOOTSTRAP PROVISIONER');
    console.log('====================================================');

    // 1. Check if password provided via secure environment or prompt
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
        console.log(`\n[PRE-FLIGHT] Đang kiểm tra hiện trạng CSDL: ${process.env.DB_NAME || 'family_archive'}...`);

        // A. Kiểm tra tồn tại trong admin_users
        const [existingAdmin] = await conn.query(
            'SELECT id, username, role, is_active FROM admin_users WHERE username = ?',
            [TARGET_USERNAME]
        );
        if (existingAdmin.length > 0) {
            console.warn(`⚠️ CẢNH BÁO: Tài khoản "${TARGET_USERNAME}" đã tồn tại trong admin_users (ID: ${existingAdmin[0].id}, Role: ${existingAdmin[0].role}, Active: ${existingAdmin[0].is_active}).`);
            console.warn('Dừng thi công an toàn để tránh ghi đè dữ liệu.');
            await conn.end();
            process.exit(0);
        }

        // B. Kiểm tra tồn tại trong accounts
        const [existingAccount] = await conn.query(
            'SELECT id, username, role, status FROM accounts WHERE username = ?',
            [TARGET_USERNAME]
        );
        if (existingAccount.length > 0) {
            console.warn(`⚠️ CẢNH BÁO: Tên đăng nhập "${TARGET_USERNAME}" đã tồn tại trong accounts (ID: ${existingAccount[0].id}).`);
            console.warn('Dừng thi công an toàn.');
            await conn.end();
            process.exit(0);
        }

        // C. Kiểm tra sự tồn tại của Person ID @I115@ trong people
        const [personRecord] = await conn.query(
            'SELECT id, name FROM people WHERE id = ?',
            [TARGET_PERSON_ID]
        );
        if (personRecord.length === 0) {
            console.error(`❌ Lỗi: Không tìm thấy nhân vật có Person ID ${TARGET_PERSON_ID} trong bảng people.`);
            await conn.end();
            process.exit(1);
        }
        console.log(`✓ Xác nhận nhân thân phả hệ: ${personRecord[0].name} (${TARGET_PERSON_ID})`);

        // D. Kiểm tra Person ID đã bị liên kết tài khoản khác chưa
        const [existingMapping] = await conn.query(
            'SELECT account_id FROM identity_mappings WHERE person_id = ?',
            [TARGET_PERSON_ID]
        );
        if (existingMapping.length > 0) {
            console.error(`❌ Lỗi: Nhân vật ${TARGET_PERSON_ID} đã được liên kết với account_id ${existingMapping[0].account_id}.`);
            await conn.end();
            process.exit(1);
        }

        console.log('✓ Pre-flight checks passed 100%. Bắt đầu ghi dữ liệu trong Transaction...');

        // 2. Bắt đầu Atomic Transaction
        await conn.beginTransaction();

        const saltRounds = 12; // Mức độ băm an toàn cao
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const accountId = crypto.randomUUID();
        const authorityId = crypto.randomUUID();
        const auditLogId = crypto.randomUUID();
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // Bước 1: Thêm vào admin_users
        const [adminResult] = await conn.query(
            'INSERT INTO admin_users (username, password_hash, role, is_active, created_at) VALUES (?, ?, ?, 1, ?)',
            [TARGET_USERNAME, passwordHash, TARGET_ROLE, now]
        );
        const adminUserId = adminResult.insertId;
        console.log(`  -> [1/5] Khởi tạo admin_users: username="${TARGET_USERNAME}", role="${TARGET_ROLE}" (ID: ${adminUserId})`);

        // Bước 2: Thêm vào accounts
        await conn.query(
            'INSERT INTO accounts (id, username, password_hash, role, status, created_at) VALUES (?, ?, ?, ?, "ACTIVE", ?)',
            [accountId, TARGET_USERNAME, passwordHash, TARGET_ROLE, now]
        );
        console.log(`  -> [2/5] Khởi tạo accounts: ID="${accountId}", status="ACTIVE"`);

        // Bước 3: Thêm vào identity_mappings
        await conn.query(
            'INSERT INTO identity_mappings (account_id, person_id) VALUES (?, ?)',
            [accountId, TARGET_PERSON_ID]
        );
        console.log(`  -> [3/5] Khởi tạo identity_mappings: account_id="${accountId}" -> person_id="${TARGET_PERSON_ID}"`);

        // Bước 4: Thêm vào authorities (ReBAC)
        await conn.query(
            'INSERT INTO authorities (id, actor_type, actor_id, resource_type, resource_id, action) VALUES (?, "ACCOUNT", ?, "SYSTEM", "*", "ADMIN_ACCESS")',
            [authorityId, accountId]
        );
        console.log(`  -> [4/5] Khởi tạo authorities: SYSTEM:ADMIN_ACCESS cấp cho Account ID`);

        // Bước 5: Ghi vết kiểm toán (audit_logs)
        const auditDetails = JSON.stringify({
            username: TARGET_USERNAME,
            role: TARGET_ROLE,
            person_id: TARGET_PERSON_ID,
            admin_user_id: adminUserId,
            reason: 'INITIAL_OWNER_BOOTSTRAP_V2.0.0'
        });
        await conn.query(
            'INSERT INTO audit_logs (id, actor_id, action, target_type, target_id, details, created_at) VALUES (?, ?, "OWNER_BOOTSTRAP", "USER", ?, ?, ?)',
            [auditLogId, accountId, accountId, auditDetails, now]
        );
        console.log(`  -> [5/5] Ghi nhận audit_logs: action="OWNER_BOOTSTRAP"`);

        // Commit Transaction
        await conn.commit();
        console.log('\n====================================================');
        console.log('🎉 BOOTSTRAP TÀI KHOẢN OWNER HOÀN TẤT THÀNH CÔNG (100%)!');
        console.log('====================================================');
        console.log(`• Tên đăng nhập: ${TARGET_USERNAME}`);
        console.log(`• Vai trò tối cao: ${TARGET_ROLE}`);
        console.log(`• Trạng thái: ACTIVE`);
        console.log(`• Nhân thân liên kết: ${personRecord[0].name} (${TARGET_PERSON_ID})`);
        console.log(`• Quyền hạn: Quản trị toàn hệ thống (SYSTEM:ADMIN_ACCESS)`);
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

## 3. QUY TRÌNH VẬN HÀNH CHUẨN KHI ĐƯỢC TUẤN DUYỆT (STEP-BY-STEP RUNBOOK)

Sau khi Tuấn duyệt kích hoạt phát hành V2.0.0, quy trình thực thi chỉ mất 1 phút:

1. **Chuẩn bị file script trên NAS:**
   Agy đưa script `bootstrap_owner.js` vào thư mục `/volume1/web/family-api/scripts/`.
2. **Kích hoạt chạy lệnh an toàn:**
   - Cách A (Nhập trực tiếp từ Terminal tương tác):  
     Tuấn hoặc Agy chạy lệnh `node scripts/bootstrap_owner.js` và nhập mật khẩu an toàn theo prompt ẩn ký tự.
   - Cách B (Truyền qua biến môi trường phiên dùng 1 lần):  
     `OWNER_BOOTSTRAP_PASS='<Mật_Khẩu_Của_Tuấn>' /var/packages/Node.js_v22/target/usr/local/bin/node scripts/bootstrap_owner.js`
3. **Kiểm tra đăng nhập thực tế:**
   Tuấn mở trình duyệt, truy cập `https://giatoctrantrongthu.com/login`, đăng nhập với tài khoản `tuantq` và kiểm tra hồ sơ cá nhân và quyền quản trị.

---

**DỪNG TẠI HUMAN CHECKPOINT — TUYỆT ĐỐI KHÔNG CHẠY LỆNH TRƯỚC KHI CÓ LỆNH TỪ TUẤN.**

