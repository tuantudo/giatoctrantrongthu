# WEB INTERFACE REFERENCE RESEARCH & ARCHITECTURAL DIRECTION
**Project:** giatoctrantrongthu.com
**Goal:** Define the Information Architecture and Editorial UI structure by referencing real-world publications and archives.

---

## 1. RESEARCH METHODOLOGY
Khảo sát tập trung vào việc bóc tách Cấu trúc Thông tin (Information Architecture - IA) của 17 website thực tế thuộc 4 nhóm chính. Tiêu chí đánh giá dựa trên:
1. Sức mạnh của Masthead.
2. Hệ thống phân cấp biên tập (Editorial Hierarchy).
3. Cách tổ chức Archive (Lưu trữ).
4. Mức độ phù hợp với dữ liệu hiện tại của Gia Tộc (Gia Phả, Mạch, Tư Liệu, Lịch).

---

## 2. TIA SÁNG (BASELINE) COMPARISON
**URL:** `tiasang.com.vn`
- **Điểm đúng với Gia Tộc:** Cấu trúc Publication thuần túy; Masthead vĩ đại ở trung tâm; chia Section bằng horizontal rules; tách biệt rõ Navigation và Content.
- **Điểm có thể cải thiện:** Tia Sáng thiên về báo chí khoa học/tin tức (news-heavy). Nó thiếu cảm giác "Di sản/Lịch sử" (Heritage/Archive) và sự tôn nghiêm của một Dòng họ.
- **Kết luận sơ bộ:** Dùng Tia Sáng làm **Bộ khung xương (Structural Skeleton)**, nhưng cần vay mượn "Da thịt và Tinh thần" (Skin & Vibe) từ các trang Lưu trữ Lịch sử (Historical Archives) và Tạp chí Văn chương (Literary Magazines).

---

## 3. 15+ REAL-WORLD REFERENCES ANALYSIS

### Nhóm A: Editorial / Magazine / Literary Publication
1. **The Paris Review** (`theparisreview.org`)
   - *Điểm mạnh:* Classic masthead, typography serif tuyệt đẹp, layout siêu gọn gàng.
   - *Điểm yếu:* Ít module phức tạp, chủ yếu là bài viết.
   - *Fit:* 4/5 (Rất tốt để tham khảo cho section MẠCH).
2. **Lapham’s Quarterly** (`laphamsquarterly.org`)
   - *Điểm mạnh:* Giao diện đậm chất lịch sử, kết hợp hoàn hảo giữa Archive và Editorial. Các "thời kỳ" được chia thành section rõ ràng.
   - *Điểm yếu:* Hơi nặng nề về text.
   - *Fit:* 5/5 (Lý tưởng cho vibe "Từ 1872").
3. **Kinfolk** (`kinfolk.com`)
   - *Điểm mạnh:* Whitespace xuất sắc, thư viện ảnh (gallery) trình bày dạng lưới sang trọng.
   - *Điểm yếu:* Quá tối giản, giống portfolio hơn là archive.
   - *Fit:* 3/5 (Tham khảo cho Tư Liệu Gốc).
4. **Monocle** (`monocle.com`)
   - *Điểm mạnh:* Dense layout, multi-column.
   - *Điểm yếu:* Quá chật chội, giống báo tài chính.
   - *Fit:* 2/5.
5. **The New Yorker** (`newyorker.com`)
   - *Điểm mạnh:* Masthead kinh điển, phân tách module bằng nét vẽ mảnh.
   - *Fit:* 4/5.

### Nhóm B: Newspaper / News / Periodical
6. **The New York Times** (`nytimes.com`)
   - *Điểm mạnh:* Information density cao nhất, hệ thống hierarchy hoàn hảo.
   - *Điểm yếu:* Quá phức tạp cho một website gia tộc.
   - *Fit:* 3/5.
7. **The Guardian** (`theguardian.com`)
   - *Điểm mạnh:* Color-coded sections (Mỗi mục một màu).
   - *Fit:* 2/5.
8. **Znews / Zing News** (`znews.vn`)
   - *Điểm mạnh:* Module trình bày đa dạng, layout tạp chí hiện đại.
   - *Điểm yếu:* Mang tính thị trường, thiếu sự trang trọng.
   - *Fit:* 2/5.
9. **Tia Sáng** (`tiasang.com.vn`)
   - *(Đã phân tích ở trên - Fit: 4.5/5)*

### Nhóm C: Cultural / Historical / Digital Archive
10. **Smithsonian Magazine** (`smithsonianmag.com`)
    - *Điểm mạnh:* Mix giữa lịch sử và bài viết đời sống. Hero section ấn tượng.
    - *Fit:* 4/5.
11. **Google Arts & Culture** (`artsandculture.google.com`)
    - *Điểm mạnh:* Trưng bày hiện vật/hình ảnh (Tư liệu) cực kỳ hiện đại.
    - *Điểm yếu:* Giống App hơn là Publication.
    - *Fit:* 3/5.
