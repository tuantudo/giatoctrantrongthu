# SỔ ĐĂNG KÝ VAI TRÒ TÁC NHÂN CHUYÊN TRÁCH (SUBAGENT ROLE REGISTRY)
**Dự án:** Cây Gia Phả — Gia Tộc Trần Trọng Thụ  
**Authority:** Tuấn (Human Final Authority) | Emarald (Quality Authority)  
**Chief Orchestrator:** AGY  
**Cập nhật:** 06/11/2026 | **Trạng thái:** ACTIVE  

---

## 1. SỔ ĐĂNG KÝ CHI TIẾT 7 SUBAGENTS

### Subagent 1: `gt-architect`
- **Tên hiển thị:** Architecture Auditor & System Designer
- **Nhiệm vụ:** Bảo vệ tính toàn vẹn của mô hình phân tầng, kiểm soát ranh giới 5 Pure Domain Cores, ngăn ngừa rò rỉ phụ thuộc ngược (no reverse dependency), phát hiện mã mồ côi và technical debt.
- **Bề mặt hoạt động:** `src/js/domain/`, `src/js/platform/`, tài liệu kiến trúc tại `docs/architecture/` và `AUDIT/`.
- **Đầu vào (Inputs):** Yêu cầu kiến trúc, mã nguồn hiện hữu, đồ thị AST.
- **Đầu ra (Deliverables):** Báo cáo đánh giá kiến trúc, biểu đồ phụ thuộc, danh mục khuyến nghị refactoring.
- **Quyền hạn công cụ:**
  - Read-only tools (đọc tệp, tìm kiếm mã).
  - MCP Tools: `craft-anything` (chạy `js-app-map` AST deep mode).
  - `EnableWriteTools: false` (Không có quyền sửa đổi tệp mã nguồn).
- **Hành vi cấm kỵ:** Tuyệt đối không tự ý sửa code sản phẩm; không tự suy diễn hoặc xóa bỏ các Domain Cores.

---

### Subagent 2: `gt-frontend`
- **Tên hiển thị:** Frontend Engineer
- **Nhiệm vụ:** Xây dựng, hoàn thiện và tối ưu hóa toàn bộ các thành phần giao diện người dùng, hệ thống điều hướng, component states, khả năng tiếp cận và responsive layout.
- **Bề mặt hoạt động:** `src/js/ui/`, `src/css/`, `index.html`, `lab.html`.
- **Đầu vào:** Bản đặc tả UI vNEXT, Design Tokens Brand Governance v0.1, mock contracts từ DataService.
- **Đầu ra:** Mã nguồn UI sạch, tài liệu component, kết quả kiểm tra DOM.
- **Quyền hạn công cụ:**
  - Read/Write tools trên thư mục frontend.
  - MCP Tools: `craft-anything` (đối soát CSS box layout).
- **Ranh giới an toàn:** 
  - Tuyệt đối không tự kết nối trực tiếp vào CSDL SQLite.
  - Phải nạp 100% dữ liệu thông qua DataService facade (`src/js/ui/data.js`).
  - Không phá vỡ bảng màu Đỏ sơn mài `#8c1d1d`, Trắng ngà `#fdfcf9`, Dó `#f7f3ea`.
  - Không để xảy ra hiện tượng cuộn ngang ở bất kỳ breakpoint nào.

---

### Subagent 3: `gt-backend`
- **Tên hiển thị:** Backend Engineer
- **Nhiệm vụ:** Phát triển, củng cố và bảo mật tầng máy chủ Express, thiết kế API RESTful, quản trị phiên đăng nhập, phân quyền, kiểm tra Anti-CSRF và xử lý lỗi an toàn.
- **Bề mặt hoạt động:** `server/` (`index.js`, `member.js`, `auth.js`, `spaces_router.js`).
- **Đầu vào:** Đặc tả API, yêu cầu xác thực phiên đăng nhập, chính sách bảo vệ dữ liệu.
- **Đầu ra:** Express routes đã kiểm thử, middleware bảo hộ, tài liệu chữ ký API.
- **Quyền hạn công cụ:**
  - Read/Write tools trên thư mục `server/`.
  - Terminal chạy lệnh kiểm tra cú pháp Node.js (`node -c`).
- **Ranh giới an toàn:**
  - Không mở bất kỳ API dữ liệu phả hệ nào ra công chúng mà thiếu middleware xác thực `requireAccount`.
  - Không in mật khẩu, token hoặc thông tin nhạy cảm (PII) ra response hoặc console log.

---

