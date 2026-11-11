# BẢN ĐẶC TẢ KIẾN TRÚC MÃ NGUỒN ĐÍCH (PHASE 2)
## (SOURCE CODE TARGET ARCHITECTURE — MODULAR MONOLITH SPECIFICATION)

**Mã tài liệu:** `SOURCE_CODE_TARGET_ARCHITECTURE.md`  
**Đường dẫn canonical:** `AUDIT/SOURCE_CODE_TARGET_ARCHITECTURE.md`  
**Tài liệu nền tảng:** [`AUDIT/SOURCE_CODE_ARCHITECTURE_AUDIT.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/SOURCE_CODE_ARCHITECTURE_AUDIT.md) (Giai đoạn I)  
**Chỉ thị điều hành:** `DIRECTIVE: SOURCE CODE ARCHITECTURE & MASTER PLAN RESTRUCTURING`  
**Dự án:** CÂY GIA PHẢ — GIA TỘC TRẦN TRỌNG THU (`giatoctrantrongthu.com`)  
**Product Owner / Thẩm quyền tối cao:** Tuấn (Human Final Authority)  
**Thẩm định kiến trúc & Quản trị chất lượng:** Emarald (Strategic Analysis / Quality Control)  
**Cơ quan thực thi:** AGY (Execution Coordinator & Primary Agent)  
**Thời điểm hoàn tất:** 2026-11-03  

---

## 1. NGUYÊN TẮC THIẾT KẾ KIẾN TRÚC CỐT LÕI (CORE ARCHITECTURAL PRINCIPLES)

Kiến trúc đích được xây dựng dựa trên 6 nguyên tắc bất khả xâm phạm do Tuấn và Emarald chuẩn hóa:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    6 NGUYÊN TẮC THIẾT KẾ KIẾN TRÚC CỐT LÕI                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. MODULAR MONOLITH: Gom tụ trong một kho lưu trữ duy nhất, nhưng phân định │
│    ranh giới module và quyền sở hữu miền (domain ownership) nghiêm ngặt.    │
│ 2. VANILLA JS ESM THUẦN CHUẨN: Tuyệt đối không đưa bundler (Webpack, Vite), │
│    transpiler (Babel) hay UI framework nặng (React, Vue) vào frontend.      │
│ 3. ĐỘC LẬP TẦNG MIỀN (DOMAIN AGNOSTIC TO UI): Logic phả hệ, lịch âm, nhận  │
│    thức epistemic không được phụ thuộc vào DOM hoặc framework trình diễn.   │
│ 4. NGHỊCH ĐẢO PHỤ THUỘC (DEPENDENCY INVERSION): Tầng trình diễn không import│
│    trực tiếp mock data; cơ chế mock chỉ được tiêm (inject) tại runtime.     │
│ 5. BẢO VỆ ĐA TẦNG (DEFENSE IN DEPTH): Backend chịu trách nhiệm an ninh cuối │
│    cùng; không tin tưởng việc ẩn menu hoặc client-side validation.          │
│ 6. BẢO TỒN SẢN PHẨM SỐNG: Tái cấu trúc theo từng bước nhỏ (Incremental),   │
│    giữ nguyên vẹn URL công khai, API contracts và dữ liệu CSDL hiện có.     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. PHÂN TẦNG KIẾN TRÚC HỆ THỐNG (ARCHITECTURAL LAYERS)

Hệ thống được tổ chức thành **6 Tầng Kiến Trúc Phân Cấp Một Chiều** (Chiều phụ thuộc chỉ đi từ trên xuống dưới, nghiêm cấm phụ thuộc ngược):

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     6 TẦNG KIẾN TRÚC PHÂN CẤP (LAYERED ARCHITECTURE)         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [ TẦNG 1: TRẢI NGHIỆM NGƯỜI DÙNG (EXPERIENCE LAYER) ]                      │
│  ├── Public Web App (index.html, src/apps/public/)                          │
│  ├── Member Space App (server/member_*.html, src/apps/member/)              │
│  ├── Unified Admin Control Center (admin/index.html, src/apps/admin/)       │
│  └── Vibecode Lab Studio (lab.html, src/apps/lab/)                          │
│       │                                                                     │
│       ▼ (Gọi các Use Cases & Domain Services)                               │
│  [ TẦNG 2: NGHIỆP VỤ ỨNG DỤNG (APPLICATION / USE CASES LAYER) ]             │
│  ├── Onboarding & Activation Flow                                           │
│  ├── Editorial Publishing & Moderation Pipeline                             │
│  ├── Visual Live Editing & Content Sync                                     │
│  └── Identity Mapping & Profile Linking                                     │
│       │                                                                     │
│       ▼ (Sở hữu quy tắc kinh doanh thuần túy)                               │
│  [ TẦNG 3: MIỀN LOGIC & TRI THỨC GIA TỘC (DOMAIN CORE LAYER) ]              │
│  ├── GenealogyDomain (Lineage Graph, Pedigree Tree, Generation Depth)       │
│  ├── KinshipDomain (Relationship Calculator, Kinship ReBAC Rules)           │
│  ├── EditorialDomain (MẠCH Articles, Series, Chapter Tree, Epistemic Labels)│
│  ├── CalendarDomain (Vietnamese Lunar Engine, Feasts & Ritual Cadence)      │
│  └── ArchiveDomain (Media Metadata, Face/Person Association, Provenance)    │
│       │                                                                     │
│       ▼ (Sử dụng dịch vụ nền tảng & trừu tượng hóa)                         │
│  [ TẦNG 4: NỀN TẢNG DỊCH VỤ (PLATFORM SERVICES LAYER) ]                     │
│  ├── DataService Client (HTTP REST Client with Error Normalization)         │
│  ├── MockPlatform Adapter (In-Memory Synthetic Data Provider)               │
│  ├── DraftStore & StateCache (Client-side recovery storage)                 │
│  └── EventBus / NavigationStore (Cross-component communication)             │
│       │                                                                     │
│       ▼ (Quy chuẩn dùng chung bất biến)                                     │
│  [ TẦNG 5: QUY CHUẨN DÙNG CHUNG (SHARED FOUNDATION & CONTRACTS) ]           │
│  ├── Brand Design Tokens & CSS Foundation (tokens, layout, typography, UI)  │
│  ├── DOM Helpers (Safe DOM creation, HTML Sanitization via DOMPurify)       │
│  └── Canonical Contracts (Data Transfer Objects, Schema Types, Constants)   │
│       │                                                                     │
│       ▼ (Hạ tầng máy chủ & lưu trữ vật lý)                                  │
│  [ TẦNG 6: HẠ TẦNG & LƯU TRỮ MÁY CHỦ (INFRASTRUCTURE & BACKEND) ]           │
│  ├── Node.js / Express 5 Engine (Modular Routers, Session & CSRF Guards)    │
│  ├── Database Persistence (SQLite family_archive.db / MariaDB Client)       │
│  ├── File System Archive (assets/images/, content/, fixtures/)              │
│  └── Backup & Recovery Engine (Online Backup API, WAL Checkpointing)       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. RANH GIỚI BỐN TRẢI NGHIỆM SẢN PHẨM (EXPERIENCE BOUNDARIES)

Hệ thống phân định ranh giới rõ ràng giữa 4 bề mặt trải nghiệm người dùng, bảo đảm tính độc lập về bảo mật và ngữ cảnh vận hành:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       RANH GIỚI BỐN BỀ MẶT TRẢI NGHIỆM                      │
├─────────────────┬─────────────────────────┬───────────────────┬─────────────┤
│ BỀ MẶT (APP)    │ ĐỐI TƯỢNG (AUDIENCE)    │ DỮ LIỆU ĐƯỢC PHÉP │ PHÂN QUYỀN  │
├─────────────────┼─────────────────────────┼───────────────────┼─────────────┤
│ 1. Public Web   │ Đại chúng, bạn bè dòng  │ Dữ liệu công bố,  │ Khách ngoài │
│  (/, index.html)│ họ, con cháu chưa định  │ Thư ngỏ, 4 câu hỏi│ (Guest /    │
│                 │ danh thành viên         │ nghiên cứu, Thẻ Mời Anonymous)  │
├─────────────────┼─────────────────────────┼───────────────────┼─────────────┤
│ 2. Member Space │ Con cháu nội ngoại của  │ Hồ sơ cá nhân,    │ Kinship     │
│  (/me/*)        │ gia tộc đã được kích    │ Phả đồ, Lịch kỵ,  │ ReBAC theo  │
│                 │ hoạt tài khoản          │ MẠCH nội bộ       │ nhánh chi   │
├─────────────────┼─────────────────────────┼───────────────────┼─────────────┤
│ 3. Admin Center │ Chủ quản gia tộc (Tuấn) │ Toàn quyền quản trị│ RBAC:       │
│  (/admin)       │ và các biên tập viên    │ CSDL, Phả hệ, Tư  │ 'owner' /   │
│                 │ được ủy quyền           │ liệu, Duyệt bài   │ 'editor'    │
├─────────────────┼─────────────────────────┼───────────────────┼─────────────┤
│ 4. Vibecode Lab │ Tuấn, Emarald, Agents   │ 100% Synthetic    │ Giả lập     │
│  (/lab.html)    │ phục vụ Prototyping     │ Fixtures sạch PII,│ Persona     │
│                 │ và Visual QA            │ 6 Persona Switcher│ Client-side │
└─────────────────┴─────────────────────────┴───────────────────┴─────────────┘
```

### Quy Tắc Dùng Chung & Phân Tách:
- **ĐƯỢC DÙNG CHUNG:** Cả 4 bề mặt đều sử dụng chung:
  - Bộ Design Tokens tại `src/shared/css/foundation.css`.
  - Bộ tiện ích tạo DOM an toàn tại `src/shared/dom/`.
  - Các định nghĩa Schema và Contracts dùng chung tại `src/shared/contracts/`.
- **BẮT BUỘC PHÂN TÁCH:**
  - Phiên làm việc (Session) của Admin (`req.session.userId`) và Member (`req.session.accountId`) hoàn toàn tách biệt.
  - Thư riêng Clara và kỷ vật thân mật **chỉ xuất hiện trong không gian Member/Admin khi được phân quyền hợp lệ**; cấm tuyệt đối xuất hiện trong Public Web hoặc Vibecode Lab ở chế độ Mock.

---

## 4. RANH GIỚI 7 MIỀN NGHIỆP VỤ (DOMAIN BOUNDARIES & OWNERSHIP)

Mỗi miền nghiệp vụ (Domain) là một module tự trị, sở hữu trọn vẹn mô hình dữ liệu (Entities) và logic tính toán của riêng mình:

| Tên Miền (Domain) | Thực Thể Sở Hữu (Entities) | Trách Nhiệm & Thuật Toán Cốt Lõi | Ranh Giới Bị Cấm |
| :--- | :--- | :--- | :--- |
| **`genealogy`** | `Person`, `Family`, `Generation` | Thuật toán xây dựng phả đồ, tính toán thế hệ ($F_0, F_1...$), tìm đường dẫn huyết thống ngắn nhất từ Cụ Khởi Tổ. | Cấm chứa mã HTML render giao diện; cấm gọi trực tiếp `fetch()` qua mạng. |
| **`kinship`** | `KinshipRelation`, `Authority` | Tính toán mức độ thân tộc (Self, Parent, Child, Sibling, Branch Head); đánh giá quyền ReBAC đối với từng hồ sơ. | Cấm hardcode tên người hoặc mã tài khoản cá nhân trong code. |
| **`editorial`** | `Story`, `Series`, `Chapter` | Quản lý vòng đời bài viết MẠCH (`DRAFT` $\rightarrow$ `PUBLISHED`), bóc tách danh mục, tính toán chỉ mục tập san. | Cấm lưu trữ chuỗi HTML độc hại chưa qua bộ lọc khử độc. |
| **`calendar`** | `LunarDate`, `RitualEvent` | Thuật toán chuyển đổi Dương lịch sang Âm lịch Việt Nam, tính toán ngày sóc vọng, tiết khí, kỵ giỗ tiền nhân theo năm nhuận. | Cấm phụ thuộc vào múi giờ client không xác định; mặc định GMT+7. |
| **`archive`** | `MediaAsset`, `PersonMedia` | Quản lý siêu dữ liệu tư liệu (năm chụp, xuất xứ, độ tin cậy chứng cứ), gán tọa độ nhận diện nhân vật trong ảnh. | Cấm sửa đổi file ảnh vật lý trên đĩa; chỉ thao tác metadata. |
| **`identity`** | `Account`, `IdentityMapping` | Quản lý trạng thái tài khoản con cháu (`PROVISIONED`, `ACTIVE`), liên kết danh tính điện tử với nhân vật gia phả. | Cấm đồng hóa việc liên kết hồ sơ với việc tự động cấp quyền Admin. |
| **`content`** | `DocumentSection`, `PublicCopy` | Quản lý các khối văn bản Trang chủ, Thẻ Mời Cửa Ngõ và nội dung ngoại giao của gia tộc. | Cấm lưu trữ văn bản cấu hình hệ thống (như port, db secret). |

---

## 5. BỘ QUY TẮC PHỤ THUỘC (DEPENDENCY RULES)

Để ngăn chặn tình trạng "Spaghetti Code" và phụ thuộc vòng (Circular Dependencies), hệ thống áp dụng 5 quy tắc nghiêm ngặt:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       5 QUY TẮC PHỤ THUỘC KIẾN TRÚC                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. CHIỀU PHỤ THUỘC MỘT CHIỀU:                                               │
│    Experience ──► Application ──► Domain ──► Platform ──► Shared Foundation │
│    Nghiêm cấm Domain import Experience; nghiêm cấm Shared import Domain.    │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. CẤM NẠP TĨNH MOCK VÀO PRODUCTION CLIENT:                                 │
│    DataService ở tầng Platform định nghĩa Interface trừu tượng. Việc nạp    │
│    HttpAdapter (gọi API thật) hay MockAdapter (nạp fixtures) do Factory      │
│    quyết định tại runtime dựa trên cấu hình môi trường.                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. GIAO TIẾP LIÊN DOMAIN QUA DỊCH VỤ CÔNG KHAI:                             │
│    Khi EditorialDomain cần thông tin nhân vật liên quan từ GenealogyDomain, │
│    bắt buộc gọi qua phương thức công khai GenealogyService.getPersonById(), │
│    cấm truy cập trực tiếp cấu trúc lưu trữ nội bộ của domain khác.         │
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. ISOLATED BACKEND SERVICES:                                               │
│    Các router Express trong server/routes/ chỉ điều phối request/response,   │
│    toàn bộ logic nghiệp vụ phải đẩy về Domain Services hoặc Database Access  │
│    Objects (DAO).                                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ 5. NO CIRCULAR IMPORTS:                                                     │
│    Nếu module A import module B, thì module B tuyệt đối không được import A.│
│    Nếu có nhu cầu chia sẻ kiểu dữ liệu, bắt buộc tách kiểu đó ra Shared.    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. CÂY THƯ MỤC NGUỒN ĐÍCH QUY CHUẨN (TARGET DIRECTORY TREE)

Cấu trúc thư mục nguồn sau khi tái cấu trúc hoàn chỉnh:

```text
giatoctrantrongthu/
├── src/                                  # TẦNG MÃ NGUỒN FRONTEND & DOMAIN
│   ├── apps/                             # 1. EXPERIENCE LAYER (Ứng dụng đầu cuối)
│   │   ├── public/                       # Cổng trải nghiệm Web Công Khai
│   │   │   ├── boot.js                   # Điểm vào khởi động (thay boot-public.js)
│   │   │   ├── home-view.js              # View Trang chủ công khai (public-home.js)
│   │   │   └── gateway-card.js           # Component Thẻ Mời Cửa Ngõ (W-B01-01)
│   │   ├── member/                       # Cổng trải nghiệm Không Gian Thành Viên
│   │   │   ├── dashboard-view.js         # Màn hình Bảng tin thành viên
│   │   │   ├── tree-view.js              # Màn hình Phả đồ tương tác
│   │   │   ├── person-view.js            # Màn hình Chi tiết hồ sơ nhân vật
│   │   │   ├── discourse-view.js         # Màn hình Đọc MẠCH & Thư gia tộc
│   │   │   └── spaces-view.js            # Màn hình Không gian chi tộc
│   │   ├── admin/                        # Unified Admin Control Center (v2.1)
│   │   │   ├── admin-shell.js            # Shell điều hướng Sidebar chuẩn WordPress
│   │   │   ├── router.js                 # Bộ định tuyến Hash Router theo cú pháp BNF
│   │   │   └── modules/                  # Các module quản trị theo domain
│   │   │       ├── mod-dashboard.js      # Module Dashboard & Cảnh báo kỵ giỗ
│   │   │       ├── mod-genealogy.js      # Module Biên tập nhân sự & gia đình
│   │   │       ├── mod-media.js          # Module Thư viện 185 tư liệu ảnh
│   │   │       ├── mod-editorial.js      # Module Soạn thảo MẠCH Markdown
│   │   │       ├── mod-calendar.js       # Module Quản lý Lịch dòng họ
│   │   │       ├── mod-public-cms.js     # Module Quản trị văn bản Trang chủ
│   │   │       ├── mod-community.js      # Module Quản lý tài khoản thành viên
│   │   │       └── mod-system.js         # Module Sức khỏe, Sao lưu, Audit Logs
│   │   └── lab/                          # Vibecode Lab Experience Studio
│   │       ├── lab-studio.js             # Bộ điều khiển Studio xem trước 7 bề mặt
│   │       ├── persona-controller.js     # Bộ chuyển đổi 6 góc nhìn Persona
│   │       ├── responsive-controller.js  # Bộ chuyển đổi 5 khung hình Viewport
│   │       └── visual-editor-bridge.js   # Cầu nối sửa nhãn trực quan có lưu vào CMS
│   │
│   ├── domain/                           # 2. DOMAIN LOGIC LAYER (Thuần JavaScript, Zero DOM)
│   │   ├── genealogy/                    # Miền Phả hệ & Thế hệ
│   │   │   ├── tree-builder.js           # Thuật toán dựng cây phả hệ
│   │   │   └── lineage-calculator.js     # Tính toán thế hệ & đường dẫn cội nguồn
│   │   ├── kinship/                      # Miền Quan hệ Thân tộc & ReBAC
│   │   │   └── kinship-evaluator.js      # Đánh giá quan hệ thân tộc & quyền hạn
│   │   ├── calendar/                     # Miền Lịch & Nghi lễ
│   │   │   ├── lunar-engine.js           # Bộ tính toán Âm lịch chuẩn Việt Nam
│   │   │   └── ritual-cadence.js         # Tính toán ngày kỵ giỗ gia tiên
│   │   ├── editorial/                    # Miền Ấn phẩm MẠCH
│   │   │   ├── markdown-pipeline.js      # Pipeline phân giải Markdown & khử độc
│   │   │   └── series-manager.js         # Quản trị chuyên đề & tập san
│   │   └── archive/                      # Miền Tư liệu & Di sản
│   │       └── media-metadata.js         # Xử lý metadata ảnh & nhãn nhân vật
│   │
│   ├── platform/                         # 3. PLATFORM SERVICES LAYER
│   │   ├── data/                         # Dịch vụ truyền thông dữ liệu
│   │   │   ├── data-service.js           # Interface giao tiếp dữ liệu chính
│   │   │   └── http-adapter.js           # Adapter gọi REST API thực tế
│   │   ├── mock/                         # Dịch vụ giả lập (Chỉ nạp khi Dev/Lab)
│   │   │   ├── mock-adapter.js           # Adapter nạp dữ liệu in-memory
│   │   │   └── mock-personas.js          # Định nghĩa 6 persona sạch PII
│   │   └── storage/                      # Dịch vụ lưu trữ cục bộ
│   │       ├── draft-store.js            # Lưu nháp bản thảo vào localStorage
│   │       └── state-cache.js            # Bộ đệm trạng thái giao diện
│   │
│   └── shared/                           # 4. SHARED FOUNDATION & CONTRACTS
│       ├── css/                          # Hệ thống Brand Design System
│       │   ├── foundation.css            # File tổng hợp nạp toàn bộ CSS
│       │   ├── tokens.css                # Biến màu sắc, khoảng cách, font
│       │   ├── layout.css                # Bố cục lưới, container, responsive
│       │   ├── typography.css            # Phân cấp kiểu chữ chuẩn gia tộc
│       │   ├── components.css            # Thư viện component CSS dùng chung
│       │   └── states.css                # Trạng thái tải, rỗng, lỗi, thành công
│       ├── dom/                          # Tiện ích DOM an toàn
│       │   ├── dom-builder.js            # Hàm tạo thẻ el(), textOrNull(), mount()
│       │   └── html-sanitizer.js         # Wrapper lọc sạch XSS qua DOMPurify
│       └── contracts/                    # Chữ ký dữ liệu & Hằng số dùng chung
│           ├── epistemic-labels.js       # 7 nhãn nhận thức tri thức gia tộc
│           ├── discourse-types.js        # Phân loại chuyên mục MẠCH & Thư từ
│           └── access-levels.js          # Các cấp độ bảo mật dữ liệu
│
├── server/                               # 5. HẠ TẦNG MÁY CHỦ (Node.js / Express 5)
│   ├── app.js                            # Cấu hình Express app, middleware, CORS
│   ├── server.js                         # Điểm khởi động server lắng nghe cổng mạng
│   ├── config/                           # Cấu hình môi trường & Secret Keys
│   ├── middleware/                       # Lớp bảo vệ an ninh
│   │   ├── session-guard.js              # Quản lý phiên cookie HttpOnly 'sid'
│   │   ├── csrf-guard.js                 # Phòng thủ CSRF 3 lớp (OWASP)
│   │   ├── rate-limiter.js               # Chống tấn công brute-force
│   │   └── auth-policy.js                # Kiểm tra quyền RBAC & ReBAC
│   ├── routes/                           # Các bộ định tuyến REST API độc lập
│   │   ├── auth-routes.js                # /api/auth/* (Đăng nhập, đăng xuất admin)
│   │   ├── member-routes.js              # /api/member/* (Xác thực thành viên, profile)
│   │   ├── admin-routes.js               # /api/admin/* (Quản trị hệ thống & nội dung)
│   │   └── public-routes.js              # /api/public/* (Dữ liệu công khai, Thẻ Mời)
│   ├── database/                         # Tầng kết nối & truy vấn CSDL
│   │   ├── connection-pool.js            # Khởi tạo kết nối SQLite / MariaDB
│   │   ├── backup-engine.js              # Động cơ SQLite Online Backup & WAL Checkpoint
│   │   └── family_archive.db             # Tệp CSDL SQLite chính thức
│   └── views/                            # Server-rendered HTML Hosts
│       ├── member_dashboard.html         # Host cho trang Dashboard thành viên
│       ├── member_tree.html              # Host cho trang Cây gia phả
│       ├── member_person.html            # Host cho trang Chi tiết nhân vật
│       └── member_mach.html              # Host cho trang MẠCH thành viên
│
├── scripts/                              # 6. KỊCH BẢN VẬN HÀNH & KIỂM THỬ (DevOps)
│   ├── dev/                              # Kịch bản hỗ trợ lập trình (serve_lab.mjs)
│   ├── qa/                               # Kịch bản kiểm thử tự động (ui_vnext_qa.mjs)
│   ├── security/                         # Kiểm tra an ninh (verify_clara_containment.mjs)
│   └── archive/                          # Lưu trữ các kịch bản patch cũ một lần
│
├── assets/                               # 7. TÀI SẢN TĨNH & KHO TƯ LIỆU GIA TỘC
│   ├── images/                           # Hình ảnh công khai, logo, sắc phong
│   └── private/                          # Tư liệu riêng tư bảo vệ (Thư Clara)
│
├── fixtures/                             # 8. TỆP DỮ LIỆU GIẢ LẬP (100% Sạch PII)
│   ├── synthetic_genealogy.json          # Phả đồ 3 đời mô phỏng
│   ├── synthetic_mach.json               # Bài viết MẠCH mô phỏng
│   └── synthetic_clara.json              # Thư riêng Clara mô phỏng
│
├── archive/                              # 9. KHO LƯU TRỮ LỊCH SỬ (Không bao giờ xóa)
│   ├── legacy-frontend/                  # member-app.js, app-v2.js, main.css cũ
│   └── historical-snapshots/             # Các bản snapshot code trước refactor
│
├── AUDIT/                                # 10. TRUNG TÂM QUẢN TRỊ KIẾN TRÚC & KẾ HOẠCH
│   ├── README.md                         # Hub điều hướng duy nhất của repository
│   ├── MASTER_COMPLETION_PLAN.md         # Lộ trình tổng thể v4.0 Canonical
│   ├── SOURCE_CODE_ARCHITECTURE_AUDIT.md # Khảo sát pháp y mã nguồn (Phase 1)
│   ├── SOURCE_CODE_TARGET_ARCHITECTURE.md# Bản đặc tả kiến trúc đích (Phase 2)
│   ├── SOURCE_CODE_MIGRATION_ROADMAP.md  # Kế hoạch chuyển đổi từng bước (Phase 3)
│   └── archive/                          # 28 tài liệu lịch sử đã hoàn thành
│
├── index.html                            # Entry Point chính thức: Public Web
├── lab.html                              # Entry Point chính thức: Vibecode Lab Studio
├── package.json                          # Manifest quản lý dự án & test scripts
└── vercel.json                           # Cấu hình triển khai Static Hosting
```

---

*Bản đặc tả Kiến Trúc Đích (Phase 2) đã hoàn thiện, xác lập cấu trúc Modular Monolith vững chắc, sẵn sàng làm cơ sở lập Kế Hoạch Chuyển Đổi tại Giai đoạn III.*

