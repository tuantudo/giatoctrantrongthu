# BẢNG ĐỐI CHIẾU THAY ĐỔI & THAY THẾ (CHANGELOG & SUPERSESSION MAP) v2.0
## CẬP NHẬT MASTER COMPLETION PLAN v2.0 & FRONTEND COMPLETION PLAN v2.0

- **Dự án:** CÂY GIA PHẢ / GIATỘC TRẦN TRỌNG THU
- **Thời điểm lập:** `02/11/2026 11:10 (GMT+7)`
- **Đơn vị thực hiện:** AGY (Execution Coordinator & Primary Agent)
- **Thẩm quyền phê duyệt:** Tuấn (Human Final Authority)
- **Căn cứ chỉ đạo:** `AGY — PRODUCT GOVERNANCE & COMPLETION PLAN REVISION (2026-11-02)`

---

## 1. NGUYÊN TẮC THAY ĐỔI TRỌNG YẾU (CORE PARADIGM SHIFT)

| Tiêu Chí | Kế Hoạch Cũ (v1.0) | Kế Hoạch Tái Cấu Trúc Canonical (v2.0) | Căn Cứ & Lý Do Thực Tế |
|---|---|---|---|
| **Điểm Xuất Phát (Baseline)** | Bắt đầu từ kiểm toán kho mã nguồn (Repository Audit) và rà soát an ninh mã backend. | Bắt đầu trực tiếp từ **Website thực tế đang phát hành (`https://giatoctrantrongthu.com`)**. | Website là hiện thân cụ thể của Product Intent của Tuấn; dự án không bắt đầu từ con số 0. |
| **Bản Chất 4 Hash Routes** | Từng bị mô tả nhầm là các trang nội dung công khai hoặc "Public Preview". | **ĐÍNH CHÍNH QUAN TRỌNG:** 4 hash routes (`#/mach`, `#/gia-pha`, `#/lich`, `#/tim-kiem`) là **CÁC CỬA NGÕ / ĐIỂM MỜI XÁC THỰC TƯ CÁCH THÀNH VIÊN**. Người ngoài chỉ thấy thông điệp mời xác minh; tuyệt đối không hiển thị nội dung nội bộ. | Chỉ có Trang nhất (`#/`) là giao diện xã hội công khai. Không có nội dung công khai bên trong các không gian thành viên. |
| **Vai Trò Vibecode Lab** | Từng bị mô tả như môi trường phụ trợ có thể tùy ý bỏ đi hoặc coi là sản phẩm song song. | **ĐÍNH CHÍNH VAI TRÒ:** Vibecode Lab là **Môi trường UI/UX Review & Design Approval**. Local Mirror tương đương với Online để Tuấn trực tiếp kiểm tra và điều chỉnh. | Tuân thủ quy trình: Production -> Local Mirror -> Tuấn chỉnh UI/UX -> Review & Approval -> Human Gate -> Promotion. |
| **Phân Biệt Các Lớp Quyền** | Dễ nhầm lẫn giữa tư cách thành viên và quyền truy cập toàn bộ tài liệu. | Phân định 4 lớp: (1) Xác minh thành viên dòng họ; (2) Xác thực đăng nhập; (3) Phân quyền nội dung & nhánh; (4) Khôi phục tài khoản. | Biết một người thuộc dòng họ KHÔNG đồng nghĩa người đó có quyền xem mọi dữ liệu đời tư gia đình. |
| **Đảo Thứ Tự Phụ Thuộc** | Nhầm lẫn giữa hoàn thiện UI với hoàn thành chức năng dữ liệu thật. | Phân tầng rõ ràng: Hoàn thiện UI với mockup/snapshot -> Hoàn thiện Logic & Gateway -> Nối API -> Tích hợp và kiểm chứng dữ liệu thật. | Không tuyên bố chức năng phụ thuộc dữ liệu thật là hoàn thành khi API/data chưa sẵn sàng. |
| **Hệ Thống Chốt Chặn (Gates)** | GATE-01 gộp chung phê duyệt kế hoạch và diff an ninh. | **Tách thành GATE-01A (Phê duyệt Kế hoạch) và GATE-01B (Phê duyệt Từng Diff An ninh cụ thể).** | Tuân thủ chặt chẽ quyền lực Tuấn: duyệt kế hoạch không đồng nghĩa quyền sửa code tự do. |

---

## 2. BẰNG CHỨNG ĐỐI SOÁT & PHÂN LOẠI CSDL VẬT LÝ (BACKUP RECONCILIATION)

Đối soát lại hồ sơ 3 bản sao lưu CSDL theo đúng bản chất kỹ thuật và bằng chứng thực tế:

| Tệp Sao Lưu | Đường Dẫn Lưu Trữ | Kích Thước | Phương Pháp Tạo Lập | Checksum SHA-256 | Trạng Thái Toàn Vẹn | Trạng Thái Restore Test |
|---|---|---|---|---|:---:|:---:|
| **1. Bản sao byte-for-byte nguyên trạng** | `archive/database_backups/family_archive_raw_physical_20261102.db` | `413,696 bytes` | Lệnh copy vật lý tầng filesystem (`cp`) | `b3350d2e6b1aed795664d5c4fe8f688d5171c289a2ca183f247a82781bc2a30e` *(Khớp 100% file nguồn)* | `ok` (`PRAGMA integrity_check`) | **CHƯA THỰC HIỆN** `[PENDING RESTORE TEST]` |
| **2. Bản sao lưu trực tuyến SQLite** | `archive/database_backups/family_archive_20261102_101330.db` | `413,696 bytes` | SQLite Online Backup API (`.backup`) | `31e3088d37e516250179c9aebb6e7f8d82f7630c4e3293b202a0428ad7f0a647` | `ok` (`PRAGMA integrity_check`) | **CHƯA THỰC HIỆN** `[PENDING RESTORE TEST]` |
| **3. Bản sao lưu quy chuẩn thao tác** | `server/family_archive.db.bak` | `413,696 bytes` | Bản sao phục vụ local migration | `31e3088d37e516250179c9aebb6e7f8d82f7630c4e3293b202a0428ad7f0a647` | `ok` (`PRAGMA integrity_check`) | **CHƯA THỰC HIỆN** `[PENDING RESTORE TEST]` |

> **Ghi chú trung thực nhận thức:** Cả 3 bản backup đều đã vượt qua kiểm tra toàn vẹn cấu trúc SQLite (`integrity_check = ok`), nhưng **chưa thực hiện kiểm thử phục hồi thực tế (Restore Test)**. Do đó, tài liệu ghi nhận chính xác trạng thái là `[PENDING RESTORE TEST]`, tuyệt đối không tự tuyên bố là đã test restore.

---

## 3. ĐỐI CHIẾU ĐẦY ĐỦ 8 LỖ HỔNG BẢO MẬT (CF-01 ĐẾN CF-08 VS BACKLOG TASKS)

Bảng ánh xạ chính xác và đầy đủ giữa các phát hiện an ninh đã xác minh với danh mục task thực thi:

| Mã Finding | Mô Tả Lỗ Hổng Thực Tế | Mức Độ | Task Xử Lý Trong Master Plan v2.0 | Biện Pháp Kỹ Thuật Đã Chuẩn Bị | Trạng Thái |
|---|---|:---:|---|---|:---:|
| **CF-01** | Static Root rò rỉ toàn bộ repo (`.env`, `package.json`, `.ged`) | P0 | `TASK-P3-04` (TASK-01) | Thay thế static middleware bằng danh sách trắng whitelist `/assets`, `/src`, `/data`. | Đã chuẩn bị diff, chờ **GATE-01B** |
| **CF-02** | Malformed URI DoS crash máy chủ (`decodeURI` unhandled) | P1 | `TASK-P3-04` (TASK-02) | Bọc `try/catch decodeURI`, trả về HTTP 400 an toàn, không sập server. | Đã chuẩn bị diff, chờ **GATE-01B** |
| **CF-03** | 5 Write Endpoints không có xác thực (Guest có thể POST/PUT) | P0 | `TASK-P3-04` (TASK-03) | Bổ sung middleware `requireAuth` chặn người dùng ẩn danh với mã 401/403. | Đã chuẩn bị diff, chờ **GATE-01B** |
| **CF-04** | Lộ PII trong `/api/genealogy.json` (Số điện thoại, CCCD, thông tin người sống) | P0 | `TASK-P4-02` (TASK-04) | Thiết lập bộ lọc dữ liệu (Data Sanitization & Dynamic Masking) theo quyền ReBAC. | Chờ tích hợp Phase 4 |
| **CF-05** | Credential nhạy cảm trong repo (`archive/revert_pass.js`, token hardcoded) | P0 | `TASK-P3-04` (TASK-05) | Cách ly công cụ reset pass vào kho lưu trữ, xóa fallback webhook URL trong CI. | Đã chuẩn bị diff, chờ **GATE-01B** |
| **CF-06** | Thiếu quy tắc `.gitignore` bảo vệ tệp nhạy cảm (`.ged`, `.db`, `.bak`, `private/`) | P1 | `TASK-P3-04` (TASK-06) | Cập nhật `.gitignore` đưa toàn bộ các tệp CSDL và private vào vùng cấm commit. | Đã cập nhật file `.gitignore` |
| **CF-07** | Thiếu cấu hình SPA Rewrites & Edge Protection trên Vercel | P1 | `TASK-P4-01` (TASK-06B) | Cấu hình `vercel.json` định tuyến an toàn cho `/api/*` và SPA routes, chặn thư mục private. | Đã cập nhật `vercel.json` |
| **CF-08** | Lịch sử Git commit cũ còn chứa tệp nhạy cảm trong quá khứ | P1 | `DEC-08` / `TASK-P5-04` | Tuân thủ `DEC-08`: Tạm hoãn viết lại commit history bằng BFG sau khi V1.0 phát hành. | **HOLD** (`DEC-08` đã duyệt) |

