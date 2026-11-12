# BÁO CÁO NGHIỆM THU KIẾN TRÚC & SỨC KHỎE MÃ NGUỒN (CODEBASE HEALTH & ENGINEERING GOVERNANCE)
**Tác giả:** Agent D — Software Architect / Frontend Architect (Batch 2A)  
**Tiếp nhận & Chuẩn hóa:** AGY (Master Orchestrator / Primary Execution Authority)  
**Tọa độ Git:** Branch `release/v2.0.1` · HEAD `faf65b0`  
**Chế độ thực thi:** STRICT READ-ONLY & ARCHITECTURAL AUDIT  

---

### I. CHỈ SỐ SỨC KHỎE MÃ NGUỒN (CODEBASE VITAL SIGNS)

Tổng quy mô dự án (loại trừ `node_modules` và `.git`): **115 tệp**, **39,743 dòng mã (LOC)**.

| Phân vùng kiến trúc | Số tệp | Số dòng (LOC) | Tỷ trọng | Đánh giá & Khuyến nghị |
| :--- | :---: | :---: | :---: | :--- |
| **`src/css/` (Stylesheets)** | 8 | **11,036 LOC** | 27.8% | **BÁO ĐỘNG ĐỎ:** 5,788 dòng CSS chết hoàn toàn (`main.css`, `prototype.css`) + ~2,000 dòng zombie trong `components.css`. |
| **`src/js/ui/` (Giao diện & Shell)** | 35 | **10,670 LOC** | 26.8% | **ĐIỂM NÓNG:** Xuất hiện các "God View Components" (>1,000 LOC), 14 file boot lặp boilerplate, nhúng cứng nội dung tiếng Việt. |
| **`tests/` (Kiểm thử tự động)** | 21 | **7,030 LOC** | 17.7% | **RẤT TỐT:** Tỷ lệ test bao phủ ~22%, bảo vệ vững chắc domain rules và các ranh giới an ninh. |
| **`server/` (Backend Express & Services)**| 18 | **4,269 LOC** | 10.7% | **CẦN TINH GỌN:** `member.js` phình to do nhúng 350+ dòng chuỗi HTML thô; nhiều script bảo trì rải rác ở root. |
| **`src/js/domain/` (Pure Domain Core)** | 16 | **2,476 LOC** | 6.2% | **MẪU MỰC (XUẤT SẮC):** 100% logic thuần túy, 0 phụ thuộc DOM, độc lập tuyệt đối. **CẤM CHẠM VÀO**. |
| **`src/js/platform/` (DIP Inversion Layer)**| 5 | **562 LOC** | 1.4% | **CHUẨN MỰC:** Đạt Dependency Inversion Principle, tách biệt Live API và Mock Fixtures. **GIỮ NGUYÊN**. |
| **`src/js/shared/` & `src/js/core/`** | 7 | **843 LOC** | 2.1% | **ỔN ĐỊNH:** Chứa tiện ích âm dương lịch, formatting, DOM helpers. |

---

### II. ĐÁNH GIÁ RANH GIỚI MODULE (MODULE BOUNDARIES EVALUATION)

1. **`src/js/domain/` (Pure Domain Core) — ĐÁNH GIÁ: EXCELLENT (GIỮ NGUYÊN TUYỆT ĐỐI)**
   - Gồm 5 phân hệ: `genealogy/` (306 LOC), `kinship/` (868 LOC), `archive/` (564 LOC), `calendar/` (396 LOC), `editorial/` (666 LOC).
   - **Đặc tính:** 100% pure ES modules, 0 biến toàn cục DOM (`window`, `document`), 0 phụ thuộc Node.js.
   - **Bảo chứng:** Chạy độc lập trên mọi môi trường, tốc độ test < 150ms. Đạt chuẩn tính toán quan hệ huyết thống BFS, phân quyền scope MẠCH vs Clara, chuẩn hóa media.
   - **Quy tắc:** **KHÔNG REFACTOR, KHÔNG THÊM ABSTRACTION.**

