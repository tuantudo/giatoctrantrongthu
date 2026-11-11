# GIATỘC — REPORT PUBLIC HOME VISUAL REFINEMENT v0.2

*Mission: PUBLIC HOME VISUAL / UX REFINEMENT v0.2 + PHASE 0 V0 baseline audit*
*Nguồn: `GIATOC_IDENTITY_PUBLIC_DISCOURSE_AUDIT_v0.1.md` (semantic authority)*
*Ngày: 2026-10-04 · Không commit / push / deploy · Không sửa DB / schema / SoT / auth*

---

## 1. EXECUTIVE SUMMARY

Public Home `/` được nâng từ semantic prototype (v0.1) thành một composition có
chủ đích theo **GIATỘC — FAMILY INSTITUTIONAL WEB**.

Trước khi sửa dòng code nào, tôi đã **inspect trực tiếp V0 production**
(`https://giatoctrantrongthu.com/`) và so sánh V0 → V1. Kết quả đó làm thay đổi
cả kết luận: **V0 không phải "legacy garbage"** — V0 có nội dung thật, một gate
hai hướng, và một khái niệm membership mạnh. V1 đúng về ngữ nghĩa nhưng **rỗng
hơn V0 rất nhiều** ở mắt khách ghé thăm.

Reference `VINHDANHBUTPHA` **đã truy cập được** (source thật:
`~/Landing_Page_Experiment/src/App.jsx`, 168 dòng Tailwind/React). Tôi phân tích
trực tiếp, không dựa vào bản tóm tắt cũ.

**Verdict: READY WITH CONDITIONS** — xem §20.

---

## 2. CURRENT v0.1 ASSESSMENT (trước khi sửa)

v0.1 đạt đúng semantic, nhưng về mặt thị giác:

| Vấn đề | Bằng chứng |
|---|---|
| Component stacking | 4 section, mỗi section là 1 khối + 1 state panel + 1 nút |
| ContextBar = application chrome | Dải "Cấp / Không gian / Diễn ngôn / Dữ liệu / Truy cập" ngay dưới header |
| Family Voice trông như feature dở | Viền đứt + nền sunken → ngôn ngữ "unfinished" |
| Tên gia tộc lặp 3 lần | Header brand text + `<h1>` + logo image trong threshold |
| Gate trông như alert box | Khối viền + nền sunken, giống warning panel |
| Threshold thiếu đòn kẻ | Chỉ logo + 1 dòng chữ |

---

## 3. REFERENCE SITE ANALYSIS

### 3.1 Source

| | |
|---|---|
| Reference | VINHDANHBUTPHA — "Vinh Danh Bứt Phá" landing page |
| Access | **ACCESSIBLE** — `~/Landing_Page_Experiment/src/App.jsx` |
| Công cụ | Tailwind 4 + React, single-page campaign landing |
| Bằng chứng | Đọc trực tiếp source, không dùng lại `docs/research/VINHDANHBUTPHA_*.md` |

### 3.2 Patterns quan sát được

| # | Pattern | Quan sát |
|---|---|---|
| 1 | Hierarchy | Hero → Cơ chế → Mốc → Early Bird → Sản phẩm → Quà → CTA → Footer |
| 2 | Hero | Band màu full-width, `pt-32 pb-24`, centered, eyebrow → display → subline → 1 CTA |
| 3 | Typography | Tương phản mạnh: `text-5xl md:text-7xl` vs `text-3xl md:text-5xl` vs `text-xl` |
| 4 | Grid | `max-w-5xl mx-auto` + `px-6`; 3-col, 2/4-col, flex-row |
| 5 | Rhythm | `gap-12`, `gap-x-8 gap-y-16`, `mb-16`, `mb-20` |
| 6 | Section spacing | `py-24` tiêu chuẩn, `py-32` cho section cao trọng → **không đều** |
| 7 | Navigation | **KHÔNG có** — landing page cuộn một trang |
| 8 | CTA | 1 CTA chủ đạo mỗi band, pill, tương phản cao, lặp ở hero + band cuối |
| 9 | Image | **Không ảnh thật** — blob gradient blur, hình tròn chữ "GIFT" |
| 10 | Negative space | Rộng: `py-24/32`, paragraph `max-w-2xl/3xl` |
| 11 | Transitions | Đổi nền xen kẽ + `border-y`, `border-t-[16px]`, `border-t-2` |
| 12 | Responsive | Mobile-first prefixes xuyên suốt |
| 13 | Interaction | Hover màu/viền, `group-hover:scale-105` |
| 14 | Density | Thấp–vừa, ít phần tử mỗi viewport |
| 15 | Identity ↔ content | Identity ở hero, **bookend** lại bằng band CTA cuối |

