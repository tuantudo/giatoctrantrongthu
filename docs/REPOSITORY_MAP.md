# BẢN ĐỒ CẤU TRÚC KHO MÃ NGUỒN (REPOSITORY ARCHITECTURE MAP)
**Hệ thống Quản trị Tri thức — CÂY GIA PHẢ / GIATỘC TRẦN TRỌNG THU**

> **Trạng thái:** CANONICAL / ACTIVE  
> **Chủ quản:** AGY (Execution Coordinator & Backend Owner)  
> **Thẩm định:** Emarald (Analysis Authority)  
> **Phê duyệt:** Tuấn (Human Final Authority)  
> **Phiên bản:** v1.0 (02/11/2026)  
> **Hệ thống nhãn nhận thức (Epistemic Tags):**  
> `[DOCUMENTED]` = Đã ghi nhận trong tài liệu quy chuẩn.  
> `[CONFIGURED]` = Đã cấu hình trong tệp hệ thống (JSON, YML, ENV).  
> `[OBSERVED]` = Đã quan sát thấy qua khảo sát tĩnh.  
> `[TESTED]` = Đã chạy thử nghiệm qua script/tool.  
> `[PROVEN]` = Đã chứng minh bằng kết quả kiểm thử định lượng / Checksum / Mã phản hồi HTTP.  
> `[PARTIAL]` = Đã triển khai một phần, chưa hoàn tất toàn bộ chuỗi.  
> `[FAILED]` = Thử nghiệm thất bại hoặc trả về lỗi.  
> `[BLOCKED]` = Bị chặn do thiếu quyền, thiếu chốt chặn hoặc dependency.  
> `[UNKNOWN]` = Chưa đủ bằng chứng để khẳng định thực tế.

---

## 1. MA TRẬN PHÂN QUYỀN SỞ HỮU THƯ MỤC (DIRECTORY OWNERSHIP MATRIX)

| Đường Dẫn Thư Mục | Chủ Sở Hữu (Owner) | Quyền Ghi (Write Permission) | Vai Trò & Trách Nhiệm Nghiệp Vụ | Trạng Thái Nhận Thức |
| :--- | :--- | :--- | :--- | :---: |
| `.agents/skills/` | AGY | AGY Only | Chứa 8 bộ kỹ năng chuẩn hóa phục vụ các luồng công việc tự động. | `[PROVEN]` |
| `.aios/` | Emarald | Read-Only đối với mọi Agent | Quy chuẩn tối cao của hệ điều hành tác nhân AIOS. | `[CONFIGURED]` |
| `.clinerules` | AGY / Emarald | AGY Only | Ranh giới thực thi và thẩm quyền của Cline. | `[CONFIGURED]` |
| `admin/` | AGY | AGY / Cline | Giao diện quản trị truyền thống (HTML/CSS/JS). | `[OBSERVED]` |
| `archive/` | AGY | AGY Only | Kho lưu trữ mã nguồn cũ và các bản sao lưu CSDL vật lý. | `[PROVEN]` |
| `assets/` | AGY | AGY Only | Tài nguyên ảnh tĩnh, logo nhận diện, tài liệu đa phương tiện. | `[CONFIGURED]` |
| `brand/` | Emarald | Read-Only (Cần Human Gate nếu sửa) | Bộ quy chuẩn nhận diện thương hiệu dòng họ (Brand Governance v0.1). | `[DOCUMENTED]` |
| `content/` | AGY | AGY Only | Nội dung bài viết Markdown (Tạp chí MẠCH). | `[CONFIGURED]` |
| `data/` | AGY | AGY Only | Dữ liệu tĩnh phục vụ CDN. | `[OBSERVED]` |
| `design-playground/` | Cline / AGY | Cline & AGY | Khu vực thử nghiệm nguyên mẫu giao diện độc lập. | `[OBSERVED]` |
| `docs/` | Emarald / AGY | AGY / Emarald | Kho tài liệu kiến trúc, UX, thiết kế, cơ sở dữ liệu. | `[DOCUMENTED]` |
| `fixtures/` | AGY | AGY Only | Dữ liệu mẫu tổng hợp (mock fixtures) cho Vibecode Lab. | `[PROVEN]` |
| `prototype/` | Cline / AGY | Cline & AGY | Bản mẫu prototype giao diện tách rời (DESIGN-001). | `[OBSERVED]` |
| `scripts/` | AGY | AGY Only | Kịch bản kiểm thử an ninh, Browser QA, nạp dữ liệu. | `[PROVEN]` |
| `server/` | AGY | **AGY ONLY (CẤM CLINE)** | Máy chủ backend Node/Express, CSDL SQLite, API và logic ReBAC. | `[PROVEN]` |
| `src/css/` | Cline / AGY | Cline & AGY | Hệ thống stylesheet giao diện Design Tokens và CSS Foundation. | `[PROVEN]` |
| `src/js/ui/` | Cline / AGY | Cline & AGY | Các module JavaScript giao diện người dùng (vNEXT Views). | `[PROVEN]` |
| `src/js/core/` | AGY | AGY Only | Các engine thuật toán lõi (Lunar calendar, ICS parsing). | `[PROVEN]` |
| `shots/` | Cline / AGY | Cline & AGY | Ảnh chụp màn hình nghiệm thu kiểm thử tự động Browser QA. | `[PROVEN]` |
| `AUDIT/` | AGY / Emarald | AGY / Emarald | Kế hoạch tổng thể, biên bản kiểm toán và hồ sơ pháp y. | `[PROVEN]` |

