# BÁO CÁO THỰC THI CHỈ THỊ GTCT-EVIDENCE-GOVERNANCE-01
## BÁO CÁO PHÁP Y ĐỐI SOÁT & KỶ CƯƠNG BẰNG CHỨNG (EPISTEMIC DISCIPLINE & PROJECT CONTINUATION)

- **Cơ quan thẩm quyền tối cao:** Tuấn — Product Owner / Human Final Authority
- **Thẩm tra kiến trúc & QC độc lập:** Emarald — Strategic Architecture Review / Independent QC
- **Chỉ huy điều phối & Thực thi:** AGY — Chief Orchestrator / Execution Coordinator
- **Văn bản quy chiếu:** `GTCT-EVIDENCE-GOVERNANCE-01`
- **Mã báo cáo:** `AUDIT/GTCT-EVIDENCE-GOVERNANCE-01-IMPLEMENTATION-REPORT.md`
- **Thời điểm lập:** 2026-11-04T23:25:00+07:00
- **Chế độ kiểm toán:** STRICT READ-ONLY ON SOURCE CODE & DATABASE (0 file mã nguồn sản phẩm bị sửa đổi, 0 lệnh ghi/xóa CSDL, bảo toàn nguyên vẹn 100% working tree).

---

## MỤC LỤC BÁO CÁO

