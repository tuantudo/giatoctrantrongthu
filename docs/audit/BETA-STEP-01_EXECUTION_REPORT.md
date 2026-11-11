# BÁO CÁO THI CÔNG HOÀN TẤT BƯỚC 1: CÔ LẬP CƠ SỞ DỮ LIỆU BETA (BETA STEP 1)

**Dự án:** Gia Tộc Trần Trọng Thu  
**Cấp thẩm quyền:**  
- **Tuấn:** Human Final Authority (Đã phê duyệt lệnh thi công duy nhất Bước 1)  
- **Emarald:** Strategic Architecture & QC Authority  
- **AGY:** Execution Agent  
**Thời điểm thực thi:** 2026-11-11 14:53:00 (GMT+7)  
**Trạng thái thi công:** **`HOÀN TẤT & ĐÃ KIỂM CHỨNG (VERIFIED)`**

---

## 1. KẾT QUẢ KIỂM TRA TIỀN THỰC THI (PRE-FLIGHT CHECKS)

Trước khi thực thi bất kỳ thao tác nào, hệ thống đã chạy script kiểm tra tính trinh nguyên trên máy chủ MariaDB 10.11:

| Hạng mục kiểm tra | Lệnh thực hiện | Kết quả thực tế | Đánh giá an toàn |
| :--- | :--- | :---: | :---: |
| **CSDL `family_archive_beta`** | `SHOW DATABASES LIKE 'family_archive_beta'` | **`NO` (Chưa tồn tại)** | Đạt chuẩn pre-flight |
| **User `family_beta_usr`** | `SELECT User FROM mysql.user WHERE User = 'family_beta_usr'` | **`NO` (Chưa tồn tại)** | Đạt chuẩn pre-flight |
| **Bảo toàn CSDL Production** | `SELECT COUNT(*) FROM family_archive.people; families;` | **people=223, families=68** | Bất biến nguyên vẹn |

*Kết luận Pre-flight:* Toàn bộ môi trường MariaDB hoàn toàn sạch, không có đối tượng trùng lặp hoặc xung đột. Đủ điều kiện thi công.

---

## 2. QUÁ TRÌNH THI CÔNG THỰC TẾ (EXECUTION LOG)

Thực hiện đúng 4 thao tác tuần tự theo phê duyệt:

1. **Khởi tạo CSDL Beta:**
   ```sql
   CREATE DATABASE family_archive_beta CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
   *Kết quả:* `EXEC_STEP_1_1: CREATE_DATABASE_OK`

2. **Khởi tạo User Beta cô lập tại localhost:**
   - Mật khẩu ngẫu nhiên mạnh được sinh trực tiếp bằng `crypto.randomBytes(24).toString("base64url")`.
   - Lệnh thực thi:
     ```sql
     CREATE USER 'family_beta_usr'@'localhost' IDENTIFIED BY ?;
     ```
   *Kết quả:* `EXEC_STEP_1_2: CREATE_USER_OK`

3. **Cấp quyền tối thiểu (Principle of Least Privilege):**
   ```sql
   GRANT SELECT, INSERT, UPDATE, DELETE ON family_archive_beta.* TO 'family_beta_usr'@'localhost';
   ```
   *Kết quả:* `EXEC_STEP_1_3: GRANT_PRIVILEGES_OK`
   *Tuân thủ chỉ thị:* Không chạy `FLUSH PRIVILEGES` do MariaDB tự động cập nhật bộ nhớ grant tables khi chạy lệnh `GRANT` trực tiếp.

4. **Lưu trữ bí mật an toàn (Secret Handling):**
   - Thông tin kết nối và mật khẩu được ghi trực tiếp vào tệp:
     `/volume1/web/family-api/.env.beta`
   - Phân quyền tệp nghiêm ngặt: **`chmod 600`** (`-rw------- 1 tuandzain users`).
   - Tuyệt đối không xuất mật khẩu thô ra màn hình terminal, log kiểm thử, Git hay bất kỳ tài liệu audit nào.
   *Kết quả:* `EXEC_STEP_1_4: SECRETS_PERSISTED_CHMOD_600_OK`

---

## 3. KẾT QUẢ KIỂM CHỨNG ĐỘC LẬP (VERIFICATION & NEGATIVE TESTS)

Sau khi tạo, một chuỗi kiểm thử độc lập gồm 5 chốt chặn đã được thực thi với kết quả xác thực 100%:

### A. Kiểm chứng Hiện diện & Quyền hạn
1. **Kiểm tra CSDL:**
   - `SHOW DATABASES LIKE 'family_archive_beta';` $\rightarrow$ **`EXISTS`**.
2. **Kiểm tra Grants của User Beta:**
   - `SHOW GRANTS FOR 'family_beta_usr'@'localhost';`
   - Bằng chứng thực tế:
     ```sql
     GRANT USAGE ON *.* TO `family_beta_usr`@`localhost` IDENTIFIED BY PASSWORD '...'
     GRANT SELECT, INSERT, UPDATE, DELETE ON `family_archive_beta`.* TO `family_beta_usr`@`localhost`
     ```
   - Xác nhận: **Không có quyền DDL (`CREATE`, `DROP`, `ALTER`), không có `GRANT OPTION`, không có quyền quản trị toàn cục.**

### B. Kiểm thử Rào cản An ninh Tiêu cực (Negative Isolation Tests)
Đăng nhập trực tiếp bằng user `family_beta_usr` và thực hiện các hành vi trái phép:

1. **Negative Test 1 — Truy cập CSDL Production (`family_archive`):**
   - Hành vi: `SELECT COUNT(*) FROM family_archive.people;`
   - Kết quả: **`PASSED (Bị chặn cứng)`**  
     Mã lỗi: **`ER_TABLEACCESS_DENIED_ERROR`** (`SELECT command denied to user 'family_beta_usr'@'localhost' for table 'people'`).
2. **Negative Test 2 — Thao tác DDL (`CREATE TABLE`):**
   - Hành vi: `CREATE TABLE family_archive_beta.probe (id INT);`
   - Kết quả: **`PASSED (Bị chặn cứng)`**  
     Mã lỗi: **`ER_TABLEACCESS_DENIED_ERROR`** (`CREATE command denied to user 'family_beta_usr'@'localhost' for table 'probe'`).
3. **Negative Test 3 — Truy cập CSDL Hệ thống (`mysql.user`):**
   - Hành vi: `SELECT * FROM mysql.user;`
   - Kết quả: **`PASSED (Bị chặn cứng)`**  
     Mã lỗi: **`ER_TABLEACCESS_DENIED_ERROR`** (`SELECT command denied to user 'family_beta_usr'@'localhost' for table 'user'`).

### C. Xác nhận Toàn vẹn Hệ thống Production
- CSDL `family_archive`: `people=223`, `families=68` (Không thay đổi, không suy suyển).
- Dịch vụ Node.js Production (`family-api`):
  - Tiến trình PID `28004` duy trì hoạt động liên tục (uptime không reset).
  - Kiểm tra `curl -I http://127.0.0.1:3000/` $\rightarrow$ **`HTTP 200 OK`**.

---

## 4. BÁO CÁO TUÂN THỦ RANH GIỚI NGHIÊM NGẶT (STRICT SCOPE COMPLIANCE)

AGY xác nhận tuân thủ 100% phạm vi được giao:
- [x] **CHƯA** sao chép dữ liệu phả hệ.
- [x] **CHƯA** tạo bất kỳ bảng nào trong `family_archive_beta` (Database hiện tại là schema rỗng).
- [x] **CHƯA** tạo API hay backend service Beta.
- [x] **CHƯA** sửa systemd service.
- [x] **CHƯA** sửa cấu hình Cloudflare hay Vercel.
- [x] **CHƯA** tạo tài khoản Owner hay thành viên.
- [x] **CHƯA** khởi động lại hoặc tác động tới Production.

---

## 5. DỪNG TẠI HUMAN CHECKPOINT (CHỜ CHỈ ĐẠO BƯỚC TIẾP THEO)

Bước 1 (Cô lập Cơ sở Dữ liệu Beta) đã hoàn thành trọn vẹn, đạt chuẩn an ninh tối đa.  
AGY **DỪNG HOÀN TOÀN TẠI ĐÂY**, giữ nguyên trạng thái hệ thống và chờ chỉ thị tiếp theo từ Tuấn.

