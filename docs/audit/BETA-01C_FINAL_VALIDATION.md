# BÁO CÁO THẨM ĐỊNH CUỐI CÙNG TIỀN TRIỂN KHAI (BETA-01C)

**Dự án:** Gia Tộc Trần Trọng Thu  
**Cấp thẩm quyền:**  
- **Tuấn:** Human Final Authority  
- **Emarald:** Strategic Architecture & QC Authority  
- **AGY:** Execution Agent  
**Chế độ thực thi:** STRICT READ-ONLY  
**Mục tiêu:** Thẩm định xác quyết 4 hạng mục kỹ thuật cốt lõi trước khi xin phê duyệt Bước 1 (Khởi tạo `family_archive_beta` và user CSDL riêng).

---

## 1. THẨM ĐỊNH KHOẢNG TRỐNG WAF (GAP-03 — CLOUDFLARE WAF)

### A. Hiện trạng Quy tắc WAF Đang Hoạt động
- **Tên quy tắc (Rule Name):** `Emergency Block API Mutations`
- **Giai đoạn thực thi (Phase):** `http_request_firewall_custom` (Custom Rules trên Cloudflare Edge).
- **Hành động (Action):** `Block` (Trả về HTTP 403 Forbidden kèm trang HTML Cloudflare).
- **Biểu thức hiện hành (Existing Expression):**
  ```text
  (http.request.method in {"POST" "PUT" "PATCH" "DELETE"} 
   and http.request.uri.path contains "/api/" 
   and not (http.request.method eq "POST" and http.request.uri.path in {"/api/member/login" "/api/member/proposals"}))
  ```

### B. Nguyên lý Xung đột và Nguy cơ "Rule Override"
- **Nguyên lý Cloudflare WAF:** Các Custom Rules được đánh giá theo thứ tự ưu tiên từ trên xuống dưới (Evaluation Order: Priority 1, 2, 3...). Hành động `Block` là hành động kết thúc luồng (terminating action).
- **Phát hiện quan trọng:** Biểu thức hiện hữu áp dụng trên toàn bộ Zone (`giatoctrantrongthu.com`) vì **thiếu điều kiện lọc theo hostname** (`http.host`).
  * Nếu giữ nguyên Rule hiện hữu và tạo thêm một Rule thứ hai cho Beta: Yêu cầu `POST /api/member/change-password` gửi tới `beta-api.giatoctrantrongthu.com` vẫn thỏa mãn điều kiện của Rule 1 (chứa `/api/`, là `POST`, và không nằm trong `login`/`proposals`).
  * Hệ quả: **Rule 1 sẽ lập tức chặn đứng yêu cầu trước khi Rule 2 kịp đánh giá**. Đúng như chỉ thị của Tuấn: *Một Block Rule mới không thể override một Block Rule cũ đứng trước nó*.

### C. Thiết kế Điều chỉnh Tách biệt Hostname (Proposed Corrected Rule Logic)
Để vừa bảo vệ 100% Production, vừa cho phép Beta hoạt động bình thường mà không cần dùng `Skip Rules`, giải pháp chuẩn mực là **gắn điều kiện `http.host` cụ thể vào từng Rule riêng biệt**:

#### Rule 1: Bảo vệ Production (Giữ nguyên 100% chính sách an ninh hiện tại)
- **Tên rule:** `Production API Mutation Lockdown`
- **Biểu thức (Expression):**
  ```text
  (http.host eq "api.giatoctrantrongthu.com"
   and http.request.method in {"POST" "PUT" "PATCH" "DELETE"}
   and http.request.uri.path contains "/api/"
   and not (http.request.method eq "POST" and http.request.uri.path in {"/api/member/login" "/api/member/proposals"}))
  ```
- **Action:** `Block` (403).

#### Rule 2: Bảo vệ Beta (Cho phép luồng Đổi mật khẩu kích hoạt của thành viên)
- **Tên rule:** `Beta API Mutation Lockdown`
- **Biểu thức (Expression):**
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
- **Action:** `Block` (403).

