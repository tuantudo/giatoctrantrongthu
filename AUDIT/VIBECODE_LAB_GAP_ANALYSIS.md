# PHÂN TÍCH KHOẢNG TRỐNG NĂNG LỰC VIBECODE LAB
# (VIBECODE LAB CAPABILITY GAP ANALYSIS)

**Mã tài liệu:** `AUDIT/VIBECODE_LAB_GAP_ANALYSIS.md`  
**Dự án:** CÂY GIA PHẢ — GIATỘC TRẦN TRỌNG THU  
**Thẩm quyền:** Tuấn (Human Final Authority) · Emarald (Architecture & QC) · AGY (Execution Coordinator)  
**Phân loại:** Phân tích kỹ thuật đối chiếu (Forensic Gap Mapping)  
**Ngày lập:** 2026-11-03  

---

## 1. MỤC TIÊU VÀ NGUYÊN TẮC PHÂN LOẠI

Tài liệu này đối chiếu chi tiết giữa **Kiến trúc Quy trình Thiết kế Sản phẩm do Con người Định hướng** (`HUMAN_DIRECTED_DESIGN_WORKFLOW.md`) và **Hiện trạng triển khai thực tế của Vibecode Lab** (`lab.html`, `lab.js`).

Mọi năng lực đều được đánh giá nghiêm ngặt theo 5 trạng thái:
- `EXISTING`: Đã có sẵn trong mã nguồn và đã được kiểm chứng hoạt động bằng bằng chứng định lượng.
- `REUSABLE`: Đã có nền tảng cơ sở trong mã nguồn, có thể tái sử dụng và mở rộng mà không cần viết mới từ đầu.
- `PARTIAL`: Đã triển khai một phần nhưng chưa đáp ứng đầy đủ yêu cầu của quy trình thiết kế khép kín.
- `GAP`: Hoàn toàn chưa tồn tại trong mã nguồn hiện hành, cần được thiết kế và bổ sung mới.
- `UNKNOWN`: Chưa đủ bằng chứng để xác minh tính ổn định hoặc khả thi trong ngữ cảnh hiện tại.

---

## 2. MA TRẬN ĐỐI CHIẾU CHI TIẾT THEO 7 KHỐI CHỨC NĂNG

### Khối 1: Journey Studio (Quản Lý Hành Trình Trải Nghiệm)

| Năng Lực Cần Thiết | Hiện Trạng Vibecode Lab | Phân Loại | Bằng Chứng Mã Nguồn & Đánh Giá Chi Tiết |
| :--- | :--- | :---: | :--- |
| **Khai báo danh mục User Journeys** | Chưa có khái niệm User Journey; Lab chỉ quản lý danh sách tĩnh `LAB_SURFACES` (7 bề mặt đơn lẻ). | `GAP` | Cần bổ sung registry `journey-store.js` chứa danh mục các hành trình (`JRN-01`, `JRN-02`...). |
| **Phân chia các giai đoạn Journey Phases** | Không có; người dùng chỉ có thể nhảy trực tiếp vào từng trang thông qua hash `#view=...`. | `GAP` | Cần cấu trúc dữ liệu mô tả các pha: Định vị → Tìm hiểu → Khám phá sâu → Chuyển đổi. |
| **Gắn User Goal & Expected Outcome** | Không có; chưa có siêu dữ liệu mô tả mục tiêu của người dùng tại từng bước. | `GAP` | Cần tích hợp hiển thị mục tiêu người dùng trên Studio Ribbon. |
| **Xác lập Pain Points trên hành trình** | Không có trường lưu vết các điểm nghẽn trải nghiệm. | `GAP` | Cần bổ sung trường dữ liệu phục vụ nghiên cứu UX. |

---

### Khối 2: Touchpoint Manager (Quản Lý Điểm Chạm)

