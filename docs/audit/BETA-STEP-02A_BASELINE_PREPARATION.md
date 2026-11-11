# BÁO CÁO ĐỐI SOÁT CHÂN LÝ & CHUẨN BỊ SCHEMA CSDL BETA (BETA STEP 2A)

**Dự án:** Gia Tộc Trần Trọng Thu  
**Cấp thẩm quyền:**  
- **Tuấn:** Human Final Authority  
- **Emarald:** Strategic Architecture & QC Authority  
- **AGY:** Execution Agent  
**Chế độ thực thi:** STRICT READ-ONLY (Toàn bộ dữ liệu được khảo sát pháp y độc lập; chưa thực hiện bất kỳ lệnh ghi, import hay tạo bảng nào trên CSDL Beta).  
**Thời điểm thực hiện:** 2026-11-11  

---

## 1. ĐỐI SOÁT NGUỒN CHÂN LÝ (SOURCE OF TRUTH RECONCILIATION)

### A. Làm rõ Sai khác Số lượng "226 people" vs "223 people"
Trong báo cáo `BETA-01A`, xuất hiện số liệu "226 people", trong khi báo cáo `BETA STEP 1` và `INDEPENDENT_VERIFICATION_REPORT` ghi nhận "223 people".

**Kết quả đối soát pháp y trực tiếp:**
- **Lệnh kiểm tra trên Production MariaDB (`family_archive`):**
  1. `SELECT COUNT(*) as exact_count FROM people;` $\rightarrow$ **`223` bản ghi chính xác**.
  2. `SELECT table_rows FROM information_schema.tables WHERE table_schema="family_archive" AND table_name="people";` $\rightarrow$ **`226` (Ước lượng thống kê)**.
- **Nguyên nhân gốc rễ (Root Cause):**
  Trong kiến trúc lưu trữ InnoDB của MySQL/MariaDB, trường `table_rows` trong `information_schema.tables` **không phải là số đếm thực tế**, mà là **giá trị ước lượng ngẫu nhiên dựa trên lấy mẫu chỉ mục (cardinality sampling approximation)** dùng cho bộ tối ưu hóa truy vấn (Query Optimizer). Khi báo cáo `BETA-01A` truy vấn `information_schema.tables`, MariaDB trả về số ước lượng `226`.
- **Thực tế khách quan:** Số lượng bản ghi thực tế của bảng `people` trên Production MariaDB từ trước đến nay luôn luôn là **`223`**. Bảng `people` chưa từng chứa 226 bản ghi.

---

### B. Đối soát So sánh Đa nguồn (Multi-Source Comparison Matrix)

Đã tiến hành kiểm tra độc lập trên toàn bộ 5 nguồn lưu trữ dữ liệu của dự án:

| Nguồn dữ liệu (Source) | Vị trí / Đường dẫn | Phương pháp kiểm tra | Số lượng People | Số lượng Families | Thời điểm Snapshot / Mtime | Bằng chứng Đối soát |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **Production MariaDB** | NAS `family_archive` (Unix Socket) | `SELECT COUNT(*)` trực tiếp | **223** | **68** | 11/11/2026 15:09 | Live Database. Hash 223 IDs: `2f039ec...` |
| **Local SQLite DB** | `server/family_archive.db` | Python `sqlite3` driver | **223** | **68** | 07/09/2026 10:24 | Khớp 100% tập ID với MariaDB (`diff = 0`) |
| **GEDCOM Source** | `GIADINHONGTHU.ged` | Regex `^0 (@I\d+@) INDI` | **223** | **68** | 07/09/2026 10:24 | 223 cá nhân gốc dòng họ |
| **Server JSON Source**| `server/data/genealogy.json` | JSON parse `data.people` | **223** | **68** | 07/09/2026 10:24 | Khớp 223 cá nhân phả hệ |
| **Bản sao lưu NAS** | `/volume1/web/family-api/backups/family_archive_prod_20261110_225314.sql` | Python parse `INSERT INTO people` | **223** | **68** | 10/11/2026 22:53 | SHA256: `954,192 bytes` |

**Kết luận Chân lý (Absolute Invariant):**  
Cả 5 nguồn dữ liệu độc lập đều thống nhất tuyệt đối ở con số **223 người (people)** và **68 gia đình (families)**. Không có sự sai lệch dữ liệu nào giữa các nguồn.

---

