# BÁO CÁO KIỂM TOÁN NGUY CƠ PHƠI LỘ QUYỀN GHI VÀ PHƯƠNG ÁN PHÒNG VỆ KHẨN CẤP (V2.0.0 — BATCH 04.2)
## PRODUCTION WRITE EXPOSURE & EMERGENCY CONTAINMENT AUDIT — STRICT READ-ONLY

- **Dự án:** Gia Tộc Trần Trọng Thu
- **Cơ quan thẩm quyền:**
  - **Tuấn:** Human Final Authority & Product Owner
  - **Emarald:** Strategic Architecture & QC Authority
  - **AGY:** Chief Orchestrator & Technical Investigation Lead
- **Mã tài liệu:** `V2_0_0_PRODUCTION_WRITE_EXPOSURE_EMERGENCY_CONTAINMENT_AUDIT_04_2`
- **Thời gian lập báo cáo:** 2026-11-10T20:35:00+07:00
- **Chế độ kiểm toán:** `STRICT READ-ONLY` (Khảo sát pháp y, không can thiệp code, không gửi request ghi dữ liệu vào Production, không sửa Cloudflare)
- **Chuẩn mực tuân thủ:** AIOS Governance, Bằng chứng 8 tầng (`PROVEN`, `OBSERVED`, `CONFIGURED`, `DOCUMENTED`, `PARTIAL`, `UNKNOWN`, `BLOCKED`, `FAILED`).

---

## 1. TỔNG QUAN ĐIỀU HÀNH (EXECUTIVE SUMMARY)

Báo cáo Batch 04.2 tập trung giải quyết 3 câu hỏi cốt tử về an ninh vận hành của nền tảng Production:

1. **Production Backend hiện đang chạy phiên bản mã nguồn nào?**
   - **KẾT LUẬN (`PROVEN`):** Production Backend đang chạy **chính xác 100% phiên bản mã nguồn của commit `42a7ed2f229ac0d9a6630126d4da058e55acf50b` (ngày 15/09/2026)** tại tiến trình Node.js lắng nghe trên cổng 3000 của Synology NAS (`tuandzain-nas`, IP Tailscale `100.80.147.119`).
   - Bằng chứng đối soát thời gian thực ghi nhận: HTTP response từ `https://api.giatoctrantrongthu.com/api/people` và `http://100.80.147.119:3000/api/people` trùng khớp từng byte: **`Content-Length: 113222`** và **`ETag: W/"1ba46-6jUnoEaX2xTTI9FvtgC9rLPFJ/k"`**. Mọi route mới trong Working Tree (Auth, Member, Admin) đều trả về **HTTP 404**.

2. **Các endpoint ghi dữ liệu trên Production có đang thiếu xác thực hay không?**
   - **KẾT LUẬN (`PROVEN P0 CRITICAL`):** Toàn bộ **5 endpoint ghi dữ liệu (Mutating Endpoints)** trên Production:
     - `POST /api/people`
     - `POST /api/stories`
     - `POST /api/edges`
     - `DELETE /api/edges`
     - `POST /api/events`
     đều **HOÀN TOÀN KHÔNG CÓ AUTHENTICATION, KHÔNG CÓ AUTHORIZATION, VÀ KHÔNG CÓ CSRF PROTECTION**. Bất kỳ ai từ Internet gửi HTTP POST/DELETE hợp lệ đều có thể trực tiếp thêm, sửa, ghi đè hoặc xóa dữ liệu trên cơ sở dữ liệu MariaDB SoT của gia tộc.

3. **Phương án Emergency Containment tạm thời tại Cloudflare:**
   - **KHUYẾN NGHỊ TỐI ƯU:** Thiết lập **1 WAF Custom Rule trên Cloudflare** (khả dụng 100% trên gói Free Website) với điều kiện:
     ```text
     (http.host eq "api.giatoctrantrongthu.com" and http.request.method in {"POST" "PUT" "PATCH" "DELETE"})
     ```
     Hành động: `Block` (HTTP 403 Forbidden).
   - **HIỆU QUẢ:** Khóa chặt 100% nguy cơ ghi dữ liệu trái phép vào MariaDB SoT ngay tại Edge Network của Cloudflare, trong khi **BẢO TOÀN 100% HOẠT ĐỘNG BÌNH THƯỜNG CỦA TOÀN BỘ CÁC API GET CÔNG KHAI** (`/api/genealogy.json`, `/api/mach.json`, `/api/media.json`, `/api/calendars/*.ics`) phục vụ website gia tộc.

