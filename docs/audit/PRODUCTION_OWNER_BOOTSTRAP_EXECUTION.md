# PRODUCTION OWNER BOOTSTRAP EXECUTION REPORT

**Dự án:** Gia Tộc Trần Trọng Thu  
**Môi trường:** Production (`https://giatoctrantrongthu.com` / MariaDB 10.11 NAS Synology `100.80.147.119`)  
**Tài khoản Quản trị:** `tuantq`  
**Nhân thân Phả hệ:** `Gioan Baotixita Trần Quốc Tuấn` (`@I115@`)  
**Cấp thẩm quyền phê duyệt:** Tuấn (Human Final Authority)  
**Thời điểm thực thi:** 2026-11-11 16:42:26 (GMT+7)  
**Trạng thái Thực thi:** `COMPLETED` & `VERIFIED` (100% Thành công)  

---

## 1. TÓM TẮT THỰC THI (EXECUTIVE SUMMARY)

Thực hiện theo **EXECUTION ORDER — PRODUCTION OWNER BOOTSTRAP** do Tuấn phê duyệt:
1. **Pre-flight Idempotency Check:** Xác nhận CSDL Production `family_archive` hoàn toàn sạch, chưa tồn tại tài khoản `tuantq` trong `admin_users` và `accounts`, nhân thân phả hệ `@I115@` tồn tại và chưa bị liên kết tài khoản nào.
2. **Physical Database Backup:** Đã thực hiện snapshot vật lý toàn bộ CSDL Production trước khi can thiệp qua `/volume1/web/family-api/backups/do_backup.sh`.
3. **Atomic Transaction Bootstrap:** Đã khởi tạo thành công 5 bản ghi trong một giao dịch InnoDB duy nhất (Single Connection, Single Transaction), không có implicit commit.
4. **Idempotency Verification:** Chạy lại script trên Production, hệ thống phát hiện tài khoản đã tồn tại và thoát an toàn với mã lỗi 0, không sửa đổi dữ liệu.
5. **E2E Authentication Lifecycle Verification:** Xác minh đăng nhập thực tế trên Production Domain `https://giatoctrantrongthu.com`, nhận diện đầy đủ hồ sơ thành viên `@I115@`, quyền Quản trị Tối cao (`owner` / `requireOwner`), và kiểm chứng hủy phiên đăng nhập (Logout).
6. **Clara Physical Containment Verification:** Xác minh tài sản Clara vẫn duy trì trạng thái cách ly vật lý tuyệt đối (trả về HTTP 404).

---

## 2. BẰNG CHỨNG SAO LƯU VẬT LÝ (PRE-MUTATION BACKUP SNAPSHOT)

- **Lệnh thực thi:** `/volume1/web/family-api/backups/do_backup.sh`
- **Thời điểm hoàn tất:** 2026-11-11 16:39:09 (GMT+7)
- **Tập tin sao lưu:** `/volume1/web/family-api/backups/family_archive_prod_20261111_163908.sql`
- **Kích thước tệp:** 1,004,417 bytes
- **Mã băm toàn vẹn SHA-256:** `c956221c31dde0653280b46e2003140d382be5a5df26dcb855dabdc6fed447da`
- **Trạng thái:** `VERIFIED` (Tập tin sao lưu hợp lệ, có đầy đủ header/footer MariaDB dump).

---

## 3. CHI TIẾT GIAO DỊCH ATOMIC BOOTSTRAP (TRANSACTION EXECUTION)

Script thi công: `/volume1/web/family-api/scripts/bootstrap_owner.js`  
Engine CSDL: MariaDB 10.11 InnoDB (`family_archive`)  
Giao dịch: `START TRANSACTION` → 5 lệnh `INSERT` → `COMMIT`.

| STT | Bảng Dữ Liệu | Khóa Chính / Định Danh | Dữ Liệu Cấu Hình | Trạng Thái |
| :--- | :--- | :--- | :--- | :--- |
| **1/5** | `admin_users` | `id = 4` | `username = 'tuantq'`, `role = 'owner'`, `is_active = 1`, `password_hash = [SECURE BCRYPT HASH (12 rounds)]` | `VERIFIED` |
| **2/5** | `accounts` | `id = '5811e898-515c-4cdd-9eab-225186900f60'` | `username = 'tuantq'`, `role = 'owner'`, `status = 'ACTIVE'`, `password_hash = [SECURE BCRYPT HASH]` | `VERIFIED` |
| **3/5** | `identity_mappings` | `account_id = '5811e898-515c-4cdd-9eab-225186900f60'` | `person_id = '@I115@'` (*Gioan Baotixita Trần Quốc Tuấn*) | `VERIFIED` |
| **4/5** | `authorities` | `id = '49801c6e-070d-4a23-bf7f-4e2792ed57e1'` | `actor_type = 'ACCOUNT'`, `actor_id = '5811e898-515c-4cdd-9eab-225186900f60'`, `resource_type = 'SYSTEM'`, `resource_id = '*'`, `action = 'ADMIN_ACCESS'` | `VERIFIED` |
| **5/5** | `audit_logs` | `id = 'a83d4025-7dde-42dd-957b-dcbbf8c1a605'` | `actor_id = '5811e898-515c-4cdd-9eab-225186900f60'`, `actor_role = 'owner'`, `action = 'OWNER_BOOTSTRAP'`, `entity_type = 'USER'`, `entity_id = 'tuantq'`, `reason = 'INITIAL_OWNER_BOOTSTRAP_V2.0.0'` | `VERIFIED` |

