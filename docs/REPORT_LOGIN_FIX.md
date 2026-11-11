# FIX — MEMBER LOGIN REGRESSION

## 1. Root Cause Analysis
Quá trình điều tra trực tiếp vào database và hash hiện tại cho thấy **KHÔNG CÓ LỖI (BUG) TRONG LOGIC HASHING HAY MIDDLEWARE**.

Nguyên nhân gốc rễ khiến tài khoản `tuantq` không thể đăng nhập bằng mật khẩu `050787` là do hiện tượng **Test Data Mutation**:
- Trong Mission 8 (Triển khai Change Password / Onboarding), một đoạn script kiểm thử tự động (sử dụng lệnh `curl`) đã thực hiện việc đổi mật khẩu thành công từ `050787` sang `123` thông qua API `/api/member/change-password` để xác nhận API hoạt động.
- Do chúng ta không chạy lại lệnh `npm run db:reset` sau bài test đó (để bảo toàn dữ liệu), mật khẩu trong DB bị kẹt ở trạng thái là `123`.
- Vì vậy, bất kỳ nỗ lực đăng nhập nào bằng `050787` đều bị `bcrypt.compare()` từ chối. (Đã test `bcrypt.compare('123', hash)` trả về `true` trước khi fix).

## 2. Giải pháp khôi phục (Action Taken)
Tuân thủ nguyên tắc **"Không đổi password bằng tay để che lỗi"** và **"Bảo tồn database hiện tại"**:
- Em đã viết script sử dụng chính API `/api/member/change-password` để đổi ngược mật khẩu từ `123` về lại `050787` một cách chính thống.
- Hash mới cho `050787` đã được `bcrypt` sinh ra và ghi nhận hợp lệ vào cơ sở dữ liệu.

## 3. End-to-End Verification
- ✅ **bcrypt.compare('050787', current_hash):** `true`
- ✅ **POST /api/member/login:** HTTP 200 OK (với payload `username=tuantq`, `password=050787`).
- ✅ **Session Creation:** Session cookie `connect.sid` được trả về thành công.
- ✅ **GET /me:** HTTP 200 OK (truy cập vào Dashboard bằng cookie vừa nhận).
- ✅ **GET /api/auth/me/identity:** Trả về HTTP 200 với `person_id: "@I115@"`.
- ✅ **Trạng thái Database:** Toàn bộ dữ liệu gia phả (Genealogy Data) được bảo toàn, không có thao tác schema/production mutation nào bị vi phạm.
