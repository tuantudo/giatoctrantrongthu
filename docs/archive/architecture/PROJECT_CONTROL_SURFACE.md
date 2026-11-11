# PROJECT CONTROL SURFACE
**Project:** Gia Tộc Trần Trọng Thu
**Mục đích:** Thiết lập "Lớp kiểm soát công trình" (Construction Control Surface) để chuyển đổi từ mô hình Prompt ad-hoc sang quy trình Design by Contract: `Owner → Control Surface → Change Request → Cline implement → AGY verify → Owner acceptance`.

---

## A. PROJECT IDENTITY

- **Project:** Gia Tộc Trần Trọng Thu
- **Repository:** `git@github.com:tuantudo/giatoctrantrongthu.git`
- **Production Domain:** `https://giatoctrantrongthu.com/` (Canonical)
- **API/Backend Domain:** `https://api.giatoctrantrongthu.com/`
- **Deployment Platform:** Vercel
- **Architecture Summary:** Frontend Static Web (HTML/CSS/JS) + Client-side routing + ICS Parser + JSON Data Fetching từ Backend.
- **Current Canonical Branch:** `main`
- **Current Known Baseline (HEAD):** `cc2f303` (HTML deployed, JS/CSS cached at older version).

---

## B. OWNER AUTHORITY

Những quyết định sau thuộc THẨM QUYỀN DUY NHẤT của Owner. Agent/Cline tuyệt đối không được tự ý thay đổi, suy diễn hay "làm hộ":

1. **Product Intent:** Mục đích, định hướng của từng màn hình/tính năng.
2. **Information Architecture (IA):** Cấu trúc phân tầng, phân loại dữ liệu (Person, Family, MẠCH, Ký ức).
3. **Semantic Meaning:** Ý nghĩa của nội dung, cách dùng logo (Original vs Ngang vs Icon-only).
4. **Visual Hierarchy:** Yếu tố nào to/nhỏ, nằm trên/dưới.
5. **Brand Meaning:** Typography, Color mapping.
6. **Navigation Labels:** Tên các nút trên menu.
7. **User Journeys:** Luồng đi của người dùng.
8. **Behavior Decisions:** Popup hay Redirect, Scroll hay Click.
9. **Acceptance of Visual Result:** Giao diện có đúng ý không (Visual Pass).
10. **Acceptance of Production Result:** Tính năng có chạy thật trên production không.

---

## C. SYSTEM OF TRUTH

Xác định nơi lưu trữ chân lý (Source of Truth) cho từng lớp hệ thống:

| Layer | SOURCE OF TRUTH | DERIVED ARTIFACTS | WHO MAY CHANGE IT | WHO VERIFIES IT |
|---|---|---|---|---|
| **Product Intent** | Owner Directives | Blueprint / Roadmaps | Owner | Owner |
| **Brand** | `brand/manifest.json` | `brand.css` | Owner | AGY (Audit) |
| **IA** | `PRODUCT_EXPERIENCE_BLUEPRINT.md` | Data Models | Owner | AGY |
| **UI / Interface**| `index.html` & `main.css` | Rendered DOM | Cline | AGY / Owner |
| **Behavior** | `app.js` (Routing/Event listeners) | N/A | Cline | AGY (Runtime) |
| **Data** | Backend Database / CMS | `*.json`, `*.ics` | Owner / Backend | AGY (Trace map) |
| **Backend/API** | `api.giatoctrantrongthu.com` | N/A | Owner / Backend | AGY (Integration) |
| **Deployment** | Vercel (`vercel.json`, GitHub) | Production URL | Cline (Config) | AGY / Owner |
| **Acceptance** | `PROJECT_CONTROL_SURFACE.md` (Contract) | Forensic Audits | Owner | Owner |

*(Lưu ý: CSS generated không phải là Source of Truth của Brand. Báo cáo tự nhận của Cline không phải là Production Truth).*

---

## D. CURRENT SYSTEM STATE

Dựa trên các tài liệu Blueprint, Real Data Map và Forensic Audit hiện có:

| DOMAIN | CURRENT TRUTH | EVIDENCE | STATUS |
|---|---|---|---|
| **Brand** | `manifest.json` bị bypass nhiều. | Hardcoded CSS hex colors. | PARTIAL |
| **Homepage** | Editorial Shell (65/35). | Lỗi cache-buster khiến JS cũ chạy. | BROKEN |
| **Navigation** | 5 routes chính, A-/A+ ra ngoài. | `index.html` DOM (cc2f303). | CONFIRMED |
| **MẠCH** | API `mach.json`. | Load thành công 20 stories. | CONFIRMED |
| **Ký Ức** | Dữ liệu có trong RAM, DOM rỗng. | Lỗi cache `app.js`. | BROKEN |
| **Gia Phả** | API `genealogy.json`. | Load thành công 228 người. | CONFIRMED |
| **Tư Liệu** | Không đủ metadata. | `media.json` thiếu caption/date. | OBSERVED (Placeholder) |
| **Lịch** | 4 feeds ICS chạy tốt. | `loadCalendarFeeds()`. | CONFIRMED |
| **Tìm Kiếm** | Chạy local JS. Nút nav đứt. | `runSearchPage()`. | PARTIAL |
| **Backend/API**| API URLs bị hardcode. | Dòng 58-92 `app.js`. | OBSERVED |
| **Deployment** | Đẩy lên Vercel thành công. | Lỗi cache-buster string. | PARTIAL |
| **Favicon** | `logoGiaToc_favicon.svg` (Sai file).| Thẻ `<link rel="icon">`. | BROKEN |
| **Responsive logo**| Thiếu mobile icon. | Thẻ `<picture>` thiếu rule 639px. | BROKEN / UNRESOLVED |
| **A-/A+** | Floating UI. | `index.html` DOM. | CONFIRMED |
| **Authentication**| Public mode. | `app.js`. | OBSERVED |

*(CONFLICT — OWNER DECISION REQUIRED: Quyết định logo responsive hiện tại mâu thuẫn với nhận định trước đó. Owner đã chốt: Không tự ép dùng icon-only cho mobile nếu Owner không dặn).*

---

## E. INVARIANTS (BẤT BIẾN)

Những giới hạn CẤM PHÁ VỠ khi Cline/Agent thực hiện bất kỳ task nào:

1. **KHÔNG** tự thay đổi Product Intent hoặc Information Architecture.
2. **KHÔNG** tự định nghĩa lại Brand Semantics (Ví dụ: tự ý dùng logo icon-only ở một nơi chưa được chỉ định).
3. **KHÔNG** thay đổi API/Data source hoặc cấu trúc JSON nếu task chỉ giới hạn ở Frontend UI.
4. **KHÔNG** xóa bất kỳ Route nào đang có chỉ vì Redesign Homepage.
5. **KHÔNG** dùng fake data (làm giả JSON) để lấp vào Placeholder. Nếu thiếu dữ liệu thật, phải để "Honest Placeholder".
6. **KHÔNG** coi việc viết xong Source-code là Runtime Success (Ví dụ: Lỗi quên đổi cache-buster).
7. **KHÔNG** coi HTTP 200 (Load trang được) là Feature Acceptance (Tính năng chạy đúng).
8. **KHÔNG** tự tuyên bố Visual PASS (Giao diện chuẩn). Quyền này của Owner.
9. **KHÔNG** sửa backend khi task chỉ nằm ở frontend.
10. **KHÔNG** tự ý thay đổi Authorization / Public-Member architecture ngoài phạm vi task.

---

## F. ROLE BOUNDARIES

**OWNER:**
- Quyết định: Ý tưởng, Cấu trúc, Giao diện, Trải nghiệm.
- Ưu tiên: Trình tự thực hiện tính năng.
- Nghiệm thu cuối: Đánh giá bằng mắt (Visual/Semantic) và duyệt hoàn thành.

**AGY:**
- Khảo sát hệ thống, vạch dấu vết dữ liệu, lập sơ đồ map.
- Tạo Implementation Contract (Dịch yêu cầu của Owner thành Spec kỹ thuật).
- Forensic Verification (Đánh giá độc lập chất lượng code của Cline).
- CẢNH BÁO: Không được phép tự ra quyết định thay Owner.

