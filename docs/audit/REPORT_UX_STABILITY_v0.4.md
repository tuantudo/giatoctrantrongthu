# GIATỘC — REPORT UX STABILITY v0.4

*Mission: GIATỘC UX/UI STABILIZATION v0.4*
*Ngày: 2026-10-04 · Không commit / push / deploy · Không sửa DB, schema, SoT, auth*

---

## UX STABILITY STATUS: 🟡 YELLOW

**Lý do không phải GREEN:**

1. **Hai bề mặt đọc vẫn rỗng.** `/me/mach` và `/me/clara` là `BACKEND_DEPENDENCY`.
   Người đọc **hiểu đúng** vì sao rỗng (đây là thắng lợi của v0.4), nhưng một cognitive
   map mà hai nhánh chính chưa có nội dung thì chưa trọn vẹn.
2. **Accessibility chưa đo được.** Contrast WCAG, screen reader, keyboard traversal:
   `NOT VERIFIED`.
3. **`ADMIN` chưa có UI.** `UX_CONTEXT.ADMIN` tồn tại trong model nhưng không có bề mặt.
   Đây là *còn thiếu*, không phải *sai*.
4. **Cây phả đồ vẫn là legacy.** IA cuối cùng chưa chốt.

**Vì sao không phải RED:** mọi phân biệt ngữ nghĩa mà Human đã chốt — Clara/MẠCH/Public,
Person/Account, Genealogy/Content, Member/Admin — **nay đều đọc được từ cấu trúc UI và
được kiểm chứng bằng browser**, không còn phải đoán từ prose.

---

## 1. CÂU HỎI MISSION ĐẶT RA

> *"UI hiện tại có đủ ổn định để Human dùng nó để hiểu hệ thống không?"*

**Trước v0.4: KHÔNG.** Dưới đây là những gì tìm ra, theo WHAT / WHERE / WHY / IMPACT.

### F1 — Bốn surface không phân biệt được *(nghiêm trọng nhất)*

| | |
|---|---|
| **WHAT** | Chỉ có 2 context hiển thị: "Public" và "Member Space" |
| **WHERE** | `visibility.js` → `ScopeIndicator(audience)`, nối vào `shell.js:67` |
| **WHY** | Viết ở v0.2, **trước khi** `contexts.js` tồn tại. Nó đọc `audience` (2 giá trị) trong khi sản phẩm có 5 UX context + 3 discourse scope |
| **IMPACT** | `/me/mach`, `/me/clara`, `/me/tree`, `/me/family-spaces` — bốn trang này có header **giống nhau**. Human không thể biết mình đang ở MẠCH hay Clara hay gia phả nếu không đọc thân trang. Đây chính là câu hỏi số 2 của mission, và v0.4 trả lời **không** |

### F2 — Hai ngữ pháp trang trong một sản phẩm

| | |
|---|---|
| **WHAT** | `/me/mach` và `/me/clara` không có `PageHeader`, tự render `<h1>` riêng trong `ScopeMasthead` |
| **WHERE** | `editorial.js` (`gi-masthead__title`) vs `components.js` (`gi-pageheader__title`) |
| **WHY** | Tách **surface** thay vì tách **nội dung** — tác giả tách bề mặt thành hai lớp riêng |
| **IMPACT** | Không có "tiêu đề trang" thống nhất để dựa vào; vi phạm DoD "các page dùng cùng một visual grammar" |

### F3 — Trạng thái "không có gì" không phân biệt được

| | |
|---|---|
| **WHAT** | Có 4 kiểu nói "không có", mỗi kiểu một hình dạng: prose, khung viền đứt, câu trong card |
| **WHERE** | `states.js` (Loading/Empty/Error/NotAvailable) + prose rời ở `public-home.js`, `spaces.js`, `discourse.js` |
| **WHY** | Mỗi surface tự chế trạng thái khi viết, không có grammar chung |
| **IMPACT** | `EMPTY` ("hệ thống đã trả lời: không có") không phân biệt được với `BACKEND_DEPENDENCY` ("chưa có API để hỏi"). Người đọc dễ tưởng dữ liệu bị mất |

### F4 — Prose dài lặp ở mọi trang

| | |
|---|---|
| **WHAT** | "Chỉ là ngữ cảnh hiển thị — hiện chưa có mô hình phân quyền nội dung trong hệ thống." |
| **WHERE** | `visibility.js:41`, chạy trên **mọi** trang qua header |
| **WHY** | Ghi chú quan trọng bị đặt sai chỗ: nên là một chi tiết, lại thành nội dung chính |
| **IMPACT** | Vi phạm mission §2 "không trả lời bằng prose dài"; làm nhiễu mọi trang để nói một điều không liên quan tới trang đó |

