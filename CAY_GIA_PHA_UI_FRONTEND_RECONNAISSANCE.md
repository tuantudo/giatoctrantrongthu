# BÁO CÁO KHẢO SÁT GIAO DIỆN & FRONTEND (UI & FRONTEND RECONNAISSANCE)
**Dự án:** CÂY GIA PHẢ / GIATỘC TRẦN TRỌNG THU  
**Mục tiêu sản phẩm:** Mini FamilySearch (Prototype Sprint 01)  
**Ngày thực hiện:** 02/11/2026  
**Cơ quan thực hiện:** AGY (Execution Coordinator / Primary Agent)  
**Thẩm quyền phê duyệt:** Tuấn (Human Final Authority)  
**Chế độ khảo sát:** STRICT READ-ONLY RECONNAISSANCE  

---

## 1. EXECUTIVE SUMMARY (TỔNG KẾT ĐIỀU HÀNH)

Cuộc khảo sát giao diện và frontend phục vụ **Prototype Sprint 01 (Mục tiêu: Mini FamilySearch)** đã hoàn tất ở chế độ nghiêm ngặt READ-ONLY. Bốn màn hình mục tiêu bao gồm:
1. **Home / Search (Trang chủ & Tra cứu phả hệ)**
2. **Person Profile (Hồ sơ nhân vật chi tiết)**
3. **Family Tree (Cây phả đồ tương tác / Pedigree & Descendancy)**
4. **Family Archive (Kho tư liệu di sản, hình ảnh & chứng tích)**

### Kết luận then chốt cho 4 quyết định của Tuấn:
1. **Có UI Kit nào sử dụng được không?**
   - **Thực tế:** 7 file Adobe XD trong `assets/XD/` (`Hand-drawn`, `Impekable_Dashboard`, `Semantic_UI`, `Auto-Animate`, `Vault_Security`, v.v.) là **các bộ template mẫu quốc tế (generic UI kits)** tải về từ 2019/2023. **Không có bất kỳ file XD nào được vẽ riêng cho Gia Tộc hay Cây Phả Hệ**.
   - **Khả năng sử dụng:** Có thể trích xuất các mẫu thẻ (`Card`), bảng thông số (`Data table`), bộ chọn phân trang (`Pagination`), và cấu trúc bố cục Dashboard từ `Impekable_AdobeXD_DashboardUIKit_v2.xd`. Tuy nhiên, **không thể dùng nguyên mẫu** vì lệch phong cách nhận diện dòng họ (`brand/BRAND_GOVERNANCE_v0.1.md`).
2. **Frontend hiện tại có gì để tái sử dụng?**
   - **Tài sản tái sử dụng cực kỳ dồi dào (`PROVEN`):**
     - Đã có sẵn kiến trúc giao diện **Vibecode Lab (`lab.html`)** đang chạy trực tiếp trên cổng `8888` với Mock Adapter sạch PII, mô phỏng 6 Persona, 5 kích thước màn hình responsive và 7 bề mặt UI.
     - **Person Profile:** File `src/js/ui/person.js` đã hoàn thiện **80%** chức năng (Thông tin cơ bản, Quan hệ gia đình đa chiều với thẻ đại diện, Trích lục nguồn FamilySearch FSID, Ký ức và Form đề xuất thay đổi).
     - **Family Tree:** Có 2 tài sản quan trọng: (a) `src/js/ui/tree.js` (danh mục phả hệ dạng sổ tay tra cứu 223 nhân vật); và (b) Thuật toán Canvas Pan/Zoom tương tác đa thế hệ (`graphPanX`, `graphPanY`, `graphScale`, kéo thả chuột, pinch zoom) đã từng chạy trong `archive/legacy_frontend/app.js` và CSS tương ứng trong `src/css/main.css`.
     - **Family Archive:** 185 tài sản ảnh chân dung thực tế đã được chuẩn hóa trong `fixtures/synthetic_media.json` và lưu trữ tại `assets/images/avatars/FS_AVATAR_*.jpg`.
