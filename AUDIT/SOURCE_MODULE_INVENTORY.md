# BẢN KIỂM KÊ & ÁNH XẠ MÃ NGUỒN HIỆN TRẠNG
## (SOURCE CODE INVENTORY & TARGET MODULE MAPPING)

- **Mã tài liệu:** `AUDIT/SOURCE_MODULE_INVENTORY.md`
- **Chỉ thị:** `# DIRECTIVE: WS08 → SOURCE MODULARIZATION & MASTER PLAN DECOMPOSITION`
- **Dự án:** CÂY GIA PHẢ — GIA TỘC TRẦN TRỌNG THU (`giatoctrantrongthu.com`)
- **Product Owner / Thẩm quyền tối cao:** Tuấn
- **Architecture & QC:** Emarald
- **Execution Coordinator:** AGY (Primary Agent)
- **Chế độ:** `CONTROLLED INCREMENTAL EXECUTION — BATCH 01`
- **Thời điểm hoàn thành:** 2026-11-04T00:05:00+07:00

---

## 1. TỔNG QUAN HIỆN TRẠNG TOÀN BỘ KHO MÃ NGUỒN

Qua quá trình quét kiểm kê toàn diện mã nguồn đang hoạt động trong repository (tổng cộng 12.143 dòng JavaScript, 1.200+ dòng CSS và các file schema CSDL):

```text
┌────────────────────────────────────────────────────────────────────────┐
│               PHÂN BỐ DÒNG CODE VÀ VAI TRÒ TRONG CODEBASE              │
├─────────────────────┬──────────────┬─────────────┬─────────────────────┤
│ PHÂN VÙNG / TẦNG    │ SỐ LƯỢNG TỆP │ TỔNG SỐ DÒNG│ VAI TRÒ THỰC THI    │
├─────────────────────┼──────────────┼─────────────┼─────────────────────┤
│ 1. Client UI vNEXT  │ 28 tệp .js   │ 4.968 dòng  │ Giao diện ESM thuần │
│    (src/js/ui/)     │              │             │ Public, Member, Lab │
├─────────────────────┼──────────────┼─────────────┼─────────────────────┤
│ 2. Client Core      │ 2 tệp .js    │ 140 dòng    │ Âm lịch, ICS Parser │
│    (src/js/core/)   │              │             │ (Chưa tách Domain)  │
├─────────────────────┼──────────────┼─────────────┼─────────────────────┤
│ 3. Legacy Frontend  │ 3 tệp .js    │ 3.756 dòng  │ member-app (2.964), │
│    (src/js/)        │              │             │ app-v2, mirror      │
├─────────────────────┼──────────────┼─────────────┼─────────────────────┤
│ 4. Admin Web        │ 5 tệp .js    │ 973 dòng    │ Quản trị admin.js,  │
│    (admin/js/)      │ 2 tệp HTML   │             │ api, login, mockData│
├─────────────────────┼──────────────┼─────────────┼─────────────────────┤
│ 5. Server Backend   │ 15 tệp .js   │ 2.306 dòng  │ Express, member,    │
│    (server/)        │ 7 tệp HTML   │             │ auth, spaces, seed  │
├─────────────────────┼──────────────┼─────────────┼─────────────────────┤
│ 6. CSS Foundation   │ 5 tệp .css   │ 1.150 dòng  │ tokens, layout,     │
│    (src/css/)       │              │             │ components, states  │
├─────────────────────┼──────────────┼─────────────┼─────────────────────┤
│ 7. Root Scripts     │ 54 tệp       │ ~2.500 dòng │ Patch scripts &     │
│    (*.py, *.js)     │              │             │ CLI tools cũ        │
└─────────────────────┴──────────────┴─────────────┴─────────────────────┘
```

---

## 2. BẢNG KIỂM KÊ CHI TIẾT TỪNG TỆP NGUỒN HIỆN TẠI (SOURCE INVENTORY)

### 2.1 Nhóm Giao Diện Client Active (Active Client UI Layer — `src/js/ui/`)