2. **`src/js/platform/data/` (Data Inversion Layer) — ĐÁNH GIÁ: SOLID (GIỮ NGUYÊN HỢP ĐỒNG)**
   - Triển khai DIP chuẩn mực qua `DataService`, `HttpDataAdapter`, `MockDataAdapter`, `factory.js`.
   - `src/js/ui/data.js` đóng vai trò Facade tương thích ngược hoàn hảo, không gây gãy đổ bất kỳ view controller nào.
   - **Quy tắc:** **KHÓA CHẶT CONTRACT INTERFACE.**

3. **`src/js/ui/` (Presentation & Views) — ĐÁNH GIÁ: CẦN TẢI CẤU TRÚC CÓ CHỌN LỌC**
   - Ranh giới giữa View và Controller bị xóa nhòa. Các view component ôm đồm cùng lúc: fetch dữ liệu, tính toán, format ngày tháng, dựng DOM thủ công và chèn hàng chục object inline styles.
   - Phát hiện các tệp quá cỡ bất thường (xem mục III).

4. **`server/` (Backend Express & Services) — ĐÁNH GIÁ: MIXED RESPONSIBILITIES**
   - Backend vững chắc về an ninh (CORS whitelist, sensitive path containment, CSRF, rate limit, ReBAC transaction).
   - Tuy nhiên, `server/member.js` bị biến dạng vì phải sinh giao diện SSR thông qua việc cộng chuỗi HTML template thô cho `/login` và `/me/change-password`.

---

### III. PHÁT HIỆN TỆP ĐIỂM NÓNG & ĐỘ PHỨC TẠP BẤT THƯỜNG (COMPLEXITY HOTSPOTS)

1. **`src/js/ui/events.js` (1,272 LOC) — God View Component:**
   - Hàm `renderEvents` dài tới **1,072 dòng** (line 200 → 1272).
   - Nhồi nhét 6 chức năng hoàn toàn tách biệt: (1) Lưới tháng Calendar, (2) Agenda sự kiện, (3) Lịch kỵ giỗ 28 tiền nhân theo 3 bậc nhận thức, (4) Niên biểu lịch sử 219 sự kiện, (5) Giao thức Webcal/Google Cal sync, (6) Dialog popup xem ngày.
   - Khiến việc sửa đổi một tính năng nhỏ (như thêm tab lịch) làm gãy các test case kiểm tra số tab (`test_event_memorial_system.mjs: 4 !== 2`).

2. **`src/js/ui/person.js` (727 LOC) — Hồ sơ Nhân vật Quá khổ:**
   - Hàm `renderPerson` kéo dài **611 dòng** (line 116 → 727).
   - Chứa hơn 30 khối inline styles (`el('div', { style: { ... } })`).
   - Tự viết hàm regex phân tích ngày tháng riêng (`parseDMY`, `extractYear`) thay vì dùng tiện ích domain có sẵn.
   - Nhúng trực tiếp form modal gửi đề xuất chỉnh sửa phả hệ ngay trong view hồ sơ.

3. **`server/member.js` (1,004 LOC) — Router kiêm Template Renderer:**
   - Chứa hơn **350 dòng HTML thô** ghép bằng template string cho route `/login` (lines 101–360) và `/me/change-password` (lines 461–550).
   - Trong khi 14 trang thành viên khác đều nạp file `.html` tĩnh từ đĩa, chỉ riêng 2 route này lại nhúng HTML trực tiếp vào file code backend.

4. **`src/js/ui/lab.js` (1,524 LOC) — Monolithic Lab Studio:**
   - Quản lý toàn bộ 7 bề mặt mô phỏng, frame preview đa kích thước, persona switching, toast mock và proposal dialog trong một file duy nhất.

---

### IV. GẮN CHẶT NỘI DUNG VÀ TRÙNG LẶP LOGIC (COUPLING & DUPLICATION)

1. **Gắn chặt Nội dung vào Giao diện (Presentation-Content Coupling):**
   - `src/js/ui/letters.js:19-61`: Mảng `SAMPLE_LETTERS` chứa toàn văn 2 bức tâm thư gia tộc bằng tiếng Việt (hàng trăm từ) nhúng cứng trong JavaScript.
   - `src/js/ui/help.js:60-150`: Mảng `faqs` chứa toàn bộ câu hỏi và câu trả lời hướng dẫn bà con được hardcode trong hàm render.
   - `src/js/ui/public-home.js`: Toàn bộ các đoạn văn bản lời hiệu triệu, định vị cội nguồn đều nhúng cứng kèm thẻ `data-editable-id`.

