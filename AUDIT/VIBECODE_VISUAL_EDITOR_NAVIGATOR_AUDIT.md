# BÁO CÁO PHÁP Y: VISUAL EDITOR & WEBSITE NAVIGATOR
**Dự án:** CÂY GIA PHẢ / GIATỘC TRẦN TRỌNG THU  
**Môi trường khảo sát:** Vibecode Lab (`http://localhost:8888/lab.html`)  
**Ngày thực hiện:** 03/11/2026  
**Cơ quan thực hiện:** AGY (Execution Coordinator / Primary Agent)  
**Thẩm quyền phê duyệt:** Tuấn (Human Final Authority)  
**Chế độ khảo sát:** STRICT READ-ONLY AUDIT  

---

## 1. TỔNG QUAN HIỆN TRẠNG (CURRENT STATE)

### 1.1. Cấu trúc Vibecode Lab (`src/js/ui/lab.js`)
Giao diện Vibecode Lab tại `http://localhost:8888/lab.html` được tổ chức thành 2 tầng độc lập:
1. **Tầng Studio Chrome bên ngoài (`#gi-lab-header`):**
   - Chứa 7 tab chuyển đổi bề mặt UI (`1. Cổng vào`, `2. Của tôi`, `3. Phả đồ`, `4. Hồ sơ`, `5. MẠCH`, `6. Thư Clara`, `7. Không gian`).
   - Chứa thanh công cụ: Bộ chọn khung hình responsive (100%, 1440px, 1024px, 768px, 375px), bộ chọn Persona (A-HD, A-OB, ACTIVE, PROVISIONED, UNMAPPED, ANONYMOUS), bộ giả lập trạng thái hệ thống (Default, Loading, Empty, 401, 403, 500) và nút chuyển chế độ **✏️ Sửa Nhanh** (BẬT / TẮT).
2. **Tầng Khung nhìn Preview bên trong (`#gi-lab-workspace`):**
   - Nạp shell ứng dụng dùng chung (`renderShell` tại `src/js/ui/shell.js`) và render trang tương ứng (`public-home.js`, `dashboard.js`, `tree.js`, `person.js`, `discourse.js`, `spaces.js`).
   - Thanh Navigator hiển thị trong Header của website preview được sinh ra từ component `GlobalNav` (`src/js/ui/components.js`) nạp dữ liệu từ mảng `PUBLIC_NAV` trong `shell.js`:
     ```text
     [ Trang chủ ] [ Vấn đề quan tâm ] [ Nội dung công bố ] [ MẠCH ] [ Phương pháp ] [ Đối thoại ] [ Thành viên → ]
     ```

### 1.2. Cơ chế Sửa Nhanh hiện tại (`enableInlineLiveEditing`)
Khi bật **✏️ Sửa Nhanh**, hàm `enableInlineLiveEditing(container)` tại `src/js/ui/lab.js:933-961` thực hiện:
- Chèn một thanh banner màu vàng phía trên preview:
  `"✏️ CHẾ ĐỘ BIÊN TẬP TRỰC QUAN ĐANG BẬT: Click trực tiếp vào các tiêu đề, đoạn văn để gõ và thử câu chữ mới. (Thử nghiệm hiển thị - Không ghi đè code)"`
- Thực thi truy vấn các thẻ:
  `const targets = container.querySelectorAll('h1, h2, h3, h4, p, .gi-card__title, .gi-card__meta, .gi-fact, .gi-masthead__nature');`
- Gán thuộc tính `contenteditable="true"` và `outline: 1px dashed #d97706` lên các thẻ trên.
- **Hoàn toàn không có bộ lưu trữ (Zero Persistence):** Không có listener bắt sự kiện gõ phím (`input`) hay mất tiêu điểm (`blur`), không có cờ đánh dấu dữ liệu đã bị sửa (dirty flag), không có bộ nhớ đệm lưu nháp (draft cache trong `localStorage` hay memory).

---

## 2. BẢNG KIỂM TRA TƯƠNG TÁC THỰC TẾ (INTERACTION TEST MATRIX)

Khảo sát được thực hiện và đối soát trực tiếp trên trình duyệt qua **Playwright Automation Engine**:

| STT | Thao Tác Kiểm Tra | Hành Vi Kỳ Vọng (Expected) | Hành Vi Thực Tế (Actual) | Trạng Thái | Bằng Chứng Pháp Y (Evidence) |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **A1** | **Click sửa tên mục Navigator** | Cho phép click vào nhãn menu (ví dụ: "Đối thoại") để gõ tên mới trực tiếp. | Không thể sửa. Con trỏ chuột không đổi thành dạng text; click vào kích hoạt hành vi chuyển trang của thẻ `<a>`. | `FAILED` | `nav a` có `contenteditable = null`. `targets` tại `lab.js:951` chỉ quét `h1..h4, p, card_title`, hoàn toàn bỏ qua thẻ liên kết `a`. |
| **A2** | **Thay đổi thứ tự mục Navigator** | Kéo thả hoặc bấm nút di chuyển trái/phải để đổi vị trí hiển thị giữa các mục. | Không có cơ chế reorder. Danh sách menu là mảng tĩnh `const PUBLIC_NAV` cố định trong code. | `FAILED` | `src/js/ui/shell.js:29-37` định nghĩa mảng hằng số `PUBLIC_NAV`. Không có UI, không có API đổi vị trí. |
| **A3** | **Thêm hoặc loại bỏ mục Navigator** | Có nút `+` để thêm mục mới và nút `✕` hoặc context menu để ẩn/xóa mục. | Không có giao diện thêm/xóa mục. Mọi thay đổi bắt buộc phải sửa code JavaScript. | `FAILED` | Toàn bộ codebase không có hàm nào quản lý danh sách menu động ngoài việc render mảng `PUBLIC_NAV`. |
| **A4** | **Chỉnh sửa liên kết/route tương ứng** | Click đúp hoặc mở modal cấu hình để đổi URL/route đích (ví dụ: `#doi-thoai` thành `/lien-he`). | Thuộc tính `href` được gán cứng từ mảng `PUBLIC_NAV`. Không có input hoặc modal nhập route. | `FAILED` | `src/js/ui/components.js:49` gán trực tiếp `href: item.href` vào DOM node. |
| **A5** | **Xác định trạng thái active của mục** | Khi cuộn tới mục nào trên trang, mục tương ứng trên Navigator phải sáng (`aria-current="page"`). | Chỉ có duy nhất mục "Trang chủ" có `aria-current="page"`. Tất cả các mục còn lại đều mang `aria-current=null`. | `FAILED` | `src/js/ui/shell.js:58-62` chỉ so sánh `item.href === current` (với `current = '/'`). Không có ScrollSpy/IntersectionObserver. |
| **B1** | **Click Navigator để chuyển đúng trang/phần** | Click "Vấn đề quan tâm" (`#van-de`) cuộn mượt đến section đó mà không làm mất trạng thái. | Click vào link khiến URL đổi thành `#van-de`. Studio Lab bắt `hashchange`, không thấy `view=`, kích hoạt `bootLab()` re-render toàn bộ `#gi-app` từ đầu, làm giật màn hình và reset về đỉnh trang. | `FAILED` | Playwright test: Hash đổi từ `#view=public` sang `#van-de`. `bootLab()` tại `lab.js:214-217` fallback về `public`, xóa sạch DOM `#gi-app`. |
| **B2** | **Duy trì Visual Editor khi chuyển trang** | Khi chuyển giữa các trang/view, cờ Sửa Nhanh vẫn bật và sẵn sàng sửa trang mới. | Cờ Sửa Nhanh vẫn hiển thị là BẬT (do lưu trong `localStorage`), nhưng toàn bộ văn bản vừa sửa ở trang trước bị xóa sạch. | `PARTIAL` | `getSavedState(STATE_KEYS.INLINE_EDIT)` giữ được trạng thái BẬT, nhưng `bootLab()` nạp lại dữ liệu gốc từ code JavaScript. |
| **B3** | **Sửa các nội dung được hỗ trợ trên trang** | Click vào các tiêu đề H1-H4, đoạn văn, thẻ bài viết để gõ câu chữ mới. | Hoạt động được trên các thẻ văn bản thông thường (`h1..h4, p, card_title`). Không hoạt động trên nút bấm (`.gi-btn`), nhãn tag (`.gi-pub-tag`), trích dẫn, ảnh. | `PARTIAL` | Selector `lab.js:951` chỉ bao phủ 8 loại thẻ; các thành phần UI khác bị khóa hoàn toàn. |
| **B4** | **Quay lại trang khác mà không mất dữ liệu** | Đang sửa Trang chủ, bấm sang Phả đồ xem, rồi bấm quay lại Trang chủ thì chữ vừa sửa vẫn còn nguyên. | **Toàn bộ nội dung vừa sửa bị mất 100%.** Giao diện nạp lại chữ gốc từ code JavaScript ban đầu. | `FAILED` | Playwright test: Sửa H1 thành `TEST_DIRTY_CONTENT`, chuyển sang `#view=tree` rồi quay về `#view=public`, H1 bị reset về `GIA TỘC TRẦN TRỌNG THU`. |
| **B5** | **Phân biệt nội dung đang sửa vs chỉ hiển thị** | Hiển thị rõ ràng khối nào đang được sửa (có viền dirty, icon bút chì), khối nào là dữ liệu hệ thống chỉ đọc. | Chỉ có một viền nét đứt màu cam `1px dashed #d97706` gắn lên mọi thẻ trong selector. Không phân biệt thẻ đã sửa vs chưa sửa; không có chỉ báo Read-only. | `PARTIAL` | `lab.js:956-958` chỉ set inline style cơ bản; không có hệ thống visual state indicators (dirty, pristine, locked). |

