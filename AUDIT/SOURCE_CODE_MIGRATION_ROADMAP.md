# KẾ HOẠCH CHUYỂN ĐỔI & TÁI CẤU TRÚC MÃ NGUỒN (PHASE 3)
## (SOURCE CODE MIGRATION & REFACTORING ROADMAP)

**Mã tài liệu:** `SOURCE_CODE_MIGRATION_ROADMAP.md`  
**Đường dẫn canonical:** `AUDIT/SOURCE_CODE_MIGRATION_ROADMAP.md`  
**Tài liệu liên quan:** [`AUDIT/SOURCE_CODE_ARCHITECTURE_AUDIT.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/SOURCE_CODE_ARCHITECTURE_AUDIT.md), [`AUDIT/SOURCE_CODE_TARGET_ARCHITECTURE.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/SOURCE_CODE_TARGET_ARCHITECTURE.md)  
**Chỉ thị điều hành:** `DIRECTIVE: SOURCE CODE ARCHITECTURE & MASTER PLAN RESTRUCTURING`  
**Dự án:** CÂY GIA PHẢ — GIA TỘC TRẦN TRỌNG THU (`giatoctrantrongthu.com`)  
**Product Owner / Thẩm quyền tối cao:** Tuấn (Human Final Authority)  
**Thẩm định kiến trúc & Quản trị chất lượng:** Emarald (Strategic Analysis / Quality Control)  
**Cơ quan thực thi:** AGY (Execution Coordinator & Primary Agent)  
**Thời điểm hoàn tất:** 2026-11-03  

---

## 1. NGUYÊN TẮC CHUYỂN ĐỔI TỪNG BƯỚC (INCREMENTAL MIGRATION PRINCIPLES)

Tuyệt đối tuân thủ nguyên tắc **"Không thực hiện Big Bang Refactoring"** do Tuấn và Emarald chỉ đạo:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 5 NGUYÊN TẮC CHUYỂN ĐỔI BẢO TOÀN HÀNH VI (BEHAVIOR-PRESERVING)│
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. CHUYỂN ĐỔI TỪNG BƯỚC NHỎ (STEP-BY-STEP): Mỗi hạng mục có phạm vi cô lập, │
│    kiểm thử hồi quy độc lập trước khi chuyển sang hạng mục tiếp theo.       │
│ 2. BẢO TOÀN HÀNH VI SẢN PHẨM SỐNG: Giữ nguyên 100% URL hash, API endpoints  │
│    và cấu trúc dữ liệu đang vận hành trên Production và Staging.            │
│ 3. SỬ DỤNG MẪU THIẾT KẾ FACADE / ADAPTER: Trong giai đoạn chuyển tiếp, các  │
│    tệp cũ đóng vai trò là "Cầu nối chuyển tiếp" (Re-export Facade) trỏ sang │
│    vị trí mới để bảo đảm các script bên ngoài không bị gãy liên kết.        │
│ 4. ZERO DATA LOSS & ZERO UNINTENDED DELETION: Tuyệt đối không xóa mã nguồn; │
│    toàn bộ các tệp legacy đều được chuyển an toàn vào cây thư mục archive/. │
│ 5. BẰNG CHỨNG TRƯỚC KHI ĐÁNH DẤU DONE: Chỉ đánh dấu hoàn tất khi vượt qua   │
│    toàn bộ Acceptance Criteria và kiểm thử tự động Browser QA / API.        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. MA TRẬN 8 HẠNG MỤC CHUYỂN ĐỔI (THE 8 MIGRATION PACKAGES)

Lộ trình chuyển đổi được phân rã thành 8 gói công việc có thứ tự phụ thuộc chặt chẽ:

