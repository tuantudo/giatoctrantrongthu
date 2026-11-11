# OWNER CONTROL SURFACE AUDIT
**Project:** giatoctrantrongthu
**Audit Target:** Brand System, Web Interface, Backend Integration, Deployment, and Commit 48965ae.

---

## 1. BRAND CONTROL AUDIT

**Canonical Brand Source:** `brand/manifest.json`
**Generated CSS:** `brand/generated/brand.css`
**Generator:** `scripts/generate-brand-css.mjs`

### Brand Control Map
| Brand concern | Current source | Canonical? | Consumers | Problems |
|---|---|---|---|---|
| Typography | `manifest.json` | Yes | `brand.css` (`--font-brand`) | `main.css` has hardcoded `ui-monospace`, `Georgia`, and overrides using `var(--font-sans)` instead of strictly pulling from brand tokens. |
| Colors (Brand) | `manifest.json` | Yes | `brand.css` | `main.css` hardcodes dozens of Tailwind-like hex colors (`#1d4ed8`, `#f8fafc`, `#1e40af`, `#94a3b8`, `#fefce8`) bypassing the brand system entirely. |
| Colors (Generations)| `main.css` | No | `.bg-gen-f1` to `.f4` | Generation colors are hardcoded inside CSS, skipping Manifest. |
| Shapes (Radius)| `manifest.json` | Yes | `brand.css` | Mostly respected, but some inline overrides exist. |
| Logo Assets | `index.html` | No | `<picture>` tag | Hardcoded in `index.html` using a 3-tier responsive rule. `manifest.json` has `logo` definition but it is not automatically propagated to the UI. |
| Favicon | `index.html` | No | `<link>` tag | Hardcoded in `index.html`. Manifest only *documents* it. |

**KẾT LUẬN:** 
Brand System hiện tại mới chỉ ở mức **DOCUMENTED** (và partially controlled đối với typography/primary colors). Nó hoàn toàn bị Bypass (vượt mặt) bởi hàng loạt class tiện ích (utility classes) và hardcoded hex colors trong `src/css/main.css`.

---

## 2. WEB INTERFACE CONTROL AUDIT

### UI CONTROL MAP
```text
Global shell (index.html)                          [ SAFE TO CHANGE ]
    ↓
Header / Masthead (index.html + CSS)               [ CHANGE WITH CARE ]
    ↓
Navigation (index.html + CSS)                      [ CHANGE WITH CARE ]
    ↓
Homepage publication shell (index.html + app.js)   [ DO NOT TOUCH WITHOUT REGRESSION TEST ]
    ↓
Application views (app.js JS renderers)            [ DO NOT TOUCH WITHOUT REGRESSION TEST ]
    ↓
Shared components (app.js UI helpers)              [ DO NOT TOUCH WITHOUT REGRESSION TEST ]
    ↓
Page-specific CSS (main.css)                       [ CHANGE WITH CARE ]
```

**Phân tích Coupling:**
- **Homepage Styles:** Homepage markup nằm trong `index.html` (`#view_home`), nhưng nội dung bên trong lại bị DOM injection bởi `app.js` (`renderHomePublicationLanding()`).
- **Global CSS Coupling:** `src/css/main.css` là một file monolithic (nguyên khối). Mọi thay đổi về màu sắc/layout ở đây có nguy cơ (regression) làm hỏng các application views khác do selector rò rỉ.
- **Inline Styles:** Rải rác trong `app.js` (ví dụ: Google Calendar note `style="color:#1d4ed8;..."`).

---

## 3. DATA / BACKEND INTEGRATION AUDIT

Dữ liệu được nạp vào Frontend (Client-side) thông qua `fetch()` trong `src/js/app.js`.

| Domain | Source of truth | API Endpoint | Frontend loader | State | Renderer | View |
|---|---|---|---|---|---|---|
| People / Families | MariaDB/Backend | `api.giatoctrantrongthu.com/api/genealogy.json` | `fetch()` in `app.js` | `window.appData` | `renderPerson()`, `renderGenealogyGraph()` | `#/gia-pha` |
| MẠCH | Backend (CMS?) | `api.giatoctrantrongthu.com/api/mach.json` | `fetch()` in `app.js` | `window.machData` | `renderMachView()` | `#/mach` |
| Calendar / Sự kiện | Backend | `api.giatoctrantrongthu.com/api/calendars/CAL_*.ics` | `fetch()` ICS string | parsed `window.calEvents` | `renderCalendarView()` | `#/lich` |
| Media / Tư Liệu | Backend | `api.giatoctrantrongthu.com/api/media.json` | `fetch()` in `app.js` | `window.appData.media` | `renderMediaView()` | `#/tu-lieu` |
| Search | Backend Data | (Client-side from `appData`) | N/A (Local search) | `window.appData` | `renderSearchResults()` | `#/tim-kiem` |
| Statistics | Backend Data | (Client-side from `appData`) | N/A (Derived logic) | `window.appData` | `renderHomePublicationLanding()` | Homepage |

**INTEGRATION GAPS:**
- Các endpoint API bị hardcode trực tiếp vào `app.js` (dòng 58-92).
- Search và Stats không có API riêng, dựa hoàn toàn vào việc duyệt vòng lặp (looping) tập dữ liệu khổng lồ (genealogy.json) trên RAM của trình duyệt. 

---

## 4. DEPLOYMENT CONTROL AUDIT

