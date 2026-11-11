# TÀI LIỆU THIẾT KẾ KIẾN TRÚC: UNIFIED ADMIN CONTROL CENTER (v2.0)
## (HỢP NHẤT HỆ THỐNG QUẢN TRỊ TRUNG TÂM & VIBECODE LAB THEO MÔ HÌNH WORDPRESS ADMIN)

**Mã tài liệu:** `ADMIN_CONTROL_CENTER_ARCHITECTURE_v2.md`  
**Đường dẫn canonical:** `AUDIT/ADMIN_CONTROL_CENTER_ARCHITECTURE_v2.md`  
**Tài liệu tiền nhiệm:** [`AUDIT/ADMIN_CONTROL_CENTER_AUDIT.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/ADMIN_CONTROL_CENTER_AUDIT.md) (v1.0 - Lưu trữ đối soát)  
**Chỉ thị điều hành:** `DIRECTIVE: ADMIN-01 — ARCHITECTURE REFINEMENT (VERSION 2)`  
**Dự án:** CÂY GIA PHẢ — GIA TỘC TRẦN TRỌNG THU (`giatoctrantrongthu.com`)  
**Product Owner / Thẩm quyền tối cao:** Tuấn (Human Final Authority)  
**Thẩm định kiến trúc & Quản trị chất lượng:** Emarald (Strategic Analysis / Quality Control)  
**Cơ quan thực thi:** AGY (Execution Coordinator / Primary Agent)  
**Chế độ khảo sát:** **STRICT READ-ONLY ARCHITECTURE REFINEMENT**  
**Ngày hoàn thành:** 2026-11-03  

---

## 1. TỔNG QUAN ĐIỀU HÀNH (EXECUTIVE SUMMARY)

Bản đặc tả kiến trúc phiên bản 2 (`v2.0`) hoàn thiện và chuẩn hóa toàn diện định hướng **Unified Admin Control Center (Trung tâm Điều hành Quản trị Thống nhất)** cho dự án Gia Tộc Trần Trọng Thu sau khi tiếp thu kết quả thẩm định độc lập từ Emarald và phê duyệt nguyên tắc từ Tuấn.

### 1.1 Tầm Nhìn Sản Phẩm & Định Hướng Cốt Lõi
Hệ thống chấm dứt sự phân mảnh giữa một bên là phân hệ quản trị cũ (`/admin` có backend thật nhưng giao diện và preview sơ sài) và một bên là phòng thí nghiệm thiết kế (`lab.html` có preview 7 bề mặt UI và 6 persona rất mạnh nhưng cô lập hoàn toàn trên mock data). 

Lấy **WordPress Admin** làm mô hình kiến trúc tham chiếu, hệ thống được quy hoạch thành một **Trung tâm Điều hành Duy Nhất** phục vụ 7 mục tiêu điều hành của Tuấn:
1. Quan sát tình trạng tổng thể của sản phẩm di sản dòng họ.
2. Quản trị dữ liệu thực thể và biên tập nội dung mà không phải chạm vào mã nguồn.
3. Quản lý thành viên, định danh gia tộc và phân định quyền hạn theo huyết thống.
4. Kiểm duyệt đóng góp ký ức và yêu cầu đính chính từ con cháu.
5. Quản lý hình ảnh, tư liệu số hóa, ngày kỵ giỗ và xuất bản các ấn phẩm MẠCH.
6. Xem trước trải nghiệm trực tiếp trên 7 bề mặt UI với các góc nhìn persona và độ phân giải khác nhau.
7. Giám sát sức khỏe API, tình trạng CSDL, phiên xác thực và quy trình sao lưu an toàn.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 UNIFIED ADMIN CONTROL CENTER (WORDPRESS MODEL)              │
│                                                                             │
│  ┌──────────────┐  ┌─────────────────────────────────────────────────────┐  │
│  │   SIDEBAR    │  │                   MAIN CONTROL VIEW                 │  │
│  │  NAVIGATION  │  │                                                     │  │
│  │  ──────────  │  │  1. DASHBOARD: Tình trạng di sản, kỵ giỗ, alert     │  │
│  │  Dashboard   │  │  2. NỘI DUNG: Phả hệ, Tư liệu, MẠCH, Lịch, Public   │  │
│  │  Nội dung    │  │  3. CỘNG ĐỒNG: Thành viên, Duyệt bài, Phân quyền   │  │
│  │  Cộng đồng   │  │  4. THIẾT KẾ & LAB: Preview UI, Persona, Viewport   │  │
│  │  Design/Lab  │  │  5. VẬN HÀNH: API Health, CSDL, Sao lưu, Audit Log │  │
│  │  Vận hành    │  │                                                     │  │
│  └──────────────┘  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Ba Trụ Cột Tái Cấu Trúc So Với Phiên Bản v1
1. **Chuẩn hóa Quản trị Bằng chứng (Evidence Governance):** Khắc phục lỗi nhầm lẫn số cấp độ ở v1, áp dụng nghiêm ngặt thang đo 9 trạng thái AIOS chuẩn; loại bỏ các gán nhãn `PROVEN` cảm tính khi mới chỉ thấy mã nguồn hoặc cấu hình khai báo.
2. **Minh định Ranh giới Dữ liệu & Danh tính:** Phân định dứt khoát giữa danh tính quản trị (`admin_users`) và danh tính thành viên (`accounts`); tách biệt tuyệt đối giữa liên kết hồ sơ (*Identity Mapping*) và cấp quyền (*Permission Mapping*); bảo vệ tuyệt đối ranh giới an ninh Thư riêng Clara.
3. **Đánh giá lại Kiến trúc Lưu trữ CMS (DEC-A03):** Bác bỏ phương án coi Git là CMS mặc định cho nội dung công khai; khảo sát Source of Truth thực tế của Homepage & Thẻ Mời Cửa Ngõ; phân định ranh giới lưu trữ giữa Cấu hình hệ thống (Git) và Nội dung biên tập (CMS-managed storage).

---

## 2. ĐỐI SOÁT KẾT QUẢ v1 & CÁC ĐIỀU CHỈNH THEO CHỈ THỊ (REVIEW OF v1 FINDINGS)

Bản v2 kế thừa có chọn lọc các kết quả khảo sát thực chứng của v1 tại [`AUDIT/ADMIN_CONTROL_CENTER_AUDIT.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/ADMIN_CONTROL_CENTER_AUDIT.md), đồng thời sửa chữa các sai lệch kỹ thuật đã được Emarald và Tuấn chỉ ra:

| Hạng Mục v1 | Đánh Giá Của Emarald / Tuấn | Xử Lý & Điều Chỉnh Trong v2 |
| :--- | :--- | :--- |
| **Evidence Governance** | Báo cáo v1 ghi tiêu đề 8 cấp độ nhưng liệt kê 9 trạng thái; gán `PROVEN` cho nhiều tính năng mới chỉ tìm thấy route hoặc component. | **Đã sửa:** Thống nhất chuẩn 9 trạng thái AIOS. Hạ cấp các mục chưa kiểm thử runtime từ `PROVEN` về `CONFIGURED` hoặc `PARTIAL`. |
| **DEC-A01 (Admin Core)** | `APPROVED IN PRINCIPLE`. Cần làm rõ ranh giới trách nhiệm giữa Shell, Domain CMS, Lab Engine, Design System và API; thống nhất quy ước route. | **Bổ sung Mục 5:** Đặc tả ma trận trách nhiệm 5 tầng và quy ước URL Hash chuẩn hóa `#/module/sub-action`. |
| **DEC-A02 (Identity)** | `APPROVED IN PRINCIPLE`. Duy trì riêng `admin_users`, `accounts`, `identity_mappings`. Phải làm rõ Identity Mapping $\neq$ Permission Mapping. | **Bổ sung Mục 6:** Khẳng định `foundation.js` không được cấp quyền tự động; Backend tự xác thực quyền trên từng request. |
| **DEC-A03 (Content Storage)** | `NOT APPROVED / OPEN`. Không chấp thuận lưu toàn bộ text trang chủ trong Git như một CMS. Cần khảo sát SoT và đề xuất mô hình phù hợp. | **Tái cấu trúc Mục 7:** Khảo sát SoT hiện hành; phân định 7 loại dữ liệu; đề xuất 3 mô hình lưu trữ và khuyến nghị Tuấn. Giữ trạng thái `OPEN`. |
| **DEC-A04 (MẠCH Editor)** | `APPROVED IN PRINCIPLE`. Markdown + Split Preview. Cần bổ sung metadata schema, lifecycle, versioning, preview fidelity, HTML sanitization. | **Bổ sung Mục 7.3:** Đặc tả đầy đủ schema bài viết MẠCH, vòng đời Draft/Review/Published và cơ chế khử độc HTML. |
| **Ranh giới Môi trường** | v1 chưa phân định rõ dữ liệu giữa Mock, Staging, Production; có rủi ro rò rỉ Thư Clara. | **Bổ sung Mục 8:** Ma trận cô lập dữ liệu 3 môi trường; cấm tuyệt đối Thư Clara xuất hiện ở Mock/Staging nếu chưa được cấp phép. |
| **Visual Editor** | Đề xuất `editableId, fieldPath` ở v1 tiềm ẩn nguy cơ mass assignment và thiếu allowlist. | **Bổ sung Mục 9:** Thiết lập Allowlist trường được sửa; biến `localStorage` thành client cache phục hồi nháp, không phải SoT. |
| **Bảo mật & Session** | v1 giả định `SameSite: Lax` giải quyết toàn bộ CSRF. | **Bổ sung Mục 10:** Đối chiếu OWASP CSRF Prevention Cheat Sheet; thiết kế bảo vệ đa tầng (Origin header, Sec-Fetch-Site, Anti-CSRF Token). |
| **Backup & Restore** | v1 gộp chung Backup/Restore thành một nút bấm thiếu kiểm soát. | **Bổ sung Mục 11:** Phân tách rõ ràng năng lực Backup (sao lưu) và Restore (phục hồi có chốt chặn thẩm quyền). |
| **Lộ trình Thực hiện** | v1 đưa ra 4 Sprint tĩnh chưa tính toán đúng chuỗi phụ thuộc thực tế. | **Bổ sung Mục 12:** Tái cấu trúc lộ trình dựa trên chuỗi phụ thuộc 7 tầng thực tế. |