---

## 4. BẢN ĐỒ THAY THẾ NHIỆM VỤ (TASK SUPERSESSION MAP)

| Mã Task Cũ | Tên Task Cũ | Mã Task Mới (v2.0) | Trạng Thái / Lý Do Thay Thế |
|---|---|---|---|
| `TASK-01` → `TASK-06` | Security Containment (CF-01..CF-07) | `TASK-P3-04` | Kế thừa trọn vẹn kết quả kiểm thử đạt 100%, đưa vào Phase 3 (chờ Tuấn duyệt tại **GATE-01B**). |
| `TASK-06D` | P0 Clara Privacy Containment | `TASK-P3-03` | Kế thừa kết quả cô lập 10/10 PASS, bảo vệ vĩnh viễn cả nội dung lẫn sự tồn tại của không gian Clara. |
| `TASK-07` | Physical Database Backup | `TASK-P3-01` | Đã hoàn tất tạo 3 bản backup cục bộ (SHA-256 xác minh, chờ restore test có kiểm soát). |
| `TASK-08` | Fix person_media seed & reseed | `TASK-P3-02` | Tiếp tục giữ trạng thái **HOLD** chờ Tuấn phê duyệt tại **GATE-02**. |
| `TASK-11` → `TASK-13` | Vibecode Lab & Frontend Finalization | `FE-P2-01`..`05` | **SUPERSEDED:** Không coi Lab là sản phẩm song song; chuyển thành hoàn thiện 4 cửa ngõ và subsystem `/me/tree` trên Local Mirror. |
| `TASK-14` → `TASK-17` | ReBAC & Privacy Engine | `TASK-P4-02` | Tinh gọn: Phân biệt rõ xác minh thành viên vs phân quyền; áp dụng chính sách Branch-scoped cho Thư Clara. |
| `TASK-18` → `TASK-19` | Integration & Staging QA | `TASK-P4-01`..`03` | Nối trực tiếp Vercel rewrite với Node backend và chạy Browser QA 4 viewports trên dữ liệu thật. |
| `TASK-20` → `TASK-23` | Production Deployment & Closure | `TASK-P5-01`..`04` | Giữ nguyên quy trình release có kiểm soát và Human Gate 06. |

---

## 5. GIẢI TRÌNH DÒNG PHIÊN BẢN TÀI LIỆU (DOCUMENT VERSION LINEAGE)

- **`v1.0` (2026-10-31):** Bản Master Completion Plan và Frontend Plan đầu tiên sau đợt khảo sát an ninh tổng thể.
- **`v1.1` - `v1.2` (2026-11-01):** Bản cập nhật bổ sung định hướng bảo tồn di sản số theo UNESCO 2003 và rà soát an ninh Thư Clara.
- **Các nhãn phiên bản `v2.1`, `v2.2`, `v2.3` từng xuất hiện trong văn bản thảo luận:** Không có bản commit Git độc lập tương ứng trong kho mã nguồn; được phân loại nhận thức là **`[UNKNOWN]`** (chỉ tồn tại trong văn bản nháp trước đó).
- **`v2.0 Canonical` (2026-11-02 — Bản hiện hành):** Bản chuẩn hóa tối cao tái cấu trúc toàn bộ lộ trình:
  1. Lấy Website `https://giatoctrantrongthu.com` làm Product Baseline duy nhất.
  2. Xác lập 4 hash routes là các Cửa ngõ / Điểm mời thành viên, không phải nội dung công khai.
  3. Chuẩn hóa vai trò Vibecode Lab là UI/UX Review Mirror.
  4. Tách chốt chặn GATE-01A (Kế hoạch) và GATE-01B (Diff an ninh cụ thể).

---
*Tài liệu được biên lập bởi AGY phục vụ công tác thẩm định của Tuấn (Human Final Authority) và Emarald (Analysis Authority).*