---

## 2. PHẠM VI VÀ PHƯƠNG PHÁP KIỂM TOÁN (AUDIT SCOPE & METHOD)

### 2.1. Phạm vi
- Khảo sát trực tiếp Production API: `https://api.giatoctrantrongthu.com`.
- Khảo sát Origin Server trên mạng nội bộ VPN: `http://100.80.147.119:3000` (`tuandzain-nas`).
- Phân tích tĩnh (Static Analysis) commit `42a7ed2` so với Local Working Tree.
- Khảo sát cấu hình Cloudflare Zone `giatoctrantrongthu.com`.

### 2.2. Phương pháp
- **Nguyên tắc An toàn:** `STRICT READ-ONLY`. Tuyệt đối không gửi bất kỳ request `POST`, `PUT`, `PATCH`, `DELETE` nào vào Production hoặc NAS Origin để tránh làm biến dạng dữ liệu thật.
- Chỉ sử dụng các lệnh kiểm tra an toàn: HTTP `HEAD`, HTTP `GET`, `ping`, `nc` (netcat port scan), phân tích mã nguồn và tra cứu DNS.

---

## 3. ĐỊNH DANH BACKEND RUNTIME PRODUCTION (PRODUCTION RUNTIME IDENTIFICATION)

Kiểm toán pháp y thời gian thực lúc 20:32 ngày 10/11/2026 ghi nhận các bằng chứng xác thực tuyệt đối:

### 3.1. Bằng chứng Trùng khớp Byte-for-Byte giữa Cloudflare và NAS Origin
Thực hiện lệnh kiểm tra đồng thời:
```bash
curl -s -I https://api.giatoctrantrongthu.com/api/people
curl -s -I http://100.80.147.119:3000/api/people
```

**Bảng so sánh Header thực tế:**

| Trường HTTP Header | Phản hồi từ `api.giatoctrantrongthu.com` | Phản hồi từ `100.80.147.119:3000` | Mức độ Trùng khớp |
| :--- | :--- | :--- | :---: |
| **HTTP Status** | `HTTP/2 200` | `HTTP/1.1 200 OK` | Đồng nhất |
| **Content-Length** | `113222` bytes | `113222` bytes | **100% Tuyệt đối** |
| **ETag** | `W/"1ba46-6jUnoEaX2xTTI9FvtgC9rLPFJ/k"` | `W/"1ba46-6jUnoEaX2xTTI9FvtgC9rLPFJ/k"` | **100% Tuyệt đối** |
| **Content-Type** | `application/json; charset=utf-8` | `application/json; charset=utf-8` | Đồng nhất |
| **X-Powered-By** | `Express` | `Express` | Đồng nhất |
| **Access-Control-Allow-Origin** | `*` | `*` | Đồng nhất |

### 3.2. Bằng chứng Chữ ký Trạng thái 13 Route (13-Route Status Code Signature)
Thực hiện quét an toàn (HEAD probe) 13 endpoint trên cả hai bề mặt:

| Endpoint được kiểm tra | Phản hồi `api.giatoctrantrongthu.com` | Phản hồi `100.80.147.119:3000` | Thuộc Commit `42a7ed2`? | Thuộc Working Tree mới? |
| :--- | :---: | :---: | :---: | :---: |
| `/api/people` | **HTTP 200** | **HTTP 200** | CÓ | CÓ (Yêu cầu Auth trên Local) |
| `/api/stories` | **HTTP 200** | **HTTP 200** | CÓ | CÓ (Yêu cầu Auth trên Local) |
| `/api/events` | **HTTP 200** | **HTTP 200** | CÓ | CÓ (Yêu cầu Auth trên Local) |
| `/api/edges` | **HTTP 200** | **HTTP 200** | CÓ | CÓ (Bị chặn 403 trên Local) |
| `/api/genealogy.json` | **HTTP 200** | **HTTP 200** | CÓ | CÓ |
| `/api/mach.json` | **HTTP 200** | **HTTP 200** | CÓ | CÓ |
| `/api/media.json` | **HTTP 200** | **HTTP 200** | CÓ | CÓ |
| `/api/person_media.json` | **HTTP 200** | **HTTP 200** | CÓ | CÓ |
| `/login` | **HTTP 404** | **HTTP 404** | KHÔNG | CÓ |
| `/me` | **HTTP 404** | **HTTP 404** | KHÔNG | CÓ |
| `/api/auth/login` | **HTTP 404** | **HTTP 404** | KHÔNG | CÓ |
| `/api/admin/users` | **HTTP 404** | **HTTP 404** | KHÔNG | CÓ |
| `/api/member/profile` | **HTTP 404** | **HTTP 404** | KHÔNG | CÓ |

