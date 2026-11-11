# BÁO CÁO ĐỐI SOÁT KIẾN TRÚC MÃ NGUỒN & QUẢN TRỊ MASTER PLAN (FINAL CANONICAL)
## (WS08 ARCHITECTURE RECONCILIATION REPORT)

- **Mã tài liệu:** `AUDIT/ARCHITECTURE_RECONCILIATION_REPORT.md`
- **Chỉ thị:** `# DIRECTIVE: WS08 FINALIZATION & CLOSURE`
- **Dự án:** CÂY GIA PHẢ — GIA TỘC TRẦN TRỌNG THU (`giatoctrantrongthu.com`)
- **Product Owner / Thẩm quyền tối cao:** Tuấn
- **Thẩm quyền phân tích & Kiểm soát chất lượng (QC):** Emarald
- **Đơn vị điều phối & thực thi:** AGY (Primary Agent)
- **Chế độ thực thi:** `CONTROLLED DOCUMENTATION FINALIZATION — STRICT READ-ONLY`
- **Thời điểm hoàn tất:** 2026-11-03T23:55:00+07:00

---

## 1. TỔNG QUAN ĐIỀU HÀNH & NGUYÊN TẮC BẰNG CHỨNG

Báo cáo này là văn kiện đối soát kiến trúc cuối cùng của Workstream 08 (WS08), tiếp thu trọn vẹn và xử lý dứt điểm các phản biện kiến trúc của Emarald. Quá trình đối soát tuân thủ nghiêm ngặt nguyên tắc **STRICT READ-ONLY**: không sửa runtime code, không di chuyển tệp, không đổi schema CSDL và không kích hoạt bất kỳ gói migration nào.

Mọi nhận định kỹ thuật đều được gắn nhãn mức độ tin cậy bằng chứng:
- `PROVEN`: Đã kiểm chứng thực nghiệm bằng lệnh hệ thống, cú pháp hoặc kiểm thử tự động tại repo hiện hữu.
- `TESTED`: Đã có test case tự động xác nhận hành vi cụ thể.
- `OBSERVED`: Đã khảo sát trực tiếp file path và line reference trên mã nguồn.
- `PARTIAL`: Đã xác minh được một phần cấu trúc, còn phụ thuộc vào dữ liệu/module chưa tích hợp.
- `UNKNOWN`: Chưa có bằng chứng thực nghiệm, cần thêm dữ liệu đo lường.
- `BLOCKED`: Bị chặn bởi điều kiện tiên quyết hoặc quyết định chưa phê duyệt.

---

## 2. KẾT QUẢ ĐỐI SOÁT CHI TIẾT 6 HẠNG MỤC PHẢN BIỆN (R01 — R06)

### R01 — Dependency Architecture (Phân Định Runtime, DIP & DI)

1. **Phân biệt Client Runtime và Server Runtime (`Status: PROVEN`):**
   - *Client Runtime (Browser Engine):* Chạy trên trình duyệt người dùng qua chuẩn Vanilla JS ES Modules thuần. Sở hữu môi trường `window`, `document`, DOMPurify, Fetch API, LocalStorage.
   - *Server Runtime (Node.js Engine):* Chạy trên máy chủ Node.js v20+. Sở hữu Express 5, module CSDL (`sqlite3`, `mysql2`), crypto, filesystem, cookie session.
   - *Ranh giới bất khả xâm phạm:* Trình duyệt giao tiếp với máy chủ **duy nhất qua giao thức HTTP REST JSON**. Trình duyệt tuyệt đối không import mã nguồn `server/`. Máy chủ tuyệt đối không import các module phụ thuộc DOM.

