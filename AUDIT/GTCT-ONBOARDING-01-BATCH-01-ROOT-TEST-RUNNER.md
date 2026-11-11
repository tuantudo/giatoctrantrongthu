# BÁO CÁO THỰC THI BATCH 01: ROOT TEST RUNNER
## GTCT-ONBOARDING-01 — BATCH 01: ROOT TEST RUNNER

- **Cơ quan thẩm quyền tối cao:** Tuấn — Product Owner / Human Final Authority
- **Thẩm tra kiến trúc & QC độc lập:** Emarald — Strategic Architecture Review / Independent QC
- **Chỉ huy điều phối & Thực thi:** AGY — Chief Orchestrator & Integration Authority
- **Chỉ thị:** `GTCT-ONBOARDING-01 — BATCH 01: ROOT TEST RUNNER` (Chỉ thị id: 63182)
- **Vị trí báo cáo canonical:** [`AUDIT/GTCT-ONBOARDING-01-BATCH-01-ROOT-TEST-RUNNER.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/GTCT-ONBOARDING-01-BATCH-01-ROOT-TEST-RUNNER.md)
- **Thời điểm hoàn thành:** 2026-11-04T23:31:30+07:00
- **Nguyên tắc tuân thủ:** STRICT MINIMAL CHANGE — Chỉ sửa đúng 1 dòng script `test` trong `package.json`, không sửa source code, không sửa file test, không thêm dependency, không can thiệp CSDL.

---

## 1. TRẠNG THÁI TRƯỚC KHI THỰC HIỆN

- **Cấu hình `package.json` ban đầu:**
  Dòng 11 của `package.json` tại thư mục gốc khai báo script test mặc định:
  ```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    ...
  }
  ```
- **Hành vi thực tế:** Khi chạy lệnh `npm test` tại project root, tiến trình in ra thông báo lỗi và thoát ngay lập tức với mã thoát `1` (Exit code 1).
- **Hạ tầng kiểm thử tồn tại trong repo:**
  Thư mục `tests/` chứa 12 tệp kiểm thử Node.js định dạng `.mjs`, nhưng hoàn toàn bị ngắt kết nối khỏi lệnh `npm test`.

---

## 2. EVIDENCE ĐÃ KIỂM TRA (PREFLIGHT EVIDENCE)

1. **Kiểm tra thư mục gốc:**
   - Lệnh: `pwd` $\to$ `/Users/tuantq/Projects/Personal/giatoctrantrongthu` (`OBSERVED`).
2. **Kiểm tra danh mục 12 tệp test `.mjs`:**
   - Lệnh: `ls -1 tests/test_*.mjs`
   - Danh sách 12 tệp thực tế (`OBSERVED`):
     - `tests/test_batch_ui_02_03.mjs`
     - `tests/test_batch_ui_03_deep_qa.mjs`
     - `tests/test_consumer_integration.mjs`
     - `tests/test_domain_archive.mjs`
     - `tests/test_domain_calendar.mjs`
     - `tests/test_domain_editorial.mjs`
     - `tests/test_domain_genealogy.mjs`
     - `tests/test_domain_kinship.mjs`
     - `tests/test_gateway_hardening.mjs`
     - `tests/test_member_home_convergence.mjs`
     - `tests/test_platform_data.mjs`
     - `tests/test_shared_layer.mjs`
3. **Thử nghiệm chạy trực tiếp test runner chuẩn của Node.js:**
   - Lệnh: `node --test tests/test_*.mjs`
   - Kết quả: Node.js test runner tích hợp sẵn tự động nhận diện và chạy đồng thời cả 12 tệp kiểm thử mà không cần cài thêm bất kỳ thư viện bên ngoài nào (`TESTED` / `PROVEN`).

---

## 3. FILE ĐƯỢC SỬA VÀ NỘI DUNG THAY ĐỔI

- **Tệp duy nhất được chỉnh sửa:** [`package.json`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/package.json).
- **Dòng thay đổi:** Dòng 11.
- **Nội dung cũ:**
  ```json
      "test": "echo \"Error: no test specified\" && exit 1",
  ```
- **Nội dung mới:**
  ```json
      "test": "node --test tests/test_*.mjs",
  ```
- **Không có bất kỳ tệp nào khác bị sửa đổi.** Không có thư viện hay dependency nào được cài thêm.

---

## 4. COMMAND ĐÃ CHẠY VÀ EXIT CODE

- **Lệnh thực thi kiểm chứng:**
  ```bash
  npm test
  ```
- **Mã thoát (Exit Code):** `0` (Thành công).
- **Thời gian thực thi:** `424.83 ms`.
- **Tổng kết runner của Node.js:**
  ```text
  ℹ tests 12
  ℹ suites 0
  ℹ pass 12
  ℹ fail 0
  ℹ cancelled 0
  ℹ skipped 0
  ℹ todo 0
  ℹ duration_ms 424.83
  ```

---

## 5. KẾT QUẢ TỪNG TEST SUITE TRONG PHẠM VI

| STT | Tệp kiểm thử | Kết quả | Thời gian chạy | Chi tiết phạm vi đã kiểm chứng (Scope & Assertions) | Trạng thái |
| :---: | :--- | :---: | :---: | :--- | :---: |
| 1 | `tests/test_batch_ui_02_03.mjs` | **PASS** | 420.04 ms | Hồ sơ 6 tầng, Epistemic badges, form đề xuất `PROP_*`, Dual-view switcher, tìm kiếm 223 dòng, cây Me-Centric. | `PROVEN` |
| 2 | `tests/test_batch_ui_03_deep_qa.mjs` | **PASS** | 242.04 ms | 3-tier layout, đa hôn phối (`@I18@`, `@I32@`), trường hợp 0 và 1 cha mẹ, traversal F0->F4, **153/153 con cháu tuân thủ BFS bloodline**, sắp xếp tiếng Việt `localeCompare("vi")`. | `PROVEN` |
| 3 | `tests/test_consumer_integration.mjs` | **PASS** | 165.73 ms | Tích hợp `data.js` load 223 người; phân quyền Persona (`A-HD` nạp Clara, `A-OB` chặn 403, `ANONYMOUS` chặn 401); 0 Clara leak. | `PROVEN` |
| 4 | `tests/test_domain_archive.mjs` | **PASS** | 162.24 ms | 16/16 test pass: Zero DOM globals, tỷ lệ GCD, heuristic mapping `PMR_` $\to$ `MEDIA_FS_`, 185 media items, 173 quan hệ. | `PROVEN` |
| 5 | `tests/test_domain_calendar.mjs` | **PASS** | 148.91 ms | Parity tuyệt đối trên 265 sự kiện ICS thật (`CAL_01`: 118, `CAL_02`: 115, `CAL_03`: 28, `CAL_04`: 4); tính toán âm dương và chu kỳ giỗ. | `PROVEN` |
| 6 | `tests/test_domain_editorial.mjs` | **PASS** | 158.33 ms | 24/24 test pass: Zero DOM globals, trích xuất block, phân trang, lọc series, phân lập tuyệt đối 12 bài MẠCH và 8 thư Clara. | `PROVEN` |
| 7 | `tests/test_domain_genealogy.mjs` | **PASS** | 113.02 ms | 223 cá nhân, 223 tên phân giải sạch, 6 thế hệ (F-1 đến F4), facade identity `ui/data.js` & `ui/person.js`. | `PROVEN` |
| 8 | `tests/test_domain_kinship.mjs` | **PASS** | 108.45 ms | Zero DOM globals, delta thế hệ, từ điển `KINSHIP_TERMS`, BFS graph 223 nodes (50/50 reachable sample pass). | `PROVEN` |
| 9 | `tests/test_gateway_hardening.mjs` | **PASS** | 101.94 ms | 5/5 routes (`#/gia-pha`, `#/mach`, `#/tu-lieu`, `#/lich`, `#/tim-kiem`) render thẻ mời trang trọng, 0 byte dữ liệu nội bộ bị lộ. | `PROVEN` |
| 10 | `tests/test_member_home_convergence.mjs`| **PASS** | 115.16 ms | Thuật toán vòng tròn lịch giỗ cận kề, cô lập scope MẠCH, render đủ 4 Slices Member Home và Navigation doors. | `PROVEN` |
| 11 | `tests/test_platform_data.mjs` | **PASS** | 159.56 ms | 7/7 test suites: In-memory caching hit/miss/bypass/TTL, MockDataAdapter personas, HttpDataAdapter mock fetch & 401 handling, DIP facade. | `PROVEN` |
| 12 | `tests/test_shared_layer.mjs` | **PASS** | 101.55 ms | 100% legacy parity cho `date-lunar.js`, `dom-helpers.js`, `formatting.js`, tokens & event-bus; 100% reference identity facades. | `PROVEN` |