| Năng Lực Cần Thiết | Hiện Trạng Vibecode Lab | Phân Loại | Bằng Chứng Mã Nguồn & Đánh Giá Chi Tiết |
| :--- | :--- | :---: | :--- |
| **Định danh điểm chạm (Touchpoint Registry)** | Đã có một phần: Các khối giao diện trên Public Home đã được gắn `data-section` và `data-editable-id`. | `PARTIAL` | [`public-home.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/public-home.js) đã có `pub.hero.title`, `pub.vande.title`... nhưng chưa được mô hình hóa thành một Touchpoint Entity độc lập gắn với Journey. |
| **Ma trận Persona × System State** | Đã có dropdown chọn Persona (6 persona) và chọn State (`default`, `loading`, `empty`, `error`). | `EXISTING` | Đã triển khai và hoạt động trơn tru trong [`lab.js#L480-L515`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/lab.js#L480-L515) kết hợp [`mock-adapter.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/mock-adapter.js) và [`states.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/states.js). |
| **Kiểm soát ranh giới bảo mật (Privacy Boundary)** | Đã hiển thị ContextBar trên Member surfaces (`Cấp / Không gian / Dữ liệu`). | `REUSABLE` | Có thể kế thừa [`contexts.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/contexts.js) và [`visibility.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/visibility.js) để gắn thẻ bảo mật cho từng Touchpoint. |
| **Tiêu chuẩn nghiệm thu từng điểm chạm** | Chưa có; chưa có checklist nghiệm thu gắn liền với từng Touchpoint trong Lab. | `GAP` | Cần bổ sung UI hiển thị Acceptance Criteria checklist cho Tuấn kiểm tra. |

---

### Khối 3: Experience Designer (Biên Tập & Thử Nghiệm Trực Quan)

| Năng Lực Cần Thiết | Hiện Trạng Vibecode Lab | Phân Loại | Bằng Chứng Mã Nguồn & Đánh Giá Chi Tiết |
| :--- | :--- | :---: | :--- |
| **Sửa chữ trực quan với DraftStore** | Đã có chế độ Sửa Nhanh, gắn `contenteditable`, tự động lưu vào `DraftStore` theo `data-editable-id`. | `EXISTING` | Đã kiểm chứng qua 13 test cases Playwright; bảo toàn 100% bản nháp khi reload hoặc đổi view. |
| **Bảng cấu hình Navigator riêng biệt** | Đã có Modal quản lý Navigator 3 tầng cấu hình (Default, Working Draft, Approved). | `EXISTING` | Nút `#gi-btn-open-nav-modal` mở modal cho phép sửa tên, đổi link, đổi thứ tự, thêm/xóa mục. |
| **So sánh phương án trực quan (A/B Diff)** | Chưa có chế độ xem song song (Side-by-side) giữa bản gốc và bản đang đề xuất. | `PARTIAL` | Hiện chỉ có nút "Xuất JSON Diff" dạng chuỗi văn bản, chưa có giao diện so sánh trực quan (Visual Split View). |
| **Token Explorer (Typography / Spacing)** | Đã có nút chỉnh cỡ chữ đọc (bình thường / lớn / nhỏ) và bộ chọn Typography token. | `REUSABLE` | Kế thừa [`tokens.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/tokens.js) để mở rộng thành thanh điều chỉnh font và khoảng cách trực tiếp. |

---

### Khối 4: Interactive Preview (Mô Phỏng Trực Quan Tương Tác)

| Năng Lực Cần Thiết | Hiện Trạng Vibecode Lab | Phân Loại | Bằng Chứng Mã Nguồn & Đánh Giá Chi Tiết |
| :--- | :--- | :---: | :--- |
| **Mô phỏng 7 Bề Mặt UI vNEXT** | Đầy đủ 7 bề mặt: public, dashboard, tree, person, mach, clara, spaces. | `EXISTING` | `LAB_SURFACES` trong `lab.js` nạp đầy đủ components và mock synthetic fixtures sạch. |
| **Mô phỏng 4 kích thước Responsive thực tế** | Đã có Device Frame hỗ trợ 375px, 768px, 1024px, 1440px và Fluid. | `EXISTING` | Khung thiết bị kèm thông số viewport trong [`lab.js#L260-L300`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/lab.js#L260-L300). |
| **Điều hướng nội bộ mượt mà (Smooth Scroll)** | Đã xử lý chặn va chạm hash routing, cuộn mượt và đồng bộ ScrollSpy. | `EXISTING` | Đã kiểm chứng không làm mất DOM khi click anchor section `#van-de`, `#noi-dung`... |
| **Mô phỏng dòng tương tác liên hoàn (User Flow)** | Chưa có; người dùng chỉ có thể duyệt tự do, chưa có nút "Tiếp bước tiếp theo trong hành trình". | `GAP` | Cần bổ sung thanh điều hướng dòng chảy (Journey Stepper Ribbon: Bước 1 ──► Bước 2 ──► Bước 3). |

---

### Khối 5: Dependency & QA (Quản Lý Phụ Thuộc & Kiểm Thử Hồi Quy)

| Năng Lực Cần Thiết | Hiện Trạng Vibecode Lab | Phân Loại | Bằng Chứng Mã Nguồn & Đánh Giá Chi Tiết |
| :--- | :--- | :---: | :--- |
| **Danh mục thành phần dùng chung (Shared Components)** | Đã tách các component dùng chung vào `components.js` và `shell.js`. | `REUSABLE` | `GlobalNav`, `InstitutionHeader`, `Breadcrumb`, `Footer`, `Section`, `Card` đã là các module độc lập. |
| **Phân tích tác động thay đổi (Impact Analysis)** | Chưa có; khi sửa một component, Lab không thông báo những màn hình nào khác bị ảnh hưởng. | `GAP` | Cần xây dựng bản đồ quan hệ Component ↔ Touchpoint để cảnh báo rủi ro tức thì. |
| **Chọn lọc Test Case hồi quy có chủ đích** | Đã có kịch bản Playwright kiểm thử 13 ca kiểm thử tổng thể. | `PARTIAL` | Kịch bản hiện tại chạy thủ công qua Playwright; chưa có cơ chế kích hoạt test hồi quy tự động theo từng Touchpoint bị sửa. |

---

### Khối 6: Decision Log (Nhật Ký Quyết Định Thiết Kế)

| Năng Lực Cần Thiết | Hiện Trạng Vibecode Lab | Phân Loại | Bằng Chứng Mã Nguồn & Đánh Giá Chi Tiết |
| :--- | :--- | :---: | :--- |
| **Lưu vết 3 tầng cấu hình (Default / Draft / Approved)** | Đã có trong `nav-store.js` và `draft-store.js`. | `EXISTING` | Phân định rạch ròi bản nháp đang sửa và bản đã phê duyệt thông qua LocalStorage. |
| **Nhật ký quyết định có cấu trúc (Decision Entity)** | Chưa có tệp quản lý lịch sử quyết định riêng biệt (Ai đề xuất, Tuấn duyệt ngày nào, lý do gì). | `GAP` | Cần bổ sung `decision-store.js` lưu trữ danh sách các Decision Records có mã định danh. |
| **Khả năng hoàn tác / khôi phục từng quyết định** | Đã có nút "Revert All" và "Reset to Default" cho toàn bộ nháp. | `PARTIAL` | Chưa hỗ trợ hoàn tác có chọn lọc từng quyết định riêng lẻ (Granular Decision Rollback). |

---

### Khối 7: Product Review & Baseline Management (Nghiệm Thu Sản Phẩm)

| Năng Lực Cần Thiết | Hiện Trạng Vibecode Lab | Phân Loại | Bằng Chứng Mã Nguồn & Đánh Giá Chi Tiết |
| :--- | :--- | :---: | :--- |
| **Bảng tổng hợp tiến độ hoàn thành Touchpoints** | Chưa có giao diện tổng quan (Overview Dashboard) thống kê bao nhiêu % Touchpoint đã duyệt. | `GAP` | Cần xây dựng màn hình Product Review Dashboard cho Tuấn và Emarald. |
| **Cơ chế đóng băng bản chuẩn (Baseline Freezing)** | Đã có hàm xuất JSON cấu hình của Nav và Draft. | `PARTIAL` | Cần chuẩn hóa thành một gói đóng gói duy nhất (`Export Complete Approved Product Baseline JSON`). |

---

## 3. TỔNG HỢP NĂNG LỰC & ĐỊNH HƯỚNG BÙ ĐẮP KHOẢNG TRỐNG

```text
TỔNG SỐ NĂNG LỰC KHẢO SÁT: 22 NĂNG LỰC
┌────────────────────────────┬─────────────┬─────────────┐
│ Phân loại                  │ Số lượng    │ Tỷ lệ (%)   │
├────────────────────────────┼─────────────┼─────────────┤
│ EXISTING (Đã có & Đạt)     │ 8 năng lực  │ 36.4%       │
│ REUSABLE (Tái sử dụng tốt) │ 3 năng lực  │ 13.6%       │
│ PARTIAL (Có một phần)      │ 4 năng lực  │ 18.2%       │
│ GAP (Cần bổ sung mới)      │ 7 năng lực  │ 31.8%       │
│ UNKNOWN (Chưa rõ)          │ 0 năng lực  │ 0.0%        │
└────────────────────────────┴─────────────┴─────────────┘
```

### Chiến Lược Bù Đắp Khoảng Trống (Gap Closure Strategy):
1. **Tận dụng tối đa 50% nền tảng đã có:** Không viết lại những gì đã chạy ổn định (`lab.js`, `nav-store.js`, `draft-store.js`, responsive frame simulator, mock personas).
2. **Tập trung vào 4 khoảng trống kiến trúc then chốt:**
   - Xây dựng mô hình dữ liệu **Journey & Touchpoint**.
   - Xây dựng **Impact Analysis Engine** dựa trên bản đồ phụ thuộc component.
   - Xây dựng **Decision Log Entity & UI Panel**.
   - Xây dựng **Product Review Dashboard**.