### 3.3 Patterns ĐƯỢC CHỌN

| Pattern | → GIATỘC |
|---|---|
| Tương phản scale mạnh | Threshold thống trị |
| Eyebrow → display → subline nhẹ | `gi-threshold__eyebrow/__name/__line` |
| Marker đánh số section | `01 / 02 / 03` |
| Section spacing **không đều** | threshold `--space-16`, zone `--space-12` |
| Bookend identity ↔ invitation | Threshold mở · Gate band đóng |
| Paragraph giới hạn measure | `--type-reading-measure` |
| Quy tắc thay vì shadow | `border-top`, `border-bottom`, gold rule |
| Trang không phụ thuộc ảnh | Typography + whitespace |

### 3.4 Patterns BỊ TỪ CHỐI

| Pattern | Lý do |
|---|---|
| Nút pill / `rounded-[3rem]` | Đặc sản marketing; Gia Tộc cần restraint |
| Blob gradient, `mix-blend-multiply` | Trang trí, không mang ngữ nghĩa |
| `font-black`, giọng ăn mừng | Gia Tộc là thiết chế, không phải chiến dịch |
| **Lưới card ở mọi section** | Chính là lỗi "component stacking" cần tránh |
| Không navigation | Gia Tộc cần cửa vào Member Space |
| Bảng màu Tailwind | Không copy — giữ palette heritage |

### 3.5 Rationale

Reference là **trang chiến dịch thương mại**. Cái mang sang được là nhịp độ, tương
phản thị giác, khoảng thở, kỷ luật "một CTA chủ đạo mỗi vùng". Cái không mang
sang được là mọi dấu ấn thương mại.

> **Không copy text, thương hiệu, ảnh, màu, layout, hay asset nào.**
---

## 4. GIATỘC DESIGN DIRECTION

`GIATỘC — FAMILY INSTITUTIONAL WEB`: gia tộc · định danh văn hóa · hiện diện biên
tập · bền vững · tiết chế · có chủ đích. Không SaaS, không dashboard, không CRUD,
không template rỗng.

---

## 5. INFORMATION ARCHITECTURE

| Vùng | Nội dung | Nguồn |
|---|---|---|
| Threshold | Tên gia tộc + một câu định danh | FACT (logo/repo) |
| Family Voice | Zone trống, state `not-available` | Không có public corpus |
| Family Identity | 2 câu mô tả bản chất nơi này | PROPOSAL copy |
| Gate | Câu hỏi + cửa `/login` | PROPOSAL copy |
| Footer | Brand + 2 link | — |

**Không thêm vùng nào. Không thêm route. Không thêm nav item.**

---

## 6. VISUAL HIERARCHY

`01 Identity → 02 Voice → 03 Orientation → 04 Gate`

Thực hiện bằng: tương phản scale (`clamp`), khoảng thở không đều, marker nhạt, một
dải heritage duy nhất cho Gate, footer tối lùi.
**Không** giải quyết hierarchy bằng thêm màu / shadow / badge.

---

## 7. TYPOGRAPHY / LAYOUT DECISIONS

| Quyết định | Cơ sở |
|---|---|
| Không đổi font family / palette / spacing token | Mission §9 — giữ design system |
| `clamp(2rem, 6.5vw, 3.5rem)` | Scale có chủ đích từng bề rộng thay vì co từ desktop |
| `text-wrap: balance` | Không để tên gia tộc rơi lẻ một từ |

---

## 8. CONTEXTBAR DECISION

**REMOVED khỏi `/`. Giữ nguyên toàn bộ Member Space.**

