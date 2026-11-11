# BẢNG KIỂM KÊ GIAO DIỆN THÀNH VIÊN (MEMBER UI INVENTORY)
## Toàn Bộ 12 Màn Hình & Trạng Thái Trải Nghiệm Người Dùng

**Thẩm quyền phê duyệt:** Tuấn (Human Final Authority / Product Owner)  
**Kiến trúc & QC:** Emarald (Strategic Architecture Authority)  
**Phụ trách:** AGENT 02 (UX/UI & Interaction Design Specialist)  
**Ngày ban hành:** 2026-11-11  

---

## 1. MA TRẬN 12 GIAO DIỆN TRẢI NGHIỆM THÀNH VIÊN

| STT | Tên Giao Diện & Mục Đích | Tuyến Đường (URL) | Tệp Nguồn Phụ Trách (Files) | Trạng Thái Thiết Kế & Triển Khai |
| :---: | :--- | :--- | :--- | :---: |
| **1** | **Trang Đăng Nhập Thành Viên**<br>Cổng vào trang nghiêm, tối giản, có nút hiện mật khẩu cho người lớn tuổi. | `/login` | `server/member.js` (inline HTML)<br>`src/css/foundation/foundation.css` | `IMPLEMENTED` & `VERIFIED` |
| **2** | **Kích Hoạt Tài Khoản**<br>Nhận diện trạng thái `PROVISIONED` và tự động kích hoạt phiên. | `/login` ➔ `/me/change-password` | `server/member.js`<br>`server/index.js` | `IMPLEMENTED` & `VERIFIED` |
| **3** | **Thiết Lập Mật Khẩu Lần Đầu**<br>Màn hình chào mừng nồng ấm, đặt mật khẩu riêng lần đầu. | `/me/change-password` | `server/member.js` | `IMPLEMENTED` & `VERIFIED` |
| **4** | **Quên Mật Khẩu**<br>Chỉ dẫn kết nối thân tình với người quản lý gia tộc, không OTP rườm rà. | `/help/recovery` | `src/js/ui/recovery.js`<br>`server/help_recovery.html` | `IMPLEMENTED` & `VERIFIED` |
| **5** | **Khôi Phục Mật Khẩu (Steward-Assisted)**<br>Quy trình 4 bước đơn giản, thân thuộc, bảo mật tuyệt đối. | `/help/recovery` | `src/js/ui/recovery.js`<br>`server/help_recovery.html` | `IMPLEMENTED` & `VERIFIED` |
| **6** | **Không Gian Cá Nhân (Member Home)**<br>Trung tâm gắn kết: Bối cảnh bản thân, Lịch giỗ, MẠCH, Di ảnh, Lối tắt. | `/me` | `src/js/ui/dashboard.js`<br>`server/member_dashboard.html` | `IMPLEMENTED` & `VERIFIED` |
| **7** | **Trung Tâm Quản Lý Tài Khoản**<br>Xem thông tin định danh, hồ sơ phả hệ gắn kết, thiết lập bảo mật. | `/me/account` | `src/js/ui/account.js`<br>`server/member_account.html` | `IMPLEMENTED` & `VERIFIED` |
| **8** | **Đổi Mật Khẩu Tự Nguyện**<br>Form đổi mật khẩu định kỳ, kiểm tra mật khẩu cũ, bảo vệ brute-force. | `/me/change-password` | `server/member.js`<br>`server/index.js` | `IMPLEMENTED` & `VERIFIED` |
| **9** | **Trung Tâm Trợ Giúp & Hướng Dẫn**<br>Cẩm nang giải đáp thắc mắc mộc mạc cho bà con cô bác và con cháu. | `/help` hoặc `/me/help` | `src/js/ui/help.js`<br>`server/help_public.html` | `IMPLEMENTED` & `VERIFIED` |
| **10** | **Trang Gửi Yêu Cầu Hỗ Trợ**<br>Biểu mẫu gửi tin nhắn, thắc mắc trực tuyến tới Ban Quản Trị. | `/help#contact-form` | `src/js/ui/help.js` | `IMPLEMENTED` & `VERIFIED` |
| **11** | **Trang Theo Dõi Yêu Cầu Của Tôi**<br>Xem danh sách đề xuất, trạng thái đối chiếu và phản hồi từ gia đình. | `/me/requests` | `src/js/ui/requests.js`<br>`server/member_requests.html` | `IMPLEMENTED` & `VERIFIED` |
| **12** | **Giao Diện Đóng Góp Di Ảnh & Ký Ức**<br>Biểu mẫu đóng góp kỷ vật, câu chuyện truyền khẩu và đính chính. | `/me/contribute` | `src/js/ui/contribute.js`<br>`server/member_contribute.html` | `IMPLEMENTED` & `VERIFIED` |

---

## 2. NGUYÊN TẮC THIẾT KẾ UX ĐÃ ÁP DỤNG TRÊN TOÀN HỆ THỐNG
1. **Ngôn ngữ bình dân, kính trọng:**
   - Sử dụng từ ngữ gia đình: "Người thân", "Bà con", "Kỷ vật", "Lời kể", "Ban Quản Trị gia tộc".
   - Tuyệt đối không hiển thị các thuật ngữ lập trình hay công nghệ.
2. **Mobile-First & Touch-Friendly:**
   - Mọi nút bấm, ô nhập liệu đều có chiều cao tối thiểu 44px, khoảng cách ngón tay bấm thoải mái.
   - Hỗ trợ xem rõ ràng trên các màn hình điện thoại từ 375px đến máy tính bảng và màn hình lớn 1440px.
3. **Thân thiện với người lớn tuổi:**
   - Nút checkbox "Hiện mật khẩu" giúp người mắt kém hoặc tay run dễ kiểm tra trước khi bấm Đăng nhập.
   - Chữ viết tương phản cao, cỡ chữ vừa vặn, không dùng các hiệu ứng mờ nhạt gây khó đọc.
4. **Không ngõ cụt (Zero Dead-Ends):**
   - Mọi trang đều có đường dẫn quay về Không gian của tôi (`/me`), trang công khai (`/`) hoặc trang trợ giúp (`/help`).