### F5 — Bề mặt legacy không được đánh dấu

| | |
|---|---|
| **WHAT** | `/me/tree/person/:id` trông y hệt một trang bình thường, không ai biết nó chỉ là bề mặt chuyển tiếp |
| **WHERE** | `person.js` |
| **WHY** | Tồn tại để tương thích, nhưng người đọc không được nói |
| **IMPACT** | Người đọc tưởng đây là IA chính thức; quyết định về Cây phả đồ sẽ bị hiểu là đã xong khi chưa |

### F6 — Nhãn tiếng Anh lọt vào UI

`contextLabelFor()` trả `'Member Space'` / `'Public Space'`. Hàm đã chết nhưng trả về
đúng thứ CONSOLIDATION §6.4 cấm. Đã sửa để không ai gọi nhầm.

---

## 2. ĐÃ SỬA (trong phạm vi UI stabilization)

| # | Sửa gì | Cơ chế |
|---|---|---|
| F1 | `ContextBar` thay `ScopeIndicator` | 5 mục có nhãn: Cấp / Không gian / Diễn ngôn / Dữ liệu / Truy cập. Mọi mục là `data-*` trên DOM để kiểm chứng bằng máy |
| F2 | `ScopeMasthead` không còn `<h1>` riêng | Mọi surface dùng `PageHeader`; giọng đọc giữ qua `variant` (`--letter` / `--editorial`) |
| F3 | `states.js` → 9 state thống nhất | `StatePanel({state})`, mọi state khác nhau về hình và màu viền |
| F4 | Bỏ prose khỏi header | Giữ nguyên thông điệp ở `VisibilityLimitationNotice()` dành cho nơi thật sự cần |
| F5 | `LegacyBanner` trên person page | `data-state="legacy"`, viền chấm, nói rõ "chưa phải quyết định cuối" |
| F6 | `contextLabelFor()` trả nhãn tiếng Việt | Không còn chuỗi cấm trong UI |

**Không đổi:** palette, typography, spacing scale, route, schema, dữ liệu, auth,
Source of Truth. Không thêm feature. Không thêm route.
---

## 3. HAI LỖI DO CHÍNH TÔI TẠO RA — VÀ BỘ QA BẮT ĐƯỢC

Ghi lại vì đây là bằng chứng QA đang thật sự làm việc, không phải trang trí:

1. **`mount is not defined`** — khi viết lại `states.js` tôi xoá `mount` khỏi import
   nhưng `Region()` vẫn dùng nó. Toàn bộ `/me` crash. Bắt được ở lần chạy đầu.
2. **Rò rỉ phạm vi sang Public** — câu OPEN_QUESTION viết lại có nhắc "chọn lọc từ
   **MẠCH**". Điều đó đưa tên scope nội bộ lên trang công khai, phá đúng ranh giới mà
   mission §5 bảo vệ. Bắt được bởi assertion *"public / no internal discourse names"*.

Lỗi thứ hai đáng đặc biệt: nó cho thấy **ngay cả khi ý định tốt, viết lại copy trên
bề mặt Public vẫn có thể phá semantic boundary**. Đã ghi vào contract §G.

---

## 4. BROWSER VERIFICATION

| Mục | Kết quả |
|---|---|
| Engine | Google Chrome headless qua puppeteer |
| Harness | `scripts/ui_vnext_qa.mjs` (mở rộng cho v0.4) |
| Tổng | **312 VERIFIED · 0 FAILED · 20 NOT AVAILABLE** |
| Mỗi bề rộng | 78 assertion, đều VERIFIED |
| Assertion về context bar | **92**, tất cả VERIFIED |
| Assertion "đúng 1 `<h1>`" | **24**, tất cả VERIFIED |
| Screenshot | 12 file tại 375 + 1440 |

**Không regression:** tất cả assertion v0.3 vẫn chạy và vẫn pass (cùng một harness,
không tắt bỏ kiểm nào cũ).

Mới ở v0.4: kiểm `data-context`, `data-level`, `data-discourse`, `data-discourse-kind`,
`data-data-type`, `data-access`, và đếm `<h1>` — tức **các bất biến ngữ nghĩa giờ được
đo bằng máy chứ không chỉ bằng mắt**.

Journey đã đăng nhập: vẫn dùng dev auto-login của chính dự án trên instance phụ cổng
3100, `DEV_AUTO_LOGIN` chỉ đặt trong process, **không ghi vào `.env`**. Instance 3000
không có auto-login → `/login` vẫn là form thật.

