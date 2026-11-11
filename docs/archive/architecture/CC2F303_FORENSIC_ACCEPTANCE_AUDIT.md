# FORENSIC ACCEPTANCE AUDIT: COMMIT cc2f303
**Project:** Gia Tộc Trần Trọng Thu
**Target:** Independent verification of Cline's implementation report for commit `cc2f303`.

---

## 7. CRITICAL CONCLUSION (TL;DR)

**Câu hỏi cốt lõi:** Có phải commit cc2f303 thực sự đã đưa application về trạng thái functional như Cline tuyên bố hay không?

**KẾT LUẬN: KHÔNG.** 
Commit `cc2f303` có viết code đúng chức năng trong source, nhưng **THẤT BẠI HOÀN TOÀN Ở RUNTIME (PRODUCTION)**. Trình duyệt của Owner không hiển thị dữ liệu thật (Ký Ức, Thế hệ) vì file JS đã bị "đóng băng" ở bản cũ do lỗi bộ nhớ đệm (Cache-buster). Đồng thời, lỗi sai Favicon và mất Logo Mobile hoàn toàn chưa được khắc phục.

**A. WHAT IS ACTUALLY WORKING:** 
- Nút A-/A+ đã được gỡ khỏi Navigation và chuyển thành Floating UI (do HTML thay đổi nên cập nhật ngay lập tức).
- Khung sườn HTML của module "Ký ức & Ghi chép" đã xuất hiện trên trang.

**B. WHAT IS ACTUALLY BROKEN:** 
- Cache-buster: Code gọi `<script src="src/js/app.js?v=20260906_0105">` KHÔNG ĐƯỢC CẬP NHẬT. Trình duyệt của user vẫn chạy file JS từ ngày 06/09/2026.
- Logo Mobile: Hoàn toàn vắng bóng. Màn hình điện thoại bị ép dùng logo Ngang (có chữ) thay vì logo icon-only.
- Favicon: Sai file.

**C. WHAT IS ONLY SOURCE-CODE CLAIM:** 
- "Đã phục hồi dữ liệu Ký ức và Stats Thế hệ". (Đúng trong source code `app.js` của `cc2f303`, nhưng vô dụng ở Production vì `app.js` bị cache).

**D. WHAT IS ONLY PLACEHOLDER:** 
- Ký ức: Bị kẹt ở Empty State `<!-- Rendered dynamically from appData.memories -->` vì JS không chạy để fill data vào.
- Thống kê thế hệ: Bị kẹt ở `—`.
- Tư liệu gốc: Giữ nguyên placeholder "Đang xây dựng" (hợp lý vì backend thiếu metadata).

**E. WHAT WAS REGRESSED:** 
- Quy tắc responsive logo Mobile (`max-width: 639px` dùng `logoGiaToc.svg`) đã bị xóa từ các commit trước và `cc2f303` KHÔNG khôi phục lại.

**F. WHAT MUST BE RESTORED:** 
- Cập nhật Cache-Buster string cho `app.js` và `main.css` trong `index.html`.
- Thêm lại `<source media="(max-width: 639px)" srcset="assets/images/logoGiaToc.svg">` vào `<picture>`.
- Sửa thẻ Favicon link thành `href="assets/images/logoGiaToc.svg"`.

**G. WHAT MUST NOT BE TOUCHED:** 
- Dữ liệu API, cấu trúc HTML `#view_home`, và logic parse ICS lịch.

---

## 1. DEPLOYMENT TRUTH

- **HEAD local/main:** `cc2f30344fdf9c35575f7a82ccaeb1752e0172b9`
- **Vercel Deployment / Production:** Đã deploy thành công lên `giatoctrantrongthu.com`. Lệnh `curl` xác nhận thẻ `<section class="publication-section ky-uc-section">` (mới thêm trong `cc2f303`) CÓ TỒN TẠI trong file `index.html` live.
- **Nghịch lý:** HTML là bản mới nhất (`cc2f303`), nhưng JS và CSS bị kẹt ở bản cũ.

---

## 2. LOGO FORENSIC

**A. Desktop ≥1024:**
- *Asset HTML gọi:* `logoGiaToc_original.svg` (Dạng dọc).
- *Kết luận:* SOURCE-CODE CORRECT.

