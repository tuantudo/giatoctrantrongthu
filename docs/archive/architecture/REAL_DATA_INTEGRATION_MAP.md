# REAL DATA INTEGRATION MAP
**Project:** giatoctrantrongthu
**Goal:** Map existing real data pipelines to the new Publication UI and identify gaps caused by recent redesigns.

---

## 1. REAL DATA SOURCES

Toàn bộ hệ thống hiện lấy dữ liệu thật từ các endpoint của backend production (`https://api.giatoctrantrongthu.com/api/`):

- **Gia Phả (Nhân vật, Gia đình, Quan hệ):** `genealogy.json`
- **MẠCH (Bài viết, Series, Tác giả):** `mach.json`
- **Lịch (Sự kiện, Ngày giỗ, Bổn mạng):** `calendars/CAL_*.ics` (4 feeds)
- **Tư Liệu (Media, Ảnh chân dung, Ảnh lưu trữ):** `media.json` và `person_media.json`

---

## 2. EXISTING FRONTEND DATA PIPELINES

Frontend (`src/js/app.js`) đã có sẵn luồng nạp (loader) và lưu trữ trạng thái (state) cho các nguồn này:

1. **Pipeline Gia Phả:**
   - *Loader:* `fetch("...genealogy.json")`
   - *State:* `window.appData` (chứa `people`, `families`, `memories`, `stats`).
   - *Renderers cũ:* `renderPerson()`, `renderGenealogyGraph()`, `renderMemories()`.

2. **Pipeline MẠCH:**
   - *Loader:* `fetch("...mach.json")`
   - *State:* `window.machData` (chứa `articles`, `series`, `media`).
   - *Renderers cũ:* `renderMachModule()`, `renderArticleDetail()`.

3. **Pipeline Lịch:**
   - *Loader:* `loadCalendarFeeds()` (nạp 4 file ICS).
   - *State:* `window.calEvents` (đã qua ICS Parser).
   - *Renderers cũ:* `renderCalendarView()`, `renderSidebarCalendar()`.

4. **Pipeline Tư Liệu:**
   - *Loader:* `fetch("...media.json")`
   - *State:* `window.mediaDb.assets`
   - *Tình trạng thực tế:* JSON chỉ chứa `assetId`, `sha256`, `mimeType`, `file` (URL), nhưng KHÔNG HỀ CÓ semantic metadata như `Title`, `Description`, `Date`, `Category`. 

---

## 3. NEW PUBLICATION UI MAPPING

Bảng đối chiếu UI Module trên Homepage mới với Data Pipeline hiện có:

| UI Module | Current implementation | Real source exists? | Existing loader | Existing renderer | Status | Missing piece |
|---|---|---|---|---|---|---|
| **Lead MẠCH** | Dynamic JS (`app.js`) | YES | `mach.json` | `renderHomePublicationLanding()` | **REAL DATA CONNECTED** | N/A |
| **MẠCH Section** | Dynamic JS (First 3) | YES | `mach.json` | `renderHomePublicationLanding()` | **REAL DATA CONNECTED** | N/A |
| **Lịch Sidebar** | Dynamic JS | YES | `CAL_*.ics` | `renderSidebarCalendar()` | **REAL DATA CONNECTED** | N/A |
| **Gia Phả Stats**| Dynamic JS | YES | `genealogy.json` | `renderHomePublicationLanding()` | **REAL DATA CONNECTED** | N/A |
| **Tư Liệu Gốc** | HTML Placeholder | YES (Assets) | `media.json` | N/A | **NO SUFFICIENT REAL DATA — PLACEHOLDER JUSTIFIED** | Thiếu Metadata (Tên, nội dung, bối cảnh lịch sử) từ backend. Không thể render gallery thật. |
| **Search** | Global function | YES | N/A (Client) | `runSearchPage()` | **REAL DATA EXISTS — NOT CONNECTED TO MASTHEAD** | Nút Search cần gọi được `navigateRoute('/tim-kiem')`. |

---

## 4. MISSING INTEGRATION GAPS (COMMIT 48965AE AUDIT)

Khi đối chiếu commit `48965ae` với trước đó, việc đắp Homepage Publication Shell mới đã vô tình làm MẤT một số capability đang xài data thật:

1. **Mất module "Ký ức tiền nhân" (Human Memory Spotlight):**
   - *Trước 48965ae:* Trang chủ có module Spotlight lấy dữ liệu thật từ `appData.memories[0]` (bài ghi chép về Bà Sa/Cụ Thư).
   - *Sau 48965ae:* Bị xóa sạch khỏi DOM và JS. Dữ liệu này hiện đang có sẵn trong `appData.memories` nhưng Homepage mới không dùng. Dán nhãn: **DATA ALREADY AVAILABLE IN FRONTEND — NEW UI NOT CONSUMING IT**.

2. **Mất logic Đếm Số Thế Hệ (Generations):**
   - *Trước 48965ae:* Hàm `deriveFamilyGraphGenerations()` tính toán ra `window.maxDerivedGenLevel` và hiển thị "với 5 thế hệ tiếp nối".
   - *Sau 48965ae:* Bị xóa khỏi Homepage, chỉ còn số liệu Individuals và Families tĩnh.

---

## 5. IMPLEMENTATION HANDOFF FOR CLINE

**@Cline:** Đây là task implementation dành cho bạn. Bạn phải phục hồi các luồng dữ liệu thật đã bị mất và đấu nối các thành phần còn thiếu, tuân thủ tuyệt đối quy tắc KHÔNG tạo data giả.

### Nhiệm vụ 1: Phục hồi Module "Ký ức tiền nhân"
- **Source:** `appData.memories` (từ `genealogy.json`).
- **Existing State:** Đã nạp sẵn trong bộ nhớ.
- **Yêu cầu:** Thêm một module "KÝ ỨC & GHI CHÉP" vào `index.html` (dưới phần MẠCH). Mở `app.js` -> `renderHomePublicationLanding()`, viết lại logic lấy `appData.memories[0]`, lấy title, excerpt (khoảng 200 chữ) và render vào DOM. Nút "Đọc tiếp" trỏ về `#/gia-pha/ky-uc`.

### Nhiệm vụ 2: Giữ nguyên Placeholder Tư Liệu
- **Bối cảnh:** Dữ liệu media có tải về nhưng metadata rỗng (chỉ có URL hình, không có semantic info).
- **Yêu cầu:** Giữ nguyên div `.tu-lieu-placeholder` trong `index.html`. Tuyệt đối không tạo fake JSON array hay fake API. Việc này chờ Backend xử lý.

### Nhiệm vụ 3: Đấu nối Nút Tìm Kiếm
- **Source:** Thanh Utility/Header Navigation.
- **Existing loader:** `appData` (dùng để search).
- **Existing renderer:** `runSearchPage()`
- **Yêu cầu:** Gắn sự kiện `onclick="navigateRoute('/tim-kiem')"` vào nút Search trên thanh điều hướng để user có thể vào giao diện tìm kiếm thật, thay vì để nút chết.