| Đường Dẫn Tệp Hiện Tại | Số Dòng | Trách Nhiệm Hiện Tại | Inbound Dependents (Tệp Gọi Đến) | Outbound Dependencies (Tệp Bị Gọi) | Đánh Giá Cấu Trúc |
| :--- | :---: | :--- | :--- | :--- | :--- |
| `src/js/ui/boot-public.js` | 41 | Điểm khởi động Public App trên `index.html` | `index.html` | `navigation.js`, `shell.js`, `public-home.js`, `assets.js`, `tokens.js` | Tốt; Composition Root của Public App. |
| `src/js/ui/boot-dashboard.js` | 37 | Điểm khởi động Member Home | `server/member_dashboard.html` | `navigation.js`, `shell.js`, `dashboard.js`, `assets.js`, `tokens.js` | Tốt; Composition Root của Member Home. |
| `src/js/ui/boot-tree.js` | 34 | Điểm khởi động Cây Phả Hệ | `server/member_tree.html` | `navigation.js`, `shell.js`, `tree.js`, `assets.js`, `tokens.js` | Tốt; Composition Root của Phả Hệ. |
| `src/js/ui/boot-person.js` | 35 | Điểm khởi động Hồ Sơ Nhân Vật | `server/member_person.html` | `navigation.js`, `shell.js`, `person.js`, `assets.js`, `tokens.js` | Tốt; Composition Root của Person View. |
| `src/js/ui/boot-discourse.js`| 39 | Điểm khởi động Đọc MẠCH / Clara | `server/member_mach.html`, `server/member_clara.html` | `navigation.js`, `shell.js`, `discourse.js`, `assets.js`, `tokens.js` | Tốt; Composition Root của MẠCH. |
| `src/js/ui/boot-spaces.js` | 33 | Điểm khởi động Không Gian Nhánh | `server/member_spaces.html` | `navigation.js`, `shell.js`, `spaces.js`, `assets.js`, `tokens.js` | Tốt; Composition Root của Spaces. |
| `src/js/ui/public-home.js` | 292 | Render trang chủ công khai + text | `boot-public.js`, `lab.js` | `dom.js` | Chứa text hardcode (cần tách sang `content/`). |
| `src/js/ui/dashboard.js` | 175 | Render bảng tin thành viên 7 widget | `boot-dashboard.js`, `lab.js` | `dom.js`, `components.js`, `states.js`, `data.js` | Tốt; view controller sạch. |
| `src/js/ui/tree.js` | 165 | Render phả đồ tương tác canvas/DOM | `boot-tree.js`, `lab.js` | `dom.js`, `components.js`, `states.js`, `data.js` | Trộn lẫn SVG render với logic phân thế hệ. |
| `src/js/ui/person.js` | 209 | Render hồ sơ nhân vật 6 tầng | `boot-person.js`, `lab.js` | `dom.js`, `components.js`, `states.js`, `data.js` | Trộn lẫn hiển thị với logic xưng hô. |
| `src/js/ui/discourse.js` | 142 | Render bài đọc MẠCH & Thư Clara | `boot-discourse.js`, `lab.js`| `dom.js`, `data.js`, `states.js`, `editorial.js`, `components.js`, `contexts.js`, `domain/editorial/` | Tốt; phân tách scope và author/series giải quyết qua `domain/editorial/`. |
| `src/js/ui/spaces.js` | 45 | Render danh sách không gian gia đình | `boot-spaces.js`, `lab.js` | `dom.js`, `components.js`, `states.js` | Khung sườn tĩnh, chờ dữ liệu nhánh. |
| `src/js/ui/editorial.js` | 215 | Component Masthead & Reading Surface (Facade) | `discourse.js` | `dom.js`, `contexts.js`, `domain/editorial/` | UI Facade; logic nghiệp vụ bài viết/series/tác giả đã chuyển sang `src/js/domain/editorial/`. |
| `src/js/ui/data.js` | 70 | Facade tương thích ngược trên Data Inversion Layer | Toàn bộ view controllers | `../platform/data/index.js`, `mock-adapter.js` | **ĐÃ GIẢI QUYẾT DIP**: Ủy thác hoàn toàn cho `createDataService()`; gỡ bỏ coupling cứng; re-export `indexPeople`, `nameOf` từ domain; bảo tồn 100% backward compatibility. |
| `src/js/ui/mock-adapter.js`| 214 | Provider giả lập fixtures & persona | `data.js`, `lab.js` | Không có | Tốt cho dev, nhưng không được import cứng ở production. |
| `src/js/ui/lab.js` | 1.469 | Bộ điều khiển toàn diện Lab Studio | `lab.html` | Toàn bộ view modules, `mock-adapter.js`, `draft-store.js` | God File của Lab: chứa cả persona, responsive switch và visual editor. |
| `src/js/ui/components.js` | 253 | Component UI dùng chung (PageHeader, Section, PersonCard) | Hầu hết các views | `dom.js` | Tốt; các component hiển thị hạt nhân. |
| `src/js/ui/dom.js` | 71 | Tiện ích DOM (`el`, `textOrNull`, `initials`) | Hầu hết các views | Không có | Tiện ích cơ sở rất tốt; cần đưa vào `src/js/shared/dom/`. |
| `src/js/ui/shell.js` | 144 | Khung viền hệ thống (Masthead, Nav, Colophon) | Toàn bộ `boot-*.js`, `lab.js` | `dom.js`, `components.js`, `visibility.js`, `assets.js` | Shell chuẩn của toàn bộ hệ thống. |
| `src/js/ui/navigation.js` | 166 | Định tuyến ngữ cảnh & sitemap | Toàn bộ `boot-*.js`, `lab.js` | `contexts.js` | Sơ đồ ngữ cảnh và phân tầng điều hướng. |
| `src/js/ui/visibility.js` | 116 | Thanh hiển thị ngữ cảnh bảo mật ContextBar | `shell.js` | `dom.js`, `contexts.js` | Hiển thị access level và dataset trung thực. |
| `src/js/ui/contexts.js` | 260 | Hằng số ngữ cảnh, nhãn nhận thức, discourse scopes | Hầu hết các module | Không có | Hằng số nghiệp vụ; cần tách sang `contracts/`. |
| `src/js/ui/states.js` | 198 | Component trạng thái (Empty, Loading, Error) | Hầu hết các views | `dom.js` | Tốt; xử lý trạng thái hiển thị trung thực. |
| `src/js/ui/tokens.js` | 44 | Cài đặt typography & viewport class | Toàn bộ `boot-*.js` | Không có | Helper gắn class cho `document.body`. |
| `src/js/ui/assets.js` | 43 | Quản lý manifest ảnh & favicon | Toàn bộ `boot-*.js` | Không có | Helper nạp manifest tài nguyên tĩnh. |
| `src/js/ui/draft-store.js`| 203 | Lưu nháp bản thảo vào LocalStorage | `lab.js` | Không có | Dịch vụ client platform lưu trữ nháp. |
| `src/js/ui/nav-store.js` | 161 | Lưu vết điều hướng client | `lab.js` | Không có | Dịch vụ client platform theo dõi route. |
| `src/js/ui/epistemic.js` | 60 | Nhãn nhận thức dữ kiện phả hệ | Test, person profile | Không có | Cần chuẩn hóa vào `shared/contracts/`. |