---

## 2. TRÁCH NHIỆM CÁC MODULE VÀ ĐIỂM KHỞI NHẬP (MODULE RESPONSIBILITIES & ENTRYPOINTS)

### 2.1. Các Điểm Khởi Nhập Hệ Thống (System Entrypoints)
1. **Public Web Shell (`index.html`):**
   - **Vị trí:** Thư mục gốc (`/index.html`).
   - **Trách nhiệm:** Điểm chạm đầu tiên của độc giả và con cháu trên Internet. Hiển thị ấn phẩm di sản trang trọng theo phong cách tạp chí DESIGN-001 kết hợp kiến trúc UI System vNEXT.
   - **Trạng thái:** `[PARTIAL]` *(Đang có xung đột giữa bản prototype hoàn chỉnh và bản uncommitted tối giản tại working tree)*.
2. **Vibecode Lab (`lab.html`):**
   - **Vị trí:** `/lab.html` (chạy trên máy chủ cục bộ cổng 8888 qua `scripts/serve_lab.mjs`).
   - **Trách nhiệm:** Môi trường duyệt thiết kế và duyệt trải nghiệm độc lập, sử dụng 100% mock fixtures sạch sẽ, cho phép Tuấn review và điều chỉnh UI/UX trực quan mà không phụ thuộc DB thật.
   - **Trạng thái:** `[PROVEN]` *(Task daemon `task-1547` đang chạy ổn định)*.
3. **Local Mirror (`mirror.html`):**
   - **Vị trí:** `/mirror.html` (chạy trên cổng 8888).
   - **Trách nhiệm:** Bản sao chiếu trực tiếp từ Production để đối soát sai khác giao diện.
   - **Trạng thái:** `[PROVEN]`.
4. **Member Private Space (`server/member.js`):**
   - **Vị trí:** Tuyến đường `/me/*` (`/me/dashboard`, `/me/tree`, `/me/spaces`, `/me/clara`).
   - **Trách nhiệm:** Không gian nội bộ dành cho thành viên đã xác thực danh tính, bảo vệ dữ liệu nhạy cảm theo mô hình ReBAC.
   - **Trạng thái:** `[CONFIGURED]` / `[PARTIAL]` *(Mã nguồn đã viết, đang chờ hoàn thiện Phase 4)*.
5. **Express API Server (`server/index.js`):**
   - **Vị trí:** Cổng 3000 / 8888.
   - **Trách nhiệm:** Phục vụ dữ liệu động cho Frontend:
     - `GET /api/genealogy.json` `[PROVEN]` (Truy vấn DB `people`, `families`, `memories`).
     - `GET /api/mach.json` `[PROVEN]` (Đọc tệp `server/data/mach.json`, lọc bỏ cờ Clara).
     - `GET /api/media.json` `[PROVEN]` (Truy vấn DB `media`).
     - `GET /api/calendars/:filename` `[FAILED]` (Truy vấn DB `calendar_events` hiện rỗng, trả về 404).

---

## 3. NGUỒN DỮ LIỆU VÀ LUỒNG DỮ LIỆU (DATA SOURCES & DATA FLOWS)