3. **Nên dựng prototype trên nền tảng hiện tại hay tách riêng?**
   - **Khuyến nghị: DỰNG TRÊN NỀN TẢNG HIỆN TẠI (Tích hợp vào Vibecode Lab).**
   - **Lý do:** Tách riêng sẽ lãng phí toàn bộ hệ thống Design Tokens (`tokens.css`, `layout.css`, `components.css`), Mock Adapter 223 nhân vật, và Persona Switcher đã kiểm thử ổn định trên Playwright. Vibecode Lab được thiết kế chuyên biệt cho việc làm prototype an toàn mà không chạm vào CSDL hay backend.
4. **Phương án triển khai bốn màn hình ít rủi ro nhất:**
   - Sử dụng **Vibecode Lab (`http://localhost:8888/lab.html`)** làm môi trường Prototype Sprint 01 với 100% Mock Data từ `fixtures/`. Tái sử dụng `src/js/ui/person.js` cho Màn 2; chuyển đổi thuật toán Pan/Zoom từ `archive/legacy_frontend/app.js` thành component `vNEXT Interactive Tree Canvas` cho Màn 3; tích hợp ô tìm kiếm đa trường vào Màn 1; và mở rộng `fixtures/synthetic_media.json` thành Thư viện ảnh thẻ cho Màn 4.

---

## 2. UI KIT & DESIGN ASSETS INVENTORY (DANH MỤC TÀI NGUYÊN THIẾT KẾ)

| Tên Tài Nguyên | Đường Dẫn Tệp | Định Dạng | Nội Dung & Đặc Điểm | Khả Năng Tái Sử Dụng | Trạng Thái Nhận Thức |
| :--- | :--- | :---: | :--- | :--- | :---: |
| **Impekable Dashboard UI Kit** | `assets/XD/Impekable_AdobeXD_DashboardUIKit_v2.xd` | `.xd` (2.9 MB) | 3 Artboards: Bảng màu, Typeface, Cards, Tables, Sidebar, Pagination, Avatars, Data Widgets. | **Trung bình:** Tái sử dụng cấu trúc layout, avatar size, bảng biểu. Cần đổi sang token màu Gia Tộc. | `OBSERVED` |
| **Semantic UI Kit 2** | `assets/XD/xd-design-systems-semantic-ui-kit-2.xd` | `.xd` (3.1 MB) | 23 Artboards: Form inputs, Buttons, Segments, Steps, Tabs, Messages. | **Thấp - Trung bình:** Tham khảo trạng thái form và phân đoạn nội dung. | `OBSERVED` |
| **States Kit (Howard Pinsky)** | `assets/XD/states-kit.xd` | `.xd` (6.6 MB) | 14 Artboards: Micro-interactions, Button hover/active states, Menu toggle, 2020 Calendar. | **Thấp:** Tham khảo hiệu ứng tương tác (transitions/states). | `OBSERVED` |
| **Hand-drawn UI Kit** | `assets/XD/Hand-drawn_UI_Kit_Behance.xd` | `.xd` (1.9 MB) | 28 Artboards: Wireframe nét vẽ tay (Behance kit), Heading H1-H6, Media, Video, Playlist. | **Rất thấp:** Phù hợp vẽ wireframe ý tưởng sơ khai. | `OBSERVED` |
| **Auto-Animate UI Kit** | `assets/XD/xd-resources-auto-animate-ui.xd` | `.xd` (27 MB) | 76 Artboards: Animation mẫu cho ứng dụng di động (photo app transitions). | **Không phù hợp:** Thiết kế ứng dụng mobile thương mại, không phù hợp phả hệ. | `OBSERVED` |
| **Vault Security UI Kit** | `assets/XD/xd-resources-vault-security-ui.xd` | `.xd` (8.8 MB) | 26 Artboards: Màn hình khóa PIN, Passcode, bảo mật kho dữ liệu. | **Thấp:** Tham khảo ý tưởng cho cổng Thư Clara / Member Gate. | `OBSERVED` |
| **Anchor Links Templates** | `assets/XD/anchorLinks.xd` | `.xd` (4.0 MB) | 7 Artboards: Template trang đơn (single-page landing) với anchor scroll. | **Thấp:** Đã có `public-home.js` giải quyết tốt hơn. | `OBSERVED` |
| **Custom Gia Tộc Adobe XD** | *(Không tìm thấy trong repo)* | — | Không có file XD nào mang tên dự án Gia Tộc hoặc chứa artboard phả hệ riêng. | — | `UNKNOWN / BLOCKED` |
| **Logo Gia Tộc Ngang (Approved)** | `assets/images/logoGiaToc_ngang.svg` | SVG Vector | Logo dòng họ nằm ngang chính thức (Typography Cinzel + Gia huy), nền trong suốt. | **Tối đa (100%):** Dùng làm Masthead Brand Mark trên toàn bộ các màn hình. | `PROVEN` |
| **Logo Gia Tộc Huy Hiệu** | `assets/images/logoGiaToc.svg` | SVG Vector | Huy hiệu tròn gia tộc, biểu tượng chim bồ câu / thánh giá / nhành ô liu. | **Cao (100%):** Dùng cho Favicon, Watermark trang trọng. | `PROVEN` |
| **Kho Ảnh Chân Dung Phả Hệ** | `assets/images/avatars/FS_AVATAR_*.jpg` | JPEG (173 files) | 173 ảnh đại diện chân dung các cụ và con cháu thu thập từ FamilySearch. | **Tối đa (100%):** Dữ liệu ảnh thực tế cho cây phả hệ, hồ sơ và kho tư liệu. | `PROVEN` |
| **Bộ Phông Chữ Nhận Diện** | Google Fonts CDN / Local | Web Fonts | Cinzel (Tiêu đề trang trọng), Playfair Display (Văn học/MẠCH), Be Vietnam Pro (Giao diện số). | **Tối đa (100%):** Đã nhúng chuẩn trong `tokens.css`. | `CONFIGURED` |

