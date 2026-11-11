# MA TRẬN PHÂN QUYỀN TRUY CẬP CRAFT ANYTHING (CRAFT ANYTHING AGENT ACCESS MATRIX)
**Dự án:** Cây Gia Phả — Gia Tộc Trần Trọng Thụ  
**Authority:** Tuấn (Human Final Authority) | Emarald (Architecture Authority)  
**Chief Orchestrator:** AGY  
**Cập nhật:** 06/11/2026 | **Trạng thái:** ACTIVE  

---

## 1. NGUYÊN TẮC BẢO MẬT & PHÂN ĐỊNH CHẾ ĐỘ PHÂN TÍCH

Hệ thống tuân thủ nguyên tắc đặc quyền tối thiểu (Principle of Least Privilege). Không phải mọi subagent đều có quyền truy cập như nhau vào công cụ Craft Anything.

### Phân định Rạch Ròi Hai Chế Độ Hoạt Động Của Craft Anything:
1. **Clean Room Mode (Mặc định — An toàn tuyệt đối):**
   - Chỉ quan sát từ bên ngoài: Kích thước khung hình, bounding boxes, text hiển thị, màu sắc, ảnh chụp màn hình, kiểm toán A11y.
   - Tuyệt đối không đọc file mã nguồn, không can thiệp bộ nhớ hoặc đọc mã nhạy cảm bên trong.
   - Thích hợp cho: Khảo sát các trang web tham chiếu bên ngoài (FamilySearch) và kiểm thử giao diện người dùng đối ngoại.
2. **Deep Mode (`--deep` — Phân tích sâu mã nguồn):**
   - Phân tích cú pháp AST (Abstract Syntax Tree) của toàn bộ 202 file JS nội bộ.
   - Lập bản đồ phụ thuộc, truy vết luồng dữ liệu DataService DIP, phát hiện dead code và event listeners.
   - Chỉ cấp phép cho tác nhân Kiến trúc sư (`gt-architect`) và Kỹ sư An ninh (`gt-security`) trên kho mã nguồn nội bộ.

---

## 2. MA TRẬN PHÂN QUYỀN TRUY CẬP CÔNG CỤ THEO TÁC NHÂN

| Subagent | Quyền MCP Craft Anything | Chế độ cho phép | Toolsets kích hoạt | Quyền Shell / File Write | Mục đích sử dụng cụ thể |
| :--- | :---: | :---: | :--- | :---: | :--- |
| **`AGY`** (Orchestrator) | **TOÀN QUYỀN** | Clean Room + Deep Mode | `core`, `browser`, `javascript`, `projects` | Toàn quyền kiểm soát | Khảo sát tổng thể, kích hoạt toolsets, kiểm soát phiên làm việc. |
| **`gt-architect`** | **CÓ** | **Deep Mode** (Nội bộ) | `core`, `javascript` | **CHỈ ĐỌC (Read-Only)** | Phân tích đồ thị AST, kiểm tra ranh giới 5 Domain Cores, truy vết code mồ côi. |
| **`gt-frontend`** | **CÓ** | Clean Room | `core`, `browser` | Ghi file `src/` | Đo đạc bounding box component, kiểm tra responsive trực quan. |
| **`gt-backend`** | **KHÔNG** | N/A | Không cấp quyền MCP | Ghi file `server/` | Tập trung tối đa vào mã Express và bảo mật API; không cần trình duyệt. |
| **`gt-data`** | **KHÔNG** | N/A | Không cấp quyền MCP | Ghi file `src/js/platform/` | Quản trị CSDL SQLite và DataService; không cần trình duyệt. |
| **`gt-security`** | **CÓ** | Clean Room + Deep Mode | `core`, `browser`, `javascript` | **CHỈ ĐỌC (Read-Only)** | Rà soát mạng ngầm, kiểm tra lộ lọt dữ liệu qua DOM/Network, quét rò rỉ Clara. |
| **`gt-qa`** | **KHÔNG** | N/A | Không cấp quyền MCP | Ghi file `tests/` | Thực thi kiểm thử tự động Node.js & Python thông qua CLI tiêu chuẩn. |
| **`gt-design-qa`** | **CÓ** | **Clean Room** | `core`, `browser`, `application` | Ghi artifacts QA | Tự động hóa chụp màn hình 4 breakpoints, đo `scroll_x`, kiểm toán A11y, đối soát drift. |

---

## 3. DANH MỤC CÁC CÔNG CỤ MCP CHÍNH XÁC ĐƯỢC ỦY QUYỀN

### Nhóm 1: Core Toolset (Đo đạc & Quản trị phiên)
- `core_session_show`: Kiểm tra trạng thái phiên làm việc, target đang mở, số lượng evidence.
- `core_evidence_show`: Tra cứu các bằng chứng định lượng (`ev_...`).
- `core_unknowns_show`: Quản lý danh mục các câu hỏi chưa ngã ngũ cần kiểm chứng.
- `list_toolsets` / `enable_toolset`: Kích hoạt linh hoạt các phân hệ công cụ theo yêu cầu của AGY.

### Nhóm 2: Browser & Inspection Toolset (Kiểm tra giao diện & Mạng)
- Phân tích bố cục đa độ phân giải (`1440px`, `1024px`, `768px`, `375px`).
- Tự động phát hiện lỗi cuộn ngang (`scroll_x`).
- Trích xuất Design Tokens (thang font chữ, màu sắc HEX, spacing pixels).
- Kiểm toán khả năng tiếp cận chuẩn WCAG (alt text, control labels, landmarks).

### Nhóm 3: JavaScript & AST Toolset (Phân tích tĩnh mã nguồn)
- `js-app-map`: Quét toàn bộ mã nguồn JavaScript để dựng đồ thị ứng dụng (modules, endpoints, routes, event listeners).
- Phát hiện dead code và các tệp mồ côi (như đã chứng minh với `member-app.js` và `app-v2.js`).