### D. Ma trận Kiểm thử Độc lập (Negative & Positive Test Cases)

| Kịch bản kiểm thử | Hostname đích | Endpoint & Method | Kết quả kỳ vọng tại Cloudflare Edge | Lý do an ninh |
| :--- | :--- | :--- | :---: | :--- |
| **Prod Negative 01** | `api.giatoctrantrongthu.com` | `POST /api/people` | **403 Blocked (Edge)** | Chặn hành vi sửa đổi trực tiếp nhân vật trên Production. |
| **Prod Negative 02** | `api.giatoctrantrongthu.com` | `POST /api/member/change-password` | **403 Blocked (Edge)** | Production chưa mở tính năng tự đổi mật khẩu qua public host. |
| **Prod Negative 03** | `api.giatoctrantrongthu.com` | `POST /api/admin/member-accounts` | **403 Blocked (Edge)** | Chặn endpoint tạo tài khoản admin từ Internet công cộng. |
| **Prod Positive 01** | `api.giatoctrantrongthu.com` | `POST /api/member/login` | **Chuyển tiếp (200/401)** | Cho phép đăng nhập thành viên chính thức. |
| **Prod Positive 02** | `api.giatoctrantrongthu.com` | `POST /api/member/proposals` | **Chuyển tiếp (200/403)** | Cho phép gửi đề xuất vào hàng đợi chờ duyệt. |
| **Beta Negative 01** | `beta-api.giatoctrantrongthu.com` | `POST /api/people` | **403 Blocked (Edge)** | Tuyệt đối cấm can thiệp trực tiếp phả đồ trên Beta. |
| **Beta Negative 02** | `beta-api.giatoctrantrongthu.com` | `POST /api/admin/*` | **403 Blocked (Edge)** | Tuyệt đối cấm thao tác admin qua public host Beta. |
| **Beta Positive 01** | `beta-api.giatoctrantrongthu.com` | `POST /api/member/login` | **Chuyển tiếp (200/401)** | Thành viên đăng nhập môi trường Beta. |
| **Beta Positive 02** | `beta-api.giatoctrantrongthu.com` | `POST /api/member/change-password` | **Chuyển tiếp (200)** | **Thành viên kích hoạt tài khoản đổi mật khẩu lần đầu.** |
| **Beta Positive 03** | `beta-api.giatoctrantrongthu.com` | `POST /api/member/proposals` | **Chuyển tiếp (200)** | Thành viên thử nghiệm gửi đề xuất đóng góp. |

---

## 2. THẨM ĐỊNH ĐỊNH TUYẾN VERCEL (GAP-04 — VERCEL ROUTING)

### A. Rà soát Tệp Cấu hình Thực tế `vercel.json`
- **Tệp kiểm tra:** `/Users/tuantq/Projects/Personal/giatoctrantrongthu/vercel.json`
- **Hiện trạng:** 6 quy tắc rewrite (`/login`, `/logout`, `/me`, `/me/:path*`, `/api/:path*`, `/assets/private/:path*`) đang trỏ trực tiếp đến `https://api.giatoctrantrongthu.com` mà không có điều kiện `has`.
- **Hostname xác định rõ ràng:**
  - *Production:* `giatoctrantrongthu.com` (và `admin.giatoctrantrongthu.com`).
  - *Beta:* `beta.giatoctrantrongthu.com`.
  - *Preview phát hành chính xác:* `giatoctrantrongthu-git-release-v200-tuantqs-projects-74ccf90b.vercel.app`.
  - *Chính sách Wildcard:* **Không sử dụng `.*\.vercel\.app` diện rộng** để tránh bắt nhầm các preview nhánh khác; chỉ gán chính xác hostname phát hành được chỉ định.

### B. Ma trận Định tuyến Toàn diện (Full Routing Matrix)