**B. Narrow (Tablet / Mobile):**
- *Asset HTML gọi:* `logoGiaToc_ngang.svg` (Dạng ngang) được đặt làm `<img>` mặc định.
- *Thực trạng:* Do KHÔNG CÓ rule dành riêng cho Mobile (`< 640px`), màn hình điện thoại bé tí vẫn bị ép hiển thị logo Ngang có chữ. Điều này đi ngược hoàn toàn với Brand System (Mobile phải dùng icon-only).
- *Kết luận:* SOURCE-CODE FAIL, VISUAL FAIL.

**C. Favicon:**
- *Asset HTML gọi:* `<link rel="icon" type="image/svg+xml" href="assets/images/logoGiaToc_favicon.svg">`.
- *Thực trạng:* Owner yêu cầu sử dụng icon `logoGiaToc.svg` nguyên bản. Việc gọi nhầm file "favicon" (do tàn dư của commit trước) khiến logo hiển thị sai.
- *Kết luận:* SOURCE-CODE FAIL, VISUAL FAIL.

---

## 3. REAL DATA FORENSIC (RUNTIME VERIFICATION)

API data (`genealogy.json`, `mach.json`) nạp thành công ở background, nhưng quá trình kết xuất (Render) ra Homepage bị gãy ngang (Broken Pipeline).

- **Số stories MẠCH load:** ~20 (Thành công).
- **Số memories load:** 2 (Có trong RAM `appData.memories`).
- **Stats load:** 228 individuals, 68 families, 5 derived generations (Có trong RAM).
- **Render thực tế trên DOM Homepage:** 
  - Module MẠCH: **REAL DATA** (Do `app.js` bản cũ đã có code này).
  - Module Ký Ức: **BROKEN** (Thẻ HTML `#kyUcCard` rỗng tuếch, do `app.js` bản cũ không có code render Ký ức).
  - Module Thế Hệ: **BROKEN** (Chữ `—`).

---

## 4. HOMEPAGE FORENSIC (MODULE BY MODULE)

| Module | SOURCE | LOADER | STATE | RENDERER (app.js) | DOM RESULT (Production) |
|---|---|---|---|---|---|
| **Masthead** | HTML | N/A | N/A | N/A | Lỗi thiếu Mobile Logo |
| **A-/A+** | HTML | N/A | N/A | N/A | Đã ra khỏi Nav, nằm lơ lửng góc dưới (Thành công) |
| **Lead MẠCH**| Backend | `mach.json` | `machData` | Bản cũ chạy tốt | Hiện bài đinh |
| **Ký Ức** | Backend | `genealogy.json` | `appData.memories` | **BỊ ĐỨT** (Lỗi Cache) | Khung HTML trắng |
| **Thế hệ Stats**| Backend| Tự tính toán | `derivedGenerations` | **BỊ ĐỨT** (Lỗi Cache) | Hiển thị `—` |

**Điểm đứt gãy (Chain Break):** Nằm tại thẻ `<script src="src/js/app.js?v=20260906_0105"></script>`. Việc không cập nhật Version String khiến browser từ chối nạp code Renderer mới.

---

## 5. REGRESSION AUDIT (48965ae vs cc2f303)

- **Loader/API:** Giữ nguyên, an toàn.
- **Route:** Giữ nguyên 19 routes.
- **Thêm mới (Code):** Cập nhật hàm `renderHomePublicationLanding()` để chèn Ký ức và đếm số thế hệ.
- **Thêm mới (HTML):** Chèn vùng `<section>` cho Ký ức.
- **Regression chí mạng:** 
  1. Không hề khôi phục `max-width: 639px` cho Logo.
  2. Bỏ quên Cache-Buster.

---

## 6. CLINE REPORT VERIFICATION

Đánh giá từng tuyên bố (claim) của Cline:

| Claim | Phân loại | Evidence / Lý do |
|---|---|---|
| 1. Files changed | PASS | Đúng là 3 files đã được sửa trong commit. |
| 2. Real Data Pipelines Restored | **FAIL** | Code có phục hồi, nhưng Production sụp vì lỗi Cache-buster. Owner không nhìn thấy gì. |
| 3. 19 routes preserved | PASS | Các routes cũ vẫn hoạt động. |
| 4. Logo responsive behavior | **FAIL** | Điện thoại (Mobile) vẫn không có logo icon-only. |
| 5. A-/A+ floating | PASS | Đã rời khỏi Navigation và hoạt động tốt. |
| 6. Tư Liệu placeholder | PASS | Giữ nguyên trạng thái honest placeholder. |
| 7. Production deployment | **PARTIAL** | Vercel có build HTML, nhưng JS/CSS kẹt ở quá khứ. |
