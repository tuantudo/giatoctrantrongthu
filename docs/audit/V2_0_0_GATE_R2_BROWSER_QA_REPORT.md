# BÁO CÁO KIỂM THỬ GIAO DIỆN & TRÌNH DUYỆT (BROWSER QA & UI VERIFICATION) — GATE-R2
**Dự án:** Gia Tộc Trần Trọng Thu  
**Phiên bản kiểm thử:** V2.0.0 (Dynamic Platform Release)  
**Môi trường kiểm thử:** Vercel Preview (Playwright Chromium Headless & Real DOM Evaluation)  
**Thẩm quyền phê duyệt cuối cùng:** Tuấn (Human Final Authority)  
**Kiểm soát kiến trúc & QC:** Emarald (Strategic Architecture & QC Authority)  
**Thực thi:** AGY (Primary Execution Authority)  
**Thời điểm thực thi:** 2026-11-11  
**Phân loại:** NGHIÊM NGẶT CHỈ ĐỌC (STRICT READ-ONLY)

---

## 1. TỔNG QUAN THỰC THI (EXECUTIVE SUMMARY)

Thực hiện chỉ thị **GATE-R2**, AGY đã tiến hành kiểm thử thực tế trên trình duyệt thực nghiệm (Playwright Chromium) đối với bản phát hành V2.0.0 đang triển khai tại Vercel Preview.

Quá trình kiểm thử đã khảo sát đầy đủ 4 cấp độ chứng cứ:
1. **HTTP Network Response:** Xác minh toàn bộ 40 requests static, mã HTML shell, các gói JavaScript modules, CSS foundation và hình ảnh tư liệu tải thành công 100% (HTTP 200).
2. **Application Boot:** Khởi tạo thành công dynamic single-shell (`#gi-app`), thực thi `boot-public.js`, nạp asset manifest, kích hoạt typography tokens và router.
3. **UI Rendering:** Giao diện rendered hoàn chỉnh, không có hiện tượng màn hình trắng, không giật layout, không loading vô hạn.
4. **Functional & Responsive Interaction:** Kiểm thử tương tác điều hướng nội bộ, Back/Forward browser, hash routing, invitation gateways, form render, và đo đạc chính xác tràn viền (horizontal overflow) trên 4 viewport chuẩn (`375px`, `768px`, `1024px`, `1440px`).

**Kết quả tổng quát:** Toàn bộ phạm vi công khai (Public Surface), phân định ranh giới thành viên (Member Boundary) và cổng quản trị (Admin Control Room Boundary) đều đạt chuẩn **VERIFIED**. Ranh giới an ninh dữ liệu gia phả được bảo vệ nghiêm ngặt: không có bất kỳ thông tin phả hệ riêng tư, PII hay ghi chép nội bộ nào bị rò rỉ vào DOM khi chưa đăng nhập.

---

## 2. ĐỊNH DANH BẢN DEPLOYMENT & COMMIT SHA (DEPLOYMENT IDENTITY)

