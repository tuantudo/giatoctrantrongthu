# PUBLIC HOME TEST / REVIEW MISSION v0.5

## 1. OBSERVE
- **Trạng thái Navigation:** Thanh điều hướng (Global Nav) chỉ hiển thị chính xác 1 Icon (Home) và 1 Link (Đăng nhập). Không còn bất kỳ anchor tab nào như `Tiếng nói của gia tộc` hay `Về gia tộc` trên header.
- **Trạng thái Nội dung (Zones):** Trang có cấu trúc rõ ràng:
  - Header Identity (H1 Tên Gia Tộc)
  - Khối 01: Tiếng nói của gia tộc.
  - Khối 02: Về gia tộc (Chứa bản copy Draft mới và thông số Gia phả: 228 nhân vật, 0 gia đình, 2 ghi chép).
  - Khối 03: Người trong gia tộc (Cửa vào Member Space, Href: `/login`).
- **Trạng thái Chân trang (Footer):** Được hardcode đúng copy yêu cầu từ V0, chứa các navigation tĩnh tới MẠCH, Tư liệu, Gia phả, Lịch...

## 2. TEST
- **Nav Test:** `PUBLIC_NAV` trong `shell.js` xác nhận chỉ có 2 object `{ href: '/', iconHtml: ... }` và `{ href: '/login', label: 'Đăng nhập' }`.
- **Accessibility Test:** Component Icon Home có trường `aria-label="Trang chủ"`.
- **Copy Test:** Draft copy và con số thống kê cứng khớp hoàn toàn với yêu cầu.
- **Gate Test:** Nút bấm có CTA "Vào không gian của gia tộc" và hint phụ bên dưới chính xác.

## 3. COMPARE (V1 vs V0 Reference)
- Về mặt UI/UX Typo: `tokens.css` đã khôi phục Font Serif `Times New Roman` và hàm `clamp()` cho Type Scale, tái hiện lại sự tĩnh lặng và "điểm nhấn" của V0.
- Khối Threshold (H1) được tái thiết lập để giống trang bìa của ấn phẩm, giải quyết tình trạng "bị trôi" không điểm tựa (SaaS-ification) ở phiên bản trước.
- Không còn viền gạch đứt (Dashed). V1 giờ đây trang nhã như V0 nhưng chạy trên hệ thống Component động.

## 4. CLASSIFY
- **Semantic / Information Architecture:** IMPLEMENTED & COMPLIANT.
- **Visual Design / Typography:** COMPLIANT WITH V0 REFERENCE.
- **Data / Static Copy:** STATIC (Thống kê gia phả đang bị hardcode, footer đang chứa link hash route cũ `#/mach`).

## 5. REPORT
Implementation hiện tại đã **đáp ứng trọn vẹn 100% IA Contract mới nhất** của Human.
- Điểm sáng: Typography và khoảng trắng (Whitespace) đã trả lại linh hồn cho Giatộc, không còn giống một trang dashboard.
- Chú ý: Footer chứa các link `#/mach`, `#/gia-pha` là đường link cũ của V0. Với V1, những link này trên Public có thể dẫn tới trang NotFound, nhưng do Human yêu cầu chính xác block copy này, Implementation đã trung thành tuân thủ.

## 6. RECOMMENDATION
- **Verdict:** READY / PASS.
- Mọi thứ đã đúng theo ý đồ của Human. Em đề xuất **KHÔNG** sửa thêm bất kỳ UI/UX nào trên Public Home nữa. Nếu cần nâng cấp trong tương lai, chỉ nên thay số liệu 228 (hardcode) bằng API Fetch khi Backend sẵn sàng.
