# GIATỘC — APPLICATION SHELL vNEXT

*Mission: GIATỘC UI / PRODUCT EXPERIENCE v0.3*
*Status: IMPLEMENTED · kế thừa shell v0.2, KHÔNG reset*

---

## 1. NGUYÊN TẮC

`[ARCHITECTURE CONSTRAINT]` (CONSOLIDATION §6.5): UI **không được** giả định hoặc sửa
Architecture. Shell chỉ là bề mặt điều hướng; nó làm lộ ranh giới ngữ nghĩa, không
tự quyết chúng.

Ba câu hỏi mỗi surface phải trả lời được:

1. Tôi đang ở **context** nào? (public / member / editorial / genealogy / admin)
2. Tôi đang đọc **discourse scope** nào, hoặc không thuộc scope nào? (clara / mach / public / — )
3. Quay lại đây là **về cây điều hướng** hay **về lịch sử trình duyệt**?

Nếu một surface không trả lời được câu 2, nó đang là một trang "chung" — đúng thứ
đã làm Clara trông như một chuyên mục của MẠCH.

---

## 2. MÔ HÌNH CONTEXT

`contexts.js` khai báo 5 UX context:

| Context | Audience | Discourse | Ở đâu |
|---|---|---|---|
| `public` | public | `public` | `/` |
| `member` | member | — | `/me`, `/me/family-spaces`, `/me/change-password` |
| `editorial` | member | `mach` **hoặc** `clara` | `/me/mach`, `/me/clara` |
| `genealogy` | member | — (dữ liệu, không phải diễn ngôn) | `/me/tree`, `/me/tree/person/:id` |
| `admin` | — | — | **Chưa có.** `CAPABILITY_MODEL.md` mô tả 5 actor nhưng không có UI admin. Không dựng shell admin giả. |

`[OPEN QUESTION]` Member Space có phải là Admin Console không? — **Không.** Đây là
quyết định đã chốt: `/me` là "Không gian của tôi", không phải bảng điều khiển vận
hành. Từ "Bảng điều khiển" đã bị gỡ khỏi UI (CONSOLIDATION §6.4 cấm "Admin Dashboard").

---

## 3. BẢNG ROUTE (SITEMAP vNEXT)

`navigation.js` là registry duy nhất. `SITEMAP_v0.1.md` bị đánh dấu **OBSOLETE**
bởi consolidation §2 (mang tàn dư Public Tree).

| Route | Label | Audience | Context | Discourse | Trạng thái |
|---|---|---|---|---|---|
| `/` | Trang chủ | public | public | public | **vNEXT shell** |
| `/login` | Đăng nhập | public | public | public | hiện hữu |
| `/me` | Không gian của tôi | member | member | — | **vNEXT evolved** |
| `/me/mach` | MẠCH | member | editorial | `mach` | **vNEXT mới** |
| `/me/clara` | Thư gửi Clara | member | editorial | `clara` | **vNEXT mới** |
| `/me/tree` | Cây phả đồ | member | genealogy | — | **LEGACY SPA** |
| `/me/tree/person/:id` | Hồ sơ nhân vật | member | genealogy | — | **LEGACY-COMPAT** |
| `/me/family-spaces` | Không gian gia đình | member | member | — | **vNEXT placeholder** |
| `/me/change-password` | Đổi mật khẩu | member | member | — | hiện hữu |
| `/logout` | Đăng xuất | member | member | — | hiện hữu |

### 3.1 Route đã RETIRE (giữ để audit, không bao giờ mount lại)

`navigation.js` → `RETIRED_PUBLIC_ROUTES`:

| Route cũ | Lý do retire |
|---|---|
| `/#/gia-pha` | Public ≠ public genealogy database |
| `/#/gia-dinh` | Genealogy data không phải diễn ngôn công khai |
| `/#/tu-lieu` | Thư viện media không phải tiếng nói ra ngoài |
| `/#/mach` | MẠCH là diễn ngôn nội bộ, không được phản chiếu ra Public |
| `/#/tim-kiem` | Chưa có phạm vi tìm kiếm công khai nào được định nghĩa |

---

