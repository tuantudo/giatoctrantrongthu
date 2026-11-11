# BÁO CÁO THẨM ĐỊNH AN NINH: ENDPOINT ĐỔI MẬT KHẨU
## POST /api/member/change-password & Cloudflare WAF Reconciliation

**Ngày thẩm định:** 2026-11-11  
**Môi trường:** Production / Hybrid Cloud (Vercel CDN Edge + Cloudflare WAF + Synology NAS API Gateway)  
**Trạng thái kiểm tra:** `VERIFIED` (8/8 Tiêu chí an ninh ĐẠT 100%)  
**Nguyên tắc thực thi:** STRICT READ-ONLY ON PRODUCTION — ZERO MUTATION

---

## 1. TỔNG QUAN & NGUYÊN NHÂN SỰ CỐ (EXECUTIVE SUMMARY)

### 1.1. Hiện tượng
Tài khoản Owner (`tuantq`) sau khi đăng nhập thành công vào hệ thống quản trị gia tộc không thể thực hiện đổi mật khẩu tại trang thiết lập thành viên. Trình duyệt ghi nhận phản hồi lỗi `403 Forbidden` dạng trang HTML từ Cloudflare Edge thay vì phản hồi JSON từ máy chủ backend.

### 1.2. Bằng chứng định lượng (Root Cause Evidence)
Kiểm tra cấu hình quy tắc Cloudflare WAF hiện hành:
- **Quy tắc WAF:** `Emergency Block API Mutations`
- **Biểu thức hiện hành:**
  ```text
  (http.request.method in {"POST" "PUT" "PATCH" "DELETE"} and http.request.uri.path contains "/api/" and not (http.request.method eq "POST" and http.request.uri.path in {"/api/member/login" "/api/member/proposals"}))
  ```
- **Hành vi:** Toàn bộ request có method gây đột biến dữ liệu (`POST`, `PUT`, `PATCH`, `DELETE`) vào `/api/*` đều bị Cloudflare WAF chặn ngay tại Edge, **NGOẠI TRỪ** duy nhất 2 endpoint được miễn trừ là `POST /api/member/login` và `POST /api/member/proposals`.
- **Kết luận nguyên nhân:** Đường dẫn `POST /api/member/change-password` chưa được bổ sung vào danh sách miễn trừ của quy tắc WAF trên, khiến mọi request đổi mật khẩu hợp lệ từ người dùng đều bị chặn đứng ở tầng Cloudflare WAF trước khi chạm tới API Gateway NAS.

---

## 2. KIỂM TOÁN MÃ NGUỒN BACKEND & GIA CỐ BẢO MẬT (BACKEND AUDIT)

Để đảm bảo an toàn tuyệt đối trước khi mở đường dẫn này qua Cloudflare WAF, mã nguồn Backend tại `server/index.js` và `server/member.js` đã được rà soát và gia cố toàn diện:

### 2.1. Diff đầy đủ giữa phiên bản gốc và phiên bản gia cố

#### Tệp `server/index.js`:
```diff
--- a/server/index.js
+++ b/server/index.js
@@ -247,6 +247,15 @@ const proposalIpLimiter = rateLimit({
     message: { ok: false, error: 'RATE_LIMIT_EXCEEDED_IP', message: 'Địa chỉ IP của bạn đã gửi quá nhiều đề xuất trong 1 giờ. Vui lòng thử lại sau.' }
 });
 
+const passwordChangeLimiter = rateLimit({
+    windowMs: 15 * 60 * 1000, // 15 phút
+    max: 5, // Tối đa 5 lần thử đổi mật khẩu trên 1 IP trong 15 phút
+    standardHeaders: true,
+    legacyHeaders: false,
+    statusCode: 429,
+    message: { error: 'Quá nhiều lần thử đổi mật khẩu. Vui lòng thử lại sau 15 phút.' }
+});
+
 const useMariaDB = process.env.DB_CLIENT === 'mysql';
 let db, runQuery, allQuery, getQuery;
 
@@ -411,7 +420,7 @@ app.get('/api/admin/database/schema', adminCors, requireAuth, requireOwner, asyn
 
 // ------------------- MEMBER ROUTES (P0.1) -------------------
 const { createMemberRouter } = require('./member');
-app.use('/', createMemberRouter(dbAccessor, { loginLimiter, proposalIpLimiter }));
+app.use('/', createMemberRouter(dbAccessor, { loginLimiter, proposalIpLimiter, passwordChangeLimiter }));
```