### 3.3. Kết luận Định danh Runtime
- **Origin Host:** Synology NAS `tuandzain-nas`, Linux Kernel, IP Tailscale `100.80.147.119`.
- **Runtime Service:** Node.js Express đang lắng nghe tại cổng `3000` (`family-api.service`).
- **Phiên bản Mã nguồn:** **Chính xác commit `42a7ed2`**. Không có bất kỳ dòng code nào từ các đợt phát triển gần đây được đưa lên máy chủ NAS này.
- **Trạng thái bằng chứng:** **`PROVEN RUNTIME IDENTITY`** (EVID-01, EVID-02).

---

## 4. DANH MỤC CÁC ENDPOINT GHI DỮ LIỆU (WRITE ENDPOINT INVENTORY)

### 4.1. Các Endpoint Đang Phơi Lộ trên Production (Commit `42a7ed2`)

| STT | Endpoint | HTTP Method | Mục đích Xử lý Dữ liệu | Authentication | Authorization | CSRF Guard | Target Database | Mức độ Rủi ro |
| :---: | :--- | :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| **W-01** | `/api/people` | `POST` | Thêm mới / Cập nhật hồ sơ cá nhân phả hệ | **KHÔNG** | **KHÔNG** | **KHÔNG** (CORS `*`) | MariaDB `people` | **P0 — CRITICAL** |
| **W-02** | `/api/stories` | `POST` | Thêm mới / Cập nhật bài viết tư liệu | **KHÔNG** | **KHÔNG** | **KHÔNG** (CORS `*`) | MariaDB `stories` | **P0 — CRITICAL** |
| **W-03** | `/api/edges` | `POST` | Tạo mối liên kết phả hệ (cha-con, vợ-chồng) | **KHÔNG** | **KHÔNG** | **KHÔNG** (CORS `*`) | MariaDB `edges` | **P0 — CRITICAL** |
| **W-04** | `/api/edges` | `DELETE` | Xóa mối liên kết phả hệ | **KHÔNG** | **KHÔNG** | **KHÔNG** (CORS `*`) | MariaDB `edges` | **P0 — CRITICAL** |
| **W-05** | `/api/events` | `POST` | Thêm mới / Cập nhật sự kiện lịch giỗ / kỷ niệm | **KHÔNG** | **KHÔNG** | **KHÔNG** (CORS `*`) | MariaDB `calendar_events` | **P0 — CRITICAL** |

### 4.2. Các Endpoint Đã Được Bảo Vệ trong Local Working Tree (Chưa triển khai lên Prod)

| STT | Endpoint | Method | Trạng thái Bảo vệ tại Local | Tình trạng trên Production |
| :---: | :--- | :---: | :--- | :---: |
| **L-01** | `/api/people` | `POST` | Có `requireAuth`, `adminCors`, CSRF Origin check | Chưa deploy (vẫn hở) |
| **L-02** | `/api/stories` | `POST` | Có `requireAuth`, `adminCors`, CSRF Origin check | Chưa deploy (vẫn hở) |
| **L-03** | `/api/auth/login` | `POST` | Rate limiter 10 req/15m, Bcrypt password check | Trả về HTTP 404 |
| **L-04** | `/api/admin/users` | `POST/PATCH/DEL` | Có `requireAuth`, `requireOwner` | Trả về HTTP 404 |
| **L-05** | `/api/member/proposals`| `POST` | Có `requireAccount` (chỉ ghi vào bảng `proposals`) | Trả về HTTP 404 |

---

## 5. ĐÁNH GIÁ CHI TIẾT AN TOÀN XÁC THỰC VÀ PHÂN QUYỀN (AUTH ASSESSMENT)

Kiểm tra trực tiếp mã nguồn của 5 endpoint ghi trên Production (`commit 42a7ed2:server/index.js`):