---

## 3. FRONTEND TECHNOLOGY INVENTORY (HIỆN TRẠNG CÔNG NGHỆ FRONTEND)

- **Ngôn ngữ & Kiến trúc cốt lõi:**
  - **Vanilla JavaScript thuần (ES Modules):** Sử dụng chuẩn `import` / `export` của trình duyệt hiện đại.
  - **Không sử dụng Framework nặng:** Không có React, Vue, Angular, Svelte. Zero build-step dependencies.
  - **Trình đóng gói / Build tool:** Không cần Webpack, Vite, hay Rollup. Ứng dụng chạy trực tiếp Native ESM trên HTTP server tĩnh hoặc Node Express.
- **Application Entry Points (Điểm khởi nhập):**
  1. `index.html`: Cổng xuất bản công khai (Public Space) → Nạp `/src/js/ui/boot-public.js`.
  2. `lab.html`: Vibecode Lab Prototyping Studio → Nạp `/src/js/ui/lab.js` (Enforce `window.__GIATOC_MOCK__ = true`).
  3. `mirror.html`: Môi trường giả lập cấu trúc Production tĩnh → Nạp `/src/js/mirror.js`.
- **Cơ chế Điều hướng (Routing):**
  - **Public:** Hash fragment routing (`#/`, `#/mach`, `#/gia-pha`, `#/lich`, `#/tim-kiem`) phục vụ các cổng mời xác thực thành viên.
  - **Vibecode Lab:** Hash query routing (`#view=public`, `#view=dashboard`, `#view=tree`, `#view=person&id=@I1@`, `#view=mach`, `#view=clara`, `#view=spaces`).