---

## 3. CHUẨN MỰC CHỨNG CỨ PHÁP Y (VERIFIED EVIDENCE & EVIDENCE GOVERNANCE)

### 3.1 Hệ Thống Phân Loại 9 Trạng Thái AIOS Chuẩn Hóa
Mọi nhận định kỹ thuật trong tài liệu này bắt buộc sử dụng duy nhất một trong 9 trạng thái sau:
1. `DOCUMENTED`: Chỉ mới xuất hiện trong tài liệu đặc tả, kế hoạch hoặc hướng dẫn; chưa tìm thấy mã nguồn triển khai.
2. `CONFIGURED`: Đã được khai báo trong cấu hình (`.env`, `package.json`, route registry, manifest) nhưng chưa xác minh mã thực thi.
3. `OBSERVED`: Đã quan sát thấy sự tồn tại của tệp mã nguồn, hàm hoặc bảng CSDL trong repository.
4. `TESTED`: Đã chạy kịch bản kiểm thử (unit test, curl, automated script) và có log kết quả xác thực.
5. `PROVEN`: Đã kiểm chứng hoạt động toàn trình từ đầu vào đến đầu ra trên môi trường runtime thực tế với bằng chứng định lượng không thể bác bỏ.
6. `PARTIAL`: Đã triển khai một phần nhưng tính năng chưa hoàn chỉnh, thiếu validate hoặc bị lỗi ở một số nhánh điều kiện.
7. `FAILED`: Đã thử nghiệm runtime nhưng gặp lỗi ngoại lệ, crash hoặc vi phạm tiêu chuẩn nghiệm thu.
8. `BLOCKED`: Bị nghẽn bởi một phụ thuộc kỹ thuật hoặc đang chờ quyết định phê duyệt của Tuấn.
9. `UNKNOWN`: Chưa đủ thông tin hoặc chưa thể tiếp cận để kiểm tra ở chế độ Read-Only hiện tại.

### 3.2 Bảng Kiểm Kê & Bằng Chứng Pháp Y Đã Được Xác Minh Độc Lập

