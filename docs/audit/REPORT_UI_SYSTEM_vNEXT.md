# GIATỘC — REPORT UI SYSTEM vNEXT

*Mission: GIATỘC UI / PRODUCT EXPERIENCE v0.3*
*Bắt nguồn: `GIATOC_ARCHITECTURE_CONSOLIDATION_v0.1.md` §6 (HANDOFF FOR UI)*
*Ngày: 2026-10-04 · Trạng thái: IMPLEMENTED + browser-verified (mức xác minh ghi rõ từng mục)*

---

## 1. WHAT CHANGED

Thiết kế và triển khai 5 bề mặt sản phẩm theo đúng ba discourse scope đã chốt, và
gỡ các bề mặt vi phạm ranh giới ngữ nghĩa:

| Việc | Kết quả |
|---|---|
| Mã hóa Product Model vào UI | `contexts.js` — 3 discourse scope + 5 UX context |
| Public shell | `/` viết lại: identity riêng, bỏ MẠCH/Gia phả/Tìm kiếm |
| Member Space | `/me` tách Account ≠ Person, thêm lối vào 3 scope riêng biệt |
| MẠCH + Clara | 2 route riêng, 2 masthead riêng, 2 guard chống nhầm lẫn |
| Family Space | Placeholder trung thực + ghi rõ BACKEND DEPENDENCY |
| Sửa lỗi v0.2 | `box-sizing`, nav overflow, typography switch vô hiệu |

**Không** sửa schema, dữ liệu gia phả, Source of Truth, auth model. **Không** commit,
push, deploy.

---

## 2. WHAT WAS PRESERVED FROM v0.2

- Toàn bộ token layer (`tokens/layout/components/states.css`) — chỉ bổ sung, không viết lại.
- Palette + typography đang dùng (bám site còn sống).
- `dom.js` (safe DOM, không `innerHTML`), `epistemic.js`, `visibility.js`, `Region()`.
- `/me/tree` và `/me/tree/person/:id` — theo chỉ đạo mission.
- Toàn bộ endpoint và hợp đồng auth.
- Prototype DESIGN-001 — **copy** sang `prototype/design-001-public/`, không xóa.

---

## 3. WHAT EVOLVED

Xem `docs/design/GIATOC_UI_SYSTEM_vNEXT.md` §3.2. Tóm tắt: context 2 → 5; thêm
discourse layer; nav hash → phẳng; thêm `NotAvailableState`; thêm lớp đọc
`editorial.js`; typography switch có CSS thật; có box-model reset.

---

## 4. PRODUCT SURFACES IMPLEMENTED

| Mức | Bề mặt | Trạng thái |
|---|---|---|
| **P0** | Application shell (5 context) | DONE + verified |
| **P1** | Public experience (`/`) | DONE (shell/identity) + verified · taxonomy `[OPEN QUESTION]` |
| **P2** | Member Space (`/me`) | DONE + verified |
| **P3** | Genealogy / Person | Giữ bề mặt v0.2 (`/me/tree/person/:id`) + verified không lỗi |
| **P4** | MẠCH reading (`/me/mach`) | Kiến trúc + guard DONE · **nội dung NOT AVAILABLE** (§7) |
| **P5** | Clara reading (`/me/clara`) | Kiến trúc + guard DONE · **nội dung NOT AVAILABLE** (§7) |
| **P6** | Family Space | Placeholder trung thực · **không có chức năng** |

---

## 5. ROUTES

| Route | Auth | Status |
|---|---|---|
| `/` | none | 200 |
| `/login` | none | 200 |
| `/me` | `requireAccount` | 302 anon → login |
| `/me/mach` | `requireAccount` | 302 anon → login |
| `/me/clara` | `requireAccount` | 302 anon → login |
| `/me/family-spaces` | `requireAccount` | 302 anon → login |
| `/me/tree` | `requireAccount` | LEGACY SPA, nguyên vẹn |
| `/me/tree/person/:id` | `requireAccount` | nguyên vẹn |
| `/logout` | — | nguyên vẹn |

Retire (giữ audit trail, không mount): `/#/gia-pha`, `/#/gia-dinh`, `/#/tu-lieu`,
`/#/mach`, `/#/tim-kiem`.