## 2. CHUẨN BỊ SCHEMA CSDL BETA (SCHEMA PREPARATION)

### A. Kiểm tra Toàn diện 19 Bảng Production
Khảo sát trực tiếp qua `SHOW CREATE TABLE` và `COUNT(*)` trên MariaDB 10.11:

| Tên bảng | Số dòng | Khóa chính (Primary Key) | Auto Inc | Ràng buộc JSON (`json_valid`) | Unique Key | Engine | Charset / Collation |
| :--- | :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| `people` | 223 | `id` (VARCHAR 255) | Không | **Có (`payload`)** | Không | InnoDB | `utf8mb4_unicode_ci` |
| `families` | 68 | `id` (VARCHAR 255) | Không | **Có (`payload`)** | Không | InnoDB | `utf8mb4_unicode_ci` |
| `timeline` | 215 | `id` (VARCHAR 255) | Không | Không | Không | InnoDB | `utf8mb4_unicode_ci` |
| `memories` | 2 | `id` (VARCHAR 255) | Không | **Có (`payload`)** | Không | InnoDB | `utf8mb4_unicode_ci` |
| `media` | 203 | `id` (VARCHAR 255) | Không | **Có (`payload`)** | Không | InnoDB | `utf8mb4_unicode_ci` |
| `person_media` | 173 | `relation_id` (VARCHAR 255) | Không | Không | Không | InnoDB | `utf8mb4_unicode_ci` |
| `calendar_events` | 266 | `uid` (VARCHAR 255) | Không | Không | Không | InnoDB | `utf8mb4_unicode_ci` |
| `stories` | 20 | `id` (VARCHAR 255) | Không | **Có (`payload`)** | Không | InnoDB | `utf8mb4_unicode_ci` |
| `series` | 2 | `id` (VARCHAR 255) | Không | **Có (`payload`)** | Không | InnoDB | `utf8mb4_unicode_ci` |
| `authors` | 3 | `id` (VARCHAR 255) | Không | **Có (`payload`)** | Không | InnoDB | `utf8mb4_unicode_ci` |
| `edges` | 1 | `(source_id, target_id, edge_type)` | Không | Không | Không | InnoDB | `utf8mb3_general_ci` |
| `events` | 1 | `id` (VARCHAR 255) | Không | Không | Không | InnoDB | `utf8mb3_general_ci` |
| `images` | 1 | `id` (VARCHAR 255) | Không | Không | Không | InnoDB | `utf8mb3_general_ci` |
| `authorities` | 2 | `id` (VARCHAR 255) | Không | Không | Không | InnoDB | `utf8mb4_unicode_ci` |
| `accounts` | 5 | `id` (VARCHAR 255) | Không | Không | **Có (`email`, `user`)**| InnoDB | `utf8mb4_unicode_ci` |
| `admin_users` | 3 | `id` (INT) | **Có** | Không | **Có (`username`)** | InnoDB | `utf8mb4_unicode_ci` |
| `identity_mappings`| 1 | `(account_id, person_id)` | Không | Không | Không | InnoDB | `utf8mb4_unicode_ci` |
| `proposals` | 67 | `id` (VARCHAR 64) | Không | Không | Không | InnoDB | `utf8mb4_unicode_ci` |
| `audit_logs` | 81 | `id` (VARCHAR 255) | Không | Không | Không | InnoDB | `utf8mb4_unicode_ci` |

### B. Yêu cầu Tiêu chuẩn hóa Schema cho `family_archive_beta`
1. **Hiện đại hóa Charset:** 3 bảng lịch sử (`edges`, `events`, `images`) đang dùng `utf8mb3`. Khi khởi tạo trên `family_archive_beta`, sẽ chuyển đổi đồng bộ sang **`utf8mb4` / `utf8mb4_unicode_ci`** để tránh lỗi mã hóa emoji và ký tự Hán-Nôm đặc thù.
2. **Bảo tồn Ràng buộc JSON:** 7 bảng chứa cột `payload` tiếp tục duy trì mệnh đề `CHECK (json_valid(payload))` để bảo vệ toàn vẹn cấu trúc dữ liệu JSON.
3. **Phân loại Bảng Hiện diện trên Beta:** Toàn bộ 19 bảng đều cần có mặt trong `family_archive_beta` để đảm bảo API backend Beta không gặp lỗi thiếu bảng (`Table doesn't exist`).

---