1. [Vị trí Cấu hình AGY Thực sự Có Hiệu lực](#1-vị-trí-cấu-hình-agy-thực-sự-có-hiệu-lực)
2. [Những Governance Files Cần Tích hợp hoặc Cập nhật](#2-những-governance-files-cần-tích-hợp-hoặc-cập-nhật)
3. [Đề xuất Quy tắc Kỷ cương Bằng chứng (Evidence Governance Rules)](#3-đề-xuất-quy-tắc-kỷ-cương-bằng-chứng-evidence-governance-rules)
4. [Bằng chứng Đối chiếu Trạng thái Dự án (Stage 0 & Stage 1)](#4-bằng-chứng-đối-chiếu-trạng-thái-dự-án-stage-0--stage-1)
5. [Danh sách Findings Đã Xác minh, Kế thừa và Chưa Xác minh](#5-danh-sách-findings-đã-xác-minh-kế-thừa-và-chưa-xác-minh)
6. [Các Vấn đề Ưu tiên Theo Mức độ Ảnh hưởng](#6-các-vấn-đề-ưu-tiên-theo-mức-độ-ảnh-hưởng)
7. [Các Human Gates Chưa Được Phê duyệt (Ranh giới Bất khả Xâm phạm)](#7-các-human-gates-chưa-được-phê-duyệt-ranh-giới-bất-khả-xâm-phạm)
8. [Đề xuất Batch Triển khai Tiếp theo](#8-đề-xuất-batch-triển-khai-tiếp-theo)

---

## 1. VỊ TRÍ CẤU HÌNH AGY THỰC SỰ CÓ HIỆU LỰC

### A. Observations (Quan sát trực tiếp)
- Trong môi trường Antigravity harness, tệp [`AGENTS.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AGENTS.md) tại thư mục gốc được tự động nạp vào thẻ hệ thống `<user_rules>` tại thời điểm khởi tạo phiên làm việc (Prompt Injection Session Start).
- Tệp [`USER.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/USER.md) quy định hồ sơ thẩm quyền của Tuấn và chỉ thị bất biến.
- Tệp [`.clinerules`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/.clinerules) quy định giới hạn bề mặt dành riêng cho công cụ Cline (chỉ ghi `src/css/`, `src/js/ui/`, `index.html`, cấm can thiệp `server/`, `database/`, `docs/`).
- Tệp [`.agents/rules/primary-agent.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/.agents/rules/primary-agent.md) chứa quy chuẩn thực thi chi tiết của AGY.
- Các subagents được tạo thông qua `define_subagent` nhận chỉ thị trực tiếp từ chuỗi `SystemPrompt` khi khai báo và `Prompt` khi triệu hồi qua `invoke_subagent`.

### B. Evidence (Bằng chứng)
- Header của prompt hệ thống chứa:
  ```text
  <RULE[/Users/tuantq/Projects/Personal/giatoctrantrongthu/AGENTS.md]>
  # GIATỘC AGENT OPERATING SYSTEM (AIOS) — CANONICAL GOVERNANCE
  ...
  </RULE>
  ```
- Lệnh gọi công cụ `manage_subagents list` ghi nhận 5 subagents chuyên môn hóa nhận các `SystemPrompt` độc lập đã được khai báo ở Phase 0.

### C. Analysis (Phân tích)
- Cấu hình có hiệu lực ràng buộc thực tế cao nhất đối với AGY là **`AGENTS.md`** (nhờ cơ chế tự động nạp thành System User Rules).
- Cấu hình có hiệu lực đối với Subagents là **tham số `SystemPrompt` trong lời gọi `define_subagent`**.
- Cấu hình có hiệu lực đối với Cline là **`.clinerules`**.

### D. Inference (Suy luận)
- Nếu một quy tắc chỉ được viết trong một tài liệu kiến trúc ngẫu nhiên dưới `docs/` mà không nằm trong `AGENTS.md`, `USER.md` hoặc `SystemPrompt` của subagent, quy tắc đó sẽ không có hiệu lực cưỡng chế tự động trên execution harness.

### E. Conclusion (Kết luận)
- Điểm chốt chặn quản trị bắt buộc phải được duy trì đồng bộ tại 3 vị trí thực tế:
  1. `AGENTS.md` (Cho AGY / Antigravity Lead Agent).
  2. `.clinerules` (Cho Cline Specialized Resource).
  3. Mẫu khai báo `define_subagent` System Prompt (Cho các Subagents).

---

## 2. NHỮNG GOVERNANCE FILES CẦN TÍCH HỢP HOẶC CẬP NHẬT

| Governance File | Vai trò hiện tại | Nhu cầu tích hợp / Cập nhật theo `GTCT-EVIDENCE-GOVERNANCE-01` |
| :--- | :--- | :--- |
| [`AGENTS.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AGENTS.md) | Canonical AIOS Governance (SoT) | **Cần tích hợp Phần 9: Epistemic Discipline & Evidence Governance** (Quy chuẩn phân loại 10 trạng thái bằng chứng, cấm từ ngữ tuyệt đối, quy tắc `EVIDENCE → ANALYSIS → CONCLUSION`). |
| [`.agents/rules/primary-agent.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/.agents/rules/primary-agent.md) | Workspace Rule cho AGY | **Cần cập nhật Mục 5: Kỷ cương Bằng chứng trong Thực thi** (Đồng bộ với `AGENTS.md`). |
| [`.clinerules`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/.clinerules) | Quy chuẩn cho Cline | **Cần bổ sung Mục 6: Chuẩn mực Bằng chứng Visual QA** (Cấm báo cáo "DONE" chỉ bằng 1 screenshot; bắt buộc chạy Playwright 4 viewports). |
| [`AUDIT/MASTER_COMPLETION_PLAN.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/MASTER_COMPLETION_PLAN.md) | Lộ trình Single Source of Truth | **Cần cập nhật Mục 6.5 & Mục 12.2**: Thay thế các nhãn tự xưng hoàn thành bằng hệ thống nhãn bằng chứng chuẩn (`PROVEN`, `PARTIAL`, `FAILED`, `BLOCKED`, `UNVERIFIED`). |

---

## 3. ĐỀ XUẤT QUY TẮC KỶ CƯƠNG BẰNG CHỨNG (EVIDENCE GOVERNANCE RULES)

Đề xuất đưa vào `AGENTS.md` điều khoản bắt buộc sau:

### Quy tắc 1: Luồng tư duy chuẩn mực (Execution Flow)
Mọi kết luận kỹ thuật bắt buộc phải đi theo trình tự một chiều:
$$\text{EVIDENCE (Dữ kiện thực nghiệm)} \longrightarrow \text{ANALYSIS (Phân tích đối soát)} \longrightarrow \text{CONCLUSION (Kết luận giới hạn)}$$
Nghiêm cấm hình thành kết luận trước rồi mới tìm kiếm dữ liệu để hợp thức hóa.

### Quy tắc 2: Cấu trúc 6 trường thông tin cho mỗi Claim quan trọng
Mọi báo cáo nghiệm thu, kiểm thử hoặc kiểm toán bắt buộc phải trình bày theo bảng hoặc khối cấu trúc:
- **Claim:** Tuyên bố cụ thể về trạng thái hoặc tính năng.
- **Evidence:** Bằng chứng định lượng trực tiếp (lệnh thực thi, mã lỗi, dòng code, HTTP status, thời gian phản hồi).
- **Provenance:** Nguồn gốc xuất xứ rõ ràng (Đường dẫn tệp, số dòng, commit hash hoặc tên test suite).
- **Scope:** Phạm vi cụ thể mà bằng chứng thực sự hỗ trợ (ví dụ: chỉ hỗ trợ trong môi trường Node.js hoặc chỉ trên tập fixture mẫu).
- **Limitation:** Những giới hạn mà bằng chứng chưa chứng minh được (môi trường chưa thử, dữ liệu chưa quét).
- **Status:** Nhãn trạng thái thuộc 10 mức phân loại chuẩn mực.

### Quy tắc 3: Hệ thống 10 trạng thái nhận thức pháp y (10-Tier Status Taxonomy)
1. `DOCUMENTED`: Mới chỉ được ghi chép trong tài liệu thiết kế; chưa có code hoặc cấu hình.
2. `CONFIGURED`: Đã có tệp cấu hình hoặc schema tương ứng; chưa kiểm chứng hành vi runtime.
3. `OBSERVED`: Đã trực tiếp quan sát thấy sự tồn tại trong môi trường cụ thể qua lệnh đọc/quét.
4. `TESTED`: Đã chạy phép thử tự động cụ thể và có log thực thi.
5. `PROVEN`: Có bằng chứng trực tiếp đầy đủ xác nhận claim trong phạm vi và điều kiện đã xác định rõ.
6. `PARTIAL`: Đã triển khai hoặc kiểm thử thành công một phần; phần còn lại còn thiếu hoặc stub.
7. `FAILED`: Phép thử hoặc lệnh kiểm tra thất bại; có lỗi hoặc sai lệch dữ liệu.
8. `BLOCKED`: Tiến độ bị nghẽn do rào cản kỹ thuật hoặc quyết định chưa được Human phê duyệt.
9. `UNKNOWN`: Chưa có đủ thông tin để đưa ra nhận định.
10. `UNVERIFIED`: Có tuyên bố trong quá khứ nhưng chưa được kiểm chứng độc lập lại.

### Quy tắc 4: Danh mục hành vi nghiêm cấm (Strict Prohibitions)
- ❌ Cấm sử dụng các tính từ tuyệt đối hóa: *perfect, 100% secure, zero risk, fully complete, production-ready, flawless, highest standard*.
- ❌ Cấm tuyên bố hoàn thành chỉ dựa trên sự tồn tại của file, khai báo cấu hình, hoặc lời tự khai của agent khác.
- ❌ Cấm đưa ra tỷ lệ phần trăm tùy tiện nếu không công khai công thức, trọng số và dữ liệu đầu vào.
- ❌ Cấm che giấu kết quả test thất bại, skipped test, hoặc sự khác biệt giữa môi trường giả lập (mock) và môi trường thật (live).

---

## 4. BẰNG CHỨNG ĐỐI CHIẾU TRẠNG THÁI DỰ ÁN (STAGE 0 & STAGE 1)

Dưới đây là kết quả kiểm toán thực nghiệm trực tiếp tại 4 nhóm trọng tâm:

### 4.1 Hạ tầng Kiểm thử (Test Infrastructure)

#### Item 1: Tệp `package.json` ở thư mục gốc
- **Claim:** `package.json` ở thư mục gốc chưa cấu hình lệnh kiểm thử tự động.
- **Evidence:** Kiểm tra trực tiếp tệp `package.json`:
  ```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  }
  ```
  Chạy lệnh `npm test` trả về mã thoát `1` (Exit code 1).
- **Provenance:** [`package.json:10-16`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/package.json#L10-L16).
- **Scope:** Thư mục gốc repository.
- **Limitation:** Không ảnh hưởng đến việc chạy trực tiếp từng file qua lệnh `node tests/<file>.mjs`.
- **Status:** `FAILED` (Đứt gãy liên kết script kiểm thử).

#### Item 2: Dependencies của Backend Express
- **Claim:** Thư mục gốc không chứa dependencies của backend; dependencies nằm riêng trong `server/package.json`.
- **Evidence:** Thư mục gốc `package.json` không có trường `"dependencies"`. Tệp `server/package.json` chứa 8 dependencies: `bcrypt`, `cors`, `dotenv`, `express`, `express-rate-limit`, `express-session`, `mysql2`, `sqlite3`.
- **Provenance:** [`package.json:1-29`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/package.json#L1-L29) và [`server/package.json:13-22`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/package.json#L13-L22).
- **Scope:** Môi trường cài đặt npm cục bộ.
- **Limitation:** Một lập trình viên chỉ chạy `npm install` ở root sẽ không thể chạy được backend.
- **Status:** `CONFIGURED` / `OBSERVED`.

#### Item 3: 12 Test Suites Node.js (`.mjs`) trong thư mục `tests/`
- **Claim:** Cả 12 test suites Node.js đều chạy thành công với mã thoát 0 khi được thực thi độc lập.
- **Evidence:** Thực thi tuần tự qua vòng lặp shell:
  `for f in tests/test_*.mjs; do node "$f"; done` $\to$ Cả 12 test suites đều trả về exit code 0.
  - `test_batch_ui_02_03.mjs` (0.28s, 3/3 suites pass)
  - `test_batch_ui_03_deep_qa.mjs` (0.35s, 4 deep suites pass, 153/153 con cháu tuân thủ BFS)
  - `test_consumer_integration.mjs` (0.18s, 5/5 tích hợp pass)
  - `test_domain_archive.mjs` (0.16s, 16/16 tests pass)
  - `test_domain_calendar.mjs` (0.15s, 265 sự kiện ICS pass)
  - `test_domain_editorial.mjs` (0.16s, 24/24 tests pass)
  - `test_domain_genealogy.mjs` (0.14s, 223 người pass)
  - `test_domain_kinship.mjs` (0.15s, 50/50 paths pass)
  - `test_gateway_hardening.mjs` (0.12s, 5/5 routes pass)
  - `test_member_home_convergence.mjs` (0.14s, 3/3 tests pass)
  - `test_platform_data.mjs` (0.17s, 7/7 suites pass)
  - `test_shared_layer.mjs` (0.12s, 100% legacy parity pass)
- **Provenance:** Thư mục [`tests/`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/tests/).
- **Scope:** Môi trường Node.js v22.18.0 với giả lập DOM cục bộ trong test harness hoặc pure logic.
- **Limitation:** Không bao gồm việc kiểm thử hành vi thực tế trên trình duyệt thực đa độ phân giải (cần Playwright Browser QA).
- **Status:** `PROVEN` (Trong phạm vi môi trường Node.js runtime).

#### Item 4: Kiểm thử Python `test_markdown_acceptance.py`
- **Claim:** Bộ kiểm thử chấp thuận Markdown gặp lỗi assertion do lệch số lượng bài viết MẠCH.
- **Evidence:** Thực thi lệnh `python3 tests/test_markdown_acceptance.py`:
  ```text
  FAIL: test_criterion_30_and_35_real_content_regression
  AssertionError: 12 != 19 : Expected 19 compiled MẠCH articles
  Ran 4 tests in 0.007s - FAILED (failures=1)
  ```
- **Provenance:** [`tests/test_markdown_acceptance.py:145`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/tests/test_markdown_acceptance.py#L145).
- **Scope:** Kiểm tra hồi quy nội dung Markdown MẠCH.
- **Limitation:** Lỗi do test suite viết từ 06/09/2026 chưa được cập nhật theo quyết định an ninh cô lập 7 thư Clara khỏi MẠCH công khai (19 - 7 = 12 bài).
- **Status:** `FAILED` (Cần cập nhật kỳ vọng của test suite).

---

### 4.2 An ninh & Phân quyền (Security & Authorization)

#### Item 5: Phòng vệ tấn công giả mạo yêu cầu (CSRF Protection)
- **Claim:** Backend Express hiện tại hoàn toàn thiếu middleware phòng chống CSRF.
- **Evidence:** Quét toàn bộ thư mục `server/` bằng lệnh `grep -rn -i "csrf" server/` $\to$ Không có kết quả nào. Không có thư viện `csurf`, không có middleware kiểm tra double-submit cookie hay custom header.
- **Provenance:** Toàn bộ mã nguồn thư mục [`server/`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/).
- **Scope:** Tất cả các endpoint ghi dữ liệu (`POST /api/people`, `POST /api/stories`, `POST /api/events`, `POST /api/admin/users`, `DELETE /api/admin/users/:id`).
- **Limitation:** Cookie phiên có cờ `sameSite: 'lax'` giúp giảm thiểu tấn công cơ bản từ liên kết bên ngoài, nhưng không thể thay thế cho Anti-CSRF Token chuyên dụng.
- **Status:** `FAILED` / `NOT IMPLEMENTED` (Lỗ hổng an ninh đã xác minh).

#### Item 6: Quản lý Phiên làm việc (Session Handling)
- **Claim:** Session backend đang sử dụng bộ nhớ RAM mặc định (MemoryStore) và có cảnh báo khi thiếu biến môi trường `SESSION_SECRET`.
- **Evidence:** Kiểm tra [`server/index.js:58-74`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/index.js#L58-L74):
  ```javascript
  app.use(session({
      name: 'sid',
      secret: process.env.SESSION_SECRET || 'dev-only-insecure-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 86400000 }
  }));
  ```
  Không có cấu hình `store` (như `connect-sqlite3` hay `connect-redis`), do đó session lưu trong memory của tiến trình Node.js.
- **Provenance:** [`server/index.js:58-74`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/index.js#L58-L74).
- **Scope:** Quản lý đăng nhập quản trị và thành viên cục bộ.
- **Limitation:** Khởi động lại server sẽ làm mất toàn bộ phiên đăng nhập đang hoạt động.
- **Status:** `CONFIGURED` / `PARTIAL`.

#### Item 7: Phân quyền Dựa trên Quan hệ (ReBAC Authorization)
- **Claim:** Bảng `authorities` đã tồn tại trong SQLite nhưng có 0 bản ghi và chưa có middleware kiểm tra quyền hạn ReBAC trong Express.
- **Evidence:**
  - Truy vấn SQLite: `SELECT count(*) FROM authorities;` $\to$ Kết quả: `0`.
  - Quét mã nguồn: `grep -rn "checkPermission\|hasPermission" server/` $\to$ Không tìm thấy hàm kiểm tra quyền hạn nào.
  - Phân quyền hiện tại hoàn toàn dựa trên RBAC thô sơ: `requireAuth` ([`server/auth.js:8`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/auth.js#L8)), `requireOwner` ([`server/auth.js:16`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/auth.js#L16)), và `requireAccount` ([`server/member.js:10`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/member.js#L10)).
- **Provenance:** [`server/foundation.js:26`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/foundation.js#L26), [`server/auth.js:8-21`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/auth.js#L8-L21).
- **Scope:** Hệ thống phân quyền nội bộ.
- **Limitation:** Chưa có cơ chế phân quyền cho Trưởng chi hay Thủ từ như tài liệu thiết kế đề cập.
- **Status:** `DOCUMENTED` / `PARTIAL`.

#### Item 8: Các thay đổi an ninh chưa commit trong Git (Uncommitted Security Diff)
- **Claim:** Các tệp an ninh quan trọng (`server/index.js`, `server/auth.js`, `server/foundation.js`, `server/member.js`) đang nằm ở trạng thái uncommitted trong Git working tree.
- **Evidence:** Lệnh `git status --short` ghi nhận `M server/index.js`, `?? server/auth.js`, `?? server/foundation.js`, `?? server/member.js`.
- **Provenance:** Git index của repository.
- **Scope:** Toàn bộ mã nguồn backend đã vá an ninh P0 (chặn đường dẫn nhạy cảm `SENSITIVE_PATH`, lọc Thư Clara, rate limit).
- **Limitation:** Chưa được commit và push vào nhánh chính, đang chờ chốt chặn **GATE-01** của Tuấn.
- **Status:** `BLOCKED` (Chờ Human Gate).

---

### 4.3 Tính Toàn vẹn Dữ liệu (Data Integrity)

#### Item 9: Hiện trạng 173 bản ghi `person_media` trong SQLite
- **Claim:** Bảng `person_media` có cấu trúc `(relation_id, person_id, media_id)` trong đó trường `media_id` có giá trị `NULL` trên toàn bộ 173 bản ghi; trường mang tên `asset_id` không hề tồn tại trong bảng.
- **Evidence:**
  - Lệnh SQLite schema:
    ```sql
    CREATE TABLE person_media (relation_id TEXT PRIMARY KEY, person_id TEXT, media_id TEXT);
    ```
  - Truy vấn kiểm tra:
    ```sql
    SELECT count(*), count(media_id) FROM person_media;
    -- Kết quả: count(*) = 173, count(media_id) = 0.
    ```
- **Provenance:** CSDL [`server/family_archive.db`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/family_archive.db), bảng `person_media`.
- **Scope:** Dữ liệu liên kết ảnh hồ sơ nhân vật trong CSDL SQLite.
- **Limitation:** CSDL không có foreign key constraints cứng, hoàn toàn dựa vào kiểm tra ở tầng ứng dụng.
- **Status:** `OBSERVED` / `PARTIAL` (Dữ liệu bị khuyết khóa ngoại trực tiếp).

#### Item 10: Khả năng phục hồi dữ liệu liên kết ảnh (Mapping Source & Recovery Capability)
- **Claim:** Toàn bộ 173 bản ghi `person_media` có thể khôi phục chính xác 100% sang `media.id` dựa trên chuỗi định danh `relation_id`.
- **Evidence:**
  - Thực thi truy vấn kết nối (JOIN) đối soát:
    ```sql
    SELECT count(*) FROM person_media pm
    JOIN media m ON m.id = ('MEDIA_FS_' || substr(pm.relation_id, instr(substr(pm.relation_id, 5), '_') + 5));
    -- Kết quả: 173 / 173 khớp tuyệt đối.
    ```
  - Ví dụ đối soát dòng đầu tiên: `relation_id = PMR_I223_G1B5-W5Y` khớp chính xác với `media.id = MEDIA_FS_G1B5-W5Y`.
- **Provenance:** CSDL [`server/family_archive.db`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/family_archive.db), bảng `person_media` và `media`.
- **Scope:** Toàn bộ 173 liên kết chân dung hiện có trong hệ thống.
- **Limitation:** Cần một câu lệnh `UPDATE person_media SET media_id = ...` có kiểm soát và sao lưu vật lý trước khi chạy, thuộc thẩm quyền phê duyệt của **GATE-02**.
- **Status:** `PROVEN` (Về mặt thuật toán phục hồi; trạng thái CSDL đang HOLD chờ GATE-02).

---

### 4.4 Hệ thống Tài liệu (Documentation)

#### Item 11: Tài liệu Hướng dẫn Khởi động cho Lập trình viên (Developer Onboarding)
- **Claim:** Không có tài liệu hướng dẫn cài đặt và chạy local theo từng bước chuẩn hóa.
- **Evidence:** Kiểm tra thư mục `docs/`: Không có thư mục `docs/dev/` hoặc tệp `DEVELOPER_ONBOARDING.md`. Lập trình viên mới phải tự tìm hiểu qua các file audit phân tán.
- **Provenance:** Cấu trúc thư mục [`docs/`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/).
- **Scope:** Trải nghiệm của lập trình viên và AI agent mới.
- **Limitation:** `CONTRIBUTING.md` có hướng dẫn ngắn gọn nhưng thiếu bước cài đặt dependencies cho backend.
- **Status:** `FAILED` / `MISSING`.

#### Item 12: Tài liệu Hướng dẫn Thành viên Dòng họ (User Enablement)
- **Claim:** Dự án hoàn toàn thiếu vắng tài liệu cẩm nang hướng dẫn sử dụng dành cho thành viên gia đình và người cao niên.
- **Evidence:** Không có thư mục `docs/user/` hoặc bất kỳ tệp `MEMBER_GUIDE.md` nào. Tệp `docs/HELP.md` thực chất là tài liệu kỹ thuật dành cho Developer/Agent (giải thích cấu trúc file và ports), không phải cẩm nang người dùng.
- **Provenance:** Toàn bộ thư mục [`docs/`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/).
- **Scope:** Trải nghiệm tiếp cận của người dùng cuối trong gia đình.
- **Limitation:** Mặc dù giao diện Member Home trực quan, người dùng lớn tuổi không có tài liệu giải thích cách kích hoạt tài khoản hay ý nghĩa các biểu tượng.
- **Status:** `FAILED` / `MISSING`.

#### Item 13: Mâu thuẫn Kiến trúc trong Tài liệu (Contradictory Architecture Decisions)
- **Claim:** Có mâu thuẫn trực tiếp về phạm vi tính năng GEDCOM giữa Roadmap và Baseline.
- **Evidence:**
  - `PROJECT_ROADMAP.md:25`: *"DO NOT BUILD / OUT OF SCOPE: ❌ Import / Export GEDCOM"*.
  - `docs/architecture/IMPLEMENTATION_BASELINE.md:66-67`: *"P4 — Sovereignty: 22. GEDCOM import, 23. GEDCOM export"*.
- **Provenance:** [`PROJECT_ROADMAP.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/PROJECT_ROADMAP.md) và [`docs/architecture/IMPLEMENTATION_BASELINE.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/architecture/IMPLEMENTATION_BASELINE.md).
- **Scope:** Định hướng phạm vi sản phẩm V1.0 vs V1.1.
- **Limitation:** Cần quyết định của Tuấn để chuẩn hóa vào một văn kiện duy nhất (`MASTER_COMPLETION_PLAN.md`).
- **Status:** `OBSERVED` / `CONFLICT`.

---

## 5. DANH SÁCH FINDINGS ĐÃ XÁC MINH, KẾ THỪA VÀ CHƯA XÁC MINH

### Nhóm 1: Findings Đã Trực tiếp Xác minh Thực nghiệm (Verified Findings)
1. **5/5 Pure Domain Cores hoạt động độc lập không phụ thuộc DOM:** Xác minh bằng việc thực thi 5 bộ test suites riêng biệt trên Node.js (Exit code 0).
2. **Platform Data Inversion Layer (DIP) hoạt động đúng:** Xác minh bằng `test_platform_data.mjs` (7/7 test suites pass).
3. **173 liên kết ảnh trong `person_media` có `media_id` là `NULL`:** Xác minh bằng truy vấn trực tiếp CSDL vật lý SQLite `family_archive.db`.
4. **173/173 liên kết có thể khôi phục chính xác bằng biểu thức chuỗi:** Xác minh bằng câu lệnh JOIN đối soát 100% khớp với bảng `media`.
5. **Backend Express thiếu Anti-CSRF Token:** Xác minh bằng quét regex trên toàn bộ mã nguồn `server/`.
6. **Lỗi kiểm thử Python `AssertionError: 12 != 19`:** Xác minh bằng chạy lệnh `python3 tests/test_markdown_acceptance.py`.
7. **Lệnh `npm test` ở thư mục gốc bị lỗi:** Xác minh bằng lệnh `npm test` trả về exit code 1 do `"echo \"Error: no test specified\" && exit 1"`.
8. **Vibecode Lab đang phục vụ tại cổng 8888:** Xác minh bằng lệnh curl trả về HTTP 200 (1.59 ms).
9. **Cửa ngõ công khai chặn dữ liệu phả hệ:** Xác minh bằng `test_gateway_hardening.mjs` (5/5 routes pass).

### Nhóm 2: Findings Kế thừa Từ Báo cáo Lịch sử Cần Kiểm chứng lại (Inherited Findings)
1. **Trạng thái kết nối MariaDB Remote trên NAS Synology (`192.168.1.189`):** Kế thừa từ các báo cáo Phase 2/Phase 3; chưa thể kiểm chứng runtime từ sandbox hiện tại.
2. **Quyền ghi tệp OS trên thư mục `assets/images/` tại môi trường triển khai thực tế của Tuấn:** Kế thừa từ tài liệu hạ tầng; chưa thể kiểm tra phân quyền người dùng Linux/Synology.
3. **Toàn bộ 185 file ảnh trong `assets/images/` có tồn tại vật lý và nguyên vẹn trên đĩa:** Cần một script đối soát kích thước và mã băm SHA-256 cụ thể.

### Nhóm 3: Findings Chưa Xác minh Độc lập (Unverified Items)
1. **Trạng thái thực tế của Live Domain `giatoctrantrongthu.com` trên Vercel:** Do giới hạn sandbox mạng ra ngoài, chưa thể kiểm tra DNS, SSL và commit đang active trên Vercel.
2. **Khả năng tương thích trên các phiên bản trình duyệt iOS Safari cũ (< iOS 15):** Mới chỉ kiểm thử trên headless browser; chưa kiểm thử trên thiết bị di động vật lý.

---

## 6. CÁC VẤN ĐỀ ƯU TIÊN THEO MỨC ĐỘ ẢNH HƯỞNG

```text
MỨC ĐỘ ẢNH HƯỞNG & ĐỘ KHẨN CẤP:
┌────────────────────────────────────────────────────────────────────────┐
│ P0 — NGUY CƠ AN NINH & CHỐT CHẶN PHÊ DUYỆT (CRITICAL / BLOCKING)       │
│ 1. Backend thiếu Anti-CSRF Protection (Nguy cơ giả mạo request).       │
│ 2. Uncommitted Security Diff (Vá an ninh P0 đang chờ duyệt GATE-01).   │
│ 3. Quyết định DEC-A03 đang OPEN (Chặn việc triển khai Public CMS).     │
├────────────────────────────────────────────────────────────────────────┤
│ P1 — TÍNH TOÀN VẸN DỮ LIỆU & ĐỨT GÃY KIỂM THỬ (HIGH PRIORITY)          │
│ 4. 173 liên kết person_media có media_id NULL (Chờ duyệt GATE-02).     │
│ 5. Đứt gãy npm test và package.json root (Gây cản trở quy trình CI/CD).│
│ 6. Lỗi test_markdown_acceptance.py (12 != 19) cản trở test automation. │
├────────────────────────────────────────────────────────────────────────┤
│ P2 — KHOẢNG TRỐNG VẬN HÀNH & TÀI LIỆU (MEDIUM PRIORITY)                │
│ 7. Thiếu vắng hoàn toàn tài liệu hướng dẫn thành viên (User Guide).    │
│ 8. Thiếu tài liệu Developer Onboarding step-by-step.                   │
│ 9. Hơn 114 tài liệu audit lịch sử trùng lặp gây ngợp nhận thức.        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 7. CÁC HUMAN GATES CHƯA ĐƯỢC PHÊ DUYỆT (RANH GIỚI BẤT KHẢ XÂM PHẠM)

Tuân thủ nghiêm ngặt Điều ước Thẩm quyền, AGY khẳng định các cổng sau **BẮT BUỘC DỪNG LẠI CHỜ TUẤN PHÊ DUYỆT**, không có ngoại lệ:

1. **`DEC-A03` (Trang chủ & Public Copy CMS Storage):**
   - *Hiện trạng:* Đang ở trạng thái `OPEN`.
   - *Đề xuất:* Phương án 3 (Tạo bảng `cms_documents` trong SQLite).
   - *Ranh giới:* Tuyệt đối không tự ý viết code hay tạo bảng trước khi Tuấn ký duyệt văn bản.
2. **`GATE-01` (Phê duyệt Diff Mã Nguồn Vá An ninh & ReBAC):**
   - *Hiện trạng:* Toàn bộ diff vá an ninh `SENSITIVE_PATH`, lọc Thư Clara, rate limiter, và bảng `authorities` đang nằm ở uncommitted working tree.
   - *Ranh giới:* Không được commit, merge hay deploy khi Tuấn chưa phê duyệt diff.
3. **`GATE-02` (Phê duyệt Reseed/Update 173 Liên kết Ảnh SQLite):**
   - *Hiện trạng:* Thuật toán nối `'MEDIA_FS_' || substr(...)` đã được chứng minh chính xác 173/173 bản ghi.
   - *Ranh giới:* Không được chạy lệnh `UPDATE` hay can thiệp vào `family_archive.db` khi chưa có lệnh phê duyệt kèm biên bản sao lưu vật lý từ Tuấn.
4. **Bất kỳ thay đổi Schema hay Dữ liệu CSDL thật:**
   - Mọi thao tác `ALTER TABLE`, `DROP`, `UPDATE` hàng loạt trên CSDL SQLite hoặc MariaDB đều cần Human Gate.

---

## 8. ĐỀ XUẤT BATCH TRIỂN KHAI TIẾP THEO

Sau khi Tuấn xem xét báo cáo này và giải tỏa các Human Gates tương ứng, AGY đề xuất triển khai gói công việc cụ thể theo thứ tự:

### BATCH TIẾP THEO: `BATCH-ONBOARDING-AND-TEST-HYGIENE` (Không can thiệp DB/Prod)
1. **Cập nhật `package.json` ở thư mục gốc:**
   - Map `"test"` thành lệnh chạy toàn bộ 12 test suites Node.js:
     `"test": "node --test tests/test_*.mjs || (for f in tests/test_*.mjs; do node $f || exit 1; done)"`.
   - Thêm script `"setup"` để tự động chạy `npm install` trong `server/`.
2. **Cập nhật `tests/test_markdown_acceptance.py`:**
   - Điều chỉnh assertion từ 19 sang 12 bài để phản ánh đúng hiện trạng sau khi cô lập 7 thư Clara sang phân hệ nội bộ, đưa test suite Python về trạng thái PASS 100%.
3. **Biên soạn tài liệu Khởi động:**
   - Tạo mới [`docs/dev/ONBOARDING.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/dev/ONBOARDING.md) (Hướng dẫn cài đặt và chạy local 5 bước trong 10 phút).
   - Tạo mới [`docs/user/MEMBER_GUIDE.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/user/MEMBER_GUIDE.md) (Cẩm nang thành viên: Tra cứu phả hệ, xem lịch giỗ âm dương, đọc bài viết MẠCH).
4. **Tích hợp Kỷ cương Bằng chứng:**
   - Cập nhật các điều khoản của `GTCT-EVIDENCE-GOVERNANCE-01` vào `AGENTS.md` và `.clinerules`.

---

> [!IMPORTANT]
> **DỪNG LẠI TẠI CHECKPOINT (STOP CONDITION):**  
> Báo cáo khảo sát Stage 0 và Stage 1 đã hoàn thành và được ghi tại [`AUDIT/GTCT-EVIDENCE-GOVERNANCE-01-IMPLEMENTATION-REPORT.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/GTCT-EVIDENCE-GOVERNANCE-01-IMPLEMENTATION-REPORT.md).  
> Toàn bộ mã nguồn, cơ sở dữ liệu và trạng thái Git working tree được bảo toàn nguyên vẹn 100% (Strict Read-Only).  
> AGY dừng lại tại đây và kính trình **Tuấn (Product Owner)** cùng **Emarald (Architecture QC)** xem xét, cho ý kiến chỉ đạo đối với các phát hiện, đề xuất quy tắc bằng chứng và các Human Gates đang mở.