**DEPLOYMENT FLOW:**
`Git repository (GitHub)` → `main branch` → `Vercel Builder` → `giatoctrantrongthu.vercel.app` & `giatoctrantrongthu.com`

- **Git Repository:** `git@github.com:tuantudo/giatoctrantrongthu.git`
- **Vercel Project Config:** Nằm tại `vercel.json` (quản lý headers CORS và routing `/admin`).
- **Production Frontend URL:** `https://giatoctrantrongthu.com/` (SOURCE OF TRUTH for End Users).
- **Vercel Baseline URL:** `https://giatoctrantrongthu.vercel.app/` (Chỉ là DEPLOYED COPY / REFERENCE).
- **Backend Production URL:** `https://api.giatoctrantrongthu.com/api/` (SOURCE OF TRUTH for Data).

---

## 5. REGRESSION BOUNDARY — COMMIT 48965AE

**Audit Commit `48965ae`:**
- **Capability thay đổi:** Cấu trúc Homepage được thay bằng Editorial Publication Shell (chia cột 65/35, thêm các section Lịch/Mạch/Tư Liệu).
- **Capability giữ nguyên:** Không xóa renderer nào. Giữ nguyên 100% logic routing (`#/`, `#/gia-pha`, `#/mach`, v.v.). Giữ nguyên toàn bộ API fetch.
- **Data dependency:** Homepage hiện tại phụ thuộc chặt vào `machData` (nếu `mach.json` fetch lỗi, phần Lead Story có nguy cơ bể layout hoặc trắng trang). Phụ thuộc vào `appData.stats` để hiển thị Gia phả.
- **CSS Regression Risk:** CSS cho `img.editorial-logo` đã xoá query `(max-width: 639px)` để gộp chung vào fallback của `<picture>`, điều này an toàn nhưng nếu `<picture>` không hoạt động ở browser cũ, logo sẽ dùng `max-width: 90vw`.

---

## 6. OWNER CONTROL MODEL

**CURRENT STATE VS RECOMMENDED CONTROL SURFACE**

- **Muốn đổi Brand (Typography, Main Colors)?** 
  - *Hiện tại:* Đổi trong `manifest.json` VÀ phải đi lùng sục xóa hex codes trong `main.css`.
  - *Đề xuất:* Chỉ đổi trong `manifest.json`, xóa sạch hardcoded hex trong CSS.
- **Muốn đổi Homepage Layout?**
  - *Hiện tại:* Phải sửa HTML (`index.html`) và chọc vào code JS thao tác DOM (`app.js: renderHomePublicationLanding`).
  - *Đề xuất:* Tách hoàn toàn logic render Homepage ra khỏi `app.js`, biến nó thành static template HTML thuần nếu có thể, hoặc dùng 1 file JS riêng (`home.js`).
- **Muốn đổi Data Source / API?**
  - *Hiện tại:* Mở `app.js` và Search & Replace các chuỗi `https://api.giatoctrantrongthu.com/api/...`.
  - *Đề xuất:* Rút API base URL ra một `config.js` hoặc file `.env` (nếu có bundler).
- **Muốn kiểm tra Production Deployment?**
  - *Hiện tại:* GitHub (source) + Vercel Dashboard (build logs). Vercel.json quản lý Edge Headers.

---

## CURRENT CONTROL SURFACE

```text
OWNER
├── BRAND      → Partial (manifest.json + scripts/generate-brand-css.mjs, but overridden by main.css)
├── UI         → Highly coupled (index.html + monolithic main.css + app.js DOM manipulation)
├── DATA       → Client-side parsed (appData, machData, calEvents inside browser memory)
├── BACKEND    → Hardcoded API links (api.giatoctrantrongthu.com inside app.js)
└── DEPLOYMENT → Vercel (vercel.json controls caching and redirects)
```

## TOP 5 CONTROL GAPS

1. **Brand Bypass (UI/CSS):** 
   - *Evidence:* Hàng loạt mã hex (vd: `#1d4ed8`, `#f8fafc`) và font fallback cứng rải rác khắp `src/css/main.css`. Chủ đích của Brand Manifest bị vô hiệu hóa.
2. **Homepage DOM Coupling (UI/JS):** 
   - *Evidence:* Hàm `renderHomePublicationLanding()` trong `app.js` thao tác chèn nội dung thẳng vào `#view_home`. Owner không thể tự do thay đổi bố cục Homepage bằng HTML mà không sợ phá vỡ luồng JS.
3. **Hardcoded Production Data Integration (Data/JS):** 
   - *Evidence:* 5 lời gọi `fetch("https://api.giatoctrantrongthu.com...")` nằm chết ở đầu file `app.js`. Local dev và Production dùng chung 1 data live, rất nguy hiểm khi test.
4. **Fragile State Initialization (Data/JS):** 
   - *Evidence:* Nếu `mach.json` hoặc `genealogy.json` mất kết nối hoặc API sập, logic `if (leadStory && machData && ...)` có thể thất bại thầm lặng hoặc render sai, thiếu cơ chế Error State/Fallback UI.
5. **Monolithic CSS Namespace (UI/CSS):** 
   - *Evidence:* Tất cả style của Homepage, Publication, và App views nhồi chung vào `main.css`. Việc thêm bớt class ở Homepage dễ gây vỡ giao diện bên trong App view do không có CSS scoping/modules.