---

## 6. COMPONENTS

Xem `docs/design/GIATOC_COMPONENT_INVENTORY_vNEXT.md`. Mới: `ScopeMasthead`,
`EditorialList`, `EditorialItem`, `ScopeSeparationNote`, `DiscourseEntry`,
`NotAvailableState`. Module mới: `contexts.js`, `editorial.js`, `discourse.js`,
`public-home.js`, `spaces.js` + 3 boot.

---

## 7. DATA DEPENDENCIES

### 7.1 `[BACKEND DEPENDENCY]` — chặn nội dung MẠCH/Clara

`[FACT]` `GET /api/mach.json` hiện trả:

```json
{ "authors": {}, "series": {}, "stories": [ { "id": "s1", ... } ] }
```

1 story placeholder, series/authors rỗng. Corpus thật (19 bài, gồm series
`issue-01` và `thu-gui-clara`) nằm trong `server/data/mach.json` — đây là
**seed/projection artifact**, không endpoint nào phục vụ.

→ `/me/mach` và `/me/clara` hiển thị `NotAvailableState`. **Đây là trạng thái đúng,
không phải lỗi UI.** Không bịa bài để trang "đẹp".

Cần: (a) endpoint phục vụ nội dung; (b) quyết định tách Clara/MẠCH ở tầng dữ liệu
(Consolidation §5 Open Question 1: chung bảng `stories` + `visibility_flag`, hay
tách bảng).

### 7.2 `[BACKEND DEPENDENCY]` — Family Space

Chưa có API, chưa có mô hình thành viên/quyền. UI chỉ nêu phạm vi và phân biệt 4
khái niệm. Không giả lập quyền.

### 7.3 `[BACKEND DEPENDENCY]` — IdentityMapping

Nếu tài khoản chưa gắn Person, `/me` hiện `NotAvailableState` thay vì bịa nhân vật.

### 7.4 `[BACKEND DEPENDENCY]` — Genealogy client-side resolution

Vẫn tồn tại từ v0.2: `/api/genealogy.json` công khai và lớn; resolve vài tên quan
hệ tải cả bundle. Cần endpoint resolve phía server — là thay đổi API, **không tự
tạo trong mission này**.

### 7.5 Hiện trạng dữ liệu khác

| Dữ liệu | Trạng thái |
|---|---|
| `/api/genealogy.json` | 200 — 223 nhân vật, 68 gia đình, 2 ghi chép ký ức |
| `/api/member/profile` | 200 — `tuantq` ACTIVE, có Person |
| `/api/media.json`, `/api/person_media.json` | 200 — 1 liên kết tư liệu cho profile |
| Epistemic | Không render badge nào (thiếu source metadata) — **đúng thiết kế** |
| Visibility | `data-visibility-enforced="false"` — không giả vờ có enforcement |
| `birthYear='[object Object]'` | Vẫn còn ở một số dòng DB legacy. UI không hiển thị giá trị hỏng (render an toàn), nhưng **dữ liệu gốc vẫn cần được sửa qua migration/re-seed có phê duyệt** — ngoài phạm vi mission này. |

---

## 8. ARCHITECTURE CONSTRAINTS RESPECTED

| Ràng buộc | Cách tuân thủ | Bằng chứng QA |
|---|---|---|
| Clara ≠ MẠCH | Route riêng + `ScopeSeparationNote` | `/me/clara` chứa "không phải một chuyên mục của MẠCH" |
| MẠCH ≠ Public | MẠCH chỉ trong Member Space | Public **không** chứa chữ "MẠCH"/"Clara" |
| Public ≠ genealogy DB | `public-home.js` không render person/tree | Public không chứa "Gia Phả"/"Cây phả đồ" |
| Genealogy ≠ Public content | `UX_CONTEXT.GENEALOGY`, cần đăng nhập | 302 anon |
| Member ≠ Admin | "Không gian của tôi"; không shell admin | `/me` không chứa "Bảng điều khiển" |
| Person ≠ Account | 2 khối `[data-identity]` | `/me` có cả "tài khoản" và "nhân vật" |
| Không hardcode genealogy | Mọi zone render từ API | Không có hằng số người/năm trong JS |
| Không fake visibility | `data-visibility-enforced="false"` | — |
| Không fake epistemic | Badge chỉ khi có claim + source | 0 badge render |
| SoT = NAS | `SOT_NOTE` hiển thị ở `/me` | `/me` chứa "Nguồn gốc dữ liệu" + "NAS" |
| Không tự invent Public taxonomy | `[OPEN QUESTION]` ghi rõ | `/` chứa "OPEN QUESTION" |

