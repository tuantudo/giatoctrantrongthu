# GIATỘC — REPORT PUBLIC HOME IMPLEMENTATION v0.1

*Mission: PUBLIC HOME / GATE IMPLEMENTATION v0.1*
*Semantic input: `docs/audit/GIATOC_IDENTITY_PUBLIC_DISCOURSE_AUDIT_v0.1.md`*
*Ngày: 2026-10-04 · Không commit / push / deploy · Không sửa DB, schema, SoT, auth*

---

## 1. WHAT CHANGED

`/` được viết lại thành **cổng của gia tộc** theo Gate Model (audit §12):
`THE WORLD → PUBLIC HOME → (đọc Family Voice | đăng nhập) Family Space`.

| Hạng mục | Trước | Sau |
|---|---|---|
| Trang | Bảng "phạm vi" liệt kê Có/Không ở đây + `OPEN QUESTION` | Threshold → Voice → Identity → Gate |
| Tiêu đề | "Tiếng nói của gia tộc" (nhãn scope) | **Tên gia tộc** là danh tính trang |
| Family Voice | Không có vùng riêng | Vùng riêng, state trung thực |
| Cổng vào | 1 dòng chữ nhỏ + nút | Khối "Bạn là người trong gia tộc?" → cửa `/login` |
| Nav | Trang chủ · Đăng nhập | + 2 anchor trong trang (không thêm route) |
| Footer | `Tiếng nói của gia tộc · UI System vNEXT` | Không còn từ kỹ thuật |
| Breadcrumb `/` | 1 crumb thừa | Bỏ (breadcrumb rỗng = nhiễu) |

Files: `src/js/ui/public-home.js` (viết lại), `boot-public.js` (truyền assets),
`shell.js` (nav + footer), `navigation.js` (breadcrumb), `contexts.js` (nhãn),
`components.css` (grammar Gate), `scripts/ui_vnext_qa.mjs` (12 kiểm mới).

---

## 2. SEMANTIC DECISIONS CONSUMED

| Nguồn | Điều | Cách áp dụng |
|---|---|---|
| Audit §9 | Public = diện mạo gia tộc, **không** phải dashboard/thư viện gia phả | Không lưới card, không số liệu, không cây |
| Audit §10 | Family Voice là chủ thể phát ngôn **ngoài** MẠCH và Clara | Zone riêng; **không** lấy bài MẠCH/Clara |
| Audit §11 | Public thuộc về: shared history · statements · selected essays · events | Zone chờ nội dung, chưa dựng taxonomy |
| Audit §12 | GATE MODEL — World → Public → Family Space | Bố cục Threshold → … → Gate |
| Audit §13 | Không cây phả hệ, không hồ sơ nhân vật, không bài nội bộ | QA kiểm bằng assert |
| Audit §13 | Xoá nav "Gia phả", "Tư liệu" | Nav chỉ còn anchor + `/login` |
| Audit §18 | Digital Family Institution, 3 lớp | Gate là lớp 1; lớp 2–3 sau login |

---

## 3. UX DECISIONS

| Quyết định | Lý do |
|---|---|
| Tên gia tộc là `<h1>` | Mission §4A: identity phải là **nội dung chính**. Một "family gate" mà H1 là nhãn kỹ thuật thì không phải cổng |
| Logo thật ở threshold | Mission §5: ưu tiên source thật. Đây là asset có thật, đã verify trong manifest |
| Không ảnh gia đình | Không có ảnh gia đình thật trong repo. **Không** lấy stock. Thiết kế đứng được bằng typography + spacing |
| Cửa là `<a>`, không phải form | Mission §4D: đây là GATE, không phải auth dashboard |
| Không badge/card/metadata mới | Mission §5: SAME SYSTEM |
| Giữ nguyên ContextBar | Mission §10 cấm phá. **Xem Open Question #1** |
| Không đổi route | Không thêm route, không đổi route |

Giữ nguyên v0.4: ContextBar · PageHeader · StatePanel · 1 H1 · tokens · spacing ·
palette · responsive. **Không paradigm thứ hai.**

---

## 4. CONTENT DECISIONS

**Không có một chữ nào về lịch sử gia tộc.**

