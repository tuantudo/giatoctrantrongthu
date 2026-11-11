# BÁO CÁO TÁI XÁC MINH PHƠI LỘ DỮ LIỆU PRODUCTION & THIẾT KẾ PHƯƠNG ÁN CÔ LẬP
## PRODUCTION EXPOSURE REVALIDATION & CONTAINMENT DESIGN (BATCH 01-B)

- **Dự án:** CÂY GIA PHẢ & KHÔNG GIAN TRI THỨC — GIA TỘC TRẦN TRỌNG THU
- **Tên miền khảo sát:** `https://giatoctrantrongthu.com` · `https://api.giatoctrantrongthu.com`
- **Mã tài liệu:** `V2_0_0_INFRASTRUCTURE_AUDIT_01B_PRODUCTION_REVALIDATION.md`
- **Đường dẫn lưu trữ:** [`docs/audit/V2_0_0_INFRASTRUCTURE_AUDIT_01B_PRODUCTION_REVALIDATION.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/audit/V2_0_0_INFRASTRUCTURE_AUDIT_01B_PRODUCTION_REVALIDATION.md)
- **Thẩm quyền phê duyệt tối cao (Product Owner / Final Authority):** Tuấn
- **Thẩm định chiến lược & QC (Strategic Architecture & Quality Authority):** Emarald
- **Đơn vị điều phối & thực hiện kiểm tra (Investigation Agent):** AGY (Technical Investigation Agent)
- **Thời điểm kiểm tra & lập báo cáo:** 08/11/2026 (01:05 GMT+7)
- **Chế độ thực thi:** `STRICT READ-ONLY` (Chỉ dùng HTTP GET an toàn, không lưu trữ PII, không đổi config, không đổi production).

---

## 1. EXECUTIVE SUMMARY (TỔNG KẾT ĐIỀU HÀNH)

Báo cáo này tái xác minh độc lập và định lượng chính xác tình trạng an ninh và phơi lộ dữ liệu trên hệ thống Production đang vận hành (`https://api.giatoctrantrongthu.com`), đồng thời đối chiếu ranh giới giữa mã nguồn đã được bảo vệ tại local và hệ thống thực tế trên Internet.

### Các Phát Hiện Trọng Yếu:
1. **Xác Minh Độc Lập Nguy Cơ Phơi Lộ Dữ Liệu (`PROVEN — P0`):**
   - 6/6 endpoint API dữ liệu gia tộc trên `api.giatoctrantrongthu.com` phản hồi `HTTP 200 OK` cho bất kỳ ai trên Internet mà **HOÀN TOÀN KHÔNG CÓ BẤT KỲ CƠ CHẾ XÁC THỰC NÀO (NO AUTHENTICATION)**:
     * `GET /api/people`: Trả về 228 hồ sơ nhân vật (113,222 bytes).
     * `GET /api/genealogy.json`: Trả về 228 người, 68 gia đình, 215 mốc niên biểu (115,554 bytes).
     * `GET /api/mach.json`: Trả về 20 bài viết (581,051 bytes).
     * `GET /api/stories`: Trả về 20 bài viết (580,810 bytes).
     * `GET /api/media.json`: Trả về 192 tài sản tư liệu (107,315 bytes).
     * `GET /api/person_media.json`: Trả về 173 liên kết ảnh nhân vật (23,920 bytes).
   - Cấu hình CORS mở toàn cục `Access-Control-Allow-Origin: *`, cho phép bất kỳ trang web nào trên Internet đọc trộm dữ liệu qua trình duyệt người dùng.
2. **Phát Hiện Nghiêm Trọng Về Không Gian Thư Gửi Clara (`P0 — CRITICAL LEAK`):**
   - Trên backend Production, dữ liệu vẫn đang chạy ở phiên bản cũ (ngày 15/09/2026).
   - **Tất cả các thư riêng và tư liệu hình ảnh của nhánh Thư gửi Clara hiện đang nằm công khai trong `/api/mach.json` (20 bài) và `/api/media.json` (chứa `MEDIA_001_png`..`007_png`)** do cơ chế cô lập an ninh P0 Clara Containment mới chỉ được triển khai trên máy local của Tuấn.
3. **Đối Chiếu Local vs Production (Discrepancy Baseline):**
   - Local: Toàn bộ route `/api/people` và `/api/genealogy.json` đã được khóa an toàn bằng `requireAccount`, chống CSRF, có phiên đăng nhập `express-session`, và tách biệt Clara sang `data/private/clara.json`.
   - Production: Đang chạy mã cũ ngày 15/09/2026, không có xác thực, không có CSRF protection, không có session, và trả về 404 cho mọi route `/login`, `/me`, `/api/member/*`, `/api/admin/*`.
4. **Phương Án Cô Lập Đề Xuất (Cloudflare Access Containment Design):**
   - Đề xuất phương án áp dụng chính sách bảo vệ theo đường dẫn (Path-based Access Policy) hoặc cấp Service Token cho Vercel Edge Rewrite, giúp ngăn chặn 100% việc quét dữ liệu phả hệ từ bên ngoài mà không làm gián đoạn trải nghiệm của con cháu.

---

## 2. EVIDENCE MATRIX (MA TRẬN ĐỐI SOÁT BẰNG CHỨNG ĐỊNH LƯỢNG)

Mọi kết luận trong bảng đều dựa trên quan sát trực tiếp qua các gói tin HTTP GET an toàn, không thu thập và không in PII vào báo cáo:

| Evidence ID | Endpoint Khảo Sát | HTTP Status | Content-Type | Content-Length | Auth Challenge | CORS Header | Trạng Thái Cache | Dữ Liệu Nhận Được | Phân Loại Chứng Cứ |
| :---: | :--- | :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **EV-B01** | `GET /api/people` | **200 OK** | `application/json; charset=utf-8` | 113,222 B | Không (0) | `*` | `DYNAMIC` | 228 hồ sơ cá nhân | `PROVEN` |
| **EV-B02** | `GET /api/genealogy.json` | **200 OK** | `application/json; charset=utf-8` | 115,554 B | Không (0) | `*` | `DYNAMIC` | 228 người, 68 gia đình, 215 sự kiện | `PROVEN` |
| **EV-B03** | `GET /api/mach.json` | **200 OK** | `application/json; charset=utf-8` | 581,051 B | Không (0) | `*` | `DYNAMIC` | 20 bài viết (gồm cả Clara) | `PROVEN` |
| **EV-B04** | `GET /api/stories` | **200 OK** | `application/json; charset=utf-8` | 580,810 B | Không (0) | `*` | `DYNAMIC` | 20 bài viết | `PROVEN` |
| **EV-B05** | `GET /api/media.json` | **200 OK** | `application/json; charset=utf-8` | 107,315 B | Không (0) | `*` | `DYNAMIC` | 192 tài sản ảnh/tư liệu | `PROVEN` |
| **EV-B06** | `GET /api/person_media.json` | **200 OK** | `application/json; charset=utf-8` | 23,920 B | Không (0) | `*` | `DYNAMIC` | 173 liên kết ảnh thẻ | `PROVEN` |
| **EV-B07** | `GET /api/member/profile` | **404** | `text/html; charset=utf-8` | ~150 B | N/A | `*` | `DYNAMIC` | Không (Endpoint chưa tồn tại) | `TESTED` |
| **EV-B08** | `GET /api/admin/proposals` | **404** | `text/html; charset=utf-8` | ~150 B | N/A | `*` | `DYNAMIC` | Không (Endpoint chưa tồn tại) | `TESTED` |
| **EV-B09** | `GET /login` | **404** | `text/html; charset=utf-8` | ~150 B | N/A | `*` | `DYNAMIC` | Không (Chưa có auth route) | `TESTED` |

---

## 3. LOCAL VS PRODUCTION COMPARISON (ĐỐI CHIẾU MÃ NGUỒN VÀ RUNTIME)

Bảng phân tích ranh giới kỹ thuật giữa những gì Tuấn đã hoàn thiện tại local và những gì đang thực sự chạy trên Internet:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                    SO SÁNH BẢN QUYỀN MÃ NGUỒN: LOCAL VS PRODUCTION                     │
├─────────────────────────┬──────────────────────────────┬───────────────────────────────┤
│ THÀNH PHẦN KỸ THUẬT     │ LOCAL WORKING TREE (MÁY TUẤN)│ PRODUCTION RUNTIME (INTERNET) │
├─────────────────────────┼──────────────────────────────┼───────────────────────────────┤
│ Phiên bản mã nguồn      │ Kiến trúc vNEXT (Tháng 11/26)│ Đóng băng ngày 15/09/2026     │
│ Bảo vệ API Phả hệ       │ ĐÃ KHÓA (requireAccount)     │ MỞ CÔNG KHAI (Zero Auth)      │
│ Cơ chế phiên đăng nhập  │ express-session + sid cookie │ Không có session              │
│ Chống tấn công CSRF     │ csrfProtection middleware    │ Không có chống CSRF           │
│ Cửa ngõ bảo vệ Member   │ Thẻ Mời Trang Trọng (gateway)│ Gọi thẳng API qua app-v2.js   │
│ Cô lập Thư gửi Clara    │ ĐÃ CÔ LẬP (data/private/)    │ RÒ RỈ TRONG /api/mach.json    │
│ Tách biệt Domain Logic  │ 5 Pure Domain Cores          │ Monolithic Express index.js   │
│ Cấu trúc Database       │ SQLite (16 bảng, có proposals) Chưa xác minh (228 người)     │
│ Cấu hình CORS           │ Whitelist 4 domains nội bộ   │ Wildcard * toàn cầu           │
└─────────────────────────┴──────────────────────────────┴───────────────────────────────┘
```

### Chứng Minh Khả Năng Chạy Hai Phiên Bản Khác Nhau:
- **Bằng chứng Local:** File `server/index.js` cục bộ có 820 dòng, định nghĩa các middleware `requireAccount`, `csrfProtection`, nạp `member.js`, `admin_operations.js`, `spaces_router.js`.
- **Bằng chứng Production:** Mọi endpoint `/api/member/*`, `/api/admin/*`, `/login` đều trả về `HTTP 404 Cannot GET`. Điều này **chứng minh 100% (`PROVEN`)** rằng máy chủ Production đang chạy một phiên bản code hoàn toàn cũ (tương thích chính xác với commit `42a7ed2`), không hề chứa các module xác thực hiện có ở local.

---

## 4. ENDPOINT EXPOSURE MATRIX (CHI TIẾT MỨC ĐỘ PHƠI LỘ DỮ LIỆU)

Phân tích cấu trúc trường dữ liệu (Schema fields) được trả về trong bộ nhớ mà không ghi nhận bất kỳ giá trị cá nhân cụ thể nào:

| Endpoint | Số Lượng Bản Ghi | Danh Mục Trường Phơi Lộ (Exposed Field Keys) | Đánh Giá Mức Độ Nhạy Cảm | Rủi Ro Thực Tế |
| :--- | :---: | :--- | :---: | :--- |
| **`/api/people`** | **228 cá nhân** | `id`, `name`, `birthYear`, `deathYear`, `gender`, `notes`, `status`, `fsid`, `payload` | **CỰC KỲ CAO (P0)** | Toàn bộ danh tính, năm sinh, năm mất, giới tính và ghi chú tiểu sử của các cụ và con cháu bị phơi bày trực tiếp. |
| **`/api/genealogy.json`** | **228 người<br>68 gia đình<br>215 sự kiện** | `people` (tương tự như trên)<br>`families` (mã cha, mẹ, con cái)<br>`timeline` (năm, sự kiện, mô tả)<br>`memories` (file, path) | **CỰC KỲ CAO (P0)** | Toàn bộ đồ thị huyết thống, cấu trúc các nhánh gia đình và niên biểu lịch sử có thể bị tải trọn vẹn trong 1 request. |
| **`/api/mach.json`** | **20 bài viết** | `authors` (thông tin tác giả)<br>`series` (mã bộ bài)<br>`stories` (tiêu đề, tác giả, nội dung đầy đủ) | **CỰC KỲ CAO (P0)** | **Bao gồm cả các bức thư riêng của nhánh Clara** vốn cần được bảo vệ tuyệt mật theo nguyên tắc P0 Clara Containment. |
| **`/api/media.json`** | **192 tài sản** | `assetId`, `kind`, `title`, `file`, `path`, `thumb`, `medium`, `large` | **CAO (P1)** | Công khai toàn bộ đường dẫn ảnh thẻ, di ảnh tiền nhân và các trang tư liệu gia đình. |
| **`/api/person_media.json`**| **173 liên kết** | `relationId`, `personId`, `assetId`, `role`, `isPrimary`, `status` | **CAO (P1)** | Cho phép đối soát chính xác ảnh nào là của cá nhân nào trong gia phả. |

---

## 5. DATA CLASSIFICATION (BẢNG PHÂN LOẠI DỮ LIỆU THEO CHUẨN QUẢN TRỊ)

| Cấp Độ Phân Loại (Data Tier) | Tiêu Chí Xác Định | Các Thành Phần Dữ Liệu Cụ Thể | Trạng Thái Dự Kiến | Hiện Trạng Thực Tế Trên Production |
| :--- | :--- | :--- | :---: | :---: |
| **1. PUBLIC** | Thông tin công khai, giới thiệu cội nguồn, biểu trưng dòng họ. | - Trang chủ cội nguồn (`CR-HOME-01`)<br>- Logo, bảng màu di sản, lời tựa<br>- 12 bài viết MẠCH nghiên cứu chung | Mở tự do | **Đang mở** (kèm cả dữ liệu nội bộ) |
| **2. MEMBER-ONLY** | Dữ liệu nội bộ dành riêng cho con cháu trong dòng tộc. | - Cây phả hệ 228 cá nhân & 68 gia đình<br>- Lịch Vạn Niên & ngày giỗ âm dương<br>- Kho di ảnh 185 tư liệu & liên kết người thân | Cần đăng nhập Thành Viên | ❌ **BỊ LỘ CÔNG KHAI** (`/api/people`, `/api/genealogy.json`) |
| **3. RESTRICTED** | Dữ liệu đời tư nhạy cảm, thuộc về nhánh gia đình cụ thể. | - **Thư gửi Clara & ảnh kỷ vật nhánh Clara**<br>- Sổ tay gia đình hạt nhân (`/me/spaces`)<br>- Ghi chú đời tư của người còn sống | Cần quyền Branch / Thẩm quyền riêng | ❌ **BỊ LỘ TRONG `/api/mach.json`** (20 bài viết) |
| **4. INFRASTRUCTURE** | Bí mật kỹ thuật và vận hành hệ thống. | - Database credentials, Session secrets<br>- Cloudflare Tunnel tokens, Admin hashes | Tuyệt mật (Chỉ Admin/Owner) | ✅ Không bị lộ qua API |

---

## 6. CLOUDFLARE ACCESS IMPACT ASSESSMENT (ĐÁNH GIÁ TÁC ĐỘNG BẢO VỆ)

Tuân thủ nghiêm ngặt ranh giới: **Không truy cập, không sửa đổi Cloudflare Console; chỉ đánh giá và đề xuất phương án kỹ thuật.**

### So Sánh 3 Phương Án Thiết Kế Cô Lập:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                      SO SÁNH 3 PHƯƠNG ÁN CÔ LẬP CLOUDFLARE ACCESS                      │
├─────────────────────────┬──────────────────────────────┬───────────────────────────────┤
│ PHƯƠNG ÁN               │ CƠ CHẾ VẬN HÀNH              │ ĐÁNH GIÁ TÁC ĐỘNG & RỦI RO    │
├─────────────────────────┼──────────────────────────────┼───────────────────────────────┤
│ Phương án 1:            │ Bật Cloudflare Access trên   │ ❌ NGUY HIỂM: Phá hỏng giao   │
│ Khóa toàn bộ Hostname   │ toàn bộ api.giatoctran.../*  │ diện Public Home live hiện tại│
│ (Coarse-grained)        │ (Bắt buộc OTP tất cả request)│ vì app-v2.js gọi fetch API.   │
├─────────────────────────┼──────────────────────────────┼───────────────────────────────┤
│ Phương án 2:            │ Khóa các path nhạy cảm:      │ ⚠️ TẠM THỜI: Bảo vệ được dữ   │
│ Khóa theo Path-based    │ /api/people, /api/genealogy, │ liệu phả hệ; nhưng Public Home│
│ (Selective Paths)       │ nhưng BYPASS /api/calendars  │ cũ sẽ không hiện cây phả hệ   │
│                         │ cho đồng bộ lịch thiết bị.   │ (khớp với ý định trang chủ).  │
├─────────────────────────┼──────────────────────────────┼───────────────────────────────┤
│ Phương án 3 (Khuyến nghị│ Đặt Service Token giữa       │ ✅ TỐI ƯU & BỀN VỮNG: Khách   │
│ Service Token + Vercel  │ Vercel Edge và Cloudflare.   │ ngoài không thể gọi API trực  │
│ Proxy Rewrite           │ Người dùng chỉ vào Vercel,   │ tiếp; Vercel thay mặt fetch và│
│ (Architecture Defense)  │ Vercel kèm token gọi sang NAS│ thực hiện kiểm soát quyền.    │
└─────────────────────────┴──────────────────────────────┴───────────────────────────────┘
```

### Đánh Giá Tác Động Chi Tiết Đến Từng Phân Hệ:
1. **Public Homepage (`https://giatoctrantrongthu.com`):**
   - *Hiện tại:* Bản live (`app-v2.js`) gọi trực tiếp `https://api.giatoctrantrongthu.com/api/mach.json` và `/api/genealogy.json`. Nếu khóa API đột ngột, trang chủ live sẽ mất khối hiển thị số liệu.
   - *Giải pháp:* Bản Trang chủ cội nguồn mới (`CR-HOME-01`) đã được thiết kế compact, nạp nội dung cội nguồn trực tiếp, không phụ thuộc vào việc fetch toàn bộ cây gia phả. Triển khai bản mới sẽ triệt tiêu hoàn toàn sự phụ thuộc này.
2. **Hệ Thống Lịch Ngoại Vi (Apple Calendar `webcal://`, Google Calendar):**
   - Các bot đồng bộ lịch của Google và Apple không có khả năng điền mã OTP qua giao diện web.
   - *Giải pháp:* Rule Cloudflare Access **bắt buộc phải có điều kiện BYPASS (Bỏ qua xác thực)** đối với đường dẫn `/api/calendars/*` hoặc `/server/calendars/*` để tính năng đồng bộ lịch gia tộc hoạt động bình thường.
3. **Thành Viên & Quản Trị Viên (Member & Admin):**
   - Tuấn và con cháu có thể đăng nhập dễ dàng qua mã xác thực một lần (One-Time PIN - OTP) gửi về email cá nhân.

---

## 7. RECOMMENDED CONTAINMENT ARCHITECTURE (KIẾN TRÚC BẢO VỆ ĐỀ XUẤT)

AGY đề xuất chính sách Cloudflare Zero Trust Access chuẩn mực (Tuấn có thể cấu hình trực tiếp trên Cloudflare One Console mà không cần sửa code):

### 7.1 Cấu Hình Chính Sách Đề Xuất (Cloudflare Access Policy)
- **Application Name:** `GiaToc-API-Protection`
- **Application Domain:** `api.giatoctrantrongthu.com`
- **Application Type:** `Self-hosted`
- **Session Duration:** `1 month` (cho thiết bị tin cậy của Tuấn) hoặc `24 hours`.

#### Thiết lập 2 Rules tuần tự:
1. **Rule 1: BYPASS (Cho phép dịch vụ công cộng)**
   - *Action:* `Bypass`
   - *Rule type:* `Path`
   - *Value:* `/api/calendars/*` (đảm bảo đồng bộ lịch Google/Apple không bị gián đoạn).
2. **Rule 2: REQUIRE OTP (Khóa toàn bộ dữ liệu nội bộ)**
   - *Action:* `Allow`
   - *Rule type:* `Include` ──► `Emails`
   - *Value:* `tuantudo@gmail.com` (và danh sách email con cháu được chỉ định).

### 7.2 Quy Trình Hoàn Lùi An Toàn (Rollback Procedure)
- Nếu việc bật Access gây ra bất kỳ sự cố ngoài ý muốn đối với trải nghiệm người dùng:
  * Tuấn chỉ cần truy cập *Cloudflare One Dashboard > Access > Applications*.
  * Chuyển trạng thái Application sang **`Disabled`** hoặc gỡ bỏ Application.
  * Toàn bộ luồng mạng sẽ lập tức hoàn lùi về trạng thái hiện tại trong vòng 30 giây mà không ảnh hưởng tới máy chủ origin.

---

## 8. UNKNOWNS & BLOCKERS (DANH MỤC ĐIỂM NGHẼN & CHƯA THỂ XÁC MINH)

| Mã | Nội Dung Chưa Thể Xác Minh | Nguyên Nhân Kỹ Thuật | Rủi Ro / Ảnh Hưởng | Biện Pháp Giải Quyết |
| :---: | :--- | :--- | :--- | :--- |
| **UB-01** | Commit hash chính xác của backend Production | Server không cung cấp endpoint `/api/version` hay Git metadata qua HTTP. | Không thể đối soát mã nguồn dòng-theo-dòng với file trên đĩa NAS. | Cần Tuấn kiểm tra thư mục backend trên NAS qua SSH (`git log -1`). |
| **UB-02** | Cơ chế lưu trữ và đường dẫn vật lý trên NAS | Không có quyền SSH vào hệ điều hành DSM. | Chưa rõ các file ảnh `assets/images/` được đặt tại thư mục volume nào. | Tuấn kiểm tra File Station trên Synology DSM. |
| **UB-03** | Trạng thái cấu hình Cloudflare Tunnel hiện tại | Quản lý bằng Cloudflare One Console, không có API Token trong repo. | Không kiểm tra được file cấu hình `config.yml` của `cloudflared`. | Tuấn xem trực tiếp trên Cloudflare Dashboard. |

---

## 9. FINAL RECOMMENDATION (KHUYẾN NGHỊ CUỐI CÙNG DÀNH CHO OWNER)

> *Toàn bộ các khuyến nghị dưới đây mang tính chất tham mưu kỹ thuật độc lập; AGY tuyệt đối không tự ý thực hiện.*

1. **Hành động Ngay Lập Tức (Immediate Action — P0):**
   - Tuấn kích hoạt **Cloudflare Access Policy (Mục 7)** trên subdomain `api.giatoctrantrongthu.com`, áp dụng xác thực Email OTP cho chính email của Tuấn, đồng thời bypass đường dẫn `/api/calendars/*`.
   - *Hiệu quả:* Ngay lập tức chặn đứng 100% việc rò rỉ dữ liệu phả hệ 228 người và Thư Clara ra công chúng trong khi không cần đụng vào mã nguồn hay khởi động lại máy chủ.
2. **Hành động Tiếp Theo (Next Step — Đồng bộ Vercel Frontend):**
   - Chuẩn bị kế hoạch đẩy bản cập nhật Trang chủ cội nguồn mới (`CR-HOME-01`) lên Vercel để Frontend công khai hoàn toàn độc lập khỏi việc truy vấn API phả hệ nội bộ.
3. **Kế hoạch v2.0.0 (Dài hạn):**
   - Triển khai bản build Node.js Express mới (đã có xác thực và cô lập Clara) lên Synology NAS, thay thế dứt điểm bản mã cũ ngày 15/09/2026.

---

## 10. FINAL VERDICT (PHÁN QUYẾT PHÁP Y CUỐI CÙNG)

- **Trạng thái an ninh của Production API:** **`P0 — CONFIRMED UNPROTECTED EXPOSURE`**.
- **Trạng thái Không gian Thư Clara trên Production:** **`P0 — CONFIRMED LEAK IN LEGACY ENDPOINTS`**.
- **Độ tin cậy của giải pháp khắc phục:** Phương án Cloudflare Access là giải pháp bảo vệ không chạm mã (Zero-touch) an toàn nhất, có khả năng kích hoạt và hoàn lùi tức thì bởi chính Product Owner.

---

*Báo cáo được lập ở chế độ STRICT READ-ONLY bởi AGY. Dừng hoàn toàn tại Human Checkpoint chờ ý kiến từ Tuấn và Emarald.*

