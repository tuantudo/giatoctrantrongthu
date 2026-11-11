# BÀN GIAO CHỨNG CỨ PHÁP Y GỐC HOÀN CHỈNH (GATE-R2 FINAL EVIDENCE HANDOFF)
**Dự án:** Gia Tộc Trần Trọng Thu  
**Phiên bản phát hành:** V2.0.0 (Dynamic Platform Release)  
**Người phê duyệt tối cao:** Tuấn (Human Final Authority)  
**Đơn vị kiểm chứng kiến trúc & QC:** Emarald (Architecture & QC Authority)  
**Đơn vị thực thi:** AGY (Primary Execution Authority)  
**Thời điểm bàn giao:** 2026-11-11  
**Chế độ thực thi:** STRICT READ-ONLY (Không sửa source code, cấu hình, CSDL hay Production)

---

## 1. BỐI CẢNH & MỤC TIÊU BÀN GIAO

Tiếp nhận kết luận sơ bộ từ **Emarald**:
> *GATE-R2: CONDITIONALLY ACCEPTED — BROWSER QA PASS, EVIDENCE AUDIT PENDING.*  
> Emarald đã đối chiếu độc lập trên GitHub repository `tuantudo/giatoctrantrongthu`, xác nhận commit `3acf869` và commit `d4e982f` chỉ khác nhau một file tài liệu báo cáo (+199 dòng), mã nguồn `server/index.js` tại cả hai commit đều đã được cấu hình `requireMemberOrAdmin` cho hai endpoint Media, và đều có ngoại lệ `SENSITIVE_PATH` cho `/api/admin/content` cùng `/assets/private/images/clara`.

Tài liệu này hoàn tất việc bàn giao **chứng cứ pháp y gốc** (Raw Artifacts, Hash SHA-256, kích thước pixel, snapshot DOM và nhật ký console) để Emarald tiến hành kiểm định độc lập không qua suy diễn.

---

## 2. KHO HIỆN VẬT KIỂM TOÁN (ARTIFACT INVENTORY)

Tất cả các tệp hiện vật dưới đây đang tồn tại vật lý trong workspace của dự án và được bảo toàn nguyên vẹn:

| Đường dẫn tệp (Relative Path) | Loại hiện vật | Dung lượng (Bytes) | Mã băm SHA-256 |
| :--- | :--- | :---: | :--- |
| `docs/audit/V2_0_0_GATE_R2_BROWSER_QA_REPORT.md` | Báo cáo kiểm thử trình duyệt gốc | 16,885 | `ac29eba4684bc7435c80fa2a8f1c7d2602c226ed9fb2072f48a689b9c8b72361` |
| `docs/audit/V2_0_0_GATE_R2_EVIDENCE_RECONCILIATION.md` | Báo cáo đối soát chứng cứ | 25,616 | `1f82fc44fe03977d267e5bdf63e1cce68355dfec6f6cf17289eb08bccddad9bb` |
| `docs/audit/V2_0_0_GATE_R1_CI_RELEASE_BRANCH_EXECUTION.md` | Báo cáo phát hành nhánh GATE-R1 | 11,465 | `882242cb658c2b7ba1fcf9e248b1aa6a86f1e29e0839e94cb029aee5e9c0c1b4` |
| `docs/audit/screenshots/` (12 tệp PNG) | Kho ảnh chụp màn hình Playwright | 2,217,330 | *(Chi tiết bảng mục 3)* |
| `.playwright-mcp/` (16 tệp YAML & LOG) | Snapshots & Console logs nguyên sinh | 36,929 | *(Chi tiết bảng mục 4)* |

---

## 3. ĐỐI SOÁT CHI TIẾT 12 ẢNH CHỤP MÀN HÌNH (SCREENSHOT VERIFICATION)

Đã thẩm tra vật lý 100% bằng thư viện Pillow (Python) và công cụ `shasum -a 256`:
- **Định dạng:** 100% PNG (RGB, non-interlaced, 8-bit/color).
- **Trạng thái đọc tệp:** 100% `readable=OK` (Mở được, không lỗi header, không hỏng dữ liệu).
- **Chất lượng trực quan:** Bố cục sắc nét, đầy đủ nội dung, không có hiện tượng màn hình trắng, che khuất hoặc tràn lề.