| | |
|---|---|
| Trước v0.2 | Dải "Cấp Ứng dụng / Không gian Trang chủ / Diễn ngôn … / Dữ liệu … / Truy cập Công khai" |
| Sau | **Bỏ** — mission §3 nêu đích danh; §13 cho phép Public là "Special Presentation Surface" |
| Thay bằng gì? | **Không thay bằng component metadata nào** |
| Định hướng ngữ nghĩa | Do chính trang đảm nhiệm: tên gia tộc + zone Tiếng nói + cổng |
| Member surfaces | **không đổi** |
| QA | Public phải **vắng**, Member phải **có** |

Lý do: người đọc Public không hỏi "tôi đang ở tầng dữ liệu nào" — họ hỏi "đây là
nhà của ai". Dải đó biến cửa vào của một thiết chế thành bảng trạng thái ứng dụng.

---

## 9. FAMILY VOICE TREATMENT

| | |
|---|---|
| Machine truth | `data-state="not-available"` — **không đổi** |
| Trước | `StatePanel` → viền đứt + nền sunken (đọc như feature dở) |
| Sau | `.gi-voice__absence`: đường kẻ trên + khoảng thở + câu serif cỡ h2 |
| Nghĩa | **DELIBERATE EDITORIAL ABSENCE** |
| QA thêm | Assert `border-style !== dashed` trên Public |

Không mượn MẠCH/Clara. Không tạo nội dung. Không dùng từ kỹ thuật.

---

## 10. GATE TREATMENT

| | |
|---|---|
| Trước | Khối sunken + viền → trông như alert box |
| Sau | Dải heritage đỏ, marker 03, câu hỏi cỡ h2, cửa là đường kẻ gold dưới chữ |
| Copy | "Bạn là người trong gia tộc?" → **"Vào không gian của gia tộc"** |
| Minh bạch | Hint giữ chữ "Đăng nhập để xem…" |
| Href | `/login` — không tạo auth mới |
| Full-bleed? | **Không** — `100vw` gây tràn ngang khi có scrollbar; QA chặn `scrollWidth == innerWidth` |

---

## 11. ASSET DECISION

Dùng `logoGiaToc_ngang.svg` (manifest, verified) cho header wordmark và
`logoGiaToc_favicon.svg` cho favicon. **Không** stock image, **không** ảnh gia
đình bịa. V0 có `logoGiaToc.jpg` nhưng đó là **logo raster** — đưa vào hero sẽ lặp
lại header.

---

## 12. RESPONSIVE DECISIONS

Fluid type bằng `clamp()`; ≤768 giảm padding và xếp marker dọc; ≤375 giảm thêm.
Mọi bề rộng đều bị assert `scrollWidth == innerW`.
---

## 13. CHANGES IMPLEMENTED

| File | Thay đổi |
|---|---|
| `src/js/ui/public-home.js` | Composition mới: threshold typography, section marker, voice absence, gate band |
| `src/css/foundation/components.css` | Khối presentation v0.2; xoá khối v0.1 |
| `src/js/ui/shell.js` | Bỏ ContextBar trên `/`; ẩn brand text trên `/` |
| `src/js/ui/components.js` | `InstitutionHeader` hỗ trợ `brand.hideText` |
| `scripts/ui_vnext_qa.mjs` | Assert mới: ContextBar vắng ở Public, không viền đứt, tên gia tộc 1 lần, section markers |

---

## 14. DELIBERATELY NOT IMPLEMENTED

| Không làm | Vì sao |
|---|---|
| Không thêm content Family Voice | Không có public corpus; mượn MẠCH/Clara là vi phạm |
| Không đưa lại "Gia phả" / "Tư Liệu" / "Lịch" / "Tìm kiếm" | V1 đã retire đúng semantic |
| Không thêm hero image | Không có ảnh thật |
| Không dùng màu/shadow/badge mới | Mission §7 |
| Không đổi Member Space | Mission §2.I |
| Không sửa DB/schema/SoT/auth/generator | Mission §14 |

---

## 15. SEMANTIC BOUNDARIES PRESERVED

