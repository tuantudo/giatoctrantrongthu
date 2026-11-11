# BÁO CÁO PHÁP Y TỔNG HỢP & ĐIỀU PHỐI WORKFORCE (GTCT-ORCHESTRATION-01)
## PROJECT RECONCILIATION, AGENT WORKFORCE & PRODUCT READINESS

- **Dự án:** Cây Gia Phả — Gia Tộc Trần Trọng Thụ (`giatoctrantrongthu.com`)
- **Cơ quan thẩm quyền:** Tuấn — Product Owner / Human Final Authority
- **Thẩm tra kiến trúc & QC:** Emarald — Strategic Architecture & Quality Authority
- **Điều phối viên thực thi:** AGY — Chief Orchestrator & Integration Authority
- **Thời điểm lập báo cáo:** 2026-11-04T23:15:00+07:00
- **Nguyên tắc tuân thủ:** STRICT READ-ONLY ON RUNTIME SOURCE CODE & DATABASE (0 file mã nguồn sản phẩm bị sửa đổi, 0 câu lệnh ghi/xóa CSDL).

---

## 1. TỔNG QUAN ĐIỀU HÀNH (EXECUTIVE SUMMARY)

Thực hiện chỉ thị chiến lược **`GTCT-ORCHESTRATION-01`**, AGY đã chuyển đổi cơ chế làm việc sang mô hình **Chief Orchestrator & Multi-Agent Workforce Coordination**, huy động đồng thời 5 chuyên gia phân tích độc lập (Agent 01 đến Agent 05) tiến hành khảo sát pháp y toàn diện hiện trạng của dự án trên cả 4 trục:

1. **Trục Mã nguồn & Tái cấu trúc (Source Code & Refactoring):** Kiến trúc đã hoàn thành việc trích xuất **5/5 Pure Domain Cores** (`archive`, `calendar`, `editorial`, `genealogy`, `kinship`) và **Platform Data Inversion Layer (DIP)** độc lập 100% khỏi browser DOM, đạt 0 vòng lặp phụ thuộc (zero circular dependencies). Các consumer UI trọng yếu (`dashboard.js`, `tree.js`, `person.js`, `discourse.js`, `public-home.js`, `gateway.js`) đã chuyển đổi hoàn toàn sang nạp dữ liệu qua DataService. Tuy nhiên, mã nguồn vẫn còn nợ kỹ thuật tồn đọng gồm script mồ côi `src/js/member-app.js` (2.965 dòng) và tệp `src/js/app-v2.js` (577 dòng).
2. **Trục Sản phẩm & Tích hợp (Product Modules & Integration):** 7 bề mặt Touchpoints người dùng đã được định hình vững chắc trong Vibecode Lab và phân hệ thành viên (`/me`, `/me/tree`, `/me/tree/person/:id`). Các ranh giới an ninh P0 (Gateway Hardening và cô lập Thư gửi Clara) hoạt động hoàn hảo, không rò rỉ bất kỳ byte dữ liệu phả hệ hay PII nào cho khách vãng lai.
3. **Trục Trung tâm Quản trị Admin & Vibecode Lab (Admin Control Center & Lab):** Phân hệ `admin/` hiện mới chỉ đáp ứng mức **PARTIAL** so với bản đặc tả kiến trúc `ADMIN_CONTROL_CENTER_ARCHITECTURE_v2.1.md`. Trong 9 module quản trị, chỉ có `mod-calendar` và quản lý tài khoản kỹ thuật (`admin_users`) hoạt động hoàn chỉnh với CSDL SQLite; các module còn lại ở dạng cơ bản hoặc stub (`mod-media` click vào hiện "Chưa có sẵn", `mod-public-cms` chưa có 1 dòng code do bị chặn bởi quyết định `DEC-A03` đang OPEN). Hệ thống backend thiếu toàn diện middleware chống tấn công CSRF.
4. **Trục Tài liệu & Khả năng Vận hành (Documentation & User Enablement):** Tồn tại sự phình to và phân mảnh nghiêm trọng với hơn **165 tài liệu markdown** (nhiều báo cáo audit lịch sử trùng lặp), chứa các mâu thuẫn trực tiếp (GEDCOM scope, Auth state) và broken links. Đặc biệt, có một **khoảng trống lớn về User Enablement**: hoàn toàn chưa có tài liệu hướng dẫn thành viên hoặc các cụ cao niên đăng nhập, tra cứu cây gia phả hay ngày giỗ; đồng thời quy trình Developer Onboarding bị đứt gãy do thiếu dependencies ở root và lệnh `npm test` bị lỗi.

Dự án không hề dậm chân tại chỗ; phần lõi kiến trúc (Core Engines, Pure Domains, Data DIP, UI Components, Security Gates) đã được xây dựng rất kiên cố và đạt chuẩn cao nhất. Vấn đề lớn nhất ngăn cản việc hoàn thiện là **sự ngắt kết nối giữa các phân mảnh**: tài liệu chưa phản ánh mã nguồn thực, Admin chưa được hiện thực hóa theo kiến trúc v2.1, và thiếu một quy trình onboarding chuẩn hóa cho cả người dùng lẫn lập trình viên.

---

## 2. LỰC LƯỢNG AGENT ĐƯỢC THIẾT LẬP (AGENT WORKFORCE CREATED / AVAILABLE)

Hệ thống đã chính thức khai báo và kích hoạt 5 vai trò chuyên môn hóa cao thông qua execution harness:

