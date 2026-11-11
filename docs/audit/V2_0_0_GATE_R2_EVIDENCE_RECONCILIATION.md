# BÁO CÁO ĐỐI SOÁT CHỨNG CỨ & BÀN GIAO KIỂM ĐỊNH ĐỘC LẬP (GATE-R2 EVIDENCE RECONCILIATION)
**Dự án:** Gia Tộc Trần Trọng Thu  
**Phiên bản:** V2.0.0 (Dynamic Platform Release)  
**Người phê duyệt cuối cùng:** Tuấn (Human Final Authority)  
**Đơn vị kiểm chứng kiến trúc & QC:** Emarald (Architecture & QC Authority)  
**Đơn vị thực thi:** AGY (Primary Execution Authority)  
**Thời điểm thực thi:** 2026-11-11  
**Chế độ thực thi:** STRICT READ-ONLY (Không sửa source code, cấu hình, CSDL hay Production)

---

## 1. EXECUTIVE SUMMARY (TỔNG QUAN ĐỐI SOÁT CHỨNG CỨ)

Thực hiện chỉ thị đối soát chứng cứ của **Tuấn** và **Emarald** sau phán quyết *"CONDITIONALLY ACCEPTED — BROWSER QA PASS, EVIDENCE AUDIT PENDING"*, AGY đã tiến hành rà soát pháp y toàn diện 3 nhóm nhiệm vụ trọng tâm:

1. **Xác minh Nguồn gốc Triển khai (Deployment Provenance):**
   * Đối soát và làm rõ quan hệ thời gian, commit SHA giữa 2 Deployment ID: `dpl_rj3akuQJ1eYFtUziwBcxZ121J6Mr` (GATE-R1, commit `3acf869`) và `dpl_2kwzP4HMB1TE7tunKiCvA6DYYr4S` (GATE-R2, commit `d4e982f`).
   * Chứng minh bằng thẻ HTML runtime script rằng branch stable alias `https://giatoctrantrongthu-git-release-v200-tuantqs-projects-74ccf90b.vercel.app` đã và đang phục vụ chính xác Deployment ID `dpl_2kwzP4HMB1TE7tunKiCvA6DYYr4S` thuộc nhánh `release/v2.0.0`.
2. **Kiểm toán Kho Chứng cứ Gốc Trình duyệt (Browser QA Evidence Inventory):**
   * Đầy đủ 12 tệp ảnh chụp màn hình thực tế trong `docs/audit/screenshots/` với kích thước pixel chuẩn xác (1440px, 1024px, 768px, 375px), không có màn hình trắng hay lỗi layout.
   * Rà soát toàn bộ các tệp nhật ký nguyên thủy trong thư mục `.playwright-mcp/` gồm 13 tệp snapshot accessibility YAML và 2 tệp console logs, đối chiếu từng tuyên bố trong báo cáo gốc.
3. **Làm rõ Ranh giới Kiến trúc & An ninh (Preview–Production Boundary):**
   * Phân loại chính xác bản chất hệ thống hiện tại: **PREVIEW FRONTEND + PRODUCTION BACKEND**.
   * Đối chiếu hai endpoint lịch sử từng được ghi nhận trong `INDEPENDENT_VERIFICATION_REPORT.md` (`/api/media.json` và `/api/person_media.json`). Xác nhận: trong mã nguồn `server/index.js` đã có gắn `requireMemberOrAdmin`, tuy nhiên ở phiên Browser QA công khai thì hai endpoint này **KHÔNG nằm trong Network waterfall (NOT TESTED IN THIS GATE)** vì giao diện công khai V2 sử dụng asset manifest tĩnh.
   * Tách bạch rạch ròi giữa *Quan sát cấp Trình duyệt (Browser-level Observation)* và *Bảo đảm an ninh cấp API (API-level Security Assurance)*.

---

## 2. DEPLOYMENT PROVENANCE (NGUỒN GỐC TRIỂN KHAI)

### 2.1. Bảng đối chiếu thực thể triển khai Vercel