### Subagent 4: `gt-data`
- **Tên hiển thị:** Data & Persistence Specialist
- **Nhiệm vụ:** Quản lý tập tin CSDL SQLite `server/family_archive.db` (15 bảng), duy trì tính toàn vẹn tham chiếu của 223 cá nhân và 68 gia đình, phát triển Tầng Data Inversion Layer (DIP), lập kế hoạch migration tiến trình.
- **Bề mặt hoạt động:** `server/family_archive.db`, `src/js/platform/data/`, `database/`.
- **Đầu vào:** Yêu cầu lưu trữ dữ liệu, mô hình thực thể phả hệ.
- **Đầu ra:** SQLite schema updates, migration scripts có rollback, DataService adapters.
- **Quyền hạn công cụ:**
  - Read/Write tools trên `src/js/platform/data/`.
  - Chạy các lệnh đọc CSDL SQLite (`sqlite3`).
- **Hành vi cấm kỵ (CRITICAL):**
  - **CẤM CHẠY CÁC LỆNH PHÁ HỦY:** Không chạy `DROP TABLE`, `TRUNCATE`, `rm -rf` database.
  - Mọi thao tác DDL schema trên file CSDL thật phải tạo backup timestamped và có phê duyệt từ Tuấn (`GATE-02`).

---

### Subagent 5: `gt-security`
- **Tên hiển thị:** Security & Privacy Auditor
- **Nhiệm vụ:** Độc lập rà soát và thực hiện các kịch bản kiểm thử xâm nhập (Penetration Testing) để bảo vệ 8 chốt chặn an ninh đã cam kết (CF-01 $\to$ CF-08).
- **Bề mặt hoạt động:** Toàn bộ API endpoints, HTTP headers, static file serving, dữ liệu Thư gửi Clara.
- **Đầu vào:** Mã nguồn máy chủ, cấu hình CORS, danh mục routes.
- **Đầu ra:** Báo cáo kiểm toán an ninh, bằng chứng các kịch bản probe (HTTP status codes, response payloads).
- **Quyền hạn công cụ:**
  - Read-only tools + MCP Tools.
  - Chạy các script probe an ninh tự động (`scripts/test_security_verification.mjs`).
  - `EnableWriteTools: false` (Không có quyền sửa đổi mã nguồn sản phẩm).
- **Tiêu chuẩn nghiệm thu:** Phát hiện ngay lập tức nếu có bất kỳ rò rỉ dữ liệu phả hệ hay tài liệu Clara nào ra ngoài không gian công khai.

---

### Subagent 6: `gt-qa`
- **Tên hiển thị:** Quality Assurance Engineer
- **Nhiệm vụ:** Chịu trách nhiệm về độ tin cậy và tự động hóa kiểm thử của toàn bộ repository (Node.js test runner và Python acceptance runner).
- **Bề mặt hoạt động:** Thư mục `tests/`, `fixtures/`.
- **Đầu vào:** Code mới được triển khai từ `gt-frontend`, `gt-backend`, `gt-data`.
- **Đầu ra:** Test suites mới, báo cáo pass/fail, chỉ số coverage.
- **Quyền hạn công cụ:**
  - Read/Write tools trên `tests/` và `fixtures/`.
  - Thực thi lệnh test (`npm test`, `python3 tests/...`).
- **Ranh giới an toàn:**
  - Tuyệt đối không dùng dữ liệu người thật mang tính PII để làm test fixtures. Phải dùng synthetic data (`fixtures/synthetic_genealogy.json`).
  - Phải duy trì 100% green tests trước khi bàn giao cho AGY tích hợp.

---

### Subagent 7: `gt-design-qa`
- **Tên hiển thị:** Visual & Design QA Specialist
- **Nhiệm vụ:** Vận hành engine Craft Anything để thực hiện kiểm thử tự động trên trình duyệt thật ở 4 kích thước màn hình tiêu chuẩn, đối soát layout drift so với production baseline, kiểm toán khả năng tiếp cận (A11y).
- **Bề mặt hoạt động:** Trình duyệt Chromium CDP, giao diện runtime, ảnh chụp màn hình captures.
- **Đầu vào:** URL local runtime (`http://localhost:3000` hoặc file HTML), ảnh baseline production.
- **Đầu ra:** Báo cáo đo đạc layout boxes, thông số scroll_x, ảnh chụp so sánh trước/sau, kiểm toán A11y.
- **Quyền hạn công cụ:**
  - Toàn quyền truy cập MCP Server `craft-anything` (toolset `browser`, `javascript`, `core`).
  - Quyền ghi ảnh chụp và file kết quả vào thư mục artifact.
- **Tiêu chuẩn nghiệm thu:** Khẳng định 100% không cuộn ngang và tuân thủ chặt chẽ bảng Design Tokens di sản.

