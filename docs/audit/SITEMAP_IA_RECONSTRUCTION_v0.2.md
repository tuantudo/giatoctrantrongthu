# Legacy IA Reconstruction v0.2

## 1. Evidence
Các kết luận trong báo cáo này được trích xuất trực tiếp từ mã nguồn, không suy diễn:
- **Legacy Frontend**: `archive/legacy_frontend/index.html` (các thẻ `<a href="#/... ">` và `navigateRoute()`).
- **Dynamic Routes**: `server/auth.js` (cung cấp `/`, `/login`) và `server/member.js` (cung cấp `/me/...`).
- **Frontend App**: `src/js/member-app.js`, `src/js/app-v2.js`.

## 2. Legacy Sitemap
Bản đồ các URL/Hash từ bản Legacy (`/#/`):
- `#/` (Trang Chủ)
- `#/gia-pha` (Gia Phả)
  - `#/gia-pha/nhan-vat` (Thành viên)
  - `#/gia-pha/gia-dinh` (Gia đình)
  - `#/gia-pha/dong-thoi-gian` (Dòng thời gian)
  - `#/gia-pha/ky-uc` (Ký ức)
- `#/mach` (Mạch)
- `#/tu-lieu` (Tư Liệu)
- `#/lich` (Lịch)
- `#/tim-kiem` (Tìm kiếm)

## 3. Semantic Node Classification
Phân loại bản chất của các Node trong Legacy:
- **Content Domain (Không gian nội dung)**: `#/gia-pha`, `#/mach`, `#/tu-lieu`, `#/lich`. (Đây là các silo thông tin lớn độc lập).
- **View (Góc nhìn dữ liệu)**: `#/gia-pha/nhan-vat`, `#/gia-pha/gia-dinh`. (Đây là các cách filter/view khác nhau của chung một Domain Gia Phả).
- **State (Trạng thái chi tiết)**: Các hàm như `navigateRoute('/tree/person/:id')` hoặc URL tương đương, thể hiện trạng thái (detail state) khi drill-down vào 1 entity của Domain Gia Phả. Không phải là destination độc lập.
- **Utility (Tiện ích)**: `#/tim-kiem` (Đây là một chức năng, không phải không gian lưu trữ).

## 4. Relationships
- **Trang chủ (`#/`)** đóng vai trò là Hub duy nhất, hiển thị nội dung trích xuất từ tất cả các Domain khác.
- Các Domain (`Gia Phả`, `MẠCH`, `Tư Liệu`, `Lịch`) là các thực thể ngang hàng (Siblings) ở Root level.
- Phả đồ, Danh sách nhân vật, Danh sách gia đình có quan hệ cha-con (Child-views) phụ thuộc hoàn toàn vào Domain `Gia Phả`.

## 5. Current Dynamic Mapping
Khảo sát implementation hiện tại (`server/member.js`, `server/auth.js`):

| Legacy Node | Current Dynamic Route | Mapping Status |
|---|---|---|
| `#/` | `/` (Auth/Gate) và `/me` (Dashboard) | **SPLIT**: Tách thành 2 route. |
| `#/gia-pha` | `/me/tree` | **MOVED** |
| `#/gia-pha/nhan-vat` | `/me/tree/person/:id` (Detail) | **PRESERVED AS STATE** |
| `#/mach` | `/me/mach` | **MOVED** |
| `[Không tồn tại]` | `/me/clara` | **NEW/UNMAPPED** |
| `#/gia-pha/gia-dinh` | `/me/family-spaces` | **PROMOTED**: Từ View của Gia Phả thành Route cấp 1. |
| `#/tu-lieu` | `[Không tìm thấy backend route]` | **LOST** |
| `#/lich` | `[Không tìm thấy backend route]` | **LOST** |
| `#/tim-kiem` | `[Không tìm thấy backend route]` | **LOST** |