| Thuộc tính | Deployment GATE-R1 | Deployment GATE-R2 (Hiện hành) | Đối chiếu & Đánh giá |
| :--- | :--- | :--- | :--- |
| **Deployment ID** | `dpl_rj3akuQJ1eYFtUziwBcxZ121J6Mr` | `dpl_2kwzP4HMB1TE7tunKiCvA6DYYr4S` | Hai ID khác nhau, đại diện cho 2 lần build liên tiếp |
| **Direct URL** | `giatoctrantrongthu-riajnfjy2-*.vercel.app` | `giatoctrantrongthu-l9nlyido3-*.vercel.app` | URL băm riêng biệt của từng bản build |
| **Branch Alias** | `giatoctrantrongthu-git-release-v200-*.vercel.app` | `giatoctrantrongthu-git-release-v200-*.vercel.app` | Alias ổn định của nhánh, tự động trỏ tới bản build mới nhất |
| **Git Branch** | `release/v2.0.0` | `release/v2.0.0` | Trùng khớp 100% |
| **Commit SHA** | `3acf869882bb9d8c4dd2ff6d743eab2bb47eb2ff` | `d4e982f8132d001c56c1ea364e32876cce26b9dd` | `d4e982f` là commit kế tiếp sau `3acf869` |
| **Thời điểm Build** | 2026-11-11 10:32:19 (GMT+7) | 2026-11-11 10:36:35 (GMT+7) | Cách nhau 4 phút 16 giây |
| **Trạng thái (Status)** | `● Ready` | `● Ready` | Đều hoàn thành trong 7 giây |
| **Target Environment** | `Preview` | `Preview` | Hoàn toàn độc lập với Production |

### 2.2. Mối quan hệ giữa Deployment GATE-R1 và Deployment GATE-R2
- Khi AGY hoàn tất Scope B & C của GATE-R1 lúc 10:31:37, commit HEAD là `3acf869` (`chore(cleanup): archive legacy scripts and remove obsolete unmodularized files`). Vercel tự động kích hoạt bản dựng `dpl_rj3akuQJ1eYFtUziwBcxZ121J6Mr`.
- Sau đó, để hoàn thành Scope E của GATE-R1 (viết báo cáo thực thi), AGY đã ghi tệp `docs/audit/V2_0_0_GATE_R1_CI_RELEASE_BRANCH_EXECUTION.md`, tạo commit `d4e982f` lúc 10:36:30 và đẩy lên GitHub.
- Vercel webhook nhận diện commit mới trên nhánh `release/v2.0.0` và khởi tạo bản dựng `dpl_2kwzP4HMB1TE7tunKiCvA6DYYr4S` lúc 10:36:35.
- Theo cơ chế quản trị nhánh của Vercel, branch stable alias `https://giatoctrantrongthu-git-release-v200-tuantqs-projects-74ccf90b.vercel.app` tự động chuyển trỏ sang bản dựng mới nhất `dpl_2kwzP4HMB1TE7tunKiCvA6DYYr4S`.
- **Đo lường sai khác mã nguồn (Diff check):**  
  Lệnh `git diff 3acf869 d4e982f --stat` cho thấy thay đổi duy nhất giữa 2 commit là tệp tài liệu markdown `V2_0_0_GATE_R1_CI_RELEASE_BRANCH_EXECUTION.md` (+199 dòng). Không có bất kỳ dòng code frontend (HTML, CSS, JS, assets) nào bị thay đổi giữa 2 deployment này.

### 2.3. Bằng chứng định danh thực tế tại Runtime (Runtime DOM Proof)
Truy vấn trực tiếp thẻ runtime feedback trên trang Preview qua curl:
```bash
curl -s https://giatoctrantrongthu-git-release-v200-tuantqs-projects-74ccf90b.vercel.app | grep "dpl_"
```
**Kết quả trả về:**
```html
<script async data-explicit-opt-in="true" data-deployment-id="dpl_2kwzP4HMB1TE7tunKiCvA6DYYr4S" src="https://vercel.live/_next-live/feedback/feedback.js"></script>
```
*Bằng chứng xác nhận:* Phiên kiểm thử GATE-R2 đã thực hiện trực tiếp trên bản dựng `dpl_2kwzP4HMB1TE7tunKiCvA6DYYr4S` gắn liền với commit `d4e982f`.

---

## 3. BROWSER EVIDENCE INVENTORY (KHO CHỨNG CỨ TRÌNH DUYỆT GỐC)

Kho chứng cứ gốc được lưu trữ trực tiếp trong workspace dự án gồm các thành phần vật lý sau:

1. **Báo cáo chính GATE-R2:**  
   [docs/audit/V2_0_0_GATE_R2_BROWSER_QA_REPORT.md](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/audit/V2_0_0_GATE_R2_BROWSER_QA_REPORT.md) (226 dòng, tạo lúc 10:53:17).
2. **Bộ 12 Ảnh chụp Màn hình:**  
   Thư mục [docs/audit/screenshots/](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/docs/audit/screenshots/) (Tổng dung lượng: 4.3 MB).
3. **Nhật ký Console nguyên sinh (Raw Console Logs):**  
   - `.playwright-mcp/console-2026-11-11T03-47-00-359Z.log`: Ghi nhận lỗi HTTP 401 khi `/admin` gọi `/api/auth/me`.
   - `.playwright-mcp/console-2026-11-11T03-48-20-335Z.log`: Ghi nhận lỗi HTTP 401 tương tự trên mobile viewport.
4. **Cấu trúc DOM Accessibility Snapshots (Raw YAML Snapshots):**  
   - `page-2026-11-11T03-46-25-962Z.yml` (8,632 bytes): Snapshot sau khi cuộn tới `#coi-nguon`.
   - `page-2026-11-11T03-46-37-309Z.yml` (630 bytes): Snapshot form đăng nhập `/login`.
   - `page-2026-11-11T03-46-48-515Z.yml` (630 bytes): Snapshot chuyển hướng an toàn từ `/me` về `/login`.
   - `page-2026-11-11T03-46-55-941Z.yml` (630 bytes): Snapshot chuyển hướng an toàn từ `/me/tree` về `/login`.
   - `page-2026-11-11T03-47-01-654Z.yml` (1,338 bytes): Snapshot `/admin` chuyển hướng về `/admin/login`.
   - `page-2026-11-11T03-48-07-102Z.yml` (641 bytes): Snapshot `/login` trên Mobile 375px.
   - `page-2026-11-11T03-48-20-693Z.yml` (1,362 bytes): Snapshot `/admin/login` trên Mobile 375px.
   - `page-2026-11-11T03-48-55-271Z.yml` (2,121 bytes): Snapshot Gateway Lịch `/#/lich`.
   - `page-2026-11-11T03-49-14-240Z.yml` (2,242 bytes): Snapshot Gateway Phả Hệ `/#/gia-pha`.
   - `page-2026-11-11T03-51-34-479Z.yml` (2,121 bytes): Snapshot kiểm thử nút Back `page.goBack()`.
   - `page-2026-11-11T03-51-53-456Z.yml` (2,196 bytes): Snapshot Gateway MẠCH `/#/mach`.
   - `page-2026-11-11T03-51-59-190Z.yml` (2,160 bytes): Snapshot Gateway Di Ảnh `/#/tu-lieu`.
   - `page-2026-11-11T03-52-11-867Z.yml` (9,023 bytes): Snapshot Graceful Fallback khi nhập hash sai `/#/invalid-route`.

---

## 4. SCREENSHOT VERIFICATION (ĐỐI SOÁT CHI TIẾT 12 ẢNH CHỤP MÀN HÌNH)

Dữ liệu kích thước được trích xuất trực tiếp bằng lệnh hệ thống `file` và `ls -l`:

| Tên tệp ảnh (`docs/audit/screenshots/`) | Kích thước Pixel thực tế (WxH) | Viewport kỳ vọng | Dung lượng (Bytes) | Kết quả kiểm tra trực quan & Nội dung | Trạng thái |
| :--- | :---: | :---: | :---: | :--- | :---: |
| `desktop_1440_home.png` | `1440 x 2044` | Desktop (1440px) | 459,676 | Full-page screenshot trang nhất; hiển thị đầy đủ 8 phân vùng; hình ảnh sum họp và di ảnh tiền nhân sắc nét. | `VERIFIED` |
| `desktop_1440_login.png` | `1440 x 900` | Desktop (1440px) | 37,392 | Viewport screenshot; form đăng nhập căn giữa trang nhã; 2 trường input rõ ràng. | `VERIFIED` |
| `desktop_1440_admin_login.png` | `1440 x 900` | Desktop (1440px) | 21,077 | Viewport screenshot; giao diện Control Room Login; các module quản trị không bị rò rỉ. | `VERIFIED` |
| `desktop_1440_gia_pha.png` | `1440 x 932` | Desktop (1440px) | 89,270 | Full-page screenshot; Gateway Phả Hệ với thông báo bảo mật 223 hồ sơ và nút đăng nhập. | `VERIFIED` |
| `desktop_1440_lich.png` | `1440 x 906` | Desktop (1440px) | 80,497 | Full-page screenshot; Gateway Lịch với thông báo 265 mốc thời gian và nút đăng nhập. | `VERIFIED` |
| `laptop_1024_home.png` | `1024 x 2044` | Laptop (1024px) | 418,031 | Full-page screenshot; layout co dãn chuẩn tỷ lệ 1024px; không tràn lề; typography cân đối. | `VERIFIED` |
| `tablet_768_home.png` | `768 x 3144` | Tablet (768px) | 547,522 | Full-page screenshot; grid 2 cột tự chuyển đổi; chiều dài trang tăng hợp lý (3144px). | `VERIFIED` |
| `mobile_375_home.png` | `375 x 3469` | Mobile (375px) | 335,017 | Full-page screenshot; layout 1 cột dọc; không tràn ngang; padding 16px chuẩn di động. | `VERIFIED` |
| `mobile_375_login.png` | `375 x 812` | Mobile (375px) | 32,946 | Viewport screenshot; form đăng nhập ôm trọn màn hình điện thoại 375x812px. | `VERIFIED` |
| `mobile_375_admin_login.png` | `375 x 812` | Mobile (375px) | 16,374 | Viewport screenshot; giao diện đăng nhập Admin trên điện thoại; không vỡ khung. | `VERIFIED` |
| `mobile_375_gia_pha.png` | `375 x 1390` | Mobile (375px) | 88,525 | Full-page screenshot; thẻ Gateway Phả Hệ trên di động; nút bấm to bản, dễ thao tác. | `VERIFIED` |
| `mobile_375_lich.png` | `375 x 1309` | Mobile (375px) | 59,541 | Full-page screenshot; thẻ Gateway Lịch trên di động; hiển thị rõ quy tắc quản trị dữ liệu. | `VERIFIED` |

---

## 5. BROWSER QA CLAIM RECONCILIATION (ĐỐI SOÁT TỪNG TUYÊN BỐ VỚI CHỨNG CỨ GỐC)

| Tuyên bố trong báo cáo gốc | Chứng cứ đối chiếu (Artifact & Log) | Kết quả thẩm tra độc lập | Trạng thái |
| :--- | :--- | :--- | :---: |
| **40/40 static requests HTTP 200** | Playwright network log (lần gọi `browser_network_requests` lúc 10:41:52 ghi nhận 40 mục gồm CSS, JS, SVG, JPG, manifest đều có status `200` hoặc `204`). | Khớp chính xác. Không có request tĩnh nào bị 404 hoặc 500. | `VERIFIED` |
| **0 console errors/warnings khi boot** | Playwright console call lúc 10:41:29: `Total messages: 0 (Errors: 0, Warnings: 0)`. | Khớp chính xác. Phiên khởi tạo boot trang chủ hoàn toàn sạch lỗi. | `VERIFIED` |
| **8 vùng giao diện render đầy đủ** | Snapshot `page-2026-11-11T03-46-25-962Z.yml` và ảnh `desktop_1440_home.png`. | Khớp đầy đủ: Header, Hero, Ảnh sum họp, Cội nguồn F0, Dòng chảy 5 đời, Ảnh tiền bối, 3 Cửa trở về, Footer. | `VERIFIED` |
| **Hash navigation hoạt động** | Snapshots `03-46-25-962Z.yml` (`#coi-nguon`), `03-48-55-271Z.yml` (`/#/lich`), `03-49-14-240Z.yml` (`/#/gia-pha`), `03-51-53-456Z.yml` (`/#/mach`), `03-51-59-190Z.yml` (`/#/tu-lieu`). | Khớp chính xác. Mỗi hash kích hoạt đúng module hoặc cuộn đúng vị trí DOM tương ứng. | `VERIFIED` |
| **Back / Forward / Reload hoạt động** | Lệnh Playwright `page.goBack()` ghi nhận chuyển từ `/#/gia-pha` về `/#/lich` (snapshot `03-51-34-479Z.yml`). Lệnh reload `location.reload()` giữ nguyên trang `/#/lich`. | Khớp chính xác. Không gây trắng màn hình hay mất ngữ cảnh. | `VERIFIED` |
| **4 viewports không tràn ngang** | Lệnh `browser_evaluate` chạy hàm đo `scrollWidth > clientWidth` trả về `false` trên cả 4 kích thước: 1440px (1440/1440), 1024px (1024/1024), 768px (768/768), 375px (375/375). | Khớp 100% với số liệu đo lường kỹ thuật. | `VERIFIED` |
| **Member unauthenticated boundary** | Lệnh truy cập `/me` và `/me/tree` nhận 302 chuyển hướng về `/login` (snapshot `03-46-48-515Z.yml` và `03-46-55-941Z.yml`). | Khớp chính xác. Ranh giới khách vãng lai được bảo vệ chặt chẽ. | `VERIFIED` |
| **Admin unauthenticated boundary** | Truy cập `/admin` tự động redirect sang `/admin/login` (snapshot `03-47-01-654Z.yml` và `03-48-20-693Z.yml`). | Khớp chính xác. Giao diện quản trị không bị lộ. | `VERIFIED` |
| **Không có PII rò rỉ trong DOM** | Kiểm tra toàn bộ nội dung trong 13 file YAML snapshot ở trạng thái chưa đăng nhập: chỉ chứa thông tin công khai cấp cao (F0 Cụ Thu, Cụ Xuân, số lượng thống kê 223/68/185). | Khớp chính xác ở tầng Browser. | `VERIFIED` (Browser level) |