---

### 2.2 Nhóm Thuật Toán Cốt Lõi (Core Algorithms — `src/js/core/`)

| Đường Dẫn Tệp Hiện Tại | Số Dòng | Trách Nhiệm Hiện Tại | Inbound Dependents | Outbound Dependencies | Đánh Giá Cấu Trúc |
| :--- | :---: | :--- | :--- | :--- | :--- |
| `src/js/core/lunar-engine.js` | 87 | Chuyển đổi Dương ──► Âm lịch Việt Nam | `server/calendars/`, `test`, legacy `<script>` | Không có | Thuật toán pure JS; đã hiện đại hóa tại `src/js/shared/utils/date-lunar.js` & `src/js/domain/calendar/lunar.js`; file gốc giữ làm fallback cho thẻ `<script>`. |
| `src/js/core/ics-parser.js` | 53 | Phân giải tệp lịch iCalendar (.ics) | Lịch gia tộc, `app-v2.js` | Không có | Tiện ích phân giải text; đã hiện đại hóa tại `src/js/domain/calendar/parser.js`; file gốc giữ làm facade cho thẻ `<script>`. |

---

### 2.3 Nhóm Mã Kế Thừa Lịch Sử (Legacy Monolith & Prototypes — `src/js/`)

| Đường Dẫn Tệp Hiện Tại | Số Dòng | Trách Nhiệm Hiện Tại | Trạng Thái Thực Tế | Nguy Cơ Đối Với Codebase |
| :--- | :---: | :--- | :--- | :--- |
| `src/js/member-app.js` | 2.964 | Ứng dụng thành viên nguyên khối cũ (Gen 1) | **BỊ BỎ HOANG (ORPHANED)**. Không còn file HTML nào nạp. | Gây nhiễu context AI, nặng 92KB, chứa logic phả hệ trộn lẫn DOM cũ. |
| `src/js/app-v2.js` | 576 | Bản thử nghiệm chuyển tiếp giữa Gen 1 và vNEXT | **KHÔNG DÙNG**. | Tệp tạm trong quá trình phát triển cũ. |
| `src/js/mirror.js` | 216 | Bộ render bản mirror tĩnh offline | Dùng cho `mirror.html`. | Có giá trị tra cứu offline độc lập; cần cô lập. |

---

### 2.4 Nhóm Quản Trị Hệ Thống (Admin Control Room — `admin/`)

| Đường Dẫn Tệp Hiện Tại | Số Dòng | Trách Nhiệm Hiện Tại | Vấn Đề Kỹ Thuật | Hướng Xử Lý |
| :--- | :---: | :--- | :--- | :--- |
| `admin/js/admin.js` | 778 | Toàn bộ view & router của Admin hiện tại | Dùng `innerHTML` nối chuỗi trực tiếp (nguy cơ XSS), không dùng Brand Tokens | Tái cấu trúc thành `src/js/apps/admin/` theo chuẩn v2.1. |
| `admin/js/api.js` | 111 | Client gọi API backend `/api/admin/*` | Gửi request có kèm credentials | Chuyển thành Admin Api Service. |
| `admin/js/login.js` | 30 | Xử lý form đăng nhập Admin | Quản lý form cơ bản | Tích hợp vào Auth flow của Admin. |
| `admin/js/mockData.js` | 27 | Dữ liệu mẫu admin | Dữ liệu mock tĩnh | Gộp vào fixture testing. |
| `admin/css/admin.css` | 350 | CSS giao diện Admin | Định nghĩa lại màu sắc, không dùng `tokens.css` | Chuyển sang dùng chung `src/css/foundation/foundation.css`. |

---

### 2.5 Nhóm Máy Chủ Backend (Node.js / Express 5 — `server/`)

| Đường Dẫn Tệp Hiện Tại | Số Dòng | Trách Nhiệm Hiện Tại | Vấn Đề Kỹ Thuật | Hướng Xử Lý |
| :--- | :---: | :--- | :--- | :--- |
| `server/index.js` | 596 | Bootstrap máy chủ, cấu hình Express, 15+ inline API routes | **GOD FILE BACKEND**: Trộn lẫn CORS, rate limit, static serving, và logic database | Tách thành `app.js`, `server.js`, `routes/`, `middleware/`. |
| `server/member.js` | 394 | Router `/me/*`, bảo vệ session `requireAccount`, cấp phát host HTML | Tốt về logic bảo mật, nhưng chứa cả view routing lẫn profile API | Tách `member-routes.js` và `member-view-routes.js`. |
| `server/auth.js` | 261 | Xác thực thành viên, Google OAuth, kích hoạt token | Khá tốt; có logic bảo mật chặt chẽ | Tách thành `auth-routes.js` và `auth-service.js`. |
| `server/spaces_router.js`| 393 | Quản lý không gian gia đình nhánh con | Khá độc lập; đã có cấu trúc router riêng | Chuẩn hóa thành `spaces-routes.js`. |
| `server/foundation.js` | 98 | Khởi tạo CSDL, SQLite accessor wrapper | Cung cấp hàm `getQuery`, `allQuery`, `runQuery` | Đưa vào `server/src/database/sqlite-client.js`. |
| `server/db_seed.js` | 93 | Nạp dữ liệu mẫu ban đầu | Script hỗ trợ dev | Chuyển vào `server/src/database/seeds/`. |
| `server/db_reset.js` | 57 | Xóa và tạo lại bảng CSDL | Script hỗ trợ dev | Giữ trong `server/scripts/`. |
| `server/dev_setup_onboarding.js` | 57 | Tạo tài khoản mẫu dev | Script hỗ trợ dev | Giữ trong `server/scripts/`. |
| `server/verify_mvp.js` | 53 | Kiểm tra tính toàn vẹn CSDL sau seed | Script kiểm thử | Giữ trong `server/scripts/`. |
| `server/calendars/*.ics` | 4 tệp | 4 file lịch mẫu dòng họ (Sinh nhật, Kỵ giỗ...) | Đang được Express phục vụ tốt | Giữ nguyên vẹn tại `server/calendars/`. |