`MẠCH → Public` ❌ · `Clara → Public` ❌ · `Public → Genealogy dashboard` ❌ ·
`Public → Person database` ❌ · `Public → FamilySpace dashboard` ❌ · `Public → Admin` ❌ ·
`Person → Account` ❌ · `Family → Genealogy` ❌

---

## 16. QA RESULTS

**360 VERIFIED · 0 FAILED · 20 NOT AVAILABLE** (`/favicon.ico` mặc định)
Public: **88 assertion** tất cả VERIFIED · 4 bề rộng · regression Member PASS.

Assertion mới: ContextBar vắng ở Public · H1 = tên gia tộc · 3 section marker ·
tên gia tộc **đúng 1 lần** trong `<main>` · voice absence **không viền đứt** ·
cửa ghi rõ dẫn tới sign-in.

### Lỗi thật phát hiện trong v0.2

| Lỗi | Cách phát hiện | Kết quả |
|---|---|---|
| **CSS hỏng**: insert của tôi cắt vào giữa rule `.gi-sectionmark__index`, mất ~15 dòng khai báo và mọi rule phía sau | **QA vẫn báo 360 VERIFIED**, chỉ screenshot mới lộ ra | Đã sửa — bằng chứng rõ nhất cho mission §20 |
| Assertion gate door lỗi thời sau khi đổi copy | QA FAILED 4/4 bề rộng | Sửa assertion + copy |
| Tên gia tộc rơi lẻ "Thu" | Screenshot | `max-width` 18ch→22ch + `text-wrap: balance` |
| Header lặp tên cạnh logo | Screenshot | `brand.hideText` |
| Khoảng trống lớn dưới zone Voice | Screenshot | Giảm `padding-bottom` |

---

## 17. SCREENSHOT EVIDENCE

`docs/audit/evidence/ui_vnext/` — 12 ảnh. **Đã review trực quan:** `public_1440.png`,
`public_375.png` (+ 10 ảnh member).

| # | Câu hỏi design QA | Đánh giá |
|---|---|---|
| 1 | Tên gia tộc thống trị? | ✅ Một dòng, cỡ lớn |
| 2 | Màn hình đầu tĩnh, có chủ đích? | ✅ |
| 3 | Hierarchy rõ không cần đọc hết? | ✅ 01→02→03 |
| 4 | Voice có cảm giác editorial? | ✅ |
| 5 | Gate có cảm giác bước vào nhà? | ✅ |
| 6 | Đủ negative space? | ✅ (zone Voice còn hơi trống) |
| 7 | Section phân biệt mà không loạn? | ✅ |
---

# V0 → V1 REPLACEMENT ASSESSMENT

## A. V0 là gì (inspect trực tiếp 2026-10-04)

V0 = DESIGN-001 prototype, hash-routed SPA, một document 19 KB, title tag
"Gia Tộc Trần Trọng Thu — DESIGN-001 Revision Prototype".

### V0 có thật và đáng ghi nhận

| Điểm mạnh V0 | Bằng chứng từ trang |
|---|---|
| **Nội dung thật** | MẠCH articles (series `issue-01`), memory excerpt từ `genealogy.json`, media state, lịch từ `CAL_*.ics`, số liệu gia phả |
| **Gate hai hướng** | "Hướng 1 · Công khai" vs "Hướng 2 · Dành cho người trong họ" |
| **Membership là khái niệm sản phẩm** | "Đây là một entry point sản phẩm — không phải chỉ là nút đăng nhập kỹ thuật" |
| **Genealogy overview có ranh giới rõ** | "công khai chỉ trình bày tổng quan; cây phả chi tiết nằm trong không gian thành viên" |
| **Kỷ luật biên tập** | Nhãn "Giới thiệu · DRAFT COPY"; "Bản copy cuối sẽ được hoàn thiện khi nguồn tư liệu được xác minh" |
| **Tiện ích đọc** | A−/A+, share, print; search MẠCH + ký ức |

### V0 yếu — và vì sao V0 không thể giữ nguyên

