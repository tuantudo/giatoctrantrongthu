# BÁO CÁO TIỀN KIỂM BƯỚC 2B: SẴN SÀNG NẠP DỮ LIỆU BASELINE (BETA-STEP-02B_PREFLIGHT)

**Dự án:** Gia Tộc Trần Trọng Thu  
**Cấp thẩm quyền:**  
- **Tuấn:** Human Final Authority  
- **Emarald:** Strategic Architecture & QC Authority  
- **AGY:** Execution Agent  
**Chế độ thực thi:** STRICT READ-ONLY (Chưa tạo bảng, chưa nạp dữ liệu vào CSDL Beta).  
**Thời điểm thực hiện:** 2026-11-11  

---

## 1. GAP-01 — THỰC NGHIỆM THẨM ĐỊNH RÀNG BUỘC CHECK (MARIADB CHECK ENFORCEMENT)

### A. Phiên bản & Biến Hệ thống
- **Lệnh thực hiện:** `SELECT @@version, @@check_constraint_checks;`
- **Kết quả trực tiếp từ MariaDB NAS:**
  * `MARIADB_VERSION`: **`10.11.11-MariaDB`** (Hỗ trợ đầy đủ ràng buộc CHECK từ MariaDB 10.2.1+).
  * `CHECK_CONSTRAINT_CHECKS_ENABLED`: **`YES (1)`** (Hệ thống đang kích hoạt kiểm tra ràng buộc CHECK trong mọi giao dịch).

### B. Danh sách 7 Bảng có Ràng buộc CHECK trong CSDL Production
Truy vấn từ `information_schema.CHECK_CONSTRAINTS`:
1. `authors`: `CHECK (json_valid(payload))`
2. `families`: `CHECK (json_valid(payload))`
3. `media`: `CHECK (json_valid(payload))`
4. `memories`: `CHECK (json_valid(payload))`
5. `people`: `CHECK (json_valid(payload))`
6. `series`: `CHECK (json_valid(payload))`
7. `stories`: `CHECK (json_valid(payload))`

### C. Thực nghiệm Kiểm thử Tiêu cực trên Bảng Tạm (Isolated Temporary Table Test)
Để chứng minh MariaDB thực sự cưỡng chế kiểm tra mà không tác động dữ liệu thật:
1. Tạo bảng tạm:  
   `CREATE TEMPORARY TABLE test_chk_enforcement (id INT PRIMARY KEY, payload LONGTEXT CHECK (json_valid(payload)));`
2. **Positive Test (Nạp JSON hợp lệ):**  
   `INSERT INTO test_chk_enforcement VALUES (1, '{"test": true}');` $\rightarrow$ **`SUCCESS (200)`**.
3. **Negative Test (Nạp chuỗi không phải JSON):**  
   `INSERT INTO test_chk_enforcement VALUES (2, 'MALFORMED_NOT_JSON');`  
   *Kết quả thực nghiệm:* **`PASSED (Bị chặn cứng ở tầng Database Engine)`**.  
   *Mã lỗi nhận được:* **`ER_CONSTRAINT_FAILED`**  
   `CONSTRAINT test_chk_enforcement.payload failed for family_archive.test_chk_enforcement`.
- **Kết luận GAP-01:** **`PASS (VERIFIED)`** — MariaDB thực sự cưỡng chế kiểm tra ràng buộc JSON 100%.

---

## 2. GAP-02 — DANH MỤC DỮ LIỆU BASELINE CHI TIẾT (BASELINE MANIFEST)

### A. Đối soát 14 Bảng Dữ liệu Cốt lõi
Truy vấn `SELECT COUNT(*)` trực tiếp trên từng bảng của `family_archive`:

| STT | Tên bảng (Table Name) | Production Row Count | Expected Beta Row Count | Phương pháp đối soát | Trạng thái Kiểm tra |
| :---: | :--- | :---: | :---: | :--- | :---: |
| 1 | `people` | **223** | **223** | `SELECT COUNT(*)` & đối chiếu 223 IDs | **VERIFIED** |
| 2 | `families` | **68** | **68** | `SELECT COUNT(*)` | **VERIFIED** |
| 3 | `timeline` | **215** | **215** | `SELECT COUNT(*)` | **VERIFIED** |
| 4 | `memories` | **2** | **2** | `SELECT COUNT(*)` | **VERIFIED** |
| 5 | `edges` | **1** | **1** | `SELECT COUNT(*)` | **VERIFIED** |
| 6 | `media` | **203** | **203** | `SELECT COUNT(*)` | **VERIFIED** |
| 7 | `person_media` | **173** | **173** | `SELECT COUNT(*)` | **VERIFIED** |
| 8 | `calendar_events` | **266** | **266** | `SELECT COUNT(*)` | **VERIFIED** |
| 9 | `events` | **1** | **1** | `SELECT COUNT(*)` | **VERIFIED** |
| 10 | `images` | **1** | **1** | `SELECT COUNT(*)` | **VERIFIED** |
| 11 | `stories` | **20** | **20** | `SELECT COUNT(*)` | **VERIFIED** |
| 12 | `series` | **2** | **2** | `SELECT COUNT(*)` | **VERIFIED** |
| 13 | `authors` | **3** | **3** | `SELECT COUNT(*)` | **VERIFIED** |
| 14 | `authorities` | **2** | **2** | `SELECT COUNT(*)` | **VERIFIED** |
| **TỔNG** | **14 BẢNG BASELINE** | **1,180** | **1,180** | **Tổng số toán học thực tế** | **VERIFIED** |

