---
name: api-contract-validation
description: >-
  Quy trình kiểm tra tính tương thích hợp đồng API (API Contract) giữa
  Frontend Adapter (Cline) và Backend Express API (AGY). Dùng khi chuẩn bị
  hoặc thực hiện tích hợp Phase 5 (TASK-18).
---

# KỸ NĂNG: API CONTRACT VALIDATION

## 1. Điều Kiện Kích Hoạt (Trigger)
- Trước khi chuyển đổi từ Mock Adapter sang Live API Adapter trong Frontend.
- Khi AGY thay đổi định dạng phản hồi JSON của bất kỳ endpoint nào (`/api/tree/node/:id`, `/api/stories`, etc.).
- Trong giai đoạn tích hợp Phase 5 (TASK-18).

## 2. Phạm Vi & Phân Quyền (Scope & Ownership)
- **Chủ sở hữu:** Phối hợp giữa AGY (Backend) và Cline (Frontend).
- **Trọng tài kiến trúc:** Emarald (Architecture Review).

## 3. Quy Trình Thực Hiện (Procedure)
1. **Trích xuất JSON Schema mong đợi từ Frontend:**
   - Kiểm tra `src/js/ui/mock-adapter.js` và `src/js/ui/data.js` để xác định chính xác danh sách các trường thuộc tính mà UI cần.
2. **Kiểm tra Payload trả về từ Backend API:**
   - Gửi yêu cầu HTTP đến Backend (sử dụng curl hoặc fetch test script).
   - Xác nhận mã trạng thái HTTP (200, 401, 404).
3. **Đối soát thuộc tính (Field-by-Field Reconciliation):**
   - Kiểm tra kiểu dữ liệu (string, number, array, boolean).
   - Kiểm tra sự tồn tại của các trường bắt buộc (ví dụ: `id`, `name`, `generation`, `is_living`, `relations`).
   - Kiểm tra việc che giấu trường riêng tư (Field Masking) cho các trường nhạy cảm (`birth_date`, `location`).
4. **Ghi nhận sai lệch (Contract Drift):**
   - Nếu có trường nào bị thiếu hoặc sai kiểu dữ liệu, lập báo cáo Drift Report và thông báo cho hai bên để điều chỉnh.

## 4. Tiêu Chí Nghiệm Thu (Completion Criteria)
- Schema trả về từ Live Backend khớp 100% với kỳ vọng của Frontend Adapter.
- UI render không gặp lỗi `TypeError: Cannot read properties of undefined`.

