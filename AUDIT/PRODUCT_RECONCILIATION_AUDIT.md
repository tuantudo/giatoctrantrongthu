# BÁO CÁO ĐỐI SOÁT TOÀN DIỆN SẢN PHẨM (PRODUCT RECONCILIATION AUDIT)
## BATCH 01: PUBLIC WEBSITE vs LOCAL REPOSITORY vs PRODUCT INTENT

**Mã tài liệu:** `AUDIT/PRODUCT_RECONCILIATION_AUDIT.md`  
**Dự án:** CÂY GIA PHẢ / GIATỘC TRẦN TRỌNG THU  
**Đơn vị thực hiện:** AGY — Execution Coordinator & Primary Agent  
**Cơ quan thẩm định kiến trúc:** Emarald — Analysis Authority  
**Thẩm quyền phê duyệt tối cao:** Tuấn — Human Final Authority  
**Thời điểm lập:** 2026-11-02 14:00 (ICT)  
**Chế độ thực thi:** STRICT READ-ONLY FORENSIC AUDIT (Không ghi code, không đổi DB, không sửa Git)  

---

## 1. TỔNG QUAN ĐIỀU HÀNH (EXECUTIVE SUMMARY)

Báo cáo này thiết lập biên bản đối soát pháp y độc lập giữa **3 thực thể cốt lõi** của hệ thống:
1. **Public Website:** `https://giatoctrantrongthu.com`, `https://giatoctrantrongthu.vercel.app/`, và `https://api.giatoctrantrongthu.com`.
2. **Local Repository:** Mã nguồn tại commit HEAD `42a7ed2`, working tree chưa commit, backend Express, và CSDL SQLite `server/family_archive.db`.
3. **Product Intent (Ý định sản phẩm):** Quy định tại `AUDIT/MASTER_COMPLETION_PLAN.md` (v2.0), `AUDIT/FRONTEND_COMPLETION_PLAN.md` (v2.0), và các quyết định kiến trúc của Tuấn.

### Phát hiện then chốt:
- **[OBSERVED] Sự phân ly giữa Public và Local Shell:** Public website `giatoctrantrongthu.com` hiện đang phục vụ **DESIGN-001 Revision Prototype** (giao diện xuất bản gồm 6 phân hệ: Trang chủ, MẠCH, Tư liệu, Gia phả, Lịch, Tìm kiếm). Tuy nhiên, tại local working tree chưa commit, tệp gốc `index.html` đã bị thay thế hoàn toàn bởi một khung xương 18 dòng (*The Dichotomy / Concept B*) chỉ hiển thị màn hình cổng chào tối giản trỏ vào `/login`, còn giao diện DESIGN-001 bị đẩy sang `prototype/design-001-public/index.html`. Sự thay đổi uncommitted này đi ngược lại Product Intent đã chốt tại Master Plan v2.0 (vốn yêu cầu bảo tồn diện mạo xuất bản trang trọng của dòng họ).
- **[PROVEN] Sự đứt gãy dữ liệu Lịch (Calendar):** Backend `server/index.js` có route `/api/calendars/:filename` truy vấn bảng SQLite `calendar_events`. Bảng này hiện có đúng **0 dòng dữ liệu**, dẫn đến API luôn trả về HTTP 404. Trong khi đó, 4 tệp `.ics` tĩnh trong `server/calendars/` chứa đầy đủ **265 sự kiện gia tộc thực tế** nhưng chưa bao giờ được nạp (ingest) vào CSDL.
- **[PROVEN] Bất đối xứng dữ liệu Bài viết (MẠCH Stories):** Bảng SQLite `stories` chỉ có duy nhất **1 dòng dữ liệu mẫu (mock)**. Route `/api/mach.json` hiện đang "đi đường tắt" bằng cách đọc thẳng từ tệp JSON tĩnh `server/data/mach.json` (chứa 12 bài viết) trên đĩa thay vì truy vấn CSDL.
- **[PROVEN] Bảo toàn an ninh & Cô lập Thư từ Clara:** Toàn bộ 8 bức thư Clara được cô lập an toàn trong `server/data/private/clara.json`. Route `/api/mach.json` loại bỏ triệt để các bài viết gắn cờ Clara. Không có rò rỉ dữ liệu nhạy cảm ra API công khai.
- **[OBSERVED] Trạng thái "Nửa Tĩnh - Nửa Động":** Hệ thống trên Production thực chất là một Single-Page App tĩnh (hoặc hybrid) đọc từ các snapshot JSON/ICS được deploy qua Vercel. Toàn bộ backend Express (`server/index.js`, `server/member.js`), hệ thống phiên đăng nhập (session cookie), và ReBAC chỉ mới tồn tại ở môi trường Local/Staging và chưa từng được kết nối đồng bộ lên Production.

