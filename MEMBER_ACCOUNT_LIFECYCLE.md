# QUẢN LÝ VÒNG ĐỜI TÀI KHOẢN THÀNH VIÊN
## MEMBER ACCOUNT LIFECYCLE SPECIFICATION

**Thẩm quyền phê duyệt:** Tuấn (Human Final Authority / Product Owner)  
**Kiến trúc & QC:** Emarald (Strategic Architecture Authority)  
**Phụ trách:** AGENT 03 (Authentication & Account Lifecycle Specialist)  
**Ngày ban hành:** 2026-11-11  

---

## 1. CÁC TRẠNG THÁI TÀI KHOẢN (ACCOUNT STATUS DEFINITION)

Hệ thống quản lý tài khoản thành viên qua 3 trạng thái bất biến tại bảng `accounts`:

```text
               ┌────────────────────────────────────────────────────────┐
               │                                                        │
               ▼                                                        │
         [PROVISIONED] ──────────► [ACTIVE] ──────────► [DISABLED]      │
               │                      ▲                      │          │
               │                      │                      │          │
               └──────────────────────┴──────────────────────┘          │
                       Quản trị viên Reset Mật khẩu ─────────────────────┘
```

1. **`PROVISIONED` (Được cấp phát ban đầu / Chờ kích hoạt):**
   - Tài khoản được khởi tạo bởi Quản trị viên tại `/admin/#/members`.
   - Được gắn mật khẩu tạm thời (ngẫu nhiên, tối thiểu 8 ký tự).
   - Được liên kết với Person ID trên cây phả hệ (`identity_mappings`).
   - **Ranh giới an ninh:** Khi đăng nhập thành công, hệ thống bắt buộc chuyển hướng đến `/me/change-password`. Bị chặn toàn bộ quyền gửi đề xuất (`proposals`) hoặc thay đổi dữ liệu gia phả cho đến khi hoàn tất đổi mật khẩu lần đầu.
2. **`ACTIVE` (Đang hoạt động bình thường):**
   - Đã qua bước đổi mật khẩu lần đầu.
   - Toàn quyền truy cập Không gian thành viên (`/me`), tra cứu phả đồ, di ảnh, gửi đề xuất đính chính và đóng góp tư liệu.
3. **`DISABLED` (Bị tạm khóa):**
   - Áp dụng khi phát hiện nguy cơ an ninh hoặc theo yêu cầu tạm ngưng của gia đình.
   - Bị từ chối ngay lập tức tại middleware `requireAccount` (trả về 403 JSON cho API, redirect về `/login` với thông báo khóa cho Web).
   - Hủy phiên làm việc (`session.destroy()`) ngay lập tức.

---

## 2. CÁC QUY TRÌNH THỰC THI CHI TIẾT (LIFECYCLE FLOWS)

### 2.1. Khởi tạo & Mời thành viên (Member Invitation & Provisioning)
- **Người thực hiện:** Quản trị viên / Người phụ trách gia tộc tại `/admin/#/members`.
- **Dữ liệu đầu vào:** Tên đăng nhập (username), Email (tùy chọn), Person ID (chọn từ danh sách nhân vật phả hệ), Mật khẩu tạm.
- **Xử lý:**
  1. Kiểm tra username hợp lệ (`/^[a-z0-9._-]{3,64}$/`).
  2. Băm mật khẩu tạm bằng `bcrypt.hash(password, 10)`.
  3. Ghi vào `accounts` với `status = 'PROVISIONED'`, `role = 'member'`.
  4. Ghi vào `identity_mappings (account_id, person_id)`.
  5. Người quản trị gửi thông tin đăng nhập trực tiếp cho người thân qua Zalo hoặc gặp mặt trực tiếp.

### 2.2. Kích hoạt & Thiết lập mật khẩu lần đầu (First-time Activation)
- **Người thực hiện:** Thành viên được cấp tài khoản.
- **Xử lý:**
  1. Đăng nhập tại `/login` bằng username và mật khẩu tạm.
  2. Hệ thống kiểm tra `status === 'PROVISIONED'`, tự động điều hướng sang `/me/change-password`.
  3. Người dùng nhập mật khẩu tạm và mật khẩu mới riêng tư.
  4. Hệ thống cập nhật `status = 'ACTIVE'`, cập nhật mật khẩu mới bằng transaction nguyên tử đồng bộ sang cả `admin_users` nếu trùng tên đăng nhập.
  5. Cập nhật `session.status = 'ACTIVE'` và đưa vào `/me`.

### 2.3. Đăng nhập & Duy trì phiên (Login & Session Lifecycle)
- **Cơ chế:** Cookie-based session (`connect.sid`), bảo vệ bởi `httpOnly`, `sameSite: 'lax'`, `secure: true` trên production.
- **Thời hạn phiên:** Mặc định 24 giờ.
- **Phòng thủ Brute-force:** `loginLimiter` giới hạn tối đa 5 lần thử sai / 15 phút trên mỗi IP.
- **CSRF Guard:** Toàn bộ POST/PUT/PATCH/DELETE yêu cầu Origin/Referer hợp lệ từ domain tin cậy (`https://giatoctrantrongthu.com`).

### 2.4. Đổi mật khẩu tự nguyện (Voluntary Password Change)
- **Điểm truy cập:** `/me/change-password` (hoặc `/me/account`).
- **Phòng vệ:** `passwordChangeLimiter` (5 lần / 15 phút), kiểm tra mật khẩu cũ, mật khẩu mới >= 8 ký tự.
- **Đồng bộ nguyên tử:** `withTransaction` cập nhật đồng thời `accounts` và `admin_users`, ghi nhật ký `audit_logs` sự kiện `PASSWORD_CHANGE` không lộ credential.

### 2.5. Khôi phục tài khoản khi quên mật khẩu (Account Recovery)
- **Triết lý:** Trong gia tộc, sự kết nối trực tiếp giữa người thân là an toàn và đáng tin cậy nhất. Không sử dụng OTP qua SMS hay dịch vụ email ngoài (nguy cơ spam, tốn phí, người lớn tuổi khó thao tác).
- **Quy trình:**
  1. Người thân bấm `[Quên mật khẩu?]` tại `/login` ➔ Dẫn tới trang `/help/recovery`.
  2. Trang hiển thị nút kết nối nhanh qua Zalo/Điện thoại với Quản trị viên (Tuấn / Trưởng ban gia tộc).
  3. Quản trị viên xác minh giọng nói/danh tính người thân.
  4. Quản trị viên vào `/admin/#/members`, bấm `[Đặt lại mật khẩu]` cho tài khoản, nhập mật khẩu tạm mới.
  5. Hệ thống chuyển trạng thái tài khoản về `PROVISIONED`.
  6. Người thân đăng nhập bằng mật khẩu tạm mới và tự đặt lại mật khẩu của mình như quy trình kích hoạt.

### 2.6. Đăng xuất & Thu hồi phiên (Logout & Session Revocation)
- **Đăng xuất chủ động:** Truy cập `/logout`, gọi `req.session.destroy()`, xóa cookie, chuyển về `/login`.
- **Thu hồi cưỡng chế:** Khi quản trị viên chuyển trạng thái tài khoản thành `DISABLED`, mọi request tiếp theo của phiên đó sẽ bị hủy ngay lập tức tại middleware.