---

## 6. PREVIEW–PRODUCTION BOUNDARY (RANH GIỚI KIẾN TRÚC MÔI TRƯỜNG)

### 6.1. Sơ đồ Luồng Yêu cầu (Request Topology)

```text
                            NGƯỜI DÙNG TRÌNH DUYỆT (BROWSER)
                                           │
                                           ▼
                      [ VERCEL EDGE NETWORK (PREVIEW) ]
              Hostname: giatoctrantrongthu-git-release-v200-*.vercel.app
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    │                                             │
      [1. Tuyến Tài Nguyên Giao Diện]                [2. Tuyến API Rewrites (vercel.json)]
                    │                                             │
                    ▼                                             ▼
        - HTML Single Shell                            - /api/:path*
        - CSS Foundation (/src/css/*)                  - /login, /logout, /me
        - JS Modules (/src/js/*)                       - /assets/private/:path*
        - Static Assets (/assets/*)                               │
                    │                                             ▼
                    │                         [ CLOUDFLARE EDGE WAF & REVERSE PROXY ]
                    │                                Hostname: api.giatoctrantrongthu.com
                    │                                             │
                    │                                             ▼
                    │                           [ PRODUCTION NAS (SYNOLOGY TAILSCALE) ]
                    │                                IP: 100.80.147.119:3000 (family-api)
                    │                                             │
                    │                                             ▼
                    │                                   [ PRODUCTION MARIADB ]
                    │                                    Database: giatoc_db
                    │                                             │
                    └─────────────────────────────────────────────┘
```

### 6.2. Phân loại Môi trường Thành phần (Component Classification)

| Thành phần | Môi trường Thực thi | Bản chất Dữ liệu & Nguồn gốc | Rủi ro Phối hợp |
| :--- | :--- | :--- | :--- |
| **Giao diện Web (SPA)** | `Vercel Preview` | Mã nguồn từ commit `d4e982f` trên nhánh `release/v2.0.0`. | Không có rủi ro lên dữ liệu thật. |
| **Tài nguyên Hình ảnh Công khai**| `Vercel Preview` | Phục vụ trực tiếp từ thư mục `assets/` trên Vercel. | Đã lọc sạch PII và ảnh riêng tư. |
| **API Endpoints (`/api/*`)** | **`Production Backend`** | Express service trên NAS MariaDB Production. | **CẦN KIỂM SOÁT:** Bất kỳ mutation request nào đều tác động trực tiếp vào CSDL thật. |
| **Phiên Xác thực (`/login`, `/me`)**| **`Production Backend`** | Quản lý phiên bằng Session Cookie phát hành bởi Production Express. | Đăng nhập tài khoản thật từ Preview sẽ tạo session trên Production. |