- **Target Preview URL:** [https://giatoctrantrongthu-git-release-v200-tuantqs-projects-74ccf90b.vercel.app](https://giatoctrantrongthu-git-release-v200-tuantqs-projects-74ccf90b.vercel.app)
- **Deployment URL:** `https://giatoctrantrongthu-l9nlyido3-tuantqs-projects-74ccf90b.vercel.app`
- **Vercel Deployment ID:** `dpl_2kwzP4HMB1TE7tunKiCvA6DYYr4S`
- **Target Release Branch:** `release/v2.0.0`
- **Verified Commit SHA:** `d4e982f8132d001c56c1ea364e32876cce26b9dd` (HEAD của `origin/release/v2.0.0`)
- **Môi trường Vercel:** `Preview` (Hoàn toàn độc lập với Production)
- **Production URL Đối chiếu:** `https://giatoctrantrongthu.com` (Đã xác minh nguyên vẹn, đang chạy phiên bản tĩnh từ commit `42a7ed2`).

---

## 3. RANH GIỚI MÔI TRƯỜNG PREVIEW & API (ENVIRONMENT BOUNDARY)

- **Cơ chế Proxy / Rewrite của Vercel:**  
  Theo cấu hình `vercel.json` trên nhánh release:
  * Tuyến giao diện: Toàn bộ static assets, CSS, JS, hình ảnh được phục vụ trực tiếp từ CDN Vercel Edge.
  * Tuyến API Backend:
    - `/api/:path*` ➔ Rewrite tới `https://api.giatoctrantrongthu.com/api/:path*`
    - `/login` ➔ Rewrite tới `https://api.giatoctrantrongthu.com/login`
    - `/logout` ➔ Rewrite tới `https://api.giatoctrantrongthu.com/logout`
    - `/me` & `/me/:path*` ➔ Rewrite tới `https://api.giatoctrantrongthu.com/me`
- **Bản chất hạ tầng Backend:**  
  `https://api.giatoctrantrongthu.com` đi qua Cloudflare Edge Proxy tới dịch vụ Production Express và MariaDB trên NAS Synology (`100.80.147.119:3000`).
- **Ghi chú ranh giới (Crucial Boundary Note):**  
  *Frontend là Preview nhưng các API rewrites đang kết nối tới Production API.*  
  Do đó, trong suốt phiên kiểm thử GATE-R2, AGY đã chấp hành tuyệt đối nguyên tắc **STRICT READ-ONLY**: không gửi payload tạo/sửa dữ liệu (mutation POST/PUT/DELETE), không đăng nhập tài khoản thật, không tạo Proposal hay tác động tới MariaDB.

---

## 4. KẾT QUẢ KHỞI TẠO ỨNG DỤNG (APPLICATION BOOT RESULTS)

- **Đường dẫn kiểm tra:** `/`
- **Trạng thái:** `VERIFIED`
- **Tiêu chí kiểm chứng:**
  * Shell HTML tải về chứa container `#gi-app` và script `boot-public.js`.
  * Script `boot-public.js` thực thi không lỗi, gán typography stack và thiết lập `dataset.viewport`.
  * Tải thành công `assets/ASSET_MANIFEST.json` và logo SVG (`logoGiaToc_ngang.svg`).
  * Render đầy đủ các vùng giao diện chính:
    1. Header & Navigation công khai ("Điều hướng công khai").
    2. Hero Banner: *"NĂM THẾ HỆ TIẾP NỐI. MỘT CỘI NGUỒN CHUNG."*
    3. Ảnh tư liệu gia đình sum họp hậu duệ Cụ Giuse Trần Trọng Thu.
    4. Cội nguồn tiền nhân: Hồ sơ Cụ Giuse Trần Trọng Thu (F0) và Cụ bà Nguyễn Thị Xuân.
    5. Dòng chảy gia tộc: Thống kê 5 thế hệ, 223 thành viên, 68 mái ấm gia đình, 185 di ảnh & tư liệu.
    6. Dãy ảnh các bậc tiền bối qua các thế hệ.
    7. Cụm liên kết "Những Cánh Cửa Trở Về" (Cây Phả Đồ, Lịch Giỗ & Niên Biểu, Kho Di Ảnh).
    8. Footer thông tin lưu truyền và liên kết cộng đồng.
- **Console Errors:** 0 errors, 0 warnings trong quá trình boot.
- **Evidence:** Ảnh chụp màn hình `docs/audit/screenshots/desktop_1440_home.png`.

---

## 5. KẾT QUẢ ĐIỀU HƯỚNG CÔNG KHAI (PUBLIC NAVIGATION & ROUTING)

- **Trạng thái:** `VERIFIED`
- **Ma trận kiểm thử các tuyến đường dẫn (Route Matrix):**

| Tuyến URL / Hash | Hành vi thực tế trên trình duyệt | DOM Evidence / Phản hồi | Trạng thái |
| :--- | :--- | :--- | :---: |
| `/` | Khởi tạo trang nhất công khai (Single-shell dynamic) | Render đầy đủ 8 vùng nội dung | `VERIFIED` |
| `/#coi-nguon` | Cuộn mượt (smooth scroll) tới khu vực Cội nguồn tiền nhân | Hash cập nhật, scroll position chuyển dịch chính xác | `VERIFIED` |
| `/#dong-chay` | Cuộn mượt tới khu vực thống kê 5 thế hệ và di ảnh | Hash cập nhật, viewport định vị đúng section | `VERIFIED` |
| `/#khong-gian` | Cuộn mượt tới khu vực 3 cánh cửa trở về | Hash cập nhật, focus đúng cụm thẻ liên kết | `VERIFIED` |
| `/#/gia-pha` | Nhận diện Gateway Route, render Invitation Gateway Phả Hệ | Tiêu đề: *Cây Phả Hệ & Hồ Sơ Dòng Dõi*, kèm nút Đăng nhập | `VERIFIED` |
| `/#/lich` | Nhận diện Gateway Route, render Invitation Gateway Lịch Gia Tộc | Tiêu đề: *Sổ Lịch Giỗ Tết & Lễ Bổn Mạng*, kèm nút Đăng nhập | `VERIFIED` |
| `/#/mach` | Nhận diện Gateway Route, render Invitation Gateway MẠCH | Tiêu đề: *Không Gian Tri Thức & Biên Tập MẠCH* | `VERIFIED` |
| `/#/tu-lieu` | Nhận diện Gateway Route, render Invitation Gateway Di Ảnh | Tiêu đề: *Kho Lưu Trữ Di Ảnh & Bút Tích Lịch Sử* | `VERIFIED` |
| `/#/invalid-hash` | Fallback graceful về trang nhất công khai | Không lỗi JS, không giật màn hình trắng | `VERIFIED` |

- **Kiểm thử Điều hướng Trình duyệt (Browser History & Reload):**
  * `Back Button`: Chuyển từ `/#/gia-pha` quay lại `/#/lich` tức thì và render đúng nội dung gateway trước đó (`VERIFIED`).
  * `Page Reload`: Tải lại trang trực tiếp tại `/#/lich` vẫn giữ nguyên trạng thái render đúng của gateway, không bị văng về trang trắng (`VERIFIED`).

---

## 6. KẾT QUẢ RANH GIỚI THÀNH VIÊN (MEMBER EXPERIENCE — PUBLIC BOUNDARY)

- **Trạng thái:** `VERIFIED`
- **Khảo sát trạng thái chưa đăng nhập (Unauthenticated):**
  * **Truy cập `/login`:**  
    Giao diện đăng nhập chuẩn mực hiển thị form: Tài khoản, Mật khẩu, nút "Đăng nhập", và liên kết "← Trở về trang công khai". Layout căn giữa trang nhã, không lỗi CSS. (Screenshot: `desktop_1440_login.png`, `mobile_375_login.png`).
  * **Truy cập `/me` (Không gian cá nhân):**  
    Hệ thống phát hiện phiên chưa định danh, tự động điều hướng 302 về `/login`.
  * **Truy cập `/me/tree` (Cây phả hệ thành viên):**  
    Tự động chuyển hướng bảo vệ về `/login`.
  * **Kiểm toán rò rỉ dữ liệu (PII / Data Leakage Audit):**  
    Khảo sát toàn bộ cây DOM và Network waterfall ở trạng thái công khai: Không có bất kỳ bản ghi PII nào (ngày sinh, số điện thoại, mối quan hệ chi tiết, ghi chú nhạy cảm) bị nạp vào bộ nhớ trình duyệt. Mọi dữ liệu sâu đều bị chặn lại tại lớp Gateway Invitation.

---

## 7. KẾT QUẢ CỔNG QUẢN TRỊ (ADMIN CONTROL CENTER — PUBLIC BOUNDARY)

- **Đường dẫn kiểm tra:** `/admin`
- **Trạng thái:** `VERIFIED`
- **Hành vi thực tế:**
  1. Khi truy cập `https://giatoctrantrongthu-git-release-v200-tuantqs-projects-74ccf90b.vercel.app/admin`, mã JavaScript Admin khởi tạo và gọi `/api/auth/me` để thẩm tra phiên.
  2. Yêu cầu `/api/auth/me` phản hồi HTTP 401 Unauthorized (đây là hành vi an ninh bảo vệ mong đợi).
  3. Client script của Admin bắt mã 401, tự động chuyển hướng nội bộ tới `/admin/login` ("CONTROL ROOM — Đăng nhập").
  4. Giao diện đăng nhập Admin hiển thị rõ ràng với 2 trường "Tên đăng nhập", "Mật khẩu" và nút "Đăng nhập".
  5. Toàn bộ các module quản trị nhạy cảm (Proposal Inbox, People Editorial, Audit Log) được che chắn tuyệt đối, không mount khi phiên chưa được cấp quyền Owner.
- **Evidence:** Ảnh chụp `docs/audit/screenshots/desktop_1440_admin_login.png`.

---

## 8. MA TRẬN ĐÁP ỨNG ĐA THIẾT BỊ (RESPONSIVE MATRIX — 4 VIEWPORTS)

Đã đo đạc và kiểm tra thực tế bằng Playwright trên cả 4 kích thước màn hình theo quy chuẩn:

| Viewport Class | Kích thước (WxH) | Tràn viền ngang (`scrollWidth > clientWidth`) | Header & Menu | Typography & Layout | Đánh giá trực quan |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Mobile** | `375 x 812 px` | **KHÔNG** (`375 === 375`) | Tự động thích ứng, các link bọc gọn gàng | Cỡ chữ co dãn mượt mà, căn lề 16px chuẩn Brand | `VERIFIED` |
| **Tablet** | `768 x 1024 px` | **KHÔNG** (`768 === 768`) | Thanh điều hướng dàn đều | Grid 2 cột tự cân bằng, card hiển thị cân đối | `VERIFIED` |
| **Laptop** | `1024 x 768 px` | **KHÔNG** (`1024 === 1024`) | Hiển thị desktop bar | Bố cục chuẩn tỷ lệ vàng, hình ảnh sắc nét | `VERIFIED` |
| **Desktop** | `1440 x 900 px` | **KHÔNG** (`1440 === 1440`) | Cố định phía trên | Tối ưu không gian lớn, lề căn giữa 1200px | `VERIFIED` |

- **Kết luận tràn viền:** 100% các viewport đều có `hasHorizontalScroll === false`. Không có hiện tượng chữ bị cắt cụt hay nút bấm bị che khuất.

---

## 9. GHI NHẬN CONSOLE & MẠNG (CONSOLE & NETWORK FINDINGS)

### 9.1. Console Logs
- **Số lượng lỗi nghiêm trọng:** 0 lỗi.
- **Số lượng cảnh báo (Warnings):** 0 cảnh báo.
- **Ghi nhận ngoại lệ mạng:** Có 1 loại HTTP 401 được ghi nhận khi truy cập `/admin` (`/api/auth/me` trả về 401).
- **Phân loại bản chất:** `Expected Security Denial` (Hành vi an ninh chuẩn khi khách vãng lai chưa đăng nhập truy cập trang quản trị; không phải lỗi code hay lỗi cú pháp ứng dụng).

### 9.2. Network Requests
- **Tổng số request trong phiên boot:** 40 requests.
- **Tỷ lệ thành công tài nguyên tĩnh:** 100% (Mã phản hồi HTTP 200).
- **Tài nguyên tải về:**
  * CSS: `foundation.css`, `tokens.css`, `layout.css`, `components.css`, `states.css`.
  * JS: `boot-public.js`, `navigation.js`, `shell.js`, `public-home.js`, `gateway.js`, `assets.js`, `tokens.js`, `dom.js`, `components.js`, `visibility.js`, v.v.
  * Media: `logoGiaToc_ngang.svg`, `logoGiaToc_favicon.svg`, `Haudue-ongThu-baSa.jpg`, các avatar đại diện tiền bối.

---

## 10. SỔ THEO DÕI KHUYẾT TẬT (DEFECT REGISTER)

| Defect ID | Phân hệ / Route | Viewport | Mức độ nghiêm trọng | Hiện tượng | Kết luận & Đề xuất |
| :---: | :---: | :---: | :---: | :--- | :--- |
| *NONE* | N/A | N/A | N/A | Không phát hiện lỗi chức năng, lỗi cú pháp hoặc lỗi giao diện nào trên phạm vi kiểm thử công khai. | Không yêu cầu bản vá mã nguồn. |

---

## 11. DANH MỤC ẢNH CHỤP BẰNG CHỨNG (SCREENSHOT MANIFEST)

Toàn bộ ảnh chụp màn hình thực tế bằng Playwright đã được lưu trữ có cấu trúc tại thư mục `docs/audit/screenshots/`:

1. `docs/audit/screenshots/desktop_1440_home.png` — Trang nhất công khai trên Desktop (1440x900, full page).
2. `docs/audit/screenshots/desktop_1440_login.png` — Cổng đăng nhập thành viên trên Desktop (1440x900).
3. `docs/audit/screenshots/desktop_1440_admin_login.png` — Cổng đăng nhập Control Room trên Desktop (1440x900).
4. `docs/audit/screenshots/desktop_1440_gia_pha.png` — Invitation Gateway Phả Hệ trên Desktop (1440x900).
5. `docs/audit/screenshots/desktop_1440_lich.png` — Invitation Gateway Lịch Gia Tộc trên Desktop (1440x900).
6. `docs/audit/screenshots/laptop_1024_home.png` — Trang nhất công khai trên Laptop (1024x768).
7. `docs/audit/screenshots/tablet_768_home.png` — Trang nhất công khai trên Tablet (768x1024).
8. `docs/audit/screenshots/mobile_375_home.png` — Trang nhất công khai trên Mobile (375x812).
9. `docs/audit/screenshots/mobile_375_login.png` — Cổng đăng nhập thành viên trên Mobile (375x812).
10. `docs/audit/screenshots/mobile_375_admin_login.png` — Cổng đăng nhập Control Room trên Mobile (375x812).
11. `docs/audit/screenshots/mobile_375_gia_pha.png` — Invitation Gateway Phả Hệ trên Mobile (375x812).
12. `docs/audit/screenshots/mobile_375_lich.png` — Invitation Gateway Lịch Gia Tộc trên Mobile (375x812).

---

## 12. GIỚI HẠN & VÙNG CHƯA KHẢO SÁT (LIMITATIONS / BLOCKED / UNKNOWN)

- **Chức năng sau đăng nhập (Authenticated Member Space & Owner Admin Actions):**  
  *Trạng thái:* `BLOCKED / AUTH_REQUIRED`.  
  *Lý do:* Tuân thủ nghiêm ngặt nguyên tắc chỉ đạo của Tuấn tại Mục 3: không sử dụng tài khoản thật, không đăng nhập tài khoản Owner và không gửi mutation requests lên Production API từ Preview.
- **Khả năng tương tác sâu của Proposal Engine:**  
  *Trạng thái:* Đã được kiểm chứng qua bộ kiểm thử E2E 12 test case trên backend Production ở Phase trước, nhưng chưa tương tác trực tiếp qua form UI Preview để tránh tạo rác dữ liệu trên MariaDB Production.

---

## 13. PHÁN QUYẾT TỔNG THỂ GATE-R2 (OVERALL GATE-R2 VERDICT)

```text
================================================================================
                    GATE-R2 VERDICT: PASSED (VERIFIED)
================================================================================
- Application Boot & Dynamic Single-Shell:              VERIFIED
- Public Routing & Gateway Navigation:                  VERIFIED
- Member Experience Boundary (Unauthenticated):         VERIFIED
- Admin Control Room Boundary (Unauthenticated):        VERIFIED
- Responsive Adaptability (375, 768, 1024, 1440px):     VERIFIED
- Horizontal Scroll Overflow (All Viewports = 0):       VERIFIED
- Runtime Console & Network Integrity:                  VERIFIED
- Data Privacy & PII Leakage Protection:                VERIFIED
================================================================================
```

---

## 14. ĐỀ XUẤT BƯỚC TIẾP THEO (RECOMMENDED NEXT ACTION)

1. Bàn giao báo cáo và bằng chứng kiểm thử trình duyệt cho **Emarald** thẩm định QC kiến trúc.
2. Trình **Tuấn** xem xét phê duyệt hoàn tất **GATE-R2**.
3. Khi Tuấn phê duyệt GATE-R2, chuyển sang chuẩn bị kế hoạch phát hành chính thức:
   - **GATE-R3:** Chuẩn bị kế hoạch chuyển đổi Production (Staging validation, DNS/Cloudflare cutover strategy, rollback procedure) mà không gây gián đoạn dịch vụ.