12. **The Churchill Archive** (`churchillarchive.com`)
    - *Điểm mạnh:* Tổ chức hàng vạn tài liệu gốc theo timeline.
    - *Fit:* 4/5 (Rất hợp làm tham chiếu cho module Tư Liệu).
13. **History.com** (`history.com`)
    - *Điểm mạnh:* Timeline events, "This Day in History".
    - *Fit:* 3.5/5 (Tham chiếu tốt cho module Lịch / Ngày giỗ).

### Nhóm D: Family History / Genealogy / Living Archive
14. **The Royal Family** (`royal.uk`)
    - *Điểm mạnh:* Website chính thức của Hoàng gia Anh. Cấu trúc tuyệt vời: Có masthead uy nghiêm, chia section rõ ràng (Members, News, History).
    - *Điểm yếu:* Hơi thiên hướng PR chính phủ.
    - *Fit:* 5/5 (Bản chất là trang web của một "Gia tộc" lớn).
15. **JFK Library** (`jfklibrary.org`)
    - *Điểm mạnh:* Tôn vinh một nhân vật/gia tộc, kết hợp thư viện ảnh và tiểu sử.
    - *Fit:* 4.5/5.
16. **FamilySearch** (`familysearch.org`)
    - *Điểm mạnh:* Tooling mạnh.
    - *Điểm yếu:* Là một SaaS Web App, không phải Publication. ANTI-PATTERN cho Homepage.
    - *Fit:* 1/5.
17. **Nobel Prize** (`nobelprize.org`)
    - *Điểm mạnh:* Archive vinh danh cá nhân theo năm.
    - *Fit:* 3.5/5.

---

## 4. TOP 5 DEEP DIVE

### 1. Lapham’s Quarterly
- **URL:** `laphamsquarterly.org`
- **Structure Summary:** Masthead Serif cực to -> Thin Navigation -> Featured Essay -> Sections chia theo thời kỳ.
- **Điểm mạnh:** Cảm giác "Lịch sử sống". Typography hoàn hảo cho các bài viết dài, trích dẫn.
- **Điểm yếu:** Ít module hình ảnh.
- **Phù hợp với Gia Tộc:** Rất hợp với tinh thần "Từ 1872 đến chúng ta" và tính chất của MẠCH.
- **Nên bê nguyên:** Cách xử lý font Serif và khoảng trắng; cách hiển thị Trích dẫn (Quotes/Excerpts).
- **Score:** 9/10

### 2. The Royal Family (UK)
- **URL:** `royal.uk`
- **Structure Summary:** Coat of Arms (Logo) centered -> Mega Nav -> Hero Image -> "The King", "The Queen" (People) -> Latest News -> Heritage.
- **Điểm mạnh:** Giải quyết bài toán hiển thị "Nhân vật" (Gia phả) cạnh "Tin tức" (Mạch).
- **Điểm yếu:** Layout hơi "đóng hộp" (blocky).
- **Phù hợp với Gia Tộc:** Là minh chứng rõ nhất cho việc làm web cho một "Dòng họ" mà không bị biến thành app gia phả.
- **Nên bê nguyên:** Ý tưởng module "Nhân vật tiêu biểu" và "Lịch sử dòng họ".
- **Score:** 9/10

### 3. The Paris Review
- **URL:** `theparisreview.org`
- **Structure Summary:** Utility Strip -> Huge Centered Logo -> Horizontal Nav -> Grid 2 cột (Articles).
- **Điểm mạnh:** Thanh lịch, tôn vinh nội dung chữ. Cấu trúc 3 lớp Header chuẩn mực.
- **Phù hợp với Gia Tộc:** Tổ chức MẠCH.
- **Nên bê nguyên:** Hệ thống đường viền kẻ (hairline borders) chia cắt bài viết thay vì dùng shadow/cards.
- **Score:** 8.5/10

### 4. JFK Library
- **URL:** `jfklibrary.org`
- **Structure Summary:** Left Logo -> Search -> Hero Slider -> Explore the Archive -> Timeline.
- **Điểm mạnh:** Tổ chức Tư liệu số (Digital Archives) rất khoa học.
- **Nên bê nguyên:** Cách trình bày thư viện ảnh/tài liệu gốc (Tư Liệu).
- **Score:** 8/10

### 5. Tia Sáng (The Baseline)
- **URL:** `tiasang.com.vn`
- **Structure Summary:** Date/Search -> Logo -> Nav -> Lead (60/40) -> Sections.
- **Điểm mạnh:** Rhythm rất tốt, quen thuộc với độc giả Việt.
- **Nên bê nguyên:** Tỷ lệ chia cột Front Page (60% bài chính / 40% cột Sidebar cho Lịch).
- **Score:** 8.5/10

---

## 5. ĐỀ XUẤT CUỐI CÙNG (RECOMMENDED DIRECTION)