---

### 2.6 Nhóm Kiến Trúc Hiện Đại Hóa (Modernized Architecture — `src/js/shared/`, `src/js/domain/`, `src/js/platform/`)

| Đường Dẫn Tệp Mới | Trách Nhiệm Kỹ Thuật | Phụ Thuộc (Outbound) | Người Tiêu Thụ (Consumers) | Đánh Giá Kiến Trúc & Kiểm Thử |
| :--- | :--- | :--- | :--- | :--- |
| **`src/js/shared/`** | **Tầng Dùng Chung (Shared Layer & Design Tokens — SC-02)** | | | |
| `src/js/shared/utils/dom-helpers.js` | Tiện ích DOM cốt lõi (`el`, `textOrNull`, `initials`, v.v.) | Không | `src/js/ui/dom.js`, view modules | Zero dependency; pass 100% `test_shared_layer.mjs`. |
| `src/js/shared/utils/formatting.js` | Tiện ích định dạng ngày tháng, số, chuỗi | Không | UI modules | Pass 100% `test_shared_layer.mjs`. |
| `src/js/shared/utils/date-lunar.js` | Thuật toán âm lịch Việt Nam pure JS | Không | Calendar domain | Pass 100% parity với `lunar-engine.js`. |
| `src/js/shared/contracts/tokens.js` | Hằng số Design Tokens, Viewport, Epistemic | Không | UI modules, facades | Deeply frozen; pass 100%. |
| `src/js/shared/event-bus.js` | Cơ chế Pub/Sub trung tâm decoupling modules | Không | UI modules | Type-safe subscriptions; pass 100%. |
| `src/js/shared/index.js` | Barrel export trung tâm cho Tầng Shared | Các modules con | External consumers | Export đầy đủ. |
| **`src/js/domain/`** | **Tầng Nghiệp Vụ Thuần Túy (Pure Domain Cores — SC-03)** | | | **Zero DOM, Zero Browser Globals, Zero UI** |
| `src/js/domain/genealogy/` | Logic phả đồ (`graph.js`, `search.js`, `temporal.js`, `index.js`) | Không | `src/js/ui/tree.js`, `data.js` | 100% test pass; 223 cá nhân fixture index chính xác. |
| `src/js/domain/calendar/` | Nghiệp vụ lịch (`events.js`, `lunar.js`, `parser.js`, `index.js`) | `shared/utils/date-lunar` | Calendar UI | 100% parity trên 265 sự kiện từ 4 tệp ICS thật. |
| `src/js/domain/editorial/` | Quy tắc biên tập MẠCH (`articles`, `authors`, `scope`, `series`, `index.js`)| Không | `ui/editorial.js`, `ui/discourse.js`| 24/24 tests pass; cô lập tuyệt đối Thư Clara (Zero Leak). |
| `src/js/domain/kinship/` | Quy tắc xưng hô & thế hệ (`calc.js`, `addressing.js`, `index.js`) | Không | `ui/person.js`, `genealogy/graph.js`| BFS tính delta thế hệ, phân cấp xưng hô Việt Nam chuẩn mực. |
| `src/js/domain/archive/` | Quản trị tư liệu (`media.js`, `metadata.js`, `index.js`) | Không | Media views, person media | Heuristic relation mapping giải quyết 173/173 ảnh (100%). |
| **`src/js/platform/data/`** | **Tầng Đảo Ngược Phụ Thuộc Dữ Liệu (Platform Data Inversion — SC-04)** | | | **Tuân thủ triệt để Dependency Inversion Principle** |
| `src/js/platform/data/service.js` | `DataService` wrapper với in-memory caching & TTL | Pluggable adapter | `factory.js`, `ui/data.js` | Zero DOM; cache hit/miss/bypass/TTL/clear. |
| `src/js/platform/data/http-adapter.js`| `HttpDataAdapter` gọi REST API backend | `fetch` (injected/global) | `factory.js` | Xử lý 401 unauth redirect và error propagation. |
| `src/js/platform/data/mock-adapter.js`| `MockDataAdapter` nạp fixture synthetic cho Lab | Fixture files / memory | `factory.js`, Vibecode Lab | Phân quyền persona (`A-HD`, `A-OB`, `ANONYMOUS`). |
| `src/js/platform/data/factory.js` | `createDataService` factory tự động phát hiện mode (`mock` vs `live`)| Các adapters | `ui/data.js` | Tự động switch mode theo URL/localStorage/env. |
| `src/js/platform/data/index.js` | Barrel export trung tâm cho Platform Data Layer | Các modules con | `ui/data.js` và consumers | Export đầy đủ. |

---

## 3. BẢNG MA TRẬN ÁNH XẠ: HIỆN TRẠNG ──► KIẾN TRÚC ĐÍCH (MAPPING MATRIX)

