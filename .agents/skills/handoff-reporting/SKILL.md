---
name: handoff-reporting
description: >-
  Quy trình lập biên bản bàn giao chuẩn mực 10 mục kèm bằng chứng định lượng
  sau khi hoàn thành một nhiệm vụ, trước khi dừng lại tại Human Gate.
---

# KỸ NĂNG: HANDOFF REPORTING

## 1. Điều Kiện Kích Hoạt (Trigger)
- Kết thúc một Task hoặc một Batch công việc.
- Trước khi chuyển giao quyền kiểm soát cho Tuấn (Human Gate) hoặc Emarald (Architecture Review).

## 2. Phạm Vi & Phân Quyền (Scope & Ownership)
- **Chủ sở hữu:** BẮT BUỘC cho cả AGY và Cline.

## 3. Quy Trình Thực Hiện (Procedure)
1. **Thu thập dữ liệu pháp y sau khi hoàn thành:**
   - Chạy `git status --short --untracked-files=all` để kiểm kê chính xác các file đã thêm hoặc sửa.
   - Ghi lại log test thực tế (terminal output, kết quả lệnh test).
2. **Khởi tạo Báo cáo Bàn giao theo đúng 10 mục chuẩn:**
   - **Mục 1 — Objective:** Mục tiêu ban đầu của nhiệm vụ.
   - **Mục 2 — Work performed:** Các bước kỹ thuật đã làm.
   - **Mục 3 — Files changed:** Danh sách file kèm liên kết clickable (`file:///...`).
   - **Mục 4 — Evidence:** Bằng chứng định lượng (test output, checksum, query results).
   - **Mục 5 — Verification:** Phương pháp kiểm chứng độc lập.
   - **Mục 6 — Current state:** Trạng thái Git, DB, hoặc Server hiện tại.
   - **Mục 7 — Open questions:** Các câu hỏi cần Tuấn hoặc Emarald quyết định.
   - **Mục 8 — Blockers:** Các rào cản ngăn bước tiếp theo.
   - **Mục 9 — Risks:** Đánh giá rủi ro kỹ thuật hoặc vận hành.
   - **Mục 10 — Recommended next action:** Đề xuất bước tiếp theo cụ thể.
3. **Quy tắc chuyển giao:**
   - **TUYỆT ĐỐI KHÔNG TỰ Ý GÁN VIỆC CHO AGENT KHÁC.**
   - Dừng lại tại Chốt chặn Nghiệm thu (Completion Gate).

## 4. Tiêu Chí Nghiệm Thu (Completion Criteria)
- Báo cáo có đủ 10 mục không thiếu mục nào.
- 100% bằng chứng là thực tế, không có giả định hoặc suy diễn.

