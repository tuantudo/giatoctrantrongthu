# Public → Member → Control Plane

## 1. Owner Intent

[THỰC TẾ] Owner yêu cầu phân định rạch ròi hai thế giới trên website:
- **PUBLIC / OUTSIDE:** Trải nghiệm dành cho người ngoài (khách). Không hiển thị dữ liệu nội bộ/cây gia phả. Đây là mặt tiền giới thiệu về lịch sử, di sản của Gia tộc Trần Trọng Thu.
- **MEMBER / INSIDE:** Trải nghiệm dành riêng cho người trong gia tộc sau khi đã xác thực và được cấp quyền (verified membership). Nơi hiển thị dữ liệu gia đình thực tế và các tính năng nội bộ.

[THỰC TẾ] Tính năng "Cài đặt" / "Tuỳ chỉnh" là entry point cho User Control, không dùng thuật ngữ "Admin Control" gây cảm giác nặng nề, xa cách. Chatbot chỉ là tính năng demo.

## 2. Current Experience

[THỰC TẾ] 
- Kiến trúc hiện tại là một SPA (Single Page Application) tải toàn bộ dữ liệu ngay từ đầu.
- Tất cả người dùng vào trang chủ đều có thể truy cập `#/gia-pha`.
- Không có rào cản xác thực (authentication).
- Frontend tự do gọi API lấy toàn bộ dữ liệu nội bộ (`/api/genealogy.json`, `/api/mach.json`, `/api/media.json`).

## 3. Target Experience

[ĐỀ XUẤT]
- **Outsider:** Truy cập trang chủ, đọc được câu chuyện chung, lịch sử hình thành, di sản (Mạch/Tư liệu bản public), và thấy một nút CTA rõ ràng "Dành cho người trong gia tộc" (Đăng nhập).
- **Verified Member:** Sau quá trình xác thực và kiểm duyệt (verification), người dùng sẽ được điều hướng vào không gian riêng (Member Home) - nơi hiển thị bản đồ gia phả thực tế, tư liệu nội bộ, lịch sự kiện và menu Cài đặt cá nhân.

## 4. Public Information Architecture

[ĐỀ XUẤT] Cấu trúc không gian Public:
- **Trang chủ (Homepage):** Giới thiệu gia tộc, không expose data cá nhân.
- **Giới thiệu / Lịch sử:** Câu chuyện từ năm 1872.
- **MẠCH (Public):** Các bài viết/tự sự mang tính đại chúng, chia sẻ triết lý gia đình.
- **Tư liệu (Public):** Hiện vật lịch sử được phép công khai.
- **Thành viên (CTA):** Entry point yêu cầu đăng nhập/nhận diện thành viên.
- **Chatbot (Demo):** Hiển thị rõ "Tính năng đang phát triển" (Alpha/Demo mode).

## 5. Member Entry & Verification Flow

[SUY LUẬN] & [ĐỀ XUẤT] Luồng vào Member Space phải bao gồm 2 bước độc lập:
1. **Visitor** bấm "Đăng nhập".
2. **Google Account Authentication:** Hệ thống xác nhận "Người này là ai" (Định danh email).
3. **Membership Verification:** Hệ thống kiểm tra "Email này có thuộc danh sách thành viên gia tộc đã được duyệt hay không".
4. **Quyết định Access:**
   - Nếu chưa được duyệt: Chuyển đến trang "Chờ phê duyệt" hoặc "Yêu cầu quyền thành viên".
   - Nếu đã duyệt (Verified): Chuyển vào **Member Space**.

## 6. Member Information Architecture

[ĐỀ XUẤT] Cấu trúc không gian Member:
- **Member Home:** Bảng tin nội bộ, thông báo gia đình.
- **Gia Phả (Private):** Cây phả đồ đầy đủ, danh bạ thành viên, chi tiết gia đình.
- **Tư liệu / MẠCH (Private):** Toàn bộ kho lưu trữ.
- **Lịch gia đình:** Ngày giỗ, sinh nhật, sự kiện.
- **Cài đặt / Tùy chỉnh:** Quản lý tài khoản cá nhân, thông báo, kết nối Google.

## 7. Control Plane Boundary