---

## 2. KIỂM KÊ TÀI NGUYÊN PUBLIC WEBSITE (PUBLIC WEBSITE INVENTORY)

### 2.1. Production Website (`https://giatoctrantrongthu.com`)
- **[OBSERVED] Tiêu đề trang:** `Gia Tộc Trần Trọng Thu — DESIGN-001 Revision Prototype`.
- **[OBSERVED] Cấu trúc điều hướng (Hash Routes):**
  - `#/` (Trang chủ): Hero section, thông cáo dòng họ, triết lý di sản số.
  - `#/mach` (Tạp chí MẠCH): Danh sách bài viết số 01 (Khởi nguồn, Gìn giữ ký ức, Hành trình lịch sử...).
  - `#/tu-lieu` (Kho tư liệu): Thông báo *"media.json hiện chỉ có assetId / sha256 / mimeType / file — chưa đủ semantic metadata... KHO TƯ LIỆU ĐANG ĐƯỢC XÂY DỰNG & SỐ HÓA"*.
  - `#/gia-pha` (Cây gia phả): Bảng thống kê hiển thị `228 NHÂN VẬT`, `0 GIA ĐÌNH`, `2 GHI CHÉP KÝ ỨC`. Danh sách thẻ nhân vật có lọc theo chi/nhánh/thế hệ.
  - `#/lich` (Lịch dòng họ): Hiển thị *"Sự kiện sắp tới của dòng họ... snapshot thật từ CAL_*.ics"*.
  - `#/tim-kiem` (Tra cứu): Ô tìm kiếm nội bộ hoạt động trên snapshot MẠCH + Ký ức (không gọi backend search).
  - `#/tu-cach-thanh-vien`: Form tiếp nhận đề nghị xác thực thành viên gia tộc.
- **[OBSERVED] Nguồn cấp dữ liệu mạng:** Trang gọi các tệp dữ liệu tĩnh hoặc API công khai: `/api/mach.json`, `/api/media.json`, `/api/genealogy.json`.

### 2.2. Historical Static Site (`https://giatoctrantrongthu.vercel.app/`)
- **[OBSERVED] Bản chất:** Đây là phiên bản ứng dụng đơn trang thuần tĩnh V0/V1 (trùng khớp với mã nguồn lưu trữ trong `archive/legacy_frontend/index.html` và `archive/legacy_frontend/app.js`).
- **[OBSERVED] Tính năng hiện hữu:**
  - Cây phả hệ đồ họa tương tác (interactive tree canvas).
  - Lịch dòng họ dạng ô lưới theo tháng (month calendar grid).
  - Danh mục 19 bài viết (bao gồm 12 bài MẠCH số 01 và 7 bài viết Clara bị trộn lẫn - đây chính là nguồn gốc của lỗi rò rỉ quyền riêng tư ban đầu đã được Tuấn chỉ đạo khắc phục).

### 2.3. Production API Domain (`https://api.giatoctrantrongthu.com`)
- **[TESTED] `https://api.giatoctrantrongthu.com/api/mach.json`:** HTTP 200 OK. Trả về JSON chứa danh sách tác giả và các bài viết MẠCH.
- **[TESTED] `https://api.giatoctrantrongthu.com/api/media.json`:** HTTP 200 OK. Trả về JSON mảng 185 đối tượng tài nguyên đa phương tiện (technical hash, mimeType).
- **[FAILED] `https://api.giatoctrantrongthu.com/api/genealogy.json`:** Connection timeout / blocked (Gateway không phản hồi kịp hoặc endpoint chưa được cấu hình reverse proxy trên Vercel/Cloudflare).

---

## 3. KIỂM KÊ MÔI TRƯỜNG LOCAL REPOSITORY (LOCAL REPOSITORY INVENTORY)