---

## 4. BẰNG CHỨNG ĐỐI SOÁT TRỰC TIẾP TỪ MARIADB (POST-BOOTSTRAP EVIDENCE)

Truy vấn đối soát độc lập trực tiếp trên CSDL Production MariaDB:

```json
{
  "admin_users": [
    {
      "id": 4,
      "username": "tuantq",
      "role": "owner",
      "is_active": 1,
      "created_at": "2026-11-11T02:42:26.000Z",
      "has_valid_hash": 1
    }
  ],
  "accounts": [
    {
      "id": "5811e898-515c-4cdd-9eab-225186900f60",
      "username": "tuantq",
      "role": "owner",
      "status": "ACTIVE",
      "created_at": "2026-11-11T02:42:26.000Z",
      "has_valid_hash": 1
    }
  ],
  "identity_mappings": [
    {
      "account_id": "5811e898-515c-4cdd-9eab-225186900f60",
      "person_id": "@I115@"
    }
  ],
  "authorities": [
    {
      "id": "49801c6e-070d-4a23-bf7f-4e2792ed57e1",
      "actor_type": "ACCOUNT",
      "actor_id": "5811e898-515c-4cdd-9eab-225186900f60",
      "resource_type": "SYSTEM",
      "resource_id": "*",
      "action": "ADMIN_ACCESS"
    }
  ],
  "audit_logs": [
    {
      "id": "a83d4025-7dde-42dd-957b-dcbbf8c1a605",
      "actor_id": "5811e898-515c-4cdd-9eab-225186900f60",
      "actor_role": "owner",
      "action": "OWNER_BOOTSTRAP",
      "entity_type": "USER",
      "entity_id": "tuantq",
      "reason": "INITIAL_OWNER_BOOTSTRAP_V2.0.0",
      "correlation_id": "051bc0b0-d115-4f30-8ef4-10037fdfdf6f"
    }
  ]
}
```

---

## 5. BẰNG CHỨNG XÁC MINH VÒNG ĐỜI XÁC THỰC E2E (E2E AUTHENTICATION VERIFICATION)

Kiểm thử tự động trên Production Domain `https://giatoctrantrongthu.com`:

### 5.1. Đăng nhập Thành viên (`POST /api/member/login`)
- **Payload:** `{ "username": "tuantq", "password": "[REDACTED]" }`
- **Kết quả:** `HTTP 200 OK`
- **Response Data:**
  ```json
  {
    "id": "5811e898-515c-4cdd-9eab-225186900f60",
    "username": "tuantq",
    "status": "ACTIVE"
  }
  ```
- **Session Cookie:** Nhận cookie `sid` với các cờ `HttpOnly; SameSite=Lax`.

### 5.2. Hồ sơ Thành viên & Phả hệ (`GET /api/member/profile`)
- **Kết quả:** `HTTP 200 OK`
- **Response Data:**
  ```json
  {
    "account": {
      "username": "tuantq",
      "status": "ACTIVE",
      "role": "owner"
    },
    "person_id": "@I115@",
    "person_name": "Gioan Baotixita Trần Quốc Tuấn"
  }
  ```
- **Đánh giá:** Đã liên kết chính danh và hiển thị đầy đủ thông tin thành viên `@I115@`.

### 5.3. Quyền Quản trị Admin Content (`GET /api/admin/content/people`)
- **Kết quả:** `HTTP 200 OK`
- **Dữ liệu trả về:** 223 bản ghi nhân thân phả hệ.
- **Đánh giá:** Vượt qua kiểm tra `requireAuth` và định tuyến nội dung Quản trị thành công.

### 5.4. Quyền Quản trị Tối cao Owner (`GET /api/admin/database/schema`)
- **Kết quả:** `HTTP 200 OK`
- **Đánh giá:** Vượt qua kiểm tra bảo vệ `requireOwner` (chỉ cấp cho tài khoản có `role = 'owner'`).

### 5.5. Đăng xuất và Hủy Phiên (`GET /logout`)
- **Kết quả:** `HTTP 302 Found` (Chuyển hướng về `/`, hủy session và set cookie hết hạn `sid=; Expires=Thu, 01 Jan 1970 00:00:00 GMT`).
- **Kiểm tra sau đăng xuất:** Gọi lại `GET /api/member/profile` với cookie cũ trả về `HTTP 302` chuyển hướng về `/login`. Phiên làm việc đã bị hủy hoàn toàn.