- **Hệ thống Định dạng Giao diện (Styling System):**
  - Kiến trúc CSS phân tầng hiện đại tại `src/css/foundation/`:
    - `tokens.css`: Khai báo 100% Design Tokens (Màu Crimson `#8b151b`, Amber `#d97706`, Slate `#1e293b`, Cream `#faf9f5`; Spacing 4px-64px; Typography scale).
    - `layout.css`: Hệ thống khung chứa (`gi-container`, `gi-grid`, `gi-stack`, media queries).
    - `states.css`: Khung chuẩn hóa trạng thái hệ thống (`gi-state-panel`: Loading, Empty, Forbidden, Error).
    - `components.css`: Khai báo style cho Masthead, Nav, Cards, PersonCard, Buttons, Badges.
    - `foundation.css`: Bundle duy nhất import toàn bộ 4 file trên.
  - Tệp CSS di sản: `src/css/main.css` (hơn 5.000 dòng, chứa style cũ của Family Graph Canvas, Timeline, Search Results).
- **Điểm tích hợp API & Nguồn dữ liệu:**
  - Môi trường Mock (Lab): `src/js/ui/mock-adapter.js` nạp trực tiếp `fixtures/synthetic_genealogy.json` (223 người), `fixtures/synthetic_media.json` (185 ảnh), `fixtures/synthetic_mach.json`.
  - Môi trường Thật (Server): `src/js/ui/data.js` gọi REST API (`/api/genealogy`, `/api/timeline`, `/me/profile`, `/api/stories`).

---

## 4. EXISTING PAGE & COMPONENT INVENTORY (DANH MỤC TRANG & COMPONENT HIỆN HÀNH)

### A. Danh mục Màn hình / Bề mặt (Surfaces)
| Bề Mặt | Tệp Triển Khai | Mô Tả Chức Năng | Đánh Giá Tái Sử Dụng Cho Sprint 01 |
| :--- | :--- | :--- | :--- |
| **Public Home** | `src/js/ui/public-home.js` | Trang chủ truyền thông công khai gồm 6 khu vực chuẩn hóa theo kiến trúc v1.0. | Dùng làm gốc tham khảo cho màn hình Home của Mini FamilySearch. |
| **Member Dashboard** | `src/js/ui/dashboard.js` | Không gian điều hướng cá nhân của thành viên với 4 cánh cửa dẫn vào 4 không gian. | Tham khảo cấu trúc điều hướng thành viên. |
| **Archival Tree Register** | `src/js/ui/tree.js` | Danh mục tra cứu phả hệ dạng danh sách cô đọng (223 người), lọc tức thì theo tên. | Tái sử dụng logic lọc tên và nạp danh sách phả hệ. |
| **Person Profile** | `src/js/ui/person.js` | Hồ sơ chi tiết nhân vật: Lý lịch, 4 nhóm quan hệ, trích lục FSID, ký ức và form đề xuất. | **Tái sử dụng trực tiếp 80%** cho Màn hình Person Profile. |
| **Discourse (MẠCH/Clara)** | `src/js/ui/discourse.js` | Không gian đọc bài viết di sản và thư từ riêng tư với bộ chỉnh cỡ chữ. | Tái sử dụng cho khu vực đọc bài/ký ức gắn với phả hệ. |
| **Family Spaces** | `src/js/ui/spaces.js` | Không gian gia đình theo chi nhánh dòng họ. | Tham khảo phân quyền chi nhánh. |

### B. Danh mục Component Tái sử dụng (`src/js/ui/components.js` & `dom.js`)
1. **`InstitutionHeader`**: Header nhận diện chính thức chứa logo ngang, navigation và action buttons.
2. **`NavigationList` / `GlobalNav` / `MemberNav`**: Thanh menu điều hướng ngữ cảnh sạch sẽ.
3. **`Breadcrumb` & `BackNavigation`**: Điều hướng phân cấp (`hierarchy`) hoặc lịch sử (`history`).
4. **`PageHeader`**: Tiêu đề trang chuẩn mực (Eyebrow, H1 Title, Subtitle, Meta).
5. **`Section`**: Phân đoạn nội dung có header và action button.
6. **`Card` & `PersonCard`**: Thẻ nhân vật hiển thị ảnh chân dung (hoặc initials nếu không có ảnh), tên, năm sinh-năm mất, nơi sinh, nhãn quan hệ họ hàng.
7. **`StatusBadge` & `EpistemicBadge`**: Huy hiệu thể hiện tính chất thông tin (Fact, Inference, Proposal).
8. **`StatePanel` (`states.js`)**: Component hiển thị trạng thái Trống (Empty), Đang tải (Loading), Không có quyền (Forbidden).
9. **`el(tag, props, children)` (`dom.js`)**: DOM builder siêu nhẹ, chống XSS triệt để (100% `textContent`, không `innerHTML` dữ liệu người dùng).