### 3.1. Trạng thái Git & Working Tree
- **[PROVEN] Git Commit HEAD:** `42a7ed2f229ac0d9a6630126d4da058e55acf50b` (*feat: Deploy DESIGN-001 Revision with real production data API*).
- **[OBSERVED] Uncommitted Working Tree:** Có 102 tệp đang trong trạng thái thay đổi hoặc chưa track (kết quả từ các đợt audit và thực thi trước đó).
- **[OBSERVED] Xung đột tệp gốc `index.html`:**
  - Tại HEAD `42a7ed2`: `index.html` là nguyên bản giao diện DESIGN-001 Revision (383 dòng mã tích hợp).
  - Trong Working Tree: `index.html` đã bị ghi đè thành tệp khung xương tối giản 18 dòng load `src/js/ui/boot-public.js` (Concept B / The Dichotomy). Bản DESIGN-001 bị đổi tên và di chuyển vào `prototype/design-001-public/index.html`.

### 3.2. Cấu trúc Frontend Hiện Hữu
- **[CONFIGURED] Thư mục `src/css/`:** Chứa toàn bộ hệ thống Design System vNEXT chuẩn Brand Governance v0.1 (`tokens.css`, `base.css`, `components.css`, `layouts.css`).
- **[CONFIGURED] Thư mục `src/js/ui/`:** Chứa các module giao diện tách rời (`boot-public.js`, `view-mach.js`, `view-genealogy.js`, `view-calendar.js`, `view-archive.js`, `view-search.js`).
- **[OBSERVED] Thư mục `design-playground/`:** Chứa các bản mẫu thử nghiệm (`mirror.html`, `lab.html`).
- **[TESTED] Vibecode Lab (`lab.html`):** Đang chạy thành công trên máy chủ cục bộ (Task daemon `task-1547`, cổng 8888), hỗ trợ chuyển đổi linh hoạt 6 bề mặt giao diện bằng mock fixtures an toàn.

### 3.3. Cấu trúc Backend & API (`server/`)
- **[DOCUMENTED] `server/index.js`:** Máy chủ Express phục vụ:
  - Phục vụ tệp tĩnh (`index.html`, `src/`, `assets/`, `calendars/`).
  - `/api/genealogy.json`: Truy vấn trực tiếp từ bảng SQLite `people`, `families`, `memories`, `timeline`.
  - `/api/mach.json`: Đọc tệp tĩnh `server/data/mach.json` trên đĩa (có bộ lọc loại trừ Clara).
  - `/api/media.json` & `/api/person_media.json`: Truy vấn trực tiếp từ bảng SQLite `media` và `person_media`.
  - `/api/calendars/:filename`: Truy vấn bảng SQLite `calendar_events` (HIỆN ĐANG LỖI 404 DO BẢNG TRỐNG).
- **[DOCUMENTED] `server/member.js`:** Cổng thành viên gia tộc có xác thực (`/me/*`), kiểm tra phiên qua cookie và mã hóa bcrypt.

### 3.4. Hiện trạng Cơ sở Dữ liệu SQLite (`server/family_archive.db`)
- **[PROVEN] SHA-256 Hash:** `b3350d2e6b1aed795664d5c4fe8f688d5171c289a2ca183f247a82781bc2a30e` (Toàn vẹn tuyệt đối).
- **[TESTED] Thống kê số dòng theo từng bảng (SQLite CLI Query):**
  - `people`: **223 dòng** (Dữ liệu nhân vật gia tộc đầy đủ)
  - `families`: **68 dòng** (Quan hệ hôn nhân & phụ huynh - con cái)
  - `timeline`: **215 dòng** (Dòng sự kiện lịch sử gia đình)
  - `memories`: **2 dòng** (Ký ức công khai)
  - `media`: **185 dòng** (File ảnh/tư liệu vật lý đã index)
  - `person_media`: **173 dòng** (Liên kết ảnh - nhân vật)
  - `admin_users`: **3 dòng** (Quản trị viên)
  - `accounts`: **1 dòng** (Tài khoản thử nghiệm xác thực)
  - `identity_mappings`: **1 dòng** (Liên kết tài khoản - thực thể người)
  - `stories`: **1 dòng** (Dữ liệu mock thô sơ — **Bất đối xứng với mach.json**)
  - `calendar_events`: **0 dòng** (Hoàn toàn trống rỗng — **Lỗi đứt gãy dữ liệu**)
  - `edges`: **0 dòng** (Bảng quan hệ ReBAC chưa nạp)
  - `authorities`: **0 dòng** (Bảng phân quyền chưa nạp)

