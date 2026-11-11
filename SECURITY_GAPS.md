# BÁO CÁO KHOẢNG TRỐNG BẢO MẬT & RỦI RO TIỀM ẨN
## SECURITY GAPS & RISK MITIGATION REGISTER

**Phụ trách:** AGENT 03 (Authentication & Lifecycle) & AGENT 05 (Governance)  
**Ngày ban hành:** 2026-11-11  

---

## 1. DANH MỤC CÁC KHOẢNG TRỐNG & PHƯƠNG ÁN KHẮC PHỤC

| Mã Rủi Ro | Phân Loại | Mô Tả Nguy Cơ | Tác Động Tiềm Ẩn | Biện Pháp Khắc Phục Đã Triển Khai / Đề Xuất | Trạng Thái |
| :---: | :--- | :--- | :---: | :--- | :---: |
| **SEC-01** | WAF & Edge Block | Endpoint đổi mật khẩu bị Cloudflare chặn do thiếu whitelist trong WAF rule `Emergency Block API Mutations`. | Người dùng thật không thể đổi mật khẩu, bị chặn với lỗi 403 HTML. | Đã lập báo cáo chi tiết, cung cấp biểu thức WAF chuẩn xác cho Tuấn cập nhật trên Dashboard. | `PROPOSED` |
| **SEC-02** | Credential Desync | Khi Owner đổi mật khẩu, chỉ bảng `accounts` cập nhật, `admin_users` giữ mật khẩu cũ. | Mất đồng bộ đăng nhập giữa phân hệ thành viên và admin control room. | Đã triển khai `withTransaction` đồng bộ đồng thời 2 bảng trong 1 transaction nguyên tử. | `IMPLEMENTED` |
| **SEC-03** | Brute-force Old Password | Kẻ xấu có thể thử liên tục mật khẩu cũ của tài khoản đang đăng nhập để dò mật khẩu. | Nguy cơ dò tìm mật khẩu yếu. | Đã bổ sung `passwordChangeLimiter` giới hạn 5 lần / 15 phút trên mỗi IP (HTTP 429). | `IMPLEMENTED` |
| **SEC-04** | API 302 Redirect Leak | `requireAccount` trả về 302 redirect tới `/login` khi gọi API `/api/*` thay vì 401 JSON. | Client JS không bắt được lỗi đúng chuẩn, gây lỗi giao diện hoặc hành vi bất thường. | Đã bổ sung logic kiểm tra `req.path.startsWith('/api/')` trả về HTTP 401 JSON `{ error: 'Chưa đăng nhập' }`. | `IMPLEMENTED` |
| **SEC-05** | IDOR on Member Proposals | Nếu API tra cứu đề xuất cho phép truyền `?account_id=...`, người dùng A có thể xem đề xuất của người B. | Lộ thông tin đóng góp riêng tư giữa các thành viên. | Thiết kế endpoint `GET /api/member/proposals/my` ép buộc lấy `accountId` từ `req.session.accountId`, cấm nhận param từ query. | `IMPLEMENTED` |
| **SEC-06** | Audit Trail Credential Exposure | Nguy cơ in mật khẩu hoặc hash vào cột `before_value`/`after_value` của `audit_logs`. | Rò rỉ mật khẩu băm cho người đọc audit log. | Ép buộc cứng `before_value: null, after_value: null` trong sự kiện `PASSWORD_CHANGE`. | `VERIFIED` |
| **SEC-07** | Session Hijacking / Fixation | Phiên làm việc không được tái tạo khi đổi mật khẩu hoặc đăng nhập. | Kẻ tấn công giữ session cũ sau khi đổi mật khẩu. | Phiên được cập nhật trạng thái `ACTIVE`; hủy phiên hoàn toàn khi tài khoản bị `DISABLED`. | `IMPLEMENTED` |

