# HỆ THỐNG TRỢ GIÚP & TRI THỨC DỰ ÁN (PROJECT HELP & KNOWLEDGE SYSTEM)

> **Trạng thái:** CANONICAL / ACTIVE  
> **Cơ quan quản trị:** AGY (Execution Coordinator) & Emarald (Analysis Authority)  
> **Thẩm quyền tối cao:** Tuấn (Human Final Authority)  
> **Cập nhật:** 02/11/2026 (Đồng bộ toàn diện theo AIOS Governance Foundation)  
> **Mục đích:** *Lớp tri thức trừu tượng đầu tiên (First Layer) giúp con người và AI Agent giải đáp ngay các câu hỏi kiến trúc cốt lõi mà không cần phải thực hiện lại toàn bộ quy trình Forensic Audit.*

---

## 1. QUY TRÌNH TRA CỨU TRI THỨC (AGENT-FIRST WORKFLOW)

Mọi thành viên và AI Agent khi bắt đầu làm việc hoặc có thắc mắc kỹ thuật tuân theo quy trình chuẩn 5 bước:
1. **Tra cứu FAQ tại tài liệu này:** Kiểm tra xem câu hỏi kỹ thuật đã có lời giải đáp chuẩn hóa hay chưa.
2. **YES → Sử dụng câu trả lời:** Chú ý các nhãn nhận thức (`[PROVEN]`, `[OBSERVED]`, `[UNKNOWN]`) và tính thời điểm của bằng chứng.
3. **Tra cứu Tài liệu Quy chuẩn (SoT):** Xem [`docs/CANONICAL_DOCUMENT_REGISTRY.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/CANONICAL_DOCUMENT_REGISTRY.md) để tìm tài liệu canonical chuyên sâu cho chủ đề đó.
4. **Kiểm tra Phân quyền Thư mục:** Xem [`docs/REPOSITORY_MAP.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/REPOSITORY_MAP.md) trước khi chỉnh sửa file.
5. **Cập nhật Tri thức mới:** Khi phát hiện thêm bằng chứng thực tế sau khi kiểm thử, cập nhật lại `docs/HELP.md` để tái sử dụng.

---

## 2. HỎI ĐÁP QUY CHUẨN (CANONICAL FAQ)

### A. ĐỊNH DANH HỆ THỐNG & Ý ĐỊNH SẢN PHẨM (SYSTEM IDENTITY & PRODUCT INTENT)
**Q-SYS-001: Dự án này tên là gì và "Cây Gia Phả" đóng vai trò gì?**
- **Trả lời ngắn:** Tên thương hiệu và thực thể số của hệ thống là **GIA TỘC TRẦN TRỌNG THU**. "Cây Gia Phả" là tên dự án phần mềm và là một phân hệ cốt lõi trong toàn bộ nền tảng di sản số.
- **Trạng thái:** `[PROVEN]`
- **Căn cứ:** [`AGENTS.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AGENTS.md), [`USER.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/USER.md), `AUDIT/PRODUCT_RECONCILIATION_AUDIT.md`.

**Q-SYS-002: Tầm nhìn dài hạn của sản phẩm là gì?**
- **Trả lời ngắn:** Không dừng lại ở một dòng họ đơn lẻ; mở rộng thành **Mạng lưới các cộng đồng gia đình liên đới (Family Community Network)**, phân định triệt để giữa **Nhận diện (Xuất bản văn hóa công khai)** và **Tiết lộ (Bảo vệ đời tư sau cổng xác thực)**.
- **Trạng thái:** `[DOCUMENTED]`
- **Căn cứ:** [`docs/PRODUCT_HISTORY.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/PRODUCT_HISTORY.md), Chỉ thị của Tuấn (02/11/2026).

**Q-SYS-003: Bản chất và ranh giới giữa Di sản dòng họ, PUBLIC và MẠCH là gì?**
- **Trả lời ngắn:** Di sản dòng họ là đối tượng được lưu giữ; PUBLIC là không gian diễn ngôn hướng ra xã hội do Tuấn khởi xướng (lấy dòng họ làm điểm xuất phát để khảo sát đời sống gia đình Việt Nam); MẠCH là không gian xuất bản và suy tư văn hóa nội bộ dòng họ.
- **Trạng thái:** `[DOCUMENTED]`
- **Căn cứ:** [`docs/architecture/PUBLIC_COMMUNICATION_ARCHITECTURE_v1.0.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/architecture/PUBLIC_COMMUNICATION_ARCHITECTURE_v1.0.md).