---

## 4. BẢNG ĐỐI CHIẾU PUBLIC vs LOCAL (GAP ANALYSIS)

| Tiêu chí / Bề mặt | Trạng thái Trên Public Website (`giatoctrantrongthu.com`) | Trạng thái Trong Local Repository (`localhost`) | Mức độ Lệch pha & Phân tích Nguyên nhân |
| :--- | :--- | :--- | :--- |
| **Giao diện Trang chủ (Home Shell)** | Giao diện xuất bản DESIGN-001 phong cách tạp chí di sản, thanh nhã, có đầy đủ lời mở đầu và menu dẫn tới 6 phân hệ. | Working tree uncommitted đổi `index.html` thành khung tối giản "Cổng xác thực", đẩy DESIGN-001 vào `prototype/`. | **NGHIÊM TRỌNG:** Local uncommitted làm biến mất hoàn toàn diện mạo trang chủ public. Cần khôi phục `index.html` theo chuẩn DESIGN-001 vNEXT. |
| **Phân hệ Gia phả (Genealogy)** | Hiển thị 228 nhân vật, 0 gia đình (do frontend prototype chỉ đọc mảng people từ snapshot JSON). | SQLite có 223 nhân vật, 68 gia đình. Backend `/api/genealogy.json` trả về đầy đủ quan hệ gia đình. | **TRUNG BÌNH:** Lệch 5 nhân vật (snapshot cũ 228 vs CSDL sạch 223). Public chưa render cấu trúc cây gia đình dù backend đã có. |
| **Phân hệ Ký ức MẠCH (Stories)** | Hiển thị danh mục bài viết số 01 đọc qua snapshot/API `/api/mach.json`. | Backend đọc file `server/data/mach.json` (12 bài), trong khi bảng DB `stories` chỉ có 1 bài mock. | **TRUNG BÌNH:** Giao diện hiển thị giống nhau nhưng kiến trúc ngầm ở local đang bỏ qua DB và đọc thẳng file JSON. |
| **Kho Tư liệu (Media Archive)** | Hiển thị thông báo "Đang xây dựng" do thiếu metadata ngữ nghĩa. | CSDL SQLite có 185 media records nhưng các trường mô tả, tiêu đề, ngày tháng đang để trống (`NULL`). | **TRÙNG KHỚP VỀ KHIẾM KHUYẾT:** Cả hai nơi đều mới chỉ có file hash vật lý, chưa có siêu dữ liệu biên tập. |
| **Lịch Dòng Họ (Calendar)** | Hiển thị danh sách sự kiện từ snapshot tĩnh `CAL_*.ics`. | Backend route `/api/calendars/:filename` truy vấn DB và trả về 404 vì bảng `calendar_events` có 0 dòng. | **NGHIÊM TRỌNG:** Local backend bị đứt gãy do chưa có kịch bản nạp ICS vào SQLite `calendar_events`. |
| **Tìm kiếm (Search)** | Bộ lọc client-side trên dữ liệu MẠCH và Ký ức đã tải sẵn. | Chưa có engine tìm kiếm toàn văn (FTS5) trên backend SQLite. | **TRUNG BÌNH:** Public chạy thuần in-memory JavaScript, Local chưa kích hoạt API Search backend. |
| **Bảo mật & Phân quyền (ReBAC)** | Không có backend xác thực, toàn bộ là static delivery qua CDN. | Đã xây dựng khung bảng `accounts`, `edges`, `authorities`, session auth tại `server/member.js`. | **TIẾN TRÌNH TỰ NHIÊN:** Chức năng dynamic đang được phát triển tại local, chưa đến kỳ hạn deploy production. |

---

## 5. ĐỐI SOÁT TOÀN VẸN DỮ LIỆU (DATA RECONCILIATION)

