# BÁO CÁO KHẢO SÁT & ĐỀ XUẤT KIẾN TRÚC: UNIFIED ADMIN CONTROL CENTER
## (CHUYỂN ĐỔI VIBECODE LAB THÀNH TRUNG TÂM QUẢN TRỊ TẬP TRUNG)

**Mã tài liệu:** `ADMIN_CONTROL_CENTER_AUDIT.md`  
**Đường dẫn canonical:** `AUDIT/ADMIN_CONTROL_CENTER_AUDIT.md`  
**Chỉ thị gốc:** `DIRECTIVE: ADMIN-01 — VIBECODE LAB → UNIFIED ADMIN CONTROL CENTER`  
**Dự án:** CÂY GIA PHẢ — GIA TỘC TRẦN TRỌNG THU (`giatoctrantrongthu.com`)  
**Thẩm quyền phê duyệt:** Tuấn (Product Owner / Human Final Authority)  
**Thẩm định kiến trúc & QC:** Emarald (Strategic Analysis / Quality Control)  
**Cơ quan thực hiện:** AGY (Execution Coordinator / Primary Agent)  
**Chế độ khảo sát:** **STRICT READ-ONLY FORENSIC AUDIT** (Không sửa mã nguồn, không sửa CSDL, không thay đổi cấu hình)  
**Ngày hoàn thành:** 2026-11-03  

---

## 1. TỔNG QUAN ĐIỀU HÀNH (EXECUTIVE SUMMARY)

### 1.1 Bối Cảnh & Tầm Nhìn Chiến Lược
Theo chỉ đạo chiến lược `ADMIN-01` từ Tuấn, dự án cần chấm dứt tình trạng phân mảnh giữa:
1. **Phân hệ Quản trị cũ (`/admin`):** Đã có cơ chế xác thực phiên thực tế (Session Cookie), kiểm soát vai trò (RBAC: `owner`, `editor`), API REST bảo vệ, kết nối SQLite thật, nhưng giao diện sơ sài, tính năng biên tập còn thô sơ, preview chỉ là một popup text đơn giản.
2. **Phòng thí nghiệm giao diện (`lab.html` / Vibecode Lab):** Có bộ công cụ xem trước trực quan rất mạnh (7 bề mặt UI, 6 Persona, 5 kích thước responsive, giả lập trạng thái lỗi/tải, tra cứu token thiết kế), nhưng hoàn toàn cô lập trên dữ liệu giả lập (mock fixtures), không có khả năng lưu trữ (Zero Persistence) và không kết nối với cơ sở dữ liệu thật.

Tầm nhìn của Tuấn là **chuyển định hướng Vibecode Lab thành một Unified Admin Control Center (Trung tâm Điều hành Quản trị Thống nhất)**, lấy mô hình **WordPress Admin** làm quy chuẩn tham chiếu về cấu trúc phân cấp thông tin (Information Architecture), trải nghiệm quản trị tập trung và tính tách bạch giữa: *Quản trị nội dung*, *Cấu hình vận hành* và *Mã nguồn kỹ thuật*.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 UNIFIED ADMIN CONTROL CENTER (WORDPRESS MODEL)              │
│                                                                             │
│  ┌──────────────┐  ┌─────────────────────────────────────────────────────┐  │
│  │   SIDEBAR    │  │                   MAIN CONTROL VIEW                 │  │
│  │  NAVIGATION  │  │                                                     │  │
│  │  ──────────  │  │  A. DASHBOARD: Tổng quan hệ thống, cảnh báo, metric │  │
│  │  Dashboard   │  │  B. CONTENT: Phả hệ, MẠCH, Tư liệu, Kỷ niệm, Lịch   │  │
│  │  Nội dung    │  │  C. COMMUNITY: Thành viên, Tài khoản, Kiểm duyệt    │  │
│  │  Cộng đồng   │  │  D. DESIGN & LAB: Vibecode Lab Preview, Persona, UI │  │
│  │  Design/Lab  │  │  E. SYSTEM: API Health, Database, Sao lưu, Nhật ký │  │
│  │  Vận hành    │  │                                                     │  │
│  └──────────────┘  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Kết Luận Cốt Lõi Của Đợt Khảo Sát
1. **Không dựng thêm hệ thống thứ ba:** Khảo sát pháp y xác nhận `/admin` hiện hành đã sở hữu nền tảng Backend vững chắc (Express 5, Session middleware, Bcrypt, Rate Limiter, Route RBAC). Hướng đi tối ưu là **tái sử dụng và nâng cấp `/admin` thành Unified Admin Control Center**, sau đó nhúng toàn bộ năng lực xem trước và giả lập của Vibecode Lab vào phân hệ `Design & Experience` (`#/design`).
2. **Loại bỏ sự cô lập của Vibecode Lab:** Đưa Vibecode Lab từ một trang HTML tĩnh chạy dữ liệu mock thành một không gian Preview tích hợp trong Admin, có thể chuyển đổi linh hoạt giữa hai chế độ: *Mock Preview* (thử nghiệm an toàn) và *Live Staging Preview* (kết nối dữ liệu thật từ API).
3. **Bảo toàn ranh giới an ninh tuyệt đối:** Mọi thao tác quản trị nội dung phải thông qua REST API kiểm tra phiên trên từng request; Mock data tuyệt đối không được ghi vào Production DB; Thư riêng Clara và dữ liệu thân tộc nhạy cảm phải được bảo vệ bởi ranh giới phân quyền nghiêm ngặt.

