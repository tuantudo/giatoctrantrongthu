# MEMBER EXPERIENCE DECISION LOG
## Nhật Ký Quyết Định Kiến Trúc & Thiết Kế Trải Nghiệm

**Dự án:** Gia Tộc Trần Trọng Thu  
**Điều phối:** AGY (AGENT 00)  

---

| Mã Quyết Định | Ngày | Chủ Đề / Phạm Vi | Quyết Định & Cơ Sở Thực Tế | Người Phê Duyệt / Thẩm Quyền | Trạng Thái |
| :--- | :---: | :--- | :--- | :--- | :---: |
| **DEC-001** | 2026-11-11 | Recovery Flow khi quên mật khẩu | Không xây dựng cơ chế gửi OTP qua SMS hay email bên thứ ba (tránh chi phí, bảo mật lỏng lẻo và rò rỉ dữ liệu). Áp dụng **Family Steward Assisted Recovery**: Người thân liên hệ Người quản lý gia tộc (Tuấn / Trưởng ban) qua kênh gia đình (Zalo / Gặp trực tiếp) để nhận mã đặt lại mật khẩu tạm thời có thời hạn. | Tuấn (Master Directive) | `APPROVED` |
| **DEC-002** | 2026-11-11 | Ngôn ngữ giao diện thành viên | Triệt để xóa bỏ các thuật ngữ kỹ thuật trên toàn bộ giao diện thành viên. Chuyển "Identity Mapping" thành "Hồ sơ gắn liền trong gia phả"; chuyển "Proposal" thành "Gợi ý đóng góp thông tin"; chuyển "Audit Log" thành "Nhật ký hệ thống". | Tuấn / Emarald | `APPROVED` |
| **DEC-003** | 2026-11-11 | Đổi mật khẩu lần đầu (Onboarding) | Tài khoản ở trạng thái `PROVISIONED` bắt buộc phải đổi mật khẩu lần đầu tại `/me/change-password` trước khi được phép gửi đóng góp (`proposals`) hoặc chỉnh sửa thông tin. Giao diện hiển thị rõ ngữ cảnh chào mừng và chỉ dẫn từng bước. | Tuấn / Emarald | `APPROVED` |
| **DEC-004** | 2026-11-11 | Ranh giới Thư gửi Clara | Bảo tồn nguyên trạng chính sách `BRANCH_RESTRICTED_P0`. Quyền Owner hệ thống hoặc quyền thành viên gia tộc không mặc nhiên cho phép đọc các tư liệu riêng tư của nhánh Clara. | Tuấn / Emarald | `ENFORCED` |
| **DEC-005** | 2026-11-11 | Kiến trúc Frontend Member Space | Giữ kiến trúc Single Shell kế thừa `foundation.css` v0.2 hiện hành, không cài thêm thư viện CSS hay UI framework nặng nề (như Tailwind hay Bootstrap), bảo đảm tốc độ tải nhanh tuyệt đối trên mạng di động. | Emarald / AGY | `APPROVED` |
| **DEC-006** | 2026-11-11 | Hàng đợi Đóng góp Dữ liệu | Toàn bộ hình ảnh, câu chuyện, chỉnh sửa phả hệ từ thành viên được ghi vào hàng đợi `proposals` với trạng thái `PENDING`. Không bao giờ ghi trực tiếp vào bảng `people`, `families` hay `stories` mà không qua phê duyệt của Người quản trị gia tộc. | Tuấn / Emarald | `APPROVED` |