## 4. ĐIỀU HƯỚNG

### 4.1 Breadcrumb

- Member: `Không gian của tôi → <section> → <page>` (2 cấp, phẳng).
- `[FACT]` Không bao giờ gắn tiền tố "Member Space" — UI dùng "Không gian của tôi".
- Public: chuỗi nông riêng, **không** dùng chuỗi của Member.

### 4.2 Back navigation — hai hành vi, không bao giờ trộn

| Mode | Khi nào | Ví dụ |
|---|---|---|
| `hierarchy` | Có parent rõ trong IA | `/me/mach` → "← Không gian của tôi" |
| `history` | **Không** có parent | `/me` → "← Quay lại trang trước" |

`NAVIGATION_MODEL_v0.1 §3A` cảnh báo history-back có thể đẩy người dùng ra khỏi
app — vì vậy `hierarchy` là mặc định và chỉ dùng `history` khi không có cha.

### 4.3 Next

`nextByRoute` mở gợi ý điều hướng có thứ bập theo IA. `/me` dẫn tới
`MẠCH → Thư gửi Clara → Cây phả đồ → Không gian gia đình` — thứ tự này cố ý
tách bạch ba scope thay vì gộp thành "nội dung".

---

## 5. NAVIGATION THEO CONTEXT

### 5.1 Public (rút gọn mạnh)

```
Trang chủ · Đăng nhập
```

v0.2 từng để MẠCH, Gia phả, Tìm kiếm trên thanh công khai — cả ba đều vi phạm
ranh giới ngữ nghĩa. Đã gỡ. Public shell hiện chỉ có **2** mục.

### 5.2 Member (phẳng, 8 mục)

```
Không gian của tôi · MẠCH · Thư gửi Clara · Cây phả đồ ·
Không gian gia đình · Trang công khai · Đổi mật khẩu · Đăng xuất
```

Ghi chú thay đổi: `"Ấn phẩm MẠCH" → /#/mach` đã bị gỡ. Nhãn "ấn phẩm" gợi ý
publication, và liên kết đó đưa thành viên tới bản phản chiếu công khai của
diễn ngôn nội bộ — sai theo cả nghĩa lẫn quyền.

---

## 6. SHARED PRIMITIVES, CONTEXT RIÊNG

Shell dùng **chung** `InstitutionHeader`, `Breadcrumb`, `BackNavigation`, `Footer`
cho mọi context. Cái khác nhau chỉ nằm ở: nav items, scope indicator, auth boundary —
và những thứ đó đến từ `resolveContext()`.

| Primitive | Dùng ở context nào |
|---|---|
| `GlobalNav` | public |
| `MemberNav` | member, editorial, genealogy |
| `ScopeMasthead` | editorial (bắt buộc truyền scope) |
| `DiscourseEntry` | member, editorial |
| `Footer` | tất cả (link khác nhau theo audience) |

---

## 7. ACCESSIBILITY CỦA SHELL

- `<nav aria-label>` phân biệt global nav và member nav.
- Trang chủ hiện tại: `aria-current="page"`.
- Loading: `role="status" aria-live="polite"`.
- Error: `role="alert"`.
- Focus ring giữ trên `:focus-visible` (không bỏ outline).
- `prefers-reduced-motion` tắt animation (giữ từ v0.2).
- Tiêu đề: một `<h1>` mỗi trang qua `PageHeader`/`ScopeMasthead`.

---

## 8. RỦI RO ĐÃ BIẾT

| Rủi ro | Trạng thái |
|---|---|
| Không có admin shell | `[OPEN QUESTION]` — `CAPABILITY_MODEL.md` có actor nhưng chưa có quyết định UI |
| Sitemap chưa được phê duyệt | `/me/tree` + `/me/tree/person/:id` giữ nguyên theo chỉ đạo mission; **chưa** phải quyết định cuối về IA |
| Legacy SPA không dùng shell mới | `/me/tree` vẫn là `member_baseline.html`; shell vNEXT không bao phủ |
| Nav 8 mục ở bề rộng hẹp | Đã sửa bằng `min-width:0` + co gọn; xác minh ở 4 bề rộng |