```text
┌────────────────────────────────────────────────────────────────────────────┐
│                             BẢN ĐỒ DỮ LIỆU                                 │
├────────────────────────────────┬───────────────────────────────────────────┤
│ NGUỒN DỮ LIỆU GỐC (RAW SOVEREIGN)│ LƯU TRỮ TRONG CSDL (DATABASE SOT)         │
├────────────────────────────────┼───────────────────────────────────────────┤
│ 1. GIADINHONGTHU.ged           │ • SQLite: server/family_archive.db        │
│    (Phả hệ FamilySearch)       │   - table people: 223 dòng                │
│    [PROVEN]                    │   - table families: 68 dòng               │
│                                │   - table timeline: 215 dòng              │
│                                │   [PROVEN Checksum: b3350d2...]           │
├────────────────────────────────┼───────────────────────────────────────────┤
│ 2. server/calendars/*.ics      │ • table calendar_events: 0 DÒNG           │
│    (4 tệp, 265 sự kiện)        │   [FAILED] (Đứt gãy luồng nạp dữ liệu,    │
│    [PROVEN]                    │   cần script ingest_calendars_to_db)      │
├────────────────────────────────┼───────────────────────────────────────────┤
│ 3. content/mach/*.md           │ • server/data/mach.json (12 bài xuất bản) │
│    (Bài viết tạp chí MẠCH)     │ • table stories: 1 DÒNG MOCK              │
│    [PROVEN]                    │   [PARTIAL] (Cần script nạp vào SQLite)   │
├────────────────────────────────┼───────────────────────────────────────────┤
│ 4. Thư riêng tư Clara          │ • server/data/private/clara.json (8 thư)  │
│    (Tài liệu nhạy cảm)         │   [PROVEN] (Cô lập hoàn toàn khỏi API công│
│    [PROVEN]                    │   khai, chỉ đọc trong /me/clara)          │
├────────────────────────────────┼───────────────────────────────────────────┤
│ 5. assets/media/* (185 ảnh)    │ • table media: 185 dòng (Hash vật lý)     │
│    [PROVEN]                    │ • table person_media: 173 liên kết        │
│                                │   [PARTIAL] (Thiếu metadata biên tập ảnh) │
└────────────────────────────────┴───────────────────────────────────────────┘
```

---

## 4. MÔI TRƯỜNG THỰC THI VÀ HẠ TẦNG TRIỂN KHAI (ENVIRONMENTS & TOPOLOGY)

1. **Môi trường Production Live (`giatoctrantrongthu.com`):**
   - **Hạ tầng:** Vercel Global Edge Network.
   - **Bản chất thực thi:** Pure Static / Jamstack Delivery.
   - **Trạng thái:** `[PROVEN]` (HTTP 200 OK, phục vụ DESIGN-001 Revision).
   - **Ranh giới:** Không chạy tiến trình Node.js nền; đọc dữ liệu từ các snapshot JSON/ICS được deploy cùng mã nguồn.
2. **Môi trường Staging / Local Mirror (`localhost:8888/mirror.html`):**
   - **Hạ tầng:** Node.js Express cục bộ (`scripts/serve_lab.mjs`).
   - **Mục đích:** Đối soát tương đương 1:1 với website Production đang chạy.
   - **Trạng thái:** `[PROVEN]`.
3. **Môi trường Thiết kế Vibecode Lab (`localhost:8888/lab.html`):**
   - **Hạ tầng:** Node.js Express cục bộ với mock adapter cô lập.
   - **Mục đích:** Xưởng thiết kế, kiểm thử tương tác và duyệt UI/UX của Tuấn.
   - **Trạng thái:** `[PROVEN]`.
4. **Môi trường Tích hợp CSDL Động (`server/index.js` trên cổng 3000):**
   - **Hạ tầng:** Node.js Express kết nối SQLite `server/family_archive.db`.
   - **Mục đích:** Phát triển chức năng thành viên `/me`, tìm kiếm toàn văn và logic phân quyền ReBAC.
   - **Trạng thái:** `[TESTED]` cục bộ.
5. **Môi trường Mục tiêu Synology NAS (MariaDB 10):**
   - **Hạ tầng:** Máy chủ vật lý Synology NAS (`192.168.1.189`).
   - **Trạng thái nhận thức:** `[DOCUMENTED]` nhưng hiện tại `[BLOCKED]` trong môi trường sandbox cô lập. Toàn bộ logic CSDL hiện tập trung bảo toàn trên SQLite cục bộ.

---
*Bản đồ cấu trúc được duy trì bởi AGY. Mọi thay đổi thư mục hoặc module phải được cập nhật đồng bộ vào tài liệu này.*