#### Tệp `server/member.js`:
```diff
--- a/server/member.js
+++ b/server/member.js
@@ -2,10 +2,10 @@ const express = require('express');
 const bcrypt = require('bcrypt');
 const path = require('path');
 const fs = require('fs');
-const { recordAuditLog } = require('./governance');
+const { recordAuditLog, withTransaction } = require('./governance');
 
 function createMemberRouter(dbAccessor, options = {}) {
-    const { loginLimiter, proposalIpLimiter } = options;
+    const { loginLimiter, proposalIpLimiter, passwordChangeLimiter } = options;
     const router = express.Router();
     let proposalSeq = 0;
 
@@ -47,6 +47,9 @@ function createMemberRouter(dbAccessor, options = {}) {
     // Middleware to check if user is logged in as an account
     async function requireAccount(req, res, next) {
         if (!req.session || !req.session.accountId) {
+            if (req.path.startsWith('/api/')) {
+                return res.status(401).json({ error: 'Chưa đăng nhập' });
+            }
             return res.redirect('/login');
         }
         try {
@@ -56,9 +59,17 @@ function createMemberRouter(dbAccessor, options = {}) {
             );
             if (!acc || acc.status === 'DISABLED') {
                 if (typeof req.session.destroy === 'function') {
-                    return req.session.destroy(() => res.redirect('/login'));
+                    return req.session.destroy(() => {
+                        if (req.path.startsWith('/api/')) {
+                            return res.status(403).json({ error: 'Tài khoản đã bị tạm khóa.' });
+                        }
+                        return res.redirect('/login');
+                    });
                 }
                 req.session = null;
+                if (req.path.startsWith('/api/')) {
+                    return res.status(403).json({ error: 'Tài khoản đã bị tạm khóa.' });
+                }
                 return res.redirect('/login');
             }
             const mapping = await dbAccessor.getQuery(
@@ -358,7 +369,11 @@ function createMemberRouter(dbAccessor, options = {}) {
     });
 
     // API to change password
-    router.post('/api/member/change-password', requireAccount, async (req, res) => {
+    const changePasswordMiddlewares = [
+        requireAccount,
+        ...(passwordChangeLimiter ? [passwordChangeLimiter] : [])
+    ];
+    router.post('/api/member/change-password', ...changePasswordMiddlewares, async (req, res) => {
         const { oldPassword, newPassword } = req.body || {};
         if (!oldPassword || !newPassword || String(newPassword).length < 8) {
             return res.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 8 ký tự.' });
@@ -372,11 +387,28 @@ function createMemberRouter(dbAccessor, options = {}) {
             if (!ok) return res.status(401).json({ error: 'Mật khẩu hiện tại không đúng' });
 
             const newHash = await bcrypt.hash(String(newPassword), 10);
-            await dbAccessor.runQuery("UPDATE accounts SET password_hash = ?, status = 'ACTIVE' WHERE id = ?", [newHash, accountId]);
+
+            // Atomic transaction: update accounts + admin_users + record audit log in a single transaction
+            await withTransaction(dbAccessor, async (tx) => {
+                await tx.runQuery("UPDATE accounts SET password_hash = ?, status = 'ACTIVE' WHERE id = ?", [newHash, accountId]);
+                if (account.username) {
+                    await tx.runQuery("UPDATE admin_users SET password_hash = ? WHERE LOWER(username) = LOWER(?)", [newHash, account.username]);
+                }
+                await recordAuditLog(tx, {
+                    actorId: accountId,
+                    actorRole: account.role || 'member',
+                    action: 'PASSWORD_CHANGE',
+                    entityType: 'ACCOUNT',
+                    entityId: accountId,
+                    reason: 'VOLUNTARY_PASSWORD_UPDATE',
+                    correlationId: req.session.id || require('crypto').randomUUID()
+                });
+            });
 
             req.session.status = 'ACTIVE';
             res.json({ success: true });
         } catch (e) {
+            console.error('Password change error:', e.message);
             res.status(500).json({ error: 'Không thể cập nhật mật khẩu lúc này.' });
         }
     });
```