```text
                                  TUẤN (Human Final Authority)
                                               │
                                               ▼
                                            EMARALD
                                    (Architecture Review / QC)
                                               │
                                               ▼
                                      AGY (Chief Orchestrator)
                                               │
         ┌───────────────────┬─────────────────┼─────────────────┬───────────────────┐
         ▼                   ▼                 ▼                 ▼                   ▼
     AGENT 01            AGENT 02          AGENT 03          AGENT 04            AGENT 05
  SOURCE ARCHITECT     ADMIN CONTROL     DOCUMENTATION &   PRODUCT EXPERIENCE   INDEPENDENT
                       CENTER SPEC.        ENABLEMENT        & VIBECODE LAB       VERIFIER
  (Codebase/DIP)      (Admin v2.1/API)    (Docs/Guides)     (UI/Brand Tokens)   (Tests/Probes)
```

| Mã Agent | Tên vai trò | Conversation ID | Trạng thái | Nhiệm vụ thực tế đã hoàn thành |
| :--- | :--- | :--- | :---: | :--- |
| **Agent 01** | `source-architect` | `ffa9c438-7f6f-4ed5-9ac0-ec851464c2a1` | IDLE (Bàn giao xong) | Quét 64 file `src/js/`, chứng minh 0 chu trình phụ thuộc, kiểm toán MIG-01 (Domain Cores) & MIG-02 (Data DIP), phát hiện nợ kỹ thuật legacy. |
| **Agent 02** | `admin-control-center` | `8ea08140-3626-44cd-88a4-1430075f56d3` | IDLE (Bàn giao xong) | Đối soát `admin/` với kiến trúc v2.1, kiểm tra 9 module quản trị, 15 bảng SQLite, đánh giá rào cản `DEC-A03` và lỗ hổng CSRF. |
| **Agent 03** | `documentation-enablement` | `26200f3c-0c9e-4a49-9b18-c252bbbae7f0` | IDLE (Bàn giao xong) | Thẩm định 165 tài liệu markdown, phát hiện broken links, mâu thuẫn tài liệu, khoảng trống User/Dev Enablement; đề xuất cây tài liệu 4 cấp chuẩn hóa. |
| **Agent 04** | `product-experience` | `8c81ca11-99ec-47f5-8ae8-c9f6a9dd5f5c` | IDLE (Bàn giao xong) | Khảo sát Vibecode Lab cổng 8888, kiểm tra 7 touchpoint surfaces, đối soát Brand Governance v0.1 tokens qua 4 viewports, phân định Mock vs Live. |
| **Agent 05** | `independent-verifier` | `2ad40f48-9f1b-4d93-a03e-619357a3df7c` | IDLE (Bàn giao xong) | Chạy độc lập 14 test suites, probe cổng mạng 3000 & 8888, bóc tách mâu thuẫn REST endpoint và phát hiện lỗi assertion trong test cũ. |

---

## 3. CẤU HÌNH AGENT & QUYỀN TRUY CẬP CÔNG CỤ (AGENT CONFIGURATION & TOOL ACCESS)

- **Quyền hạn công cụ (Tool Permissions):** Cả 5 subagents được cấp công cụ `run_command` (chạy lệnh sandbox an toàn), `view_file` (đọc file), và `send_message` (bàn giao báo cáo độc lập). Quyền ghi (`EnableWriteTools`) được giới hạn tuyệt đối ở chế độ kiểm toán đọc mã nguồn, không cấp quyền can thiệp database hay ghi đè mã nguồn sản phẩm.
- **Quyền mạng & Loopback:** Subagents hoạt động trong sandbox an toàn; các lệnh kiểm tra loopback socket nội bộ (`127.0.0.1:3000` và `127.0.0.1:8888`) được kiểm soát chặt chẽ.
- **Ranh giới an ninh dữ liệu:** Tuyệt đối không in mật khẩu băm, không đưa dữ liệu PII thật hoặc Thư gửi Clara ra ngoài ngữ cảnh kiểm toán.

---

## 4. HIỆN TRẠNG TÁI CẤU TRÚC MÃ NGUỒN (SOURCE CODE REFACTORING STATUS)

### 4.1 Đánh giá Kiến trúc Modular Monolith & Layering
Mã nguồn frontend tại `src/js/` đã hoàn thành xuất sắc việc phân rã kiến trúc đa tầng (Layered Architecture):

```text
src/js/
├── domain/     ◄── Pure Business Logic (100% Pure ESM, Zero DOM, Zero Browser Globals)
│   ├── archive/        (Metadata, portrait resolution, media kinds)
│   ├── calendar/       (iCal parser, lunar converter, cyclical event recurrence)
│   ├── editorial/      (Discourse partitioning, Clara isolation, article sorting)
│   ├── genealogy/      (Generations derivation, BFS lineage traversal, VN collation)
│   └── kinship/        (Kinship adjacency graph, Vietnamese honorific addressing)
│
├── platform/   ◄── Data Access & DIP Layer (Inversion of Control)
│   └── data/           (createDataService, MockDataAdapter, HttpDataAdapter, Cache TTL)
│
├── shared/     ◄── Global Contracts & Shared Utils
│   ├── contracts/      (Design Tokens JS contracts)
│   └── utils/          (date-lunar, dom-helpers, formatting, event-bus)
│
└── ui/         ◄── Presentation & Consumer Controllers
    ├── dashboard.js    (Member Home - 4 Convergence Slices)
    ├── tree.js         (Me-Centric Pedigree Tree & Archival List)
    ├── person.js       (6-Layer Person Profile & Epistemic Badges)
    ├── discourse.js    (MẠCH Reader & Masthead Scope Partitioning)
    ├── gateway.js      (Public Dignified Invitation Cards)
    └── data.js         (DIP Backward Compatibility Facade)
```