```
                   SƠ ĐỒ PHỤ THUỘC 8 HẠNG MỤC CHUYỂN ĐỔI (MIG-01 ĐẾN MIG-08)
                   
   ┌────────────────────────────────────────────────────────┐
   │ MIG-01: Dọn Dẹp Root & Lưu Trữ Mã Nguồn Cũ (Archive)   │
   └───────────────────────────┬────────────────────────────┘
                               │ (Làm sạch không gian làm việc)
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │ MIG-02: Tách Chiết Nền Tảng Dùng Chung (Shared Layer)  │
   └───────────────────────────┬────────────────────────────┘
                               │ (CSS, DOM, Contracts ổn định)
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │ MIG-03: Tách Chiết Miền Logic Thuần Túy (Domain Core)  │
   └───────────────────────────┬────────────────────────────┘
                               │ (Genealogy, Kinship, Lunar Engine)
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │ MIG-04: Nghịch Đảo Phụ Thuộc Dữ Liệu (Platform Data)   │
   └───────────────────────────┬────────────────────────────┘
                               │ (Xóa bỏ static import của mock)
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │ MIG-05: Module Hóa Hạ Tầng Backend (Server Express 5)  │
   └───────────────────────────┬────────────────────────────┘
                               │ (API & Middleware an toàn)
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │ MIG-06: Nâng Cấp & Đồng Bộ Admin Center (WordPress v2) │
   └───────────────────────────┬────────────────────────────┘
                               │ (Admin & Lab tích hợp)
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │ MIG-07: Tái Cấu Trúc Bốn Bề Mặt Trải Nghiệm (Apps)     │
   └───────────────────────────┬────────────────────────────┘
                               │ (Public, Member, Lab, Admin Apps)
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │ MIG-08: Nghiệm Thu Toàn Trình & Đóng Sổ Nợ Kỹ Thuật    │
   └────────────────────────────────────────────────────────┘
```

---

## 3. ĐẶC TẢ CHI TIẾT TỪNG HẠNG MỤC CHUYỂN ĐỔI

### 3.1 `MIG-01`: Dọn Dẹp Thư Mục Gốc & Lưu Trữ Mã Nguồn Cũ (Root Cleanup & Archival)
- **ID:** `MIG-01`
- **Mục tiêu:** Dọn sạch hơn 50 kịch bản patch một lần nằm rải rác ở thư mục gốc và di chuyển các file mã nguồn thế hệ cũ không còn hoạt động (`member-app.js`, `member_baseline.html`) vào thư mục `archive/` an toàn, lập lại trật tự cho repository.
- **Hiện trạng:** Thư mục gốc bị ô nhiễm bởi 50+ script `.py`, `.js`, `.sh` cũ (`patch_*.js`, `edit_*.py`, `check_*.py`). File `src/js/member-app.js` (2.964 dòng) gây nhiễu cho các công cụ tìm kiếm code.
- **Trạng thái đích:** Thư mục gốc sạch sẽ, chỉ chứa các tệp quy chuẩn (`package.json`, `index.html`, `lab.html`, `vercel.json`). Toàn bộ script cũ được gom vào `scripts/archive/` và `archive/legacy-frontend/`.
- **Tệp tin bị ảnh hưởng:**
  - Di chuyển các file root patch vào `scripts/archive/`.
  - Di chuyển `src/js/member-app.js`, `server/member_baseline.html`, `src/css/main.css` vào `archive/legacy-frontend/`.
- **Phụ thuộc:** Không có (Bắt đầu đầu tiên).
- **Các bước thực hiện:**
  1. Tạo thư mục `scripts/archive/` và `archive/legacy-frontend/`.
  2. Sử dụng lệnh di chuyển an toàn (`mv`), không xóa bất kỳ file nào.
  3. Kiểm tra các import và kịch bản test để bảo đảm không có script active nào bị gãy.
- **Yêu cầu bảo toàn hành vi:** Cả `index.html`, `lab.html` và `server/member_*.html` đều không nạp `member-app.js`, do đó hành vi người dùng không bị thay đổi.
- **Phương pháp kiểm thử:** Chạy `npm test` và `node scripts/serve_lab.mjs`, đối soát console không có lỗi 404.
- **Tiêu chí nghiệm thu:** `ls -1` thư mục gốc giảm từ 80+ file xuống dưới 20 file quy chuẩn.
- **Kế hoạch Rollback:** Di chuyển ngược lại từ `archive/` về vị trí cũ qua Git/lệnh mv.
- **Độ phức tạp / Rủi ro:** Thấp / Thấp.
- **Hành động tiếp theo:** Chuyển sang `MIG-02`.

---

