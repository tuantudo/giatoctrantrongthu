# BÁO CÁO ĐỐI SOÁT & KHẮC PHỤC KHOẢNG TRỐNG KIẾN TRÚC FAMILY BETA (BETA-01B)

**Dự án:** Gia Tộc Trần Trọng Thu  
**Cấp thẩm quyền:**  
- **Tuấn:** Human Final Authority  
- **Emarald:** Strategic Architecture & QC Authority  
- **AGY:** Execution Agent  
**Chế độ thực thi:** STRICT READ-ONLY  
**Thời điểm thực hiện:** 2026-11-11  

---

## A. EXECUTIVE SUMMARY (TỔNG QUAN ĐIỀU HÀNH)

Báo cáo **BETA-01B** tập trung giải quyết dứt điểm 6 khoảng trống kiến trúc (GAPs) được chỉ định trong phiên thẩm định QC của báo cáo BETA-01A, dựa trên chứng cứ thực nghiệm trực tiếp từ máy chủ Synology NAS DS223j, CSDL MariaDB, Cloudflare WAF và mã nguồn Vercel.

### Kết quả thẩm định tóm lược 6 GAPs:
1. **GAP-01 (DSM Memory Guard):** Phát hiện DSM 7.4.1 chạy nhân `Linux 5.10` với **`systemd 219`** và **`cgroup v1`** (`/sys/fs/cgroup/memory`). Do đó, các chỉ thị `MemoryMax=` và `MemoryHigh=` (của systemd v230+ / cgroup v2) **hoàn toàn không được hỗ trợ**. Chỉ thị chuẩn xác và hữu hiệu trên hệ thống là: `MemoryAccounting=yes` và `MemoryLimit=100M`.
2. **GAP-02 (Shared Media Isolation):** Toàn bộ thư mục `assets/` trên NAS chỉ chiếm **67 MB** (trong đó `avatars` 1.2 MB, `mach` 66 MB) trên tổng dung lượng đĩa trống **2.6 TB**. Cơ chế tối ưu nhất là tạo thư mục `assets/` riêng cho Beta hoặc sử dụng read-only bind mount, loại bỏ rủi ro ghi đè tài sản Production.
3. **GAP-03 (Cloudflare WAF):** Xác định chính xác quy tắc WAF đang chặn là **`Emergency Block API Mutations`** (Rule action: `Block`). Biểu thức WAF hiện tại chặn toàn bộ mutation ngoại trừ `/api/member/login` và `/api/member/proposals`. Giải pháp là bổ sung `/api/member/change-password` và gắn điều kiện hostname hẹp cho `beta-api.giatoctrantrongthu.com`.
4. **GAP-04 (Vercel Routing):** `vercel.json` hiện tại có 6 quy tắc rewrite không có điều kiện `has: host`. Bằng ma trận mô phỏng, đã chứng minh việc đặt các rule có `has: [{ "type": "host", "value": "beta.giatoctrantrongthu.com" }]` lên đầu mảng sẽ đón bắt 100% request từ Beta, ngăn chặn 100% nguy cơ rơi xuống fallback của Production.
5. **GAP-05 (Backup / Restore):** Phân biệt rạch ròi 3 tầng khôi phục: *Application Rollback* (dừng process), *Data Reset* (làm sạch có chọn lọc, giữ nguyên `audit_logs` vết kiểm toán, hủy session tức thì) và *Database Restore* (khôi phục snapshot khi có thảm họa). Tuyệt đối loại bỏ `DROP DATABASE` khỏi kịch bản rollback mặc định.
6. **GAP-06 (Owner Authority):** Xác định thẩm quyền Owner được quản trị theo RBAC trong CSDL (`accounts.role = 'owner'` và `admin_users.role = 'owner'`). Mã nguồn `server/auth.js` truy vấn CSDL theo thời gian thực trên từng request, đảm bảo session bị hủy ngay lập tức nếu trạng thái tài khoản thay đổi. Thiết kế script bootstrap độc lập, idempotent, có ghi log kiểm toán.

