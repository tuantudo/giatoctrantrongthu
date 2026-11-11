# BẢN ĐẶC TẢ KIẾN TRÚC MÃ NGUỒN ĐÍCH ĐÃ ĐỐI SOÁT (REVISED v2.0)
## (REVISED SOURCE CODE TARGET ARCHITECTURE — MODULAR MONOLITH SPECIFICATION)

- **Mã tài liệu:** `AUDIT/REVISED_SOURCE_CODE_TARGET_ARCHITECTURE.md`
- **Đường dẫn canonical:** `AUDIT/REVISED_SOURCE_CODE_TARGET_ARCHITECTURE.md`
- **Tài liệu đối soát nền tảng:** [`AUDIT/ARCHITECTURE_RECONCILIATION_REPORT.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/ARCHITECTURE_RECONCILIATION_REPORT.md)
- **Chỉ thị:** `# DIRECTIVE: WS08 ARCHITECTURE RECONCILIATION`
- **Dự án:** CÂY GIA PHẢ — GIA TỘC TRẦN TRỌNG THU (`giatoctrantrongthu.com`)
- **Product Owner / Thẩm quyền tối cao:** Tuấn
- **Thẩm quyền phân tích & Kiểm soát chất lượng (QC):** Emarald
- **Đơn vị điều phối & thực thi:** AGY (Primary Agent)
- **Thời điểm hoàn thành:** 2026-11-03T23:18:00+07:00

---

## 1. NGUYÊN TẮC THIẾT KẾ KIẾN TRÚC CỐT LÕI (CORE ARCHITECTURAL PRINCIPLES)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    6 NGUYÊN TẮC THIẾT KẾ KIẾN TRÚC ĐÃ ĐỐI SOÁT              │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. MODULAR MONOLITH: Gom tụ trong một kho lưu trữ duy nhất, nhưng phân định │
│    ranh giới module và quyền sở hữu miền (domain ownership) nghiêm ngặt.    │
│ 2. VANILLA JS ESM THUẦN CHUẨN: Tuyệt đối không đưa bundler (Webpack, Vite), │
│    transpiler (Babel) hay UI framework nặng (React, Vue) vào frontend.      │
│ 3. ĐỘC LẬP TẦNG MIỀN (ZERO DOM IN DOMAIN): Logic phả hệ, đại từ xưng hô,   │
│    lịch âm thuần khiết 100%, không chứa window/document/DOM dependencies.   │
│ 4. NGHỊCH ĐẢO PHỤ THUỘC (DEPENDENCY INVERSION): Client UI không import cứng │
│    mock data. Việc nạp HttpAdapter hay MockAdapter do Factory tiêm tại      │
│    Composition Root (boot.js) dựa trên cờ môi trường runtime.               │
│ 5. TÁCH BIỆT CLIENT / SERVER RUNTIME: Phân định rõ ràng mã nguồn chạy trên  │
│    trình duyệt (Browser ESM) và mã nguồn chạy trên máy chủ (Node/Express).  │
│ 6. BẢO TỒN SẢN PHẨM SỐNG: Tái cấu trúc từng bước nhỏ (Incremental), bảo    │
│    toàn 100% URL công khai, API contract và dữ liệu CSDL hiện có.           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. PHÂN TẦNG KIẾN TRÚC & PHÂN ĐỊNH RUNTIME (ARCHITECTURAL LAYERS & RUNTIME BOUNDARIES)

Hệ thống phân tách rạch ròi giữa **Client Runtime (Browser Engine)** và **Server Runtime (Node.js Engine)**, kết nối duy nhất qua giao thức HTTP REST JSON:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                     MÔ HÌNH PHÂN TẦNG VÀ RANH GIỚI THỰC THI                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  === A. CLIENT RUNTIME (TRÌNH DUYỆT WEB — BROWSER ES MODULES) ===           │
│                                                                             │
│  [ TẦNG 1: TRẢI NGHIỆM NGƯỜI DÙNG (EXPERIENCE LAYER) ]                      │
│  ├── Cổng Công Khai (index.html ──► src/js/apps/public/)                    │
│  ├── Không Gian Thành Viên (server/member_*.html ──► src/js/apps/member/)   │
│  ├── Trung Tâm Quản Trị Thống Nhất (admin/index.html ──► src/js/apps/admin/)│
│  └── Studio Thiết Kế & Prototyping (lab.html ──► src/js/apps/lab/)          │
│       │                                                                     │
│       ▼                                                                     │
│  [ TẦNG 2: NGHIỆP VỤ ỨNG DỤNG TRÌNH DIỄN (APPLICATION SHELL & FLOWS) ]      │
│  ├── Navigation Shell & Hash Routers                                        │
│  ├── Onboarding & Activation Flow                                           │
│  ├── View Controllers (Home, Tree, Person, Mạch, Spaces)                    │
│  └── Admin Module Controllers (Genealogy, Media, Editorial, System)         │
│       │                                                                     │
│       ├───────────────────────────────────┐                                 │
│       ▼ (Tính toán thuần túy)             ▼ (Truy xuất dữ liệu)             │
│  [ TẦNG 3: MIỀN LOGIC CỐT LÕI ]   [ TẦNG 4: NỀN TẢNG DỊCH VỤ CLIENT ]       │
│  (Pure Domain — Zero DOM)         (Platform Services & Abstractions)        │
│  ├── GenealogyDomain (Phả hệ)     ├── DataService (Abstract Client)         │
│  ├── KinshipDomain (Xưng hô)      │   ├── HttpAdapter (Live API)            │
│  ├── EditorialDomain (MẠCH)       │   └── MockAdapter (Synthetic Fixtures)  │
│  ├── CalendarDomain (Âm lịch)     ├── AuthService & SessionManager          │
│  └── ArchiveDomain (Tư liệu)      └── DraftStore & LocalStorage Cache       │
│       │                                   │                                 │
│       └─────────────────┬─────────────────┘                                 │
│                         ▼                                                   │
│  [ TẦNG 5: QUY CHUẨN DÙNG CHUNG (SHARED FOUNDATION & CONTRACTS) ]           │
│  ├── CSS Foundation Tokens: src/css/foundation/tokens.css                   │
│  ├── CSS Layout & Components: layout.css, components.css, states.css        │
│  ├── Safe DOM Utilities: dom-builder.js, html-sanitizer.js (DOMPurify)      │
│  └── Canonical Contracts: DTO Types, Epistemic Labels, Constants            │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  === B. GIAO TIẾP MẠNG (HTTP REST JSON — SAME ORIGIN CREDENTIALS) ===       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  === C. SERVER RUNTIME (MÁY CHỦ — NODE.JS / EXPRESS 5 ENGINE) ===           │
│                                                                             │
│  [ TẦNG 6: HẠ TẦNG & LƯU TRỮ MÁY CHỦ (INFRASTRUCTURE & PERSISTENCE) ]       │
│  ├── Express 5 App Engine (server/index.js ──► server/src/app.js)           │
│  ├── Security Guards: Session Guard ('sid'), CSRF 3 lớp, Rate Limiter       │
│  ├── Modular API Routers: /api/auth, /api/member, /api/admin, /api/public   │
│  ├── Persistence Drivers: SQLite3 (family_archive.db) / MariaDB Driver      │
│  └── Backup & Integrity Engine: Online Backup API, WAL Checkpointer         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. MA TRẬN PHỤ THUỘC & CƠ CHẾ NGHỊCH ĐẢO PHỤ THUỘC (DIP & DI)

### 3.1 Ma Trận Quyền Nạp Module Giữa Các Tầng (Dependency Import Rules)

| Tầng Nạp (Source) | Tầng Được Phép Import (Allowed Targets) | Tầng Cấm Tuyệt Đối (Forbidden Targets) |
| :--- | :--- | :--- |
| **`Experience`** | `Application`, `Shared Foundation` | `Domain` trực tiếp, `Platform Data` nội bộ, `Server/` |
| **`Application`**| `Domain`, `Client Platform`, `Shared Foundation` | `Experience` khác, `Server/` |
| **`Domain`** | Duy nhất `Shared Contracts` | `Application`, `Experience`, `Platform`, `DOM (window/document)`, `Server/` |
| **`Client Platform`**| `Shared Contracts`, `Domain Entities` | `Application`, `Experience`, `DOM Rendering` |
| **`Shared Foundation`**| Chỉ import nội bộ `shared/` | Toàn bộ các tầng còn lại (`Domain`, `Platform`, `Apps`, `Server`) |
| **`Server Infrastructure`**| `Shared Contracts`, Isomorphic `Domain` | Toàn bộ mã nguồn Client (`src/apps/`, `src/platform/`), DOM helpers |

### 3.2 Cơ Chế Dependency Injection Tại Composition Root (Pure ESM Factory)
Không sử dụng DI container. Việc hoán đổi giữa Live API và Mock Fixtures được thực hiện tại Composition Root (`src/js/ui/boot-*.js` hoặc `src/js/apps/*/boot.js`):

```javascript
// Composition Root Pattern (boot.js)
import { DataService } from '/src/js/platform/data/data-service.js';
import { HttpAdapter } from '/src/js/platform/data/http-adapter.js';

export async function bootstrapApp() {
  let adapter;
  
  // Tách biệt rạch ròi: Chỉ nạp MockAdapter khi có cờ tường minh
  if (window.__GIATOC_MOCK__ === true) {
    const { MockAdapter } = await import('/src/js/platform/mock/mock-adapter.js');
    adapter = new MockAdapter();
  } else {
    adapter = new HttpAdapter();
  }

  const dataService = new DataService(adapter);
  return dataService;
}
```

---

## 4. RANH GIỚI 5 MIỀN LOGIC CỐT LÕI & 2 PHÂN HỆ NỀN TẢNG (DOMAIN & PLATFORM CORES)

Chuẩn hóa dứt khoát: **5 Domain Cores chuyên biệt (thuần nghiệp vụ)** và **2 Phân hệ Nền tảng (Platform Services)** bám sát thực thể CSDL và Product Experience Specification v1.0:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    5 MIỀN LOGIC CỐT LÕI (src/js/domain/)                    │
├─────────────────┬───────────────────┬───────────────────────────────────────┤
│ MIỀN (DOMAIN)   │ THỰC THỂ CSDL     │ TRÁCH NHIỆM & THUẬT TOÁN PURE JS      │
├─────────────────┼───────────────────┼───────────────────────────────────────┤
│ 1. genealogy    │ people, families, │ • Thuật toán dựng cây phả hệ đa đời.  │
│                 │ edges, timeline,  │ • Phân tầng thế hệ (F0..Fn), niên biểu│
│                 │ memories          │ • Bảo tồn bất đồng phả hệ (DISPUTED). │
├─────────────────┼───────────────────┼───────────────────────────────────────┤
│ 2. kinship      │ people, edges,    │ • Thuật toán đại từ xưng hô Việt Nam. │
│                 │ authorities       │ • Đánh giá mức độ thân tộc và khoảng  │
│                 │                   │   cách huyết thống từ bản thân (Me).  │
│                 │                   │ • Kinship ReBAC Policy Guard.         │
├─────────────────┼───────────────────┼───────────────────────────────────────┤
│ 3. editorial    │ stories, authors, │ • Vòng đời bài viết MẠCH (DRAFT->PUB).│
│                 │ series            │ • Cây chuyên mục & cấu trúc tập san.  │
│                 │                   │ • Gắn nhãn nhận thức (Epistemic Status│
├─────────────────┼───────────────────┼───────────────────────────────────────┤
│ 4. calendar     │ calendar_events   │ • Động cơ chuyển đổi Âm lịch Việt Nam.│
│                 │                   │ • Thuật toán tính tiết khí, sóc vọng. │
│                 │                   │ • Tính toán ngày kỵ giỗ theo năm nhuận│
├─────────────────┼───────────────────┼───────────────────────────────────────┤
│ 5. archive      │ media,            │ • Quản lý siêu dữ liệu tư liệu ảnh.   │
│                 │ person_media      │ • Gắn thẻ khuôn mặt (Face coordinates)│
│                 │                   │ • Nguồn gốc chứng cứ & niên đại ảnh.  │
├─────────────────┴───────────────────┴───────────────────────────────────────┤
│                 2 PHÂN HỆ NỀN TẢNG HỖ TRỢ (src/js/platform/)                │
├─────────────────┬───────────────────┬───────────────────────────────────────┤
│ 6. identity     │ accounts,         │ • Quản lý phiên làm việc & token.     │
│                 │ identity_mappings │ • Ánh xạ tài khoản số vào person_id.  │
├─────────────────┼───────────────────┼───────────────────────────────────────┤
│ 7. content      │ content/ JSON     │ • Kho văn bản có cấu trúc Trang chủ.  │
│                 │ files             │ • Thẻ Mời Cửa Ngõ (W-B01-01).         │
└─────────────────┴───────────────────┴───────────────────────────────────────┘
```

---

## 5. BỐN BỀ MẶT TRẢI NGHIỆM & ĐIỂM VÀO THỰC TẾ (EXPERIENCE ENTRY POINTS)

Không có file `member.html` tại root. Hệ thống phân định 4 bề mặt trải nghiệm với các điểm vào xác định:

1. **Cổng Công Khai (Public Web Experience):**
   - *Entry point:* [`index.html`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/index.html) (Root)
   - *Script khởi động:* `/src/js/ui/boot-public.js` (chuyển đổi thành `/src/js/apps/public/boot.js`)
   - *Đối tượng:* Khách công chúng, bạn bè dòng họ, thành viên chưa đăng nhập.
2. **Không Gian Thành Viên (Member Space Experience):**
   - *Entry point:* Các host HTML được Express phục vụ có xác thực phiên:
     - `/server/member_dashboard.html` (`#/me/dashboard`)
     - `/server/member_tree.html` (`#/me/tree`)
     - `/server/member_person.html` (`#/me/person/:id`)
     - `/server/member_mach.html` (`#/me/mach`)
     - `/server/member_clara.html` (`#/me/clara` — Cô lập nhánh Hạnh Đào)
     - `/server/member_spaces.html` (`#/me/spaces` — Không gian chi nhánh)
   - *Script khởi động:* `/src/js/ui/boot-*.js` (chuyển đổi thành `/src/js/apps/member/boot.js`)
   - *Đối tượng:* Con cháu dòng họ đã kích hoạt tài khoản.
3. **Trung Tâm Quản Trị Thống Nhất (Unified Admin Control Center v2.1):**
   - *Entry point:* [`admin/index.html`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/admin/index.html) (`/admin`)
   - *Script khởi động:* `/admin/js/admin.js` (chuyển đổi thành `/src/js/apps/admin/boot.js`)
   - *Đối tượng:* Tuấn (Owner) và các biên tập viên được phân quyền RBAC.
4. **Studio Thiết Kế & Prototyping (Vibecode Lab Studio):**
   - *Entry point:* [`lab.html`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/lab.html) (`localhost:8888/lab.html`)
   - *Script khởi động:* `/src/js/ui/lab.js` (chuyển đổi thành `/src/js/apps/lab/boot.js`)
   - *Đối tượng:* Tuấn và AI Agents thiết kế, kiểm thử responsive 4 viewports không cần backend. Đồng thời, năng lực xem trước được tích hợp thành phân hệ `#/lab` trong Admin.

---

## 6. HỆ THỐNG DESIGN TOKENS CANONICAL

Vị trí chuẩn mực duy nhất của Design Tokens và CSS Foundation trong toàn bộ repository:
- **Tệp biến Token chuẩn (Variables only):** [`src/css/foundation/tokens.css`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/css/foundation/tokens.css)
- **Tệp bố cục (Layout & Grid):** [`src/css/foundation/layout.css`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/css/foundation/layout.css)
- **Tệp component dùng chung:** [`src/css/foundation/components.css`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/css/foundation/components.css)
- **Tệp trạng thái UI (States):** [`src/css/foundation/states.css`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/css/foundation/states.css)
- **Điểm vào tổng hợp duy nhất cho HTML:** [`src/css/foundation/foundation.css`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/css/foundation/foundation.css)  
  *(Cấm dùng đường dẫn ảo `src/css/tokens.css` hoặc `src/shared/css/foundation.css`)*.

---

## 7. CÂY THƯ MỤC NGUỒN ĐÍCH ĐÃ ĐỐI SOÁT (REVISED TARGET DIRECTORY TREE)

```text
giatoctrantrongthu/
├── src/                                  # TẦNG MÃ NGUỒN CLIENT & DOMAIN
│   ├── apps/                             # 1. EXPERIENCE LAYER (Ứng dụng đầu cuối)
│   │   ├── public/                       # Cổng trải nghiệm Web Công Khai
│   │   │   ├── boot.js                   # Điểm khởi động Public App
│   │   │   ├── home-view.js              # View Trang chủ công khai
│   │   │   └── gateway-card.js           # Component Thẻ Mời Cửa Ngõ (W-B01-01)
│   │   ├── member/                       # Cổng trải nghiệm Không Gian Thành Viên
│   │   │   ├── boot.js                   # Shell điều phối Member App
│   │   │   ├── dashboard-view.js         # Màn hình Bảng tin thành viên
│   │   │   ├── tree-view.js              # Màn hình Phả đồ tương tác
│   │   │   ├── person-view.js            # Màn hình Chi tiết hồ sơ nhân vật
│   │   │   ├── discourse-view.js         # Màn hình Đọc MẠCH
│   │   │   └── spaces-view.js            # Màn hình Không gian chi tộc
│   │   ├── admin/                        # Unified Admin Control Center (v2.1)
│   │   │   ├── boot.js                   # Shell điều hướng Sidebar chuẩn WordPress
│   │   │   ├── router.js                 # Bộ định tuyến Hash Router
│   │   │   └── modules/                  # Các module quản trị theo domain
│   │   │       ├── mod-dashboard.js      # Dashboard & Cảnh báo kỵ giỗ
│   │   │       ├── mod-genealogy.js      # Biên tập nhân sự & gia đình
│   │   │       ├── mod-media.js          # Thư viện 185 tư liệu ảnh
│   │   │       ├── mod-editorial.js      # Soạn thảo MẠCH Markdown
│   │   │       ├── mod-calendar.js       # Quản lý Lịch dòng họ
│   │   │       ├── mod-public-cms.js     # Quản trị văn bản Trang chủ
│   │   │       ├── mod-community.js      # Quản lý tài khoản thành viên
│   │   │       └── mod-system.js         # Sức khỏe, Sao lưu, Audit Logs
│   │   └── lab/                          # Vibecode Lab Studio (Độc lập & Tích hợp)
│   │       ├── boot.js                   # Bộ điều khiển Studio xem trước 7 bề mặt
│   │       ├── persona-controller.js     # Bộ chuyển đổi 6 góc nhìn Persona
│   │       ├── responsive-controller.js  # Bộ chuyển đổi 4 khung hình Viewport
│   │       └── visual-editor-bridge.js   # Cầu nối sửa nhãn trực quan lưu CMS
│   │
│   ├── domain/                           # 2. DOMAIN LOGIC LAYER (Zero DOM Dependency)
│   │   ├── genealogy/                    # Miền Phả hệ & Thế hệ
│   │   │   ├── tree-builder.js           # Thuật toán dựng cây phả hệ
│   │   │   ├── generation-depth.js       # Tính toán thế hệ (F0..Fn)
│   │   │   └── dispute-manager.js        # Quản lý nhãn DISPUTED_CLAIM
│   │   ├── kinship/                      # Miền Quan hệ Thân tộc & Xưng hô
│   │   │   ├── kinship-calculator.js     # Động cơ đại từ xưng hô Việt Nam
│   │   │   └── rebac-evaluator.js        # Đánh giá quyền truy cập thân tộc
│   │   ├── editorial/                    # Miền Ấn phẩm MẠCH
│   │   │   ├── markdown-pipeline.js      # Pipeline phân giải Markdown & khử độc
│   │   │   └── series-manager.js         # Quản trị chuyên đề & tập san
│   │   ├── calendar/                     # Miền Lịch & Nghi lễ
│   │   │   ├── lunar-engine.js           # Động cơ Âm lịch chuẩn Việt Nam
│   │   │   └── ritual-cadence.js         # Tính toán ngày kỵ giỗ gia tiên
│   │   └── archive/                      # Miền Tư liệu & Di sản
│   │       ├── media-metadata.js         # Xử lý metadata ảnh & xuất xứ
│   │       └── face-tagger.js            # Tọa độ nhận diện nhân vật trong ảnh
│   │
│   ├── platform/                         # 3. PLATFORM SERVICES LAYER
│   │   ├── data/                         # Dịch vụ truyền thông dữ liệu
│   │   │   ├── data-service.js           # Interface giao tiếp dữ liệu chính
│   │   │   └── http-adapter.js           # Adapter gọi REST API thực tế
│   │   ├── mock/                         # Dịch vụ giả lập (Chỉ nạp khi Dev/Lab)
│   │   │   ├── mock-adapter.js           # Adapter nạp dữ liệu in-memory
│   │   │   └── mock-personas.js          # 6 Persona sạch PII
│   │   ├── auth/                         # Dịch vụ xác thực Client
│   │   │   └── session-manager.js        # Quản lý trạng thái phiên đăng nhập
│   │   ├── content/                      # Dịch vụ nội dung tĩnh có cấu trúc
│   │   │   └── content-loader.js         # Nạp văn bản JSON (Trang chủ, Thẻ Mời)
│   │   └── storage/                      # Dịch vụ lưu trữ cục bộ
│   │       ├── draft-store.js            # Lưu nháp bản thảo vào localStorage
│   │       └── state-cache.js            # Bộ đệm trạng thái giao diện
│   │
│   ├── shared/                           # 4. SHARED UTILITIES & CONTRACTS
│   │   ├── dom/                          # Tiện ích DOM an toàn
│   │   │   ├── dom-builder.js            # Hàm tạo thẻ el(), textOrNull(), mount()
│   │   │   └── html-sanitizer.js         # Wrapper lọc sạch XSS qua DOMPurify
│   │   └── contracts/                    # Chữ ký dữ liệu & Hằng số dùng chung
│   │       ├── epistemic-labels.js       # 5 nhãn nhận thức tri thức gia tộc
│   │       ├── discourse-types.js        # Phân loại chuyên mục MẠCH & Thư từ
│   │       └── access-levels.js          # Các cấp độ bảo mật dữ liệu
│   │
│   └── css/                              # 5. HỆ THỐNG CSS FOUNDATION CANONICAL
│       └── foundation/                   # Vị trí canonical duy nhất của Design Tokens
│           ├── tokens.css                # Biến màu sắc, khoảng cách, font
│           ├── layout.css                # Bố cục lưới, container, responsive
│           ├── components.css            # Thư viện component CSS dùng chung
│           ├── states.css                # Trạng thái tải, rỗng, lỗi, thành công
│           └── foundation.css            # File tổng hợp nạp toàn bộ CSS qua @import
│
├── server/                               # 6. HẠ TẦNG MÁY CHỦ (Node.js / Express 5)
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
│       ├── member_mach.html              # Host cho trang MẠCH thành viên
│       ├── member_clara.html             # Host cho trang Thư Clara (Cô lập an ninh)
│       └── member_spaces.html            # Host cho trang Không gian gia đình nhánh
│
├── admin/                                # Entry Point Admin Web
│   ├── index.html                        # Điểm vào chính thức của Admin Control Center
│   ├── js/                               # Mã nguồn giao diện quản trị hiện tại
│   └── css/                              # Mã nguồn CSS quản trị hiện tại
│
├── scripts/                              # KỊCH BẢN VẬN HÀNH & KIỂM THỬ (DevOps)
│   ├── dev/                              # Kịch bản hỗ trợ lập trình (serve_lab.mjs)
│   ├── qa/                               # Kịch bản kiểm thử tự động (ui_vnext_qa.mjs)
│   ├── security/                         # Kiểm tra an ninh (verify_clara_containment.mjs)
│   └── archive/                          # Lưu trữ các kịch bản patch cũ một lần
│
├── assets/                               # TÀI SẢN TĨNH & KHO TƯ LIỆU GIA TỘC
│   ├── images/                           # Hình ảnh công khai, logo, sắc phong
│   └── private/                          # Tư liệu riêng tư bảo vệ (Thư Clara)
│
├── fixtures/                             # TỆP DỮ LIỆU GIẢ LẬP (100% Sạch PII)
│   ├── synthetic_genealogy.json          # Phả đồ 3 đời mô phỏng
│   ├── synthetic_mach.json               # Bài viết MẠCH mô phỏng
│   └── synthetic_clara.json              # Thư riêng Clara mô phỏng
│
├── archive/                              # KHO LƯU TRỮ LỊCH SỬ (Không bao giờ xóa)
│   ├── scripts/                          # 54 kịch bản patch một lần từ root
│   ├── legacy-frontend/                  # member-app.js, main.css cũ
│   └── historical-snapshots/             # Các bản snapshot code trước refactor
│
├── AUDIT/                                # TRUNG TÂM QUẢN TRỊ KIẾN TRÚC & KẾ HOẠCH
│   ├── README.md                         # Hub điều hướng duy nhất của repository
│   ├── MASTER_COMPLETION_PLAN.md         # Lộ trình tổng thể v4.0 Canonical
│   ├── ARCHITECTURE_RECONCILIATION_REPORT.md # Báo cáo đối soát kiến trúc R01-R06
│   ├── REVISED_SOURCE_CODE_TARGET_ARCHITECTURE.md # Bản đặc tả kiến trúc đích đã đối soát
│   ├── REVISED_SOURCE_CODE_MIGRATION_ROADMAP.md # Bản lộ trình di chuyển đã đối soát
│   ├── WS08_MASTER_PLAN_CHANGE_PROPOSAL.md # Bản đề xuất thay đổi Master Plan
│   └── archive/                          # 28 tài liệu lịch sử đã hoàn thành
│
├── index.html                            # Entry Point chính thức: Public Web
├── lab.html                              # Entry Point chính thức: Vibecode Lab Studio
├── package.json                          # Manifest quản lý dự án & scripts kiểm thử
└── vercel.json                           # Cấu hình triển khai Static Hosting
```

---

*Bản Đặc Tả Kiến Trúc Đích Đã Đối Soát (Revised v2.0) là chuẩn mực kỹ thuật tối cao cho toàn bộ quá trình tái cấu trúc mã nguồn dự án Gia Tộc Trần Trọng Thu.*

