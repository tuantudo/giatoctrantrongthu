# Giatộc — USER FLOWS v0.1

## 1. MỤC TIÊU
Tài liệu này mô tả luồng di chuyển tiêu chuẩn của User từ lúc nhập môn đến khi đào sâu vào các thực thể dữ liệu (Person, Memory, Media), bảo đảm luôn có điểm quay về.

---

## 2. KHÁCH VÃNG LAI (PUBLIC VISITOR)

**Luồng A: Đọc MẠCH**
1. **Entry:** User vào `GET /` (Trang chủ Public).
2. **Action:** Click menu "MẠCH". Trình duyệt chuyển Hash tới `#/mach`. (Hiển thị danh sách ấn phẩm).
3. **Action:** Click vào bài viết "Hành trình...". Trình duyệt chuyển tới `#/mach/bai-viet/hanh-trinh`.
4. **Return:** User đọc xong, click logo Giatộc trên header (hoặc nút Back to Mach). Trình duyệt quay về `#/mach` hoặc `#/` mà không load lại trang.

---

## 3. THÀNH VIÊN NỘI BỘ (AUTHENTICATED MEMBER)

**Luồng B: Khám phá Cây Gia phả (Genealogy Flow)**
1. **Entry:** User vào `/login`, nhập credentials.
2. **Action:** Hệ thống redirect về `/me` (Member Dashboard). User thấy thông tin hồ sơ rút gọn của mình.
3. **Action:** Click nút "Gia phả toàn tộc". Trình duyệt load `/me/tree#/` (Legacy SPA).
4. **Action:** Click icon Cây Phả Đồ. Hash chuyển sang `#/gia-pha`. Màn hình vẽ sơ đồ gia phả.
5. **Action:** Click vào một Node (ví dụ: Trần Trọng Thu). Hash chuyển sang `#/person/@I1@`. Overlay Profile mở ra.
6. **Return:** User click nút `✕ Đóng` trên Overlay HOẶC click nút `< Trở về Phả hệ` (Đề xuất UI). Hash quay lại `#/gia-pha`, sơ đồ giữ nguyên trạng thái scroll/zoom trước đó.

**Luồng C: Đọc Ký ức (Memory Flow)**
1. **Entry:** User đang ở `/me/tree`.
2. **Action:** Click tab "Ký ức". Hash chuyển sang `#/memories` hoặc `#/gia-pha/ky-uc`.
3. **Action:** Click vào thẻ Ký ức cụ thể (Memory Card). Hash có thể giữ nguyên (nếu hiện Modal) hoặc chuyển sang `#/memories/:id`. 
4. **Return:** User đọc xong, click `✕ Đóng Modal`. Hash không đổi (hoặc về `#/memories`), UI quay lại thư viện Ký ức.

**Luồng D: Xem Tư liệu gốc (Media Archive Flow)**
1. **Entry:** User đang ở `/me/tree`.
2. **Action:** Click tab "Tư liệu". Hash chuyển sang `#/tu-lieu`. UI hiển thị kho ảnh, văn bản cổ (`GET /api/media.json`).
3. **Action:** Click vào một tấm ảnh cổ. Hash chuyển sang `#/media/:id` hoặc bật Lightbox Modal.
4. **Return:** Thoát Lightbox bằng phím `Esc` hoặc bấm ra vùng mờ (backdrop). Quay lại lưới tư liệu.

---

## 4. TỔNG KẾT HÀNH VI (BEHAVIORAL RULES)
*   **Deep Linking:** Mọi URL có Hash (`#/mach/bai-viet/slug` hoặc `/me/tree#/person/I1`) đều phải có khả năng được copy/paste và nạp trực tiếp đúng trạng thái UI. `[FACT]` Kiến trúc SPA hiện tại đã support điều này một phần.
*   **State Preservation:** Khi User quay lại (Back) từ Detail View ra List View, vị trí cuộn (Scroll Position) và bộ lọc (Filters) không được phép biến mất.
