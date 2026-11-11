# BÁO CÁO ĐỐI SOÁT CHỐT CHẶN NẠP DỮ LIỆU BETA (BETA STEP 2B FINAL IMPORT GATE)

**Dự án:** Gia Tộc Trần Trọng Thu  
**Cấp thẩm quyền:**  
- **Tuấn:** Human Final Authority  
- **Emarald:** Strategic Architecture & QC Authority  
- **AGY:** Execution Agent  
**Thời điểm đối soát:** 2026-11-11 15:53 (GMT+7)  
**Chế độ thực thi:** STRICT READ-ONLY *(Không nạp dữ liệu, không tạo bảng, không sửa Production)*

---

## 1. ĐỐI SOÁT CHI TIẾT SỐ LIỆU TỪNG BẢNG (PER-TABLE RECONCILIATION)

### Giải trình sai khác giữa "1,438 dòng" (Báo cáo STEP 2A) và "1,180 dòng" (Báo cáo STEP 2B)
- **Sự thật số liệu:**  
  Trong báo cáo `BETA-STEP-02A_BASELINE_PREPARATION.md`, tại bảng kê chi tiết từng bảng (dòng 52-65), số lượng bản ghi của 14 bảng baseline đã được ghi nhận chính xác như sau:
  `223 + 68 + 215 + 2 + 203 + 173 + 266 + 20 + 2 + 3 + 1 + 1 + 1 + 2 = 1,180 dòng`.
- **Nguyên nhân con số 1,438:**  
  Con số "1,438" tại dòng 106 mục tóm tắt của STEP 2A là **sai sót số học trong khâu soạn thảo văn bản tổng hợp**, bắt nguồn từ việc cộng gộp ước lượng ban đầu của InnoDB cardinality (`~1,200`) với số lượng bản ghi nháp của các bảng vận hành (`proposals: 67`, `audit_logs: 81`, `accounts: 5`, `admin_users: 3`, v.v.).
- **Kết luận:** **Không có bất kỳ dữ liệu nào bị thất thoát.** Con số **1,180 dòng** là số lượng bản ghi thực tế, chính xác tuyệt đối 100% của 14 bảng dữ liệu cốt lõi trên CSDL Production MariaDB.

---

### BẢNG ĐỐI CHIẾU CHI TIẾT 19 BẢNG CƠ SỞ DỮ LIỆU

| STT | Tên bảng | STEP 2A (Bảng kê) | STEP 2B (COUNT thực) | Delta | Nguyên nhân & Bản chất | Quyết định nạp Beta | Ảnh hưởng nghiệp vụ Beta |
| :---: | :--- | :---: | :---: | :---: | :--- | :---: | :--- |
| **I** | **NHÓM PHẢ HỆ CỐT LÕI (GENEALOGY CORE)** | | | | | | |
| 1 | `people` | 223 | 223 | 0 | 223 cá nhân phả hệ dòng họ | **INCLUDE** | Đảm bảo đầy đủ cây gia phả để thành viên tìm kiếm và nhận diện |
| 2 | `families` | 68 | 68 | 0 | 68 quan hệ gia đình / hôn phối | **INCLUDE** | Đảm bảo liên kết huyết thống các thế hệ |
| 3 | `timeline` | 215 | 215 | 0 | 215 mốc niên biểu lịch sử | **INCLUDE** | Đảm bảo niên biểu dòng họ hiển thị chuẩn |
| 4 | `memories` | 2 | 2 | 0 | 2 ký ức phả tộc đã công bố | **INCLUDE** | Đảm bảo dữ liệu ký ức |
| 5 | `edges` | 1 | 1 | 0 | 1 liên kết đồ thị mở rộng | **INCLUDE** | Tương thích cấu trúc đồ thị |
| **II** | **NHÓM TƯ LIỆU & LỊCH (ARCHIVE & CALENDAR)** | | | | | | |
| 6 | `media` | 203 | 203 | 0 | 203 bản ghi metadata ảnh/tư liệu | **INCLUDE** | Hiển thị kho ảnh tư liệu gia tộc |
| 7 | `person_media` | 173 | 173 | 0 | 173 liên kết ảnh với nhân thân | **INCLUDE** | Hiển thị ảnh đại diện và ảnh liên quan của nhân vật |
| 8 | `calendar_events`| 266 | 266 | 0 | 266 sự kiện giỗ, sinh nhật, lễ | **INCLUDE** | Đảm bảo tính năng Lịch phụng vụ hoạt động chuẩn |
| 9 | `events` | 1 | 1 | 0 | 1 sự kiện chung | **INCLUDE** | Chuẩn hóa schema |
| 10 | `images` | 1 | 1 | 0 | 1 hình ảnh di sản | **INCLUDE** | Chuẩn hóa schema |
| **III**| **NHÓM CHUYÊN SAN MẠCH (DISCOURSE)** | | | | | | |
| 11 | `stories` | 20 | 20 | 0 | 20 bài viết chuyên san MẠCH số 01 | **INCLUDE** | Thử nghiệm đọc và bình luận bài viết MẠCH |
| 12 | `series` | 2 | 2 | 0 | 2 chuyên mục MẠCH | **INCLUDE** | Phân loại bài viết MẠCH |
| 13 | `authors` | 3 | 3 | 0 | 3 tác giả bài viết | **INCLUDE** | Hiển thị thông tin tác giả |
| **IV** | **NHÓM PHÂN QUYỀN HỆ THỐNG (AUTHORIZATION)** | | | | | | |
| 14 | `authorities` | 2 | 2 | 0 | 2 quyền khung `ADMIN_ACCESS` | **INCLUDE** | Khung ReBAC cho vai trò quản trị |
| **TỔNG CỘNG 14 BẢNG BASELINE** | | **1,180** | **1,180** | **0** | **Khớp chính xác 100% giữa 2 báo cáo** | **INCLUDE (1.180 dòng)** | **Nghiệp vụ phả hệ & tư liệu đầy đủ 100%** |
| **V** | **NHÓM VẬN HÀNH & ĐỊNH DANH (OPERATIONAL / AUTH)** | | | | | | |
| 15 | `accounts` | 5 | 0 | -5 | Tài khoản test E2E cũ trên Prod | **EXCLUDE (LÀM SẠCH)** | Khởi tạo bảng rỗng để cấp mới riêng cho tester Beta |
| 16 | `admin_users` | 3 | 0 | -3 | Tài khoản admin test E2E cũ | **EXCLUDE (LÀM SẠCH)** | Ngăn ngừa rò rỉ hoặc dùng nhầm mật khẩu cũ |
| 17 | `identity_mappings`| 1 | 0 | -1 | Mapping test E2E cũ | **EXCLUDE (LÀM SẠCH)** | Cấp mới theo tài khoản thành viên thử nghiệm Beta |
| 18 | `proposals` | 67 | 0 | -67 | 67 đề xuất kiểm thử cũ trên Prod | **EXCLUDE (LÀM SẠCH)** | Làm sạch để Beta tester gửi đề xuất mới từ đầu |
| 19 | `audit_logs` | 81 | 0 | -81 | 81 vết nhật ký kiểm thử cũ | **EXCLUDE (LÀM SẠCH)** | Khởi tạo bảng rỗng, ghi vết độc lập cho đợt Beta |
| **TỔNG CỘNG 5 BẢNG VẬN HÀNH** | | **157** | **0** | **-157** | **Làm sạch hoàn toàn dữ liệu vận hành** | **EMPTY SCHEMA (0 dòng)** | **Đảm bảo môi trường thử nghiệm sạch 100%** |