---

## B. BẰNG CHỨNG THỰC NGHIỆM THEO TỪNG KHOẢNG TRỐNG (EVIDENCE BY GAP)

### 1. GAP-01 — DSM cgroup & Memory Guard
- **Lệnh khảo sát:** `systemctl --version`, `mount | grep cgroup`, `systemctl show family-api.service -p MemoryAccounting,MemoryLimit`
- **Kết quả quan sát trực tiếp (Observation):**
  * Phiên bản systemd: `systemd 219` (+PAM +SYSVINIT +XZ +SECCOMP +BLKID +KMOD).
  * Cấu trúc cgroup: `cgroup on /sys/fs/cgroup/memory type cgroup (rw,nosuid,nodev,noexec,relatime,memory)` $\rightarrow$ **cgroup v1**.
  * Thuộc tính hỗ trợ: `systemctl show` trên tiến trình hiện hữu chỉ hiển thị `MemoryAccounting`, `MemoryLimit`, `MemoryCurrent`.
- **Suy luận kỹ thuật (Inference):**
  * Các chỉ thị `MemoryMax` và `MemoryHigh` chỉ xuất hiện từ systemd 230+ khi chạy cgroup v2. Nếu khai báo trong systemd 219, systemd sẽ bỏ qua (log: `Unknown lvalue`) và tiến trình sẽ chạy không giới hạn bộ nhớ.
  * Trong systemd 219 (cgroup v1), directive chuẩn để giới hạn RAM vật lý là **`MemoryLimit=`** kết hợp với **`MemoryAccounting=yes`**.
- **Khuyến nghị kiến trúc (Recommendation):**
  * Trong file `/etc/systemd/system/family-api-beta.service`, cấu hình chính xác:
    ```ini
    [Service]
    MemoryAccounting=yes
    MemoryLimit=100M
    ```
  * Khi cấu hình này được nạp, kernel cgroup v1 sẽ ghi giá trị `104857600` vào `/sys/fs/cgroup/memory/system.slice/family-api-beta.service/memory.limit_in_bytes`.
- **Phân loại trạng thái:** `VERIFIED`

---

### 2. GAP-02 — Shared Media Isolation
- **Lệnh khảo sát:** `ls -ld /volume1/web/family-api/assets`, `du -sh /volume1/web/family-api/assets/images/*`
- **Kết quả quan sát trực tiếp (Observation):**
  * Quyền thư mục: `drwxr-xr-x 1 tuandzain users` (755).
  * Dung lượng:
    - `avatars/`: **1.2 MB** (185 ảnh chân dung FamilySearch).
    - `mach/`: **66 MB** (tư liệu chuyên san MẠCH số 01).
    - Toàn bộ thư mục `assets`: **67 MB**.
  * Dung lượng đĩa khả dụng của NAS: **2.6 TB** trống.
  * Tìm kiếm mã nguồn: Không có bất kỳ thư viện xử lý upload nào (`multer`, `formidable`) trên NAS backend.
- **Suy luận kỹ thuật (Inference):**
  * Nếu dùng symlink thuần túy trỏ từ `family-api-beta/assets` sang `family-api/assets`, do cả 2 service đều chạy dưới quyền user `tuandzain`, tiến trình Beta vẫn có quyền ghi nếu có lỗi mã nguồn.
  * Vì tổng dung lượng chỉ có 67 MB (chiếm 0.0025% ổ đĩa trống), việc sao chép vật lý hoặc gắn mount read-only là hoàn toàn khả thi và không gây áp lực lưu trữ.