---

## 7. API SECURITY EVIDENCE (ĐỐI SOÁT CÁC PHÁT HIỆN BẢO MẬT LỊCH SỬ)

### 7.1. Báo cáo đối chiếu DEF-03 (`/api/media.json` & `/api/person_media.json`)
Trong tài liệu `AUDIT/INDEPENDENT_VERIFICATION_REPORT.md` trước đây, phát hiện **DEF-03** ghi nhận:  
*`GET /api/media.json` và `GET /api/person_media.json` chưa có middleware `requireMemberOrAdmin`, làm lộ liên kết định danh người và tệp ảnh ra ngoài.*

**Kết quả đối chiếu với hiện trạng thực tế:**

1. **Trong mã nguồn Backend V2 (`server/index.js`):**  
   - Dòng 841: `app.get('/api/media.json', requireMemberOrAdmin, async (req, res) => {`
   - Dòng 858: `app.get('/api/person_media.json', requireMemberOrAdmin, async (req, res) => {`  
   *Nhận định:* Trong quá trình tái cấu trúc Backend V2 (commit `60a4389`), AGY đã chủ động bổ sung middleware bảo vệ `requireMemberOrAdmin` cho cả 2 endpoint này.
2. **Trong phiên kiểm thử GATE-R2 (Browser Waterfall):**  
   - Kiểm tra toàn bộ 40 network requests ghi nhận trong phiên Playwright lúc 10:41:52: **Hoàn toàn KHÔNG có request nào gọi tới `/api/media.json` hoặc `/api/person_media.json`**.
   - *Nguyên nhân:* Giao diện công khai V2.0.0 (`boot-public.js`) được thiết kế theo kiến trúc phi tập trung, nạp danh mục ảnh công khai từ tệp tĩnh `assets/ASSET_MANIFEST.json` thay vì gọi API động.
   - *Phân loại theo quy chuẩn:* **NOT TESTED IN THIS GATE (Chưa được kiểm thử qua browser trong cổng này)**.

### 7.2. Phân định rạch ròi 2 phạm vi bảo mật (Strict Security Separation)

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ PHẠM VI 1: QUAN SÁT CẤP TRÌNH DUYỆT (BROWSER-LEVEL OBSERVATION)                       │
│ - Trạng thái: VERIFIED                                                                 │
│ - Bằng chứng: Không có dữ liệu PII/phả hệ sâu trong DOM của các trang đã kiểm thử.      │
│ - Bằng chứng: Không có response chứa PII trong Network waterfall đã quan sát.         │
└────────────────────────────────────────────────────────────────────────────────────────┘
                                           ≠ (KHÔNG ĐỒNG NGHĨA)
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ PHẠM VI 2: BẢO ĐẢM AN NINH CẤP API (API-LEVEL SECURITY ASSURANCE)                     │
│ - Trạng thái: NOT TESTED IN THIS GATE (Dành cho kiểm thử API độc lập)                  │
│ - Nguyên tắc: Không dùng sự vắng mặt của request trong UI để suy diễn API đã an toàn.  │
│ - Ranh giới: Không tự tiện gửi request trực tiếp lên Production API ngoài phạm vi UI. │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. EVIDENCE GAPS (NHỮNG KHOẢNG TRỐNG CHỨNG CỨ CHƯA KHẢO SÁT)

Để đảm bảo tính trung thực tri thức tuyệt đối, AGY ghi nhận rõ các hạng mục chưa thể kiểm chứng trong GATE-R2:

1. **Trải nghiệm sau Đăng nhập của Thành viên (Authenticated Member Space):**  
   - Các tuyến `/me/tree`, `/me/events`, `/me/gallery`, `/me/mach` khi có phiên đăng nhập hợp lệ chưa được kiểm thử trong GATE-R2 vì tuân thủ quy tắc cấm sử dụng thông tin đăng nhập của Tuấn hoặc tài khoản thành viên thật trên môi trường Preview.
   - Trạng thái: `BLOCKED / AUTH_REQUIRED`.
2. **Luồng Biên tập & Duyệt Proposal trên Giao diện Admin:**  
   - Khả năng tạo, biên tập và phê duyệt Proposal trên UI Admin chưa được thao tác thực tế nhằm ngăn chặn việc phát sinh dữ liệu thử nghiệm trên CSDL MariaDB Production.
   - Trạng thái: `BLOCKED / MUTATION_PROTECTED`.