[ĐỀ XUẤT]
Control Plane là lớp điều khiển được bảo vệ bởi quyền (Auth-gated layer).
- **Entry Point:** Nút "Cài đặt" hoặc "Tuỳ chỉnh" trên UI của Member.
- **Personal Settings:** Ai cũng thấy (Profile, Notifications, Google Account liên kết).
- **Member Capabilities:** Khả năng chỉnh sửa thông tin cá nhân hoặc gia đình nhánh của mình (phụ thuộc Role).
- **Administrative Capabilities:** Các tính năng quản trị cao cấp (Duyệt thành viên, cấu hình hệ thống), chỉ hiện khi role cho phép. Không dùng chữ "Admin" trên UI chung.

## 8. Genealogy Visibility Boundary

[THỰC TẾ] 
Các endpoint và route hiện tại đang expose data công khai:
- Frontend routes: `#/gia-pha`, `#/gia-pha/nhan-vat`, `#/gia-pha/gia-dinh` (Load data không cần auth).
- Backend APIs: `GET /api/genealogy.json`, `GET /api/mach.json`, `GET /api/media.json`, các file `.ics`.
- Write APIs: `POST /api/edges`, `POST /api/people` (Không check Auth).

[SUY LUẬN] Việc ẩn link trên Frontend KHÔNG PHẢI là Access Control.
[ĐỀ XUẤT] Phải chặn trực tiếp từ API backend. Request gọi tới API Genealogy phải mang Session/Token hợp lệ của một Verified Member.

## 9. Current → Target Gap

| Current | Target | Gap | Priority |
|---|---|---|---|
| Public homepage | Public family introduction | Hiện tại public đang chứa metadata/link tới data private. Cần làm sạch homepage. | HIGH |
| `/gia-pha` | Authenticated member genealogy | Đang public hoàn toàn. Cần khóa sau lớp Auth & Verification. | CRITICAL |
| `/cai-dat` placeholder | Member control surface | Đã có UI entry point, chưa có logic. Cần xây personal settings. | MEDIUM |
| Admin | Role-gated control plane | Đang public (không password). Cần map vào phân quyền sau này. | HIGH |
| Google login | Identity layer | Chưa có. | HIGH |
| Membership verification | Family membership layer | Chưa có concept quản lý ai là thành viên hợp lệ. | HIGH |
| Chatbot | Development feature | Đang giả lập (Demo UI). Cần giữ nguyên scope, không mở rộng thành lõi. | LOW |

## 10. Authentication vs Membership

[ĐỀ XUẤT] Phải phân tách rõ ràng:
- **Authentication (Xác thực - Identity):** "Anh là ai?" → Do Google đảm nhận (Google Account). Không tự build hệ thống quản lý password.
- **Membership (Tư cách thành viên - Authorization):** "Anh có thuộc gia tộc Trần Trọng Thu không?" → Do hệ thống nội bộ (Database/Admin) quyết định. Một người có thể login Google thành công nhưng không có Tư cách thành viên thì vẫn chỉ thấy giao diện Public.

## 11. Open Decisions

[THỰC TẾ] Owner chưa quyết định và **cần chốt trong tương lai** (không bắt buộc chốt ngay):
- **Cơ chế duyệt thành viên:** Admin chủ động mời (Invitation), hay người dùng xin phép rồi duyệt (Approval), hay tự claim data (Claim)?
- **Hệ thống Vai trò (Role Taxonomy):** Có bao nhiêu cấp bậc quản trị? (Ví dụ: Member, Branch Manager, System Admin).
- **Ranh giới Public:** Bài viết nào trong MẠCH được public? Ai quyết định?
- **Khôi phục quyền truy cập:** Nếu mất Google Account thì làm sao?

## 12. Implementation Constraints for Cline

[THỰC TẾ] Constraint bắt buộc cho các đợt Code/Implementation sau:
- **KHÔNG** đập bỏ SPA để migrate toàn bộ sang Next.js.
- **KHÔNG** biến Chatbot thành trung tâm (core navigation). Phải gắn nhãn "Tính năng đang phát triển" / Demo.
- **KHÔNG** tạo Design System mới (như Storybook). Consume trực tiếp từ CSS variables hiện có.
- **BẮT BUỘC** enforce Authorization tại Backend API, không được dùng CSS/Frontend routing để giấu data nội bộ.

## 13. Definition of Ready

[THỰC TẾ] Brief này cung cấp đủ Context và Boundary để Agent (Cline) nhận một task implementation mới. 
Cline đã biết:
- Public và Member khác nhau ở đâu, cái gì được show.
- "Cài đặt" mang vai trò gì.
- Google Account chỉ giải quyết khâu đăng nhập, chưa phải là vé vào cổng (Cần Membership).
- Chỗ nào KHÔNG ĐƯỢC CHẠM VÀO (vd: đập đi xây lại framework). 