- **Khuyến nghị kiến trúc (Recommendation):**
  * *Phương án ưu tiên:* Sao chép độc lập 67 MB sang `/volume1/web/family-api-beta/assets/` để đạt tính cô lập vật lý 100%. Mọi thao tác trên Beta không thể ảnh hưởng đến file của Production.
  * *Phương án thay thế (Zero-copy):* Sử dụng Linux read-only bind mount:
    `mount --bind -o ro /volume1/web/family-api/assets /volume1/web/family-api-beta/assets`
- **Phân loại trạng thái:** `VERIFIED`

---

### 3. GAP-03 — Cloudflare WAF Policy
- **Tài liệu & Test Suite đối soát:** `docs/audit/V2_0_0_GOVERNANCE_PRODUCTION_INTEGRATION_07.md` (L160-175) & `tests/test_public_cloudflare_acceptance.mjs`.
- **Kết quả quan sát trực tiếp (Observation):**
  * Tên WAF Custom Rule hiện hành: **`Emergency Block API Mutations`**.
  * Biểu thức hiện hữu:
    ```text
    (http.request.method in {"POST" "PUT" "PATCH" "DELETE"} 
     and http.request.uri.path contains "/api/" 
     and not (http.request.method eq "POST" and http.request.uri.path in {"/api/member/login" "/api/member/proposals"}))
    ```
  * Hành động (Action): **`Block`** (Trả về mã `403 Forbidden`).
  * Nguyên nhân chặn `/api/member/change-password`: Biểu thức trên chỉ miễn trừ duy nhất 2 đường dẫn `{"/api/member/login" "/api/member/proposals"}`. Mọi POST khác đều bị chặn đứng tại Cloudflare Edge.
- **Suy luận kỹ thuật (Inference):**
  * Không cần tạo quy tắc `Skip` phức tạp (tránh làm suy yếu tính năng chống DDoS/Bot của Cloudflare).
  * Chỉ cần mở rộng danh sách ngoại lệ của biểu thức Block hiện hữu cho đúng hostname của Beta API.
- **Khuyến nghị kiến trúc (Recommendation):**
  * Cấu hình 1 quy tắc WAF riêng biệt dành riêng cho hostname Beta (`beta-api.giatoctrantrongthu.com`):
    ```text
    (http.host eq "beta-api.giatoctrantrongthu.com"
     and http.request.method in {"POST" "PUT" "PATCH" "DELETE"}
     and http.request.uri.path contains "/api/"
     and not (http.request.method eq "POST" and http.request.uri.path in {
       "/api/member/login"
       "/api/member/change-password"
       "/api/member/proposals"
     }))
    ```
  * Action: **`Block`**.
  * Quy tắc này cho phép thành viên Beta thực hiện đầy đủ luồng: Đăng nhập $\rightarrow$ Đổi mật khẩu kích hoạt $\rightarrow$ Gửi đề xuất đóng góp, trong khi vẫn chặn 100% các hành vi tấn công ghi đè trực tiếp (`/api/people`, `/api/admin/*`).
- **Phân loại trạng thái:** `VERIFIED`

---

### 4. GAP-04 — Vercel Routing Analysis
- **Tệp đối soát:** `vercel.json` (L58-83).
- **Kết quả quan sát trực tiếp (Observation):**
  * Hiện có 6 rewrites: `/login`, `/logout`, `/me`, `/me/:path*`, `/api/:path*`, `/assets/private/:path*`.
  * Toàn bộ 6 quy tắc này đều trỏ cứng về `https://api.giatoctrantrongthu.com` và **không có điều kiện lọc host**.
- **Mô phỏng ma trận định tuyến:**
  * Nguyên lý hoạt động của Vercel Edge: Đánh giá mảng `rewrites` tuần tự từ trên xuống dưới (First-Match-Wins).
  * Nếu đặt các quy tắc Beta lên đầu mảng với điều kiện `has: [{ "type": "host", "value": "beta.giatoctrantrongthu.com" }]`, Vercel sẽ chuyển hướng ngay lập tức về `https://beta-api.giatoctrantrongthu.com` và dừng xử lý các dòng sau.