```text
       NGUỒN DỮ LIỆU TĨNH                              CƠ SỞ DỮ LIỆU SQLITE
┌──────────────────────────────┐              ┌─────────────────────────────────────┐
│ server/calendars/*.ics       │              │ table: calendar_events              │
│ (4 tệp, 265 sự kiện thực)    │ ──── X ────> │ (0 dòng — CHƯA ĐỒNG BỘ)             │
└──────────────────────────────┘              └─────────────────────────────────────┘
┌──────────────────────────────┐              ┌─────────────────────────────────────┐
│ server/data/mach.json        │              │ table: stories                      │
│ (12 bài viết xuất bản MẠCH)  │ ──── X ────> │ (1 dòng mock — CHƯA ĐỒNG BỘ)        │
└──────────────────────────────┘              └─────────────────────────────────────┘
┌──────────────────────────────┐              ┌─────────────────────────────────────┐
│ server/data/private/         │              │ Phân vùng nhạy cảm                  │
│ clara.json (8 thư riêng tư)  │ ── CÔ LẬP ─> │ (Đã bảo vệ an toàn ngoài API công)  │
└──────────────────────────────┘              └─────────────────────────────────────┘
┌──────────────────────────────┐              ┌─────────────────────────────────────┐
│ Snapshot public cũ           │              │ table: people (223 dòng)            │
│ (228 nhân vật hiển thị)      │ ── LỆCH 5 ─> │ table: families (68 dòng)           │
└──────────────────────────────┘              └─────────────────────────────────────┘
```

### 5.1. Phân tích chi tiết các đứt gãy đồng bộ:
1. **Lịch gia tộc (Calendar Ingestion Gap):**
   - **Thực tế:** Thư mục `server/calendars/` chứa 4 tệp lịch iCalendar chuẩn:
     - `CAL_01_KY_GIO.ics` (Ngày giỗ tổ tiên)
     - `CAL_02_SINH_NHAT.ics` (Ngày sinh các thành viên)
     - `CAL_03_SU_KIEN_LICH_SU.ics` (Sự kiện lịch sử dòng tộc)
     - `CAL_04_HOAT_DONG_DONG_HO.ics` (Hoạt động, giỗ chạp thường niên)
   - **Tổng số:** 265 sự kiện VEVENT.
   - **Vấn đề:** Bảng `calendar_events` trong SQLite không có bất kỳ dòng nào. Kịch bản import ICS vào SQLite chưa từng được viết hoặc chưa được chạy vào DB chính thức.
2. **Kho bài viết MẠCH (Stories Ingestion Gap):**
   - **Thực tế:** Tệp `server/data/mach.json` chứa 12 bài viết hoàn chỉnh với đầy đủ metadata biên tập (tiêu đề, tác giả, trích đoạn, nội dung, ngày xuất bản, chuyên mục).
   - **Vấn đề:** Bảng `stories` trong SQLite được tạo ra với DDL nhưng không được nạp dữ liệu từ `mach.json`. Kỹ sư backend trước đó đã dùng giải pháp tình thế: `fs.readFileSync('server/data/mach.json')` ngay trong route Express thay vì `SELECT * FROM stories`.
3. **Độ lệch nhân khẩu phả hệ (People Count Discrepancy):**
   - **Thực tế:** Snapshot tĩnh phục vụ trên public hiển thị 228 nhân vật. CSDL SQLite đã qua chuẩn hóa pháp y chứa 223 nhân vật.
   - **Nguyên nhân:** 5 bản ghi trùng lặp hoặc bản ghi rác (dangling records) không có liên kết phả hệ đã bị loại bỏ trong quá trình làm sạch CSDL tại Stage 1. SQLite hiện tại phản ánh chính xác dữ liệu gia phả hơn snapshot cũ.
4. **Siêu dữ liệu tư liệu (Media Metadata Enrichment Gap):**
   - **Thực tế:** Bảng `media` có 185 dòng tương ứng 185 file ảnh vật lý.
   - **Vấn đề:** Chỉ có các trường kỹ thuật (`id`, `file_name`, `mime_type`, `file_size`, `sha256`). Các trường ngữ nghĩa (`title`, `description`, `date_taken`, `location`, `album`) đều mang giá trị `NULL`. Do đó, cả public và local đều chưa thể dựng được thư viện ảnh có chú thích.

---

## 6. MA TRẬN TRẠNG THÁI CHUYỂN ĐỔI: TĨNH → ĐỘNG (TRANSITION STATUS MATRIX)

Hệ thống mã trạng thái:
- `[STATIC_LEGACY]`: Chức năng thuần HTML/JS tĩnh từ phiên bản cũ (Vercel).
- `[HYBRID_SNAPSHOT]`: Giao diện hiện đại nhưng đang đọc dữ liệu snapshot tĩnh nạp sẵn.
- `[DYNAMIC_LOCAL_ONLY]`: Backend động hoàn chỉnh trên SQLite/Express, mới chạy cục bộ, chưa deploy.
- `[UNIMPLEMENTED]`: Chưa có mã nguồn thực thi hoặc mới chỉ là placeholder.