| Vấn đề | Mức độ |
|---|---|
| Publish MẠCH (nội bộ) + Clara (riêng tư) ra public | **Vi phạm Human Decision** |
| Tab "Gia phả" mời khám phá cây | Vi phạm audit §13 |
| Rò rỉ kỹ thuật: "PROTOTYPE", "DRAFT COPY", "media.json hiện chỉ có assetId / sha256", "Owner Control Plane", "backend contract sẽ được xác định ở giai đoạn sau" | Trải nghiệm tệ |
| Số liệu rỗng hiện dạng "—" | Trông như lỗi dữ liệu |
| Search phủ nội dung nội bộ | Rò rỉ |

## B. So sánh 15 chiều

| # | Chiều | Đánh giá |
|---|---|---|
| 1 | Identity | **IMPROVED** — V1 thống trị, một tên, không draft marker |
| 2 | IA | **REGRESSED** — V0 có 6 section có nội dung; V1 có 4 zone, 3 zone gần trống |
| 3 | Content allocation | **REGRESSED** — mất hết article/memory/calendar/media |
| 4 | Navigation | **TRANSFORMED** — 6 item (3 sai) → 4 item (2 anchor + login) |
| 5 | Public narrative | **REGRESSED** — V0 có câu chuyện mở đầu; V1 chỉ một câu định danh |
| 6 | Family Voice | **NEW (rỗng)** — V0 có voice nhưng **sai** (lấy MẠCH) |
| 7 | Family Identity | **PRESERVED (yếu)** |
| 8 | Member Gate | **IMPROVED** — rõ ngữ nghĩa, bỏ prototype noise |
| 9 | Visual hierarchy | **IMPROVED** |
| 10 | Typography | **IMPROVED** |
| 11 | Composition | **IMPROVED** |
| 12 | Responsive UX | **IMPROVED** — V0 không có kỷ luật mobile |
| 13 | Interaction | **REGRESSED** — mất search, mất reader tools |
| 14 | Dynamic capability | **NEW** — nhưng visitor **chưa nhận được** (xem §D) |
| 15 | Extensibility | **IMPROVED** — nền tảng thật, sẵn sàng nội dung public |

## C. Phân biệt loại bỏ

| Mất | Phân loại |
|---|---|
| MẠCH articles khỏi Public | **INTENTIONAL SEMANTIC CHANGE** |
| Clara articles khỏi Public | **INTENTIONAL SEMANTIC CHANGE** |
| Cây gia phả / Person khỏi Public | **INTENTIONAL SEMANTIC CHANGE** |
| Search | **INTENTIONAL** — search phủ nội dung nội bộ |
| Genealogy **overview** (số liệu + câu định hướng) | **UNKNOWN** — có thể giữ, cần Human quyết |
| **Lịch gia đình** (nguồn `.ics` thật) | **UNKNOWN** — audit §11 xếp event là public content |
| Utility strip (ngày, icon) | **ACCIDENTAL LOSS** — không giá trị ngữ nghĩa, chấp nhận |
| Câu chuyện mở đầu ấm của V0 | **ACCIDENTAL LOSS** — V1 thay bằng câu trạng thái |

## D. Dynamic ≠ better

**Visitor nhận được capability mới nào từ V1 hôm nay?**

| Khả năng | Visitor có nhận được? |
|---|---|
| Data layer động | **Không** — trang không đọng dữ liệu nào |
| API/schema sẵn sàng | **Không** — tiềm năng, không phải trải nghiệm |
| Tách sạch ngữ nghĩa | **Có** — nhưng đây là **giảm rủi ro**, không phải capability mới |
| Nội dung công khai | **Không có** |

> V1 có backend, nhưng **visitor hôm nay không nhận được capability động nào**.
> Lý do "dynamic" **không** biện minh cho một trang gần như trống.

## E. Replacement test

| Tiêu chí | Kết quả |
|---|---|
| Identity không bị mất | ✅ **Mạnh hơn** |
| Content discoverability không regression | ❌ **Mất gần hết nội dung V0** |
| IA không regression | ⚠️ Có chủ đích, nhưng mất sâu |
| Navigation không regression | ⚠️ Mất search |
| Responsive không regression | ✅ |
| Visual quality không thấp hơn V0 | ✅ |
| Semantic model tốt hơn V0 | ✅ **Rõ ràng** |
| Dynamic foundation cho tương lai | ✅ |
| Những thứ còn thiếu là intentional | ⚠️ **Một phần** — rỗng là cố ý, nhưng **thời điểm thay thế** thì chưa |