---

## 3. NGUYÊN NHÂN GỐC RỄ Ở MỨC MÃ NGUỒN (ROOT CAUSE ANALYSIS)

### Nguyên nhân 1 (RC-01): Selector Sửa Nhanh cố tình bỏ qua Navigation Links
- **Vị trí file:** [`src/js/ui/lab.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/lab.js#L950-L960)
- **Đoạn mã gây lỗi:**
  ```javascript
  // Targets: headings, paragraphs, card titles, fact rows
  const targets = container.querySelectorAll('h1, h2, h3, h4, p, .gi-card__title, .gi-card__meta, .gi-fact, .gi-masthead__nature');
  targets.forEach(el => {
    if (el.closest('#gi-lab-header') || el.closest('#gi-lab-reading-bar') || el.closest('#gi-lab-person-toolbar')) return;
    el.setAttribute('contenteditable', 'true');
    ...
  });
  ```
- **Hệ quả:** Thẻ `<a class="gi-nav__link">` hoàn toàn không nằm trong `targets`. Thẻ `<a>` vẫn giữ nguyên thuộc tính liên kết trình duyệt và không thể nhận tiêu điểm (focus) nhập liệu văn bản.

### Nguyên nhân 2 (RC-02): Cấu hình Navigator bị Hardcode tĩnh trong Code logic
- **Vị trí file:** [`src/js/ui/shell.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/shell.js#L29-L37)
- **Đoạn mã gây lỗi:**
  ```javascript
  const PUBLIC_NAV = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Vấn đề quan tâm', href: '#van-de' },
    { label: 'Nội dung công bố', href: '#noi-dung' },
    { label: 'MẠCH', href: '#mach' },
    { label: 'Phương pháp', href: '#nguon-goc' },
    { label: 'Đối thoại', href: '#doi-thoai' },
    { label: 'Thành viên →', href: '/login', title: 'Cổng không gian thành viên dòng họ' }
  ];
  ```
- **Hệ quả:** Dữ liệu thanh Navigator không được nạp từ tệp cấu hình JSON (`config/navigation.json`) hay bộ lưu trữ CMS/Database nào. Mọi thao tác đổi tên, đổi thứ tự, thêm hoặc xóa mục đều **bất khả thi nếu không mở file code `shell.js` ra sửa bằng tay**.

### Nguyên nhân 3 (RC-03): Xung đột chết người giữa Hash Routing của Studio và Anchor Links của Trang
- **Vị trí file:** [`src/js/ui/lab.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/lab.js#L214-L217) & [`src/js/ui/lab.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/lab.js#L966-L1010)
- **Đoạn mã gây lỗi:**
  ```javascript
  // 1. Phân tích hash trong lab.js
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const currentViewId = hashParams.get('view') || 'public';
  
  // 2. Bộ chặn điều hướng bỏ qua anchor links
  function attachNavigationInterception(container) {
    container.addEventListener('click', (e) => {
      ...
      // Bỏ qua anchor hashes, không gọi e.preventDefault()
      if (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('/mirror.html')) return;
      ...
      // Không có code xử lý cho href="#van-de", href="#noi-dung", v.v.
    });
  }
  
  // 3. Listener hashchange kích hoạt bootLab()
  window.addEventListener('hashchange', () => bootLab());
  ```
- **Hệ quả:**
  1. Khi Tuấn click vào link `Vấn đề quan tâm` (`href="#van-de"`), trình duyệt đổi URL từ `lab.html#view=public` thành `lab.html#van-de`.
  2. Sự kiện `hashchange` được kích hoạt ➔ gọi hàm `bootLab()`.
  3. Trong `bootLab()`, `new URLSearchParams('van-de').get('view')` trả về `null`!
  4. Hệ thống rơi vào fallback: `currentViewId = 'public'`.
  5. `bootLab()` xóa sạch toàn bộ màn hình (`host.innerHTML = ''`), nạp lại mã nguồn gốc từ đầu, làm gián đoạn việc cuộn trang và xóa sạch toàn bộ văn bản đang sửa nháp!

### Nguyên nhân 4 (RC-04): Hoàn toàn không có Lớp lưu trữ Nháp (Draft Cache Store)
- **Vị trí file:** [`src/js/ui/lab.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/lab.js)
- **Thực tế:** Chế độ Sửa Nhanh được xây dựng như một tính năng minh họa thị giác tạm thời ("Thử nghiệm hiển thị - Không ghi đè code"). Khi người dùng gõ vào thẻ có `contenteditable="true"`, trình duyệt chỉ thay đổi DOM node tại bộ nhớ RAM của trang hiện tại. Không có bộ lắng nghe sự kiện để lưu dữ liệu vào `localStorage` hay cấu trúc dữ liệu nháp. Khi chuyển trang (chuyển view), hàm `bootLab()` hủy DOM cũ và tạo DOM mới từ mã nguồn JavaScript, dẫn đến việc mất sạch 100% dữ liệu đã chỉnh sửa.

### Nguyên nhân 5 (RC-05): Thuật toán so khớp Active Nav không hỗ trợ In-page Sections
- **Vị trí file:** [`src/js/ui/shell.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/shell.js#L58-L63)
- **Đoạn mã gây lỗi:**
  ```javascript
  function navItemsFor(audience, pathname) {
    const items = audience === 'member' ? MEMBER_NAV : PUBLIC_NAV;
    const current = pathname || '/';
    return items.map(item => ({
      ...item,
      current: item.href === current
        || (current.startsWith(`${item.href}/`) && item.href !== '/')
    }));
  }
  ```
- **Hệ quả:** Biến `current` luôn là `'/'` trong Public Space. Các mục `#van-de`, `#noi-dung`, `#mach` không bao giờ bằng `'/'`, do đó `item.current` luôn là `false`. Website thiếu hoàn toàn cơ chế ScrollSpy (IntersectionObserver) để nhận biết người dùng đang cuộn tới khu vực nào trên trang.

---

## 4. MA TRẬN KHOẢNG CÁCH NĂNG LỰC (CAPABILITY GAP MATRIX)

| Năng Lực Cần Thiết | Đang Có Trong Hệ Thống | Còn Thiếu (Capability Gap) | Mức Độ Nghiêm Trọng |
| :--- | :--- | :--- | :---: |
| **Quản lý Danh mục Menu (CRUD Menu)** | Chỉ có mảng tĩnh `const PUBLIC_NAV` trong `shell.js`. | Thiếu nguồn dữ liệu cấu hình ngoài (`config/navigation.json`), thiếu UI thêm/xóa/đổi tên/đổi link menu. | **Rất cao (Blocker cho Tuấn)** |
| **Sắp xếp thứ tự Menu (Reorder Menu)** | Không có. | Thiếu cơ chế kéo thả hoặc nút dịch chuyển thứ tự mục trên thanh Navigator. | **Cao** |
| **Chuyển trang mượt mà trong Lab** | Có chuyển được qua các tab ngoài của Lab (`#view=tree`, `#view=mach`). | Thanh Navigator bên trong preview bị xung đột hash (`#van-de` ghi đè `#view=public` gây crash reload). | **Rất cao (Lỗi tương tác)** |
| **Lưu nháp nội dung khi chuyển trang** | Không có. Khi chuyển trang là mất sạch dữ liệu đã gõ. | Thiếu `DraftStore` lưu tạm nội dung chỉnh sửa vào `localStorage` theo từng `section_id` / `element_id`. | **Rất cao (Làm mất công sức)** |
| **Xuất / Lưu nội dung chỉnh sửa** | Không có. | Thiếu nút "Lưu thay đổi" (Save Draft / Export JSON) để trích xuất nội dung Tuấn đã duyệt thành cấu hình chính thức. | **Cao** |
| **Chỉ báo trực quan trạng thái sửa** | Có viền cam nét đứt cơ bản (`outline: 1px dashed #d97706`). | Thiếu chỉ báo phân biệt nội dung đã bị sửa (Dirty), nội dung hệ thống chỉ đọc (Read-only), và nút Hoàn tác (Undo). | **Trung bình** |

---

## 5. ĐỀ XUẤT PHƯƠNG ÁN ĐIỀU CHỈNH TỐI THIỂU (RECOMMENDED FIX)
*(Chỉ đề xuất kiến trúc, TUYỆT ĐỐI KHÔNG sửa code ở bước này)*

Để Tuấn có thể thao tác quản trị trực quan mà không cần can thiệp file mã nguồn, đề xuất kiến trúc tinh gọn gồm 4 bước:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        VIBECODE LAB STUDIO                             │
│                                                                        │
│  [Thanh Công Cụ Lab]                                                   │
│   ├── Nút: [✏️ Sửa Nhanh: BẬT]                                         │
│   ├── Nút Mới: [⚙️ Sửa Menu Navigator]  <── (Giải quyết Nhóm A)        │
│   └── Nút Mới: [💾 Lưu Nháp] [⟲ Hoàn Tác] [📤 Xuất JSON] <── (Nhóm B)   │
│                                                                        │
│  [Khung Preview Trang]                                                 │
│   ├── Header Navigator (Đọc từ DraftStore / config/navigation.json)    │
│   │    └── Click anchor: Cuộn mượt (smoothScrollTo), KHÔNG reload DOM   │
│   │                                                                    │
│   └── Nội dung Trang (h1, p, card, btn, tags...)                       │
│        ├── Gõ trực tiếp ➔ Lưu tức thì vào DraftStore (localStorage)   │
│        ├── Chuyển sang trang khác ➔ Dữ liệu cũ vẫn được bảo tồn        │
│        └── Quay lại ➔ Tự động phục hồi nguyên vẹn nội dung vừa gõ     │
└────────────────────────────────────────────────────────────────────────┘
```

### Chi tiết 4 giải pháp đề xuất:

1. **Giải pháp A1: Tách cấu hình Navigator thành Bộ Nhớ Động (Dynamic Nav Store):**
   - Thay vì hardcode `const PUBLIC_NAV` trong `shell.js`, chuyển sang đọc từ một `NavStore` có khởi tạo mặc định, cho phép lưu trữ và ghi đè qua `localStorage`.
   - Bổ sung nút **"⚙️ Sửa Navigator"** trên thanh công cụ Lab: Khi bấm vào, các mục menu chuyển sang chế độ chỉnh sửa (hiển thị ô input sửa tên, nút mũi tên `←` `→` đổi thứ tự, nút `+` thêm mục, và nút `✕` xóa mục).

2. **Giải pháp A2: Giải quyết dứt điểm Xung đột Routing Hash trong Lab:**
   - Trong `src/js/ui/lab.js`: Khi bắt được click vào liên kết anchor dạng `href="#van-de"`, hàm `attachNavigationInterception` phải gọi `e.preventDefault()`, sau đó gọi `document.getElementById('van-de')?.scrollIntoView({ behavior: 'smooth' })`.
   - Cập nhật hash thành định dạng lồng an toàn: `#view=public&section=van-de` để không làm mất tham số `view=public` của Lab.
   - Thêm `IntersectionObserver` (ScrollSpy) để khi phần tử `#van-de` nằm trong viewport thì mục `Vấn đề quan tâm` trên menu tự động nhận `aria-current="page"`.

3. **Giải pháp B1: Thiết lập Lớp Lưu Nháp Nội Dung (DraftStore Engine):**
   - Xây dựng một cơ chế định danh phần tử duy nhất (qua `data-editable-id` hoặc selector path).
   - Khi bật Sửa Nhanh, mỗi lần người dùng gõ phím (`input` / `blur`), nội dung mới tự động được ghi vào `localStorage.getItem('giatoc_lab_drafts')`.
   - Khi chuyển trang sang `#view=tree` rồi quay về `#view=public`, hàm `renderPublicHome` sẽ kiểm tra `DraftStore`: nếu phần tử có bản nháp lưu tạm, nó sẽ nạp nội dung của bản nháp thay vì nội dung hardcoded gốc.

4. **Giải pháp B2: Bổ sung Bảng điều khiển Quản trị Nháp (Draft Action Bar):**
   - Hiển thị thanh trạng thái nhỏ phía dưới góc màn hình khi có nội dung bị sửa:
     - Thống kê: *"Đã sửa 3 vị trí (Chưa xuất bản)"*.
     - Nút **[⟲ Hoàn tác]**: Xóa nháp, khôi phục nguyên trạng mã nguồn ban đầu.
     - Nút **[📤 Xuất file cấu hình]**: Tải về tệp `publication_draft.json` để đồng bộ chính thức vào hệ thống mà không cần lập trình viên gõ lại code.

---

## 6. KẾ HOẠCH KIỂM THỬ XÁC NHẬN (VERIFICATION PLAN)

Sau khi Tuấn phê duyệt phương án điều chỉnh, các kịch bản kiểm thử sau sẽ được chạy tự động qua Playwright để nghiệm thu:

1. **Test Case TC-NAV-01 (Sửa tên mục Menu):**
   - Bật Sửa Navigator ➔ Đổi tên "Đối thoại" thành "Góp ý & Đối thoại" ➔ Xác nhận tên menu đổi tức thì trên preview.
2. **Test Case TC-NAV-02 (Đổi thứ tự mục Menu):**
   - Di chuyển mục "MẠCH" lên trước "Vấn đề quan tâm" ➔ Xác nhận DOM của `ul.gi-nav__list` thay đổi thứ tự đúng.
3. **Test Case TC-NAV-03 (Chuyển mục không reload trang):**
   - Click "Nội dung công bố" (`#noi-dung`) ➔ Xác nhận màn hình cuộn mượt đến `#noi-dung`, URL hash giữ vững `view=public`, và không có hiện tượng giật reload DOM.
4. **Test Case TC-PERSIST-01 (Bảo tồn nội dung khi chuyển trang):**
   - Sửa tiêu đề H1 trên Trang chủ ➔ Bấm chuyển sang `#view=tree` (Cây phả đồ) ➔ Bấm quay lại `#view=public` (Trang chủ) ➔ Xác nhận tiêu đề H1 đã sửa vẫn hiển thị nguyên vẹn.
5. **Test Case TC-DIFF-01 (Hoàn tác và Khôi phục):**
   - Bấm nút "⟲ Hoàn tác" ➔ Xác nhận toàn bộ văn bản trở về giá trị mặc định ban đầu của dự án.

---
*Báo cáo được lập ở chế độ nghiêm ngặt READ-ONLY. Không có bất kỳ thay đổi nào được thực hiện trên mã nguồn hoặc cơ sở dữ liệu.*  
*Hệ thống dừng lại tại đây chờ quyết định và chỉ thị thực thi từ Tuấn.*