*Ghi chú giới hạn bằng chứng:* Kết quả PASS của 12 test suites trên chứng minh tính đúng đắn của logic thuần và các hợp đồng tích hợp trong môi trường Node.js runtime. Bằng chứng này chưa đại diện cho kiểm thử tương tác trên trình duyệt thực đa độ phân giải (thuộc phạm vi của Playwright Browser QA).

---

## 6. GIT DIFF VÀ TRẠNG THÁI WORKING TREE

### 6.1 Lệnh `git diff -- package.json`
```diff
diff --git a/package.json b/package.json
index 36942ab..c0d01d5 100644
--- a/package.json
+++ b/package.json
@@ -8,7 +8,11 @@
     "test": "tests"
   },
   "scripts": {
-    "test": "echo \"Error: no test specified\" && exit 1"
+    "test": "node --test tests/test_*.mjs",
+    "db:reset": "cd server && node db_reset.js",
+    "db:seed": "cd server && node db_seed.js && node dev_setup_onboarding.js",
+    "db:verify": "cd server && node verify_mvp.js",
+    "dev": "cd server && DB_CLIENT=sqlite3 DB_PATH=./family_archive.db node index.js"
   },
   "repository": {
     "type": "git",
```
*(Ghi chú: Các dòng 12-15 `db:reset`, `db:seed`, `db:verify`, `dev` là các thay đổi đã tồn tại sẵn trong working tree từ các phiên trước; Batch 01 chỉ sửa duy nhất dòng 11).*

