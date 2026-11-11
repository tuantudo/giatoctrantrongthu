# ĐẶC TẢ KIẾN TRÚC HIỆN HÀNH DỰ ÁN (PHASE 2D - PART 1)
**Dự án:** Cây Gia Phả — Gia Tộc Trần Trọng Thụ  
**Authority:** Tuấn (Product Owner / Human Final Authority) | Emarald (Strategic Architecture & Quality Authority)  
**Execution & Integration Owner:** AGY (Chief Orchestrator & Integration Authority)  
**Tài liệu đối soát:** Bằng chứng thực tế từ mã nguồn và kiểm thử độc lập (06/11/2026)  

---

## 1. SƠ ĐỒ TỔNG THỂ KIẾN TRÚC HIỆN HÀNH (CURRENT SYSTEM ARCHITECTURE)

Hệ thống đã trải qua quá trình tái cấu trúc sâu sắc (Workstream SC-01 $\to$ SC-04), định hình mô hình phân tầng độc lập:

```text
┌──────────────────────────────────────────────────────────────────────────┐
│                   BROWSER CLIENT RUNTIME (Vercel / Lab)                  │
├──────────────────────────────────────────────────────────────────────────┤
│ [UI Shell & Pages]                                                       │
│   ├── boot-public.js (Trang nhất đối ngoại & Gateway Hash Routing)       │
│   ├── public-home.js (6 khu vực nội dung công bố)                        │
│   ├── gateway.js (Thẻ Mời xác minh khi khách vào #/gia-pha, #/mach...)   │
│   ├── dashboard.js (/me Member Home: 4 lát cắt hội tụ dữ liệu thực)      │
│   ├── tree.js (/me/tree: 3-Tier Me-Centric Tree & Archival List Collation)│
│   └── person.js (/me/tree/person/:id: Hồ sơ nhân vật 6 tầng thông tin)  │
├──────────────────────────────────────────────────────────────────────────┤
│ [Consumer Data Facade & Adapter] (src/js/ui/data.js, mock-adapter.js)    │
│   └── Ủy thác 100% cuộc gọi về Tầng Platform Data Layer                  │
├──────────────────────────────────────────────────────────────────────────┤
│ [PLATFORM DATA INVERSION LAYER - DIP] (src/js/platform/data/)            │
│   ├── DataService (Bộ điều hướng, quản lý Cache bộ nhớ, TTL, Guard)      │
│   ├── MockDataAdapter (Nạp dữ liệu fixtures/ PII-free cho dev/test)      │
│   └── HttpDataAdapter (Gọi REST API thực tế với cơ chế xác thực JWT/Sess)│
├──────────────────────────────────────────────────────────────────────────┤
│ [5 PURE DOMAIN CORES] (src/js/domain/ — Độc lập 100% khỏi Browser DOM)   │
│   ├── domain/genealogy (Thuật toán cây phả hệ, BFS, bóc tách GEDCOM)     │
│   ├── domain/kinship   (Suy diễn danh xưng thân tộc, bậc quan hệ F0-F4)  │
│   ├── domain/editorial (Phân vùng MẠCH, bảo mật Clara, sắp xếp bài viết) │
│   ├── domain/calendar  (Lịch âm dương, tính toán ngày giỗ xoay vòng)     │
│   └── domain/archive   (Xử lý danh mục 185 ảnh tư liệu, gắn avatar)      │
└──────────────────────────────────────────────────────────────────────────┘
                                   │  HTTP / JSON (Protected Session)
                                   ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                     BACKEND RUNTIME (Node.js Express)                    │
├──────────────────────────────────────────────────────────────────────────┤
│ [Server Application] (server/index.js)                                   │
│   ├── Sensitive Path Regex Chặn truy cập tĩnh vào data/private, .db...   │
│   ├── Member Router (server/member.js: /login, /me, /api/member/clara)   │
│   ├── Auth Router (server/auth.js: Tài khoản kỹ thuật & Admin)           │
│   └── Spaces Router (server/spaces_router.js: Không gian phân quyền)    │
├──────────────────────────────────────────────────────────────────────────┤
│ [Database Layer] (SQLite CSDL Vật lý: server/family_archive.db)         │
│   └── 15 Bảng dữ liệu: people (223), families (68), media (185),         │
│       person_media (173), stories (12), accounts, calendar_events...     │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 2. CHI TIẾT CÁC PHÂN HỆ VÀ NĂNG LỰC ĐÃ KIỂM CHỨNG

### 2.1 Tầng 5 Pure Domain Cores (`src/js/domain/`)
- **Nguyên lý kiến trúc:** 100% không phụ thuộc vào `window`, `document` hay bất kỳ API trình duyệt nào. Có thể chạy trên bất kỳ JavaScript runtime nào (Node.js, Deno, Bun, Browser, Web Worker).
- **Trách nhiệm từng module:**
  1. `domain/genealogy`: Cung cấp các hàm phân tích cây quan hệ `deriveGenerations`, thuật toán tìm đường dẫn huyết thống BFS `findKinshipPath`, phân tích niên đại GEDCOM `humanDate`, và chuẩn hóa tìm kiếm `sortPeopleByName`.
  2. `domain/kinship`: Tính toán xưng hô theo tập quán Việt Nam (`calculateAddressing`), gán nhãn thế hệ `getGenerationMeta` (F0 Gốc, F1 Đời con, F2 Đời cháu...).
  3. `domain/editorial`: Phân loại phạm vi bài viết `partitionByDiscourseScope`, kiểm soát an ninh cách ly Thư gửi Clara, sắp xếp ấn phẩm.
  4. `domain/calendar`: Phân giải tệp lịch iCalendar `.ics`, chuyển đổi dương lịch sang âm lịch, tính toán sự kiện giỗ chạp sắp tới theo vòng quay lịch trăng `getUpcomingEvents`.
  5. `domain/archive`: Xử lý kho 185 tư liệu ảnh, tự động phân giải chân dung đại diện `resolvePrimaryPortrait`, lập chỉ mục liên kết người - ảnh.

### 2.2 Tầng Đảo Ngược Phụ Thuộc Dữ Liệu (Platform Data DIP)
- **Định vị:** Đóng vai trò lớp đệm (Inversion of Control) giữa Tầng Giao Diện và Nguồn Dữ Liệu.
- **Thực thi:** Lớp `DataService` định nghĩa hợp đồng chung cho 6 loại dữ liệu: `memberProfile`, `genealogy`, `media`, `personMedia`, `mach`, `clara`, và nộp đề xuất `submitProposal`.
- **Lợi ích:** Cho phép Vibecode Lab và kịch bản test tự động chạy mượt mà trên dữ liệu giả lập sạch (`MockDataAdapter`) mà không cần kết nối server backend, đồng thời khi triển khai thực tế chỉ cần bật cờ nạp `HttpDataAdapter`.

### 2.3 Cơ Chế Bảo Vệ Cửa Ngõ An Ninh P0 (Gateway Hardening)
- **Thiết kế:** Tuân thủ triệt để nguyên tắc: Chỉ có Trang nhất (`#/`) là giao diện xã hội đối ngoại. Các hash routes `#/mach`, `#/gia-pha`, `#/lich`, `#/tim-kiem` là các Cửa Ngõ Mời Xác Minh.
- **Hành vi:** Khi người dùng chưa đăng nhập bấm vào các liên kết này, component `gateway.js` sẽ kết xuất thẻ mời trang trọng, không tải về và không lưu bất kỳ byte dữ liệu phả hệ nào trong DOM hoặc bộ nhớ máy khách.

