# BÁO CÁO KIỂM KÊ & KHẢO SÁT KIẾN TRÚC MÃ NGUỒN (PHASE 1)
## (SOURCE CODE INVENTORY & ARCHITECTURE AUDIT)

**Mã tài liệu:** `SOURCE_CODE_ARCHITECTURE_AUDIT.md`  
**Đường dẫn canonical:** `AUDIT/SOURCE_CODE_ARCHITECTURE_AUDIT.md`  
**Chỉ thị điều hành:** `DIRECTIVE: SOURCE CODE ARCHITECTURE & MASTER PLAN RESTRUCTURING`  
**Dự án:** CÂY GIA PHẢ — GIA TỘC TRẦN TRỌNG THU (`giatoctrantrongthu.com`)  
**Product Owner / Thẩm quyền tối cao:** Tuấn (Human Final Authority)  
**Thẩm định kiến trúc & Quản trị chất lượng:** Emarald (Strategic Analysis / Quality Control)  
**Cơ quan thực thi:** AGY (Execution Coordinator & Primary Agent)  
**Chế độ khảo sát:** **STRICT READ-ONLY FORENSIC AUDIT**  
**Thời điểm hoàn tất:** 2026-11-03  

---

## 1. TỔNG QUAN ĐIỀU HÀNH (EXECUTIVE SUMMARY)

Đợt khảo sát pháp y toàn diện mã nguồn repository `giatoctrantrongthu` được thực hiện ở chế độ STRICT READ-ONLY nhằm xác lập cơ sở thực chứng vững chắc cho việc tái cấu trúc kiến trúc hệ thống theo mô hình **Modular Monolith**.

### 1.1 Hiện Trạng Tổng Quan Của Repository
- **Tổng dung lượng mã nguồn:** ~12.143 dòng JavaScript, ~5.000 dòng CSS, ~1.500 dòng Python/Shell scripts.
- **Kiến trúc thực tế đang vận hành:** Hệ thống là sự pha trộn giữa **3 thế hệ kiến trúc khác nhau** cùng tồn tại song song trong repository:
  1. *Thế hệ 0 (Prototype / Experimental Layer):* Gồm hơn 50 kịch bản patch một lần (`patch_*.js`, `edit_*.py`, `check_*.py`) nằm rải rác ở thư mục gốc, cùng các thư mục thử nghiệm độc lập (`prototype/`, `design-playground/`, `chatbot-app/`).
  2. *Thế hệ 1 (Monolithic Legacy Hash-SPA):* Điển hình là file `src/js/member-app.js` (2.964 dòng) và `server/member_baseline.html` (1.196 dòng) chứa toàn bộ logic phả hệ, lịch, media và giao diện trong một file khổng lồ với biến toàn cục không kiểm soát.
  3. *Thế hệ 2 (vNEXT Modular Foundation):* Hệ thống giao diện hiện đại đang hoạt động (`src/css/foundation/`, `src/js/ui/`, `index.html`, `lab.html`, `server/member_*.html`) sử dụng Vanilla JavaScript ES Modules thuần chuẩn trình duyệt, không dùng bundler/framework.
- **Đánh giá rủi ro kiến trúc:** Mặc dù Thế hệ 2 (vNEXT) có thiết kế module sạch sẽ, việc tồn tại mã nguồn rác từ Thế hệ 0 và các God Files từ Thế hệ 1 gây nguy cơ hiểu nhầm ngữ cảnh nghiêm trọng cho các Agent và con người, làm tăng độ phức tạp bảo trì và tiềm ẩn lỗi hồi quy (regression).

---

## 2. KIỂM KÊ MÃ NGUỒN TOÀN DIỆN (REPOSITORY INVENTORY)