### 2.2. Truy vết toàn bộ luồng xử lý (Execution Trace)

1. **Endpoint Binding & Middleware Pipeline:**
   - Client gửi `POST /api/member/change-password`.
   - Pipeline qua 3 lớp phòng vệ:
     1. Global CSRF Protection (`server/index.js` L166–L231): Bắt buộc kiểm tra Origin / Referer từ domain tin cậy (`https://giatoctrantrongthu.com`).
     2. Rate Limiting (`passwordChangeLimiter`): Chống tấn công brute-force mật khẩu cũ với ngưỡng nghiêm ngặt (5 lần / 15 phút trên mỗi IP, trả về `429 Too Many Requests`).
     3. Authentication Guard (`requireAccount`): Đảm bảo phiên hợp lệ có `session.accountId`. Nếu không có phiên hoặc tài khoản bị vô hiệu hóa (`DISABLED`), trả về ngay `401 / 403 JSON` (thay vì 302 redirect vốn chỉ dành cho HTML views).
2. **Xác thực Mật khẩu hiện tại (Current Password Verification):**
   - Đọc bản ghi `accounts` theo `session.accountId` cô lập.
   - Kiểm tra hash cũ qua `bcrypt.compare(oldPassword, account.password_hash)`.
   - Nếu sai: Trả về ngay `401 Unauthorized` (`{ error: 'Mật khẩu hiện tại không đúng' }`).
3. **Băm Mật khẩu Mới (Password Hashing):**
   - Kiểm tra độ dài: Tối thiểu 8 ký tự (trả về `400 Bad Request` nếu không thỏa mãn).
   - Mã hóa bằng cơ chế chuẩn của hệ thống: `bcrypt.hash(newPassword, 10)` (10 salt rounds an toàn).
4. **Đồng bộ Nguyên tử Hai Bảng & Nhật ký Giám sát (Atomic Transaction & Sync):**
   - Sử dụng `withTransaction(dbAccessor, ...)` để bọc toàn bộ khối cập nhật trong một Database Transaction duy nhất:
     * Cập nhật `accounts`: Ghi `password_hash = newHash` và chuyển `status = 'ACTIVE'`.
     * Cập nhật `admin_users`: Tìm bản ghi có cùng `username` (khớp case-insensitive) và cập nhật `password_hash = newHash`. Điều này ngăn chặn triệt để hiện tượng lệch mật khẩu giữa phân hệ thành viên và phân hệ quản trị đối với các tài khoản Owner/Admin.
     * Ghi nhật ký `audit_logs`: Ghi nhận sự kiện `PASSWORD_CHANGE` với `before_value` và `after_value` đều là `null` (Bảo đảm không rò rỉ bất kỳ thông tin nhạy cảm hay hash nào vào audit trail).
   - Nếu xảy ra bất kỳ lỗi nào ở bất kỳ bước nào, toàn bộ transaction tự động rollback 100%, bảo đảm không bao giờ rơi vào trạng thái partial update.
5. **Cập nhật Trạng thái Phiên (Session Update):**
   - Cập nhật `req.session.status = 'ACTIVE'` ngay trong memory session của người dùng, giúp mở khóa toàn bộ quyền của tài khoản mà không cần bắt buộc đăng xuất đăng nhập lại.