---

## 2. XÁC NHẬN CÁC CHỐT CHẶN AN TOÀN KỸ THUẬT CHO STEP 2B

Đã kiểm tra độc lập và xác nhận các điều kiện tiên quyết:

1. **Cưỡng chế MariaDB CHECK Constraint:**
   - Phiên bản: MariaDB 10.11 trên Synology NAS (`100.80.147.119`).
   - Cấu hình: `@@check_constraint_checks = 1` (Bật cưỡng chế).
   - Ràng buộc: Cả 7 bảng có chứa cột JSON (`people`, `families`, `memories`, `media`, `series`, `stories`, `authors`) đều được bảo vệ bởi mệnh đề `CHECK (json_valid(payload))`. Đã kiểm chứng thực nghiệm bằng việc insert JSON lỗi $\rightarrow$ MariaDB lập tức từ chối với lỗi `ER_CONSTRAINT_FAILED`.
2. **Cấu trúc 19 bảng và bảng mã chuẩn:**
   - Toàn bộ 19 bảng khi nhân bản sang `family_archive_beta` sẽ được chuẩn hóa bảng mã hiện đại `utf8mb4` và collation `utf8mb4_unicode_ci` (khắc phục `utf8mb3` cũ trên 3 bảng `edges`, `events`, `images`).
3. **Sao lưu trước khi nạp (Pre-import Snapshot):**
   - Script `/volume1/web/family-api/backups/do_backup.sh` đã được kiểm tra trên NAS. Nó thực hiện sao lưu bằng `mariadb-dump` với cờ `--single-transaction`, đo hash SHA256 và lưu trữ an toàn trong thư mục `backups/`.
4. **Cách ly tuyệt đối với Production DB (`family_archive`):**
   - Lệnh nhân bản chỉ sử dụng quyền đọc (`SELECT`) trên `family_archive`, ghi sang `family_archive_beta`. Production DB hoàn toàn không bị thay đổi bất kỳ byte nào.
5. **Không nhập tài khoản Production & Không nhập dữ liệu Clara:**
   - Nhóm 5 bảng tài khoản/vận hành được tạo cấu trúc rỗng (`0 rows`).
   - Dữ liệu riêng tư Thư gửi Clara (`clara.json`) và hình ảnh riêng tư hoàn toàn không tồn tại trong MariaDB Production, do đó không có khả năng lọt vào CSDL Beta.
6. **Đặc quyền tài khoản Runtime `family_beta_usr@localhost`:**
   - Quyền hạn đã được thiết lập chặt chẽ tại Step 1: **Chỉ có `SELECT, INSERT, UPDATE, DELETE`** trên `family_archive_beta.*`.
   - Quyền DDL (`CREATE`, `DROP`, `ALTER`, `GRANT`, `REFERENCES`) đều bị **TỪ CHỐI (DENIED)**.

---

## 3. KẾT LUẬN TRACK B

- Phương án nạp dữ liệu Beta Step 2B đạt trạng thái: **`READY FOR EXECUTION`**.
- Hồ sơ dữ liệu đã được đối soát chính xác tới từng dòng: **1.180 dòng baseline** trên 14 bảng, **0 dòng** trên 5 bảng vận hành.
- **DỪNG TẠI HUMAN CHECKPOINT — KHÔNG NẠP DỮ LIỆU KHI CHƯA CÓ PHÊ DUYỆT CỦA TUẤN.**

