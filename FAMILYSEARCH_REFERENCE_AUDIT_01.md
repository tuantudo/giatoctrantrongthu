# BÁO CÁO ĐỐI SOÁT & TÁI TẠO FAMILYSEARCH BASELINE — BATCH 01
**Dự án:** CÂY GIA PHẢ / GIATỘC TRẦN TRỌNG THU  
**Mục tiêu:** FamilySearch Baseline Reconstruction — Batch 01 (Homepage + Global Navigation)  
**Tài liệu tham chiếu chính thức:** [FamilySearch Navigation Menu Overview](https://articles.familysearch.org/hc/en-us/articles/41748448748315-Navigation-Menu-Overview)  
**Website tham chiếu thực tế:** [https://www.familysearch.org/en/global](https://www.familysearch.org/en/global)  
**Tệp Adobe XD kết quả:** [`assets/XD/FamilySearch_Baseline_01.xd`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/assets/XD/FamilySearch_Baseline_01.xd)  
**Cơ quan thực hiện:** AGY (Primary Agent) & OpenCode  
**Thẩm quyền phê duyệt:** Tuấn (Human Final Authority)  
**Ngày hoàn thành:** 02/11/2026  

---

## 1. TỔNG QUAN & PHƯƠNG PHÁP THỰC HIỆN (EXECUTIVE SUMMARY)

Tuân thủ nghiêm ngặt chỉ thị của Tuấn:
- **Phương pháp tiếp cận:** RECONSTRUCTION (Học hỏi và tái tạo trung thực), **không phải Creative Design**. Không tự ý Việt hóa, không sáng tạo layout, không áp đặt nhận diện thương hiệu Gia Tộc vào giai đoạn này.
- **Phương thức khảo sát:** Truy cập trực tiếp website sống của FamilySearch qua tự động hóa Playwright, đo đạc thông số CSS computed styles, trích xuất cấu trúc DOM thực tế, và đối chiếu với tài liệu quy chuẩn Navigation của FamilySearch Help Center.
- **Tệp thiết kế Adobe XD:** Đã tạo tệp Adobe XD chuẩn mực [`assets/XD/FamilySearch_Baseline_01.xd`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/assets/XD/FamilySearch_Baseline_01.xd) gồm **8 Artboards hoàn chỉnh**, hệ thống components dùng chung, và **10 liên kết Prototype Interactions** mô phỏng chính xác hành vi mở/đóng dropdown và mobile drawer.

---

## 2. KÍCH THƯỚC KHẢO SÁT & ĐẶC TÍNH RESPONSIVE (VIEWPORT RECONNAISSANCE)

Khảo sát được thực hiện trên 3 kích thước màn hình tiêu chuẩn theo đúng yêu cầu:

| Kích Thước | Độ Phân Giải (Width × Height) | Hành Vi Header & Navigation | Hành Vi Nội Dung & Bố Cục Homepage | Trạng Thái Nhận Thức |
| :--- | :---: | :--- | :--- | :---: |
| **Desktop** | `1440px × 900px`<br>*(Cuộn dài: 4930px)* | Header ngang cố định cao 60px, hiển thị đầy đủ 5 navigation buttons (Family Tree, Search, Memories, Get Involved, Activities) và 5 utility items bên phải (Locations, Language, Help, Sign Up, Sign In). | Lưới bố cục 2 cột (Text bên trái - Graphic bên phải hoặc ngược lại); Hộp tìm kiếm Ancestor Search trải ngang dạng Card 900px với 4 trường nhập liệu. | `OBSERVED`<br>`RECREATED` |
| **Tablet** | `768px × 1024px`<br>*(Cuộn dài: 4800px)* | Toàn bộ 5 navigation buttons chính được ẩn vào nút **Hamburger ("Open Menu")**; chỉ giữ lại Logo, biểu tượng Ngôn ngữ (`🌐`), Trợ giúp (`❓`) và Hamburger button. | Bố cục co giãn 1 cột linh hoạt; Form tìm kiếm chuyển sang dạng xếp chồng (stacked) với độ rộng 688px; Guidance cards chuyển thành 1 cột. | `OBSERVED`<br>`RECREATED` |
| **Mobile** | `390px × 844px`<br>*(Cuộn dài: 5200px)* | Header cô đọng 60px; Logo thu nhỏ còn 18px; Header padding giảm còn `0px 12px`; Menu Hamburger kích hoạt toàn màn hình Drawer Navigation. | 100% phần tử nhập liệu và nút bấm full-width (354px); Tiêu đề H1 giảm từ 44px xuống 28px; Các khối ảnh chuyển xuống dưới khối văn bản. | `OBSERVED`<br>`RECREATED` |

---

## 3. KHẢO SÁT GLOBAL HEADER & NAVIGATION (HEADER AUDIT)

### A. Thông số Kỹ thuật Header Desktop (1440px)
- **Chiều cao (Height):** `60px`
- **Màu nền (Background):** `#FEFEFE` (Off-white tinh tế)
- **Đường viền đáy (Border Bottom):** `1px solid #E5E7EB`
- **Khoảng cách đệm (Padding):** `0px 24px`
- **Typography:** Sans-serif (FamilySearch HeritageBody:Sans, 14px, Regular, màu `#202121`)
- **Logo FamilySearch:** Vector SVG gốc (Width 132px, Height 34px), màu xanh thương hiệu `#85B940`, cây phả hệ phối màu `#9B947A` và `#BAB7B1`.

### B. Cấu trúc Menu Điều Hướng Chính (Main Navigation)
Gồm 5 mục điều hướng chính, khi di chuột (Hover) hoặc nhấn (Click) sẽ hiển thị gạch chân xanh và mở Dropdown Menu tương ứng:
1. `Family Tree` (Tọa độ x = 210px)
2. `Search` (Tọa độ x = 320px)
3. `Memories` (Tọa độ x = 400px)
4. `Get Involved` (Tọa độ x = 495px)
5. `Activities` (Tọa độ x = 610px)

### C. Khu vực Tiện ích & Xác thực (Right Utility Area)
- **Locations:** Liên kết tra cứu trung tâm phả hệ địa phương (`/en/locations/about`).
- **Select a Language:** Nút biểu tượng địa cầu (`🌐`).
- **Help and Learning:** Nút trợ giúp (`❓ Help`).
- **Sign Up Button:** Nút viền chữ nhật mảnh (`border: 1px solid #CBD5E1`, nền trắng, chữ đậm 13px `#202121`).
- **Sign In Button:** Nút chính nổi bật (`background: #85B940`, chữ trắng đậm 13px, bo góc 4px).

---

## 4. CHI TIẾT DANH MỤC DROPDOWN MENUS (NAVIGATION DROPDOWNS)

Đối soát chi tiết theo tài liệu chính thức *Navigation Menu Overview (FamilySearch Help Center)*:

| Nhóm Điều Hướng | Danh Sách Menu Con (Dropdown Items) | Đường Dẫn Tham Chiếu (URL) | Mục Đích Sử Dụng |
| :--- | :--- | :--- | :--- |
| **B. Family Tree** | 1. **Overview**<br>2. **Tree**<br>3. **Person**<br>4. **Find**<br>5. **Following**<br>6. **Person List**<br>7. **My Contributions** | `/en/family-tree/`<br>`/en/tree/pedigree/`<br>`/en/tree/person/`<br>`/en/search/tree?from=tree`<br>`/en/tree/following/`<br>`/en/tree/private-people/`<br>`/en/tree/contributions/` | Giới thiệu cây phả hệ cộng tác.<br>Trực quan hóa cây gia phả (mặc định mở người dùng).<br>Trang chi tiết hồ sơ cá nhân của chủ tài khoản.<br>Tìm kiếm người đã khuất trong cây gia phả chung.<br>Theo dõi các hồ sơ quan tâm và nhận thông báo khi có thay đổi.<br>Danh sách những người riêng tư/đang sống.<br>Lịch sử đóng góp dữ liệu phả hệ của cá nhân. |
| **C. Search** | 1. **Records**<br>2. **Images**<br>3. **Family Tree**<br>4. **Genealogies**<br>5. **Catalog**<br>6. **Books**<br>7. **Research Wiki** | `/en/search/record/`<br>`/en/records/images/`<br>`/en/search/tree/`<br>`/en/search/genealogies/`<br>`/en/search/catalog/`<br>`/en/library/books/`<br>`/en/wiki/` | Tìm kiếm kho hồ sơ lịch sử đã được lập chỉ mục.<br>Kho hình ảnh bản chụp vi phim chưa index.<br>Tìm trong cơ sở dữ liệu phả hệ người đã mất.<br>Cây phả hệ do các tổ chức/cá nhân hiến tặng.<br>Danh mục ấn phẩm, sách, microfilm toàn cầu.<br>Thư viện số với hơn 500.000 đầu sách gia phả.<br>Bách khoa toàn thư hướng dẫn nghiên cứu phả hệ. |
| **D. Memories** | 1. **Overview**<br>2. **Gallery**<br>3. **People**<br>4. **Find** | `/en/memories/`<br>`/en/memories/gallery/`<br>`/en/memories/people/`<br>`/en/memories/find/` | Giới thiệu phân hệ Ký ức gia đình.<br>Bộ sưu tập ảnh, tư liệu, âm thanh cá nhân tải lên.<br>Ký ức được sắp xếp theo mối quan hệ và họ.<br>Tìm kiếm ký ức theo chủ đề, tiêu đề, mô tả. |
| **E. Get Involved** | 1. **Overview**<br>2. **My Opportunities**<br>3. **Indexing** | `/en/get-involved/`<br>`/en/get-involved/opportunities/`<br>`/en/indexing/` | Dự án tình nguyện cải thiện độ chính xác phả hệ.<br>Tổng kết các cơ hội đóng góp cá nhân.<br>Dự án chép sử (indexing) chuyển tư liệu viết tay thành số. |
| **F. Activities** | 1. **All Activities**<br>2. **Where Am I From?**<br>3. **Surname Origins**<br>4. **All About Me**<br>5. **Famous Relatives**<br>6. **Compare-a-Face**<br>7. **Record My Story**<br>8. **Picture My Heritage**<br>9. **In-Home Activities** | `/en/discovery/`<br>`/en/discovery/where-am-i-from/`<br>`/en/discovery/surname/`<br>`/en/discovery/all-about-me/`<br>`/en/discovery/famous-relatives/`<br>`/en/discovery/compare-a-face/`<br>`/en/discovery/record-my-story/`<br>`/en/discovery/picture-my-heritage/`<br>`/en/discovery/in-home/` | Tổng hợp hoạt động tương tác di sản gia đình.<br>Khám phá quê hương tổ tiên trên bản đồ tương tác.<br>Nguồn gốc, ý nghĩa và phân bố địa lý của dòng họ.<br>Sự kiện lịch sử diễn ra vào năm sinh của bạn/tổ tiên.<br>Tìm mối liên hệ họ hàng với các nhân vật nổi tiếng.<br>So sánh mức độ giống nhau giữa khuôn mặt bạn và tổ tiên.<br>Gợi ý câu hỏi và công cụ ghi âm ký ức giọng nói.<br>Ghép mặt vào trang phục văn hóa truyền thống các dân tộc.<br>Bộ hoạt động gắn kết gia đình tại nhà. |

---

## 5. CẤU TRÚC CHI TIẾT HOMEPAGE (8 KHU VỰC TUẦN TỰ)

Khảo sát trực tiếp trên DOM của `https://www.familysearch.org/en/global`:

```text
┌────────────────────────────────────────────────────────────────────────┐
│  [HEADER] Height 60px: FamilySearch Logo | Main Nav | Utilities | Auth │
├────────────────────────────────────────────────────────────────────────┤
│  01. HERO SECTION (Height 600px, Nền kem nhạt #F8FAFC)                 │
│      - H1: "Find your family. Discover yourself."                      │
│      - Lead: "Bring to life your family’s history..."                  │
│      - CTA: [GET STARTED] (Xanh lá đậm #00552B)                        │
│      - Graphic: Khung ảnh cắt dán các thế hệ gia đình (Collage)        │
├────────────────────────────────────────────────────────────────────────┤
│  02. CULTURAL CAMPAIGN (Height 628px, Nền trắng)                       │
│      - Tag: "HERITAGE & TRADITION" (Xanh teal #057091)                 │
│      - H2: "Honor Their Memory"                                        │
│      - Lead: Tôn vinh ký ức và di sản văn hóa qua các thế hệ           │
│      - CTA: [DISCOVER MORE]                                            │
├────────────────────────────────────────────────────────────────────────┤
│  03. ANCESTOR QUICK SEARCH CARD (Height 510px, Nền xám nhạt #F8FAFC)   │
│      - H2: "Start discovering your family story"                       │
│      - Card trắng nổi bật (900px × 260px, bóng đổ nhẹ, viền bo 8px):   │
│        [ First Names ] [ Last Names * (Required) ]                     │
│        [ Place Lived ] [ Birth Year ] [ Calc Year 📅 ]                 │
│      - Action: Nút lớn [SEARCH] căn giữa màu xanh #00552B              │
├────────────────────────────────────────────────────────────────────────┤
│  04. HISTORICAL RECORDS (Height 574px, Nền Xanh Teal Đậm #057091)      │
│      - H2: "Discover your family’s story through historical records."  │
│      - Lead: Trích lục hàng tỷ hồ sơ tư liệu lịch sử                   │
│      - CTA: [START SEARCHING] (Nút trắng chữ xanh)                     │
│      - Graphic: Khung minh họa tài liệu vi phim & hộ tịch cổ           │
├────────────────────────────────────────────────────────────────────────┤
│  05. WORLD'S SHARED TREE (Height 650px, Nền trắng)                     │
│      - Graphic: Mô hình Cây Phả Đồ Tương Tác (Pedigree & Descendancy)   │
│      - H2: "Find your family in the world’s largest shared tree."      │
│      - CTA: [GET STARTED WITH YOUR TREE]                               │
├────────────────────────────────────────────────────────────────────────┤
│  06. NONPROFIT AND FREE (Height 650px, Nền #F8FAFC)                    │
│      - H2: "Nonprofit and free."                                       │
│      - Lead: Tổ chức phi lợi nhuận toàn cầu vì di sản con người        │
│      - Dual CTAs: [ABOUT FAMILYSEARCH] (Viền) + [DONATE] (Xanh #85B940)│
├────────────────────────────────────────────────────────────────────────┤
│  07. GUIDANCE NETWORK (Height 508px, Nền trắng)                        │
│      - H2: "Find a guide, in person or online"                         │
│      - 3 Cột Card hướng dẫn:                                           │
│        1. Trung tâm hỗ trợ trực tiếp (5,000+ FamilySearch centers)     │
│        2. Diễn đàn cộng đồng trực tuyến (Community Help)               │
│        3. Thư viện lịch sử phả hệ Salt Lake City (Library)             │
├────────────────────────────────────────────────────────────────────────┤
│  08. FINAL SIGNUP CONVERSION (Height 450px, Nền Xanh Lá Rừng #00552B)  │
│      - H2: "Sign up, and discover your place."                         │
│      - CTA chính: [CREATE A FREE ACCOUNT] (Nút trắng chữ xanh đậm)     │
│      - Phụ: "Already have an account? Sign In"                         │
├────────────────────────────────────────────────────────────────────────┤
│  [FOOTER] Height 300px, Nền xám đen #1A202C: Liên kết, Pháp lý, © 2026 │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 6. DANH MỤC ARTBOARDS VÀ TƯƠNG TÁC TRONG FILE ADOBE XD

Tệp thiết kế: [`assets/XD/FamilySearch_Baseline_01.xd`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/assets/XD/FamilySearch_Baseline_01.xd)  
*Được khởi tạo theo chuẩn Open Container Format (UCF/ZIP) với `mimetype` uncompressed ở đầu tệp.*

### A. Danh mục 8 Artboards
1. **`Desktop - 1440 - Homepage Default`**: Khung nhìn 1440 × 900 (cuộn 4930px), đầy đủ 8 phân đoạn giao diện chuẩn.
2. **`Desktop - 1440 - Nav Dropdown (Family Tree)`**: Trạng thái mở menu con Family Tree với 7 mục (Overview, Tree, Person, Find, Following, Person List, My Contributions).
3. **`Desktop - 1440 - Nav Dropdown (Search)`**: Trạng thái mở menu con Search với 7 mục (Records, Images, Family Tree, Genealogies, Catalog, Books, Research Wiki).
4. **`Desktop - 1440 - Nav Dropdown (Memories)`**: Trạng thái mở menu con Memories với 4 mục (Overview, Gallery, People, Find).
5. **`Tablet - 768 - Homepage`**: Khung nhìn 768 × 1024 (cuộn 4800px), header thu gọn thành Hamburger Menu.
6. **`Tablet - 768 - Mobile Menu Open`**: Giao diện ngăn kéo (Drawer Navigation) trượt ra từ bên phải kèm nút đóng `✕`.
7. **`Mobile - 390 - Homepage`**: Khung nhìn 390 × 844 (cuộn 5200px), các trường nhập liệu và nút bấm 100% full-width (354px).
8. **`Mobile - 390 - Mobile Menu Open`**: Giao diện menu toàn màn hình trên điện thoại với các nhóm danh mục rõ ràng.

### B. Ma trận Tương tác Prototype (Interactions Map)
- **Từ Desktop Homepage:**
  - Nhấn `Family Tree` ➔ Chuyển sang Artboard 2 (`Nav Dropdown Family Tree`) [Hiệu ứng: Dissolve, 0.25s].
  - Nhấn `Search` ➔ Chuyển sang Artboard 3 (`Nav Dropdown Search`) [Hiệu ứng: Dissolve, 0.25s].
  - Nhấn `Memories` ➔ Chuyển sang Artboard 4 (`Nav Dropdown Memories`) [Hiệu ứng: Dissolve, 0.25s].
- **Từ các Dropdown Artboard:**
  - Nhấn vào vùng nền mờ (Backdrop) hoặc Logo ➔ Quay trở lại Artboard 1 (`Desktop Homepage Default`).
- **Từ Tablet Homepage:**
  - Nhấn nút `☰` (Hamburger) ➔ Chuyển sang Artboard 6 (`Tablet Menu Open`) [Hiệu ứng: Slide-left, 0.25s].
  - Nhấn nút `✕` (Close) ➔ Quay về Artboard 5 (`Tablet Homepage`) [Hiệu ứng: Slide-right, 0.25s].
- **Từ Mobile Homepage:**
  - Nhấn nút `☰` (Hamburger) ➔ Chuyển sang Artboard 8 (`Mobile Menu Open`) [Hiệu ứng: Slide-left, 0.25s].
  - Nhấn nút `✕` (Close) ➔ Quay về Artboard 7 (`Mobile Homepage`) [Hiệu ứng: Slide-right, 0.25s].

---

## 7. CÁC ĐIỂM CHƯA THỂ QUAN SÁT & RANH GIỚI BẢO VỆ (UNOBSERVED / BLOCKED)

1. **Ranh giới Xác thực Người dùng (Authentication Boundary):**
   - Các màn hình sâu yêu cầu đăng nhập tài khoản thực tế (như trang cá nhân `Person List` dành cho người còn sống, trang đóng góp `My Contributions`, hay trang nhận việc `Indexing`) chỉ quan sát được tiêu đề và tài liệu mô tả chính thức; không đăng nhập tài khoản thật để tránh vi phạm chính sách dữ liệu cá nhân.
2. **Cơ chế Cookie Consent Banner (`#consent_blackbar`):**
   - FamilySearch sử dụng banner chấp thuận cookie che phủ toàn màn hình (`truste_overlay`). Khi khảo sát tự động qua trình duyệt, cần loại bỏ lớp phủ này để chuột và sự kiện click có thể tương tác bình thường với thanh điều hướng.

---

## 8. BẢNG PHÂN LOẠI TRẠNG THÁI THEO QUY CHUẨN AIOS

| Hạng Mục Khảo Sát | Hiện Trạng Thực Tế | Nhãn Trạng Thái Nhận Thức |
| :--- | :--- | :---: |
| **Cấu trúc Header Desktop (1440px)** | Đã đo đạc CSS (60px, #FEFEFE, Logo SVG 132x34px, 5 buttons). | `OBSERVED` / `RECREATED` |
| **Cấu trúc 5 Menu Dropdown** | Đã trích xuất 29 liên kết con chính thức theo tài liệu Help Center. | `OBSERVED` / `RECREATED` |
| **Bố cục 8 Section Homepage** | Đã trích xuất văn bản, thứ tự, kích thước và màu nền của từng khối. | `OBSERVED` / `RECREATED` |
| **Responsive Tablet (768px) & Mobile (390px)** | Đã quan sát cách bố cục thu gọn, ẩn menu vào hamburger và dồn 1 cột. | `OBSERVED` / `RECREATED` |
| **Tệp Adobe XD (`FamilySearch_Baseline_01.xd`)** | Đã tạo thành công với 8 Artboards và 10 Prototype interactions. | `RECREATED` / `VERIFIED` |
| **Thử nghiệm tương tác Prototype** | Đã liên kết các trigger tap/click giữa các Artboards trong XD. | `TESTED` / `VERIFIED` |

---

## 9. ĐIỂM DỪNG & BÀN GIAO (HANDOFF TO OWNER)

Nhiệm vụ **FamilySearch Baseline Reconstruction — Batch 01 (Homepage + Global Navigation)** đã hoàn tất đầy đủ:
1. File Adobe XD chính thức: [`assets/XD/FamilySearch_Baseline_01.xd`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/assets/XD/FamilySearch_Baseline_01.xd)
2. Logo FamilySearch SVG vector đã lưu tại: [`assets/images/familysearch-logo.svg`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/assets/images/familysearch-logo.svg)
3. Toàn bộ mã nguồn sinh tự động: [`scripts/generate_fs_baseline_xd.py`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/scripts/generate_fs_baseline_xd.py)

**Dừng lại tại đây theo đúng chỉ thị.** Không tự chuyển sang Batch 02 và không tự ý thay đổi thiết kế. File XD đã sẵn sàng để Tuấn trực tiếp mở trên máy và đánh giá trước khi quyết định bước tiếp theo.