### 6.2 Kiểm tra an toàn working tree (`git status`)
- Không có bất kỳ tệp mã nguồn nào ngoài `package.json` bị sửa đổi bởi Batch 01.
- Toàn bộ các tệp uncommitted có sẵn trong working tree (`server/index.js`, `server/auth.js`, `server/foundation.js`, `server/member.js`, v.v.) được **bảo toàn nguyên vẹn 100%**. Không có lệnh reset, checkout, stash hay revert nào được thực thi.

---

## 7. NHỮNG GÌ ĐÃ THỰC HIỆN

1. Đã khảo sát và xác định chính xác vị trí tệp `package.json` tại thư mục gốc.
2. Đã kiểm tra và xác nhận 12 tệp kiểm thử Node.js dạng `.mjs` trong `tests/`.
3. Đã xác định câu lệnh tối thiểu chuẩn tắc `node --test tests/test_*.mjs` không cần cài thêm dependency.
4. Đã chỉnh sửa duy nhất trường `"test"` trong `package.json`.
5. Đã thực thi kiểm chứng `npm test`, xác nhận chạy thông suốt 12/12 suites, trả về exit code 0.
6. Đã kiểm tra diff và xác nhận không có bất kỳ tác động ngoài phạm vi nào.

---

## 8. NHỮNG GÌ CHƯA THỰC HIỆN (RANH GIỚI TUÂN THỦ)

1. **Chưa sửa tệp kiểm thử Python `tests/test_markdown_acceptance.py`:** Theo ranh giới nghiêm cấm của chỉ thị, không sửa assertion `12 != 19` trong batch này.
2. **Chưa cài thêm dependency nào:** Không thêm bất kỳ package nào vào `dependencies` hoặc `devDependencies`.
3. **Chưa sửa bất kỳ dòng mã nguồn sản phẩm nào:** Không sửa `server/`, `src/`, `admin/`, hay `database/`.
4. **Chưa thực hiện các Human Gates:** Không can thiệp CSDL (`GATE-02`), không commit diff an ninh (`GATE-01`), không triển khai Public CMS (`DEC-A03`).
5. **Chưa commit Git:** Giữ nguyên trạng thái working tree để Tuấn và Emarald kiểm tra diff.

---

## 9. KẾT LUẬN

### TRẠNG THÁI BÀN GIAO: **COMPLETE**

- **Lý do:**
  - Lệnh `npm test` tại project root đã nối thành công vào test runner thực tế của Node.js.
  - Toàn bộ 12 test suites `.mjs` trong phạm vi được thực thi đầy đủ và ghi nhận kết quả rõ ràng (12/12 pass).
  - Exit code bằng `0`.
  - Thay đổi mã nguồn đạt mức tối thiểu tuyệt đối (chỉ 1 dòng trong `package.json`).
  - Không có bất kỳ tác động nào ngoài phạm vi cho phép.

---

> [!IMPORTANT]
> **DỪNG LẠI TẠI CHECKPOINT BẮT BUỘC:**  
> AGY đã hoàn thành trọn vẹn Batch 01 theo đúng chỉ thị và **DỪNG THỰC THI NGAY TẠI ĐÂY**.  
> AGY không tự chuyển sang Batch 02, không sửa governance files, không xử lý các gate đang HOLD.  
> Kính gửi báo cáo này kèm diff sạch đến **Tuấn (Product Owner)** và **Emarald (Architecture QC)** để thẩm tra độc lập trước khi nhận chỉ thị tiếp theo.