- **Chu trình phụ thuộc (Circular Dependencies):** **0 vòng lặp** (kết quả thuật toán phân tích đồ thị DFS trên 64 tệp mã nguồn).
- **Trạng thái MIG-01 (Pure Domain Cores):** **PROVEN (100% Hoàn thành)**. 5 miền nghiệp vụ đã chạy độc lập và vượt qua toàn bộ các bài kiểm thử đơn vị.
- **Trạng thái MIG-02 (Platform Data Inversion Layer):** **PROVEN (100% Hoàn thành)**. `createDataService` cho phép ứng dụng chuyển đổi mượt mà giữa chế độ Live Backend (`HttpDataAdapter`) và Mock Studio (`MockDataAdapter`).

### 4.2 Nợ Kỹ thuật & Tồn đọng (Technical Debt)
1. **Script mồ côi `src/js/member-app.js` (2.965 dòng, untracked `??`):** Đây là file monolithic nguyên bản cũ. Mặc dù toàn bộ logic nghiệp vụ cốt lõi đã được trích xuất sang `domain/`, file này vẫn tồn tại vật lý ở thư mục gốc `src/js/`.
2. **Tệp `src/js/app-v2.js` (577 dòng, modified `M`):** Dư thừa sau khi `index.html` đã chuyển sang nạp `boot-public.js`.
3. **Thư mục `src/js/core/` (`ics-parser.js`, `lunar-engine.js`):** Hiện chỉ đóng vai trò facade cho script cổ điển, cần dọn dẹp khi toàn bộ HTML chuyển sang ES Modules.
4. **Khớp nối nhẹ (Light Coupling) tại `src/js/ui/data.js`:** Module facade dữ liệu có import và tự động gắn widget DOM `mountLabSwitcher()` khi ở chế độ mock.

---

## 5. HIỆN TRẠNG CÁC PHÂN HỆ SẢN PHẨM (PRODUCT MODULE STATUS)

| Phân hệ / Bề mặt | Trạng thái Bằng chứng | Giao diện Thực tế | Tích hợp Backend API | Trải nghiệm Người dùng & Ranh giới An ninh |
| :--- | :---: | :--- | :--- | :--- |
| **S1: Public Home (`/`)** | **PROVEN** | `index.html` nạp `boot-public.js`. 6 khu vực truyền thông đối ngoại trang trọng. | Không phụ thuộc DB; tải tĩnh siêu tốc. | Cửa ngõ bảo vệ: Khách vãng lai truy cập hash nội bộ (`#/gia-pha`, `#/mach`, v.v.) hiển thị Thẻ Mời, không lộ PII. |
| **S2: Tree Viewer (`/me/tree`)** | **PROVEN** | `server/member_tree.html` nạp `tree.js`. Hỗ trợ Dual-view: Cây 3 tầng Me-Centric + Danh bạ phả hệ Archival List. | Nạp 223 cá nhân từ `/api/genealogy.json`. | Thuật toán BFS truy tìm huyết thống 153/153 con cháu về Cố Thu (`@I1@`). Sắp xếp họ tên tiếng Việt chuẩn hóa. |
| **S3: Person Profile (`/me/tree/person/:id`)** | **PROVEN** | `server/member_person.html` nạp `person.js`. Mô hình 6 tầng nghiêm ngặt. | Nạp dữ liệu cá nhân & quan hệ từ CSDL SQLite. | Hiển thị Epistemic Status Badges (`fact`, `inference`, `evidence-needed`). Form gửi đề xuất đính chính hoạt động an toàn. |
| **S4: Family Calendar** | **PROVEN** | Tích hợp trong Slice 2 của Member Home (`dashboard.js`). | Nạp từ 4 file ICS chuẩn (`CAL_01` $\to$ `CAL_04`). | Thuật toán Âm Dương và vòng tròn tính ngày giỗ cận kề hoạt động chính xác 100% trên 265 sự kiện lịch. |
| **S5: MẠCH Reader (`/me/mach`)** | **PROVEN** | `server/member_mach.html` nạp `discourse.js`. | Nạp 12 bài viết MẠCH từ `/api/mach.json`. | Phân lập phạm vi diễn ngôn tuyệt đối: MẠCH (trí thức/văn hóa) tách biệt 100% khỏi Thư gửi Clara. |
| **S6: Family Archive** | **PARTIAL** | Tích hợp trong Slice 4 của Member Home (`dashboard.js`). Riêng trang `/me/family-spaces` hiển thị `STATE.NOT_AVAILABLE`. | CSDL có 185 media assets và 173 liên kết nhân vật. | Kho di ảnh hiển thị tốt; phân hệ Family Spaces nhóm nhỏ hiển thị trung thực trạng thái "Đang xây dựng". |
| **S7: Member Home (`/me`)** | **PROVEN** | `server/member_dashboard.html` nạp `dashboard.js`. | Tích hợp CSDL qua session account của Tuấn (`@I115@`). | Hội tụ 4 lát cắt mượt mà: Danh tính $\to$ Lịch giỗ $\to$ Tri thức MẠCH $\to$ Kho di ảnh. 4 cánh cửa điều hướng hoàn chỉnh. |