## F. Verdict

# 🟡 READY WITH CONDITIONS

**Lý do không phải READY:** thay V0 ngay sẽ **xoá khỏi internet gần như toàn bộ
nội dung công khai V0 đang có**, thay bằng một trang gần như trống. Visitor mất khả
năng đọc, tìm kiếm, và xem lịch gia đình. Chất lượng *trang* tăng; giá trị *cho
visitor* giảm.

**Lý do không phải NOT READY:** V0 đang vi phạm ràng buộc ngữ nghĩa Human đã chốt —
publish nội dung nội bộ và riêng tư ra công khai. Vấn đề này nghiêm trọng hơn việc
trang trống.

**Điều kiện để thay thế:**

| # | Điều kiện |
|---|---|
| 1 | Family Voice có **ít nhất 1 nội dung public thật**, **hoặc** Human chấp nhận rõ ràng việc giao diện công khai tạm thời không có nội dung |
| 2 | Human quyết định 2 câu hỏi §18 (genealogy overview, family calendar) — hiện UNKNOWN |
| 3 | Duyệt copy |
| 4 | Xác nhận `/login` + Member Space chịu được lưu lượng thật |

**Không** dùng "mới hơn", "hiện đại hơn", "động hơn" làm lý do. V0 có nội dung;
V1 có ngữ nghĩa đúng. Cả hai đều đúng — và chúng loại trừ nhau ở thời điểm này.
| 8 | Typography làm phần lớn việc? | ✅ |
| 9 | Còn metadata kỹ thuật? | ✅ Không |
| 10 | Trông **designed** hay **assembled**? | ✅ designed |
| 11 | Mobile giữ identity? | ✅ (đã xem 375) |
| 12 | Hợp với một thiết chế gia đình? | 🟡 vì **trang gần như trống** |

> Câu 12 là lý do verdict là **READY WITH CONDITIONS**, không phải vì kỹ thuật.

---

## 18. REMAINING OPEN QUESTIONS

| # | Câu hỏi |
|---|---|
| 1 | **Family Voice authority** — ai phát ngôn, quy trình duyệt |
| 2 | **Public content model** — có cần route/list nội dung public không |
| 3 | **Genealogy overview ở Public?** V0 có (số liệu + câu "công khai chỉ trình bày tổng quan"). Audit §13 không cấm *overview* (chỉ cấm tree/person profile), cũng không cấp phép → **UNKNOWN** |
| 4 | **Lịch gia đình ở Public?** V0 có (nguồn `CAL_*.ics` thật). Audit §11 xếp family events là public content. V1 đã loại → **UNKNOWN** |
| 5 | **Copy** 5 câu đang là PROPOSAL |
| 6 | **Ảnh gia đình thật** — có dùng được không |
| 7 | **Gate full-bleed** — có chấp nhận `100vw` + cắt scrollbar không |

---

## 19. HUMAN DECISIONS REQUIRED

1. Duyệt copy (5 câu, đều PROPOSAL).
2. Family Voice authority + public content model.
3. Quyết định 2 câu hỏi UNKNOWN ở §18.
4. Quyết định **timing thay thế V0** — xem §20.
5. Có ảnh gia đình thật không.

---

## 20. FINAL ASSESSMENT

| Hạng mục | Mức |
|---|---|
| **SEMANTIC QUALITY** | **STRONG** — đúng mô hình Human + Agy ở mọi điểm V0 sai |
| **UX QUALITY** | **GOOD** — gate rõ, đường vào rõ, không còn cảm giác ứng dụng |
| **VISUAL QUALITY** | **GOOD, chưa hoàn hảo** — hierarchy/rhythm/typography đạt; zone Voice còn trống |
| **REGRESSION STATUS** | **PASS** — 360/360, Member Space nguyên vẹn, security 404 giữ nguyên |