### 3.2 `MIG-02`: Tách Chiết Nền Tảng Dùng Chung (Shared Foundation Extraction)
- **ID:** `MIG-02`
- **Mục tiêu:** Tập trung toàn bộ quy chuẩn Brand Design Tokens, tiện ích DOM an toàn và Contracts dùng chung vào thư mục `src/shared/`.
- **Hiện trạng:** Các tiện ích DOM (`dom.js`), Token (`tokens.js`), Ngữ cảnh (`contexts.js`) nằm lẫn lộn trong `src/js/ui/` cùng với các màn hình view lớn.
- **Trạng thái đích:** `src/shared/` trở thành thư viện lõi độc lập gồm 3 nhánh: `src/shared/css/`, `src/shared/dom/`, `src/shared/contracts/`.
- **Tệp tin bị ảnh hưởng:**
  - `src/css/foundation/*` $\rightarrow$ `src/shared/css/`
  - `src/js/ui/dom.js` $\rightarrow$ `src/shared/dom/dom-builder.js`
  - `src/js/ui/contexts.js`, `tokens.js`, `epistemic.js` $\rightarrow$ `src/shared/contracts/`
- **Phụ thuộc:** Hoàn tất `MIG-01`.
- **Các bước thực hiện:**
  1. Tạo cây thư mục `src/shared/{css, dom, contracts}/`.
  2. Di chuyển các tệp nền tảng sang vị trí mới.
  3. Tạo các file chuyển tiếp (Facade) tại `src/js/ui/dom.js` re-export từ `src/shared/dom/dom-builder.js` để bảo đảm tương thích ngược 100%.
- **Yêu cầu bảo toàn hành vi:** Tất cả các component UI hiện hữu tiếp tục import bình thường mà không bị lỗi undefined.
- **Phương pháp kiểm thử:** Khởi động Vibecode Lab trên cổng 8888, mở 7 không gian UI kiểm tra hiển thị.
- **Tiêu chí nghiệm thu:** Không có lỗi module resolve error; CSS tokens hiển thị chính xác.
- **Kế hoạch Rollback:** Khôi phục lại vị trí file ban đầu từ snapshot Git.
- **Độ phức tạp / Rủi ro:** Trung bình / Thấp.
- **Hành động tiếp theo:** Chuyển sang `MIG-03`.

---

### 3.3 `MIG-03`: Tách Chiết Miền Logic Thuần Túy (Domain Core Layer Extraction)
- **ID:** `MIG-03`
- **Mục tiêu:** Bóc tách toàn bộ logic tính toán phả hệ, lịch âm Việt Nam và pipeline xử lý MẠCH ra khỏi giao diện, tổ chức thành tầng Domain thuần túy JavaScript (Zero DOM, Zero Network).
- **Hiện trạng:**
  - Thuật toán Âm lịch nằm ở `src/js/core/lunar-engine.js`.
  - Thuật toán tính thế hệ và dựng cây gia phả nằm rải rác trong `src/js/ui/tree.js` và `member-app.js`.
  - Logic phân loại MẠCH nằm trong `src/js/ui/contexts.js`.
- **Trạng thái đích:** Tầng `src/domain/` tự trị hoàn toàn, chứa:
  - `src/domain/calendar/lunar-engine.js` (Chuyển đổi Dương - Âm lịch chuẩn xác).
  - `src/domain/genealogy/tree-builder.js` (Dựng phả đồ và tính độ sâu thế hệ).
  - `src/domain/editorial/markdown-pipeline.js` (Pipeline xử lý văn bản MẠCH chuẩn).
- **Phụ thuộc:** Hoàn tất `MIG-02`.
- **Các bước thực hiện:**
  1. Tạo thư mục `src/domain/{genealogy, kinship, calendar, editorial, archive}/`.
  2. Di chuyển `lunar-engine.js` vào `src/domain/calendar/`.
  3. Trích xuất thuật toán index phả hệ từ `tree.js` thành hàm thuần túy trong `tree-builder.js`.
  4. Viết Unit Tests độc lập kiểm tra kết quả tính toán của tầng Domain.