| STT | Tên tệp ảnh (`docs/audit/screenshots/`) | Kích thước Pixel (WxH) | Viewport chuẩn | Dung lượng (Bytes) | Mã băm SHA-256 |
| :---: | :--- | :---: | :---: | :---: | :--- |
| 1 | `desktop_1440_home.png` | `1440 x 2044` | Desktop (1440px) | 459,676 | `2d47e7c6f4f432f63e7d666cc7ee19d5c2eb36366d36df432f6c754048d896b9` |
| 2 | `desktop_1440_login.png` | `1440 x 900` | Desktop (1440px) | 37,392 | `b7adc979dcca4bbefadf1e01e21472e120877e66633ba0973458649282bfe75d` |
| 3 | `desktop_1440_admin_login.png` | `1440 x 900` | Desktop (1440px) | 21,077 | `09d0f1552699f51e8550cf8a3ef1e46dd32f11d414204871059080ccc2ec9c3b` |
| 4 | `desktop_1440_gia_pha.png` | `1440 x 932` | Desktop (1440px) | 89,270 | `379c6d0a39be2b8866af032e0bcc36bd6d7c34d964774612b18f2a74111e7fa2` |
| 5 | `desktop_1440_lich.png` | `1440 x 906` | Desktop (1440px) | 80,497 | `a8376cd7c62d87e2de104cd962c93aab30a9dda2c2f2c9fdd2b362dc86c38045` |
| 6 | `laptop_1024_home.png` | `1024 x 2044` | Laptop (1024px) | 418,031 | `0e833db3bd4208b3da69819a6e4b8a089e8263d4fdf0e08fa6801142db72e378` |
| 7 | `tablet_768_home.png` | `768 x 3144` | Tablet (768px) | 547,522 | `38b8fc3a52c9f776fac0ea28733b2524e21f04ce5b983ff5d0fc31772b3d6615` |
| 8 | `mobile_375_home.png` | `375 x 3469` | Mobile (375px) | 335,017 | `df0cc3954027001d0610fdefd12f6d2a0e0b8ee7338f803a8a9bfc093316d9f8` |
| 9 | `mobile_375_login.png` | `375 x 812` | Mobile (375px) | 32,946 | `4c5ec5f388763f33677b974ab0fe16970a4f84f0abf42bdebde81ecc0ccd5ec5` |
| 10 | `mobile_375_admin_login.png` | `375 x 812` | Mobile (375px) | 16,374 | `f5a06d7ada773401bb7ee1b036c407dc2f15a4558292a4d7e79891a99329acd0` |
| 11 | `mobile_375_gia_pha.png` | `375 x 1390` | Mobile (375px) | 88,525 | `f547dbab0bc271057ea311225c7251ad53ef6c4c390192c265e9280071472f7e` |
| 12 | `mobile_375_lich.png` | `375 x 1309` | Mobile (375px) | 59,541 | `323da1af089300969b0fa529d181c6f320f8c13734c7f9a913c4b6e738f5137e` |

---

## 4. CHỨNG CỨ PLAYWRIGHT NGUYÊN THỦY (.PLAYWRIGHT-MCP/)

Thư mục `.playwright-mcp/` chứa các tệp nhật ký được máy chủ MCP Playwright tạo tự động trong phiên kiểm thử:

### 4.1. Nhật ký Console (Console Logs)
Ghi nhận chính xác các sự kiện console ở mức `error`:
- `console-2026-11-11T03-47-00-359Z.log` (376 bytes, SHA-256: `43b517bba1bf17cb8175805a1c952502c2afaf818450c9cb27b8a23d93dad477`):
  ```text
  [    1434ms] [ERROR] Failed to load resource: the server responded with a status of 401 () @ https://giatoctrantrongthu-git-release-v200-tuantqs-projects-74ccf90b.vercel.app/api/auth/me:1
  [    3114ms] [ERROR] Failed to load resource: the server responded with a status of 401 () @ https://giatoctrantrongthu-git-release-v200-tuantqs-projects-74ccf90b.vercel.app/api/auth/me:1
  ```
- `console-2026-11-11T03-48-20-335Z.log` (376 bytes, SHA-256: `a8adf804eaa1bfa4018b06bcc25e422efe177035229541705c97b7132071d6c1`):
  ```text
  [     497ms] [ERROR] Failed to load resource: the server responded with a status of 401 () @ https://giatoctrantrongthu-git-release-v200-tuantqs-projects-74ccf90b.vercel.app/api/auth/me:1
  [    1462ms] [ERROR] Failed to load resource: the server responded with a status of 401 () @ https://giatoctrantrongthu-git-release-v200-tuantqs-projects-74ccf90b.vercel.app/api/auth/me:1
  ```
