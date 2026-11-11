# PRODUCT & EXPERIENCE BLUEPRINT
**Project:** Gia Tộc Trần Trọng Thu (`giatoctrantrongthu.com`)
**Purpose:** Hệ thống hóa Workflow thiết kế từ "Design by Code/Mockup" sang "Design by Contract" (Owner định nghĩa IA/Behavior/Data → AGY map Data → Cline implement).

---

## 1. PRODUCT SURFACE MAP

Bản đồ các phân mảnh (Product Surfaces) hiện tại đang hoạt động thực tế trong codebase (`src/js/app.js`):

| Product Surface | Purpose | Current Route | Current Renderer | Current State | Known Limitations |
|---|---|---|---|---|---|
| **Homepage** | Publication Front Page | `#/` | `renderHomePublicationLanding()` | Chứa Lead, Mạch, Lịch, Stats. | Thiếu module Ký ức (do regression). |
| **Gia Phả (Index)** | Danh bạ & Phả đồ | `#/gia-pha` | `renderFamiliesDirectory()` | Grid các gia đình & thống kê. | UI hơi nặng nếu scale lên hàng ngàn người. |
| **Nân Vật (Person)** | Hồ sơ chi tiết | `#/gia-pha/nhan-vat/:id` | `renderPerson()` | Timeline, Thông tin, Gia đình. | Chưa link mạnh với Media/Tư liệu. |
| **Gia Đình (Family)**| Sơ đồ thành viên | `#/gia-pha/gia-dinh/:id` | `renderFamily()` | Husband, Wife, Children. | Chưa thể hiện được đa thê/đa phu phức tạp nếu có. |
| **Ký Ức** | Lời kể / Truyền khẩu | `#/gia-pha/ky-uc` | `renderMemories()` | List các bài ghi chép. | Layout đang giống card danh bạ hơn là bài đọc. |
| **MẠCH (Index)** | Tạp chí nội bộ | `#/mach` | `renderMachModule()` | Grid bài viết / Series. | Thiếu phân trang (Pagination). |
| **MẠCH (Article)** | Chi tiết bài đọc | `#/mach/bai-viet/:slug` | `renderArticleDetail()` | Tiêu đề, Nội dung, Tác giả. | Chưa có Related Content (Bài liên quan). |
| **Tư Liệu** | Kho lưu trữ di sản | `#/tu-lieu` | `renderTuLieuModule()` | Placeholder "Đang xây dựng". | Thiếu Metadata từ backend. |
| **Lịch** | Quản lý ngày kỉ niệm | `#/lich` | `renderCalendarView()` | Grid tháng / Timeline sự kiện. | Dựa vào parser ICS client-side. |
| **Tìm Kiếm** | Tra cứu toàn cục | `#/tim-kiem` | `runSearchPage()` | Kết quả tìm kiếm nhân vật/bài. | Chỉ mới search được Nhân vật (chưa index bài viết). |

---

## 2. USER BEHAVIOR MAP (JOURNEYS)

Các luồng hành vi cốt lõi của người dùng trên hệ thống:

**A. Khám phá Gia Tộc (Newcomer)**
- *Intent:* Tìm hiểu dòng họ này là ai, quy mô thế nào.
- *Entry:* Homepage (`#/`).
- *Flow:* Đọc Hero Lead → Xem thống kê Gia Phả → Kéo xuống xem Lịch/Ký ức.
- *Data:* `machData`, `appData.stats`, `calEvents`.

**B. Đọc một câu chuyện MẠCH (Reader)**
- *Intent:* Tiêu thụ nội dung văn hóa/lịch sử.
- *Entry:* Homepage (Lead Story) hoặc MẠCH Index.
- *Flow:* Click bài viết → Đọc `renderArticleDetail()` → Quay lại Index.
- *Dead end:* Hết bài không có module "Đọc tiếp" hoặc "Bài liên quan". Cần bổ sung.

**C. Tìm một thành viên (Searcher)**
- *Intent:* Tìm ông A, bà B thuộc nhánh nào.
- *Entry:* Utility Bar (Search Input).
- *Flow:* Gõ tên → Ra kết quả (`runSearchPage()`) → Click vào Person Profile (`#/gia-pha/nhan-vat/:id`).
- *Empty State:* "Không tìm thấy ai tên..." (Hiện tại có xử lý nhưng UI sơ sài).

**D. Khám phá quan hệ gia đình (Genealogist)**
- *Intent:* Xem con cái, dâu rể, thứ bậc.
- *Entry:* Person Profile.
- *Flow:* Đang xem Person A → Click "Gia đình" → Xem Family Profile → Click Person B (Con/Cháu).
- *Data Required:* `genealogy.json` (phải có liên kết 2 chiều).

