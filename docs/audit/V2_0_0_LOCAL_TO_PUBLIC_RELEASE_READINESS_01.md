# BÁO CÁO KHẢO SÁT SẴN SÀNG PHÁT HÀNH & ĐỐI SOÁT PIPELINE V2.0.0
## V2.0.0 LOCAL TO PUBLIC RELEASE READINESS & DEPLOYMENT PIPELINE RECONCILIATION REPORT

- **Dự án:** Gia Tộc Trần Trọng Thu
- **Cơ quan thẩm quyền:**
  - **Tuấn:** Human Final Authority — Quyết định sản phẩm & phê duyệt cổng phát hành.
  - **Emarald:** Architecture & QC Authority — Thẩm định kiến trúc, evidence và chất lượng.
  - **AGY:** Execution Authority — Điều phối kỹ thuật và thực thi.
- **Mã tài liệu:** `V2_0_0_LOCAL_TO_PUBLIC_RELEASE_READINESS_01`
- **Thời gian lập báo cáo:** 2026-11-11T09:50:00+07:00
- **Chế độ thực thi:** STRICT READ-ONLY (Không sửa code, không commit, không thay đổi môi trường).
- **Tài liệu căn cứ:** [`AUDIT/MASTER_COMPLETION_PLAN.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/AUDIT/MASTER_COMPLETION_PLAN.md) (Master Plan v4.0), [`docs/audit/V2_0_0_GOVERNANCE_PRODUCTION_INTEGRATION_07.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/audit/V2_0_0_GOVERNANCE_PRODUCTION_INTEGRATION_07.md).

---

## 1. TỔNG QUAN ĐIỀU HÀNH (EXECUTIVE SUMMARY)

