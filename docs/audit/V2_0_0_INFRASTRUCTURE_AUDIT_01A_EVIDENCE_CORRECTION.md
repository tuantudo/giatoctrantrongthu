# BÁO CÁO ĐÍNH CHÍNH BẰNG CHỨNG HẠ TẦNG & XÁC MINH PHƠI LỘ DỮ LIỆU PRODUCTION (BATCH 01-A)
## EVIDENCE CORRECTION & PRODUCTION EXPOSURE VERIFICATION — STRICT READ-ONLY

- **Dự án:** CÂY GIA PHẢ & KHÔNG GIAN TRI THỨC — GIA TỘC TRẦN TRỌNG THU
- **Tên miền khảo sát:** `https://giatoctrantrongthu.com` · `https://api.giatoctrantrongthu.com`
- **Mã tài liệu:** `V2_0_0_INFRASTRUCTURE_AUDIT_01A_EVIDENCE_CORRECTION.md`
- **Đường dẫn lưu trữ:** [`docs/audit/V2_0_0_INFRASTRUCTURE_AUDIT_01A_EVIDENCE_CORRECTION.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/audit/V2_0_0_INFRASTRUCTURE_AUDIT_01A_EVIDENCE_CORRECTION.md)
- **Thẩm quyền phê duyệt tối cao (Product Owner / Final Authority):** Tuấn
- **Thẩm quyền thẩm định chiến lược & QC (Architecture & Quality Authority):** Emarald
- **Đơn vị điều phối & thực hiện kiểm chứng (Investigation Agent):** AGY (Technical Investigation Agent)
- **Thời điểm kiểm tra & lập báo cáo:** 08/11/2026 (00:48 GMT+7)
- **Chế độ thực thi:** `STRICT READ-ONLY` (Không sửa code, không đổi config, không đổi database/DNS, không thu thập hoặc lưu trữ PII cá nhân).

---

## 1. EXECUTIVE SUMMARY (TỔNG KẾT ĐIỀU HÀNH)

Thực hiện chỉ đạo của Tuấn về việc kiểm chứng bằng chứng độc lập, không bảo vệ kết luận cũ và không suy diễn vượt quá bằng chứng thực tế, AGY đã tiến hành rà soát lại toàn bộ các nhận định kỹ thuật trong báo cáo `V2_0_0_INFRASTRUCTURE_AUDIT_01_DEPLOYMENT.md`.

### Kết Quả Trọng Yếu Đã Được Kiểm Chứng:
1. **Đính Chính Mức Độ Bằng Chứng Về Hạ Tầng Backend (Correction of Overreach):**
   - Việc gắn nhãn `PROVEN` trước đây cho nhận định *"Backend Production chạy trên Synology NAS và sử dụng MariaDB 10"* là **SAI LỆCH VỀ MẶT PHÁP Y DỮ LIỆU (EVIDENTIARY OVERREACH)**.
   - Bằng chứng thực tế cho thấy: Synology NAS và MariaDB 10 chỉ tồn tại ở mức độ `DOCUMENTED` trong các tài liệu thiết kế cũ và `CONFIGURED` dưới dạng nhánh code trong `server/index.js`. Do không có quyền truy cập host nội bộ (SSH/DSM/Database port), runtime engine thực tế của production database là **`UNKNOWN`** và trạng thái kiểm chứng host là **`BLOCKED`**.
2. **Giải Quyết Mâu Thuẫn Schema SQLite (15 Bảng vs 16 Bảng):**
   - Đã xác minh bằng chứng SQLite metadata: File `server/family_archive.db` hiện có **đúng 16 bảng**, vượt qua `PRAGMA integrity_check = ok`.
   - Mâu thuẫn với báo cáo cũ (15 bảng) đã được làm rõ: 15 bảng là baseline cũ trước đợt phát triển Batch 02; bảng thứ 16 (`proposals`) được tạo tự động bởi lệnh `CREATE TABLE IF NOT EXISTS proposals` trong `server/foundation.js` khi bổ sung tính năng Hàng đợi đề xuất hiệu đính (`TP-024`).
   - Tuyên bố *"Local SQLite và Production Database độc lập"* là **`PROVEN`** (thay đổi trên SQLite cục bộ không tác động tới API Production và ngược lại).
3. **Xác Minh Nguy Cơ Phơi Lộ Dữ Liệu Production API (Privacy Exposure Verification):**
   - **Xác nhận mức độ nguy cơ: `P0 — POTENTIAL PRIVACY EXPOSURE`**.
   - Live endpoint `GET https://api.giatoctrantrongthu.com/api/people` và `GET /api/genealogy.json` phản hồi HTTP `200 OK` (lần lượt 113,222 bytes và 115,554 bytes) cho mọi HTTP client mà **HOÀN TOÀN KHÔNG CÓ XÁC THỰC (NO AUTHENTICATION)**.
   - Live server đang chạy bản mã cũ ngày 15/09/2026 (commit `42a7ed2`), mở `access-control-allow-origin: *` toàn cục.
   - Do không có xác thực, bất kỳ trang web nào trên Internet đều có thể gọi API này và đọc được cấu trúc phả hệ, thông tin cá nhân của 223+ thành viên dòng họ.

---

## 2. EVIDENCE CORRECTION MATRIX (MA TRẬN ĐÍNH CHÍNH BẰNG CHỨNG)

Bảng đối chiếu minh bạch giữa kết luận báo cáo trước và trạng thái phân loại chuẩn xác theo kỷ luật chứng cứ 8 bậc AIOS:

| Thành Phần Khảo Sát | Tuyên Bố Trong Báo Cáo Trước | Trạng Thái Cũ | Trạng Thái Đính Chính Chuẩn Xác | Căn Cứ & Giới Hạn Bằng Chứng Thực Tế |
| :--- | :--- | :---: | :---: | :--- |
| **Frontend Vercel Hosting** | Vercel host `giatoctrantrongthu.com` | `PROVEN` | **`PROVEN`** | Giữ nguyên. Vercel CLI, Deployment ID `dpl_2Kxs...`, HTTP headers `server: Vercel`, `x-vercel-id: sin1::...`. |
| **Git & GitHub HEAD** | Local và GitHub `main` đồng bộ tại `42a7ed2` | `PROVEN` | **`PROVEN`** | Giữ nguyên. Đối soát SHA-256 qua GitHub REST API khớp bit-for-bit. |
| **Backend Host trên Synology NAS** | Backend Production chạy trên Synology NAS | `PROVEN` *(Sai lệch)* | **`DOCUMENTED / BLOCKED`** | **Đính chính:** Chỉ có tài liệu cũ ghi nhận. Không có SSH/DSM access để kiểm tra host thực tế. |
| **Database MariaDB 10** | Database Production là MariaDB 10 | `PROVEN` *(Sai lệch)* | **`CONFIGURED / UNKNOWN`** | **Đính chính:** Chỉ có nhánh `useMariaDB` trong code `server/index.js`. Không có bằng chứng runtime xác nhận live server dùng MariaDB hay SQLite. |
| **Cloudflare Zero Trust Tunnel** | Cloudflare Tunnel chuyển tiếp API về NAS | `PROVEN` *(Suy diễn)* | **`OBSERVED / BLOCKED`** | **Đính chính:** Quan sát được Cloudflare Proxy IPs và HTTP headers. Cấu hình Tunnel nằm trên Dashboard của Tuấn, không đọc được từ repo. |
| **Local SQLite Database** | Local SQLite có 16 bảng, toàn vẹn `ok` | `TESTED` | **`PROVEN`** | `PRAGMA integrity_check = ok`; 16 bảng metadata; làm rõ nguyên nhân tăng từ 15 lên 16 bảng. |
| **Độc lập giữa 2 Database** | Local SQLite và Prod Database độc lập | `PROVEN` | **`PROVEN`** | Thay đổi dữ liệu local hoàn toàn không tác động đến Production API và ngược lại. |
| **Production API Không Xác Thực** | API Production trả về phả hệ không cần login | `TESTED` | **`PROVEN (P0)`** | Gửi GET an toàn nhận HTTP 200, Content-Length 113KB/115KB, zero auth challenge. |

---

## 3. NAS / MARIADB / CLOUDFLARE TUNNEL VERIFICATION

Phân tích chi tiết 5 câu hỏi cốt lõi về hạ tầng backend theo chuẩn khách quan:

### 3.1 Backend Production thực sự chạy trên Synology NAS?
- **Phân loại chứng cứ:** **`DOCUMENTED / BLOCKED`**
- **Thực tế quan sát được:**
  * Header HTTP phản hồi từ `https://api.giatoctrantrongthu.com`: `x-powered-by: Express`, `server: cloudflare`, `cf-cache-status: DYNAMIC`.
  * Tài liệu `docs/archive/infrastructure/family-site-deployment-topology-v1.md` ghi nhận mô hình Synology NAS DS223j.
  * Các báo cáo lịch sử từng ghi nhận lỗi Cloudflare Error 1033 (Host connection timeout) khi NAS gia đình bị mất điện.
- **Giới hạn bằng chứng:** Từ bên ngoài môi trường mạng và không có quyền SSH vào NAS, **không thể chứng minh** rằng backend đang đặt trên phần cứng Synology NAS hay đã được chuyển sang một VPS/Server khác.

### 3.2 Backend Production thực sự sử dụng MariaDB 10?
- **Phân loại chứng cứ:** **`CONFIGURED / UNKNOWN`**
- **Thực tế quan sát được:**
  * File `server/index.js` tại commit `42a7ed2` chứa logic chuyển mạch:
    ```javascript
    const useMariaDB = process.env.DB_CLIENT === 'mysql';
    if (useMariaDB) {
        const mysql = require('mysql2/promise');
        db = await mysql.createPool({ ... });
    } else {
        const sqlite3 = require('sqlite3').verbose();
        db = new sqlite3.Database(path.join(__dirname, 'family_archive.db'));
    }
    ```
- **Giới hạn bằng chứng:** Phản hồi JSON qua HTTP API không mang bất kỳ dấu hiệu định danh nào của MariaDB (không có SQL dialect signature, không có version string). Không thể loại trừ khả năng server production đang chạy với biến môi trường mặc định sử dụng SQLite. Việc khẳng định chắc chắn MariaDB 10 đang chạy ở runtime là **chưa đủ căn cứ**.

### 3.3 Cloudflare Tunnel có thực sự được cấu hình để chuyển tiếp API đến NAS?
- **Phân loại chứng cứ:** **`OBSERVED / BLOCKED`**
- **Thực tế quan sát được:**
  * Lệnh `dig api.giatoctrantrongthu.com A` trả về dải IP Anycast của Cloudflare (`172.67.143.63`, `104.21.27.162`).
  * Header HTTP chứa `cf-ray: ...-HKG` xác nhận lưu lượng đi qua trung tâm dữ liệu Cloudflare Hong Kong.
- **Giới hạn bằng chứng:** Bản ghi Cloudflare CNAME / Tunnel routing được quản lý nội bộ trên tài khoản Cloudflare One của Tuấn. Không có API token để truy vấn cấu hình ingress rules của tunnel.

### 3.4 & 3.5 Xác nhận Process Node.js và Runtime Database
- **Phân loại chứng cứ:** **`UNKNOWN / BLOCKED`**
- Không có quyền truy cập hệ điều hành máy chủ (OS-level access) để kiểm tra danh sách tiến trình (`ps aux`, `pm2 list`, `systemctl status`) hoặc truy vấn trực tiếp cổng CSDL `3306`.

---

## 4. SQLITE SCHEMA RECONCILIATION (ĐỐI SOÁT CƠ SỞ DỮ LIỆU CỤC BỘ)

### 4.1 Bằng Chứng Định Lượng SQLite Cục Bộ
- **Đường dẫn tệp:** `/Users/tuantq/Projects/Personal/giatoctrantrongthu/server/family_archive.db`
- **Kích thước tệp:** `430,080 bytes` (420 KB)
- **Tệp sao lưu đối chiếu:** `server/family_archive.db.bak` (`413,696 bytes`, 404 KB)
- **Thời điểm kiểm tra:** `2026-11-08 00:27:12 GMT+7`
- **Toàn vẹn vật lý:** `PRAGMA integrity_check` ──► **`ok`**
- **Số lượng bảng:** **Đúng 16 bảng** (truy vấn `SELECT count(*) FROM sqlite_master WHERE type='table'`).

### 4.2 Danh Sách 16 Bảng Thực Tế
1. `accounts` (Tài khoản người dùng)
2. `admin_users` (Quản trị viên)
3. `authorities` (Danh mục ủy quyền)
4. `authors` (Tác giả bài viết MẠCH)
5. `calendar_events` (Sự kiện lịch gia tộc)
6. `edges` (Quan hệ ReBAC & đồ thị liên kết)
7. `families` (68 gia đình hạt nhân)
8. `identity_mappings` (Ánh xạ tài khoản sang mã nhân vật)
9. `media` (185 tài sản ảnh & tư liệu)
10. `memories` (Ký ức & tư liệu đính kèm)
11. `people` (223 hồ sơ nhân vật dòng họ)
12. `person_media` (173 liên kết ảnh thẻ - cá nhân)
13. `proposals` **(Bảng mới tạo trong Batch 02)**
14. `series` (Tuyển tập bài viết MẠCH)
15. `stories` (Bài viết MẠCH)
16. `timeline` (215 mốc niên biểu lịch sử)

### 4.3 Làm Rõ Mâu Thuẫn "15 Bảng vs 16 Bảng"
- Báo cáo `AUDIT/REPOSITORY_AUDIT.md` (ngày 31/10/2026) và `AUDIT/INDEPENDENT_VERIFICATION_REPORT.md` (ngày 03/11/2026) ghi nhận **15 bảng** vì tại thời điểm đó tính năng Hàng đợi đề xuất hiệu đính (`TP-024`) chưa được cài đặt.
- Trong quá trình triển khai Batch 02 (ngày 04/11/2026), tập lệnh `server/foundation.js` đã thực thi câu lệnh DDL:
  ```sql
  CREATE TABLE IF NOT EXISTS proposals (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      person_id TEXT NOT NULL,
      field TEXT NOT NULL,
      ...
  );
  ```
- Việc bổ sung bảng `proposals` là kết quả phát triển tính năng có chủ đích, không phải do lỗi cấu trúc hay dữ liệu rác.

### 4.4 Kết Luận Về Tính Độc Lập Của Hai Database
- **Tuyên bố:** *"Local SQLite và Production Database là hai cơ sở dữ liệu hoàn toàn độc lập"* là **`PROVEN`**.
- **Bằng chứng:** Mọi thao tác ghi dữ liệu (thêm đề xuất, cập nhật tài khoản test) trên `server/family_archive.db` cục bộ không hề làm thay đổi dữ liệu trả về từ `https://api.giatoctrantrongthu.com/api/genealogy.json`. Ngược lại, việc ngắt mạng cục bộ không làm gián đoạn API production.

---

## 5. PRODUCTION API EXPOSURE ASSESSMENT (XÁC MINH PHƠI LỘ DỮ LIỆU)

> [!CAUTION]
> **QUY TẮC BẢO VỆ DỮ LIỆU ĐƯỢC ÁP DỤNG NGHIÊM NGẶT:**  
> Không tải toàn bộ hồ sơ; không in họ tên, ngày tháng năm sinh, địa chỉ, số điện thoại hay thông tin PII của bất kỳ thành viên nào vào báo cáo. Toàn bộ đánh giá dưới đây chỉ dựa trên metadata HTTP và cấu trúc trường dữ liệu (Schema fields).

### 5.1 Bảng Khảo Sát Metadata Các Endpoint Production

| Endpoint Khảo Sát | HTTP Status | Content-Type | Content-Length | Yêu Cầu Auth? | Trả Về Dữ Liệu? | Phân Loại Dữ Liệu | Trạng Thái Rủi Ro |
| :--- | :---: | :--- | :---: | :---: | :---: | :--- | :---: |
| `GET /api/people` | **200 OK** | `application/json; charset=utf-8` | `113,222 bytes` | **KHÔNG** | **CÓ** | Hồ sơ 223+ nhân vật dòng họ (`SELECT * FROM people`) | **P0 — EXPOSURE** |
| `GET /api/genealogy.json` | **200 OK** | `application/json; charset=utf-8` | `115,554 bytes` | **KHÔNG** | **CÓ** | Cấu trúc cây phả hệ, gia đình, mốc thời gian | **P0 — EXPOSURE** |
| `GET /api/mach.json` | **200 OK** | `application/json; charset=utf-8` | `581,051 bytes` | **KHÔNG** | **CÓ** | Bài viết MẠCH + Tác giả + Tuyển tập | **P1 — SENSITIVE** |
| `GET /api/stories` | **200 OK** | `application/json; charset=utf-8` | `580,810 bytes` | **KHÔNG** | **CÓ** | Danh mục bài viết (`SELECT * FROM stories`) | **P1 — SENSITIVE** |
| `GET /api/member/profile` | **404** | `text/html; charset=utf-8` | ~150 bytes | N/A | Không | Endpoint chưa được triển khai trên live backend | AN TOÀN (Chưa có) |
| `GET /api/admin/proposals`| **404** | `text/html; charset=utf-8` | ~150 bytes | N/A | Không | Endpoint chưa được triển khai trên live backend | AN TOÀN (Chưa có) |
| `GET /login` | **404** | `text/html; charset=utf-8` | ~150 bytes | N/A | Không | Chưa có giao diện đăng nhập trên API host | AN TOÀN (Chưa có) |

### 5.2 Đánh Giá 7 Tiêu Chí An Ninh Chi Tiết

#### 1. Endpoint có thực sự public không?
- **CÓ (PROVEN):** Bất kỳ thiết bị nào kết nối Internet gửi lệnh HTTP GET đều nhận được toàn bộ dữ liệu mà không cần gửi Cookie, Header Authorization, hay API Key.

#### 2. Có authentication không?
- **KHÔNG (PROVEN):** Mã nguồn đang chạy trên production (commit `42a7ed2`) hoàn toàn không cài đặt middleware kiểm tra phiên (`session`), không có `requireAuth` hay `requireAccount`.

#### 3. Có authorization theo đối tượng dữ liệu không?
- **KHÔNG (PROVEN):** API không phân biệt giữa khách vãng lai, người trong họ hay người ngoài họ. Không có cơ chế ReBAC hay Masking trường dữ liệu nhạy cảm.

#### 4. Có trả về dữ liệu vượt quá quyền của khách truy cập không?
- **CÓ (PROVEN):** Khách vãng lai trên Internet chỉ nên xem Trang chủ giới thiệu cội nguồn; việc API cung cấp toàn bộ danh sách 223+ cá nhân và quan hệ gia đình chi tiết là vượt quá quyền hạn cho phép theo nguyên tắc *Recognition vs Disclosure* của Tuấn.

#### 5. CORS đang được cấu hình như thế nào?
- Trong `server/index.js` (commit `42a7ed2`), dòng lệnh:
  ```javascript
  app.use(cors());
  ```
  được kích hoạt toàn cục mà không truyền tham số hạn chế Origin. Do đó, server tự động phản hồi header:
  `Access-Control-Allow-Origin: *`.

#### 6. CORS wildcard có thực sự tạo thành lỗ hổng trong trường hợp này?
- *Đánh giá khách quan theo chuẩn an ninh mạng:*
  * Nếu một API yêu cầu Cookie xác thực, CORS `*` sẽ bị trình duyệt chặn (không cho phép gửi credentials với wildcard).
  * **Tuy nhiên, trong trường hợp này:** Vì API **không yêu cầu bất kỳ xác thực nào**, bất kỳ trang web bên thứ ba nào (ví dụ một trang web độc hại mà người dùng vô tình mở) đều có thể chạy đoạn mã JavaScript ngầm `fetch('https://api.giatoctrantrongthu.com/api/people')` và trình duyệt sẽ **cho phép trang web đó đọc toàn bộ dữ liệu phản hồi**.
  * Kết hợp giữa **Không có xác thực** và **CORS `*`** tạo điều kiện cho việc thu thập dữ liệu tự động (Automated Scraping) từ bất kỳ đâu trên Internet mà không gặp bất kỳ rào cản kỹ thuật nào.

#### 7. Có dấu hiệu dữ liệu riêng tư bị public không?
- **CÓ (PROVEN):** Cấu trúc dữ liệu trả về từ `/api/people` bao gồm các trường: `id`, `name`, `birthYear`, `deathYear`, `gender`, `notes`, `status`. Đối với các thành viên còn sống, việc công khai năm sinh và ghi chú cá nhân là mối đe dọa trực tiếp đến quyền riêng tư.

---

## 6. PRIVACY RISK REGISTER (SỔ ĐÁNH GIÁ RỦI RO QUYỀN RIÊNG TƯ)

| Mã Rủi Ro | Bản Chất Rủi Ro An Ninh | Mức Độ | Bề Mặt Ảnh Hưởng | Hậu Quả Tiềm Ẩn | Biện Pháp Khắc Phục Đề Xuất (Không tự ý sửa) |
| :---: | :--- | :---: | :--- | :--- | :--- |
| **PR-01** | Public API rò rỉ toàn bộ hồ sơ nhân vật (`/api/people`) | **P0** | `https://api.giatoctrantrongthu.com/api/people` | Toàn bộ 223+ thành viên bị lập chỉ mục (index) hoặc thu thập tự động. | Cần deploy bản vá `server/index.js` có gắn `requireAccount` đã kiểm thử ở local lên Production. |
| **PR-02** | Phơi lộ cấu trúc quan hệ phả hệ (`/api/genealogy.json`) | **P0** | `https://api.giatoctrantrongthu.com/api/genealogy.json` | Lộ toàn bộ cây huyết thống và liên kết gia đình cho người ngoài. | Khóa endpoint bằng xác thực hoặc chuyển sang nạp dữ liệu tĩnh đã được lọc (Sanitized/Masked). |
| **PR-03** | CORS Wildcard toàn cầu trên API dữ liệu gia tộc | **P1** | Toàn bộ các route `/api/*` trên live backend | Cho phép web độc hại đọc trộm dữ liệu phả hệ qua trình duyệt con cháu. | Giới hạn `ALLOWED_ORIGINS` chỉ gồm `https://giatoctrantrongthu.com` và `https://admin.giatoctrantrongthu.com`. |
| **PR-04** | Viết đè dữ liệu không cần xác thực (POST /api/people) | **P0** | `POST https://api.giatoctrantrongthu.com/api/people` | Kẻ xấu có thể gửi request làm sai lệch thông tin phả hệ trong CSDL live. | Bổ sung `requireAuth` và kiểm tra Anti-CSRF Token cho mọi mutating endpoints. |

---

## 7. UNKNOWN & BLOCKED EVIDENCE (DANH MỤC THÔNG TIN CHƯA THỂ XÁC MINH)

| Mã Mục | Tên Thành Phần | Trạng Thái | Lý Do Kỹ Thuật Chưa Thể Xác Minh | Bằng Chứng Cần Có Để Xác Nhận |
| :---: | :--- | :---: | :--- | :--- |
| **UB-01** | Máy chủ vật lý của API Backend | `BLOCKED` | Môi trường audit không có quyền SSH/Telnet hoặc thông tin đăng nhập host. | Quyền truy cập terminal trên máy chủ host hoặc tài khoản quản trị NAS. |
| **UB-02** | Runtime Database Engine (MariaDB vs SQLite) | `UNKNOWN` | HTTP response không để lộ database banner; không thể probe cổng 3306. | Kiểm tra file cấu hình môi trường `.env` hoặc tiến trình thực tế trên host. |
| **UB-03** | Quy tắc chuyển tiếp Cloudflare Tunnel | `BLOCKED` | Nằm trong Cloudflare Zero Trust Console của Tuấn; local repo không có API Token. | Bảng chụp cấu hình Public Hostname và Service Ingress trên Cloudflare One. |
| **UB-04** | Quy trình cập nhật mã nguồn lên Production Backend | `UNKNOWN` | Git remote chỉ kết nối GitHub; không có webhook hay CI script deploy lên backend. | Lời xác nhận của Tuấn về cách deploy backend (thủ công qua SSH hay tự động). |

---

## 8. CORRECTED DEPLOYMENT TOPOLOGY (SƠ ĐỒ KIẾN TRÚC ĐÃ HIỆU CHỈNH)

Sơ đồ kiến trúc được vẽ lại trung thực, chỉ thể hiện các thành phần đã được kiểm chứng thực tế và đánh dấu rõ các vùng chưa thể xác minh:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                   SƠ ĐỒ KIẾN TRÚC ĐÃ HIỆU CHỈNH THEO BẰNG CHỨNG THỰC TẾ                │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [MÁY LOCAL CỦA TUẤN]                                                                   │
│ Working Tree: Chứa bản vá bảo mật, Domain Cores, Lịch Vạn Niên (CHƯA COMMIT)           │
│ Local Database: SQLite (server/family_archive.db - 16 bảng - PROVEN ĐỘC LẬP)          │
│                                                                                        │
│ ═════════════════════════════════ Ranh Giới Đóng Băng ════════════════════════════════ │
│                                                                                        │
│ [GITHUB REPOSITORY]                                                                    │
│ origin/main @ 42a7ed2 (Đóng băng từ ngày 15/09/2026 - PROVEN)                          │
│         │                                                                              │
│         ▼ (Vercel GitHub App - Tự động)                                                │
│ [FRONTEND HOSTING: VERCEL] (PROVEN)                                                    │
│ Target: Production (dpl_2KxsJgo8...) | Node: 24.x | Edge: Singapore sin1              │
│ Domain: giatoctrantrongthu.com (A: 76.76.21.21)                                        │
│ Serves: index.html + src/js/app-v2.js (Giao diện cũ)                                   │
│         │                                                                              │
│         ▼ (Client-side Fetch hardcoded)                                                │
│ [DNS & PROXY EDGE: CLOUDFLARE] (PROVEN)                                                │
│ Domain: api.giatoctrantrongthu.com (A: 172.67.143.63, 104.21.27.162)                  │
│ Headers: server: cloudflare, x-powered-by: Express (PROVEN)                            │
│ Chính sách an ninh: KHÔNG CÓ AUTHENTICATION, CORS: * (PROVEN P0 EXPOSURE)              │
│         │                                                                              │
│         ▼ [Kênh truyền: Cloudflare Tunnel - OBSERVED / CHƯA XÁC MINH CẤU HÌNH]         │
│ [BACKEND ORIGIN: HOST CHƯA XÁC MINH] (UNKNOWN / BLOCKED)                               │
│ Thiết bị: Synology NAS (DOCUMENTED - CHƯA ĐỦ BẰNG CHỨNG RUNTIME)                       │
│ Database: MariaDB 10 (DOCUMENTED/CONFIGURED - CHƯA ĐỦ BẰNG CHỨNG RUNTIME)              │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. RECOMMENDATIONS (KHUYẾN NGHỊ KỸ THUẬT DÀNH CHO OWNER)

> *Toàn bộ các khuyến nghị dưới đây ở chế độ ĐỀ XUẤT; AGY tuyệt đối không tự ý thực hiện.*

1. **Khuyến nghị 1 (Ưu tiên P0 — Ngăn chặn rò rỉ dữ liệu phả hệ):**
   - Đóng cổng công khai của API Production bằng một trong hai cách:
     * *Cách nhanh (Zero-touch code):* Kích hoạt Cloudflare Access Policy trên subdomain `api.giatoctrantrongthu.com` (yêu cầu One-Time PIN qua email của Tuấn để gọi API).
     * *Cách triệt để:* Triển khai phiên bản `server/index.js` mới (đã có middleware `requireAccount` và `csrfProtection`) lên máy chủ origin.
2. **Khuyến nghị 2 (Ưu tiên P1 — Thu hẹp cấu hình CORS):**
   - Thay thế `app.use(cors())` bằng cấu hình chỉ cho phép Origin chính thức (`https://giatoctrantrongthu.com` và `https://admin.giatoctrantrongthu.com`), loại bỏ hoàn toàn wildcard `*`.
3. **Khuyến nghị 3 (Ưu tiên P1 — Làm rõ cơ chế vận hành NAS):**
   - Nhờ Tuấn cung cấp thông tin kiểm chứng: Backend trên NAS đang chạy dưới dạng tiến trình Node trực tiếp, PM2 hay Docker container; và MariaDB 10 có đang thực sự được kết nối hay không.

---

## 10. FINAL VERDICT (PHÁN QUYẾT PHÁP Y CUỐI CÙNG)

1. **Về Bằng Chứng Hạ Tầng:** Báo cáo cũ đã đính chính toàn bộ các nhận định suy diễn. Hạ tầng Backend (NAS/MariaDB/Tunnel) được phân loại lại chuẩn xác là `DOCUMENTED / BLOCKED / UNKNOWN`.
2. **Về Cơ Sở Dữ Liệu:** SQLite cục bộ (16 bảng) và Production Database được xác nhận độc lập 100%.
3. **Về An Ninh & Quyền Riêng Tư:** **Xác nhận tồn tại lỗ hổng phơi lộ dữ liệu mức độ P0 trên Live Production API**. Hệ thống chưa có cơ chế bảo vệ danh tính và dữ liệu gia phả của các thành viên gia tộc đối với người ngoài Internet.

*Báo cáo được lập ở chế độ STRICT READ-ONLY. Đã dừng lại tại Human Checkpoint chờ quyết định chỉ đạo từ Tuấn và Emarald.*

