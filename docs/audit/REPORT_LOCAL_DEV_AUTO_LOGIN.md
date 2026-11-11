# BÁO CÁO: CƠ CHẾ AUTO-LOGIN CHO LOCAL DEVELOPMENT

## 1. Cơ chế hoạt động (Mechanism)
Để giải quyết sự bất tiện khi server reload làm mất session (do dùng MemoryStore), em đã thiết kế cơ chế **"Intercept on Login Page"** kết hợp với Cookie tracking.
- **Hoạt động:** Thay vì phá vỡ middleware `requireAccount` (có thể gây rủi ro lọt logic bypass vào production), em tích hợp auto-login vào route `GET /login`. 
- **Quy trình:** Khi dev truy cập `/me`, hệ thống vẫn chặn và redirect về `/login`. Tại `/login`, server kiểm tra biến môi trường `DEV_AUTO_LOGIN=true`. Nếu thỏa mãn, server lập tức cấp session cho tài khoản được chỉ định (`DEV_AUTO_LOGIN_ACCOUNT=tuantq`) và redirect ngược lại `/me`. Quá trình diễn ra trong tích tắc, dev không cần gõ mật khẩu.

## 2. Các file đã sửa (Implementation Details)
1. **`server/member.js`:**
   - **`router.get('/login')`**: Thêm block logic check `process.env.NODE_ENV === 'development'` và `DEV_AUTO_LOGIN === 'true'`. Cấp `req.session.accountId` và redirect `/me`. Render thêm UI Banner "🛠 Local Dev — Auto Login" nếu đang pause auto-login.
   - **`router.get('/logout')`**: Bổ sung `res.cookie('explicit_logout', '1')` để đánh dấu user vừa chủ động đăng xuất.
2. **`server/.env` và `server/.env.example`**: Bổ sung flag `DEV_AUTO_LOGIN` và `DEV_AUTO_LOGIN_ACCOUNT`.

## 3. UX & Xử lý vòng lặp (Explicit Logout Handling)
- Nếu Auto-Login tự động diễn ra mọi lúc, dev sẽ không thể test luồng đăng nhập thủ công (vì cứ vào /login là bị đẩy vào /me).
- Em đã xử lý bằng **Explicit Logout Cookie**: 
  - Khi click Đăng xuất, một cookie `explicit_logout=1` được ghi lại.
  - Nhờ cookie này, tính năng auto-login bị "Pause". Lúc này giao diện `/login` xuất hiện bình thường kèm một dòng banner nhắc nhở. Dev có thể test đăng nhập thủ công, hoặc click nút "Auto-login as tuantq" trên banner.
  - Khi đăng nhập thủ công thành công, cookie `explicit_logout` sẽ được xóa để lần restart server tiếp theo tự động auto-login lại.

## 4. Security Boundary
- **Environment Lock:** Chỉ hoạt động khi `NODE_ENV=development` (hoặc undefined ở local) VÀ `DEV_AUTO_LOGIN=true`.
- **Production Safe:** Ở môi trường production (như Vercel/VPS), biến môi trường này không được khai báo. Mã nguồn auto-login sẽ bỏ qua (bypass check). Middleware `requireAccount` gốc không hề bị chạm tới.
- **Zero Hardcode:** Không hardcode password hay hash vào frontend, API, hay logic kiểm tra. Hệ thống bypass khâu nhập password bằng cách load trực tiếp `id` của user từ DB cấp thẳng cho Session (giả lập thao tác đăng nhập thành công từ backend).

## 5. Kết quả Test (Acceptance Tests)
- ✅ **Khởi động server & vào `/me`:** Tự động có session, vào Dashboard (thấy Person `@I115@`).
- ✅ **Vào `/me/tree`:** Nạp thành công UI gia phả.
- ✅ **Explicit Logout:** Nút Đăng xuất đẩy user về `/` (Trang chủ public).
- ✅ **Manual Auth:** Vào lại `/me` -> Bị đẩy ra `/login`. Có banner nhắc nhở auto-login đang bị pause. Login tay bằng mật khẩu thành công.
- ✅ **Tắt DEV_AUTO_LOGIN=false:** Server từ chối auto-login hoàn toàn. Giao diện trở về mặc định không có banner dev.

Mọi yêu cầu đều đạt. KHÔNG đụng vào production code core, KHÔNG đụng DB schema, KHÔNG deploy.
