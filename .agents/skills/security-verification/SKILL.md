---
name: security-verification
description: >-
  Quy trình kiểm thử tự động quét các bề mặt đe dọa an ninh và xác minh việc
  khắc phục triệt để 8 lỗ hổng an ninh đã xác minh (CF-01 đến CF-08).
---

# KỸ NĂNG: SECURITY VERIFICATION

## 1. Điều Kiện Kích Hoạt (Trigger)
- Hoàn thành Phase 1 (Security Containment: TASK-01 → TASK-06).
- Trước khi trình nộp nghiệm thu **Human Gate 01** cho Tuấn.
- Quét định kỳ sau khi cập nhật backend hoặc cấu hình triển khai.

## 2. Phạm Vi & Phân Quyền (Scope & Ownership)
- **Chủ sở hữu:** AGY (Backend Owner).
- **Phạm vi kiểm tra:** `server/index.js`, `.gitignore`, `vercel.json`, CI workflows, các route API công khai và bảo vệ.

## 3. Quy Trình Thực Hiện (Procedure)
1. **Kiểm tra CF-01 (Static Root Leakage):**
   - Gửi yêu cầu HTTP: `GET /package.json`, `GET /server/index.js`, `GET /GIADINHONGTHU.ged`.
   - Kết quả bắt buộc: Phải trả về `404 Not Found` (không được trả về 200).
2. **Kiểm tra CF-02 (URI Malformed DoS):**
   - Gửi yêu cầu HTTP chứa chuỗi malformed: `GET /%c0%af`, `GET /%E0%A4%A`.
   - Kết quả bắt buộc: Server không bị crash, trả về `400 Bad Request` hoặc `404 Not Found`.
3. **Kiểm tra CF-03 (Unauthenticated Write Endpoints):**
   - Gửi payload không kèm cookie tới: `POST /api/people`, `POST /api/stories`, `POST /api/edges`, `DELETE /api/edges`, `POST /api/events`.
   - Kết quả bắt buộc: Trả về `401 Unauthorized` hoặc `403 Forbidden`.
4. **Kiểm tra CF-04 (Brute-force Rate Limiter):**
   - Gửi 15 yêu cầu đăng nhập liên tiếp với mật khẩu sai tới `/api/member/login`.
   - Kết quả bắt buộc: Từ request thứ 11 trở đi phải bị chặn với mã `429 Too Many Requests`.
5. **Kiểm tra CF-05 (Secret Credential & Webhook Elimination):**
   - Kiểm tra xem file `./revert_pass.js` đã được di chuyển khỏi repo chưa (`test ! -f revert_pass.js`).
   - Quét tìm URL webhook script.google.com trong `.github/workflows/` (không được có chuỗi hardcoded fallback).
6. **Kiểm tra CF-06 (Gitignore & Vercel Route Protection):**
   - Chạy `git check-ignore -v GIADINHONGTHU.ged` -> Xác nhận khớp quy tắc ignore.
   - Kiểm tra `vercel.json` có quy tắc deny cho các đường dẫn nhạy cảm.

## 4. Tiêu Chí Nghiệm Thu (Completion Criteria)
- 100% các bài test bảo mật từ CF-01 đến CF-06 đều PASS.
- Server hoạt động ổn định, không có rò rỉ thông tin cấu trúc nội bộ.