---

## 6. HIỆN TRẠNG TRUNG TÂM QUẢN TRỊ ADMIN (ADMIN CONTROL CENTER STATUS)

Khảo sát đối soát thư mục `admin/` với bản đặc tả kiến trúc [ADMIN_CONTROL_CENTER_ARCHITECTURE_v2.1.md](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/ADMIN_CONTROL_CENTER_ARCHITECTURE_v2.1.md) cho kết quả như sau:

| Module Quản trị | Hiện trạng Code | Trạng thái Bằng chứng | Đánh giá Thực tế & Khớp nối Kiến trúc |
| :--- | :--- | :---: | :--- |
| **1. mod-dashboard** | Có UI cơ bản | `PARTIAL` | Hiển thị 2 thẻ đếm bản nháp bài viết và số lượng hồ sơ từ SQLite. Chưa có cảnh báo dữ liệu hay thống kê ngày giỗ cận kề theo v2.1. |
| **2. mod-genealogy** | Có UI CRUD người & quan hệ | `PARTIAL` | Chỉnh sửa nhân sự và liên kết quan hệ cha/mẹ/vợ/chồng/con cái hoạt động thật (PROVEN). Tuy nhiên **chưa có UI quản lý 68 hộ gia đình (`families`)** và thiếu cây phả đồ tương tác trong Admin. |
| **3. mod-media** | Chỉ có Tab Stub | `CONFIGURED` | Menu có nút "Di sản (Archive)" nhưng router không xử lý $\to$ click vào báo `Tính năng chưa tích hợp DB thật`. 185 ảnh và 173 liên kết chưa có UI quản trị. |
| **4. mod-editorial** | Có Form Textarea | `PARTIAL` | Lưu bài viết vào bảng `stories`. Chưa đạt chuẩn v2.1: thiếu trình soạn thảo Markdown split-preview, thiếu pipeline khử độc DOMPurify và URL allowlist. |
| **5. mod-calendar** | UI Toàn diện | **PROVEN** | **Module hoàn thiện nhất:** Cho phép thêm/sửa sự kiện, phân loại 4 nhóm lịch, gắn thẻ nhân vật qua edge `INVOLVES`, lưu trữ CSDL SQLite thật. |
| **6. mod-public-cms** | Không có UI (0%) | **BLOCKED** | Chưa có 1 dòng code. Bị chặn bởi quyết định chiến lược **`DEC-A03` (Trạng thái OPEN)** chờ Tuấn duyệt phương án lưu bảng `cms_documents`. |
| **7. mod-community** | Hỗn hợp | `PARTIAL` | Quản trị tài khoản kỹ thuật (`admin_users`) hoạt động PROVEN. Quản trị thành viên dòng họ (`accounts`, `identity_mappings`) và duyệt bài đóng góp (Inbox) là stub. |
| **8. mod-lab** | Không có trong Admin | `DOCUMENTED` | Chưa được nhúng thành module `Design & Experience` (`#/lab`) như quy hoạch; hiện chạy độc lập tại root qua cổng 8888. |
| **9. mod-system** | Chỉ có xem Schema | `PARTIAL` | Xem được danh sách 15 bảng CSDL và row count. Chưa có tính năng Sao lưu một chạm, Phục hồi 6 bước hay Bảng kiểm toán Audit Logs. |

### Đối soát 4 Quyết định Chiến lược Admin (DEC-A01 đến DEC-A04):
- **`DEC-A01` (Core Foundation, Routing & UI Stack):** `PARTIAL`. Giữ `/admin` làm hạt nhân duy nhất; tuy nhiên Hash router chưa chuẩn hóa BNF và chưa dùng chung tokens từ `foundation.css`.
- **`DEC-A02` (Database Consolidation & Identity Model):** `PROVEN`. Đã tách biệt 3 bảng `admin_users`, `accounts`, `identity_mappings` trong SQLite; cơ chế đồng bộ tài khoản tự động khi đăng nhập hoạt động tốt.
- **`DEC-A03` (Homepage Copy CMS Storage):** `BLOCKED` (Trạng thái OPEN — Chờ Tuấn phê duyệt). Văn bản trang chủ hiện vẫn hardcode trong `public-home.js`.
- **`DEC-A04` (MẠCH Editorial Pipeline):** `PARTIAL`. Đã có form nhập liệu nhưng chưa triển khai Markdown split-view và bộ lọc DOMPurify hai đầu.
- **Lỗ hổng an ninh xác nhận:** Toàn bộ API thay đổi dữ liệu của Admin (`POST`, `PUT`, `DELETE`) **thiếu Anti-CSRF Token middleware**.

---

## 7. HIỆN TRẠNG PHÒNG THÍ NGHIỆM VIBECODE LAB (VIBECODE LAB STATUS)

- **Trạng thái Runtime:** **PROVEN** (Đang lắng nghe trên cổng mạng `8888` qua tiến trình daemon `node scripts/serve_lab.mjs`, PID 13911; độ trễ phản hồi siêu tốc `1.59 ms`).
- **Khả năng cách ly an ninh:** Cơ chế `SENSITIVE_PATH` chặn triệt để mọi truy cập vào `/server`, `/tests`, `thu-gui-clara`, `*.db`, bảo vệ dữ liệu sản phẩm an toàn 100%.
- **Năng lực Studio:**
  - Hỗ trợ xem tức thời **7 bề mặt UI vNEXT** (`public`, `dashboard`, `tree`, `person`, `mach`, `clara`, `spaces`).
  - Hỗ trợ **5 khung nhìn Viewports chuẩn**: Fluid (100%), Desktop (1440px), Laptop (1024px), Tablet (768px), Mobile (375px).
  - Tích hợp **6 Synthetic Personas** (`A-HD`, `A-OB`, `ACTIVE`, `PROVISIONED`, `UNMAPPED`, `ANONYMOUS`) để kiểm thử phân quyền ngay trên trình duyệt.
  - Công cụ chỉnh sửa văn bản trực tiếp (Live Inline Copy Editing) lưu trữ cục bộ qua `localStorage`.