| Thành phần / Phân hệ | Cơ chế Public Hiện tại | Cơ chế Local Backend | Trạng thái Chuyển đổi | Hướng xử lý đề xuất |
| :--- | :--- | :--- | :--- | :--- |
| **Khung giao diện (Layout Shell)** | [HYBRID_SNAPSHOT] Hash router đơn giản | [DYNAMIC_LOCAL_ONLY] Serve qua Express + Vibecode Lab | `[HYBRID_SNAPSHOT]` | Giữ kiến trúc SPA nhẹ nhàng, chuẩn hóa router hash để tương thích CDN. |
| **Gia phả — Danh sách (Genealogy List)** | [HYBRID_SNAPSHOT] Đọc JSON tĩnh | [DYNAMIC_LOCAL_ONLY] Endpoint `/api/genealogy.json` | `[DYNAMIC_LOCAL_ONLY]` | Đồng bộ giao diện để đọc trực tiếp từ API backend động. |
| **Gia phả — Cây tương tác (Tree View)** | [STATIC_LEGACY] Chỉ có trên bản cũ vercel.app | [UNIMPLEMENTED] Chưa tích hợp vào DESIGN-001 | `[UNIMPLEMENTED]` | Cần porting module cây tương tác từ `archive/` vào component vNEXT. |
| **Tạp chí MẠCH (Magazine)** | [HYBRID_SNAPSHOT] Đọc JSON tĩnh | [HYBRID_SNAPSHOT] Đọc `mach.json` từ đĩa | `[HYBRID_SNAPSHOT]` | Nạp dữ liệu vào bảng DB `stories`, chuyển API sang truy vấn CSDL. |
| **Lịch dòng họ (Calendar)** | [HYBRID_SNAPSHOT] Đọc tệp `.ics` trực tiếp | [DYNAMIC_LOCAL_ONLY] Route đọc DB (hiện lỗi 404) | `[UNIMPLEMENTED]` (Bị gãy) | Tạo script nạp ICS vào `calendar_events` để kích hoạt API động. |
| **Kho Tư liệu (Media Archive)** | [HYBRID_SNAPSHOT] Đọc JSON thô | [DYNAMIC_LOCAL_ONLY] Endpoint `/api/media.json` từ DB | `[DYNAMIC_LOCAL_ONLY]` | Bổ sung siêu dữ liệu biên tập cho 185 tài nguyên media. |
| **Tra cứu tìm kiếm (Search)** | [STATIC_LEGACY] Filter thô trong RAM | [UNIMPLEMENTED] Chưa cấu hình SQLite FTS5 | `[STATIC_LEGACY]` | Xây dựng API `/api/search` truy vấn toàn văn trên SQLite. |
| **Đăng nhập & Phiên (Auth Session)** | [UNIMPLEMENTED] Không có | [DYNAMIC_LOCAL_ONLY] Cookie session + bcrypt | `[DYNAMIC_LOCAL_ONLY]` | Giữ nguyên ranh giới: Công khai không cần login, chỉ login khi vào `/me`. |
| **Phân quyền quan hệ (ReBAC)** | [UNIMPLEMENTED] Không có | [DYNAMIC_LOCAL_ONLY] Đang dựng cấu trúc schema | `[DYNAMIC_LOCAL_ONLY]` | Triển khai theo lộ trình Phase 4 đã phê duyệt. |

---

## 7. ĐỐI SOÁT VỚI Ý ĐỊNH SẢN PHẨM (PRODUCT INTENT GAP ANALYSIS)

Căn cứ theo **Master Completion Plan v2.0** và **Frontend Completion Plan v2.0** do Tuấn phê duyệt:

### 7.1. Nguyên tắc "Bảo tồn diện mạo xuất bản trang trọng" (Publication Brand Preservation)
- **Ý định của Tuấn:** Website công khai của Dòng họ Trần Trọng Thu phải là một không gian văn hóa, một ấn phẩm di sản số tôn nghiêm, đẹp mắt, đậm chất văn hóa Việt Nam (theo tinh thần DESIGN-001).
- **Lệch pha phát hiện:** Việc thử nghiệm *The Dichotomy (Concept B)* tại local working tree đã vô tình biến trang chủ thành một màn hình khóa (lockscreen/login gate) khô khan, tước bỏ toàn bộ các giá trị xuất bản công khai đang chạy rất tốt trên `giatoctrantrongthu.com`.
- **Kết luận:** **BẮT BUỘC KHÔI PHỤC VÀ GIỮ VỮNG** diện mạo xuất bản của DESIGN-001 Revision làm trang chủ mặc định (`index.html`), không được biến website thành một ứng dụng đóng kín chỉ có ô đăng nhập.

### 7.2. Nguyên tắc "Phân định Nhận diện vs Tiết lộ" (Recognition vs Disclosure)
- **Ý định của Tuấn:** 
  - *Nhận diện (Recognition):* Người ngoài và con cháu đều có thể đọc lịch sử dòng họ, danh nhân tiền hiền, các thế hệ đi trước đã qua đời, các bài viết văn hóa MẠCH.
  - *Tiết lộ (Disclosure):* Thông tin đời tư, người đang sống, số điện thoại, địa chỉ, ảnh gia đình cận cảnh, và thư từ ký ức riêng tư (như Clara) BẮT BUỘC phải được bảo vệ sau cổng xác thực thành viên.
- **Hiện trạng đối soát:** 
  - Khâu cô lập thư từ Clara đã hoàn thành xuất sắc (không bị lộ trên API công khai).
  - Tuy nhiên, giao diện Gia phả công khai hiện vẫn đang hiển thị danh sách 228 người chưa qua bộ lọc người đang sống (living person filter). Cần áp dụng bộ lọc che chắn thông tin cá nhân của người còn sống ở bề mặt public.

### 7.3. Vai trò của Vibecode Lab
- **Ý định của Tuấn:** Vibecode Lab (`lab.html`) là xưởng thiết kế và tinh chỉnh giao diện cục bộ, sử dụng dữ liệu mẫu tổng hợp (mock fixtures) sạch sẽ, giúp Tuấn và nhóm phát triển duyệt trải nghiệm trực quan mà không phụ thuộc vào dữ liệu thật hay trạng thái DB.
- **Hiện trạng đối soát:** Vibecode Lab đã vận hành ổn định trên cổng 8888, độc lập hoàn toàn với backend và CSDL production. Đây là môi trường lý tưởng để hoàn thiện giao diện trước khi đưa ra `index.html`.

---

## 8. PHÂN LOẠI DANH MỤC HÀNH ĐỘNG (PRESERVE / REPAIR / RECONCILE / COMPLETE / EXTEND)

Để đưa sản phẩm về trạng thái hoàn thiện đồng bộ, các đầu việc kỹ thuật được phân loại chuẩn xác theo 5 nhóm hành động:

```text
┌────────────────────────────────────────────────────────────────────────────┐
│                    MA TRẬN HÀNH ĐỘNG ĐIỀU PHỐI (AGY)                       │
├─────────────────┬──────────────────────────────────────────────────────────┤
│ 1. PRESERVE     │ • Giao diện xuất bản DESIGN-001 và Brand Governance v0.1 │
│    (Bảo tồn)    │ • Toàn vẹn CSDL SQLite 223 nhân vật & 68 gia đình        │
│                 │ • Ranh giới cô lập tuyệt đối thư từ Clara                │
├─────────────────┼──────────────────────────────────────────────────────────┤
│ 2. REPAIR       │ • Sửa lỗi đứt gãy Lịch (nạp 265 ICS vào calendar_events) │
│    (Sửa chữa)   │ • Khôi phục index.html cục bộ về chuẩn DESIGN-001 vNEXT  │
│                 │ • Khắc phục endpoint /api/genealogy.json trên Vercel     │
├─────────────────┼──────────────────────────────────────────────────────────┤
│ 3. RECONCILE    │ • Đồng bộ bảng DB stories với file server/data/mach.json │
│    (Đối soát)   │ • Cập nhật bộ lọc người đang sống trên giao diện gia phả │
│                 │ • Khớp số liệu nhân khẩu (223 nhân vật chuẩn hóa)        │
├─────────────────┼──────────────────────────────────────────────────────────┤
│ 4. COMPLETE     │ • Bổ sung siêu dữ liệu biên tập cho 185 media assets     │
│    (Hoàn thiện) │ • Tích hợp cây phả hệ tương tác từ archive vào vNEXT     │
│                 │ • Hoàn thiện form tiếp nhận xác thực thành viên (/me)    │
├─────────────────┼──────────────────────────────────────────────────────────┤
│ 5. EXTEND       │ • Mở rộng mạng lưới cộng đồng gia đình đa họ tộc         │
│    (Mở rộng)    │ • Động cơ phân quyền ReBAC (bảng edges & authorities)    │
└─────────────────┴──────────────────────────────────────────────────────────┘
```

