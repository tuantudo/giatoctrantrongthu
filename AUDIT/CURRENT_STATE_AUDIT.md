# AUDIT: HIỆN TRẠNG NỀN TẢNG THIẾT KẾ & THỬ NGHIỆM VIBECODE LAB
**Mã tài liệu:** `AUDIT/CURRENT_STATE_AUDIT.md`  
**Dự án:** CÂY GIA PHẢ — GIATỘC TRẦN TRỌNG THU  
**Thẩm quyền:** Tuấn (Human Final Authority) · Emarald (Architecture & QC) · AGY (Coordination)  
**Trạng thái:** VERIFIED & BASELINE AUDIT  
**Ngày lập:** 2026-11-03  

---

## 1. MỤC TIÊU VÀ PHẠM VI KHẢO SÁT

Tài liệu này xác lập hiện trạng pháp y (forensic baseline) của hệ thống trước khi xây dựng **Human-Directed Product Design Workflow**. Khảo sát tập trung đánh giá mức độ sẵn sàng của hạ tầng mã nguồn, bề mặt UI, hệ thống điều hướng, công cụ biên tập và cơ chế kiểm thử tự động, tuân thủ nguyên tắc **chỉ ghi nhận những gì có bằng chứng thực tế (Observed Evidence)**.

---

## 2. HIỆN TRẠNG 7 BỀ MẶT GIAO DIỆN (UI SURFACES INVENTORY)

Hiện tại, mã nguồn UI System vNEXT được tổ chức tại `src/js/ui/` với 7 bề mặt trải nghiệm:

| ID Bề Mặt | Tên Bề Mặt & Route | Tệp Component | Fixture Dữ Liệu | Trạng Thái Thực Tế | Bằng Chứng Quan Sát |
| :--- | :--- | :--- | :--- | :---: | :--- |
| `public` | Cổng vào công khai (`/`) | [`public-home.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/public-home.js) | `fixtures/synthetic_profile.json` | **EXISTING** | Đầy đủ 6 khu vực định vị, câu hỏi nghiên cứu, 5 ấn phẩm công bố, MẠCH showcase, phương pháp luận và cổng vào inward gate. |
| `dashboard` | Không gian của tôi (`/me`) | [`dashboard.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/dashboard.js) | `fixtures/synthetic_profile.json` | **EXISTING** | Cụm định danh thành viên, thẻ tóm lược phả hệ, lối vào MẠCH/Clara và danh sách lối đi tiếp theo. |
| `tree` | Cây phả đồ (`/me/tree`) | [`tree.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/tree.js) | `fixtures/synthetic_tree.json` | **EXISTING** | Render 5 thế hệ dạng nhánh cây phả hệ, bộ lọc chi phái, tương tác focus nhân vật. |
| `person` | Hồ sơ nhân vật (`/me/tree/person/:id`) | [`person.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/person.js) | `fixtures/synthetic_profile.json` | **EXISTING** | Hiển thị thông tin sinh tử, thân tộc, sự kiện cuộc đời, nhãn nhận diện epistemic (dữ kiện/lời kể/diễn giải). |
| `mach` | MẠCH (`/me/mach`) | [`discourse.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/discourse.js) | `fixtures/synthetic_profile.json` | **EXISTING** | Không gian xuất bản suy tư văn hóa dòng họ, lối trình bày montage độc lập. |
| `clara` | Thư gửi Clara (`/me/clara`) | [`discourse.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/discourse.js) | `fixtures/synthetic_profile.json` | **EXISTING** | Hình thức thư từ đối thoại tâm sự gia đình, văn phong tự sự, bảo mật nghiêm ngặt. |
| `spaces` | Không gian gia đình (`/me/family-spaces`) | [`spaces.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/spaces.js) | Mock memory state | **PARTIAL** | Giao diện danh sách không gian gia đình hạt nhân; đang dùng cấu trúc placeholder chờ liên kết ReBAC. |

---

## 3. HIỆN TRẠNG CÔNG CỤ THIẾT KẾ & PROTOTYPING VIBECODE LAB

Vibecode Lab đang vận hành độc lập tại `http://localhost:8888/lab.html` thông qua tệp điều khiển trung tâm [`src/js/ui/lab.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/lab.js):

### 3.1. Các Năng Lực Đã Hoàn Thiện & Xác Minh (Verified Existing Capabilities)
1. **Device Responsive Simulator:**
   - 4 kích thước cố định: 375px (Mobile), 768px (Tablet), 1024px (Laptop), 1440px (Desktop) và chế độ 100% Fluid.
   - Khung thiết bị (device bezel frame) giả lập chân thực kích thước vật lý màn hình.
2. **State Simulator:**
   - Giả lập 4 trạng thái hệ thống: `default`, `loading`, `empty`, `error` (qua [`states.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/states.js)).
3. **Persona Simulator:**
   - 6 persona độc lập qua [`mock-adapter.js`](file:///Users/tuantq/Projects/Personal/giatoctrantrongthu/src/js/ui/mock-adapter.js): `A-HD` (Hội đồng gia tộc), `A-OB` (Trưởng ban khánh tiết), `ACTIVE` (Thành viên chính thức), `PROVISIONED` (Thành viên mới cấp mã), `UNMAPPED` (Chưa liên kết hồ sơ), `ANONYMOUS` (Khách vãng lai).
4. **Dynamic Navigation 3 Tầng (`nav-store.js`):**
   - Tách biệt rõ ràng: **Default Config** (mã nguồn/JSON), **Working Draft** (`localStorage`), **Approved Config** (phê duyệt cục bộ).
   - Modal quản lý menu riêng biệt: Đổi tên mục, đổi URL, đảo thứ tự (▲/▼), thêm/xóa mục.
   - Phân biệt chuẩn `aria-current="location"` (anchor mục) và `aria-current="page"` (route trang).
5. **Content DraftStore 3 Tầng (`draft-store.js`):**
   - Gắn `data-editable-id` ổn định, không dùng selector CSS.
   - Tự động lưu bản nháp khi gõ; bảo toàn 100% bản nháp khi đổi view hoặc F5 tải lại trang.
6. **In-page Anchor Scrolling & ScrollSpy:**
   - Cuộn mượt (`scrollIntoView`) không gây va chạm hash `#view=public`, loại bỏ triệt để hiện tượng wipe DOM.
   - `IntersectionObserver` tự động bắt vị trí cuộn thực tế để cập nhật chỉ báo active trên thanh điều hướng.

---

## 4. MA TRẬN ĐỐI CHIẾU THIẾU HỤT ĐỐI VỚI QUY TRÌNH PRODUCT DESIGN

Mặc dù Vibecode Lab đã cung cấp môi trường giả lập hiển thị mạnh mẽ, hệ thống hiện tại **vẫn thuần túy là một công cụ preview tĩnh kết hợp sửa chữ cục bộ**, hoàn toàn thiếu vắng các lớp kiến trúc cần thiết để vận hành một **Human-Directed Product Design Workflow**:

```text
[HIỆN TRẠNG: LAB PREVIEW CỤC BỘ]                    [MỤC TIÊU: HUMAN-DIRECTED DESIGN WORKFLOW]
┌─────────────────────────────────┐                 ┌─────────────────────────────────────────┐
│ • Preview 7 surface riêng lẻ    │                 │ • Quản lý User Journey xuyên suốt      │
│ • Sửa chữ DOM trực tiếp         │   KHÁC BIỆT     │ • Quản lý ma trận Touchpoints           │
│ • Persona đổi qua dropdown      │ ─────────────►  │ • Quy trình phê duyệt 5 bước (PROPOSED) │
│ • Kiểm thử thủ công bằng mắt    │   KIẾN TRÚC     │ • Mô hình phụ thuộc & Regression tự động│
│ • Chưa có khái niệm Touchpoint  │                 │ • Bàn giao sang Approved Baseline       │
└─────────────────────────────────┘                 └─────────────────────────────────────────┘
```

### Chi tiết các khoảng trống lớn:
1. **Thiếu Lớp Mô Hình Hành Trình (Journey & Touchpoint Layer):**
   - Lab chỉ biết "màn hình" (Surface), không biết người dùng bước vào từ đâu, mục tiêu là gì, trải qua những giai đoạn nhận thức nào và điểm chạm tiếp theo là gì.
2. **Thiếu Lớp Quản Trị Quyết Định (Decision Governance Layer):**
   - Mọi thay đổi trong Lab đang là "thao tác thử nghiệm", chưa gắn liền với một Đề xuất Thiết kế (Design Proposal) có mã định danh, lý do thay đổi, người phê duyệt và trạng thái vòng đời.
3. **Thiếu Lớp Phân Tích Tác Động Phụ Thuộc (Impact & Dependency Analysis):**
   - Khi sửa đổi một Shared Component (ví dụ `GlobalNav` hay `InstitutionHeader`), Lab không cảnh báo những bề mặt hay hành trình nào khác sẽ bị ảnh hưởng ngoài màn hình đang mở.
4. **Thiếu Quy Trình Kiểm Thử Hồi Quy Tập Trung (Targeted Regression QA):**
   - Hiện chỉ chạy kiểm thử tổng thể; chưa có cơ chế tự động chọn lọc các Test Case đặc thù ứng với sự thay đổi của một Touchpoint cụ thể.

---

## 5. KẾT LUẬN AUDIT

Hạ tầng kỹ thuật của Vibecode Lab hiện tại rất vững chắc về mặt **rendering sandbox, mockup adapter và draft persistence**. Đây là nền móng lý tưởng để mở rộng lên thành **Product Design Studio hoàn chỉnh** mà không cần đập đi xây lại stack công nghệ.