3. **Kiểm chứng Độc lập Runtime của `/api/media.json` trên Production NAS:**  
   - Mặc dù code đã có `requireMemberOrAdmin`, việc gọi trực tiếp endpoint này trên Production NAS để đo response HTTP 401 khi không có session chưa được thực hiện trong GATE-R2 (vì cổng này là Browser QA giao diện công khai).
   - Trạng thái: `NOT TESTED IN THIS GATE`.

---

## 9. RECONCILIATION MATRIX (MA TRẬN ĐỐI SOÁT TỔNG HỢP)

| Hạng mục kiểm tra | Phạm vi đánh giá | Trạng thái Chứng cứ | Căn cứ & Bằng chứng xác minh |
| :--- | :--- | :---: | :--- |
| **Deployment ID & Commit** | Deployment Provenance | `VERIFIED` | Vercel CLI inspect & thẻ `data-deployment-id` trên HTML Preview (`dpl_2kwzP4HMB1TE7tunKiCvA6DYYr4S` @ `d4e982f`). |
| **Tệp Ảnh chụp Màn hình** | Screenshot Inventory | `VERIFIED` | Đủ 12 tệp PNG, đúng kích thước 1440, 1024, 768, 375px, lưu tại `docs/audit/screenshots/`. |
| **Raw Browser Logs** | Console & Network Logs | `VERIFIED` | Đủ 13 file YAML snapshot và 2 file log console trong thư mục `.playwright-mcp/`. |
| **HTTP 200 Static Assets** | Network Waterfall | `VERIFIED` | 40/40 requests thành công, không có 404/500 trong phiên khởi tạo trang chủ. |
| **Dynamic Shell Boot** | UI Initialization | `VERIFIED` | Single-shell `#gi-app` nạp đầy đủ 8 phân vùng, 0 console error lúc boot. |
| **Responsive Adaptability** | Multi-device Layout | `VERIFIED` | Đo lường thực tế qua JS `scrollWidth === clientWidth` trên 4 viewports (`hasHorizontalScroll: false`). |
| **Hash Routing & Gateways** | Navigation & Fallbacks | `VERIFIED` | Thử nghiệm thực tế 5 hash routes, back button, reload và fallback route. |
| **Ranh giới Chưa Đăng nhập** | Browser Privacy Boundary | `VERIFIED` | Chuyển hướng an toàn về `/login`, không có PII phả hệ rò rỉ vào DOM. |
| **Bảo vệ Endpoint Media** | API Security Assurance | `NOT TESTED IN THIS GATE` | Code `server/index.js` đã gắn middleware; UI công khai không gọi API này trong phiên kiểm thử. |
| **Không gian Thành viên Sau Đăng nhập** | Authenticated Flow | `BLOCKED` | Chưa kiểm thử để bảo vệ an toàn danh tính và dữ liệu Production. |

---

## 10. RECOMMENDED DECISION (KHUYẾN NGHỊ KỸ THUẬT CHO EMARALD & TUẤN)

Căn cứ trên các chứng cứ đối soát pháp y đã được làm rõ:

1. **Khuyến nghị cho Emarald (Architecture & QC):**  
   * Đủ điều kiện kỹ thuật để chính thức gỡ bỏ điều kiện tạm thời, công nhận **GATE-R2: PASSED (VERIFIED)** đối với phạm vi *Kiểm thử Trình duyệt Công khai và Ranh giới Bảo vệ Giao diện (Public Browser QA & Interface Boundary)*.
   * Ghi nhận phân loại kiến trúc **PREVIEW FRONTEND + PRODUCTION BACKEND** vào hồ sơ kiểm toán chung để chuẩn bị giải pháp cách ly hoặc đồng bộ cho các cổng tiếp theo.
2. **Khuyến nghị cho Tuấn (Human Final Authority):**  
   * Phê duyệt nghiệm thu **GATE-R2**.
   * Chưa kích hoạt GATE-R3 ngay lập tức. Chờ Emarald hoàn tất bản đánh giá QC kiến trúc độc lập trên cơ sở báo cáo đối soát này trước khi ban hành chỉ thị tiếp theo.