2. **Cơ chế Dependency Inversion (DIP) & Dependency Injection (DI) thuần Vanilla JS ESM (`Status: PROVEN`):**
   - *Vấn đề hiện hữu:* Tại [`src/js/ui/data.js:11`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/data.js#L11), lệnh `import { mockApi, isMockEnabled, mountLabSwitcher } from './mock-adapter.js'` ghép cứng fixture mock vào bundle client.
   - *Giải pháp đối soát:* Áp dụng *Composition Root Pattern* tại `boot.js` của từng ứng dụng. `DataService` chỉ phụ thuộc Interface trừu tượng. Việc nạp `HttpAdapter` (gọi Live API) hay `MockAdapter` (nạp synthetic fixtures) được tiêm (inject) tại runtime tại điểm khởi động:
     ```javascript
     // boot.js (Composition Root)
     import { DataService } from '/src/js/platform/data/data-service.js';
     import { HttpAdapter } from '/src/js/platform/data/http-adapter.js';

     export async function createDataService() {
       if (window.__GIATOC_MOCK__ === true) {
         const { MockAdapter } = await import('/src/js/platform/mock/mock-adapter.js');
         return new DataService(new MockAdapter());
       }
       return new DataService(new HttpAdapter());
     }
     ```

3. **Cảnh báo an ninh về cờ `window.__GIATOC_MOCK__` (`Status: PROVEN`):**
   - `window.__GIATOC_MOCK__` **KHÔNG PHẢI là một cơ chế an ninh (Security Boundary)**. Đây chỉ là cờ tiện ích phía client dùng trong môi trường phát triển (Dev/Lab). Bất kỳ người dùng nào cũng có thể bật cờ này qua Console trình duyệt.
   - **Bảo vệ dữ liệu thật:** Synthetic Mock Data và Mock Adapter chỉ đọc dữ liệu giả lập từ thư mục `fixtures/synthetic_*.json` in-memory. Mock Adapter **HOÀN TOÀN KHÔNG CÓ KẾT NỐI VỚI CSDL PRODUCTION** (`family_archive.db`), do đó không thể tạo ra đường truy cập hay làm rò rỉ dữ liệu gia tộc thật.
   - An ninh cuối cùng được đảm bảo bởi Server Session Guard (`requireAccount`) kiểm tra session cookie `sid` HttpOnly phía máy chủ.

4. **Phân biệt Pure Shared Utilities vs Browser-Specific Utilities (`Status: PROVEN`):**
   - *Pure Shared Utilities (Isomorphic — Chạy được cả Browser và Node.js):* Hàm định dạng chuỗi, định dạng ngày tháng, tính toán toán học, hằng số nhận thức (`epistemic-labels.js`), mã lỗi chuẩn. Nằm tại `src/js/shared/formatters.js`, `src/js/shared/contracts/`.
   - *Browser-Specific Utilities (Chỉ chạy trên Browser):* Tạo phần tử DOM an toàn (`dom-builder.js`), bọc khử độc XSS (`html-sanitizer.js` dùng DOMPurify), điều hướng hash, quản lý viewport. Nằm tại `src/js/shared/dom/`.

---

### R02 — Domain Boundary (5 Domain Cores, Ranh Giới Nghiệp Vụ & Phân Quyền)

1. **Chuẩn hóa danh mục 5 Domain Cores chuyên biệt (`Status: PROVEN`):**
   Đối soát trực tiếp cấu trúc CSDL thực tế tại [`server/family_archive.db`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/family_archive.db) và Product Spec v1.0, hệ thống sở hữu đúng **5 Domain Cores thuần túy (Zero DOM)**:
   - `src/js/domain/genealogy/`: Sở hữu bảng `people`, `families`, `edges`, `timeline`, `memories`. Trách nhiệm: thuật toán dựng cây phả hệ, phân tầng thế hệ ($F_0..F_n$), niên biểu, bảo tồn bất đồng dữ kiện (`DISPUTED_CLAIM`).
   - `src/js/domain/kinship/`: Sở hữu thuật toán quan hệ thân tộc và đại từ xưng hô Việt Nam chuẩn mực.
   - `src/js/domain/editorial/`: Sở hữu bảng `stories`, `authors`, `series`. Trách nhiệm: vòng đời xuất bản MẠCH (`DRAFT` ──► `PUBLISHED`), cấu trúc chuyên đề, gắn nhãn nhận thức.
   - `src/js/domain/calendar/`: Sở hữu bảng `calendar_events`. Trách nhiệm: động cơ chuyển đổi Âm lịch Việt Nam, tính tiết khí, chu kỳ kỵ giỗ theo năm nhuận.
   - `src/js/domain/archive/`: Sở hữu bảng `media`, `person_media`. Trách nhiệm: siêu dữ liệu tư liệu, nguồn gốc chứng cứ, tọa độ gắn thẻ mặt nhân vật.

2. **Phân biệt rạch ròi 4 khái niệm dễ nhầm lẫn (`Status: PROVEN`):**
   - `Relationships` (Tầng Schema): Cạnh nối thô trực tiếp `(source_id, target_id, edge_type)` trong bảng `edges`. Không chứa ngữ nghĩa xưng hô hay quyền hạn.
   - `Genealogy` (Tầng Domain Logic): Đồ thị phả hệ tổng thể, phân tầng thế hệ, cây Me-Centric, đường dẫn huyết thống cội nguồn.
   - `Kinship` (Tầng Domain Logic): Tính toán mức độ thân tộc, đại từ xưng hô văn hóa (Bác, Chú, Cô, Dì, Anh, Chị, Em, Con, Cháu, Dâu, Rể) và khoảng cách thế hệ.
   - `Family Spaces` (Tầng Application Feature — TP-028): Đơn vị xã hội thu nhỏ (Gia đình hạt nhân / Chi nhánh gia tộc) nơi con cháu sinh hoạt riêng.

3. **Vị trí của Identity, Authentication, Authorization & Giới hạn của Kinship (`Status: PROVEN`):**
   - `Identity` (bảng `accounts`, `identity_mappings`) và `Authentication` thuộc về **Platform Services Layer** (`src/js/platform/auth/` trên client, `server/src/middleware/session-guard.js` trên server).
   - **KINSHIP TUYỆT ĐỐI KHÔNG PHẢI NƠI CHỨA TOÀN BỘ LOGIC PHÂN QUYỀN.** Kinship chỉ đánh giá quan hệ nhân thân giữa 2 cá thể (ví dụ: "cháu ruột nhánh Hạnh Đào").
   - Quyết định phân quyền (Authorization Decision) thuộc về **Authorization Engine / Policy Guard** tại Platform Layer. Engine này tổng hợp nhiều yếu tố: Identity của Actor, Kinship Distance từ Kinship Domain, Resource Privacy Scope (Public/Clan/Family/Clara), và Consent của Người Xuất Hiện (Subject Consent).

---

### R03 — Experience Architecture (Entry Points Thực Tế & Ranh Giới Bảo Mật)

1. **Xác thực các Entry Points thực tế (`Status: PROVEN`):**
   - `index.html`: Cổng Web Công Khai duy nhất tại root (`src/js/ui/boot-public.js`).
   - `lab.html`: Studio thiết kế & xem trước độc lập tại root (`src/js/ui/lab.js`), chạy trên server tĩnh cổng 8888.
   - `admin/index.html`: Trung tâm Quản trị tại thư mục `/admin` (`admin/js/admin.js`).
   - `server/member_*.html`: Các host HTML chuyên biệt (`member_dashboard.html`, `member_tree.html`, `member_person.html`, `member_mach.html`, `member_clara.html`, `member_spaces.html`).
   - **Xác nhận: HOÀN TOÀN KHÔNG CÓ file `member.html` tại thư mục gốc.**

2. **Ranh giới bảo mật thực tế của HTML Pages (`Status: PROVEN`):**
   - Một file HTML **KHÔNG HỀ ĐƯỢC BẢO MẬT CHỈ VÌ NÓ CÓ ROUTE HOẶC FILE RIÊNG**.
   - Tại [`server/member.js:10-24`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/member.js#L10-L24), sự bảo mật của `/me/*` được thực thi hoàn toàn bởi middleware phía máy chủ:
     `async function requireAccount(req, res, next)` kiểm tra `req.session.accountId` hợp lệ trong bảng `accounts`. Nếu chưa đăng nhập, server trả về lệnh chuyển hướng `res.redirect('/login')`.
   - Nếu không có middleware này, bất kỳ ai cũng có thể đọc trực tiếp file HTML tĩnh. Do đó, bảo mật nằm ở tầng **Server Authorization & Session Validation**, không nằm ở cấu trúc file.

3. **Quan hệ giữa Vibecode Lab và Admin Center v2.1 (`Status: PROVEN`):**
   - `lab.html` là môi trường Dev Studio độc lập (chạy mock in-memory, cổng 8888) phục vụ Tuấn và Agents thiết kế prototype cực nhanh.
   - `admin/` tích hợp phân hệ `#/lab` (Design & Experience), cho phép quản trị viên xem trước giao diện và kiểm thử theme bên trong giao diện quản trị có xác thực.
   - Cả hai chia sẻ chung thư viện linh kiện giao diện nhưng độc lập về môi trường thực thi.

---

### R04 — Migration Safety (Khung An Toàn 4 Lớp, 3 Cấp Hoàn Lùi & Giới Hạn Test)

1. **Khung An Toàn 4 Lớp (Four-Stage Safety Framework) (`Status: PROVEN`):**
   - *Giai đoạn 1: Characterization Baseline:* Chụp ảnh snapshot đầu ra hiện tại trên toàn bộ dữ liệu mẫu 228 nhân vật, ngày âm lịch và bài viết MẠCH.
   - *Giai đoạn 2: Shadow Extraction:* Viết module mới song song, module cũ chuyển thành Facade ủy thác, ghi log kiểm thử.
   - *Giai đoạn 3: Output Parity Testing:* So sánh đối soát đầu ra giữa module mới và baseline.
   - *Giai đoạn 4: Atomic Cut-over:* Cắt chuyển khi đạt 100% test pass.

2. **Phân biệt 3 Cấp Độ Hoàn Lùi (Three Rollback Tiers) (`Status: PROVEN`):**
   *Sửa sai lệch: Không tuyên bố "hoàn lùi bằng 1 lệnh git checkout" chung chung.*
   - **Tier 1 — Source Rollback (Hoàn lùi mã nguồn):** Dùng `git restore <file>` hoặc chuyển file từ `archive/` trở lại vị trí cũ khi có lỗi cú pháp hoặc import 404.
   - **Tier 2 — Runtime Rollback (Hoàn lùi trạng thái runtime):** Xóa `localStorage`, xóa session cache trên trình duyệt, khởi động lại Node.js process khi bộ nhớ đệm trạng thái bị xung đột.
   - **Tier 3 — Data Rollback (Hoàn lùi dữ liệu):** Sử dụng SQLite Online Backup API hoặc khôi phục snapshot database (`family_archive.db.bak`) khi có sai lệch dữ liệu CSDL.

3. **Giới hạn của `assert.deepStrictEqual` & Bộ Oracle Đối Soát (`Status: PROVEN`):**
   - *Giới hạn:* `assert.deepStrictEqual` chỉ so sánh giá trị thuộc tính có thể liệt kê (enumerable properties). Nó **không kiểm tra được** thứ tự key không xác định, DOM side-effects, event listeners, hoặc hiệu năng render.
   - *Nguồn đối soát chuẩn (Oracle / Reference Sources):*
     - Thuật toán Âm lịch / Tiết khí: Đối soát với bảng thiên văn chuẩn của Hồ Ngọc Đức và bảng đối chiếu tiết khí Việt Nam 1900–2100.
     - Thuật toán Xưng hô Thân tộc: Đối soát với Ma trận 20+ danh xưng thân tộc chuẩn truyền thống Việt Nam (Ông nội/ngoại, Bác ruột/dâu, Chú/Thím, Cô/Dượng, Cậu/Mợ, Dì/Dượng, Anh họ, Chị dâu, Em rể, Cháu đích tôn...).
     - Thuật toán Phả hệ: Đối soát với đồ thị 228 nhân vật trong `server/family_archive.db`.

---

### R05 — Scripts & Canonical Tokens (Phân Loại 54 Scripts & Khẳng Định Tokens)

1. **Khẳng định vị trí Canonical duy nhất của Design Tokens (`Status: PROVEN`):**
   - Kiểm tra thực tế: File `src/css/tokens.css` **KHÔNG TỒN TẠI**.
   - Vị trí Canonical duy nhất đang được nạp bởi toàn bộ hệ thống là:
     [`src/css/foundation/tokens.css`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/css/foundation/tokens.css)  
     được tổng hợp qua [`src/css/foundation/foundation.css`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/css/foundation/foundation.css).
   - Tuyệt đối không tạo file tokens trùng lặp.

2. **Phân loại chức năng & rủi ro 54 scripts tại thư mục gốc (`Status: PROVEN`):**
   *Sửa sai lệch: 0 inbound references không đồng nghĩa với không còn giá trị.*
   - **Nhóm A — One-off Patch Scripts (38 tệp — Rủi ro rất thấp):** Các script vá CSS, DOM, HTML tạm thời (`patch_*.js`, `edit_*.py`, `fix_*.py`). Đã hết sứ mệnh, sẵn sàng lưu trữ vào `archive/scripts/` khi Tuấn duyệt `MIG-01`.
   - **Nhóm B — Diagnostic & Verification Tools (6 tệp — Rủi ro trung bình):** `verify_all.py`, `final_check.py`, `final_status.py`, `final_verify.py`. Đây là các công cụ CLI độc lập mà lập trình viên/operator có thể chạy thủ công từ terminal để đối soát DB. **Vẫn có giá trị vận hành**, sẽ chuyển vào `scripts/tools/` thay vì coi là rác.
   - **Nhóm C — Database & Seed Utilities (6 tệp — Rủi ro trung bình):** `create_*.py`, `test_relationships.py`, `test_media_assoc.py`. Các tiện ích kiểm tra quan hệ dữ liệu mẫu. Sẽ chuyển vào `scripts/db_tools/`.
   - **Nhóm D — Compiler & Guard Prototypes (4 tệp — Cần đánh giá thêm):** `integrated_compiler.js`, `enforce_gate.js`. Lưu trữ vào `archive/prototypes/`.
   - **Cam kết thực thi:** Trong task này, **KHÔNG CÓ TỆP NÀO BỊ DI CHUYỂN HOẶC XÓA**.

---

### R06 — Technical Debt & Acceptance Criteria (Chuẩn Hóa TD-07 & 8 Chiều DoD)

1. **Giải quyết dứt điểm phân loại TD-07 (`Status: PROVEN`):**
   - *Phân loại chính thức:* **`ACCEPTED DEBT`** trong giai đoạn hiện tại (NOW tier); xử lý triệt để trong `MIG-02` (Shared Layer Extraction).
   - *Lý do chấp nhận:* Các helper chuỗi, định dạng ngày và xử lý text hiện đang bị lặp lại giữa các view UI, nhưng mỗi bản sao đều sử dụng các hàm an toàn cơ bản và DOMPurify đã bọc ở điểm render.
   - *Phạm vi chấp nhận:* Chỉ áp dụng cho các hàm định dạng hiển thị đọc (read-only presentation formatters).
   - *Rủi ro tiềm ẩn:* Sai lệch nhỏ trong định dạng ngày tháng hoặc tên khuyết họ ở một số trường hợp biên.
   - *Điều kiện xem xét lại:* Khi `src/js/shared/formatters.js` được tạo trong `MIG-02`, toàn bộ code UI phải chuyển sang dùng chung và đóng nợ TD-07.

2. **DOMPurify không thay thế Contextual Escaping (`Status: PROVEN`):**
   - DOMPurify bảo vệ chống XSS khi chèn HTML markup vào `innerHTML`.
   - Nhưng DOMPurify **KHÔNG THAY THẾ ĐƯỢC Contextual Escaping** khi chèn dữ liệu vào thuộc tính thẻ (`<input value="...">`), liên kết URL (`<a href="...">`), hoặc CSS inline.
   - Hệ thống bắt buộc áp dụng song hành:
     - `escapeHTML()` cho attribute/text nodes.
     - `encodeURIComponent()` và URL allowlisting (`http:`, `https:`, `mailto:`) cho liên kết.
     - `DOMPurify.sanitize()` cho khối HTML giàu tính năng (MẠCH Articles).

3. **Chuẩn hóa Definition of Done (DoD) 8 Chiều Đo Lường Được (`Status: PROVEN`):**
   Mỗi gói di chuyển `MIG-01` đến `MIG-08` chỉ được nghiệm thu khi đáp ứng 8 chiều:
   1. *Functional Non-Regression:* 30 Touchpoints giữ nguyên vẹn hành vi và luồng tương tác.
   2. *Output Parity:* 100% kết quả khớp với Characterization Baseline trên tập dữ liệu mẫu.
   3. *API Contract Stability:* Các endpoint `/api/*` giữ nguyên cấu trúc JSON response và HTTP status code.
   4. *Security & Privacy:* 10/10 test cases an ninh (`CF-01` đến `CF-08`, cô lập Thư Clara) đạt `PASS`.
   5. *Module & Layer Boundaries:* Không vi phạm ma trận import; 0 DOM dependency trong domain.
   6. *Runtime & Console Cleanliness:* 0 lỗi HTTP 404, ReferenceError, TypeError trên 4 viewports (375, 768, 1024, 1440px).
   7. *Data Integrity:* Không mất mát dữ liệu CSDL; WAL checkpoint sạch sẽ.
   8. *Rollback Verification:* Quy trình hoàn lùi 3 cấp độ đã được tài liệu hóa và sẵn sàng kích hoạt.

---

## 3. BẢNG TỔNG HỢP DANH MỤC ARTIFACT ĐÃ HOÀN THIỆN

| Tên Tài Liệu & Đường Dẫn | Phiên Bản | Vai Trò & Thẩm Quyền | Trạng Thái Quản Trị |
| :--- | :---: | :--- | :---: |
| [`AUDIT/ARCHITECTURE_RECONCILIATION_REPORT.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/ARCHITECTURE_RECONCILIATION_REPORT.md) | `v2.0 Canonical` | Báo cáo đối soát kiến trúc cuối cùng (R01–R06). | **COMPLETED** |
| [`AUDIT/REVISED_SOURCE_CODE_TARGET_ARCHITECTURE.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/REVISED_SOURCE_CODE_TARGET_ARCHITECTURE.md) | `v2.0 Canonical` | Bản đặc tả kiến trúc đích hoàn chỉnh (Modular Monolith). | **PENDING OWNER APPROVAL** |
| [`AUDIT/REVISED_SOURCE_CODE_MIGRATION_ROADMAP.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/REVISED_SOURCE_CODE_MIGRATION_ROADMAP.md) | `v2.0 Canonical` | Lộ trình di chuyển tiệm tiến bảo toàn hành vi (MIG-01..08). | **PENDING OWNER APPROVAL** |
| [`AUDIT/WS08_MASTER_PLAN_CHANGE_PROPOSAL.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/WS08_MASTER_PLAN_CHANGE_PROPOSAL.md) | `v2.0 Canonical` | Bản đề xuất tích hợp WS08 vào Master Completion Plan v4.0. | **PENDING OWNER APPROVAL** |
| [`AUDIT/MASTER_COMPLETION_PLAN.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/MASTER_COMPLETION_PLAN.md) | `v4.0 Canonical` | Master Plan điều phối 8 Batch, Vibecode Lab và WS08. | **ACTIVE (Aligned)** |
| [`AUDIT/README.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/README.md) | `v4.0 Hub` | Hub điều hướng và trạng thái quản trị toàn bộ tài liệu audit. | **COMPLETED** |

---

*Báo Cáo Đối Soát Kiến Trúc Cuối Cùng (v2.0 Canonical) đã hoàn thiện trọn vẹn, khép lại toàn bộ các câu hỏi kỹ thuật mở của WS08, sẵn sàng để Tuấn xem xét và ra quyết định.*