- **Độ tuân thủ Brand Governance v0.1 & UI System vNEXT:**
  - Typography: Sử dụng font serif chuẩn mực (`Times New Roman`) làm mặc định; loại bỏ hoàn toàn vi phạm sans-serif ở nội dung chính.
  - Bảng màu: Đỏ Sơn Mài (`#881337`), Hoàng Kim (`#B45309`), Giấy ngà (`#F6F4F0`), Mực than (`#1A1A1A`).
  - Hình khối: `--radius: 0` (Flat & Sharp, cấm bo góc) và `--elevation: none` (cấm đổ bóng SaaS).
  - Đường phân cách: Khắc phục triệt để lỗi viền nét đứt (dashed); Empty State chuyển sang dùng nét liền 1px thanh nhã (`border-top: 1px solid var(--color-border-subtle)`).

---

## 8. MỨC ĐỘ BAO PHỦ CỦA TÀI LIỆU (DOCUMENTATION COVERAGE)

Khảo sát toàn bộ hơn 165 tài liệu markdown cho thấy bức tranh phân hóa rõ rệt:

1. **Tài liệu Quản trị AI & Hiến chương Thẩm quyền (Cấp 1 & Cấp 6):** **XUẤT SẮC (`PROVEN`)**. `AGENTS.md`, `USER.md`, và `.clinerules` phân định thẩm quyền tuyệt đối của Tuấn, ranh giới AGY vs Cline, và 6 Human Gates cực kỳ chặt chẽ.
2. **Quy chuẩn Thương hiệu & Ngôn ngữ Thiết kế:** **RẤT TỐT (`DOCUMENTED`)**. Thư mục `brand/` có hệ thống lý luận từ Hiến chương đến Thiết kế trực quan và Tokens hoàn chỉnh.
3. **Tài liệu Cơ sở Dữ liệu & Kiến trúc:** **TỐT (`DOCUMENTED / PROVEN`)**. Thư mục `docs/database/` phản ánh trung thực bản chất SQLite.
4. **Tài liệu Hướng dẫn Người dùng (User Enablement):** **HOÀN TOÀN THIẾU HỤT (`BLOCKED / MISSING`)**. Không có thư mục `docs/user/` hay hướng dẫn sử dụng dành cho con cháu hoặc các cụ cao niên trong dòng họ. File `docs/HELP.md` thực chất là tài liệu kỹ thuật nội bộ cho developer/agent, không phải cho người dùng.
5. **Tài liệu Khởi động cho Lập trình viên (Developer Onboarding):** **ĐỨT GÃY (`BLOCKED`)**. Thiếu hướng dẫn cài đặt từng bước (Step-by-step); file `package.json` ở root thiếu script cài đặt dependencies cho backend; lệnh `npm test` bị gãy (`exit 1`); gây mất phương hướng cho developer mới giữa 3 cổng mạng 3000, 8888, 8080.

---

## 9. KẾT QUẢ TÍCH HỢP & RUNTIME THỰC TẾ (INTEGRATION & RUNTIME FINDINGS)

1. **Tiến trình Runtime đang hoạt động:**
   - Cổng `3000`: Backend Express SQLite (`node server/index.js`, PID 16747) đang hoạt động ổn định.
   - Cổng `8888`: Vibecode Lab Studio (`node scripts/serve_lab.mjs`, PID 13911) đang hoạt động ổn định.
2. **Hợp đồng API Thực tế vs Giả định REST:**
   - Backend Express và frontend `HttpDataAdapter` được thiết kế theo cấu trúc bundle JSON di sản và scoped router:
     - Dùng `/api/genealogy.json` (thay vì `/api/persons`).
     - Dùng `/api/mach.json` (thay vì `/api/mach/articles`).
     - Dùng `/api/calendars/:feed.ics` (thay vì `/api/calendar/events`).
     - Dùng `/api/member/proposals` (thay vì `/api/proposals`).
   - Endpoint `/api/health` hiện **chưa từng được định nghĩa** trong backend Express.
3. **Trạng thái Xác thực & Phiên làm việc (Session Reality):**
   - Truy cập ẩn danh vào `/me` tự động trả về HTTP `302 Found` chuyển hướng về `/login` (Bảo mật đúng).
   - Truy cập với phiên đăng nhập thành viên trả về HTTP `200 OK` (Render đầy đủ `member_dashboard.html`).
4. **Kết quả Kiểm thử Tự động:**
   - 12/12 test suites Node.js (`.mjs`) trong `tests/` chạy thành công **100% PASS**.
   - 5/5 kịch bản kiểm chứng runtime chuyên sâu trong `scripts/` chạy thành công **100% PASS**.

---

## 10. MÂU THUẪN & CÁC TUYÊN BỐ SAI LỆCH ĐÃ BỊ PHÁT HIỆN (CONTRADICTIONS / FAILED CLAIMS)