---

## 9. CÁC ĐIỂM CHƯA RÕ & RÀO CẢN KỸ THUẬT (CRITICAL UNKNOWNS & BLOCKERS)

### 9.1. Điểm chưa rõ (Unknowns)
- **[UNKNOWN] Cấu hình Routing trên Vercel Production:** Tệp `vercel.json` hiện tại trên repository cấu hình rewrite như thế nào đối với các request gọi về `/api/*`? Tại sao endpoint `/api/genealogy.json` trên domain chính lại bị timeout trong khi `mach.json` và `media.json` vẫn trả về bình thường?
- **[UNKNOWN] Nguồn gốc siêu dữ liệu ảnh (Media Annotations):** 185 tệp ảnh trong `assets/media/` hiện chỉ có tên file hash sha256. Có tài liệu biên tập nào bên ngoài (như sổ tay ghi chép, file Excel gia phả) ghi lại danh tính người trong ảnh và thời gian chụp hay không?

### 9.2. Rào cản (Blockers)
- **[BLOCKED] Rào cản Thao tác Cơ sở Dữ liệu (Human Gate):** AGY tuân thủ nghiêm ngặt quy chế AIOS, không tự ý chạy script chèn dữ liệu (`INSERT`) vào `server/family_archive.db` để sửa bảng `calendar_events` và `stories` khi chưa có phê duyệt kế hoạch từ Tuấn.
- **[BLOCKED] Rào cản Đồng bộ Git Working Tree:** Working tree hiện có 102 tệp uncommitted. Cần một quyết định rõ ràng từ Tuấn để dọn dẹp hoặc commit có kiểm soát các tệp audit, tránh gây xung đột mã nguồn.

---

## 10. ĐỀ XUẤT HÀNH ĐỘNG TIẾP THEO (RECOMMENDED NEXT ACTIONS)

Trình Tuấn — Human Final Authority và Emarald — Analysis Authority xem xét lộ trình xử lý tiếp theo:

1. **Bước 1 — Chuẩn hóa `index.html` cục bộ (Local Shell Reconciliation):**
   - Hủy bỏ biến thể "Khung cửa khóa tối giản" tại working tree.
   - Thiết lập `index.html` làm bản kết hợp hoàn hảo giữa diện mạo xuất bản trang trọng của DESIGN-001 và cấu trúc module CSS/JS chuẩn hóa của UI System vNEXT.
2. **Bước 2 — Chế tạo kịch bản nạp dữ liệu Lịch & Bài viết (Data Reseed Scripts):**
   - Viết kịch bản kiểm thử độc lập `scripts/ingest_calendars_to_db.mjs` để phân tích cú pháp 4 tệp ICS và nạp 265 sự kiện vào bảng SQLite `calendar_events`.
   - Viết kịch bản `scripts/sync_mach_to_db.mjs` để nạp 12 bài viết từ `mach.json` vào bảng SQLite `stories`.
   - *(Trình Tuấn phê duyệt diff trước khi thực thi vào database thật).*
3. **Bước 3 — Hoàn thiện trải nghiệm trực quan trong Vibecode Lab:**
   - Huy động Cline hỗ trợ hoàn thiện module Cây phả hệ tương tác (Interactive Pedigree Tree) trong `lab.html` bằng mock fixtures, tái hiện trọn vẹn năng lực trực quan của website static cũ.
4. **Bước 4 — Kiểm thử hợp đồng API (API Contract Verification):**
   - Chạy bộ kiểm thử tự động đảm bảo tất cả các endpoint `/api/*` trả về dữ liệu chuẩn JSON Schema đồng nhất giữa Local Express và Production CDN.

---

*Biên bản đối soát được lập hoàn toàn ở chế độ STRICT READ-ONLY, bảo toàn 100% mã nguồn và cơ sở dữ liệu hệ thống.*

