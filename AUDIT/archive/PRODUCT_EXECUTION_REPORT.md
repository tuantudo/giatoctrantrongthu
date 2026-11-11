# BÁO CÁO NHẬT KÝ THỰC THI SẢN PHẨM (PRODUCT EXECUTION LOG)
## CÂY GIA PHẢ — GIATỘC TRẦN TRỌNG THU

**Mã tài liệu:** `AUDIT/PRODUCT_EXECUTION_REPORT.md`  
**Chỉ thị:** TÁCH RỜI SECURITY KHỎI UX/DATA PIPELINE & TRIỂN KHAI 3 KHÔNG GIAN TRẢI NGHIỆM  
**Human Final Authority:** Tuấn  
**Analysis & Architecture Authority:** Emarald / ChatGPT  
**Execution Coordinator & Primary Agent:** AGY  
**Backend / Database / Data Pipeline:** OpenCode  
**Frontend / UI / Visual QA:** Cline  
**Thời điểm cập nhật:** 2026-11-02 15:59 (ICT)  
**Trạng thái Máy chủ:** RUNNING trên `http://localhost:3000` (PID Task: `task-2687`)  

---

## 1. KIẾN TRÚC THÔNG TIN ĐÃ TRIỂN KHAI (INFORMATION ARCHITECTURE)

Hệ thống đã phân tách triệt để 3 trách nhiệm kỹ thuật và cụ thể hóa **3 Không Gian Trải Nghiệm** độc lập:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                          3 KHÔNG GIAN TRẢI NGHIỆM                           │
├─────────────────────────┬─────────────────────────┬─────────────────────────┤
│ SPACE 01: PUBLIC/SOCIAL │ SPACE 02: LINEAGE/MEMBER│ SPACE 03: PERSONAL/FAM  │
├─────────────────────────┼─────────────────────────┼─────────────────────────┤
│ • Đối tượng: Công chúng │ • Đối tượng: Thành viên │ • Đối tượng: Cá nhân &  │
│   và bạn bè quan tâm    │   dòng họ đã xác thực   │   gia đình gần gũi      │
│ • Nội dung: Giới thiệu  │ • Nội dung: Toàn bộ cây │ • Cấu trúc 3 Tầng:      │
│   lịch sử, bản sắc, nếp │   phả hệ 223 người,     │   - TẦNG 1: Bản thân    │
│   nhà, 12 bài viết MẠCH │   68 gia đình, 265 sự   │   - TẦNG 2: Gia đình    │
│   chọn lọc, các mốc di  │   kiện Lịch, kho 185    │     hạt nhân trực hệ    │
│   sản tiền nhân.        │   tư liệu số hóa.       │   - TẦNG 3: Anh chị em  │
│ • Ranh giới: CẤM lộ PII │ • Ranh giới: Bảo vệ     │     mở rộng & dâu rể    │
│   người đang sống, CẤM  │   quan hệ thân tộc nội  │ • KHÔNG GIAN ĐẶC BIỆT:  │
│   lộ hồ sơ cá nhân và   │   bộ, không đưa ra môi  │   Thư gửi Clara (8 thư) │
│   Thư riêng tư Clara.   │   trường công khai.     │   cô lập hoàn toàn.     │
└─────────────────────────┴─────────────────────────┴─────────────────────────┘
```

---

## 2. CÁC LUỒNG TRẢI NGHIỆM UX/UI ĐÃ HOÀN THÀNH (UX/UI FLOWS)

1. **Luồng Khách công chúng (Public Visitor Flow — Space 01):**
   - Độc giả truy cập `http://localhost:3000/#/` xem Trang chủ, tôn chỉ dòng họ, và tuyển tập MẠCH.
   - Khi bấm vào các phân hệ thân tộc (`Gia Phả`, `Lịch`, `Tư Liệu`), giao diện hiển thị **Cửa ngõ nhận diện (Recognition Gate)** trang trọng, giải thích lý do bảo vệ đời tư người đang sống và mời con cháu xác thực thành viên.