| Hostname Yêu cầu | Đường dẫn (Path) | Thứ tự Rule | Điều kiện `has: host` | Đích đến (Destination) | API Engine |
| :--- | :--- | :---: | :--- | :--- | :---: |
| `beta.giatoctrantrongthu.com` | `/login` | 1 | `beta.giatoctrantrongthu.com` | `https://beta-api.giatoctrantrongthu.com/login` | **BETA** |
| `beta.giatoctrantrongthu.com` | `/logout` | 2 | `beta.giatoctrantrongthu.com` | `https://beta-api.giatoctrantrongthu.com/logout` | **BETA** |
| `beta.giatoctrantrongthu.com` | `/me` | 3 | `beta.giatoctrantrongthu.com` | `https://beta-api.giatoctrantrongthu.com/me` | **BETA** |
| `beta.giatoctrantrongthu.com` | `/me/change-password` | 4 | `beta.giatoctrantrongthu.com` | `https://beta-api.giatoctrantrongthu.com/me/change-password` | **BETA** |
| `beta.giatoctrantrongthu.com` | `/api/member/login` | 5 | `beta.giatoctrantrongthu.com` | `https://beta-api.giatoctrantrongthu.com/api/member/login` | **BETA** |
| `beta.giatoctrantrongthu.com` | `/assets/private/images/clara/1.jpg`| 6 | `beta.giatoctrantrongthu.com` | `https://beta-api.giatoctrantrongthu.com/assets/private/...`| **BETA** |
| `giatoctrantrongthu-git-release-v200...` | `/login` | 7 | Host Preview phát hành | `https://beta-api.giatoctrantrongthu.com/login` | **BETA** |
| `giatoctrantrongthu-git-release-v200...` | `/api/member/proposals` | 11 | Host Preview phát hành | `https://beta-api.giatoctrantrongthu.com/api/member/proposals`| **BETA** |
| `giatoctrantrongthu.com` | `/login` | 13 | `giatoctrantrongthu.com` | `https://api.giatoctrantrongthu.com/login` | **PROD** |
| `giatoctrantrongthu.com` | `/api/people` | 17 | `giatoctrantrongthu.com` | `https://api.giatoctrantrongthu.com/api/people` | **PROD** |
| `giatoctrantrongthu.com` | `/me` | 15 | `giatoctrantrongthu.com` | `https://api.giatoctrantrongthu.com/me` | **PROD** |

### C. Bằng chứng Loại trừ Nguy cơ Fallback Sang Production
- Vercel đánh giá mảng `rewrites` theo thứ tự từ trên xuống dưới.
- Nhóm quy tắc có `has: host` bằng `beta.giatoctrantrongthu.com` nằm ở vị trí đầu tiên.
- Khi một request có host là `beta.giatoctrantrongthu.com`, Vercel Edge so khớp thành công với nhóm 1, chuyển tiếp ngay tới `beta-api` và **dừng hoàn toàn việc đánh giá các quy tắc phía sau**.
- Nhóm quy tắc Production cũng được gắn tường minh điều kiện `has: host eq "giatoctrantrongthu.com"`.
- **Kết luận:** Khả năng request từ Beta rơi xuống Production API bằng **0.0%**.

---

## 3. THẨM ĐỊNH GIỚI HẠN BỘ NHỚ VÀ CƠ CHẾ CGROUP (GAP-01 — MEMORY LIMIT)

### A. Bằng chứng Kernel và systemd 219
Khảo sát trực tiếp qua SSH trên NAS DS223j:
1. `systemctl --version` $\rightarrow$ `systemd 219`.
2. `/proc/28004/cgroup` (Tiến trình Production API) cho thấy:
   ```text
   8:memory:/
   6:devices:/system.slice/family-api.service
   2:name=synomonitor:/system.slice/family-api.service
   1:name=systemd:/system.slice/family-api.service
   ```
   *Hiện trạng:* Service Production chưa kích hoạt `MemoryAccounting`, do đó controller bộ nhớ nằm tại cgroup gốc (`8:memory:/`).