Toàn bộ tài nguyên repository được phân loại thành 7 nhóm chức năng rõ ràng:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       KIỂM KÊ TÀI NGUYÊN VẬT LÝ REPOSITORY                  │
├─────────────────────┬───────────┬───────────────────────────────────────────┤
│ PHÂN VÙNG CHỨC NĂNG │ QUY MÔ    │ THÀNH PHẦN VẬT LÝ CHÍNH                   │
├─────────────────────┼───────────┼───────────────────────────────────────────┤
│ 1. Frontend Web     │ 26 files  │ src/js/ui/ (vNEXT ESM), src/css/foundation│
│    (vNEXT Active)   │ ~4.200 LOC│ index.html, lab.html, assets/             │
├─────────────────────┼───────────┼───────────────────────────────────────────┤
│ 2. Legacy Frontend  │ 4 files   │ src/js/member-app.js (2.964 L), app-v2.js │
│    (Orphaned / Gen1)│ ~4.800 LOC│ server/member_baseline.html, main.css     │
├─────────────────────┼───────────┼───────────────────────────────────────────┤
│ 3. Backend & API    │ 16 files  │ server/index.js (596 L), auth.js (261 L), │
│    (Node / Express) │ ~2.400 LOC│ member.js (394 L), spaces_router.js (393) │
├─────────────────────┼───────────┼───────────────────────────────────────────┤
│ 4. Admin Portal     │ 7 files   │ admin/index.html, admin/css/admin.css,    │
│    (Control Room)   │ ~1.200 LOC│ admin/js/admin.js (778 L), api.js (111 L) │
├─────────────────────┼───────────┼───────────────────────────────────────────┤
│ 5. Database & Data  │ 12 files  │ server/family_archive.db (413 KB SQLite), │
│    (Persistence)    │ 400+ rows │ server/foundation.js, setup_db.js, seed...│
├─────────────────────┼───────────┼───────────────────────────────────────────┤
│ 6. Tooling & Scripts│ 70+ files │ scripts/ (QA, serve, audit), 50+ patch    │
│    (DevOps & Maint) │ ~3.500 LOC│ scripts tại root (.py, .js, .mjs)         │
├─────────────────────┼───────────┼───────────────────────────────────────────┤
│ 7. Governance & Doc │ 100+ files│ AUDIT/, docs/, brand/, AGENTS.md,         │
│    (Knowledge Base) │ 500+ KB   │ README.md, USER.md, HELP.md               │
└─────────────────────┴───────────┴───────────────────────────────────────────┘
```

### Chi Tiết Từng Điểm Vào Ứng Dụng (Application Entry Points)

| Điểm Vào (Entry Point) | Loại Hình Ứng Dụng | Script Khởi Động Chính | Trạng Thái Vận Hành | Bằng Chứng Mã Nguồn |
| :--- | :--- | :--- | :---: | :--- |
| `http://host/` | Public Web Experience | `src/js/ui/boot-public.js` | `PROVEN` | [`index.html:85`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/index.html#L85) |
| `http://host/lab.html`| Vibecode Lab Studio | `src/js/ui/lab.js` | `PROVEN` | [`lab.html:21`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/lab.html#L21) |
| `http://host/admin` | Admin Control Room | `admin/js/admin.js` | `PROVEN` | [`admin/index.html:76`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/admin/index.html#L76) |
| `http://host:3000/` | Backend REST API Server | `server/index.js` | `PROVEN` | [`server/index.js:580`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/index.js#L580) |
| `http://host/me/*` | Member Spaces (6 routes)| `src/js/ui/boot-*.js` | `TESTED` | [`server/member.js:275-375`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/member.js#L275-L375) |
| `server/member_baseline`| Legacy Member SPA | `src/js/member-app.js` | `OBSERVED` (Orphan)| [`server/member_baseline.html:1196`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/member_baseline.html#L1196)|

---

## 3. PHÂN TÍCH PHỤ THUỘC & ĐỘ KẾT DÍNH (DEPENDENCY & COUPLING AUDIT)

Khảo sát đồ thị import/export trong thư mục `src/js/ui/` và `server/` phát hiện 4 vấn đề phụ thuộc mang tính cấu trúc:

```
                     ĐỒ THỊ PHỤ THUỘC THỰC TẾ TRONG FRONTEND
                     
         ┌───────────────┐
         │    dom.js     │◄───────────────────┐
         └───────▲───────┘                    │
                 │                            │
         ┌───────┴───────┐            ┌───────┴───────┐
         │ components.js │            │   states.js   │
         └───────▲───────┘            └───────▲───────┘
                 │                            │
                 ├────────────────────────────┘
                 ▼
         ┌───────────────┐            ┌───────────────┐
         │   shell.js    │◄───────────┤   tokens.js   │
         └───────▲───────┘            └───────────────┘
                 │
       ┌─────────┴─────────┐
       ▼                   ▼
┌──────────────┐    ┌──────────────┐
│  public-home │    │  tree/person │
└──────────────┘    └──────▲───────┘
                           │ (Coupling nguy hiểm)
                           ▼
                    ┌──────────────┐
                    │   data.js    │
                    └──────▲───────┘
                           │ (Tĩnh tĩnh import)
                           ▼
                    ┌──────────────┐
                    │ mock-adapter │  ◄── Vấn đề: data.js luôn import mock-adapter!
                    └──────────────┘
```

### Các Điểm Coupling Bất Thường Cần Khắc Phục:
1. **Coupling Tĩnh Giữa Production Data Client Và Mock Adapter:**
   - [`src/js/ui/data.js:11`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/data.js#L11): `import { mockApi, isMockEnabled, mountLabSwitcher } from './mock-adapter.js';`
   - *Hậu quả:* Mọi màn hình trên Production khi nạp `data.js` đều bị buộc tải kèm toàn bộ `mock-adapter.js` (214 dòng) và các hàm quản lý mock, tạo nguy cơ rò rỉ cơ chế giả lập vào môi trường thực tế.
2. **Coupling Ngầm Qua Window Global Object:**
   - `lab.html` gán cờ toàn cục `window.__GIATOC_MOCK__ = true;`.
   - `admin/js/admin.js` gán các hàm điều khiển vào `window.previewStory = ...`, `window.removeStoryEdge = ...`, `window.openStoryTypeahead = ...`.
   - *Hậu quả:* Phá vỡ tính đóng gói của ES Module, gây khó khăn cho việc kiểm thử tự động và dễ xảy ra xung đột tên biến.
3. **Phân Mảnh Mã Nguồn Backend Server:**
   - `server/index.js` (596 dòng) đang chịu quá nhiều trách nhiệm: Cấu hình Express, Static File Serving, Session & Cookie Management, Rate Limiting, Khởi tạo CSDL, Khai báo trực tiếp các API CRUD cho `people`, `stories`, `edges`, `events`, nạp router `auth.js`, `member.js`, `spaces_router.js`.
4. **Sự Độc Lập Giả Tạo Của Phân Hệ Admin:**
   - Phân hệ `/admin` nằm hoàn toàn tách biệt khỏi `src/css/foundation/`, sử dụng bộ CSS riêng (`admin/css/admin.css`) định nghĩa lại các biến màu sắc và font chữ (`Times New Roman`).
   - `admin/js/admin.js` không tái sử dụng component hoặc dom helper nào của `src/js/ui/`, tự nối chuỗi HTML thủ công (`innerHTML += ...`), tiềm ẩn nguy cơ bảo mật XSS.

---

## 4. DANH MỤC ĐIỂM NÓNG KIẾN TRÚC & NỢ KỸ THUẬT (HOTSPOTS & TECHNICAL DEBT)

### 4.1 Danh Mục Các "God Files" / "God Modules"

| Tên File | Quy Mô | Trách Nhiệm Chồng Lấn | Mức Độ Rủi Ro | Khuyến Nghị Xử Lý |
| :--- | :---: | :--- | :---: | :--- |
| [`src/js/member-app.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/member-app.js) | **2.964 LOC** (134 KB) | Chứa toàn bộ SPA cũ: Graph engine, genealogy render, lunar calendar, MẠCH tab, media manager, auth logic, session state. | `NGHIÊM TRỌNG` | **Di chuyển vào `archive/legacy_frontend/`**. Tách chiết các thuật toán tính phả hệ thuần túy sang Domain Engine. |
| [`src/js/ui/lab.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/lab.js) | **1.469 LOC** (58 KB) | Gộp chung Studio Toolbar, Navigator, State Simulator, Inline Visual Editor, Design Tokens Inspector, Responsive Controller. | `CAO` | Tách nhỏ thành các sub-modules: `lab-toolbar.js`, `lab-inspector.js`, `lab-editor.js`. |
| [`admin/js/admin.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/admin/js/admin.js) | **778 LOC** (35 KB) | Đảm nhiệm từ routing, dashboard rendering, CRUD people, CRUD stories, CRUD events, CRUD users đến Database Schema view. | `CAO` | Tái cấu trúc thành các Domain Modules theo chuẩn v2.1: `mod-genealogy`, `mod-editorial`, `mod-media`... |
| [`server/index.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/index.js) | **596 LOC** (26 KB) | Vừa là Application Bootstrap, vừa là Infrastructure Middleware, vừa trực tiếp khai báo 15+ CRUD routes. | `TRUNG BÌNH` | Tách thành `app.js` (cấu hình), `server.js` (khởi động) và di chuyển các routes vào `server/routes/`. |

### 4.2 Sổ Đăng Ký Nợ Kỹ Thuật (Technical Debt Register)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       SỔ ĐĂNG KÝ NỢ KỸ THUẬT (TECHNICAL DEBT)               │
├───────┬───────────────────────────────────┬──────────┬──────────────────────┤
│ MÃ NỢ │ BẢN CHẤT VẤN ĐỀ                   │ ẢNH HƯỞNG│ HƯỚNG XỬ LÝ          │
├───────┼───────────────────────────────────┼──────────┼──────────────────────┤
│ TD-01 │ 50+ script patch rác ở root        │ Rất cao  │ Gom vào scripts/arch/│
│ TD-02 │ Thiếu hoàn toàn tầng Domain Logic │ Cao      │ Tạo src/js/domain/   │
│ TD-03 │ admin/ tự nối chuỗi HTML thô (XSS)│ Rất cao  │ Dùng shared dom.js   │
│ TD-04 │ data.js phụ thuộc cứng mock-adapter│ Cao     │ Dependency Inversion │
│ TD-05 │ Hardcoded text trong public-home  │ Cao      │ CMS Storage (DEC-A03)│
│ TD-06 │ chatbot-app/ Next.js cô lập       │ Thấp     │ Cách ly vào sandbox  │
│ TD-07 │ CSDL SQLite chạy PRAGMA delete    │ Trung bình│ Chuyển sang WAL mode │
│ TD-08 │ Thiếu Anti-CSRF Token ở backend   │ Rất cao  │ OWASP Guard (REV-02) │
└───────┴───────────────────────────────────┴──────────┴──────────────────────┘
```

---

## 5. ĐỐI CHIẾU 6 THÀNH PHẦN SẢN PHẨM (PRODUCT ARCHITECTURE MAPPING)

Đối chiếu cấu trúc source code hiện tại với 6 thành phần sản phẩm chiến lược được xác lập trong Master Plan:

| Thành Phần Sản Phẩm | Trạng Thái Triển Khai | Vị Trí Mã Nguồn Hiện Tại | Khoảng Trống Kiến Trúc Cần Tái Cấu Trúc |
| :--- | :---: | :--- | :--- |
| **1. Public Web Experience** | `PROVEN` | `index.html`, `src/js/ui/public-home.js`, `src/js/ui/boot-public.js` | Text đang bị hardcode trong JS; chưa có component `InvitationGatewayCard`. |
| **2. Member Experience** | `PARTIAL` | `server/member_*.html`, `src/js/ui/{dashboard, tree, person, discourse, spaces}.js` | Đang chạy giao diện vNEXT tốt, nhưng vẫn còn file legacy `member-app.js` gây nhiễu. |
| **3. Admin Control Center** | `PARTIAL` | `admin/index.html`, `admin/js/admin.js`, `AUDIT/ADMIN_CONTROL_CENTER_ARCHITECTURE_v2.1.md` | Chưa hợp nhất với Vibecode Lab; chưa có Media Manager; chưa đồng bộ Design Tokens. |
| **4. Domain & Data Platform**| `PARTIAL` | `server/family_archive.db`, `server/foundation.js`, `server/data/` | Chưa tách biệt tầng Domain Logic (Kinship, Epistemic, Lineage Graph) khỏi UI và DB. |
| **5. Infrastructure & Ops** | `CONFIGURED`| `server/index.js`, `scripts/serve_lab.mjs`, `vercel.json` | Thiếu kịch bản tự động sao lưu SQLite Online Backup; chưa có cơ chế Maintenance Mode. |
| **6. Quality & Governance** | `PROVEN` | `AUDIT/`, `.agents/skills/`, `AGENTS.md`, `scripts/verify_governance.py` | Đã chuẩn hóa governance hub tại `AUDIT/README.md`; cần dọn sạch các script rác ở root. |

---

## 6. SỔ ĐĂNG KÝ RỦI RO KIẾN TRÚC (RISK REGISTER)

| Mã Rủi Ro | Tên Rủi Ro | Xác Suất | Tác Động | Biện Pháp Kiểm Soát & Ranh Giới Bắt Buộc |
| :---: | :--- | :---: | :---: | :--- |
| **`AR-01`** | **Làm hỏng các route đang chạy khi tái cấu trúc thư mục** | Cao | Nghiêm trọng | Không đổi đường dẫn URL công khai; sử dụng adapter chuyển tiếp (facade); kiểm thử hồi quy trước/sau. |
| **`AR-02`** | **Xóa nhầm code lịch sử chưa được commit Git** | Trung bình | Thảm họa | TUYỆT ĐỐI KHÔNG XÓA FILE; mọi tài liệu cũ bắt buộc di chuyển an toàn vào `archive/`. |
| **`AR-03`** | **Gây rò rỉ Thư riêng Clara khi tách Domain Modules** | Thấp | Thảm họa | Áp dụng chốt chặn an ninh `CLARA_SECURITY_CONTAINMENT`; kiểm tra quyền trên từng API request. |
| **`AR-04`** | **Đưa framework/bundler phức tạp làm tăng coupling** | Trung bình | Cao | Kiên định với nguyên tắc Vanilla JS ES Modules thuần chuẩn trình duyệt theo Master Plan v4.0. |

---

*Giai đoạn I (Khảo sát pháp y mã nguồn) đã hoàn tất trọn vẹn, thiết lập đầy đủ căn cứ thực chứng để tiến hành thiết kế Kiến Trúc Đích tại Giai đoạn II.*