### 5.6. Cách ly Vật lý Tài sản Clara (`GET /assets/private/images/clara/test.jpg`)
- **Kết quả với Session Owner:** `HTTP 404 Not Found`.
- **Đánh giá:** Dữ liệu Clara không tồn tại trên Production NAS, đảm bảo nguyên tắc cách ly vật lý tuyệt đối `BRANCH_RESTRICTED_P0`.

### 5.7. Xử lý Sự cố Thiếu tệp HTML Shell trên NAS (`GET /me` -> 404 Not Found)
- **Hiện tượng:** Khi Tuấn đăng nhập thành công tại `/login`, trình duyệt chuyển hướng đến `/me` và nhận `HTTP 404 Not Found`.
- **Nguyên nhân kỹ thuật:** Endpoint `GET /me` trong `member.js` gọi `res.sendFile(path.join(__dirname, 'member_dashboard.html'))`. Trên thư mục NAS `/volume1/web/family-api/` chưa được sao chép 8 tệp HTML vỏ (host shells) gồm: `member_dashboard.html`, `member_tree.html`, `member_gallery.html`, `member_events.html`, `member_person.html`, `member_mach.html`, `member_clara.html`, `member_spaces.html`.
- **Khắc phục:** Đã đồng bộ toàn bộ 8 tệp HTML shell lên `/volume1/web/family-api/` trên NAS.
- **Kiểm chứng lại (Verified):**
  - `GET /me` -> `HTTP 200 OK`
  - `GET /me/tree` -> `HTTP 200 OK`
  - `GET /me/gallery` -> `HTTP 200 OK`
  - `GET /me/events` -> `HTTP 200 OK`
  - `GET /me/mach` -> `HTTP 200 OK`
  - `GET /me/clara` -> `HTTP 200 OK`
  - **Kiểm thử trình duyệt thực tế (Puppeteer E2E):** Đăng nhập thành công, điều hướng trực tiếp vào `https://giatoctrantrongthu.com/me`, hiển thị đầy đủ thông tin:
    * Tiêu đề: *Member Space · Gia Tộc Trần Trọng Thu*
    * Danh tính: *Chào Tuấn, Gioan Baotixita Trần Quốc Tuấn (Sinh ngày: 05/07/1987)*
    * Không gian cá nhân đã xác thực, đầy đủ điều hướng thành viên.

---

## 6. LƯU TRỮ VÀ CHUYỂN GIAO MẬT KHẨU AN TOÀN

- **Mật khẩu khởi tạo:** Được tự sinh ngẫu nhiên mạnh (24 ký tự gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt theo tiêu chuẩn bảo mật).
- **Cơ chế truyền tham số:** Truyền trực tiếp qua luồng `stdin` trong kết nối SSH cô lập, không lộ qua `ps aux` hay lịch sử shell `history`.
- **Lưu trữ bảo mật cục bộ:**
  - Tệp lưu trữ: `local_secrets.owner_credentials.json` tại thư mục gốc dự án.
  - Phân quyền tệp: `chmod 600` (chỉ User sở hữu mới có quyền đọc/ghi).
  - Git Isolation: Tệp nằm trong quy tắc loại trừ `.gitignore` (`local_secrets.*`), đảm bảo **tuyệt đối không bị commit hay đẩy lên GitHub**.
- **Hướng dẫn cho Tuấn:**
  Tuấn có thể đọc mật khẩu an toàn bằng cách mở tệp cục bộ:
  ```bash
  cat local_secrets.owner_credentials.json
  ```
  Sau đó đăng nhập trực tiếp tại:
  `https://giatoctrantrongthu.com/login`

---

## 7. BÀN GIAO VÀ KẾT THÚC (FINAL HANDOFF STATUS)

1. **Objective:** Hoàn thành toàn diện việc Bootstrap tài khoản Owner `tuantq` trên Production.
2. **Work performed:** Kiểm tra idempotency, sao lưu CSDL vật lý, chạy giao dịch atomic khởi tạo 5 bản ghi, kiểm thử đăng nhập E2E và hủy phiên.
3. **Files changed on NAS:** 
   - `/volume1/web/family-api/scripts/bootstrap_owner.js` (Script khởi tạo an toàn).
   - `/volume1/web/family-api/backups/family_archive_prod_20261111_163908.sql` (Bản sao lưu pre-bootstrap).
4. **Local credentials file:** `local_secrets.owner_credentials.json` (mode 0600, gitignored).
5. **Report file:** `docs/audit/PRODUCTION_OWNER_BOOTSTRAP_EXECUTION.md` (giữ nguyên cục bộ, không commit/push).
6. **Next steps:** Tuấn đăng nhập trải nghiệm trực tiếp trên `https://giatoctrantrongthu.com/login`.