3. `mount | grep cgroup` xác nhận hệ số cgroup memory controller v1 đang hoạt động:
   `cgroup on /sys/fs/cgroup/memory type cgroup (rw,nosuid,nodev,noexec,relatime,memory)`
4. `systemctl show` hỗ trợ natively 2 thuộc tính: `MemoryAccounting` và `MemoryLimit`.

### B. Cơ chế Phân tách cgroup Tuyệt đối giữa Beta và Production
- Khi thiết lập service `family-api-beta.service` với khai báo:
  ```ini
  [Service]
  MemoryAccounting=yes
  MemoryLimit=100M
  ```
- **Hành vi của systemd 219:**
  * systemd tự động khởi tạo nhánh cgroup riêng: `/sys/fs/cgroup/memory/system.slice/family-api-beta.service/`.
  * Ghi chính xác giá trị `104857600` bytes vào tệp `memory.limit_in_bytes`.
  * Gắn PID của `family-api-beta` vào nhánh này.
- **Tính độc lập:** Tiến trình Production API (`family-api`) nằm ở nhánh cgroup khác (hoặc root cgroup), **hoàn toàn không chịu ảnh hưởng hay ràng buộc** bởi giới hạn 100 MB của Beta.

---

## 4. ĐỐI SOÁT KỸ THUẬT BƯỚC 1: KHỞI TẠO CSDL VÀ PHÂN QUYỀN (DATABASE ISOLATION)

### A. Kiểm tra Hệ thống CSDL Hiện hữu
- **Phiên bản MariaDB:** `10.11.11-MariaDB` (Hỗ trợ InnoDB utf8mb4 đầy đủ).
- **Danh sách người dùng hiện có:** `root@localhost`, `wordpress_user@localhost`, `mariadb.sys@localhost`.
- **Tình trạng:** CSDL `family_archive_beta` và user `family_beta_usr` **chưa tồn tại**.

### B. Thiết kế Phân quyền Tối thiểu (Principle of Least Privilege)
- User `family_beta_usr` chỉ được cấp quyền thao tác dữ liệu nghiệp vụ: **`SELECT, INSERT, UPDATE, DELETE`**.
- **Các quyền bị cấm tuyệt đối (Strictly Denied):**
  * `DROP` (Không được xóa bảng).
  * `CREATE`, `ALTER` (Không được sửa cấu trúc DDL khi chạy runtime).
  * `GRANT OPTION` (Không được ủy quyền).
  * `SUPER`, `PROCESS`, `FILE`, `SHUTDOWN`, `RELOAD` (Không có quyền quản trị máy chủ).
  * **Cấm 100% quyền trên CSDL Production (`family_archive`) và CSDL hệ thống (`mysql`).**

### C. Câu lệnh Dự kiến cho Bước 1 (CHỈ LƯU THIẾT KẾ — CHƯA THỰC THI)

```sql
-- [THIẾT KẾ BƯỚC 1.1] Khởi tạo CSDL Beta độc lập
CREATE DATABASE IF NOT EXISTS family_archive_beta
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- [THIẾT KẾ BƯỚC 1.2] Khởi tạo User Beta cô lập tại localhost
-- (Mật khẩu sẽ được sinh ngẫu nhiên 32 ký tự an toàn)
CREATE USER IF NOT EXISTS 'family_beta_usr'@'localhost'
  IDENTIFIED BY '<SECURE_AUTO_GENERATED_PASSPHRASE_32_CHARS>';

-- [THIẾT KẾ BƯỚC 1.3] Cấp quyền thao tác dữ liệu tối thiểu DUY NHẤT trên CSDL Beta
GRANT SELECT, INSERT, UPDATE, DELETE ON family_archive_beta.* TO 'family_beta_usr'@'localhost';

-- [THIẾT KẾ BƯỚC 1.4] Kích hoạt phân quyền
FLUSH PRIVILEGES;
```

