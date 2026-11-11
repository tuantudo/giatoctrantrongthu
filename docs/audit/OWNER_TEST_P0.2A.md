# Owner Test — P0.2A
**Tester:** Tuấn (System Owner / First Member)

## 1. First Impression
Khi mở cả `http://localhost:3000/` và `http://localhost:8080/`, đập vào mắt tôi là cùng một giao diện (Public Website bản prototype DESIGN-001).
Cảm giác đầu tiên: "Đây là một website xuất bản tĩnh kể chuyện gia phả". Nó rất giống một trang web thông tin công cộng. 
Tôi không cảm thấy đây là một "ứng dụng tương tác" hay một "không gian riêng tư" ngay từ cái nhìn đầu tiên. Giao diện sạch sẽ nhưng hướng tới việc đọc.

## 2. Public User Journey
Bắt đầu với tư cách một người khách vô danh:
- **HOME (`#/`)**: Hoạt động tốt. Hiển thị các câu chuyện MẠCH và định hướng nội dung tốt. [WORKING]
- **Genealogy (`#/gia-pha`)**: Hiển thị cây gia phả. [WORKING]
- **Memories/Stories (`#/mach`, `#/tu-lieu`)**: Nội dung đọc được. [WORKING]
- **Navigation**: Điều hướng bằng menu trên cùng hoạt động ổn. [WORKING]
- **Member Entry (`#/tu-cach-thanh-vien`)**: Tôi bấm vào "Tư cách thành viên" và được đưa tới một trang giải thích rằng "Đây là một entry point sản phẩm — không phải chỉ là nút đăng nhập kỹ thuật". Tuy nhiên... KHÔNG CÓ NÚT ĐĂNG NHẬP NÀO Ở ĐÂY. [MISSING]
- **Login (`/login`)**: Không có một nút hay link nào trên toàn bộ giao diện công cộng dẫn tới trang đăng nhập thực sự. Tôi không thể tìm thấy cửa vào. [BROKEN/MISSING]

## 3. Login Journey
Vì không có link trên UI, tôi phải tự gõ thủ công `http://localhost:3000/login` trên trình duyệt.
- **Trang đăng nhập**: Một form HTML trắng trơn, cực kỳ thô sơ (kiểu hệ thống cấp 1). Nó hoàn toàn đứt gãy về mặt thị giác so với giao diện public (DESIGN-001) tuyệt đẹp bên ngoài. [PARTIAL - Logic works, UI missing]
- **Đăng nhập lần đầu**: Nhập `tuantq` / `050787`. Ngay lập tức bị ép chuyển hướng (force redirect) sang `/me/change-password`. Rất tốt! [WORKING]
- **Đổi mật khẩu**: Giao diện tiếp tục thô sơ, nhưng logic hoàn hảo. Tôi không thể thoát khỏi đây nếu chưa đặt mật khẩu mới. [WORKING]
- **Đăng nhập lại**: Mật khẩu cũ bị từ chối, mật khẩu mới hoạt động. [WORKING]

## 4. Member Journey
Sau khi đăng nhập và đổi mật khẩu, tôi đáp xuống trang `/me`.
- **Giao diện**: Lại là một trang HTML tĩnh trắng trơn.
- **Dữ liệu**: Nó ghi đúng "Xin chào, tuantq", "Danh tính gia phả: Trần Quốc Tuấn", "Ngày sinh: 05/07/1987", "Trạng thái: ACTIVE". [WORKING - Identity Mapping hoạt động chính xác]
- **Câu hỏi của Tuấn:**
  - *"Where is my family?"* → Chịu. Không có link.
  - *"Where are my relatives/memories/contributions?"* → Hoàn toàn trống trơn.
  - *"Where are my settings/privacy control?"* → Không có.
  - *"How do I get home?"* → Không có nút "Back to Public Website" hay "Home". Tôi bị nhốt ở trang `/me` và chỉ có 1 nút duy nhất là "Đăng xuất". [BROKEN]

## 5. Public Space
- **DO I SEE IT?** Có (trên `#/`).
- **CAN I ENTER IT?** Có.
- **WHAT DATA DOES IT CONTAIN?** Genealogy, MẠCH, Lịch.
- **WHAT IS THE URL?** `http://localhost:3000/` và `http://localhost:8080/`.
- **WHAT API BACKS IT?** Đáng ngạc nhiên là khi F12 xem Network, tôi phát hiện giao diện public đang gọi cứng thẳng lên API của production (`https://api.giatoctrantrongthu.com/api/...`). Nó KHÔNG HỀ dùng local API! [BROKEN/UNCLEAR]

## 6. Family Space
- Khái niệm này chỉ mới tồn tại trên... tài liệu và trí tưởng tượng. Không có bất kỳ giao diện, route hay API nào hiển thị "Không gian gia đình" cả. [MISSING]

