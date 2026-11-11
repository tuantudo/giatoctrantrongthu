# Giatộc — NAVIGATION MODEL v0.1

## 1. NGUYÊN TẮC ĐIỀU HƯỚNG
Tài liệu này xác định cách thức người dùng di chuyển bên trong Giatộc, đặc biệt giải quyết vấn đề `[OPEN QUESTION]` hiện tại của UI cũ: *"Vào một page rồi không có chỗ quay lại"*. `[PROPOSAL]` Mọi page chi tiết bắt buộc phải có context cha (Parent Context) để thiết lập đường lùi (Back/Breadcrumb) hợp lý, không được dựa dẫm hoàn toàn vào nút Back của trình duyệt.

## 2. PHÂN LỚP ĐIỀU HƯỚNG (NAVIGATION HIERARCHY)

### A. Global Navigation (Public)
*   **Vị trí:** Util Strip + Sticky Header ở D001 Prototype (`/`).
*   **Mục đích:** Hỗ trợ khách vãng lai di chuyển giữa các chuyên mục lớn (Trang chủ, MẠCH, Tìm kiếm).
*   **Auth Boundary (Cổng Xác Thực):** Link "Tư cách thành viên" hoặc "Đăng nhập" dẫn tới `/login`. Đây là ranh giới một chiều (Public → Member).

### B. Member Navigation (Authenticated)
*   **Vị trí:** Thanh Header tại `/me` (Bảng điều khiển, Gia phả toàn tộc, Đăng xuất).
*   **Mục đích:** Xóa bỏ ranh giới quảng bá (Public), thiết lập không gian riêng tư (Intranet/Dashboard) nơi thành viên truy cập các công cụ nội bộ.
*   **Auth Boundary:** Các route bắt đầu bằng `/me` và `/api/member/` đều được bảo vệ bởi middleware xác thực `[FACT]`.

### C. Local Navigation
*   **Vị trí:** Các Sidebar hoặc Tab Menu nằm trong `/me/tree` (Legacy SPA).
*   **Mục đích:** Chuyển đổi giữa các view ngang hàng: Cây phả đồ ↔ Ký ức ↔ Tư liệu ↔ Lịch.

---

## 3. GIẢI QUYẾT BÀI TOÁN "QUAY LẠI" (BACK & BREADCRUMB STRATEGY)

Hiện trạng: UI cũ sử dụng Javascript Hash Routing để nạp đè nội dung (Overlay) nhưng không cung cấp Contextual Back Button.
Định hướng giải quyết `[PROPOSAL]`:

### A. Context-Aware Back Button (Nút Back định hướng theo Ngữ cảnh)
Thay vì dùng `window.history.back()` (chứa rủi ro đẩy user ra khỏi ứng dụng), Nút Back trên UI phải trỏ tĩnh về **Parent Route** của nó.
*   **Person Detail (`#/person/:id`):** Nút "< Trở về Phả hệ" luôn trỏ về `#/gia-pha`.
*   **MẠCH Detail (`#/mach/bai-viet/:slug`):** Nút "< Trở về Danh sách" luôn trỏ về `#/mach`.
*   **Family Detail (`#/family/:id`):** Nút "< Trở về Phả hệ" luôn trỏ về `#/gia-pha`.
*   **Media/Memory Detail:** Nút "< Trở về Thư viện" luôn trỏ về `#/tu-lieu` hoặc `#/ky-uc`.

### B. Breadcrumb (Đường dẫn dạng rễ)
Áp dụng cho các trang có độ sâu > 2 level.
Ví dụ tại trang Chi tiết Tác giả MẠCH:
`MẠCH > Tác giả > [Tên Tác Giả]` (Mỗi node đều có thể click để quay về cấp cha).

### C. Thoát hiểm (Exit Points)
Mọi Modal hoặc Full-screen Overlay phải có nút `✕ Đóng` hoặc nhấn `Esc` để hủy Overlay mà không làm thay đổi URL Hash Cha.

---

## 4. BROWSER BEHAVIOR (HÀNH VI TRÌNH DUYỆT)
*   `[FACT]` Kiến trúc Single Page Application (SPA) qua dấu `#` (Hash) giúp Browser Back Button tự động chuyển đổi state mà không reload lại toàn bộ JSON gia phả nặng nề.
*   `[INFERENCE]` Giữ nguyên kiến trúc Hash này trên trang Gia phả Toàn tộc (`/me/tree`) là một quyết định kỹ thuật đúng đắn (cho Phase MVP) để tránh phải load lại hàng nghìn node DOM.