2. **Bùng nổ Boilerplate Khởi động (Boot Script Explosion):**
   - Tồn tại **14 tệp `src/js/ui/boot-*.js`** và **14 tệp `server/member_*.html`** giống nhau tới 90%, chỉ khác nhau đúng tên hàm `renderXYZ` và `<title>`. Đây là boilerplate thừa thãi làm tăng số lượng tệp của dự án.

3. **Trùng lặp Logic Dựng Giao diện:**
   - **Render Card:** `person.js`, `dashboard.js`, `tree.js`, `gallery.js`, `events.js`, `letters.js` đều tự viết card wrapper bằng `el('div', { class: 'gi-card', style: { ... } })` với inline padding/border khác nhau.
   - **Hiển thị Key-Value Metadata:** Hàm `factRow` trong `person.js` và các khối hiển thị metadata trong `letters.js`, `dashboard.js`, `events.js` bị lặp lại cấu trúc.
   - **Lọc ảnh bia mộ:** Logic lọc `NON_AVATAR_ROLES` và render `HonorificCrest` xuất hiện lặp lại ở cả `public-home.js` và `person.js`.
   - **Xung đột tên tệp:** `src/js/ui/mock-adapter.js` (168 LOC) thực chất là UI Persona Switcher cho Lab, gây nhầm lẫn trầm trọng với Adapter dữ liệu thực tế tại `src/js/platform/data/mock-adapter.js`.

---

### V. TỔ CHỨC CSS & KIỂM TOÁN BRAND GOVERNANCE (CSS & BRAND AUDIT)

1. **Phát hiện 5,788 dòng CSS Chết (100% Unused):**
   - `src/css/main.css`: **5,169 LOC**.
   - `src/css/prototype.css`: **619 LOC**.
   - **Bằng chứng pháp y:** Quét toàn bộ thẻ `<link>` trong mọi tệp HTML (`index.html`, `lab.html`, `server/*.html`) xác nhận **ZERO tệp HTML nào nạp 2 file CSS này**. Toàn bộ website thực tế đang chạy trên `src/css/foundation/foundation.css`. Hai tệp này là tàn dư thế hệ cũ để lại.

2. **Hơn 2,000 dòng CSS Zombie trong `components.css`:**
   - Tệp `src/css/foundation/components.css` có kích thước **4,694 dòng**.
   - Phân tích chi tiết cho thấy các dòng từ **563 đến 2538 (hơn 2,000 dòng)** là CSS của 5 phiên bản thử nghiệm Public Home cũ (`v0.2`, `v0.4`, `v0.6`, `v1.0`, `gi-pub`), trong khi trang chủ hiện tại đã chuyển hoàn toàn sang dùng tiền tố `.gi-cr-*` (`CR-HOME-01`, lines 3532–4071).

3. **Vi phạm Brand Governance v0.1 (Zero-Radius & Zero-Shadow):**
   - **Vị trí vi phạm:** `src/css/foundation/components.css:4076`.
   - **Nội dung:**
     ```css
     .gi-calendar-app {
       border-radius: 6px; /* VI PHẠM: Cấm bo góc ngoài 0px */
       box-shadow: 0 1px 3px rgba(0,0,0,0.03); /* VI PHẠM: Cấm đổ bóng 3D */
     }
     ```
   - **Khắc phục:** Đưa về `border-radius: 0; box-shadow: none;` theo đúng quy chuẩn Brand Governance v0.1 (ngôn ngữ phẳng 2D, archival paper).

---

### VI. BẢN ĐỒ TRÁCH NHIỆM TỆP & MODULE (MODULE RESPONSIBILITY MAP)