---

## 5. ĐỐI CHIẾU DEFINITION OF DONE

| # | Điều kiện | Trạng thái | Bằng chứng |
|---|---|---|---|
| 1 | Phân biệt được Public / Member / Genealogy / MẠCH / Clara / Family Space | ✅ | `data-context` khác nhau, 92 assertion |
| 2 | Account và Person không bị trộn | ✅ | 2 `[data-identity]` + lead text + viền trái khác màu |
| 3 | Genealogy và Content không bị trộn | ✅ | `data-data-type` = `canonical-genealogy` vs `content` |
| 4 | Clara / MẠCH / Public không bị trộn | ✅ | `data-discourse-kind` = intimate / internal / external |
| 5 | Navigation không imply architecture chưa quyết | ✅ | Contract §C; Public không link tới nội bộ |
| 6 | Empty / unavailable / backend dependency không bị hiểu nhầm | ✅ | 9 state phân biệt bằng hình + tiêu đề + giải thích |
| 7 | Các page dùng cùng một visual grammar | ✅ | Mọi surface có `ContextBar` + 1 `<h1>` + `PageHeader` |
| 8 | Không page nào tự phát minh UI paradigm | ✅ | `/me/mach` + `/me/clara` sửa về dùng `PageHeader` |
| 9 | Browser QA không regression | ✅ | 0 FAILED; assertion cũ vẫn chạy |
| 10 | Không claim accessibility chưa verify | ✅ | 3 mục ghi `NOT VERIFIED` |
| 11 | Không sửa DB / SoT / architecture | ✅ | Chỉ sửa file frontend + 2 doc |

---

## 6. TRẠNG THÁI TỪNG BỀ MẶT

| Bề mặt | Context identity | Trạng thái chính | Đánh giá |
|---|---|---|---|
| `/` | `public` / content | `OPEN_QUESTION` | ✅ ổn định |
| `/login` | `public` | form thật | ✅ ổn định |
| `/me` | `member` / identity | zone đầy đủ | ✅ ổn định |
| `/me/mach` | `editorial` / `mach` / internal | `BACKEND_DEPENDENCY` | 🟡 đúng nhưng rỗng |
| `/me/clara` | `editorial` / `clara` / intimate | `BACKEND_DEPENDENCY` | 🟡 đúng nhưng rỗng |
| `/me/family-spaces` | `member` | `BACKEND_DEPENDENCY` | 🟡 đúng nhưng rỗng |
| `/me/tree` | `genealogy` | legacy SPA | 🟡 cần migration |
| `/me/tree/person/:id` | `genealogy` | `LEGACY` + dữ liệu thật | 🟡 chuyển tiếp |
| Admin | — | **không tồn tại** | 🟡 chưa quyết |

---

## 7. CÒN LẠI (không sửa được trong phạm vi UI)

| # | Vấn đề | Vì sao không sửa ở đây |
|---|---|---|
| 1 | MẠCH/Clara rỗng | Cần endpoint + quyết định schema — **BACKEND** |
| 2 | Family Space rỗng | Chưa có bảng dữ liệu — **BACKEND** |
| 3 | Không có admin shell | `CAPABILITY_MODEL.md` có 5 actor nhưng chưa có quyết định UI — **HUMAN** |
| 4 | Cây phả đồ còn legacy | Mission v0.3 yêu cầu giữ route; IA cuối chưa chốt — **ARCHITECTURE** |
| 5 | Contrast / screen reader / keyboard | Cần tool ngoài môi trường — **NOT VERIFIED** |
| 6 | `DEV_AUTO_LOGIN` fail-open | Ngoài phạm vi UI; vẫn là **deployment blocker** |
| 7 | `birthYear='[object Object]'` | Cần migration/re-seed có phê duyệt — **HUMAN GATE** |

---

## 8. VIỆC NÊN LÀM TIẾP

Mission này **không thêm feature**, nên đề xuất tiếp theo cũng là về ổn định:

1. **Đo contrast thật** — biến 3 dòng `NOT VERIFIED` thành số đo được. Rẻ nhất và giá
   trị cao nhất trong nhóm accessibility.
2. **Chạy keyboard traversal** — shell mới dùng nhiều `<a>` và `<dl>`; cần xác nhận
   thứ tự focus đọc được.
3. **Chờ quyết định schema Clara/MẠCH** rồi mới làm gì thêm cho 2 trang rỗng.
4. **Chốt IA Cây phả đồ** để gỡ nhãn LEGACY.

**Không** khuyến nghị: thêm route, thêm surface, thêm tính năng cho tới khi 1–2 xong.