| Nội dung | Nguồn | Trạng thái |
|---|---|---|
| "Gia Tộc Trần Trọng Thu" | FACT — logo + repo | OK |
| "Cửa vào của gia tộc" | PROPOSAL copy | **Cần Human duyệt** |
| "Nơi lưu giữ ký ức, hồ sơ và tiếng nói của một gia tộc." | PROPOSAL copy | **Cần Human duyệt** |
| 2 câu mô tả bản chất nơi này | PROPOSAL copy | **Cần Human duyệt** |
| "Bạn là người trong gia tộc?" | PROPOSAL copy | **Cần Human duyệt** |

Mọi câu đều **không chứa claim lịch sử** (không năm, không địa danh, không sự kiện,
không tên người, không quote, không giá trị gia đình). Mission §7 yêu cầu chọn phương
án conservative nhất nếu cần nhiều lựa chọn — vì vậy copy **mô tả bản chất nơi này**,
không kể chuyện gia tộc.

### Zone Family Voice — vì sao rỗng

`[IMPLEMENTATION FACT]` **Không tồn tại nội dung public-scope nào trong repo.**
Mọi story trong `server/data/mach.json` thuộc `issue-01` (MẠCH, nội bộ) hoặc
`thu-gui-clara` (thân mật) — không series public nào.

Dùng MẠCH làm nguồn public chính là biến `MẠCH → Public` — bị audit §10 và mission
§3 cấm. Nên zone này hiển thị:

- `data-state="not-available"` (sự thật cho máy/QA)
- Chữ **bằng ngôn ngữ gia tộc**: *"Gia tộc chưa có điều muốn nói ra ngoài"* — không
  dùng "OPEN QUESTION" / "backend dependency".

Đây là điểm cốt lõi: **state trung thực + ngôn ngữ gia đình**, không phải
diagnostic prose để giải thích kiến trúc.
---

## 5. ASSETS USED

| Asset | Nguồn | Dùng ở |
|---|---|---|
| `/assets/images/logoGiaToc_ngang.svg` | `[FACT]` file tồn tại, qua `ASSET_MANIFEST.json` | Threshold |
| `/assets/images/logoGiaToc_favicon.svg` | `[FACT]` qua manifest | Favicon (`applyFavicon`) |

**Không** dùng avatar người (không phải nội dung public). **Không** stock image.
**Không** placeholder. Component tự render text-only nếu manifest lỗi.

---

## 6. CỐ TÌNH KHÔNG LÀM

| Không làm | Vì sao |
|---|---|
| Không dựng taxonomy nội dung Public | Audit §17.2 cần Human chỉ định Editor-in-Chief |
| Không lấy bài MẠCH/Clara cho Public | Cấm tuyệt đối (audit §10, §13) |
| Không thêm route Public (bài viết, sự kiện) | Audit §11 chưa định nghĩa mô hình nội dung |
| Không kể lịch sử gia tộc | Mission §6 — không có nguồn |
| Không thêm admin / bất kỳ scope nội bộ nào vào Public | Audit §13 |
| Không sửa ContextBar | Mission §10 — nêu ở Open Question #1 |
| Không đổi palette / typography / spacing | Mission §5 — không có lỗi để sửa |
| Không tạo CMS, content model, API | Mission §9 |

---

## 7. OPEN QUESTIONS / HUMAN DECISION REQUIRED

Mission §12 yêu cầu **dừng**, không tự quyết, khi gặp các vấn đề sau:

| # | Câu hỏi | Tác động lên UI | Vì sao tôi không tự quyết |
|---|---|---|---|
| 1 | **ContextBar có nên giữ trên Public?** | Nó là dải metadata ("Cấp Ứng dụng / Dữ liệu Dữ liệu nội dung") — hơi giống metadata/diagnostic mà mission §5 cảnh báo. Nhưng mission §10 cấm phá ContextBar | Bỏ nó là phá contract v0.4; giữ nó là giữ metadata. Cần Human chọn |
| 2 | **Family Voice authority** | Zone này rỗng cho tới khi có quyết định | Audit §16 / §17.2 |
| 3 | **Public content model** | Chưa có route/list cho nội dung public | Audit §11, §16 |
| 4 | **Public genealogy semantics** | Đã loại khỏi Public; nếu Human muốn có "định hướng phả hệ" thì cần mô hình mới | Mission §12 yêu cầu dừng |
| 5 | **Family identity claims** | Copy hiện là PROPOSAL | Mission §7 |
| 6 | **Ai phát ngôn** | Audit §5 "WHO CAN SPEAK = OPEN QUESTION" | Human |
| 7 | **Có ảnh gia đình thật không?** | Threshold đang đứng bằng typography | Nếu có ảnh thật thì nâng được cảm giác "nhà mình" |