### V2.0.0 hiện ở trạng thái nào?
Hệ thống Gia Tộc Trần Trọng Thu hiện đang ở **trạng thái phân tách hai tầng rõ rệt giữa Backend Production và Frontend Public**:

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             HIỆN TRẠNG TOÀN CẢNH HỆ THỐNG                        │
├──────────────────────────────────────────────────────────────────────────────────┤
│ 1. BACKEND, API & DATABASE (Production NAS MariaDB 10.11):                       │
│    - Trạng thái: [PROVEN / OPERATIONAL]                                         │
│    - API Gateway: https://api.giatoctrantrongthu.com (Cloudflare Tunnel)         │
│    - Đã vượt qua 12/12 ca kiểm thử E2E công cộng (Batch 07 nghiệm thu).           │
│    - Bảo mật: CORS Whitelist đóng băng, Anti-CSRF token guard, Rate Limiting kép,│
│      Member Verification thời gian thực. Baseline dữ liệu 223 cá nhân nguyên vẹn.│
│                                                                                  │
│ 2. FRONTEND V2.0.0 & ADMIN CONTROL CENTER (Local Working Tree):                  │
│    - Trạng thái: [TESTED LOCALLY / UNRELEASED TO PUBLIC]                         │
│    - Đã hoàn thành cấu trúc Single-Shell (#gi-app) gắn boot-public.js,           │
│      Trang chủ cội nguồn CR-HOME-01, CSS Foundation tokens, Admin Control Room.  │
│    - Toàn bộ đang nằm dưới dạng UNSTAGED & UNTRACKED trên máy Local của Tuấn.   │
│                                                                                  │
│ 3. PUBLIC WEBSITE HIỆN TẠI (https://giatoctrantrongthu.com):                     │
│    - Trạng thái: [OBSERVED: STATIC PROTOTYPE TỒN TẠI TỪ 57 NGÀY TRƯỚC]           │
│    - Vẫn đang phục vụ bản HTML tĩnh DESIGN-001 Revision từ commit 42a7ed2        │
│      (ngày 15/09/2026). Các nút bấm chỉ là hash mockup (#/...), auth chưa nối.   │
│                                                                                  │
│ 4. ĐIỂM ĐỨT GÃY CỦA PIPELINE LOCAL ──► PUBLIC:                                   │
│    - Điểm đứt 1: 100% mã nguồn V2.0.0 bị dồn ứ trên Local, chưa được commit.    │
│    - Điểm đứt 2: GitHub Action CI (.github/workflows/validate-data.yml) bị lỗi   │
│      incompatible (gọi script kiểm tra file tĩnh cũ đã chuyển vào MariaDB).      │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. HIỆN TRẠNG MÃ NGUỒN CỤC BỘ (LOCAL RELEASE BASELINE)

- **Git Branch:** `main` `[OBSERVED]`
- **Local HEAD Commit:** `42a7ed2f229ac0d9a6630126d4da058e55acf50b` — *"feat: Deploy DESIGN-001 Revision with real production data API"* (15/09/2026) `[OBSERVED]`.
- **Trạng thái Working Tree:**
  * **21 tệp tin bị sửa đổi nhưng chưa commit (`M`):**
    - `index.html`: Đã thay thế toàn bộ 383 dòng prototype tĩnh cũ bằng vỏ bọc động V2.0.0 (`<div id="gi-app">` nạp module `/src/js/ui/boot-public.js` và `/src/css/foundation/foundation.css`).
    - `admin/css/admin.css`, `admin/index.html`, `admin/js/admin.js`, `admin/js/api.js`: Đã bổ sung 919 dòng mã mở rộng Admin Control Room (Inbox duyệt đề xuất, Quản lý Nhân sự, Quản lý Bài viết MẠCH, Sự kiện, API integration).
    - `server/index.js`: Đã vá CORS Whitelist đóng băng duy nhất 2 domains, tích hợp bảo vệ CSRF 5 tầng, rate limiting kép.
    - `package.json`, `vercel.json`, `AGENTS.md`, `README.md`, `.gitignore`, `.github/workflows/instant-sync.yml`.
  * **52 tệp tin đã xóa khỏi local nhưng chưa commit (`D`):**
    - Các script kiểm thử cũ, python parser cũ (`check_js.py`, `check_prod.py`, `fix_html.py`, `generate_audit_plan.py`...).
    - Các tài liệu thiết kế kiến trúc cũ đã được thay thế bởi Master Plan v4.0.
  * **88+ tệp tin và thư mục mới chưa được theo dõi (`??`):**
    - `src/js/ui/`: Hệ thống UI vNEXT gồm 35 tệp ES Modules (`boot-public.js`, `public-home.js`, `shell.js`, `navigation.js`, `dashboard.js`, `tree.js`, `person.js`, `gallery.js`, `events.js`, `discourse.js`, `gateway.js`, `mock-adapter.js`...).
    - `src/css/foundation/`: Foundation CSS Tokens, layout, components, states (`foundation.css`, `components.css`, `tokens.css`, `layout.css`).
    - `src/js/domain/`, `src/js/platform/`, `src/js/shared/`: Các domain logic độc lập.
    - `server/`: Các module vận hành đã kiểm chứng (`governance.js`, `member.js`, `auth.js`, `foundation.js`, `admin_operations.js`, `test_cors_csrf_security.js`...).
    - `tests/`: Hơn 20 bộ kiểm thử tự động Node.js (`test_public_cloudflare_acceptance.mjs`, `test_production_e2e_suite.mjs`...).
    - `docs/audit/`: Báo cáo nghiệm thu Batch 07 và tài liệu kiểm toán.
    - `fixtures/`, `lab.html`.

- **Cấu hình Build & Runtime:**
  * **Frontend:** Thuần túy Vanilla JavaScript ES Modules tiêu chuẩn trình duyệt (`type="module"`), **hoàn toàn không dùng bundler** (tuân thủ nghiêm ngặt Ràng buộc Kỹ thuật Bất biến số 6 của Master Plan v4.0).
  * **Backend:** Node.js v22 Express API server, chạy trên NAS cổng 3000.

---

## 3. ĐỐI SOÁT ĐỒNG BỘ GITHUB (GITHUB SYNCHRONIZATION BASELINE)

- **Remote URL:** `git@github.com:tuantudo/giatoctrantrongthu.git` `[CONFIGURED]`
- **Trạng thái HEAD trên GitHub:**
  * Lệnh kiểm tra: `git ls-remote origin` `[TESTED]`
  * Kết quả: `42a7ed2f229ac0d9a6630126d4da058e55acf50b refs/heads/main`
- **Đánh giá đồng bộ:**
  * Về mặt lịch sử commit: Local HEAD và GitHub HEAD **trùng khớp 100%** (chênh lệch 0 commit) `[PROVEN]`.
  * Về mặt nội dung thực tế: GitHub **HOÀN TOÀN CHƯA CÓ** bất kỳ mã nguồn V2.0.0 nào `[OBSERVED]`. Toàn bộ thành quả phát triển trong 57 ngày qua chưa từng được đẩy lên kho lưu trữ từ xa.

---

## 4. HIỆN TRẠNG MÔI TRƯỜNG PRODUCTION (PRODUCTION BASELINE)

Khảo sát thực tế bằng HTTP Probes ngày 2026-11-11:

### A. Trang Web Công Khai (`https://giatoctrantrongthu.com`):
- **Hạ tầng phục vụ:** Vercel Global Edge Network (`server: Vercel`, `x-vercel-id: hkg1::...`) `[OBSERVED]`.
- **Nội dung thực tế đang phục vụ:**
  * File HTML kích thước: 19,209 bytes.
  * Thẻ `<title>`: `Gia Tộc Trần Trọng Thu — DESIGN-001 Revision Prototype` `[OBSERVED]`.
  * Bình luận mã nguồn ghi rõ: *"DESIGN-001 REVISION — Public / Member IA prototype... auth NOT implemented (honest placeholders)... Real snapshot data; no fakes; no production code."*
  * Navigation: Toàn bộ liên kết là anchor hash prototype (`#/mach`, `#/tu-lieu`, `#/gia-pha`).
  * Đánh giá: **Website công khai hiện vẫn là Static Prototype cũ**, chưa kết nối dữ liệu thật và chưa nạp kiến trúc V2.0.0.

### B. Trang Quản Trị (`https://admin.giatoctrantrongthu.com`):
- **Hạ tầng phục vụ:** Vercel Global Edge Network, chuyển hướng HTTP 307 từ `/` sang `/admin` `[OBSERVED]`.
- **Nội dung thực tế:** Phục vụ tệp `admin/index.html` của commit cũ `42a7ed2`.
- **Thiếu hụt:** Thiếu toàn bộ các tính năng duyệt đề xuất (Inbox Proposal), quản lý nhân sự phả hệ và tích hợp API đã viết trên Local.

### C. Cổng API & Dữ Liệu (`https://api.giatoctrantrongthu.com`):
- **Hạ tầng phục vụ:** Cloudflare Tunnel -> Máy chủ Synology NAS (`100.80.147.119:3000`) `[PROVEN]`.
- **Runtime:** Node.js v22 Express API (`PID: 28004`), MariaDB 10.11 (`family_tree`) `[PROVEN]`.
- **Bảo mật & Kiểm chứng:**
  * CORS: Whitelist đóng băng duy nhất `https://admin.giatoctrantrongthu.com` và `https://giatoctrantrongthu.com`. Trả về `ACAO: null` đối với mọi Untrusted Origin (Zero Wildcard) `[TESTED]`.
  * CSRF: Bảo vệ 5 tầng, cấp token phiên qua `/api/csrf-token` `[TESTED]`.
  * Rate Limiting: 20 đề xuất/h theo tài khoản, 30 requests/h theo IP `[TESTED]`.
  * Cloudflare WAF: Chặn đứng 100% mutation trực tiếp tại Edge, chỉ mở ngoại lệ duy nhất cho thành viên gửi Proposal và Login `[PROVEN]`.
  * Baseline dữ liệu gia phả: **223 cá nhân / 68 gia đình / 1 cạnh quan hệ** `[PROVEN]`.
  * Trạng thái tài khoản kiểm thử: **100% đã bị vô hiệu hóa** (`DISABLED`) `[PROVEN]`.

---

## 5. ĐÁNH GIÁ CHUỖI PIPELINE PHÁT HÀNH (DEPLOYMENT PIPELINE STATUS)

Chuỗi phát hành mục tiêu:
```text
[Local Working Tree] ──(1)──► [Local Commit] ──(2)──► [GitHub main] ──(3)──► [GitHub Actions CI] ──(4)──► [Vercel CD] ──(5)──► [Production Public]
```

Đối soát từng công đoạn trong chuỗi:

| Công đoạn | Trạng thái Hiện tại | Bằng chứng Kỹ thuật | Đánh giá & Rủi ro |
| :--- | :---: | :--- | :--- |
| **(1) Local Tree ──► Commit** | **BLOCKED** | Hơn 160 tệp tin bị dồn ứ dạng uncommitted / untracked trong 57 ngày. | **Điểm nghẽn số 1:** Cần phân loại có cấu trúc để commit sạch, không bỏ sót mã V2.0.0 và không để lọt tệp rác. |
| **(2) Commit ──► GitHub** | **CONFIGURED** | Remote `git@github.com:tuantudo/giatoctrantrongthu.git` kết nối SSH thông suốt. | Sẵn sàng đẩy code sau khi commit. |
| **(3) GitHub Actions CI** | **BROKEN / WILL FAIL** | Chạy thử cục bộ: `python3 generator/validate_integrity.py` báo `[FAIL] Missing data file: data/genealogy.json`, `Missing ICS feeds` -> `OVERALL RESULT: FAILED`. | **Điểm nghẽn số 2:** Script CI cũ kiểm tra file tĩnh đã bị xóa từ commit `776b642`. Nếu push lên GitHub, CI sẽ bị **FAIL (đỏ build)**. |
| **(4) GitHub ──► Vercel CD** | **CONFIGURED & READY** | Project `giatoctrantrongthu` trên Vercel linked với GitHub repo, cấu hình build tự động khi có commit mới. | Sẵn sàng hoạt động ngay khi code lên GitHub. |
| **(5) Vercel ──► NAS API** | **PROVEN** | `vercel.json` cấu hình rewrite `/api/*` và `/me/*` sang `https://api.giatoctrantrongthu.com`. | Đường hầm Cloudflare Tunnel đã thông suốt và được nghiệm thu qua 12 bài test. |

---

## 6. KHOẢNG CÁCH HOÀN THIỆN SẢN PHẨM (PRODUCT COMPLETION GAP)

Đối chiếu V2.0.0 hiện tại với Master Plan v4.0:

| Phân hệ Sản phẩm | Trạng thái Local | Trạng thái Public Hiện tại | Khoảng cách Cần thu hẹp (Gap) |
| :--- | :---: | :---: | :--- |
| **Dynamic Public Website** | Đã code xong (`boot-public.js`, `public-home.js`) | Static prototype 57 ngày trước | Deploy mã nguồn UI mới lên Vercel để thay thế hoàn toàn prototype tĩnh. |
| **Admin Control Center** | Đã mở rộng 919 lines (`admin.js`, `api.js`) | Bản tĩnh sơ khai | Deploy `admin/` mới lên Vercel để Owner duyệt đề xuất và quản lý nhân sự. |
| **Member Portal (`/me`)** | Đã có backend routes & UI modules | Vercel rewrite sẵn sàng nhưng thiếu asset JS UI | Khi Vercel có `src/js/ui/*`, giao diện thành viên sẽ kích hoạt đầy đủ. |
| **API & Database** | Hoàn thành | Đang chạy thật trên NAS | **Zero Gap** (Đã đồng bộ và hoạt động). |
| **CI / Automated Gate** | Test suites Node.js chạy tốt | CI workflow GitHub đang gọi script cũ bị hỏng | Cần điều chỉnh workflow CI phù hợp với V2.0.0. |

---

## 7. CÁC ĐIỂM NGHẼN PHÁT HÀNH (RELEASE BLOCKERS)

1. **BLOCKER-01 (Working Tree Stagnation):**
   - *Bản chất:* 100% mã nguồn V2.0.0 chưa được stage/commit vào Git.
   - *Hệ quả:* Vercel không có mã nguồn mới để triển khai.
2. **BLOCKER-02 (GitHub Actions CI Incompatibility):**
   - *Bản chất:* Tệp `.github/workflows/validate-data.yml` kiểm tra sự tồn tại của file tĩnh cũ `data/genealogy.json` và `calendars/*.ics` (đã chuyển vào MariaDB).
   - *Hệ quả:* Khi push lên GitHub, workflow sẽ báo lỗi (exit code 1), gây gián đoạn quy trình tích hợp liên tục.
3. **BLOCKER-03 (Working Tree Hygiene & Sensitive Data Guard):**
   - *Bản chất:* Cần rà soát tuyệt đối để các file cấu hình môi trường cục bộ (`.env`), cookie session test, hoặc tệp rác không bị stage nhầm vào Git.
4. **BLOCKER-04 (Vercel Static Route CORS Clean-up):**
   - *Bản chất:* Response header của Vercel trên trang tĩnh vẫn trả `access-control-allow-origin: *`.
   - *Hệ quả:* Cần cập nhật `vercel.json` để loại bỏ wildcard static, thống nhất chính sách với Backend.

---

## 8. NHỮNG VIỆC CẦN THỰC HIỆN ĐỂ PHÁT HÀNH V2.0.0

1. **Điều chỉnh CI Gate (.github/workflows/validate-data.yml):**
   - Thay thế việc kiểm tra file tĩnh đã lỗi thời bằng bộ kiểm thử tự động Node.js (`npm test`), đảm bảo build pass trên GitHub.
2. **Dọn dẹp và phân loại Working Tree có cấu trúc:**
   - Đảm bảo `.gitignore` che chắn toàn bộ tệp nhạy cảm và artifact tạm.
   - Nhóm các thay đổi thành các commit rõ ràng, mạch lạc:
     * Commit 1: `fix(ci): reconcile github actions workflows for dynamic v2.0 architecture`
     * Commit 2: `feat(ui): implement vnext single-shell public home & foundation css`
     * Commit 3: `feat(admin): modernize admin control room with proposal inbox & management`
     * Commit 4: `feat(governance): integrate backend governance engine, cors & anti-csrf guards`
     * Commit 5: `test(e2e): add automated verification suites for cloudflare & production acceptance`
3. **Triển khai thử nghiệm qua Nhánh Xem Trước (Vercel Preview Deployment):**
   - Đẩy code lên nhánh `release/v2.0.0` trên GitHub.
   - Vercel sẽ tự động tạo một deployment Preview độc lập (ví dụ: `https://giatoctrantrongthu-git-release-v200-*.vercel.app`).
   - Tuấn và Emarald có thể truy cập URL này để kiểm tra giao diện động, tính tương tác và thẩm mỹ mà **hoàn toàn không làm ảnh hưởng đến website Production hiện tại**.
4. **Kiểm thử nghiệm thu trên Vercel Preview (Smoke Test):**
   - Kiểm tra hiển thị trang chủ CR-HOME-01 trên các kích thước màn hình.
   - Kiểm tra đường dẫn `/login` và tương tác với Backend NAS API.
   - Kiểm tra Admin Control Room tại preview URL.
5. **Kích hoạt phát hành chính thức (Production Promotion - GATE-06):**
   - Sau khi Tuấn phê duyệt kết quả trên Preview, merge nhánh `release/v2.0.0` vào `main`.
   - Vercel tự động cập nhật `https://giatoctrantrongthu.com` thành phiên bản V2.0.0 Dynamic chính thức.

---

## 9. ĐỀ XUẤT THỨ TỰ TRIỂN KHAI (IMPLEMENTATION SEQUENCE)

```text
┌────────────────────────────────────────────────────────────────────────┐
│                      LỘ TRÌNH TRIỂN KHAI 5 BƯỚC                        │
├────────────────────────────────────────────────────────────────────────┤
│ Bước 1: Điều chỉnh CI Workflow (.github/workflows/validate-data.yml)   │
│         -> Đảm bảo GitHub Actions chạy PASS 100%.                      │
│                                                                        │
│ Bước 2: Tạo nhánh release/v2.0.0 & commit có cấu trúc                  │
│         -> Giải phóng Working Tree, bảo lưu toàn bộ thành quả.         │
│                                                                        │
│ Bước 3: Đẩy lên GitHub -> Kích hoạt Vercel Preview Deployment          │
│         -> Tạo URL thử nghiệm độc lập, an toàn tuyệt đối.              │
│                                                                        │
│ Bước 4: Kiểm thử chấp nhận trên Preview URL                            │
│         -> Tuấn & Emarald trực tiếp trải nghiệm và đánh giá chất lượng.│
│                                                                        │
│ Bước 5: [HUMAN GATE-06] Phê duyệt & Merge vào main                     │
│         -> Chính thức thay thế Static Prototype trên Production.       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 10. CHỐT CHẶN PHÊ DUYỆT CẦN THIẾT (HUMAN APPROVAL GATES)

1. **GATE-R1: Phê duyệt kế hoạch phân loại commit & điều chỉnh CI workflow.**  
   *Nội dung:* Xác nhận phương án cập nhật CI workflow và danh mục commit trước khi ghi nhận vào Git.
2. **GATE-R2: Phê duyệt nghiệm thu giao diện trên Vercel Preview Deployment.**  
   *Nội dung:* Tuấn trực tiếp trải nghiệm URL Preview và xác nhận tính thẩm mỹ, độ ổn định trước khi phát hành.
3. **GATE-06: Quyết định kích hoạt V2.0.0 chính thức trên Production.**  
   *Nội dung:* Phê duyệt merge nhánh `release/v2.0.0` vào `main` để công bố phiên bản V2.0.0 cho toàn thể gia tộc.

---

### **BẢO TOÀN HỆ THỐNG TRONG SUỐT QUÁ TRÌNH KHẢO SÁT:**
- **Git working tree:** Không có bất kỳ thay đổi nào bị stage, commit, reset hoặc xóa.
- **Production services:** NAS API, MariaDB, Vercel và Cloudflare hoạt động liên tục, không bị gián đoạn.
- **Báo cáo đã lưu trữ:** [`docs/audit/V2_0_0_LOCAL_TO_PUBLIC_RELEASE_READINESS_01.md`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/audit/V2_0_0_LOCAL_TO_PUBLIC_RELEASE_READINESS_01.md).