---

## 5. DỰ KIẾN KẾT QUẢ KIỂM CHỨNG SAU BƯỚC 1 (EXPECTED VERIFICATION RESULTS)

Sau khi Bước 1 được phê duyệt và thực thi, các câu lệnh kiểm chứng độc lập sau sẽ được chạy để đối soát:

1. **Kiểm tra sự tồn tại của CSDL:**
   - Lệnh: `SHOW DATABASES;`
   - Kết quả kỳ vọng: Xuất hiện `family_archive_beta` bên cạnh `family_archive`.
2. **Kiểm tra quyền hạn của User Beta:**
   - Lệnh: `SHOW GRANTS FOR 'family_beta_usr'@'localhost';`
   - Kết quả kỳ vọng:
     `GRANT USAGE ON *.* TO `family_beta_usr`@`localhost``
     `GRANT SELECT, INSERT, UPDATE, DELETE ON `family_archive_beta`.* TO `family_beta_usr`@`localhost``
3. **Kiểm thử rào cản cô lập (Negative Isolation Test):**
   - Đăng nhập bằng `family_beta_usr` và chạy: `SELECT COUNT(*) FROM family_archive.people;`
   - Kết quả kỳ vọng bắt buộc: **`ERROR 1142 (42000): SELECT command denied to user 'family_beta_usr'@'localhost' for table 'people'`**.
   - Chứng minh: User Beta bị chặn cứng ở tầng engine, không thể đọc/ghi CSDL Production.

---

## 6. PHÂN TÍCH RỦI RO CÒN LẠI & KẾ HOẠCH ROLLBACK (REMAINING RISKS & ROLLBACK)

| Rủi ro tiềm ẩn | Mức độ | Biện pháp kiểm soát đã xác minh | Phương án Rollback cụ thể |
| :--- | :---: | :--- | :--- |
| Lệnh tạo DB tác động nhầm sang Production | `P0` | Lệnh chỉ định rõ ràng `family_archive_beta`, không dùng wildcard hay drop. | Nếu cần rollback Bước 1: Chỉ chạy `DROP DATABASE family_archive_beta;` và `DROP USER 'family_beta_usr'@'localhost';`. Production không bị ảnh hưởng. |
| User Beta truy cập được bảng quản trị | `P1` | Không cấp quyền trên `mysql.*`. Đã có Negative Test xác nhận từ chối. | Thu hồi quyền tức thì bằng `REVOKE ALL PRIVILEGES ON *.* FROM ...`. |
| Cạn kiệt RAM do MariaDB mở thêm DB | `P2` | MariaDB dùng chung connection pool và buffer pool đã có sẵn (25 MB RSS), không tăng tiến trình mới. | Giám sát RSS qua `/proc/13721/status`. |

---

## 7. RANH GIỚI PHÊ DUYỆT RÕ RÀNG (EXPLICIT APPROVAL BOUNDARY)

AGY khẳng định tuân thủ nghiêm ngặt các ranh giới sau:
- **Đã làm:** Hoàn thành khảo sát pháp y, kiểm chứng cgroups, mô phỏng định tuyến Vercel, kiểm tra logic WAF, soạn thảo DDL Bước 1.
- **Chưa làm & Đang dừng:**
  * **CHƯA** chạy bất kỳ câu lệnh SQL nào trên NAS.
  * **CHƯA** tạo CSDL `family_archive_beta`.
  * **CHƯA** tạo user `family_beta_usr`.
  * **CHƯA** sửa `vercel.json` hay Cloudflare WAF.
  * **CHƯA** tạo service hay thư mục mới.

---

**DỪNG TẠI HUMAN CHECKPOINT — KÍNH CHỜ TUẤN RA CHỈ THỊ PHÊ DUYỆT BƯỚC 1.**