**Q-SYS-004: Động cơ cốt lõi của Người sáng lập và nguyên tắc kể chuyện tổ tiên là gì?**
- **Trả lời ngắn:** Xuất phát từ nhu cầu cá nhân tìm lại sự thuộc về và kết nối lại thứ con cháu đáng được thừa hưởng ("tao muốn bọn nó có một nơi để thuộc về, đéo phải cảm giác mất mát giống tao"). Nguyên tắc nội dung: Đặt nhân vật trong hoàn cảnh lịch sử, không thần thánh hóa, không tô hồng, không áp đặt tiêu chuẩn thời nay, giữ nguyên nguồn gốc lời kể và tôn trọng quyền riêng tư.
- **Trạng thái:** `[DOCUMENTED]`
- **Căn cứ:** [`docs/product/FOUNDER_STORY_AND_PRODUCT_DISCOVERY_INTERVIEW.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/product/FOUNDER_STORY_AND_PRODUCT_DISCOVERY_INTERVIEW.md).

---

### B. NGUỒN CHÂN LÝ DỮ LIỆU (SOURCE OF TRUTH)
**Q-SOT-001: Cơ sở dữ liệu nào đang là Source of Truth chính thức hiện tại?**
- **Trả lời ngắn:** CSDL SQLite cục bộ [`server/family_archive.db`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/family_archive.db) (Dung lượng 413.696 bytes, Checksum SHA-256: `b3350d2e6b1aed795664d5c4fe8f688d5171c289a2ca183f247a82781bc2a30e`) là **Source of Truth duy nhất đã được kiểm toán toàn vẹn và khóa bảo vệ** (`integrity_check = ok`).
- **Trạng thái:** `[PROVEN]`
- **Ghi chú:** Đã tạo 3 bản backup vật lý an toàn trong `archive/database_backups/`. Đang chờ Tuấn duyệt **GATE-02** trước khi nạp thêm dữ liệu mới.

**Q-SOT-002: Dữ liệu phả hệ người và gia đình gồm bao nhiêu bản ghi?**
- **Trả lời ngắn:** Bảng `people` có **223 nhân vật** chuẩn hóa; bảng `families` có **68 gia đình**; bảng `timeline` có **215 sự kiện**.
- **Trạng thái:** `[PROVEN]`
- **Căn cứ:** Truy vấn thực tế `sqlite3 server/family_archive.db`.

---

### C. DỮ LIỆU ĐỨT GÃY & CẦN ĐỐI SOÁT (DATA GAPS & RECONCILIATION)
**Q-DATA-001: Vì sao API Lịch (`/api/calendars/:filename`) tại local trả về lỗi 404?**
- **Trả lời ngắn:** Do bảng `calendar_events` trong SQLite hiện có đúng **0 dòng**. Trong khi đó, 4 file ICS thực tế trong `server/calendars/` chứa **265 sự kiện**. Cần chạy script nạp ICS vào CSDL sau khi Tuấn duyệt GATE-02.
- **Trạng thái:** `[PROVEN]`
- **Căn cứ:** `AUDIT/PRODUCT_RECONCILIATION_AUDIT.md`.

**Q-DATA-002: Kho bài viết MẠCH đang lưu ở đâu?**
- **Trả lời ngắn:** Tệp tĩnh `server/data/mach.json` chứa đầy đủ 12 bài viết xuất bản; 8 bức thư nhạy cảm Clara được cô lập tuyệt đối trong `server/data/private/clara.json`. Bảng SQLite `stories` chỉ có 1 dòng mock thô sơ và sẽ được đồng bộ chính thức ở Stage 2.
- **Trạng thái:** `[PROVEN]`

**Q-DATA-003: Ranh giới phân chia giữa Admin, Database, Cấu hình và Mã nguồn được quy định thế nào?**
- **Trả lời ngắn:** Tuân thủ nghiêm ngặt 4 lớp tại [`docs/architecture/CONTENT_MANAGEMENT_ARCHITECTURE.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/architecture/CONTENT_MANAGEMENT_ARCHITECTURE.md). Tuyệt đối không hardcode văn bản truyền thông hay tiêu đề vào file `.js`. Dữ liệu quan hệ lưu trong CSDL SQLite; cấu hình hiển thị/navigation lưu trong JSON config; code chỉ đảm nhiệm dựng khung rendering và validation.
- **Trạng thái:** `[DOCUMENTED]`
- **Căn cứ:** [`docs/architecture/CONTENT_MANAGEMENT_ARCHITECTURE.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/architecture/CONTENT_MANAGEMENT_ARCHITECTURE.md).

---

### D. KIẾN TRÚC GIAO DIỆN & VIBECODE LAB
**Q-UI-001: Điểm khác biệt giữa `index.html` và `lab.html` là gì?**
- **Trả lời ngắn:** 
  - `index.html`: Cổng xuất bản chính thức của Dòng họ phục vụ công chúng và con cháu trên Internet theo phong cách tạp chí di sản DESIGN-001.
  - `lab.html`: **Vibecode Lab** chạy cục bộ tại `http://localhost:8888/lab.html`, sử dụng 100% mock fixtures sạch sẽ, là xưởng thiết kế và duyệt UI/UX độc quyền của Tuấn mà không phụ thuộc CSDL thật.
- **Trạng thái:** `[PROVEN]`
- **Căn cứ:** [`AUDIT/FRONTEND_COMPLETION_PLAN.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/FRONTEND_COMPLETION_PLAN.md).

**Q-UI-002: Bốn hash routes (`#/mach`, `#/gia-pha`, `#/lich`, `#/tim-kiem`) bản chất là gì?**
- **Trả lời ngắn:** Đây là **CÁC CỬA NGÕ / ĐIỂM MỜI XÁC THỰC TƯ CÁCH THÀNH VIÊN**. Độc giả công khai chỉ thấy thông điệp giới thiệu và nút đề nghị xác thực; tuyệt đối không tiết lộ thông tin đời tư hoặc chi tiết người đang sống khi chưa đăng nhập.
- **Trạng thái:** `[DOCUMENTED]`
- **Căn cứ:** `AUDIT/CHANGELOG_AND_SUPERSESSION_MAP.md`.

---

### E. HẠ TẦNG VÀ TRIỂN KHAI (INFRASTRUCTURE & DEPLOYMENT)
**Q-DEP-001: Website Production `giatoctrantrongthu.com` được vận hành như thế nào?**
- **Trả lời ngắn:** Vận hành trên mạng lưới Vercel Edge dưới dạng Static / Jamstack delivery. Không chạy tiến trình Node.js serverless cho Express backend.
- **Trạng thái:** `[PROVEN]`
- **Căn cứ:** Kiểm tra cấu hình `vercel.json` và phân tích live network headers.

**Q-DEP-002: Khi nào thì kết nối với Synology NAS?**
- **Trả lời ngắn:** Kết nối NAS và MariaDB 10 là mục tiêu dài hạn (Phase 6). Hiện tại môi trường sandbox cô lập không thể truy cập NAS nội bộ (`192.168.1.189`), mọi hoạt động phát triển tính năng động đều sử dụng SQLite `server/family_archive.db`.
- **Trạng thái:** `[DOCUMENTED]`

---

## 3. SỔ TAY XỬ LÝ SỰ CỐ & VẬN HÀNH (TROUBLESHOOTING RUNBOOK)

- **Lỗi cổng 8888 hoặc Vibecode Lab không phản hồi:**
  - Kiểm tra tiến trình: `node scripts/serve_lab.mjs`.
  - Nếu bị chiếm cổng: Kiểm tra task background daemon bằng lệnh `manage_task` (Action: `list`).
- **Lỗi API Trả về 404 cho sự kiện Lịch:**
  - Đây là lỗi dữ liệu đã ghi nhận (bảng `calendar_events` chưa có dữ liệu). Tránh gọi `/api/calendars/` động; sử dụng tệp tĩnh `/calendars/*.ics` trong thời gian chờ nạp DB.
- **Lỗi không đăng nhập được tài khoản thành viên (`/me/`):**
  - Kiểm tra bảng `accounts` trong SQLite (`SELECT * FROM accounts`). Mặc định hiện mới có 1 tài khoản dev thử nghiệm.
- **Muốn xem tài liệu quy chuẩn cho một phân hệ:**
  - Mở [`docs/CANONICAL_DOCUMENT_REGISTRY.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/CANONICAL_DOCUMENT_REGISTRY.md).

---
*Tài liệu thuộc hệ thống quản trị tối cao GIATOC AIOS. Được duy trì liên tục bởi AGY và Emarald.*
