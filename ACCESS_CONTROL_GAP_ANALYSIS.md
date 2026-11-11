# PHÂN TÍCH KHOẢNG TRỐNG KIỂM SOÁT TRUY CẬP (ACCESS CONTROL GAP ANALYSIS)
## Đối Chiếu Hiện Trạng vs Yêu Cầu Trải Nghiệm Thành Viên

**Phụ trách:** AGENT 05 (Governance & Authorization)  
**Ngày ban hành:** 2026-11-11  

---

## 1. MA TRẬN ĐỐI CHIẾU KHOẢNG TRỐNG (GAP MATRIX)

| Bề Mặt / Luồng Nghiệp Vụ | Yêu Cầu Quản Trị & Trải Nghiệm | Hiện Trạng Trong Mã Nguồn | Khoảng Trống (Gap) | Giải Pháp Khắc Phục Cụ Thể |
| :--- | :--- | :--- | :--- | :--- |
| **Đổi mật khẩu lần đầu** | Bắt buộc tài khoản `PROVISIONED` phải đổi mật khẩu trước khi thao tác. | Đã chặn tại `/api/member/proposals` và có trang `/me/change-password`. | Chưa có thông báo banner nhắc nhở rõ ràng tại trang chủ `/me` khi đang ở trạng thái `PROVISIONED`. | Bổ sung Banner nhắc nhở thân thiện tại `/me` dẫn thẳng vào `/me/change-password`. |
| **Theo dõi yêu cầu của tôi** | Thành viên xem được danh sách đề xuất do chính mình gửi và trạng thái xử lý. | API admin `/api/admin/proposals` chỉ phục vụ admin; chưa có endpoint cho thành viên xem đề xuất của riêng mình. | Thành viên gửi xong không biết đề xuất đang ở đâu, trạng thái ra sao (Gây cảm giác "mất hút"). | Bổ sung endpoint `GET /api/member/proposals/my` (chỉ trả về bản ghi có `account_id = session.accountId`) và giao diện `/me/requests`. |
| **Gửi yêu cầu hỗ trợ tài khoản** | Thành viên hoặc người thân gửi yêu cầu hỗ trợ trực tiếp từ website. | Hiện tại chỉ có form đính chính thông tin người (`personId`, `field`, `suggestedValue`). | Chưa có kênh tiếp nhận yêu cầu hỗ trợ chung (hỗ trợ đổi thông tin liên hệ, hỏi đáp dòng họ). | Bổ sung form đóng góp và yêu cầu hỗ trợ tại `/me/support` và `/help`. |
| **Bảo vệ IDOR tại endpoint đề xuất** | Thành viên chỉ được xem và theo dõi đề xuất của chính mình. | Cần bảo đảm API `GET /api/member/proposals/my` truy vấn theo `session.accountId`, không cho phép truyền param tùy ý. | Nguy cơ IDOR nếu dùng tham số `?accountId=...` do client truyền lên. | Ép buộc cứng `WHERE account_id = ?` lấy trực tiếp từ `req.session.accountId` an toàn tuyệt đối. |
| **Bảo vệ quyền riêng tư Clara** | Tuyệt đối không để lộ thư Clara cho thành viên không thuộc nhánh. | Đã bảo vệ bằng `isClaraEligible` tại `server/member.js`. | Hoàn toàn đạt chuẩn; không có khoảng trống. Tiếp tục bảo lưu 100%. | Duy trì kiểm thử tự động xác minh không bị hồi quy. |

---

## 2. KẾ HOẠCH BÀN GIAO CHO CÁC WORKSTREAM TIẾP THEO
- **AGENT 03 (Auth & Lifecycle):** Cần triển khai endpoint `GET /api/member/proposals/my` và hỗ trợ endpoint nhận yêu cầu hỗ trợ thành viên `POST /api/member/support`.
- **AGENT 02 (UX/UI):** Cần xây dựng giao diện hiển thị danh sách yêu cầu tại `/me/requests` và trung tâm hỗ trợ tại `/help` và `/me/account`.
- **AGENT 04 (Admin):** Mở rộng Admin Inbox để hiển thị thêm các yêu cầu hỗ trợ thành viên bên cạnh các đề xuất phả hệ.