---

## 9. BROWSER VERIFICATION — **VERIFIED**

- **Engine:** Google Chrome (headless) qua puppeteer.
- **Harness:** `scripts/ui_vnext_qa.mjs` (chạy lại được).
- **Kết quả:** `docs/audit/evidence/ui_vnext/qa_result.json`
  → **188 VERIFIED · 0 FAILED · 20 NOT AVAILABLE**.
- **Mỗi bề rộng: 47 assertion, đều VERIFIED.**

Journey đã đăng nhập chạy thật, không giả lập:

> Dùng cơ chế auto-login **của chính dự án**, trên một instance phụ **cổng 3100**
> khởi chạy với `DEV_AUTO_LOGIN` chỉ trong process đó. **Không ghi gì vào `.env` hay
> cấu hình bề vữ.** Instance chính (cổng 3000) chạy **không** có `DEV_AUTO_LOGIN`
> → `/login` vẫn là form đăng nhập thật.

Đã kiểm chứng trên 6 bề mặt × 4 bề rộng:

| Bề mặt | Khẳng định đã kiểm |
|---|---|
| `/` | HTTP 200, có identity riêng, **không** tên scope nội bộ, **không** genealogy, có `[OPEN QUESTION]`, không tràn ngang |
| `/me` | Có cả Account lẫn Person, có lối vào 3 scope, có SoT/NAS, **không** có "Bảng điều khiển" |
| `/me/mach` | Có masthead MẠCH, nội bộ, **không phải tạp chí công khai**, BACKEND DEPENDENCY |
| `/me/clara` | Có masthead Thư gửi Clara, **không phải một chuyên mục của MẠCH**, BACKEND DEPENDENCY |
| `/me/family-spaces` | Có placeholder trung thực + BACKEND DEPENDENCY |
| `/me/tree/person/:id` | Render, không lỗi |
| `/me/tree` | Legacy SPA vẫn truy cập được |

**12 ảnh chụp thật** tại 375 và 1440: `public_*`, `me_*`, `memach_*`, `meclara_*`,
`mefamily-space_*`, `metreepersonp1_*`.

### 9.1 Ba lỗi thật do QA phát hiện (đã sửa)

| Lỗi | Phát hiện | Nguyên nhân | Trạng thái |
|---|---|---|---|
| Tràn ngang mọi bề mặt | `scrollW` 383/784/1048 vs viewport 375/768/1024 | Foundation **không có** `box-sizing: border-box` nào | Đã sửa, nay `scrollW == innerW` ở cả 4 bề rộng |
| Nav đẩy trang | `scrollW = 1099` ở viewport 375 | Flex item thiếu `min-width: 0` | Đã sửa |
| Typography switch vô hiệu | Đọc lại mã nguồn | `setTypographyStack()` chỉ set attribute, không CSS nào đọc | Đã sửa (CSS selector thật) |

> Ba lỗi này **không thể phát hiện bằng đọc CSS tĩnh**. Chúng là lý do v0.2 phải ghi
> "IMPLEMENTED-UNVERIFIED" — và là lý do mission này phải chạy browser thật.

---

## 10. RESPONSIVE VERIFICATION — **VERIFIED**

| Bề rộng | Assertion | Kết quả |
|---|---|---|
| 375 | 47 | VERIFIED, `scrollW == innerW` |
| 768 | 47 | VERIFIED, `scrollW == innerW` |
| 1024 | 47 | VERIFIED, `scrollW == innerW` |
| 1440 | 47 | VERIFIED, `scrollW == innerW` |