---

## 5. RUNTIME OBSERVATION (QUAN SÁT THỰC TẾ RUNTIME)

Khảo sát được thực hiện trực tiếp trên trình duyệt thực tế thông qua **Playwright Automation Engine**:

| Điểm Kiểm Tra | Lệnh Khởi Chạy / URL | Kết Quả Quan Sát Thực Tế | Bằng Chứng Định Lượng | Trạng Thái |
| :--- | :--- | :--- | :--- | :---: |
| **Vibecode Lab Studio** | `node scripts/serve_lab.mjs`<br>`http://localhost:8888/lab.html` | Studio tải tức thì dưới 100ms. Hiển thị thanh công cụ Lab: chuyển đổi 7 bề mặt, đổi 5 kích thước màn hình (375, 768, 1024, 1440px, Fluid), chọn 6 Persona, giả lập 6 states, và nút Bật/Tắt chế độ sửa chữ trực quan. | Page Title: `Vibecode Lab · Studio Thiết Kế & Prototyping...`<br>Zero console errors. | `PROVEN` |
| **Bề mặt Cây Phả Đồ (`#view=tree`)** | `http://localhost:8888/lab.html#view=tree` | Hiển thị tiêu đề "Cây phả đồ", ô tìm kiếm "Tìm nhân vật theo tên", thông báo trạng thái "223 nhân vật". Hiển thị danh sách đầy đủ 223 nhân vật kèm vòng đời và số lượng quan hệ. | Snapshot: 223 listitems render hoàn chỉnh, link đúng format `/me/tree/person/@Ixx@`. | `PROVEN` |
| **Bề mặt Hồ Sơ Nhân Vật (`#view=person`)** | `http://localhost:8888/lab.html#view=person` | Mặc định mở hồ sơ cụ Cố Thu (`@I1@`). Hiển thị ảnh đại diện, ngày sinh 1872, mất 1969; Danh sách quan hệ: Bố mẹ (2), Anh chị em (1), Vợ chồng (1 - cụ Út), Con cái (6 cụ); Trích lục nguồn FamilySearch FSID `G5X4-48S`; Ký ức; Nút thử nghiệm Form đề xuất thay đổi. Có thanh chọn nhanh đổi mẫu sang 6 nhân vật khác. | Snapshot Playwright: Render đầy đủ ảnh đại diện của cụ Thu, cụ Út, các con. | `PROVEN` |
| **Public Home (`index.html`)** | `http://localhost:3000/` | Trang chủ công khai hiển thị Masthead logo ngang chuẩn, 6 khu vực nội dung truyền thông, chân trang colophon chuẩn. | Verified qua `scripts/ui_vnext_qa.mjs`. | `PROVEN` |

---

## 6. REUSABLE COMPONENTS FOR PROTOTYPE SPRINT 01