*Bản chất lỗi:* Đây là mã phản hồi HTTP 401 khi script Admin của client thăm dò `/api/auth/me` lúc người dùng chưa đăng nhập. Đây là hành vi bảo vệ an ninh dự kiến, hoàn toàn không có lỗi JavaScript cú pháp hay crash runtime.

### 4.2. Danh mục 13 Tệp DOM Accessibility Snapshots có Dữ liệu
*(Ghi chú: Có 3 tệp 0 bytes gồm `page-2026-11-11T03-41-11-492Z.yml`, `page-2026-11-11T03-47-25-383Z.yml`, `page-2026-11-11T03-48-33-427Z.yml` là các stubs khởi tạo điều hướng của MCP driver trước khi page load xong).*

| Tên tệp YAML (`.playwright-mcp/`) | Dung lượng (Bytes) | Mã băm SHA-256 | Bước thao tác tương ứng |
| :--- | :---: | :--- | :--- |
| `page-2026-11-11T03-46-25-962Z.yml` | 8,632 | `c62aace9d67993200b37d65690551c2c25da86c40d4dbf25aa3a9fde269fb5bf` | Cuộn tới `#coi-nguon` (Trang nhất) |
| `page-2026-11-11T03-46-37-309Z.yml` | 630 | `e291215a8d25b7ee6e63f4bb3b9bea0823cffc52994a096a46de8960bad9ef96` | Click "Cổng thành viên →" vào `/login` |
| `page-2026-11-11T03-46-48-515Z.yml` | 630 | `1019d512421304b1f62f3d6b76776d93751ee884ad2b148c9bbebf544a977d7c` | Chuyển hướng an toàn từ `/me` về `/login` |
| `page-2026-11-11T03-46-55-941Z.yml` | 630 | `a1799b0dcea57cae6a93f9da286b9a91849aef7d3905595868098a5f184a922f` | Chuyển hướng an toàn từ `/me/tree` về `/login` |
| `page-2026-11-11T03-47-01-654Z.yml` | 1,338 | `65730a60ae149b5345af24ecefca07e6010f51383dcc27487f52b5255936f658` | Truy cập `/admin` tự động redirect `/admin/login` |
| `page-2026-11-11T03-48-07-102Z.yml` | 641 | `162bfa674d1ed62699c5ab2ac39b681226b6ba624703baad56f8a2e9f0d652d4` | Render form `/login` trên Mobile 375px |
| `page-2026-11-11T03-48-20-693Z.yml` | 1,362 | `b28fbe8a11ea07b3558157adf24bb88e8d62a4defe2490ec4a9218a31e96d55c` | Render `/admin/login` trên Mobile 375px |
| `page-2026-11-11T03-48-55-271Z.yml` | 2,121 | `9f1d9f64ef9ab4fe7ec29f73b64a5f6e0964263db5ccae61dc49166b1c8570c7` | Render Gateway Lịch Gia Tộc `/#/lich` |
| `page-2026-11-11T03-49-14-240Z.yml` | 2,242 | `b3c02636b96e688ce68403ec7f9dc8b157d69845a880b60674bd60ac7f428292` | Render Gateway Phả Hệ `/#/gia-pha` |
| `page-2026-11-11T03-51-34-479Z.yml` | 2,121 | `eb6fc31bb0626b1aa6937e60471e5b130d09a910e2f77d13f3b3985720d4b319` | Trạng thái sau lệnh `page.goBack()` |
| `page-2026-11-11T03-51-53-456Z.yml` | 2,196 | `f410e0c22583724fbef00b9c5d7e7739c702c04ffad14ef06fe31ff17fa4f33e` | Render Gateway MẠCH `/#/mach` |
| `page-2026-11-11T03-51-59-190Z.yml` | 2,160 | `e113753ef3e6ae46d5352f3a555b58c679dba5ad44e9fb3c9eabace9705b9952` | Render Gateway Di Ảnh `/#/tu-lieu` |
| `page-2026-11-11T03-52-11-867Z.yml` | 9,023 | `8c03abfc072379f74734e61addd9b6ff3bc050e3c240b79d855564daee78058e` | Graceful fallback khi hash sai `/#/invalid-route` |