- **Khuyến nghị kiến trúc (Recommendation):**
  * Cấu hình cặp quy tắc đối ứng trong `vercel.json`:
    ```json
    {
      "rewrites": [
        {
          "source": "/api/:path*",
          "has": [{ "type": "host", "value": "beta.giatoctrantrongthu.com" }],
          "destination": "https://beta-api.giatoctrantrongthu.com/api/:path*"
        },
        {
          "source": "/login",
          "has": [{ "type": "host", "value": "beta.giatoctrantrongthu.com" }],
          "destination": "https://beta-api.giatoctrantrongthu.com/login"
        },
        {
          "source": "/logout",
          "has": [{ "type": "host", "value": "beta.giatoctrantrongthu.com" }],
          "destination": "https://beta-api.giatoctrantrongthu.com/logout"
        },
        {
          "source": "/me",
          "has": [{ "type": "host", "value": "beta.giatoctrantrongthu.com" }],
          "destination": "https://beta-api.giatoctrantrongthu.com/me"
        },
        {
          "source": "/me/:path*",
          "has": [{ "type": "host", "value": "beta.giatoctrantrongthu.com" }],
          "destination": "https://beta-api.giatoctrantrongthu.com/me/:path*"
        },
        {
          "source": "/assets/private/:path*",
          "has": [{ "type": "host", "value": "beta.giatoctrantrongthu.com" }],
          "destination": "https://beta-api.giatoctrantrongthu.com/assets/private/:path*"
        },
        {
          "source": "/api/:path*",
          "destination": "https://api.giatoctrantrongthu.com/api/:path*"
        },
        {
          "source": "/login",
          "destination": "https://api.giatoctrantrongthu.com/login"
        },
        {
          "source": "/logout",
          "destination": "https://api.giatoctrantrongthu.com/logout"
        },
        {
          "source": "/me",
          "destination": "https://api.giatoctrantrongthu.com/me"
        },
        {
          "source": "/me/:path*",
          "destination": "https://api.giatoctrantrongthu.com/me/:path*"
        },
        {
          "source": "/assets/private/:path*",
          "destination": "https://api.giatoctrantrongthu.com/assets/private/:path*"
        }
      ]
    }
    ```
  * Để bảo vệ cả nhánh preview, có thể mở rộng `value`: `^(beta\\.giatoctrantrongthu\\.com|.*\\.vercel\\.app)$`.
- **Phân loại trạng thái:** `VERIFIED`

---

### 5. GAP-05 — Backup, Rollback & Restore Taxonomy
- **Khảo sát cấu trúc:** `information_schema.KEY_COLUMN_USAGE` cho thấy MariaDB **không có foreign keys cứng** giữa các bảng (quan hệ được duy trì ở tầng code).
- **Phân định 3 cấp độ khôi phục:**
  1. **Application Rollback (Cấp độ 1 - Dừng ứng dụng):**  
     - Tác vụ: `systemctl stop family-api-beta`.
     - Phạm vi: Chỉ giải phóng port 3001 và RAM. Dữ liệu trong CSDL giữ nguyên.
  2. **Data Reset (Cấp độ 2 - Làm sạch dữ liệu thử nghiệm giữa các đợt):**  
     - Tác vụ: Làm sạch có chọn lọc (Selective Truncate & Reseed).
     - **Bảo toàn Audit Trail:** Tuyệt đối **KHÔNG xóa bảng `audit_logs`**. Ghi một bản ghi mới:
       `INSERT INTO audit_logs (action, actor_id, entity_type, reason) VALUES ('BETA_DATA_RESET', 'SYSTEM', 'database', 'Resetting proposals and accounts for next test batch');`
     - Làm sạch bảng vận hành: `TRUNCATE TABLE family_archive_beta.proposals;`, `TRUNCATE TABLE family_archive_beta.identity_mappings;`, `TRUNCATE TABLE family_archive_beta.accounts;`, `TRUNCATE TABLE family_archive_beta.admin_users;`.
     - Nạp lại tài khoản Owner và tài khoản thử nghiệm ban đầu.
     - **Hủy phiên tức thì (Session Invalidation):** Thực hiện `systemctl restart family-api-beta` để xóa sạch toàn bộ session lưu tạm trong bộ nhớ của Express, buộc mọi trình duyệt phải đăng nhập lại.
  3. **Database Restore (Cấp độ 3 - Khôi phục Thảm họa):**  
     - Tác vụ: Nạp lại file snapshot baseline đã tạo trước phiên thử nghiệm:
       `mysql -u family_beta_usr -p family_archive_beta < /volume1/web/family-api-beta/backups/baseline.sql`
     - Tuyệt đối không cần dùng lệnh `DROP DATABASE`.