---

## 2. HIỆN TRẠNG HỆ THỐNG & BẰNG CHỨNG PHÁP Y (CURRENT STATE WITH EVIDENCE)

Khảo sát sử dụng thang đánh giá 8 cấp độ chuẩn của AIOS:  
`DOCUMENTED` · `CONFIGURED` · `OBSERVED` · `TESTED` · `PROVEN` · `PARTIAL` · `FAILED` · `BLOCKED` · `UNKNOWN`.

| Hạng Mục Khảo Sát | Trạng Thái AIOS | Bằng Chứng Pháp Y (Evidence Files & Lines) | Nhận Định Chi Tiết |
| :--- | :---: | :--- | :--- |
| **Cấu trúc Shell `/admin`** | `PROVEN` | [`admin/index.html:11-51`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/admin/index.html#L11-L51), [`admin/css/admin.css:21-45`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/admin/css/admin.css#L21-L45) | Đã có sẵn layout 2 cột: Sidebar trái (240px) và `#main-view` phải. Hỗ trợ 4 nhóm: Dashboard, Hộp thư, Kho tri thức, Quản trị. |
| **Xác thực Admin & Phiên Session** | `PROVEN` | [`server/auth.js:8-87`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/auth.js#L8-L87), [`server/index.js:58-63`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/index.js#L58-L63) | Hoạt động qua cookie `sid`, middleware `requireAuth`, `requireOwner`. Có bảng `admin_users` (3 tài khoản: `testadmin`, `tuan`, `tuantq`). |
| **Biên tập Nhân sự (People Editor)** | `PARTIAL` | [`admin/js/admin.js:123-274`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/admin/js/admin.js#L123-L274), API `POST /api/people` | Đã có danh sách 223 hồ sơ, form sửa thông tin cơ bản, chọn quan hệ cha/mẹ/vợ/chồng qua Typeahead modal. Chưa có quản lý thẻ di chúc/phụ chú. |
| **Biên tập Mạch (Stories Editor)** | `PARTIAL` | [`admin/js/admin.js:275-405`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/admin/js/admin.js#L275-L405), API `POST /api/stories` | Đã có form nhập tiêu đề, tác giả, nội dung văn bản thô, gắn thẻ nhân vật liên quan qua Edge. Chưa hỗ trợ Markdown/Rich-text, chưa có quản lý chương hồi. |
| **Biên tập Sự kiện (Events Editor)** | `PARTIAL` | [`admin/js/admin.js:430-631`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/admin/js/admin.js#L430-L631), API `POST /api/events` | Đã có form tạo sự kiện, chọn loại lịch (Âm lịch / Dương lịch / Kỵ giỗ). Bảng `calendar_events` hiện có 0 bản ghi thật. |
| **Quản trị Tài khoản Admin** | `PROVEN` | [`admin/js/admin.js:632-738`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/admin/js/admin.js#L632-L738), API `/api/admin/users` | Chỉ Owner mới thấy menu; hỗ trợ tạo user mới, đổi mật khẩu, kích hoạt/vô hiệu hóa tài khoản admin. |
| **Xem Sơ đồ CSDL (Database View)** | `PARTIAL` | [`admin/js/admin.js:739-775`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/admin/js/admin.js#L739-L775), API `/api/admin/database/schema` | Hiển thị danh sách bảng SQLite và câu lệnh DDL `CREATE TABLE`. Chỉ đọc, không có metric số lượng bản ghi hay trạng thái kết nối. |
| **Xem Trước Công Khai Trong `/admin`** | `FAILED` | [`admin/js/admin.js:328-339`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/admin/js/admin.js#L328-L339) | Chỉ là một modal HTML popup nhồi 3 biến thô (`tempTitle`, `tempAuthor`, `tempContent`) vào thẻ `div`. Không có CSS design tokens, không có responsive preview. |
| **Vibecode Lab Engine (`lab.html`)** | `PROVEN` | [`lab.html`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/lab.html), [`src/js/ui/lab.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/lab.js) | Render 7 bề mặt UI vNEXT, 6 persona, 5 viewport, giả lập edge case, thanh Visual Inspector. Hoạt động độc lập tại cổng 8888. |
| **Khả năng Lưu của Visual Editor trong Lab** | `FAILED` | [`AUDIT/VIBECODE_VISUAL_EDITOR_NAVIGATOR_AUDIT.md:L72-L115`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/VIBECODE_VISUAL_EDITOR_NAVIGATOR_AUDIT.md#L72-L115) | Chế độ "Sửa Nhanh" chỉ gán `contenteditable="true"`. Zero Persistence: F5 hoặc chuyển trang là mất toàn bộ nội dung đã sửa. Không gọi API. |

---

## 3. KIỂM KÊ CÁC PHÂN HỆ HIỆN HỮU (EXISTING ADMIN & LAB INVENTORY)

### 3.1 Bảng Phân Phối Trách Nhiệm Giữa Hai Nền Tảng

```
                     HIỆN TRẠNG PHÂN MẢNH (AS-IS)
   ┌────────────────────────────────┐    ┌────────────────────────────────┐
   │         /admin (PORT 3000)     │    │       lab.html (PORT 8888)     │
   ├────────────────────────────────┤    ├────────────────────────────────┤
   │ • Auth: Session Cookie + Bcrypt│    │ • Auth: Mock Persona Switcher  │
   │ • Database: SQLite (Thật)      │    │ • Database: Synthetic Fixtures │
   │ • Quản lý: People, Story, Event│    │ • Preview: 7 Bề mặt UI vNEXT   │
   │ • Quản lý: Admin Users         │    │ • Viewport: 375px đến 1440px   │
   │ • Preview: Popup text thô sơ   │    │ • Sửa nhanh: contenteditable   │
   │ • Bị thiếu: Design system, UI  │    │ • Bị thiếu: Lưu DB, API REST   │
   └────────────────────────────────┘    └────────────────────────────────┘
                                  ▲
                                  │ (Chưa có cầu nối tích hợp)
                                  ▼
```

### 3.2 Kiểm Kê Chi Tiết Từng Module

#### Nhóm 1: Hệ Thống /admin (Production & Staging Foundation)
- **Giao diện:** File tĩnh `admin/index.html`, nạp CSS `admin/css/admin.css` và ES Module `admin/js/admin.js`.
- **Mạng giao tiếp API:** `admin/js/api.js` tự động phân giải `http://localhost:3000/api` (dev) hoặc `https://api.giatoctrantrongthu.com/api` (prod).
- **Backend Router tương ứng:**
  - `server/auth.js`: Đăng nhập, đăng xuất, lấy thông tin phiên `GET /api/auth/me`.
  - `server/index.js`: Endpoints `/api/admin/users`, `/api/admin/database/schema`, `/api/admin/content/*`.
  - `server/spaces_router.js`: Điều hướng không gian thành viên và phân định ngữ cảnh.
- **Dữ liệu thực tế trong SQLite (`family_archive.db`):**
  - 223 hồ sơ nhân sự (`people`).
  - 68 gia đình liên kết (`families`).
  - 185 tệp tư liệu & hình ảnh (`media`).
  - 3 tài khoản quản trị (`admin_users`).
  - 1 tài khoản thành viên (`accounts`).
  - 1 bài viết mạch mẫu (`stories`).

#### Nhóm 2: Hệ Thống Vibecode Lab (`lab.html`)
- **Giao diện:** Nạp `src/css/foundation/foundation.css`, bật cờ `window.__GIATOC_MOCK__ = true`.
- **Logic điều phối:** `src/js/ui/lab.js` (1.469 dòng code) chứa:
  - Header Studio Toolbar: Chọn 7 Bề mặt (`LAB_SURFACES`), chọn 5 Viewport (`VIEWPORTS`), chọn 6 Persona (`MOCK_PERSONAS`), chọn State (`STATE_OPTIONS`).
  - Inline Live Editing: Cho phép gõ sửa trực tiếp trên DOM (`enableInlineLiveEditing`).
  - Visual Design Inspector: Tra cứu mã màu CSS tokens, font size, spacing.
- **Bộ đệm dữ liệu giả lập:** `src/js/ui/mock-adapter.js` nạp các tệp JSON sạch PII tại `fixtures/` (`synthetic_genealogy.json`, `synthetic_mach.json`, `synthetic_clara.json`, `synthetic_media.json`...).

---

## 4. PHÂN TÍCH KHOẢNG TRỐNG NĂNG LỰC (CAPABILITY GAP ANALYSIS)

Đối chiếu với quy chuẩn **WordPress Admin Model** theo định hướng của Tuấn:

| Phân Vùng Chức Năng (WordPress Model) | Yêu Cầu Của Gia Tộc Trần Trọng Thu | Hiện Trạng Có Sẵn | Khoảng Trống Cần Bổ Sung (GAP) | Mức Độ Ưu Tiên |
| :--- | :--- | :--- | :--- | :---: |
| **A. Dashboard Tổng Quan** | - Thống kê số lượng hồ sơ, bài viết, tư liệu<br>- Cảnh báo lỗi dữ liệu, ngày giỗ sắp tới<br>- Nhật ký hoạt động gần đây của biên tập viên | Chỉ có 4 thẻ thống kê thô sơ (People count, Stories count, Media count, Events count). | - Thiếu Widget ngày giỗ & sự kiện cận kề.<br>- Thiếu Activity Feed.<br>- Thiếu cảnh báo hồ sơ chưa có năm sinh/mất. | `P1` |
| **B1. Genealogy Management** | - Quản lý cây gia phả: thêm, sửa, nối quan hệ<br>- Đánh dấu độ tin cậy tri thức (Epistemic)<br>- Ghi chú di chúc, mộ phần, danh xưng | Đã có Person Editor cơ bản (Họ tên, Chi tộc, Đời thứ, Ngày sinh/mất). | - Chưa có bộ chọn độ tin cậy Epistemic.<br>- Chưa có giao diện kéo thả hoặc trực quan hóa cây trong admin.<br>- Chưa có form quản lý gia đình (`families`). | `P1` |
| **B2. Media & Archive Library** | - Thư viện ảnh, tài liệu số hóa dòng họ<br>- Gắn tag nhân vật vào ảnh tư liệu<br>- Quản lý metadata: năm chụp, nguồn gốc | Đã có 185 dòng trong bảng `media` và bảng nối `person_media`. | **HOÀN TOÀN CHƯA CÓ UI QUẢN TRỊ MEDIA.** Không có chỗ upload, duyệt gallery, hay gán nhãn ảnh trong `/admin`. | `P0` |
| **B3. MẠCH & Editorial Management** | - Soạn thảo bài viết, ký ức dòng họ<br>- Quản lý chương hồi (Series/Collections)<br>- Trạng thái bản thảo: Draft, Review, Published | Đã có Story Editor thô sơ (Title, Author, Content textarea, Status). | - Thiếu trình soạn thảo Markdown/WYSIWYG.<br>- Thiếu quản lý danh mục (Categories / Tags).<br>- Chưa hỗ trợ lưu nháp tự động (Autosave). | `P1` |
| **B4. Homepage & Public Copy CMS** | - Biên tập câu chữ Trang chủ công khai (`public-home.js`)<br>- Sửa câu hỏi nghiên cứu, định vị không gian<br>- Quản lý Thẻ Mời Cửa Ngõ | Chỉ có thể sửa cứng trong code JavaScript hoặc gõ thử tạm thời trên Lab (mất khi reload). | **CHƯA CÓ GIAO DIỆN QUẢN TRỊ NỘI DUNG TRANG CHỦ.** Cần CMS hóa các chuỗi text công khai qua API. | `P0` |
| **C. Community & Members** | - Quản lý tài khoản con cháu (`accounts`)<br>- Cấp mã định danh, duyệt thành viên mới<br>- Phân quyền theo nhánh chi tộc (ReBAC) | Chỉ có quản lý tài khoản `admin_users`. | **THIẾU QUẢN TRỊ THÀNH VIÊN DÒNG HỌ.** Bảng `accounts` và `identity_mappings` chưa có màn hình quản lý trong admin. | `P0` |
| **D. Design & Experience** | - Xem trước 7 bề mặt UI theo thời gian thực<br>- Đổi góc nhìn Persona, Viewport responsive<br>- Sửa nội dung nháp thấy ngay kết quả preview | Vibecode Lab đã có đầy đủ bộ công cụ này nhưng nằm tách biệt ở cổng 8888. | - Chưa nhúng Lab vào `/admin`.<br>- Chưa có cơ chế nạp dữ liệu Staging thật vào Lab. | `P0` |
| **E. System Management** | - Giám sát sức khỏe API, kết nối SQLite/MariaDB<br>- Xem nhật ký kiểm toán (Audit Logs), lỗi hệ thống<br>- Nút bấm Sao lưu CSDL vật lý (Backup) | Chỉ có trang xem câu lệnh DDL `CREATE TABLE`. | - Thiếu bảng trạng thái API/DB Health.<br>- Thiếu chức năng kích hoạt sao lưu an toàn một chạm. | `P2` |

---

## 5. ĐỀ XUẤT KIẾN TRÚC THÔNG TIN (PROPOSED INFORMATION ARCHITECTURE)

Trung tâm Quản trị Thống nhất được tổ chức theo **5 Trục Trọng Tâm**, kế thừa trọn vẹn mô hình phân cấp WordPress nhưng chuyên biệt hóa cho không gian văn hóa gia tộc:

```
                            UNIFIED ADMIN CONTROL CENTER
                                         │
        ┌────────────────┬───────────────┼───────────────┬────────────────┐
        ▼                ▼               ▼               ▼                ▼
   1. DASHBOARD     2. NỘI DUNG     3. CỘNG ĐỒNG    4. THIẾT KẾ      5. HỆ THỐNG
   (Trung tâm       (Domain CMS     (Members &      (Vibecode Lab    (Vận hành &
    điều hành)       Records)        Moderation)     Experience)      Bảo mật)
        │                │               │               │                │
        ├─ Thống kê      ├─ Phả hệ       ├─ Thành viên   ├─ Bề mặt UI     ├─ API Health
        ├─ Hoạt động     ├─ Tư liệu/Ảnh  ├─ Yêu cầu mở   ├─ Persona       ├─ DB Status
        ├─ Lịch giỗ      ├─ MẠCH         ├─ Phân quyền   ├─ Responsive    ├─ Sao lưu
        └─ Việc cần làm  ├─ Lịch kỵ      └─ Tài khoản    ├─ Sửa nhãn      └─ Nhật ký
                         └─ Trang chủ                    └─ Tokens
```

### 5.1 Chi Tiết Từng Trục Thông Tin

#### 1. DASHBOARD (Bảng Điều Khiển Tổng Quan)
- **Tình trạng di sản số:** Số lượng hồ sơ nhân vật, tỷ lệ hồ sơ có ảnh chân dung, số bài viết MẠCH, số tư liệu lưu trữ.
- **Sự kiện cận kề:** Hiển thị danh sách ngày kỵ giỗ tiền nhân trong vòng 30 ngày tới (tính theo Âm lịch).
- **Hộp thư & Kiểm duyệt:** Số lượng đóng góp ký ức, yêu cầu đính chính thông tin từ con cháu đang chờ duyệt.
- **Nhật ký chỉnh sửa:** 10 thao tác cập nhật gần nhất của các tài khoản biên tập viên.

#### 2. CONTENT MANAGEMENT (Quản Trị Tri Thức & Xuất Bản)
- **Phả hệ (Genealogy):** Quản lý hồ sơ nhân vật (`people`), cây gia đình (`families`), quan hệ huyết thống (`edges`). Gắn nhãn nhận thức Epistemic (`CONFIRMED`, `MEMORY`, `ORAL_TRADITION`...).
- **Tư liệu & Media (Media Library):** Tải lên, phân loại hình ảnh, sắc phong, văn tự gia phả; gắn tọa độ khuôn mặt/nhân vật liên kết; quản lý metadata bản quyền và nguồn gốc.
- **MẠCH (Discourse Publications):** Soạn thảo bài viết, câu chuyện lịch sử, thư gửi con cháu theo từng chuyên đề/tập san. Hỗ trợ soạn thảo Markdown và lưu nháp.
- **Lịch & Nghi lễ (Ancestral Calendar):** Quản lý 4 nhóm lịch (Nghi lễ gia tiên, Sự kiện gia tộc, Kỷ niệm đời người, Lịch sinh hoạt).
- **Trang chủ & Cửa ngõ (Public Experience CMS):** Quản lý nội dung văn bản Trang chủ (`public-home.js`), định vị không gian, câu hỏi khảo sát và nội dung Thẻ Mời Cửa Ngõ (`InvitationGatewayCard`).

#### 3. COMMUNITY & IDENTITY MANAGEMENT (Cộng Đồng & Định Danh)
- **Danh sách thành viên (`accounts`):** Quản lý tài khoản con cháu đã được định danh, trạng thái kích hoạt (`PROVISIONED`, `ACTIVE`, `SUSPENDED`).
- **Liên kết hồ sơ (`identity_mappings`):** Gắn tài khoản đăng nhập với một nhân vật cụ thể trên cây gia phả.
- **Phân quyền quan hệ (ReBAC / Roles):** Thiết lập quyền hạn theo nhánh chi tộc (Trưởng chi, Biên tập viên nhánh, Thành viên nội tộc, Ngoại tộc).
- **Hộp thư đóng góp (Submissions & Moderation):** Tiếp nhận bài viết, hình ảnh, đính chính ký ức do con cháu gửi lên; có quy trình Duyệt / Từ chối / Yêu cầu bổ sung chứng cứ.

#### 4. DESIGN & EXPERIENCE (Tích Hợp Vibecode Lab)
- **Preview Bề mặt UI:** Chuyển đổi xem trước 7 không gian giao diện với phong cách trình bày thực tế.
- **Giả lập Persona:** Thử nghiệm góc nhìn từ Khách vãng lai, Thành viên trưởng chi, Thành viên chi thứ đến Quản trị viên để kiểm tra tính đúng đắn của ranh giới hiển thị.
- **Khung nhìn Responsive:** Kiểm tra giao diện ở 5 độ phân giải (375px Mobile, 768px Tablet, 1024px Laptop, 1440px Desktop, 100% Fluid).
- **Trình sửa nhãn trực quan (Visual Editor có lưu):** Nhấp chuột sửa tiêu đề/đoạn văn trên preview, có nút "Lưu thay đổi vào CMS" để ghi nhận vào API.
- **Bảng mã quy chuẩn (Design Tokens):** Tra cứu màu sắc, typography, khoảng cách chuẩn Brand Governance.

#### 5. SYSTEM & OPERATIONS (Vận Hành & An Ninh)
- **Tình trạng hệ sinh thái:** Trạng thái kết nối CSDL (SQLite / MariaDB), thời gian phản hồi API, trạng thái Session Store.
- **Sao lưu & Phục hồi vật lý:** Tạo bản sao lưu an toàn CSDL (`.db` / SQL dump) trước mỗi đợt cập nhật lớn; lịch sử các bản sao lưu.
- **Nhật ký kiểm toán (Audit Logs):** Ghi nhận chi tiết ai đã sửa bản ghi nào, vào lúc nào, địa chỉ IP nào.
- **Thông tin môi trường:** Hiển thị rõ cờ môi trường (`LOCAL_DEV` / `STAGING` / `PRODUCTION`) để ngăn ngừa thao tác nhầm lẫn.

---

## 6. ĐỀ XUẤT CẤU TRÚC ĐIỀU HƯỚNG SIDEBAR (PROPOSED NAVIGATION STRUCTURE)

Giao diện Sidebar của Trung tâm Quản trị được thiết kế theo đúng cấu trúc chuẩn của WordPress Admin, ngôn ngữ thuần Việt trang trọng:

```markdown
┌─────────────────────────────────────────────────────────────┐
│ TRẦN TRỌNG THU                                              │
│ TRUNG TÂM ĐIỀU HÀNH QUẢN TRỊ · v2.0                         │
│ [ Môi trường: LOCAL DEV ]                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 📊 TỔNG QUAN                                                │
│    ├─ Bảng tin chính                (#/)                    │
│    └─ Nhật ký hoạt động             (#/activity)            │
│                                                             │
│ 🏛️ QUẢN TRỊ NỘI DUNG                                        │
│    ├─ Phả hệ & Nhân vật             (#/genealogy)           │
│    │  ├─ Danh sách nhân vật         (#/genealogy/people)    │
│    │  └─ Cây gia đình               (#/genealogy/families)  │
│    ├─ Thư viện Tư liệu & Ảnh        (#/media)               │
│    ├─ Không gian MẠCH               (#/stories)             │
│    │  ├─ Tất cả bài viết            (#/stories/all)         │
│    │  └─ Viết bài mới               (#/stories/new)         │
│    ├─ Lịch gia tộc & Kỵ giỗ         (#/calendar)            │
│    └─ Trang chủ & Cửa ngõ           (#/content/public)      │
│                                                             │
│ 👥 CỘNG ĐỒNG & THÀNH VIÊN                                   │
│    ├─ Thành viên dòng họ            (#/community/members)   │
│    ├─ Hộp thư & Đóng góp            (#/community/inbox)     │
│    └─ Tài khoản quản trị            (#/admin/users) [Owner] │
│                                                             │
│ 🎨 THIẾT KẾ & TRẢI NGHIỆM (VIBECODE LAB)                    │
│    ├─ Xem trước giao diện           (#/lab/preview)         │
│    ├─ Giả lập Persona               (#/lab/persona)         │
│    ├─ Kiểm tra Responsive           (#/lab/responsive)      │
│    └─ Bảng quy chuẩn Design         (#/lab/tokens)          │
│                                                             │
│ ⚙️ VẬN HÀNH & BẢO MẬT                                       │
│    ├─ Sức khỏe hệ thống             (#/system/health)       │
│    ├─ Cơ sở dữ liệu                 (#/system/database)     │
│    ├─ Sao lưu dữ liệu               (#/system/backup)       │
│    └─ Nhật ký kiểm toán             (#/system/audit-logs)   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ 👤 Tuấn (Owner) · [ Đăng xuất ]                             │
│ 🔗 [ Xem trang web công khai ↗ ]                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. ĐỀ XUẤT TÍCH HỢP VIBECODE LAB VÀO ADMIN (LAB INTEGRATION PROPOSAL)

### 7.1 Mô Hình Kỹ Thuật: Nhúng Không Phá Vỡ (Non-Destructive Integration)
Thay vì duy trì 2 ứng dụng web độc lập trên 2 cổng (3000 và 8888), Vibecode Lab sẽ được tích hợp vào `/admin` dưới dạng module **`Design & Experience Studio`**:

```
                                KIẾN TRÚC TÍCH HỢP
                                
       /admin/index.html (Single Admin Portal)
                 │
                 ├── Sidebar Navigation (WordPress Style)
                 │
                 └── #main-view
                       │
                       ├── Nếu hash = #/people   ──► Nạp Person Editor
                       ├── Nếu hash = #/stories  ──► Nạp Story Editor
                       │
                       └── Nếu hash = #/lab/*    ──► Nạp Vibecode Lab Studio
                                                           │
                                ┌──────────────────────────┴──────────────────────────┐
                                ▼                                                     ▼
                     CHẾ ĐỘ MOCK (Mặc định)                               CHẾ ĐỘ STAGING (Dữ liệu thật)
                     Nạp synthetic fixtures sạch PII                      Gọi API GET /api/admin/content/*
                     Thử nghiệm layout & style tự do                      Xem trước dữ liệu thật trước khi publish
```

### 7.2 Nâng Cấp Bộ Soạn Thảo Sửa Nhanh (Visual Live Editor)
Khắc phục triệt để nhược điểm "Zero Persistence" của Vibecode Lab:
1. Khi bật **✏️ Sửa Nhanh**, thanh công cụ Lab hiển thị thêm 2 nút:
   - `[ Lưu Bản Thảo (Draft) ]`
   - `[ Hủy Thay Đổi ]`
2. Khi người dùng click vào thẻ tiêu đề/văn bản và gõ sửa:
   - Gắn cờ `isDirty = true`.
   - Bắt sự kiện `blur` để lưu tạm vào `draftStore` (kết hợp `localStorage` và API nháp `POST /api/admin/content/drafts`).
3. Khi bấm `Lưu Bản Thảo`:
   - Gửi payload có cấu trúc (`editableId`, `fieldPath`, `newText`, `locale`) về Backend API.
   - Nội dung được lưu vào bảng quản trị nội dung mà không cần can thiệp vào file code JavaScript.

---

## 8. BẢO MẬT & RANH GIỚI DỮ LIỆU (SECURITY & DATA BOUNDARY RISKS)

Quá trình chuyển đổi sang Unified Admin Control Center tiềm ẩn 4 rủi ro an ninh trọng yếu cần kiểm soát nghiêm ngặt:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     4 NGUYÊN TẮC BẢO MẬT BẤT KHẢ XÂM PHẠM                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. CẤM TUYỆT ĐỐI rò rỉ dữ liệu thật (PII) sang chế độ Mock Preview.        │
│ 2. CẤM TUYỆT ĐỐI để lộ Thư riêng Clara cho tài khoản không có thẩm quyền.   │
│ 3. CẤM THAO TÁC CSDL TRỰC TIẾP: Mọi thao tác CMS bắt buộc qua API REST.     │
│ 4. BẢO VỆ ĐA TẦNG: Backend bắt buộc kiểm tra quyền trên từng request.      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Chi Tiết Biện Pháp Kiểm Soát:
1. **Cô lập dữ liệu Thư Clara (`CLARA_SECURITY_CONTAINMENT`):**
   - Thư riêng Clara và ảnh gia đình thân mật thuộc nhóm bảo mật cao nhất.
   - Không gian Clara trong Lab Preview ở chế độ Mock **chỉ được phép sử dụng văn bản giả lập và ảnh mô phỏng (`synthetic_clara.json`)**.
   - Trong Admin thật, chỉ tài khoản `role === 'owner'` (Tuấn) mới có quyền truy cập endpoint nội dung gốc của Clara.
2. **Kiểm tra quyền ở tầng Backend (Defense in Depth):**
   - Tuyệt đối không chỉ dựa vào việc ẩn menu trên giao diện để bảo mật.
   - Toàn bộ các route `/api/admin/*` đều phải đi qua 2 lớp bảo vệ:
     - Lớp 1: `requireAuth` (xác minh phiên đăng nhập hợp lệ).
     - Lớp 2: `requireOwner` hoặc `requireRole(['owner', 'editor'])` (xác minh quyền hạn thực hiện).
3. **Phân định rõ ràng giữa Môi Trường Thử Nghiệm và Production:**
   - Khi chạy ở môi trường phát triển cục bộ, giao diện Admin phải hiển thị banner nổi bật màu cam `[ LOCAL DEVELOPMENT ]`.
   - Cấm tích hợp nút "Deploy Production" trực tiếp trên giao diện Admin khi chưa qua cổng phê duyệt con người (`GATE-06`).

---

## 9. CÁC QUYẾT ĐỊNH MỞ CẦN TUẤN PHÊ DUYỆT (OPEN DECISIONS)

Dưới đây là 4 quyết định chiến lược cần ý kiến chỉ đạo trực tiếp từ Tuấn trước khi tiến hành thực thi:

### Quyết Định 1 (`DEC-A01`): Lựa Chọn Nền Tảng Hạt Nhân Để Hợp Nhất
- **Phương án A (Khuyến nghị của AGY):** Giữ `/admin` làm nền tảng hạt nhân; tái cấu trúc layout của `/admin` theo phong cách WordPress; tích hợp engine của `lab.js` vào mục `Design & Experience` (`#/lab`).
  - *Ưu điểm:* Tận dụng toàn bộ hạ tầng bảo mật, session cookie, route Express và kết nối SQLite sẵn có. Không phải viết lại backend auth.
  - *Nhược điểm:* Cần refactor lại CSS của `/admin` để đồng bộ hoàn toàn với design tokens của `foundation.css`.
- **Phương án B:** Lấy `lab.html` làm nền tảng hạt nhân; bổ sung sidebar điều hướng WordPress và gắn API Backend vào Lab.
  - *Ưu điểm:* Giao diện Lab đã dùng sẵn design tokens của hệ thống vNEXT.
  - *Nhược điểm:* Phải viết lại toàn bộ cơ chế đăng nhập, quản lý phiên và bảo vệ route cho Lab; nguy cơ phá vỡ tính độc lập của môi trường visual prototyping.
- **Khuyến nghị:** **Chọn Phương án A.**

### Quyết Định 2 (`DEC-A02`): Hợp Nhất Mô Hình Tài Khoản (`admin_users` vs `accounts`)
- **Hiện trạng:** Hệ thống đang có 2 bảng tài khoản tách biệt: `admin_users` (dùng cho `/admin`, roles: `owner`, `editor`) và `accounts` (dùng cho thành viên dòng họ, roles: `member`, status: `PROVISIONED` / `ACTIVE`).
- **Phương án A (Khuyến nghị của AGY):** Hợp nhất thành một bảng danh tính duy nhất `accounts`, bổ sung cờ `is_admin` hoặc mở rộng role (`owner`, `branch_editor`, `member`, `guest`).
- **Phương án B:** Giữ nguyên 2 bảng tách biệt; tài khoản quản trị kỹ thuật nằm ở `admin_users`, tài khoản con cháu thành viên nằm ở `accounts` (liên kết qua `foundation.js:syncAdminUserToAccount`).
- **Khuyến nghị:** **Chọn Phương án B trong giai đoạn hiện tại** để bảo đảm an toàn dữ liệu, sau đó lên kế hoạch hợp nhất ở Phase 4 khi hoàn thiện ReBAC.

### Quyết Định 3 (`DEC-A03`): Cơ Chế Lưu Trữ Nội Dung Nháp Trang Chủ (Public Copy CMS)
- **Phương án A (Khuyến nghị của AGY):** Lưu nội dung văn bản Trang chủ và Thẻ Mời dưới dạng file có cấu trúc JSON/YAML trong Git (`content/public_home_content.json`). Admin cung cấp giao diện sửa và ghi vào file này qua API.
  - *Ưu điểm:* Dễ dàng kiểm soát phiên bản (Version Control) bằng Git, không làm phình to CSDL SQLite, tốc độ nạp trang cực nhanh.
  - *Nhược điểm:* Cần một endpoint an toàn để ghi file cục bộ.
- **Phương án B:** Tạo bảng mới `cms_content` trong SQLite để lưu trữ từng đoạn văn theo `key-value`.
  - *Ưu điểm:* Chuẩn hóa dữ liệu theo phong cách CSDL truyền thống.
  - *Nhược điểm:* Cần migration CSDL, khó so sánh diff lịch sử văn bản như Git.
- **Khuyến nghị:** **Chọn Phương án A.**

### Quyết Định 4 (`DEC-A04`): Chuẩn Soạn Thảo Văn Bản Cho Không Gian MẠCH
- **Phương án A (Khuyến nghị của AGY):** Hỗ trợ định dạng **Markdown** kết hợp khung xem trước song song (Split Screen Preview).
  - *Ưu điểm:* Nhẹ, giữ nguyên cấu trúc văn bản thuần khiết, dễ lưu trữ và đồng bộ với kho tư liệu.
- **Phương án B:** Tích hợp bộ soạn thảo WYSIWYG (như Quill, Tiptap hoặc TinyMCE).
  - *Ưu điểm:* Trực quan giống Word.
  - *Nhược điểm:* Thêm thư viện nặng, sinh mã HTML rác, khó kiểm soát đồng bộ design tokens.
- **Khuyến nghị:** **Chọn Phương án A.**

---

## 10. ĐỀ XUẤT LỘ TRÌNH THỰC HIỆN TIẾP THEO (RECOMMENDED NEXT ACTIONS)

Sau khi Tuấn và Emarald phê duyệt báo cáo khảo sát này, lộ trình triển khai Unified Admin Control Center sẽ được chia làm 4 Sprint tuần tự:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 LỘ TRÌNH TRIỂN KHAI 4 SPRINT (ADMIN CONTROL CENTER)         │
├─────────────────────────────────────────────────────────────────────────────┤
│ • SPRINT 1: Nâng cấp Shell Điều Hướng & Đồng Bộ Design Tokens              │
│   - Tái cấu trúc Sidebar `/admin` theo chuẩn 5 Trục (WordPress Model).     │
│   - Nạp `foundation.css` vào `/admin` để thống nhất typography và màu sắc.  │
│                                                                             │
│ • SPRINT 2: Xây Dựng CMS Trang Chủ & Thư Viện Tư Liệu (Media Library)      │
│   - Xây dựng giao diện biên tập chuỗi chữ Trang chủ & Thẻ Mời Cửa Ngõ.      │
│   - Xây dựng giao diện Quản lý 185 tệp hình ảnh/tư liệu trong SQLite.       │
│                                                                             │
│ • SPRINT 3: Tích Hợp Vibecode Lab Thành Phân Hệ Design & Experience        │
│   - Nhúng engine của `lab.js` vào route `#/lab/preview`.                    │
│   - Bổ sung bộ nhớ đệm Draft và nút "Lưu thay đổi vào CMS".                 │
│                                                                             │
│ • SPRINT 4: Quản Trị Thành Viên Dòng Họ & Sức Khỏe Hệ Thống                │
│   - Xây dựng màn hình quản lý `accounts` và `identity_mappings`.            │
│   - Xây dựng trang System Health & Nút kích hoạt Sao lưu CSDL vật lý.       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 11. BẢO CHỨNG TUÂN THỦ READ-ONLY (READ-ONLY ASSURANCE)

Trong toàn bộ quá trình thực hiện khảo sát này, AGY cam kết:
- **0 file code** bị chỉnh sửa.
- **0 câu lệnh SQL ghi** (`INSERT`, `UPDATE`, `DELETE`, `ALTER`, `DROP`) được thực thi lên CSDL.
- **0 package mới** được cài đặt vào hệ thống.
- **0 lệnh commit hoặc deploy** được kích hoạt.
- Báo cáo này hoàn toàn dựa trên khảo sát thực chứng mã nguồn và dữ liệu thực tế tại thời điểm 03/11/2026.

---

*Báo cáo đã hoàn thành và sẵn sàng để Emarald thẩm định chuyên môn và Tuấn phê duyệt định hướng.*

