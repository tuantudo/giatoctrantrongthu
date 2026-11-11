# DESIGN SPECIFICATION — PUBLIC HOME v0.4
*Trạng thái: [IMPLEMENTED - READY FOR HUMAN REVIEW]*

## 1. MỤC ĐÍCH TRANG (PAGE PURPOSE)
Public Home là **Cổng của Gia tộc (Family Gate)**. Nó không phải là tài liệu hướng dẫn kỹ thuật, không phải là danh sách tính năng (features list), và tuyệt đối không phải màn hình chờ (empty state). Nó định danh sự hiện diện của thiết chế Gia Tộc Trần Trọng Thu trên mạng và chia ra 2 con đường rõ rệt cho Người Ngoài và Người Trong Nhà.

## 2. NARRATIVE HIERARCHY & CẤU TRÚC (COMPOSITION)
Không còn sử dụng layout tuyến tính `01 -> 02 -> 03`. Trang được thiết kế theo 2 nhịp:
1. **The Threshold (Điểm Nhận Diện - Khối Đầu Tiên):** Bao phủ hoàn toàn tầm nhìn. Chứa H1 khổng lồ `Gia Tộc Trần Trọng Thu` và một dòng định danh tĩnh lặng.
2. **The Dichotomy Grid (Hai Hướng Đi - Khối Kế Tiếp):** Lưới chia đôi (Split Column) phá vỡ tính chất "cuộn dọc liên tục":
   - **Outward (Tiếng nói của gia tộc):** Những gì gia tộc ngỏ cùng thế giới.
   - **Inward (Người trong gia tộc):** Bức tường có cánh cửa hẹp dành cho thành viên bước vào.

## 3. THÀNH PHẦN CHI TIẾT (COMPONENT BEHAVIOR)
### A. Family Threshold (`.gi-threshold`)
- **Vai trò:** Chiếm toàn bộ "Sức nặng Thị giác" (Visual Weight).
- **Thiết kế:** Thay vì dùng logo rườm rà hay hero image marketing, Tên Gia Tộc được trình bày bằng `Times New Roman` kích thước cực đại (clamp), bọc bởi khoảng trắng khổng lồ.
- **Rule:** Ẩn hoàn toàn logo và chữ ở Global Header (`shell.js`) để Tên Gia Tộc tại Threshold trở thành điểm neo duy nhất và quyền lực nhất, tránh lặp lại (duplicate recognition).

### B. Outward Path / Deliberate Silence (`.gi-voice__absence`)
- **Vai trò:** Nếu chưa có nội dung public, không được dùng các cảnh báo kỹ thuật (Gray Alert / No Data / Coming soon).
- **Thiết kế:** Sử dụng một câu văn tinh giản *"Gia tộc hiện chưa có điều muốn nói ra ngoài"* bằng phông chữ nghiêng (italic serif) và để một khoảng trắng mênh mông, biến sự vắng mặt thành "Sự tĩnh lặng có chủ đích" (Deliberate Silence).

### C. Inward Path / Member Gate (`.gi-gate__door`)
- **Vai trò:** Thay thế cho khái niệm Nút Đăng Nhập (Login Button) khô cứng của SaaS.
- **Thiết kế:** Một khối chữ nhật bọc bởi viền dày dặn (border), góc vuông (no radius), không bóng mờ (no shadow). Chữ in hoa (uppercase) giãn cách rộng.
- **Tương tác:** Khi di chuột (hover), không có hiệu ứng "nổi lên" (lift). Thay vào đó là sự đảo ngược màu sắc (đèn/trắng) chớp nhoáng, mô phỏng mực in đè lên giấy - dứt khoát và trang nghiêm.

### D. Footer (`.gi-footer`)
- **Vai trò:** Kết thúc trang.
- **Thiết kế:** Tối giản 1 dòng `© 2026 Gia Tộc Trần Trọng Thu.`. Tuyệt đối không nhét Sitemap, Prototype Info, hay các link nội bộ xuống Footer.