**Lựa chọn: C. HYBRID (Tia Sáng Structure + Lapham’s Typography/Vibe + Royal.uk Module Logic)**

Sử dụng bộ khung (Grid & Layout) của Tia Sáng để tạo nhịp điệu dễ đọc, nhưng khoác lên lớp áo Typography/Visual của Lapham's Quarterly để tạo sự trang trọng, lịch sử. Sắp xếp module nội dung theo tư duy của Royal.uk (tôn vinh Nhân vật và Di sản).

### Gia Tộc Module Mapping:
- **Tia Sáng Structure / Layout** → Front Page Skeleton.
- **Masthead** → Gia Tộc Trần Trọng Thu + "TỪ 1872 ĐẾN CHÚNG TA" (Centered, lấy cảm hứng từ The Paris Review).
- **Lead / Hero (Trang nhất)** → Bài viết MẠCH nổi bật nhất hoặc Sự kiện Gia tộc lớn nhất.
- **News Section (Royal.uk)** → **MẠCH** (3-4 bài viết dạng list báo chí).
- **Archive / Gallery (JFK)** → **Tư Liệu Gốc** (Grid ảnh có khung viền).
- **Members Section (Royal.uk)** → **Gia Phả** (Summary stats, hình ảnh cây phả hệ, teaser đến trang app gia phả).
- **Sidebar (Tia Sáng / History.com)** → **Lịch / Ngày Giỗ** (Widget dọc hiển thị "Sắp tới").

---

## 6. IMPLEMENTATION DIRECTION FOR CLINE
*(Chỉ định cho Agent Code - KHÔNG viết code tại đây)*

**1. Homepage Structure & Module Order:**
- **Layer 1: Utility Strip** (Ngày tháng trái, Tìm kiếm/Cài đặt phải).
- **Layer 2: Masthead** (Centered Logo, 3 kích thước responsive, NO duplicated HTML tagline).
- **Layer 3: Primary Navigation** (Full width, horizontal rules top & bottom).
- **Layer 4: Front Page Lead** (Chia 2 cột: Trái 65% là Bài đinh từ MẠCH, Phải 35% là Sidebar Lịch/Sự kiện).
- **Layer 5: MẠCH Section** (Heading chữ Serif in hoa có kẻ ngang. Dưới là 3 bài viết xếp dạng list dọc hoặc grid 3 cột).
- **Layer 6: TƯ LIỆU Section** (Grid 4 cột ảnh/thumbnails, có caption mỏng bên dưới).
- **Layer 7: GIA PHẢ Section** (Full width banner hoặc khối summary thống kê: "150 thành viên, 5 thế hệ" + CTA "Khám phá phả đồ").
- **Layer 8: Footer** (Căn giữa, thông tin Ban Liên Lạc).

**2. Layout Hierarchy & Density:**
- Tăng mật độ nội dung (Density) so với hiện tại. Các bài viết xếp sát nhau hơn, chia tách bằng **Hairline borders (1px solid var(--border))**, TUYỆT ĐỐI KHÔNG dùng box-shadow, không dùng thẻ Card bo góc.
- Khoảng trắng (Whitespace) chỉ dùng để định hình lề (margin) giữa các Section lớn.

**3. Typography Hierarchy:**
- Section Headings: `Times New Roman`, In hoa, tracking rộng.
- Article Titles: `Times New Roman`, chữ to, line-height hẹp.
- Excerpts/Dates: `Inter` (Sans-serif), chữ nhỏ, màu xám (`var(--text-muted)`).

**4. Desktop / Tablet / Mobile Behavior:**
- **Desktop (>1024px):** 2 cột chính (Main 65%, Sidebar 35%). Logo Original.
- **Tablet (640px - 1023px):** 2 cột (Main 60%, Sidebar 40%). Logo Ngang.
- **Mobile (<640px):** 1 cột thẳng đứng. Sidebar Lịch rớt xuống dưới Lead Content. Logo Icon. Navigation biến thành Hamburger hoặc dải scroll ngang.

---

## 7. OWNER DECISIONS REQUIRED

Owner vui lòng xem qua các website thuộc TOP 5 (đặc biệt là `laphamsquarterly.org` và `royal.uk`) và xác nhận:
1. Có đồng ý với hướng **Hybrid (Khung Tia Sáng + Vibe Lapham's + Logic Royal.uk)** như đề xuất không?
2. Có đồng ý chèn một khối (Teaser) của **Gia Phả** ra ngoài trang chủ dưới dạng Thống kê/Summary thay vì chỉ là một đường link trong menu không?
3. Với module Tư Liệu hiển thị trên trang chủ, Owner muốn ưu tiên hiển thị hình ảnh ngẫu nhiên, hay tài liệu văn bản mới nhất?

*(Chờ Owner duyệt trước khi giao Cline bắt đầu refactor CSS/HTML).*
