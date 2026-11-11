# MA TRẬN KIỂM THỬ TRẢI NGHIỆM THÀNH VIÊN
## MEMBER EXPERIENCE QA MATRIX & TEST VERIFICATION SUITE

**Thẩm quyền phê duyệt:** Tuấn (Human Final Authority / Product Owner)  
**Kiến trúc & QC:** Emarald (Strategic Architecture Authority)  
**Phụ trách:** AGENT 06 (Independent QA, Integration & Security Specialist)  
**Ngày ban hành:** 2026-11-11  

---

## 1. MA TRẬN KIỂM THỬ ĐỘC LẬP THEO 7 HÀNH TRÌNH NGƯỜI DÙNG

| Mã Test | Hành Trình / Bề Mặt | Điều Kiện Đầu Vào (Pre-conditions) | Kịch Bản & Thao Tác Kiểm Thử | Kết Quả Kỳ Vọng | Kết Quả Thực Nghiệm | Trạng Thái Phân Loại |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-01** | **Hành trình A:** Khách vãng lai | Khách chưa đăng nhập (`Anonymous`) | Truy cập `/login`, `/help`, `/help/recovery`. | Trang hiển thị chuẩn HTTP 200, có chỉ dẫn kết nối gia đình, có nút hiện mật khẩu cho người lớn tuổi. | Đạt chuẩn 100%, không bị chuyển hướng lỗi, không có dead-end. | `VERIFIED` |
| **TC-02** | **Hành trình B:** Kích hoạt lần đầu | Tài khoản `status = 'PROVISIONED'` | Đăng nhập bằng mật khẩu tạm, truy cập `/me/change-password`. | Hệ thống bắt buộc đổi mật khẩu; chặn gửi đề xuất trước khi đổi; sau khi đổi, trạng thái chuyển `ACTIVE`. | Chặn 403 `PASSWORD_CHANGE_REQUIRED`; kích hoạt thành công sang `ACTIVE`. | `VERIFIED` |
| **TC-03** | **Hành trình C:** Đăng nhập thành viên | Tài khoản `ACTIVE` | Đăng nhập bằng mật khẩu mới, kiểm tra duy trì phiên. | Đăng nhập thành công, phiên làm việc cấp quyền truy cập toàn bộ không gian nội bộ. | Đạt chuẩn; băm bcrypt 10 salt rounds an toàn. | `VERIFIED` |
| **TC-04** | **Hành trình D:** Không gian cá nhân | Đã đăng nhập `ACTIVE` | Truy cập `/me`, `/me/account`, `/me/requests`, `/me/contribute`. | Trả về HTTP 200; nạp các boot script tương ứng (`boot-account.js`, `boot-requests.js`, `boot-contribute.js`). | 100% các trang hiển thị đúng shell, không có lỗi script. | `VERIFIED` |
| **TC-05** | **Hành trình E:** Quên mật khẩu | Người dùng mất mật khẩu | Truy cập `/help/recovery`, đối chiếu quy trình khôi phục. | Hiển thị 4 bước khôi phục thân tình, nút liên hệ Zalo, không phụ thuộc OTP ngoài. | Đạt chuẩn; kết nối mượt mà với tính năng reset mật khẩu trong Admin. | `VERIFIED` |
| **TC-06** | **Hành trình F:** Hỗ trợ thành viên | Thành viên hoặc khách | Gửi yêu cầu qua `POST /api/member/support`. | Tạo bản ghi đề xuất `SUPPORT_REQUEST` trong hàng đợi `proposals` với trạng thái `PENDING`. | Trả về `requestId` hợp lệ, bản ghi lưu trữ đầy đủ thông tin liên hệ. | `VERIFIED` |
| **TC-07** | **Hành trình G:** Đóng góp tư liệu | Thành viên `ACTIVE` | Gửi di ảnh hoặc câu chuyện qua `POST /api/member/support`. | Tạo bản ghi `MEDIA_CONTRIBUTION` hoặc `STORY_CONTRIBUTION` trong CSDL. | Lưu thành công trong CSDL, theo dõi được tại `/me/requests`. | `VERIFIED` |
| **TC-08** | **Bảo mật:** Chống IDOR | Tài khoản A và Tài khoản B | Tài khoản A gọi `GET /api/member/proposals/my`. | Chỉ thấy đề xuất của A, tuyệt đối không thấy đề xuất của B. | Cô lập 100%; tài khoản A không thấy bất kỳ dữ liệu nào của tài khoản B. | `VERIFIED` |
| **TC-09** | **Bảo mật:** Ranh giới Clara P0 | Tài khoản thường không thuộc nhánh | Gọi `GET /api/member/clara.json` và `GET /me/clara`. | Bị chặn: 403 JSON trên API và 404 HTML (Zero-Hint) trên trang web. | Đạt chuẩn; Zero-Hint ngăn chặn lộ sự tồn tại của thư riêng tư. | `VERIFIED` |
| **TC-10** | **Bảo mật:** Khóa tài khoản (`DISABLED`) | Tài khoản bị chuyển trạng thái `DISABLED` trong CSDL | Tài khoản gửi request đến các API được bảo vệ. | Ngay lập tức bị từ chối 403, phiên làm việc bị hủy (`session.destroy()`). | Phiên bị thu hồi tức thì, bảo đảm an toàn khi có sự cố. | `VERIFIED` |

---

## 2. KẾT QUẢ THỰC THI KIỂM THỬ TỰ ĐỘNG
- Kịch bản: `tests/test_member_experience_system.mjs`
- Số ca kiểm thử tự động: 7 kịch bản tổ hợp bao phủ 10 tiêu chí.
- Tỷ lệ thành công: **100% (7/7 PASSED)**.

