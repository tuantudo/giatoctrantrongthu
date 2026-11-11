# BÁO CÁO THỰC THI & ĐỐI SOÁT HỆ THỐNG XÁC THỰC
## AUTHENTICATION IMPLEMENTATION & PRODUCTION RECONCILIATION REPORT

**Thẩm quyền phê duyệt:** Tuấn (Human Final Authority / Product Owner)  
**Kiến trúc & QC:** Emarald (Strategic Architecture Authority)  
**Phụ trách:** AGENT 03  
**Ngày ban hành:** 2026-11-11  

---

## 1. ĐỐI SOÁT 7 YẾU TỐ HIỆN TRẠNG (EVIDENCE RECONCILIATION)

### 1. Backend code hiện tại ở repository
- **Vị trí:** `server/index.js` và `server/member.js`.
- **Hiện trạng:** Đã hoàn tất việc tích hợp:
  * `passwordChangeLimiter`: Giới hạn 5 lần thử / 15 phút trên mỗi IP (HTTP 429).
  * `requireAccount`: Phân biệt request API (`/api/*`) trả về HTTP 401/403 JSON thay vì 302 redirect.
  * Đồng bộ nguyên tử (`withTransaction`): Cập nhật đồng thời cả `accounts` và `admin_users` với cùng hash bcrypt mới.
  * Nhật ký giám sát (`recordAuditLog`): Ghi nhận sự kiện `PASSWORD_CHANGE` với `before_value` và `after_value` đều là `null` (zero credential leakage).

### 2. Backend code hiện tại trên Production NAS
- **Vị trí trên NAS:** `100.80.147.119:/volume1/web/family-api/`.
- **Hiện trạng:** Mã nguồn chạy trên NAS hiện đang là phiên bản V2.0.0 (commit `2d1ed2b`). Các sửa đổi gia cố mới trong `server/index.js` và `server/member.js` chưa được đẩy lên NAS do đang chờ phê duyệt tại Human Gate.

### 3. Tình trạng đồng bộ mã nguồn (Sync Status)
- **Trạng thái:** `CHƯA ĐỒNG BỘ LÊN NAS (PENDING HUMAN APPROVAL)`.
- **Lý do:** Tuân thủ nguyên tắc không được tự ý sửa đổi Production NAS mà không có lệnh phê duyệt từ Tuấn.

### 4. Quy tắc WAF hiện hành trên Cloudflare (Current WAF Rule)
- **Quy tắc:** `Emergency Block API Mutations`.
- **Biểu thức hiện tại:**
  ```text
  (http.request.method in {"POST" "PUT" "PATCH" "DELETE"} and http.request.uri.path contains "/api/" and not (http.request.method eq "POST" and http.request.uri.path in {"/api/member/login" "/api/member/proposals"}))
  ```
- **Hành vi thực tế:** Cloudflare WAF đang chặn `POST /api/member/change-password` với mã lỗi `HTTP 403 Forbidden` (HTML challenge page).

### 5. Change-password endpoint có thực sự hoạt động trên Production không?
- **Kết luận:** **CHƯA HOẠT ĐỘNG TRÊN PRODUCTION**.
- **Nguyên nhân kép:**
  1. Yêu cầu mạng bị Cloudflare Edge chặn trước khi tới NAS (lỗi 403 HTML từ Cloudflare).
  2. Mã nguồn trên NAS chưa có bản cập nhật atomic sync và rate limiting.

### 6. Các cơ chế bảo vệ đã được triển khai ở đâu?
- **Tầng Cloudflare WAF:** Đang chặn toàn bộ mutating API ngoài login và proposals.
- **Tầng Express Gateway (`server/index.js`):**
  * CSRF Protection: Kiểm tra `Origin` / `Referer` trên mọi request POST/PUT/PATCH/DELETE.
  * Rate Limiting: `loginLimiter` (5 req / 15m), `proposalIpLimiter` (30 req / 1h), `passwordChangeLimiter` (5 req / 15m).
- **Tầng Ứng dụng & Dữ liệu (`server/member.js` & `server/governance.js`):**
  * `requireAccount`: Kiểm tra session `accountId` và trạng thái `accounts.status !== 'DISABLED'`.
  * `withTransaction`: Bảo đảm tính toàn vẹn CSDL, rollback 100% nếu có lỗi.
  * `bcrypt`: 10 salt rounds.

### 7. Phân định môi trường kiểm thử: SQLite vs MariaDB
- **Các kiểm thử chạy trên SQLite:**
  * `tests/test_change_password_security.mjs` (8/8 PASSED): Chạy trên SQLite in-memory / local test DB để xác minh logic băm mật khẩu, phân nhánh 401/400/429, rollback transaction và audit log.
- **Các kiểm thử chạy trên MariaDB:**
  * `tests/test_physical_mariadb_integration.mjs` & `tests/test_mariadb_transaction_adapter.mjs`: Chạy đối soát kết nối trực tiếp với MariaDB.
- **Cam kết trung thực:** Kết quả kiểm thử trên SQLite **KHÔNG ĐƯỢC COI** là bằng chứng Production MariaDB đã hoạt động; Production chỉ được coi là hoạt động sau khi cập nhật WAF, đồng bộ code lên NAS và kiểm thử thực tế trên domain `giatoctrantrongthu.com`.

---

## 2. KẾ HOẠCH NÂNG CẤP BACKEND TIẾP THEO TRONG WORKSTREAM NÀY
Triển khai thêm 2 endpoint cần thiết trong `server/member.js`:
1. `GET /api/member/proposals/my`: Trả về danh sách đề xuất do chính tài khoản đang đăng nhập gửi (bảo vệ chống IDOR bằng cách lọc cứng theo `req.session.accountId`).
2. `POST /api/member/support`: Tiếp nhận yêu cầu trợ giúp và đóng góp thông tin/ảnh từ người thân, lưu trữ vào bảng `proposals` với `field = 'SUPPORT_REQUEST'` hoặc `field = 'MEDIA_CONTRIBUTION'`.