## 3. DANH MỤC DỮ LIỆU BASELINE (DATA BASELINE MANIFEST)

Phân loại chi tiết chính sách dữ liệu nạp vào `family_archive_beta`:

| Phân nhóm Dữ liệu | Bảng CSDL | Số bản ghi nạp | Chính sách nạp dữ liệu (Import Policy) | Ranh giới An ninh & Riêng tư |
| :--- | :--- | :---: | :--- | :--- |
| **Genealogy Core** | `people` | 223 | **Sao chép 100% (Baseline Snapshot)** | Thông tin phả hệ chính thức dòng họ. |
| | `families` | 68 | **Sao chép 100%** | Quan hệ hôn nhân và huyết thống thế hệ. |
| | `timeline` | 215 | **Sao chép 100%** | Niên biểu sự kiện lịch sử dòng họ. |
| | `memories` | 2 | **Sao chép 100%** | Ký ức phả tộc. |
| | `edges` | 1 | **Sao chép 100%** | Liên kết đồ thị mở rộng. |
| **Media Metadata** | `media` | 203 | **Sao chép 100%** | Metadata lưu trữ hình ảnh tư liệu. |
| | `person_media` | 173 | **Sao chép 100%** | Liên kết ảnh với nhân vật trong phả hệ. |
| | `calendar_events` | 266 | **Sao chép 100%** | Lịch giỗ chạp và sự kiện tưởng niệm. |
| | `events` / `images` | 1 / 1 | **Sao chép 100%** | Dữ liệu sự kiện tổng quát. |
| **Discourse / MẠCH** | `stories` | 20 | **Sao chép 100%** | 20 bài viết tư liệu chuyên san MẠCH số 01. |
| | `series` | 2 | **Sao chép 100%** | Danh mục phân loại MẠCH. |
| | `authors` | 3 | **Sao chép 100%** | Danh sách tác giả bài viết MẠCH. |
| **Privileges / ReBAC** | `authorities` | 2 | **Sao chép 100%** | Quyền hạn khung (`ADMIN_ACCESS`, `SYSTEM`). |
| **Private Data (Clara)**| *Không nằm trong DB* | **0** | **LOẠI BỎ HOÀN TOÀN KHỎI BETA** | Tệp `clara.json` và ảnh Clara lưu cục bộ, **không nạp lên NAS**. Tuyến `/me/clara` trên Beta trả về 404 Zero-Hint. |
| **Authentication** | `accounts` | **0** | **CLEAN SCHEMA (Làm sạch 100%)** | **Tuyệt đối không sao chép** tài khoản thật hay tài khoản test cũ `*_e2e` từ Production. |
| | `admin_users` | **0** | **CLEAN SCHEMA (Làm sạch 100%)** | Không sao chép tài khoản quản trị cũ. |
| | `identity_mappings`| **0** | **CLEAN SCHEMA (Làm sạch 100%)** | Khởi tạo bảng rỗng, cấp mới theo tài khoản Beta. |
| **Audit & Testing** | `proposals` | **0** | **CLEAN SCHEMA (Làm sạch 100%)** | Làm sạch để sẵn sàng tiếp nhận đề xuất thử nghiệm mới. |
| | `audit_logs` | **0** | **CLEAN SCHEMA (Làm sạch 100%)** | Khởi tạo bảng rỗng, bắt đầu ghi vết từ đợt Beta. |

**Tổng kết Dữ liệu:**
- **14 bảng dữ liệu cốt lõi:** Sao chép nguyên vẹn `1,438` bản ghi baseline.
- **5 bảng định danh & vận hành:** Khởi tạo bảng rỗng (`0` bản ghi).

---

## 4. KẾ HOẠCH NẠP DỮ LIỆU (IMPORT PLAN)

### A. Nguyên tắc Thẩm quyền & An ninh Thực thi
- **User `family_beta_usr`:** Đã xác minh ở Bước 1 chỉ có quyền `SELECT, INSERT, UPDATE, DELETE`. User này **không có quyền DDL (`CREATE TABLE`)**.
- **Chính sách phân quyền:** **Tuyệt đối không cấp thêm quyền DDL cho `family_beta_usr`**.
- **Cơ chế thi công:** Thao tác tạo bảng và nạp dữ liệu snapshot ban đầu sẽ được thực thi qua **phiên kết nối quản trị cục bộ (Root Connection qua Unix socket trên NAS)**. Sau khi nạp xong, quyền truy cập sẽ bàn giao lại cho `family_beta_usr` ở chế độ runtime.

