# PUBLIC HOME RECONSTRUCTION v0.2
## SUPERVISOR REPORT

### 1. Báo cáo file đã sửa
- `src/js/ui/public-home.js`: Đập bỏ SVG Masthead cũ và tái cấu trúc khối `Family Threshold` thành H1 thật sự với Text hiển thị lớn. Làm sạch các copy rác.
- `src/css/foundation/components.css`: Thêm CSS cho `.gi-threshold` (size cực lớn, kẻ viền Publication, không `sr-only`). Ép cứng `border-radius: 0` và `box-shadow: none` cho nút Đăng nhập.
- `src/js/ui/components.js`: Dọn dẹp Footer chỉ còn đúng 1 dòng Copyright theo yêu cầu.

### 2. Báo cáo composition mới
Composition mới từ trên xuống dưới:
- **Global Nav:** [ Home Icon ] và [ Đăng nhập ]. Header tự ẩn text "Gia Tộc" vì đã trùng với nội dung chính bên dưới.
- **Family Threshold (Masthead / Anchor):** Một thẻ `<H1>` siêu lớn hiển thị "Gia Tộc Trần Trọng Thu" căn giữa, bên dưới là Subtitle "Nơi lưu giữ ký ức, hồ sơ và tiếng nói của một gia tộc.". Khối này được rào bởi đường kẻ đôi (double borders) đóng vai trò Masthead và Visual Anchor tuyệt đối.
- **Voice Zone:** `01 - Tiếng nói của gia tộc`. State `not-available` với text rõ ràng thể hiện sự vắng mặt có chủ đích.
- **Split Composition (About & Gate):** Khối `02 - Về gia tộc` và `03 - Người trong gia tộc` được xếp thành 2 cột song song, phá vỡ tính tuyến tính (Linearity) của trang. Gate CTA hiển thị dưới dạng một ô vuông vức, trang nghiêm, không phải SaaS button.
- **Footer:** Sạch sẽ, chỉ có "© 2026 Gia Tộc Trần Trọng Thu".

### 3. Báo cáo semantic boundaries đã bảo vệ
- Semantic H1 hiển thị rõ ràng cho user và bot (Web Accessibility).
- Tuyệt đối không leak MẠCH, Clara, Genealogy, raw Database hay architecture terms.
- `[DRAFT]` và số liệu Gia phả đã bị cấm cửa hoàn toàn khỏi bề mặt Public.

### 4. Báo cáo visual governance
- Giữ đúng Brand Governance: 100% Serif typography (Times New Roman).
- KHÔNG sử dụng Card, Drop Shadow, hay Rounded Corners (`border-radius: 0` được enforce).
- Cấu trúc trang áp dụng Publication Rhythm thông qua Institutional Whitespace và Spatial Tension.
- Trải nghiệm đọc giống như mở trang bìa của một Kỷ yếu Gia tộc.

### 5. Báo cáo responsive QA
- **1440px / 1024px:** H1 hiển thị khổng lồ (64px), Split Composition dàn 2 cột rộng rãi.
- **768px:** Split Composition bắt đầu gom lại (fallback về 1 cột dọc), H1 tự động scale nhỏ xuống tương đối để không bị vỡ chữ.
- **375px:** Responsive ổn định, Gate button tự co giãn vừa màn hình, không bị overflow chiều ngang. Không có console error mới.

### 6. Những vấn đề còn UNKNOWN (Cần Tuấn quyết định)
- **[OPEN QUESTION — HUMAN DECISION REQUIRED]:** Hiện tại Global Header vẫn có thể render Logo SVG nhỏ nếu file `logoGiaToc_ngang.svg` load thành công, điều này có thể dẫn đến việc có 1 logo SVG nhỏ xíu trên thanh Nav và 1 dòng H1 khổng lồ ngay bên dưới. Anh Tuấn có muốn ẨN HOÀN TOÀN Logo trên thanh Global Header khi ở trang Chủ không?

**[ STOP ]**