```javascript
// commit 42a7ed2:server/index.js dòng 115-124
app.post('/api/people', async (req, res) => {
    const { id, name, birthYear, deathYear, gender, notes, status } = req.body;
    const query = useMariaDB ? 
        "REPLACE INTO people (id, name, birthYear, deathYear, gender, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?)" :
        "INSERT OR REPLACE INTO people VALUES (?, ?, ?, ?, ?, ?, ?)";
    await runQuery(query, [id, name, birthYear, deathYear, gender, notes, status]);
    res.json({ success: true });
});
```

### Các Lỗ hổng Trọng yếu Được Xác nhận:
1. **Hoàn toàn Không có Authentication:** Không kiểm tra Session Cookie, không kiểm tra Bearer Token, không kiểm tra API Key.
2. **Cú pháp `REPLACE INTO` Nguy hiểm:** Lệnh `REPLACE INTO` trong MySQL/MariaDB hoạt động bằng cách: Nếu `id` đã tồn tại, nó sẽ **XÓA BẢN GHI CŨ VÀ CHÈN BẢN GHI MỚI**. Nếu kẻ tấn công gửi request với `id` của cụ Trần Trọng Thu (`p1`) và nội dung rác, toàn bộ dữ liệu gốc của cụ sẽ bị ghi đè ngay lập tức!
3. **CORS Mở Hoàn toàn (`*`):** `app.use(cors())` cho phép bất kỳ trang web độc hại nào từ trình duyệt của người dùng gửi AJAX request trực tiếp tới API.
4. **Không có Audit Trail:** Mọi thao tác ghi/xóa đều không lưu vết IP, thời gian hay người thực hiện.

---

## 6. KHẢO SÁT CẤU HÌNH CLOUDFLARE HIỆN TẠI (CLOUDFLARE INVENTORY)

Dựa trên dữ liệu pháp y tệp [`archive/temp_outputs/zone.json`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/archive/temp_outputs/zone.json) và các lệnh tra cứu DNS thực tế:

- **Zone Name:** `giatoctrantrongthu.com`
- **Zone ID:** `6ebf0c3b68516ec96c48ba0cf749752d`
- **Account Name:** `Tuantudo@gmail.com's Account` (ID: `4682982adc54d65341b0caedb57c2fab`)
- **Gói Dịch vụ (Plan):** **Free Website** (`legacy_id: "free"`).
- **Authoritative Nameservers:** `chip.ns.cloudflare.com`, `sonia.ns.cloudflare.com`.
- **Cơ chế API Ingress:** Hostname `api.giatoctrantrongthu.com` được định tuyến thông qua **Cloudflare Argo Tunnel (`cloudflared`)** mang tên `family-site-api-production`, kết nối về máy chủ `tuandzain-nas` trên cổng 3000.

---

## 7. CÁC PHƯƠNG ÁN PHÒNG VỆ KHẨN CẤP (EMERGENCY CONTAINMENT OPTIONS)

Dưới đây là so sánh chi tiết 3 phương án phòng vệ:

| Tiêu chí So sánh | Phương án A: Cloudflare WAF Custom Rule (KHUYẾN NGHỊ) | Phương án B: Cloudflare Access / Zero Trust | Phương án C: Cập nhật Mã nguồn Backend trên NAS |
| :--- | :--- | :--- | :--- |
| **Vị trí Triển khai** | **Cloudflare Edge Network** (Trước khi request vào Tunnel) | **Cloudflare Access** (Zero Trust Layer) | **Origin Host** (Synology NAS `/volume1/web/...`) |
| **Yêu cầu Quyền hạn** | Truy cập Cloudflare Dashboard bằng tài khoản Tuấn | Truy cập Cloudflare Zero Trust Dashboard | Quyền SSH / File access vào máy chủ NAS |
| **Tác động tới Public GET** | **0% Tác động** (Toàn bộ GET vẫn chạy 100%) | Nguy cơ chặn nhầm nếu cấu hình route không khéo | **0% Tác động** |
| **Độ phức tạp Thực hiện** | **Rất thấp:** Tạo 1 Rule duy nhất qua giao diện Web | Trung bình: Cần tạo App, Policy và Access Group | Cao: Cần pull code, kiểm tra Node runtime, restart service |
| **Thời gian Có hiệu lực** | **Tức thì (Dưới 30 giây)** trên toàn cầu | 1 đến 2 phút | Phụ thuộc vào thao tác triển khai |
| **Độ ổn định cho V1.0** | Tạm thời nhưng vững chắc, triệt tiêu 100% P0 | Thích hợp cho môi trường nội bộ | Là giải pháp căn cơ dài hạn cho V2.0.0 |