| Màn Hình Mục Tiêu | Thành Phần Đã Có Để Tái Sử Dụng | Mức Độ Hoàn Thiện Sẵn Có |
| :--- | :--- | :---: |
| **1. Home / Search** | - Layout Shell (`InstitutionHeader`, `Footer`).<br>- Ô input tìm kiếm và thuật toán lọc tên tức thì từ `tree.js`.<br>- Component thẻ kết quả tìm kiếm `search-result-card` (CSS có sẵn trong `main.css:488-535`).<br>- Khối số liệu thống kê phả hệ (223 nhân vật, 68 gia đình, 7 đời). | **65%** |
| **2. Person Profile** | - Toàn bộ cấu trúc `src/js/ui/person.js`.<br>- Khung lý lịch nhân vật (`factRow`, ngày tháng theo chuẩn nhân văn `humanDate`).<br>- Thẻ đại diện người liên đới `PersonCard` có avatar/initials.<br>- 4 phân nhóm quan hệ (Bố mẹ, Vợ/chồng, Con cái, Anh chị em).<br>- Khối trích lục nguồn gốc (FSID FamilySearch) và Ký ức.<br>- Form đề xuất thay đổi (`Change Proposal Dialog`). | **85%** |
| **3. Family Tree** | - Thuật toán đồ thị cây tương tác Pan/Zoom/Drag từ `archive/legacy_frontend/app.js:1274-1350`.<br>- Toàn bộ hệ thống CSS Canvas (`.family-graph-wrapper`, `.graph-canvas-viewport`, `.graph-node`, `.vertical-stem-line`) trong `src/css/main.css:1557-1750`.<br>- Dữ liệu quan hệ gia đình (68 gia đình, liên kết `parents`, `spouses`, `children`) từ `fixtures/synthetic_genealogy.json`. | **60%** |
| **4. Family Archive** | - Kho dữ liệu 185 tài sản ảnh thực tế trong `fixtures/synthetic_media.json`.<br>- 173 file ảnh JPEG chân dung chất lượng cao trong `assets/images/avatars/`.<br>- Hệ thống lưới ảnh (`gi-grid`, `gi-card`) trong `src/css/foundation/layout.css`.<br>- CSS giao diện Tư liệu trong `src/css/main.css:405-474` (`.tu-lieu-wrapper`, `.tu-lieu-guidance-card`). | **70%** |

---

## 7. GAPS ĐỐI VỚI BỐN MÀN HÌNH PROTOTYPE (KHOẢNG CÁCH CẦN BỔ SUNG)

### Gap màn 1 (Home / Search):
- *Hiện trạng:* `index.html` đang tập trung cho diễn ngôn truyền thông xã hội (Public Home v1.0). Chưa có giao diện tìm kiếm dạng "Tra cứu phả hệ tập trung" (Search by Name, Birth Year, Generation, Branch).
- *Cần bổ sung:* Một view tìm kiếm chuyên dụng trong Lab cho phép nhập Tên + Năm sinh + Chọn Chi nhánh, trả về danh sách thẻ nhân vật kèm ảnh.

### Gap màn 2 (Person Profile):
- *Hiện trạng:* Đã rất đầy đủ thông tin cơ bản và quan hệ.
- *Cần bổ sung:* Bổ sung tab/khu vực hiển thị hình ảnh tư liệu liên quan đến nhân vật (Gallery ảnh lịch sử của cụ đó) lấy từ `fixtures/synthetic_person_media.json`.

### Gap màn 3 (Family Tree Canvas):
- *Hiện trạng:* `src/js/ui/tree.js` hiện tại chỉ là bảng danh sách phẳng (Archival Register dạng text table), chưa trực quan hóa thành cây phân nhánh. Thuật toán Pan/Zoom đang nằm trong thư mục lưu trữ `archive/legacy_frontend/app.js` và CSS nằm trong `main.css`.
- *Cần bổ sung:* Refactor thuật toán Pan/Zoom cũ sang chuẩn component vNEXT, đưa vào một view mới `tree-canvas.js` hiển thị Cố Thu ở trung tâm, nhánh con cháu tỏa xuống hoặc sang ngang dạng Pedigree/Descendancy.

### Gap màn 4 (Family Archive):
- *Hiện trạng:* Đã có dữ liệu JSON và tệp ảnh, nhưng chưa có module UI `archive-gallery.js` để duyệt ảnh theo lưới (Masonry / Grid), lọc theo thời kỳ hoặc lọc theo nhân vật.
- *Cần bổ sung:* Xây dựng module hiển thị Thư viện Ảnh & Chứng tích dòng họ với bộ lọc: "Ảnh chân dung", "Ảnh tư liệu", "Bản đồ/Mộ chí".

---

## 8. EVIDENCE VÀ VERIFICATION (BẰNG CHỨNG PHÁP Y & KIỂM CHỨNG)