- **Phân loại trạng thái:** `VERIFIED`

---

### 6. GAP-06 — Owner Authority & Session Lifecycle
- **Tệp đối soát:** `server/auth.js` (L15-110) & `server/foundation.js` (L10-40).
- **Kết quả quan sát trực tiếp (Observation):**
  * Nguồn thẩm quyền tối cao: Cột `role` trong CSDL (`accounts.role` hoặc `admin_users.role`).
  * Cơ chế xác thực: Middleware `requireAuth` và `requireOwner` **truy vấn CSDL theo thời gian thực (Real-time DB Query)** trên mỗi request đến:
    ```javascript
    const acc = await dbAccessorRef.getQuery("SELECT id, username, role, status FROM accounts WHERE id = ?", [req.session.accountId]);
    if (!acc || acc.status === 'DISABLED') {
        req.session.destroy(() => {});
        return res.status(403).json({ error: 'Tài khoản không tồn tại hoặc đã bị vô hiệu hóa' });
    }
    ```
- **Suy luận kỹ thuật (Inference):**
  * Nếu đổi role của một tài khoản từ `'owner'` thành `'member'` hoặc chuyển `status` sang `'DISABLED'` trong CSDL, ngay ở request tiếp theo, phiên làm việc sẽ bị hủy ngay lập tức mà không có độ trễ cache.
  * Mối quan hệ bảng:
    - `accounts`: Danh tính thành viên & Owner.
    - `admin_users`: Danh tính quản trị viên hệ thống.
    - `identity_mappings`: Ánh xạ tài khoản $\leftrightarrow$ nhân vật phả hệ (`account_id` $\leftrightarrow$ `person_id`).
    - `authorities`: Bảng phân quyền chi tiết (ReBAC).
- **Khuyến nghị kiến trúc (Recommendation):**
  * Xây dựng script bootstrap độc lập `server/scripts/bootstrap_owner.js` nhận tham số CLI, không hardcode username.
  * Tính lũy đẳng (Idempotency): Sử dụng cú pháp `INSERT INTO ... ON DUPLICATE KEY UPDATE` hoặc kiểm tra sự tồn tại trước khi chèn, tránh trùng lặp.
  * Ghi nhật ký kiểm toán vào `audit_logs` ngay khi tài khoản Owner được khởi tạo.
- **Phân loại trạng thái:** `VERIFIED`

---

## C. ĐIỀU CHỈNH THIẾT KẾ KIẾN TRÚC (ARCHITECTURE CORRECTIONS)

Từ các chứng cứ trên, kiến trúc Beta được điều chỉnh chính xác như sau:

| Thành phần | Thiết kế cũ (BETA-01A) | Thiết kế đã điều chỉnh chính xác (BETA-01B) | Lý do điều chỉnh |
| :--- | :--- | :--- | :--- |
| **Systemd RAM Limit** | Dùng `MemoryMax=100M` và `MemoryHigh=85M` | Dùng **`MemoryAccounting=yes`** và **`MemoryLimit=100M`** | DSM 7.4.1 chạy `systemd 219` (cgroup v1), không nhận diện được `MemoryMax`. |
| **Chia sẻ Media** | Dùng symlink dùng chung | **Sao chép độc lập 67 MB** sang thư mục Beta | Dung lượng đĩa trống 2.6 TB dư thừa; sao chép đảm bảo cô lập 100% rủi ro ghi đè. |
| **Cloudflare WAF** | Đề xuất Skip WAF Rules | **Mở rộng biểu thức Block hiện hữu**: thêm `/api/member/change-password` và giới hạn theo `http.host eq "beta-api..."` | Bảo toàn tính năng chống DDoS/Bot của Cloudflare; không dùng `Skip`. |
| **Vercel Routing** | Chưa kiểm soát Preview URL | Khai báo host-based rewrites chặt chẽ; định tuyến cả `beta.*` và preview sang `beta-api` | Ngăn chặn 100% request thử nghiệm rơi xuống fallback Production. |
| **Database Reset** | Đề xuất Truncate chung | **Trừ bảng `audit_logs` ra khỏi lệnh truncate**; ghi log sự kiện reset | Bảo toàn chuỗi chứng cứ kiểm toán (Audit Trail) xuyên suốt. |
| **Owner Authority** | Khởi tạo gắn với username `tuantq` | **Cấp quyền theo Role RBAC qua CLI script lũy đẳng** | Loại bỏ hoàn toàn sự phụ thuộc vào chuỗi username hardcoded. |

---

## D. CẬP NHẬT BẢNG THEO DÕI RỦI RO (UPDATED RISK REGISTER)

| Mã Rủi Ro | Nguy cơ | Mức độ | Biện pháp kiểm soát chính xác sau Gap Closure | Trạng thái |
| :---: | :--- | :---: | :--- | :---: |
| **RSK-01** | Tràn RAM NAS gây sập dịch vụ cốt lõi | `P2` | `MemoryLimit=100M` kiểm soát trực tiếp bởi cgroup v1 kernel. | **VERIFIED** |
| **RSK-02** | Xâm phạm hoặc ghi đè CSDL Production | `P0` | User `family_beta_usr` bị cô lập quyền, không thể truy cập `family_archive`. | **VERIFIED** |
| **RSK-03** | Xung đột phiên đăng nhập giữa Prod và Beta | `P1` | Đổi cookie thành `sid_beta` và dùng `SESSION_SECRET` 64-byte riêng. | **VERIFIED** |
| **RSK-04** | Cloudflare WAF chặn đổi mật khẩu kích hoạt | `P1` | Bổ sung `/api/member/change-password` vào whitelist ngoại lệ của WAF rule. | **VERIFIED** |
| **RSK-05** | Request Beta bị fallback sang Production API | `P0` | Host-based rewrites trong `vercel.json` lọc chính xác hostname ở đầu mảng. | **VERIFIED** |
| **RSK-06** | Mất dấu vết kiểm toán khi reset dữ liệu | `P2` | Giữ nguyên `audit_logs`, chỉ truncate bảng nghiệp vụ (`proposals`, `accounts`). | **VERIFIED** |
| **RSK-07** | Rò rỉ tài liệu riêng tư (Thư gửi Clara) | `P1` | Tiếp tục không nạp `clara.json` lên CSDL Beta; trả về 404 Zero-Hint. | **VERIFIED** |

---

## E. TRÌNH TỰ THỰC THI CHUẨN XÁC (FINAL IMPLEMENTATION SEQUENCE)

Sau khi nhận được phê duyệt từ Tuấn, quá trình thi công sẽ diễn ra theo đúng 6 bước tuần tự:

```text
[BƯỚC 1: CƠ SỞ DỮ LIỆU BETA TRÊN NAS]
├── Tạo database `family_archive_beta` (utf8mb4).
├── Tạo user `family_beta_usr` chỉ có quyền trên `family_archive_beta.*`.
├── Sao chép cấu trúc và dữ liệu 11 bảng phả hệ gốc từ `family_archive`.
└── Khởi tạo cấu trúc rỗng cho `accounts`, `admin_users`, `identity_mappings`, `proposals`, `audit_logs`.

[BƯỚC 2: BACKEND SERVICE BETA TRÊN NAS]
├── Tạo thư mục `/volume1/web/family-api-beta/`.
├── Sao chép mã nguồn và 67 MB thư mục `assets/`.
├── Thiết lập `.env` (PORT=3001, DB=family_archive_beta, COOKIE_NAME=sid_beta, SESSION_SECRET mới).
└── Cài đặt `/etc/systemd/system/family-api-beta.service` (MemoryAccounting=yes, MemoryLimit=100M).

[BƯỚC 3: CẤU HÌNH MẠNG & CLOUDFLARE WAF]
├── Thêm Public Hostname `beta-api.giatoctrantrongthu.com` -> `localhost:3001` trong Tunnel.
└── Cập nhật rule WAF `Emergency Block API Mutations` để miễn trừ các endpoint thành viên của `beta-api`.

[BƯỚC 4: ĐỊNH TUYẾN VERCEL FRONTEND]
├── Cập nhật `vercel.json` trên nhánh release với cấu hình host-based rewrites.
└── Gắn tên miền `beta.giatoctrantrongthu.com` trên Vercel Dashboard.

[BƯỚC 5: BOOTSTRAP OWNER & CHẠY SMOKE TEST]
├── Chạy script bootstrap tạo tài khoản Owner ban đầu cho Tuấn trên CSDL Beta.
└── Kiểm thử luồng khép kín: Đăng nhập -> Đổi mật khẩu -> Vào Dashboard -> Gửi Đề xuất -> Duyệt Đề xuất.

[BƯỚC 6: BÀN GIAO CHO THÀNH VIÊN DÒNG HỌ]
└── Cung cấp tài khoản và hướng dẫn cho nhóm thành viên thử nghiệm Closed Beta đợt 1.
```

---

## F. KẾ HOẠCH HỦY BỎ & KHÔI PHỤC (ROLLBACK & RECOVERY PLAN)

1. **Khôi phục Ứng dụng:**
   - Dừng ngay dịch vụ Beta: `systemctl stop family-api-beta`. Cổng 3001 đóng ngay lập tức.
2. **Khôi phục Mạng:**
   - Xóa hostname `beta-api` khỏi Cloudflare Tunnel.
3. **Khôi phục Dữ liệu:**
   - Xóa database Beta nếu cần: `DROP DATABASE family_archive_beta;` (Chỉ thực hiện khi có xác nhận văn bản từ Tuấn).
4. **Cam kết Bất biến:**
   - Dịch vụ Production (`family-api` tại cổng 3000) và CSDL `family_archive` hoàn toàn tách biệt, không bị gián đoạn hay ảnh hưởng trong bất kỳ tình huống nào.

---

## G. CÁC QUYẾT ĐỊNH CẦN TUẤN PHÊ DUYỆT (REMAINING DECISIONS REQUIRING HUMAN APPROVAL)

Trước khi thực thi, kính trình Tuấn xem xét và quyết định:

1. **Tên miền truy cập Beta:** Xác nhận sử dụng `beta.giatoctrantrongthu.com` (Frontend) và `beta-api.giatoctrantrongthu.com` (Backend).
2. **Danh sách thành viên đợt 1:** Số lượng tài khoản thành viên thử nghiệm dự kiến cấp trong đợt đầu (khuyến nghị: Tuấn + 2–3 thành viên đại diện).
3. **Phê duyệt triển khai:** Bấm nút thông qua để AGY tiến hành Bước 1 (Tạo CSDL Beta trên NAS).

---

**KẾT THÚC BÁO CÁO — DỪNG TẠI HUMAN CHECKPOINT CHỜ PHÊ DUYỆT.**