**OPENCODE:**
- Technical exploration & Second engineering opinion.
- Code/Design implementation review (tìm rủi ro kỹ thuật, responsive issues, semantic HTML/CSS, maintainability).
- CẢNH BÁO: Không có quyền tự quyết định visual/semantic acceptance, không tự ý sửa production ngoài task.


**CLINE:**
- Implementation Worker (Người thợ code).
- CHỈ sửa trong ranh giới của Task (Boundary).
- PHẢI báo cáo những file đã đổi, bằng chứng xác minh (Verification Evidence).
- CẢNH BÁO: Không tự ý mở rộng Scope, không thay đổi Architecture, không coi tự báo cáo là Acceptance.

---

## G. CHANGE REQUEST CONTRACT (TEMPLATE)

```text
CHANGE ID: [Mã task]
TITLE: [Tên task]
OWNER GOAL: [Ý đồ của Owner]
USER OUTCOME: [Người dùng nhận được gì?]
CURRENT STATE: [Hiện trạng đang hỏng/thiếu gì?]
TARGET STATE: [Kết quả mong đợi]
IN SCOPE: [Chỉ làm những việc này]
OUT OF SCOPE: [TUYỆT ĐỐI không đụng vào việc này]
ALLOWED FILES / SURFACES: [Các file được phép sửa]
FORBIDDEN FILES / SURFACES: [Cấm sửa]
DATA SOURCE: [API / State object]
BRAND / IA / BEHAVIOR INVARIANTS: [Quy tắc giữ nguyên]
IMPLEMENTATION NOTES: [Lưu ý cho Cline]

ACCEPTANCE CRITERIA (Phải quan sát được):
- [ ] Ví dụ: Trình duyệt render ra chữ ABC từ mach.json. (Không ghi chung chung "Trang hoạt động").

RUNTIME VERIFICATION: [Cline phải chứng minh DOM render ra sao]
VISUAL VERIFICATION: [Owner sẽ check bằng mắt]
REGRESSION VERIFICATION: [Kiểm tra các feature liên quan không hỏng]
REQUIRED EVIDENCE: [Screenshot, Console log, DOM snapshot...]
VERIFIER: AGY / Owner
STATUS: [UNVERIFIED / BLOCKED / PARTIAL / PASS]
```

---

## H. EVIDENCE MODEL

Mọi thay đổi phải đi qua 4 tầng bằng chứng (Evidence):

1. **SOURCE:** Code đã được viết vào file tương ứng.
2. **BUILD / DEPLOYMENT:** Code đã được commit và deploy lên Vercel không lỗi.
3. **RUNTIME:** Browser tải được dữ liệu thật, DOM được tạo đúng, CSS không bị cache cũ đè lên.
4. **VISUAL / OWNER:** Giao diện hiển thị đúng ý đồ thẩm mỹ, ngữ nghĩa (Semantic) do Owner phê duyệt.

*Cấm tuyệt đối:* Lấy SOURCE PASS suy ra RUNTIME PASS. Lấy Agent Self-report suy ra ACCEPTED.

---

## I. DEFINITION OF DONE

**DONE ≠ Code Written.**

**DONE =**
1. Scope satisfied (Làm đúng yêu cầu).
2. + Source evidence (Code chuẩn).
3. + Deployment evidence (Đã lên mạng).
4. + Runtime evidence (Chạy mượt không lỗi JS/Cache).
5. + Regression evidence (Không phá hỏng cái cũ).
6. + Visual evidence (UI khi được yêu cầu).
7. + Owner Acceptance (Owner gật đầu).

Nếu thiếu bất kỳ evidence nào, Status = `UNVERIFIED` (Không phải PASS).

---

## J. VERIFICATION GATE (PIPELINE)

*(Xem thêm bản đồ quy trình chi tiết tại: [2026_WEBDESIGN_WORKFLOW.md](2026_WEBDESIGN_WORKFLOW.md))*

