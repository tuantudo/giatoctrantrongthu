# DESIGN — GIATỘC UI FOUNDATION + MEMBER SPACE

## 1. Overview
Đã hoàn tất xây dựng **UI Foundation** (lớp kiến trúc giao diện đầu tiên) và trang tổng quan **Member Space (`/me`)** cho hệ thống Giatộc, dựa trên việc kế thừa visual language từ website cũ và học hỏi phương pháp luận từ dự án VINHDANHBUTPHA (cấu trúc gọn gàng, hệ thống Epistemic UI, Tokenize).

## 2. Hệ thống UI Foundation
Thư mục: `src/css/foundation/foundation.css`
Đây là bộ CSS cốt lõi, KHÔNG dùng mega-component, KHÔNG lệ thuộc framework (giữ nguyên Vanilla JS/CSS để đồng bộ runtime hiện tại).
- **Design Tokens:** Kế thừa tone màu Institutional (Vàng đồng, Đỏ bã trầu, Giấy ngà cổ) từ website cũ, gán vào CSS Variables (`--color-heritage-red`, v.v.).
- **Typography Scale:** Phân chia rõ Serif (Tên, Heading trang trọng) và Sans-serif (Thông tin, UI text).
- **Page Shell & Container:** Cung cấp `.header`, `.container`, `.grid` để dàn trang responsive dễ dàng.
- **Component Primitives:** Các class tái sử dụng: `.btn`, `.card`, `.badge`, `.empty-state`, `.loading-state`, `.error-state`.
- **Visibility Indicators:** Định nghĩa sẵn màu sắc UI cho Private, Public, và Epistemic (`[FACT]`, `[INFERENCE]`) theo cảm hứng từ VINHDANHBUTPHA.

## 3. Bản thiết kế Member Space (`/me`)
- File: `server/member_dashboard.html`
- Route API: Bổ sung `/api/member/profile` (tại `server/member.js`) để nạp dữ liệu Member/Person theo Session một cách bảo mật.
- **Tính năng hiển thị (Dynamic Data):**
  - Tên đầy đủ, ID phả hệ (vd `@I115@`), năm sinh - năm mất.
  - Avatar initials tự động từ Tên.
  - Phân tích trực tiếp `person.details` (payload JSON từ database) để lấy chính xác thông tin ngày sinh/nơi sinh.
  - Truy vấn chéo (cross-reference) `GET /api/people` để mapping mã `@I...` thành **Tên gọi thực tế của Bố Mẹ, Anh/Chị/Em, Con cái** và hiển thị trong Hồ sơ cá nhân.
- **Tính năng mở rộng (Visibility & Epistemic):**
  - Giao diện có khu vực "Quyền Truy Cập" hiển thị rõ người dùng đang ở vùng Private Member Space (bảo vệ quyền riêng tư).
  - Vùng "Dữ Liệu Epistemic" áp dụng UI Badge (`FACT`, `INFERENCE`) để cảnh báo về nguồn gốc dữ liệu.

## 4. Quản lý Route Phả hệ (Grafting Legacy)
Để bảo toàn cây gia phả cũ (Legacy Baseline) theo yêu cầu *không làm mất chức năng cũ*, em đã:
- **Đổi route:** Chuyển trang Cây gia phả (toàn bộ website cũ) sang URL mới là `/me/tree`.
- Dành `/me` làm Dashboard đón khách (như mô tả ở trên).
- Thêm link "Xem vị trí trên Cây gia phả" vào Dashboard để điều hướng êm ái.
- Fix route logout `/api/member/logout` về đúng chuẩn `/logout` của Express Router nội bộ.

Mọi thứ đều hoạt động mượt mà bằng kiến trúc Vanilla hiện tại. Mời anh khởi động `npm run dev`, login và kiểm tra trang `/me`.