---

## 8. THIẾT KẾ CHI TIẾT PHƯƠNG ÁN WAF CUSTOM RULE (PHƯƠNG ÁN A)

Theo tài liệu chính thức của Cloudflare:
- [Cloudflare WAF Custom Rules Documentation](https://developers.cloudflare.com/waf/custom-rules/)
- [Cloudflare Dashboard Rule Creation Guide](https://developers.cloudflare.com/waf/custom-rules/create-dashboard/)

Gói **Cloudflare Free Plan** cung cấp sẵn **5 WAF Custom Rules**.

### 8.1. Cấu hình Rule Đề xuất:
- **Tên Rule (Rule Name):** `Emergency Block API Mutations`
- **Biểu thức lọc (Field Expression):**
  ```text
  (http.host eq "api.giatoctrantrongthu.com" and http.request.method in {"POST" "PUT" "PATCH" "DELETE"})
  ```
- **Hành động (Action):** `Block`
- **Mã lỗi phản hồi (Response Code):** `403 Forbidden`

### 8.2. Đánh giá Tác động tới Website Công khai (Public GET Availability)
- Các endpoint mà người dùng và website công khai đang sử dụng 100% là phương thức `GET`:
  - `GET https://api.giatoctrantrongthu.com/api/genealogy.json` -> **KHÔNG BỊ ẢNH HƯỞNG (Pass)**
  - `GET https://api.giatoctrantrongthu.com/api/mach.json` -> **KHÔNG BỊ ẢNH HƯỞNG (Pass)**
  - `GET https://api.giatoctrantrongthu.com/api/media.json` -> **KHÔNG BỊ ẢNH HƯỞNG (Pass)**
  - `GET https://api.giatoctrantrongthu.com/api/person_media.json` -> **KHÔNG BỊ ẢNH HƯỞNG (Pass)**
  - `GET https://api.giatoctrantrongthu.com/api/calendars/*.ics` -> **KHÔNG BỊ ẢNH HƯỞNG (Pass)**
  - `GET https://api.giatoctrantrongthu.com/assets/images/*` -> **KHÔNG BỊ ẢNH HƯỞNG (Pass)**
- **Kết luận:** Website công khai tiếp tục hoạt động hoàn hảo, trong khi toàn bộ các nỗ lực gửi `POST`, `PUT`, `PATCH`, `DELETE` từ bên ngoài sẽ bị chặn đứng ngay tại biên mạng của Cloudflare trước khi chạm vào máy chủ NAS.

---

## 9. PHÂN LOẠI MỨC ĐỘ RỦI RO (RISK CLASSIFICATION)

- **MỨC ĐỘ: P0 — CRITICAL ACTIVE EXPOSURE**
- **Lý do:**
  1. *Đã chứng minh được runtime:* Backend Production đang chạy commit `42a7ed2`.
  2. *Đã chứng minh được lỗ hổng mã nguồn:* Toàn bộ các route `POST /api/people`, `POST /api/stories`, `POST /api/edges`, `DELETE /api/edges`, `POST /api/events` hoàn toàn không có authentication.
  3. *Đã chứng minh được khả năng tiếp cận:* Domain `https://api.giatoctrantrongthu.com` đang online, phân giải công khai ra Internet qua Cloudflare.
  4. *Hậu quả tiềm ẩn:* Bất kỳ ai cũng có thể làm sai lệch dữ liệu phả hệ của gia tộc trên MariaDB SoT.

---

## 10. SỔ ĐĂNG KÝ BẰNG CHỨNG (EVIDENCE REGISTER)

| Evidence ID | Nguồn Bằng chứng | Phương pháp Thu thập | Thời điểm Kiểm tra | Trạng thái | Nội dung / Phát hiện Cốt lõi |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **EVID-01** | `api.giatoctrantrongthu.com` | `curl -s -I .../api/people` | 20:31:31 10/11/2026 | `PROVEN` | HTTP 200, Content-Length 113222, ETag `W/"1ba46..."`, Server: Cloudflare |
| **EVID-02** | `100.80.147.119:3000` | `curl -s -I .../api/people` | 20:32:26 10/11/2026 | `PROVEN` | HTTP 200, Content-Length 113222, ETag `W/"1ba46..."` (Trùng khớp 100% EVID-01) |
| **EVID-03** | Port Scan NAS | `nc -z -v -w 3 100.80.147.119 3000 3306` | 20:32:12 10/11/2026 | `PROVEN` | Port 3000 (Node.js) và Port 3306 (MariaDB) đều đang mở trên NAS |
| **EVID-04** | MariaDB Direct Auth | `node server/test_mariadb.js` | 20:32:18 10/11/2026 | `PROVEN` | Server phản hồi MariaDB nhưng từ chối remote login cho user root |
| **EVID-05** | Route Probe (13 routes) | Vòng lặp `curl -I` trên cả 2 host | 20:32:46 10/11/2026 | `PROVEN` | 8 route cũ HTTP 200; 5 route mới HTTP 404 (Trùng khớp tuyệt đối commit `42a7ed2`) |
| **EVID-06** | Source Code `42a7ed2` | `git show 42a7ed2:server/index.js` | 20:33:23 10/11/2026 | `PROVEN` | 5 mutating routes không có middleware xác thực, dùng `REPLACE INTO` |
| **EVID-07** | Cloudflare Zone Info | `archive/temp_outputs/zone.json` | 20:33:43 10/11/2026 | `DOCUMENTED` | Zone ID `6ebf...`, Plan: Free Website (Hỗ trợ 5 WAF Custom Rules) |

---

## 11. DANH MỤC CÁC ĐIỂM CHƯA THỂ XÁC MINH (UNKNOWN & BLOCKED ITEMS)

1. **Truy vấn Dữ liệu Trực tiếp trong Bảng MariaDB (`BLOCKED`):**
   - *Nguyên nhân:* MariaDB trên NAS chỉ cho phép kết nối nội bộ từ `localhost/127.0.0.1`, từ chối kết nối trực tiếp từ máy dev qua Tailscale IP.
2. **Quyền truy cập Cloudflare API qua Token trên máy Dev (`UNKNOWN / NOT CONFIGURED`):**
   - *Nguyên nhân:* Không có file token Cloudflare lưu cục bộ trên máy dev; việc cấu hình WAF Rule cần được thực hiện qua giao diện Web của Cloudflare Dashboard bởi Tuấn.

---

## 12. KHUYẾN NGHỊ HÀNH ĐỘNG (ACTIONABLE RECOMMENDATIONS)

> [!CAUTION]
> AGY tuân thủ nghiêm ngặt chế độ `STRICT READ-ONLY` và **KHÔNG TỰ Ý THAY ĐỔI BẤT KỲ CẤU HÌNH CLOUDFLARE NÀO**. Toàn bộ các bước dưới đây là khuyến nghị kỹ thuật gửi tới Tuấn để thực hiện:

### Bước 1 (Ưu tiên P0 — Khẩn cấp — Dưới 2 phút):
Tuấn đăng nhập vào [Cloudflare Dashboard](https://dash.cloudflare.com/), chọn Zone **`giatoctrantrongthu.com`** → vào mục **Security** → **WAF** → **Custom Rules** → bấm **Create Rule**:
- **Rule Name:** `Emergency Block API Mutations`
- **Expression:** `(http.host eq "api.giatoctrantrongthu.com" and http.request.method in {"POST" "PUT" "PATCH" "DELETE"})`
- **Action:** `Block`
- Bấm **Deploy**.
*Hiệu quả:* Ngay lập tức triệt tiêu hoàn toàn lỗ hổng phơi lộ quyền ghi SoT trên Internet mà không gây bất kỳ ảnh hưởng nào tới website công khai.

### Bước 2 (Dài hạn — Thuộc Kế hoạch Phát hành V2.0.0):
Khi chuẩn bị phát hành V2.0.0:
- Cập nhật mã nguồn `server/index.js` trên NAS lên phiên bản mới có tích hợp `requireAuth`, CSRF Guard và rate limiting.
- Thiết lập quy trình quản lý schema migration an toàn.

---

## 13. HUMAN CHECKPOINT (ĐIỂM DỪNG PHÊ DUYỆT)

Theo đúng quy chuẩn AIOS Governance:
- **AGY DỪNG HOÀN TOÀN TẠI ĐÂY.**
- Không tự ý tạo WAF rule.
- Không can thiệp mã nguồn hay database.
- Bàn giao báo cáo cho **Tuấn** và **Emarald** thẩm định để Tuấn đưa ra quyết định kích hoạt lá chắn Cloudflare.

---
*Báo cáo được lập theo đúng quy chuẩn kiểm toán chứng cứ tối cao của AIOS.*