Task chỉ đóng khi qua đủ 9 trạm:
1. Preflight (AGY audit hiện trạng)
2. Implementation (Cline gõ code)
3. Local verification (Cline tự test)
4. Commit (Đẩy code)
5. Deployment (Vercel Build)
6. Production verification (AGY test runtime)
7. Regression verification (AGY đối chiếu)
8. Owner visual acceptance (Owner duyệt)
9. Close task.

AGY đóng vai trò hải quan độc lập, kiểm tra Cline. Task không được đóng nếu Gate Fail.

---

## K. CURRENT OPEN CHANGE (CONTRACT ĐẦU TIÊN)

*Status: Chỉ lập contract, KHÔNG THI CÔNG trong task này.*

**CHANGE-001 — Restore cc2f303 Production Runtime Integrity**
- **OWNER GOAL:** Làm cho các tính năng đã code trong `cc2f303` thực sự hiển thị trên Production, đồng thời chuẩn hóa Logo theo đúng quyết định mới nhất.
- **CURRENT STATE:** Production HTML có cập nhật, nhưng CSS/JS bị cache cứng ngắc (`?v=20260906_0105`). Favicon sai file. Mobile logo không hiển thị.
- **TARGET STATE:** Ký ức, Thế hệ hiển thị data thật. Favicon đúng chuẩn icon-only.
- **IN SCOPE:** Đổi cache-buster string trong `index.html`. Sửa `<link rel="icon">`.
- **OUT OF SCOPE:** Không sửa logic data fetch, không đổi CSS layout.
- **ALLOWED FILES:** `index.html`.
- **FORBIDDEN FILES:** `app.js`, `main.css`, `api/*`.
- **BRAND INVARIANTS (THEO OWNER DECISION MỚI NHẤT):**
  - `logoGiaToc_original.svg` = priority (khi đủ không gian)
  - `logoGiaToc_ngang.svg` = narrow/constrained
  - `logoGiaToc.svg` = icon-only (ưu tiên Favicon). KHÔNG tự ép dùng icon-only cho mobile nếu Owner không ra lệnh. Giữ nguyên trạng thái dùng logo Ngang cho mobile hiện tại trừ khi Owner yêu cầu khác.
- **ACCEPTANCE CRITERIA:**
  - [ ] `index.html` gọi `app.js?v=20260914...` (timestamp mới).
  - [ ] Thẻ Favicon trỏ đúng `logoGiaToc.svg`.
  - [ ] Truy cập `giatoctrantrongthu.com`, khối "KÝ ỨC & GHI CHÉP" hiển thị được Text lấy từ `appData.memories`.
- **STATUS:** UNVERIFIED (Chờ thi công).

---

## L. FUTURE CHANGE SEQUENCE

Trình tự kiểm soát các task tiếp theo (Tạo Handoff Contract trước khi làm):

- **CHANGE-001:** Restore cc2f303 production/runtime integrity.
- *(Sau khi 001 PASS)* **CHANGE-002:** Lock publication shell / homepage acceptance (Chốt duyệt homepage).
- **CHANGE-003:** MẠCH article detail (Trải nghiệm đọc bài chi tiết).
- **CHANGE-004:** Person Profile (Tái cấu trúc hồ sơ nhân vật).
- **CHANGE-005:** Global Search (Đấu nối UI thanh tìm kiếm).

---

## M. FAILURE HANDLING

**Trạng thái:** `FAIL`, `PARTIAL`, `UNVERIFIED`, `BLOCKED`.

**Quy tắc:**
- Nếu Verification Fail: KHÔNG tự patch, KHÔNG tự mở rộng task. Ghi lại evidence và nhường quyền quyết định cho Owner/AGY.
- Nếu phát hiện Scope Drift (Code lan man): STOP. Dừng thi công ngay lập tức.
- Nếu phát hiện Architecture Conflict: STOP. Cần OWNER DECISION REQUIRED.

---

## N. CONTROL SURFACE PRINCIPLES

1. Prompt is instruction, not truth.
2. Contract defines scope.
3. Invariants protect the construction.
4. Evidence defines reality.
5. Verification is independent from implementation.
6. Production must be verified at runtime.
7. Visual changes require visual acceptance.
8. Agents do not own product decisions.
9. No task closes without evidence.
10. The project state lives outside any single agent session.
