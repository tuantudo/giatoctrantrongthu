# VẬN HÀNH THÀNH VIÊN GIA TỘC & QUẢN TRỊ NỘI BỘ
## FAMILY MEMBER OPERATIONS MANUAL

**Thẩm quyền phê duyệt:** Tuấn (Human Final Authority / Product Owner)  
**Kiến trúc & QC:** Emarald (Strategic Architecture Authority)  
**Phụ trách:** AGENT 04 (Family Admin & Member Support Specialist)  
**Ngày ban hành:** 2026-11-11  

---

## 1. PHÂN BIỆT 4 TẦNG THẨM QUYỀN TRONG GIA TỘC

Để đảm bảo trật tự và sự tôn nghiêm trong dòng họ, hệ thống phân định rạch ròi 4 vai trò quản trị:

1. **Quản trị Tài khoản Hệ thống (Account Administration):**
   - Tạo tên đăng nhập, cấp mật khẩu tạm ban đầu, đặt lại mật khẩu khi người thân quên, mở/khóa tài khoản.
   - Trách nhiệm kỹ thuật: Đảm bảo tài khoản an toàn, không bị tấn công brute-force.
2. **Trông nom Di sản Dòng tộc (Family Stewardship):**
   - Đứng đầu là Tuấn và các bậc trưởng thượng đại diện các chi nhánh.
   - Thẩm định tính xác thực của các câu chuyện truyền khẩu, kiểm tra di ảnh xưa, bảo tồn giá trị cội nguồn.
3. **Xác minh Danh tính & Huyết thống (Identity Verification):**
   - Đối chiếu người xin cấp tài khoản với phả hệ: Người này là con ai, cháu ai, thuộc đời thứ mấy của Cố Thu.
   - Gắn kết `account_id` với `person_id` chính xác trong bảng `identity_mappings`.
4. **Kiểm duyệt Đóng góp & Nội dung (Content Moderation):**
   - Tiếp nhận các đề xuất sửa đổi năm sinh/mộ phần hoặc ảnh kỷ vật tại Hộp Thư Đề Xuất (`admin/#/inbox`).
   - Phê duyệt (`APPROVED`) để tự động cập nhật vào phả đồ hoặc Từ chối (`REJECTED`) kèm ghi chú nhã nhặn giải thích lý do.

---

## 2. QUY TRÌNH VẬN HÀNH DÀNH CHO NGƯỜI QUẢN TRỊ GIA ĐÌNH

### 2.1. Tiếp nhận và Khởi tạo Thành viên Mới
1. Khi có người thân trong họ liên hệ (qua Zalo, điện thoại hoặc gặp mặt):
   - Hỏi rõ họ tên, ngày tháng năm sinh, cha mẹ là ai.
   - Tra cứu trên cây gia phả xem đã có hồ sơ của người đó hay chưa:
     * *Nếu đã có hồ sơ:* Ghi nhận mã nhân vật (ví dụ `@I115@`).
     * *Nếu chưa có:* Tạo hồ sơ mới trên cây phả hệ trước.
2. Truy cập Control Room: `https://giatoctrantrongthu.com/admin/login.html` (đăng nhập bằng tài khoản Quản trị).
3. Vào mục **Quản trị ➔ Tài khoản Thành viên** (`#/members`).
4. Bấm `[+ Tạo tài khoản mới]`:
   - Nhập `Tên đăng nhập` (ví dụ `trantronghung`, viết liền không dấu).
   - Chọn nhân vật liên kết trong phả hệ.
   - Nhập `Mật khẩu tạm` (tối thiểu 8 ký tự, ví dụ `GiaToc@2026`).
5. Bấm `[Lưu & Cấp phát]`:
   - Hệ thống lưu tài khoản với trạng thái `PROVISIONED`.
6. Gửi tin nhắn riêng tư cho người thân:
   - *"Chào anh/chị/em, tài khoản gia phả của bạn đã sẵn sàng tại giatoctrantrongthu.com. Tên đăng nhập: [username], Mật khẩu tạm: [password]. Bạn đăng nhập và đặt mật khẩu mới của riêng mình nhé."*

### 2.2. Hỗ trợ Đặt lại Mật khẩu khi Người thân Quên
1. Người thân liên hệ báo quên mật khẩu.
2. Người quản trị vào `#/members`, tìm tài khoản người thân.
3. Bấm `[Đặt lại mật khẩu]`, nhập một mật khẩu tạm mới.
4. Tài khoản tự động chuyển về trạng thái `PROVISIONED` (buộc người thân phải đổi mật khẩu riêng khi đăng nhập).
5. Gửi mật khẩu tạm cho người thân qua kênh liên lạc gia đình.

### 2.3. Xử lý Hộp Thư Đề Xuất & Yêu Cầu Hỗ Trợ
1. Truy cập mục **Hộp Thư ➔ Đề xuất** (`#/inbox`).
2. Xem danh sách các đề xuất đang chờ (`PENDING`):
   - Đề xuất sửa đổi thông tin người (năm sinh, năm mất, mộ phần...).
   - Đóng góp ảnh kỷ niệm hoặc ký ức dòng họ.
   - Yêu cầu hỗ trợ từ thành viên.
3. Đối chiếu thông tin với gia phả giấy gốc và tư liệu lưu trữ.
4. Bấm `[Phê duyệt]` (hệ thống tự động đồng bộ vào phả hệ và ghi nhật ký kiểm toán) hoặc `[Từ chối]` (nhập lý do nhẹ nhàng để người thân hiểu).