- **Yêu cầu bảo toàn hành vi:** Kết quả hiển thị cây phả hệ trên màn hình `tree.js` và ngày kỵ giỗ trên màn hình lịch phải khớp 100% với dữ liệu trước khi tách.
- **Phương pháp kiểm thử:** Chạy kịch bản kiểm tra `test_markdown_acceptance.py` và kiểm thử trực quan trên Lab.
- **Tiêu chí nghiệm thu:** Tầng Domain không có bất kỳ lệnh `document.createElement`, `window` hay `fetch()` nào.
- **Kế hoạch Rollback:** Revert về import cũ.
- **Độ phức tạp / Rủi ro:** Trung bình / Trung bình.
- **Hành động tiếp theo:** Chuyển sang `MIG-04`.

---

### 3.4 `MIG-04`: Nghịch Đảo Phụ Thuộc Dữ Liệu (Platform Data Inversion)
- **ID:** `MIG-04`
- **Mục tiêu:** Xóa bỏ hoàn toàn việc `data.js` nạp tĩnh `mock-adapter.js`, áp dụng mẫu thiết kế Dependency Inversion để tiêm adapter dữ liệu phù hợp tại runtime.
- **Hiện trạng:** [`src/js/ui/data.js:11`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/data.js#L11) import trực tiếp `mock-adapter.js`, khiến mã nguồn Production luôn bị dính líu đến dữ liệu giả lập.
- **Trạng thái đích:**
  - `src/platform/data/data-service.js` định nghĩa interface chuẩn: `getPeople()`, `getStories()`, `getMedia()`, `getProfile()`.
  - `src/platform/data/http-adapter.js` gọi REST API thật khi chạy trên Production/Staging.
  - `src/platform/mock/mock-adapter.js` chỉ được nạp khi chạy trong Vibecode Lab hoặc khi có cờ `__GIATOC_MOCK__`.
- **Phụ thuộc:** Hoàn tất `MIG-03`.
- **Các bước thực hiện:**
  1. Tạo thư mục `src/platform/{data, mock, storage}/`.
  2. Xây dựng DataService Factory: Kiểm tra biến môi trường hoặc cờ URL để nạp Adapter tương ứng.
  3. Cập nhật `data.js` thành facade ủy quyền cho `data-service.js`.
- **Yêu cầu bảo toàn hành vi:** Khi mở `lab.html`, dữ liệu mock vẫn nạp trơn tru; khi mở trang thật qua server cổng 3000, dữ liệu CSDL SQLite được nạp chính xác.
- **Phương pháp kiểm thử:** Chạy song song 2 kịch bản: `scripts/test_live_server.mjs` (kiểm tra API thật) và `scripts/lab_browser_qa.mjs` (kiểm tra mock trên Lab).
- **Tiêu chí nghiệm thu:** Gói mã nguồn trên Production không còn import bất kỳ tệp fixture JSON nào.
- **Kế hoạch Rollback:** Phục hồi `data.js` ban đầu.
- **Độ phức tạp / Rủi ro:** Cao / Trung bình.
- **Hành động tiếp theo:** Chuyển sang `MIG-05`.

---

### 3.5 `MIG-05`: Module Hóa Hạ Tầng Backend (Server Express 5 Modularization)
- **ID:** `MIG-05`
- **Mục tiêu:** Phân rã file nguyên khối `server/index.js` (596 dòng) thành cấu trúc Express chuẩn mực: tách biệt cấu hình app, khởi động server, middleware an ninh và các modular routers.
- **Hiện trạng:** `server/index.js` gộp chung toàn bộ logic lắng nghe cổng, cấu hình session, rate limit, database connection, file streaming và định nghĩa 15+ API endpoints.
- **Trạng thái đích:**
  - `server/app.js`: Khởi tạo Express, gắn middleware bảo mật, nạp modular routers.
  - `server/server.js`: Khởi tạo kết nối CSDL và lắng nghe cổng mạng (PORT 3000).
  - `server/routes/`: Tách thành `auth-routes.js`, `member-routes.js`, `admin-routes.js`, `public-routes.js`, `spaces-routes.js`.
  - `server/middleware/`: Tách thành `session-guard.js`, `csrf-guard.js`, `rate-limiter.js`.
- **Phụ thuộc:** Hoàn tất `MIG-04`.
- **Các bước thực hiện:**
  1. Tạo các router con trong `server/routes/`.
  2. Di chuyển các endpoint `/api/admin/*` sang `admin-routes.js`.
  3. Di chuyển các endpoint `/api/people`, `/api/stories`, `/api/edges` sang domain routers tương ứng.
  4. Tạo `server/app.js` và cập nhật `server/index.js` làm điểm khởi động ủy quyền.
- **Yêu cầu bảo toàn hành vi:** Toàn bộ các API URL (`/api/people`, `/api/auth/login`...) giữ nguyên 100% chữ ký request và response JSON.
- **Phương pháp kiểm thử:** Chạy toàn bộ test suite backend: `node scripts/test_live_server.mjs` và kiểm tra đăng nhập trên `/admin`.
- **Tiêu chí nghiệm thu:** `server/index.js` giảm quy mô xuống dưới 100 dòng; 100% API routes vượt qua kiểm thử hồi quy.
- **Kế hoạch Rollback:** Khôi phục `server/index.js` từ bản backup.
- **Độ phức tạp / Rủi ro:** Cao / Cao.
- **Hành động tiếp theo:** Chuyển sang `MIG-06`.

---

### 3.6 `MIG-06`: Nâng Cấp & Tích Hợp Admin Center (Unified Admin Center v2.1)
- **ID:** `MIG-06`
- **Mục tiêu:** Tái cấu trúc phân hệ `/admin` theo đúng đặc tả kiến trúc v2.1 (WordPress Model): nạp Design Tokens dùng chung, tổ chức điều hướng Hash Router 2 cấp, và nhúng Vibecode Lab vào `#/lab/preview`.
- **Hiện trạng:** `/admin` dùng CSS riêng biệt (`admin.css`), code điều khiển nguyên khối (`admin/js/admin.js: 778 LOC`), preview chỉ là popup text thô sơ.
- **Trạng thái đích:** `/admin` trở thành Trung tâm Quản trị Thống nhất với 5 trục: Dashboard, Nội dung, Cộng đồng, Thiết kế & Lab (`#/lab/preview`), Vận hành & Hệ thống.
- **Tệp tin bị ảnh hưởng:**
  - `admin/index.html`, `admin/css/admin.css` $\rightarrow$ nạp `src/shared/css/foundation.css`.
  - `admin/js/admin.js` $\rightarrow$ phân rã thành các module trong `src/apps/admin/modules/`.
- **Phụ thuộc:** Hoàn tất `MIG-05`.
- **Các bước thực hiện:**
  1. Cập nhật `admin/index.html` nạp CSS Foundation.
  2. Triển khai Hash Router chuẩn BNF theo đặc tả Chương 10 của tài liệu v2.1.
  3. Tích hợp engine của Vibecode Lab vào route `#/lab/preview`.
- **Yêu cầu bảo toàn hành vi:** Giữ nguyên các chức năng quản lý People, Stories, Events và Database hiện có của Admin.
- **Phương pháp kiểm thử:** Đăng nhập tài khoản Owner (`tuan`), duyệt qua toàn bộ các menu sidebar, kiểm tra preview trên Lab.
- **Tiêu chí nghiệm thu:** Giao diện Admin đồng bộ hoàn toàn với Brand Design Tokens; mở được Lab preview trực tiếp trong Admin.
- **Kế hoạch Rollback:** Khôi phục `admin/js/admin.js` cũ.
- **Độ phức tạp / Rủi ro:** Rất Cao / Trung bình.
- **Hành động tiếp theo:** Chuyển sang `MIG-07`.

---

### 3.7 `MIG-07`: Tái Cấu Trúc Bốn Bề Mặt Trải Nghiệm (Experience Apps Reorganization)
- **ID:** `MIG-07`
- **Mục tiêu:** Quy hoạch toàn bộ các màn hình hiển thị đầu cuối vào cấu trúc `src/apps/`: `public/`, `member/`, `lab/`, `admin/`.
- **Hiện trạng:** Các view màn hình (`public-home.js`, `dashboard.js`, `tree.js`...) nằm lẫn lộn trong `src/js/ui/` cùng các file boot.
- **Trạng thái đích:** Cấu trúc `src/apps/` ngăn nắp, phân định rõ ứng dụng nào phục vụ đối tượng nào (Public vs Member vs Admin vs Lab).
- **Tệp tin bị ảnh hưởng:**
  - `src/js/ui/public-home.js`, `boot-public.js` $\rightarrow$ `src/apps/public/`
  - `src/js/ui/{dashboard, tree, person, discourse, spaces}.js` $\rightarrow$ `src/apps/member/`
  - `src/js/ui/lab.js` $\rightarrow$ `src/apps/lab/`
- **Phụ thuộc:** Hoàn tất `MIG-06`.
- **Các bước thực hiện:**
  1. Tạo các thư mục con trong `src/apps/`.
  2. Di chuyển các view components vào thư mục ứng dụng tương ứng.
  3. Cập nhật đường dẫn script trong `index.html`, `lab.html` và các file `server/views/member_*.html`.
  4. Để lại file Facade tại `src/js/ui/` để bảo đảm không làm hỏng các đường dẫn import cũ.
- **Yêu cầu bảo toàn hành vi:** Cả 7 bề mặt UI và trang chủ công khai đều khởi động bình thường, không gián đoạn dịch vụ.
- **Phương pháp kiểm thử:** Chạy kịch bản tự động `scripts/lab_browser_qa.mjs` quét 4 độ phân giải (375, 768, 1024, 1440px).
- **Tiêu chí nghiệm thu:** 100% các màn hình hiển thị chính xác, 0 console error.
- **Kế hoạch Rollback:** Revert commit Git tương ứng.
- **Độ phức tạp / Rủi ro:** Cao / Trung bình.
- **Hành động tiếp theo:** Chuyển sang `MIG-08`.

---

### 3.8 `MIG-08`: Nghiệm Thu Toàn Trình & Đóng Sổ Nợ Kỹ Thuật (Verification & Debt Closure)
- **ID:** `MIG-08`
- **Mục tiêu:** Thực hiện kiểm thử tích hợp E2E toàn diện, đối soát toàn bộ 8 khoản nợ kỹ thuật (TD-01 đến TD-08), xóa bỏ các tệp Facade tạm thời và bàn giao hệ thống đạt chuẩn Modular Monolith hoàn chỉnh.
- **Hiện trạng:** Đã hoàn thành 7 bước tái cấu trúc nhưng vẫn còn một số tệp chuyển tiếp Facade tương thích ngược.
- **Trạng thái đích:** Toàn bộ repository vận hành đồng bộ trên cấu trúc mới; các tài liệu kiến trúc, Master Plan và README được cập nhật chính xác; sổ nợ kỹ thuật được đóng.
- **Phụ thuộc:** Hoàn tất `MIG-01` đến `MIG-07`.
- **Các bước thực hiện:**
  1. Quét toàn bộ codebase để loại bỏ các import trỏ vào đường dẫn cũ.
  2. Xóa các tệp Facade tạm thời đã hoàn thành sứ mệnh chuyển tiếp.
  3. Chạy toàn bộ các bộ kịch bản kiểm thử: Governance check, Security containment check, Browser QA, Live API test.
  4. Cập nhật `AUDIT/README.md` và `MASTER_COMPLETION_PLAN.md`.
- **Yêu cầu bảo toàn hành vi:** Toàn bộ sản phẩm vận hành hoàn hảo từ Public Home, Không gian thành viên, Admin Center đến Vibecode Lab.
- **Phương pháp kiểm thử:** Chạy `python3 scripts/verify_governance.py` và kiểm thử Playwright toàn trình.
- **Tiêu chí nghiệm thu:** 100% các bài kiểm tra đạt PASS; 0 lỗi bảo mật; 0 dead code.
- **Kế hoạch Rollback:** Phục hồi từ nhánh Git ổn định trước đó.
- **Độ phức tạp / Rủi ro:** Trung bình / Thấp.
- **Hành động tiếp theo:** Bàn giao nghiệm thu chính thức cho Tuấn và Emarald.

---

*Kế hoạch Chuyển đổi Mã nguồn (Phase 3) đã hoàn tất, cung cấp lộ trình 8 bước an toàn, bảo toàn hành vi sản phẩm, sẵn sàng để tích hợp vào Master Plan tại Giai đoạn IV.*