Harness có **coverage guard**: một bề rộng chỉ được tuyên bố VERIFIED nếu thực sự
có assertion được ghi nhận tại bề rộng đó. Nếu bề rộng nào không chạy, nó hiện
FAILED chứ không im lặng bỏ qua.

---

## 11. ACCESSIBILITY VERIFICATION

| Hạng mục | Mức độ | Ghi chú |
|---|---|---|
| Ngữ nghĩa (`nav`/`main`/heading/landmark) | VERIFIED (source) | `<h1>` duy nhất mỗi trang qua `PageHeader`/`ScopeMasthead` |
| `aria-label` cho nav | VERIFIED (source) | Phân biệt global/member |
| `aria-current="page"` | VERIFIED (source) | Trang chủ hiện tại |
| Live region | VERIFIED (source) | Loading `aria-live="polite"`, Error `role="alert"` |
| Focus visible | VERIFIED (source) | Giữ ring, không bỏ outline |
| Reduced motion | VERIFIED (source) | Tắt animation (giữ từ v0.2) |
| **Tương phản WCAG** | **NOT VERIFIED** | Chưa đo contrast bằng công cụ. Không claim PASS. |
| **Screen reader thật** | **NOT VERIFIED** | Không có máy đọc màn hình trong môi trường. |
---

## 12. KNOWN GAPS

| # | Gap | Mức |
|---|---|---|
| 1 | `/favicon.ico` 404 (mặc định trình duyệt) | NOT AVAILABLE — không ship placeholder asset |
| 2 | Nội dung MẠCH/Clara chưa có backend | BACKEND DEPENDENCY (§7.1) |
| 3 | Family Space chưa có chức năng | BACKEND DEPENDENCY (§7.2) |
| 4 | Public chưa có content taxonomy | OPEN QUESTION — **Human quyết** |
| 5 | Chưa có route bài viết MẠCH/Clara | Chưa có nguồn thật để route |
| 6 | `/me/tree` legacy không dùng shell vNEXT | Transitional |
| 7 | `birthYear='[object Object]'` trong DB legacy | Cần Human gate để migrate/re-seed |
| 8 | `research review` vẫn PASS WITH CONDITIONS (R1–R4) | Ngoài phạm vi mission UI |
| 9 | `DEV_AUTO_LOGIN` + fail-open `!NODE_ENV` | **Deployment blocker** — chưa sửa (ngoài phạm vi UI) |
| 10 | Không có kiểm thử hồi quy tự động cho `member-app.js` | Chưa có |
| 11 | Chưa có kiểm thử hồi quy tự động cho UI vNEXT | Đã có harness QA nhưng chạy thủ công, chưa vào CI |

---

## 13. BACKEND DEPENDENCIES

Tóm tắt — chi tiết ở §7:

1. Phục vụ nội dung MẠCH/Clara + tách scope ở tầng dữ liệu.
2. Dữ liệu + phân quyền Family Space.
3. IdentityMapping tài khoản ↔ nhân vật.
4. Endpoint resolve quan hệ phía server (thay tải toàn bộ genealogy).
5. Quyết định visibility có enforcement thật hay không (hiện UI nói rõ là chưa có).

> UI **không** tự invent API cho các khoảng trống này.

---

## 14. OPEN QUESTIONS — CẦN HUMAN QUYẾT

1. **Public sẽ là gì?** Bài tiểu luận công khai riêng, hay chọn lọc từ MẠCH đẩy ra?
   *(Mở từ Purpose Audit §14, chưa có câu trả lời. UI chỉ dựng khung.)*
2. **Clara và MẠCH tách bảng hay chung bảng + cờ?** Quyết định này quyết định URL và
   API, không phải ngược lại.
3. **Có admin console không, và nó khác Member Space ra sao?** `CAPABILITY_MODEL.md`
   có 5 actor; UI chưa có shell admin.
4. **IA cuối cùng của Cây phả đồ?** Giữ hash route, hay phẳng hoá? Mission này giữ
   nguyên cả hai theo chỉ đạo — **chưa phải quyết định cuối**.
5. **Có bật typography Playfair/Inter không?** Cần ship file font trước.

---

## 15. NEXT RECOMMENDED VERTICAL SLICE

**"Một bài MẠCH thật, đọc được, tách bạch khỏi Clara."**