| Module / Nhóm tệp | Vai trò Kiến trúc | Hiện trạng | Nguyên tắc Quản trị |
| :--- | :--- | :---: | :--- |
| `src/js/domain/*` (16 tệp) | Logic nghiệp vụ thuần túy (Phả hệ, Quan hệ họ hàng, Lưu trữ, Lịch, Xuất bản). | **HEALTHY** | **SEALED (BẤT BIẾN)**: Tuyệt đối không can thiệp, không thêm abstraction. |
| `src/js/platform/data/*` (5 tệp)| Tầng DIP Inversion Layer, DataService, HttpDataAdapter, MockDataAdapter. | **HEALTHY** | **SEALED**: Khóa chặt API contract. |
| `src/js/ui/shell.js` & `server-schedule.js` | Khung điều hướng chính, banner thông báo giờ nghỉ NAS 3 trạng thái. | **STABLE** | **BẢO LƯU**: Đã kiểm thử mốc biên phút 100% pass. |
| `src/js/ui/mock-adapter.js` | Giao diện Lab Persona Switcher trên màn hình. | **MISNAMED** | **ĐỔI TÊN**: Chuyển thành `lab-persona-switcher.js`. |
| `src/js/ui/boot-*.js` (14 tệp) | Entry point gắn kết cho các trang HTML thành viên. | **BLOATED** | **HỢP NHẤT**: Gom qua factory `createPageBoot(renderFn)`. |
| `src/js/ui/events.js` (1,272 LOC)| God View cho Lịch, Kỵ giỗ, Niên biểu, Đồng bộ thiết bị. | **GOD VIEW** | **TÁCH NHỎ**: Chia thành 4 module con chuyên biệt. |
| `src/js/ui/person.js` (727 LOC)| Hồ sơ nhân vật 6 tầng nhận thức. | **OVERSIZED**| **TINH GỌN**: Tách phần Facts và Kinship, đưa inline style về CSS class. |
| `src/js/ui/letters.js` & `help.js` | Không gian Thư gia tộc & Trung tâm Trợ giúp. | **COUPLED** | **BÓC NỘI DUNG**: Chuyển sample data sang synthetic JSON. |
| `src/css/main.css` & `prototype.css`| Stylesheet di sản cũ (5,788 dòng). | **DEAD CODE**| **LƯU TRỮ**: Di chuyển vào `archive/`, xóa khỏi `src/css/`. |
| `src/css/foundation/components.css`| Định dạng component ứng dụng (4,694 dòng). | **ZOMBIE** | **LÀM SẠCH**: Xóa bỏ 2.000 dòng CSS Public Home cũ, sửa lỗi bo góc. |
| `server/member.js` (1,004 LOC) | Router thành viên, xác thực, rate limit, kiểm soát giờ nghỉ. | **HOTSPOT** | **TÁCH TEMPLATE**: Bóc tách HTML `/login` ra tệp `.html` riêng. |

---

### VII. SỔ NỢ KỸ THUẬT & DANH MỤC ƯU TIÊN REFACTOR (TECHNICAL DEBT REGISTER)