---

## 3. HIỆN TRẠNG CƠ SỞ DỮ LIỆU (DATABASE STATE)

Tập tin CSDL SQLite chính thức của dự án đặt tại [`server/family_archive.db`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/family_archive.db) với cấu trúc 15 bảng:

| Tên Bảng | Số lượng bản ghi | Mục đích nghiệp vụ & Trạng thái dữ liệu |
| :--- | :---: | :--- |
| `people` | **223** | Hồ sơ 223 cá nhân dòng họ (đồng bộ từ GEDCOM 5.5.1 qua FamilySearch ID). |
| `families` | **68** | 68 đơn vị gia đình hạt nhân, liên kết vợ-chồng và cha-mẹ-con. |
| `media` | **185** | Kho 185 tư liệu ảnh lịch sử lưu trên NAS. |
| `person_media` | **173** | 173 liên kết giữa cá nhân và ảnh chân dung/tư liệu (đã đối soát bảo toàn). |
| `stories` | **12** | 12 bài viết MẠCH ấn bản 01 đã biên tập xuất bản. |
| `admin_users` | **1** | Tài khoản quản trị kỹ thuật cấp cao. |
| `accounts` | - | Bảng tài khoản thành viên gia tộc (chuẩn bị cho phân quyền ReBAC). |
| `calendar_events` | - | Danh mục sự kiện giỗ chạp và ngày lễ cố định. |
| `identity_mappings`| - | Bảng ánh xạ giữa tài khoản đăng nhập và thực thể nhân vật phả hệ. |
| `authorities` | - | Phân quyền truy cập theo vai trò. |
| `authors` | - | Danh sách tác giả các bài viết MẠCH. |
| `series` | - | Các chuyên đề xuất bản của tạp chí MẠCH. |
| `edges` | - | Mạng lưới quan hệ phả hệ mở rộng. |
| `memories` | - | Ký ức và hồi ký của các bậc tiền bối. |
| `timeline` | - | Dòng sự kiện lịch sử dòng họ. |

---

## 4. DANH MỤC NỢ KỸ THUẬT VÀ KHOẢNG TRỐNG CẦN KHẮC PHỤC (TECHNICAL DEBT & GAPS)

Dựa trên kết quả khảo sát Baseline (Phase 2A) và phân tích đồ thị AST của Craft Anything (Phase 2B), các điểm nghẽn kiến trúc cần xử lý bao gồm:

1. **Mã nguồn di sản mồ côi (Orphaned Legacy Code):**
   - File `src/js/member-app.js` (2.965 dòng, 92 KB) và `src/js/app-v2.js` (577 dòng, 24 KB) hoàn toàn không có cạnh phụ thuộc nào trong ứng dụng. Cần đưa vào thư mục lưu trữ `archive/` để làm sạch codebase.
2. **Lỗ hổng lộ lọt API Phả hệ phía Backend Express:**
   - Hai endpoint `GET /api/people` và `GET /api/genealogy.json` trong `server/index.js` đang mở `publicCors` và không yêu cầu đăng nhập. Cần bổ sung middleware `requireAccount` để đóng kín ranh giới an ninh với phía Client.
3. **Thiếu vắng hoàn toàn Middleware Chống Tấn Công CSRF:**
   - Toàn bộ backend Express chưa có cơ chế Anti-CSRF Token cho các thao tác POST/PATCH/DELETE.
4. **Phân hệ Admin Control Center mới ở mức Prototype:**
   - 6/9 module trong Admin Control Center v2.1 chưa được hiện thực hóa với CSDL SQLite thật; `mod-public-cms` bị chặn bởi quyết định mở `DEC-A03`.