Tôi **không** tự trả lời bất kỳ câu nào ở trên.

---

## 8. BROWSER QA RESULTS

**352 VERIFIED · 0 FAILED · 20 NOT AVAILABLE** (20 = `/favicon.ico` mặc định, có sẵn từ trước)

| Nhóm kiểm | Kết quả |
|---|---|
| Public assertions | **80**, tất cả VERIFIED |
| Mỗi bề rộng | 88 assertion × {375, 768, 1024, 1440} |
| Regression (member surfaces) | Toàn bộ assertion v0.4 vẫn chạy, vẫn pass |

12 yêu cầu của mission §11:

| # | Kiểm | Kết quả |
|---|---|---|
| 1 | Public identity rõ | ✅ H1 = tên gia tộc + logo thật |
| 2 | Family Gate rõ | ✅ "Bạn là người trong gia tộc?" + cửa |
| 3 | Family Voice không bị nhầm thành MẠCH | ✅ Zone riêng, không bài nội bộ |
| 4 | Không Clara/MẠCH leakage | ✅ assert `!/MẠCH\|Clara/i` |
| 5 | Không technical audit prose | ✅ assert chặn `open question\|architecture\|ui system\|backend dependency\|phạm vi trang công khai\|có ở đây\|không ở đây` |
| 6 | Không fabricated content | ✅ assert không có năm bịa; state `not-available` |
| 7 | Đường vào Member Space | ✅ `data-gate="member-space"` → `/login` |
| 8 | Responsive | ✅ 4 bề rộng |
| 9 | Không horizontal overflow | ✅ `scrollW == innerW` |
| 10 | Đúng 1 H1 | ✅ |
| 11 | Context semantics | ✅ `data-context=public`, `data-discourse-kind=external`, `data-access=public` |
| 12 | Regression assertions | ✅ 0 FAILED |

### Lỗi thật do QA phát hiện

| Lỗi | Phát hiện bởi | Đã sửa |
|---|---|---|
| Footer in **"UI System vNEXT"** — từ kỹ thuật lộ ra trên cổng gia tộc | assert *"no technical audit prose"* (fail cả 4 bề rộng) | Gỡ khỏi footer |
| Câu threshold lặp 2 lần (subtitle + threshold) | Kiểm tra screenshot | Bỏ khỏi `PageHeader` |
| Breadcrumb `/` chỉ 1 crumb thừa | Kiểm tra screenshot | Bỏ breadcrumb rỗng |
| Nhãn scope "Tiếng nói **Gia tộc**" lệch chữ hoa, lộ ra công khai | Kiểm tra screenshot | Sửa thành "Tiếng nói của gia tộc" |

---

## 9. REGRESSION RESULTS

| Kiểm | Kết quả |
|---|---|
| 21 module ES syntax | PASS |
| `/` anon | 200 |
| `/login` anon | 200 |
| `/me`, `/me/mach`, `/me/clara`, `/me/family-spaces`, `/me/tree`, `/me/tree/person/:id` anon | 302 → login (đúng contract) |
| Security: `/server/*.db`, `/.env`, `/server/data/mach.json` | 404 |
| ContextBar v0.4 | Nguyên vẹn trên mọi surface |
| Back navigation hierarchy | Không đổi |
| `innerHTML` trong UI | 0 (chỉ còn 2 dòng comment) |
| `/me/tree` legacy SPA | Còn nguyên |

---

## 10. EVIDENCE

`docs/audit/evidence/ui_vnext/`
- `qa_result.json` — 372 kết quả assertion có máy đối chiếu
- `public_375.png`, `public_1440.png` — ảnh chụp thật của Gate
- 10 ảnh member surface — chứng minh không regression

---

## 11. HUMAN DECISIONS STILL REQUIRED

1. **Duyệt copy** cho 5 câu ở §4 (đều là PROPOSAL).
2. **Trả lời Open Question #1**: giữ hay hạ ContextBar trên Public.
3. **Family Voice authority** — ai phát ngôn, quy trình duyệt (audit §16/§17.2).
4. **Public content model** — có cần route/list nội dung public không.
5. **Ảnh gia đình thật** — có dùng được không.

Không quyết định nào ở trên tôi đã tự ý thực hiện.