Bảng đối soát chuyển đổi 1-1, N-1 hoặc phân rã từ mã nguồn hiện tại sang cấu trúc Modular Monolith đích:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        BẢN ĐỒ CHUYỂN ĐỔI MÃ NGUỒN HIỆN TRẠNG                           │
├───────────────────────────────┬──────────────────────────────────┬─────────────────────┤
│ TỆP / THÀNH PHẦN HIỆN TẠI     │ VỊ TRÍ ĐÍCH TRONG KIẾN TRÚC     │ HÌNH THỨC CHUYỂN ĐỔI│
├───────────────────────────────┼──────────────────────────────────┼─────────────────────┤
│ === A. TẦNG TRẢI NGHIỆM (EXPERIENCE LAYER — src/js/apps/) ===                         │
├───────────────────────────────┼──────────────────────────────────┼─────────────────────┤
│ src/js/ui/boot-public.js      │ src/js/apps/public/boot.js       │ Di chuyển & Rename  │
│ src/js/ui/public-home.js      │ src/js/apps/public/home-view.js  │ Tách text sang CMS  │
│ (Component mới: W-B01-01)     │ src/js/apps/public/gateway.js    │ Xây mới Thẻ Mời     │
├───────────────────────────────┼──────────────────────────────────┼─────────────────────┤
│ src/js/ui/boot-dashboard.js   │ src/js/apps/member/boot.js       │ Hợp nhất App Shell  │
│ src/js/ui/dashboard.js        │ src/js/apps/member/views/dash.js │ Di chuyển cấu trúc  │
│ src/js/ui/tree.js (phần DOM)  │ src/js/apps/member/views/tree.js │ Rút pure domain ra  │
│ src/js/ui/person.js (phần DOM)│ src/js/apps/member/views/pers.js │ Rút kinship rule ra │
│ src/js/ui/discourse.js        │ src/js/apps/member/views/disc.js │ Di chuyển cấu trúc  │
│ src/js/ui/spaces.js           │ src/js/apps/member/views/spac.js │ Di chuyển cấu trúc  │
├───────────────────────────────┼──────────────────────────────────┼─────────────────────┤
│ admin/js/admin.js             │ src/js/apps/admin/boot.js & mods │ Tái cấu trúc v2.1   │
│ admin/js/api.js               │ src/js/apps/admin/admin-api.js   │ Chuẩn hóa API Client│
│ admin/css/admin.css           │ (Bị bãi bỏ; dùng foundation.css) │ Đồng bộ Tokens      │
├───────────────────────────────┼──────────────────────────────────┼─────────────────────┤
│ src/js/ui/lab.js (Điều khiển) │ src/js/apps/lab/lab-studio.js    │ Phân rã God File    │
│ src/js/ui/contexts.js (Persona)│ src/js/apps/lab/persona-ctrl.js │ Tách controller     │
├───────────────────────────────┼──────────────────────────────────┼─────────────────────┤
│ === B. TẦNG MIỀN NGHIỆP VỤ (DOMAIN CORE LAYER — src/js/domain/ — ZERO DOM) ===       │
├───────────────────────────────┼──────────────────────────────────┼─────────────────────┤
│ src/js/ui/tree.js (Thuật toán)│ src/js/domain/genealogy/tree.js  │ Trích xuất Pure JS  │
│ src/js/ui/data.js:indexPeople │ src/js/domain/genealogy/graph.js │ Trích xuất Pure JS  │
│ src/js/member-app.js (Hàm cũ) │ src/js/domain/kinship/calc.js    │ Cứu thuật toán xưng │
│                               │                                  │ hô, bỏ toàn bộ DOM  │
│ src/js/core/lunar-engine.js   │ src/js/domain/calendar/lunar.js  │ Di chuyển nguyên vẹn│
│ src/js/core/ics-parser.js     │ src/js/domain/calendar/ics.js    │ Di chuyển nguyên vẹn│
│ src/js/ui/editorial.js (Logic)│ src/js/domain/editorial/         │ Hoàn tất: articles, │
│                               │                                  │ series, authors,    │
│                               │                                  │ scope (Clara zero)  │
│ (Logic metadata & tag)        │ src/js/domain/archive/media.js   │ Tạo module tư liệu  │
├───────────────────────────────┼──────────────────────────────────┼─────────────────────┤
│ === C. TẦNG DỊCH VỤ NỀN TẢNG (PLATFORM SERVICES LAYER — src/js/platform/) ===        │
├───────────────────────────────┼──────────────────────────────────┼─────────────────────┤
│ src/js/ui/data.js (Interface) │ src/js/platform/data/service.js  │ DataService trừu tượng│
│ src/js/ui/data.js (fetchJSON) │ src/js/platform/data/http-adp.js │ HttpAdapter gọi API │
│ src/js/ui/mock-adapter.js     │ src/js/platform/mock/mock-adp.js │ MockAdapter cô lập  │
│ src/js/ui/draft-store.js      │ src/js/platform/storage/draft.js │ Di chuyển cấu trúc  │
│ src/js/ui/nav-store.js        │ src/js/platform/storage/nav.js   │ Di chuyển cấu trúc  │
├───────────────────────────────┼──────────────────────────────────┼─────────────────────┤
│ === D. TẦNG DÙNG CHUNG (SHARED FOUNDATION & CONTRACTS — src/js/shared/) ===          │
├───────────────────────────────┼──────────────────────────────────┼─────────────────────┤
│ src/js/ui/dom.js              │ src/js/shared/dom/dom-builder.js │ Di chuyển tiện ích  │
│ (Khử độc DOMPurify wrapper)   │ src/js/shared/dom/sanitizer.js   │ Tạo wrapper chuẩn   │
│ src/js/ui/contexts.js (Hằng số│ src/js/shared/contracts/types.js │ Gom hằng số/types   │
│ src/js/ui/epistemic.js        │ src/js/shared/contracts/epist.js │ Gom nhãn nhận thức  │
│ src/css/foundation/tokens.css │ src/css/foundation/tokens.css    │ BẢO TỒN CANONICAL   │
│ src/css/foundation/found.css  │ src/css/foundation/found.css     │ BẢO TỒN CANONICAL   │
├───────────────────────────────┼──────────────────────────────────┼─────────────────────┤
│ === E. TẦNG HẠ TẦNG MÁY CHỦ (SERVER INFRASTRUCTURE — server/src/) ===                 │
├───────────────────────────────┼──────────────────────────────────┼─────────────────────┤
│ server/index.js (Express app) │ server/src/app.js                │ Tách cấu hình app   │
│ server/index.js (Lắng nghe)   │ server/src/server.js             │ File khởi động nhẹ  │
│ server/auth.js                │ server/src/routes/auth-routes.js │ Chuẩn hóa Router    │
│ server/member.js              │ server/src/routes/member-routes.js Chuẩn hóa Router   │
│ server/spaces_router.js       │ server/src/routes/spaces-routes.js Chuẩn hóa Router   │
│ server/index.js (Inline APIs) │ server/src/routes/api-routes.js  │ Tách các API phụ    │
│ server/foundation.js          │ server/src/database/db-client.js │ DAO wrapper chuẩn   │
├───────────────────────────────┼──────────────────────────────────┼─────────────────────┤
│ === F. LƯU TRỮ VẬN HÀNH & KẾ THỪA (ARCHIVE & OPERATIONAL TOOLS) ===                  │
├───────────────────────────────┼──────────────────────────────────┼─────────────────────┤
│ 33 patch scripts tại root     │ scripts/archive/legacy/code_patches/ │ Lưu trữ an toàn │
│ 4 one-off doc/report scripts  │ scripts/archive/legacy/doc_generators/ │ Lưu trữ tài liệu│
│ 4 CLI tools (2 DB + 2 MCP)    │ scripts/tools/                   │ BẢO TỒN CÔNG CỤ CLI │
│ 13 foreign campaign scripts   │ Mini Expo Workspace (ARCHIVE/)   │ ĐÃ CHUYỂN VỀ DỰ ÁN GỐC│
│ src/js/member-app.js (2.964 d)│ archive/legacy-frontend/         │ Cô lập lịch sử      │
│ src/js/app-v2.js (576 dòng)   │ archive/legacy-frontend/         │ Cô lập lịch sử      │
└───────────────────────────────┴──────────────────────────────────┴─────────────────────┘
```

---

## 4. DANH MỤC THÀNH PHẦN TRÙNG LẶP & CÁC VẤN ĐỀ CẤU TRÚC (DEBT & DEFECT REGISTER)

1. **Trùng lặp helper hàm chuỗi và xưng hô:**
   - Hàm `initials()`, `textOrNull()` xuất hiện cả trong `src/js/ui/dom.js`, `src/js/ui/components.js` và bản cũ `src/js/member-app.js`.
   - *Hành động:* Tập trung hóa 100% vào `src/js/shared/dom/dom-builder.js` và `src/js/shared/formatters.js`.
2. **Coupling cứng Mock Adapter:**
   - `src/js/ui/data.js:11` gọi thẳng `mock-adapter.js`.
   - *Hành động:* Xóa import tĩnh; chuyển sang tiêm qua `AdapterFactory` tại Composition Root.
3. **Mã nguồn ma (Ghost / Orphaned Legacy):**
   - `src/js/member-app.js` (2.964 dòng) chiếm gần 25% dung lượng JS toàn repo nhưng không có tệp HTML nào liên kết.
   - *Hành động:* Trích xuất thuật toán phả hệ hữu ích sang `src/js/domain/kinship/`, sau đó chuyển toàn bộ file vào `archive/legacy-frontend/`.
4. **Bảo tồn các công cụ CLI độc lập có giá trị:**
   - Các file `test_relationships.py` và `test_media_assoc.py` kiểm thử CSDL phả hệ thực tế; `patch_global_mcp.js` và `patch_vscode_mcp.js` hỗ trợ cấu hình MCP môi trường lập trình viên.
   - *Hành động:* Tuyệt đối không xóa; di chuyển vào `scripts/tools/` và cấp quyền chạy độc lập.

---

## 5. BẢN ĐỐI SOÁT PHÁP Y & PHÂN LOẠI TOÀN BỘ 54 ROOT SCRIPTS (MIG-01 RECONCILIATION)

> **Căn cứ pháp lý & kỹ thuật:**  
> Đã kiểm tra 100% mã nguồn từng tệp (AST, chuỗi đường dẫn, lời gọi hệ thống, inbound references trong toàn bộ codebase, package.json, CI workflows).  
> **Tổng số tệp ban đầu:** 54 tệp tại thư mục gốc (100% untracked trong Git index).  
> **Xử lý Project Boundary:** 13 tệp thuộc chiến dịch Mini Expo 2026 đã được chuyển trả về đúng workspace canonical tại `OneDrive-PVCFC/.../ARCHIVE/root_scripts/` (đối soát SHA-256 byte-for-byte đạt 100%).  
> **Phân loại hiện diện trong repo:** `PRESERVE`: 4 tệp (tại `scripts/tools/`) | `ARCHIVED`: 37 tệp (tại `scripts/archive/legacy/`) | `TRANSFERRED_OUT`: 13 tệp.

| STT | Tên Tệp Script | Dung Lượng (Bytes) | Số Dòng | Ngôn Ngữ | Chức Năng Thực Tế & Đối Tượng Tác Động | Inbound References | Phân Loại | Bằng Chứng & Mức Độ Chắc Chắn |
| :---: | :--- | :---: | :---: | :---: | :--- | :--- | :---: | :--- |
| 1 | `add_dec006.py` | 1,282 | 20 | Python | Chèn DEC-006 vào file `06_DECISION_FRAMEWORK.md` của Mini Expo 2026 trên OneDrive. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đường dẫn tuyệt đối OneDrive ngoài repo. |
| 2 | `create_grammar_audit.py` | 8,313 | 127 | Python | Tạo báo cáo `REPORT_GLOBAL_DESIGN_GRAMMAR_AUDIT_v0.1.md` một lần. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Báo cáo đích đã tồn tại trong `docs/audit/`. |
| 3 | `create_m05.py` | 9,997 | 107 | Python | Script in nội dung module M05 (Logo & Nhận diện). | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Nội dung thụ động, không tham gia runtime. |
| 4 | `create_m08.py` | 13,314 | 154 | Python | Script in nội dung module M08 (Q&A chiến lược). | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Nội dung thụ động, không tham gia runtime. |
| 5 | `edit_index.py` | 2,737 | 58 | Python | Chỉnh sửa `index.html` của Mini Expo 2026 trên OneDrive. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đường dẫn tuyệt đối OneDrive ngoài repo. |
| 6 | `edit_m01.py` | 1,310 | 20 | Python | Chỉnh sửa module M01 của Mini Expo 2026 trên OneDrive. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đường dẫn tuyệt đối OneDrive ngoài repo. |
| 7 | `edit_m02.py` | 2,874 | 37 | Python | Chỉnh sửa module M02 của Mini Expo 2026 trên OneDrive. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đường dẫn tuyệt đối OneDrive ngoài repo. |
| 8 | `edit_m03.py` | 1,014 | 20 | Python | Chỉnh sửa module M03 của Mini Expo 2026 trên OneDrive. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đường dẫn tuyệt đối OneDrive ngoài repo. |
| 9 | `edit_m04.py` | 953 | 27 | Python | Chỉnh sửa module M04 của Mini Expo 2026 trên OneDrive. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đường dẫn tuyệt đối OneDrive ngoài repo. |
| 10 | `edit_m06.py` | 7,413 | 95 | Python | Chỉnh sửa module M06 của Mini Expo 2026 trên OneDrive. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đường dẫn tuyệt đối OneDrive ngoài repo. |
| 11 | `enforce_gate.js` | 267 | 5 | Node.js | Bản vá regex CSS bỏ bo góc cửa ngõ trong `components.css`. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Mã CSS đích đã được cập nhật. |
| 12 | `final_check.py` | 3,593 | 100 | Python | Kiểm tra tính hoàn thiện tài liệu Mini Expo 2026 trên OneDrive. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đường dẫn tuyệt đối OneDrive ngoài repo. |
| 13 | `final_status.py` | 2,146 | 56 | Python | Báo cáo tiến độ tài liệu Mini Expo 2026 trên OneDrive. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đường dẫn tuyệt đối OneDrive ngoài repo. |
| 14 | `final_verify.py` | 2,098 | 63 | Python | Xác minh tính nhất quán tài liệu Mini Expo 2026 trên OneDrive. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đường dẫn tuyệt đối OneDrive ngoài repo. |
| 15 | `fix_footer.js` | 628 | 11 | Node.js | Thay thế hàm Footer trong `src/js/ui/components.js`. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Hàm Footer hiện hành đã cập nhật. |
| 16 | `fix_member.js` | 161 | 4 | Node.js | Bỏ escape ký tự `\$` trong `server/member.js`. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Tệp đích đã sạch ký tự escape. |
| 17 | `fix_website.py` | 2,305 | 50 | Python | Sửa đường dẫn ảnh hero trong `index.html` của Mini Expo 2026. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đường dẫn tuyệt đối OneDrive ngoài repo. |
| 18 | `integrated_compiler.js` | 55,544 | 1,006 | Node.js | Trình biên dịch Cheerio/Marked cho Mini Expo Cà Phê 2026. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Tham chiếu tài nguyên ngoài repo. |
| 19 | `patch_admin_js.js` | 2,962 | 52 | Node.js | Bổ sung routing logic vào `admin/js/admin.js`. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Routing đã tích hợp trong `admin.js`. |
| 20 | `patch_agents.js` | 1,127 | 27 | Node.js | Bổ sung mục Cline CLI vào `AGENTS.md`. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Mục đã tồn tại trong `AGENTS.md`. |
| 21 | `patch_api_fetch.js` | 743 | 24 | Node.js | Bản vá sửa fetch URL trong `admin/js/api.js`. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Mã đích đã được cập nhật. |
| 22 | `patch_app.js` | 1,368 | 38 | Node.js | Bản vá logic session trong `src/js/app-v2.js`. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đã thực thi lịch sử. |
| 23 | `patch_comments.py` | 1,217 | 28 | Python | Bản vá xóa comment trong `src/js/ui/public-home.js`. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đã thực thi lịch sử. |
| 24 | `patch_components.js` | 344 | 11 | Node.js | Bản vá regex nhỏ trong `src/js/ui/components.js`. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đã thực thi lịch sử. |
| 25 | `patch_components_v0.8.js` | 1,641 | 72 | Node.js | Bản vá CSS components v0.8 trong `components.css`. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đã thực thi lịch sử. |
| 26 | `patch_contract.js` | 1,186 | 37 | Node.js | Bổ sung runtime Cline_CLI vào `.aios/PROJECT_CONTRACT.json`. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đã tồn tại trong contract JSON. |
| 27 | `patch_css_v02.js` | 1,008 | 36 | Node.js | Bản vá CSS components v0.2 trong `components.css`. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đã thực thi lịch sử. |
| 28 | `patch_db_route.js` | 1,280 | 26 | Node.js | Chèn routes reseed & integrity vào `server/index.js`. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Routes đã có trong `server/index.js`. |
| 29 | `patch_dom.js` | 401 | 11 | Node.js | Bản vá hàm `el()` trong `src/js/ui/dom.js`. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đã thực thi lịch sử. |
| 30 | `patch_footer.js` | 3,303 | 47 | Node.js | Bản vá cập nhật Footer trong `src/js/ui/components.js`. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đã thực thi lịch sử. |
| 31 | `patch_footer_v0.8.js` | 1,109 | 20 | Node.js | Bản vá Footer phiên bản 0.8 trong `components.js`. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đã thực thi lịch sử. |
| 32 | `patch_global_mcp.js` | 916 | 35 | Node.js | Công cụ lập trình viên: Đăng ký filesystem & playwright MCP server vào `~/.cline/`. | 0 runtime | `PRESERVE` | HIGH. Tiện ích dev environment hữu ích. |
| 33 | `patch_login.js` | 6,437 | 122 | Node.js | Bản vá cấu trúc đăng nhập trong `server/member.js`. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đã thực thi lịch sử. |
| 34 | `patch_logout.js` | 713 | 22 | Node.js | Bản vá route logout trong `server/member.js`. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đã thực thi lịch sử. |
| 35 | `patch_public_css.js` | 2,813 | 116 | Node.js | Bản vá CSS Public Home trong `components.css`. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đã thực thi lịch sử. |
| 36 | `patch_public_home.js` | 2,452 | 99 | Node.js | Bản vá CSS Public Home trong `components.css`. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đã thực thi lịch sử. |
| 37 | `patch_public_home_content.js`| 1,256 | 15 | Node.js | Bản vá copy text trong `src/js/ui/public-home.js`. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đã thực thi lịch sử. |
| 38 | `patch_public_home_v02.js` | 3,138 | 72 | Node.js | Bản vá hàm `renderPublicHome` v0.2. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đã thực thi lịch sử. |
| 39 | `patch_shell.js` | 960 | 20 | Node.js | Bản vá navigation trong `src/js/ui/shell.js`. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đã thực thi lịch sử. |
| 40 | `patch_shell_footer.js` | 717 | 18 | Node.js | Bản vá footer trong `src/js/ui/shell.js`. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đã thực thi lịch sử. |
| 41 | `patch_shell_nav.js` | 1,192 | 19 | Node.js | Bản vá nav links trong `src/js/ui/shell.js`. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đã thực thi lịch sử. |
| 42 | `patch_states.js` | 1,058 | 32 | Node.js | Bản vá CSS trạng thái trong `src/css/foundation/states.css`. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đã thực thi lịch sử. |
| 43 | `patch_threshold.py` | 430 | 16 | Python | Bản vá bỏ threshold trong `src/js/ui/public-home.js`. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đã thực thi lịch sử. |
| 44 | `patch_tokens.js` | 1,746 | 28 | Node.js | Bản vá token màu trong `src/css/foundation/tokens.css`. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đã thực thi lịch sử. |
| 45 | `patch_v06.js` | 4,653 | 160 | Node.js | Bản vá nâng cấp Public Home v0.6. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đã thực thi lịch sử. |
| 46 | `patch_v0_3_research_impl.js` | 4,517 | 159 | Node.js | Bản vá nghiên cứu giao diện v0.3. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đã thực thi lịch sử. |
| 47 | `patch_vscode_mcp.js` | 890 | 28 | Node.js | Công cụ lập trình viên: Đăng ký filesystem MCP vào VS Code settings. | 0 runtime | `PRESERVE` | HIGH. Tiện ích dev environment hữu ích. |
| 48 | `remove_threshold.js` | 704 | 15 | Node.js | Bản vá gỡ bỏ threshold trong `src/js/ui/public-home.js`. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đã thực thi lịch sử. |
| 49 | `restore_hero.js` | 565 | 13 | Node.js | Bản vá khôi phục hero banner trong `public-home.js`. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đã thực thi lịch sử. |
| 50 | `test_media_assoc.py` | 822 | 36 | Python | Công cụ CLI chẩn đoán CSDL: Kiểm thử liên kết 173 media và person_media trong `family_archive.db`. | 0 runtime | `PRESERVE` | HIGH. Đã chạy thử thành công (173 mapped). |
| 51 | `test_relationships.py` | 1,055 | 43 | Python | Công cụ CLI chẩn đoán CSDL: Kiểm thử quan hệ vợ/chồng (134) & con cái (155) trong 68 gia đình. | 0 runtime | `PRESERVE` | HIGH. Đã chạy thử thành công (0 orphan). |
| 52 | `update_public_home.js` | 3,741 | 87 | Node.js | Script ghi đè toàn bộ `src/js/ui/public-home.js` lịch sử. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Nội dung đã có trong tệp đích. |
| 53 | `update_report.py` | 324 | 10 | Python | Bản vá regex cập nhật `REPORT_PUBLIC_HOME_UX_QA_v0.2.md`. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Báo cáo đích đã cập nhật. |
| 54 | `verify_all.py` | 1,695 | 47 | Python | Script kiểm tra tài liệu Mini Expo 2026 trên OneDrive. | 0 runtime | `ARCHIVE_CANDIDATE` | HIGH. Đường dẫn tuyệt đối OneDrive ngoài repo. |

---

*Bản kiểm kê và đối soát pháp y này phản ánh 100% thực trạng repository, khép hoàn toàn điểm thiếu trong inventory 54 scripts.*


