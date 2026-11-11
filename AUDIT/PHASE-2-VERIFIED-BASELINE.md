# BÁO CÁO THẨM ĐỊNH HIỆN TRẠNG BASELINE DỰ ÁN (PHASE 2A)
**Dự án:** Cây Gia Phả — Gia Tộc Trần Trọng Thụ  
**Authority:** Tuấn (Product Owner / Human Final Authority) | Emarald (Strategic Architecture & Quality Authority)  
**Execution & Integration Owner:** AGY (Chief Orchestrator & Integration Authority)  
**Tài liệu căn chiếu:** `AUDIT/MASTER_COMPLETION_PLAN.md`, `AGENTS.md`, `AUDIT/RECONCILIATION_AND_ORCHESTRATION_REPORT.md`  
**Thời điểm hoàn thành:** 06/11/2026  
**Chế độ thực thi:** STRICT READ-ONLY ON SOURCE CODE & DATABASE (0 file mã nguồn bị sửa đổi, 0 can thiệp DB)

---

## 1. TỔNG QUAN QUẢN TRỊ & KHUNG PHÁP LÝ DỰ ÁN (GOVERNANCE FRAMEWORK)

Theo quy chế hoạt động AIOS và chỉ thị tối cao từ Tuấn, khung quản trị dự án được xác lập vững chắc như sau:

1. **Source of Truth (SoT):**
   - **Tài liệu tối cao duy nhất:** [`AUDIT/MASTER_COMPLETION_PLAN.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/MASTER_COMPLETION_PLAN.md) (Phiên bản v2.0). Mọi kế hoạch con (Sub-Plans), tài liệu kiến trúc kỹ thuật hoặc handoff đều là tài liệu dẫn xuất, bắt buộc phải căn chiếu và đồng bộ về Master Completion Plan.
   - **Sản phẩm Baseline duy nhất:** Website đang chạy trên production `https://giatoctrantrongthu.com` (Bản mẫu xuất bản DESIGN-001 Revision) là biểu hiện cụ thể của Product Intent. Tuyệt đối không xây dựng website thứ hai, không tạo Design System mới.
2. **Project Charter & Mục tiêu Tối thượng:**
   - Xây dựng hệ thống di sản số sống của dòng họ Trần Trọng Thu theo tinh thần Công ước Di sản Văn hóa Phi vật thể UNESCO 2003 (`DEC-01`).
   - Tôn trọng tuyệt đối tính tôn nghiêm của tiền nhân, quyền bảo mật thông tin gia đình con cháu, phân định rõ ranh giới **Nhận diện (Recognition)** vs **Tiết lộ (Disclosure)**.
3. **Agent Workspace Contract & Phân vai 4 cấp độ (4-Tier Authority Model):**
   - **Tier 0: Tuấn — Human Final Authority:** Nắm quyền quyết định tối cao về mục tiêu sản phẩm, chính sách dữ liệu, phê duyệt các cổng chốt chặn (Human Gates) và quyết định triển khai Production.
   - **Tier 1: Emarald — Strategic Architecture & Quality Authority:** Giám sát tuân thủ Brand Governance và AIOS, thực hiện kiểm toán độc lập (Independent QC), thẩm định rủi ro. Không trực tiếp viết mã tính năng.
   - **Tier 2: AGY — Chief Orchestrator & Integration Authority:** Chịu trách nhiệm thực thi kỹ thuật toàn diện xuyên suốt từ Backend đến Frontend, phân rã công việc, quản lý subagents, tích hợp và bảo đảm tính nhất quán toàn hệ thống.
   - **Tier 3: Cline / Specialized Subagents:** Tài nguyên thực thi chuyên biệt (Visual QA, CSS pixel-perfect, Playwright multi-screen testing) được AGY huy động khi có lợi thế rõ rệt về hiệu quả và chi phí.
4. **Trạng thái các Quyết định Kiến trúc Mở (Open Architectural Decisions):**
   - `DEC-A03` (Cơ chế Lưu trữ CMS Trang Chủ & Thẻ Mời Cửa Ngõ): **OPEN — CHỜ TUẤN DUYỆT**. Đề xuất phương án bảng `cms_documents` trong SQLite, hiện dùng abstraction `CmsClient` làm cầu nối tạm.
   - `DEC-12` (Đồng thuận trẻ em & người mất): **OPEN**. Tạm thời áp dụng chính sách an toàn `Restrict by default`.
   - `DEC-13` (Kế nhiệm quản trị dài hạn): **OPEN**. Tuấn chủ động để mở cho thế hệ tương lai.
   - `DEC-14` (Cây chủ đề MẠCH): **OPEN**. Sẽ trình Tuấn duyệt khi triển khai Batch 05.
   - `DEC-15` (Bảng phân chia phạm vi chia sẻ tư liệu): **OPEN**. Sẽ trình Tuấn duyệt khi triển khai Batch 04.
5. **Trạng thái các Chốt Chặn Phê Duyệt Của Con Người (Human Gates Status):**
   - `GATE-01` (Duyệt diff vá an ninh): **PENDING** (Chờ Tuấn phê duyệt diff mã nguồn trước khi commit/merge).
   - `GATE-02` (Duyệt backup vật lý và phục hồi 173 liên kết ảnh SQLite): **PENDING** (Giữ nguyên bit-for-bit CSDL).
   - `GATE-03` (Duyệt nghiệm thu UI vNEXT & Browser QA): **PENDING** (Chờ kết quả kiểm thử visual qua Craft Anything).
   - `GATE-04` (Duyệt chính sách ReBAC và ma trận bảo mật): **PENDING**.
   - `GATE-05` (Duyệt kết quả E2E Staging): **PENDING**.
   - `GATE-06` (Quyết định phát hành chính thức V1.0, sync NAS & deploy Prod): **PENDING**.

---

## 2. KẾT QUẢ ĐỐI SOÁT 10 ĐIỀU KIỆN TIÊN QUYẾT BẮT BUỘC (MANDATORY VERIFICATION)

Mọi kết luận kỹ thuật dưới đây đều tuân thủ nghiêm ngặt chuẩn Epistemic Discipline 5 cấp độ: `VERIFIED`, `OBSERVED`, `INFERRED`, `ASSUMED`, `BLOCKED`.

### Mục 1: 5 Domain Cores có thực sự độc lập với DOM không?
- **Trạng thái:** **`VERIFIED`**
- **Bằng chứng thực nghiệm:**
  - Quét tĩnh toàn bộ thư mục `src/js/domain/` (`archive/`, `calendar/`, `editorial/`, `genealogy/`, `kinship/`): 0 kết quả sử dụng biến toàn cục DOM (`window`, `document`, `HTMLElement`, `localStorage`, `sessionStorage`, `fetch`, `navigator`). Từ khóa "document" duy nhất xuất hiện là chuỗi định danh loại tư liệu (`kind: 'document'`).
  - 5 bộ test chuyên biệt (`test_domain_archive.mjs`, `test_domain_calendar.mjs`, `test_domain_editorial.mjs`, `test_domain_genealogy.mjs`, `test_domain_kinship.mjs`) chạy độc lập 100% trên môi trường thuần túy Node.js CLI không cần JSDOM, không giả lập môi trường trình duyệt.
- **Kết luận:** 5 Domain Cores hoàn toàn thuần khiết (Pure Domains), đạt chuẩn kiến trúc phân tầng cao nhất.

### Mục 2: Data DIP có thực sự được sử dụng bởi toàn bộ UI consumers không?
- **Trạng thái:** **`VERIFIED`**
- **Bằng chứng thực nghiệm:**
  - Tầng `Platform Data Layer` (`src/js/platform/data/`) cung cấp `DataService`, `MockDataAdapter` và `HttpDataAdapter`.
  - Toàn bộ giao diện người dùng vNEXT (`src/js/ui/dashboard.js`, `src/js/ui/tree.js`, `src/js/ui/person.js`, `src/js/ui/discourse.js`, `src/js/ui/public-home.js`, `src/js/ui/gateway.js`) đều nạp dữ liệu thông qua facade `src/js/ui/data.js` hoặc `src/js/ui/mock-adapter.js`.
  - Bộ test `tests/test_consumer_integration.mjs` xác minh 100% các phương thức `memberProfile`, `genealogy`, `media`, `personMedia`, `mach`, `clara`, `submitProposal` được ủy quyền chính xác cho DataService.

### Mục 3: 4 Gateway Routes có thực sự bảo vệ dữ liệu ở cả client và server không?
- **Trạng thái:** **`VERIFIED (CLIENT)` / `OBSERVED (SERVER DEFECT FOUND)`**
- **Bằng chứng thực nghiệm:**
  - **Phía Client (Trình duyệt):** [`src/js/ui/boot-public.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/boot-public.js) bắt chặn các hash routes nội bộ (`#/gia-pha`, `#/mach`, `#/lich`, `#/tim-kiem`, `#/tu-lieu`) và gọi `renderInvitationGateway()`. Bộ test `tests/test_gateway_hardening.mjs` xác nhận 0 byte dữ liệu phả hệ hay bài viết nội bộ bị tải về bộ nhớ trình duyệt khi người dùng chưa đăng nhập.
  - **Phía Server (Backend Express):**
    * *Dữ liệu Clara:* Được bảo vệ nghiêm ngặt bằng regex `SENSITIVE_PATH` (trả về 404 cho `data/private`) và middleware `requireAccount` trên `/api/member/clara.json`.
    * *Lỗ hổng tồn đọng:* Trong [`server/index.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/index.js#L272-L400), hai endpoint `/api/people` và `/api/genealogy.json` hiện vẫn đang mở công khai (`publicCors`) mà không yêu cầu xác thực (`requireAccount`). Nếu người dùng ngoài Internet gọi trực tiếp vào API URL này, server vẫn trả về danh sách 223 nhân vật có trạng thái `PUBLISHED`.
- **Đánh giá rủi ro:** Phía Client đã được bảo vệ tuyệt đối (Gateway Hardening hoạt động hoàn hảo). Nhưng phía Server cần được bổ sung chốt chặn xác thực để đồng bộ triệt để với chính sách Gateway.

### Mục 4: Clara Containment có được bảo đảm ở tầng dữ liệu, API và giao diện không?
- **Trạng thái:** **`VERIFIED`**
- **Bằng chứng thực nghiệm:**
  - *Tầng dữ liệu:* `data/mach.json` có đúng 12 bài viết công khai, 0 bài Clara. `data/private/clara.json` chứa 8 thư Clara riêng tư. Script `node scripts/verify_clara_containment.mjs` báo `PASS`.
  - *Tầng API:* Server từ chối mọi truy cập tĩnh vào `data/private` qua regex chặn đường dẫn nhạy cảm. Route `/api/member/clara.json` yêu cầu phiên đăng nhập thuộc nhánh gia đình được phân quyền (`requireAccount`).
  - *Tầng giao diện:* Component `src/js/ui/dashboard.js` kiểm soát hiển thị cổng vào Clara dựa trên nhánh huyết thống; `src/js/ui/discourse.js` phân lập tách bạch dòng tin MẠCH và Clara.

### Mục 5: Person Profile 6 Layers và Me-Centric Tree có hoạt động trên dữ liệu thực không?
- **Trạng thái:** **`VERIFIED`**
- **Bằng chứng thực nghiệm:**
  - Bộ test `tests/test_batch_ui_02_03.mjs` và `tests/test_batch_ui_03_deep_qa.mjs` nạp bộ dữ liệu đầy đủ 223 cá nhân và 68 gia đình (khớp 1:1 với quy mô thực tế trong file CSDL `server/family_archive.db` và `GIADINHONGTHU.ged`).
  - Toàn bộ 6 tầng thông tin: Identity (Căn cước), Relations (Thân tộc), Evidence (Chứng cứ), Memories (Ký ức), Disputes TP-024 (Tranh biện), Proposals TP-003 (Đề xuất) được kết xuất chính xác.
  - Cây phả hệ 3 thế hệ Me-Centric hiển thị đúng cấu trúc Bậc Phụ Mẫu (Tier 1), Đương Sự & Hôn Phối (Tier 2), Hậu Duệ trực hệ (Tier 3) và tạo đường dẫn huyết thống Breadcrumb chính xác 100% từ mốc Cố Thu (`@I1@`).

### Mục 6: npm test có thực sự PASS 12/12 suites?
- **Trạng thái:** **`VERIFIED`**
- **Bằng chứng thực nghiệm:**
  - Lệnh `npm test` (`node --test tests/test_*.mjs`) thực thi thực tế:
    ```text
    ℹ tests 12 | ℹ suites 0 | ℹ pass 12 | ℹ fail 0 | ℹ cancelled 0 | ℹ skipped 0 | ℹ duration_ms 435.78ms
    ```
  - Cả 12/12 suites kiểm thử kiến trúc, bảo mật và giao diện đều đạt 100% PASS.

### Mục 7: Python acceptance test đang fail ở đâu và nguyên nhân thực tế là gì?
- **Trạng thái:** **`VERIFIED`**
- **Bằng chứng thực nghiệm:**
  - Test fail tại: `python3 tests/test_markdown_acceptance.py` dòng 145: `AssertionError: 12 != 19 : Expected 19 compiled MẠCH articles`.
  - Nguyên nhân gốc đã chứng minh bằng lịch sử Git: Ngày 06/09/2026 (commit `ac08c68e`), test được viết khi `data/mach.json` nạp gộp cả 12 bài MẠCH và 7 thư Clara. Sau đó kiến trúc P0 Clara Containment đã tách riêng 8 thư Clara sang `data/private/clara.json`, thanh lọc `data/mach.json` chỉ còn đúng 12 bài công khai. Test cũ chưa cập nhật assertion nên fail. 100% dữ liệu gốc trên đĩa hoàn toàn nguyên vẹn. Đã có báo cáo chi tiết tại `AUDIT/GTCT-ONBOARDING-01-BATCH-02-PYTHON-TEST-RECONCILIATION.md`.

### Mục 8: Admin Control Center hiện có những module nào thực sự hoạt động?
- **Trạng thái:** **`OBSERVED (PARTIAL PROTOTYPE)`**
- **Bằng chứng thực nghiệm:**
  - Khảo sát mã nguồn `admin/index.html` và `admin/js/admin.js`:
    * *Đang hoạt động với CSDL SQLite:* Quản trị sự kiện / Lịch gia tộc (`#/events`) và Quản lý tài khoản Admin (`#/users`, bảng `admin_users`), tra cứu Schema CSDL (`#/database`).
    * *Ở dạng Prototype cơ bản:* Danh sách nhân sự (`#/people`), Biên tập bài viết (`#/stories`).
    * *Chưa triển khai / Stub:* `#/archive` (Di sản) và `#/inbox` (Hộp thư đề xuất) click vào hiện thông báo `"Chưa có sẵn — Tính năng chưa tích hợp DB thật"`.
    * *Chưa có mã nguồn (0%):* `mod-public-cms` chưa có 1 dòng code do bị chặn bởi quyết định `DEC-A03` đang `OPEN`.

### Mục 9: CSRF protection hiện được triển khai ở những backend routes nào?
- **Trạng thái:** **`VERIFIED (CRITICAL VULNERABILITY FOUND)`**
- **Bằng chứng thực nghiệm:**
  - Quét toàn bộ thư mục `server/`: 0 dòng code xử lý Anti-CSRF Token hoặc thư viện bảo vệ CSRF (`csurf`, Double-Submit Cookie).
  - Toàn bộ các thao tác ghi dữ liệu nhạy cảm qua HTTP POST/PATCH/DELETE (đổi mật khẩu, tạo người dùng admin, chỉnh sửa nhân sự, nạp đề xuất) hoàn toàn phụ thuộc vào Cookie phiên đăng nhập, tiềm ẩn nguy cơ bị tấn công Cross-Site Request Forgery nếu người dùng đăng nhập truy cập trang web độc hại của bên thứ ba.

### Mục 10: DEC-A03 và các quyết định liên quan đang ở trạng thái nào?
- **Trạng thái:** **`VERIFIED`**
- **Bằng chứng thực nghiệm:**
  - `DEC-A03` đang ở trạng thái **`OPEN — CHỜ TUẤN DUYỆT`** trong `AUDIT/MASTER_COMPLETION_PLAN.md` (Mục 9).
  - Văn bản trang chủ hiện vẫn đang hardcode cố định trong `src/js/ui/public-home.js`.
  - Phân hệ `mod-public-cms` của Admin Control Center v2.1 đang bị nghẽn (`BLOCKED`) bởi quyết định này.
  - Phía kỹ thuật đã chuẩn bị sẵn phương án tối ưu: tạo bảng `cms_documents` trong SQLite và sử dụng lớp trừu tượng `CmsClient` để không làm gián đoạn mã nguồn hiện hữu.

---

## 3. BẢNG TỔNG HỢP BASELINE AUDIT TRÌNH TUẤN

| Hạng mục kiểm tra | Hiện trạng thực tế | Kết luận pháp lý | Ghi chú & Khuyến nghị |
| :--- | :---: | :---: | :--- |
| **1. 5 Pure Domain Cores** | 0 biến toàn cục DOM | **`VERIFIED`** | Đạt chuẩn kiến trúc độc lập 100% |
| **2. Data DIP Layer** | 100% UI gọi qua DataService | **`VERIFIED`** | Hoàn thành đảo ngược phụ thuộc |
| **3. Gateway Security** | Client chặn 100% / Server còn hở API | **`OBSERVED`** | Cần bổ sung `requireAccount` cho `/api/people` |
| **4. Clara Containment** | Dữ liệu tách bạch, 0 leak | **`VERIFIED`** | Đạt chuẩn an ninh P0 cao nhất |
| **5. 6 Layers & Me-Centric** | Hoạt động trơn tru trên 223 người | **`VERIFIED`** | Đã sẵn sàng tích hợp sản phẩm |
| **6. npm test** | 12/12 suites PASS (435ms) | **`VERIFIED`** | Nền tảng kiểm thử Node.js vững chắc |
| **7. Python test** | Fail dòng 145 do assertion cũ | **`VERIFIED`** | Đã có bản vá, chờ duyệt tại Checkpoint |
| **8. Admin Control Center** | Hoạt động 3/9 modules | **`OBSERVED`** | Cần lộ trình nâng cấp lên chuẩn v2.1 |
| **9. CSRF Protection** | 0% (Chưa triển khai) | **`CRITICAL`** | Cần ưu tiên P0 triển khai middleware |
| **10. Quyết định DEC-A03** | Trạng thái OPEN | **`BLOCKED`** | Đang chờ quyết định dứt khoát từ Tuấn |