Qua đối soát đối kháng (Adversarial Audit), phát hiện 4 mâu thuẫn lớn giữa tài liệu báo cáo và mã nguồn thực tế:

1. **Mâu thuẫn về Vệ sinh Thư mục Gốc (SC-01 Claim vs Reality):**
   - *Tuyên bố:* "Thư mục gốc đã được dọn sạch 100%, chuyển hết script rác vào archive".
   - *Thực tế:* Thư mục gốc vẫn còn các file tạm/rác: `cookies_dev.txt`, `cookies_test.txt` (chứa session cookie kiểm thử), `server.log`, `GIADINHONGTHU.ged`, `chatbot-demo.html`, `mirror.html`.
2. **Mâu thuẫn trong Kiểm thử Nội dung MẠCH (Python Test Regression):**
   - *Tuyên bố:* Toàn bộ test suite chấp thuận nội dung MẠCH đạt 100%.
   - *Thực tế:* Chạy `python3 tests/test_markdown_acceptance.py` bị **FAIL** (`AssertionError: 12 != 19`). Nguyên nhân: File test này viết từ tháng 9/2026 khi còn gộp 19 bài (bao gồm Thư Clara). Khi thực hiện cô lập P0 tách 8 thư Clara ra khỏi MẠCH, số bài MẠCH công khai giảm còn 12 nhưng test suite cũ chưa được cập nhật.
3. **Mâu thuẫn Phạm vi Tính năng (GEDCOM Scope Conflict):**
   - `PROJECT_ROADMAP.md:25` ghi: *"DO NOT BUILD / OUT OF SCOPE: ❌ Import / Export GEDCOM"*.
   - `docs/architecture/IMPLEMENTATION_BASELINE.md:66-67` ghi: *"P4 — Sovereignty: 22. GEDCOM import, 23. GEDCOM export"*.
4. **Dữ liệu Ảnh trong CSDL có trường `asset_id` bị NULL:**
   - Toàn bộ 173 liên kết trong bảng `person_media` của CSDL SQLite `family_archive.db` có trường `asset_id` mang giá trị `NULL`. Tầng Domain Archive hiện đang phải dùng thuật toán heuristic suy luận mã ảnh từ trường `relation_id`. CSDL vật lý cần được chạy script phục hồi tại Gate 02.

---

## 11. CÁC RÀO CẢN KỸ THUẬT & QUYẾT ĐỊNH CHỜ PHÊ DUYỆT (BLOCKERS / OPEN DECISIONS)

### 11.1 Quyết định Chiến lược Thuộc Thẩm quyền của Tuấn (Human Decisions Needed)
1. **`DEC-A03` (Lưu trữ Nội dung Biên tập Trang chủ):**
   - Cần Tuấn chính thức phê duyệt Phương án 3 (`cms_documents` trong SQLite) để mở khóa cho việc xây dựng module quản trị Trang chủ (`mod-public-cms`) trong Admin Control Center.
2. **GATE-01 (Phê duyệt Diff Vá An ninh & ReBAC):**
   - Các thay đổi bổ sung bảng `authorities`, vá an ninh session và phân quyền ReBAC hiện nằm ở trạng thái uncommitted trong working tree, cần được Tuấn phê duyệt trước khi merge chính thức.
3. **GATE-02 (Phục hồi 173 Liên kết Ảnh SQLite):**
   - Cần phê duyệt chạy script reseed/update để điền chính xác `asset_id` cho 173 bản ghi `person_media` trong CSDL SQLite thật, chấm dứt việc phải dựa vào thuật toán heuristic.
4. **Phê duyệt Dọn dẹp Thư mục Gốc:**
   - Cần sự đồng thuận của Tuấn để chuyển 15 file audit markdown cũ ở thư mục gốc vào `docs/audit/archive/` và dọn dẹp các file rác (`cookies_*.txt`, `server.log`).

### 11.2 Rào cản Kỹ thuật (Technical Blockers)
1. **Lỗ hổng CSRF trên Backend Admin:** Cần triển khai middleware bảo vệ Anti-CSRF Token trước khi mở thêm bất kỳ endpoint ghi dữ liệu (`POST`/`PUT`/`DELETE`) nào trong Admin.
2. **Cấu hình Vercel Routing:** Cần cập nhật `vercel.json` để hỗ trợ rewrite chính xác cho các đường dẫn `/login` và `/me` trên môi trường Staging/Production.
3. **Đứt gãy quy trình kiểm thử `npm test`:** Cần cấu hình lại `package.json` để liên kết lệnh `npm test` với 12 test suites Node.js thực tế trong `tests/`.

---

## 12. THỨ TỰ THỰC HIỆN ĐỀ XUẤT TIẾP THEO (RECOMMENDED NEXT EXECUTION ORDER)

Để đưa dự án hội tụ vững chắc về một sản phẩm hoàn thiện mà không gây xáo trộn hệ thống, AGY đề xuất lộ trình 4 bước có kiểm soát:

```text
BƯỚC 1: Dọn dẹp Nợ Kỹ thuật & Chuẩn hóa Khởi động (Hygiene & Dev Enablement)
  ├── Cấu hình package.json: map "npm test" vào 12 test suites; thêm script setup backend.
  ├── Cập nhật test_markdown_acceptance.py (12 bài thay vì 19) để 100% test suites xanh.
  └── Dọn dẹp các file rác ở root (cookies_*.txt, server.log).

BƯỚC 2: Giải phóng Cổng Phê duyệt CSDL & An ninh (Human Gates 01 & 02)
  ├── Tuấn duyệt GATE-01: Chốt diff mã nguồn ReBAC, session và bảo vệ an ninh.
  └── Tuấn duyệt GATE-02: Chạy script cập nhật 173 liên kết asset_id trong SQLite; backup an toàn.

BƯỚC 3: Hoàn thiện Tài liệu Người dùng & Lập trình viên (Enablement Layer)
  ├── Xây dựng docs/dev/ONBOARDING.md (Setup local 5 bước trong 10 phút).
  ├── Xây dựng docs/user/MEMBER_GUIDE.md (Hướng dẫn thành viên tra cứu gia phả, lịch giỗ, MẠCH).
  └── Thiết lập docs/CANONICAL_DOCUMENT_REGISTRY.md và dọn dẹp các tài liệu audit cũ.

BƯỚC 4: Triển khai Nâng cấp Admin Control Center v2.1
  ├── Bổ sung middleware Anti-CSRF Token cho Backend Express.
  ├── Tuấn duyệt DEC-A03: Tạo bảng cms_documents và triển khai mod-public-cms.
  └── Nâng cấp mod-editorial (Markdown split-preview + DOMPurify) và mod-media (quản lý 185 ảnh).
```

---

## 13. TRẢ LỜI TRỰC TIẾP 12 CÂU HỎI CHẨN ĐOÁN CỐT LÕI (CORE DIAGNOSTIC QUESTIONS)

1. **Cấu trúc source code hiện tại đã thực sự là modular monolith chưa, hay chỉ mới di chuyển một số file?**  
   $\to$ **Đã thực sự là Modular Monolith ở tầng Frontend & Domain.** 5 pure domain cores và platform data inversion layer đã được bóc tách hoàn toàn, zero DOM globals, 0 circular dependencies, và được bảo vệ bằng test suites tự động. Tuy nhiên tầng Backend Express (`server/`) vẫn là cấu trúc phân tán nguyên khối cũ, chưa được module hóa theo domain.
2. **Có bao nhiêu pure domain cores đã tồn tại, được kiểm thử, và được consumer sử dụng thực tế?**  
   $\to$ **Đã có 5/5 Pure Domain Cores** (`archive`, `calendar`, `editorial`, `genealogy`, `kinship`). Toàn bộ 5 cores đều có test suite độc lập đạt 100% PASS và được trực tiếp import bởi các consumer UI (`dashboard.js`, `tree.js`, `person.js`, `discourse.js`, `public-home.js`).
3. **Admin Control Center hiện tại có đáp ứng `ADMIN_CONTROL_CENTER_ARCHITECTURE_v2.md` không?**  
   $\to$ **Mới chỉ đáp ứng ở mức PARTIAL (~35-40%).** Admin hiện tại là phiên bản MVP kế thừa, chưa được tái cấu trúc theo mô hình WordPress Model của kiến trúc v2.1.
4. **Những trang nào của Admin thực sự hoạt động, trang nào chỉ là placeholder hoặc mock?**  
   $\to$ **Hoạt động thật với SQLite:** Quản lý Sự kiện Lịch (`#/events`), Quản lý Nhân sự Phả hệ (`#/people`), Quản lý Tài khoản Admin (`#/users`), Đọc Schema CSDL (`#/database`), Soạn thảo bài viết cơ bản (`#/stories`). **Chỉ là Stub / Báo lỗi Chưa có sẵn:** Kho Di sản (`#/archive`), Hộp thư đóng góp (`#/inbox`), Quản lý Hộ gia đình (`families`), Biên tập Trang chủ (chưa có code).
5. **Người dùng thông thường có thể tự hiểu và sử dụng website mà không cần hỏi người phát triển không?**  
   $\to$ **Chưa thể tự hiểu toàn diện.** Trải nghiệm giao diện Member Home rất trực quan, nhưng dự án hoàn toàn thiếu bộ cẩm nang hướng dẫn sử dụng (`docs/user/MEMBER_GUIDE.md`) cho thành viên dòng họ và người cao niên.
6. **Developer mới có thể clone repository, hiểu cấu trúc và bắt đầu làm việc trong bao lâu?**  
   $\to$ **Hiện tại mất từ vài giờ đến cả ngày.** Nguyên nhân do `package.json` ở root không cài dependencies cho backend, `npm test` bị gãy, và developer bị ngợp bởi hơn 114 file báo cáo audit lịch sử trùng lặp.
7. **Tài liệu hiện tại có phản ánh đúng thực tế code không, hay đang mô tả một trạng thái lý tưởng chưa đạt được?**  
   $\to$ **Phân hóa:** Các tài liệu hiến chương quản trị AIOS (`AGENTS.md`, `USER.md`) và Brand Governance phản ánh rất sát. Ngược lại, nhiều tài liệu kiến trúc cũ và báo cáo audit đang mô tả trạng thái lý tưởng hoặc trỏ vào các tệp đã bị di chuyển/archive.
8. **Vibecode Lab hiện tại phục vụ mục đích gì và khác gì so với sản phẩm thực tế?**  
   $\to$ **Vibecode Lab (`lab.html`) là môi trường thiết kế và kiểm thử UI/UX biệt lập.** Lab sử dụng dữ liệu giả định sạch PII (`fixtures/synthetic_*.json`) và chạy không cần backend database thật, cho phép thử nghiệm tức thời 7 bề mặt, 5 kích thước màn hình, và 6 vai trò persona. Sản phẩm thực tế (`server/`) chạy trên cổng 3000, kết nối trực tiếp với CSDL SQLite và yêu cầu xác thực phiên thật.