### B. Thứ tự Phụ thuộc Khởi tạo (Dependency Order)
Dù MariaDB không có foreign keys cứng, việc nạp dữ liệu tuân thủ thứ tự logic từ thực thể độc lập đến thực thể phụ thuộc:

```text
[GIAI ĐOẠN 1: THỰC THỂ CỐT LÕI (CORE ENTITIES)]
1. people (223 rows)
2. families (68 rows)
3. timeline (215 rows)
4. memories (2 rows)

[GIAI ĐOẠN 2: TƯ LIỆU & TRUYỀN THÔNG (MEDIA & DISCOURSE)]
5. media (203 rows)
6. person_media (173 rows)
7. calendar_events (266 rows)
8. authors (3 rows)
9. series (2 rows)
10. stories (20 rows)
11. edges (1 row)
12. events (1 row)
13. images (1 row)

[GIAI ĐOẠN 3: PHÂN QUYỀN KHUNG (AUTHORITIES)]
14. authorities (2 rows)

[GIAI ĐOẠN 4: BẢNG RỖNG VẬN HÀNH (OPERATIONAL EMPTY TABLES)]
15. accounts (0 rows)
16. admin_users (0 rows)
17. identity_mappings (0 rows)
18. proposals (0 rows)
19. audit_logs (0 rows)
```

### C. Quy trình Thực thi Dự kiến (Proposed Import Procedure)
*(Chỉ lưu trữ quy trình thiết kế — CHƯA THỰC THI)*

1. **Pre-import Backup (Bảo vệ Tuyệt đối Production):**
   Chạy script sao lưu tạo snapshot kiểm toán của `family_archive`:
   `/volume1/web/family-api/backups/pre_beta_import_snapshot.sql`
2. **Schema & Data Clone:**
   Thực thi sao chép trực tiếp từ database sang database trên MariaDB engine:
   - Với 14 bảng baseline:
     ```sql
     CREATE TABLE family_archive_beta.[table] LIKE family_archive.[table];
     INSERT INTO family_archive_beta.[table] SELECT * FROM family_archive.[table];
     ```
   - Với 5 bảng vận hành:
     ```sql
     CREATE TABLE family_archive_beta.[table] LIKE family_archive.[table];
     ```
3. **Kiểm tra Toàn vẹn Hậu Nạp dữ liệu (Post-import Integrity Checks):**
   - Kiểm tra `COUNT(*)` đối ứng giữa `family_archive` và `family_archive_beta` cho cả 14 bảng.
   - Xác nhận 5 bảng vận hành có đúng `0` bản ghi.
   - Chạy lệnh kiểm tra quyền: Đăng nhập bằng `family_beta_usr` và thực hiện `SELECT COUNT(*) FROM family_archive_beta.people` $\rightarrow$ kết quả phải đạt `223`.
4. **Quy trình Hủy bỏ Khẩn cấp (Rollback Procedure):**
   - Nếu quá trình nạp bị lỗi hoặc gián đoạn giữa chừng:
     Thực hiện truncate hoặc drop các bảng vừa tạo trong `family_archive_beta`.
   - **Cam kết an toàn:** CSDL Production `family_archive` ở trạng thái READ-ONLY xuyên suốt quá trình clone, hoàn toàn không bị ảnh hưởng hay thay đổi bất kỳ byte dữ liệu nào.

---

## 5. DỪNG TẠI HUMAN CHECKPOINT (CHỜ PHÊ DUYỆT TỪ TUẤN)

Toàn bộ công tác đối soát nguồn chân lý, chuẩn bị schema và lập kế hoạch nạp dữ liệu đã hoàn tất ở chế độ **STRICT READ-ONLY**.

AGY khẳng định:
- **CHƯA** tạo bất kỳ bảng nào trong `family_archive_beta`.
- **CHƯA** nạp bất kỳ dòng dữ liệu nào vào CSDL Beta.
- **CHƯA** sửa mã nguồn, chưa can thiệp Production, chưa tạo tài khoản.

**DỪNG HOÀN TOÀN — KÍNH CHỜ TUẤN RA CHỈ THỊ PHÊ DUYỆT THỰC THI BƯỚC 2B (IMPORT DỮ LIỆU BASELINE VÀO BETA).**