| Thành Phần Hệ Thống | Trạng Thái AIOS | Bằng Chứng Mã Nguồn & Vị Trí (Source Reference) | Phương Pháp Kiểm Tra | Kết Quả Thực Tế & Giới Hạn Kiểm Chứng |
| :--- | :---: | :--- | :--- | :--- |
| **Shell Bố Cục `/admin`** | `OBSERVED` | [`admin/index.html:11-51`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/admin/index.html#L11-L51), [`admin/css/admin.css:21-45`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/admin/css/admin.css#L21-L45) | Đọc mã nguồn HTML/CSS | Đã có layout 2 cột: Sidebar trái (240px) và `#main-view` phải. Hỗ trợ 4 nhóm: Dashboard, Hộp thư, Kho tri thức, Quản trị. Giới hạn: Chưa nạp tokens vNEXT. |
| **Phiên Session Cookie** | `PARTIAL` | [`server/index.js:62-74`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/index.js#L62-L74) | Đọc cấu hình `express-session` | Cookie `sid`, `httpOnly: true`, `sameSite: 'lax'`, `maxAge: 24h`. Giới hạn: `secret` dùng giá trị mặc định thiếu an toàn nếu thiếu `.env`; thiếu cơ chế chống CSRF độc lập. |
| **Xác thực Đăng nhập & RBAC** | `TESTED` | [`server/auth.js:8-87`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/auth.js#L8-L87) | Đọc logic route & test curl | `requireAuth` và `requireOwner` kiểm tra phiên qua session memory. Bảng `admin_users` chứa 3 user. Giới hạn: Session lưu in-memory (`MemoryStore`), mất phiên khi server khởi động lại. |
| **Quản trị Nhân sự (`people`)** | `PARTIAL` | [`admin/js/admin.js:123-274`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/admin/js/admin.js#L123-L274), API `POST /api/people` | Đọc mã nguồn client & server | Danh sách nạp 223 hồ sơ từ SQLite; có typeahead chọn quan hệ cha/mẹ/vợ/chồng. Giới hạn: Chưa có nhãn nhận thức Epistemic, chưa có giao diện quản lý cây gia đình `families`. |
| **Quản trị MẠCH (`stories`)** | `PARTIAL` | [`admin/js/admin.js:275-405`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/admin/js/admin.js#L275-L405), API `POST /api/stories` | Đọc mã nguồn client & server | Form nhập tiêu đề, tác giả, nội dung thô vào textarea, gắn edge `MENTION`. Giới hạn: Không có preview Markdown, không quản lý chuyên đề/series, lưu thô không sanitize HTML. |
| **Quản trị Tư liệu (`media`)** | `OBSERVED` (DB) / `FAILED` (UI) | [`server/family_archive.db:media`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/family_archive.db) (185 bản ghi), [`admin/js/admin.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/admin/js/admin.js) | Truy vấn CSDL SQLite & đối soát JS | CSDL có sẵn 185 file media và bảng liên kết `person_media`. Tuy nhiên trên `/admin` **hoàn toàn không có code giao diện Media Manager**. |
| **Vibecode Lab Engine** | `OBSERVED` | [`lab.html`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/lab.html), [`src/js/ui/lab.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/lab.js) | Đọc mã nguồn UI vNEXT | Đang chạy tại cổng 8888, render 7 bề mặt UI vNEXT, 6 persona, 5 viewport, nạp dữ liệu từ `fixtures/`. Giới hạn: Chạy hoàn toàn trên mock memory, tách biệt khỏi server 3000. |
| **Sửa Nhanh trong Lab (Visual Editor)** | `FAILED` | [`AUDIT/VIBECODE_VISUAL_EDITOR_NAVIGATOR_AUDIT.md:72-115`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/VIBECODE_VISUAL_EDITOR_NAVIGATOR_AUDIT.md#L72-L115) | Đối chiếu báo cáo pháp y Playwright | Bật `contenteditable="true"` cục bộ. Reload hoặc đổi view là mất sạch dữ liệu (Zero Persistence). Không có API lưu trữ. |
| **Source of Truth Homepage** | `OBSERVED` | [`src/js/ui/public-home.js:30-290`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/public-home.js#L30-L290) | Đọc mã nguồn giao diện công khai | Toàn bộ câu chữ Định vị, 4 câu hỏi nghiên cứu, 5 nhóm nội dung công bố đang được gán cứng (hardcoded) trong mã nguồn JavaScript. |
| **Source of Truth Thẻ Mời Cửa Ngõ** | `DOCUMENTED` | [`AUDIT/MASTER_COMPLETION_PLAN.md:332`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/MASTER_COMPLETION_PLAN.md#L332) (Mã `W-B01-01`) | Đối chiếu lộ trình & tìm kiếm codebase | Mới chỉ được định nghĩa như một hạng mục cần làm ở Batch 01. Chưa có component hay file lưu trữ nào trong repo. |

---

## 4. KIẾN TRÚC MỤC TIÊU & MÔ HÌNH VẬN HÀNH (TARGET ARCHITECTURE)

Trung tâm Quản trị Thống nhất được thiết kế theo nguyên tắc phân tầng chặt chẽ, bảo đảm việc phân tách rõ ràng giữa **Lớp Trình Diễn (Presentation)**, **Lớp Điều Hướng & Kiểm Soát (Control Plane)**, **Lớp Dịch Vụ Nghiệp Vụ (API Services)** và **Lớp Lưu Trữ Dữ Liệu (Data Layer)**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          UNIFIED ADMIN CONTROL CENTER                       │
│                        (Mounted at http://host/admin)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│  1. PRESENTATION & SHELL LAYER                                              │
│     ├── Admin Shell (Sidebar Nav, Topbar Environment Banner, User Header)   │
│     ├── Shared Design Tokens (src/css/foundation/foundation.css)            │
│     └── Main Workspace Container (#main-view)                               │
├─────────────────────────────────────────────────────────────────────────────┤
│  2. DOMAIN CONTROL MODULES (Mounted inside #main-view via Hash Router)      │
│     ├── mod-dashboard  ──► Tổng quan di sản, sự kiện cận kề, metric         │
│     ├── mod-genealogy  ──► Quản lý Hồ sơ nhân vật, Gia đình, Cây huyết thống│
│     ├── mod-media      ──► Quản lý Thư viện 185+ tư liệu, ảnh, văn tự       │
│     ├── mod-editorial  ──► Soạn thảo MẠCH (Markdown + Split Preview)        │
│     ├── mod-calendar   ──► Quản lý Lịch dòng họ, ngày kỵ giỗ gia tiên       │
│     ├── mod-public-cms ──► Biên tập nội dung Trang chủ & Thẻ Mời Cửa Ngõ    │
│     ├── mod-community  ──► Quản lý Tài khoản thành viên & Hộp thư đóng góp  │
│     ├── mod-lab        ──► Vibecode Lab Engine (Preview 7 Bề mặt UI)        │
│     └── mod-system     ──► Giám sát Sức khỏe, Sao lưu vật lý, Audit Logs    │
├─────────────────────────────────────────────────────────────────────────────┤
│  3. API SERVICES & GOVERNANCE LAYER (Node.js / Express 5)                   │
│     ├── Security Gateways: CSRF Guard + Rate Limiter + Origin Validator     │
│     ├── Auth Middleware: Session Authenticator (requireAuth)                │
│     ├── Authorization Engine: RBAC (admin_users) & ReBAC (accounts)         │
│     └── Domain Endpoints: /api/admin/* (REST JSON strictly)                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  4. DATA PERSISTENCE & ARCHIVE LAYER                                        │
│     ├── Structured Git Config (Cấu hình hệ thống, Tokens, Nav Defaults)    │
│     ├── CMS Storage (Nội dung biên tập Trang chủ, Thẻ Mời, Bản thảo nháp)   │
│     ├── Relational Database (SQLite / MariaDB: Danh tính, Phả hệ, Tư liệu)  │
│     └── Encrypted Off-site Vault (Kho lưu trữ bản sao lưu vật lý độc lập)   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. ADMIN SHELL, QUY ƯỚC ĐIỀU HƯỚNG & RANH GIỚI MODULE (ADMIN SHELL & BOUNDARIES)

### 5.1 Phân Định Trách Nhiệm 5 Thành Phần Kiến Trúc
Tuân thủ chỉ đạo `DEC-A01`, 5 thành phần sau đây có ranh giới trách nhiệm tuyệt đối không chồng lấn:

1. **Admin Shell (`admin/index.html`, `admin/js/shell.js`):**
   - Trách nhiệm: Quản lý layout khung ngoài, header định danh người dùng, thanh thông báo trạng thái môi trường (`LOCAL_DEV` / `STAGING` / `PRODUCTION`), sidebar điều hướng cấp 1 và cấp 2, và bộ định tuyến URL hash (`hashchange`).
   - Cấm: Không chứa logic nghiệp vụ của từng domain; không truy vấn trực tiếp CSDL.
2. **Domain CMS Modules (`admin/js/modules/*`):**
   - Trách nhiệm: Cung cấp giao diện biên tập cho từng nghiệp vụ (Genealogy, Media, Editorial, Calendar, Community, System). Mỗi module là một ES Module độc lập có vòng đời: `mount(container, context)`, `render()`, `unmount()`.
   - Cấm: Không gọi trực tiếp SQL; bắt buộc giao tiếp thông qua client API client (`admin/js/api.js`).
3. **Vibecode Lab Engine (`src/js/ui/lab.js` tích hợp):**
   - Trách nhiệm: Đóng vai trò là công cụ xem trước trực quan (Preview Engine) và giả lập môi trường người dùng (Persona / Viewport Switcher) bên trong Admin.
   - Cấm: Không được trở thành một hệ thống quản trị song song; không tự ý ghi dữ liệu vào CSDL thật nếu đang ở chế độ Mock.
4. **Design System Foundation (`src/css/foundation/`):**
   - Trách nhiệm: Nguồn chân lý duy nhất (Single Source of Truth) về tokens màu sắc, kiểu chữ (`typography.css`), biến bố cục (`layout.css`) và các thành phần giao diện dùng chung (`components.css`).
   - Cấm: Admin Shell không tự định nghĩa lại các mã màu hoặc font chữ riêng biệt tách rời khỏi hệ quy chuẩn nhận diện của gia tộc.
5. **Backend API (`server/index.js`, `server/auth.js`...):**
   - Trách nhiệm: Điểm kiểm soát an ninh tối cao. Kiểm tra phiên, xác thực quyền hạn trên từng request, validate dữ liệu đầu vào, thực thi truy vấn CSDL và trả về kết quả JSON chuẩn hóa.
   - Cấm: Tuyệt đối không tin tưởng client; không cho phép frontend bypass quyền kiểm tra.

### 5.2 Quy Ước Route Thống Nhất Cho Toàn Bộ Trung Tâm Quản Trị
Hệ thống sử dụng cơ chế **Hash Routing phân cấp 2 tầng** (`#/domain/action/id`) để hoạt động tương thích hoàn hảo cả trên local server lẫn triển khai file tĩnh (static hosting) mà không bị phụ thuộc vào cấu hình rewrite của web server:

| Cấu Trúc Hash Route | Module Phụ Trách | Quyền Hạn Tối Thiểu | Mục Đích Nghiệp Vụ | Trạng Thái Bảo Toàn / Chuyển Đổi Từ v1 |
| :--- | :--- | :---: | :--- | :--- |
| `#/` hoặc `#/dashboard` | `mod-dashboard` | `editor` | Bảng tin tổng quan, thông số di sản, kỵ giỗ cận kề | **Bảo toàn** route `#/` hiện có của `/admin` |
| `#/genealogy` | `mod-genealogy` | `editor` | Danh sách 223 hồ sơ nhân vật & lọc theo chi | **Chuyển đổi** từ route `#/people` cũ |
| `#/genealogy/person/:id` | `mod-genealogy` | `editor` | Form chi tiết chỉnh sửa hồ sơ nhân vật | **Chuyển đổi** từ route `#/people/:id` cũ |
| `#/genealogy/families` | `mod-genealogy` | `editor` | Quản lý quan hệ gia đình & phả đồ nhánh | **Mới bổ sung** (v1 bị thiếu) |
| `#/media` | `mod-media` | `editor` | Thư viện 185 tư liệu ảnh, văn tự gia phả | **Mới bổ sung** (v1 bị thiếu UI) |
| `#/media/upload` | `mod-media` | `editor` | Tải lên tư liệu mới & gán thẻ nhân vật | **Mới bổ sung** |
| `#/editorial` | `mod-editorial` | `editor` | Danh sách các bài viết & ký ức MẠCH | **Chuyển đổi** từ route `#/stories` cũ |
| `#/editorial/new` | `mod-editorial` | `editor` | Soạn thảo bài viết mới (Markdown Editor) | **Chuyển đổi** từ `#/stories/new` |
| `#/editorial/edit/:id` | `mod-editorial` | `editor` | Chỉnh sửa bản thảo bài viết có lưu nháp | **Chuyển đổi** từ `#/stories/:id` |
| `#/calendar` | `mod-calendar` | `editor` | Quản lý lịch gia tộc & ngày kỵ giỗ | **Chuyển đổi** từ route `#/events` cũ |
| `#/content/public` | `mod-public-cms`| `owner` | Biên tập chuỗi chữ Trang chủ & Thẻ Mời | **Mới bổ sung** (Theo chỉ đạo DEC-A03) |
| `#/community/members` | `mod-community` | `owner` | Quản trị tài khoản con cháu (`accounts`) | **Mới bổ sung** (v1 bị thiếu) |
| `#/community/inbox` | `mod-community` | `editor` | Hộp thư tiếp nhận ký ức & đính chính | **Chuyển đổi** từ route `#/inbox` cũ |
| `#/community/admins` | `mod-community` | `owner` | Quản trị tài khoản Admin (`admin_users`) | **Chuyển đổi** từ route `#/users` cũ |
| `#/lab/preview` | `mod-lab` | `editor` | Nhúng Vibecode Lab xem trước 7 Bề mặt UI | **Mới tích hợp** từ `lab.html` độc lập |
| `#/lab/tokens` | `mod-lab` | `editor` | Tra cứu bảng mã màu, font và design tokens | **Mới tích hợp** |
| `#/system/health` | `mod-system` | `owner` | Bảng giám sát sức khỏe API & kết nối CSDL | **Mới bổ sung** |
| `#/system/database` | `mod-system` | `owner` | Xem sơ đồ cấu trúc bảng CSDL | **Bảo toàn** route `#/database` cũ |
| `#/system/backup` | `mod-system` | `owner` | Kích hoạt sao lưu vật lý & xem lịch sử backup| **Mới bổ sung** (Theo chỉ đạo Mục 5.5) |
| `#/system/audit-logs` | `mod-system` | `owner` | Xem nhật ký kiểm toán hoạt động biên tập | **Mới bổ sung** (Theo chỉ đạo Mục 5.6) |

---

## 6. KIẾN TRÚC ĐỊNH DANH & PHÂN QUYỀN (IDENTITY & AUTHORIZATION ARCHITECTURE)

### 6.1 Mô Hình Danh Tính Độc Lập (DEC-A02 Approved in Principle)
Tuân thủ nguyên tắc bảo vệ an toàn hệ thống, dự án **duy trì 3 thực thể danh tính độc lập trong CSDL SQLite/MariaDB**, không gộp chung bảng:

```
┌─────────────────────────┐         ┌─────────────────────────┐         ┌─────────────────────────┐
│       admin_users       │         │        accounts         │         │         people          │
├─────────────────────────┤         ├─────────────────────────┤         ├─────────────────────────┤
│ id (PK)                 │         │ id (PK)                 │         │ id (PK, ví dụ: @I115@)  │
│ username (UNIQUE)       │         │ email (UNIQUE)          │         │ name                    │
│ password_hash (Bcrypt)  │         │ username (UNIQUE)       │         │ birthYear / deathYear   │
│ role (owner / editor)   │         │ password_hash (Bcrypt)  │         │ gender                  │
│ is_active (1 / 0)       │         │ role (member / guest)   │         │ notes / payload         │
│ created_at / last_login │         │ status (ACTIVE / ...)   │         │ status                  │
└─────────────────────────┘         └────────────┬────────────┘         └────────────▲────────────┘
                                                 │                                   │
                                                 │   ┌───────────────────────────┐   │
                                                 └───►     identity_mappings     ├───┘
                                                     ├───────────────────────────┤
                                                     │ account_id (PK)           │
                                                     │ person_id (PK)            │
                                                     │ mapped_at / mapped_by     │
                                                     └───────────────────────────┘
```

### 6.2 Phân Biệt Tuyệt Đối Giữa Identity Mapping Và Permission Mapping
1. **Identity Mapping (Liên Kết Nhân Thân):**
   - Chỉ trả lời câu hỏi: *"Tài khoản đăng nhập này là ai trên cây gia phả?"* (Ví dụ: Tài khoản `tuantq` đại diện cho nhân vật `@I115@ - Gioan Baotixita Trần Quốc Tuấn`).
   - Đây thuần túy là dữ liệu liên kết nhân thân phục vụ việc xưng hô, hiển thị vị trí trên phả đồ và gửi lời chúc mừng sinh nhật/bổn mạng.
2. **Permission Mapping (Cấp Quyền Hệ Thống):**
   - Trả lời câu hỏi: *"Tài khoản này được phép Đọc (Read), Sửa (Write) hay Phê duyệt (Approve) những tài nguyên nào?"*
   - **Quy tắc bất khả xâm phạm:** Việc liên kết tài khoản vào một nhân vật danh giá hoặc tiền nhân **hoàn toàn KHÔNG tự động mang lại quyền quản trị**. Quyền hạn phải do hệ thống phân quyền quy định độc lập.
3. **Vị Trí Của `foundation.js`:**
   - Trong kiến trúc chuẩn, `foundation.js` **chỉ là script khởi tạo cấu trúc bảng (DDL) ban đầu**, tuyệt đối **không được can thiệp vào luồng xác thực (Authentication) hoặc tự động cấp quyền (Authorization)** trong runtime.

### 6.3 Phân Tầng Phân Quyền: RBAC vs ReBAC
Hệ thống áp dụng mô hình phân quyền đa tầng:

```
                      MÔ HÌNH PHÂN QUYỀN ĐA TẦNG (MULTI-TIER ACCESS CONTROL)
                      
   [ YÊU CẦU TRUY CẬP TỪ CLIENT ]
                 │
                 ▼
   ┌───────────────────────────┐
   │ 1. AUTHENTICATION GATE    │  ──► Có phiên đăng nhập hợp lệ không? (Session sid)
   └─────────────┬─────────────┘
                 │ Hợp lệ
                 ▼
   ┌───────────────────────────┐
   │ 2. SYSTEM RBAC GATE       │  ──► Tài khoản thuộc nhóm quản trị nào?
   │    (Role-Based Control)   │      - Role 'owner': Toàn quyền quản trị hệ thống & nội dung
   └─────────────┬─────────────┘      - Role 'editor': Quyền biên tập nội dung được giao
                 │ Quyền thành viên   - Role 'member': Chuyển tiếp sang tầng ReBAC
                 ▼
   ┌───────────────────────────┐
   │ 3. KINSHIP ReBAC GATE     │  ──► Mối quan hệ thân tộc với tài nguyên là gì?
   │ (Relationship-Based)      │      - Bản thân (Self): Quyền sửa thông tin liên hệ, tiểu sử
   └─────────────┬─────────────┘      - Cha mẹ / Con cái: Quyền đề xuất bổ sung ảnh, sự kiện
                 │                    - Trưởng nhánh / Chi: Quyền duyệt bài viết nhánh của mình
                 ▼                    - Người ngoài / Chi khác: Chỉ đọc thông tin công khai
   ┌───────────────────────────┐
   │ 4. RESOURCE & FIELD GATE  │  ──► Kiểm tra nhãn bảo mật tài nguyên & quyền trên từng trường:
   │ (Resource & Field Level)  │      - Tài nguyên Clara / Kỷ vật riêng tư: Yêu cầu quyền đặc biệt
   └───────────────────────────┘      - Thuộc tính nhạy cảm (ngày sinh người còn sống): Giấu mặc định
```

### 6.4 Ma Trận Phân Quyền Sơ Bộ (Preliminary Permission Matrix)

| Ngữ Cảnh Thao Tác | Khách Vãng Lai (Guest) | Thành Viên Ngoại Tộc / Chi Khác | Thành Viên Trực Hệ (Cha/Mẹ/Con) | Trưởng Nhánh / Chi Tộc | Biên Tập Viên (`editor`) | Chủ Quản Gia Tộc (`owner`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Xem Trang chủ & Giới thiệu** | `ALLOW` | `ALLOW` | `ALLOW` | `ALLOW` | `ALLOW` | `ALLOW` |
| **Xem Phả đồ & Hồ sơ cơ bản** | `GATEWAY` (Thẻ Mời) | `ALLOW` (Tên, Đời) | `ALLOW` (Đầy đủ) | `ALLOW` (Đầy đủ) | `ALLOW` (Đầy đủ) | `ALLOW` (Đầy đủ) |
| **Xem Ngày sinh/SĐT người sống** | `DENIED` | `DENIED` | `ALLOW` | `ALLOW` | `ALLOW` | `ALLOW` |
| **Xem Thư riêng Clara / Tư liệu kín**| `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `ALLOW` (Duy nhất Tuấn) |
| **Sửa Hồ sơ cá nhân của mình** | `DENIED` | `ALLOW` (Email, SĐT) | `ALLOW` (Tiểu sử) | `ALLOW` (Đầy đủ) | `ALLOW` | `ALLOW` |
| **Sửa Hồ sơ người thân trong nhánh**| `DENIED` | `DENIED` | `PROPOSE_ONLY` | `PROPOSE_ONLY` | `ALLOW` | `ALLOW` |
| **Sửa Quan hệ huyết thống (Edges)** | `DENIED` | `DENIED` | `DENIED` | `PROPOSE_ONLY` | `ALLOW` | `ALLOW` |
| **Đăng bài viết / Ký ức MẠCH** | `DENIED` | `SUBMIT_DRAFT` | `SUBMIT_DRAFT` | `SUBMIT_DRAFT` | `ALLOW` (Lưu nháp/Sửa)| `PUBLISH` (Duyệt xuất bản) |
| **Tải ảnh lên Thư viện Tư liệu** | `DENIED` | `SUBMIT_DRAFT` | `SUBMIT_DRAFT` | `ALLOW` (Nhánh mình) | `ALLOW` | `ALLOW` |
| **Xem Nhật ký kiểm toán & Sao lưu** | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `DENIED` | `ALLOW` (Duy nhất Owner)|

---

## 7. KIẾN TRÚC CMS & LƯU TRỮ NỘI DUNG (CMS & CONTENT STORAGE ARCHITECTURE)

### 7.1 Phân Định Ranh Giới 7 Nhóm Dữ Liệu
Tuân thủ chỉ đạo của Tuấn tại Mục 4, hệ thống bác bỏ việc sử dụng Git như một CMS mặc định cho nội dung công khai, phân định dứt khoát vị trí lưu trữ của 7 nhóm dữ liệu:

| Nhóm Dữ Liệu | Ví Dụ Cụ Thể | Định Hướng Lưu Trữ | Lý Do Kiến Trúc |
| :--- | :--- | :---: | :--- |
| **1. System Configuration** | Port, Database connection strings, Session Secret, CORS origin | **Git & Environment Files** (`.env`, `config.json`) | Thuộc về hạ tầng vận hành, thay đổi theo môi trường triển khai. |
| **2. Design Tokens** | Bảng màu (`--color-surface-primary`), typography, spacing scale | **Git / CSS Files** (`src/css/foundation/`) | Quy chuẩn thương hiệu bất biến của gia tộc, cần kiểm soát phiên bản code nghiêm ngặt. |
| **3. Navigation Defaults** | Cấu trúc menu mặc định: Trang chủ, Mạch, Phả hệ, Lịch họ | **Git Code Constants** (`src/js/ui/shell.js`) | Bộ khung điều hướng ứng dụng nền tảng. |
| **4. Homepage Copy** | Lời mở đầu, Định vị không gian, 4 câu hỏi nghiên cứu, mô tả các mục | **CMS-managed Storage** (Bảng CSDL hoặc JSON Registry qua API) | Cần cho phép Tuấn biên tập câu chữ trực tiếp trên giao diện Admin mà không cần đụng code. |
| **5. Invitation Card Content**| Lời mời con cháu, thông điệp bảo vệ quyền riêng tư, cách thức liên hệ | **CMS-managed Storage** | Nội dung thông điệp ngoại giao, cần tinh chỉnh văn phong linh hoạt. |
| **6. Editorial Drafts** | Bản thảo bài viết MẠCH, ghi chép ký ức đang viết dở, nháp sửa hồ sơ | **CMS-managed Storage** | Cần lưu trữ tạm thời, có phiên bản lịch sử và không ảnh hưởng dữ liệu công bố. |
| **7. Published Content** | Bài viết MẠCH đã duyệt, hồ sơ nhân sự, dữ liệu gia phả chính thức | **CMS / API Database** (SQLite / MariaDB) | Nguồn chân lý tri thức chính thức, phục vụ truy vấn và xuất bản có kiểm soát. |

### 7.2 Khảo Sát & Đề Xuất Mô Hình Lưu Trữ Cho Homepage Copy (DEC-A03 Open)

#### Hiện trạng Source of Truth của Homepage Copy:
Khảo sát pháp y xác nhận 100% nội dung Trang chủ hiện tại đang bị **gán cứng (hardcoded)** trong hàm `renderPublicHome` tại [`src/js/ui/public-home.js:30-290`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/public-home.js#L30-L290). Mỗi khi muốn thay đổi một câu giới thiệu, nhà phát triển bắt buộc phải mở file `.js`, sửa chuỗi string trong mã nguồn và deploy lại. Điều này vi phạm nguyên tắc *"Quản trị nội dung mà không phải sửa code"* của Tuấn.

#### So Sánh 3 Phương Án Lưu Trữ Cho DEC-A03:

| Tiêu Chí So Sánh | Phương Án 1: File JSON Cấu Trúc Qua API (`content/public_home.json`) | Phương Án 2: Bảng CSDL Key-Value Trong SQLite (`cms_content`) | Phương Án 3: Bảng CSDL Tài Liệu Có Schema (`cms_documents`) |
| :--- | :--- | :--- | :--- |
| **Bản chất kỹ thuật** | Lưu thành file JSON tĩnh; Backend cung cấp API đọc/ghi có kiểm tra quyền Owner. | Tạo bảng `cms_content (key TEXT PK, value TEXT, updated_at TEXT, updated_by TEXT)`. | Tạo bảng `cms_documents (doc_id TEXT PK, section TEXT, content_json TEXT, version INT)`. |
| **Ưu điểm** | - Dễ so sánh lịch sử thay đổi (diff) trên Git.<br>- Nạp dữ liệu cực nhanh.<br>- Không cần chạy migration CSDL. | - Quen thuộc với mô hình CSDL quan hệ.<br>- Dễ dàng thêm từng cặp key-value lẻ. | - Cấu trúc chặt chẽ theo từng Section.<br>- Hỗ trợ lưu nhiều phiên bản lịch sử (Versioning).<br>- Tự nhiên với dữ liệu lồng nhau (nested). |
| **Nhược điểm** | - Xung đột ghi đồng thời (race condition) nếu có nhiều người sửa cùng lúc.<br>- Khó rollback từng trường riêng lẻ. | - Khó quản lý các dữ liệu phân cấp phức tạp (như danh sách 4 câu hỏi nghiên cứu gồm no, title, desc). | - Cần thiết kế schema DDL ban đầu.<br>- Cần hàm parse JSON trong backend. |
| **Độ phức tạp** | Rất thấp | Thấp | Trung bình |
| **Mức độ rủi ro** | Rủi ro ghi đè file nếu không có locking | Rủi ro phân mảnh dữ liệu text | Rủi ro parse schema nếu JSON lỗi |
| **Khuyến nghị AGY** | Khả thi cho bản thử nghiệm | Không khuyến nghị | **KHUYẾN NGHỊ LỰA CHỌN** |

> **Khuyến Nghị Của AGY:** Tuấn nên chọn **Phương Án 3 (`cms_documents`)**. Việc lưu theo Document Section trong SQLite vừa bảo đảm tính toàn vẹn của cấu trúc văn bản phân cấp (Section Hero, Section Vấn Đề Quan Tâm, Section Thẻ Mời), vừa hỗ trợ lưu vết lịch sử phiên bản (Versioning) để có thể khôi phục (Rollback) khi Tuấn muốn đổi lại văn phong cũ.  
> **Trạng thái:** `DEC-A03: OPEN — CHỜ TUẤN RA QUYẾT ĐỊNH CUỐI CÙNG`.

### 7.3 Kiến Trúc Soạn Thảo Cho Không Gian MẠCH (DEC-A04 Approved in Principle)
Tuân thủ quyết định phê duyệt nguyên tắc `DEC-A04`, phân hệ biên tập MẠCH được thiết kế theo mô hình **Markdown Editor + Split Preview song song**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ MOD-EDITORIAL: SOẠN THẢO BÀI VIẾT MẠCH (MARKDOWN + SPLIT PREVIEW)           │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ 📝 CỘT TRÁI: SOẠN THẢO MARKDOWN      │ 👁️ CỘT PHẢI: PREVIEW THỜI GIAN THỰC │
│                                      │ (Hiển thị 100% chuẩn Design Tokens)  │
│ [ Tiêu đề: Ký ức về Cụ Cố Thu ]      │ # Ký ức về Cụ Cố Thu                 │
│                                      │                                      │
│ ## 1. Những ngày đầu lập nghiệp      │ 1. Những ngày đầu lập nghiệp         │
│ Vào những năm 1950, nếp nhà xưa...   │ Vào những năm 1950, nếp nhà xưa...   │
│                                      │                                      │
│ Gắn thẻ: [@I115@ - Tuấn] [Media #42] │ [ Thẻ liên kết: Tuấn · Ảnh kỷ vật ]  │
├──────────────────────────────────────┴──────────────────────────────────────┤
│ ⚙️ METADATA & ĐIỀU KHIỂN:                                                    │
│ Trạng thái: [ DRAFT ▼ ] · Tác giả: Tuấn · Chuyên đề: Mạch Nguồn Dòng Họ      │
│ [ Lưu Nháp Tự Động: Đã lưu 2 phút trước ]   [ Nộp Duyệt ]   [ Xuất Bản ]    │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Các Đặc Tả Kiến Trúc Bắt Buộc Của Editor MẠCH:
1. **Metadata Schema Chuẩn:**
   - `id`: Mã bài viết duy nhất (`UUID` hoặc `mach_slug`).
   - `title`: Tiêu đề bài viết.
   - `author`: Tác giả / Nguồn ký ức.
   - `series_id`: Chuyên đề / Tập san trực thuộc.
   - `status`: Vòng đời bản thảo (`DRAFT` $\rightarrow$ `IN_REVIEW` $\rightarrow$ `PUBLISHED` $\rightarrow$ `ARCHIVED`).
   - `content_md`: Nội dung văn bản thuần Markdown.
   - `linked_people`: Mảng ID các nhân vật xuất hiện trong bài (`edges`).
   - `linked_media`: Mảng ID các hình ảnh tư liệu minh họa đính kèm.
   - `version`: Số phiên bản tăng dần (`1, 2, 3...`).
   - `created_at`, `updated_at`, `published_at`.
2. **Khử Độc HTML & Ngăn Chặn XSS:**
   - Khi chuyển đổi Markdown sang HTML ở cột xem trước hoặc khi xuất bản, **bắt buộc chạy qua thư viện sanitize an toàn (như DOMPurify)** với cấu hình nghiêm ngặt:
   - Cấm hoàn toàn các thẻ thực thi: `<script>`, `<iframe>`, `<object>`, `<embed>`, `<form>`.
   - Cấm các thuộc tính nguy hiểm: `onload`, `onerror`, `onclick`, `javascript:...`.
3. **Cơ Chế Phục Hồi Bản Thảo (Draft Auto-Recovery):**
   - Phía Client: Cứ mỗi 15 giây, nội dung đang soạn thảo được lưu tạm vào `localStorage` có gắn khóa `draft_mach_{id}_{userId}` để chống mất dữ liệu khi mất mạng hoặc tắt nhầm tab.
   - Phía Server: Nút "Lưu Nháp" gọi API `POST /api/admin/stories` lưu trạng thái `DRAFT` vào CSDL thật.

---

## 8. RANH GIỚI MÔI TRƯỜNG & QUẢN TRỊ DỮ LIỆU (MOCK / STAGING / PRODUCTION)

Để bảo đảm an toàn dữ liệu và tuân thủ nghiêm ngặt quyền riêng tư, hệ thống xác lập ma trận cách ly 3 môi trường:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MA TRẬN CÁCH LY 3 MÔI TRƯỜNG VẬN HÀNH                    │
├─────────────────┬─────────────────────────┬───────────────────┬─────────────┤
│ TIÊU CHÍ        │ MÔI TRƯỜNG MOCK (LAB)   │ MÔI TRƯỜNG STAGING│ PRODUCTION  │
├─────────────────┼─────────────────────────┼───────────────────┼─────────────┤
│ **Mục đích**    │ Prototyping, thử nghiệm │ Kiểm thử tích hợp │ Vận hành    │
│                 │ giao diện, test tokens  │ toàn trình (E2E)  │ chính thức  │
├─────────────────┼─────────────────────────┼───────────────────┼─────────────┤
│ **Nguồn dữ liệu**│ 100% Synthetic Fixtures │ Dữ liệu che mờ    │ CSDL thật   │
│                 │ (`fixtures/*.json`)     │ (Sanitized Data)  │ SQLite/Maria│
├─────────────────┼─────────────────────────┼───────────────────┼─────────────┤
│ **Thông tin PII**│ TUYỆT ĐỐI KHÔNG (Clean) │ ĐÃ CHE MỜ (Masked)│ CÓ BẢO MẬT  │
├─────────────────┼─────────────────────────┼───────────────────┼─────────────┤
│ **Thư Clara**   │ BẢN MÔ PHỎNG GIẢ LẬP    │ KHÔNG ĐƯỢC XUẤT   │ CHỈ OWNER   │
│                 │ (synthetic_clara.json)  │ HIỆN (Bị chặn)    │ MỚI ĐƯỢC XEM│
├─────────────────┼─────────────────────────┼───────────────────┼─────────────┤
│ **Xác thực API**│ Mock Persona Switcher   │ Phiên Session thật│ Phiên thật  │
│                 │ (Giả lập client-side)   │ (Test Account)    │ (Bảo mật cao│
├─────────────────┼─────────────────────────┼───────────────────┼─────────────┤
│ **Ghi vào DB**  │ BỊ CẤM HOÀN TOÀN        │ Ghi vào Test DB   │ Ghi qua API │
│                 │ (Read-only in memory)   │ riêng biệt        │ đã kiểm duyệt│
└─────────────────┴─────────────────────────┴───────────────────┴─────────────┘
```

### Các Quy Tắc Bảo Vệ Dữ Liệu Bắt Buộc:
1. **Không bypass Backend Authorization:** Bộ chọn Persona (`Persona Switcher`) trong Lab chỉ có tác dụng giả lập giao diện phía client. Khi Admin chuyển sang chế độ kết nối API thật, mọi request đều phải được Backend thẩm định quyền hạn thực tế; Persona Switcher không thể cấp thêm quyền truy cập cho user.
2. **Cô lập Thư riêng Clara:** Thư gửi Clara và các hình ảnh riêng tư thân mật tuyệt đối không được đưa vào tệp fixture công khai hoặc môi trường Staging nếu chưa có cơ chế cấp quyền riêng biệt do Tuấn phê duyệt bằng văn bản.
3. **Cơ chế Ngắt Mạch (Circuit Breaker):** Frontend Admin Shell kiểm tra biến cờ `isMockMode`. Nếu cờ bật, toàn bộ các hàm gọi API ghi (`POST`, `PUT`, `DELETE`) bị vô hiệu hóa ở tầng adapter để ngăn chặn việc gửi dữ liệu giả lập vào CSDL thật.

---

## 9. TÍCH HỢP VIBECODE LAB & KIẾN TRÚC VISUAL EDITOR

### 9.1 Cơ Chế Nhúng Vibecode Lab Vào Route `#/lab/preview`
Vibecode Lab được tích hợp vào Admin dưới dạng một **Không Gian Trải Nghiệm (Experience Studio)**:
- Shell Admin giữ nguyên thanh điều hướng Sidebar bên trái.
- Khung `#main-view` nạp thanh điều khiển Studio của Lab: Bộ chọn 7 Bề mặt UI (`Cổng vào`, `Của tôi`, `Phả đồ`, `Hồ sơ`, `MẠCH`, `Thư Clara`, `Không gian`), bộ chọn Khung hình Responsive (375px, 768px, 1024px, 1440px), và bộ chọn Trạng thái (`Normal`, `Loading`, `Empty`, `Error`).
- Một nút chuyển đổi quan trọng: **`[ Chế độ: Dữ liệu Giả lập (Mock) ]` $\longleftrightarrow$ `[ Chế độ: Dữ liệu Thật (Staging) ]`**.

### 9.2 Đánh Giá Lại Đề Xuất Visual Editor (Khắc Phục Lỗ Hổng v1)
Bản v1 đề xuất cơ chế `editableId`, `fieldPath`, `newText` tự do, tiềm ẩn nguy cơ bảo mật nghiêm trọng (Mass Assignment và ghi đè trái phép thuộc tính hệ thống). Bản v2 tái thiết kế với các chốt chặn an toàn:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│             KIẾN TRÚC AN TOÀN CHO TRÌNH SỬA NHANH (VISUAL EDITOR)           │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. ALLOWLIST CÁC TRƯỜNG ĐƯỢC PHÉP CHỈNH SỬA:                                │
│    Chỉ những thẻ DOM có thuộc tính data-editable-field nằm trong danh mục   │
│    cho phép mới được kích hoạt contenteditable. Ví dụ:                      │
│    - pub.hero.title, pub.hero.lead, pub.hero.prose_1, pub.hero.prose_2      │
│    - pub.vande.q1.title, pub.vande.q1.desc...                               │
│    - Tuyệt đối CẤM sửa các trường định danh ID, role, ngày tạo, URL route.  │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. KIỂM DUYỆT ĐẦU VÀO & KHỬ ĐỘC (INPUT VALIDATION & SANITIZATION):          │
│    - Độ dài chuỗi text bị giới hạn (Tiêu đề tối đa 200 ký tự, Lead 500 ký tự│
│    - Tự động bóc tách và mã hóa các ký tự điều khiển HTML nguy hiểm.         │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. VAI TRÒ CỦA localStorage (CLIENT RECOVERY CACHE):                        │
│    - localStorage CHỈ là bộ đệm tạm thời phía client để phục hồi khi mất   │
│      kết nối đột ngột, TUYỆT ĐỐI KHÔNG phải là Source of Truth.             │
│    - Dữ liệu chỉ trở thành chính thức khi người dùng bấm "LƯU VÀO CMS" và   │
│      Backend API xác nhận phản hồi HTTP 200 OK.                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. GIẢI QUYẾT XUNG ĐỘT (CONFLICT RESOLUTION):                               │
│    - Sử dụng cơ chế Khóa Lạc Quan (Optimistic Locking) thông qua trường     │
│      base_version. Nếu nội dung trên server đã bị sửa bởi một phiên khác,    │
│      hệ thống cảnh báo và yêu cầu đối soát thay vì ghi đè thầm lặng.        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. KIẾN TRÚC BẢO MẬT HỆ THỐNG (SECURITY ARCHITECTURE)

Dựa trên hướng dẫn chính thức từ **OWASP Cheat Sheet Series** (Session Management, CSRF Prevention, Authorization và Logging), hệ thống xây dựng mô hình bảo mật đa tầng:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MÔ HÌNH BẢO MẬT ĐA TẦNG OWASP                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. SESSION MANAGEMENT (OWASP Session Management Cheat Sheet)                │
│    - Tên Cookie: sid (Ngẫu nhiên, không để lộ công nghệ).                   │
│    - Cờ bắt buộc: HttpOnly = true (Ngăn chặn JavaScript độc hại đọc cắp).    │
│    - Cờ Secure: Tự động bật khi chạy HTTPS trên Production.                 │
│    - Vòng đời phiên: Tối đa 24 giờ; tự động hủy khi người dùng bấm Đăng xuất│
│    - Thu hồi phiên (Session Invalidation): Server gọi req.session.destroy() │
│      và phát lệnh xoá cookie Clear-Site-Data phía client.                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. BẢO VỆ CHỐNG CSRF ĐA TẦNG (OWASP CSRF Prevention Cheat Sheet)           │
│    Không phụ thuộc duy nhất vào SameSite: Lax. Triển khai 3 lớp phòng vệ:   │
│    - Lớp 1: Kiểm tra Header Origin & Referer đối soát với danh sách nguồn   │
│      được phép (adminOrigins) trên toàn bộ các phương thức POST/PUT/DELETE. │
│    - Lớp 2: Kiểm tra Fetch Metadata Header (Sec-Fetch-Site == 'same-origin')│
│      để tự động từ chối các request xuất phát từ trang web bên ngoài.       │
│    - Lớp 3: Sử dụng Custom Request Header (X-Requested-With: XMLHttpRequest)│
│      buộc trình duyệt phải kích hoạt CORS Preflight đối với request lạ.     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. PHÒNG THỦ CHỐNG BRUTE FORCE & TẤN CÔNG TỪ CHỐI DỊCH VỤ:                  │
│    - Endpoint /api/auth/login được bảo vệ bởi express-rate-limit: Tối đa 5   │
│      lần thử sai trong vòng 15 phút cho mỗi địa chỉ IP.                     │
│    - Mật khẩu lưu trữ bắt buộc mã hóa bằng hàm băm Bcrypt với Salt Rounds   │
│      đạt tiêu chuẩn an toàn công nghiệp (tối thiểu 10 vòng).                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 11. ĐẶC TẢ SAO LƯU, PHỤC HỒI & NHẬT KÝ KIỂM TOÁN (BACKUP, RESTORE & AUDIT LOGS)

### 11.1 Năng Lực Sao Lưu Dữ Liệu Vật Lý (Backup Specification)
- **Phạm vi sao lưu:**
  - CSDL quan hệ: Tệp SQLite `family_archive.db` hoặc bản kết xuất SQL Dump hoàn chỉnh của MariaDB.
  - Tư liệu media: Toàn bộ thư mục hình ảnh gốc tại `assets/images/` và tài liệu scan.
  - Cấu hình & Nội dung biên tập: Tệp CSDL `cms_documents`.
- **Cơ chế thực hiện:**
  - Chức năng Backup tạo ra một gói lưu trữ nén định dạng `.tar.gz` kèm mã băm kiểm tra tính toàn vẹn (Checksum `SHA-256`).
  - Đặt tên file theo chuẩn: `giatoc_backup_YYYYMMDD_HHMMSS_[commit_hash].tar.gz`.
- **Lưu trữ ngoại vi (Off-device Vault):** Bản sao lưu sau khi tạo được tự động đồng bộ sang thư mục lưu trữ an toàn hoặc thiết bị NAS Synology gia tộc, không để duy nhất trên máy chủ web.
- **Chính sách lưu giữ (Retention Policy):** Duy trì 7 bản sao lưu hàng ngày gần nhất, 4 bản sao lưu tuần và 12 bản sao lưu tháng.

### 11.2 Năng Lực Phục Hồi Dữ Liệu (Restore Specification)
- **Quy trình chốt chặn thẩm quyền nghiêm ngặt:** Phục hồi dữ liệu là thao tác phá hủy tiềm ẩn rủi ro cao. Nút Restore **tuyệt đối KHÔNG chạy tự động chỉ bằng một click chuột**.
- **Quy trình 4 bước bắt buộc:**
  1. *Xác thực danh tính:* Yêu cầu nhập lại mật khẩu của tài khoản `owner` (Tuấn).
  2. *Kiểm tra tính toàn vẹn:* Hệ thống đối soát mã Checksum SHA-256 của tệp backup trước khi nạp.
  3. *Tự động sao lưu an toàn trước khi khôi phục:* Hệ thống tự động tạo một bản backup tức thời (`pre_restore_snapshot.db`) của trạng thái hiện tại phòng trường hợp phục hồi hỏng.
  4. *Khôi phục trong Transaction:* Thực thi trong một giao dịch (Database Transaction) cô lập; nếu có bất kỳ lỗi nào xảy ra, tự động `ROLLBACK` về trạng thái ban đầu.

### 11.3 Cấu Trúc Nhật Ký Kiểm Toán (Audit Logging Specification)
Hệ thống thiết lập bảng `audit_logs` để ghi nhận toàn bộ hoạt động quan trọng trong Trung tâm Quản trị:

```sql
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    correlation_id TEXT NOT NULL,
    actor_id TEXT NOT NULL,
    actor_username TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    action TEXT NOT NULL,            -- 'LOGIN', 'CREATE', 'UPDATE', 'DELETE', 'PUBLISH', 'BACKUP', 'RESTORE'
    resource_type TEXT NOT NULL,     -- 'PEOPLE', 'STORIES', 'MEDIA', 'HOMEPAGE', 'USERS', 'DATABASE'
    resource_id TEXT,
    details_json TEXT,               -- Lưu diff tóm tắt { field, old_val, new_val }
    ip_address TEXT,
    user_agent TEXT,
    status TEXT NOT NULL,            -- 'SUCCESS', 'FAILED', 'BLOCKED'
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

#### Nguyên Tắc Quản Trị Nhật Ký:
- **Các sự kiện bắt buộc ghi log:** Đăng nhập thành công/thất bại, sửa thông tin nhân vật, sửa quan hệ gia phả, xuất bản bài viết MẠCH, thay đổi cấu hình Trang chủ, tạo/xóa tài khoản admin, kích hoạt sao lưu/phục hồi.
- **Lọc dữ liệu nhạy cảm (Sanitization):** Tuyệt đối cấm ghi mật khẩu, chuỗi băm password, mã cookie session hoặc nội dung thư riêng tư chưa mã hóa vào trường `details_json`.
- **Bảo vệ tính toàn vẹn:** Bảng `audit_logs` là bảng **Chỉ Thêm (Append-Only)**, không cung cấp API chỉnh sửa hoặc xóa log trên giao diện Admin; chỉ duy nhất Owner mới có quyền xem danh sách nhật ký.

---

## 12. SƠ ĐỒ PHỤ THUỘC & ĐỀ XUẤT LỘ TRÌNH (DEPENDENCY & ROADMAP)

### 12.1 Chuỗi Phụ Thuộc Kỹ Thuật Thực Tế (Dependency Chain)
Bản v2 đánh giá lại chuỗi phụ thuộc giữa các thành phần để bảo đảm không triển khai ngược quy trình:

```
   ┌────────────────────────────────────────────────────────┐
   │ TẦNG 1: Admin Shell & Unified Route Convention         │
   └───────────────────────────┬────────────────────────────┘
                               │ (Cần Shell ổn định trước)
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │ TẦNG 2: Security Gateways & Session Hardening          │
   └───────────────────────────┬────────────────────────────┘
                               │ (Cần bảo mật trước khi mở API)
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │ TẦNG 3: CMS Storage Schema & DEC-A03 Resolution        │
   └───────────────────────────┬────────────────────────────┘
                               │ (Cần nơi lưu trữ trước khi làm UI)
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │ TẦNG 4: Core Domain Editors (Genealogy & Media Manager)│
   └───────────────────────────┬────────────────────────────┘
                               │ (Dữ liệu thực thể hoàn chỉnh)
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │ TẦNG 5: MẠCH Markdown Editor & Split Preview           │
   └───────────────────────────┬────────────────────────────┘
                               │ (Ấn phẩm xuất bản hoàn chỉnh)
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │ TẦNG 6: Vibecode Lab Integration (Design & Experience) │
   └───────────────────────────┬────────────────────────────┘
                               │ (Nhúng Lab xem trước toàn bộ dữ liệu)
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │ TẦNG 7: Operations, Backup Engine & Audit Log Viewer   │
   └────────────────────────────────────────────────────────┘
```

### 12.2 Đề Xuất Kế Hoạch Triển Khai (Dự Kiến 4 Giai Đoạn Sau Khi Được Duyệt)

> [!IMPORTANT]
> Đây là **đề xuất kỹ thuật** để Tuấn và Emarald xem xét. AGY **tuyệt đối không tự ý kích hoạt triển khai** khi chưa có phê duyệt chính thức.

- **Giai Đoạn 1 — Foundation & Security Hardening (Tầng 1 + 2):**
  - Tái cấu trúc thanh Sidebar `/admin` theo chuẩn 5 Trục (WordPress Model).
  - Tích hợp `foundation.css` vào Admin để thống nhất typography và màu sắc nhận diện.
  - Bổ sung Origin header validation và rate limiter bảo vệ các route thay đổi dữ liệu.
- **Giai Đoạn 2 — Data Storage & Core Editors (Tầng 3 + 4):**
  - Hiện thực hóa quyết định `DEC-A03` của Tuấn về kho lưu trữ văn bản Trang chủ & Thẻ Mời.
  - Xây dựng giao diện Thư viện Quản lý 185 tư liệu ảnh (`mod-media`).
  - Nâng cấp Person Editor bổ sung nhãn nhận thức Epistemic và quản lý cây gia đình.
- **Giai Đoạn 3 — MẠCH Editorial & Lab Integration (Tầng 5 + 6):**
  - Xây dựng trình soạn thảo MẠCH (Markdown + Split Preview song song) có lưu nháp tự động.
  - Nhúng Vibecode Lab Engine vào route `#/lab/preview`, hỗ trợ chuyển đổi giữa dữ liệu Mock và Staging.
- **Giai Đoạn 4 — Operations & V1 Hardening (Tầng 7):**
  - Xây dựng module Sao lưu dữ liệu vật lý một chạm và cơ chế phục hồi có xác thực mật khẩu Owner.
  - Xây dựng bảng hiển thị Audit Logs và trang giám sát Sức khỏe API & CSDL.

---

## 13. SỔ ĐĂNG KÝ QUYẾT ĐỊNH (DECISION REGISTER)

| Mã Quyết Định | Tên Quyết Định | Trạng Thái Thẩm Quyền | Nội Dung Thống Nhất / Phương Án Chờ Duyệt |
| :---: | :--- | :---: | :--- |
| **`DEC-A01`** | **Admin Core Foundation** | **APPROVED IN PRINCIPLE** | Giữ `/admin` làm hạt nhân duy nhất; nhúng Vibecode Lab thành module `Design & Experience` (`#/lab`). Không tạo Admin thứ hai. |
| **`DEC-A02`** | **Identity & Account Model** | **APPROVED IN PRINCIPLE** | Tiếp tục duy trì riêng 3 bảng: `admin_users` (quản trị), `accounts` (thành viên), `identity_mappings` (nhân thân). Identity Mapping $\neq$ Permission Mapping. Chưa gộp bảng. |
| **`DEC-A03`** | **Homepage & Public Copy CMS Storage** | **OPEN** | Bác bỏ lưu toàn bộ trong Git. Khảo sát SoT xác nhận text đang bị hardcode trong `public-home.js`. Đề xuất chọn **Phương án 3 (`cms_documents`)** trong SQLite. **Chờ Tuấn phê duyệt.** |
| **`DEC-A04`** | **MẠCH Editorial Format** | **APPROVED IN PRINCIPLE** | Sử dụng định dạng Markdown kết hợp Split Preview song song. Bắt buộc có metadata schema, vòng đời bài viết, autosave và lọc sạch mã HTML độc hại. |

---

## 14. BẢNG QUẢN TRỊ RỦI RO, ĐIỂM CHƯA RÕ & ĐIỂM NGHẼN (RISKS, UNKNOWN & BLOCKED)

### 14.1 Điểm Nghẽn Hiện Tại (BLOCKED Items)
- **`BLOCK-01`:** Phân hệ biên tập Trang chủ (`mod-public-cms`) đang bị nghẽn do quyết định **`DEC-A03` đang ở trạng thái OPEN**. Cần quyết định dứt khoát từ Tuấn về việc tạo bảng `cms_documents` trong CSDL hay chọn phương án khác trước khi có thể viết code.
- **`BLOCK-02`:** Quản trị thành viên nâng cao (ReBAC) đang bị tạm dừng theo chỉ đạo của Emarald/Tuấn để tập trung hoàn thiện Admin Control Center và bảo vệ ranh giới Phase 1.

### 14.2 Các Điểm Chưa Kiểm Chứng Được Ở Chế Độ Read-Only (UNKNOWN Items)
- **`UNK-01` (Tình trạng kết nối MariaDB trên Production):** Biến môi trường `DB_CLIENT=mysql` được hỗ trợ trong code (`server/index.js`), nhưng trên môi trường phát triển cục bộ hiện tại chỉ có tệp SQLite `family_archive.db`. Tình trạng kết nối thực tế tới cụm CSDL MariaDB trên NAS Synology/Cloud chưa được kiểm chứng runtime.
- **`UNK-02` (Hạ tầng lưu trữ file ảnh upload):** Chưa xác minh được đường dẫn lưu trữ vật lý của 185 file media trên server thật (hiện đang trỏ tới `/assets/images/...`), cần kiểm tra quyền ghi thư mục khi triển khai tính năng Upload ảnh mới.

### 14.3 Ma Trận Quản Trị Rủi Ro (Risk Register)

| Mã Rủi Ro | Bản Chất Nguy Cơ | Tác Động | Biện Pháp Kiểm Soát Kiến Trúc Trong v2 |
| :---: | :--- | :---: | :--- |
| **`R-01`** | **Rò rỉ dữ liệu thân mật Thư Clara sang môi trường dùng thử** | Nghiêm trọng | Cô lập tuyệt đối; môi trường Mock chỉ dùng `synthetic_clara.json`; cấm Staging nạp thư thật khi chưa có ủy quyền bằng văn bản của Tuấn. |
| **`R-02`** | **Tấn công Cross-Site Request Forgery (CSRF) vào API quản trị** | Cao | Không dựa vào SameSite đơn lẻ; áp dụng phòng thủ 3 lớp OWASP (Origin check, Sec-Fetch-Site, Custom Header `X-Requested-With`). |
| **`R-03`** | **Mất dữ liệu do thao tác Phục Hồi (Restore) nhầm lẫn** | Thảm họa | Bắt buộc 4 bước kiểm soát: Xác thực mật khẩu Owner, Checksum SHA-256, tự động sao lưu an toàn trước khi khôi phục, và thực thi trong Transaction. |
| **`R-04`** | **Tấn công Chèn mã độc XSS qua trình soạn thảo Markdown MẠCH** | Cao | Chạy toàn bộ nội dung HTML sinh ra qua bộ lọc sanitize nghiêm ngặt (DOMPurify allowlist), triệt tiêu hoàn toàn thẻ `<script>` và event handler. |

---

## 15. CHECKLIST NGHIỆM THU KIẾN TRÚC (ARCHITECTURE APPROVAL CHECKLIST)

Bảng đối soát dành cho Emarald (QC) và Tuấn (Product Owner) trước khi ký duyệt chính thức:

- [ ] **1. Thẩm Quyền & Tôn Trọng Vai Trò:** Tài liệu không tự ý biến bất kỳ đề xuất nào của AI thành quyết định đã phê duyệt của Tuấn.
- [ ] **2. Kế Thừa Hợp Lý:** Tài liệu kế thừa các dữ kiện có giá trị từ v1 và xử lý triệt để các phản biện chuyên môn của Emarald.
- [ ] **3. Tính Nhất Quán Về Bằng Chứng:** Áp dụng nghiêm ngặt thang đo 9 trạng thái AIOS; mọi khẳng định kỹ thuật đều có file path và line reference chứng minh.
- [ ] **4. Minh Định Quyết Định Mở:** `DEC-A03` được phân tích đa chiều và để mở ở trạng thái `OPEN` để Tuấn quyết định.
- [ ] **5. Ranh Giới Dữ Liệu & Bảo Mật:** Ma trận cô lập dữ liệu 3 môi trường và bảo vệ Thư riêng Clara được thiết lập vững chắc.
- [ ] **6. Chuỗi Phụ Thuộc Hợp Lý:** Lộ trình triển khai phản ánh đúng chuỗi phụ thuộc kỹ thuật 7 tầng, không đảo lộn trật tự.
- [ ] **7. Bảo Chứng Read-Only:** Quá trình lập tài liệu v2 không gây ra bất kỳ tác dụng phụ nào lên mã nguồn, CSDL hoặc cấu hình của hệ thống.

---

*Tài liệu kiến trúc phiên bản 2 đã hoàn tất, được định dạng chuẩn mực và sẵn sàng để Emarald thẩm tra chuyên môn và Tuấn ra quyết định phê duyệt.*