**E. Xem lịch / Ngày giỗ (Participant)**
- *Intent:* Xem sắp tới có đám giỗ / sự kiện họ nào không.
- *Entry:* Sidebar Lịch trên Homepage hoặc `#/lich`.
- *Flow:* Nhìn sự kiện sắp tới → Click xem chi tiết / Sync vào Google Calendar.

---

## 3. INFORMATION ARCHITECTURE (IA)

Phân cấp và quan hệ thực tế giữa các Information Entities (Dựa trên backend data):

- **PERSON (Nhân vật):**
  - *Attributes:* ID, Tên, Ngày/Nơi sinh, Ngày/Nơi mất, Giới tính, Thánh bổn mạng.
  - *Relationships:* Trực thuộc `FAMILY` (với tư cách Con hoặc Vợ/Chồng), sở hữu `MEMORY` (Ký ức), sở hữu `MEDIA` (Avatar/Chân dung).
  
- **FAMILY (Gia đình):**
  - *Attributes:* ID, Ngày kết hôn.
  - *Relationships:* Chứa 1 Husband (`PERSON`), 1 Wife (`PERSON`), nhiều Children (`PERSON` array).

- **STORY (Bài viết MẠCH / Ký ức):**
  - *Attributes:* Title, Excerpt, Content, PublishedAt, Author, HeroMedia.
  - *Relationships:* Thuộc về 1 `SERIES`, có thể tag `PERSON` (Ghi chép về ai đó).

- **EVENT (Sự kiện Lịch):**
  - *Attributes:* Date (Solar/Lunar), Type (Giỗ, Sinh nhật), Summary.
  - *Relationships:* Gắn liền với `PERSON` (Ví dụ: Giỗ cụ A).

- **MEDIA (Tư liệu):**
  - *Attributes:* AssetID, Type, URL. (Hiện thiếu Caption, Category).

---

## 4. UI / INTERFACE BLUEPRINT

Quy chuẩn đặc tả giao diện không dùng Code.

**1. HOMEPAGE PUBLICATION SHELL:**
- *Primary Info:* Bài viết quan trọng nhất (Lead Story), Lịch sắp tới.
- *Secondary Info:* Bài viết gần đây, Thống kê gia phả.
- *Hierarchy:* Masthead → Nav → Grid 2 cột (Lead 65% / Lịch 35%) → Grid 3 cột (Mạch) → Full width (Tư liệu/Thống kê).
- *Empty/Error State:* Nếu mất kết nối API Mạch, fallback sang Hero Tĩnh (Văn bản giới thiệu dòng họ).

**2. PERSON PROFILE:**
- *Primary Info:* Tên, Chân dung (Avatar), Sinh/Tử (Timeline).
- *Secondary Info:* Danh sách gia đình (Bố mẹ, Vợ chồng, Con cái).
- *Actions:* Share, Quay về Gia Phả.

**3. MẠCH ARTICLE:**
- *Primary Info:* Text bài viết, Typography chuẩn (Serif, line-height cao).
- *Secondary Info:* Tác giả, Ngày đăng, Ảnh cover.
- *Loading State:* Text skeleton mờ.

---

## 5. DATA BOUNDARY & STATES

Áp dụng từ `REAL_DATA_INTEGRATION_MAP.md` cho các UI Module chính:

- **Lead Story (Homepage):** `REAL DATA CONNECTED` (Từ `machData`).
- **Sidebar Calendar:** `REAL DATA CONNECTED` (Từ `calEvents`).
- **Family / Person Tree:** `REAL DATA CONNECTED` (Từ `appData`).
- **Memory Spotlight (Homepage):** `REAL DATA EXISTS — NOT CONNECTED` (Có trong `appData.memories`, nhưng UI mới đã lỡ tay xóa DOM render).
- **Global Search:** `REAL DATA EXISTS — NOT CONNECTED` (Logic search có sẵn, nhưng Header Utility bar chưa nối action mở modal/page).
- **Tư Liệu Archive:** `NO SUFFICIENT REAL DATA — PLACEHOLDER JUSTIFIED` (API thiếu metadata, giữ placeholder).

---

## 6. OWNER DECISION SURFACE

Danh sách những quyết định **Owner hoàn toàn làm chủ** mà không cần biết code. Owner chỉ cần chỉ định, AGY/Cline sẽ thực thi:

| Decision Area | Owner Decision (What you control) | Engineering / Data Constraint | Impact |
|---|---|---|---|
| **Hierarchy** | Thứ tự các section trên Homepage (Lịch lên trên Mạch, hay Tư liệu lên trên). | Phụ thuộc tốc độ load API, nếu Lịch API chậm, đưa lên đầu sẽ gây layout shift. | Thay đổi trải nghiệm người dùng ngay lập tức (First Impression). |
| **Prominence** | MẠCH bài đinh chiếm 65% hay 100% chiều ngang. | CSS Grid / Responsive Behavior. | Độ tập trung của mắt vào content. |
| **Nav Labels** | Đổi "MẠCH" thành "Tạp Chí", "Tư Liệu" thành "Di Sản". | Không. | Tone & Voice của thương hiệu. |
| **Typography** | Font chữ Heading, Size chữ Bài viết (To ra, Nhỏ đi). | Phải map vào `brand/manifest.json`. | Mức độ dễ đọc (Readability) và cảm giác Editorial. |
| **User Journey**| Hết bài viết MẠCH thì dẫn user đi đâu tiếp? (Về Home hay Đọc bài liên quan). | Backend phải trả về `Related_Articles`. (Data Constraint). | Tăng thời gian ở lại trang. |
| **Interaction** | Nút Search bấm vào nhảy sang trang mới hay mở Modal/Popup. | Tốn effort setup DOM modal. | Flow mượt mà hơn hay tường minh hơn. |

---

## 7. IMPLEMENTATION HANDOFF CONTRACT (FORMAT CHUẨN)

Mỗi khi Owner thiết kế xong một Feature bằng chữ, hãy dùng template này đưa cho AGY. AGY sẽ review Data, sau đó chuyển Cline gõ code:

```text
[ TÊN FEATURE ]
1. USER GOAL: (Người dùng muốn gì ở đây?)
2. USER FLOW: (Bấm từ đâu -> Ra màn hình này -> Xong đi đâu tiếp?)
3. INFORMATION HIERARCHY: (1. Tiêu đề lớn -> 2. Tóm tắt -> 3. Ảnh -> 4. Chi tiết)
4. UI MODULES: (Cần mấy cột? Border gì? Padding rộng hay hẹp?)
5. BEHAVIOR (Mobile/Hover): (Mobile có ẩn bớt không? Hover có đổi màu không?)
6. DATA SOURCE: (Tự map API/JSON hiện tại vào).
7. ACCEPTANCE CRITERIA: (Làm xong thì test bằng cách nào để pass?)
```

---

## 8. GIA TỘC DESIGN SYSTEM ARCHITECTURE

Để Owner không nhầm lẫn khi ra quyết định, hệ thống được chia làm 5 lớp (Layers) rõ rệt:

1. **Brand System:** (Visual Identity). Trả lời câu hỏi: *Màu gì? Font gì? Logo dùng bản nào?* → Sửa ở `manifest.json`.
2. **Interface System:** (UI Patterns). Trả lời: *Nút bấm hình gì? Nét kẻ mảnh 1px hay 2px? Cột 65/35 hay 50/50?* → Sửa ở `main.css`.
3. **Information Architecture:** (Tổ chức thông tin). Trả lời: *Gia đình có quan hệ thế nào với Nhân vật?* → Backend / SQL.
4. **Behavior System:** (Luồng thao tác). Trả lời: *Bấm nút thì nhảy trang hay mở Pop-up? Cuộn chuột thì Header có dính (sticky) không?* → Sửa ở `app.js` (Routing).
5. **Data System:** (Integration). Trả lời: *API URL là gì? Xử lý lỗi (Error state) khi server sập ra sao?* → Sửa ở `fetch()` trong `app.js`.

---

## 9. CURRENT GAPS (CẦN FIX NGAY)

1. **Memory Regression:** Homepage mới bị rớt mất thẻ "Ký ức tiền nhân". Cần dùng Handoff Contract để ra lệnh Cline khôi phục.
2. **Search Connection:** Ô search ở Header chỉ là HTML tĩnh, chưa trigger hàm `runSearchPage()`.
3. **MẠCH "Đọc tiếp":** Cuối bài viết MẠCH là "ngõ cụt" (Dead end), không có nút quay lại hoặc đọc bài tiếp theo.

---

## 10. RECOMMENDED NEXT DESIGN SEQUENCE

Với Blueprint này, Owner nên thực hiện các bước Design tiếp theo theo trình tự:

1. **Viết Handoff Contract cho "MẠCH Article Detail":** Thiết kế lại trải nghiệm đọc báo (Căn lề, Font size, Drop cap, Trích dẫn, và Bài liên quan ở cuối trang).
2. **Viết Handoff Contract cho "Person Profile":** Biến trang Nhân vật thành một hồ sơ lưu trữ lịch sử trang trọng thay vì chỉ là một the Card danh bạ.
3. **Duyệt lại luồng Global Search:** Quyết định Search Result hiển thị popup hay trang riêng để Cline thi công.