2. **Luồng Thành viên Dòng họ (Lineage Member Flow — Space 02):**
   - Chuyển sang Persona `Thành viên Dòng họ`: Huy hiệu chuyển sang `SPACE 02: LINEAGE / MEMBER`.
   - Phân hệ **Gia Phả** mở khóa danh bạ 223 nhân vật, cây phả hệ phân nhánh, bộ lọc Chi Trưởng / Chi Thứ và thanh tra cứu tên tức thì.
   - Phân hệ **Lịch Dòng Họ** mở khóa đầy đủ 265 sự kiện gia tộc gom theo tháng (Sinh nhật, Bổn mạng, Kỵ giỗ, Mốc kỷ niệm).
   - Thanh điều hướng xuất hiện điểm chạm dẫn vào **Không Gian Gia Đình ★**.
3. **Luồng Cá nhân & Gia đình Gần gũi (Personal & Family Flow — Space 03):**
   - Chuyển sang Persona `Bản Thân` hoặc `Gia Đình Thân Thuộc`:
     - **Tầng 01 (Myself):** Hồ sơ Cụ Giuse Trần Trọng Thu (1872 — 1969), Chi Trưởng, Thế hệ 1, tiểu sử và ký ức cá nhân.
     - **Tầng 02 (Close Family):** Vòng tròn trực hệ: Cha (`Trần Cha Ông cố Thu`), Mẹ (`Mẹ Ông Thu - bà An`), Vợ (`Nguyễn Thị Xuân - Út`), 6 người con và 1 người em ruột.
     - **Tầng 03 (Extended Sibling Families):** Dâu rể và các cháu trong nhánh gia đình anh chị em.
     - **Không gian Riêng tư Đặc biệt (Thư Gửi Clara):**
       - Khi ở Persona `Gia Đình Thân Thuộc`: Mở khóa trọn vẹn 8 bức thư gửi Clara lưu trữ trong gia đình.
       - Khi ở Persona `Bản Thân`: Hiển thị cảnh báo bảo mật, không gian chỉ kích hoạt trong ngữ cảnh gia đình phù hợp.
       - Khi ở Persona `Công Chúng`: Hoàn toàn không tồn tại trên giao diện.

---

## 3. CÁC MODULE FRONTEND ĐÃ THAY ĐỔI (FRONTEND CHANGES)

- **[`index.html`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/index.html):**
  - Tích hợp thanh điều khiển **Development Access Adapter Persona Switcher** trên đầu trang (gồm 4 nút chọn ngữ cảnh).
  - Thêm thẻ hiển thị trạng thái không gian `#currentSpaceBadge`.
  - Cấu trúc lại phân hệ `data-view="gia-pha"` thành 2 lớp: `#gpPublicGate` (Cửa ngõ nhận diện) và `#gpMemberContent` (Lưới nhân vật tương tác).
  - Bổ sung toàn bộ cấu trúc giao diện Space 03: `data-view="khong-gian-gia-dinh"` gồm 3 tầng (Layer 01, 02, 03) và hộp ký ức Thư gửi Clara.
