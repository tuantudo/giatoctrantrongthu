# CẨM NANG HƯỚNG DẪN QUẢN TRỊ & CHỈNH SỬA NỘI DUNG
## SÁCH HƯỚNG DẪN THỰC HÀNH DÀNH CHO CHỦ QUẢN HỆ THỐNG (PRODUCT OWNER RUNBOOK)

**Dự án:** Nền tảng Gia Tộc Trần Trọng Thu  
**Phiên bản:** v2.0.1 (Architecture & Content Governance)  
**Đối tượng sử dụng:** Tuấn (Human Product Owner & Final Authority)  
**Tài liệu tham chiếu:** [`docs/content/CONTENT_REGISTRY.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/content/CONTENT_REGISTRY.md) & [`docs/content/MEDIA_REGISTRY.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/content/MEDIA_REGISTRY.md)

---

## 1. NGUYÊN TẮC BẤT BIẾN KHI CHỈNH SỬA (GOLDEN EDITING RULES)

1. **Nguyên tắc "Biết rõ sửa ở đâu":**  
   Mọi nội dung trên website đều có một vị trí lưu trữ duy nhất (Single Source of Truth). Tra cứu mã nội dung tại [`CONTENT_REGISTRY.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/content/CONTENT_REGISTRY.md) trước khi sửa để biết chính xác file cần mở.

2. **Quy tắc "Không sửa vùng cấm" (Immutable Zones):**  
   Tuyệt đối **KHÔNG SỬA TRỰC TIẾP** các file thuộc lõi thuật toán hoặc dữ liệu gốc sau đây:
   - `src/js/domain/**`: Lõi tính toán quan hệ huyết thống, phả hệ, lịch âm dương đã được đóng băng kiểm thử.
   - `GIADINHONGTHU.ged`: Tệp phả hệ GEDCOM gốc của dòng họ. Mọi thay đổi dữ liệu phải qua quy trình migration.
   - `brand/BRAND_GOVERNANCE_v0.1.md`: Hiến pháp thương hiệu (chỉ sửa khi Tuấn ra quyết định chiến lược mới).

3. **Quy tắc an toàn khi biên tập:**  
   Sau khi chỉnh sửa bất kỳ tệp dữ liệu hay mã nguồn nào, luôn chạy lệnh kiểm thử kiểm tra lỗi cú pháp:
   ```bash
   node tests/test_server_schedule.mjs
   npm test
   ```

---

## 2. HƯỚNG DẪN CHỈNH SỬA CHI TIẾT THEO TỪNG VÙNG NỘI DUNG

### 2.1. Chỉnh sửa Nội dung Trang chủ Công khai (`/`)
*Mã nội dung: `ED-PUB-001` đến `ED-PUB-008`*  
*Tệp nguồn duy nhất:* [`src/js/ui/public-home.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/public-home.js)

- **Lời hiệu triệu & Tiêu đề đầu trang (Section 01 - Hero):**
  - Mở `src/js/ui/public-home.js`, tìm hàm `renderPublicHome()`.
  - Sửa chuỗi tiêu đề tại `headline` (ví dụ: *"Gia Tộc Trần Trọng Thu"*), `subhead` (*"Cội Nguồn — Gắn Kết — Tiếp Nối"*), và đoạn văn giới thiệu `copy`.
- **Thông tin Cụ Tổ & Tiền Nhân (Section 02 - Ancestors):**
  - Tìm khối `ancestor-card`. Tại đây chứa thông tin ghi nhận về Cụ Tổ và Cụ Bà.
  - *Lưu ý:* Mục này sử dụng Huy hiệu Monogram Tri ân (`.gi-cr-ancestor-crest`), tuyệt đối không gán link ảnh bia mộ vào làm chân dung.
- **Giới thiệu Ấn phẩm MẠCH (Section 03 - Editorial Showcase):**
  - Tìm khối `cr-mach-card`. Sửa tên bài viết tiêu điểm, lời trích dẫn tư liệu và liên kết đọc nhanh.
- **Các Cửa Dẫn Vào Không Gian Thành Viên (Section 04 - Member Doors):**
  - Chứa 4 thẻ dẫn: Phả hệ dòng họ, Kho tư liệu ảnh, Lịch kỵ giỗ & niên biểu, và Chuyên san MẠCH.
  - Khi cần đổi mô tả ngắn của từng không gian, sửa trực tiếp text trong các mảng thẻ tương ứng.
- **Chân trang & Lời cảm tạ (Section 05 - Colophon Footer):**
  - Sửa lời cảm từ, thông tin liên hệ Ban liên lạc gia tộc, và đường dẫn Trợ giúp & Kết nối.

---

### 2.2. Chỉnh sửa Menu Điều Hướng (Navigation & Sitemap)
*Mã nội dung: `CFG-NAV-001` đến `CFG-NAV-003`*  
*Tệp nguồn:* [`src/js/ui/navigation.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/navigation.js) và [`src/js/ui/shell.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/shell.js)

- **Menu trang công khai (Public Header Nav):**
  - Mở `src/js/ui/shell.js`, tìm biến mảng `export const PUBLIC_NAV = [...]`.
  - Thêm, bớt hoặc đổi tên nhãn hiển thị (ví dụ: `'Trang chủ'`, `'Cội nguồn'`, `'Trợ giúp & Kết nối'`).
- **Menu Không gian thành viên (Member Nav):**
  - Mở `src/js/ui/shell.js`, tìm `export const MEMBER_NAV = [...]`.
  - Danh mục gồm: *Không gian của tôi (`/me`), Cây phả đồ (`/me/tree`), Kho tư liệu ảnh (`/me/gallery`), Lịch giỗ & Niên biểu (`/me/events`), Chuyên san MẠCH (`/me/mach`), Tài khoản (`/me/account`)*.
- **Đổi tên nhãn breadcrumb và phân cấp trang:**
  - Mở `src/js/ui/navigation.js`, sửa mảng `routes` tương ứng với từng `path`.

---

### 2.3. Chỉnh sửa Chuyên san & Bài viết Ký ức (MẠCH Publications)
*Mã nội dung: `ED-MACH-000` đến `ED-MACH-012`*  
*Tệp nguồn:* [`server/data/mach.json`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/data/mach.json) và [`src/js/ui/editorial.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/editorial.js)

- **Thêm bài viết mới vào MẠCH:**
  - Mở `server/data/mach.json`. Mỗi bài viết là một JSON object trong mảng `articles`:
    ```json
    {
      "id": "mach-01-bai-04",
      "issueId": "issue-01",
      "title": "Tiêu đề bài viết ký ức",
      "author": "Tên người ghi lại",
      "date": "2026-11-12",
      "excerpt": "Đoạn trích dẫn tóm tắt...",
      "content": "Nội dung bài viết đầy đủ...",
      "heroImage": "assets/images/mach/issue-01/ten-anh.jpg"
    }
    ```
- **Thêm hình ảnh minh họa cho MẠCH:**
  - Copy ảnh vào thư mục `assets/images/mach/issue-01/`.
  - Tham chiếu đường dẫn ảnh vào trường `heroImage` hoặc chèn vào mảng tư liệu kèm bài viết.

---

### 2.4. Chỉnh sửa Thông tin Trợ giúp & Khôi phục Tài khoản
*Mã nội dung: `ED-HELP-001` đến `ED-HELP-003`, `ED-RECOV-001`, `ED-RECOV-002`*  
*Tệp nguồn:* [`src/js/ui/help.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/help.js) và [`src/js/ui/recovery.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/recovery.js)

- **Cập nhật danh sách câu hỏi thường gặp (FAQs):**
  - Mở `src/js/ui/help.js`, tìm mảng `faqs` bên trong hàm `renderHelp()`.
  - Có thể chỉnh sửa nội dung câu hỏi (`q`) và câu trả lời (`a`) về cách đăng nhập, cách tìm tên cụ trong phả đồ, cách gửi ảnh gia đình đóng góp.
- **Cập nhật thông tin Ban liên lạc hỗ trợ:**
  - Trong `src/js/ui/help.js` và `src/js/ui/recovery.js`, tìm form hỗ trợ `contactForm` và hướng dẫn liên hệ trực tiếp Người quản trị (Steward) qua số điện thoại/Zalo.
  - Cập nhật số điện thoại Hotline, Zalo hoặc Email hỗ trợ bà con họ hàng khi quên mật khẩu.

---

### 2.5. Thay đổi Cấu hình Thông báo Giờ Nghỉ Máy Chủ NAS
*Mã nội dung: `ED-SCHED-001`, `ED-SCHED-002`*  
*Tệp nguồn duy nhất:* [`src/js/ui/server-schedule.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/server-schedule.js)

- **Thay đổi khung giờ máy chủ nghỉ định kỳ (mặc định 01:00 – 09:00):**
  - Mở `src/js/ui/server-schedule.js`, tìm biến cấu hình:
    ```javascript
    export const SCHEDULE_CONFIG = Object.freeze({
      restStartHour: 1,      // Giờ bắt đầu nghỉ (01:00)
      restStartMinute: 0,
      restEndHour: 9,        // Giờ kết thúc nghỉ (09:00)
      restEndMinute: 0,
      timeZone: 'Asia/Ho_Chi_Minh'
    });
    ```
- **Sửa câu thông báo gửi tới bà con dòng họ:**
  - Tìm hằng số `SCHEDULE_RESTING_TITLE` và `SCHEDULE_RESTING_MESSAGE` trong `src/js/ui/server-schedule.js`.
  - Sửa câu văn trang trọng, rõ ràng theo đúng ngôn từ Tuấn đã phê chuẩn.

---

### 2.6. Thay đổi Ảnh Logo và Biểu trưng Nhận diện
*Mã nội dung: `CFG-AST-001`*  
*Tệp nguồn:* [`assets/ASSET_MANIFEST.json`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/assets/ASSET_MANIFEST.json)

- Khi cần thay thế Logo:
  1. Đặt tệp SVG mới vào thư mục `assets/images/`.
  2. Mở `assets/ASSET_MANIFEST.json`, cập nhật đường dẫn `path` trỏ tới tệp mới.
  3. Không cần sửa bất kỳ file mã nguồn JavaScript nào; toàn bộ Header và Footer sẽ tự động nhận diện logo mới qua `src/js/ui/assets.js`.

---

## 3. CHECKLIST KIỂM SOÁT AN TOÀN TRƯỚC KHI LƯU (PRE-SAVE CHECKLIST)

- [ ] Nội dung đã viết hoa trang trọng tên tiền nhân, địa danh và danh xưng dòng tộc.
- [ ] Không có ký tự đặc biệt làm vỡ cấu trúc chuỗi JavaScript (dấu ngoặc kép, nháy đơn chưa thoát).
- [ ] Ảnh đính kèm đã có trên đĩa và đường dẫn là đường dẫn tuyệt đối bắt đầu bằng `/assets/...`.
- [ ] Chạy lệnh kiểm thử cú pháp: `node --check <file-vua-sua>` hoặc `npm test`.
- [ ] Xem thử trên giao diện cục bộ (Local Preview) trên cả 2 màn hình: Điện thoại (375px) và Máy tính (1440px).