9. **Có những mâu thuẫn nào giữa các tài liệu kiến trúc, giữa tài liệu và code, hoặc giữa các kế hoạch trước đây?**  
   $\to$ Có 4 mâu thuẫn lớn: (1) GEDCOM bị cấm trong Roadmap nhưng lại có trong Baseline; (2) Tuyên bố thư mục gốc sạch nhưng vẫn còn file rác; (3) Test suite Python MẠCH bị lệch số lượng (12 vs 19 bài); (4) Giả định endpoint REST (`/api/persons`, `/api/health`) khác với cấu trúc bundle JSON thực tế của backend.
10. **Những phần nào đã được coi là "DONE" nhưng thực tế chưa được tích hợp hoặc kiểm chứng?**  
    $\to$ (1) 173 liên kết ảnh CSDL được coi là xong nhưng thực tế trường `asset_id` vẫn là NULL; (2) Phân hệ Family Collaboration Spaces (`/me/family-spaces`) được coi là thuộc Batch 04 nhưng thực tế mới chỉ hiển thị màn hình chờ "Đang xây dựng"; (3) Dọn dẹp thư mục gốc (SC-01) chưa triệt để.
11. **Đâu là các blockers kỹ thuật và blockers quyết định hiện tại?**  
    $\to$ **Blockers quyết định:** Quyết định `DEC-A03` (Trang chủ CMS) đang OPEN; chốt chặn GATE-01 (Duyệt diff an ninh) và GATE-02 (Duyệt sửa liên kết ảnh DB) đang chờ Tuấn ký duyệt. **Blockers kỹ thuật:** Lỗ hổng thiếu Anti-CSRF Token trên Backend Admin; cấu hình rewrite Vercel; lỗi assertion của bộ test Python cũ.
12. **Thứ tự ưu tiên thực tế để đưa website về trạng thái hoàn thiện là gì?**  
    $\to$ Thứ tự tối ưu: **(1) Vệ sinh kỹ thuật & Dev Onboarding $\to$ (2) Giải phóng Human Gates 01 & 02 $\to$ (3) Lập bộ tài liệu User Guide $\to$ (4) Nâng cấp Admin v2.1 và vá an ninh CSRF.**

---

## 14. BẰNG CHỨNG XÁC THỰC ĐỊNH LƯỢNG (VERIFICATION EVIDENCE)

Toàn bộ kết luận trong báo cáo này đều dựa trên bằng chứng kiểm thử thực tế:
- **12/12 Test Suites Node.js PASS 100%:** `test_shared_layer.mjs`, `test_domain_genealogy.mjs`, `test_domain_calendar.mjs`, `test_domain_editorial.mjs`, `test_domain_kinship.mjs`, `test_domain_archive.mjs`, `test_consumer_integration.mjs`, `test_platform_data.mjs`, `test_batch_ui_02_03.mjs`, `test_batch_ui_03_deep_qa.mjs`, `test_gateway_hardening.mjs`, `test_member_home_convergence.mjs`.
- **Runtime Port 3000:** Trả về HTTP 302 bảo vệ truy cập `/me` ẩn danh; trả về HTTP 200 khi có phiên thành viên; nạp 223 cá nhân từ SQLite `family_archive.db`.
- **Runtime Port 8888:** Trả về HTTP 200 (1.59 ms), chạy đầy đủ 7 surfaces và 6 personas trong Vibecode Lab Studio.
- **Ảnh chụp màn hình thực tế trong `shots/`:** `member_home_desktop.png`, `member_home_mobile.png`, `tree_default.png`, `tree_drilldown.png`, `archival_list.png`, `person_profile.png`, `proposal_form.png`, `responsive_mobile.png`.

---

## 15. CÁC HẠNG MỤC CHƯA THỂ XÁC MINH TRỰC TIẾP (EXPLICITLY UNVERIFIED ITEMS)

1. **CSDL MariaDB Remote trên NAS Synology (`192.168.1.189`):** Do hoạt động trong môi trường sandbox cô lập không có kết nối mạng cục bộ LAN, trạng thái đồng bộ thực tế giữa SQLite local và MariaDB NAS chưa thể kiểm chứng trực tiếp.
2. **Cấu hình DNS và Live Production Vercel:** Chưa thể kiểm chứng trạng thái live hiện tại của domain `giatoctrantrongthu.com` trên Vercel do ranh giới sandbox bảo mật.
3. **Quyền ghi tệp ảnh vật lý trên môi trường Production:** Quyền ghi OS của tiến trình Node trên thư mục `assets/images/` khi upload ảnh thật từ Admin chưa được kiểm tra trên máy chủ của Tuấn.

---

> [!IMPORTANT]
> **DỪNG LẠI TẠI HUMAN CHECKPOINT:**  
> Báo cáo pháp y tổng hợp và kế hoạch điều phối đã hoàn tất với đầy đủ bằng chứng đối soát độc lập từ 5 chuyên gia subagents.  
> Tuân thủ kỷ luật nghiêm ngặt, AGY dừng lại tại đây và kính trình Tuấn cùng Emarald xem xét, định đoạt các quyết định đang mở (`DEC-A03`, `GATE-01`, `GATE-02`) trước khi bước sang giai đoạn triển khai tiếp theo.