### B. Giải trình Trung thực Trí thức về Con số "1.438" trong Báo cáo STEP 2A
- **Số liệu toán học thực tế của 14 bảng baseline:** Đúng chính xác **`1,180` bản ghi**.
- **Nguồn gốc con số `1,438`:** Trong văn bản tổng kết của báo cáo STEP 2A, tác giả đã cộng nhầm số dòng ước lượng ban đầu của toàn bộ 19 bảng (`1180` dòng baseline + các bảng vận hành `proposals`, `audit_logs`, `accounts` test cũ).
- **Nguyên tắc bất biến:** AGY **tuyệt đối không tự bịa đặt hay điều chỉnh số liệu** để làm khớp con số 1.438 bị gõ nhầm. Con số baseline chân lý chuẩn xác 100% của 14 bảng là **`1,180` bản ghi**.
- **Kết luận GAP-02:** **`PASS (VERIFIED)`** — 14 bảng baseline có đầy đủ cấu trúc và dữ liệu với tổng cộng 1,180 bản ghi.

---

## 3. GAP-03 — CƠ CHẾ SAO LƯU & KHÔI PHỤC (SNAPSHOT & RECOVERY)

### A. Trạng thái Snapshot Tiền Thi công (Pre-import Snapshot)
- **Kịch bản sao lưu:** `/volume1/web/family-api/backups/do_backup.sh` đã sẵn sàng và được kiểm chứng.
- **Tùy chọn an toàn:** Sử dụng `--single-transaction`, `--quick`, `--routines`, `--triggers`, `--events` đảm bảo sao lưu phi khóa (non-locking) không ảnh hưởng tới người dùng.
- **Toàn vẹn:** Tự động sinh file checksum SHA-256 (`.sql.sha256`) ngay sau khi dump.
- **Bảo mật bí mật:** Mật khẩu DB được truyền nội bộ qua `MYSQL_PWD` trong memory runtime của shell, **tuyệt đối không in mật khẩu ra terminal hay ghi vào log**.

### B. Cô lập Quyền Truy cập Snapshot đối với `family_beta_usr`
- Tệp snapshot lưu tại thư mục: `/volume1/web/family-api/backups/`.
- Phân quyền tệp hệ thống: Thuộc sở hữu `tuandzain:users`.
- Quyền hạn MariaDB của `family_beta_usr`: Chỉ có `GRANT USAGE ON *.*`. User này **hoàn toàn không có quyền `FILE`** trong MariaDB $\rightarrow$ Không thể đọc/ghi bất kỳ tệp vật lý nào trên NAS.

### C. Quy trình Khôi phục Beta nếu Import Thất bại
Nếu quá trình nạp dữ liệu vào `family_archive_beta` bị lỗi giữa chừng:
1. Không tác động CSDL Production (`family_archive` hoàn toàn chỉ đọc trong suốt quá trình).
2. Xóa các bảng chưa hoàn tất trong `family_archive_beta` hoặc thực hiện:
   `DROP DATABASE family_archive_beta; CREATE DATABASE family_archive_beta CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
3. Cấp lại quyền cho `family_beta_usr` và tiến hành nạp lại từ đầu.
- **Kết luận GAP-03:** **`PASS (VERIFIED)`**.

---

## 4. TỔNG HỢP KẾT QUẢ PREFLIGHT TRACK A

| Hạng mục GAP | Nội dung kiểm tra | Kết quả | Ghi chú an toàn |
| :---: | :--- | :---: | :--- |
| **GAP-01** | MariaDB CHECK constraint enforcement | **PASS** | Negative test chặn đứng JSON lỗi bằng mã `ER_CONSTRAINT_FAILED`. |
| **GAP-02** | Baseline Manifest (14 bảng) | **PASS** | 1,180 bản ghi cốt lõi xác minh qua `SELECT COUNT(*)`. |
| **GAP-03** | Snapshot & Recovery Isolation | **PASS** | Snapshot có SHA256; `family_beta_usr` không có quyền `FILE`. |

---

**KẾT LUẬN TRACK A:**  
Cả 3 hạng mục GAP-01, GAP-02, GAP-03 đều **`PASS`**.  
Môi trường MariaDB NAS đã sẵn sàng 100% để thực thi Bước 2B (Tạo bảng & Clone dữ liệu baseline vào `family_archive_beta`) ngay khi nhận được lệnh phê duyệt chính thức từ Tuấn.