| Mã Nợ | Mức độ | Tệp tin Ảnh hưởng | Vấn đề Kỹ thuật | Kế hoạch Khắc phục |
| :--- | :---: | :--- | :--- | :--- |
| **DEBT-01** | **P0** | `src/css/main.css`<br>`src/css/prototype.css` | 5,788 dòng CSS chết hoàn toàn không nạp. | Di chuyển vào `archive/legacy-stylesheets/`. Giảm ngay 5,788 dòng rác. |
| **DEBT-02** | **P0** | `components.css:4076` | Vi phạm Brand Governance: `border-radius: 6px` và `box-shadow` tại `.gi-calendar-app`. | Đưa về `border-radius: 0; box-shadow: none;`. |
| **DEBT-03** | **P1** | `components.css:563-2538` | Hơn 2,000 dòng CSS zombie của các bản Public Home cũ đã bị thay thế bởi `CR-HOME-01`. | Xóa bỏ các class zombie, chỉ giữ lại cụm `.gi-cr-*`. Giảm hơn 2,000 dòng. |
| **DEBT-04** | **P1** | `server/member.js` | Nhúng hơn 350 dòng HTML thô cho `/login` và `/me/change-password` trực tiếp trong router. | Tách ra thành `server/login.html` và `server/change_password.html`. |
| **DEBT-05** | **P1** | `tests/test_domain_calendar.mjs`<br>`tests/test_event_memorial_system.mjs` | Test case cũ kỳ vọng 2 tabs (hiện đã là 4 tabs); lệch định dạng fsid ics. | Cập nhật assert test suite cho khớp với bản phát hành V2.0.1. |
| **DEBT-06** | **P2** | `src/js/ui/boot-*.js` (14 tệp) | Lặp lại 90% boilerplate khởi tạo shell qua 14 tệp riêng biệt. | Xây dựng helper `createPageBoot(renderView, options)` dùng chung. |
| **DEBT-07** | **P2** | `src/js/ui/events.js` (1,272 LOC) | God View Component ôm đồm 6 chức năng. | Tách thành 4 module: `events-calendar`, `events-memorials`, `events-timeline`, `events-sync`. |
| **DEBT-08** | **P2** | `src/js/ui/person.js` (727 LOC) | Hàm render 611 dòng, nhồi nhét dày đặc inline style. | Tách component `PersonFactTable`, `PersonKinshipList`, chuẩn hóa CSS class. |
| **DEBT-09** | **P3** | `src/js/ui/letters.js`<br>`src/js/ui/help.js` | Nhúng văn bản tâm thư tiếng Việt và FAQs vào JS. | Tách thành synthetic JSON trong `fixtures/`. |
| **DEBT-10** | **P3** | `src/js/ui/mock-adapter.js` | Tên tệp gây nhầm lẫn với Adapter tầng dữ liệu. | Đổi tên thành `src/js/ui/lab-persona-switcher.js`. |

---

### VIII. CÁI GÌ NÊN REFACTOR VS CÁI GÌ NÊN GIỮ NGUYÊN (REFACTORING BOUNDARIES)

#### ✅ CÁI GÌ NÊN GIỮ NGUYÊN (DO NOT TOUCH):
1. **Toàn bộ thư mục `src/js/domain/`:** Không chạm vào, không đổi tên hàm, không sinh thêm wrapper class. Các module này đã đạt độ tinh khiết kiến trúc cao nhất.
2. **Hợp đồng Adapter tại `src/js/platform/data/`:** Giữ nguyên các phương thức của `DataService`, `HttpDataAdapter`, `MockDataAdapter`.
3. **Mô hình Multi-page Server Shell:** Tiếp tục duy trì việc Express phục vụ từng trang HTML thành viên riêng biệt để đảm bảo an ninh dữ liệu, không chuyển đổi thành Client SPA nguyên khối.
4. **Động cơ 3 trạng thái giờ nghỉ NAS (`server-schedule.js`):** Giữ nguyên cơ chế tính phút Việt Nam và logic bắt mã 502/503/504/1033 đã kiểm thử đạt 100% pass.

#### 🔨 CÁI GÌ NÊN REFACTOR (LỘ TRÌNH 3 BƯỚC):
- **Bước 1 (Batch 2B — Dọn rác an toàn tuyệt đối / Zero-Risk):**
  - Di chuyển `main.css` và `prototype.css` vào `archive/` (giảm ngay 5,788 dòng code).
  - Sửa vi phạm Zero-Radius tại `components.css:4076`.
  - Cắt bỏ 2,000 dòng CSS Public Home zombie trong `components.css`.
  - **Hiệu quả:** Cắt giảm ngay **~7,800 dòng mã thừa (gần 20% toàn bộ repo)** mà không làm thay đổi bất kỳ hành vi runtime nào!
- **Bước 2 (Batch 2C — Backend Decoupling):**
  - Tách chuỗi template HTML trong `server/member.js` thành 2 tệp `.html` sạch. Giảm `server/member.js` từ 1,004 dòng xuống < 650 dòng.
  - Cập nhật các test suite bị lệch assert (`test_domain_calendar`, `test_event_memorial_system`).
- **Bước 3 (Batch 3 — UI Modularization):**
  - Chia nhỏ `events.js` và `person.js`.
  - Hợp nhất 14 tệp boot bằng `createPageBoot()`.
  - Tách sample content trong `letters.js` và `help.js` ra tệp fixtures JSON.

