---
name: browser-qa
description: >-
  Quy trình kiểm thử tự động trên trình duyệt thực tế (Playwright/Puppeteer)
  qua 4 kích thước màn hình tiêu chuẩn (375, 768, 1024, 1440px), kiểm tra lỗi console,
  lỗi mạng và thanh cuộn ngang.
---

# KỸ NĂNG: BROWSER QA AUTOMATION

## 1. Điều Kiện Kích Hoạt (Trigger)
- Hoàn thành một màn hình hoặc một component mới thuộc UI System vNEXT (TASK-13).
- Trước khi trình nộp nghiệm thu **Human Gate 03** cho Tuấn và Emarald.
- Chạy hồi quy (Regression Testing) trước khi release.

## 2. Phạm Vi & Phân Quyền (Scope & Ownership)
- **Chủ sở hữu:** Cline (Frontend Owner).
- **Công cụ:** Playwright MCP hoặc script kiểm thử `scripts/ui_vnext_qa.mjs`.

## 3. Quy Trình Thực Hiện (Procedure)
1. **Khởi động Static Server cục bộ:**
   - Chạy static server phục vụ frontend trong môi trường kiểm thử (ví dụ: port 8080 hoặc qua live server).
2. **Quét tự động qua 4 độ phân giải màn hình chuẩn:**
   - **Mobile:** 375 x 812 px.
   - **Tablet:** 768 x 1024 px.
   - **Laptop:** 1024 x 768 px.
   - **Desktop:** 1440 x 900 px.
3. **Thu thập chỉ số kiểm định:**
   - **Console Errors:** Số lượng lỗi JavaScript trên Console (yêu cầu = 0).
   - **Network 404s:** Số lượng file tài nguyên bị thiếu (yêu cầu = 0, ngoại trừ favicon mặc định).
   - **Horizontal Overflow:** Kiểm tra `document.documentElement.scrollWidth > window.innerWidth` (yêu cầu = FALSE trên 100% màn hình).
   - **Navigation & Routing:** Kiểm tra chuyển tab, ContextBar, mở modal, đóng drawer.
4. **Chụp ảnh bằng chứng (Screenshots):**
   - Lưu ảnh chụp màn hình tại từng độ phân giải vào thư mục `docs/audit/screenshots/` (nếu cần đối soát visual).

## 4. Tiêu Chí Nghiệm Thu (Completion Criteria)
- Tỷ lệ Pass đạt 100% trên cả 4 độ phân giải màn hình.
- 0 lỗi JavaScript unhandled rejection / error.
- Báo cáo kết quả kiểm thử định lượng đính kèm trong Handoff Report.