Lý do chọn đúng thứ này:

- Là khoảng trống lớn nhất giữa kiến trúc (đã chốt) và sản phẩm (chưa có nội dung).
- Kiểm chứng `editorial.js`, `discourse.js`, `ScopeMasthead` bằng **dữ liệu thật**
  thay vì `NotAvailableState`.
- Buộc phải trả lời Open Question #2 ở tầng dữ liệu trước khi UI hoàn thành được.

Thứ tự đề xuất:

1. **Human/Architecture** chốt cách tách Clara/MẠCH ở schema + endpoint phục vụ.
2. Backend phục vụ nội dung MẠCH (và Clara riêng).
3. UI: thêm route `/me/mach/bai-viet/:slug` (đã dựng sẵn chỗ qua `hrefFor`).
4. QA lại bằng `scripts/ui_vnext_qa.mjs`.

**Sau đó mới đến:** route bài Clara, rồi Public content (sau khi Open Question #1 có
đáp án).

---

## 16. RỦI RO

| Rủi ro | Mức | Giảm thiểu |
|---|---|---|
| `/` mới làm mất prototype cũ | Thấp | Đã copy sang `prototype/design-001-public/` |
| Hai bề mặt đọc rỗng khiến cảm giác "chưa làm gì" | Trung bình | `NotAvailableState` + BACKEND DEPENDENCY thay vì bịa nội dung |
| Taxonomy Public bị hiểu là "đã chốt" | Thấp | Gắn nhãn `[OPEN QUESTION]` ngay trên trang |
| QA chạy bằng dev auto-login khác journey thật | Trung bình | Đã ghi rõ cơ chế; `/login` thật nguyên vẹn, không bị sửa |
| `SERIES_SCOPE_HINTS` bị hiểu là schema | Trung bình | Gắn `[BACKEND DEPENDENCY]`; tường minh, gỡ được trong một commit |

---

## 17. ĐỐI CHIẾU DEFINITION OF DONE

| # | Yêu cầu | Trạng thái |
|---|---|---|
| 1 | Đã đọc và tuân thủ Architecture Handoff | ✅ |
| 2 | Không reset UI system v0.2 | ✅ Token/primitive giữ nguyên |
| 3 | Clara / MẠCH / Public phân biệt trong UI | ✅ `contexts.js` + route riêng |
| 4 | Public không biến thành MẠCH | ✅ Verified bằng assert |
| 5 | Genealogy không biến thành Public content | ✅ Verified |
| 6 | Member Space ≠ Admin | ✅ Verified |
| 7 | Person ≠ Account | ✅ Verified |
| 8 | Không hardcode genealogy facts | ✅ |
| 9 | Không fake visibility/security | ✅ |
| 10 | Không fake epistemic data | ✅ |
| 11 | UI dùng data thật khi có | ✅ |
| 12 | Backend dependencies ghi rõ | ✅ §7, §13 |
| 13 | Responsive test hoặc UNVERIFIED | ✅ **ĐÃ TEST** 4 bề rộng |
| 14 | Browser QA test hoặc UNVERIFIED | ✅ **ĐÃ TEST** Chrome thật |
| 15 | Regression hiện có được kiểm | ✅ `/me/tree` còn nguyên, còn truy cập |
| 16 | Có UI System vNEXT doc | ✅ |
| 17 | Có UI audit report | ✅ (tài liệu này) |
| 18 | Không thay DB/schema/SoT | ✅ |
| 19 | Không deploy | ✅ |
| 20 | Không push | ✅ |
| 21 | Không commit | ✅ |

**Không tự nhận DONE cho:**

- **Accessibility (§11):** contrast WCAG, screen reader, keyboard traversal đều
  `NOT VERIFIED`. Không claim PASS.
- **Responsive (§10):** VERIFIED nhưng **giới hạn ở 4 bề rộng mission quy định**, không
  phải mọi kích thước thực tế.
- **Nội dung MẠCH/Clara (§4, §7.1):** bề mặt xong, **nội dung NOT AVAILABLE**.
| **Bàn phím end-to-end** | **NOT VERIFIED** | Chưa chạy full keyboard traversal. |