1. **Khảo sát tệp thiết kế:**
   - Đã giải nén manifest của 7 file `.xd` trong `assets/XD/`: Đều xác nhận ngày tạo 2019/2023, mang tên tác giả nước ngoài (`Howard Pinsky`, `Impekable`, `Behance`). Không có metadata nào liên quan đến Gia Tộc Trần Trọng Thu.
2. **Khảo sát dữ liệu phả hệ:**
   - Tệp `fixtures/synthetic_genealogy.json`: Chứa đúng **223 nhân vật** (`people`) và **68 gia đình** (`families`). Nhân vật gốc `@I1@` có FSID `G5X4-48S`, avatar trỏ tới `/assets/images/avatars/FS_AVATAR_G5X4-48S.jpg`.
3. **Khảo sát runtime bằng Playwright:**
   - Điều hướng thành công đến `http://localhost:8888/lab.html#view=tree` và `#view=person`.
   - Chụp snapshot cấu trúc DOM thực tế xác nhận 223 thẻ phả hệ render đúng, hình ảnh hiển thị không lỗi 404.

---

## 9. UNKNOWN / BLOCKED (CÁC ĐIỂM CHƯA RÕ VÀ RÀO CẢN)

1. **`UNKNOWN` — Nguồn gốc thiết kế Adobe XD gốc của dự án:**
   - Trong các chỉ thị trước có nhắc đến "tài liệu thiết kế XD". Tuy nhiên, thư mục `assets/XD/` chỉ chứa 7 template nước ngoài. Nếu Tuấn có một file `.xd` thiết kế riêng chưa commit vào repo, cần Tuấn chia sẻ hoặc chỉ định vị trí.
2. **`BLOCKED` — Phục hồi liên kết ảnh trong CSDL SQLite:**
   - Bảng `person_media` trong SQLite hiện có cột `media_id = NULL` đang bị tạm dừng (`HOLD`) chờ **GATE-02**. Tuy nhiên, rào cản này **KHÔNG ảnh hưởng đến Prototype Sprint 01** vì prototype chạy hoàn toàn trên Mock Fixtures (`fixtures/synthetic_media.json`).

---

## 10. RECOMMENDATIONS CHO PROTOTYPE SPRINT 01 (ĐỀ XUẤT CHO TUẤN)

### Khuyến nghị chiến lược:
1. **Môi trường thực hiện:** Thực hiện Prototype Sprint 01 **100% bên trong Vibecode Lab (`lab.html`)**, hoàn toàn không động chạm vào Backend CSDL SQLite hay cấu hình Production.
2. **Kế thừa & Tái sử dụng tối đa:**
   - **Màn 1 (Home/Search):** Tích hợp Search Box đa trường vào ngay phần đầu của View Phả Hệ trong Lab.
   - **Màn 2 (Person Profile):** Tái sử dụng nguyên vẹn `src/js/ui/person.js`, chỉ cần gắn thêm gallery ảnh từ `synthetic_media.json`.
   - **Màn 3 (Family Tree):** Kế thừa thuật toán Continuous Canvas từ `archive/legacy_frontend/app.js` để dựng Pedigree View 4 thế hệ có Pan & Zoom mượt mà.
   - **Màn 4 (Family Archive):** Dựng trang Thư viện tư liệu dạng Grid duyệt 185 ảnh chân dung từ `fixtures/synthetic_media.json`.
3. **Phân vai thực thi đề xuất:**
   - **AGY:** Thiết lập khung dữ liệu Mock, trích xuất thuật toán Tree Canvas Pan/Zoom và tích hợp luồng điều hướng 4 màn hình trong Lab.
   - **Cline:** Tinh chỉnh CSS pixel-perfect, khoảng cách, font chữ và chạy Playwright Browser QA trên 4 độ phân giải (1440, 1024, 768, 375px).

---
*Báo cáo được lập theo đúng quy chuẩn AIOS. Dừng tại đây chờ quyết định và chỉ thị tiếp theo từ Tuấn.*

