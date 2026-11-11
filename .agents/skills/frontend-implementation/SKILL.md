---
name: frontend-implementation
description: >-
  Quy trình triển khai mã giao diện HTML, CSS Foundation và JavaScript UI
  tuân thủ nghiêm ngặt Brand Governance v0.1 và UI System vNEXT.
---

# KỸ NĂNG: FRONTEND IMPLEMENTATION

## 1. Điều Kiện Kích Hoạt (Trigger)
- Thực hiện TASK-11 (Synthetic fixtures), TASK-12 (Mock adapter), TASK-13 (UI System vNEXT).
- Chỉnh sửa giao diện, typography, responsive layout, hoặc bổ sung view mới trong `src/css/` và `src/js/ui/`.

## 2. Phạm Vi & Phân Quyền (Scope & Ownership)
- **Chủ sở hữu:** Cline (Frontend Owner).
- **Thư mục cho phép:** `src/css/`, `src/js/ui/`, `design-playground/`, `fixtures/`, `index.html`.
- **Thư mục cấm:** `server/`, `database/`, `api/`, `brand/` (chỉ đọc Brand Governance).

## 3. Quy Trình Thực Hiện (Procedure)
1. **Kiểm tra chuẩn Brand Governance v0.1:**
   - Đọc quy chuẩn tại [`brand/BRAND_GOVERNANCE_v0.1.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/brand/BRAND_GOVERNANCE_v0.1.md).
   - Kiểm tra Token CSS: Màu sắc, kích thước chữ, khoảng cách, font family (Cinzel, Alegreya, Be Vietnam Pro).
2. **Quy tắc thiết kế bất khả xâm phạm:**
   - **Tuyệt đối không dùng thẻ bo góc (No rounded cards):** Giữ nguyên phong cách báo chí - viện tư liệu lịch sử.
   - **Tuyệt đối không có thanh cuộn ngang (0 horizontal scroll):** Đảm bảo `overflow-x: hidden` hoặc responsive flex/grid chuẩn xác trên mọi màn hình.
   - **Phân định 3 không gian đàm thoại:**
     - `PUBLIC`: Thông điệp công khai hướng ngoại.
     - `MẠCH`: Lưu truyền dòng chảy nội bộ gia tộc.
     - `CLARA`: Thư riêng tư gửi con gái.
3. **Phát triển độc lập qua Mock Adapter:**
   - Trong quá trình hoàn thiện UI, luôn sử dụng dữ liệu giả lập sạch PII (`fixtures/`) qua `mock-adapter.js`. Không gọi trực tiếp backend chưa qua bảo vệ.

## 4. Tiêu Chí Nghiệm Thu (Completion Criteria)
- Giao diện đáp ứng đúng cấu trúc Single Shell & ContextBar.
- Không có lỗi visual regression.
- Sẵn sàng cho kiểm thử tự động Browser QA (Skill `browser-qa`).

