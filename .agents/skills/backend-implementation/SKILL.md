---
name: backend-implementation
description: >-
  Quy trình triển khai, chỉnh sửa mã nguồn Backend Node.js/Express và API.
  Dùng khi thực hiện các task thuộc server/, database DDL, API routing,
  middleware bảo vệ hoặc ReBAC.
---

# KỸ NĂNG: BACKEND IMPLEMENTATION

## 1. Điều Kiện Kích Hoạt (Trigger)
- Nhận task thực thi thuộc Phase 1 (Security Containment), Phase 2 (Database Hardening), hoặc Phase 4 (ReBAC & API).
- Cần vá lỗi logic server, middleware, xác thực, hoặc tạo route API mới.

## 2. Phạm Vi & Phân Quyền (Scope & Ownership)
- **Chủ sở hữu:** AGY (Backend Owner).
- **Thư mục cho phép:** `server/`, `database/`, `tests/`, `scripts/`.
- **Thư mục cấm:** `src/css/`, `src/js/ui/`, `design-playground/`.

## 3. Quy Trình Thực Hiện (Procedure)
1. **Kiểm tra điều kiện tiên quyết:**
   - Xác nhận đã có phê duyệt Human Gate tương ứng từ Tuấn (ví dụ: GATE-01 cho Phase 1).
   - Kiểm tra mã nguồn gốc trước khi sửa: đọc kỹ context, xác định rõ các dòng cần thay đổi.
2. **Triển khai mã nguồn tối thiểu (Minimal Surgical Edit):**
   - Áp dụng các thay đổi chính xác, không ghi đè toàn bộ tệp nếu chỉ sửa vài dòng.
   - Luôn duy trì tương thích ngược (Backward Compatibility) cho các route cũ nếu chưa có lệnh deprecate.
   - Xử lý ngoại lệ đầy đủ (`try...catch`, mã lỗi HTTP chuẩn: 400, 401, 403, 404, 500).
3. **Kiểm tra cú pháp & tính hợp lệ:**
   - Chạy lệnh kiểm tra cú pháp Node.js: `node --check <file.js>`.
4. **Viết và chạy kiểm thử tự động (Unit / Integration Test):**
   - Viết kịch bản test kiểm tra kịch bản thành công (200) và kịch bản từ chối (401/403/400).
   - Chạy test và ghi lại kết quả (PASS/FAIL).

## 4. Tiêu Chí Nghiệm Thu (Completion Criteria)
- Cú pháp mã nguồn hợp lệ (`node --check` passed).
- Test script chạy pass 100%.
- Không gây ra bất kỳ side-effect nào lên Frontend (`src/`).
- Báo cáo bàn giao kèm diff mã nguồn và bằng chứng chạy test.

