# BẢN ĐỒ MÃ NGUỒN & QUY HOẠCH (SOURCE CONSOLIDATION & CHANGE-POINT MAP)

> **Mục đích**: Bản đồ này định vị các thành phần (artifacts) trong hệ thống, phân loại vòng đời (Current, Legacy, Temporary), và cung cấp hướng dẫn "Muốn sửa X thì vào đâu".
> **Quy tắc**: Bất kỳ thay đổi cấu trúc nào cũng phải được cập nhật lại vào tài liệu này. Không để con người hoặc AI phụ thuộc vào việc tìm kiếm (grep) mù quáng.

---

## 1. PHÂN LOẠI MÃ NGUỒN (SOURCE INVENTORY)

Dưới đây là các cụm mã nguồn có ý nghĩa về mặt kiến trúc và vận hành:

| Cụm / Thư mục / File | Phân loại | Bằng chứng (Evidence) | Vai trò (Responsibility) |
|---|---|---|---|
| `src/js/app-v2.js` | **CURRENT** | Được gọi trực tiếp từ `index.html` (dòng 379) | Root entrypoint của Frontend V2 |
| `src/js/app.js` | **LEGACY** | Không được gọi trong `index.html`, size rất lớn (134KB), logic cũ | Monolithic Frontend V1 |
| `admin/` | **CURRENT** | Nơi Ban biên tập sử dụng để duyệt và cập nhật dữ liệu | Admin Control Room & API Client |
| `server/index.js` | **CURRENT** | Chứa API endpoints, routing logic và DDL nội tuyến (inline) | Node.js Backend API chính |
| `server/schema_update.sql` | **REQUIRED** | Chứa định nghĩa các bảng mà API đang query (media, families...) | Database Schema mở rộng |
| `database/migrations/` | **LEGACY** | Cấu trúc bảng sơ khai, một số bảng không còn khớp với API live | Baseline DB Schema |
| `generator/` | **UNKNOWN / LEGACY** | Các script Python sinh JSON từ GEDCOM. Dự án đang chuyển sang Admin API, role của thư mục này có thể là dự phòng (fallback). | Sinh tĩnh dữ liệu (Static Generation) |
| Kịch bản (`*.py`, `*.js`) tại root | **TEMPORARY** | Gồm 34 scripts sinh ra từ các phiên audit cũ (patch, check, verify) | Scripts dùng 1 lần (Build/Audit/Test) |
| `docs/` | **CURRENT & ARCHIVED** | Chứa tài liệu chuẩn và hàng chục báo cáo cũ trong thư mục con | Tài liệu kiến trúc & Lịch sử |

---

## 2. BẢN ĐỒ ĐIỂM THAY ĐỔI (CHANGE-POINT MAP)

**KHI BẠN MUỐN SỬA... HÃY TÌM Ở...**

### A. Nội dung (Content & Data)
- **Sửa thông tin người, story, sự kiện**: Dùng **Admin UI (`/admin`)**. Tránh sửa trực tiếp trong database trừ khi deploy hỏng.
- **Dữ liệu thô JSON**: Nằm ở `server/data/` (Ví dụ: `genealogy.json`), tuy nhiên file này sinh ra từ server, không nên sửa thủ công.

### B. Giao diện (Frontend)
- **Cấu trúc HTML trang chủ (Shell)**: `index.html`
- **Render logic & Components**: `src/js/app-v2.js`
- **Giao diện & Style**: `src/css/prototype.css` và `src/css/main.css`

### C. Máy chủ & API (Backend)
- **Logic trả dữ liệu (API endpoints)**: `server/index.js`
- **Xác thực Admin (Auth)**: `server/auth.js`
- **Gọi API từ Frontend Admin**: `admin/js/api.js`

### D. Cơ sở dữ liệu (Database)
- **Định nghĩa lược đồ (Schema)**: Cực kỳ phân mảnh. Bạn phải xem xét cả `server/index.js` (phần tạo bảng ban đầu) và `server/schema_update.sql`. 
- **Cảnh báo**: Hiện chưa có thư mục quản lý Migration Canonical duy nhất.

### E. Tài nguyên (Media)
- **Quản lý URL Ảnh**: File logic `server/index.js` (Endpoint `/api/media.json` tự động nối prefix URL).
- **Vị trí vật lý**: Thư mục NAS (`/volume1/web/family-api/assets/images/`).

### F. Hạ tầng (Infrastructure & Deployment)
- **Vercel Config**: `vercel.json`
- **Git Actions (Tự động hóa)**: `.github/workflows/`

---

## 3. KẾ HOẠCH QUY HOẠCH VÀ DỌN DẸP (CONSOLIDATION PLAN)

*(Các đề xuất dưới đây CẦN SỰ PHÊ DUYỆT CỦA HUMAN trước khi thực thi)*

| Mức độ ưu tiên | Artifact | Đề xuất | Lý do / Rủi ro |
|---|---|---|---|
| 1 | ~34 file `*.py`, `*.js` ở root | **ARCHIVE / DELETE** | Rác sinh ra từ các phiên audit cũ, không chạy trên production. Việc xoá chúng giúp thư mục root gọn gàng ngay lập tức. Cần di chuyển vào `.opencode/archive/` (Rủi ro: Rất thấp). |
| 2 | `src/js/app.js` | **ARCHIVE** | File Monolithic cũ không được root HTML tải, giữ lại gây nhầm lẫn khi tìm kiếm code. (Rủi ro: Thấp). |
| 3 | `database/migrations/` và `server/schema_update.sql` | **INVESTIGATE & MERGE** | Hợp nhất tất cả schema vào một file hoặc một workflow Migration duy nhất, tránh tình trạng "trống đánh xuôi kèn thổi ngược" với API (Rủi ro: Cao - cần Live Audit trước). |
| 4 | `generator/` | **INVESTIGATE** | Nếu luồng Dynamic Web API đã 100% thay thế luồng tĩnh, có thể ARCHIVE bộ sinh file GEDCOM này (Rủi ro: Trung bình). |
| 5 | Các thư mục con trong `docs/` | **CLEANUP** | Đẩy tất cả các tài liệu lịch sử không còn là Source of Truth vào thư mục `docs/99_ARCHIVE` (Rủi ro: Thấp). |