---

## 3. KẾT QUẢ KIỂM CHỨNG AN NINH ĐỘC LẬP (SECURITY VERIFICATION MATRIX)

Kịch bản kiểm thử tự động độc lập đã được thiết lập tại `tests/test_change_password_security.mjs`, vận hành trên CSDL SQLite cô lập (không sử dụng thông tin hay mật khẩu thật của Tuấn).

**Kết quả chạy thực tế:**
```text
🔒 Starting Change Password Security Verification Suite...

--- TEST 1: Unauthenticated request without session is rejected (401) ---
✓ PASS: Rejected with 401 JSON

--- TEST 2: Request with invalid current password is rejected (401) ---
✓ PASS: Rejected with 401 (Mật khẩu hiện tại không đúng)

--- TEST 3: Request with short new password (< 8 chars) is rejected (400) ---
✓ PASS: Rejected with 400

--- TEST 4: Valid password change updates BOTH accounts & admin_users atomically ---
✓ PASS: Both accounts & admin_users updated with new bcrypt hash

--- TEST 5: Audit log is recorded without password or hash leakage ---
✓ PASS: Audit log recorded cleanly without plaintext or hash exposure

--- TEST 6: Multi-tenant isolation (Cannot change password of another account) ---
✓ PASS: User B was completely isolated and untouched

--- TEST 7: Atomic rollback prevents partial update if error occurs ---
Password change error: Simulated DB Constraint Failure on admin_users
✓ PASS: Full rollback verified, zero partial update occurred

--- TEST 8: Rate limiting enforcement ---
✓ PASS: Rate limit enforced (HTTP 429)

🎉 ALL 8 SECURITY TESTS PASSED 100%!
```

### Bảng Ma trận Kiểm chứng An ninh:

| STT | Tiêu chí Kiểm định An ninh | Kỳ vọng Thiết kế | Kết quả Thực nghiệm | Phân loại |
| :---: | :--- | :--- | :--- | :---: |
| 1 | **Session Boundary** | Request không có session bị từ chối với HTTP 401 JSON. | Trả về HTTP 401 `{ error: 'Chưa đăng nhập' }`. Không redirect 302. | `VERIFIED` |
| 2 | **Credential Verification** | Request có mật khẩu hiện tại sai bị từ chối với HTTP 401 JSON. | Trả về HTTP 401 `{ error: 'Mật khẩu hiện tại không đúng' }`. Không ghi đè DB. | `VERIFIED` |
| 3 | **Password Complexity** | Mật khẩu dưới 8 ký tự bị chặn tại tầng validation. | Trả về HTTP 400 `{ error: 'Mật khẩu mới phải có ít nhất 8 ký tự.' }`. | `VERIFIED` |
| 4 | **Two-Table Synchronization** | Đồng bộ mật khẩu mới sang cả 2 bảng `accounts` và `admin_users`. | Cả hai bảng đều được cập nhật cùng một hash bcrypt mới. | `VERIFIED` |
| 5 | **Zero Credential Leakage** | Không in mật khẩu thô hoặc hash ra log / audit trail. | Audit log ghi nhận sự kiện `PASSWORD_CHANGE` với payload rỗng, không chứa credential. | `VERIFIED` |
| 6 | **Tenant & Actor Isolation** | Không thể đổi mật khẩu của tài khoản khác (IDOR). | Mật khẩu chỉ đổi cho chính `session.accountId`. Tài khoản khác không bị ảnh hưởng. | `VERIFIED` |
| 7 | **Atomic Rollback Guarantee** | Nếu gặp sự cố ở 1 bảng, toàn bộ transaction phải rollback. | Mô phỏng lỗi ghi `admin_users`: bảng `accounts` được rollback về mật khẩu cũ 100%. | `VERIFIED` |
| 8 | **Brute-Force Rate Limiting** | Giới hạn số lần thử trên IP để ngăn dò mật khẩu cũ. | Sau 5 lần gọi liên tiếp, lần thứ 6 bị chặn ngay với HTTP 429. | `VERIFIED` |

