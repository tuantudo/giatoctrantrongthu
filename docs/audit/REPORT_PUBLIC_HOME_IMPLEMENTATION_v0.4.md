# REPORT: PUBLIC HOME IMPLEMENTATION v0.4
*Trạng thái: [READY FOR HUMAN REVIEW]*

## 1. Creative Objective
Triển khai trực tiếp (Implementation) các định hướng từ V0.3 nhằm biến Public Home từ một trang liệt kê thông tin hệ thống (01, 02, 03) thành **Cổng Cửa Gia Tộc**, phân tách rõ ràng 2 hướng đi (Outward & Inward) thông qua Nghệ thuật chữ (Typography) và Khoảng trắng (Whitespace).

## 2. Final Composition & What Changed
- **Lược bỏ Đánh số Tuyến tính:** Các con số `01`, `02`, `03` và khối "Về gia tộc" với câu chữ giải thích kỹ thuật đã bị xóa bỏ hoàn toàn.
- **Header Suppression:** Đã ẩn chữ (và logo) của Gia Tộc trên Global Header khi ở trang Chủ để tránh lặp lại tên Gia Tộc 2 lần trên cùng một viewport (theo đúng Hierarchy: Global = Orientation, Threshold = Primary Recognition).
- **Dichotomy Grid:** Thay vì cuộn dọc liên miên, trang được chia thành 2 phần cân bằng dưới Threshold.
  - Trái: "Tiếng nói gia tộc" với câu văn mới tĩnh lặng.
  - Phải: "Người trong gia tộc" với cánh cửa lớn (không phải Button).

## 3. Why It Changed
- Giải quyết cảm giác "Documentation Page".
- Áp đặt Institutional Character: Khẳng định sự tôn nghiêm, bề thế thông qua những mảng Typography không khoan nhượng.

## 4. Brand Governance Compliance
- Không sử dụng bo góc (border-radius = 0), không bóng đổ (box-shadow = none), không dốc màu (gradient).
- Sử dụng triệt để font Serif (Times New Roman).
- Không rò rỉ (leakage) bất kỳ thuật ngữ nội bộ (MẠCH, Clara, Genealogy, MariaDB, Account ID).

## 5. Files Changed
1. `src/js/ui/public-home.js`: Đập đi xây lại cấu trúc DOM, bỏ `.gi-zone--about`, thay bằng lưới `.gi-dichotomy`.
2. `src/js/ui/shell.js`: Điều chỉnh `brand.mark: !isPublicHome` trong `InstitutionHeader` để loại bỏ duplication.
3. `src/css/foundation/components.css`: Thêm bộ CSS dành riêng cho cấu trúc Dichotomy và Door Hover Interaction.

## 6. Shared Foundation Touched
- Bắt buộc chạm vào `shell.js` và `components.css` để cấu hình lại Header Logic và Layout Grid cho Public Home. Việc thay đổi này đã được kiểm tra (Regression QA) và không phá vỡ Layout của Member Site (`/me`).

## 7. QA (Quality Assurance)
- **Responsive QA:** Khối chia đôi (Split Column) sẽ tự động rớt xuống thành 1 cột (stacked) ở màn hình `< 900px`, nhưng vẫn giữ nguyên khoảng trắng bao quanh để không tạo cảm giác chật chội.
- **Accessibility QA:** `h1` tồn tại trực tiếp trên cấu trúc HTML (Family Threshold), không bị lạm dụng `sr-only`. Focus states của Member Gate hoạt động bình thường như thẻ `<a>`.
- **Regression QA:** Cổng đăng nhập (`/login`) vẫn hoạt động. Không bị lộ dữ liệu Prototype V0.

## 8. Remaining Human Decisions / Limitations
- Layout hiện tại phụ thuộc rất lớn vào sức mạnh của Typographic Scale. Nếu tương lai cần mở rộng "Tiếng nói của gia tộc", cần cẩn trọng để không phá vỡ Lưới Phân Đôi (Dichotomy Grid).
- Toàn bộ Code đang nằm trong Working Tree, chờ lệnh Commit/Deploy từ Tuấn.