## 7. Discussion Space
- Hoàn toàn không tồn tại. [MISSING]

## 8. Personal Space
- Trang `/me` có phải là Personal Space thực sự không?
- **Đánh giá:** Hiện tại, nó chỉ là **Authenticated Member Home** (điểm đáp sau khi login). Nó B. chứ chưa phải C. Nó xác nhận danh tính (Identity) của tôi, nhưng không cho phép tôi cấu hình Profile, không có Bio, không lưu trữ gì của cá nhân tôi. [PARTIAL]

## 9. Public ↔ Member Navigation
Sự liên kết giữa Public và Member hiện tại là **HAI MẢNH VỠ TÁCH RỜI (TWO DISCONNECTED APPLICATIONS)**.
- Đứng ở Public, không có đường nào sang Member (phải tự gõ URL `/login`).
- Đứng ở Member `/me`, không có đường nào về Public (ngoại trừ tự gõ URL `/`).
- Public là SPA (Single Page Application - Hash routing). Member `/me` lại là Server-side Rendering HTML. Cảm giác như hai ứng dụng khác nhau ghép lại một cách lỏng lẻo. [BROKEN]

## 10. localhost:3000 vs localhost:8080
- **Server 8080 (Python)**: Chỉ là một static file server ngu ngốc. Nó serve `index.html`. Nếu gõ `localhost:8080/login`, nó báo lỗi 404 vì không có file nào tên `login`.
- **Server 3000 (Node)**: Vừa serve static files, vừa chứa backend API. Các route `/login` và `/me` chỉ sống ở đây.
- **Kết luận**: Server 8080 là một tàn dư Legacy/Temporary dùng để view frontend tĩnh. Người dùng thật bắt buộc phải vào qua 3000. Tuy nhiên, cả hai server hiện tại đều tải dữ liệu từ production API (`https://api...`) cho phần public UI, đây là một Technical Gap cực lớn. [LEGACY/CONFUSING]

## 11. What Actually Works
- Lõi Identity & Provisioning (P0.1) hoạt động hoàn hảo về mặt logic backend.
- Public UI đọc được dữ liệu.
- Admin UI (Staff Console) vẫn sống độc lập và hoạt động.

## 12. What Is Missing
- Nút "Đăng nhập" trên giao diện public.
- Giao diện SPA (Frontend) đồng bộ cho `/login` và `/me`.
- Family Space.
- Cơ chế upload / Memory management.

## 13. What Is Confusing
- Tại sao trang công cộng nói về "Tư cách thành viên" rất hay, nhưng lại không cho người ta đăng nhập?
- Bị kẹt ở `/me` không có đường về.

## 14. What Is Broken
- Luồng Navigation Public ↔ Member bị đứt gãy vật lý.
- Local Frontend UI hardcode gọi thẳng lên Production API.

## 15. Privacy / Personal Space Assessment
Trang `/me` hiện tại được bảo mật đúng bằng session (private). Người ngoài không thể vào. Nhưng nó chưa có gì riêng tư để xem cả.

## 16. Member Help / Documentation Assessment
Không có bất kỳ hướng dẫn nào cho người dùng về việc họ phải làm gì khi đổi mật khẩu xong.

## 17. Questions Tuấn Would Ask Next
- "Bao giờ thì cái trang `/me` thô sơ này được ráp vào giao diện đẹp của DESIGN-001?"
- "Làm sao để tôi sửa tên của tôi bị sai trong gia phả?"
- "Tại sao Local Frontend lại gọi Production API, vậy tôi test API local kiểu gì?"

## 18. Product Gaps
- Điểm đứt gãy (Friction) cực lớn giữa trải nghiệm đọc (Public) và trải nghiệm tương tác (Member). Chúng chưa hợp nhất thành một "Sản phẩm" (Product) liền mạch.

## 19. Technical Gaps
- `app-v2.js` chứa absolute URL fetch tới `https://api.giatoctrantrongthu.com`. Nếu không sửa, ta không thể test local DB trên giao diện Public SPA.
- Routing đang hỗn loạn giữa Hash Route (Frontend SPA) và Server Route (Express Node).

## 20. Recommended Next Investigation
- **Khắc phục ngay**: Sửa `app-v2.js` để nó nhận diện môi trường (dùng relative URL `/api/` thay vì hardcode domain) để Public UI có thể soi được dữ liệu Local SQLite.
- **Kiến trúc Frontend**: Bắt buộc phải quyết định việc merge các màn hình Member (`/login`, `/me`) vào chung lõi SPA `app-v2.js` thay vì dùng Server-side HTML trả về từ Node. Lõi API P0.1 cần được refactor để chỉ trả JSON cho Frontend.
- **Sau đó mới đi tiếp**: P1 (Family Space).