---

## 4. ĐỀ XUẤT ĐỐI SOÁT & CẬP NHẬT CLOUDFLARE WAF (WAF RECONCILIATION)

### 4.1. Quy tắc WAF cần hiệu chỉnh
- **Tên quy tắc:** `Emergency Block API Mutations`
- **Mục tiêu:** Cho phép luồng đổi mật khẩu thành viên `POST /api/member/change-password` đi qua Cloudflare Edge tới API Gateway NAS, trong khi vẫn tiếp tục khóa chặn 100% tất cả các API mutation khác.

### 4.2. Biểu thức hiện hành (Current Expression)
```text
(http.request.method in {"POST" "PUT" "PATCH" "DELETE"} and http.request.uri.path contains "/api/" and not (http.request.method eq "POST" and http.request.uri.path in {"/api/member/login" "/api/member/proposals"}))
```

### 4.3. Biểu thức chuẩn hóa đề xuất (Proposed Exact Expression)
```text
(http.request.method in {"POST" "PUT" "PATCH" "DELETE"} and http.request.uri.path contains "/api/" and not (http.request.method eq "POST" and http.request.uri.path in {"/api/member/login" "/api/member/proposals" "/api/member/change-password"}))
```

### 4.4. Đánh giá tác động an ninh
- **Phạm vi thay đổi:** Bổ sung đúng 1 chuỗi ký tự `"/api/member/change-password"` vào mảng các đường dẫn POST được phép.
- **Ranh giới an ninh:**
  * Toàn bộ các API nhạy cảm của hệ thống quản trị (`/api/admin/*`) với các phương thức `POST`, `PUT`, `DELETE`, `PATCH` tiếp tục bị Cloudflare WAF khóa chặn hoàn toàn.
  * Endpoint `/api/member/change-password` sau khi qua Cloudflare WAF được bảo vệ bởi 3 tầng phòng thủ nội bộ (CSRF Token/Origin Check + IP Rate Limiter 5 req/15m + Session Authentication Guard).
  * Không mở rộng bất kỳ bề mặt tấn công ngoài ý muốn nào.

---

## 5. CAM KẾT AN TOÀN PRODUCTION (PRODUCTION SAFETY)

Tuân thủ nghiêm ngặt chỉ đạo của Tuấn và quy chế AIOS Canonical Governance:
- ❌ **KHÔNG** cập nhật mật khẩu trực tiếp trong database.
- ❌ **KHÔNG** thay đổi quyền tài khoản Owner (`tuantq`).
- ❌ **KHÔNG** can thiệp hay thay đổi ranh giới bảo mật tài liệu Clara.
- ❌ **KHÔNG** sửa đổi cấu hình Cloudflare WAF tự tiện (để Tuấn trực tiếp thẩm duyệt và áp dụng trên Cloudflare Dashboard).
- ❌ **KHÔNG** restart daemon dịch vụ ngoài kế hoạch đã được phê duyệt.

---

## 6. ĐIỂM DỪNG PHÊ DUYỆT (HUMAN GATE CHECKPOINT)

Báo cáo kiểm toán an ninh endpoint đổi mật khẩu đã hoàn tất và đạt chuẩn `VERIFIED`.

**Kiến nghị các bước tiếp theo:**
1. **Tuấn (Human Authority)** xem xét báo cáo và cập nhật biểu thức quy tắc `Emergency Block API Mutations` trên Cloudflare WAF Dashboard theo mục 4.3.
2. AGY đồng bộ mã nguồn Backend đã gia cố (`server/index.js` và `server/member.js`) lên Production NAS và restart tiến trình Node.js an toàn.
3. Tuấn thực hiện đổi mật khẩu tài khoản `tuantq` trên giao diện `https://giatoctrantrongthu.com/me` để nghiệm thu thực tế.