## 6. Lost / Split / Duplicated / Misclassified
- **LOST**: Hệ thống Dynamic Route đã làm mất `Tư liệu`, `Lịch`, `Tìm kiếm`. Không có middleware hay controller nào xử lý các không gian này trong `server/member.js`.
- **SPLIT (Tách)**: Không gian Trang chủ (Hub) bị cắt làm hai. `/` trở thành cổng vào (Gate), `/me` trở thành Hub.
- **PROMOTED / MISCLASSIFIED (Thăng cấp sai)**: `Family Spaces` (Nhánh gia đình) ở Legacy là một tab (View) nằm bên trong Gia Phả. Trong Dynamic, nó biến thành `/me/family-spaces`, bị đặt ngang hàng với Domain Gia Phả.
- **NEW**: `Clara` xuất hiện thành một route độc lập ngang hàng với `MẠCH`, trong khi legacy không hề nhắc tới không gian này.

## 7. Root Cause
1. **`/me` là Implementation Container, không phải Domain Space**: Việc dùng prefix `router.get('/me/...')` xuất phát từ nhu cầu bảo mật (chặn Auth middleware). Nhưng hệ quả là tất cả các Domain bị nhét vào trong cái thùng `/me`, biến `/me` thành một Domain giả tạo trên URL.
2. **Dynamic Route xây dựng theo tiến độ tính năng (Piecemeal Implementation)**: Các tính năng nào code xong (Tree, Mạch) thì được gán Route. Tính năng nào chưa code (Tư liệu, Lịch, Tìm kiếm) thì bị bỏ qua, dẫn đến việc mất cấu trúc IA gốc.

## 8. Canonical IA — reconstruction-based, not invented
Tái lập lại đúng IA của Legacy, có tính đến Ranh giới Access mới của Dynamic:

**PUBLIC ZONE**
- Root Threshold (Cổng định danh)
- Đăng nhập (Utility)

**MEMBER ZONE (Tương đương Hub `#/` cũ)**
- Bảng tin / Hub (`/me`)
- **Domain: Gia Phả**
  - View: Cây tổng
  - View: Danh sách nhân vật / gia đình (bao gồm Family Spaces)
  - State: Chi tiết nhân vật
- **Domain: MẠCH**
- **Domain: Tư Liệu** *(Cần phục hồi)*
- **Domain: Lịch** *(Cần phục hồi)*

*(Lưu ý: Clara là UNKNOWN trong legacy, không thể xếp hạng nếu chỉ dựa vào Reconstruction).*

## 9. Public Home Role
Dựa trên IA đã tái lập:
- Trong Legacy, `#/` chứa toàn bộ content giới thiệu và trích dẫn bài viết.
- Trong Dynamic, hệ thống chặn người ngoài bằng login. Do đó, toàn bộ content đã bị dồn vào `/me`.
- **Kết luận (Evidence-based)**: Vai trò của Public Home (`/`) đã bị tước bỏ chức năng Hub nội dung. Nó hiện tại **CHỈ LÀ ENTRY GATE (Cổng ranh giới)** và chứa định danh dòng họ. Việc ép nó làm Landing Page như Legacy là sai với implementation hiện tại.

## 10. Decisions Required from Tuấn
Dựa trên việc Audit, Tuấn cần quyết định các điểm [UNKNOWN] sau trước khi đi tiếp:
1. **Khôi phục Tư Liệu & Lịch:** Chúng ta có code lại backend route cho hai không gian này để khôi phục hoàn chỉnh Legacy IA không?
2. **Vị trí của Clara:** Trong Legacy không có Clara. Nó nên là một Domain ngang hàng với MẠCH, hay là một Sub-section của MẠCH?
3. **Vị trí của Family Spaces:** Trả nó về làm một góc nhìn (View) bên trong không gian Gia Phả (giống Legacy `#/gia-pha/gia-dinh`), hay tiếp tục để nó ngang hàng như một Domain độc lập?