### 4.3. Báo cáo Tình trạng Network Trace / HAR
- **Tình trạng:** `NOT AVAILABLE` (Không tồn tại tệp lưu trữ `.har` hoặc `.zip` trace trong workspace).
- **Lý do kỹ thuật:** Playwright MCP server tương tác trực tiếp với Chrome DevTools Protocol theo phiên tương tác từng lệnh, trả về danh sách network request qua API call `browser_network_requests` (đã ghi nhận 40 requests thành công tại Mục 5 của báo cáo gốc), không tự động kích hoạt tính năng `recordHar` hoặc `tracing.start()`.
- **Cam kết:** AGY tuyệt đối **không tự tạo HAR hoặc trace giả** để lấp khoảng trống, tuân thủ đúng nguyên tắc trung thực chứng cứ.

---

## 5. ĐỐI SOÁT DEPLOYMENT PROVENANCE & THỰC THỂ RUNTIME

- **Target Preview URL thực tế mở trong Playwright:**  
  `https://giatoctrantrongthu-git-release-v200-tuantqs-projects-74ccf90b.vercel.app`
- **Active Deployment ID phục vụ tại URL này:**  
  `dpl_2kwzP4HMB1TE7tunKiCvA6DYYr4S`
- **Commit SHA đã build thành công:**  
  `d4e982f8132d001c56c1ea364e32876cce26b9dd`
- **Bằng chứng kỹ thuật không thể chối cãi:**  
  Lệnh `curl` trực tiếp vào Preview URL nhận về mã HTML có gắn thẻ:  
  `<script async data-explicit-opt-in="true" data-deployment-id="dpl_2kwzP4HMB1TE7tunKiCvA6DYYr4S" src="https://vercel.live/_next-live/feedback/feedback.js"></script>`

---

## 6. CHỨNG CỨ MÃ NGUỒN VỀ DEF-03 (SOURCE CODE EVIDENCE)

Tuân thủ nghiêm ngặt chỉ đạo của Emarald và Tuấn: **Không thực hiện request lên Production để kiểm thử thêm.**

Dưới đây là bằng chứng kỹ thuật cấp mã nguồn (Source Code Level Evidence):

### 6.1. Định danh Git Blob và Commit
- **Commit SHA `3acf869`:** `3acf869882bb9d8c4dd2ff6d743eab2bb47eb2ff`
- **Commit SHA `d4e982f`:** `d4e982f8132d001c56c1ea364e32876cce26b9dd`
- **Git Blob SHA của `server/index.js` tại cả hai commit:**  
  `b0b28aecaff091e7ee9c927f6a2b22fbf836b67e` (Trùng khớp 100%, không sai khác).

### 6.2. Trích lục các dòng mã nguồn then chốt trong `server/index.js`

1. **Định nghĩa Middleware `requireMemberOrAdmin` (Dòng 417 - 435):**
   ```javascript
   // server/index.js:417
   async function requireMemberOrAdmin(req, res, next) {
       if (req.session && req.session.userId) {
           return next();
       }
       if (req.session && req.session.accountId) {
           if (req.session.status === 'PROVISIONED') {
               return res.status(403).json({
                   error: 'PASSWORD_CHANGE_REQUIRED',
                   message: 'Vui lòng đổi mật khẩu kích hoạt lần đầu trước khi truy cập dữ liệu.'
               });
           }
           if (getQuery) {
               try {
                   const acc = await getQuery("SELECT status FROM accounts WHERE id = ?", [req.session.accountId]);
                   if (!acc || acc.status === 'DISABLED') {
                       if (typeof req.session.destroy === 'function') {
                           req.session.destroy(() => {});
                       }
                       return res.status(401).json({
                           error: 'UNAUTHORIZED_MEMBER_GATEWAY',
                           message: 'Tài khoản không hợp lệ hoặc đã bị tạm khóa.'
                       });
                   }
                   // ...
   ```

2. **Ngoại lệ `SENSITIVE_PATH` cho Content & Clara (Dòng 29 - 32):**
   ```javascript
   // server/index.js:29
   // DEF-01 & DEF-02 Fix: Allow authorized admin content APIs and authorized member Clara assets to bypass static path containment
   if (req.path.startsWith('/api/admin/content') || req.path.startsWith('/assets/private/images/clara') || decodedPath.startsWith('/api/admin/content') || decodedPath.startsWith('/assets/private/images/clara')) {
       return next();
   }
   if (SENSITIVE_PATH.test(decodedPath)) {
       return res.status(404).end();
   }
   ```

3. **Đăng ký Router có gắn `requireMemberOrAdmin` cho hai endpoint Media (Dòng 841 & 858):**
   ```javascript
   // server/index.js:841
   app.get('/api/media.json', requireMemberOrAdmin, async (req, res) => {
       try {
           const mediaRows = await allQuery("SELECT * FROM media");
           // ...
   ```
   ```javascript
   // server/index.js:858
   app.get('/api/person_media.json', requireMemberOrAdmin, async (req, res) => {
       try {
           const pmRows = await allQuery("SELECT * FROM person_media");
           // ...
   ```

