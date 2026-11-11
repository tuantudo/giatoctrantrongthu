# CHANGE-001 GATE 6 INCIDENT REPORT
**Role:** AGY (Independent Verifier)
**Target:** `https://giatoctrantrongthu.com/`
**Status:** CHANGE-001 = OPEN | PREVIOUS GATE 6 PASS = INVALID / DISPUTED | CURRENT VERIFICATION = FAIL

---

## 1. INVESTIGATION: WHY DID THE PREVIOUS VERIFICATION PRODUCE A FALSE PASS?

Báo cáo PASS trước đó là **SAI LỆCH (FALSE PASS)** do lỗ hổng trong phương pháp kiểm định của AGY:
- AGY đã sử dụng kịch bản Node.js để tải mã nguồn `app.js` và kiểm tra sự tồn tại của chuỗi ký tự (`jsContent.includes('kyUcCard.innerHTML')`).
- AGY đã đánh đồng việc "Mã nguồn tồn tại" (Source PASS) với "Trình duyệt thực thi thành công" (Runtime PASS). AGY không hề thực hiện bước Parse (Biên dịch) JavaScript.
- AGY đã hiểu sai chỉ thị về Responsive Logo, tự ý đánh giá việc thiếu vắng thẻ `<source>` dành cho Mobile là "hợp quy".

---

## 2. ESTABLISHING ACTUAL PRODUCTION STATE (EVIDENCE-BASED)

### A. What exact deployment serves the Owner's URL?
- **Evidence:** `curl -I https://giatoctrantrongthu.com/` trả về Header `last-modified: Mon, 14 Sep 2026 04:20:46 GMT` (tương ứng 11:20:46 theo giờ local). ETag khớp với lần build ngay sau commit `ccf4582`.
- **Kết luận:** Vercel đang phục vụ chính xác deployment mới nhất. Không có lỗi do luồng Deploy.

### B. What exact index.html does the Owner's URL return?
- **Evidence:** Source HTML live chứa chính xác `<link rel="stylesheet" href="src/css/main.css?v=20260914_0101">`.
- **Kết luận:** HTML trả về là bản HTML mới nhất.

### C. What exact JS and CSS assets does that HTML reference?
- **JS:** `src/js/app.js?v=20260914_0100`
- **CSS:** `src/css/main.css?v=20260914_0101`

### D. What exact JS/CSS assets does the browser actually load?
- Browser bắt buộc phải nạp các file tĩnh mới nhất do query string (cache-buster) đã thay đổi, ép browser bỏ qua disk cache.

### E. Is there any stale cache, CDN, service worker, browser cache, or deployment mismatch?
- Không. CDN trả về HIT nhưng với `max-age=0, must-revalidate`. Service worker không tồn tại. Cache-buster string đã ép browser làm mới file JS. 

### F. Tại sao Owner vẫn nhìn thấy trang chủ cũ kỹ/bị hỏng?
- **Root Cause (Nguyên nhân gốc rễ): FATAL JAVASCRIPT SYNTAX ERROR.**
- **Evidence:** Khi chạy kiểm tra cú pháp trực tiếp file JS đang live (`node -c src/js/app.js`), Node.js ném ra exception:
  ```text
  src/js/app.js:2048
  }
  ^
  SyntaxError: Unexpected token '}'
  ```
- **Hậu quả Runtime:** Vì file `app.js` chứa dấu ngoặc nhọn `}` thừa ở dòng 2048, toàn bộ file JS bị lỗi cú pháp ngay khi trình duyệt vừa tải về. Trình duyệt (Chrome/Safari) sẽ **hủy bỏ hoàn toàn việc thực thi file JS này**. Hàm `renderHomePublicationLanding` không bao giờ được gọi. Hệ thống định tuyến (Routing) tê liệt.

### G. Tại sao Ký Ức, Thế hệ, Favicon và Responsive Logo không hiển thị?
1. **Ký Ức & Thế hệ (JavaScript):** Do JS chết ngay từ vòng gửi xe (Syntax Error), mọi thao tác chèn DOM (`kyUcCard.innerHTML`, `statGenerations.textContent`) đều không xảy ra. Giao diện kẹt lại ở HTML Placeholder rỗng.
2. **Favicon (Cache Issue):** Mặc dù HTML đã đổi thành `href="assets/images/logoGiaToc.svg"`, nhưng các trình duyệt thường cache Favicon cực kỳ hung hãn và liên kết theo URL domain gốc. Do thẻ link thiếu cache-buster string (VD: `?v=2`), trình duyệt của Owner không có động lực để load lại icon mới và tiếp tục dùng icon cũ trong bộ nhớ.
3. **Responsive Logo (Missing Code):** Thẻ `<picture>` trong HTML hiện tại chỉ có 1 thẻ `<source>` cho Desktop. Nó **hoàn toàn thiếu** thẻ `<source media="(max-width: 639px)" srcset="assets/images/logoGiaToc.svg">` dành cho Mobile. Do đó, trên điện thoại, nó mặc định rơi xuống thẻ `<img>` dự phòng là bản ngang (`_ngang.svg`). 

---

## 3. AFFECTED COMPONENTS
- Toàn bộ nền tảng Application (Bị vô hiệu hóa hoàn toàn do Syntax Error ở tầng root JS).
- Favicon Rendering.
- Mobile Logo Rendering.

## 4. REQUIRED NEXT ACTION (CHO CLINE)
Task CHANGE-001 bắt buộc phải được mở lại để Cline thực hiện:
1. Sửa lỗi `SyntaxError: Unexpected token '}'` tại dòng 2048 trong `src/js/app.js`. (Và rà soát lại cấu trúc ngoặc của hàm `renderHomePublicationLanding`).
2. Thêm thẻ `<source media="(max-width: 639px)" srcset="assets/images/logoGiaToc.svg">` vào thẻ `<picture>` trong `index.html`.
3. Thêm cache-buster string vào thẻ favicon trong `index.html` (VD: `href="assets/images/logoGiaToc.svg?v=20260914_0102"`).
4. Cập nhật lại cache-buster cho `app.js` trong `index.html` để ép browser load file JS sau khi đã fix Syntax Error.