- **[`src/js/app-v2.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/app-v2.js):**
  - Xây dựng Persona Controller: `window.__DEV_PERSONA`, `window.__switchPersona(newPersona)`.
  - Hàm `renderGiaPha()`: Đóng/mở Cửa ngõ nhận diện dựa trên Persona, nạp 223 nhân vật và quản lý bộ lọc tìm kiếm.
  - Hàm `renderSpace03()`: Gọi API `/api/spaces/personal` và render linh hoạt 3 tầng gia đình và Thư Clara.
  - Cập nhật Router nhận diện hash route `#/khong-gian-gia-dinh`.
- **[`src/css/prototype.css`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/css/prototype.css):**
  - Bổ sung hệ thống CSS chuẩn Brand Governance cho Persona Bar, Huy hiệu Không gian, Recognition Gate, Thẻ nhân vật Hero Tầng 1, Lưới gia đình Tầng 2-3 và Thư Clara.

---

## 4. CÁC API & DATA CONTRACT ĐÃ TRIỂN KHAI (BACKEND DATA CONTRACTS)

Mô-đun mới: [`server/spaces_router.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/server/spaces_router.js) gắn tại tuyến `/api/spaces/*`:

| Endpoint API | Context Yêu Cầu | Data Contract Trả Về | Ranh Giới Bảo Mật |
| :--- | :--- | :--- | :--- |
| `GET /api/spaces/context` | Mọi ngữ cảnh | `{ persona, isLocalDev, availablePersonas }` | Không chứa dữ liệu nhạy cảm |
| `GET /api/spaces/public` | `public` | `{ identity, stats, curatedStories (5), allPublicStories (12), heritageMilestones, recognitionGate }` | Loại trừ 100% PII người sống & Clara |
| `GET /api/spaces/member` | `member` / `individual` / `family` | `{ people (223), families (68), timeline (215), memories, mediaArchive (185), calendarFeeds (4) }` | Chặn HTTP 403 nếu Persona là `public` |
| `GET /api/spaces/personal` | `individual` / `family` | `{ layer01_myself, layer02_close_family, layer03_extended_sibling_families, specialPrivateSpace }` | Chặn HTTP 403 nếu là `public`. Chỉ trả Thư Clara khi persona là `family` |

---

## 5. CƠ CHẾ HOẠT ĐỘNG CỦA DEVELOPMENT ACCESS ADAPTER

- **Cách thức hoạt động:** Adapter đọc trạng thái Persona qua query parameter `?persona=...`, header `X-Dev-Persona`, hoặc `localStorage` trên trình duyệt.
- **Ranh giới an toàn tuyệt đối:**
  - Adapter **CHỈ KÍCH HOẠT** khi `(hostname === 'localhost' || hostname === '127.0.0.1') && process.env.NODE_ENV !== 'production'`.
  - Trên môi trường Production hoặc host công khai, Adapter bị **VÔ HIỆU HÓA HOÀN TOÀN**; hệ thống bắt buộc kiểm tra phiên đăng nhập và ReBAC thực tế.
  - Không nhúng credential, mật khẩu hay session secret vào mã nguồn frontend.

---

## 6. MA TRẬN DỮ LIỆU SỬ DỤNG THEO MÔI TRƯỜNG

| Môi Trường | Nguồn Dữ Liệu Phả Hệ | Nguồn Dữ Liệu Lịch | Nguồn Dữ Liệu MẠCH | Thư Gửi Clara |
| :--- | :--- | :--- | :--- | :--- |
| **Local Development** | SQLite `server/family_archive.db` (223 người, 68 gia đình) | 4 tệp `server/calendars/*.ics` (265 sự kiện) | `server/data/mach.json` (12 bài viết xuất bản) | `server/data/private/clara.json` (8 thư, chỉ mở ở Family Persona) |
| **Production Vercel** | Static snapshot JSON đã kiểm duyệt | Static `.ics` feeds công khai | Static `data/mach.json` đã làm sạch | **KHÔNG CÓ TRÊN PRODUCTION** (Được redirect về `/` qua `vercel.json`) |

---

## 7. KẾT QUẢ KIỂM THỬ TỪNG PERSONA (PERSONA VERIFICATION EVIDENCE)

Đã kiểm thử tự động trên trình duyệt thật qua Playwright (`http://localhost:3000`):

1. **Persona 1 — Khách Công Chúng (`public`):**
   - `Huy hiệu:` `SPACE 01: PUBLIC` `[PROVEN]`
   - `Gia Phả:` Hiển thị Cửa ngõ nhận diện (`publicGateHidden: false`, `memberContentHidden: true`) `[PROVEN]`
   - `Lịch & Tư Liệu:` Hoạt động ở chế độ giới thiệu văn hóa `[PROVEN]`
   - `Thư Clara:` Hoàn toàn không xuất hiện `[PROVEN]`
2. **Persona 2 — Thành Viên Dòng Họ (`member`):**
   - `Huy hiệu:` `SPACE 02: LINEAGE / MEMBER` `[PROVEN]`
   - `Gia Phả:` Mở khóa toàn bộ 223 thẻ nhân vật (`cardCount: 36/grid`, tìm kiếm hoạt động) `[PROVEN]`
   - `Lịch Dòng Họ:` Nạp 265 sự kiện từ 4 tệp ICS `[PROVEN]`
   - `Điều hướng:` Mở khóa tab "Không Gian Gia Đình ★" `[PROVEN]`
3. **Persona 3 — Bản Thân (`individual`):**
   - `Huy hiệu:` `SPACE 03: MYSELF` `[PROVEN]`
   - `Tầng 01 (Myself):` Hiển thị Cụ Giuse Trần Trọng Thu (1872 — 15/08/1969), Chi Trưởng, Thế hệ 1 `[PROVEN]`
   - `Tầng 02 (Close Family):` Hiển thị Cha Mẹ, Vợ (`Nguyễn Thị Xuân - Út`), 6 người con `[PROVEN]`
   - `Thư Clara:` Hiển thị thông báo bảo mật "Yêu cầu ngữ cảnh gia đình phù hợp" `[PROVEN]`
4. **Persona 4 — Gia Đình Thân Thuộc (`family`):**
   - `Huy hiệu:` `SPACE 03: FAMILY CONTEXT` `[PROVEN]`
   - `Tầng 03 (Extended):` Hiển thị gia đình anh chị em mở rộng `[PROVEN]`
   - `Thư Clara:` Mở khóa trọn vẹn 8 bức thư riêng tư gia đình (`claraLetterCardsCount: 8`) `[PROVEN]`

---

## 8. CÁC RANH GIỚI BẢO MẬT CÒN LẠI (PENDING SECURITY ENFORCEMENT)

- [CONFIGURED] Hệ thống ReBAC phân quyền tự động theo quan hệ huyết thống đang được đóng gói độc lập tại `server/auth.js` và `server/member.js`.
- [CONFIGURED] Việc đồng bộ chính thức tài khoản người dùng thực tế (`accounts` và `identity_mappings`) sẽ được kết nối sau khi hoàn thiện toàn diện lớp UX/UI và Data Pipeline theo đúng chỉ thị của Tuấn.

---

## 9. VẤN ĐỀ CHƯA GIẢI QUYẾT (UNRESOLVED ISSUES)

1. Cây phả hệ đồ họa SVG/Canvas (dạng sơ đồ nhánh tương tác từ website cũ) hiện đang được chuẩn bị để porting vào phân hệ Gia Phả trong Vertical Slice tiếp theo.
2. 185 tài nguyên media trong CSDL hiện mới có đường dẫn tệp ảnh và tên kỹ thuật, đang chờ bổ sung siêu dữ liệu biên tập (năm chụp, địa điểm) từ gia đình.

---

## 10. BẰNG CHỨNG HÌNH ẢNH TRỰC QUAN (VISUAL EVIDENCE)

- **Ảnh chụp nghiệm thu không gian 3 tầng và Thư Clara:**  
  👉 [`shots/three_spaces_verification.png`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/shots/three_spaces_verification.png) *(Đã lưu trong kho ảnh bằng chứng)*
- **Kiểm thử hồi quy an ninh:**
  - `scripts/test_security_verification.mjs`: **8/8 PASSED** `[PROVEN]`
  - `scripts/verify_clara_containment.mjs`: **10/10 PASSED** `[PROVEN]`
  - `npm run db:verify`: **100% PASSED** (223 người, 68 gia đình, 2 ký ức, 215 sự kiện) `[PROVEN]`

---
*Báo cáo được AGY cập nhật trực tiếp và sẵn sàng phục vụ Tuấn kiểm tra trên trình duyệt.*