### 6.3. Tuyên bố Quy chuẩn Phân định
$$\mathbf{SOURCE\ VERIFIED \neq RUNTIME\ AUTHORIZATION\ VERIFIED}$$
- **SOURCE VERIFIED (Đã xác minh cấp mã nguồn):** Tại nhánh `release/v2.0.0` (cả 2 commit `3acf869` và `d4e982f`), mã nguồn `server/index.js` đã gắn `requireMemberOrAdmin` cho `/api/media.json` và `/api/person_media.json`. Do đó, DEF-03 **không còn là lỗi mã nguồn (Not a source defect)** trong nhánh phát hành V2.0.0.
- **RUNTIME AUTHORIZATION VERIFIED (Chưa xác minh cấp runtime):** Do quy chế STRICT READ-ONLY cấm gọi request kiểm thử lên Production API trong GATE-R2, tính năng chặn HTTP 401 trên môi trường Production runtime thực tế của 2 endpoint này chưa được đo đạc trong cổng này và sẽ được nghiệm thu tại cổng kiểm thử API tương ứng.

---

## 7. RANH GIỚI AN TOÀN & RỦI RO KIẾN TRÚC

```text
       ┌─────────────────────────────────────────────────────────────┐
       │                 MÔI TRƯỜNG V2.0.0 PREVIEW                   │
       │                                                             │
       │   [ Vercel Edge Frontend ]       [ Production Backend NAS ] │
       │   - Single-Shell SPA (HTML)      - Node Express (family-api)│
       │   - CSS Foundation & JS          - MariaDB Database         │
       │   - Static Asset Manifest        - Session & Auth Engine    │
       │          ▲                                    ▲             │
       │          │                                    │             │
       │     (Public UI)                        (API Rewrites)       │
       │          │                                    │             │
       └──────────┼────────────────────────────────────┼─────────────┘
                  │                                    │
                  └─────────────[ BROWSER ]────────────┘
```

- **Rủi ro phối hợp đã được kiểm soát:**  
  Trong toàn bộ phiên Browser QA GATE-R2, không có bất kỳ mutation request nào được gửi tới Production Backend. Mọi thao tác đều dừng lại ở tầng giao diện công khai và form đăng nhập.

---

## 8. DANH MỤC KHOẢNG TRỐNG CHỨNG CỨ (EVIDENCE GAPS)

1. **Network Trace / HAR:** Không có tệp HAR ghi nhận chi tiết headers/body từng request mạng; chỉ có snapshot DOM, console log và danh sách URL phản hồi HTTP 200/204.
2. **Authenticated Member Journey:** Chưa có ảnh chụp màn hình hoặc snapshot DOM của các trang sau đăng nhập (`/me/tree`, `/me/events`) vì tuân thủ lệnh cấm dùng thông tin đăng nhập thật.
3. **Admin Mutation Workflow:** Chưa có bằng chứng thao tác duyệt proposal trên UI để bảo toàn CSDL MariaDB Production.

---

## 9. BIÊN BẢN BÀN GIAO & TRẠNG THÁI KHÔNG THAY ĐỔI MÃ NGUỒN (GIT INTEGRITY)

- **Trạng thái Git:**
  * Lệnh `git diff`: **Hoàn toàn trống (0 dòng mã nguồn hoặc cấu hình bị thay đổi)**.
  * Nhánh hiện hành: `release/v2.0.0` (HEAD: `d4e982f`, up to date with `origin/release/v2.0.0`).
  * Danh sách tệp untracked an toàn:
    - `docs/audit/V2_0_0_GATE_R2_FINAL_EVIDENCE_HANDOFF.md`
    - `docs/audit/V2_0_0_GATE_R2_EVIDENCE_RECONCILIATION.md`
    - `docs/audit/V2_0_0_GATE_R2_BROWSER_QA_REPORT.md`
    - `docs/audit/screenshots/`
    - `.playwright-mcp/`
- **Chấp hành nghiêm ngặt:** Không commit, không push, không merge, không mở GATE-R3, không tự tuyên bố PASSED.

AGY chính thức bàn giao toàn bộ kho chứng cứ trên cho **Emarald** để tiến hành kiểm định QC độc lập và kính trình **Tuấn** xem xét.

